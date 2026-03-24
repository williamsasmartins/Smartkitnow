import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

type Item = { name: string; slug: string };

const digitalMarketing: Item[] = [
  { name: "ROAS (Return on Ad Spend) Calculator", slug: "roas-calculator" },
  { name: "ROI (Return on Investment) Calculator", slug: "roi-calculator" },
  { name: "CPM (Cost Per Mille/Thousand) Calculator", slug: "cpm-calculator" },
  { name: "CPA (Cost Per Acquisition) Calculator", slug: "cpa-calculator" },
  { name: "CTR (Click-Through Rate) Calculator", slug: "ctr-calculator" },
  { name: "CPC (Cost Per Click) Calculator", slug: "cpc-calculator" },
];

const customerEconomics: Item[] = [
  { name: "CAC (Customer Acquisition Cost) Calculator", slug: "cac-calculator" },
  { name: "LTV (Lifetime Value) Calculator", slug: "ltv-calculator" },
  { name: "LTV to CAC Ratio Calculator", slug: "ltv-to-cac-calculator" },
  { name: "Churn Rate Calculator", slug: "churn-rate-calculator" },
  { name: "Retention Rate Calculator", slug: "retention-rate-calculator" },
];

const emailAndContent: Item[] = [
  { name: "Email Open Rate Calculator", slug: "email-open-rate-calculator" },
  { name: "Email Conversion Rate Calculator", slug: "email-conversion-rate-calculator" },
  { name: "Lead Generation Conversion Estimator", slug: "lead-generation-conversion-estimator" },
  { name: "Content Marketing ROI Calculator", slug: "content-marketing-roi-calculator" },
];

const TOTAL = digitalMarketing.length + customerEconomics.length + emailAndContent.length;

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
                      Access {TOTAL} essential marketing calculators designed to help marketers, advertisers, and business owners optimize their campaigns and track performance.
                    </p>
                    <p>
                      Digital Marketing: Accurately measure your advertising efficiency with tools for ROAS, ROI, CPM, CPA, CTR, and CPC. Make data-driven choices for your ad spend.
                    </p>
                    <p>
                      Customer Economics: Understand the true value of your customers by calculating Customer Acquisition Cost (CAC), Lifetime Value (LTV), LTV:CAC Ratio, Churn Rate, and Retention Rate.
                    </p>
                    <p>
                      Email & Content: Evaluate your engagement and conversions using our Email Open Rate, Email Conversion Rate, Lead Generation, and Content Marketing ROI calculators.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} marketing calculators for digital advertising, customer economics, and email/content campaigns: ROAS, ROI, CPM, CPA, CTR, CPC, CAC, LTV, Churn Rate, Retention Rate, Email Open/Conversion Rates, and Lead Generation tools. Optimize your strategies with accurate KPIs and performance metrics.
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
              title={`Digital Marketing & Ads (${digitalMarketing.length})`}
              description="Calculate Return on Ad Spend (ROAS), Return on Investment (ROI), Cost Per Mille (CPM), and Cost Per Acquisition (CPA)."
              items={digitalMarketing}
              base="/marketing"
            />

            <Section
              emoji="👥"
              title={`Customer Economics (${customerEconomics.length})`}
              description="Analyze Customer Acquisition Cost (CAC), Lifetime Value (LTV), LTV to CAC Ratio, and Churn Metrics."
              items={customerEconomics}
              base="/marketing"
            />

            <Section
              emoji="📧"
              title={`Email & Content Marketing (${emailAndContent.length})`}
              description="Measure the performance of your campaigns with Open Rate, Conversion Rate, and overall Content ROI."
              items={emailAndContent}
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
