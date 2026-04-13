import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, CheckCircle2, Dumbbell } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProteinIntakeByGoalCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({ 
    weight: "",
    goal: "maintain", // maintain, cut, bulk
    activity: "moderate"
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);

    // Validation
    if (!weightRaw || weightRaw <= 0) {
      return { min: 0, max: 0, label: "Enter your weight...", category: "" };
    }

    // Conversion: lbs -> kg
    // If metric, use as is. If imperial, divide by 2.20462
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Protein Factors (grams per kg of bodyweight)
    // Sources: NASM, ACSM, ISSN
    let minFactor = 0.8;
    let maxFactor = 1.0;
    let categoryLabel = "";

    switch (inputs.goal) {
      case "cut":
        // Weight Loss: Higher protein needed to preserve muscle mass in caloric deficit
        // Range: 1.6 - 2.4 g/kg (often higher for athletes)
        minFactor = 1.8;
        maxFactor = 2.4;
        categoryLabel = "Fat Loss / Muscle Preservation";
        break;
      case "bulk":
        // Muscle Gain: Surplus calories + high protein
        // Range: 1.6 - 2.2 g/kg
        minFactor = 1.6;
        maxFactor = 2.2;
        categoryLabel = "Muscle Hypertrophy";
        break;
      case "maintain":
      default:
        // Maintenance / General Health
        // Range: 1.2 - 1.6 g/kg (Active individuals)
        minFactor = 1.2;
        maxFactor = 1.6;
        categoryLabel = "Maintenance & Recovery";
        break;
    }

    // Calculate Range
    const minProtein = Math.round(weightKg * minFactor);
    const maxProtein = Math.round(weightKg * maxFactor);

    return { 
      min: minProtein, 
      max: maxProtein, 
      label: "Daily Protein Target", 
      category: categoryLabel 
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How much protein do I need daily based on my body weight?",
      answer: "The general recommendation is 0.8 grams of protein per kilogram of body weight (or 0.36 grams per pound) for sedentary adults. However, athletes and those engaged in strength training typically need 1.6–2.2 grams per kilogram of body weight daily. For example, a 70 kg (154 lb) sedentary person needs about 56 grams of protein daily, while an athlete of the same weight would need 112–154 grams.",
    },
    {
      question: "Does my activity level affect my protein requirements?",
      answer: "Yes, activity level significantly impacts protein needs. Sedentary individuals require 0.8 g/kg, while endurance athletes need 1.2–1.4 g/kg and strength-training athletes need 1.6–2.2 g/kg of body weight daily. Someone doing moderate cardio 3–4 times weekly should aim for approximately 1.1–1.3 g/kg, whereas competitive powerlifters may require up to 2.2 g/kg.",
    },
    {
      question: "What is the maximum safe amount of protein I can consume daily?",
      answer: "There is no established upper limit for protein intake in healthy individuals with normal kidney function. However, most research suggests that intakes above 2.2 grams per kilogram of body weight provide no additional muscle-building benefits. A 80 kg person consuming 176 grams daily would be at the upper practical limit for muscle synthesis optimization.",
    },
    {
      question: "How do I calculate protein needs if I'm trying to lose weight?",
      answer: "During weight loss, protein intake becomes even more critical to preserve muscle mass. Most experts recommend 1.6–2.2 grams per kilogram of ideal body weight (or 0.73–1.0 grams per pound) during calorie restriction. For a 90 kg person in a caloric deficit, consuming 144–198 grams of protein daily helps maintain lean muscle while losing fat.",
    },
    {
      question: "Should I adjust protein intake based on age?",
      answer: "Adults over 65 years old may benefit from slightly higher protein intake—approximately 1.0–1.2 grams per kilogram of body weight—to combat age-related muscle loss (sarcopenia). A 75-year-old weighing 70 kg would ideally consume 70–84 grams of protein daily compared to the standard 56 grams for younger sedentary adults.",
    },
    {
      question: "What are the best sources of protein for meeting daily targets?",
      answer: "Complete protein sources include chicken breast (31g per 100g), Greek yogurt (10g per 100g), eggs (13g per 100g), and salmon (25g per 100g). Plant-based options include lentils (9g per 100g cooked), tofu (15g per 100g), and chickpeas (19g per 100g cooked). Combining sources ensures you meet daily targets—for example, a 2,000-calorie diet might include 120–150g of protein distributed across 4–5 meals.",
    },
    {
      question: "How accurate is the protein calculator for different body compositions?",
      answer: "The calculator uses body weight as its primary input, but lean muscle mass is more relevant than total body weight for protein calculations. Two 80 kg individuals with different body fat percentages may have different protein needs—someone at 15% body fat may need less than someone at 10% body fat. Consider using lean body weight (total weight minus fat mass) for more personalized results if you know your body composition.",
    },
    {
      question: "Can I consume all my daily protein in one or two meals?",
      answer: "While technically possible, research suggests distributing protein across 4–5 meals (25–40g per meal) optimizes muscle protein synthesis throughout the day. Consuming all 150g of protein in a single meal is less effective than consuming 30–40g at breakfast, lunch, dinner, and two snacks. Most studies show maximum protein synthesis occurs with doses of 20–40 grams per meal for most individuals.",
    },
    {
      question: "Does the calculator account for protein from all sources including supplements?",
      answer: "The calculator provides total daily protein recommendations, which can be met through whole foods, supplements, or a combination of both. A 100g daily target could come from 80g of food-based protein and 20g from a protein shake, or any split that totals 100g. Ensure you log all protein sources—food, powder, and fortified products—to accurately track intake against your calculated goal.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
           <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
           <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Imperial (lbs)</SelectItem>
                <SelectItem value="metric">Metric (kg)</SelectItem>
              </SelectContent>
           </Select>
         </div>

         {/* Inputs */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-slate-700 dark:text-slate-300">Current Weight</Label>
              <Input 
                type="number" 
                value={inputs.weight} 
                onChange={(e) => setInputs({...inputs, weight: e.target.value})} 
                placeholder={unit === "imperial" ? "e.g. 180 lbs" : "e.g. 80 kg"} 
              />
            </div>
            <div>
              <Label className="mb-2 block text-slate-700 dark:text-slate-300">Your Goal</Label>
              <Select value={inputs.goal} onValueChange={(v) => setInputs({...inputs, goal: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintain">Maintain Weight / Health</SelectItem>
                  <SelectItem value="cut">Fat Loss (Cut)</SelectItem>
                  <SelectItem value="bulk">Build Muscle (Bulk)</SelectItem>
                </SelectContent>
              </Select>
            </div>
         </div>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Calculator className="mr-2 h-4 w-4" /> Calculate Protein
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setInputs({ weight: "", goal: "maintain", activity: "moderate" })} 
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
                    <span className="text-xl font-medium text-slate-600 dark:text-slate-400 mt-4">g/day</span>
                 </div>
                 
                 {results.category && (
                    <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                       <Dumbbell className="w-4 h-4 mr-2" />
                       {results.category}
                    </div>
                 )}
              </CardContent>
           </Card>
           
           <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Tip:</strong> Divide this number by your number of meals (e.g., 4) to determine how much protein to eat per sitting.
                Example: {Math.round(results.max / 4)}g per meal.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Protein Intake Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Protein Intake Calculator determines your personalized daily protein requirements based on your body weight, activity level, and fitness goals. Adequate protein is essential for muscle repair and growth, immune function, and overall health. Whether you're an athlete, someone managing weight loss, or maintaining general wellness, this calculator provides science-backed recommendations tailored to your lifestyle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your current body weight (in pounds or kilograms), select your activity level (from sedentary to competitive athlete), and specify your primary goal (muscle gain, weight loss, or general maintenance). These inputs determine your recommended daily protein intake using established nutritional guidelines from organizations like the National Institutes of Health and the International Society of Sports Nutrition.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results show your daily protein goal in grams and provide context on how your recommendation compares to standard guidelines. Use this number as your target intake across all meals and snacks throughout the day. To meet your goal, track your protein consumption using food labels and nutrition databases, aiming to distribute intake evenly across 4–5 meals for optimal muscle protein synthesis.</p>
        </div>
      </section>

      {/* TABLE: Daily Protein Requirements by Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Protein Requirements by Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended daily protein intake in grams per kilogram of body weight based on different activity levels and fitness goals.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (g/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 70 kg Person</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 85 kg Person</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary (little to no exercise)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly active (1-3 days/week moderate exercise)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.1–1.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">77–91g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">94–110g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately active (3-5 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3–1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91–105g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110–128g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Endurance athlete (5-7 days/week cardio)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–1.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84–98g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">102–119g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Strength/resistance training (3-5 days/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6–1.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">112–126g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">136–153g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Competitive athlete/bodybuilder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8–2.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">126–154g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">153–187g</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements may vary based on age, genetics, and individual recovery capacity. Consult a registered dietitian for personalized recommendations.</p>
      </section>

      {/* TABLE: Protein Content in Common Foods */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Protein Content in Common Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table lists the protein content per 100g serving of frequently consumed protein sources to help you meet your daily targets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chicken breast (cooked, skinless)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Salmon (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">208</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Egg (large, whole)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 egg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Greek yogurt (plain, non-fat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">59</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cottage cheese (2% fat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lean ground beef (90/10)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">155</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tuna (canned in water, drained)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">116</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lentils (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">116</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tofu (firm)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chickpeas (cooked)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">269</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Almonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28g (23 nuts)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">164</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whey protein powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30g scoop</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are approximate and may vary by brand, preparation method, and specific cut of meat. All cooked weights are without added oils unless specified.</p>
      </section>

      {/* TABLE: Weekly Protein Intake Goals for Different Scenarios */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weekly Protein Intake Goals for Different Scenarios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows realistic weekly protein consumption targets for common fitness and health scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Protein Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary office worker</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">392g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Casual fitness enthusiast</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">98g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">686g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Marathon training runner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82–95g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">574–665g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Strength training 4x/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">131–148g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">917–1,036g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight loss (moderate deficit)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144–198g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,008–1,386g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Female athlete (soccer, 3x/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84–96g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">588–672g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Male bodybuilder (5-6x/week)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">152–209g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,064–1,463g</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weekly totals assume consistent daily intake. Adjust based on rest days and training intensity variations.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Spread your protein intake evenly across 4–5 meals rather than consuming it all at once—research shows 25–40g per meal optimizes muscle protein synthesis better than single large doses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine incomplete plant-based proteins (beans with rice, or hummus with whole grain bread) to create complete amino acid profiles equivalent to animal-based sources.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual intake for 3–5 days using a food logging app to verify you're meeting your calculated target—many people unknowingly undershoot their goals by 15–25%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase protein intake gradually by 10–15g per week if currently consuming less than your target, allowing your digestive system to adapt and minimizing bloating or discomfort.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using total body weight instead of lean mass</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you have high body fat, calculating protein needs based on total weight overestimates requirements. Someone at 100 kg with 35% body fat has only 65 kg of lean mass and should base calculations on approximately 65 kg, not 100 kg.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for age-related changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adults over 65 need 1.0–1.2 g/kg to combat sarcopenia (muscle loss), but many people continue using the 0.8 g/kg standard for sedentary adults, resulting in insufficient intake for aging muscle preservation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming more protein is always better</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Consuming protein beyond 2.2 g/kg provides no additional muscle-building benefit and may unnecessarily stress kidneys and increase overall calorie intake, potentially hindering fat loss goals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for protein in beverages and fortified foods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people overlook protein from milk, protein-enriched products, and supplements when logging intake, leading to underestimation of actual consumption and potential overcounting from whole foods.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much protein do I need daily based on my body weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The general recommendation is 0.8 grams of protein per kilogram of body weight (or 0.36 grams per pound) for sedentary adults. However, athletes and those engaged in strength training typically need 1.6–2.2 grams per kilogram of body weight daily. For example, a 70 kg (154 lb) sedentary person needs about 56 grams of protein daily, while an athlete of the same weight would need 112–154 grams.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does my activity level affect my protein requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, activity level significantly impacts protein needs. Sedentary individuals require 0.8 g/kg, while endurance athletes need 1.2–1.4 g/kg and strength-training athletes need 1.6–2.2 g/kg of body weight daily. Someone doing moderate cardio 3–4 times weekly should aim for approximately 1.1–1.3 g/kg, whereas competitive powerlifters may require up to 2.2 g/kg.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum safe amount of protein I can consume daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">There is no established upper limit for protein intake in healthy individuals with normal kidney function. However, most research suggests that intakes above 2.2 grams per kilogram of body weight provide no additional muscle-building benefits. A 80 kg person consuming 176 grams daily would be at the upper practical limit for muscle synthesis optimization.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate protein needs if I'm trying to lose weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">During weight loss, protein intake becomes even more critical to preserve muscle mass. Most experts recommend 1.6–2.2 grams per kilogram of ideal body weight (or 0.73–1.0 grams per pound) during calorie restriction. For a 90 kg person in a caloric deficit, consuming 144–198 grams of protein daily helps maintain lean muscle while losing fat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust protein intake based on age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Adults over 65 years old may benefit from slightly higher protein intake—approximately 1.0–1.2 grams per kilogram of body weight—to combat age-related muscle loss (sarcopenia). A 75-year-old weighing 70 kg would ideally consume 70–84 grams of protein daily compared to the standard 56 grams for younger sedentary adults.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the best sources of protein for meeting daily targets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Complete protein sources include chicken breast (31g per 100g), Greek yogurt (10g per 100g), eggs (13g per 100g), and salmon (25g per 100g). Plant-based options include lentils (9g per 100g cooked), tofu (15g per 100g), and chickpeas (19g per 100g cooked). Combining sources ensures you meet daily targets—for example, a 2,000-calorie diet might include 120–150g of protein distributed across 4–5 meals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the protein calculator for different body compositions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses body weight as its primary input, but lean muscle mass is more relevant than total body weight for protein calculations. Two 80 kg individuals with different body fat percentages may have different protein needs—someone at 15% body fat may need less than someone at 10% body fat. Consider using lean body weight (total weight minus fat mass) for more personalized results if you know your body composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I consume all my daily protein in one or two meals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While technically possible, research suggests distributing protein across 4–5 meals (25–40g per meal) optimizes muscle protein synthesis throughout the day. Consuming all 150g of protein in a single meal is less effective than consuming 30–40g at breakfast, lunch, dinner, and two snacks. Most studies show maximum protein synthesis occurs with doses of 20–40 grams per meal for most individuals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for protein from all sources including supplements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides total daily protein recommendations, which can be met through whole foods, supplements, or a combination of both. A 100g daily target could come from 80g of food-based protein and 20g from a protein shake, or any split that totals 100g. Ensure you log all protein sources—food, powder, and fortified products—to accurately track intake against your calculated goal.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://ods.od.nih.gov/Health_Information/Dietary_Reference_Intakes.aspx" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institutes of Health (NIH) — Dietary Reference Intakes</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. government guidelines for recommended dietary protein intake based on age, sex, and life stage.</p>
          </li>
          <li>
            <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Sports Nutrition (ISSN) — Position Stand on Protein</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for protein intake in athletes and active individuals engaged in resistance training.</p>
          </li>
          <li>
            <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA FoodData Central — Nutritional Information Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive U.S. government database of protein content and complete nutritional profiles for thousands of foods.</p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Sports Medicine (ACSM) — Sports Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing evidence-based nutritional recommendations for athletic performance and recovery.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Protein Intake Calculator"
      description="Calculate exactly how much protein you need daily to build muscle, lose fat, or maintain health. Based on scientific guidelines for your specific body weight and fitness goal."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ 
        title: "The Logic", 
        formula: "Daily Protein = Weight (kg) × Goal Factor", 
        variables: [
           { symbol: "Weight", description: "Your body weight converted to kg" },
           { symbol: "Goal Factor", description: "Multiplier based on activity (e.g., 2.0 for cutting)" }
        ] 
      }}
      example={{ 
        title: "Example Calculation", 
        scenario: "A 180 lbs (81.6 kg) male wanting to build muscle (Bulk).",
        steps: [
           { label: "Step 1", explanation: "Convert weight: 180 lbs ÷ 2.2 = 81.6 kg" },
           { label: "Step 2", explanation: "Apply Bulk Factor (1.6 - 2.2): 81.6 × 2.0 = 163g" }
        ],
        result: "Target approximately 163g of protein per day."
      }}
      relatedCalculators={[
        {title:"TDEE — Total Daily Energy Expenditure",url:"/health/tdee-daily-energy-expenditure",icon:"🔥"},
        {title:"Macro Split Planner",url:"/health/macro-split-planner",icon:"🥗"},
        {title:"BMI — Body Mass Index",url:"/health/bmi-body-mass-index",icon:"⚖️"},
        {title:"Body Fat % (US Navy)",url:"/health/body-fat-us-navy-3-sites",icon:"💪"},
        {title:"Water Intake Calculator",url:"/health/water-intake-per-day",icon:"💧"},
        {title:"Ideal Weight Range",url:"/health/ideal-weight-range-hamwi-devine-miller",icon:"❤️"}
      ]}
      onThisPage={[ 
        {id: "what-is", label: "What is Protein Intake?"},
        {id: "how-to-use", label: "How to Use This Calculator"},
        {id: "faq", label: "Frequently Asked Questions"},
        {id: "references", label: "Trusted References"}
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
