import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// 👇 KEEP IMPORTS SEPARATE 👇
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, HelpCircle, BookOpen, AlertCircle, Calculator } from "lucide-react";
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

  const results = useMemo(() => {
     // Robust math logic here.
     return { value: 0, label: "..." };
  }, [inputs, unit]);

  // 👇 DETAILED FAQ DATA 👇
  const faqs = [
    { question: "What is TDEE?", answer: "TDEE stands for Total Daily Energy Expenditure, which is the total number of calories you burn each day." },
    { question: "How is TDEE calculated?", answer: "TDEE is calculated based on your Basal Metabolic Rate (BMR) and your level of physical activity." },
    { question: "Why is TDEE important?", answer: "Understanding your TDEE can help you manage your weight by knowing how many calories you need to maintain, lose, or gain weight." },
    { question: "Can TDEE change over time?", answer: "Yes, TDEE can change with variations in weight, age, and activity level." },
    { question: "Is TDEE the same for everyone?", answer: "No, TDEE varies for each individual based on factors like age, gender, weight, height, and activity level." },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs & Unit Toggle */}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({...inputs})} className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100">
          Reset
        </Button>
      </div>

      {results.value ? (
        <div className="space-y-6">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-100">
              <CardContent className="p-6">
                 <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Result</p>
                 <p className="text-4xl font-extrabold text-blue-900 dark:text-blue-50">{results.value}</p>
                 <p className="text-slate-600 dark:text-slate-300 mt-2">{results.label}</p>
              </CardContent>
           </Card>
           <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>Disclaimer: Informational only.</p>
           </div>
        </div>
      ) : null}
    </div>
  );

  // EDITORIAL CONTENT (RICH & DEEP)
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4">To use the TDEE calculator, input your age, gender, weight, height, and activity level. Choose between metric and imperial units for your convenience. Click 'Calculate' to see your Total Daily Energy Expenditure.</p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4">TDEE is calculated by first determining your Basal Metabolic Rate (BMR) using formulas like the Harris-Benedict or Mifflin-St Jeor equations. This BMR is then multiplied by an activity factor that corresponds to your lifestyle, ranging from sedentary to very active.</p>
      </section>

      <section id="faq" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
         <ul className="space-y-4">
            {faqs.map((item, i) => (
              <li key={i}>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.question}</h3>
                <p className="text-slate-700 dark:text-slate-300">{item.answer}</p>
              </li>
            ))}
         </ul>
      </section>

      <section id="references" className="scroll-mt-32">
         <ul className="space-y-4">
           <li className="mb-4">
             <a href="#" className="text-blue-600 font-bold block">Scientific Reference</a>
             <p className="text-slate-500">Citation details...</p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Discover your Total Daily Energy Expenditure (TDEE) with our precise calculator. Understand how many calories you burn daily to manage your weight effectively."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // 👇 FILL THESE PROPS CAREFULLY 👇
      formula={{ 
        title: "Medical Formula", 
        formula: "TDEE = BMR x Activity Level", 
        variables: [
          { symbol: "BMR", description: "Basal Metabolic Rate" },
          { symbol: "Activity Level", description: "Multiplier based on lifestyle" }
        ] 
      }}
      example={{ 
        title: "Clinical Example", 
        scenario: "A 30-year-old male, weighing 70kg, 175cm tall, with a moderate activity level.",
        steps: [
           { label: "Step 1", explanation: "Calculate BMR using Mifflin-St Jeor: BMR = 10*70 + 6.25*175 - 5*30 + 5" },
           { label: "Step 2", explanation: "Multiply BMR by activity level (1.55 for moderate): TDEE = BMR x 1.55" } 
        ],
        result: "Final Result Value" 
      }}
      relatedCalculators={[
        {"title":"BMI — Body Mass Index Calculator","url":"/health/bmi-body-mass-index","icon":"⚖️"},
        {"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"🔥"},
        {"title":"Body Fat % (US Navy / 3-sites)","url":"/health/body-fat-us-navy-3-sites","icon":"❤️"},
        {"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"💧"},
        {"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🥗"},
        {"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"😴"}
      ]}
      onThisPage={[ 
        {id: "how-to-use", label: "How to use this calculator"},
        {id: "formula", label: "The formula behind the math"},
        {id: "faq", label: "Frequently asked questions"},
        {id: "references", label: "References"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}