"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";

interface InteractiveStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  href: string;
  description?: string;
  color?: string;
  trend?: number | null;
  pulse?: boolean;
  index?: number;
  isCurrency?: boolean;
}

const colorMap: Record<string, { text: string; iconBg: string; border: string }> = {
  forest: {
    text: "var(--color-forest-600)",
    iconBg: "var(--color-forest-100)",
    border: "var(--color-forest-200)",
  },
  indigo: { text: "#4f46e5", iconBg: "#e0e7ff", border: "#c7d2fe" },
  amber: {
    text: "var(--color-amber-600)",
    iconBg: "var(--color-amber-100)",
    border: "var(--color-amber-200)",
  },
  rose: { text: "#e11d48", iconBg: "#ffe4e6", border: "#fecdd3" },
};

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

export default function InteractiveStatCard({
  title,
  value,
  icon: Icon,
  href,
  description,
  color = "forest",
  trend,
  pulse = false,
  index = 0,
  isCurrency = false,
}: InteractiveStatCardProps) {
  const scheme = colorMap[color] || colorMap.forest;
  const animatedValue = useCountUp(value);

  const displayValue = isCurrency
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(animatedValue)
    : animatedValue.toLocaleString("en-IN");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Link href={href} className="block group focus:outline-none">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative p-5 sm:p-6 rounded-2xl border transition-shadow duration-300 min-h-[140px] focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:ring-offset-2"
          style={{
            background: "white",
            borderColor: "var(--color-stone-200)",
            boxShadow: "var(--shadow-card)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = scheme.border;
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "var(--shadow-card-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "var(--color-stone-200)";
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "var(--shadow-card)";
          }}
        >
          {pulse && value > 0 && (
            <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: scheme.text }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: scheme.text }}
              />
            </span>
          )}

          <div className="flex items-center justify-between mb-4">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-stone-500)" }}
            >
              {title}
            </span>
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: scheme.iconBg, color: scheme.text }}
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Icon size={20} />
            </motion.div>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--color-stone-900)" }}
            >
              {displayValue}
            </span>
            {trend != null && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: trend >= 0 ? "#ecfdf5" : "#fff1f2",
                  color: trend >= 0 ? "#059669" : "#e11d48",
                }}
              >
                {trend >= 0 ? "+" : ""}
                {trend}% vs last month
              </span>
            )}
          </div>

          {description && (
            <p
              className="text-xs mt-2 font-medium"
              style={{ color: "var(--color-stone-400)" }}
            >
              {description}
            </p>
          )}

          <p
            className="text-xs font-semibold mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
            style={{ color: scheme.text }}
          >
            View details
            <ArrowRight size={12} />
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
