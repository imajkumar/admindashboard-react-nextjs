import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserData } from "../../services/authService";

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: UserData;
  token?: string;
  refreshToken?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  user?: UserData;
  token?: string;
  refreshToken?: string;
}

export interface AuthCheckResponse {
  isAuthenticated: boolean;
  user?: UserData;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

// Create API service
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    prepareHeaders: (headers, { getState }) => {
      // Get token from state or localStorage
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    // Logout endpoint
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    
    // Refresh token endpoint
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (refreshData) => ({
        url: "refresh",
        method: "POST",
        body: refreshData,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    // Check authentication status
    checkAuth: builder.query<AuthCheckResponse, void>({
      query: () => "me",
      providesTags: ["Auth"],
    }),
    
    // Get current user profile
    getProfile: builder.query<UserData, void>({
      query: () => "profile",
      providesTags: ["User"],
    }),
    
    // Update user profile
    updateProfile: builder.mutation<UserData, Partial<UserData>>({
      query: (updates) => ({
        url: "profile",
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),
    
    // Change password
    changePassword: builder.mutation<
      { success: boolean; message?: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (passwordData) => ({
        url: "change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    
    // Request password reset
    requestPasswordReset: builder.mutation<
      { success: boolean; message?: string },
      { email: string }
    >({
      query: (emailData) => ({
        url: "request-password-reset",
        method: "POST",
        body: emailData,
      }),
    }),
    
    // Reset password with token
    resetPassword: builder.mutation<
      { success: boolean; message?: string },
      { token: string; newPassword: string }
    >({
      query: (resetData) => ({
        url: "reset-password",
        method: "POST",
        body: resetData,
      }),
    }),
    
    // Verify email
    verifyEmail: builder.mutation<
      { success: boolean; message?: string },
      { token: string }
    >({
      query: (verifyData) => ({
        url: "verify-email",
        method: "POST",
        body: verifyData,
      }),
      invalidatesTags: ["User"],
    }),
    
    // Resend verification email
    resendVerification: builder.mutation<
      { success: boolean; message?: string },
      { email: string }
    >({
      query: (emailData) => ({
        url: "resend-verification",
        method: "POST",
        body: emailData,
      }),
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useCheckAuthQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
