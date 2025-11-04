// src/pages/PetsSubCategory.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";
import { FRIENDLY_TITLES, SUBCATEGORY_TITLES, listByCategorySubcategory, calcPath } from "@/data/calculatorRegistry";
import type { CalculatorEntry } from "@/data/calculatorRegistry";

import { Dumbbell, Scale, Flame, Apple, Heart, ShieldPlus, ClipboardList, PawPrint, AlertTriangle, DollarSign } from "lucide-react";

// Icon mapping rules to give dog-themed visuals
const RULES: Array<{ pattern: RegExp; spec: IconSpec }> = [
  { pattern: /weight|diet|fat|calorie|loss|gain|rer|mer/, spec: { Icon: Dumbbell, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" } },
  { pattern: /water|hydration|drink|intake/, spec: { Icon: Scale, color: "#10b981", bg: "rgba(16,185,129,0.12)" } },
  { pattern: /caffeine|chocolate|xylitol|grape|raisin|allium|tox|poison|exposure/, spec: { Icon: AlertTriangle, color: "#ef4444", bg: "rgba(239,68,68,0.12)" } },
  { pattern: /life|age|stage|senior|puppy|growth|adult/, spec: { Icon: PawPrint, color: "#8b5cf6", bg: "rgba(139,92,246,0.14)" } },
  { pattern: /quality|health|care/, spec: { Icon: Heart, color: "#ef4444", bg: "rgba(239,68,68,0.12)" } },
  { pattern: /cost|finance|price|budget|ownership/, spec: { Icon: DollarSign, color: "#22c55e", bg: "rgba(34,197,94,0.14)" } },
];

type IconSpec = { Icon: React.ComponentType<any>; color: string; bg: string };
const DEF: IconSpec = { Icon: ClipboardList, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" };

function iconForCalc(slug: string, name: string): IconSpec {
  const k = `${slug} ${name}`.toLowerCase();
  const r = RULES.find(x => x.pattern.test(k));
  return r ? r.spec : DEF;
}

export default function PetsSubCategory() {
  const category = "pets";
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const calculatorsAll = subcategory ? listByCategorySubcategory(category, subcategory) : [];
  // Dog-only filter: allow dog-specific and relevant general tools; exclude other species
  const dogOnlyFilter = (c: CalculatorEntry) => {
    const k = `${c.slug} ${c.title}`.toLowerCase();
    const allowGenerics = /quality|cost|emergency|life|age to human|lifespan|ownership|drug|dose/.test(k);
    const isDog = /dog|canine|puppy/.test(k);
    const notDogSpecies = /(cat|feline|kitten|aquarium|fish|reptile|terrarium|bird|cage)/.test(k);
    if (notDogSpecies) return false;
    return isDog || allowGenerics;
  };
  const calculators = calculatorsAll.filter(dogOnlyFilter);

  const subcatTitle =
    (subcategory && SUBCATEGORY_TITLES[category]?.[subcategory]) ||
    (subcategory ? subcategory.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Calculators");
  const categoryTitle = FRIENDLY_TITLES[category] || "Pets Calculators";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${subcatTitle} — ${categoryTitle} · SmartKitNow`}
        description={`Dog care calculators: ${subcatTitle}. Health, nutrition, and care for dogs.`}
        canonical={`https://www.smartkitnow.com/pets/${subcategory || ""}`}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate(`/pets`)}
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
                  Practical dog care tools for planning diet, tracking health, and more.
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
            <p className="text-center" style={{ color: "#747886" }}>No dog calculators found yet in this subcategory.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {calculators.map((calc) => {
                const { Icon, color, bg } = iconForCalc(calc.slug, calc.title);
                return (
                  <Card key={calc.slug} className="group/card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-xl"
                            style={{ width: 40, height: 40, backgroundColor: bg, color }} aria-hidden="true">
                        <Icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-lg font-semibold" style={{ color: "#000000" }}>
                        <CalculatorLink to={calcPath(calc)}>{calc.title}</CalculatorLink>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm" style={{ color: "#747886" }}>
                        {calc.description || "Open calculator"}
                      </p>
                    </CardContent>
                  </Card>
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
