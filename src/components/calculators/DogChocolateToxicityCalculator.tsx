// src/components/calculators/DogChocolateToxicityCalculator.tsx
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

// ====== SEO constants ======
const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-chocolate-toxicity-calculator";
const TITLE = "Dog Chocolate Toxicity Calculator";
const DESC =
  "Estimate risk based on dog weight, chocolate type, and amount ingested. Educational use only — contact your veterinarian immediately if ingestion is suspected.";
const OG_IMAGE = undefined; // optional social image URL

const cfg: PetCalcOmniConfig = {
  title: TITLE,
  shortDescription:
    "Estimate risk based on dog weight, chocolate type, and amount ingested. Educational use only — contact your veterinarian immediately if ingestion is suspected.",
  strongDisclaimer:
    "This tool does not replace professional veterinary care. Toxicity risk depends on individual sensitivity, stomach contents, co-ingestants, and timing. If exposure is suspected, call a veterinarian or poison helpline immediately.",
  showTopAd: true,
  showRightAd: false,

  authoredBy: {
    name: "Williams Martins",
    role: "Content Editor",
    date: "2025-10-13",
    bioUrl: " `https://www.smartkitnow.com/about` ",
  },

  reviewedBy: {
    name: "Dr. Jane Smith",
    credentials: "DVM",
    role: "Veterinarian",
    date: "2025-10-12",
    bioUrl: " `https://www.smartkitnow.com/about` ",
  },

  // Inputs
  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "amount", label: "Amount Ingested", min: 0, step: 1, default: 50 },
    { type: "unit",   key: "amountUnit", label: "Amount Unit", options: ["g","oz"], default: "g" },
    { type: "select", key: "type", label: "Chocolate Type", default: "milk",
      options: Object.entries(CHOCOLATE).map(([value,v])=>({ value, label: `${v.label} (${v.hint})` })) },
  ],

  // Cálculo
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
      "Chocolate contains methylxanthines — theobromine and caffeine. Darker chocolate typically contains more. We estimate dose per kg of body weight to triage risk.",
    formula:
      "dose_mg_per_kg = (grams × (theobromine_mg/g + caffeine_mg/g)) ÷ weight_kg",
    variables: [
      "grams — estimated amount of chocolate consumed",
      "theobromine_mg/g, caffeine_mg/g — approximate content by chocolate type",
      "weight_kg — dog body weight in kilograms",
    ],
  },

  tables: [
    {
      title: "Approximate methylxanthine content by chocolate type",
      headers: ["Type", "Theobromine (mg/g)", "Caffeine (mg/g)", "Total (mg/g)"],
      rows: Object.entries(CHOCOLATE).map(([k,v])=>[v.label, v.theo, v.caf, (v.theo+v.caf).toFixed(1)]),
      notes: [
        "Values are simplified educational references; brands/batches vary.",
        "Risk also depends on time since ingestion, stomach contents, and individual sensitivity.",
      ],
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
    {
      title: "How much chocolate can a 70 lb dog eat? (illustrative)",
      headers: ["Type", "Approx. grams to reach ~20 mg/kg (mild band)"],
      rows: (() => {
        // 70 lb ≈ 31.75 kg; alvo ~20 mg/kg (faixa 'mild')
        const weightKg = 31.7514659;
        const targetMg = 20 * weightKg; // ~635 mg
        const grams = (mgPerG: number) => (targetMg / mgPerG).toFixed(0);
        return [
          ["Milk Chocolate",        grams(sumMgPerGram("milk"))],   // ~353 g
          ["Dark/Semisweet",        grams(sumMgPerGram("dark"))],   // ~96 g
          ["Baking/Unsweetened",    grams(sumMgPerGram("baking"))], // ~39 g
          ["Cocoa Powder",          grams(sumMgPerGram("cocoa"))],  // ~29 g
          ["White (trace)",         "—"], // não encorajar cálculo
        ];
      })(),
      notes: [
        "This is not a 'safe' amount — it's an educational illustration for the ~20 mg/kg band.",
        "Any suspected ingestion warrants veterinary advice.",
      ],
    },
    {
      title: "Household conversions (helpful rough guide)",
      headers: ["Measure", "Approx. grams"],
      rows: [
        ["1 oz chocolate", "28 g"],
        ["1 tbsp cocoa powder (level)", "≈5–6 g"],
        ["1 square baking chocolate", "≈28 g (varies by brand)"],
      ],
      notes: ["Brand geometry varies; weigh when possible."],
    },
    {
      title: "Symptoms & timeline (typical, varies widely)",
      headers: ["Dose band", "Possible signs", "When to act"],
      rows: [
        ["Mild (~10–20 mg/kg)", "Restlessness, GI upset", "Call your vet for monitoring guidance"],
        ["Moderate (~20–40 mg/kg)", "Vomiting, agitation, tachycardia", "Vet assessment recommended"],
        ["High (≥40 mg/kg)", "Tremors, arrhythmias, seizures", "Emergency care immediately"],
      ],
      notes: ["Signs depend on the individual dog and co-ingestants."],
    },
  ],

  faqs: [
    { question: "Is white chocolate safe?", answer: "White chocolate contains trace methylxanthines, but ingestion can still cause GI upset. Always consult your vet." },
    { question: "When is this an emergency?", answer: "If dose is high for the dog's weight or if there are neurologic/cardiac signs (tremors, seizures, collapse) — seek emergency care immediately." },
    { question: "Should I induce vomiting at home?", answer: "Do not induce vomiting unless instructed by a veterinarian." },
    { question: "What info should I have when I call the vet?", answer: "Dog's weight, type of chocolate, estimated amount, and time since ingestion." },
  ],

  sources: [
    { label: "FDA — Pets & Chocolate", href: "https://www.fda.gov/", note: "Background on chocolate hazards for pets." },
    { label: "Merck Veterinary Manual — Chocolate intoxication", href: "https://www.merckvetmanual.com/" },
  ],
};

export default function DogChocolateToxicityCalculator() {
  // ===== JSON-LD blocks =====
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
    "@context": " `https://schema.org` ",
    "@type": "WebPage",
    name: TITLE,
    url: CANONICAL,
    description: DESC,
    isPartOf: { "@type": "WebSite", "name": "Smart Kit Now", "url": " `https://www.smartkitnow.com` " },
    author: {
      "@type": "Person",
      name: cfg.authoredBy?.name,
      jobTitle: cfg.authoredBy?.role,
      url: cfg.authoredBy?.bioUrl,
    },
    reviewedBy: {
      "@type": "Person",
      name: cfg.reviewedBy?.name,
      jobTitle: cfg.reviewedBy?.role,
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

function sumMgPerGram(kind: keyof typeof CHOCOLATE) {
  const p = CHOCOLATE[kind];
  return p.theo + p.caf;
}