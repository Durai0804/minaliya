"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ChatBot() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide the WhatsApp float on specific pages (like chat/admin dashboards)
  if (pathname === "/chat" || pathname.startsWith("/admin")) return null;

  // Show tooltip after a small delay to capture user attention (UX best practice)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Auto-hide after 8 seconds to stay clean
      const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
      return () => clearTimeout(hideTimer);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "917824807770";
  const message = "Hi";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes wa-pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        @keyframes wa-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .wa-float-btn {
          animation: wa-float 3s ease-in-out infinite;
        }
        .wa-pulse-effect {
          animation: wa-pulse 2s infinite;
        }
      `}</style>

      {/* ── Floating WhatsApp Button & Tooltip ── */}
      <div 
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[100] flex items-center gap-3 select-none pointer-events-none"
        style={{ fontFamily: "var(--font-body, sans-serif)" }}
      >
        {/* Beautiful premium tooltip */}
        <div
          className={`px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2 pointer-events-auto transition-all duration-500 origin-right max-w-[200px] sm:max-w-none ${
            showTooltip 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 translate-x-4 scale-95 pointer-events-none"
          }`}
          style={{
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Pulsing indicator dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Order or Chat on WhatsApp
          
          {/* Close button */}
          <button 
            onClick={() => setShowTooltip(false)}
            className="ml-1 text-stone-400 hover:text-stone-600 transition-colors p-0.5 rounded"
            aria-label="Close tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* The Float Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="wa-float-btn wa-pulse-effect pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 bg-[#25D366] hover:bg-[#20ba59]"
          aria-label="Order or Chat on WhatsApp"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512" 
            fill="currentColor" 
            className="w-7 h-7"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
