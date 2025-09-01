"use client";

import type React from "react";
import { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Space,
  Avatar,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { UserController, type UserCreateData } from "../../controllers/users";
import { useLanguage } from "../../contexts/LanguageContext";

const { Option } = Select;

interface UserCreationDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserCreationDrawer: React.FC<UserCreationDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { t } = useLanguage();
  const userController = new UserController();

  const handleSubmit = async (values: UserCreateData) => {
    try {
      setLoading(true);

      // Add avatar file if selected
      const userData = {
        ...values,
        avatar: avatarFile ? URL.createObjectURL(avatarFile) : undefined,
      };

      await userController.create(userData);

      message.success(t("user_created_successfully", "users"));
      form.resetFields();
      setAvatarFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      message.error(t("failed_to_create_user", "users"));
      console.error("User creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(t("please_upload_image_file", "users"));
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t("image_must_be_smaller_than_2mb", "users"));
      return false;
    }

    setAvatarFile(file);
    return false; // Prevent default upload behavior
  };

  const handleClose = () => {
    form.resetFields();
    setAvatarFile(null);
    onClose();
  };

  return (
    <Drawer
      title={
        <Space>
          <UserOutlined />
          {t("create_new_user", "users")}
        </Space>
      }
      width={600}
      open={visible}
      onClose={handleClose}
      footer={
        <Space>
          <Button onClick={handleClose} icon={<CloseOutlined />}>
            {t("cancel", "common")}
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            icon={<SaveOutlined />}
          >
            {t("create", "common")}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          role: "user",
          status: "active",
        }}
      >
        {/* Avatar Upload */}
        <Form.Item label={t("avatar", "users")}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Avatar
              size={80}
              src={avatarFile ? URL.createObjectURL(avatarFile) : undefined}
              icon={<UserOutlined />}
            />
            <Upload
              accept="image/*"
              beforeUpload={handleAvatarUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                {t("upload_avatar", "users")}
              </Button>
            </Upload>
          </Space>
        </Form.Item>

        {/* Basic Information */}
        <Form.Item
          name="username"
          label={t("username", "users")}
          rules={[
            { required: true, message: t("username_required", "users") },
            { min: 3, message: t("username_min_length", "users") },
            { max: 30, message: t("username_max_length", "users") },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: t("username_pattern", "users"),
            },
          ]}
        >
          <Input placeholder={t("enter_username", "users")} />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("email", "users")}
          rules={[
            { required: true, message: t("email_required", "users") },
            { type: "email", message: t("email_invalid", "users") },
          ]}
        >
          <Input placeholder={t("enter_email", "users")} />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("password", "users")}
          rules={[
            { required: true, message: t("password_required", "users") },
            { min: 8, message: t("password_min_length", "users") },
          ]}
        >
          <Input.Password placeholder={t("enter_password", "users")} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t("confirm_password", "users")}
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: t("confirm_password_required", "users"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("passwords_not_match", "users")),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder={t("confirm_password", "users")} />
        </Form.Item>

        {/* Personal Information */}
        <Form.Item
          name="firstName"
          label={t("first_name", "users")}
          rules={[
            { required: true, message: t("first_name_required", "users") },
            { min: 2, message: t("first_name_min_length", "users") },
            { max: 50, message: t("first_name_max_length", "users") },
          ]}
        >
          <Input placeholder={t("enter_first_name", "users")} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t("last_name", "users")}
          rules={[
            { required: true, message: t("last_name_required", "users") },
            { min: 2, message: t("last_name_min_length", "users") },
            { max: 50, message: t("last_name_max_length", "users") },
          ]}
        >
          <Input placeholder={t("enter_last_name", "users")} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t("phone", "users")}
          rules={[
            {
              pattern: /^[+]?[1-9][\d]{0,15}$/,
              message: t("phone_invalid", "users"),
            },
          ]}
        >
          <Input placeholder={t("enter_phone", "users")} />
        </Form.Item>

        {/* Role and Department */}
        <Form.Item
          name="role"
          label={t("role", "users")}
          rules={[{ required: true, message: t("role_required", "users") }]}
        >
          <Select placeholder={t("select_role", "users")}>
            <Option value="super_admin">{t("super_admin", "users")}</Option>
            <Option value="admin">{t("admin", "users")}</Option>
            <Option value="manager">{t("manager", "users")}</Option>
            <Option value="user">{t("user", "users")}</Option>
            <Option value="guest">{t("guest", "users")}</Option>
          </Select>
        </Form.Item>

        <Form.Item name="department" label={t("department", "users")}>
          <Select placeholder={t("select_department", "users")} allowClear>
            <Option value="engineering">{t("engineering", "users")}</Option>
            <Option value="marketing">{t("marketing", "users")}</Option>
            <Option value="sales">{t("sales", "users")}</Option>
            <Option value="hr">{t("hr", "users")}</Option>
            <Option value="finance">{t("finance", "users")}</Option>
            <Option value="operations">{t("operations", "users")}</Option>
          </Select>
        </Form.Item>

        <Form.Item name="position" label={t("position", "users")}>
          <Input placeholder={t("enter_position", "users")} />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("status", "users")}
          rules={[{ required: true, message: t("status_required", "users") }]}
        >
          <Select placeholder={t("select_status", "users")}>
            <Option value="active">{t("active", "users")}</Option>
            <Option value="inactive">{t("inactive", "users")}</Option>
            <Option value="suspended">{t("suspended", "users")}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserCreationDrawer;
