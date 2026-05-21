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
        color: "rgba(244, 63, 94, 0.1)", // Rose
        text: "#fb7185",
        border: "rgba(244, 63, 94, 0.2)",
        icon: AlertTriangle,
      };
    }
    if (stock <= 10) {
      return {
        label: "Low Stock",
        color: "rgba(245, 158, 11, 0.1)", // Amber
        text: "#fbbf24",
        border: "rgba(245, 158, 11, 0.2)",
        icon: AlertTriangle,
      };
    }
    return {
      label: "In Stock",
      color: "rgba(16, 185, 129, 0.1)", // Emerald
      text: "#34d399",
      border: "rgba(16, 185, 129, 0.2)",
      icon: CheckCircle,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Product Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Check active oil variants in database records, monitor remaining quantities, and review prices.
          </p>
        </div>
        <div className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {products.length} Products Defined
        </div>
      </div>

      {/* Table section */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(30, 41, 59, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="overflow-x-auto">
          {products.length > 0 ? (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr
                  className="border-b text-slate-400 font-semibold"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.05)",
                    background: "rgba(15, 23, 42, 0.2)",
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
              <tbody className="divide-y" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}>
                {products.map((product: any) => {
                  const status = getStockStatus(product.stock);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/10 text-slate-300 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-850 flex items-center justify-center shrink-0 border border-slate-800">
                            <Image
                              src={product.images[0] || "/products/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-white text-sm block">
                              {product.name}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex text-[9px] font-bold uppercase tracking-wider text-amber-400 mt-1">
                                ⭐ Featured Item
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-indigo-400">{product.slug}</td>
                      <td className="p-4 font-medium text-white">{product.categoryName}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">₹{product.price}</div>
                        {product.discountPrice && (
                          <div className="text-xs text-rose-400 line-through">
                            ₹{product.discountPrice}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-white">{product.stock} units</td>
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
            <div className="p-12 text-center text-slate-500">
              No products found in the database. Add them in Prisma to track inventory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
