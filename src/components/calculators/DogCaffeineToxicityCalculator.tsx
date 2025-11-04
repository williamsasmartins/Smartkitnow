import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// Example caffeine content (educational) by product type
const CAFFEINE_PRODUCTS: Array<{ key: string; label: string; mgPerGram: number }> = [
  { key: "drip", label: "Brewed coffee (drip)", mgPerGram: 0.9 },
  { key: "espresso", label: "Espresso", mgPerGram: 2.0 },
  { key: "tea", label: "Brewed tea (black)", mgPerGram: 0.3 },
  { key: "energy", label: "Energy drink", mgPerGram: 0.32 },
  { key: "coldbrew", label: "Cold brew coffee", mgPerGram: 1.2 },
  { key: "cola", label: "Cola-type soda", mgPerGram: 0.1 },
  { key: "powder", label: "Caffeine powder", mgPerGram: 50 },
  { key: "unknown", label: "Unknown", mgPerGram: 0.6 },
];

const RISK_BANDS: Array<{ id: string; label: string; tone: string; message: string }> = [
  { id: "low", label: "Low/Mild", tone: "bg-yellow-600", message: "GI upset or restlessness possible. Consult your veterinarian; monitor closely." },
  { id: "moderate", label: "Moderate", tone: "bg-orange-700", message: "Tachycardia, tremors, agitation possible. Veterinary assessment recommended." },
  { id: "very_high", label: "Very High", tone: "bg-red-700", message: "Seizures, arrhythmias, collapse possible. Seek emergency care immediately." },
];

function bandForDose(doseMgPerKg: number): { id: string } {
  // Educational thresholds (illustrative):
  // < 5 mg/kg: Low/Mild; 5–20 mg/kg: Moderate; > 20 mg/kg: Very High
  if (!Number.isFinite(doseMgPerKg) || doseMgPerKg <= 0) return { id: "low" };
  if (doseMgPerKg < 5) return { id: "low" };
  if (doseMgPerKg < 20) return { id: "moderate" };
  return { id: "very_high" };
}

const cfg: PetCalcOmniConfig = {
  title: "Dog Caffeine Toxicity Calculator",
  shortDescription:
    "Educational estimate of caffeine exposure risk in dogs by weight, product type, and grams/mL consumed.",
  strongDisclaimer:
    "This tool is for educational triage only and does not replace veterinary care. Call your veterinarian or a poison helpline immediately if exposure is suspected.",
  updatedAt: new Date().toISOString().slice(0, 10),
  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  inputs: [
    {
      type: "select",
      key: "productType",
      label: "Product type",
      default: "drip",
      options: CAFFEINE_PRODUCTS.map((p) => ({ value: p.key, label: p.label })),
    },
    { type: "number", key: "grams", label: "Estimated grams/mL consumed", min: 0, step: 1, default: 150 },
    { type: "number", key: "weight", label: "Dog weight", min: 0.5, step: 0.1, default: 10 },
    { type: "unit", key: "weightUnit", label: "Weight unit", options: ["kg", "lb"], default: "kg" },
  ],

  compute: (s) => {
    const grams = Number(s.grams) || 0;
    const weight = Number(s.weight) || 0;
    const weightKg = s.toKg(weight, s.weightUnit);
    const prod = CAFFEINE_PRODUCTS.find((p) => p.key === String(s.productType)) ?? CAFFEINE_PRODUCTS[0];
    const doseMgPerKg = weightKg > 0 ? (grams * prod.mgPerGram) / weightKg : 0;
    const band = bandForDose(doseMgPerKg);
    return {
      metrics: {
        dose_mg_per_kg: doseMgPerKg,
        grams: grams,
        weight_kg: weightKg,
      },
      riskKey: band.id,
    };
  },

  metricsDisplay: [
    { key: "dose_mg_per_kg", label: "Dose (mg/kg)", format: (v) => (Number.isFinite(v) ? v.toFixed(1) : "-") },
    { key: "grams", label: "Intake (g/mL)", format: (v) => (Number.isFinite(v) ? Math.round(v).toString() : "-") },
    { key: "weight_kg", label: "Weight (kg)", format: (v) => (Number.isFinite(v) ? v.toFixed(1) : "-") },
  ],

  riskBands: RISK_BANDS,

  professionalAdviceNote:
    "Caffeine is a methylxanthine stimulant. Signs vary with dose and individual sensitivity. Always consult a veterinarian.",

  howToUse: [
    "Enter your dog’s weight and unit.",
    "Estimate grams/mL ingested.",
    "Select the product type (or Unknown).",
    "Review the educational dose (mg/kg) and risk band.",
  ],

  howItWorks: {
    intro:
      "Caffeine is a methylxanthine stimulant. This tool multiplies the amount ingested by an example mg/g factor to estimate an educational mg/kg dose for triage.",
    formula: "dose_mg_per_kg = (grams × caffeine_mg_per_gram) ÷ weight_kg",
    variables: [
      "grams — estimated amount of beverage/product consumed (mL ≈ grams for most liquids)",
      "caffeine_mg_per_gram — example concentration for the selected product type (educational)",
      "weight_kg — dog body weight in kilograms",
    ],
  },

  tables: [
    {
      title: "Example caffeine content by product type (educational)",
      headers: ["Product type", "Caffeine (mg/g)", "Notes"],
      rows: [
        ["Brewed coffee (drip)", "≈0.9", "Varies by roast, brew ratio, and cup size."],
        ["Espresso", "≈2.0", "Small volume, high concentration."],
        ["Brewed tea (black)", "≈0.3", "Tea type and steep time matter."],
        ["Energy drink", "≈0.32", "Check the label; varies by brand."],
        ["Cold brew coffee", "≈1.2", "Often higher than drip coffee."],
        ["Cola-type soda", "≈0.1", "Lower than coffee/energy drinks."],
        ["Caffeine powder", "≈50", "Highly concentrated — dangerous."],
        ["Unknown", "≈0.6", "Conservative mid placeholder."],
      ],
      notes: [
        "Values are educational examples; actual content varies by brand and preparation.",
        "Even modest amounts can cause signs — call your veterinarian immediately.",
      ],
    },
    {
      title: "Illustrative examples — dose (mg/kg) for 150 g/mL ingestion",
      headers: ["Product", "5 kg dog", "10 kg dog", "20 kg dog"],
      rows: (() => {
        const grams = 150;
        const dose = (mgG: number, w: number) => Math.round((grams * mgG) / w);
        return [
          ["Drip coffee", dose(0.9, 5), dose(0.9, 10), dose(0.9, 20)],
          ["Espresso", dose(2.0, 5), dose(2.0, 10), dose(2.0, 20)],
          ["Energy drink", dose(0.32, 5), dose(0.32, 10), dose(0.32, 20)],
          ["Cold brew", dose(1.2, 5), dose(1.2, 10), dose(1.2, 20)],
        ];
      })(),
      notes: [
        "Use your dog’s exact weight and your best estimate of intake for a closer estimate.",
      ],
    },
    {
      title: "Possible signs & when to act (varies by individual)",
      headers: ["Band", "Possible signs", "Action"],
      rows: [
        ["Low/Mild", "GI upset, restlessness", "Consult your veterinarian; monitor closely."],
        ["Moderate", "Tachycardia, tremors, agitation", "Veterinary assessment recommended."],
        ["Very High", "Seizures, arrhythmias, collapse", "Emergency care immediately."],
      ],
      notes: ["Timing and signs vary with dose and individual sensitivity."],
    },
  ],

  faqs: [
    { question: "How accurate are the caffeine numbers here?", answer: "They are educational examples. Caffeine varies by brand and preparation. Always check labels when possible and contact a veterinarian or poison helpline." },
    { question: "What if I don’t know the exact amount?", answer: "Use your best estimate and select 'Unknown' product for a conservative factor. Then call your veterinarian." },
    { question: "What symptoms should I watch for?", answer: "Vomiting, restlessness, tremors, rapid heart rate, collapse, or seizures. Seek urgent veterinary care for severe signs." },
  ],

  sources: [
    { label: "General veterinary toxicology guidance", href: "https://www.merckvetmanual.com/" },
  ],
};

export default function DogCaffeineToxicityCalculator() {
  const canonical = "https://www.smartkitnow.com/pets/pet-care-calculators/dog-caffeine-toxicity-calculator";
  const faqLd = useFaqJsonLd(cfg.faqs);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Dog Care Calculators", item: "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", position: 3, name: "Dog Caffeine Toxicity", item: canonical },
    ],
  };

  return (
    <>
      <SeoHead
        title="Dog Caffeine Toxicity Calculator"
        description="Educational estimate of caffeine exposure risk in dogs by weight, product type, and grams/mL consumed — with tables, FAQs, and sources."
        canonical={canonical}
      />



      <PetCalcOmniTemplate config={cfg} />

      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </>
  );
}