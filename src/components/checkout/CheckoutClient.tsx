"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { ChevronRight, Lock, MapPin, CreditCard, CheckCircle2, ShoppingBag, ArrowLeft, AlertCircle, Tag, X, ChevronDown } from "lucide-react";
import { createOrder } from "@/actions/order";

interface Coupon {
  code: string;
  type: "percentage" | "freeship";
  value: number; // e.g. 10 for 10%
  minOrderValue?: number; // e.g. 500
  description: string;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "10% off on all items! (First-time user offer)",
  },
  {
    code: "FESTIVAL15",
    type: "percentage",
    value: 15,
    minOrderValue: 500,
    description: "15% off on orders above ₹500 (Festival Offer)",
  },
  {
    code: "MINALIYA20",
    type: "percentage",
    value: 20,
    minOrderValue: 1000,
    description: "20% off on orders above ₹1000 (Premium/Special Offer)",
  },
  {
    code: "FREESHIP",
    type: "freeship",
    value: 0,
    description: "Free shipping on any order value!",
  },
];

export default function CheckoutClient() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [selectedPayment, setSelectedPayment] = useState<"card" | "upi" | "cod">("card");
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null);
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" });

  // Shipping form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const hasSubscription = items.some((item) => item.slug.startsWith("subscription-"));

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.type === "percentage") {
    discountAmount = Math.round((totalPrice * appliedCoupon.value) / 100);
  }

  // Shipping cost: free if subscription, or order total >= 499, or if FREESHIP coupon is applied
  const isFreeShipCoupon = appliedCoupon?.type === "freeship";
  const shippingCost = (totalPrice >= 499 || hasSubscription || isFreeShipCoupon) ? 0 : 50;

  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  const handleApplyCoupon = (code: string) => {
    setCouponError("");
    setCouponSuccess("");
    
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const coupon = AVAILABLE_COUPONS.find(c => c.code === formattedCode);
    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    // Check minimum order value constraint
    if (coupon.minOrderValue && totalPrice < coupon.minOrderValue) {
      setCouponError(`This coupon requires a minimum order value of ₹${coupon.minOrderValue}.`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" applied successfully!`);
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const orderPayload = {
        totalAmount: finalTotal,
        shippingAddress: {
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: "Tamil Nadu", // Default state region
          pinCode: postalCode.trim(),
        },
        paymentMethod: selectedPayment.toUpperCase(),
        items: items.map((item) => ({
          productSlug: item.slug,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await createOrder(orderPayload);

      if (!res.success) {
        setFormError(res.error || "Failed to place order.");
        setIsSubmitting(false);
        return;
      }

      const orderId = res.orderId || `MNL-${Math.floor(100000 + Math.random() * 900000)}`;

      // Sync with local context for state consistency
      addOrder({
        id: orderId,
        date: new Date().toISOString(),
        items: [...items],
        totalPrice: finalTotal,
        status: "Processing",
      });

      setCreatedOrderId(orderId);
      setStep("success");
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: "var(--color-forest-100)", color: "var(--color-forest-600)" }}>
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Thank you for your order!
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--color-stone-500)" }}>
          Your order <span className="font-bold text-stone-900">#{createdOrderId}</span> has been placed successfully. We&apos;ve sent you a confirmation text and email.
        </p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-cream-100)", color: "var(--color-stone-300)" }}>
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Your cart is empty
        </h2>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "var(--color-stone-500)" }}>
          Looks like you haven&apos;t added any pure oils to your cart yet.
        </p>
        <Link href="/shop" className="btn-primary">
          Discover Our Oils
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="mb-8 flex items-center gap-2 text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
        <Link href="/shop" className="hover:text-stone-800 transition-colors flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
          Checkout
        </h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--color-forest-50)", color: "var(--color-forest-700)" }}>
          <Lock size={14} /> Secure Checkout
        </div>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-10">
        {/* Main Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Breadcrumbs/Progress */}
          <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: "var(--color-stone-200)" }}>
            <button
              onClick={() => setStep("shipping")}
              className={`text-sm font-bold flex items-center gap-2 ${step === "shipping" ? "text-stone-900" : "text-stone-400"}`}
            >
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs ${step === "shipping" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>1</span>
              <span className="hidden sm:inline">Shipping Details</span><span className="sm:hidden">Shipping</span>
            </button>
            <div className="h-px w-8 bg-stone-200" />
            <button
              onClick={() => {
                if (email && firstName && lastName && address && city && postalCode && phone) {
                  setStep("payment");
                } else {
                  setFormError("Please fill out all shipping details first.");
                }
              }}
              className={`text-sm font-bold flex items-center gap-2 ${step === "payment" ? "text-stone-900" : "text-stone-400"}`}
            >
              <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs ${step === "payment" ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}>2</span>
              Payment
            </button>
          </div>

          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {step === "shipping" && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <MapPin size={20} className="text-forest-600" /> Contact & Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>First Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="John" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Last Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Doe" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Address</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="123 Main St, Apartment 4B" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>City</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Chennai" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Postal Code / ZIP</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="600001" 
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Phone Number (for delivery updates)</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="9876543210" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/gi, "").slice(0, 10))}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                      style={{ background: "white", borderColor: "var(--color-stone-200)" }} 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (email && firstName && lastName && address && city && postalCode && phone) {
                        setStep("payment");
                        setFormError("");
                      } else {
                        setFormError("Please fill out all required shipping details first.");
                      }
                    }} 
                    className="btn-primary w-full sm:w-auto py-3.5 px-6 sm:px-8 text-sm sm:text-base justify-center"
                  >
                    Continue <span className="hidden sm:inline">to Payment</span> <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <CreditCard size={20} className="text-forest-600" /> Payment Details
                </h2>

                <div className="space-y-4">
                  {/* Payment Options */}
                  <label 
                    className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all" 
                    style={{ 
                      borderColor: selectedPayment === "card" ? "var(--color-forest-600)" : "var(--color-stone-200)", 
                      background: selectedPayment === "card" ? "var(--color-forest-50)" : "white" 
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                      className="w-5 h-5 text-forest-600 focus:ring-forest-500" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">Credit / Debit Card</p>
                      <p className="text-sm text-stone-500">Securely pay with your card</p>
                    </div>
                  </label>

                  <label 
                    className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-stone-50" 
                    style={{ 
                      borderColor: selectedPayment === "upi" ? "var(--color-forest-600)" : "var(--color-stone-200)", 
                      background: selectedPayment === "upi" ? "var(--color-forest-50)" : "white" 
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={selectedPayment === "upi"}
                      onChange={() => setSelectedPayment("upi")}
                      className="w-5 h-5 text-forest-600 focus:ring-forest-500" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">UPI / Netbanking</p>
                      <p className="text-sm text-stone-500">Pay using your preferred UPI app</p>
                    </div>
                  </label>
                  
                  <label 
                    className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-stone-50" 
                    style={{ 
                      borderColor: selectedPayment === "cod" ? "var(--color-forest-600)" : "var(--color-stone-200)", 
                      background: selectedPayment === "cod" ? "var(--color-forest-50)" : "white" 
                    }}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      checked={selectedPayment === "cod"}
                      onChange={() => setSelectedPayment("cod")}
                      className="w-5 h-5 text-forest-600 focus:ring-forest-500" 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-stone-900">Cash on Delivery</p>
                      <p className="text-sm text-stone-500">Pay when you receive the order</p>
                    </div>
                  </label>
                </div>

                {/* Card Details Section */}
                {selectedPayment === "card" && (
                  <div className="p-6 rounded-xl border mt-6 animate-fade-in" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Card Number</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000" 
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                          className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                          style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} 
                          required={selectedPayment === "card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>Expiry Date</label>
                          <input 
                            type="month" 
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} 
                            required={selectedPayment === "card"}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-stone-700)" }}>CVC</label>
                          <input 
                            type="text" 
                            placeholder="123" 
                            value={cardData.cvc}
                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-forest-200 outline-none transition-all" 
                            style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} 
                            required={selectedPayment === "card"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Options Section */}
                {selectedPayment === "upi" && (
                  <div className="p-6 rounded-xl border mt-6 animate-fade-in" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                    <p className="text-sm font-bold mb-4" style={{ color: "var(--color-stone-800)" }}>Choose a UPI option</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["GPay", "Razorpay", "PhonePe", "Netbanking"].map((method) => {
                        const isSelected = selectedUpi === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setSelectedUpi(method)}
                            className="p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2"
                            style={{ 
                              borderColor: isSelected ? "var(--color-forest-600)" : "var(--color-stone-200)",
                              background: isSelected ? "var(--color-forest-50)" : "white",
                              color: isSelected ? "var(--color-forest-700)" : "var(--color-stone-700)"
                            }}
                          >
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                              style={{ 
                                background: isSelected ? "var(--color-forest-100)" : "var(--color-stone-100)",
                                color: isSelected ? "var(--color-forest-600)" : "var(--color-stone-400)"
                              }}
                            >
                              {method[0]}
                            </div>
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex items-center justify-between">
                  <button type="button" onClick={() => setStep("shipping")} className="text-sm font-medium hover:underline text-stone-500">
                    Return to Shipping
                  </button>
                  <button 
                    type="submit" 
                    form="checkout-form" 
                    disabled={isSubmitting}
                    className="btn-primary py-3 sm:py-4 px-4 sm:px-10 text-sm sm:text-base shadow-lg shadow-forest-600/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Placing Order..." : `Pay ₹${finalTotal} & Place Order`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="rounded-2xl border sticky top-24 overflow-hidden" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="p-4 sm:p-6 border-b bg-stone-50/50" style={{ borderColor: "var(--color-stone-200)" }}>
              <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Order Summary
              </h3>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[45vh] overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center border" style={{ background: "var(--color-cream-100)", borderColor: "var(--color-stone-100)" }}>
                    <Image src={item.image} alt={item.name} width={50} height={50} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate" style={{ color: "var(--color-stone-800)" }}>{item.name}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{item.size} × {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code & Coupon section */}
            <div className="p-4 sm:p-6 border-t space-y-4" style={{ borderColor: "var(--color-stone-200)" }}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-stone-500)" }}>
                  Promo / Coupon Code
                </label>
                
                {appliedCoupon ? (
                  <div 
                    className="flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 animate-fade-in"
                    style={{ 
                      borderColor: "var(--color-forest-300)", 
                      background: "var(--color-forest-50)", 
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-forest-700 bg-forest-100">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-forest-800 tracking-wide uppercase">{appliedCoupon.code}</p>
                        <p className="text-xs text-forest-600 mt-0.5">
                          {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% Discount Applied` : "Free Shipping Applied"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-lg text-forest-600 hover:bg-forest-100 transition-colors"
                      title="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponError) setCouponError("");
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium tracking-wide placeholder-stone-400 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                      style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(couponInput)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all text-white bg-forest-600 hover:bg-forest-700 active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs font-semibold text-forest-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-forest-600" /> {couponSuccess}
                  </p>
                )}
              </div>

              {/* Collapsible Shelf / Available Coupons */}
              <div className="border-t pt-3" style={{ borderColor: "var(--color-stone-100)" }}>
                <details className="group">
                  <summary className="flex items-center justify-between text-xs font-bold uppercase tracking-wider cursor-pointer list-none select-none text-stone-500 hover:text-stone-800 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Tag size={13} /> Available Offers
                    </span>
                    <span className="transition-transform duration-200 group-open:rotate-180">
                      <ChevronDown size={14} />
                    </span>
                  </summary>
                  
                  <div className="mt-3 space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {AVAILABLE_COUPONS.map((coupon) => {
                      const isApplied = appliedCoupon?.code === coupon.code;
                      const isSubtotalTooLow = coupon.minOrderValue ? totalPrice < coupon.minOrderValue : false;
                      
                      return (
                        <div
                          key={coupon.code}
                          className={`p-3 rounded-xl border transition-all duration-300 ${
                            isApplied 
                              ? "bg-forest-50 border-forest-300 shadow-sm" 
                              : isSubtotalTooLow 
                              ? "bg-stone-50 border-stone-200 opacity-60" 
                              : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`inline-block text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                  isApplied 
                                    ? "bg-forest-600 text-white" 
                                    : "bg-stone-100 text-stone-800"
                                }`}>
                                  {coupon.code}
                                </span>
                                {coupon.minOrderValue && (
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                    Min: ₹{coupon.minOrderValue}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-600 font-medium mt-1.5 leading-relaxed font-body">
                                {coupon.description}
                              </p>
                            </div>
                            
                            <div>
                              {isApplied ? (
                                <span className="text-xs font-bold text-forest-700 bg-forest-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                  Applied
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isSubtotalTooLow}
                                  onClick={() => handleApplyCoupon(coupon.code)}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                                    isSubtotalTooLow
                                      ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                      : "bg-stone-900 text-white hover:bg-forest-700 active:scale-95"
                                  }`}
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {isSubtotalTooLow && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-0.5">
                              Add ₹{coupon.minOrderValue! - totalPrice} more to unlock this offer
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t bg-stone-50/50 space-y-4" style={{ borderColor: "var(--color-stone-200)" }}>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-stone-800">₹{totalPrice}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-forest-700 font-medium animate-fade-in">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} /> Discount ({appliedCoupon?.code})
                  </span>
                  <span className="font-bold">-₹{discountAmount}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span className="font-bold text-stone-800">
                  {shippingCost === 0 ? (
                    <span className="text-forest-600 flex items-center gap-1.5 font-semibold">
                      Free {isFreeShipCoupon && <span className="text-[10px] font-bold bg-forest-100 px-1 py-0.2 rounded uppercase">Coupon</span>}
                    </span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              
              <div className="pt-4 mt-2 border-t flex justify-between items-center" style={{ borderColor: "var(--color-stone-200)" }}>
                <span className="text-base font-bold text-stone-900">Total</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
