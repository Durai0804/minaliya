import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  isAdminCredentialsMatch,
  isCompleteReturningUser,
  normalizePhone,
} from "@/lib/auth-utils";

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
      if (isAdminCredentialsMatch(email, mobile, adminEmail, adminPhone)) {
        return NextResponse.json({
          exists: true,
          isAdmin: true,
          user: {
            id: "admin",
            name: "Administrator",
            email: adminEmail,
            mobile: normalizePhone(adminPhone),
          },
        });
      }
    }

    const phone = normalizePhone(mobile);
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phone },
    });

    if (user && isCompleteReturningUser(user, email, mobile)) {
      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.phoneNumber,
        },
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("Auth lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
