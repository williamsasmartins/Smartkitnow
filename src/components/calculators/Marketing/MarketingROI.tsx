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
    question: "What is a good marketing ROI?",
    answer:
      "A commonly cited benchmark is 5:1 — earning $5 for every $1 spent, equivalent to a 400% ROI. A ratio above 10:1 is exceptional. Below 2:1 (100% ROI) typically means the campaign is breaking even or losing money once you factor in overhead and cost of goods. The right threshold depends on your margins: a high-margin SaaS product can sustain lower ROI than a low-margin e-commerce business.",
  },
  {
    question: "How is marketing ROI different from ROAS?",
    answer:
      "ROAS (Return on Ad Spend) measures revenue generated per dollar spent only on paid advertising. Marketing ROI is broader: it subtracts total marketing costs — including agency fees, salaries, software, and content production — from revenue, then divides by total costs. ROAS overstates performance by excluding overhead. Use ROAS for tactical ad optimization and Marketing ROI for budget allocation decisions.",
  },
  {
    question: "Should I include salaries in the marketing cost?",
    answer:
      "Yes, for an accurate picture. Many teams calculate ROI using only direct spend (ad budgets, tools) and are surprised when the full-cost view is much lower. A $50,000 ad campaign managed by a $80,000/year marketing manager is actually a $130,000 investment. For budget requests and board reporting, always use full-cost ROI.",
  },
  {
    question: "How do I attribute revenue to a specific marketing campaign?",
    answer:
      "Attribution is the hardest part of marketing ROI. Common models include last-click (credit the final touchpoint), first-click (credit the first), linear (credit all equally), and data-driven (ML-based). For multi-channel campaigns, use UTM parameters consistently and choose a model in Google Analytics or your CRM. For offline campaigns, use unique promo codes or dedicated landing page URLs.",
  },
  {
    question: "Can marketing ROI be negative?",
    answer:
      "Yes, and it's more common than reported. A negative ROI means the campaign cost more than it returned. This can be acceptable during brand-building or market entry phases where the goal is awareness rather than immediate revenue. Track negative-ROI campaigns separately and set a clear timeline for when they are expected to become profitable.",
  },
];

export default function MarketingROI() {
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{ roi: number; profit: number } | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(cost);
    if (!isNaN(r) && !isNaN(c) && c > 0) {
      const profit = r - c;
      const roi = (profit / c) * 100;
      setResult({ roi, profit });
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section id="what-is">
        <h2 className="text-2xl font-bold mb-3">What Is Marketing ROI?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Marketing Return on Investment (ROI) measures how much revenue a marketing
          campaign or channel generates relative to what it costs. Unlike vanity metrics such
          as impressions or followers, ROI ties marketing spend directly to business
          outcomes, making it the primary metric for budget justification and channel
          comparison.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          The formula is straightforward: subtract total marketing cost from revenue
          generated, divide by cost, and multiply by 100 to express as a percentage. A 300%
          ROI means you earned $4 for every $1 spent — $3 in profit plus the original $1
          back.
        </p>
      </section>

      <section id="roi-vs-roas">
        <h2 className="text-2xl font-bold mb-3">Marketing ROI vs. ROAS: Know the Difference</h2>
        <p className="text-muted-foreground leading-relaxed">
          ROI and{" "}
          <a href="/marketing/roas" className="text-primary hover:underline">
            ROAS (Return on Ad Spend)
          </a>{" "}
          are often confused but measure different things. ROAS only counts paid ad spend in
          the denominator — it ignores agency fees, content costs, and internal labor.
          Marketing ROI includes everything, giving a truer picture of profitability. Use
          ROAS when optimizing individual ad campaigns day-to-day; use Marketing ROI when
          making quarterly budget decisions.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Improving Your Marketing ROI</h2>
        <p className="text-muted-foreground leading-relaxed">
          The two levers are increasing revenue attribution (better conversion rates,
          upsells, retention) and reducing costs (automation, channel consolidation,
          content repurposing). Before cutting budgets, use your{" "}
          <a href="/marketing/conversion-rate" className="text-primary hover:underline">
            Conversion Rate
          </a>{" "}
          data to identify which channels are underperforming. A channel with low ROI but
          high{" "}
          <a href="/marketing/customer-lifetime-value" className="text-primary hover:underline">
            Customer Lifetime Value
          </a>{" "}
          may still be worth keeping if it acquires high-retention customers.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-lg mb-2">{item.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Marketing ROI Calculator"
      description="Calculate the return on investment for your marketing campaigns. Understand how much revenue each dollar of marketing spend generates and benchmark against industry standards."
      formula={{
        formula: "Marketing ROI = ((Revenue − Cost) ÷ Cost) × 100",
        variables: [
          { symbol: "Revenue", description: "Total revenue attributed to the marketing campaign or channel" },
          { symbol: "Cost", description: "Total marketing cost including ad spend, agency fees, tools, and labor" },
        ],
        title: "Marketing ROI Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is Marketing ROI?" },
        { id: "roi-vs-roas", label: "ROI vs. ROAS" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { title: "ROAS Calculator", url: "/marketing/roas", icon: "📊" },
        { title: "Conversion Rate Calculator", url: "/marketing/conversion-rate", icon: "🎯" },
        { title: "Customer Acquisition Cost", url: "/marketing/customer-acquisition-cost", icon: "💰" },
        { title: "Email Marketing ROI", url: "/marketing/email-marketing-roi", icon: "📧" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue Generated ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 50000"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Total Marketing Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="e.g., 10000"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate Marketing ROI
            </Button>

            {result && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Marketing ROI</p>
                <p className="text-4xl font-bold text-primary">{result.roi.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Net profit: ${result.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {" · "}
                  {result.roi >= 400 ? "Excellent" : result.roi >= 100 ? "Good" : result.roi >= 0 ? "Break-even range" : "Negative — review spend allocation"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
