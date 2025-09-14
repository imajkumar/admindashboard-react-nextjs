"use client";

import {
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  message,
  Space,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  ArrowDownUp,
  CalendarDays,
  CrownIcon,
  FileText,
  Monitor,
  OctagonAlert,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "../../components/navigation/LanguageSwitcher";
// import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import "./style.css";
import { usePathname } from "next/navigation";
import logo from "../../assets/imgs/Logo.png";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  // const { themeMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const currentDate = dayjs().format("MMM, D, YYYY");
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const storedUsername = localStorage.getItem("username");

        if (!isLoggedIn) {
          router.push("/");
          return;
        }

        setIsAuthenticated(true);
        setUsername(storedUsername || "User");
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/");
      }
    };

    // Delay auth check to avoid hydration issues
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      message.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: t("dashboard", "common"),
    },
    {
      key: "/dashboard/roles",
      icon: <ArrowDownUp size={16} />,
      label: t("role", "common"),
    },
    {
      key: "/dashboard/public",
      icon: <Monitor size={16} />,
      label: t("public", "common"),
    },
    {
      key: "emp",
      icon: <UserOutlined />,
      label: t("emp", "common"),
    },
    {
      key: "vip",
      icon: <CrownIcon size={16} />,
      label: t("vip", "common"),
    },
    {
      key: "agancy",
      icon: <FileText size={16} />,
      label: t("agancy", "common"),
    },
    {
      key: "service",
      icon: <MenuUnfoldOutlined />,
      label: t("service", "common"),
    },
    {
      key: "video",
      icon: <Video size={16} />,
      label: t("video", "common"),
    },
    {
      key: "report",
      icon: <OctagonAlert size={16} />,
      label: t("report", "common"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("settings", "common"),
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("profile", "navigation"),
    },
    {
      key: "changepassword",
      icon: <SettingOutlined />,
      label: t("change password", "navigation"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("logout", "common"),
      onClick: handleLogout,
    },
  ];

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading dashboard...</Text>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        className="!bg-neutral sidebar-menu"
        style={{ overflow: "auto", height: "100vh", scrollbarWidth: "none" }}
      >
        <div
          style={{
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            color: "white",
            fontSize: collapsed ? "16px" : "18px",
            fontWeight: "bold",
          }}
        >
          <div className={`${collapsed ? "hidden" : ""}`}>
            <Image src={logo} alt="Logo" className="w-28 ml-4" />
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          className="!bg-neutral"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <Space>
            <CalendarDays size={20} />
            <span className="text-black">{currentDate}</span>
            <Button type="text" icon={<BellOutlined />} />
            {/* <Tooltip
              title={
                themeMode === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              <Button
                type="text"
                icon={themeMode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
              />
            </Tooltip> */}
            <LanguageSwitcher />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button
                type="text"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {username}
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            overflow: "auto", // <-- Add this
            padding: 24,
            margin: 0,
            borderRadius: "8px",
            height: "calc(100vh - 64px)",
          }}
          className="bg-neutral/10"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
