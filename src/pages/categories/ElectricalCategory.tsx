import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareBox from "../../components/share/ShareBox";
import SuggestBoxInline from "../../components/contact/SuggestBoxInline";

// Estrutura espelhada da página FinancialCategory

type Item = { name: string; slug: string };

// Basic Electrical & Circuit Calculations (8)
const basicElectricalCircuit: Item[] = [
  { name: "Ohm's Law Calculator (V, I, R, P)", slug: "ohms-law" },
  { name: "Voltage Drop Calculator (Wire Gauge & Length)", slug: "voltage-drop-wire-length" },
  { name: "Current (Amperage) Calculator", slug: "current-amperage" },
  { name: "Power (Watts) Calculator", slug: "power-watts" },
  { name: "Electrical Resistance Calculator", slug: "electrical-resistance" },
  { name: "Parallel & Series Circuit Calculator", slug: "parallel-series-circuit" },
  { name: "Resistor Color Code Decoder", slug: "resistor-color-code" },
  { name: "Electrical Load Capacity (Breaker/Panel) Calculator", slug: "electrical-load-capacity" },
];

// Wiring, Conductors & Breakers (9)
const wiringConductorsBreakers: Item[] = [
  { name: "Wire Size (AWG/KCMIL) Calculator", slug: "wire-size-awg-kcmil" },
  { name: "Breaker Size Calculator", slug: "breaker-size" },
  { name: "Conduit Fill Calculator", slug: "conduit-fill" },
  { name: "Voltage Loss & Efficiency Calculator", slug: "voltage-loss-efficiency" },
  { name: "Cable Ampacity by Distance Calculator", slug: "cable-ampacity-by-distance" },
  { name: "3-Phase Power Calculator", slug: "three-phase-power" },
  { name: "Transformer kVA Calculator", slug: "transformer-kva" },
  { name: "Motor FLA (Full Load Amps) Calculator", slug: "motor-fla" },
  { name: "Conduit Bending Calculator", slug: "conduit-bending" },
];

// Lighting, Energy Cost & Home Electrical (6)
const lightingEnergyHome: Item[] = [
  { name: "LED Lighting Power Consumption Calculator", slug: "led-power-consumption" },
  { name: "Lighting Lumens-to-Watts Converter", slug: "lumens-to-watts" },
  { name: "Electricity Cost per Hour/Month Calculator", slug: "electricity-cost-per-hour-month" },
  { name: "Lighting Circuit Load Planner", slug: "lighting-circuit-load-planner" },
  { name: "Generator Sizing Calculator", slug: "generator-sizing" },
  { name: "Power Factor Calculator", slug: "power-factor" },
];

// Renewable Energy & Battery Systems (8)
const renewableEnergyBattery: Item[] = [
  { name: "PV System Production Estimator (e.g., PVWatts)", slug: "pv-system-production-estimator" },
  { name: "Off-Grid System Sizing Calculator", slug: "off-grid-system-sizing" },
  { name: "Solar Panel Output & Array Sizing Calculator", slug: "solar-panel-output-array-sizing" },
  { name: "Solar Battery Bank Sizing Calculator", slug: "solar-battery-bank-sizing" },
  { name: "Inverter Load Capacity Calculator", slug: "inverter-load-capacity" },
  { name: "EV Charging Time Calculator", slug: "ev-charging-time" },
  { name: "Battery Runtime Estimator", slug: "battery-runtime-estimator" },
  { name: "System Payback Period (ROI) Calculator", slug: "system-payback-period-roi" },
];

const TOTAL =
  basicElectricalCircuit.length +
  wiringConductorsBreakers.length +
  lightingEnergyHome.length +
  renewableEnergyBattery.length; // 31

export default function ElectricalCategory() {
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
                <EmojiIcon symbol="⚡" size={38} className="text-primary" label="Electrical" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Electrical Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Most sought-after electrical calculators for home, commercial, and industrial setups. Core circuit math (Ohm's law, voltage drop, current, power, resistance), parallel/series analysis, resistor color codes, and panel/breaker load capacity.
                    </p>
                    <p>
                      Wiring and protection: wire sizing (AWG/KCMIL), breaker size, conduit fill, voltage loss & efficiency, cable ampacity by distance, 3‑phase power, transformer kVA, motor FLA, and precise conduit bending.
                    </p>
                    <p>
                      Lighting and home energy: LED power consumption, lumens↔watts conversion, electricity cost per hour/month, lighting circuit load planning, generator sizing, and power factor for efficiency.
                    </p>
                    <p>
                      Renewable and storage systems: PV system production (PVWatts‑style), off‑grid system sizing, solar array and battery bank sizing, inverter capacity, EV charging time, battery runtime estimation, and system payback period (ROI).
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} electrical tools: Ohm's law, voltage drop, current, power, resistance, parallel/series circuits, resistor color code, load capacity; wire size, breaker, conduit fill, voltage loss & efficiency, cable ampacity by distance, 3‑phase power, transformer kVA, motor FLA, conduit bending; LED power, lumens↔watts, electricity cost, circuit load planning, generator sizing, power factor; PV production, off‑grid sizing, solar array & battery bank, inverter capacity, EV charging time, battery runtime, ROI payback.
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
              emoji="🔌"
              title={`Basic Electrical & Circuit Calculations (${basicElectricalCircuit.length})`}
              description="Ohm's law (V/I/R/P), voltage drop (wire gauge & length), current, power (watts), resistance, parallel & series circuits, resistor color code decoding, and panel/breaker load capacity."
              items={basicElectricalCircuit}
              base="/electrical"
            />

            <Section
              emoji="🧰"
              title={`Wiring, Conductors & Breakers (${wiringConductorsBreakers.length})`}
              description="Wire sizing (AWG/KCMIL), breaker size, conduit fill, voltage loss & system efficiency, cable ampacity by distance, 3‑phase power, transformer kVA, motor FLA (full load amps), and conduit bending."
              items={wiringConductorsBreakers}
              base="/electrical"
            />

            <Section
              emoji="💡"
              title={`Lighting, Energy Cost & Home Electrical (${lightingEnergyHome.length})`}
              description="LED power consumption, lumens↔watts conversion, electricity cost per hour/month, lighting circuit load planner, generator sizing, and power factor for efficiency."
              items={lightingEnergyHome}
              base="/electrical"
            />

            <Section
              emoji="☀️"
              title={`Renewable Energy & Battery Systems (${renewableEnergyBattery.length})`}
              description="PV system production estimation, off‑grid system sizing, solar array output and sizing, battery bank sizing, inverter load capacity, EV charging time, battery runtime, and system payback period (ROI)."
              items={renewableEnergyBattery}
              base="/electrical"
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