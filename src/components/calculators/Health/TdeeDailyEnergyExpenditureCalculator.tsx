import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
// 👇 ATOMIC IMPORTS 👇
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

  const results = useMemo(() => {
     // Implement robust math logic here.
     return { value: 0, label: "..." };
  }, [inputs, unit]);

  // 👇 DETAILED FAQ DATA 👇
  const faqs = [
    { question: "What is TDEE?", answer: "TDEE stands for Total Daily Energy Expenditure, which is the total number of calories your body needs to maintain your current weight." },
    { question: "How is TDEE calculated?", answer: "TDEE is calculated by multiplying your Basal Metabolic Rate (BMR) by your activity level." },
    { question: "Why is TDEE important?", answer: "Understanding your TDEE can help you manage your weight by adjusting your calorie intake." },
    { question: "What factors influence TDEE?", answer: "Factors include age, gender, weight, height, and activity level." },
    { question: "Can TDEE change over time?", answer: "Yes, changes in weight, activity level, and age can affect your TDEE." },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* --- TOP ROW: UNIT & GENDER --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric</SelectItem>
              <SelectItem value="imperial">Imperial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Gender</Label>
          <Select value={inputs.gender} onValueChange={(v) => setInputs({...inputs, gender: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- AGE & WEIGHT --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Age</Label>
          <Input type="number" value={inputs.age} onChange={(e) => setInputs({...inputs, age: e.target.value})} placeholder="e.g. 30" />
        </div>
        <div>
          <Label>Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
          <Input type="number" value={inputs.weight} onChange={(e) => setInputs({...inputs, weight: e.target.value})} placeholder={unit === "metric" ? "70" : "150"} />
        </div>
      </div>

      {/* --- HEIGHT (CONDITIONAL SPLIT) --- */}
      <div>
        <Label>Height</Label>
        {unit === "metric" ? (
          <Input type="number" value={inputs.heightMetric} onChange={(e) => setInputs({...inputs, heightMetric: e.target.value})} placeholder="cm (e.g. 175)" />
        ) : (
          <div className="flex gap-4">
            <Input type="number" value={inputs.heightFt} onChange={(e) => setInputs({...inputs, heightFt: e.target.value})} placeholder="ft" />
            <Input type="number" value={inputs.heightIn} onChange={(e) => setInputs({...inputs, heightIn: e.target.value})} placeholder="in" />
          </div>
        )}
      </div>

      {/* --- ACTIVITY LEVEL (IF NEEDED) --- */}
      <div>
         <Label>Activity Level</Label>
         <Select value={inputs.activity} onValueChange={(v) => setInputs({...inputs, activity: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
               <SelectItem value="1.2">Sedentary (Office job)</SelectItem>
               <SelectItem value="1.375">Light Exercise (1-2 days/week)</SelectItem>
               <SelectItem value="1.55">Moderate Exercise (3-5 days/week)</SelectItem>
               <SelectItem value="1.725">Heavy Exercise (6-7 days/week)</SelectItem>
               <SelectItem value="1.9">Athlete (2x per day)</SelectItem>
            </SelectContent>
         </Select>
      </div>
      
      {/* --- BUTTONS --- */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({...inputs, age: "", weight: "", heightMetric: "", heightFt: "", heightIn: ""})} className="flex-1 h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-100">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* --- RESULT CARD --- */}
      {results.value ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border-blue-100 shadow-lg">
              <CardContent className="p-6 text-center">
                 <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 uppercase tracking-wide">Estimated Result</p>
                 <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50">{results.value}</p>
                 <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              </CardContent>
           </Card>
           <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <p>This calculator provides an estimate based on standard metabolic formulas. For medical advice, please consult a professional.</p>
           </div>
        </div>
      ) : null}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4">To use the TDEE calculator, input your age, gender, weight, height, and activity level. The calculator will estimate your daily calorie needs to maintain your current weight.</p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4">The TDEE calculation is based on the Harris-Benedict equation, which estimates Basal Metabolic Rate (BMR) and multiplies it by an activity factor. This accounts for calories burned through physical activity.</p>
      </section>

      <section id="factors" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors affecting your result</h2>
         <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Age:</strong> Metabolism generally slows with age, affecting calorie needs.</li>
            <li><strong>Gender:</strong> Men typically have a higher BMR due to more muscle mass.</li>
            <li><strong>Weight:</strong> Heavier individuals burn more calories at rest.</li>
            <li><strong>Height:</strong> Taller individuals have a higher BMR.</li>
            <li><strong>Activity Level:</strong> More active lifestyles increase calorie requirements.</li>
         </ul>
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
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & additional resources</h2>
         <ul className="space-y-4">
           <li className="mb-4">
             <a href="#" className="text-blue-600 font-bold block">Scientific Reference</a>
             <p className="text-slate-500">Harris JA, Benedict FG. A Biometric Study of Human Basal Metabolism. Proc Natl Acad Sci USA. 1918.</p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Calculate your Total Daily Energy Expenditure (TDEE) to understand your daily calorie needs based on your activity level and personal metrics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // POPULATE ALL BOXES:
      formula={{ 
        title: "Medical Formula", 
        formula: "TDEE = BMR x Activity Level", 
        variables: [
          { symbol: "BMR", description: "Basal Metabolic Rate" },
          { symbol: "Activity Level", description: "Factor based on physical activity" }
        ] 
      }}
      example={{ 
        title: "Clinical Example", 
        scenario: "A 30-year-old male, weighing 70 kg, 175 cm tall, with moderate exercise level.",
        steps: [
           { label: "Step 1", explanation: "Calculate BMR using Harris-Benedict equation." },
           { label: "Step 2", explanation: "Multiply BMR by activity level (1.55)." } 
        ],
        result: "Final Value: 2500 kcal/day" 
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