import { useMemo, useRef, useState } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Calculator,
  Dog,
  HeartPulse,
  Info,
  Scale,
  BookOpen,
} from "lucide-react";

type UnitSystem = "metric" | "imperial";

type FormState = {
  currentWeight: string; // kg or lb based on unitSystem
  bodyConditionScore: string; // 1–9
  idealWeight: string; // optional override
  unitSystem: UnitSystem;
  activityLevel: "low" | "moderate" | "high";
};

function parseNumber(value: string): number | null {
  const n = Number(String(value).replace(",", ".").trim());
  if (!Number.isFinite(n) || Number.isNaN(n)) return null;
  return n;
}

function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Estimate ideal weight from current weight and BCS (1–9 scale).
 * Very rough heuristic: each point above 5 ≈ 10% excess weight.
 */
function estimateIdealWeightKg(currentWeightKg: number, bcs: number | null): number {
  if (!bcs || bcs < 5.5) {
    // At or below ideal – just use current weight as ideal baseline
    return currentWeightKg;
  }
  const pointsAboveIdeal = bcs - 5;
  const excessFraction = 0.1 * pointsAboveIdeal; // 10% per point
  const ideal = currentWeightKg / (1 + excessFraction);
  return ideal > 0 ? ideal : currentWeightKg;
}

function calcRER(kg: number): number {
  if (!kg || kg <= 0) return 0;
  return 70 * Math.pow(kg, 0.75);
}

function getActivityFactor(
  activityLevel: FormState["activityLevel"],
  isWeightLoss: boolean
): number {
  if (isWeightLoss) {
    // WSAVA-style conservative weight-loss multipliers
    switch (activityLevel) {
      case "high":
        return 1.0;
      case "moderate":
        return 0.9;
      case "low":
      default:
        return 0.8;
    }
  }

  // Maintenance MER factors
  switch (activityLevel) {
    case "high":
      return 1.8;
    case "moderate":
      return 1.6;
    case "low":
    default:
      return 1.4;
  }
}

function convertToKg(value: number, unitSystem: UnitSystem): number {
  if (unitSystem === "imperial") {
    // lb → kg
    return value / 2.20462;
  }
  return value;
}

function convertFromKg(kg: number, unitSystem: UnitSystem): number {
  if (unitSystem === "imperial") {
    // kg → lb
    return kg * 2.20462;
  }
  return kg;
}

function getSafeWeeklyLossRange(kg: number): { minKg: number; maxKg: number } {
  // 1–2% of CURRENT body weight per week
  const minKg = kg * 0.01;
  const maxKg = kg * 0.02;
  return { minKg, maxKg };
}

export default function DogIdealWeightTargetCaloriesCalculator() {
  const [form, setForm] = useState<FormState>({
    currentWeight: "",
    bodyConditionScore: "",
    idealWeight: "",
    unitSystem: "metric",
    activityLevel: "moderate",
  });

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const parsed = useMemo(() => {
    const currentWeightRaw = parseNumber(form.currentWeight) ?? 0;
    const bcsRaw = parseNumber(form.bodyConditionScore);
    const idealWeightRaw = parseNumber(form.idealWeight);

    const currentWeightKg = convertToKg(currentWeightRaw, form.unitSystem);

    let idealWeightKg = idealWeightRaw
      ? convertToKg(idealWeightRaw, form.unitSystem)
      : estimateIdealWeightKg(currentWeightKg, bcsRaw ?? null);

    if (!Number.isFinite(idealWeightKg) || idealWeightKg <= 0) {
      idealWeightKg = 0;
    }

    const rerAtIdeal = calcRER(idealWeightKg);
    const maintenanceFactor = getActivityFactor(form.activityLevel, false);
    const weightLossFactor = getActivityFactor(form.activityLevel, true);

    const maintenanceCalories = rerAtIdeal * maintenanceFactor;
    const weightLossCalories = rerAtIdeal * weightLossFactor;

    const { minKg, maxKg } = getSafeWeeklyLossRange(currentWeightKg);
    const totalLossNeededKg =
      currentWeightKg > idealWeightKg && idealWeightKg > 0
        ? currentWeightKg - idealWeightKg
        : 0;

    const weeksAtMinRate = minKg > 0 ? totalLossNeededKg / minKg : 0;
    const weeksAtMaxRate = maxKg > 0 ? totalLossNeededKg / maxKg : 0;

    return {
      currentWeightKg,
      idealWeightKg,
      rerAtIdeal,
      maintenanceCalories,
      weightLossCalories,
      totalLossNeededKg,
      minWeeklyLossKg: minKg,
      maxWeeklyLossKg: maxKg,
      weeksAtMinRate,
      weeksAtMaxRate,
    };
  }, [form]);

  const hasValidInputs =
    parsed.currentWeightKg > 0 &&
    parsed.idealWeightKg > 0 &&
    parsed.rerAtIdeal > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (hasValidInputs && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleReset = () => {
    setForm({
      currentWeight: "",
      bodyConditionScore: "",
      idealWeight: "",
      unitSystem: "metric",
      activityLevel: "moderate",
    });
    setHasSubmitted(false);
  };

  const unitLabel =
    form.unitSystem === "metric" ? "kg (kilograms)" : "lb (pounds)";

  const currentWeightDisplay = parsed.currentWeightKg
    ? round(convertFromKg(parsed.currentWeightKg, form.unitSystem), 1)
    : null;

  const idealWeightDisplay = parsed.idealWeightKg
    ? round(convertFromKg(parsed.idealWeightKg, form.unitSystem), 1)
    : null;

  const maintenanceCaloriesDisplay = parsed.maintenanceCalories
    ? round(parsed.maintenanceCalories, 0)
    : null;

  const weightLossCaloriesDisplay = parsed.weightLossCalories
    ? round(parsed.weightLossCalories, 0)
    : null;

  const totalLossNeededDisplay = parsed.totalLossNeededKg
    ? round(convertFromKg(parsed.totalLossNeededKg, form.unitSystem), 1)
    : null;

  const weeklyLossRangeDisplay =
    parsed.minWeeklyLossKg > 0 && parsed.maxWeeklyLossKg > 0
      ? {
          min: round(
            convertFromKg(parsed.minWeeklyLossKg, form.unitSystem),
            2
          ),
          max: round(
            convertFromKg(parsed.maxWeeklyLossKg, form.unitSystem),
            2
          ),
        }
      : null;

  const durationDisplay =
    parsed.weeksAtMinRate > 0 && parsed.weeksAtMaxRate > 0
      ? {
          minWeeks: Math.ceil(parsed.weeksAtMaxRate),
          maxWeeks: Math.ceil(parsed.weeksAtMinRate),
        }
      : null;

  const showResults = hasSubmitted && hasValidInputs;

  const mainWidget = (
    <Card id="calculator">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 p-3">
            <Dog className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Estimate your dog&apos;s ideal weight and target calories
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your dog&apos;s current weight and body condition score
              (BCS). The calculator estimates an ideal weight, then computes
              daily calories for safe weight loss and long-term maintenance.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unitSystem">Unit system</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={form.unitSystem === "metric" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      unitSystem: "metric",
                    }))
                  }
                >
                  Metric (kg)
                </Button>
                <Button
                  type="button"
                  variant={form.unitSystem === "imperial" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      unitSystem: "imperial",
                    }))
                  }
                >
                  Imperial (lb)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity level</Label>
              <select
                id="activityLevel"
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={form.activityLevel}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    activityLevel: event.target.value as FormState["activityLevel"],
                  }))
                }
              >
                <option value="low">Low (mostly indoors / calm)</option>
                <option value="moderate">
                  Moderate (daily walks, normal play)
                </option>
                <option value="high">
                  High (working dog / very active lifestyle)
                </option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The activity level fine-tunes both weight-loss and maintenance
                calorie estimates.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="currentWeight">
                Current weight ({unitLabel})
              </Label>
              <Input
                id="currentWeight"
                inputMode="decimal"
                autoComplete="off"
                value={form.currentWeight}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    currentWeight: event.target.value,
                  }))
                }
                placeholder={form.unitSystem === "metric" ? "e.g. 18.5" : "e.g. 40"}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use a recent, accurate weight from your veterinarian or home
                scale.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyConditionScore">
                Body Condition Score (1–9)
              </Label>
              <Input
                id="bodyConditionScore"
                inputMode="decimal"
                autoComplete="off"
                value={form.bodyConditionScore}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    bodyConditionScore: event.target.value,
                  }))
                }
                placeholder="e.g. 7"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1–3 = too thin, 4–5 = ideal, 6–9 = overweight. If unsure, ask
                your vet to show you how to score your dog&apos;s body
                condition.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idealWeight">
                Ideal weight ({unitLabel}, optional)
              </Label>
              <Input
                id="idealWeight"
                inputMode="decimal"
                autoComplete="off"
                value={form.idealWeight}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    idealWeight: event.target.value,
                  }))
                }
                placeholder="Leave blank to estimate"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                If your veterinarian has already given you a target weight, you
                can enter it here. Otherwise, the calculator will estimate one
                from BCS.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculate target calories
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset form
            </Button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This tool is for educational use only and does not replace a
              personalized nutrition plan from your veterinarian.
            </p>
          </div>
        </form>

        {hasSubmitted && !hasValidInputs && (
          <Alert variant="destructive">
            <AlertTitle>Check the form fields</AlertTitle>
            <AlertDescription>
              Enter your dog&apos;s current weight and either a body condition
              score, an ideal weight, or both. All values must be greater than
              zero.
            </AlertDescription>
          </Alert>
        )}

        {showResults && (
          <div ref={resultsRef} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/40 dark:bg-emerald-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/80 dark:bg-emerald-900/60 p-2 shadow-sm">
                      <Scale className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
                    </div>
                    <CardTitle className="text-base">
                      Estimated ideal body weight
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-100">
                    {idealWeightDisplay}{" "}
                    <span className="text-base font-normal">
                      {form.unitSystem === "metric" ? "kg" : "lb"}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Based on the body condition score you entered, this is a
                    reasonable target weight to aim for over time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/60 dark:border-blue-500/40 dark:bg-blue-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/80 dark:bg-blue-900/60 p-2 shadow-sm">
                      <HeartPulse className="h-5 w-5 text-blue-700 dark:text-blue-200" />
                    </div>
                    <CardTitle className="text-base">
                      Daily calories for weight loss
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-2xl font-semibold text-blue-800 dark:text-blue-100">
                    {weightLossCaloriesDisplay}{" "}
                    <span className="text-base font-normal">kcal/day</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    This is the estimated calorie target for a gradual, safe
                    weight loss plan, adjusted for your dog&apos;s activity
                    level.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-500/40 dark:bg-indigo-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/80 dark:bg-indigo-900/60 p-2 shadow-sm">
                      <Activity className="h-5 w-5 text-indigo-700 dark:text-indigo-200" />
                    </div>
                    <CardTitle className="text-base">
                      Calories after reaching goal
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-2xl font-semibold text-indigo-800 dark:text-indigo-100">
                    {maintenanceCaloriesDisplay}{" "}
                    <span className="text-base font-normal">kcal/day</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    When your dog reaches ideal weight, this is a typical
                    maintenance calorie range for the same activity level.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-900/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/80 dark:bg-slate-900/60 p-2 shadow-sm">
                    <Info className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Weight-loss timeline and safe weekly rate
                    </CardTitle>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Slow, steady progress is much safer than rapid dieting,
                      especially for dogs with underlying health conditions.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Measure</TableHead>
                      <TableHead>Estimate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Current body weight</TableCell>
                      <TableCell>
                        {currentWeightDisplay}{" "}
                        {form.unitSystem === "metric" ? "kg" : "lb"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ideal body weight</TableCell>
                      <TableCell>
                        {idealWeightDisplay}{" "}
                        {form.unitSystem === "metric" ? "kg" : "lb"}
                      </TableCell>
                    </TableRow>
                    {totalLossNeededDisplay !== null && (
                      <TableRow>
                        <TableCell>
                          Total weight to lose to reach goal
                        </TableCell>
                        <TableCell>
                          {totalLossNeededDisplay}{" "}
                          {form.unitSystem === "metric" ? "kg" : "lb"}
                        </TableCell>
                      </TableRow>
                    )}
                    {weeklyLossRangeDisplay && (
                      <TableRow>
                        <TableCell>Safe weekly loss range</TableCell>
                        <TableCell>
                          {weeklyLossRangeDisplay.min}–
                          {weeklyLossRangeDisplay.max}{" "}
                          {form.unitSystem === "metric" ? "kg/week" : "lb/week"}
                        </TableCell>
                      </TableRow>
                    )}
                    {durationDisplay && totalLossNeededDisplay !== null && (
                      <TableRow>
                        <TableCell>
                          Approximate time to reach ideal weight
                        </TableCell>
                        <TableCell>
                          Around {durationDisplay.minWeeks}–
                          {durationDisplay.maxWeeks} weeks (using the 1–2% 
                          per-week guideline).
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  These are estimates only. Dogs with arthritis, endocrine
                  disease, senior pets, or brachycephalic breeds (short-nosed)
                  may need even slower weight loss and closer veterinary
                  monitoring.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const formula = {
    formula:
      "RER (kcal/day) = 70 × (ideal body weight in kg)^0.75; MER = RER × activity factor",
    variables: [
      {
        symbol: "RER",
        label: "Resting Energy Requirement",
        description:
          "The energy required for basic body functions at rest in a thermoneutral environment.",
      },
      {
        symbol: "MER",
        label: "Maintenance Energy Requirement",
        description:
          "Calories needed to maintain an adult dog at stable weight for a given activity level.",
      },
      {
        symbol: "BCS",
        label: "Body Condition Score",
        description:
          "A 1–9 scoring system veterinarians use to assess whether a dog is too thin, ideal, or overweight.",
      },
    ],
  } as const;

  const example = {
    title: "Example: Overweight 30 kg dog with BCS 7",
    scenario:
      "Bella is a 30 kg adult Labrador with a body condition score (BCS) of 7/9 and a moderately active lifestyle.",
    steps: [
      {
        label: "1. Estimate ideal weight from BCS",
        description:
          "BCS 7/9 suggests roughly 20–25% excess weight. Using a 20% estimate: ideal weight ≈ 30 kg ÷ 1.2 ≈ 25 kg.",
      },
      {
        label: "2. Calculate RER at ideal weight",
        description:
          "RER = 70 × (25^0.75) ≈ 70 × 11.8 ≈ 826 kcal/day (rounded).",
      },
      {
        label: "3. Estimate weight-loss calories",
        description:
          "For weight loss, use about 0.8 × RER for a moderately active dog. 0.8 × 826 ≈ 661 kcal/day.",
      },
      {
        label: "4. Estimate maintenance calories after goal",
        description:
          "For long-term maintenance at ideal weight with moderate activity, MER ≈ 1.6 × RER. 1.6 × 826 ≈ 1,322 kcal/day.",
      },
      {
        label: "5. Estimate timeline",
        description:
          "Total loss needed ≈ 5 kg. Safe weekly loss (1–2%) at 30 kg is 0.3–0.6 kg/week. It may take roughly 8–16 weeks to reach 25 kg.",
      },
    ],
    result:
      "Bella might start around 660 kcal/day for weight loss, then transition toward ~1,320 kcal/day once she reaches 25 kg, with regular veterinary check-ins throughout the process.",
  } as const;

  const onThisPage = [
    { id: "overview", label: "Overview" },
    { id: "calculator", label: "Ideal weight & calories calculator" },
    { id: "how-it-works", label: "How the calculations work" },
    { id: "using-results", label: "Using your results safely" },
    { id: "faq", label: "FAQs" },
    { id: "references", label: "References & resources" },
  ] as const;

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER)",
      url: "/pets/dog-calorie-needs-rer-mer",
      icon: "🐶🔥",
    },
    {
      title: "Dog Weight Loss Planner",
      url: "/pets/dog-weight-loss-planner",
      icon: "📉🍖",
    },
    {
      title: "Loan Payment Calculator",
      url: "/financial/loan-payment",
      icon: "💳📊",
    },
  ] as const;

  const editorial = (
    <div className="space-y-10">
      <section id="overview" className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Why ideal weight and target calories matter for dogs
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Extra body fat does more than change how your dog looks &mdash; it
          quietly increases the risk of arthritis, diabetes, breathing
          problems, reduced stamina, and a shorter lifespan. Many studies show
          that dogs kept at a lean body condition live longer and enjoy a
          better quality of life than their overweight littermates.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          This calculator helps you connect three key pieces of information:
          your dog&apos;s current weight, their body condition score (BCS), and
          a realistic target weight. From there it estimates daily calories for
          safe weight loss and for long-term maintenance once your dog reaches
          that goal.
        </p>
        <Alert variant="default" className="mt-2">
          <AlertTitle className="flex items-center gap-2">
            <Info className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            Educational tool &mdash; not a diagnosis
          </AlertTitle>
          <AlertDescription className="text-xs text-slate-700 dark:text-slate-200">
            Every dog is different. This calculator uses widely accepted
            veterinary formulas, but it cannot see muscle mass, underlying
            disease, or breed-specific risks. Always share your plan with your
            primary veterinarian before making major changes to your dog&apos;s
            diet.
          </AlertDescription>
        </Alert>
      </section>

      <section id="how-it-works" className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          How the dog ideal weight & calorie equations work
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Veterinary nutrition guidelines usually break the problem into two
          steps: first estimate a reasonable <strong>ideal body weight</strong>,
          then calculate the <strong>Resting Energy Requirement (RER)</strong>{" "}
          and <strong>Maintenance Energy Requirement (MER)</strong> based on
          that ideal weight.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
          <li>
            <strong>RER</strong> is the energy needed for basic functions like
            breathing, circulation, and cell repair in a resting, neutral
            environment.
          </li>
          <li>
            <strong>MER</strong> scales RER by an{" "}
            <em>activity or lifestyle factor</em> so that playful pets and
            working dogs receive more calories than couch potatoes.
          </li>
          <li>
            For <strong>weight loss</strong>, many veterinarians start with a
            conservative fraction of MER at the dog&apos;s ideal weight rather
            than cutting calories from the current overweight weight.
          </li>
        </ul>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          To estimate ideal weight from BCS, the calculator uses a simple
          rule-of-thumb: each point above 5/9 corresponds to roughly 10% excess
          body weight. That isn&apos;t perfect for every dog, but it gives a
          practical starting point you can refine with your veterinarian.
        </p>
      </section>

      <section id="using-results" className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          How to use your dog&apos;s target calorie results
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Once you have a target calorie range, the next step is translating
          numbers into a feeding plan that fits your household. Here are
          practical ways to apply the results:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
          <li>
            <strong>Check your dog&apos;s food label.</strong> Look for kcal
            per cup, can, or gram on the packaging or manufacturer website.
            Divide the target calories by that number to find daily portions.
          </li>
          <li>
            <strong>Measure everything.</strong> Use a proper measuring cup or
            kitchen scale rather than guessing. Small errors add up over weeks
            and months.
          </li>
          <li>
            <strong>Count treats into the total.</strong> Treats should
            typically make up no more than 10% of daily calories. Use part of
            your dog&apos;s regular food as rewards where possible.
          </li>
          <li>
            <strong>Re-check weight regularly.</strong> Weigh your dog every 2–4
            weeks. If weight loss is faster than 2% per week, call your vet. If
            nothing changes after a month, your vet may advise a small calorie
            adjustment.
          </li>
        </ul>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          Never starve or crash-diet a dog. Severe calorie restriction can
          trigger muscle loss, nutrient deficiencies, and in extreme cases
          liver disease. The goal is a slow, comfortable glide toward a lean
          body shape, not the fastest possible number on the scale.
        </p>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Frequently asked questions about canine weight management
        </h2>

        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <div>
            <h3 className="font-semibold">
              How accurate is this dog ideal weight calculator?
            </h3>
            <p>
              Any calculator on the internet is an approximation. The formulas
              here are based on widely used veterinary nutrition guidelines,
              but they cannot see breed, body shape, or health problems.
              Consider your results a conversation starter for your next vet
              visit, not a strict prescription.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Do puppies and senior dogs use the same formulas?
            </h3>
            <p>
              No. Growing puppies, pregnant or nursing females, and some senior
              dogs have very different energy needs. This calculator is aimed at{" "}
              <strong>adult dogs</strong> who are finished growing. Ask your
              veterinarian for puppy-specific or medical nutrition advice.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              My dog has arthritis or another chronic disease. Is weight loss
              still safe?
            </h3>
            <p>
              In many cases, gradual weight loss actually <em>helps</em> reduce
              pain and strain on joints, but underlying conditions (like
              diabetes, Cushing&apos;s disease, or heart disease) can change
              the ideal pace and calorie target. Dogs with medical issues
              should always lose weight under close veterinary supervision.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              What if my dog seems hungry all the time on the diet?
            </h3>
            <p>
              Talk to your vet before increasing calories. Sometimes adding
              low-calorie volume (such as certain vegetables or higher fiber
              diets) can help dogs feel fuller without undoing progress. In
              other cases, the plan may need a small, supervised calorie
              adjustment.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          References &amp; additional resources
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-200">
          These resources describe the underlying formulas and practical
          guidance veterinarians use when designing weight-management plans for
          dogs.
        </p>

        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 text-sky-600 dark:text-sky-300" />
            <div>
              <a
                href="https://wsava.org/global-guidelines/global-nutrition-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                WSAVA Global Nutrition Committee &mdash; Global Nutrition
                Guidelines
              </a>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                International guidelines that outline how veterinarians assess
                body condition, estimate calorie needs, and build individualized
                nutrition plans for dogs and cats.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 text-sky-600 dark:text-sky-300" />
            <div>
              <a
                href="https://www.acvn.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                American College of Veterinary Nutrition (ACVN)
              </a>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Professional organization focused on clinical nutrition. Their
                resources and diplomate directories can help you find a
                specialist for complex weight-management cases.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 text-sky-600 dark:text-sky-300" />
            <div>
              <a
                href="https://www.avma.org/resources-tools/pet-owners/petcare/your-dog-healthy-weight"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                American Veterinary Medical Association &mdash; Your Dog&apos;s
                Healthy Weight
              </a>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Pet-owner friendly overview of body condition scoring, healthy
                weight goals, and why preventing obesity is one of the most
                important gifts you can give your dog.
              </p>
            </div>
          </li>
        </ul>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          SmartKitNow calculators are designed for educational purposes and do
          not replace a full physical exam, diagnostics, or personalized
          advice from your veterinarian. Always consult your vet before
          starting, changing, or stopping any weight-loss program or
          therapeutic diet.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Estimate your dog&apos;s ideal body weight from body condition score (BCS) and calculate daily calories for safe weight loss and long-term maintenance."
      category="Pets"
      icon={<Dog className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      widget={mainWidget}
      editorial={editorial}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
