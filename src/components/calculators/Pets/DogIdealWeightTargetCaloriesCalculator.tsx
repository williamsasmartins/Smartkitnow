import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Dog,
  Activity,
  HeartPulse,
  Scale,
  Target,
  Info,
  BookOpen,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------

const BREED_SIZES = [
  {
    id: "small",
    label: "Small (2–10 kg)",
    minKg: 2,
    maxKg: 10,
    examples: "Toy Poodle, Yorkshire Terrier, Pug",
  },
  {
    id: "medium",
    label: "Medium (10–25 kg)",
    minKg: 10,
    maxKg: 25,
    examples: "Cocker Spaniel, Border Collie, Beagle",
  },
  {
    id: "large",
    label: "Large (25–45 kg)",
    minKg: 25,
    maxKg: 45,
    examples: "Labrador, Golden Retriever, German Shepherd",
  },
  {
    id: "giant",
    label: "Giant (45–90 kg)",
    minKg: 45,
    maxKg: 90,
    examples: "Great Dane, Saint Bernard, Mastiff",
  },
] as const;

const ACTIVITY_LEVELS = [
  {
    id: "low",
    label: "Low – mostly indoor / older",
    factor: 1.2,
    description: "Short walks, lots of resting, low daily exercise.",
  },
  {
    id: "moderate",
    label: "Moderate – typical pet dog",
    factor: 1.6,
    description: "Daily walks and play, but not an athlete.",
  },
  {
    id: "high",
    label: "High – very active / working",
    factor: 2.0,
    description:
      "Sport, agility, herding, or long runs several times per week.",
  },
] as const;

const BODY_CONDITIONS = [
  {
    id: "underweight",
    label: "Underweight – ribs and spine very easy to see",
    adjustmentHint: "+10–20% weight gain",
    multiplier: 1.12, // approximate target = +12%
  },
  {
    id: "ideal",
    label: "Ideal – waist visible, ribs easy to feel",
    adjustmentHint: "Maintain current weight",
    multiplier: 1.0,
  },
  {
    id: "overweight",
    label: "Overweight – no waist, ribs hard to feel",
    adjustmentHint: "-10–20% weight loss",
    multiplier: 0.85, // approximate target = -15%
  },
] as const;

type BreedSizeId = (typeof BREED_SIZES)[number]["id"];
type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];
type BodyConditionId = (typeof BODY_CONDITIONS)[number]["id"];

interface Results {
  currentWeightKg: number;
  idealRangeMinKg: number;
  idealRangeMaxKg: number;
  targetWeightKg: number;
  rerTarget: number;
  merTarget: number;
  deltaKg: number;
  deltaPercent: number;
  estimatedWeeks: number | null;
}

// ---------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------

const toKg = (weight: number, unit: "kg" | "lb") =>
  unit === "kg" ? weight : weight * 0.45359237;

const formatNumber = (value: number, digits = 1) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

const formatKcal = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);

// ---------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------

export default function DogIdealWeightTargetCaloriesCalculator() {
  const [inputs, setInputs] = useState<{
    weight: string;
    weightUnit: "kg" | "lb";
    breedSizeId: BreedSizeId;
    activityId: ActivityId;
    bodyConditionId: BodyConditionId;
  }>({
    weight: "",
    weightUnit: "kg",
    breedSizeId: "medium",
    activityId: "moderate",
    bodyConditionId: "ideal",
  });

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const results: Results | null = useMemo(() => {
    const raw = parseFloat(inputs.weight.replace(",", "."));
    if (!raw || raw <= 0) return null;

    const currentWeightKg = toKg(raw, inputs.weightUnit);

    const size =
      BREED_SIZES.find((s) => s.id === inputs.breedSizeId) ?? BREED_SIZES[1];

    const idealRangeMinKg = size.minKg;
    const idealRangeMaxKg = size.maxKg;
    const idealMidKg = (size.minKg + size.maxKg) / 2;

    const bodyCond =
      BODY_CONDITIONS.find((b) => b.id === inputs.bodyConditionId) ??
      BODY_CONDITIONS[1];

    // Target weight is a blend of "typical range midpoint" and
    // current weight adjusted by body condition multiplier.
    const adjustedFromCurrent = currentWeightKg * bodyCond.multiplier;
    const targetWeightKg = Math.min(
      Math.max(adjustedFromCurrent, idealRangeMinKg),
      idealRangeMaxKg
    );

    const rerTarget = 70 * Math.pow(targetWeightKg, 0.75);

    const activity =
      ACTIVITY_LEVELS.find((a) => a.id === inputs.activityId) ??
      ACTIVITY_LEVELS[1];

    const merTarget = rerTarget * activity.factor;

    const deltaKg = targetWeightKg - currentWeightKg;
    const deltaPercent = (deltaKg / currentWeightKg) * 100;

    // Estimate weeks assuming 1–2% body weight change per week (we'll use 1.5%)
    let estimatedWeeks: number | null = null;
    const weeklySafeChange = Math.abs(currentWeightKg * 0.015);
    if (weeklySafeChange > 0 && Math.abs(deltaKg) > 0.1) {
      estimatedWeeks = Math.abs(deltaKg) / weeklySafeChange;
    }

    return {
      currentWeightKg,
      idealRangeMinKg,
      idealRangeMaxKg,
      targetWeightKg,
      rerTarget,
      merTarget,
      deltaKg,
      deltaPercent,
      estimatedWeeks,
    };
  }, [inputs]);

  const handleReset = () => {
    setInputs({
      weight: "",
      weightUnit: "kg",
      breedSizeId: "medium",
      activityId: "moderate",
      bodyConditionId: "ideal",
    });
  };

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  // -------------------------------------------------------------------
  // WIDGET (FORM + RESULTADOS)
  // -------------------------------------------------------------------

  const widget = (
    <div className="space-y-6">
      {/* FORM ---------------------------------------------------------- */}
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Dog className="h-5 w-5 text-sky-500" />
            Enter your dog&apos;s details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weight + Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="weight">Current weight</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder="e.g., 18.5"
                value={inputs.weight}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, weight: e.target.value }))
                }
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use the most recent weight from your vet or a reliable scale.
              </p>
            </div>
            <div>
              <Label htmlFor="weightUnit">Unit</Label>
              <select
                id="weightUnit"
                className="h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
                value={inputs.weightUnit}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    weightUnit: e.target.value as "kg" | "lb",
                  }))
                }
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* Breed size */}
          <div>
            <Label htmlFor="breedSize">Breed size category</Label>
            <select
              id="breedSize"
              className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              value={inputs.breedSizeId}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  breedSizeId: e.target.value as BreedSizeId,
                }))
              }
            >
              {BREED_SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Choose the size that best matches your dog&apos;s overall build.
            </p>
          </div>

          {/* Activity level */}
          <div>
            <Label htmlFor="activity">Activity level</Label>
            <select
              id="activity"
              className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              value={inputs.activityId}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  activityId: e.target.value as ActivityId,
                }))
              }
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Compare your dog&apos;s routine with the descriptions above.
            </p>
          </div>

          {/* Body condition */}
          <div>
            <Label htmlFor="bodyCondition">Body condition</Label>
            <select
              id="bodyCondition"
              className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              value={inputs.bodyConditionId}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  bodyConditionId: e.target.value as BodyConditionId,
                }))
              }
            >
              {BODY_CONDITIONS.map((cond) => (
                <option key={cond.id} value={cond.id}>
                  {cond.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              If you are unsure, ask your vet to score your dog&apos;s body
              condition.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          <Calculator className="mr-2 h-4 w-4" />
          Calculate ideal weight & calories
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Target weight and daily calories
          </h3>

          {/* Top cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ideal range */}
            <Card className="bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-400/60 dark:border-sky-500/70 shadow-xl md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-sky-900 dark:text-sky-100">
                  <Scale className="h-5 w-5" />
                  Estimated ideal weight range
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(results.idealRangeMinKg)} –{" "}
                  {formatNumber(results.idealRangeMaxKg)} kg
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Based on the selected breed-size category. Individual breeds
                  may sit slightly above or below this range.
                </p>
              </CardContent>
            </Card>

            {/* Target weight */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-emerald-500" />
                  Target weight
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatNumber(results.targetWeightKg)} kg
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Adjusted from the typical range using your dog&apos;s current
                  body condition.
                </p>
              </CardContent>
            </Card>

            {/* Target calories */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  Target calories (MER)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatKcal(results.merTarget)} kcal/day
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Daily calories to maintain the target weight at the chosen
                  activity level.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary table */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Summary for your dog
            </h4>
            <Table className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-sm">
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/70">
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Current weight</TableCell>
                  <TableCell>{formatNumber(results.currentWeightKg)} kg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Target weight</TableCell>
                  <TableCell>{formatNumber(results.targetWeightKg)} kg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weight change needed</TableCell>
                  <TableCell>
                    {results.deltaKg > 0 ? "+" : ""}
                    {formatNumber(results.deltaKg)} kg (
                    {results.deltaPercent > 0 ? "+" : ""}
                    {formatNumber(results.deltaPercent, 0)}%)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>RER at target weight</TableCell>
                  <TableCell>{formatKcal(results.rerTarget)} kcal/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Target MER (daily calories)</TableCell>
                  <TableCell>{formatKcal(results.merTarget)} kcal/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estimated time to reach target</TableCell>
                  <TableCell>
                    {results.estimatedWeeks
                      ? `${formatNumber(results.estimatedWeeks, 0)} weeks (at ~1.5% body weight change per week)`
                      : "Varies – ask your vet for a tailored plan."}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Guidance note */}
          <div className="flex gap-3 items-start p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300/70 dark:border-amber-800">
            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-slate-800 dark:text-slate-100">
              These values are educational estimates. Always work with your
              veterinarian before starting a weight-loss or weight-gain program,
              especially if your dog has other medical conditions.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------
  // EDITORIAL CONTENT
  // -------------------------------------------------------------------

  const editorial = (
    <div className="space-y-10">
      {/* HOW TO USE ---------------------------------------------------- */}
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How this dog ideal weight & target calories calculator works
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This tool estimates your dog&apos;s{" "}
          <strong>ideal healthy weight range</strong> and the{" "}
          <strong>daily calories</strong> needed to maintain that weight. It
          combines three key pieces of information:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current weight</strong> – measured in kilograms or pounds.
          </li>
          <li>
            <strong>Breed size category</strong> – small, medium, large or
            giant.
          </li>
          <li>
            <strong>Body condition</strong> – underweight, ideal, or overweight,
            based on how easily you can feel ribs and see a waist.
          </li>
        </ul>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          From there, the calculator uses published{" "}
          <strong>veterinary nutrition formulas</strong> to estimate Resting
          Energy Requirement (RER) and Maintenance Energy Requirement (MER) at
          the target weight. That gives you a daily calorie goal to discuss with
          your veterinarian.
        </p>
      </section>

      {/* FORMULA SECTION ---------------------------------------------- */}
      <section
        id="formula"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formulas for ideal weight calories
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Most modern guidelines estimate calorie needs in two steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-4">
          <li>
            Estimate a <strong>target weight</strong> in kilograms.
          </li>
          <li>
            Calculate <strong>RER</strong> and multiply by an{" "}
            <strong>activity factor</strong> to get MER.
          </li>
        </ol>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-800 mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Resting Energy Requirement
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100">
            RER = 70 × (ideal weight in kg)<sup>0.75</sup>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-emerald-100 dark:border-emerald-800 mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Target Maintenance Energy Requirement
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
            Target MER = RER × activity factor
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            The calculator chooses an activity factor based on whether your dog
            is mostly indoor, moderately active, or very active / working.
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
          Typical activity factors
        </h3>
        <Table className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-sm mb-4">
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900/60">
              <TableHead>Activity profile</TableHead>
              <TableHead>Factor</TableHead>
              <TableHead>Example</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY_LEVELS.map((level) => (
              <TableRow key={level.id}>
                <TableCell>{level.label}</TableCell>
                <TableCell>{level.factor.toFixed(1)} × RER</TableCell>
                <TableCell>{level.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="text-slate-700 dark:text-slate-300">
          Your veterinarian may tweak these numbers up or down depending on your
          dog&apos;s medical history, medications, and long-term goals.
        </p>
      </section>

      {/* EXAMPLE ------------------------------------------------------- */}
      <section
        id="example"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Example: medium breed dog that needs to lose weight
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Imagine a <strong>medium breed dog</strong> that currently weighs{" "}
          <strong>24 kg</strong>, is clearly overweight, and has{" "}
          <strong>moderate activity</strong>.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-4">
          <li>
            Choose breed size: medium → typical ideal range{" "}
            <span className="font-mono">10–25 kg</span>.
          </li>
          <li>
            Because the dog is overweight, the calculator nudges the target
            weight below the midpoint of that range. In this example it might
            choose around <strong>20 kg</strong> as the target.
          </li>
          <li>
            Calculate RER at 20 kg:
            <br />
            <span className="font-mono">
              RER = 70 × 20<sup>0.75</sup> ≈ 70 × 9.5 ≈ 665 kcal/day
            </span>
          </li>
          <li>
            Choose activity factor for a typical pet:{" "}
            <span className="font-mono">1.6 × RER</span>.
            <br />
            <span className="font-mono">
              MER = 665 × 1.6 ≈ 1064 kcal/day
            </span>
          </li>
          <li>
            The dog would need to lose roughly{" "}
            <strong>4 kg (about 17%)</strong>. At a safe rate of 1–2% body
            weight per week, that usually means several months of careful diet
            and monitoring.
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          Your vet might start near <strong>1,050 kcal/day</strong>, then adjust
          every few weeks based on weight trend and body-condition score.
        </p>
      </section>

      {/* INTERPRETING RESULTS ----------------------------------------- */}
      <section
        id="interpreting"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to interpret your dog&apos;s ideal weight results
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The goal is not to chase a single “perfect” number, but to aim for a{" "}
          <strong>healthy range</strong> where your dog has a visible waist,
          easily palpable ribs, and good energy.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-3">
          <li>
            If the <strong>target weight is lower</strong> than current weight,
            your dog likely needs a structured weight-loss plan.
          </li>
          <li>
            If the <strong>target weight is higher</strong>, your dog may be
            too thin, or recovering from illness, and needs weight-gain under
            veterinary supervision.
          </li>
          <li>
            If target and current weights are similar, focus on{" "}
            <strong>maintaining</strong> that weight and body-condition score.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          Always introduce calorie changes gradually, keep treats under{" "}
          <strong>10% of daily calories</strong>, and schedule regular weigh-ins
          so you can adjust the plan before problems develop.
        </p>
      </section>

      {/* FAQ ----------------------------------------------------------- */}
      <section
        id="faq"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Can I use this calculator instead of going to the vet?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              No. This calculator is an{" "}
              <strong>educational planning tool</strong>. It cannot evaluate
              lab work, joint disease, endocrine problems, medications or other
              factors that strongly influence healthy weight. Always involve
              your veterinarian in any weight-loss or weight-gain program.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              How often should I adjust my dog&apos;s calories?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Many vets re-check weight every <strong>2–4 weeks</strong> during
              a diet plan. If weight is changing faster than 2% per week, the
              plan is usually adjusted to protect muscle mass and overall
              health.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Does neuter status or age affect ideal weight?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Yes. Neutered adults and seniors often need fewer calories than
              intact young adults. If your dog was recently neutered or has
              become less active with age, ask your vet how much to adjust
              daily calories.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Can I use this for mixed-breed dogs?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Yes. Choose the <strong>size category</strong> that best matches
              your dog&apos;s height and build. For example, a medium-sized
              mixed breed similar to a Border Collie would typically use the
              “medium” category.
            </p>
          </div>
        </div>
      </section>

      {/* REFERENCES ---------------------------------------------------- */}
      <section
        id="references"
        className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          References & further reading
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://wsava.org/global-guidelines/global-nutrition-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                International recommendations on body-condition scoring, calorie
                calculations and safe weight-change rates for dogs and cats.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.merckvetmanual.com/digestive-system/nutrition/canine-nutrition"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Merck Veterinary Manual – Canine nutrition
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Overview of energy requirements, body-condition scoring and diet
                design for different canine life stages.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NRC – Nutrient Requirements of Dogs and Cats
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Technical reference with equations for energy needs and
                nutrient recommendations in healthy dogs and cats.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // -------------------------------------------------------------------
  // JSON-LD (FAQPage) FOR SEO
  // -------------------------------------------------------------------

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I use this calculator instead of going to the vet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This dog ideal weight calculator is an educational planning tool and does not replace veterinary advice. Always work with your veterinarian before starting a weight-loss or weight-gain program.",
        },
      },
      {
        "@type": "Question",
        name: "How fast should my dog lose or gain weight?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most veterinarians aim for no more than 1–2% of body weight change per week. Faster changes can increase the risk of health problems and nutrient deficiencies.",
        },
      },
      {
        "@type": "Question",
        name: "Does breed size affect ideal weight and calories?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Smaller breeds have lower ideal weights and calorie needs than large and giant breeds. This calculator uses size categories to estimate a healthy range and calorie target.",
        },
      },
    ],
  };

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Estimate your dog's ideal healthy weight range and the daily calories required to maintain it, using veterinary-style formulas based on size, body condition and activity level."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formulas & Factors" },
        { id: "example", label: "Worked Example" },
        { id: "interpreting", label: "Interpreting Your Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        formula:
          "RER = 70 × (ideal weight in kg)^0.75    |    Target MER = RER × activity factor",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement – calories needed each day at rest.",
          },
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement – daily calories to maintain target weight at a given activity level.",
          },
          {
            symbol: "kg",
            description:
              "Ideal body weight in kilograms, estimated from breed size and body condition.",
          },
          {
            symbol: "activity factor",
            description:
              "Multiplier that adjusts for how active your dog is (e.g., 1.2, 1.6, 2.0).",
          },
        ],
        title: "Dog ideal weight calorie equations",
      }}
      example={{
        title: "Example: 24 kg medium breed dog that needs to slim down",
        scenario:
          "A 24 kg medium-size mixed breed dog lives indoors, goes on daily walks, and is clearly overweight.",
        steps: [
          {
            step: 1,
            description: "Estimate ideal range from size category",
            calculation:
              "Medium breed typical ideal weight ≈ 10–25 kg. The calculator centers the target near 20 kg based on body condition.",
          },
          {
            step: 2,
            description: "Calculate RER at target weight",
            calculation:
              "RER = 70 × 20^0.75 ≈ 70 × 9.5 ≈ 665 kcal/day (rounded).",
          },
          {
            step: 3,
            description: "Apply activity factor for a typical pet",
            calculation:
              "Target MER = 665 × 1.6 ≈ 1,064 kcal/day as a starting point.",
          },
        ],
        result:
          "In this example, the dog should gradually move from 24 kg toward ~20 kg while eating roughly 1,050 kcal/day. The vet will monitor progress and adjust the plan every few weeks.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🔥",
        },
        {
          title: "Dog Weight-Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "📉",
        },
        {
          title: "Dog Food Portion Calculator",
          url: "/pets/dog-food-portion-calculator",
          icon: "🍖",
        },
        {
          title: "Dog Daily Water Intake Calculator",
          url: "/pets/dog-water-intake",
          icon: "💧",
        },
      ]}
      jsonLd={faqJsonLd}
    />
  );
}
