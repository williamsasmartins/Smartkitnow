import { useState } from "react";
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
  // Categories with detailed automotive structure
  const categories = {
    automotivo: {
      name: "Automotive Calculators",
      icon: Car,
      color: "text-blue-600",
      description: "We have automotive calculators and resources for engine performance tuning, day to day mechanics, and other vehicle applications. From estimating horsepower to estimating your monthly payment, we have the resources for you.",
      subCategories: [
        {
          title: "Engine & Horsepower Calculators",
          icon: "fa-solid fa-car-battery",
          calculators: [
            { key: "carburetor-cfm", name: "Carburetor CFM Calculator" },
            { key: "lb-cc-converter", name: "Convert lb/hr to cc/min & cc/min to lb/hr" },
            { key: "engine-compression", name: "Engine Compression Ratio Calculator" },
            { key: "engine-displacement", name: "Engine Displacement Calculator" },
            { key: "horsepower", name: "Engine Horsepower Calculator" },
            { key: "engine-torque", name: "Engine Torque Calculator" }
          ]
        },
        {
          title: "Fuel & Fuel Economy Calculators",
          icon: "fa-solid fa-gas-pump",
          calculators: [
            { key: "ev-charging-cost", name: "Electric Vehicle Charging Cost Calculator" },
            { key: "ev-charging-time", name: "Electric Vehicle Charging Time Calculator" },
            { key: "ev-fuel-savings", name: "Electric Vehicle Fuel Savings Calculator" },
            { key: "fuel-cost", name: "Fuel Cost Calculator" },
            { key: "fuel-injector-flow", name: "Fuel Injector Flow Rate Calculator" },
            { key: "fuel-savings", name: "Fuel Savings Calculator" },
            { key: "gas-mileage", name: "Gas Mileage Calculator" },
            { key: "km-per-liter", name: "Kilometers Per Liter Fuel Economy Calculator" },
            { key: "liters-per-100km", name: "Liters Per 100 Kilometers Fuel Consumption Calculator" }
          ]
        },
        {
          title: "Unit Conversion Calculators",
          icon: "fa-solid fa-arrows-left-right-to-line",
          calculators: [
            { key: "ev-efficiency", name: "Electric Car Efficiency Unit Conversions" },
            { key: "fuel-economy-unit", name: "Fuel Economy Unit Conversions" },
            { key: "sae-metric", name: "SAE to Metric Calculator & Metric to Standard" },
            { key: "speed-unit", name: "Speed Unit Conversions" },
            { key: "torque-unit", name: "Torque Unit Conversions" }
          ]
        },
        {
          title: "Vehicle Loan Calculators",
          icon: "fa-solid fa-sack-dollar",
          calculators: [
            { key: "atv-loan", name: "ATV Loan Calculator" },
            { key: "auto-loan", name: "Auto Loan Calculator" },
            { key: "boat-loan", name: "Boat Loan Calculator" },
            { key: "car-lease", name: "Car Lease Calculator" },
            { key: "lease-vs-buy", name: "Lease vs. Buy Car Calculator" },
            { key: "motorcycle-loan", name: "Motorcycle Loan Calculator" },
            { key: "rv-loan", name: "RV Loan Calculator" }
          ]
        },
        {
          title: "Wheels & Tires Calculators",
          icon: "fa-solid fa-fan",
          calculators: [
            { key: "speedometer-error", name: "Speedometer Error Calculator" },
            { key: "speedometer-gear", name: "Speedometer Gear Calculator" },
            { key: "tire-size", name: "Tire Size Calculator" },
            { key: "tire-size-comparison", name: "Tire Size Comparison Calculator" },
            { key: "tire-size-conversion", name: "Tire Size Conversion Calculator" },
            { key: "wheel-offset", name: "Wheel Offset Calculator" }
          ]
        }
      ]
    }
  };

  // Calculator Categories Data (preserving other categories)
  const calculatorCategories = [
    categories.automotivo,
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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
              const isAutomotive = category.name === "Automotive Calculators";
              
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50 cursor-pointer"
                  onClick={() => isAutomotive ? setSelectedCategory(selectedCategory === 'automotive' ? null : 'automotive') : null}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <IconComponent className={`h-6 w-6 ${category.color} group-hover:text-primary transition-colors`} />
                    </div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                    {isAutomotive && selectedCategory === 'automotive' && (
                      <div className="mt-3 w-full text-left">
                        <p className="text-sm text-muted-foreground mb-3">{categories.automotivo.description}</p>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                          {categories.automotivo.subCategories.map((subCategory, subIndex) => (
                            <div key={subIndex} className="rounded-md border border-border/40 p-3 bg-background/50">
                              <div className="flex items-center gap-2 mb-2">
                                <i className={`${subCategory.icon} text-primary`}></i>
                                <p className="font-medium text-sm">{subCategory.title}</p>
                              </div>
                              <ul className="space-y-1">
                                {subCategory.calculators.map((calc, calcIndex) => (
                                  <li key={calcIndex} className="text-xs text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                                    {calc.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
