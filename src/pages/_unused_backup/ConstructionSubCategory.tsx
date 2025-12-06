// src/pages/ConstructionSubCategory.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CalculatorLink from "@/components/common/CalculatorLink";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
  FRIENDLY_TITLES,
  calcLink,
} from "@/data/calculatorRegistry";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function ConstructionSubCategory() {
  const category = "construction";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculators = subcategory
    ? listByCategorySubcategory(category, subcategory)
    : [];

  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[category]?.[subcategory]) ||
    (subcategory
      ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
      : "Calculators");

  const categoryTitle = FRIENDLY_TITLES[category] || "Construction Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Professional construction calculators in ${subcatTitle}. Accurate project planning and material estimation.`}
        canonical={`https://www.smartkitnow.com/${category}/${subcategory || ""}`}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              {/* Back à esquerda */}
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate(`/${category}`)}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              {/* Título + Subtítulo centralizados */}
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  {subcatTitle}
                </h1>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: "#747886" }}>
                  Professional construction calculators for accurate project planning and material estimation.
                </p>
              </div>
            </div>
          }
          showRails={false}
        >
          {/* 1/2/3 colunas — 3 cards centralizados dentro do miolo */}
          {!calculators || calculators.length === 0 ? (
            <p className="text-center" style={{ color: "#747886" }}>
              No calculators found yet in this subcategory.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold transition-colors">
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
