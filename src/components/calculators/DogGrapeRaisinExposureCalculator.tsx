// src/components/calculators/DogGrapeRaisinExposureCalculator.tsx
import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-grape-raisin-exposure-risk";
const TITLE = "Dog Grape/Raisin Exposure Risk";
const DESC =
  "Any grape or raisin ingestion can be dangerous for dogs (acute kidney injury). Use this triage tool to summarize risk messaging—contact your veterinarian immediately.";

type Unit = "g" | "oz" | "count";
const OZ_TO_G = 28.349523125;

// Conservatively: raisin ~0.5 g/unit; grape ~5 g/unit (varies; educational)
const PIECE_GRAMS = { grape: 5, raisin: 0.5 } as const;

const cfg: PetCalcOmniConfig = {
  title: TITLE,
  shortDescription:
    "Grapes/raisins can trigger acute kidney injury in dogs; mechanism unknown and no safe dose is established. Treat ANY ingestion as an emergency.",
  strongDisclaimer:
    "Tool for educational triage only — does not replace professional veterinary care. Individual susceptibility varies widely.",
  showTopAd: true,
  showRightAd: true,
  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  authoredBy: { name: "Williams Martins", role: "Content Editor", date: "2025-10-14", bioUrl: "https://www.smartkitnow.com/about" },
  reviewedBy: { name: "Smart Kit Now Editorial Team", role: "Content Review", date: "2025-10-14" },
  professionalAdviceNote:
    "Any grape or raisin ingestion should be treated as a veterinary emergency. Contact your veterinarian immediately.",

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 15 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },

    { type: "select", key: "form", label: "Form", default: "grape", options: [
      { value: "grape", label: "Grapes" },
      { value: "raisin", label: "Raisins" },
    ]},

    { type: "number", key: "amount", label: "Amount", min: 0, step: 1, default: 5 },
    { type: "select", key: "unit", label: "Unit", default: "count", options: [
      { value: "count", label: "pieces (count)" },
      { value: "g",     label: "grams (g)" },
      { value: "oz",    label: "ounces (oz)" },
    ]},

    { type: "number", key: "hours", label: "Hours since exposure", min: 0, step: 0.5, default: 1.5 },
  ],

  compute: (s) => {
    const toKg = (v:number,u:"kg"|"lb") => (u==="lb"? v*0.45359237: v);
    const w = parseFloat(s.weight || "0");
    const wkg = toKg(w, s.weightUnit);

    const form = s.form === "raisin" ? "raisin" : "grape";
    const amount = parseFloat(s.amount || "0");
    const unit: Unit = s.unit || "count";

    let grams = 0;
    if (unit === "g") grams = amount;
    else if (unit === "oz") grams = amount * OZ_TO_G;
    else grams = amount * (form === "raisin" ? PIECE_GRAMS.raisin : PIECE_GRAMS.grape);

    const gramsPerKg = wkg > 0 ? grams / wkg : 0;

    // Messaging: no "safe dose". Any ingestion = strong alert.
    const recent = parseFloat(s.hours || "0") <= 2;
    const riskKey = grams > 0 ? (recent ? "recent" : "ingested") : "none";

    return { metrics: { gramsIngested: grams, gramsPerKg, timeHours: parseFloat(s.hours || "0") }, riskKey };
  },

  metricsDisplay: [
    { key: "gramsIngested", label: "Estimated amount (g)", format: (v) => `${Math.round(v)} g` },
    { key: "gramsPerKg",    label: "Amount per kg (g/kg)",  format: (v) => `${(v ?? 0).toFixed(1)} g/kg` },
    { key: "timeHours",     label: "Time since exposure",   format: (v) => `${(v ?? 0).toFixed(1)} h` },
  ],

  riskBands: [
    { id: "none",     label: "No data",        tone: "bg-emerald-600", message: "Enter weight and amount to assess." },
    { id: "ingested", label: "Exposure noted", tone: "bg-red-600",     message: "Any ingestion is potentially dangerous — contact your vet urgently." },
    { id: "recent",   label: "Recent exposure",tone: "bg-red-700",     message: "Time-sensitive options may apply. Seek veterinary advice immediately." },
  ],

  cta: { label: "Call your veterinarian now" },
  stickyCta: { whenRiskIn: ["ingested", "recent"], label: "Urgent: call your vet", tel: "+1-800-222-1222" },

  howToUse: [
    "Enter your dog’s weight.",
    "Choose the form (grapes or raisins) and the amount (pieces, g, or oz).",
    "Treat any ingestion as an emergency and call your veterinarian.",
  ],

  howItWorks: {
    intro:
      "The toxicity mechanism of grapes/raisins is not fully understood. Because no 'safe dose' is established, any ingestion should be treated as potentially dangerous, with risk of acute kidney injury.",
    formula: "grams_per_kg = total_grams_ingested ÷ weight_kg",
    variables: ["Household unit-weight estimates are approximations (for home use). Always consult your veterinarian."],
  },

  tables: [
    {
      title: "Household approximations",
      headers: ["Form", "≈ grams per piece"],
      rows: [
        ["Grape (table grape)", `${PIECE_GRAMS.grape} g`],
        ["Raisin", `${PIECE_GRAMS.raisin} g`],
      ],
      notes: ["Values vary with size/moisture; weigh when possible."],
    },
  ],

  faqs: [
    { question: "Can a single grape cause a problem?", answer: "There are reports of toxicity with small amounts and wide individual variability. Treat any ingestion as an emergency and call your veterinarian." },
    { question: "What should I watch for?", answer: "Vomiting, lethargy, abdominal pain, anorexia, polyuria/polydipsia. Seek immediate care." },
  ],

  sources: [
    { label: "Merck Veterinary Manual — Grape/Raisin Toxicosis", href: "https://www.merckvetmanual.com/" },
  ],

  relatedLinks: [
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dogs/dog-chocolate-toxicity-calculator" },
    { label: "Dog Water Intake — Daily Hydration", href: "/pets/dogs/dog-water-intake" },
  ],
};

export default function DogGrapeRaisinExposureCalculator() {
  const softwareJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": TITLE,
    "applicationCategory": "Calculator",
    "applicationSubCategory": "Pet Health",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": CANONICAL,
    "description": DESC,
    "publisher": { "@type": "Organization", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com" }
  };
  const faqsJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (cfg.faqs ?? []).map(f => ({
      "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    })),
  };
  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Pets",  "item": "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", "position": 2, "name": "Dogs",  "item": "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", "position": 3, "name": TITLE, "item": CANONICAL }
    ]
  };
  const webpageJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": TITLE,
    "url": CANONICAL,
    "description": DESC,
    "isPartOf": { "@type": "WebSite", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com" },
    "author": { "@type": "Person", "name": "Williams Martins", "jobTitle": "Content Editor", "url": "https://www.smartkitnow.com/about" },
    "reviewedBy": { "@type": "Organization", "name": "Smart Kit Now Editorial Team" },
    "dateModified": "2025-10-14",
  };

  return (
    <>
      <SeoHead title={TITLE} description={DESC} canonical={CANONICAL} />
      <JsonLd data={softwareJson} />
      <JsonLd data={faqsJson} />
      <JsonLd data={breadcrumbsJson} />
      <JsonLd data={webpageJson} />
      <PetCalcOmniTemplate config={cfg} />
    </>
  );
}