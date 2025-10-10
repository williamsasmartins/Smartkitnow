// src/pages/ConstructionCalculators.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { listSubcategoriesOfCategory, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function ConstructionCalculators() {
  const navigate = useNavigate();
  const category = "construction";
  const subcats = listSubcategoriesOfCategory(category);
  const categoryTitle = FRIENDLY_TITLES[category] || "Construction Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${categoryTitle} · SmartKitNow`}
        description="Comprehensive construction calculators for building materials, measurements, costs, and project planning."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: `https://www.smartkitnow.com/${category}` },
        ]}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div className="text-center">
              {/* Back alinhado à esquerda */}
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

              <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                {categoryTitle}
              </h1>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                Comprehensive construction calculators for building materials, measurements,
                costs, and project planning. From concrete and lumber to roofing and flooring calculations.
              </p>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
          railsSticky={false} // produção segura (AdSense)
        >
          {/* Grid 1/2/3 colunas centralizada dentro do miolo (320/728/970) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subcats.map((sc) => (
              <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold transition-colors" style={{ color: "#000000" }}>
                    <CalculatorLink to={`/${category}/${sc.slug}`}>{sc.title}</CalculatorLink>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: "#747886" }}>
                    {sc.count} calculators available
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
