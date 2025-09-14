"use client";

import type React from "react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
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

      role: "Roles management",
      public: "Public display",
      emp: "Emp. management",
      vip: "VIP management",
      agancy: "Agency management",
      service: "Service management",
      video: "Video management",
      report: "Report management",
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
  fr: {
    common: {
      dashboard: "Tableau de bord",
      users: "Utilisateurs",
      content: "Contenu",
      ecommerce: "E-commerce",
      analytics: "Analytique",
      settings: "Paramètres",
      help: "Aide",
      login: "Se connecter",
      logout: "Se déconnecter",
      search: "Recherche",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      create: "Créer",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      warning: "Avertissement",
      info: "Information",
      actions: "Actions",

      role: "Gestion des rôles",
      public: "Affichage public",
      emp: "Gestion des employés",
      vip: "Gestion des VIP",
      agancy: "Gestion des agences",
      service: "Gestion des services",
      video: "Gestion des vidéos",
      report: "Gestion des rapports",
    },
    dashboard: {
      overview: "Aperçu",
      statistics: "Statistiques",
      recent_activity: "Activité récente",
      quick_actions: "Actions rapides",
      system_status: "Statut du système",
      total_users: "Nombre total d’utilisateurs",
      total_orders: "Nombre total de commandes",
      total_revenue: "Revenu total",
      active_sessions: "Sessions actives",
    },
    navigation: {
      home: "Accueil",
      profile: "Profil",
      preferences: "Préférences",
      notifications: "Notifications",
      language: "Langue",
      theme: "Thème",
      help_support: "Aide et support",
    },
    users: {
      create_new_user: "Créer un nouvel utilisateur",
      view_all_users: "Voir tous les utilisateurs",
      manage_roles: "Gérer les rôles",
      manage_groups: "Gérer les groupes",
      username: "Nom d'utilisateur",
      email: "Email",
      password: "Mot de passe",
      confirm_password: "Confirmer le mot de passe",
      first_name: "Prénom",
      last_name: "Nom de famille",
      phone: "Téléphone",
      role: "Rôle",
      department: "Département",
      position: "Poste",
      status: "Statut",
      avatar: "Avatar",
      upload_avatar: "Téléverser un avatar",
      enter_username: "Entrez le nom d'utilisateur",
      enter_email: "Entrez l'email",
      enter_password: "Entrez le mot de passe",
      enter_first_name: "Entrez le prénom",
      enter_last_name: "Entrez le nom de famille",
      enter_phone: "Entrez le numéro de téléphone",
      enter_position: "Entrez le poste",
      select_role: "Sélectionnez un rôle",
      select_department: "Sélectionnez un département",
      select_status: "Sélectionnez un statut",
      username_required: "Le nom d'utilisateur est requis",
      username_min_length:
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      username_max_length:
        "Le nom d'utilisateur ne doit pas dépasser 30 caractères",
      username_pattern:
        "Le nom d'utilisateur peut contenir uniquement des lettres, chiffres et des underscores",
      email_required: "L'email est requis",
      email_invalid: "Veuillez entrer un email valide",
      password_required: "Le mot de passe est requis",
      password_min_length:
        "Le mot de passe doit contenir au moins 8 caractères",
      confirm_password_required: "Veuillez confirmer le mot de passe",
      passwords_not_match: "Les mots de passe ne correspondent pas",
      first_name_required: "Le prénom est requis",
      first_name_min_length: "Le prénom doit contenir au moins 2 caractères",
      first_name_max_length: "Le prénom ne doit pas dépasser 50 caractères",
      last_name_required: "Le nom de famille est requis",
      last_name_min_length:
        "Le nom de famille doit contenir au moins 2 caractères",
      last_name_max_length:
        "Le nom de famille ne doit pas dépasser 50 caractères",
      phone_invalid: "Veuillez entrer un numéro de téléphone valide",
      role_required: "Le rôle est requis",
      status_required: "Le statut est requis",
      user_created_successfully: "Utilisateur créé avec succès",
      failed_to_create_user: "Échec de la création de l'utilisateur",
      please_upload_image_file: "Veuillez téléverser un fichier image",
      image_must_be_smaller_than_2mb: "L'image doit être inférieure à 2 Mo",
      super_admin: "Super administrateur",
      admin: "Administrateur",
      manager: "Gestionnaire",
      user: "Utilisateur",
      guest: "Invité",
      active: "Actif",
      inactive: "Inactif",
      suspended: "Suspendu",
      engineering: "Ingénierie",
      marketing: "Marketing",
      sales: "Ventes",
      hr: "Ressources humaines",
      finance: "Finance",
      operations: "Opérations",
    },
    content: {
      manage_pages: "Gérer les pages",
      create_content: "Créer du contenu",
    },
    ecommerce: {
      manage_products: "Gérer les produits",
      add_product: "Ajouter un produit",
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
