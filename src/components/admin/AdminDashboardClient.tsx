"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  MessageSquare,
} from "lucide-react";
import InteractiveStatCard from "./InteractiveStatCard";
import DashboardRecentOrders, { type RecentOrder } from "./DashboardRecentOrders";
import QuickActionsPanel from "./QuickActionsPanel";

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalInquiries: number;
  totalRevenue: number;
  pendingOrders: number;
  stockPercent: number;
  ordersTrend: number | null;
  revenueTrend: number | null;
}

interface AdminDashboardClientProps {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

export default function AdminDashboardClient({
  stats,
  recentOrders,
}: AdminDashboardClientProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 sm:p-6 md:p-8 rounded-3xl border relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-forest-50) 0%, var(--color-cream-100) 100%)",
          borderColor: "var(--color-forest-100)",
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome Back, Admin
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Tap any metric below to jump straight to orders or inquiries. All
            numbers update live from your store database.
          </p>
        </div>
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px]"
          style={{ background: "var(--color-forest-100)" }}
        />
      </motion.div>

      {/* Interactive stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <InteractiveStatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          isCurrency
          icon={DollarSign}
          href="/admin/orders"
          description="Total earnings from all orders"
          color="forest"
          trend={stats.revenueTrend}
          index={0}
        />
        <InteractiveStatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          href="/admin/orders"
          description="All storefront orders placed"
          color="indigo"
          trend={stats.ordersTrend}
          index={1}
        />
        <InteractiveStatCard
          title="Pending / Processing"
          value={stats.pendingOrders}
          icon={Clock}
          href="/admin/orders?status=active"
          description="Orders requiring your action"
          color="amber"
          pulse={stats.pendingOrders > 0}
          index={2}
        />
        <InteractiveStatCard
          title="Bulk Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          href="/admin/inquiries"
          description="Customer bulk request forms"
          color="rose"
          index={3}
        />
      </div>

      {/* Recent orders + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <DashboardRecentOrders orders={recentOrders} />
        <QuickActionsPanel
          pendingOrders={stats.pendingOrders}
          stockPercent={stats.stockPercent}
          totalProducts={stats.totalProducts}
        />
      </div>
    </div>
  );
}
