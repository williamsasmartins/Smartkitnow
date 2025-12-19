import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

type Item = { name: string; slug: string };

// ===== LISTA OFICIAL (25) =====
const coreUnits: Item[] = [
  { name: "Length: m ↔ ft ↔ in", slug: "length-m-ft-in" },
  { name: "Area: m² ↔ ft²", slug: "area-m2-ft2" },
  { name: "Volume: L ↔ mL ↔ gal ↔ oz", slug: "volume-l-ml-gal-oz" },
  { name: "Mass: kg ↔ lb ↔ oz", slug: "mass-kg-lb-oz" },
  { name: "Temperature: °C ↔ °F ↔ K", slug: "temperature-c-f-k" },
  { name: "Density: g/mL ↔ kg/m³", slug: "density-g-per-ml-kg-per-m3" },
  { name: "Angle: deg ↔ rad", slug: "angle-deg-rad" },
  { name: "Speed: m/s ↔ km/h ↔ mph", slug: "speed-mps-kmph-mph" },
];

const mechanicsPressure: Item[] = [
  { name: "Force: N ↔ lbf", slug: "force-n-lbf" },
  { name: "Energy: J ↔ cal ↔ kWh", slug: "energy-j-cal-kwh" },
  { name: "Power: W ↔ hp", slug: "power-w-hp" },
  { name: "Pressure: Pa ↔ bar ↔ psi", slug: "pressure-pa-bar-psi" },
  { name: "Torque: N·m ↔ lbf·ft", slug: "torque-nm-lbfft" },
  { name: "Work & Potential Energy", slug: "work-potential-energy" },
];

const timeFrequency: Item[] = [
  { name: "Time: ms ↔ s ↔ min ↔ hr", slug: "time-ms-s-min-hr" },
  { name: "Frequency: Hz ↔ kHz ↔ MHz", slug: "frequency-hz-khz-mhz" },
  { name: "Period ↔ Frequency", slug: "period-frequency" },
  { name: "Frame Rate: fps ↔ Hz", slug: "frame-rate-fps-hz" },
  { name: "Clock Time & Timezone Shift", slug: "clock-time-timezone-shift" },
];

const computingData: Item[] = [
  { name: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB", slug: "bytes-b-kb-mb-gb-tb" },
  { name: "Bits: b ↔ kb ↔ Mb ↔ Gb", slug: "bits-b-kb-mb-gb" },
  { name: "Binary ↔ Decimal prefixes (KiB ↔ KB)", slug: "binary-decimal-prefixes" },
  { name: "Transfer Speed: Mbps ↔ MB/s", slug: "transfer-speed-mbps-mbs" },
  { name: "Compression Ratio & Size", slug: "compression-ratio-size" },
  { name: "Checksum & Hash Quick Tools", slug: "checksum-hash-quick-tools" },
];

const everydayMixed: Item[] = [
  { name: "Cooking: tsp/tbsp/cup ↔ mL", slug: "cooking-tsp-tbsp-cup-ml" },
  { name: "Fuel Economy: L/100km ↔ mpg", slug: "fuel-economy-l-per-100km-mpg" },
  { name: "Currency: FX quick convert", slug: "currency-fx-quick-convert" },
  { name: "BMI & BSA quick estimators", slug: "bmi-bsa-quick-estimators" },
  { name: "Paper Size: A-series ↔ US", slug: "paper-size-a-series-us" },
  { name: "Shoe Size: EU ↔ US ↔ UK", slug: "shoe-size-eu-us-uk" },
];

const TOTAL = coreUnits.length + mechanicsPressure.length + timeFrequency.length + computingData.length + everydayMixed.length; // 25

export default function ConversionCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🌎" size={38} className="text-primary" label="Conversion" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Conversion Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Core unit conversions and practical calculators for mechanics, time/frequency, computing/data, and everyday tasks.
                    </p>
                    <p>
                      Convert length, area, volume, mass, temperature, density, angle, and speed between common systems easily.
                    </p>
                    <p>
                      Mechanics & pressure: force, energy, power, pressure, torque, and quick work/potential energy helpers.
                    </p>
                    <p>
                      Time & frequency: time scales, Hz/kHz/MHz, period↔frequency, fps↔Hz, and timezone shifting.
                    </p>
                    <p>
                      Computing & data: bytes/bits, binary↔decimal prefixes, transfer speeds, compression, and checksum/hash utilities.
                    </p>
                    <p>
                      Everyday & mixed: cooking measures, fuel economy, currency, BMI/BSA, paper sizes, and shoe size conversions.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    A curated hub of conversions: core units, mechanics & pressure, time & frequency, computing & data, plus everyday & mixed tasks. Clean UI, fast links, and practical defaults to keep unit switching simple.
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
              emoji="📏"
              title={`Core Units (${coreUnits.length})`}
              description="Length, area, volume, mass, temperature, density, angle, and speed in everyday SI/Imperial pairs."
              items={coreUnits}
              base="/conversion"
            />

            <Section
              emoji="⚙️"
              title={`Mechanics & Pressure (${mechanicsPressure.length})`}
              description="Force, energy, power, pressure, torque, with quick helpers for work and potential energy."
              items={mechanicsPressure}
              base="/conversion"
            />

            <Section
              emoji="⏱️"
              title={`Time & Frequency (${timeFrequency.length})`}
              description="Time scales, frequency bands, period↔frequency conversions, frame rate↔Hz, and timezone shifts."
              items={timeFrequency}
              base="/conversion"
            />

            <Section
              emoji="💾"
              title={`Computing & Data (${computingData.length})`}
              description="Bytes/bits, binary↔decimal prefixes, transfer speeds, compression ratio & size, checksum/hash quick tools."
              items={computingData}
              base="/conversion"
            />

            <Section
              emoji="📦"
              title={`Everyday & Mixed (${everydayMixed.length})`}
              description="Cooking measures, fuel economy, currency conversions, BMI/BSA estimators, paper sizes, and shoe sizes."
              items={everydayMixed}
              base="/conversion"
            />

            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

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
