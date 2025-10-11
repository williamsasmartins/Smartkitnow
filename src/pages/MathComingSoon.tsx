import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Ruler, Sigma, Pi } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

type CardDef = {
  to: string;
  title: string;
  desc: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  bubbleBg: string; // rgba background
  bubbleFg: string; // icon color
};

const CARDS: CardDef[] = [
  {
    to: "/math/fractions-percent",
    title: "Fractions & Percent",
    desc:
      "Fraction reducer, decimal ↔ fraction, percent change, ratio simplifier, and more.",
    Icon: Calculator,
    bubbleBg: "rgba(59,130,246,0.18)",
    bubbleFg: "#3b82f6",
  },
  {
    to: "/math/geometry-shapes",
    title: "Geometry & Shapes",
    desc:
      "Area, perimeter, circumference, surface area and volume — with diagrams and formulas.",
    Icon: Ruler,
    bubbleBg: "rgba(16,185,129,0.18)",
    bubbleFg: "#10b981",
  },
  {
    to: "/math/statistics",
    title: "Statistics",
    desc:
      "Mean/median/mode, standard deviation, confidence intervals, z-score, t-test, and more.",
    Icon: Sigma,
    bubbleBg: "rgba(234,179,8,0.18)",
    bubbleFg: "#eab308",
  },
  {
    to: "/math/algebra-trig",
    title: "Algebra & Trig",
    desc:
      "Linear forms, quadratic formula, triangle solvers, unit circle, and trig functions.",
    Icon: Pi,
    bubbleBg: "rgba(168,85,247,0.18)",
    bubbleFg: "#a855f7",
  },
];

export default function MathComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Math & Algebra Calculators · Smart Kit Now"
        description="We're preparing a full suite of math tools — fractions, geometry, statistics, trigonometry, and more. Clean UI, solid formulas, and SEO-first pages."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Math & Algebra Calculators", url: "https://www.smartkitnow.com/math" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Math & Algebra Calculators",
          url: "https://www.smartkitnow.com/math",
          description:
            "Preview of the Math hub with fractions, geometry, statistics and algebra sections.",
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
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                  Math & Algebra Calculators
                </h1>
                <p className="text-lg max-w-3xl mx-auto" style={{ color: "#747886" }}>
                  We’re preparing a full suite of math tools — fractions, geometry, statistics,
                  trigonometry, and more. Clean UI, solid formulas, and SEO-first pages.
                </p>
              </div>
            </div>
          }
          showRails={false}
          showTopBanner={false}
          showBottomBanner={false}
        >
          {/* GRID of subcategories — now CLICKABLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CARDS.map(({ to, title, desc, Icon, bubbleBg, bubbleFg }) => (
              <Card key={to} className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                <CardHeader className="flex flex-row items-start gap-3">
                  <span
                    className="inline-flex shrink-0 items-center justify-center rounded-xl"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: bubbleBg,
                      color: bubbleFg,
                    }}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                      <CalculatorLink to={to}>{title}</CalculatorLink>
                    </CardTitle>
                    <p className="mt-1 text-sm" style={{ color: "#747886" }}>
                      {desc}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <span
                    className="text-xs opacity-80 group-hover:opacity-100"
                    style={{ color: "#747886" }}
                  >
                    Coming soon — click to preview the section path
                  </span>
                </CardContent>
              </Card>
            ))}
+           </div>

           {/* feedback block */}
           <div className="mt-8 text-center">
             <p className="text-sm" style={{ color: "#747886" }}>
               Want this section sooner? Tell us which calculators you need most via{" "}
               <CalculatorLink to="/contact">Contact</CalculatorLink>
               .
             </p>
           </div>
           {/* close PageWithRails children container */}
         </PageWithRails>
       </main>

       {/* AdSense policy: no footer banner ads on placeholder pages */}
       <Footer />
     </div>
   );
 }

 export const pageMeta = { allowAds: false, minContentScore: 1 };
