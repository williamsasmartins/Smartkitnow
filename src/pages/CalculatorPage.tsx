import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CalculatorFooter } from "@/components/CalculatorFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";

/**
 * 1) Registre aqui cada calculadora pelo SLUG (calculator param da URL)
 *    Ex.: /construction/concrete-masonry-calculators/concrete-slab  -> "concrete-slab"
 */
const ConcreteSlab = lazy(() => import("@/components/calculators/ConcreteSlab"));

const REGISTRY: Record<
  string,
  {
    Component: React.LazyExoticComponent<() => JSX.Element>;
    name: string;      // Título exibido na página
    category: string;  // Category raiz (construction, etc.)
  }
> = {
  "concrete-slab": {
    Component: ConcreteSlab,
    name: "Concrete Slab — Volume & Bags",
    category: "construction",
  },
  // adicione novas calculadoras aqui:
  // "drywall-area-sheets": { Component: DrywallAreaSheets, name: "Drywall — Area & Sheets", category: "construction" },
};

/** Helper: transforma "concrete-masonry-calculators" -> "Concrete Masonry Calculators" */
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

  // Agora usamos os PARAMS da rota em vez de depender de location.state
  const { subcategory, calculator } = useParams<{ subcategory: string; calculator: string }>();

  // Entra no registro para achar o componente
  const entry = calculator ? REGISTRY[calculator] : undefined;
  const subCategoryTitle = titleCaseFromSlug(subcategory);

  // Descobre a "category" a partir do caminho atual (primeiro segmento após "/")
  // Ex.: "/construction/..." -> "construction"
  const categoryFromPath = location.pathname.split("/")[1] || entry?.category || "construction";

  // Se o slug não existir no registro, mostra "not found" amigável
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
            <Button onClick={() => navigate(`/${categoryFromPath}/${subcategory ?? ""}`)}>
              Back to {subCategoryTitle || "subcategory"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleGoBack = () => {
    // Volta para a subcategoria se existir, senão para a raiz da categoria
    if (subcategory) {
      navigate(`/${categoryFromPath}/${subcategory}`);
    } else {
      navigate(`/${categoryFromPath}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          {/* Botão Voltar */}
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

            {/* Cabeçalho da calculadora */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {entry?.name ?? "Calculator"}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Category: {titleCaseFromSlug(categoryFromPath)}{subcategory ? ` · ${subCategoryTitle}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo da calculadora */}
          {entry ? (
            <Suspense fallback={
              <div className="mx-auto max-w-3xl px-4 py-10 text-center">Loading…</div>
            }>
              <entry.Component />
            </Suspense>
          ) : (
            NotFoundCalc
          )}

          {/* Rodapé explicativo/SEO-friendly (genérico) */}
          <CalculatorFooter
            calculatorName={entry?.name ?? "Calculator"}
            description={
              entry
                ? `This tool estimates key values for ${entry.name.toLowerCase()}. Enter your project dimensions and review the results before purchasing materials or scheduling work.`
                : "This tool estimates key values. Enter your project dimensions and review the results before purchasing materials or scheduling work."
            }
            formula={
              entry?.name?.toLowerCase().includes("concrete slab")
                ? "Volume = Length × Width × Thickness (converted to yd³ or m³); Bags ≈ Volume(ft³) ÷ bag yield."
                : "Result = (Variable1 × Variable2) / Constant"
            }
            sources={[
              { title: "ASTM C94 / Ready-Mixed Concrete", url: "https://www.astm.org" },
              { title: "ACI Concrete Fundamentals", url: "https://www.concrete.org" },
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
