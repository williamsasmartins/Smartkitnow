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
  AlertCircle,
  Activity,
} from "lucide-react"; // Icons relevant to BMI — Body Mass Index Calculator
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // DEFAULT TO IMPERIAL FOR CANADA
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs specific to BMI — Body Mass Index Calculator
  // Imperial: weight (lbs), height (ft, in)
  // Metric: weight (kg), height (cm)
  const [inputs, setInputs] = useState<{
    weight?: string;
    heightFt?: string;
    heightIn?: string;
    heightCm?: string;
  }>({});

  // Helper: parse float safely
  const parseInput = (value?: string) => {
    if (!value) return NaN;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? NaN : parsed;
  };

  // --- LOGIC ENGINE ---
  // BMI Formula:
  // Imperial BMI = (weight in lbs / (height in inches)^2) * 703
  // Metric BMI = weight in kg / (height in meters)^2
  // We will calculate BMI and provide classification based on Health Canada / CDC standards

  const results = useMemo(() => {
    let bmi = 0;
    let label = "";
    let details = "";

    if (unit === "imperial") {
      const weightLbs = parseInput(inputs.weight);
      const heightFt = parseInput(inputs.heightFt);
      const heightIn = parseInput(inputs.heightIn);

      if (
        weightLbs > 0 &&
        heightFt >= 0 &&
        heightIn >= 0 &&
        (heightFt > 0 || heightIn > 0)
      ) {
        const totalInches = heightFt * 12 + heightIn;
        bmi = (weightLbs / (totalInches * totalInches)) * 703;
      }
    } else {
      // metric
      const weightKg = parseInput(inputs.weight);
      const heightCm = parseInput(inputs.heightCm);

      if (weightKg > 0 && heightCm > 0) {
        const heightM = heightCm / 100;
        bmi = weightKg / (heightM * heightM);
      }
    }

    if (bmi > 0) {
      const roundedBmi = Math.round(bmi * 10) / 10;

      // BMI Classification based on Health Canada & CDC:
      // Underweight: < 18.5
      // Normal weight: 18.5 – 24.9
      // Overweight: 25 – 29.9
      // Obesity: 30 or greater

      if (roundedBmi < 18.5) {
        label = "Underweight";
        details =
          "Your BMI indicates you are underweight. Consider consulting a healthcare professional.";
      } else if (roundedBmi < 25) {
        label = "Normal weight";
        details =
          "Your BMI is within the healthy weight range. Maintain your current lifestyle.";
      } else if (roundedBmi < 30) {
        label = "Overweight";
        details =
          "Your BMI indicates you are overweight. Consider lifestyle changes for better health.";
      } else {
        label = "Obesity";
        details =
          "Your BMI indicates obesity. It is advisable to seek medical advice.";
      }

      return { value: roundedBmi.toFixed(1), label, details };
    }

    return { value: 0, label: "", details: "" };
  }, [inputs, unit]);

  // --- CONTENT DATA ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are in a healthy weight range. It helps identify potential health risks related to underweight or overweight.",
    },
    {
      question: "Can I use this calculator if I am pregnant or an athlete?",
      answer:
        "BMI may not be accurate for pregnant women, athletes, or individuals with high muscle mass. Consult a healthcare professional for personalized assessment.",
    },
    {
      question: "Why does the calculator use lbs and feet/inches by default?",
      answer:
        "This calculator defaults to imperial units (lbs, feet, inches) as these are commonly used in Canada and the US for body measurements.",
    },
    {
      question: "How often should I check my BMI?",
      answer:
        "Checking your BMI periodically can help monitor your health status. However, it should not replace professional medical advice.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputs((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Reset inputs
  const resetInputs = () => {
    setInputs({});
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div>
        <Label htmlFor="unit-system">Unit System</Label>
        <Select
          value={unit}
          onValueChange={(value) => {
            setUnit(value as "imperial" | "metric");
            resetInputs();
          }}
          id="unit-system"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {unit === "imperial" ? (
        <>
          <div>
            <Label htmlFor="weight-lbs">Weight (lbs)</Label>
            <Input
              id="weight-lbs"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 150"
              value={inputs.weight || ""}
              onChange={onInputChange("weight")}
              className="text-slate-900 bg-slate-50"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="height-ft">Height (feet)</Label>
              <Input
                id="height-ft"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFt || ""}
                onChange={onInputChange("heightFt")}
                className="text-slate-900 bg-slate-50"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="height-in">Height (inches)</Label>
              <Input
                id="height-in"
                type="number"
                min={0}
                max={11}
                step="any"
                placeholder="e.g. 8"
                value={inputs.heightIn || ""}
                onChange={onInputChange("heightIn")}
                className="text-slate-900 bg-slate-50"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="weight-kg">Weight (kg)</Label>
            <Input
              id="weight-kg"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 68"
              value={inputs.weight || ""}
              onChange={onInputChange("weight")}
              className="text-slate-900 bg-slate-50"
            />
          </div>
          <div>
            <Label htmlFor="height-cm">Height (cm)</Label>
            <Input
              id="height-cm"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 173"
              value={inputs.heightCm || ""}
              onChange={onInputChange("heightCm")}
              className="text-slate-900 bg-slate-50"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate BMI"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results Display */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50">
                {results.value}
              </p>
              <p className="text-slate-600 mt-2">{results.label}</p>
              <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">
                {results.details}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* How to use */}
      <section id="how-to-use" className="prose max-w-none text-slate-900">
        <h2>How to use</h2>
        <p>
          Enter your weight and height using the unit system you prefer. For
          Canadians and Americans, the default is imperial units: pounds (lbs)
          for weight, and feet and inches for height. Alternatively, you can
          switch to metric units (kilograms and centimeters). Click "Calculate"
          to see your Body Mass Index (BMI) and its classification.
        </p>
      </section>

      {/* The formula */}
      <section id="formula" className="prose max-w-none text-slate-900">
        <h2>The formula</h2>
        <p>
          BMI is calculated differently depending on the unit system:
        </p>
        <ul>
          <li>
            <strong>Imperial units:</strong> BMI = (weight in lbs / (height in
            inches)<sup>2</sup>) × 703
          </li>
          <li>
            <strong>Metric units:</strong> BMI = weight in kg / (height in
            meters)<sup>2</sup>
          </li>
        </ul>
        <p>
          The factor 703 converts the imperial measurement to the standard BMI
          scale.
        </p>
      </section>

      {/* Factors affecting result */}
      <section id="factors" className="prose max-w-none text-slate-900">
        <h2>Factors affecting result</h2>
        <p>
          BMI is a useful screening tool but has limitations. It does not
          directly measure body fat and may misclassify muscular individuals as
          overweight or obese. Other factors influencing BMI accuracy include:
        </p>
        <ul>
          <li>Age and sex differences in body composition</li>
          <li>Pregnancy status</li>
          <li>Muscle mass and bone density</li>
          <li>Ethnic and genetic factors</li>
        </ul>
        <p>
          Always consult a healthcare professional for a comprehensive health
          assessment.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="prose max-w-none text-slate-900">
        <h2>Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>

      {/* References */}
      <section id="references" className="prose max-w-none text-slate-900">
        <h2>References</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <a
              href="https://www.canada.ca/en/public-health/services/health-promotion/healthy-living/your-health/bmi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Health Canada - Body Mass Index (BMI)
            </a>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              CDC - About Adult BMI
            </a>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              World Health Organization - Obesity and Overweight
            </a>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              National Heart, Lung, and Blood Institute - BMI Calculator
            </a>
          </li>
        </ol>
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
      formula={{
        title: "Formula",
        formula:
          "Imperial: BMI = (weight in lbs / (height in inches)^2) × 703; Metric: BMI = weight in kg / (height in meters)^2",
        variables: [
          { symbol: "weight", description: "Your body weight" },
          { symbol: "height", description: "Your height" },
          { symbol: "703", description: "Conversion factor for imperial units" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate BMI for a person weighing 180 lbs and 5 feet 10 inches tall.",
        steps: [
          "Convert height to inches: 5 ft × 12 + 10 in = 70 inches",
          "Apply formula: BMI = (180 / 70²) × 703",
          "Calculate: BMI = (180 / 4900) × 703 ≈ 25.8",
          "Interpretation: BMI of 25.8 indicates overweight category.",
        ],
        result: "BMI = 25.8 (Overweight)",
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
        { id: "how-to-use", label: "How to use" },
        { id: "formula", label: "The formula" },
        { id: "factors", label: "Factors affecting result" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}