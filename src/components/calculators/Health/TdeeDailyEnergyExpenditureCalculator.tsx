import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// USE ATOMIC IMPORTS ONLY:
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, HelpCircle, BookOpen, AlertCircle, Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TdeeDailyEnergyExpenditureCalculator() {
  const [unit, setUnit] = useState("metric");
  const [inputs, setInputs] = useState({
    age: "",
    gender: "male",
    weight: "",
    heightMetric: "",
    heightFt: "",
    heightIn: "",
    activity: "1.2",
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // Activity multipliers for TDEE
  const activityLevels = [
    { label: "Sedentary (little or no exercise)", value: "1.2" },
    { label: "Lightly active (light exercise 1-3 days/week)", value: "1.375" },
    { label: "Moderately active (moderate exercise 3-5 days/week)", value: "1.55" },
    { label: "Very active (hard exercise 6-7 days/week)", value: "1.725" },
    { label: "Extra active (very hard exercise & physical job)", value: "1.9" },
  ];

  const results = useMemo(() => {
    const ageNum = Number(inputs.age);
    const weightNum = Number(inputs.weight);
    const activityNum = Number(inputs.activity);

    if (
      !ageNum ||
      ageNum < 10 ||
      ageNum > 120 ||
      !weightNum ||
      weightNum <= 0 ||
      !activityNum ||
      activityNum < 1.2 ||
      activityNum > 2.0
    ) {
      return null;
    }

    let heightCm = 0;
    if (unit === "metric") {
      const heightMetricNum = Number(inputs.heightMetric);
      if (!heightMetricNum || heightMetricNum <= 0) return null;
      heightCm = heightMetricNum;
    } else {
      const ftNum = Number(inputs.heightFt);
      const inNum = Number(inputs.heightIn);
      if (
        !ftNum ||
        ftNum < 0 ||
        !inNum ||
        inNum < 0 ||
        inNum >= 12 ||
        (ftNum === 0 && inNum === 0)
      )
        return null;
      const totalInches = ftNum * 12 + inNum;
      heightCm = totalInches * 2.54;
    }

    // Mifflin-St Jeor BMR formula
    // Male: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
    // Female: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161

    // Convert weight to kg if imperial
    let weightKg = weightNum;
    if (unit === "imperial") {
      weightKg = weightNum * 0.45359237;
    }

    let bmr = 0;
    if (inputs.gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const tdee = bmr * activityNum;
    const roundedTdee = Math.round(tdee);

    return {
      value: roundedTdee.toLocaleString(),
      label: "Calories/day to maintain your weight",
    };
  }, [inputs, unit]);

  const handleReset = () => {
    setUnit("metric");
    setInputs({
      age: "",
      gender: "male",
      weight: "",
      heightMetric: "",
      heightFt: "",
      heightIn: "",
      activity: "1.2",
    });
  };

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // SEO DATA
  const faqs = [
    {
      question: "What is TDEE?",
      answer:
        "TDEE is the total calories you burn daily, including all activities and bodily functions.",
    },
    {
      question: "Why does gender affect TDEE?",
      answer:
        "Men and women have different metabolic rates due to body composition differences, affecting calorie needs.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "It provides an estimate based on standard formulas; individual needs may vary.",
    },
    {
      question: "Can I use imperial units?",
      answer:
        "Yes, select 'Imperial' to enter height in feet and inches and weight in pounds.",
    },
    {
      question: "What does the activity level mean?",
      answer:
        "It adjusts your calorie needs based on how active you are daily, from sedentary to very active.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="unit" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Units
          </Label>
          <Select
            value={unit}
            onValueChange={(v) => setUnit(v)}
            aria-label="Select units"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="gender" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Gender
          </Label>
          <Select
            value={inputs.gender}
            onValueChange={(v) => setInputs((i) => ({ ...i, gender: v }))}
            aria-label="Select gender"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Age */}
      <div>
        <Label htmlFor="age" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Age (years)
        </Label>
        <Input
          id="age"
          type="number"
          min={10}
          max={120}
          placeholder="e.g. 30"
          value={inputs.age}
          onChange={(e) => setInputs((i) => ({ ...i, age: e.target.value }))}
          inputMode="numeric"
        />
      </div>

      {/* Weight */}
      <div>
        <Label htmlFor="weight" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Weight ({unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={1}
          placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => setInputs((i) => ({ ...i, weight: e.target.value }))}
          inputMode="numeric"
        />
      </div>

      {/* Height */}
      <div>
        <Label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Height ({unit === "metric" ? "cm" : "ft / in"})
        </Label>
        {unit === "metric" ? (
          <Input
            id="heightMetric"
            type="number"
            min={30}
            max={300}
            placeholder="e.g. 175"
            value={inputs.heightMetric}
            onChange={(e) => setInputs((i) => ({ ...i, heightMetric: e.target.value }))}
            inputMode="numeric"
          />
        ) : (
          <div className="flex gap-2">
            <Input
              id="heightFt"
              type="number"
              min={0}
              max={10}
              placeholder="ft"
              value={inputs.heightFt}
              onChange={(e) => setInputs((i) => ({ ...i, heightFt: e.target.value }))}
              inputMode="numeric"
            />
            <Input
              id="heightIn"
              type="number"
              min={0}
              max={11}
              placeholder="in"
              value={inputs.heightIn}
              onChange={(e) => setInputs((i) => ({ ...i, heightIn: e.target.value }))}
              inputMode="numeric"
            />
          </div>
        )}
      </div>

      {/* Activity Level */}
      <div>
        <Label htmlFor="activity" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Activity Level
        </Label>
        <Select
          value={inputs.activity}
          onValueChange={(v) => setInputs((i) => ({ ...i, activity: v }))}
          aria-label="Select activity level"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select activity level" />
          </SelectTrigger>
          <SelectContent>
            {activityLevels.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleCalculate}
          className="flex-1 h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex-1 h-11 text-base font-medium">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Result Display */}
      {results?.value ? (
        <div ref={resultsRef} className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Result
              </p>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-2">
                {results.value}
              </p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{results.label}</p>
            </CardContent>
          </Card>

          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Results are estimates. Consult a professional.</p>
          </div>
        </div>
      ) : null}
    </div>
  );

  // EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your age, gender, weight, height, and activity level. Choose your preferred units. Click calculate to estimate your daily calorie needs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The Science</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses the Mifflin-St Jeor equation to estimate Basal Metabolic Rate (BMR), then multiplies by an activity factor to find Total Daily Energy Expenditure (TDEE).
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" /> FAQ
        </h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" /> References
        </h2>
        <ul className="space-y-4">
          <li className="mb-4">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/11883538/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-lg block"
            >
              Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals.
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Am J Clin Nutr. 1990;51(2):241-7.
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
      formula={{
        title: "Formula",
        formula:
          "TDEE = BMR × Activity Level, where BMR (Mifflin-St Jeor) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + s (s = +5 for males, -161 for females)",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "s", description: "Gender constant (+5 male, -161 female)" },
          { symbol: "Activity Level", description: "Multiplier based on daily activity" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "A 30-year-old female, 65 kg, 170 cm tall, lightly active.",
        steps: [
          "Calculate BMR: 10×65 + 6.25×170 - 5×30 - 161 = 1373 kcal",
          "Multiply by activity level 1.375: 1373 × 1.375 = 1887 kcal",
        ],
        result: "Estimated TDEE: 1887 calories/day",
      }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "❤️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "💧" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🥗" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "😴" },
      ]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}