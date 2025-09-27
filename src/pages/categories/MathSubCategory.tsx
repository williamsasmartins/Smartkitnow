import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MathSubCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subcategory } = useParams<{ subcategory: string }>();

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Catálogo local — espelha o de MathCalculators
  const catalog = [
    {
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

  // 1) tenta pelo state (quando veio do clique da categoria)
  const stateSub = location.state?.subCategory as
    | { title: string; calculators: { key: string; name: string }[] }
    | undefined;

  // 2) se não tiver state, resolve pelo slug na URL
  let resolved = stateSub;
  if (!resolved && subcategory) {
    resolved = catalog.find((c) => slugify(c.title) === subcategory);
  }

  // 3) se nada encontrado, volta para /math
  if (!resolved) {
    navigate("/math");
    return null;
  }

  const handleBackClick = () => navigate("/math");

  const handleCalculatorClick = (calc: { key: string; name: string }) => {
    const subSlug = slugify(resolved!.title);
    const calcSlug = slugify(calc.name);
    navigate(`/math/${subSlug}/calculator/${calcSlug}`, {
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
            Back to Math
          </Button>

          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10">
              <Calculator className="h-8 w-8 text-primary" />
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

export default MathSubCategory;
