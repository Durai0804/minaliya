import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, mobile } = body;

    if (!email && !mobile) {
      return NextResponse.json(
        { error: "Email or mobile is required" },
        { status: 400 }
      );
    }

    // Check if the credentials match the admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPhone = process.env.ADMIN_PHONE;

    if (adminEmail && adminPhone && email && mobile) {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPhone = mobile.replace(/\D/g, "").slice(-10);

      const expectedEmail = adminEmail.trim().toLowerCase();
      const expectedPhone = adminPhone.replace(/\D/g, "").slice(-10);

      if (normalizedEmail === expectedEmail && normalizedPhone === expectedPhone) {
        return NextResponse.json({
          exists: true,
          isAdmin: true,
          user: {
            id: "admin",
            name: "Administrator",
            email: adminEmail,
            phoneNumber: adminPhone,
          },
        });
      }
    }

    // Try to find the user by email or phone number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: mobile || undefined },
        ],
      },
    });

    if (user && user.name) {
      return NextResponse.json({ exists: true, user });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("Auth lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
