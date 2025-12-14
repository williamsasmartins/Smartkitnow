import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseFeedingRateForageConcentrateCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight, forage percentage, total daily intake %
  // weight = body weight of horse
  // foragePercent = % of total intake as forage (hay/grass)
  // totalIntakePercent = % of body weight fed daily (forage + concentrate)
  const [inputs, setInputs] = useState({
    weight: "",
    foragePercent: "",
    totalIntakePercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const foragePercentRaw = parseFloat(inputs.foragePercent);
    const totalIntakePercentRaw = parseFloat(inputs.totalIntakePercent);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(foragePercentRaw) ||
      foragePercentRaw < 0 ||
      foragePercentRaw > 100 ||
      isNaN(totalIntakePercentRaw) ||
      totalIntakePercentRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers. Forage % must be between 0 and 100.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Total daily intake in kg = totalIntakePercent% of body weight
    const totalIntakeKg = (totalIntakePercentRaw / 100) * weightKg;

    // Forage intake in kg
    const forageKg = (foragePercentRaw / 100) * totalIntakeKg;

    // Concentrate intake in kg
    const concentrateKg = totalIntakeKg - forageKg;

    // Convert results back to user unit
    const forage = unit === "imperial" ? forageKg * 2.20462 : forageKg;
    const concentrate = unit === "imperial" ? concentrateKg * 2.20462 : concentrateKg;

    return {
      value: 0,
      label: "",
      subtext: "",
      warning: null,
      forage: forage.toFixed(2),
      concentrate: concentrate.toFixed(2),
      totalIntake: (unit === "imperial" ? totalIntakeKg * 2.20462 : totalIntakeKg).toFixed(2),
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to balance forage and concentrate in a horse's diet?",
      answer:
        "Balancing forage and concentrate is essential because forage provides fiber necessary for healthy digestion, while concentrates supply additional energy and nutrients. Too much concentrate can lead to digestive upset or metabolic disorders, whereas insufficient forage can cause behavioral issues and poor gut motility. Proper balance ensures optimal health, performance, and weight maintenance in horses.",
    },
    {
      question: "How does body weight influence the feeding rate calculation?",
      answer:
        "Body weight is the foundation for calculating feeding rates because nutrient requirements scale with size. Feeding rates are typically expressed as a percentage of body weight to ensure horses receive adequate energy without overfeeding. Accurate weight measurement helps prevent underfeeding or obesity, both of which can compromise health and performance.",
    },
    {
      question: "What factors affect the total daily intake percentage used in this calculator?",
      answer:
        "Total daily intake percentage varies based on the horse's age, workload, metabolic rate, and health status. For example, performance horses or lactating mares require higher intake percentages, while idle or overweight horses need less. This calculator allows adjustment of intake percentage to tailor feeding plans to individual needs, promoting optimal nutrition.",
    },
    {
      question: "Why do we convert weights between imperial and metric units internally?",
      answer:
        "Converting weights internally ensures consistent and accurate calculations regardless of the unit system used by the user. Metric units (kilograms) are standard in veterinary nutrition formulas, so inputs in pounds are converted to kilograms for precise math. Results are then converted back to the user's preferred unit for clarity and usability.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="foragePercent" className="text-slate-700 dark:text-slate-300">
            Forage Percentage of Total Intake (%)
          </Label>
          <Input
            id="foragePercent"
            type="number"
            min={0}
            max={100}
            step="any"
            placeholder="e.g. 70"
            value={inputs.foragePercent}
            onChange={(e) => setInputs((prev) => ({ ...prev, foragePercent: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="totalIntakePercent" className="text-slate-700 dark:text-slate-300">
            Total Daily Intake (% of Body Weight)
          </Label>
          <Input
            id="totalIntakePercent"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 2.5"
            value={inputs.totalIntakePercent}
            onChange={(e) => setInputs((prev) => ({ ...prev, totalIntakePercent: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state with same values
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", foragePercent: "", totalIntakePercent: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
        </div>
      )}

      {!results.warning && results.forage && results.concentrate && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Feeding Rates
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-1">
                Forage: {results.forage} {unit === "imperial" ? "lbs" : "kg"}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-4">
                Concentrate: {results.concentrate} {unit === "imperial" ? "lbs" : "kg"}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Total Intake: {results.totalIntake} {unit === "imperial" ? "lbs" : "kg"} per day
              </p>
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and feeding plans.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Feeding Rate Calculator (Forage + Concentrate)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Feeding Rate Calculator (Forage + Concentrate) is a veterinary tool designed to estimate the daily amounts of forage and concentrated feed a horse requires based on its body weight and nutritional needs. Forage, such as hay or pasture grass, forms the foundation of a horse’s diet by providing essential fiber that supports healthy digestion and gut motility. Concentrates, including grains and pelleted feeds, supply additional energy and nutrients necessary for horses with higher metabolic demands or specific health conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses scientifically accepted feeding rate percentages relative to body weight to determine the total daily intake and then divides this into forage and concentrate portions according to user-defined ratios. By inputting the horse’s weight, the desired total daily intake as a percentage of body weight, and the proportion of forage in the diet, caretakers can generate precise feeding recommendations. This approach helps prevent common nutritional issues such as overfeeding concentrates, which can lead to colic or laminitis, and underfeeding forage, which can cause digestive disturbances and behavioral problems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator supports both imperial and metric units, converting inputs internally to maintain accuracy and consistency with veterinary nutritional standards. It is an essential tool for veterinarians, equine nutritionists, and horse owners aiming to optimize feeding strategies tailored to individual horses’ needs, workloads, and health statuses. Proper feeding management promotes overall equine wellness, performance, and longevity.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, begin by selecting the unit system that matches your measurement preference—imperial (pounds) or metric (kilograms). Next, enter the horse’s current body weight accurately, as this is the basis for all feeding rate calculations. Then, specify the percentage of the total daily intake that should come from forage, reflecting the horse’s dietary needs and management goals.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Input the horse’s body weight in the chosen unit system. Accurate weight measurement is critical for precise feeding recommendations.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the forage percentage of the total daily intake. This value typically ranges from 50% to 100%, depending on the horse’s diet and health.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the total daily intake as a percentage of body weight. Common values range from 1.5% to 3%, adjusted for workload, age, and condition.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to generate the estimated daily amounts of forage and concentrate feed. Review the results and adjust inputs as necessary to meet your horse’s specific needs.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://aaep.org/guidelines/feeding-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AAEP Feeding Guidelines for Horses
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines from the American Association of Equine Practitioners on balanced feeding practices for horses, emphasizing forage and concentrate ratios.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/11705/feeding-horses-nutrition-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Extension.org - Feeding Horses: Nutrition Basics
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing the nutritional requirements of horses, including the importance of forage and concentrate balance in daily rations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/feeding-and-nutrition-of-horses/feeding-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual - Feeding Horses
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual covering feeding strategies, nutrient requirements, and common feeding-related disorders in horses.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Feeding Rate Calculator (Forage + Concentrate)"
      description="Calculate the required daily feeding rate for both forage (hay/grass) and concentrated feeds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Intake (kg) = Body Weight (kg) × Total Intake %; Forage (kg) = Total Intake × Forage %",
        variables: [
          { symbol: "Body Weight (kg)", description: "Horse's body weight in kilograms" },
          { symbol: "Total Intake %", description: "Total daily feed intake as a percentage of body weight" },
          { symbol: "Forage %", description: "Percentage of total intake that is forage" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires 2.5% of its body weight in total daily feed, with 70% of that as forage and 30% as concentrate.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 1100 lbs to kg: 1100 ÷ 2.20462 ≈ 499 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate total intake: 499 kg × 2.5% = 12.475 kg total feed per day.",
          },
          {
            label: "3",
            explanation:
              "Calculate forage: 12.475 kg × 70% = 8.73 kg forage per day.",
          },
          {
            label: "4",
            explanation:
              "Calculate concentrate: 12.475 kg × 30% = 3.74 kg concentrate per day.",
          },
        ],
        result:
          "The horse should receive approximately 8.73 kg (19.24 lbs) of forage and 3.74 kg (8.25 lbs) of concentrate daily.",
      }}
      relatedCalculators={[
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        { title: "Exercise Time Planner (Run Time per Day)", url: "/pets/small-mammal-exercise-time-planner", icon: "🐶" },
        { title: "Horse Hay Intake Calculator (per body weight %)", url: "/pets/horse-hay-intake-bodyweight-percent", icon: "🐎" },
        { title: "Ammonia-to-Nitrite Cycle Time Estimator", url: "/pets/aquarium-ammonia-nitrite-cycle-time", icon: "🍖" },
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Feeding Rate Calculator (Forage + Concentrate)" },
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