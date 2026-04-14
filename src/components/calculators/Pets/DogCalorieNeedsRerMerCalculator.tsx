import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  Dog,
  Activity,
  Info,
  HeartPulse,
  Scale,
  BookOpen,
} from "lucide-react";


// ---------------------------------------------------------------------
// CONSTANTES DE FATORES (sempre arrays bem definidos → evita erro .map)
// ---------------------------------------------------------------------

const ACTIVITY_LEVELS = [
  {
    id: "inactive",
    label: "Mostly inactive / indoor",
    factor: 1.2,
    description: "Older dogs, couch potatoes, or dogs with very low activity.",
  },
  {
    id: "neutered-adult",
    label: "Neutered adult (typical pet)",
    factor: 1.6,
    description: "Most healthy adult dogs that go on daily walks and play.",
  },
  {
    id: "intact-adult",
    label: "Intact adult",
    factor: 1.8,
    description: "Unneutered adults tend to have a slightly higher metabolism.",
  },
  {
    id: "active",
    label: "Very active / working",
    factor: 2.0,
    description:
      "Dogs that hike, run, herd livestock, or have frequent vigorous exercise.",
  },
  {
    id: "weight-loss",
    label: "Weight loss program",
    factor: 1.0,
    description:
      "Used under veterinary supervision to slowly reduce body weight.",
  },
];

const LIFE_STAGE_MODIFIERS = [
  {
    id: "adult",
    label: "Adult (1–7 years)",
    range: "1.2–1.8 × RER",
    note: "Most healthy household dogs.",
  },
  {
    id: "senior",
    label: "Senior (7+ years)",
    range: "1.1–1.4 × RER",
    note: "Many seniors need slightly fewer calories.",
  },
  {
    id: "puppy-0-4",
    label: "Puppy 0–4 months",
    range: "3.0 × RER",
    note: "Rapid growth; feed small frequent meals.",
  },
  {
    id: "puppy-4-12",
    label: "Puppy 4–12 months",
    range: "2.0 × RER",
    note: "Growth slows, but needs are still higher than adults.",
  },
];

const BODY_CONDITION_GUIDE = [
  {
    id: "underweight",
    label: "Underweight",
    adjustment: "+10–20%",
    description:
      "Ribs, spine and hip bones very easy to see; minimal body fat. Talk to your vet before increasing calories.",
  },
  {
    id: "ideal",
    label: "Ideal",
    adjustment: "Use MER as calculated",
    description:
      "Waist visible from above, ribs easy to feel with a thin fat cover.",
  },
  {
    id: "overweight",
    label: "Overweight",
    adjustment: "-10–20%",
    description:
      "No visible waist, ribs hard to feel. Work with your vet on a safe weight-loss plan.",
  },
];

// ---------------------------------------------------------------------
// TIPOS SIMPLES
// ---------------------------------------------------------------------

type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];
type BodyConditionId = (typeof BODY_CONDITION_GUIDE)[number]["id"];
type LifeStageId = "adult" | "senior" | "puppy-0-4" | "puppy-4-12";

interface Results {
  weightKg: number;
  rer: number;
  mer: number;
  merLow: number;
  merHigh: number;
}

// ---------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------

export default function DogCalorieNeedsRerMerCalculator() {
  // ESTADO
  const { unit, setUnit } = useWeightUnitPreference();

  const [inputs, setInputs] = useState({
    weight: "",
    activityId: "neutered-adult" as ActivityId,
    lifeStageId: "adult" as LifeStageId,
    bodyConditionId: "ideal" as BodyConditionId,
  });

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // FUNÇÕES AUXILIARES -------------------------------------------------

  const getBodyConditionMultiplier = (id: BodyConditionId): [number, number] => {
    switch (id) {
      case "underweight":
        return [1.1, 1.2];
      case "overweight":
        return [0.8, 0.9];
      default:
        return [1.0, 1.0];
    }
  };

  const formatKcal = (value: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);

  // CÁLCULO PRINCIPAL --------------------------------------------------

  const results: Results | null = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight.replace(",", "."));
    if (!weightRaw || weightRaw <= 0) return null;

    const weightKg = weightToKg(weightRaw, unit);

    // RER = 70 × (kg^0.75)
    const rer = 70 * Math.pow(weightKg, 0.75);

    const activity = ACTIVITY_LEVELS.find(
      (a) => a.id === inputs.activityId
    ) || ACTIVITY_LEVELS[1]; // fallback neutered adult

    let merBase = rer * activity.factor;

    // Ajuste por estágio de vida (bem simples para não brigar com MER principal)
    switch (inputs.lifeStageId) {
      case "senior":
        merBase *= 0.9;
        break;
      case "puppy-0-4":
        merBase = rer * 3.0;
        break;
      case "puppy-4-12":
        merBase = rer * 2.0;
        break;
      default:
        break;
    }

    const [condLow, condHigh] = getBodyConditionMultiplier(
      inputs.bodyConditionId
    );

    const mer = merBase;
    const merLow = merBase * condLow;
    const merHigh = merBase * condHigh;

    return {
      weightKg,
      rer,
      mer,
      merLow,
      merHigh,
    };
  }, [inputs, unit]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const handleReset = () => {
    setInputs({
      weight: "",
      activityId: "neutered-adult",
      lifeStageId: "adult",
      bodyConditionId: "ideal",
    });
  };

  // -------------------------------------------------------------------
  // WIDGET (FORM + RESULTADOS)
  // -------------------------------------------------------------------

  const widget = (
    <div className="space-y-6">
      {/* FORM CARD ----------------------------------------------------- */}
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Dog className="h-5 w-5 text-sky-500" />
            Dog calorie needs inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* WEIGHT + UNIT */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="weight">Dog's weight</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder="e.g., 12"
                value={inputs.weight}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, weight: e.target.value }))
                }
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="weightUnit">Unit</Label>
              <select
                id="weightUnit"
                className="h-10 w-full rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
                value={unit}
                onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* LIFE STAGE */}
          <div>
            <Label htmlFor="lifeStage">Life stage</Label>
            <select
              id="lifeStage"
              className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              value={inputs.lifeStageId}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  lifeStageId: e.target.value as LifeStageId,
                }))
              }
            >
              <option value="adult">Adult (1–7 years)</option>
              <option value="senior">Senior (7+ years)</option>
              <option value="puppy-0-4">Puppy 0–4 months</option>
              <option value="puppy-4-12">Puppy 4–12 months</option>
            </select>
          </div>

          {/* ACTIVITY LEVEL */}
          <div>
            <Label htmlFor="activity">Activity level</Label>
            <select
              id="activity"
              className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
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
              Choose what most closely matches your dog’s typical routine.
            </p>
          </div>

          {/* BODY CONDITION */}
          <div>
            <Label htmlFor="bodyCondition">Body condition</Label>
            <select
              id="bodyCondition"
              className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              value={inputs.bodyConditionId}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  bodyConditionId: e.target.value as BodyConditionId,
                }))
              }
            >
              {BODY_CONDITION_GUIDE.map((condition) => (
                <option key={condition.id} value={condition.id}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* BOTÕES -------------------------------------------------------- */}
      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          <Calculator className="mr-2 h-4 w-4" />
          Calculate calories
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* RESULTADOS ---------------------------------------------------- */}
      {results && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Daily calorie needs
          </h3>

          {/* GRID DE RESULTADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MER PRINCIPAL */}
            <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                  <Activity className="h-5 w-5" />
                  Recommended MER (Maintenance Energy Requirement)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                  This is a typical daily calorie target for your dog based on
                  weight, life stage, and activity level.
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                  {formatKcal(results.mer)} kcal / day
                </p>
              </CardContent>
            </Card>

            {/* RER */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  Resting Energy Requirement (RER)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatKcal(results.rer)} kcal/day
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Energy needed at complete rest in a thermoneutral environment.
                </p>
              </CardContent>
            </Card>

            {/* INTERVALO AJUSTADO */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-4 w-4 text-sky-500" />
                  Adjusted range
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatKcal(results.merLow)} – {formatKcal(results.merHigh)}{" "}
                  kcal/day
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Approximate range after body-condition adjustment. Work with
                  your vet to fine-tune this range.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* TABELA RESUMO */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Summary for your dog
            </h4>
            <Table className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-sm">
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/70">
                  <TableHead>Item</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Weight (kg)</TableCell>
                  <TableCell>{results.weightKg.toFixed(1)} kg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>RER</TableCell>
                  <TableCell>{formatKcal(results.rer)} kcal/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MER (base)</TableCell>
                  <TableCell>{formatKcal(results.mer)} kcal/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Adjusted range</TableCell>
                  <TableCell>
                    {formatKcal(results.merLow)} –{" "}
                    {formatKcal(results.merHigh)} kcal/day
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------
  // EDITORIAL (CONTEÚDO RICO EM SEO)
  // -------------------------------------------------------------------

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Calorie Needs (RER/MER) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your dog's daily caloric requirements using the industry-standard RER (Resting Energy Requirement) formula and adjusts for activity level via MER (Maintenance Energy Requirement). It helps you establish appropriate daily food portions tailored to your dog's age, weight, and lifestyle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your dog's current body weight in pounds or kilograms, then select their activity level (sedentary, moderate, or active) and life stage (puppy, adult, or senior). The calculator uses the formula 70 × (body weight in kg)^0.75 to compute RER, then applies a multiplier based on your selections.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your result shows daily calorie needs; divide this by your food's calorie density (kcal per cup) to determine portion size. Adjust portions every 4 weeks based on weight changes, and consult your veterinarian if your dog has special health conditions.</p>
        </div>
      </section>

      {/* TABLE: RER Estimates by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">RER Estimates by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical resting energy requirements based on body weight using the standard RER formula.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated RER (kcal/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">650</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">880</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values calculated using 70 × (body weight in kg)^0.75. Actual RER may vary by metabolism and age.</p>
      </section>

      {/* TABLE: MER Multipliers by Activity Level and Life Stage */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">MER Multipliers by Activity Level and Life Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Apply these multipliers to RER to determine daily maintenance energy requirements for your dog.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage/Activity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MER Multiplier (× RER)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 50 lb dog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–1.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">780–910 kcal/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately active adult</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–1.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">975–1,040 kcal/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very active/working dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7–2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,105–1,300 kcal/day</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Growing puppy (3–6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5–2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">975–1,300 kcal/day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior dog (&gt;7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8–1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">520–780 kcal/day</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual variation exists; monitor weight and adjust as needed every 4 weeks.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your dog monthly to catch weight gain or loss early, then recalculate calories to maintain optimal body condition.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a kitchen scale to measure food portions by weight rather than volume for greater accuracy in calorie control.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in treats and supplements—they can add 10–20% to daily calorie intake and should be subtracted from meal portions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consult your vet before major calorie changes, especially for dogs with metabolic disorders, diabetes, or obesity.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human calorie formulas for dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human metabolic equations don't account for the 0.75 exponent that reflects dogs' lower metabolic rate per pound; always use the 70 × (body weight in kg)^0.75 formula.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring treats and table scraps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats can easily add 200–400 calories daily and push a dog into caloric surplus; include all extras in your total daily intake calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying the same multiplier to all dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A senior, sedentary dog needs far fewer calories than a young, active one of the same weight; always adjust the MER multiplier for life stage and activity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not recalculating after major life changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Surgery, illness, or a shift from indoor to outdoor living can change calorie needs by 20–50%; recalculate when circumstances change.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is RER and how does it differ from MER?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RER (Resting Energy Requirement) is the baseline calories a dog needs at rest, while MER (Maintenance Energy Requirement) adjusts RER based on activity level and life stage. MER is typically 1.2–1.8 times RER depending on the dog's lifestyle.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is RER calculated for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">RER is calculated using the formula: 70 × (body weight in kg)^0.75. This metabolic equation accounts for a dog's size and metabolic rate more accurately than simple calorie-per-pound estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity multipliers should I use for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sedentary dogs use 1.2–1.4×, moderately active dogs use 1.5–1.6×, and highly active/working dogs use 1.7–2.0× RER. Puppies and senior dogs may need adjustments based on individual health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator work for puppies and senior dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but puppies typically need 1.5–2.0× their RER due to growth demands, while seniors may need 0.8–1.2× RER depending on metabolism and activity level. Individual health conditions should be considered.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do larger dogs have lower calorie needs per pound than smaller dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 0.75 exponent in the RER formula reflects that larger dogs have slower metabolic rates per unit of body weight, making calorie density lower for big breeds compared to small ones.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust calories based on neutering or spaying?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, neutered or spayed dogs typically need 25–30% fewer calories than intact dogs due to hormonal changes that lower metabolic rate. Adjust the MER multiplier downward accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my dog's calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 3–6 months as your dog's weight, activity level, and age change, or immediately after significant life events like surgery, illness, or lifestyle shifts.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/13038/nutrient-requirements-of-dogs-and-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NRC Nutrient Requirements of Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Academies publication providing evidence-based dietary guidelines and energy requirement formulas for companion animals.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Association of American Feed Control Officials sets minimum nutritional standards and guidelines for pet food labeling and adequacy.</p>
          </li>
          <li>
            <a href="https://www.wsava.org/Global-Guidelines/Nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">World Small Animal Veterinary Association (WSAVA) Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International veterinary consensus on optimal caloric intake, macronutrient ratios, and feeding strategies for dogs across life stages.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis Veterinary Medical Teaching Hospital Nutrition Support Service</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Academic resource offering research-backed information on canine nutrition, metabolic disorders, and therapeutic diet formulation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // -------------------------------------------------------------------
  // RENDER PRINCIPAL
  // -------------------------------------------------------------------

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Estimate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to find a safe daily calorie range based on weight, life stage, activity level, and body condition."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "RER & MER Formula" },
        { id: "examples", label: "Worked Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        formula: "RER = 70 × (body weight in kg)^0.75    |    MER = RER × factor",
        variables: [
          {
            symbol: "RER",
            name: "Resting Energy Requirement",
            description:
              "Estimated calories needed each day for basic body functions at rest.",
          },
          {
            symbol: "MER",
            name: "Maintenance Energy Requirement",
            description:
              "Daily calories needed for normal activity, adjusted from RER.",
          },
          {
            symbol: "kg",
            name: "Body weight in kilograms",
            description:
              "Use a recent, accurate weight. Pounds are automatically converted to kg.",
          },
          {
            symbol: "factor",
            name: "Activity / life-stage factor",
            description:
              "Multiplier chosen based on whether your dog is a puppy, adult, senior, active, or in a weight-loss plan.",
          },
        ],
        title: "Dog calorie equations used by this calculator",
      }}
      example={{
        title: "Example: 12 kg neutered adult house dog",
        scenario:
          "A 12 kg neutered adult dog lives indoors, goes on one or two moderate walks every day, and has an ideal body condition score.",
        steps: [
          {
            step: 1,
            description: "Calculate RER using body weight in kg",
            calculation: "RER = 70 × 12^0.75 ≈ 70 × 6.4 ≈ 448 kcal/day",
          },
          {
            step: 2,
            description: "Select MER factor for a neutered adult dog",
            calculation: "MER = RER × 1.6 ≈ 448 × 1.6 ≈ 717 kcal/day",
          },
          {
            step: 3,
            description: "Adjust for ideal body condition",
            calculation:
              "Ideal condition → no additional percentage change, so MER ≈ 700–750 kcal/day is a reasonable starting range.",
          },
        ],
        result:
          "The calculator will suggest roughly 700–750 kcal per day. Over several weeks, the vet may adjust this number up or down based on weight trend, energy level and body condition score.",
      }}
      relatedCalculators={[
        {
          title: "Dog Ideal Weight Range Calculator",
          url: "/pets/dog-ideal-weight-range",
          icon: "⚖️",
        },
        {
          title: "Dog Weight-Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "📉",
        },
        {
          title: "Dog Treat Calorie Tracker",
          url: "/pets/dog-treat-calorie-tracker",
          icon: "🍖",
        },
        {
          title: "Puppy Growth & Feeding Guide",
          url: "/pets/puppy-growth-feeding",
          icon: "🐾",
        },
        {
          title: "Dog Daily Water Intake Calculator",
          url: "/pets/dog-water-intake",
          icon: "💧",
        },
        {
          title: "Cat Calorie Needs Calculator",
          url: "/pets/cat-calorie-needs",
          icon: "🐱",
        },
      ]}
    />
  );
}
