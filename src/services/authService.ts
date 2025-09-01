import { apiRequest, ApiResponse } from "../config/axios";
import { API_ENDPOINTS } from "./api";
import { STORAGE_KEYS } from "../config/constants";

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
  expiresIn: number;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth service class
export class AuthService {
  // Login user
  static async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      // For Platzi fake API, we'll simulate the login process
      // In a real app, this would call the actual API
      if (credentials.email && credentials.password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create mock response for demo purposes
        const mockResponse: ApiResponse<LoginResponse> = {
          success: true,
          data: {
            accessToken: "mock-jwt-token-" + Date.now(),
            refreshToken: "mock-refresh-token-" + Date.now(),
            user: {
              id: "1",
              email: credentials.email,
              firstName: credentials.email.split("@")[0],
              lastName: "User",
              role: "admin",
              avatar: "",
              isActive: true,
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            expiresIn: 3600,
          },
          message: "Login successful",
        };

        // Store tokens and user data
        localStorage.setItem(
          STORAGE_KEYS.AUTH_TOKEN,
          mockResponse.data.accessToken,
        );
        localStorage.setItem(
          STORAGE_KEYS.REFRESH_TOKEN,
          mockResponse.data.refreshToken,
        );
        localStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(mockResponse.data.user),
        );

        return mockResponse;
      } else {
        throw new Error("Email and password are required");
      }
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<ApiResponse<void>> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clear local storage
      this.clearAuthData();

      // Return mock response
      return {
        success: true,
        data: undefined,
        message: "Logout successful",
      };
    } catch (error) {
      // Even if API call fails, clear local data
      this.clearAuthData();
      throw error;
    }
  }

  // Register new user
  static async register(data: RegisterData): Promise<ApiResponse<UserData>> {
    return apiRequest.post<UserData>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  // Change password
  static async changePassword(
    data: ChangePasswordData,
  ): Promise<ApiResponse<void>> {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  // Forgot password
  static async forgotPassword(
    data: ForgotPasswordData,
  ): Promise<ApiResponse<void>> {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  }

  // Reset password
  static async resetPassword(
    data: ResetPasswordData,
  ): Promise<ApiResponse<void>> {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  }

  // Verify email
  static async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  // Get current user data
  static getCurrentUser(): UserData | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Get auth token
  static getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  static hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Check if user has permission (for future use)
  static hasPermission(permission: string): boolean {
    // This can be extended to check specific permissions
    const user = this.getCurrentUser();
    return user?.role === "admin" || user?.role === "super_admin";
  }

  // Clear all auth data
  static clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Update user data in storage
  static updateUserData(userData: Partial<UserData>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
  }

  // Refresh user data from server
  static async refreshUserData(): Promise<UserData | null> {
    try {
      const response = await apiRequest.get<UserData>(
        API_ENDPOINTS.USERS.PROFILE,
      );
      if (response.success && response.data) {
        this.updateUserData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  }
}

// Export default instance
export default AuthService;
