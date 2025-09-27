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
import { ArrowLeft, Heart, Calculator } from "lucide-react";

const HealthCalculators = () => {
  const navigate = useNavigate();

  // helper para slugs
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // === CATÁLOGO DE SUBCATEGORIAS (ajuste livre) ===
  const healthCategories = [
    {
      id: "body-measurement-calculators",
      title: "Body Measurement Calculators",
      description:
        "Body metrics: BMI, body fat, ideal weight, lean mass, and more.",
      calculators: [
        { key: "bmi", name: "BMI Calculator" },
        { key: "body-fat", name: "Body Fat Calculator" },
        { key: "ideal-body-weight", name: "Ideal Body Weight Calculator" },
        { key: "lean-body-mass", name: "Lean Body Mass Calculator" },
        { key: "waist-to-hip-ratio", name: "Waist-to-Hip Ratio Calculator" },
        { key: "height-converter", name: "Height Converter" },
      ],
    },
    {
      id: "dietary-and-nutrition-calculators",
      title: "Dietary and Nutrition Calculators",
      description:
        "Daily calories, macros, water intake, protein intake, BMR and TDEE.",
      calculators: [
        { key: "bmr", name: "BMR Calculator" },
        { key: "tdee", name: "TDEE Calculator" },
        { key: "calorie-intake", name: "Calorie Intake Calculator" },
        { key: "macro", name: "Macro Calculator" },
        { key: "water-intake", name: "Water Intake Calculator" },
        { key: "protein-intake", name: "Protein Intake Calculator" },
      ],
    },
    {
      id: "fitness-calculators",
      title: "Fitness Calculators",
      description:
        "Training metrics: calories burned, heart rate targets, 1RM, pace etc.",
      calculators: [
        { key: "calories-burned", name: "Calories Burned Calculator" },
        { key: "one-rep-max", name: "One-Rep Max Calculator" },
        { key: "target-heart-rate", name: "Target Heart Rate Calculator" },
        { key: "steps-to-calories", name: "Steps to Calories Calculator" },
        { key: "pace-distance", name: "Pace and Distance Calculator" },
        { key: "bench-press", name: "Bench Press Calculator" },
      ],
    },
  ];

  // Clicar na CATEGORIA
  const handleCategoryClick = (
    category: (typeof healthCategories)[number]
  ) => {
    const subcategorySlug = slugify(category.title);

    navigate(`/health/${subcategorySlug}`, {
      state: {
        subCategory: {
          title: category.title,
          calculators: category.calculators,
        },
      },
    });
  };

  // Clicar na CALCULADORA diretamente da página de categorias
  const handleCalculatorClick = (
    category: (typeof healthCategories)[number],
    calculator: { key: string; name: string }
  ) => {
    const subcategorySlug = slugify(category.title);
    const calculatorSlug = slugify(calculator.name);

    navigate(`/health/${subcategorySlug}/calculator/${calculatorSlug}`, {
      state: {
        calculator,
        subCategory: category.title,
      },
    });
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Voltar */}
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Health & Fitness Calculators
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Measure body metrics, plan nutrition, and track fitness goals with
              precise, easy-to-use tools.
            </p>
          </div>

          {/* Grid de categorias + itens */}
          <div className="space-y-12">
            {healthCategories.map((category) => (
              <div key={category.id}>
                <Card className="bg-card/30 border-border/30 mb-6">
                  <CardHeader
                    className="cursor-pointer group"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary transition-colors">
                      <div className="p-2 rounded-lg bg-gradient-primary/10">
                        <Heart className="h-5 w-5 text-primary" />
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
                      onClick={() =>
                        handleCalculatorClick(category, calculator)
                      }
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-3 p-2 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors w-fit">
                          <Calculator className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                          {calculator.name}
                        </CardTitle>
                      </CardHeader>
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

export default HealthCalculators;
