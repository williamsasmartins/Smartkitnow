import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CookingSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory } = useParams<{ subcategory: string }>();

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Catálogo local — deve espelhar o de CookingCalculators
  const catalog = [
    {
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

  // 1) tenta vir pelo state (clique na categoria)
  const stateSub = location.state?.subCategory as
    | { title: string; calculators: { key: string; name: string }[] }
    | undefined;

  // 2) senão, resolve pelo slug da URL
  let resolved = stateSub;
  if (!resolved && subcategory) {
    resolved = catalog.find((c) => slugify(c.title) === subcategory);
  }

  // 3) se não achar, volta para /cooking
  if (!resolved) {
    navigate("/cooking");
    return null;
  }

  const handleBackClick = () => navigate("/cooking");

  const handleCalculatorClick = (calc: { key: string; name: string }) => {
    const subSlug = slugify(resolved!.title);
    const calcSlug = slugify(calc.name);
    navigate(`/cooking/${subSlug}/calculator/${calcSlug}`, {
      state: {
        calculator: calc,
        subCategory: resolved!.title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="pt-20">
        <section className="container mx-auto px-4 py-8 max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cooking
          </Button>

          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {resolved.title}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                Choose a calculator below to continue.
              </p>
            </div>
            <Badge variant="secondary">{resolved.calculators.length} tools</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolved.calculators.map((calculator) => (
              <Card
                key={calculator.key}
                className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/60 cursor-pointer"
                onClick={() => handleCalculatorClick(calculator)}
              >
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-3 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-center group-hover:text-primary transition-colors">
                    {calculator.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground text-center">
                    Specialized calculator for precise cooking conversions
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    Use Calculator
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookingSubCategory;
