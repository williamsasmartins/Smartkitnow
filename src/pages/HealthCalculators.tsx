// src/pages/HealthCalculators.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Apple, Dumbbell, Flame, HeartPulse, Ruler } from "lucide-react";
import { listSubcategoriesOfCategory, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";

/**
 * ÍCONES COLORIDOS POR SUBCATEGORIA (seguindo o padrão da home)
 * - Se a subcategoria não estiver mapeada, cai no default (HeartPulse roxo).
 * - Cores: ícone com cor viva + “badge” arredondado com fundo suave.
 */
const ICONS_BY_SUBCAT: Record<
  string,
  { Icon: React.ComponentType<any>; color: string; bg: string }
> = {
  // Health
  "body-measurement-calculators": { Icon: Ruler,      color: "#22c55e", bg: "rgba(34,197,94,0.12)" },   // green
  "diet-nutrition-calculators":   { Icon: Apple,      color: "#f97316", bg: "rgba(249,115,22,0.12)" },  // orange
  "calories-conversion":          { Icon: Flame,      color: "#ef4444", bg: "rgba(239,68,68,0.12)" },   // red
  "fitness-calculators":          { Icon: Dumbbell,   color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },   // cyan
};

const DEFAULT_ICON = { Icon: HeartPulse, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" }; // purple

function getIconForSubcat(slug: string) {
  return ICONS_BY_SUBCAT[slug] || DEFAULT_ICON;
}

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
              const { Icon, color, bg } = getIconForSubcat(sc.slug);
              return (
                <Link key={sc.slug} to={`/health/${sc.slug}`} className="group block">
                  <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center gap-3">
                      {/* Badge colorido com ícone */}
                      <span
                        className="inline-flex items-center justify-center rounded-xl"
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: bg,
                          color,
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle
                        className="text-xl font-bold transition-colors"
                        style={{ color: "#3c83f6" }}
                      >
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
