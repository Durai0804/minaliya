import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, mobile, name } = body;

    if (!email || !mobile || !name) {
      return NextResponse.json(
        { error: "Email, mobile, and name are required" },
        { status: 400 }
      );
    }

    // Check if user exists by email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phoneNumber: mobile },
        ],
      },
    });

    let user;

    if (existingUser) {
      // Update existing user with new details if missing
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: name,
          email: existingUser.email || email,
          phoneNumber: existingUser.phoneNumber || mobile,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          phoneNumber: mobile,
        },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Auth register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
