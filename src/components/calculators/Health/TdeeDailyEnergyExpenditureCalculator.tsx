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

    if (!age || !weightRaw || !heightCm || age <= 0 || weightRaw <= 0 || heightCm <= 0) {
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
      answer: "Total Daily Energy Expenditure (TDEE) represents the total number of calories your body burns in a day, including all activities such as resting, working, exercising, and digesting food. It reflects your daily energy needs to maintain your current weight." 
    },
    { 
      question: "Which formula is used here?", 
      answer: "This calculator uses the Mifflin-St Jeor equation, a widely accepted method for estimating Basal Metabolic Rate (BMR), which is then multiplied by an activity factor to estimate TDEE. It is considered more accurate than older formulas like Harris-Benedict." 
    },
    { 
      question: "Does muscle mass affect the result?", 
      answer: "Yes, muscle mass significantly influences your metabolic rate because muscle tissue burns more calories at rest compared to fat. Individuals with higher muscle mass typically have a higher TDEE, even if other factors like weight and height are similar." 
    },
    { 
      question: "How should I use this number?", 
      answer: "Your TDEE is your estimated maintenance calorie intake. To lose weight, consume fewer calories than your TDEE; to gain weight, consume more. It helps tailor your diet and exercise plans to meet your health and fitness goals effectively." 
    },
    { 
      question: "Why does age lower the result?", 
      answer: "As we age, our metabolic rate naturally slows down due to loss of muscle mass and hormonal changes. This reduction means older adults generally require fewer calories to maintain their weight compared to younger individuals." 
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
            min="1" 
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
          onClick={() => {}}
          aria-label="Calculate TDEE"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate TDEE
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setInputs({...inputs, age: "", weight: "", heightMetric: "", heightFt: "", heightIn: ""})} 
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
           To accurately estimate your Total Daily Energy Expenditure (TDEE), input your age, biological sex, weight, height, and activity level. Choose your preferred unit system—metric or imperial—and enter your measurements accordingly. Age should be in years, weight in kilograms or pounds, and height in centimeters or feet and inches.
         </p>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
           Select your biological sex as it affects the Basal Metabolic Rate (BMR) calculation. Then, choose your activity level from sedentary to super active, reflecting your typical daily physical activity. This multiplier adjusts your BMR to estimate total calories burned throughout the day.
         </p>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
           After entering all details, click "Calculate TDEE" to see your estimated daily calorie needs. Use the reset button to clear inputs and start over. Remember, this is an estimate; consult a healthcare provider for personalized guidance.
         </p>
      </section>

      <section id="formula" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">The formula behind the math</h2>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
           This calculator uses the Mifflin-St Jeor equation to estimate Basal Metabolic Rate (BMR), which represents the calories your body needs at rest to maintain vital functions like breathing and circulation. The formula differs slightly between men and women to account for physiological differences.
         </p>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
           For men, BMR is calculated as: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5. For women, the formula is the same except the final constant is -161 instead of +5. This difference reflects average variations in body composition and metabolism.
         </p>
         <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
           The Total Daily Energy Expenditure (TDEE) is then calculated by multiplying the BMR by an activity factor that corresponds to your lifestyle. This factor ranges from 1.2 for sedentary individuals to 1.9 for highly active persons, providing a comprehensive estimate of daily calorie needs.
         </p>
      </section>

      <section id="factors" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Factors affecting your result</h2>
         <ul className="list-none space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Muscle Mass:</strong> Muscle tissue is metabolically active and burns more calories at rest than fat. Individuals with higher muscle mass will have a higher BMR and thus a higher TDEE.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Age:</strong> Metabolic rate decreases with age due to loss of muscle mass and hormonal changes, leading to lower calorie requirements.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Activity Level:</strong> Physical activity significantly increases calorie expenditure. More active lifestyles require higher calorie intake to maintain weight.
               </div>
            </li>
            <li className="flex gap-3">
               <Activity className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                 <strong>Body Composition:</strong> Fat percentage and distribution can influence metabolism. Higher fat mass generally lowers metabolic rate compared to muscle mass.
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
             <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block text-lg">
               World Health Organization: Obesity and Overweight
             </a>
             <p className="text-slate-500 text-sm">WHO Fact Sheet, 2021. Provides foundational information on energy balance and metabolic health.</p>
           </li>
           <li className="mb-4">
             <a href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block text-lg">
               Centers for Disease Control and Prevention: Adult BMI Calculator and Guidelines
             </a>
             <p className="text-slate-500 text-sm">CDC, 2022. Discusses energy expenditure and its role in weight management.</p>
           </li>
           <li className="mb-4">
             <a href="https://pubmed.ncbi.nlm.nih.gov/24401268/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline block text-lg">
               Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals.
             </a>
             <p className="text-slate-500 text-sm">American Journal of Clinical Nutrition, 1990. Original publication of the Mifflin-St Jeor equation.</p>
           </li>
         </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE — Total Daily Energy Expenditure Calculator"
      description="Calculate your Total Daily Energy Expenditure (TDEE) using the scientifically validated Mifflin-St Jeor equation. Input your age, sex, weight, height, and activity level to estimate your daily calorie needs for maintenance, weight loss, or gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "Medical Formula", 
        formula: "TDEE = BMR × Activity Factor", 
        variables: [
           { symbol: "BMR", description: "Basal Metabolic Rate (calories burned at rest)" },
           { symbol: "Activity Factor", description: "Multiplier based on physical activity level" }
        ] 
      }}
      example={{ 
        title: "Clinical Example", 
        scenario: "A 30-year-old male weighing 70 kg, 175 cm tall, moderately active (activity factor 1.55).", 
        steps: [
           { label: "Step 1", explanation: "Calculate BMR: (10 × 70) + (6.25 × 175) - (5 × 30) + 5 = 1663.75 calories/day." },
           { label: "Step 2", explanation: "Multiply BMR by activity factor: 1663.75 × 1.55 = 2578 calories/day." } 
        ],
        result: "Estimated TDEE is approximately 2,578 calories per day to maintain current weight." 
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
        {id: "factors", label: "Factors affecting your result"},
        {id: "faq", label: "Frequently asked questions"},
        {id: "references", label: "References & additional resources"}
      ]}
      showTopBanner 
      showSidebar 
      showBottomBanner
    />
  );
}