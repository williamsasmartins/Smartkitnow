import React, { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { calculatorRegistry } from "@/data/calculatorRegistry";
import { GAME_REGISTRY } from "@/data/gameRegistry";
import { getCategoryMeta, getDisplaySubcategory } from "@/data/categoryMeta";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import CalculatorCard from "@/components/cards/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchResult = {
  type: "calculator" | "game";
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  description?: string;
};

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = (params.get("q") || "").trim();

  // Controlled input state
  const [localQuery, setLocalQuery] = useState(q);

  useEffect(() => {
    setLocalQuery(q);
  }, [q]);

  const matches: SearchResult[] = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();

    const calcMatches: SearchResult[] = calculatorRegistry.filter((e) => {
      const displayCat = getCategoryMeta(e.category)?.display || "";
      const displaySub = e.subcategory ? getDisplaySubcategory(e.category, e.subcategory) : "";

      const hay = [
        e.title || "",
        e.slug || "",
        e.category || "",
        e.subcategory || "",
        displayCat,
        displaySub,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    }).map(e => ({
      type: "calculator",
      title: e.title,
      slug: e.slug,
      category: e.category,
      subcategory: e.subcategory,
      description: e.description
    }));

    const gameMatches: SearchResult[] = GAME_REGISTRY.filter((g) => {
      const hay = [g.title, g.slug, g.description, "game", "play"].join(" ").toLowerCase();
      return hay.includes(needle);
    }).map(g => ({
      type: "game",
      title: g.title,
      slug: g.slug,
      category: "games",
      description: g.description
    }));

    return [...calcMatches, ...gameMatches].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [q]);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const value = localQuery.trim();
    if (!value) return;
    setParams({ q: value });
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        {/* Search header */}
        {/* Search header - OMIT if query exists (Clean UI) */}
        {!q && (
          <header className="py-6 border-b mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-primary">Search</h1>
            <p className="mt-2 max-w-3xl text-sm md:text-base text-muted-foreground">
              Find calculators, games, and smart tips by title, category, or keywords.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-xl">
              <Input
                name="q"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search calculators, games, tips…"
                className="h-9"
              />
              <Button type="submit" className="h-9">Search</Button>
            </form>
          </header>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Results column */}
          <section className="lg:col-span-9 pr-[15px]">
            {!q && (
              <p className="opacity-70">Type a query to search across all tools.</p>
            )}

            {q && matches.length === 0 && (
              <p className="opacity-70">No results for "{q}". Try different keywords.</p>
            )}

            {q && matches.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  {matches.length} result{matches.length === 1 ? "" : "s"} for "{q}"
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {matches.map((e) => {
                    if (e.type === "game") {
                      return (
                        <article key={e.slug} className="border rounded-xl p-4 bg-card hover:shadow-md transition-shadow duration-300">
                          <header className="flex items-center gap-2 mb-2">
                            <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card text-xs">🎮</span>
                            <h3 className="text-lg font-semibold leading-tight">
                              <Link to={`/games/${e.slug}`} className="hover:underline">
                                {e.title}
                              </Link>
                            </h3>
                          </header>
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {e.description}
                          </p>
                          <footer className="mt-3 text-xs opacity-70">
                            Games
                          </footer>
                        </article>
                      );
                    }
                    return (
                      <CalculatorCard
                        key={e.slug}
                        category={e.category}
                        subcategory={e.subcategory || "general"}
                        slug={e.slug}
                        name={e.title}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Sidebar ads */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky pr-[65px]" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
