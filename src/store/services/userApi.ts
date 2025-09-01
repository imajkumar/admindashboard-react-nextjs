import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserData } from "../../services/authService";

// Types
export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  isActive?: boolean;
}

export interface UserUpdateRequest {
  id: string;
  updates: Partial<Omit<UserCreateRequest, "password">>;
}

export interface UserFilters {
  role?: string;
  department?: string;
  isActive?: boolean;
  search?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: UserFilters;
}

export interface PaginatedUserResponse {
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserBulkOperationRequest {
  userIds: string[];
  operation: "activate" | "deactivate" | "delete" | "changeRole" | "changeDepartment";
  data?: {
    role?: string;
    department?: string;
  };
}

export interface UserBulkOperationResponse {
  success: boolean;
  message?: string;
  results: Array<{
    userId: string;
    success: boolean;
    message?: string;
  }>;
}

// Create API service
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/users",
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "UserList"],
  endpoints: (builder) => ({
    // Get users with pagination and filters
    getUsers: builder.query<PaginatedUserResponse, UserListParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
        
        if (params.filters) {
          if (params.filters.role) searchParams.append("role", params.filters.role);
          if (params.filters.department) searchParams.append("department", params.filters.department);
          if (params.filters.isActive !== undefined) searchParams.append("isActive", params.filters.isActive.toString());
          if (params.filters.search) searchParams.append("search", params.filters.search);
        }
        
        return `?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "User" as const, id })),
              { type: "UserList", id: "LIST" },
            ]
          : [{ type: "UserList", id: "LIST" }],
    }),
    
    // Get user by ID
    getUserById: builder.query<UserData, string>({
      query: (id) => id,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    
    // Create new user
    createUser: builder.mutation<UserData, UserCreateRequest>({
      query: (userData) => ({
        url: "",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Update user
    updateUser: builder.mutation<UserData, UserUpdateRequest>({
      query: ({ id, updates }) => ({
        url: id,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "UserList", id: "LIST" },
      ],
    }),
    
    // Delete user
    deleteUser: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: id,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "UserList", id: "LIST" },
      ],
    }),
    
    // Bulk operations
    bulkOperation: builder.mutation<UserBulkOperationResponse, UserBulkOperationRequest>({
      query: (bulkData) => ({
        url: "bulk",
        method: "POST",
        body: bulkData,
      }),
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Get users by role
    getUsersByRole: builder.query<UserData[], string>({
      query: (role) => `by-role/${role}`,
      providesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Get users by department
    getUsersByDepartment: builder.query<UserData[], string>({
      query: (department) => `by-department/${department}`,
      providesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Get active users
    getActiveUsers: builder.query<UserData[], void>({
      query: () => "active",
      providesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Get user statistics
    getUserStats: builder.query<
      {
        total: number;
        active: number;
        inactive: number;
        byRole: Record<string, number>;
        byDepartment: Record<string, number>;
      },
      void
    >({
      query: () => "stats",
      providesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Search users
    searchUsers: builder.query<UserData[], string>({
      query: (searchTerm) => `search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Export users
    exportUsers: builder.mutation<
      { success: boolean; downloadUrl?: string; message?: string },
      { format: "csv" | "excel" | "pdf"; filters?: UserFilters }
    >({
      query: (exportData) => ({
        url: "export",
        method: "POST",
        body: exportData,
      }),
    }),
    
    // Import users
    importUsers: builder.mutation<
      { success: boolean; message?: string; imported: number; errors: string[] },
      FormData
    >({
      query: (formData) => ({
        url: "import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
    
    // Get user activity
    getUserActivity: builder.query<
      Array<{
        id: string;
        action: string;
        timestamp: Date;
        details: Record<string, unknown>;
      }>,
      { userId: string; limit?: number }
    >({
      query: ({ userId, limit = 10 }) => `${userId}/activity?limit=${limit}`,
      providesTags: (result, error, { userId }) => [{ type: "User", id: userId }],
    }),
    
    // Get user preferences
    getUserPreferences: builder.query<Record<string, unknown>, string>({
      query: (userId) => `${userId}/preferences`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    
    // Update user preferences
    updateUserPreferences: builder.mutation<
      { success: boolean; message?: string },
      { userId: string; preferences: Record<string, unknown> }
    >({
      query: ({ userId, preferences }) => ({
        url: `${userId}/preferences`,
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "User", id: userId }],
    }),
  }),
});

// Export hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkOperationMutation,
  useGetUsersByRoleQuery,
  useGetUsersByDepartmentQuery,
  useGetActiveUsersQuery,
  useGetUserStatsQuery,
  useSearchUsersQuery,
  useExportUsersMutation,
  useImportUsersMutation,
  useGetUserActivityQuery,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
} = userApi;
