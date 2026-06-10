import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping and delivery information for Minaliya orders across India.",
  alternates: { canonical: "/policies/shipping" },
};

export default function ShippingPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        <section className="py-16 sm:py-24" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-12 border-b pb-8" style={{ borderColor: "var(--color-stone-200)" }}>
              <h1
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-stone-900)" }}
              >
                Shipping Policy
              </h1>
              <p className="text-sm font-medium" style={{ color: "var(--color-stone-500)" }}>
                Last Updated: May 15, 2026
              </p>
            </header>

            <div className="prose prose-stone max-w-none prose-headings:font-heading prose-headings:text-stone-800 prose-p:text-stone-600 prose-li:text-stone-600">
              <p>
                We deliver our freshly pressed oils all across India. Our goal is to ensure your order reaches you safely and as quickly as possible.
              </p>

              <h2>Processing Time</h2>
              <p>
                All orders are processed within 1-2 business days. Orders are not shipped or delivered on Sundays or public holidays.
              </p>
              <p>
                Because we extract our oils in small batches to ensure freshness, occasionally there might be a slight delay. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
              </p>

              <h2>Shipping Rates & Delivery Estimates</h2>
              <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
              <ul>
                <li><strong>Free Shipping</strong> to Tamil Nadu, Kerala, Karnataka, Telangana &amp; Andhra Pradesh (on all orders)</li>
                <li><strong>Orders above ₹499:</strong> Free Standard Shipping (all India)</li>
                <li><strong>Orders below ₹499:</strong> Flat rate of ₹50</li>
              </ul>
              <p>
                <strong>Estimated Delivery Times:</strong>
              </p>
              <ul>
                <li>South India (Tamil Nadu, Karnataka, Kerala, AP, Telangana): 2-4 business days</li>
                <li>Rest of India: 4-7 business days</li>
              </ul>

              <h2>Packaging</h2>
              <p>
                We use high-quality, food-grade PET bottles that are carefully bubble-wrapped and packed in sturdy corrugated boxes to prevent any leakage or damage during transit.
              </p>

              <h2>Order Tracking</h2>
              <p>
                You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
              </p>

              <h2>Contact Us</h2>
              <p>
                For any queries related to shipping, please reach out to us at hello@minaliya.com.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
