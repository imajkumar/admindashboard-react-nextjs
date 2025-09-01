import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Selector helpers for common state access
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.user);
export const useEmail = () => useAppSelector((state) => state.email);
export const useTheme = () => useAppSelector((state) => state.theme);
export const useLanguage = () => useAppSelector((state) => state.language);
export const useUI = () => useAppSelector((state) => state.ui);
export const useNotification = () => useAppSelector((state) => state.notification);

// Selector helpers for specific state values
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
export const useCurrentUser = () => useAppSelector((state) => state.auth.user);
export const useUserPermissions = () => useAppSelector((state) => state.auth.userPermissions);
export const useCurrentTheme = () => useAppSelector((state) => state.theme.currentTheme);
export const useCurrentLanguage = () => useAppSelector((state) => state.language.currentLanguage);
export const useSidebarCollapsed = () => useAppSelector((state) => state.ui.sidebarCollapsed);
export const useNotifications = () => useAppSelector((state) => state.notification.notifications);
