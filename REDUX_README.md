# Redux Toolkit Implementation Guide

This document provides a comprehensive overview of the Redux Toolkit implementation in the AdminFront project, following enterprise-level best practices for large-scale applications.

## 🏗️ Architecture Overview

The Redux implementation follows a modular, scalable architecture designed for enterprise applications with multiple modules and complex state management requirements.

### Folder Structure
```
src/store/
├── index.ts                 # Main store configuration
├── hooks.ts                 # Typed hooks for Redux usage
├── ReduxProvider.tsx        # Redux Provider component
├── slices/                  # Redux slices for different domains
│   ├── authSlice.ts         # Authentication state
│   ├── userSlice.ts         # User management state
│   ├── emailSlice.ts        # Email management state
│   ├── themeSlice.ts        # Theme and UI state
│   ├── languageSlice.ts     # Internationalization state
│   ├── uiSlice.ts           # UI components state
│   └── notificationSlice.ts # Notification system state
└── services/                # RTK Query API services
    ├── authApi.ts           # Authentication API
    ├── userApi.ts           # User management API
    ├── emailApi.ts          # Email management API
    └── dashboardApi.ts      # Dashboard data API
```

## 🚀 Key Features

### 1. **Redux Toolkit (RTK)**
- Modern Redux with simplified syntax
- Built-in Immer for immutable updates
- Automatic action creators and selectors
- DevTools integration

### 2. **RTK Query**
- Built-in data fetching and caching
- Automatic cache invalidation
- Optimistic updates
- Real-time synchronization

### 3. **Redux Persist**
- State persistence across sessions
- Configurable persistence strategies
- Selective state persistence

### 4. **TypeScript Integration**
- Full type safety throughout
- Typed hooks and selectors
- Interface definitions for all state

## 📦 Installation & Setup

### Dependencies
```bash
npm install @reduxjs/toolkit react-redux redux-persist
```

### Store Configuration
```typescript
// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat([
      authApi.middleware,
      userApi.middleware,
      emailApi.middleware,
      dashboardApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});
```

### Provider Setup
```typescript
// src/app/layout.tsx
import { ReduxProvider } from "../store/ReduxProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
```

## 🎯 Usage Patterns

### 1. **Using Typed Hooks**
```typescript
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAuth, useCurrentUser } from "../store/hooks";

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const currentUser = useCurrentUser();
  
  // Component logic
};
```

### 2. **Dispatching Actions**
```typescript
import { useAppDispatch } from "../store/hooks";
import { loginUser, logoutUser } from "../store/slices/authSlice";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  
  const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      // Handle successful login
    }
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
};
```

### 3. **Using RTK Query Hooks**
```typescript
import { useGetUsersQuery, useCreateUserMutation } from "../store/services/userApi";

const UserList = () => {
  const { data: users, isLoading, error } = useGetUsersQuery({
    page: 1,
    limit: 10,
    filters: { role: "admin" }
  });
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  
  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
};
```

## 🔧 State Management Patterns

### 1. **Slice Structure**
```typescript
// Example: authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Async action handlers
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle success
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
```

### 2. **Async Thunks**
```typescript
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);
```

### 3. **Selectors**
```typescript
// Basic selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

// Computed selectors
export const selectFilteredUsers = (state: { user: UserState }) => {
  const { users, filters } = state.user;
  return users.filter((user) => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return user.username.toLowerCase().includes(searchLower);
    }
    return true;
  });
};
```

## 🌐 RTK Query Services

### 1. **API Service Structure**
```typescript
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/users",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "UserList"],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUserResponse, UserListParams>({
      query: (params) => {
        // Build query string
        const searchParams = new URLSearchParams();
        // ... parameter logic
        return `?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "User", id })),
              { type: "UserList", id: "LIST" },
            ]
          : [{ type: "UserList", id: "LIST" }],
    }),
  }),
});
```

### 2. **Cache Management**
```typescript
// Automatic cache invalidation
createUser: builder.mutation<UserData, UserCreateRequest>({
  query: (userData) => ({
    url: "",
    method: "POST",
    body: userData,
  }),
  invalidatesTags: [{ type: "UserList", id: "LIST" }],
}),

// Optimistic updates
updateUser: builder.mutation<UserData, UserUpdateRequest>({
  query: ({ id, updates }) => ({
    url: id,
    method: "PUT",
    body: updates,
  }),
  // Optimistically update cache
  async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      userApi.util.updateQueryData("getUserById", id, (draft) => {
        Object.assign(draft, updates);
      })
    );
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  },
}),
```

## 🔒 State Persistence

### 1. **Persistence Configuration**
```typescript
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "language"], // Only persist these slices
  blacklist: ["ui", "notification"], // Don't persist these
};
```

### 2. **Selective Persistence**
```typescript
// Persist only essential state
whitelist: ["auth", "theme", "language"]

// Don't persist UI state or notifications
blacklist: ["ui", "notification"]
```

## 🎨 Best Practices

### 1. **State Normalization**
```typescript
// Normalize user data for efficient lookups
interface UserState {
  users: Record<string, UserData>; // Normalized by ID
  currentUser: string | null; // Reference by ID
  selectedUsers: string[]; // Array of IDs
}
```

### 2. **Error Handling**
```typescript
// Consistent error handling across slices
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string } // Typed error payload
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // API call
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);
```

### 3. **Loading States**
```typescript
// Track loading states for different operations
interface AuthState {
  isLoading: boolean;
  isRefreshing: boolean;
  isLoggingOut: boolean;
}

// Handle loading states in reducers
.addCase(loginUser.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(loginUser.fulfilled, (state) => {
  state.isLoading = false;
})
.addCase(loginUser.rejected, (state) => {
  state.isLoading = false;
})
```

### 4. **Type Safety**
```typescript
// Full TypeScript integration
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 🚀 Performance Optimization

### 1. **Memoized Selectors**
```typescript
import { createSelector } from "@reduxjs/toolkit";

export const selectFilteredUsers = createSelector(
  [selectUsers, selectFilters],
  (users, filters) => {
    // Expensive filtering logic
    return users.filter(/* ... */);
  }
);
```

### 2. **Lazy Loading**
```typescript
// Load data only when needed
const { data: users } = useGetUsersQuery(
  { page: 1, limit: 10 },
  { skip: !isAuthenticated } // Skip query if not authenticated
);
```

### 3. **Pagination & Infinite Scroll**
```typescript
// Efficient pagination with RTK Query
const { data, isLoading, isFetching } = useGetUsersQuery({
  page: currentPage,
  limit: pageSize,
  filters: currentFilters,
});
```

## 🧪 Testing

### 1. **Slice Testing**
```typescript
import { authSlice, loginUser } from "./authSlice";

describe("authSlice", () => {
  it("should handle initial state", () => {
    expect(authSlice.reducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle loginUser.fulfilled", () => {
    const user = { id: "1", username: "test" };
    const actual = authSlice.reducer(
      initialState,
      loginUser.fulfilled({ success: true, user }, "requestId", {
        username: "test",
        password: "password",
      })
    );
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.user).toEqual(user);
  });
});
```

### 2. **API Testing**
```typescript
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetUsersQuery } from "./userApi";

const server = setupServer(
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.json({ users: [], total: 0, page: 1, limit: 10, totalPages: 0 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches users", async () => {
  const { result } = renderHook(() => useGetUsersQuery({}));
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## 🔧 Development Tools

### 1. **Redux DevTools**
- Built-in DevTools integration
- Time-travel debugging
- State inspection
- Action replay

### 2. **RTK Query DevTools**
- Cache inspection
- Query status monitoring
- Performance metrics
- Network request tracking

## 📚 Migration Guide

### From Context API
```typescript
// Before: Context API
const { theme, setTheme } = useTheme();

// After: Redux
const { currentTheme } = useTheme();
const dispatch = useAppDispatch();
dispatch(setTheme("dark"));
```

### From useState + useEffect
```typescript
// Before: Local state + API calls
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetchUsers().then(setUsers).finally(() => setLoading(false));
}, []);

// After: RTK Query
const { data: users, isLoading } = useGetUsersQuery({});
```

## 🎯 Future Enhancements

### 1. **Real-time Updates**
```typescript
// WebSocket integration with RTK Query
export const realtimeApi = createApi({
  reducerPath: "realtimeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/ws",
  }),
  endpoints: (builder) => ({
    subscribeToUpdates: builder.subscription<UpdateMessage, void>({
      query: () => "updates",
    }),
  }),
});
```

### 2. **Offline Support**
```typescript
// Service Worker integration
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createOfflineApi } from "redux-offline";

export const offlineApi = createOfflineApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  // Offline configuration
});
```

### 3. **Advanced Caching**
```typescript
// Custom cache strategies
export const userApi = createApi({
  // ... other config
  keepUnusedDataFor: 300, // Keep data for 5 minutes
  endpoints: (builder) => ({
    getUsers: builder.query({
      // ... query config
      keepUnusedDataFor: 600, // Override for specific endpoint
    }),
  }),
});
```

## 📖 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Persist Documentation](https://github.com/rt2zz/redux-persist)
- [Redux Style Guide](https://redux.js.org/style-guide/)

## 🤝 Contributing

When adding new features to the Redux store:

1. **Follow the established patterns** in existing slices
2. **Use TypeScript** for all new code
3. **Write tests** for new functionality
4. **Update this documentation** with new patterns
5. **Follow naming conventions** consistently

---

This Redux implementation provides a solid foundation for scalable state management in enterprise applications, with built-in performance optimizations, type safety, and developer experience enhancements.
