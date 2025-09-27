// src/data/slugMaps.ts

export type CalcItem = { slug: string; name: string };

export const financialSlugs: Record<string, CalcItem[]> = {
  "business-finance-calculators": [
    { slug: "roi-calculator", name: "ROI Calculator" },
    { slug: "investment-return-calculator", name: "Investment Return Calculator" },
    { slug: "refinance-breakeven-calculator", name: "Refinance Breakeven Calculator" },
    { slug: "home-affordability-calculator", name: "Home Affordability Calculator" },
    { slug: "debt-to-income-calculator", name: "Debt-to-Income Calculator" },
    { slug: "adjusted-gross-income-calculator", name: "Adjusted Gross Income Calculator" },
  ],
  "interest-and-loan-calculators": [
    { slug: "amortization-calculator", name: "Amortization Calculator" },
    { slug: "loan-calculator", name: "Loan Calculator" },
    { slug: "mortgage-calculator", name: "Mortgage Calculator" },
    { slug: "simple-interest-calculator", name: "Simple Interest Calculator" },
    { slug: "compound-interest-calculator", name: "Compound Interest Calculator" },
    { slug: "apr-calculator", name: "APR Calculator" },
  ],
  "personal-finance-calculators": [
    { slug: "discount-calculator", name: "Discount Calculator" },
    { slug: "tip-calculator", name: "Tip Calculator" },
    { slug: "annual-income-calculator", name: "Annual Income Calculator" },
    { slug: "hourly-to-salary-calculator", name: "Hourly to Salary Calculator" },
    { slug: "biweekly-pay-calculator", name: "Biweekly Pay Calculator" },
  ],
};

export const cookingSlugs: Record<string, CalcItem[]> = {
  "cooking-and-baking-calculators": [
    { slug: "cake-calculator", name: "Cake Calculator" },
    { slug: "cooking-conversion-calculator", name: "Cooking Conversion Calculator" },
    { slug: "ham-cooking-time", name: "Ham Cooking Time (não implementado)" },
    { slug: "ham-size", name: "Ham Size (não implementado)" },
    { slug: "milk-weight", name: "Milk Weight (não implementado)" },
    { slug: "oven-temperature-conversion", name: "Oven Temp. Conversion" },
    { slug: "pizza-calculator", name: "Pizza Calculator" },
    { slug: "recipe-scale-conversion", name: "Recipe Scale Conversion" },
    { slug: "cooking-timer", name: "Timer" },
  ],
};

export const electricalSlugs: Record<string, CalcItem[]> = {
  "electrical-calculators": [
    { slug: "ohms-law-calculator", name: "Ohm's Law Calculator" },
    { slug: "wire-size-calculator", name: "Wire Size Calculator" },
  ],
  // se criar mais, adicionamos
};

export const healthSlugs: Record<string, CalcItem[]> = {
  "body-measurement-calculators": [
    { slug: "bmi-calculator", name: "BMI Calculator" },
    { slug: "body-fat-calculator", name: "Body Fat Calculator" },
  ],
  "dietary-and-nutrition-calculators": [
    { slug: "bmr-calculator", name: "BMR Calculator" },
    { slug: "tdee-calculator", name: "TDEE Calculator" },
    { slug: "calorie-calculator", name: "Calorie Calculator" },
    { slug: "calories-to-kilograms-calculator", name: "Calories to Kilograms" },
  ],
  "others": [
    { slug: "adjusted-body-weight-calculator", name: "Adjusted Body Weight" },
    { slug: "imc-calculator", name: "IMC Calculator" },
  ],
};

export const mathSlugs: Record<string, CalcItem[]> = {
  "math-and-algebra": [
    { slug: "area-calculator", name: "Area Calculator" },
    { slug: "fraction-calculator", name: "Fraction Calculator" },
    { slug: "gpa-calculator", name: "GPA Calculator" },
    { slug: "percentage-calculator", name: "Percentage Calculator" },
    { slug: "slope-calculator", name: "Slope Calculator" },
  ],
};

export const petsSlugs: Record<string, CalcItem[]> = {
  "pets": [
    { slug: "aquarium-volume-calculator", name: "Aquarium Volume" },
    { slug: "aquarium-weight-calculator", name: "Aquarium Weight" },
    { slug: "cat-age-calculator", name: "Cat Age" },
    { slug: "dog-age-calculator", name: "Dog Age" },
    { slug: "dog-calorie-calculator", name: "Dog Calorie" },
  ],
};

export const scienceSlugs: Record<string, CalcItem[]> = {
  "science": [
    { slug: "density-calculator", name: "Density Calculator" },
    { slug: "force-calculator", name: "Force Calculator" },
    { slug: "molarity-calculator", name: "Molarity Calculator" },
    { slug: "molar-mass-calculator", name: "Molar Mass Calculator" },
    { slug: "physics-calculator", name: "Physics Calculator" },
    { slug: "velocity-calculator", name: "Velocity Calculator" },
  ],
};

export const timeSlugs: Record<string, CalcItem[]> = {
  "time": [
    { slug: "age-calculator", name: "Age Calculator" },
    { slug: "countdown-calculator", name: "Countdown Calculator" },
    { slug: "date-calculator", name: "Date Calculator" },
    { slug: "duration-calculator", name: "Duration Calculator" },
    { slug: "time-converter", name: "Time Converter" },
  ],
};

export const tvSlugs: Record<string, CalcItem[]> = {
  "video-and-tv": [
    { slug: "aspect-ratio-calculator", name: "Aspect Ratio Calculator" },
    { slug: "ppi-calculator", name: "PPI Calculator" },
    { slug: "projector-calculator", name: "Projector Calculator" },
    { slug: "screen-size-calculator", name: "Screen Size Calculator" },
    { slug: "tv-dimensions-chart", name: "TV Dimensions Chart" },
    { slug: "tv-height-calculator", name: "TV Height Calculator" },
    { slug: "tv-mounting-cost-calculator", name: "TV Mounting Cost Calculator" },
    { slug: "tv-viewing-distance-calculator", name: "TV Viewing Distance Calculator" },
    { slug: "tv-viewing-ranges-guide", name: "TV Viewing Ranges Guide" },
    { slug: "video-resolutions-guide", name: "Video Resolutions Guide" },
  ],
};
