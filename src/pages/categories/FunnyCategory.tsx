import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareBox from "../../components/share/ShareBox";
import SuggestBoxInline from "../../components/contact/SuggestBoxInline";
import SEOHead from "@/components/SEOHead";

// Mirror structure of FinancialCategory

type Item = { name: string; slug: string };

// Food & Social Life (12)
const foodSocialLife: Item[] = [
  { name: "Pizza Size/Price Comparison Calculator", slug: "pizza-size-price-comparison" },
  { name: "Pizza Slices per Person & Regret Index", slug: "pizza-slices-per-person-regret-index" },
  { name: "BBQ 'Who Brings the Charcoal?' Splitter", slug: "bbq-charcoal-splitter" },
  { name: "Coffee Strength vs Productivity Score (Meme)", slug: "coffee-strength-vs-productivity-meme" },
  { name: "Hot-Dog to Bun Mismatch Solver", slug: "hot-dog-bun-mismatch-solver" },
  { name: "How Much Sugar Is in My Tea? (Dramatic)", slug: "sugar-in-my-tea-dramatic" },
  { name: "First-Date Awkwardness Meter", slug: "first-date-awkwardness-meter" },
  { name: "Donut Calculator", slug: "donut-calculator" },
  { name: "Ideal Egg Boiling Calculator", slug: "ideal-egg-boiling-calculator" },
  { name: "Coffee Addiction Meter", slug: "coffee-addiction-meter" },
  { name: "Zombie Survival Calculator", slug: "zombie-survival-calculator" },
  { name: "Love Meter (Name Compatibility)", slug: "love-meter" },
];

// Tech & Work Life (7)
const techWorkLife: Item[] = [
  { name: "Meetings Wasted-Time Counter", slug: "meetings-wasted-time-counter" },
  { name: "Cost to Send This Email (Energy/kWh)", slug: "email-cost-estimator-energy" },
  { name: "Tab Overload Anxiety Score", slug: "tab-overload-anxiety-score" },
  { name: "Commit Message Quality Judge", slug: "commit-message-quality-judge" },
  { name: "Keyboard Clicks per Day Estimator", slug: "keyboard-clicks-per-day" },
  { name: "Meme Virality Calculator", slug: "meme-virality-calculator" },
  { name: "Calculator Word Generator (Upside-Down)", slug: "calculator-word-generator-upside-down" },
];

// Home, Pets & Pop Culture (10)
const homePetsPopCulture: Item[] = [
  { name: "Lost Socks Calculator (Laundry Disappearance)", slug: "lost-socks-calculator" },
  { name: "Dog Zoomies Energy Release Meter", slug: "dog-zoomies-energy-meter" },
  { name: "Cat 'Ignore-o-Meter' (Acknowledgment Probability)", slug: "cat-ignore-o-meter" },
  { name: "Plant Watering Procrastination Index", slug: "plant-watering-procrastination-index" },
  { name: "Netflix 'Just One More Episode' Timer", slug: "netflix-one-more-episode-timer" },
  { name: "Death by Caffeine (Max Safe Intake)", slug: "death-by-caffeine" },
  { name: "Social Media Time Alternatives", slug: "social-media-time-alternatives" },
  { name: "Pokémon GO Weight Loss Calculator", slug: "pokemon-go-weight-loss" },
  { name: "Life Value Estimator (Worth in Tacos)", slug: "life-value-in-tacos" },
  { name: "Drake Equation Calculator", slug: "drake-equation-calculator" },
];

// Absurd Travel & Adventure (9)
const absurdTravelAdventure: Item[] = [
  { name: "Vacation Budget Reality Check", slug: "vacation-budget-reality-check" },
  { name: "Loop-the-Loop Speed Calculator", slug: "loop-the-loop-speed-calculator" },
  { name: "Rocks to Flood a Country Estimator", slug: "rocks-to-flood-country" },
  { name: "Penguin Slap Power Calculator", slug: "penguin-slap-power" },
  { name: "Nickels to Crush Calculator", slug: "nickels-to-crush-calculator" },
  { name: "Black Hole Sun Impact Calculator", slug: "black-hole-sun-impact" },
  { name: "Time Travel Energy Requirement", slug: "time-travel-energy-requirement" },
  { name: "Medical Tourism Cost Saver", slug: "medical-tourism-cost-saver" },
  { name: "Crinkle Crankle Wall Brick Saver", slug: "crinkle-crankle-wall-brick-saver" },
];

const TOTAL =
  foodSocialLife.length +
  techWorkLife.length +
  homePetsPopCulture.length +
  absurdTravelAdventure.length; // 38

export default function FunnyCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Funny Calculators"
        description="Explore 38 funny calculators spanning food, social life, tech & work, home & pop culture, and absurd travel adventures. Light-hearted tools with playful insights."
        canonical="https://www.smartkitnow.com/funny"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/funny", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "funny calculators, pizza calculator, meetings wasted time, meme virality, lost socks, zoomies, ignore-o-meter, procrastination, just one more episode, death by caffeine, pokemon go weight loss, tacos value, drake equation, vacation reality check, loop speed, penguin slap, nickels crush, black hole sun, time travel energy, medical tourism, crinkle crankle wall" }]}
      />
      {/* offset below fixed header */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* left column: header + content */}
          <div className="lg:col-span-9 pr-[15px]">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="😂" size={38} className="text-primary" label="Funny" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Funny Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Have fun with {TOTAL} playful calculators across food & social life, tech & work, home, pets & pop culture, and delightfully absurd travel adventures.
                    </p>
                    <p>
                      Food & social: pizza size-versus-price and slices-per-person with regret index, BBQ charcoal splitter, coffee strength versus productivity, hot-dog-to-bun mismatch solver, dramatic sugar-in-tea, first-date awkwardness, donuts, perfect egg boiling, coffee addiction, zombie survival, and love meter.
                    </p>
                    <p>
                      Tech & work: meetings wasted-time counter, email energy cost, tab overload anxiety, commit message judge, keyboard clicks per day, meme virality predictor, and upside-down calculator words.
                    </p>
                    <p>
                      Home, pets & pop culture: lost socks rate, dog zoomies energy, cat ignore-o-meter, plant watering procrastination, one-more-episode timer, death by caffeine, social media time alternatives, Pokémon GO weight loss, life value in tacos, and the Drake equation.
                    </p>
                    <p>
                      Absurd travel & adventure: vacation budget reality check, loop-the-loop speed, rocks to flood a country, penguin slap power, nickels to crush, black hole sun impact, time travel energy, medical tourism savings, and crinkle crankle wall brick saver.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} funny calculators for food & social life, tech & work, home & pop culture, and absurd adventures: pizza comparisons, regret index, BBQ charcoal, coffee strength, hot-dog vs buns, sugar drama, date awkwardness, donuts, perfect egg, coffee addiction, zombie survival, love meter; meetings wasted-time, email energy cost, tab anxiety, commit judge, clicks per day, meme virality, calculator words; lost socks, zoomies, ignore-o-meter, watering procrastination, one-more-episode, death by caffeine, time alternatives, Pokémon GO weight loss, tacos value, Drake equation; vacation reality check, loop speed, flood rocks, penguin slap, nickels crush, black hole sun, time travel energy, medical tourism, crinkle crankle wall.
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
              emoji="🍕"
              title={`Food & Social Life (${foodSocialLife.length})`}
              description="Pizza comparisons, slices per person & regret index, BBQ charcoal splitter, coffee strength vs productivity, hot-dog/bun mismatch, dramatic sugar in tea, first-date awkwardness, donuts, perfect egg, coffee addiction, zombie survival, love meter."
              items={foodSocialLife}
              base="/funny"
            />

            <Section
              emoji="💻"
              title={`Tech & Work Life (${techWorkLife.length})`}
              description="Meetings wasted-time, email energy cost, tab anxiety, commit message judge, keyboard clicks per day, meme virality predictor, upside-down calculator words."
              items={techWorkLife}
              base="/funny"
            />

            <Section
              emoji="🏠"
              title={`Home, Pets & Pop Culture (${homePetsPopCulture.length})`}
              description="Lost socks rate, dog zoomies, cat ignore-o-meter, watering procrastination, one-more-episode timer, death by caffeine, social media time alternatives, Pokémon GO weight loss, tacos value, Drake equation."
              items={homePetsPopCulture}
              base="/funny"
            />

            <Section
              emoji="🧭"
              title={`Absurd Travel & Adventure (${absurdTravelAdventure.length})`}
              description="Vacation budget reality check, loop-the-loop speed, rocks to flood a country, penguin slap power, nickels to crush, black hole sun impact, time travel energy, medical tourism savings, crinkle crankle wall brick saver."
              items={absurdTravelAdventure}
              base="/funny"
            />

            {/* bottom boxes: Share + Suggest */}
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <ShareBox />
              <SuggestBoxInline />
            </div>
          </div>

          {/* right rail */}
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