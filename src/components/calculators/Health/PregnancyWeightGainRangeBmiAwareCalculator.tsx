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
      question: "How much weight should I gain during pregnancy?",
      answer: "The recommended weight gain depends on your pre-pregnancy BMI. Women with a normal BMI (18.5–24.9) should gain 25–35 pounds, underweight women (BMI &lt;18.5) should gain 28–40 pounds, overweight women (BMI 25–29.9) should gain 15–25 pounds, and obese women (BMI &gt;30) should gain 11–20 pounds according to the Institute of Medicine guidelines.",
    },
    {
      question: "When does most pregnancy weight gain occur?",
      answer: "Most weight gain happens during the second and third trimesters. You should gain approximately 1–2 pounds per week during the second trimester and about 1 pound per week during the third trimester, with minimal weight gain (2–5 pounds total) expected during the first trimester.",
    },
    {
      question: "Can I use this calculator if I'm carrying twins or multiples?",
      answer: "This calculator is designed for singleton pregnancies. Women carrying twins should aim for 35–45 pounds of weight gain if they have a normal BMI, while those with triplets or higher multiples should consult their healthcare provider for personalized recommendations, as guidelines are less standardized for these pregnancies.",
    },
    {
      question: "What if I'm already overweight or obese before pregnancy?",
      answer: "If your pre-pregnancy BMI is 25 or higher, the calculator will recommend lower weight gain targets—typically 15–25 pounds for overweight women and 11–20 pounds for obese women. This reduced gain can help reduce risks of gestational diabetes and complications while still supporting fetal development.",
    },
    {
      question: "Is it normal to gain weight unevenly during pregnancy?",
      answer: "Yes, weight gain is rarely linear throughout pregnancy. Some women gain more in early months, while others gain steadily or experience plateaus. As long as your total gain by delivery falls within the recommended range for your BMI category, uneven monthly gain is generally not a concern, though consistent tracking helps identify any unusual patterns.",
    },
    {
      question: "What comprises the recommended pregnancy weight gain?",
      answer: "The 25–35 pounds recommended for normal-weight women breaks down as: baby (7–8 pounds), placenta (1–1.5 pounds), amniotic fluid (2–3 pounds), increased blood volume (3–4 pounds), breast tissue (1–3 pounds), and maternal fat and muscle reserves (5–10 pounds).",
    },
    {
      question: "How does gestational diabetes affect weight gain recommendations?",
      answer: "Women diagnosed with gestational diabetes should follow the same IOM weight gain guidelines based on their pre-pregnancy BMI, but may need more frequent monitoring and dietary adjustments to manage blood sugar levels. Your healthcare provider may recommend slower, more controlled weight gain and increased physical activity to help manage the condition.",
    },
    {
      question: "What should I do if I'm gaining too much weight during pregnancy?",
      answer: "If you're gaining significantly more than recommended, discuss it with your healthcare provider before making dietary changes. They can rule out water retention, assess eating habits, and provide guidance on safe nutrition and exercise during pregnancy, as severe calorie restriction is not recommended during this time.",
    },
    {
      question: "How much weight do you typically lose immediately after delivery?",
      answer: "Most women lose 10–13 pounds immediately after delivery, including the baby (7–8 pounds), placenta (1–1.5 pounds), and amniotic fluid (2–3 pounds). The remaining weight is typically lost gradually over 6–12 months through breastfeeding, reduced calorie intake, and post-pregnancy exercise.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Pregnancy Weight Gain Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Pregnancy Weight Gain Calculator helps expectant mothers determine the appropriate amount of weight to gain based on their pre-pregnancy body mass index (BMI) and current pregnancy stage. Healthy weight gain during pregnancy is essential for supporting fetal development, maternal health, and successful delivery outcomes. Using evidence-based guidelines from the Institute of Medicine, this calculator provides personalized recommendations to help you monitor your progress throughout your nine months.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input your pre-pregnancy weight, your current height, and how many weeks pregnant you are. The calculator automatically computes your BMI and determines which weight gain category you fall into—underweight, normal weight, overweight, or obese. It then calculates your target total weight gain range and compares it against your current weight to show whether you're on track, ahead, or behind the recommended progression.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive your results, compare your current weight gain to the recommended range for your BMI category. If you're within the target range, you're progressing well; if you're gaining too quickly or slowly, discuss the results with your healthcare provider. Remember that weight gain isn't linear—some weeks you'll gain more than others, and that's normal as long as your total gain over several weeks aligns with the trimester-specific targets.</p>
        </div>
      </section>

      {/* TABLE: Recommended Total Pregnancy Weight Gain by Pre-Pregnancy BMI */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Total Pregnancy Weight Gain by Pre-Pregnancy BMI</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The Institute of Medicine provides evidence-based weight gain targets based on BMI category before pregnancy.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Weight Gain (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Gain 2nd & 3rd Trimester (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;18.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–1.3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Normal weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.5–24.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8–1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–29.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–0.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese (Class I–III)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4–0.6</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommendations are from the Institute of Medicine (2009). First trimester gain is typically 2–5 pounds regardless of BMI category.</p>
      </section>

      {/* TABLE: Pregnancy Weight Gain Distribution by Component */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pregnancy Weight Gain Distribution by Component</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the typical breakdown of the 30-pound average weight gain for a normal-weight pregnant woman.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Percentage of Total Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Baby</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23–27%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Placenta</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Amniotic fluid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Increased blood volume</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–13%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Breast tissue expansion</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Uterine growth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–8%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maternal fat and muscle reserves</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17–33%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The maternal fat and muscle reserves represent the weight retained after delivery, which is typically lost over 6–12 months postpartum.</p>
      </section>

      {/* TABLE: Expected Monthly Weight Gain During Pregnancy */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Expected Monthly Weight Gain During Pregnancy</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This chart shows typical cumulative weight gain milestones throughout a singleton pregnancy for a normal-weight woman.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Trimester</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Month</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cumulative Gain (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Monthly Rate (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">First</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">First</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">First</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Second</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Second</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Second</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13–18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Third</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Third</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23–28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Third</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weight gain varies significantly between individuals; this represents typical patterns and should not be used to diagnose complications. Discuss irregular patterns with your healthcare provider.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your weight consistently by weighing yourself at the same time each week, ideally in the morning before eating, to minimize fluctuations from food and water intake that can skew your pregnancy weight gain calculator results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Focus on nutrient density rather than calorie counting—eat whole grains, lean proteins, fruits, vegetables, and dairy to ensure you're gaining weight with foods that nourish both you and your baby, which the calculator assumes you're doing when comparing against guidelines.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust your expectations if you have morning sickness in the first trimester, as many women lose a few pounds initially; the calculator accounts for this with lower first-trimester targets, so don't panic if your early gain is minimal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for water retention and natural weight fluctuations by looking at weekly or bi-weekly trends rather than day-to-day changes; the calculator works best when you input weights measured over several days to average out temporary variations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using pre-pregnancy weight from memory instead of medical records</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many women don't remember their exact pre-pregnancy weight, which leads to inaccurate BMI calculations and incorrect weight gain targets. Always verify your pre-pregnancy weight from your doctor's records or health insurance paperwork to ensure the calculator provides accurate recommendations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing your gain to other pregnant women instead of your BMI category</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A woman with a normal BMI should gain 25–35 pounds, while an overweight woman should gain only 15–25 pounds—comparing your progress to a friend's can lead to unnecessary stress or unhealthy eating habits. Your calculator results are personalized to your body composition, so follow your own targets, not someone else's.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring first-trimester weight loss or plateau</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many women lose 2–5 pounds in the first trimester due to morning sickness or dietary changes, which is normal and accounts for why first-trimester targets are lower. Don't assume something is wrong if you haven't gained much by week 12; the calculator expects this pattern.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming steady weekly gain means healthy pregnancy</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Weight gain during pregnancy is not linear—some weeks you'll gain 2 pounds, others you might gain nothing or lose a pound temporarily due to water retention, activity level, or hormonal changes. The calculator evaluates your progress over weeks and months, not individual weeks, so focus on longer-term trends instead.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much weight should I gain during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The recommended weight gain depends on your pre-pregnancy BMI. Women with a normal BMI (18.5–24.9) should gain 25–35 pounds, underweight women (BMI &lt;18.5) should gain 28–40 pounds, overweight women (BMI 25–29.9) should gain 15–25 pounds, and obese women (BMI &gt;30) should gain 11–20 pounds according to the Institute of Medicine guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When does most pregnancy weight gain occur?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most weight gain happens during the second and third trimesters. You should gain approximately 1–2 pounds per week during the second trimester and about 1 pound per week during the third trimester, with minimal weight gain (2–5 pounds total) expected during the first trimester.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator if I'm carrying twins or multiples?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is designed for singleton pregnancies. Women carrying twins should aim for 35–45 pounds of weight gain if they have a normal BMI, while those with triplets or higher multiples should consult their healthcare provider for personalized recommendations, as guidelines are less standardized for these pregnancies.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I'm already overweight or obese before pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your pre-pregnancy BMI is 25 or higher, the calculator will recommend lower weight gain targets—typically 15–25 pounds for overweight women and 11–20 pounds for obese women. This reduced gain can help reduce risks of gestational diabetes and complications while still supporting fetal development.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is it normal to gain weight unevenly during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, weight gain is rarely linear throughout pregnancy. Some women gain more in early months, while others gain steadily or experience plateaus. As long as your total gain by delivery falls within the recommended range for your BMI category, uneven monthly gain is generally not a concern, though consistent tracking helps identify any unusual patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What comprises the recommended pregnancy weight gain?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 25–35 pounds recommended for normal-weight women breaks down as: baby (7–8 pounds), placenta (1–1.5 pounds), amniotic fluid (2–3 pounds), increased blood volume (3–4 pounds), breast tissue (1–3 pounds), and maternal fat and muscle reserves (5–10 pounds).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does gestational diabetes affect weight gain recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Women diagnosed with gestational diabetes should follow the same IOM weight gain guidelines based on their pre-pregnancy BMI, but may need more frequent monitoring and dietary adjustments to manage blood sugar levels. Your healthcare provider may recommend slower, more controlled weight gain and increased physical activity to help manage the condition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if I'm gaining too much weight during pregnancy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you're gaining significantly more than recommended, discuss it with your healthcare provider before making dietary changes. They can rule out water retention, assess eating habits, and provide guidance on safe nutrition and exercise during pregnancy, as severe calorie restriction is not recommended during this time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much weight do you typically lose immediately after delivery?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most women lose 10–13 pounds immediately after delivery, including the baby (7–8 pounds), placenta (1–1.5 pounds), and amniotic fluid (2–3 pounds). The remaining weight is typically lost gradually over 6–12 months through breastfeeding, reduced calorie intake, and post-pregnancy exercise.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.cdc.gov/pregnancy/healthy-weight/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Weight Gain During Pregnancy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The CDC provides evidence-based recommendations for healthy pregnancy weight gain and explains how excessive or insufficient gain affects maternal and fetal health outcomes.</p>
          </li>
          <li>
            <a href="https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Nutrition During Pregnancy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The American College of Obstetricians and Gynecologists offers clinical guidance on recommended weight gain ranges based on BMI and discusses nutritional needs during each trimester.</p>
          </li>
          <li>
            <a href="https://www.nap.edu/catalog/12584/weight-gain-during-pregnancy-reexamining-the-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Institute of Medicine Weight Gain Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This National Academies Press resource details the 2009 Institute of Medicine recommendations that serve as the gold standard for pregnancy weight gain targets across different BMI categories.</p>
          </li>
          <li>
            <a href="https://www.acog.org/-/media/project/acog/acogorg/clinical/files/committee-opinion/articles/2013/01/weight-gain-during-pregnancy.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gestational Weight Gain and Pregnancy Outcomes</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ACOG's Committee Opinion examines the relationship between gestational weight gain and maternal–fetal complications, including gestational diabetes and preeclampsia risk reduction through appropriate weight management.</p>
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
