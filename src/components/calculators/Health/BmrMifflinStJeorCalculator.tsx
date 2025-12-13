import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
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
  AlertCircle,
  Calculator,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmrMifflinStJeorCalculator() {
  // 1. SETUP STATE (Imperial Default)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    weight?: number; // lbs or kg
    heightFt?: number; // feet (imperial only)
    heightIn?: number; // inches (imperial only)
    heightCm?: number; // cm (metric only)
    age?: number; // years
    gender?: "male" | "female";
  }>({
    weight: undefined,
    heightFt: undefined,
    heightIn: undefined,
    heightCm: undefined,
    age: undefined,
    gender: "male",
  });

  // Helper: convert height ft/in to cm
  function heightImperialToCm(ft?: number, inch?: number) {
    if (ft == null || inch == null) return undefined;
    return ft * 30.48 + inch * 2.54;
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { weight, heightFt, heightIn, heightCm, age, gender } = inputs;

    if (
      weight == null ||
      age == null ||
      gender == null ||
      (unit === "imperial" && (heightFt == null || heightIn == null)) ||
      (unit === "metric" && heightCm == null)
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Convert inputs to metric for formula
    let weightKg: number;
    let heightCmVal: number;

    if (unit === "imperial") {
      weightKg = weight * 0.45359237;
      heightCmVal = heightImperialToCm(heightFt, heightIn)!;
    } else {
      weightKg = weight;
      heightCmVal = heightCm;
    }

    // Mifflin-St Jeor Equation:
    // For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
    // For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCmVal - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCmVal - 5 * age - 161;
    }

    const roundedBmr = Math.round(bmr);

    return {
      value: roundedBmr,
      label: "Calories/day",
      category: "",
    };
  }, [inputs, unit]);

  // 3. CONTENT DATA
  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR)?",
      answer:
        "BMR is the number of calories your body needs to maintain basic physiological functions at rest, such as breathing, circulation, and cell production.",
    },
    {
      question: "Why use the Mifflin-St Jeor equation?",
      answer:
        "The Mifflin-St Jeor equation is considered one of the most accurate formulas for estimating BMR for adults, validated across diverse populations including Canadians and Americans.",
    },
    {
      question: "Can I use this calculator if I use metric units?",
      answer:
        "Yes, you can switch between imperial (lbs, ft/in) and metric (kg, cm) units using the unit selector at the top of the calculator.",
    },
    {
      question: "How does gender affect BMR calculation?",
      answer:
        "Men and women have different BMR formulas because of physiological differences in body composition, which affect calorie needs at rest.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(
    field:
      | "weight"
      | "heightFt"
      | "heightIn"
      | "heightCm"
      | "age"
      | "gender",
    value: string
  ) {
    if (field === "gender") {
      setInputs((prev) => ({ ...prev, gender: value as "male" | "female" }));
      return;
    }
    // For numeric inputs, parse float or int
    const num = value === "" ? undefined : Number(value);
    if (isNaN(num)) return;
    setInputs((prev) => ({ ...prev, [field]: num }));
  }

  // Reset inputs to default (imperial with gender male)
  function resetInputs() {
    setInputs({
      weight: undefined,
      heightFt: undefined,
      heightIn: undefined,
      heightCm: undefined,
      age: undefined,
      gender: "male",
    });
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as "imperial" | "metric")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Gender
          </Label>
          <Select
            value={inputs.gender ?? "male"}
            onValueChange={(v) => onInputChange("gender", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="weight" className="mb-2 block text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight ?? ""}
            onChange={(e) => onInputChange("weight", e.target.value)}
          />
        </div>

        {unit === "imperial" ? (
          <>
            <div>
              <Label htmlFor="heightFt" className="mb-2 block text-slate-700 dark:text-slate-300">
                Height (ft)
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 5"
                value={inputs.heightFt ?? ""}
                onChange={(e) => onInputChange("heightFt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="heightIn" className="mb-2 block text-slate-700 dark:text-slate-300">
                Height (in)
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step={1}
                placeholder="e.g. 10"
                value={inputs.heightIn ?? ""}
                onChange={(e) => onInputChange("heightIn", e.target.value)}
              />
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="mb-2 block text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 178"
              value={inputs.heightCm ?? ""}
              onChange={(e) => onInputChange("heightCm", e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="age" className="mb-2 block text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 30"
            value={inputs.age ?? ""}
            onChange={(e) => onInputChange("age", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation (already reactive)
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results Display (Blue Gradient) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50">
                {results.value}
              </p>
              <p className="text-slate-600 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/60 text-blue-800 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates your Basal Metabolic Rate (BMR) using the
          Mifflin-St Jeor equation, which is widely recognized for its accuracy
          in adults. To use it, select your preferred unit system (Imperial or
          Metric), then enter your weight, height, age, and gender. The
          calculator will convert units as needed and compute the number of
          calories your body burns at rest each day. This value is essential for
          understanding your daily energy needs and can help guide nutrition and
          fitness planning.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/8423390/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
              A new predictive equation for resting energy expenditure in healthy
              individuals. Am J Clin Nutr. 1990;51(2):241-7.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Original study introducing the Mifflin-St Jeor equation for BMR
              estimation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Frankenfield D, Roth-Yousey L, Compher C. Comparison of predictive
              equations for resting metabolic rate in healthy nonobese and obese
              adults: a systematic review. J Am Diet Assoc. 2005 May;105(5):775-89.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Systematic review comparing BMR predictive equations including
              Mifflin-St Jeor.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthlinkbc.ca/healthy-eating/energy-needs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. HealthLink BC - Energy Needs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Canadian health resource explaining energy needs and BMR.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.csep.ca/CMFiles/Guidelines/CSEP_PAH_2011_guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Canadian Society for Exercise Physiology - Physical Activity
              Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Guidelines including energy expenditure considerations for Canadians.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMR — Basal Metabolic Rate (Mifflin-St Jeor)"
      description="Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation. Find out exactly how many calories your body burns at rest.. This tool helps you estimate your results accurately using standard formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Formula",
        formula:
          "BMR (men) = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5\nBMR (women) = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms (kg)" },
          { symbol: "height", description: "Height in centimeters (cm)" },
          { symbol: "age", description: "Age in years" },
          {
            symbol: "BMR",
            description:
              "Basal Metabolic Rate in calories/day, the energy your body needs at rest",
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Calculate BMR for a 35-year-old male who weighs 180 lbs and is 5 ft 10 in tall (imperial units).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight from pounds to kilograms: 180 lbs × 0.45359237 = 81.65 kg",
          },
          {
            label: "Step 2",
            explanation:
              "Convert height from feet and inches to centimeters: (5 × 30.48) + (10 × 2.54) = 152.4 + 25.4 = 177.8 cm",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the Mifflin-St Jeor formula for men: (10 × 81.65) + (6.25 × 177.8) − (5 × 35) + 5",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate each term: 816.5 + 1111.25 − 175 + 5 = 1757.75 calories/day",
          },
        ],
        result:
          "The estimated BMR is approximately 1758 calories/day, meaning this is the number of calories the body burns at rest daily.",
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
        { id: "how-to-use", label: "How to use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}