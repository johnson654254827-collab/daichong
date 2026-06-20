import nodemailer from "nodemailer";
import { Order } from "./types";

const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.qq.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "654254827@qq.com",
    pass: process.env.SMTP_PASS || "",
  },
};

const notifyEmail = process.env.NOTIFY_EMAIL || "654254827@qq.com";

function getTransporter() {
  return nodemailer.createTransport(smtpConfig);
}

export async function sendNewOrderEmail(order: Order): Promise<boolean> {
  if (!smtpConfig.auth.pass) {
    console.log("[Notify] SMTP_PASS 未配置，跳过邮件通知");
    return false;
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"代充通知" <${smtpConfig.auth.user}>`,
      to: notifyEmail,
      subject: `🆕 新订单 - ${order.service} - ¥${order.total}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0f172a; color: #e2e8f0; border-radius: 16px;">
          <h2 style="color: #60a5fa; margin-bottom: 16px;">🔔 新订单通知</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8;">订单号</td><td style="padding: 8px 0; font-family: monospace;">${order.id}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">服务</td><td style="padding: 8px 0;">${order.service}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">充值金额</td><td style="padding: 8px 0;">$${order.amount}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">手续费</td><td style="padding: 8px 0;">¥${order.fee}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">应付</td><td style="padding: 8px 0; font-weight: bold; color: #60a5fa; font-size: 18px;">¥${order.total}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">账户</td><td style="padding: 8px 0;">${order.accountInfo}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">联系方式</td><td style="padding: 8px 0;">${order.contactInfo}</td></tr>
            ${order.notes ? `<tr><td style="padding: 8px 0; color: #94a3b8;">备注</td><td style="padding: 8px 0;">${order.notes}</td></tr>` : ""}
          </table>
          <p style="margin-top: 16px; color: #64748b; font-size: 12px;">${new Date(order.createdAt).toLocaleString("zh-CN")}</p>
        </div>
      `,
    });
    console.log("[Notify] 邮件已发送");
    return true;
  } catch (e) {
    console.error("[Notify] 发送失败:", e);
    return false;
  }
}