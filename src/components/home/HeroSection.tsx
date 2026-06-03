"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════ */

interface Slide {
  id: string;
  label: string;
  headlineParts: { text: string; style: "display" | "serif-italic" | "sans" }[];
  subtitle: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  badge: string;
  /* Background color palette per slide */
  bg: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const slides: Slide[] = [
  {
    id: "groundnut",
    label: "Tradition Crafted Since Generations",
    headlineParts: [
      { text: "Pure Wooden", style: "sans" },
      { text: "Cold Pressed", style: "serif-italic" },
      { text: "Oils For Modern", style: "sans" },
      { text: "Healthy Living", style: "display" },
    ],
    subtitle:
      "Traditionally extracted using authentic Mara Chekku methods to preserve natural aroma, nutrients, and purity — the way it was meant to be.",
    image: "/products/groundnut-bg-removed.png",
    imageAlt:
      "Minaliya Pure Cold Pressed Groundnut Oil — Mara Chekku Wood Pressed",
    accentColor: "#C47700",
    badge: "Bestseller · Groundnut Oil",
    bg: {
      primary: "#FFF3D0",
      secondary: "#FFEAB0",
      accent: "#FFE08F",
    },
  },
  {
    id: "sesame",
    label: "The Heart of Tamil Cuisine",
    headlineParts: [
      { text: "Ancient Wisdom", style: "display" },
      { text: "in Every", style: "sans" },
      { text: "Golden Drop", style: "serif-italic" },
      { text: "of Sesame", style: "sans" },
    ],
    subtitle:
      "Gingelly oil extracted the traditional way — rich in antioxidants, perfect for authentic South Indian cooking and Ayurvedic wellness.",
    image: "/products/sesame-bg-removed.png",
    imageAlt:
      "Minaliya Pure Cold Pressed Sesame Gingelly Oil — Traditional Extraction",
    accentColor: "#C4612A",
    badge: "Heritage · Sesame Oil",
    bg: {
      primary: "#FFE6D6",
      secondary: "#FFC9A8",
      accent: "#FFDDA3",
    },
  },
  {
    id: "coconut",
    label: "Nature's Purest Gift",
    headlineParts: [
      { text: "Virgin", style: "serif-italic" },
      { text: "Cold Pressed", style: "sans" },
      { text: "Coconut Oil", style: "display" },
      { text: "Unrefined Purity", style: "sans" },
    ],
    subtitle:
      "From fresh Kerala coconuts to your kitchen — our wood-pressed coconut oil retains every natural nutrient for cooking, skin, and hair care.",
    image: "/products/coconut-bg-removed.png",
    imageAlt:
      "Minaliya Pure Cold Pressed Coconut Oil — Chemical Free Virgin Oil",
    accentColor: "#2D6A2D",
    badge: "Premium · Coconut Oil",
    bg: {
      primary: "#D4E8D4",
      secondary: "#E8F0E0",
      accent: "#F0F7F0",
    },
  },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

const SLIDE_DURATION = 6500;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = slides[current];

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(
      () => goTo((current + 1) % slides.length),
      SLIDE_DURATION
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goTo]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden h-auto lg:h-[calc(100vh-100px)] min-h-[500px] sm:min-h-[580px] lg:min-h-0"
      aria-label="Hero product showcase"
    >
      {/* ─── COLOR-MORPHING BACKGROUND ─── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Base fill — smooth transition */}
        <div
          className="absolute inset-0 transition-colors duration-[1200ms] ease-in-out"
          style={{ backgroundColor: slide.bg.accent }}
        />

        {/* Large blob — top right */}
        <div
          className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
          style={{
            width: "70vw",
            height: "70vw",
            maxWidth: 900,
            maxHeight: 900,
            top: "-15%",
            right: "-10%",
            background: `radial-gradient(circle, ${slide.bg.primary} 0%, ${slide.bg.secondary}80 50%, transparent 70%)`,
          }}
        />

        {/* Smaller blob — bottom left */}
        <div
          className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
          style={{
            width: "50vw",
            height: "50vw",
            maxWidth: 650,
            maxHeight: 650,
            bottom: "-10%",
            left: "-8%",
            background: `radial-gradient(circle, ${slide.bg.secondary} 0%, ${slide.bg.primary}60 50%, transparent 70%)`,
          }}
        />

        {/* Center wash */}
        <div
          className="absolute rounded-full transition-all duration-[1200ms] ease-in-out"
          style={{
            width: "40vw",
            height: "40vw",
            maxWidth: 500,
            maxHeight: 500,
            top: "30%",
            left: "35%",
            background: `radial-gradient(circle, ${slide.bg.accent}90 0%, transparent 70%)`,
          }}
        />

        {/* Subtle background text for filling */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
          style={{
            opacity: 0.04
          }}
        >
          <span className="text-[21vw] font-bold tracking-tighter leading-none" style={{ fontFamily: "var(--font-display)" }}>
            MINALIYA
          </span>
        </div>

        {/* Floating Organic Drops */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full hero-animate-float"
              style={{
                width: 12 + i * 8,
                height: 12 + i * 8,
                background: `radial-gradient(circle, ${slide.accentColor}30 0%, transparent 70%)`,
                top: `${20 + i * 12}%`,
                left: `${(i * 22 + 15) % 90}%`,
                animationDelay: `${i * 0.9}s`,
                filter: "blur(2px)",
              }}
            />
          ))}
        </div>

        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "150px",
          }}
        />
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-auto lg:h-full flex items-center py-10 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center pt-10 sm:pt-14 lg:pt-0 pb-20 sm:pb-16 lg:pb-0">

          {/* ─── LEFT: TYPOGRAPHY (Smooth Cinematic Transition) ─── */}
          <div className="lg:col-span-7 xl:col-span-6 relative z-20 order-2 lg:order-1 text-center lg:text-left flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="space-y-4 sm:space-y-5 lg:space-y-6"
              >
                {/* Luxury label */}
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div
                    className="h-px w-8 transition-colors duration-500"
                    style={{ background: slide.accentColor }}
                  />
                  <span
                    className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--color-stone-600)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {slide.label}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="leading-[1.1] tracking-tight">
                  {slide.headlineParts.map((part, i) => (
                    <span
                      key={i}
                      className={`inline-block mr-3 ${part.style === "display"
                        ? "text-[clamp(1.75rem,5vw,4.6rem)] font-light block"
                        : part.style === "serif-italic"
                          ? "text-[clamp(1.75rem,5vw,4.6rem)] font-normal italic block"
                          : "text-[clamp(1.3rem,4vw,2.4rem)] font-semibold block mt-1"
                        }`}
                      style={{
                        fontFamily:
                          part.style === "sans"
                            ? "var(--font-body)"
                            : "var(--font-display)",
                        color:
                          part.style === "display"
                            ? "var(--color-stone-900)"
                            : part.style === "serif-italic"
                              ? "var(--color-forest-700)"
                              : "var(--color-stone-700)",
                        lineHeight: part.style === "sans" ? "1.2" : "1.1",
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </h1>

                {/* Accent line */}
                <div>
                  <div
                    className="h-[2px] w-16 transition-colors duration-[1200ms]"
                    style={{
                      background: `linear-gradient(90deg, ${slide.accentColor}, transparent)`,
                    }}
                  />
                </div>

                {/* Subtitle */}
                <p
                  className="text-sm sm:text-base max-w-lg leading-relaxed"
                  style={{
                    color: "var(--color-stone-600)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                  }}
                >
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                  <a
                    href="/shop"
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "var(--color-stone-900)",
                      color: "var(--color-cream-50)",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.02em",
                      boxShadow: "0 4px 16px rgba(26, 25, 23, 0.1)",
                    }}
                  >
                    Explore Collection
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                  <a
                    href="#process"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      color: "var(--color-stone-700)",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.02em",
                      border: "1.5px solid var(--color-stone-350)",
                      background: "rgba(255, 255, 255, 0.4)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    Discover The Process
                  </a>
                </div>

                {/* Trust stats */}
                <div className="flex items-center gap-5 pt-3 justify-center lg:justify-start">
                  {[
                    { value: "10,000+", label: "Families" },
                    { value: "100%", label: "Chemical Free" },
                    { value: "4.9", label: "Rating" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-baseline gap-1.5">
                      <span
                        className="text-base font-bold"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--color-stone-800)",
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-wider font-semibold"
                        style={{ color: "var(--color-stone-500)" }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─── RIGHT: CINEMATIC PRODUCT SHOWCASE ─── */}
          <div className="lg:col-span-5 xl:col-span-6 relative flex items-center justify-center order-1 lg:order-2 min-h-[320px] lg:min-h-0">
            {/* Spotlight gradient behind product */}
            <div
              className="absolute z-0 rounded-full transition-all duration-[1200ms] ease-in-out"
              style={{
                width: "min(80vw, 550px)",
                height: "min(80vw, 550px)",
                background: `radial-gradient(circle, ${slide.bg.primary}aa 0%, ${slide.bg.secondary}60 40%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${slide.id}`}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -10 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="relative z-10"
              >
                {/* ── Product bottle ── */}
                <div className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] xl:w-[400px] h-[45vh] md:h-[55vh] lg:h-[65vh] max-h-[600px] min-h-[350px] hero-animate-float relative mx-auto lg:mx-0 flex justify-center">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain relative z-10"
                    style={{
                      filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.12))",
                    }}
                    priority
                  />

                  {/* Reflection beneath bottle */}
                  <div
                    className="absolute bottom-[-15%] left-[5%] right-[5%] h-[30%] z-0 overflow-hidden"
                    style={{
                      transform: "scaleY(-1) scaleX(0.92)",
                      opacity: 0.08,
                      maskImage:
                        "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 80%)",
                      WebkitMaskImage:
                        "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 80%)",
                    }}
                    aria-hidden="true"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        quality={50}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Side badge — positioned right ── */}
                <div
                  className="absolute -right-4 sm:-right-8 lg:-right-10 top-[28%] hero-animate-float-slow hidden sm:block"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div
                    className="px-3.5 py-2.5 rounded-2xl text-center border border-white/40"
                    style={{
                      background: "rgba(255, 255, 255, 0.65)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 8px 32px rgba(45, 43, 39, 0.05)",
                    }}
                  >
                    <div
                      className="text-[9px] font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--color-stone-500)" }}
                    >
                      Mara Chekku
                    </div>
                    <div
                      className="text-lg font-bold mt-0.5 leading-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-stone-800)",
                      }}
                    >
                      100%
                    </div>
                    <div
                      className="text-[8px] uppercase tracking-widest font-semibold"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      Pure &amp; Natural
                    </div>
                  </div>
                </div>

                {/* ── Bottom badge ── */}
                <div
                  className="absolute -bottom-10 lg:-bottom-12 left-1/2 -translate-x-1/2 hero-animate-float-slow hidden sm:block z-20"
                  style={{ animationDelay: "1s" }}
                >
                  <div
                    className="px-5 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap border border-white/40"
                    style={{
                      background: "rgba(255, 255, 255, 0.65)",
                      backdropFilter: "blur(12px)",
                      color: "var(--color-stone-600)",
                      boxShadow: "0 8px 32px rgba(45, 43, 39, 0.05)",
                    }}
                  >
                    {slide.badge}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ─── BOTTOM CONTROLS ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10">
          <div className="flex items-center justify-between">
            {/* Slide indicators */}
            <div className="flex items-center gap-4">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className="group flex items-center gap-2"
                  aria-label={`Go to slide ${i + 1}: ${s.badge}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  <div
                    className="relative overflow-hidden rounded-full transition-all duration-500"
                    style={{
                      width: i === current ? 40 : 20,
                      height: 3,
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full transition-colors duration-500"
                      style={{
                        background:
                          i === current
                            ? "var(--color-stone-300)"
                            : "var(--color-stone-200)",
                      }}
                    />
                    {i === current && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "var(--color-stone-800)",
                          transformOrigin: "left",
                          animation: `hero-progress ${SLIDE_DURATION}ms linear forwards`,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-wider hidden sm:inline transition-colors"
                    style={{
                      color:
                        i === current
                          ? "var(--color-stone-700)"
                          : "var(--color-stone-400)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border"
                style={{
                  borderColor: "var(--color-stone-300)",
                  color: "var(--color-stone-600)",
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(6px)",
                }}
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border"
                style={{
                  borderColor: "var(--color-stone-300)",
                  color: "var(--color-stone-600)",
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(6px)",
                }}
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
