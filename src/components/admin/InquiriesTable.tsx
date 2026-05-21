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
        background: "rgba(30, 41, 59, 0.3)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="overflow-x-auto">
        {inquiries.length > 0 ? (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr
                className="border-b text-slate-400 font-semibold"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.05)",
                  background: "rgba(15, 23, 42, 0.2)",
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
            <tbody className="divide-y" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
              {inquiries.map((inquiry) => {
                const isExpanded = expandedId === inquiry.id;

                return (
                  <>
                    <tr
                      key={inquiry.id}
                      className="hover:bg-slate-800/10 text-slate-300 transition-colors"
                    >
                      <td className="p-4 pl-6 text-center">
                        {inquiry.message ? (
                          <button
                            onClick={() => toggleExpand(inquiry.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        ) : (
                          <span className="text-slate-600 font-semibold">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{inquiry.name}</div>
                        <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
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
                          <span className="flex items-center gap-1 text-slate-200">
                            <Building2 size={12} className="text-indigo-400" />
                            {inquiry.company}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Individual</span>
                        )}
                      </td>
                      <td className="p-4 text-white font-medium">
                        {inquiry.product}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {inquiry.quantity} Liters
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-500" />
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
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                          >
                            {isExpanded ? "Collapse" : "Read Msg"}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 italic">No notes</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Message Content */}
                    {isExpanded && inquiry.message && (
                      <tr className="bg-slate-900/40">
                        <td colSpan={7} className="p-6 pl-16 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                          <div className="max-w-3xl">
                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
                              <MessageSquare size={14} className="text-indigo-400" />
                              Custom Message / Business Notes
                            </h4>
                            <p className="text-slate-300 text-xs leading-relaxed bg-slate-800/40 border border-slate-800 p-4 rounded-xl whitespace-pre-wrap">
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
          <div className="p-12 text-center text-slate-500">
            No bulk inquiry forms submitted yet.
          </div>
        )}
      </div>
    </div>
  );
}
