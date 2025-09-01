"use client";

import type React from "react";
import { Menu, type MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { APP_MODULES, type ModuleConfig } from "../../config/modules";
import { useAuth } from "../../hooks/useAuth";
import { getIconComponent } from "../../utils/iconUtils";

interface DynamicNavigationProps {
  collapsed?: boolean;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({
  collapsed = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userPermissions } = useAuth();

  // Convert modules to menu items
  const convertModulesToMenuItems = (
    modules: ModuleConfig[],
  ): MenuProps["items"] => {
    return modules
      .filter((module) => module.enabled)
      .filter((module) => {
        // Check if user has permission to access this module
        return module.permissions.some((permission) =>
          userPermissions.includes(permission),
        );
      })
      .map((module) => {
        const menuItem: MenuProps["items"][0] = {
          key: module.path,
          icon: getIconComponent(module.icon),
          label: collapsed ? undefined : module.name,
          onClick: () => router.push(module.path),
        };

        // Add sub-modules if they exist
        if (module.subModules && module.subModules.length > 0) {
          menuItem.children = convertModulesToMenuItems(module.subModules);
        }

        return menuItem;
      });
  };

  // Get current selected keys
  const getSelectedKeys = (): string[] => {
    const keys: string[] = [];

    const findSelectedKeys = (modules: ModuleConfig[], currentPath: string) => {
      for (const module of modules) {
        if (currentPath.startsWith(module.path)) {
          keys.push(module.path);

          if (module.subModules) {
            findSelectedKeys(module.subModules, currentPath);
          }
          break;
        }
      }
    };

    findSelectedKeys(APP_MODULES, pathname);
    return keys;
  };

  // Get open keys for sub-modules
  const getOpenKeys = (): string[] => {
    const openKeys: string[] = [];

    const findOpenKeys = (modules: ModuleConfig[], currentPath: string) => {
      for (const module of modules) {
        if (currentPath.startsWith(module.path)) {
          if (module.subModules && module.subModules.length > 0) {
            openKeys.push(module.path);
            findOpenKeys(module.subModules, currentPath);
          }
          break;
        }
      }
    };

    findOpenKeys(APP_MODULES, pathname);
    return openKeys;
  };

  const menuItems = convertModulesToMenuItems(APP_MODULES);
  const selectedKeys = getSelectedKeys();
  const openKeys = getOpenKeys();

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
      items={menuItems}
      style={{
        border: "none",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    />
  );
};

export default DynamicNavigation;
