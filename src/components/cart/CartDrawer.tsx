"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
    closeCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[420px] max-w-[90vw] shadow-2xl flex flex-col"
        style={{ background: "var(--color-cream-50)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b shrink-0"
          style={{ borderColor: "var(--color-stone-200)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: "var(--color-stone-700)" }} />
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-stone-800)",
              }}
            >
              Your Cart
            </span>
            <span
              className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
              }}
            >
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X size={22} style={{ color: "var(--color-stone-600)" }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "var(--color-cream-100)",
                  color: "var(--color-stone-300)",
                }}
              >
                <ShoppingBag size={36} />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-stone-800)",
                }}
              >
                Your cart is empty
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "var(--color-stone-400)" }}
              >
                Looks like you haven&apos;t added any pure oils to your cart yet.
              </p>
              <button onClick={closeCart} className="btn-primary text-sm">
                Continue Shopping
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl"
                  style={{
                    background: "white",
                    border: "1px solid var(--color-stone-200)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="shrink-0 w-20 h-20 rounded-lg flex items-center justify-center p-2"
                    style={{ background: "var(--color-cream-100)" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={70}
                      height={70}
                      className="object-contain max-h-full w-auto"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold truncate"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-stone-800)",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-stone-400)" }}
                    >
                      Size: {item.size}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div
                        className="inline-flex items-center rounded-lg overflow-hidden"
                        style={{ border: "1px solid var(--color-stone-200)" }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.slug, item.size, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className="w-8 h-8 flex items-center justify-center text-xs font-semibold border-x"
                          style={{ borderColor: "var(--color-stone-200)" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.slug, item.size, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--color-stone-800)" }}
                      >
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.slug, item.size)}
                    className="self-start p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    style={{ color: "var(--color-stone-400)" }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-xs font-medium hover:underline"
                style={{ color: "var(--color-stone-400)" }}
              >
                Clear entire cart
              </button>
            </div>
          )}
        </div>

        {/* Footer (only when items exist) */}
        {items.length > 0 && (
          <div
            className="shrink-0 p-5 border-t space-y-4"
            style={{ borderColor: "var(--color-stone-200)" }}
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-stone-500)" }}
              >
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span
                className="text-xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-stone-900)",
                }}
              >
                ₹{totalPrice}
              </span>
            </div>

            {/* Free shipping note */}
            {totalPrice >= 499 ? (
              <p
                className="text-xs font-medium text-center px-3 py-2 rounded-lg"
                style={{
                  background: "var(--color-forest-50)",
                  color: "var(--color-forest-600)",
                }}
              >
                ✓ You qualify for free shipping!
              </p>
            ) : (
              <p
                className="text-xs font-medium text-center px-3 py-2 rounded-lg"
                style={{
                  background: "var(--color-amber-50)",
                  color: "var(--color-amber-700)",
                }}
              >
                Add ₹{499 - totalPrice} more for free shipping
              </p>
            )}

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-base py-4"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full text-center text-sm font-medium hover:underline"
              style={{ color: "var(--color-stone-500)" }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
