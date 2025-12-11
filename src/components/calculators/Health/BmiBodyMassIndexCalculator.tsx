import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Info, TrendingUp, Activity, Scale, AlertCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function BmiBodyMassIndexCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{ weight?: string; height?: string }>({});

  // --- LOGIC ---
  const results = useMemo(() => {
    // 1. Parse Inputs (Safety check)
    const weightRaw = inputs.weight?.trim();
    const heightRaw = inputs.height?.trim();
    if (!weightRaw || !heightRaw) return null;
    const weight = Number(weightRaw);
    const height = Number(heightRaw);
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) return null;

    // 2. Convert Units if needed
    // BMI formula:
    // Metric: BMI = weight(kg) / height(m)^2
    // Imperial: BMI = (weight(lb) / height(in)^2) * 703
    let bmi: number;
    if (unit === "metric") {
      // height input assumed in cm, convert to meters
      const heightMeters = height / 100;
      bmi = weight / (heightMeters * heightMeters);
    } else {
      // imperial: weight in lb, height in inches
      bmi = (weight / (height * height)) * 703;
    }
    const bmiRounded = Math.round(bmi * 10) / 10;

    // 3. Determine Status/Color (Critical for UX!)
    // WHO BMI Categories:
    // Underweight: < 18.5 (text-rose-600)
    // Normal weight: 18.5–24.9 (text-green-600)
    // Overweight: 25–29.9 (text-amber-600)
    // Obese: >= 30 (text-rose-600)
    let status = "";
    let color = "";
    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-rose-600";
    } else if (bmi < 25) {
      status = "Normal weight";
      color = "text-green-600";
    } else if (bmi < 30) {
      status = "Overweight";
      color = "text-amber-600";
    } else {
      status = "Obese";
      color = "text-rose-600";
    }

    return { val: bmiRounded, status, color };
  }, [inputs, unit]);

  // --- SEO SCHEMA ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are underweight, normal weight, overweight, or obese. It helps assess health risks related to body weight.",
    },
    {
      question: "Can I use this calculator with metric and imperial units?",
      answer:
        "Yes, you can toggle between metric (kilograms and centimeters) and imperial (pounds and inches) units to enter your measurements.",
    },
    {
      question: "Is BMI a perfect measure of health?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat or health. Other factors like muscle mass, age, and gender should also be considered.",
    },
    {
      question: "How often should I check my BMI?",
      answer:
        "It is recommended to check your BMI periodically, especially if you are making lifestyle changes or monitoring your health with your healthcare provider.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET ---
  const widget = (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {/* IF PHYSICAL: Toggle Button Group (Imperial | Metric) */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUnit("imperial")}
              type="button"
            >
              Imperial (lb, in)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUnit("metric")}
              type="button"
            >
              Metric (kg, cm)
            </Button>
          </div>

          {/* INPUTS: Use styled Input/Select */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Weight ({unit === "imperial" ? "lb" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
              value={inputs.weight || ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="height" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "imperial" ? "e.g. 70" : "e.g. 175"}
              value={inputs.height || ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, height: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            // Trigger recalculation by updating inputs state with current values trimmed
            setInputs((prev) => ({
              weight: prev.weight?.trim() || "",
              height: prev.height?.trim() || "",
            }));
          }}
          type="button"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() => setInputs({})}
          type="button"
        >
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          {/* MAIN RESULT - EXACT LOAN PAYMENT STYLE */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Main Value */}
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {results.val}
              </p>

              {/* Dynamic Status / Interpretation */}
              <p className={"mt-2 text-lg font-medium " + (results.color || "text-slate-700 dark:text-slate-300")}>
                Classification: {results.status}
              </p>
            </CardContent>
          </Card>

          {/* SECONDARY INFO (Optional) */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {results.status === "Underweight" &&
                  "Your BMI indicates you are underweight. Consider consulting a healthcare professional for advice on gaining weight healthily."}
                {results.status === "Normal weight" &&
                  "Your BMI is within the normal range. Maintain a balanced diet and regular exercise to keep healthy."}
                {results.status === "Overweight" &&
                  "Your BMI suggests you are overweight. Consider lifestyle changes such as diet and exercise to improve your health."}
                {results.status === "Obese" &&
                  "Your BMI falls in the obese category. It is advisable to consult a healthcare provider for personalized guidance."}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL ---
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your weight and height using either imperial or metric units. Use the toggle buttons to switch between units. Click "Calculate" to see your BMI and its classification. Use "Reset" to clear inputs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The Body Mass Index (BMI) is calculated differently depending on the unit system:
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4">
          <li>
            <strong>Metric:</strong> <code>BMI = weight (kg) / (height (m))²</code>
          </li>
          <li>
            <strong>Imperial:</strong> <code>BMI = (weight (lb) / (height (in))²) × 703</code>
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Where height in metric is converted from centimeters to meters by dividing by 100.
        </p>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Example Scenario</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Let's calculate the BMI of a person who weighs 150 pounds and is 70 inches tall (imperial units).
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-2">
          <li>
            Weight = 150 lb, Height = 70 in
          </li>
          <li>
            Calculate BMI: <code>(150 / (70 × 70)) × 703 = (150 / 4900) × 703 ≈ 21.5</code>
          </li>
          <li>
            Interpretation: BMI 21.5 is classified as "Normal weight".
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This indicates the person is within a healthy weight range for their height.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium block"
            >
              CDC - About Adult BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Official information from the Centers for Disease Control and Prevention on BMI and healthy weight.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium block"
            >
              WHO - Obesity and Overweight
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              World Health Organization factsheet on obesity, overweight, and BMI classifications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // MANDATORY METADATA FOR SIDEBAR NAV
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Formula Used",
        formula: "Metric: BMI = weight (kg) / (height (m))²; Imperial: BMI = (weight (lb) / (height (in))²) × 703",
        variables: [
          { symbol: "weight", description: "Your body weight in kilograms (kg) or pounds (lb)" },
          { symbol: "height", description: "Your height in meters (m) or inches (in)" },
        ],
      }}
      example={{
        title: "Example Scenario",
        scenario: "Calculate BMI for a person weighing 150 lb and 70 in tall (imperial units).",
        steps: [
          {
            step: 1,
            description: "Use the formula BMI = (weight / height²) × 703",
            calculation: "BMI = (150 / (70 × 70)) × 703 ≈ 21.5",
          },
        ],
        result: "The BMI is 21.5, which is classified as Normal weight.",
      }}
      relatedCalculators={[
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🧮" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🧮" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "⚖️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "⚖️" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🧮" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "⚖️" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default BmiBodyMassIndexCalculator;
