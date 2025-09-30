import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Percent,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Shapes,
  Sigma,
  FunctionSquare,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

/** Bolha de ícone colorida no padrão do site */
function ColoredIcon({
  children,
  bg,
  fg,
}: {
  children: React.ReactNode;
  bg: string;
  fg: string;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl shrink-0"
      style={{ width: 40, height: 40, backgroundColor: bg, color: fg }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

/** Subcat com cards filhos (cada filho pode ter cor/ícone próprios) */
type Item = {
  label: string;
  to: string;
  icon: React.ReactNode;
  color: { bg: string; fg: string };
};

type Subcat = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: { bg: string; fg: string };
  items: Item[];
};

const SUBCATALOG: Record<string, Subcat> = {
  // ============= Percent =============
  "percent-calculators": {
    title: "Percent Calculators",
    subtitle:
      "Common percentage tools for everyday math — percent of, increase, decrease, and percent change.",
    icon: <Percent className="h-5 w-5" />,
    color: { bg: "rgba(59,130,246,0.18)", fg: "#60a5fa" }, // azul (header da página)
    items: [
      {
        label: "Percent of Total",
        to: "/math/percent-calculators/percent-of",
        icon: <Percent className="h-5 w-5" />,
        color: { bg: "rgba(59,130,246,0.22)", fg: "#60a5fa" }, // azul
      },
      {
        label: "Percent Increase",
        to: "/math/percent-calculators/percent-increase",
        icon: <TrendingUp className="h-5 w-5" />,
        color: { bg: "rgba(16,185,129,0.22)", fg: "#34d399" }, // verde
      },
      {
        label: "Percent Decrease",
        to: "/math/percent-calculators/percent-decrease",
        icon: <TrendingDown className="h-5 w-5" />,
        color: { bg: "rgba(239,68,68,0.22)", fg: "#f87171" }, // vermelho
      },
      {
        label: "Percent Change",
        to: "/math/percent-calculators/percent-change",
        icon: <ArrowUpDown className="h-5 w-5" />,
        color: { bg: "rgba(245,158,11,0.22)", fg: "#fbbf24" }, // âmbar
      },
    ],
  },

  // ============= Geometry (placeholder) =============
  "geometry-shapes": {
    title: "Geometry & Shapes",
    subtitle:
      "Area, perimeter, circumference, surface area and volume — with diagrams and formulas.",
    icon: <Shapes className="h-5 w-5" />,
    color: { bg: "rgba(16,185,129,0.18)", fg: "#10b981" },
    items: [
      { label: "Area Calculator", to: "/math/geometry/area", icon: <Shapes className="h-5 w-5" />, color: { bg: "rgba(16,185,129,0.22)", fg: "#34d399" } },
      { label: "Perimeter Calculator", to: "/math/geometry/perimeter", icon: <Shapes className="h-5 w-5" />, color: { bg: "rgba(16,185,129,0.22)", fg: "#34d399" } },
      { label: "Circle & Circumference", to: "/math/geometry/circle", icon: <Shapes className="h-5 w-5" />, color: { bg: "rgba(16,185,129,0.22)", fg: "#34d399" } },
      { label: "Volume Calculator", to: "/math/geometry/volume", icon: <Shapes className="h-5 w-5" />, color: { bg: "rgba(16,185,129,0.22)", fg: "#34d399" } },
    ],
  },

  // ============= Statistics (placeholder) =============
  statistics: {
    title: "Statistics",
    subtitle:
      "Mean/median/mode, standard deviation, z-score, confidence intervals, and more.",
    icon: <Sigma className="h-5 w-5" />,
    color: { bg: "rgba(245,158,11,0.18)", fg: "#f59e0b" },
    items: [
      { label: "Mean / Average", to: "/math/statistics/mean", icon: <Sigma className="h-5 w-5" />, color: { bg: "rgba(245,158,11,0.22)", fg: "#fbbf24" } },
      { label: "Median & Mode", to: "/math/statistics/median-mode", icon: <Sigma className="h-5 w-5" />, color: { bg: "rgba(245,158,11,0.22)", fg: "#fbbf24" } },
      { label: "Std. Deviation", to: "/math/statistics/stddev", icon: <Sigma className="h-5 w-5" />, color: { bg: "rgba(245,158,11,0.22)", fg: "#fbbf24" } },
      { label: "Z-Score", to: "/math/statistics/zscore", icon: <Sigma className="h-5 w-5" />, color: { bg: "rgba(245,158,11,0.22)", fg: "#fbbf24" } },
    ],
  },

  // ============= Algebra & Trig (placeholder) =============
  "algebra-trig": {
    title: "Algebra & Trig",
    subtitle:
      "Linear forms, quadratic formula, triangle solvers, unit circle, and trig functions.",
    icon: <FunctionSquare className="h-5 w-5" />,
    color: { bg: "rgba(147,51,234,0.18)", fg: "#a78bfa" },
    items: [
      { label: "Quadratic Formula", to: "/math/algebra/quadratic", icon: <FunctionSquare className="h-5 w-5" />, color: { bg: "rgba(147,51,234,0.22)", fg: "#c4b5fd" } },
      { label: "Equation of a Line", to: "/math/algebra/line", icon: <FunctionSquare className="h-5 w-5" />, color: { bg: "rgba(147,51,234,0.22)", fg: "#c4b5fd" } },
      { label: "Right Triangle", to: "/math/trig/right-triangle", icon: <FunctionSquare className="h-5 w-5" />, color: { bg: "rgba(147,51,234,0.22)", fg: "#c4b5fd" } },
      { label: "Unit Circle", to: "/math/trig/unit-circle", icon: <FunctionSquare className="h-5 w-5" />, color: { bg: "rgba(147,51,234,0.22)", fg: "#c4b5fd" } },
    ],
  },
};

export default function MathSubCategory() {
  const { subcategory } = useParams<{ subcategory: string }>();
  const navigate = useNavigate();

  const data = SUBCATALOG[subcategory ?? ""] ?? SUBCATALOG["percent-calculators"];
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "https://www.smartkitnow.com/math";

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={`${data.title} · Smart Kit Now`}
        description={data.subtitle}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
          { name: data.title, url: pageUrl },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: data.title,
          url: pageUrl,
          description: data.subtitle,
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div className="text-center">
              <div className="mb-6 text-left">
                <Button
                  variant="default"
                  onClick={() => navigate("/math")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <ColoredIcon bg={data.color.bg} fg={data.color.fg}>
                  {data.icon}
                </ColoredIcon>

                <h1 className="text-4xl font-bold" style={{ color: "#5c82ee" }}>
                  {data.title}
                </h1>

                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#9aa3b2" }}>
                  {data.subtitle}
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.items.map((it) => (
              <Link key={it.to} to={it.to} className="group block">
                <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader className="flex items-center gap-3">
                    <ColoredIcon bg={it.color.bg} fg={it.color.fg}>
                      {it.icon}
                    </ColoredIcon>
                    <CardTitle className="text-lg font-semibold" style={{ color: "#5c82ee" }}>
                      {it.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: "#9aa3b2" }}>
                      Open tool
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
