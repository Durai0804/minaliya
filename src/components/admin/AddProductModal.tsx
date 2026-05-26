"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2, Leaf } from "lucide-react";
import { createProduct } from "@/actions/adminData";
import { slugify } from "@/lib/product-utils";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AddProductModalProps {
  categories: CategoryOption[];
}

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border border-stone-200 bg-white text-stone-800 focus:border-forest-400 focus:ring-2 focus:ring-forest-50";

export default function AddProductModal({ categories }: AddProductModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [extraImagePaths, setExtraImagePaths] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [extractionMethod, setExtractionMethod] = useState(
    "Wooden Cold Pressed (Mara Chekku)"
  );
  const [origin, setOrigin] = useState("Tamil Nadu, India");
  const [shelfLife, setShelfLife] = useState("6 Months");

  const resetForm = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setCategoryId(categories[0]?.id ?? "");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setStock("");
    setImagePath("");
    setExtraImagePaths("");
    setIsFeatured(false);
    setExtractionMethod("Wooden Cold Pressed (Mara Chekku)");
    setOrigin("Tamil Nadu, India");
    setShelfLife("6 Months");
    setError("");
  };

  const handleNameBlur = () => {
    if (!slugTouched && name.trim()) {
      setSlug(slugify(name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createProduct({
        name,
        slug: slug || slugify(name),
        description,
        categoryId,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock, 10),
        imagePath,
        extraImagePaths: extraImagePaths
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        isFeatured,
        extractionMethod,
        origin,
        shelfLife,
      });

      if (result.success) {
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        setError(result.error || "Failed to create product.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl shadow-sm"
        disabled={categories.length === 0}
      >
        <Plus size={18} />
        Add Product
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !loading && setOpen(false)}
          />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl"
            style={{
              background: "white",
              borderColor: "var(--color-stone-200)",
            }}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--color-forest-50)",
                    color: "var(--color-forest-600)",
                  }}
                >
                  <Leaf size={20} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-stone-900"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Add New Product
                  </h2>
                  <p className="text-xs text-stone-500">
                    Saved to database and visible on the shop page
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {categories.length === 0 && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  No categories in the database. Run the Prisma seed script first.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    className={inputClass}
                    placeholder="Cold Pressed Groundnut Oil (1 Ltr)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Slug *
                  </label>
                  <input
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    className={`${inputClass} font-mono text-xs`}
                    placeholder="groundnut-oil-1ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={inputClass}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                  placeholder="Short product description for the shop page"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    MRP (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputClass}
                    placeholder="449"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className={inputClass}
                    placeholder="349"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Stock *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className={inputClass}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Primary Image Path *
                </label>
                <input
                  required
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  className={`${inputClass} font-mono text-xs`}
                  placeholder="/products/Groundnut Oil 1 Ltr.jpg"
                />
                <p className="text-[11px] text-stone-400 mt-1.5">
                  Place the image file in{" "}
                  <code className="text-stone-600">public/products/</code>, then
                  enter the path starting with /products/
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Extra Image Paths (optional)
                </label>
                <input
                  value={extraImagePaths}
                  onChange={(e) => setExtraImagePaths(e.target.value)}
                  className={`${inputClass} font-mono text-xs`}
                  placeholder="/products/extra.jpg, /products/extra2.jpg"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-stone-300 text-forest-600 focus:ring-forest-500"
                />
                <span className="text-sm font-medium text-stone-700">
                  Featured product (shows badge on shop)
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Extraction Method
                  </label>
                  <input
                    value={extractionMethod}
                    onChange={(e) => setExtractionMethod(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Origin
                  </label>
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Shelf Life
                  </label>
                  <input
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || categories.length === 0}
                  className="flex-1 btn-primary justify-center py-3 rounded-xl disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
