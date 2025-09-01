"use client";

import type React from "react";
import { useState } from "react";
import { Button, Dropdown, Space } from "antd";
import { PlusOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import UserCreationDrawer from "../forms/UserCreationDrawer";

interface ModuleMenuProps {
  module: string;
}

const ModuleMenu: React.FC<ModuleMenuProps> = ({ module }) => {
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleUserCreationSuccess = () => {
    // Refresh the current page or navigate to users list
    router.refresh();
  };

  const getModuleMenuItems = () => {
    switch (module) {
      case "users":
        return [
          {
            key: "list",
            icon: <UserOutlined />,
            label: t("view_all_users", "users"),
            onClick: () => router.push("/users/list"),
          },
          {
            key: "create",
            icon: <PlusOutlined />,
            label: t("create_new_user", "users"),
            onClick: () => setUserDrawerVisible(true),
          },
          {
            key: "roles",
            icon: <UserOutlined />,
            label: t("manage_roles", "users"),
            onClick: () => router.push("/users/roles"),
          },
          {
            key: "groups",
            icon: <UserOutlined />,
            label: t("manage_groups", "users"),
            onClick: () => router.push("/users/groups"),
          },
        ];

      case "content":
        return [
          {
            key: "pages",
            icon: <UserOutlined />,
            label: t("manage_pages", "content"),
            onClick: () => router.push("/content/pages"),
          },
          {
            key: "create",
            icon: <PlusOutlined />,
            label: t("create_content", "content"),
            onClick: () => router.push("/content/create"),
          },
        ];

      case "ecommerce":
        return [
          {
            key: "products",
            icon: <UserOutlined />,
            label: t("manage_products", "ecommerce"),
            onClick: () => router.push("/ecommerce/products"),
          },
          {
            key: "create",
            icon: <PlusOutlined />,
            label: t("add_product", "ecommerce"),
            onClick: () => router.push("/ecommerce/products/create"),
          },
        ];

      default:
        return [
          {
            key: "overview",
            icon: <UserOutlined />,
            label: t("overview", "common"),
            onClick: () => router.push(`/${module}`),
          },
        ];
    }
  };

  const menuItems = getModuleMenuItems();

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomLeft"
        trigger={["click"]}
      >
        <Button type="primary" icon={<PlusOutlined />}>
          <Space>
            {t("actions", "common")}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>

      {/* User Creation Drawer */}
      {module === "users" && (
        <UserCreationDrawer
          visible={userDrawerVisible}
          onClose={() => setUserDrawerVisible(false)}
          onSuccess={handleUserCreationSuccess}
        />
      )}
    </>
  );
};

export default ModuleMenu;
