import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// ATOMIC IMPORTS
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

  // --- LOGIC ENGINE ---
  const results = useMemo(() => {
    // 1. Safe Parsing
    const age = parseFloat(inputs.age);
    const weightRaw = parseFloat(inputs.weight);
    const activity = parseFloat(inputs.activity);
    
    // 2. Height Conversion
    let heightCm = 0;
    if (unit === "metric") {
       heightCm = parseFloat(inputs.heightMetric);
    } else {
       const ft = parseFloat(inputs.heightFt) || 0;
       const inch = parseFloat(inputs.heightIn) || 0;
       heightCm = ((ft * 12) + inch) * 2.54;
    }

    // 3. Weight Conversion
    let weightKg = unit === "metric" ? weightRaw : weightRaw / 2.20462;

    // 4. Validation
    if (!age || !weightRaw || !heightCm || age < 0 || weightRaw < 0 || heightCm < 0) {
       return { value: 0, label: "Enter your details..." };
    }

    // 5. BMR Calculation (Mifflin-St Jeor)
    // Men: 10W + 6.25H - 5A + 5
    // Women: 10W + 6.25H - 5A - 161
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr += (inputs.gender === "male" ? 5 : -161);

    // 6. TDEE
    const tdee = bmr * activity;

    return { 
      value: Math.round(tdee).toLocaleString(), 
      label: "Calories / day (Maintenance)" 
    };
  }, [inputs, unit]);

  // --- CONTENT DATA ---
  const faqs = [
    { question: "What exactly is TDEE?", answer: "Total Daily Energy Expenditure (TDEE) represents the total number of calories your body burns in a 24-hour period. It combines your Basal Metabolic Rate (BMR)—the energy needed for basic survival functions like breathing—with the calories burned through physical activity and the thermic effect of food." },
    { question: "Which formula is used here?", answer: "This calculator uses the Mifflin-St Jeor equation, which is widely considered the most accurate standard for estimating BMR in clinical settings. Studies have shown it often outperforms the older Harris-Benedict equation for modern populations." },
    { question: "Does muscle mass affect the result?", answer: "Yes, significantly. Muscle tissue is more metabolically active than fat tissue, meaning it burns more calories at rest. Standard formulas rely on total body weight, so very muscular individuals might find their actual TDEE is higher than estimated here." },
    { question: "How should I use this number?", answer: "This number is your 'maintenance calories'. To lose weight, a common guideline is to subtract 300-500 calories from your TDEE. To gain muscle, you might add a surplus of 200-300 calories. Always monitor your weight and adjust over time." },
    { question: "Why does age lower the result?", answer: "As we age, our metabolic rate naturally slows down, largely due to a gradual loss of muscle mass (sarcopenia) and hormonal changes. This calculator adjusts for that decline by reducing the calorie estimate as the age input increases." },
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
              <SelectItem value="metric">Metric (kg, cm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, ft/in)</SelectItem>
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
          <Input type="number" value={inputs.age} onChange={(e) => setInputs({...inputs, age: e.target.value})} placeholder="Years" />
        </div>
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Weight</Label>
          <Input type="number" value={inputs.weight} onChange={(e) => setInputs({...inputs, weight: e.target.value})} placeholder={unit === "metric" ? "kg" : "lbs"} />
        </div>
      </div>

      {/* Height Row */}
      <div>
        <Label className="mb-2 block text-slate-700 dark:text-slate-300">Height</Label>
        {unit === "metric" ? (
          <Input type="number" value={inputs.heightMetric} onChange={(e) => setInputs({...inputs, heightMetric: e.target.value})} placeholder="Centimeters (e.g., 175)" />
        ) : (
          <div className="flex gap-4">
            <Input type="number" value={inputs.heightFt} onChange={(e) => setInputs({...inputs, heightFt: e.target.value})} placeholder="Feet" />
            <Input type="number" value={inputs.heightIn} onChange={(e) => setInputs({...inputs, heightIn: e.target.value})} placeholder="Inches" />
          </div>
        )}
      </div>

      {/* Activity Level */}
      <div>
         <Label className="mb-2 block text-slate-700 dark:text-slate-300">Activity Level</Label>
         <Select value={inputs.activity} onValueChange={(v) => setInputs({...inputs, activity: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
               <SelectItem value="1.2">Sedentary (Little or no exercise)</SelectItem>
               <SelectItem value="1.375">Lightly Active (Exercise 1-3 days/week)</SelectItem>
               <SelectItem value="1.55">Moderately Active (Exercise 3-5 days/week)</SelectItem>
               <SelectItem value="1.725">Very Active (Hard exercise 6-7 days/week)</SelectItem>
               <SelectItem value="1.9">Super Active (Physical job or training 2x/day)</SelectItem>
            </SelectContent>
         </Select>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Calculator className="mr-2 h-4 w-4" /> Calculate TDEE
        </Button>
        <Button variant="outline" onClick={() => setInputs({...inputs, age: "", weight: "", heightMetric: "", heightFt: "", heightIn: ""})} className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-200 dark:border-indigo-900 shadow-lg">
              <CardContent className="p-8 text-center">
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Your Estimated TDEE</p>
                 <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50 leading-none">{results.value}</p>
                 <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              </CardContent>
           </Card>
           <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
              <p>This result is an estimate based on the Mifflin-St Jeor equation. For precise medical advice regarding diet or weight loss, please consult a registered dietitian or physician.</p>
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
            Using the TDEE calculator is simple but requires accurate inputs for the best results. Start by selecting your preferred <strong>unit system</strong> (Metric or Imperial). Enter your <strong>age</strong>, <strong>biological sex</strong>, and current <strong>weight</strong>. For height, if you use Imperial units, ensure you enter feet and inches correctly in the separate fields.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            The most critical step is choosing the correct <strong>Activity Level</strong>. Be honest! "Sedentary" applies to most desk jobs. Only choose "Very Active" if you have a physically demanding job or train intensely almost every day. Overestimating activity is the most common reason for inaccurate results.
         </p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            This calculator utilizes the <strong>Mifflin-St Jeor Equation</strong>, derived in 1990. It is widely considered the most reliable formula for determining Basal Metabolic Rate (BMR) in non-obese and obese individuals.
         </p>
         <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg my-6 font-mono text-sm text-slate-800 dark:text-slate-200 overflow-x-auto">
            <p className="font-bold mb-2">The Equations:</p>
            <p>Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
            <p>Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</p>
         </div>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Once BMR is calculated, it is multiplied by an <strong>Activity Factor</strong> (ranging from 1.2 to 1.9) to determine your Total Daily Energy Expenditure (TDEE).
         </p>
      </section>

      <section id="factors" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors affecting your result</h2>
         <ul className="list-none space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                  <strong>Muscle Mass:</strong> Muscle tissue requires more energy to maintain than fat tissue. Two people with the same weight but different body compositions will have different TDEEs.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                  <strong>Age:</strong> Metabolic rate generally decreases by about 1-2% per decade after age 20, largely due to a natural loss of lean muscle mass and hormonal shifts.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                  <strong>Hormones:</strong> Thyroid function (hypothyroidism vs hyperthyroidism) directly regulates metabolism. Conditions like PCOS can also influence energy expenditure.
               </div>
            </li>
         </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
         <ul className="space-y-6">
            {faqs.map((item, i) => (
              <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.answer}</p>
              </li>
            ))}
         </ul>
      </section>

      <section id="references" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & additional resources</h2>
         <ul className="space-y-3">
           <li>
             <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" className="text-blue-600 font-semibold hover:underline block text-lg">
               Mifflin MD, St Jeor ST, et al.
             </a>
             <p className="text-slate-500 text-sm">"A new predictive equation for resting energy expenditure in healthy individuals." American Journal of Clinical Nutrition, 1990.</p>
           </li>
           <li>
             <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" className="text-blue-600 font-semibold hover:underline block text-lg">
               World Health Organization (WHO)
             </a>
             <p className="text-slate-500 text-sm">Guidelines on healthy diet and energy requirements.</p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Calculate exactly how many calories you burn in a day. This TDEE calculator uses the medical-grade Mifflin-St Jeor formula to help you plan your diet for weight loss, maintenance, or muscle gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "Medical Formula", 
        formula: "TDEE = BMR × Activity Factor", 
        variables: [
           { symbol: "BMR", description: "Basal Metabolic Rate (Calories burned at rest)" },
           { symbol: "Activity", description: "Multiplier based on your lifestyle (1.2 to 1.9)" }
        ] 
      }}
      example={{ 
        title: "Clinical Example", 
        scenario: "A 30-year-old male, 175cm tall, weighing 75kg, who exercises 3 times a week (Moderately Active).", 
        steps: [
           { label: "Step 1: Calculate BMR", explanation: "(10 × 75) + (6.25 × 175) - (5 × 30) + 5 = 1,698 kcal/day" },
           { label: "Step 2: Apply Activity Factor", explanation: "1,698 (BMR) × 1.55 (Moderate Exercise) = 2,632 kcal" } 
        ],
        result: "TDEE ≈ 2,632 Calories per day" 
      }}
      relatedCalculators={[{"title":"BMI — Body Mass Index Calculator","url":"/health/bmi-body-mass-index","icon":"⚖️"},{"title":"BMR — Basal Metabolic Rate (Mifflin-St Jeor)","url":"/health/bmr-mifflin-st-jeor","icon":"🔥"},{"title":"Body Fat % (US Navy / 3-sites)","url":"/health/body-fat-us-navy-3-sites","icon":"❤️"},{"title":"Ideal Weight Range (Hamwi/Devine/Miller)","url":"/health/ideal-weight-range-hamwi-devine-miller","icon":"💧"},{"title":"Waist-to-Height Ratio Checker","url":"/health/waist-to-height-ratio","icon":"🥗"},{"title":"Body Surface Area (BSA) Calculator","url":"/health/body-surface-area-bsa","icon":"😴"}]}
      onThisPage={[ 
        {id: "how-to-use", label: "How to use this calculator"},
        {id: "formula", label: "The formula behind the math"},
        {id: "factors", label: "Factors affecting your result"},
        {id: "faq", label: "Frequently asked questions"},
        {id: "references", label: "References & additional resources"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}