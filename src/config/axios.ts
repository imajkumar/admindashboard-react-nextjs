import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { message } from "antd";
import { API_CONFIG, HTTP_STATUS, STORAGE_KEYS } from "./constants";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Simple request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to headers if available
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Simple response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle unauthorized errors
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Clear auth data and redirect to login
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    // Handle other errors
    handleApiError(error);
    return Promise.reject(error);
  },
);

// Error response interface
interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Error handler
const handleApiError = (error: AxiosError) => {
  let errorMessage = "An unexpected error occurred";

  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        errorMessage = (data as ErrorResponse)?.message || "Bad request";
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        errorMessage = "Unauthorized access";
        break;
      case HTTP_STATUS.FORBIDDEN:
        errorMessage = "Access forbidden";
        break;
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = "Resource not found";
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        errorMessage = "Internal server error";
        break;
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        errorMessage = "Service temporarily unavailable";
        break;
      default:
        errorMessage = (data as ErrorResponse)?.message || `Error ${status}`;
    }
  } else if (error.request) {
    errorMessage = "Network error - no response received";
  } else {
    errorMessage = error.message || "Request configuration error";
  }

  // Show error message
  message.error(errorMessage);

  // Log error for debugging
  console.error("API Error:", {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
    config: error.config,
  });
};

// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: unknown[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API error wrapper
export interface ApiError {
  success: false;
  message: string;
  errors?: unknown[];
  status: number;
}

// Request wrapper functions
export const apiRequest = {
  // GET request
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  },

  // PUT request
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  },

  // DELETE request
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  // Upload file
  upload: async <T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<ApiResponse<T>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ApiResponse<T>>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  },
};

// Export axios instance for direct use if needed
export default axiosInstance;
