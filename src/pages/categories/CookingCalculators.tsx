import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Calculator } from "lucide-react";

const CookingCalculators = () => {
  const navigate = useNavigate();

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // === CATEGORIAS DE EXEMPLO (ajuste conforme seus componentes disponíveis) ===
  const cookingCategories = [
    {
      id: "recipe-tools",
      title: "Recipe Tools",
      description:
        "Scale recipes, plan portions and adjust servings effortlessly.",
      calculators: [
        { key: "recipe-scale-conversion", name: "Recipe Scale Conversion" },
        { key: "servings-planner", name: "Servings Planner" },
        { key: "ingredient-portion", name: "Ingredient Portion Calculator" },
      ],
    },
    {
      id: "oven-and-air-fryer",
      title: "Oven & Air Fryer",
      description:
        "Convert oven temperatures and adapt oven recipes to air fryer.",
      calculators: [
        { key: "oven-temperature-conversion", name: "Oven Temperature Conversion" },
        { key: "oven-to-air-fryer", name: "Oven to Air Fryer Conversion" },
        { key: "cooking-time-converter", name: "Cooking Time Converter" },
      ],
    },
    {
      id: "ingredient-conversions",
      title: "Ingredient Conversions",
      description:
        "Converta medidas de cozinha: xícaras, colheres, gramas e mL.",
      calculators: [
        { key: "cups-to-grams", name: "Cups to Grams Converter" },
        { key: "grams-to-ml", name: "Grams to mL Converter" },
        { key: "tablespoons-to-cups", name: "Tablespoons to Cups Converter" },
      ],
    },
  ];

  const handleCategoryClick = (
    category: (typeof cookingCategories)[number]
  ) => {
    const subSlug = slugify(category.title);
    navigate(`/cooking/${subSlug}`, {
      state: {
        subCategory: {
          title: category.title,
          calculators: category.calculators,
        },
      },
    });
  };

  const handleCalculatorClick = (
    category: (typeof cookingCategories)[number],
    calculator: { key: string; name: string }
  ) => {
    const subSlug = slugify(category.title);
    const calcSlug = slugify(calculator.name);
    navigate(`/cooking/${subSlug}/calculator/${calcSlug}`, {
      state: {
        calculator,
        subCategory: category.title,
      },
    });
  };

  const handleBackClick = () => navigate("/");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cooking Calculators
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Simplifique receitas, ajuste porções e converta unidades de
              cozinha com ferramentas rápidas e precisas.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {cookingCategories.map((category) => (
              <div key={category.id}>
                <Card className="bg-card/30 border-border/30 mb-6">
                  <CardHeader
                    className="cursor-pointer group"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary transition-colors">
                      <div className="p-2 rounded-lg bg-gradient-primary/10">
                        <ChefHat className="h-5 w-5 text-primary" />
                      </div>
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.calculators.map((calculator) => (
                    <Card
                      key={calculator.key}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                      onClick={() => handleCalculatorClick(category, calculator)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-3 p-2 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors w-fit">
                          <Calculator className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                          {calculator.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          Specialized calculator for precise cooking conversions
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CookingCalculators;
