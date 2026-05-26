"use client";

import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export default function AdminHeader({ onMenuToggle, title }: AdminHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--color-stone-200)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg lg:hidden transition-colors"
          aria-label="Toggle menu"
          style={{ color: "var(--color-stone-500)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-stone-800)"; e.currentTarget.style.background = "var(--color-stone-100)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-stone-500)"; e.currentTarget.style.background = "transparent"; }}
        >
          <Menu size={20} />
        </button>

        <h1
          className="text-lg font-bold tracking-wide"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Visit Store — opens in new tab */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            color: "var(--color-forest-700)",
            background: "var(--color-forest-50)",
            border: "1px solid var(--color-forest-100)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-forest-600)";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "var(--color-forest-600)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-forest-50)";
            e.currentTarget.style.color = "var(--color-forest-700)";
            e.currentTarget.style.borderColor = "var(--color-forest-100)";
          }}
        >
          <ExternalLink size={12} />
          Visit Store
        </Link>

        {/* Status Indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "var(--color-forest-50)",
            border: "1px solid var(--color-forest-100)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--color-forest-400)" }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--color-forest-500)" }}></span>
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--color-forest-600)" }}
          >
            Live Mode
          </span>
        </div>
      </div>
    </header>
  );
}
