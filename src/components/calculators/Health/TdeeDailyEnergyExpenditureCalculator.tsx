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
  const [unit, setUnit] = useState("imperial");
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
    const weightKg = unit === "metric" ? weightRaw : weightRaw / 2.20462;

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
      question: "What is TDEE and why should I calculate it?",
      answer: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a 24-hour period, including basal metabolic rate (BMR) and activity level. Calculating your TDEE is essential for weight management because it tells you how many calories you need to maintain, lose, or gain weight. For example, if your TDEE is 2,500 calories and you consume 2,000 calories daily, you'll create a 500-calorie deficit and lose approximately 1 pound per week.",
    },
    {
      question: "How accurate is the TDEE calculator?",
      answer: "The TDEE calculator is generally accurate within ±10-20% when using standard formulas like Mifflin-St Jeor or Harris-Benedict equations. However, accuracy depends on correct input of age, weight, height, sex, and activity level. Individual variations in metabolism, muscle mass, and hormonal factors can cause real TDEE to differ from calculated estimates. For the most accurate results, track your actual weight changes over 3-4 weeks and adjust calorie intake accordingly.",
    },
    {
      question: "What activity levels should I select for my TDEE calculation?",
      answer: "Activity levels typically range from sedentary (1.2 multiplier) to very active (1.9 multiplier). Sedentary means little to no exercise, lightly active involves 1-3 days of exercise weekly, moderately active means 3-5 days weekly, very active means 6-7 days weekly, and extremely active includes athletes or physical jobs. Most people fall into the lightly active to moderately active categories, with multipliers between 1.375 and 1.55.",
    },
    {
      question: "How do I use my TDEE to lose weight safely?",
      answer: "To lose weight safely, create a calorie deficit of 300-500 calories below your TDEE, which results in losing 0.5-1 pound per week. For example, if your TDEE is 2,200 calories, consuming 1,700-1,900 calories daily is a sustainable deficit. Avoid deficits exceeding 1,000 calories daily, as this can slow metabolism and cause muscle loss. Combine calorie reduction with resistance training to preserve muscle mass during weight loss.",
    },
    {
      question: "What's the difference between TDEE and BMR?",
      answer: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest, typically accounting for 60-75% of total TDEE in sedentary individuals. TDEE includes BMR plus calories burned through digestion (10% of TDEE) and physical activity (15-30% of TDEE). For a person with a BMR of 1,500 calories and a sedentary lifestyle, TDEE would be approximately 1,800 calories, but the same person exercising regularly could have a TDEE of 2,400 calories.",
    },
    {
      question: "How often should I recalculate my TDEE?",
      answer: "Recalculate your TDEE every 10-15 pounds of weight change, as your metabolic rate adjusts with your body composition. When you lose weight, your TDEE decreases because there's less body mass to maintain. For example, a person losing 20 pounds might see their TDEE drop by 100-150 calories. Additionally, recalculate if your activity level changes significantly or after extended periods of calorie restriction to ensure continued progress.",
    },
    {
      question: "Does muscle mass affect TDEE calculations?",
      answer: "Yes, muscle mass significantly affects TDEE because muscle tissue is metabolically active and burns more calories at rest than fat tissue. A person with 25% body fat has a higher TDEE than someone of the same weight with 35% body fat, potentially differing by 100-200 calories daily. Standard TDEE calculators estimate based on total body weight and don't account for body composition, so very muscular or very overweight individuals may need to adjust results by ±10-15%.",
    },
    {
      question: "Can I gain weight using the TDEE calculator?",
      answer: "Yes, you can use TDEE to gain weight by consuming more calories than your calculated expenditure. To gain approximately 0.5-1 pound per week, add 250-500 calories to your TDEE. For example, if your TDEE is 2,300 calories, consuming 2,800 calories daily will create a surplus. Combine this surplus with strength training to maximize muscle gain rather than fat gain, aiming for a 40/60 ratio of lean mass to fat gain.",
    },
    {
      question: "What factors can change my TDEE throughout the day?",
      answer: "Several factors dynamically affect TDEE including meal timing (thermic effect of food varies), sleep quality (poor sleep reduces calorie burn by 5-10%), stress levels (cortisol affects metabolism), temperature (cold exposure increases calorie burn), and menstrual cycle in women (TDEE increases 100-300 calories during the luteal phase). These fluctuations explain why TDEE is an average estimate rather than a fixed daily number, and why tracking weight trends over weeks is more reliable than daily measurements.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the TDEE — Total Daily Energy Expenditure Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The TDEE calculator determines the total number of calories your body burns daily, which is the foundation for creating effective nutrition and fitness plans. Whether you want to lose weight, gain muscle, or maintain your current physique, knowing your TDEE helps you set appropriate calorie targets. This calculator uses scientifically-backed formulas like Mifflin-St Jeor to provide accurate estimates based on your individual characteristics.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To calculate your TDEE, you'll need to input your age, biological sex, current weight, height, and your typical activity level throughout the week. Activity level is crucial because it determines your total energy expenditure beyond resting metabolism—a sedentary office worker will have a significantly lower TDEE than a construction worker or athlete. Be honest about your activity level to avoid overestimating or underestimating your calorie needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive your TDEE result, use it to guide your calorie intake goals: consume fewer calories than your TDEE to lose weight (typically a 300-500 calorie deficit), match your TDEE to maintain weight, or exceed your TDEE to gain weight. Remember that TDEE is an estimate with a margin of error of ±10-20%, so track your actual results over 3-4 weeks and adjust your intake if progress stalls. Recalculate your TDEE every 10-15 pounds of weight change since your metabolic needs shift with your body composition.</p>
        </div>
      </section>

      {/* TABLE: TDEE Multipliers by Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">TDEE Multipliers by Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the standard activity multipliers used to calculate TDEE from basal metabolic rate across different lifestyle categories.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Definition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example TDEE (1,500 BMR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Little or no exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 1-3 days per week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,062 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 3-5 days per week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,325 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 6-7 days per week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,587 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extremely Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Physical job or intense training</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,850 calories</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers are applied to BMR calculated using the Mifflin-St Jeor equation. Actual TDEE varies based on individual metabolism and body composition.</p>
      </section>

      {/* TABLE: Weekly Weight Change Based on Calorie Deficit or Surplus */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weekly Weight Change Based on Calorie Deficit or Surplus</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates the relationship between daily calorie surplus or deficit and projected weekly weight changes in pounds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Deficit/Surplus</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Total</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Weekly Weight Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Monthly Weight Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250 calories deficit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,750 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5 lbs loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 lbs loss</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500 calories deficit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 lb loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 lbs loss</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750 calories deficit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,250 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 lbs loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 lbs loss</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000 calories deficit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,000 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 lbs loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 lbs loss</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250 calories surplus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,750 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5 lbs gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 lbs gain</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500 calories surplus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 lb gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 lbs gain</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on the principle that 3,500 calories equals approximately 1 pound of body weight. Individual results vary based on metabolism and body composition changes.</p>
      </section>

      {/* TABLE: Estimated BMR by Age, Sex, and Weight Using Mifflin-St Jeor Equation */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated BMR by Age, Sex, and Weight Using Mifflin-St Jeor Equation</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides example BMR estimates for different demographic groups, which form the foundation for TDEE calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Profile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated BMR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Male</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5'10"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,775 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Female</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">145 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5'5"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Male</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5'10"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,695 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Female</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">145 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5'5"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,310 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Young Male</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5'9"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,685 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Young Female</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5'4"</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,250 calories</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">BMR decreases approximately 2-8% per decade after age 30. These estimates assume average body composition; muscular individuals will have higher BMR.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual weight changes weekly for 3-4 weeks to validate your calculated TDEE, then adjust calorie intake up or down by 100-200 calories if progress doesn't match expectations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include resistance training in your activity calculation—strength training preserves muscle mass during weight loss and increases daily energy expenditure by engaging muscle tissue even at rest.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for seasonal variations in activity level by recalculating TDEE when your exercise routine changes significantly, such as switching from winter indoor training to summer outdoor activities.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your TDEE as a starting point, not a permanent target—factors like stress, sleep quality, hormonal fluctuations, and changes in body composition require periodic adjustments to maintain steady progress toward your goals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Selecting an Inaccurate Activity Level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overestimating activity level is the most common error, leading people to believe they burn more calories than they actually do. If you select 'very active' but only exercise 3 days per week, your calculated TDEE could be 200-300 calories higher than reality, stalling weight loss progress.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Body Composition Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Standard TDEE calculators don't account for muscle-to-fat ratio, so very muscular individuals may have higher actual TDEE than calculated, while those with high body fat may have lower TDEE. Adjusting the result by ±10% for your body composition improves accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Creating an Unsustainable Calorie Deficit</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Consuming far below your TDEE (exceeding 1,000 calories daily deficit) causes metabolic adaptation, muscle loss, and increased hunger, making the approach unsustainable. A 300-500 calorie deficit producing 0.5-1 pound weekly loss is more maintainable and preserves muscle mass.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Recalculating After Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to update your TDEE calculation as your weight changes leads to miscalibrated targets—a person who has lost 20 pounds needs 100-150 fewer calories daily than when they were heavier. Recalculate every 10-15 pounds to maintain consistent progress.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is TDEE and why should I calculate it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a 24-hour period, including basal metabolic rate (BMR) and activity level. Calculating your TDEE is essential for weight management because it tells you how many calories you need to maintain, lose, or gain weight. For example, if your TDEE is 2,500 calories and you consume 2,000 calories daily, you'll create a 500-calorie deficit and lose approximately 1 pound per week.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the TDEE calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The TDEE calculator is generally accurate within ±10-20% when using standard formulas like Mifflin-St Jeor or Harris-Benedict equations. However, accuracy depends on correct input of age, weight, height, sex, and activity level. Individual variations in metabolism, muscle mass, and hormonal factors can cause real TDEE to differ from calculated estimates. For the most accurate results, track your actual weight changes over 3-4 weeks and adjust calorie intake accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activity levels should I select for my TDEE calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Activity levels typically range from sedentary (1.2 multiplier) to very active (1.9 multiplier). Sedentary means little to no exercise, lightly active involves 1-3 days of exercise weekly, moderately active means 3-5 days weekly, very active means 6-7 days weekly, and extremely active includes athletes or physical jobs. Most people fall into the lightly active to moderately active categories, with multipliers between 1.375 and 1.55.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use my TDEE to lose weight safely?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To lose weight safely, create a calorie deficit of 300-500 calories below your TDEE, which results in losing 0.5-1 pound per week. For example, if your TDEE is 2,200 calories, consuming 1,700-1,900 calories daily is a sustainable deficit. Avoid deficits exceeding 1,000 calories daily, as this can slow metabolism and cause muscle loss. Combine calorie reduction with resistance training to preserve muscle mass during weight loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between TDEE and BMR?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMR (Basal Metabolic Rate) is the number of calories your body burns at rest, typically accounting for 60-75% of total TDEE in sedentary individuals. TDEE includes BMR plus calories burned through digestion (10% of TDEE) and physical activity (15-30% of TDEE). For a person with a BMR of 1,500 calories and a sedentary lifestyle, TDEE would be approximately 1,800 calories, but the same person exercising regularly could have a TDEE of 2,400 calories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my TDEE?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your TDEE every 10-15 pounds of weight change, as your metabolic rate adjusts with your body composition. When you lose weight, your TDEE decreases because there's less body mass to maintain. For example, a person losing 20 pounds might see their TDEE drop by 100-150 calories. Additionally, recalculate if your activity level changes significantly or after extended periods of calorie restriction to ensure continued progress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does muscle mass affect TDEE calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, muscle mass significantly affects TDEE because muscle tissue is metabolically active and burns more calories at rest than fat tissue. A person with 25% body fat has a higher TDEE than someone of the same weight with 35% body fat, potentially differing by 100-200 calories daily. Standard TDEE calculators estimate based on total body weight and don't account for body composition, so very muscular or very overweight individuals may need to adjust results by ±10-15%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I gain weight using the TDEE calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can use TDEE to gain weight by consuming more calories than your calculated expenditure. To gain approximately 0.5-1 pound per week, add 250-500 calories to your TDEE. For example, if your TDEE is 2,300 calories, consuming 2,800 calories daily will create a surplus. Combine this surplus with strength training to maximize muscle gain rather than fat gain, aiming for a 40/60 ratio of lean mass to fat gain.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors can change my TDEE throughout the day?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Several factors dynamically affect TDEE including meal timing (thermic effect of food varies), sleep quality (poor sleep reduces calorie burn by 5-10%), stress levels (cortisol affects metabolism), temperature (cold exposure increases calorie burn), and menstrual cycle in women (TDEE increases 100-300 calories during the luteal phase). These fluctuations explain why TDEE is an average estimate rather than a fixed daily number, and why tracking weight trends over weeks is more reliable than daily measurements.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/13050/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Reference Intakes (DRI) by the National Academies of Sciences</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidelines on daily energy requirements and nutritional needs established by the National Academies of Sciences.</p>
          </li>
          <li>
            <a href="https://health.gov/sites/default/files/2019-09/PAG_Executive_Summary.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Physical Activity Guidelines for Americans by the U.S. Department of Health and Human Services</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government recommendations on activity levels and exercise frequency to support overall health and metabolic function.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/books/NBK551170/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Resting Metabolic Rate and Thermic Effect of Food Research by the National Institutes of Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific evidence and research on how basal metabolic rate and dietary thermogenesis contribute to total daily energy expenditure.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/healthyweight/calorie_needs/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Weight Management and Energy Balance Guidelines by the Centers for Disease Control and Prevention</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CDC guidelines on understanding calorie needs, activity levels, and safe approaches to weight management based on TDEE principles.</p>
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
