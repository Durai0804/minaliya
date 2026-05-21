"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface WishlistItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  totalItems: number;
  addItem: (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (slug: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "minaliya-wishlist";

function loadWishlist(): WishlistItem[] {
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

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    setItems(loadWishlist());
    setMounted(true);
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    if (mounted) {
      saveWishlist(items);
    }
  }, [items, mounted]);

  const addItem = useCallback((newItem: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === newItem.slug)) return prev;
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const isInWishlist = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  const toggleWishlist = useCallback(
    (item: WishlistItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.slug === item.slug)) {
          return prev.filter((i) => i.slug !== item.slug);
        }
        return [...prev, item];
      });
    },
    []
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const totalItems = Array.isArray(items) ? items.length : 0;

  return (
    <WishlistContext.Provider
      value={{
        items,
        totalItems,
        addItem,
        removeItem,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
