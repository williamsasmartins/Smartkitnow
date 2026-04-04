/**
 * Cross-category internal linking map.
 *
 * Key: calculator slug
 * Value: array of slugs that should appear as related (cross-category)
 *
 * These supplement the automatic same-category suggestions in RelatedCalculators.tsx.
 * Prioritized by user intent: what does someone using THIS calculator also need?
 *
 * Design rules:
 *  1. Maximum 2 cross-links per calculator (same-category fills the remaining slots)
 *  2. Links must reflect a genuine user journey — calculator A leads naturally to B
 *  3. Both slugs must exist in calculatorRegistry.ts
 */
export const CROSS_LINKS: Record<string, string[]> = {
  // ── FINANCIAL → MARKETING (business owners using both) ───────────────────
  "tax-bracket-calculator":           ["marketing-roi-calculator", "net-income-after-tax-calculator"],
  "net-income-after-tax-calculator":  ["monthly-budget-planner-calculator", "savings-rate-tracker-calculator"],
  "investment-roi-calculator":        ["roas-calculator", "marketing-roi-calculator"],
  "debt-to-income-ratio-calculator":  ["monthly-budget-planner-calculator", "refinance-savings-calculator"],
  "debt-consolidation-calculator":    ["monthly-budget-planner-calculator", "savings-rate-tracker-calculator"],
  "college-savings-calculator":       ["sip-monthly-investment-planner-calculator", "future-value-investment-calculator"],
  "refinance-savings-calculator":     ["debt-to-income-ratio-calculator", "monthly-budget-planner-calculator"],
  "customer-acquisition-cost":        ["marketing-roi-calculator", "conversion-rate-calculator"],
  "customer-lifetime-value":          ["churn-rate-calculator", "marketing-roi-calculator"],

  // ── MARKETING → FINANCIAL ────────────────────────────────────────────────
  "marketing-roi-calculator":         ["roas-calculator", "customer-acquisition-cost"],
  "roas-calculator":                  ["marketing-roi-calculator", "email-marketing-roi-calculator"],
  "conversion-rate-calculator":       ["customer-acquisition-cost", "marketing-roi-calculator"],
  "churn-rate-calculator":            ["customer-lifetime-value", "savings-rate-tracker-calculator"],
  "email-marketing-roi-calculator":   ["marketing-roi-calculator", "customer-acquisition-cost"],
  "social-media-engagement-rate":     ["conversion-rate-calculator", "marketing-roi-calculator"],

  // ── MATH → SCIENCE (academic / STEM users) ───────────────────────────────
  "quadratic-equation-solver":        ["projectile-motion-calculator", "standard-deviation-variance"],
  "standard-deviation-variance":      ["z-score-percentile-finder", "binomial-probability-calculator"],
  "z-score-percentile-finder":        ["standard-deviation-variance", "normal-cdf-pdf-estimator"],
  "binomial-probability-calculator":  ["z-score-percentile-finder", "normal-cdf-pdf-estimator"],
  "normal-cdf-pdf-estimator":         ["standard-deviation-variance", "z-score-percentile-finder"],
  "permutations-combinations":        ["binomial-probability-calculator", "z-score-percentile-finder"],
  "pythagorean-theorem-solver":       ["shapes-area-volume-pack", "projectile-motion-calculator"],
  "trigonometry-angle-side-finder":   ["pythagorean-theorem-solver", "projectile-motion-calculator"],
  "exponent-power-calculator":        ["logarithm-antilog-base10-e", "scientific-notation-standard-form"],
  "logarithm-antilog-base10-e":       ["exponent-power-calculator", "scientific-notation-standard-form"],
  "scientific-notation-standard-form":["exponent-power-calculator", "logarithm-antilog-base10-e"],
  "lcm-calculator":                   ["gcf-gcd-calculator", "prime-factorization-tool"],
  "gcf-gcd-calculator":               ["lcm-calculator", "prime-factorization-tool"],
  "prime-factorization-tool":         ["gcf-gcd-calculator", "lcm-calculator"],

  // ── SCIENCE → MATH ───────────────────────────────────────────────────────
  "projectile-motion-calculator":     ["quadratic-equation-solver", "pythagorean-theorem-solver"],

  // ── HEALTH → SPORTS / FITNESS ────────────────────────────────────────────
  "calorie-calculator":               ["bmi-calculator", "bmr-calculator"],
  "bmi-calculator":                   ["calorie-calculator", "body-fat-calculator"],
  "bmr-calculator":                   ["calorie-calculator", "bmi-calculator"],
  "body-fat-calculator":              ["bmi-calculator", "calorie-calculator"],
  "ideal-weight-calculator":          ["bmi-calculator", "calorie-calculator"],

  // ── AUTOMOTIVE → FINANCIAL (car buying decision journey) ─────────────────
  "ev-acceleration-torque-calculator":["lease-vs-buy-calculator", "car-loan-affordability-calculator"],
  "car-loan-affordability-calculator":["lease-vs-buy-calculator", "debt-to-income-ratio-calculator"],
  "lease-vs-buy-calculator":          ["car-loan-affordability-calculator", "ev-acceleration-torque-calculator"],

  // ── TIME → EVERYDAY ──────────────────────────────────────────────────────
  "world-clock":                      ["qr-code-generator", "word-counter"],

  // ── FINANCIAL CRYPTO → TAX ───────────────────────────────────────────────
  "crypto-profit-loss-calculator":    ["crypto-tax-liability-calculator", "capital-gains-tax-estimator"],
  "crypto-dca-strategy-calculator":   ["crypto-tax-liability-calculator", "dca-strategy-analyzer-crypto"],
  "capital-gains-tax-estimator":      ["crypto-tax-liability-calculator", "tax-bracket-calculator"],
  "crypto-tax-liability-calculator":  ["capital-gains-tax-estimator", "tax-bracket-calculator"],
  "cost-basis-fifo-lifo-calculator":  ["crypto-tax-liability-calculator", "capital-gains-tax-estimator"],

  // ── CONSTRUCTION → FINANCIAL (project budget journey) ────────────────────
  "roof-shingles-calculator":         ["home-improvement-loan-calculator", "mortgage-amortization"],
  "concrete-calculator":              ["home-improvement-loan-calculator", "mortgage-amortization"],
  "flooring-calculator":              ["home-improvement-loan-calculator", "tip-split-bill"],
  "drywall-calculator":               ["home-improvement-loan-calculator", "mortgage-amortization"],
  "paint-calculator":                 ["home-improvement-loan-calculator", "tip-split-bill"],

  // ── ELECTRICAL → CONSTRUCTION (home projects) ────────────────────────────
  "wire-gauge-calculator":            ["drywall-calculator", "concrete-calculator"],
  "ohms-law-calculator":              ["wire-gauge-calculator", "three-phase-power"],
  "voltage-drop-calculator":          ["wire-gauge-calculator", "home-improvement-loan-calculator"],

  // ── SCIENCE → HEALTH (biology/body crossover) ────────────────────────────
  "half-life-calculator":             ["bmr-calculator", "calorie-calculator"],
  "molar-mass-calculator":            ["protein-intake-by-goal", "calorie-calculator"],
  "ph-calculator":                    ["water-intake-per-day", "calorie-calculator"],

  // ── SPORTS → HEALTH (fitness journey) ────────────────────────────────────
  "running-pace-calculator":          ["calorie-calculator", "bmr-calculator"],
  "calories-burned-calculator":       ["bmi-calculator", "calorie-calculator"],
  "swimming-pace-calculator":         ["calorie-calculator", "heart-rate-zones"],
  "cycling-speed-calculator":         ["calorie-calculator", "bmr-calculator"],
  "one-rep-max-calculator":           ["calorie-calculator", "protein-intake-by-goal"],

  // ── COOKING → HEALTH (nutrition crossover) ────────────────────────────────
  "recipe-scaler":                    ["calorie-calculator", "macro-split-planner"],
  "cups-grams-converter":             ["calorie-calculator", "protein-intake-by-goal"],
  "bakers-percentage":                ["calorie-calculator", "macro-split-planner"],

  // ── AUTOMOTIVE → FINANCIAL (vehicle cost decisions) ───────────────────────
  "fuel-cost-calculator":             ["car-loan-affordability", "lease-vs-buy-calculator"],
  "ev-charging-cost":                 ["car-loan-affordability", "lease-vs-buy-calculator"],
  "tco-total-cost-ownership":         ["car-loan-affordability", "debt-to-income-ratio-calculator"],

  // ── CONVERSION → MATH (academic users) ───────────────────────────────────
  "unit-converter":                   ["quadratic-equation-solver", "scientific-notation-standard-form"],
  "temperature-converter":            ["standard-deviation-variance", "percent-error-calculator"],
  "length-converter":                 ["pythagorean-theorem-solver", "percent-error-calculator"],

  // ── EVERYDAY → FINANCIAL (practical money tools) ─────────────────────────
  "tip-calculator":                   ["tip-split-bill", "monthly-budget-planner-calculator"],
  "discount-calculator":              ["percent-of-total", "tax-bracket-calculator"],
  "sales-tax-calculator":             ["tip-split-bill", "tax-bracket-calculator"],
};
