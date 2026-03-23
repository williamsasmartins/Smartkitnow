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
      question: "What is the Pomodoro Technique and how does it help productivity?",
      answer:
        "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It breaks work into focused intervals, traditionally 25 minutes long, separated by short breaks. This approach helps maintain high levels of concentration, reduces mental fatigue, and improves overall productivity by balancing work and rest periods.",
    },
    {
      question: "Why should I limit my daily screen time?",
      answer:
        "Limiting daily screen time is essential for maintaining eye health, reducing digital fatigue, and improving mental well-being. Excessive screen exposure can lead to issues such as eye strain, disrupted sleep patterns, and decreased physical activity. Setting a screen time budget helps create healthier digital habits and promotes a balanced lifestyle.",
    },
    {
      question: "Can I customize Pomodoro intervals and breaks?",
      answer:
        "Absolutely. While the traditional Pomodoro interval is 25 minutes with 5-minute short breaks and a 15-minute long break after four intervals, this calculator allows you to customize these durations to fit your personal workflow and preferences. Adjusting these settings can optimize your productivity and comfort.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Screen Time Budget / Pomodoro Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In today’s digital age, managing screen time is crucial for maintaining both physical and mental health. Excessive screen exposure can lead to eye strain, disrupted sleep, and decreased productivity. The Screen Time Budget / Pomodoro Planner combines two powerful concepts: setting a daily limit on screen usage and structuring work into focused intervals using the Pomodoro Technique. This dual approach helps users optimize their digital wellness by balancing productive work sessions with restorative breaks, ultimately fostering sustainable work habits and reducing burnout.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Pomodoro Technique, developed in the late 1980s, segments work into intervals (traditionally 25 minutes) separated by short breaks, with longer breaks after several intervals. By budgeting your total screen time and planning Pomodoro cycles within that budget, you can maximize focus, minimize fatigue, and ensure that your digital activities remain purposeful and health-conscious.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you plan your daily screen time by estimating how many Pomodoro intervals fit within your desired screen time budget. You can customize the length of your Pomodoro work sessions, short breaks, long breaks, and how many Pomodoros you want before taking a long break. Simply input your values, then click "Calculate" to see your personalized Pomodoro plan.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your total desired daily screen time in hours. This is the maximum amount of time you want to spend looking at screens for work or study.
          </li>
          <li>
            <strong>Step 2:</strong> Set your preferred Pomodoro length (default is 25 minutes). This is your focused work interval.
          </li>
          <li>
            <strong>Step 3:</strong> Define your short break length (default is 5 minutes) and long break length (default is 15 minutes). These breaks help your mind and eyes rest.
          </li>
          <li>
            <strong>Step 4:</strong> Specify how many Pomodoros you want to complete before taking a long break (default is 4).
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see how many Pomodoro intervals fit into your screen time budget, along with total focused work and break times.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the benefits of your screen time budget and Pomodoro planning, consider these expert recommendations. First, always listen to your body—if you experience eye strain or fatigue, increase break durations or reduce screen time accordingly. Use the 20-20-20 rule during breaks: every 20 minutes, look at something 20 feet away for at least 20 seconds to reduce eye strain. Additionally, ensure your workspace is ergonomically optimized to prevent posture-related issues during long screen sessions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember that flexibility is key; adjust Pomodoro and break lengths to suit your personal workflow and energy levels. Incorporate physical movement during breaks to boost circulation and mental clarity. Finally, avoid screen exposure at least an hour before bedtime to promote healthy sleep patterns, as blue light from screens can disrupt circadian rhythms.
        </p>
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

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.cdc.gov/ncbddd/childdevelopment/screen-time.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Children and Screen Time <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines from the Centers for Disease Control and Prevention on recommended screen time limits and its impact on health.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/office-energy-efficiency-renewable-energy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy.gov - Time Management and Productivity <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Resources on effective time management techniques, including the Pomodoro Technique, to enhance productivity and energy efficiency.
            </p>
          </li>
          <li>
            <a
              href="https://extension.oregonstate.edu/gardening/techniques/using-pomodoro-technique-improve-focus"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oregon State University Extension - Using Pomodoro Technique to Improve Focus <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed explanation of the Pomodoro Technique and practical tips for applying it to improve concentration and work habits.
            </p>
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