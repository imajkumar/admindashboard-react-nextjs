// Application Modules Configuration
export interface ModuleConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  enabled: boolean;
  permissions: string[];
  subModules?: ModuleConfig[];
  features: string[];
}

export interface ModulePermissions {
  [moduleId: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
    admin: boolean;
  };
}

// Core Modules Configuration
export const APP_MODULES: ModuleConfig[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    icon: "DashboardOutlined",
    description: "Main dashboard and overview",
    enabled: true,
    permissions: ["dashboard:read"],
    features: ["overview", "analytics", "reports", "notifications"],
  },
  {
    id: "users",
    name: "User Management",
    path: "/users",
    icon: "UserOutlined",
    description: "Manage users, roles, and permissions",
    enabled: true,
    permissions: ["users:read", "users:write", "users:delete"],
    subModules: [
      {
        id: "users-list",
        name: "Users List",
        path: "/users/list",
        icon: "TeamOutlined",
        description: "View and manage all users",
        enabled: true,
        permissions: ["users:read"],
        features: ["list", "search", "filter", "export"],
      },
      {
        id: "user-roles",
        name: "Roles & Permissions",
        path: "/users/roles",
        icon: "SafetyCertificateOutlined",
        description: "Manage user roles and permissions",
        enabled: true,
        permissions: ["users:admin"],
        features: ["roles", "permissions", "assignments"],
      },
      {
        id: "user-groups",
        name: "User Groups",
        path: "/users/groups",
        icon: "GroupOutlined",
        description: "Organize users into groups",
        enabled: true,
        permissions: ["users:write"],
        features: ["groups", "membership", "hierarchy"],
      },
    ],
    features: ["crud", "bulk-operations", "import-export", "audit-log"],
  },
  {
    id: "content",
    name: "Content Management",
    path: "/content",
    icon: "FileTextOutlined",
    description: "Manage website content and media",
    enabled: true,
    permissions: ["content:read", "content:write"],
    subModules: [
      {
        id: "content-pages",
        name: "Pages",
        path: "/content/pages",
        icon: "FileOutlined",
        description: "Manage website pages",
        enabled: true,
        permissions: ["content:read"],
        features: ["pages", "templates", "seo"],
      },
      {
        id: "content-media",
        name: "Media Library",
        path: "/content/media",
        icon: "PictureOutlined",
        description: "Manage images, videos, and documents",
        enabled: true,
        permissions: ["content:write"],
        features: ["upload", "organize", "optimize"],
      },
      {
        id: "content-blog",
        name: "Blog Posts",
        path: "/content/blog",
        icon: "EditOutlined",
        description: "Manage blog articles and posts",
        enabled: true,
        permissions: ["content:write"],
        features: ["posts", "categories", "comments"],
      },
    ],
    features: ["editor", "workflow", "versioning", "publishing"],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    path: "/ecommerce",
    icon: "ShoppingOutlined",
    description: "Manage online store and products",
    enabled: true,
    permissions: ["ecommerce:read", "ecommerce:write"],
    subModules: [
      {
        id: "ecommerce-products",
        name: "Products",
        path: "/ecommerce/products",
        icon: "GiftOutlined",
        description: "Manage product catalog",
        enabled: true,
        permissions: ["ecommerce:read"],
        features: ["products", "categories", "inventory", "pricing"],
      },
      {
        id: "ecommerce-orders",
        name: "Orders",
        path: "/ecommerce/orders",
        icon: "ShoppingCartOutlined",
        description: "Process and manage orders",
        enabled: true,
        permissions: ["ecommerce:write"],
        features: ["orders", "fulfillment", "tracking", "refunds"],
      },
      {
        id: "ecommerce-customers",
        name: "Customers",
        path: "/ecommerce/customers",
        icon: "UserOutlined",
        description: "Manage customer information",
        enabled: true,
        permissions: ["ecommerce:read"],
        features: ["customers", "profiles", "history", "segments"],
      },
    ],
    features: ["catalog", "orders", "customers", "analytics"],
  },
  {
    id: "analytics",
    name: "Analytics & Reports",
    path: "/analytics",
    icon: "BarChartOutlined",
    description: "Data analytics and reporting tools",
    enabled: true,
    permissions: ["analytics:read"],
    subModules: [
      {
        id: "analytics-dashboard",
        name: "Analytics Dashboard",
        path: "/analytics/dashboard",
        icon: "DashboardOutlined",
        description: "Real-time analytics overview",
        enabled: true,
        permissions: ["analytics:read"],
        features: ["real-time", "charts", "metrics", "insights"],
      },
      {
        id: "analytics-reports",
        name: "Reports",
        path: "/analytics/reports",
        icon: "FileTextOutlined",
        description: "Generate and schedule reports",
        enabled: true,
        permissions: ["analytics:read"],
        features: ["reports", "scheduling", "export", "templates"],
      },
      {
        id: "analytics-insights",
        name: "Insights",
        path: "/analytics/insights",
        icon: "BulbOutlined",
        description: "AI-powered business insights",
        enabled: true,
        permissions: ["analytics:read"],
        features: ["ai-insights", "predictions", "recommendations"],
      },
    ],
    features: ["real-time", "historical", "predictive", "export"],
  },
  {
    id: "settings",
    name: "System Settings",
    path: "/settings",
    icon: "SettingOutlined",
    description: "Configure system settings and preferences",
    enabled: true,
    permissions: ["settings:read", "settings:write"],
    subModules: [
      {
        id: "settings-general",
        name: "General",
        path: "/settings/general",
        icon: "ToolOutlined",
        description: "General system configuration",
        enabled: true,
        permissions: ["settings:read"],
        features: ["system", "branding", "localization"],
      },
      {
        id: "settings-security",
        name: "Security",
        path: "/settings/security",
        icon: "SafetyOutlined",
        description: "Security and authentication settings",
        enabled: true,
        permissions: ["settings:admin"],
        features: ["authentication", "authorization", "audit"],
      },
      {
        id: "settings-integrations",
        name: "Integrations",
        path: "/settings/integrations",
        icon: "ApiOutlined",
        description: "Third-party service integrations",
        enabled: true,
        permissions: ["settings:write"],
        features: ["apis", "webhooks", "connectors"],
      },
    ],
    features: ["configuration", "security", "integrations", "backup"],
  },
  {
    id: "help",
    name: "Help & Support",
    path: "/help",
    icon: "QuestionCircleOutlined",
    description: "Documentation and support resources",
    enabled: true,
    permissions: ["help:read"],
    subModules: [
      {
        id: "help-documentation",
        name: "Documentation",
        path: "/help/documentation",
        icon: "BookOutlined",
        description: "User guides and documentation",
        enabled: true,
        permissions: ["help:read"],
        features: ["guides", "tutorials", "faq"],
      },
      {
        id: "help-support",
        name: "Support",
        path: "/help/support",
        icon: "CustomerServiceOutlined",
        description: "Contact support and submit tickets",
        enabled: true,
        permissions: ["help:read"],
        features: ["tickets", "chat", "email"],
      },
    ],
    features: ["documentation", "support", "feedback", "training"],
  },
];

// Module Navigation Helper
export const getModuleByPath = (path: string): ModuleConfig | null => {
  const findModule = (
    modules: ModuleConfig[],
    targetPath: string,
  ): ModuleConfig | null => {
    for (const module of modules) {
      if (module.path === targetPath) return module;
      if (module.subModules) {
        const found = findModule(module.subModules, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  return findModule(APP_MODULES, path);
};

// Get all enabled modules
export const getEnabledModules = (): ModuleConfig[] => {
  return APP_MODULES.filter((module) => module.enabled);
};

// Get modules by permission
export const getModulesByPermission = (
  permissions: string[],
): ModuleConfig[] => {
  const hasPermission = (module: ModuleConfig): boolean => {
    return module.permissions.some((permission) =>
      permissions.includes(permission),
    );
  };

  return APP_MODULES.filter(
    (module) => module.enabled && hasPermission(module),
  );
};

// Get breadcrumb navigation
export const getBreadcrumbForPath = (
  path: string,
): Array<{ name: string; path: string }> => {
  const breadcrumbs: Array<{ name: string; path: string }> = [];

  const findBreadcrumb = (
    modules: ModuleConfig[],
    targetPath: string,
    currentBreadcrumbs: Array<{ name: string; path: string }>,
  ): boolean => {
    for (const module of modules) {
      const newBreadcrumbs = [
        ...currentBreadcrumbs,
        { name: module.name, path: module.path },
      ];

      if (module.path === targetPath) {
        breadcrumbs.push(...newBreadcrumbs);
        return true;
      }

      if (module.subModules) {
        if (findBreadcrumb(module.subModules, targetPath, newBreadcrumbs)) {
          return true;
        }
      }
    }
    return false;
  };

  findBreadcrumb(APP_MODULES, path, []);
  return breadcrumbs;
};

export default APP_MODULES;
