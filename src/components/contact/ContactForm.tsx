"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

const subjects = [
  "General Enquiry",
  "Order Related",
  "Bulk Order / Wholesale",
  "Product Feedback",
  "Shipping Query",
  "Other",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle
          size={56}
          className="mx-auto"
          style={{ color: "var(--color-forest-500)" }}
        />
        <h3
          className="text-xl font-bold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-stone-800)",
          }}
        >
          Message Sent!
        </h3>
        <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-secondary text-sm mt-4"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--color-stone-700)" }}
          >
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--color-cream-50)",
              border: "1.5px solid var(--color-stone-200)",
              color: "var(--color-stone-800)",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--color-stone-700)" }}
          >
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--color-cream-50)",
              border: "1.5px solid var(--color-stone-200)",
              color: "var(--color-stone-800)",
            }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--color-stone-700)" }}
        >
          Email Address *
        </label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--color-cream-50)",
            border: "1.5px solid var(--color-stone-200)",
            color: "var(--color-stone-800)",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--color-stone-700)" }}
        >
          Subject *
        </label>
        <select
          id="contact-subject"
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
          style={{
            background: "var(--color-cream-50)",
            border: "1.5px solid var(--color-stone-200)",
            color: "var(--color-stone-700)",
          }}
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--color-stone-700)" }}
        >
          Message *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          placeholder="Tell us how we can help you..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
          style={{
            background: "var(--color-cream-50)",
            border: "1.5px solid var(--color-stone-200)",
            color: "var(--color-stone-800)",
          }}
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto justify-center py-3 sm:py-4 px-10 text-base">
        <Send size={18} />
        Send Message
      </button>
    </form>
  );
}
