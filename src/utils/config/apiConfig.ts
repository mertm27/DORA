import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { IErrorResponse } from "../../types/error/IErrorTypes";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

/**
 * ===================================
 * AXIOS CONFIG FOR GENERAL-APIS
 * ===================================
 */
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 35000,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    if (response) {
      const errorData: IErrorResponse = response.data;
      if (response.status === 400 && errorData.error === "BAD_REQUEST") {
        console.error(`Error: ${errorData.message}`);
      } else if (response.status === 401) {
        console.error("Unauthorized: Access token is missing or invalid.");
      } else if (errorData.message) {
        console.error(`Unexpected error: ${errorData.message}`);
      }
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export { apiInstance, QueryClient, queryClient, QueryClientProvider };
