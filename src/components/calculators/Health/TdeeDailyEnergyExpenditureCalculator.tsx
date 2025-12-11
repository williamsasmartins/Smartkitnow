import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, User } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function TdeeDailyEnergyExpenditureCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); 
  const [inputs, setInputs] = useState({
    weight: "",
    heightFt: "", heightIn: "", heightCm: ""
  }); 

  // 2. LOGIC
  const results = useMemo(() => {
    let weightInKg, heightInM;

    if (unit === "imperial") {
      const totalInches = parseFloat(inputs.heightFt || 0) * 12 + parseFloat(inputs.heightIn || 0);
      weightInKg = parseFloat(inputs.weight || 0) * 0.453592;
      heightInM = totalInches * 0.0254;
    } else {
      weightInKg = parseFloat(inputs.weight || 0);
      heightInM = parseFloat(inputs.heightCm || 0) / 100;
    }

    const bmi = weightInKg / (heightInM * heightInM);
    let status = "", color = "";

    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-blue-500";
    } else if (bmi < 24.9) {
      status = "Normal";
      color = "text-green-500";
    } else if (bmi < 29.9) {
      status = "Overweight";
      color = "text-yellow-500";
    } else {
      status = "Obese";
      color = "text-red-500";
    }

    return { value: bmi.toFixed(1), status, color };
  }, [inputs, unit]);

  // 3. FAQ
  const faqs = [
    { question: "What is BMI?", answer: "Body Mass Index (BMI) is a measure that uses your height and weight to work out if your weight is healthy." },
    { question: "How is BMI calculated?", answer: "BMI is calculated by dividing your weight in kilograms by your height in meters squared." },
    { question: "Is BMI a good measure of health?", answer: "BMI is a useful indicator of healthy weight for most people, but it does not directly measure body fat." },
    { question: "What are the BMI categories?", answer: "Underweight: <18.5, Normal: 18.5–24.9, Overweight: 25–29.9, Obese: 30 or more." }
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
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial</SelectItem>
                <SelectItem value="metric">Metric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {unit === "imperial" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height (ft)</Label>
                <Input
                  type="number"
                  value={inputs.heightFt}
                  onChange={(e) => setInputs({ ...inputs, heightFt: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-slate-300"
                />
              </div>
              <div>
                <Label>Height (in)</Label>
                <Input
                  type="number"
                  value={inputs.heightIn}
                  onChange={(e) => setInputs({ ...inputs, heightIn: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-slate-300"
                />
              </div>
            </div>
          ) : (
            <div>
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={inputs.heightCm}
                onChange={(e) => setInputs({ ...inputs, heightCm: e.target.value })}
                className="flex h-10 w-full rounded-md border border-slate-300"
              />
            </div>
          )}

          <div>
            <Label>Weight ({unit === "imperial" ? "lbs" : "kg"})</Label>
            <Input
              type="number"
              value={inputs.weight}
              onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
              className="flex h-10 w-full rounded-md border border-slate-300"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11 text-base font-semibold" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({ weight: "", heightFt: "", heightIn: "", heightCm: "" })}>Reset</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          <Card className={`bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-2 text-xl font-semibold ${results.color}`}>
                <Activity className="h-5 w-5" />
                Your Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm font-medium uppercase text-slate-500">BMI</p>
                <p className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {results.value}
                </p>
                <p className={`text-sm ${results.color}`}>{results.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL (LONG CONTENT MANDATORY)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The BMI calculator is a simple tool that helps you determine your Body Mass Index, a measure of body fat based on height and weight. To use this calculator, start by selecting your preferred unit of measurement: Imperial or Metric. If you choose Imperial, you will need to enter your height in feet and inches, and your weight in pounds. For Metric, enter your height in centimeters and weight in kilograms.
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Once you have entered your details, click the "Calculate" button to see your BMI result. The calculator will display your BMI value along with a classification: Underweight, Normal, Overweight, or Obese. This classification helps you understand whether you are within a healthy weight range. If you wish to reset the inputs, simply click the "Reset" button to clear all fields.
        </p>
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
            <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">World Health Organization</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Comprehensive guidelines on BMI and its implications.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Body Mass Index (BMI) instantly. Determine if you are in a healthy weight range based on your height and weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: 'how-to-use', label: 'How to Use' },
        { id: 'faq', label: 'FAQ' },
        { id: 'references', label: 'References' }
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default TdeeDailyEnergyExpenditureCalculator;