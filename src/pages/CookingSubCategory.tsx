import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Calculator } from "lucide-react";

const CookingSubCategory = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();

  const cookingCategories = {
    "cooking-baking-calculators": {
      title: "Cooking & Baking Calculators",
      icon: "fa-solid fa-utensils",
      description: "Essential calculators for cooking and baking perfection",
      calculators: [
        { key: "cake", name: "Cake Calculator", description: "Calculate cake serving sizes and ingredient amounts" },
        { key: "cooking-conversion", name: "Cooking Conversion Calculator", description: "Convert between cooking measurements" },
        { key: "ham-cooking-time", name: "Ham Cooking Time Calculator", description: "Determine optimal ham cooking time" },
        { key: "ham-size", name: "Ham Size Calculator", description: "Calculate ham size for your gathering" },
        { key: "milk-weight", name: "Milk Weight Calculator", description: "Convert milk volume to weight" },
        { key: "oven-temperature-conversion", name: "Oven Temperature Conversion Calculator & Chart", description: "Convert between oven temperature scales" },
        { key: "oven-air-fryer-conversion", name: "Oven to Air Fryer Conversion Calculator", description: "Convert oven recipes for air fryer" },
        { key: "pizza", name: "Pizza Calculator", description: "Calculate pizza dough and serving amounts" },
        { key: "recipe-scale-conversion", name: "Recipe Scale Conversion Calculator", description: "Scale recipes up or down" },
        { key: "timer", name: "Timer", description: "Cooking timer for perfect timing" },
        { key: "turkey-cooking-time", name: "Turkey Cooking Time Calculator", description: "Calculate turkey cooking time" },
        { key: "turkey-size", name: "Turkey Size Calculator", description: "Determine turkey size needed" },
        { key: "turkey-thawing-time", name: "Turkey Thawing Time Calculator", description: "Calculate turkey thawing time" }
      ]
    },
    "cooking-measurements": {
      title: "Cooking Measurements",
      icon: "fa-solid fa-measuring-cup",
      description: "Quick answers to common cooking measurement questions",
      calculators: [
        { key: "ounces-half-cup", name: "How Many Ounces In 1/2 Cup?", description: "Convert 1/2 cup to ounces" },
        { key: "ounces-third-cup", name: "How Many Ounces In 1/3 Cup?", description: "Convert 1/3 cup to ounces" },
        { key: "ounces-quarter-cup", name: "How Many Ounces In 1/4 Cup?", description: "Convert 1/4 cup to ounces" },
        { key: "ounces-cup", name: "How Many Ounces In a Cup?", description: "Convert 1 cup to ounces" },
        { key: "tablespoons-cup", name: "How Many Tablespoons In 1 Cup?", description: "Convert 1 cup to tablespoons" },
        { key: "tablespoons-half-cup", name: "How Many Tablespoons In 1/2 Cup?", description: "Convert 1/2 cup to tablespoons" },
        { key: "tablespoons-third-cup", name: "How Many Tablespoons In 1/3 Cup?", description: "Convert 1/3 cup to tablespoons" },
        { key: "tablespoons-quarter-cup", name: "How Many Tablespoons In 1/4 Cup?", description: "Convert 1/4 cup to tablespoons" },
        { key: "tablespoons-eighth-cup", name: "How Many Tablespoons In 1/8 Cup?", description: "Convert 1/8 cup to tablespoons" },
        { key: "tablespoons-two-thirds-cup", name: "How Many Tablespoons In 2/3 Cup?", description: "Convert 2/3 cup to tablespoons" },
        { key: "tablespoons-three-quarters-cup", name: "How Many Tablespoons In 3/4 Cup?", description: "Convert 3/4 cup to tablespoons" },
        { key: "teaspoons-third-cup", name: "How Many Teaspoons In 1/3 Cup?", description: "Convert 1/3 cup to teaspoons" },
        { key: "teaspoons-quarter-cup", name: "How Many Teaspoons In 1/4 Cup?", description: "Convert 1/4 cup to teaspoons" },
        { key: "teaspoons-eighth-cup", name: "How Many Teaspoons In 1/8 Cup?", description: "Convert 1/8 cup to teaspoons" },
        { key: "teaspoons-tablespoon", name: "How Many Teaspoons In a Tablespoon?", description: "Convert tablespoons to teaspoons" },
        { key: "teaspoons-half-tablespoon", name: "How Many Teaspoons In Half a Tablespoon?", description: "Convert 1/2 tablespoon to teaspoons" }
      ]
    },
    "unit-conversion-calculators": {
      title: "Unit Conversion Calculators",
      icon: "fa-solid fa-arrows-rotate",
      description: "Convert between different cooking units and measurements",
      calculators: [
        { key: "beer-volume-conversions", name: "Beer Volume Conversions", description: "Convert beer volume measurements" },
        { key: "butter-unit-conversions", name: "Butter Unit Conversions", description: "Convert butter measurements" },
        { key: "cups-to-grams", name: "Cups to Grams Converter", description: "Convert cups to grams" },
        { key: "cups-to-ml", name: "Cups to mL Converter", description: "Convert cups to milliliters" },
        { key: "cups-to-tablespoons", name: "Cups to Tablespoons Converter", description: "Convert cups to tablespoons" },
        { key: "flour-volume-weight", name: "Flour Volume & Weight Conversions", description: "Convert flour measurements" },
        { key: "grams-to-cups", name: "Grams to Cups Converter", description: "Convert grams to cups" },
        { key: "grams-to-ml", name: "Grams to mL Converter", description: "Convert grams to milliliters" },
        { key: "grams-to-ounces", name: "Grams to Ounces Converter", description: "Convert grams to ounces" },
        { key: "grams-to-tablespoons", name: "Grams to Tablespoons Converter", description: "Convert grams to tablespoons" },
        { key: "grams-to-teaspoons", name: "Grams to Teaspoons Converter", description: "Convert grams to teaspoons" },
        { key: "mg-to-ml", name: "mg to mL Converter", description: "Convert milligrams to milliliters" },
        { key: "ml-to-grams", name: "mL to Grams Converter", description: "Convert milliliters to grams" },
        { key: "ml-to-mg", name: "mL to mg Converter", description: "Convert milliliters to milligrams" },
        { key: "ounces-to-grams", name: "Ounces to Grams Converter", description: "Convert ounces to grams" },
        { key: "salt-volume-weight", name: "Salt Volume & Weight Conversions", description: "Convert salt measurements" },
        { key: "sugar-volume-weight", name: "Sugar Volume & Weight Conversions", description: "Convert sugar measurements" },
        { key: "tablespoons-to-cups", name: "Tablespoons to Cups Converter", description: "Convert tablespoons to cups" },
        { key: "tablespoons-to-grams", name: "Tablespoons to Grams Converter", description: "Convert tablespoons to grams" },
        { key: "teaspoons-to-grams", name: "Teaspoons to Grams Converter", description: "Convert teaspoons to grams" },
        { key: "volume-unit-conversions", name: "Volume Unit Conversions", description: "Convert volume measurements" },
        { key: "weight-unit-conversions", name: "Weight Unit Conversions", description: "Convert weight measurements" }
      ]
    }
  };

  const category = subcategory ? cookingCategories[subcategory as keyof typeof cookingCategories] : null;

  const handleCalculatorClick = (calculatorKey: string) => {
    navigate(`/cooking/${subcategory}/${calculatorKey}`);
  };

  const handleBackClick = () => {
    navigate("/cooking");
  };

  if (!category) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
          <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The cooking category you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/cooking")}>
              Back to Cooking Calculators
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
            Back to Cooking Calculators
          </Button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <i className={`${category.icon} text-xl text-white`}></i>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {category.title}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Calculators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.calculators.map((calculator) => (
              <Card 
                key={calculator.key}
                className="group cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                onClick={() => handleCalculatorClick(calculator.key)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-3 p-2 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors w-fit">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                    {calculator.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-muted-foreground">
                    {calculator.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CookingSubCategory;