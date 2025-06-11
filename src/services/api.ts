import axios from "axios";

// API Configuration
const API_BASE_URL = "http://localhost:5001/api";

console.log("🔧 API Base URL:", API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log("📦 Request Data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Types
export interface SurveySubmission {
  _id?: string;
  ndaDetails: {
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
  };
  questionnaireData: {
    fillDate?: string;
    contactPersonName?: string;
    contactPersonPosition?: string;
    contactPersonEmail?: string;
    q1_1?: string;
    q1_1_details?: string;
    q1_2?: string;
    q1_2_details?: string;
    additionalComments?: string;
    [key: string]: string | undefined;
  };
  submissionDate?: string;
  status?: "draft" | "submitted" | "reviewed";
  reviewNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SurveyStats {
  totalSurveys: number;
  submittedSurveys: number;
  reviewedSurveys: number;
  draftSurveys: number;
}

export interface GetSurveysParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

// API Methods
export const surveyApi = {
  // Submit a new survey
  submitSurvey: async (surveyData: {
    ndaDetails: SurveySubmission["ndaDetails"];
    questionnaireData: SurveySubmission["questionnaireData"];
  }): Promise<ApiResponse<{ id: string; submissionDate: string }>> => {
    const response = await api.post("/surveys", surveyData);
    return response.data;
  },

  // Get all surveys with filtering and pagination
  getSurveys: async (
    params: GetSurveysParams = {}
  ): Promise<ApiResponse<SurveySubmission[]>> => {
    const response = await api.get("/surveys", { params });
    return response.data;
  },

  // Get a single survey by ID
  getSurvey: async (id: string): Promise<ApiResponse<SurveySubmission>> => {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  },

  // Update survey status
  updateSurveyStatus: async (
    id: string,
    status: "draft" | "submitted" | "reviewed",
    reviewNotes?: string
  ): Promise<ApiResponse<SurveySubmission>> => {
    const response = await api.patch(`/surveys/${id}/status`, {
      status,
      reviewNotes,
    });
    return response.data;
  },

  // Get survey statistics
  getStats: async (): Promise<ApiResponse<SurveyStats>> => {
    const response = await api.get("/surveys/stats/overview");
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<
    ApiResponse<{
      status: string;
      timestamp: string;
      uptime: number;
      environment: string;
    }>
  > => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
