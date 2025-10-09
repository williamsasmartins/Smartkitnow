// src/pages/FinancialSubCategory.tsx
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
  FRIENDLY_TITLES,
} from "@/data/calculatorRegistry";
import {
  ArrowLeft,
  Banknote,
  Percent,
  PiggyBank,
  Home,
  Landmark,
  LineChart,
  Calculator,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

/** Colored icons by calculator (slug/name) — 40×40 badge */
type IconSpec = { Icon: React.ComponentType<any>; color: string; bg: string };
const DEF: IconSpec = { Icon: Calculator, color: "#8b5cf6", bg: "rgba(139,92,246,0.14)" };

const RULES: Array<{ test: (k: string) => boolean; spec: IconSpec }> = [
  { test: k => /mortgage|home|house/.test(k),        spec: { Icon: Home,      color: "#06b6d4", bg: "rgba(6,182,212,0.14)" } }, // cyan
  { test: k => /interest|loan|refinance|apr|rate/.test(k), spec: { Icon: Percent,   color: "#f59e0b", bg: "rgba(245,158,11,0.14)" } }, // amber
  { test: k => /roi|return|investment/.test(k),      spec: { Icon: LineChart, color: "#22c55e", bg: "rgba(34,197,94,0.14)" } }, // green
  { test: k => /savings|budget|finance|personal/.test(k),  spec: { Icon: PiggyBank, color: "#ef4444", bg: "rgba(239,68,68,0.14)" } }, // red
  { test: k => /cash|note|payment|amort/.test(k),    spec: { Icon: Banknote,  color: "#3b82f6", bg: "rgba(59,130,246,0.14)" } }, // blue
  { test: k => /bank|institution|policy/.test(k),    spec: { Icon: Landmark,  color: "#a855f7", bg: "rgba(168,85,247,0.14)" } }, // purple
];

function iconForCalc(slug: string, name: string): IconSpec {
  const k = `${slug} ${name}`.toLowerCase();
  const r = RULES.find(x => x.test(k));
  return r ? r.spec : DEF;
}

export default function FinancialSubCategory() {
  const category = "financial";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculators = subcategory ? listByCategorySubcategory(category, subcategory) : [];
  const isBlueSubcat = ["investment-calculators","interest-and-loan-calculators","personal-finance-calculators"].includes(String(subcategory ?? ""));
  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[subcategory]) ||
    (subcategory ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Calculators");
  const categoryTitle = FRIENDLY_TITLES[category] || "Financial Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Financial calculators: ${subcatTitle}. Loans, mortgages, ROI, and compounding.`}
        canonical={`https://www.smartkitnow.com/financial/${subcategory || ""}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/financial" },
          { name: subcatTitle, url: `https://www.smartkitnow.com/financial/${subcategory || ""}` },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${subcatTitle} — ${categoryTitle}`,
          url: `https://www.smartkitnow.com/financial/${subcategory || ""}`,
          description: `List of ${subcatTitle} calculators on SmartKitNow.`,
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate(`/financial`)}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3 text-foreground">
                  {subcatTitle}
                </h1>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: "#747886" }}>
                  Professional finance tools for accurate planning and decisions.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
          railsSticky={false}
        >
          {!calculators || calculators.length === 0 ? (
            <p className="text-center" style={{ color: "#747886" }}>No calculators found yet in this subcategory.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => {
                const { Icon, color, bg } = iconForCalc(calc.slug, calc.title);
                return (
                  <Link key={calc.slug} to={`/financial/${calc.subcategory}/${calc.slug}`} className="group block">
                    <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                      <CardHeader className="flex flex-row items-center gap-3">
                        <span className="inline-flex items-center justify-center rounded-xl"
                              style={{ width: 40, height: 40, backgroundColor: bg, color }} aria-hidden="true">
                          <Icon className="h-5 w-5" />
                        </span>
                        <CardTitle className="text-lg font-semibold" style={{ color: [
                          "Loan Calculator",
                          "Mortgage Refinance Calculator",
                          "Mortgage Calculator",
                          "Budget Percentage Calculator (Coming Soon)",
                          "Investment Fees Calculator (Coming Soon)",
                          "Savings Goal Planner (Coming Soon)",
                          "Emergency Fund Calculator (Coming Soon)",
                          "Retirement Savings Estimator (Coming Soon)",
                          "Compound Interest Calculator",
                          "ROI Calculator",
                          "Credit Card Payoff Planner (Coming Soon)"
                        ].includes(calc.title) ? "#5c82ee" : "#000000" }}>
                          {calc.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm" style={{ color: "#747886" }}>
                          {calc.description || "Open calculator"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
