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
  Activity,
  Calculator,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    weightLbs?: string;
    heightFt?: string;
    heightIn?: string;
    weightKg?: string;
    heightCm?: string;
  }>({});

  // 2. LOGIC
  const results = useMemo(() => {
    let bmiValue = 0;
    let label = "";
    let category = "";

    if (unit === "imperial") {
      const weight = parseFloat(inputs.weightLbs || "");
      const heightFt = parseFloat(inputs.heightFt || "");
      const heightIn = parseFloat(inputs.heightIn || "");
      if (
        !isNaN(weight) &&
        weight > 0 &&
        !isNaN(heightFt) &&
        heightFt >= 0 &&
        !isNaN(heightIn) &&
        heightIn >= 0
      ) {
        const totalInches = heightFt * 12 + heightIn;
        if (totalInches > 0) {
          bmiValue = (weight / (totalInches * totalInches)) * 703;
        }
      }
    } else {
      // metric
      const weight = parseFloat(inputs.weightKg || "");
      const heightCm = parseFloat(inputs.heightCm || "");
      if (
        !isNaN(weight) &&
        weight > 0 &&
        !isNaN(heightCm) &&
        heightCm > 0
      ) {
        const heightM = heightCm / 100;
        bmiValue = weight / (heightM * heightM);
      }
    }

    if (bmiValue > 0) {
      bmiValue = Math.round(bmiValue * 10) / 10; // 1 decimal place

      // BMI Categories (CDC/WHO)
      if (bmiValue < 18.5) {
        label = "Underweight";
        category = "Underweight";
      } else if (bmiValue < 25) {
        label = "Normal weight";
        category = "Healthy";
      } else if (bmiValue < 30) {
        label = "Overweight";
        category = "Overweight";
      } else {
        label = "Obese";
        category = "Obese";
      }
    }

    return { value: bmiValue, label, category };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is BMI and why does it matter?",
      answer: "BMI (Body Mass Index) is a measure of body fat based on height and weight that applies to adult men and women. It is calculated by dividing your weight in kilograms by your height in meters squared (kg/m²). BMI is widely used by healthcare professionals as a screening tool to identify potential weight-related health risks, including obesity, cardiovascular disease, and type 2 diabetes.",
    },
    {
      question: "What are the BMI categories and what do they mean?",
      answer: "BMI categories are defined as: Underweight (&lt;18.5), Normal weight (18.5–24.9), Overweight (25.0–29.9), and Obese (≥30.0). A BMI of 18.5 to 24.9 is considered a healthy weight range for most adults. BMI values outside this range may indicate increased health risks, though BMI is just one screening tool and should be considered alongside other health factors.",
    },
    {
      question: "How accurate is the BMI calculator?",
      answer: "The BMI calculator is accurate for population-level screening but has limitations for individuals. It does not distinguish between muscle mass and fat mass, so athletes or very muscular individuals may have a high BMI despite low body fat. Additionally, BMI may not be accurate for very short people, children, or the elderly, and should always be interpreted in context with other health assessments by a healthcare provider.",
    },
    {
      question: "What is the BMI formula and how is it calculated?",
      answer: "The BMI formula is: BMI = weight (kg) ÷ [height (m)]². For example, a person weighing 70 kg with a height of 1.75 m would have a BMI of 70 ÷ (1.75 × 1.75) = 22.9, which falls in the normal weight range. In imperial units, the formula is: BMI = [weight (lbs) ÷ height (in)²] × 703.",
    },
    {
      question: "Is BMI the same for men and women?",
      answer: "Yes, the BMI calculation and categories are the same for both men and women. However, body composition naturally differs between sexes—men typically have more muscle mass while women have higher body fat percentages at the same BMI. For this reason, some health professionals may interpret BMI results differently based on sex and age, but the numerical categories remain identical.",
    },
    {
      question: "What BMI is considered obese?",
      answer: "A BMI of 30.0 or higher is classified as obese. Obesity is further divided into Class 1 (30.0–34.9), Class 2 (35.0–39.9), and Class 3 (≥40.0). A BMI in the obese range is associated with increased risk of chronic diseases such as heart disease, stroke, type 2 diabetes, and certain cancers, according to the CDC.",
    },
    {
      question: "Can BMI be used for children and teenagers?",
      answer: "BMI can be calculated for children and teens, but it is interpreted differently than for adults. Children's BMI is age and sex-specific, using percentiles rather than fixed categories: underweight (&lt;5th percentile), healthy weight (5th–85th percentile), overweight (85th–95th percentile), and obese (≥95th percentile). Parents should use a pediatric BMI calculator or consult with a healthcare provider for accurate interpretation.",
    },
    {
      question: "What should I do if my BMI falls in the overweight or obese category?",
      answer: "If your BMI is 25.0 or higher, consult with your healthcare provider for personalized advice. They may recommend lifestyle changes such as a balanced diet, regular physical activity (150 minutes of moderate-intensity exercise weekly), stress management, and adequate sleep. Your doctor may also screen for weight-related health conditions and discuss whether additional interventions are appropriate.",
    },
    {
      question: "Does BMI account for muscle mass and bone density?",
      answer: "No, BMI does not distinguish between muscle, fat, and bone mass. Individuals with high muscle mass—such as athletes or strength trainers—may have an elevated BMI despite low body fat percentage. For a more detailed body composition assessment, healthcare providers may use tools like body fat percentage analysis, DEXA scans, or bioelectrical impedance analysis alongside BMI.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    setInputs((prev) => ({ ...prev, [field]: e.target.value }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({});
  }

  // Calculate button triggers recalculation by updating state (no form submit)
  // Here, calculation is done on every render via useMemo, so no explicit trigger needed.

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(value) => {
              setUnit(value);
              setInputs({});
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        {unit === "imperial" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weightLbs" className="text-slate-700 dark:text-slate-300">
                Weight (lbs)
              </Label>
              <Input
                id="weightLbs"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 150"
                value={inputs.weightLbs || ""}
                onChange={(e) => handleInputChange(e, "weightLbs")}
                aria-describedby="weightHelp"
              />
              <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your weight in pounds.
              </p>
            </div>
            <div>
              <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300">
                Height (ft)
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFt || ""}
                onChange={(e) => handleInputChange(e, "heightFt")}
                aria-describedby="heightHelp"
              />
            </div>
            <div>
              <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300">
                Height (in)
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step="any"
                placeholder="e.g. 7"
                value={inputs.heightIn || ""}
                onChange={(e) => handleInputChange(e, "heightIn")}
                aria-describedby="heightHelp"
              />
              <p id="heightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your height in feet and inches.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weightKg" className="text-slate-700 dark:text-slate-300">
                Weight (kg)
              </Label>
              <Input
                id="weightKg"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 68"
                value={inputs.weightKg || ""}
                onChange={(e) => handleInputChange(e, "weightKg")}
                aria-describedby="weightKgHelp"
              />
              <p id="weightKgHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your weight in kilograms.
              </p>
            </div>
            <div>
              <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
                Height (cm)
              </Label>
              <Input
                id="heightCm"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 170"
                value={inputs.heightCm || ""}
                onChange={(e) => handleInputChange(e, "heightCm")}
                aria-describedby="heightCmHelp"
              />
              <p id="heightCmHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your height in centimeters.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
            // But we can force a re-render by resetting inputs to current inputs
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate BMI"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the BMI — Body Mass Index Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The BMI Calculator is a simple screening tool that estimates your body mass index based on your height and weight. BMI is commonly used by healthcare professionals to identify potential weight-related health risks and to track changes in body weight over time. While BMI is not a direct measure of body fat, it serves as a practical starting point for health assessments in clinical and public health settings.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you will need to enter two key measurements: your height (in feet and inches, or centimeters) and your weight (in pounds or kilograms). Make sure to provide accurate, current measurements for the most reliable result. The calculator will then compute your BMI value using the standard formula: BMI = weight (kg) ÷ [height (m)]².</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive your BMI result, compare it to the standard categories: Underweight (&lt;18.5), Normal Weight (18.5–24.9), Overweight (25.0–29.9), and Obese (≥30.0). If your BMI falls outside the normal range, consider discussing the results with your healthcare provider, who can evaluate your individual health status, medical history, and fitness level. Remember that BMI is just one screening tool and does not account for muscle mass, bone density, or overall fitness.</p>
        </div>
      </section>

      {/* TABLE: BMI Categories and Health Risk Classifications */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">BMI Categories and Health Risk Classifications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the standard BMI categories used by the CDC and WHO, along with associated health risk levels for adults.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Health Implications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;18.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May indicate nutritional deficiency or underlying health issues</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Normal Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.5–24.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowest risk for weight-related chronic diseases</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.0–29.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased risk of hypertension, high cholesterol, and type 2 diabetes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese Class 1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30.0–34.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Significant risk of heart disease, stroke, and type 2 diabetes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese Class 2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35.0–39.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Substantially elevated risk of multiple chronic diseases</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese Class 3 (Severe Obesity)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">≥40.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extremely High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe health risks including sleep apnea, joint problems, and metabolic syndrome</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">BMI categories are based on CDC and WHO guidelines. Individual health risks vary based on age, fitness level, muscle mass, and other health factors.</p>
      </section>

      {/* TABLE: BMI Examples by Height and Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">BMI Examples by Height and Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how BMI varies across common heights and weights to help illustrate practical calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calculated BMI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'4" (163 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal Weight</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'4" (163 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal Weight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'4" (163 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'4" (163 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese Class 1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'10" (178 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">59</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal Weight</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'10" (178 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">79.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'10" (178 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese Class 1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'0" (183 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal Weight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'0" (183 cm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These examples show how the same weight can result in different BMI categories depending on height. Use your actual measurements for accuracy.</p>
      </section>

      {/* TABLE: Obesity Prevalence and Health Burden in the United States (2021-2022) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Obesity Prevalence and Health Burden in the United States (2021-2022)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table presents recent data on obesity rates and associated health statistics in the U.S. adult population.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Demographic Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Obesity Rate (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severe Obesity Rate (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Health Concerns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">All U.S. Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Type 2 diabetes, cardiovascular disease, hypertension</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Non-Hispanic White Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Metabolic syndrome, joint and bone disorders</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Non-Hispanic Black Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Higher rates of hypertension and kidney disease</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hispanic/Latino Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Type 2 diabetes, sleep apnea</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Non-Hispanic Asian Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lower obesity rates but still elevated health risks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Men</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cardiovascular disease, erectile dysfunction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Women</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Polycystic ovary syndrome, infertility</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data sourced from CDC National Health and Nutrition Examination Survey (NHANES) 2021-2022. Severe obesity is defined as BMI ≥40.0.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your height and weight accurately in the morning without shoes and heavy clothing for the most consistent BMI results. Use a reliable scale and a height measurement tool, or ask a healthcare provider for precise measurements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you are very muscular or an athlete, be aware that your BMI may overestimate body fat because muscle weighs more than fat. Discuss your results with a healthcare provider who can assess your body composition using additional methods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your BMI over time rather than focusing on a single calculation. Recording BMI monthly or quarterly can help you identify trends and evaluate the effectiveness of lifestyle changes such as diet and exercise.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your BMI result as a conversation starter with your healthcare provider rather than as a definitive diagnosis. Combined with other health markers like blood pressure, cholesterol, blood sugar, and fitness level, BMI provides a more complete picture of your health status.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using BMI as the only indicator of health</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people assume that a high BMI automatically means poor health, but BMI is just a screening tool. Factors like cardiovascular fitness, muscle mass, bone density, blood pressure, and cholesterol levels are equally important for assessing overall health. Always consult a healthcare provider for a comprehensive health evaluation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring differences between muscle and fat</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Athletes and individuals with high muscle mass may have elevated BMI values despite low body fat percentages. BMI does not distinguish between muscle and fat, so muscular individuals should not be alarmed by a higher BMI without considering body composition analysis.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying adult BMI categories to children</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Children and adolescents require age and sex-specific BMI percentile calculations, not adult BMI categories. Using adult categories for children can lead to misinterpretation of results. Parents should use pediatric BMI calculators or consult a pediatrician for accurate assessment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Taking inaccurate body measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Errors in height or weight measurements directly affect BMI accuracy. Measure without shoes, heavy clothing, or accessories, and use calibrated scales and reliable measurement tools. Inconsistent measurements can lead to incorrect BMI calculations and misleading health conclusions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is BMI and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI (Body Mass Index) is a measure of body fat based on height and weight that applies to adult men and women. It is calculated by dividing your weight in kilograms by your height in meters squared (kg/m²). BMI is widely used by healthcare professionals as a screening tool to identify potential weight-related health risks, including obesity, cardiovascular disease, and type 2 diabetes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the BMI categories and what do they mean?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI categories are defined as: Underweight (&lt;18.5), Normal weight (18.5–24.9), Overweight (25.0–29.9), and Obese (≥30.0). A BMI of 18.5 to 24.9 is considered a healthy weight range for most adults. BMI values outside this range may indicate increased health risks, though BMI is just one screening tool and should be considered alongside other health factors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the BMI calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The BMI calculator is accurate for population-level screening but has limitations for individuals. It does not distinguish between muscle mass and fat mass, so athletes or very muscular individuals may have a high BMI despite low body fat. Additionally, BMI may not be accurate for very short people, children, or the elderly, and should always be interpreted in context with other health assessments by a healthcare provider.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the BMI formula and how is it calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The BMI formula is: BMI = weight (kg) ÷ [height (m)]². For example, a person weighing 70 kg with a height of 1.75 m would have a BMI of 70 ÷ (1.75 × 1.75) = 22.9, which falls in the normal weight range. In imperial units, the formula is: BMI = [weight (lbs) ÷ height (in)²] × 703.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is BMI the same for men and women?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the BMI calculation and categories are the same for both men and women. However, body composition naturally differs between sexes—men typically have more muscle mass while women have higher body fat percentages at the same BMI. For this reason, some health professionals may interpret BMI results differently based on sex and age, but the numerical categories remain identical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What BMI is considered obese?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A BMI of 30.0 or higher is classified as obese. Obesity is further divided into Class 1 (30.0–34.9), Class 2 (35.0–39.9), and Class 3 (≥40.0). A BMI in the obese range is associated with increased risk of chronic diseases such as heart disease, stroke, type 2 diabetes, and certain cancers, according to the CDC.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can BMI be used for children and teenagers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI can be calculated for children and teens, but it is interpreted differently than for adults. Children's BMI is age and sex-specific, using percentiles rather than fixed categories: underweight (&lt;5th percentile), healthy weight (5th–85th percentile), overweight (85th–95th percentile), and obese (≥95th percentile). Parents should use a pediatric BMI calculator or consult with a healthcare provider for accurate interpretation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my BMI falls in the overweight or obese category?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your BMI is 25.0 or higher, consult with your healthcare provider for personalized advice. They may recommend lifestyle changes such as a balanced diet, regular physical activity (150 minutes of moderate-intensity exercise weekly), stress management, and adequate sleep. Your doctor may also screen for weight-related health conditions and discuss whether additional interventions are appropriate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does BMI account for muscle mass and bone density?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, BMI does not distinguish between muscle, fat, and bone mass. Individuals with high muscle mass—such as athletes or strength trainers—may have an elevated BMI despite low body fat percentage. For a more detailed body composition assessment, healthcare providers may use tools like body fat percentage analysis, DEXA scans, or bioelectrical impedance analysis alongside BMI.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC - Body Mass Index (BMI)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CDC resource explaining BMI categories, calculation methods, and health implications for adults and children.</p>
          </li>
          <li>
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Heart, Lung, and Blood Institute - BMI Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NHLBI-endorsed BMI information and calculator with clinical guidelines for interpreting results.</p>
          </li>
          <li>
            <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">World Health Organization - Obesity and Overweight</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Global obesity statistics, BMI definitions, and WHO guidelines for health risk assessment based on BMI.</p>
          </li>
          <li>
            <a href="https://medlineplus.gov/bmi.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">MedlinePlus - Body Mass Index (BMI)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive medical information on BMI, its uses, limitations, and relationship to various health conditions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      canonical="/health/bmi-body-mass-index"
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "BMI = (Weight / Height²) × Conversion Factor",
        variables: [
          {
            symbol: "Weight",
            description:
              "Your body weight (lbs in imperial, kg in metric).",
          },
          {
            symbol: "Height",
            description:
              "Your height (inches in imperial, meters in metric).",
          },
          {
            symbol: "Conversion Factor",
            description:
              "703 for imperial units to adjust for inches and pounds; 1 for metric units.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A person weighs 180 lbs and is 5 feet 10 inches tall. They want to know their BMI to assess their weight status.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to total inches: (5 × 12) + 10 = 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the BMI formula: BMI = (180 / 70²) × 703 = (180 / 4900) × 703 ≈ 25.8.",
          },
        ],
        result:
          "The BMI is approximately 25.8, which falls into the 'Overweight' category.",
      }}
      relatedCalculators={[
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "⚖️",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "❤️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "💧",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🥗",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is BMI — Body Mass Index Calculator?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}