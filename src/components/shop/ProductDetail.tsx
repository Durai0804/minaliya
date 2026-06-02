"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  ChevronRight,
  Check,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Size {
  label: string;
  price: number;
  originalPrice: number;
}

interface ProductData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  images: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  sizes: Size[];
  category: string;
  benefits: string[];
  specifications: { label: string; value: string }[];
  usage: string[];
}

export default function ProductDetail({
  product,
  related,
}: {
  product: ProductData;
  related: ProductData[];
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes.length - 1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "benefits" | "specs" | "usage">(
    "description"
  );
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.slug);
  const currentSize = product.sizes[selectedSize];
  const discount = Math.round(
    ((currentSize.originalPrice - currentSize.price) / currentSize.originalPrice) * 100
  );

  return (
    <>
      {/* Breadcrumb */}
      <div
        className="py-4 border-b"
        style={{
          background: "var(--color-cream-50)",
          borderColor: "var(--color-stone-200)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link
              href="/"
              className="hover:underline"
              style={{ color: "var(--color-stone-400)" }}
            >
              Home
            </Link>
            <ChevronRight size={14} style={{ color: "var(--color-stone-300)" }} />
            <Link
              href="/shop"
              className="hover:underline"
              style={{ color: "var(--color-stone-400)" }}
            >
              Shop
            </Link>
            <ChevronRight size={14} style={{ color: "var(--color-stone-300)" }} />
            <span style={{ color: "var(--color-stone-700)" }} className="font-medium">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section
        className="py-12 lg:py-20"
        style={{ background: "var(--color-cream-50)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square rounded-2xl flex items-center justify-center p-8 overflow-hidden"
                style={{
                  background: "var(--color-cream-100)",
                  border: "1px solid var(--color-stone-200)",
                }}
              >
                {product.badge && (
                  <span
                    className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-semibold z-10"
                    style={{
                      background: "var(--color-forest-600)",
                      color: "white",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-contain max-h-[80%] w-auto transition-all duration-500"
                  priority
                  quality={90}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="relative w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center p-2 transition-all"
                    style={{
                      background: "var(--color-cream-100)",
                      border: `2px solid ${
                        selectedImage === i
                          ? "var(--color-forest-500)"
                          : "var(--color-stone-200)"
                      }`,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--color-forest-500)" }}
              >
                {product.category} Oil
              </span>

              {/* Name */}
              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-stone-900)",
                }}
              >
                {product.name}
              </h1>

              {/* Tagline */}
              <p
                className="text-lg italic"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-stone-500)",
                }}
              >
                {product.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={
                        i < Math.floor(product.rating)
                          ? "var(--color-amber-400)"
                          : "none"
                      }
                      stroke={
                        i < Math.floor(product.rating)
                          ? "var(--color-amber-400)"
                          : "var(--color-stone-300)"
                      }
                    />
                  ))}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-stone-900)" }}
                >
                  ₹{currentSize.price}
                </span>
                <span
                  className="text-lg line-through"
                  style={{ color: "var(--color-stone-400)" }}
                >
                  ₹{currentSize.originalPrice}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "var(--color-terra-100)",
                    color: "var(--color-terra-500)",
                  }}
                >
                  {discount}% OFF
                </span>
              </div>

              {/* Divider */}
              <div
                className="h-px"
                style={{ background: "var(--color-stone-200)" }}
              />

              {/* Size Selector */}
              <div>
                <label
                  className="text-sm font-semibold mb-3 block"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  Size
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.sizes.map((size, i) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(i)}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all"
                      style={{
                        background:
                          selectedSize === i
                            ? "var(--color-forest-600)"
                            : "white",
                        color:
                          selectedSize === i
                            ? "white"
                            : "var(--color-stone-700)",
                        border: `1.5px solid ${
                          selectedSize === i
                            ? "var(--color-forest-600)"
                            : "var(--color-stone-200)"
                        }`,
                      }}
                    >
                      {size.label} — ₹{size.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label
                  className="text-sm font-semibold mb-3 block"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  Quantity
                </label>
                <div
                  className="inline-flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid var(--color-stone-200)" }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-stone-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span
                    className="w-12 h-11 flex items-center justify-center font-semibold text-sm border-x"
                    style={{ borderColor: "var(--color-stone-200)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-stone-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1 justify-center text-base py-4"
                  onClick={() => {
                    addItem(
                      {
                        slug: product.slug,
                        name: product.name,
                        image: product.images[0],
                        price: currentSize.price,
                        size: currentSize.label,
                      },
                      quantity
                    );
                  }}
                >
                  <ShoppingBag size={20} />
                  Add to Cart — ₹{currentSize.price * quantity}
                </button>
                <button
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    border: isWishlisted ? "1.5px solid var(--color-terra-500)" : "1.5px solid var(--color-stone-200)",
                    color: isWishlisted ? "var(--color-terra-500)" : "var(--color-stone-500)",
                    background: isWishlisted ? "var(--color-terra-50)" : "transparent",
                  }}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  onClick={() => {
                    toggleWishlist({
                      slug: product.slug,
                      name: product.name,
                      image: product.images[0],
                      price: currentSize.price,
                      originalPrice: currentSize.originalPrice,
                    });
                  }}
                >
                  <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Trust Badges */}
              <div
                className="grid grid-cols-3 gap-2 sm:gap-3 pt-4"
              >
                {[
                  { icon: <Truck size={18} />, label: "Free Shipping", sub: "Above ₹499" },
                  { icon: <Shield size={18} />, label: "100% Pure", sub: "Lab Tested" },
                  { icon: <RotateCcw size={18} />, label: "Easy Returns", sub: "7-day policy" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="text-center p-2 sm:p-3 rounded-xl"
                    style={{
                      background: "var(--color-cream-100)",
                      border: "1px solid var(--color-stone-200)",
                    }}
                  >
                    <div
                      className="flex justify-center mb-1"
                      style={{ color: "var(--color-forest-500)" }}
                    >
                      {badge.icon}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-stone-700)" }}
                    >
                      {badge.label}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      {badge.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section style={{ background: "var(--color-surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Tab Headers */}
          <div
            className="flex gap-1 overflow-x-auto mb-10 border-b"
            style={{ borderColor: "var(--color-stone-200)" }}
          >
            {(
              [
                { key: "description", label: "Description" },
                { key: "benefits", label: "Benefits" },
                { key: "specs", label: "Specifications" },
                { key: "usage", label: "How to Use" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition-all relative"
                style={{
                  color:
                    activeTab === tab.key
                      ? "var(--color-forest-600)"
                      : "var(--color-stone-400)",
                }}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "var(--color-forest-600)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl">
            {activeTab === "description" && (
              <div className="space-y-4">
                {product.description.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed"
                    style={{ color: "var(--color-stone-600)" }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

            {activeTab === "benefits" && (
              <ul className="space-y-4">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--color-forest-500)" }}
                    />
                    <span
                      className="text-base leading-relaxed"
                      style={{ color: "var(--color-stone-600)" }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "specs" && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--color-stone-200)" }}
              >
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 text-sm border-b last:border-b-0"
                    style={{
                      borderColor: "var(--color-stone-100)",
                      background: i % 2 === 0 ? "white" : "var(--color-cream-50)",
                    }}
                  >
                    <div
                      className="px-5 py-3.5 font-medium"
                      style={{ color: "var(--color-stone-500)" }}
                    >
                      {spec.label}
                    </div>
                    <div
                      className="px-5 py-3.5 font-medium"
                      style={{ color: "var(--color-stone-800)" }}
                    >
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "usage" && (
              <ul className="space-y-4">
                {product.usage.map((u, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 mt-0.5"
                      style={{
                        background: "var(--color-forest-50)",
                        color: "var(--color-forest-600)",
                        border: "1px solid var(--color-forest-200)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-base leading-relaxed"
                      style={{ color: "var(--color-stone-600)" }}
                    >
                      {u}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section
        className="section-padding"
        style={{ background: "var(--color-cream-50)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <div className="divider-leaf mx-auto" />
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/shop/${item.slug}`}
                className="product-card group block"
              >
                <div className="product-image relative aspect-[3/4] p-3 sm:p-6 flex items-center justify-center">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={280}
                    height={380}
                    className="object-contain max-h-full w-auto"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="sm:w-[13px] sm:h-[13px]"
                        fill={
                          i < Math.floor(item.rating)
                            ? "var(--color-amber-400)"
                            : "none"
                        }
                        stroke={
                          i < Math.floor(item.rating)
                            ? "var(--color-amber-400)"
                            : "var(--color-stone-300)"
                        }
                      />
                    ))}
                  </div>
                  <h3
                    className="text-sm sm:text-base font-semibold line-clamp-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-stone-800)",
                    }}
                  >
                    {item.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span
                      className="text-base sm:text-lg font-bold"
                      style={{ color: "var(--color-stone-800)" }}
                    >
                      ₹{item.price}
                    </span>
                    <span
                      className="text-xs sm:text-sm line-through"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      ₹{item.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
