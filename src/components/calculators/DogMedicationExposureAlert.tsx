import React from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";


type DrugKey = "ibuprofen" | "acetaminophen";

const DRUGS: Record<DrugKey, {
  label: string;
  defaults: number[];
  classify: (mgPerKg: number) => { id: string; label: string; tone: string; message: string };
}> = {
  ibuprofen: {
    label: "Ibuprofen (NSAID)",
    defaults: [200, 400, 600],
    classify: (d) => {
      if (d < 25)  return { id: "caution",  label: "Caution",       tone: "bg-yellow-600", message: "Possible GI risk; contact your veterinarian for guidance." };
      if (d < 50)  return { id: "risk",     label: "GI risk",       tone: "bg-orange-600", message: "Gastritis/ulcer risk. Veterinary guidance recommended." };
      if (d < 175) return { id: "high",     label: "Renal risk",    tone: "bg-red-600",    message: "Renal risk. Seek urgent veterinary assessment." };
      return { id: "veryhigh", label: "Very High", tone: "bg-red-700", message: "Neurologic/renal very high risk. Emergency  immediate care." };
    }
  },
  acetaminophen: {
    label: "Acetaminophen (Paracetamol)",
    defaults: [325, 500],
    classify: (d) => {
      if (d < 50)  return { id: "caution",  label: "Caution",       tone: "bg-yellow-600", message: "Variable risk; if ingestion suspected, contact your veterinarian." };
      if (d < 100) return { id: "risk",     label: "Hepatic risk",  tone: "bg-orange-600", message: "Hepatic injury risk. Veterinary guidance needed." };
      if (d < 200) return { id: "high",     label: "High",          tone: "bg-red-600",    message: "High risk of hepatic injury. Urgent veterinary care." };
      return { id: "veryhigh", label: "Very High", tone: "bg-red-700", message: "Risk of severe hepatic failure. Emergency  immediate care." };
    }
  }
};

const cfg: PetCalcOmniConfig = {
  title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
  shortDescription:
    "Educational mg/kg estimate for accidental ingestion of ibuprofen or acetaminophen in dogs. There is no safe dose  any exposure warrants immediate veterinary advice.",
  strongDisclaimer:
    "Educational tool only. Does not replace veterinary care. Thresholds vary by individual and formulation. If ingestion is suspected, contact a veterinarian immediately.",
  showTopAd: true,

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",
  showRightAd: false,

  inputs: [
    { type: "select", key: "drug", label: "Medication", default: "ibuprofen",
      options: [
        { value: "ibuprofen", label: DRUGS.ibuprofen.label },
        { value: "acetaminophen", label: DRUGS.acetaminophen.label },
      ]},
    { type: "number", key: "weight", label: "Dog weight", min: 0, step: 0.1, default: 10 },
    { type: "unit",   key: "weightUnit", label: "Weight unit", options: ["kg","lb"], default: "kg" },
    { type: "number", key: "strengthMg", label: "Tablet strength (mg each)", min: 0, step: 25, default: 200 },
    { type: "number", key: "count", label: "Quantity (tablets/capsules or parts)", min: 0, step: 0.25, default: 1 },
    { type: "number", key: "totalMg", label: "OR enter total ingested (mg)", min: 0, step: 10, default: 0 },
  ],

  compute: (s) => {
    const wkg = s.toKg(parseFloat(s.weight || "0"), s.weightUnit);
    const drug = (s.drug as DrugKey) || "ibuprofen";
    const strength = parseFloat(s.strengthMg || "0");
    const count = parseFloat(s.count || "0");
    const totalInput = parseFloat(s.totalMg || "0");

    const totalMg = totalInput > 0 ? totalInput : (isFinite(strength) && isFinite(count) ? strength * count : 0);
    const mgPerKg = wkg > 0 ? totalMg / wkg : 0;

    const band = DRUGS[drug].classify(mgPerKg);
    return { metrics: { totalMg, doseMgPerKg: mgPerKg }, riskKey: band.id };
  },

  metricsDisplay: [
    { key: "totalMg",    label: "Estimated dose (total mg)",  format: (v) => `${Math.round(v)} mg` },
    { key: "doseMgPerKg",label: "Dose (mg/kg)  educational", format: (v) => `${(v ?? 0).toFixed(1)} mg/kg` },
    { key: "doseMgPerKg",label: "Important note",             format: () => "There is NO safe dose. Contact a veterinarian for any suspected ingestion." },
  ],

  riskBands: [
    { id: "caution",  label: "Caution",   tone: "bg-yellow-600", message: "Caution. No safe dose; contact a veterinarian." },
    { id: "risk",     label: "Risk",      tone: "bg-orange-600", message: "Moderate risk (GI/hepatic). Seek veterinary guidance." },
    { id: "high",     label: "High",      tone: "bg-red-600",    message: "High risk (renal/hepatic). Urgent veterinary care." },
    { id: "veryhigh", label: "Very High", tone: "bg-red-700",    message: "Very high risk (CNS/hepatic). Emergency  go immediately." },
  ],

  cta: { label: "Contact your veterinarian now." },

  tables: [
    {
      title: "Common human strengths  reference only",
      headers: ["Medication", "Typical strengths (mg)"],
      rows: [
        [DRUGS.ibuprofen.label, DRUGS.ibuprofen.defaults.join(", ")],
        [DRUGS.acetaminophen.label, DRUGS.acetaminophen.defaults.join(", ")],
      ],
      notes: [
        "Formulations vary (infant drops, extended-release, etc.). Check the package.",
        "Never administer human medication without veterinary guidance.",
      ],
    },
    {
      title: "Educational bands (dogs)  approximate",
      headers: ["Medication", "Band", "Approx. mg/kg", "Clinical concern"],
      rows: [
        ["Ibuprofen", "GI", "~25", "Gastritis/ulcer risk"],
        ["Ibuprofen", "Renal", "~50175", "Increasing renal risk"],
        ["Ibuprofen", "CNS", "175400+", "Very high neurologic/renal risk"],
        ["Acetaminophen", "Caution", "<50", "Variable risk; monitor with vet"],
        ["Acetaminophen", "Hepatic", "~75100", "Probable hepatic injury"],
        ["Acetaminophen", "Severe", "200", "Very high risk; emergency"],
      ],
      notes: [
        "Educational bands; literature varies. Always treat as a potential emergency.",
        "Cats are extremely sensitive to acetaminophen (this tool is for dogs).",
      ],
    },
    {
      title: "What to do  immediate steps",
      headers: ["Scenario", "Action"],
      rows: [
        ["Recent ingestion (12 h) and stable patient", "Contact your veterinarian for guidance; do NOT induce vomiting unless instructed."],
        ["Neurologic signs, collapse, pale gums", "Emergency  go to a clinic immediately."],
        ["Unknown dose", "Bring the package, estimate strength/units; any suspicion warrants evaluation."],
      ],
    },
  ],

  faqs: [
    { question: "Can I give ibuprofen to my dog for pain?", answer: "No. Ibuprofen can cause gastric ulcers, kidney injury, and neurologic signs in dogs. Use only veterinarian-prescribed alternatives." },
    { question: "Is acetaminophen safe for dogs?", answer: "Not considered safe without veterinary guidance. It can cause liver injury  never administer on your own." },
    { question: "What should I bring to the clinic?", answer: "Your dog’s weight, medication name, strength (mg per unit), quantity ingested, and time since ingestion." },
    { question: "Should I induce vomiting?", answer: "Do not induce vomiting unless a veterinarian instructs you to do so." },
  ],

  sources: [
    { label: "Merck Veterinary Manual  NSAID/Acetaminophen toxicosis (dogs)", href: "https://www.merckvetmanual.com/" },
    { label: "FDA  Pets and Human Medicines", href: "https://www.fda.gov/" },
    { label: "Pet Poison Helpline  Ibuprofen & Acetaminophen", href: "https://www.petpoisonhelpline.com/" },
  ],
};

export default function DogMedicationExposureAlert() {
  const TITLE = "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)";
  const DESC = cfg.shortDescription as string;
  const CANONICAL = "https://www.smartkitnow.com/pets/dogs/dog-medication-exposure-alert";

  const webpageJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    url: CANONICAL,
    description: DESC,
  };
  const breadcrumbsJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Dogs", item: "https://www.smartkitnow.com/pets/dogs" },
      { "@type": "ListItem", position: 3, name: TITLE, item: CANONICAL },
    ],
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


      <PetCalcOmniTemplate config={cfg} />
      <JsonLd data={webpageJson} />
      <JsonLd data={breadcrumbsJson} />
      {faqsJson && <JsonLd data={faqsJson} />}
    </>
  );
}
