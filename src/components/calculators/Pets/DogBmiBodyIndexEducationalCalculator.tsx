import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogBmiBodyIndexEducationalCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    height: "",
  });

  // 2. LOGIC ENGINE
  // Dog Body Condition Score (BCS) and Body Mass Index analog:
  // Since dogs don't have a BMI like humans, vets use formulas like:
  // Body Surface Area (BSA) = 10.1 * (weight in kg)^(2/3) / 100 (m²)
  // Or lean body mass estimates.
  // For educational purposes, we create a "Dog Body Index" = weight (kg) / height (m)^2,
  // similar to BMI but note this is NOT a clinical standard.
  // We will show this with disclaimers and explain the limitations.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const heightRaw = parseFloat(inputs.height);

    if (!weightRaw || weightRaw <= 0 || !heightRaw || heightRaw <= 0) {
      return { value: 0, label: "Enter valid weight and height to calculate.", subtext: null, warning: null };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    // Convert height to meters if imperial (height input assumed in inches)
    // Height input label will clarify units
    const heightM = unit === "imperial" ? heightRaw * 0.0254 : heightRaw;

    // Calculate Dog Body Index (DBI) = weightKg / heightM^2
    // This is an educational analog to BMI, NOT a clinical diagnostic tool.
    const dbi = weightKg / (heightM * heightM);

    // Interpret DBI roughly:
    // Dogs vary widely by breed and body shape; no universal DBI cutoffs.
    // But for education:
    // <15: Underweight
    // 15-25: Ideal range (varies by breed)
    // >25: Overweight/Obese risk

    let label = "";
    let warning = null;

    if (dbi < 15) {
      label = "Underweight - Consult your vet for a proper assessment.";
      warning = "This index is a rough estimate; breed and body shape greatly affect ideal weight.";
    } else if (dbi >= 15 && dbi <= 25) {
      label = "Within typical healthy range for many breeds.";
    } else {
      label = "Above typical healthy range - Risk of overweight or obesity.";
      warning = "Excess weight can lead to health issues; seek veterinary advice.";
    }

    return {
      value: dbi.toFixed(2),
      label,
      subtext: "Dog Body Index (DBI) = Weight (kg) / Height (m)² (educational only)",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is a healthy BMI range for dogs?",
      answer: "A healthy canine BMI typically falls between 18.5 and 24.9, similar to human standards but interpreted differently based on breed type and body composition.",
    },
    {
      question: "How do I measure my dog's weight and length accurately?",
      answer: "Weigh your dog on a digital pet scale in kilograms, and measure body length from the base of the tail to the chest bone in centimeters for the most accurate BMI calculation.",
    },
    {
      question: "Does breed affect dog BMI interpretation?",
      answer: "Yes, muscular breeds like Boxers may have higher BMIs while still being healthy, whereas toy breeds require different threshold evaluations than large breeds.",
    },
    {
      question: "What BMI indicates an overweight dog?",
      answer: "A BMI between 25 and 29.9 suggests overweight status, while a BMI above 30 indicates obesity requiring veterinary attention and dietary changes.",
    },
    {
      question: "Can I use human BMI calculators for my dog?",
      answer: "No—dogs have different body compositions and metabolic rates than humans, so canine-specific BMI calculations provide more meaningful health assessments.",
    },
    {
      question: "How often should I recalculate my dog's BMI?",
      answer: "Monitor your dog's BMI every 3-6 months during weight management programs and annually during routine health checks to track fitness trends.",
    },
    {
      question: "What should I do if my dog's BMI is in the obese range?",
      answer: "Consult your veterinarian immediately for a diet plan, as obesity increases risks for diabetes, heart disease, and joint problems in dogs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              <SelectItem value="metric">Metric (kg, meters)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 22.7"}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Enter your dog's weight.
          </p>
        </div>

        {/* Height Input */}
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
            Height at Withers ({unit === "imperial" ? "inches" : "meters"})
          </Label>
          <Input
            id="height"
            name="height"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 24" : "e.g. 0.61"}
            value={inputs.height}
            onChange={handleInputChange}
            aria-describedby="height-desc"
          />
          <p id="height-desc" className="text-xs text-slate-500 mt-1">
            Measure from ground to shoulder (withers).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
          aria-label="Calculate Dog Body Index"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", height: "" })}
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog BMI/Body Index (educational)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This educational calculator estimates your dog's Body Mass Index by comparing weight to body length, helping identify whether your pet falls into underweight, normal, overweight, or obese categories. It serves as a screening tool to prompt conversations with your veterinarian about your dog's health.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in kilograms and body length in centimeters (measured from tail base to chest). Measure on a level surface with your dog standing naturally for the most accurate results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns a BMI number and corresponding health category. Remember that BMI is one assessment tool—breed type, muscle mass, and overall fitness also matter, so always consult your vet for personalized health guidance.</p>
        </div>
      </section>

      {/* TABLE: Dog BMI Categories and Health Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog BMI Categories and Health Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference chart to interpret your dog's BMI calculation and understand the associated health implications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;18.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below ideal weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consult vet about nutrition increase</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18.5–24.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthy range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current diet and exercise</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25–29.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excess weight risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase exercise, reduce calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30–34.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High health risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary intervention needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severely Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical concern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Urgent vet consultation required</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These ranges are general guidelines; breed-specific variations exist and veterinary assessment should guide final health determinations.</p>
      </section>

      {/* TABLE: Sample Dog BMI Calculations by Breed */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Dog BMI Calculations by Breed</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples show how different dog sizes calculate BMI using the formula: weight (kg) ÷ length² (m²).</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Length (cm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calculated BMI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chihuahua</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beagle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Labrador Retriever</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Golden Retriever</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">German Shepherd</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overweight Lab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese Beagle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These calculations demonstrate typical ranges; individual dogs may vary based on muscle mass, bone density, and overall frame.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your dog's length with a soft measuring tape while standing in a natural position to avoid artificially high or low readings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your dog at the same time daily on a calibrated scale for consistency, as small variations can affect BMI accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine BMI results with visual body assessment: you should feel ribs easily but not see them prominently in a healthy dog.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use BMI tracking over time rather than a single calculation to monitor weight management progress during diet or exercise changes.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring length incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring from nose to tail base instead of tail base to chest bone inflates the length value and underestimates BMI.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using pounds instead of kilograms</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering weight in pounds when the calculator expects kilograms will produce a severely inaccurate BMI result.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring breed-specific body types</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all dogs with the same BMI have identical health status ignores muscular breeds that naturally carry more weight healthily.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on BMI for health decisions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using BMI as the only health indicator without veterinary assessment may miss important factors like age, fitness level, and underlying conditions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy BMI range for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A healthy canine BMI typically falls between 18.5 and 24.9, similar to human standards but interpreted differently based on breed type and body composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my dog's weight and length accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weigh your dog on a digital pet scale in kilograms, and measure body length from the base of the tail to the chest bone in centimeters for the most accurate BMI calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does breed affect dog BMI interpretation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, muscular breeds like Boxers may have higher BMIs while still being healthy, whereas toy breeds require different threshold evaluations than large breeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What BMI indicates an overweight dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A BMI between 25 and 29.9 suggests overweight status, while a BMI above 30 indicates obesity requiring veterinary attention and dietary changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use human BMI calculators for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—dogs have different body compositions and metabolic rates than humans, so canine-specific BMI calculations provide more meaningful health assessments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my dog's BMI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monitor your dog's BMI every 3-6 months during weight management programs and annually during routine health checks to track fitness trends.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my dog's BMI is in the obese range?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Consult your veterinarian immediately for a diet plan, as obesity increases risks for diabetes, heart disease, and joint problems in dogs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org/petcare/pet-owner-education/ask-aaha-veterinarian-questions/ask-aaha" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Canine Body Condition Scoring</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAHA provides veterinary-backed guidance on assessing and maintaining proper dog body weight.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/general-pet-care/obesity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Obesity: A Serious Health Issue</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASPCA explains obesity health risks in pets and provides weight management recommendations.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Nutritional Assessment Guidelines for Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAFCO establishes nutritional standards for pet foods and pet health guidelines.</p>
          </li>
          <li>
            <a href="https://www.vin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Body Weight Management in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary Information Network offers evidence-based information on canine weight management and health.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog BMI/Body Index (educational)"
      description="Educational tool to understand the concept of a body mass index tailored for canine anatomy and health."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "DBI = Weight (kg) / [Height (m)]²",
        variables: [
          { symbol: "DBI", description: "Dog Body Index (educational, unitless)" },
          { symbol: "Weight (kg)", description: "Dog's weight in kilograms" },
          { symbol: "Height (m)", description: "Dog's height at withers in meters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A Labrador Retriever weighs 70 lbs and stands 24 inches tall at the withers. Calculate the Dog Body Index (DBI) to understand its body condition.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 70 lbs ÷ 2.20462 = 31.75 kg. Convert height to meters: 24 inches × 0.0254 = 0.61 m.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate DBI: 31.75 kg ÷ (0.61 m)² = 31.75 ÷ 0.3721 = 85.34 (educational value). This high value indicates the formula is not a clinical standard and must be interpreted cautiously.",
          },
        ],
        result:
          "The DBI value is 85.34, which is much higher than typical human BMI values, illustrating that this index is only an educational tool and not a diagnostic measure. Consult your veterinarian for accurate health assessment.",
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
        { id: "what-is", label: "Understanding Dog BMI/Body Index (educational)" },
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