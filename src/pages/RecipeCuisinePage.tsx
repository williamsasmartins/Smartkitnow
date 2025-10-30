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

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <header className="lg:col-span-9 py-6">
            <nav aria-label="Breadcrumb" className="text-sm mb-2 text-muted-foreground">
              <Link to="/" className="hover:underline">Home</Link>
              <span> &gt; </span>
              <Link to="/recipes" className="hover:underline">Recipes</Link>
              <span> &gt; </span>
              <span>{data.name}</span>
            </nav>
            <div className="flex items-center gap-3">
              <CountryFlag flag={data.flag} size={36} renderAs="svg" alt={`${data.name} flag`} />
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
          <aside className="lg:col-span-3">
            <AdSidebarRight topOffset={0} />
          </aside>
        </div>

        {/* Lista de receitas (duas colunas responsivas com bullets) */}
        <section className="lg:col-span-9">
          <ul
            className="grid gap-x-10 gap-y-2.5 grid-cols-1 md:grid-cols-2 list-disc list-inside"
            aria-label={`${data.name} recipes`}
          >
            {data.recipes.map((r) => {
              const display = r.title ?? r.slug;
              return (
                <li key={r.slug} className="leading-relaxed">
                  <Link
                    to={`/recipes/${data.key}/${r.slug}`}
                    className="text-primary hover:underline text-base md:text-[1.05rem] font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-sm"
                    aria-label={`${display} — abrir detalhes da receita`}
                  >
                    {display}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Boxes inferiores */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <ShareBox />
          <SuggestBoxInline />
        </div>
      </main>
    </div>
  );
}