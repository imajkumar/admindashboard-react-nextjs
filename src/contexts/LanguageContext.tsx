"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  detectLanguage,
  getLanguageByCode,
  isRTL,
  type LanguageConfig,
  SUPPORTED_LANGUAGES,
} from "../config/i18n";

interface LanguageContextType {
  currentLanguage: string;
  currentLanguageConfig: LanguageConfig;
  setLanguage: (languageCode: string) => void;
  supportedLanguages: LanguageConfig[];
  isRTL: boolean;
  t: (key: string, namespace?: string) => string;
  formatNumber: (value: number) => string;
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translation data - English and Russian only
const translations: {
  [languageCode: string]: { [namespace: string]: { [key: string]: string } };
} = {
  en: {
    common: {
      dashboard: "Dashboard",
      users: "Users",
      content: "Content",
      ecommerce: "E-Commerce",
      analytics: "Analytics",
      settings: "Settings",
      help: "Help",
      login: "Login",
      logout: "Logout",
      search: "Search",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      actions: "Actions",
    },
    dashboard: {
      overview: "Overview",
      statistics: "Statistics",
      recent_activity: "Recent Activity",
      quick_actions: "Quick Actions",
      system_status: "System Status",
      total_users: "Total Users",
      total_orders: "Total Orders",
      total_revenue: "Total Revenue",
      active_sessions: "Active Sessions",
    },
    navigation: {
      home: "Home",
      profile: "Profile",
      preferences: "Preferences",
      notifications: "Notifications",
      language: "Language",
      theme: "Theme",
      help_support: "Help & Support",
    },
    users: {
      create_new_user: "Create New User",
      view_all_users: "View All Users",
      manage_roles: "Manage Roles",
      manage_groups: "Manage Groups",
      username: "Username",
      email: "Email",
      password: "Password",
      confirm_password: "Confirm Password",
      first_name: "First Name",
      last_name: "Last Name",
      phone: "Phone",
      role: "Role",
      department: "Department",
      position: "Position",
      status: "Status",
      avatar: "Avatar",
      upload_avatar: "Upload Avatar",
      enter_username: "Enter username",
      enter_email: "Enter email",
      enter_password: "Enter password",
      enter_first_name: "Enter first name",
      enter_last_name: "Enter last name",
      enter_phone: "Enter phone number",
      enter_position: "Enter position",
      select_role: "Select role",
      select_department: "Select department",
      select_status: "Select status",
      username_required: "Username is required",
      username_min_length: "Username must be at least 3 characters",
      username_max_length: "Username must be no more than 30 characters",
      username_pattern:
        "Username can only contain letters, numbers, and underscores",
      email_required: "Email is required",
      email_invalid: "Please enter a valid email address",
      password_required: "Password is required",
      password_min_length: "Password must be at least 8 characters",
      confirm_password_required: "Please confirm your password",
      passwords_not_match: "Passwords do not match",
      first_name_required: "First name is required",
      first_name_min_length: "First name must be at least 2 characters",
      first_name_max_length: "First name must be no more than 50 characters",
      last_name_required: "Last name is required",
      last_name_min_length: "Last name must be at least 2 characters",
      last_name_max_length: "Last name must be no more than 50 characters",
      phone_invalid: "Please enter a valid phone number",
      role_required: "Role is required",
      status_required: "Status is required",
      user_created_successfully: "User created successfully",
      failed_to_create_user: "Failed to create user",
      please_upload_image_file: "Please upload an image file",
      image_must_be_smaller_than_2mb: "Image must be smaller than 2MB",
      super_admin: "Super Admin",
      admin: "Admin",
      manager: "Manager",
      user: "User",
      guest: "Guest",
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
      engineering: "Engineering",
      marketing: "Marketing",
      sales: "Sales",
      hr: "Human Resources",
      finance: "Finance",
      operations: "Operations",
    },
    content: {
      manage_pages: "Manage Pages",
      create_content: "Create Content",
    },
    ecommerce: {
      manage_products: "Manage Products",
      add_product: "Add Product",
    },
  },
  ru: {
    common: {
      dashboard: "Панель управления",
      users: "Пользователи",
      content: "Контент",
      ecommerce: "Электронная коммерция",
      analytics: "Аналитика",
      settings: "Настройки",
      help: "Помощь",
      login: "Войти",
      logout: "Выйти",
      search: "Поиск",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      create: "Создать",
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успех",
      warning: "Предупреждение",
      info: "Информация",
      actions: "Действия",
    },
    dashboard: {
      overview: "Обзор",
      statistics: "Статистика",
      recent_activity: "Недавняя активность",
      quick_actions: "Быстрые действия",
      system_status: "Статус системы",
      total_users: "Всего пользователей",
      total_orders: "Всего заказов",
      total_revenue: "Общий доход",
      active_sessions: "Активные сессии",
    },
    navigation: {
      home: "Главная",
      profile: "Профиль",
      preferences: "Настройки",
      notifications: "Уведомления",
      language: "Язык",
      theme: "Тема",
      help_support: "Помощь и поддержка",
    },
    users: {
      create_new_user: "Создать нового пользователя",
      view_all_users: "Просмотреть всех пользователей",
      manage_roles: "Управление ролями",
      manage_groups: "Управление группами",
      username: "Имя пользователя",
      email: "Электронная почта",
      password: "Пароль",
      confirm_password: "Подтвердите пароль",
      first_name: "Имя",
      last_name: "Фамилия",
      phone: "Телефон",
      role: "Роль",
      department: "Отдел",
      position: "Должность",
      status: "Статус",
      avatar: "Аватар",
      upload_avatar: "Загрузить аватар",
      enter_username: "Введите имя пользователя",
      enter_email: "Введите email",
      enter_password: "Введите пароль",
      enter_first_name: "Введите имя",
      enter_last_name: "Введите фамилию",
      enter_phone: "Введите номер телефона",
      enter_position: "Введите должность",
      select_role: "Выберите роль",
      select_department: "Выберите отдел",
      select_status: "Выберите статус",
      username_required: "Имя пользователя обязательно",
      username_min_length:
        "Имя пользователя должно содержать минимум 3 символа",
      username_max_length: "Имя пользователя не должно превышать 30 символов",
      username_pattern:
        "Имя пользователя может содержать только буквы, цифры и подчеркивания",
      email_required: "Email обязателен",
      email_invalid: "Пожалуйста, введите корректный email",
      password_required: "Пароль обязателен",
      password_min_length: "Пароль должен содержать минимум 8 символов",
      confirm_password_required: "Пожалуйста, подтвердите пароль",
      passwords_not_match: "Пароли не совпадают",
      first_name_required: "Имя обязательно",
      first_name_min_length: "Имя должно содержать минимум 2 символа",
      first_name_max_length: "Имя не должно превышать 50 символов",
      last_name_required: "Фамилия обязательна",
      last_name_min_length: "Фамилия должна содержать минимум 2 символа",
      last_name_max_length: "Фамилия не должна превышать 50 символов",
      phone_invalid: "Пожалуйста, введите корректный номер телефона",
      role_required: "Роль обязательна",
      status_required: "Статус обязателен",
      user_created_successfully: "Пользователь успешно создан",
      failed_to_create_user: "Не удалось создать пользователя",
      please_upload_image_file: "Пожалуйста, загрузите файл изображения",
      image_must_be_smaller_than_2mb: "Изображение должно быть меньше 2МБ",
      super_admin: "Супер администратор",
      admin: "Администратор",
      manager: "Менеджер",
      user: "Пользователь",
      guest: "Гость",
      active: "Активный",
      inactive: "Неактивный",
      suspended: "Приостановлен",
      engineering: "Инженерия",
      marketing: "Маркетинг",
      sales: "Продажи",
      hr: "Отдел кадров",
      finance: "Финансы",
      operations: "Операции",
    },
    content: {
      manage_pages: "Управление страницами",
      create_content: "Создать контент",
    },
    ecommerce: {
      manage_products: "Управление продуктами",
      add_product: "Добавить продукт",
    },
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [currentLanguageConfig, setCurrentLanguageConfig] =
    useState<LanguageConfig>(
      SUPPORTED_LANGUAGES.find((lang) => lang.code === "en") ||
        SUPPORTED_LANGUAGES[0],
    );

  // Initialize language on mount
  useEffect(() => {
    const detectedLanguage = detectLanguage();
    setCurrentLanguage(detectedLanguage);

    const langConfig = getLanguageByCode(detectedLanguage);
    if (langConfig) {
      setCurrentLanguageConfig(langConfig);
    }
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    const rtl = isRTL(currentLanguage);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Set language function
  const setLanguage = (languageCode: string) => {
    const langConfig = getLanguageByCode(languageCode);
    if (langConfig) {
      setCurrentLanguage(languageCode);
      setCurrentLanguageConfig(langConfig);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("preferred-language", languageCode);
      }
    }
  };

  // Translation function
  const t = (key: string, namespace: string = "common"): string => {
    const langTranslations = translations[currentLanguage];
    if (!langTranslations) {
      // Fallback to English
      const enTranslations = translations.en;
      return enTranslations?.[namespace]?.[key] || key;
    }

    const namespaceTranslations = langTranslations[namespace];
    if (!namespaceTranslations) {
      // Fallback to English namespace
      const enNamespaceTranslations = translations.en?.[namespace];
      return enNamespaceTranslations?.[key] || key;
    }

    return namespaceTranslations[key] || key;
  };

  // Formatting functions
  const formatNumber = (value: number): string => {
    return value.toLocaleString(currentLanguage, {
      minimumFractionDigits: currentLanguageConfig.numberFormat.precision,
      maximumFractionDigits: currentLanguageConfig.numberFormat.precision,
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(currentLanguage, {
      style: "currency",
      currency: currentLanguageConfig.currency,
      minimumFractionDigits: currentLanguageConfig.numberFormat.precision,
      maximumFractionDigits: currentLanguageConfig.numberFormat.precision,
    }).format(value);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat(currentLanguage, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const value: LanguageContextType = {
    currentLanguage,
    currentLanguageConfig,
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRTL: isRTL(currentLanguage),
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageProvider;
