import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, Baby } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PregnancyWeightGainRangeBmiAwareCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({ 
    weight: "", // lbs or kg
    heightMetric: "", // cm
    heightFt: "", 
    heightIn: "",
    twins: "no" // single or twins
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    
    // --- STEP 1: CALCULATE BMI ---
    let bmi = 0;
    
    // Validate basics
    if (!weightRaw || weightRaw <= 0) {
       return { min: 0, max: 0, label: "Enter details...", category: "", unitLabel: "" };
    }

    if (unit === "metric") {
       const heightCm = parseFloat(inputs.heightMetric);
       if (heightCm > 0) {
          const heightM = heightCm / 100;
          bmi = weightRaw / (heightM * heightM);
       }
    } else {
       const ft = parseFloat(inputs.heightFt) || 0;
       const inch = parseFloat(inputs.heightIn) || 0;
       const heightInches = (ft * 12) + inch;
       if (heightInches > 0) {
          // BMI Formula Imperial: 703 * weight(lbs) / height(in)^2
          bmi = 703 * weightRaw / (heightInches * heightInches);
       }
    }

    if (bmi === 0) return { min: 0, max: 0, label: "Enter height...", category: "", unitLabel: "" };

    // --- STEP 2: DETERMINE RANGES (IOM GUIDELINES 2009) ---
    // Source: Institute of Medicine (US) / Health Canada
    
    let minGain = 0;
    let maxGain = 0;
    let category = "";
    const isTwins = inputs.twins === "yes";

    // Values strictly based on unit selection to ensure accuracy
    if (unit === "imperial") {
       // --- IMPERIAL (LBS) ---
       if (bmi < 18.5) {
          category = "Underweight";
          minGain = isTwins ? 50 : 28;
          maxGain = isTwins ? 62 : 40;
       } else if (bmi < 25) {
          category = "Normal Weight";
          minGain = isTwins ? 37 : 25;
          maxGain = isTwins ? 54 : 35;
       } else if (bmi < 30) {
          category = "Overweight";
          minGain = isTwins ? 31 : 15;
          maxGain = isTwins ? 50 : 25;
       } else {
          category = "Obese";
          minGain = isTwins ? 25 : 11;
          maxGain = isTwins ? 42 : 20;
       }
    } else {
       // --- METRIC (KG) ---
       // Ranges approximated from IOM guidelines converted to kg
       if (bmi < 18.5) {
          category = "Underweight";
          minGain = isTwins ? 22.7 : 12.5;
          maxGain = isTwins ? 28.1 : 18;
       } else if (bmi < 25) {
          category = "Normal Weight";
          minGain = isTwins ? 16.8 : 11.5;
          maxGain = isTwins ? 24.5 : 16;
       } else if (bmi < 30) {
          category = "Overweight";
          minGain = isTwins ? 14.1 : 7;
          maxGain = isTwins ? 22.7 : 11.5;
       } else {
          category = "Obese";
          minGain = isTwins ? 11.3 : 5;
          maxGain = isTwins ? 19.1 : 9;
       }
    }

    return { 
      min: minGain, 
      max: maxGain, 
      label: "Total Pregnancy Weight Gain", 
      category: `Pre-pregnancy BMI: ${bmi.toFixed(1)} (${category})`,
      unitLabel: unit === "imperial" ? "lbs" : "kg"
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    { 
      question: "Why does BMI matter for pregnancy weight gain?", 
      answer: "Your pre-pregnancy BMI helps determine how much weight is safe to gain. Those starting at a lower weight often need to gain more to support the baby, while those starting at a higher weight are advised to gain less to reduce risks like gestational diabetes and preeclampsia." 
    },
    { 
      question: "When should I start gaining weight?", 
      answer: "Most women gain very little (2-4 lbs or 1-2 kg) in the first trimester. The majority of weight gain happens steadily during the second and third trimesters as the baby grows rapidly." 
    },
    { 
      question: "Does this calculator support twins?", 
      answer: "Yes. Select 'Twins' in the options. Twin pregnancies require higher weight gain to support the development of two babies, and the recommended ranges are adjusted accordingly." 
    },
    { 
      question: "What if I gain more or less than recommended?", 
      answer: "These ranges are guidelines. Every pregnancy is unique. If your weight gain tracks slightly outside these numbers but your doctor says the baby is healthy, do not worry. Always consult your healthcare provider." 
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
           <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
           <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              </SelectContent>
           </Select>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <Label className="mb-2 block text-slate-700 dark:text-slate-300">Pre-pregnancy Weight</Label>
               <Input 
                 type="number" 
                 value={inputs.weight} 
                 onChange={(e) => setInputs({...inputs, weight: e.target.value})} 
                 placeholder={unit === "imperial" ? "lbs" : "kg"} 
               />
            </div>
            <div>
               <Label className="mb-2 block text-slate-700 dark:text-slate-300">Pregnancy Type</Label>
               <Select value={inputs.twins} onValueChange={(v) => setInputs({...inputs, twins: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                     <SelectItem value="no">Single Baby</SelectItem>
                     <SelectItem value="yes">Twins / Multiples</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Height Input */}
         <div>
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">Height</Label>
            {unit === "metric" ? (
               <Input 
                 type="number" 
                 value={inputs.heightMetric} 
                 onChange={(e) => setInputs({...inputs, heightMetric: e.target.value})} 
                 placeholder="Centimeters (cm)" 
               />
            ) : (
               <div className="flex gap-4">
                 <Input 
                   type="number" 
                   value={inputs.heightFt} 
                   onChange={(e) => setInputs({...inputs, heightFt: e.target.value})} 
                   placeholder="Feet" 
                 />
                 <Input 
                   type="number" 
                   value={inputs.heightIn} 
                   onChange={(e) => setInputs({...inputs, heightIn: e.target.value})} 
                   placeholder="Inches" 
                 />
               </div>
            )}
         </div>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Calculator className="mr-2 h-4 w-4" /> Calculate Range
        </Button>
        <Button 
           variant="outline" 
           onClick={() => setInputs({ weight: "", heightMetric: "", heightFt: "", heightIn: "", twins: "no" })} 
           className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast) */}
      {results.min !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
              <CardContent className="p-8 text-center">
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.label}</p>
                 <div className="flex items-center justify-center gap-2">
                    <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                        {results.min} - {results.max}
                    </p>
                    <span className="text-xl font-medium text-slate-600 dark:text-slate-400 mt-4">{results.unitLabel}</span>
                 </div>
                 
                 {results.category && (
                    <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                       <Baby className="w-4 h-4 mr-2" />
                       {results.category}
                    </div>
                 )}
              </CardContent>
           </Card>
           
           <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Note:</strong> This range represents the <em>total</em> recommended weight gain for the entire pregnancy based on your starting BMI (IOM Guidelines, 2009).
              </p>
           </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">What is the Recommended Pregnancy Weight Gain?</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Healthy weight gain during pregnancy is crucial for the development of your baby and your own health. The recommended amount of weight you should gain depends largely on your <strong>pre-pregnancy Body Mass Index (BMI)</strong>. This ensures the baby gets enough nutrients without placing unnecessary stress on your body.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            These guidelines, established by the Institute of Medicine (IOM), are designed to optimize outcomes for both mother and child. Gaining within these ranges helps reduce risks such as low birth weight, preterm birth, or complications related to excessive weight gain like gestational diabetes and postpartum weight retention.
         </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            To get your personalized range, you need to input your weight <em>before</em> you became pregnant (or your weight at the very beginning of pregnancy) and your height.
         </p>
         <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Unit System:</strong> Choose "Imperial" for pounds/feet or "Metric" for kg/cm.</li>
            <li><strong>Pre-pregnancy Weight:</strong> Enter your weight before conception. Do not enter your current pregnancy weight.</li>
            <li><strong>Pregnancy Type:</strong> Select "Twins" if you are carrying multiples, as the nutritional needs and recommended gain are significantly higher.</li>
         </ul>
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

      <section id="references" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
         <ul className="space-y-4">
           <li className="block">
             <a href="https://www.ncbi.nlm.nih.gov/books/NBK32813/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               1. Institute of Medicine (IOM) Guidelines
             </a>
             <p className="text-slate-500 text-sm mt-1">Weight Gain During Pregnancy: Reexamining the Guidelines (2009). The gold standard for prenatal weight recommendations.</p>
           </li>
           <li className="block">
             <a href="https://www.cdc.gov/reproductivehealth/maternalinfanthealth/pregnancy-weight-gain.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               2. Centers for Disease Control and Prevention (CDC)
             </a>
             <p className="text-slate-500 text-sm mt-1">Weight Gain During Pregnancy. Official health guidelines and trackers.</p>
           </li>
           <li className="block">
             <a href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2013/01/weight-gain-during-pregnancy" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               3. American College of Obstetricians and Gynecologists (ACOG)
             </a>
             <p className="text-slate-500 text-sm mt-1">Committee Opinion on weight gain recommendations for obstetricians.</p>
           </li>
           <li className="block">
             <a href="https://www.canada.ca/en/public-health/services/pregnancy/healthy-weight-gain-pregnancy.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               4. Health Canada: Healthy Weight Gain
             </a>
             <p className="text-slate-500 text-sm mt-1">Canadian guidelines for prenatal nutrition and weight management.</p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pregnancy Weight Gain Calculator"
      description="Determine the recommended weight gain range for your pregnancy based on your pre-pregnancy BMI. Updated with IOM 2009 guidelines for single and twin pregnancies."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "IOM Guidelines (2009)", 
        formula: "Ranges based on BMI Categories", 
        variables: [
           { symbol: "Underweight (BMI < 18.5)", description: "28-40 lbs (12.5-18 kg)" },
           { symbol: "Normal (BMI 18.5-24.9)", description: "25-35 lbs (11.5-16 kg)" },
           { symbol: "Overweight (BMI 25-29.9)", description: "15-25 lbs (7-11.5 kg)" },
           { symbol: "Obese (BMI > 30)", description: "11-20 lbs (5-9 kg)" }
        ] 
      }}
      example={{ 
        title: "Example Calculation", 
        scenario: "A woman with a pre-pregnancy BMI of 22 (Normal Weight).",
        steps: [
           { label: "Step 1", explanation: "Identify BMI Category: 22 falls into 'Normal Weight' (18.5 - 24.9)." },
           { label: "Step 2", explanation: "Apply IOM Range: The recommended total gain is 25 to 35 lbs." }
        ],
        result: "Target weight gain: 25 - 35 lbs (11.5 - 16 kg)."
      }}
      relatedCalculators={[
        {title:"BMI — Body Mass Index",url:"/health/bmi-body-mass-index",icon:"⚖️"},
        {title:"Pregnancy Due Date",url:"/health/pregnancy-due-date-naegele",icon:"🤰"},
        {title:"TDEE — Daily Calories",url:"/health/tdee-daily-energy-expenditure",icon:"🔥"},
        {title:"Water Intake Calculator",url:"/health/water-intake-per-day",icon:"💧"},
        {title:"Ideal Weight Range",url:"/health/ideal-weight-range-hamwi-devine-miller",icon:"❤️"},
        {title:"Macro Split Planner",url:"/health/macro-split-planner",icon:"🥗"}
      ]}
      onThisPage={[ 
        {id: "what-is", label: "What is Healthy Weight Gain?"},
        {id: "how-to-use", label: "How to Use This Calculator"},
        {id: "faq", label: "Frequently Asked Questions"},
        {id: "references", label: "Trusted References"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
