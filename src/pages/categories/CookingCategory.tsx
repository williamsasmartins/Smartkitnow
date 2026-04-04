import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import RegistryCategorySection from "@/components/RegistryCategorySection";
import SuggestionBox from "@/components/SuggestionBox";

type Item = { name: string; slug: string };

// ===== LISTA OFICIAL (27) =====
const ingredientMath: Item[] = [
  { name: "Cups ↔ Grams ↔ Ounces Converter (por ingrediente)", slug: "cups-grams-ounces-by-ingredient" },
  { name: "Volume ↔ Weight (densidade comum de alimentos)", slug: "volume-weight-food-density" },
  { name: "Fahrenheit ↔ Celsius (forno/temperaturas internas)", slug: "fahrenheit-celsius-oven-internal-temp" },
  { name: "Teaspoon/Tablespoon/Cup ↔ mL Converter", slug: "teaspoon-tablespoon-cup-ml-converter" },
  { name: "Recipe Scaler (x0.5, x2, x3…)", slug: "recipe-scaler" },
  { name: "Serving Size Multiplier (por porções)", slug: "serving-size-multiplier" },
  { name: "Salt % for Brining (salmuera)", slug: "salt-percent-brining" },
  { name: "Alcohol by Volume (ABV) Dilution (culinário)", slug: "alcohol-abv-dilution" },
];

const bakingEssentials: Item[] = [
  { name: "Cake Pan Size & Volume Converter (formas)", slug: "cake-pan-size-volume-converter" },
  { name: "Baker’s Percentage (baker’s math)", slug: "bakers-percentage" },
  { name: "Dough Hydration % (pães/sourdough)", slug: "dough-hydration-percent" },
  { name: "Sourdough Starter Ratio & Feed Planner", slug: "sourdough-starter-ratio-feed-planner" },
  { name: "Yeast Conversion (instantânea ↔ ativa ↔ fresca)", slug: "yeast-conversion-instant-active-fresh" },
  { name: "Flour Blend Substitution Helper", slug: "flour-blend-substitution" },
  { name: "Sugar/Butter/Flour Density Quick-Pick (lookup)", slug: "sugar-butter-flour-density-lookup" },
  { name: "Chocolate/Butter Tempering Temperature Guide", slug: "chocolate-butter-tempering-temperature" },
];

const meatSafetyTimes: Item[] = [
  { name: "Turkey Size, Thaw & Cook Time Calculator", slug: "turkey-thaw-cook-time" },
  { name: "Whole Chicken/Roast Cook Time Estimator", slug: "whole-chicken-roast-cook-time" },
  { name: "Steak Doneness Time & Resting Window", slug: "steak-doneness-time-resting" },
  { name: "Pork/Beef Smoking Time per lb (baixa temperatura)", slug: "pork-beef-smoking-time-per-lb" },
  { name: "Safe Internal Temperature Checker (USDA-style)", slug: "safe-internal-temperature-checker" },
  { name: "Defrost Time (geladeira/água fria) Estimator", slug: "defrost-time-fridge-cold-water" },
];

const everydayRatiosYields: Item[] = [
  { name: "Rice:Water Ratio & Yield (tipo do arroz)", slug: "rice-water-ratio-yield" },
  { name: "Pasta Dry ↔ Cooked Yield & Portions", slug: "pasta-dry-cooked-yield-portions" },
  { name: "Stock/Broth Reduction Time & Yield", slug: "stock-broth-reduction-time-yield" },
  { name: "Oil for Frying (pan depth/volume)", slug: "oil-for-frying-pan-depth-volume" },
  { name: "Icing/Frosting Coverage by Cake Size", slug: "icing-frosting-coverage-cake-size" },
];

const TOTAL = ingredientMath.length + bakingEssentials.length + meatSafetyTimes.length + everydayRatiosYields.length; // 27

export default function CookingCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      {/* empurra tudo abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* coluna esquerda: header + conteúdo */}
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🍳" size={38} className="text-primary" label="Cooking" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Cooking & Baking Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Cooking & Baking Calculators designed for everyday kitchens and serious home bakers.
                    </p>
                    <p>
                      Convert <strong>cups ↔ grams ↔ ounces</strong> by ingredient, translate <strong>spoons/cups ↔ mL</strong>, and switch <strong>Fahrenheit ↔ Celsius</strong> for ovens and internal temperatures.
                    </p>
                    <p>
                      Scale recipes, multiply servings, set precise <strong>salt % for brines</strong>, and plan <strong>sourdough feeds</strong>; compute <strong>baker’s percentage</strong> and <strong>dough hydration</strong>.
                    </p>
                    <p>
                      Estimate <strong>turkey/chicken/roast times</strong>, check <strong>steak doneness</strong>, <strong>safe internal temperatures</strong>, and <strong>defrost timers</strong>.
                    </p>
                    <p>
                      Everyday ratios & yields: rice water ratios, pasta yield & portions, stock/broth reduction, oil for frying, frosting coverage.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    Conversions, kitchen math, baking essentials, safe cooking times, ratios & yields — all in one place. From cups↔grams per ingredient and oven temps to baker’s percentage, hydration, and thaw/cook timers. Quick lookups and practical planners to keep your cooking consistent and stress‑free.
                  </p>
                )}
                {!descExpanded && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                  >
                    Read More
                  </button>
                )}
              </div>
            </header>

            <Section
              emoji="🥄"
              title={`Ingredient Conversions & Kitchen Math (${ingredientMath.length})`}
              description="Cups↔grams by ingredient, common density volume↔weight, oven/food temps, spoons/cups↔mL, recipe scaling, servings multiplier, brining salt %, culinary ABV dilution."
              items={ingredientMath}
              base="/cooking"
            />

            <Section
              emoji="🎂"
              title={`Baking Essentials (${bakingEssentials.length})`}
              description="Pan size & volume swaps, baker’s math, dough hydration, starter feed planning, yeast type conversions, flour blend substitutes, density quick‑picks, tempering temperatures."
              items={bakingEssentials}
              base="/cooking"
            />

            <Section
              emoji="🍗"
              title={`Meat, Poultry & Food Safety Times (${meatSafetyTimes.length})`}
              description="Turkey sizing with thaw/cook time, whole chicken/roast estimators, steak doneness & resting, smoking time per lb, safe internal temperatures, defrost time estimators."
              items={meatSafetyTimes}
              base="/cooking"
            />

            <Section
              emoji="🍚"
              title={`Everyday Kitchen Ratios & Yields (${everydayRatiosYields.length})`}
              description="Rice water ratios and yields, pasta dry↔cooked portions, stock/broth reduction yield & time, oil needed for frying, frosting coverage by cake size."
              items={everydayRatiosYields}
              base="/cooking"
            />

            {/* All cooking calculators from registry — ensures every tool gets at least one internal link */}
            <RegistryCategorySection
              category="cooking"
              title="More Cooking Calculators"
              className="mt-10"
            />

                        {/* Boxes inferiores: Share + Suggest embutido */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          {/* Coluna do right rail */}
          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({
  emoji,
  title,
  description,
  items,
  base,
}: {
  emoji: string;
  title: string;
  description: string;
  items: Item[];
  base: string;
}) {
  const [left, right] = splitTwoColumns(items);

  return (
    <section className="mb-12">
      {/* título da seção com emoji colorido */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      {/* LISTA EM DUAS COLUNAS */}
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
