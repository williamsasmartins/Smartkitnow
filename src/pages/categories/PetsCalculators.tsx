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
import { ArrowLeft, Dog, Cat, Fish, Calculator } from "lucide-react";

const PetsCalculators = () => {
  const navigate = useNavigate();

  // Slug consistente para subcategorias
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // MUITO IMPORTANTE:
  // As chaves "key" abaixo DEVEM ser exatamente os nomes esperados pelo PetsCalculatorPage:
  // CatAgeCalculator, DogAgeCalculator, DogCalorieCalculator,
  // AquariumVolumeCalculator, AquariumWeightCalculator
  const petsCategories = [
    {
      id: "dogs",
      title: "Dogs",
      description: "Age & calorie tools tailored for dogs.",
      icon: Dog,
      calculators: [
        { key: "DogAgeCalculator", name: "Dog Age Calculator" },
        { key: "DogCalorieCalculator", name: "Dog Calorie Calculator" },
      ],
    },
    {
      id: "cats",
      title: "Cats",
      description: "Estimate your cat’s age and life stage.",
      icon: Cat,
      calculators: [{ key: "CatAgeCalculator", name: "Cat Age Calculator" }],
    },
    {
      id: "aquariums",
      title: "Aquariums",
      description: "Volume & weight estimations for tanks.",
      icon: Fish,
      calculators: [
        { key: "AquariumVolumeCalculator", name: "Aquarium Volume Calculator" },
        { key: "AquariumWeightCalculator", name: "Aquarium Weight Calculator" },
      ],
    },
  ];

  const handleCategoryClick = (
    category: (typeof petsCategories)[number]
  ) => {
    const subSlug = slugify(category.title);
    navigate(`/pets/${subSlug}`, {
      state: {
        subCategory: {
          title: category.title,
          calculators: category.calculators,
        },
      },
    });
  };

  // Clique direto na calculadora a partir da página de categorias
  // OBS: aqui o parâmetro :calculator DEVE ser o key exato (ex.: DogAgeCalculator)
  const handleCalculatorClick = (
    category: (typeof petsCategories)[number],
    calculator: { key: string; name: string }
  ) => {
    const subSlug = slugify(category.title);
    navigate(`/pets/${subSlug}/calculator/${calculator.key}`, {
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Pet Care Calculators
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mt-3">
              Pet health, nutrition, and care tools for dogs, cats, and aquariums.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-12">
            {petsCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <Card className="bg-card/30 border-border/30 mb-6">
                    <CardHeader
                      className="cursor-pointer group"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary transition-colors">
                        <div className="p-2 rounded-lg bg-gradient-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
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
                        <CardContent>
                          <p className="text-sm text-muted-foreground text-center">
                            Quick and accurate pet care calculations
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PetsCalculators;
