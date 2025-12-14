import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatBodyConditionScoreBcsTargetCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial default)
  const [unit, setUnit] = useState("imperial");

  // Inputs: current weight and current BCS, target BCS
  const [inputs, setInputs] = useState({
    currentWeight: "",
    currentBcs: "",
    targetBcs: "",
  });

  // 2. LOGIC ENGINE
  // Formula logic:
  // Target Weight = Current Weight * (Target BCS / Current BCS)
  // This assumes linear proportionality between BCS and weight for target planning.
  const results = useMemo(() => {
    const cw = parseFloat(inputs.currentWeight);
    const cbcs = parseFloat(inputs.currentBcs);
    const tbcs = parseFloat(inputs.targetBcs);

    if (
      isNaN(cw) ||
      isNaN(cbcs) ||
      isNaN(tbcs) ||
      cw <= 0 ||
      cbcs <= 0 ||
      tbcs <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert current weight to kg if imperial
    const currentWeightKg = unit === "imperial" ? cw / 2.20462 : cw;

    // Calculate target weight in kg
    const targetWeightKg = currentWeightKg * (tbcs / cbcs);

    // Convert back to imperial if needed
    const targetWeight =
      unit === "imperial" ? targetWeightKg * 2.20462 : targetWeightKg;

    // Round to 2 decimals
    const roundedTargetWeight = Math.round(targetWeight * 100) / 100;

    // Warning if target BCS is same as current BCS
    const warning =
      tbcs === cbcs
        ? "Target BCS is the same as current BCS; no weight change expected."
        : null;

    return {
      value: roundedTargetWeight,
      label:
        unit === "imperial"
          ? "Target Weight (lbs)"
          : "Target Weight (kg)",
      subtext: `Based on current weight and BCS ratio (${cbcs} → ${tbcs})`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the Body Condition Score (BCS) system for cats?",
      answer:
        "The Body Condition Score (BCS) system is a standardized method used by veterinarians to assess a cat's body fat and overall condition. It typically ranges from 1 (emaciated) to 9 (obese), helping to identify underweight, ideal, or overweight cats. This scoring guides nutritional and health management plans to optimize feline well-being.",
    },
    {
      question: "Why is it important to set a target weight based on BCS?",
      answer:
        "Setting a target weight based on BCS helps ensure that weight management is tailored to the cat's ideal body condition rather than arbitrary numbers. It allows for gradual, healthy adjustments to reach an optimal fat level, reducing risks of obesity-related diseases or malnutrition. This approach supports long-term health and quality of life for cats.",
    },
    {
      question: "How accurate is the proportional formula for target weight calculation?",
      answer:
        "The proportional formula assumes a linear relationship between BCS and body weight, which provides a practical estimate for target weight planning. While it is a useful guideline, individual variations in muscle mass, bone structure, and health status mean it should be used alongside veterinary assessment. Regular monitoring and adjustments are essential for accuracy.",
    },
    {
      question: "Can I use this calculator for cats with medical conditions?",
      answer:
        "Cats with medical conditions may have altered body composition that affects BCS and weight relationships. Therefore, this calculator should be used cautiously and not replace professional veterinary advice. Always consult your veterinarian for personalized recommendations, especially if your cat has health issues.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            name="currentWeight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.currentWeight}
            onChange={onChangeInput}
            aria-describedby="currentWeightHelp"
          />
        </div>
        <div>
          <Label htmlFor="currentBcs" className="text-slate-700 dark:text-slate-300">
            Current Body Condition Score (1-9)
          </Label>
          <Input
            id="currentBcs"
            name="currentBcs"
            type="text"
            inputMode="decimal"
            placeholder="Enter current BCS"
            value={inputs.currentBcs}
            onChange={onChangeInput}
            aria-describedby="currentBcsHelp"
          />
        </div>
        <div>
          <Label htmlFor="targetBcs" className="text-slate-700 dark:text-slate-300">
            Target Body Condition Score (1-9)
          </Label>
          <Input
            id="targetBcs"
            name="targetBcs"
            type="text"
            inputMode="decimal"
            placeholder="Enter target BCS"
            value={inputs.targetBcs}
            onChange={onChangeInput}
            aria-describedby="targetBcsHelp"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate target weight"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWeight: "",
              currentBcs: "",
              targetBcs: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
          Understanding Cat Body Condition Score Helper (BCS → Target Plan)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Body Condition Score (BCS) system is an essential tool used by veterinarians and pet owners to evaluate a cat's fat stores and overall health status. It provides a standardized scale, typically from 1 to 9, where lower scores indicate underweight conditions and higher scores indicate overweight or obesity. This scoring helps identify cats at risk for health complications related to improper body weight, such as diabetes or joint problems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the BCS allows for a more nuanced understanding of a cat’s physical condition beyond just weight alone, as cats of similar weight may have different body compositions. This tool supports veterinarians in creating personalized nutritional and weight management plans that aim to achieve an ideal body condition. By targeting a specific BCS, owners can help their cats maintain a healthy weight, which is crucial for longevity and quality of life.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Cat Body Condition Score Helper (BCS → Target Plan) calculator translates these scores into actionable target weights, facilitating practical weight management. It uses a proportional formula to estimate the ideal weight based on the current weight and the desired BCS, providing a clear goal for dietary and lifestyle adjustments. This approach empowers owners to monitor progress effectively and make informed decisions in collaboration with their veterinarian.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps estimate your cat’s target weight based on its current weight and Body Condition Score (BCS), alongside your desired target BCS. Begin by selecting your preferred unit system—imperial (lbs) or metric (kg)—to match your measurement tools. Then, input your cat’s current weight, current BCS, and the target BCS you aim to achieve.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s current weight accurately using a reliable scale.
          </li>
          <li>
            <strong>Step 2:</strong> Input the current BCS, which should be assessed by a veterinarian or trained professional to ensure accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the target BCS that reflects your cat’s ideal body condition, typically between 4 and 5 on the 9-point scale.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive the estimated target weight, which guides your weight management plan.
          </li>
          <li>
            <strong>Step 5:</strong> Use this target weight as a reference for dietary adjustments and consult your veterinarian regularly to monitor progress.
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
              href="https://www.wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Guidelines-2020.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. WSAVA Global Nutrition Guidelines for Cats and Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on nutritional assessment and body condition scoring in companion animals by the World Small Animal Veterinary Association.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6363520/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Laflamme, D. (1997). Development and validation of a body condition score system for cats.
            </a>
            <p className="text-slate-500 text-sm">
              This study introduces and validates the 9-point BCS system widely used in veterinary practice for feline patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/obesity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Feline Obesity and Weight Management
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on feline obesity, its health implications, and strategies for weight management including BCS assessment.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Body Condition Score Helper (BCS → Target Plan)"
      description="Use the **Body Condition Score (BCS)** system to assess your cat's fat level and formulate a target weight plan."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Target Weight = Current Weight × (Target BCS / Current BCS)",
        variables: [
          { symbol: "Current Weight", description: "Your cat's current weight in kg or lbs" },
          { symbol: "Current BCS", description: "Your cat's current Body Condition Score (1-9)" },
          { symbol: "Target BCS", description: "Desired Body Condition Score (1-9)" },
          { symbol: "Target Weight", description: "Estimated ideal weight based on BCS ratio" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat weighs 10 lbs with a current BCS of 7 (overweight). The target BCS is 5 (ideal).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the target weight by multiplying current weight by the ratio of target BCS to current BCS: 10 × (5/7) ≈ 7.14 lbs.",
          },
          {
            label: "2",
            explanation:
              "This target weight guides the weight loss plan to achieve a healthier body condition.",
          },
        ],
        result: "Target Weight ≈ 7.14 lbs (ideal weight for BCS 5).",
      }}
      relatedCalculators={[
        {
          title: "Dog Grape/Raisin Exposure Risk Calculator",
          url: "/pets/dog-grape-raisin-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Dog Body Condition Score Helper (BCS → Target Plan)",
          url: "/pets/dog-body-condition-score-bcs-target",
          icon: "🐶",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
        {
          title: "Dog Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/dog-pregnancy-gestation-due-date",
          icon: "🐶",
        },
        {
          title: "Environmental Enrichment Planner (per room)",
          url: "/pets/cat-environmental-enrichment-planner",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Body Condition Score Helper (BCS → Target Plan)" },
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