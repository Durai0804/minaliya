import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubscriptionClient from "@/components/subscription/SubscriptionClient";

export const metadata: Metadata = {
  title: "Subscribe & Save — Monthly Oil Delivery",
  description:
    "Subscribe to Minaliya and never run out of pure cold pressed oils. Choose your plan — Monthly, Quarterly, or Annual — and enjoy free delivery, exclusive discounts, and guaranteed freshness.",
  alternates: { canonical: "/subscription" },
};

export default function SubscriptionPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content">
        <SubscriptionClient />
      </main>
      <Footer />
    </>
  );
}
