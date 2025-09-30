import React from "react";
import { Link } from "react-router-dom";
import { Calculator, Percent, Sigma, Slash, Shapes, Ruler } from "lucide-react";

/** =========
 * TIPOS
 * ========= */
export type MiniCard = {
  slug: string;           // rota final (ex.: "percent-of-total")
  label: string;          // título do mini-card
  to: string;             // link absoluto
  count?: number;         // opcional: número de variações
  icon?: React.ReactNode; // ícone do mini-card (já colorido)
};

export type SubcatSection = {
  title: string;          // título “bonito” da seção
  description?: string;   // subtítulo
  items: MiniCard[];
};

/** =========
 * PALETA DE BADGE
 * ========= */
const ICON = {
  blue:    { bg: "rgba(59,130,246,0.14)",  fg: "#3b82f6" },
  emerald: { bg: "rgba(16,185,129,0.14)",  fg: "#10b981" },
  amber:   { bg: "rgba(245,158,11,0.14)",  fg: "#f59e0b" },
  violet:  { bg: "rgba(139,92,246,0.14)",  fg: "#8b5cf6" },
  gray:    { bg: "rgba(107,114,128,0.14)", fg: "#6b7280" },
};

function IconBadge({
  node,
  color = "blue",
}: {
  node: React.ReactNode;
  color?: keyof typeof ICON;
}) {
  const c = ICON[color];
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl"
      style={{ width: 44, height: 44, backgroundColor: c.bg, color: c.fg }}
      aria-hidden="true"
    >
      {node}
    </span>
  );
}

/** =========
 * CATÁLOGO DE SUBCATEGORIAS DE MATH
 * =========
 * Você já tinha estas duas (percent/fraction). Mantive iguais.
 * Acrescentei: everyday-math, algebra-basics, geometry, statistics.
 */
export const MATH_SUBCATALOG: Record<string, SubcatSection> = {
  /* =========================
   * Percentage Calculators
   * ========================= */
  "percent-calculators": {
    title: "Percentage Calculators",
    description: "Quick percentage tools for daily math.",
    items: [
      {
        slug: "percent-of-total",
        label: "Percent of Total",
        to: "/math/percent-calculators/percent-of-total",
        count: 1,
        icon: <IconBadge node={<Percent className="h-5 w-5" />} color="blue" />,
      },
      {
        slug: "percent-increase",
        label: "Percent Increase",
        to: "/math/percent-calculators/percent-increase",
        count: 1,
        icon: <IconBadge node={<Percent className="h-5 w-5" />} color="emerald" />,
      },
      {
        slug: "percent-decrease",
        label: "Percent Decrease",
        to: "/math/percent-calculators/percent-decrease",
        count: 1,
        icon: <IconBadge node={<Percent className="h-5 w-5" />} color="amber" />,
      },
      {
        slug: "percent-change",
        label: "Percent Change",
        to: "/math/percent-calculators/percent-change",
        count: 1,
        icon: <IconBadge node={<Percent className="h-5 w-5" />} color="violet" />,
      },
    ],
  },

  /* =========================
   * Fraction Calculators
   * ========================= */
  "fraction-calculators": {
    title: "Fraction Calculators",
    description: "Simplify, convert and compare fractions.",
    items: [
      {
        slug: "fraction-reducer",
        label: "Fraction Reducer",
        to: "/math/fraction-calculators/fraction-reducer",
        count: 1,
        icon: <IconBadge node={<Slash className="h-5 w-5" />} color="blue" />,
      },
      {
        slug: "fraction-to-decimal",
        label: "Fraction to Decimal",
        to: "/math/fraction-calculators/fraction-to-decimal",
        count: 1,
        icon: <IconBadge node={<Sigma className="h-5 w-5" />} color="emerald" />,
      },
      {
        slug: "decimal-to-fraction",
        label: "Decimal to Fraction",
        to: "/math/fraction-calculators/decimal-to-fraction",
        count: 1,
        icon: <IconBadge node={<Sigma className="h-5 w-5" />} color="amber" />,
      },
      {
        slug: "percent-to-fraction",
        label: "Percent to Fraction",
        to: "/math/fraction-calculators/percent-to-fraction",
        count: 1,
        icon: <IconBadge node={<Percent className="h-5 w-5" />} color="violet" />,
      },
    ],
  },

  /* =========================
   * Everyday Math (novos placeholders)
   * ========================= */
  "everyday-math": {
    title: "Everyday Math",
    description: "Average, proportion (rule of three), ratios, LCM/GCD.",
    items: [
      {
        slug: "average-calculator",
        label: "Average Calculator",
        to: "/math/everyday-math/average-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="emerald" />,
      },
      {
        slug: "ratio-calculator",
        label: "Ratio Calculator",
        to: "/math/everyday-math/ratio-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="blue" />,
      },
      {
        slug: "proportion-calculator",
        label: "Proportion (Rule of Three)",
        to: "/math/everyday-math/proportion-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="amber" />,
      },
      {
        slug: "lcm-gcd-calculator",
        label: "LCM & GCD",
        to: "/math/everyday-math/lcm-gcd-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="violet" />,
      },
    ],
  },

  /* =========================
   * Algebra Basics (novos placeholders)
   * ========================= */
  "algebra-basics": {
    title: "Algebra Basics",
    description: "Linear & quadratic solvers, exponents and roots.",
    items: [
      {
        slug: "linear-equation-solver",
        label: "Linear Equation Solver",
        to: "/math/algebra-basics/linear-equation-solver",
        icon: <IconBadge node={<Sigma className="h-5 w-5" />} color="blue" />,
      },
      {
        slug: "quadratic-equation-solver",
        label: "Quadratic Solver",
        to: "/math/algebra-basics/quadratic-equation-solver",
        icon: <IconBadge node={<Sigma className="h-5 w-5" />} color="emerald" />,
      },
      {
        slug: "exponent-root-calculator",
        label: "Exponents & Roots",
        to: "/math/algebra-basics/exponent-root-calculator",
        icon: <IconBadge node={<Sigma className="h-5 w-5" />} color="violet" />,
      },
    ],
  },

  /* =========================
   * Geometry (novos placeholders)
   * ========================= */
  geometry: {
    title: "Geometry",
    description: "Area, perimeter, circle, triangle and rectangle.",
    items: [
      {
        slug: "area-perimeter-calculator",
        label: "Area & Perimeter",
        to: "/math/geometry/area-perimeter-calculator",
        icon: <IconBadge node={<Shapes className="h-5 w-5" />} color="blue" />,
      },
      {
        slug: "circle-calculator",
        label: "Circle Calculator",
        to: "/math/geometry/circle-calculator",
        icon: <IconBadge node={<Ruler className="h-5 w-5" />} color="amber" />,
      },
      {
        slug: "triangle-calculator",
        label: "Triangle Calculator",
        to: "/math/geometry/triangle-calculator",
        icon: <IconBadge node={<Shapes className="h-5 w-5" />} color="emerald" />,
      },
      {
        slug: "rectangle-calculator",
        label: "Rectangle Calculator",
        to: "/math/geometry/rectangle-calculator",
        icon: <IconBadge node={<Ruler className="h-5 w-5" />} color="violet" />,
      },
    ],
  },

  /* =========================
   * Statistics (novos placeholders)
   * ========================= */
  statistics: {
    title: "Statistics Quick Tools",
    description: "Mean, median, mode and range.",
    items: [
      {
        slug: "mean-calculator",
        label: "Mean (Average)",
        to: "/math/statistics/mean-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="emerald" />,
      },
      {
        slug: "median-calculator",
        label: "Median",
        to: "/math/statistics/median-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="blue" />,
      },
      {
        slug: "mode-calculator",
        label: "Mode",
        to: "/math/statistics/mode-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="amber" />,
      },
      {
        slug: "range-calculator",
        label: "Range",
        to: "/math/statistics/range-calculator",
        icon: <IconBadge node={<Calculator className="h-5 w-5" />} color="violet" />,
      },
    ],
  },
};

/** =========
 * MiniCardLink: helper para desenhar cada mini-card
 * ========= */
export function MiniCardLink({ item }: { item: MiniCard }) {
  return (
    <Link to={item.to} className="group block">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:shadow-soft hover:-translate-y-0.5 transition-all">
        {item.icon ?? <IconBadge node={<Calculator className="h-5 w-5" />} color="blue" />}
        <div className="min-w-0">
          <div className="text-base font-semibold" style={{ color: "#5c82ee" }}>
            {item.label}
          </div>
          {typeof item.count === "number" && (
            <div className="text-xs" style={{ color: "#747886" }}>
              {item.count} calculator{item.count === 1 ? "" : "s"} available
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
