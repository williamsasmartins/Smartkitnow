import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Activity, User, Ruler, Scale } from "lucide-react"; // Icons
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

function TdeeDailyEnergyExpenditureCalculator() {
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
  const [touched, setTouched] = useState(false);

  // --- LOGIC ---
  const results = useMemo(() => {
    // Parse inputs
    const weightNum = parseFloat(inputs.weight);
    const heightFtNum = parseFloat(inputs.heightFt);
    const heightInNum = parseFloat(inputs.heightIn);
    const heightCmNum = parseFloat(inputs.heightCm);

    // Validate inputs
    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      (unit === "imperial" &&
        (isNaN(heightFtNum) || heightFtNum < 0 || isNaN(heightInNum) || heightInNum < 0)) ||
      (unit === "metric" && (isNaN(heightCmNum) || heightCmNum <= 0))
    ) {
      return null;
    }

    // Normalize height (cm) and weight (kg)
    let heightCm: number;
    let weightKg: number;

    if (unit === "imperial") {
      heightCm = heightFtNum * 30.48 + heightInNum * 2.54;
      weightKg = weightNum * 0.45359237;
    } else {
      heightCm = heightCmNum;
      weightKg = weightNum;
    }

    if (heightCm === 0) return null;

    // BMI Formula: BMI = weight(kg) / (height(m))^2
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Interpretation based on WHO BMI categories
    // https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
    let status = "";
    let color = "";

    if (bmi < 16) {
      status = "Severe Thinness";
      color = "text-rose-600 dark:text-rose-400";
    } else if (bmi >= 16 && bmi < 17) {
      status = "Moderate Thinness";
      color = "text-rose-500 dark:text-rose-400";
    } else if (bmi >= 17 && bmi < 18.5) {
      status = "Mild Thinness";
      color = "text-amber-600 dark:text-amber-400";
    } else if (bmi >= 18.5 && bmi < 25) {
      status = "Normal";
      color = "text-emerald-600 dark:text-emerald-400";
    } else if (bmi >= 25 && bmi < 30) {
      status = "Overweight";
      color = "text-amber-600 dark:text-amber-400";
    } else if (bmi >= 30 && bmi < 35) {
      status = "Obese Class I";
      color = "text-rose-600 dark:text-rose-400";
    } else if (bmi >= 35 && bmi < 40) {
      status = "Obese Class II";
      color = "text-rose-700 dark:text-rose-500";
    } else if (bmi >= 40) {
      status = "Obese Class III";
      color = "text-rose-800 dark:text-rose-600";
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
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are underweight, normal weight, overweight, or obese. It helps assess your risk for health problems related to weight.",
    },
    {
      question: "Do I need to enter my gender or age for BMI calculation?",
      answer:
        "No, BMI calculation does not require gender or age because it is a simple ratio of weight to height squared. However, interpretation may vary slightly with age and gender.",
    },
    {
      question: "What units can I use in this calculator?",
      answer:
        "You can switch between Imperial units (feet, inches, pounds) and Metric units (centimeters, kilograms) using the toggle at the top of the calculator.",
    },
    {
      question: "What do the BMI categories mean?",
      answer:
        "BMI categories indicate your weight status. For example, 'Normal' means a healthy weight range, while 'Overweight' or 'Obese' categories indicate increased health risks.",
    },
    {
      question: "Can BMI be inaccurate?",
      answer:
        "Yes, BMI does not distinguish between muscle and fat mass, so very muscular individuals may have a high BMI but low body fat. It is a screening tool, not a diagnostic.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
          <div className="flex justify-center mb-4 space-x-4">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              onClick={() => {
                setUnit("imperial");
                setInputs((prev) => ({
                  ...prev,
                  heightCm: "",
                }));
              }}
              aria-pressed={unit === "imperial"}
              aria-label="Use Imperial Units"
              className="min-w-[100px]"
            >
              Imperial (ft, in, lbs)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              onClick={() => {
                setUnit("metric");
                setInputs((prev) => ({
                  ...prev,
                  heightFt: "",
                  heightIn: "",
                }));
              }}
              aria-pressed={unit === "metric"}
              aria-label="Use Metric Units"
              className="min-w-[100px]"
            >
              Metric (cm, kg)
            </Button>
          </div>

          {/* 2. BIOMETRIC INPUTS */}
          {/* Gender and Age are NOT needed for BMI calculation */}
          {/* So we skip rendering gender and age inputs */}

          {/* 3. HEIGHT INPUT (Smart Toggle) */}
          <div>
            <Label htmlFor="height" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Height
            </Label>
            {unit === "imperial" ? (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    id="heightFt"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Feet"
                    value={inputs.heightFt}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, heightFt: e.target.value }))
                    }
                    aria-label="Height in feet"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="heightIn"
                    type="number"
                    min={0}
                    max={11}
                    step={0.1}
                    placeholder="Inches"
                    value={inputs.heightIn}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, heightIn: e.target.value }))
                    }
                    aria-label="Height in inches"
                  />
                </div>
              </div>
            ) : (
              <Input
                id="heightCm"
                type="number"
                min={0}
                step={0.1}
                placeholder="Centimeters"
                value={inputs.heightCm}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, heightCm: e.target.value }))
                }
                aria-label="Height in centimeters"
              />
            )}
          </div>

          {/* 4. WEIGHT INPUT */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Weight ({unit === "imperial" ? "pounds (lbs)" : "kilograms (kg)"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step={0.1}
              placeholder={unit === "imperial" ? "Pounds" : "Kilograms"}
              value={inputs.weight}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
              aria-label={`Weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => setTouched(true)}
          aria-label="Calculate BMI"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() => {
            setInputs({
              gender: "male",
              age: "",
              weight: "",
              heightFt: "",
              heightIn: "",
              heightCm: "",
            });
            setTouched(false);
          }}
          aria-label="Reset inputs"
        >
          Reset
        </Button>
      </div>

      {touched && results && (
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
                  {results.value.toFixed(1)}
                </p>
                {/* Status Badge */}
                <span
                  className={
                    "inline-block px-3 py-1 rounded-full text-sm font-bold bg-white/50 dark:bg-black/20 " +
                    results.color
                  }
                  aria-live="polite"
                >
                  {results.status}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Reference Table */}
          <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                BMI Categories Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead>
                  <tr>
                    <th className="border-b border-slate-300 dark:border-slate-700 px-3 py-1 font-semibold">
                      BMI Range (kg/m²)
                    </th>
                    <th className="border-b border-slate-300 dark:border-slate-700 px-3 py-1 font-semibold">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">{"< 16"}</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-rose-600 dark:text-rose-400">
                      Severe Thinness
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">16 - 16.9</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-rose-500 dark:text-rose-400">
                      Moderate Thinness
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">17 - 18.4</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-amber-600 dark:text-amber-400">
                      Mild Thinness
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">18.5 - 24.9</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-emerald-600 dark:text-emerald-400">
                      Normal
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">25 - 29.9</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-amber-600 dark:text-amber-400">
                      Overweight
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">30 - 34.9</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-rose-600 dark:text-rose-400">
                      Obese Class I
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1">35 - 39.9</td>
                    <td className="border-b border-slate-200 dark:border-slate-700 px-3 py-1 text-rose-700 dark:text-rose-500">
                      Obese Class II
                    </td>
                  </tr>
                  <tr className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="px-3 py-1">≥ 40</td>
                    <td className="px-3 py-1 text-rose-800 dark:text-rose-600">Obese Class III</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {touched && !results && (
        <p className="text-center text-rose-600 dark:text-rose-400 font-semibold mt-6" role="alert">
          Please enter valid height and weight values to calculate BMI.
        </p>
      )}
    </div>
  );

  // --- EDITORIAL (DEEP MEDICAL CONTENT) ---
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your height and weight using either Imperial units (feet, inches, pounds) or Metric units (centimeters, kilograms).
          Use the toggle above to switch between unit systems. Once you have entered valid values, click "Calculate" to get your BMI.
          The result will show your BMI value along with a color-coded interpretation of your weight status according to WHO guidelines.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula Used</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The Body Mass Index (BMI) is calculated using the formula:
        </p>
        <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded text-lg font-mono text-slate-900 dark:text-slate-100">
          BMI = weight (kg) / [height (m)]²
        </pre>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          When using Imperial units, weight in pounds is converted to kilograms (1 lb = 0.45359237 kg),
          and height in feet and inches is converted to meters (1 ft = 0.3048 m, 1 in = 0.0254 m).
        </p>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Example Calculation</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          For a person who is 5 feet 7 inches tall and weighs 150 pounds:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Convert height to centimeters: (5 × 30.48) + (7 × 2.54) = 152.4 + 17.78 = 170.18 cm
          </li>
          <li>Convert weight to kilograms: 150 × 0.45359237 = 68.04 kg</li>
          <li>Convert height to meters: 170.18 ÷ 100 = 1.7018 m</li>
          <li>Calculate BMI: 68.04 ÷ (1.7018)² = 68.04 ÷ 2.896 = 23.5</li>
          <li>Interpretation: BMI 23.5 is within the "Normal" weight range.</li>
        </ol>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {/* Render visible FAQs */}
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              World Health Organization - Obesity and Overweight Fact Sheet
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Provides global information on BMI and obesity classifications.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Centers for Disease Control and Prevention - About Adult BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Detailed explanation of BMI calculation and interpretation.
            </p>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              National Heart, Lung, and Blood Institute - BMI Calculator
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Official BMI calculator and guidelines for healthy weight.
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
        scenario: "A person who is 5 feet 7 inches tall and weighs 150 pounds",
        steps: [
          {
            step: 1,
            description: "Convert height to centimeters",
            calculation: "(5 × 30.48) + (7 × 2.54) = 170.18 cm",
          },
          {
            step: 2,
            description: "Convert weight to kilograms",
            calculation: "150 × 0.45359237 = 68.04 kg",
          },
          {
            step: 3,
            description: "Convert height to meters",
            calculation: "170.18 ÷ 100 = 1.7018 m",
          },
          {
            step: 4,
            description: "Calculate BMI",
            calculation: "68.04 ÷ (1.7018)² = 23.5",
          },
        ],
        result: "BMI 23.5 is within the 'Normal' weight range.",
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

export default TdeeDailyEnergyExpenditureCalculator;