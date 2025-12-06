// src/pages/PetsCalculators.tsx

import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function PetsCalculators() {
  // Only show dog-focused calculators on the category hub
  const includeSubcategories = ["pet-care-calculators", "general"]; // keep sections but filter their items
  const dogOnlyFilter = (c: { slug: string; title: string; subcategory: string }) => {
    const k = `${c.slug} ${c.title}`.toLowerCase();
    // Dog-specific or generic tools we still allow: quality of life, costs, emergency, life stage
    const allowGenerics = /quality|cost|emergency|life|age to human|lifespan|ownership|drug|dose/.test(k);
    const isDog = /dog|canine|puppy/.test(k);
    // Exclude clearly non-dog species/tools
    const notDogSpecies = /(cat|feline|kitten|aquarium|fish|reptile|terrarium|bird|cage)/.test(k);
    if (notDogSpecies) return false;
    return isDog || allowGenerics;
  };

  // Static section data to enable correct counts, icons, spacing and 2-column layout (matching /financial style)
  type LinkItem = { to: string; title: string };
  type Section = { title: string; emoji: string; items: LinkItem[] };

  const dogSections: Section[] = [
    {
      title: "Nutrition & Weight",
      emoji: "\u2696\uFE0F",
      items: [
        { to: "/pets/dog-calorie-needs-rer-mer", title: "Dog Calorie Needs (RER/MER) Calculator" },
        { to: "/pets/dog-water-intake", title: "Dog Daily Water Intake Checker" },
        { to: "/pets/dog-weight-loss-planner", title: "Dog Weight Loss Planner" },
        { to: "/pets/dog-ideal-weight-target-calories", title: "Dog Ideal Weight & Target Calories Calculator" },
        { to: "/pets/dog-treat-calories-daily-allowance", title: "Dog Treat Calories & Daily Allowance Calculator" },
        { to: "/pets/puppy-calorie-needs-by-age-breed", title: "Puppy Calorie Needs by Age/Breed Size Calculator" },
        { to: "/pets/dog-protein-fat-intake-guide", title: "Dog Protein/Fat Intake Guide (by Goal)" },
      ],
    },
    {
      title: "Hydration",
      emoji: "💧",
      items: [
        { to: "/pets/dog-daily-water-intake-checker", title: "Dog Daily Water Intake Checker" },
        { to: "/pets/dog-dehydration-risk-estimator", title: "Dehydration Risk Estimator (Weight & Symptoms Aware)" },
      ],
    },
    {
      title: "Toxicology & Hazard Intake",
      emoji: "☣️",
      items: [
        { to: "/pets/dogs/dog-chocolate-toxicity-calculator", title: "Dog Chocolate Toxicity Calculator" },
        { to: "/pets/dogs/dog-grape-raisin-exposure-risk", title: "Dog Grape/Raisin Exposure Risk Calculator" },
        { to: "/pets/dogs/dog-onion-garlic-exposure-risk", title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator" },
        { to: "/pets/dogs/dog-xylitol-exposure-risk", title: "Dog Xylitol Exposure Risk Calculator" },
        { to: "/pets/dog-caffeine-toxicity", title: "Dog Caffeine Toxicity Calculator" },
        { to: "/pets/dog-macadamia-nut-toxicity", title: "Dog Macadamia Nut Toxicity Calculator" },
        { to: "/pets/dog-alcohol-ethanol-exposure-risk", title: "Dog Alcohol/Ethanol Exposure Risk Calculator" },
        { to: "/pets/dogs/dog-medication-exposure-alert", title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)" },
      ],
    },
    {
      title: "Medication & Dosing* (with strong vet disclaimer)",
      emoji: "💊",
      items: [
        { to: "/pets/benadryl-dose-dogs", title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs*" },
        { to: "/pets/cephalexin-dose-dogs", title: "Cephalexin Dose Calculator for Dogs*" },
        { to: "/pets/meloxicam-metacam-dose-dogs", title: "Meloxicam/Metacam Dose Calculator for Dogs*" },
        { to: "/pets/gabapentin-dose-dogs", title: "Gabapentin Dose Calculator for Dogs*" },
        { to: "/pets/prednisone-prednisolone-dose-dogs", title: "Prednisone/Prednisolone Dose Calculator for Dogs*" },
        { to: "/pets/tramadol-dose-dogs", title: "Tramadol Dose Calculator for Dogs*" },
        { to: "/pets/omega-3-epa-dha-supplement-dogs", title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs*" },
      ],
    },
    {
      title: "Growth, Size & Body Measures",
      emoji: "📏",
      items: [
        { to: "/pets/puppy-adult-size-predictor", title: "Puppy Adult Size Predictor (Weight Curve)" },
        { to: "/pets/dog-body-condition-score-bcs-helper", title: "Dog Body Condition Score Helper (BCS → Target Plan)" },
        { to: "/pets/dog-bmi-body-index", title: "Dog BMI/Body Index (educational)" },
        { to: "/pets/dog-crate-size-finder", title: "Dog Crate Size Finder" },
        { to: "/pets/dog-harness-size-fit-guide", title: "Dog Harness Size & Fit Guide" },
      ],
    },
    {
      title: "Activity & Fitness",
      emoji: "🐕",
      items: [
        { to: "/pets/dog-walking-calories-burned", title: "Dog Walking Calories Burned Calculator" },
        { to: "/pets/dog-step-goal-activity-time-planner", title: "Dog Step-Goal & Activity Time Planner" },
        { to: "/pets/dog-heat-risk-walk-safety-window", title: "Heat Risk/Walk Safety Window (Temp & Humidity)" },
      ],
    },
    {
      title: "Age, Life Stage & Longevity",
      emoji: "⏳",
      items: [
        { to: "/pets/dog-age-in-human-years-breed-aware", title: "Dog Age in Human Years (Breed-Aware)" },
        { to: "/pets/dog-life-expectancy-estimator", title: "Dog Life Expectancy Estimator (lifestyle factors)" },
      ],
    },
    {
      title: "Reproduction",
      emoji: "🐾",
      items: [
        { to: "/pets/dog-pregnancy-due-date", title: "Dog Pregnancy (Gestation) Due-Date Calculator" },
        { to: "/pets/whelping-countdown-stage-timeline", title: "Whelping Countdown & Stage Timeline" },
      ],
    },
  ];

  const catSections: Section[] = [
    {
      title: "Nutrition & Weight",
      emoji: "\u2696\uFE0F",
      items: [
        { to: "/pets/cat-calorie-needs-rer-mer", title: "Cat Calorie Needs (RER/MER) Calculator" },
        { to: "/pets/cat-weight-loss-planner", title: "Cat Weight Loss Planner" },
        { to: "/pets/cat-ideal-weight-target-calories", title: "Ideal Weight & Target Calories for Cats" },
        { to: "/pets/kitten-calorie-needs-by-age-size", title: "Kitten Calorie Needs by Age/Size" },
        { to: "/pets/senior-cat-nutrition-calorie-adjuster", title: "Senior Cat Nutrition & Calorie Adjuster" },
        { to: "/pets/cat-treat-calories-daily-allowance", title: "Cat Treat Calories & Daily Allowance" },
        { to: "/pets/cat-protein-fat-intake-guide", title: "Protein/Fat Intake Guide for Cats (by Goal)" },
      ],
    },
    {
      title: "Hydration",
      emoji: "💧",
      items: [
        { to: "/pets/cats/cat-water-intake", title: "Daily Water Intake Checker for Cats" },
        { to: "/pets/cat-dehydration-risk-estimator", title: "Dehydration Risk Estimator (Symptoms + Intake)" },
      ],
    },
    {
      title: "Toxicology & Hazard Intake",
      emoji: "☣️",
      items: [
        { to: "/pets/cat-chocolate-toxicity", title: "Cat Chocolate Toxicity Calculator" },
        { to: "/pets/cat-onion-garlic-toxicity", title: "Cat Onion/Garlic Toxicity Calculator" },
        { to: "/pets/cat-grape-raisin-exposure-risk", title: "Cat Grape/Raisin Exposure Risk (education-first)" },
        { to: "/pets/cat-xylitol-exposure-risk", title: "Xylitol Exposure Risk for Cats (rare but educational)" },
        { to: "/pets/cat-caffeine-toxicity-risk", title: "Caffeine Toxicity Risk for Cats" },
        { to: "/pets/cat-essential-oils-exposure-risk", title: "Essential Oils Exposure Risk (diffuser/dermal)" },
        { to: "/pets/lilies-poisoning-risk-guide-cats", title: "Lilies Poisoning Risk Guide (cats)" },
        { to: "/pets/cats-acetaminophen-ibuprofen-exposure-risk", title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)" },
      ],
    },
    {
      title: "Medication & Dosing* (strong vet disclaimer)",
      emoji: "💊",
      items: [
        { to: "/pets/benadryl-dose-cats", title: "Benadryl (Diphenhydramine) Dose Calculator for Cats*" },
        { to: "/pets/cephalexin-dose-cats", title: "Cephalexin Dose Calculator for Cats*" },
        { to: "/pets/meloxicam-dose-cats", title: "Meloxicam Dose Calculator for Cats*" },
        { to: "/pets/gabapentin-dose-cats", title: "Gabapentin Dose Calculator for Cats*" },
        { to: "/pets/prednisolone-dose-cats", title: "Prednisolone Dose Calculator for Cats*" },
        { to: "/pets/omega-3-epa-dha-supplement-cats", title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats*" },
        { to: "/pets/insulin-starter-reference-cats", title: "Insulin Starter Reference (units/kg & timing, info-only)*" },
      ],
    },
    {
      title: "Growth, Size & Body Measures",
      emoji: "📏",
      items: [
        { to: "/pets/kitten-adult-weight-predictor", title: "Kitten Adult Weight Predictor" },
        { to: "/pets/cat-body-condition-score-bcs-helper", title: "Cat Body Condition Score Helper (BCS → Target Plan)" },
        { to: "/pets/cat-bmi-body-index", title: "Cat BMI/Body Index (educational)" },
        { to: "/pets/cat-carrier-size-fit-guide", title: "Cat Carrier Size & Fit Guide" },
        { to: "/pets/cat-harness-size-fit-guide", title: "Cat Harness Size & Fit Guide" },
      ],
    },
    {
      title: "Activity & Lifestyle",
      emoji: "🐈",
      items: [
        { to: "/pets/cat-activity-calorie-adjuster", title: "Indoor/Outdoor Activity Calorie Adjuster" },
        { to: "/pets/cat-play-session-planner", title: "Play Session Planner (Feather/Chase Time Targets)" },
        { to: "/pets/cat-resting-active-hours-balance-tracker", title: "Resting vs. Active Hours Balance Tracker (owner input)" },
      ],
    },
    {
      title: "Age, Life Stage & Longevity",
      emoji: "⏳",
      items: [
        { to: "/pets/cat-age-in-human-years-breed-size-aware", title: "Cat Age in Human Years (Breed/Size Aware)" },
        { to: "/pets/senior-cat-care-readiness-checklist", title: "Senior Cat Care Readiness Checklist (scored helper)" },
        { to: "/pets/cat-life-expectancy-estimator", title: "Life Expectancy Estimator (lifestyle factors; educational)" },
      ],
    },
    {
      title: "Urinary & Kidney Health (owner-facing, non-diagnostic)",
      emoji: "🩺",
      items: [
        { to: "/pets/litter-box-output-tracker", title: "Litter Box Output Tracker (Normal vs. Increased)" },
        { to: "/pets/fluid-intake-vs-urine-output-checker", title: "Fluid Intake vs. Urine Output Balance Checker" },
        { to: "/pets/phosphorus-per-meal-estimator", title: "Phosphorus per Meal Estimator (diet label helper)" },
      ],
    },
    {
      title: "Reproduction",
      emoji: "🐾",
      items: [
        { to: "/pets/cat-pregnancy-due-date", title: "Cat Pregnancy (Gestation) Due-Date Calculator" },
        { to: "/pets/kitten-weaning-timeline-feeding-amounts", title: "Kitten Weaning Timeline & Feeding Amounts" },
      ],
    },
    {
      title: "Grooming & Care",
      emoji: "✂️",
      items: [
        { to: "/pets/shedding-combing-time-planner", title: "Shedding & Combing Time Planner" },
        { to: "/pets/nail-trim-interval-planner", title: "Nail Trim Interval Planner (activity/surface based)" },
      ],
    },
    {
      title: "Behavior & Environment",
      emoji: "🏠",
      items: [
        { to: "/pets/multi-cat-litter-box-count-calculator", title: "Multi-Cat Litter Box Count Calculator" },
        { to: "/pets/environmental-enrichment-planner", title: "Environmental Enrichment Planner (per room)" },
        { to: "/pets/stress-score-playtime-offset-planner", title: "Stress Score & Playtime Offset Planner (owner input)" },
      ],
    },
  ];

  const allSections = [...dogSections, ...catSections];
  const total = allSections.reduce((sum, s) => sum + s.items.length, 0);

  const renderSectionBlock = (section: Section) => {
    const mid = Math.ceil(section.items.length / 2);
    const colA = section.items.slice(0, mid);
    const colB = section.items.slice(mid);
    return (
      <section key={section.title}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[20px] leading-none select-none" aria-hidden="true">{section.emoji}</span>
          <h2 className="text-[22px] md:text-[24px] font-semibold tracking-[-0.01em] text-foreground">{section.title}</h2>
          <span className="text-sm skn-text-muted">({section.items.length})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <ul className="list-disc pl-5 space-y-3 leading-7">
            {colA.map((i) => (
              <li key={i.to}>
                <CalculatorLink to={i.to}>{i.title}</CalculatorLink>
              </li>
            ))}
          </ul>
          <ul className="list-disc pl-5 space-y-3 leading-7 mt-3 md:mt-0">
            {colB.map((i) => (
              <li key={i.to}>
                <CalculatorLink to={i.to}>{i.title}</CalculatorLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  return (
    <CategoryCalculatorsTemplate
      category="pets"
      description="Dog care calculators: nutrition, hydration, safety, dosing, growth and fitness helpers with clear guidance."
      canonical="https://www.smartkitnow.com/pets"
      titleOverride="Dog Care Calculators"
      breadcrumbsOverride={[
        { name: "Home", url: "https://www.smartkitnow.com/" },
        { name: "Dog Care Calculators", url: "https://www.smartkitnow.com/pets" },
      ]}
      marginTopClass="mt-[156px] md:mt-[176px]"
      showRightRail={true}
      showTopBanner={true}
      showBottomBanner={true}
      railsSticky={false}
      backTo="/"
      includeSubcategories={includeSubcategories}
      filterCalculator={dogOnlyFilter as any}
      totalOverride={total}
      renderSections={() => (
        <div className="space-y-10">
          {dogSections.map(renderSectionBlock)}
          {/* Cat section header */}
          <div className="mt-12 text-left">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: "#5c82ee" }}>
              <span className="text-[26px] leading-none select-none" aria-hidden="true">{"\uD83D\uDC31"}</span>
              Cat Care Calculators
            </h2>
            <p className="text-lg max-w-[740px]" style={{ color: "#747886" }}>
              Cat care calculators: nutrition, hydration, safety, dosing, growth and lifestyle helpers with clear guidance.
            </p>
          </div>
          {catSections.map(renderSectionBlock)}
        </div>
      )}
    />
  );
}


















