"use client";

import type React from "react";
import { Dropdown, Button, Space, Typography } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useLanguage } from "../../contexts/LanguageContext";

const { Text } = Typography;

const LanguageSwitcher: React.FC = () => {
  const {
    currentLanguage,
    currentLanguageConfig,
    setLanguage,
    supportedLanguages,
  } = useLanguage();

  // Create dropdown menu items
  const menuItems = supportedLanguages.map((lang) => ({
    key: lang.code,
    label: (
      <Space>
        <span>{lang.flag}</span>
        <Text>{lang.nativeName}</Text>
        {lang.code === currentLanguage && (
          <Text type="secondary">(Current)</Text>
        )}
      </Space>
    ),
    onClick: () => setLanguage(lang.code),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Space>
          <span>{currentLanguageConfig.flag}</span>
          <Text>{currentLanguageConfig.code.toUpperCase()}</Text>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
