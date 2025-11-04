// src/components/calculators/CatWaterIntakeCalculator.tsx
import React, { useEffect } from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

import useFaqJsonLd from "@/hooks/useFaqJsonLd";

/**
 * Cat Daily Water Intake Checker (educational)
 * - Typical range (rule-of-thumb) 40–60 mL/kg/day, adjusted by diet.
 * - Compares observed intake to diet-adjusted range.
 * - Not medical advice; see a licensed veterinarian for concerns.
 */

const DIET_FACTORS = {
  dry:   { label: "Mostly dry food",    adjustMlPerKg: +10 },
  mixed: { label: "Mixed (dry + wet)",  adjustMlPerKg: 0  },
  wet:   { label: "Mostly wet food",    adjustMlPerKg: -10 },
} as const;

type DietKey = keyof typeof DIET_FACTORS;

function classify(mLPerKgDay: number, minRef: number, maxRef: number) {
  if (!Number.isFinite(mLPerKgDay) || mLPerKgDay <= 0) return "unknown";
  if (mLPerKgDay < minRef) return "low";
  if (mLPerKgDay > maxRef) return "high";
  return "typical";
}

const cfg: PetCalcOmniConfig = {
  title: "Cat Daily Water Intake Checker",
  shortDescription:
    "Estimate an educational water intake range for cats based on weight and diet, and compare it with your observed intake.",
  strongDisclaimer:
    "Educational guidance only — not a diagnostic tool. Hydration needs vary with health, environment, and diet. If you have concerns, contact a licensed veterinarian.",
  showTopAd: true,
  showRightAd: false,

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  inputs: [
    { type: "number", key: "weight", label: "Cat weight", min: 0, step: 0.1, default: 4 },
    { type: "unit",   key: "weightUnit", label: "Weight unit", options: ["kg","lb"], default: "kg" },
    { type: "select", key: "diet", label: "Diet type", default: "mixed",
      options: Object.entries(DIET_FACTORS).map(([value, v]) => ({ value, label: v.label })) },
    { type: "number", key: "observed", label: "Observed intake (optional)", min: 0, step: 1, default: 200 },
    { type: "select", key: "observedUnit", label: "Observed unit", default: "mL",
      options: [
        { value: "mL", label: "mL" },
        { value: "oz", label: "fl oz" },
      ]
    },
  ],

  // Compute: only numbers in metrics
  compute: (s) => {
    const toKg = (v:number,u:"kg"|"lb") => (u === "lb" ? v * 0.45359237 : v);
    const toMl = (v:number,u:"mL"|"oz") => (u === "oz" ? v * 29.5735295625 : v);

    const wkg = toKg(parseFloat(s.weight || "0"), s.weightUnit);
    const obsMl = toMl(parseFloat(s.observed || "0"), s.observedUnit);

    const baseMin = 40, baseMax = 60; // rule-of-thumb range
    const dietKey: DietKey = (s.diet || "mixed") as DietKey;
    const adjust = DIET_FACTORS[dietKey]?.adjustMlPerKg ?? 0;

    const minRef = Math.max(0, baseMin + adjust);
    const maxRef = Math.max(minRef + 5, baseMax + adjust);

    const minRefMlDay = wkg * minRef;
    const maxRefMlDay = wkg * maxRef;
    const observedMlPerKgDay = wkg > 0 ? obsMl / wkg : 0;

    const riskKey = classify(observedMlPerKgDay, minRef, maxRef);

    return {
      metrics: {
        minRefMlKg: minRef,
        maxRefMlKg: maxRef,
        minRefMlDay,
        maxRefMlDay,
        observedMl: obsMl,
        observedMlPerKgDay,
        weightKg: wkg,
      },
      riskKey,
    };
  },

  metricsDisplay: [
    { key: "minRefMlKg",       label: "Typical range base (mL/kg/day)",  format: (v)=> "~40–60 (diet-adjusted below)" },
    { key: "minRefMlDay",      label: "Suggested daily MIN (mL/day)",    format: (v)=> `${Math.round(v)} mL/day` },
    { key: "maxRefMlDay",      label: "Suggested daily MAX (mL/day)",    format: (v)=> `${Math.round(v)} mL/day` },
    { key: "observedMlPerKgDay", label: "Observed (mL/kg/day)",          format: (v)=> Number.isFinite(v) ? `${v.toFixed(1)} mL/kg/day` : "—" },
  ],

  riskBands: [
    { id: "unknown", label: "—",              tone: "bg-slate-600",   message: "Enter weight and observed intake to classify." },
    { id: "low",     label: "Below typical",  tone: "bg-amber-600",   message: "Below diet-adjusted range. Discuss with your veterinarian if concerned." },
    { id: "typical", label: "Within typical", tone: "bg-emerald-600", message: "Within an educational reference range. If your cat seems unwell, contact your veterinarian." },
    { id: "high",    label: "Above typical",  tone: "bg-red-600",     message: "Above diet-adjusted range. Increased thirst/urination can indicate illness — consult your veterinarian." },
  ],

  cta: { label: "If you’re concerned, contact your veterinarian." },

  howToUse: [
    "Enter your cat’s weight (kg or lb).",
    "Select a diet type (mostly dry, mixed, or mostly wet).",
    "Optionally enter observed daily water intake (mL or oz).",
    "Review the diet-adjusted range and your cat’s observed value.",
  ],

  howItWorks: {
    intro:
      "This tool provides an educational hydration reference by estimating a daily range in mL/kg/day and adjusting it by diet. Cats on mostly dry food often need relatively more free water; cats on mostly wet food may drink less because the diet itself is water-rich.",
    formula:
      "Suggested daily water (mL/day) ≈ weight_kg × (40–60 mL/kg/day ± diet_adjustment)",
    variables: [
      "weight_kg — body weight in kilograms",
      "40–60 mL/kg/day — rule-of-thumb range",
      "diet_adjustment — +10 mL/kg for mostly dry; 0 for mixed; −10 mL/kg for mostly wet (educational adjustment)",
    ],
  },

  tables: [
    {
      title: "Diet adjustments (educational)",
      headers: ["Diet", "Adjustment (mL/kg/day)", "Notes"],
      rows: [
        ["Mostly dry food", "+10", "Dry diets typically increase free-water need."],
        ["Mixed (dry + wet)", "0",  "Baseline adjustment."],
        ["Mostly wet food", "−10",  "Wet food contributes substantial water."],
      ],
      notes: [
        "Values are educational references, not clinical thresholds.",
        "Health conditions (CKD, diabetes, hyperthyroidism) can significantly change needs.",
      ],
    },
    {
      title: "Examples — suggested daily range (mL/day)",
      headers: ["Weight", "Mostly dry", "Mixed", "Mostly wet"],
      rows: (() => {
        const rows:any[] = [];
        const weightsKg = [3, 4, 5, 6];
        const band = (w:number, adj:number) => {
          const min = Math.round(w * (40 + adj));
          const max = Math.round(w * (60 + adj));
          return `${min}–${max}`;
        };
        for (const w of weightsKg) {
          rows.push([
            `${w} kg`,
            band(w, +10),
            band(w, 0),
            band(w, -10),
          ]);
        }
        return rows;
      })(),
      notes: ["Use your cat’s exact weight and ask your veterinarian when in doubt."],
    },
  ],

  faqs: [
    { question: "What is a typical water intake for cats?", answer: "An educational rule-of-thumb is ~40–60 mL/kg/day, influenced by diet, environment, and health status." },
    { question: "Why does diet change intake?", answer: "Wet food contains a lot of water, so cats on mostly wet diets often drink less; cats on mostly dry diets tend to drink more free water." },
    { question: "My cat drinks much more than the range. Should I worry?", answer: "Increased thirst/urination can indicate illness (e.g., kidney disease, diabetes, hyperthyroidism). Contact your veterinarian." },
    { question: "How can I encourage hydration?", answer: "Multiple clean bowls, water fountains, and wet food can help. Seek veterinary advice if intake changes suddenly or your cat seems unwell." },
  ],

  sources: [
    { label: "General veterinary hydration guidance (rule-of-thumb)", href: "https://www.merckvetmanual.com/" },
  ],
};

export default function CatWaterIntakeCalculator() {
  useEffect(() => {
    document.title = "Cat Daily Water Intake Checker | SmartKitNow";
  }, []);

  const canonical = "https://www.smartkitnow.com/pets/cats/cat-daily-water-intake-checker";
  const faqLd = useFaqJsonLd(cfg.faqs);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Pets", "item": "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", "position": 2, "name": "Cats", "item": "https://www.smartkitnow.com/pets/cats" },
      { "@type": "ListItem", "position": 3, "name": "Cat Daily Water Intake Checker", "item": canonical }
    ]
  };

  return (
    <>
      <SeoHead
        title="Cat Daily Water Intake Checker | Smart Kit Now"
        description="Estimate an educational daily water intake range for cats based on weight and diet, and compare it to your observation. Not medical advice."
        canonical={canonical}
      />



      <PetCalcOmniTemplate config={cfg} />

      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </>
  );
}