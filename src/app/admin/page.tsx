"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";

const ADMIN_PASSWORD = "zx220210";
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "待处理", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  processing: { label: "处理中", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  completed: { label: "已完成", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  cancelled: { label: "已取消", color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, fetchOrders]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("密码错误");
    }
  };

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
        setToast(`订单状态已更新为"${STATUS_MAP[status]?.label}"`);
      }
    } catch {
      // ignore
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    today: orders.filter((o) => {
      const today = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === today;
    }).length,
    revenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.fee, 0),
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-8 backdrop-blur">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="mb-2 text-center text-2xl font-bold">管理后台</h1>
            <p className="mb-6 text-center text-sm text-slate-400">请输入管理密码</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="管理密码"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-600 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                autoFocus
              />
              {loginError && <p className="text-sm text-red-400 text-center">{loginError}</p>}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/30"
              >
                登录
              </button>
            </form>
            <Link href="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-slate-400 transition-colors">
              返回首页
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400 backdrop-blur">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-2xl font-bold">订单管理</h1>
            <p className="text-sm text-slate-400">管理所有代充订单</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOrders} className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm transition-all hover:border-slate-500 hover:bg-slate-700/50">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  刷新中
                </span>
              ) : "刷新"}
            </button>
            <Link href="/" className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm transition-all hover:border-slate-500">
              返回首页
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-in">
          {[
            { label: "总订单", value: stats.total, color: "text-white", icon: "📦" },
            { label: "待处理", value: stats.pending, color: "text-amber-400", icon: "⏳" },
            { label: "今日订单", value: stats.today, color: "text-blue-400", icon: "📅" },
            { label: "总收入", value: `¥${stats.revenue}`, color: "text-green-400", icon: "💰" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-4 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span>{s.icon}</span>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap animate-fade-in">
          {[
            { key: "all", label: "全部" },
            { key: "pending", label: "待处理" },
            { key: "processing", label: "处理中" },
            { key: "completed", label: "已完成" },
            { key: "cancelled", label: "已取消" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="h-4 w-3/4 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-12 text-center animate-fade-in">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-slate-500">暂无订单</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 animate-fade-in">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">订单号</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">服务</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">金额</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">手续费</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">联系方式</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">时间</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-300">{order.id}</td>
                    <td className="px-4 py-3 text-sm">{order.service}</td>
                    <td className="px-4 py-3 text-sm">${order.amount}</td>
                    <td className="px-4 py-3 text-sm text-blue-400">¥{order.fee}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{order.contactInfo}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_MAP[order.status]?.color}`}>
                        {order.status === "pending" && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                          </span>
                        )}
                        {STATUS_MAP[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {order.status !== "processing" && order.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "processing")}
                            className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/20 transition-all"
                          >
                            处理
                          </button>
                        )}
                        {order.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "completed")}
                            className="rounded-lg bg-green-500/10 border border-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/20 transition-all"
                          >
                            完成
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "cancelled")}
                            className="rounded-lg bg-red-500/10 border border-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20 transition-all"
                          >
                            取消
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}