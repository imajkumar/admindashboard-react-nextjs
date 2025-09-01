// Internationalization Configuration
export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
  dateFormat: string;
  timeFormat: string;
  currency: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    precision: number;
  };
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

// Supported Languages Configuration - English and Russian only
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "HH:mm:ss",
    currency: "USD",
    numberFormat: {
      decimal: ".",
      thousands: ",",
      precision: 2,
    },
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    direction: "ltr",
    dateFormat: "DD.MM.YYYY",
    timeFormat: "HH:mm:ss",
    currency: "RUB",
    numberFormat: {
      decimal: ",",
      thousands: " ",
      precision: 2,
    },
  },
];

// Default Language
export const DEFAULT_LANGUAGE = "en";

// Language Detection
export const detectLanguage = (): string => {
  // Check localStorage first
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("preferred-language");
    if (stored && SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) {
      return stored;
    }
  }

  // Check browser language
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.split("-")[0];
    if (SUPPORTED_LANGUAGES.some((lang) => lang.code === browserLang)) {
      return browserLang;
    }
  }

  // Fallback to default
  return DEFAULT_LANGUAGE;
};

// Get language config by code
export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
};

// Get current language config
export const getCurrentLanguage = (): LanguageConfig => {
  const currentCode = detectLanguage();
  const fallback =
    getLanguageByCode(currentCode) ||
    getLanguageByCode(DEFAULT_LANGUAGE) ||
    getLanguageByCode("en");
  if (!fallback) {
    throw new Error("No language configuration found");
  }
  return fallback;
};

// Format number according to language
export const formatNumber = (
  value: number,
  languageCode: string = DEFAULT_LANGUAGE,
): string => {
  const lang = getLanguageByCode(languageCode);
  if (!lang) return value.toString();

  const { decimal, thousands, precision } = lang.numberFormat;

  return value
    .toLocaleString(languageCode, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      useGrouping: true,
    })
    .replace(/\./g, thousands)
    .replace(/,/g, decimal);
};

// Format currency according to language
export const formatCurrency = (
  value: number,
  languageCode: string = DEFAULT_LANGUAGE,
): string => {
  const lang = getLanguageByCode(languageCode);
  if (!lang) return `$${value.toFixed(2)}`;

  return new Intl.NumberFormat(languageCode, {
    style: "currency",
    currency: lang.currency,
    minimumFractionDigits: lang.numberFormat.precision,
    maximumFractionDigits: lang.numberFormat.precision,
  }).format(value);
};

// Format date according to language
export const formatDate = (
  date: Date,
  languageCode: string = DEFAULT_LANGUAGE,
): string => {
  const lang = getLanguageByCode(languageCode);
  if (!lang) return date.toLocaleDateString();

  return new Intl.DateTimeFormat(languageCode, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// Format time according to language
export const formatTime = (
  date: Date,
  languageCode: string = DEFAULT_LANGUAGE,
): string => {
  const lang = getLanguageByCode(languageCode);
  if (!lang) return date.toLocaleTimeString();

  return new Intl.DateTimeFormat(languageCode, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

// RTL Support
export const isRTL = (languageCode: string = DEFAULT_LANGUAGE): boolean => {
  const lang = getLanguageByCode(languageCode);
  return lang?.direction === "rtl";
};

// Language switching utilities
export const switchLanguage = (languageCode: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("preferred-language", languageCode);
    // Reload page to apply new language
    window.location.reload();
  }
};

export default SUPPORTED_LANGUAGES;
