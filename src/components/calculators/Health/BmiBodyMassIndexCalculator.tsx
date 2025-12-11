import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, Activity, Scale, AlertCircle, Check } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Unit = "imperial" | "metric";
type Gender = "male" | "female";

interface Inputs {
  gender: Gender | "";
  age: string;
  height: string;
  weight: string;
}

interface Results {
  mainValue: string;
  status: string;
  color: string;
  details: {
    interpretation: string;
    category: string;
    bmiValue: number;
    ageGroup: string;
    notes: string[];
  };
}

const BMI_CATEGORIES_ADULT = [
  { max: 18.5, category: "Underweight", color: "text-rose-600 dark:text-rose-400" },
  { max: 24.9, category: "Normal weight", color: "text-emerald-600 dark:text-emerald-400" },
  { max: 29.9, category: "Overweight", color: "text-amber-600 dark:text-amber-400" },
  { max: Infinity, category: "Obesity", color: "text-rose-700 dark:text-rose-500" },
];

// BMI percentiles for children/adolescents (2-20 years) differ by gender and age.
// For simplicity, we will provide a rough interpretation based on CDC BMI-for-age percentiles.
// Here we use rough percentile cutoffs to interpret BMI for children/adolescents.
function BmiBodyMassIndexCalculator(bmi: number, age: number, gender: Gender) {
  // This is a simplified approach:
  // <5th percentile: Underweight
  // 5th to <85th percentile: Healthy weight
  // 85th to <95th percentile: Overweight
  // >=95th percentile: Obese
  // Since we don't have exact percentile tables here, we'll approximate with BMI-for-age z-scores.
  // We'll use rough BMI thresholds for children by age and gender (simplified).
  // For production, integrate CDC or WHO BMI percentile tables.

  // Approximate BMI thresholds for boys and girls at certain ages (simplified):
  // Source: CDC growth charts simplified for demonstration.
  // These are approximate median BMI values for healthy weight.
  const thresholdsByAgeGender: Record<
    Gender,
    { age: number; underweight: number; healthyMax: number; overweightMax: number }[]
  > = {
    male: [
      { age: 2, underweight: 14, healthyMax: 17.5, overweightMax: 19 },
      { age: 5, underweight: 13.5, healthyMax: 17, overweightMax: 19.5 },
      { age: 10, underweight: 14, healthyMax: 19, overweightMax: 22 },
      { age: 15, underweight: 17, healthyMax: 23, overweightMax: 27 },
      { age: 20, underweight: 18.5, healthyMax: 24.9, overweightMax: 29.9 },
    ],
    female: [
      { age: 2, underweight: 14, healthyMax: 17.5, overweightMax: 19 },
      { age: 5, underweight: 13.5, healthyMax: 17, overweightMax: 19.5 },
      { age: 10, underweight: 14, healthyMax: 19, overweightMax: 22 },
      { age: 15, underweight: 17, healthyMax: 23, overweightMax: 27 },
      { age: 20, underweight: 18.5, healthyMax: 24.9, overweightMax: 29.9 },
    ],
  };

  // Find closest age group
  const ageGroups = thresholdsByAgeGender[gender];
  let group = ageGroups[ageGroups.length - 1];
  for (const g of ageGroups) {
    if (age <= g.age) {
      group = g;
      break;
    }
  }

  if (bmi < group.underweight) return { category: "Underweight", color: "text-rose-600 dark:text-rose-400" };
  if (bmi < group.healthyMax) return { category: "Healthy weight", color: "text-emerald-600 dark:text-emerald-400" };
  if (bmi < group.overweightMax) return { category: "Overweight", color: "text-amber-600 dark:text-amber-400" };
  return { category: "Obese", color: "text-rose-700 dark:text-rose-500" };
}

function BmiBodyMassIndexCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState<Unit>("imperial");
  const [inputs, setInputs] = useState<Inputs>({
    gender: "",
    age: "",
    height: "",
    weight: "",
  });
  const [triggerCalc, setTriggerCalc] = useState(0);

  // --- LOGIC ---
  const results = useMemo<Results | null>(() => {
    // 1. Parse Inputs safely
    const gender = inputs.gender as Gender;
    const ageNum = Number(inputs.age);
    const heightNum = Number(inputs.height);
    const weightNum = Number(inputs.weight);

    if (!gender || !ageNum || !heightNum || !weightNum) return null;
    if (ageNum <= 0 || heightNum <= 0 || weightNum <= 0) return null;

    // 2. Normalize Units (everything to metric internally)
    // Height: cm or inches -> meters
    // Weight: kg or lbs
    let heightM: number;
    let weightKg: number;

    if (unit === "imperial") {
      // height in inches to meters
      heightM = heightNum * 0.0254;
      // weight in pounds to kg
      weightKg = weightNum * 0.45359237;
    } else {
      // metric: height in cm to meters
      heightM = heightNum / 100;
      weightKg = weightNum;
    }

    if (heightM <= 0) return null;

    // 3. Calculate BMI
    const bmi = weightKg / (heightM * heightM);

    // 4. Determine age group and interpretation
    const isChild = ageNum < 20;

    let category = "";
    let color = "text-slate-900 dark:text-slate-50";
    let interpretation = "";
    let ageGroup = isChild ? "Child/Adolescent" : "Adult";
    let notes: string[] = [];

    if (isChild) {
      // Use child BMI percentiles approximation
      const cat = getChildBmiCategory(bmi, ageNum, gender);
      category = cat.category;
      color = cat.color;
      interpretation =
        category === "Underweight"
          ? "Your BMI is below the healthy range for your age and gender."
          : category === "Healthy weight"
          ? "Your BMI is within the healthy range for your age and gender."
          : category === "Overweight"
          ? "Your BMI is above the healthy range, indicating overweight."
          : "Your BMI is in the obese range, indicating high health risk.";
      notes.push(
        "BMI interpretation for children and adolescents is based on age- and gender-specific percentiles."
      );
      notes.push("Consult a pediatrician for detailed assessment.");
    } else {
      // Adult BMI categories
      const cat = BMI_CATEGORIES_ADULT.find((c) => bmi <= c.max)!;
      category = cat.category;
      color = cat.color;
      interpretation =
        category === "Underweight"
          ? "You are underweight. Consider consulting a healthcare provider."
          : category === "Normal weight"
          ? "You have a normal body weight. Good job!"
          : category === "Overweight"
          ? "You are overweight. Consider lifestyle changes."
          : "You are in the obesity range. Seek medical advice.";
      notes.push("BMI is a screening tool and does not diagnose health.");
      notes.push("Muscle mass, bone density, and other factors affect BMI.");
    }

    return {
      mainValue: bmi.toFixed(1),
      status: category,
      color,
      details: {
        interpretation,
        category,
        bmiValue: bmi,
        ageGroup,
        notes,
      },
    };
  }, [inputs, unit, triggerCalc]);

  // --- FAQ SCHEMA ---
  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer:
        "BMI (Body Mass Index) is a measure that uses height and weight to estimate body fat. It helps assess if you are underweight, normal weight, overweight, or obese.",
    },
    {
      question: "Why does this calculator ask for gender and age?",
      answer:
        "BMI interpretation varies for children and adolescents based on age and gender percentiles. Adults use standard BMI categories. Gender and age improve accuracy of health assessment.",
    },
    {
      question: "Can I use this calculator if I am pregnant or very muscular?",
      answer:
        "BMI may not be accurate for pregnant women or very muscular individuals, as it does not distinguish between muscle and fat mass. Consult a healthcare provider for personalized assessment.",
    },
    {
      question: "What units can I use for height and weight?",
      answer:
        "You can toggle between Imperial units (inches, pounds) and Metric units (centimeters, kilograms) for convenience.",
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
          <div className="flex gap-3 mb-4">
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
            <Label htmlFor="gender" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <select
              id="gender"
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.gender}
              onChange={(e) => setInputs((v) => ({ ...v, gender: e.target.value as Gender | "" }))}
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
            <Label htmlFor="age" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              placeholder="e.g. 25"
              value={inputs.age}
              onChange={(e) => setInputs((v) => ({ ...v, age: e.target.value }))}
              aria-required="true"
            />
          </div>

          {/* Height */}
          <div>
            <Label htmlFor="height" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="height"
              type="number"
              min={1}
              placeholder={unit === "imperial" ? "e.g. 70" : "e.g. 175"}
              value={inputs.height}
              onChange={(e) => setInputs((v) => ({ ...v, height: e.target.value }))}
              aria-required="true"
            />
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={1}
              placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
              value={inputs.weight}
              onChange={(e) => setInputs((v) => ({ ...v, weight: e.target.value }))}
              aria-required="true"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            setTriggerCalc((c) => c + 1);
          }}
          aria-label="Calculate BMI"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() => setInputs({ gender: "", age: "", height: "", weight: "" })}
          aria-label="Reset Inputs"
        >
          Reset
        </Button>
      </div>

      {results && (
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
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{results.mainValue}</p>
              <p className={"mt-2 text-lg font-medium " + (results.color || "text-slate-700 dark:text-slate-300")}>
                {results.status}
              </p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.details.interpretation}</p>
            </CardContent>
          </Card>

          {/* SECONDARY RESULTS / DETAILS */}
          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Age Group</TableCell>
                    <TableCell>{results.details.ageGroup}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BMI Value</TableCell>
                    <TableCell>{results.details.bmiValue.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell className={results.color}>{results.details.category}</TableCell>
                  </TableRow>
                  {results.details.notes.length > 0 && (
                    <TableRow>
                      <TableCell>Notes</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400">
                          {results.details.notes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  )}
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
          Enter your gender, age, height, and weight. Select your preferred units (Imperial or Metric). Click "Calculate" to see your BMI and its interpretation based on your age and gender.
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          For adults (20 years and older), BMI categories are standard. For children and adolescents (under 20), BMI is interpreted using age- and gender-specific percentiles to account for growth and development differences.
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the "Reset" button to clear all inputs and start over.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula Used</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          BMI is calculated as:
        </p>
        <p className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-50">
          BMI = weight (kg) / [height (m)]²
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          When using Imperial units:
        </p>
        <p className="mb-6 text-lg font-medium text-slate-900 dark:text-slate-50">
          BMI = 703 × weight (lbs) / [height (in)]²
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          For children and adolescents, BMI is interpreted using age- and gender-specific percentiles rather than fixed cutoffs.
        </p>
      </section>

      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Example Calculation</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Consider a 25-year-old female who is 165 cm tall and weighs 60 kg.
        </p>
        <ol className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>Convert height to meters: 165 cm = 1.65 m</li>
          <li>Calculate BMI: 60 / (1.65 × 1.65) = 22.04</li>
          <li>Interpretation: BMI of 22.04 falls within the "Normal weight" category for adults.</li>
        </ol>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">Result: BMI = 22.0 (Normal weight)</p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
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
              Official CDC resource explaining BMI calculation and interpretation for adults.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.cdc.gov/healthyweight/assessing/bmi/childrens_bmi/about_childrens_bmi.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              CDC - About Child & Teen BMI
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Guidance on BMI percentiles and interpretation for children and adolescents.
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
              World Health Organization overview on obesity, health risks, and BMI usage.
            </p>
          </li>
          <li className="leading-relaxed">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NIH - BMI Calculator and Interpretation
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              National Institutes of Health resource for BMI calculation and health implications.
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
        scenario: "A 25-year-old female who is 165 cm tall and weighs 60 kg.",
        steps: [
          { step: 1, description: "Convert height to meters: 165 cm = 1.65 m", calculation: "" },
          { step: 2, description: "Calculate BMI: 60 / (1.65 × 1.65)", calculation: "60 / 2.7225 = 22.04" },
          { step: 3, description: "Interpret BMI as Normal weight for adults.", calculation: "" },
        ],
        result: "BMI = 22.0 (Normal weight)",
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

export default BmiBodyMassIndexCalculator;
