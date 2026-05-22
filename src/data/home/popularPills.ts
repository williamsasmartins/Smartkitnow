export interface PopularPill {
  label: string;
  path: string;
}

export const POPULAR_PILLS: PopularPill[] = [
  { label: "BMI", path: "/health/bmi-body-mass-index" },
  { label: "Loan", path: "/financial/loan-payment" },
  { label: "Tip Calculator", path: "/financial/tip-split-bill" },
  { label: "Calories", path: "/health/daily-calorie-needs-goal" },
  { label: "Concrete", path: "/construction/concrete-slab-volume" },
  { label: "Unit Converter", path: "/conversion" },
];
