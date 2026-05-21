"use server";

import prisma from "@/lib/prisma";
import { verifyAdminSession } from "./admin";

async function requireAdmin() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function getAdminDashboardStats() {
  await requireAdmin();

  const [totalOrders, totalProducts, totalInquiries, orders] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.bulkInquiry.count(),
      prisma.order.findMany({
        select: { totalAmount: true, status: true },
      }),
    ]);

  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + Number(order.totalAmount),
    0
  );
  const pendingOrders = orders.filter(
    (order: any) => order.status === "PENDING" || order.status === "PROCESSING"
  ).length;

  return {
    totalOrders,
    totalProducts,
    totalInquiries,
    totalRevenue,
    pendingOrders,
  };
}

export async function getAllOrders() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress as Record<string, string>,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    customerName: (order.shippingAddress as Record<string, string>)?.name || "N/A",
    customerEmail: (order.shippingAddress as Record<string, string>)?.email || "N/A",
    customerPhone: (order.shippingAddress as Record<string, string>)?.phone || "N/A",
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      productImage: item.product.images[0] || "/products/placeholder.jpg",
      quantity: item.quantity,
      price: Number(item.price),
    })),
  }));
}

export async function getAllProducts() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    stock: product.stock,
    images: product.images,
    isFeatured: product.isFeatured,
    categoryName: product.category.name,
    createdAt: product.createdAt.toISOString(),
  }));
}

export async function getAllInquiries() {
  await requireAdmin();

  const inquiries = await prisma.bulkInquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return inquiries.map((inquiry: any) => ({
    id: inquiry.id,
    name: inquiry.name,
    company: inquiry.company,
    email: inquiry.email,
    phone: inquiry.phone,
    product: inquiry.product,
    quantity: inquiry.quantity,
    message: inquiry.message,
    createdAt: inquiry.createdAt.toISOString(),
  }));
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  await requireAdmin();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function getRecentOrders(limit = 10) {
  await requireAdmin();

  const orders = await prisma.order.findMany({
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
    take: limit,
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    customerName: (order.shippingAddress as Record<string, string>)?.name || "N/A",
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.reduce((sum: number, item) => sum + item.quantity, 0),
  }));
}
