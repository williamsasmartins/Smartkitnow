import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CalculatorLink from "@/components/common/CalculatorLink";

// Icons (all guaranteed in lucide-react)
import { Calculator, Percent, Slash, Sigma, Ruler, Shapes, ArrowLeft } from "lucide-react";

// Palette used on the site (blue for titles/highlights)
const BRAND = {
  title: "#5c82ee", // default color for titles
  sub: "#747886",   // subtítulos/descrições
};

// Colored badge consistent with other pages
function IconBadge({
  children,
  bg = "rgba(59,130,246,0.14)",
  fg = "#3b82f6",
}: {
  children: React.ReactNode;
  bg?: string;
  fg?: string;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl"
      style={{ width: 44, height: 44, backgroundColor: bg, color: fg }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

type HubCard = {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const HUBS: HubCard[] = [
  {
    to: "/math/percent-calculators",
    title: "Percentage Calculators",
    description: "Percent of, Increase, Decrease, Change.",
    icon: (
      <IconBadge bg="rgba(59,130,246,0.14)" fg="#3b82f6">
        <Percent className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/fraction-calculators",
    title: "Fraction Calculators",
    description: "Reduce, convert fraction ⇄ decimal and more.",
    icon: (
      <IconBadge bg="rgba(139,92,246,0.14)" fg="#8b5cf6">
        <Slash className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/everyday-math",
    title: "Everyday Math",
    description: "Average, proportion (regra de 3), ratio, LCM/GCD.",
    icon: (
      <IconBadge bg="rgba(16,185,129,0.14)" fg="#10b981">
        <Calculator className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/algebra-basics",
    title: "Algebra Basics",
    description: "Linear/Quadratic solvers, exponents & roots.",
    icon: (
      <IconBadge bg="rgba(245,158,11,0.14)" fg="#f59e0b">
        <Sigma className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/geometry",
    title: "Geometry",
    description: "Area, perimeter, circle, triangle, rectangle.",
    icon: (
      <IconBadge bg="rgba(59,130,246,0.12)" fg="#3b82f6">
        <Shapes className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/statistics",
    title: "Statistics Quick Tools",
    description: "Median, mode, range and more.",
    icon: (
      <IconBadge bg="rgba(107,114,128,0.14)" fg="#6b7280">
        <Ruler className="h-5 w-5" />
      </IconBadge>
    ),
  },
];

export default function MathCalculators() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Math & Algebra Calculators · Smart Kit Now"
        description="Explore hubs of math tools: percentages, fractions, everyday math, algebra, geometry and statistics."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Math & Algebra Calculators",
          url: typeof window !== "undefined" ? window.location.href : "",
          description:
            "Explore hubs of math tools: percentages, fractions, everyday math, algebra, geometry and statistics.",
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div className="text-center">
              <div className="mb-6 flex justify-center">
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

              <h1 className="text-4xl font-bold mb-3" style={{ color: BRAND.title }}>
                Math & Algebra Calculators
              </h1>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: BRAND.sub }}>
                Choose a hub to explore focused mini-tools and calculators.
              </p>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {HUBS.map((hub) => (
              <Card className="bg-card border border-border/50 hover:shadow-soft hover:-translate-y-0.5 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {hub.icon}
                    <div className="min-w-0">
                      <div className="text-base font-semibold mb-1" style={{ color: BRAND.title }}>
                        <CalculatorLink to={hub.to}>{hub.title}</CalculatorLink>
                      </div>
                      <div className="text-sm" style={{ color: BRAND.sub }}>
                        {hub.description}
                      </div>
                    </div>
                  </div>
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
