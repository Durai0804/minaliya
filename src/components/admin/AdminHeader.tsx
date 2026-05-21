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
        background: "rgba(15, 23, 42, 0.8)", // Semi-transparent slate-900
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <h1
          className="text-lg font-bold text-white tracking-wide"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Link back to Main Store */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 hover:text-white hover:bg-indigo-500/10 border border-indigo-500/20 transition-all duration-200"
        >
          <ExternalLink size={12} />
          View Store
        </Link>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Live Mode
          </span>
        </div>
      </div>
    </header>
  );
}
