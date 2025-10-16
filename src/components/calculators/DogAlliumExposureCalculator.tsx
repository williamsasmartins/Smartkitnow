import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";
import EEATBanner from "@/components/EEATBanner";

// Convers�es aproximadas: mg/kg/densidades simples para estimar "gramas equivalentes de cebola crua"
const ALLIUM_PROFILES = {
  onion_raw:     { label: "Onion (raw)",            eqPerGram: 1.0 },   // 1 g = 1 g eq. cebola crua
  onion_cooked:  { label: "Onion (cooked/sauteed)", eqPerGram: 0.8 },   // cozimento reduz �gua/compostos
  onion_powder:  { label: "Onion powder",           eqPerGram: 10.0 },  // p� � concentrado (~10x)
  garlic_raw:    { label: "Garlic (raw)",           eqPerGram: 3.0 },   // alho tende a ser + potente
  garlic_powder: { label: "Garlic powder",          eqPerGram: 15.0 },  // muito concentrado
  leek_chive:    { label: "Leek/Chives",            eqPerGram: 0.7 },   // menos comum, refer�ncia branda
} as const;

type Kind = keyof typeof ALLIUM_PROFILES;

function classify(dose_g_per_kg: number) {
  // Faixas educativas baseadas em literatura cl�nica:
  // ~5 g/kg (gatilhos relatados com alho em gatos; c�es mais resistentes, mas usamos margem)  "caution"
  // 1530 g/kg cebola crua associados a anemia hemol�tica em c�es  "concern" / "high"
  // >30 g/kg  "very high"
  if (dose_g_per_kg < 5)
    return {
      id: "low",
      label: "Low",
      tone: "bg-emerald-600",
      message: "Low indicative; monitor. Contact your veterinarian if signs develop.",
    };
  if (dose_g_per_kg < 15)
    return {
      id: "caution",
      label: "Caution",
      tone: "bg-yellow-600",
      message: "Caution. Consult your veterinarian for guidance and monitoring.",
    };
  if (dose_g_per_kg < 30)
    return {
      id: "concern",
      label: "Concern",
      tone: "bg-orange-600",
      message: "Potential clinical risk. Seek veterinary evaluation promptly.",
    };
  return {
    id: "veryhigh",
    label: "Very High",
    tone: "bg-red-700",
    message: "Likely emergency. Seek immediate veterinary care.",
  };
}

const cfg: PetCalcOmniConfig = {
  title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
  shortDescription:
    "Estimate educational risk from onion/garlic exposure by dog weight, food form, and amount. For educational use  always seek veterinary guidance.",
  strongDisclaimer:
    "Educational tool. Not a substitute for veterinary evaluation. Individual susceptibility varies; powders/dehydrated forms are more concentrated. If ingestion is suspected, contact a veterinarian.",
  reviewedByBlock: { text: "Reviewed by the Smart Kit Now team. Educational content; for clinical decisions, consult a veterinarian." },
  showTopAd: true,
  showRightAd: false,

  // Inputs
  inputs: [
    { type: "number", key: "weight", label: "Dog weight", min: 0, step: 0.1, default: 10 },
    { type: "unit",   key: "weightUnit", label: "Weight unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "amount", label: "Estimated amount ingested", min: 0, step: 1, default: 20 },
    { type: "unit",   key: "amountUnit", label: "Amount unit", options: ["g","oz"], default: "g" },
    { type: "select", key: "type", label: "Food form (Allium)", default: "onion_raw",
      options: Object.entries(ALLIUM_PROFILES).map(([value,v])=>({ value, label: v.label })) },
  ],

  // C�lculo
  compute: (s) => {
    const toKg = s.toKg, toGrams = s.toGrams;
    const wkg = toKg(parseFloat(s.weight || "0"), s.weightUnit);
    const grams = toGrams(parseFloat(s.amount || "0"), s.amountUnit);
    const kind: Kind = (s.type || "onion_raw") as Kind;
    const profile = ALLIUM_PROFILES[kind];

    // Converte tudo para "gramas equivalentes de cebola crua"
    const eqOnionGrams = grams * profile.eqPerGram;

    // Dose g/kg (educativa)
    const dose_g_per_kg = wkg > 0 ? (eqOnionGrams / wkg) : 0;

    // Banda de risco (educativa, N�O � diagn�stico)
    const band = classify(dose_g_per_kg);

    return {
      metrics: {
        eqOnionGrams,
        dose_g_per_kg,
      },
      riskKey: band.id,
    };
  },

  metricsDisplay: [
    { key: "eqOnionGrams",  label: "Equivalent raw onion (g)", format: v => `${Math.round(v)} g` },
    { key: "dose_g_per_kg", label: "Dose (g/kg)  educational", format: v => `${(v ?? 0).toFixed(1)} g/kg` },
    { key: "eqOnionGrams",  label: "Rule-of-thumb ranges", format: () => "Caution ~5 g/kg; Concern ~1530 g/kg; Very high > 30 g/kg" },
  ],

  riskBands: [
    { id: "low",      label: "Low",      tone: "bg-emerald-600", message: "Low indicative; monitor. Contact a veterinarian if signs appear (vomiting, weakness, pale gums)." },
    { id: "caution",  label: "Caution",  tone: "bg-yellow-600",  message: "Caution. Speak with your veterinarian for guidance and possible testing." },
    { id: "concern",  label: "Concern",  tone: "bg-orange-600",  message: "Potential clinical risk. Veterinary evaluation recommended." },
    { id: "veryhigh", label: "Very High",tone: "bg-red-700",     message: "Likely emergency. Seek immediate veterinary care." },
  ],

  cta: { label: "Seek veterinary guidance now." },

  // Editorial (estilo Omni, rico em SEO)
  howToUse: [
    "Enter the dog's weight and unit (kg or lb).",
    "Select the food form (onion/garlic  raw, cooked, powder, etc.).",
    "Enter the estimated amount ingested to compute g/kg equivalent raw onion.",
    "Use the risk band only for educational triage. Consult a veterinarian.",
  ],

  howItWorks: {
    intro:
      "Allium vegetables (onion, garlic, chives, leek) can cause oxidative damage to red blood cells, leading to hemolytic anemia. Powders/dehydrated forms are more concentrated. This tool converts estimated ingestion into 'equivalent grams of raw onion' per kg of body weight for educational triage.",
    formula:
      "dose_g_per_kg = (grams_ingested � equivalence_factor_form) � weight_kg",
    variables: [
      "equivalence_factor_form: equivalence factor to approximate potency vs. raw onion",
      "grams_ingested: estimated quantity ingested",
      "weight_kg: dog weight in kilograms",
    ],
  },

  tables: [
    {
      title: "Equivalence factors (educational) relative to raw onion",
      headers: ["Food form", "Equivalence vs. raw onion (�)"],
      rows: Object.entries(ALLIUM_PROFILES).map(([k,v]) => [v.label, v.eqPerGram]),
      notes: [
        "Educational values for triage; brands and preparation vary.",
        "Powders (onion/garlic) are typically much more concentrated.",
      ],
    },
    {
      title: "Illustrative examples  dose (g/kg) for 20 g ingestion",
      headers: ["Form", "Dog 5 kg", "Dog 10 kg", "Dog 20 kg"],
      rows: (() => {
        const grams = 20;
        const dose = (eq: number, w: number) => ((grams*eq)/w).toFixed(1);
        return Object.entries(ALLIUM_PROFILES).map(([k,v]) => [
          v.label,
          dose(v.eqPerGram, 5),
          dose(v.eqPerGram, 10),
          dose(v.eqPerGram, 20),
        ]);
      })(),
      notes: ["Use your dog's actual weight and amount for more accurate estimates."],
    },
    {
      title: "Possible signs & when to act (varies by individual)",
      headers: ["Band (g/kg)", "Possible signs", "Action"],
      rows: [
        ["< 5 (Low)", "Possible absence of signs; mild GI", "Monitor; contact vet if signs develop"],
        ["~515 (Caution)", "Mild lethargy, vomiting, diarrhea", "Contact vet for guidance and monitoring"],
        ["~1530 (Concern)", "Pale gums, tachycardia, weakness", "Veterinary evaluation recommended"],
        ["> 30 (Very High)", "Likely hemolytic anemia, systemic signs", "Emergency  seek immediate veterinary care"],
      ],
      notes: ["Signs may take 13 days to appear; early exam helps."],
    },
  ],

  faqs: [
    { question: "Is a small piece of onion always dangerous?", answer: "Any Allium ingestion is potentially problematic. Small amounts may not cause signs, but susceptibility varies and powders are more concentrated. Consult your veterinarian." },
    { question: "What should I bring to the veterinarian?", answer: "Dog's weight, food form (raw/cooked/powder), approximate amount, time since ingestion, and any signs (vomiting, lethargy, pale gums)." },
    { question: "Can I induce vomiting at home?", answer: "Do not induce vomiting without veterinary guidance. A professional will weigh risks and benefits." },
    { question: "Are cats more sensitive?", answer: "Yes, cats tend to be more susceptible to Allium toxicosis; this calculator is specific to dogs." },
  ],

  sources: [
    { label: "Merck Veterinary Manual  Onion & Garlic Toxicity (Dogs)", href: "https://www.merckvetmanual.com/" },
    { label: "DVM360  Allium toxicosis overview", href: "https://www.dvm360.com/" }
  ],

  seo: {
    title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator | Smart Kit Now",
    description: "Educational estimate of risk from onion/garlic exposure in dogs, with dose bands (g/kg), tables, FAQs, and sources.",
    canonical: "https://www.smartkitnow.com/pets/dogs/dog-onion-garlic-exposure-risk",
  },
  jsonLd: {
    webpage: {
      "@type": "WebPage",
      name: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
      description: "Educational estimate of risk from onion/garlic exposure in dogs, with dose bands (g/kg), tables, FAQs, and sources.",
      url: "https://www.smartkitnow.com/pets/dogs/dog-onion-garlic-exposure-risk",
    },
    breadcrumbs: {
      items: [
        { name: "Pets", item: "https://www.smartkitnow.com/pets" },
        { name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
        { name: "Dog Onion/Garlic Exposure Risk", item: "https://www.smartkitnow.com/pets/dogs/dog-onion-garlic-exposure-risk" },
      ],
    },
    faq: [
      { q: "Is a small piece of onion always dangerous?", a: "Any Allium ingestion is potentially problematic. Small amounts may not cause signs, but susceptibility varies and powders are more concentrated. Consult your veterinarian." },
      { q: "What should I bring to the veterinarian?", a: "Dog's weight, food form (raw/cooked/powder), approximate amount, time since ingestion, and any signs (vomiting, lethargy, pale gums)." },
      { q: "Can I induce vomiting at home?", a: "Do not induce vomiting without veterinary guidance. A professional will weigh risks and benefits." },
      { q: "Are cats more sensitive?", a: "Yes, cats tend to be more susceptible to Allium toxicosis; this calculator is specific to dogs." },
    ],
  },
};

export default function DogAlliumExposureCalculator() {
  const meta = {
    title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
    description:
      "Estimate educational risk for onion/garlic exposure in dogs (g/kg bands), with tables, FAQs, and veterinary references. Always contact a veterinarian.",
    canonical: "https://www.smartkitnow.com/pets/dogs/dog-onion-garlic-exposure-risk",
    ogImage: undefined,
  };

  const jsonLd = cfg.jsonLd;
  const webpageJson = jsonLd?.webpage
    ? { "@context": "https://schema.org", ...jsonLd.webpage }
    : undefined;
  const breadcrumbsJson = jsonLd?.breadcrumbs?.items
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": jsonLd.breadcrumbs.items.map((b: any, idx: number) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.name,
          item: b.item,
        })),
      }
    : undefined;
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
      <SeoHead
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        ogImage={meta.ogImage}
      />

      <EEATBanner niche="pets" />

      <PetCalcOmniTemplate config={cfg} />

      {webpageJson && <JsonLd data={webpageJson} />}
      {breadcrumbsJson && <JsonLd data={breadcrumbsJson} />}
      {faqsJson && <JsonLd data={faqsJson} />}
    </>
  );
}

