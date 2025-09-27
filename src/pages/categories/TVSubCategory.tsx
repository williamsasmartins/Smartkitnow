import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor } from "lucide-react";
import { useMemo } from "react";

// Tipos auxiliares
type CalcItem = { key: string; name: string };
type SubCategoryState = {
  title: string;
  calculators: ReadonlyArray<CalcItem>; // aceita arrays readonly
  icon?: React.ComponentType<any>;
  description?: string;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function TVSubCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory } = useParams();

  // state vindo da navegação a partir de TVCalculators
  const subCategory = location.state?.subCategory as SubCategoryState | undefined;

  // Fallback apenas para exibir o título formatado se vier só pela URL
  const categoryTitle =
    subCategory?.title ||
    (subcategory
      ? subcategory
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "");

  // Se não houver state, volta para /tv
  if (!subCategory) {
    navigate("/tv");
    return null;
  }

  // Cria cópia mutável se você precisar ordenar/filtrar sem erro do TS
  const calculators = useMemo(
    () => [...subCategory.calculators],
    [subCategory.calculators]
  );

  const handleBackClick = () => {
    navigate("/tv");
  };

  const handleCalculatorClick = (calculator: CalcItem) => {
    const subSlug = slugify(subCategory.title);
    const calcSlug = slugify(calculator.name);

    navigate(`/tv/${subSlug}/calculator/${calcSlug}`, {
      state: {
        calculator,
        subCategory: subCategory.title,
      },
    });
  };

  const Icon = subCategory.icon ?? Monitor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-muted rounded-lg mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to TV Calculators
          </button>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {categoryTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {subCategory.description ??
                `Explore our curated calculators and tools for ${categoryTitle.toLowerCase()}.`}
            </p>
          </div>
        </div>

        {/* Lista de calculadoras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator, idx) => (
            <Card
              key={idx}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card"
              onClick={() => handleCalculatorClick(calculator)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {calculator.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Specialized calculator for {categoryTitle.toLowerCase()}.
                </p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full">Use Calculator</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {calculators.length === 0 && (
          <div className="text-center py-12">
            <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Calculators Found
            </h3>
            <p className="text-muted-foreground">
              We're working on adding calculators for this category. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
