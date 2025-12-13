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
  AlertCircle,
  Calculator,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // 1. SETUP STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    // Imperial: weight (lbs), height (ft, in)
    weightLbs: "",
    heightFt: "",
    heightIn: "",
    // Metric: weight (kg), height (cm)
    weightKg: "",
    heightCm: "",
  });

  // Handle input changes
  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const val = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setInputs((prev) => ({ ...prev, [field]: val }));
    }
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs to numbers
    let weightKg: number | null = null;
    let heightM: number | null = null;

    if (unit === "imperial") {
      const w = parseFloat(inputs.weightLbs);
      const ft = parseFloat(inputs.heightFt);
      const inch = parseFloat(inputs.heightIn);
      if (
        !isNaN(w) &&
        w > 0 &&
        !isNaN(ft) &&
        ft >= 0 &&
        !isNaN(inch) &&
        inch >= 0
      ) {
        // Convert height to total inches
        const totalInches = ft * 12 + inch;
        // Convert height to meters
        heightM = totalInches * 0.0254;
        // Convert weight to kg
        weightKg = w * 0.45359237;
      }
    } else {
      // Metric
      const w = parseFloat(inputs.weightKg);
      const cm = parseFloat(inputs.heightCm);
      if (!isNaN(w) && w > 0 && !isNaN(cm) && cm > 0) {
        weightKg = w;
        heightM = cm / 100;
      }
    }

    if (weightKg && heightM && heightM > 0) {
      // BMI formula: weight (kg) / height (m)^2
      const bmiRaw = weightKg / (heightM * heightM);
      const bmi = Math.round(bmiRaw * 10) / 10; // 1 decimal place

      // BMI Categories (Canada/US standard):
      // Underweight: <18.5
      // Normal weight: 18.5–24.9
      // Overweight: 25–29.9
      // Obesity: 30 or greater
      let label = "";
      let category = "";
      if (bmi < 18.5) {
        label = "Underweight";
        category = "Health Risk: Possible nutritional deficiency and osteoporosis";
      } else if (bmi < 25) {
        label = "Normal weight";
        category = "Health Risk: Low";
      } else if (bmi < 30) {
        label = "Overweight";
        category = "Health Risk: Moderate";
      } else {
        label = "Obesity";
        category = "Health Risk: High";
      }

      return {
        value: bmi.toFixed(1),
        label,
        category,
      };
    }

    return { value: 0, label: "", category: "" };
  }, [inputs, unit]);

  // 3. CONTENT DATA
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a simple calculation using height and weight to estimate body fat. It helps identify if you are underweight, normal weight, overweight, or obese, which can indicate potential health risks.",
    },
    {
      question: "Can BMI be inaccurate?",
      answer:
        "Yes, BMI does not directly measure body fat and may be inaccurate for athletes, pregnant women, elderly, or those with high muscle mass. It is a screening tool, not a diagnostic measure.",
    },
    {
      question: "Why does this calculator default to imperial units?",
      answer:
        "In Canada and the US, imperial units (pounds, feet, inches) are commonly used for body measurements, so the calculator defaults to these units for user convenience. You can switch to metric units anytime.",
    },
    {
      question: "How often should I check my BMI?",
      answer:
        "It's recommended to check your BMI periodically, such as during annual health checkups or when you notice changes in your weight or health status.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      {unit === "imperial" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="weightLbs"
              className="mb-2 block text-slate-700 dark:text-slate-300"
            >
              Weight (lbs)
            </Label>
            <Input
              id="weightLbs"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 150"
              value={inputs.weightLbs}
              onChange={(e) => onInputChange(e, "weightLbs")}
              aria-describedby="weightLbsHelp"
            />
          </div>
          <div>
            <Label
              htmlFor="heightFt"
              className="mb-2 block text-slate-700 dark:text-slate-300"
            >
              Height (ft)
            </Label>
            <Input
              id="heightFt"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5"
              value={inputs.heightFt}
              onChange={(e) => onInputChange(e, "heightFt")}
              aria-describedby="heightFtHelp"
            />
          </div>
          <div>
            <Label
              htmlFor="heightIn"
              className="mb-2 block text-slate-700 dark:text-slate-300"
            >
              Height (in)
            </Label>
            <Input
              id="heightIn"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 8"
              value={inputs.heightIn}
              onChange={(e) => onInputChange(e, "heightIn")}
              aria-describedby="heightInHelp"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="weightKg"
              className="mb-2 block text-slate-700 dark:text-slate-300"
            >
              Weight (kg)
            </Label>
            <Input
              id="weightKg"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 68"
              value={inputs.weightKg}
              onChange={(e) => onInputChange(e, "weightKg")}
              aria-describedby="weightKgHelp"
            />
          </div>
          <div>
            <Label
              htmlFor="heightCm"
              className="mb-2 block text-slate-700 dark:text-slate-300"
            >
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 173"
              value={inputs.heightCm}
              onChange={(e) => onInputChange(e, "heightCm")}
              aria-describedby="heightCmHelp"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state with current inputs
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate BMI"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weightLbs: "",
              heightFt: "",
              heightIn: "",
              weightKg: "",
              heightCm: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results Display (Blue Gradient) */}
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
              <p className="text-slate-600 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/60 text-blue-800 text-sm font-bold">
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
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          To calculate your Body Mass Index (BMI), select your preferred unit
          system: Imperial (pounds, feet, inches) or Metric (kilograms,
          centimeters). Enter your weight and height in the respective fields.
          For Imperial units, provide your height in feet and inches separately.
          Click the "Calculate" button to see your BMI value along with the
          corresponding weight category and associated health risk. Use the
          "Reset" button to clear all inputs and start a new calculation.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.canada.ca/en/public-health/services/health-promotion/healthy-living/your-health/bmi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Government of Canada - Body Mass Index (BMI)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official Canadian guidelines on BMI and healthy weight ranges.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Centers for Disease Control and Prevention (CDC) - About BMI
            </a>
            <p className="text-slate-500 text-sm mt-1">
              US CDC resource explaining BMI calculation and interpretation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. World Health Organization - Obesity and Overweight
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Global perspective on BMI and obesity-related health risks.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. National Heart, Lung, and Blood Institute - BMI Calculator
            </a>
            <p className="text-slate-500 text-sm mt-1">
              US NIH resource with BMI calculator and health implications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight.. This tool helps you estimate your results accurately using standard formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // BMI Formula and example filled with real math
      formula={{
        title: "The Formula",
        formula:
          "BMI = weight (kg) / [height (m)]²  OR  BMI = 703 × weight (lbs) / [height (in)]²",
        variables: [
          {
            symbol: "weight (kg)",
            description: "Your weight in kilograms (metric units)",
          },
          {
            symbol: "height (m)",
            description: "Your height in meters (metric units)",
          },
          {
            symbol: "weight (lbs)",
            description: "Your weight in pounds (imperial units)",
          },
          {
            symbol: "height (in)",
            description: "Your height in inches (imperial units)",
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Calculate BMI for a person weighing 150 lbs with a height of 5 feet 8 inches (imperial units).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height to total inches: 5 ft × 12 + 8 in = 60 + 8 = 68 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply BMI formula: BMI = 703 × 150 lbs / (68 in)² = 703 × 150 / 4624 = 105450 / 4624 ≈ 22.8.",
          },
          {
            label: "Step 3",
            explanation:
              "Interpretation: BMI of 22.8 falls within the 'Normal weight' category.",
          },
        ],
        result:
          "The person has a BMI of approximately 22.8, indicating a normal weight range with low health risk.",
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
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}