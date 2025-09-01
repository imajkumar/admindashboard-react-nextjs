import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LanguageConfig } from "../../contexts/LanguageContext";

// Types
export interface LanguageState {
  currentLanguage: string;
  availableLanguages: LanguageConfig[];
  fallbackLanguage: string;
  translations: Record<string, Record<string, string>>;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: LanguageState = {
  currentLanguage: "en",
  availableLanguages: [
    { code: "en", name: "English", flag: "🇺🇸", direction: "ltr" },
    { code: "ru", name: "Русский", flag: "🇷🇺", direction: "ltr" },
  ],
  fallbackLanguage: "en",
  translations: {},
  isLoading: false,
  error: null,
};

// Slice
const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    // Set current language
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
    
    // Add available language
    addLanguage: (state, action: PayloadAction<LanguageConfig>) => {
      const existingIndex = state.availableLanguages.findIndex(
        (lang) => lang.code === action.payload.code
      );
      
      if (existingIndex >= 0) {
        state.availableLanguages[existingIndex] = action.payload;
      } else {
        state.availableLanguages.push(action.payload);
      }
    },
    
    // Remove language
    removeLanguage: (state, action: PayloadAction<string>) => {
      state.availableLanguages = state.availableLanguages.filter(
        (lang) => lang.code !== action.payload
      );
      
      // If removed language was current, fallback to default
      if (state.currentLanguage === action.payload) {
        state.currentLanguage = state.fallbackLanguage;
      }
    },
    
    // Set fallback language
    setFallbackLanguage: (state, action: PayloadAction<string>) => {
      state.fallbackLanguage = action.payload;
    },
    
    // Add translations
    addTranslations: (state, action: PayloadAction<{ language: string; translations: Record<string, string> }>) => {
      const { language, translations } = action.payload;
      if (!state.translations[language]) {
        state.translations[language] = {};
      }
      state.translations[language] = { ...state.translations[language], ...translations };
    },
    
    // Remove translations for a language
    removeTranslations: (state, action: PayloadAction<string>) => {
      delete state.translations[action.payload];
    },
    
    // Set loading state
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
    
    // Reset language state
    resetLanguage: () => initialState,
  },
});

// Export actions
export const {
  setLanguage,
  addLanguage,
  removeLanguage,
  setFallbackLanguage,
  addTranslations,
  removeTranslations,
  setLoading,
  setError,
  clearError,
  resetLanguage,
} = languageSlice.actions;

// Export reducer
export default languageSlice.reducer;

// Export selectors
export const selectLanguage = (state: { language: LanguageState }) => state.language;
export const selectCurrentLanguage = (state: { language: LanguageState }) => state.language.currentLanguage;
export const selectAvailableLanguages = (state: { language: LanguageState }) => state.language.availableLanguages;
export const selectFallbackLanguage = (state: { language: LanguageState }) => state.language.fallbackLanguage;
export const selectTranslations = (state: { language: LanguageState }) => state.language.translations;
export const selectLanguageLoading = (state: { language: LanguageState }) => state.language.isLoading;
export const selectLanguageError = (state: { language: LanguageState }) => state.language.error;
