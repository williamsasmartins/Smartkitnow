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
import { ArrowLeft, Calculator } from "lucide-react";

const MathCalculators = () => {
  const navigate = useNavigate();

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // === CATEGORIAS DE EXEMPLO (ajuste livre conforme seus componentes/registry) ===
  const mathCategories = [
    {
      id: "algebra",
      title: "Algebra Calculators",
      description:
        "Linear equations, quadratic equations, factorization, proportions and more.",
      calculators: [
        { key: "linear-equation", name: "Linear Equation Solver" },
        { key: "quadratic-equation", name: "Quadratic Equation Solver" },
        { key: "percentage", name: "Percentage Calculator" },
        { key: "proportion", name: "Proportion Calculator" },
      ],
    },
    {
      id: "geometry",
      title: "Geometry Calculators",
      description:
        "Areas, perimeters, volumes, circles, triangles, rectangles and solids.",
      calculators: [
        { key: "circle-area", name: "Circle Area Calculator" },
        { key: "triangle-area", name: "Triangle Area Calculator" },
        { key: "rectangle-perimeter", name: "Rectangle Perimeter Calculator" },
        { key: "sphere-volume", name: "Sphere Volume Calculator" },
      ],
    },
    {
      id: "trigonometry",
      title: "Trigonometry Calculators",
      description:
        "Sine, cosine, tangent, right triangle sides and angle conversions.",
      calculators: [
        { key: "right-triangle", name: "Right Triangle Calculator" },
        { key: "sine-cosine-tangent", name: "Sin/Cos/Tan Calculator" },
        { key: "deg-to-rad", name: "Degrees to Radians" },
        { key: "rad-to-deg", name: "Radians to Degrees" },
      ],
    },
    {
      id: "statistics",
      title: "Statistics Calculators",
      description:
        "Mean, median, mode, standard deviation and basic descriptive stats.",
      calculators: [
        { key: "mean-median-mode", name: "Mean / Median / Mode" },
        { key: "standard-deviation", name: "Standard Deviation Calculator" },
        { key: "z-score", name: "Z-Score Calculator" },
      ],
    },
  ];

  const handleCategoryClick = (
    category: (typeof mathCategories)[number]
  ) => {
    const subSlug = slugify(category.title);
    navigate(`/math/${subSlug}`, {
      state: {
        subCategory: {
          title: category.title,
          calculators: category.calculators,
        },
      },
    });
  };

  const handleCalculatorClick = (
    category: (typeof mathCategories)[number],
    calculator: { key: string; name: string }
  ) => {
    const subSlug = slugify(category.title);
    const calcSlug = slugify(calculator.name);
    navigate(`/math/${subSlug}/calculator/${calcSlug}`, {
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
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Math & Algebra Calculators
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Mathematical calculations from basic arithmetic to algebra,
              geometry, trigonometry and statistics.
            </p>
          </div>

          <div className="space-y-12">
            {mathCategories.map((category) => (
              <div key={category.id}>
                <Card className="bg-card/30 border-border/30 mb-6">
                  <CardHeader
                    className="cursor-pointer group"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary transition-colors">
                      <div className="p-2 rounded-lg bg-gradient-primary/10">
                        <Calculator className="h-5 w-5 text-primary" />
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

export default MathCalculators;
