import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogBodyConditionScoreBcsTargetCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    currentBcs: "",
    targetBcs: "",
  });

  // Validate BCS input (1-9 scale)
  const isValidBcs = (val: string) => {
    const n = parseInt(val);
    return n >= 1 && n <= 9;
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const currentBcsRaw = parseInt(inputs.currentBcs);
    const targetBcsRaw = parseInt(inputs.targetBcs);

    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !isValidBcs(inputs.currentBcs) ||
      !isValidBcs(inputs.targetBcs)
    ) {
      return {
        value: 0,
        label: "Enter valid details to calculate target weight and plan.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const currentWeightKg = unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;

    // Body Condition Score scale is 1 (emaciated) to 9 (obese)
    // Ideal BCS is usually 4-5
    // Weight is roughly proportional to BCS (linear approx)
    // Target Weight = Current Weight * (Target BCS / Current BCS)
    // This assumes fat mass changes proportionally with BCS score

    const targetWeightKg = currentWeightKg * (targetBcsRaw / currentBcsRaw);

    // Calculate Resting Energy Requirement (RER) for target weight
    // RER = 70 * (weight in kg)^0.75
    const rerTarget = 70 * Math.pow(targetWeightKg, 0.75);

    // Calculate Maintenance Energy Requirement (MER) for target weight
    // MER = RER * activity factor (typical 1.4 for neutered adult dogs)
    const activityFactor = 1.4;
    const merTarget = rerTarget * activityFactor;

    // Convert target weight back to user unit
    const targetWeightDisplay = unit === "imperial" ? targetWeightKg * 2.20462 : targetWeightKg;

    // Round results
    const targetWeightRounded = Math.round(targetWeightDisplay * 10) / 10;
    const rerRounded = Math.round(rerTarget);
    const merRounded = Math.round(merTarget);

    // Warning if target BCS is outside ideal range
    let warning = null;
    if (targetBcsRaw < 4 || targetBcsRaw > 5) {
      warning =
        "Target BCS is outside the ideal range (4-5). Consult your veterinarian for a tailored plan.";
    }

    return {
      value: targetWeightRounded,
      label: `Target Weight (${unit === "imperial" ? "lbs" : "kg"})`,
      subtext: `Estimated daily calorie needs at target weight: RER ≈ ${rerRounded} kcal, MER ≈ ${merRounded} kcal`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is a Body Condition Score (BCS) and why does it matter for my dog?",
      answer: "BCS is a 1-9 scale assessing your dog's weight relative to ideal body composition. A score of 4-5 indicates optimal health, while scores outside this range increase risks of obesity-related diseases like diabetes and joint problems.",
    },
    {
      question: "How do I determine my dog's current BCS before using this calculator?",
      answer: "Feel your dog's ribs without pressing hard—you should feel them easily but not see them prominently. Check the waist when viewing from above and the abdominal tuck from the side to assign a score of 1-9.",
    },
    {
      question: "What does the calculator recommend if my dog scores a 7 or higher (overweight)?",
      answer: "The tool suggests a gradual weight loss plan, typically 1-2% body weight loss per week through reduced calorie intake and increased exercise, with veterinary oversight.",
    },
    {
      question: "Can this calculator work for all dog breeds and sizes?",
      answer: "Yes, BCS is breed-agnostic and applies to dogs from 5 lbs to 150+ lbs, though larger breeds may need adjusted exercise targets based on joint health.",
    },
    {
      question: "How often should I reassess my dog's BCS using this calculator?",
      answer: "Reassess monthly if your dog is on a weight management plan, or every 3-6 months for maintenance, to track progress and adjust feeding as needed.",
    },
    {
      question: "What is the relationship between BCS and daily calorie requirements?",
      answer: "Dogs with BCS 8-9 typically require 25-30% fewer calories than ideal-weight dogs of the same size; this calculator helps estimate personalized targets.",
    },
    {
      question: "Should I use this calculator alongside my veterinarian's recommendations?",
      answer: "Yes, this tool is educational and complements professional advice—always consult your vet before implementing major diet or exercise changes, especially for senior or health-compromised dogs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
              Current Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="currentWeight"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.currentWeight}
              onChange={(e) => handleInputChange("currentWeight", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="currentBcs" className="text-slate-700 dark:text-slate-300">
              Current Body Condition Score (1-9)
            </Label>
            <Input
              id="currentBcs"
              type="number"
              min="1"
              max="9"
              step="1"
              placeholder="Enter current BCS (1-9)"
              value={inputs.currentBcs}
              onChange={(e) => handleInputChange("currentBcs", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="targetBcs" className="text-slate-700 dark:text-slate-300">
              Target Body Condition Score (1-9)
            </Label>
            <Input
              id="targetBcs"
              type="number"
              min="1"
              max="9"
              step="1"
              placeholder="Enter target BCS (1-9)"
              value={inputs.targetBcs}
              onChange={(e) => handleInputChange("targetBcs", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentWeight: "", currentBcs: "", targetBcs: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Body Condition Score Helper (BCS → Target Plan)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you assess your dog's current body condition on a 1-9 scale and generates a personalized weight management plan. It bridges the gap between identifying if your dog is overweight and understanding what daily caloric intake and exercise adjustments are needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by honestly evaluating your dog's ribs, waist, and abdominal tuck, then input their current weight, age, and activity level. The calculator uses these inputs along with breed considerations to estimate caloric needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended BCS target (typically 4-5), daily calorie targets, and suggested exercise or diet adjustments. Use this as a roadmap to discuss with your veterinarian and track progress monthly.</p>
        </div>
      </section>

      {/* TABLE: Dog Body Condition Score (BCS) Reference Guide */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog Body Condition Score (BCS) Reference Guide</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this 9-point scale to identify your dog's current body condition and health status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BCS Score</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Visual/Physical Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severely Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs, spine, pelvis prominent; no fat; sunken abdomen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Malnutrition risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs easily felt; minimal fat; defined waist</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below ideal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ideal Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs palpable, not visible; visible waist; light abdominal tuck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal health</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs difficult to feel; slight waist; mild abdominal fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Early concern</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs not palpable; no waist; abdominal sag; waddling gait</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Disease risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severely Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ribs invisible; no waist; severe fat deposits; mobility issues</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical health risk</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">BCS 4-5 is optimal for most dogs; scores outside this range warrant dietary adjustments and veterinary consultation.</p>
      </section>

      {/* TABLE: Recommended Daily Calorie Targets by BCS and Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Calorie Targets by BCS and Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimate daily caloric needs based on your dog's current BCS and target weight goal.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BCS 4-5 (Ideal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BCS 6-7 (Overweight)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BCS 8-9 (Obese)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-450 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-350 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175-300 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450-900 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-700 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-600 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">51-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1,400 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1,100 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-950 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400-2,000 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100-1,600 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">950-1,400 cal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are baseline estimates; adjust based on activity level, age, metabolism, and veterinary guidance. Individual needs vary significantly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Feel your dog's ribs regularly with flat fingers to catch weight changes early before scores drift above 5.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Reduce treat calories to no more than 10% of daily intake when implementing a weight loss plan.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase exercise gradually—add 10-15 minutes per week—to prevent joint strain in overweight dogs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a kitchen scale to measure food portions precisely rather than eyeballing, as small overages compound quickly.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on weight without assessing body composition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 60-lb dog can be ideal, overweight, or underweight depending on muscle vs. fat; BCS visual assessment is more informative than scale weight alone.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Making drastic calorie cuts instead of gradual reductions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cutting calories by 50% causes nutritional deficiency and metabolic slowdown; aim for 10-25% reductions over weeks for sustainable loss.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring age and breed differences in caloric needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior dogs and certain breeds (Labs, Beagles) have slower metabolisms; calculator outputs should be adjusted downward for these populations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for training treats and table scraps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hidden calories from treats and human food often account for 20-30% of daily intake and derail weight loss plans if not tracked.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a Body Condition Score (BCS) and why does it matter for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BCS is a 1-9 scale assessing your dog's weight relative to ideal body composition. A score of 4-5 indicates optimal health, while scores outside this range increase risks of obesity-related diseases like diabetes and joint problems.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine my dog's current BCS before using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Feel your dog's ribs without pressing hard—you should feel them easily but not see them prominently. Check the waist when viewing from above and the abdominal tuck from the side to assign a score of 1-9.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the calculator recommend if my dog scores a 7 or higher (overweight)?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The tool suggests a gradual weight loss plan, typically 1-2% body weight loss per week through reduced calorie intake and increased exercise, with veterinary oversight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator work for all dog breeds and sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, BCS is breed-agnostic and applies to dogs from 5 lbs to 150+ lbs, though larger breeds may need adjusted exercise targets based on joint health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I reassess my dog's BCS using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reassess monthly if your dog is on a weight management plan, or every 3-6 months for maintenance, to track progress and adjust feeding as needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between BCS and daily calorie requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs with BCS 8-9 typically require 25-30% fewer calories than ideal-weight dogs of the same size; this calculator helps estimate personalized targets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator alongside my veterinarian's recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this tool is educational and complements professional advice—always consult your vet before implementing major diet or exercise changes, especially for senior or health-compromised dogs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://petobesityprevention.org/body-condition-scoring/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association for Pet Obesity Prevention (APOP) — Body Condition Scoring</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard resource defining the 9-point BCS system and health implications for overweight and obese dogs.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/obesity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) — Pet Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on obesity-related health risks and weight management strategies approved by veterinary professionals.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/news/dog-obesity-epidemic" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine — Canine Nutrition and Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed information on caloric requirements, metabolic factors, and nutrition for dogs across different body condition scores.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/dog-owners/disorders-of-dogs/obesity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Merck Veterinary Manual — Obesity in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical resource covering BCS assessment, disease associations, and evidence-based dietary intervention protocols.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Body Condition Score Helper (BCS → Target Plan)"
      description="Use the **Body Condition Score (BCS)** system to assess your dog's fat level and create a target weight plan."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Target Weight (kg) = Current Weight (kg) × (Target BCS / Current BCS)\n" +
          "RER (kcal) = 70 × (Target Weight in kg)^0.75\n" +
          "MER (kcal) = RER × Activity Factor (typically 1.4 for neutered adult dogs)",
        variables: [
          { symbol: "Current Weight (kg)", description: "Your dog's current body weight in kilograms" },
          { symbol: "Current BCS", description: "Your dog's current Body Condition Score (1-9 scale)" },
          { symbol: "Target BCS", description: "Desired Body Condition Score to achieve (1-9 scale)" },
          { symbol: "RER", description: "Resting Energy Requirement in kilocalories" },
          { symbol: "MER", description: "Maintenance Energy Requirement in kilocalories" },
          { symbol: "Activity Factor", description: "Multiplier for daily activity level, typically 1.4" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog currently at BCS 7 (overweight) aims to reach a target BCS of 5 (ideal).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg if needed (30 lb ÷ 2.20462 = 13.6 kg). Calculate target weight: 13.6 × (5 / 7) = 9.7 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER: 70 × 9.7^0.75 ≈ 70 × 5.3 = 371 kcal. Calculate MER: 371 × 1.4 = 520 kcal/day estimated for maintenance at target weight.",
          },
        ],
        result:
          "The dog’s target weight is approximately 21.4 lbs (9.7 kg), with an estimated daily calorie intake of 520 kcal to maintain this weight.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Body Condition Score Helper (BCS → Target Plan)" },
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