import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

// Mirror structure of FinancialCategory / SportsCategory

type Item = { name: string; slug: string };

// BBQ & Smoking
const bbqSmoking: Item[] = [
  { name: "Texas-Style Brisket", slug: "texas-style-brisket" },
  { name: 'Brazilian Picanha "Top Sirloin Cap"', slug: "brazilian-picanha-top-sirloin-cap" },
  { name: "Pulled Pork", slug: "pulled-pork" },
  { name: "St. Louis Ribs", slug: "st-louis-ribs" },
  { name: "Baby Back Ribs", slug: "baby-back-ribs" },
  { name: "Beef Short Ribs", slug: "beef-short-ribs" },
  { name: "Tri-Tip Steak", slug: "tri-tip-steak" },
  { name: "Reverse Sear Ribeye", slug: "reverse-sear-ribeye" },
  { name: "Smoked Turkey", slug: "smoked-turkey" },
  { name: "Smoked Salmon", slug: "smoked-salmon" },
  { name: "Spatchcock Chicken", slug: "spatchcock-chicken" },
  { name: "Beer Can Chicken", slug: "beer-can-chicken" },
  { name: "Chicken Wings", slug: "chicken-wings" },
  { name: "Grilled Shrimp", slug: "grilled-shrimp" },
  { name: "Grilled Vegetables", slug: "grilled-vegetables" },
];

// International & Regional Cuisines (subcategories)
const internationalRegional: Item[] = [
  { name: "Italian Recipes", slug: "italian" },
  { name: "Mexican Recipes", slug: "mexican" },
  { name: "Brazilian Recipes", slug: "brazilian" },
  { name: "Portuguese Recipes", slug: "portuguese" },
  { name: "Japanese Recipes", slug: "japanese" },
  { name: "Chinese Recipes", slug: "chinese" },
  { name: "Thai Recipes", slug: "thai" },
  { name: "Indian Recipes", slug: "indian" },
  { name: "Middle Eastern & Levant Recipes", slug: "middle-eastern" },
  { name: "Mediterranean Recipes", slug: "mediterranean" },
  { name: "American Recipes", slug: "american" },
  { name: "Canadian Recipes", slug: "canadian" },
  { name: "Russian & Eastern European Recipes", slug: "russian-eastern-european" },
];

// Meal Type & Category
const mealTypeCategory: Item[] = [
  { name: "Breakfast & Brunch", slug: "breakfast-brunch" },
  { name: "Lunch & Light Meals", slug: "lunch-light-meals" },
  { name: "Dinner Mains", slug: "dinner-mains" },
  { name: "Soups & Stews", slug: "soups-stews" },
  { name: "Salads & Bowls", slug: "salads-bowls" },
  { name: "Sandwiches & Burgers", slug: "sandwiches-burgers" },
  { name: "Pasta & Noodles", slug: "pasta-noodles" },
  { name: "Rice & Grains", slug: "rice-grains" },
  { name: "Desserts & Baking", slug: "desserts-baking" },
  { name: "Sides & Vegetables", slug: "sides-vegetables" },
];

// Techniques & Utility
const techniquesUtility: Item[] = [
  { name: "Sauces, Stocks & Condiments", slug: "sauces-stocks-condiments" },
  { name: "Seasonings & Spice Blends", slug: "seasonings-spice-blends" },
  { name: "Marinades & Brines", slug: "marinades-brines" },
  { name: "Pickles & Ferments", slug: "pickles-ferments" },
  { name: "Drinks & Beverages", slug: "drinks-beverages" },
  { name: "Kitchen Ratios & Timers", slug: "kitchen-ratios-timers" },
  { name: "Meal-Prep & Freezer-Friendly", slug: "meal-prep-freezer-friendly" },
];

// Dietary & Specialty
const dietarySpecialty: Item[] = [
  { name: "Baby & Toddler Foods", slug: "baby-toddler-foods" },
  { name: "Vegan & Plant-Based", slug: "vegan-plant-based" },
  { name: "Gluten-Free", slug: "gluten-free" },
  { name: "Vegetarian (Ovo-Lacto)", slug: "vegetarian-ovo-lacto" },
  { name: "Low-Carb / Keto", slug: "low-carb-keto" },
  { name: "High-Protein / Fitness", slug: "high-protein-fitness" },
  { name: "Allergen-Friendly", slug: "allergen-friendly" },
];

// Child Nutrition Tips
const childNutritionTips: Item[] = [
  { name: "Feeding Guidelines by Age", slug: "feeding-guidelines-by-age" },
  { name: "Infant Feeding Tips & Safety", slug: "infant-feeding-tips-safety" },
];

const TOTAL =
  bbqSmoking.length +
  internationalRegional.length +
  mealTypeCategory.length +
  techniquesUtility.length +
  dietarySpecialty.length +
  childNutritionTips.length;

export default function RecipesCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Recipes"
        description={`Explore ${TOTAL} recipe groups covering BBQ & smoking, world cuisines, meal types, techniques, dietary needs, and child nutrition tips. Organized like Financial for consistent layout, navigation, and SEO.`}
        canonical="https://www.smartkitnow.com/recipes"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/recipes", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "recipes, bbq, smoking, world cuisines, meal prep, sauces, vegan, gluten-free, keto, high-protein, toddler foods" }]}
      />

      {/* offset below fixed header */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* coluna esquerda: header + conteúdo */}
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="📚" size={38} className="text-primary" label="Recipes" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Recipes</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} recipes
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      BBQ & Smoking: brisket, ribs, pulled pork, poultry, salmon and grilled seafood & veggies.
                    </p>
                    <p>
                      International & Regional: Italian, Mexican, Brazilian, Portuguese, Japanese, Chinese, Thai, Indian, Middle Eastern, Mediterranean, American, Canadian, Russian & Eastern European.
                    </p>
                    <p>
                      Meal Types: breakfast & brunch, lunch, dinner mains, soups & stews, salads & bowls, sandwiches & burgers, pasta/noodles, rice/grains, desserts & baking, sides & vegetables.
                    </p>
                    <p>
                      Techniques & Utility: sauces, stocks & condiments; spice blends; marinades & brines; pickles & ferments; drinks & beverages; kitchen ratios & timers; and meal-prep & freezer-friendly.
                    </p>
                    <p>
                      Dietary & Specialty: baby & toddler foods, vegan & plant-based, gluten-free, vegetarian (ovo-lacto), low-carb/keto, high-protein/fitness, and allergen-friendly.
                    </p>
                    <p>
                      Child Nutrition: feeding guidelines by age and infant feeding tips & safety.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    Organized recipe hub mirroring Financial’s layout: BBQ & smoking, world cuisines, meal types, kitchen techniques, dietary needs, and child nutrition. Clean navigation, responsive two-column lists, and SEO-ready metadata.
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
              emoji="🔥"
              title={`BBQ & Smoking (${bbqSmoking.length})`}
              description="Smoked and grilled favorites: brisket, ribs, pulled pork, poultry, seafood, and veggies."
              items={bbqSmoking}
              base="/recipes"
            />

            <Section
              emoji="🌍"
              title={`International & Regional Cuisines (${internationalRegional.length})`}
              description="Explore cuisines from Italy to Thailand: classics, street food, regional specialties, and balanced Mediterranean fare."
              items={internationalRegional}
              base="/recipes"
            />

            <Section
              emoji="🍽️"
              title={`Meal Type & Category (${mealTypeCategory.length})`}
              description="From breakfast & brunch to dinner mains, soups & stews, salads & bowls, pasta/noodles, rice/grains, desserts, and sides."
              items={mealTypeCategory}
              base="/recipes"
            />

            <Section
              emoji="🧂"
              title={`Techniques & Utility (${techniquesUtility.length})`}
              description="Sauces, stocks & condiments; spice blends; marinades & brines; pickles & ferments; drinks; kitchen ratios & timers; meal-prep."
              items={techniquesUtility}
              base="/recipes"
            />

            <Section
              emoji="🥦"
              title={`Dietary & Specialty (${dietarySpecialty.length})`}
              description="Baby & toddler foods, vegan & plant-based, gluten-free, vegetarian, low-carb/keto, high-protein, allergen-friendly."
              items={dietarySpecialty}
              base="/recipes"
            />

            <Section
              emoji="👶"
              title={`Child Nutrition Tips (${childNutritionTips.length})`}
              description="Feeding guidelines by age and infant feeding tips & safety."
              items={childNutritionTips}
              base="/recipes"
            />

            {/* bottom boxes: Share + Suggest */}
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
      {/* section heading with emoji */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      {/* two-column list */}
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
