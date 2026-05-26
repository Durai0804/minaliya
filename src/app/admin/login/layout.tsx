import { verifyAdminSession } from "@/actions/admin";
import { redirect } from "next/navigation";

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await verifyAdminSession();
  if (isAdmin) {
    redirect("/admin");
  }
  return children;
}
