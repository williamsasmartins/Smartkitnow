import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, Heart, Ruler, User } from "lucide-react"; // Icons
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Unit = "imperial" | "metric";

export default function BmiBodyMassIndexCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState<Unit>("imperial"); // "imperial" | "metric"
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg depending on unit
    heightFt: "", // imperial feet
    heightIn: "", // imperial inches
    heightCm: "", // metric cm
  });

  // --- LOGIC ---
  const results = useMemo(() => {
    // Parse inputs
    const weightNum = parseFloat(inputs.weight);
    let heightCmNum: number | null = null;

    if (unit === "imperial") {
      const ft = parseFloat(inputs.heightFt);
      const inch = parseFloat(inputs.heightIn);
      if (!isNaN(ft) && !isNaN(inch) && ft >= 0 && inch >= 0) {
        heightCmNum = ft * 30.48 + inch * 2.54;
      }
    } else {
      const cm = parseFloat(inputs.heightCm);
      if (!isNaN(cm) && cm > 0) {
        heightCmNum = cm;
      }
    }

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      heightCmNum === null ||
      heightCmNum <= 0
    ) {
      return null;
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum * 0.45359237 : weightNum;

    // Height in meters
    const heightM = heightCmNum / 100;

    // BMI formula: weight (kg) / height (m)^2
    const bmiRaw = weightKg / (heightM * heightM);
    const bmi = Math.round(bmiRaw * 10) / 10; // 1 decimal place

    // Determine BMI category and color
    // Categories based on WHO standards:
    // Underweight < 18.5
    // Normal 18.5 - 24.9
    // Overweight 25 - 29.9
    // Obesity I 30 - 34.9
    // Obesity II 35 - 39.9
    // Obesity III >= 40

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
      color = "text-amber-600 dark:text-amber-400";
    } else if (bmi >= 30 && bmi < 35) {
      status = "Obesity Class I";
      color = "text-rose-600 dark:text-rose-400";
    } else if (bmi >= 35 && bmi < 40) {
      status = "Obesity Class II";
      color = "text-rose-700 dark:text-rose-500";
    } else {
      status = "Obesity Class III";
      color = "text-rose-800 dark:text-rose-600";
    }

    return { value: bmi, status, color };
  }, [inputs, unit]);

  // --- FAQ SCHEMA ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate if you are underweight, normal weight, overweight, or obese. It helps assess potential health risks related to body weight.",
    },
    {
      question: "Does BMI calculation require my gender or age?",
      answer:
        "No, BMI calculation is based solely on height and weight. However, interpretation of BMI can vary with age and gender, but the formula itself does not require them.",
    },
    {
      question: "Why do I need to enter height in feet and inches for Imperial units?",
      answer:
        "Height in Imperial units is commonly measured in feet and inches separately to improve accuracy and user familiarity.",
    },
    {
      question: "Can BMI accurately measure body fat?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat percentage. Other methods are needed for precise body fat measurement.",
    },
    {
      question: "What should I do if my BMI is outside the normal range?",
      answer:
        "If your BMI indicates underweight, overweight, or obesity, consider consulting a healthcare professional for personalized advice and possible lifestyle changes.",
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
              onClick={() => setUnit("imperial")}
              aria-pressed={unit === "imperial"}
              aria-label="Use Imperial units"
              className="w-24"
            >
              Imperial (ft, lbs)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              onClick={() => setUnit("metric")}
              aria-pressed={unit === "metric"}
              aria-label="Use Metric units"
              className="w-24"
            >
              Metric (cm, kg)
            </Button>
          </div>

          {/* 2. HEIGHT INPUT */}
          <div>
            <Label htmlFor="height" className="mb-1 font-semibold block">
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
                      setInputs((prev) => ({
                        ...prev,
                        heightFt: e.target.value.replace(/[^0-9]/g, ""),
                      }))
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
                    step={1}
                    placeholder="Inches"
                    value={inputs.heightIn}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9]/g, "");
                      if (val !== "") {
                        const num = Math.min(11, Math.max(0, parseInt(val)));
                        val = num.toString();
                      }
                      setInputs((prev) => ({
                        ...prev,
                        heightIn: val,
                      }));
                    }}
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
                  setInputs((prev) => ({
                    ...prev,
                    heightCm: e.target.value.replace(/[^0-9.]/g, ""),
                  }))
                }
                aria-label="Height in centimeters"
              />
            )}
          </div>

          {/* 3. WEIGHT INPUT */}
          <div>
            <Label htmlFor="weight" className="mb-1 font-semibold block">
              Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step={0.1}
              placeholder={unit === "imperial" ? "Pounds" : "Kilograms"}
              value={inputs.weight}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  weight: e.target.value.replace(/[^0-9.]/g, ""),
                }))
              }
              aria-label={`Weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate BMI"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() =>
            setInputs({
              weight: "",
              heightFt: "",
              heightIn: "",
              heightCm: "",
            })
          }
          aria-label="Reset inputs"
        >
          Reset
        </Button>
      </div>

      {results && (
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
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>BMI Range (kg/m²)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Underweight</TableCell>
                    <TableCell>&lt; 18.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Normal weight</TableCell>
                    <TableCell>18.5 – 24.9</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Overweight</TableCell>
                    <TableCell>25 – 29.9</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Obesity Class I</TableCell>
                    <TableCell>30 – 34.9</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Obesity Class II</TableCell>
                    <TableCell>35 – 39.9</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Obesity Class III</TableCell>
                    <TableCell>≥ 40</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
          pounds) or Metric units (centimeters, kilograms). Select the unit system
          you prefer using the toggle buttons. For Imperial height, input feet and
          inches separately for accuracy. Click "Calculate" to see your Body Mass
          Index (BMI) along with its interpretation based on standard medical
          categories. Use the "Reset" button to clear all inputs and start over.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula Used
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          BMI is calculated using the formula:
        </p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-lg font-mono text-center">
          BMI = weight (kg) / [height (m)]²
        </pre>
        <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          When using Imperial units, weight is converted from pounds to kilograms,
          and height is converted from feet and inches to meters before calculation.
        </p>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Example Calculation
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Suppose a person is 5 feet 7 inches tall and weighs 160 pounds.
        </p>
        <ol className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            Convert height to centimeters: (5 × 30.48) + (7 × 2.54) = 152.4 + 17.78 = 170.18 cm
          </li>
          <li>
            Convert weight to kilograms: 160 × 0.453592 = 72.57 kg
          </li>
          <li>
            Convert height to meters: 170.18 / 100 = 1.7018 m
          </li>
          <li>
            Calculate BMI: 72.57 / (1.7018)² = 72.57 / 2.896 = 25.06
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
        {/* Render visible FAQs */}
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              {f.question}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>

      <section
        id="references"
        className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12"
      >
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              CDC - About Adult BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive information on BMI and its use in assessing healthy
              weight.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              WHO - Obesity and Overweight Fact Sheet
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              World Health Organization's overview of obesity, BMI categories, and
              health implications.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NIH - Calculate Your BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              National Institutes of Health resource for BMI calculation and
              interpretation.
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
          { symbol: "weight", description: "Your body weight in kilograms" },
          { symbol: "height", description: "Your height in meters" },
        ],
      }}
      example={{
        title: "Clinical Example",
        scenario:
          "A person who is 5 feet 7 inches tall and weighs 160 pounds wants to know their BMI.",
        steps: [
          {
            step: 1,
            description:
              "Convert height to centimeters: (5 × 30.48) + (7 × 2.54) = 170.18 cm",
            calculation: "5 × 30.48 + 7 × 2.54 = 170.18",
          },
          {
            step: 2,
            description: "Convert weight to kilograms: 160 × 0.453592 = 72.57 kg",
            calculation: "160 × 0.453592 = 72.57",
          },
          {
            step: 3,
            description: "Convert height to meters: 170.18 / 100 = 1.7018 m",
            calculation: "170.18 / 100 = 1.7018",
          },
          {
            step: 4,
            description: "Calculate BMI: 72.57 / (1.7018)² = 25.06",
            calculation: "72.57 / (1.7018 × 1.7018) = 25.06",
          },
        ],
        result: "BMI of 25.06 indicates 'Overweight' category.",
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