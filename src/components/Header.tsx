// src/components/Header.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import logoImage from "@/assets/logo-skn.png";

/** ===================== Tipos ===================== */
type Category =
  | "automotive"
  | "construction"
  | "conversion"
  | "cooking"
  | "financial"
  | "health"
  | "math"
  | "pets"
  | "science"
  | "time"
  | "tv";

type CalcItem = {
  key: string;
  name: string;
  category: Category;
  /** Palavras-chave/aliases para melhorar a busca */
  keywords?: string[];
};

/** ===================== Helpers ===================== */
// Normaliza para busca (remove acentos e baixa caixa)
const norm = (s: string) =>
  s
    .normalize("NFD")
    // remove diacríticos (acentos)
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** ===================== Dataset de busca ===================== */
const CALCULATORS: CalcItem[] = [
  // Automotive
  { key: "carburetor-cfm", name: "Carburetor CFM Calculator", category: "automotive" },
  { key: "engine-compression", name: "Engine Compression Ratio Calculator", category: "automotive" },
  { key: "horsepower", name: "Engine Horsepower Calculator", category: "automotive" },
  { key: "fuel-cost", name: "Fuel Cost Calculator", category: "automotive" },
  { key: "gas-mileage", name: "Gas Mileage Calculator", category: "automotive" },
  { key: "auto-loan", name: "Auto Loan Calculator", category: "automotive" },

  // Health
  { key: "bmi", name: "BMI Calculator", category: "health" },
  { key: "bmr", name: "BMR Calculator", category: "health" },
  { key: "calorie-intake", name: "Calorie Intake Calculator", category: "health" },
  { key: "convert-calories-to-kilograms", name: "Calories to Kilograms Calculator", category: "health" },
  { key: "body-fat", name: "Body Fat Calculator", category: "health" },
  { key: "tdee", name: "TDEE Calculator", category: "health" },

  // TV (exemplo)
  { key: "tv-mounting-cost", name: "TV Mounting and Installation Cost Guide", category: "tv" },

  // ===== NOVO: Construction -> Drywall (para “DRY”, “dry-wall”, etc.)
  {
    key: "drywall",
    name: "Drywall Calculator",
    category: "construction",
    keywords: ["dry", "dry-wall", "wallboard", "gesso", "parede seca", "drywall sheets"],
  },
];

/** ===================== Componente ===================== */
export function Header() {
  const navigate = useNavigate();

  // Estado do search
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtro “inteligente” sem libs: includes + prefixo de palavra + keywords
  const filtered = useMemo(() => {
    const t = norm(searchTerm);
    if (!t) return [];

    return CALCULATORS.filter((c) => {
      const name = norm(c.name);
      const cat = norm(c.category);
      const kws = (c.keywords ?? []).map(norm);

      // 1) bateu em nome/categoria/keywords via includes
      if (name.includes(t) || cat.includes(t) || kws.some((k) => k.includes(t))) return true;

      // 2) prefixo de qualquer palavra do nome (ex: "dry" em "Drywall")
      const nameWords = name.split(/\s+/);
      if (nameWords.some((w) => w.startsWith(t))) return true;

      return false;
    }).slice(0, 8);
  }, [searchTerm]);

  // Navegação
  const handleHomeClick = () => navigate("/");

  const navigateToCalculator = (calculator: CalcItem) => {
    const paths: Record<Category, string> = {
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
      tv: `/tv/calculator/${calculator.key}`,
    };

    navigate(paths[calculator.category], {
      state: { calculator, subCategory: calculator.category },
    });
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // Eventos
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && filtered.length > 0) {
      navigateToCalculator(filtered[0]);
    }
  };

  const handleSuggestionClick = (calculator: CalcItem) => navigateToCalculator(calculator);

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-md z-[10000]">
      {/* 3 colunas: logo | busca central | ações */}
      <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Logo (esquerda) */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHomeClick}
        >
          {logoImage ? (
            <img src={logoImage} alt="Smart Kit Now Logo" className="h-8 w-auto block" />
          ) : (
            <span className="text-lg font-bold">Smart Kit Now</span>
          )}
        </div>

        {/* Search centralizada */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl w-full mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a calculator"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300"
          />

          {/* Sugestões */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
              {searchTerm.trim().length > 0 && filtered.length === 0 && (
                <div className="px-4 py-3 text-sm text-muted-foreground">No results</div>
              )}

              {filtered.map((calc) => (
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

        {/* Ações (direita) */}
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
