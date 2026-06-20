import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { getOrders } = await import("@/lib/data");
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, amount, fee, total, accountInfo, contactInfo, notes } = body;

    if (!service || !accountInfo || !contactInfo) {
      return NextResponse.json({ error: "请填写必填字段" }, { status: 400 });
    }

    const { createOrder } = await import("@/lib/data");
    const order = createOrder({
      service,
      amount: Number(amount) || 0,
      fee: Number(fee) || 0,
      total: Number(total) || 0,
      accountInfo,
      contactInfo,
      notes: notes || "",
    });

    // 异步发送邮件通知（不阻塞响应）
    import("@/lib/notify").then(({ sendNewOrderEmail }) => {
      sendNewOrderEmail(order).catch(() => {});
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}