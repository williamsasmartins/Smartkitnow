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

export default function BmiBodyMassIndexCalculator() {
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
    const age = parseFloat(inputs.age);
    const weightRaw = parseFloat(inputs.weight);
    const activity = parseFloat(inputs.activity);
    
    // Height Conversion
    let heightCm = 0;
    if (unit === "metric") {
       heightCm = parseFloat(inputs.heightMetric);
    } else {
       const ft = parseFloat(inputs.heightFt) || 0;
       const inch = parseFloat(inputs.heightIn) || 0;
       heightCm = ((ft * 12) + inch) * 2.54;
    }

    // Weight Conversion
    let weightKg = unit === "metric" ? weightRaw : weightRaw / 2.20462;

    if (!age || !weightRaw || !heightCm || age < 0 || weightRaw < 0 || heightCm < 0) {
       return { value: 0, label: "Enter your details..." };
    }

    // BMR Calculation (Mifflin-St Jeor)
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    bmr += (inputs.gender === "male" ? 5 : -161);

    const tdee = bmr * activity;

    return { 
      value: Math.round(tdee).toLocaleString(), 
      label: "Calories / day (Maintenance)" 
    };
  }, [inputs, unit]);

  // --- CONTENT DATA ---
  const faqs = [
    { 
      question: "What exactly is TDEE?", 
      answer: "Total Daily Energy Expenditure (TDEE) represents the total number of calories your body burns in a day, including all activities and bodily functions. It combines your Basal Metabolic Rate (BMR) with physical activity levels to estimate daily energy needs for maintenance." 
    },
    { 
      question: "Which formula is used here?", 
      answer: "This calculator uses the Mifflin-St Jeor equation, a widely accepted formula for estimating Basal Metabolic Rate (BMR). It factors in weight, height, age, and gender, then multiplies by an activity factor to estimate Total Daily Energy Expenditure (TDEE)." 
    },
    { 
      question: "Does muscle mass affect the result?", 
      answer: "Yes, muscle mass significantly influences metabolic rate because muscle tissue burns more calories at rest than fat. Individuals with higher muscle mass typically have a higher BMR and thus a higher TDEE, which may not be fully captured by this formula alone." 
    },
    { 
      question: "How should I use this number?", 
      answer: "Your TDEE is an estimate of how many calories you need daily to maintain your current weight. Use it as a baseline for adjusting calorie intake for weight loss, gain, or maintenance, combined with professional advice and monitoring." 
    },
    { 
      question: "Why does age lower the result?", 
      answer: "As we age, metabolic rate naturally slows due to loss of muscle mass and hormonal changes. The formula accounts for this by subtracting calories based on age, reflecting decreased energy requirements over time." 
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
          <Input 
            type="number" 
            min="0" 
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
            min="0" 
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
            min="0" 
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
              value={inputs.heightIn} 
              onChange={(e) => setInputs({...inputs, heightIn: e.target.value})} 
              placeholder="Inches" 
              aria-label="Height in inches"
            />
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
      
      {/* Buttons - FIXED RESET HOVER STYLE */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => { /* Calculation is automatic, no action needed */ }}
          aria-label="Calculate TDEE"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate TDEE
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setInputs({age: "", weight: "", heightMetric: "", heightFt: "", heightIn: "", gender: "male", activity: "1.2"})} 
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
                 <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Your Estimated TDEE</p>
                 <p className="text-5xl font-extrabold text-blue-900 dark:text-blue-50 leading-none">{results.value}</p>
                 <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              </CardContent>
           </Card>
           <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 text-xs text-slate-500 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
              <p>This result is an estimate based on the Mifflin-St Jeor equation. Consult a healthcare professional for personalized advice.</p>
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
            To accurately estimate your Total Daily Energy Expenditure (TDEE), input your age, biological sex, weight, height, and activity level. Choose between metric or imperial units for convenience. Age and sex influence your basal metabolic rate, while weight and height are essential for calculating your body's energy needs.
         </p>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            Select your activity level based on your typical daily routine, ranging from sedentary to super active. This factor adjusts your basal metabolic rate to reflect calories burned through physical activity. The calculator then provides an estimate of the calories you need daily to maintain your current weight.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Use the reset button to clear all inputs and start fresh. The calculation updates automatically as you enter your data, ensuring a seamless and interactive experience. Always consult a healthcare professional before making significant changes to your diet or exercise routine.
         </p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            This calculator uses the Mifflin-St Jeor equation to estimate Basal Metabolic Rate (BMR), which is the number of calories your body needs at rest to maintain vital functions such as breathing, circulation, and cell production. The formula accounts for weight, height, age, and biological sex, providing a personalized estimate.
         </p>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            The Mifflin-St Jeor equation is expressed as: For men, BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5. For women, BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161. This difference reflects physiological variations between sexes.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            To estimate Total Daily Energy Expenditure (TDEE), the BMR is multiplied by an activity factor representing your lifestyle and exercise habits. This multiplier ranges from 1.2 for sedentary individuals to 1.9 for highly active people, providing a comprehensive daily calorie requirement estimate.
         </p>
      </section>

      <section id="factors" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors affecting your result</h2>
         <ul className="list-none space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Muscle Mass:</strong> Muscle tissue burns more calories at rest than fat, so individuals with higher muscle mass typically have a higher metabolic rate. This calculator estimates average values and may not fully capture variations due to muscle mass.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Age:</strong> Metabolic rate declines with age due to hormonal changes and loss of muscle mass. The formula adjusts for this by subtracting calories based on age, reflecting decreased energy needs over time.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Activity Level:</strong> Physical activity significantly increases daily calorie expenditure. Selecting an accurate activity multiplier is crucial for a realistic TDEE estimate.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Genetics and Health Conditions:</strong> Individual metabolic rates can vary due to genetics, thyroid function, and other health factors, which this formula cannot fully account for.
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
           <li className="mb-4">
             <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block text-lg">
               World Health Organization: Healthy Diet Fact Sheet
             </a>
             <p className="text-slate-500 text-sm">
               WHO provides guidelines on nutrition and energy requirements, emphasizing the importance of balanced calorie intake for health maintenance.
             </p>
           </li>
           <li className="mb-4">
             <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block text-lg">
               Centers for Disease Control and Prevention: About Adult BMI
             </a>
             <p className="text-slate-500 text-sm">
               CDC explains BMI and related metabolic calculations, highlighting their role in assessing health risks.
             </p>
           </li>
           <li className="mb-4">
             <a href="https://pubmed.ncbi.nlm.nih.gov/11882538/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block text-lg">
               Mifflin MD et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals.
             </a>
             <p className="text-slate-500 text-sm">
               This seminal study introduces the Mifflin-St Jeor equation, demonstrating its accuracy compared to previous formulas.
             </p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BMI — Body Mass Index Calculator"
      description="Calculate your Total Daily Energy Expenditure (TDEE) using the scientifically validated Mifflin-St Jeor equation. Input your age, sex, weight, height, and activity level to get a personalized estimate of daily calories needed for maintenance. Ideal for health professionals and individuals seeking accurate metabolic insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "Medical Formula", 
        formula: "TDEE = BMR × Activity Factor", 
        variables: [
           { symbol: "BMR", description: "Basal Metabolic Rate calculated by Mifflin-St Jeor equation" },
           { symbol: "Activity Factor", description: "Multiplier based on physical activity level" }
        ] 
      }}
      example={{ 
        title: "Clinical Example", 
        scenario: "A 30-year-old male weighing 70 kg, 175 cm tall, with moderate activity level.",
        steps: [
           { label: "Step 1", explanation: "Calculate BMR: (10 × 70) + (6.25 × 175) - (5 × 30) + 5 = 1663.75 calories/day." },
           { label: "Step 2", explanation: "Apply Activity Factor (1.55 for moderate activity): 1663.75 × 1.55 = 2578 calories/day." } 
        ],
        result: "Estimated TDEE is approximately 2578 calories per day."
      }}
      relatedCalculators={[
        {title:"BMR — Basal Metabolic Rate (Mifflin-St Jeor)",url:"/health/bmr-mifflin-st-jeor",icon:"⚖️"},
        {title:"TDEE — Total Daily Energy Expenditure Calculator",url:"/health/tdee-daily-energy-expenditure",icon:"🔥"},
        {title:"Body Fat % (US Navy / 3-sites)",url:"/health/body-fat-us-navy-3-sites",icon:"❤️"},
        {title:"Ideal Weight Range (Hamwi/Devine/Miller)",url:"/health/ideal-weight-range-hamwi-devine-miller",icon:"💧"},
        {title:"Waist-to-Height Ratio Checker",url:"/health/waist-to-height-ratio",icon:"🥗"},
        {title:"Body Surface Area (BSA) Calculator",url:"/health/body-surface-area-bsa",icon:"😴"}
      ]}
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