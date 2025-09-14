"use client";

import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Switch } from "antd";
import { useState } from "react";

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Cashier" },
  { id: 3, name: "Branch manager" },
  { id: 4, name: "Other" },
];

export default function Roles() {
  const [search, setSearch] = useState("");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Roles management</h2>
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Search by role name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="primary" className="bg-primary" icon={<PlusOutlined />}>
            Add Role
          </Button>
        </div>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white p-4 py-6 rounded-lg shadow-sm flex justify-between items-center"
          >
            <span className="font-medium">{role.name}</span>
            <div className="flex items-center gap-4">
              <EyeOutlined className="text-gray-500 cursor-pointer text-lg" />
              <EditOutlined className="text-gray-500 cursor-pointer text-lg" />
              <Switch />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
