// src/pages/FinancialCalculators.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Banknote, Percent, PiggyBank, Home, Landmark, LineChart } from "lucide-react";
import { listSubcategoriesOfCategory, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";

/** Colored icons by subcategory (40×40 badge) */
const ICONS_BY_SUBCAT: Record<string, { Icon: React.ComponentType<any>; color: string; bg: string }> = {
  "personal-finance-calculators":      { Icon: PiggyBank, color: "#22c55e", bg: "rgba(34,197,94,0.14)" },  // green
  "interest-and-loan-calculators":     { Icon: Percent,   color: "#f59e0b", bg: "rgba(245,158,11,0.14)" }, // amber
  "mortgage-and-home-loan-calculators":{ Icon: Home,      color: "#06b6d4", bg: "rgba(6,182,212,0.14)" },  // cyan
};
const DEFAULT_ICON = { Icon: Banknote, color: "#8b5cf6", bg: "rgba(139,92,246,0.14)" };

function getIconForSubcat(slug: string) {
  return ICONS_BY_SUBCAT[slug] || DEFAULT_ICON;
}

export default function FinancialCalculators() {
  const navigate = useNavigate();
  const category = "financial";
  const subcats = listSubcategoriesOfCategory(category);
  const categoryTitle = FRIENDLY_TITLES[category] || "Financial Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${categoryTitle} · SmartKitNow`}
        description="Financial calculators for loans, mortgages, ROI, and compounding — clear and fast."
        canonical="https://www.smartkitnow.com/financial"
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/financial" },
        ]}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div className="text-center">
              <div className="mb-6 text-left">
                <Button
                  variant="default"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <h1 className="text-4xl font-bold mb-3 text-foreground">
                {categoryTitle}
              </h1>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                Loans, mortgages, ROI, and compounding — with transparent formulas and examples.
              </p>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
          railsSticky={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subcats.map((sc) => {
              const { Icon, color, bg } = getIconForSubcat(sc.slug);
              return (
                <Link key={sc.slug} to={`/financial/${sc.slug}`} className="group block">
                  <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center rounded-xl"
                        style={{ width: 40, height: 40, backgroundColor: bg, color }}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-xl font-bold" style={{ color: [
                        "investment-calculators",
                        "interest-and-loan-calculators",
                        "personal-finance-calculators"
                      ].includes(sc.slug) ? "#5c82ee" : "#000000" }}>
                        {sc.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm" style={{ color: "#747886" }}>
                        {sc.count} calculators available
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
