import { useMemo, useRef, useState } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Dog,
  Activity,
  Info,
  HeartPulse,
  Scale,
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

type WeightLossInputs = {
  currentWeightKg: string;
  targetWeightKg: string;
  currentCalories: string;
  weeksToGoal: string;
};

type WeightLossResults = {
  idealRer: number;
  weightLossCalories: number;
  calorieReduction: number;
  reductionPercent: number;
  suggestedWeeklyLossKgMin: number;
  suggestedWeeklyLossKgMax: number;
  estimatedWeeklyLossFromDeficitKg: number | null;
  isValid: boolean;
};

function calculateRerKg(weightKg: number): number {
  if (!weightKg || weightKg <= 0) return 0;
  return 70 * Math.pow(weightKg, 0.75);
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export default function DogWeightLossPlannerCalculator() {
  const [inputs, setInputs] = useState<WeightLossInputs>({
    currentWeightKg: "",
    targetWeightKg: "",
    currentCalories: "",
    weeksToGoal: "",
  });

  const [hasCalculated, setHasCalculated] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const parsed = useMemo(() => {
    const currentWeightKg = parseFloat(inputs.currentWeightKg.replace(",", "."));
    const targetWeightKg = parseFloat(inputs.targetWeightKg.replace(",", "."));
    const currentCalories = parseFloat(inputs.currentCalories.replace(",", "."));
    const weeksToGoal = parseFloat(inputs.weeksToGoal.replace(",", "."));

    return {
      currentWeightKg: Number.isFinite(currentWeightKg) ? currentWeightKg : NaN,
      targetWeightKg: Number.isFinite(targetWeightKg) ? targetWeightKg : NaN,
      currentCalories: Number.isFinite(currentCalories) ? currentCalories : NaN,
      weeksToGoal: Number.isFinite(weeksToGoal) ? weeksToGoal : NaN,
    };
  }, [inputs]);

  const results: WeightLossResults = useMemo(() => {
    const { currentWeightKg, targetWeightKg, currentCalories, weeksToGoal } =
      parsed;

    const validWeights =
      currentWeightKg > 0 && targetWeightKg > 0 && targetWeightKg < currentWeightKg;
    const hasCalories = currentCalories > 0;
    const hasWeeks = weeksToGoal > 0;

    if (!validWeights) {
      return {
        idealRer: 0,
        weightLossCalories: 0,
        calorieReduction: 0,
        reductionPercent: 0,
        suggestedWeeklyLossKgMin: 0,
        suggestedWeeklyLossKgMax: 0,
        estimatedWeeklyLossFromDeficitKg: null,
        isValid: false,
      };
    }

    const idealRer = calculateRerKg(targetWeightKg);
    // Typical vet-guided weight loss range ~0.8–1.0 × RER(ideal).
    // We’ll use 0.9 as a mid-point guideline.
    const weightLossCalories = idealRer * 0.9;

    let calorieReduction = 0;
    let reductionPercent = 0;
    if (hasCalories && currentCalories > weightLossCalories) {
      calorieReduction = currentCalories - weightLossCalories;
      reductionPercent = (calorieReduction / currentCalories) * 100;
    }

    // Safe weight loss rate: ~1–2% of current body weight per week
    const suggestedWeeklyLossKgMin = currentWeightKg * 0.01;
    const suggestedWeeklyLossKgMax = currentWeightKg * 0.02;

    let estimatedWeeklyLossFromDeficitKg: number | null = null;
    if (hasCalories && calorieReduction > 0 && hasWeeks) {
      // Very rough estimate: 7,700 kcal ≈ 1 kg body fat (human approximation).
      // For dogs this is only a conceptual guide, not a medical rule.
      const kgPerWeek =
        ((calorieReduction * 7) / 7700) * (currentWeightKg / currentWeightKg || 1);
      estimatedWeeklyLossFromDeficitKg = kgPerWeek;
    }

    return {
      idealRer,
      weightLossCalories,
      calorieReduction,
      reductionPercent,
      suggestedWeeklyLossKgMin,
      suggestedWeeklyLossKgMax,
      estimatedWeeklyLossFromDeficitKg,
      isValid: true,
    };
  }, [parsed]);

  const handleInputChange = (field: keyof WeightLossInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    setHasCalculated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  const handleReset = () => {
    setInputs({
      currentWeightKg: "",
      targetWeightKg: "",
      currentCalories: "",
      weeksToGoal: "",
    });
    setHasCalculated(false);
  };

  const formatNumber = (value: number, decimals = 0): string => {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-800/5 dark:border-slate-100/5 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Dog className="h-5 w-5 text-emerald-500" />
            Dog Weight Loss Planner
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your dog&apos;s current and ideal weight, along with current
            calories, to estimate a safe daily calorie target for a vet-guided
            weight loss plan.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="currentWeightKg">Current weight (kg)</Label>
              <Input
                id="currentWeightKg"
                inputMode="decimal"
                placeholder="e.g. 28"
                value={inputs.currentWeightKg}
                onChange={(e) =>
                  handleInputChange("currentWeightKg", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Use your dog&apos;s actual weight from a recent vet visit or
                home scale.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetWeightKg">Target (ideal) weight (kg)</Label>
              <Input
                id="targetWeightKg"
                inputMode="decimal"
                placeholder="e.g. 22"
                value={inputs.targetWeightKg}
                onChange={(e) =>
                  handleInputChange("targetWeightKg", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Ask your veterinarian what a healthy goal weight is before you
                start.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="currentCalories">
                Current daily calories (optional)
              </Label>
              <Input
                id="currentCalories"
                inputMode="decimal"
                placeholder="e.g. 900"
                value={inputs.currentCalories}
                onChange={(e) =>
                  handleInputChange("currentCalories", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Add all food, treats and extras. This helps estimate the size of
                the calorie reduction.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weeksToGoal">
                Weeks to reach goal (optional)
              </Label>
              <Input
                id="weeksToGoal"
                inputMode="decimal"
                placeholder="e.g. 16"
                value={inputs.weeksToGoal}
                onChange={(e) =>
                  handleInputChange("weeksToGoal", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                The calculator will compare this to typical safe weight loss
                rates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleCalculate}
          className="flex-1 gap-2 font-semibold"
        >
          <Calculator className="h-4 w-4" />
          Calculate plan
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 gap-2"
        >
          Reset
        </Button>
      </div>

      {hasCalculated && results.isValid && (
        <div ref={resultsRef} className="space-y-6">
          <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-50/70 via-teal-50/60 to-sky-50/70 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                Recommended daily calories for weight loss
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                This is a guideline based on your dog&apos;s{" "}
                <span className="font-semibold">target (ideal) weight</span>.
                Always confirm with your veterinarian before changing diet.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-baseline gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Daily calories for weight loss
                  </p>
                  <p className="text-3xl font-semibold">
                    {formatNumber(results.weightLossCalories, 0)}{" "}
                    <span className="text-base font-normal text-muted-foreground">
                      kcal/day
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>
                    Ideal RER (target weight):{" "}
                    <span className="font-medium">
                      {formatNumber(results.idealRer, 0)} kcal/day
                    </span>
                  </span>
                  <span>
                    Weight loss factor used:{" "}
                    <span className="font-medium">0.9 × RER(ideal)</span>
                  </span>
                </div>
              </div>

              {parsed.currentCalories > 0 && results.calorieReduction > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <Activity className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                        Suggested calorie reduction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p>
                        From{" "}
                        <span className="font-semibold">
                          {formatNumber(parsed.currentCalories, 0)} kcal
                        </span>{" "}
                        down to{" "}
                        <span className="font-semibold">
                          {formatNumber(results.weightLossCalories, 0)} kcal
                        </span>{" "}
                        per day.
                      </p>
                      <p>
                        That&apos;s a reduction of{" "}
                        <span className="font-semibold">
                          {formatNumber(results.calorieReduction, 0)} kcal
                        </span>{" "}
                        (
                        <span className="font-semibold">
                          {formatNumber(results.reductionPercent, 1)}%
                        </span>
                        ).
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-sky-200 bg-sky-50/60 dark:border-sky-900/50 dark:bg-sky-950/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <Scale className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                        Safe weekly weight loss range
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p>
                        Typical vet-guided weight loss for dogs is around{" "}
                        <span className="font-semibold">1–2% body weight</span>{" "}
                        per week.
                      </p>
                      <p>
                        For your dog, that&apos;s approximately{" "}
                        <span className="font-semibold">
                          {formatNumber(results.suggestedWeeklyLossKgMin, 2)}–
                          {formatNumber(results.suggestedWeeklyLossKgMax, 2)} kg
                          per week
                        </span>
                        .
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-800/5 dark:border-slate-100/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Info className="h-4 w-4 text-indigo-500" />
                Summary of your dog&apos;s weight loss plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Parameter</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Current weight</TableCell>
                    <TableCell>
                      {Number.isFinite(parsed.currentWeightKg)
                        ? `${formatNumber(parsed.currentWeightKg, 1)} kg`
                        : "—"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Target (ideal) weight</TableCell>
                    <TableCell>
                      {Number.isFinite(parsed.targetWeightKg)
                        ? `${formatNumber(parsed.targetWeightKg, 1)} kg`
                        : "—"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Daily calories for weight loss</TableCell>
                    <TableCell>
                      {formatNumber(results.weightLossCalories, 0)} kcal/day
                    </TableCell>
                  </TableRow>
                  {parsed.currentCalories > 0 && (
                    <TableRow>
                      <TableCell>Current daily calories</TableCell>
                      <TableCell>
                        {formatNumber(parsed.currentCalories, 0)} kcal/day
                      </TableCell>
                    </TableRow>
                  )}
                  {parsed.currentCalories > 0 && results.calorieReduction > 0 && (
                    <TableRow>
                      <TableCell>Required calorie reduction</TableCell>
                      <TableCell>
                        {formatNumber(results.calorieReduction, 0)} kcal/day (
                        {formatNumber(results.reductionPercent, 1)}%)
                      </TableCell>
                    </TableRow>
                  )}
                  {parsed.weeksToGoal > 0 && (
                    <TableRow>
                      <TableCell>Planned duration</TableCell>
                      <TableCell>
                        {formatNumber(parsed.weeksToGoal, 0)} weeks
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <p className="text-xs text-muted-foreground">
                This planner is an educational tool and does not replace a
                tailored weight loss program created by your veterinarian. Rapid
                or unsupervised weight loss can be dangerous, especially for
                small breeds or dogs with medical conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="introduction" className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Why a structured dog weight loss plan matters
        </h2>
        <p>
          Extra body fat is one of the most common health problems in pet dogs.
          Even a few extra kilograms can put strain on joints, increase the
          risk of diabetes and arthritis, and shorten your dog&apos;s healthy
          lifespan. At the same time, simply “feeding less” without a plan can
          leave your dog hungry, undernourished or losing weight too quickly.
        </p>
        <p>
          The Dog Weight Loss Planner on Smart Kit Now helps you turn vague
          goals like “my dog should lose some weight” into clear,
          numbers-based guidelines you can discuss with your veterinarian. By
          combining your dog&apos;s{" "}
          <strong>current weight, ideal weight and daily calories</strong>, the
          calculator estimates a daily calorie target that aligns with
          commonly-used veterinary weight loss formulas.
        </p>
        <p>
          This doesn&apos;t replace a full veterinary exam or a prescription
          weight loss diet, but it gives you a concrete starting point and a
          way to track progress week by week.
        </p>
      </section>

      <section id="how-to-use" className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How to use the Dog Weight Loss Planner
        </h2>
        <p>
          Before you change your dog&apos;s food, try to gather three key
          pieces of information so the planner can give the most realistic
          recommendations.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Current weight:</strong> Use a recent weight from your vet
            or weigh your dog at home. For home weighing, you can step on a
            scale with and without your dog and subtract the values.
          </li>
          <li>
            <strong>Target (ideal) weight:</strong> Ask your veterinarian what
            a healthy weight range is for your dog&apos;s breed, size and body
            condition score. Enter a specific target inside that range, such as
            22 kg.
          </li>
          <li>
            <strong>Current calories:</strong> Add up the calories from your
            dog&apos;s main food, any toppers, table scraps and treats over a
            typical day. Pet food labels, manufacturer websites and treat
            packaging are useful for this step.
          </li>
        </ol>
        <p>
          Once you enter the values and click{" "}
          <strong>&quot;Calculate plan&quot;</strong>, the calculator estimates
          a safe daily calorie target for weight loss based on your dog&apos;s
          ideal weight. If you also enter the number of weeks you have in mind,
          you&apos;ll see how that timeline compares to common veterinary
          guidelines for safe weight loss rates.
        </p>
      </section>

      <section id="safety" className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Safe weight loss rates and why supervision matters
        </h2>
        <p>
          Most veterinarians aim for dogs to lose around{" "}
          <strong>1–2% of their current body weight per week</strong>. This
          pace is usually slow enough to protect lean muscle mass while still
          making steady progress. For a 28 kg dog, that&apos;s roughly
          0.28–0.56 kg per week.
        </p>
        <p>
          Faster weight loss may look impressive on the scale but can increase
          the risk of muscle loss, nutrient deficiencies and rebound weight
          gain. In some species, like cats, rapid weight loss can even trigger
          life-threatening liver disease. This is why any weight loss program
          for your dog should be overseen by a veterinarian, especially if your
          dog has arthritis, heart disease, endocrine disorders or is a senior.
        </p>
        <p>
          Use the suggested calorie target and weekly loss range from this
          planner as a conversation starter. Your vet may adjust the numbers,
          recommend a specific therapeutic diet, or propose recheck visits
          every 4–6 weeks to monitor weight and body condition score.
        </p>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">
              How accurate is this dog weight loss calculator?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The equations behind this calculator are based on widely used
              veterinary energy requirement formulas. However, every dog has
              their own metabolism, activity level and health background. Some
              dogs lose weight easily on textbook calorie targets, while others
              need more fine-tuning. Treat the results as a{" "}
              <strong>starting estimate</strong>, then adjust together with
              your veterinarian based on real weight changes over time.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Do I need to switch to a special weight loss food?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Many overweight dogs benefit from a dedicated weight management
              diet. These formulas are designed to be{" "}
              <strong>lower in calories but still complete and balanced</strong>
              , often with higher protein and fiber to help maintain muscle and
              keep dogs feeling full. Your vet can recommend an appropriate
              diet based on your dog&apos;s medical history and budget. If you
              keep using the current food, it&apos;s especially important to
              confirm the calorie content and avoid over-restricting.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              What about treats during a weight loss program?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Treats are perfectly compatible with a healthy weight loss plan—
              as long as they are included in the total daily calories. Try to
              keep treats to <strong>no more than 10% of daily calories</strong>{" "}
              and choose lower-calorie options like crunchy vegetables or
              specially formulated light treats. Avoid high-calorie extras like
              cheese, fatty meats or large biscuits that can undo progress in a
              few bites.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              How often should I weigh my dog while they are dieting?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Weekly weighing works well for most dogs. Too frequent weighing
              can be misleading due to normal day-to-day fluctuations in water
              and gut contents. Record each weight in a notebook or app and
              review the trend over 3–4 weeks. If weight isn&apos;t moving in
              the desired direction, your vet may adjust calories, activity or
              both.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              What if my dog seems hungry all the time on the diet?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Persistent hunger is a common concern. First, confirm with your
              vet that the calorie target and food choice are appropriate.
              Strategies such as splitting the daily calories into more meals,
              using higher-fiber diets, or adding low-calorie vegetables can
              help dogs feel more satisfied. Avoid increasing calories on your
              own without adjusting the plan with your vet, or weight loss may
              stall.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="space-y-4">
        <h2 className="text-2xl font-semibold">
          References &amp; additional resources
        </h2>
        <p className="text-sm text-muted-foreground">
          These resources provide deeper background on canine nutrition,
          obesity management and energy requirement formulas used by
          veterinarians worldwide.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="https://wsava.org/global-guidelines/global-nutrition-guidelines/"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-slate-200 bg-card p-3 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-slate-700 dark:hover:border-emerald-400"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                  WSAVA Global Nutrition Committee – Energy & feeding
                  guidelines
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  International recommendations widely used to estimate energy
                  requirements, body condition scoring and safe weight loss
                  strategies in dogs and cats.
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://www.merckvetmanual.com"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-slate-200 bg-card p-3 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-slate-700 dark:hover:border-emerald-400"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-sky-500/10 p-2 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold group-hover:text-sky-600 dark:group-hover:text-sky-300">
                  Veterinary clinical nutrition & obesity chapters
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Textbook-style summaries covering energy equations, obesity
                  risk factors and treatment plans for overweight dogs.
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://petnutritionalliance.org"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-slate-200 bg-card p-3 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-slate-700 dark:hover:border-emerald-400"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-indigo-500/10 p-2 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                  Pet Nutrition Alliance – Obesity & weight management tools
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Educational tools and guidelines that help veterinarians and
                  pet owners design safe, effective weight loss programs for
                  companion animals.
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://www.avma.org/resources/pet-owners/petcare/obesity-your-pet"
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-slate-200 bg-card p-3 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-slate-700 dark:hover:border-emerald-400"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-rose-500/10 p-2 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold group-hover:text-rose-600 dark:group-hover:text-rose-300">
                  Your primary care veterinarian
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No online calculator can fully replace a hands-on exam. Bring
                  your dog&apos;s weight loss plan and calorie targets to your
                  vet visit for personalized review.
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner"
      description="Estimate a safe daily calorie target and weekly weight loss pace for your dog based on veterinary-style energy equations. Use this as a starting point for a supervised weight loss plan with your veterinarian."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Why weight loss planning matters" },
        { id: "how-to-use", label: "How to use this planner" },
        { id: "safety", label: "Safe weight loss rates" },
        { id: "faq", label: "Frequently asked questions" },
        { id: "references", label: "References & resources" },
      ]}
      formula={{
        title: "Weight loss calorie formula (educational)",
        formula: "Weight loss calories ≈ 0.9 × RER(ideal weight)",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement, calculated as 70 × (body weight in kg^0.75)",
          },
          {
            symbol: "Ideal weight",
            description:
              "Target healthy body weight for your dog, as determined with your veterinarian",
          },
          {
            symbol: "0.9",
            description:
              "Example factor within the typical veterinary weight loss range (~0.8–1.0 × RER)",
          },
        ],
      }}
      example={{
        title: "Example calculation",
        scenario:
          "You have a 28 kg adult dog that your veterinarian says should ideally weigh 22 kg. Your dog currently eats about 900 kcal per day.",
        steps: [
          {
            label: "Step 1",
            calculation: "RER(ideal) = 70 × 22^0.75 ≈ 727 kcal/day",
            explanation:
              "First calculate your dog's resting energy requirement at the target weight using the standard RER formula.",
          },
          {
            label: "Step 2",
            calculation: "Weight loss calories ≈ 0.9 × 727 ≈ 654 kcal/day",
            explanation:
              "Multiply the ideal RER by 0.9 as a starting point within the common weight loss range.",
          },
          {
            label: "Step 3",
            calculation: "Calorie reduction = 900 – 654 ≈ 246 kcal/day",
            explanation:
              "Compare the target calories to your dog's current intake to estimate the daily reduction required.",
          },
        ],
        result:
          "In this example, your veterinarian might recommend feeding around 650 kcal per day using a complete weight management diet, then monitoring your dog's weight and body condition every 4–6 weeks and adjusting as needed.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER)",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Healthy Weight Range Estimator",
          url: "/pets/dog-healthy-weight-range",
          icon: "⚖️",
        },
        {
          title: "Dog Daily Feeding Portion Calculator",
          url: "/pets/dog-feeding-portion",
          icon: "🍖",
        },
      ]}
    />
  );
}
