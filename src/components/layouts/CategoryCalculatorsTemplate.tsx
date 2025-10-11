// src/components/layouts/CategoryCalculatorsTemplate.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  listSubcategoriesOfCategory,
  listByCategorySubcategory,
  FRIENDLY_TITLES,
  subcategoryIcon,
  categoryIcon,
} from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";
import CalculatorLink from "@/components/common/CalculatorLink";

// Helper: Alternate emoji pools per category to avoid duplicates by swapping
const ALT_EMOJI_POOLS: Record<string, string[]> = {
  cooking: ["🍳", "🍽️", "🥘", "🍲", "🍝", "🧁", "🍰", "🍞", "🥗", "🍔"],
  math: ["➗", "➕", "➖", "✖️", "📐", "📏", "📊", "📈", "🧮", "🔢"],
  health: ["❤️", "🩺", "🧠", "🫁", "🦷", "🩸", "🏥", "💊", "🧪", "🥼"],
  construction: ["🧱", "🛠️", "🪚", "🏗️", "🔨", "🪛", "🚧", "📐", "📏", "🧰"],
  financial: ["💵", "💰", "📈", "📉", "💳", "🏦", "🧮", "💹", "💱", "🪙"],
  sports: ["🏀", "⚽", "🏈", "🎾", "🏐", "🥎", "⚾", "🏓", "🏒", "🥊"],
};
const GENERIC_FALLBACK: string[] = ["🔷", "🔶", "🔺", "🔹", "🔸", "⭐", "🌟", "✅", "📌", "🧭"];

function getUniqueEmojiForSubcategory(baseEmoji: string | undefined, category: string, usedIcons: Set<string>): string | undefined {
  const pool = ALT_EMOJI_POOLS[category] || GENERIC_FALLBACK;
  if (baseEmoji && !usedIcons.has(baseEmoji)) return baseEmoji;
  for (const e of pool) {
    if (!usedIcons.has(e)) return e;
  }
  for (const e of GENERIC_FALLBACK) {
    if (!usedIcons.has(e)) return e;
  }
  return undefined;
}

export interface CategoryCalculatorsTemplateProps {
  category: string; // ex: "financial", "health"
  description: string; // descrição do H1 (com Read More)
  canonical?: string; // por padrão: https://www.smartkitnow.com/<category>
  titleOverride?: string; // por padrão: FRIENDLY_TITLES[category]
  breadcrumbsOverride?: { name: string; url: string }[]; // por padrão: Home -> /<category>
  marginTopClass?: string; // por padrão: "mt-[156px] md:mt-[176px]"
  showRightRail?: boolean; // por padrão: true
  showTopBanner?: boolean; // por padrão: true
  showBottomBanner?: boolean; // por padrão: true
  railsSticky?: boolean; // por padrão: false
  backTo?: string; // por padrão: "/"
}

export default function CategoryCalculatorsTemplate({
  category,
  description,
  canonical,
  titleOverride,
  breadcrumbsOverride,
  marginTopClass = "mt-[156px] md:mt-[176px]",
  showRightRail = true,
  showTopBanner = true,
  showBottomBanner = true,
  railsSticky = false,
  backTo = "/",
}: CategoryCalculatorsTemplateProps) {
  const navigate = useNavigate();
  const subcats = listSubcategoriesOfCategory(category);
  const categoryTitle = titleOverride || FRIENDLY_TITLES[category] || "Calculators";
  const [descOpen, setDescOpen] = useState(false);

  // Evita repetição de ícones de subcategorias dentro da mesma página
  // Em vez de remover, troca o ícone por um alternativo único por página
  const usedIcons = new Set<string>();
  
  const totalCount = subcats.reduce((acc, sc) => acc + (Number(sc.count) || 0), 0);

  const canonicalUrl = canonical || `https://www.smartkitnow.com/${category}`;
  const breadcrumbs =
    breadcrumbsOverride || [
      { name: "Home", url: "https://www.smartkitnow.com/" },
      { name: categoryTitle, url: canonicalUrl },
    ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`${categoryTitle} · SmartKitNow`}
        description={description}
        canonical={canonicalUrl}
        breadcrumbs={breadcrumbs}
      />

      <Header />

      {/* Espaço para o header fixo + respiro antes do rodapé */}
      <main className={`${marginTopClass} pb-28`}>
        <PageWithRails
          showRails
          showLeftRail={false}
          showRightRail={showRightRail}
          showTopBanner={showTopBanner}
          showBottomBanner={showBottomBanner}
          railsSticky={railsSticky}
          titleBlock={
            <div className="text-left">
              <div className="mb-6 text-left">
                <Button
                  variant="default"
                  onClick={() => navigate(backTo)}
                  className="flex items-center gap-2 px-3 py-2 md:py-2.5"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              {/* H1 com ícone da categoria */}
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2" style={{ color: "#5c82ee" }}>
                <span className="text-[30px] leading-none select-none" aria-hidden="true">
                  {categoryIcon(category)}
                </span>
                {categoryTitle}
              </h1>

              {/* Contagem total */}
              <div className="text-sm mb-3" style={{ color: "#9aa0ae" }}>
                {totalCount} calculators
              </div>

              {/* Descrição estreita + Read More */}
              <p className={`${descOpen ? "" : "line-clamp-3"} text-lg max-w-[740px]`} style={{ color: "#747886" }}>
                {description}
              </p>
              {!descOpen && (
                <button
                  className="mt-2 inline-flex items-center text-primary hover:text-primary/80 text-sm"
                  onClick={() => setDescOpen(true)}
                >
                  Read More
                </button>
              )}
            </div>
          }
        >
          {/* Seções por subcategoria (ícone + título) e listas em 2 colunas */}
          <div className="space-y-10">
            {subcats.map((sc) => {
               const baseEmoji = subcategoryIcon(sc.slug, category);
               const emoji = getUniqueEmojiForSubcategory(baseEmoji, category, usedIcons);
               if (emoji) {
                 usedIcons.add(emoji);
               }
               const calcs = listByCategorySubcategory(category, sc.slug) || [];
               const mid = Math.ceil(calcs.length / 2);
               const colA = calcs.slice(0, mid);
               const colB = calcs.slice(mid);

               return (
                 <section key={sc.slug}>
                   {/* Título da subcategoria com ícone */}
                   <div className="flex items-center gap-3 mb-3">
                    {emoji && (
                      <span className="text-[20px] leading-none select-none" aria-hidden="true">
                        {emoji}
                      </span>
                    )}
                     <h2 className="text-[22px] md:text-[24px] font-semibold tracking-[-0.01em] text-foreground">
                       {sc.title}
                     </h2>
                     <span className="text-sm skn-text-muted">({sc.count})</span>
                   </div>

                  {/* Listas em 2 colunas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <ul className="list-disc pl-5 space-y-3 leading-7">
                      {colA.map((c) => (
                        <li key={c.slug}>
                          <CalculatorLink to={`/${category}/${c.slug}`}>{c.title}</CalculatorLink>
                        </li>
                      ))}
                    </ul>
                    <ul className="list-disc pl-5 space-y-3 leading-7 mt-3 md:mt-0">
                      {colB.map((c) => (
                        <li key={c.slug}>
                          <CalculatorLink to={`/${category}/${c.slug}`}>{c.title}</CalculatorLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        </PageWithRails>
      </main>
    </div>
  );
}