import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareBox from "../../components/share/ShareBox";
import SuggestBoxInline from "../../components/contact/SuggestBoxInline";

// Estrutura idêntica à página FinancialCategory

type Item = { name: string; slug: string };

// Dates & Durations (9)
const datesDurations: Item[] = [
  { name: "Days Between Dates (date duration)", slug: "days-between-dates" },
  { name: "Add/Subtract Date (days/months/years)", slug: "add-subtract-date" },
  { name: "Add/Subtract Time (h/min/s)", slug: "add-subtract-time" },
  { name: "Business Days Calculator (exclude weekends/holidays)", slug: "business-days" },
  { name: "Week Number & ISO Week Finder", slug: "iso-week-number" },
  { name: "Age Calculator (years/months/days)", slug: "age-calculator" },
  { name: "Date Difference in Hours/Minutes/Seconds", slug: "date-difference-hms" },
  { name: "Julian Date/Day Calculator", slug: "julian-date-day-number" },
  { name: "Leap Year Checker", slug: "leap-year-checker" },
];

// Time Zones & Clocks (6)
const timeZonesClocks: Item[] = [
  { name: "Time Zone Converter (between cities)", slug: "time-zone-converter" },
  { name: "World Clock (list of cities)", slug: "world-clock" },
  { name: "Meeting Planner (common time across time zones)", slug: "meeting-planner-time-zones" },
  { name: "UTC ↔ Local Time Converter", slug: "utc-local-time-converter" },
  { name: "DST Change Checker (time changes)", slug: "dst-change-checker" },
  { name: "Epoch/Unix Time Converter", slug: "epoch-unix-time-converter" },
];

// Calendar & Extras (6)
const calendarExtras: Item[] = [
  { name: "Calendar Generator (month/year, export PDF)", slug: "calendar-generator-pdf" },
  { name: "Workday/Workweek Planner (customized)", slug: "workday-workweek-planner" },
  { name: "Countdown Timer (until a date/time)", slug: "countdown-timer" },
  { name: "Stopwatch & Split Times (web tool)", slug: "stopwatch-split-times" },
  { name: "Day of Week for Any Date (includes Doomsday rule)", slug: "day-of-week-for-date" },
  { name: "Count Specific Weekdays Between Dates (e.g., all Fridays)", slug: "count-specific-weekdays" },
];

// Sun, Moon & Astronomy (3)
const sunMoonAstronomy: Item[] = [
  { name: "Sunrise and Sunset Times", slug: "sunrise-sunset-times" },
  { name: "Moon Phases", slug: "moon-phases" },
  { name: "Seasons Calculator", slug: "astronomical-seasons" },
];

const TOTAL =
  datesDurations.length +
  timeZonesClocks.length +
  calendarExtras.length +
  sunMoonAstronomy.length; // 24

export default function TimeCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      {/* empurra tudo abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* coluna esquerda: header + conteúdo */}
          <div className="lg:col-span-9 pr-[15px]">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="⏰" size={38} className="text-primary" label="Time & Date" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Time & Date Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Plan, convert, and track time accurately with {TOTAL} calculators covering date differences, time additions/subtractions, business days, ISO weeks, and age calculations.
                    </p>
                    <p>
                      Navigate global schedules with time zone conversion, world clocks, meeting planners, UTC ↔ local conversions, DST change checks, and epoch/unix conversions.
                    </p>
                    <p>
                      Generate calendars, plan custom workdays/workweeks, set countdowns, run stopwatches, find the day of week for any date, and count specific weekdays across ranges.
                    </p>
                    <p>
                      Explore astronomy with precise sunrise/sunset times, detailed Moon phases, and exact solstice/equinox season starts.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    Plan, convert, and track time with {TOTAL} calculators: date differences, add/subtract date/time, business days, ISO weeks, age, time zones, world clocks, meeting planners, UTC/local, DST changes, epoch, calendars, workdays, countdowns, stopwatches, day-of-week, weekday counts, and astronomy (sunrise/sunset, Moon phases, seasons).
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
              emoji="📅"
              title={`Dates & Durations (${datesDurations.length})`}
              description="Compute days between dates, add/subtract dates and times, exclude weekends/holidays for business days, find ISO week numbers, calculate age, measure differences down to hours/minutes/seconds, and check Julian day and leap year status."
              items={datesDurations}
              base="/time"
            />

            <Section
              emoji="🕰️"
              title={`Time Zones & Clocks (${timeZonesClocks.length})`}
              description="Convert between cities/time zones, browse world clock listings, plan meetings across zones, switch UTC ↔ local time, verify DST changes, and translate epoch/unix timestamps."
              items={timeZonesClocks}
              base="/time"
            />

            <Section
              emoji="📆"
              title={`Calendar & Extras (${calendarExtras.length})`}
              description="Generate calendars (PDF), plan custom workdays/workweeks, set countdowns, run a stopwatch with splits, determine the day of the week for any date, and count occurrences of a specific weekday in a date range."
              items={calendarExtras}
              base="/time"
            />

            <Section
              emoji="🌅"
              title={`Sun, Moon & Astronomy (${sunMoonAstronomy.length})`}
              description="Get precise sunrise and sunset times, track Moon phases with exact dates and times, and determine the astronomical start of the seasons (solstices and equinoxes)."
              items={sunMoonAstronomy}
              base="/time"
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