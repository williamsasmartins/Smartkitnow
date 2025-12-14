import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function KittenWeaningTimelineFeedingAmountsCalculator() {
  // 1. STATE
  // No unit switcher needed because this is time/age based
  // Inputs: kitten age in weeks, current weight (lbs or kg), feeding frequency per day
  // Default unit: imperial (lbs)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    ageWeeks: "",
    weight: "",
    feedingsPerDay: "",
  });

  // 2. LOGIC ENGINE
  // Feeding amount calculation based on age and weight:
  // Typical feeding amount (grams per feeding) = (RER kcal/day) / kcal per gram food / feedings per day
  // RER (Resting Energy Requirement) = 70 * (weight in kg)^0.75
  // Kitten energy needs are approx 2x RER during weaning (growth phase)
  // kcal per gram of typical kitten wet food ~1 kcal/g (approximate)
  // We calculate total daily kcal = 2 * RER
  // Feeding amount per feeding (grams) = total daily kcal / kcal per gram / feedings per day
  // We convert weight input to kg if imperial

  const results = useMemo(() => {
    const age = parseFloat(inputs.ageWeeks);
    const weightInput = parseFloat(inputs.weight);
    const feedings = parseInt(inputs.feedingsPerDay);

    if (
      isNaN(age) ||
      age < 3 || // weaning starts ~3 weeks
      age > 12 || // weaning usually ends ~12 weeks
      isNaN(weightInput) ||
      weightInput <= 0 ||
      isNaN(feedings) ||
      feedings <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid age (3-12 weeks), weight (>0), and feedings per day (>0).",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightInput / 2.20462 : weightInput;

    // Calculate RER
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Growth factor multiplier for kittens during weaning (approx 2x RER)
    const growthFactor = 2;

    // Total daily kcal needed
    const dailyKcal = RER * growthFactor;

    // kcal per gram of typical wet kitten food ~1 kcal/g (approximate)
    const kcalPerGram = 1;

    // Feeding amount per feeding in grams
    const gramsPerFeeding = dailyKcal / kcalPerGram / feedings;

    // Convert grams to ounces if imperial for output
    const feedingAmount =
      unit === "imperial"
        ? (gramsPerFeeding / 28.3495).toFixed(2) + " oz"
        : gramsPerFeeding.toFixed(1) + " g";

    // Age context message
    let ageContext = "";
    if (age < 4) {
      ageContext =
        "At this early weaning stage, kittens still rely heavily on mother's milk or milk replacer, with gradual introduction of soft foods.";
    } else if (age < 8) {
      ageContext =
        "Mid-weaning kittens increase solid food intake and require frequent feeding to support rapid growth and development.";
    } else {
      ageContext =
        "By 8-12 weeks, kittens transition mostly to solid food and feeding frequency can be gradually reduced.";
    }

    return {
      value: feedingAmount,
      label: `Recommended Feeding Amount per Feeding (${feedings} times/day)`,
      subtext: ageContext,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the kitten weaning timeline important for feeding?",
      answer:
        "The weaning timeline is critical because kittens transition from a solely milk-based diet to solid foods during this period. Proper timing ensures they receive adequate nutrition for growth while avoiding digestive upset. Understanding this timeline helps caregivers introduce appropriate food textures and feeding frequencies to support healthy development.",
    },
    {
      question: "How do I determine the correct feeding amounts during weaning?",
      answer:
        "Feeding amounts are based on the kitten’s weight, age, and energy requirements, which are higher during growth phases. This calculator uses resting energy requirements multiplied by a growth factor to estimate daily caloric needs, then divides by feeding frequency. This approach ensures kittens receive sufficient calories without overfeeding, promoting optimal growth.",
    },
    {
      question: "Can I feed my kitten less frequently as it grows?",
      answer:
        "Yes, as kittens mature and their digestive systems develop, feeding frequency can be gradually reduced from multiple small meals to fewer, larger meals. Early in weaning, frequent feeding supports energy needs and digestion, but by 8-12 weeks, kittens can handle less frequent feeding. Adjustments should be made carefully to avoid hunger or overeating.",
    },
    {
      question: "What type of food should I use during the weaning period?",
      answer:
        "During weaning, kittens should be offered soft, easily digestible foods such as wet kitten food or softened dry kibble mixed with water or formula. This helps ease the transition from milk to solids and encourages acceptance of new textures. High-quality, nutrient-dense foods formulated for kittens support their rapid growth and immune development.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
            Kitten Age (weeks)
          </Label>
          <Input
            id="ageWeeks"
            type="number"
            min={3}
            max={12}
            step={0.1}
            placeholder="e.g. 6"
            value={inputs.ageWeeks}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, ageWeeks: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Kitten Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0.1}
            step={0.01}
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 1.1"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="feedingsPerDay"
            className="text-slate-700 dark:text-slate-300"
          >
            Feedings Per Day
          </Label>
          <Input
            id="feedingsPerDay"
            type="number"
            min={1}
            max={12}
            step={1}
            placeholder="e.g. 4"
            value={inputs.feedingsPerDay}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, feedingsPerDay: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ ageWeeks: "", weight: "", feedingsPerDay: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for personalized diagnosis and feeding plans.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Kitten Weaning Timeline & Feeding Amounts
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The kitten weaning timeline marks the critical transition period when kittens
          move from exclusive nursing to consuming solid foods. This phase typically
          begins around three weeks of age and continues until about twelve weeks,
          during which kittens gradually develop the ability to digest and metabolize
          more complex nutrients. Proper understanding of this timeline is essential
          for ensuring kittens receive adequate nutrition to support their rapid growth
          and immune system development.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Feeding amounts during weaning must be carefully calibrated to meet the
          kitten’s increasing energy demands without overwhelming their immature
          digestive systems. Energy requirements during this phase are approximately
          double the resting energy requirement (RER) due to rapid growth and activity.
          Dividing daily caloric needs into multiple small feedings helps optimize
          nutrient absorption and maintain stable blood glucose levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the texture and type of food offered evolve throughout the
          weaning period. Early on, kittens benefit from softened or wet foods that
          mimic the consistency of milk, gradually progressing to firmer solids as
          their teeth and digestive capabilities mature. Monitoring weight gain and
          feeding tolerance during this timeline is crucial to adjust feeding amounts
          and frequency appropriately.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the recommended feeding amount per feeding for a
          kitten during the weaning period based on its age, weight, and feeding
          frequency. By inputting these parameters, you receive a scientifically
          grounded guideline to support healthy growth and development. The calculator
          assumes typical energy needs and food caloric density, so adjustments may be
          necessary based on specific food types or veterinary advice.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the kitten’s age in weeks (between 3 and 12).
          </li>
          <li>
            <strong>Step 2:</strong> Input the kitten’s current weight in pounds or
            kilograms, depending on the unit system.
          </li>
          <li>
            <strong>Step 3:</strong> Specify how many times per day you plan to feed
            the kitten.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended feeding
            amount per meal, along with contextual guidance based on the kitten’s age.
          </li>
          <li>
            <strong>Step 5:</strong> Use this information to plan feeding schedules and
            portion sizes, adjusting as needed with veterinary consultation.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/feeding-and-nutrition-of-kittens/weaning-and-feeding-kittens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Weaning and Feeding Kittens
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on kitten nutrition during weaning, including
              energy requirements and feeding strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-kittens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Feeding Kittens
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on feeding schedules, food types, and nutritional needs for
              growing kittens.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition_guidelines_for_dogs_and_cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for feeding growing kittens, including
              energy requirements and feeding frequency.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Kitten Weaning Timeline & Feeding Amounts"
      description="Planner for the transition from mother's milk to solid food, calculating appropriate feeding amounts at each stage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Feeding Amount per Feeding (g) = (2 × 70 × Weight(kg)^0.75) / Feedings per Day",
        variables: [
          { symbol: "Weight(kg)", description: "Kitten body weight in kilograms" },
          {
            symbol: "Feedings per Day",
            description: "Number of feeding sessions per day",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 6-week-old kitten weighing 2.5 lbs is fed 4 times daily. Calculate the feeding amount per meal.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 2.5 lbs ÷ 2.20462 = 1.13 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate RER: 70 × (1.13)^0.75 ≈ 70 × 1.03 = 72 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Multiply by growth factor: 72 × 2 = 144 kcal/day needed.",
          },
          {
            label: "4",
            explanation:
              "Divide by feedings per day: 144 ÷ 4 = 36 grams per feeding.",
          },
        ],
        result:
          "Recommended feeding amount is approximately 36 grams (1.27 oz) per feeding, 4 times daily.",
      }}
      relatedCalculators={[
        {
          title: "Dog Alcohol/Ethanol Exposure Risk Calculator",
          url: "/pets/dog-alcohol-ethanol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Xylitol Exposure Risk Calculator",
          url: "/pets/dog-xylitol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Ideal Weight & Target Calories for Cats",
          url: "/pets/cat-ideal-weight-target-calories",
          icon: "🐱",
        },
        {
          title: "Exercise Time Planner (Run Time per Day)",
          url: "/pets/small-mammal-exercise-time-planner",
          icon: "🍖",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Cat Body Condition Score Helper (BCS → Target Plan)",
          url: "/pets/cat-body-condition-score-bcs-target",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Kitten Weaning Timeline & Feeding Amounts",
        },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}