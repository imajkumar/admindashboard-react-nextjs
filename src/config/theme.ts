import type { ThemeConfig } from "antd";

// Custom color palette
export const COLORS = {
  // Primary colors
  PRIMARY: "#1890ff",
  PRIMARY_HOVER: "#40a9ff",
  PRIMARY_ACTIVE: "#096dd9",
  PRIMARY_OUTLINE: "#e6f7ff",

  // Success colors
  SUCCESS: "#52c41a",
  SUCCESS_HOVER: "#73d13d",
  SUCCESS_ACTIVE: "#389e0d",
  SUCCESS_OUTLINE: "#f6ffed",

  // Warning colors
  WARNING: "#faad14",
  WARNING_HOVER: "#ffc53d",
  WARNING_ACTIVE: "#d48806",
  WARNING_OUTLINE: "#fffbe6",

  // Error colors
  ERROR: "#ff4d4f",
  ERROR_HOVER: "#ff7875",
  ERROR_ACTIVE: "#d9363e",
  ERROR_OUTLINE: "#fff2f0",

  // Info colors
  INFO: "#1890ff",
  INFO_HOVER: "#40a9ff",
  INFO_ACTIVE: "#096dd9",
  INFO_OUTLINE: "#e6f7ff",

  // Neutral colors
  WHITE: "#ffffff",
  BLACK: "#000000",
  GRAY_1: "#ffffff",
  GRAY_2: "#fafafa",
  GRAY_3: "#f5f5f5",
  GRAY_4: "#f0f0f0",
  GRAY_5: "#d9d9d9",
  GRAY_6: "#bfbfbf",
  GRAY_7: "#8c8c8c",
  GRAY_8: "#595959",
  GRAY_9: "#434343",
  GRAY_10: "#262626",
  GRAY_11: "#1f1f1f",
  GRAY_12: "#141414",

  // Background colors
  BG_BASE: "#ffffff",
  BG_CONTAINER: "#ffffff",
  BG_ELEVATED: "#ffffff",
  BG_LAYOUT: "#f5f5f5",
  BG_SPOTLIGHT: "#ffffff",
  BG_MASK: "rgba(0, 0, 0, 0.45)",

  // Text colors
  TEXT_BASE: "#000000",
  TEXT_SECONDARY: "#666666",
  TEXT_TERTIARY: "#999999",
  TEXT_QUATERNARY: "#cccccc",
  TEXT_DISABLED: "#d9d9d9",

  // Border colors
  BORDER_BASE: "#d9d9d9",
  BORDER_SPLIT: "#f0f0f0",
  BORDER_LIGHT: "#f5f5f5",
} as const;

// Light theme configuration
export const lightTheme: ThemeConfig = {
  token: {
    // Color
    colorPrimary: COLORS.PRIMARY,
    colorSuccess: COLORS.SUCCESS,
    colorWarning: COLORS.WARNING,
    colorError: COLORS.ERROR,
    colorInfo: COLORS.INFO,

    // Background
    colorBgBase: COLORS.BG_BASE,
    colorBgContainer: COLORS.BG_CONTAINER,
    colorBgElevated: COLORS.BG_ELEVATED,
    colorBgLayout: COLORS.BG_LAYOUT,
    colorBgSpotlight: COLORS.BG_SPOTLIGHT,
    colorBgMask: COLORS.BG_MASK,

    // Text
    colorTextBase: COLORS.TEXT_BASE,
    colorText: COLORS.TEXT_BASE,
    colorTextSecondary: COLORS.TEXT_SECONDARY,
    colorTextTertiary: COLORS.TEXT_TERTIARY,
    colorTextQuaternary: COLORS.TEXT_QUATERNARY,
    colorTextDisabled: COLORS.TEXT_DISABLED,

    // Border
    colorBorder: COLORS.BORDER_BASE,
    colorBorderSecondary: COLORS.BORDER_SPLIT,

    // Font
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Border radius
    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 8,

    // Spacing
    margin: 16,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    padding: 16,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    // Control height
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,

    // Shadow
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    boxShadowSecondary: "0 2px 4px rgba(0, 0, 0, 0.12)",
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    Card: {
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    Input: {
      borderRadius: 6,
      controlHeight: 32,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 32,
    },
    Table: {
      borderRadius: 8,
      headerBg: COLORS.GRAY_2,
      headerColor: COLORS.TEXT_BASE,
    },
    Menu: {
      itemBorderRadius: 6,
      itemMarginInline: 0,
      itemSelectedBg: COLORS.PRIMARY_OUTLINE,
      itemSelectedColor: COLORS.PRIMARY,
    },
    Layout: {
      headerBg: COLORS.WHITE,
      siderBg: COLORS.GRAY_11,
      bodyBg: COLORS.BG_LAYOUT,
    },
  },
};

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  token: {
    // Color
    colorPrimary: COLORS.PRIMARY,
    colorSuccess: COLORS.SUCCESS,
    colorWarning: COLORS.WARNING,
    colorError: COLORS.ERROR,
    colorInfo: COLORS.INFO,

    // Background
    colorBgBase: COLORS.GRAY_12,
    colorBgContainer: COLORS.GRAY_11,
    colorBgElevated: COLORS.GRAY_10,
    colorBgLayout: COLORS.GRAY_12,
    colorBgSpotlight: COLORS.GRAY_10,
    colorBgMask: "rgba(0, 0, 0, 0.65)",

    // Text
    colorTextBase: COLORS.WHITE,
    colorText: COLORS.WHITE,
    colorTextSecondary: COLORS.GRAY_6,
    colorTextTertiary: COLORS.GRAY_7,
    colorTextQuaternary: COLORS.GRAY_8,
    colorTextDisabled: COLORS.GRAY_8,

    // Border
    colorBorder: COLORS.GRAY_8,
    colorBorderSecondary: COLORS.GRAY_9,

    // Font
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Border radius
    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 8,

    // Spacing
    margin: 16,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    padding: 16,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    // Control height
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,

    // Shadow
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.45)",
    boxShadowSecondary: "0 2px 4px rgba(0, 0, 0, 0.35)",
  },
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 32,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    Card: {
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
    },
    Input: {
      borderRadius: 6,
      controlHeight: 32,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 32,
    },
    Table: {
      borderRadius: 8,
      headerBg: COLORS.GRAY_10,
      headerColor: COLORS.WHITE,
    },
    Menu: {
      itemBorderRadius: 6,
      itemMarginInline: 0,
      itemSelectedBg: COLORS.PRIMARY_OUTLINE,
      itemSelectedColor: COLORS.PRIMARY,
    },
    Layout: {
      headerBg: COLORS.GRAY_10,
      siderBg: COLORS.GRAY_12,
      bodyBg: COLORS.GRAY_12,
    },
  },
};

// Theme types
export type ThemeMode = "light" | "dark";
export type ThemeConfigType = typeof lightTheme | typeof darkTheme;

// Theme switcher function
export const getThemeConfig = (mode: ThemeMode): ThemeConfig => {
  return mode === "dark" ? darkTheme : lightTheme;
};

// Export default theme
export default lightTheme;
