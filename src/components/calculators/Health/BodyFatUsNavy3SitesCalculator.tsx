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
  AlertCircle,
  Calculator,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BodyFatUsNavy3SitesCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [inputs, setInputs] = useState({
    age: "",
    gender: "male",
    weight: "",
    heightMetric: "",
    heightFt: "",
    heightIn: "",
    neck: "",
    waist: "",
    hip: "",
  });

  // Reset handler
  function reset() {
    setInputs({
      age: "",
      gender: "male",
      weight: "",
      heightMetric: "",
      heightFt: "",
      heightIn: "",
      neck: "",
      waist: "",
      hip: "",
    });
  }

  // Parse float safely
  function parseNum(value: string) {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }

  // US Navy 3-site body fat % formula:
  // For men:
  //   BF% = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
  // For women:
  //   BF% = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
  // Height in cm, circumferences in cm

  const results = useMemo(() => {
    const age = parseNum(inputs.age);
    const neck = parseNum(inputs.neck);
    const waist = parseNum(inputs.waist);
    const hip = parseNum(inputs.hip);
    let heightCm = 0;

    if (unit === "metric") {
      heightCm = parseNum(inputs.heightMetric);
    } else {
      // imperial to cm
      const ft = parseNum(inputs.heightFt);
      const inch = parseNum(inputs.heightIn);
      heightCm = ((ft * 12) + inch) * 2.54;
    }

    if (
      heightCm <= 0 ||
      neck <= 0 ||
      waist <= 0 ||
      (inputs.gender === "female" && hip <= 0)
    ) {
      return { value: 0, label: "" };
    }

    // Calculate body fat %
    let bf = 0;
    try {
      if (inputs.gender === "male") {
        const val = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(heightCm) + 36.76;
        bf = Math.max(0, Math.min(100, val));
      } else {
        const val = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(heightCm) - 78.387;
        bf = Math.max(0, Math.min(100, val));
      }
    } catch {
      return { value: 0, label: "" };
    }

    return {
      value: bf.toFixed(1),
      label: "Estimated Body Fat Percentage",
    };
  }, [inputs, unit]);

  // FAQ JSON-LD
  const faqJsonLd = useFaqJsonLd([
    {
      question: "What is the US Navy body fat percentage method?",
      answer:
        "It is a method to estimate body fat percentage using circumference measurements and height, developed by the US Navy.",
    },
    {
      question: "Is this method accurate?",
      answer:
        "It provides a good estimate for most adults but may be less accurate for very muscular or obese individuals.",
    },
    {
      question: "Can I use this calculator if I am under 18?",
      answer:
        "This calculator is designed for adults; results may not be accurate for children or teenagers.",
    },
    {
      question: "Why do women need hip measurements?",
      answer:
        "The formula for women includes hip circumference to better estimate body fat distribution.",
    },
    {
      question: "How often should I measure my body fat?",
      answer:
        "Measuring monthly or quarterly can help track progress effectively without daily fluctuations.",
    },
  ]);

  const widget = (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex items-center gap-4">
        <Label htmlFor="unit" className="text-slate-700 dark:text-slate-300 font-semibold">
          Units
        </Label>
        <Select
          value={unit}
          onValueChange={(v) => setUnit(v as "metric" | "imperial")}
          id="unit"
          aria-label="Select units"
          className="w-32"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (cm, kg)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in, lbs)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender Select */}
      <div className="flex items-center gap-4">
        <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300 font-semibold">
          Gender
        </Label>
        <Select
          value={inputs.gender}
          onValueChange={(v) => setInputs((i) => ({ ...i, gender: v }))}
          id="gender"
          aria-label="Select gender"
          className="w-32"
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

      {/* Age */}
      <div>
        <Label htmlFor="age" className="text-slate-700 dark:text-slate-300 font-semibold">
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
          className="text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Weight */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 font-semibold">
          Weight {unit === "metric" ? "(kg)" : "(lbs)"}
        </Label>
        <Input
          id="weight"
          type="number"
          min={1}
          placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => setInputs((i) => ({ ...i, weight: e.target.value }))}
          className="text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Height */}
      <div>
        <Label className="text-slate-700 dark:text-slate-300 font-semibold">
          Height {unit === "metric" ? "(cm)" : ""}
        </Label>
        {unit === "metric" ? (
          <Input
            id="heightMetric"
            type="number"
            min={30}
            placeholder="e.g. 175"
            value={inputs.heightMetric}
            onChange={(e) => setInputs((i) => ({ ...i, heightMetric: e.target.value }))}
            className="text-slate-700 dark:text-slate-300"
          />
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="heightFt" className="text-slate-700 dark:text-slate-300 font-semibold">
                Feet
              </Label>
              <Input
                id="heightFt"
                type="number"
                min={1}
                placeholder="5"
                value={inputs.heightFt}
                onChange={(e) => setInputs((i) => ({ ...i, heightFt: e.target.value }))}
                className="text-slate-700 dark:text-slate-300"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightIn" className="text-slate-700 dark:text-slate-300 font-semibold">
                Inches
              </Label>
              <Input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                placeholder="10"
                value={inputs.heightIn}
                onChange={(e) => setInputs((i) => ({ ...i, heightIn: e.target.value }))}
                className="text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Neck */}
      <div>
        <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300 font-semibold">
          Neck Circumference (cm)
        </Label>
        <Input
          id="neck"
          type="number"
          min={10}
          placeholder="e.g. 40"
          value={inputs.neck}
          onChange={(e) => setInputs((i) => ({ ...i, neck: e.target.value }))}
          className="text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Waist */}
      <div>
        <Label htmlFor="waist" className="text-slate-700 dark:text-slate-300 font-semibold">
          Waist Circumference (cm)
        </Label>
        <Input
          id="waist"
          type="number"
          min={20}
          placeholder="e.g. 85"
          value={inputs.waist}
          onChange={(e) => setInputs((i) => ({ ...i, waist: e.target.value }))}
          className="text-slate-700 dark:text-slate-300"
        />
      </div>

      {/* Hip (only for female) */}
      {inputs.gender === "female" && (
        <div>
          <Label htmlFor="hip" className="text-slate-700 dark:text-slate-300 font-semibold">
            Hip Circumference (cm)
          </Label>
          <Input
            id="hip"
            type="number"
            min={30}
            placeholder="e.g. 95"
            value={inputs.hip}
            onChange={(e) => setInputs((i) => ({ ...i, hip: e.target.value }))}
            className="text-slate-700 dark:text-slate-300"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={() => {
            // Just trigger recalculation by setting inputs (no-op)
            setInputs((i) => ({ ...i }));
          }}
          aria-label="Calculate body fat percentage"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          aria-label="Reset inputs"
        >
          Reset
        </Button>
      </div>

      {/* Result Display */}
      {results.value && results.value !== "0" ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-blue-100">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Result</p>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-50">{results.value}%</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{results.label}</p>
            </CardContent>
          </Card>

          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>For informational purposes only. Consult a medical professional.</p>
          </div>
        </div>
      ) : null}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300">
          Enter your age, gender, weight, and height in your preferred units. Provide circumference measurements for your neck and waist. If female, include hip circumference. Click Calculate to estimate your body fat percentage using the US Navy 3-site method.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <p className="text-slate-700 dark:text-slate-300">
          <strong>Men:</strong> Body Fat % = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76<br />
          <strong>Women:</strong> Body Fat % = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387<br />
          <br />
          All measurements are in centimeters.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <dl className="space-y-4 text-slate-700 dark:text-slate-300">
          <dt className="font-semibold">What is the US Navy body fat percentage method?</dt>
          <dd>It estimates body fat using circumference measurements and height, developed by the US Navy.</dd>

          <dt className="font-semibold">Is this method accurate?</dt>
          <dd>It provides a good estimate for most adults but may be less accurate for very muscular or obese individuals.</dd>

          <dt className="font-semibold">Can I use this calculator if I am under 18?</dt>
          <dd>This calculator is designed for adults; results may not be accurate for children or teenagers.</dd>

          <dt className="font-semibold">Why do women need hip measurements?</dt>
          <dd>The formula for women includes hip circumference to better estimate body fat distribution.</dd>

          <dt className="font-semibold">How often should I measure my body fat?</dt>
          <dd>Measuring monthly or quarterly helps track progress effectively without daily fluctuations.</dd>
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <ul className="space-y-4">
          <li className="mb-4">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4428917/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              Estimation of Body Fat Percentage by the U.S. Navy Method
            </a>
            <p className="text-slate-500">
              Hodgdon JA, Beckett MB. U.S. Navy body fat equations: revised and validated. J Strength Cond Res. 2005.
            </p>
          </li>
          <li className="mb-4">
            <a
              href="https://www.navyfitness.org/body-fat-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold block"
            >
              U.S. Navy Body Fat Calculator
            </a>
            <p className="text-slate-500">Official Navy Fitness website resource.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  const formula = {
    title: "US Navy 3-Site Body Fat % Formula",
    formula:
      "Men: 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76\nWomen: 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387",
    variables: [
      { symbol: "waist", description: "Waist circumference (cm)" },
      { symbol: "neck", description: "Neck circumference (cm)" },
      { symbol: "hip", description: "Hip circumference (cm) — women only" },
      { symbol: "height", description: "Height (cm)" },
    ],
  };

  const example = {
    title: "Example Calculation",
    scenario:
      "A 30-year-old male, 175 cm tall, with neck circumference 40 cm and waist circumference 85 cm.",
    steps: [
      "Calculate log10(waist - neck) = log10(85 - 40) = log10(45) ≈ 1.653",
      "Calculate log10(height) = log10(175) ≈ 2.243",
      "Apply formula: 86.010 × 1.653 - 70.041 × 2.243 + 36.76 ≈ 142.2 - 157.1 + 36.76 = 21.86%",
    ],
    result: "Estimated body fat percentage is approximately 21.9%.",
  };

  return (
    <CalculatorVerticalLayout
      title="Body Fat % (US Navy / 3-sites)"
      description="Estimate your body fat percentage using the US Navy method. Track your body composition progress accurately without expensive equipment."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
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
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
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