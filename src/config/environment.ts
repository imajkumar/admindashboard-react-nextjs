// Environment configuration
export const ENV_CONFIG = {
  // API Configuration
  API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://fakeapi.platzi.com/en/rest/auth-jwt",
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10),

  // App Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_TEST: process.env.NODE_ENV === "test",

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
  ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true",

  // External Services
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || "",

  // App Settings
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Admin Dashboard",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Company",

  // Security
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  SESSION_SECRET: process.env.SESSION_SECRET || "your-session-secret",

  // File Upload
  MAX_FILE_SIZE: parseInt(
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "10485760",
    10,
  ), // 10MB
  ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(
    ",",
  ) || ["image/jpeg", "image/png", "image/gif", "application/pdf"],

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(
    process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || "10",
    10,
  ),
  MAX_PAGE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || "100", 10),

  // Cache
  CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || "300000", 10), // 5 minutes

  // Real-time
  ENABLE_WEBSOCKET: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === "true",
  WEBSOCKET_URL:
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000/ws",

  // Logging
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
  ENABLE_CONSOLE_LOG: process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOG === "true",

  // Performance
  ENABLE_PERFORMANCE_MONITORING:
    process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
  PERFORMANCE_SAMPLE_RATE: parseFloat(
    process.env.NEXT_PUBLIC_PERFORMANCE_SAMPLE_RATE || "0.1",
  ),
} as const;

// Environment validation
export const validateEnvironment = (): void => {
  const requiredEnvVars = ["NEXT_PUBLIC_API_URL"];

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(", ")}. Using default values.`,
    );
  }

  // Validate API URL format
  try {
    new URL(ENV_CONFIG.API_URL);
  } catch (_error) {
    console.error(`Invalid API URL: ${ENV_CONFIG.API_URL}`);
  }

  // Validate numeric values
  if (ENV_CONFIG.API_TIMEOUT <= 0) {
    console.error("API_TIMEOUT must be greater than 0");
  }

  if (ENV_CONFIG.MAX_FILE_SIZE <= 0) {
    console.error("MAX_FILE_SIZE must be greater than 0");
  }

  if (ENV_CONFIG.DEFAULT_PAGE_SIZE <= 0) {
    console.error("DEFAULT_PAGE_SIZE must be greater than 0");
  }

  if (ENV_CONFIG.MAX_PAGE_SIZE <= 0) {
    console.error("MAX_PAGE_SIZE must be greater than 0");
  }

  if (ENV_CONFIG.CACHE_TTL <= 0) {
    console.error("CACHE_TTL must be greater than 0");
  }

  if (
    ENV_CONFIG.PERFORMANCE_SAMPLE_RATE < 0 ||
    ENV_CONFIG.PERFORMANCE_SAMPLE_RATE > 1
  ) {
    console.error("PERFORMANCE_SAMPLE_RATE must be between 0 and 1");
  }
};

// Development helpers
export const isDev = (): boolean => ENV_CONFIG.IS_DEVELOPMENT;
export const isProd = (): boolean => ENV_CONFIG.IS_PRODUCTION;
export const isTest = (): boolean => ENV_CONFIG.IS_TEST;

// Debug logging
export const debugLog = (message: string, data?: unknown): void => {
  if (ENV_CONFIG.ENABLE_DEBUG && ENV_CONFIG.ENABLE_CONSOLE_LOG) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Error logging
export const errorLog = (message: string, error?: unknown): void => {
  if (ENV_CONFIG.ENABLE_CONSOLE_LOG) {
    console.error(`[ERROR] ${message}`, error);
  }
};

// Performance monitoring
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  if (!ENV_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
    return fn();
  }

  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (Math.random() < ENV_CONFIG.PERFORMANCE_SAMPLE_RATE) {
    console.log(`[PERF] ${name}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

// Export default
export default ENV_CONFIG;
