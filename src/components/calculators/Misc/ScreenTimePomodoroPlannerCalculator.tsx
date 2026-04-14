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

export default function ScreenTimePomodoroPlannerCalculator() {
  /**
   * Inputs:
   * - totalDailyScreenTime: number (hours) - total desired screen time per day
   * - pomodoroLength: number (minutes) - length of one Pomodoro interval
   * - shortBreakLength: number (minutes) - length of short break after each Pomodoro
   * - longBreakLength: number (minutes) - length of long break after a set of Pomodoros
   * - pomodorosBeforeLongBreak: number - how many Pomodoros before a long break
   */

  const [inputs, setInputs] = useState({
    totalDailyScreenTime: "",
    pomodoroLength: "25",
    shortBreakLength: "5",
    longBreakLength: "15",
    pomodorosBeforeLongBreak: "4",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Calculation logic:
   * 1. Convert totalDailyScreenTime to minutes.
   * 2. Calculate total time per Pomodoro cycle = pomodoroLength + shortBreakLength.
   * 3. After pomodorosBeforeLongBreak cycles, replace shortBreakLength with longBreakLength.
   * 4. Calculate how many full Pomodoro cycles fit into totalDailyScreenTime.
   * 5. Calculate total focused work time and total break time.
   * 6. Provide suggestions/warnings if inputs are unrealistic.
   */

  const results = useMemo(() => {
    const totalDailyScreenTime = Number(inputs.totalDailyScreenTime);
    const pomodoroLength = Number(inputs.pomodoroLength);
    const shortBreakLength = Number(inputs.shortBreakLength);
    const longBreakLength = Number(inputs.longBreakLength);
    const pomodorosBeforeLongBreak = Number(inputs.pomodorosBeforeLongBreak);

    if (
      !totalDailyScreenTime ||
      !pomodoroLength ||
      !shortBreakLength ||
      !longBreakLength ||
      !pomodorosBeforeLongBreak
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all fields with valid numbers greater than zero.",
        warning: null,
        formulaUsed: "",
      };
    }

    if (
      pomodoroLength <= 0 ||
      shortBreakLength < 0 ||
      longBreakLength < 0 ||
      pomodorosBeforeLongBreak <= 0 ||
      totalDailyScreenTime <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "All values must be positive numbers. Break lengths can be zero but not negative.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert total daily screen time to minutes
    const totalMinutes = totalDailyScreenTime * 60;

    // Calculate length of one Pomodoro cycle block (pomodoro + break)
    // But breaks vary: short breaks after each Pomodoro except after the last in a set, which has a long break
    // So we calculate total time for a full set of pomodorosBeforeLongBreak Pomodoros:
    // totalSetTime = (pomodoroLength * pomodorosBeforeLongBreak) + (shortBreakLength * (pomodorosBeforeLongBreak - 1)) + longBreakLength

    const totalSetTime =
      pomodoroLength * pomodorosBeforeLongBreak +
      shortBreakLength * (pomodorosBeforeLongBreak - 1) +
      longBreakLength;

    // Calculate how many full sets fit into totalMinutes
    const fullSets = Math.floor(totalMinutes / totalSetTime);

    // Remaining minutes after full sets
    const remainingMinutes = totalMinutes - fullSets * totalSetTime;

    // Calculate how many additional Pomodoros fit into remainingMinutes
    // Each Pomodoro except last has pomodoroLength + shortBreakLength, last only pomodoroLength
    let additionalPomodoros = 0;
    let timeUsed = 0;
    for (let i = 0; i < pomodorosBeforeLongBreak; i++) {
      const cycleTime = pomodoroLength + (i < pomodorosBeforeLongBreak - 1 ? shortBreakLength : 0);
      if (timeUsed + cycleTime <= remainingMinutes) {
        timeUsed += cycleTime;
        additionalPomodoros++;
      } else {
        break;
      }
    }

    const totalPomodoros = fullSets * pomodorosBeforeLongBreak + additionalPomodoros;

    // Total focused work time = totalPomodoros * pomodoroLength
    const totalFocusedMinutes = totalPomodoros * pomodoroLength;

    // Total break time = totalMinutes - totalFocusedMinutes
    const totalBreakMinutes = totalMinutes - totalFocusedMinutes;

    // Warn if totalPomodoros is zero or very low
    let warning = null;
    if (totalPomodoros === 0) {
      warning = "Your total daily screen time is too low for any Pomodoro interval with the given settings.";
    } else if (totalPomodoros < 2) {
      warning = "Consider increasing your total daily screen time or adjusting Pomodoro lengths for better productivity.";
    }

    // Format results nicely
    const value = `${totalPomodoros} Pomodoro${totalPomodoros > 1 ? "s" : ""}`;
    const label = `Estimated Pomodoro Intervals per Day`;
    const subtext = `Total focused work time: ${Math.floor(totalFocusedMinutes / 60)}h ${totalFocusedMinutes % 60}m, Total break time: ${Math.floor(totalBreakMinutes / 60)}h ${totalBreakMinutes % 60}m`;

    const formulaUsed =
      "Total Daily Screen Time (minutes) = Total Pomodoros × Pomodoro Length + Breaks (Short and Long)";

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Pomodoro Technique and how does it relate to screen time budgeting?",
      answer: "The Pomodoro Technique uses 25-minute focused work intervals followed by 5-minute breaks to boost productivity. This calculator helps allocate your daily screen time budget across multiple Pomodoro sessions to prevent burnout and eye strain.",
    },
    {
      question: "How many Pomodoro sessions can I fit into an 8-hour workday?",
      answer: "An 8-hour workday allows approximately 13-16 Pomodoro sessions (25 minutes each plus breaks). This calculator determines your optimal session count based on your total available hours and break preferences.",
    },
    {
      question: "What is a healthy daily screen time budget for adults?",
      answer: "Experts recommend limiting continuous screen time to 2-3 hours with 20-minute breaks every hour (20-20-20 rule). This calculator helps you distribute your work across Pomodoro sessions to stay within healthy limits.",
    },
    {
      question: "Can I customize break durations in the Pomodoro planner?",
      answer: "Yes, this calculator allows you to set custom work intervals and break lengths beyond the standard 25/5 split. Longer breaks (15-30 minutes) every 4 sessions can improve focus and reduce eye fatigue.",
    },
    {
      question: "How does the calculator account for total daily screen time limits?",
      answer: "The calculator tracks cumulative screen exposure by multiplying session duration by total sessions planned, then subtracts break time to show net screen hours. This reveals if your schedule exceeds recommended daily limits of 8-10 hours.",
    },
    {
      question: "What's the difference between work sessions and break time in the budget calculation?",
      answer: "Work sessions (default 25 minutes) count toward active screen time, while breaks reduce your overall screen exposure. The calculator separates these to show both gross time blocked and net screen consumption.",
    },
    {
      question: "How can I prevent screen fatigue when following this plan?",
      answer: "Use the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. This calculator's customizable intervals help you enforce this practice within your Pomodoro sessions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalDailyScreenTime" className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-blue-600" /> Total Daily Screen Time (hours)
              </Label>
              <Input
                id="totalDailyScreenTime"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 6"
                value={inputs.totalDailyScreenTime}
                onChange={(e) => handleInputChange("totalDailyScreenTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pomodoroLength" className="flex items-center gap-1">
                <ClockIcon /> Pomodoro Length (minutes)
              </Label>
              <Input
                id="pomodoroLength"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 25"
                value={inputs.pomodoroLength}
                onChange={(e) => handleInputChange("pomodoroLength", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="shortBreakLength" className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-600" /> Short Break Length (minutes)
              </Label>
              <Input
                id="shortBreakLength"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 5"
                value={inputs.shortBreakLength}
                onChange={(e) => handleInputChange("shortBreakLength", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="longBreakLength" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Long Break Length (minutes)
              </Label>
              <Input
                id="longBreakLength"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 15"
                value={inputs.longBreakLength}
                onChange={(e) => handleInputChange("longBreakLength", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pomodorosBeforeLongBreak" className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-indigo-600" /> Pomodoros Before Long Break
              </Label>
              <Input
                id="pomodorosBeforeLongBreak"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 4"
                value={inputs.pomodorosBeforeLongBreak}
                onChange={(e) => handleInputChange("pomodorosBeforeLongBreak", e.target.value)}
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
              totalDailyScreenTime: "",
              pomodoroLength: "25",
              shortBreakLength: "5",
              longBreakLength: "15",
              pomodorosBeforeLongBreak: "4",
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
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Screen Time Budget / Pomodoro Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you allocate your daily screen time into focused work sessions using the Pomodoro Technique, while tracking cumulative exposure to prevent eye strain and digital fatigue. It balances productivity goals with health recommendations by visualizing how many sessions fit into your available hours.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your total available work hours, preferred session duration (default 25 minutes), and break length (default 5 minutes). The calculator automatically computes how many complete Pomodoro cycles you can complete and your net screen time consumption.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results to ensure your plan stays within healthy limits (8-10 hours for professionals, 2-3 hours for leisure). Adjust session lengths and break frequencies if needed to reduce eye fatigue, then follow the schedule to maintain focus while protecting your health.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Screen Time Limits by Age and Activity */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Screen Time Limits by Age and Activity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These guidelines from health organizations help establish healthy screen budgets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Daily Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Work/Study Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Children (6-12 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 20 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Teens (13-18 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 25 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adults (Work)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 30-60 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adults (Leisure)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 20 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Older Adults (65+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 15 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Limits vary by individual health conditions and professional requirements.</p>
      </section>

      {/* TABLE: Pomodoro Session Planning: Time Breakdown Examples */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pomodoro Session Planning: Time Breakdown Examples</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">See how different session configurations fit into typical workdays.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Work Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Session Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sessions per Day</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Time Blocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Longer breaks every 4 sessions improve focus and reduce eye strain significantly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the standard 25/5 split for maximum productivity, but extend breaks to 15 minutes after every 4 sessions to reduce digital fatigue.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Apply the 20-20-20 rule during breaks: look at something 20 feet away for 20 seconds every 20 minutes to relieve eye strain.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your actual screen time for one week using the calculator to establish a realistic daily budget that matches your workload.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set phone notifications at break times to enforce the Pomodoro schedule and prevent mindless scrolling during work sessions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring break time in budget calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Breaks reduce active screen exposure; don't count them as screen time when calculating your total daily limit.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Scheduling too many sessions without longer breaks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Back-to-back Pomodoro sessions cause eye fatigue; insert 15-30 minute breaks every 4 sessions to maintain focus.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting unrealistic session lengths for your task type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Complex creative work may require 50-minute sessions, while admin tasks work better with 25-minute intervals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding recommended daily limits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Don't schedule more than 8-10 work hours daily; the calculator shows cumulative screen time to prevent overexposure.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Pomodoro Technique and how does it relate to screen time budgeting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Pomodoro Technique uses 25-minute focused work intervals followed by 5-minute breaks to boost productivity. This calculator helps allocate your daily screen time budget across multiple Pomodoro sessions to prevent burnout and eye strain.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many Pomodoro sessions can I fit into an 8-hour workday?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">An 8-hour workday allows approximately 13-16 Pomodoro sessions (25 minutes each plus breaks). This calculator determines your optimal session count based on your total available hours and break preferences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy daily screen time budget for adults?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Experts recommend limiting continuous screen time to 2-3 hours with 20-minute breaks every hour (20-20-20 rule). This calculator helps you distribute your work across Pomodoro sessions to stay within healthy limits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I customize break durations in the Pomodoro planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator allows you to set custom work intervals and break lengths beyond the standard 25/5 split. Longer breaks (15-30 minutes) every 4 sessions can improve focus and reduce eye fatigue.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator account for total daily screen time limits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator tracks cumulative screen exposure by multiplying session duration by total sessions planned, then subtracts break time to show net screen hours. This reveals if your schedule exceeds recommended daily limits of 8-10 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between work sessions and break time in the budget calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Work sessions (default 25 minutes) count toward active screen time, while breaks reduce your overall screen exposure. The calculator separates these to show both gross time blocked and net screen consumption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I prevent screen fatigue when following this plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds. This calculator's customizable intervals help you enforce this practice within your Pomodoro sessions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://pomodorotechnique.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Pomodoro Technique Official Website</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Founder Francesco Cirillo's official guide to the time-management method and its principles.</p>
          </li>
          <li>
            <a href="https://www.healthychildren.org/English/media/Pages/default.aspx" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Academy of Pediatrics: Screen Time Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for healthy screen time limits by age group.</p>
          </li>
          <li>
            <a href="https://www.thevisioncouncil.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vision Council: Digital Eye Strain Report 2024</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research data on eye strain prevalence and the 20-20-20 rule effectiveness.</p>
          </li>
          <li>
            <a href="https://hbr.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Harvard Business Review: The Science of Productivity and Breaks</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed strategies for optimal work intervals and recovery periods.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Screen Time Budget / Pomodoro Planner"
      description="Manage digital wellness with a screen time budget. Plan productive work intervals using the Pomodoro technique."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Daily Screen Time (minutes) = Total Pomodoros × Pomodoro Length + Breaks (Short and Long)",
        variables: [
          { symbol: "Total Daily Screen Time", description: "Your total allowed screen time in minutes" },
          { symbol: "Total Pomodoros", description: "Number of Pomodoro intervals planned" },
          { symbol: "Pomodoro Length", description: "Length of each focused work interval in minutes" },
          { symbol: "Breaks", description: "Sum of short and long breaks in minutes" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you want to limit your screen time to 6 hours daily and use the Pomodoro Technique with 25-minute work intervals, 5-minute short breaks, and a 15-minute long break after every 4 Pomodoros.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input 6 for total daily screen time, 25 for Pomodoro length, 5 for short break, 15 for long break, and 4 for Pomodoros before long break.",
          },
          {
            label: "Step 2",
            explanation:
              "Click Calculate to see how many Pomodoros fit into your 6-hour screen time budget.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator estimates 12 Pomodoros, with approximately 5 hours of focused work and 1 hour of breaks.",
          },
        ],
        result: "You can plan 12 focused Pomodoro intervals within your 6-hour screen time budget, balancing productivity and rest effectively.",
      }}
      relatedCalculators={[
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Mulch Coverage & Bag Count Calculator", url: "/everyday/mulch-coverage-bag-count", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday/coffee-urn-yield-strength", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
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

// Helper icon component for clock (not imported from lucide-react, so define here)
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className="w-4 h-4 text-yellow-600"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}