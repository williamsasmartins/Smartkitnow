// scripts/expected-pets.mjs — plain ESM, no TypeScript needed

export const expectedDogs = [];

export const expectedCats = [
  // Medication & Dosing (7)
  { slug: "cat-benadryl-dose" },
  { slug: "cat-cephalexin-dose" },
  { slug: "cat-meloxicam-dose" },
  { slug: "cat-gabapentin-dose" },
  { slug: "cat-prednisolone-dose" },
  { slug: "cat-omega3-supplement" },
  { slug: "cat-insulin-starter-info" },
  // Growth, Size & Body (5)
  { slug: "kitten-adult-weight-predictor" },
  { slug: "cat-bcs-helper" },
  { slug: "cat-bmi-index" },
  { slug: "cat-carrier-size" },
  { slug: "cat-harness-size" },
  // Activity & Lifestyle (3)
  { slug: "cat-activity-calorie-adjuster" },
  { slug: "cat-play-session-planner" },
  { slug: "cat-rest-active-balance" },
  // Age, Life Stage & Longevity (3)
  { slug: "cat-age-human-years" },
  { slug: "senior-cat-readiness-checklist" },
  { slug: "cat-life-expectancy" },
  // Urinary & Kidney Health (3)
  { slug: "cat-litter-output-tracker" },
  { slug: "cat-intake-vs-urine-balance" },
  { slug: "cat-phosphorus-per-meal" },
  // Reproduction (2)
  { slug: "cat-gestation-due-date" },
  { slug: "kitten-weaning-timeline" },
  // Grooming & Care (2)
  { slug: "cat-shedding-combing-planner" },
  { slug: "cat-nail-trim-interval" },
  // Behavior & Environment (3)
  { slug: "multi-cat-litterbox-count" },
  { slug: "cat-enrichment-planner" },
  { slug: "cat-stress-score-playtime-offset" },
];

export const expectedAll = [...expectedDogs, ...expectedCats];
