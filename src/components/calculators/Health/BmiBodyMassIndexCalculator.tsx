import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  Info,
  HelpCircle,
  BookOpen,
  AlertCircle,
  RotateCcw,
  Calculator,
  Scale,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  // BMI standard formula does NOT require gender, so no gender state needed
  const [inputs, setInputs] = useState({
    age: "",
    weight: "",
    heightMetric: "",
    heightFt: "",
    heightIn: "",
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 2. LOGIC
  const results = useMemo(() => {
    // Parse inputs
    const weight = parseFloat(inputs.weight);
    let heightCm: number | null = null;

    if (unit === "metric") {
      heightCm = parseFloat(inputs.heightMetric);
    } else {
      // imperial to cm
      const ft = parseFloat(inputs.heightFt);
      const inch = parseFloat(inputs.heightIn);
      if (!isNaN(ft) && !isNaN(inch)) {
        heightCm = (ft * 12 + inch) * 2.54;
      }
    }

    // Validate inputs
    if (
      isNaN(weight) ||
      weight <= 0 ||
      heightCm === null ||
      isNaN(heightCm) ||
      heightCm <= 0
    ) {
      return { value: null, label: "Please enter valid height and weight." };
    }

    // BMI formula: BMI = weight (kg) / (height (m))^2
    // Convert weight to kg if imperial
    let weightKg = weight;
    if (unit === "imperial") {
      weightKg = weight * 0.45359237; // lbs to kg
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // BMI classification (WHO standard)
    let classification = "";
    if (bmi < 16) classification = "Severe Thinness";
    else if (bmi < 17) classification = "Moderate Thinness";
    else if (bmi < 18.5) classification = "Mild Thinness";
    else if (bmi < 25) classification = "Normal";
    else if (bmi < 30) classification = "Overweight";
    else if (bmi < 35) classification = "Obese Class I";
    else if (bmi < 40) classification = "Obese Class II";
    else classification = "Obese Class III";

    return {
      value: bmi,
      label: classification,
    };
  }, [inputs, unit]);

  // 3. HANDLERS
  const handleReset = () => {
    setInputs({
      age: "",
      weight: "",
      heightMetric: "",
      heightFt: "",
      heightIn: "",
    });
  };

  // 4. RICH CONTENT (SEO)
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "Body Mass Index (BMI) is a simple calculation using height and weight to estimate body fat. It helps identify if a person is underweight, normal weight, overweight, or obese, which are important indicators for health risks.",
    },
    {
      question: "Does BMI differ between men and women?",
      answer:
        "The standard BMI formula does not differentiate between biological sexes. However, men and women have different body compositions; thus, BMI is a screening tool and not a diagnostic measure of body fat percentage.",
    },
    {
      question: "Why do we split height inputs in imperial units?",
      answer:
        "In the imperial system, height is commonly measured in feet and inches. Splitting inputs improves usability and reduces input errors, allowing users to enter their height naturally.",
    },
    {
      question: "Can BMI accurately measure body fat?",
      answer:
        "BMI is an indirect measure and does not distinguish between muscle and fat mass. Athletes or muscular individuals may have a high BMI but low body fat. For precise body fat measurement, other methods are recommended.",
    },
    {
      question: "How is BMI classification determined?",
      answer:
        "BMI classifications are based on WHO standards that correlate BMI ranges with health risk categories, from underweight to various obesity classes, guiding clinical and public health decisions.",
    },
    {
      question: "Does age affect BMI interpretation?",
      answer:
        "While BMI calculation is the same regardless of age, body composition changes with aging. Older adults may have more fat and less muscle at the same BMI, so clinical context is important.",
    },
    {
      question: "What are the limitations of BMI?",
      answer:
        "BMI does not account for muscle mass, bone density, overall body composition, and fat distribution. It should be used alongside other assessments for a comprehensive health evaluation.",
    },
    {
      question: "How to convert between metric and imperial units for BMI?",
      answer:
        "Weight in pounds is converted to kilograms by multiplying by 0.45359237. Height in feet and inches is converted to centimeters by ((feet * 12) + inches) * 2.54. These conversions ensure accurate BMI calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div>
        <Label htmlFor="unit" className="text-slate-900 dark:text-slate-100 font-semibold mb-1 block">
          Select Unit System
        </Label>
        <Select
          value={unit}
          onValueChange={(value) => setUnit(value as "metric" | "imperial")}
          aria-label="Select unit system"
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select unit system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, ft + in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="text-slate-900 dark:text-slate-100 font-semibold mb-1 block">
          Weight ({unit === "metric" ? "kilograms (kg)" : "pounds (lbs)"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          aria-describedby="weight-help"
          className="max-w-xs"
        />
      </div>

      {/* Height Input */}
      <div>
        <Label className="text-slate-900 dark:text-slate-100 font-semibold mb-1 block">
          Height ({unit === "metric" ? "centimeters (cm)" : "feet + inches"})
        </Label>
        {unit === "metric" ? (
          <Input
            id="heightMetric"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 175"
            value={inputs.heightMetric}
            onChange={(e) => setInputs((prev) => ({ ...prev, heightMetric: e.target.value }))}
            aria-describedby="height-help"
            className="max-w-xs"
          />
        ) : (
          <div className="flex space-x-4 max-w-xs">
            <div className="flex-1">
              <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300 text-sm mb-1 block">
                Feet
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step="1"
                placeholder="5"
                value={inputs.heightFt}
                onChange={(e) => setInputs((prev) => ({ ...prev, heightFt: e.target.value }))}
                aria-describedby="height-ft-help"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300 text-sm mb-1 block">
                Inches
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step="any"
                placeholder="10"
                value={inputs.heightIn}
                onChange={(e) => setInputs((prev) => ({ ...prev, heightIn: e.target.value }))}
                aria-describedby="height-in-help"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={() => {
            if (resultsRef.current) {
              resultsRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          aria-label="Calculate BMI"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={handleReset}
          aria-label="Reset inputs"
        >
          Reset
        </Button>
      </div>

      {/* Result Card */}
      <Card
        ref={resultsRef}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800"
        aria-live="polite"
        aria-atomic="true"
      >
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Scale size={24} className="text-blue-600" />
            <span>BMI Result</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.value === null ? (
            <p className="text-slate-700 dark:text-slate-300">{results.label}</p>
          ) : (
            <>
              <p className="text-blue-900 dark:text-blue-50 text-4xl font-extrabold tabular-nums">
                {results.value.toFixed(1)}
              </p>
              <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">{results.label}</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-sm text-slate-600 dark:text-slate-400">
        ⚠️ <strong>Disclaimer:</strong> BMI is a screening tool and does not directly measure body fat. Consult a healthcare professional for a comprehensive assessment.
      </p>
    </div>
  );

  // 6. EDITORIAL JSX (Omni-Style Depth)
  const editorial = (
    <div className="space-y-12">
      {/* Intro & How To */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300">
          Enter your weight and height using the unit system of your choice. For metric, input weight in kilograms and height in centimeters. For imperial, input weight in pounds and height as feet and inches. Click "Calculate" to see your Body Mass Index (BMI) and its classification.
        </p>
      </section>

      {/* The Science */}
      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The Science Behind It</h2>
        <p className="text-slate-700 dark:text-slate-300">
          BMI is calculated using the formula:
        </p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded mt-2 text-slate-900 dark:text-slate-100 font-mono">
          BMI = weight (kg) / [height (m)]²
        </pre>
        <p className="text-slate-700 dark:text-slate-300 mt-4">
          When using imperial units, weight is converted from pounds to kilograms, and height from feet and inches to meters before applying the formula. BMI does not require biological sex because it is a general screening tool; however, body composition differences between sexes mean BMI should be interpreted with clinical context.
        </p>
      </section>

      {/* Factors Section (Crucial for Medical Depth) */}
      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors Affecting Results</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Biological Sex:</strong> Although BMI calculation is sex-neutral, men and women differ in fat distribution and muscle mass, which can affect health risk assessments.
          </li>
          <li>
            <strong>Age:</strong> Aging causes changes in body composition, such as increased fat and decreased muscle mass, which BMI alone cannot capture.
          </li>
          <li>
            <strong>Muscle Mass:</strong> High muscle mass can increase BMI without indicating excess fat, potentially misclassifying athletes as overweight or obese.
          </li>
          <li>
            <strong>Ethnicity:</strong> Different ethnic groups may have different body fat percentages at the same BMI, affecting risk stratification.
          </li>
          <li>
            <strong>Measurement Accuracy:</strong> Accurate height and weight measurements are essential for reliable BMI calculation.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 mt-1">{answer}</p>
          </div>
        ))}
      </section>

      {/* References (Link First) */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            World Health Organization. <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Obesity and Overweight Fact Sheet</a>.
          </li>
          <li>
            NIH National Heart, Lung, and Blood Institute. <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Calculate Your BMI</a>.
          </li>
          <li>
            Centers for Disease Control and Prevention (CDC). <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">About Adult BMI</a>.
          </li>
          <li>
            Deurenberg, P., et al. (1991). "Body mass index as a measure of body fatness: age- and sex-specific prediction formulas." <em>British Journal of Nutrition</em>.
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
      formula={{
        title: "The Medical Formula",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight", description: "Your weight in kilograms (kg)" },
          { symbol: "height", description: "Your height in meters (m)" },
        ],
      }}
      example={{
        title: "Clinical Example",
        scenario:
          "A 30-year-old person weighs 70 kg and is 175 cm tall. Calculate their BMI.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert height from centimeters to meters: 175 cm = 1.75 m.",
          },
          {
            label: "Step 2",
            explanation: "Apply the BMI formula: BMI = 70 / (1.75)² = 22.86.",
          },
          {
            label: "Step 3",
            explanation: "Interpret the BMI: 22.86 falls within the 'Normal' weight range.",
          },
        ],
        result: "The person's BMI is 22.9, classified as Normal weight.",
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
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "The Science" },
        { id: "factors", label: "Factors" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}