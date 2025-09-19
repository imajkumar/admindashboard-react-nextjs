"use client";
import React from "react";
import { Drawer, Input, Form, Select, Button, } from "antd";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmpCreateDrawerProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const { Option } = Select;

const EmpCreateDrawer: React.FC<EmpCreateDrawerProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const { t } = useLanguage();


    const handleFinish = () => {
        form.resetFields();
        onSuccess();
    };

    return (

        <Drawer
            title={t("addEmp", "heading")}
            open={visible}
            onClose={onClose}
            width={450}
            placement="right"
            bodyStyle={{ padding: 0 }}
        >
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: 24,
                        scrollbarWidth: "none",
                    }}
                    className="scroll-body"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        className="input-form"
                    >
                        <Form.Item
                            label={t("name", "table")}
                            name="name"
                            rules={[{ required: true, message: "Please enter name" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t("email", "table")}
                            name="email"
                            rules={[{ required: true, message: "Please enter email" }]}
                        >
                            <Input type="email" />
                        </Form.Item>

                        <Form.Item
                            label={t("phone", "table")}
                            name="phone"
                            rules={[{ required: true, message: "Please enter contact number" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={t("role", "table")}
                            name="role"
                            rules={[{ required: true, message: "Please select role" }]}
                        >
                            <Select placeholder="--Select--">
                                <Option value="admin">Admin</Option>
                                <Option value="manager">Manager</Option>
                                <Option value="staff">Staff</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t("assignBranch", "table")}
                            name="branch"
                            rules={[{ required: true, message: "Please select branch" }]}
                        >
                            <Select placeholder="--Select--">
                                <Option value="delhi">Delhi</Option>
                                <Option value="mumbai">Mumbai</Option>
                                <Option value="bangalore">Bangalore</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Assigned services"
                            name="services"
                            rules={[{ required: true, message: "Please select services" }]}
                        >
                            <Select mode="multiple" placeholder="--Select services--" allowClear>
                                <Option value="cleaning">Cleaning</Option>
                                <Option value="inspection">Inspection</Option>
                                <Option value="maintenance">Maintenance</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t("status", "table")}
                            name="status"
                            rules={[{ required: true, message: "Please select status" }]}
                        >
                            <Select placeholder="--Select--">
                                <Option value={true}>{t("active", "common")}</Option>
                                <Option value={false}>{t("inactive", "common")}</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </div>

                <div
                    style={{
                        padding: "16px 24px",
                        borderTop: "1px solid #f0f0f0",
                        background: "#fff",
                    }}
                >
                    <Button type="primary" className="bg-primary" htmlType="submit" onClick={() => form.submit()} block>
                        {t("save", "common")}
                    </Button>
                </div>
            </div>
        </Drawer>


    )
}

export default EmpCreateDrawer