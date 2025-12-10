import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Activity } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function BmiBodyMassIndexCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{ height?: string; weight?: string }>({});

  // --- LOGIC ---
  const results = useMemo(() => {
    const heightInput = parseFloat(inputs.height ?? "");
    const weightInput = parseFloat(inputs.weight ?? "");
    if (isNaN(heightInput) || heightInput <= 0 || isNaN(weightInput) || weightInput <= 0) {
      return null;
    }

    // Convert inputs to metric for calculation
    // Height: inches to meters, pounds to kg if imperial
    // Height: cm to meters if metric
    let heightMeters: number;
    let weightKg: number;

    if (unit === "imperial") {
      heightMeters = heightInput * 0.0254;
      weightKg = weightInput * 0.45359237;
    } else {
      heightMeters = heightInput / 100;
      weightKg = weightInput;
    }

    if (heightMeters === 0) return null;

    const bmi = weightKg / (heightMeters * heightMeters);
    const bmiRounded = Number(bmi.toFixed(1));

    // BMI Category based on WHO standards
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    return {
      bmi: bmiRounded,
      category,
      heightMeters,
      weightKg,
    };
  }, [inputs, unit]);

  // --- FAQ DATA (For Schema & Display) ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are in a healthy weight range. It helps assess risk for certain health conditions.",
    },
    {
      question: "How do I switch between imperial and metric units?",
      answer:
        "Use the toggle buttons above the inputs to switch between imperial (inches, pounds) and metric (centimeters, kilograms) units.",
    },
    {
      question: "Can BMI accurately measure body fat?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat. Other methods may be needed for precise body fat analysis.",
    },
    {
      question: "What BMI values are considered healthy?",
      answer:
        "A BMI between 18.5 and 24.9 is generally considered healthy. Values below or above this range may indicate underweight or overweight status.",
    },
    {
      question: "Does this calculator work for children or athletes?",
      answer:
        "BMI interpretations differ for children and athletes. This calculator is designed for adults and may not be accurate for those groups.",
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
          {/* Unit Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={unit === "imperial" ? undefined : "outline"}
              className="flex-1 h-9 text-sm font-semibold"
              onClick={() => setUnit("imperial")}
              type="button"
            >
              Imperial (in, lbs)
            </Button>
            <Button
              variant={unit === "metric" ? undefined : "outline"}
              className="flex-1 h-9 text-sm font-semibold"
              onClick={() => setUnit("metric")}
              type="button"
            >
              Metric (cm, kg)
            </Button>
          </div>

          {/* Height Input */}
          <div>
            <Label htmlFor="height" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "centimeters"})
            </Label>
            <Input
              id="height"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 70" : "e.g. 178"}
              value={inputs.height ?? ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, height: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Weight Input */}
          <div>
            <Label htmlFor="weight" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Weight ({unit === "imperial" ? "pounds" : "kilograms"})
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
              value={inputs.weight ?? ""}
              onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            // Trigger recalculation by setting inputs to current state (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          type="button"
        >
          Calculate
        </Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({})} type="button">
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          {/* MAIN RESULT CARD - EXACT REPLICA OF LOAN PAYMENT STYLE */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Primary Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{results.bmi}</p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">BMI Value</p>
            </CardContent>
          </Card>

          {/* SECONDARY RESULTS (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
              <CardContent className="pt-6">
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">Category</p>
                <p className="text-slate-700 dark:text-slate-300">{results.category}</p>
              </CardContent>
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
          Enter your height and weight using either imperial or metric units. Use the toggle buttons to switch units. Click "Calculate" to see your BMI and corresponding category.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              WHO: Obesity and Overweight Fact Sheet
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Authoritative source on BMI and health risks.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  // --- FINAL RENDER ---
  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd} // INJECTS SEO SCHEMA
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      // NATIVE PROPS FOR RICH CONTENT
      formula={{
        title: "Formula Used",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight (kg)", description: "Your weight in kilograms" },
          { symbol: "height (m)", description: "Your height in meters" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario: "A person who is 5'7\" (67 inches) tall and weighs 150 lbs.",
        steps: [
          {
            step: 1,
            description: "Convert height to meters: 67 inches × 0.0254 = 1.70 m",
            calculation: "67 × 0.0254 = 1.70",
          },
          {
            step: 2,
            description: "Convert weight to kilograms: 150 lbs × 0.45359237 = 68.04 kg",
            calculation: "150 × 0.45359237 = 68.04",
          },
          {
            step: 3,
            description: "Calculate BMI: 68.04 / (1.70)² = 23.53",
            calculation: "68.04 / (1.70 × 1.70) = 23.53",
          },
        ],
        result: "BMI = 23.5 (Normal weight)",
      }}
      relatedCalculators={[
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🧮" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🧮" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "⚖️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "⚖️" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🧮" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "🧮" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default BmiBodyMassIndexCalculator;
