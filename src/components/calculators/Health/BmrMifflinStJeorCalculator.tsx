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
    sex: "male", // male | female
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 2. LOGIC
  const results = useMemo(() => {
    // Parse inputs
    const ageNum = Number(inputs.age);
    const weightNum = Number(inputs.weight);
    let heightCm = 0;

    if (unit === "metric") {
      heightCm = Number(inputs.heightMetric);
    } else {
      // imperial: convert ft/in to total inches then to cm
      const ft = Number(inputs.heightFt);
      const inch = Number(inputs.heightIn);
      if (!isNaN(ft) && !isNaN(inch)) {
        const totalInches = ft * 12 + inch;
        heightCm = totalInches * 2.54;
      }
    }

    if (
      isNaN(ageNum) ||
      isNaN(weightNum) ||
      isNaN(heightCm) ||
      ageNum <= 0 ||
      weightNum <= 0 ||
      heightCm <= 0
    ) {
      return { bmr: null };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum * 0.45359237 : weightNum;

    // Mifflin-St Jeor Equation:
    // For men: BMR = 10W + 6.25H - 5A + 5
    // For women: BMR = 10W + 6.25H - 5A - 161
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum;
    bmr += inputs.sex === "male" ? 5 : -161;

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

  // 4. RICH CONTENT - FAQ
  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic physiological functions at rest, such as breathing, circulation, and cell production. It represents the minimum energy expenditure needed to sustain life in a resting state.",
    },
    {
      question: "Why use the Mifflin-St Jeor equation for BMR?",
      answer:
        "The Mifflin-St Jeor equation is widely regarded as one of the most accurate formulas for estimating BMR in healthy adults. It was developed in 1990 and has been validated across diverse populations, making it a preferred choice in clinical and fitness settings.",
    },
    {
      question: "How does age affect BMR?",
      answer:
        "BMR generally decreases with age due to loss of lean muscle mass and changes in hormonal levels. This decline means older adults typically require fewer calories to maintain their body functions compared to younger individuals.",
    },
    {
      question: "Why is height important in calculating BMR?",
      answer:
        "Height is a proxy for body size and surface area, which influences the amount of energy your body expends at rest. Taller individuals usually have higher BMRs because they have more tissue requiring energy to maintain.",
    },
    {
      question: "Can BMR be used to determine daily calorie needs?",
      answer:
        "BMR provides a baseline for calorie needs at rest. To estimate total daily energy expenditure (TDEE), you must multiply BMR by an activity factor that accounts for physical activity levels, digestion, and other factors.",
    },
    {
      question: "Is the Mifflin-St Jeor equation accurate for all populations?",
      answer:
        "While generally accurate for healthy adults, the Mifflin-St Jeor equation may be less precise for certain groups such as athletes, elderly individuals with significant muscle loss, or those with metabolic disorders. Clinical assessment may be needed for these populations.",
    },
    {
      question: "How do I convert my height and weight for this calculator?",
      answer:
        "If you use the Imperial system, enter your height in feet and inches separately, and your weight in pounds. The calculator will convert these to metric units internally for accurate calculation.",
    },
    {
      question: "What factors can influence my BMR besides age, sex, height, and weight?",
      answer:
        "Other factors include genetics, hormonal status (e.g., thyroid function), body composition (muscle vs fat), environmental temperature, and certain medications. These can cause variations in BMR beyond what the equation predicts.",
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
          onValueChange={(value) => setUnit(value as "metric" | "imperial")}
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

      {/* Sex */}
      <div>
        <Label htmlFor="sex" className="mb-1 inline-block font-semibold">
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
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Age */}
      <div>
        <Label htmlFor="age" className="mb-1 inline-block font-semibold">
          Age (years)
        </Label>
        <Input
          id="age"
          type="number"
          min={0}
          placeholder="e.g. 30"
          value={inputs.age}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, age: e.target.value }))
          }
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      {/* Height */}
      <div>
        <Label className="mb-1 inline-block font-semibold">Height</Label>
        {unit === "metric" ? (
          <Input
            type="number"
            min={0}
            placeholder="cm"
            value={inputs.heightMetric}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, heightMetric: e.target.value }))
            }
            inputMode="numeric"
            pattern="[0-9]*"
          />
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                min={0}
                placeholder="Feet (ft)"
                value={inputs.heightFt}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightFt: e.target.value }))
                }
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                min={0}
                max={11}
                placeholder="Inches (in)"
                value={inputs.heightIn}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightIn: e.target.value }))
                }
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
        )}
      </div>

      {/* Weight */}
      <div>
        <Label htmlFor="weight" className="mb-1 inline-block font-semibold">
          Weight ({unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          placeholder={unit === "metric" ? "kg" : "lbs"}
          value={inputs.weight}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 hover:bg-slate-100 text-slate-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results & Disclaimer */}
      <div ref={resultsRef} aria-live="polite" className="pt-4">
        {results.bmr !== null ? (
          <Card className="border-blue-600">
            <CardHeader>
              <CardTitle className="text-blue-600 font-semibold text-lg">
                Your Basal Metabolic Rate (BMR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-blue-600">{results.bmr} kcal/day</p>
              <p className="mt-2 text-sm text-slate-600">
                This is the estimated number of calories your body burns at rest daily.
              </p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Please enter valid inputs to calculate your BMR.
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
          Select your preferred unit system (Metric or Imperial), then enter your sex,
          age, height, and weight. For Imperial height, input your height in feet and inches
          separately. Click <strong>Calculate</strong> to see your Basal Metabolic Rate (BMR),
          which represents the calories your body needs at rest.
        </p>
      </section>

      {/* The Science */}
      <section id="formula">
        <h2 className="text-2xl font-bold mb-3">The Science Behind the Formula</h2>
        <p>
          The Mifflin-St Jeor equation estimates BMR based on weight, height, age, and sex.
          It is expressed as:
        </p>
        <pre className="bg-slate-100 p-4 rounded my-4 font-mono text-blue-600 text-lg">
          {`For men: BMR = 10 × W + 6.25 × H - 5 × A + 5
For women: BMR = 10 × W + 6.25 × H - 5 × A - 161

Where:
W = weight in kilograms
H = height in centimeters
A = age in years`}
        </pre>
        <p>
          This formula provides a reliable estimate of the calories burned at rest, which is
          essential for nutrition planning and weight management.
        </p>
      </section>

      {/* Example Calculation */}
      <section id="example">
        <h2 className="text-2xl font-bold mb-3">Clinical Calculation Example</h2>
        <p>
          Consider a 35-year-old female who is 5 feet 6 inches tall and weighs 150 lbs. Let's
          calculate her BMR using the Mifflin-St Jeor equation.
        </p>
        <ol className="list-decimal list-inside space-y-2 mt-4">
          <li>
            <strong>Step 1:</strong> Convert height and weight to metric units:
            <br />
            Height: (5 × 12) + 6 = 66 inches × 2.54 = 167.64 cm
            <br />
            Weight: 150 lbs × 0.453592 = 68.04 kg
          </li>
          <li>
            <strong>Step 2:</strong> Apply the formula for females:
            <br />
            BMR = 10 × 68.04 + 6.25 × 167.64 - 5 × 35 - 161
            <br />
            = 680.4 + 1047.75 - 175 - 161
            <br />
            = 1392.15 kcal/day
          </li>
        </ol>
        <p className="mt-4 font-semibold">
          Interpretation: This woman’s body burns approximately 1392 calories per day at rest.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-3">Medical FAQ</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-blue-600">{question}</h3>
            <p className="text-slate-700 mt-1">{answer}</p>
          </div>
        ))}
      </section>

      {/* References */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-3">References</h2>
        <div>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/17579600/"
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
            Resting metabolic rate and prediction equations in healthy adults: a systematic review
          </a>
          <p className="text-sm text-slate-500">
            Frankenfield D, Roth-Yousey L, Compher C. J Am Diet Assoc. 2005.
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
        formula:
          "For men: BMR = 10 × W + 6.25 × H - 5 × A + 5\nFor women: BMR = 10 × W + 6.25 × H - 5 × A - 161",
        variables: [
          { symbol: "W", description: "Weight (kg)" },
          { symbol: "H", description: "Height (cm)" },
          { symbol: "A", description: "Age (years)" },
        ],
      }}
      example={{
        title: "Clinical Calculation Example",
        scenario:
          "A 35-year-old female, 5 ft 6 in tall, weighing 150 lbs wants to know her BMR.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height and weight to metric units: Height = (5 × 12) + 6 = 66 inches × 2.54 = 167.64 cm; Weight = 150 lbs × 0.453592 = 68.04 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the Mifflin-St Jeor formula for females: BMR = 10 × 68.04 + 6.25 × 167.64 - 5 × 35 - 161",
            calculation: "680.4 + 1047.75 - 175 - 161 = 1392.15 kcal/day",
          },
        ],
        result: "Her estimated BMR is approximately 1392 kcal/day, the calories burned at rest.",
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