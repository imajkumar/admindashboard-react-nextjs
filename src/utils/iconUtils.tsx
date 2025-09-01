import type React from "react";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  GroupOutlined,
  FileOutlined,
  PictureOutlined,
  EditOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
  DashboardOutlined as AnalyticsDashboardOutlined,
  FileTextOutlined as ReportsIcon,
  BulbOutlined,
  ToolOutlined,
  SafetyOutlined,
  ApiOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";

// Icon mapping object
const iconMap: { [key: string]: React.ComponentType<Record<string, unknown>> } =
  {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    FileTextOutlined,
    ShoppingOutlined,
    BarChartOutlined,
    QuestionCircleOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    GroupOutlined,
    FileOutlined,
    PictureOutlined,
    EditOutlined,
    GiftOutlined,
    ShoppingCartOutlined,
    AnalyticsDashboardOutlined: AnalyticsDashboardOutlined,
    ReportsIcon: ReportsIcon,
    BulbOutlined,
    ToolOutlined,
    SafetyOutlined,
    ApiOutlined,
    BookOutlined,
    CustomerServiceOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SunOutlined,
    MoonOutlined,
  };

/**
 * Get icon component by icon name
 * @param iconName - The name of the icon
 * @returns React component or null if not found
 */
export const getIconComponent = (iconName: string): React.ReactNode => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon component not found: ${iconName}`);
    return <UserOutlined />; // Fallback icon
  }

  return <IconComponent />;
};

/**
 * Get icon component with custom props
 * @param iconName - The name of the icon
 * @param props - Props to pass to the icon component
 * @returns React component or null if not found
 */
export const getIconComponentWithProps = (
  iconName: string,
  props: Record<string, unknown> = {},
): React.ReactNode => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon component not found: ${iconName}`);
    return <UserOutlined {...props} />; // Fallback icon
  }

  return <IconComponent {...props} />;
};

/**
 * Check if icon exists
 * @param iconName - The name of the icon
 * @returns boolean
 */
export const iconExists = (iconName: string): boolean => {
  return iconName in iconMap;
};

/**
 * Get all available icon names
 * @returns array of icon names
 */
export const getAvailableIconNames = (): string[] => {
  return Object.keys(iconMap);
};

export default getIconComponent;
