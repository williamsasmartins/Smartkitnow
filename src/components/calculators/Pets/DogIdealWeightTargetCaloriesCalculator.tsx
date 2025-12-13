import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogIdealWeightTargetCaloriesCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    idealWeight: "",
    activityLevel: "moderate",
  });

  // Activity multipliers for MER (Maintenance Energy Requirement)
  // Source: NRC and WSAVA guidelines
  const activityMultipliers: Record<string, number> = {
    low: 1.2, // sedentary, inactive
    moderate: 1.6, // typical pet dog
    high: 2.0, // working or highly active dog
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const idealWeightRaw = parseFloat(inputs.idealWeight);
    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !idealWeightRaw ||
      idealWeightRaw <= 0
    )
      return {
        value: 0,
        label: "Enter valid current and ideal weights...",
        subtext: null,
        warning: null,
      };

    // Convert weights to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const idealWeightKg =
      unit === "imperial" ? idealWeightRaw / 2.20462 : idealWeightRaw;

    // Calculate Resting Energy Requirement (RER) for ideal weight
    // RER = 70 * (idealWeightKg)^0.75
    const RER = 70 * Math.pow(idealWeightKg, 0.75);

    // Calculate Maintenance Energy Requirement (MER) based on activity level
    const activityMultiplier = activityMultipliers[inputs.activityLevel] || 1.6;
    const MER = RER * activityMultiplier;

    // Weight difference and warning if current weight is far from ideal
    const weightDiffPercent =
      ((currentWeightKg - idealWeightKg) / idealWeightKg) * 100;

    let warning = null;
    if (weightDiffPercent > 20) {
      warning =
        "Your dog is significantly overweight. Consult your veterinarian for a tailored weight loss plan.";
    } else if (weightDiffPercent < -15) {
      warning =
        "Your dog appears underweight. A veterinary assessment is recommended to rule out health issues.";
    }

    // Format results for display
    const caloriesLabel = `Target daily calories to maintain ideal weight (${inputs.activityLevel} activity)`;
    const caloriesValue = Math.round(MER);

    return {
      value: caloriesValue.toLocaleString(),
      label: caloriesLabel,
      subtext: `Ideal Weight: ${idealWeightKg.toFixed(2)} kg (${(
        idealWeightKg * 2.20462
      ).toFixed(1)} lbs) | RER: ${RER.toFixed(0)} kcal/day`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why is Resting Energy Requirement (RER) calculated using the 0.75 power of body weight?",
      answer:
        "RER is calculated as 70 times the body weight in kilograms raised to the 0.75 power because metabolic rate scales non-linearly with body size in mammals. This allometric scaling reflects how larger animals have slower metabolisms per unit mass than smaller ones. Using weight^0.75 provides a scientifically validated estimate of the energy needed for basic physiological functions at rest.",
    },
    {
      question:
        "How does activity level affect the calorie needs of my dog?",
      answer:
        "Activity level significantly influences a dog's calorie requirements. While RER estimates energy for resting metabolism, Maintenance Energy Requirement (MER) adjusts this by multiplying RER with an activity factor. Sedentary dogs need fewer calories (around 1.2x RER), moderately active dogs require about 1.6x, and highly active or working dogs may need up to 2.0x or more. This ensures energy intake matches energy expenditure.",
    },
    {
      question:
        "Why should I use my dog's ideal weight instead of current weight for calorie calculations?",
      answer:
        "Using ideal weight rather than current weight provides a target calorie intake to maintain a healthy body condition. If a dog is overweight or underweight, calculating calories based on current weight can perpetuate unhealthy conditions. Targeting ideal weight calories supports gradual weight normalization and long-term health, reducing risks of obesity-related diseases or malnutrition.",
    },
    {
      question:
        "How can I safely help my dog reach its ideal weight using calorie calculations?",
      answer:
        "To safely guide your dog toward its ideal weight, calculate the target calories based on ideal weight and adjust feeding accordingly. Gradual weight loss or gain (about 1-2% body weight per week) is recommended to avoid health risks. Always consult your veterinarian to tailor the plan, monitor progress, and adjust calories or activity levels as needed to ensure balanced nutrition and wellbeing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  const onInputChange = (field: string, value: string) => {
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
              min={0}
              step="any"
              placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.currentWeight}
              onChange={(e) => onInputChange("currentWeight", e.target.value)}
              aria-describedby="currentWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="idealWeight" className="text-slate-700 dark:text-slate-300">
              Ideal Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="idealWeight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter ideal weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.idealWeight}
              onChange={(e) => onInputChange("idealWeight", e.target.value)}
              aria-describedby="idealWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
              Activity Level
            </Label>
            <Select
              id="activityLevel"
              value={inputs.activityLevel}
              onValueChange={(val) => onInputChange("activityLevel", val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (sedentary)</SelectItem>
                <SelectItem value="moderate">Moderate (typical pet)</SelectItem>
                <SelectItem value="high">High (active/working)</SelectItem>
              </SelectContent>
            </Select>
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
          onClick={() =>
            setInputs({ currentWeight: "", idealWeight: "", activityLevel: "moderate" })
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
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

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
          Understanding Dog Ideal Weight & Target Calories Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining an ideal weight is crucial for a dog’s overall health, longevity, and quality of life. This calculator helps pet owners estimate the optimal daily calorie intake required to maintain their dog’s ideal weight, taking into account the dog’s current condition and activity level. Unlike human BMI formulas, veterinary science uses metabolic scaling laws to accurately estimate energy needs based on body weight raised to the 0.75 power, reflecting the unique physiology of dogs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses the Resting Energy Requirement (RER) formula, which estimates the energy needed for basic physiological functions at rest. This value is then adjusted by an activity multiplier to determine the Maintenance Energy Requirement (MER), representing the total calories needed daily considering the dog’s lifestyle. By inputting both current and ideal weights, owners can understand how far their dog is from a healthy target and adjust feeding plans accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to support informed decisions about canine nutrition and weight management, which are essential to prevent obesity-related diseases such as diabetes, arthritis, and cardiovascular problems. It also helps identify underweight conditions that may indicate underlying health issues. Always consult a veterinarian for personalized advice and before making significant changes to your dog’s diet or exercise routine.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog’s ideal daily calorie needs, follow these steps carefully. First, select the unit system you prefer—Imperial (pounds) or Metric (kilograms). Then, enter your dog’s current weight and the ideal weight recommended by your veterinarian or based on breed standards. Finally, select your dog’s activity level, which adjusts calorie needs to reflect lifestyle differences from sedentary to highly active.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Input your dog’s present weight accurately. This helps assess how far your dog is from the ideal weight and whether weight management is needed.
          </li>
          <li>
            <strong>Ideal Weight:</strong> Enter the target healthy weight for your dog. This should be determined by a veterinarian considering breed, age, and body condition score.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the activity level that best matches your dog’s daily routine. This affects the multiplier used to calculate total calorie needs.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all inputs, click “Calculate” to see the estimated daily calories your dog needs to maintain the ideal weight. Use the “Reset” button to clear inputs and start over. Remember, this calculator provides estimates and should be complemented with veterinary guidance for best results.
        </p>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
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
              Comprehensive guidelines on canine nutrition and energy requirements from the World Small Animal Veterinary Association.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149867/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Research Council (NRC) Nutrient Requirements of Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource detailing metabolic energy calculations and nutrient needs for dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Weight Management Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for assessing and managing canine obesity and ideal weight.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11262&id=4954033"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Veterinary Information Network (VIN) – Energy Requirements in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed articles and clinical insights on calculating energy needs for dogs based on metabolic and activity factors.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "MER = 70 × (Ideal Weight in kg)^0.75 × Activity Multiplier",
        variables: [
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement - total daily calories needed to maintain ideal weight",
          },
          {
            symbol: "70 × (Ideal Weight)^0.75",
            description:
              "Resting Energy Requirement (RER) - energy needed for basic physiological functions at rest",
          },
          {
            symbol: "Activity Multiplier",
            description:
              "Factor based on dog's activity level: low (1.2), moderate (1.6), high (2.0)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 50 lb (22.7 kg) dog currently overweight with an ideal weight of 40 lb (18.1 kg) and moderate activity level.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert ideal weight to kg if needed: 40 lb ÷ 2.20462 = 18.1 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER: 70 × (18.1)^0.75 ≈ 70 × 8.3 = 581 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply activity multiplier for moderate activity (1.6): 581 × 1.6 = 930 kcal/day.",
          },
        ],
        result:
          "The dog should consume approximately 930 kcal daily to maintain its ideal weight at a moderate activity level.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🍖",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dog Ideal Weight & Target Calories Calculator",
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