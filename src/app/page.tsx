import Link from "next/link";
import { SERVICES } from "@/lib/types";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            已服务 1000+ 用户
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            国外服务
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> 一键代充</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
            提供 ChatGPT、Claude、Midjourney、Netflix、Steam 等海外服务的代充值服务。
            国外正规银行卡直充，安全可靠，秒到账。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/order"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-xl hover:shadow-blue-500/30"
            >
              立即下单
            </Link>
            <a
              href="#services"
              className="rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-3.5 font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800"
            >
              查看服务
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold">服务项目</h2>
          <p className="mb-12 text-center text-slate-400">覆盖热门 AI 工具、流媒体、游戏平台</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition-all hover:border-blue-500/30 hover:bg-slate-800/50"
              >
                <div className="mb-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.category === "subscription" ? "bg-purple-500/10 text-purple-400" :
                    s.category === "topup" ? "bg-blue-500/10 text-blue-400" :
                    "bg-amber-500/10 text-amber-400"
                  }`}>
                    {s.category === "subscription" ? "订阅" : s.category === "topup" ? "充值" : "代购"}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.name}</h3>
                <p className="mb-3 text-sm text-slate-400">{s.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-500">{s.price}</span>
                  <span className="text-slate-600">→</span>
                  <span className="font-semibold text-blue-400">{s.fee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold">如何下单</h2>
          <p className="mb-12 text-center text-slate-400">三步完成，简单快捷</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "选择服务", desc: "浏览服务列表，选择你需要充值的平台和套餐" },
              { step: "2", title: "填写信息", desc: "提供充值账户信息和联系方式，计算费用" },
              { step: "3", title: "确认支付", desc: "联系客服确认订单，支付后立即处理充值" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-xl font-bold shadow-lg shadow-blue-500/20">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur sm:p-12">
          <h2 className="mb-4 text-2xl font-bold">联系我们</h2>
          <p className="mb-6 text-slate-400">
            下单后请添加客服微信确认订单，我们会在 5 分钟内响应
          </p>
          <div className="inline-flex items-center gap-3 rounded-xl bg-green-500/10 px-6 py-3 border border-green-500/20">
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <p className="text-xs text-slate-400">微信客服</p>
              <p className="font-mono font-semibold text-green-400">Cqxc868686</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
        <p>代充服务由个人运营，仅提供代付服务，不涉及账户密码</p>
      </footer>
    </main>
  );
}