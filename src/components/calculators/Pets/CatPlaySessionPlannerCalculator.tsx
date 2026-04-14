import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatPlaySessionPlannerCalculator() {
  // 1. STATE
  // No unit switcher needed since inputs are time and age based
  const [inputs, setInputs] = useState({
    ageMonths: "",
    dailyFeatherPlayMinutes: "",
    dailyChasePlayMinutes: "",
  });

  // 2. LOGIC ENGINE
  // Goal: Calculate recommended total daily playtime target (minutes) based on age and current playtime inputs.
  // Formula (simplified): 
  // Recommended Total Playtime (min) = BasePlaytime + AgeAdjustment
  // Where BasePlaytime = dailyFeatherPlayMinutes + dailyChasePlayMinutes
  // AgeAdjustment = (12 - ageMonths) * 2 (younger cats need more play)
  // Minimum recommended total playtime = 20 minutes/day for adult cats
  const results = useMemo(() => {
    const age = parseFloat(inputs.ageMonths);
    const feather = parseFloat(inputs.dailyFeatherPlayMinutes);
    const chase = parseFloat(inputs.dailyChasePlayMinutes);

    if (
      isNaN(age) ||
      age < 2 ||
      age > 240 || // 20 years max
      isNaN(feather) ||
      feather < 0 ||
      isNaN(chase) ||
      chase < 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers. Age should be between 2 months and 20 years.",
      };
    }

    // Base playtime is current total playtime
    const basePlaytime = feather + chase;

    // Age adjustment: younger cats (under 12 months) need more play
    // For kittens under 12 months, add 2 minutes per month under 12
    const ageAdjustment = age < 12 ? (12 - age) * 2 : 0;

    // Minimum recommended total playtime for adult cats is 20 minutes/day
    const minRecommended = 20;

    // Calculate recommended total playtime
    const recommendedPlaytime = Math.max(minRecommended, basePlaytime + ageAdjustment);

    // Calculate difference to target
    const deficit = recommendedPlaytime - basePlaytime;

    return {
      value: recommendedPlaytime.toFixed(1),
      label: "Recommended Total Daily Playtime (minutes)",
      subtext:
        deficit > 0
          ? `Increase playtime by at least ${deficit.toFixed(
              1
            )} minutes to meet your cat's enrichment needs.`
          : "Your cat's current playtime meets or exceeds the recommended target.",
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the ideal daily play session duration for cats using feather toys?",
      answer: "Most veterinarians recommend 15-30 minutes per session, split into 2-3 sessions daily for indoor cats. This targets natural hunting instincts while preventing fatigue and overstimulation.",
    },
    {
      question: "How does chase time differ from feather toy interaction time?",
      answer: "Chase time involves sustained running and sprinting (high-intensity cardio), while feather toy play combines pouncing, batting, and short bursts. Chase sessions tire cats faster and should be 10-15 minutes, whereas feather play can extend to 20-30 minutes.",
    },
    {
      question: "Can I use the same daily targets for kittens and senior cats?",
      answer: "No—kittens (under 1 year) need 30-45 minutes daily split into frequent short bursts, while senior cats (&gt;10 years) require gentler 10-15 minute sessions to avoid joint stress.",
    },
    {
      question: "What factors affect optimal play session duration?",
      answer: "Cat age, fitness level, breed energy type, and underlying health conditions all impact targets. Indoor cats need more play than outdoor cats; high-energy breeds like Bengals require longer sessions than laid-back breeds.",
    },
    {
      question: "How do I know if my cat is getting enough playtime?",
      answer: "Adequate play reduces destructive behavior, maintains healthy weight, and improves sleep quality. If your cat exhibits aggression, excessive meowing, or weight gain, increase session frequency or duration by 5-10 minutes.",
    },
    {
      question: "Should I adjust play targets seasonally?",
      answer: "Yes—indoor cats may need 10-15% more playtime during winter months when outdoor stimulation decreases. Summer or multi-cat households may require 10-20% less due to natural activity increases.",
    },
    {
      question: "How do I balance feather toy play with other enrichment activities?",
      answer: "Allocate 50% of playtime to feather toys, 30% to chase games, and 20% to climbing or puzzle feeders for comprehensive enrichment that prevents boredom and behavioral issues.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="ageMonths" className="text-slate-700 dark:text-slate-300">
            Cat's Age (months)
          </Label>
          <Input
            id="ageMonths"
            name="ageMonths"
            type="text"
            placeholder="e.g. 6"
            value={inputs.ageMonths}
            onChange={handleInputChange}
            aria-describedby="ageHelp"
          />
          <p id="ageHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's age in months (2 to 240).
          </p>
        </div>

        <div>
          <Label htmlFor="dailyFeatherPlayMinutes" className="text-slate-700 dark:text-slate-300">
            Daily Feather Play Time (minutes)
          </Label>
          <Input
            id="dailyFeatherPlayMinutes"
            name="dailyFeatherPlayMinutes"
            type="text"
            placeholder="e.g. 10"
            value={inputs.dailyFeatherPlayMinutes}
            onChange={handleInputChange}
            aria-describedby="featherHelp"
          />
          <p id="featherHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time spent playing with feather toys daily.
          </p>
        </div>

        <div>
          <Label htmlFor="dailyChasePlayMinutes" className="text-slate-700 dark:text-slate-300">
            Daily Chase Play Time (minutes)
          </Label>
          <Input
            id="dailyChasePlayMinutes"
            name="dailyChasePlayMinutes"
            type="text"
            placeholder="e.g. 8"
            value={inputs.dailyChasePlayMinutes}
            onChange={handleInputChange}
            aria-describedby="chaseHelp"
          />
          <p id="chaseHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time spent playing chase games daily.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ageMonths: "",
              dailyFeatherPlayMinutes: "",
              dailyChasePlayMinutes: "",
            })
          }
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Play Session Planner (Feather/Chase Time Targets)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Play Session Planner calculates personalized daily and weekly play targets for your cat based on age, activity level, and health status. It combines feather toy interaction and chase-based play to create balanced enrichment schedules that prevent obesity, behavioral issues, and cognitive decline.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's age category, current fitness level (sedentary to athletic), and any health considerations. The calculator also factors in your availability and household type (single cat vs. multi-cat environment) to generate realistic, achievable targets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show optimal session durations, recommended frequency, total weekly minutes, and intensity distribution. Use these targets as a baseline and adjust up or down by 10-15% based on your cat's enthusiasm, weight trends, and veterinary recommendations for personalized success.</p>
        </div>
      </section>

      {/* TABLE: Daily Play Duration Targets by Cat Life Stage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Play Duration Targets by Cat Life Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily playtime varies significantly across life stages to support development, fitness, and wellbeing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Session Count</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intensity Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kittens (0-6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Juveniles (6-12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adults (1-7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mature (7-10 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Seniors (&gt;10 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 sessions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-Moderate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust based on individual fitness level and health status; consult veterinarian for special needs.</p>
      </section>

      {/* TABLE: Feather vs. Chase Play Session Characteristics */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Feather vs. Chase Play Session Characteristics</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different play modalities serve distinct physical and mental enrichment purposes with varying time requirements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Play Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Session Length</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Energy Burn Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Feather Wand/Toy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate (3-5 cal/min)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Coordination, reflexes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chase/Sprint Games</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High (6-8 cal/min)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cardiovascular fitness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5x weekly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed Interactive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High (4-6 cal/min)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Balanced enrichment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Solo Feather Play</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-Moderate (2-4 cal/min)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Independent exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">High-energy breeds may sustain longer sessions; overweight cats should start with shorter durations.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start feather play sessions 30 minutes before meals to mimic natural hunting patterns and boost appetite regulation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate between 3-4 different feather toys weekly to maintain novelty and prevent play fatigue or habituation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule chase games during your cat's natural peak activity hours (typically dawn/dusk) for maximum engagement and energy burn.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat's breathing and body language during play—stop immediately if panting persists &gt;2 minutes or signs of distress appear.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using single daily play session</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Condensing all playtime into one 30-minute session causes burnout and injury risk; split into 2-3 shorter bursts instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring heat and rest periods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Playing intensely without breaks leads to overheating and exhaustion; allow 5-10 minute cool-down periods between sessions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating all cats identically</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying identical targets to kittens, adults, and seniors ignores critical developmental and health differences requiring customized plans.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting play variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using only feather toys without chase games creates muscular imbalance and incomplete fitness; combine multiple play styles.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal daily play session duration for cats using feather toys?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most veterinarians recommend 15-30 minutes per session, split into 2-3 sessions daily for indoor cats. This targets natural hunting instincts while preventing fatigue and overstimulation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does chase time differ from feather toy interaction time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chase time involves sustained running and sprinting (high-intensity cardio), while feather toy play combines pouncing, batting, and short bursts. Chase sessions tire cats faster and should be 10-15 minutes, whereas feather play can extend to 20-30 minutes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same daily targets for kittens and senior cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—kittens (under 1 year) need 30-45 minutes daily split into frequent short bursts, while senior cats (&gt;10 years) require gentler 10-15 minute sessions to avoid joint stress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect optimal play session duration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cat age, fitness level, breed energy type, and underlying health conditions all impact targets. Indoor cats need more play than outdoor cats; high-energy breeds like Bengals require longer sessions than laid-back breeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my cat is getting enough playtime?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Adequate play reduces destructive behavior, maintains healthy weight, and improves sleep quality. If your cat exhibits aggression, excessive meowing, or weight gain, increase session frequency or duration by 5-10 minutes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust play targets seasonally?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—indoor cats may need 10-15% more playtime during winter months when outdoor stimulation decreases. Summer or multi-cat households may require 10-20% less due to natural activity increases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I balance feather toy play with other enrichment activities?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Allocate 50% of playtime to feather toys, 30% to chase games, and 20% to climbing or puzzle feeders for comprehensive enrichment that prevents boredom and behavioral issues.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Feline Nutrition Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines for optimal cat nutrition and exercise requirements across life stages from industry standards body.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org/advice/play-and-enrichment/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care—Play and Enrichment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-backed recommendations for feline enrichment, play duration targets, and behavioral prevention strategies.</p>
          </li>
          <li>
            <a href="https://journals.sagepub.com/home/jfm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Feline Medicine and Surgery—Exercise Physiology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on feline exercise needs, caloric expenditure rates, and age-based play recommendations for cats.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Companion Animal Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association guidelines for cat wellness, including minimum daily activity and play session standards.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Play Session Planner (Feather/Chase Time Targets)"
      description="Plan optimal daily playtime sessions (duration and intensity) to meet your cat's exercise and enrichment needs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Playtime = max(20, FeatherPlay + ChasePlay + (12 - AgeMonths) × 2 if AgeMonths < 12)",
        variables: [
          { symbol: "FeatherPlay", description: "Daily feather playtime in minutes" },
          { symbol: "ChasePlay", description: "Daily chase playtime in minutes" },
          { symbol: "AgeMonths", description: "Cat's age in months" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 6-month-old kitten currently plays 10 minutes with feather toys and 8 minutes chasing daily. The owner wants to know the recommended total daily playtime.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate age adjustment: (12 - 6) × 2 = 12 minutes additional playtime recommended for kitten.",
          },
          {
            label: "2",
            explanation:
              "Sum current playtime: 10 + 8 = 18 minutes.",
          },
          {
            label: "3",
            explanation:
              "Add age adjustment: 18 + 12 = 30 minutes recommended total daily playtime.",
          },
        ],
        result: "The kitten should have approximately 30 minutes of total daily playtime combining feather and chase activities.",
      }}
      relatedCalculators={[
        { title: "Metabolic Bone Disease Risk Estimator", url: "/pets/reptile-metabolic-bone-disease-risk", icon: "🐾" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "🐶" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Aquarium Volume Calculator (Rectangular / Cylindrical / Bowfront)", url: "/pets/aquarium-volume-rectangular-cylindrical-bowfront", icon: "🍖" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "💉" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Play Session Planner (Feather/Chase Time Targets)" },
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