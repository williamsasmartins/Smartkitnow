import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";


const cfg: PetCalcOmniConfig = {
  title: "Dog Grape / Raisin Exposure — Risk Guide",
  shortDescription: "Grapes and raisins may cause acute kidney injury in dogs. Any ingestion is unsafe — treat as an emergency. Use this guide for education only.",
  strongDisclaimer: "Não há dose segura conhecida. Exposição deve ser tratada como emergência veterinária.",
  updatedAt: "2025-10-15",
  showTopAd: true,

  inputs: [
    { type: "number", key: "weight", label: "Dog Weight", min: 0, step: 0.1, default: 10 },
    { type: "unit",   key: "weightUnit", label: "Weight Unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "amount", label: "Estimated amount (grapes/raisins)", min: 0, step: 1, default: 5 },
    { type: "select", key: "form", label: "Form", default: "grapes",
      options: [{ value: "grapes", label: "Grapes" }, { value: "raisins", label: "Raisins" }] },
  ],

  compute: () => ({ metrics: {}, riskKey: "veryhigh" }),
  metricsDisplay: [],
  riskBands: [
    { id: "veryhigh", label: "Emergency", tone: "bg-red-700", message: "Any ingestion is unsafe. Contact an emergency veterinarian immediately." },
  ],
  cta: { label: "Go to an emergency veterinary clinic now." },

  howToUse: [
    "Informe peso, forma (uva/uva-passa) e quantidade aproximada.",
    "Procure atendimento veterinário IMEDIATAMENTE — não existe dose segura conhecida.",
    "Leve a embalagem/variedade se souber; anote horário da ingestão.",
  ],

  howItWorks: {
    intro: "O mecanismo de toxicidade ainda não é totalmente compreendido. Casos podem evoluir para lesão renal aguda. Por isso, orienta-se conduta de emergência para qualquer ingestão.",
    formula: "Sem fórmula de ‘dose segura’. A orientação é triagem clínica imediata.",
  },

  tables: [
    {
      title: "Fluxo de triagem (educacional)",
      headers: ["Situação", "Ação"],
      rows: [
        ["Ingestão < 2h", "Ligue para clínica de emergência. Pode haver orientação para descontaminação."],
        ["Ingestão 2–6h", "Avaliação veterinária urgente; exames e fluidoterapia conforme orientação."],
        ["Ingestão > 6h", "Avaliação clínica e testes renais; observar diurese e sinais sistêmicos."],
      ],
      notes: ["Fluxo apenas educativo — decisões cabem ao veterinário."],
    },
  ],

  faqs: [
    { question: "Uma única uva pode fazer mal?", answer: "Sim. Há relatos de toxicidade com quantidades pequenas. Trate qualquer ingestão como emergência." },
    { question: "Uva-passa é pior que uva?", answer: "Uva-passa é desidratada e concentra substâncias; exposição é tão ou mais preocupante." },
  ],

  relatedLinks: [
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dog-chocolate-toxicity-calculator" },
    { label: "Dog Water Intake Calculator", href: "/pets/dog-water-intake" },
  ],

  sources: [
    { label: "Merck Veterinary Manual — Grape/Raisin toxicosis", href: "https://www.merckvetmanual.com/" },
  ],

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  seo: {
    title: "Dog Grape/Raisin Exposure — Risk Guide | Smart Kit Now",
    description: "Qualquer ingestão de uva ou uva-passa em cães é potencialmente perigosa. Eduque-se e procure um veterinário imediatamente.",
    canonical: "https://www.smartkitnow.com/pets/dogs/dog-grape-raisin-exposure-risk",
    keywords: ["dog grapes","dog raisins","grape toxicity dog"],
  },

  jsonLd: {
    webpage: {
      "@type": "MedicalWebPage",
      "name": "Dog Grape / Raisin Exposure — Risk Guide",
      "inLanguage": "en",
      "isPartOf": { "@type": "Website", "name": "Smart Kit Now", "url": "https://www.smartkitnow.com/" },
      "dateModified": "2025-10-15"
    },
    breadcrumbs: {
      items: [
        { name: "Pets", item: "https://www.smartkitnow.com/pets" },
        { name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
        { name: "Dog Grape/Raisin Exposure", item: "https://www.smartkitnow.com/pets/dogs/dog-grape-raisin-exposure-risk" }
      ]
    },
    faq: [
      { q: "Uma única uva pode fazer mal?", a: "Sim. Há relatos de toxicidade com quantidades pequenas. Trate qualquer ingestão como emergência." },
      { q: "Uva-passa é pior que uva?", a: "Uva-passa é desidratada e concentra substâncias; exposição é tão ou mais preocupante." }
    ]
  }
};

export default function DogGrapeRaisinExposureRiskCalculator() {
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
      <SeoHead title={TITLE} description={DESC} canonical={CANONICAL} keywords={cfg.seo?.keywords as string[]} />
      <JsonLd data={webpageJson} />
      <JsonLd data={breadcrumbsJson} />
      {faqsJson && <JsonLd data={faqsJson} />}
      <PetCalcOmniTemplate config={cfg} />
    </>
  );
}