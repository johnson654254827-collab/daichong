import fs from "fs";
import path from "path";
import { Order } from "./types";

function getOrdersFile(): string {
  const cwd = process.cwd();
  const file = path.join(cwd, "data", "orders.json");
  if (fs.existsSync(file)) return file;
  const parentDir = path.resolve(cwd, "daichong");
  const parentFile = path.join(parentDir, "data", "orders.json");
  if (fs.existsSync(parentFile)) return parentFile;
  return file;
}

function ensureDataDir() {
  const dir = path.dirname(getOrdersFile());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = getOrdersFile();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
  }
}

function stripBOM(str: string): string {
  return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
}

export function getOrders(): Order[] {
  ensureDataDir();
  const raw = fs.readFileSync(getOrdersFile(), "utf-8");
  return JSON.parse(stripBOM(raw)) as Order[];
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function createOrder(data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">): Order {
  const orders = getOrders();
  const now = new Date().toISOString();
  const order: Order = {
    ...data,
    id: `DC${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  orders.push(order);
  fs.writeFileSync(getOrdersFile(), JSON.stringify(orders, null, 2), "utf-8");
  return order;
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  fs.writeFileSync(getOrdersFile(), JSON.stringify(orders, null, 2), "utf-8");
  return orders[idx];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  fs.writeFileSync(getOrdersFile(), JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}