import { useState } from "react";
import { NdaDetails, QuestionnaireFormData } from "../../types/survey";

// Keys for localStorage
const NDA_DETAILS_KEY = "survey_nda_details";
const FORM_DATA_KEY = "survey_form_data";
const LAST_STEP_KEY = "survey_last_step";

/**
 * Custom hook for storing and retrieving survey data in localStorage
 */
export const useSurveyStorage = () => {
  // Load initial values from localStorage or use defaults
  const [ndaDetails, setNdaDetailsState] = useState<NdaDetails | null>(() => {
    const savedData = localStorage.getItem(NDA_DETAILS_KEY);
    return savedData ? JSON.parse(savedData) : null;
  });

  const [formData, setFormDataState] = useState<QuestionnaireFormData>(() => {
    const savedData = localStorage.getItem(FORM_DATA_KEY);
    return savedData ? JSON.parse(savedData) : {};
  });

  const [lastStep, setLastStepState] = useState<string>(() => {
    return localStorage.getItem(LAST_STEP_KEY) || "inputNda";
  });

  // Wrapper functions to update both state and localStorage
  const setNdaDetails = (details: NdaDetails | null) => {
    setNdaDetailsState(details);
    if (details) {
      localStorage.setItem(NDA_DETAILS_KEY, JSON.stringify(details));
    } else {
      localStorage.removeItem(NDA_DETAILS_KEY);
    }
  };

  const setFormData = (data: QuestionnaireFormData) => {
    setFormDataState(data);
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
  };

  const setLastStep = (step: string) => {
    setLastStepState(step);
    localStorage.setItem(LAST_STEP_KEY, step);
  };

  // Clear all survey data
  const clearSurveyData = () => {
    localStorage.removeItem(NDA_DETAILS_KEY);
    localStorage.removeItem(FORM_DATA_KEY);
    localStorage.removeItem(LAST_STEP_KEY);
    setNdaDetailsState(null);
    setFormDataState({});
    setLastStepState("inputNda");
  };

  return {
    ndaDetails,
    formData,
    lastStep,
    setNdaDetails,
    setFormData,
    setLastStep,
    clearSurveyData,
  };
};

export default useSurveyStorage;
