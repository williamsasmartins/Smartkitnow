import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogDailyWaterIntakeCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: Current Weight (required), Diet Type (affects water needs)
  const [inputs, setInputs] = useState({
    weight: "",
    dietType: "dry", // dry, wet, mixed
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);

    // Safety Check
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight to calculate water intake",
        subtext: null,
        warning: null,
      };
    }

    // Conversion to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Veterinary Math:
    // RER = 70 * (weight_kg ^ 0.75)
    // Daily water intake (ml) = RER * water factor (ml/kcal)
    // Water factor varies by diet:
    // Dry food: 1.6 ml/kcal
    // Wet food: 1.0 ml/kcal (wet food contains moisture)
    // Mixed diet: 1.3 ml/kcal (average)

    const rer = 70 * Math.pow(weightKg, 0.75);

    let waterFactor = 1.6; // default dry food
    if (inputs.dietType === "wet") waterFactor = 1.0;
    else if (inputs.dietType === "mixed") waterFactor = 1.3;

    const waterMl = rer * waterFactor;

    // Convert back to user's preferred unit for display
    // 1 ml = 0.033814 fl oz (US fluid ounces)
    const waterFlOz = waterMl * 0.033814;

    // Display value and label depending on unit
    let displayValue: string;
    let displayLabel: string;
    if (unit === "imperial") {
      displayValue = waterFlOz.toFixed(1);
      displayLabel = "Estimated Daily Water Intake (fl oz)";
    } else {
      displayValue = waterMl.toFixed(0);
      displayLabel = "Estimated Daily Water Intake (ml)";
    }

    // Warning if weight is very low or very high (less than 1kg or more than 90kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight is very low; please consult your veterinarian for precise water needs.";
    } else if (weightKg > 90) {
      warning =
        "Weight is very high; water needs may vary significantly. Consult your veterinarian.";
    }

    return {
      value: displayValue,
      label: displayLabel,
      subtext:
        "Based on Resting Energy Requirement (RER) and diet moisture content.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question: "Why is daily water intake crucial for my dog's health?",
      answer:
        "Daily water intake is vital for maintaining your dog's hydration, supporting kidney function, regulating body temperature, and aiding digestion. Proper hydration helps prevent urinary tract infections and supports overall metabolic processes, making it essential for your dog's well-being.",
    },
    {
      question:
        "How does my dog's diet type affect their daily water requirements?",
      answer:
        "Dogs eating dry kibble require more water because dry food contains minimal moisture. Wet or canned foods have high water content, reducing the need for additional drinking water. Mixed diets fall in between. Adjusting water intake based on diet ensures your dog stays properly hydrated.",
    },
    {
      question:
        "Can I rely solely on this calculator for my dog's hydration needs?",
      answer:
        "While this calculator provides an evidence-based estimate using veterinary formulas, individual needs vary due to activity, health status, and environment. Always monitor your dog's water consumption and consult your veterinarian for personalized advice, especially if your dog has medical conditions.",
    },
    {
      question:
        "What signs indicate my dog might be dehydrated or overhydrated?",
      answer:
        "Signs of dehydration include dry gums, lethargy, sunken eyes, and loss of skin elasticity. Overhydration is less common but can cause frequent urination, swelling, or electrolyte imbalances. Observing these signs early helps ensure timely veterinary care and proper hydration management.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget inputs
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

        {/* Current Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            placeholder={`Enter your dog's weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Diet Type Select */}
        <div>
          <Label htmlFor="dietType" className="text-slate-700 dark:text-slate-300">
            Diet Type
          </Label>
          <Select
            id="dietType"
            value={inputs.dietType}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, dietType: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dry">Dry Food</SelectItem>
              <SelectItem value="wet">Wet/Canned Food</SelectItem>
              <SelectItem value="mixed">Mixed Diet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dietType: "dry" })}
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
              <strong>Veterinary Disclaimer:</strong> This tool is for educational
              purposes. Consult your veterinarian for specific hydration plans
              tailored to your dog's health and lifestyle.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Daily Water Intake Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper hydration is a cornerstone of canine health, influencing nearly
          every physiological system. The <strong>Dog Daily Water Intake Checker</strong> estimates the minimum amount of water your dog needs daily based on scientifically validated veterinary formulas. This tool uses the <strong>Resting Energy Requirement (RER)</strong>, which calculates the energy your dog expends at rest, to estimate water needs that support metabolic functions and maintain homeostasis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Water intake requirements vary significantly depending on factors such as body weight, diet composition, and activity level. Dogs consuming dry kibble require more supplemental water due to the low moisture content of their food, whereas those on wet or canned diets receive a substantial portion of their hydration through their meals. This calculator adjusts for diet type to provide a tailored estimate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By understanding your dog's daily water needs, you can help prevent dehydration, urinary tract issues, and other health complications. This tool empowers pet owners with veterinary-backed insights to optimize their dog's hydration and overall wellness.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Dog Daily Water Intake Checker is straightforward and designed for accuracy. Begin by selecting your preferred unit system—Imperial (pounds) or Metric (kilograms)—to match how you measure your dog's weight. Then, enter your dog's current weight accurately, as this is the primary factor influencing water requirements.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, select your dog's diet type from the options: Dry Food, Wet/Canned Food, or Mixed Diet. This selection adjusts the water intake estimate to account for moisture content in the food. Finally, click the Calculate button to view the estimated daily water intake in your chosen units.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your dog's weight accurately to ensure the calculation reflects their true hydration needs.
          </li>
          <li>
            <strong>Diet Type:</strong> Choose the diet that best matches your dog's feeding routine to adjust water needs accordingly.
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
              href="https://www.aaha.org/guidelines/weight-management/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Animal Hospital Association (AAHA) Weight Management Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on canine nutrition, hydration, and weight management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/feeding-and-nutrition-of-dogs/water-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Water Requirements in Dogs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed veterinary insights on factors influencing water needs in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2019/06/water-requirements-in-dogs-and-cats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Tufts University Cummings Veterinary Nutrition - Water Requirements
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Research-based analysis of hydration needs and diet impacts on dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149303/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. National Center for Biotechnology Information (NCBI) - Canine Hydration and Health
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Scientific study on hydration status and health outcomes in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Daily Water Intake Checker"
      description="Check if your dog is drinking enough water daily. Calculates the minimum required intake based on weight and diet type."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Veterinary Formula",
        formula: "RER = 70 × (Weight in kg)^0.75",
        variables: [
          {
            symbol: "RER",
            description: "Resting Energy Requirement (Calories at rest)",
          },
          {
            symbol: "MER",
            description: "Maintenance Energy Requirement (Activity Multiplier)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb dog eating dry kibble needs an estimate of daily water intake.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER: 70 × (13.61)^0.75 ≈ 70 × 6.67 = 466.9 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Estimate water intake: 466.9 kcal × 1.6 ml/kcal = 747 ml/day.",
          },
          {
            label: "Step 4",
            explanation:
              "Convert to fl oz: 747 ml × 0.033814 = 25.3 fl oz/day.",
          },
        ],
        result:
          "The dog should drink approximately 25.3 fl oz (747 ml) of water daily to stay properly hydrated.",
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
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
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
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Daily Water Intake Checker" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}