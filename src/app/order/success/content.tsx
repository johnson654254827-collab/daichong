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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const copyWechat = () => {
    navigator.clipboard.writeText("Cqxc868686");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 animate-scale-in">
        <svg className="h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mb-2 text-3xl font-bold animate-slide-up">订单提交成功！</h1>
      <p className="mb-8 text-slate-400 animate-slide-up">请添加客服微信并完成支付，我们会在 5 分钟内处理</p>

      <div className="animate-fade-in space-y-6">
        {/* Order Details */}
        {loading ? (
          <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="mx-auto h-4 w-48 rounded bg-slate-800" />
          </div>
        ) : order ? (
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-6 text-left backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">订单号</span>
              <span className="font-mono text-sm font-semibold text-blue-300">{order.id}</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">服务</span>
              <span>{order.service}</span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">充值金额</span>
              <span>${order.amount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
              <span className="font-semibold">应付金额</span>
              <span className="text-2xl font-bold text-blue-400">¥{order.total}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">状态</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                </span>
                待处理
              </span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">无法加载订单信息，请联系客服</p>
        )}

        {/* Payment */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-6 backdrop-blur">
          <h3 className="mb-4 text-lg font-semibold flex items-center justify-center gap-2">
            <span>💳</span> 扫码支付
          </h3>
          <div className="mx-auto mb-3 w-48">
            <img
              src="/qrcode.png"
              alt="收款二维码"
              className="h-48 w-48 rounded-2xl border border-slate-700 bg-white p-2 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          {order && (
            <p className="text-center text-lg font-bold text-blue-400">¥{order.total}</p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            支付完成后截图发给客服确认
          </p>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 backdrop-blur">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-xs text-slate-400">微信客服</p>
              <p className="font-mono font-semibold text-green-400">Cqxc868686</p>
            </div>
          </div>
          <button
            onClick={copyWechat}
            className="mx-auto flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400 hover:bg-green-500/20 transition-all"
          >
            {copied ? "✅ 已复制" : "📋 复制微信号"}
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4 animate-slide-up">
        <Link
          href="/order"
          className="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-medium text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-700/50"
        >
          继续下单
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/30"
        >
          返回首页
        </Link>
      </div>
    </>
  );
}