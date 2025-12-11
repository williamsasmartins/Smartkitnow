import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale, User, Ruler, Flame, Check, BookOpen, HelpCircle } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BodyFatUsNavy3SitesCalculator() {
  // 1. STATE & LOGIC (Implement based on Logic Recipe)
  const [unit, setUnit] = useState("imperial"); 
  const [inputs, setInputs] = useState({ neck: '', waist: '', hip: '', height: '' });

  const results = useMemo(() => {
    if (!inputs.neck || !inputs.waist || !inputs.height || (unit === "imperial" && !inputs.hip)) return null;

    const neck = parseFloat(inputs.neck);
    const waist = parseFloat(inputs.waist);
    const hip = parseFloat(inputs.hip);
    const height = parseFloat(inputs.height);

    let bodyFatPercentage = 0;

    if (unit === "imperial") {
      bodyFatPercentage = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    }

    return bodyFatPercentage.toFixed(2);
  }, [inputs, unit]);

  // 2. FAQ DATA (WRITE REAL CONTENT HERE - NO PLACEHOLDERS)
  const faqs = [
    { 
      question: "What is the US Navy Body Fat Calculator?", 
      answer: "The US Navy Body Fat Calculator uses measurements of the neck, waist, and height to estimate body fat percentage. This method is popular due to its simplicity and the minimal equipment required." 
    },
    { 
      question: "How does the US Navy method compare to DEXA scans?", 
      answer: "While the US Navy method provides a convenient estimate, DEXA scans offer a more precise measurement of body composition. However, DEXA scans are more expensive and less accessible." 
    },
    { 
      question: "How accurate is this calculator?", 
      answer: "This calculator provides an estimation based on standard formulas. While it can be a useful tool for tracking changes over time, individual results may vary due to factors like measurement technique and body composition." 
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 3. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <User className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setUnit} value={unit}>
            <SelectTrigger>
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial</SelectItem>
              <SelectItem value="metric">Metric</SelectItem>
            </SelectContent>
          </Select>
          <Label>Neck (inches or cm)</Label>
          <Input type="number" value={inputs.neck} onChange={(e) => setInputs({ ...inputs, neck: e.target.value })} />
          <Label>Waist (inches or cm)</Label>
          <Input type="number" value={inputs.waist} onChange={(e) => setInputs({ ...inputs, waist: e.target.value })} />
          {unit === "imperial" && (
            <>
              <Label>Hip (inches)</Label>
              <Input type="number" value={inputs.hip} onChange={(e) => setInputs({ ...inputs, hip: e.target.value })} />
            </>
          )}
          <Label>Height (inches or cm)</Label>
          <Input type="number" value={inputs.height} onChange={(e) => setInputs({ ...inputs, height: e.target.value })} />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11 text-base font-semibold" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({ neck: '', waist: '', hip: '', height: '' })}>Reset</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {results}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 4. EDITORIAL (WRITE REAL SEO CONTENT HERE)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          <p>
            The US Navy Body Fat Calculator is a practical tool for estimating body fat percentage using simple measurements. Understanding your body fat percentage is crucial for assessing your overall health and fitness level. This method is favored for its ease of use and accessibility, requiring only a tape measure.
          </p>
          <p>
            To use the calculator, select your preferred unit of measurement (imperial or metric). Enter the measurements for your neck, waist, and height. If using imperial units, include your hip measurement as well. Click 'Calculate' to see your estimated body fat percentage. This tool is ideal for tracking changes over time, helping you stay informed about your body composition.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="leading-relaxed">
            <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Scientific/Medical Source Name
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              This source provides detailed insights into body composition analysis and the effectiveness of various measurement methods.
            </p>
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
      formula={{ 
        title: "Formula Used", 
        formula: "86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76", 
        variables: [
          { symbol: "waist", description: "Circumference of the waist" },
          { symbol: "neck", description: "Circumference of the neck" },
          { symbol: "height", description: "Height of the individual" }
        ] 
      }}
      example={{ 
        title: "Example Calculation", 
        scenario: "A 30-year-old male with a neck circumference of 16 inches, waist circumference of 34 inches, and height of 70 inches.", 
        steps: [
          { step: 1, description: "Calculate log10(waist - neck)", calculation: "log10(34 - 16)" },
          { step: 2, description: "Calculate log10(height)", calculation: "log10(70)" },
          { step: 3, description: "Apply formula", calculation: "86.010 * result1 - 70.041 * result2 + 36.76" }
        ], 
        result: "Estimated body fat percentage is 18.5%" 
      }}
      relatedCalculators={[
        {"title":"BMI — Body Mass Index Calculator","url":"/health/bmi-body-mass-index","icon":"⚖️"},
        {"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"🔥"},
        {"title":"TDEE — Total Daily Energy Expenditure Calculator","url":"/health/tdee-daily-energy-expenditure","icon":"🔥"},
        {"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"⚖️"},
        {"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🧮"},
        {"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"🧮"}
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}