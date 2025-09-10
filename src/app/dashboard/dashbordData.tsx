"use client";

import { useState, useEffect } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Table,
    Tag,
    Button,
    Statistic,
    Select
} from "antd";

import {
    EyeOutlined,
} from "@ant-design/icons";

import {
    RefreshCcw,
    Users,
    Briefcase,
    BadgeCheck,
    Clock,
    Timer,
    Ticket,
    UserCheck,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

const statCards = [
    {
        title: "Active agency",
        value: 12,
        icon: <Users className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Inactive agency",
        value: 5,
        icon: <Briefcase className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Total Employees",
        value: 65,
        icon: <Users className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Today tickets Issued",
        value: 324,
        icon: <Ticket className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Average waiting time",
        value: "14min",
        icon: <Clock className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Average processing time",
        value: "14min",
        icon: <Timer className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Waiting tickets",
        value: 320,
        icon: <Ticket className="text-blue-500 w-6 h-6" />,
    },
    {
        title: "Total VIP customers",
        value: 47,
        icon: <UserCheck className="text-blue-500 w-6 h-6" />,
    },
];

const pieData = [
    { name: "Active", value: 12000 },
    { name: "Inactive", value: 5000 },
];

const COLORS = ["#00C49F", "#FF5B5B"];

const barData = [
    { name: "Account opening", value: 15 },
    { name: "Cash withdraw", value: 22 },
    { name: "Deposit", value: 45 },
    { name: "Loan", value: 17 },
    { name: "Query", value: 35 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white px-2 py-1 rounded text-xs">
                {payload[0].value}
            </div>
        );
    }
    return null;
};


const userData = [
    {
        key: "1",
        branchId: "HD01",
        totalUsers: 3,
        assignedService: 3,
        assignedDisplay: 5,
        status: "Active",
    },
    {
        key: "2",
        branchId: "HD01",
        totalUsers: 10,
        assignedService: 3,
        assignedDisplay: 5,
        status: "Active",
    },
    {
        key: "3",
        branchId: "HD01",
        totalUsers: 12,
        assignedService: 3,
        assignedDisplay: 5,
        status: "Active",
    },
    {
        key: "4",
        branchId: "HD01",
        totalUsers: 16,
        assignedService: 3,
        assignedDisplay: 5,
        status: "Active",
    },
];

export default function DashboardData() {
    const columns = [
        {
            title: "Branch ID",
            dataIndex: "branchId",
            key: "branchId",
        },
        {
            title: "Total user",
            dataIndex: "totalUsers",
            key: "totalUsers",
        },
        {
            title: "Assigned service",
            dataIndex: "assignedService",
            key: "assignedService",
        },
        {
            title: "Assigned display",
            dataIndex: "assignedDisplay",
            key: "assignedDisplay",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "red"} style={{ fontWeight: 500 }}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <EyeOutlined style={{ fontSize: 16, cursor: "pointer", color: "#555" }} />
            ),
        },
    ];
    return (

        <>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div>
                    <Button type="primary" className="bg-primary" icon={<RefreshCcw size={16} />}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 bg-white px-4 py-6 rounded-md shadow-sm border"
                    >
                        <div className="bg-blue-100 rounded-full p-2">{stat.icon}</div>
                        <div>
                            <div className="text-lg font-semibold">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Graphs Section */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} md={8}>
                    <div className="rounded-xl p-4 bg-primary relative overflow-hidden text-white">
                        <div className="text-white font-medium mb-2">Agency</div>
                        <div className="h-[250px] flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        startAngle={90}
                                        endAngle={-270}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute text-xl font-bold">17k</div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-4 text-sm font-medium text-white">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></span>
                                Active : 12k
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></span>
                                Inactive : 5k
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={16}>
                    <div className="rounded-xl bg-white p-4 shadow-sm h-full">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-semibold">334 visit</div>
                            <div className="flex gap-2">
                                <Select
                                    defaultValue="All agency"
                                    options={[{ value: "All agency", label: "All agency" }]}
                                    size="small"
                                    className="w-32"
                                />
                                <Select
                                    defaultValue="Today"
                                    options={[{ value: "Today", label: "Today" }]}
                                    size="small"
                                    className="w-24"
                                />
                            </div>
                        </div>

                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} barCategoryGap={40}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                                    <Bar
                                        dataKey="value"
                                        fill="#1677ff"
                                        radius={[6, 6, 0, 0]}
                                        barSize={30}
                                        activeBar={false}
                                    />
                                </BarChart>

                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
            </Row>


            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} >
                    <Card
                        title="All Branches"
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
            </Row>
        </>
    )
}

