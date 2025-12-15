import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalCalciumIntakeLimitCalculator() {
  // 1. STATE
  // Unit system: Imperial (lbs) or Metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Calcium Intake Limit (mg/day) = 70 mg/kg * weight in kg
  // Source: Veterinary nutritional guidelines for bladder stone prevention
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate calcium intake limit in mg/day
    // 70 mg calcium per kg body weight per day is a commonly recommended safe upper limit to reduce bladder stone risk
    const calciumLimitMg = Math.round(70 * weightKg);

    return {
      value: calciumLimitMg.toLocaleString(),
      label: "Maximum Daily Calcium Intake (mg)",
      subtext:
        "This limit helps reduce the risk of calcium-containing bladder stones by avoiding excessive calcium intake.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is limiting calcium intake important for bladder stone prevention?",
      answer:
        "Excessive calcium intake can lead to supersaturation of urine with calcium salts, which promotes the formation of bladder stones. By limiting calcium intake to a safe threshold, the risk of stone formation decreases significantly. This is especially critical in species prone to calcium oxalate or calcium phosphate stones, where dietary management is a key preventive strategy.",
    },
    {
      question: "How is the calcium intake limit calculated for different animals?",
      answer:
        "The calcium intake limit is calculated based on body weight, typically expressed as milligrams of calcium per kilogram of body weight per day. This approach accounts for metabolic differences and ensures the limit is tailored to the individual animal’s size. Veterinary nutritional guidelines recommend approximately 70 mg/kg/day as a safe upper limit to minimize bladder stone risk.",
    },
    {
      question: "Can calcium intake limits vary between species or individual animals?",
      answer:
        "Yes, calcium requirements and safe intake limits can vary widely between species and even among individuals within a species. Factors such as age, health status, and predisposition to urinary tract issues influence these limits. Therefore, it is essential to consult a veterinarian for personalized dietary recommendations and adjustments.",
    },
    {
      question: "What are common dietary sources of calcium that should be monitored?",
      answer:
        "Common dietary sources of calcium include dairy products, certain leafy greens, fortified pet foods, and supplements. Monitoring these sources helps prevent inadvertent excessive calcium intake. Pet owners should carefully read ingredient labels and consult with their veterinarian to ensure the total daily calcium intake remains within safe limits.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-help"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Calcium Intake Limit (Bladder Stone Prevention)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calcium plays a vital role in many physiological processes in small mammals and other pets, but excessive calcium intake can predispose them to the formation of bladder stones, also known as uroliths. These stones can cause urinary obstruction, pain, and infections, which may require surgical intervention. Therefore, managing dietary calcium intake is a critical preventive measure to maintain urinary tract health and overall well-being.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calcium intake limit is typically calculated based on the animal’s body weight, expressed in milligrams of calcium per kilogram of body weight per day. Veterinary nutritionists recommend a safe upper limit of approximately 70 mg/kg/day to minimize the risk of calcium-containing bladder stones. This limit helps balance the animal’s nutritional needs without promoting excess calcium excretion in the urine, which can crystallize and form stones.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that individual factors such as species, age, health status, and predisposition to urinary tract issues can influence calcium requirements and safe intake limits. Pet owners should work closely with their veterinarians to tailor dietary plans that meet their pet’s specific needs while preventing bladder stone formation. Regular monitoring and adjustments may be necessary to ensure optimal urinary health.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the maximum safe daily calcium intake for your pet to help prevent bladder stones. Simply enter your pet’s weight in the selected unit system, and the calculator will provide the recommended calcium intake limit in milligrams per day. This tool is designed to assist in dietary planning and should be used alongside veterinary advice.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that matches how you measure your pet’s weight (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your pet’s current weight accurately to ensure the calculation is precise.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the maximum recommended daily calcium intake to reduce bladder stone risk.
          </li>
          <li>
            <strong>Step 4:</strong> Use this information to guide dietary choices and consult your veterinarian for personalized recommendations.
          </li>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-small-mammals/calcium-and-phosphorus-in-small-mammals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Calcium and Phosphorus in Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of calcium metabolism and dietary recommendations for small mammals, emphasizing urinary health and stone prevention.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466122/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health - Dietary Management of Urolithiasis in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article detailing nutritional strategies, including calcium restriction, to prevent bladder stone formation in veterinary patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/urinary-tract-infection-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association - Urinary Tract Infection and Stone Prevention Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Clinical guidelines highlighting the role of dietary calcium management in reducing the risk of urinary tract stones and infections.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium Intake Limit (Bladder Stone Prevention)"
      description="Determine the safe daily limit for calcium intake to reduce the risk of bladder stones in susceptible species."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Calcium Intake Limit (mg/day) = 70 mg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Animal's body weight in kilograms" },
          { symbol: "70 mg", description: "Recommended calcium intake per kg body weight per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rabbit weighs 4.4 lbs (2 kg). The owner wants to know the maximum safe daily calcium intake to prevent bladder stones.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (4.4 lbs ÷ 2.20462 = 2 kg).",
          },
          {
            label: "2",
            explanation:
              "Multiply the weight by 70 mg/kg: 2 kg × 70 mg = 140 mg calcium per day.",
          },
        ],
        result:
          "The rabbit's maximum safe daily calcium intake is 140 mg to reduce bladder stone risk.",
      }}
      relatedCalculators={[
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Common Toxic Foods Reference", url: "/pets/small-mammal-common-toxic-foods-reference", icon: "🐶" },
        { title: "Litter Box Output Tracker (Normal vs. Increased)", url: "/pets/cat-litter-box-output-tracker", icon: "🐱" },
        { title: "Life Expectancy Estimator (lifestyle factors; educational)", url: "/pets/cat-life-expectancy-estimator", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "💉" },
        { title: "Nail Trim Interval Planner (activity/surface based)", url: "/pets/cat-nail-trim-interval-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium Intake Limit (Bladder Stone Prevention)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}