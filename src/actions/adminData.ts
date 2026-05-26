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
  stock: number;
  imagePath: string;
  extraImagePaths?: string[];
  isFeatured?: boolean;
  extractionMethod?: string;
  origin?: string;
  shelfLife?: string;
};

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
  const imagePath = input.imagePath?.trim();

  if (!name || !slug || !description || !categoryId) {
    return {
      success: false as const,
      error: "Name, slug, description, and category are required.",
    };
  }

  if (!imagePath || !imagePath.startsWith("/")) {
    return {
      success: false as const,
      error: "Image path is required and must start with / (e.g. /products/your-image.jpg).",
    };
  }

  const price = Number(input.price);
  const stock = Number(input.stock);

  if (!Number.isFinite(price) || price <= 0) {
    return { success: false as const, error: "MRP must be a positive number." };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return { success: false as const, error: "Stock must be a whole number of 0 or more." };
  }

  const discountPrice =
    input.discountPrice != null ? Number(input.discountPrice) : null;

  if (discountPrice != null && (!Number.isFinite(discountPrice) || discountPrice <= 0)) {
    return { success: false as const, error: "Sale price must be a positive number." };
  }

  if (discountPrice != null && discountPrice > price) {
    return {
      success: false as const,
      error: "Sale price cannot be higher than MRP.",
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

  const extraImages = (input.extraImagePaths || [])
    .map((p) => p.trim())
    .filter((p) => p.startsWith("/"));
  const images = [imagePath, ...extraImages.filter((p) => p !== imagePath)];

  const specifications: Record<string, string> = {};
  if (input.extractionMethod?.trim()) {
    specifications["Extraction Method"] = input.extractionMethod.trim();
  }
  if (input.origin?.trim()) {
    specifications["Origin"] = input.origin.trim();
  }
  if (input.shelfLife?.trim()) {
    specifications["Shelf Life"] = input.shelfLife.trim();
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
        specifications:
          Object.keys(specifications).length > 0 ? specifications : undefined,
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
