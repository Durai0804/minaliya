"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { usePathname } from "next/navigation";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Map pathnames to beautiful page titles
  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Dashboard Overview";
    if (path.startsWith("/admin/orders")) return "Order Management";
    if (path.startsWith("/admin/products")) return "Product Inventory";
    if (path.startsWith("/admin/inquiries")) return "Bulk Inquiries";
    return "Admin Panel";
  };

  const title = getPageTitle(pathname);

  return (
    <div className="min-h-screen text-slate-100 flex" style={{ background: "#090d16" }}>
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header Bar */}
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title={title} />

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
