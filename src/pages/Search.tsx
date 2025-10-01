// src/pages/Search.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { REGISTRY, type CalcEntry } from "@/data/calculatorRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import PageWithRails from "@/components/layouts/PageWithRails";

const normalize = (s: string) => (s || "").toLowerCase().trim();

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name) || "", [search, name]);
}

type Hit = CalcEntry & { score: number; matchOn: "name" | "alias" | "description" };

function filterAll(q: string): Hit[] {
  if (!q) return [];
  const qq = normalize(q);

  return REGISTRY.map((e) => {
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
    .map(({ e, score, matchOn }) => Object.assign({}, e, { score, matchOn }) as Hit);
}

export default function SearchPage() {
  const navigate = useNavigate();
  const qp = useQueryParam("q");
  const [q, setQ] = useState(qp);

  useEffect(() => setQ(qp), [qp]);

  const results = useMemo(() => filterAll(q), [q]);

  // Agrupa por category/subcategory para ficar organizado
  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const hit of results) {
      const key = `${hit.category} / ${hit.subcategory}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(hit);
    }
    return Array.from(map.entries());
  }, [results]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    // Atualiza a URL com ?q=...
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title={q ? `Search: ${q} · Smart Kit Now` : "Search · Smart Kit Now"}
        description="Search calculators across all categories on Smart Kit Now."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Search", url: "https://www.smartkitnow.com/search" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: "Search",
          url: typeof window !== "undefined" ? window.location.href : "",
          description: "Search calculators across all categories.",
        }}
      />

      <Header />

      <main className="pt-20">
        <PageWithRails
          titleBlock={
            <div className="text-center">
              <h1 className="skn-title text-4xl font-bold mb-4">Search</h1>
              <p className="skn-sub text-lg max-w-2xl mx-auto mb-6">
                Find calculators by name, alias, or description.
              </p>

              {/* Barra de busca centralizada na página de resultados */}
              <form onSubmit={onSubmit} className="max-w-2xl mx-auto relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search calculators…"
                  className="pl-10 bg-muted/50 border-border/60 focus:border-primary/40"
                />
              </form>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          {/* Estado vazio */}
          {!q ? (
            <p className="text-center text-muted-foreground mt-8">
              Type a term above to search across all calculators.
            </p>
          ) : results.length === 0 ? (
            <p className="text-center text-muted-foreground mt-8">
              No results found for <span className="font-semibold">“{qp}”</span>.
            </p>
          ) : (
            <div className="space-y-8">
              {grouped.map(([group, items]) => (
                <section key={group} className="space-y-3">
                  <h2 className="text-xl font-semibold skn-title">{group}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((hit) => {
                      const href = `/${hit.category}/${hit.subcategory}/${hit.slug}`;
                      return (
                        <Link key={href} to={href} className="group">
                          <Card className="hover:shadow-soft transition-all bg-card border-border/50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="font-semibold text-foreground group-hover:opacity-90">
                                    {hit.name}
                                  </div>
                                  {hit.description && (
                                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {hit.description}
                                    </div>
                                  )}
                                  <div className="text-xs text-muted-foreground mt-1">
                                    match: {hit.matchOn}
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
