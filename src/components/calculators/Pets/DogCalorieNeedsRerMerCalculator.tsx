import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [inputs, setInputs] = useState({
    weight: "",
    weightUnit: "kg" as "kg" | "lb",
    activityId: "neutered-adult" as ActivityId,
    lifeStageId: "adult" as LifeStageId,
    bodyConditionId: "ideal" as BodyConditionId,
  });

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // FUNÇÕES AUXILIARES -------------------------------------------------

  const toKg = (weight: number, unit: "kg" | "lb") =>
    unit === "kg" ? weight : weight * 0.45359237;

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

    const weightKg = toKg(weightRaw, inputs.weightUnit);

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
  }, [inputs]);

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
      weightUnit: "kg",
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
    <div className="space-y-10">
      {/* INTRODUÇÃO */}
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use the dog calorie needs calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator estimates your dog&apos;s{" "}
          <strong>Resting Energy Requirement (RER)</strong> and{" "}
          <strong>Maintenance Energy Requirement (MER)</strong> using
          veterinary-standard formulas. RER is the energy needed for basic body
          functions at rest, while MER adjusts that number for{" "}
          <strong>activity level, life stage, and body condition</strong>.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          To get a meaningful result, try to use a{" "}
          <strong>recent, accurate weight</strong> from your veterinarian or a
          reliable home scale. Then choose the options that best describe your
          dog&apos;s routine:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight &amp; unit</strong> – enter the current weight in
            kilograms or pounds.
          </li>
          <li>
            <strong>Life stage</strong> – puppies, adults and seniors have
            noticeably different calorie needs.
          </li>
          <li>
            <strong>Activity level</strong> – compare your dog&apos;s lifestyle
            with the descriptions in the dropdown.
          </li>
          <li>
            <strong>Body condition</strong> – choose whether your dog is
            underweight, ideal or overweight based on rib and waist visibility.
          </li>
        </ul>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          The tool then calculates a daily calorie target and a safe adjustment
          range. These values are meant as{" "}
          <strong>educational guidelines</strong>. Always work with your vet for
          diagnosis, customized diet plans, and medical decisions.
        </p>
      </section>

      {/* FORMULA */}
      <section id="formula" className="border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          RER and MER formulas used by this calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Most modern veterinary nutrition guidelines estimate calorie needs
          using a two-step approach:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-4">
          <li>
            Calculate the <strong>Resting Energy Requirement (RER)</strong>.
          </li>
          <li>
            Multiply RER by an appropriate <strong>MER factor</strong> based on
            the dog&apos;s situation.
          </li>
        </ol>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-800 mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Resting Energy Requirement
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100">
            RER = 70 × (body weight in kg)<sup>0.75</sup>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-emerald-100 dark:border-emerald-800 mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Maintenance Energy Requirement
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
            MER = RER × factor
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            The factor depends on whether your dog is a puppy, adult, senior,
            very active, or on a weight-loss plan.
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
          Typical MER factors
        </h3>
        <Table className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-sm mb-4">
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900/60">
              <TableHead>Dog type</TableHead>
              <TableHead>Typical factor</TableHead>
              <TableHead>Comment</TableHead>
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
          Different textbooks and veterinary specialists may use slightly
          different ranges, especially for puppies, working dogs and medical
          conditions. The factors here represent{" "}
          <strong>commonly used starting points</strong> for healthy dogs.
        </p>
      </section>

      {/* EXEMPLO PRÁTICO */}
      <section
        id="examples"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Example: calculating calories for a 12&nbsp;kg neutered adult dog
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Imagine a <strong>12 kg neutered adult dog</strong> who lives
          indoors, has daily walks, and a normal body condition score. Here is
          how the calculator estimates calorie needs:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-4">
          <li>
            Convert the weight to kilograms (already 12 kg in this example).
          </li>
          <li>
            Calculate RER:
            <br />
            <span className="font-mono">
              RER = 70 × 12<sup>0.75</sup> ≈ 70 × 6.4 ≈ 448 kcal/day
            </span>
          </li>
          <li>
            Choose MER factor for a neutered adult: 1.6 × RER.
            <br />
            <span className="font-mono">
              MER = 448 × 1.6 ≈ 717 kcal/day
            </span>
          </li>
          <li>
            Because the body condition is ideal, the adjustment range is roughly
            the same as MER.
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          In practice, your vet might suggest starting at around{" "}
          <strong>700–750 kcal/day</strong>, then monitoring weight, body
          condition score, and energy level for several weeks and adjusting up
          or down as needed.
        </p>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions about dog calorie needs
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Is this calculator a substitute for a veterinary nutrition
              consult?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              No. This calculator is an{" "}
              <strong>educational planning tool</strong>, not a medical device.
              It cannot evaluate your dog&apos;s medical history, lab work,
              medications or specific dietary needs. Use it to better understand
              how calorie recommendations are estimated, then discuss the
              results with your veterinarian, especially if your dog has chronic
              disease, is underweight or overweight, or takes long-term
              medications.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Should I use current weight or ideal weight?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              For most healthy dogs, starting with the{" "}
              <strong>current weight</strong> is reasonable. If your dog is
              clearly overweight, many vets prefer using an{" "}
              <strong>estimated ideal weight</strong> to avoid oversupplying
              calories. If you are not sure what the ideal weight should be,
              ask your vet to examine your dog and give you a target range.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              How fast should my dog lose or gain weight?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-2">
              In general, safe weight change is{" "}
              <strong>no more than 1–2% of body weight per week</strong>. Faster
              loss may put stress on organs and increase the risk of
              nutritional deficiencies. If your dog is severely obese,
              underweight, or has another illness, a custom medical plan is
              essential.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Always schedule regular weigh-ins and body condition score checks
              with your veterinary team while adjusting calories.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Does the type of food matter, or just calories?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Calories are only part of the story. Dogs also need appropriate
              <strong> protein, fat, vitamins, minerals and fiber</strong>.
              Premium commercial diets are formulated to be balanced when fed at
              the recommended amount. If you use home-cooked food, raw diets or
              heavy use of treats and table scraps, it becomes much harder to
              keep the overall diet complete. Work with a veterinary nutrition
              specialist before making major changes.
            </p>
          </div>
        </div>
      </section>

      {/* REFERENCES & RESOURCES */}
      <section
        id="references"
        className="border-t border-slate-200 dark:border-slate-700 pt-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          References & additional resources
        </h2>
        <ul className="space-y-4 text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-3">
            <Info className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">
                WSAVA Global Nutrition Committee – Calorie and feeding
                guidelines
              </p>
              <p>
                International recommendations used by many veterinarians to
                estimate RER, MER and safe weight-loss plans.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Info className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">
                Veterinary clinical nutrition textbooks
              </p>
              <p>
                Standard references such as the{" "}
                <em>Handbook of Small Animal Clinical Nutrition</em> summarize
                calorie equations, body condition scoring and feeding strategies
                for different life stages.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Info className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">Your primary care veterinarian</p>
              <p>
                Nothing replaces hands-on evaluation. Bring your calorie report
                to your vet visit and use it as a starting point for a
                personalized nutrition discussion.
              </p>
            </div>
          </li>
        </ul>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          This calculator and article are for{" "}
          <strong>informational purposes only</strong> and do not replace
          professional veterinary care. Always consult a licensed veterinarian
          before changing your dog&apos;s diet, medication or exercise plan.
        </p>
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
