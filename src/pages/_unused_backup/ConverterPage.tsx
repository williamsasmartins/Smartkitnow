// src/pages/ConverterPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Ruler, Thermometer, Gauge, Weight, Tangent, Timer, Scale3D } from "lucide-react";
import SEOHead from "@/components/SEOHead";

function titleCaseSlug(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function badgeForGroup(group?: string) {
  const map: Record<string, { color: string; bg: string; Icon: React.ComponentType<any> }> = {
    length:       { color: "#22c55e", bg: "rgba(34,197,94,0.14)", Icon: Ruler },
    area:         { color: "#06b6d4", bg: "rgba(6,182,212,0.14)", Icon: Scale3D },
    volume:       { color: "#3b82f6", bg: "rgba(59,130,246,0.14)", Icon: Tangent },
    weight:       { color: "#a855f7", bg: "rgba(168,85,247,0.14)", Icon: Weight },
    temperature:  { color: "#ef4444", bg: "rgba(239,68,68,0.14)", Icon: Thermometer },
    speed:        { color: "#f59e0b", bg: "rgba(245,158,11,0.14)", Icon: Gauge },
    time:         { color: "#f97316", bg: "rgba(249,115,22,0.14)", Icon: Timer },
    energy:       { color: "#3b82f6", bg: "rgba(59,130,246,0.14)", Icon: Calculator },
    electrical:   { color: "#14b8a6", bg: "rgba(20,184,166,0.14)", Icon: Gauge },
    "fuel-economy":{ color: "#22c55e", bg: "rgba(34,197,94,0.14)", Icon: Gauge },
  };
  return map[group || ""] || { color: "#8b5cf6", bg: "rgba(139,92,246,0.14)", Icon: Calculator };
}

type Lin = { a: number; b?: number };
type Fn = (x: number) => number;
type Rule =
  | { type: "linear"; fn: Lin }
  | { type: "function"; fn: Fn };

const rules: Record<string, Rule> = {
  "deg-to-rad":       { type: "linear", fn: { a: Math.PI / 180 } },
  "rad-to-deg":       { type: "linear", fn: { a: 180 / Math.PI } },
  "deg-to-mrad":      { type: "linear", fn: { a: (Math.PI / 180) * 1000 } },
  "mrad-to-deg":      { type: "linear", fn: { a: (180 / Math.PI) / 1000 } },

  "sqft-to-sqm":      { type: "linear", fn: { a: 0.09290304 } },
  "sqm-to-sqft":      { type: "linear", fn: { a: 10.76391041671 } },
  "sqmi-to-sqkm":     { type: "linear", fn: { a: 2.589988110336 } },
  "sqkm-to-sqmi":     { type: "linear", fn: { a: 1 / 2.589988110336 } },

  "kohm-to-ohm":      { type: "linear", fn: { a: 1000 } },
  "mohm-to-ohm":      { type: "linear", fn: { a: 1_000_000 } },
  "ohm-to-kohm":      { type: "linear", fn: { a: 1 / 1000 } },
  "milliohm-to-ohm":  { type: "linear", fn: { a: 0.001 } },

  "kcal-to-cal":      { type: "linear", fn: { a: 1000 } },
  "mj-to-kwh":        { type: "linear", fn: { a: 0.2777777778 } },
  "mwh-to-kwh":       { type: "linear", fn: { a: 1000 } },
  "mmbtu-to-mwh":     { type: "linear", fn: { a: 0.29307107 } },

  "mpg-to-km-per-l":  { type: "linear", fn: { a: 0.425143707 } },
  "km-per-l-to-mpg":  { type: "linear", fn: { a: 2.35214583 } },
  "mpg-to-l-per-100km": { type: "function", fn: (x) => (x > 0 ? 235.214583 / x : NaN) },
  "l-per-100km-to-mpg": { type: "function", fn: (x) => (x > 0 ? 235.214583 / x : NaN) },

  "in-to-cm":         { type: "linear", fn: { a: 2.54 } },
  "cm-to-in":         { type: "linear", fn: { a: 1 / 2.54 } },
  "ft-to-m":          { type: "linear", fn: { a: 0.3048 } },
  "m-to-ft":          { type: "linear", fn: { a: 3.280839895 } },

  "mph-to-kmh":       { type: "linear", fn: { a: 1.609344 } },
  "kmh-to-mph":       { type: "linear", fn: { a: 0.6213711922 } },
  "fts-to-mph":       { type: "linear", fn: { a: 0.681818182 } },
  "mph-to-ms":        { type: "linear", fn: { a: 0.44704 } },

  "f-to-c":           { type: "function", fn: (x) => (x - 32) * 5 / 9 },
  "c-to-f":           { type: "function", fn: (x) => x * 9 / 5 + 32 },
  "f-to-k":           { type: "function", fn: (x) => (x - 32) * 5 / 9 + 273.15 },
  "c-to-k":           { type: "function", fn: (x) => x + 273.15 },

  "sec-to-min":       { type: "linear", fn: { a: 1 / 60 } },
  "min-to-sec":       { type: "linear", fn: { a: 60 } },
  "sec-to-hr":        { type: "linear", fn: { a: 1 / 3600 } },
  "hr-to-sec":        { type: "linear", fn: { a: 3600 } },

  "tbsp-to-cup":      { type: "linear", fn: { a: 1 / 16 } },
  "cm3-to-m3":        { type: "linear", fn: { a: 1e-6 } },
  "gal-to-l":         { type: "linear", fn: { a: 3.785411784 } },
  "tsp-to-ml":        { type: "linear", fn: { a: 4.928921594 } },

  "lb-to-kg":         { type: "linear", fn: { a: 0.45359237 } },
  "kg-to-lb":         { type: "linear", fn: { a: 2.20462262185 } },
  "oz-to-g":          { type: "linear", fn: { a: 28.349523125 } },
  "g-to-oz":          { type: "linear", fn: { a: 1 / 28.349523125 } },
};

const requiresDensity = new Set([
  "g-to-ml", "ml-to-g", "mg-to-ml", "ml-to-mg",
]);

function compute(slug: string, x: number): number {
  const r = rules[slug];
  if (!r) return NaN;
  if (r.type === "linear") return (r.fn.a * x) + (r.fn.b || 0);
  return r.fn(x);
}

export default function ConverterPage() {
  const { group, slug } = useParams<{ group: string; slug: string }>();
  const navigate = useNavigate();

  const [from, to] = (slug || "").split("-to-");
  const prettyName = slug ? `${from?.toUpperCase()} → ${to?.toUpperCase()}` : "Converter";
  const pageTitle = `${titleCaseSlug(group || "conversion")} · ${prettyName} - SmartKitNow`;

  const { color, bg, Icon } = badgeForGroup(group);

  const [input, setInput] = React.useState<string>("1");
  const value = Number.parseFloat(input);
  const canCompute = !Number.isNaN(value) && !requiresDensity.has(slug || "");

  const result = React.useMemo(() => {
    if (!canCompute) return NaN;
    return compute(slug || "", value);
  }, [value, slug, canCompute]);

  const [dir, setDir] = React.useState<"forward" | "reverse">("forward");
  const inverseKey = React.useMemo(() => {
    if (!slug) return "";
    const [a, b] = slug.split("-to-");
    return `${b}-to-${a}`;
  }, [slug]);
  const hasInverse = Boolean(rules[inverseKey]) || requiresDensity.has(inverseKey);

  const activeSlug = dir === "forward" ? (slug || "") : inverseKey;
  const [aFrom, aTo] = activeSlug.split("-to-");
  const activePretty = `${(aFrom || "").toUpperCase()} → ${(aTo || "").toUpperCase()}`;
  const showDensityNote = requiresDensity.has(activeSlug);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={pageTitle}
        description={`Convert ${from || ""} to ${to || ""} in the ${group || "conversion"} category. Fast, accurate unit conversion.`}
        canonical={`https://www.smartkitnow.com/conversion/${group || ""}/${slug || ""}`}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
          ...(group ? [{ name: titleCaseSlug(group), url: `https://www.smartkitnow.com/conversion/${group}` }] : []),
          ...(slug ? [{ name: titleCaseSlug(slug), url: `https://www.smartkitnow.com/conversion/${group}/${slug}` }] : []),
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: pageTitle,
          description: `Guide to convert ${from || ""} to ${to || ""}.`,
          step: [
            { "@type": "HowToStep", name: "Enter value", text: "Type the value you want to convert." },
            { "@type": "HowToStep", name: "Convert", text: "The result appears automatically." },
            { "@type": "HowToStep", name: "Swap", text: "Use the swap button to invert the direction." },
          ],
        }}
      />

      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
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

          <div className="mb-6 flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center rounded-xl"
              style={{ width: 44, height: 44, backgroundColor: bg, color }}
              aria-hidden="true"
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#5c82ee" }}>
                {activePretty}
              </h1>
              <p className="text-muted-foreground" style={{ color: "#747886" }}>
                {titleCaseSlug(group || "conversion")} converter
              </p>
            </div>
          </div>

          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm" style={{ color: "#747886" }}>
                  Direction:&nbsp;
                  <strong style={{ color: "#3c83f6" }}>{activePretty}</strong>
                </div>
                {hasInverse && (
                  <Button
                    type="button"
                    onClick={() => setDir((d) => (d === "forward" ? "reverse" : "forward"))}
                    className="px-3"
                    style={{ backgroundColor: "#3c83f6", color: "#fff" }}
                  >
                    Swap
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Value ({(aFrom || "").toUpperCase()})</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="w-full rounded-lg border bg-background px-3 py-2 shadow-sm outline-none focus:ring"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Result ({(aTo || "").toUpperCase()})</label>
                  <input
                    readOnly
                    className="w-full rounded-lg border bg-muted/50 px-3 py-2 shadow-sm"
                    value={
                      !canCompute
                        ? "—"
                        : Number.isFinite(result)
                        ? String(result)
                        : "—"
                    }
                  />
                </div>
              </div>

              {showDensityNote && (
                <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm" style={{ color: "#8a6d3b" }}>
                  <strong>Note:</strong> this conversion requires the material’s density (e.g., g ↔ mL). We’ll add a
                  version that lets you input density soon.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 text-sm" style={{ color: "#747886" }}>
            <p>
              Most conversions are linear (multiply by a factor). Temperature adds an offset (like °F ↔ °C). Fuel economy
              uses a reciprocal formula for mpg ↔ L/100km.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
