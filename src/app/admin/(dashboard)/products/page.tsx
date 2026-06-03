import { getAllProducts, getAllCategories } from "@/actions/adminData";
import AddProductModal from "@/components/admin/AddProductModal";
import { AlertTriangle, CheckCircle } from "lucide-react";
import Image from "next/image";

export const revalidate = 0; // Disable static rendering for admin data pages

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        color: "#fff1f2", // Rose
        text: "#be123c",
        border: "#fecdd3",
        icon: AlertTriangle,
      };
    }
    if (stock <= 10) {
      return {
        label: "Low Stock",
        color: "#fffbeb", // Amber
        text: "#b45309",
        border: "#fde68a",
        icon: AlertTriangle,
      };
    }
    return {
      label: "In Stock",
      color: "var(--color-forest-50)", // Forest Green
      text: "var(--color-forest-700)",
      border: "var(--color-forest-200)",
      icon: CheckCircle,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Product Inventory
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Check active oil variants in database records, monitor remaining quantities, and review prices.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm whitespace-nowrap">
            {products.length} Products
          </div>
          <AddProductModal categories={categories} />
        </div>
      </div>

      {/* Table section */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "white",
          borderColor: "var(--color-forest-200)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="overflow-x-auto">
          {products.length > 0 ? (
            <table className="w-full text-left border-collapse text-sm min-w-[650px]">
              <thead>
                <tr
                  className="border-b font-semibold"
                  style={{
                    borderColor: "var(--color-forest-100)",
                    background: "var(--color-forest-50)",
                    color: "var(--color-forest-700)",
                  }}
                >
                  <th className="p-4 pl-6 text-xs uppercase tracking-wider">Product Info</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Slug</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Price</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Stock Level</th>
                  <th className="p-4 pr-6 text-xs uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
                {products.map((product: any) => {
                  const status = getStockStatus(product.stock);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-forest-50/30 text-stone-600 transition-colors border-b"
                      style={{ borderColor: "var(--color-stone-100)" }}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-50 flex items-center justify-center shrink-0 border"
                            style={{ borderColor: "var(--color-forest-200)" }}
                          >
                            <Image
                              src={product.images[0] || "/products/placeholder.jpg"}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 text-sm block">
                              {product.name}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex text-[9px] font-bold uppercase tracking-wider mt-1"
                                style={{ color: "var(--color-amber-600)" }}
                              >
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-stone-500 font-medium">{product.slug}</td>
                      <td className="p-4 font-medium">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: "var(--color-cream-100)",
                            color: "var(--color-stone-700)",
                          }}
                        >
                          {product.categoryName}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-stone-900">₹{product.price}</div>
                        {product.discountPrice && (
                          <div className="text-xs font-medium" style={{ color: "var(--color-forest-600)" }}>
                            Sale: ₹{product.discountPrice}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-stone-900">{product.stock} units</td>
                      <td className="p-4 pr-6 text-right">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: status.color,
                            color: status.text,
                            borderColor: status.border,
                          }}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-stone-500 font-medium space-y-3">
              <p>No products yet.</p>
              <p className="text-sm text-stone-400">
                Use <strong className="text-stone-600">Add Product</strong> above to
                create your first listing—it will appear on the shop automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
