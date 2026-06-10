import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import LoginModal from "@/components/auth/LoginModal";
import ChatBot from "@/components/common/ChatBot";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Minaliya - Pure Wooden Cold Pressed Oils | Mara Chekku Oil Chennai",
    template: "%s | Minaliya Cold Pressed Oils",
  },
  description:
    "Minaliya offers 100% pure wooden cold pressed oils (Mara Chekku). Traditional extraction, chemical-free groundnut oil, coconut oil & sesame oil. Order online from Chennai.",
  keywords: [
    "cold pressed oil Chennai",
    "mara chekku oil",
    "wooden cold pressed oil",
    "pure groundnut oil",
    "cold pressed sesame oil",
    "healthy cooking oil India",
    "natural edible oil",
    "chemical free oil",
    "traditional oil extraction",
    "wood pressed oil Chennai",
    "minaliya oils",
    "cold pressed coconut oil",
  ],
  authors: [{ name: "Minaliya" }],
  creator: "Minaliya",
  publisher: "Minaliya",
  metadataBase: new URL("https://minaliya.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://minaliya.com",
    siteName: "Minaliya",
    title: "Minaliya - Pure Wooden Cold Pressed Oils | Mara Chekku Oil",
    description:
      "100% pure wooden cold pressed oils. Traditional Mara Chekku extraction preserving natural nutrients. Groundnut, Coconut & Sesame oils. Order online.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Minaliya Pure Cold Pressed Oils",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minaliya - Pure Wooden Cold Pressed Oils",
    description:
      "Traditional Mara Chekku cold pressed oils. 100% chemical-free. Order online.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <meta name="theme-color" content="#1F4F1F" />
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Chennai" />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <OrderProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <CartDrawer />
                <LoginModal />
                <ChatBot />
              </CartProvider>
            </WishlistProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
