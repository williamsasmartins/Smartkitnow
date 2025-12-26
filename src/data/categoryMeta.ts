// src/data/categoryMeta.ts
export type CategoryMeta = {
  key: string;            // canonical key used in code/registry
  path: string;           // URL segment
  display: string;        // UI label
  icon?: string;          // optional; hook into your getCategoryIcon if you want
  emoji?: string;         // emoji for menu/card display
};

export const CATEGORIES: Record<string, CategoryMeta> = {
  "financial":         { key: "financial",         path: "financial",         display: "Financial Calculators",         icon: "PiggyBank",       emoji: "💰" },
  // normalized to match registry keys and routes
  "health":            { key: "health",            path: "health",            display: "Health & Fitness Calculators",  icon: "HeartPulse",      emoji: "💪" },
  "cooking":           { key: "cooking",           path: "cooking",           display: "Cooking Calculators",           icon: "Utensils",        emoji: "🍳" },
  "conversion":        { key: "conversion",        path: "conversion",        display: "Conversion Calculators",        icon: "ArrowsLeftRight", emoji: "🔁" },
  "math":              { key: "math",              path: "math",              display: "Math & Algebra Calculators",    icon: "FunctionSquare",  emoji: "➗" },
  "pets":              { key: "pets",              path: "pets",              display: "Pet Care Calculators",          icon: "PawPrint",        emoji: "🐾" },
  "science":           { key: "science",           path: "science",           display: "Science Calculators",           icon: "FlaskConical",    emoji: "🔬" },
  // normalized from time-date to time
  "time":              { key: "time",              path: "time",              display: "Time & Date Calculators",       icon: "CalendarClock",   emoji: "⏱️" },
  "video":             { key: "video",             path: "video",             display: "Video Calculators",             icon: "Clapperboard",    emoji: "🎬" },
  "recipes":           { key: "recipes",           path: "recipes",           display: "Recipes",                       icon: "BookOpen",        emoji: "🍽️" },
  "smart-tips":        { key: "smart-tips",        path: "smart-tips",        display: "Smart Tips",                    icon: "Lightbulb",       emoji: "💡" },
  "daily-quotes":      { key: "daily-quotes",      path: "daily-quotes",      display: "Daily Quotes",                  icon: "Quote",           emoji: "📝" },
  "everyday":          { key: "everyday",          path: "everyday",          display: "Everyday Life Calculators",     icon: "House",           emoji: "🧰" },
  "sports":            { key: "sports",            path: "sports",            display: "Sports",                        icon: "Trophy",          emoji: "🏅" },
  "funny":             { key: "funny",             path: "funny",             display: "Funny Calculators",             icon: "Sparkles",        emoji: "🤪" },
  "automotive":        { key: "automotive",        path: "automotive",        display: "Automotive Calculators",        icon: "Car",             emoji: "🚗" },
  "construction":      { key: "construction",      path: "construction",      display: "Construction Calculators",      icon: "Hammer",          emoji: "🏗️" },
  "electrical":        { key: "electrical",        path: "electrical",        display: "Electrical Calculators",        icon: "Plug",            emoji: "⚡" },
};

// Optional: subcategory display normalization for sections where you want short keys in routes
export const SUBCATEGORY_DISPLAY: Record<string, Record<string, string>> = {
  "automotive": {
    "performance-tuning": "Performance & Tuning",
  },
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