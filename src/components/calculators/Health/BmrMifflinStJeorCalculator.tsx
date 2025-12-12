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
  // 1. STATE (With split height for Imperial)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [inputs, setInputs] = useState({
    heightMetric: "", // cm
    heightFt: "", // feet
    heightIn: "", // inches
    weight: "", // kg or lbs depending on unit
    age: "",
    sex: "male", // male or female
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 2. LOGIC
  // Conversion helpers
  const parseNumber = (value: string) => {
    const n = parseFloat(value);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const results = useMemo(() => {
    // Extract inputs safely
    const age = parseNumber(inputs.age);
    const weightRaw = parseNumber(inputs.weight);
    let heightCm = 0;

    if (unit === "metric") {
      heightCm = parseNumber(inputs.heightMetric);
    } else {
      // imperial: convert ft/in to total inches then to cm
      const ft = parseNumber(inputs.heightFt);
      const inch = parseNumber(inputs.heightIn);
      const totalInches = ft * 12 + inch;
      heightCm = totalInches * 2.54;
    }

    // Weight conversion if imperial
    const weightKg = unit === "imperial" ? weightRaw * 0.45359237 : weightRaw;

    // Mifflin-St Jeor Equation:
    // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
    // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161

    if (age <= 0 || weightKg <= 0 || heightCm <= 0) {
      return { bmr: null };
    }

    let bmr = 0;
    if (inputs.sex === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    return { bmr: Math.round(bmr) };
  }, [inputs, unit]);

  // 3. HANDLERS (Scroll & Reset)
  function handleCalculate() {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleReset() {
    setInputs({
      heightMetric: "",
      heightFt: "",
      heightIn: "",
      weight: "",
      age: "",
      sex: "male",
    });
  }

  // 4. RICH CONTENT
  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic physiological functions such as breathing, circulation, and cell production while at rest. It represents the minimum energy expenditure needed to sustain life in a resting state.",
    },
    {
      question: "Why use the Mifflin-St Jeor equation for BMR?",
      answer:
        "The Mifflin-St Jeor equation is widely regarded as one of the most accurate formulas for estimating BMR in healthy adults. It was developed in 1990 and validated against measured metabolic rates, making it preferable over older formulas like Harris-Benedict, especially in modern populations.",
    },
    {
      question: "How do age, sex, weight, and height affect BMR?",
      answer:
        "BMR decreases with age due to loss of lean muscle mass and changes in hormonal levels. Men generally have a higher BMR than women because of greater muscle mass. Weight and height influence BMR because larger bodies require more energy to maintain basic functions.",
    },
    {
      question: "Can BMR change over time?",
      answer:
        "Yes, BMR can change due to factors such as aging, changes in body composition (muscle vs fat), illness, hormonal imbalances, and prolonged changes in diet or physical activity. Tracking BMR can help adjust nutritional and fitness plans accordingly.",
    },
    {
      question: "Is BMR the same as Total Daily Energy Expenditure (TDEE)?",
      answer:
        "No, BMR only accounts for calories burned at rest. Total Daily Energy Expenditure (TDEE) includes BMR plus calories burned through physical activity, digestion, and other daily activities. TDEE is a more comprehensive measure of daily calorie needs.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "While the Mifflin-St Jeor equation provides a good estimate for most adults, individual metabolic rates can vary due to genetics, health conditions, and lifestyle factors. For precise measurement, indirect calorimetry performed in clinical settings is recommended.",
    },
    {
      question: "Why do I need to enter height in feet and inches for Imperial units?",
      answer:
        "In the United States and other countries using Imperial units, height is commonly measured in feet and inches. This calculator splits the height input into feet and inches to match standard user expectations and then converts it internally to centimeters for the formula.",
    },
    {
      question: "Can I use this calculator if I am under 18 or elderly?",
      answer:
        "The Mifflin-St Jeor equation was developed and validated primarily for adults aged 18-65. For children, adolescents, and elderly individuals, metabolic rates may differ significantly, and specialized formulas or clinical assessments are recommended.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div>
        <Label htmlFor="unit" className="mb-1 inline-block font-semibold">
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
              weight: "",
            }));
          }}
          id="unit"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (cm, kg)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in, lbs)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Height Input */}
      <div>
        <Label className="mb-1 font-semibold">Height</Label>
        {unit === "metric" ? (
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder="Height in centimeters"
            value={inputs.heightMetric}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, heightMetric: e.target.value }))
            }
            aria-label="Height in centimeters"
          />
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="Feet (ft)"
                value={inputs.heightFt}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightFt: e.target.value }))
                }
                aria-label="Height in feet"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={11}
                step={1}
                placeholder="Inches (in)"
                value={inputs.heightIn}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightIn: e.target.value }))
                }
                aria-label="Height in inches"
              />
            </div>
          </div>
        )}
      </div>

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="mb-1 font-semibold">
          Weight ({unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          id="weight"
          placeholder={`Weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
          value={inputs.weight}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
          aria-label={`Weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
        />
      </div>

      {/* Age Input */}
      <div>
        <Label htmlFor="age" className="mb-1 font-semibold">
          Age (years)
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          id="age"
          placeholder="Age in years"
          value={inputs.age}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, age: e.target.value }))
          }
          aria-label="Age in years"
        />
      </div>

      {/* Sex Selector */}
      <div>
        <Label htmlFor="sex" className="mb-1 font-semibold">
          Sex
        </Label>
        <Select
          value={inputs.sex}
          onValueChange={(value) =>
            setInputs((prev) => ({ ...prev, sex: value }))
          }
          id="sex"
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          aria-label="Calculate Basal Metabolic Rate"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 hover:bg-slate-100 text-slate-700"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results & Disclaimer */}
      <div ref={resultsRef} aria-live="polite" className="pt-4">
        {results.bmr !== null ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Basal Metabolic Rate (BMR)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-blue-600">
                {results.bmr} kcal/day
              </p>
              <p className="mt-2 text-sm text-slate-600">
                This is the estimated number of calories your body burns at rest
                daily.
              </p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Please enter valid positive values for all inputs to calculate BMR.
          </p>
        )}
      </div>
    </div>
  );

  // 6. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      {/* How to Use */}
      <section id="how-to-use">
        <h2 className="text-2xl font-bold mb-3">How to Use</h2>
        <p>
          Enter your height, weight, age, and sex using the appropriate units.
          Select the unit system you prefer: Metric (cm, kg) or Imperial (ft,
          in, lbs). For Imperial height, input your height in feet and inches
          separately. Click <strong>Calculate</strong> to see your Basal
          Metabolic Rate (BMR), which estimates how many calories your body
          burns at rest.
        </p>
      </section>

      {/* The Science */}
      <section id="formula">
        <h2 className="text-2xl font-bold mb-3">The Science Behind the Formula</h2>
        <p>
          The Mifflin-St Jeor equation was developed in 1990 to provide an
          accurate estimate of Basal Metabolic Rate (BMR) based on weight,
          height, age, and sex. It is widely used in clinical and fitness
          settings due to its improved accuracy over older formulas.
        </p>
        <p className="mt-2">
          The formula is:
        </p>
        <pre className="bg-slate-100 p-4 rounded text-sm font-mono mt-2">
          {`For men:
BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5

For women:
BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161`}
        </pre>
      </section>

      {/* Example Calculation */}
      <section id="example">
        <h2 className="text-2xl font-bold mb-3">Clinical Calculation Example</h2>
        <p>
          Consider a 35-year-old female who is 5 feet 6 inches tall and weighs
          150 lbs. Let's calculate her BMR using the Mifflin-St Jeor equation.
        </p>
        <ol className="list-decimal list-inside mt-3 space-y-2">
          <li>
            <strong>Step 1:</strong> Convert height to centimeters.
            <br />
            5 ft 6 in = (5 × 12) + 6 = 66 inches.
            <br />
            66 inches × 2.54 = 167.64 cm.
          </li>
          <li>
            <strong>Step 2:</strong> Convert weight to kilograms.
            <br />
            150 lbs × 0.45359237 = 68.04 kg.
          </li>
          <li>
            <strong>Step 3:</strong> Apply the formula for females:
            <br />
            BMR = (10 × 68.04) + (6.25 × 167.64) − (5 × 35) − 161
            <br />
            = 680.4 + 1047.75 − 175 − 161
            <br />
            = 1392.15 kcal/day (rounded to 1392 kcal/day).
          </li>
        </ol>
        <p className="mt-3 font-semibold">
          Interpretation: This woman’s body burns approximately 1392 calories per
          day at rest.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-3">Medical FAQ</h2>
        <dl className="space-y-4">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-blue-600">{question}</dt>
              <dd className="text-slate-700 mt-1">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* References */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-3">References</h2>
        <div>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/2228959/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-bold block"
          >
            A new predictive equation for resting energy expenditure in healthy individuals
          </a>
          <p className="text-sm text-slate-500">
            Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. Am J Clin Nutr. 1990.
          </p>
        </div>
        <div className="mt-4">
          <a
            href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-bold block"
          >
            Resting metabolic rate equations and their clinical applications
          </a>
          <p className="text-sm text-slate-500">
            Frankenfield D, Roth-Yousey L, Compher C. Nutrition in Clinical Practice, 2005.
          </p>
        </div>
      </section>
    </div>
  );

  // 7. RETURN (CRITICAL: FILL ALL PROPS)
  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      description="Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Medical Equation",
        formula: `For men: BMR = (10 × W) + (6.25 × H) − (5 × A) + 5
For women: BMR = (10 × W) + (6.25 × H) − (5 × A) − 161`,
        variables: [
          { symbol: "W", description: "Weight (kg)" },
          { symbol: "H", description: "Height (cm)" },
          { symbol: "A", description: "Age (years)" },
        ],
      }}
      example={{
        title: "Clinical Calculation Example",
        scenario:
          "A 35-year-old female, 5 ft 6 in tall, weighing 150 lbs wants to calculate her BMR.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height from feet and inches to centimeters: (5 × 12) + 6 = 66 inches; 66 × 2.54 = 167.64 cm.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert weight from pounds to kilograms: 150 × 0.45359237 = 68.04 kg.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the Mifflin-St Jeor formula for females: (10 × 68.04) + (6.25 × 167.64) − (5 × 35) − 161",
            calculation: "680.4 + 1047.75 − 175 − 161 = 1392.15 kcal/day",
          },
        ],
        result:
          "The estimated BMR is approximately 1392 kcal/day, indicating the calories burned at rest.",
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
        { id: "formula", label: "The Science" },
        { id: "example", label: "Example Calculation" },
        { id: "faq", label: "Medical FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}