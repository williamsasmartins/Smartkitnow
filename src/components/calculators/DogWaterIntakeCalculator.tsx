// src/components/calculators/DogWaterIntakeCalculator.tsx
import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

type UnitW = "kg" | "lb";
type IntakeUnit = "ml_day" | "l_day" | "cup_day";
const CUP_ML = 236.588;
const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-water-intake";
const TITLE = "Dog Water Intake — Daily Hydration Checker";
const DESC = "Estimate typical daily water needs for dogs (~50–60 mL/kg/day) and compare with your measured intake. Educational triage.";

const cfg: PetCalcOmniConfig = {
  title: TITLE,
  shortDescription:
    "Estimate typical daily water needs (rule-of-thumb ≈ 50–60 mL/kg/day) and compare with your dog’s actual intake. Educational triage — consult your veterinarian if concerned.",
  strongDisclaimer:
    "Hydration varies with diet (dry/wet), climate, activity, medications, and health. Use as educational guidance; persistent concerns should be evaluated by a veterinarian.",
  showTopAd: true,
  showRightAd: true,

  authoredBy: {
    name: "Williams Martins",
    role: "Content Editor",
    date: "2025-10-13",
    bioUrl: "https://www.smartkitnow.com/about",
  },
  reviewedBy: {
    name: "Smart Kit Now Editorial Team",
    role: "Content Review",
    date: "2025-10-13",
  },

  // Inputs
  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "intake", label: "Observed water intake (per day)", min: 0, step: 1, default: 1000 },
    {
      type: "select", key: "intakeUnit", label: "Intake unit", default: "ml_day",
      options: [
        { value: "ml_day", label: "mL/day" },
        { value: "l_day",  label: "L/day" },
        { value: "cup_day",label: "cups/day" },
      ]
    },
    {
      type: "select", key: "diet", label: "Main diet type (informational)", default: "dry",
      options: [
        { value: "dry",   label: "Mostly dry (kibble)" },
        { value: "mixed", label: "Mixed" },
        { value: "wet",   label: "Mostly wet/canned" },
      ]
    },
  ],

  compute: (s) => {
    const toKg = (v:number,u:UnitW)=> (u==="lb"? v*0.45359237 : v);
    const w = parseFloat(s.weight || "0");
    const wkg = toKg(w, s.weightUnit || "kg");

    const intake = parseFloat(s.intake || "0");
    const intakeUnit: IntakeUnit = s.intakeUnit || "ml_day";
    let intakeMlDay = 0;
    if (intakeUnit === "ml_day") intakeMlDay = intake;
    else if (intakeUnit === "l_day") intakeMlDay = intake * 1000;
    else intakeMlDay = intake * CUP_ML;

    const perKg = wkg > 0 ? intakeMlDay / wkg : 0;
    const typicalMin = wkg * 50;
    const typicalMax = wkg * 60;

    let riskKey: "low" | "typical" | "high" | "none" = "none";
    if (intakeMlDay > 0 && wkg > 0) {
      if (perKg < 40) riskKey = "low";
      else if (perKg <= 70) riskKey = "typical";
      else riskKey = "high";
    }

    return {
      metrics: { weightKg: wkg, intakeMlDay, intakePerKg: perKg, typicalMin, typicalMax },
      riskKey,
    };
  },

  metricsDisplay: [
    { key: "intakeMlDay",  label: "Observed intake (mL/day)",        format: v => `${Math.round(v)} mL` },
    { key: "intakePerKg",  label: "Observed per kg (mL/kg/day)",     format: v => `${(v ?? 0).toFixed(1)} mL/kg` },
    { key: "typicalMin",   label: "Typical min (mL/day)",            format: v => `${Math.round(v)} mL` },
    { key: "typicalMax",   label: "Typical max (mL/day)",            format: v => `${Math.round(v)} mL` },
  ],

  riskBands: [
    { id: "none",    label: "Enter data",            tone: "bg-emerald-600", message: "Enter weight and observed water intake to compare with typical values." },
    { id: "low",     label: "Lower than typical",    tone: "bg-yellow-600",  message: "Below typical range — consider diet type (wet foods add water), climate, activity. If persistently low or with symptoms, talk to your vet." },
    { id: "typical", label: "Within typical range",  tone: "bg-emerald-700", message: "Within an expanded typical range for daily variation. Keep monitoring trends and body condition." },
    { id: "high",    label: "Higher than typical",   tone: "bg-red-600",     message: "Above typical range — if sustained or with other signs, contact your veterinarian." },
  ],

  cta: { label: "If concerned, contact your veterinarian for guidance" },

  howToUse: [
    "Enter your dog’s weight and units.",
    "Enter the observed daily water intake and select the unit (mL, L, or cups per day).",
    "We compare your entry to a typical range (~50–60 mL/kg/day) and show a band (low/typical/high).",
  ],

  howItWorks: {
    intro: "Uses a common rule-of-thumb (≈50–60 mL/kg/day) and converts your input to mL/day and mL/kg/day.",
    formula: "typical_min = 50 × BW_kg\ntypical_max = 60 × BW_kg\nobserved_mL/kg = observed_mL/day ÷ BW_kg",
    variables: ["BW_kg — body weight in kilograms", "Observed intake — normalized to mL/day"],
  },

  tables: [
    {
      title: "Quick reference — typical water per day",
      headers: ["Weight (kg)", "Typical (mL/day)"],
      rows: [3, 5, 10, 20, 30, 40].map(kg => [kg, `${Math.round(kg*50)} – ${Math.round(kg*60)}`]),
    },
    {
      title: "Household conversions",
      headers: ["Measure", "≈ mL"],
      rows: [
        ["1 cup (US)", `${Math.round(CUP_ML)} mL`],
        ["1 L", "1000 mL"],
        ["8 fl oz", "≈ 237 mL"],
      ],
    },
  ],

  faqs: [
    { question: "Wet food counts as water?", answer: "Yes. Canned diets add water, so bowl intake may look lower." },
    { question: "Sudden increase in drinking?", answer: "Track for 2–3 days and contact your veterinarian, especially with other signs." },
  ],

  // ⚠️ Sem link para concorrentes
  sources: [
    { label: "General veterinary hydration guidance (rule-of-thumb)", href: "https://www.merckvetmanual.com/" },
  ],

  relatedLinks: [
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dogs/dog-chocolate-toxicity-calculator" },
    { label: "Dog Grape/Raisin Exposure Risk", href: "/pets/dogs/dog-grape-raisin-exposure-risk" },
    { label: "Dog Calorie Needs — RER & MER", href: "/pets/dogs/dog-calorie-needs-rer-mer" },
  ],
};

export default function DogWaterIntakeCalculator() {
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
    "mainEntity": cfg.faqs?.map(f => ({
      "@type": "Question", "name": f.question, "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    })) ?? []
  };

  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Pets",  "item": "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", "position": 2, "name": "Dogs",  "item": "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", "position": 3, "name": "Dog Water Intake", "item": CANONICAL }
    ]
  };

  const webpageJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": TITLE,
    "url": CANONICAL,
    "description": DESC,
    "isPartOf": { "@type": "WebSite", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com" },
    "author": { "@type": "Person", "name": cfg.authoredBy?.name, "jobTitle": cfg.authoredBy?.role, "url": cfg.authoredBy?.bioUrl },
    "reviewedBy": { "@type": "Organization", "name": cfg.reviewedBy?.name },
    "dateModified": cfg.authoredBy?.date || cfg.reviewedBy?.date,
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