import { useState, useMemo } from "react";
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
import { User, Activity, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise/sports 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
  { label: "Extra active (very hard exercise/sports & physical job or 2x training)", value: 1.9 },
];

export default function TdeeDailyEnergyExpenditureCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); // imperial or metric
  const [inputs, setInputs] = useState({
    gender: "", // "male" or "female"
    age: "",
    weight: "",
    height: "",
    activityLevel: 1.2,
  });

  // Helper: convert imperial to metric for calculation
  // weight: pounds to kg (1 lb = 0.453592 kg)
  // height: inches to cm (1 in = 2.54 cm)
  function toMetric() {
    const weightKg =
      unit === "imperial" && inputs.weight
        ? parseFloat(inputs.weight) * 0.453592
        : parseFloat(inputs.weight);
    const heightCm =
      unit === "imperial" && inputs.height
        ? parseFloat(inputs.height) * 2.54
        : parseFloat(inputs.height);
    return {
      weightKg: isNaN(weightKg) ? 0 : weightKg,
      heightCm: isNaN(heightCm) ? 0 : heightCm,
    };
  }

  // 2. LOGIC
  const results = useMemo(() => {
    const gender = inputs.gender;
    const age = Number(inputs.age);
    const activityFactor = Number(inputs.activityLevel);
    if (
      !gender ||
      !age ||
      age <= 0 ||
      !inputs.weight ||
      !inputs.height ||
      activityFactor <= 0
    )
      return null;

    const { weightKg, heightCm } = toMetric();

    if (weightKg <= 0 || heightCm <= 0) return null;

    // Mifflin-St Jeor Equation:
    // For men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // For women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age -161
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
      return null;
    }

    const tdee = bmr * activityFactor;

    // Determine status text based on activity factor roughly
    let status = "";
    if (activityFactor === 1.2) status = "Sedentary";
    else if (activityFactor === 1.375) status = "Lightly Active";
    else if (activityFactor === 1.55) status = "Moderately Active";
    else if (activityFactor === 1.725) status = "Very Active";
    else if (activityFactor === 1.9) status = "Extra Active";

    return {
      tdee: Math.round(tdee),
      status,
      color: "text-blue-700 dark:text-blue-300",
    };
  }, [inputs, unit]);

  // 3. FAQ
  const faqs = [
    {
      question: "What is TDEE and why is it important?",
      answer:
        "TDEE stands for Total Daily Energy Expenditure and represents the total number of calories you burn each day. It helps you understand how many calories you need to maintain your weight based on your activity level.",
    },
    {
      question: "How does the activity level affect TDEE?",
      answer:
        "Your activity level adjusts your basal metabolic rate (BMR) to account for calories burned through physical activity, ranging from sedentary to extra active lifestyles.",
    },
    {
      question: "Why do I need to select my gender?",
      answer:
        "Gender affects the calculation because males and females have different metabolic rates due to variations in body composition.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET
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
          {/* UNIT TOGGLE */}
          <div className="flex items-center gap-4">
            <Label htmlFor="unit-toggle" className="font-medium">
              Units:
            </Label>
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
            >
              Imperial (lbs, in)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
            >
              Metric (kg, cm)
            </Button>
          </div>

          {/* Gender */}
          <fieldset className="flex items-center gap-6">
            <Label className="font-medium">Gender:</Label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="gender-male"
                name="gender"
                value="male"
                checked={inputs.gender === "male"}
                onChange={(e) =>
                  setInputs((i) => ({ ...i, gender: e.target.value }))
                }
              />
              <Label htmlFor="gender-male">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="gender-female"
                name="gender"
                value="female"
                checked={inputs.gender === "female"}
                onChange={(e) =>
                  setInputs((i) => ({ ...i, gender: e.target.value }))
                }
              />
              <Label htmlFor="gender-female">Female</Label>
            </div>
          </fieldset>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="font-medium">
              Age (years):
            </Label>
            <Input
              id="age"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={inputs.age}
              onChange={(e) =>
                setInputs((i) => ({ ...i, age: e.target.value }))
              }
              placeholder="e.g. 30"
            />
          </div>

          {/* Weight */}
          <div>
            <Label htmlFor="weight" className="font-medium">
              Weight ({unit === "imperial" ? "lbs" : "kg"}):
            </Label>
            <Input
              id="weight"
              type="number"
              min={0.1}
              step={0.1}
              inputMode="decimal"
              value={inputs.weight}
              onChange={(e) =>
                setInputs((i) => ({ ...i, weight: e.target.value }))
              }
              placeholder={
                unit === "imperial" ? "e.g. 150" : "e.g. 68"
              }
            />
          </div>

          {/* Height */}
          <div>
            <Label htmlFor="height" className="font-medium">
              Height ({unit === "imperial" ? "inches" : "cm"}):
            </Label>
            <Input
              id="height"
              type="number"
              min={0.1}
              step={0.1}
              inputMode="decimal"
              value={inputs.height}
              onChange={(e) =>
                setInputs((i) => ({ ...i, height: e.target.value }))
              }
              placeholder={
                unit === "imperial" ? "e.g. 70" : "e.g. 175"
              }
            />
          </div>

          {/* Activity Level */}
          <div>
            <Label htmlFor="activityLevel" className="font-medium">
              Activity Level:
            </Label>
            <Select
              value={String(inputs.activityLevel)}
              onValueChange={(value) =>
                setInputs((i) => ({ ...i, activityLevel: Number(value) }))
              }
            >
              <SelectTrigger id="activityLevel">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map(({ label, value }) => (
                  <SelectItem key={value} value={String(value)}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 h-11 text-base font-semibold"
          onClick={() => {
            // Calculate is handled by useMemo so no action needed
            // But to trigger re-render, we can setInputs to current inputs (no-op)
            setInputs((i) => ({ ...i }));
          }}
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11 text-base font-medium"
          onClick={() =>
            setInputs({
              gender: "",
              age: "",
              weight: "",
              height: "",
              activityLevel: 1.2,
            })
          }
        >
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {results.tdee.toLocaleString()} kcal/day
              </p>
              <p className={"mt-2 text-lg font-medium " + results.color}>
                {results.status}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your gender, age, weight, and height. Select your daily activity
          level to estimate your Total Daily Energy Expenditure (TDEE). This
          number represents the calories you burn in a day, helping you manage
          your weight goals.
        </p>
      </section>
      <section id="formula" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses the Mifflin-St Jeor Equation to estimate your
          Basal Metabolic Rate (BMR):
        </p>
        <ul className="list-disc list-inside mb-4 text-slate-700 dark:text-slate-300">
          <li>
            For men: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age + 5
          </li>
          <li>
            For women: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age –
            161
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Then, multiply BMR by your activity factor to get TDEE.
        </p>
      </section>
      <section id="example" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Example
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          A 30-year-old male weighing 180 lbs (81.65 kg) and 70 inches (177.8 cm) tall,
          who is moderately active (activity factor 1.55):
        </p>
        <ol className="list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300">
          <li>
            Calculate BMR: 10 × 81.65 + 6.25 × 177.8 – 5 × 30 + 5 = 1816 kcal/day
          </li>
          <li>
            Calculate TDEE: 1816 × 1.55 = 2815 kcal/day
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This means he needs approximately 2815 calories/day to maintain his weight.
        </p>
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
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {f.answer}
            </p>
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
              href="https://www.ncbi.nlm.nih.gov/books/NBK279396/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Mifflin-St Jeor Equation - National Center for Biotechnology Information
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Original research on the Mifflin-St Jeor formula used for BMR
              estimation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Estimate your Total Daily Energy Expenditure (TDEE). Learn how many calories you need daily to maintain, lose, or gain weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Formula",
        formula:
          "BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age + 5 (men) / -161 (women); TDEE = BMR × activity factor",
        variables: [
          { symbol: "weight(kg)", description: "Weight in kilograms" },
          { symbol: "height(cm)", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "activity factor", description: "Level of physical activity" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A 30-year-old male, 180 lbs (81.65 kg), 70 in (177.8 cm), moderately active (1.55)",
        steps: [
          "Calculate BMR: 10 × 81.65 + 6.25 × 177.8 – 5 × 30 + 5 = 1816",
          "Calculate TDEE: 1816 × 1.55 = 2815 kcal/day",
        ],
        result: "TDEE = 2815 kcal/day",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
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