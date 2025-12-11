import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity, User } from "lucide-react"; 
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function TdeeDailyEnergyExpenditureCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState("imperial"); // Default to US
  const [inputs, setInputs] = useState({
    gender: "male",
    age: "",
    weight: "",
    heightFt: "", // Imperial Height Part 1
    heightIn: "", // Imperial Height Part 2
    heightCm: "", // Metric Height
  }); 

  // --- LOGIC ---
  const results = useMemo(() => {
    // 1. Normalize Inputs
    const weight = parseFloat(inputs.weight);
    let height = 0;
    
    if (unit === "imperial") {
       const ft = parseFloat(inputs.heightFt) || 0;
       const inch = parseFloat(inputs.heightIn) || 0;
       height = (ft * 30.48) + (inch * 2.54); // Convert to cm
    } else {
       height = parseFloat(inputs.heightCm);
    }

    // 2. Calculate BMI
    const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
    const heightM = height / 100;
    const bmi = weightKg / (heightM * heightM);

    // 3. Determine Status & Color
    let status = "Normal";
    let color = "text-emerald-600 dark:text-emerald-400";
    if (bmi < 18.5) {
      status = "Underweight";
      color = "text-rose-600 dark:text-rose-400";
    } else if (bmi >= 25) {
      status = "Overweight";
      color = "text-rose-600 dark:text-rose-400";
    }

    return { value: bmi.toFixed(1), status, color };
  }, [inputs, unit]);

  // --- FAQ SCHEMA ---
  const faqs = [
    { question: "What is BMI?", answer: "BMI stands for Body Mass Index..." },
    { question: "How is BMI calculated?", answer: "BMI is calculated using weight and height..." },
    { question: "What is a healthy BMI range?", answer: "A healthy BMI range is typically 18.5 to 24.9..." },
    { question: "Why is BMI important?", answer: "BMI is a useful measure of overweight and obesity..." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET ---
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
           {/* 1. UNIT TOGGLE (Buttons) */}
           <div className="flex justify-center mb-4">
             <Button onClick={() => setUnit("imperial")} className={unit === "imperial" ? "font-bold" : ""}>Imperial</Button>
             <Button onClick={() => setUnit("metric")} className={unit === "metric" ? "font-bold" : ""}>Metric</Button>
           </div>

           {/* 2. GENDER & AGE (Side by Side) */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <Label>Gender</Label>
               <select value={inputs.gender} onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}>
                 <option value="male">Male</option>
                 <option value="female">Female</option>
               </select>
             </div>
             <div>
               <Label>Age</Label>
               <Input type="number" value={inputs.age} onChange={(e) => setInputs({ ...inputs, age: e.target.value })} />
             </div>
           </div>

           {/* 3. HEIGHT INPUT (Smart Toggle) */}
           {unit === "imperial" ? (
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label>Height (Feet)</Label>
                 <Input type="number" value={inputs.heightFt} onChange={(e) => setInputs({ ...inputs, heightFt: e.target.value })} />
               </div>
               <div>
                 <Label>Height (Inches)</Label>
                 <Input type="number" value={inputs.heightIn} onChange={(e) => setInputs({ ...inputs, heightIn: e.target.value })} />
               </div>
             </div>
           ) : (
             <div>
               <Label>Height (cm)</Label>
               <Input type="number" value={inputs.heightCm} onChange={(e) => setInputs({ ...inputs, heightCm: e.target.value })} />
             </div>
           )}

           {/* 4. WEIGHT INPUT */}
           <div>
             <Label>Weight ({unit === "imperial" ? "lbs" : "kg"})</Label>
             <Input type="number" value={inputs.weight} onChange={(e) => setInputs({ ...inputs, weight: e.target.value })} />
           </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-11 text-base font-semibold" onClick={() => {}}>Calculate</Button>
        <Button variant="outline" className="flex-1 h-11 text-base font-medium" onClick={() => setInputs({})}>Reset</Button>
      </div>

      {results && (
        <div className="space-y-6 mt-6">
           {/* MAIN RESULT - EXACT GRADIENT */}
           <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                  <Activity className="h-5 w-5" />
                  Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-center">
                    <p className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                      {results.value}
                    </p>
                    {/* Status Badge */}
                    <span className={"inline-block px-3 py-1 rounded-full text-lg font-bold bg-white/50 dark:bg-black/20 " + results.color}>
                      {results.status}
                    </span>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL ---
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          Detailed medical explanation...
        </p>
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        {faqs.map((f, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{f.answer}</p>
            </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32 border-t border-slate-200 dark:border-slate-800 pt-10 mt-12">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
           References & Resources
         </h2>
         <ul className="space-y-4">
            <li className="leading-relaxed">
               <a href="#" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Source Title</a>
               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Brief description.</p>
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
        { id: 'how-to-use', label: 'How to Use This Calculator' },
        { id: 'formula', label: 'Formula Used' },
        { id: 'example', label: 'Example Calculation' },
        { id: 'faq', label: 'Frequently Asked Questions' },
        { id: 'references', label: 'References & Resources' }
      ]}
      formula={{ title: "Medical Formula", formula: "BMI = weight (kg) / height (m)^2", variables: [] }}
      example={{ title: "Clinical Example", scenario: "A person weighing 70kg and 1.75m tall...", steps: ["Step 1: Convert height to meters", "Step 2: Calculate BMI"], result: "BMI = 22.9" }}
      relatedCalculators={[{"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"❤️"},{"title":"TDEE — Total Daily Energy Expenditure Calculator","url":"/health/tdee-daily-energy-expenditure","icon":"🥗"},{"title":"Body Fat % (US Navy / 3-sites)","url":"/health/body-fat-us-navy-3-sites","icon":"🧍"},{"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"⚖️"},{"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🏥"},{"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"🧍"}]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default TdeeDailyEnergyExpenditureCalculator;