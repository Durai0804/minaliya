"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/actions/admin";
import { Lock, Mail, Phone, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminLogin(email, phone);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Login failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: "var(--color-cream-50)" }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
      >
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--color-forest-200)" }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--color-amber-200)" }}
        />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "var(--color-forest-50)",
              border: "1px solid var(--color-forest-100)",
            }}
          >
            <ShieldCheck size={32} style={{ color: "var(--color-forest-600)" }} />
          </div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-800)" }}
          >
            Minaliya Admin
          </h1>
          <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
            Authorized personnel only
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-stone-600)" }}
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-stone-400)" }}
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@minaliya.in"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-300"
                  style={{
                    background: "white",
                    border: "1px solid var(--color-stone-200)",
                    color: "var(--color-stone-800)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-forest-400)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-forest-50)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-stone-200)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-stone-600)" }}
              >
                Admin Phone
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-stone-400)" }}
                />
                <input
                  required
                  type={showPhone ? "text" : "password"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all duration-300"
                  style={{
                    background: "white",
                    border: "1px solid var(--color-stone-200)",
                    color: "var(--color-stone-800)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-forest-400)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-forest-50)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-stone-200)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--color-stone-400)" }}
                  onMouseEnter={(e) => ((e.currentTarget).style.color = "var(--color-forest-600)")}
                  onMouseLeave={(e) => ((e.currentTarget).style.color = "var(--color-stone-400)")}
                >
                  {showPhone ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "var(--color-terra-50)",
                  border: "1px solid var(--color-terra-200)",
                  color: "var(--color-terra-500)",
                }}
              >
                <Lock size={14} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 rounded-xl"
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--color-stone-200)" }}>
            <p
              className="text-xs text-center flex items-center justify-center gap-1.5"
              style={{ color: "var(--color-stone-400)" }}
            >
              <ShieldCheck size={12} />
              Secured with httpOnly session cookies
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs transition-colors font-medium"
            style={{ color: "var(--color-stone-500)" }}
            onMouseEnter={(e) => ((e.currentTarget).style.color = "var(--color-forest-600)")}
            onMouseLeave={(e) => ((e.currentTarget).style.color = "var(--color-stone-500)")}
          >
            ← Back to Minaliya Store
          </a>
        </div>
      </div>
    </div>
  );
}
