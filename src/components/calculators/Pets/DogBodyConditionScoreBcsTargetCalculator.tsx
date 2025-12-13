import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogBodyConditionScoreBcsTargetCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    currentBcs: "",
    targetBcs: "",
  });

  // Validate BCS input (1-9 scale)
  const isValidBcs = (val: string) => {
    const n = parseInt(val);
    return n >= 1 && n <= 9;
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const currentBcsRaw = parseInt(inputs.currentBcs);
    const targetBcsRaw = parseInt(inputs.targetBcs);

    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !isValidBcs(inputs.currentBcs) ||
      !isValidBcs(inputs.targetBcs)
    ) {
      return {
        value: 0,
        label: "Enter valid details to calculate target weight and plan.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const currentWeightKg = unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;

    // Body Condition Score scale is 1 (emaciated) to 9 (obese)
    // Ideal BCS is usually 4-5
    // Weight is roughly proportional to BCS (linear approx)
    // Target Weight = Current Weight * (Target BCS / Current BCS)
    // This assumes fat mass changes proportionally with BCS score

    const targetWeightKg = currentWeightKg * (targetBcsRaw / currentBcsRaw);

    // Calculate Resting Energy Requirement (RER) for target weight
    // RER = 70 * (weight in kg)^0.75
    const rerTarget = 70 * Math.pow(targetWeightKg, 0.75);

    // Calculate Maintenance Energy Requirement (MER) for target weight
    // MER = RER * activity factor (typical 1.4 for neutered adult dogs)
    const activityFactor = 1.4;
    const merTarget = rerTarget * activityFactor;

    // Convert target weight back to user unit
    const targetWeightDisplay = unit === "imperial" ? targetWeightKg * 2.20462 : targetWeightKg;

    // Round results
    const targetWeightRounded = Math.round(targetWeightDisplay * 10) / 10;
    const rerRounded = Math.round(rerTarget);
    const merRounded = Math.round(merTarget);

    // Warning if target BCS is outside ideal range
    let warning = null;
    if (targetBcsRaw < 4 || targetBcsRaw > 5) {
      warning =
        "Target BCS is outside the ideal range (4-5). Consult your veterinarian for a tailored plan.";
    }

    return {
      value: targetWeightRounded,
      label: `Target Weight (${unit === "imperial" ? "lbs" : "kg"})`,
      subtext: `Estimated daily calorie needs at target weight: RER ≈ ${rerRounded} kcal, MER ≈ ${merRounded} kcal`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is the Body Condition Score (BCS) and why is it important?",
      answer:
        "The Body Condition Score (BCS) is a standardized 9-point scale used by veterinarians to assess a dog's fat stores and overall body condition. It helps identify if a dog is underweight, ideal, overweight, or obese. Understanding BCS is crucial because maintaining an ideal body condition reduces the risk of health problems such as diabetes, arthritis, and cardiovascular disease. It guides nutrition and weight management plans tailored to the dog's needs.",
    },
    {
      question: "How does this calculator estimate my dog’s target weight based on BCS?",
      answer:
        "This calculator uses a proportional relationship between your dog’s current weight and Body Condition Score to estimate a target weight corresponding to your desired BCS. Since BCS reflects fat accumulation, adjusting weight proportionally helps set realistic goals. The formula assumes linear scaling: Target Weight = Current Weight × (Target BCS / Current BCS). This method provides a practical starting point for weight management under veterinary supervision.",
    },
    {
      question: "Why do we calculate Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER)?",
      answer:
        "RER represents the calories a dog needs at rest to maintain vital body functions, calculated as 70 × (weight in kg)^0.75. MER accounts for additional energy expenditure from daily activities and is derived by multiplying RER by an activity factor (typically 1.4 for neutered adult dogs). These calculations help determine appropriate daily calorie intake to achieve or maintain the target weight safely and effectively.",
    },
    {
      question: "Can I use this tool for all dog breeds and ages?",
      answer:
        "While this tool provides a general guideline for adult dogs, individual needs may vary based on breed, age, health status, and activity level. Puppies, senior dogs, or dogs with medical conditions require specialized nutritional plans. Always consult your veterinarian before making significant changes to your dog’s diet or weight management plan to ensure safety and effectiveness tailored to your pet’s unique requirements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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
              onChange={(e) => handleInputChange("currentWeight", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="currentBcs" className="text-slate-700 dark:text-slate-300">
              Current Body Condition Score (1-9)
            </Label>
            <Input
              id="currentBcs"
              type="number"
              min="1"
              max="9"
              step="1"
              placeholder="Enter current BCS (1-9)"
              value={inputs.currentBcs}
              onChange={(e) => handleInputChange("currentBcs", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="targetBcs" className="text-slate-700 dark:text-slate-300">
              Target Body Condition Score (1-9)
            </Label>
            <Input
              id="targetBcs"
              type="number"
              min="1"
              max="9"
              step="1"
              placeholder="Enter target BCS (1-9)"
              value={inputs.targetBcs}
              onChange={(e) => handleInputChange("targetBcs", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentWeight: "", currentBcs: "", targetBcs: "" })}
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
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Body Condition Score Helper (BCS → Target Plan)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Body Condition Score (BCS) is a veterinary tool used to assess a dog’s fat stores and overall body condition on a standardized 9-point scale, ranging from 1 (emaciated) to 9 (obese). This scoring system provides a practical and visual method to evaluate whether a dog is underweight, ideal, overweight, or obese. It is widely used by veterinarians and pet owners to monitor health and guide nutritional management.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Maintaining an ideal BCS, typically between 4 and 5, is critical for a dog’s long-term health and wellbeing. Dogs with a BCS outside this range are at increased risk of metabolic disorders, joint problems, and reduced lifespan. This helper tool translates your dog’s current BCS and weight into a target weight plan, enabling you to set realistic goals for weight loss or gain. It incorporates veterinary nutritional science to estimate daily calorie needs based on the target weight, supporting safe and effective weight management.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use this calculator, begin by selecting your preferred unit system: Imperial (pounds) or Metric (kilograms). Then, input your dog’s current weight and current Body Condition Score (BCS) on the 1-9 scale. Next, enter the target BCS you aim to achieve, typically within the ideal range of 4 to 5. Once all inputs are entered, click “Calculate” to receive your dog’s target weight and estimated daily calorie requirements.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your dog’s present weight accurately, as this forms the basis for all calculations.
          </li>
          <li>
            <strong>Current BCS:</strong> Input your dog’s current Body Condition Score, which reflects their fat level and overall condition.
          </li>
          <li>
            <strong>Target BCS:</strong> Choose a realistic and healthy target BCS to guide your dog’s weight management plan.
          </li>
          <li>
            <strong>Calculate:</strong> Press the calculate button to generate the target weight and daily calorie needs, which can be used to tailor feeding and exercise plans.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.wsava.org/global-guidelines/global-nutrition-guidelines/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on canine nutrition and body condition scoring from the World Small Animal Veterinary Association.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6313445/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Laflamme, D. P. (2012). Development and validation of a body condition score system for dogs.
            </a>
            <p className="text-slate-500 text-sm">
              A foundational study validating the 9-point BCS system and its correlation with body fat percentage in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Canine Weight Management Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for assessing and managing canine obesity, including the use of BCS and calorie calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/assessment-of-nutritional-status/body-condition-scoring"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Merck Veterinary Manual: Body Condition Scoring
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource explaining the principles and clinical application of body condition scoring in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Body Condition Score Helper (BCS → Target Plan)"
      description="Use the **Body Condition Score (BCS)** system to assess your dog's fat level and create a target weight plan."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Target Weight (kg) = Current Weight (kg) × (Target BCS / Current BCS)\n" +
          "RER (kcal) = 70 × (Target Weight in kg)^0.75\n" +
          "MER (kcal) = RER × Activity Factor (typically 1.4 for neutered adult dogs)",
        variables: [
          { symbol: "Current Weight (kg)", description: "Your dog's current body weight in kilograms" },
          { symbol: "Current BCS", description: "Your dog's current Body Condition Score (1-9 scale)" },
          { symbol: "Target BCS", description: "Desired Body Condition Score to achieve (1-9 scale)" },
          { symbol: "RER", description: "Resting Energy Requirement in kilocalories" },
          { symbol: "MER", description: "Maintenance Energy Requirement in kilocalories" },
          { symbol: "Activity Factor", description: "Multiplier for daily activity level, typically 1.4" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog currently at BCS 7 (overweight) aims to reach a target BCS of 5 (ideal).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg if needed (30 lb ÷ 2.20462 = 13.6 kg). Calculate target weight: 13.6 × (5 / 7) = 9.7 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER: 70 × 9.7^0.75 ≈ 70 × 5.3 = 371 kcal. Calculate MER: 371 × 1.4 = 520 kcal/day estimated for maintenance at target weight.",
          },
        ],
        result:
          "The dog’s target weight is approximately 21.4 lbs (9.7 kg), with an estimated daily calorie intake of 520 kcal to maintain this weight.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Body Condition Score Helper (BCS → Target Plan)" },
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