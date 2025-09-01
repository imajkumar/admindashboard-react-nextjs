"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, Layout, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    // Simulate login API call
    try {
      // For demo purposes, accept any username/password
      // In real app, you would validate against your backend
      if (values.username && values.password) {
        message.success("Login successful!");
        
        // Store login state (in real app, store JWT token)
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", values.username);
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        message.error("Please enter username and password");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "24px"
      }}>
        <Card 
          style={{ 
            width: "100%", 
            maxWidth: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Title level={2} style={{ marginBottom: "8px" }}>
              Admin Login
            </Title>
            <Text type="secondary">
              Enter your credentials to access the dashboard
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                style={{ width: "100%" }}
                size="large"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text type="secondary">
              Demo: Use any username and password
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
