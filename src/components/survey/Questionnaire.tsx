import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Typography,
  Card,
  Progress,
  Alert,
  Modal,
  notification,
  Row,
  Col,
  Divider,
  Space,
  Badge,
} from "antd";
import {
  ExportOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  BankOutlined,
  MailOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { RadioGroup } from "./RadioGroup";
import {
  QuestionnaireFormData,
  RadioOption,
  NdaDetails,
} from "../../types/survey";
import { surveyApi } from "../../services/api";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import useSurveyStorage from "../../utils/hooks/useSurveyStorage";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface FormValues {
  bankName?: string;
  fillDate?: Dayjs;
  contactPersonName?: string;
  contactPersonPosition?: string;
  contactPersonEmail?: string;
  additionalComments?: string;
  [key: string]: string | Dayjs | undefined;
}

interface QuestionnaireProps {
  ndaDetails?: NdaDetails;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ ndaDetails }) => {
  const [form] = Form.useForm<FormValues>();
  const [formData, setFormData] = useState<QuestionnaireFormData>({});
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [exportData, setExportData] = useState<string>("");
  const [copyMessage, setCopyMessage] = useState<string>("");
  const [questionnaireProgress, setQuestionnaireProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>("");

  // Handle text input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    calculateProgress({ ...formData, [name]: value });
  };

  // Handle date change
  const handleDateChange = (date: Dayjs | null) => {
    const dateValue = date ? date.format("YYYY-MM-DD") : "";
    setFormData((prev) => ({
      ...prev,
      fillDate: dateValue,
    }));
    calculateProgress({ ...formData, fillDate: dateValue });
  };

  // Comprehensive change handler for all form elements
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    console.log(`Form field updated: ${name} = ${value}`); // Debug log

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      console.log("Updated formData:", updated); // Debug log
      return updated;
    });
    calculateProgress({ ...formData, [name]: value });
  };

  // Calculate progress
  const calculateProgress = (data: QuestionnaireFormData) => {
    const requiredFields = [
      "bankName",
      "fillDate",
      "contactPersonName",
      "contactPersonPosition",
      "contactPersonEmail",
      "q1_1",
      "q1_2",
    ];

    // Count conditional fields if main question is answered with "Да" or "Делумно"
    let conditionalFields = 0;
    let conditionalCompleted = 0;

    if (data.q1_1 === "Да" || data.q1_1 === "Делумно") {
      conditionalFields += 2; // q1_1_status and q1_1_date
      if (data.q1_1_status) conditionalCompleted++;
      if (data.q1_1_date) conditionalCompleted++;
    }

    if (data.q1_2 === "Да" || data.q1_2 === "Делумно") {
      conditionalFields += 1; // q1_2_freq
      if (data.q1_2_freq) conditionalCompleted++;
    }

    const completedRequiredFields = requiredFields.filter(
      (field) => data[field]
    ).length;

    const totalFields = requiredFields.length + conditionalFields;
    const totalCompleted = completedRequiredFields + conditionalCompleted;

    const progress = totalFields > 0 ? (totalCompleted / totalFields) * 100 : 0;
    setQuestionnaireProgress(Math.round(progress));
  };
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Get all form values including those from Ant Design form
      const formValues = form.getFieldsValue();

      // Prepare final questionnaire data by merging form values and formData
      const questionnaireData: Record<string, string | undefined> = {
        // Basic form fields from Ant Design form
        bankName: (formValues.bankName || formData.bankName) as
          | string
          | undefined,
        fillDate: formValues.fillDate
          ? formValues.fillDate.format("YYYY-MM-DD")
          : (formData.fillDate as string | undefined),
        contactPersonName: (formValues.contactPersonName ||
          formData.contactPersonName) as string | undefined,
        contactPersonPosition: (formValues.contactPersonPosition ||
          formData.contactPersonPosition) as string | undefined,
        contactPersonEmail: (formValues.contactPersonEmail ||
          formData.contactPersonEmail) as string | undefined,
        additionalComments: (formValues.additionalComments ||
          formData.additionalComments) as string | undefined,

        // ALL questionnaire fields from formData (including conditional fields)
        ...Object.keys(formData).reduce((acc, key) => {
          // Include ALL fields from formData, not just those starting with "q"
          if (
            formData[key] !== undefined &&
            formData[key] !== null &&
            formData[key] !== ""
          ) {
            acc[key] = String(formData[key]);
          }
          return acc;
        }, {} as Record<string, string | undefined>),

        // Also include any additional form fields that might not be in formData
        ...Object.keys(formValues).reduce((acc, key) => {
          if (
            formValues[key] !== undefined &&
            formValues[key] !== null &&
            formValues[key] !== ""
          ) {
            // Handle date fields specially
            if (
              formValues[key] &&
              typeof formValues[key] === "object" &&
              "format" in formValues[key]
            ) {
              acc[key] = formValues[key].format("YYYY-MM-DD");
            } else {
              acc[key] = String(formValues[key]);
            }
          }
          return acc;
        }, {} as Record<string, string | undefined>),
      };

      // Submit to backend if NDA details are available
      if (ndaDetails) {
        // Debug: Log the questionnaire data before submission
        console.log("Submitting questionnaire data:", questionnaireData);
        console.log("Form data state:", formData);
        console.log("Ant Design form values:", formValues);

        const surveySubmission = {
          ndaDetails,
          questionnaireData,
        };

        const response = await surveyApi.submitSurvey(surveySubmission);

        // Set submission ID and show thank you modal
        setSubmissionId(response.data.id);
        setShowThankYouModal(true);

        // Reset form and form data
        form.resetFields();
        setFormData({});
        setQuestionnaireProgress(0);

        notification.success({
          message: "Успешно поднесување",
          description: "Прашалникот е успешно поднесен и зачуван",
          placement: "topRight",
        });
      } else {
        // Fallback to export modal if no NDA details
        setExportData(JSON.stringify(questionnaireData, null, 2));
        setShowExportModal(true);

        notification.success({
          message: "Успешно поднесување",
          description: "Прашалникот е успешно пополнет",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      notification.error({
        message: "Грешка",
        description: "Настана грешка при поднесување на прашалникот",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };
  const { clearSurveyData } = useSurveyStorage();
  // Close export modal
  const closeExportModal = () => {
    setShowExportModal(false);
    setCopyMessage("");
    clearSurveyData();
  };

  // Close thank you modal
  const closeThankYouModal = () => {
    setShowThankYouModal(false);
    setSubmissionId("");
    navigate("/welcome");
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData);
      setCopyMessage("Податоците се копирани!");
      setTimeout(() => setCopyMessage(""), 3000);
    } catch (err) {
      console.error("Неуспешно копирање:", err);
      setCopyMessage("Неуспешно копирање.");
    }
  };

  // Helper function to render section titles
  const renderSectionTitle = (
    title: string,
    icon: React.ReactNode,
    color: string
  ) => (
    <div className="mb-8">
      <Card className={`bg-gradient-to-r ${color} border-0 shadow-md`}>
        <div className="flex items-center space-x-3">
          <div className="text-white text-xl">{icon}</div>
          <Title level={4} className="text-white mb-0">
            {title}
          </Title>
        </div>
      </Card>
    </div>
  );

  // Common radio options
  const yesNoPartialOptions: RadioOption[] = [
    { label: "Да", value: "Да" },
    { label: "Не", value: "Не" },
    { label: "Делумно", value: "Делумно" },
  ];

  // Required field label component
  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center space-x-1">
      <Badge status="error" />
      <Text strong>{children}</Text>
    </span>
  );

  return (
    <div className="questionnaire-form min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <Card className="mb-8 shadow-xl rounded-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -m-6 mb-6 p-8 text-white">
            <div className="text-center">
              <BankOutlined className="text-4xl mb-4" />
              <Title level={2} className="text-white mb-2">
                Прашалник за проценка на усогласеност на банка
              </Title>
              <Paragraph className="text-blue-100 text-lg mb-0">
                Пополнете го прашалникот за проценка на подготвеноста на вашата
                банка
              </Paragraph>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Text className="text-gray-600 font-medium">
                Прогрес на пополнување
              </Text>
              <Badge
                count={`${questionnaireProgress}%`}
                style={{
                  backgroundColor:
                    questionnaireProgress === 100 ? "#52c41a" : "#1890ff",
                }}
                className="px-3 py-1"
              />
            </div>
            <Progress
              percent={questionnaireProgress}
              strokeColor={{
                "0%": "#1890ff",
                "100%": "#52c41a",
              }}
              strokeWidth={8}
              showInfo={false}
              className="mb-2"
            />
            <Text type="secondary" className="text-sm">
              {questionnaireProgress === 100
                ? "Прашалникот е целосно пополнет!"
                : "Продолжете со пополнување..."}
            </Text>
          </div>

          <Paragraph className="text-gray-600 leading-relaxed">
            Почитувани, овој прашалник е наменет за претходна проценка на
            подготвеноста на Вашата банка да ги исполни барањата од "Одлуката за
            Методологијата за сигурност на информативниот систем на банката"
            издадена од Народната банка на Република Северна Македонија.
          </Paragraph>
        </Card>

        {/* Main Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          className="space-y-6"
        >
          {/* General Information Section */}
          {renderSectionTitle(
            "Општи информации за банката",
            <BankOutlined />,
            "from-blue-500 to-blue-600"
          )}

          <Card className="shadow-lg rounded-xl border-0 mb-8">
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Form.Item
                  label={<RequiredLabel>Име на банката</RequiredLabel>}
                  name="bankName"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете име на банка",
                    },
                  ]}
                >
                  <Input
                    prefix={<BankOutlined className="text-gray-400" />}
                    placeholder="Внесете го целосното име на банката"
                    size="large"
                    className="rounded-lg"
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={<RequiredLabel>Датум на пополнување</RequiredLabel>}
                  name="fillDate"
                  rules={[
                    { required: true, message: "Ве молиме изберете датум" },
                  ]}
                >
                  <DatePicker
                    className="w-full rounded-lg"
                    size="large"
                    format="DD.MM.YYYY"
                    placeholder="Изберете датум"
                    onChange={handleDateChange}
                    defaultValue={dayjs()}
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <RequiredLabel>
                      Лице за контакт (име и презиме)
                    </RequiredLabel>
                  }
                  name="contactPersonName"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете име и презиме",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Внесете име и презиме"
                    size="large"
                    className="rounded-lg"
                    onChange={(e) =>
                      handleInputChange("contactPersonName", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <RequiredLabel>Позиција на лицето за контакт</RequiredLabel>
                  }
                  name="contactPersonPosition"
                  rules={[
                    { required: true, message: "Ве молиме внесете позиција" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Внесете позиција"
                    size="large"
                    className="rounded-lg"
                    onChange={(e) =>
                      handleInputChange("contactPersonPosition", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <RequiredLabel>Е-пошта на лицето за контакт</RequiredLabel>
                  }
                  name="contactPersonEmail"
                  rules={[
                    { required: true, message: "Ве молиме внесете е-пошта" },
                    {
                      type: "email",
                      message: "Ве молиме внесете валидна е-пошта",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="example@bank.com"
                    size="large"
                    className="rounded-lg"
                    onChange={(e) =>
                      handleInputChange("contactPersonEmail", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ICT Risk Management Section */}
          {renderSectionTitle(
            "Дел 1: ИКТ Управување со ризици",
            <SaveOutlined />,
            "from-green-500 to-green-600"
          )}

          <Card className="shadow-lg rounded-xl border-0 mb-8">
            <Space direction="vertical" size="large" className="w-full">
              <RadioGroup
                question="1. Дали банката има воспоставено и документирано систем за управување со ИТ ризици (вклучувајќи идентификација, класификација, проценка, ублажување и следење)?"
                name="q1_1"
                options={yesNoPartialOptions}
                detailsId="q1_1_details"
                formData={formData}
                errors={{}}
                handleChange={handleFormChange}
              />

              <Divider />

              <RadioGroup
                question="2. Дали се врши редовна проценка на ИТ ризиците и ревизија на кибербезбедноста?"
                name="q1_2"
                options={yesNoPartialOptions}
                detailsId="q1_2_details"
                formData={formData}
                errors={{}}
                handleChange={handleFormChange}
              />
            </Space>
          </Card>

          {/* Additional Comments Section */}
          {renderSectionTitle(
            "Дополнителни коментари",
            <CopyOutlined />,
            "from-purple-500 to-purple-600"
          )}

          <Card className="shadow-lg rounded-xl border-0 mb-8">
            <Form.Item
              label="Дополнителни коментари или референци за документација:"
              name="additionalComments"
            >
              <TextArea
                rows={4}
                placeholder="Внесете дополнителни коментари..."
                className="rounded-lg"
                onChange={(e) =>
                  handleInputChange("additionalComments", e.target.value)
                }
              />
            </Form.Item>
          </Card>

          {/* Submit Section */}
          <Card className="shadow-lg rounded-xl border-0">
            <div className="text-center">
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<ExportOutlined />}
                  loading={loading}
                  className="px-12 h-14 text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Поднеси прашалник
                </Button>
              </Form.Item>

              <Text type="secondary" className="mt-4 block">
                Притиснете за да ги извезете вашите одговори
              </Text>
            </div>
          </Card>
        </Form>
      </div>

      {/* Export Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <ExportOutlined className="text-blue-500" />
            <span>Извоз на податоци од прашалник</span>
          </div>
        }
        open={showExportModal}
        onCancel={closeExportModal}
        footer={[
          <Button key="close" size="large" onClick={closeExportModal}>
            Затвори
          </Button>,
          <Button
            key="copy"
            type="primary"
            size="large"
            icon={<CopyOutlined />}
            onClick={copyToClipboard}
            className="bg-blue-500"
          >
            Копирај податоци
          </Button>,
        ]}
        width={800}
        className="export-modal"
      >
        <div className="space-y-4">
          <Alert
            message="Податоците се подготвени за извоз"
            description="Копирајте ги податоците подолу за да ги зачувате или анализирате. Податоците се во JSON формат."
            type="success"
            showIcon
            className="rounded-lg"
          />

          <TextArea
            value={exportData}
            readOnly
            rows={15}
            className="bg-gray-50 rounded-lg font-mono text-sm border-0"
          />

          {copyMessage && (
            <Alert
              message={copyMessage}
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              className="rounded-lg"
            />
          )}
        </div>
      </Modal>

      {/* Thank You Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2 text-center">
            <CheckCircleOutlined className="text-green-500 text-2xl" />
            <span className="text-xl font-semibold">Благодариме!</span>
          </div>
        }
        open={showThankYouModal}
        onCancel={closeThankYouModal}
        footer={[
          <Button
            key="close"
            type="primary"
            size="large"
            onClick={closeThankYouModal}
            className="bg-green-500 hover:bg-green-600 px-8"
          >
            Во ред
          </Button>,
        ]}
        width={600}
        className="thank-you-modal"
        centered
      >
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleOutlined className="text-green-500 text-4xl" />
            </div>
            <Title level={3} className="text-green-600 mb-2">
              Прашалникот е успешно поднесен!
            </Title>
            <Paragraph className="text-gray-600 text-lg mb-4">
              Вашите одговори се успешно зачувани и ќе бидат прегледани од
              нашиот тим.
            </Paragraph>

            {submissionId && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="text-gray-600">ID на поднесување:</Text>
                <br />
                <Text strong className="text-blue-600 font-mono">
                  {submissionId}
                </Text>
              </div>
            )}

            <Paragraph className="text-gray-500">
              Ќе добиете потврда на вашата е-пошта во најкраток можен рок.
            </Paragraph>
          </div>
        </div>
      </Modal>
    </div>
  );
};
