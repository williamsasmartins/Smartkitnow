// src/pages/PetsCalculators.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dog, Cat, PawPrint, Bone, Fish, HeartPulse } from "lucide-react";
import { listSubcategoriesOfCategory, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";

// Ícones coloridos por subcategoria (ajuste pelos slugs reais do seu registry)
const ICONS_BY_SUBCAT: Record<string, { Icon: React.ComponentType<any>; color: string; bg: string }> = {
  "dog-calculators":     { Icon: Dog,       color: "#f59e0b", bg: "rgba(245,158,11,0.14)" }, // amber
  "cat-calculators":     { Icon: Cat,       color: "#22c55e", bg: "rgba(34,197,94,0.14)" },  // green
  "pet-nutrition":       { Icon: Bone,      color: "#06b6d4", bg: "rgba(6,182,212,0.14)" },  // cyan
  "pet-health-fitness":  { Icon: HeartPulse,color: "#ef4444", bg: "rgba(239,68,68,0.14)" },  // red
  "aquatic-pets":        { Icon: Fish,      color: "#3b82f6", bg: "rgba(59,130,246,0.14)" }, // blue
};
const DEFAULT_ICON = { Icon: PawPrint, color: "#8b5cf6", bg: "rgba(139,92,246,0.14)" };

function getIconForSubcat(slug: string) {
  return ICONS_BY_SUBCAT[slug] || DEFAULT_ICON;
}

export default function PetsCalculators() {
  const navigate = useNavigate();
  const category = "pets";
  const subcats = listSubcategoriesOfCategory(category);
  const categoryTitle = FRIENDLY_TITLES[category] || "Pets Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${categoryTitle} · SmartKitNow`}
        description="Pet calculators for dogs, cats, nutrition, and health — fast and easy."
        canonical="https://www.smartkitnow.com/pets"
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/pets" },
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

              <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                {categoryTitle}
              </h1>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                Practical tools for pet health, nutrition, and care — made simple.
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
                <Link key={sc.slug} to={`/pets/${sc.slug}`} className="group block">
                  <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-xl"
                            style={{ width: 40, height: 40, backgroundColor: bg, color }} aria-hidden="true">
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-xl font-bold" style={{ color: "#3c83f6" }}>
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
