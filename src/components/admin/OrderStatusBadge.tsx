interface OrderStatusBadgeProps {
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const cleanStatus = status?.toUpperCase();

  const styles: Record<string, { bg: string; text: string; border: string; label: string }> = {
    PENDING: {
      bg: "rgba(245, 158, 11, 0.1)", // Amber
      text: "#fbbf24",
      border: "rgba(245, 158, 11, 0.2)",
      label: "Pending",
    },
    PROCESSING: {
      bg: "rgba(99, 102, 241, 0.1)", // Indigo/Blue
      text: "#818cf8",
      border: "rgba(99, 102, 241, 0.2)",
      label: "Processing",
    },
    SHIPPED: {
      bg: "rgba(6, 182, 212, 0.1)", // Cyan
      text: "#22d3ee",
      border: "rgba(6, 182, 212, 0.2)",
      label: "Shipped",
    },
    DELIVERED: {
      bg: "rgba(16, 185, 129, 0.1)", // Emerald
      text: "#34d399",
      border: "rgba(16, 185, 129, 0.2)",
      label: "Delivered",
    },
    CANCELLED: {
      bg: "rgba(244, 63, 94, 0.1)", // Rose
      text: "#fb7185",
      border: "rgba(244, 63, 94, 0.2)",
      label: "Cancelled",
    },
  };

  const style = styles[cleanStatus] || {
    bg: "rgba(148, 163, 184, 0.1)", // Slate grey
    text: "#94a3b8",
    border: "rgba(148, 163, 184, 0.2)",
    label: status,
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {style.label}
    </span>
  );
}
