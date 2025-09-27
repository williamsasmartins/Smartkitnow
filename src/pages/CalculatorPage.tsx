// no topo do arquivo (deixe seus imports existentes)
import React, { Suspense, lazy, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";

/**
 * AUTO-REGISTRY de calculadoras
 * - Descobre todos os arquivos em src/components/calculators/**\/*.tsx
 * - Converte o nome do arquivo para um slug (kebab-case)
 * - Carrega via lazy() a calculadora correspondente ao :calculator da URL
 */
const modules = import.meta.glob("@/components/calculators/**/*.tsx");

// Converte "ConcreteSlab" -> "concrete-slab", "TVHeightCalculator" -> "tv-height-calculator"
function kebabFromPascal(fileBase: string) {
  return fileBase
    .replace(/\.tsx$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

// Lista de arquivos que NÃO são calculadoras “unitárias” (são listas, grupos, etc.)
// Excluímos para não virar rota por engano.
const EXCLUDES = [
  "Calculators",   // ...Calculators.tsx (listas)
  "SubCategory",   // ...SubCategory.tsx
];

// Mapa opcional de "slug -> título bonito" (só para ajustar nomes exibidos)
const FRIENDLY_TITLES: Record<string, string> = {
  "concrete-slab": "Concrete Slab — Volume & Bags",
  "drywall-area-sheets": "Drywall — Area & Sheets",
  "calories-to-kilograms-calculator": "Calories to Kilograms Calculator",
  // adicione títulos bonitos aqui se quiser customizar
};

// Constrói o índice: slug -> loader (função que importa o módulo)
const slugToLoader: Record<string, (() => Promise<any>)> = (() => {
  const entries: Record<string, (() => Promise<any>)> = {};

  Object.entries(modules).forEach(([path, loader]) => {
    const base = path.split("/").pop() || "";
    // pula arquivos de lista/subcategoria/etc
    if (EXCLUDES.some((marker) => base.includes(marker))) return;

    const slug = kebabFromPascal(base);
    // também aceitamos variações: com e sem "-calculator"
    const withCalc = slug.endsWith("-calculator") ? slug : `${slug}-calculator`;
    const withoutCalc = slug.replace(/-calculator$/i, "");

    // registra ambas as chaves apontando para o mesmo loader
    entries[withCalc] = loader as any;
    entries[withoutCalc] = loader as any;
  });

  return entries;
})();

// Helper: "concrete-masonry-calculators" -> "Concrete Masonry Calculators"
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
  const { subcategory, calculator } = useParams<{ subcategory?: string; calculator?: string }>();

  // Descobre category a partir do path (1º segmento) — igual você já fazia
  const categoryFromPath = location.pathname.split("/")[1] || "construction";
  const subCategoryTitle = titleCaseFromSlug(subcategory);

  // Encontra o loader pela slug e cria um componente lazy para render
  const LazyComp = useMemo(() => {
    if (!calculator) return null;
    const loader = slugToLoader[calculator];
    if (!loader) return null;
    return lazy(async () => {
      const mod = await loader();
      // garante default
      return mod.default ? mod : { default: mod[Object.keys(mod)[0]] };
    });
  }, [calculator]);

  const displayName = useMemo(() => {
    if (!calculator) return "Calculator";
    return FRIENDLY_TITLES[calculator] || titleCaseFromSlug(calculator);
  }, [calculator]);

  const handleGoBack = () => {
    if (subcategory) {
      navigate(`/${categoryFromPath}/${subcategory}`);
    } else {
      navigate(`/${categoryFromPath}`);
    }
  };

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
            <Button
              onClick={() =>
                navigate(
                  subcategory
                    ? `/${categoryFromPath}/${subcategory}`
                    : `/${categoryFromPath}`
                )
              }
            >
              Back to {subCategoryTitle || titleCaseFromSlug(categoryFromPath)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          {/* Back */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {displayName}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Category: {titleCaseFromSlug(categoryFromPath)}
                  {subcategory ? ` · ${subCategoryTitle}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {LazyComp ? (
            <Suspense
              fallback={
                <div className="mx-auto max-w-3xl px-4 py-10 text-center">
                  Loading…
                </div>
              }
            >
              <LazyComp />
            </Suspense>
          ) : (
            NotFoundCalc
          )}

          {/* Footer SEO/refs genérico */}
          <CalculatorFooter
            calculatorName={displayName}
            description={`This tool estimates key values for ${displayName.toLowerCase()}. Enter your inputs and review the results before making decisions.`}
            formula={"Result = (Variable1 × Variable2) / Constant"}
            sources={[
              { title: "NIST Engineering Handbook", url: "https://www.nist.gov" },
            ]}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorPage;
