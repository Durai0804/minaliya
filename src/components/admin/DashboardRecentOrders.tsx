"use client";

import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import { ArrowRight } from "lucide-react";

export interface RecentOrder {
  id: string;
  status: string;
  totalAmount: number;
  customerName: string;
  createdAt: string;
}

interface DashboardRecentOrdersProps {
  orders: RecentOrder[];
}

export default function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="lg:col-span-2 rounded-2xl border overflow-hidden"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="flex items-center justify-between p-4 sm:p-6 border-b"
        style={{ borderColor: "var(--color-stone-100)" }}
      >
        <div>
          <h3 className="font-bold text-stone-900 text-base">Recent Orders</h3>
          <p className="text-xs text-stone-500 mt-1">Latest purchases made by customers</p>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-600 transition-colors shrink-0"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-stone-500 font-medium">
          No orders found. Set up some products and start selling!
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="md:hidden divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
            {orders.map((order) => (
              <Link
                key={order.id}
                href="/admin/orders"
                className="block p-4 hover:bg-stone-50/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-stone-500">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-semibold text-stone-900 text-sm mt-0.5 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-stone-900">₹{order.totalAmount}</p>
                    <div className="mt-1.5">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr
                  className="border-b text-stone-500 font-semibold"
                  style={{
                    borderColor: "var(--color-stone-100)",
                    background: "var(--color-stone-50)",
                  }}
                >
                  <th className="p-4 pl-6 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 pr-6 text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50/50 text-stone-600 transition-colors border-b"
                    style={{ borderColor: "var(--color-stone-100)" }}
                  >
                    <td className="p-4 pl-6 font-mono text-xs text-stone-500 font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4 font-medium text-stone-900">{order.customerName}</td>
                    <td className="p-4 font-semibold text-stone-900">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="p-4 pr-6 text-stone-500 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
