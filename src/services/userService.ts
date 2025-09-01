import {
  API_ENDPOINTS,
  BaseApiService,
  type ListParams,
  type PaginatedResponse,
} from "./api";
import { type ApiResponse, apiRequest } from "../config/axios";
import type { UserData } from "./authService";

// User types
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
  avatar?: string;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  createdAt?: {
    from: string;
    to: string;
  };
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
}

// User service class extending BaseApiService
export class UserService extends BaseApiService {
  constructor() {
    super(API_ENDPOINTS.USERS.BASE);
  }

  // Get users with filters
  async getUsers(
    params: ListParams & { filters?: UserFilters } = {},
  ): Promise<ApiResponse<PaginatedResponse<UserData>>> {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUsers: UserData[] = [
      {
        id: "1",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "admin",
        avatar: "",
        isActive: true,
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 2592000000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "2",
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "manager",
        avatar: "",
        isActive: true,
        lastLogin: new Date(Date.now() - 172800000).toISOString(),
        createdAt: new Date(Date.now() - 5184000000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "3",
        email: "bob.johnson@example.com",
        firstName: "Bob",
        lastName: "Johnson",
        role: "user",
        avatar: "",
        isActive: false,
        lastLogin: new Date(Date.now() - 604800000).toISOString(),
        createdAt: new Date(Date.now() - 7776000000).toISOString(),
        updatedAt: new Date(Date.now() - 604800000).toISOString(),
      },
    ];

    // Apply filters
    let filteredUsers = mockUsers;

    if (params.filters?.role) {
      filteredUsers = filteredUsers.filter(
        (user) => user.role === params.filters?.role,
      );
    }

    if (params.filters?.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === params.filters?.isActive,
      );
    }

    if (params.filters?.search) {
      const searchTerm = params.filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm),
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const mockResponse: ApiResponse<PaginatedResponse<UserData>> = {
      success: true,
      data: {
        data: paginatedUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit),
        },
      },
      message: "Users retrieved successfully",
    };

    return mockResponse;
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<UserData>> {
    return this.getById<UserData>(id);
  }

  // Create new user
  async createUser(data: CreateUserData): Promise<ApiResponse<UserData>> {
    return this.create<UserData>(data);
  }

  // Update user
  async updateUser(
    id: string,
    data: UpdateUserData,
  ): Promise<ApiResponse<UserData>> {
    return this.update<UserData>(id, data);
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(id);
  }

  // Bulk delete users
  async bulkDeleteUsers(ids: string[]): Promise<ApiResponse<void>> {
    return this.bulkDelete<void>(ids);
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<UserData>> {
    return apiRequest.get<UserData>(API_ENDPOINTS.USERS.PROFILE);
  }

  // Update user profile
  async updateUserProfile(
    data: UpdateUserData,
  ): Promise<ApiResponse<UserData>> {
    return apiRequest.put<UserData>(API_ENDPOINTS.USERS.PROFILE, data);
  }

  // Update user avatar
  async updateUserAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiRequest.post<{ avatar: string }>(
      API_ENDPOINTS.USERS.AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  // Get user preferences
  async getUserPreferences(): Promise<ApiResponse<unknown>> {
    return apiRequest.get<unknown>(API_ENDPOINTS.USERS.PREFERENCES);
  }

  // Update user preferences
  async updateUserPreferences(
    preferences: unknown,
  ): Promise<ApiResponse<unknown>> {
    return apiRequest.put<unknown>(
      API_ENDPOINTS.USERS.PREFERENCES,
      preferences,
    );
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiRequest.get<UserStats>(`${this.endpoint}/stats`);
  }

  // Search users
  async searchUsers(
    query: string,
    filters?: UserFilters,
  ): Promise<ApiResponse<UserData[]>> {
    const params = new URLSearchParams();
    params.append("search", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "object") {
            params.append(`${key}[from]`, value.from);
            params.append(`${key}[to]`, value.to);
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    return apiRequest.get<UserData[]>(
      `${this.endpoint}/search?${params.toString()}`,
    );
  }

  // Export users
  async exportUsers(
    format: "csv" | "excel" = "csv",
    filters?: UserFilters,
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const params = new URLSearchParams();
    params.append("format", format);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "object") {
            params.append(`${key}[from]`, value.from);
            params.append(`${key}[to]`, value.to);
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    return apiRequest.get<{ downloadUrl: string }>(
      `${this.endpoint}/export?${params.toString()}`,
    );
  }

  // Import users
  async importUsers(
    file: File,
  ): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest.post<{ imported: number; errors: string[] }>(
      `${this.endpoint}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  // Get user activity
  async getUserActivity(
    userId: string,
    limit: number = 10,
  ): Promise<ApiResponse<unknown[]>> {
    return apiRequest.get<unknown[]>(
      `${this.endpoint}/${userId}/activity?limit=${limit}`,
    );
  }

  // Send password reset email
  async sendPasswordReset(userId: string): Promise<ApiResponse<void>> {
    return apiRequest.post<void>(
      `${this.endpoint}/${userId}/send-password-reset`,
    );
  }

  // Activate/Deactivate user
  async toggleUserStatus(
    userId: string,
    isActive: boolean,
  ): Promise<ApiResponse<UserData>> {
    return this.patch<UserData>(userId, { isActive });
  }

  // Change user role
  async changeUserRole(
    userId: string,
    role: string,
  ): Promise<ApiResponse<UserData>> {
    return this.patch<UserData>(userId, { role });
  }
}

// Export default instance
export default new UserService();
