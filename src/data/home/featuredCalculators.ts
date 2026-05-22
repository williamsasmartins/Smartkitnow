import type { LucideIcon } from "lucide-react";
import {
  QrCode,
  Video,
  Heart,
  DollarSign,
  Calculator,
  RotateCcw,
  ChefHat,
  Star,
  Moon,
} from "lucide-react";

export interface FeaturedCalculator {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  ctaLabel: string;
}

export const FEATURED_CALCULATORS: FeaturedCalculator[] = [
  {
    name: "Free QR Code Generator",
    description: "Generate QR Codes for URLs and text",
    icon: QrCode,
    path: "/everyday/qr-code-generator",
    ctaLabel: "Generate QR Code",
  },
  {
    name: "Free Games",
    description: "Play curated arcade, puzzle, word, and board games",
    icon: Video,
    path: "/games",
    ctaLabel: "Play Now",
  },
  {
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    icon: Heart,
    path: "/health/bmi-body-mass-index",
    ctaLabel: "Check My BMI",
  },
  {
    name: "Loan Calculator",
    description: "Calculate monthly payments",
    icon: DollarSign,
    path: "/financial/loan-payment",
    ctaLabel: "Calculate My Payment",
  },
  {
    name: "Tip Calculator",
    description: "Calculate tips and split bills",
    icon: Calculator,
    path: "/financial/tip-split-bill",
    ctaLabel: "Split the Bill",
  },
  {
    name: "Unit Converter",
    description: "Convert between units",
    icon: RotateCcw,
    path: "/conversion",
    ctaLabel: "Convert Units",
  },
  {
    name: "Calorie Calculator",
    description: "Calculate daily calories",
    icon: ChefHat,
    path: "/health/daily-calorie-needs-goal",
    ctaLabel: "Find My Calories",
  },
  {
    name: "Grade Calculator",
    description: "Calculate your GPA",
    icon: Star,
    path: "/math/gpa-calculator",
    ctaLabel: "Calculate My GPA",
  },
  {
    name: "Dream Interpreter",
    description: "Discover the hidden meanings in your dreams with AI",
    icon: Moon,
    path: "/daily-quotes/dream",
    ctaLabel: "Interpret Dream",
  },
];
