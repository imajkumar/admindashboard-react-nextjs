import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode } from "../../config/theme";

// Types
export interface ThemeState {
  currentTheme: ThemeMode;
  systemTheme: ThemeMode;
  autoDetect: boolean;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Initial state
const initialState: ThemeState = {
  currentTheme: "light",
  systemTheme: "light",
  autoDetect: true,
  customColors: {
    primary: "#1890ff",
    secondary: "#52c41a",
    accent: "#722ed1",
  },
};

// Slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Set theme mode
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.currentTheme = action.payload;
    },
    
    // Toggle between light and dark
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
    },
    
    // Set system theme
    setSystemTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.systemTheme = action.payload;
      if (state.autoDetect) {
        state.currentTheme = action.payload;
      }
    },
    
    // Toggle auto-detect
    toggleAutoDetect: (state) => {
      state.autoDetect = !state.autoDetect;
      if (state.autoDetect) {
        state.currentTheme = state.systemTheme;
      }
    },
    
    // Set custom colors
    setCustomColors: (state, action: PayloadAction<Partial<ThemeState["customColors"]>>) => {
      state.customColors = { ...state.customColors, ...action.payload };
    },
    
    // Reset to default colors
    resetCustomColors: (state) => {
      state.customColors = initialState.customColors;
    },
    
    // Reset theme to default
    resetTheme: () => initialState,
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setSystemTheme,
  toggleAutoDetect,
  setCustomColors,
  resetCustomColors,
  resetTheme,
} = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;

// Export selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectCurrentTheme = (state: { theme: ThemeState }) => state.theme.currentTheme;
export const selectSystemTheme = (state: { theme: ThemeState }) => state.theme.systemTheme;
export const selectAutoDetect = (state: { theme: ThemeState }) => state.theme.autoDetect;
export const selectCustomColors = (state: { theme: ThemeState }) => state.theme.customColors;
