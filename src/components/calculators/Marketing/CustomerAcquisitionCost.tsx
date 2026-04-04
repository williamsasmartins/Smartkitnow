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
    question: "What is a good CAC?",
    answer:
      "CAC must always be evaluated relative to Customer Lifetime Value (CLV). The standard target is a CLV:CAC ratio of 3:1 or higher — meaning each customer generates at least 3× what it cost to acquire them. A ratio below 1:1 means you are losing money on every customer. SaaS benchmarks: under $100 CAC for self-serve, $1,000–$10,000 for SMB sales-assisted, $10,000+ for enterprise.",
  },
  {
    question: "What costs should I include in CAC?",
    answer:
      "Include all costs directly tied to customer acquisition: paid advertising (Google, Meta, LinkedIn), sales salaries and commissions, marketing team salaries (prorated to acquisition work), SEO/content costs, event sponsorships, and marketing technology (CRM, email platform, attribution tools). Exclude costs for customer success, onboarding, and account management — those belong in retention cost calculations.",
  },
  {
    question: "How do I calculate CAC by channel?",
    answer:
      "Track spend per channel and attribute new customers to each channel using your CRM or attribution model. Channel-level CAC = (Channel Spend) ÷ (New Customers from Channel). This reveals which channels acquire customers most efficiently. SEO often shows the lowest blended CAC because content costs are spread across many months; paid channels show higher but more predictable CAC.",
  },
  {
    question: "How often should I calculate CAC?",
    answer:
      "Monthly at minimum for active campaigns; quarterly for strategic channel reviews. Be careful with monthly calculations: sales cycles longer than 30 days cause attribution lag, so a customer acquired via a January ad click may not close until March. Use a trailing 90-day window if your average sales cycle exceeds 30 days.",
  },
  {
    question: "What is CAC payback period?",
    answer:
      "CAC payback period = CAC ÷ Monthly Revenue per Customer. It measures how many months it takes to recover acquisition costs from a single customer's revenue. SaaS benchmarks: under 12 months for SMB, under 18 months for mid-market, under 24 months for enterprise. A long payback period increases funding requirements and cash-flow risk.",
  },
];

export default function CustomerAcquisitionCost() {
  const [marketingCost, setMarketingCost] = useState("");
  const [salesCost, setSalesCost] = useState("");
  const [newCustomers, setNewCustomers] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const m = parseFloat(marketingCost) || 0;
    const s = parseFloat(salesCost) || 0;
    const c = parseFloat(newCustomers);
    if (!isNaN(c) && c > 0) {
      setResult((m + s) / c);
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section id="what-is">
        <h2 className="text-2xl font-bold mb-3">What Is Customer Acquisition Cost (CAC)?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Customer Acquisition Cost (CAC) is the total cost of convincing a prospect to
          become a paying customer, divided by the number of customers acquired in a given
          period. It combines marketing and sales expenses and is the foundational input for
          evaluating whether a business model is economically sustainable.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          CAC alone is not enough — it must always be compared to{" "}
          <a href="/marketing/customer-lifetime-value" className="text-primary hover:underline">
            Customer Lifetime Value (CLV)
          </a>
          . A $200 CAC is excellent if CLV is $1,000, but unsustainable if CLV is $180.
          The 3:1 CLV:CAC ratio is the minimum viable threshold for most venture-backed
          SaaS and subscription businesses.
        </p>
      </section>

      <section id="benchmarks">
        <h2 className="text-2xl font-bold mb-3">CAC Benchmarks by Business Type</h2>
        <ul className="space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>SaaS (self-serve / PLG):</strong> $50–$200</li>
          <li><strong>SaaS (SMB sales-assisted):</strong> $1,000–$5,000</li>
          <li><strong>SaaS (enterprise):</strong> $10,000–$50,000+</li>
          <li><strong>E-commerce:</strong> $10–$100 (highly variable by vertical)</li>
          <li><strong>Financial services:</strong> $200–$1,000</li>
          <li><strong>Consumer mobile apps:</strong> $1–$20</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Reducing CAC Without Cutting Growth</h2>
        <p className="text-muted-foreground leading-relaxed">
          The most effective levers for reducing CAC are improving{" "}
          <a href="/marketing/conversion-rate" className="text-primary hover:underline">
            landing page conversion rates
          </a>{" "}
          (same spend, more customers), investing in SEO and content (lower marginal cost
          at scale), building referral programs (customers acquire customers), and improving
          sales cycle efficiency through better qualification and CRM automation. Each 10%
          improvement in conversion rate reduces CAC by approximately 10%.
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
      title="Customer Acquisition Cost (CAC) Calculator"
      description="Calculate how much it costs to acquire each new customer. Benchmark against your CLV and industry averages to evaluate growth sustainability."
      formula={{
        formula: "CAC = (Marketing Cost + Sales Cost) ÷ New Customers Acquired",
        variables: [
          { symbol: "Marketing Cost", description: "Total marketing spend including ads, tools, and team costs attributed to acquisition" },
          { symbol: "Sales Cost", description: "Total sales cost including salaries, commissions, and sales tools" },
          { symbol: "New Customers", description: "Number of new customers acquired during the measurement period" },
        ],
        title: "Customer Acquisition Cost Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is CAC?" },
        { id: "benchmarks", label: "Benchmarks" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { title: "Customer Lifetime Value", url: "/marketing/customer-lifetime-value", icon: "♻️" },
        { title: "Marketing ROI Calculator", url: "/marketing/marketing-roi", icon: "📈" },
        { title: "Conversion Rate Calculator", url: "/marketing/conversion-rate", icon: "🎯" },
        { title: "Churn Rate Calculator", url: "/marketing/churn-rate", icon: "📉" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketingCost">Total Marketing Cost ($)</Label>
                <Input
                  id="marketingCost"
                  type="number"
                  placeholder="e.g., 5000"
                  value={marketingCost}
                  onChange={(e) => setMarketingCost(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesCost">Total Sales Cost ($)</Label>
                <Input
                  id="salesCost"
                  type="number"
                  placeholder="e.g., 2000"
                  value={salesCost}
                  onChange={(e) => setSalesCost(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="newCustomers">New Customers Acquired</Label>
                <Input
                  id="newCustomers"
                  type="number"
                  placeholder="e.g., 100"
                  value={newCustomers}
                  onChange={(e) => setNewCustomers(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate CAC
            </Button>

            {result !== null && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Customer Acquisition Cost</p>
                <p className="text-4xl font-bold text-primary">
                  ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per new customer</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
