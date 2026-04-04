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
    question: "What is an acceptable monthly churn rate?",
    answer:
      "For SaaS businesses, monthly churn below 2% is considered healthy (equivalent to ~22% annually). Early-stage startups often see 5–7% monthly churn while finding product-market fit. Enterprise SaaS targets under 1% monthly. Consumer subscription apps vary widely — 5–10% monthly is common. Any rate above your cohort's average payback period signals a revenue sustainability problem.",
  },
  {
    question: "What is the difference between customer churn and revenue churn?",
    answer:
      "Customer churn counts the percentage of customers lost. Revenue churn (or MRR churn) counts the percentage of recurring revenue lost. A business can have negative revenue churn (net revenue expansion) even with positive customer churn if upsells and expansions from retained customers exceed the revenue lost from churned ones.",
  },
  {
    question: "How do I calculate annual churn from monthly churn?",
    answer:
      "Annual churn ≈ 1 − (1 − monthly churn rate)^12. For example, 2% monthly churn compounds to about 21.5% annual churn — not simply 24%. The compounding effect means a seemingly small monthly improvement has a large annual impact.",
  },
  {
    question: "What are the leading indicators of churn before it happens?",
    answer:
      "Common early-warning signals include: declining login frequency, reduced feature adoption, unresolved support tickets, missed renewal calls, and decreasing NPS scores. Monitoring a product health score that combines these signals lets you intervene proactively before the customer decides to cancel.",
  },
  {
    question: "Should I include involuntary churn (failed payments) separately?",
    answer:
      "Yes. Involuntary churn from expired cards or failed billing is typically 20–40% of total churn and is addressable through dunning automation (retry logic, email sequences, card-update flows). Reporting it separately prevents it from masking voluntary churn trends that require product or customer success responses.",
  },
];

export default function ChurnRate() {
  const [lostCustomers, setLostCustomers] = useState("");
  const [totalCustomersStart, setTotalCustomersStart] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const l = parseFloat(lostCustomers);
    const t = parseFloat(totalCustomersStart);
    if (!isNaN(l) && !isNaN(t) && t > 0) {
      setResult((l / t) * 100);
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section id="what-is">
        <h2 className="text-2xl font-bold mb-3">What Is Churn Rate?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Churn rate measures the percentage of customers who stop doing business with you
          during a specific period. It is the inverse of retention: a 3% monthly churn rate
          means 97% retention. For subscription businesses, churn is the single most
          important lever for long-term revenue growth because it determines how much of your
          acquired customer base you keep compounding month over month.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          A business growing at 10% monthly but churning 8% monthly is essentially running
          in place. Reducing churn by 2 percentage points often has a larger impact on
          company valuation than doubling the acquisition budget.
        </p>
      </section>

      <section id="benchmarks">
        <h2 className="text-2xl font-bold mb-3">Churn Rate Benchmarks by Segment</h2>
        <ul className="space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>B2B SaaS (SMB):</strong> 3–7% monthly, target below 2%</li>
          <li><strong>B2B SaaS (Enterprise):</strong> 0.5–1% monthly</li>
          <li><strong>B2C subscriptions (media/streaming):</strong> 5–8% monthly</li>
          <li><strong>E-commerce (repeat purchase rate):</strong> 20–40% annual retention</li>
          <li><strong>Fintech/banking:</strong> under 2% monthly</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          If your rate is above the benchmark, start with exit surveys to identify the top
          cancellation reasons, then address the most common one before moving to the next.
          The highest-leverage fixes are usually onboarding gaps and value realization delays
          in the first 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Churn Rate and Customer Lifetime Value</h2>
        <p className="text-muted-foreground leading-relaxed">
          Average customer lifespan = 1 ÷ churn rate. At 5% monthly churn, the average
          customer stays 20 months. At 2%, they stay 50 months. Plugging this into your{" "}
          <a href="/marketing/customer-lifetime-value" className="text-primary hover:underline">
            Customer Lifetime Value (CLV)
          </a>{" "}
          formula shows directly how retention improvements multiply the value of every new
          customer you acquire via{" "}
          <a href="/marketing/customer-acquisition-cost" className="text-primary hover:underline">
            Customer Acquisition Cost (CAC)
          </a>
          .
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
      title="Churn Rate Calculator"
      description="Calculate the percentage of customers who left during a period. Benchmark against industry averages and understand the compounding impact on lifetime value."
      formula={{
        formula: "Churn Rate = (Customers Lost ÷ Customers at Start) × 100",
        variables: [
          { symbol: "Customers Lost", description: "Number of customers who cancelled or did not renew during the period" },
          { symbol: "Customers at Start", description: "Total customers at the beginning of the measurement period" },
        ],
        title: "Churn Rate Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is Churn Rate?" },
        { id: "benchmarks", label: "Benchmarks" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { title: "Customer Lifetime Value", url: "/marketing/customer-lifetime-value", icon: "♻️" },
        { title: "Customer Acquisition Cost", url: "/marketing/customer-acquisition-cost", icon: "💰" },
        { title: "Marketing ROI Calculator", url: "/marketing/marketing-roi", icon: "📈" },
        { title: "Conversion Rate Calculator", url: "/marketing/conversion-rate", icon: "🎯" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lostCustomers">Customers Lost During Period</Label>
                <Input
                  id="lostCustomers"
                  type="number"
                  placeholder="e.g., 50"
                  value={lostCustomers}
                  onChange={(e) => setLostCustomers(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCustomersStart">Customers at Start of Period</Label>
                <Input
                  id="totalCustomersStart"
                  type="number"
                  placeholder="e.g., 1000"
                  value={totalCustomersStart}
                  onChange={(e) => setTotalCustomersStart(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate Churn Rate
            </Button>

            {result !== null && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                <p className="text-4xl font-bold text-destructive">{result.toFixed(2)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Avg. customer lifespan: ~{(1 / (result / 100)).toFixed(1)} periods
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
