// src/components/calculators/DogChocolateToxicityCalculator.tsx
import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";

const CHOCOLATE = {
  milk:  { label: "Milk Chocolate",        theo: 1.6,  caf: 0.2 },
  dark:  { label: "Dark/Semisweet",        theo: 6.0,  caf: 0.6 },
  baking:{ label: "Baking/Unsweetened",    theo: 15.0, caf: 1.2 },
  cocoa: { label: "Cocoa Powder",          theo: 20.0, caf: 2.0 },
  white: { label: "White (trace)",         theo: 0.05, caf: 0.0 },
} as const;

const cfg: PetCalcOmniConfig = {
  title: "Dog Chocolate Toxicity Calculator",
  shortDescription:
    "Estimate risk based on dog weight, chocolate type, and amount ingested. Educational use only — contact your veterinarian immediately if ingestion is suspected.",
  strongDisclaimer:
    "This tool does not replace professional veterinary care. Toxicity risk depends on individual sensitivity, stomach contents, co-ingestants, and timing. If exposure is suspected, call a veterinarian or poison helpline immediately.",
  showTopAd: true,
  showRightAd: true,

  // Inputs
  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "amount", label: "Amount Ingested", min: 0, step: 1, default: 50 },
    { type: "unit",   key: "amountUnit", label: "Amount Unit", options: ["g","oz"], default: "g" },
    { type: "select", key: "type", label: "Chocolate Type", default: "milk",
      options: Object.entries(CHOCOLATE).map(([value,v])=>({ value, label: v.label })) },
  ],

  // Cálculo
  compute: (s) => {
    const w = parseFloat(s.weight || "0");
    const a = parseFloat(s.amount || "0");
    const wkg   = s.toKg(w, s.weightUnit);
    const grams = s.toGrams(a, s.amountUnit);
    const p = CHOCOLATE[s.type as keyof typeof CHOCOLATE] ?? CHOCOLATE.milk;

    const theo = grams * p.theo;
    const caf  = grams * p.caf;
    const total = theo + caf;
    const dose = wkg > 0 ? total / wkg : 0;

    const riskKey =
      dose < 10 ? "low" :
      dose < 20 ? "mild" :
      dose < 40 ? "moderate" :
      dose < 60 ? "high" : "veryhigh";

    return { metrics: { theobromineMg: theo, caffeineMg: caf, doseMgPerKg: dose }, riskKey };
  },

  metricsDisplay: [
    { key: "theobromineMg", label: "Theobromine (mg)", format: v => `${Math.round(v)} mg` },
    { key: "caffeineMg",    label: "Caffeine (mg)",    format: v => `${Math.round(v)} mg` },
    { key: "doseMgPerKg",   label: "Total per kg (mg/kg)", format: v => `${(v ?? 0).toFixed(1)} mg/kg` },
  ],

  riskBands: [
    { id: "low",      label: "Low",       tone: "bg-emerald-600", message: "Unlikely to see signs; monitor and consult a vet if symptoms appear." },
    { id: "mild",     label: "Mild",      tone: "bg-yellow-600",  message: "Mild signs possible. Call your vet for guidance." },
    { id: "moderate", label: "Moderate",  tone: "bg-orange-600",  message: "Moderate risk. Contact a vet promptly." },
    { id: "high",     label: "High",      tone: "bg-red-600",     message: "High risk. Seek veterinary care urgently." },
    { id: "veryhigh", label: "Very High", tone: "bg-red-700",     message: "Emergency. Go to an emergency veterinary clinic immediately." },
  ],

  cta: { label: "Contact your veterinarian or an emergency clinic now." },

  // Editorial — bem preenchido (estilo Omni)
  howToUse: [
    "Enter your dog’s weight and choose the correct unit (kg or lb).",
    "Select the chocolate type and enter the estimated amount ingested.",
    "Review the total dose (mg/kg) and the risk band. Call your vet for guidance.",
    "If ingestion is recent, your vet may advise decontamination steps. Do not induce vomiting unless instructed.",
  ],

  howItWorks: {
    intro:
      "Chocolate contains methylxanthines (theobromine and caffeine). Darker chocolate typically contains more. The estimated dose per kilogram helps triage severity.",
    formula:
      "dose_mg_per_kg = (grams × (theobromine_mg/g + caffeine_mg/g)) ÷ weight_kg",
    variables: [
      "grams — estimated amount of chocolate consumed",
      "theobromine_mg/g, caffeine_mg/g — reference content by chocolate type (approximate)",
      "weight_kg — dog body weight in kilograms",
    ],
  },

  tables: [
    {
      title: "Approximate methylxanthine content by chocolate type",
      headers: ["Type", "Theobromine (mg/g)", "Caffeine (mg/g)"],
      rows: Object.entries(CHOCOLATE).map(([k,v])=>[v.label, v.theo, v.caf]),
      notes: ["Values are simplified educational references; different brands/batches vary."],
    },
    {
      title: "Example doses for 50 g of chocolate",
      headers: ["Weight (kg)", "Milk (mg/kg)", "Dark (mg/kg)", "Baking (mg/kg)"],
      rows: [
        [5,  Math.round((50*(1.6+0.2))/5),  Math.round((50*(6.0+0.6))/5),  Math.round((50*(15.0+1.2))/5)],
        [10, Math.round((50*(1.6+0.2))/10), Math.round((50*(6.0+0.6))/10), Math.round((50*(15.0+1.2))/10)],
        [20, Math.round((50*(1.6+0.2))/20), Math.round((50*(6.0+0.6))/20), Math.round((50*(15.0+1.2))/20)],
        [30, Math.round((50*(1.6+0.2))/30), Math.round((50*(6.0+0.6))/30), Math.round((50*(15.0+1.2))/30)],
      ],
      notes: ["Use your dog’s exact weight and actual amount for a better estimate."],
    },
  ],

  faqs: [
    { question: "Is white chocolate safe?", answer: "White chocolate has trace methylxanthines, but may still cause GI upset. Always consult your vet." },
    { question: "When is this an emergency?", answer: "If your dog shows tremors, seizures, or if the dose is high for his weight — seek emergency care immediately." },
    { question: "Should I induce vomiting at home?", answer: "Do not induce vomiting unless instructed by a veterinarian." },
  ],

  sources: [
    { label: "FDA — Pets & Chocolate", href: "https://www.fda.gov/", note: "Background on chocolate hazards for pets." },
    { label: "Merck Veterinary Manual — Chocolate intoxication", href: "https://www.merckvetmanual.com/" },
  ],
};

export default function DogChocolateToxicityCalculator() {
  return <PetCalcOmniTemplate config={cfg} />;
}