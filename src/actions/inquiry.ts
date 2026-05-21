"use server";

import prisma from "@/lib/prisma";

export interface InquiryInput {
  name: string;
  company?: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  message?: string;
}

export async function submitInquiry(data: InquiryInput) {
  try {
    if (!data.name || !data.email || !data.phone || !data.quantity) {
      return { success: false, error: "Required fields are missing." };
    }

    const inquiry = await prisma.bulkInquiry.create({
      data: {
        name: data.name,
        company: data.company || null,
        email: data.email,
        phone: data.phone,
        product: data.product,
        quantity: Math.floor(data.quantity),
        message: data.message || null,
      },
    });

    return { success: true, inquiryId: inquiry.id };
  } catch (error) {
    console.error("Error submitting bulk inquiry to database:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again later." };
  }
}
