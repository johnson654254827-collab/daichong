import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { getOrderById } = await import("@/lib/data");
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["pending", "processing", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "无效的状态" }, { status: 400 });
    }

    const { updateOrderStatus } = await import("@/lib/data");
    const updated = updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}