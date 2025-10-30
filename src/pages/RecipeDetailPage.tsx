import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import AdBannerTop from "@/components/ads/AdBannerTop";
import AdSidebarRight from "@/components/ads/AdSidebarRight";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";
import { getCuisine, getRecipe } from "@/data/recipes/cuisines";

export default function RecipeDetailPage() {
  const { cuisine, recipe } = useParams<{ cuisine: string; recipe: string }>();
  const c = cuisine ? getCuisine(cuisine) : undefined;
  const r = cuisine && recipe ? getRecipe(cuisine, recipe) : undefined;

  if (!c || !r) return <Navigate to="/recipes" replace />;

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
              <Link to={`/recipes/${c.key}`} className="hover:underline">{c.name}</Link>
              <span> &gt; </span>
              <span>{r.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-semibold text-primary">{r.title}</h1>
            <p className="mt-2 text-sm">
              {c.name} — <Link to={`/recipes/${c.key}`} className="text-primary hover:underline">see all {c.name} recipes</Link>
            </p>
          </header>
          <aside className="lg:col-span-3">
            <AdSidebarRight topOffset={0} />
          </aside>
        </div>

        {/* Conteúdo da receita — preencha quando for criar de verdade */}
        <article className="prose max-w-none dark:prose-invert">
          <h2>Overview</h2>
          <p>Short intro about the dish. When/where it’s served, variations, and key flavors.</p>

          <h2>Ingredients</h2>
          <ul>
            <li>…</li>
          </ul>

          <h2>Instructions</h2>
          <ol>
            <li>…</li>
          </ol>

          <h3>Tips & Variations</h3>
          <ul>
            <li>…</li>
          </ul>

          <h3>Nutrition (per serving)</h3>
          <p>Calories, macros (approx.), key micronutrients.</p>

          <h3>References</h3>
          <ul>
            <li>…</li>
          </ul>
        </article>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ShareBox />
          {/* Mantém engajamento/sugestões conforme requisito */}
          <SuggestBoxInline />
        </div>
      </main>
    </div>
  );
}