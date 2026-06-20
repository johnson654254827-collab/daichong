export interface Order {
  id: string;
  service: string;
  amount: number;
  fee: number;
  total: number;
  accountInfo: string;
  contactInfo: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  fee: string;
  category: "subscription" | "topup" | "giftcard";
}

export const SERVICES: Service[] = [
  { id: "chatgpt-plus", name: "ChatGPT Plus", description: "月费订阅，解锁 GPT-5、画图、联网等功能", price: "$20/月", fee: "¥150/月", category: "subscription" },
  { id: "openai-api", name: "OpenAI API 充值", description: "API 额度充值，按充值金额计费", price: "按需", fee: "充值金额 × 15%", category: "topup" },
  { id: "claude-pro", name: "Claude Pro", description: "Anthropic 专业版月费订阅", price: "$20/月", fee: "¥200/月", category: "subscription" },
  { id: "midjourney", name: "Midjourney", description: "AI 绘画订阅，基础/标准/专业版", price: "$10-60/月", fee: "¥100-480/月", category: "subscription" },
  { id: "onlyfans", name: "OnlyFans", description: "创作者订阅代付", price: "按需", fee: "充值金额 × 20%", category: "topup" },
  { id: "netflix", name: "Netflix", description: "流媒体月费订阅", price: "$7-23/月", fee: "¥55-180/月", category: "subscription" },
  { id: "youtube-premium", name: "YouTube Premium", description: "无广告 + 后台播放", price: "$14/月", fee: "¥120/月", category: "subscription" },
  { id: "spotify", name: "Spotify Premium", description: "音乐流媒体订阅", price: "$12/月", fee: "¥100/月", category: "subscription" },
  { id: "steam", name: "Steam 外区代购", description: "土耳其/阿根廷低价区游戏代购", price: "按游戏定价", fee: "游戏价格 × 12%", category: "giftcard" },
  { id: "google-play", name: "Google Play 美区", description: "美区应用/游戏内购代付", price: "按需", fee: "充值金额 × 15%", category: "topup" },
  { id: "adobe", name: "Adobe Creative Cloud", description: "设计全家桶订阅", price: "$60/月", fee: "¥480/月", category: "subscription" },
  { id: "apple-us", name: "Apple 美区", description: "美区 App Store / iCloud 代付", price: "按需", fee: "充值金额 × 15%", category: "topup" },
];
