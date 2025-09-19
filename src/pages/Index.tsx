import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  HardHat, 
  RotateCcw, 
  ChefHat, 
  Zap, 
  DollarSign, 
  Heart, 
  Calculator, 
  Dog, 
  Atom, 
  Clock, 
  Video, 
  BookOpen, 
  Lightbulb, 
  Quote,
  Home,
  Dumbbell,
  Smile,
  Star,
  TrendingUp
} from "lucide-react";

const Index = () => {
  // Calculator Categories Data
  const calculatorCategories = [
    { name: "Automotive Calculators", icon: Car, color: "text-blue-600" },
    { name: "Construction Calculators", icon: HardHat, color: "text-orange-600" },
    { name: "Conversion Calculators", icon: RotateCcw, color: "text-green-600" },
    { name: "Cooking Calculators", icon: ChefHat, color: "text-red-600" },
    { name: "Electrical Calculators", icon: Zap, color: "text-yellow-600" },
    { name: "Financial Calculators", icon: DollarSign, color: "text-emerald-600" },
    { name: "Health Calculators", icon: Heart, color: "text-pink-600" },
    { name: "Math Calculators", icon: Calculator, color: "text-purple-600" },
    { name: "Pets Calculators", icon: Dog, color: "text-amber-600" },
    { name: "Science Calculators", icon: Atom, color: "text-cyan-600" },
    { name: "Time & Date Calculators", icon: Clock, color: "text-indigo-600" },
    { name: "Video Calculators", icon: Video, color: "text-violet-600" },
    { name: "Recipes", icon: BookOpen, color: "text-teal-600" },
    { name: "Smart Tips", icon: Lightbulb, color: "text-yellow-500" },
    { name: "Daily Quotes", icon: Quote, color: "text-slate-600" },
    { name: "Every day Life Calculators", icon: Home, color: "text-blue-500" },
    { name: "Sports", icon: Dumbbell, color: "text-orange-500" },
    { name: "Funny Calculators", icon: Smile, color: "text-pink-500" }
  ];

  // Featured Calculators Data
  const featuredCalculators = [
    { name: "BMI Calculator", description: "Calculate your Body Mass Index", icon: Heart },
    { name: "Loan Calculator", description: "Calculate monthly payments", icon: DollarSign },
    { name: "Tip Calculator", description: "Calculate tips and split bills", icon: Calculator },
    { name: "Unit Converter", description: "Convert between units", icon: RotateCcw },
    { name: "Calorie Calculator", description: "Calculate daily calories", icon: ChefHat },
    { name: "Grade Calculator", description: "Calculate your GPA", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area - Add top padding to account for fixed header */}
      <main className="pt-20">
        {/* Categories Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Calculator Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our comprehensive collection of calculators organized by category
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {calculatorCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                >
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <IconComponent className={`h-6 w-6 ${category.color} group-hover:text-primary transition-colors`} />
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Discover More Button */}
          <div className="text-center">
            <Button className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-glow">
              <TrendingUp className="mr-2 h-4 w-4" />
              Discover More Calculators
            </Button>
          </div>
        </section>

        {/* Featured Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Featured Calculators</h3>
            <p className="text-muted-foreground text-lg">
              Most popular calculators used by our community
            </p>
          </div>

          {/* Featured Calculators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCalculators.map((calc, index) => {
              const IconComponent = calc.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-soft/20 group-hover:bg-primary-soft/30 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {calc.name}
                        </CardTitle>
                        <CardDescription>{calc.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Use Calculator
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
