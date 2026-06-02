"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { name: "Shop All Oils", href: "/shop" },
  { name: "Subscription", href: "/subscription" },
  { name: "About Minaliya", href: "/about" },
  { name: "Our Process", href: "/about#process" },
  { name: "Health Benefits", href: "/benefits" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

const categories = [
  { name: "Groundnut Oil", href: "/shop/groundnut-oil" },
  { name: "Coconut Oil", href: "/shop/coconut-oil" },
  { name: "Sesame Oil", href: "/shop/sesame-oil" },
  { name: "Mustard Oil", href: "/shop/mustard-oil" },
  { name: "Combo Packs", href: "/shop/combos" },
];

const policies = [
  { name: "Shipping Policy", href: "/policies/shipping" },
  { name: "Return & Refund", href: "/policies/returns" },
  { name: "Privacy Policy", href: "/policies/privacy" },
  { name: "Terms of Service", href: "/policies/terms" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-stone-900)",
        color: "var(--color-stone-300)",
      }}
    >
      {/* Newsletter Strip */}
      <div
        style={{
          background:
            "linear-gradient(90deg, var(--color-amber-500), var(--color-terra-400))",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Stay Fresh with Minaliya
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Get health tips, recipes, and exclusive offers in your inbox.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 md:w-72 px-5 py-3 rounded-full text-sm outline-none"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 shrink-0"
                style={{
                  background: "white",
                  color: "var(--color-amber-600)",
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Minaliya Logo" 
                width={180} 
                height={60} 
                className="h-14 w-auto object-contain invert" 
              />
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--color-stone-400)" }}>
              Pure wooden cold pressed oils, traditionally extracted using Mara
              Chekku methods in Chennai, Tamil Nadu. Bringing the authentic
              taste and health of traditional Indian oils to your kitchen.
            </p>
            <div className="space-y-3 text-sm" style={{ color: "var(--color-stone-400)" }}>
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>Shop No. 3, Kodambakkam Road, West Mambalam, Chennai - 600033</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0" />
                <a href="mailto:hello@minaliya.com" className="hover:text-white transition-colors">
                  hello@minaliya.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="shrink-0" />
                <span>Mon-Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Our Oils
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Policies
            </h4>
            <ul className="space-y-3">
              {policies.map((p) => (
                <li key={p.name}>
                  <Link
                    href={p.href}
                    className="text-sm hover:text-white transition-colors flex items-center gap-1.5 group"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment Methods */}
            <div className="mt-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                We Accept
              </h4>
              <div className="flex gap-2 flex-wrap">
                {["UPI", "Visa", "MC", "COD"].map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1.5 rounded-md text-[10px] font-bold"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "var(--color-stone-400)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--color-stone-500)" }}>
            <p>
              © {new Date().getFullYear()} Minaliya. All rights reserved. Handcrafted in
              Chennai, Tamil Nadu.
            </p>
            <p className="flex items-center gap-1.5">
              Made with <span className="text-red-400">♥</span> for healthier
              Indian kitchens
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
