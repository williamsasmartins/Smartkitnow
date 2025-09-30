// src/pages/MathCalculators.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Percent,
  Calculator,
  Shapes,
  GraduationCap,
  Hash,
  Ruler,
  Triangle,
  Sigma,
  FunctionSquare,
  LineChart,
  Axis3D, // <— trocamos por este
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

type Subcat = {
  to: string;
  title: string;
  countText: string;
  icon: React.ReactNode;
  bg: string; // rgba bg
  fg: string; // hex fg
};

const SUBCATS: Subcat[] = [
  {
    to: "/math/percent-calculators",
    title: "Percentage Calculators",
    countText: "4 calculators available",
    icon: <Percent className="h-5 w-5" />,
    bg: "rgba(59,130,246,0.12)",
    fg: "#3b82f6",
  },
  {
    to: "/math/fraction-calculators",
    title: "Fraction Calculators",
    countText: "14 calculators available",
    icon: <Calculator className="h-5 w-5" />,
    bg: "rgba(234,179,8,0.12)",
    fg: "#eab308",
  },
  {
    to: "/math/geometry-calculators",
    title: "Geometry Calculators",
    countText: "22 calculators available",
    icon: <Shapes className="h-5 w-5" />,
    bg: "rgba(99,102,241,0.12)",
    fg: "#6366f1",
  },
  {
    to: "/math/triangle-calculators",
    title: "Triangle Calculators",
    countText: "13 calculators available",
    icon: <Triangle className="h-5 w-5" />,
    bg: "rgba(20,184,166,0.12)",
    fg: "#14b8a6",
  },
  {
    to: "/math/trig-calculators",
    title: "Trigonometry Calculators",
    countText: "16 calculators available",
    icon: <FunctionSquare className="h-5 w-5" />,
    bg: "rgba(99,102,241,0.12)",
    fg: "#6366f1",
  },
  {
    to: "/math/statistics-calculators",
    title: "Statistics Calculators",
    countText: "28 calculators available",
    icon: <LineChart className="h-5 w-5" />,
    bg: "rgba(59,130,246,0.12)",
    fg: "#3b82f6",
  },
  {
    to: "/math/grade-calculators",
    title: "Grade & GPA Calculators",
    countText: "10 calculators available",
    icon: <GraduationCap className="h-5 w-5" />,
    bg: "rgba(34,197,94,0.12)",
    fg: "#22c55e",
  },
  {
    to: "/math/number-system",
    title: "Number System Converters",
    countText: "16 calculators available",
    icon: <Hash className="h-5 w-5" />,
    bg: "rgba(168,85,247,0.12)",
    fg: "#a855f7",
  },
  {
    to: "/math/line-vector-calculators",
    title: "Lines & Vectors",
    countText: "18 calculators available",
    icon: <Axis3D className="h-5 w-5" />, // <— aqui
    bg: "rgba(234,88,12,0.12)",
    fg: "#ea580c",
  },
  {
    to: "/math/measure-tools",
    title: "Measurement & Rounding",
    countText: "12 calculators available",
    icon: <Ruler className="h-5 w-5" />,
    bg: "rgba(107,114,128,0.12)",
    fg: "#6b7280",
  },
  {
    to: "/math/algebra-calculators",
    title: "Algebra & Equations",
    countText: "12 calculators available",
    icon: <Sigma className="h-5 w-5" />,
    bg: "rgba(244,63,94,0.12)",
    fg: "#f43f5e",
  },
  {
    to: "/math/more-math",
    title: "More Math Tools",
    countText: "20+ calculators available",
    icon: <Calculator className="h-5 w-5" />,
    bg: "rgba(2,132,199,0.12)",
    fg: "#0284c7",
  },
];

export default function MathCalculators() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Math & Algebra Calculators · SmartKitNow"
        description="Everyday math tools: percentages, fractions, geometry, statistics, trigonometry, triangles and more."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Math & Algebra Calculators",
          url: "https://www.smartkitnow.com/math",
          description: "Browse math calculator categories.",
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
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                Math & Algebra Calculators
              </h1>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                Quick, accurate math tools. Choose a category below.
              </p>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          {/* Grid de subcategorias (TODAS clicáveis) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBCATS.map((sc) => (
              <Link key={sc.to} to={sc.to} className="group block">
                <Card className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, backgroundColor: sc.bg, color: sc.fg }}
                      aria-hidden="true"
                    >
                      {sc.icon}
                    </span>
                    <CardTitle className="text-xl font-bold" style={{ color: "#5c82ee" }}>
                      {sc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm" style={{ color: "#747886" }}>
                      {sc.countText}
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
