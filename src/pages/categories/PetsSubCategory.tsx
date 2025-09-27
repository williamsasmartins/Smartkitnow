import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Users, ChefHat, Star } from "lucide-react";
import { useMemo } from "react";
import { recipeData } from "@/data/recipeData"; // se não usar, pode remover

// Tipos auxiliares
type CalcItem = { key: string; name: string };
type SubCategoryState = {
  title: string;
  calculators: ReadonlyArray<CalcItem>; // <- aceita readonly
  icon?: React.ComponentType<any>;
  description?: string;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function PetsSubCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory } = useParams();

  // pega o state vindo da navegação
  const subCategory = location.state?.subCategory as SubCategoryState | undefined;

  // fallback: se veio só o slug pela URL, tenta montar um título bonitinho
  const categoryTitle =
    subCategory?.title ||
    (subcategory
      ? subcategory
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "");

  // Se não tiver state, voltamos para a página /pets
  if (!subCategory) {
    navigate("/pets");
    return null;
  }

  // Como o array é Readonly, se você precisar mutar/ordenar, crie uma cópia:
  const calculators = useMemo(
    () => [...subCategory.calculators],
    [subCategory.calculators]
  );

  const handleBackClick = () => {
    navigate("/pets");
  };

  const handleCalculatorClick = (calculator: CalcItem) => {
    const calcSlug = slugify(calculator.name);
    const subSlug = slugify(subCategory.title);

    navigate(`/pets/${subSlug}/calculator/${calcSlug}`, {
      state: {
        calculator,
        subCategory: subCategory.title,
      },
    });
  };

  // Badge de dificuldade — se não usar, remova tudo relacionado
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            Back to Pets
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {categoryTitle}
            </h1>
            {subCategory.description ? (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {subCategory.description}
              </p>
            ) : (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore our curated calculators and tools for {categoryTitle.toLowerCase()}.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calculator, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-card"
              onClick={() => handleCalculatorClick(calculator)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {calculator.name}
                  </CardTitle>
                </div>
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
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
