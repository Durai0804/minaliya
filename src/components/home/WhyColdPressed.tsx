import { ArrowRight, Droplets, FlaskConical, Flame, Leaf } from "lucide-react";

const comparisons = [
  {
    feature: "Extraction Temperature",
    coldPressed: "Below 50°C",
    refined: "Above 200°C",
  },
  {
    feature: "Nutrients",
    coldPressed: "Fully Retained",
    refined: "Mostly Destroyed",
  },
  {
    feature: "Chemicals Used",
    coldPressed: "Zero",
    refined: "Hexane & Others",
  },
  {
    feature: "Natural Aroma",
    coldPressed: "Rich & Authentic",
    refined: "Deodorized",
  },
  {
    feature: "Shelf Life",
    coldPressed: "6-8 Months Natural",
    refined: "12+ Months (Preservatives)",
  },
  {
    feature: "Health Impact",
    coldPressed: "Heart Healthy",
    refined: "Trans Fats Risk",
  },
];

const benefits = [
  {
    icon: <Droplets size={24} />,
    title: "Nutrient Retention",
    text: "Cold pressing at low temperatures preserves Vitamin E, Omega-3, and natural antioxidants that refined oils destroy.",
  },
  {
    icon: <Leaf size={24} />,
    title: "No Chemical Processing",
    text: "Unlike refined oils that use hexane solvent extraction, our oils are purely mechanically pressed from seeds.",
  },
  {
    icon: <Flame size={24} />,
    title: "Higher Smoke Point Safety",
    text: "Traditional extraction maintains the oil's natural stability, making it safer for Indian cooking methods.",
  },
  {
    icon: <FlaskConical size={24} />,
    title: "Better for Digestion",
    text: "The natural enzymes and fatty acids in cold pressed oils aid digestion and nutrient absorption.",
  },
];

export default function WhyColdPressed() {
  return (
    <section
      id="why-cold-pressed"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">
            Why Cold Pressed Oils Matter
          </h2>
          <p className="section-subtitle mx-auto">
            Understand the real difference between refined and cold pressed
            oils — and why your family deserves better.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="rounded-2xl overflow-hidden shadow-sm min-w-[380px] sm:min-w-0"
              style={{ border: "1px solid var(--color-stone-200)" }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-3 text-xs sm:text-sm font-semibold"
                style={{ background: "var(--color-forest-600)", color: "white" }}
              >
                <div className="px-3 sm:px-5 py-3 sm:py-4">Feature</div>
                <div className="px-3 sm:px-5 py-3 sm:py-4 text-center">Cold Pressed ✅</div>
                <div className="px-3 sm:px-5 py-3 sm:py-4 text-center">Refined Oil ❌</div>
              </div>
              {/* Rows */}
              {comparisons.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 text-xs sm:text-sm border-b last:border-b-0"
                  style={{
                    borderColor: "var(--color-stone-100)",
                    background: i % 2 === 0 ? "white" : "var(--color-cream-50)",
                  }}
                >
                  <div
                    className="px-3 sm:px-5 py-3 sm:py-4 font-medium"
                    style={{ color: "var(--color-stone-700)" }}
                  >
                    {row.feature}
                  </div>
                  <div
                    className="px-3 sm:px-5 py-3 sm:py-4 text-center font-medium"
                    style={{ color: "var(--color-forest-600)" }}
                  >
                    {row.coldPressed}
                  </div>
                  <div
                    className="px-3 sm:px-5 py-3 sm:py-4 text-center"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    {row.refined}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
              style={{
                background: "var(--color-cream-50)",
                border: "1px solid var(--color-stone-200)",
              }}
            >
              <div
                className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "var(--color-forest-50)",
                  color: "var(--color-forest-500)",
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3
                  className="text-base font-semibold mb-1.5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a href="/shop" className="btn-primary">
            Choose Your Pure Oil
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
