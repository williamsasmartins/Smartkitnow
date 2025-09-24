import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat } from "lucide-react";

const CookingCalculators = () => {
  const navigate = useNavigate();

  const cookingCategories = [
    {
      title: "Cooking & Baking Calculators",
      icon: "fa-solid fa-utensils",
      description: "Essential calculators for cooking and baking perfection",
      calculators: [
        { key: "cake", name: "Cake Calculator" },
        { key: "cooking-conversion", name: "Cooking Conversion Calculator" },
        { key: "ham-cooking-time", name: "Ham Cooking Time Calculator" },
        { key: "ham-size", name: "Ham Size Calculator" },
        { key: "milk-weight", name: "Milk Weight Calculator" },
        { key: "oven-temperature-conversion", name: "Oven Temperature Conversion Calculator & Chart" },
        { key: "oven-air-fryer-conversion", name: "Oven to Air Fryer Conversion Calculator" },
        { key: "pizza", name: "Pizza Calculator" },
        { key: "recipe-scale-conversion", name: "Recipe Scale Conversion Calculator" },
        { key: "timer", name: "Timer" },
        { key: "turkey-cooking-time", name: "Turkey Cooking Time Calculator" },
        { key: "turkey-size", name: "Turkey Size Calculator" },
        { key: "turkey-thawing-time", name: "Turkey Thawing Time Calculator" }
      ]
    },
    {
      title: "Cooking Measurements",
      icon: "fa-solid fa-measuring-cup",
      description: "Quick answers to common cooking measurement questions",
      calculators: [
        { key: "ounces-half-cup", name: "How Many Ounces In 1/2 Cup?" },
        { key: "ounces-third-cup", name: "How Many Ounces In 1/3 Cup?" },
        { key: "ounces-quarter-cup", name: "How Many Ounces In 1/4 Cup?" },
        { key: "ounces-cup", name: "How Many Ounces In a Cup?" },
        { key: "tablespoons-cup", name: "How Many Tablespoons In 1 Cup?" },
        { key: "tablespoons-half-cup", name: "How Many Tablespoons In 1/2 Cup?" },
        { key: "tablespoons-third-cup", name: "How Many Tablespoons In 1/3 Cup?" },
        { key: "tablespoons-quarter-cup", name: "How Many Tablespoons In 1/4 Cup?" },
        { key: "tablespoons-eighth-cup", name: "How Many Tablespoons In 1/8 Cup?" },
        { key: "tablespoons-two-thirds-cup", name: "How Many Tablespoons In 2/3 Cup?" },
        { key: "tablespoons-three-quarters-cup", name: "How Many Tablespoons In 3/4 Cup?" },
        { key: "teaspoons-third-cup", name: "How Many Teaspoons In 1/3 Cup?" },
        { key: "teaspoons-quarter-cup", name: "How Many Teaspoons In 1/4 Cup?" },
        { key: "teaspoons-eighth-cup", name: "How Many Teaspoons In 1/8 Cup?" },
        { key: "teaspoons-tablespoon", name: "How Many Teaspoons In a Tablespoon?" },
        { key: "teaspoons-half-tablespoon", name: "How Many Teaspoons In Half a Tablespoon?" }
      ]
    },
    {
      title: "Unit Conversion Calculators",
      icon: "fa-solid fa-arrows-rotate",
      description: "Convert between different cooking units and measurements",
      calculators: [
        { key: "beer-volume-conversions", name: "Beer Volume Conversions" },
        { key: "butter-unit-conversions", name: "Butter Unit Conversions" },
        { key: "cups-to-grams", name: "Cups to Grams Converter" },
        { key: "cups-to-ml", name: "Cups to mL Converter" },
        { key: "cups-to-tablespoons", name: "Cups to Tablespoons Converter" },
        { key: "flour-volume-weight", name: "Flour Volume & Weight Conversions" },
        { key: "grams-to-cups", name: "Grams to Cups Converter" },
        { key: "grams-to-ml", name: "Grams to mL Converter" },
        { key: "grams-to-ounces", name: "Grams to Ounces Converter" },
        { key: "grams-to-tablespoons", name: "Grams to Tablespoons Converter" },
        { key: "grams-to-teaspoons", name: "Grams to Teaspoons Converter" },
        { key: "mg-to-ml", name: "mg to mL Converter" },
        { key: "ml-to-grams", name: "mL to Grams Converter" },
        { key: "ml-to-mg", name: "mL to mg Converter" },
        { key: "ounces-to-grams", name: "Ounces to Grams Converter" },
        { key: "salt-volume-weight", name: "Salt Volume & Weight Conversions" },
        { key: "sugar-volume-weight", name: "Sugar Volume & Weight Conversions" },
        { key: "tablespoons-to-cups", name: "Tablespoons to Cups Converter" },
        { key: "tablespoons-to-grams", name: "Tablespoons to Grams Converter" },
        { key: "teaspoons-to-grams", name: "Teaspoons to Grams Converter" },
        { key: "volume-unit-conversions", name: "Volume Unit Conversions" },
        { key: "weight-unit-conversions", name: "Weight Unit Conversions" }
      ]
    }
  ];

  const handleSubCategoryClick = (categoryTitle: string) => {
    const slug = categoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    navigate(`/cooking/${slug}`);
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cooking Calculators
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our cooking and baking calculators and resources help you prepare the perfect dish by simplifying recipes and converting ingredients from one measurement to another.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {cookingCategories.map((category) => (
              <Card 
                key={category.title}
                className="group cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                onClick={() => handleSubCategoryClick(category.title)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-xl bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors">
                    <i className={`${category.icon} text-2xl text-primary`}></i>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {category.calculators.length} calculators available:
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {category.calculators.slice(0, 6).map((calc) => (
                        <div 
                          key={calc.key} 
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1 border-l-2 border-transparent hover:border-primary pl-2"
                        >
                          {calc.name}
                        </div>
                      ))}
                      {category.calculators.length > 6 && (
                        <div className="text-sm text-primary font-medium pt-2">
                          +{category.calculators.length - 6} more calculators
                        </div>
                      )}
                    </div>
                  </div>
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

export default CookingCalculators;