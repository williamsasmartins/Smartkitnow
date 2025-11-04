// src/pages/ConversionSubCategory.tsx
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
import { ArrowLeft, Scale, Ruler, Thermometer, FlaskRound, Droplets } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function ConversionSubCategory() {
  const category = "conversion";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculators = subcategory ? listByCategorySubcategory(category, subcategory) : [];
  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[category]?.[subcategory]) ||
    (subcategory ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Calculators");
  const categoryTitle = FRIENDLY_TITLES[category] || "Conversion Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Conversion tools: ${subcatTitle}. Units, temperatures, measures, and more.`}
        canonical={`https://www.smartkitnow.com/conversion/${subcategory || ""}`}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate(`/conversion`)}
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
                  Fast unit conversions with accurate results and easy inputs.
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
            <p className="text-center" style={{ color: "#747886" }}>No converters found yet in this subcategory.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <Card key={calc.slug} className="group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <span className="inline-flex items-center justify-center rounded-xl"
                          style={{ width: 40, height: 40, backgroundColor: "rgba(168,85,247,0.14)", color: "#a855f7" }} aria-hidden="true">
                      <Scale className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-lg font-semibold" style={{ color: "#000000" }}>
                      <CalculatorLink to={calcLink(calc)}>{calc.title}</CalculatorLink>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: "#747886" }}>
                      {calc.description || "Open converter"}
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
