import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

// Mirror structure of FinancialCategory

type Item = { name: string; slug: string };

// Running, Cycling & Triathlon Performance (15)
const endurancePerformance: Item[] = [
  { name: "Running Pace / Split / Finish Time Calculator", slug: "running-pace-split-finish-time" },
  { name: "Race Time Predictor (Riegel Formula)", slug: "race-time-predictor-riegel" },
  { name: "Heart-Rate Zones Calculator (Karvonen Method)", slug: "heart-rate-zones-karvonen" },
  { name: "VO2max Estimator (Cooper/Rockport Test)", slug: "vo2max-estimator-cooper-rockport" },
  { name: "Cycling Power ↔ Speed Estimator (flat/wind)", slug: "cycling-power-speed-estimator" },
  { name: "FTP (Functional Threshold Power) Zones Planner (Coggan)", slug: "ftp-zones-planner" },
  { name: "Swim Pace: CSS (Critical Swim Speed) & Splits", slug: "swim-pace-css-splits" },
  { name: "T1/T2 Transition Time Impact (Triathlon)", slug: "t1-t2-time-impact" },
  { name: "Calories Burned per Workout (MET)", slug: "calories-burned-met" },
  { name: "Hydration / Sweat Rate Calculator", slug: "hydration-sweat-rate" },
  { name: "Cycling Cadence Calculator", slug: "cycling-cadence" },
  { name: "Negative Split Race Planner", slug: "negative-split" },
  { name: "Swimming Power Points Calculator", slug: "swimming-power-points" },
  { name: "Pool Length Time Converter (SCY/SCM/LCM)", slug: "pool-length-time-converter" },
  { name: "Swim Interval Pace Calculator", slug: "swim-interval-pace" },
];

// Strength, Lifting & Conditioning (12)
const strengthConditioning: Item[] = [
  { name: "One-Rep Max (1RM) Calculator (Epley, Brzycki)", slug: "one-rep-max-1rm" },
  { name: "Training Weight Percentage Calculator", slug: "training-weight-percentage" },
  { name: "Target Heart Rate / RPE Zones", slug: "target-heart-rate-rpe-zones" },
  { name: "TDEE (Total Daily Energy Expenditure) Calculator", slug: "tdee-calculator" },
  { name: "Plank / Hold Time Progression (educational)", slug: "plank-hold-progression" },
  { name: "Wilks Coefficient Calculator", slug: "wilks-coefficient" },
  { name: "Body Fat Percentage Calculator", slug: "body-fat-percentage" },
  { name: "Plate Loading Calculator", slug: "plate-loading" },
  { name: "Macronutrient Calculator", slug: "macronutrient-calculator" },
  { name: "Calorie Deficit / Surplus Calculator", slug: "calorie-deficit-surplus" },
  { name: "Fitness Age Calculator", slug: "fitness-age-calculator" },
  { name: "Yoga Calories Burned Calculator", slug: "yoga-calories-burned" },
];

// Ball Sports & Advanced Metrics (11)
const ballSportsMetrics: Item[] = [
  { name: "Fantasy Team Points Projections Calculator", slug: "fantasy-team-points-projections" },
  { name: "Betting Odds & Payout Calculator (Decimal / Fractional / Moneyline)", slug: "betting-odds-payout-calculator" },
  { name: "Soccer League Table: Points & Goal Differential (GD)", slug: "soccer-league-table-points-gd" },
  { name: "xG (Expected Goals) Reading Helper (educational)", slug: "expected-goals-xg-helper" },
  { name: "Basketball eFG% & TS% Calculator", slug: "basketball-efg-ts" },
  { name: "Basketball Pace & ORtg/DRtg (educational)", slug: "basketball-pace-ortg-drtg" },
  { name: "Baseball OPS / SLG / OBP Calculator", slug: "baseball-ops-slg-obp" },
  { name: "ERA & WHIP Calculator", slug: "era-whip-calculator" },
  { name: "Win Probability Shift (WPS) Estimator", slug: "win-probability-shift-wps" },
  { name: "BABIP (Batting Average on Balls in Play) Calculator", slug: "babip-calculator" },
  { name: "Ground Ball to Fly Ball Ratio (GB/FB) Calculator", slug: "ground-ball-to-fly-ball-ratio-gb-fb" },
];

// Individual & Game Management (11)
const individualGameMgmt: Item[] = [
  { name: "Golf Handicap Differential & Index", slug: "golf-handicap-differential-index" },
  { name: "Golf Expected Putts per Round (educational)", slug: "golf-expected-putts-per-round" },
  { name: "Tennis Serve Speed Calculator (distance/time)", slug: "tennis-serve-speed" },
  { name: "Tennis ELO / Rating Progress (educational)", slug: "tennis-elo-rating-progress" },
  { name: "Rowing Split (500m) ↔ Pace", slug: "rowing-split-500m-pace" },
  { name: "Climbing Grade Converter (YDS ↔ French ↔ European)", slug: "climbing-grade-converter-yds-french-eu" },
  { name: "Tournament Bracket Seeding Helper", slug: "tournament-bracket-seeding-helper" },
  { name: "Golf Handicap Calculator", slug: "golf-handicap-calculator" },
  { name: "Bowling Score Calculator", slug: "bowling-score-calculator" },
  { name: "FINA Points Calculator", slug: "fina-points-calculator" },
  { name: "Swim Performance Level Calculator", slug: "swim-performance-level-calculator" },
];

const TOTAL =
  endurancePerformance.length +
  strengthConditioning.length +
  ballSportsMetrics.length +
  individualGameMgmt.length; // 49

export default function SportsCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Sports Calculators"
        description="Explore 49 sports calculators for endurance performance, strength training, ball sports analytics, and game management. Fast, accurate tools for athletes and coaches."
        canonical="https://www.smartkitnow.com/sports"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/sports", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "sports calculators, running pace calculator, race predictor, heart rate zones, VO2max, cycling power, FTP zones, swim pace, sweat rate, cadence, negative split, swimming points, pool converter, interval pace, 1RM, TDEE, Wilks, plate loading, macros, calorie deficit, fitness age, yoga calories, fantasy points, betting odds, soccer table, xG, eFG TS, ORtg DRtg, OPS SLG OBP, ERA WHIP, WPS, BABIP, GB FB, golf handicap, bowling score, FINA points, swim performance" }]}
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
                <EmojiIcon symbol="🏅" size={38} className="text-primary" label="Sports" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Sports Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Optimize performance and planning with {TOTAL} sports calculators spanning endurance (running, cycling, triathlon), strength & conditioning, ball-sport analytics, and game management.
                    </p>
                    <p>
                      Endurance: running pace/splits/finish time, race predictor (Riegel), heart-rate zones (Karvonen), VO2max estimates (Cooper/Rockport), cycling power↔speed, FTP zones (Coggan), swim pace CSS & splits, T1/T2 triathlon transition impact, calories (MET), hydration/sweat rate, cycling cadence, negative split planner, swimming power points, pool length converters (SCY/SCM/LCM), and swim interval pacing.
                    </p>
                    <p>
                      Strength: 1RM (Epley/Brzycki), training percent planner, target HR/RPE, TDEE, plank progression, Wilks coefficient, body-fat percentage, plate loading, macronutrient planner, calorie deficit/surplus, fitness age, and yoga calories.
                    </p>
                    <p>
                      Ball sports: fantasy points projections, odds & payout (decimal/fractional/moneyline), soccer table points & GD, xG reading helper, basketball eFG%/TS%, pace & ORtg/DRtg, baseball OPS/SLG/OBP, ERA/WHIP, win probability shift (WPS), BABIP, and GB/FB ratio.
                    </p>
                    <p>
                      Management: golf handicap differential/index and course handicap, expected putts per round, tennis serve speed and ELO progress, rowing 500m split↔pace, climbing grade converter, tournament bracket seeding, bowling score, FINA points, and swim performance level.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} sports calculators for endurance, strength, ball-sport analytics, and management: running pace & race predictor, HR zones, VO2max, cycling power↔speed, FTP zones, swim CSS & splits, T1/T2 impact, MET calories, hydration/sweat, cadence, negative split, power points, pool converter, interval pace; 1RM, training %, HR/RPE, TDEE, plank progression, Wilks, body fat, plate loading, macros, calorie deficit/surplus, fitness age, yoga calories; fantasy points, betting odds, soccer points & GD, xG helper, eFG%/TS%, pace & ORtg/DRtg, OPS/SLG/OBP, ERA/WHIP, WPS, BABIP, GB/FB; golf handicap, putts per round, tennis serve speed & ELO, rowing split, climbing grades, brackets, bowling score, FINA points, swim performance.
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
              emoji="🏃"
              title={`Running, Cycling & Triathlon Performance (${endurancePerformance.length})`}
              description="Pace, splits, finish time, race prediction, HR zones, VO2max, cycling power↔speed, FTP zones, swim CSS & splits, T1/T2 impact, MET calories, hydration/sweat rate, cadence, negative split, power points, pool converters, interval pace."
              items={endurancePerformance}
              base="/sports"
            />

            <Section
              emoji="🏋️"
              title={`Strength, Lifting & Conditioning (${strengthConditioning.length})`}
              description="1RM, training percentages, HR/RPE zones, TDEE, plank progression, Wilks, body fat, plate loading, macronutrients, calorie deficit/surplus, fitness age, yoga calories."
              items={strengthConditioning}
              base="/sports"
            />

            <Section
              emoji="🏀"
              title={`Ball Sports & Advanced Metrics (${ballSportsMetrics.length})`}
              description="Fantasy projections, betting odds & payout, soccer points & GD, xG helper, basketball eFG%/TS% and pace & ORtg/DRtg, baseball OPS/SLG/OBP, ERA/WHIP, WPS, BABIP, GB/FB ratio."
              items={ballSportsMetrics}
              base="/sports"
            />

            <Section
              emoji="⛳"
              title={`Individual & Game Management (${individualGameMgmt.length})`}
              description="Golf handicap differential/index & course handicap, expected putts, tennis serve speed & ELO progress, rowing split↔pace, climbing grade converter, bracket seeding, bowling score, FINA points, swim performance level."
              items={individualGameMgmt}
              base="/sports"
            />

            {/* bottom boxes: Share + Suggest */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
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
