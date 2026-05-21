"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "minaliya-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (mounted) {
      saveCart(items);
    }
  }, [items, mounted]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.slug === newItem.slug && i.size === newItem.size
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === newItem.slug && i.size === newItem.size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...newItem, quantity }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const updateQuantity = useCallback(
    (slug: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(slug, size);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.slug === slug && i.size === size ? { ...i, quantity } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const totalItems = Array.isArray(items) ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const totalPrice = Array.isArray(items) ? items.reduce((sum, i) => sum + i.price * i.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
