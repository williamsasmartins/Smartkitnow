import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseWeightEstimatorGirthLengthCalculator() {
  // 1. STATE
  // Default unit system is imperial (inches, pounds)
  const [unit, setUnit] = useState("imperial");

  // Inputs: heart girth and body length
  // Both are numbers (inches or cm depending on unit)
  const [inputs, setInputs] = useState({
    heartGirth: "",
    bodyLength: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: 
  // Weight (kg) = (Heart Girth^2 * Body Length) / 11877 (metric cm)
  // or Weight (lbs) = (Heart Girth^2 * Body Length) / 330 (imperial inches)
  // Reference: Carroll and Huntington (1988) formula for horse weight estimation

  const results = useMemo(() => {
    const girth = parseFloat(inputs.heartGirth);
    const length = parseFloat(inputs.bodyLength);

    if (isNaN(girth) || isNaN(length) || girth <= 0 || length <= 0) {
      return {
        value: 0,
        label: "Estimated Weight",
        subtext: "Please enter valid positive numbers for both measurements.",
        warning: null,
      };
    }

    let weightKg = 0;
    let weightLbs = 0;

    if (unit === "imperial") {
      // inches to pounds
      weightLbs = (girth * girth * length) / 330;
      weightKg = weightLbs / 2.20462;
    } else {
      // metric cm to kg
      weightKg = (girth * girth * length) / 11877;
      weightLbs = weightKg * 2.20462;
    }

    // Round results to 1 decimal place
    const roundedWeight = unit === "imperial" ? weightLbs.toFixed(1) : weightKg.toFixed(1);

    // Warning if values are unusually small or large (basic sanity check)
    let warning = null;
    if (weightKg < 50) {
      warning = "The estimated weight is very low; please verify your measurements.";
    } else if (weightKg > 1200) {
      warning = "The estimated weight is very high; please verify your measurements.";
    }

    return {
      value: roundedWeight,
      label: unit === "imperial" ? "Pounds (lbs)" : "Kilograms (kg)",
      subtext: "Based on heart girth and body length measurements",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is heart girth used to estimate a horse's weight?",
      answer:
        "Heart girth is a reliable proxy for a horse's body mass because it reflects the circumference of the chest, which correlates closely with overall body volume. Measuring heart girth is non-invasive and easy to perform, making it practical for owners and veterinarians alike. This measurement, combined with body length, provides a more accurate estimate than using girth alone, as it accounts for the horse's overall body shape.",
    },
    {
      question: "How accurate is the heart girth and length method compared to a scale?",
      answer:
        "While weighing scales provide the most precise measurement of a horse's weight, they are not always accessible or practical. The heart girth and length method offers a close approximation, typically within 5-10% of the actual weight, which is sufficient for most veterinary and management purposes. However, factors such as breed, body condition, and conformation can influence accuracy, so this method should be used as a guide rather than an absolute measurement.",
    },
    {
      question: "Can this calculator be used for all horse breeds and ages?",
      answer:
        "This estimator is generally suitable for adult horses of various breeds, but it may be less accurate for foals, very young horses, or breeds with unusual body conformations. Ponies, draft horses, and miniature breeds may require breed-specific adjustments or alternative formulas. Always consider the horse's age, breed, and condition when interpreting the results and consult a veterinarian for critical health decisions.",
    },
    {
      question: "Why does the formula differ between imperial and metric units?",
      answer:
        "The formula constants differ because the measurements are in different units—imperial uses inches and pounds, while metric uses centimeters and kilograms. The divisor values (330 for imperial and 11877 for metric) normalize the calculation to produce weight estimates in the correct units. Using the appropriate constant ensures the formula remains scientifically valid and the results are accurate regardless of the unit system.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
              <SelectItem value="metric">Metric (cm, kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="heartGirth" className="text-slate-700 dark:text-slate-300">
            Heart Girth ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="heartGirth"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter heart girth in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.heartGirth}
            onChange={(e) => setInputs((prev) => ({ ...prev, heartGirth: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="bodyLength" className="text-slate-700 dark:text-slate-300">
            Body Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="bodyLength"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter body length in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.bodyLength}
            onChange={(e) => setInputs((prev) => ({ ...prev, bodyLength: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ heartGirth: "", bodyLength: "" })}
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

  // Editorial content with rich paragraphs
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Weight Estimator (Heart Girth & Length)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Estimating a horse's weight accurately is essential for proper health management, medication dosing, and nutritional planning. Direct weighing scales are often unavailable or impractical, especially in field conditions, so alternative methods have been developed. One of the most reliable and widely used approaches involves measuring the heart girth and body length of the horse, which together provide a strong correlation to the animal's overall body mass.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The heart girth measurement captures the circumference around the horse's chest just behind the front legs, reflecting the volume of the thoracic cavity and musculature. Body length, measured from the point of the shoulder to the point of the buttock, complements this by accounting for the horse's longitudinal body dimension. Combining these two measurements in a scientifically validated formula allows for an estimation of body weight that is both practical and sufficiently accurate for most veterinary and management needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate weight estimate using this calculator, you will need a flexible measuring tape and a helper to ensure correct positioning. Measurements should be taken carefully to avoid errors that could significantly affect the result. This tool supports both imperial and metric units, so select the unit system that matches your measuring tape before entering values.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure the heart girth by wrapping the tape around the horse's chest just behind the front legs and withers, ensuring the tape is snug but not tight.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the body length from the point of the shoulder to the point of the buttock, keeping the tape parallel to the ground.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the measurements into the calculator in the selected unit system and click "Calculate" to see the estimated weight.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result as a guide for feeding, medication dosing, or health assessments, and consult a veterinarian for precise needs.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1769497/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Carroll, C.L., & Huntington, P.J. (1988). Body condition scoring and weight estimation of horses.
            </a>
            <p className="text-slate-500 text-sm">
              This seminal paper presents validated formulas for estimating horse weight using heart girth and body length, widely adopted in veterinary practice.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/How_to_Estimate_Horse_Weight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Extension.org - How to Estimate Horse Weight
            </a>
            <p className="text-slate-500 text-sm">
              A practical guide for horse owners on measuring and estimating weight, emphasizing the importance of accurate measurements for health management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Weight Estimator (Heart Girth & Length)"
      description="Estimate your horse's body weight accurately using heart girth circumference and body length measurements."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          'Weight (lbs) = (Heart Girth² × Body Length) ÷ 330  (Imperial units)  OR  Weight (kg) = (Heart Girth² × Body Length) ÷ 11877  (Metric units)',
        variables: [
          { symbol: "Heart Girth", description: "Circumference of the chest just behind the front legs" },
          { symbol: "Body Length", description: "Distance from point of shoulder to point of buttock" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse owner measures the heart girth as 75 inches and the body length as 80 inches using an imperial tape measure.",
        steps: [
          {
            label: "1",
            explanation:
              "Square the heart girth: 75 × 75 = 5625. Multiply by body length: 5625 × 80 = 450,000.",
          },
          {
            label: "2",
            explanation:
              "Divide by 330 to estimate weight in pounds: 450,000 ÷ 330 ≈ 1363.6 lbs.",
          },
        ],
        result: "The estimated weight of the horse is approximately 1364 pounds.",
      }}
      relatedCalculators={[
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐾" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Safe Stocking Density (Fish/cm per Litre)", url: "/pets/aquarium-safe-stocking-density-fish-per-litre", icon: "🐱" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🍖" },
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "💉" },
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Weight Estimator (Heart Girth & Length)" },
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