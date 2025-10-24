// src/data/categoryMeta.ts
export type CategoryMeta = {
  key: string;            // canonical key used in code/registry
  path: string;           // URL segment
  display: string;        // UI label
  icon?: string;          // optional; hook into your getCategoryIcon if you want
};

export const CATEGORIES: Record<string, CategoryMeta> = {
  "financial":         { key: "financial",         path: "financial",         display: "Financial Calculators",         icon: "PiggyBank" },
  "health-fitness":    { key: "health-fitness",    path: "health-fitness",    display: "Health & Fitness Calculators",  icon: "HeartPulse" },
  "cooking":           { key: "cooking",           path: "cooking",           display: "Cooking Calculators",           icon: "Utensils" },
  "conversion":        { key: "conversion",        path: "conversion",        display: "Conversion Calculators",        icon: "ArrowsLeftRight" },
  "math":              { key: "math",              path: "math",              display: "Math & Algebra Calculators",    icon: "FunctionSquare" },
  "pets":              { key: "pets",              path: "pets",              display: "Pet Care Calculators",          icon: "PawPrint" },
  "science":           { key: "science",           path: "science",           display: "Science Calculators",           icon: "FlaskConical" },
  "time-date":         { key: "time-date",         path: "time-date",         display: "Time & Date Calculators",       icon: "CalendarClock" },
  "video":             { key: "video",             path: "video",             display: "Video Calculators",             icon: "Clapperboard" },
  "recipes":           { key: "recipes",           path: "recipes",           display: "Recipes",                       icon: "BookOpen" },
  "smart-tips":        { key: "smart-tips",        path: "smart-tips",        display: "Smart Tips",                    icon: "Lightbulb" },
  "daily-quotes":      { key: "daily-quotes",      path: "daily-quotes",      display: "Daily Quotes",                  icon: "Quote" },
  "everyday":          { key: "everyday",          path: "everyday",          display: "Everyday Life Calculators",     icon: "House" },
  "sports":            { key: "sports",            path: "sports",            display: "Sports",                        icon: "Trophy" },
  "funny":             { key: "funny",             path: "funny",             display: "Funny Calculators",             icon: "Sparkles" },
  "automotive":        { key: "automotive",        path: "automotive",        display: "Automotive Calculators",        icon: "Car" },
  "construction":      { key: "construction",      path: "construction",      display: "Construction Calculators",      icon: "Hammer" },
  "electrical":        { key: "electrical",        path: "electrical",        display: "Electrical Calculators",        icon: "Plug" },
};

// Optional: subcategory display normalization for sections where you want short keys in routes
export const SUBCATEGORY_DISPLAY: Record<string, Record<string, string>> = {
  "everyday": {
    "home": "Home & Routine",
    "events": "Events & Hosting",
    "garden": "Garden & Outdoor",
  },
  "smart-tips": {
    "wellbeing": "Wellbeing",
    "planning": "Everyday Planning",
    "productivity": "Productivity",
    "digital-wellbeing": "Digital Wellbeing",
  },
  "pets": {
    "dog-nutrition-weight": "Dog — Nutrition & Weight",
    "dog-hydration": "Dog — Hydration",
    "dog-medication-dosing": "Dog — Medication & Dosing",
    "cat-nutrition-weight": "Cat — Nutrition & Weight",
    "cat-hydration": "Cat — Hydration",
    "cat-medication-dosing": "Cat — Medication & Dosing",
    "all-utilities": "All Pets — Utilities",
    "horse-nutrition-weight": "Horse — Nutrition & Weight",
    "bird-nutrition-weight": "Birds — Nutrition & Weight",
    "fish-tank-equipment": "Fish & Aquatics — Tank & Equipment",
    "reptile-habitat-lighting": "Reptiles — Habitat & Lighting",
    "small-mammals-nutrition-weight": "Small Mammals — Nutrition & Weight",
  }
};

// Helpers
export const getCategoryMeta = (keyOrPath: string): CategoryMeta | undefined => {
  const k = keyOrPath.toLowerCase();
  return CATEGORIES[k] || Object.values(CATEGORIES).find(c => c.path === k);
};

export const getDisplaySubcategory = (categoryKey: string, subKey: string) =>
  SUBCATEGORY_DISPLAY[categoryKey]?.[subKey] ?? subKey;