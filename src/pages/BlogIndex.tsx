import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/card";
import { getAllPosts } from "@/data/blogData";

const ORIGIN = "https://www.smartkitnow.com";

export default function BlogIndex() {
  const posts = getAllPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Smart Kit Now Blog",
    description:
      "Practical guides and explainers on money, health, home projects, and everyday math — each linked to a free calculator.",
    url: `${ORIGIN}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      author: { "@type": "Organization", name: p.author },
      url: `${ORIGIN}/blog/${p.slug}`,
    })),
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog — Guides & Explainers | Smart Kit Now"
        description="Practical, plain-English guides on money, health, home projects, and everyday math — each paired with a free calculator to run the numbers yourself."
        canonical={`${ORIGIN}/blog`}
      />
      <JsonLd data={blogJsonLd} />
      <main className="pt-48 sm:pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">
                The Smart Kit Now Blog
              </h1>
              <p className="text-lg max-w-3xl text-slate-600 dark:text-slate-300">
                Plain-English guides on money, health, home projects, and everyday math — each one
                paired with a free calculator so you can run the numbers yourself.
              </p>
            </div>
          }
        >
          <div className="grid gap-6 mb-16 sm:grid-cols-2">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="p-6 flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingMinutes} min read
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
                >
                  Read the guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </AdRailLayout>
      </main>
    </div>
  );
}
