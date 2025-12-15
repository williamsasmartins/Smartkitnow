import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RabbitTreatCaloriesSafePortionCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: rabbit weight and treat calories per portion
  const [inputs, setInputs] = useState({
    weight: "",
    treatCalories: "",
  });

  // 2. LOGIC ENGINE
  // Calculation logic:
  // RER (Resting Energy Requirement) = 70 * (weight_kg)^0.75 kcal/day
  // Safe treat calories = 5% of RER (recommended max treat calories per day)
  // Safe portion size (treat grams) = (Safe treat calories) / (calories per gram of treat)
  // Since user inputs treat calories per portion, we calculate max portions:
  // max portions = Safe treat calories / treat calories per portion

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const treatCalNum = parseFloat(inputs.treatCalories);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(treatCalNum) ||
      treatCalNum <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Safe treat calories = 5% of RER
    const safeTreatCalories = rer * 0.05;

    // Max portions = safe treat calories / treat calories per portion
    const maxPortions = safeTreatCalories / treatCalNum;

    // Round results nicely
    const safeTreatCaloriesRounded = safeTreatCalories.toFixed(1);
    const maxPortionsRounded = maxPortions.toFixed(2);

    let warning = null;
    if (maxPortions < 0.1) {
      warning =
        "The treat calories per portion are very high relative to your rabbit's size. Consider lower-calorie treats or smaller portions.";
    }

    return {
      value: maxPortionsRounded,
      label: "Maximum Safe Treat Portions per Day",
      subtext: `Based on a daily treat calorie limit of ${safeTreatCaloriesRounded} kcal (5% of RER).`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to limit treat calories for rabbits?",
      answer:
        "Rabbits have sensitive digestive systems and are prone to obesity if overfed high-calorie treats. Limiting treat calories helps maintain a healthy weight and prevents gastrointestinal issues. Treats should only make up a small portion of their daily energy intake to ensure overall nutritional balance.",
    },
    {
      question: "How is the safe treat portion calculated for rabbits?",
      answer:
        "The safe treat portion is based on the rabbit's Resting Energy Requirement (RER), which estimates daily caloric needs. Veterinary guidelines recommend that treats should not exceed 5% of the RER to avoid overfeeding. By dividing this safe calorie limit by the calories per treat portion, we determine the maximum number of safe treat portions per day.",
    },
    {
      question: "Can I feed any type of treat to my rabbit using this calculator?",
      answer:
        "This calculator estimates safe treat portions based on calorie content, but not all treats are nutritionally appropriate. Some treats may contain harmful ingredients or excessive sugars. Always choose rabbit-safe treats and consult your veterinarian before introducing new foods to your rabbit's diet.",
    },
    {
      question: "Why do I need to input my rabbit’s weight in this calculator?",
      answer:
        "A rabbit’s weight is essential to calculate its Resting Energy Requirement (RER), which determines daily caloric needs. Since treat safety depends on how many calories your rabbit requires, accurate weight input ensures the portion recommendations are tailored and safe. Without weight, the calculator cannot provide personalized guidance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI widget
  const widget = (
    <div className="space-y-6">
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
            Rabbit Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="treatCalories"
            className="text-slate-700 dark:text-slate-300"
          >
            Calories per Treat Portion (kcal)
          </Label>
          <Input
            id="treatCalories"
            type="number"
            min="0"
            step="any"
            placeholder="Enter calories per treat portion"
            value={inputs.treatCalories || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, treatCalories: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", treatCalories: "" })}
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
              vet for diagnosis.
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
          Understanding Rabbit Treat Calories & Safe Portion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Rabbits have unique dietary needs that require careful management of their
          calorie intake, especially when it comes to treats. Unlike humans, rabbits
          have a delicate digestive system that can be easily upset by excessive or
          inappropriate feeding. Treats, while enjoyable for rabbits, should only
          constitute a small fraction of their daily caloric intake to prevent
          obesity and gastrointestinal complications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Resting Energy Requirement (RER) is a veterinary standard used to
          estimate the daily calories a rabbit needs to maintain basic bodily
          functions. Treat calories should ideally not exceed 5% of this RER to ensure
          the rabbit’s overall diet remains balanced and healthy. This calculator
          helps pet owners determine the safe maximum number of treat portions based
          on their rabbit’s weight and the caloric content of the treats.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By understanding and monitoring treat calories, owners can provide
          appropriate rewards without compromising their rabbit’s health. This tool
          supports responsible feeding practices and encourages consultation with
          veterinarians for personalized dietary advice, ensuring rabbits live a long,
          healthy life.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the safe maximum number of treat portions you can
          give your rabbit daily without exceeding recommended calorie limits. You
          will need to input your rabbit’s weight and the calorie content of one
          portion of the treat you plan to feed. The calculator uses veterinary
          formulas to provide a scientifically backed recommendation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or
            Metric) for weight input.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your rabbit’s current weight accurately.
          </li>
          <li>
            <strong>Step 3:</strong> Input the calories contained in one portion of
            the treat you intend to feed.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the maximum safe treat
            portions per day based on your inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to guide your feeding practices,
            and consult your veterinarian for personalized advice.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Nutrition of Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource detailing rabbit nutrition,
              including energy requirements and dietary management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org.au/resources/rabbit-nutrition/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Australian Association of Veterinary Rabbits - Rabbit Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on safe feeding practices and treat portion recommendations
              for pet rabbits.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/rabbit-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals - Rabbit Nutrition and Treat Safety
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary advice on rabbit dietary needs, treat safety, and calorie
              management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rabbit Treat Calories & Safe Portion"
      description="Calculate the calorie content of treats and the safe maximum portion size for rabbits."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Safe Treat Calories = 0.05 × 70 × (Weight_kg)^0.75",
        variables: [
          { symbol: "Weight_kg", description: "Rabbit weight in kilograms" },
          {
            symbol: "Safe Treat Calories",
            description: "Maximum daily calories from treats (5% of RER)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4 lb (1.81 kg) rabbit is given treats containing 10 kcal per portion. Calculate the safe maximum treat portions per day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (4 lb ≈ 1.81 kg). Calculate RER: 70 × (1.81)^0.75 ≈ 117 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate safe treat calories: 5% × 117 = 5.85 kcal/day from treats.",
          },
          {
            label: "3",
            explanation:
              "Divide safe treat calories by calories per portion: 5.85 ÷ 10 = 0.585 portions/day.",
          },
        ],
        result:
          "The rabbit should receive no more than approximately 0.6 treat portions per day to stay within safe calorie limits.",
      }}
      relatedCalculators={[
        {
          title: "Calcium-to-Phosphorus Ratio Calculator",
          url: "/pets/reptile-calcium-to-phosphorus-ratio",
          icon: "🐾",
        },
        {
          title: "Thermal Gradient Maintenance Power Estimator",
          url: "/pets/reptile-thermal-gradient-maintenance-power",
          icon: "🐶",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Phenylbutazone / Flunixin Dose Calculator",
          url: "/pets/horse-phenylbutazone-flunixin-dose",
          icon: "🍖",
        },
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "💉",
        },
        {
          title: "Electrolyte & Vitamin C Water Mix Calculator",
          url: "/pets/bird-electrolyte-vitamin-c-water-mix",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Rabbit Treat Calories & Safe Portion" },
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