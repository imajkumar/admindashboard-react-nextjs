import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// Import API services
import { authApi } from "./services/authApi";
// import { emailApi } from "./services/emailApi";
import { dashboardApi } from "./services/dashboardApi";
import { userApi } from "./services/userApi";
// Import slices
import authSlice from "./slices/authSlice";
import languageSlice from "./slices/languageSlice";
import notificationSlice from "./slices/notificationSlice";
// import emailSlice from "./slices/emailSlice";
import themeSlice from "./slices/themeSlice";
import uiSlice from "./slices/uiSlice";
import userSlice from "./slices/userSlice";

// Root reducer
const rootReducer = combineReducers({
  // Core slices
  auth: authSlice,
  user: userSlice,
  // email: emailSlice,
  theme: themeSlice,
  language: languageSlice,
  ui: uiSlice,
  notification: notificationSlice,

  // API services
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  // [emailApi.reducerPath]: emailApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "language"], // Only persist these slices
  blacklist: ["ui", "notification"], // Don't persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["ui", "notification"],
      },
    }).concat([
      authApi.middleware,
      userApi.middleware,
      // emailApi.middleware,
      dashboardApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Root state type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store and persistor
export default store;
