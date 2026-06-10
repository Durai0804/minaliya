"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface OrderItemInput {
  productSlug: string;
  quantity: number;
  price: number;
}

export interface OrderInput {
  userId?: string;
  totalAmount: number;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod: string;
  items: OrderItemInput[];
}

export async function createOrder(data: OrderInput) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "No products in order items." };
    }
    if (!data.shippingAddress || !data.shippingAddress.name || !data.shippingAddress.phone || !data.shippingAddress.address) {
      return { success: false, error: "Invalid shipping details." };
    }

    // Wrap in a transaction to guarantee stock adjustment and order integrity
    const result = await prisma.$transaction(async (tx) => {
      const itemsToCreate = [];

      // 1. Verify products & stock levels
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { slug: item.productSlug },
        });

        if (!product) {
          throw new Error(`Product not found: "${item.productSlug}"`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        // 2. Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: new Prisma.Decimal(item.price),
        });
      }

      // 3. Create the Order
      const order = await tx.order.create({
        data: {
          userId: data.userId || null,
          totalAmount: new Prisma.Decimal(data.totalAmount),
          shippingAddress: data.shippingAddress as any,
          paymentMethod: data.paymentMethod.toUpperCase(),
          paymentStatus: "PAID",
          status: "PENDING",
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message || "Failed to place order. Please try again." };
  }
}

export async function getUserOrders(email?: string, phone?: string) {
  try {
    if (!email && !phone) {
      return { success: true, orders: [] };
    }

    const dbOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const filteredOrders = dbOrders.filter((order) => {
      const addr = order.shippingAddress as any;
      if (!addr) return false;

      const emailMatch = email && addr.email && addr.email.toLowerCase() === email.toLowerCase();

      const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
      const cleanAddrPhone = addr.phone ? addr.phone.replace(/\D/g, "") : "";
      const phoneMatch =
        cleanPhone &&
        cleanAddrPhone &&
        (cleanAddrPhone.includes(cleanPhone) || cleanPhone.includes(cleanAddrPhone));

      return emailMatch || phoneMatch;
    });

    const mappedOrders = filteredOrders.map((order) => {
      return {
        id: order.id,
        date: order.createdAt.toISOString(),
        totalPrice: Number(order.totalAmount),
        status:
          order.status === "PENDING"
            ? "Processing"
            : order.status === "SHIPPED"
            ? "Shipped"
            : "Delivered",
        items: order.items.map((item) => ({
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0] || "/products/placeholder.jpg",
          price: Number(item.price),
          quantity: item.quantity,
          size: item.product.slug.includes("500ml") ? "500ml" : "1 Ltr",
        })),
      };
    });

    return { success: true, orders: mappedOrders };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message || "Failed to fetch orders." };
  }
}


