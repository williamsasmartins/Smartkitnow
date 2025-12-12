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
  // Convert inputs and calculate BMR using Mifflin-St Jeor formula:
  // For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
  // For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161

  const results = useMemo(() => {
    const ageNum = Number(inputs.age);
    if (
      !inputs.weight ||
      !inputs.age ||
      ageNum <= 0 ||
      isNaN(ageNum) ||
      (unit === "metric" && !inputs.heightMetric) ||
      (unit === "imperial" &&
        (inputs.heightFt === "" || inputs.heightIn === ""))
    ) {
      return { bmr: null };
    }

    // Convert weight to kg if imperial
    let weightKg: number;
    if (unit === "metric") {
      weightKg = Number(inputs.weight);
    } else {
      // lbs to kg
      weightKg = Number(inputs.weight) * 0.45359237;
    }
    if (weightKg <= 0 || isNaN(weightKg)) return { bmr: null };

    // Convert height to cm
    let heightCm: number;
    if (unit === "metric") {
      heightCm = Number(inputs.heightMetric);
    } else {
      const ft = Number(inputs.heightFt);
      const inch = Number(inputs.heightIn);
      if (ft < 0 || inch < 0 || inch >= 12 || isNaN(ft) || isNaN(inch))
        return { bmr: null };
      const totalInches = ft * 12 + inch;
      heightCm = totalInches * 2.54;
    }
    if (heightCm <= 0 || isNaN(heightCm)) return { bmr: null };

    // Calculate BMR
    let bmr: number;
    if (inputs.sex === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    return { bmr: Math.round(bmr) };
  }, [inputs, unit]);

  // 3. HANDLERS (Scroll & Reset)
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleUnitChange(value: "metric" | "imperial") {
    setUnit(value);
    // Reset height inputs on unit change
    setInputs((prev) => ({
      ...prev,
      heightMetric: "",
      heightFt: "",
      heightIn: "",
      weight: "",
    }));
  }

  function handleCalculate() {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleReset() {
    setUnit("metric");
    setInputs({
      heightMetric: "",
      heightFt: "",
      heightIn: "",
      weight: "",
      age: "",
      sex: "male",
    });
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // 4. RICH CONTENT
  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic physiological functions such as breathing, circulation, and cell production while at complete rest. It represents the minimum energy expenditure necessary to sustain life in a resting state.",
    },
    {
      question: "Why use the Mifflin-St Jeor equation for BMR?",
      answer:
        "The Mifflin-St Jeor equation is widely regarded as one of the most accurate formulas for estimating BMR in healthy adults. It was developed in 1990 and has been validated across diverse populations, outperforming older formulas like Harris-Benedict in accuracy.",
    },
    {
      question: "How does age affect BMR?",
      answer:
        "BMR generally decreases with age due to loss of lean muscle mass and changes in hormonal levels. The Mifflin-St Jeor formula accounts for age by subtracting a factor proportional to age, reflecting this natural decline in metabolic rate.",
    },
    {
      question: "Why is height important in calculating BMR?",
      answer:
        "Height is a proxy for body size and surface area, which influences the amount of energy the body expends at rest. Taller individuals typically have higher BMRs because they have more tissue requiring energy to maintain.",
    },
    {
      question: "Can BMR be used to determine daily calorie needs?",
      answer:
        "BMR represents calories burned at rest only. To estimate total daily calorie needs, physical activity and digestion energy costs must be added. This is often done using Total Daily Energy Expenditure (TDEE) calculators that multiply BMR by an activity factor.",
    },
    {
      question: "Is the Mifflin-St Jeor equation accurate for all populations?",
      answer:
        "While generally accurate for healthy adults, the Mifflin-St Jeor equation may be less precise for elderly individuals, children, pregnant women, or those with certain medical conditions. Clinical measurements like indirect calorimetry provide more precise BMR assessments in such cases.",
    },
    {
      question: "How do sex differences influence BMR calculations?",
      answer:
        "Men typically have higher BMRs than women due to greater lean muscle mass. The Mifflin-St Jeor formula accounts for this by adding 5 calories for men and subtracting 161 calories for women, adjusting the estimate accordingly.",
    },
    {
      question: "Why do we convert imperial units to metric in this calculator?",
      answer:
        "The Mifflin-St Jeor formula requires weight in kilograms and height in centimeters. When users input imperial units (feet, inches, pounds), these are converted to metric units internally to ensure accurate calculations.",
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
          onValueChange={(value) =>
            handleUnitChange(value as "metric" | "imperial")
          }
          value={unit}
          id="unit"
        >
          <SelectTrigger className="w-full h-11 border border-blue-600">
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
          onValueChange={(value) =>
            setInputs((prev) => ({ ...prev, sex: value }))
          }
          value={inputs.sex}
          id="sex"
        >
          <SelectTrigger className="w-full h-11 border border-blue-600">
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
          name="age"
          type="number"
          min={0}
          max={120}
          placeholder="e.g. 30"
          value={inputs.age}
          onChange={handleInputChange}
          className="border border-blue-600"
        />
      </div>

      {/* Height */}
      <div>
        <Label className="mb-1 inline-block font-semibold">Height</Label>
        {unit === "metric" ? (
          <Input
            id="heightMetric"
            name="heightMetric"
            type="number"
            min={0}
            placeholder="cm"
            value={inputs.heightMetric}
            onChange={handleInputChange}
            className="border border-blue-600"
          />
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="heightFt"
                name="heightFt"
                type="number"
                min={0}
                placeholder="Feet (ft)"
                value={inputs.heightFt}
                onChange={handleInputChange}
                className="border border-blue-600"
              />
            </div>
            <div className="flex-1">
              <Input
                id="heightIn"
                name="heightIn"
                type="number"
                min={0}
                max={11}
                placeholder="Inches (in)"
                value={inputs.heightIn}
                onChange={handleInputChange}
                className="border border-blue-600"
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
          name="weight"
          type="number"
          min={0}
          placeholder={unit === "metric" ? "kg" : "lbs"}
          value={inputs.weight}
          onChange={handleInputChange}
          className="border border-blue-600"
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
                This is the estimated number of calories your body burns at rest
                daily.
              </p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Please fill in all required fields to see your BMR.
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
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How to Use</h2>
        <p className="text-slate-700 leading-relaxed">
          Select your preferred unit system (Metric or Imperial), then enter your
          age, sex, height, and weight. For Imperial height, input your height in
          feet and inches separately. Click "Calculate" to see your Basal Metabolic
          Rate (BMR) in calories per day. Use this value to understand your body's
          resting energy needs.
        </p>
      </section>

      {/* The Science */}
      <section id="formula">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">The Science</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          The Mifflin-St Jeor equation estimates BMR based on weight, height, age,
          and sex. It is considered one of the most accurate formulas for healthy
          adults:
        </p>
        <Card className="border-blue-600 max-w-md">
          <CardHeader>
            <CardTitle className="text-blue-600 font-semibold text-lg">
              The Medical Equation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg mb-2">
              For men: <br />
              <span className="text-blue-600 font-bold">
                BMR = (10 × W) + (6.25 × H) − (5 × A) + 5
              </span>
            </p>
            <p className="font-mono text-lg mb-4">
              For women: <br />
              <span className="text-blue-600 font-bold">
                BMR = (10 × W) + (6.25 × H) − (5 × A) − 161
              </span>
            </p>
            <ul className="list-disc list-inside text-slate-700">
              <li>
                <strong>W</strong>: Weight in kilograms (kg)
              </li>
              <li>
                <strong>H</strong>: Height in centimeters (cm)
              </li>
              <li>
                <strong>A</strong>: Age in years
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Example Calculation */}
      <section id="example">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Clinical Calculation Example
        </h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          Consider a 35-year-old female who is 5 feet 6 inches tall and weighs 150
          lbs. Let's calculate her BMR using the Mifflin-St Jeor formula.
        </p>
        <Card className="border-blue-600 max-w-md">
          <CardHeader>
            <CardTitle className="text-blue-600 font-semibold text-lg">
              Step-by-Step Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside text-slate-700 space-y-2">
              <li>
                <strong>Convert height to cm:</strong> (5 ft × 12) + 6 in = 66 in; 66
                × 2.54 = 167.64 cm
              </li>
              <li>
                <strong>Convert weight to kg:</strong> 150 lbs × 0.45359237 = 68.04
                kg
              </li>
              <li>
                <strong>Apply formula for female:</strong>
                <br />
                BMR = (10 × 68.04) + (6.25 × 167.64) − (5 × 35) − 161
                <br />
                = 680.4 + 1047.75 − 175 − 161 = 1392.15 kcal/day
              </li>
            </ol>
            <p className="mt-4 font-semibold text-blue-600">
              Estimated BMR: ~1392 kcal/day
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Medical FAQ</h2>
        <div className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <Card key={i} className="border-blue-600">
              <CardHeader>
                <CardTitle className="text-blue-600 font-semibold text-lg">
                  {question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* References */}
      <section id="references">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">References</h2>
        <div className="space-y-6 text-slate-700">
          <div>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/22215853/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              A new predictive equation for resting energy expenditure in healthy
              individuals
            </a>
            <p className="text-sm text-slate-500">
              Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. Am J
              Clin Nutr. 1990 Feb;51(2):241-7.
            </p>
          </div>
          <div>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Resting metabolic rate equations for normal-weight and obese
              individuals
            </a>
            <p className="text-sm text-slate-500">
              Frankenfield D, Roth-Yousey L, Compher C. J Am Diet Assoc. 2005 May;105(5):775-85.
            </p>
          </div>
          <div>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4997436/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Comparison of predictive equations for resting metabolic rate in
              healthy adults
            </a>
            <p className="text-sm text-slate-500">
              Cunningham JJ. J Am Diet Assoc. 1980 Oct;77(4):439-44.
            </p>
          </div>
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
          "For men: BMR = (10 × W) + (6.25 × H) − (5 × A) + 5\nFor women: BMR = (10 × W) + (6.25 × H) − (5 × A) − 161",
        variables: [
          { symbol: "W", description: "Weight (kg)" },
          { symbol: "H", description: "Height (cm)" },
          { symbol: "A", description: "Age (years)" },
        ],
      }}
      example={{
        title: "Clinical Calculation Example",
        scenario:
          "A 35-year-old female who is 5 feet 6 inches tall and weighs 150 lbs wants to calculate her BMR.",
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
              "Apply the Mifflin-St Jeor formula for women: (10 × 68.04) + (6.25 × 167.64) − (5 × 35) − 161 = 1392.15 kcal/day.",
            calculation: "10*68.04 + 6.25*167.64 - 5*35 - 161 = 1392.15",
          },
        ],
        result:
          "The estimated Basal Metabolic Rate is approximately 1392 kcal/day, representing the calories burned at rest.",
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