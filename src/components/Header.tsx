import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

export function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Calculator database for search
  const calculators = useMemo(() => [
    // Automotive calculators
    { key: "carburetor-cfm", name: "Carburetor CFM Calculator", category: "automotive" },
    { key: "engine-compression", name: "Engine Compression Ratio Calculator", category: "automotive" },
    { key: "horsepower", name: "Engine Horsepower Calculator", category: "automotive" },
    { key: "fuel-cost", name: "Fuel Cost Calculator", category: "automotive" },
    { key: "gas-mileage", name: "Gas Mileage Calculator", category: "automotive" },
    { key: "auto-loan", name: "Auto Loan Calculator", category: "automotive" },
    
    // Construction calculators
    { key: "concrete", name: "Concrete Calculator", category: "construction" },
    { key: "block-mortar", name: "Block Mortar Calculator", category: "construction" },
    { key: "rebar-material", name: "Rebar Material Calculator", category: "construction" },
    { key: "tile", name: "Tile Calculator", category: "construction" },
    { key: "flooring", name: "Flooring Calculator", category: "construction" },
    { key: "paint", name: "Paint Calculator", category: "construction" },
    { key: "mulch", name: "Mulch Calculator", category: "construction" },
    { key: "gravel", name: "Gravel Calculator", category: "construction" },
    
    // Conversion calculators
    { key: "conversion-calculator", name: "Conversion Calculator", category: "conversion" },
    { key: "temperature-conversion", name: "Temperature Conversion", category: "conversion" },
    { key: "length-conversion", name: "Length Conversion", category: "conversion" },
    { key: "weight-conversion", name: "Weight Conversion", category: "conversion" },
    { key: "volume-conversion", name: "Volume Conversion", category: "conversion" },
    
    // Cooking calculators
    { key: "cake", name: "Cake Calculator", category: "cooking" },
    { key: "pizza", name: "Pizza Calculator", category: "cooking" },
    { key: "recipe-scale-conversion", name: "Recipe Scale Conversion Calculator", category: "cooking" },
    { key: "oven-temperature-conversion", name: "Oven Temperature Conversion Calculator", category: "cooking" },
    { key: "turkey-cooking-time", name: "Turkey Cooking Time Calculator", category: "cooking" },
    { key: "cups-to-grams", name: "Cups to Grams Converter", category: "cooking" },
    { key: "grams-to-cups", name: "Grams to Cups Converter", category: "cooking" },
    { key: "tablespoons-cup", name: "How Many Tablespoons In 1 Cup?", category: "cooking" },
    
    // Financial calculators
    { key: "loan-payment", name: "Loan Payment Calculator", category: "financial" },
    { key: "compound-interest", name: "Compound Interest Calculator", category: "financial" },
    { key: "roi", name: "ROI Calculator", category: "financial" },
    { key: "tip", name: "Tip Calculator", category: "financial" },
    { key: "mortgage-payoff", name: "Mortgage Calculator", category: "financial" },
    { key: "simple-interest", name: "Simple Interest Calculator", category: "financial" },
    { key: "discount", name: "Discount Calculator", category: "financial" },
    { key: "auto-loan", name: "Auto Loan Calculator", category: "financial" },
    
    // Health calculators
    { key: "bmi", name: "BMI Calculator", category: "health" },
    { key: "bmr", name: "BMR Calculator", category: "health" },
    { key: "tdee", name: "TDEE Calculator", category: "health" },
    { key: "body-fat", name: "Body Fat Calculator", category: "health" },
    { key: "calories-burned", name: "Calories Burned Calculator", category: "health" },
    { key: "calorie-intake", name: "Calorie Intake Calculator", category: "health" },
    { key: "target-heart-rate", name: "Target Heart Rate Calculator", category: "health" },
    { key: "one-rep-max", name: "One-Rep Max Calculator", category: "health" },
    
    // Math calculators
    { key: "percentage", name: "Percentage Calculator", category: "math" },
    { key: "gpa", name: "GPA Calculator", category: "math" },
    { key: "fraction-to-decimal", name: "Fraction to Decimal Calculator", category: "math" },
    { key: "area", name: "Area Calculator", category: "math" },
    { key: "slope", name: "Slope Calculator", category: "math" },
    { key: "standard-deviation", name: "Standard Deviation Calculator", category: "math" },
    { key: "pythagorean", name: "Pythagorean Theorem Calculator", category: "math" },
    { key: "scientific", name: "Scientific Calculator", category: "math" }
  ], []);

  // Filter calculators based on search term
  const filteredCalculators = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return calculators.filter(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, calculators]);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && filteredCalculators.length > 0) {
      navigateToCalculator(filteredCalculators[0]);
    }
  };

  const navigateToCalculator = (calculator: any) => {
    setSearchTerm("");
    setShowSuggestions(false);
    
    // Navigate based on category
    if (calculator.category === "automotive") {
      navigate(`/automotive/${calculator.key}`);
    } else if (calculator.category === "construction") {
      navigate(`/construction/${calculator.key}`);
    } else if (calculator.category === "conversion") {
      navigate(`/conversion/${calculator.key}`);
    } else if (calculator.category === "cooking") {
      navigate(`/cooking/${calculator.key}`);
    } else if (calculator.category === "financial") {
      navigate(`/financial/calculator/${calculator.key}`);
    } else if (calculator.category === "health") {
      navigate(`/health/calculator/${calculator.key}`);
    } else if (calculator.category === "math") {
      navigate(`/math/calculator/${calculator.key}`);
    }
  };

  const handleSuggestionClick = (calculator: any) => {
    navigateToCalculator(calculator);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Project Title */}
          <div 
            className="flex items-center space-x-2 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-primary animate-glow"></div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Kit Now
            </h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl mx-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for a calculator"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && filteredCalculators.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredCalculators.map((calc) => (
                  <div
                    key={calc.key}
                    onClick={() => handleSuggestionClick(calc)}
                    className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                  >
                    <div className="font-medium text-sm">{calc.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{calc.category}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}