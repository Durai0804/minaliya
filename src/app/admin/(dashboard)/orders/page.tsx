import { getAllOrders } from "@/actions/adminData";
import OrdersTable from "@/components/admin/OrdersTable";

export const revalidate = 0; // Disable static rendering for admin data pages

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Manage Storefront Orders
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Track customer orders, review items, update delivery fulfillment statuses, and manage payments.
          </p>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm shrink-0 whitespace-nowrap">
          {orders.length} Total Orders
        </div>
      </div>

      {/* Orders Table Wrapper */}
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
