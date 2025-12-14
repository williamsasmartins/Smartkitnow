import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatInsulinStarterReferenceCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are weight-based but formula is info-only.
  // We'll keep imperial default and allow input in lbs or kg with a toggle for clarity.
  // But per instructions, default to imperial and keep unit selector since weight input is needed.
  // However, instructions say to delete unit selector if not needed (e.g. for Dates).
  // Here weight input is needed, so keep unit selector.

  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // This is an info-only reference, so no calculation.
  // But we can provide a contextual "Starting Dose Range" based on weight.
  // Typical starting dose for feline insulin: 0.25 to 0.5 units/kg twice daily.
  // We'll show the range for the given weight.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate starting dose range (units per injection, BID)
    // Lower range: 0.25 units/kg
    // Upper range: 0.5 units/kg
    const lowerDose = (0.25 * weightKg).toFixed(2);
    const upperDose = (0.5 * weightKg).toFixed(2);

    return {
      value: `${lowerDose} - ${upperDose}`,
      label: "Starting Insulin Dose Range (units per injection, BID)",
      subtext:
        "Typical initial dose range for feline insulin therapy based on weight. Always confirm with your veterinarian before dosing.",
      warning:
        "This is an informational reference only. Insulin dosing must be individualized and supervised by a veterinarian to avoid hypoglycemia.",
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is insulin dosing in cats based on weight rather than a fixed dose?",
      answer:
        "Insulin dosing in cats is weight-based because body mass directly influences insulin requirements. Larger cats typically need higher doses to achieve glycemic control, while smaller cats require less. Weight-based dosing helps tailor therapy to individual metabolic needs, reducing the risk of under- or overdosing, which can cause serious complications.",
    },
    {
      question: "How often should insulin doses be adjusted during feline diabetes management?",
      answer:
        "Insulin doses should be adjusted gradually and based on frequent monitoring of blood glucose levels and clinical signs. Typically, dose adjustments occur every few days to weeks, depending on the cat’s response. Close veterinary supervision is essential to avoid hypoglycemia and optimize glycemic control for long-term health.",
    },
    {
      question: "Why is this calculator labeled as 'info-only' and not a dose calculator?",
      answer:
        "This tool provides reference ranges and educational information rather than precise dosing recommendations. Insulin therapy requires individualized assessment, frequent monitoring, and veterinary oversight due to the risks of hypoglycemia and variability in insulin sensitivity. Therefore, this calculator is intended to guide understanding, not replace professional dosing decisions.",
    },
    {
      question: "What factors besides weight influence insulin requirements in diabetic cats?",
      answer:
        "Several factors affect insulin needs including the cat’s diet, activity level, concurrent illnesses, and stress. Additionally, the type of insulin used and the cat’s insulin sensitivity can vary widely. These variables necessitate personalized treatment plans and frequent reassessment by a veterinarian.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ weight: e.target.value })}
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400">
          Accurate weight is essential for estimating insulin dose ranges.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, results update on input change
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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
          Understanding Insulin Starter Reference (info-only)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Insulin therapy is a cornerstone in managing feline diabetes mellitus, a common endocrine disorder in cats characterized by insufficient insulin production or action. Starting insulin treatment requires careful consideration of the cat’s weight, overall health, and metabolic status to ensure safe and effective glycemic control. This reference provides a general guide to typical starting insulin dose ranges based on body weight, emphasizing that individualized dosing and veterinary supervision are essential.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The initial insulin dose is usually calculated per kilogram of body weight, with common starting doses ranging from 0.25 to 0.5 units/kg administered twice daily. These doses are not fixed and must be adjusted according to the cat’s response, blood glucose monitoring results, and clinical signs. Because insulin sensitivity varies widely among cats, this reference serves as an educational tool rather than a precise dosing calculator.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the principles behind insulin dosing helps veterinarians and pet owners collaborate effectively in managing feline diabetes. This tool aims to enhance awareness of typical dosing ranges and the importance of ongoing monitoring to prevent complications such as hypoglycemia. Always consult a veterinarian before initiating or modifying insulin therapy to ensure the best outcomes for your feline patient.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator provides an informational reference for typical starting insulin dose ranges in diabetic cats based on their body weight. It is designed to help veterinarians and pet owners understand the general dosing principles rather than to calculate exact doses. To use the tool, simply enter the cat’s weight in pounds or kilograms, select the appropriate unit system, and view the estimated dose range.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches your cat’s weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the cat’s accurate body weight in the input field.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the typical starting insulin dose range expressed in units per injection, given twice daily.
          </li>
          <li>
            <strong>Step 4:</strong> Use this information as a reference only and consult your veterinarian for personalized dosing and monitoring plans.
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
              href="https://www.aaha.org/guidelines/diabetes-mellitus/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AAHA Diabetes Management Guidelines for Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines outlining diagnosis, treatment, and monitoring of diabetes mellitus in cats, including insulin therapy recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/endocrine-system/diabetes-mellitus/diabetes-mellitus-in-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Diabetes Mellitus in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource describing pathophysiology, clinical signs, and treatment options for feline diabetes, including insulin dosing principles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/diabetes-in-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals: Diabetes in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Educational article for pet owners explaining diabetes management, insulin therapy, and the importance of veterinary guidance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Insulin Starter Reference (info-only)"
      description="Reference guide for starting and monitoring insulin therapy in diabetic cats (information-only, not a dose calculator)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Starting Dose (units) = Weight (kg) × 0.25 to 0.5",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Starting Dose (units)", description: "Insulin units per injection, twice daily" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) diabetic cat is beginning insulin therapy. The veterinarian wants to estimate a safe starting dose range.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 10 lb ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate lower dose: 4.54 kg × 0.25 units/kg = 1.14 units per injection.",
          },
          {
            label: "3",
            explanation:
              "Calculate upper dose: 4.54 kg × 0.5 units/kg = 2.27 units per injection.",
          },
          {
            label: "4",
            explanation:
              "Starting dose range is approximately 1.1 to 2.3 units per injection, given twice daily.",
          },
        ],
        result:
          "The cat’s initial insulin dose should be between 1.1 and 2.3 units per injection, administered twice daily, with close monitoring and veterinary guidance.",
      }}
      relatedCalculators={[
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "🐶" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Dog Pregnancy (Gestation) Due-Date Calculator", url: "/pets/dog-pregnancy-gestation-due-date", icon: "🐶" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Insulin Starter Reference (info-only)" },
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