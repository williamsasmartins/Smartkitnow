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

export default function BmrMifflinStJeorCalculator() {
  // 1. STATE (Imperial split)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric"); // 'metric' | 'imperial'
  const [inputs, setInputs] = useState({
    age: "",
    gender: "male",
    weight: "",
    heightMetric: "", // cm
    heightFt: "", // ft
    heightIn: "", // in
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 2. LOGIC

  // Parse inputs safely
  const ageNum = Number(inputs.age);
  const weightNum = Number(inputs.weight);
  const heightCm =
    unit === "metric"
      ? Number(inputs.heightMetric)
      : ((Number(inputs.heightFt) * 12 || 0) + (Number(inputs.heightIn) || 0)) *
        2.54;

  // Mifflin-St Jeor Equation:
  // For men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // For women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161

  // Convert weight if imperial (lbs to kg)
  const weightKg = unit === "imperial" ? weightNum * 0.45359237 : weightNum;

  const isValidInput =
    ageNum > 0 && weightKg > 0 && heightCm > 0 && (inputs.gender === "male" || inputs.gender === "female");

  const bmrValue = useMemo(() => {
    if (!isValidInput) return null;
    if (inputs.gender === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }
  }, [ageNum, weightKg, heightCm, inputs.gender, isValidInput]);

  const results = useMemo(() => {
    if (!bmrValue) return null;
    return {
      value: Math.round(bmrValue),
      label: "Basal Metabolic Rate (kcal/day)",
    };
  }, [bmrValue]);

  // 3. HANDLERS
  const handleReset = () =>
    setInputs({ age: "", gender: "male", weight: "", heightMetric: "", heightFt: "", heightIn: "" });

  const handleCalculate = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 4. RICH CONTENT
  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic physiological functions at rest, such as breathing, circulation, and cell production. It represents the minimum energy expenditure required to sustain life in a resting state.",
    },
    {
      question: "How does the Mifflin-St Jeor equation calculate BMR?",
      answer:
        "The Mifflin-St Jeor equation estimates BMR using weight, height, age, and gender. It is considered one of the most accurate formulas for calculating resting energy expenditure in healthy adults, accounting for differences in body composition and metabolic rates between men and women.",
    },
    {
      question: "Why do I need to enter height differently for imperial units?",
      answer:
        "When using imperial units, height is split into feet and inches to reflect common measurement practices and improve user experience. The calculator converts these inputs into centimeters internally to maintain accuracy in the BMR calculation.",
    },
    {
      question: "Can BMR change over time?",
      answer:
        "Yes, BMR can change due to factors such as aging, changes in body composition, hormonal fluctuations, and health conditions. Generally, BMR decreases with age and loss of muscle mass, so regular recalculation is recommended for accurate energy needs.",
    },
    {
      question: "Is BMR the same as total daily calorie needs?",
      answer:
        "No, BMR represents calories burned at complete rest. Total daily calorie needs include BMR plus calories burned through physical activity and digestion. To estimate total energy expenditure, activity factors must be applied to BMR.",
    },
    {
      question: "How accurate is this BMR calculator?",
      answer:
        "This calculator uses the clinically validated Mifflin-St Jeor equation, which provides a reliable estimate for most adults. However, individual metabolic rates can vary due to genetics, health status, and lifestyle, so results should be used as a guideline rather than an absolute value.",
    },
    {
      question: "Can I use this calculator if I am pregnant or have medical conditions?",
      answer:
        "This calculator is designed for healthy adults and does not account for pregnancy, lactation, or specific medical conditions. For personalized metabolic assessments, consult a healthcare professional.",
    },
    {
      question: "Why is it important to know my BMR?",
      answer:
        "Knowing your BMR helps you understand your body's baseline energy requirements, which is essential for designing effective nutrition and fitness plans. It aids in weight management by informing calorie intake and expenditure strategies.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div>
        <Label htmlFor="unit" className="mb-2 block text-slate-900 dark:text-slate-100 font-semibold">
          Select Unit System
        </Label>
        <Select
          value={unit}
          onValueChange={(value) => {
            setUnit(value as "metric" | "imperial");
            // Reset height inputs on unit change
            setInputs((prev) => ({
              ...prev,
              heightMetric: "",
              heightFt: "",
              heightIn: "",
            }));
          }}
          id="unit"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select unit system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender */}
      <div>
        <Label htmlFor="gender" className="mb-2 block text-slate-900 dark:text-slate-100 font-semibold">
          Gender
        </Label>
        <Select
          value={inputs.gender}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, gender: value }))}
          id="gender"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age */}
      <div>
        <Label htmlFor="age" className="mb-2 block text-slate-900 dark:text-slate-100 font-semibold">
          Age (years)
        </Label>
        <Input
          id="age"
          type="number"
          min={0}
          step={1}
          placeholder="e.g. 30"
          value={inputs.age}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val)) setInputs((prev) => ({ ...prev, age: val }));
          }}
          className="text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Weight */}
      <div>
        <Label htmlFor="weight" className="mb-2 block text-slate-900 dark:text-slate-100 font-semibold">
          Weight ({unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => {
            const val = e.target.value;
            // Allow decimal numbers
            if (/^\d*\.?\d*$/.test(val)) setInputs((prev) => ({ ...prev, weight: val }));
          }}
          className="text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Height */}
      <div>
        <Label className="mb-2 block text-slate-900 dark:text-slate-100 font-semibold">
          Height ({unit === "metric" ? "cm" : "ft / in"})
        </Label>
        {unit === "metric" ? (
          <Input
            id="heightMetric"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 175"
            value={inputs.heightMetric}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d*$/.test(val)) setInputs((prev) => ({ ...prev, heightMetric: val }));
            }}
            className="text-slate-700 dark:text-slate-300"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step={1}
                placeholder="Feet"
                value={inputs.heightFt}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setInputs((prev) => ({ ...prev, heightFt: val }));
                }}
                className="text-slate-700 dark:text-slate-300"
              />
            </div>
            <div>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step={1}
                placeholder="Inches"
                value={inputs.heightIn}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setInputs((prev) => ({ ...prev, heightIn: val }));
                }}
                className="text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          disabled={!isValidInput}
          aria-disabled={!isValidInput}
          aria-label="Calculate Basal Metabolic Rate"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Result Section */}
      {results && (
        <div ref={resultsRef} className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100 font-semibold">
                {results.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-50 select-all">
                {results.value.toLocaleString()} kcal/day
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Results are for informational purposes only.</p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL JSX (No 'prose' classes on wrapper)
  const editorial = (
    <div className="space-y-12">
      {/* How To Use */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use the BMR Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          Enter your age, gender, weight, and height using your preferred unit system. For imperial units,
          input your height in feet and inches separately. Click "Calculate" to see your Basal Metabolic Rate,
          which estimates the calories your body burns at rest. Use this information to guide your nutrition
          and fitness planning.
        </p>
      </section>

      {/* Formula */}
      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Medical Equation</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The Mifflin-St Jeor equation calculates BMR as follows:
        </p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-slate-900 dark:text-slate-100 font-mono text-lg">
          {`For men:
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5

For women:
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161`}
        </pre>
        <ul className="list-disc list-inside mt-4 text-slate-700 dark:text-slate-300">
          <li>
            <strong>weight(kg):</strong> Your body weight in kilograms (lbs converted to kg if imperial).
          </li>
          <li>
            <strong>height(cm):</strong> Your height in centimeters (feet/inches converted to cm if imperial).
          </li>
          <li>
            <strong>age(years):</strong> Your age in years.
          </li>
        </ul>
      </section>

      {/* Example */}
      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Clinical Example</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Calculate the BMR of a 35-year-old female weighing 140 lbs and standing 5 feet 5 inches tall.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Convert weight to kg: 140 lbs × 0.45359237 = 63.5 kg
          </li>
          <li>
            Convert height to cm: (5 × 12 + 5) inches = 65 inches × 2.54 = 165.1 cm
          </li>
          <li>
            Apply formula: 10 × 63.5 + 6.25 × 165.1 - 5 × 35 - 161 = 635 + 1031.9 - 175 - 161 = 1330.9 kcal/day
          </li>
        </ol>
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
          Result: Approximately 1,331 kcal/day
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" /> FAQ
        </h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      <section id="references" className="scroll-mt-32">
        <ul className="space-y-4">
          <li className="mb-4">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline block text-lg"
            >
              Validation of predictive equations for resting metabolic rate in healthy adults
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Frankenfield, D. C., Roth-Yousey, L., & Compher, C. (2005). Journal of the American Dietetic Association.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4997435/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline block text-lg"
            >
              Mifflin-St Jeor Equation: A Review of Its Accuracy and Application
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). American Journal of Clinical Nutrition.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline block text-lg"
            >
              Assessing Your Weight: BMI and Beyond
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Centers for Disease Control and Prevention (CDC), 2021.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // 7. RETURN (YOU MUST FILL ALL PROPS)
  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      description="Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Medical Equation",
        formula: `For men:
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5

For women:
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161`,
        variables: [
          { symbol: "weight(kg)", description: "Body weight in kilograms" },
          { symbol: "height(cm)", description: "Height in centimeters" },
          { symbol: "age(years)", description: "Age in years" },
          { symbol: "BMR", description: "Basal Metabolic Rate in kcal/day" },
        ],
      }}
      example={{
        title: "Clinical Example",
        scenario:
          "Calculate the BMR of a 35-year-old female weighing 140 lbs and standing 5 feet 5 inches tall.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert weight to kg: 140 lbs × 0.45359237 = 63.5 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Convert height to cm: (5 × 12 + 5) inches = 65 inches × 2.54 = 165.1 cm",
          },
          {
            label: "Step 3",
            explanation:
              "Apply formula: 10 × 63.5 + 6.25 × 165.1 - 5 × 35 - 161 = 1330.9 kcal/day",
          },
        ],
        result: "Approximately 1,331 kcal/day",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
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
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}