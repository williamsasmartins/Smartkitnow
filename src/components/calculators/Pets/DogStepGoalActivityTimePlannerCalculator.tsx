import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle, Activity, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogStepGoalActivityTimePlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "moderate",
  });

  // 2. LOGIC ENGINE
  /**
   * Dog Step-Goal & Activity Time Planner is based on weight and activity level.
   * Scientific studies suggest dogs require a baseline of steps per day adjusted by weight and activity.
   * 
   * Formula:
   * Step Goal = BaseSteps * WeightFactor * ActivityMultiplier
   * Activity Time (minutes) = StepGoal / StepsPerMinute
   * 
   * Constants:
   * BaseSteps = 1000 (minimum baseline for small dogs)
   * WeightFactor = weightKg ^ 0.75 (metabolic scaling)
   * ActivityMultiplier = 1.0 (low), 1.5 (moderate), 2.0 (high)
   * StepsPerMinute = 100 (average walking pace)
   */

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        stepGoal: 0,
        activityTime: 0,
        label: "Enter valid weight to calculate step goal and activity time.",
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Validate weight range for typical dogs (1kg to 90kg)
    if (weightKg < 1 || weightKg > 90) {
      return {
        stepGoal: 0,
        activityTime: 0,
        label: "Weight out of typical dog range (1-90 kg). Please enter a valid weight.",
        warning: "Extreme weights may require personalized veterinary advice.",
      };
    }

    // Activity multipliers based on activity level
    const activityMultipliers: Record<string, number> = {
      low: 1.0,
      moderate: 1.5,
      high: 2.0,
    };

    const baseSteps = 1000;
    const weightFactor = Math.pow(weightKg, 0.75);
    const activityMultiplier = activityMultipliers[inputs.activityLevel] || 1.5;
    const stepsPerMinute = 100;

    const stepGoal = Math.round(baseSteps * weightFactor * activityMultiplier);
    const activityTime = Math.round(stepGoal / stepsPerMinute);

    return {
      stepGoal,
      activityTime,
      label: `Recommended daily step goal and active play time based on your dog's weight and activity level.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How many steps should my dog get daily based on age?",
      answer: "Puppies need 5,000–10,000 steps daily, adult dogs 10,000–15,000 steps, and senior dogs 5,000–8,000 steps depending on breed size and health.",
    },
    {
      question: "What's the difference between steps and active playtime for dogs?",
      answer: "Steps measure total movement distance, while active playtime refers to intense exercise sessions lasting 20–60 minutes that elevate heart rate and build endurance.",
    },
    {
      question: "Can this planner work for all dog breeds?",
      answer: "Yes, but adjust targets based on breed size: large breeds need 12,000–18,000 steps daily, while small breeds thrive on 5,000–10,000 steps.",
    },
    {
      question: "How do I track my dog's steps accurately?",
      answer: "Use a dog fitness tracker, smartwatch, or pedometer collar to record steps, or estimate based on walk distance using a map app.",
    },
    {
      question: "What happens if my dog doesn't meet daily step goals?",
      answer: "Insufficient activity increases risk of obesity, joint problems, and behavioral issues; gradually increase exercise by 10% weekly to reach healthy targets.",
    },
    {
      question: "Should I adjust activity goals for dogs with health conditions?",
      answer: "Yes, dogs with arthritis, heart disease, or respiratory issues need modified plans; consult your vet before using this calculator for medical conditions.",
    },
    {
      question: "How does weather affect my dog's daily activity planning?",
      answer: "Hot weather requires shorter, cooler-time walks to prevent overheating; cold weather may reduce activity tolerance, so adjust goals seasonally.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleActivityLevelChange(value: string) {
    setInputs((prev) => ({ ...prev, activityLevel: value }));
  }

  // 5. WIDGET JSX
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

        {/* Weight Input */}
        <div className="flex flex-col">
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your dog's current body weight for accurate step and activity time recommendations.
          </p>
        </div>

        {/* Activity Level Select */}
        <div className="flex flex-col">
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select value={inputs.activityLevel} onValueChange={handleActivityLevelChange}>
            <SelectTrigger className="w-[180px]" id="activityLevel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (sedentary/older dogs)</SelectItem>
              <SelectItem value="moderate">Moderate (average activity)</SelectItem>
              <SelectItem value="high">High (very active/working dogs)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your dog's typical daily activity level to tailor the step goal and playtime.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation (already reactive)
          }}
          aria-label="Calculate step goal and activity time"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activityLevel: "moderate" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.stepGoal !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Step Goal & Activity Time
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.stepGoal.toLocaleString()} steps
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-4">
                Active Play Time: {results.activityTime} minutes/day
              </p>

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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized exercise plans.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Step-Goal & Activity Time Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you establish personalized daily step goals and activity schedules tailored to your dog's age, size, breed type, and fitness level. It combines research-backed exercise recommendations with practical planning tools to keep your dog healthy and mentally stimulated.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your dog's age, weight, breed category, and current activity level. The calculator will assess baseline needs and identify activity gaps. You can also specify any health conditions or behavioral concerns that may affect exercise intensity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended daily step count, optimal playtime duration, and suggested activity breakdown. Use this plan to structure walks, fetch sessions, and enrichment activities throughout the week, monitoring your dog's response and adjusting as needed.</p>
        </div>
      </section>

      {/* TABLE: Daily Step Goals by Dog Age and Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Step Goals by Dog Age and Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Target step counts vary significantly based on your dog's age category and breed size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Breed (&lt;25 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Breed (25–50 lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Breed (&gt;50 lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppy (0–12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000–15,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult (1–7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000–16,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15,000–20,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior (7+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000–7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6,000–10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000–12,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust based on individual fitness level, metabolism, and health status.</p>
      </section>

      {/* TABLE: Recommended Weekly Activity Time by Breed Energy Level */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Weekly Activity Time by Breed Energy Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Active playtime targets ensure balanced physical and mental stimulation across different breed temperaments.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Energy Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Activity Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Activity Sessions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Activities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low (Bulldogs, Basset Hounds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 short sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gentle walks, light fetch</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate (Beagles, Cocker Spaniels)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7–10 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Brisk walks, swimming, play</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High (Border Collies, Huskies)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14–20 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4 intense sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Running, agility, herding games</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Monitor your dog's behavior and adjust intensity if showing signs of fatigue or restlessness.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Break daily steps into 2–3 walks rather than one long session to maintain consistent energy and prevent joint stress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a dog fitness tracker or smartphone app to monitor actual step counts and adjust plans based on real data.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Incorporate mental enrichment games, puzzle toys, and training sessions to meet activity needs without relying solely on physical exercise.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Gradually increase step goals by 10% weekly for overweight dogs to prevent injury while building sustainable fitness habits.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human step goals for dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dogs require fewer total steps than humans but higher intensity; a 10,000-step goal for a dog is more demanding than for a person.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring breed-specific exercise needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High-energy working breeds like Border Collies need 15,000+ daily steps, while low-energy breeds like Bulldogs thrive on 5,000–8,000 steps.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Pushing senior dogs too hard</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older dogs need 30–50% fewer steps than adults; excessive activity increases arthritis pain and joint damage in senior pets.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exercising puppies excessively</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies' growth plates don't close until 12–18 months; too much activity before this age causes permanent joint and bone damage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many steps should my dog get daily based on age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies need 5,000–10,000 steps daily, adult dogs 10,000–15,000 steps, and senior dogs 5,000–8,000 steps depending on breed size and health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between steps and active playtime for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Steps measure total movement distance, while active playtime refers to intense exercise sessions lasting 20–60 minutes that elevate heart rate and build endurance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this planner work for all dog breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but adjust targets based on breed size: large breeds need 12,000–18,000 steps daily, while small breeds thrive on 5,000–10,000 steps.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I track my dog's steps accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use a dog fitness tracker, smartwatch, or pedometer collar to record steps, or estimate based on walk distance using a map app.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my dog doesn't meet daily step goals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Insufficient activity increases risk of obesity, joint problems, and behavioral issues; gradually increase exercise by 10% weekly to reach healthy targets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust activity goals for dogs with health conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, dogs with arthritis, heart disease, or respiratory issues need modified plans; consult your vet before using this calculator for medical conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does weather affect my dog's daily activity planning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hot weather requires shorter, cooler-time walks to prevent overheating; cold weather may reduce activity tolerance, so adjust goals seasonally.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akc.org/expert-advice/how-much-exercise-does-my-dog-need/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club: Exercise for Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Breed-specific exercise guidelines and recommendations from AKC veterinary experts.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/your-pet/pet-owner-education" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Pet Owner Information: Canine Exercise</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary guidance on appropriate activity levels for dogs at different life stages.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association: Obesity in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research linking inadequate exercise to obesity, joint disease, and metabolic disorders in dogs.</p>
          </li>
          <li>
            <a href="https://www.iaabc.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Association of Canine Professionals: Activity Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Certified behavior and training standards for safe, effective canine exercise programming.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Step-Goal & Activity Time Planner"
      description="Plan and track daily step goals and active play time to ensure adequate exercise for your dog's needs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Step Goal = BaseSteps × Weight^{0.75} × ActivityMultiplier
Activity Time (minutes) = Step Goal ÷ StepsPerMinute`,
        variables: [
          { symbol: "BaseSteps", description: "Baseline minimum steps (1000 steps)" },
          { symbol: "Weight", description: "Dog's weight in kilograms (kg)" },
          { symbol: "0.75", description: "Metabolic scaling exponent for mammals" },
          { symbol: "ActivityMultiplier", description: "Multiplier based on dog's activity level (1.0 low, 1.5 moderate, 2.0 high)" },
          { symbol: "StepsPerMinute", description: "Average dog walking pace (100 steps/minute)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 22 lb (10 kg) moderately active dog owner wants to know the daily step goal and active playtime needed.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if needed (22 lb ÷ 2.20462 = 10 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate step goal: 1000 × 10^{0.75} × 1.5 ≈ 1000 × 5.62 × 1.5 = 8430 steps.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate activity time: 8430 steps ÷ 100 steps/minute = 84 minutes of active play per day.",
          },
        ],
        result:
          "The dog should aim for approximately 8,430 steps daily, which translates to about 84 minutes of active play or walking to maintain optimal health.",
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
        { id: "what-is", label: "Understanding Dog Step-Goal & Activity Time Planner" },
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