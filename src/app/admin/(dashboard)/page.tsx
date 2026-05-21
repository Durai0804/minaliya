import {
  getAdminDashboardStats,
  getRecentOrders,
} from "@/actions/adminData";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable static rendering for admin data pages

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const recentOrders = await getRecentOrders(5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="p-6 md:p-8 rounded-3xl border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)",
          borderColor: "rgba(99, 102, 241, 0.15)",
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome Back, Admin
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Monitor orders, manage store products, respond to bulk purchase inquiries, and oversee storefront performance analytics.
          </p>
        </div>
        {/* Glow backdrop */}
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px]"
          style={{ background: "rgba(99, 102, 241, 0.15)" }}
        />
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          trend={{ value: "+12.5%", positive: true }}
          description="Total earnings from all processed orders"
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={{ value: "+8.2%", positive: true }}
          description="Total storefront orders placed"
          color="indigo"
        />
        <StatCard
          title="Pending / Processing"
          value={stats.pendingOrders}
          icon={Clock}
          description="Active orders requiring action"
          color="amber"
        />
        <StatCard
          title="Bulk Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          description="Submitted customer request forms"
          color="rose"
        />
      </div>

      {/* Grid: Recent Activity & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{
            background: "rgba(30, 41, 59, 0.3)",
            borderColor: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
          >
            <div>
              <h3 className="font-bold text-white text-base">Recent Orders</h3>
              <p className="text-xs text-slate-500 mt-1">Latest purchases made by customers</p>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-white transition-colors"
            >
              View All Orders
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr
                    className="border-b text-slate-400 font-semibold"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.05)",
                      background: "rgba(15, 23, 42, 0.2)",
                    }}
                  >
                    <th className="p-4 pl-6 text-xs uppercase tracking-wider">Order ID</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Amount</th>
                    <th className="p-4 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 pr-6 text-xs uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/20 text-slate-300 transition-colors"
                    >
                      <td className="p-4 pl-6 font-mono text-xs text-indigo-400">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4 font-medium text-white">{order.customerName}</td>
                      <td className="p-4 font-semibold text-white">
                        ₹{order.totalAmount}
                      </td>
                      <td className="p-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="p-4 pr-6 text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500">
                No orders found. Set up some products and start selling!
              </div>
            )}
          </div>
        </div>

        {/* Store Insights Column */}
        <div
          className="rounded-2xl border p-6 flex flex-col justify-between"
          style={{
            background: "rgba(30, 41, 59, 0.3)",
            borderColor: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <div>
            <h3 className="font-bold text-white text-base mb-2">Store Performance</h3>
            <p className="text-xs text-slate-500 mb-6">Overview metrics of active inventory items</p>

            <div className="space-y-4">
              {/* Stat Progress 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Target Monthly Sales</span>
                  <span className="text-white">65% Achieved</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              {/* Stat Progress 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Stock Availability</span>
                  <span className="text-white">92% In Stock</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>

              {/* Stat Progress 3 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Customer Satisfaction</span>
                  <span className="text-white">4.8 / 5 Rating</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: "96%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-8 pt-6 border-t flex items-center justify-between"
            style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Upward Growth trend</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Updated just now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
