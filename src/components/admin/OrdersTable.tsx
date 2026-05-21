"use client";

import { useState } from "react";
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
        background: "rgba(30, 41, 59, 0.3)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr
                className="border-b text-slate-400 font-semibold"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.05)",
                  background: "rgba(15, 23, 42, 0.2)",
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
            <tbody className="divide-y" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
              {orders.map((order) => {
                const isExpanded = !!expandedOrders[order.id];
                const isUpdating = updatingId === order.id;

                return (
                  <>
                    {/* Main Row */}
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/10 text-slate-300 transition-colors"
                    >
                      <td className="p-4 pl-6 text-center">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td className="p-4 font-mono text-xs text-indigo-400">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 font-semibold text-white">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <div className="text-xs font-semibold text-slate-300">{order.paymentMethod}</div>
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                            order.paymentStatus === "PAID"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          {order.paymentStatus}
                        </div>
                      </td>
                      <td className="p-4">
                        {isUpdating ? (
                          <div className="flex items-center gap-1.5 text-xs text-indigo-400">
                            <Loader2 size={12} className="animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <OrderStatusBadge status={order.status} />
                        )}
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
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
                          className="px-2 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700 outline-none cursor-pointer focus:border-indigo-500 transition-colors"
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
                      <tr className="bg-slate-900/40">
                        <td colSpan={8} className="p-6 pl-16 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Products Section */}
                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                                <CheckCircle size={14} className="text-indigo-400" />
                                Order Items ({order.items.length})
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                                        <Image
                                          src={item.productImage}
                                          alt={item.productName}
                                          fill
                                          className="object-contain"
                                        />
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-white text-xs">{item.productName}</h5>
                                        <p className="text-[10px] text-slate-400 mt-0.5">₹{item.price} each</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-bold text-slate-400">Qty: {item.quantity}</span>
                                      <p className="text-xs font-bold text-white mt-0.5">₹{item.price * item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Details Section */}
                            <div>
                              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                                <MapPin size={14} className="text-indigo-400" />
                                Shipping & Customer Details
                              </h4>
                              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3.5 text-xs text-slate-300">
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-slate-400 shrink-0 w-16">Customer:</span>
                                  <div>
                                    <p className="font-semibold text-white">{order.customerName}</p>
                                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                                      <Phone size={12} />
                                      {order.customerPhone}
                                    </div>
                                    {order.customerEmail && order.customerEmail !== "N/A" && (
                                      <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                                        <Mail size={12} />
                                        {order.customerEmail}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-start gap-2 border-t pt-3" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                                  <span className="font-bold text-slate-400 shrink-0 w-16">Address:</span>
                                  <div className="space-y-1">
                                    <p className="text-white leading-relaxed">
                                      {order.shippingAddress?.address}
                                    </p>
                                    <p className="text-slate-400">
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
                  </>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-500">
            No customer orders found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
