import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import logoImage from "@/assets/logo-skn.png";
import { calculatorRegistry } from '@/data/calculatorRegistry';  // Import correto para src/data/calculatorRegistry.ts

// Tipo compatível com o calculatorRegistry
interface CalculatorInfo {
  key: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  formula?: string;
  tags: string[];
}

export function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const calculators = useMemo(() => {
    return Object.entries(calculatorRegistry).map(([key, calc]) => ({
      key: calc.key,
      name: calc.name,
      category: calc.category,
      subcategory: calc.subcategory,
    }));
  }, []);

  const filteredCalculators = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return calculators.filter(calc =>
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, calculators]);

  const handleHomeClick = () => navigate("/");

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

  const navigateToCalculator = (calculator: { key: string; category: string }) => {
    setSearchTerm("");
    setShowSuggestions(false);
    const paths = {
      automotive: `/automotive/${calculator.key}-calculator`,
      construction: `/construction/${calculator.key}-calculator`,
      conversion: `/conversion/${calculator.key}-calculator`,
      cooking: `/cooking/${calculator.key}-calculator`,
      financial: `/financial/calculator/${calculator.key}-calculator`,
      health: `/health/calculator/${calculator.key}-calculator`,
      math: `/math/calculator/${calculator.key}-calculator`,
      pets: `/pets/calculator/${calculator.key}-calculator`,
      science: `/science/calculator/${calculator.key}-calculator`,
      time: `/time/calculator/${calculator.key}-calculator`,
      tv: `/tv/calculator/${calculator.key}-calculator`,
    } as const;
    const path = paths[calculator.category as keyof typeof paths];
    if (path) {
      navigate(path);
    }
  };

  const handleSuggestionClick = (calculator: { key: string; category: string }) => navigateToCalculator(calculator);

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-md z-[10000]">
      <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          {logoImage ? (
            <img
              src={logoImage}
              alt="Smart Kit Now Logo"
              className="h-8 w-auto block"
            />
          ) : (
            <span className="text-lg font-bold">Smart Kit Now</span>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4 relative">
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
          {showSuggestions && filteredCalculators.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredCalculators.map((calc) => (
                <div
                  key={calc.key}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(calc);
                  }}
                  className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                >
                  <div className="font-medium text-sm">{calc.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{calc.category}</div>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="flex items-center mr-3 sm:mr-4 md:mr-6">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
