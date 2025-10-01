// src/components/Header.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo-skn.png";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEARCH_INDEX, type SearchEntry } from "@/data/searchIndex";

/** normaliza: minúsculas + remove acentos */
function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function Header() {
  const navigate = useNavigate();

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fecha dropdown ao tocar/clicar fora (pointerdown cobre mouse + toque)
  useEffect(() => {
    const onDoc = (ev: PointerEvent) => {
      const el = ev.target as Node;
      if (!boxRef.current) return;
      if (!boxRef.current.contains(el)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  // Resultados da busca (sem usar .terms)
  const results = useMemo<SearchEntry[]>(() => {
    const q = normalize(term.trim());
    if (!q) return [];

    const arr = SEARCH_INDEX.filter((e) => {
      // monta um haystack com os campos disponíveis
      const haystack = normalize(
        [
          e.name,
          e.category,
          Array.isArray((e as any).tags) ? (e as any).tags.join(" ") : "",
          Array.isArray((e as any).keywords) ? (e as any).keywords.join(" ") : "",
          e.path,
        ]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(q);
    });

    // prioriza "Drywall" se empatar; depois ordena por nome
    return arr
      .sort((a, b) => {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        if (an.startsWith("drywall") && !bn.startsWith("drywall")) return -1;
        if (!an.startsWith("drywall") && bn.startsWith("drywall")) return 1;
        return an.localeCompare(bn);
      })
      .slice(0, 8);
  }, [term]);

  const goto = (path: string) => {
    setOpen(false);
    setTerm("");
    navigate(path);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[0]) goto(results[0].path);
  };

  const onHomeClick = () => navigate("/");

  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-md z-50">
      {/* Layout em duas linhas no mobile; centraliza a busca */}
      <div className="container mx-auto px-4 py-3 max-w-7xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onHomeClick}
        >
          {logoImage ? (
            <img src={logoImage} alt="Smart Kit Now" className="h-8 w-auto block" />
          ) : (
            <span className="text-lg font-bold">Smart Kit Now</span>
          )}
        </div>

        {/* Search centralizado */}
        <div ref={boxRef} className="w-full sm:flex-1 sm:max-w-xl sm:mx-4 relative">
          <form onSubmit={onSubmit}>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={inputRef}
                value={term}
                placeholder="Search for a calculator"
                onChange={(e) => {
                  const v = e.target.value;
                  setTerm(v);
                  setOpen(v.trim().length > 0);
                }}
                // Ajuda iOS/Android a refletir a digitação imediatamente
                onInput={(e) => {
                  const v = (e.target as HTMLInputElement).value;
                  if (v !== term) setTerm(v);
                }}
                onFocus={() => setOpen(term.trim().length > 0)}
                className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300 relative z-10"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
              />
            </div>
          </form>

          {/* Dropdown de sugestões (z-20 acima do input) */}
          {open && results.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-20 max-h-72 overflow-y-auto touch-manipulation"
              role="listbox"
            >
              {results.map((item) => (
                <div
                  key={item.path}
                  role="option"
                  onPointerDown={(e) => {
                    e.preventDefault(); // evita blur antes de navegar no iOS
                    goto(item.path);
                  }}
                  className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle à direita */}
        <div className="flex items-center sm:justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
