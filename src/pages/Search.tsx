import React, { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { REGISTRY, type RegistryEntry } from "@/data/calculatorRegistry";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import CalculatorCard from "@/components/cards/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = (params.get("q") || "").trim();

  const matches: RegistryEntry[] = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return REGISTRY.filter((e) => {
      const hay = [
        e.title || "",
        e.slug || "",
        e.category || "",
        e.subcategory || "",
        e.displayCategory || "",
        e.displaySubcategory || "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    }).sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }, [q]);

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const data = new FormData(form);
    const value = String(data.get("q") || "").trim();
    if (!value) return;
    setParams({ q: value });
  };

  return (
    <div className="min-h-screen">
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        {/* Search header */}
        <header className="py-6 border-b mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">Search</h1>
          <p className="mt-2 max-w-3xl text-sm md:text-base text-muted-foreground">
            Find calculators and smart tips by title, category, or keywords.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-xl">
            <Input name="q" defaultValue={q} placeholder="Search calculators, tips, recipes…" className="h-9" />
            <Button type="submit" className="h-9">Search</Button>
            {q && (
              <Button type="button" variant="ghost" className="h-9" onClick={() => navigate("/search")}>Clear</Button>
            )}
          </form>
        </header>

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
                  {matches.map((e) => (
                    <CalculatorCard
                      key={e.slug}
                      category={e.category}
                      subcategory={e.subcategory}
                      slug={e.slug}
                      name={e.title}
                    />
                  ))}
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