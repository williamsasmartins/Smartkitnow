import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import RegistryCategorySection from "@/components/RegistryCategorySection";
import SuggestionBox from "@/components/SuggestionBox";

type Item = { name: string; slug: string };

// ===== LISTA OFICIAL (26) =====
const bodyMetrics: Item[] = [
  { name: "BMI — Body Mass Index Calculator", slug: "bmi-body-mass-index" },
  { name: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", slug: "bmr-mifflin-st-jeor" },
  { name: "TDEE — Total Daily Energy Expenditure Calculator", slug: "tdee-daily-energy-expenditure" },
  { name: "Body Fat % (US Navy / 3-sites)", slug: "body-fat-us-navy-3-sites" },
  { name: "Ideal Weight Range (Hamwi/Devine/Miller)", slug: "ideal-weight-range-hamwi-devine-miller" },
  { name: "Waist-to-Height Ratio Checker", slug: "waist-to-height-ratio" },
  { name: "Body Surface Area (BSA) Calculator", slug: "body-surface-area-bsa" },
  { name: "Daily Calorie Needs (Goal-based)", slug: "daily-calorie-needs-goal" },
  { name: "Weight Loss Date & Deficit Planner", slug: "weight-loss-date-deficit-planner" },
];

const nutritionMacros: Item[] = [
  { name: "Macro Split Planner (Protein/Carb/Fat)", slug: "macro-split-planner" },
  { name: "Protein Intake by Goal (cut/bulk/maintain)", slug: "protein-intake-by-goal" },
  { name: "Carb Target (incl. low-carb/keto ranges)", slug: "carb-target-low-carb-keto" },
  { name: "Fat Intake Range (AMDR)", slug: "fat-intake-range-amdr" },
  { name: "Fiber Intake Target (by kcal/sexo)", slug: "fiber-intake-target" },
  { name: "Water Intake per Day (by weight/activity/climate)", slug: "water-intake-per-day" },
  { name: "Meal Calories Split (breakfast/lunch/dinner/snacks)", slug: "meal-calories-split" },
];

const trainingPerformance: Item[] = [
  { name: "Running Pace, Speed & Split Calculator", slug: "running-pace-speed-splits" },
  { name: "Calories Burned by Activity (MET-based)", slug: "calories-burned-met" },
  { name: "Heart Rate Zones (Karvonen/percentages)", slug: "heart-rate-zones" },
  { name: "VO2max Estimator (Cooper/Rockport)", slug: "vo2max-estimator-cooper-rockport" },
  { name: "1RM — One-Rep Max (Epley/Brzycki)", slug: "one-rep-max-1rm-epley-brzycki" },
  { name: "Steps ↔ Distance ↔ Calories Converter", slug: "steps-distance-calories-converter" },
];

const womensHealth: Item[] = [
  { name: "Ovulation & Fertile Window Estimator", slug: "ovulation-fertile-window" },
  { name: "Pregnancy Due-Date (Naegele)", slug: "pregnancy-due-date-naegele" },
  { name: "Pregnancy Weight-Gain Range (BMI-aware)", slug: "pregnancy-weight-gain-range-bmi-aware" },
  { name: "Gestational TDEE (educational)", slug: "tdee-gestation-adjusted" },
];

const TOTAL =
  bodyMetrics.length +
  nutritionMacros.length +
  trainingPerformance.length +
  womensHealth.length; // 26

export default function HealthCategory() {
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
                <EmojiIcon symbol="❤️" size={38} className="text-primary" label="Health" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Health & Fitness Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Build a healthier routine with {TOTAL} practical calculators spanning body metrics, nutrition and macros, training & cardio, and women’s health.
                    </p>
                    <p>
                      Track <strong>BMI, BMR and TDEE</strong>, estimate <strong>body fat</strong>, check <strong>waist-to-height</strong>, compute <strong>BSA</strong>, plan <strong>daily calories</strong> and set a realistic <strong>weight-loss timeline</strong>.
                    </p>
                    <p>
                      Dial in <strong>macros</strong> with protein/carbs/fat splits, set <strong>protein</strong>, <strong>carb</strong> and <strong>fat</strong> targets (incl. AMDR & keto ranges), and plan <strong>fiber</strong>, <strong>water</strong> and balanced <strong>meal calorie</strong> distribution.
                    </p>
                    <p>
                      Optimize performance: calculate <strong>running pace and splits</strong>, estimate <strong>calories burned</strong> via METs, determine <strong>heart-rate zones</strong>, approximate <strong>VO2max</strong>, compute <strong>1RM</strong>, and convert <strong>steps ↔ distance ↔ calories</strong>.
                    </p>
                    <p>
                      Support women’s health: estimate <strong>ovulation window</strong>, calculate <strong>due date</strong>, track <strong>pregnancy weight gain</strong> by BMI, and review <strong>gestational TDEE</strong> concepts.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    Build a healthier routine with {TOTAL} practical calculators spanning body metrics, nutrition and macros, training & cardio, and women’s health. Track BMI, BMR and TDEE, estimate body fat, check waist-to-height, compute BSA, plan daily calories and set a realistic weight-loss timeline. Dial in macros with protein/carbs/fat splits, set protein, carb and fat targets (incl. AMDR & keto ranges), and plan fiber, water and balanced meal calorie distribution. Optimize performance: calculate running pace and splits, estimate calories burned via METs, determine heart-rate zones, approximate VO2max, compute 1RM, and convert steps ↔ distance ↔ calories. Support women’s health: estimate ovulation window, calculate due date, track pregnancy weight gain by BMI, and review gestational TDEE concepts.
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
              emoji="❤️"
              title={`Body Metrics & Weight Management (${bodyMetrics.length})`}
              description="Compute BMI, BMR and TDEE; estimate body fat (US Navy/3-sites); check waist-to-height; calculate body surface area; plan daily calories and map a safe, time‑bound weight‑loss strategy."
              items={bodyMetrics}
              base="/health"
            />

            <Section
              emoji="🥗"
              title={`Nutrition & Macros (${nutritionMacros.length})`}
              description="Plan macro distributions for protein, carbs and fat; set protein goals by objective (cut/bulk/maintain); determine carb ranges (low‑carb/keto); compute fat range via AMDR; target fiber and water intake; and split meal calories across the day."
              items={nutritionMacros}
              base="/health"
            />

            <Section
              emoji="🏃"
              title={`Training, Performance & Cardio (${trainingPerformance.length})`}
              description="Calculate running pace, speed and splits; estimate calories burned with METs; define heart‑rate zones (Karvonen/percentages); estimate VO2max (Cooper/Rockport); compute one‑rep max (Epley/Brzycki); and convert steps to distance and calories."
              items={trainingPerformance}
              base="/health"
            />

            <Section
              emoji="👩‍🍼"
              title={`Women’s Health & Pregnancy (${womensHealth.length})`}
              description="Estimate ovulation and fertile window; calculate pregnancy due date (Naegele); plan recommended weight‑gain range by BMI; and explore gestational TDEE considerations for educational use."
              items={womensHealth}
              base="/health"
            />

            {/* All health calculators from registry — ensures every tool gets at least one internal link */}
            <RegistryCategorySection
              category="health"
              title="More Health Calculators"
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
} // End of HealthCategory

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
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

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

/* ---------- Boxes inferiores ---------- */
