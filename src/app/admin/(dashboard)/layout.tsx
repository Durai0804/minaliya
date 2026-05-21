import { verifyAdminSession } from "@/actions/admin";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | Minaliya",
  description: "Secure administration panel for Minaliya Pure Wooden Cold Pressed Oils.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await verifyAdminSession();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
