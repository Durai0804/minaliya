"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ArrowRight,
  Package,
  CalendarCheck,
  Truck,
  ShieldCheck,
  Leaf,
  RefreshCw,
  BadgePercent,
  Heart,
  Clock,
  Check,
  Star,
  Zap,
  Phone,
  Loader2,
} from "lucide-react";

const plans = [
  {
    name: "Monthly",
    slug: "subscription-monthly",
    price: 299,
    period: "/month",
    description: "Perfect for trying out our subscription service",
    highlight: false,
    badge: null,
    features: [
      "1 Ltr oil of your choice",
      "Free delivery on every order",
      "Change oil type anytime",
      "Cancel anytime — no lock-in",
      "Priority customer support",
    ],
    cta: "Start Monthly",
    color: "forest",
  },
  {
    name: "Quarterly",
    slug: "subscription-quarterly",
    price: 799,
    period: "/quarter",
    description: "Our most popular plan — best value for families",
    highlight: true,
    badge: "Most Popular",
    savings: "Save 11%",
    features: [
      "3 × 1 Ltr oils (mix & match)",
      "Free delivery on every order",
      "Change oil types each quarter",
      "Cancel or pause anytime",
      "Priority customer support",
      "Exclusive recipe ebook",
    ],
    cta: "Start Quarterly",
    color: "amber",
  },
  {
    name: "Annual",
    slug: "subscription-annual",
    price: 2999,
    period: "/year",
    description: "Maximum savings for committed families",
    highlight: false,
    badge: "Best Value",
    savings: "Save 17%",
    features: [
      "Monthly delivery — 12 Ltrs/year",
      "Free delivery on every order",
      "Swap oils each month",
      "Cancel or pause anytime",
      "VIP customer support",
      "Exclusive recipe ebook",
      "Early access to new products",
    ],
    cta: "Start Annual",
    color: "forest",
  },
];

const steps = [
  {
    icon: <Package size={32} />,
    step: "01",
    title: "Choose Your Oil",
    desc: "Pick from our premium range — Groundnut, Coconut, or Sesame cold pressed oils.",
  },
  {
    icon: <CalendarCheck size={32} />,
    step: "02",
    title: "Pick a Plan",
    desc: "Select Monthly, Quarterly, or Annual delivery based on your family's needs.",
  },
  {
    icon: <Truck size={32} />,
    step: "03",
    title: "We Deliver Fresh",
    desc: "Freshly pressed oil delivered to your doorstep — on time, every time.",
  },
];

const benefits = [
  {
    icon: <Truck size={28} />,
    title: "Free Delivery",
    desc: "Every subscription order ships free across India. No minimum order, no hidden charges.",
  },
  {
    icon: <Leaf size={28} />,
    title: "Guaranteed Freshness",
    desc: "Your oil is freshly pressed just before dispatch. Every bottle is dated for transparency.",
  },
  {
    icon: <RefreshCw size={28} />,
    title: "Flexible Plans",
    desc: "Pause, skip, or cancel anytime. Change your oil preference before each delivery.",
  },
  {
    icon: <BadgePercent size={28} />,
    title: "Exclusive Savings",
    desc: "Subscribers save up to 17% compared to one-time purchases. The longer you stay, the more you save.",
  },
  {
    icon: <Heart size={28} />,
    title: "Priority Support",
    desc: "Dedicated WhatsApp support for subscribers. Get your queries resolved in minutes, not hours.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Quality Promise",
    desc: "100% pure, FSSAI certified, lab-tested oils. If you're not happy, we refund — no questions asked.",
  },
];

const faqs = [
  {
    q: "Can I change my oil type between deliveries?",
    a: "Absolutely! You can change your oil preference before each delivery cycle. Simply let us know via WhatsApp or your account dashboard, and we'll update your next shipment.",
  },
  {
    q: "How do I pause or cancel my subscription?",
    a: "You can pause or cancel your subscription at any time — no penalties, no questions asked. Just reach out to us via WhatsApp or email at least 3 days before your next delivery date.",
  },
  {
    q: "When will my oil be delivered?",
    a: "Monthly subscribers receive their oil on the same date each month. Quarterly subscribers get all 3 bottles together at the start of each quarter. We'll send tracking details via WhatsApp.",
  },
  {
    q: "Is the oil freshly pressed for each delivery?",
    a: "Yes! We press your oil fresh within 48 hours of your delivery date. Every bottle comes with a pressing date so you can verify the freshness yourself.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, all major credit/debit cards, and net banking. For subscriptions, we'll send a payment link before each delivery cycle.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we deliver to all major cities and towns across India. Delivery is free for all subscription orders. Standard delivery takes 3-5 business days.",
  },
];

export default function SubscriptionClient() {
  const { addItem, clearCart } = useCart();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setLoadingPlan(plan.slug);
    
    // Clear regular cart first so checkout is purely for this subscription
    clearCart();

    // Map plan to a CartItem object
    const subItem = {
      slug: plan.slug,
      name: `Minaliya Oil Subscription - ${plan.name}`,
      image: "/logo.png", // fallback premium branding logo
      price: plan.price,
      size: plan.name === "Monthly" ? "1 Ltr / Month" : plan.name === "Quarterly" ? "3 Ltrs / Quarter" : "12 Ltrs / Year",
    };

    // Wait a brief tick for react state to clear smoothly, then add and route
    setTimeout(() => {
      addItem(subItem, 1);
      router.push("/checkout");
    }, 400);
  };

  return (
    <>
      {/* ─── Hero ─── */}
      <section
        className="relative overflow-hidden py-24 sm:py-32"
        style={{
          background:
            "linear-gradient(135deg, var(--color-forest-700) 0%, var(--color-forest-800) 40%, var(--color-stone-900) 100%)",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-10 right-10 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "var(--color-amber-400)",
            filter: "blur(100px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "var(--color-forest-300)",
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mb-8"
            style={{
              background: "rgba(255, 196, 107, 0.15)",
              color: "var(--color-amber-300)",
              border: "1px solid rgba(255, 196, 107, 0.25)",
            }}
          >
            <Zap size={14} />
            SUBSCRIBE &amp; SAVE UP TO 17%
          </div>

          <div className="divider-leaf mx-auto mb-6" />

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
            style={{
              fontFamily: "var(--font-display)",
              color: "white",
            }}
          >
            Never Run Out of{" "}
            <span
              className="italic font-normal"
              style={{ color: "var(--color-amber-300)" }}
            >
              Pure Oil
            </span>
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ color: "var(--color-forest-200)" }}
          >
            Get freshly pressed, 100% pure cold pressed oils delivered to your
            doorstep every month. Choose a plan that fits your family&apos;s needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#plans" className="btn-accent text-base px-8 py-4">
              View Plans
              <ArrowRight size={18} />
            </a>
            <a
              href="#how-it-works"
              className="btn-secondary text-base px-8 py-4"
              style={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              How It Works
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {[
              { icon: <Star size={14} />, text: "4.9 ★ Rating" },
              { icon: <ShieldCheck size={14} />, text: "FSSAI Certified" },
              { icon: <Truck size={14} />, text: "Free Delivery" },
              { icon: <Clock size={14} />, text: "Cancel Anytime" },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "var(--color-forest-200)" }}
              >
                {badge.icon}
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section
        id="how-it-works"
        className="section-padding"
        style={{ background: "var(--color-cream-50)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="divider-leaf mx-auto" />
            <h2 className="section-title">
              How It <span className="italic font-normal">Works</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Getting fresh cold pressed oil delivered is as easy as 1-2-3.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px]"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--color-forest-300), var(--color-amber-300))",
                      opacity: 0.3,
                    }}
                    aria-hidden="true"
                  />
                )}

                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg relative z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-forest-50) 0%, var(--color-cream-100) 100%)",
                    color: "var(--color-forest-600)",
                    border: "1px solid var(--color-forest-100)",
                  }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block"
                  style={{ color: "var(--color-amber-500)" }}
                >
                  Step {step.step}
                </span>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-xs mx-auto"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Plans ─── */}
      <section
        id="plans"
        className="section-padding"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="divider-leaf mx-auto" />
            <h2 className="section-title">
              Choose Your <span className="italic font-normal">Plan</span>
            </h2>
            <p className="section-subtitle mx-auto">
              All plans include free delivery, freshly pressed oils, and the
              freedom to cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl group"
                style={{
                  background: plan.highlight
                    ? "linear-gradient(135deg, var(--color-forest-700) 0%, var(--color-forest-800) 100%)"
                    : "white",
                  border: plan.highlight
                    ? "2px solid var(--color-amber-400)"
                    : "1px solid var(--color-stone-200)",
                  transform: plan.highlight ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold rounded-bl-xl"
                    style={{
                      background: plan.highlight
                        ? "var(--color-amber-400)"
                        : "var(--color-forest-100)",
                      color: plan.highlight
                        ? "var(--color-forest-800)"
                        : "var(--color-forest-700)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-6 sm:p-10">
                  {/* Plan name */}
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: plan.highlight
                        ? "var(--color-amber-300)"
                        : "var(--color-stone-800)",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{
                      color: plan.highlight
                        ? "var(--color-forest-200)"
                        : "var(--color-stone-500)",
                    }}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        color: plan.highlight
                          ? "white"
                          : "var(--color-stone-800)",
                      }}
                    >
                      ₹{plan.price}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: plan.highlight
                          ? "var(--color-forest-300)"
                          : "var(--color-stone-400)",
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {/* Savings badge */}
                  {plan.savings && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6"
                      style={{
                        background: plan.highlight
                          ? "rgba(255, 196, 107, 0.15)"
                          : "var(--color-forest-50)",
                        color: plan.highlight
                          ? "var(--color-amber-300)"
                          : "var(--color-forest-600)",
                      }}
                    >
                      {plan.savings}
                    </span>
                  )}

                  {/* Divider */}
                  <div
                    className="w-full h-px my-6"
                    style={{
                      background: plan.highlight
                        ? "rgba(255, 255, 255, 0.1)"
                        : "var(--color-stone-200)",
                    }}
                  />

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check
                          size={16}
                          className="shrink-0 mt-0.5"
                          style={{
                            color: plan.highlight
                              ? "var(--color-amber-400)"
                              : "var(--color-forest-500)",
                          }}
                        />
                        <span
                          style={{
                            color: plan.highlight
                              ? "var(--color-forest-100)"
                              : "var(--color-stone-600)",
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    disabled={loadingPlan !== null}
                    onClick={() => handleSubscribe(plan)}
                    className="w-full py-3 sm:py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    style={{
                      background: plan.highlight
                        ? "var(--color-amber-400)"
                        : "var(--color-forest-600)",
                      color: plan.highlight
                        ? "var(--color-forest-900)"
                        : "white",
                    }}
                  >
                    {loadingPlan === plan.slug ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Proceeding...
                      </>
                    ) : (
                      <>
                        {plan.cta} <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee note */}
          <p
            className="text-center text-sm mt-10"
            style={{ color: "var(--color-stone-400)" }}
          >
            <ShieldCheck
              size={14}
              className="inline-block mr-1 -mt-0.5"
            />
            All plans come with our 100% satisfaction guarantee. Not happy?
            Full refund, no questions asked.
          </p>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section
        className="section-padding"
        style={{ background: "var(--color-cream-50)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="divider-leaf mx-auto" />
            <h2 className="section-title">
              Why <span className="italic font-normal">Subscribe?</span>
            </h2>
            <p className="section-subtitle mx-auto">
              More than just oil delivery — it&apos;s a commitment to your
              family&apos;s health and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl transition-all duration-300 hover:shadow-md group"
                style={{
                  background: "white",
                  border: "1px solid var(--color-stone-200)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      i % 2 === 0
                        ? "var(--color-forest-50)"
                        : "var(--color-amber-50)",
                    color:
                      i % 2 === 0
                        ? "var(--color-forest-500)"
                        : "var(--color-amber-600)",
                  }}
                >
                  {b.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section
        className="section-padding"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <div className="divider-leaf mx-auto" />
            <h2 className="section-title">
              Frequently Asked <span className="italic font-normal">Questions</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Everything you need to know about our subscription service.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: "var(--color-cream-50)",
                  border: "1px solid var(--color-stone-200)",
                }}
              >
                <summary
                  className="flex items-center justify-between px-6 py-5 cursor-pointer text-left font-semibold text-sm sm:text-base select-none transition-colors hover:bg-stone-50"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  {faq.q}
                  <span
                    className="ml-4 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-transform duration-300 group-open:rotate-45"
                    style={{
                      background: "var(--color-forest-50)",
                      color: "var(--color-forest-600)",
                    }}
                  >
                    +
                  </span>
                </summary>
                <div
                  className="px-6 pb-5 text-sm leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-amber-500) 0%, var(--color-terra-400) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center relative z-10">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Make the Switch?
          </h2>
          <p className="text-base sm:text-lg text-white/85 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of families enjoying pure, fresh cold pressed oils
            delivered monthly. Start your subscription today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/917824807770?text=Hi%20Minaliya!%20I%27d%20like%20to%20subscribe%20for%20monthly%20oil%20delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              style={{
                background: "white",
                color: "var(--color-amber-600)",
              }}
            >
              <Phone size={18} />
              Subscribe via WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:bg-white/10"
              style={{
                color: "white",
                border: "1.5px solid rgba(255, 255, 255, 0.4)",
              }}
            >
              Browse Our Oils
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
