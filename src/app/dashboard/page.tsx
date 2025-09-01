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
  message
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
  TeamOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface User {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const userData: User[] = [
  { key: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { key: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { key: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    
    if (!isLoggedIn) {
      router.push("/");
      return;
    }
    
    setUsername(storedUsername || "User");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    message.success("Logged out successfully");
    router.push("/");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
    {
      key: "reports",
      icon: <FileTextOutlined />,
      label: "Reports",
    },
    {
      key: "team",
      icon: <TeamOutlined />,
      label: "Team",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: "64px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "white",
          fontSize: collapsed ? "16px" : "18px",
          fontWeight: "bold"
        }}>
          {collapsed ? "AD" : "Admin"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: "0 16px", 
          background: "#fff", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          
          <Space>
            <Button type="text" icon={<BellOutlined />} />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" style={{ display: "flex", alignItems: "center" }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {username}
              </Button>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", borderRadius: "8px" }}>
          <Title level={2} style={{ marginBottom: "24px" }}>
            Dashboard Overview
          </Title>
          
          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={1128}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={932}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="New Users"
                  value={28}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={11280}
                  prefix="$"
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
          </Row>
          
          {/* Recent Users Table */}
          <Card title="Recent Users" style={{ marginBottom: "24px" }}>
            <Table 
              columns={columns} 
              dataSource={userData} 
              pagination={false}
              size="small"
            />
          </Card>
          
          {/* Quick Actions */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card title="Quick Actions">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button type="primary" icon={<UserOutlined />} block>
                    Add New User
                  </Button>
                  <Button icon={<FileTextOutlined />} block>
                    Generate Report
                  </Button>
                  <Button icon={<SettingOutlined />} block>
                    System Settings
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card title="System Status">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong>Server Status: </Text>
                    <Tag color="green">Online</Tag>
                  </div>
                  <div>
                    <Text strong>Database: </Text>
                    <Tag color="green">Connected</Tag>
                  </div>
                  <div>
                    <Text strong>Last Backup: </Text>
                    <Text type="secondary">2 hours ago</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
