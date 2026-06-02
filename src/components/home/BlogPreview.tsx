import { ArrowRight, Clock } from "lucide-react";

const posts = [
  {
    title: "5 Amazing Benefits of Cold Pressed Groundnut Oil",
    excerpt:
      "Discover why cold pressed groundnut oil is the healthiest choice for Indian cooking and how it preserves essential nutrients.",
    category: "Health & Nutrition",
    readTime: "5 min read",
    slug: "benefits-cold-pressed-groundnut-oil",
  },
  {
    title: "Refined Oil vs Cold Pressed Oil: The Complete Guide",
    excerpt:
      "A detailed comparison of refined and cold pressed oils — understand what goes into your cooking oil and make an informed choice.",
    category: "Education",
    readTime: "7 min read",
    slug: "refined-vs-cold-pressed-oil",
  },
  {
    title: "The Ancient Art of Mara Chekku Oil Extraction",
    excerpt:
      "Learn about the traditional Tamil Nadu method of wooden cold pressing that has been used for centuries to extract pure oil.",
    category: "Tradition",
    readTime: "4 min read",
    slug: "mara-chekku-oil-extraction",
  },
];

export default function BlogPreview() {
  return (
    <section
      id="blog"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-3">
            <div className="divider-leaf" />
            <h2 className="section-title">From Our Journal</h2>
            <p
              className="text-base max-w-md"
              style={{ color: "var(--color-stone-500)" }}
            >
              Insights on traditional oils, healthy cooking, and wellness
              from the Minaliya team.
            </p>
          </div>
          <a
            href="/blog"
            className="btn-secondary text-sm shrink-0 w-full sm:w-auto justify-center"
          >
            View All Articles
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <article
              key={i}
              className="group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{
                background: "var(--color-cream-50)",
                border: "1px solid var(--color-stone-200)",
              }}
            >
              {/* Gradient Image Placeholder */}
              <div
                className="h-48 relative"
                style={{
                  background: [
                    "linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-cream-200) 100%)",
                    "linear-gradient(135deg, var(--color-amber-100) 0%, var(--color-cream-200) 100%)",
                    "linear-gradient(135deg, var(--color-wood-100) 0%, var(--color-cream-200) 100%)",
                  ][i],
                }}
              >
                <div
                  className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "var(--color-forest-600)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3
                  className="text-lg font-semibold leading-snug group-hover:underline decoration-1 underline-offset-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-stone-800)",
                  }}
                >
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {post.excerpt}
                </p>
                <div
                  className="flex items-center gap-1.5 text-xs font-medium pt-1"
                  style={{ color: "var(--color-stone-400)" }}
                >
                  <Clock size={13} />
                  {post.readTime}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
