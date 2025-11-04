// src/components/calculators/CatWeightLossPlanner.tsx
import React, { useEffect } from "react";
import PetCalcOmniTemplate, { PetCalcOmniConfig } from "@/components/templates/PetCalcOmniTemplate";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

import useFaqJsonLd from "@/hooks/useFaqJsonLd";

/**
 * Cat Weight Loss Planner (educational)
 * - Common vet-informed patterns:
 *   A) Feed ≈ 0.8 × RER at target weight
 *   B) Feed ≈ 70% of current maintenance (MER = factor × RER(current))
 * - Typical weekly loss goal: ~0.5–1.0% of current body weight in cats.
 * - Always work with your veterinarian, especially for cats (hepatic lipidosis risk).
 */

const MER_FACTORS = [
  { value: 1.2, label: "Neutered adult (1.2×RER)" },
  { value: 1.4, label: "Intact adult (1.4×RER)" },
  { value: 1.6, label: "Active adult (1.6×RER)" },
];

type Method = "target_0_8_rer" | "seventy_percent_maint";

function RER(kg: number) {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return 70 * Math.pow(kg, 0.75);
}

function weeksToGoalLinear(currentKg: number, targetKg: number, weeklyPctLoss: number) {
  if (!Number.isFinite(currentKg) || !Number.isFinite(targetKg)) return 0;
  if (currentKg <= 0 || weeklyPctLoss <= 0) return 0;
  const delta = Math.max(currentKg - targetKg, 0);
  const perWeek = currentKg * (weeklyPctLoss / 100);
  if (perWeek <= 0) return 0;
  return Math.ceil(delta / perWeek);
}

const cfg: PetCalcOmniConfig = {
  title: "Cat Weight Loss Planner",
  shortDescription:
    "Plan an educational daily calorie target for safe feline weight loss using common veterinary approaches. Always consult your veterinarian.",
  strongDisclaimer:
    "Educational tool only — not a medical device. Cats should lose weight slowly (~0.5–1.0% of current body weight per week). Rapid restriction can be dangerous (hepatic lipidosis). Work with your veterinarian.",
  showTopAd: true,
  showRightAd: false,

  reviewedNote: "Content for general guidance only. For medical decisions, consult a licensed veterinarian.",

  // Inputs
  inputs: [
    { type: "number", key: "current", label: "Current weight", min: 0, step: 0.1, default: 6 },
    { type: "unit", key: "currentUnit", label: "Current weight unit", options: ["kg", "lb"], default: "kg" },

    { type: "number", key: "target", label: "Target weight", min: 0, step: 0.1, default: 5 },
    { type: "unit", key: "targetUnit", label: "Target weight unit", options: ["kg", "lb"], default: "kg" },

    {
      type: "select",
      key: "method",
      label: "Method",
      default: "target_0_8_rer",
      options: [
        { value: "target_0_8_rer", label: "Feed ≈ 0.8 × RER (target weight)" },
        { value: "seventy_percent_maint", label: "Feed ≈ 70% of current maintenance" },
      ],
    },

    {
      type: "select",
      key: "merFactor",
      label: "Current maintenance factor (MER)",
      default: String(MER_FACTORS[0].value),
      options: MER_FACTORS.map((f) => ({ value: String(f.value), label: f.label })),
    },

    {
      type: "select",
      key: "weeklyPctLoss",
      label: "Weekly loss goal (% of current BW)",
      default: "0.7",
      options: [
        { value: "0.5", label: "0.5%" },
        { value: "0.7", label: "0.7%" },
        { value: "1.0", label: "1.0%" },
      ],
    },
  ],

  // Compute — numeric metrics only
  compute: (s) => {
    const toKg = (v: number, u: "kg" | "lb") => (u === "lb" ? v * 0.45359237 : v);

    const currentKg = toKg(parseFloat(s.current || "0"), s.currentUnit);
    const targetKg = toKg(parseFloat(s.target || "0"), s.targetUnit);
    const merFactor = parseFloat(s.merFactor || "1.2");
    const weeklyPct = parseFloat(s.weeklyPctLoss || "0.7");
    const method: Method = (s.method || "target_0_8_rer") as Method;

    const rerCurrent = RER(currentKg);
    const rerTarget = RER(targetKg);
    const merCurrent = merFactor * rerCurrent;

    const intakeA = 0.8 * rerTarget; // 0.8 × RER(target)
    const intakeB = 0.7 * merCurrent; // 70% of current maintenance

    const recommended = method === "target_0_8_rer" ? intakeA : intakeB;

    const dailyDeficit = Math.max(merCurrent - recommended, 0);
    const pctDeficit = merCurrent > 0 ? (dailyDeficit / merCurrent) * 100 : 0;

    const weeks = weeksToGoalLinear(currentKg, targetKg, weeklyPct);

    return {
      metrics: {
        currentKg,
        targetKg,
        rerCurrent,
        rerTarget,
        merCurrent,
        intakeA,
        intakeB,
        recommended,
        dailyDeficit,
        pctDeficit,
        weeks,
      },
    };
  },

  metricsDisplay: [
    { key: "recommended", label: "Recommended daily calories", format: (v) => `${Math.round(v)} kcal/day` },
    { key: "dailyDeficit", label: "Estimated daily deficit", format: (v) => `${Math.round(v)} kcal/day` },
    { key: "weeks", label: "Estimated weeks to goal (educational)", format: (v) => `${Math.max(0, Math.round(v))} weeks` },
  ],

  cta: { label: "Discuss this plan with your veterinarian and monitor closely." },

  // Editorial content
  howToUse: [
    "Enter your cat’s current and target weight (kg or lb).",
    "Choose a method: ‘0.8 × RER (target weight)’ or ‘70% of current maintenance’.",
    "Select a weekly weight-loss goal (commonly ~0.5–1.0%).",
    "Review the target calories and the educational weeks-to-goal, then work with your veterinarian.",
  ],

  howItWorks: {
    intro:
      "Two educational approaches are commonly referenced for feline weight management: (A) feed about 80% of RER for the target weight, or (B) feed about 70% of the cat’s current maintenance energy. We also estimate weeks to the goal weight using a simple linear approximation.",
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
      rows: [3, 4, 5, 6, 7].map((w) => {
        const r = RER(w);
        return [w, Math.round(r), Math.round(0.8 * r)];
      }),
      notes: ["Cats require careful, gradual restriction. Abrupt, severe restriction is unsafe."],
    },
    {
      title: "Illustrative: 70% of maintenance vs. 0.8 × RER(target)",
      headers: ["Current (kg)", "Target (kg)", "MER (1.2×RER)", "70% MER", "0.8×RER(target)"],
      rows: [
        [6, 5],
        [8, 6.5],
        [5, 4.3],
      ].map(([c, t]) => {
        const rerC = RER(c);
        const merC = 1.2 * rerC;
        const sev = 0.7 * merC;
        const eight = 0.8 * RER(t);
        return [c, t, Math.round(merC), Math.round(sev), Math.round(eight)];
      }),
      notes: ["Numbers are educational examples; your veterinarian will fine-tune and monitor."],
    },
    {
      title: "Food label helper (owner math)",
      headers: ["Label info", "Example", "How to use"],
      rows: [
        ["Energy density", "300–400 kcal/cup (dry)", "Daily cups ≈ target kcal ÷ kcal per cup"],
        ["Kcal per can (wet)", "70–120 kcal/small can", "Daily cans ≈ target kcal ÷ kcal per can"],
        ["Mixed feeding", "Dry + wet", "Split the target kcal; track treats and toppers."],
      ],
      notes: ["Ask your vet about diet selection, protein/fiber levels, and satiety strategies."],
    },
  ],

  faqs: [
    {
      question: "What weekly loss rate is considered safe for cats?",
      answer:
        "Many veterinary sources target ~0.5–1.0% of current body weight per week. Faster loss can be risky; always have a veterinarian supervise.",
    },
    {
      question: "Which intake method should I use?",
      answer:
        "Both approaches appear in practice. Your veterinarian will choose and adjust based on progress, satiety, body condition score (BCS), and lab work if needed.",
    },
    {
      question: "My cat is very hungry — what should I do?",
      answer:
        "Do not change the plan on your own. Contact your veterinarian. They may adjust calories, diet composition, or feeding schedule.",
    },
    { question: "How often should I weigh my cat?", answer: "Weekly or every 2 weeks. Track BCS and behavior. Report concerns promptly to your vet." },
  ],

  sources: [
    { label: "WSAVA Global Nutrition Toolkit (RER/MER concepts)", href: "https://wsava.org/global-guidelines/" },
    { label: "General veterinary weight management guidance (feline)", href: "https://www.merckvetmanual.com/" },
  ],
};

export default function CatWeightLossPlanner() {
  useEffect(() => {
    document.title = "Cat Weight Loss Planner | Smart Kit Now";
  }, []);

  const canonical = "https://www.smartkitnow.com/pets/pet-care-calculators/cat-weight-loss-planner";
  const faqLd = useFaqJsonLd(cfg.faqs);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Pets", item: "https://www.smartkitnow.com/pets" },
      { "@type": "ListItem", position: 2, name: "Pet Care Tools", item: "https://www.smartkitnow.com/pets/pet-care-calculators" },
      { "@type": "ListItem", position: 3, name: "Cat Weight Loss Planner", item: canonical },
    ],
  } as const;

  return (
    <>
      <SeoHead
        title="Cat Weight Loss Planner | Smart Kit Now"
        description="Plan an educational daily calorie target for safe feline weight loss using 0.8×RER (target) or 70% of maintenance, with examples, FAQs, and sources."
        canonical={canonical}
      />



      <PetCalcOmniTemplate config={cfg} />

      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </>
  );
}