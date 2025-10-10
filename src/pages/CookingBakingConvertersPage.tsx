// src/pages/CookingBakingConvertersPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Soup } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorListBlue from "@/components/common/CalculatorListBlue";

const links = [
  { title: "Flour Conversion",   to: "/conversion/cooking-baking/flour-conversion" },
  { title: "Salt Conversion",    to: "/conversion/cooking-baking/salt-conversion" },
  { title: "Sugar Conversion",   to: "/conversion/cooking-baking/sugar-conversion" },
  { title: "Cooking Ingredient", to: "/conversion/cooking-baking/ingredient-conversion" },
  { title: "Beer Conversion",    to: "/conversion/cooking-baking/beer-conversion" },
  { title: "Butter Conversion",  to: "/conversion/cooking-baking/butter-conversion" },
];

export default function CookingBakingConvertersPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
  title="Cooking & Baking Ingredient Converters · SmartKitNow"
  description="Ingredient conversions for flour, sugar, salt, butter, beer, and more. Clear, accurate kitchen conversions."
  breadcrumbs={[
    { name: "Home", url: "https://www.smartkitnow.com/" },
    { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
    { name: "Cooking & Baking Ingredient Converters", url: "https://www.smartkitnow.com/conversion/cooking-baking" },
  ]}
  schema={{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cooking & Baking Ingredient Converters",
    url: "https://www.smartkitnow.com/conversion/cooking-baking",
    description: "Kitchen ingredient conversions: flour, sugar, salt, butter, beer, and more.",
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
                  onClick={() => navigate("/conversion")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  Cooking &amp; Baking Ingredient Converters
                </h1>

                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  Six practical conversion shortcuts for the kitchen.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto max-w-5xl">
            <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <span
                  className="inline-flex items-center justify-center rounded-xl"
                  style={{ width: 40, height: 40, backgroundColor: "rgba(249,115,22,0.14)", color: "#f97316" }}
                  aria-hidden="true"
                >
                  <Soup className="h-5 w-5" />
                </span>
                <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                  Cooking &amp; Baking Ingredients
                 </CardTitle>

              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <CalculatorListBlue items={links.slice(0, Math.ceil(links.length / 2))} />
                  <CalculatorListBlue items={links.slice(Math.ceil(links.length / 2))} />
                </div>
              </CardContent>
            </Card>
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
