"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/lib/types";

export default function OrderPage() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedService = SERVICES.find((s) => s.id === service);

  const calcFee = () => {
    if (!amount) return 0;
    const amt = Number(amount);
    if (isNaN(amt)) return 0;
    return Math.round(amt * 0.2);
  };

  const fee = calcFee();
  const total = fee + (Number(amount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!service || !accountInfo || !contactInfo) {
      setError("请填写所有必填字段");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: selectedService?.name || service,
          amount: Number(amount) || 0,
          fee,
          total,
          accountInfo,
          contactInfo,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "提交失败");
      }

      const order = await res.json();
      router.push(`/order/success?id=${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        <h1 className="mb-2 text-3xl font-bold">提交订单</h1>
        <p className="mb-8 text-slate-400">填写以下信息，我们将在收到后尽快处理</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service */}
          <div>
            <label className="mb-2 block text-sm font-medium">选择服务 <span className="text-red-400">*</span></label>
            <select
              value={service}
              onChange={(e) => { setService(e.target.value); setAmount(""); }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择服务...</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.fee}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          {selectedService && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                {selectedService.category === "subscription" ? "套餐价格 (USD)" : "充值金额 (USD)"}
                <span className="text-red-400"> *</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={selectedService.category === "subscription" ? "如: 20" : "如: 50"}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-8 pr-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Fee Summary */}
          {amount && fee > 0 && (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">充值金额</span>
                <span>${amount}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-400">手续费</span>
                <span className="text-blue-400">¥{fee}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-700 pt-3 font-semibold">
                <span>合计应付</span>
                <span className="text-lg text-blue-400">¥{total}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">* 汇率按实时计算，以最终确认为准</p>
            </div>
          )}

          {/* Account Info */}
          <div>
            <label className="mb-2 block text-sm font-medium">充值账户信息 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={accountInfo}
              onChange={(e) => setAccountInfo(e.target.value)}
              placeholder="如: 需要充值的邮箱 / 账户 ID / 游戏名"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-slate-500">我们不会索要你的账户密码</p>
          </div>

          {/* Contact */}
          <div>
            <label className="mb-2 block text-sm font-medium">联系方式 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="微信号 / QQ号 / 手机号"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium">备注</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="如有特殊要求请在此说明"
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "提交中..." : "提交订单"}
          </button>

          <p className="text-center text-xs text-slate-500">
            提交后请添加客服微信 <span className="text-green-400">Cqxc868686</span> 确认订单
          </p>
        </form>
      </div>
    </main>
  );
}