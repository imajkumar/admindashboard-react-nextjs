import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ReduxProvider from "../store/ReduxProvider";
import ThemeProvider from "../contexts/ThemeContext";
import LanguageProvider from "../contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard with Ant Design and multi-language support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ReduxProvider>
            <LanguageProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </LanguageProvider>
          </ReduxProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
