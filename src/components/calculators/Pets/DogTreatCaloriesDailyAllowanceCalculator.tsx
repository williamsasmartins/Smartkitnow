import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Dog,
  Activity,
  Info,
  BookOpen,
  AlertTriangle,
  Percent,
  HeartPulse,
} from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogTreatCaloriesDailyAllowanceCalculator() {
  const [weightValue, setWeightValue] = useState<string>("10");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [treatCalories, setTreatCalories] = useState<string>("50");
  const [dailyTreats, setDailyTreats] = useState<string>("1");

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const parseNumber = (value: string): number => {
    const v = parseFloat(value.replace(",", "."));
    if (isNaN(v) || v < 0) return 0;
    return v;
  };

  const toKg = (value: number, unit: "kg" | "lb") =>
    unit === "kg" ? value : value * 0.45359237;

  const formatNumber = (value: number, digits = 0) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);

  const weightRaw = useMemo(() => parseNumber(weightValue), [weightValue]);

  const weightKg = useMemo(() => {
    const kg = toKg(weightRaw, weightUnit);
    return kg > 0 ? kg : 0;
  }, [weightRaw, weightUnit]);

  const treatCal = useMemo(() => parseNumber(treatCalories), [treatCalories]);

  const treatsCount = useMemo(() => {
    const t = parseInt(dailyTreats, 10);
    return isNaN(t) || t < 0 ? 0 : t;
  }, [dailyTreats]);

  const RER = useMemo(() => {
    if (weightKg <= 0) return 0;
    return 70 * Math.pow(weightKg, 0.75);
  }, [weightKg]);

  const activityFactor = 1.6;

  const MER = useMemo(() => {
    if (RER <= 0) return 0;
    return RER * activityFactor;
  }, [RER]);

  const totalTreatCalories = useMemo(() => {
    if (treatCal <= 0 || treatsCount <= 0) return 0;
    return treatCal * treatsCount;
  }, [treatCal, treatsCount]);

  const maxTreatCalories = useMemo(() => {
    if (MER <= 0) return 0;
    return MER * 0.1;
  }, [MER]);

  const treatPercentOfMER = useMemo(() => {
    if (MER <= 0 || totalTreatCalories <= 0) return 0;
    return (totalTreatCalories / MER) * 100;
  }, [MER, totalTreatCalories]);

  const maxTreatsAllowed = useMemo(() => {
    if (treatCal <= 0 || maxTreatCalories <= 0) return 0;
    return Math.floor(maxTreatCalories / treatCal);
  }, [maxTreatCalories, treatCal]);

  const overLimit = totalTreatCalories > maxTreatCalories && maxTreatCalories > 0;

  const handleReset = () => {
    setWeightValue("10");
    setWeightUnit("kg");
    setTreatCalories("50");
    setDailyTreats("1");
  };

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const formula = {
    title: "Core formulas used",
    formula:
      "RER = 70 × (Weight in kg)^0.75\nMER = RER × Activity Factor (1.6 for typical adult dogs)\nMax Treat Calories = 10% of MER\nTreat % of MER = (Treat Calories ÷ MER) × 100\nMax Treats Allowed = Max Treat Calories ÷ Calories per Treat",
    variables: [
      { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
      { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
      { symbol: "Weight", description: "Dog’s weight in kilograms (kg)" },
      { symbol: "Activity Factor", description: "Typical multiplier (1.6 for adult dogs)" },
      { symbol: "Max Treat Calories", description: "10% of MER" },
      { symbol: "Treat % of MER", description: "Percentage of daily calories from treats" },
      { symbol: "Max Treats Allowed", description: "Treats allowed within the 10% guideline" },
      { symbol: "Calories per Treat", description: "Energy content per treat (kcal)" },
    ],
  };

  const example = {
    title: "Example: how many treats can a 15 kg dog have?",
    scenario:
      "You share crunchy biscuits with your 15 kg adult dog. Each biscuit has 35 kcal, and you want to know the safe maximum number per day.",
    steps: [
      {
        step: 1,
        description: "Estimate the resting energy requirement (RER).",
        calculation: "RER = 70 × 15^0.75 ≈ 533 kcal/day",
      },
      {
        step: 2,
        description: "Estimate daily maintenance energy requirement (MER).",
        calculation: "MER = 533 × 1.6 ≈ 853 kcal/day",
      },
      {
        step: 3,
        description: "Apply the 10% treat guideline.",
        calculation: "Max treat calories = 10% of 853 ≈ 85 kcal/day",
      },
      {
        step: 4,
        description: "Convert calorie limit into number of treats.",
        calculation: "Max treats = 85 ÷ 35 ≈ 2 treats/day",
      },
    ],
    result:
      "In this example, up to 2 biscuits per day keeps treat calories within the recommended 10% of daily needs. Your vet may adjust this based on health and body condition.",
  };

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      url: "/pets/dog-calorie-needs-rer-mer",
      icon: "🐶",
    },
    {
      title: "Dog Ideal Weight & Target Calories Calculator",
      url: "/pets/dog-ideal-weight-target-calories",
      icon: "🎯",
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
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why should my dog's treats stay under 10% of daily calories?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Keeping treats under 10% of daily calorie intake helps avoid unwanted weight gain and keeps the main diet nutritionally balanced.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if treat calories exceed this limit?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Exceeding the 10% guideline increases the risk of long-term weight gain, joint stress, and metabolic issues.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for puppies or working dogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Puppies and working dogs have higher calorie needs. Consult your vet for customized treat allowances.",
        },
      },
      {
        "@type": "Question",
        name: "Do all treats have the same calories?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. Calories vary widely by type of treat, brand, and size. Always check the packaging or manufacturer website.",
        },
      },
    ],
  };

  const editorial = (
    <div className="space-y-10">
      <section id="how-it-works">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          How this dog treat calorie calculator works
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator estimates how many daily calories your dog receives from treats,
          and whether that amount stays within the standard recommendation of keeping treats at or below 10% of total daily calories.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          By entering your dog's weight, the calories per treat, and the number of treats you give daily,
          the calculator determines whether you are within healthy limits or exceeding them.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Calculates RER (Resting Energy Requirement)</li>
          <li>Estimates MER (Maintenance Energy Requirement)</li>
          <li>Calculates treat calories and % of total daily calories</li>
          <li>Shows whether your dog's treat intake is safe or excessive</li>
        </ul>
      </section>

      <section id="ten-percent-rule" className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
          <Percent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Why veterinarians recommend the “10% treat rule”
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Treats are enjoyable and useful for training, but they can quickly add extra calories.
          Over time, excess treat calories can contribute to weight gain, obesity, and health complications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Keeping treats under 10% of daily calories helps ensure your dog's primary diet remains nutritionally complete
          while still letting you reward good behavior.
        </p>
      </section>

      <section id="examples" className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
          Worked example
        </h2>
        <article className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
            {example.title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-2">{example.scenario}</p>
          <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
            {example.steps.map((s) => (
              <li key={s.step}>
                <span className="font-semibold">Step {s.step} — </span>
                {s.description}
                <span className="block font-mono">{s.calculation}</span>
              </li>
            ))}
          </ol>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {example.result}
          </p>
        </article>
      </section>

      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Frequently asked questions
        </h2>
        <dl className="space-y-6">
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Why are high treat calories a problem?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Treats often contain more calories than expected, and when given frequently,
              they can easily exceed healthy daily limits, contributing to weight gain.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Does treat size affect calorie content?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Yes. Treats vary widely in calorie density. Always check the package or manufacturer
              to know exactly how many calories you are giving.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              What if my dog is overweight?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Use this calculator to reduce treat calories to safe levels. A veterinarian can help
              create a complete weight-loss plan if needed.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Are human foods considered treats?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Yes. Cheese, peanut butter, chicken pieces, bread, and small snacks should all be counted
              as treats when calculating daily treat calories.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              How often should I recalculate treat allowances?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Re-evaluate treat allowances whenever your dog’s weight changes, you switch treat brands,
              or you start a new diet routine.
            </dd>
          </div>
        </dl>
      </section>

      <section id="disclaimer" className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          Important disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator provides educational estimates only.
          It does not replace personalized veterinary nutrition advice.
        </p>
      </section>

      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          References & further reading
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <a
                href="https://www.wsava.org/wp-content/uploads/2020/03/WSAVA-Nutrition-Guidelines-2019.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Authoritative nutrition guidelines including calorie needs, feeding strategies,
                and treat calorie recommendations.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <a
                href="https://www.petmd.com/dog/nutrition/how-many-treats-can-i-give-my-dog"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                PetMD – How Many Treats Can I Give My Dog?
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Helpful breakdown of calorie density in treats and guidance for healthy treat habits.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  const onThisPage = [
    { label: "How this calculator works", href: "#how-it-works" },
    { label: "Why the 10% rule", href: "#ten-percent-rule" },
    { label: "Worked example", href: "#examples" },
    { label: "FAQ", href: "#faq" },
    { label: "Disclaimer", href: "#disclaimer" },
    { label: "References", href: "#references" },
  ];

  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Dog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Enter your dog’s details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="dog-weight">Current weight</Label>
              <Input
                id="dog-weight"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.1}
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                placeholder="e.g. 10"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use your vet’s last recorded weight or use a reliable scale.
              </p>
            </div>

            <div>
              <Label htmlFor="weight-unit">Unit</Label>
              <select
                id="weight-unit"
                className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")}
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="treat-calories">Calories per treat (kcal)</Label>
            <Input
              id="treat-calories"
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={treatCalories}
              onChange={(e) => setTreatCalories(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <Label htmlFor="daily-treats">Number of treats per day</Label>
            <Input
              id="daily-treats"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={dailyTreats}
              onChange={(e) => setDailyTreats(e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleCalculate}>
          <Calculator className="mr-2 h-4 w-4" />
          Calculate treat allowance
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {weightKg > 0 && MER > 0 && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Daily treat allowance summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  Daily energy needs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  RER: <span className="font-semibold">{formatNumber(RER, 0)} kcal/day</span>
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  MER: <span className="font-semibold">{formatNumber(MER, 0)} kcal/day</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Treat calories
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Current treats:{" "}
                  <span className="font-semibold">
                    {formatNumber(totalTreatCalories, 0)} kcal/day
                  </span>
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Safe limit:{" "}
                  <span className="font-semibold">
                    {formatNumber(maxTreatCalories, 0)} kcal/day
                  </span>
                </p>
                <p
                  className={`text-sm font-semibold ${
                    overLimit
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  Treats are {formatNumber(treatPercentOfMER || 0, 0)}% of daily calories.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Percent className="h-4 w-4 text-sky-500" />
                  Maximum treats/day
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {maxTreatsAllowed}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Rounded down to stay safely within the 10% guideline.
                </p>
                {overLimit && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    Your current treat intake exceeds recommended limits.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-slate-800 dark:text-slate-100">
              These results are estimates only. Dogs with medical conditions,
              special diets, or weight concerns may require different treat limits.
              Always consult your veterinarian for personalized advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Estimate how many calories your dog's treats contribute to their daily intake and find a safe daily limit using the 10% guideline."
      widget={widget}
      editorial={editorial}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={jsonLd}
      icon={<Dog className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default DogTreatCaloriesDailyAllowanceCalculator;
