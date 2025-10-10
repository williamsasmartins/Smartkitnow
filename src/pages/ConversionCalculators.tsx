// src/pages/ConversionCalculators.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gauge, Soup, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function ConversionCalculators() {
  const navigate = useNavigate();

  // Contagem que aparece nos CARDS (apenas números, sem listar nomes)
  const POPULAR_COUNT = 48; // 12 cards × 4 links
  const COOKING_COUNT = 6;  // 1 card × 6 links
  const COMMON_COUNT = 10;  // 1 card × 10 links

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Conversion Calculators · SmartKitNow"
        description="Explore Popular Unit Converters, Cooking & Baking Converters, and Common Unit Converters."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Conversion Calculators",
          url: "https://www.smartkitnow.com/conversion",
          description: "Hubs for popular, cooking & baking, and common unit converters.",
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              {/* Botão Back (para Home) */}
              <div className="mb-6">
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

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  Conversion Calculators
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  Choose a hub to find common conversions quickly.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          {/* EXACTLY 3 CLICKABLE CARDS (no calculator names; just count) */}
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Popular Unit Converters */}
            <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 44, height: 44, backgroundColor: "rgba(59,130,246,0.14)", color: "#3b82f6" }}
                  aria-hidden="true"
                >
                  <Gauge className="h-5 w-5" />
                </span>
                <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                  <CalculatorLink to="/conversion/popular">Popular Unit Converters</CalculatorLink>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: "#747886" }}>
                  {POPULAR_COUNT} calculators available
                </p>
              </CardContent>
            </Card>

            {/* Cooking & Baking Ingredient Converters */}
            <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 44, height: 44, backgroundColor: "rgba(249,115,22,0.14)", color: "#f97316" }}
                  aria-hidden="true"
                >
                  <Soup className="h-5 w-5" />
                </span>
                <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                  <CalculatorLink to="/conversion/cooking-baking">Cooking &amp; Baking Ingredient Converters</CalculatorLink>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: "#747886" }}>
                  {COOKING_COUNT} calculators available
                </p>
              </CardContent>
            </Card>

            {/* Common Unit Converters (SEO de “Commonly Used Converters”) */}
            <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 44, height: 44, backgroundColor: "rgba(250,204,21,0.18)", color: "#ca8a04" }}
                  aria-hidden="true"
                >
                  <Star className="h-5 w-5" />
                </span>
                <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                  <CalculatorLink to="/conversion/common">Common Unit Converters</CalculatorLink>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" style={{ color: "#747886" }}>
                  {COMMON_COUNT} calculators available
                </p>
              </CardContent>
            </Card>
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
