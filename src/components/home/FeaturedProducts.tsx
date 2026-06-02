"use client";

import Image from "next/image";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { allProducts, Product } from "@/data/products";

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.slug);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <article className="product-card group relative">
      {/* Image */}
      <div className="product-image relative aspect-[3/4] p-3 sm:p-6 flex items-center justify-center">
        <Image
          src={product.image}
          alt={`${product.name} - Minaliya Mara Chekku Wood Pressed Oil`}
          width={280}
          height={380}
          className="object-contain max-h-full w-auto"
          loading="lazy"
          quality={85}
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-2 sm:top-4 left-2 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold"
            style={{
              background: product.badge === "Bestseller"
                ? "var(--color-forest-600)"
                : product.badge === "Popular"
                  ? "var(--color-amber-500)"
                  : "var(--color-terra-400)",
              color: "white",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span
            className="absolute top-2 sm:top-4 right-2 sm:right-4 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold"
            style={{
              background: "var(--color-terra-100)",
              color: "var(--color-terra-500)",
            }}
          >
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="touch-action-show absolute right-2 sm:right-4 bottom-2 sm:bottom-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transition-colors"
            style={{
              background: "white",
              color: isWishlisted ? "var(--color-terra-500)" : "var(--color-stone-600)",
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist({
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                originalPrice: product.originalPrice,
              });
            }}
          >
            <Heart size={16} className="sm:w-[18px] sm:h-[18px]" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md transition-colors"
            style={{
              background: "white",
              color: "var(--color-stone-600)",
            }}
            aria-label="Quick view"
          >
            <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="sm:w-[13px] sm:h-[13px]"
                fill={i < Math.floor(product.rating) ? "var(--color-amber-400)" : "none"}
                stroke={i < Math.floor(product.rating) ? "var(--color-amber-400)" : "var(--color-stone-300)"}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs font-medium" style={{ color: "var(--color-stone-400)" }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-sm sm:text-base font-semibold leading-snug line-clamp-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-stone-800)",
          }}
        >
          {product.name}
        </h3>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {product.sizes.map((size) => (
            <span
              key={size}
              className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium"
              style={{
                background: "var(--color-cream-100)",
                color: "var(--color-stone-600)",
              }}
            >
              {size}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2 sm:gap-0">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span
              className="text-base sm:text-xl font-bold"
              style={{ color: "var(--color-stone-800)" }}
            >
              ₹{product.price}
            </span>
            <span
              className="text-xs sm:text-sm line-through"
              style={{ color: "var(--color-stone-400)" }}
            >
              ₹{product.originalPrice}
            </span>
          </div>
          <button
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all hover:shadow-md min-h-[36px]"
            style={{
              background: "var(--color-forest-600)",
              color: "white",
            }}
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.preventDefault();
              addItem({
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                size: product.sizes[0], // Default to first size
              });
            }}
          >
            <ShoppingBag size={14} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProducts() {
  const featured = allProducts.slice(0, 4);
  return (
    <section
      id="products"
      className="section-padding"
      style={{ background: "var(--color-cream-50)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="divider-leaf mx-auto" />
          <h2 className="section-title">Our Pure Cold Pressed Oils</h2>
          <p className="section-subtitle mx-auto">
            Handpicked seeds, traditional wooden press extraction, and fresh
            bottling — experience the authentic taste of purity.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <a href="/shop" className="btn-secondary px-10">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
