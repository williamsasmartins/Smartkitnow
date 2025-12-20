import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatPhosphorusPerMealEstimatorCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: phosphorus content per 100g (mg), serving size (g)
  const [inputs, setInputs] = useState({
    phosphorusMgPer100g: "",
    servingSize: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const phosphorusMgPer100g = parseFloat(inputs.phosphorusMgPer100g);
    const servingSize = parseFloat(inputs.servingSize);

    if (
      isNaN(phosphorusMgPer100g) ||
      phosphorusMgPer100g <= 0 ||
      isNaN(servingSize) ||
      servingSize <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Calculate phosphorus per meal (mg)
    // Formula: Phosphorus per meal (mg) = (Phosphorus mg per 100g) * (Serving size g) / 100
    const phosphorusPerMealMg = (phosphorusMgPer100g * servingSize) / 100;

    // Contextual subtext
    const subtext = `This is the estimated phosphorus content in milligrams for the given serving size.`;

    // Warning if phosphorus is high (> 150 mg per meal is often considered high for CKD cats)
    let warning = null;
    if (phosphorusPerMealMg > 150) {
      warning =
        "High phosphorus content per meal may be harmful for cats with kidney disease. Consult your veterinarian for dietary adjustments.";
    }

    return {
      value: phosphorusPerMealMg.toFixed(1),
      label: "Phosphorus per Meal (mg)",
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to estimate phosphorus content per meal for cats?",
      answer:
        "Phosphorus plays a critical role in feline health, but excessive intake can worsen kidney disease. Estimating phosphorus per meal helps pet owners and veterinarians manage dietary phosphorus to slow disease progression. This calculator aids in interpreting diet labels to make informed feeding decisions.",
    },
    {
      question: "How does phosphorus affect cats with chronic kidney disease (CKD)?",
      answer:
        "In cats with CKD, impaired kidney function reduces phosphorus excretion, leading to elevated blood phosphorus levels. High phosphorus accelerates kidney damage and contributes to secondary complications like bone disorders. Controlling dietary phosphorus intake is essential to improve quality of life and longevity in affected cats.",
    },
    {
      question: "Can I use this calculator for all types of cat food?",
      answer:
        "Yes, this tool is designed to estimate phosphorus content from any diet label that provides phosphorus per 100 grams. Whether dry kibble, canned food, or homemade diets, entering the correct label values will yield accurate phosphorus estimates per meal. Always verify label accuracy and consult your veterinarian for diet suitability.",
    },
    {
      question: "What should I do if the phosphorus per meal is too high?",
      answer:
        "If the estimated phosphorus per meal exceeds recommended levels, consult your veterinarian to adjust your cat’s diet. They may recommend phosphorus-restricted diets or phosphate binders to reduce absorption. Monitoring and managing phosphorus intake is vital to protect kidney health and prevent further damage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="phosphorusMgPer100g" className="text-slate-700 dark:text-slate-300">
            Phosphorus Content (mg per 100g)
          </Label>
          <Input
            id="phosphorusMgPer100g"
            name="phosphorusMgPer100g"
            type="text"
            placeholder="e.g. 120"
            value={inputs.phosphorusMgPer100g}
            onChange={handleInputChange}
            aria-describedby="phosphorusHelp"
          />
          <p id="phosphorusHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the phosphorus amount listed on the diet label per 100 grams of food.
          </p>
        </div>

        <div>
          <Label htmlFor="servingSize" className="text-slate-700 dark:text-slate-300">
            Serving Size ({unit === "imperial" ? "oz" : "g"})
          </Label>
          <Input
            id="servingSize"
            name="servingSize"
            type="text"
            placeholder={unit === "imperial" ? "e.g. 3.5" : "e.g. 100"}
            value={inputs.servingSize}
            onChange={handleInputChange}
            aria-describedby="servingHelp"
          />
          <p id="servingHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the amount of food offered per meal. (Note: 1 oz = 28.35 g)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Convert serving size to grams if imperial
            if (unit === "imperial" && inputs.servingSize) {
              const servingOz = parseFloat(inputs.servingSize);
              if (!isNaN(servingOz)) {
                setInputs((prev) => ({
                  ...prev,
                  servingSize: (servingOz * 28.35).toFixed(2),
                }));
                setUnit("metric"); // Switch to metric internally for calculation
              }
            }
          }}
          aria-label="Calculate phosphorus per meal"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ phosphorusMgPer100g: "", servingSize: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
          Understanding Phosphorus per Meal Estimator (diet label helper)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Phosphorus is a vital mineral involved in many physiological functions in cats, including bone formation and energy metabolism. However, excessive phosphorus intake can be detrimental, especially for cats suffering from chronic kidney disease (CKD). This estimator helps pet owners and veterinary professionals calculate the exact phosphorus content per meal based on diet label information, enabling precise dietary management.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting the phosphorus concentration per 100 grams of food and the serving size, this tool calculates the phosphorus load per meal in milligrams. This information is critical because controlling phosphorus intake can slow CKD progression and improve quality of life. The calculator simplifies complex label data into actionable insights for better nutritional decisions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires two key pieces of information from your cat’s food label. First, enter the phosphorus content listed as milligrams per 100 grams of food. Second, input the serving size your cat consumes per meal, either in grams or ounces depending on your preferred unit system.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric). If you use Imperial, enter serving size in ounces; the calculator will convert it to grams internally.
          </li>
          <li>
            <strong>Step 2:</strong> Input the phosphorus content per 100 grams exactly as shown on the diet label.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the serving size your cat receives at each meal.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated phosphorus content per meal in milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Review the result and any warnings. Consult your veterinarian if phosphorus levels are high.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7142442/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Polzin DJ. Chronic Kidney Disease in Small Animals. Vet Clin North Am Small Anim Pract. 2013.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review on the impact of dietary phosphorus on feline kidney disease progression and management strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2019/01/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. WSAVA Global Nutrition Committee. Nutritional Assessment Guidelines. 2019.
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines for nutritional assessment and dietary management in companion animals, emphasizing phosphorus control in renal diets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/chronic-kidney-disease"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center. Chronic Kidney Disease in Cats.
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing CKD in cats, including the importance of phosphorus restriction in therapeutic diets.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Phosphorus per Meal Estimator (diet label helper)"
      description="Calculate the phosphorus content per meal from food labels, essential for cats with kidney disease."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Phosphorus per Meal (mg) = (Phosphorus mg per 100g) × (Serving Size g) ÷ 100",
        variables: [
          { symbol: "Phosphorus mg per 100g", description: "Phosphorus content on diet label per 100 grams of food" },
          { symbol: "Serving Size g", description: "Amount of food offered per meal in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat food label states phosphorus content as 120 mg per 100 grams. The cat is fed 3.5 oz (approximately 99 g) per meal. Calculate the phosphorus intake per meal.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert serving size from ounces to grams: 3.5 oz × 28.35 = 99.2 g (approx).",
          },
          {
            label: "2",
            explanation:
              "Apply formula: (120 mg / 100 g) × 99.2 g = 119 mg phosphorus per meal.",
          },
        ],
        result: "The cat consumes approximately 119 mg of phosphorus per meal.",
      }}
      relatedCalculators={[
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "🐾" },
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "🐶" },
        { title: "Omega-3 Supplement Dose (for parrots)", url: "/pets/bird-omega-3-supplement-dose-parrots", icon: "🐱" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🍖" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "💉" },
        { title: "Hay & Pellet Intake Calculator", url: "/pets/small-mammal-hay-pellet-intake", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Phosphorus per Meal Estimator (diet label helper)" },
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