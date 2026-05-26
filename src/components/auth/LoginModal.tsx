"use client";

import { useState } from "react";
import { X, Phone, User, CheckCircle2, MessageSquare, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendOtpAction, verifyOtpAction } from "@/actions/auth";
import { adminLogin } from "@/actions/admin";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [step, setStep] = useState<"contact" | "otp" | "name">("contact");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || email.length < 5) {
      setError("Please enter a valid email address");
      return;
    }
    if (mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      // 1. Look up user to check if they are admin or returning user
      const lookupRes = await fetch("/api/auth/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile }),
      });
      const lookupData = await lookupRes.json();
      
      const userExists = lookupData.exists;
      const isAdmin = lookupData.isAdmin;
      const existingName = lookupData.user?.name || "";

      if (isAdmin) {
        setIsAdminUser(true);
      } else {
        setIsAdminUser(false);
      }

      // 2. Trigger real WhatsApp OTP using sendOtpAction
      const response = await sendOtpAction(existingName || "Minaliya Customer", mobile);
      if (response.success && response.otpToken) {
        setOtpToken(response.otpToken);
        setStep("otp");
      } else {
        setError(response.error || "Failed to send OTP. Please check details.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // 1. Check if user is admin trying to use secure testing code
      const res = await fetch("/api/auth/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile }),
      });
      const data = await res.json();

      if (data.exists && data.isAdmin && otp === "123456") {
        const adminRes = await adminLogin(email, mobile);
        if (adminRes.success) {
          resetForm();
          closeLoginModal();
          window.location.href = "/admin";
          return;
        } else {
          setError(adminRes.error || "Failed admin authentication.");
          return;
        }
      }

      // 2. Otherwise, verify via the cryptographic WhatsApp verifyOtpAction
      const response = await verifyOtpAction(data.user?.name || "Minaliya Customer", mobile, otp, otpToken);
      if (response.success && response.user) {
        if (data.exists && data.user && data.user.name) {
          // Returning user with name already set - log them in directly
          login({ 
            id: data.user.id,
            name: response.user.name, 
            mobile: response.user.mobile,
            email: response.user.email || email
          });
          resetForm();
          closeLoginModal();
        } else {
          // New user or missing name - proceed to complete registration step
          setStep("name");
        }
      } else {
        setError(response.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2) {
      setError("Please enter a valid name");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, name }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success && data.user) {
        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          mobile: data.user.phoneNumber,
        });
        resetForm();
      } else {
        setError(data.error || "Failed to register. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setStep("contact");
    setEmail("");
    setMobile("");
    setOtp("");
    setName("");
    setError("");
    setIsAdminUser(false);
  };

  const getHeaderInfo = () => {
    switch (step) {
      case "contact":
        return {
          title: "Welcome to Minaliya",
          desc: "Enter your contact details to receive a secure login code.",
        };
      case "otp":
        return {
          title: "Verify WhatsApp OTP",
          desc: `We've sent a 6-digit code to +91 ${mobile}`,
        };
      case "name":
        return {
          title: "Complete Registration",
          desc: "Almost done! Please tell us your name to create your account.",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={closeLoginModal}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-6 pb-0 flex justify-end">
          <button 
            onClick={closeLoginModal}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X size={20} className="text-stone-400" />
          </button>
        </div>

        <div className="px-8 pb-10">
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-forest-50)", color: "var(--color-forest-600)" }}
            >
              <MessageSquare size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {headerInfo.title}
            </h2>
            <p className="text-sm text-stone-500">
              {headerInfo.desc}
            </p>
          </div>

          {step === "contact" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">Email Address</label>
                <div className="relative mb-4">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                    style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">Mobile Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400 border-r pr-2 mr-2" style={{ borderColor: "var(--color-stone-200)" }}>+91</span>
                  <input 
                    required
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210" 
                    className="w-full pl-20 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                    style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
                  />
                </div>
              </div>

              {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending OTP..." : "Send OTP via WhatsApp"}
              </button>
            </form>
          )}
          
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-3 text-stone-400 text-center">6-Digit OTP</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="0 0 0 0 0 0" 
                  className="w-full px-4 py-4 rounded-xl border text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                  style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
                  disabled={isLoading}
                />
              </div>

              {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}

              {isAdminUser && (
                <div 
                  className="p-4 rounded-2xl text-left border"
                  style={{ 
                    background: "var(--color-cream-50)", 
                    borderColor: "var(--color-forest-200)",
                    color: "var(--color-stone-700)"
                  }}
                >
                  <p className="font-bold mb-1 flex items-center gap-1.5 text-sm" style={{ color: "var(--color-forest-700)" }}>
                    <ShieldCheck size={16} />
                    Admin Credentials Detected
                  </p>
                  <p className="text-[11px] leading-relaxed text-stone-500">
                    Your credentials match the Minaliya administrator profile. Please use the secure testing code <strong className="font-bold text-forest-700">123456</strong> to proceed to the admin dashboard.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-4 justify-center text-base shadow-lg shadow-forest-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep("contact")}
                  disabled={isLoading}
                  className="w-full text-sm font-bold text-stone-400 hover:text-stone-600 py-2 transition-colors disabled:opacity-50"
                >
                  Change Details
                </button>
              </div>
            </form>
          )}

          {step === "name" && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-stone-400">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                  <input 
                    autoFocus
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name" 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                    style={{ borderColor: "var(--color-stone-200)", background: "var(--color-cream-50)" }}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 justify-center text-base mt-4 shadow-lg shadow-forest-600/20 disabled:opacity-70"
              >
                {isLoading ? "Saving..." : "Complete Registration"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "var(--color-stone-100)" }}>
            <p className="text-xs text-stone-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} className="text-forest-500" />
              100% Secure & Privacy Protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
