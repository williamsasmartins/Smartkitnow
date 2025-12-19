import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmrCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    unitSystem: "metric",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper: Convert height and weight to metric if needed
  const heightCm = useMemo(() => {
    if (!inputs.height) return null;
    if (inputs.unitSystem === "metric") return parseFloat(inputs.height);
    // imperial inches to cm
    return parseFloat(inputs.height) * 2.54;
  }, [inputs.height, inputs.unitSystem]);

  const weightKg = useMemo(() => {
    if (!inputs.weight) return null;
    if (inputs.unitSystem === "metric") return parseFloat(inputs.weight);
    // imperial pounds to kg
    return parseFloat(inputs.weight) * 0.45359237;
  }, [inputs.weight, inputs.unitSystem]);

  // BMR Calculation using Mifflin-St Jeor Equation
  // Men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // Women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
  const results = useMemo(() => {
    const age = parseInt(inputs.age, 10);
    const gender = inputs.gender;
    if (!age || age <= 0 || !gender || !heightCm || !weightKg) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please fill in all fields with valid values.",
        formulaUsed: "",
      };
    }
    if (age < 10 || age > 120) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Age should be between 10 and 120 years for accurate results.",
        formulaUsed: "",
      };
    }
    if (heightCm < 50 || heightCm > 272) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Height should be between 50 cm and 272 cm for accurate results.",
        formulaUsed: "",
      };
    }
    if (weightKg < 10 || weightKg > 635) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Weight should be between 10 kg and 635 kg for accurate results.",
        formulaUsed: "",
      };
    }

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Invalid gender selected.",
        formulaUsed: "",
      };
    }

    const roundedBmr = Math.round(bmr);

    return {
      value: `${roundedBmr} kcal/day`,
      label: "Your Basal Metabolic Rate (BMR)",
      subtext:
        "This is the estimated number of calories your body needs at rest to maintain vital functions such as breathing, circulation, and cell production.",
      warning: null,
      formulaUsed:
        "Mifflin-St Jeor Equation: For men: 10×weight(kg) + 6.25×height(cm) - 5×age + 5; For women: 10×weight(kg) + 6.25×height(cm) - 5×age - 161",
    };
  }, [inputs.age, inputs.gender, heightCm, weightKg]);

  const faqs = [
    {
      question: "What is Basal Metabolic Rate (BMR) and why is it important?",
      answer:
        "Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic physiological functions while at complete rest. These functions include breathing, blood circulation, cell regeneration, and maintaining body temperature. Understanding your BMR is crucial because it forms the foundation for determining your total daily energy expenditure (TDEE), which helps in managing weight, planning diets, and optimizing fitness goals.",
    },
    {
      question: "How accurate is the Mifflin-St Jeor equation for calculating BMR?",
      answer:
        "The Mifflin-St Jeor equation is widely regarded as one of the most accurate formulas for estimating BMR in healthy adults. It was developed in the 1990s and has been validated across diverse populations. However, individual metabolic rates can vary due to genetics, muscle mass, hormonal status, and health conditions. Therefore, while it provides a reliable estimate, it should be used as a guideline rather than an absolute value.",
    },
    {
      question: "Can I use this calculator if I am under 10 or over 120 years old?",
      answer:
        "This calculator is optimized for individuals aged between 10 and 120 years because the underlying formula was validated primarily within this range. For children under 10 or elderly over 120, metabolic rates can differ significantly due to growth, development, or aging processes. For these groups, specialized assessments or consulting healthcare professionals is recommended for accurate metabolic rate estimation.",
    },
    {
      question: "Why do I need to select a unit system, and how does it affect the calculation?",
      answer:
        "Selecting the correct unit system (metric or imperial) ensures that your height and weight inputs are interpreted correctly by the calculator. The calculator converts imperial units (inches, pounds) to metric units (centimeters, kilograms) internally before performing calculations. Using the wrong unit system or mixing units can lead to inaccurate BMR results, so it’s important to choose the system that matches your input values.",
    },
    {
      question: "How can knowing my BMR help me with weight management?",
      answer:
        "Knowing your BMR helps you understand the minimum calories your body needs to function at rest. To lose weight, you need to consume fewer calories than your total daily energy expenditure (which includes BMR plus calories burned through activity). Conversely, to gain weight, you consume more. By starting with your BMR, you can tailor your calorie intake and activity levels to meet your specific weight management goals effectively.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              aria-describedby="ageHelp"
            />
            <p id="ageHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your age in years.
            </p>
          </div>

          <div>
            <Label htmlFor="gender" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Gender
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(v) => handleInputChange("gender", v)}
              aria-label="Select gender"
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unitSystem" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Unit System
            </Label>
            <Select
              value={inputs.unitSystem}
              onValueChange={(v) => handleInputChange("unitSystem", v)}
              aria-label="Select unit system"
            >
              <SelectTrigger id="unitSystem" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Height ({inputs.unitSystem === "metric" ? "cm" : "inches"})
            </Label>
            <Input
              id="height"
              type="number"
              min={0}
              placeholder={inputs.unitSystem === "metric" ? "e.g. 170" : "e.g. 67"}
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              aria-describedby="heightHelp"
            />
            <p id="heightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your height in {inputs.unitSystem === "metric" ? "centimeters" : "inches"}.
            </p>
          </div>

          <div>
            <Label htmlFor="weight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Weight ({inputs.unitSystem === "metric" ? "kg" : "lbs"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              placeholder={inputs.unitSystem === "metric" ? "e.g. 70" : "e.g. 154"}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weightHelp"
            />
            <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your weight in {inputs.unitSystem === "metric" ? "kilograms" : "pounds"}.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just triggers recalculation, no special action needed since useMemo updates automatically
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate BMR"
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "",
              height: "",
              weight: "",
              unitSystem: "metric",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 shadow-md mt-4">
          <CardContent className="p-4 text-center text-yellow-800 dark:text-yellow-200 font-semibold">
            <AlertTriangle className="inline-block mr-2 h-5 w-5 align-middle" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400 max-w-xl mx-auto">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400 max-w-xl mx-auto">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Basal Metabolic Rate (BMR) represents the minimum number of calories your body requires to sustain its most basic life-sustaining functions while at complete rest. These functions include breathing, blood circulation, cellular repair, and maintaining body temperature. Essentially, BMR is the energy cost of keeping your body alive without any additional physical activity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your BMR is fundamental for managing your health, weight, and nutrition. It forms the baseline for calculating your total daily energy expenditure (TDEE), which accounts for all activities including exercise and digestion. By knowing your BMR, you can tailor your calorie intake to meet your goals, whether it’s weight loss, maintenance, or muscle gain.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the Mifflin-St Jeor equation, one of the most accurate formulas for estimating BMR. To get your personalized BMR estimate, follow these detailed steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system — Metric (centimeters and kilograms) or Imperial (inches and pounds). This ensures your inputs are interpreted correctly.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your age in years. The calculator is optimized for ages between 10 and 120 years for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your gender. The formula differs slightly for males and females to account for physiological differences.
          </li>
          <li>
            <strong>Step 4:</strong> Input your height and weight according to the selected unit system. Make sure to enter realistic values within the suggested ranges.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see your Basal Metabolic Rate displayed in kilocalories per day.
          </li>
          <li>
            <strong>Step 6:</strong> Use the "Reset" button to clear all inputs and start a new calculation if needed.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Remember, this calculator provides an estimate. For precise metabolic assessments, especially if you have health conditions or special needs, consult a healthcare professional or a registered dietitian.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basal Metabolic Rate (BMR) Calculator"
      description="Calculate everyday BMR. Find out the minimum calories your body needs to function before adding any physical activity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "For men: BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age + 5; For women: BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age - 161",
        variables: [
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Consider a 28-year-old female who is 165 cm tall and weighs 60 kg. She wants to know how many calories her body burns at rest daily to maintain vital functions.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input her age as 28 years, select female as gender, choose metric units, enter height as 165 cm, and weight as 60 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Click the Calculate button. The calculator applies the Mifflin-St Jeor formula for females: 10 × 60 + 6.25 × 165 - 5 × 28 - 161.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate the values: 600 + 1031.25 - 140 - 161 = 1330.25 kcal/day. The calculator rounds this to 1330 kcal/day.",
          },
        ],
        result:
          "Her Basal Metabolic Rate is approximately 1330 kcal/day, meaning she needs about 1330 calories daily to maintain basic bodily functions at rest.",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday-life/mulch-coverage-bag-count", icon: "🌿" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday-life/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday-life/hose-runtime-flow-rate", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}