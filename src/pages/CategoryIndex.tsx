import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { REGISTRY, type RegistryEntry } from "@/data/calculatorRegistry";
import { getCategoryMeta } from "@/data/categoryMeta";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import CalculatorCard from "@/components/cards/CalculatorCard";
import EmojiIcon from "@/components/ui/EmojiIcon";

export default function CategoryIndex() {
  const { category = "" } = useParams();
  const meta = getCategoryMeta(category);
  const title = meta?.display ?? category;

  // filtra entries por categoria
  const entries = useMemo(
    () => REGISTRY.filter(e => e.category === category),
    [category]
  );

  // agrupa por subcategoria e ordena
  const grouped = useMemo(() => {
    const map = new Map<string, RegistryEntry[]>();
    for (const e of entries) {
      const key = e.subcategory || "general";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    for (const arr of map.values()) arr.sort((a,b) => (a.title || "").localeCompare(b.title || ""));
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]));
  }, [entries]);

  return (
    <div className="min-h-screen">
      {/* topo com banner */}
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        {/* header da categoria */}
        <header className="py-6 border-b mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-3">
            {meta?.emoji && (
              <EmojiIcon symbol={meta.emoji} size={32} className="text-primary" label={meta?.display ?? title} />
            )}
            {meta?.display ?? title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm md:text-base text-muted-foreground">
            Explore curated tools in {title}. Each calculator includes explanations, formulas,
            and worked examples to help you get precise answers fast.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* coluna principal: esquerda (9) */}
           <section className="lg:col-span-9 pr-[15px]">
            {/* grid de cards por subcategoria */}
            <div className="space-y-10">
              {grouped.map(([subKey, items]) => (
                <div key={subKey}>
                  {/* título da seção/subcategoria */}
                  <h2 className="text-xl font-semibold mb-3">
                    {/* usamos o display via CalculatorCard footer; manter simples aqui */}
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((e) => (
                      <CalculatorCard
                        key={e.slug}
                        category={e.category}
                        subcategory={e.subcategory}
                        slug={e.slug}
                        name={e.title}
                        // se quiser, acrescente descrições reais aqui por slug:
                        // description="Board foot calculator to estimate lumber volume from dimensions."
                      />
                    ))}
                  </div>
                </div>
              ))}

              {!entries.length && (
                <p className="opacity-70">No calculators found for this category yet.</p>
              )}
            </div>
          </section>

          {/* sidebar com anúncios (sticky) */}
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