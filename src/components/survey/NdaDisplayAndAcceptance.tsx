import React, { useState, useRef } from "react";
import { Typography, Card, Button, Checkbox, Alert, Row, Col } from "antd";
import {
  PrinterOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { NdaDetails } from "../../types/survey";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { Title, Paragraph, Text } = Typography;

interface NdaDisplayAndAcceptanceProps {
  ndaDetails: NdaDetails;
  onAccept: () => void;
  onBack: () => void;
}

export const NdaDisplayAndAcceptance: React.FC<
  NdaDisplayAndAcceptanceProps
> = ({ ndaDetails, onAccept, onBack }) => {
  const [agreed, setAgreed] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const handleAccept = () => {
    if (agreed) {
      onAccept();
    } else {
      setShowErrorMessage(true);
    }
  };

  // Format date for display in NDA text
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  const handleAgreementChange = (e: CheckboxChangeEvent) => {
    setAgreed(e.target.checked);
    if (e.target.checked) {
      setShowErrorMessage(false);
    }
  };

  // Enhanced print function with better styling
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    if (printWindow && contractRef.current) {
      const contractHtml = contractRef.current.innerHTML;
      const printStyles = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.7;
            color: #1a202c;
            padding: 60px 40px;
            background: #ffffff;
          }
          
          h1, h2, h3, h4 {
            color: #2d3748;
            margin-top: 32px;
            margin-bottom: 16px;
            font-weight: 600;
          }
          
          h2 {
            font-size: 24px;
            border-bottom: 3px solid #3182ce;
            padding-bottom: 8px;
          }
          
          h4 {
            font-size: 16px;
            color: #3182ce;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          p {
            margin-bottom: 16px;
            text-align: justify;
          }
          
          .contract-header {
            text-align: center;
            margin-bottom: 48px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 32px;
          }
          
          .section {
            margin-bottom: 32px;
            padding: 20px;
            border-left: 4px solid #e2e8f0;
            background: #f7fafc;
          }
          
          .signature-area {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
            padding-top: 40px;
            border-top: 2px solid #e2e8f0;
          }
          
          .signature-line {
            width: 250px;
            border-top: 2px solid #2d3748;
            margin-top: 60px;
            padding-top: 8px;
            text-align: center;
            font-weight: 500;
          }
          
          .strong-text {
            font-weight: 600;
            color: #2d3748;
          }
          
          @media print {
            @page {
              size: A4;
              margin: 2.5cm;
            }
            
            body {
              padding: 0;
            }
          }
        </style>
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Договор за доверливост - ${ndaDetails.bankName}</title>
            <meta charset="UTF-8">
            ${printStyles}
          </head>
          <body>
            ${contractHtml}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 800);
    }
  };

  // Generate enhanced NDA text
  const generateNdaText = () => {
    const {
      bankName,
      bankAddress,
      bankRegNumber,
      bankContactName,
      bankContactPosition,
      receiverName,
      receiverAddress,
      receiverRegNumber,
      receiverContactName,
      receiverContactPosition,
      ndaPurpose,
      ndaDurationYears,
      ndaEffectiveDate,
    } = ndaDetails;

    return (
      <div ref={contractRef} className="contract-content">
        <div className="contract-header">
          <Title level={2} className="mb-4 text-gray-800">
            ДОГОВОР ЗА ДОВЕРЛИВОСТ
          </Title>
          <Text className="text-gray-600 text-lg">
            (NON-DISCLOSURE AGREEMENT)
          </Text>
        </div>

        <Paragraph className="text-lg mb-6">
          Склучен на ден{" "}
          <Text strong className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {getFormattedDate(ndaEffectiveDate)}
          </Text>{" "}
          година помеѓу:
        </Paragraph>

        <Card className="mb-6 border-l-4 border-l-blue-500 shadow-sm">
          <Paragraph className="mb-2">
            <Text strong className="text-lg text-blue-600">
              1. ДАВАТЕЛ НА ИНФОРМАЦИИ:
            </Text>
          </Paragraph>
          <div className="pl-4 space-y-2">
            <p>
              <Text strong>Име:</Text> {bankName}
            </p>
            <p>
              <Text strong>Адреса:</Text> {bankAddress}
            </p>
            <p>
              <Text strong>ЕМБС:</Text> {bankRegNumber}
            </p>
            <p>
              <Text strong>Застапувана од:</Text> {bankContactName},{" "}
              {bankContactPosition}
            </p>
          </div>
        </Card>

        <Card className="mb-8 border-l-4 border-l-purple-500 shadow-sm">
          <Paragraph className="mb-2">
            <Text strong className="text-lg text-purple-600">
              2. ПРИМАЧ НА ИНФОРМАЦИИ:
            </Text>
          </Paragraph>
          <div className="pl-4 space-y-2">
            <p>
              <Text strong>Име:</Text> {receiverName}
            </p>
            <p>
              <Text strong>Адреса:</Text> {receiverAddress}
            </p>
            <p>
              <Text strong>ЕМБС:</Text> {receiverRegNumber}
            </p>
            <p>
              <Text strong>Застапувана од:</Text> {receiverContactName},{" "}
              {receiverContactPosition}
            </p>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="section border-l-4 border-l-green-500">
            <Title level={4} className="text-green-600 mb-4">
              ЧЛЕН 1 - ПРЕДМЕТ
            </Title>
            <Paragraph className="text-justify leading-relaxed">
              Предмет на овој Договор е регулирање на меѓусебните права и
              обврски на договорните страни во врска со размена и заштита на
              доверливи информации за целите на{" "}
              <Text
                strong
                className="text-green-600 bg-green-50 px-2 py-1 rounded"
              >
                {ndaPurpose}
              </Text>
              .
            </Paragraph>
          </Card>

          <Card className="section border-l-4 border-l-orange-500">
            <Title level={4} className="text-orange-600 mb-4">
              ЧЛЕН 2 - ДЕФИНИЦИЈА НА ДОВЕРЛИВИ ИНФОРМАЦИИ
            </Title>
            <Paragraph className="text-justify leading-relaxed">
              Како доверливи информации се сметаат сите податоци, документи,
              електронски записи, усмени соопштенија, методи, know-how, технички
              спецификации, упатства и други материјали кои ДАВАТЕЛОТ НА
              ИНФОРМАЦИИ ги открива или ги прави достапни на ПРИМАЧОТ НА
              ИНФОРМАЦИИ.
            </Paragraph>
          </Card>

          <Card className="section border-l-4 border-l-red-500">
            <Title level={4} className="text-red-600 mb-4">
              ЧЛЕН 3 - ОБВРСКИ ЗА ДОВЕРЛИВОСТ
            </Title>
            <Paragraph className="text-justify leading-relaxed">
              ПРИМАЧОТ НА ИНФОРМАЦИИ се обврзува да ги чува доверливите
              информации со највисок степен на доверливост и да не ги открива на
              трети лица без претходна писмена согласност од ДАВАТЕЛОТ НА
              ИНФОРМАЦИИ.
            </Paragraph>
          </Card>

          <Card className="section border-l-4 border-l-indigo-500">
            <Title level={4} className="text-indigo-600 mb-4">
              ЧЛЕН 4 - ОГРАНИЧЕНА УПОТРЕБА
            </Title>
            <Paragraph className="text-justify leading-relaxed">
              ПРИМАЧОТ НА ИНФОРМАЦИИ се обврзува да ги користи доверливите
              информации исклучиво за целите наведени во Член 1 од овој Договор
              и да не ги користи за никакви други цели без писмена согласност од
              ДАВАТЕЛОТ НА ИНФОРМАЦИИ.
            </Paragraph>
          </Card>

          <Card className="section border-l-4 border-l-teal-500">
            <Title level={4} className="text-teal-600 mb-4">
              ЧЛЕН 5 - ВРЕМЕТРАЕЊЕ
            </Title>
            <Paragraph className="text-justify leading-relaxed">
              Обврските за доверливост утврдени со овој Договор ќе важат во
              период од{" "}
              <Text
                strong
                className="text-teal-600 bg-teal-50 px-2 py-1 rounded"
              >
                {ndaDurationYears} години
              </Text>{" "}
              од датумот на склучување на Договорот.
            </Paragraph>
          </Card>

          <Card className="section border-l-4 border-l-gray-500">
            <Title level={4} className="text-gray-600 mb-4">
              ЧЛЕН 6 - ЗАВРШНИ ОДРЕДБИ
            </Title>
            <Paragraph className="text-justify leading-relaxed">
              Овој Договор влегува во сила со неговото потпишување од страна на
              двете договорни страни. За сè што не е предвидено со овој Договор,
              ќе се применуваат одредбите од позитивните законски прописи на
              Република Северна Македонија.
            </Paragraph>
          </Card>
        </div>

        <div className="signature-area mt-16 pt-8 border-t-2 border-gray-200">
          <div className="text-center">
            <div className="signature-line">
              <Text strong>ДАВАТЕЛ НА ИНФОРМАЦИИ</Text>
              <br />
              <Text className="text-sm text-gray-600 mt-2 block">
                {bankContactName}
              </Text>
            </div>
          </div>
          <div className="text-center">
            <div className="signature-line">
              <Text strong>ПРИМАЧ НА ИНФОРМАЦИИ</Text>
              <br />
              <Text className="text-sm text-gray-600 mt-2 block">
                {receiverContactName}
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-6">
            <FileProtectOutlined className="text-2xl text-white" />
          </div>

          <Title
            level={2}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Преглед на NDA Договор
          </Title>

          <Text className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Прегледајте го генерираниот договор за доверливост и дајте ја вашата
            согласност
          </Text>
        </div>

        {/* Contract Display */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 -m-6 mb-6 p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafetyCertificateOutlined className="text-2xl text-blue-600" />
                <div>
                  <Title level={4} className="mb-0 text-gray-800">
                    Договор за доверливост
                  </Title>
                  <Text className="text-gray-600">
                    Генериран врз основа на вашите податоци
                  </Text>
                </div>
              </div>

              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                size="large"
                className="rounded-xl shadow-md bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Печати договор
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {generateNdaText()}
          </div>
        </Card>

        {/* Agreement Section */}
        <Card className="mb-8 border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
              <CheckOutlined className="text-xl text-blue-600" />
            </div>

            <div>
              <Title level={4} className="text-gray-800 mb-2">
                Потврда за согласност
              </Title>
              <Text className="text-gray-600">
                За да продолжите со пополнување на прашалникот, потребно е да се
                согласите со условите од договорот
              </Text>
            </div>

            <div className="flex justify-center">
              <Checkbox
                checked={agreed}
                onChange={handleAgreementChange}
                className="text-lg"
              >
                <Text className="ml-2 text-base">
                  Се согласувам со условите наведени во Договорот за Доверливост
                </Text>
              </Checkbox>
            </div>

            {showErrorMessage && (
              <Alert
                message="Потребна е согласност"
                description="Мора да се согласите со условите за да продолжите"
                type="warning"
                showIcon
                className="max-w-md mx-auto rounded-xl"
              />
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <Row gutter={[16, 16]} justify="space-between" className="pt-4">
          <Col>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="rounded-xl px-8 h-12 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Назад кон податоци
            </Button>
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={handleAccept}
              disabled={!agreed}
              className={`rounded-xl px-12 h-12 font-semibold shadow-lg transform transition-all duration-200 ${
                agreed
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:shadow-xl hover:-translate-y-0.5"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Прифати и продолжи
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
