// src/pages/math/PercentageCalculators.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Percent, TrendingUp, TrendingDown, Shuffle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function PercentageCalculators() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Percentage Calculators · Smart Kit Now"
        description="Percent of total, percent increase, percent decrease, and percent change calculators."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
          { name: "Everyday Math", url: "https://www.smartkitnow.com/math/everyday-math" },
          { name: "Percentage Calculators", url: "https://www.smartkitnow.com/math/everyday-math/percentages" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Percentage Calculators",
          url: "https://www.smartkitnow.com/math/everyday-math/percentages",
          description: "Four practical percentage tools.",
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
                  onClick={() => navigate("/math/everyday-math")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  Percentage Calculators
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  Solve everyday percentage problems quickly.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mx-auto max-w-6xl">
            {/* Real: opens calculator */}
            <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 42, height: 42, backgroundColor: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                  aria-hidden="true"
                >
                  <Percent className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg font-bold" style={{ color: "#000000" }}>
                  <CalculatorLink to="/math/everyday-math/percent-of-total">Percent of Total</CalculatorLink>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: "#747886" }}>
                  Find X% of a number (e.g., 15% of 240).
                </p>
              </CardContent>
            </Card>

            {/* Coming soon (desabilitados) */}
            <Card className="bg-card border-border/50 opacity-90">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 42, height: 42, backgroundColor: "rgba(16,185,129,0.12)", color: "#10b981" }}
                  aria-hidden="true"
                >
                  <TrendingUp className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg font-bold" style={{ color: "#000000" }}>
                  Percent Increase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">Coming soon</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 opacity-90">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 42, height: 42, backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444" }}
                  aria-hidden="true"
                >
                  <TrendingDown className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg font-bold" style={{ color: "#000000" }}>
                  Percent Decrease
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">Coming soon</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 opacity-90">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 42, height: 42, backgroundColor: "rgba(234,179,8,0.14)", color: "#ca8a04" }}
                  aria-hidden="true"
                >
                  <Shuffle className="h-5 w-5" />
                </span>
                <CardTitle className="text-lg font-bold" style={{ color: "#000000" }}>
                  Percent Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">Coming soon</Button>
              </CardContent>
            </Card>
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
