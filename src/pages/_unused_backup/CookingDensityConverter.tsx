// src/pages/CookingDensityConverter.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Soup } from "lucide-react";
import SEOHead from "@/components/SEOHead";

/**
 * Conversor com densidade para cozinha/padaria
 * - Converte massa <-> volume usando densidade (g/mL)
 * - Unidades de massa: g, kg, oz, lb
 * - Unidades de volume: mL, L, tsp, tbsp, cup
 * - Ingredientes pré-definidos (densidades típicas) + densidade manual
 * - No ads (calculator page)
 */

type Unit =
  | "g" | "kg" | "oz" | "lb"
  | "ml" | "l" | "tsp" | "tbsp" | "cup";

const MASS_UNITS: Unit[] = ["g", "kg", "oz", "lb"];
const VOLUME_UNITS: Unit[] = ["ml", "l", "tsp", "tbsp", "cup"];

const ML_PER_L = 1000;
const ML_PER_TSP = 4.928921594; // US teaspoon
const ML_PER_TBSP = 14.78676478; // US tablespoon
const ML_PER_CUP = 236.5882365; // US cup
const G_PER_OZ = 28.349523125;
const G_PER_LB = 453.59237;

// densidade em g/mL (aproximações culinárias)
const DENSITY: Record<string, { name: string; gPerMl: number }> = {
  water:               { name: "Water",               gPerMl: 1.000 },
  milk:                { name: "Milk",                gPerMl: 1.030 },
  olive_oil:           { name: "Olive Oil",           gPerMl: 0.915 },
  butter:              { name: "Butter",              gPerMl: 0.911 },
  sugar_granulated:    { name: "Sugar (granulated)",  gPerMl: 0.845 },
  sugar_powdered:      { name: "Sugar (powdered)",    gPerMl: 0.560 },
  flour_ap:            { name: "Flour (all-purpose)", gPerMl: 0.593 },
  flour_bread:         { name: "Flour (bread)",       gPerMl: 0.627 },
  salt_table:          { name: "Salt (table)",        gPerMl: 1.217 },
  salt_kosher:         { name: "Salt (kosher)",       gPerMl: 0.720 },
  beer:                { name: "Beer",                gPerMl: 1.010 },
};

const PRESET_BY_SLUG: Record<string, { title: string; defaultKey?: keyof typeof DENSITY }> = {
  "flour-conversion":       { title: "Flour Conversion",       defaultKey: "flour_ap" },
  "salt-conversion":        { title: "Salt Conversion",        defaultKey: "salt_table" },
  "sugar-conversion":       { title: "Sugar Conversion",       defaultKey: "sugar_granulated" },
  "ingredient-conversion":  { title: "Cooking Ingredient Conversion", defaultKey: "water" },
  "beer-conversion":        { title: "Beer Conversion",        defaultKey: "beer" },
  "butter-conversion":      { title: "Butter Conversion",      defaultKey: "butter" },
};

function isMass(u: Unit)   { return MASS_UNITS.includes(u); }
function isVolume(u: Unit) { return VOLUME_UNITS.includes(u); }

// massa <-> massa
function massToGrams(x: number, from: Unit): number {
  switch (from) {
    case "g":  return x;
    case "kg": return x * 1000;
    case "oz": return x * G_PER_OZ;
    case "lb": return x * G_PER_LB;
    default:   return NaN;
  }
}
function gramsToMass(g: number, to: Unit): number {
  switch (to) {
    case "g":  return g;
    case "kg": return g / 1000;
    case "oz": return g / G_PER_OZ;
    case "lb": return g / G_PER_LB;
    default:   return NaN;
  }
}

// volume <-> volume
function volumeToMl(x: number, from: Unit): number {
  switch (from) {
    case "ml":  return x;
    case "l":   return x * ML_PER_L;
    case "tsp": return x * ML_PER_TSP;
    case "tbsp":return x * ML_PER_TBSP;
    case "cup": return x * ML_PER_CUP;
    default:    return NaN;
  }
}
function mlToVolume(ml: number, to: Unit): number {
  switch (to) {
    case "ml":  return ml;
    case "l":   return ml / ML_PER_L;
    case "tsp": return ml / ML_PER_TSP;
    case "tbsp":return ml / ML_PER_TBSP;
    case "cup": return ml / ML_PER_CUP;
    default:    return NaN;
  }
}

/** Converte com densidade:
 * - massa -> volume:  ml = g / (g/ml)
 * - volume -> massa:  g  = ml * (g/ml)
 * - mesma dimensão:   usa só conversão de unidade
 */
function convertWithDensity(value: number, from: Unit, to: Unit, gPerMl: number): number {
  if (!Number.isFinite(value) || value < 0) return NaN;

  // mesma dimensão
  if (isMass(from) && isMass(to)) {
    const g = massToGrams(value, from);
    return gramsToMass(g, to);
  }
  if (isVolume(from) && isVolume(to)) {
    const ml = volumeToMl(value, from);
    return mlToVolume(ml, to);
  }

  // cruzado via densidade
  if (isMass(from) && isVolume(to)) {
    const g = massToGrams(value, from);
    const ml = g / gPerMl;
    return mlToVolume(ml, to);
  }
  if (isVolume(from) && isMass(to)) {
    const ml = volumeToMl(value, from);
    const g = ml * gPerMl;
    return gramsToMass(g, to);
  }

  return NaN;
}

export default function CookingDensityConverter() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const preset = PRESET_BY_SLUG[slug || ""] || {
    title: "Cooking & Baking Conversion",
    defaultKey: "water" as keyof typeof DENSITY,
  };

  const [ingredientKey, setIngredientKey] = React.useState<keyof typeof DENSITY>(
    preset.defaultKey || "water"
  );
  const [useCustomDensity, setUseCustomDensity] = React.useState(false);
  const [customDensity, setCustomDensity] = React.useState<string>("1.000");

  const [fromUnit, setFromUnit] = React.useState<Unit>("g");
  const [toUnit, setToUnit]     = React.useState<Unit>("ml");
  const [input, setInput]       = React.useState<string>("100");

  const activeDensity = useCustomDensity
    ? Number.parseFloat(customDensity || "1")
    : DENSITY[ingredientKey]?.gPerMl || 1;

  const result = React.useMemo(() => {
    const v = Number.parseFloat(input);
    if (Number.isNaN(v)) return NaN;
    return convertWithDensity(v, fromUnit, toUnit, activeDensity);
  }, [input, fromUnit, toUnit, activeDensity]);

  const pageTitle = `${preset.title} - SmartKitNow`;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={pageTitle}
        description="Convert between weight and volume for common cooking & baking ingredients using density."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
          { name: "Cooking & Baking Converters", url: "https://www.smartkitnow.com/conversion" },
          { name: preset.title, url: typeof window !== "undefined" ? window.location.href : "" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: pageTitle,
          description:
            "Converter for cooking & baking ingredients: convert weight and volume using density (g/mL).",
          step: [
            { "@type": "HowToStep", name: "Choose ingredient", text: "Pick a preset or enter a custom density." },
            { "@type": "HowToStep", name: "Enter value & units", text: "Select from/to units and type a value." },
            { "@type": "HowToStep", name: "Convert", text: "Result updates automatically." },
          ],
        }}
      />

      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back */}
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

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center rounded-xl"
              style={{ width: 44, height: 44, backgroundColor: "rgba(249,115,22,0.14)", color: "#f97316" }}
              aria-hidden="true"
            >
              <Soup className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#5c82ee" }}>
                {preset.title}
              </h1>
              <p className="text-muted-foreground" style={{ color: "#747886" }}>
                Convert weight and volume using ingredient density (g/mL).
              </p>
            </div>
          </div>

          {/* Card principal */}
          <Card className="bg-card border-border/50">
            <CardContent className="p-6 space-y-6">
              {/* Ingrediente / densidade */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Ingredient</label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm"
                    value={ingredientKey}
                    onChange={(e) => setIngredientKey(e.target.value as keyof typeof DENSITY)}
                    disabled={useCustomDensity}
                  >
                    {Object.entries(DENSITY).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                  <label className="mt-3 inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={useCustomDensity}
                      onChange={(e) => setUseCustomDensity(e.target.checked)}
                    />
                    Use custom density
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Density (g/mL)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm"
                    value={useCustomDensity ? customDensity : (DENSITY[ingredientKey]?.gPerMl ?? 1).toFixed(3)}
                    onChange={(e) => setCustomDensity(e.target.value)}
                    disabled={!useCustomDensity}
                  />
                  <p className="mt-1 text-xs" style={{ color: "#747886" }}>
                    Typical values: Water 1.000, Milk 1.030, Olive Oil 0.915, AP Flour 0.593, Granulated Sugar 0.845, Table Salt 1.217, Butter 0.911, Beer 1.010.
                  </p>
                </div>
              </div>

              {/* Unidades + valor */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm">From unit</label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value as Unit)}
                  >
                    {[...MASS_UNITS, ...VOLUME_UNITS].map((u) => (
                      <option key={u} value={u}>{u.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm">To unit</label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm"
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value as Unit)}
                  >
                    {[...MASS_UNITS, ...VOLUME_UNITS].map((u) => (
                      <option key={u} value={u}>{u.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Value</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Resultado */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Result</label>
                  <input
                    readOnly
                    className="w-full rounded-lg border bg-muted/50 px-3 py-2 shadow-sm"
                    value={
                      Number.isFinite(result)
                        ? String(result)
                        : "—"
                    }
                  />
                </div>
                <div className="text-sm self-end" style={{ color: "#747886" }}>
                  {isMass(fromUnit) && isVolume(toUnit) && (
                    <p>
                      Formula: <em>volume (mL) = mass (g) ÷ density (g/mL)</em>
                    </p>
                  )}
                  {isVolume(fromUnit) && isMass(toUnit) && (
                    <p>
                      Formula: <em>mass (g) = volume (mL) × density (g/mL)</em>
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-xs" style={{ color: "#8a6d3b" }}>
                <strong>Note:</strong> densities vary by brand, grind, humidity, temperature, and packing method.
                Values here são aproximados para uso culinário.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
