"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { ConfigProvider } from "antd";
import { getThemeConfig, type ThemeMode } from "../config/theme";
import { STORAGE_KEYS } from "../config/constants";

// Theme context interface
interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setThemeMode(savedTheme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setThemeMode(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    }
  }, [themeMode, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        setThemeMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Set specific theme mode
  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  // Get current theme configuration
  const currentTheme = getThemeConfig(themeMode);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const contextValue: ThemeContextType = {
    themeMode,
    toggleTheme,
    setThemeMode: handleSetThemeMode,
    isDark: themeMode === "dark",
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={currentTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Export theme provider
export default ThemeProvider;
