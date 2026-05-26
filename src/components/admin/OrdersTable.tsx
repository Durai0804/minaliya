"use client";

import { Fragment, useState } from "react";
import { updateOrderStatus } from "@/actions/adminData";
import OrderStatusBadge from "./OrderStatusBadge";
import { ChevronDown, ChevronUp, Eye, Phone, Mail, MapPin, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Record<string, string>;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
}

interface OrdersTableProps {
  initialOrders: Order[];
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus as any);
      if (result.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(result.error || "Failed to update order status.");
      }
    } catch {
      alert("An unexpected error occurred while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr
                className="border-b text-stone-500 font-semibold"
                style={{
                  borderColor: "var(--color-stone-200)",
                  background: "var(--color-stone-50)",
                }}
              >
                <th className="p-4 pl-6 w-10"></th>
                <th className="p-4 text-xs uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs uppercase tracking-wider">Payment</th>
                <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs uppercase tracking-wider">Date</th>
                <th className="p-4 pr-6 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-stone-200)" }}>
              {orders.map((order) => {
                const isExpanded = !!expandedOrders[order.id];
                const isUpdating = updatingId === order.id;

                return (
                  <Fragment key={order.id}>
                    {/* Main Row */}
                    <tr
                      className="hover:bg-stone-50/50 text-stone-600 transition-colors border-b"
                      style={{ borderColor: "var(--color-stone-100)" }}
                    >
                      <td className="p-4 pl-6 text-center">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td className="p-4 font-mono text-xs text-stone-500 font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-stone-900">{order.customerName}</div>
                        <div className="text-xs text-stone-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 font-semibold text-stone-900">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <div className="text-xs font-semibold text-stone-700">{order.paymentMethod}</div>
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                            order.paymentStatus === "PAID"
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </div>
                      </td>
                      <td className="p-4">
                        {isUpdating ? (
                          <div className="flex items-center gap-1.5 text-xs text-stone-600">
                            <Loader2 size={12} className="animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <OrderStatusBadge status={order.status} />
                        )}
                      </td>
                      <td className="p-4 text-stone-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl text-xs bg-white text-stone-700 border border-stone-200 outline-none cursor-pointer focus:border-forest-500 transition-colors shadow-sm"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-stone-50/40">
                        <td colSpan={8} className="p-6 pl-16 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Products Section */}
                            <div>
                              <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-4 flex items-center gap-2">
                                <CheckCircle size={14} style={{ color: "var(--color-forest-600)" }} />
                                Order Items ({order.items.length})
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 shadow-sm"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-50 flex items-center justify-center shrink-0 border border-stone-200">
                                        <Image
                                          src={item.productImage}
                                          alt={item.productName}
                                          fill
                                          sizes="40px"
                                          className="object-contain"
                                        />
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-stone-900 text-xs">{item.productName}</h5>
                                        <p className="text-[10px] text-stone-500 mt-0.5">₹{item.price} each</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-bold text-stone-500">Qty: {item.quantity}</span>
                                      <p className="text-xs font-bold text-stone-900 mt-0.5">₹{item.price * item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Details Section */}
                            <div>
                              <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-4 flex items-center gap-2">
                                <MapPin size={14} style={{ color: "var(--color-forest-600)" }} />
                                Shipping & Customer Details
                              </h4>
                              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3.5 text-xs text-stone-600 shadow-sm">
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-stone-500 shrink-0 w-16">Customer:</span>
                                  <div>
                                    <p className="font-semibold text-stone-900">{order.customerName}</p>
                                    <div className="flex items-center gap-1.5 text-stone-500 mt-1">
                                      <Phone size={12} />
                                      {order.customerPhone}
                                    </div>
                                    {order.customerEmail && order.customerEmail !== "N/A" && (
                                      <div className="flex items-center gap-1.5 text-stone-500 mt-1">
                                        <Mail size={12} />
                                        {order.customerEmail}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-start gap-2 border-t pt-3" style={{ borderColor: "var(--color-stone-200)" }}>
                                  <span className="font-bold text-stone-500 shrink-0 w-16">Address:</span>
                                  <div className="space-y-1">
                                    <p className="text-stone-800 leading-relaxed font-medium">
                                      {order.shippingAddress?.address}
                                    </p>
                                    <p className="text-stone-500">
                                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-stone-500 font-medium">
            No customer orders found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
