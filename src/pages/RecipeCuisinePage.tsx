import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";
import CountryFlag from "@/components/recipes/CountryFlag";
import { getCuisine } from "@/data/recipes/cuisines";

export default function RecipeCuisinePage() {
  const { cuisine } = useParams<{ cuisine: string }>();
  const data = cuisine ? getCuisine(cuisine) : undefined;

  if (!data) return <Navigate to="/recipes" replace />;

  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Coluna principal (header + lista + boxes) */}
          <div className="lg:col-span-9 pr-[15px]">
            <header className="py-6">
              <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
                <Link to="/" className="hover:underline">Home</Link>
                <span> &gt; </span>
                <Link to="/recipes" className="hover:underline">Recipes</Link>
                <span> &gt; </span>
                <span>{data.name}</span>
              </nav>
              <div className="flex items-center gap-3">
                <CountryFlag code={data.countryCode} size={36} alt={`${data.name} flag`} />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">
                  {data.name} Recipes
                </h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  ({data.recipes.length})
                </span>
              </div>
              {data.description && (
                <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-4xl">
                  {data.description}
                </p>
              )}
            </header>

            {/* Lista (duas colunas de links) */}
            <section>
              {data.recipes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  We’re curating recipes for this cuisine. Check back soon.
                </p>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {data.recipes.map((r) => (
                    <Link
                      key={r.slug}
                      to={`/recipes/${data.key}/${r.slug}`}
                      className="text-primary hover:underline text-[1.05rem] leading-7"
                    >
                       {r.title}
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Boxes inferiores */}
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <ShareBox />
              <SuggestBoxInline />
            </div>
          </div>

          {/* Coluna do right rail */}
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
