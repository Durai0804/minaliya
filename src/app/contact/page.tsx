import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Minaliya for orders, queries, or feedback. WhatsApp, call, or email us. Based in Chennai, Tamil Nadu.",
  alternates: { canonical: "/contact" },
};

const contactInfo = [
  {
    icon: <MapPin size={22} />,
    title: "Visit Us",
    lines: ["Shop No. 3, Kodambakkam Road, West Mambalam,", "Chennai, Tamil Nadu - 600033"],
  },
  {
    icon: <Phone size={22} />,
    title: "Call Us",
    lines: ["+91 98765 43210"],
    href: "tel:+919876543210",
  },
  {
    icon: <Mail size={22} />,
    title: "Email Us",
    lines: ["hello@minaliya.com"],
    href: "mailto:hello@minaliya.com",
  },
  {
    icon: <Clock size={22} />,
    title: "Working Hours",
    lines: ["Mon–Sat: 9:00 AM – 8:00 PM", "Sunday: Closed"],
  },
];

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main id="main-content">
        {/* ─── Hero ─── */}
        <section
          className="relative overflow-hidden py-20 sm:py-28"
          style={{
            background:
              "linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-amber-50) 50%, var(--color-cream-200) 100%)",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "var(--color-amber-300)", filter: "blur(80px)" }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="divider-leaf mx-auto mb-6" />
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-stone-900)",
              }}
            >
              Get in <span className="italic font-normal">Touch</span>
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-stone-500)" }}
            >
              Have a question about our oils, need help with an order, or want to
              place a bulk enquiry? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* ─── Contact Content ─── */}
        <section className="section-padding" style={{ background: "var(--color-cream-50)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
              {/* Left: Contact Info */}
              <div className="space-y-6">
                {/* Contact Cards */}
                {contactInfo.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-md"
                    style={{
                      background: "white",
                      border: "1px solid var(--color-stone-200)",
                    }}
                  >
                    <div
                      className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "var(--color-forest-50)",
                        color: "var(--color-forest-500)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--color-stone-800)" }}
                      >
                        {item.title}
                      </h3>
                      {item.lines.map((line, j) =>
                        item.href ? (
                          <a
                            key={j}
                            href={item.href}
                            className="block text-sm hover:underline"
                            style={{ color: "var(--color-stone-500)" }}
                          >
                            {line}
                          </a>
                        ) : (
                          <p
                            key={j}
                            className="text-sm"
                            style={{ color: "var(--color-stone-500)" }}
                          >
                            {line}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* WhatsApp Quick CTA */}
                <a
                  href="https://wa.me/919876543210?text=Hi%20Minaliya!%20I%20have%20a%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: "#25D366", color: "white" }}
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>

                {/* Live Google Map Embed */}
                <div
                  className="rounded-2xl overflow-hidden h-64 shadow-soft transition-all duration-300 hover:shadow-md"
                  style={{
                    border: "1px solid var(--color-stone-200)",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.9942630650953!2d80.21720617596043!3d13.028396790938479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267bd843cc565%3A0xc6643dfa200839ed!2sMinaliya%20Wooden%20Cold%20Pressed%20Oils%20-%20Best%20Marachekku%20Oil%20Manufacturer%20in%20Chennai!5e0!3m2!1sen!2sin!4v1716142055610!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Minaliya Wooden Cold Pressed Oils Shop Location"
                  ></iframe>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="lg:col-span-2">
                <div
                  className="p-8 sm:p-10 rounded-2xl"
                  style={{
                    background: "white",
                    border: "1px solid var(--color-stone-200)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-stone-800)",
                    }}
                  >
                    Send Us a Message
                  </h2>
                  <p
                    className="text-sm mb-8"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    Fill out the form and we&apos;ll get back to you within 24 hours.
                  </p>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
