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
    question: "What is the difference between CLV and LTV?",
    answer:
      "CLV (Customer Lifetime Value) and LTV (Lifetime Value) are the same metric — different abbreviations used interchangeably across industries. Some companies use 'LTV' when referring to predicted future value and 'CLV' when using historical data. In financial modeling, LTV may also refer to loan-to-value ratio, so 'CLV' is preferred in marketing contexts to avoid ambiguity.",
  },
  {
    question: "Should I use gross or net revenue for CLV?",
    answer:
      "Use gross revenue for top-line CLV calculations (total sales value), but always compute a gross-margin-adjusted CLV for decision making: CLV × gross margin = gross profit per customer. This adjusted figure should exceed your CAC by at least 3×. Using gross revenue against a fully-loaded CAC gives a misleadingly favorable CLV:CAC ratio.",
  },
  {
    question: "How do I estimate average customer lifespan?",
    answer:
      "For established businesses: analyze actual cohort data. Find the median months-to-churn across cohorts. For new businesses: use 1 ÷ monthly churn rate as an approximation. If monthly churn is 4%, average lifespan ≈ 25 months (2.1 years). Track churn by acquisition channel — customers from different sources often have dramatically different lifespans.",
  },
  {
    question: "What is the CLV:CAC ratio and why does it matter?",
    answer:
      "CLV:CAC is the single most important ratio for evaluating growth sustainability. A 3:1 ratio is the minimum threshold for most SaaS and subscription businesses. Below 1:1, you lose money on every customer. Above 10:1, you may be under-investing in growth. Investors use this ratio to assess whether a business model is economically viable at scale.",
  },
  {
    question: "How does churn rate affect CLV?",
    answer:
      "Churn has a compounding effect on CLV. Reducing monthly churn from 5% to 3% increases average customer lifespan from 20 months to 33 months — a 65% increase in CLV with the same purchase value and frequency. This is why retention improvements typically have a greater ROI than acquisition spend increases for businesses beyond early growth stage.",
  },
];

export default function CustomerLifetimeValue() {
  const [avgPurchaseValue, setAvgPurchaseValue] = useState("");
  const [avgPurchaseFreq, setAvgPurchaseFreq] = useState("");
  const [avgLifespan, setAvgLifespan] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const faqJsonLd = useFaqJsonLd(faqs);

  const calculate = () => {
    const v = parseFloat(avgPurchaseValue);
    const f = parseFloat(avgPurchaseFreq);
    const l = parseFloat(avgLifespan);
    if (!isNaN(v) && !isNaN(f) && !isNaN(l)) {
      setResult(v * f * l);
    }
  };

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-3">What Is Customer Lifetime Value (CLV)?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Customer Lifetime Value (CLV) estimates the total revenue a single customer
          generates over the entire duration of their relationship with your business. It is
          the most important metric for evaluating the long-term profitability of your
          customer base and for setting intelligent limits on how much you can afford to
          spend acquiring new customers.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          The simple formula used here — Average Purchase Value × Purchase Frequency ×
          Customer Lifespan — gives a solid first approximation. More sophisticated models
          discount future cash flows to present value and segment customers by acquisition
          channel to reveal which sources generate the most valuable customers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">CLV and the 3:1 Rule</h2>
        <p className="text-muted-foreground leading-relaxed">
          CLV is most useful when compared against{" "}
          <a href="/marketing/customer-acquisition-cost" className="text-primary hover:underline">
            Customer Acquisition Cost (CAC)
          </a>
          . The widely used benchmark is CLV:CAC ≥ 3:1. At this ratio, after recovering
          acquisition costs, you have 2× CLV remaining to cover overhead, service, and
          profit. A ratio below 1:1 means you are structurally losing money on every
          customer — no amount of growth will fix a unit economics problem like this.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Improving CLV: Retention vs. Revenue Expansion</h2>
        <p className="text-muted-foreground leading-relaxed">
          Two levers increase CLV: keep customers longer (lower{" "}
          <a href="/marketing/churn-rate" className="text-primary hover:underline">
            churn rate
          </a>
          ) or increase revenue per customer (upsells, cross-sells, price increases).
          Retention is usually more cost-effective because the marginal cost of an extra
          month from an existing customer is near zero. A customer success program that
          reduces churn by 2 percentage points monthly often delivers a higher ROI than
          doubling the acquisition budget.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Customer Lifetime Value (CLV) Calculator"
      description="Estimate total revenue per customer over their relationship with your business. Use the CLV:CAC ratio to evaluate whether your growth model is economically sustainable."
      formula={{
        formula: "CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan",
        variables: [
          { symbol: "Average Purchase Value", description: "Average revenue per transaction" },
          { symbol: "Purchase Frequency", description: "Average number of purchases per customer per year" },
          { symbol: "Customer Lifespan", description: "Average years a customer remains active (≈ 1 ÷ annual churn rate)" },
        ],
        title: "Customer Lifetime Value Formula",
      }}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "what-is", label: "What Is CLV?" },
        { id: "clv-cac", label: "CLV:CAC Ratio" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        { category: "marketing", subcategory: "marketing", slug: "customer-acquisition-cost", name: "Customer Acquisition Cost" },
        { category: "marketing", subcategory: "marketing", slug: "churn-rate", name: "Churn Rate" },
        { category: "marketing", subcategory: "marketing", slug: "marketing-roi", name: "Marketing ROI" },
        { category: "marketing", subcategory: "marketing", slug: "conversion-rate", name: "Conversion Rate" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="avgPurchaseValue">Average Purchase Value ($)</Label>
                <Input
                  id="avgPurchaseValue"
                  type="number"
                  placeholder="e.g., 50"
                  value={avgPurchaseValue}
                  onChange={(e) => setAvgPurchaseValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgPurchaseFreq">Purchase Frequency (per year)</Label>
                <Input
                  id="avgPurchaseFreq"
                  type="number"
                  placeholder="e.g., 4"
                  value={avgPurchaseFreq}
                  onChange={(e) => setAvgPurchaseFreq(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgLifespan">Customer Lifespan (years)</Label>
                <Input
                  id="avgLifespan"
                  type="number"
                  placeholder="e.g., 3"
                  value={avgLifespan}
                  onChange={(e) => setAvgLifespan(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full">
              Calculate CLV
            </Button>

            {result !== null && (
              <div className="rounded-xl bg-muted/50 p-6 text-center space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Customer Lifetime Value</p>
                <p className="text-4xl font-bold text-primary">
                  ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total revenue over the customer lifecycle
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CalculatorVerticalLayout>
  );
}
