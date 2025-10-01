// src/pages/MathCalculators.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

// Ícones (lucide-react)
import { Calculator, Percent, Slash, Sigma, Ruler, Shapes } from "lucide-react";

/** Badge de ícone colorido (mesmo visual dos outros hubs) */
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

/** Rotas dos hubs (ajustadas aos caminhos que você tem no App.tsx) */
const HUBS: HubCard[] = [
  {
    to: "/math/percentage-calculators",
    title: "Percentage Calculators",
    description: "Percent of, Increase, Decrease, Change.",
    icon: (
      <IconBadge bg="rgba(59,130,246,0.14)" fg="#3b82f6">
        <Percent className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/fractions",
    title: "Fractions & Ratios",
    description: "Reduce, fraction ⇄ decimal, percent conversion.",
    icon: (
      <IconBadge bg="rgba(139,92,246,0.14)" fg="#8b5cf6">
        <Slash className="h-5 w-5" />
      </IconBadge>
    ),
  },
  {
    to: "/math/everyday-math",
    title: "Everyday Math",
    description: "Average, proportion (regra de 3), ratio, etc.",
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
            <div className="max-w-6xl mx-auto px-4">
              {/* Back azul à esquerda (volta para a Home se não houver histórico) */}
              <div className="mb-6 flex justify-start">
                <BackButton fallback="/" className="!px-3 !py-1.5" />
              </div>

              {/* Título/subtítulo centralizados com as cores SKN */}
              <div className="text-center">
                <h1 className="skn-title text-4xl font-bold mb-3">
                  Math & Algebra Calculators
                </h1>
                <p className="skn-sub text-lg max-w-3xl mx-auto">
                  Choose a hub to explore focused mini-tools and calculators.
                </p>
              </div>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4">
            {HUBS.map((hub) => (
              <Link key={hub.to} to={hub.to} className="group block">
                <Card className="bg-card border border-border/50 hover:shadow-soft hover:-translate-y-0.5 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {hub.icon}
                      <div className="min-w-0">
                        <div className="text-base font-semibold mb-1 skn-title">
                          {hub.title}
                        </div>
                        <div className="text-sm skn-sub">
                          {hub.description}
                        </div>
                      </div>
                    </div>
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
