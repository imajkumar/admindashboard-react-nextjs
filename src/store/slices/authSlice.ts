import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../../services/authService";

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

export interface LoginCredentials {
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

export interface RefreshTokenResponse {
  success: boolean;
  user?: UserData;
  token?: string;
  refreshToken?: string;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  userPermissions: [],
  isLoading: false,
  error: null,
  refreshToken: null,
  lastActivity: Date.now(),
};

// Async thunks
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual API
      await fetch("/api/auth/logout", { method: "POST" });
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Logout failed"
      );
    }
  }
);

export const refreshUserToken = createAsyncThunk<
  RefreshTokenResponse,
  string,
  { rejectValue: string }
>(
  "auth/refreshUserToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual API
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Token refresh failed"
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk<
  { isAuthenticated: boolean; user?: UserData },
  void,
  { rejectValue: string }
>(
  "auth/checkUserAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call - replace with actual API
      const response = await fetch("/api/auth/me");
      
      if (response.ok) {
        const user = await response.json();
        return { isAuthenticated: true, user };
      } else {
        return { isAuthenticated: false };
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Auth check failed"
      );
    }
  }
);

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
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Reset auth state
    resetAuth: () => initialState,
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.userPermissions = action.payload.user.permissions || [];
          state.refreshToken = action.payload.refreshToken || null;
          state.lastActivity = Date.now();
        } else {
          state.error = action.payload.message || "Login failed";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
      });

    // Refresh token
    builder
      .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;
          state.userPermissions = action.payload.user.permissions || [];
          state.refreshToken = action.payload.refreshToken || null;
          state.lastActivity = Date.now();
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.userPermissions = [];
          state.refreshToken = null;
        }
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Token refresh failed";
        state.isAuthenticated = false;
        state.user = null;
        state.userPermissions = [];
        state.refreshToken = null;
      });

    // Check auth
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.userPermissions = action.payload.user.permissions || [];
          state.lastActivity = Date.now();
        }
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Auth check failed";
        state.isAuthenticated = false;
        state.user = null;
        state.userPermissions = [];
      });
  },
});

// Export actions
export const {
  clearError,
  updateActivity,
  updateUserPermissions,
  updateUserProfile,
  setLoading,
  resetAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.userPermissions;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
