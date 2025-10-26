import React from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../components/ads/AdBannerTop";
import AdSidebarRight from "../components/ads/AdSidebarRight";
import EmojiIcon from "../components/ui/EmojiIcon";
import ShareBox from "../components/share/ShareBox";
import SuggestBoxInline from "../components/contact/SuggestBoxInline";
import SEOHead from "@/components/SEOHead";

// Item para receita/categoria com slug opcional
 type Item = { name: string; slug?: string };

/* =====================
   LISTAS DE RECEITAS
   ===================== */
// Parte 1
const bbqSmoking: Item[] = [
  { name: "01) Smoked Brisket" },
  { name: "02) Pulled Pork" },
  { name: "03) St. Louis Ribs" },
  { name: "04) Chicken Wings (Dry Rub)" },
  { name: "05) Texas-style Beef Ribs" },
  { name: "06) Smoked Sausage Links" },
];

const regionalCuisines: Item[] = [
  { name: "Italian — Pasta & Risotto" },
  { name: "French — Bistro & Sauces" },
  { name: "Japanese — Izakaya & Home-Style" },
  { name: "Chinese — Wok & Dim Sum" },
  { name: "Korean — BBQ & Ferments" },
  { name: "Indian — Curries & Breads" },
  { name: "Thai — Street Food & Curries" },
  { name: "Mexican — Tacos & Salsas" },
  { name: "Middle Eastern — Meze & Grills" },
  { name: "Greek — Mediterranean & Home Classics" },
  { name: "Brazilian — Feijoada & Grill" },
  { name: "Portuguese — Seafood & Stews" },
];

const appetizersFingerFoods: Item[] = [
  { name: "01) Classic Deviled Eggs" },
  { name: "02) Garlic Parmesan Wings" },
  { name: "03) Nacho Supreme" },
  { name: "04) Hummus Trio" },
];

const breakfastBrunch: Item[] = [
  { name: "01- Buttermilk Pancakes" },
  { name: "02- Eggs Benedict" },
  { name: "03- French Toast" },
];

// Parte 2
const soupsStewsOnePot: Item[] = [
  { name: "Chicken Noodle Soup" },
  { name: "Beef Chili" },
  { name: "Lentil Stew" },
  { name: "Seafood Chowder" },
  { name: "Minestrone" },
  { name: "One-Pot Pasta" },
];

const saladsDressings: Item[] = [
  { name: "Caesar Salad" },
  { name: "Greek Salad" },
  { name: "Coleslaw" },
  { name: "Balsamic Vinaigrette" },
  { name: "Ranch Dressing" },
  { name: "Tahini Lemon Dressing" },
];

const pastaRiceGrains: Item[] = [
  { name: "Spaghetti Bolognese" },
  { name: "Risotto alla Milanese" },
  { name: "Pilaf de Arroz" },
  { name: "Fried Rice" },
  { name: "Couscous Vegetariano" },
  { name: "Mac and Cheese" },
];

const poultryBeefPork: Item[] = [
  { name: "Roast Chicken" },
  { name: "Beef Stroganoff" },
  { name: "Pork Chops" },
  { name: "Chicken Parmesan" },
  { name: "Beef Meatballs" },
  { name: "Pulled Pork Sliders" },
];

const seafoodFish: Item[] = [
  { name: "Grilled Salmon" },
  { name: "Fish Tacos" },
  { name: "Garlic Shrimp" },
  { name: "Baked Cod" },
  { name: "Ceviche" },
  { name: "Tuna Steak" },
];

const sandwichesWrapsBurgers: Item[] = [
  { name: "Club Sandwich" },
  { name: "BLT" },
  { name: "Chicken Caesar Wrap" },
  { name: "Veggie Wrap" },
  { name: "Smash Burger" },
  { name: "Turkey Burger" },
];

const bakingDesserts: Item[] = [
  { name: "Chocolate Cake" },
  { name: "Brownies" },
  { name: "Apple Pie" },
  { name: "Cheesecake" },
  { name: "Tiramisu" },
  { name: "Panna Cotta" },
];

const sourdoughArtisanBreads: Item[] = [
  { name: "Sourdough Boule" },
  { name: "Baguette" },
  { name: "Ciabatta" },
  { name: "Focaccia" },
  { name: "Rye Bread" },
  { name: "Whole Wheat Loaf" },
];

const saucesStocksCondiments: Item[] = [
  { name: "Tomato Sauce" },
  { name: "Bechamel" },
  { name: "Chicken Stock" },
  { name: "Beef Broth" },
  { name: "Mayo" },
  { name: "BBQ Sauce" },
];

const drinksCoffeeMocktailsCocktails: Item[] = [
  { name: "Cold Brew" },
  { name: "Cappuccino" },
  { name: "Mojito" },
  { name: "Virgin Pina Colada" },
  { name: "Whiskey Sour" },
  { name: "Iced Tea" },
];

const mealPrepFreezerFriendly: Item[] = [
  { name: "Chicken & Rice Bowls" },
  { name: "Beef & Veggie Stir-Fry" },
  { name: "Turkey Meatballs" },
  { name: "Freezer Breakfast Burritos" },
  { name: "Chili Packets" },
  { name: "Soup Portions" },
];

const holidaySeasonal: Item[] = [
  { name: "Roast Turkey" },
  { name: "Honey Ham" },
  { name: "Mashed Potatoes" },
  { name: "Stuffing" },
  { name: "Cranberry Sauce" },
  { name: "Pumpkin Pie" },
];

// Parte 3
const budgetAppliances: Item[] = [
  { name: "15-Minute Dinners" },
  { name: "Slow Cooker Favorites" },
  { name: "Pressure Cooker (Instant Pot)" },
  { name: "Air Fryer Recipes" },
  { name: "Budget-Friendly Meals" },
  { name: "One-Pan Sheet Meals" },
];

const dietarySpecialty: Item[] = [
  { name: "Baby & Toddler Foods" },
  { name: "Vegan & Plant-Based" },
  { name: "Gluten-Free" },
  { name: "Vegetarian (Ovo-Lacto)" },
  { name: "Low-Carb / Keto" },
  { name: "High-Protein / Fitness" },
  { name: "Allergen-Friendly Recipes" },
];

// Parte 4
const childNutritionTips: Item[] = [
  { name: "Balanced Snack Ideas" },
  { name: "Healthy Lunchbox Tips" },
  { name: "Iron-Rich Foods for Kids" },
  { name: "Picky Eater Strategies" },
  { name: "Hydration & Safe Temperatures" },
  { name: "Age-Appropriate Portions" },
];

// TOTAL de receitas (soma de todas as listas acima)
const TOTAL =
  bbqSmoking.length +
  regionalCuisines.length +
  appetizersFingerFoods.length +
  breakfastBrunch.length +
  soupsStewsOnePot.length +
  saladsDressings.length +
  pastaRiceGrains.length +
  poultryBeefPork.length +
  seafoodFish.length +
  sandwichesWrapsBurgers.length +
  bakingDesserts.length +
  sourdoughArtisanBreads.length +
  saucesStocksCondiments.length +
  drinksCoffeeMocktailsCocktails.length +
  mealPrepFreezerFriendly.length +
  holidaySeasonal.length +
  budgetAppliances.length +
  dietarySpecialty.length +
  childNutritionTips.length;

export default function RecipePage() {
  return (
    <div className="min-h-screen">
      {/* empurra tudo abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <SEOHead
        title="Recipes & Cooking"
        description="Explore recipes and cooking guides: BBQ & smoking, international cuisines, soups & one-pot, salads & dressings, pasta & grains, poultry/beef/pork, seafood & fish, sandwiches & burgers, baking & desserts, sourdough & artisan breads, sauces & condiments, drinks, meal prep, holiday & seasonal, budget & appliances, dietary & specialty, and child nutrition tips."
        canonical="https://www.smartkitnow.com/recipes"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/recipes", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "recipes, cooking, BBQ, smoking, international cuisines, soups, stews, salads, dressings, pasta, rice, grains, poultry, beef, pork, seafood, fish, sandwiches, wraps, burgers, baking, desserts, sourdough, artisan bread, sauces, stocks, condiments, coffee, mocktails, cocktails, meal prep, freezer-friendly, holiday, seasonal, budget, 15-minute, appliances, vegan, vegetarian, gluten-free, keto, high-protein, allergen-friendly, child nutrition" }]}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* coluna esquerda: header + conteúdo */}
          <div className="lg:col-span-9 pr-[15px]">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🍳" size={38} className="text-primary" label="Recipes" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Recipes & Cooking</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} items
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                <p className="line-clamp-3">
                  Explore curated categories for everyday cooking: BBQ & smoking, international cuisines, soups & one-pot, salads & dressings, pasta & grains, proteins, seafood, sandwiches & burgers, baking & desserts, sourdough, sauces, drinks, meal prep, holiday menus, budget & appliances, dietary & specialty, and child nutrition tips.
                </p>
              </div>
            </header>

            {/* Parte 1 */}
            <Section
              emoji="🔥"
              title={`BBQ & Smoking (${bbqSmoking.length})`}
              description="Classic backyard and regional BBQ favorites for smoking, grilling, and low‑and‑slow cooks."
              items={bbqSmoking}
              base="/recipes"
            />

            <Section
              emoji="🌎"
              title={`International & Regional Cuisines (${regionalCuisines.length})`}
              description="Explore diverse flavors from around the world: bistro staples, street food, curries, noodles, grills and more."
              items={regionalCuisines}
              base="/recipes"
            />

            <Section
              emoji="🍢"
              title={`Finger Foods & Appetizers (${appetizersFingerFoods.length})`}
              description="Party‑friendly bites, dips and crunchy starters — numbers removed for display, slugs generated automatically."
              items={appetizersFingerFoods}
              base="/recipes"
            />

            <Section
              emoji="🥞"
              title={`Breakfast & Brunch (${breakfastBrunch.length})`}
              description="Comforting morning plates from pancakes and eggs Benedict to classic French toast."
              items={breakfastBrunch}
              base="/recipes"
            />

            {/* Parte 2 */}
            <Section
              emoji="🍲"
              title={`Soups, Stews & One‑Pot (${soupsStewsOnePot.length})`}
              description="Hearty bowls and weeknight one‑pot winners for simple, satisfying meals."
              items={soupsStewsOnePot}
              base="/recipes"
            />

            <Section
              emoji="🥗"
              title={`Salads & Dressings (${saladsDressings.length})`}
              description="Fresh salads and essential dressings to pair with mains or serve solo."
              items={saladsDressings}
              base="/recipes"
            />

            <Section
              emoji="🍝"
              title={`Pasta, Rice & Grains (${pastaRiceGrains.length})`}
              description="Comfort staples from pasta and risotto to rice bowls and grain sides."
              items={pastaRiceGrains}
              base="/recipes"
            />

            <Section
              emoji="🍗"
              title={`Poultry, Beef & Pork (${poultryBeefPork.length})`}
              description="Reliable mains and family favorites across chicken, beef and pork."
              items={poultryBeefPork}
              base="/recipes"
            />

            <Section
              emoji="🐟"
              title={`Seafood & Fish (${seafoodFish.length})`}
              description="From quick pan‑sears to grilled fillets and bright citrus cures."
              items={seafoodFish}
              base="/recipes"
            />

            <Section
              emoji="🥪"
              title={`Sandwiches, Wraps & Burgers (${sandwichesWrapsBurgers.length})`}
              description="Handheld classics and modern twists for lunches, picnics and busy nights."
              items={sandwichesWrapsBurgers}
              base="/recipes"
            />

            <Section
              emoji="🍰"
              title={`Baking & Desserts (${bakingDesserts.length})`}
              description="Cakes, pies and sweets — cozy weekend bakes and celebratory treats."
              items={bakingDesserts}
              base="/recipes"
            />

            <Section
              emoji="🥖"
              title={`Sourdough & Artisan Breads (${sourdoughArtisanBreads.length})`}
              description="Crusty loaves, airy ciabatta and rustic focaccia for home bakers."
              items={sourdoughArtisanBreads}
              base="/recipes"
            />

            <Section
              emoji="🥫"
              title={`Sauces, Stocks & Condiments (${saucesStocksCondiments.length})`}
              description="Foundational flavors to elevate every dish: sauces, stocks and pantry staples."
              items={saucesStocksCondiments}
              base="/recipes"
            />

            <Section
              emoji="☕"
              title={`Drinks (Coffee / Mocktails / Cocktails) (${drinksCoffeeMocktailsCocktails.length})`}
              description="Brews, sips and mixers — from cold brew and cappuccino to mocktails and classics."
              items={drinksCoffeeMocktailsCocktails}
              base="/recipes"
            />

            <Section
              emoji="🗂️"
              title={`Meal‑Prep & Freezer‑Friendly (${mealPrepFreezerFriendly.length})`}
              description="Batch‑friendly plates, freezer staples and quick reheat ideas for busy weeks."
              items={mealPrepFreezerFriendly}
              base="/recipes"
            />

            <Section
              emoji="🎄"
              title={`Holiday & Seasonal (${holidaySeasonal.length})`}
              description="Festive menus and seasonal favorites for gatherings and holidays."
              items={holidaySeasonal}
              base="/recipes"
            />

            {/* Parte 3 */}
            <Section
              emoji="💡"
              title={`Budget, 15‑Minute & Appliances (${budgetAppliances.length})`}
              description="Fast dinners, budget‑friendly menus, slow/pressure cooker, air fryer and sheet‑pan ideas."
              items={budgetAppliances}
              base="/recipes"
            />

            <Section
              emoji="🌱"
              title={`Dietary & Specialty (${dietarySpecialty.length})`}
              description="From plant‑based and gluten‑free to keto, high‑protein and allergen‑friendly options."
              items={dietarySpecialty}
              base="/recipes"
            />

            {/* Parte 4 */}
            <Section
              emoji="👶"
              title={`Child Nutrition Tips (${childNutritionTips.length})`}
              description="Practical guidance for balanced snacks, lunchboxes, portions, hydration and nutrient‑dense picks."
              items={childNutritionTips}
              base="/recipes"
            />

            {/* Boxes inferiores: Share + Suggest embutido */}
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

/* ---------- helpers ---------- */
function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function stripLeadingNumbers(name: string) {
  // Remove números/ordinais iniciais do display sem afetar slugs internos
  return name.replace(/^\s*(?:\(?\d{1,3}\)?[.\-–—:]|\d{1,3}\s*[)\.])\s+/, "").trim();
}

function slugify(name: string) {
  const base = stripLeadingNumbers(name)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s\/-]/g, "")
    .replace(/[\/\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$|/g, "");
  return base || "recipe";
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
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => {
            const display = stripLeadingNumbers(it.name);
            const href = `${base}/${it.slug ?? slugify(it.name)}`;
            return (
              <li key={href} className="leading-relaxed">
                <Link
                  to={href}
                  className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
                >
                  {display}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => {
            const display = stripLeadingNumbers(it.name);
            const href = `${base}/${it.slug ?? slugify(it.name)}`;
            return (
              <li key={href} className="leading-relaxed">
                <Link
                  to={href}
                  className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
                >
                  {display}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}