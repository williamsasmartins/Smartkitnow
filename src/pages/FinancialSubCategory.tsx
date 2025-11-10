// src/pages/FinancialSubCategory.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
  FRIENDLY_TITLES,
  calcLink
} from "@/data/calculatorRegistry";
import { ArrowLeft, Wallet, PiggyBank, Banknote, CreditCard, Percent, LineChart } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function FinancialSubCategory() {
  const category = "financial";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculators = subcategory ? listByCategorySubcategory(category, subcategory) : [];
  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[category]?.[subcategory]) ||
    (subcategory ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Calculators");
  const categoryTitle = FRIENDLY_TITLES[category] || "Financial Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Financial calculators: ${subcatTitle}. Budgeting, rates, loans, and more.`}
        canonical={`https://www.smartkitnow.com/financial/${subcategory || ""}`}
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
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  {subcatTitle}
                </h1>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: "#747886" }}>
                  Money tools for planning budgets, understanding rates, and comparing loans.
                </p>
              </div>
            </div>
          }
          showRails={false}
        >
          {!calculators || calculators.length === 0 ? (
            <p className="text-center" style={{ color: "#747886" }}>No calculators found yet in this subcategory.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <Card key={calc.slug} className="group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <span className="inline-flex items-center justify-center rounded-xl"
                          style={{ width: 40, height: 40, backgroundColor: "rgba(34,197,94,0.14)", color: "#22c55e" }} aria-hidden="true">
                      <Wallet className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-lg font-semibold" style={{ color: "#000000" }}>
                      <CalculatorLink to={calcLink(calc)}>{calc.title}</CalculatorLink>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: "#747886" }}>
                      {calc.description || "Open calculator"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
