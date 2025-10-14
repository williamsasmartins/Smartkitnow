// src/components/calculators/DogGrapeRaisinExposureCalculator.tsx
import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

type Item = "grapes" | "raisins";
type Measure = "count" | "g" | "oz";

// ====== SEO constants ======
const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-grape-raisin-exposure-risk";
const TITLE = "Dog Grape/Raisin Exposure Risk";
const DESC =
  "Any grape/raisin ingestion can be dangerous for dogs. Use this triage tool and contact your veterinarian immediately.";
const OG_IMAGE = undefined; // optional social image URL

const AVG_WEIGHTS = {
  grape_g: 5,       // ~5 g por uva inteira (média de mercado)
  raisin_g: 0.6,    // ~0.6 g por uva-passa (varia 0.5–0.7 g)
};

const cfg: PetCalcOmniConfig = {
  title: TITLE,
  shortDescription:
    "Any ingestion of grapes or raisins can be dangerous for dogs. Use this tool for triage only and call your veterinarian immediately.",
  strongDisclaimer:
    "No 'safe' amount is known. Some dogs develop acute kidney injury even with small exposures, while others do not. This tool is for educational triage only and does not replace veterinary care.",
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

  // Inputs do painel
  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },

    { type: "select", key: "item", label: "Item Ingested", default: "grapes",
      options: [
        { value: "grapes",  label: "Grapes (fresh)" },
        { value: "raisins", label: "Raisins (dried)" },
      ]
    },

    { type: "select", key: "measure", label: "How did you measure it?", default: "count",
      options: [
        { value: "count", label: "Count" },
        { value: "g",     label: "Grams" },
        { value: "oz",    label: "Ounces" },
      ]
    },

    { type: "number", key: "amount", label: "Amount", min: 0, step: 1, default: 5 },

    { type: "number", key: "hours", label: "Hours since ingestion", min: 0, step: 0.5, default: 1 },
  ],

  // Cálculo (triagem). NÃO determina "segurança" — qualquer >0 é exposição.
  compute: (s) => {
    const w = parseFloat(s.weight || "0");
    const wkg = s.toKg(w, s.weightUnit);
    const item: Item = s.item || "grapes";
    const measure: Measure = s.measure || "count";
    const amount = parseFloat(s.amount || "0");
    const hours = parseFloat(s.hours || "0");

    // Normaliza para GRAMAS ingeridos
    let grams = 0;
    if (measure === "count") {
      grams = (item === "grapes" ? AVG_WEIGHTS.grape_g : AVG_WEIGHTS.raisin_g) * amount;
    } else if (measure === "g") {
      grams = amount;
    } else {
      grams = amount * 28.349523125; // oz -> g
    }

    const gramsPerKg = wkg > 0 ? grams / wkg : 0;

    // Lógica de "risco": qualquer >0 é EXPOSITION
    let riskKey: "none" | "exposure" | "recent-exposure" = "none";
    if (grams > 0) {
      // Se <= 2h, destacar urgência (pode existir janela para intervenções)
      riskKey = hours <= 2 ? "recent-exposure" : "exposure";
    }

    return {
      metrics: {
        gramsIngested: grams,
        gramsPerKg,
        timeHours: hours,
      },
      riskKey,
    };
  },

  metricsDisplay: [
    { key: "gramsIngested", label: "Estimated amount (g)", format: (v) => `${Math.round(v)} g` },
    { key: "gramsPerKg",    label: "Amount per kg (g/kg)", format: (v) => `${(v ?? 0).toFixed(1)} g/kg` },
    { key: "timeHours",     label: "Time since ingestion", format: (v) => `${(v ?? 0).toFixed(1)} h` },
  ],

  riskBands: [
    {
      id: "none",
      label: "No exposure entered",
      tone: "bg-emerald-600",
      message: "Enter the amount to assess exposure. If you suspect ingestion, call your vet.",
    },
    {
      id: "recent-exposure",
      label: "Exposure — Recent",
      tone: "bg-red-700",
      message:
        "Urgent: call your veterinarian or an emergency clinic now. There may be time-sensitive options they can advise within the first hours.",
    },
    {
      id: "exposure",
      label: "Exposure",
      tone: "bg-red-600",
      message:
        "Call your veterinarian as soon as possible. There is no known safe dose for grapes/raisins in dogs.",
    },
  ],

  cta: { label: "Call your veterinarian or a poison helpline immediately" },
  stickyCta: {
    whenRiskIn: ["recent-exposure", "exposure"],
    label: "Urgent: call your vet",
    tel: "+1-800-222-1222",
  },

  howToUse: [
    "Enter your dog’s weight and units.",
    "Select whether grapes or raisins were ingested.",
    "Enter the amount — as a count or in grams/ounces.",
    "Add how many hours have passed since ingestion.",
    "Review the exposure status and contact your veterinarian immediately.",
  ],

  howItWorks: {
    intro:
      "Grape and raisin toxicosis in dogs is idiosyncratic and not dose-predictable. Some dogs develop acute kidney injury after very small exposures, while others remain asymptomatic after larger amounts.",
    formula:
      "This tool does not compute a 'safe' threshold. It standardizes your entry (count → grams; ounces → grams) and shows g/kg only to document exposure, not to determine safety.",
    variables: [
      "grams — approximate mass of grapes/raisins ingested (count × average weight per item when needed)",
      "weight_kg — dog body weight in kilograms",
      "hours — time since ingestion (early veterinary guidance can change management)",
    ],
  },

  tables: [
    {
      title: "Helpful approximations for owners",
      headers: ["Item", "Typical per-item mass (g)", "Household conversions"],
      rows: [
        ["Grape (fresh)", "≈5 g", "1 oz ≈ 28 g ≈ ~5–6 grapes"],
        ["Raisin (dried)", "≈0.6 g", "1 tbsp ≈ 9–10 g (varies)"],
      ],
      notes: [
        "Weights vary by brand/size; when possible, weigh the actual product.",
        "Use these only to estimate quantity if you counted items.",
      ],
    },
    {
      title: "What to do after exposure (owner triage)",
      headers: ["Timing", "Typical actions"],
      rows: [
        ["Immediately", "Call your veterinarian/ER. Do not induce vomiting unless instructed by a vet."],
        ["Within ~2 hours", "Your vet may advise decontamination options depending on the case."],
        ["0–24 hours", "Monitor for vomiting, lethargy, reduced appetite/urination; follow vet guidance and labs as advised."],
      ],
      notes: [
        "Management depends on individual factors, co-ingestants, and exam findings.",
      ],
    },
    {
      title: "Common signs to report",
      headers: ["System", "Possible signs"],
      rows: [
        ["GI", "Vomiting, diarrhea, abdominal discomfort"],
        ["General", "Lethargy, decreased appetite"],
        ["Kidneys", "Changes in urination; in severe cases, acute kidney injury"],
      ],
      notes: ["Absence of early signs does not rule out risk."],
    },
  ],

  faqs: [
    {
      question: "Is any amount safe?",
      answer:
        "No. There is no reliably safe amount. Treat any ingestion as an exposure and call your veterinarian.",
    },
    {
      question: "Are raisins more dangerous than grapes?",
      answer:
        "Raisins are dehydrated and smaller, so dogs may ingest more 'units' quickly; both are unsafe, and any exposure warrants veterinary advice.",
    },
    {
      question: "Should I induce vomiting at home?",
      answer:
        "Do not induce vomiting unless a veterinarian instructs you to do so. Phone triage will consider time since ingestion and your dog’s status.",
    },
    {
      question: "My dog seems fine — can I wait?",
      answer:
        "Do not rely on absence of signs. Contact your veterinarian or a poison helpline promptly.",
    },
  ],

  sources: [
    { label: "Merck Veterinary Manual — Grapes & Raisins in Dogs", href: "https://www.merckvetmanual.com/" },
    { label: "Pet Poison Helpline — Grapes & Raisins", href: "https://www.petpoisonhelpline.com/" },
  ],
  
  relatedLinks: [
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dogs/dog-chocolate-toxicity-calculator" },
    { label: "Dog Water Intake — Daily Hydration", href: "/pets/dogs/dog-water-intake" },
    { label: "Dog Calorie Needs — RER & MER", href: "/pets/dogs/dog-calorie-needs-rer-mer" },
  ],
};

export default function DogGrapeRaisinExposureCalculator() {
  const softwareJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: TITLE,
    applicationCategory: "Calculator",
    applicationSubCategory: "Pet Health",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: CANONICAL,
    description: DESC,
    publisher: { "@type": "Organization", name: "Smart Kit Now", url: "https://www.smartkitnow.com" },
  } as const;

  const faqsJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity:
      cfg.faqs?.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })) ?? [],
  } as const;

  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", position: 3, name: TITLE, item: CANONICAL },
    ],
  } as const;

  const webpageJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    url: CANONICAL,
    description: DESC,
    isPartOf: { "@type": "WebSite", name: "Smart Kit Now", url: "https://www.smartkitnow.com" },
    author: {
      "@type": "Person",
      name: cfg.authoredBy?.name,
      jobTitle: cfg.authoredBy?.role,
      url: cfg.authoredBy?.bioUrl,
    },
    reviewedBy: {
      "@type": "Organization",
      name: cfg.reviewedBy?.name,
    },
    dateModified: cfg.authoredBy?.date || cfg.reviewedBy?.date,
  } as const;

  return (
    <>
      <SeoHead title={TITLE} description={DESC} canonical={CANONICAL} ogImage={OG_IMAGE} />
      <JsonLd data={softwareJson} />
      <JsonLd data={faqsJson} />
      <JsonLd data={breadcrumbsJson} />
      <JsonLd data={webpageJson} />
      <PetCalcOmniTemplate config={cfg} />
    </>
  );
}