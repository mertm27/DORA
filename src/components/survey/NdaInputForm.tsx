import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Typography,
  Card,
  Badge,
  Row,
  Col,
} from "antd";
import { NdaDetails, FormErrors } from "../../types/survey";
import useSurveyStorage from "../../utils/hooks/useSurveyStorage";
import dayjs from "dayjs";
import {
  BankOutlined,
  HomeOutlined,
  IdcardOutlined,
  UserOutlined,
  FormOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  SendOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface NdaInputFormProps {
  onSubmit: (details: NdaDetails) => void;
}

export const NdaInputForm: React.FC<NdaInputFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const { ndaDetails } = useSurveyStorage();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-populate the form with saved data or defaults
    if (ndaDetails) {
      const formattedDetails = {
        ...ndaDetails,
        ndaEffectiveDate: ndaDetails.ndaEffectiveDate
          ? dayjs(ndaDetails.ndaEffectiveDate)
          : undefined,
        ndaDurationYears: ndaDetails.ndaDurationYears
          ? parseInt(ndaDetails.ndaDurationYears)
          : 5,
      };
      form.setFieldsValue(formattedDetails);
    } else {
      form.setFieldsValue({
        ndaPurpose:
          "проценка на подготвеноста на банката за усогласување со директивата на НБРСМ за сигурност на информативниот систем и подготовка на извештај/анализа",
        ndaDurationYears: 5,
        ndaEffectiveDate: dayjs(),
      });
    }
  }, [form, ndaDetails]);

  const validateForm = (): boolean => {
    const formValues = form.getFieldsValue();
    const newErrors: FormErrors = {};
    let isValid = true;

    const requiredFields = [
      "bankName",
      "bankAddress",
      "bankRegNumber",
      "bankContactName",
      "bankContactPosition",
      "receiverName",
      "receiverAddress",
      "receiverRegNumber",
      "receiverContactName",
      "receiverContactPosition",
      "ndaPurpose",
      "ndaDurationYears",
      "ndaEffectiveDate",
    ];

    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        newErrors[field] = "Ова поле е задолжително.";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then((values) => {
        if (validateForm()) {
          const ndaDetails: NdaDetails = {
            ...values,
            ndaEffectiveDate: dayjs(values.ndaEffectiveDate).format(
              "YYYY-MM-DD"
            ),
            ndaDurationYears: values.ndaDurationYears.toString(),
          };
          onSubmit(ndaDetails);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center space-x-2">
      <Badge status="error" />
      <Text strong className="text-gray-700">
        {children}
      </Text>
    </span>
  );

  const SectionCard = ({
    title,
    icon,
    gradient,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    gradient: string;
    children: React.ReactNode;
  }) => (
    <Card className="mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} -m-6 mb-6 p-6`}>
        <div className="flex items-center space-x-3">
          <div className="text-white text-2xl">{icon}</div>
          <Title level={4} className="text-white mb-0">
            {title}
          </Title>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </Card>
  );

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg shadow-green-500/30 mb-6">
            <SafetyCertificateOutlined className="text-2xl text-white" />
          </div>

          <Title
            level={2}
            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4"
          >
            Договор за Доверливост (NDA)
          </Title>

          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Пополнете ги сите полиња во формуларот подолу за да генерирате
            Договор за Доверливост. Полињата означени со{" "}
            <Badge status="error" /> се задолжителни.
          </Paragraph>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="space-y-8"
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              {/* Bank Information */}
              <SectionCard
                title="Информации за Банката"
                icon={<BankOutlined />}
                gradient="from-blue-500 to-blue-600"
              >
                <Form.Item
                  label={<RequiredLabel>Име на банката</RequiredLabel>}
                  name="bankName"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете име на банка",
                    },
                  ]}
                  validateStatus={errors.bankName ? "error" : ""}
                  help={errors.bankName}
                >
                  <Input
                    prefix={<BankOutlined className="text-gray-400" />}
                    placeholder="Внесете го целосното име на банката"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>Адреса на банката</RequiredLabel>}
                  name="bankAddress"
                  rules={[
                    { required: true, message: "Ве молиме внесете адреса" },
                  ]}
                  validateStatus={errors.bankAddress ? "error" : ""}
                  help={errors.bankAddress}
                >
                  <Input
                    prefix={<HomeOutlined className="text-gray-400" />}
                    placeholder="Улица, број, град"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>Регистарски број</RequiredLabel>}
                  name="bankRegNumber"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете регистарски број",
                    },
                  ]}
                  validateStatus={errors.bankRegNumber ? "error" : ""}
                  help={errors.bankRegNumber}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-gray-400" />}
                    placeholder="ЕМБГ/ЕДБ број"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>Контакт лице</RequiredLabel>}
                  name="bankContactName"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете име на контакт лице",
                    },
                  ]}
                  validateStatus={errors.bankContactName ? "error" : ""}
                  help={errors.bankContactName}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Име и презиме"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <RequiredLabel>Позиција на контакт лице</RequiredLabel>
                  }
                  name="bankContactPosition"
                  rules={[
                    { required: true, message: "Ве молиме внесете позиција" },
                  ]}
                  validateStatus={errors.bankContactPosition ? "error" : ""}
                  help={errors.bankContactPosition}
                >
                  <Input
                    prefix={<FormOutlined className="text-gray-400" />}
                    placeholder="Функција во банката"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </SectionCard>
            </Col>

            <Col xs={24} lg={12}>
              {/* Receiver Information */}
              <SectionCard
                title="Информации за Примач"
                icon={<UserOutlined />}
                gradient="from-purple-500 to-purple-600"
              >
                <Form.Item
                  label={<RequiredLabel>Име на примач</RequiredLabel>}
                  name="receiverName"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете име на примач",
                    },
                  ]}
                  validateStatus={errors.receiverName ? "error" : ""}
                  help={errors.receiverName}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Име на консултантската компанија/лице"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>Адреса на примач</RequiredLabel>}
                  name="receiverAddress"
                  rules={[
                    { required: true, message: "Ве молиме внесете адреса" },
                  ]}
                  validateStatus={errors.receiverAddress ? "error" : ""}
                  help={errors.receiverAddress}
                >
                  <Input
                    prefix={<HomeOutlined className="text-gray-400" />}
                    placeholder="Улица, број, град"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <RequiredLabel>Регистарски број на примач</RequiredLabel>
                  }
                  name="receiverRegNumber"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете регистарски број",
                    },
                  ]}
                  validateStatus={errors.receiverRegNumber ? "error" : ""}
                  help={errors.receiverRegNumber}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-gray-400" />}
                    placeholder="ЕМБГ/ЕДБ број"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={<RequiredLabel>Контакт лице на примач</RequiredLabel>}
                  name="receiverContactName"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете име на контакт лице",
                    },
                  ]}
                  validateStatus={errors.receiverContactName ? "error" : ""}
                  help={errors.receiverContactName}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Име и презиме"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <RequiredLabel>Позиција на контакт лице</RequiredLabel>
                  }
                  name="receiverContactPosition"
                  rules={[
                    { required: true, message: "Ве молиме внесете позиција" },
                  ]}
                  validateStatus={errors.receiverContactPosition ? "error" : ""}
                  help={errors.receiverContactPosition}
                >
                  <Input
                    prefix={<FormOutlined className="text-gray-400" />}
                    placeholder="Функција во компанијата"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
              </SectionCard>
            </Col>
          </Row>

          {/* NDA Details */}
          <SectionCard
            title="Детали за NDA Договор"
            icon={<SafetyCertificateOutlined />}
            gradient="from-green-500 to-teal-600"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Form.Item
                  label={
                    <RequiredLabel>Цел на споделување информации</RequiredLabel>
                  }
                  name="ndaPurpose"
                  rules={[{ required: true, message: "Ве молиме внесете цел" }]}
                  validateStatus={errors.ndaPurpose ? "error" : ""}
                  help={errors.ndaPurpose}
                >
                  <TextArea
                    rows={4}
                    placeholder="Опишете ја целта за која ќе се споделуваат доверливите информации"
                    className="rounded-xl"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <RequiredLabel>Датум на влегување во сила</RequiredLabel>
                  }
                  name="ndaEffectiveDate"
                  rules={[
                    { required: true, message: "Ве молиме изберете датум" },
                  ]}
                  validateStatus={errors.ndaEffectiveDate ? "error" : ""}
                  help={errors.ndaEffectiveDate}
                >
                  <DatePicker
                    className="w-full rounded-xl"
                    size="large"
                    format="DD.MM.YYYY"
                    placeholder="Изберете датум"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={<RequiredLabel>Времетраење (години)</RequiredLabel>}
                  name="ndaDurationYears"
                  rules={[
                    {
                      required: true,
                      message: "Ве молиме внесете времетраење",
                    },
                  ]}
                  validateStatus={errors.ndaDurationYears ? "error" : ""}
                  help={errors.ndaDurationYears}
                >
                  <InputNumber
                    min={1}
                    max={50}
                    className="w-full rounded-xl"
                    size="large"
                    placeholder="5"
                    prefix={<FieldTimeOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </SectionCard>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SendOutlined />}
              className="px-12 h-14 text-lg font-semibold rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Генерирај NDA Договор
            </Button>
            <div className="mt-4">
              <Text type="secondary" className="text-sm">
                Договорот ќе биде генериран врз основа на внесените податоци
              </Text>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
