import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";


type Unit = "kg" | "lb";

type FactorPreset =
  | { id: string; label: string; factor: number }
  | { id: string; label: string; factorMin: number; factorMax: number };

const PRESETS: FactorPreset[] = [
  { id: "rest", label: "Resting only (RER)", factor: 1.0 },
  { id: "adult-neutered", label: "Adult neutered", factorMin: 1.2, factorMax: 1.6 },
  { id: "adult-intact", label: "Adult intact", factorMin: 1.4, factorMax: 1.8 },
  { id: "weight-loss", label: "Weight loss (vet-guided)", factor: 0.8 },
  { id: "weight-gain", label: "Weight gain", factorMin: 1.2, factorMax: 1.6 },
  { id: "active", label: "Active/working", factorMin: 2.0, factorMax: 5.0 },
  { id: "puppy-<4m", label: "Puppy < 4 months", factor: 3.0 },
  { id: "puppy->4m", label: "Puppy ≥ 4 months", factor: 2.0 },
];

function toKg(v: number, u: Unit) {
  return u === "lb" ? v * 0.45359237 : v;
}

const cfg: PetCalcOmniConfig = {
  title: "Dog Calorie Needs — RER & MER",
  shortDescription:
    "Estimate your dog’s daily calories using RER (Resting Energy Requirement) and MER (maintenance) factors. Educational tool — confirm with your veterinarian.",
  strongDisclaimer:
    "Results are estimates. Individual needs vary with condition, environment, and health. Always tailor feeding with veterinary guidance, especially for weight loss/gain.",
  showTopAd: true,
  showRightAd: true,
  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit", key: "weightUnit", label: "Weight Unit", options: ["kg", "lb"], default: "kg" },
    {
      type: "select",
      key: "preset",
      label: "Life stage / activity",
      default: "adult-neutered",
      options: PRESETS.map((p) => ({ value: p.id, label: p.label })),
    },
  ],

  compute: (s) => {
    const w = parseFloat(s.weight || "0");
    const wkg = toKg(w, (s.weightUnit as Unit) || "kg");

    // RER = 70 × (BWkg^0.75)
    const RER = wkg > 0 ? 70 * Math.pow(wkg, 0.75) : 0;

    // MER via preset
    const preset = PRESETS.find((p) => p.id === s.preset) ?? PRESETS[1];
    let MER = 0,
      MERmin = 0,
      MERmax = 0,
      hasRange = false;

    if ("factor" in preset) {
      MER = RER * preset.factor;
    } else {
      hasRange = true;
      MERmin = RER * preset.factorMin;
      MERmax = RER * preset.factorMax;
    }

    return {
      metrics: {
        weightKg: wkg,
        RER,
        MER,
        MERmin,
        MERmax,
      },
    };
  },

  metricsDisplay: [
    { key: "RER", label: "RER (kcal/day)", format: (v) => `${Math.round(v)} kcal` },
    { key: "MERmin", label: "MER (kcal/day) — min", format: (v) => (v > 0 ? `${Math.round(v)} kcal` : "—") },
    { key: "MERmax", label: "MER (kcal/day) — max", format: (v) => (v > 0 ? `${Math.round(v)} kcal` : "—") },
    { key: "MER", label: "MER (kcal/day)", format: (v) => (v > 0 ? `${Math.round(v)} kcal` : "—") },
  ],

  cta: { label: "Discuss feeding targets with your veterinarian" },

  howToUse: [
    "Enter your dog’s weight and unit (kg or lb).",
    "Choose the life stage/activity that best matches your dog.",
    "Read the RER and MER. If a range is shown, start near the middle and adjust with your vet.",
    "Reassess regularly — weight trend and body condition should guide feeding changes.",
  ],

  howItWorks: {
    intro:
      "We compute RER using the metabolic body weight formula and estimate MER by multiplying RER by a life-stage/activity factor.",
    formula: "RER = 70 × (BW_kg^0.75)\nMER = RER × factor",
    variables: [
      "BW_kg — body weight in kilograms",
      "factor — life stage/activity multiplier (e.g., 1.2–1.6 neutered adult; 2.0–5.0 active/working; 2.0 puppies ≥4 months; 3.0 puppies <4 months)",
    ],
  },

  tables: [
    {
      title: "Common MER factors (reference)",
      headers: ["Life stage / activity", "Factor"],
      rows: PRESETS.map((p) => [p.label, "factor" in p ? p.factor : `${p.factorMin} – ${p.factorMax}`]),
      notes: [
        "Ranges reflect normal variability. Choose the closest match and fine-tune with your veterinarian.",
      ],
    },
    {
      title: "Example RER values (for reference)",
      headers: ["Weight (kg)", "RER (kcal/day)"],
      rows: [3, 5, 10, 20, 30].map((kg) => [kg, Math.round(70 * Math.pow(kg, 0.75))]),
      notes: [
        "Shortcut (~3–25 kg): RER ≈ 30 × BW_kg + 70 (useful in field, less precise than full formula).",
      ],
    },
    {
      title: "Turning calories into portions (guidance)",
      headers: ["If your food label is…", "Then daily grams ≈"],
      rows: [
        ["kcal per cup", "MER (kcal) ÷ kcal/cup → cups/day"],
        ["kcal per 100 g", "MER (kcal) ÷ kcal/100 g × 100 → g/day"],
      ],
      notes: [
        "Always check your food label (metabolizable energy) and adjust by body condition.",
      ],
    },
  ],

  faqs: [
    {
      question: "Which RER formula should I use?",
      answer:
        "Use the standard RER = 70 × (kg^0.75) for all sizes. The shortcut (30 × kg + 70) is a practical approximation often used for mid-size dogs (~3–25 kg).",
    },
    {
      question: "How do I adjust MER for weight loss?",
      answer:
        "Start with RER × 1.0, monitor weight and BCS weekly, and adjust with your veterinarian. Never restrict sharply without professional guidance.",
    },
    {
      question: "Do seniors need fewer calories?",
      answer:
        "Many senior dogs benefit from modestly lower MER, but needs vary with lean mass, activity and health. Use a factor around 1.2 as a starting point and individualize.",
    },
  ],

  sources: [
    { label: "WSAVA Global Nutrition Toolkit — Energy Requirements", href: " `https://wsava.org/global-guidelines/global-nutrition-guidelines/` " },
    { label: "Veterinary clinical nutrition texts (overview of RER/MER factors)", href: " `https://avmajournals.avma.org/` " }
  ],
};

export default function DogCalorieNeedsRerMerCalculator() {
  const TITLE = cfg.title;
  const DESC = cfg.shortDescription as string;
  const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-calorie-needs-rer-mer";

  const webpageJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    url: CANONICAL,
    description: DESC,
  };
  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", position: 3, name: TITLE, item: CANONICAL },
    ],
  };
  const faqsJson = (cfg.faqs ?? []).length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": (cfg.faqs ?? []).map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : undefined;

  return (
    <>
      <SeoHead title={TITLE} description={DESC} canonical={CANONICAL} />
      <JsonLd data={webpageJson} />
      <JsonLd data={breadcrumbsJson} />
      {faqsJson && <JsonLd data={faqsJson} />}
      <PetCalcOmniTemplate config={cfg} />
    </>
  );
}