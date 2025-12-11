import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, Activity, Scale, AlertCircle, Check } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type UnitType = "imperial" | "metric";
type GenderType = "male" | "female";

interface Inputs {
  gender: GenderType | "";
  age: string;
  height: string;
  weight: string;
}

interface Result {
  mainValue: string;
  status: string;
  color: string;
  details: {
    bmiNumber: number;
    interpretation: string;
    note: string;
  };
}

const BMI_CATEGORIES_ADULT = [
  { max: 18.5, label: "Underweight", color: "text-blue-600 dark:text-blue-400" },
  { max: 24.9, label: "Normal weight", color: "text-emerald-600 dark:text-emerald-400" },
  { max: 29.9, label: "Overweight", color: "text-amber-600 dark:text-amber-400" },
  { max: Infinity, label: "Obese", color: "text-rose-600 dark:text-rose-400" },
];

// For children/adolescents, BMI interpretation is percentile-based and varies by age/gender.
// Here we provide a simplified placeholder interpretation.
// In real-world, would integrate CDC or WHO BMI-for-age percentile charts.
function interpretBmiChild(bmi: number, age: number, gender: GenderType): { label: string; color: string; note: string } {
  // Simplified logic:
  // <5th percentile = underweight
  // 5th-85th percentile = healthy weight
  // 85th-95th percentile = overweight
  // >95th percentile = obese
  // Since we don't have percentile calculator here, approximate by BMI thresholds adjusted by age.
  // This is a simplification for demo purposes.

  // Approximate thresholds for children (varies by age/gender, so this is a rough estimate)
  // Younger children have lower BMI thresholds.
  // We'll linearly interpolate thresholds between age 2 and 20.

  // For demo:
  // Underweight < 14 + (age - 2)*0.3
  // Healthy 14+(age-2)*0.3 to 19+(age-2)*0.4
  // Overweight 19+(age-2)*0.4 to 22+(age-2)*0.5
  // Obese > 22+(age-2)*0.5

  if (age < 2) {
    return { label: "Age too low for BMI interpretation", color: "text-slate-600 dark:text-slate-400", note: "BMI not valid under 2 years old." };
  }
  if (age > 20) {
    return { label: "Use adult BMI interpretation", color: "text-slate-600 dark:text-slate-400", note: "Age over 20 years, use adult BMI." };
  }

  const underweightThreshold = 14 + (age - 2) * 0.3;
  const healthyUpper = 19 + (age - 2) * 0.4;
  const overweightUpper = 22 + (age - 2) * 0.5;

  if (bmi < underweightThreshold) {
    return { label: "Underweight (child)", color: "text-blue-600 dark:text-blue-400", note: "BMI below 5th percentile approx." };
  }
  if (bmi < healthyUpper) {
    return { label: "Healthy weight (child)", color: "text-emerald-600 dark:text-emerald-400", note: "BMI between 5th and 85th percentile approx." };
  }
  if (bmi < overweightUpper) {
    return { label: "Overweight (child)", color: "text-amber-600 dark:text-amber-400", note: "BMI between 85th and 95th percentile approx." };
  }
  return { label: "Obese (child)", color: "text-rose-600 dark:text-rose-400", note: "BMI above 95th percentile approx." };
}

export default function BmiBodyMassIndexCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState<UnitType>("imperial");
  const [inputs, setInputs] = useState<Inputs>({
    gender: "",
    age: "",
    height: "",
    weight: "",
  });
  const [calculated, setCalculated] = useState<Result | null>(null);

  // --- LOGIC ---
  const results = useMemo(() => {
    // Parse inputs safely
    const gender = inputs.gender as GenderType;
    const ageNum = Number(inputs.age);
    const heightRaw = Number(inputs.height);
    const weightRaw = Number(inputs.weight);

    if (
      !gender ||
      isNaN(ageNum) ||
      ageNum <= 0 ||
      isNaN(heightRaw) ||
      heightRaw <= 0 ||
      isNaN(weightRaw) ||
      weightRaw <= 0
    ) {
      return null;
    }

    // Normalize units to metric internally
    // Height: if imperial, input assumed in inches, convert to meters
    // Weight: if imperial, input assumed in pounds, convert to kg
    // Metric inputs: height in cm, convert to meters; weight in kg as is

    let heightM: number;
    let weightKg: number;

    if (unit === "imperial") {
      heightM = heightRaw * 0.0254; // inches to meters
      weightKg = weightRaw * 0.45359237; // pounds to kg
    } else {
      heightM = heightRaw / 100; // cm to meters
      weightKg = weightRaw;
    }

    if (heightM <= 0 || weightKg <= 0) return null;

    // Calculate BMI
    const bmi = weightKg / (heightM * heightM);

    // Interpretation depends on age:
    // Adults (20+): use standard BMI categories
    // Children (<20): use percentile approx

    let status = "";
    let colorClass = "";
    let note = "";

    if (ageNum >= 20) {
      // Adult interpretation
      const category = BMI_CATEGORIES_ADULT.find((cat) => bmi <= cat.max)!;
      status = category.label;
      colorClass = category.color;
      note = "BMI categories based on WHO standards for adults.";
    } else {
      // Child/adolescent interpretation
      const interp = interpretBmiChild(bmi, ageNum, gender);
      status = interp.label;
      colorClass = interp.color;
      note = interp.note;
    }

    return {
      mainValue: bmi.toFixed(1),
      status,
      color: colorClass,
      details: {
        bmiNumber: bmi,
        interpretation: status,
        note,
      },
    };
  }, [inputs, unit]);

  // --- FAQ SCHEMA ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses your height and weight to estimate body fat. It helps assess if you are underweight, normal weight, overweight, or obese.",
    },
    {
      question: "Why do I need to enter my age and gender?",
      answer:
        "BMI interpretation differs for children and adults. Age and gender help provide a more accurate assessment, especially for those under 20 years old.",
    },
    {
      question: "What units can I use for height and weight?",
      answer:
        "You can toggle between Imperial units (inches, pounds) and Metric units (centimeters, kilograms) for your convenience.",
    },
    {
      question: "Is BMI a perfect measure of health?",
      answer:
        "BMI is a useful screening tool but does not directly measure body fat or muscle mass. For a complete health assessment, consult a healthcare professional.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET ---
  const widget = (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {/* Unit Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUnit("imperial")}
              aria-pressed={unit === "imperial"}
              aria-label="Use Imperial Units"
            >
              Imperial (in, lbs)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setUnit("metric")}
              aria-pressed={unit === "metric"}
              aria-label="Use Metric Units"
            >
              Metric (cm, kg)
            </Button>
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <select
              id="gender"
              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50"
              value={inputs.gender}
              onChange={(e) => setInputs((prev) => ({ ...prev, gender: e.target.value as GenderType }))}
              aria-required="true"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={0}
              max={120}
              placeholder="e.g. 25"
              value={inputs.age}
              onChange={(e) => setInputs((prev) => ({ ...prev, age: e.target.value }))}
              aria-required="true"
            />
          </div>

          {/* Height */}
          <div>
            <Label htmlFor="height" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "imperial" ? "e.g. 70" : "e.g. 175"}
              value={inputs.height}
              onChange={(e) => setInputs((prev) => ({ ...prev, height: e.target.value }))}
              aria-required="true"
            />
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Weight ({unit === "imperial" ? "pounds" : "kilograms"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
              value={inputs.weight}
              onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
              aria-required="true"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            // Trigger calculation
            const res = results;
            setCalculated(res);
          }}
          aria-label="Calculate BMI"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() => {
            setInputs({ gender: "", age: "", height: "", weight: "" });
            setCalculated(null);
          }}
          aria-label="Reset Inputs"
        >
          Reset
        </Button>
      </div>

      {calculated && (
        <div className="space-y-6 mt-6">
          {/* MAIN RESULT - EXACT FINTECH GRADIENT */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50" aria-live="polite" aria-atomic="true">
                {calculated.mainValue}
              </p>
              <p className={"mt-2 text-lg font-medium " + (calculated.color || "text-slate-700 dark:text-slate-300")}>{calculated.status}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{calculated.details.note}</p>
            </CardContent>
          </Card>

          {/* SECONDARY RESULTS / TABLE */}
          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>BMI Number</TableCell>
                    <TableCell>{calculated.details.bmiNumber.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interpretation</TableCell>
                    <TableCell>{calculated.details.interpretation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Age</TableCell>
                    <TableCell>{inputs.age} years</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gender</TableCell>
                    <TableCell>{inputs.gender.charAt(0).toUpperCase() + inputs.gender.slice(1)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Height</TableCell>
                    <TableCell>
                      {unit === "imperial" ? `${inputs.height} in` : `${inputs.height} cm`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weight</TableCell>
                    <TableCell>
                      {unit === "imperial" ? `${inputs.weight} lbs` : `${inputs.weight} kg`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL (DEEP CONTENT) ---
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your gender, age, height, and weight to calculate your Body Mass Index (BMI). You can toggle between Imperial units (inches and pounds) or Metric units (centimeters and kilograms). The calculator provides a BMI value along with an interpretation based on your age group:
        </p>
        <ul className="list-disc list-inside mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <strong>Adults (20 years and older):</strong> BMI categories follow WHO standards (Underweight, Normal weight, Overweight, Obese).
          </li>
          <li>
            <strong>Children and Adolescents (under 20 years):</strong> BMI interpretation is approximate based on age and gender percentiles.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this calculator as a screening tool. For personalized health advice, consult a healthcare professional.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula Used</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The BMI is calculated using the formula:
        </p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-lg font-mono text-slate-900 dark:text-slate-50">
          BMI = weight (kg) / [height (m)]²
        </pre>
        <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          For Imperial units, height in inches is converted to meters, and weight in pounds is converted to kilograms before calculation.
        </p>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Example Calculation</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Suppose a 30-year-old male is 70 inches tall and weighs 180 pounds. To calculate BMI:
        </p>
        <ol className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
          <li>Convert height to meters: 70 in × 0.0254 = 1.778 m</li>
          <li>Convert weight to kilograms: 180 lbs × 0.45359237 = 81.65 kg</li>
          <li>Calculate BMI: 81.65 / (1.778)² = 25.8</li>
          <li>Interpretation: BMI of 25.8 falls into the "Overweight" category for adults.</li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
          Final Result: BMI = 25.8 (Overweight)
        </p>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              CDC - About Adult BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Comprehensive information on BMI and its interpretation for adults.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/childrens_bmi/about_childrens_bmi.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              CDC - About Child and Teen BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Guidance on BMI for children and adolescents, including percentile charts.
            </p>
          </li>
          <li>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              WHO - Obesity and Overweight Fact Sheet
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Global standards and health implications of BMI categories.
            </p>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NIH - BMI Calculator and Interpretation
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Official BMI calculator and detailed interpretation guidelines.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // --- FINAL RENDER ---
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
        title: "Formula Used",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight", description: "Your weight in kilograms (kg)" },
          { symbol: "height", description: "Your height in meters (m)" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario: "A 30-year-old male who is 70 inches tall and weighs 180 pounds.",
        steps: [
          { step: 1, description: "Convert height to meters", calculation: "70 in × 0.0254 = 1.778 m" },
          { step: 2, description: "Convert weight to kilograms", calculation: "180 lbs × 0.45359237 = 81.65 kg" },
          { step: 3, description: "Calculate BMI", calculation: "81.65 / (1.778)² = 25.8" },
          { step: 4, description: "Interpret BMI", calculation: "25.8 = Overweight category" },
        ],
        result: "BMI = 25.8 (Overweight)",
      }}
      relatedCalculators={[
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "❤️" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🧮" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "⚖️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "⚖️" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "⚖️" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "⚖️" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}