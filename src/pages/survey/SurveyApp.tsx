import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConfigProvider,
  theme,
  Layout,
  FloatButton,
  notification,
  Badge,
  Typography,
  Progress,
} from "antd";
import { NdaInputForm } from "../../components/survey/NdaInputForm";
import { NdaDisplayAndAcceptance } from "../../components/survey/NdaDisplayAndAcceptance";
import { Questionnaire } from "../../components/survey/Questionnaire";
import { SurveyStep, NdaDetails } from "../../types/survey";
import {
  FormOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  BankOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import useSurveyStorage from "../../utils/hooks/useSurveyStorage";

const { Content } = Layout;
const { Text, Title } = Typography;

export const SurveyApp: React.FC = () => {
  const navigate = useNavigate();

  // Use the survey storage hook to persist data
  const { ndaDetails, setNdaDetails, lastStep, setLastStep, clearSurveyData } =
    useSurveyStorage();

  const [currentStep, setCurrentStep] = useState<SurveyStep>(
    lastStep as SurveyStep
  );

  // Update persisted step when currentStep changes
  useEffect(() => {
    setLastStep(currentStep);
  }, [currentStep, setLastStep]);

  // Handle NDA details submission
  const handleNdaSubmit = (details: NdaDetails) => {
    setNdaDetails(details);
    setCurrentStep("displayNda");
  };

  // Handle NDA acceptance
  const handleNdaAccept = () => {
    setCurrentStep("questionnaire");
  };

  // Handle back button in NDA display
  const handleBack = () => {
    setCurrentStep("inputNda");
  };

  // Handle clear all data action
  const handleClearData = () => {
    notification.info({
      message: "Податоците се избришани",
      description: "Сите зачувани податоци се избришани успешно.",
      placement: "topRight",
    });
    clearSurveyData();
    setCurrentStep("inputNda");
  };

  // Get current step component
  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case "inputNda":
        return <NdaInputForm onSubmit={handleNdaSubmit} />;
      case "displayNda":
        return (
          <NdaDisplayAndAcceptance
            ndaDetails={ndaDetails as NdaDetails}
            onAccept={handleNdaAccept}
            onBack={handleBack}
          />
        );
      case "questionnaire":
        return <Questionnaire ndaDetails={ndaDetails as NdaDetails} />;
      default:
        return <NdaInputForm onSubmit={handleNdaSubmit} />;
    }
  };

  // Get step index for progress
  const getStepIndex = () => {
    switch (currentStep) {
      case "inputNda":
        return 0;
      case "displayNda":
        return 1;
      case "questionnaire":
        return 2;
      default:
        return 0;
    }
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    return ((getStepIndex() + 1) / 3) * 100;
  };

  // Custom step component
  const CustomStep = ({
    icon,
    title,
    description,
    isActive,
    isCompleted,
    stepNumber,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    isActive: boolean;
    isCompleted: boolean;
    stepNumber: number;
  }) => (
    <div className="flex items-center space-x-4 relative">
      <div
        className={`
        relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl
        ${
          isActive
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
            : isCompleted
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
            : "bg-white text-gray-400 border-2 border-gray-200"
        }
        transition-all duration-300 transform
        ${isActive ? "scale-110" : "scale-100"}
      `}
      >
        <div className="text-xl">
          {isCompleted ? <CheckCircleOutlined /> : icon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold text-lg mb-1 ${
            isActive
              ? "text-blue-600"
              : isCompleted
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>

      {stepNumber < 2 && (
        <div
          className={`
          absolute left-8 top-16 w-0.5 h-12 
          ${
            isCompleted
              ? "bg-gradient-to-b from-green-500 to-blue-500"
              : "bg-gray-200"
          }
          transition-all duration-500
        `}
        />
      )}
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#3b82f6",
          borderRadius: 12,
          colorBgContainer: "#ffffff",
        },
        components: {
          Layout: {
            bodyBg: "transparent",
          },
          Card: {
            boxShadowTertiary:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
          Button: {
            borderRadius: 12,
          },
        },
      }}
    >
      <Layout className="min-h-screen">
        {/* Beautiful animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <Content className="relative z-10 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Modern Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg shadow-blue-500/30 mb-6">
                <BankOutlined className="text-3xl text-white" />
              </div>

              <Title
                level={1}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
              >
                Прашалник за проценка на усогласеност на банка
              </Title>

              <Text className="text-xl text-gray-600 max-w-3xl mx-auto block leading-relaxed">
                Пополнете го прашалникот за проценка на подготвеноста на вашата
                банка
              </Text>
            </div>

            {/* Modern Progress Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Text className="text-lg font-semibold text-gray-700 mb-2 block">
                    Прогрес на завршување
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Чекор {getStepIndex() + 1} од 3
                  </Text>
                </div>

                <Badge
                  count={`${Math.round(getProgressPercentage())}%`}
                  style={{
                    backgroundColor:
                      getProgressPercentage() === 100 ? "#10b981" : "#3b82f6",
                    fontSize: "16px",
                    fontWeight: "bold",
                    padding: "8px 16px",
                    height: "auto",
                    borderRadius: "12px",
                  }}
                />
              </div>

              <Progress
                percent={getProgressPercentage()}
                strokeColor={{
                  "0%": "#3b82f6",
                  "100%": "#10b981",
                }}
                strokeWidth={8}
                showInfo={false}
                className="mb-8"
                trailColor="#f1f5f9"
              />

              {/* Custom Modern Steps */}
              <div className="space-y-8">
                <CustomStep
                  icon={<FormOutlined />}
                  title="Внесување на податоци"
                  description="Внесете ги основните податоци и информации за NDA договорот"
                  isActive={currentStep === "inputNda"}
                  isCompleted={getStepIndex() > 0}
                  stepNumber={0}
                />

                <CustomStep
                  icon={<FileTextOutlined />}
                  title="Преглед и прифаќање"
                  description="Прегледајте го генерираниот NDA договор и дајте согласност"
                  isActive={currentStep === "displayNda"}
                  isCompleted={getStepIndex() > 1}
                  stepNumber={1}
                />

                <CustomStep
                  icon={<CheckCircleOutlined />}
                  title="Прашалник"
                  description="Пополнете го детален прашалник за проценка на усогласеност"
                  isActive={currentStep === "questionnaire"}
                  isCompleted={false}
                  stepNumber={2}
                />
              </div>
            </div>

            {/* Main Content with beautiful container */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              {getCurrentStepComponent()}
            </div>
          </div>
        </Content>

        {/* Modern Float Buttons */}
        <FloatButton.Group
          trigger="hover"
          style={{ right: 24, bottom: 24 }}
          icon={<QuestionCircleOutlined />}
          type="primary"
          className="modern-float-buttons"
        >
          <FloatButton
            icon={<ClearOutlined />}
            tooltip="Ресетирај ги сите податоци"
            onClick={handleClearData}
            className="shadow-lg"
          />
          <FloatButton
            icon={<SaveOutlined />}
            tooltip="Податоците се зачувуваат автоматски"
            className="shadow-lg"
          />
          <FloatButton
            icon={<RedoOutlined />}
            tooltip="Започни од почеток"
            onClick={() => setCurrentStep("inputNda")}
            className="shadow-lg"
          />
          <FloatButton
            icon={<HomeOutlined />}
            tooltip="Назад на почетната страница"
            onClick={() => {
              handleClearData();
              navigate("/");
            }}
            className="shadow-lg"
          />
        </FloatButton.Group>
      </Layout>
    </ConfigProvider>
  );
};
