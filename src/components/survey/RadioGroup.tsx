import React from "react";
import { Radio, Input, DatePicker, Form, Typography, Alert } from "antd";
import {
  RadioGroupProps,
  QuestionnaireFormData,
  FormErrors,
} from "../../types/survey";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Text } = Typography;

export const RadioGroup: React.FC<RadioGroupProps> = ({
  question,
  name,
  options,
  required = true,
  detailsId,
  conditionalValues = ["Да", "Делумно"],
  formData,
  errors,
  handleChange,
}) => {
  const value = formData[name] as string;
  const showDetails =
    (detailsId && conditionalValues.includes(value)) ||
    (name === "q3_3" && value === "Не");

  return (
    <div className="mb-6">
      <Form.Item
        label={<Text strong>{question}</Text>}
        required={required}
        validateStatus={errors[`${name}_error`] ? "error" : ""}
        help={errors[`${name}_error`]}
      >
        <Radio.Group
          name={name}
          value={value}
          onChange={(e) =>
            handleChange({
              target: {
                name: e.target.name,
                value: e.target.value,
                type: "radio",
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          className="flex flex-wrap gap-4"
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      {/* Conditional details fields rendered based on selection */}
      {showDetails &&
        detailsId &&
        renderConditionalFields(detailsId, formData, errors, handleChange)}
    </div>
  );
};

// Helper function to render conditional fields based on detailsId
const renderConditionalFields = (
  detailsId: string,
  formData: QuestionnaireFormData,
  errors: FormErrors,
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void
) => {
  switch (detailsId) {
    case "q1_1_details":
      return (
        <div className="ml-8 mb-6 border-l-2 border-gray-200 pl-4">
          <Form.Item
            label="Доколку е Да или Делумно, наведете го статусот на последната ревизија:"
            validateStatus={errors.q1_1_statusError ? "error" : ""}
            help={errors.q1_1_statusError}
          >
            <TextArea
              name="q1_1_status"
              value={(formData.q1_1_status as string) || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Внесете го статусот и опсегот на ревизијата"
            />
          </Form.Item>
          <Form.Item
            label="Наведете датум на последна ревизија:"
            validateStatus={errors.q1_1_dateError ? "error" : ""}
            help={errors.q1_1_dateError}
          >
            <DatePicker
              name="q1_1_date"
              value={
                formData.q1_1_date ? dayjs(formData.q1_1_date as string) : null
              }
              onChange={(date, dateString) =>
                handleChange({
                  target: {
                    name: "q1_1_date",
                    value: dateString,
                    type: "date",
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className="w-full"
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </div>
      );

    case "q1_2_details":
      return (
        <div className="ml-8 mb-6 border-l-2 border-gray-200 pl-4">
          <Form.Item
            label="Фреквенција на проценки/ревизии:"
            validateStatus={errors.q1_2_freqError ? "error" : ""}
            help={errors.q1_2_freqError}
          >
            <Radio.Group
              name="q1_2_freq"
              value={(formData.q1_2_freq as string) || ""}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                    type: "radio",
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className="flex flex-col gap-2"
            >
              {[
                { label: "Годишно", value: "Годишно" },
                { label: "Полугодишно", value: "Полугодишно" },
                { label: "Квартално", value: "Квартално" },
                { label: "По потреба", value: "По потреба" },
                { label: "Друго", value: "Друго" },
              ].map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                  {option.value === "Друго" &&
                    formData.q1_2_freq === "Друго" && (
                      <Input
                        name="q1_2_freq_other_text"
                        value={(formData.q1_2_freq_other_text as string) || ""}
                        onChange={handleChange}
                        className="ml-2 w-64"
                        placeholder="Наведете..."
                      />
                    )}
                </Radio>
              ))}
            </Radio.Group>
            {errors.q1_2_freq_other_textError && (
              <Alert
                message={errors.q1_2_freq_other_textError}
                type="error"
                showIcon
              />
            )}
          </Form.Item>
        </div>
      );

    // Add other cases as needed
    default:
      return null;
  }
};
