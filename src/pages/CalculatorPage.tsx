// src/pages/CalculatorPage.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { Suspense, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { getEntry, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import CalculatorLayout from "@/components/layouts/CalculatorLayout";
import SEOHead from "@/components/SEOHead";
import { PALETTE } from "@/components/theme/palette";

/** Carrega um componente dinamicamente a partir do entry do registry */
function lazyFrom(entry?: { loader: () => Promise<any>; namedExport?: string }) {
  if (!entry) return null;
  return React.lazy(async () => {
    const mod = await entry.loader();
    const Comp =
      (entry.namedExport ? (mod as any)[entry.namedExport] : (mod as any).default) as React.ComponentType<any>;
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

/** Transforma slug em Title Case simples */
function titleCaseFromSlug(slug?: string) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, subcategory, slug } = useParams<{
    category: string;
    subcategory: string;
    slug: string;
  }>();

  // slug da calculadora vem da rota curta "/:category/:subcategory/:slug"
  const calcSlug = slug;
  const entry = getEntry(calcSlug);

  // fallback para category/subcategory a partir da URL caso o registry não informe
  const categoryFromPath =
    location.pathname.split("/")[1] || entry?.category || "construction";
  const subCategoryTitle = subcategory ? titleCaseFromSlug(subcategory) : undefined;

  const handleGoBack = () => {
    if (subcategory) navigate(`/${categoryFromPath}/${subcategory}`);
    else navigate(`/${categoryFromPath}`);
  };

  const LazyComp = useMemo(() => lazyFrom(entry), [entry]);

  // SEO defaults
  const calcName = entry?.name ?? "Calculator";
  const catTitle =
    FRIENDLY_TITLES[entry?.category ?? categoryFromPath] ??
    titleCaseFromSlug(entry?.category ?? categoryFromPath);

  const pageTitle = `${calcName} - Smart Kit Now`;
  const pageDesc =
    entry?.description ??
    `Use the ${calcName} to estimate and analyze values with professional-grade accuracy. Includes how-to, examples and references.`;

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
              Back to{" "}
              {subCategoryTitle ||
                FRIENDLY_TITLES[categoryFromPath] ||
                titleCaseFromSlug(categoryFromPath)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={pageTitle}
        description={pageDesc}
        keywords={[
          calcName.toLowerCase(),
          `${categoryFromPath} calculator`,
          subcategory || "",
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

      <main className="pt-20">
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
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>

                {/* Título e subtítulo nas cores padrão do site */}
                <h1
                  className="text-4xl font-bold mb-2"
                  style={{ color: "#5c82ee" }}
                >
                  {calcName}
                </h1>

                <p
                  className="mt-2 text-lg"
                  style={{ color: "#747886" }}
                >
                  Category: {catTitle}
                  {subcategory ? ` · ${titleCaseFromSlug(subcategory)}` : ""}
                </p>
              </div>
            </div>

            {/* Calculadora */}
            {entry && LazyComp ? (
              <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 text-center">Loading…</div>}>
                <LazyComp />
              </Suspense>
            ) : (
              NotFoundCalc
            )}
          </section>

          {/* Seções SEO minimalistas (pode personalizar depois) */}
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
                  <li><a className="text-primary underline" href="/construction">Construction Calculators</a></li>
                  <li><a className="text-primary underline" href="/health">Health & Fitness Calculators</a></li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Rodapé explicativo/SEO-friendly */}
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
              sources={[
                { title: "ASTM / ACI (when applicable)", url: "https://www.astm.org" },
                { title: "NIST Engineering Handbook", url: "https://www.nist.gov" },
              ]}
            />
          </section>
        </CalculatorLayout>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorPage;
