// src/components/Header.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoImage from "@/assets/logo-skn.png";

/**
 * Normaliza strings: minúscula + remove acentos/diacríticos.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type Entry = {
  name: string;
  path: string;
  category?: string;
  tags?: string[];
};

/**
 * Fallback local com alguns itens âncora.
 * Inclui DRYWALL e MORTGAGE (com várias tags).
 * Ajuste as rotas conforme as páginas existentes no seu projeto.
 */
const FALLBACK: Entry[] = [
  {
    name: "Drywall Area & Sheets Calculator",
    path: "/construction/wall-ceiling-calculators/drywall-area-sheets",
    category: "construction",
    tags: ["drywall", "wall", "gypsum", "sheet", "board", "ceiling"],
  },
  {
    name: "Paint Calculator",
    path: "/construction/wall-ceiling-calculators/paint",
    category: "construction",
    tags: ["paint", "wall", "ceiling"],
  },
  {
    name: "Concrete Calculator",
    path: "/construction/concrete-masonry-calculators/concrete",
    category: "construction",
    tags: ["concrete", "masonry"],
  },
  {
    name: "Loan Payment Calculator",
    path: "/financial/interest-loan-calculators/loan-payment",
    category: "financial",
    tags: ["loan", "finance", "payment", "installment"],
  },
  // 👇 entradas para “mortgage”
  {
    name: "Mortgage Calculator",
    path: "/financial/interest-loan-calculators/mortgage",
    category: "financial",
    tags: ["mortgage", "home loan", "house payment", "amortization", "mortgage payment"],
  },
  // rota alternativa caso a de cima mude (mantém encontrável)
  {
    name: "Mortgage Calculator (Alt)",
    path: "/financial/mortgage",
    category: "financial",
    tags: ["mortgage", "loan", "finance", "home"],
  },
  {
    name: "BMI Calculator",
    path: "/health/body-measurement-calculators/bmi",
    category: "health",
    tags: ["health", "fitness", "body mass index"],
  },
];

export function Header() {
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const q = normalize(term.trim());
    if (!q) return [];
    return FALLBACK.filter((e) => {
      const name = normalize(e.name);
      const cat = normalize(e.category ?? "");
      const tags = (e.tags ?? []).map(normalize);
      return (
        name.includes(q) ||
        cat.includes(q) ||
        tags.some((t) => t.includes(q))
      );
    }).slice(0, 10);
  }, [term]);

  const goto = (path: string) => {
    setOpen(false);
    setTerm("");
    navigate(path);
  };

  // Enter → vai no primeiro resultado, se existir
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) goto(results[0].path);
  };

  // Fechar ao tocar/clicar fora (pointerdown cobre touch/mouse/caneta)
  useEffect(() => {
    const onDocPointerDown = (ev: PointerEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-md z-[10000]">
      {/* No mobile: quebra em duas linhas para a busca ter 100% de largura */}
      <div className="container mx-auto px-4 py-3 max-w-7xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
          aria-label="Smart Kit Now Home"
        >
          {logoImage ? (
            <img src={logoImage} alt="Smart Kit Now" className="h-8 w-auto block" />
          ) : (
            <span className="text-lg font-bold">Smart Kit Now</span>
          )}
        </div>

        {/* Search */}
        <div ref={boxRef} className="w-full sm:flex-1 sm:max-w-xl sm:mx-4 relative">
          <form onSubmit={onSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={term}
                onChange={(e) => {
                  const v = e.target.value;
                  setTerm(v);
                  setOpen(v.trim().length > 0);
                }}
                // ⭐ Ajuda no iOS/IME: dispara a cada input, não só no blur
                onInput={(e) => {
                  const v = (e.target as HTMLInputElement).value;
                  // evita setState desnecessário, mas garante atualização imediata no iOS
                  if (v !== term) {
                    setTerm(v);
                    setOpen(v.trim().length > 0);
                  }
                }}
                onFocus={() => setOpen(term.trim().length > 0)}
                inputMode="search"
                enterKeyHint="search"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Search for a calculator"
                className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="skn-search-listbox"
              />
            </div>
          </form>

          {/* Sugestões */}
          {open && results.length > 0 && (
            <div
              id="skn-search-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-72 overflow-y-auto touch-manipulation"
            >
              {results.map((item) => (
                <div
                  key={item.path}
                  role="option"
                  className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                  // ⭐ iOS-safe: pointerdown + preventDefault para não perder foco antes da navegação
                  onPointerDown={(e) => {
                    e.preventDefault();
                    goto(item.path);
                  }}
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  {item.category && (
                    <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="flex items-center sm:ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
