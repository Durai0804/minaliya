"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, LogOut, Settings, CreditCard, ChevronRight, Edit, Trash2, Check, AlertCircle, RefreshCw, Sparkles, Building, Phone } from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/actions/order";

type Tab = "profile" | "orders" | "addresses" | "payment" | "settings" | "edit-profile" | "edit-address" | "add-payment";

interface PaymentMethod {
  id: string;
  type: "card" | "upi";
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardType?: "visa" | "mastercard" | "rupay" | "other";
  upiId?: string;
  isDefault: boolean;
}

interface BulkInquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  message?: string;
  date: string;
}

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [ordersSubTab, setOrdersSubTab] = useState<"standard" | "bulk">("standard");
  const { orders: localOrders } = useOrders();
  const { user, logout, updateUser } = useAuth();

  // Dynamic db orders state
  const [displayOrders, setDisplayOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // Saved Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Bulk Inquiries State
  const [bulkInquiries, setBulkInquiries] = useState<BulkInquiry[]>([]);

  // Form State
  const [paymentType, setPaymentType] = useState<"card" | "upi">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [formError, setFormError] = useState("");

  // Profile Edit State
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMobile, setProfileMobile] = useState("");

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileMobile(user.mobile || "");
      setProfileEmail(user.email || "");
    }
  }, [user, activeTab]);

  // Fetch dynamically live orders from Neon and combine with local storage ones
  useEffect(() => {
    async function fetchDbOrders() {
      if (!user) {
        setDisplayOrders(localOrders);
        return;
      }
      setIsOrdersLoading(true);
      const res = await getUserOrders(user.email, user.mobile);
      if (res.success && res.orders) {
        // Combine DB orders & local storage orders, de-duplicating by order ID
        const combined = [...res.orders];
        const dbOrderIds = new Set(res.orders.map((o) => o.id));
        for (const localOrder of localOrders) {
          if (!dbOrderIds.has(localOrder.id)) {
            combined.push(localOrder);
          }
        }
        setDisplayOrders(combined);
      } else {
        setDisplayOrders(localOrders);
      }
      setIsOrdersLoading(false);
    }
    fetchDbOrders();
  }, [user, localOrders, activeTab]);

  useEffect(() => {
    const stored = localStorage.getItem("minaliya-payment-methods");
    if (stored) {
      try {
        setPaymentMethods(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse payment methods:", e);
      }
    }

    // Load bulk inquiries from local storage
    const storedInquiries = localStorage.getItem("minaliya-bulk-inquiries");
    if (storedInquiries) {
      try {
        setBulkInquiries(JSON.parse(storedInquiries));
      } catch (e) {
        console.error("Failed to parse bulk inquiries:", e);
      }
    }

    setIsLoaded(true);
  }, [activeTab]);

  const savePaymentMethods = (methods: PaymentMethod[]) => {
    setPaymentMethods(methods);
    localStorage.setItem("minaliya-payment-methods", JSON.stringify(methods));
  };

  const handleCardNumberChange = (value: string) => {
    const clean = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = clean.match(/.{1,4}/g)?.join(" ") || clean;
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (value: string) => {
    const clean = value.replace(/[^0-9]/gi, "");
    if (clean.length >= 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const detectCardType = (num: string): "visa" | "mastercard" | "rupay" | "other" => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(clean)) return "mastercard";
    if (/^6(0|5|8)/.test(clean)) return "rupay";
    return "other";
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (paymentType === "card") {
      const cleanCardNum = cardNumber.replace(/\s+/g, "");
      if (cleanCardNum.length < 16) {
        setFormError("Card number must be 16 digits.");
        return;
      }
      if (!cardName.trim()) {
        setFormError("Please enter the cardholder name.");
        return;
      }
      if (cardExpiry.length < 5) {
        setFormError("Please enter expiration date in MM/YY format.");
        return;
      }
      if (cardCvv.length < 3) {
        setFormError("Please enter a valid CVV.");
        return;
      }

      const newMethod: PaymentMethod = {
        id: `card-${Date.now()}`,
        type: "card",
        cardName: cardName.trim(),
        cardNumber: cleanCardNum.slice(-4),
        cardExpiry: cardExpiry,
        cardType: detectCardType(cleanCardNum),
        isDefault: paymentMethods.length === 0,
      };

      const updated = [...paymentMethods, newMethod];
      savePaymentMethods(updated);
    } else {
      if (!upiId.trim() || !upiId.includes("@")) {
        setFormError("Please enter a valid UPI ID (e.g. mobile@upi).");
        return;
      }

      const newMethod: PaymentMethod = {
        id: `upi-${Date.now()}`,
        type: "upi",
        upiId: upiId.trim(),
        isDefault: paymentMethods.length === 0,
      };

      const updated = [...paymentMethods, newMethod];
      savePaymentMethods(updated);
    }

    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
    setActiveTab("payment");
  };

  const handleDeletePayment = (id: string) => {
    const filtered = paymentMethods.filter((m) => m.id !== id);
    if (paymentMethods.find((m) => m.id === id)?.isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }
    savePaymentMethods(filtered);
  };

  const handleSetDefaultPayment = (id: string) => {
    const updated = paymentMethods.map((m) => ({
      ...m,
      isDefault: m.id === id,
    }));
    savePaymentMethods(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: profileName,
      mobile: profileMobile,
      email: profileEmail,
    });
    setActiveTab("profile");
  };

  const renderTabButton = (tab: Tab, icon: React.ReactNode, label: string) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${isActive
            ? "bg-[var(--color-forest-50)] text-[var(--color-forest-700)]"
            : "hover:bg-stone-50 text-[var(--color-stone-700)]"
          }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1">
        <nav
          className="flex flex-col gap-2 p-6 rounded-2xl border"
          style={{ background: "white", borderColor: "var(--color-stone-200)" }}
        >
          {renderTabButton("profile", <User size={18} />, "Profile Details")}
          {renderTabButton("orders", <Package size={18} />, "Order History")}
          {renderTabButton("addresses", <MapPin size={18} />, "Saved Addresses")}
          {renderTabButton("payment", <CreditCard size={18} />, "Payment Methods")}
          {renderTabButton("settings", <Settings size={18} />, "Account Settings")}
          <div className="h-px w-full my-2" style={{ background: "var(--color-stone-200)" }}></div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 text-red-600 text-left w-full"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-8">
        {activeTab === "profile" && (
          <>
            <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                    style={{
                      background: "var(--color-amber-100)",
                      color: "var(--color-amber-700)",
                      borderColor: "white",
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    U
                  </div>
                  <div>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
                    >
                      {user?.name || "Guest User"}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("edit-profile")} className="btn-secondary text-sm py-2 px-4">
                  Edit Profile
                </button>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t"
                style={{ borderColor: "var(--color-stone-200)" }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Phone Number
                  </p>
                  <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>
                    {user?.mobile ? `+91 ${user.mobile}` : "+91 98765 43210"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Email Address
                  </p>
                  <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Member Since
                  </p>
                  <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>
                    May 2026
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Newsletter
                  </p>
                  <p className="font-medium text-sm text-green-600">Subscribed</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
                >
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-sm font-medium flex items-center hover:underline"
                  style={{ color: "var(--color-forest-600)" }}
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ background: "white", borderColor: "var(--color-stone-200)" }}
              >
                {isOrdersLoading ? (
                  <div className="p-8 text-center">
                    <RefreshCw size={28} className="animate-spin text-forest-600 mx-auto mb-2" />
                    <p className="text-sm text-stone-500">Loading your live orders...</p>
                  </div>
                ) : displayOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                    >
                      <Package size={28} />
                    </div>
                    <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>
                      No orders yet
                    </h4>
                    <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                      When you place orders, they will appear here. Start shopping our premium oils today.
                    </p>
                    <Link href="/shop" className="btn-primary text-sm py-2.5">
                      Explore Shop
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--color-stone-200)" }}>
                    {displayOrders.slice(0, 3).map((order: any) => (
                      <div key={order.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-stone-900">{order.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>{order.status}</span>
                          </div>
                          <p className="text-sm text-stone-500">{new Date(order.date).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                          <span className="font-bold text-stone-900">₹{order.totalPrice}</span>
                          <button onClick={() => setActiveTab("orders")} className="btn-secondary py-1.5 px-4 text-sm whitespace-nowrap">Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
                >
                  Default Address
                </h3>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="text-sm font-medium flex items-center hover:underline"
                  style={{ color: "var(--color-forest-600)" }}
                >
                  Manage Addresses <ChevronRight size={16} />
                </button>
              </div>

              <div
                className="p-6 rounded-2xl border flex flex-col sm:flex-row gap-6 justify-between items-start"
                style={{ background: "white", borderColor: "var(--color-stone-200)" }}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} style={{ color: "var(--color-stone-400)" }} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: "var(--color-stone-800)" }}>
                      Guest User
                    </h4>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-stone-500)" }}>
                      123 Artisanal Way, Suite 4B<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-stone-700)" }}>
                      Mobile: +91 98765 43210
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="btn-secondary text-sm py-1.5 px-4 rounded-full w-full sm:w-auto"
                >
                  Edit
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "orders" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold font-heading text-stone-900">
                Order History
              </h3>
            </div>

            {/* Segmented Controls */}
            <div className="flex border-b border-stone-200 mb-6 font-sans">
              <button
                onClick={() => setOrdersSubTab("standard")}
                className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${ordersSubTab === "standard"
                    ? "border-forest-600 text-forest-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                  }`}
              >
                Standard Orders
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600">
                  {displayOrders.length}
                </span>
              </button>
              <button
                onClick={() => setOrdersSubTab("bulk")}
                className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${ordersSubTab === "bulk"
                    ? "border-forest-600 text-forest-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                  }`}
              >
                Wholesale Inquiries
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${bulkInquiries.length > 0 ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-600"
                  }`}>
                  {bulkInquiries.length}
                </span>
              </button>
            </div>

            {isOrdersLoading ? (
              <div className="text-center py-12">
                <RefreshCw size={28} className="animate-spin text-forest-600 mx-auto mb-2" />
                <p className="text-sm text-stone-500">Loading your live orders...</p>
              </div>
            ) : ordersSubTab === "standard" ? (
              displayOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                  >
                    <Package size={28} />
                  </div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>
                    No orders yet
                  </h4>
                  <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                    You haven't placed any orders. Discover our cold-pressed oils.
                  </p>
                  <Link href="/shop" className="btn-primary text-sm py-2.5">
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayOrders.map((order: any) => (
                    <div key={order.id} className="rounded-xl border overflow-hidden" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}>
                      <div className="p-5 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
                        <div className="flex gap-8">
                          <div>
                            <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-bold">Order Placed</p>
                            <p className="text-sm font-medium text-stone-900">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-bold">Total Amount</p>
                            <p className="text-sm font-medium text-stone-900">₹{order.totalPrice}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <p className="text-sm text-stone-500 mb-0.5">Order # <span className="font-medium text-stone-900">{order.id}</span></p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>{order.status}</span>
                        </div>
                      </div>
                      <div className="p-5 space-y-4">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-20 h-20 rounded-lg bg-white border flex items-center justify-center shrink-0 p-2" style={{ borderColor: "var(--color-stone-200)" }}>
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <p className="font-bold text-stone-900 text-sm">{item.name}</p>
                              <p className="text-xs text-stone-500 mt-1">Size: {item.size}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs font-medium text-stone-600">Qty: {item.quantity}</p>
                                <p className="font-bold text-stone-900 text-sm">₹{item.price * item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              bulkInquiries.length === 0 ? (
                <div className="text-center py-12 font-sans">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                  >
                    <Sparkles size={28} className="text-stone-500" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-stone-850">
                    No bulk inquiries yet
                  </h4>
                  <p className="text-sm mb-6 max-w-sm mx-auto text-stone-500">
                    Need high-volume wood pressed oil for your business? Submit a wholesale inquiry on the shop page!
                  </p>
                  <Link href="/shop" className="btn-primary text-sm py-2.5">
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bulkInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-soft"
                      style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    >
                      <div className="p-5 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4" style={{ borderColor: "var(--color-stone-200)", background: "white" }}>
                        <div className="flex gap-8">
                          <div>
                            <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-bold">Inquiry Sent</p>
                            <p className="text-sm font-medium text-stone-900">{new Date(inquiry.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-stone-500 mb-0.5 uppercase tracking-wider font-bold">Est. Volume</p>
                            <p className="text-sm font-bold text-forest-700">{inquiry.quantity} Litres</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <p className="text-sm text-stone-500 mb-0.5 font-sans">Ref # <span className="font-mono font-bold text-stone-900">{inquiry.id}</span></p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>
                            Under B2B Review
                          </span>
                        </div>
                      </div>
                      <div className="p-6 space-y-4 font-sans">
                        <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                          <div className="space-y-1">
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Product of Interest</p>
                            <h4 className="font-bold text-stone-900 text-base">{inquiry.product}</h4>
                            {inquiry.company && (
                              <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-1 font-medium">
                                <Building size={12} className="text-stone-400" /> {inquiry.company}
                              </p>
                            )}
                          </div>
                          <div className="w-full sm:w-auto">
                            <a
                              href={`https://wa.me/919876543210?text=Hi%20Minaliya,%20I%20would%20like%20to%20follow%20up%20on%20my%20wholesale%20bulk%20inquiry%20reference%20ID%20${inquiry.id}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary py-2 px-5 text-xs font-semibold rounded-full bg-green-600 hover:bg-green-700 text-white border-transparent flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                            >
                              <Phone size={12} /> Chat with Manager
                            </a>
                          </div>
                        </div>
                        {inquiry.message && (
                          <div className="p-4 rounded-lg bg-white border border-stone-100 text-sm text-stone-600 italic">
                            &ldquo;{inquiry.message}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </section>
        )}

        {activeTab === "addresses" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Saved Addresses
              </h3>
              <button className="btn-primary text-sm py-2 px-4">Add New Address</button>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl border flex flex-col sm:flex-row gap-6 justify-between items-start" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-forest-200)" }}>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} style={{ color: "var(--color-forest-600)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold" style={{ color: "var(--color-stone-800)" }}>Guest User</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-700" style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)" }}>Default</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-stone-500)" }}>
                      123 Artisanal Way, Suite 4B<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--color-stone-700)" }}>Mobile: +91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab("edit-address")}
                    className="btn-secondary text-sm py-1.5 px-4 rounded-full flex-1 sm:flex-none"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "payment" && (
          <section className="p-8 rounded-2xl border animate-fade-in-up" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Payment Methods
              </h3>
              <button onClick={() => setActiveTab("add-payment")} className="btn-primary text-sm py-2 px-4 flex items-center gap-2 cursor-pointer">
                Add Payment Method
              </button>
            </div>

            {!isLoaded ? (
              <div className="text-center py-12">
                <RefreshCw size={28} className="animate-spin text-stone-400 mx-auto" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                >
                  <CreditCard size={28} />
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: "var(--color-stone-800)" }}>
                  No saved payment methods
                </h4>
                <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--color-stone-500)" }}>
                  Save your credit/debit cards or UPI IDs for faster checkout next time.
                </p>
                <button onClick={() => setActiveTab("add-payment")} className="btn-secondary text-sm py-2 px-6">
                  Add First Payment Method
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-6 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all shadow-soft"
                    style={{
                      background: method.isDefault
                        ? "linear-gradient(135deg, var(--color-forest-50) 0%, white 100%)"
                        : "white",
                      borderColor: method.isDefault
                        ? "var(--color-forest-300)"
                        : "var(--color-stone-200)",
                    }}
                  >
                    <div>
                      {/* Badge / Brand header */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: method.type === "card" ? "var(--color-cream-100)" : "var(--color-amber-100)",
                            color: method.type === "card" ? "var(--color-stone-700)" : "var(--color-amber-700)",
                          }}
                        >
                          {method.type === "card" ? `${method.cardType} card` : "UPI ID"}
                        </span>

                        {method.isDefault && (
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                            style={{
                              background: "var(--color-forest-100)",
                              color: "var(--color-forest-700)",
                            }}
                          >
                            <Check size={10} /> Default
                          </span>
                        )}
                      </div>

                      {/* Payment Method Details */}
                      {method.type === "card" ? (
                        <div className="mb-4">
                          <p className="font-heading text-lg font-semibold tracking-widest text-stone-800 mb-1">
                            •••• •••• •••• {method.cardNumber}
                          </p>
                          <p className="text-xs text-stone-500 font-medium">
                            Expires {method.cardExpiry}
                          </p>
                          <p className="text-sm font-semibold text-stone-700 mt-2 text-capitalize">
                            {method.cardName}
                          </p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <p className="text-base font-semibold text-stone-800 tracking-wide mb-1">
                            {method.upiId}
                          </p>
                          <p className="text-xs text-stone-500 font-medium">
                            Instant UPI Payment Method
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-2">
                      {!method.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultPayment(method.id)}
                          className="text-xs font-semibold hover:underline text-stone-500 hover:text-stone-700 cursor-pointer"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-xs text-stone-400 font-medium">Active Default</span>
                      )}

                      <button
                        onClick={() => handleDeletePayment(method.id)}
                        className="text-xs font-semibold flex items-center gap-1 text-red-500 hover:text-red-700 cursor-pointer hover:underline"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "add-payment" && (
          <section className="p-8 rounded-2xl border animate-fade-in-up" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Add Payment Method
              </h3>
              <button
                onClick={() => { setActiveTab("payment"); setFormError(""); }}
                className="text-sm font-medium hover:underline text-stone-500 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {formError && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-6 max-w-lg">
              {/* Tabs selector */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-stone-700">Payment Type</label>
                <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-stone-50 border border-stone-200/60">
                  <button
                    type="button"
                    onClick={() => { setPaymentType("card"); setFormError(""); }}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${paymentType === "card"
                        ? "bg-white shadow-soft text-forest-700 border border-stone-200/30"
                        : "text-stone-500 hover:text-stone-700"
                      }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentType("upi"); setFormError(""); }}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${paymentType === "upi"
                        ? "bg-white shadow-soft text-forest-700 border border-stone-200/30"
                        : "text-stone-500 hover:text-stone-700"
                      }`}
                  >
                    UPI ID
                  </button>
                </div>
              </div>

              {paymentType === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-stone-700">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Guest User"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                      style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-stone-700">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                      style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-stone-700">Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                        style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-stone-700">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/gi, ""))}
                        className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                        style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-stone-700">UPI ID</label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                      style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                      required
                    />
                    <p className="text-[11px] text-stone-400 mt-1 font-medium">
                      Supports BHIM, Google Pay, PhonePe, Paytm, and other standard UPI services.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button type="submit" className="btn-primary text-sm py-2.5 px-6 cursor-pointer">
                  Save Payment Method
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("payment"); setFormError(""); }}
                  className="btn-secondary text-sm py-2.5 px-6 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
              Account Settings
            </h3>
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-stone-700)" }}>Email Preferences</label>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="newsletter" defaultChecked className="w-4 h-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500" />
                  <label htmlFor="newsletter" className="text-sm" style={{ color: "var(--color-stone-600)" }}>Subscribe to newsletter for offers and updates</label>
                </div>
              </div>
              <div className="pt-4 border-t" style={{ borderColor: "var(--color-stone-200)" }}>
                <h4 className="font-bold mb-4" style={{ color: "var(--color-stone-800)" }}>Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
                  </div>
                  <button className="btn-primary text-sm py-2.5 px-6">Update Password</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "edit-address" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Edit Address
              </h3>
              <button onClick={() => setActiveTab("addresses")} className="text-sm font-medium hover:underline" style={{ color: "var(--color-stone-500)" }}>Cancel</button>
            </div>

            <form className="space-y-5 max-w-lg" onSubmit={(e) => { e.preventDefault(); setActiveTab("addresses"); }}>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Full Name</label>
                <input type="text" defaultValue="Guest User" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Address Line 1</label>
                <input type="text" defaultValue="123 Artisanal Way, Suite 4B" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Address Line 2 (Optional)</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>City</label>
                  <input type="text" defaultValue="Mumbai" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>State</label>
                  <input type="text" defaultValue="Maharashtra" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>ZIP Code</label>
                  <input type="text" defaultValue="400001" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-stone-700)" }}>Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }} required />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="btn-primary text-sm py-2.5 px-6">Save Address</button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "edit-profile" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}>
                Edit Profile
              </h3>
              <button onClick={() => setActiveTab("profile")} className="text-sm font-medium hover:underline text-stone-500 cursor-pointer">Cancel</button>
            </div>

            <form className="space-y-5 max-w-lg" onSubmit={handleSaveProfile}>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)", borderColor: "white", boxShadow: "var(--shadow-soft)" }}>
                  {profileName ? profileName.charAt(0).toUpperCase() : "U"}
                </div>
                <button type="button" className="btn-secondary text-sm py-2 px-4 cursor-pointer">Change Photo</button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Phone Number (10 digits)</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={profileMobile}
                  onChange={(e) => setProfileMobile(e.target.value.replace(/[^0-9]/gi, "").slice(0, 10))}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="btn-primary text-sm py-2.5 px-6 cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
