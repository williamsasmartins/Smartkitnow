import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import logoImage from "@/assets/logo-skn.png";
import { recipeData } from "@/data/recipeData";

export function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const calculators = useMemo(() => [
    { key: "carburetor-cfm", name: "Carburetor CFM Calculator", category: "automotive" },
    { key: "engine-compression", name: "Engine Compression Ratio Calculator", category: "automotive" },
    { key: "horsepower", name: "Engine Horsepower Calculator", category: "automotive" },
    { key: "fuel-cost", name: "Fuel Cost Calculator", category: "automotive" },
    { key: "gas-mileage", name: "Gas Mileage Calculator", category: "automotive" },
    { key: "auto-loan", name: "Auto Loan Calculator", category: "automotive" },
    { key: "tv-mounting-cost", name: "TV Mounting and Installation Cost Guide", category: "tv" }
  ], []);

  const filteredCalculators = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return calculators.filter(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (searchTerm.trim() && filteredCalculators.length > 0) navigateToCalculator(filteredCalculators[0]);
  };
  const navigateToCalculator = (calculator: any) => {
    setSearchTerm("");
    setShowSuggestions(false);
    const paths = {
      automotive: `/automotive/${calculator.key}`,
      construction: `/construction/${calculator.key}`,
      conversion: `/conversion/${calculator.key}`,
      cooking: `/cooking/${calculator.key}`,
      financial: `/financial/calculator/${calculator.key}`,
      health: `/health/calculator/${calculator.key}`,
      math: `/math/calculator/${calculator.key}`,
      pets: `/pets/calculator/${calculator.key}`,
      science: `/science/calculator/${calculator.key}`,
      time: `/time/calculator/${calculator.key}`,
      tv: `/tv/calculator/${calculator.key}`
    };
    navigate(paths[calculator.category as keyof typeof paths] || "/");
  };
  const handleSuggestionClick = (calculator: any) => navigateToCalculator(calculator);

  const location = useLocation();
  const pathname = location.pathname;
  const stateCategory = (location.state as any)?.category as string | undefined;

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let backTarget: string | null = null;
  if (pathname === '/recipes') backTarget = '/';
  else if (pathname.startsWith('/recipes/')) backTarget = '/recipes';
  else if (pathname.startsWith('/recipe/')) {
    let cat = stateCategory;
    if (!cat) {
      const slug = pathname.split('/').pop();
      outer: for (const [catName, list] of Object.entries(recipeData as Record<string, any[]>)) {
        for (const r of list as any[]) if (slugify(r.name) === slug) { cat = catName; break outer; }
      }
    }
    backTarget = cat ? `/recipes/${slugify(cat)}` : '/recipes';
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between">
        {/* Logo único, sem duplicação */}
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          <img src={logoImage} alt="Smart Kit Now Logo" className="h-8 w-auto" />
        </div>
        {backTarget && (
          <Button variant="ghost" size="sm" onClick={() => navigate(backTarget)} className="ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        )}
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
        <div className="flex-shrink-0 ml-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}