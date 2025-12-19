import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

type Item = { name: string; slug: string };

// ===== SEÇÕES =====
const percentRatioFractions: Item[] = [
  { name: "Percent of Total Calculator", slug: "percent-of-total" },
  { name: "Percent Increase/Decrease Calculator", slug: "percent-increase-decrease" },
  { name: "Percent Change Calculator", slug: "percent-change" },
  { name: "Fraction ⇄ Decimal Converter", slug: "fraction-decimal-converter" },
  { name: "Fraction Reducer / Simplifier", slug: "fraction-reducer-simplifier" },
  { name: "Ratio Calculator (A:B = C:D)", slug: "ratio-calculator" },
  { name: "Percent Error Calculator", slug: "percent-error-calculator" },
  { name: "Proportion Solver (Cross-Multiplication)", slug: "proportion-solver" },
];

const algebraEquations: Item[] = [
  { name: "Quadratic Equation Solver (ax²+bx+c)", slug: "quadratic-equation-solver" },
  { name: "Linear Equation Solver (1–2 variables)", slug: "linear-equation-solver-1-2-variables" },
  { name: "System of Equations Solver (Substitution/Eliminação)", slug: "system-of-equations-substitution-elimination" },
  { name: "Exponent & Power Calculator", slug: "exponent-power-calculator" },
  { name: "Log / Antilog (base 10/e) Calculator", slug: "log-antilog-base-10-e" },
  { name: "Scientific Notation ⇄ Standard Form", slug: "scientific-notation-standard-form" },
  { name: "Polynomial Factorization Helper", slug: "polynomial-factorization-helper" },
  { name: "Root/Radical Simplifier", slug: "root-radical-simplifier" },
];

const numberTheoryDiscrete: Item[] = [
  { name: "GCF / GCD Calculator", slug: "gcf-gcd-calculator" },
  { name: "LCM Calculator", slug: "lcm-calculator" },
  { name: "Prime Factorization Tool", slug: "prime-factorization-tool" },
  { name: "Modulo (Remainder) Calculator", slug: "modulo-remainder-calculator" },
  { name: "Permutations & Combinations (nPr / nCr)", slug: "permutations-combinations-npr-ncr" },
  { name: "Random Number Generator (ranges)", slug: "random-number-generator-ranges" },
];

const geometryTrig: Item[] = [
  { name: "Triangle Solver (SSS/SAS/ASA)", slug: "triangle-solver-sss-sas-asa" },
  { name: "Circle Area / Circumference Calculator", slug: "circle-area-circumference" },
  { name: "Rectangle & Parallelogram Area Calculator", slug: "rectangle-parallelogram-area" },
  { name: "Pythagorean Theorem Solver", slug: "pythagorean-theorem-solver" },
  { name: "Trig Functions (sin/cos/tan) Angle/Side Finder", slug: "trig-functions-angle-side-finder" },
  { name: "2D/3D Shapes Area & Volume Pack", slug: "shapes-area-volume-pack" },
  { name: "Angle Converter (deg ↔ rad)", slug: "angle-converter-deg-rad" },
];

const statsProbability: Item[] = [
  { name: "Mean, Median, Mode Calculator", slug: "mean-median-mode" },
  { name: "Standard Deviation & Variance (pop/sample)", slug: "standard-deviation-variance-pop-sample" },
  { name: "Z-Score & Percentile Finder", slug: "z-score-percentile-finder" },
  { name: "Linear Interpolation / Extrapolation", slug: "linear-interpolation-extrapolation" },
  { name: "Binomial Probability Calculator", slug: "binomial-probability-calculator" },
  { name: "Normal CDF / PDF Quick Estimator", slug: "normal-cdf-pdf-estimator" },
];

const TOTAL =
  percentRatioFractions.length +
  algebraEquations.length +
  numberTheoryDiscrete.length +
  geometryTrig.length +
  statsProbability.length; // 35

export default function MathCategory() {
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
                <EmojiIcon symbol="🔢" size={38} className="text-primary" label="Math" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Math & Algebra Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Percentages, ratios and fractions; algebra and equations; number theory; geometry and trigonometry; statistics and probability — all organized in one clean, easy-to-scan page.
                    </p>
                    <p>
                      Find calculators for percentages and proportions, fraction conversions, linear and quadratic equation solvers, systems via substitution/elimination, exponents, and logarithms/antilogarithms.
                    </p>
                    <p>
                      Number theory tools (GCD/LCM, factorization), geometry and trigonometry (areas, perimeters, angles, trig functions), and statistics (mean, standard deviation, z‑score, binomial, normal).
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    A hub of 35 calculators: percentages, fractions, ratios and proportions, algebra and equations, number theory, geometry/trigonometry, and statistics/probability. Clean layout and quick links to solve common problems.
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
              emoji="📊"
              title={`Percent, Ratio & Fractions (${percentRatioFractions.length})`}
              description="Percentages, fractions, ratios/proportions, simplification, and percent error."
              items={percentRatioFractions}
              base="/math"
            />

            <Section
              emoji="🧮"
              title={`Algebra & Equations (${algebraEquations.length})`}
              description="Quadratic and linear equations, systems, exponents, log/antilog, scientific notation, factorization, radicals."
              items={algebraEquations}
              base="/math"
            />

            <Section
              emoji="🔢"
              title={`Number Theory & Discrete (${numberTheoryDiscrete.length})`}
              description="GCF/GCD, LCM, prime factorization, modulo, permutations/combinations, random number generator."
              items={numberTheoryDiscrete}
              base="/math"
            />

            <Section
              emoji="📐"
              title={`Geometry & Trig (${geometryTrig.length})`}
              description="Triangles, areas/perimeters, Pythagorean theorem, trigonometric functions, 2D/3D shapes, angle conversion."
              items={geometryTrig}
              base="/math"
            />

            <Section
              emoji="📈"
              title={`Statistics & Probability (${statsProbability.length})`}
              description="Mean/median/mode, standard deviation/variance, z-score/percentile, interpolation/extrapolation, binomial and normal distributions."
              items={statsProbability}
              base="/math"
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
