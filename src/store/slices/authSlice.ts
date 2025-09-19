// src/store/slices/authSlice.ts
import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { UserData } from "../../services/business/authService";
import { STORAGE_KEYS } from "../../config/constants";

// Types
export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  userPermissions: string[];
  isLoading: boolean;
  error: string | null;
  refreshToken: string | null;
  lastActivity: number;
}

// Helper function to get initial state from localStorage
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      userPermissions: [],
      isLoading: false,
      error: null,
      refreshToken: null,
      lastActivity: Date.now(),
    };
  }

  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (token && userData) {
      const user = JSON.parse(userData);
      return {
        isAuthenticated: true,
        user,
        userPermissions: user.permissions || [],
        isLoading: false,
        error: null,
        refreshToken,
        lastActivity: Date.now(),
      };
    }
  } catch (error) {
    console.error("Error parsing stored auth data:", error);
  }

  return {
    isAuthenticated: false,
    user: null,
    userPermissions: [],
    isLoading: false,
    error: null,
    refreshToken: null,
    lastActivity: Date.now(),
  };
};

// Initial state
const initialState: AuthState = getInitialState();

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update user activity
    updateActivity: (state) => {
      state.lastActivity = Date.now();
    },

    // Update user permissions
    updateUserPermissions: (state, action: PayloadAction<string[]>) => {
      state.userPermissions = action.payload;
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
        }
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Login success - called from RTK Query
    loginSuccess: (state, action: PayloadAction<{ user: UserData; token: string; refreshToken?: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userPermissions = (action.payload.user as any).permissions || [];
      state.refreshToken = action.payload.refreshToken || null;
      state.lastActivity = Date.now();
      state.error = null;
      state.isLoading = false;

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(action.payload.user));
        if (action.payload.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
        }
      }
    },

    // Logout - called from RTK Query
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userPermissions = [];
      state.refreshToken = null;
      state.error = null;
      state.isLoading = false;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    },

    // Set auth error
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Reset auth state
    resetAuth: () => {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
      return initialState;
    },
  },
});

// Export actions
export const {
  clearError,
  updateActivity,
  updateUserPermissions,
  updateUserProfile,
  setLoading,
  loginSuccess,
  logoutSuccess,
  setAuthError,
  resetAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectUserPermissions = (state: { auth: AuthState }) =>
  state.auth.userPermissions;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
