// src/components/calculators/DogWaterIntakeCalculator.tsx
import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";
import EEATBanner from "@/components/EEATBanner";

const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-water-intake";
const TITLE = "Dog Water Intake — Daily Hydration";
const DESC =
  "Check daily water intake against a common veterinary reference band (≈50–60 mL/kg/day). Educational guidance only—consult your veterinarian if intake is abnormal.";

function classifyMlPerKg(x: number) {
  if (!Number.isFinite(x) || x <= 0)
    return { id: "none", label: "Enter data", tone: "bg-emerald-600", message: "Enter weight and intake to classify." };
  if (x < 40)
    return { id: "low", label: "Lower than typical", tone: "bg-yellow-600", message: "Below common guides. Check access to fresh water and call your vet if persistent." };
  if (x <= 70)
    return { id: "typical", label: "Typical range", tone: "bg-emerald-600", message: "Within a common reference band (diet/activity/heat can shift needs)." };
  if (x <= 90)
    return { id: "high", label: "Higher than typical", tone: "bg-orange-600", message: "Above common guides. Monitor and discuss with your veterinarian." };
  return { id: "veryhigh", label: "Much higher", tone: "bg-red-700", message: "Significantly elevated intake—seek veterinary guidance." };
}

const cfg: PetCalcOmniConfig = {
  title: TITLE,
  shortDescription:
    "Compare your dog’s daily water intake (mL/kg/day) to a common reference band. This is guidance only; many factors affect hydration.",
  strongDisclaimer:
    "Hydration needs vary with diet (dry vs. wet), heat, exercise, health status, and medications. This tool does not replace a veterinary assessment.",
  showTopAd: true,
  showRightAd: true,

  authoredBy: { name: "Williams Martins", role: "Content Editor", date: "2025-10-14", bioUrl: "https://www.smartkitnow.com/about" },
  reviewedBy: { name: "Smart Kit Now Editorial Team", role: "Content Review", date: "2025-10-14" },
  professionalAdviceNote:
    "Persistently low or very high intake may indicate medical issues. Please consult your veterinarian for assessment.",

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit", key: "weightUnit", label: "Weight Unit", options: ["kg", "lb"], default: "kg" },
    { type: "number", key: "intake", label: "Water intake per day", min: 0, step: 1, default: 1000 },
    {
      type: "select",
      key: "intakeUnit",
      label: "Intake unit",
      default: "mL",
      options: [
        { value: "mL", label: "mL/day" },
        { value: "L", label: "L/day" },
        { value: "oz", label: "fl oz/day" },
        { value: "cup", label: "cups/day (US 240 mL)" },
      ],
    },
  ],

  compute: (s) => {
    const toKg = (v: number, u: "kg" | "lb") => (u === "lb" ? v * 0.45359237 : v);
    const w = parseFloat(s.weight || "0");
    const wkg = toKg(w, s.weightUnit);

    const intake = parseFloat(s.intake || "0");
    let ml = intake;
    if (s.intakeUnit === "L") ml = intake * 1000;
    else if (s.intakeUnit === "oz") ml = intake * 29.5735;
    else if (s.intakeUnit === "cup") ml = intake * 240;

    const mlPerKg = wkg > 0 ? ml / wkg : 0;
    const b = classifyMlPerKg(mlPerKg);
    return { metrics: { mlPerKg, mlPerDay: ml, weightKg: wkg }, riskKey: b.id };
  },

  metricsDisplay: [
    { key: "mlPerKg", label: "Intake (mL/kg/day)", format: (v) => `${(v ?? 0).toFixed(0)} mL/kg/day` },
    { key: "mlPerDay", label: "Total intake (mL/day)", format: (v) => `${Math.round(v ?? 0)} mL/day` },
    { key: "weightKg", label: "Weight (kg)", format: (v) => `${(v ?? 0).toFixed(1)} kg` },
  ],

  riskBands: [
    { id: "none", label: "Enter data", tone: "bg-emerald-600", message: "Enter weight and intake to classify." },
    { id: "low", label: "Lower than typical", tone: "bg-yellow-600", message: "Below common guides. Ensure constant access to fresh water and consult your vet if persistent." },
    { id: "typical", label: "Typical range", tone: "bg-emerald-600", message: "Many factors (diet/activity/heat) shift normal intake." },
    { id: "high", label: "Higher than typical", tone: "bg-orange-600", message: "Monitor; if sustained, discuss with your veterinarian." },
    { id: "veryhigh", label: "Much higher", tone: "bg-red-700", message: "Seek veterinary guidance—excessive thirst can be a clinical sign." },
  ],

  cta: { label: "Discuss hydration with your veterinarian" },

  howToUse: [
    "Enter your dog’s weight and daily water intake.",
    "Pick the intake unit (mL, L, fl oz, or cups).",
    "Compare the mL/kg/day to the reference band and talk with your vet if it’s persistently low or high.",
  ],

  howItWorks: {
    intro:
      "A commonly cited band for healthy dogs is ~50–60 mL/kg/day, but needs vary with diet (wet foods can reduce thirst), heat, and activity.",
    formula: "mL_per_kg_per_day = total_mL_day ÷ weight_kg",
    variables: [
      "total_mL_day — convert to mL from L, fl oz (29.57 mL), or cups (240 mL).",
      "weight_kg — body weight in kilograms.",
    ],
  },

  tables: [
    {
      title: "Quick conversions",
      headers: ["Unit", "To mL"],
      rows: [
        ["1 L", "1000 mL"],
        ["1 fl oz (US)", "29.57 mL"],
        ["1 cup (US)", "240 mL"],
      ],
    },
    {
      title: "Illustrative examples",
      headers: ["Weight (kg)", "Typical band (~50–60 mL/kg/day)"],
      rows: [
        [5, "250–300 mL/day"],
        [10, "500–600 mL/day"],
        [20, "1000–1200 mL/day"],
        [30, "1500–1800 mL/day"],
      ],
      notes: ["General guides; personalize with your veterinarian."],
    },
  ],

  faqs: [
    { question: "Do wet foods reduce thirst?", answer: "Generally yes—wet foods contribute to total water and can reduce water bowl intake." },
    { question: "When should I be concerned?", answer: "Very low or very high intake for several days; lethargy, vomiting, or urination changes — talk to your veterinarian." },
  ],

  sources: [
    { label: "Merck Veterinary Manual — Water Requirements (overview)", href: "https://www.merckvetmanual.com/" },
    { label: "WSAVA — Global Nutrition Guidelines (hydration context)", href: "https://wsava.org/" },
  ],

  relatedLinks: [
    { label: "Dog Calorie Needs — RER & MER", href: "/pets/dogs/dog-calorie-needs-rer-mer" },
    { label: "Dog Grape/Raisin Exposure Risk", href: "/pets/dogs/dog-grape-raisin-exposure-risk" },
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dogs/dog-chocolate-toxicity-calculator" },
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
    "publisher": { "@type": "Organization", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com" },
  };
  const faqsJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (cfg.faqs ?? []).map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };
  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Pets", "item": "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", "position": 2, "name": "Dogs", "item": "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", "position": 3, "name": TITLE, "item": CANONICAL },
    ],
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
      <EEATBanner niche="pets" />
      <JsonLd data={softwareJson} />
      <JsonLd data={faqsJson} />
      <JsonLd data={breadcrumbsJson} />
      <JsonLd data={webpageJson} />
      <PetCalcOmniTemplate config={cfg} />
    </>
  );
}