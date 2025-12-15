import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalWeightMaintenanceGainLossPlannerCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // Current Weight (lbs or kg)
  // Target Weight (lbs or kg)
  // Activity Level (Low, Moderate, High)
  // Timeframe (weeks) to reach target weight
  const [inputs, setInputs] = useState({
    currentWeight: "",
    targetWeight: "",
    activityLevel: "moderate",
    timeframeWeeks: "",
  });

  // Activity factor mapping (typical for small mammals)
  const activityFactors: Record<string, number> = {
    low: 1.2,
    moderate: 1.4,
    high: 1.6,
  };

  // 2. LOGIC ENGINE
  // Formula basis:
  // RER (Resting Energy Requirement) = 70 * (Weight_kg)^0.75
  // MER (Maintenance Energy Requirement) = RER * Activity Factor
  // Calorie adjustment for gain/loss = (TargetWeight - CurrentWeight) * 30 kcal/day per kg change (approximate)
  // Daily calorie target = MER + (Calorie adjustment / days)
  // days = timeframeWeeks * 7
  // Output kcal/day rounded

  const results = useMemo(() => {
    const cw = parseFloat(inputs.currentWeight);
    const tw = parseFloat(inputs.targetWeight);
    const tf = parseFloat(inputs.timeframeWeeks);
    if (
      isNaN(cw) ||
      isNaN(tw) ||
      isNaN(tf) ||
      cw <= 0 ||
      tw <= 0 ||
      tf <= 0 ||
      !(inputs.activityLevel in activityFactors)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to kg if imperial
    const currentWeightKg = unit === "imperial" ? cw / 2.20462 : cw;
    const targetWeightKg = unit === "imperial" ? tw / 2.20462 : tw;

    // Calculate RER
    const RER = 70 * Math.pow(currentWeightKg, 0.75);

    // Activity factor
    const AF = activityFactors[inputs.activityLevel];

    // Maintenance Energy Requirement
    const MER = RER * AF;

    // Weight difference
    const weightDiff = targetWeightKg - currentWeightKg;

    // Total calorie adjustment needed (approx 30 kcal per kg per day for gain/loss)
    // This is a simplified estimate for small mammals; actual needs vary by species/metabolism.
    const totalCalorieChange = weightDiff * 30 * tf * 7; // total kcal change over timeframe

    // Daily calorie adjustment
    const dailyCalorieAdjustment = totalCalorieChange / (tf * 7);

    // Final daily calorie target
    const dailyCalories = MER + dailyCalorieAdjustment;

    // Warning if timeframe is too short for safe weight change
    let warning = null;
    const maxSafeRateKgPerWeek = 0.05 * currentWeightKg; // 5% per week typical safe max
    const requestedRate = Math.abs(weightDiff) / tf;
    if (requestedRate > maxSafeRateKgPerWeek) {
      warning =
        "The requested weight change rate exceeds typical safe guidelines (5% per week). Consult your veterinarian before proceeding.";
    }

    return {
      value: Math.round(dailyCalories),
      label: "Daily Calorie Target (kcal/day)",
      subtext:
        weightDiff === 0
          ? "Calorie intake to maintain current weight."
          : weightDiff > 0
          ? `Calorie intake to support controlled weight gain of ${weightDiff.toFixed(2)} kg over ${tf} weeks.`
          : `Calorie intake to support controlled weight loss of ${Math.abs(weightDiff).toFixed(2)} kg over ${tf} weeks.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to plan weight changes gradually in small mammals?",
      answer:
        "Gradual weight changes are crucial to avoid metabolic stress and health complications in small mammals. Rapid weight loss or gain can lead to nutritional deficiencies, organ strain, or behavioral issues. Planning controlled changes ensures the animal’s body adapts safely, maintaining overall well-being and preventing rebound weight fluctuations.",
    },
    {
      question: "How does activity level affect calorie requirements for weight maintenance?",
      answer:
        "Activity level significantly influences the total calories an animal needs daily. More active small mammals burn more energy, requiring higher calorie intake to maintain weight. Conversely, sedentary animals need fewer calories to avoid unwanted weight gain, so adjusting intake based on activity helps maintain optimal body condition.",
    },
    {
      question: "What factors can affect the accuracy of this calorie planner?",
      answer:
        "Several factors can influence the accuracy, including species-specific metabolism, age, health status, and environmental conditions. This planner uses generalized formulas that may not capture individual variations. Therefore, regular monitoring and veterinary consultation are essential to adjust plans based on actual weight trends and health observations.",
    },
    {
      question: "Why do we use the formula RER = 70 * (Weight_kg)^0.75 in this calculator?",
      answer:
        "The Resting Energy Requirement (RER) formula estimates the baseline energy an animal needs at rest, accounting for metabolic body size rather than linear weight. The exponent 0.75 reflects metabolic scaling across species, providing a more accurate energy estimate than simple weight multiplication. This foundational value is then adjusted for activity and weight goals to tailor calorie needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.currentWeight}
            onChange={(e) => setInputs((prev) => ({ ...prev, currentWeight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter target weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.targetWeight}
            onChange={(e) => setInputs((prev) => ({ ...prev, targetWeight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(val) => setInputs((prev) => ({ ...prev, activityLevel: val }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timeframeWeeks" className="text-slate-700 dark:text-slate-300">
            Timeframe to Reach Target Weight (weeks)
          </Label>
          <Input
            id="timeframeWeeks"
            type="number"
            min="1"
            step="1"
            placeholder="Enter number of weeks"
            value={inputs.timeframeWeeks}
            onChange={(e) => setInputs((prev) => ({ ...prev, timeframeWeeks: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWeight: "",
              targetWeight: "",
              activityLevel: "moderate",
              timeframeWeeks: "",
            })
          }
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
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
          Understanding Weight Maintenance vs. Gain/Loss Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Weight management in small mammals is a delicate balance that requires precise planning and monitoring. This planner helps veterinarians and pet owners estimate daily calorie needs to maintain, gain, or lose weight safely. By integrating metabolic principles with activity levels and realistic timeframes, it provides a tailored approach to nutritional management. Understanding these factors is essential to prevent health complications related to improper feeding.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core of this tool relies on the Resting Energy Requirement (RER), which estimates the baseline energy expenditure based on metabolic body size rather than simple weight. Adjusting RER by activity factors and weight change goals allows for a dynamic calorie target that supports physiological needs. This method respects the unique metabolic rates of small mammals, which can vary widely between species and individuals. It also emphasizes gradual weight changes to promote long-term health and avoid metabolic stress.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the planner accounts for the timeframe over which weight changes are desired, ensuring that calorie adjustments are spread safely over days and weeks. Rapid weight fluctuations can be harmful, so this tool flags potentially unsafe rates of change to encourage veterinary consultation. Ultimately, this planner serves as a high-authority veterinary resource that combines scientific rigor with practical application to optimize small mammal care.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this planner effectively, begin by selecting the unit system that matches your measurement preference—Imperial (lbs) or Metric (kg). Enter the current weight of the small mammal, followed by the target weight you wish to achieve. Choose the animal’s typical activity level, which influences calorie needs, and specify the timeframe in weeks to reach the target weight. The calculator then estimates the daily calorie intake required to maintain or adjust weight safely.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the current weight of your small mammal in the selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Input the desired target weight you want your pet to reach.
          </li>
          <li>
            <strong>Step 3:</strong> Select the activity level that best describes your pet’s daily routine.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the number of weeks over which you plan to achieve the weight goal.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the recommended daily calorie intake and review any safety warnings.
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
              href="https://www.merckvetmanual.com/nutrition/energy-requirements-of-animals/energy-requirements-of-small-mammals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Energy Requirements of Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of energy metabolism and nutritional needs for small mammal species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition_guidelines_for_small_mammals.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association - Nutrition Guidelines for Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines for assessing and managing nutrition in small mammal patients, including weight management strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466089/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information - Metabolic Rate and Energy Requirements in Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Research article detailing metabolic scaling and energy expenditure relevant to veterinary nutrition.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Weight Maintenance vs. Gain/Loss Planner"
      description="Plan calorie targets for weight maintenance, controlled weight gain, or safe weight loss for small mammals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Calories = (70 × Weight_kg^0.75 × Activity Factor) + ((TargetWeight_kg - CurrentWeight_kg) × 30 kcal ÷ Days)",
        variables: [
          { symbol: "Weight_kg", description: "Current body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level (e.g., 1.2–1.6)" },
          { symbol: "TargetWeight_kg", description: "Desired body weight in kilograms" },
          { symbol: "CurrentWeight_kg", description: "Current body weight in kilograms" },
          { symbol: "Days", description: "Total days in the timeframe to reach target weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) rabbit with moderate activity wants to gain 0.5 kg over 10 weeks. Calculate daily calorie needs.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (already 1 kg). Calculate RER = 70 × 1^0.75 = 70 kcal.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate activity (1.4): MER = 70 × 1.4 = 98 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Calculate calorie adjustment: weight gain = 0.5 kg × 30 kcal × 70 days = 1050 kcal total; daily adjustment = 1050 ÷ 70 = 15 kcal/day.",
          },
          {
            label: "4",
            explanation:
              "Add adjustment to MER: 98 + 15 = 113 kcal/day recommended for controlled weight gain.",
          },
        ],
        result: "Daily calorie target is approximately 113 kcal/day to safely gain 0.5 kg in 10 weeks.",
      }}
      relatedCalculators={[
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Ideal Humidity Range Calculator", url: "/pets/reptile-ideal-humidity-range", icon: "🐶" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Environmental Enrichment Planner (per room)", url: "/pets/cat-environmental-enrichment-planner", icon: "🍖" },
        { title: "Cat Body Condition Score Helper (BCS → Target Plan)", url: "/pets/cat-body-condition-score-bcs-target", icon: "🐱" },
        { title: "Horse Weight Estimator (Heart Girth & Length)", url: "/pets/horse-weight-estimator-girth-length", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Weight Maintenance vs. Gain/Loss Planner" },
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