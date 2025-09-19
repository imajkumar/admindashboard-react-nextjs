"use client";
import { Table, Space, Button, Tooltip, Input, Modal, Switch } from "antd";
import { Eye, LucideEdit3, SquareStar } from "lucide-react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EmpCreateDrawer from "@/components/forms/EmpCreateDrawer";

// ✅ 1. Interface
interface User {
    key: string;
    name: { en: string; fr: string };
    email: string;
    phone: string;
    role: { en: string; fr: string };
    assignBranch: { en: string; fr: string };
    status: boolean;
}

// ✅ 2. Dummy Data
const dummyUsers: User[] = [
    {
        key: "1",
        name: { en: "John Doe", fr: "Jean Dupont" },
        email: "john.doe@example.com",
        phone: "+1 555-1234",
        role: { en: "Administrator", fr: "Administrateur" },
        assignBranch: { en: "New York", fr: "New York" },
        status: true,
    },
    {
        key: "2",
        name: { en: "Alice Smith", fr: "Alice Martin" },
        email: "alice.smith@example.com",
        phone: "+33 6 12 34 56 78",
        role: { en: "Manager", fr: "Gestionnaire" },
        assignBranch: { en: "Paris", fr: "Paris" },
        status: false,
    },
    {
        key: "3",
        name: { en: "Robert Johnson", fr: "Robert Dubois" },
        email: "robert.johnson@example.com",
        phone: "+44 20 7946 0958",
        role: { en: "Staff", fr: "Employé" },
        assignBranch: { en: "London", fr: "Londres" },
        status: true,
    },
    {
        key: "4",
        name: { en: "Emma Brown", fr: "Emma Brun" },
        email: "emma.brown@example.com",
        phone: "+49 30 123456",
        role: { en: "Support", fr: "Support" },
        assignBranch: { en: "Berlin", fr: "Berlin" },
        status: true,
    },
];

export default function Employee() {
    const { t } = useLanguage();
    const { i18n } = useTranslation();
    const lang = ((i18n.language ?? "en").split("-")[0]) as "en" | "fr";
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ 3. Table Columns
    const columns: ColumnsType<User> = [
        {
            title: t("name", "table"),
            dataIndex: "name",
            render: (_: unknown, record: User) => record.name[lang],
        },
        {
            title: t("email", "table"),
            dataIndex: "email",
        },
        {
            title: t("phone", "table"),
            dataIndex: "phone",
        },
        {
            title: t("role", "table"),
            dataIndex: "role",
            render: (_: unknown, record: User) => record.role[lang],
        },
        {
            title: t("assignBranch", "table"),
            dataIndex: "assignBranch",
            render: (_: unknown, record: User) => record.assignBranch[lang],
        },
        {
            title: t("status", "table"),
            dataIndex: "status",
            render: (_: unknown, record: User) => {
                const isActive = record.status === true;
                return (
                    <span style={{ color: isActive ? "green" : "red" }}>
                        {isActive ? t("active", "common") : t("inActive", "common")}
                    </span>
                )
            }
        },
        {
            title: t("action", "table"),
            dataIndex: "action",
            render: (_: unknown, record: User) => (
                <Space>
                    <Tooltip title="View">
                        <Button type="text" className="text-neutral/70" icon={<Eye size={18} />} />
                    </Tooltip>
                    <Tooltip title="Give Permission">
                        <Button type="text" className="text-neutral/70" icon={<SquareStar size={18} />} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button type="text" className="text-neutral/70" icon={<LucideEdit3 size={18} />} />
                    </Tooltip>
                    <Switch
                        className="text-neutral/70"
                        checked={record?.status}
                    //  onChange={checked => console.log(checked)}
                    />

                </Space>
            ),
        },
    ];

    const handleCLick = () => {
        setIsModalOpen(true)
    }

    return (
        <div>
            <div className="flex justify-between my-4">
                <div>
                    <h1 className="text-2xl font-semibold">{t("emp", "common")}</h1>
                </div>

                <div className="flex gap-3 ">
                    <Input prefix={<SearchOutlined />} placeholder={t("search", "common")} className="w-64 " />
                    <Button
                        onClick={handleCLick}
                        type="primary" className="bg-primary" icon={<PlusOutlined />}>
                        {t("addEmp", "heading")}
                    </Button>
                </div>
            </div>
            <Table<User>
                dataSource={dummyUsers}
                columns={columns}
                className="custom-table"
                pagination={{ pageSize: 5 }}
                rowKey="key"
            />

            <EmpCreateDrawer visible={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => setIsModalOpen(false)} />
        </div>
    );
}
