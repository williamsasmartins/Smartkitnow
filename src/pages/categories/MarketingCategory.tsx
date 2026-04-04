import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

type Item = { name: string; slug: string };

const adPerformance: Item[] = [
  { name: "ROAS — Return on Ad Spend Calculator", slug: "roas" },
  { name: "Marketing ROI Calculator", slug: "marketing-roi" },
  { name: "Conversion Rate Calculator", slug: "conversion-rate" },
  { name: "Social Media Engagement Rate Calculator", slug: "social-media-engagement-rate" },
];

const customerEconomics: Item[] = [
  { name: "Customer Acquisition Cost (CAC) Calculator", slug: "customer-acquisition-cost" },
  { name: "Customer Lifetime Value (CLV) Calculator", slug: "customer-lifetime-value" },
  { name: "Churn Rate Calculator", slug: "churn-rate" },
];

const emailMarketing: Item[] = [
  { name: "Email Marketing ROI Calculator", slug: "email-marketing-roi" },
];

const TOTAL = adPerformance.length + customerEconomics.length + emailMarketing.length;

export default function MarketingCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Marketing Calculators"
        description="Explore essential marketing calculators for digital advertising, customer economics, and content performance. Calculate ROAS, ROI, CAC, LTV, and more."
        canonical="https://www.smartkitnow.com/marketing"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/marketing", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "marketing calculators, ROAS, ROI, CPM, CPA, CAC, LTV, churn rate, conversion rate, digital marketing tools, email marketing calculators" }]}
      />
      {/* offset below fixed header */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* Main content column */}
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="📈" size={38} className="text-primary" label="Marketing" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Marketing Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      {TOTAL} marketing calculators for advertising performance, customer economics, and email ROI — built for marketers, growth teams, and business owners who make data-driven decisions.
                    </p>
                    <p>
                      <strong>Ad Performance & ROI:</strong> Calculate ROAS to find your breakeven ad spend ratio, measure Marketing ROI across all channels, track conversion rate against industry benchmarks (1–3% e-commerce, 5–10% B2B), and measure social media engagement rate for Instagram, TikTok, LinkedIn, and Facebook.
                    </p>
                    <p>
                      <strong>Customer Economics:</strong> Determine Customer Acquisition Cost (CAC) by channel, estimate Customer Lifetime Value (CLV) using purchase frequency and lifespan, and calculate Churn Rate — the single most important retention metric for subscription businesses.
                    </p>
                    <p>
                      <strong>Email Marketing:</strong> Benchmark email campaign ROI against the industry average of 36–42× return per dollar spent and identify whether low performance is a list quality, segmentation, or attribution problem.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} marketing calculators covering ROAS, Marketing ROI, Conversion Rate, Social Media Engagement Rate, Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), Churn Rate, and Email Marketing ROI. Built with benchmarks and editorial context so you can act on the numbers.
                  </p>
                )}
                {!descExpanded && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                  >
                    Read More
                  </button>
                )}
              </div>
            </header>

            <Section
              emoji="🎯"
              title={`Ad Performance & ROI (${adPerformance.length})`}
              description="Calculate Return on Ad Spend (ROAS), Marketing ROI, conversion rate, and social media engagement to measure campaign efficiency."
              items={adPerformance}
              base="/marketing"
            />

            <Section
              emoji="👥"
              title={`Customer Economics (${customerEconomics.length})`}
              description="Analyze Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), and Churn Rate to evaluate growth sustainability."
              items={customerEconomics}
              base="/marketing"
            />

            <Section
              emoji="📧"
              title={`Email Marketing (${emailMarketing.length})`}
              description="Benchmark email campaign performance against the industry average of 36–42× ROI."
              items={emailMarketing}
              base="/marketing"
            />

            {/* bottom boxes: Share + Suggest */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          {/* Right rail column */}
          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({
  emoji,
  title,
  description,
  items,
  base,
}: {
  emoji: string;
  title: string;
  description: string;
  items: Item[];
  base: string;
}) {
  const [left, right] = splitTwoColumns(items);

  return (
    <section className="mb-12">
      {/* section heading with emoji */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      {/* two-column list */}
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
