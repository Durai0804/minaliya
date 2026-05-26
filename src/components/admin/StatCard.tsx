import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "forest",
}: StatCardProps) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    forest: {
      bg: "var(--color-forest-50)",
      text: "var(--color-forest-600)",
      iconBg: "var(--color-forest-100)",
    },
    indigo: {
      bg: "#eef2ff",
      text: "#4f46e5",
      iconBg: "#e0e7ff",
    },
    amber: {
      bg: "var(--color-amber-50)",
      text: "var(--color-amber-600)",
      iconBg: "var(--color-amber-100)",
    },
    emerald: {
      bg: "#ecfdf5",
      text: "#059669",
      iconBg: "#d1fae5",
    },
    rose: {
      bg: "#fff1f2",
      text: "#e11d48",
      iconBg: "#ffe4e6",
    },
  };

  const scheme = colorMap[color] || colorMap.forest;

  return (
    <div
      className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>{title}</span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: scheme.iconBg,
            color: scheme.text,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-stone-900)" }}>
          {value}
        </span>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend.positive ? "#ecfdf5" : "#fff1f2",
              color: trend.positive ? "#059669" : "#e11d48",
            }}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs mt-2 font-medium" style={{ color: "var(--color-stone-400)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
