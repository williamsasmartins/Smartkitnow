// src/pages/ConversionSubCategory.tsx
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
  ArrowLeft, Ruler, Thermometer, Gauge, Weight, Scale3D, Tangent, HardDrive, Timer, Calculator, LineChart
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

// ÍCONES coloridos por calculadora (slug/name)
type IconSpec = { Icon: React.ComponentType<any>; color: string; bg: string };
const DEF: IconSpec = { Icon: Calculator, color: "#8b5cf6", bg: "rgba(139,92,246,0.14)" };

const RULES: Array<{ test: (k: string) => boolean; spec: IconSpec }> = [
  { test: k => /length|meter|inch|foot|yard|mile|km/.test(k),       spec: { Icon: Ruler,       color: "#22c55e", bg: "rgba(34,197,94,0.14)" } },
  { test: k => /area|m2|ft2|sq/.test(k),                             spec: { Icon: Scale3D,     color: "#06b6d4", bg: "rgba(6,182,212,0.14)" } },
  { test: k => /volume|liter|gallon|ml|l|oz|ft3|m3/.test(k),         spec: { Icon: Tangent,     color: "#3b82f6", bg: "rgba(59,130,246,0.14)" } },
  { test: k => /mass|weight|kg|lb|gram|ounce/.test(k),               spec: { Icon: Weight,      color: "#a855f7", bg: "rgba(168,85,247,0.14)" } },
  { test: k => /temp|temperature|celsius|fahrenheit|kelvin/.test(k), spec: { Icon: Thermometer, color: "#ef4444", bg: "rgba(239,68,68,0.14)" } },
  { test: k => /speed|velocity|mph|km\/h|knot/.test(k),              spec: { Icon: Gauge,       color: "#f59e0b", bg: "rgba(245,158,11,0.14)" } },
  { test: k => /data|byte|kb|mb|gb|tb/.test(k),                      spec: { Icon: HardDrive,   color: "#14b8a6", bg: "rgba(20,184,166,0.14)" } },
  { test: k => /time|second|min|hour|day/.test(k),                   spec: { Icon: Timer,       color: "#f97316", bg: "rgba(249,115,22,0.14)" } },
  { test: k => /ratio|proportion|percent|‰|per/.test(k),             spec: { Icon: LineChart,   color: "#22c55e", bg: "rgba(34,197,94,0.14)" } },
];

function iconForCalc(slug: string, name: string): IconSpec {
  const k = `${slug} ${name}`.toLowerCase();
  const r = RULES.find(x => x.test(k));
  return r ? r.spec : DEF;
}

export default function ConversionSubCategory() {
  const category = "conversion";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculators = subcategory ? listByCategorySubcategory(category, subcategory) : [];
  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[subcategory]) ||
    (subcategory ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Calculators");
  const categoryTitle = FRIENDLY_TITLES[category] || "Conversion Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Unit conversions: ${subcatTitle}. Accurate, fast calculators with clear results.`}
        canonical={`https://www.smartkitnow.com/conversion/${subcategory || ""}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: categoryTitle, url: "https://www.smartkitnow.com/conversion" },
          { name: subcatTitle, url: `https://www.smartkitnow.com/conversion/${subcategory || ""}` },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${subcatTitle} — ${categoryTitle}`,
          url: `https://www.smartkitnow.com/conversion/${subcategory || ""}`,
          description: `List of ${subcatTitle} calculators on SmartKitNow.`,
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
                  Professional unit conversion tools with sensible defaults and clean UI.
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
            <p className="text-center" style={{ color: "#747886" }}>No calculators found yet in this subcategory.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => {
                const { Icon, color, bg } = iconForCalc(calc.slug, calc.name);
                return (
                  <Link key={calc.slug} to={`/conversion/${calc.subcategory}/${calc.slug}`} className="group block">
                    <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                      <CardHeader className="flex flex-row items-center gap-3">
                        <span className="inline-flex items-center justify-center rounded-xl"
                              style={{ width: 40, height: 40, backgroundColor: bg, color }} aria-hidden="true">
                          <Icon className="h-5 w-5" />
                        </span>
                        <CardTitle className="text-lg font-semibold" style={{ color: "#3c83f6" }}>
                          {calc.name}
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
