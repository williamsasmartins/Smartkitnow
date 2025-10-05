import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import logoImage from "@/assets/logo-skn.png";
import { REGISTRY, type CalculatorEntry } from "@/data/calculatorRegistry";

export function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchIndex: CalculatorEntry[] = useMemo(() => REGISTRY.filter(e => !!e.subcategory), []);

  const filteredCalculators = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter((e) => {
        const nameMatch = e.title.toLowerCase().includes(q);
        const categoryMatch = e.category.toLowerCase().includes(q);
        const subcategoryMatch = (e.subcategory || "").toLowerCase().includes(q);
        const aliasMatch = (e.aliases || []).some(a => a.toLowerCase().includes(q));
        const slugMatch = e.slug.toLowerCase().includes(q);
        return nameMatch || categoryMatch || subcategoryMatch || aliasMatch || slugMatch;
      })
      .slice(0, 8);
  }, [searchTerm, searchIndex]);

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

  const navigateToCalculator = (calculator: CalculatorEntry) => {
    setSearchTerm("");
    setShowSuggestions(false);
    const category = calculator.category;
    const subcategory = calculator.subcategory || "";
    const slug = calculator.slug;
    if (category && subcategory && slug) {
      navigate(`/${category}/${subcategory}/${slug}`);
    }
  };

  const handleSuggestionClick = (calculator: any) => navigateToCalculator(calculator);

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-md z-[10000]">
      <div className="container mx-auto px-4 py-3 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
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

        <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:max-w-xl mx-0 sm:mx-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a calculator"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300 w-full"
          />
          {showSuggestions && filteredCalculators.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredCalculators.map((calc) => (
                <div
                  key={`${calc.category}-${calc.slug}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(calc);
                  }}
                  className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                >
                  <div className="font-medium text-sm">{calc.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{calc.category}{calc.subcategory ? ` • ${calc.subcategory}` : ""}</div>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="flex items-center mr-0 sm:mr-3 md:mr-6">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
