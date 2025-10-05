// src/pages/HealthSubCategory.tsx
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  listByCategorySubcategory,
  SUBCATEGORY_TITLES,
  FRIENDLY_TITLES,
} from "@/data/calculatorRegistry";
import {
  ArrowLeft,
  Activity,
  Apple,
  Dumbbell,
  Flame,
  HeartPulse,
  Ruler,
  Scale,
  Beef,
  Droplets,
  Salad,
  GaugeCircle,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

/**
 * Maps ICON + COLORS by calculator (slug/name) — colored badge like on home.
 * Simple rules by keyword; if no match, falls back to DEFAULT_ICON.
 */
type IconSpec = { Icon: React.ComponentType<any>; color: string; bg: string };

const DEFAULT_ICON: IconSpec = {
  Icon: HeartPulse,
  color: "#8b5cf6",           // roxo
  bg: "rgba(139,92,246,0.12)",
};

const RULES: Array<{ test: (key: string) => boolean; spec: IconSpec }> = [
  // Body measurements / anthropometry
  { test: k => /body|measurement|waist|hip|neck|height|weight/.test(k), spec: { Icon: Ruler, color: "#22c55e", bg: "rgba(34,197,94,0.12)" } }, // green
  // BMI / IMC
  { test: k => /\bbmi\b|mass index/.test(k), spec: { Icon: Activity, color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" } }, // sky
  // BMR
  { test: k => /\bbmr\b|basal metabolic/.test(k), spec: { Icon: Flame, color: "#ef4444", bg: "rgba(239,68,68,0.12)" } }, // red
  // TDEE / gasto diário
  { test: k => /\btdee\b|expenditure|energy daily/.test(k), spec: { Icon: Dumbbell, color: "#06b6d4", bg: "rgba(6,182,212,0.12)" } }, // cyan
  // Calorias / ingestão calórica
  { test: k => /calorie|calories|intake/.test(k), spec: { Icon: Apple, color: "#f97316", bg: "rgba(249,115,22,0.12)" } }, // orange
  // Converter calorias → kg
  { test: k => /kilogram|kg.*cal|cal.*kg/.test(k), spec: { Icon: Scale, color: "#a855f7", bg: "rgba(168,85,247,0.12)" } }, // purple
  // Água / hidratação
  { test: k => /water|hydration/.test(k), spec: { Icon: Droplets, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" } }, // blue
  // Macro / proteína
  { test: k => /protein|macro|carb|fat|keto|diet/.test(k), spec: { Icon: Beef, color: "#ef4444", bg: "rgba(239,68,68,0.12)" } }, // red
  // Saúde geral
  { test: k => /health|heart|pulse|cardio/.test(k), spec: { Icon: HeartPulse, color: "#e11d48", bg: "rgba(225,29,72,0.12)" } }, // rose
  // Nutrição genérica
  { test: k => /nutrition|meal|foods?|vegan|vegetarian/.test(k), spec: { Icon: Salad, color: "#22c55e", bg: "rgba(34,197,94,0.12)" } }, // green
  // Medidores / vários
  { test: k => /score|index|meter|gauge/.test(k), spec: { Icon: GaugeCircle, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" } }, // amber
];

function iconForCalculator(slug: string, name: string): IconSpec {
  const key = `${slug} ${name}`.toLowerCase();
  const rule = RULES.find(r => r.test(key));
  return rule ? rule.spec : DEFAULT_ICON;
}

export default function HealthSubCategory() {
  const category = "health";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculators = subcategory
    ? listByCategorySubcategory(category, subcategory)
    : [];

  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[subcategory]) ||
    (subcategory
      ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
      : "Calculators");

  const categoryTitle = FRIENDLY_TITLES[category] || "Health & Fitness Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Health & fitness calculators: ${subcatTitle}. Track, plan, and optimize your goals with clarity.`}
        canonical={`https://www.smartkitnow.com/health/${subcategory || ""}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/health" },
          { name: subcatTitle, url: `https://www.smartkitnow.com/health/${subcategory || ""}` },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${subcatTitle} — ${categoryTitle}`,
          url: `https://www.smartkitnow.com/health/${subcategory || ""}`,
          description: `List of ${subcatTitle} calculators on SmartKitNow.`,
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              {/* Back to the left */}
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate(`/health`)}
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
                  Professional health & fitness calculators for accurate planning and insights.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
          railsSticky={false} // produção segura (AdSense)
        >
          {/* Cards with colored icon + name + description */}
          {!calculators || calculators.length === 0 ? (
            <p className="text-center" style={{ color: "#747886" }}>
              No calculators found yet in this subcategory.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => {
                const { Icon, color, bg } = iconForCalculator(calc.slug, calc.title);
                return (
                  <Link
                    key={calc.slug}
                    to={`/health/${calc.subcategory}/${calc.slug}`}
                    className="group block"
                  >
                    <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                      <CardHeader className="flex flex-row items-center gap-3">
                        {/* Colored badge with icon (same visual pattern as /health and home) */}
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
                          className="text-lg font-semibold transition-colors"
                          style={{ color: "#3c83f6" }}
                        >
                          {calc.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm" style={{ color: "#747886" }}>
                          {calc.description || "Open calculator"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
