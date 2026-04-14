import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatBmiBodyIndexEducationalCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs, inches)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and length (body length from nose to base of tail)
  const [inputs, setInputs] = useState({
    weight: "",
    length: "",
  });

  // 2. LOGIC ENGINE
  // Cat Body Condition Score (BCS) Index (educational proxy) calculated as:
  // Body Index = Weight (kg) / Length (m)^2
  // This is NOT BMI but a simplified educational index to show body condition trends.
  // Weight converted from lbs to kg if needed, length from inches to meters.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const lengthRaw = parseFloat(inputs.length);

    if (
      isNaN(weightRaw) ||
      isNaN(lengthRaw) ||
      weightRaw <= 0 ||
      lengthRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to metric
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    const lengthM = unit === "imperial" ? lengthRaw * 0.0254 : lengthRaw;

    // Calculate Body Index (kg/m^2)
    const bodyIndex = weightKg / (lengthM * lengthM);

    // Interpretation based on rough ranges (educational only)
    let label = "";
    let warning = null;
    if (bodyIndex < 30) {
      label = "Underweight - Possible malnutrition or illness";
      warning =
        "If your cat's body index is low, consult a veterinarian to rule out health issues.";
    } else if (bodyIndex >= 30 && bodyIndex <= 45) {
      label = "Ideal weight range - Healthy body condition";
    } else if (bodyIndex > 45) {
      label = "Overweight - Risk of obesity-related health problems";
      warning =
        "High body index may indicate obesity. Consider veterinary advice for weight management.";
    }

    return {
      value: bodyIndex.toFixed(1),
      label,
      subtext:
        "This index is an educational tool and not a diagnostic measure. Consult your vet for health assessments.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is a healthy BMI range for cats?",
      answer: "A healthy cat BMI typically ranges from 18.5 to 24.9, similar to human standards. Cats with BMI below 18.5 are considered underweight, while those above 25 may be overweight or obese.",
    },
    {
      question: "How do I measure my cat's weight and length accurately?",
      answer: "Weigh your cat on a digital scale in kilograms and measure body length in centimeters from nose to tail base. For best results, weigh your cat at the same time daily and use a soft measuring tape for length.",
    },
    {
      question: "Why is cat BMI important for health?",
      answer: "Maintaining a healthy BMI helps prevent obesity-related diseases in cats such as diabetes, arthritis, and heart disease. Overweight cats have a shorter lifespan and reduced quality of life.",
    },
    {
      question: "Can I use this calculator for kittens?",
      answer: "This calculator is designed for adult cats (typically 1+ years old) and may not be accurate for kittens, whose growth patterns differ significantly. Consult your veterinarian for kitten growth assessments.",
    },
    {
      question: "What's the difference between BMI and body condition scoring for cats?",
      answer: "BMI is a mathematical calculation based on weight and length, while body condition scoring is a visual assessment of rib visibility and waist definition. Both are useful tools for evaluating feline health.",
    },
    {
      question: "How often should I check my cat's BMI?",
      answer: "Monitor your cat's BMI quarterly or during veterinary checkups to track weight trends and adjust diet accordingly. More frequent checks are helpful if your cat is on a weight management program.",
    },
    {
      question: "Are certain cat breeds prone to higher BMI?",
      answer: "Larger breeds like Maine Coons and Ragdolls may naturally have higher BMI values than smaller breeds like Siamese. Always consult breed-specific guidelines and your veterinarian for target weight ranges.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onChangeInput(field: "weight" | "length", value: string) {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              <SelectItem value="metric">Metric (kg, meters)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={(e) => onChangeInput("weight", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Body Length (nose to base of tail) ({unit === "imperial" ? "inches" : "meters"})
          </Label>
          <Input
            id="length"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 18" : "e.g. 0.46"}
            value={inputs.length}
            onChange={(e) => onChangeInput("length", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", length: "" })}
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
                Estimated Body Index
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat BMI/Body Index (educational)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This educational calculator estimates your cat's Body Mass Index (BMI) based on weight and body length, helping you assess whether your feline friend is at a healthy weight. Unlike breed-specific growth charts, BMI provides a standardized metric applicable to most domestic cats.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your cat's weight in kilograms and body length in centimeters (measured from nose to tail base). Ensure measurements are taken when your cat is calm and standing naturally for the most accurate results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns a BMI score and corresponding health category (underweight, healthy, overweight, or obese). Use this result as a conversation starter with your veterinarian, who can provide personalized dietary and exercise recommendations based on your cat's age, breed, and medical history.</p>
        </div>
      </section>

      {/* TABLE: Cat BMI Categories and Health Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cat BMI Categories and Health Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to understand what your cat's BMI score means for their health.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;18.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Malnutrition, immune issues</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase portions, consult vet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18.5–24.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthy Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal health risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current diet and exercise</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25.0–29.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Elevated disease risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce calories, increase activity</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">≥30.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diabetes, arthritis risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consult vet for weight loss plan</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">BMI categories are educational guidelines; always consult your veterinarian for personalized advice.</p>
      </section>

      {/* TABLE: Average Adult Cat Weight by Breed */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Adult Cat Weight by Breed</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference weights help establish realistic BMI targets for different cat breeds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Length (cm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical BMI Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Siamese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5–3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–22</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Domestic Shorthair (small)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0–4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19–24</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Domestic Shorthair (large)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5–5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32–38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–24</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maine Coon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5–11.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38–45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21–26</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Persian</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5–5.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ragdoll</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5–6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32–38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–24</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual cats vary; use these as reference points, not absolutes, and consult your vet for breed-specific guidance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your cat's length without stretching; place a tape measure along their spine from nose to the base of the tail.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your cat on the same digital scale each time to ensure consistency and detect meaningful weight changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">A healthy cat should have a visible waist when viewed from above and ribs that are easily felt but not visibly protruding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine BMI results with body condition scoring (visual assessment) for a more complete picture of your cat's health status.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including tail length in body measurement</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measure only from nose to the base of the tail, not the full tail length, to get accurate BMI calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using inconsistent weight measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Weigh your cat before meals and at the same time daily; post-meal weights can vary by 0.5 kg and skew BMI results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying one BMI standard to all breeds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Larger breeds like Maine Coons have naturally higher healthy BMI ranges; comparing them to Siamese cats using identical standards is misleading.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring veterinary input on healthy weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">BMI is educational only; your veterinarian should always make final health assessments based on individual cat health factors.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy BMI range for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A healthy cat BMI typically ranges from 18.5 to 24.9, similar to human standards. Cats with BMI below 18.5 are considered underweight, while those above 25 may be overweight or obese.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my cat's weight and length accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Weigh your cat on a digital scale in kilograms and measure body length in centimeters from nose to tail base. For best results, weigh your cat at the same time daily and use a soft measuring tape for length.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is cat BMI important for health?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maintaining a healthy BMI helps prevent obesity-related diseases in cats such as diabetes, arthritis, and heart disease. Overweight cats have a shorter lifespan and reduced quality of life.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for kittens?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is designed for adult cats (typically 1+ years old) and may not be accurate for kittens, whose growth patterns differ significantly. Consult your veterinarian for kitten growth assessments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between BMI and body condition scoring for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI is a mathematical calculation based on weight and length, while body condition scoring is a visual assessment of rib visibility and waist definition. Both are useful tools for evaluating feline health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check my cat's BMI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monitor your cat's BMI quarterly or during veterinary checkups to track weight trends and adjust diet accordingly. More frequent checks are helpful if your cat is on a weight management program.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are certain cat breeds prone to higher BMI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger breeds like Maine Coons and Ragdolls may naturally have higher BMI values than smaller breeds like Siamese. Always consult breed-specific guidelines and your veterinarian for target weight ranges.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO (Association of American Feed Control Officials) Nutrient Profiles for Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides standardized feline nutrition guidelines and weight management recommendations for cat health.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The American Veterinary Medical Association (AVMA) Pet Obesity Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Offers evidence-based information on recognizing and managing obesity in companion animals including cats.</p>
          </li>
          <li>
            <a href="https://www.vet.cornell.edu/feline-health-center" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cornell Feline Health Center – Weight Management for Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides veterinary research and clinical guidance on assessing and maintaining ideal cat body weight.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care – Feline Body Condition Scoring</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resource on visual body condition assessment and weight management strategies for domestic cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat BMI/Body Index (educational)"
      description="Educational tool to understand the concept of a feline body mass index for health tracking."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Body Index = Weight (kg) / Length (m)²",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Length (m)", description: "Body length from nose to base of tail in meters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A domestic cat weighs 10 lbs and measures 18 inches from nose to base of tail. The owner wants to estimate the cat’s body index to monitor health.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg. Convert length to meters: 18 inches × 0.0254 = 0.457 m.",
          },
          {
            label: "2",
            explanation:
              "Calculate body index: 4.54 kg ÷ (0.457 m)² = 4.54 ÷ 0.209 = 21.7 (rounded).",
          },
          {
            label: "3",
            explanation:
              "Interpretation: A body index of 21.7 suggests the cat is underweight based on this educational index, prompting a vet consultation.",
          },
        ],
        result: "Estimated Body Index: 21.7 (Underweight range)",
      }}
      relatedCalculators={[
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
        { title: "Dog Xylitol Exposure Risk Calculator", url: "/pets/dog-xylitol-exposure-risk", icon: "🐶" },
        { title: "Play Session Planner (Feather/Chase Time Targets)", url: "/pets/cat-play-session-planner", icon: "🍖" },
        { title: "Kitten Adult Weight Predictor", url: "/pets/kitten-adult-weight-predictor", icon: "💉" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat BMI/Body Index (educational)" },
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