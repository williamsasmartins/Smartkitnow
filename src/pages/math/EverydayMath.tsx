// src/pages/math/EverydayMath.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Percent, Calculator, Sigma, Shapes } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

export default function EverydayMath() {
  const navigate = useNavigate();

  const tiles = [
    {
      to: "/math/everyday-math/percentages", // <-- opens the HUB
      title: "Percentage Calculators",
      count: 4,
      Icon: Percent,
      iconBg: "rgba(59,130,246,0.12)", // light blue
      iconColor: "#3b82f6",
      desc: "Percent of, Increase, Decrease, Change.",
    },
    {
      to: "/math/everyday-math/basic-arithmetic",
      title: "Basic Arithmetic",
      count: 6,
      Icon: Calculator,
      iconBg: "rgba(16,185,129,0.12)",
      iconColor: "#10b981",
      desc: "Add, subtract, multiply, divide, exponent, roots.",
    },
    {
      to: "/math/everyday-math/statistics",
      title: "Quick Statistics",
      count: 6,
      Icon: Sigma,
      iconBg: "rgba(234,179,8,0.14)",
      iconColor: "#ca8a04",
      desc: "Mean, median, mode, range, stdev.",
    },
    {
      to: "/math/everyday-math/geometry",
      title: "Geometry Minis",
      count: 6,
      Icon: Shapes,
      iconBg: "rgba(168,85,247,0.12)",
      iconColor: "#a855f7",
      desc: "Circle, rectangle, triangle, perimeter & area.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Everyday Math · Smart Kit Now"
        description="Fast everyday math calculators: percentages, basic arithmetic, quick statistics, and mini geometry tools."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
          { name: "Everyday Math", url: "https://www.smartkitnow.com/math/everyday-math" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Everyday Math",
          url: "https://www.smartkitnow.com/math/everyday-math",
          description: "Everyday math shortcuts and calculators.",
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div>
              <div className="mb-6">
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

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  Everyday Math
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  Quick, practical tools for daily math tasks.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto max-w-6xl">
            {tiles.map(({ to, title, count, Icon, iconBg, iconColor, desc }) => (
              <Card key={to} className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                <CardHeader className="flex flex-row items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center rounded-xl"
                    style={{ width: 42, height: 42, backgroundColor: iconBg, color: iconColor }}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                    <CalculatorLink to={to}>{title}</CalculatorLink>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2" style={{ color: "#747886" }}>{desc}</p>
                  <p className="text-sm" style={{ color: "#747886" }}>
                    {count} calculators available
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
