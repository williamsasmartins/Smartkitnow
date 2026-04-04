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
    question: "What ROI should I expect from email marketing?",
    answer:
      "Email marketing consistently delivers the highest ROI of any digital channel. Industry benchmarks from Litmus and HubSpot put average email ROI at 36–42× ($36–$42 returned per $1 spent). E-commerce campaigns targeting warm lists can achieve 50–80×. B2B nurture sequences tend to be lower (10–20×) due to longer sales cycles, but the absolute revenue per email is typically higher.",
  },
  {
    question: "What costs should I include in email campaign cost?",
    answer:
      "Include: ESP/email platform fees (prorated to the campaign), copywriting and design labor, list acquisition costs if applicable, and any A/B testing or analytics tool costs. Do not include general overhead like salaries for team members who only tangentially touched the campaign. For automated flows (welcome series, abandoned cart), amortize the setup cost over the campaign's lifetime.",
  },
  {
    question: "How do I attribute revenue to a specific email campaign?",
    answer:
      "Use UTM parameters on all email links and track conversions in Google Analytics or your e-commerce platform. Most ESPs (Klaviyo, Mailchimp, Brevo) provide built-in revenue attribution with configurable attribution windows. The standard is a 5-day click attribution window — revenue from any purchase within 5 days of an email click is credited to that email. Shorten the window if your purchase cycle is fast; lengthen it for considered purchases.",
  },
  {
    question: "What is the difference between email ROI and email marketing ROI?",
    answer:
      "They are typically the same thing, but 'email ROI' can sometimes refer to a single campaign, while 'email marketing ROI' refers to the channel as a whole over a period. For strategic planning, calculate channel-level ROI quarterly. For optimization, calculate it per campaign (welcome series vs. promotional vs. transactional) to identify which types drive the most value.",
  },
  {
    question: "How can I improve email marketing ROI without increasing send volume?",
    answer:
      "Segmentation and personalization have the largest impact: segmented campaigns generate 760% more revenue than one-size-fits-all blasts (DMA). Other high-leverage tactics: optimize send time (test morning vs. evening), improve subject lines (open rate drives everything downstream), use behavioral triggers (abandoned cart, browse abandonment), and reduce list decay through re-engagement sequences before unsubscribes accumulate.",
  },
];

export default function EmailMarketingROI() {
  const [revenue, setRevenue] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState<{ roi: number; profit: number; ratio: number } | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(cost);
    if (!isNaN(r) && !isNaN(c) && c > 0) {
      const profit = r - c;
      const roi = (profit / c) * 100;
      const ratio = r / c;
      setResult({ roi, profit, ratio });
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-3">Why Email Marketing Has the Highest ROI</h2>
        <p className="text-muted-foreground leading-relaxed">
          Email marketing consistently outperforms every other digital channel on ROI
          because you own the list, the marginal cost per send is near zero, and you are
          reaching people who already opted in. Unlike paid ads where you pay for every
          impression, a well-maintained email list compounds in value over time — each
          subscriber you retain means another send costs almost nothing.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          The DMA and Litmus 2023 benchmarks put average email ROI at $36–$42 per $1 spent,
          compared to $3–$5 for paid search. For e-commerce businesses with active
          segmentation and automation, the ratio frequently exceeds 50×.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">High-Impact Email Campaign Types by ROI</h2>
        <ul className="space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>Abandoned cart sequences:</strong> 5–15% recovery rate, typically 40–100× ROI</li>
          <li><strong>Welcome series:</strong> 3× higher open rates than standard newsletters; high LTV impact</li>
          <li><strong>Win-back campaigns:</strong> Low cost, targets existing list — 10–30% reactivation common</li>
          <li><strong>Post-purchase upsell:</strong> Leverages purchase intent; 2–5× higher conversion vs. cold sends</li>
          <li><strong>Promotional newsletters:</strong> Lower ROI but high volume — 10–20× typical</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Email ROI vs. Other Channel ROI</h2>
        <p className="text-muted-foreground leading-relaxed">
          Compare email ROI to your{" "}
          <a href="/marketing/marketing-roi" className="text-primary hover:underline">
            overall Marketing ROI
          </a>{" "}
          and{" "}
          <a href="/marketing/roas" className="text-primary hover:underline">
            ROAS
          </a>{" "}
          to understand where email sits in your channel mix. Most businesses find email
          earns 3–5× more per dollar than their best paid channel. If it does not, the issue
          is usually list quality, segmentation, or deliverability — not email as a channel.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Email Marketing ROI Calculator"
      description="Calculate the return on investment for your email campaigns. Benchmark against the industry average of 36–42× ROI and identify which campaign types drive the most value."
      formula={{
        formula: "Email ROI = ((Revenue − Cost) ÷ Cost) × 100",
        variables: [
          { symbol: "Revenue", description: "Total revenue attributed to the email campaign (use UTM tracking)" },
          { symbol: "Cost", description: "Email platform fees, design, copywriting, and other campaign costs" },
        ],
        title: "Email Marketing ROI Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "why-email", label: "Why Email Leads on ROI" },
        { id: "campaign-types", label: "Best Campaign Types" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { category: "marketing", subcategory: "marketing", slug: "marketing-roi", name: "Marketing ROI" },
        { category: "marketing", subcategory: "marketing", slug: "roas", name: "ROAS Calculator" },
        { category: "marketing", subcategory: "marketing", slug: "conversion-rate", name: "Conversion Rate" },
        { category: "marketing", subcategory: "marketing", slug: "customer-lifetime-value", name: "Customer Lifetime Value" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue from Email Campaign ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 20000"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Campaign Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="e.g., 500"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate Email Marketing ROI
            </Button>

            {result && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email Marketing ROI</p>
                <p className="text-4xl font-bold text-primary">{result.roi.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.ratio.toFixed(1)}× ratio · Net profit: ${result.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {" · "}
                  {result.ratio >= 36 ? "Above industry average (36–42×)" : result.ratio >= 10 ? "Below average — review segmentation and subject lines" : "Significantly below average — audit list quality and attribution"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
