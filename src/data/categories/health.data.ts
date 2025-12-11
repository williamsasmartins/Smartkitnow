import { CategorySection } from "@/components/layouts/CategoryPageTemplate";

export const HEALTH_TITLE = "Health & Fitness Calculators";

export const HEALTH_DESCRIPTION =
  "Plan workouts, nutrition, and wellness with evidence-based calculators. Estimate BMI, body fat, BMR, TDEE, ideal weight, and more—fast, accurate, and mobile-friendly.";

export const HEALTH_SECTIONS: CategorySection[] = [
  {
    heading: "Popular",
    items: [
      { title: "BMI Calculator", to: "/health/bmi" },
      { title: "Body Fat Calculator", to: "/health/body-fat" },
      { title: "BMR Calculator", to: "/health/bmr" },
      { title: "TDEE Calculator", to: "/health/tdee" },
      { title: "Ideal Weight Calculator", to: "/health/ideal-weight" },
      { title: "Calorie Calculator", to: "/health/calorie" },
    ],
  },
  {
    heading: "Nutrition",
    items: [
      { title: "Macro Split Planner", to: "/health/macros" },
      { title: "Protein Intake", to: "/health/protein" },
      { title: "Water Intake", to: "/health/water" },
      { title: "Meal Calories Estimator", to: "/health/meal-calories" },
    ],
  },
  {
    heading: "Training",
    items: [
      { title: "VO₂ Max Estimate", to: "/health/vo2max" },
      { title: "Target Heart Rate", to: "/health/target-heart-rate" },
      { title: "1RM Strength", to: "/health/one-rep-max" },
      { title: "Pace & Split Time", to: "/health/running-pace" },
    ],
  },
  {
    heading: "Wellness",
    items: [
      { title: "Waist-to-Height Ratio", to: "/health/wthr" },
      { title: "Waist-to-Hip Ratio", to: "/health/wthr-hip" },
      { title: "Sleep Need Estimator", to: "/health/sleep" },
      { title: "Stress Recovery Index", to: "/health/recovery" },
    ],
  },
];
