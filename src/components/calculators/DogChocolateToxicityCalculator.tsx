import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

const CHOCOLATE = {
  milk:   { label: "Milk Chocolate",     theo: 1.6,  caf: 0.2,  hint: "~1.8 mg/g" },
  dark:   { label: "Dark/Semisweet",     theo: 6.0,  caf: 0.6,  hint: "~6.6 mg/g" },
  baking: { label: "Baking/Unsweetened", theo: 15.0, caf: 1.2,  hint: "~16.2 mg/g" },
  cocoa:  { label: "Cocoa Powder",       theo: 20.0, caf: 2.0,  hint: "~22 mg/g"  },
  white:  { label: "White (trace)",      theo: 0.05, caf: 0.0,  hint: "trace"     },
} as const;

const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-chocolate-toxicity-calculator";
const TITLE = "Dog Chocolate Toxicity Calculator (v2)";
const DESC = "Estimate risk by weight, chocolate type, and amount ingested. Educational triage — contact your veterinarian immediately if exposure is suspected.";

const cfg: PetCalcOmniConfig = {
  title: TITLE,
  shortDescription:
    "Estimate risk based on dog weight, chocolate type, and amount ingested. Educational use only — contact your veterinarian immediately if ingestion is suspected.",
  strongDisclaimer:
    "This tool does not replace professional veterinary care. Toxicity risk depends on individual sensitivity, stomach contents, co-ingestants, and timing.",
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

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "amount", label: "Amount Ingested", min: 0, step: 1, default: 50 },
    { type: "unit",   key: "amountUnit", label: "Amount Unit", options: ["g","oz"], default: "g" },
    { type: "select", key: "type", label: "Chocolate Type", default: "milk",
      options: Object.entries(CHOCOLATE).map(([value,v])=>({ value, label: `${v.label} (${v.hint})` })) },
  ],

  compute: (s) => {
    const w = parseFloat(s.weight || "0");
    const a = parseFloat(s.amount || "0");
    const wkg   = s.toKg(w, s.weightUnit);
    const grams = s.toGrams(a, s.amountUnit);
    const kind = (s.type as keyof typeof CHOCOLATE) ?? "milk";
    const p = CHOCOLATE[kind];
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
    { key: "theobromineMg", label: "Theobromine (mg)",     format: v => `${Math.round(v)} mg` },
    { key: "caffeineMg",    label: "Caffeine (mg)",        format: v => `${Math.round(v)} mg` },
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
  stickyCta: {
    whenRiskIn: ["high", "veryhigh"],
    label: "Emergency: call your vet now",
    tel: "+1-800-222-1222"
  },

  howToUse: [
    "Enter your dog’s weight and unit.",
    "Select chocolate type and amount ingested.",
    "Review mg/kg and risk band; call your vet.",
  ],

  howItWorks: {
    intro: "Chocolate contains methylxanthines — theobromine and caffeine. We estimate dose per kg to triage risk.",
    formula: "dose_mg_per_kg = (grams × (theobromine_mg/g + caffeine_mg/g)) ÷ weight_kg",
    variables: ["grams — chocolate amount", "theobromine/caffeine — by type", "weight_kg — dog body weight"],
  },

  tables: [
    {
      title: "Approximate methylxanthine content by chocolate type",
      headers: ["Type", "Theobromine (mg/g)", "Caffeine (mg/g)", "Total (mg/g)"],
      rows: Object.entries(CHOCOLATE).map(([k,v])=>[v.label, v.theo, v.caf, (v.theo+v.caf).toFixed(1)]),
    },
  ],

  faqs: [
    { question: "Is white chocolate safe?", answer: "Even with trace methylxanthines, ingestion can cause GI upset. Always consult your vet." },
    { question: "When is this an emergency?", answer: "High dose for weight or neuro/cardiac signs (tremors, seizures) — emergency care now." },
  ],

  sources: [
    { label: "FDA — Pets & Chocolate", href: "https://www.fda.gov/" },
    { label: "Merck Veterinary Manual — Chocolate intoxication", href: "https://www.merckvetmanual.com/" },
  ],

  relatedLinks: [
    { label: "Dog Grape/Raisin Exposure Risk", href: "/pets/dogs/dog-grape-raisin-exposure-risk" },
    { label: "Dog Water Intake — Daily Hydration", href: "/pets/dogs/dog-water-intake" },
    { label: "Dog Calorie Needs — RER & MER", href: "/pets/dogs/dog-calorie-needs-rer-mer" },
  ],
};

export default function DogChocolateToxicityCalculator() {
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
      { "@type": "ListItem", "position": 3, "name": "Dog Chocolate Toxicity Calculator", "item": CANONICAL }
    ]
  };

  const reviewedByName =
    typeof cfg.reviewedBy === "string" ? cfg.reviewedBy : cfg.reviewedBy?.name;
  const reviewedByDate =
    typeof cfg.reviewedBy === "string" ? undefined : cfg.reviewedBy?.date;

  const webpageJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": TITLE,
    "url": CANONICAL,
    "description": DESC,
    "isPartOf": { "@type": "WebSite", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com" },
    "author": { "@type": "Person", "name": cfg.authoredBy?.name, "jobTitle": cfg.authoredBy?.role, "url": cfg.authoredBy?.bioUrl },
    ...(reviewedByName
      ? { "reviewedBy": { "@type": "Organization", "name": reviewedByName } }
      : {}),
    "dateModified": cfg.authoredBy?.date || reviewedByDate,
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