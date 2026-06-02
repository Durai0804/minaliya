"use client";

import { useState } from "react";
import { Mail, Phone, Building2, PackageOpen, Calendar, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  message: string | null;
  createdAt: string;
}

interface InquiriesTableProps {
  inquiries: Inquiry[];
}

export default function InquiriesTable({ inquiries }: InquiriesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "white",
        borderColor: "var(--color-stone-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="overflow-x-auto">
        {inquiries.length > 0 ? (
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap min-w-[800px]">
            <thead>
              <tr
                className="border-b text-stone-500 font-semibold"
                style={{
                  borderColor: "var(--color-stone-200)",
                  background: "var(--color-stone-50)",
                }}
              >
                <th className="p-4 pl-6 w-10"></th>
                <th className="p-4 text-xs uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs uppercase tracking-wider">Company</th>
                <th className="p-4 text-xs uppercase tracking-wider">Product Info</th>
                <th className="p-4 text-xs uppercase tracking-wider">Quantity</th>
                <th className="p-4 text-xs uppercase tracking-wider">Submitted On</th>
                <th className="p-4 pr-6 text-xs uppercase tracking-wider text-right">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-stone-200)" }}>
              {inquiries.map((inquiry) => {
                const isExpanded = expandedId === inquiry.id;

                return (
                  <>
                    <tr
                      key={inquiry.id}
                      className="hover:bg-stone-50/50 text-stone-600 transition-colors border-b"
                      style={{ borderColor: "var(--color-stone-100)" }}
                    >
                      <td className="p-4 pl-6 text-center">
                        {inquiry.message ? (
                          <button
                            onClick={() => toggleExpand(inquiry.id)}
                            className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        ) : (
                          <span className="text-stone-400 font-semibold">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-stone-900">{inquiry.name}</div>
                        <div className="flex items-center gap-3 text-stone-500 text-xs mt-1">
                          <span className="flex items-center gap-1">
                            <Phone size={10} />
                            {inquiry.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail size={10} />
                            {inquiry.email}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {inquiry.company ? (
                          <span className="flex items-center gap-1 text-stone-700 font-medium">
                            <Building2 size={12} style={{ color: "var(--color-forest-600)" }} />
                            {inquiry.company}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">Individual</span>
                        )}
                      </td>
                      <td className="p-4 text-stone-900 font-medium">
                        {inquiry.product}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-700 border border-forest-200">
                          {inquiry.quantity} Liters
                        </span>
                      </td>
                      <td className="p-4 text-stone-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-stone-400" />
                          {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {inquiry.message ? (
                          <button
                            onClick={() => toggleExpand(inquiry.id)}
                            className="text-xs font-bold text-forest-700 hover:text-forest-600 transition-colors uppercase tracking-wider"
                          >
                            {isExpanded ? "Collapse" : "Read Msg"}
                          </button>
                        ) : (
                          <span className="text-xs text-stone-400 italic">No notes</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Message Content */}
                    {isExpanded && inquiry.message && (
                      <tr className="bg-stone-50/40">
                        <td colSpan={7} className="p-6 pl-16 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
                          <div className="max-w-3xl">
                            <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2 flex items-center gap-2">
                              <MessageSquare size={14} style={{ color: "var(--color-forest-600)" }} />
                              Custom Message / Business Notes
                            </h4>
                            <p className="text-stone-700 text-xs leading-relaxed bg-white border border-stone-200 p-4 rounded-xl whitespace-pre-wrap shadow-sm">
                              {inquiry.message}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-stone-500 font-medium">
            No bulk inquiry forms submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}
