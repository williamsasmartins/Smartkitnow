// scripts/expected-pets.mjs — plain ESM, no TypeScript needed

export const expectedDogs = [];

export const expectedCats = [
  // Medication & Dosing
  { slug: "cat-benadryl-diphenhydramine-dose" },
  { slug: "cat-cephalexin-dose" },
  { slug: "cat-meloxicam-dose" },
  { slug: "cat-gabapentin-dose" },
  { slug: "cat-prednisolone-dose" },
  { slug: "cat-omega-3-epa-dha-supplement" },
  { slug: "cat-insulin-starter-reference" },
  // Growth, Size & Body
  { slug: "kitten-adult-weight-predictor" },
  { slug: "cat-body-condition-score-bcs-target" },
  { slug: "cat-bmi-body-index-educational" },
  { slug: "cat-carrier-size-fit-guide" },
  { slug: "cat-harness-size-fit-guide" },
  // Activity & Lifestyle
  { slug: "cat-activity-calorie-adjuster" },
  { slug: "cat-play-session-planner" },
  { slug: "cat-resting-active-hours-balance-tracker" },
  // Age, Life Stage & Longevity
  { slug: "cat-age-human-years-breed-size-aware" },
  { slug: "senior-cat-care-readiness-checklist" },
  { slug: "cat-life-expectancy-estimator" },
  // Urinary & Kidney Health
  { slug: "cat-litter-box-output-tracker" },
  { slug: "cat-fluid-intake-urine-output-balance" },
  { slug: "cat-phosphorus-per-meal-estimator" },
  // Reproduction
  { slug: "cat-pregnancy-gestation-due-date" },
  { slug: "kitten-weaning-timeline-feeding-amounts" },
  // Grooming & Care
  { slug: "cat-shedding-combing-time-planner" },
  { slug: "cat-nail-trim-interval-planner" },
  // Behavior & Environment
  { slug: "multi-cat-litter-box-count-calculator" },
  { slug: "cat-environmental-enrichment-planner" },
  { slug: "cat-stress-score-playtime-offset-planner" },
];

export const expectedAll = [...expectedDogs, ...expectedCats];
