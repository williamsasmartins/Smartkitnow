import React, { useEffect } from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const RER = (kg: number) => 70 * Math.pow(kg, 0.75);

const cfg: PetCalcOmniConfig = {
  title: "Dog Weight Loss Planner",
  shortDescription:
    "Plan an educational daily calorie target using 0.8×RER (target) or 70% of current maintenance (MER). Includes example tables, FAQs, and sources.",
  strongDisclaimer:
    "Educational guidance only — use under veterinary supervision. Monitor body condition score (BCS), satiety, and rate of loss.",
  showTopAd: true,
  showRightAd: false,

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  howToUse: [
    "Enter current and target weights, and choose the weight unit (kg or lb).",
    "Pick a maintenance factor (MER multiplier) that best matches your dog's life stage/activity.",
    "Set a weekly loss goal (% of current body weight).",
    "Compare the two intake methods (0.8×RER target vs. 70% of current MER) and discuss with your veterinarian.",
  ],

  inputs: [
    { type: "number", key: "currentWeight", label: "Current weight", min: 0, step: 0.1, default: 20 },
    { type: "number", key: "targetWeight", label: "Target weight", min: 0, step: 0.1, default: 18 },
    { type: "unit", key: "weightUnit", label: "Weight unit", options: ["kg", "lb"], default: "kg" },
    {
      type: "select",
      key: "factor",
      label: "Maintenance multiplier (factor)",
      default: "1.2",
      options: [
        { value: "1.2", label: "Neutered adult (~1.2×RER)" },
        { value: "1.4", label: "Intact adult (~1.4×RER)" },
        { value: "1.6", label: "Active (~1.6×RER)" },
      ],
    },
    { type: "number", key: "weeklyPct", label: "Weekly loss goal (%)", min: 0, step: 0.1, default: 1.5 },
  ],

  compute: (s) => {
    const cwRaw = parseFloat(s.currentWeight || "0");
    const twRaw = parseFloat(s.targetWeight || "0");
    const currentKg = s.toKg(cwRaw, s.weightUnit);
    const targetKg = s.toKg(twRaw, s.weightUnit);

    const rerCurrent = RER(currentKg);
    const factor = parseFloat(s.factor || "1.2");
    const merCurrent = rerCurrent * factor;

    const intakeA = 0.8 * RER(targetKg);
    const intakeB = 0.7 * merCurrent;

    const weeklyPct = Math.max(0, parseFloat(s.weeklyPct || "0")) / 100;
    const weeks = weeklyPct > 0 && currentKg > targetKg ? (currentKg - targetKg) / (currentKg * weeklyPct) : NaN;

    return { metrics: { rerCurrent, merCurrent, intakeA, intakeB, weeks } };
  },

  metricsDisplay: [
    { key: "rerCurrent", label: "RER (current kg)", format: (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString() : "-") },
    { key: "merCurrent", label: "MER (current)", format: (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString() : "-") },
    { key: "intakeA", label: "Intake A: 0.8×RER(target)", format: (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString() : "-") },
    { key: "intakeB", label: "Intake B: 70% of MER(current)", format: (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString() : "-") },
    { key: "weeks", label: "Estimated weeks to goal", format: (v) => (Number.isFinite(v) ? v.toFixed(1) : "-") },
  ],

  cta: { label: "Discuss this weight plan with your veterinarian" },

  howItWorks: {
    intro:
      "This planner uses two common educational approaches: (A) feeding ~80% of the Resting Energy Requirement (RER) for the target weight, or (B) feeding ~70% of the dog’s current maintenance calories (MER). We also estimate weeks to goal with a simple linear approximation.",
    formula:
      "RER(kg) = 70 × (kg^0.75)\n" +
      "MER(current) = factor × RER(current_kg)\n" +
      "Intake_A = 0.8 × RER(target_kg)\n" +
      "Intake_B = 0.7 × MER(current)\n" +
      "Weeks ≈ (current_kg − target_kg) ÷ (current_kg × weekly_pct_loss)",
    variables: [
      "factor — maintenance multiplier (e.g., neutered adult ~1.2×RER; intact adult ~1.4; active ~1.6).",
      "weekly_pct_loss — chosen weekly loss goal as % of current body weight.",
    ],
  },

  tables: [
    {
      title: "Example daily calories by weight (RER and 0.8×RER)",
      headers: ["Weight (kg)", "RER (kcal/day)", "0.8 × RER (kcal/day)"],
      rows: [5, 10, 15, 20, 25, 30].map((w) => {
        const r = RER(w);
        return [w, Math.round(r), Math.round(0.8 * r)];
      }),
      notes: [
        "Feeding amounts must be individualized. Work with your veterinarian to monitor body condition, satiety, and rate of loss.",
      ],
    },
    {
      title: "Illustrative: 70% of maintenance vs. 0.8 × RER(target)",
      headers: ["Current (kg)", "Target (kg)", "MER (1.2×RER)", "70% MER", "0.8×RER(target)"],
      rows: [
        [20, 18],
        [30, 25],
        [10, 8],
      ].map(([c, t]) => {
        const rerC = RER(c);
        const merC = 1.2 * rerC;
        const sev = 0.7 * merC;
        const eight = 0.8 * RER(t);
        return [c, t, Math.round(merC), Math.round(sev), Math.round(eight)];
      }),
      notes: ["Numbers are educational examples; choose the approach your veterinarian prefers."],
    },
    {
      title: "Food label helper (owner math)",
      headers: ["Label info", "Example", "How to use"],
      rows: [
        ["Energy density", "350 kcal/cup", "Daily cups ≈ target kcal ÷ kcal per cup"],
        ["Can weight & kcal/can", "370 g — 400 kcal/can", "Daily cans ≈ target kcal ÷ kcal per can"],
        ["Mixed feeding", "Dry + wet", "Split the target kcal across both; track treats!"],
      ],
      notes: ["Count all treats and extras. Ask your vet about diet selection and satiety strategies."],
    },
  ],

  faqs: [
    { question: "What weekly loss rate is considered safe?", answer: "Many veterinary sources suggest ~1–2% of current body weight per week. Your veterinarian may adjust based on age, breed, and medical history." },
    { question: "Which intake method should I use?", answer: "Feeding ~0.8 × RER for the target weight and feeding ~70% of current maintenance are both seen in practice. Your veterinarian will choose and refine a method based on monitoring." },
    { question: "What if my dog is very hungry?", answer: "Talk to your veterinarian. They may modify calories, adjust diet composition (protein/fiber), or recommend satiety strategies." },
    { question: "How often should I weigh-in?", answer: "Weekly or every 2 weeks is common. Track body condition score (BCS) and discuss progress with your vet." },
  ],

  sources: [
    { label: "WSAVA Global Nutrition Toolkit (RER/MER concepts)", href: "https://wsava.org/global-guidelines/" },
    { label: "General veterinary weight management guidance", href: "https://www.merckvetmanual.com/" },
  ],
};

export default function DogWeightLossPlanner() {
  useEffect(() => {
    document.title = "Dog Weight Loss Planner | Smart Kit Now";
  }, []);

  const canonical = "https://www.smartkitnow.com/pets/pet-care-calculators/dog-weight-loss-planner";
  const faqLd = useFaqJsonLd(cfg.faqs);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Pet Care Tools", item: "https://www.smartkitnow.com/pets/pet-care-calculators" },
      { "@type": "ListItem", position: 3, name: "Dog Weight Loss Planner", item: canonical },
    ],
  } as const;

  return (
    <>
      <SeoHead
        title="Dog Weight Loss Planner | Smart Kit Now"
        description="Plan an educational daily calorie target using 0.8×RER (target) or 70% of current maintenance, with example tables, FAQs, and sources."
        canonical={canonical}
      />



      <PetCalcOmniTemplate config={cfg} />

      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </>
  );
}