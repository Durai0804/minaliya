import { MessageCircle, Phone } from "lucide-react";

export default function WhatsAppCTA() {
  return (
    <section
      id="whatsapp-cta"
      className="section-padding"
      style={{
        background:
          "linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 50%, var(--color-forest-800) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Emoji accent */}
        <div className="text-5xl mb-6">🌿</div>

        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-cream-100)",
          }}
        >
          Need Help Choosing <br className="hidden sm:block" />
          the Right Oil?
        </h2>

        <p
          className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--color-forest-200)" }}
        >
          Our team is here to help you find the perfect cold pressed oil for
          your cooking needs. Chat with us on WhatsApp or give us a call —
          we&apos;re always happy to help!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/917824807770?text=Hi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background: "#25D366",
              color: "white",
            }}
          >
            <MessageCircle size={20} />
            WhatsApp Order
          </a>
          <a
            href="tel:+917824807770"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "var(--color-cream-100)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Phone size={20} />
            Call Us Now
          </a>
        </div>

        {/* Trust line */}
        <p
          className="text-xs mt-8 font-medium uppercase tracking-wider"
          style={{ color: "var(--color-forest-300)" }}
        >
          Typically replies within 5 minutes · Available Mon-Sat, 9AM-8PM
        </p>
      </div>
    </section>
  );
}
