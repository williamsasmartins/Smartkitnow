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

  // Inputs for BMI: weight and height
  // Imperial: weight (lbs), height (ft + in)
  // Metric: weight (kg), height (cm)
  const [inputs, setInputs] = useState<{
    weight: string;
    heightFt: string;
    heightIn: string;
    heightCm: string;
  }>({
    weight: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
  });

  // Handle input changes
  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof inputs
  ) {
    const val = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setInputs((prev) => ({ ...prev, [field]: val }));
    }
  }

  // BMI Calculation Logic
  // BMI (Imperial) = (weight in lbs / (height in inches)^2) * 703
  // BMI (Metric) = weight in kg / (height in meters)^2
  const results = useMemo(() => {
    // Parse inputs to numbers
    let weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) return { value: 0, label: "" };

    let heightInches = 0;
    let heightMeters = 0;

    if (unit === "imperial") {
      const ft = parseFloat(inputs.heightFt);
      const inch = parseFloat(inputs.heightIn);
      if (
        isNaN(ft) ||
        ft < 0 ||
        isNaN(inch) ||
        inch < 0 ||
        inch >= 12 ||
        ft === 0 && inch === 0
      )
        return { value: 0, label: "" };
      heightInches = ft * 12 + inch;
      if (heightInches === 0) return { value: 0, label: "" };
      const bmi = (weightNum / (heightInches * heightInches)) * 703;
      const rounded = Math.round(bmi * 10) / 10;

      // BMI Categories (CDC):
      // Underweight: <18.5
      // Normal weight: 18.5–24.9
      // Overweight: 25–29.9
      // Obesity: BMI of 30 or greater
      let label = "";
      if (rounded < 18.5) label = "Underweight";
      else if (rounded < 25) label = "Normal weight";
      else if (rounded < 30) label = "Overweight";
      else label = "Obesity";

      return { value: rounded, label };
    } else {
      // Metric
      const heightCm = parseFloat(inputs.heightCm);
      if (isNaN(heightCm) || heightCm <= 0) return { value: 0, label: "" };
      heightMeters = heightCm / 100;
      const bmi = weightNum / (heightMeters * heightMeters);
      const rounded = Math.round(bmi * 10) / 10;

      let label = "";
      if (rounded < 18.5) label = "Underweight";
      else if (rounded < 25) label = "Normal weight";
      else if (rounded < 30) label = "Overweight";
      else label = "Obesity";

      return { value: rounded, label };
    }
  }, [inputs, unit]);

  // FAQs specific to BMI — Body Mass Index Calculator
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are in a healthy weight range. It helps assess risk for certain health conditions.",
    },
    {
      question: "Can BMI accurately measure body fat?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat. Factors like muscle mass and bone density can affect BMI results.",
    },
    {
      question: "Why does this calculator use imperial units by default?",
      answer:
        "In Canada and the US, imperial units (lbs, feet, inches) are commonly used for height and weight, so this calculator defaults to imperial for user convenience.",
    },
    {
      question: "What BMI range is considered healthy?",
      answer:
        "According to Health Canada and CDC, a BMI between 18.5 and 24.9 is considered a healthy weight range for most adults.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div>
        <Label htmlFor="unit-select">Unit System</Label>
        <Select
          id="unit-select"
          value={unit}
          onValueChange={(val) => {
            setUnit(val as "imperial" | "metric");
            // Reset inputs on unit change
            setInputs({ weight: "", heightFt: "", heightIn: "", heightCm: "" });
          }}
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
              type="text"
              inputMode="decimal"
              placeholder="e.g. 150"
              value={inputs.weight}
              onChange={(e) => onInputChange(e, "weight")}
              className="text-slate-900 bg-slate-50"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="height-ft">Height (ft)</Label>
              <Input
                id="height-ft"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 5"
                value={inputs.heightFt}
                onChange={(e) => onInputChange(e, "heightFt")}
                className="text-slate-900 bg-slate-50"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="height-in">Height (in)</Label>
              <Input
                id="height-in"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 8"
                value={inputs.heightIn}
                onChange={(e) => onInputChange(e, "heightIn")}
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
              type="text"
              inputMode="decimal"
              placeholder="e.g. 68"
              value={inputs.weight}
              onChange={(e) => onInputChange(e, "weight")}
              className="text-slate-900 bg-slate-50"
            />
          </div>
          <div>
            <Label htmlFor="height-cm">Height (cm)</Label>
            <Input
              id="height-cm"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 173"
              value={inputs.heightCm}
              onChange={(e) => onInputChange(e, "heightCm")}
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
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate BMI"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", heightFt: "", heightIn: "", heightCm: "" })
          }
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Editorial content: How to use, formula, factors, FAQ, references
  const editorial = (
    <div className="space-y-12 text-slate-900">
      <section id="how-to-use" className="prose max-w-none">
        <h2>How to use</h2>
        <p>
          Enter your weight and height using the selected unit system. For
          imperial units, input your weight in pounds (lbs), and your height in
          feet and inches. For metric units, input your weight in kilograms
          (kg) and height in centimeters (cm). Click "Calculate" to see your
          BMI and its category.
        </p>
      </section>

      <section id="formula" className="prose max-w-none">
        <h2>The formula</h2>
        <p>
          The Body Mass Index (BMI) is calculated differently depending on the
          unit system:
        </p>
        <ul>
          <li>
            <strong>Imperial units:</strong> BMI = (weight in pounds / (height
            in inches)<sup>2</sup>) × 703
          </li>
          <li>
            <strong>Metric units:</strong> BMI = weight in kilograms / (height
            in meters)<sup>2</sup>
          </li>
        </ul>
        <p>
          This formula provides an estimate of body fat based on height and
          weight.
        </p>
      </section>

      <section id="factors" className="prose max-w-none">
        <h2>Factors affecting result</h2>
        <p>
          BMI is a screening tool and does not directly measure body fat. Some
          factors that can affect BMI accuracy include:
        </p>
        <ul>
          <li>Muscle mass (athletes may have higher BMI but low body fat)</li>
          <li>Bone density variations</li>
          <li>Age and sex differences</li>
          <li>Distribution of fat in the body</li>
        </ul>
        <p>
          Always consult a healthcare professional for a comprehensive health
          assessment.
        </p>
      </section>

      <section id="faq" className="prose max-w-none">
        <h2>Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold">{question}</h3>
            <p>{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="prose max-w-none">
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
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              National Heart, Lung, and Blood Institute - BMI Calculator
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
        </ol>
      </section>
    </div>
  );

  // Formula and example for CalculatorVerticalLayout props
  const formula = {
    title: "Formula",
    formula:
      "Imperial: BMI = (weight in lbs / (height in inches)^2) × 703; Metric: BMI = weight in kg / (height in meters)^2",
    variables: [
      { symbol: "weight", description: "Your weight in pounds (lbs) or kilograms (kg)" },
      { symbol: "height", description: "Your height in inches or meters" },
      { symbol: "703", description: "Conversion factor for imperial units" },
    ],
  };

  const example = {
    title: "Example",
    scenario:
      "Calculate BMI for a person weighing 180 lbs with a height of 5 feet 10 inches.",
    steps: [
      "Convert height to inches: (5 × 12) + 10 = 70 inches",
      "Apply formula: BMI = (180 / 70²) × 703",
      "Calculate: BMI = (180 / 4900) × 703 ≈ 25.8",
    ],
    result: "BMI is approximately 25.8, which is categorized as Overweight.",
  };

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
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