import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "代充服务 - 国外服务一键充值",
  description: "ChatGPT、Claude、Midjourney、Netflix、Steam 等海外服务代充值，国外正规银行卡直充，安全可靠",
  keywords: "代充,ChatGPT Plus,Claude Pro,Midjourney,Netflix,Steam,国外银行卡,海外充值",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}