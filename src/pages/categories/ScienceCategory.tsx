import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareBox from "../../components/share/ShareBox";
import SuggestBoxInline from "../../components/contact/SuggestBoxInline";

type Item = { name: string; slug: string };

// ===== SEÇÕES =====
const physicsMechanicsMotion: Item[] = [
  { name: "Kinematics Equations Solver (SUVAT)", slug: "kinematics-suvat-solver" },
  { name: "Projectile Motion Calculator", slug: "projectile-motion-calculator" },
  { name: "Force, Work & Energy Calculator", slug: "force-work-energy-calculator" },
  { name: "Momentum & Impulse Calculator", slug: "momentum-impulse-calculator" },
  { name: "Power & Efficiency Calculator", slug: "power-efficiency-calculator" },
  { name: "Uniform Circular Motion (centrípeta)", slug: "uniform-circular-motion-centripetal" },
  { name: "Free-Fall Time/Velocity Estimator", slug: "free-fall-time-velocity-estimator" },
];

const physicsWavesOpticsThermo: Item[] = [
  { name: "Wave Speed / Frequency / Wavelength", slug: "wave-speed-frequency-wavelength" },
  { name: "Snell’s Law & Critical Angle Calculator", slug: "snells-law-critical-angle" },
  { name: "Thin Lens (1/f = 1/do + 1/di) Solver", slug: "thin-lens-solver" },
  { name: "Specific Heat (q = m·c·ΔT) Calculator", slug: "specific-heat-q-mc-delta-t" },
  { name: "Heat Transfer (Conduction Q = kAΔT·t/L)", slug: "heat-transfer-conduction" },
  { name: "Blackbody Peak (Lei de Wien) Estimator", slug: "blackbody-peak-wien-law-estimator" },
];

const physicsElectricityModern: Item[] = [
  { name: "Photon Energy (E = h·f) Calculator", slug: "photon-energy-e-hf" },
  { name: "Half-Life / Exponential Decay Calculator", slug: "half-life-exponential-decay" },
  { name: "Radioactive Activity (A = λN)", slug: "radioactive-activity-a-lambda-n" },
  { name: "Capacitor/Inductor Reactance (educacional)", slug: "reactance-capacitor-inductor-educational" },
  { name: "RC Time Constant (τ = R·C)", slug: "rc-time-constant-tau-rc" },
];

const chemistrySolutionsStoich: Item[] = [
  { name: "Molarity / Moles / Volume Calculator", slug: "molarity-moles-volume" },
  { name: "Dilution Calculator (C₁V₁ = C₂V₂)", slug: "dilution-c1v1-c2v2" },
  { name: "Molality & Normality Converter (educacional)", slug: "molality-normality-converter" },
  { name: "Ideal Gas Law (PV = nRT) Calculator", slug: "ideal-gas-law-pv-nrt" },
  { name: "Stoichiometry & Limiting Reagent Solver", slug: "stoichiometry-limiting-reagent" },
  { name: "Percent Yield & Theoretical Yield", slug: "percent-yield-theoretical-yield" },
  { name: "pH / pOH / [H⁺]/[OH⁻] Calculator", slug: "ph-poh-h-oh-calculator" },
  { name: "Buffer (Henderson–Hasselbalch) Helper", slug: "buffer-henderson-hasselbalch-helper" },
];

const chemistryCompositionUnits: Item[] = [
  { name: "Molar Mass Calculator", slug: "molar-mass-calculator" },
  { name: "Percent Composition by Mass", slug: "percent-composition-by-mass" },
  { name: "ppm / ppb Concentration Converter", slug: "ppm-ppb-concentration-converter" },
  { name: "Density / Specific Gravity Calculator", slug: "density-specific-gravity-calculator" },
];

const astronomyEarthScience: Item[] = [
  { name: "Escape Velocity Calculator", slug: "escape-velocity-calculator" },
  { name: "Orbital Period (Kepler) Estimator", slug: "orbital-period-kepler-estimator" },
  { name: "Gravity on Other Planets (g′) Calculator", slug: "gravity-on-other-planets-calculator" },
];

const TOTAL =
  physicsMechanicsMotion.length +
  physicsWavesOpticsThermo.length +
  physicsElectricityModern.length +
  chemistrySolutionsStoich.length +
  chemistryCompositionUnits.length +
  astronomyEarthScience.length; // 33

export default function ScienceCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto max-w-7xl px-4 pb-16 lg:pr-[65px]">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9 pr-[15px]">
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🔬" size={38} className="text-primary" label="Science" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Science Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <> 
                    <p>
                      Physics (mechanics, motion, waves, optics, thermodynamics, electricity) and chemistry (solutions, stoichiometry, composition), plus astronomy and earth science — all in a clean layout.
                    </p>
                    <p>
                      Solve kinematics (SUVAT), projectile motion, force/work/energy, momentum/impulse, power/efficiency, uniform circular motion, and free fall.
                    </p>
                    <p>
                      In waves/optics/thermo: wave speed, Snell’s law and critical angle, thin lens equations, specific heat, conduction heat transfer, and blackbody peak (Wien’s law).
                    </p>
                    <p>
                      In electricity and modern physics: photon energy, half‑life/exponential decay, radioactive activity, capacitive/inductive reactance, and RC time constant.
                    </p>
                    <p>
                      In chemistry: molarity/moles/volume, dilution (C₁V₁ = C₂V₂), molality/normality, ideal gas law (PV = nRT), stoichiometry and limiting reagent, percent yield, pH/pOH/[H⁺]/[OH⁻], and buffer calculations (Henderson–Hasselbalch).
                    </p>
                    <p>
                      In astronomy/earth science: escape velocity, orbital period (Kepler), and gravity on other planets.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    A hub of 33 science calculators covering physics (mechanics, waves, optics, thermo, electricity), chemistry (solutions and composition), and astronomy/earth science. Fast links and clear organization for study and practice.
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
              title={`Physics — Mechanics & Motion (${physicsMechanicsMotion.length})`}
              description="SUVAT, projectile motion, force/work/energy, momentum/impulse, power/efficiency, uniform circular motion, and free fall."
              items={physicsMechanicsMotion}
              base="/science"
            />

            <Section
              emoji="🌊"
              title={`Physics — Waves, Optics & Thermo (${physicsWavesOpticsThermo.length})`}
              description="Wave speed, Snell’s law and critical angle, thin lenses, specific heat, thermal conduction, and blackbody peak (Wien’s law)."
              items={physicsWavesOpticsThermo}
              base="/science"
            />

            <Section
              emoji="⚡"
              title={`Physics — Electricity & Modern (${physicsElectricityModern.length})`}
              description="Photon energy, half‑life/decay, radioactive activity, capacitive/inductive reactance (educational), and RC time constant."
              items={physicsElectricityModern}
              base="/science"
            />

            <Section
              emoji="🧪"
              title={`Chemistry — Solutions & Stoichiometry (${chemistrySolutionsStoich.length})`}
              description="Molarity/moles/volume, dilution, molality/normality, ideal gas law, stoichiometry and limiting reagent, yields, pH/pOH/[H⁺]/[OH⁻], and Henderson–Hasselbalch buffer."
              items={chemistrySolutionsStoich}
              base="/science"
            />

            <Section
              emoji="⚗️"
              title={`Chemistry — Composition & Units (${chemistryCompositionUnits.length})`}
              description="Molar mass, percent composition, ppm/ppb, and density/specific gravity."
              items={chemistryCompositionUnits}
              base="/science"
            />

            <Section
              emoji="🪐"
              title={`Astronomy & Earth Science (${astronomyEarthScience.length})`}
              description="Escape velocity, orbital period (Kepler), and gravity on other planets."
              items={astronomyEarthScience}
              base="/science"
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <ShareBox />
              <SuggestBoxInline />
            </div>
          </div>

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