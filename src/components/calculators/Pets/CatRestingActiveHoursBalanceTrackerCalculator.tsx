import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle, Clock } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatRestingActiveHoursBalanceTrackerCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are time-based (hours)
  const [inputs, setInputs] = useState({
    restingHours: "",
    activeHours: "",
  });

  // 2. LOGIC ENGINE
  // Calculate balance ratio = Active Hours / Resting Hours
  // Ideal balance is roughly 1:1 to 1:2 active to resting for healthy cats
  const results = useMemo(() => {
    const resting = parseFloat(inputs.restingHours);
    const active = parseFloat(inputs.activeHours);

    if (
      isNaN(resting) ||
      isNaN(active) ||
      resting <= 0 ||
      active < 0 ||
      resting > 24 ||
      active > 24
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid hours between 0 and 24. Resting hours must be greater than 0.",
      };
    }

    // Calculate ratio
    const ratio = active / resting;

    // Interpret balance
    let label = "";
    let subtext = "";
    let warning = null;

    if (ratio < 0.3) {
      label = "Low Activity Balance";
      subtext =
        "Your cat is resting significantly more than it is active. This may indicate lethargy or health issues.";
      warning =
        "Consult your veterinarian if your cat shows prolonged low activity to rule out medical concerns.";
    } else if (ratio >= 0.3 && ratio <= 0.7) {
      label = "Moderate Activity Balance";
      subtext =
        "Your cat has a balanced resting and active period, which is typical for healthy adult cats.";
    } else if (ratio > 0.7 && ratio <= 1.2) {
      label = "High Activity Balance";
      subtext =
        "Your cat is quite active relative to resting time, which can be normal in playful or young cats.";
    } else {
      label = "Very High Activity Balance";
      subtext =
        "Your cat is very active compared to resting hours. Ensure your cat is not overstressed or anxious.";
      warning =
        "Excessive activity with little rest can lead to fatigue or stress. Monitor behavior closely.";
    }

    return {
      value: ratio.toFixed(2),
      label,
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal balance between resting and active hours for pets?",
      answer: "Most adult pets need 12-16 hours of rest daily, with remaining hours split between active play, training, and socializing. Puppies and senior pets require more rest (16-18 hours), while young adults thrive on 4-6 active hours.",
    },
    {
      question: "How does this tracker help me monitor my pet's daily routine?",
      answer: "By logging resting and active hours, you can identify patterns in your pet's behavior and ensure they're meeting species-specific rest requirements for optimal health and mood.",
    },
    {
      question: "Should I count naps and short rest periods separately?",
      answer: "Yes, log all rest periods including naps longer than 15 minutes to get an accurate picture of total rest time, which directly impacts your pet's energy levels and behavior.",
    },
    {
      question: "What counts as 'active hours' in this tracker?",
      answer: "Active hours include walking, playing, training, exploring, and any activity that elevates your pet's heart rate or mental engagement above baseline resting state.",
    },
    {
      question: "How often should I update the tracker for accuracy?",
      answer: "Log entries daily or every few days to maintain accurate averages; weekly reviews help identify imbalances before behavioral or health issues develop.",
    },
    {
      question: "Can this tracker work for multiple pets with different schedules?",
      answer: "Yes, create separate entries for each pet since age, breed, and health status affect ideal rest-to-activity ratios significantly.",
    },
    {
      question: "What should I do if my pet's active hours are consistently too low?",
      answer: "Gradually increase activity with age-appropriate exercise, enrichment toys, and interactive play sessions; consult a vet if lethargy persists despite increased opportunities for activity.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="restingHours" className="text-slate-700 dark:text-slate-300">
            Resting Hours (per 24-hour period)
          </Label>
          <Input
            id="restingHours"
            type="number"
            min={0}
            max={24}
            step={0.1}
            placeholder="e.g. 16"
            value={inputs.restingHours}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, restingHours: e.target.value }))
            }
            aria-describedby="restingHelp"
          />
          <p id="restingHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the average number of hours your cat rests or sleeps daily.
          </p>
        </div>

        <div>
          <Label htmlFor="activeHours" className="text-slate-700 dark:text-slate-300">
            Active Hours (per 24-hour period)
          </Label>
          <Input
            id="activeHours"
            type="number"
            min={0}
            max={24}
            step={0.1}
            placeholder="e.g. 6"
            value={inputs.activeHours}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, activeHours: e.target.value }))
            }
            aria-describedby="activeHelp"
          />
          <p id="activeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the average number of hours your cat is active, playing, or moving.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger calculation by updating inputs state (already reactive)
          }}
          aria-label="Calculate Resting vs Active Hours Balance"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ restingHours: "", activeHours: "" })}
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Active to Resting Hours Ratio
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Resting vs. Active Hours Balance Tracker (owner input)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you track and balance your pet's daily resting and active hours to ensure they meet age-specific health and behavioral needs. By logging these hours consistently, you can identify patterns that indicate whether your pet is getting optimal exercise and recovery.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's age, species, and breed, then log the hours your pet spends at rest (sleeping, napping, quiet lounging) versus actively engaged (playing, training, walking, exploring). Be as precise as possible, including even short naps and play sessions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The tracker compares your logged hours against evidence-based benchmarks for your pet's life stage and size. Results show whether your pet is underactive, balanced, or overactive, helping you adjust routines to support better health, mood, and behavior.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Rest vs. Active Hours by Pet Age */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Rest vs. Active Hours by Pet Age</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks to evaluate whether your pet's logged hours align with healthy development stages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Rest Hours (Minimum)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Active Hours (Target)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Considerations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppies (0-6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growth and immunity development require extended rest</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Young Dogs (6-18 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High energy but still developing—avoid overexertion</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Dogs (1-7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak activity capacity for most breeds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Dogs (7+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Joint health and reduced stamina require more rest</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kittens (0-6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Play sessions should be short and frequent</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Cats (1-10 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Indoor cats need structured activity time</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Cats (10+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Comfort and minimal stress are priorities</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rest hours should include nighttime sleep plus daytime naps. Active hours are cumulative across all activities.</p>
      </section>

      {/* TABLE: Activity Level Indicators and Rest-to-Activity Ratios */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Activity Level Indicators and Rest-to-Activity Ratios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Monitor these signs to assess if your logged hours match your pet's actual behavior patterns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level Classification</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rest:Active Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Behavioral Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Underactive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18:4 or worse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weight gain, lethargy, destructive behavior, excessive sleeping</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase playtime gradually by 15-30 minutes daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Balanced</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14:8 to 16:6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Alertness, healthy weight, good mood, consistent sleep patterns</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current routine with minor adjustments seasonally</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12:10 to 14:8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good energy without hyperactivity, responsive training, steady appetite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor for overexertion in hot weather or with seniors</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overactive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10:12 or more</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restlessness, sleep disruption, jumping/nipping, difficulty focusing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add calming enrichment, reduce high-intensity sessions, check stress levels</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rest ratios are expressed as hours of rest to hours of activity. Ratios vary by breed, health status, and seasonal factors.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a simple notebook or phone timer during the day to log active sessions, then transfer cumulative hours to the tracker weekly for accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rainy days and seasonal changes affect activity levels—track patterns across seasons to identify when your pet needs supplemental indoor enrichment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Puppies and senior pets need shorter, frequent activity bursts rather than one long session to prevent joint stress and overexertion.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your pet shows sudden changes in rest or activity patterns, log them for 2-3 weeks before consulting a vet to provide concrete behavioral data.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Counting passive sitting as active time</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Watching out a window or sitting nearby while you play doesn't count as active hours; only logged movement and engagement qualify.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring overnight sleep differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets sleeping 10 hours at night plus daytime naps may exceed recommended rest; don't overlook nighttime hours when calculating daily totals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using one-time activity spikes to set weekly averages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A single long hike or play session shouldn't skew your weekly average; aim for consistent daily activity levels rather than boom-and-bust patterns.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying adult benchmarks to puppies or seniors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using young-adult rest-to-activity ratios for puppies or elderly pets can lead to overexertion; always adjust expectations by life stage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal balance between resting and active hours for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most adult pets need 12-16 hours of rest daily, with remaining hours split between active play, training, and socializing. Puppies and senior pets require more rest (16-18 hours), while young adults thrive on 4-6 active hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this tracker help me monitor my pet's daily routine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">By logging resting and active hours, you can identify patterns in your pet's behavior and ensure they're meeting species-specific rest requirements for optimal health and mood.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I count naps and short rest periods separately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, log all rest periods including naps longer than 15 minutes to get an accurate picture of total rest time, which directly impacts your pet's energy levels and behavior.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What counts as 'active hours' in this tracker?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Active hours include walking, playing, training, exploring, and any activity that elevates your pet's heart rate or mental engagement above baseline resting state.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update the tracker for accuracy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Log entries daily or every few days to maintain accurate averages; weekly reviews help identify imbalances before behavioral or health issues develop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this tracker work for multiple pets with different schedules?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, create separate entries for each pet since age, breed, and health status affect ideal rest-to-activity ratios significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my pet's active hours are consistently too low?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gradually increase activity with age-appropriate exercise, enrichment toys, and interactive play sessions; consult a vet if lethargy persists despite increased opportunities for activity.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.akc.org/dog-breeds/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club – Exercise Needs by Breed</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official breed-specific exercise and activity recommendations to customize daily targets.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA – Pet Care and Behavior</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidelines on rest, activity, enrichment, and behavioral health for dogs and cats.</p>
          </li>
          <li>
            <a href="https://icatcare.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care – Activity and Enrichment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed advice on feline rest patterns, play behavior, and age-related activity adjustments.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/senior-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals – Senior Pet Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Medical guidance on rest requirements and safe activity modifications for aging dogs and cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Resting vs. Active Hours Balance Tracker (owner input)"
      description="Tool for owners to track and assess the balance between their cat's resting and active hours."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Balance Ratio = Active Hours ÷ Resting Hours",
        variables: [
          { symbol: "Active Hours", description: "Total hours cat is active per day" },
          { symbol: "Resting Hours", description: "Total hours cat is resting per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An owner observes their cat resting for 16 hours and being active for 6 hours in a 24-hour period.",
        steps: [
          {
            label: "1",
            explanation:
              "Input resting hours as 16 and active hours as 6 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the balance ratio: 6 ÷ 16 = 0.375, indicating moderate activity balance.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result as typical for a healthy adult cat with balanced rest and activity.",
          },
        ],
        result: "Balance Ratio = 0.38 (Moderate Activity Balance)",
      }}
      relatedCalculators={[
        {
          title: "Cat Carrier Size & Fit Guide",
          url: "/pets/cat-carrier-size-fit-guide",
          icon: "🐱",
        },
        {
          title: "Whelping Countdown & Stage Timeline",
          url: "/pets/dog-whelping-countdown-stage-timeline",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Cat Calorie Needs (RER/MER) Calculator",
          url: "/pets/cat-calorie-needs-rer-mer",
          icon: "🐱",
        },
        {
          title: "Dog Life Expectancy Estimator (lifestyle factors)",
          url: "/pets/dog-life-expectancy-estimator",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Resting vs. Active Hours Balance Tracker (owner input)",
        },
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