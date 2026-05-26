"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminCredentialsMatch } from "@/lib/auth-utils";

const COOKIE_NAME = "minaliya-admin-session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    return null;
  }
  return secret || "fallback-secret";
}

function generateToken(): string {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  const raw = `${secret}:${timestamp}:${random}`;
  return Buffer.from(raw).toString("base64");
}

function isValidToken(token: string): boolean {
  try {
    const secret = getAdminSecret();
    if (!secret) return false;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
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
    console.error("ADMIN_EMAIL and ADMIN_PHONE must be set in environment variables.");
    return {
      success: false,
      error: "Admin login is not configured. Contact the site administrator.",
    };
  }

  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SECRET) {
    console.error("ADMIN_SECRET must be set in production.");
    return {
      success: false,
      error: "Admin login is not configured. Contact the site administrator.",
    };
  }

  if (!isAdminCredentialsMatch(email, phone, adminEmail, adminPhone)) {
    return { success: false, error: "Invalid credentials. Access denied." };
  }

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

  if (!sessionCookie?.value) {
    return { isAdmin: false };
  }

  return { isAdmin: isValidToken(sessionCookie.value) };
}
