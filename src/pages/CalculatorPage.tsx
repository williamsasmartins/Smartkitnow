import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { Suspense, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { getEntry, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import { computeBackPath } from "@/lib/navigation";
import CalculatorLayout from "@/components/layouts/CalculatorLayout";
import SEOHead from "@/components/SEOHead";
import { PALETTE } from "@/components/theme/palette";

function lazyFrom(entry?: { loader: () => Promise<any>; namedExport?: string }) {
  if (!entry) return null;
  return React.lazy(async () => {
    const mod = await entry.loader();
    const Comp =
      (entry.namedExport ? mod[entry.namedExport] : mod.default) as React.ComponentType<any>;
    if (!Comp) {
      const first = mod && Object.values(mod)[0];
      if (!first || typeof first !== "function") {
        throw new Error("Component not found in module");
      }
      return { default: first as React.ComponentType<any> };
    }
    return { default: Comp };
  });
}

function titleCaseFromSlug(slug?: string) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const CalculatorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, subcategory, slug } = useParams<{
    category: string;
    subcategory: string;
    slug: string;
  }>();

  const [showInterstitial, setShowInterstitial] = useState(false);

  const calcSlug = slug;
  const entry = getEntry(calcSlug);

  const categoryFromPath =
    location.pathname.split("/")[1] || entry?.category || "construction";

  const handleGoBack = () => {
    // Exibe intersticial (placeholder) para simular o comportamento de anúncios de retorno
    setShowInterstitial(true);
  };

  const LazyComp = useMemo(() => lazyFrom(entry), [entry]);

  const NotFoundCalc = (
    <Card className="bg-card border-border/50">
      <CardContent className="p-8">
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Calculator className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Calculator not found</h3>
          <p className="text-muted-foreground">
            We couldn’t find this calculator. Please go back and choose another one.
          </p>
          <div className="mt-6">
            <Button onClick={handleGoBack}>
              Back
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // SEO defaults
  const calcName = entry?.name ?? "Calculator";
  const catTitle =
    FRIENDLY_TITLES[entry?.category ?? categoryFromPath] ??
    titleCaseFromSlug(entry?.category ?? categoryFromPath);

  const pageTitle = `${calcName} - Smart Kit Now`;
  const pageDesc =
    entry?.description ??
    `Use the ${calcName} to estimate and analyze values with professional-grade accuracy. Includes how-to, examples and references.`;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        keywords={[
          calcName.toLowerCase(),
          `${categoryFromPath} calculator`,
          "online calculator",
        ].filter(Boolean)}
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: catTitle, url: `https://www.smartkitnow.com/${categoryFromPath}` },
          ...(subcategory
            ? [
                {
                  name: titleCaseFromSlug(subcategory),
                  url: `https://www.smartkitnow.com/${categoryFromPath}/${subcategory}`,
                },
              ]
            : []),
          { name: calcName, url: typeof window !== "undefined" ? window.location.href : "" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: calcName,
          description: pageDesc,
          step: [
            { "@type": "HowToStep", name: "Enter inputs", text: "Fill in the required fields." },
            { "@type": "HowToStep", name: "Adjust options", text: "Set units and preferences." },
            { "@type": "HowToStep", name: "Calculate", text: "Press Calculate to see the results." },
          ],
        }}
      />

      <Header />

      <main className="pt-40 sm:pt-20">
        <CalculatorLayout>
          {/* Back + header */}
<section className="px-1 sm:px-0">
  <div className="mb-6">
    <Button
      variant="ghost"
      size="sm"
      onClick={handleGoBack}
      className="flex items-center space-x-2 mb-6 text-white hover:brightness-110"
      style={{ backgroundColor: PALETTE.brand.button }}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>

    <div className="flex flex-col items-center text-center space-y-3 mb-6">
  <span
    className="inline-flex items-center justify-center rounded-xl"
    style={{
      width: 44,
      height: 44,
      backgroundColor: "rgba(59,130,246,0.14)", // bg azul translúcido
      color: "#3b82f6",                          // ícone azul
    }}
    aria-hidden="true"
  >
    <Calculator className="h-5 w-5" />
  </span>

  {/* TÍTULO COM A COR PADRÃO DO SITE (mesma dos cards) */}
  <h1
    className="text-4xl font-bold leading-tight"
    style={{ color: "#5c82ee" }} // <- cor sólida padrão
  >
    {calcName}
  </h1>

  {/* Descrição logo abaixo do título (texto secundário) */}
  <p
    className="mt-2 text-lg"
    style={{ color: "#8b90a0" }} // tom neutro/secondary para descrição
  >
    {pageDesc}
  </p>
</div>

  </div>

  {/* calculadora / fallback */}
  {entry && LazyComp ? (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 text-center">Loading…</div>}>
      <LazyComp />
    </Suspense>
  ) : (
    NotFoundCalc
  )}
</section>


          {/* Seções auxiliares SEO (mantidas, já com cores corretas) */}
          <section className="mx-auto max-w-4xl my-10 grid gap-6">
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">How to Use</h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Enter the project inputs using the form fields.</li>
                  <li>Adjust units and options when available.</li>
                  <li>Review the calculated results and totals.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Glossary & Notes</h2>
                <p className="text-muted-foreground">
                  This calculator provides estimations for planning purposes. Always verify specifications and
                  local standards before purchasing materials.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Related Tools</h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>
                    <a className="text-primary underline" href={`/${categoryFromPath}`}>
                      See more in {FRIENDLY_TITLES[entry?.category ?? categoryFromPath] ?? titleCaseFromSlug(entry?.category ?? categoryFromPath)}
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Rodapé explicativo */}
          <section>
            <CalculatorFooter
              calculatorName={calcName}
              description={
                entry
                  ? `This tool estimates key values for ${calcName.toLowerCase()}. Enter your inputs and review the results before decisions.`
                  : "This tool estimates key values. Enter your inputs and review the results."
              }
              formula={
                entry?.name?.toLowerCase().includes("concrete")
                  ? "Volume = Length × Width × Thickness (converted to yd³ or m³); Bags ≈ Volume(ft³) ÷ bag yield."
                  : "Result = (Variable1 × Variable2) / Constant"
              }
              sources={(() => {
                const cat = (entry?.category ?? categoryFromPath) as string;
                const catTitleLocal = FRIENDLY_TITLES[cat] ?? titleCaseFromSlug(cat);
                switch (cat) {
                  case "health":
                    return [
                      { title: "World Health Organization (WHO)", url: "https://www.who.int" },
                      { title: "National Institutes of Health (NIH)", url: "https://www.nih.gov" },
                      { title: "Centers for Disease Control and Prevention (CDC)", url: "https://www.cdc.gov" },
                    ];
                  case "construction":
                    return [
                      { title: "ASTM / ACI (when applicable)", url: "https://www.astm.org" },
                      { title: "American Concrete Institute (ACI)", url: "https://www.concrete.org" },
                      { title: "NIST Engineering Handbook", url: "https://www.nist.gov" },
                    ];
                  case "electrical":
                    return [
                      { title: "IEEE Standards Association", url: "https://standards.ieee.org" },
                      { title: "National Electrical Code (NEC)", url: "https://www.nfpa.org/NEC" },
                    ];
                  case "math":
                    return [
                      { title: "Wolfram MathWorld", url: "https://mathworld.wolfram.com" },
                      { title: "Khan Academy - Math", url: "https://www.khanacademy.org/math" },
                    ];
                  case "cooking":
                    return [
                      { title: "USDA FoodData Central", url: "https://fdc.nal.usda.gov" },
                      { title: "FDA Food Safety", url: "https://www.fda.gov/food/food-safety" },
                    ];
                  default:
                    return [
                      { title: `${catTitleLocal} Resources`, url: `/${categoryFromPath}` },
                    ];
                }
              })()}
            />
          </section>
        </CalculatorLayout>
      </main>

      {/* Intersticial de anúncio (placeholder) */}
      {showInterstitial && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card border border-border/60 rounded-xl shadow-2xl max-w-xl w-[90%] p-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Ad Interstitial</h3>
            <p className="text-muted-foreground mb-4">Ad Space — Large Interstitial (placeholder)</p>
            <div className="bg-muted/30 rounded-lg h-48 flex items-center justify-center mb-6">
              <span className="text-muted-foreground">Google AdSense — Vignette/Interstitial</span>
            </div>
            <Button
              onClick={() => {
                setShowInterstitial(false);
                const backPath = computeBackPath(entry?.slug ?? slug ?? undefined, entry?.category ?? categoryFromPath);
                navigate(backPath);
              }}
              className="w-full"
            >
              Close and go back
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CalculatorPage;

