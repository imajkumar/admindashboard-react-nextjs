import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard with Ant Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
