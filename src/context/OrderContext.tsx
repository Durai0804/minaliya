"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CartItem } from "./CartContext";

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  status: "Processing" | "Shipped" | "Delivered";
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "minaliya-orders";

function loadOrders(): Order[] {
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

function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOrders(loadOrders());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveOrders(orders);
    }
  }, [orders, mounted]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within an OrderProvider");
  return ctx;
}
