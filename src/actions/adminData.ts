"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/product-utils";
import { verifyAdminSession } from "./admin";

export type CreateProductInput = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  price: number;
  discountPrice?: number | null;
  stock?: number;
  images: string[];
  isFeatured?: boolean;
};

async function requireAdmin() {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required.");
  }
}

function getMonthBounds(offsetMonths = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - offsetMonths, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - offsetMonths + 1, 1);
  return { start, end };
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export async function getAdminDashboardStats() {
  await requireAdmin();

  const thisMonth = getMonthBounds(0);
  const lastMonth = getMonthBounds(1);

  const [
    totalOrders,
    totalProducts,
    totalInquiries,
    revenueAgg,
    pendingOrders,
    inStockCount,
    ordersThisMonth,
    ordersLastMonth,
    revenueThisMonthAgg,
    revenueLastMonthAgg,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.bulkInquiry.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
    }),
    prisma.product.count({ where: { stock: { gt: 0 } } }),
    prisma.order.count({
      where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalRevenue = Number(revenueAgg._sum.totalAmount ?? 0);
  const revenueThisMonth = Number(revenueThisMonthAgg._sum.totalAmount ?? 0);
  const revenueLastMonth = Number(revenueLastMonthAgg._sum.totalAmount ?? 0);

  const ordersTrend = percentChange(ordersThisMonth, ordersLastMonth);
  const revenueTrend = percentChange(revenueThisMonth, revenueLastMonth);

  const stockPercent =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;

  return {
    totalOrders,
    totalProducts,
    totalInquiries,
    totalRevenue,
    pendingOrders,
    stockPercent,
    ordersTrend,
    revenueTrend,
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

export async function getAllCategories() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return categories;
}

export async function createProduct(input: CreateProductInput) {
  await requireAdmin();

  const name = input.name?.trim();
  const slug = slugify(input.slug || input.name || "");
  const description = input.description?.trim();
  const categoryId = input.categoryId?.trim();
  const images = input.images?.filter((p) => p.startsWith("/"));

  if (!name || !slug || !description || !categoryId) {
    return {
      success: false as const,
      error: "Name, slug, description, and category are required.",
    };
  }

  if (!images?.length) {
    return {
      success: false as const,
      error: "At least one product image is required.",
    };
  }

  const price = Number(input.price);

  if (!Number.isFinite(price) || price <= 0) {
    return { success: false as const, error: "Price must be a positive number." };
  }

  const stock =
    input.stock != null ? Number(input.stock) : 100;

  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false as const, error: "Stock must be a whole number of 0 or more." };
  }

  const discountPrice =
    input.discountPrice != null ? Number(input.discountPrice) : null;

  if (discountPrice != null && (!Number.isFinite(discountPrice) || discountPrice <= 0)) {
    return { success: false as const, error: "Discount price must be a positive number." };
  }

  if (discountPrice != null && discountPrice > price) {
    return {
      success: false as const,
      error: "Discount price cannot be higher than the regular price.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { success: false as const, error: "Selected category does not exist." };
  }

  const existingSlug = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    return {
      success: false as const,
      error: `A product with slug "${slug}" already exists. Choose a different slug.`,
    };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        price,
        discountPrice: discountPrice ?? undefined,
        stock,
        images,
        isFeatured: input.isFeatured ?? false,
      },
    });

    return { success: true as const, productId: product.id };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return {
        success: false as const,
        error: "A product with this slug already exists.",
      };
    }
    return { success: false as const, error: "Failed to create product." };
  }
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
