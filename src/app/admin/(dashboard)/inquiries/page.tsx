import { getAllInquiries } from "@/actions/adminData";
import InquiriesTable from "@/components/admin/InquiriesTable";

export const revalidate = 0; // Disable static rendering for admin data pages

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Bulk Inquiries
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Review corporate partnership requests, customized bulk pricing quotations, and supply-chain inquiries.
          </p>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm">
          {inquiries.length} Bulk Requests
        </div>
      </div>

      {/* Inquiries list table */}
      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
