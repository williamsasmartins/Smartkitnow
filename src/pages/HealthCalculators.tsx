// src/pages/HealthCalculators.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { listSubcategoriesOfCategory, FRIENDLY_TITLES, subcategoryIcon } from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function HealthCalculators() {
  const navigate = useNavigate();
  const category = "health";
  const subcats = listSubcategoriesOfCategory(category);
  const categoryTitle = FRIENDLY_TITLES[category] || "Health & Fitness Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${categoryTitle} · SmartKitNow`}
        description="Accurate health & fitness calculators: BMI, BMR, TDEE, calorie intake, and more — with clear explanations."
        canonical="https://www.smartkitnow.com/health"
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/health" },
        ]}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div className="text-center">
              {/* Back aligned to the left */}
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
                Health, nutrition, and fitness tools to plan goals, track progress, and understand
                your numbers—designed for clarity on any device.
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
            {subcats.map((sc) => {
              const emoji = subcategoryIcon(sc.slug, category);
              return (
                <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    {/* Emoji badge matching menu icons */}
                    <span
                      className="inline-flex items-center justify-center rounded-xl text-xl"
                      style={{ width: 40, height: 40 }}
                      aria-hidden="true"
                    >
                      {emoji}
                    </span>
                    <CardTitle
                      className="text-xl font-bold transition-colors"
                      style={{ color: "#000000" }}
                    >
                      <CalculatorLink to={`/health/${sc.slug}`}>{sc.title}</CalculatorLink>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: "#747886" }}>
                      {sc.count} calculators available
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
