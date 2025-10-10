import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import logoImage from "@/assets/logo-skn.png";
import { REGISTRY, type CalculatorEntry, FRIENDLY_TITLES, categoryIcon } from "@/data/calculatorRegistry";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchIndex: CalculatorEntry[] = useMemo(() => REGISTRY.filter(e => !!e.subcategory), []);

  // Estado do menu More (desktop) — controlado pelo Popover
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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
    const { category, slug } = calculator;
    if (category && slug) {
      navigate(`/${category}/${slug}`);
    }
  };

  const handleSuggestionClick = (calculator: any) => navigateToCalculator(calculator);

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-[10000] border-b border-border/50">
      <div className="container mx-auto px-4 py-2 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          <img
            src={logoImage}
            alt="Smart Kit Now Logo"
            className="h-9 w-auto block"
          />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:max-w-xl mx-0 sm:mx-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a calculator"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
            className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300 w-full h-9 text-sm"
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

      {/* Compact category menu inside Header */}
      <nav className="container mx-auto px-4 pb-2 overflow-x-auto no-scrollbar">
        <ul className="skn-cat-menu flex items-center justify-start gap-5 text-sm whitespace-nowrap w-full">
          {/* 11 principais categorias */}
          <li className="flex items-center">
            <Link to="/financial" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("financial")}</span>
              Financial
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/health" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("health")}</span>
              Health & Fitness
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/cooking" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("cooking")}</span>
              Cooking
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/conversion" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("conversion")}</span>
              Conversion
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/math" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("math")}</span>
              Math & Algebra
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/pets" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("pets")}</span>
              Pet Care
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/science" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("science")}</span>
              Science
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/time" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("time")}</span>
              Time & Date
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/tv-video" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("tv")}</span>
              Video
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/recipes" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("recipes")}</span>
              Recipes
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/smart-tips" className="text-primary hover:text-primary/80 transition-colors inline-flex items-center">
              <span className="mr-1" aria-hidden>{categoryIcon("smart-tips")}</span>
              Smart Tips
            </Link>
          </li>
          
          {/* More */}
          <li>
            <div className="relative inline-block group">
              {/* Mobile: details */}
              <details className="sm:hidden">
                <summary className="cursor-pointer list-none text-muted-foreground hover:text-foreground">More</summary>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[min(92vw,720px)] rounded-md border border-border bg-background shadow-lg z-[11000]">
                  <ul className="py-2 text-sm grid grid-cols-2 gap-x-6 gap-y-2">
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/daily-quotes" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("daily-quotes")}</span>Daily Quotes</Link></li>
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/everyday-life" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("everyday-life")}</span>Everyday Life</Link></li>
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/sports" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("sports")}</span>Sports</Link></li>
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/funny" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("funny")}</span>Funny</Link></li>
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/automotive" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("automotive")}</span>Automotive</Link></li>
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/construction" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("construction")}</span>Construction</Link></li>
                    <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/electrical" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("electrical")}</span>Electrical</Link></li>
                  </ul>
                </div>
              </details>
              {/* Desktop: Popover do sistema de UI */}
              <div className="hidden sm:block">
                <Popover open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-haspopup="dialog"
                      aria-expanded={isMoreOpen}
                    >
                      More
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="center" sideOffset={8} className="w-[min(92vw,720px)] p-2">
                    <ul className="py-2 text-sm grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/construction" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("construction")}</span>Construction</Link></li>
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/electrical" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("electrical")}</span>Electrical</Link></li>
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/automotive" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("automotive")}</span>Automotive</Link></li>
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/sports" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("sports")}</span>Sports</Link></li>
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/everyday-life" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("everyday-life")}</span>Everyday Life</Link></li>
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/daily-quotes" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("daily-quotes")}</span>Daily Quotes</Link></li>
                      <li className="px-4 py-2.5 hover:bg-muted tracking-wide text-center"><Link to="/funny" className="inline-flex items-center justify-center"><span className="mr-1" aria-hidden>{categoryIcon("funny")}</span>Funny</Link></li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
