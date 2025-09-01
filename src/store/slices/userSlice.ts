import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "../../services/authService";

// Types
export interface UserState {
  users: UserData[];
  currentUser: UserData | null;
  selectedUsers: string[];
  filters: {
    role: string;
    department: string;
    status: "active" | "inactive" | "all";
    search: string;
  };
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  sort: {
    field: string;
    order: "ascend" | "descend";
  };
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  selectedUsers: [],
  filters: {
    role: "",
    department: "",
    status: "all",
    search: "",
  },
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  sort: {
    field: "createdAt",
    order: "descend",
  },
  isLoading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set users
    setUsers: (state, action: PayloadAction<UserData[]>) => {
      state.users = action.payload;
    },
    
    // Add user
    addUser: (state, action: PayloadAction<UserData>) => {
      state.users.unshift(action.payload);
      state.pagination.total += 1;
    },
    
    // Update user
    updateUser: (state, action: PayloadAction<{ id: string; updates: Partial<UserData> }>) => {
      const { id, updates } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
      }
    },
    
    // Remove user
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.selectedUsers = state.selectedUsers.filter((id) => id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    
    // Remove multiple users
    removeUsers: (state, action: PayloadAction<string[]>) => {
      const idsToRemove = new Set(action.payload);
      state.users = state.users.filter((user) => !idsToRemove.has(user.id));
      state.selectedUsers = state.selectedUsers.filter((id) => !idsToRemove.has(id));
      state.pagination.total = Math.max(0, state.pagination.total - action.payload.length);
    },
    
    // Set current user
    setCurrentUser: (state, action: PayloadAction<UserData | null>) => {
      state.currentUser = action.payload;
    },
    
    // Update current user
    updateCurrentUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    
    // Set selected users
    setSelectedUsers: (state, action: PayloadAction<string[]>) => {
      state.selectedUsers = action.payload;
    },
    
    // Add selected user
    addSelectedUser: (state, action: PayloadAction<string>) => {
      if (!state.selectedUsers.includes(action.payload)) {
        state.selectedUsers.push(action.payload);
      }
    },
    
    // Remove selected user
    removeSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUsers = state.selectedUsers.filter((id) => id !== action.payload);
    },
    
    // Clear selected users
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<UserState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.current = 1; // Reset to first page when filters change
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.current = 1;
    },
    
    // Set pagination
    setPagination: (state, action: PayloadAction<Partial<UserState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Set sort
    setSort: (state, action: PayloadAction<UserState["sort"]>) => {
      state.sort = action.payload;
    },
    
    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset user state
    resetUser: () => initialState,
  },
});

// Export actions
export const {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  removeUsers,
  setCurrentUser,
  updateCurrentUser,
  setSelectedUsers,
  addSelectedUser,
  removeSelectedUser,
  clearSelectedUsers,
  setFilters,
  clearFilters,
  setPagination,
  setSort,
  setLoading,
  setError,
  clearError,
  resetUser,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Export selectors
export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectSelectedUsers = (state: { user: UserState }) => state.user.selectedUsers;
export const selectFilters = (state: { user: UserState }) => state.user.filters;
export const selectPagination = (state: { user: UserState }) => state.user.pagination;
export const selectSort = (state: { user: UserState }) => state.user.sort;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

// Computed selectors
export const selectFilteredUsers = (state: { user: UserState }) => {
  const { users, filters } = state.user;
  return users.filter((user) => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.department && user.department !== filters.department) return false;
    if (filters.status !== "all" && user.isActive !== (filters.status === "active")) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

export const selectUserById = (state: { user: UserState }, userId: string) =>
  state.user.users.find((user) => user.id === userId);

export const selectUsersByRole = (state: { user: UserState }, role: string) =>
  state.user.users.filter((user) => user.role === role);

export const selectActiveUsers = (state: { user: UserState }) =>
  state.user.users.filter((user) => user.isActive);
