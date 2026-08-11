import { Link, useParams, Navigate } from "react-router-dom";
import { Clock, Calendar, ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import AdRailLayout from "@/components/layouts/AdRailLayout";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/card";
import { getPostBySlug, getRelatedPosts } from "@/data/blogData";

const ORIGIN = "https://www.smartkitnow.com";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams();

  if (!slug) return <Navigate to="/blog" replace />;

  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post.slug);
  const canonical = `${ORIGIN}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Smart Kit Now",
      url: ORIGIN,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: canonical,
  };

  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${post.seoTitle || post.title} | Smart Kit Now`}
        description={post.seoDescription || post.excerpt}
        canonical={canonical}
      />
      <JsonLd data={articleJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <main className="pt-48 sm:pt-20">
        <AdRailLayout
          titleBlock={
            <div className="text-left">
              <div className="mb-6">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-md text-white"
                  style={{ backgroundColor: "#3c83f6" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Articles
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingMinutes} min read
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">
                {post.title}
              </h1>
              <p className="text-lg max-w-3xl text-slate-600 dark:text-slate-300">{post.excerpt}</p>
            </div>
          }
        >
          <article className="space-y-8 mb-16">
            {/* Intro */}
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{post.intro}</p>

            {/* Body sections */}
            {post.sections.map((section, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {section.heading}
                </h2>
                {section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </section>
            ))}

            {/* Related calculators — the conversion hook */}
            {post.relatedCalculators.length > 0 && (
              <Card className="p-6 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20 border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-blue-500" />
                  Run the numbers yourself
                </h2>
                <ul className="space-y-3">
                  {post.relatedCalculators.map((calc) => (
                    <li key={calc.url}>
                      <Link
                        to={calc.url}
                        className="inline-flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span aria-hidden="true">{calc.icon ?? "🧮"}</span>
                        {calc.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="space-y-5">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                {post.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
                  >
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Related posts */}
            {related.length > 0 && (
              <section className="pt-4">
                <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
                  More from the blog
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((rp) => (
                    <Link
                      key={rp.slug}
                      to={`/blog/${rp.slug}`}
                      className="block p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                    >
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {rp.category}
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white mt-1">{rp.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </AdRailLayout>
      </main>
    </div>
  );
}
