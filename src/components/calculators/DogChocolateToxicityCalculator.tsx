import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";


const CHOC = {
  milk:   { label: "Milk Chocolate", theo: 1.6,  caf: 0.2,  hint: "~1.8 mg/g" },
  dark:   { label: "Dark/Semisweet", theo: 6.0,  caf: 0.6,  hint: "~6.6 mg/g" },
  baking: { label: "Baking/Unsweetened", theo: 15.0, caf: 1.2, hint: "~16.2 mg/g" },
  cocoa:  { label: "Cocoa Powder", theo: 20.0, caf: 2.0, hint: "~22 mg/g" },
  white:  { label: "White (trace)", theo: 0.05, caf: 0.0, hint: "trace" },
} as const;

function mgPerG(kind: keyof typeof CHOC) { const p = CHOC[kind]; return p.theo + p.caf; }

const cfg: PetCalcOmniConfig = {
  title: "Dog Chocolate Toxicity Calculator",
  shortDescription: "Estimate risk based on dog weight, chocolate type, and amount ingested. Educational use only — contact your veterinarian immediately if ingestion is suspected.",
  strongDisclaimer: "Não substitui atendimento veterinário. Risco depende de sensibilidade individual, conteúdo gástrico e tempo desde a ingestão.",
  updatedAt: "2025-10-15",
  showTopAd: true,
  showRightAd: false,

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "amount", label: "Amount Ingested", min: 0, step: 1, default: 50 },
    { type: "unit",   key: "amountUnit", label: "Amount Unit", options: ["g","oz"], default: "g" },
    { type: "select", key: "type", label: "Chocolate Type", default: "milk",
      options: Object.entries(CHOC).map(([value,v])=>({ value, label: `${v.label} (${v.hint})` })) },
  ],

  compute: (s) => {
    const w = parseFloat(s.weight || "0");
    const a = parseFloat(s.amount || "0");
    const wkg = s.toKg(w, s.weightUnit);
    const grams = s.toGrams(a, s.amountUnit);
    const kind = (s.type as keyof typeof CHOC) ?? "milk";
    const t = CHOC[kind];
    const theo = grams * t.theo, caf = grams * t.caf, total = theo + caf;
    const dose = wkg > 0 ? total / wkg : 0;
    const riskKey = dose < 10 ? "low" : dose < 20 ? "mild" : dose < 40 ? "moderate" : dose < 60 ? "high" : "veryhigh";
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

  howToUse: [
    "Informe o peso do cão (kg ou lb).",
    "Selecione o tipo de chocolate e a quantidade ingerida.",
    "Revise o valor total (mg/kg) e a faixa de risco.",
    "Se a ingestão foi recente, siga a orientação do seu veterinário. Não induza vômito sem instrução.",
  ],

  howItWorks: {
    intro: "Chocolate contém metilxantinas (teobromina e cafeína). Estimamos a dose por kg para triagem de risco.",
    formula: "dose_mg_per_kg = (grams × (theobromine_mg/g + caffeine_mg/g)) ÷ weight_kg",
    variables: ["grams — quantidade estimada de chocolate", "theobromine_mg/g + caffeine_mg/g — conteúdo por tipo", "weight_kg — peso do cão em quilogramas"],
  },

  tables: [
    {
      title: "Methylxanthine por tipo de chocolate (aprox.)",
      headers: ["Tipo", "Theobromine (mg/g)", "Caffeine (mg/g)", "Total (mg/g)"],
      rows: Object.entries(CHOC).map(([k,v]) => [v.label, v.theo, v.caf, (v.theo+v.caf).toFixed(1)]),
      notes: ["Valores educativos; marcas/lotes variam.", "Risco depende também do tempo desde ingestão e sensibilidade individual."],
    },
    {
      title: "Quanto chocolate pode levar ao ~20 mg/kg em um cão de 70 lb (31,75 kg)?",
      headers: ["Tipo", "Aprox. gramas para ~20 mg/kg"],
      rows: [
        ["Milk Chocolate", Math.round((20*31.7515)/mgPerG("milk"))],
        ["Dark/Semisweet", Math.round((20*31.7515)/mgPerG("dark"))],
        ["Baking/Unsweetened", Math.round((20*31.7515)/mgPerG("baking"))],
        ["Cocoa Powder", Math.round((20*31.7515)/mgPerG("cocoa"))],
        ["White (trace)", "—"],
      ],
      notes: ["Não é uma ‘dose segura’ — apenas ilustração educacional da faixa ~20 mg/kg.", "Qualquer suspeita → procure orientação veterinária."],
    },
  ],

  faqs: [
    { question: "Chocolate branco é seguro?", answer: "Tem traços de metilxantinas e pode causar desconforto GI. Sempre fale com o veterinário." },
    { question: "Quando é emergência?", answer: "Dose alta para o peso ou sinais neurológicos/cardiacos (tremores, convulsões, colapso) → emergência imediata." },
  ],

  glossary: [
    { term: "Teobromina", def: "Principal metilxantina do chocolate; tóxica para cães." },
    { term: "mg/kg", def: "Miligrama de substância por quilograma de peso corporal." },
  ],

  relatedLinks: [
    { label: "Dog Water Intake Calculator", href: "/pets/dog-water-intake" },
    { label: "Dog Calorie Needs (RER/MER)", href: "/pets/dog-calorie-needs-rer-mer" },
  ],

  sources: [
    { label: "FDA — Pets & Chocolate (visão geral)", href: "https://www.fda.gov/animal-veterinary", note: "Informações sobre perigos do chocolate para animais." },
    { label: "Merck Veterinary Manual — Chocolate intoxication", href: "https://www.merckvetmanual.com/" },
  ],

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  seo: {
    title: "Dog Chocolate Toxicity Calculator | Smart Kit Now",
    description: "Veja rapidamente o risco da ingestão de chocolate em cães por peso, tipo e quantidade. Uso educacional; procure seu veterinário.",
    canonical: "https://www.smartkitnow.com/pets/dogs/dog-chocolate-toxicity-calculator",
    keywords: ["dog chocolate toxicity","theobromine calculator","mg/kg"],
  },

  jsonLd: {
    webpage: {
      "@type": "MedicalWebPage",
      "name": "Dog Chocolate Toxicity Calculator",
      "inLanguage": "en",
      "isPartOf": { "@type": "Website", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com/" },
      "dateModified": "2025-10-15",
      "mainEntity": { "@type": "WebApplication", "name": "Dog Chocolate Toxicity Calculator", "applicationCategory": "Calculator", "operatingSystem": "All" }
    },
    breadcrumbs: {
      items: [
        { name: "Pets", item: "https://www.smartkitnow.com/pets" },
        { name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
        { name: "Dog Chocolate Toxicity Calculator", item: "https://www.smartkitnow.com/pets/dogs/dog-chocolate-toxicity-calculator" }
      ]
    },
    faq: [
      { q: "Chocolate branco é seguro?", a: "Tem traços de metilxantinas e pode causar desconforto GI. Sempre fale com o veterinário." },
      { q: "Quando é emergência?", a: "Dose alta para o peso ou sinais neurológicos/cardiacos (tremores, convulsões, colapso) — emergência imediata." }
    ]
  }
};

export default function DogChocolateToxicityCalculator() {
  const TITLE = (cfg.seo?.title ?? cfg.title) as string;
  const DESC = (cfg.seo?.description ?? cfg.shortDescription) as string;
  const CANONICAL = cfg.seo?.canonical as string | undefined;

  const webpageJson = {
    "@context": "https://schema.org",
    ...(cfg.jsonLd?.webpage ?? {
      "@type": "WebPage",
      name: TITLE,
      url: CANONICAL,
      description: DESC,
    }),
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
      <SeoHead title={TITLE} description={DESC} canonical={CANONICAL} keywords={cfg.seo?.keywords as string[]} />

      <JsonLd data={webpageJson} />
      <JsonLd data={breadcrumbsJson} />
      {faqsJson && <JsonLd data={faqsJson} />}
      <PetCalcOmniTemplate config={cfg} />
    </>
  );
}