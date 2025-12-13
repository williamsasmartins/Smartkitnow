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
      question: "Why do I need more protein when cutting?", 
      answer: "When you are in a calorie deficit to lose fat, your body may break down muscle tissue for energy. Eating higher protein (1.8-2.4g/kg) signals your body to preserve muscle mass while burning fat stores instead." 
    },
    { 
      question: "Is there a limit to how much protein I can absorb?", 
      answer: "While the '30g per meal' limit is a myth, total daily intake matters most. However, spreading your protein across 3-5 meals (e.g., 30-50g per meal) optimizes muscle protein synthesis better than eating it all at once." 
    },
    { 
      question: "Does activity level affect my protein needs?", 
      answer: "Yes. Sedentary individuals need less protein (approx. 0.8g/kg) to prevent deficiency. Athletes and active people need significantly more to repair tissue damaged during exercise and support recovery." 
    },
    { 
      question: "Should I count plant-based protein?", 
      answer: "Yes, all protein counts. However, plant sources are often 'incomplete' (missing some amino acids). If you are vegan, aim for the higher end of the recommended range and eat a variety of sources." 
    },
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
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">What is Optimal Protein Intake?</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            Protein is a macronutrient essential for building muscle tissue, repairing cells, and regulating hormones. Unlike fat and carbohydrates, the body does not store protein for later use, meaning you must consume it consistently throughout the day to support bodily functions.
         </p>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Your "optimal" intake depends heavily on your goals. The standard Recommended Dietary Allowance (RDA) is merely the minimum to prevent deficiency (0.8g/kg). However, for active individuals, athletes, or those seeking weight management, scientific guidelines suggest significantly higher intakes to optimize muscle protein synthesis and satiety.
         </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
         <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
         <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            To get a personalized recommendation, simply enter your current weight and select your primary fitness goal. The calculator adjusts the math based on whether you want to burn fat, build muscle, or just stay healthy.
         </p>
         <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Maintain:</strong> Calculates protein based on general health and moderate activity guidelines (1.2-1.6g/kg).</li>
            <li><strong>Fat Loss (Cut):</strong> Uses a higher multiplier (1.8-2.4g/kg) to protect muscle mass while you are in a calorie deficit.</li>
            <li><strong>Build Muscle (Bulk):</strong> Targets the optimal range for hypertrophy (1.6-2.2g/kg) to support tissue growth.</li>
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
             <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5852756/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               1. International Society of Sports Nutrition (ISSN)
             </a>
             <p className="text-slate-500 text-sm mt-1">Position Stand: Protein and Exercise. Guidelines for optimal intake for active individuals.</p>
           </li>
           <li className="block">
             <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               2. American College of Sports Medicine (ACSM)
             </a>
             <p className="text-slate-500 text-sm mt-1">Nutrition and Athletic Performance guidelines regarding macronutrient distribution.</p>
           </li>
           <li className="block">
             <a href="https://examine.com/guides/protein-intake/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               3. Examine.com: Optimal Protein Intake
             </a>
             <p className="text-slate-500 text-sm mt-1">Evidence-based analysis of protein requirements for different goals.</p>
           </li>
           <li className="block">
             <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
               4. Jager et al. (2017)
             </a>
             <p className="text-slate-500 text-sm mt-1">International Society of Sports Nutrition Position Stand: protein and exercise.</p>
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
