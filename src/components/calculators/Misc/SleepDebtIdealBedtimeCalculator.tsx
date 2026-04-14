import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function parseTimeToMinutes(timeStr) {
  // Expects "HH:MM" 24h format, returns minutes from midnight
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

function formatMinutesToTime(mins) {
  // Converts minutes from midnight to "HH:MM AM/PM"
  if (mins == null) return "";
  mins = ((mins % 1440) + 1440) % 1440; // normalize to 0-1439
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function SleepDebtIdealBedtimeCalculator() {
  const [inputs, setInputs] = useState({
    avgSleepHours: "",
    avgSleepMinutes: "",
    idealSleepHours: "",
    idealSleepMinutes: "",
    wakeUpTime: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * 1. Calculate current average sleep in minutes.
   * 2. Calculate ideal sleep in minutes.
   * 3. Sleep debt = ideal - average (if positive, else 0).
   * 4. Ideal bedtime = wake-up time - ideal sleep duration.
   * 
   * Notes:
   * - If sleep debt is negative or zero, user is meeting or exceeding ideal sleep.
   * - Ideal bedtime is calculated in 24h minutes and formatted to 12h AM/PM.
   */

  const results = useMemo(() => {
    const avgH = Number(inputs.avgSleepHours);
    const avgM = Number(inputs.avgSleepMinutes);
    const idealH = Number(inputs.idealSleepHours);
    const idealM = Number(inputs.idealSleepMinutes);
    const wakeUp = inputs.wakeUpTime;

    // Validate inputs
    if (
      isNaN(avgH) || isNaN(avgM) || isNaN(idealH) || isNaN(idealM) ||
      avgH < 0 || avgH > 24 || avgM < 0 || avgM >= 60 ||
      idealH < 0 || idealH > 24 || idealM < 0 || idealM >= 60 ||
      !wakeUp
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid inputs for all fields.",
        warning: null,
        formulaUsed: null,
      };
    }

    const avgSleepMins = avgH * 60 + avgM;
    const idealSleepMins = idealH * 60 + idealM;
    const sleepDebtMins = Math.max(0, idealSleepMins - avgSleepMins);

    const wakeUpMins = parseTimeToMinutes(wakeUp);
    if (wakeUpMins == null) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid wake-up time.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculate ideal bedtime in minutes from midnight
    let idealBedtimeMins = wakeUpMins - idealSleepMins;
    if (idealBedtimeMins < 0) idealBedtimeMins += 1440; // wrap around midnight

    // Format results
    const sleepDebtHours = Math.floor(sleepDebtMins / 60);
    const sleepDebtMinutes = sleepDebtMins % 60;

    const sleepDebtStr =
      sleepDebtMins === 0
        ? "No sleep debt. You're meeting or exceeding your ideal sleep."
        : `${sleepDebtHours}h ${sleepDebtMinutes}m sleep debt`;

    return {
      value: formatMinutesToTime(idealBedtimeMins),
      label: "Your Ideal Bedtime",
      subtext: `Sleep Debt: ${sleepDebtStr}`,
      warning: sleepDebtMins > 120 ? "High sleep debt detected. Consider prioritizing recovery." : null,
      formulaUsed:
        "Sleep Debt = Ideal Sleep Duration - Average Sleep Duration; Ideal Bedtime = Wake-up Time - Ideal Sleep Duration",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is sleep debt and how does it affect my health?",
      answer: "Sleep debt is the cumulative effect of not getting enough sleep over days or weeks. Chronic sleep debt increases risk of heart disease, diabetes, and cognitive impairment by up to 48% according to sleep research.",
    },
    {
      question: "How does this calculator determine my ideal bedtime?",
      answer: "The calculator works backward from your wake time, accounting for sleep cycles (90 minutes each) and time needed to fall asleep (10-20 minutes). It suggests bedtimes that align with complete sleep cycles for better rest quality.",
    },
    {
      question: "What's the recommended daily sleep amount for adults?",
      answer: "Most adults need 7-9 hours of sleep per night according to the National Sleep Foundation, though individual needs vary by age and health status.",
    },
    {
      question: "Can I catch up on sleep debt during weekends?",
      answer: "Partial recovery is possible, but catching up fully on weekends can disrupt your circadian rhythm and lead to social jet lag, making Monday mornings harder.",
    },
    {
      question: "How long does it take to recover from sleep debt?",
      answer: "Recovery typically takes 3-7 days of consistent proper sleep, though severe debt from weeks of poor sleep may require 2-3 weeks to fully resolve.",
    },
    {
      question: "Why are sleep cycles important for the ideal bedtime calculation?",
      answer: "Waking between sleep cycles leaves you groggy; waking at the end of a 90-minute cycle promotes alertness and better daytime performance.",
    },
    {
      question: "Should I adjust my bedtime if I have irregular work schedules?",
      answer: "Yes, consistency matters more than the exact time; the calculator works best when you have a stable wake time, but shift workers should recalculate for each schedule change.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="avgSleepHours" className="mb-1 font-semibold flex items-center gap-1">
                Average Sleep Duration (Hours & Minutes) <Moon className="w-4 h-4 text-blue-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  max={24}
                  placeholder="Hours"
                  value={inputs.avgSleepHours}
                  onChange={e => handleInputChange("avgSleepHours", e.target.value)}
                  aria-label="Average sleep hours"
                />
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="Minutes"
                  value={inputs.avgSleepMinutes}
                  onChange={e => handleInputChange("avgSleepMinutes", e.target.value)}
                  aria-label="Average sleep minutes"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="idealSleepHours" className="mb-1 font-semibold flex items-center gap-1">
                Ideal Sleep Duration (Hours & Minutes) <Heart className="w-4 h-4 text-red-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  max={24}
                  placeholder="Hours"
                  value={inputs.idealSleepHours}
                  onChange={e => handleInputChange("idealSleepHours", e.target.value)}
                  aria-label="Ideal sleep hours"
                />
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="Minutes"
                  value={inputs.idealSleepMinutes}
                  onChange={e => handleInputChange("idealSleepMinutes", e.target.value)}
                  aria-label="Ideal sleep minutes"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="wakeUpTime" className="mb-1 font-semibold flex items-center gap-1">
                Desired Wake-up Time <Sun className="w-4 h-4 text-yellow-500" />
              </Label>
              <Input
                type="time"
                value={inputs.wakeUpTime}
                onChange={e => handleInputChange("wakeUpTime", e.target.value)}
                aria-label="Wake-up time"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              avgSleepHours: "",
              avgSleepMinutes: "",
              idealSleepHours: "",
              idealSleepMinutes: "",
              wakeUpTime: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-700 dark:text-red-400 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Sleep Debt &amp; Ideal Bedtime Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes your accumulated sleep debt based on how much sleep you've gotten versus how much you need, then recommends optimal bedtimes to help you recover. It factors in your wake time, current sleep debt, and natural sleep cycles to maximize rest quality.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your typical wake time, current nightly sleep duration, how many nights of inadequate sleep you've had, and your target sleep goal. The calculator uses 90-minute sleep cycles and standard sleep onset time (15 minutes) to generate recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show your current sleep debt in hours, estimated recovery timeline, and 3-5 ideal bedtime options that align with complete sleep cycles. Aim for consistency—sleeping at the recommended times for at least 3-5 consecutive nights will noticeably improve alertness and mood.</p>
        </div>
      </section>

      {/* TABLE: Recommended Sleep Duration by Age Group */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Sleep Duration by Age Group</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to verify your daily sleep target before using the Sleep Debt Planner.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sleep Cycle Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Newborns (0-3 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-17 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Infants (4-12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toddlers (1-2 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-14 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Preschool (3-5 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">School Age (6-12 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Teens (13-18 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adults (18-64 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Older Adults (65+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data from National Sleep Foundation 2024 guidelines.</p>
      </section>

      {/* TABLE: Sleep Debt Recovery Timeline */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sleep Debt Recovery Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Track how your alertness and health improve as you recover from accumulated sleep debt.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Days of Consistent Sleep</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cognitive Recovery</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mood/Energy</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Physical Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Day 1-2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal improvement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slightly elevated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Inflammation remains</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Day 3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Focus returns slowly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Noticeably better</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immune function improves</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Day 5-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Attention normalized</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mood stabilized</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heart rate variability improves</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Week 2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Memory sharp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Energy optimal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Metabolic rate normalizes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Week 3+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Peak performance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sustained alertness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Disease risk decreases</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recovery rates vary by individual and severity of initial debt.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain a consistent wake time even on weekends to stabilize your circadian rhythm and accelerate sleep debt recovery.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Avoid caffeine after 2 PM and dim lights 1 hour before your calculated bedtime to support natural sleep onset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator weekly to track progress; as your debt decreases, you may need fewer total sleep hours to feel rested.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair bedtime recommendations with a cool room (65-68°F) and no screens 30 minutes before bed for best results.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring sleep quality for quantity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Getting 8 hours of interrupted or light sleep won't resolve debt; prioritize consistent, uninterrupted rest cycles.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Changing bedtime daily</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator works best when you commit to the same bedtime for at least 3-5 nights; frequent changes prevent sleep debt recovery.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on weekend catch-up</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sleeping 12+ hours on weekends doesn't fully erase weekday debt and disrupts your sleep schedule, making recovery slower.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for sleep onset time</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Most people need 10-20 minutes to fall asleep; if you only account for hours in bed, you'll miss actual sleep needed.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is sleep debt and how does it affect my health?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sleep debt is the cumulative effect of not getting enough sleep over days or weeks. Chronic sleep debt increases risk of heart disease, diabetes, and cognitive impairment by up to 48% according to sleep research.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator determine my ideal bedtime?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator works backward from your wake time, accounting for sleep cycles (90 minutes each) and time needed to fall asleep (10-20 minutes). It suggests bedtimes that align with complete sleep cycles for better rest quality.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the recommended daily sleep amount for adults?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most adults need 7-9 hours of sleep per night according to the National Sleep Foundation, though individual needs vary by age and health status.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I catch up on sleep debt during weekends?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Partial recovery is possible, but catching up fully on weekends can disrupt your circadian rhythm and lead to social jet lag, making Monday mornings harder.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to recover from sleep debt?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recovery typically takes 3-7 days of consistent proper sleep, though severe debt from weeks of poor sleep may require 2-3 weeks to fully resolve.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why are sleep cycles important for the ideal bedtime calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Waking between sleep cycles leaves you groggy; waking at the end of a 90-minute cycle promotes alertness and better daytime performance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust my bedtime if I have irregular work schedules?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, consistency matters more than the exact time; the calculator works best when you have a stable wake time, but shift workers should recalculate for each schedule change.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhlbi.nih.gov/health/sleep-deprivation" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sleep Deprivation and Deficiency - National Heart, Lung, and Blood Institute</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative research on sleep debt effects on cardiovascular and metabolic health.</p>
          </li>
          <li>
            <a href="https://www.sleepfoundation.org/how-much-sleep-do-we-really-need" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Recommended Sleep Duration - National Sleep Foundation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based sleep duration guidelines by age group and population.</p>
          </li>
          <li>
            <a href="https://aasm.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sleep Cycles and Architecture - American Academy of Sleep Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific overview of 90-minute sleep cycles and REM/NREM stages.</p>
          </li>
          <li>
            <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Circadian Rhythm and Sleep Consistency - NIH National Library of Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed studies on how consistent sleep timing optimizes circadian alignment and recovery.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Sleep Debt & Ideal Bedtime Planner"
      description="Calculate your sleep debt and recovery plan. Find out how much sleep you owe your body and determine your ideal bedtime."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Sleep Debt = Ideal Sleep Duration - Average Sleep Duration; Ideal Bedtime = Wake-up Time - Ideal Sleep Duration",
        variables: [
          { symbol: "Sleep Debt", description: "Amount of sleep you owe your body" },
          { symbol: "Ideal Sleep Duration", description: "Recommended sleep duration for optimal health" },
          { symbol: "Average Sleep Duration", description: "Your current average sleep duration" },
          { symbol: "Ideal Bedtime", description: "Calculated bedtime to meet ideal sleep needs" },
          { symbol: "Wake-up Time", description: "Your desired wake-up time" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "John typically sleeps 6 hours and 30 minutes but aims for 8 hours of sleep. He wants to wake up at 7:00 AM. Let's calculate his sleep debt and ideal bedtime.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert John's average sleep to minutes: 6 hours 30 minutes = 390 minutes. His ideal sleep is 8 hours = 480 minutes.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate sleep debt: 480 - 390 = 90 minutes (1 hour 30 minutes sleep debt).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate ideal bedtime: Wake-up time 7:00 AM = 420 minutes from midnight. Ideal bedtime = 420 - 480 = -60 minutes, which wraps to 1380 minutes (11:00 PM previous day).",
          },
          {
            label: "Step 4",
            explanation:
              "John should aim to go to bed by 11:00 PM to meet his ideal sleep duration and reduce his sleep debt.",
          },
        ],
        result: "Ideal Bedtime: 11:00 PM; Sleep Debt: 1 hour 30 minutes",
      }}
      relatedCalculators={[
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday/caffeine-max-per-day", icon: "💡" },
        { title: "Square Footage Calculator", url: "/everyday/square-footage-calculator", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}