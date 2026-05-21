import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/shop/ProductDetail";
import prisma from "@/lib/prisma";

const slugRedirects: Record<string, string> = {
  "groundnut-oil-500ml": "groundnut-oil",
  "coconut-oil-500ml": "coconut-oil",
  "sesame-oil-500ml": "sesame-oil",
};

interface ProductData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  images: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  sizes: { label: string; price: number; originalPrice: number; slug: string }[];
  category: string;
  benefits: string[];
  specifications: { label: string; value: string }[];
  usage: string[];
}

async function getProductBySlug(slug: string): Promise<ProductData | null> {
  const resolvedSlug = slugRedirects[slug] || slug;

  const dbProduct = await prisma.product.findUnique({
    where: { slug: resolvedSlug },
    include: { category: true },
  });

  if (!dbProduct) return null;

  // Get sibling products in the same category for sizes
  const siblings = await prisma.product.findMany({
    where: { categoryId: dbProduct.categoryId },
    orderBy: { price: "asc" },
  });

  const sizes = siblings.map((sib) => ({
    label: sib.slug.includes("500ml") ? "500ml" : "1 Ltr",
    price: sib.discountPrice ? Number(sib.discountPrice) : Number(sib.price),
    originalPrice: Number(sib.price),
    slug: sib.slug,
  }));

  // Define narrative rich content based on category
  const catSlug = dbProduct.category.slug;
  let tagline = "100% Pure Wooden Pressed Oil";
  let benefits: string[] = [];
  let usage: string[] = [];

  if (catSlug === "groundnut") {
    tagline = "The Heart of South Indian Cooking";
    benefits = [
      "Rich in Vitamin E and natural antioxidants",
      "High in heart-healthy monounsaturated fats",
      "Contains zero trans fats and no cholesterol",
      "Boosts immunity and improves digestion",
      "Ideal smoking point for Indian cooking methods",
      "100% chemical-free — no hexane, no bleaching",
    ];
    usage = [
      "Everyday cooking and deep frying",
      "Traditional South Indian dishes — dosa, sambar, rasam",
      "Seasoning and tempering (tadka)",
      "Baking and sweets preparation",
      "Salad dressings and marinades",
    ];
  } else if (catSlug === "coconut") {
    tagline = "Nature's Purest Gift";
    benefits = [
      "Rich in lauric acid — boosts immunity naturally",
      "Contains medium-chain triglycerides (MCTs) for energy",
      "Excellent natural moisturizer for skin and hair",
      "Supports healthy metabolism and weight management",
      "Anti-bacterial and anti-fungal properties",
      "100% virgin, unrefined, and chemical-free",
    ];
    usage = [
      "Kerala and South Indian cooking",
      "Hair oiling and scalp massage",
      "Natural skin moisturizer",
      "Oil pulling for oral health",
      "Baking as a butter substitute",
    ];
  } else if (catSlug === "sesame") {
    tagline = "The Heart of Tamil Cuisine";
    benefits = [
      "Rich in sesamol and sesamin — powerful antioxidants",
      "Supports bone health with natural calcium and zinc",
      "Anti-inflammatory properties for joint health",
      "Promotes heart health and lowers blood pressure",
      "Used in Ayurvedic oil massage (Abhyanga) for centuries",
      "100% pure — no blending, no chemical processing",
    ];
    usage = [
      "Traditional South Indian cooking and tempering",
      "Gingelly oil for Tamil festival dishes",
      "Ayurvedic body massage and oil pulling",
      "Salad dressings and cold preparations",
      "Baby massage oil (traditional practice)",
    ];
  }

  const specs = dbProduct.specifications
    ? Object.entries(dbProduct.specifications as Record<string, string>).map(([label, value]) => ({
        label,
        value,
      }))
    : [];

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    tagline,
    description: dbProduct.description,
    images: dbProduct.images,
    price: dbProduct.discountPrice ? Number(dbProduct.discountPrice) : Number(dbProduct.price),
    originalPrice: Number(dbProduct.price),
    rating: catSlug === "coconut" ? 4.8 : 4.9,
    reviews: catSlug === "coconut" ? 189 : catSlug === "sesame" ? 156 : 234,
    badge: dbProduct.isFeatured ? "Bestseller" : undefined,
    sizes,
    category: dbProduct.category.name,
    benefits,
    specifications: specs,
    usage,
  };
}


export async function generateStaticParams() {
  const dbProducts = await prisma.product.findMany({
    select: { slug: true },
  });

  return [
    ...dbProducts.map((p) => ({ slug: p.slug })),
    ...Object.keys(slugRedirects).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | Minaliya`,
      description: product.tagline,
      url: `https://minaliya.com/shop/${product.slug}`,
      images: [{ url: product.images[0], width: 600, height: 800 }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="section-padding text-center">
          <h1 className="section-title">Product Not Found</h1>
          <p className="section-subtitle mx-auto mt-4">
            Sorry, we couldn&apos;t find the product you&apos;re looking for.
          </p>
          <a href="/shop" className="btn-primary mt-8 inline-flex">
            Back to Shop
          </a>
        </main>
        <Footer />
      </>
    );
  }

  // Related products (all other main categories of oils)
  const dbRelated = await prisma.product.findMany({
    where: {
      slug: {
        in: ["groundnut-oil", "coconut-oil", "sesame-oil"],
        not: product.slug,
      },
    },
    include: { category: true },
  });

  const related = dbRelated.map((p) => ({
    name: p.name,
    slug: p.slug,
    tagline: p.slug.includes("coconut")
      ? "Nature's Purest Gift"
      : p.slug.includes("sesame")
      ? "The Heart of Tamil Cuisine"
      : "The Heart of South Indian Cooking",
    description: p.description,
    images: p.images,
    price: p.discountPrice ? Number(p.discountPrice) : Number(p.price),
    originalPrice: Number(p.price),
    rating: p.slug.includes("coconut") ? 4.8 : 4.9,
    reviews: p.slug.includes("coconut") ? 189 : p.slug.includes("sesame") ? 156 : 234,
    badge: p.isFeatured ? "Bestseller" : undefined,
    sizes: [
      { label: "500ml", price: p.slug.includes("coconut") ? 229 : p.slug.includes("sesame") ? 209 : 199, originalPrice: p.slug.includes("coconut") ? 299 : p.slug.includes("sesame") ? 269 : 259 },
      { label: "1 Ltr", price: p.discountPrice ? Number(p.discountPrice) : Number(p.price), originalPrice: Number(p.price) },
    ],
    category: p.category.name,
  }));

  /* JSON-LD */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `https://minaliya.com${product.images[0]}`,
    description: product.description.slice(0, 200),
    brand: { "@type": "Brand", name: "Minaliya" },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: Math.min(...product.sizes.map((s) => s.price)),
      highPrice: Math.max(...product.sizes.map((s) => s.price)),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      reviewCount: String(product.reviews),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Navbar />
      <main id="main-content">
        <ProductDetail product={product} related={related as any} />
      </main>
      <Footer />
    </>
  );
}
