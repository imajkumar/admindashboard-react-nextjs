"use client";

import {
  DeleteOutlined,
  ExperimentOutlined,
  MailOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { emailController } from "../../controllers/EmailController";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface EmailFormData {
  to: string[];
  subject: string;
  template: string;
  context: Record<string, unknown>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

interface BulkEmailFormData {
  emails: EmailFormData[];
  batchSize: number;
  delayBetweenBatches: number;
}

const EmailManager: React.FC = () => {
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(
    null,
  );
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    html?: string;
    error?: string;
  } | null>(null);

  const checkConnection = useCallback(async () => {
    setLoading(true);
    try {
      const isConnected = await emailController.verifyConnection();
      setConnectionStatus(isConnected);
      if (isConnected) {
        message.success("Email service connection verified successfully");
      } else {
        message.error("Email service connection failed");
      }
    } catch (_error) {
      setConnectionStatus(false);
      message.error("Failed to verify email service connection");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    try {
      const templates = emailController.getAvailableTemplates();
      setAvailableTemplates(templates);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  }, []);

  // Check connection status on component mount
  useEffect(() => {
    checkConnection();
    loadTemplates();
  }, [checkConnection, loadTemplates]);

  const onSendEmail = async (values: EmailFormData) => {
    setLoading(true);
    try {
      const result = await emailController.sendEmail({
        to: values.to,
        subject: values.subject,
        template: values.template,
        context: values.context,
        attachments: values.attachments,
      });

      if (result.success) {
        message.success(
          `Email sent successfully! Message ID: ${result.messageId}`,
        );
        form.resetFields();
      } else {
        message.error(`Email sending failed: ${result.error}`);
      }
    } catch (_error) {
      message.error("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const onSendBulkEmails = async (values: BulkEmailFormData) => {
    setLoading(true);
    try {
      const result = await emailController.sendBulkEmails({
        emails: values.emails,
        batchSize: values.batchSize,
        delayBetweenBatches: values.delayBetweenBatches,
      });

      message.success(
        `Bulk email send completed! Successful: ${result.successful}, Failed: ${result.failed}`,
      );
      bulkForm.resetFields();
    } catch (_error) {
      message.error("Failed to send bulk emails");
    } finally {
      setLoading(false);
    }
  };

  const onTestTemplate = async (
    templateName: string,
    context: Record<string, unknown>,
  ) => {
    try {
      const result = await emailController.testTemplate(templateName, context);
      setTestResult(result);

      if (result.success) {
        message.success("Template rendered successfully");
      } else {
        message.error(`Template test failed: ${result.error}`);
      }
    } catch (_error) {
      message.error("Failed to test template");
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (content) {
        // Add file to form context
        const currentAttachments = form.getFieldValue("attachments") || [];
        form.setFieldValue("attachments", [
          ...currentAttachments,
          {
            filename: file.name,
            content,
            contentType: file.type,
          },
        ]);
      }
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  const removeAttachment = (index: number) => {
    const currentAttachments = form.getFieldValue("attachments") || [];
    const newAttachments = currentAttachments.filter(
      (_: unknown, i: number) => i !== index,
    );
    form.setFieldValue("attachments", newAttachments);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>
        <MailOutlined /> Email Management
      </Title>

      {/* Connection Status */}
      <Card style={{ marginBottom: "24px" }}>
        <Space>
          <Text>Email Service Status:</Text>
          {connectionStatus === null ? (
            <Text type="secondary">Checking...</Text>
          ) : connectionStatus ? (
            <Text type="success">Connected</Text>
          ) : (
            <Text type="danger">Disconnected</Text>
          )}
          <Button onClick={checkConnection} loading={loading} size="small">
            Check Connection
          </Button>
        </Space>
      </Card>

      <Row gutter={24}>
        {/* Single Email Form */}
        <Col xs={24} lg={12}>
          <Card title="Send Single Email" style={{ marginBottom: "24px" }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onSendEmail}
              initialValues={{
                template: availableTemplates[0] || "",
                context: {},
              }}
            >
              <Form.Item
                label="Recipients"
                name="to"
                rules={[
                  { required: true, message: "Please enter recipient emails" },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Enter email addresses"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Subject"
                name="subject"
                rules={[
                  { required: true, message: "Please enter email subject" },
                ]}
              >
                <Input placeholder="Email subject" />
              </Form.Item>

              <Form.Item
                label="Template"
                name="template"
                rules={[
                  { required: true, message: "Please select a template" },
                ]}
              >
                <Select placeholder="Select email template">
                  {availableTemplates.map((template) => (
                    <Option key={template} value={template}>
                      {template}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Context Variables" name="context">
                <TextArea
                  rows={4}
                  placeholder="Enter JSON context variables for template"
                  onChange={(e) => {
                    try {
                      const context = JSON.parse(e.target.value);
                      form.setFieldValue("context", context);
                    } catch (_error) {
                      // Invalid JSON, ignore
                    }
                  }}
                />
              </Form.Item>

              <Form.Item label="Attachments">
                <Upload beforeUpload={handleFileUpload} fileList={[]} multiple>
                  <Button icon={<UploadOutlined />}>Add Attachments</Button>
                </Upload>
                {form
                  .getFieldValue("attachments")
                  ?.map((attachment: { filename: string }, index: number) => (
                    <div
                      key={`attachment-${attachment.filename}-${index}`}
                      style={{ marginTop: "8px" }}
                    >
                      <Space>
                        <Text>{attachment.filename}</Text>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeAttachment(index)}
                          size="small"
                        />
                      </Space>
                    </div>
                  ))}
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  block
                >
                  Send Email
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Bulk Email Form */}
        <Col xs={24} lg={12}>
          <Card title="Send Bulk Emails" style={{ marginBottom: "24px" }}>
            <Form
              form={bulkForm}
              layout="vertical"
              onFinish={onSendBulkEmails}
              initialValues={{
                batchSize: 10,
                delayBetweenBatches: 1000,
              }}
            >
              <Form.Item
                label="Batch Size"
                name="batchSize"
                rules={[{ required: true, message: "Please enter batch size" }]}
              >
                <InputNumber min={1} max={50} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Delay Between Batches (ms)"
                name="delayBetweenBatches"
                rules={[{ required: true, message: "Please enter delay" }]}
              >
                <InputNumber min={0} max={10000} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  block
                >
                  Send Bulk Emails
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Template Testing */}
      <Card title="Template Testing" style={{ marginBottom: "24px" }}>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form layout="vertical">
              <Form.Item label="Template">
                <Select
                  placeholder="Select template to test"
                  onChange={(_value) => {
                    // Reset test result when template changes
                    setTestResult(null);
                  }}
                >
                  {availableTemplates.map((template) => (
                    <Option key={template} value={template}>
                      {template}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Test Context (JSON)">
                <TextArea
                  rows={4}
                  placeholder="Enter test context variables"
                  id="testContext"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  icon={<ExperimentOutlined />}
                  onClick={() => {
                    try {
                      const contextInput = document.getElementById(
                        "testContext",
                      ) as HTMLTextAreaElement;
                      const context = JSON.parse(contextInput.value);
                      const template = form.getFieldValue("template");
                      if (template) {
                        onTestTemplate(template, context);
                      }
                    } catch (_error) {
                      message.error("Invalid JSON context");
                    }
                  }}
                >
                  Test Template
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} lg={12}>
            {testResult && (
              <div>
                <Alert
                  message={
                    testResult.success
                      ? "Template Rendered Successfully"
                      : "Template Test Failed"
                  }
                  type={testResult.success ? "success" : "error"}
                  showIcon
                  style={{ marginBottom: "16px" }}
                />

                {testResult.success && testResult.html && (
                  <div>
                    <Text strong>Rendered HTML:</Text>
                    <div
                      style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                        padding: "16px",
                        marginTop: "8px",
                        maxHeight: "300px",
                        overflow: "auto",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {testResult.html}
                      </pre>
                    </div>
                  </div>
                )}

                {!testResult.success && testResult.error && (
                  <Text type="danger">{testResult.error}</Text>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Space wrap>
          <Button
            icon={<MailOutlined />}
            onClick={() => {
              // Send welcome email to current user
              const currentUser = {
                email: "test@example.com",
                firstName: "John",
                lastName: "Doe",
                username: "johndoe",
                role: "user",
                department: "IT",
              };
              emailController.sendWelcomeEmail(
                currentUser,
                "http://localhost:3000/dashboard",
              );
            }}
          >
            Send Welcome Email
          </Button>

          <Button
            icon={<ExperimentOutlined />}
            onClick={() => {
              // Test notification email
              emailController.sendNotificationEmail(
                { email: "test@example.com", name: "John Doe" },
                {
                  subject: "Test Notification",
                  message: "This is a test notification email",
                  type: "system",
                  priority: "medium",
                  actionRequired: true,
                  actionDescription: "Please review the system logs",
                  actionUrl: "http://localhost:3000/logs",
                  actionButtonText: "View Logs",
                },
              );
            }}
          >
            Send Test Notification
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default EmailManager;
