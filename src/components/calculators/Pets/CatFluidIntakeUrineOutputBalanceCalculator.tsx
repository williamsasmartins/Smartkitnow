import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatFluidIntakeUrineOutputBalanceCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs, oz, fl oz)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Fluid Intake (fl oz), Urine Output (fl oz), Weight (lbs)
  const [inputs, setInputs] = useState({
    weight: "",
    fluidIntake: "",
    urineOutput: "",
  });

  // Helper: convert lbs to kg
  const lbsToKg = (lbs: number) => lbs / 2.20462;

  // Helper: convert fl oz to mL
  const flozToMl = (floz: number) => floz * 29.5735;

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightLbs = parseFloat(inputs.weight);
    const fluidIntakeFlOz = parseFloat(inputs.fluidIntake);
    const urineOutputFlOz = parseFloat(inputs.urineOutput);

    if (
      isNaN(weightLbs) ||
      isNaN(fluidIntakeFlOz) ||
      isNaN(urineOutputFlOz) ||
      weightLbs <= 0 ||
      fluidIntakeFlOz < 0 ||
      urineOutputFlOz < 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to metric internally for veterinary standard units
    const weightKg = lbsToKg(weightLbs);
    const fluidIntakeMl = flozToMl(fluidIntakeFlOz);
    const urineOutputMl = flozToMl(urineOutputFlOz);

    // Calculate intake and output per kg body weight (mL/kg)
    const intakePerKg = fluidIntakeMl / weightKg;
    const outputPerKg = urineOutputMl / weightKg;

    // Calculate balance ratio: urine output / fluid intake (unitless)
    // Ideal ratio ~0.8 to 1.2 (80-120%)
    const balanceRatio = intakePerKg === 0 ? 0 : outputPerKg / intakePerKg;

    // Interpret balance
    let label = "";
    let subtext = "";
    let warning = null;

    if (balanceRatio === 0) {
      label = "No urine output recorded";
      subtext = "Please ensure urine output is measured accurately.";
      warning = "No urine output may indicate urinary obstruction or dehydration.";
    } else if (balanceRatio < 0.7) {
      label = "Negative Fluid Balance";
      subtext =
        "Urine output is significantly less than fluid intake, which may indicate fluid retention or kidney dysfunction.";
      warning =
        "Consult a veterinarian promptly if low urine output persists, as it may signal serious health issues.";
    } else if (balanceRatio > 1.3) {
      label = "Positive Fluid Loss";
      subtext =
        "Urine output exceeds fluid intake, which may indicate dehydration or excessive fluid loss.";
      warning =
        "Monitor your cat closely and consult a veterinarian if excessive urine output continues.";
    } else {
      label = "Balanced Fluid Status";
      subtext =
        "Urine output is within a healthy range relative to fluid intake, indicating good kidney function and hydration.";
      warning = null;
    }

    // Display ratio as percentage with 1 decimal place
    const ratioPercent = (balanceRatio * 100).toFixed(1) + "%";

    return {
      value: ratioPercent,
      label,
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is a normal fluid intake to urine output ratio for pets?",
      answer: "Most healthy pets have a fluid intake to urine output ratio of approximately 1.5:1 to 2:1, meaning they retain some fluid for metabolism and perspiration. Significant deviations can indicate kidney disease, diabetes, or dehydration.",
    },
    {
      question: "How do I measure my pet's daily fluid intake accurately?",
      answer: "Record water bowl refills in milliliters, add moisture from wet food (typically 75-80% water), and include treats. Measure bowl volume before and after 24 hours for precision.",
    },
    {
      question: "Why is my dog's urine output higher than fluid intake?",
      answer: "Excessive urine output relative to intake may indicate diabetes mellitus, urinary tract infection, Cushing's syndrome, or kidney disease. Consult your veterinarian if this imbalance persists for more than 2-3 days.",
    },
    {
      question: "What urine output volume should I expect from a 20 kg dog?",
      answer: "A 20 kg dog typically produces 20-40 ml/kg/day, which equals 400-800 ml daily. Output depends on diet, activity level, and health status.",
    },
    {
      question: "Can medications affect my pet's fluid balance?",
      answer: "Yes, diuretics, corticosteroids, and certain antibiotics increase urine output, while NSAIDs and some cardiac medications may decrease it. Always monitor fluid balance when starting new medications.",
    },
    {
      question: "How does diet type impact fluid intake calculations?",
      answer: "Dry kibble diets require higher water intake (10-15 ml/kg/day), while wet food diets provide 75-80% moisture and reduce drinking needs by up to 40%.",
    },
    {
      question: "When should I be concerned about abnormal fluid balance in my cat?",
      answer: "Contact your vet if urine output exceeds 50 ml/kg/day or if intake significantly drops below 20 ml/kg/day, as cats are prone to kidney disease and diabetes.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (lbs, fl oz)</SelectItem>
              <SelectItem value="metric">Metric (kg, mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="fluidIntake" className="text-slate-700 dark:text-slate-300">
            Fluid Intake ({unit === "imperial" ? "fl oz" : "mL"})
          </Label>
          <Input
            id="fluidIntake"
            name="fluidIntake"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 8" : "e.g. 240"}
            value={inputs.fluidIntake}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="urineOutput" className="text-slate-700 dark:text-slate-300">
            Urine Output ({unit === "imperial" ? "fl oz" : "mL"})
          </Label>
          <Input
            id="urineOutput"
            name="urineOutput"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 7" : "e.g. 210"}
            value={inputs.urineOutput}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", fluidIntake: "", urineOutput: "" })}
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fluid Intake vs. Urine Output Balance Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners and veterinarians assess whether a pet's fluid intake matches its urine output, identifying potential health issues like dehydration, kidney disease, or diabetes. A balanced fluid intake-to-output ratio is essential for detecting abnormal patterns early.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's body weight, daily fluid intake in milliliters (water + food moisture), and 24-hour urine output volume. The calculator uses species-specific formulas and weight-based benchmarks to evaluate balance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results indicate whether output is normal, elevated, or decreased relative to intake. Green indicates healthy balance, yellow suggests monitoring, and red flags potential medical concerns requiring veterinary evaluation.</p>
        </div>
      </section>

      {/* TABLE: Normal Daily Fluid Requirements by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Normal Daily Fluid Requirements by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference values for typical daily fluid intake in healthy adult pets based on body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Fluid Requirement</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-25 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-500 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drinking water + food moisture</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-40 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-800 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drinking water + food moisture</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-150 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drinking water + food moisture</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-200 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Drinking water + food moisture</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-3 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-300 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Water bottle + fresh vegetables</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.2 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Water bottle + high-water vegetables</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume normal activity level and moderate ambient temperature; adjust for exercise, heat, or medical conditions.</p>
      </section>

      {/* TABLE: Expected Daily Urine Output by Pet Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Expected Daily Urine Output by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical urine production rates in milliliters per kilogram of body weight for healthy pets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Urine Output (ml/kg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total for Average Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Normal Range Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40 ml/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-600 ml (15kg dog)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pale to light yellow</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 ml/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-150 ml (4kg cat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light to pale yellow</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 ml/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-75 ml (2.5kg rabbit)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Clear to pale</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 ml/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-24 ml (1.2kg GP)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Clear to slightly cloudy</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamster</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 ml/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 ml (150g hamster)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal visible output</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Output increases with higher water intake, exercise, warm environments, and certain medical conditions like diabetes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Collect urine in a clean container over exactly 24 hours for the most accurate measurement and comparison.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for all water sources: drinking bowl, wet food, treats, broth, and even water from fruits or vegetables.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor fluid balance during seasonal changes, as hot weather increases both intake and output naturally.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a daily log for 3-5 days before consulting your vet to identify consistent patterns rather than daily fluctuations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring moisture in commercial pet food</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wet food contains 75-80% water but is often overlooked; this can make intake appear lower than actual, skewing balance assessment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring urine over less than 24 hours</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Urine output varies significantly throughout the day; measuring only morning or evening samples gives inaccurate results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to account for multiple water bowls</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets with access to bowls in different rooms may drink more than recorded; track all sources for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting for environmental factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Exercise, temperature, humidity, and stress all increase fluid needs; the calculator results must be interpreted with context.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a normal fluid intake to urine output ratio for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most healthy pets have a fluid intake to urine output ratio of approximately 1.5:1 to 2:1, meaning they retain some fluid for metabolism and perspiration. Significant deviations can indicate kidney disease, diabetes, or dehydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my pet's daily fluid intake accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Record water bowl refills in milliliters, add moisture from wet food (typically 75-80% water), and include treats. Measure bowl volume before and after 24 hours for precision.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is my dog's urine output higher than fluid intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive urine output relative to intake may indicate diabetes mellitus, urinary tract infection, Cushing's syndrome, or kidney disease. Consult your veterinarian if this imbalance persists for more than 2-3 days.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What urine output volume should I expect from a 20 kg dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 20 kg dog typically produces 20-40 ml/kg/day, which equals 400-800 ml daily. Output depends on diet, activity level, and health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can medications affect my pet's fluid balance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, diuretics, corticosteroids, and certain antibiotics increase urine output, while NSAIDs and some cardiac medications may decrease it. Always monitor fluid balance when starting new medications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does diet type impact fluid intake calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dry kibble diets require higher water intake (10-15 ml/kg/day), while wet food diets provide 75-80% moisture and reduce drinking needs by up to 40%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I be concerned about abnormal fluid balance in my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your vet if urine output exceeds 50 ml/kg/day or if intake significantly drops below 20 ml/kg/day, as cats are prone to kidney disease and diabetes.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Kidney Disease in Cats — AAFCO Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for pet nutrition and hydration requirements developed by the Association of American Feed Control Officials.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fluid Therapy in Small Animals — Veterinary Information Network</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based resource on fluid balance, intake assessment, and clinical interpretation for veterinary professionals.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Diabetes in Pets — International Society of Feline Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidance on recognizing polyuria and polydipsia as early indicators of feline diabetes mellitus.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Health Guidelines — American Veterinary Medical Association</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive standards for monitoring pet health including fluid intake and urine output assessment protocols.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fluid Intake vs. Urine Output Balance Checker"
      description="Check the balance between liquid consumed and liquid expelled, key for monitoring kidney function."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Balance Ratio = (Urine Output per kg) ÷ (Fluid Intake per kg)",
        variables: [
          { symbol: "Urine Output per kg", description: "Urine volume normalized to body weight (mL/kg)" },
          { symbol: "Fluid Intake per kg", description: "Fluid intake normalized to body weight (mL/kg)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat drinks 8 fl oz of water and produces 7 fl oz of urine in 24 hours. Calculate the fluid balance ratio.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lb ÷ 2.20462 = 4.54 kg. Convert volumes to mL: 8 fl oz × 29.5735 = 236.59 mL intake, 7 fl oz × 29.5735 = 207.01 mL output.",
          },
          {
            label: "2",
            explanation:
              "Calculate intake per kg: 236.59 mL ÷ 4.54 kg = 52.1 mL/kg. Calculate output per kg: 207.01 mL ÷ 4.54 kg = 45.6 mL/kg.",
          },
          {
            label: "3",
            explanation:
              "Calculate balance ratio: 45.6 ÷ 52.1 = 0.88 (88%), indicating balanced fluid status within normal range.",
          },
        ],
        result: "The cat's fluid balance ratio is 88%, suggesting healthy hydration and kidney function.",
      }}
      relatedCalculators={[
        {
          title: "Foaling Countdown & Lactation Feed Planner",
          url: "/pets/horse-foaling-countdown-lactation-feed-planner",
          icon: "🐾",
        },
        {
          title: "Ideal Weight & Target Calories for Cats",
          url: "/pets/cat-ideal-weight-target-calories",
          icon: "🐱",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Caffeine Toxicity Calculator",
          url: "/pets/dog-caffeine-toxicity",
          icon: "🐶",
        },
        {
          title: "Prednisone/Prednisolone Dose Calculator for Dogs",
          url: "/pets/dog-prednisone-prednisolone-dose",
          icon: "🐶",
        },
        {
          title: "Dog Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/dog-pregnancy-gestation-due-date",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fluid Intake vs. Urine Output Balance Checker" },
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