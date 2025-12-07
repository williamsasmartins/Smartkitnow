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
  // ------------------------------
  // STATE
  // ------------------------------
  const [weightValue, setWeightValue] = useState<string>("10");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [treatCalories, setTreatCalories] = useState<string>("50");
  const [dailyTreats, setDailyTreats] = useState<string>("1");

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // ------------------------------
  // HELPERS
  // ------------------------------
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

  // ------------------------------
  // INPUTS NORMALIZADOS
  // ------------------------------
  const weightRaw = useMemo(
    () => parseNumber(weightValue),
    [weightValue]
  );

  const weightKg = useMemo(() => {
    const kg = toKg(weightRaw, weightUnit);
    if (kg <= 0) return 0;
    return kg;
  }, [weightRaw, weightUnit]);

  const treatCal = useMemo(
    () => parseNumber(treatCalories),
    [treatCalories]
  );

  const treatsCount = useMemo(() => {
    const t = parseInt(dailyTreats, 10);
    if (isNaN(t) || t < 0) return 0;
    return t;
  }, [dailyTreats]);

  // ------------------------------
  // CÁLCULOS NUTRICIONAIS
  // ------------------------------
  // RER = 70 × (weight in kg)^0.75
  const RER = useMemo(() => {
    if (weightKg <= 0) return 0;
    return 70 * Math.pow(weightKg, 0.75);
  }, [weightKg]);

  // MER = RER × fator de atividade (1.6 = cão adulto típico)
  const activityFactor = 1.6;
  const MER = useMemo(() => {
    if (RER <= 0) return 0;
    return RER * activityFactor;
  }, [RER]);

  // Calorias de petisco consumidas por dia
  const totalTreatCalories = useMemo(() => {
    if (treatCal <= 0 || treatsCount <= 0) return 0;
    return treatCal * treatsCount;
  }, [treatCal, treatsCount]);

  // Limite seguro de calorias em petiscos (10% do MER)
  const maxTreatCalories = useMemo(() => {
    if (MER <= 0) return 0;
    return MER * 0.1;
  }, [MER]);

  // Porcentagem de calorias de petisco em relação ao MER
  const treatPercentOfMER = useMemo(() => {
    if (MER <= 0 || totalTreatCalories <= 0) return 0;
    return (totalTreatCalories / MER) * 100;
  }, [MER, totalTreatCalories]);

  // Número máximo de petiscos baseado no limite seguro
  const maxTreatsAllowed = useMemo(() => {
    if (treatCal <= 0 || maxTreatCalories <= 0) return 0;
    return Math.floor(maxTreatCalories / treatCal);
  }, [maxTreatCalories, treatCal]);

  const overLimit = totalTreatCalories > maxTreatCalories && maxTreatCalories > 0;

  // ------------------------------
  // HANDLERS
  // ------------------------------
  const handleReset = () => {
    setWeightValue("10");
    setWeightUnit("kg");
    setTreatCalories("50");
    setDailyTreats("1");
  };

  const handleCalculate = () => {
    // apenas rolar para os resultados, os cálculos já são reativos
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  // ------------------------------
  // FORMULA
  // ------------------------------
  const formula = {
    title: "Core formulas used",
    formula:
      "RER = 70 × (Weight in kg)^0.75\nMER = RER × Activity Factor (1.6 for typical adult dogs)\nMax Treat Calories = 10% of MER\nTreat % of MER = (Treat Calories ÷ MER) × 100\nMax Treats Allowed = Max Treat Calories ÷ Calories per Treat",
    variables: [
      {
        symbol: "RER",
        description: "Resting Energy Requirement (kcal/day)",
      },
      {
        symbol: "MER",
        description:
          "Maintenance Energy Requirement (kcal/day) for a typical adult dog",
      },
      {
        symbol: "Weight",
        description: "Dog's body weight in kilograms (kg)",
      },
      {
        symbol: "Activity Factor",
        description:
          "Multiplier to adjust RER for daily activity; 1.6 is common for average adult dogs",
      },
      {
        symbol: "Max Treat Calories",
        description:
          "Maximum recommended daily calories from treats (10% of MER)",
      },
      {
        symbol: "Treat % of MER",
        description:
          "Percentage of your dog's daily calorie needs currently coming from treats",
      },
      {
        symbol: "Max Treats Allowed",
        description:
          "Maximum number of treats per day without exceeding 10% of MER",
      },
      {
        symbol: "Calories per Treat",
        description: "Energy content of one treat (kcal)",
      },
    ],
  };

  // ------------------------------
  // EXAMPLE
  // ------------------------------
  const example = {
    title: "Example: how many treats can a 15 kg dog have?",
    scenario:
      "You share crunchy biscuits with your 15 kg adult dog. Each biscuit has 35 kcal, and you want to know a safe maximum number per day.",
    steps: [
      "Estimate RER: 70 × 15^0.75 ≈ 70 × 7.62 ≈ 533 kcal/day.",
      "Estimate MER for a typical adult dog: 533 × 1.6 ≈ 853 kcal/day.",
      "Calculate the 10% treat limit: 10% of 853 ≈ 85 kcal/day from treats.",
      "Divide by calories per treat: 85 ÷ 35 ≈ 2.4, so at most 2 biscuits per day.",
    ],
    result:
      "In this example, up to 2 biscuits per day keeps treat calories at or below 10% of your dog's daily needs. Your vet may adjust this limit based on your dog's weight history, body condition and health.",
  };

  // ------------------------------
  // RELATED CALCULATORS
  // ------------------------------
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

  // ------------------------------
  // FAQ JSON-LD
  // ------------------------------
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why should my dog's treats be limited to about 10% of daily calories?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Using no more than about 10% of your dog's daily calories for treats helps prevent unwanted weight gain and keeps the main diet nutritionally balanced. If treats replace too much of the main food, your dog may miss important nutrients.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if my dog regularly gets more than 10% of calories from treats?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Regularly going above this guideline increases the risk of weight gain and obesity over time. Extra weight can stress joints, worsen arthritis, and increase the risk of certain diseases. Your veterinarian can help you design a safe, gradual weight-management plan.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for puppies or very active dogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Puppies, working dogs and very active dogs often have higher energy needs than a typical adult pet. This calculator uses a standard adult activity factor, so you should discuss treat allowances and total calorie needs with your veterinarian for those dogs.",
        },
      },
      {
        "@type": "Question",
        name: "Does treat size or texture matter for calorie counting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Crunchy biscuits, soft chews, training treats and human snacks can have very different calorie densities. Always check the label or ask the manufacturer so you can enter realistic 'calories per treat' in this calculator.",
        },
      },
      {
        "@type": "Question",
        name: "Is this calculator a substitute for veterinary nutrition advice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This tool is for education only. It helps you understand how treat calories fit into your dog's daily energy budget, but it does not replace personalized advice from your veterinarian, especially if your dog has health problems or is overweight.",
        },
      },
    ],
  };

  // ------------------------------
  // EDITORIAL
  // ------------------------------
  const editorial = (
    <div className="space-y-10">
      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          How this dog treat calories calculator works
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator helps you estimate{" "}
          <strong>how much of your dog&apos;s daily energy intake comes from treats</strong>{" "}
          and whether that amount stays within a commonly recommended safety
          guideline: keeping treats at or below{" "}
          <strong>about 10% of daily calories</strong>.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          You enter your dog&apos;s weight, the calories per treat and how many
          treats you usually give in a day. The calculator then:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Estimates your dog&apos;s <strong>Resting Energy Requirement (RER)</strong> using
            body weight in kilograms.
          </li>
          <li>
            Uses a standard adult <strong>activity factor</strong> to estimate{" "}
            <strong>Maintenance Energy Requirement (MER)</strong>, or total daily calories.
          </li>
          <li>
            Calculates your dog&apos;s <strong>treat calories per day</strong> and the{" "}
            <strong>percentage of MER</strong> coming from treats.
          </li>
          <li>
            Shows a <strong>maximum safe treat allowance</strong> based on the 10% rule.
          </li>
        </ul>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          The formulas are widely used in veterinary nutrition, but your own
          veterinarian may recommend slightly different limits based on health
          conditions, age and body-condition score.
        </p>
      </section>

      {/* WHY 10% RULE */}
      <section
        id="ten-percent-rule"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Percent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Why many vets recommend the “10% treat rule”
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Treats are a great way to reward your dog, build training routines and
          strengthen your bond. But they can also be a{" "}
          <strong>hidden source of extra calories</strong>. Over months and
          years, those extra calories can lead to weight gain and obesity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          To reduce this risk, many veterinary nutrition guidelines suggest that
          treats should make up <strong>no more than about 10% of your dog&apos;s
          daily calories</strong>. That way:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>The main diet (complete food) still provides most nutrients.</li>
          <li>
            You have room for training rewards without destabilizing their
            calorie balance.
          </li>
          <li>
            It&apos;s easier to maintain or reach a{" "}
            <strong>healthy body-condition score</strong>.
          </li>
        </ul>
      </section>

      {/* EXAMPLES */}
      <section
        id="examples"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
          Worked example
        </h2>
        <article className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
            {example.title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-2">
            {example.scenario}
          </p>
          <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-2 space-y-1">
            {example.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {example.result}
          </p>
        </article>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Frequently asked questions
        </h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              Why are high treat calories a problem?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Many dogs gain weight so slowly that it&apos;s hard to notice
              month to month. Treats can sneak in hundreds of extra calories
              each week, especially if several family members give snacks. Over
              time, that can push your dog into an unhealthy weight range.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              Does it matter what kind of treats I use?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Yes. Low-calorie training treats, pieces of your dog&apos;s
              regular kibble, or vet-recommended dental chews tend to fit better
              into a weight-management plan than high-fat human foods or large,
              calorie-dense snacks.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              My dog is already overweight. How should I use this calculator?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              You can use the calculator to see how current treat habits compare
              to the 10% guideline and to plan gradual reductions. But any
              structured weight-loss plan should be supervised by your
              veterinarian, who can also help you choose appropriate prescription
              diets or weight-management formulas.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              Should I count chews, table scraps and lick-mats as treats?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Yes. Anything that adds calories outside of your dog&apos;s main
              complete food should be counted—this includes dental chews,
              peanut-butter toys, lick-mats, bits of cheese or meat, and other
              snacks offered between meals.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              How often should I revisit my dog&apos;s treat plan?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              It&apos;s a good idea to recheck weight and treat habits at least
              every few months, and more often if your vet is guiding a
              weight-loss program. You can reuse this calculator whenever you
              switch treats, change portions or adjust your dog&apos;s main diet.
            </dd>
          </div>
        </dl>
      </section>

      {/* DISCLAIMER */}
      <section
        id="disclaimer"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          Important disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for{" "}
          <strong>educational purposes only</strong>. It cannot evaluate your
          dog&apos;s medical history, endocrine diseases, joint problems or
          medication effects. Always consult your veterinarian before making
          major changes to your dog&apos;s diet, especially if your dog is
          overweight, underweight or has other health concerns.
        </p>
      </section>

      {/* REFERENCES */}
      <section
        id="references"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          References &amp; further reading
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
                International guidelines that discuss body-condition scoring,
                calorie calculations and practical feeding advice for dogs and
                cats, including how treats fit into daily energy needs.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/dog-owners/nutrition-and-feeding-of-dogs/feeding-mature-dogs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual – Feeding mature dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Overview of calorie requirements and practical feeding
                strategies for adult dogs, including weight control and obesity
                prevention.
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
                Explains why treat calories matter and how to integrate them
                into your dog&apos;s overall nutrition plan.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // ------------------------------
  // ON THIS PAGE
  // ------------------------------
  const onThisPage = [
    { label: "How this calculator works", href: "#how-it-works" },
    { label: "Why the 10% rule?", href: "#ten-percent-rule" },
    { label: "Worked example", href: "#examples" },
    { label: "FAQ", href: "#faq" },
    { label: "Disclaimer", href: "#disclaimer" },
    { label: "References", href: "#references" },
  ];

  // ------------------------------
  // WIDGET (CALCULATOR UI)
  // ------------------------------
  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Dog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Enter your dog&apos;s details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weight + unit */}
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
                Use your vet&apos;s last recorded weight or a reliable scale.
              </p>
            </div>
            <div>
              <Label htmlFor="weight-unit">Unit</Label>
              <select
                id="weight-unit"
                className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
                value={weightUnit}
                onChange={(e) =>
                  setWeightUnit(e.target.value as "kg" | "lb")
                }
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* Treat calories */}
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
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check the packaging or manufacturer&apos;s website for accurate
              calorie information.
            </p>
          </div>

          {/* Treat count */}
          <div>
            <Label htmlFor="daily-treats">
              Number of treats you give per day
            </Label>
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
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Include all biscuits, chews and snacks, not just “formal” treats.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleCalculate}>
          <Calculator className="mr-2 h-4 w-4" />
          Calculate treat allowance
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {/* RESULTS */}
      {weightKg > 0 && MER > 0 && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Daily treat allowance summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Energy needs */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  Daily energy needs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  RER:{" "}
                  <span className="font-semibold">
                    {formatNumber(RER, 0)} kcal/day
                  </span>
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  MER (typical adult):{" "}
                  <span className="font-semibold">
                    {formatNumber(MER, 0)} kcal/day
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Based on a standard adult activity factor of 1.6. Your vet may
                  adjust this for your dog.
                </p>
              </CardContent>
            </Card>

            {/* Treat calories */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-emerald-500" />
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
                  Safe limit (10% of MER):{" "}
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
                  Treats are{" "}
                  {formatNumber(treatPercentOfMER || 0, 0)}% of daily calories.
                </p>
              </CardContent>
            </Card>

            {/* Max treats allowed */}
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Percent className="h-4 w-4 text-sky-500" />
                  Maximum treats / day
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {maxTreatsAllowed}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Rounded down to keep treat calories at or below the 10% guideline.
                </p>
                {overLimit && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Your current treat plan is above this limit—consider
                    reducing portion size or number of treats.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300/70 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-slate-800 dark:text-slate-100">
              These results are <strong>estimates only</strong>. For dogs that
              are already overweight, underweight, growing, very active, or
              managing medical conditions, always ask your veterinarian how to
              tailor both main diet and treat allowance.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Estimate how many calories your dog's treats contribute to their daily intake and find a safe maximum number of treats using the 10% guideline."
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
