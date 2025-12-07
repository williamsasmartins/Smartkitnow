import { useState, useMemo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import {
  Calculator,
  Dog,
  Activity,
  Info,
  BookOpen,
  HeartPulse,
  Scale,
  AlertTriangle,
} from "lucide-react";

function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  // --------------------------------------------------------------
  // ESTADO: idade (semanas) + porte previsto do adulto
  // --------------------------------------------------------------
  const [ageWeeks, setAgeWeeks] = useState<string>("");
  const [breedSize, setBreedSize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Clamp / parse idade
  const age = useMemo(() => {
    const val = Number(ageWeeks);
    if (isNaN(val) || val < 1) return 1;
    if (val > 52) return 52;
    return val;
  }, [ageWeeks]);

  // Peso adulto médio por categoria (aprox.)
  // Small: 5–10 kg, Medium: 15–25 kg, Large: 30–45 kg
  const predictedAdultWeight = useMemo(() => {
    switch (breedSize) {
      case "small":
        return 7.5;
      case "medium":
        return 20;
      case "large":
        return 37.5;
      default:
        return 20;
    }
  }, [breedSize]);

  // Percentual de peso adulto por idade (curva de crescimento aproximada)
  const percentAdultWeightByAge = useMemo(() => {
    const points = [
      { w: 4, p: 0.1 },
      { w: 8, p: 0.25 },
      { w: 12, p: 0.4 },
      { w: 16, p: 0.55 },
      { w: 20, p: 0.7 },
      { w: 24, p: 0.85 },
      { w: 52, p: 1.0 },
    ];

    if (age <= 4) return 0.1;
    if (age >= 52) return 1.0;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (age >= p1.w && age <= p2.w) {
        const ratio = (age - p1.w) / (p2.w - p1.w);
        return p1.p + ratio * (p2.p - p1.p);
      }
    }

    return 1.0;
  }, [age]);

  const estimatedPuppyWeight = useMemo(
    () => predictedAdultWeight * percentAdultWeightByAge,
    [predictedAdultWeight, percentAdultWeightByAge]
  );

  const RER = useMemo(() => {
    if (estimatedPuppyWeight <= 0) return 0;
    return 70 * Math.pow(estimatedPuppyWeight, 0.75);
  }, [estimatedPuppyWeight]);

  // NRC: em muitos casos ≈ 3 × RER para filhotes em crescimento
  const PER = useMemo(() => RER * 3, [RER]);

  const formatKcal = (val: number) => {
    if (val <= 0 || isNaN(val)) return "0";
    return Math.round(val).toLocaleString();
  };

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const handleReset = () => {
    setAgeWeeks("");
    setBreedSize("medium");
  };

  // --------------------------------------------------------------
  // ON THIS PAGE
  // --------------------------------------------------------------
  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "growth-curves", label: "Puppy Growth & Energy Needs" },
    { id: "example", label: "Worked Example" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "disclaimer", label: "Disclaimer" },
    { id: "references", label: "References & Resources" },
  ];

  // --------------------------------------------------------------
  // FORMULA (FORMATO COMPATÍVEL COM CalculatorVerticalLayout)
  // --------------------------------------------------------------
  const formula = {
    formula:
      "RER = 70 × (body weight in kg)^0.75    |    PER ≈ 3 × RER for growing puppies",
    title: "Puppy calorie equations used by this calculator",
    variables: [
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description:
          "Baseline calories needed each day for vital functions at rest.",
      },
      {
        symbol: "PER",
        name: "Puppy Energy Requirement",
        description:
          "Estimated calories needed for growth and typical puppy activity (about 3 × RER).",
      },
      {
        symbol: "kg",
        name: "Body weight in kilograms",
        description:
          "The calculator estimates current puppy weight from predicted adult weight and age.",
      },
      {
        symbol: "% adult weight",
        name: "Percent of predicted adult weight",
        description:
          "Growth curves are used to approximate what fraction of adult weight a puppy has at a given age.",
      },
    ],
  };

  // --------------------------------------------------------------
  // EXAMPLE (MESMO PADRÃO DO DOG RER/MER)
  // --------------------------------------------------------------
  const example = {
    title: "Example: 10-week-old medium-breed puppy",
    scenario:
      "You have a 10-week-old puppy expected to grow into a medium-breed adult (~20 kg). You want to estimate daily calories for healthy growth.",
    steps: [
      {
        step: 1,
        description:
          "Estimate the puppy's weight as a percentage of adult weight at 10 weeks.",
        calculation:
          "Between 8 weeks (25%) and 12 weeks (40%): 25% + ((10 − 8) / (12 − 8)) × (40% − 25%) = 25% + 0.5 × 15% = 32.5%",
      },
      {
        step: 2,
        description:
          "Convert that percentage into an estimated current weight.",
        calculation: "Estimated puppy weight = 20 kg × 0.325 = 6.5 kg",
      },
      {
        step: 3,
        description:
          "Calculate Resting Energy Requirement (RER) using the standard formula.",
        calculation: "RER = 70 × (6.5^0.75) ≈ 70 × 3.75 ≈ 263 kcal/day",
      },
      {
        step: 4,
        description:
          "Multiply RER by 3 to estimate Puppy Energy Requirement (PER).",
        calculation: "PER ≈ 3 × 263 ≈ 789 kcal/day",
      },
    ],
    result:
      "In this example, the puppy needs roughly 780–800 kcal per day to support healthy growth at 10 weeks of age, assuming a typical medium-breed and normal health. Your veterinarian may fine-tune this target based on body condition and growth rate.",
  };

  // --------------------------------------------------------------
  // RELATED CALCULATORS (RELEVANTES PARA FILHOTES / CÃES)
  // --------------------------------------------------------------
  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      url: "/pets/dog-calorie-needs-rer-mer",
      icon: "🔥",
    },
    {
      title: "Puppy Growth & Feeding Guide",
      url: "/pets/puppy-growth-feeding",
      icon: "🐾",
    },
    {
      title: "Dog Ideal Weight & Target Calories",
      url: "/pets/dog-ideal-weight-target-calories",
      icon: "🎯",
    },
    {
      title: "Dog Treat Calories Daily Allowance",
      url: "/pets/dog-treat-calories-daily-allowance",
      icon: "🍖",
    },
    {
      title: "Dog Weight-Loss Planner",
      url: "/pets/dog-weight-loss-planner",
      icon: "📉",
    },
  ];

  // --------------------------------------------------------------
  // JSON-LD FAQ (SEO)
  // --------------------------------------------------------------
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is it important to calculate calorie needs for puppies?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Puppies have much higher energy needs than adult dogs because they are growing rapidly and are usually very active. Estimating calorie requirements helps you avoid both underfeeding and overfeeding, supporting healthy growth and development.",
        },
      },
      {
        "@type": "Question",
        name: "How does predicted adult breed size affect puppy calorie needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Large-breed puppies grow over a longer period and can be more prone to orthopedic problems if they grow too fast. This calculator uses predicted adult size plus age to estimate weight and energy needs tailored to small, medium, or large breeds.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for puppies younger than 4 weeks?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "This tool is intended for puppies around 4 weeks of age and older. Very young neonate puppies require specialized feeding plans; always follow your veterinarian’s guidance for those age groups.",
        },
      },
      {
        "@type": "Question",
        name: "What if my puppy’s growth rate is faster or slower than average?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Growth curves represent typical averages. Some puppies grow faster and some slower. Regular weigh-ins, body condition scoring, and veterinary check-ups are essential to adjust feeding amounts over time.",
        },
      },
    ],
  };

  // --------------------------------------------------------------
  // WIDGET (FORM + RESULTADOS)
  // --------------------------------------------------------------
  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Dog className="h-5 w-5 text-sky-500" />
            Puppy Calorie Needs Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label
              htmlFor="ageWeeks"
              className="text-slate-700 dark:text-slate-300"
            >
              Puppy age (weeks)
            </Label>
            <Input
              id="ageWeeks"
              type="number"
              min={1}
              max={52}
              step={1}
              placeholder="e.g. 10"
              value={ageWeeks}
              onChange={(e) => setAgeWeeks(e.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter an age between 1 and 52 weeks. Very young neonates should be
              fed strictly under veterinary guidance.
            </p>
          </div>

          <div>
            <Label
              htmlFor="breedSize"
              className="text-slate-700 dark:text-slate-300"
            >
              Predicted adult breed size
            </Label>
            <select
              id="breedSize"
              value={breedSize}
              onChange={(e) =>
                setBreedSize(e.target.value as "small" | "medium" | "large")
              }
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="small">Small (5–10 kg adult)</option>
              <option value="medium">Medium (15–25 kg adult)</option>
              <option value="large">Large (30–45 kg adult)</option>
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Choose the category that best matches your puppy&apos;s expected
              adult size.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1"
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Estimate puppy calories
        </Button>
        <Button variant="outline" type="button" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {RER > 0 && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Estimated daily calories for your puppy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-4 w-4 text-indigo-500" />
                  Estimated puppy weight
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {estimatedPuppyWeight.toFixed(2)} kg
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Based on predicted adult size and growth curves for age.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  Resting Energy Requirement (RER)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatKcal(RER)} kcal/day
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Energy needed at rest in a thermoneutral environment.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Puppy Energy Requirement (PER)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                  {formatKcal(PER)} kcal/day
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Approximate daily calories to support healthy growth for this
                  age and predicted adult size.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 items-start p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-slate-800 dark:text-slate-100">
              These numbers are educational estimates based on typical growth
              curves. Puppies with medical conditions, unusual growth patterns
              or special diets may need a customized plan. Always confirm
              feeding decisions with your veterinarian.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // --------------------------------------------------------------
  // EDITORIAL (CONTEÚDO RICO)
  // --------------------------------------------------------------
  const editorial = (
    <div className="space-y-10">
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use the puppy calorie needs calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator estimates daily calorie needs for growing puppies
          using a combination of age, predicted adult size and established
          veterinary formulas. It helps you understand whether your puppy is
          likely getting enough energy to grow steadily without being
          overfed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          To get started, enter your puppy&apos;s age in weeks and choose the
          adult size category that best matches their breed or expected adult
          weight. The tool uses growth curves to estimate current weight,
          calculates Resting Energy Requirement (RER), then multiplies by a
          growth factor to estimate Puppy Energy Requirement (PER).
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Age:</strong> helps determine what fraction of adult weight
            your puppy has reached.
          </li>
          <li>
            <strong>Predicted adult size:</strong> small, medium or large
            categories change the estimated adult weight.
          </li>
          <li>
            <strong>Estimated weight:</strong> used to calculate RER via a
            metabolic body-weight formula.
          </li>
          <li>
            <strong>PER:</strong> about three times RER for many healthy
            puppies in active growth phases.
          </li>
        </ul>
      </section>

      <section
        id="growth-curves"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Puppy growth curves and energy needs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Unlike adult dogs, puppies gain weight rapidly and their calorie
          needs change every few weeks. Veterinary nutrition references often
          estimate puppy weight as a percentage of expected adult weight at
          different ages. For example, many puppies are around 25% of adult
          weight at 8 weeks and 40% at 12 weeks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator uses a simple growth-curve approach: it approximates
          the percentage of adult weight for your puppy&apos;s age and multiplies
          it by the predicted adult weight. That estimated current weight then
          feeds into the same metabolic equation used for adult dogs.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Keep in mind that individual puppies may grow faster or slower than
          these average curves. Regular weigh-ins at your veterinary clinic are
          the best way to confirm that your puppy&apos;s growth is on track.
        </p>
      </section>

      <section
        id="example"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Worked example: medium-breed puppy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          {example.scenario}
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-slate-700 dark:text-slate-300 mb-4">
          {example.steps.map((s) => (
            <li key={s.step}>
              <p>{s.description}</p>
              <p className="mt-1 font-mono bg-slate-100 dark:bg-slate-800 rounded px-3 py-2 text-sm">
                {s.calculation}
              </p>
            </li>
          ))}
        </ol>
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {example.result}
        </p>
      </section>

      <section
        id="faq"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Why is it important to estimate puppy calorie needs?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Too few calories can slow growth and impair immune function, while
              too many calories may contribute to excessive weight gain and
              orthopedic problems. Estimating calorie needs gives you a starting
              target so you can monitor body condition and adjust thoughtfully.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Do all breeds follow the same growth curve?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              No. Toy breeds, giant breeds and mixed-breed puppies can all grow
              at different rates. Growth-curve models are averages. Your vet
              may recommend more frequent weight checks for very small or very
              large breeds to keep growth on a safe path.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Should I change food type as my puppy grows?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Many commercial diets are labeled for specific life stages such as
              “growth” or “large-breed puppy.” These formulas are designed to
              provide appropriate nutrients when fed at the recommended amount.
              Your veterinarian can guide you on when to switch to an adult
              formula based on age, breed and body condition.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
              How often should I re-calculate my puppy’s calories?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              During rapid growth, recalculating every 2–4 weeks is helpful.
              Each time you update age and predicted adult size, compare the
              estimate with your vet&apos;s records and adjust portions if your
              puppy is gaining too slowly or too quickly.
            </p>
          </div>
        </div>
      </section>

      <section
        id="disclaimer"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Important disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is an educational tool and cannot replace a full
          veterinary nutrition assessment. It does not account for individual
          medical conditions, congenital issues or special dietary needs.
          Always consult your veterinarian before making major changes to your
          puppy&apos;s diet or feeding plan.
        </p>
      </section>

      <section
        id="references"
        className="border-t border-slate-200 dark:border-slate-700 pt-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          References & additional resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-growing-puppy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual – Nutrition of the Growing Puppy
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Detailed overview of nutritional requirements, growth and
                feeding strategies for puppies of different sizes.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://wsava.org/global-guidelines/global-nutrition-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                International guidelines that include recommendations for growth
                feeding, calorie estimation and body-condition scoring.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition_guidelines_final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                AAHA – Canine and Feline Nutritional Assessment Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical framework used by many clinics to assess diet,
                calories and body condition in growing and adult pets.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://vcahospitals.com/know-your-pet/nutrition-for-growing-puppies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                VCA Hospitals – Nutrition for Growing Puppies
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Owner-friendly article explaining how much and how often to feed
                puppies, plus tips for monitoring growth at home.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // --------------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------------
  return (
    <CalculatorVerticalLayout
      title="Puppy Calorie Needs by Age/Breed Size Calculator"
      description="Estimate daily calorie needs for growing puppies using age, predicted adult size and veterinary energy equations, so you can support healthy growth without overfeeding."
      widget={widget}
      editorial={editorial}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={jsonLd}
      icon={<Dog className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default PuppyCalorieNeedsAgeBreedSizeCalculator;
