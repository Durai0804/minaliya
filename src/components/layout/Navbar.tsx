"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { allProducts } from "@/data/products";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronRight,
  Phone,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Subscription", href: "/subscription" },
  { name: "About", href: "/about" },
  { name: "Benefits", href: "/benefits" },
  { name: "Our Process", href: "/about#process" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const { isAuthenticated, openLoginModal } = useAuth();
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/account");
    } else {
      openLoginModal();
    }
  };

  const filteredProducts = searchQuery.trim() === ""
    ? []
    : allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // Close search on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header
        id="navbar"
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(219, 86, 86, 0.98)"
            : "rgba(219, 86, 86, 0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-soft)" : "none",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="Minaliya Home"
            >
              <Image
                src="/logo.png"
                alt="Minaliya Logo"
                width={160}
                height={54}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-white/10 text-white/90 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (!searchOpen) setSearchQuery("");
                }}
                className="p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link
                href="/wishlist"
                className="hidden sm:flex relative p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistTotal > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: "white", color: "#8B1C1C" }}
                  >
                    {wishlistTotal}
                  </span>
                )}
              </Link>
              <button
                onClick={handleProfileClick}
                className="hidden sm:flex p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Account"
              >
                <User size={20} />
              </button>
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full transition-colors hover:bg-white/10 text-white/90 hover:text-white"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                <span
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: "white", color: "#8B1C1C" }}
                >
                  {totalItems}
                </span>
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-full transition-colors hover:bg-white/10 ml-1 text-white/90 hover:text-white"
                aria-label="Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </nav>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div
            className="border-t px-4 py-6 animate-fade-in"
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              background: "rgba(219, 86, 86, 0.98)",
            }}
          >
            <div className="max-w-3xl mx-auto relative">
              <div className="relative mb-4">
                <Search
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for cold pressed oils (e.g. coconut, groundnut)..."
                  className="w-full pl-14 pr-12 py-4 rounded-2xl border-0 text-base outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-white/50"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div 
                  className="rounded-2xl overflow-hidden shadow-2xl border animate-fade-in-up"
                  style={{ 
                    background: "white",
                    borderColor: "var(--color-stone-200)"
                  }}
                >
                  {filteredProducts.length > 0 ? (
                    <div className="divide-y" style={{ borderColor: "var(--color-stone-100)" }}>
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.slug}
                          href={`/shop/${product.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors group"
                        >
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "var(--color-cream-100)" }}
                          >
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              width={40} 
                              height={40} 
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-stone-800 group-hover:text-forest-700 transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-stone-400">{product.category} • {product.sizes[0]}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-stone-900">₹{product.price}</p>
                            <ChevronRight size={14} className="ml-auto text-stone-300" />
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/shop?q=${searchQuery}`}
                        onClick={() => setSearchOpen(false)}
                        className="block p-4 text-center text-sm font-bold text-forest-600 hover:bg-forest-50 transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </Link>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-stone-500">
                        No products found for "<span className="font-bold text-stone-800">{searchQuery}</span>"
                      </p>
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-forest-600 font-bold mt-2 hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] shadow-2xl flex flex-col"
            style={{ background: "var(--color-cream-50)" }}
          >
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-6 py-3.5 text-base font-medium transition-colors hover:bg-stone-100"
                  style={{ color: "var(--color-stone-700)" }}
                >
                  {link.name}
                  <ChevronRight size={16} style={{ color: "var(--color-stone-400)" }} />
                </Link>
              ))}
            </nav>
            <div
              className="p-5 border-t space-y-3"
              style={{ borderColor: "var(--color-stone-200)" }}
            >
              <button
                onClick={(e) => {
                  setMobileOpen(false);
                  handleProfileClick(e);
                }}
                className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg hover:bg-stone-100 text-sm font-medium"
                style={{ color: "var(--color-stone-700)" }}
              >
                <User size={18} /> My Account
              </button>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-stone-100 text-sm font-medium"
                style={{ color: "var(--color-stone-700)" }}
              >
                <Heart size={18} /> Wishlist
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full justify-center text-sm"
              >
                <Phone size={16} /> WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
