"use client";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  message,
  Spin,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoginMutation } from "@/store/services/authApi";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkExistingAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (isLoggedIn) {
          router.push("/dashboard");
        }
      } catch (_error) {
        console.error("Auth check error:", _error);
      }
    };

    // Delay to avoid hydration issues
    const timer = setTimeout(() => {
      checkExistingAuth();
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  const [login] = useLoginMutation();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const response = await login(values).unwrap();
      const token = response.token;
      if (token) {
        // Store token in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("isLoggedIn", "true");

        message.success(response.message || "Login successful!");

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        message.error("Invalid response. Token missing.");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = (error as any)?.data?.message || "Login failed";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="small" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#0255E5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Title level={2} style={{ marginBottom: "8px" }}>
              Queue flow
            </Title>
            {/* <Text type="secondary">
              Enter your credentials to access the dashboard
            </Text> */}
          </div>

          <h1 className="text-4xl font-semibold mb-4">Login</h1>

          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            className="input-form"
          >
            <Form.Item
              label="Email address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter here" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Enter here" size="large" />
            </Form.Item>

            <div className="flex justify-between">
              <Form.Item className="mb-6">
                <Checkbox
                // checked={rememberMe}
                // onChange={e => setRememberMe(e.target.checked)}
                >
                  Keep me logged in
                </Checkbox>
              </Form.Item>

              <Form.Item className="mb-6">
                <a href="/forgot-password" className="text-primary">
                  Forgot password?
                </a>
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="default"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="h-12 !bg-secondary  !hover:bg-secondary/80 text-white font-semibold "
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Text type="secondary">Demo: Use any username and password</Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}
