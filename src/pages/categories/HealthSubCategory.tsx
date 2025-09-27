import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HealthSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory } = useParams<{ subcategory: string }>();

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Catálogo local (igual ao usado em HealthCalculators)
  const catalog = [
    {
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

  // 1) Tenta vir pelo state (quando usuário clicou na categoria)
  const stateSub = location.state?.subCategory as
    | { title: string; calculators: { key: string; name: string }[] }
    | undefined;

  // 2) Se não houver state, tenta resolver pelo slug da URL
  let resolved = stateSub;
  if (!resolved && subcategory) {
    resolved = catalog.find((c) => slugify(c.title) === subcategory);
  }

  // 3) Se nada encontrado, volta para /health
  if (!resolved) {
    navigate("/health");
    return null;
  }

  const handleBackClick = () => navigate("/health");

  const handleCalculatorClick = (calc: { key: string; name: string }) => {
    const subSlug = slugify(resolved!.title);
    const calcSlug = slugify(calc.name);
    navigate(`/health/${subSlug}/calculator/${calcSlug}`, {
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
          {/* Voltar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Health
          </Button>

          {/* Título da subcategoria */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
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

          {/* Lista de calculadoras */}
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
                    Specialized calculator for precise calculations
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

export default HealthSubCategory;
