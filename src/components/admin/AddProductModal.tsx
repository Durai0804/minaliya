"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2, Leaf, Upload, Trash2, ImageIcon } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setCategoryId(categories[0]?.id ?? "");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setIsFeatured(false);
    setImageFiles([]);
    setImagePreviews([]);
    setUploadedUrls([]);
    setError("");
  };

  const handleNameBlur = () => {
    if (!slugTouched && name.trim()) {
      setSlug(slugify(name));
    }
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files?.length) return;

    const newFiles = Array.from(files);
    const total = imageFiles.length + newFiles.length;

    if (total > 4) {
      setError("You can upload a maximum of 4 images.");
      return;
    }

    setImageFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
    setUploadedUrls([]);
  }, [imageFiles.length]);

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedUrls([]);
  };

  const uploadImages = async (): Promise<string[] | null> => {
    if (uploadedUrls.length > 0) return uploadedUrls;

    setUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { urls } = await res.json();
      setUploadedUrls(urls);
      return urls;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!imageFiles.length) {
      setError("Please select at least one product image.");
      return;
    }

    setLoading(true);

    const urls = await uploadImages();
    if (!urls) {
      setLoading(false);
      return;
    }

    try {
      const result = await createProduct({
        name,
        slug: slug || slugify(name),
        description,
        categoryId,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: 100,
        images: urls,
        isFeatured,
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

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
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !loading && !uploading && setOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-2xl rounded-3xl border shadow-2xl"
            style={{
              background: "white",
              borderColor: "var(--color-stone-200)",
            }}
          >
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-3xl"
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
                onClick={() => !loading && !uploading && setOpen(false)}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                    Price (₹) *
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
                    Discount Price (₹)
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
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Product Images * (1-4 images)
                </label>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:bg-stone-50/50"
                  style={{
                    borderColor: "var(--color-stone-300)",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--color-forest-50)",
                        color: "var(--color-forest-600)",
                      }}
                    >
                      <Upload size={22} />
                    </div>
                    <p className="text-sm font-medium text-stone-600">
                      Drop images here or click to browse
                    </p>
                    <p className="text-xs text-stone-400">
                      PNG, JPG, WebP (max 4 images)
                    </p>
                  </div>
                </div>

                {/* Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    {imagePreviews.map((preview, i) => (
                      <div
                        key={i}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-forest-600 text-white">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}

                    {imagePreviews.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 transition-colors"
                      >
                        <Plus size={24} />
                      </button>
                    )}
                  </div>
                )}
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
                  disabled={loading || uploading}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading || categories.length === 0}
                  className="flex-1 btn-primary justify-center py-3 rounded-xl disabled:opacity-70"
                >
                  {loading || uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {uploading ? "Uploading..." : "Creating..."}
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
        </div>
      )}
    </>
  );
}
