import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertCircle, Calculator, RotateCcw, CheckCircle2 } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  // 1. SETUP STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({ weight: "", feet: "", inches: "", heightCm: "", weightKg: "" });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    let bmi = 0;
    let label = "";
    let category = "";

    if (unit === "imperial" && inputs.weight && inputs.feet && inputs.inches) {
      const heightInInches = parseFloat(inputs.feet) * 12 + parseFloat(inputs.inches);
      bmi = (parseFloat(inputs.weight) / (heightInInches * heightInInches)) * 703;
    } else if (unit === "metric" && inputs.heightCm && inputs.weightKg) {
      const heightInMeters = parseFloat(inputs.heightCm) / 100;
      bmi = parseFloat(inputs.weightKg) / (heightInMeters * heightInMeters);
    }

    if (bmi > 0) {
      if (bmi < 18.5) {
        label = "Underweight";
        category = "Underweight";
      } else if (bmi < 24.9) {
        label = "Normal weight";
        category = "Normal weight";
      } else if (bmi < 29.9) {
        label = "Overweight";
        category = "Overweight";
      } else {
        label = "Obesity";
        category = "Obesity";
      }
    }

    return { value: bmi.toFixed(1), label, category };
  }, [inputs, unit]);

  // 3. CONTENT DATA
  const faqs = [
    { question: "What is BMI?", answer: "BMI stands for Body Mass Index, a measure of body fat based on height and weight." },
    { question: "How is BMI calculated?", answer: "BMI is calculated by dividing a person's weight by the square of their height." },
    { question: "What is a healthy BMI range?", answer: "A healthy BMI range is typically between 18.5 and 24.9." },
    { question: "Can BMI be used for all individuals?", answer: "BMI may not be accurate for athletes or individuals with high muscle mass." },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Render Inputs for BMI — Body Mass Index Calculator */}
      {unit === "imperial" ? (
        <div className="space-y-4">
          <div>
            <Label className="block text-slate-700 dark:text-slate-300">Weight (lbs)</Label>
            <Input type="number" value={inputs.weight} onChange={(e) => setInputs({ ...inputs, weight: e.target.value })} />
          </div>
          <div className="flex space-x-4">
            <div>
              <Label className="block text-slate-700 dark:text-slate-300">Height (ft)</Label>
              <Input type="number" value={inputs.feet} onChange={(e) => setInputs({ ...inputs, feet: e.target.value })} />
            </div>
            <div>
              <Label className="block text-slate-700 dark:text-slate-300">Height (in)</Label>
              <Input type="number" value={inputs.inches} onChange={(e) => setInputs({ ...inputs, inches: e.target.value })} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label className="block text-slate-700 dark:text-slate-300">Weight (kg)</Label>
            <Input type="number" value={inputs.weightKg} onChange={(e) => setInputs({ ...inputs, weightKg: e.target.value })} />
          </div>
          <div>
            <Label className="block text-slate-700 dark:text-slate-300">Height (cm)</Label>
            <Input type="number" value={inputs.heightCm} onChange={(e) => setInputs({ ...inputs, heightCm: e.target.value })} />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({ weight: "", feet: "", inches: "", heightCm: "", weightKg: "" })} className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results Display (Blue Gradient) */}
      {results.value !== "0.0" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Result</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50">{results.value}</p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Enter your weight and height in the appropriate fields. Choose between Imperial or Metric units. Click "Calculate" to see your BMI and its category.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              1. CDC - About Adult BMI
            </a>
            <p className="text-slate-500 text-sm mt-1">Information on BMI from the Centers for Disease Control and Prevention.</p>
          </li>
          <li className="block">
            <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              2. WHO - Obesity and Overweight
            </a>
            <p className="text-slate-500 text-sm mt-1">World Health Organization fact sheet on obesity and overweight.</p>
          </li>
          <li className="block">
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              3. NIH - Calculate Your Body Mass Index
            </a>
            <p className="text-slate-500 text-sm mt-1">BMI calculator and information from the National Institutes of Health.</p>
          </li>
          <li className="block">
            <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/bmi-calculator/itt-20484938" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              4. Mayo Clinic - BMI Calculator
            </a>
            <p className="text-slate-500 text-sm mt-1">BMI calculator and guidance from the Mayo Clinic.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight. This tool helps you estimate your results accurately using standard formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "The Formula", 
        formula: "BMI = weight (kg) / height (m)^2 or BMI = (weight (lbs) / height (in)^2) * 703", 
        variables: [
          { symbol: "weight", description: "Your weight in kilograms or pounds" },
          { symbol: "height", description: "Your height in meters or inches" }
        ] 
      }}
      example={{ 
        title: "Example Calculation", 
        scenario: "A person weighing 150 lbs and 5 feet 5 inches tall.",
        steps: [
          { label: "Step 1", explanation: "Convert height to inches: 5 feet 5 inches = 65 inches." },
          { label: "Step 2", explanation: "Apply formula: BMI = (150 / (65 * 65)) * 703 = 24.96." }
        ],
        result: "The BMI is 24.96, which is considered Normal weight."
      }}
      relatedCalculators={[
        { "title": "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", "url": "/health/bmr-mifflin-st-jeor", "icon": "⚖️" },
        { "title": "TDEE — Total Daily Energy Expenditure Calculator", "url": "/health/tdee-daily-energy-expenditure", "icon": "🔥" },
        { "title": "Body Fat % (US Navy / 3-sites)", "url": "/health/body-fat-us-navy-3-sites", "icon": "❤️" },
        { "title": "Ideal Weight Range (Hamwi/Devine/Miller)", "url": "/health/ideal-weight-range-hamwi-devine-miller", "icon": "💧" },
        { "title": "Waist-to-Height Ratio Checker", "url": "/health/waist-to-height-ratio", "icon": "🥗" },
        { "title": "Body Surface Area (BSA) Calculator", "url": "/health/body-surface-area-bsa", "icon": "😴" }
      ]}
      onThisPage={[ 
        { id: "how-to-use", label: "How to use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}