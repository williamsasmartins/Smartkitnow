// src/pages/CalculatorPage.tsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { Suspense, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator as CalcIcon } from "lucide-react";
import { getEntry, FRIENDLY_TITLES } from "@/data/calculatorRegistry";
import CalculatorLayout from "@/components/layouts/CalculatorLayout";
import SEOHead from "@/components/SEOHead";
import BackButton from "@/components/BackButton";

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

export default function CalculatorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, subcategory, slug } = useParams<{
    category: string;
    subcategory: string;
    slug: string;
  }>();

  const entry = getEntry(slug);
  const LazyComp = useMemo(() => lazyFrom(entry), [entry]);

  // Categoria “derivada” para breadcrumbs/voltar
  const categoryFromPath =
    location.pathname.split("/")[1] || entry?.category || "construction";

  const handleGoBack = () => {
    if (subcategory) navigate(`/${categoryFromPath}/${subcategory}`);
    else navigate(`/${categoryFromPath}`);
  };

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
          <CalcIcon className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold skn-title mb-2">Calculator not found</h3>
          <p className="skn-sub">
            We couldn’t find this calculator. Please go back and choose another one.
          </p>
          <div className="mt-6">
            <BackButton fallback={`/${categoryFromPath}`}>Back to {catTitle}</BackButton>
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
          {/* Barra superior: Back à ESQUERDA (azul), Título/descrição CENTRALIZADOS */}
          <section className="px-1 sm:px-0">
            {/* Back alinhado à esquerda */}
            <div className="mb-6 flex items-center justify-start">
              <BackButton fallback={subcategory ? `/${categoryFromPath}/${subcategory}` : `/${categoryFromPath}`}>
  Back
</BackButton>

            </div>

            {/* Título e descrição centralizados com cores fixas */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <span
                className="inline-flex items-center justify-center rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: "rgba(59,130,246,0.14)",
                  color: "#3b82f6",
                }}
                aria-hidden="true"
              >
                <CalcIcon className="h-5 w-5" />
              </span>

              <h1 className="text-4xl font-bold leading-tight skn-title">
                {calcName}
              </h1>

              <p className="mt-2 text-lg skn-sub">
                {pageDesc}
              </p>
            </div>

            {/* Calculadora ou fallback */}
            {entry && LazyComp ? (
              <Suspense
                fallback={
                  <div className="mx-auto max-w-3xl px-4 py-10 text-center skn-sub">
                    Loading…
                  </div>
                }
              >
                <LazyComp />
              </Suspense>
            ) : (
              NotFoundCalc
            )}
          </section>

          {/* Seções auxiliares SEO (mantidas) */}
          <section className="mx-auto max-w-4xl my-10 grid gap-6">
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold skn-title mb-2">How to Use</h2>
                <ul className="list-disc pl-5 skn-sub space-y-1 text-left">
                  <li>Enter the project inputs using the form fields.</li>
                  <li>Adjust units and options when available.</li>
                  <li>Review the calculated results and totals.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold skn-title mb-2">Glossary & Notes</h2>
                <p className="skn-sub">
                  This calculator provides estimations for planning purposes. Always verify specifications and
                  local standards before purchasing materials.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold skn-title mb-2">Related Tools</h2>
                <ul className="list-disc pl-5 skn-sub space-y-1 text-left">
                  <li><a className="underline" href="/construction">Construction Calculators</a></li>
                  <li><a className="underline" href="/health">Health & Fitness Calculators</a></li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </CalculatorLayout>
      </main>

      <Footer />
    </div>
  );
}
