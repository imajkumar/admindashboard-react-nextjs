import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService, type UserData } from "../services/authService";

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  userPermissions: string[];
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    userPermissions: [],
    isLoading: true,
  });

  const router = useRouter();

  // Get user permissions based on role
  const getUserPermissions = (role: string): string[] => {
    const permissionMap: { [key: string]: string[] } = {
      super_admin: [
        // Dashboard
        "dashboard:read",
        "dashboard:write",
        "dashboard:admin",
        // Users
        "users:read",
        "users:write",
        "users:delete",
        "users:admin",
        // Content
        "content:read",
        "content:write",
        "content:delete",
        "content:admin",
        // E-commerce
        "ecommerce:read",
        "ecommerce:write",
        "ecommerce:delete",
        "ecommerce:admin",
        // Analytics
        "analytics:read",
        "analytics:write",
        "analytics:admin",
        // Settings
        "settings:read",
        "settings:write",
        "settings:admin",
        // Help
        "help:read",
        "help:write",
        "help:admin",
      ],
      admin: [
        // Dashboard
        "dashboard:read",
        "dashboard:write",
        // Users
        "users:read",
        "users:write",
        "users:delete",
        // Content
        "content:read",
        "content:write",
        "content:delete",
        // E-commerce
        "ecommerce:read",
        "ecommerce:write",
        "ecommerce:delete",
        // Analytics
        "analytics:read",
        "analytics:write",
        // Settings
        "settings:read",
        "settings:write",
        // Help
        "help:read",
        "help:write",
      ],
      manager: [
        // Dashboard
        "dashboard:read",
        // Users
        "users:read",
        "users:write",
        // Content
        "content:read",
        "content:write",
        // E-commerce
        "ecommerce:read",
        "ecommerce:write",
        // Analytics
        "analytics:read",
        // Settings
        "settings:read",
        // Help
        "help:read",
      ],
      user: [
        // Dashboard
        "dashboard:read",
        // Users
        "users:read",
        // Content
        "content:read",
        // E-commerce
        "ecommerce:read",
        // Analytics
        "analytics:read",
        // Settings
        "settings:read",
        // Help
        "help:read",
      ],
      guest: [
        // Dashboard
        "dashboard:read",
        // Help
        "help:read",
      ],
    };

    return permissionMap[role] || permissionMap.guest;
  };

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const isLoggedIn = AuthService.isAuthenticated();
      if (!isLoggedIn) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          userPermissions: [],
          isLoading: false,
        });
        return;
      }

      const user = AuthService.getCurrentUser();
      if (user) {
        const permissions = getUserPermissions(user.role);
        setAuthState({
          isAuthenticated: true,
          user,
          userPermissions: permissions,
          isLoading: false,
        });
      } else {
        // Try to refresh user data
        const refreshedUser = await AuthService.refreshUserData();
        if (refreshedUser) {
          const permissions = getUserPermissions(refreshedUser.role);
          setAuthState({
            isAuthenticated: true,
            user: refreshedUser,
            userPermissions: permissions,
            isLoading: false,
          });
        } else {
          // Clear auth state if refresh fails
          await logout();
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await logout();
    }
  }, [getUserPermissions]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await AuthService.login({ email, password });

      if (response.success && response.data) {
        const user = response.data.user;
        const permissions = getUserPermissions(user.role);

        setAuthState({
          isAuthenticated: true,
          user,
          userPermissions: permissions,
          isLoading: false,
        });

        return { success: true };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, message: "Login failed" };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        userPermissions: [],
        isLoading: false,
      });

      // Clear any stored data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login
      router.push("/");
    }
  }, [router]);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission: string): boolean => {
      return authState.userPermissions.includes(permission);
    },
    [authState.userPermissions],
  );

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      return permissions.some((permission) =>
        authState.userPermissions.includes(permission),
      );
    },
    [authState.userPermissions],
  );

  // Check if user has all of the specified permissions
  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      return permissions.every((permission) =>
        authState.userPermissions.includes(permission),
      );
    },
    [authState.userPermissions],
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string): boolean => {
      return authState.user?.role === role;
    },
    [authState.user],
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      return authState.user ? roles.includes(authState.user.role) : false;
    },
    [authState.user],
  );

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...authState,
    login,
    logout,
    checkAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
};
