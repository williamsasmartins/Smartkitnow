import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, User } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BodyFatUsNavy3SitesCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); 
  const [inputs, setInputs] = useState({
    age: '',
    height: '',
    neck: '',
    waist: '',
    hip: ''
  }); 

  // 2. LOGIC
  const results = useMemo(() => {
    const { age, height, neck, waist, hip } = inputs;
    if (!age || !height || !neck || !waist || (unit === "metric" && !hip)) return null;

    const heightInCm = unit === "imperial" ? height * 2.54 : height;
    const neckInCm = unit === "imperial" ? neck * 2.54 : neck;
    const waistInCm = unit === "imperial" ? waist * 2.54 : waist;
    const hipInCm = unit === "imperial" ? hip * 2.54 : hip;

    let bodyFatPercentage;
    if (unit === "imperial") {
      bodyFatPercentage = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistInCm - neckInCm) + 0.15456 * Math.log10(heightInCm)) - 450;
    }

    return bodyFatPercentage.toFixed(2);
  }, [inputs, unit]);

  // 3. FAQ (Must match Body Fat % (US Navy / 3-sites))
  const faqs = [
    { question: "What is the US Navy Body Fat Calculator?", answer: "The US Navy Body Fat Calculator is a method used to estimate body fat percentage based on measurements of the neck, waist, and height." },
    { question: "How accurate is the US Navy method?", answer: "The US Navy method provides a fairly accurate estimate of body fat percentage, though it may not be as precise as methods like DEXA scans." },
    { question: "Why use the US Navy method?", answer: "This method is popular due to its simplicity and the minimal equipment required, making it accessible for most people." }
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
          <div className="flex gap-4">
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial</SelectItem>
                <SelectItem value="metric">Metric</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <Label htmlFor="age">Age</Label>
            <Input id="age" value={inputs.age} onChange={(e) => setInputs({ ...inputs, age: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <Label htmlFor="height">Height ({unit === "imperial" ? "inches" : "cm"})</Label>
            <Input id="height" value={inputs.height} onChange={(e) => setInputs({ ...inputs, height: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <Label htmlFor="neck">Neck ({unit === "imperial" ? "inches" : "cm"})</Label>
            <Input id="neck" value={inputs.neck} onChange={(e) => setInputs({ ...inputs, neck: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <Label htmlFor="waist">Waist ({unit === "imperial" ? "inches" : "cm"})</Label>
            <Input id="waist" value={inputs.waist} onChange={(e) => setInputs({ ...inputs, waist: e.target.value })} />
          </div>
          {unit === "metric" && (
            <div className="flex gap-4">
              <Label htmlFor="hip">Hip (cm)</Label>
              <Input id="hip" value={inputs.hip} onChange={(e) => setInputs({ ...inputs, hip: e.target.value })} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11 text-base font-semibold" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({ age: '', height: '', neck: '', waist: '', hip: '' })}>Reset</Button>
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
                {results}%
              </p>
              <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-300">
                Your estimated body fat percentage.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL (LONG CONTENT)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          The Body Fat % (US Navy / 3-sites) calculator is a convenient tool for estimating your body fat percentage using simple measurements. This method, developed by the US Navy, requires measurements of your neck, waist, and height. For women, a hip measurement is also needed. The calculator allows you to toggle between imperial and metric units, making it versatile for users worldwide. Simply input your measurements, select your unit preference, and click calculate to receive an estimate of your body fat percentage. This method is popular due to its ease of use and the minimal equipment required, making it accessible for most people.
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
            <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Source</a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Description of the source.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Fat % (US Navy / 3-sites)"
      description="Estimate your body fat percentage using the US Navy method. Track your body composition progress accurately without expensive equipment."
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
      formula={{ title: "Formula", formula: "Body Fat % = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76", variables: [] }}
      example={{ title: "Example", scenario: "Example scenario", steps: [], result: "Example result" }}
      relatedCalculators={[{"title":"BMI — Body Mass Index Calculator","url":"/health/bmi-body-mass-index","icon":"⚖️"},{"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"🔥"},{"title":"TDEE — Total Daily Energy Expenditure Calculator","url":"/health/tdee-daily-energy-expenditure","icon":"🔥"},{"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"⚖️"},{"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🧮"},{"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"🧮"}]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}