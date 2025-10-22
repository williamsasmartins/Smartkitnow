import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";


// Reference examples (illustrative only  brands vary widely)
const PRODUCT_REFERENCE = {
  gum_piece: { label: "Sugar-free gum (per piece)", mgPerUnit: 300 },
  mint_piece: { label: "Sugar-free mint (per mint)", mgPerUnit: 200 },
  gum_pack: { label: "Sugar-free gum (per pack)", mgPerUnit: 3000 },
  baked_good_serving: { label: "Sugar-free baked good (per serving)", mgPerUnit: 1000 },
  peanut_butter_tbsp: { label: "Sugar-free peanut butter (per tablespoon)", mgPerUnit: 1000 },
  toothpaste_gram: { label: "Toothpaste (per gram)", mgPerUnit: 500 },
  mouthwash_tbsp: { label: "Mouthwash (per tablespoon)", mgPerUnit: 1000 },
  custom_mg: { label: "Custom mg per unit (enter below)", mgPerUnit: 100 },
} as const;

type ProdKey = keyof typeof PRODUCT_REFERENCE;

function classifyXylitolDose(dose_mg_per_kg: number) {
  if (!Number.isFinite(dose_mg_per_kg) || dose_mg_per_kg <= 0) {
    return { id: "caution", label: "Caution", tone: "bg-yellow-600", message: "Check inputs and contact a veterinarian for guidance." };
  }
  if (dose_mg_per_kg < 50) {
    return { id: "caution", label: "Caution", tone: "bg-yellow-600", message: "Asymptomatic or mild GI; individual risk varies. Contact a veterinarian." };
  }
  if (dose_mg_per_kg < 100) {
    return { id: "hypo", label: "Hypoglycemia", tone: "bg-orange-600", message: "Risk of hypoglycemia. Veterinary evaluation with blood glucose recommended." };
  }
  if (dose_mg_per_kg < 500) {
    return { id: "high", label: "High", tone: "bg-red-700", message: "Marked hypoglycemia; possible hepatic injury. Seek urgent veterinary care." };
  }
  return { id: "veryhigh", label: "Very High", tone: "bg-red-800", message: "High risk of acute hepatic failure. Emergency  seek immediate care." };
}

const FAQS = [
  { question: "My dog chewed two sugar-free gum pieces; is it an emergency?", answer: "It may be. It depends on xylitol per piece and the dog's weight. Use the calculator to estimate mg/kg and contact a veterinarian immediately." },
  { question: "Can I find the xylitol content on the package?", answer: "Some brands list it; others don't. Contact the manufacturer's support if needed. When in doubt, treat as potentially high." },
  { question: "Should I induce vomiting?", answer: "Not without professional guidance. A veterinarian will weigh risks and benefits considering time since ingestion and the patient's condition." },
  { question: "Does this apply to cats too?", answer: "Cases in cats are less reported; this tool is specific to dogs. In any species, avoid exposure and consult a veterinarian." },
];

const SOURCES = [
  { label: "FDA  Xylitol & Pets", href: "https://www.fda.gov/" },
  { label: "Merck Veterinary Manual  Xylitol toxicosis (Dogs)", href: "https://www.merckvetmanual.com/" },
  { label: "Pet Poison Helpline  Xylitol (dogs)", href: "https://www.petpoisonhelpline.com/" },
];

const cfg: PetCalcOmniConfig = {
  title: "Dog Xylitol Exposure Calculator",
  shortDescription:
    "Estimate a dog's xylitol dose (mg/kg) from gum, mints, or foods and view an educational risk band. For guidance only — contact a veterinarian immediately.",
  strongDisclaimer:
    "Educational tool only. Xylitol concentrations vary widely between products and brands. Treat any suspected ingestion as urgent and contact a veterinarian immediately.",
  reviewedNote: "Reviewed by the Smart Kit Now editorial team. Content for general guidance only. For medical decisions, consult a licensed veterinarian.",
  showTopAd: true,
  showRightAd: false,

  inputs: [
    { type: "number", key: "weight", label: "Dog weight", min: 0, step: 0.1, default: 10 },
    { type: "unit",   key: "weightUnit", label: "Weight unit", options: ["kg","lb"], default: "kg" },
    { type: "select", key: "productType", label: "Product type", default: "gum_piece",
      options: Object.entries(PRODUCT_REFERENCE).map(([value, v]) => ({ value, label: v.label })) },
    { type: "number", key: "amount", label: "Amount (pieces or grams)", min: 0, step: 1, default: 2 },
    { type: "select", key: "amountUnit", label: "Amount unit", default: "piece", options: [
      { value: "piece", label: "pieces" },
      { value: "g", label: "grams (g)" },
    ] },
    { type: "number", key: "customMgPerUnit", label: "Custom mg per piece (if selected)", min: 0, step: 10, default: 100 },
    { type: "number", key: "customMgPerGram", label: "Custom mg per gram (if selected)", min: 0, step: 1, default: 0 },
    { type: "number", key: "totalMg", label: "Total xylitol (mg) — if known", min: 0, step: 10, default: 0 },
  ],

  compute: (s) => {
    const toKg = (v:number,u:"kg"|"lb") => (u==="lb"? v*0.45359237: v);
    const w = parseFloat(s.weight || "0");
    const wkg = toKg(w, s.weightUnit);

    const key: ProdKey = (s.productType || "gum_piece") as ProdKey;
    const amount = parseFloat(s.amount || "0");
    const amountUnit: "piece"|"g" = (s.amountUnit || "piece") as any;

    const ref = PRODUCT_REFERENCE[key];
    const isCustom = key === "custom_mg";
    const mgPerPiece = isCustom ? parseFloat(s.customMgPerUnit || "0") : (ref?.mgPerUnit ?? 0);
    const mgPerGramCustom = parseFloat(s.customMgPerGram || "0");

    // If "gram" unit chosen and we have a grams-based reference key, use amount directly; otherwise estimate by per-piece
    let estimatedTotalMg = 0;
    if (amountUnit === "g") {
      // Prefer custom mg per gram if provided (>0), otherwise approximate using mgPerPiece as a rough per-piece estimate
      const mgPerGram = mgPerGramCustom > 0 ? mgPerGramCustom : 0;
      estimatedTotalMg = mgPerGram > 0 ? (amount * mgPerGram) : (amount * mgPerPiece); // fallback approximate
    } else {
      estimatedTotalMg = amount * mgPerPiece;
    }

    const totalMgDirect = parseFloat(s.totalMg || "0");
    const total_xylitol_mg = totalMgDirect > 0 ? totalMgDirect : estimatedTotalMg;
    const dose_mg_per_kg = wkg > 0 ? total_xylitol_mg / wkg : 0;

    // 4-band educational classification
    let riskKey: "low"|"moderate"|"high"|"emergency" = "low";
    if (!Number.isFinite(dose_mg_per_kg) || dose_mg_per_kg <= 0) riskKey = "low";
    else if (dose_mg_per_kg < 50) riskKey = "low";
    else if (dose_mg_per_kg < 100) riskKey = "moderate";
    else if (dose_mg_per_kg < 500) riskKey = "high";
    else riskKey = "emergency";

    return {
      metrics: {
        total_xylitol_mg: total_xylitol_mg,
        dose_mg_per_kg: dose_mg_per_kg,
        mg_per_unit: mgPerPiece,
        units: amount,
      },
      riskKey,
    };
  },

  metricsDisplay: [
    { key: "total_xylitol_mg", label: "Total xylitol (mg)", format: (v) => `${Math.round(v)}` },
    { key: "dose_mg_per_kg", label: "Dose (mg/kg)", format: (v) => `${Math.round(v)} mg/kg` },
    { key: "mg_per_unit", label: "Reference mg per piece (estimate)", format: (v) => `${Math.round(v)} mg` },
  ],

  riskBands: [
    { id: "low", label: "Low", tone: "bg-emerald-600", message: "< 50 mg/kg: Asymptomatic or mild GI; individual risk varies. Contact a veterinarian." },
    { id: "moderate", label: "Moderate (Hypoglycemia risk)", tone: "bg-amber-500", message: "50–100 mg/kg: Lethargy, weakness, vomiting, ataxia, seizures. Veterinary evaluation (check blood glucose)." },
    { id: "high", label: "High", tone: "bg-orange-600", message: "100–500 mg/kg: Marked hypoglycemia; possible hepatic injury. Urgent veterinary care." },
    { id: "emergency", label: "Emergency", tone: "bg-red-700", message: "≥ 500 mg/kg: High risk of acute hepatic failure. Immediate emergency care." },
  ],

  stickyCta: { whenRiskIn: ["moderate", "high", "emergency"], label: "Call your veterinarian now", href: "https://www.petpoisonhelpline.com/" },

  professionalAdviceNote: "Hypoglycemia may develop within 30 minutes to several hours after ingestion. Hepatic injury, when it occurs, may develop later. Early veterinary care is critical.",

  howToUse: [
    "Enter the dog's weight and unit (kg or lb).",
    "Choose the product type and amount (pieces or grams).",
    "If you know the total mg (from packaging/serving), enter it for a direct calculation; otherwise the tool estimates per unit.",
    "Use the educational dose band (mg/kg) for triage and contact a veterinarian immediately.",
  ],

  howItWorks: {
    intro:
      "Xylitol, a common sweetener in sugar‑free products, can cause acute hypoglycemia and hepatic injury in dogs. Because concentration varies widely among brands, this tool accepts a total mg or estimates from product categories, showing an educational risk band (mg/kg).",
    formula: "dose_mg_per_kg = total_xylitol_mg ÷ weight_kg",
    variables: [
      "total_xylitol_mg — estimated from package/servings OR reference tables",
      "weight_kg — dog weight in kilograms",
    ],
  },

  tables: [
    {
      title: "Educational reference — example xylitol amounts per unit",
      headers: ["Product type", "Approx. mg per unit (example)"],
      rows: Object.entries(PRODUCT_REFERENCE)
        .filter(([k]) => k !== "custom_mg")
        .map(([k, v]) => [v.label, v.mgPerUnit]),
      notes: [
        "Illustrative values; brands/lots vary widely. Always check packaging when possible.",
        "This table does NOT indicate a 'safe dose'. Any ingestion: contact a veterinarian.",
      ],
    },
    {
      title: "Illustrative dose (mg/kg) for 2 units",
      headers: ["Product", "Dog 5 kg", "Dog 10 kg", "Dog 20 kg"],
      rows: (() => {
        const units = 2;
        const d = (mgPerUnit: number, kg: number) => ((mgPerUnit * units) / kg).toFixed(0);
        return Object.entries(PRODUCT_REFERENCE)
          .filter(([k]) => k !== "custom_mg")
          .map(([k, v]) => [
            v.label,
            d(v.mgPerUnit, 5),
            d(v.mgPerUnit, 10),
            d(v.mgPerUnit, 20),
          ]);
      })(),
      notes: ["Use actual dog weight and specific quantity for better estimates."],
    },
    {
      title: "Dose bands (educational) and possible signs",
      headers: ["Band (mg/kg)", "Possible signs", "When to act"],
      rows: [
        ["< 50 (Low)", "Asymptomatic or mild GI; individual risk varies", "Contact veterinarian for guidance and monitoring"],
        ["50–100 (Moderate)", "Lethargy, weakness, vomiting, ataxia, seizures", "Veterinary evaluation (check blood glucose)"],
        ["100–500 (High)", "Marked hypoglycemia; possible hepatic injury", "Urgent veterinary care"],
        ["≥ 500 (Emergency)", "High risk of acute hepatic failure", "Immediate emergency care"],
      ],
      notes: ["Hypoglycemia may develop within 30 minutes to several hours after ingestion; hepatic injury may occur hours later."],
    },
  ],

  faqs: [
    { question: "My dog ate one piece of sugar‑free gum — what should I do?", answer: "Call your veterinarian or an emergency clinic immediately. Gum can contain very high xylitol per piece depending on brand; do not wait for symptoms." },
    { question: "How fast can xylitol cause problems?", answer: "Hypoglycemia may develop within 30 minutes to several hours after ingestion. Hepatic injury, when it occurs, may develop later. Early veterinary care is critical." },
    { question: "The package says ‘natural sweetener’ — is it xylitol?", answer: "‘Natural sweetener’ is nonspecific. Check the ingredients list for ‘xylitol.’ If uncertain, treat as a potential exposure and call your veterinarian." },
    { question: "Can I induce vomiting at home?", answer: "Do not induce vomiting unless specifically instructed by a veterinarian. Some circumstances make home induction unsafe." },
    { question: "Is any xylitol amount safe for dogs?", answer: "Sensitivity and product concentrations vary; even small amounts can be dangerous. Seek professional advice." },
  ],
  sources: [
    { label: "FDA — Xylitol and Dogs (consumer health updates)", href: "https://www.fda.gov/consumers/consumer-updates/paws-xylitol-its-dangerous-dogs" },
    { label: "Merck Veterinary Manual — Xylitol toxicity in dogs", href: "https://www.merckvetmanual.com/toxicology/food-hazards/xylitol-toxicosis-in-dogs" },
    { label: "WSAVA — Nutritional and toxicology guidance (general references)", href: "https://wsava.org/global-guidelines/" },
    { label: "Pet Poison Helpline — Xylitol poisoning overview", href: "https://www.petpoisonhelpline.com/poison/xylitol/" },
  ],

  relatedLinks: [
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dog-chocolate-toxicity-calculator" },
    { label: "Dog Grape/Raisin Exposure Risk", href: "/pets/dog-grape-raisin-exposure-risk" },
    { label: "Dog Water Intake — Daily Hydration", href: "/pets/dog-water-intake" },
  ],

  seo: {
    title: "Dog Xylitol Exposure Calculator — Estimate mg/kg dose & educational risk",
    description:
      "Estimate a dog's xylitol dose (mg/kg) from gum, mints, or foods and view an educational risk band. For guidance only — contact a veterinarian immediately.",
    canonical: "https://www.smartkitnow.com/pets/dog-xylitol-exposure",
  },

  jsonLd: {
    webpage: {
      "@type": "WebPage",
      name: "Dog Xylitol Exposure Calculator",
      description:
        "Estimate a dog's xylitol dose (mg/kg) from gum, mints, or foods and view an educational risk band.",
      url: "https://www.smartkitnow.com/pets/dog-xylitol-exposure",
    },
    breadcrumbs: {
      items: [
        { name: "Home", item: "https://www.smartkitnow.com/" },
        { name: "Pets", item: "https://www.smartkitnow.com/pets" },
        { name: "Dog Xylitol Exposure", item: "https://www.smartkitnow.com/pets/dog-xylitol-exposure" },
      ],
    },
    faq: [
      { q: "My dog ate one piece of sugar‑free gum — what should I do?", a: "Call your veterinarian or an emergency clinic immediately. Gum can contain very high xylitol per piece depending on brand; do not wait for symptoms." },
      { q: "How fast can xylitol cause problems?", a: "Hypoglycemia may develop within 30 minutes to several hours after ingestion. Hepatic injury, when it occurs, may develop later. Early veterinary care is critical." },
      { q: "The package says ‘natural sweetener’ — is it xylitol?", a: "‘Natural sweetener’ is nonspecific. Check the ingredients list for ‘xylitol.’ If uncertain, treat as a potential exposure and call your veterinarian." },
      { q: "Can I induce vomiting at home?", a: "Do not induce vomiting unless specifically instructed by a veterinarian. Some circumstances make home induction unsafe." },
      { q: "Is any xylitol amount safe for dogs?", a: "Sensitivity and product concentrations vary; even small amounts can be dangerous. Seek professional advice." },
    ],
  },
};

export default function DogXylitolExposureCalculator() {
  const TITLE = (cfg.seo?.title ?? cfg.title) as string;
  const DESC = (cfg.seo?.description ?? cfg.shortDescription) as string;
  const CANONICAL = cfg.seo?.canonical as string | undefined;

  const webpageJson = {
    "@context": "https://schema.org",
    ...(cfg.jsonLd?.webpage ?? { "@type": "WebPage", name: TITLE, url: CANONICAL, description: DESC }),
  };
  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": (cfg.jsonLd?.breadcrumbs?.items ?? [
      { name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
      { name: TITLE, item: CANONICAL },
    ]).map((b: any, idx: number) => ({ "@type": "ListItem", position: idx + 1, name: b.name, item: b.item })),
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
