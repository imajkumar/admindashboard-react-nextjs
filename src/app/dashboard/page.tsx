"use client";

import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Space,
  Statistic,
  Table,
  Tag,
  Dropdown,
  message,
  Spin,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/navigation/LanguageSwitcher";
import ModuleMenu from "../../components/navigation/ModuleMenu";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface User {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const userData: User[] = [
  {
    key: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    key: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
  },
  {
    key: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
  },
];

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { themeMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

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
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: t("dashboard", "navigation"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: t("users", "navigation"),
    },
    {
      key: "content",
      icon: <FileTextOutlined />,
      label: t("content", "navigation"),
    },
    {
      key: "ecommerce",
      icon: <BarChartOutlined />,
      label: t("ecommerce", "navigation"),
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: t("analytics", "navigation"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("settings", "navigation"),
    },
    {
      key: "help",
      icon: <TeamOutlined />,
      label: t("help", "navigation"),
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("profile", "navigation"),
    },
    {
      key: "preferences",
      icon: <SettingOutlined />,
      label: t("preferences", "navigation"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("logout", "common"),
      onClick: handleLogout,
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: collapsed ? "16px" : "18px",
            fontWeight: "bold",
          }}
        >
          <div>{collapsed ? "AD" : "Admin"}</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <Space>
            <Button type="text" icon={<BellOutlined />} />
            <Tooltip
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
            </Tooltip>
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
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("total_users", "dashboard")}
                  value={1128}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("total_orders", "dashboard")}
                  value={93}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("total_revenue", "dashboard")}
                  value={11280}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t("active_sessions", "dashboard")}
                  value={1128}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
              <Card
                title={t("recent_activity", "dashboard")}
                style={{ height: 400 }}
              >
                <Table
                  columns={columns}
                  dataSource={userData}
                  pagination={false}
                  scroll={{ y: 280 }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={t("quick_actions", "dashboard")}
                style={{ height: 400 }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <ModuleMenu module="users" />
                  <ModuleMenu module="content" />
                  <ModuleMenu module="ecommerce" />
                  <Button block icon={<SettingOutlined />}>
                    {t("settings", "common")}
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
