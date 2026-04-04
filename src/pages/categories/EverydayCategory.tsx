import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import RegistryCategorySection from "@/components/RegistryCategorySection";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

// Estrutura espelhada da página FinancialCategory

type Item = { name: string; slug: string };

// Home & Maintenance (10)
const homeMaintenance: Item[] = [
  { name: "Cleaning Dilution Ratio Calculator", slug: "cleaning-dilution-ratio" },
  { name: "Laundry Detergent Dosage by Load Size", slug: "laundry-detergent-dosage" },
  { name: "Home Paint Touch-Up Estimator (small areas)", slug: "home-paint-touch-up" },
  { name: "Room Air Changes per Hour (ACH) Calculator (educational)", slug: "room-air-changes-ach" },
  { name: "Propane Tank Burn Time Estimator (e.g., for grills)", slug: "propane-tank-burn-time" },
  { name: "Refrigerator/Freezer Safe Zone Time Window", slug: "refrigerator-freezer-safe-zone-time-window" },
  { name: "Light Bulb Cost per Year (kWh) Calculator", slug: "light-bulb-cost-per-year" },
  { name: "Water Heater Recovery Time Estimator", slug: "water-heater-recovery-time" },
  { name: "Home Renovation Cost Estimator", slug: "home-renovation-cost-estimator" },
  { name: "Appliance Energy Consumption Calculator", slug: "appliance-energy-consumption" },
];

// Health, Wellness & Sleep (10)
const healthWellnessSleep: Item[] = [
  { name: "Life Expectancy Calculator", slug: "life-expectancy" },
  { name: "Body Mass Index (BMI) Calculator", slug: "bmi-calculator" },
  { name: "Sleep Debt & Ideal Bedtime Planner", slug: "sleep-debt-ideal-bedtime" },
  { name: "Caffeine Max per Day Calculator", slug: "caffeine-max-per-day" },
  { name: "Screen Time Budget / Pomodoro Planner", slug: "screen-time-pomodoro-planner" },
  { name: "Steps → Distance Converter (urban vs. treadmill)", slug: "steps-to-distance-converter" },
  { name: "Hydration Reminder Interval Planner", slug: "hydration-reminder-interval" },
  { name: "MyPlate Daily Calorie/Nutrient Planner", slug: "myplate-daily-calorie-nutrient" },
  { name: "Basal Metabolic Rate (BMR) Calculator", slug: "bmr-calculator" },
  { name: "Body Fat Percentage Calculator", slug: "body-fat-percentage" },
];

// Events, Party & Culinary (8)
const eventsPartyCulinary: Item[] = [
  { name: "Party Food & Drinks Planner (portions/guests)", slug: "party-food-drinks-planner" },
  { name: "Ice Quantity for Beverages Calculator (kg per hour/guests)", slug: "ice-quantity-beverages" },
  { name: "Buffet Serving Pan Capacity & Count", slug: "buffet-pan-capacity-count" },
  { name: "Wine/Beer/Soft Drink Mix Estimator", slug: "beverage-mix-estimator" },
  { name: "Coffee Urn Yield & Strength Calculator", slug: "coffee-urn-yield-strength" },
  { name: "Leftovers Cooling & Reheat Time (educational)", slug: "leftovers-cooling-reheat-time" },
  { name: "Event Budget Calculator", slug: "event-budget-calculator" },
  { name: "Event Capacity Calculator", slug: "event-capacity-calculator" },
];

// Garden & Exterior (10)
const gardenExterior: Item[] = [
  { name: "Mulch Coverage & Bag Count Calculator", slug: "mulch-coverage-bag-count" },
  { name: "Garden Soil/Compost Volume Calculator", slug: "garden-soil-compost-volume" },
  { name: "Lawn Mowing Time & Fuel Planner", slug: "lawn-mowing-time-fuel" },
  { name: "Hose Runtime vs Flow Rate (L/min) Calculator", slug: "hose-runtime-flow-rate" },
  { name: "Rainwater Barrel Days of Supply", slug: "rainwater-barrel-days-supply" },
  { name: "Grass Seed Quantity Calculator", slug: "grass-seed-quantity" },
  { name: "Square Footage Calculator (General Area/Lawn Size)", slug: "square-footage-calculator" },
  { name: "Planting Calendar & Frost Date Finder", slug: "planting-calendar-frost-date" },
  { name: "Plant Spacing Calculator", slug: "plant-spacing-calculator" },
  { name: "Fertilizer Application Calculator", slug: "fertilizer-application-calculator" },
];

const TOTAL =
  homeMaintenance.length +
  healthWellnessSleep.length +
  eventsPartyCulinary.length +
  gardenExterior.length; // 38

export default function EverydayCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Everyday Life & Smart Tips Calculators"
        description="Explore 38 everyday calculators for home maintenance, health and wellness, event planning, and garden projects. Fast, accurate estimators with practical tips."
        canonical="https://www.smartkitnow.com/everyday"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/everyday", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "everyday calculators, home maintenance calculator, event planner calculator, garden calculator, sleep calculator, BMI, BMR, energy consumption" }]}
      />
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
                <EmojiIcon symbol="🧰" size={38} className="text-primary" label="Everyday" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Everyday Life & Smart Tips Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Simplify everyday decisions with {TOTAL} practical calculators spanning home maintenance, health and wellness, event planning, and garden/exterior projects.
                    </p>
                    <p>
                      At home: compute cleaning dilution ratios, laundry detergent doses, small-area paint touch-up needs, room air changes per hour (ACH), propane tank burn time, safe temperature windows for refrigerators/freezers, annual light-bulb cost by kWh, water-heater recovery time, renovation budgeting, and appliance energy consumption.
                    </p>
                    <p>
                      In wellness: estimate life expectancy, BMI, sleep debt and ideal bedtime, safe daily caffeine amounts by weight/time, focus planning with Pomodoro, convert steps to distance (urban vs treadmill), set hydration reminders, plan MyPlate daily calories/nutrients, calculate BMR, and estimate body-fat percentage.
                    </p>
                    <p>
                      For events: plan portions and drinks, size ice for guests per hour, determine buffet pan capacity and counts, balance wine/beer/soft-drink mixes, tune coffee urn yield and strength, guide safe cooling and reheating of leftovers, and estimate event budgets and venue capacity.
                    </p>
                    <p>
                      In the garden and outdoors: map mulch coverage and bag counts, measure soil/compost volume, plan lawn mowing time and fuel, relate hose runtime to flow rate, project rain-barrel days of supply, size grass-seed needs, compute square footage, track planting calendars and frost dates, set plant spacing, and apply fertilizer accurately.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} everyday calculators for home, wellness, events, and garden: cleaning dilutions, detergent dosing, ACH, propane burn time, food safety windows, light-bulb cost, water-heater recovery, renovation budgets, appliance energy; life expectancy, BMI, sleep debt, caffeine, Pomodoro, steps→distance, hydration, MyPlate, BMR, body fat; portions, ice, buffet pans, beverage mix, coffee strength, leftovers safety, event budget, capacity; mulch coverage, soil volume, mowing time/fuel, hose flow, rain-barrel supply, grass seed, square footage, planting & frost dates, plant spacing, fertilizer.
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

            {/* Featured Word Counter Card */}
            <section className="mb-12">
              <Link to="/everyday/word-counter" className="group block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-2 border-indigo-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-grid place-items-center h-14 w-14 rounded-xl bg-white dark:bg-slate-950 shadow-sm border border-indigo-100 dark:border-slate-700">
                    <EmojiIcon symbol="📝" size={28} />
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">Word Counter Utility</h2>
                    <p className="text-sm font-medium text-indigo-500/80 dark:text-indigo-400/80 mt-1 uppercase tracking-wider">Free Online Tool</p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-medium">
                  A fast, minimal, and clean tool to count words, characters, sentences, and paragraphs in real-time. Optimize your content for SEO and readability effortlessly.
                </p>
              </Link>
            </section>

            <Section
              emoji="🏠"
              title={`Home & Maintenance (${homeMaintenance.length})`}
              description="Cleaning dilution ratios, detergent dosing by load, touch-up paint estimates, room ACH, propane burn time, fridge/freezer safe temperature windows, annual light-bulb cost (kWh), water-heater recovery time, renovation cost budgeting, and appliance energy use."
              items={homeMaintenance}
              base="/everyday"
            />

            <Section
              emoji="🛌"
              title={`Health, Wellness & Sleep (${healthWellnessSleep.length})`}
              description="Life expectancy, BMI, sleep debt and ideal bedtime, safe daily caffeine, Pomodoro focus planning, steps-to-distance conversion, hydration reminders, MyPlate daily calorie/nutrient planning, BMR calculation, and body-fat estimation."
              items={healthWellnessSleep}
              base="/everyday"
            />

            <Section
              emoji="🎉"
              title={`Events, Party & Culinary (${eventsPartyCulinary.length})`}
              description="Portion and drinks planning, ice per hour/guests, buffet pan capacity and counts, beverage mix balancing, coffee urn yield/strength, leftovers cooling and reheating guidance, event budget estimation, and venue capacity planning."
              items={eventsPartyCulinary}
              base="/everyday"
            />

            <Section
              emoji="🌿"
              title={`Garden & Exterior (${gardenExterior.length})`}
              description="Mulch coverage and bag count, soil/compost volume, lawn mowing time and fuel, hose runtime vs flow rate, rain-barrel days of supply, grass-seed quantity, square footage calculation, planting calendar and frost dates, plant spacing, and fertilizer application."
              items={gardenExterior}
              base="/everyday"
            />

            {/* All everyday calculators from registry */}
            <RegistryCategorySection
              category="everyday"
              title="More Everyday Calculators"
              className="mt-10"
            />

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
  emoji: string; // emoji colorido no título da seção
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
