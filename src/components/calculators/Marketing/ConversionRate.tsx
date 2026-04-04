"use client";

import React, { useState } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
  {
    question: "What is a good conversion rate?",
    answer:
      "Average conversion rates vary widely by industry. E-commerce sites typically see 1–3%, while B2B lead-gen landing pages can hit 5–10%. A Google Ads benchmark across industries is around 3.75% for search campaigns. Anything above your industry average is worth protecting; anything below signals room to test copy, CTA placement, or page speed.",
  },
  {
    question: "What counts as a conversion?",
    answer:
      "A conversion is any completed goal action: a purchase, form submission, email sign-up, demo request, phone call, or file download. Define one primary conversion per campaign so the rate is meaningful. Mixing goals (e.g., purchases + newsletter sign-ups) inflates or distorts the metric.",
  },
  {
    question: "How does conversion rate differ from click-through rate (CTR)?",
    answer:
      "CTR measures how many people clicked an ad or link relative to impressions. Conversion rate measures how many of those clickers completed the goal action on the destination page. High CTR + low CVR points to a landing-page problem; low CTR + high CVR suggests your audience targeting or ad copy needs work.",
  },
  {
    question: "What sample size is needed for a statistically valid conversion rate?",
    answer:
      "As a rule of thumb, aim for at least 100 conversions per variant before drawing conclusions from an A/B test. For rates below 1%, you may need 1,000+ visitors per variant. Tools like a chi-squared significance calculator can tell you exactly when a difference is statistically reliable.",
  },
  {
    question: "Can a very high conversion rate be a bad sign?",
    answer:
      "Yes. A 90%+ rate often means your audience is too narrow (only your most loyal users see the page) or your goal is too easy (e.g., clicking a link vs. making a purchase). Always report conversion rate alongside absolute volume to avoid misleading conclusions.",
  },
];

export default function ConversionRate() {
  const [conversions, setConversions] = useState("");
  const [visitors, setVisitors] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const c = parseFloat(conversions);
    const v = parseFloat(visitors);
    if (!isNaN(c) && !isNaN(v) && v > 0) {
      setResult((c / v) * 100);
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-3">What Is Conversion Rate?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Conversion rate (CVR) is the percentage of sessions or visitors who complete a
          defined goal action — a purchase, sign-up, download, or any other measurable
          outcome. It is the single most important efficiency metric in digital marketing
          because it ties traffic to business results without requiring more spend.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          For example, if 10,000 people visit your checkout page and 320 complete a
          purchase, your conversion rate is 3.2%. Doubling that rate to 6.4% doubles
          revenue from the same traffic — no additional ad budget required.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">How to Interpret Your Rate</h2>
        <p className="text-muted-foreground leading-relaxed">
          Conversion rate benchmarks by channel (source: WordStream 2023 industry data):
        </p>
        <ul className="mt-3 space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>E-commerce (Google Search Ads):</strong> 2–4%</li>
          <li><strong>B2B lead generation pages:</strong> 5–10%</li>
          <li><strong>Email campaigns to warm lists:</strong> 3–8%</li>
          <li><strong>Organic landing pages:</strong> 1–3%</li>
          <li><strong>Social media (cold traffic):</strong> 0.5–2%</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          If you are below the benchmark for your channel, focus first on page load speed
          (every 1-second delay reduces conversions ~7%), social proof (reviews, trust
          badges), and CTA clarity before testing design changes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Conversion Rate vs. Other Marketing KPIs</h2>
        <p className="text-muted-foreground leading-relaxed">
          CVR is most useful when combined with cost-per-click (CPC) and average order value
          (AOV). The relationship <em>Revenue = Traffic × CVR × AOV</em> shows that
          improving any single factor multiplies revenue. Tracking CVR alongside{" "}
          <a href="/marketing/customer-acquisition-cost" className="text-primary hover:underline">
            Customer Acquisition Cost
          </a>{" "}
          and{" "}
          <a href="/marketing/customer-lifetime-value" className="text-primary hover:underline">
            Customer Lifetime Value
          </a>{" "}
          gives a complete picture of campaign profitability.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Conversion Rate Calculator"
      description="Calculate the percentage of visitors who completed a desired action. Benchmark against industry averages to identify optimization opportunities."
      formula={{
        formula: "CVR = (Conversions ÷ Total Visitors) × 100",
        variables: [
          { symbol: "CVR", description: "Conversion rate (%)" },
          { symbol: "Conversions", description: "Number of completed goal actions" },
          { symbol: "Total Visitors", description: "Total sessions or unique visitors in the same period" },
        ],
        title: "Conversion Rate Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is Conversion Rate?" },
        { id: "benchmarks", label: "Industry Benchmarks" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { category: "marketing", subcategory: "marketing", slug: "marketing-roi", name: "Marketing ROI" },
        { category: "marketing", subcategory: "marketing", slug: "customer-acquisition-cost", name: "Customer Acquisition Cost" },
        { category: "marketing", subcategory: "marketing", slug: "customer-lifetime-value", name: "Customer Lifetime Value" },
        { category: "marketing", subcategory: "marketing", slug: "roas", name: "ROAS Calculator" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conversions">Total Conversions</Label>
                <Input
                  id="conversions"
                  type="number"
                  placeholder="e.g., 250"
                  value={conversions}
                  onChange={(e) => setConversions(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitors">Total Visitors or Clicks</Label>
                <Input
                  id="visitors"
                  type="number"
                  placeholder="e.g., 10000"
                  value={visitors}
                  onChange={(e) => setVisitors(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate Conversion Rate
            </Button>

            {result !== null && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-4xl font-bold text-primary">{result.toFixed(2)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result < 1 ? "Below typical benchmarks — review landing page UX" :
                   result < 3 ? "Average range — good baseline for optimization" :
                   result < 8 ? "Above average — maintain and test for gains" :
                   "Excellent — verify goal definition and audience scope"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
