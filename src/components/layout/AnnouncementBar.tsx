"use client";

import { useState } from "react";
import { X, Truck, Phone, CreditCard } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const announcements = [
    { icon: <Truck size={14} />, text: "Free Shipping on Orders Above ₹499" },
    { icon: <CreditCard size={14} />, text: "Free Shipping in TN, KL, KA, TG, AP" },
    { icon: <Phone size={14} />, text: "WhatsApp Order: +91 98765 43210" },
    { text: "100% Pure Wooden Cold Pressed Oils" },
  ];

  return (
    <div
      id="announcement-bar"
      className="relative overflow-hidden"
      style={{ background: "var(--color-forest-700)", color: "var(--color-cream-100)" }}
    >
      <div className="flex items-center justify-center py-2 px-4">
        <div className="overflow-hidden max-w-5xl w-full">
          <div className="flex animate-scroll-left whitespace-nowrap gap-12 items-center">
            {[...announcements, ...announcements].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase"
                style={{ color: "var(--color-cream-200)" }}
              >
                {item.icon}
                {item.text}
                <span className="mx-4 opacity-30">•</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
