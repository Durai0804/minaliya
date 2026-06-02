import {
  Droplets,
  Heart,
  Sparkles,
  Shield,
  Cookie,
} from "lucide-react";

const benefits = [
  {
    icon: <Droplets size={32} />,
    title: "Rich Natural Aroma",
    desc: "Experience the true fragrance of pure oil — unmasked by deodorizers or artificial scents.",
    stat: "100%",
    statLabel: "Natural Fragrance",
  },
  {
    icon: <Heart size={32} />,
    title: "Better Nutrition",
    desc: "Packed with Vitamin E, Omega-3 fatty acids, and natural antioxidants for complete well-being.",
    stat: "3x",
    statLabel: "More Nutrients",
  },
  {
    icon: <Shield size={32} />,
    title: "Healthy Fats",
    desc: "Rich in monounsaturated & polyunsaturated fats — the good fats your body needs daily.",
    stat: "Zero",
    statLabel: "Trans Fats",
  },
  {
    icon: <Sparkles size={32} />,
    title: "No Chemicals",
    desc: "Free from hexane, bleaching agents, and preservatives. Pure oil, nothing else.",
    stat: "0%",
    statLabel: "Chemical Content",
  },
  {
    icon: <Cookie size={32} />,
    title: "Authentic Taste",
    desc: "The true taste of oil that enhances every dish — from sambar to sweets, the way it should be.",
    stat: "100%",
    statLabel: "Pure Taste",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="section-padding relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-forest-700) 0%, var(--color-forest-800) 100%)",
      }}
    >
      {/* Decorative bg elements */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
        style={{ background: "radial-gradient(circle, var(--color-amber-400), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full opacity-5 -translate-x-1/3 translate-y-1/3"
        style={{ background: "radial-gradient(circle, var(--color-forest-300), transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div
            className="w-12 h-1 rounded-full mx-auto"
            style={{
              background:
                "linear-gradient(90deg, var(--color-amber-400), var(--color-amber-300))",
            }}
          />
          <h2
            className="section-title"
            style={{ color: "var(--color-cream-100)" }}
          >
            Benefits of Minaliya Oils
          </h2>
          <p
            className="section-subtitle mx-auto"
            style={{ color: "var(--color-forest-200)" }}
          >
            Every bottle is a promise of purity, taste, and nutrition — crafted
            the traditional way.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory hide-scrollbar">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] shrink-0 w-[260px] sm:w-auto snap-center"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "var(--color-amber-300)",
                }}
              >
                {item.icon}
              </div>
              <div
                className="text-2xl font-bold mb-0.5"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-amber-400)",
                }}
              >
                {item.stat}
              </div>
              <div
                className="text-[10px] uppercase tracking-wider font-medium mb-3"
                style={{ color: "var(--color-forest-200)" }}
              >
                {item.statLabel}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-cream-100)",
                }}
              >
                {item.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-forest-200)" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
