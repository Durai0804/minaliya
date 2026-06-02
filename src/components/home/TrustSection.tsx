import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TrustSection() {
  const benefits = [
    {
      id: 1,
      title: "Nutrient Retention",
      desc: "Cold pressing retains vitamins, antioxidants, and healthy fats.",
    },
    {
      id: 2,
      title: "Natural Flavor",
      desc: "The oils have a rich, authentic taste that enhances culinary dishes.",
    },
    {
      id: 3,
      title: "Chemical-Free",
      desc: "No solvents or chemicals are used, making it a healthier choice.",
    },
    {
      id: 4,
      title: "Sustainability",
      desc: "Traditional methods are often more environmentally friendly.",
    },
  ];

  return (
    <section
      id="about-minaliya"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
      style={{ background: "var(--color-cream-50)" }}
    >
      {/* Decorative background element */}
      <div 
        className="absolute -right-24 -top-24 w-96 h-96 rounded-full blur-[100px] opacity-40 pointer-events-none"
        style={{ background: "var(--color-amber-200)" }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: Product Showcase Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Glow behind image */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full blur-3xl"
                aria-hidden="true"
              />
              <div className="relative transform hover:scale-105 transition-transform duration-700 ease-out">
                <Image
                  src="/products/all_three.png"
                  alt="Minaliya Product Collection"
                  width={600}
                  height={700}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: Rich Storytelling Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100/50 border border-forest-200 text-forest-700 text-xs font-semibold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                Pure Tradition
              </div>
              
              <h2 
                className="text-3xl sm:text-5xl lg:text-6xl leading-[1.1] text-stone-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Minaliya Wooden <br />
                <span className="italic font-normal">Cold Pressed Oils</span>
              </h2>
              
              <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                Minaliya Wooden cold pressed oils are extracted using traditional methods that 
                preserve the natural nutrients and flavors of the seeds or nuts. This process 
                uses wooden screw presses, ensuring minimal heat exposure and retaining the oil&apos;s quality.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 
                  className="text-2xl font-semibold text-stone-800"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Benefits.
                </h3>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 sm:gap-y-8">
                {benefits.map((benefit) => (
                  <div key={benefit.id} className="space-y-2 group">
                    <div className="flex items-center gap-3">
                      <span 
                        className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border border-stone-200 text-stone-400 group-hover:border-amber-400 group-hover:text-amber-600 transition-colors"
                      >
                        {benefit.id}
                      </span>
                      <h4 className="font-bold text-stone-800 tracking-tight">
                        {benefit.title}
                      </h4>
                    </div>
                    <p className="text-sm text-stone-500 leading-relaxed ml-9">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-stone-900 text-cream-50 font-semibold text-sm hover:bg-stone-800 transition-all hover:gap-5 group w-full sm:w-auto"
              >
                Know More
                <ArrowRight size={18} className="transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
