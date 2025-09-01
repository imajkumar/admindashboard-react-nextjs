// Application Constants
export const APP_CONFIG = {
  APP_NAME: "Admin Dashboard",
  APP_VERSION: "1.0.0",
  APP_DESCRIPTION: "Modern Admin Dashboard built with Next.js and Ant Design",
  COMPANY_NAME: "Your Company",
  SUPPORT_EMAIL: "support@yourcompany.com",
} as const;

// API Constants
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://fakeapi.platzi.com/en/rest/auth-jwt",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  ANALYTICS: "/analytics",
  REPORTS: "/reports",
} as const;

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
  GUEST: "guest",
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM DD, YYYY",
  DISPLAY_WITH_TIME: "MMM DD, YYYY HH:mm",
  API: "YYYY-MM-DD",
  API_WITH_TIME: "YYYY-MM-DDTHH:mm:ss",
  TIME_ONLY: "HH:mm",
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  MAX_FILES: 5,
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

// Table Actions
export const TABLE_ACTIONS = {
  VIEW: "view",
  EDIT: "edit",
  DELETE: "delete",
  EXPORT: "export",
  PRINT: "print",
} as const;
