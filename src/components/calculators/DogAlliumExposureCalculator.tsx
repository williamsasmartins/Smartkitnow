// @ts-nocheck
import React, { useEffect } from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";
import EEATBanner from "@/components/EEATBanner";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// Educational equivalence factors relative to raw onion
const ALLIUM_PROFILES = {
  onion_raw: { label: "Raw onion", eqPerGram: 1.0 },
  onion_cooked: { label: "Cooked onion", eqPerGram: 0.8 },
  onion_powder: { label: "Onion powder", eqPerGram: 8.0 },
  garlic_raw: { label: "Raw garlic", eqPerGram: 1.5 },
  garlic_cooked: { label: "Cooked garlic", eqPerGram: 1.2 },
  garlic_powder: { label: "Garlic powder", eqPerGram: 10.0 },
  chives_raw: { label: "Raw chives", eqPerGram: 0.5 },
  leeks_raw: { label: "Raw leeks", eqPerGram: 0.7 },
} as const;

type AlliumKey = keyof typeof ALLIUM_PROFILES;

function classifyAlliumDose(dose_g_per_kg: number) {
  if (!Number.isFinite(dose_g_per_kg) || dose_g_per_kg <= 0) return { id: "low" };
  if (dose_g_per_kg < 5) return { id: "low" };
  if (dose_g_per_kg < 15) return { id: "caution" };
  if (dose_g_per_kg < 30) return { id: "concern" };
  return { id: "veryhigh" };
}

const cfg: PetCalcOmniConfig = {
  title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
  shortDescription:
    "Educational estimate of allium exposure risk in dogs using g/kg bands, with tables, FAQs, and sources. Always contact your veterinarian.",
  strongDisclaimer:
    "Any allium exposure is potentially problematic. Susceptibility varies; powders/dehydrated forms are more concentrated. Educational guidance only — consult a veterinarian.",
  showTopAd: true,
  showRightAd: false,

  reviewedByBlock: { text: "Reviewed by the Smart Kit Now team. Educational content; for clinical decisions, consult a veterinarian." },

  inputs: [
    { type: "number", key: "weight", label: "Dog weight", min: 0, step: 0.1, default: 10 },
    { type: "unit", key: "weightUnit", label: "Weight unit", options: ["kg", "lb"], default: "kg" },
    {
      type: "select",
      key: "form",
      label: "Food form",
      default: "onion_raw",
      options: Object.entries(ALLIUM_PROFILES).map(([value, v]) => ({ value, label: v.label })),
    },
    { type: "number", key: "grams", label: "Estimated grams ingested", min: 0, step: 1, default: 20 },
  ],

  compute: (s) => {
    const wkg = s.toKg(parseFloat(s.weight || "0"), s.weightUnit);
    const grams = parseFloat(s.grams || "0");
    const key: AlliumKey = (s.form || "onion_raw") as AlliumKey;
    const eq = ALLIUM_PROFILES[key]?.eqPerGram ?? 1.0;
    const dose_g_per_kg = wkg > 0 ? (grams * eq) / wkg : 0;
    const band = classifyAlliumDose(dose_g_per_kg);
    return {
      metrics: {
        grams_ingested: grams,
        equivalence_factor_form: eq,
        dose_g_per_kg,
      },
      riskKey: band.id,
    };
  },

  metricsDisplay: [
    { key: "dose_g_per_kg", label: "Dose (g/kg) — raw onion equivalent", format: (v) => `${Number.isFinite(v) ? v.toFixed(1) : "-"} g/kg` },
    { key: "grams_ingested", label: "Estimated grams ingested", format: (v) => `${Math.round(v)} g` },
    { key: "equivalence_factor_form", label: "Form equivalence vs. raw onion (×)", format: (v) => `${Number.isFinite(v) ? v.toFixed(1) : "-"}×` },
  ],

  riskBands: [
    { id: "low", label: "Low", tone: "bg-yellow-600", message: "< 5 g/kg: Often none; mild GI. Monitor; contact vet if signs appear." },
    { id: "caution", label: "Caution", tone: "bg-orange-600", message: "~5–15 g/kg: Lethargy, vomiting, diarrhea. Consult veterinarian for monitoring." },
    { id: "concern", label: "Concern", tone: "bg-red-700", message: "~15–30 g/kg: Pale gums, tachycardia, weakness. Veterinary assessment recommended." },
    { id: "veryhigh", label: "Very High", tone: "bg-red-800", message: "> 30 g/kg: Probable hemolysis/systemic signs. Emergency — immediate care." },
  ],

  howItWorks: {
    intro:
      "Allium vegetables (onion, garlic, chives, leeks) can cause oxidative damage to red blood cells in dogs, leading to hemolytic anemia. Powders/dehydrated forms are more concentrated. This tool converts the intake into ‘raw onion equivalent grams per kg’ for educational triage.",
    formula: "dose_g_per_kg = (grams_ingested × equivalence_factor_form) ÷ weight_kg",
    variables: [
      "equivalence_factor_form — educational equivalence relative to raw onion",
      "grams_ingested — estimated amount ingested",
      "weight_kg — dog body weight in kilograms",
    ],
  },

  tables: [
    {
      title: "Equivalence factors (educational) relative to raw onion",
      headers: ["Food form", "Equivalence vs. raw onion (×)"],
      rows: Object.entries(ALLIUM_PROFILES).map(([k, v]) => [v.label, v.eqPerGram]),
      notes: ["Educational values; brands and preparations vary.", "Powders are typically much more concentrated."],
    },
    {
      title: "Illustrative examples — dose (g/kg) for 20 g ingestion",
      headers: ["Form", "Dog 5 kg", "Dog 10 kg", "Dog 20 kg"],
      rows: (() => {
        const grams = 20;
        const dose = (eq: number, w: number) => ((grams * eq) / w).toFixed(1);
        return Object.entries(ALLIUM_PROFILES).map(([k, v]) => [v.label, dose(v.eqPerGram, 5), dose(v.eqPerGram, 10), dose(v.eqPerGram, 20)]);
      })(),
      notes: ["Use your dog’s actual weight and intake for better estimates."],
    },
    {
      title: "Possible signs & when to act (varies by individual)",
      headers: ["Band (g/kg)", "Possible signs", "Action"],
      rows: [
        ["< 5 (Low)", "Often none; mild GI", "Monitor; contact vet if signs appear"],
        ["~5–15 (Caution)", "Lethargy, vomiting, diarrhea", "Consult veterinarian for monitoring"],
        ["~15–30 (Concern)", "Pale gums, tachycardia, weakness", "Veterinary assessment recommended"],
        ["> 30 (Very High)", "Probable hemolysis/systemic signs", "Emergency — immediate care"],
      ],
      notes: ["Clinical signs can appear 1–3 days later; early evaluation helps."],
    },
  ],

  faqs: [
    {
      question: "Is a tiny onion piece always dangerous?",
      answer:
        "Any allium exposure is potentially problematic. Small amounts may not cause signs, but susceptibility varies and powders are concentrated. Speak with your veterinarian.",
    },
    {
      question: "What info should I bring to the clinic?",
      answer:
        "Your dog’s weight, food form (raw/cooked/powder), estimated amount, time since ingestion, and any signs (vomiting, lethargy, pale gums).",
    },
    { question: "Should I induce vomiting at home?", answer: "Do not induce vomiting unless instructed by a veterinarian." },
    { question: "Are cats more sensitive?", answer: "Yes. Cats are generally more susceptible to allium toxicosis. This calculator is for dogs." },
  ],

  sources: [
    { label: "Merck Veterinary Manual — Allium toxicosis (dogs)", href: "`https://www.merckvetmanual.com/`" },
    { label: "DVM360 — Allium toxicity overview", href: "`https://www.dvm360.com/`" },
  ],

  relatedLinks: [
    { label: "Dog Xylitol Exposure Risk", href: "/pets/dogs/dog-xylitol-exposure-risk" },
    { label: "Dog Chocolate Toxicity Calculator", href: "/pets/dogs/dog-chocolate-toxicity-calculator" },
    { label: "Dog Water Intake — Daily Hydration", href: "/pets/dogs/dog-water-intake" },
  ],
};

export default function DogAlliumExposureCalculator() {
  useEffect(() => {
    document.title = "Dog Onion/Garlic (Allium) Exposure Risk Calculator | Smart Kit Now";
  }, []);

  const canonical = "https://www.smartkitnow.com/pets/dogs/dog-onion-garlic-exposure-risk";
  const faqLd = useFaqJsonLd(cfg.faqs);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", position: 3, name: "Dog Onion/Garlic Exposure Risk", item: canonical },
    ],
  };

  return (
    <>
      <SeoHead
        title="Dog Onion/Garlic (Allium) Exposure Risk Calculator"
        description="Educational estimate of allium exposure risk in dogs using g/kg bands, with tables, FAQs, and sources. Always contact your veterinarian."
        canonical={canonical}
        og={{ type: "article", url: canonical }}
        twitter={{ card: "summary_large_image" }}
      />

      {/* E-E-A-T banner (site team reviewed + seek professional help) */}
      <div className="pl-4 md:pl-8 pr-2 md:pr-4">
        <EEATBanner niche="pets" />
      </div>

      <PetCalcOmniTemplate config={cfg} />

      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </>
  );
}

