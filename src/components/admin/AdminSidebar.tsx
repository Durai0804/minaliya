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
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "white",
          borderColor: "var(--color-stone-200)",
        }}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between h-16 px-6 border-b"
          style={{ borderColor: "var(--color-stone-200)" }}
        >
          <Link href="/admin" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--color-forest-50)",
                border: "1px solid var(--color-forest-100)",
              }}
            >
              <ShieldAlert size={16} style={{ color: "var(--color-forest-600)" }} />
            </div>
            <span
              className="text-lg font-bold tracking-wide"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}
            >
              Minaliya Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg lg:hidden transition-colors"
            style={{ color: "var(--color-stone-400)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-stone-700)"; e.currentTarget.style.background = "var(--color-stone-100)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-stone-400)"; e.currentTarget.style.background = "transparent"; }}
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? "var(--color-forest-700)" : "var(--color-stone-600)",
                  background: isActive ? "var(--color-forest-50)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--color-forest-500)" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--color-stone-50)";
                    e.currentTarget.style.color = "var(--color-stone-800)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-stone-600)";
                  }
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? "var(--color-forest-600)" : "var(--color-stone-400)" }}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Info & Logout */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--color-stone-200)" }}
        >
          <div
            className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl"
            style={{
              background: "var(--color-cream-100)",
              border: "1px solid var(--color-stone-200)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "var(--color-forest-50)",
                color: "var(--color-forest-600)",
                border: "1px solid var(--color-forest-100)",
              }}
            >
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--color-stone-800)" }}>Administrator</p>
              <p className="text-[10px] truncate" style={{ color: "var(--color-stone-500)" }}>mailme@minaliya.in</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              color: "var(--color-terra-500)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-terra-50)";
              e.currentTarget.style.borderColor = "var(--color-terra-200)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
