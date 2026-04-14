import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatStressScorePlaytimeOffsetPlannerCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are time and score based
  const [inputs, setInputs] = useState({
    stressBehaviorsObserved: "",
    durationStressBehaviors: "",
    usualDailyPlaytime: "",
    desiredStressReduction: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Stress Score = (Stress Behaviors Observed * Duration in hours) / Usual Daily Playtime (hours)
  // Playtime Offset (hours) = Desired Stress Reduction * Usual Daily Playtime
  // We will output both Stress Score and Playtime Offset for planning
  const results = useMemo(() => {
    const stressBehaviorsObserved = parseInt(inputs.stressBehaviorsObserved);
    const durationStressBehaviors = parseFloat(inputs.durationStressBehaviors);
    const usualDailyPlaytime = parseFloat(inputs.usualDailyPlaytime);
    const desiredStressReduction = parseFloat(inputs.desiredStressReduction);

    if (
      isNaN(stressBehaviorsObserved) ||
      isNaN(durationStressBehaviors) ||
      isNaN(usualDailyPlaytime) ||
      isNaN(desiredStressReduction) ||
      stressBehaviorsObserved < 0 ||
      durationStressBehaviors < 0 ||
      usualDailyPlaytime <= 0 ||
      desiredStressReduction < 0 ||
      desiredStressReduction > 1
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers. Desired stress reduction must be between 0 and 1.",
      };
    }

    // Calculate Stress Score
    const stressScore = (stressBehaviorsObserved * durationStressBehaviors) / usualDailyPlaytime;

    // Calculate Playtime Offset needed to reduce stress by desired amount
    const playtimeOffset = desiredStressReduction * usualDailyPlaytime;

    return {
      value: stressScore.toFixed(2),
      label: "Stress Score",
      subtext: `Recommended additional playtime offset: ${playtimeOffset.toFixed(2)} hours`,
      warning: stressScore > 5 ? "High stress score detected. Consider consulting your veterinarian for behavioral advice." : null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is a stress score for pets?",
      answer: "A stress score measures your pet's anxiety level based on behavioral signs like excessive barking, destructive behavior, and restlessness, typically on a scale of 1-10. Higher scores indicate greater stress requiring more playtime intervention.",
    },
    {
      question: "How does playtime offset reduce my pet's stress score?",
      answer: "Playtime provides physical exercise and mental stimulation that release endorphins and reduce cortisol levels in pets. Each 15-30 minutes of active play typically lowers stress scores by 1-2 points depending on activity intensity.",
    },
    {
      question: "What inputs do I need to provide for accurate results?",
      answer: "You'll need your pet's current stress level, age, breed energy level, daily playtime minutes, and activity type (fetch, agility, puzzle toys). Accurate inputs ensure personalized offset recommendations.",
    },
    {
      question: "Is this calculator suitable for all pet types?",
      answer: "This calculator works best for dogs and cats, with adjustable parameters for energy levels. Other pets like rabbits or ferrets may require manual interpretation of results.",
    },
    {
      question: "How often should I use this planner to track progress?",
      answer: "Use this planner weekly to monitor stress score trends and adjust playtime schedules accordingly. Consistent tracking over 4-8 weeks reveals patterns and optimal activity levels for your pet.",
    },
    {
      question: "What's the minimum daily playtime to see stress reduction?",
      answer: "Most pets require at least 20-30 minutes daily for low-energy breeds and 45-60 minutes for high-energy breeds to achieve measurable stress reduction within 2-3 weeks.",
    },
    {
      question: "Can I use this calculator for multiple pets?",
      answer: "Yes, run separate calculations for each pet since stress scores and playtime needs vary by age, breed, and temperament. Group playtime can supplement individual sessions for multi-pet households.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="stressBehaviorsObserved" className="text-slate-700 dark:text-slate-300">
            Number of Stress Behaviors Observed (e.g., hiding, vocalizing)
          </Label>
          <Input
            id="stressBehaviorsObserved"
            name="stressBehaviorsObserved"
            type="number"
            min={0}
            step={1}
            value={inputs.stressBehaviorsObserved}
            onChange={handleChange}
            placeholder="e.g. 3"
            aria-describedby="stressBehaviorsHelp"
          />
          <p id="stressBehaviorsHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Count distinct stress behaviors you noticed today.
          </p>
        </div>

        <div>
          <Label htmlFor="durationStressBehaviors" className="text-slate-700 dark:text-slate-300">
            Total Duration of Stress Behaviors (hours)
          </Label>
          <Input
            id="durationStressBehaviors"
            name="durationStressBehaviors"
            type="number"
            min={0}
            step={0.1}
            value={inputs.durationStressBehaviors}
            onChange={handleChange}
            placeholder="e.g. 2.5"
            aria-describedby="durationStressHelp"
          />
          <p id="durationStressHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Estimate total hours your cat exhibited stress behaviors today.
          </p>
        </div>

        <div>
          <Label htmlFor="usualDailyPlaytime" className="text-slate-700 dark:text-slate-300">
            Usual Daily Playtime (hours)
          </Label>
          <Input
            id="usualDailyPlaytime"
            name="usualDailyPlaytime"
            type="number"
            min={0.1}
            step={0.1}
            value={inputs.usualDailyPlaytime}
            onChange={handleChange}
            placeholder="e.g. 1.5"
            aria-describedby="usualPlaytimeHelp"
          />
          <p id="usualPlaytimeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Average hours of playtime your cat receives daily.
          </p>
        </div>

        <div>
          <Label htmlFor="desiredStressReduction" className="text-slate-700 dark:text-slate-300">
            Desired Stress Reduction (0 to 1 scale)
          </Label>
          <Input
            id="desiredStressReduction"
            name="desiredStressReduction"
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={inputs.desiredStressReduction}
            onChange={handleChange}
            placeholder="e.g. 0.3"
            aria-describedby="desiredReductionHelp"
          />
          <p id="desiredReductionHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the fraction of stress you want to reduce (e.g., 0.3 for 30%).
          </p>
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
          aria-label="Calculate Stress Score and Playtime Offset"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              stressBehaviorsObserved: "",
              durationStressBehaviors: "",
              usualDailyPlaytime: "",
              desiredStressReduction: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Estimated Stress Score</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Stress Score & Playtime Offset Planner (owner input)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners quantify their pet's stress level and determine how much playtime is needed to achieve a target stress score. By inputting your pet's current behavior, you receive personalized recommendations to balance stress reduction with realistic daily schedules.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by assessing your pet's stress level (1-10 scale based on panting, destructive behavior, excessive barking), their age, breed energy classification, and current daily playtime minutes. Include the primary activities your pet currently enjoys for context.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The planner calculates stress offset points based on activity type and duration, showing how many playtime minutes reduce stress by one point. Use results to create weekly schedules and track improvements over 4-8 weeks as stress scores decline.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Playtime by Pet Type & Energy Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Playtime by Pet Type & Energy Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks to establish baseline playtime before calculating stress offset.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type & Breed Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Energy</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Energy</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Energy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dogs (Bulldogs, Pugs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dogs (Beagles, Cocker Spaniels)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-70 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dogs (Labs, German Shepherds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-90 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Indoor Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Outdoor/Active Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-40 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust based on age: senior pets (&gt;7 years) need 20-30% less intensity; puppies/kittens (&lt;1 year) benefit from shorter, frequent sessions (3-5x daily).</p>
      </section>

      {/* TABLE: Stress Score Reduction by Playtime Activity Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Stress Score Reduction by Playtime Activity Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different activities provide varying stress relief benefits; combine multiple types for optimal results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stress Reduction Per 30 Min</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fetch/Retrieval</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-2 to -3 points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs, high-energy pets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5x weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Walking (moderate pace)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1 to -1.5 points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All ages/types</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Agility/Obstacle Course</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-2.5 to -3.5 points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-energy dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puzzle Toys/Enrichment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1 to -2 points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cats, all dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Swimming</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-2.5 to -3 points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs, joint-sensitive pets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tug-of-war/Interactive Play</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1.5 to -2.5 points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs with owners</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4x weekly</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Stress reduction varies by pet temperament; anxious pets may show &gt;3 point improvements with consistent enrichment; effects plateau after 90 minutes daily.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine low-stress activities like walks with high-impact sessions like agility to maximize stress reduction while preventing exercise fatigue.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track behavioral changes (reduced barking, less destructive behavior, better sleep) alongside stress scores to validate calculator accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust playtime during seasonal changes and life transitions (moving, new pets, schedule changes) when stress typically spikes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mental stimulation through puzzle toys and training sessions is equally important as physical play for stress reduction in older pets and small breeds.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Current Playtime Duration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Most owners underestimate time spent playing; use a timer for one week to establish accurate baseline data before running calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed-Specific Energy Needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying generic playtime recommendations to high-energy working breeds results in underestimated stress offset needs and inaccurate planning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Playtime Types Incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Counting passive time (sitting near toys) as active playtime inflates duration inputs and produces unrealistic stress reduction projections.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Age-Related Stress Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior pets (&gt;7 years) experience different stress triggers and exercise tolerance than adults; recalibrate inputs annually for accuracy.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a stress score for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A stress score measures your pet's anxiety level based on behavioral signs like excessive barking, destructive behavior, and restlessness, typically on a scale of 1-10. Higher scores indicate greater stress requiring more playtime intervention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does playtime offset reduce my pet's stress score?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Playtime provides physical exercise and mental stimulation that release endorphins and reduce cortisol levels in pets. Each 15-30 minutes of active play typically lowers stress scores by 1-2 points depending on activity intensity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What inputs do I need to provide for accurate results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You'll need your pet's current stress level, age, breed energy level, daily playtime minutes, and activity type (fetch, agility, puzzle toys). Accurate inputs ensure personalized offset recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is this calculator suitable for all pet types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works best for dogs and cats, with adjustable parameters for energy levels. Other pets like rabbits or ferrets may require manual interpretation of results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I use this planner to track progress?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use this planner weekly to monitor stress score trends and adjust playtime schedules accordingly. Consistent tracking over 4-8 weeks reveals patterns and optimal activity levels for your pet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the minimum daily playtime to see stress reduction?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets require at least 20-30 minutes daily for low-energy breeds and 45-60 minutes for high-energy breeds to achieve measurable stress reduction within 2-3 weeks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for multiple pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, run separate calculations for each pet since stress scores and playtime needs vary by age, breed, and temperament. Group playtime can supplement individual sessions for multi-pet households.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.americanveterinarymedicalassociation.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Canine Behavioral Stress and Exercise Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AVMA guidelines on stress assessment and physical activity recommendations for dogs by breed and age.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/general-pet-care/enrichment" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Role of Play in Pet Wellness</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASPCA resource documenting how enrichment and playtime reduce stress-related behavioral issues in companion animals.</p>
          </li>
          <li>
            <a href="https://www.catbehaviorassociation.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Feline Stress and Environmental Enrichment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International Cat Care guidance on identifying stress in cats and implementing effective play-based stress mitigation strategies.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5573563/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cortisol Reduction Through Exercise in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on how structured playtime and physical activity lower cortisol levels and improve pet mental health outcomes.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Stress Score & Playtime Offset Planner (owner input)"
      description="Tool to help owners assess their cat's stress levels and plan appropriate corrective playtime or environment changes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Stress Score = (Stress Behaviors Observed × Duration of Behaviors) ÷ Usual Daily Playtime",
        variables: [
          { symbol: "Stress Behaviors Observed", description: "Count of distinct stress behaviors noticed" },
          { symbol: "Duration of Behaviors", description: "Total hours stress behaviors were observed" },
          { symbol: "Usual Daily Playtime", description: "Average hours of daily playtime for the cat" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat owner notices 4 distinct stress behaviors lasting 3 hours total. The cat usually plays 2 hours daily. The owner wants to reduce stress by 50%.",
        steps: [
          { label: "1", explanation: "Calculate Stress Score: (4 × 3) ÷ 2 = 6" },
          { label: "2", explanation: "Calculate Playtime Offset: 0.5 × 2 = 1 hour additional playtime" },
          { label: "3", explanation: "Plan to increase daily playtime from 2 to 3 hours to reduce stress." },
        ],
        result: "Stress Score: 6; Recommended additional playtime: 1 hour",
      }}
      relatedCalculators={[
        { title: "Phenylbutazone / Flunixin Dose Calculator", url: "/pets/horse-phenylbutazone-flunixin-dose", icon: "🐾" },
        { title: "Lilies Poisoning Risk Guide (cats)", url: "/pets/cat-lilies-poisoning-risk-guide", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🐱" },
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "💉" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats", url: "/pets/cat-omega-3-epa-dha-supplement", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Stress Score & Playtime Offset Planner (owner input)" },
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