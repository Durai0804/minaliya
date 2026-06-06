import {
  getAdminDashboardStats,
  getRecentOrders,
} from "@/actions/adminData";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getAdminDashboardStats(),
    getRecentOrders(5),
  ]);

  return <AdminDashboardClient stats={stats} recentOrders={recentOrders} />;
}
