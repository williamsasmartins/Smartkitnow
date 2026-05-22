import type { LucideIcon } from "lucide-react";
import {
  DollarSign,
  Heart,
  ChefHat,
  RotateCcw,
  Calculator,
  Dog,
  Atom,
  Clock,
  Video,
  Lightbulb,
  Quote,
  Home,
  Dumbbell,
  Smile,
  TrendingUp,
  QrCode,
  BookOpen,
  Globe2,
  Car,
  HardHat,
  Zap,
} from "lucide-react";

export interface HomeCategory {
  key: string;
  name: string;
  icon: LucideIcon;
  color: string;
  path: string;
  description?: string;
}

export const PRIMARY_COUNT = 12;

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    key: "financial",
    name: "Financial Calculators",
    icon: DollarSign,
    color: "text-purple-600",
    path: "/financial",
    description:
      "Use one of our financial calculators to plan investments, calculate interest, or estimate savings on a purchase.",
  },
  {
    key: "health",
    name: "Health & Fitness Calculators",
    icon: Heart,
    color: "text-green-600",
    path: "/health",
    description:
      "Health and fitness calculators for exercise, fitness, nutritional, dietary, and body measurement applications.",
  },
  {
    key: "cooking",
    name: "Cooking Calculators",
    icon: ChefHat,
    color: "text-red-600",
    path: "/cooking",
    description:
      "Cooking and baking calculators that simplify recipes and convert ingredients between measurements.",
  },
  {
    key: "conversion",
    name: "Conversion Calculators",
    icon: RotateCcw,
    color: "text-green-600",
    path: "/conversion",
    description:
      "Convert nearly any measurement using one of the unit conversion calculators below.",
  },
  {
    key: "math",
    name: "Math & Algebra Calculators",
    icon: Calculator,
    color: "text-purple-600",
    path: "/math",
    description:
      "Mathematical calculations from basic arithmetic to advanced algebra, geometry, statistics, and trigonometry.",
  },
  {
    key: "pet",
    name: "Pet Care Calculators",
    icon: Dog,
    color: "text-amber-600",
    path: "/pets",
    description:
      "Pet health, nutrition, and care calculators for dogs, cats, and aquariums.",
  },
  {
    key: "science",
    name: "Science Calculators",
    icon: Atom,
    color: "text-cyan-600",
    path: "/science",
    description:
      "Chemistry, physics, and density calculations for scientific applications.",
  },
  {
    key: "time",
    name: "Time & Date Calculators",
    icon: Clock,
    color: "text-indigo-600",
    path: "/time",
    description:
      "Age calculations, countdowns, date arithmetic, and time conversions.",
  },
  {
    key: "video",
    name: "Video Calculators",
    icon: Video,
    color: "text-violet-600",
    path: "/video",
    description:
      "Optimize your home theater setup with TV viewing distance, screen size, and speaker placement.",
  },
  {
    key: "tips",
    name: "Smart Tips",
    icon: Lightbulb,
    color: "text-yellow-500",
    path: "/smart-tips",
    description:
      "Actionable life hacks and practical guidance for home organization, cleaning, travel and more.",
  },
  {
    key: "quotes",
    name: "Daily Quotes",
    icon: Quote,
    color: "text-slate-600",
    path: "/daily-quotes",
    description:
      "Inspirational and motivational quotes to brighten your day and spark a positive mindset.",
  },
  {
    key: "everyday",
    name: "Every day Life Calculators",
    icon: Home,
    color: "text-blue-500",
    path: "/everyday",
    description:
      "Handy everyday calculators for household budgeting, time planning, chores, and daily life.",
  },
  {
    key: "sports",
    name: "Sports",
    icon: Dumbbell,
    color: "text-orange-500",
    path: "/sports",
    description:
      "Training, performance, and fitness calculators for athletes and enthusiasts across multiple sports.",
  },
  {
    key: "funny",
    name: "Funny Calculators",
    icon: Smile,
    color: "text-pink-500",
    path: "/funny",
    description:
      "Lighthearted tools for fun estimations, playful math, and humorous calculations.",
  },
  {
    key: "marketing",
    name: "Marketing Calculators",
    icon: TrendingUp,
    color: "text-emerald-500",
    path: "/marketing",
    description:
      "Calculators for digital marketers, including CPM, ROAS, ROI, and conversion rates.",
  },
  {
    key: "games",
    name: "Free Games",
    icon: Video,
    color: "text-blue-600",
    path: "/games",
    description: "Play curated arcade, puzzle, word, board and more. Free.",
  },
  {
    key: "qr",
    name: "Free QR Code Generator",
    icon: QrCode,
    color: "text-blue-600",
    path: "/everyday/qr-code-generator",
    description: "Generate QR codes for URLs and text in PNG/SVG.",
  },
  {
    key: "word",
    name: "Word Counter",
    icon: BookOpen,
    color: "text-indigo-500",
    path: "/word-counter",
    description: "Count words, track speed, proofread, and format texts.",
  },
  {
    key: "worldclock",
    name: "World Clock",
    icon: Globe2,
    color: "text-blue-500",
    path: "/time/world-clock",
    description: "Real-time world clock and timezone converter.",
  },
  {
    key: "automotive",
    name: "Automotive Calculators",
    icon: Car,
    color: "text-blue-600",
    path: "/automotive",
    description:
      "Automotive calculators for engine performance tuning, day-to-day mechanics, and vehicle applications.",
  },
  {
    key: "construction",
    name: "Construction Calculators",
    icon: HardHat,
    color: "text-yellow-600",
    path: "/construction",
    description:
      "Construction calculators for building materials, measurements, costs, and project planning.",
  },
  {
    key: "electrical",
    name: "Electrical Calculators",
    icon: Zap,
    color: "text-yellow-600",
    path: "/electrical",
    description:
      "Electrical unit conversions, usage and cost estimates, wire sizing, and physics calculations.",
  },
];
