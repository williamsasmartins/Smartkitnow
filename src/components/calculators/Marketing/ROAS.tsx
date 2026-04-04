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
    question: "What ROAS should I target?",
    answer:
      "The minimum viable ROAS depends on your gross margin. As a rule: target ROAS ≥ 1 ÷ gross margin. If your gross margin is 50%, you need at least 2× ROAS to break even on ad spend alone (excluding overhead). A common Google Ads target is 4× (400%), meaning $4 revenue per $1 spent. High-margin products (software, digital goods) can sustain lower targets; low-margin categories (grocery, commodity goods) need 8–10× or higher.",
  },
  {
    question: "How is ROAS different from Marketing ROI?",
    answer:
      "ROAS only divides revenue by ad spend — it excludes other marketing costs like agency fees, creative production, and labor. Marketing ROI includes all costs. A campaign with a 6× ROAS might only deliver 150% Marketing ROI once you add an agency fee and content costs. Use ROAS for day-to-day campaign optimization and Marketing ROI for budget allocation decisions.",
  },
  {
    question: "What is target ROAS (tROAS) bidding in Google Ads?",
    answer:
      "Target ROAS is a Smart Bidding strategy in Google Ads where the algorithm adjusts bids automatically to maximize conversion value at your specified ROAS target. It requires sufficient conversion data (typically 50+ conversions in the past 30 days) to work effectively. Setting an unrealistically high tROAS will constrain impression volume; set it slightly below your actual current ROAS and raise it gradually.",
  },
  {
    question: "Should I calculate ROAS by campaign or by channel?",
    answer:
      "Both. Campaign-level ROAS reveals which specific ads and ad groups are profitable and should receive more budget. Channel-level ROAS (Google vs. Meta vs. TikTok) guides strategic budget decisions. Be aware that attribution differences across platforms inflate their own reported ROAS — a neutral third-party attribution tool or MMM (Media Mix Modeling) gives a truer channel comparison.",
  },
  {
    question: "Can ROAS be greater than 100×?",
    answer:
      "Yes, particularly for retargeting campaigns targeting warm audiences with high intent. However, extremely high ROAS is often a sign of a narrow audience (very small spend against a tiny, highly qualified segment) rather than a scalable strategy. As you scale spend, ROAS typically decreases because you exhaust the best-performing audience segments and move into colder traffic.",
  },
];

export default function ROAS() {
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{ roasRatio: number; roasPercentage: number } | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(cost);
    if (!isNaN(r) && !isNaN(c) && c > 0) {
      setResult({ roasRatio: r / c, roasPercentage: (r / c) * 100 });
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-3">What Is ROAS?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Return on Ad Spend (ROAS) measures how much revenue you earn for every dollar
          spent on advertising. It is expressed as a ratio (4× or 4:1) or a percentage
          (400%). Unlike ROI, ROAS uses only ad spend in the denominator — making it ideal
          for comparing individual campaigns, ad sets, and channels without the complexity of
          full-cost accounting.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          A ROAS of 4× means for every $1,000 in ad spend, you generated $4,000 in revenue.
          Whether that is profitable depends entirely on your gross margin — a 4× ROAS on a
          25% margin product means you are just breaking even.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Minimum Breakeven ROAS by Margin</h2>
        <ul className="space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>20% gross margin:</strong> Breakeven ROAS = 5× (500%)</li>
          <li><strong>30% gross margin:</strong> Breakeven ROAS = 3.33× (333%)</li>
          <li><strong>50% gross margin:</strong> Breakeven ROAS = 2× (200%)</li>
          <li><strong>70% gross margin:</strong> Breakeven ROAS = 1.43× (143%)</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          These are breakeven thresholds — they don't account for overhead, fulfillment, or
          customer service costs. Your actual profitability target should be above these
          minimums. Compare ROAS against your{" "}
          <a href="/marketing/marketing-roi" className="text-primary hover:underline">
            Marketing ROI
          </a>{" "}
          to understand the full picture.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">ROAS and Customer Acquisition Cost</h2>
        <p className="text-muted-foreground leading-relaxed">
          High ROAS on a campaign doesn't always mean low{" "}
          <a href="/marketing/customer-acquisition-cost" className="text-primary hover:underline">
            Customer Acquisition Cost (CAC)
          </a>
          . If your campaign drives high-value repeat purchases from existing customers, ROAS
          will look great but your actual new-customer acquisition efficiency may be poor.
          Segment ROAS by new vs. returning customer conversions to understand true growth
          spend effectiveness.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="ROAS Calculator — Return on Ad Spend"
      description="Calculate how much revenue you earn per dollar of ad spend. Find your breakeven ROAS based on gross margin and benchmark your campaigns against industry targets."
      formula={{
        formula: "ROAS = Revenue from Ads ÷ Cost of Ads",
        variables: [
          { symbol: "Revenue from Ads", description: "Total revenue attributed to the ad campaign during the measurement period" },
          { symbol: "Cost of Ads", description: "Total ad spend (media budget only, excluding overhead)" },
        ],
        title: "ROAS Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is ROAS?" },
        { id: "breakeven", label: "Breakeven by Margin" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { category: "marketing", subcategory: "marketing", slug: "marketing-roi", name: "Marketing ROI" },
        { category: "marketing", subcategory: "marketing", slug: "customer-acquisition-cost", name: "Customer Acquisition Cost" },
        { category: "marketing", subcategory: "marketing", slug: "conversion-rate", name: "Conversion Rate" },
        { category: "marketing", subcategory: "marketing", slug: "email-marketing-roi", name: "Email Marketing ROI" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue from Ad Campaign ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 20000"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Ad Spend ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="e.g., 5000"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate ROAS
            </Button>

            {result && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Return on Ad Spend</p>
                <p className="text-4xl font-bold text-primary">{result.roasRatio.toFixed(2)}×</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.roasPercentage.toFixed(0)}% · earning ${result.roasRatio.toFixed(2)} per $1 spent
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
