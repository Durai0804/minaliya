"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "minaliya-admin-session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function generateToken(): string {
  const secret = process.env.ADMIN_SECRET || "fallback-secret";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  // Simple token: base64 of secret + timestamp + random
  const raw = `${secret}:${timestamp}:${random}`;
  return Buffer.from(raw).toString("base64");
}

function isValidToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const secret = process.env.ADMIN_SECRET || "fallback-secret";
    return decoded.startsWith(secret + ":");
  } catch {
    return false;
  }
}

export async function adminLogin(
  email: string,
  phone: string
): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPhone = process.env.ADMIN_PHONE;

  if (!adminEmail || !adminPhone) {
    console.error("Admin credentials not configured in environment variables.");
    return { success: false, error: "Server configuration error." };
  }

  // Normalize inputs
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

  const expectedEmail = adminEmail.trim().toLowerCase();
  const expectedPhone = adminPhone.replace(/\D/g, "").slice(-10);

  if (normalizedEmail !== expectedEmail || normalizedPhone !== expectedPhone) {
    return { success: false, error: "Invalid credentials. Access denied." };
  }

  // Generate session token and set cookie
  const token = generateToken();
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return { success: true };
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function verifyAdminSession(): Promise<{ isAdmin: boolean }> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return { isAdmin: false };
  }

  return { isAdmin: isValidToken(sessionCookie.value) };
}
