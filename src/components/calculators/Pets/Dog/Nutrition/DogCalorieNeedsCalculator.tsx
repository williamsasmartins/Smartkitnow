import React, { useMemo, useState } from "react";

/**
 * Dog Calorie Needs (RER/MER)
 * - RER = 70 * (BW^0.75) for 3–45 kg (common formula)
 * - MER = RER * activity/physio factor
 * Factors (typical ranges):
 *   - weight loss: 1.0
 *   - neutered adult: 1.6
 *   - intact adult: 1.8
 *   - active/working: 2.0–5.0 (use slider)
 *   - puppy <4m: 3.0
 *   - puppy 4–12m: 2.0
 *
 * NOTE: Educational use. Not a substitute for veterinary advice.
 */

type Physio =
  | "weight-loss"
  | "neutered-adult"
  | "intact-adult"
  | "puppy-under-4m"
  | "puppy-4to12m"
  | "custom";

const PRESET_FACTORS: Record<Physio, number> = {
  "weight-loss": 1.0,
  "neutered-adult": 1.6,
  "intact-adult": 1.8,
  "puppy-under-4m": 3.0,
  "puppy-4to12m": 2.0,
  custom: 1.6,
};

const KG_PER_LB = 0.45359237;

export default function DogCalorieNeedsCalculator() {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [bwInput, setBwInput] = useState<string>("");
  const [physio, setPhysio] = useState<Physio>("neutered-adult");
  const [customFactor, setCustomFactor] = useState<number>(2.0);

  const bodyWeightKg = useMemo(() => {
    const v = parseFloat(bwInput);
    if (!isFinite(v) || v <= 0) return NaN;
    return unit === "kg" ? v : v * KG_PER_LB;
  }, [bwInput, unit]);

  const rer = useMemo(() => {
    if (!isFinite(bodyWeightKg)) return NaN;
    // Common allometric RER formula
    return 70 * Math.pow(bodyWeightKg, 0.75);
  }, [bodyWeightKg]);

  const factor = physio === "custom" ? customFactor : PRESET_FACTORS[physio];

  const mer = useMemo(() => {
    if (!isFinite(rer)) return NaN;
    return rer * factor;
  }, [rer, factor]);

  const bwDisplay =
    unit === "kg"
      ? `${isFinite(bodyWeightKg) ? bodyWeightKg.toFixed(2) : "--"} kg`
      : `${bwInput || "--"} lb (${isFinite(bodyWeightKg) ? bodyWeightKg.toFixed(2) : "--"} kg)`;

  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Dog Calorie Needs (RER/MER)</h1>
      <p className="text-sm opacity-80">
        Estimate Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) using common veterinary
        factors. Educational tool — not a substitute for veterinary care.
      </p>

      {/* FORM */}
      <div className="mt-6 p-4 border rounded-xl grid gap-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="text-sm font-medium">Body weight</span>
            <input
              inputMode="decimal"
              className="mt-1 w-full border rounded-md px-3 py-2"
              placeholder={unit === "kg" ? "e.g., 12" : "e.g., 26.5"}
              value={bwInput}
              onChange={(e) => setBwInput(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Unit</span>
            <select
              className="mt-1 w-full border rounded-md px-3 py-2"
              value={unit}
              onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Physiological/Activity factor</span>
          <select
            className="mt-1 w-full border rounded-md px-3 py-2"
            value={physio}
            onChange={(e) => setPhysio(e.target.value as Physio)}
          >
            <option value="weight-loss">Weight loss (1.0 × RER)</option>
            <option value="neutered-adult">Neutered adult (1.6 × RER)</option>
            <option value="intact-adult">Intact adult (1.8 × RER)</option>
            <option value="puppy-under-4m">Puppy &lt; 4 months (3.0 × RER)</option>
            <option value="puppy-4to12m">Puppy 4–12 months (2.0 × RER)</option>
            <option value="custom">Custom factor</option>
          </select>
        </label>

        {physio === "custom" && (
          <label className="block">
            <span className="text-sm font-medium">Custom factor (0.8 – 5.0)</span>
            <input
              type="range"
              min={0.8}
              max={5}
              step={0.1}
              value={customFactor}
              onChange={(e) => setCustomFactor(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm mt-1">Current: <code>{customFactor.toFixed(1)} × RER</code></div>
          </label>
        )}
      </div>

      {/* RESULTS */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-xl">
          <h3 className="m-0">RER — Resting Energy Requirement</h3>
          <p className="text-sm opacity-80 m-0">70 × (BW<sup>0.75</sup>)</p>
          <p className="text-lg font-semibold mt-2">
            {isFinite(rer) ? `${Math.round(rer)} kcal/day` : "—"}
          </p>
          <p className="text-sm opacity-80 m-0">Body weight: {bwDisplay}</p>
        </div>

        <div className="p-4 border rounded-xl">
          <h3 className="m-0">MER — Maintenance Energy Requirement</h3>
          <p className="text-sm opacity-80 m-0">RER × factor</p>
          <p className="text-lg font-semibold mt-2">
            {isFinite(mer) ? `${Math.round(mer)} kcal/day` : "—"}
          </p>
          <p className="text-sm opacity-80 m-0">
            Factor: <code>{factor.toFixed(1)}×</code>
          </p>
        </div>
      </div>

      {/* FORMULA */}
      <div className="mt-8">
        <h3>Formula</h3>
        <pre><code>{`RER = 70 × (BW_kg^0.75)
MER = RER × activity/physiological factor`}</code></pre>
      </div>

      {/* EXAMPLES */}
      <div className="mt-8">
        <h3>Examples</h3>
        <ul>
          <li>12 kg neutered adult: RER ≈ 70 × 12^0.75 ≈ 520 → MER ≈ 520 × 1.6 ≈ 830 kcal/day.</li>
          <li>6 kg weight-loss plan: RER ≈ 70 × 6^0.75 ≈ 365 → MER ≈ 365 × 1.0 = 365 kcal/day.</li>
        </ul>
      </div>

      {/* REFERENCES */}
      <div className="mt-8">
        <h3>References</h3>
        <ul>
          <li>WSAVA Global Nutrition Toolkit – Energy requirements & life-stage factors.</li>
          <li>NRC (2006) Nutrient Requirements of Dogs and Cats – allometric RER formula.</li>
        </ul>
      </div>
    </div>
  );
}