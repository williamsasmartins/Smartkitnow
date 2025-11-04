import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";


const cfg: PetCalcOmniConfig = {
  title: "Dog Water Intake Calculator",
  shortDescription: "Check typical daily water intake by weight and context. Educational guidance — always consult your veterinarian for medical concerns.",
  strongDisclaimer: "Valores são faixas de referência. Condições clínicas exigem avaliação veterinária.",
  updatedAt: "2025-10-15",
  showTopAd: true,

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 20 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "select", key: "diet", label: "Diet type", default: "dry",
      options: [{ value: "dry", label: "Dry kibble" }, { value: "wet", label: "Wet food" }, { value: "mixed", label: "Mixed" }] },
    { type: "select", key: "heat", label: "Ambient", default: "normal",
      options: [{ value: "normal", label: "Normal" }, { value: "hot", label: "Hot" }, { value: "exercise", label: "Exercise day" }] },
  ],

  compute: (s) => {
    const rawW = parseFloat(s.weight || "0");
    const kg = s.weightUnit === "lb" ? rawW * 0.45359237 : rawW;
    // base 50–60 mL/kg/d — usaremos ponto médio 55 mL/kg e fatores simples
    const base = kg * 55;
    const dietF = s.diet === "wet" ? 0.85 : s.diet === "mixed" ? 1.0 : 1.15;
    const envF  = s.heat === "hot" ? 1.15 : s.heat === "exercise" ? 1.25 : 1.0;
    const est = base * dietF * envF; // mL/d
    return { metrics: { waterMlDay: est, rangeMin: kg * 50, rangeMax: kg * 60 } };
  },

  metricsDisplay: [
    { key: "waterMlDay", label: "Estimated intake (mL/day)", format: v => `${Math.round(v)} mL` },
    { key: "rangeMin",   label: "Typical lower bound", format: v => `${Math.round(v)} mL` },
    { key: "rangeMax",   label: "Typical upper bound", format: v => `${Math.round(v)} mL` },
  ],

  howToUse: [
    "Informe o peso do cão e o tipo de dieta.",
    "Ajuste o contexto (calor/exercício) para ver a estimativa.",
    "Compare com a faixa típica (50–60 mL/kg/dia) e observe sinais clínicos.",
  ],

  howItWorks: {
    intro: "A regra prática de hidratação canina gira em torno de 50–60 mL/kg/dia, variando por dieta (alimentos úmidos fornecem água) e ambiente/atividade.",
    formula: "estimativa_mL_dia ≈ peso_kg × 55 × fator_dieta × fator_ambiente",
    variables: ["peso_kg — peso corporal em quilogramas", "fatores — ajustes simples para dieta e contexto térmico/atividade"],
  },

  tables: [
    {
      title: "Faixas típicas (exemplo)",
      headers: ["Peso (kg)", "Faixa típica (mL/dia)"],
      rows: [[5, "250–300"], [10, "500–600"], [20, "1.000–1.200"], [30, "1.500–1.800"]],
      notes: ["A ingestão real varia. Sempre considere sinais clínicos e orientação profissional."],
    },
    {
      title: "Sinais de atenção (educacional)",
      headers: ["Sinal", "Possível significado"],
      rows: [
        ["Beber demais (polidipsia)", "Pode indicar doenças hormonais, renais, hepáticas etc."],
        ["Beber de menos", "Risco de desidratação, especialmente com calor/exercício."],
      ],
    },
  ],

  faqs: [
    { question: "Meu cão bebe ‘demais’. É normal?", answer: "Se excede muito a faixa típica, fale com o veterinário. Polidipsia pode acompanhar condições clínicas." },
    { question: "Ração úmida reduz a água de beber?", answer: "Freqüentemente sim, pois já fornece água; mesmo assim o cão deve ter acesso irrestrito a água limpa." },
  ],

  relatedLinks: [
    { label: "Dog Calorie Needs (RER/MER)", href: "/pets/dog-calorie-needs-rer-mer" },
    { label: "Dog Chocolate Toxicity", href: "/pets/dog-chocolate-toxicity-calculator" },
  ],

  sources: [
    { label: "Diretrizes gerais de hidratação veterinária", href: " `https://www.merckvetmanual.com/` " },
  ],

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  seo: {
    title: "Dog Water Intake Calculator | Smart Kit Now",
    description: "Estimativa simples de ingestão diária de água por peso, dieta e contexto. Conteúdo educacional.",
    canonical: "https://www.smartkitnow.com/pets/dogs/dog-water-intake",
    keywords: ["dog water intake","mL per kg per day dog"],
  },

  jsonLd: {
    webpage: {
      "@type": "WebPage",
      "name": "Dog Water Intake Calculator",
      "inLanguage": "en",
      "dateModified": "2025-10-15"
    },
    breadcrumbs: {
      items: [
        { name: "Pets", item: "https://www.smartkitnow.com/pets" },
        { name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
        { name: "Dog Water Intake", item: "https://www.smartkitnow.com/pets/dogs/dog-water-intake" }
      ]
    },
    faq: [
      { q: "Meu cão bebe ‘demais’. É normal?", a: "Se excede muito a faixa típica, fale com o veterinário. Polidipsia pode acompanhar condições clínicas." },
      { q: "Ração úmida reduz a água de beber?", a: "Sim, pois fornece água; o cão deve ter livre acesso a água limpa." }
    ]
  }
};

export default function DogWaterIntakeCalculator() {
  const TITLE = (cfg.seo?.title ?? cfg.title).replace(" | Smart Kit Now", "");
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