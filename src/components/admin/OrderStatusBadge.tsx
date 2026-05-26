interface OrderStatusBadgeProps {
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const cleanStatus = status?.toUpperCase();

  const styles: Record<string, { bg: string; text: string; border: string; label: string }> = {
    PENDING: {
      bg: "#fffbeb",
      text: "#b45309",
      border: "#fde68a",
      label: "Pending",
    },
    PROCESSING: {
      bg: "#eef2ff",
      text: "#4338ca",
      border: "#c7d2fe",
      label: "Processing",
    },
    SHIPPED: {
      bg: "#f5f3ff",
      text: "#7c3aed",
      border: "#ddd6fe",
      label: "Shipped",
    },
    DELIVERED: {
      bg: "var(--color-forest-50)",
      text: "var(--color-forest-700)",
      border: "var(--color-forest-200)",
      label: "Delivered",
    },
    CANCELLED: {
      bg: "#fff1f2",
      text: "#be123c",
      border: "#fecdd3",
      label: "Cancelled",
    },
  };

  const style = styles[cleanStatus] || {
    bg: "var(--color-stone-50)",
    text: "var(--color-stone-600)",
    border: "var(--color-stone-200)",
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
