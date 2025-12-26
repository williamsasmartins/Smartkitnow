import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

// Estrutura espelhada da página FinancialCategory

type Item = { name: string; slug: string };

// Consumption, Costs & Travel (9)
const consumptionCostsTravel: Item[] = [
  { name: "Trip Fuel Cost Calculator (mpg/L-100 km + fuel price)", slug: "trip-fuel-cost" },
  { name: "Fuel Economy Converter (mpg ↔ L/100 km)", slug: "fuel-economy-converter" },
  { name: "Annual Fuel Cost & Break-Even (gas vs. electric/E85)", slug: "annual-fuel-cost-break-even" },
  { name: "EV kWh per 100 mi ↔ Cost per Mile", slug: "ev-kwh-per-100mi-cost-per-mile" },
  { name: "EV Charging Cost & Time Estimator (home/public)", slug: "ev-charging-cost-time" },
  { name: "ICE vs EV Ownership Cost (5 years)", slug: "ice-vs-ev-ownership-cost-5y" },
  { name: "Carbon Emissions per Trip (estimation)", slug: "carbon-emissions-per-trip" },
  { name: "Total Cost of Ownership (TCO) Calculator", slug: "tco-total-cost-ownership" },
  { name: "Cost Per Mile (Per Kilometer) Calculator", slug: "cost-per-mile-km" },
];

// Tires, Wheels & Speedometer (7)
const tiresWheelsSpeedometer: Item[] = [
  { name: "Tire Size Comparison (e.g., 205/55R16 ↔ 225/45R17)", slug: "tire-size-comparison" },
  { name: "Speedometer Error (wheel/tire diameter)", slug: "speedometer-error" },
  { name: "Wheel Offset/Backspacing Calculator", slug: "wheel-offset-backspacing" },
  { name: "Tire Revolutions per Mile & RPM @ Speed", slug: "tire-revs-per-mile-rpm-speed" },
  { name: "Final Drive & Gear Ratio Speed Calculator", slug: "final-drive-gear-ratio-speed" },
  { name: "Shift Point RPM Drop Estimator", slug: "shift-point-rpm-drop" },
  { name: "0–60 Speed vs Gear/RPM (approx. educational)", slug: "zero-to-sixty-gear-rpm" },
];

// Financing, Leasing & Value (8)
const financingLeasingValue: Item[] = [
  { name: "Car Loan Payment & Amortization Calculator", slug: "car-loan-payment-amortization" },
  { name: "Lease vs Buy Calculator (total vs. monthly payment)", slug: "lease-vs-buy" },
  { name: "Down Payment Impact & Payoff Time", slug: "down-payment-impact-payoff-time" },
  { name: "Depreciation Curve Estimator (by segment/age)", slug: "depreciation-curve-estimator" },
  { name: "Insurance Cost per Year (simple estimation)", slug: "insurance-cost-per-year" },
  { name: "Sales Tax, Title & Fees Out-the-Door Estimator", slug: "out-the-door-tax-title-fees" },
  { name: "Used Car Value Estimator (Trade-In / Private Party)", slug: "used-car-value-estimator" },
  { name: "Low APR vs. Cash Back Incentive Calculator", slug: "low-apr-vs-cashback-incentive" },
];

// Maintenance & Capacity (4)
const maintenanceCapacity: Item[] = [
  { name: "Oil Change Interval Planner (time/odometer)", slug: "oil-change-interval-planner" },
  { name: "Brake Pad/Rotors Wear Estimator (city/highway use)", slug: "brake-wear-estimator" },
  { name: "Towing Capacity Safety Margin Checker (educational)", slug: "towing-capacity-safety-margin" },
  { name: "Payload & GVWR Utilization Helper", slug: "payload-gvwr-utilization" },
];

// Electric Vehicles & Comparisons (16)
const electricVehiclesComparisons: Item[] = [
  { name: "EV Home vs Public Charging Cost & Time Calculator", slug: "ev-home-public-charging-cost-time" },
  { name: "EV Cost Per Mile Calculator", slug: "ev-cost-per-mile" },
  { name: "EV Real-World Range Estimator", slug: "ev-real-world-range" },
  { name: "EV vs Hybrid vs Gas TCO Calculator", slug: "ev-hybrid-gas-tco" },
  { name: "EV vs Hybrid Break-Even Point Calculator", slug: "ev-hybrid-break-even" },
  { name: "Annual Fuel/Electricity Cost: EV vs Hybrid", slug: "annual-ev-hybrid-cost" },
  { name: "EV Trip Cost & Charging Planner", slug: "ev-trip-cost-planner" },
  { name: "CO2 Emissions Savings: EV vs Hybrid", slug: "ev-hybrid-co2-savings" },
  { name: "EV Battery Degradation & Long-Term Range Estimator", slug: "ev-battery-degradation" },
  { name: "Home Charger Installation Cost & Payback Calculator", slug: "ev-home-charger-payback" },
  { name: "EV Incentives & Tax Credits Estimator", slug: "ev-incentives-estimator" },
  { name: "EV Maintenance Savings vs Hybrid Calculator", slug: "ev-hybrid-maintenance-savings" },
  { name: "EV Fast Charging Impact on Battery Life Calculator", slug: "ev-fast-charging-degradation" },
  { name: "EV Solar Charging Savings Calculator", slug: "ev-solar-charging-savings" },
  { name: "PHEV Electric vs Gas Mode Cost Calculator", slug: "phev-electric-gas-mode-cost" },
  { name: "EV Preconditioning Energy & Cost Estimator", slug: "ev-preconditioning-cost" },
];

// Performance & Tuning (12)
const performanceTuning: Item[] = [
  { name: "Horsepower from Quarter Mile ET Calculator", slug: "hp-from-quarter-mile-et" },
  { name: "Quarter Mile ET & MPH from HP Calculator", slug: "quarter-mile-et-mph-from-hp" },
  { name: "0-60 mph Acceleration Time Estimator", slug: "zero-to-sixty-time" },
  { name: "Horsepower to Torque Converter", slug: "hp-to-torque-converter" },
  { name: "Engine Displacement Calculator", slug: "engine-displacement" },
  { name: "Compression Ratio Calculator", slug: "compression-ratio" },
  { name: "Carburetor CFM Sizing Calculator", slug: "carb-cfm-sizing" },
  { name: "Camshaft Duration & Overlap Calculator", slug: "camshaft-duration-overlap" },
  { name: "Header Primary Tube Length & Diameter Calculator", slug: "header-tube-length-diameter" },
  { name: "Power Gains from Modifications Estimator", slug: "mod-power-gains-estimator" },
  { name: "EV Acceleration & Torque Delivery Estimator", slug: "ev-acceleration-torque" },
  { name: "Dyno Correction Factor Calculator", slug: "dyno-correction-factor" },
];

const TOTAL =
  consumptionCostsTravel.length +
  tiresWheelsSpeedometer.length +
  financingLeasingValue.length +
  maintenanceCapacity.length +
  electricVehiclesComparisons.length +
  performanceTuning.length; // 56

export default function AutomotiveCategory() {
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
                <EmojiIcon symbol="🚗" size={38} className="text-primary" label="Automotive" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Automotive Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Estimate driving costs and optimize trips with {TOTAL} calculators. Compute trip fuel costs, convert fuel economy between mpg and L/100 km, compare annual fuel cost and break-even across gas, electric, and E85, and translate EV kWh/100 mi to cost per mile.
                    </p>
                    <p>
                      Plan EV charging costs and time for home/public stations, compare ICE vs EV ownership costs over 5 years, estimate per-trip carbon emissions, calculate true cost-per-mile, and see complete TCO with depreciation, fuel, and maintenance.
                    </p>
                    <p>
                      Tune wheels and gearing: compare tire sizes, check speedometer error, compute offset/backspacing, estimate tire revs per mile and RPM at speed, model final drive and gear ratio speed, predict RPM drop at shift points, and approximate 0–60 by gear/RPM.
                    </p>
                    <p>
                      Finance smarter: loan payment and amortization, lease vs buy, effect of down payment on payoff, depreciation curve by segment/age, annual insurance estimator, out-the-door taxes/fees, used car value (trade-in/private), and low APR vs cash-back incentives.
                    </p>
                    <p>
                      Maintain safely: plan oil change intervals, estimate brake/rotor wear, check towing capacity safety margins, and track payload vs GVWR utilization.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} automotive tools: trip fuel cost, fuel economy conversion, EV costs, ICE vs EV ownership, carbon emissions, TCO, cost per mile; tire size, speedometer error, offset, revs/RPM, gear ratio speed, shift RPM drop, 0–60 by gear/RPM; financing (loan, lease vs buy, down payment, depreciation, insurance, out-the-door), used car value, APR vs cash-back; maintenance (oil interval, brake wear, towing safety, payload/GVWR).
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
              emoji="⛽"
              title={`Consumption, Costs & Travel (${consumptionCostsTravel.length})`}
              description="Trip fuel cost, fuel economy converter (mpg ↔ L/100 km), annual fuel cost & break-even (gas/electric/E85), EV kWh/100 mi ↔ cost per mile, EV charging cost/time, ICE vs EV 5-year ownership, carbon emissions per trip, TCO, and cost per mile."
              items={consumptionCostsTravel}
              base="/automotive"
            />

            <Section
              emoji="🛞"
              title={`Tires, Wheels & Speedometer (${tiresWheelsSpeedometer.length})`}
              description="Tire size comparison, speedometer error by wheel/tire diameter, wheel offset/backspacing, tire revs/mile and RPM @ speed, final drive & gear ratio speed, shift point RPM drop, and 0–60 by gear/RPM (approx.)."
              items={tiresWheelsSpeedometer}
              base="/automotive"
            />

            <Section
              emoji="💸"
              title={`Financing, Leasing & Value (${financingLeasingValue.length})`}
              description="Car loan payment & amortization, lease vs buy (total/monthly), down payment impact & payoff time, depreciation curve by segment/age, insurance cost/year, out-the-door estimator (tax/title/fees), used car value (trade-in/private), and low APR vs cash-back incentives."
              items={financingLeasingValue}
              base="/automotive"
            />

            <Section
              emoji="🧰"
              title={`Maintenance & Capacity (${maintenanceCapacity.length})`}
              description="Oil change interval planner, brake pad/rotor wear estimation, towing capacity safety margin (educational), and payload/GVWR utilization helper."
              items={maintenanceCapacity}
              base="/automotive"
            />

            <Section
              emoji="⚡"
              title={`Electric Vehicles & Comparisons (${electricVehiclesComparisons.length})`}
              description="EV charging cost/time, cost per mile, real-world range, TCO vs gas/hybrid, break-even point, CO2 savings, battery degradation, home charger payback, incentives, and solar charging savings."
              items={electricVehiclesComparisons}
              base="/automotive"
            />

            <Section
              emoji="🏎️"
              title={`Performance & Tuning (${performanceTuning.length})`}
              description="Estimate horsepower, quarter-mile times, 0-60 acceleration, compression ratio, engine displacement, carburetor sizing, and more."
              items={performanceTuning}
              base="/automotive"
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
