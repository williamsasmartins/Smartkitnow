// scripts/expected-pets.ts
// Expected entries for Pets calculators (initial import from Part 3/3)

export type ExpectedEntry = {
  slug: string;
  category: string; // e.g., "pets"
  subcategory: string; // e.g., "dogs" | "cats" | "general"
  title: string;
  loaderHint?: string; // e.g., "@/components/calculators/CatWaterIntakeCalculator"
};

// TODO: Populate with Dog entries from Parts 1/3 and 2/3
export const expectedDogs: ExpectedEntry[] = [];

export const expectedCats: ExpectedEntry[] = [
  // Medication & Dosing* (7)
  { slug: "cat-benadryl-dose", category: "pets", subcategory: "cats", title: "Benadryl (Diphenhydramine) Dose Calculator for Cats*", loaderHint: "@/components/calculators/CatBenadrylDoseCalculator" },
  { slug: "cat-cephalexin-dose", category: "pets", subcategory: "cats", title: "Cephalexin Dose Calculator for Cats*", loaderHint: "@/components/calculators/CatCephalexinDoseCalculator" },
  { slug: "cat-meloxicam-dose", category: "pets", subcategory: "cats", title: "Meloxicam Dose Calculator for Cats*", loaderHint: "@/components/calculators/CatMeloxicamDoseCalculator" },
  { slug: "cat-gabapentin-dose", category: "pets", subcategory: "cats", title: "Gabapentin Dose Calculator for Cats*", loaderHint: "@/components/calculators/CatGabapentinDoseCalculator" },
  { slug: "cat-prednisolone-dose", category: "pets", subcategory: "cats", title: "Prednisolone Dose Calculator for Cats*", loaderHint: "@/components/calculators/CatPrednisoloneDoseCalculator" },
  { slug: "cat-omega3-supplement", category: "pets", subcategory: "cats", title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats*", loaderHint: "@/components/calculators/CatOmega3Calculator" },
  { slug: "cat-insulin-starter-info", category: "pets", subcategory: "cats", title: "Insulin Starter Reference (info-only)*", loaderHint: "@/components/calculators/CatInsulinStarterInfo" },

  // Growth, Size & Body Measures (5)
  { slug: "kitten-adult-weight-predictor", category: "pets", subcategory: "cats", title: "Kitten Adult Weight Predictor", loaderHint: "@/components/calculators/KittenAdultWeightPredictor" },
  { slug: "cat-bcs-helper", category: "pets", subcategory: "cats", title: "Cat Body Condition Score Helper (BCS → Target Plan)", loaderHint: "@/components/calculators/CatBCSHelper" },
  { slug: "cat-bmi-index", category: "pets", subcategory: "cats", title: "Cat BMI/Body Index (educational)", loaderHint: "@/components/calculators/CatBMICalculator" },
  { slug: "cat-carrier-size", category: "pets", subcategory: "cats", title: "Cat Carrier Size & Fit Guide", loaderHint: "@/components/calculators/CatCarrierSizeGuide" },
  { slug: "cat-harness-size", category: "pets", subcategory: "cats", title: "Cat Harness Size & Fit Guide", loaderHint: "@/components/calculators/CatHarnessSizeGuide" },

  // Activity & Lifestyle (3)
  { slug: "cat-activity-calorie-adjuster", category: "pets", subcategory: "cats", title: "Indoor/Outdoor Activity Calorie Adjuster", loaderHint: "@/components/calculators/CatActivityCalorieAdjuster" },
  { slug: "cat-play-session-planner", category: "pets", subcategory: "cats", title: "Play Session Planner (Feather/Chase Time Targets)", loaderHint: "@/components/calculators/CatPlaySessionPlanner" },
  { slug: "cat-rest-active-balance", category: "pets", subcategory: "cats", title: "Resting vs. Active Hours Balance Tracker", loaderHint: "@/components/calculators/CatRestActiveBalance" },

  // Age, Life Stage & Longevity (3)
  { slug: "cat-age-human-years", category: "pets", subcategory: "cats", title: "Cat Age in Human Years (Breed/Size Aware)", loaderHint: "@/components/calculators/CatAgeHumanYears" },
  { slug: "senior-cat-readiness-checklist", category: "pets", subcategory: "cats", title: "Senior Cat Care Readiness Checklist (scored)", loaderHint: "@/components/calculators/SeniorCatReadinessChecklist" },
  { slug: "cat-life-expectancy", category: "pets", subcategory: "cats", title: "Life Expectancy Estimator (lifestyle factors; educational)", loaderHint: "@/components/calculators/CatLifeExpectancyEstimator" },

  // Urinary & Kidney Health (3)
  { slug: "cat-litter-output-tracker", category: "pets", subcategory: "cats", title: "Litter Box Output Tracker (Normal vs. Increased)", loaderHint: "@/components/calculators/CatLitterOutputTracker" },
  { slug: "cat-intake-vs-urine-balance", category: "pets", subcategory: "cats", title: "Fluid Intake vs. Urine Output Balance Checker", loaderHint: "@/components/calculators/CatIntakeUrineBalance" },
  { slug: "cat-phosphorus-per-meal", category: "pets", subcategory: "cats", title: "Phosphorus per Meal Estimator (diet label helper)", loaderHint: "@/components/calculators/CatPhosphorusPerMeal" },

  // Reproduction (2)
  { slug: "cat-gestation-due-date", category: "pets", subcategory: "cats", title: "Cat Pregnancy (Gestation) Due-Date Calculator", loaderHint: "@/components/calculators/CatGestationDueDate" },
  { slug: "kitten-weaning-timeline", category: "pets", subcategory: "cats", title: "Kitten Weaning Timeline & Feeding Amounts", loaderHint: "@/components/calculators/KittenWeaningTimeline" },

  // Grooming & Care (2)
  { slug: "cat-shedding-combing-planner", category: "pets", subcategory: "cats", title: "Shedding & Combing Time Planner", loaderHint: "@/components/calculators/CatSheddingCombingPlanner" },
  { slug: "cat-nail-trim-interval", category: "pets", subcategory: "cats", title: "Nail Trim Interval Planner (activity/surface based)", loaderHint: "@/components/calculators/CatNailTrimInterval" },

  // Behavior & Environment (3)
  { slug: "multi-cat-litterbox-count", category: "pets", subcategory: "cats", title: "Multi-Cat Litter Box Count Calculator", loaderHint: "@/components/calculators/MultiCatLitterboxCount" },
  { slug: "cat-enrichment-planner", category: "pets", subcategory: "cats", title: "Environmental Enrichment Planner (per room)", loaderHint: "@/components/calculators/CatEnrichmentPlanner" },
  { slug: "cat-stress-score-playtime-offset", category: "pets", subcategory: "cats", title: "Stress Score & Playtime Offset Planner", loaderHint: "@/components/calculators/CatStressScorePlaytimeOffset" },
];

export const expectedAll: ExpectedEntry[] = [...expectedDogs, ...expectedCats];