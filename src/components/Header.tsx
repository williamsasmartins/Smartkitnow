// src/components/Header.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo-skn.png";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { SEARCH_INDEX } from "@/data/searchIndex";
import { ThemeToggle } from "@/components/ThemeToggle";

/** Normaliza texto para busca (casefold + remove acentos) */
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

  // Fechar ao tocar/clicar fora (pointerdown cobre mouse/touch/caneta)
  useEffect(() => {
    const onDoc = (ev: PointerEvent) => {
      const el = ev.target as Node;
      if (!boxRef.current) return;
      if (!boxRef.current.contains(el)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  // Resultados (filtro leve e robusto)
  const results = useMemo(() => {
    const q = normalize(term.trim());
    if (!q) return [];

    // Filtra: confere em 'terms' (se houver) e sempre confere no 'name'
    const filtered = SEARCH_INDEX.filter((e) => {
      const nameHit = normalize(e.name ?? "").includes(q);
      const terms = Array.isArray(e.terms) ? e.terms : [];
      const termsHit = terms.some((t) => normalize(t).includes(q));
      return nameHit || termsHit;
    });

    // Ordena com alguns mimos: começa-com tem prioridade; drywall sobe
    const scored = filtered
      .map((e) => {
        const n = normalize(e.name ?? "");
        let score = 0;
        if (n.startsWith(q)) score -= 10;
        if (n.includes(q)) score -= 1;
        if (n.startsWith("drywall")) score -= 100; // boost especial
        return { e, score };
      })
      .sort((a, b) => a.score - b.score)
      .map((x) => x.e);

    return scored.slice(0, 8);
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
      {/* Layout: centraliza a busca e permite quebrar em 2 linhas no mobile */}
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

        {/* 🔎 Search centralizada */}
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
                // iOS: força atualização imediata do valor
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
                    // evita o blur no iOS antes da navegação
                    e.preventDefault();
                    goto(item.path);
                  }}
                  className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tema */}
        <div className="flex items-center sm:justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
