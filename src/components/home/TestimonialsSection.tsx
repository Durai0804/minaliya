import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Shankar",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "The groundnut oil from Minaliya has completely changed our cooking. The aroma is incredible — just like what my grandmother used to make. My family loves the authentic taste!",
    product: "Groundnut Oil",
    avatar: "PS",
  },
  {
    name: "Rajesh Kumar",
    location: "Coimbatore, Tamil Nadu",
    rating: 5,
    text: "I switched from refined oil to Minaliya's cold pressed sesame oil 6 months ago. My cholesterol levels have improved significantly. Truly pure and worth every penny.",
    product: "Sesame Oil",
    avatar: "RK",
  },
  {
    name: "Meena Devi",
    location: "Bangalore, Karnataka",
    rating: 5,
    text: "As a mother, I'm very particular about what goes into our food. Minaliya's oils are the purest I've found. The coconut oil is amazing for both cooking and hair care!",
    product: "Coconut Oil",
    avatar: "MD",
  },
  {
    name: "Arvind Raman",
    location: "Madurai, Tamil Nadu",
    rating: 4,
    text: "Been using Mara Chekku oils for traditional Tamil cooking. Minaliya delivers consistent quality every time. The freshness and purity is unmatched in the market.",
    product: "Groundnut Oil",
    avatar: "AR",
  },
  {
    name: "Sunitha Lakshmi",
    location: "Hyderabad, Telangana",
    rating: 5,
    text: "Ordered online and was impressed by the packaging and freshness. The sesame oil smells divine and you can taste the difference immediately. Highly recommend!",
    product: "Sesame Oil",
    avatar: "SL",
  },
  {
    name: "Dr. Venkat Subramani",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "As a nutritionist, I recommend cold pressed oils to all my patients. Minaliya is one brand I trust completely for quality and authenticity. Lab-tested and genuinely pure.",
    product: "All Oils",
    avatar: "VS",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">Loved by Thousands of Families</h2>
          <p className="section-subtitle mx-auto">
            Real stories from real families who made the switch to pure,
            traditional cold pressed oils.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl space-y-4 transition-all duration-300 hover:shadow-md"
              style={{
                background: "var(--color-cream-50)",
                border: "1px solid var(--color-stone-200)",
              }}
            >
              {/* Quote Icon */}
              <Quote
                size={24}
                style={{ color: "var(--color-amber-300)", opacity: 0.6 }}
              />

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, si) => (
                  <Star
                    key={si}
                    size={15}
                    fill={si < t.rating ? "var(--color-amber-400)" : "none"}
                    stroke={si < t.rating ? "var(--color-amber-400)" : "var(--color-stone-300)"}
                  />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-stone-600)" }}
              >
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "var(--color-forest-100)",
                    color: "var(--color-forest-600)",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-stone-800)" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    {t.location} · {t.product}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
