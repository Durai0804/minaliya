require("dotenv").config();
const ws = require("ws");
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

// Polyfill WebSocket globally for Neon serverless in Node.js
globalThis.WebSocket = ws;

// Instantiate PrismaClient by passing the Pool config directly to PrismaNeon factory
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categoriesData = [
  {
    name: "Groundnut",
    slug: "groundnut",
    description: "Pure wooden cold-pressed groundnut oils, rich in Vitamin E and antioxidants.",
  },
  {
    name: "Coconut",
    slug: "coconut",
    description: "100% natural, unrefined wood-pressed coconut oils for cooking, hair, and skin.",
  },
  {
    name: "Sesame",
    slug: "sesame",
    description: "Traditional Mara Chekku gingelly oils with authentic flavor and health benefits.",
  },
];

const productsData = [
  {
    name: "Cold Pressed Groundnut Oil (1 Ltr)",
    slug: "groundnut-oil",
    description: "Traditional Mara Chekku extracted groundnut oil, rich in Vitamin E and healthy fats.",
    price: 449.00,
    discountPrice: 349.00,
    stock: 150,
    images: [
      "/products/Groundnut Oil 1 Ltr.jpg",
      "/products/Groundnut Oil 500 ml.jpg",
      "/products/groundnut-bg-removed.png"
    ],
    isFeatured: true,
    categorySlug: "groundnut",
    specifications: {
      "Extraction Method": "Wooden Cold Pressed (Mara Chekku)",
      "Origin": "Tamil Nadu, India",
      "Ingredients": "Premium Quality Groundnuts",
      "Shelf Life": "6 Months",
    },
  },
  {
    name: "Cold Pressed Coconut Oil (1 Ltr)",
    slug: "coconut-oil",
    description: "Pure virgin coconut oil for cooking, skin care, and hair care.",
    price: 499.00,
    discountPrice: 399.00,
    stock: 120,
    images: [
      "/products/Coconut Oil 1 Ltr.jpg",
      "/products/Coconut Oil 500 ml.jpg",
      "/products/coconut-bg-removed.png"
    ],
    isFeatured: true,
    categorySlug: "coconut",
    specifications: {
      "Extraction Method": "Wooden Cold Pressed (Mara Chekku)",
      "Origin": "Tamil Nadu, India",
      "Ingredients": "Sun-dried Coconuts (Copra)",
      "Shelf Life": "12 Months",
    },
  },
  {
    name: "Cold Pressed Sesame Oil (1 Ltr)",
    slug: "sesame-oil",
    description: "Authentic gingelly oil perfect for South Indian cooking and Ayurvedic wellness.",
    price: 479.00,
    discountPrice: 379.00,
    stock: 100,
    images: [
      "/products/Sesame Oil 1 Ltr.jpg",
      "/products/Sesame Oil 500 ml.jpg",
      "/products/sesame-bg-removed.png"
    ],
    isFeatured: true,
    categorySlug: "sesame",
    specifications: {
      "Extraction Method": "Wooden Cold Pressed (Mara Chekku)",
      "Origin": "Tamil Nadu, India",
      "Ingredients": "Premium Sesame Seeds, Palm Jaggery",
      "Shelf Life": "6 Months",
    },
  },
  {
    name: "Cold Pressed Groundnut Oil (500ml)",
    slug: "groundnut-oil-500ml",
    description: "Compact 500ml bottle of our bestselling groundnut oil for smaller households.",
    price: 259.00,
    discountPrice: 199.00,
    stock: 200,
    images: [
      "/products/Groundnut Oil 500 ml.jpg",
      "/products/groundnut-bg-removed.png"
    ],
    isFeatured: false,
    categorySlug: "groundnut",
    specifications: {
      "Extraction Method": "Wooden Cold Pressed (Mara Chekku)",
      "Origin": "Tamil Nadu, India",
      "Ingredients": "Premium Quality Groundnuts",
      "Shelf Life": "6 Months",
    },
  },
  {
    name: "Cold Pressed Coconut Oil (500ml)",
    slug: "coconut-oil-500ml",
    description: "Trial-sized virgin coconut oil. Perfect to experience the Minaliya difference.",
    price: 299.00,
    discountPrice: 229.00,
    stock: 180,
    images: [
      "/products/Coconut Oil 500 ml.jpg",
      "/products/coconut-bg-removed.png"
    ],
    isFeatured: false,
    categorySlug: "coconut",
    specifications: {
      "Extraction Method": "Wooden Cold Pressed (Mara Chekku)",
      "Origin": "Tamil Nadu, India",
      "Ingredients": "Sun-dried Coconuts (Copra)",
      "Shelf Life": "12 Months",
    },
  },
  {
    name: "Cold Pressed Sesame Oil (500ml)",
    slug: "sesame-oil-500ml",
    description: "Compact pack of our pure gingelly oil. Great for regular cooking use.",
    price: 269.00,
    discountPrice: 209.00,
    stock: 150,
    images: [
      "/products/Sesame Oil 500 ml.jpg",
      "/products/sesame-bg-removed.png"
    ],
    isFeatured: false,
    categorySlug: "sesame",
    specifications: {
      "Extraction Method": "Wooden Cold Pressed (Mara Chekku)",
      "Origin": "Tamil Nadu, India",
      "Ingredients": "Premium Sesame Seeds, Palm Jaggery",
      "Shelf Life": "6 Months",
    },
  },
];

async function main() {
  console.log("🌱 Starting seeding...");

  // 1. Create categories and keep track of their IDs
  const categories = {};
  for (const cat of categoriesData) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categories[cat.slug] = upserted.id;
    console.log(`📁 Upserted category: ${upserted.name}`);
  }

  // 2. Create products
  for (const prod of productsData) {
    const categoryId = categories[prod.categorySlug];
    if (!categoryId) {
      console.error(`⚠️ Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const upserted = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice,
        stock: prod.stock,
        images: prod.images,
        isFeatured: prod.isFeatured,
        categoryId: categoryId,
        specifications: prod.specifications,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice,
        stock: prod.stock,
        images: prod.images,
        isFeatured: prod.isFeatured,
        categoryId: categoryId,
        specifications: prod.specifications,
      },
    });
    console.log(`🛍️ Upserted product: ${upserted.name}`);
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
