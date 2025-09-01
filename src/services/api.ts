import { apiRequest, type ApiResponse } from "../config/axios";

// Base API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // User endpoints
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
    PREFERENCES: "/users/preferences",
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: "/dashboard/stats",
    CHARTS: "/dashboard/charts",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
    NOTIFICATIONS: "/dashboard/notifications",
  },

  // Settings endpoints
  SETTINGS: {
    GENERAL: "/settings/general",
    SECURITY: "/settings/security",
    NOTIFICATIONS: "/settings/notifications",
    APPEARANCE: "/settings/appearance",
  },

  // File upload endpoints
  UPLOAD: {
    IMAGE: "/upload/image",
    DOCUMENT: "/upload/document",
    AVATAR: "/upload/avatar",
  },

  // Platzi fake API specific endpoints
  PLATZI: {
    AUTH: "/auth",
    USERS: "/users",
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    ORDERS: "/orders",
  },
} as const;

// Common API response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, unknown>;
}

// Base API service class
export class BaseApiService {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Get list with pagination
  async getList<T>(
    params: ListParams = {},
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.endpoint}?${queryParams.toString()}`;
    return apiRequest.get<PaginatedResponse<T>>(url);
  }

  // Get single item by ID
  async getById<T>(id: string | number): Promise<ApiResponse<T>> {
    return apiRequest.get<T>(`${this.endpoint}/${id}`);
  }

  // Create new item
  async create<T>(data: unknown): Promise<ApiResponse<T>> {
    return apiRequest.post<T>(this.endpoint, data);
  }

  // Update item by ID
  async update<T>(id: string | number, data: unknown): Promise<ApiResponse<T>> {
    return apiRequest.put<T>(`${this.endpoint}/${id}`, data);
  }

  // Patch item by ID
  async patch<T>(id: string | number, data: unknown): Promise<ApiResponse<T>> {
    return apiRequest.patch<T>(`${this.endpoint}/${id}`, data);
  }

  // Delete item by ID
  async delete<T>(id: string | number): Promise<ApiResponse<T>> {
    return apiRequest.delete<T>(`${this.endpoint}/${id}`);
  }

  // Bulk operations
  async bulkDelete<T>(ids: (string | number)[]): Promise<ApiResponse<T>> {
    return apiRequest.post<T>(`${this.endpoint}/bulk-delete`, { ids });
  }

  async bulkUpdate<T>(
    items: Array<{ id: string | number; data: unknown }>,
  ): Promise<ApiResponse<T>> {
    return apiRequest.put<T>(`${this.endpoint}/bulk-update`, { items });
  }
}

// Export API endpoints for use in other services
export default API_ENDPOINTS;
