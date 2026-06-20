"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Order } from "@/lib/types";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
        <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mb-2 text-3xl font-bold">订单提交成功！</h1>
      <p className="mb-8 text-slate-400">请添加客服微信确认订单，我们会在 5 分钟内处理</p>

      {loading ? (
        <div className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="mx-auto h-4 w-48 rounded bg-slate-800" />
        </div>
      ) : order ? (
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-left backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">订单号</span>
            <span className="font-mono text-sm font-semibold">{order.id}</span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">服务</span>
            <span>{order.service}</span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">应付金额</span>
            <span className="text-lg font-bold text-blue-400">¥{order.total}</span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-slate-400">状态</span>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">待处理</span>
          </div>
        </div>
      ) : (
        <p className="text-slate-500">无法加载订单信息，请联系客服</p>
      )}

      <div className="mb-8 inline-flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-6 py-4">
        <span className="text-2xl">💬</span>
        <div className="text-left">
          <p className="text-xs text-slate-400">微信客服</p>
          <p className="font-mono font-semibold text-green-400">Cqxc868686</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/order"
          className="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-300 transition-all hover:border-slate-600"
        >
          继续下单
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-500 hover:to-blue-400"
        >
          返回首页
        </Link>
      </div>
    </>
  );
}