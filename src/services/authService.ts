import { type ApiResponse, apiRequest } from "../config/axios";
import { STORAGE_KEYS } from "../config/constants";
import { API_ENDPOINTS } from "./api";

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
  username: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  department?: string;
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store tokens and user data if login successful
      if (data.data?.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.data.token);
        if (data.data.refreshToken) {
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            data.data.refreshToken,
          );
        }
        if (data.data.user) {
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(data.data.user),
          );
        }
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  // Logout user
  static async logout(): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn("Logout API call failed, but clearing local data");
        }
      }

      // Clear local storage
      AuthService.clearAuthData();

      return {
        success: true,
        data: undefined,
        message: "Logout successful",
      };
    } catch (_error) {
      // Even if API call fails, clear local data
      AuthService.clearAuthData();
      return {
        success: true,
        data: undefined,
        message: "Logout successful (local data cleared)",
      };
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
    const token = AuthService.getAuthToken();
    const user = AuthService.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    const user = AuthService.getCurrentUser();
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  static hasAnyRole(roles: string[]): boolean {
    const user = AuthService.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Check if user has permission (for future use)
  static hasPermission(_permission: string): boolean {
    // This can be extended to check specific permissions
    const user = AuthService.getCurrentUser();
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
    const currentUser = AuthService.getCurrentUser();
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
        AuthService.updateUserData(response.data);
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
