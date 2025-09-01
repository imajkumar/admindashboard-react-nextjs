"use client";

import type React from "react";
import { Breadcrumb as AntBreadcrumb } from "antd";
import { usePathname } from "next/navigation";
import { getBreadcrumbForPath } from "../../config/modules";
import { HomeOutlined } from "@ant-design/icons";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();

  // Don't show breadcrumb on login page
  if (pathname === "/") {
    return null;
  }

  const breadcrumbItems = getBreadcrumbForPath(pathname);

  // Add home as first item
  const items = [
    {
      title: (
        <a href="/dashboard">
          <HomeOutlined />
        </a>
      ),
    },
    ...breadcrumbItems.map((item, index) => ({
      title:
        index === breadcrumbItems.length - 1 ? (
          <span>{item.name}</span>
        ) : (
          <a href={item.path}>{item.name}</a>
        ),
    })),
  ];

  return <AntBreadcrumb style={{ margin: "16px 0" }} items={items} />;
};

export default Breadcrumb;
