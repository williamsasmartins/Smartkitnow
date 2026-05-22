import type { LucideIcon } from "lucide-react";
import { DollarSign, TrendingUp, Globe2, QrCode } from "lucide-react";

export type SpotlightVariant = "teal" | "emerald" | "sky";
export type SpotlightVisual = "bars" | "line" | "clocks" | "qr";

export interface SpotlightCard {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  badge: string;
  variant: SpotlightVariant;
  visual: SpotlightVisual;
  cta: string;
}

export const SPOTLIGHT_CARDS: SpotlightCard[] = [
  {
    title: "Auto Loan Calculator",
    description:
      "Monthly payments with full amortization charts and interest breakdown.",
    path: "/financial/auto-loan",
    icon: DollarSign,
    badge: "New Charts",
    variant: "teal",
    visual: "bars",
    cta: "Calculate Now",
  },
  {
    title: "Investment Growth",
    description:
      "Compound interest with monthly contributions and real-return projections.",
    path: "/financial/future-value",
    icon: TrendingUp,
    badge: "Updated",
    variant: "emerald",
    visual: "line",
    cta: "Start Investing",
  },
  {
    title: "World Clock",
    description: "Real-time clocks across popular cities and global timezones.",
    path: "/time/world-clock",
    icon: Globe2,
    badge: "New App",
    variant: "sky",
    visual: "clocks",
    cta: "View Time",
  },
  {
    title: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, and more in seconds. Free forever.",
    path: "/everyday/qr-code-generator",
    icon: QrCode,
    badge: "Free Tool",
    variant: "teal",
    visual: "qr",
    cta: "Generate QR",
  },
];
