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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Scale,
  User,
  Heart,
  Flame,
  Info,
  HelpCircle,
  BookOpen,
  AlertCircle,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Unit = "metric" | "imperial";

interface Inputs {
  age?: number;
  sex?: "male" | "female";
  height?: number; // cm or inches depending on unit
  weight?: number; // kg or lbs depending on unit
}

export default function BmrMifflinStJeorCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<Unit>("metric");
  const [inputs, setInputs] = useState<Inputs>({
    age: undefined,
    sex: undefined,
    height: undefined,
    weight: undefined,
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 2. LOGIC (useMemo)
  const results = useMemo(() => {
    const { age, sex, height, weight } = inputs;

    // Validate inputs: all must be positive numbers, sex must be selected
    if (
      age === undefined ||
      sex === undefined ||
      height === undefined ||
      weight === undefined
    ) {
      return { resultValue: null, interpretation: "" };
    }
    if (
      age <= 0 ||
      height <= 0 ||
      weight <= 0 ||
      age > 120 ||
      height > 300 ||
      weight > 1000
    ) {
      return {
        resultValue: null,
        interpretation:
          "Please enter realistic positive values for all fields.",
      };
    }

    // Convert imperial to metric if needed
    // height in cm, weight in kg
    let heightCm = height;
    let weightKg = weight;
    if (unit === "imperial") {
      heightCm = height * 2.54;
      weightKg = weight * 0.45359237;
    }

    // Mifflin-St Jeor Equation:
    // For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
    // For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161
    let bmr = 0;
    if (sex === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Round to nearest integer
    const roundedBmr = Math.round(bmr);

    // Interpretation: general guidance
    const interpretation =
      "This is your estimated Basal Metabolic Rate (BMR), the number of calories your body burns at rest daily.";

    return { resultValue: roundedBmr, interpretation };
  }, [inputs, unit]);

  // 3. HANDLERS
  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      age: undefined,
      sex: undefined,
      height: undefined,
      weight: undefined,
    });
  };

  // Controlled input change handler
  const onInputChange = (field: keyof Inputs, value: string) => {
    // Parse number for numeric fields
    if (field === "age" || field === "height" || field === "weight") {
      const num = Number(value);
      if (value === "") {
        setInputs((prev) => ({ ...prev, [field]: undefined }));
      } else if (!isNaN(num)) {
        setInputs((prev) => ({ ...prev, [field]: num }));
      }
    } else if (field === "sex") {
      if (value === "male" || value === "female") {
        setInputs((prev) => ({ ...prev, sex: value }));
      }
    }
  };

  // 4. FAQ (Medical Context)
  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "BMR is the number of calories your body needs to maintain basic physiological functions at rest, such as breathing, circulation, and cell production.",
    },
    {
      question: "Why use the Mifflin-St Jeor equation?",
      answer:
        "The Mifflin-St Jeor equation is considered one of the most accurate formulas for estimating BMR in healthy adults.",
    },
    {
      question: "Can BMR change over time?",
      answer:
        "Yes, BMR can change with age, body composition, hormonal changes, and health status.",
    },
    {
      question: "How does sex affect BMR?",
      answer:
        "Men typically have a higher BMR than women due to greater muscle mass and differences in body composition.",
    },
    {
      question: "Why do I need to select units?",
      answer:
        "Units ensure that height and weight inputs are correctly interpreted for accurate BMR calculation.",
    },
    {
      question: "Is BMR the same as total daily calorie needs?",
      answer:
        "No, BMR represents calories burned at rest. Total daily energy expenditure (TDEE) includes activity and digestion.",
    },
    {
      question: "Can I use this calculator if I am pregnant or have medical conditions?",
      answer:
        "This calculator is for general use only. Consult a healthcare professional for personalized advice.",
    },
    {
      question: "What should I do if my inputs seem off?",
      answer:
        "Ensure all inputs are positive, realistic values. If unsure, consult a medical professional.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. WIDGET JSX (Follow LoanPaymentCalculator Style EXACTLY)
  const widget = (
    <div className="space-y-6">
      {/* INPUTS SECTION - Clean Style */}
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Your Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {/* Unit Select */}
          <div>
            <Label htmlFor="unit" className="mb-1 text-slate-700 dark:text-slate-300">
              Units
            </Label>
            <Select
              value={unit}
              onValueChange={(value) => setUnit(value as Unit)}
              id="unit"
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sex Select */}
          <div>
            <Label htmlFor="sex" className="mb-1 text-slate-700 dark:text-slate-300">
              Sex
            </Label>
            <Select
              value={inputs.sex ?? ""}
              onValueChange={(value) => onInputChange("sex", value)}
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

          {/* Age Input */}
          <div>
            <Label htmlFor="age" className="mb-1 text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              type="number"
              id="age"
              min={1}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age ?? ""}
              onChange={(e) => onInputChange("age", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-describedby="age-desc"
            />
            <p
              id="age-desc"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Enter your age in years.
            </p>
          </div>

          {/* Height Input */}
          <div>
            <Label htmlFor="height" className="mb-1 text-slate-700 dark:text-slate-300">
              Height ({unit === "metric" ? "cm" : "inches"})
            </Label>
            <Input
              type="number"
              id="height"
              min={1}
              max={unit === "metric" ? 300 : 120}
              placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
              value={inputs.height ?? ""}
              onChange={(e) => onInputChange("height", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-describedby="height-desc"
            />
            <p
              id="height-desc"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Enter your height in {unit === "metric" ? "centimeters" : "inches"}.
            </p>
          </div>

          {/* Weight Input */}
          <div>
            <Label htmlFor="weight" className="mb-1 text-slate-700 dark:text-slate-300">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              type="number"
              id="weight"
              min={1}
              max={unit === "metric" ? 500 : 1100}
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              value={inputs.weight ?? ""}
              onChange={(e) => onInputChange("weight", e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-describedby="weight-desc"
            />
            <p
              id="weight-desc"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Enter your weight in {unit === "metric" ? "kilograms" : "pounds"}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 h-11 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white"
          disabled={
            !inputs.age ||
            !inputs.sex ||
            !inputs.height ||
            !inputs.weight ||
            inputs.age <= 0 ||
            inputs.height <= 0 ||
            inputs.weight <= 0
          }
          aria-disabled={
            !inputs.age ||
            !inputs.sex ||
            !inputs.height ||
            !inputs.weight ||
            inputs.age <= 0 ||
            inputs.height <= 0 ||
            inputs.weight <= 0
          }
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 text-base font-medium"
        >
          Reset
        </Button>
      </div>

      {/* RESULTS SECTION */}
      {results.resultValue !== null && (
        <div ref={resultsRef} className="space-y-6">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 border border-teal-200 dark:border-teal-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-teal-900 dark:text-teal-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Primary Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {results.resultValue} kcal/day
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {results.interpretation}
              </p>
            </CardContent>
          </Card>

          {/* DISCLAIMER (Mandatory for Health) */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Results are for informational purposes only. Consult a medical professional.</p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL JSX (Standard Typography)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates your Basal Metabolic Rate (BMR) using the
          Mifflin-St Jeor equation, which is widely regarded as one of the most
          accurate methods for determining the calories your body burns at rest.
          To use it effectively, follow these steps:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            <strong>Select your preferred unit system:</strong> Choose between
            Metric (centimeters and kilograms) or Imperial (inches and pounds).
          </li>
          <li>
            <strong>Enter your biological sex:</strong> Select "Male" or
            "Female" as the equation differs slightly based on sex.
          </li>
          <li>
            <strong>Input your age:</strong> Provide your age in years. The
            calculator assumes adult users; values below 1 or above 120 are
            invalid.
          </li>
          <li>
            <strong>Enter your height:</strong> Input your height in the units
            selected. Ensure the value is realistic.
          </li>
          <li>
            <strong>Enter your weight:</strong> Input your weight in the units
            selected. Again, ensure the value is realistic.
          </li>
          <li>
            <strong>Click "Calculate":</strong> The calculator will display
            your estimated BMR in kilocalories per day.
          </li>
          <li>
            <strong>Review the result:</strong> Use this information to better
            understand your body's energy requirements at rest.
          </li>
          <li>
            <strong>Reset if needed:</strong> Use the "Reset" button to clear
            all inputs and start over.
          </li>
        </ul>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          The Science Behind It
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Basal Metabolic Rate (BMR) represents the minimum number of calories
          your body requires to maintain vital physiological functions while at
          complete rest. These functions include breathing, blood circulation,
          cellular repair, and maintaining body temperature.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Mifflin-St Jeor equation was developed in 1990 and has since been
          validated as one of the most accurate BMR estimation formulas for
          healthy adults. It accounts for weight, height, age, and sex, which
          are the primary factors influencing metabolic rate.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sex</TableHead>
              <TableHead>Equation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Male</TableCell>
              <TableCell>
                BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Female</TableCell>
              <TableCell>
                BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) −
                161
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The constants +5 for males and −161 for females adjust for differences
          in body composition and hormonal influences between sexes.
        </p>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Clinical Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consider a 35-year-old female who is 165 cm tall and weighs 68 kg.
          Using the Mifflin-St Jeor equation, her BMR is calculated as follows:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            Multiply weight by 10: 10 × 68 = 680
          </li>
          <li>
            Multiply height by 6.25: 6.25 × 165 = 1031.25
          </li>
          <li>
            Multiply age by 5: 5 × 35 = 175
          </li>
          <li>
            Sum the first two results and subtract the third, then subtract 161 (female constant):
            680 + 1031.25 − 175 − 161 = 1375.25 kcal/day
          </li>
        </ol>
        <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          This means her body requires approximately 1375 kilocalories daily to
          maintain basic physiological functions at rest.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {faq.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          References
        </h2>
        <ul className="space-y-4 list-disc pl-5 text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
            "A new predictive equation for resting energy expenditure in healthy
            individuals." Am J Clin Nutr. 1990 Feb;51(2):241-7.
          </li>
          <li>
            Frankenfield D, Roth-Yousey L, Compher C. "Comparison of predictive
            equations for resting metabolic rate in healthy nonobese and obese
            adults: a systematic review." J Am Diet Assoc. 2005 May;105(5):775-89.
          </li>
          <li>
            Harris JA, Benedict FG. "A biometric study of human basal metabolism."
            Proc Natl Acad Sci U S A. 1918;4(12):370-3.
          </li>
          <li>
            National Institutes of Health (NIH). "Body Weight Planner." Accessed
            2024. <a href="https://www.niddk.nih.gov/bwp" className="text-teal-600 hover:underline">https://www.niddk.nih.gov/bwp</a>
          </li>
          <li>
            Heymsfield SB, et al. "Human energy expenditure: advances in
            measurement and applications." Annu Rev Nutr. 2014;34:1-30.
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      description="Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "Science & Formula" },
        { id: "example", label: "Clinical Example" },
        { id: "faq", label: "Medical FAQ" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Medical Equation",
        formula:
          "For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5; For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "sex", description: "Biological sex (male or female)" },
        ],
      }}
      example={{
        title: "Patient Scenario",
        scenario:
          "A 35-year-old female, 165 cm tall, weighing 68 kg wants to know her BMR.",
        steps: [
          {
            label: "Step 1",
            explanation: "Multiply weight by 10: 10 × 68 = 680",
          },
          {
            label: "Step 2",
            explanation: "Multiply height by 6.25: 6.25 × 165 = 1031.25",
          },
          {
            label: "Step 3",
            explanation: "Multiply age by 5: 5 × 35 = 175",
          },
          {
            label: "Step 4",
            explanation:
              "Sum the first two results and subtract the third, then subtract 161 (female constant): 680 + 1031.25 − 175 − 161 = 1375.25 kcal/day",
          },
        ],
        result: "Her estimated BMR is approximately 1375 kcal/day.",
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
          icon: "🧮",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "⚖️",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "🧮",
        },
        {
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "🧮",
        },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}