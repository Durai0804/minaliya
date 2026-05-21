"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/actions/admin";
import {
  LayoutDashboard,
  ShoppingBag,
  Leaf,
  MessageSquare,
  LogOut,
  X,
  ShieldAlert,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/products", icon: Leaf },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await adminLogout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "#0f172a", // Deep slate
          borderColor: "rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between h-16 px-6 border-b"
          style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <Link href="/admin" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              <ShieldAlert size={16} style={{ color: "#818cf8" }} />
            </div>
            <span
              className="text-lg font-bold text-white tracking-wide"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Minaliya Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white bg-indigo-600/10 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                }`}
                style={{
                  boxShadow: isActive ? "0 4px 12px rgba(99, 102, 241, 0.05)" : "none",
                }}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-indigo-400" : "text-slate-400"}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info & Logout */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
        >
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">mailme@minaliya.in</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
