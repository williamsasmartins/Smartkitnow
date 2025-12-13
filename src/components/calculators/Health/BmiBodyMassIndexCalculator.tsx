import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// ATOMIC IMPORTS
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, AlertCircle, Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BmiBodyMassIndexCalculator() {
  const [unit, setUnit] = useState("imperial"); // Default to Imperial for Canada/US
  const [inputs, setInputs] = useState({ 
    age: "", 
    gender: "male",
    weight: "", 
    heightMetric: "", 
    heightFt: "", 
    heightIn: "",
  });

  // --- LOGIC ENGINE ---
  const results = useMemo(() => {
    const age = parseFloat(inputs.age);
    const weightRaw = parseFloat(inputs.weight);
    
    // Height Conversion logic
    let heightCm = 0;
    if (unit === "metric") {
       heightCm = parseFloat(inputs.heightMetric);
    } else {
       const ft = parseFloat(inputs.heightFt) || 0;
       const inch = parseFloat(inputs.heightIn) || 0;
       heightCm = ((ft * 12) + inch) * 2.54;
    }

    // Weight Conversion logic
    let weightKg = unit === "metric" ? weightRaw : weightRaw / 2.20462;

    // Validation
    if (!weightRaw || !heightCm || weightRaw <= 0 || heightCm <= 0) {
       return { value: 0, label: "Enter your details...", category: "" };
    }

    // BMI Calculation
    // Logic: weight (kg) / height (m)^2
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiFinal = parseFloat(bmi.toFixed(1));

    // Determine Category
    let category = "";
    if (bmiFinal < 18.5) category = "Underweight";
    else if (bmiFinal < 25) category = "Normal weight";
    else if (bmiFinal < 30) category = "Overweight";
    else if (bmiFinal < 35) category = "Obesity Class I";
    else if (bmiFinal < 40) category = "Obesity Class II";
    else category = "Obesity Class III";

    return { 
      value: bmiFinal, 
      label: "BMI Score",
      category: category
    };
  }, [inputs, unit]);

  // --- CONTENT DATA ---
  const faqs = [
    { 
      question: "What is BMI and why does it matter?", 
      answer: "Body Mass Index (BMI) is a screening tool used to identify weight categories that may lead to health problems. It is a calculation based on your height and weight. While not a direct measure of body fat, it correlates with various metabolic and disease risks." 
    },
    { 
      question: "Is BMI accurate for athletes or bodybuilders?", 
      answer: "Not always. Because BMI does not distinguish between weight from fat and weight from muscle, athletes with high muscle mass may be classified as 'overweight' despite having low body fat. In these cases, body fat percentage is a better metric." 
    },
    { 
      question: "What is considered a healthy BMI range?", 
      answer: "For most adults, a BMI between 18.5 and 24.9 is considered healthy. A BMI below 18.5 suggests you may be underweight, while 25.0 to 29.9 falls into the overweight range. 30.0 and above indicates obesity." 
    },
    { 
      question: "Does age or sex impact the calculation?", 
      answer: "For adults (20+), the formula is the same regardless of sex or age. However, interpretation may vary slightly for older adults (who may need slightly more weight for resilience) and differs completely for children/teens, who use age-percentiles." 
    },
    { 
      question: "What are the risks of a high BMI?", 
      answer: "A high BMI is associated with increased risk of chronic conditions such as Type 2 diabetes, hypertension, heart disease, sleep apnea, and certain musculoskeletal disorders." 
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit & Gender Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Biological Sex</Label>
          <Select value={inputs.gender} onValueChange={(v) => setInputs({...inputs, gender: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Age & Weight Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Age</Label>
          <Input 
            type="number" 
            min="2" 
            max="120"
            value={inputs.age} 
            onChange={(e) => setInputs({...inputs, age: e.target.value})} 
            placeholder="Years" 
            aria-label="Age in years"
          />
        </div>
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Weight</Label>
          <Input 
            type="number" 
            min="1" 
            value={inputs.weight} 
            onChange={(e) => setInputs({...inputs, weight: e.target.value})} 
            placeholder={unit === "metric" ? "kg" : "lbs"} 
            aria-label={`Weight in ${unit === "metric" ? "kilograms" : "pounds"}`}
          />
        </div>
      </div>

      {/* Height Row */}
      <div>
        <Label className="mb-2 block text-slate-700 dark:text-slate-300">Height</Label>
        {unit === "metric" ? (
          <Input 
            type="number" 
            min="1" 
            value={inputs.heightMetric} 
            onChange={(e) => setInputs({...inputs, heightMetric: e.target.value})} 
            placeholder="Centimeters" 
            aria-label="Height in centimeters"
          />
        ) : (
          <div className="flex gap-4">
            <Input 
              type="number" 
              min="0" 
              value={inputs.heightFt} 
              onChange={(e) => setInputs({...inputs, heightFt: e.target.value})} 
              placeholder="Feet" 
              aria-label="Height in feet"
            />
            <Input 
              type="number" 
              min="0" 
              max="11"
              value={inputs.heightIn} 
              onChange={(e) => setInputs({...inputs, heightIn: e.target.value})} 
              placeholder="Inches" 
              aria-label="Height in inches"
            />
          </div>
        )}
      </div>
      
      {/* Buttons - STANDARD BLUE THEME */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate BMI"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate BMI
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setInputs({age: "", weight: "", heightMetric: "", heightFt: "", heightIn: "", gender: "male"})} 
          className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" role="region" aria-live="polite" aria-atomic="true">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-200 dark:border-indigo-900 shadow-lg">
              <CardContent className="p-8 text-center">
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.label}</p>
                 <p className="text-6xl font-extrabold text-blue-900 dark:text-blue-50 leading-none mb-2">{results.value}</p>
                 <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-800 border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-300 font-bold text-lg">{results.category}</p>
                 </div>
              </CardContent>
           </Card>
           <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
              <p>This result is a screening tool, not a clinical diagnosis. BMI does not distinguish between fat and muscle. Consult a healthcare professional for a complete assessment.</p>
           </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            To calculate your Body Mass Index (BMI), simply enter your current weight and height. You can select "Imperial" (lbs/ft) or "Metric" (kg/cm) from the dropdown menu. While age and sex are helpful for context, the primary adult BMI formula relies strictly on height and weight.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            After clicking calculate, you will see your BMI score and your weight category (e.g., Normal weight, Overweight). Use this tool as a preliminary check to understand where you stand relative to general health guidelines.
         </p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            BMI is a simple calculation of weight-for-height. Depending on the unit system you use, the formula adapts slightly to ensure the result is consistent.
         </p>
         
         <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg font-mono text-center border border-slate-200 dark:border-slate-700">
                <p className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-400">Imperial Formula</p>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">(Used in US/Canada)</p>
                <p className="font-semibold">BMI = 703 × [weight (lbs) / height (in)²]</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg font-mono text-center border border-slate-200 dark:border-slate-700">
                <p className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-400">Metric Formula</p>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">(International Standard)</p>
                <p className="font-semibold">BMI = weight (kg) / height (m)²</p>
            </div>
         </div>

         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            For example, if you use Imperial units, the calculator multiplies your weight in pounds by 703, then divides that by your height in inches squared. This conversion factor standardizes the result so that a BMI of 25 means the same thing regardless of the units used.
         </p>
      </section>

      <section id="categories" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">BMI Categories</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4">The following categories are based on World Health Organization (WHO) and CDC guidelines for adults:</p>
         <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Below 18.5:</strong> Underweight</li>
            <li><strong>18.5 – 24.9:</strong> Normal weight</li>
            <li><strong>25.0 – 29.9:</strong> Overweight</li>
            <li><strong>30.0 and above:</strong> Obesity</li>
         </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Limitations of BMI</h2>
         <ul className="list-none space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Muscle Mass vs. Fat:</strong> Muscle is denser than fat. A bodybuilder may have a high BMI (classed as obese) due to muscle weight, not excess fat. BMI fails to distinguish body composition.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Bone Density:</strong> Individuals with dense skeletal structures may have a slightly higher BMI that does not reflect unhealthy body fat levels.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Fat Distribution:</strong> BMI does not indicate where fat is carried. Visceral fat (abdominal) is more dangerous than subcutaneous fat, but BMI treats all weight equally.
               </div>
            </li>
         </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text
