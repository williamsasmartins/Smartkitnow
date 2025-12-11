import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Activity, User, Ruler, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Unit = "imperial" | "metric";

type Inputs = {
  gender: "male" | "female";
  age: string;
  weight: string;
  heightFt: string;
  heightIn: string;
  heightCm: string;
};

function BmrMifflinStJeorCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState<Unit>("imperial"); // "imperial" | "metric"
  const [inputs, setInputs] = useState<Inputs>({
    gender: "male",
    age: "",
    weight: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
  });
  const [showResult, setShowResult] = useState(false);

  // --- LOGIC ---
  const results = useMemo(() => {
    // Parse inputs
    const weightNum = parseFloat(inputs.weight);
    let heightCmNum: number | null = null;

    if (unit === "imperial") {
      const ft = parseFloat(inputs.heightFt);
      const inch = parseFloat(inputs.heightIn);
      if (!isNaN(ft) && !isNaN(inch)) {
        heightCmNum = ft * 30.48 + inch * 2.54;
      }
    } else {
      const cm = parseFloat(inputs.heightCm);
      if (!isNaN(cm)) {
        heightCmNum = cm;
      }
    }

    // Validate inputs
    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      heightCmNum === null ||
      heightCmNum <= 0
    ) {
      return { value: 0, status: "", color: "" };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum * 0.45359237 : weightNum;

    // BMI formula: weight (kg) / (height (m))^2
    const heightM = heightCmNum / 100;
    const bmiRaw = weightKg / (heightM * heightM);
    const bmi = Math.round(bmiRaw * 10) / 10; // one decimal place

    // Interpretation based on WHO BMI classification
    // https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
    let status = "";
    let color = "";

    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-amber-600 dark:text-amber-400";
    } else if (bmi >= 18.5 && bmi < 25) {
      status = "Normal weight";
      color = "text-emerald-600 dark:text-emerald-400";
    } else if (bmi >= 25 && bmi < 30) {
      status = "Overweight";
      color = "text-amber-700 dark:text-amber-500";
    } else if (bmi >= 30) {
      status = "Obese";
      color = "text-rose-600 dark:text-rose-400";
    } else {
      status = "Unknown";
      color = "text-slate-600 dark:text-slate-400";
    }

    return { value: bmi, status, color };
  }, [inputs, unit]);

  // --- FAQ SCHEMA ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses height and weight to estimate body fat. It helps assess if a person is underweight, normal weight, overweight, or obese.",
    },
    {
      question: "Do I need to enter my gender or age for BMI calculation?",
      answer:
        "BMI calculation does not require gender or age as it is a simple ratio of weight to height squared. However, these factors can influence health risk assessments.",
    },
    {
      question: "Can BMI accurately measure body fat?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat. It may not be accurate for athletes or those with high muscle mass.",
    },
    {
      question: "What are the BMI categories?",
      answer:
        "Underweight: <18.5, Normal weight: 18.5–24.9, Overweight: 25–29.9, Obese: 30 or greater.",
    },
    {
      question: "How can I improve my BMI?",
      answer:
        "Maintaining a balanced diet and regular physical activity can help achieve a healthy BMI.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- HANDLERS ---
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleUnitToggle(newUnit: Unit) {
    if (newUnit === unit) return;

    // Convert existing inputs when toggling units
    if (newUnit === "metric") {
      // imperial -> metric
      const ft = parseFloat(inputs.heightFt) || 0;
      const inch = parseFloat(inputs.heightIn) || 0;
      const weightLbs = parseFloat(inputs.weight) || 0;

      const heightCm = ft * 30.48 + inch * 2.54;
      const weightKg = weightLbs * 0.45359237;

      setInputs({
        ...inputs,
        heightCm: heightCm ? heightCm.toFixed(1) : "",
        heightFt: "",
        heightIn: "",
        weight: weightKg ? weightKg.toFixed(1) : "",
      });
    } else {
      // metric -> imperial
      const heightCm = parseFloat(inputs.heightCm) || 0;
      const weightKg = parseFloat(inputs.weight) || 0;

      const totalInches = heightCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = totalInches % 12;
      const weightLbs = weightKg / 0.45359237;

      setInputs({
        ...inputs,
        heightFt: ft ? ft.toString() : "",
        heightIn: inch ? inch.toFixed(1) : "",
        heightCm: "",
        weight: weightLbs ? weightLbs.toFixed(1) : "",
      });
    }
    setUnit(newUnit);
    setShowResult(false);
  }

  function handleCalculate() {
    setShowResult(true);
  }

  function handleReset() {
    setInputs({
      gender: "male",
      age: "",
      weight: "",
      heightFt: "",
      heightIn: "",
      heightCm: "",
    });
    setShowResult(false);
  }

  // --- WIDGET ---
  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <User className="h-5 w-5 text-sky-500" />
            Your Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 1. UNIT TOGGLE */}
          <div className="flex justify-center mb-4 space-x-2">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              onClick={() => handleUnitToggle("imperial")}
              aria-pressed={unit === "imperial"}
              aria-label="Use Imperial Units"
              className="w-24"
            >
              Imperial (ft, lbs)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              onClick={() => handleUnitToggle("metric")}
              aria-pressed={unit === "metric"}
              aria-label="Use Metric Units"
              className="w-24"
            >
              Metric (cm, kg)
            </Button>
          </div>

          {/* 2. BIOMETRIC INPUTS */}
          {/* Gender & Age are NOT required for BMI calculation */}
          {/* So we skip rendering gender and age inputs */}

          {/* 3. HEIGHT INPUT */}
          <div>
            <Label htmlFor="height" className="mb-1 block font-semibold">
              Height
            </Label>
            {unit === "imperial" ? (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    id="heightFt"
                    name="heightFt"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Feet"
                    value={inputs.heightFt}
                    onChange={handleInputChange}
                    aria-label="Height in feet"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="heightIn"
                    name="heightIn"
                    type="number"
                    min={0}
                    max={11}
                    step={0.1}
                    placeholder="Inches"
                    value={inputs.heightIn}
                    onChange={handleInputChange}
                    aria-label="Height in inches"
                  />
                </div>
              </div>
            ) : (
              <Input
                id="heightCm"
                name="heightCm"
                type="number"
                min={0}
                step={0.1}
                placeholder="Centimeters"
                value={inputs.heightCm}
                onChange={handleInputChange}
                aria-label="Height in centimeters"
              />
            )}
          </div>

          {/* 4. WEIGHT INPUT */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-semibold">
              Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min={0}
              step={0.1}
              placeholder={unit === "imperial" ? "Pounds" : "Kilograms"}
              value={inputs.weight}
              onChange={handleInputChange}
              aria-label={`Weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={handleCalculate}
          aria-label="Calculate BMI"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={handleReset}
          aria-label="Reset inputs"
        >
          Reset
        </Button>
      </div>

      {showResult && results.value > 0 && (
        <div className="space-y-6 mt-6">
          {/* MAIN RESULT - USE THIS EXACT GRADIENT */}
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                <Activity className="h-5 w-5" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  Your BMI
                </p>
                <p className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                  {results.value}
                </p>
                {/* Status Badge */}
                <span
                  className={
                    "inline-block px-3 py-1 rounded-full text-sm font-bold bg-white/50 dark:bg-black/20 " +
                    results.color
                  }
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {results.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Reference Table */}
          <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">BMI Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-2 px-3 border-b border-slate-300 dark:border-slate-700">
                      Category
                    </th>
                    <th className="py-2 px-3 border-b border-slate-300 dark:border-slate-700">
                      BMI Range (kg/m²)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="py-2 px-3 font-medium text-amber-600 dark:text-amber-400">
                      Underweight
                    </td>
                    <td className="py-2 px-3">&lt; 18.5</td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="py-2 px-3 font-medium text-emerald-600 dark:text-emerald-400">
                      Normal weight
                    </td>
                    <td className="py-2 px-3">18.5 – 24.9</td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="py-2 px-3 font-medium text-amber-700 dark:text-amber-500">
                      Overweight
                    </td>
                    <td className="py-2 px-3">25 – 29.9</td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="py-2 px-3 font-medium text-rose-600 dark:text-rose-400">
                      Obese
                    </td>
                    <td className="py-2 px-3">≥ 30</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL (DEEP MEDICAL CONTENT) ---
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your height and weight using either Imperial units (feet, inches,
          pounds) or Metric units (centimeters, kilograms). Toggle between units
          using the buttons above. Click "Calculate" to get your Body Mass Index
          (BMI) and understand your weight category based on internationally
          recognized standards.
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          BMI is a screening tool that helps identify potential weight problems
          for adults. It does not directly measure body fat but correlates with
          more direct measures. Use this calculator as a guide and consult a
          healthcare professional for a comprehensive health assessment.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula Used
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The Body Mass Index (BMI) is calculated using the formula:
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 font-mono text-lg bg-slate-100 dark:bg-slate-800 p-4 rounded">
          BMI = weight (kg) / [height (m)]²
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Where weight is in kilograms and height is in meters. For Imperial
          units, weight in pounds is converted to kilograms and height in feet
          and inches is converted to meters before calculation.
        </p>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Example Calculation
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Suppose an adult is 5 feet 7 inches tall and weighs 160 pounds.
        </p>
        <ol className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            Convert height to centimeters: (5 × 30.48) + (7 × 2.54) = 152.4 + 17.78 = 170.18 cm
          </li>
          <li>
            Convert weight to kilograms: 160 × 0.453592 = 72.57 kg
          </li>
          <li>
            Convert height to meters: 170.18 cm ÷ 100 = 1.7018 m
          </li>
          <li>
            Calculate BMI: 72.57 ÷ (1.7018)² = 72.57 ÷ 2.896 = 25.06
          </li>
          <li>
            Interpretation: BMI 25.06 indicates "Overweight" category.
          </li>
        </ol>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              {f.question}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Resources
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              World Health Organization: Obesity and Overweight
            </a>
            <p className="text-sm mt-1">
              Official WHO fact sheet on obesity, overweight, and BMI classification.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Centers for Disease Control and Prevention: About Adult BMI
            </a>
            <p className="text-sm mt-1">
              CDC resource explaining BMI, its uses, and limitations.
            </p>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              National Heart, Lung, and Blood Institute: BMI Calculator
            </a>
            <p className="text-sm mt-1">
              NIH resource providing BMI calculation and interpretation.
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
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formula Used" },
        { id: "example", label: "Example Calculation" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        title: "Medical Formula Used",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight (kg)", description: "Your weight in kilograms" },
          { symbol: "height (m)", description: "Your height in meters" },
        ],
      }}
      example={{
        title: "Clinical Example",
        scenario: "An adult 5'7\" tall weighing 160 lbs wants to know their BMI.",
        steps: [
          {
            step: 1,
            description: "Convert height to centimeters and weight to kilograms",
            calculation: "(5 × 30.48) + (7 × 2.54) = 170.18 cm; 160 × 0.453592 = 72.57 kg",
          },
          {
            step: 2,
            description: "Convert height to meters",
            calculation: "170.18 cm ÷ 100 = 1.7018 m",
          },
          {
            step: 3,
            description: "Calculate BMI",
            calculation: "72.57 ÷ (1.7018)² = 25.06",
          },
          {
            step: 4,
            description: "Interpret BMI",
            calculation: "BMI 25.06 indicates Overweight category",
          },
        ],
        result: "BMI of 25.06 means the person is Overweight.",
      }}
      relatedCalculators={[
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "❤️",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🏥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "⚖️",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "⚖️",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "⚖️",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "🧍",
        },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default BmrMifflinStJeorCalculator;