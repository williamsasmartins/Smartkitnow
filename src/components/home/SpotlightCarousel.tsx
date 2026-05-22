import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  SPOTLIGHT_CARDS,
  type SpotlightCard,
  type SpotlightVariant,
  type SpotlightVisual,
} from "@/data/home/spotlightCards";

interface VariantClasses {
  hoverBorder: string;
  iconWrap: string;
  iconText: string;
  badge: string;
  cta: string;
}

const VARIANTS: Record<SpotlightVariant, VariantClasses> = {
  teal: {
    hoverBorder: "hover:border-teal-300 dark:hover:border-teal-700",
    iconWrap:
      "bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-800",
    iconText: "text-teal-600 dark:text-teal-400",
    badge:
      "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800",
    cta: "text-teal-600 dark:text-teal-400",
  },
  emerald: {
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    iconWrap:
      "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800",
    iconText: "text-emerald-600 dark:text-emerald-400",
    badge:
      "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    cta: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    hoverBorder: "hover:border-sky-300 dark:hover:border-sky-700",
    iconWrap:
      "bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800",
    iconText: "text-sky-600 dark:text-sky-400",
    badge:
      "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800",
    cta: "text-sky-600 dark:text-sky-400",
  },
};

function renderVisual(visual: SpotlightVisual): JSX.Element {
  switch (visual) {
    case "bars":
      return (
        <div className="flex items-center gap-1 h-10 mb-3">
          {[40, 55, 72, 60, 85, 100, 75, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-teal-100 dark:bg-teal-900/40 border-t-2 border-teal-400 dark:border-teal-500"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
    case "line":
      return (
        <div className="h-10 mb-3">
          <svg viewBox="0 0 100 40" className="w-full h-full">
            <polyline
              points="0,35 20,28 40,22 60,15 80,8 100,3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-emerald-400 dark:text-emerald-500"
            />
            <polyline
              points="0,35 20,28 40,22 60,15 80,8 100,3 100,40 0,40"
              className="text-emerald-100 dark:text-emerald-900/40"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </div>
      );
    case "clocks":
      return (
        <div className="space-y-1 mb-3">
          {[
            ["🌎 New York", "2:30 PM"],
            ["🌍 London", "7:30 PM"],
            ["🌏 Tokyo", "3:30 AM"],
          ].map(([city, time]) => (
            <div
              key={city}
              className="flex justify-between text-[10px] font-mono text-muted-foreground"
            >
              <span>{city}</span>
              <span className="text-foreground font-semibold">{time}</span>
            </div>
          ))}
        </div>
      );
    case "qr":
      return (
        <div className="h-10 mb-3 flex items-center justify-center">
          <div className="w-10 h-10 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-sm ${
                  [0, 2, 6, 8, 4].includes(i) ? "bg-foreground" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      );
  }
}

function Card({ card }: { card: SpotlightCard }): JSX.Element {
  const navigate = useNavigate();
  const v = VARIANTS[card.variant];
  const Icon = card.icon;
  const go = () => navigate(card.path);

  return (
    <div
      className={`skn-carousel-card group bg-background border border-border rounded-2xl p-5 cursor-pointer ${v.hoverBorder} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
      onClick={go}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && go()}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${v.iconWrap} ${v.iconText}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${v.badge}`}
        >
          {card.badge}
        </span>
      </div>
      <h3 className="font-semibold text-sm text-foreground mb-1.5">{card.title}</h3>
      <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">
        {card.description}
      </p>
      {renderVisual(card.visual)}
      <div
        className={`flex items-center gap-1 text-xs font-semibold ${v.cta} group-hover:underline`}
      >
        {card.cta} <ArrowLeft className="w-3 h-3 rotate-180" />
      </div>
    </div>
  );
}

export default function SpotlightCarousel(): JSX.Element {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-foreground">Featured Tools</h2>
        <button
          onClick={() =>
            document
              .getElementById("categories")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="text-sm text-primary font-medium hover:underline transition-colors"
        >
          Browse all →
        </button>
      </div>
      <div className="skn-carousel">
        {SPOTLIGHT_CARDS.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
