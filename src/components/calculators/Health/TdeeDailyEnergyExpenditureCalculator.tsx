import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
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
    activity: "1.2"
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const { age, gender, weight, heightMetric, heightFt, heightIn, activity } = inputs;
    if (!age || !weight || (!heightMetric && (!heightFt || !heightIn))) return null;

    const heightCm = unit === "metric" ? parseFloat(heightMetric) : (parseFloat(heightFt) * 30.48) + (parseFloat(heightIn) * 2.54);
    const weightKg = unit === "metric" ? parseFloat(weight) : parseFloat(weight) * 0.453592;

    const bmr = gender === "male"
      ? 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * parseFloat(age))
      : 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * parseFloat(age));

    const tdee = bmr * parseFloat(activity);
    return { value: Math.round(tdee), label: "Calories per day" };
  }, [inputs, unit]);

  const handleReset = () => {
    setInputs({ age: "", gender: "male", weight: "", heightMetric: "", heightFt: "", heightIn: "", activity: "1.2" });
  };

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const faqs = [
    { question: "What is TDEE?", answer: "TDEE stands for Total Daily Energy Expenditure, the total calories you burn daily." },
    { question: "How is TDEE calculated?", answer: "TDEE is calculated using BMR and activity level." },
    { question: "Why is TDEE important?", answer: "Understanding TDEE helps in managing weight effectively." },
    { question: "What affects TDEE?", answer: "Factors include age, gender, weight, height, and activity level." },
    { question: "Can TDEE change?", answer: "Yes, TDEE can change with lifestyle and physiological changes." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger>
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={inputs.gender} onValueChange={(value) => setInputs({ ...inputs, gender: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Input placeholder="Age" value={inputs.age} onChange={(e) => setInputs({ ...inputs, age: e.target.value })} />
      <Input placeholder="Weight" value={inputs.weight} onChange={(e) => setInputs({ ...inputs, weight: e.target.value })} />
      {unit === "metric" ? (
        <Input placeholder="Height (cm)" value={inputs.heightMetric} onChange={(e) => setInputs({ ...inputs, heightMetric: e.target.value })} />
      ) : (
        <div className="flex gap-4">
          <Input placeholder="Height (ft)" value={inputs.heightFt} onChange={(e) => setInputs({ ...inputs, heightFt: e.target.value })} />
          <Input placeholder="Height (in)" value={inputs.heightIn} onChange={(e) => setInputs({ ...inputs, heightIn: e.target.value })} />
        </div>
      )}
      <Select value={inputs.activity} onValueChange={(value) => setInputs({ ...inputs, activity: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Select Activity Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1.2">Sedentary</SelectItem>
          <SelectItem value="1.375">Lightly active</SelectItem>
          <SelectItem value="1.55">Moderately active</SelectItem>
          <SelectItem value="1.725">Very active</SelectItem>
          <SelectItem value="1.9">Extra active</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleCalculate} className="flex-1 h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white">
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex-1 h-11 text-base font-medium">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
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

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">Enter your details to calculate your TDEE.</p>
      </section>
      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The Science</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">TDEE is calculated using the Mifflin-St Jeor equation.</p>
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
            <a href="#" className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-lg block">Mifflin-St Jeor Equation</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A widely used formula for calculating BMR and TDEE.</p>
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
      formula={{ title: "Formula", formula: "TDEE = BMR × Activity Level", variables: [] }}
      example={{ title: "Example", scenario: "A 30-year-old male, 70kg, 175cm, moderately active.", steps: ["Calculate BMR", "Multiply by activity level"], result: "TDEE = 2500 kcal/day" }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "❤️" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "💧" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "🥗" },
        { title: "Body Surface Area (BSA) Calculator", url: "/health/body-surface-area-bsa", icon: "😴" }
      ]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}