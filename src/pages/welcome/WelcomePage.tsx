import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Avatar,
  Steps,
} from "antd";
import {
  SafetyOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  FileProtectOutlined,
  CloudServerOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import { BiShield } from "react-icons/bi";

const { Title, Paragraph, Text } = Typography;

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSurvey = () => {
    navigate("/survey");
  };

  // DORA coverage areas
  const doraAreas = [
    {
      icon: <SecurityScanOutlined className="text-2xl" />,
      title: "ИКТ Управување со ризици",
      description: "Принципи и барања за рамката на управување со ИКТ ризици",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <TeamOutlined className="text-2xl" />,
      title: "ИКТ Управување со ризици од трети страни",
      description:
        "Следење на провајдери на ризици од трети страни и клучни договорни одредби",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <MonitorOutlined className="text-2xl" />,
      title: "Тестирање на дигиталната оперативна отпорност",
      description: "Основни и напредни барања за тестирање",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FileProtectOutlined className="text-2xl" />,
      title: "ИКТ-поврзани инциденти",
      description:
        "Општи барања и пријавување на главни ИКТ-поврзани инциденти",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: <GlobalOutlined className="text-2xl" />,
      title: "Споделување информации",
      description: "Размена на информации и разузнавање за кибер-закани",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: <CloudServerOutlined className="text-2xl" />,
      title: "Надзор над критични провајдери од трети страни",
      description: "Рамка за надзор на критични ИКТ провајдери од трети страни",
      color: "from-red-500 to-red-600",
    },
  ];

  const surveySteps = [
    {
      title: "НДА Договор",
      description: "Прегледајте и прифатете го договорот за доверливост",
    },
    {
      title: "Информации за банката",
      description: "Обезбедете основни информации за вашата институција",
    },
    {
      title: "ДОРА Проценка",
      description: "Пополнете го прашалникот за дигитална оперативна отпорност",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Avatar
                  size={120}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl"
                  icon={<BiShield className="text-5xl" />}
                />
                <div className="absolute -top-2 -right-2">
                  <Tag color="gold" className="font-bold text-xs px-3 py-1">
                    EU REGULATION
                  </Tag>
                </div>
              </div>
            </div>

            <Title
              level={1}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
            >
              ДОРА Прашалник за усогласеност
            </Title>

            <Title
              level={2}
              className="text-2xl md:text-3xl text-gray-700 font-normal mb-8"
            >
              Проценка на Законот за дигитална оперативна отпорност
            </Title>

            <Paragraph className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Проценете ја подготвеноста на вашата институција за{" "}
              <Text strong className="text-blue-600">
                Законот за дигитална оперативна отпорност (ДОРА) на Европската
                Унија
              </Text>
              , кој влезе во примена на{" "}
              <Text strong className="text-green-600">
                17 јануари 2025 година
              </Text>
              . Оваа регулатива ја зајакнува дигиталната отпорност на
              финансиските субјекти низ ЕУ.
            </Paragraph>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Tag color="blue" className="px-4 py-2 text-sm font-medium">
                🏛️ Банки и финансиски институции
              </Tag>
              <Tag color="green" className="px-4 py-2 text-sm font-medium">
                🛡️ Осигурителни компании
              </Tag>
              <Tag color="purple" className="px-4 py-2 text-sm font-medium">
                📈 Инвестициски фирми
              </Tag>
              <Tag color="orange" className="px-4 py-2 text-sm font-medium">
                💼 ИКТ провајдери на услуги
              </Tag>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="text-center mb-20">
            <Space size="large" wrap>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={handleStartSurvey}
                className="h-16 px-12 text-lg font-semibold rounded-2xl shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Започни ДОРА проценка
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* What DORA Covers Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Title level={2} className="text-4xl font-bold text-gray-800 mb-4">
            Што покрива ДОРА?
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
            Законот за дигитална оперативна отпорност се однесува на шест клучни
            области за да обезбеди дека финансиските субјекти можат да издржат,
            одговорат и се опорачат од ИКТ нарушувања.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {doraAreas.map((area, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                className="h-full shadow-xl rounded-2xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                bodyStyle={{ padding: 0 }}
              >
                <div
                  className={`bg-gradient-to-br ${area.color} p-6 text-white`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      {area.icon}
                    </div>
                    <Title level={4} className="text-white mb-0">
                      {area.title}
                    </Title>
                  </div>
                </div>
                <div className="p-6">
                  <Paragraph className="text-gray-600 text-base leading-relaxed mb-0">
                    {area.description}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Survey Process Section */}
      <div className="bg-white bg-opacity-80 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Title level={2} className="text-4xl font-bold text-gray-800 mb-4">
              Процес на прашалникот
            </Title>
            <Paragraph className="text-xl text-gray-600">
              Пополнете ја вашата ДОРА проценка во три едноставни чекори
            </Paragraph>
          </div>

          <Steps
            current={-1}
            direction="horizontal"
            size="default"
            className="mb-12"
            items={surveySteps.map((step, index) => ({
              title: (
                <span className="text-lg font-semibold">{step.title}</span>
              ),
              description: (
                <span className="text-gray-600">{step.description}</span>
              ),
              icon: (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
              ),
            }))}
          />

          <Card className="shadow-2xl rounded-2xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="text-center py-8">
              <SafetyOutlined className="text-6xl text-blue-500 mb-6" />
              <Title level={3} className="text-gray-800 mb-4">
                Зошто е важна оваа проценка?
              </Title>
              <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Зголемената зависност на финансискиот сектор од технологијата ги
                прави институциите ранливи на кибер-напади и системски дефекти.
                ДОРА обезбедува дека банките, осигурителните компании и
                инвестициските фирми можат да одржат оперативен континуитет и да
                се заштитат од ИКТ нарушувања кои можат да влијаат на пошироката
                економија.
              </Paragraph>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <CheckCircleOutlined className="text-3xl text-green-500 mb-3" />
                  <Text strong className="block text-lg text-gray-800">
                    ЕУ усогласеност
                  </Text>
                  <Text className="text-gray-600">
                    Исполнете ги регулаторните барања
                  </Text>
                </div>
                <div className="text-center">
                  <BiShield className="text-3xl text-blue-500 mb-3" />
                  <Text strong className="block text-lg text-gray-800">
                    Проценка на ризик
                  </Text>
                  <Text className="text-gray-600">
                    Идентификувајте ранливости
                  </Text>
                </div>
                <div className="text-center">
                  <SecurityScanOutlined className="text-3xl text-purple-500 mb-3" />
                  <Text strong className="block text-lg text-gray-800">
                    Оперативна отпорност
                  </Text>
                  <Text className="text-gray-600">
                    Зајакнете ги дигиталните способности
                  </Text>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={handleStartSurvey}
                className="h-14 px-10 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Започнете ја вашата ДОРА проценка
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Title level={4} className="!text-white mb-4">
              Закон за дигитална оперативна отпорност (ДОРА)
            </Title>
            <Paragraph className="text-gray-300 mb-6">
              Регулатива (ЕУ) 2022/2554 • Во сила од 17 јануари 2025 година
            </Paragraph>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a
                href="https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                📖 EIOPA ДОРА информации
              </a>
              <span>🏛️ Регулатива на Европската Унија</span>
              <span>🛡️ Отпорност на финансискиот сектор</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
