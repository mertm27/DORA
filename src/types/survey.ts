// Survey application types

export type SurveyStep = "inputNda" | "displayNda" | "questionnaire";

export interface NdaDetails {
  bankName: string;
  bankAddress: string;
  bankRegNumber: string;
  bankContactName: string;
  bankContactPosition: string;
  receiverName: string;
  receiverAddress: string;
  receiverRegNumber: string;
  receiverContactName: string;
  receiverContactPosition: string;
  ndaPurpose: string;
  ndaDurationYears: string;
  ndaEffectiveDate: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface RadioOption {
  label: string;
  value: string;
}

export interface QuestionnaireFormData {
  [key: string]: string | string[] | boolean | number | undefined;
}

export interface BankInfo {
  bankName: string;
  fillDate: string;
  contactPersonName: string;
  contactPersonPosition: string;
  contactPersonEmail: string;
}

// Reusable component props
export interface RadioGroupProps {
  question: string;
  name: string;
  options: RadioOption[];
  required?: boolean;
  detailsId?: string;
  conditionalValues?: string[];
  formData: QuestionnaireFormData;
  errors: FormErrors;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}
