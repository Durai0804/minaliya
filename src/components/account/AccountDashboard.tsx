"use client";

import { useState, useEffect, useRef } from "react";
import { User, Package, MapPin, LogOut, Settings, CreditCard, ChevronRight, Edit, Trash2, Check, AlertCircle, RefreshCw, Sparkles, Building, Phone, Upload, Eye, ToggleLeft, ToggleRight, ShieldCheck, Mail, Bell } from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/actions/order";

type Tab = "profile" | "orders" | "addresses" | "payment" | "settings" | "edit-profile" | "edit-address" | "add-address" | "add-payment";

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

interface Address {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

// Preset Premium Avatars matching Minaliyaa wood-pressed oil brand aesthetic (warm gold, amber, herbal forest green gradients)
const AVATAR_PRESETS = [
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", // Amber Cold-pressed
  "linear-gradient(135deg, #10b981 0%, #047857 100%)", // Sesame Forest Green
  "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)", // Coconut Sunset Red
  "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)", // Lavender Royal Blue
];

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

  // Payment Form State
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address CRUD Form State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressName, setAddressName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressPhone, setAddressPhone] = useState("");

  // Account Settings Notification State
  const [settingsNewsletter, setSettingsNewsletter] = useState(true);
  const [settingsWhatsappAlerts, setSettingsWhatsappAlerts] = useState(true);

  // Initialize values when user loads or tab changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileMobile(user.mobile || "");
      setProfileEmail(user.email || "");
      setSettingsNewsletter(user.newsletterSubscribed !== false);
    }
  }, [user, activeTab]);

  // Fetch live orders dynamically
  useEffect(() => {
    async function fetchDbOrders() {
      if (!user) {
        setDisplayOrders(localOrders);
        return;
      }
      setIsOrdersLoading(true);
      const res = await getUserOrders(user.email, user.mobile);
      if (res.success && res.orders) {
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

  // Load secondary storage items
  useEffect(() => {
    const stored = localStorage.getItem("minaliya-payment-methods");
    if (stored) {
      try {
        setPaymentMethods(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse payment methods:", e);
      }
    }

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

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateUser({ image: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Preset Avatar Pick handler
  const handlePresetAvatarPick = (presetGradient: string) => {
    updateUser({ image: presetGradient });
  };

  // Address CRUD Handlers
  const handleOpenAddAddress = () => {
    setSelectedAddressId(null);
    setAddressName(user?.name || "");
    setAddressLine1("");
    setAddressLine2("");
    setAddressCity("");
    setAddressState("");
    setAddressZip("");
    setAddressPhone(user?.mobile || "");
    setActiveTab("add-address");
  };

  const handleOpenEditAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setAddressName(addr.name);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || "");
    setAddressCity(addr.city);
    setAddressState(addr.state);
    setAddressZip(addr.zipCode);
    setAddressPhone(addr.phone);
    setActiveTab("edit-address");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAddresses: Address[] = user?.addresses || [];
    
    const newAddress: Address = {
      id: selectedAddressId || `addr-${Date.now()}`,
      name: addressName,
      addressLine1,
      addressLine2: addressLine2 || undefined,
      city: addressCity,
      state: addressState,
      zipCode: addressZip,
      phone: addressPhone,
      isDefault: currentAddresses.length === 0 ? true : false,
    };

    let updatedAddresses: Address[] = [];
    if (selectedAddressId) {
      updatedAddresses = currentAddresses.map((a) => (a.id === selectedAddressId ? { ...newAddress, isDefault: a.isDefault } : a));
    } else {
      updatedAddresses = [...currentAddresses, newAddress];
    }

    updateUser({ addresses: updatedAddresses });
    setActiveTab("addresses");
  };

  const handleDeleteAddress = (id: string) => {
    const currentAddresses: Address[] = user?.addresses || [];
    const filtered = currentAddresses.filter((a) => a.id !== id);
    if (currentAddresses.find((a) => a.id === id)?.isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }
    updateUser({ addresses: filtered });
  };

  const handleSetDefaultAddress = (id: string) => {
    const currentAddresses: Address[] = user?.addresses || [];
    const updated = currentAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateUser({ addresses: updated });
  };

  // Payment Handlers
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

  const handleSaveSettings = () => {
    updateUser({
      newsletterSubscribed: settingsNewsletter,
    });
    alert("Preferences updated successfully!");
  };

  const renderAvatar = (avatarClass: string, nameInitial: string) => {
    const isGradient = user?.image?.startsWith("linear-gradient");
    const hasImage = user?.image && !isGradient;

    if (hasImage && user?.image) {
      return (
        <img
          src={user.image}
          alt={user.name || "User Avatar"}
          className={`${avatarClass} rounded-full object-cover border-4`}
          style={{ borderColor: "white", boxShadow: "var(--shadow-soft)" }}
        />
      );
    }

    return (
      <div
        className={`${avatarClass} rounded-full flex items-center justify-center text-white font-bold border-4`}
        style={{
          background: isGradient && user?.image ? user.image : "var(--color-amber-500)",
          borderColor: "white",
          boxShadow: "var(--shadow-soft)",
          fontSize: avatarClass.includes("w-20") ? "1.75rem" : "1.25rem"
        }}
      >
        {nameInitial}
      </div>
    );
  };

  const renderTabButton = (tab: Tab, icon: React.ReactNode, label: string) => {
    const isActive = activeTab === tab || (tab === "addresses" && activeTab === "edit-address") || (tab === "addresses" && activeTab === "add-address");
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left cursor-pointer ${isActive
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 text-red-600 text-left w-full cursor-pointer"
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
                  {renderAvatar("w-20 h-20", profileName ? profileName.charAt(0).toUpperCase() : "U")}
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
                <button onClick={() => setActiveTab("edit-profile")} className="btn-secondary text-sm py-2 px-4 cursor-pointer">
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
                    {user?.email || "Not Provided"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Addresses Saved
                  </p>
                  <p className="font-medium text-sm" style={{ color: "var(--color-stone-800)" }}>
                    {user?.addresses?.length || 0} Saved
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: "var(--color-stone-400)", fontWeight: "600" }}
                  >
                    Newsletter
                  </p>
                  <p className={`font-medium text-sm ${user?.newsletterSubscribed !== false ? "text-green-600" : "text-stone-450"}`}>
                    {user?.newsletterSubscribed !== false ? "Subscribed" : "Unsubscribed"}
                  </p>
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
                  className="text-sm font-medium flex items-center hover:underline cursor-pointer"
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
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold font-sans" style={{ background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>{order.status}</span>
                          </div>
                          <p className="text-sm text-stone-500">{new Date(order.date).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                          <span className="font-bold text-stone-900">₹{order.totalPrice}</span>
                          <button onClick={() => setActiveTab("orders")} className="btn-secondary py-1.5 px-4 text-sm whitespace-nowrap cursor-pointer">Details</button>
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
                  Default Shipping Address
                </h3>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="text-sm font-medium flex items-center hover:underline cursor-pointer"
                  style={{ color: "var(--color-forest-600)" }}
                >
                  Manage Addresses <ChevronRight size={16} />
                </button>
              </div>

              {(!user?.addresses || user.addresses.length === 0) ? (
                <div className="p-6 rounded-2xl border text-center" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
                  <p className="text-stone-500 text-sm mb-4">No shipping addresses saved yet.</p>
                  <button onClick={handleOpenAddAddress} className="btn-secondary text-sm py-2 px-6 cursor-pointer">
                    Add Address
                  </button>
                </div>
              ) : (
                (() => {
                  const defaultAddr = user.addresses.find((a: any) => a.isDefault) || user.addresses[0];
                  return (
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
                            {defaultAddr.name}
                          </h4>
                          <p className="text-sm leading-relaxed mb-3 font-sans" style={{ color: "var(--color-stone-500)" }}>
                            {defaultAddr.addressLine1}
                            {defaultAddr.addressLine2 && <><br />{defaultAddr.addressLine2}</>}
                            <br />
                            {defaultAddr.city}, {defaultAddr.state} {defaultAddr.zipCode}
                            <br />
                            India
                          </p>
                          <p className="text-sm font-medium" style={{ color: "var(--color-stone-700)" }}>
                            Mobile: +91 {defaultAddr.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenEditAddress(defaultAddr)}
                        className="btn-secondary text-sm py-1.5 px-4 rounded-full w-full sm:w-auto cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  );
                })()
              )}
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
                <div className="space-y-6 font-sans">
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
                              href={`https://wa.me/917824807770?text=Hi%20Minaliya,%20I%20would%20like%20to%20follow%20up%20on%20my%20wholesale%20bulk%20inquiry%20reference%20ID%20${inquiry.id}.`}
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
              <button onClick={handleOpenAddAddress} className="btn-primary text-sm py-2 px-4 cursor-pointer">
                Add New Address
              </button>
            </div>

            {(!user?.addresses || user.addresses.length === 0) ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--color-cream-100)", color: "var(--color-stone-400)" }}
                >
                  <MapPin size={28} />
                </div>
                <p className="text-stone-500 text-sm mb-6">You have no saved addresses. Add your shipping details to checkout faster.</p>
                <button onClick={handleOpenAddAddress} className="btn-secondary text-sm py-2 px-6 cursor-pointer">
                  Add First Address
                </button>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {user.addresses.map((addr: Address) => (
                  <div
                    key={addr.id}
                    className="p-6 rounded-xl border flex flex-col sm:flex-row gap-6 justify-between items-start"
                    style={{
                      background: addr.isDefault ? "var(--color-cream-50)" : "white",
                      borderColor: addr.isDefault ? "var(--color-forest-200)" : "var(--color-stone-200)",
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <MapPin size={20} style={{ color: addr.isDefault ? "var(--color-forest-600)" : "var(--color-stone-400)" }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-stone-800">{addr.name}</h4>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-700">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed mb-3 text-stone-500">
                          {addr.addressLine1}
                          {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                          <br />
                          {addr.city}, {addr.state} {addr.zipCode}
                          <br />
                          India
                        </p>
                        <p className="text-sm font-medium text-stone-700">Mobile: +91 {addr.phone}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto items-end">
                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="btn-secondary text-xs py-1.5 px-3 rounded-full flex-1 sm:flex-none cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-full cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] font-semibold text-forest-600 hover:underline cursor-pointer mt-1"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <button onClick={() => setActiveTab("add-payment")} className="btn-secondary text-sm py-2 px-6 cursor-pointer">
                  Add First Payment Method
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
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
          <section className="p-8 rounded-2xl border font-sans" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <h3 className="text-2xl font-bold mb-1 font-heading text-stone-900">
              Account Settings
            </h3>
            <p className="text-stone-500 text-sm mb-6">Manage your Minaliyaa alert preferences and notification credentials.</p>

            <div className="space-y-6 max-w-lg">
              {/* Premium preferences section */}
              <div className="p-6 rounded-2xl border bg-stone-50/50 space-y-6 border-stone-200/80">
                <h4 className="font-bold text-stone-800 flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
                  <ShieldCheck size={16} className="text-forest-600" /> Notifications & Security
                </h4>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <Mail size={14} className="text-stone-400" /> Email Newsletter
                    </label>
                    <p className="text-xs text-stone-500">Receive weekly wellness tips, cold-pressed oil recipes, and promotional discounts.</p>
                  </div>
                  <button
                    onClick={() => setSettingsNewsletter(!settingsNewsletter)}
                    className="text-forest-600 hover:text-forest-750 transition-colors cursor-pointer"
                  >
                    {settingsNewsletter ? <ToggleRight size={38} /> : <ToggleLeft size={38} className="text-stone-300" />}
                  </button>
                </div>

                <div className="flex items-start justify-between gap-4 pt-4 border-t border-stone-200/60">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <Bell size={14} className="text-stone-400" /> WhatsApp Transactional Alerts
                    </label>
                    <p className="text-xs text-stone-500 font-sans">Receive active tracking status, delivery alerts, and instant OTP verification support on WhatsApp.</p>
                  </div>
                  <button
                    onClick={() => setSettingsWhatsappAlerts(!settingsWhatsappAlerts)}
                    className="text-forest-600 hover:text-forest-750 transition-colors cursor-pointer"
                  >
                    {settingsWhatsappAlerts ? <ToggleRight size={38} /> : <ToggleLeft size={38} className="text-stone-300" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button onClick={handleSaveSettings} className="btn-primary text-sm py-2.5 px-6 cursor-pointer">
                  Save Settings
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Add Address tab */}
        {activeTab === "add-address" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold font-heading text-stone-900">
                Add New Address
              </h3>
              <button onClick={() => setActiveTab("addresses")} className="text-sm font-medium hover:underline text-stone-500 cursor-pointer">Cancel</button>
            </div>

            <form className="space-y-5 max-w-lg font-sans" onSubmit={handleSaveAddress}>
              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Receiver Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Guest User"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Address Line 1</label>
                <input
                  type="text"
                  placeholder="Street address, P.O. box, company name"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, building, floor"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 400001"
                    maxLength={6}
                    value={addressZip}
                    onChange={(e) => setAddressZip(e.target.value.replace(/[^0-9]/gi, ""))}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="10 digit mobile"
                    maxLength={10}
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value.replace(/[^0-9]/gi, ""))}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="btn-primary text-sm py-2.5 px-6 cursor-pointer">Save Address</button>
                <button type="button" onClick={() => setActiveTab("addresses")} className="btn-secondary text-sm py-2.5 px-6 cursor-pointer">Cancel</button>
              </div>
            </form>
          </section>
        )}

        {/* Edit Address tab */}
        {activeTab === "edit-address" && (
          <section className="p-8 rounded-2xl border" style={{ background: "white", borderColor: "var(--color-stone-200)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold font-heading text-stone-900">
                Edit Address
              </h3>
              <button onClick={() => setActiveTab("addresses")} className="text-sm font-medium hover:underline text-stone-500 cursor-pointer">Cancel</button>
            </div>

            <form className="space-y-5 max-w-lg font-sans" onSubmit={handleSaveAddress}>
              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Receiver Full Name</label>
                <input
                  type="text"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Address Line 1</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-stone-700">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                  style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">City</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">State</label>
                  <input
                    type="text"
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">ZIP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressZip}
                    onChange={(e) => setAddressZip(e.target.value.replace(/[^0-9]/gi, ""))}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-stone-700">Contact Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value.replace(/[^0-9]/gi, ""))}
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all font-mono"
                    style={{ background: "var(--color-cream-50)", borderColor: "var(--color-stone-200)" }}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="btn-primary text-sm py-2.5 px-6 cursor-pointer">Save Address</button>
                <button type="button" onClick={() => setActiveTab("addresses")} className="btn-secondary text-sm py-2.5 px-6 cursor-pointer">Cancel</button>
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

            <form className="space-y-5 max-w-lg font-sans" onSubmit={handleSaveProfile}>
              {/* Photo Upload and Presets UI */}
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-semibold text-stone-700">Profile Photo</label>
                <div className="flex flex-wrap items-center gap-6">
                  {renderAvatar("w-20 h-20", profileName ? profileName.charAt(0).toUpperCase() : "U")}
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary text-xs py-2 px-4 cursor-pointer flex items-center gap-2"
                      >
                        <Upload size={14} /> Upload Custom Photo
                      </button>
                      
                      {user?.image && (
                        <button
                          type="button"
                          onClick={() => updateUser({ image: undefined })}
                          className="px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-lg cursor-pointer transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400">Supported formats: JPG, PNG. Max size: 2MB.</p>
                  </div>
                </div>

                {/* Elegant Brand Presets Grid */}
                <div className="pt-4 border-t border-stone-100">
                  <span className="block text-xs font-semibold text-stone-500 mb-2">Or select a signature Minaliyaa avatar:</span>
                  <div className="flex gap-3">
                    {AVATAR_PRESETS.map((gradient, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePresetAvatarPick(gradient)}
                        className="w-10 h-10 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all border-2"
                        style={{
                          background: gradient,
                          borderColor: user?.image === gradient ? "var(--color-forest-500)" : "transparent",
                          boxShadow: user?.image === gradient ? "0 0 0 2px white, 0 0 0 4px var(--color-forest-500)" : "none"
                        }}
                      />
                    ))}
                  </div>
                </div>
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
                <label className="block text-sm font-semibold mb-1 text-stone-750">Email Address</label>
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
                <label className="block text-sm font-semibold mb-1 text-stone-750">Phone Number (10 digits)</label>
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
