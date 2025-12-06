import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Activity,
  Dog,
  HeartPulse,
  HelpCircle,
  Info,
  BookOpen,
} from "lucide-react";

type LifeStageKey =
  | "neuteredAdult"
  | "intactAdult"
  | "weightLoss"
  | "weightGain"
  | "puppyYoung"
  | "puppyOlder"
  | "senior";

interface LifeStageOption {
  key: LifeStageKey;
  label: string;
  description: string;
  factor: number;
}

const LIFE_STAGE_OPTIONS: LifeStageOption[] = [
  {
    key: "neuteredAdult",
    label: "Neutered adult – maintenance",
    description: "Most common scenario for healthy adult dogs living indoors.",
    factor: 1.6,
  },
  {
    key: "intactAdult",
    label: "Intact adult – maintenance",
    description: "Adult dog that has not been neutered/spayed.",
    factor: 1.8,
  },
  {
    key: "weightLoss",
    label: "Weight loss program",
    description: "For overweight dogs under vet-supervised weight-loss plans.",
    factor: 1.0,
  },
  {
    key: "weightGain",
    label: "Weight gain / active working dog",
    description: "For underweight, very active, or working dogs.",
    factor: 2.0,
  },
  {
    key: "puppyYoung",
    label: "Puppy 0–4 months",
    description: "Very young puppies with high growth energy needs.",
    factor: 3.0,
  },
  {
    key: "puppyOlder",
    label: "Puppy 4–12 months",
    description: "Growing puppies approaching adult size.",
    factor: 2.0,
  },
  {
    key: "senior",
    label: "Senior / low activity",
    description: "Older dogs with lower activity or mobility.",
    factor: 1.4,
  },
];

function pow075(valueKg: number): number {
  // Small helper for weight^0.75 with basic safeguards
  if (valueKg <= 0) return 0;
  return Math.pow(valueKg, 0.75);
}

export default function DogCalorieNeedsRerMerCalculator() {
  const [weightKg, setWeightKg] = useState<string>("");
  const [lifeStageKey, setLifeStageKey] = useState<LifeStageKey>("neuteredAdult");

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const selectedLifeStage = useMemo(
    () => LIFE_STAGE_OPTIONS.find((o) => o.key === lifeStageKey) ?? LIFE_STAGE_OPTIONS[0],
    [lifeStageKey]
  );

  const results = useMemo(() => {
    const wKg = parseFloat(weightKg.replace(",", "."));
    if (!wKg || wKg <= 0) {
      return {
        valid: false,
        rer: 0,
        mer: 0,
        lowerRange: 0,
        upperRange: 0,
      };
    }

    const rer = 70 * pow075(wKg);
    const mer = rer * selectedLifeStage.factor;

    // Provide a +/- 10% range around MER as a gentle adjustment range
    const lowerRange = mer * 0.9;
    const upperRange = mer * 1.1;

    return {
      valid: true,
      rer,
      mer,
      lowerRange,
      upperRange,
    };
  }, [weightKg, selectedLifeStage]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setWeightKg("");
    setLifeStageKey("neuteredAdult");
  };

  const formatCalories = (value: number): string => {
    if (!Number.isFinite(value) || value <= 0) return "—";
    return Math.round(value).toLocaleString("en-US");
  };

  const formatKcalPerDay = (value: number): string => {
    const base = formatCalories(value);
    if (base === "—") return base;
    return `${base} kcal/day`;
  };

  const widget = (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-slate-900/60 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-50">
            <Dog className="h-6 w-6 text-emerald-400" />
            Enter your dog's details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weightKg" className="text-sm font-medium text-slate-100">
              Current body weight
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                id="weightKg"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                placeholder="e.g. 12"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="h-12 text-lg"
              />
              <span className="text-sm font-medium text-slate-200 sm:mt-0">
                kg
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (1 kg ≈ 2.2 lb)
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Use your dog's current weight. For weight-loss planning, many vets prefer
              using the <span className="font-semibold">ideal</span> body weight instead
              of the current weight.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-100">
              Life stage & lifestyle factor
            </Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {LIFE_STAGE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setLifeStageKey(option.key)}
                  className={[
                    "flex flex-col items-start rounded-xl border px-3 py-2 text-left text-sm transition-all",
                    lifeStageKey === option.key
                      ? "border-emerald-400 bg-emerald-500/10 shadow-md"
                      : "border-slate-700/70 bg-slate-900/40 hover:border-emerald-400/70 hover:bg-slate-900"
                  ].join(" ")}
                >
                  <span className="font-semibold text-slate-50">
                    {option.label}
                  </span>
                  <span className="text-xs text-slate-400">{option.description}</span>
                  <span className="mt-1 text-[11px] font-mono uppercase tracking-wide text-emerald-300">
                    MER factor: ×{option.factor.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleCalculate}
              className="flex-1 h-11 gap-2 text-base font-semibold"
            >
              <Calculator className="h-4 w-4" />
              Calculate calorie needs
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="h-11 border-slate-600 text-sm text-slate-100 hover:bg-slate-800"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.valid && (
        <div ref={resultsRef} className="space-y-4">
          <Card className="border-0 bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-indigo-500/10 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-50">
                <HeartPulse className="h-6 w-6 text-emerald-300" />
                Recommended daily calories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-100">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-950/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Resting Energy Requirement (RER)
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatKcalPerDay(results.rer)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Baseline calories needed just to support vital functions at rest.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Maintenance Energy Requirement (MER)
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatKcalPerDay(results.mer)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Daily calories for{" "}
                    <span className="font-semibold">{selectedLifeStage.label}</span>.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Practical daily range
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatCalories(results.lowerRange)} –{" "}
                    {formatKcalPerDay(results.upperRange)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Many vets adjust within about ±10% depending on body condition and
                    activity.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                This calculator is an educational tool based on common veterinary
                formulas. Always work with your veterinarian to confirm the best calorie
                target, diet, and feeding schedule for your individual dog.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="how-to-use">
        <h2 className="mb-4 text-3xl font-bold text-slate-50">
          How to use this dog calorie needs calculator
        </h2>
        <p className="mb-3 text-slate-200">
          Keeping your dog at a healthy weight is one of the most powerful things you can
          do to protect their long-term health. Excess weight increases the risk of
          arthritis, diabetes, heart disease, breathing problems, and a shorter life
          span. On the other hand, underfeeding can lead to poor muscle mass, low energy,
          and nutrient deficiencies.
        </p>
        <p className="mb-3 text-slate-200">
          This calculator uses the standard veterinary formulas for{" "}
          <strong>Resting Energy Requirement (RER)</strong> and{" "}
          <strong>Maintenance Energy Requirement (MER)</strong> to estimate how many
          calories your dog needs per day. It is designed for{" "}
          <strong>healthy dogs over 4 months of age</strong> and should not replace a
          tailored nutrition plan from your veterinarian, especially if your dog has any
          medical condition.
        </p>
        <ol className="ml-4 list-decimal space-y-2 text-slate-200">
          <li>
            Enter your dog's <strong>current body weight in kilograms</strong>. If you are
            planning a weight-loss program, ask your vet what{" "}
            <strong>ideal weight</strong> to use.
          </li>
          <li>
            Select the <strong>life stage and lifestyle factor</strong> that best matches
            your dog (neutered adult, puppy, weight-loss plan, etc.).
          </li>
          <li>
            Click <strong>“Calculate calorie needs”</strong>. The tool will display RER,
            MER, and a practical calorie range per day.
          </li>
          <li>
            Use the result as a <strong>starting point</strong> and adjust gradually based
            on body condition score (BCS) and guidance from your vet.
          </li>
        </ol>
        <p className="mt-3 text-sm text-slate-400">
          Tip: If you currently feed commercial dog food, you can compare the result with
          the feeding guide printed on the bag or can. The difference helps you discuss
          with your vet whether your dog may be eating too much or too little.
        </p>
      </section>

      <section id="formula-variables">
        <h2 className="mb-4 text-3xl font-bold text-slate-50">
          Formula & variables used for RER and MER
        </h2>
        <p className="mb-3 text-slate-200">
          Most modern veterinary nutrition guidelines are based on metabolic body weight
          rather than a simple “calories per kilogram” rule. That is why you will see the
          exponent <code>0.75</code> in the formula below. It better reflects how a
          dog's metabolism scales with size.
        </p>
        <div className="rounded-2xl bg-slate-900/80 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Activity className="h-4 w-4" />
            Core formulas
          </div>
          <div className="space-y-3 text-sm text-slate-100">
            <p>
              <strong>Resting Energy Requirement (RER)</strong>
              <br />
              <code className="rounded bg-slate-950/60 px-2 py-1">
                RER = 70 × (Body weight in kg) ^ 0.75
              </code>
            </p>
            <p>
              <strong>Maintenance Energy Requirement (MER)</strong>
              <br />
              <code className="rounded bg-slate-950/60 px-2 py-1">
                MER = RER × Life-stage / activity factor
              </code>
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card className="border-slate-700/70 bg-slate-900/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-50">
                <Info className="h-5 w-5 text-emerald-300" />
                RER – the bare minimum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-200">
              <p>
                RER estimates the calories required to keep your dog alive at rest in a
                thermoneutral environment—essentially the energy for basic functions like
                breathing, circulation, and organ work.
              </p>
              <p>
                We almost never feed only the RER, because dogs move, play, digest food,
                and live in real homes with changing temperatures.
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-700/70 bg-slate-900/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-50">
                <HeartPulse className="h-5 w-5 text-emerald-300" />
                MER – real-life daily calories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-200">
              <p>
                MER multiplies RER by a factor that reflects the dog's life stage and
                activity level. An indoor neutered dog usually needs less energy than an
                intact working dog, even at the same weight.
              </p>
              <p>
                These factors are always approximations. Your dog's body condition and
                health history decide where in the range their true needs fall.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="understanding-factors">
        <h2 className="mb-4 text-3xl font-bold text-slate-50">
          Understanding life-stage factors and when to adjust calories
        </h2>
        <p className="mb-3 text-slate-200">
          The preset MER factors in this calculator come from common veterinary
          nutrition references. They are not rigid rules, but starting points that should
          always be combined with a{" "}
          <strong>body condition score (BCS)</strong> evaluation.
        </p>
        <ul className="ml-4 list-disc space-y-2 text-slate-200">
          <li>
            <strong>Neutered adults (factor ~1.6):</strong> Many indoor family dogs fit
            here. If your dog slowly gains weight over months, try feeding closer to the
            lower end of the range.
          </li>
          <li>
            <strong>Intact or very active adults (factor 1.8–2.2):</strong> Dogs that are
            not neutered, do regular sports, or work (herding, search and rescue) often
            need considerably more calories.
          </li>
          <li>
            <strong>Puppies:</strong> Growing dogs use huge amounts of energy to build
            bone, muscle, and organs. Very young puppies may need up to three times the
            RER. Never restrict a puppy's calories without direct veterinary supervision.
          </li>
          <li>
            <strong>Weight-loss plans:</strong> Vets often use a factor between 0.8 and
            1.0 × RER, based on the <em>ideal</em> weight. The goal is slow, steady loss
            while keeping your dog happy and energetic.
          </li>
          <li>
            <strong>Senior dogs:</strong> Some seniors slow down and need fewer calories;
            others lose muscle and may actually need <em>more</em> high-quality protein
            and carefully adjusted calories. Lab work and physical exams help decide.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-400">
          If you are not sure which factor to choose, start with the one that best
          matches your dog's lifestyle and then adjust the amount of food by 5–10% every
          few weeks based on weigh-ins and your vet's advice.
        </p>
      </section>

      <section id="examples">
        <h2 className="mb-4 text-3xl font-bold text-slate-50">
          Example: calorie needs for a 12 kg neutered adult dog
        </h2>
        <p className="mb-3 text-slate-200">
          Let's walk through a realistic scenario to show how the calculator's numbers
          are generated.
        </p>
        <ol className="ml-4 list-decimal space-y-2 text-slate-200">
          <li>
            A neutered adult dog weighs <strong>12 kg</strong> and lives mostly indoors
            with one daily walk and some play time.
          </li>
          <li>
            We choose the <strong>“Neutered adult – maintenance”</strong> factor of 1.6.
          </li>
          <li>
            First we calculate RER:
            <br />
            <code className="mt-1 block rounded bg-slate-900/80 px-3 py-1 text-sm">
              RER = 70 × 12^0.75 ≈ 70 × 6.6 ≈ 462 kcal/day
            </code>
          </li>
          <li>
            Then we calculate MER:
            <br />
            <code className="mt-1 block rounded bg-slate-900/80 px-3 py-1 text-sm">
              MER = 462 × 1.6 ≈ 739 kcal/day
            </code>
          </li>
          <li>
            We create a practical range of about ±10%:
            <br />
            <code className="mt-1 block rounded bg-slate-900/80 px-3 py-1 text-sm">
              Range ≈ 665 – 813 kcal/day
            </code>
          </li>
        </ol>
        <p className="mt-3 text-slate-200">
          If this dog slowly gains weight over the next months, we might drop closer to{" "}
          <strong>650 kcal/day</strong>. If they are losing weight or seem constantly
          hungry and thin, we might increase closer to <strong>800 kcal/day</strong>—but
          only after ruling out underlying medical issues with a veterinarian.
        </p>
      </section>

      <section id="faq">
        <h2 className="mb-4 text-3xl font-bold text-slate-50">
          Frequently asked questions about dog calorie needs
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-slate-50">
              <HelpCircle className="h-5 w-5 text-emerald-300" />
              Is this calculator a substitute for a vet visit?
            </h3>
            <p className="text-slate-200">
              No. This tool is an educational guide that uses standard veterinary
              formulas, but it cannot assess your dog's medical history, body condition,
              lab results, or special dietary needs. Always involve your veterinarian
              before starting a weight-loss or weight-gain plan, changing diets, or if
              your dog has any chronic disease such as diabetes, kidney disease, or heart
              problems.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-slate-50">
              <HelpCircle className="h-5 w-5 text-emerald-300" />
              Should I use current weight or ideal weight?
            </h3>
            <p className="text-slate-200">
              For most healthy dogs, you can start with the <strong>current weight</strong>{" "}
              and monitor their body condition. If your dog is clearly overweight, many
              vets prefer calculating calories based on <strong>ideal weight</strong>{" "}
              instead. They may use growth charts, breed standards, or BCS (body
              condition score) charts to estimate that number.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-slate-50">
              <HelpCircle className="h-5 w-5 text-emerald-300" />
              How quickly should my dog lose weight?
            </h3>
            <p className="text-slate-200">
              In most cases, safe weight loss is around{" "}
              <strong>1–2% of body weight per week</strong>. Faster loss can increase the
              risk of muscle loss, nutritional deficiencies, or other complications.
              Regular weigh-ins (every 2–4 weeks) and vet check-ins help keep the plan
              safe and effective.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-slate-50">
              <HelpCircle className="h-5 w-5 text-emerald-300" />
              Do treats and table scraps really matter?
            </h3>
            <p className="text-slate-200">
              Yes—treats, chews, and human snacks can easily add hundreds of calories
              per day, especially for small dogs. As a rule of thumb,{" "}
              <strong>no more than 10% of daily calories</strong> should come from treats.
              Use low-calorie training rewards, and avoid fatty leftovers like bacon,
              fried foods, or meat skin.
            </p>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-slate-50">
              <HelpCircle className="h-5 w-5 text-emerald-300" />
              What if my dog has a medical condition?
            </h3>
            <p className="text-slate-200">
              Dogs with diabetes, kidney disease, heart disease, pancreatitis, or other
              medical issues often need very specific nutrition plans. In those cases,
              this calculator is only a rough reference. Follow the exact diet and
              calorie plan recommended by your veterinarian or veterinary nutritionist.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          This calculator does not provide medical advice and is not intended to diagnose
          or treat any condition. Always consult a licensed veterinarian for professional
          guidance.
        </p>
      </section>

      <section id="references">
        <h2 className="mb-4 text-3xl font-bold text-slate-50">
          Official references & resources
        </h2>
        <p className="mb-3 text-slate-200">
          The formulas and factors used in this calculator are based on commonly cited
          veterinary nutrition guidelines. You can explore these resources to learn more
          about canine energy requirements and healthy weight management.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-slate-900/80 p-3">
            <BookOpen className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-slate-50">
                WSAVA Global Nutrition Toolkit
              </p>
              <p className="text-sm text-slate-300">
                Practical guidelines from the World Small Animal Veterinary Association on
                feeding healthy dogs and assessing body condition.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-900/80 p-3">
            <BookOpen className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-slate-50">
                AAHA Nutritional Assessment Guidelines for Dogs and Cats
              </p>
              <p className="text-sm text-slate-300">
                Step-by-step approach used by many veterinarians to evaluate diet,
                lifestyle, and appropriate calorie intake.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-900/80 p-3">
            <BookOpen className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-slate-50">
                Merck Veterinary Manual – Canine Obesity
              </p>
              <p className="text-sm text-slate-300">
                Overview of causes, health risks, and treatment strategies for obesity in
                dogs, including calorie restriction plans.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-900/80 p-3">
            <BookOpen className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-slate-50">
                ACVN (American College of Veterinary Nutrition)
              </p>
              <p className="text-sm text-slate-300">
                Professional organization of board-certified veterinary nutritionists
                offering resources on evidence-based feeding plans.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-900/80 p-3">
            <BookOpen className="mt-1 h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-slate-50">
                Veterinary partner articles on canine calorie needs
              </p>
              <p className="text-sm text-slate-300">
                Client-friendly explanations of how vets calculate RER, MER, and feeding
                plans for dogs at different life stages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Estimate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to plan daily calories for healthy weight, growth, or safe weight-loss programs."
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula-variables", label: "Formula & Variables" },
        { id: "understanding-factors", label: "Life-Stage Factors" },
        { id: "examples", label: "Examples" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        heading: "Dog calorie formulas (RER and MER)",
        description:
          "This calculator uses the standard veterinary equations for Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) based on metabolic body weight.",
        items: [
          {
            label: "Resting Energy Requirement (RER)",
            value: "RER = 70 × (Body weight in kg)^0.75",
          },
          {
            label: "Maintenance Energy Requirement (MER)",
            value: "MER = RER × life-stage / activity factor",
          },
        ],
        notes: [
          "RER estimates the calories needed to support essential body functions at rest.",
          "MER multiplies RER by a factor that reflects life stage and activity (for example, 1.6 for a neutered adult indoor dog).",
          "These formulas are starting points only. Your veterinarian may adjust calories based on body condition, health issues, and lab results.",
        ],
      }}
      example={{
        heading: "Worked example: 12 kg neutered adult dog",
        description:
          "A healthy neutered adult dog weighs 12 kg and lives mostly indoors with daily walks. We want to estimate daily calories for weight maintenance.",
        steps: [
          "Calculate RER: RER = 70 × 12^0.75 ≈ 70 × 6.6 ≈ 462 kcal/day.",
          "Choose the neutered adult maintenance factor: 1.6.",
          "Calculate MER: MER = 462 × 1.6 ≈ 739 kcal/day.",
          "Create a practical range of ±10% around MER: ≈ 665–813 kcal/day.",
          "Monitor body condition and adjust feeding by 5–10% every few weeks with guidance from your veterinarian.",
        ],
      }}
      relatedCalculators={[
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "⚖️",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "📉",
        },
        {
          title: "Puppy Calorie Needs by Age Calculator",
          url: "/pets/puppy-calorie-needs-by-age",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🍖",
        },
        {
          title: "Dog Protein & Fat Intake Guide",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🥩",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake",
          icon: "💧",
        },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={widget}
      editorial={editorial}
    />
  );
}
