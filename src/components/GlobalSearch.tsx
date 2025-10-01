// src/components/GlobalSearch.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { REGISTRY, type CalcEntry } from "@/data/calculatorRegistry";

type Hit = CalcEntry & {
  matchOn: "name" | "alias" | "description";
};

const normalize = (s: string) => (s || "").toLowerCase().trim();

const filterResults = (q: string, max = 8): Hit[] => {
  if (!q) return [];
  const qq = normalize(q);

  const scored = REGISTRY.map((e) => {
    const name = normalize(e.name);
    const desc = normalize(e.description ?? "");
    const aliases = (e.aliases ?? []).map(normalize);

    let score = -1;
    let matchOn: Hit["matchOn"] | null = null;

    if (name.includes(qq)) {
      score = 100 - name.indexOf(qq);
      matchOn = "name";
    } else if (aliases.some((a) => a.includes(qq))) {
      score = 80;
      matchOn = "alias";
    } else if (desc && desc.includes(qq)) {
      score = 60 - desc.indexOf(qq);
      matchOn = "description";
    }

    return { e, score, matchOn };
  })
    .filter((x) => x.score >= 0 && x.matchOn)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(({ e, matchOn }) => Object.assign({}, e, { matchOn }) as Hit);

  return scored;
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [debounced, setDebounced] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => filterResults(debounced), [debounced]);

  // fechar ao clicar fora
  useEffect(() => {
    function onDocClick(ev: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(ev.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goTo = (hit: CalcEntry) => {
    if (!hit.category || !hit.subcategory || !hit.slug) return;
    setOpen(false);
    setQ("");
    navigate(`/${hit.category}/${hit.subcategory}/${hit.slug}`);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(results[cursor]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search calculators..."
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setCursor(0);
        }}
        onFocus={() => q && setOpen(true)}
        onKeyDown={onKeyDown}
        className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40 transition-all duration-300"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="skn-global-search-listbox"
      />

      {open && results.length > 0 && (
        <div
          id="skn-global-search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-auto"
        >
          {results.map((hit, i) => (
            <button
              key={`${hit.category}/${hit.subcategory}/${hit.slug}`}
              role="option"
              aria-selected={i === cursor}
              onMouseEnter={() => setCursor(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // evita blur antes do click
                goTo(hit);
              }}
              className={`w-full text-left px-4 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted ${
                i === cursor ? "bg-muted" : ""
              }`}
            >
              <div className="text-sm font-medium">{hit.name}</div>
              <div className="text-xs text-muted-foreground">
                {hit.category} / {hit.subcategory?.replace(/-/g, " ")} ·{" "}
                {hit.matchOn === "name"
                  ? "name match"
                  : hit.matchOn === "alias"
                  ? "alias match"
                  : "description match"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
