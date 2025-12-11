import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Activity } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TdeeDailyEnergyExpenditureCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); 
  const [inputs, setInputs] = useState({
    gender: "male",
    age: "",
    weight: "",
    height: "",
    activityLevel: "1.2"
  });

  // 2. LOGIC
  const results = useMemo(() => {
    const { gender, age, weight, height, activityLevel } = inputs;
    if (!age || !weight || !height) return null;

    const weightInKg = unit === "imperial" ? weight * 0.453592 : weight;
    const heightInCm = unit === "imperial" ? height * 2.54 : height;

    const bmr = gender === "male"
      ? 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
      : 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;

    const tdee = bmr * parseFloat(activityLevel);
    return tdee.toFixed(2);
  }, [inputs, unit]);

  // 3. FAQ
  const faqs = [
    { question: "What is TDEE?", answer: "TDEE stands for Total Daily Energy Expenditure." },
    { question: "How is TDEE calculated?", answer: "TDEE is calculated using the Mifflin-St Jeor Equation." },
    { question: "Why is TDEE important?", answer: "TDEE helps determine daily calorie needs." }
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
          <div className="flex items-center gap-4">
            <Label>Unit:</Label>
            <Button variant={unit === "imperial" ? "solid" : "outline"} onClick={() => setUnit("imperial")}>Imperial</Button>
            <Button variant={unit === "metric" ? "solid" : "outline"} onClick={() => setUnit("metric")}>Metric</Button>
          </div>
          <div className="flex items-center gap-4">
            <Label>Gender:</Label>
            <div>
              <input type="radio" name="gender" value="male" checked={inputs.gender === "male"} onChange={(e) => setInputs({ ...inputs, gender: e.target.value })} /> Male
              <input type="radio" name="gender" value="female" checked={inputs.gender === "female"} onChange={(e) => setInputs({ ...inputs, gender: e.target.value })} /> Female
            </div>
          </div>
          <div>
            <Label>Age:</Label>
            <Input type="number" value={inputs.age} onChange={(e) => setInputs({ ...inputs, age: e.target.value })} />
          </div>
          <div>
            <Label>Weight ({unit === "imperial" ? "lbs" : "kg"}):</Label>
            <Input type="number" value={inputs.weight} onChange={(e) => setInputs({ ...inputs, weight: e.target.value })} />
          </div>
          <div>
            <Label>Height ({unit === "imperial" ? "in" : "cm"}):</Label>
            <Input type="number" value={inputs.height} onChange={(e) => setInputs({ ...inputs, height: e.target.value })} />
          </div>
          <div>
            <Label>Activity Level:</Label>
            <Select value={inputs.activityLevel} onValueChange={(value) => setInputs({ ...inputs, activityLevel: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.2">Sedentary (1.2)</SelectItem>
                <SelectItem value="1.375">Lightly Active (1.375)</SelectItem>
                <SelectItem value="1.55">Moderately Active (1.55)</SelectItem>
                <SelectItem value="1.725">Very Active (1.725)</SelectItem>
                <SelectItem value="1.9">Extra Active (1.9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11 text-base font-semibold" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({ gender: "male", age: "", weight: "", height: "", activityLevel: "1.2" })}>Reset</Button>
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
                {results} kcal/day
              </p>
              <p className="mt-2 text-lg font-medium text-slate-700">
                Your estimated TDEE
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">Enter your details to calculate your TDEE.</p>
      </section>
      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </section>
      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Source</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Desc.</p>
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
        { id: 'how-to-use', label: 'How to Use' },
        { id: 'formula', label: 'Formula' },
        { id: 'example', label: 'Example' },
        { id: 'faq', label: 'FAQ' },
        { id: 'references', label: 'References' }
      ]}
      formula={{ title: "Formula", formula: "...", variables: [] }}
      example={{ title: "Example", scenario: "...", steps: [], result: "..." }}
      relatedCalculators={[{"title":"BMI — Body Mass Index Calculator","url":"/health/bmi-body-mass-index","icon":"⚖️"},{"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"🔥"},{"title":"Body Fat % (US Navy / 3-sites)","url":"/health/body-fat-us-navy-3-sites","icon":"⚖️"},{"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"⚖️"},{"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🧮"},{"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"🧮"}]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}