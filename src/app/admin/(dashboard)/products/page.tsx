import { getAllProducts } from "@/actions/adminData";
import { Leaf, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import Image from "next/image";

export const revalidate = 0; // Disable static rendering for admin data pages

export default async function AdminProductsPage() {
  const products = await getAllProducts();

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: "var(--font-heading)" }}>
            Product Inventory
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Check active oil variants in database records, monitor remaining quantities, and review prices.
          </p>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-full bg-forest-50 text-forest-700 border border-forest-200 shadow-sm">
          {products.length} Products Defined
        </div>
      </div>

      {/* Table section */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "white",
          borderColor: "var(--color-stone-200)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="overflow-x-auto">
          {products.length > 0 ? (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr
                  className="border-b text-stone-500 font-semibold"
                  style={{
                    borderColor: "var(--color-stone-100)",
                    background: "var(--color-stone-50)",
                  }}
                >
                  <th className="p-4 pl-6 text-xs uppercase tracking-wider">Product Info</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Slug</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Price (Retail)</th>
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
                      className="hover:bg-stone-50/50 text-stone-600 transition-colors border-b"
                      style={{ borderColor: "var(--color-stone-100)" }}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-50 flex items-center justify-center shrink-0 border border-stone-200">
                            <Image
                              src={product.images[0] || "/products/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 text-sm block">
                              {product.name}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex text-[9px] font-bold uppercase tracking-wider text-amber-600 mt-1">
                                ⭐ Featured Item
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-stone-500 font-medium">{product.slug}</td>
                      <td className="p-4 font-medium text-stone-700">{product.categoryName}</td>
                      <td className="p-4">
                        <div className="font-semibold text-stone-900">₹{product.price}</div>
                        {product.discountPrice && (
                          <div className="text-xs text-stone-400 line-through">
                            ₹{product.discountPrice}
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
            <div className="p-12 text-center text-stone-500 font-medium">
              No products found in the database. Add them in Prisma to track inventory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
