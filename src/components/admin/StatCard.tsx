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
  color?: string; // Optional custom color scheme
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "indigo",
}: StatCardProps) {
  // Map color names to classes safely
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    indigo: {
      bg: "rgba(99, 102, 241, 0.1)",
      text: "#818cf8",
      border: "rgba(99, 102, 241, 0.2)",
    },
    emerald: {
      bg: "rgba(16, 185, 129, 0.1)",
      text: "#34d399",
      border: "rgba(16, 185, 129, 0.2)",
    },
    amber: {
      bg: "rgba(245, 158, 11, 0.1)",
      text: "#fbbf24",
      border: "rgba(245, 158, 11, 0.2)",
    },
    rose: {
      bg: "rgba(244, 63, 94, 0.1)",
      text: "#fb7185",
      border: "rgba(244, 63, 94, 0.2)",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "rgba(30, 41, 59, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border"
          style={{
            background: scheme.bg,
            color: scheme.text,
            borderColor: scheme.border,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-500 mt-2 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
