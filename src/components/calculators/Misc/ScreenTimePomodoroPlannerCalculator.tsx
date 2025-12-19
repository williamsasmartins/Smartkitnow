import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ScreenTimePomodoroPlannerCalculator() {
  // Inputs:
  // dailyAvailableMinutes: total minutes user can spend on screens daily (e.g. 480 for 8 hours)
  // pomodoroWorkMinutes: length of one Pomodoro work interval (default 25)
  // pomodoroBreakMinutes: length of one Pomodoro short break (default 5)
  // longBreakMinutes: length of long break after N pomodoros (default 15)
  // pomodorosBeforeLongBreak: how many pomodoros before a long break (default 4)
  // desiredPomodoros: how many pomodoros user wants to complete in the day

  const [inputs, setInputs] = useState({
    dailyAvailableMinutes: "",
    pomodoroWorkMinutes: "25",
    pomodoroBreakMinutes: "5",
    longBreakMinutes: "15",
    pomodorosBeforeLongBreak: "4",
    desiredPomodoros: "",
  });

  const handleInputChange = useCallback((n, v) => {
    // Allow only numbers for numeric inputs
    if (
      [
        "dailyAvailableMinutes",
        "pomodoroWorkMinutes",
        "pomodoroBreakMinutes",
        "longBreakMinutes",
        "pomodorosBeforeLongBreak",
        "desiredPomodoros",
      ].includes(n)
    ) {
      // Remove non-digit characters except empty string
      if (v === "" || /^\d+$/.test(v)) {
        setInputs((p) => ({ ...p, [n]: v }));
      }
    } else {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  const results = useMemo(() => {
    // Parse inputs as integers
    const dailyAvailableMinutes = parseInt(inputs.dailyAvailableMinutes, 10);
    const pomodoroWorkMinutes = parseInt(inputs.pomodoroWorkMinutes, 10);
    const pomodoroBreakMinutes = parseInt(inputs.pomodoroBreakMinutes, 10);
    const longBreakMinutes = parseInt(inputs.longBreakMinutes, 10);
    const pomodorosBeforeLongBreak = parseInt(inputs.pomodorosBeforeLongBreak, 10);
    const desiredPomodoros = parseInt(inputs.desiredPomodoros, 10);

    // Validate inputs
    if (
      isNaN(dailyAvailableMinutes) || dailyAvailableMinutes <= 0 ||
      isNaN(pomodoroWorkMinutes) || pomodoroWorkMinutes <= 0 ||
      isNaN(pomodoroBreakMinutes) || pomodoroBreakMinutes < 0 ||
      isNaN(longBreakMinutes) || longBreakMinutes < 0 ||
      isNaN(pomodorosBeforeLongBreak) || pomodorosBeforeLongBreak <= 0 ||
      (inputs.desiredPomodoros !== "" && (isNaN(desiredPomodoros) || desiredPomodoros <= 0))
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers in all required fields.",
        warning: "Invalid input detected.",
        formulaUsed: "",
      };
    }

    // Calculate total time per pomodoro cycle (work + break)
    // After pomodorosBeforeLongBreak pomodoros, break is longBreakMinutes instead of pomodoroBreakMinutes
    // For example, if pomodorosBeforeLongBreak = 4:
    // Pomodoro 1-3: work + short break
    // Pomodoro 4: work + long break

    // Calculate total time for one full cycle of pomodorosBeforeLongBreak pomodoros:
    // totalWorkTime = pomodoroWorkMinutes * pomodorosBeforeLongBreak
    // totalBreakTime = pomodoroBreakMinutes * (pomodorosBeforeLongBreak - 1) + longBreakMinutes

    const totalWorkTime = pomodoroWorkMinutes * pomodorosBeforeLongBreak;
    const totalBreakTime = pomodoroBreakMinutes * (pomodorosBeforeLongBreak - 1) + longBreakMinutes;
    const fullCycleTime = totalWorkTime + totalBreakTime;

    // Calculate how many full cycles fit into dailyAvailableMinutes
    const fullCyclesPossible = Math.floor(dailyAvailableMinutes / fullCycleTime);

    // Calculate remaining minutes after full cycles
    const remainingMinutes = dailyAvailableMinutes - fullCyclesPossible * fullCycleTime;

    // Calculate how many additional pomodoros can fit into remainingMinutes
    // Each pomodoro except the last in the partial cycle has work + short break
    // The last pomodoro in partial cycle has work only (no break after it)
    let additionalPomodoros = 0;
    let timeUsed = 0;
    for (let i = 1; i <= pomodorosBeforeLongBreak; i++) {
      // For pomodoros 1 to pomodorosBeforeLongBreak - 1: work + short break
      // For pomodoro pomodorosBeforeLongBreak: work only (no break)
      const pomodoroTime = pomodoroWorkMinutes + (i < pomodorosBeforeLongBreak ? pomodoroBreakMinutes : 0);
      if (timeUsed + pomodoroTime <= remainingMinutes) {
        timeUsed += pomodoroTime;
        additionalPomodoros++;
      } else {
        break;
      }
    }

    // Total pomodoros possible in the day
    const totalPomodorosPossible = fullCyclesPossible * pomodorosBeforeLongBreak + additionalPomodoros;

    // If user entered desiredPomodoros, calculate total time needed for that many pomodoros
    // Calculate how many full cycles and leftover pomodoros needed to reach desiredPomodoros
    let totalTimeNeeded = null;
    let canCompleteDesired = null;
    if (!isNaN(desiredPomodoros) && desiredPomodoros > 0) {
      const fullCyclesNeeded = Math.floor(desiredPomodoros / pomodorosBeforeLongBreak);
      const leftoverPomodoros = desiredPomodoros % pomodorosBeforeLongBreak;

      // Time for full cycles
      let timeForFullCycles = fullCyclesNeeded * fullCycleTime;

      // Time for leftover pomodoros
      // For leftover pomodoros:
      // (leftoverPomodoros - 1) * (work + short break) + work (no break after last)
      let timeForLeftover = 0;
      if (leftoverPomodoros > 0) {
        timeForLeftover =
          pomodoroWorkMinutes * leftoverPomodoros +
          pomodoroBreakMinutes * (leftoverPomodoros - 1);
      }

      totalTimeNeeded = timeForFullCycles + timeForLeftover;

      canCompleteDesired = totalTimeNeeded <= dailyAvailableMinutes;
    }

    // Format results nicely
    function formatMinutesToHrsMins(mins) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      if (h > 0 && m > 0) return `${h} hour${h > 1 ? "s" : ""} and ${m} minute${m > 1 ? "s" : ""}`;
      if (h > 0) return `${h} hour${h > 1 ? "s" : ""}`;
      return `${m} minute${m > 1 ? "s" : ""}`;
    }

    let value = null;
    let label = "";
    let subtext = "";
    let warning = null;
    let formulaUsed = "";

    if (inputs.desiredPomodoros !== "") {
      // Show time needed and feasibility
      value = formatMinutesToHrsMins(totalTimeNeeded);
      label = `Total Time Needed for ${desiredPomodoros} Pomodoro${desiredPomodoros > 1 ? "s" : ""}`;
      subtext = canCompleteDesired
        ? "You can complete your desired Pomodoros within your daily screen time budget."
        : "Your desired Pomodoros exceed your daily screen time budget. Consider adjusting your goals or schedule.";
      formulaUsed = `Total Time = (Full Cycles × Cycle Time) + (Leftover Pomodoros × (Work + Break))\nCycle Time = (Work × Pomodoros Before Long Break) + (Short Break × (Pomodoros Before Long Break - 1)) + Long Break`;
    } else if (inputs.dailyAvailableMinutes !== "") {
      // Show max pomodoros possible
      value = totalPomodorosPossible;
      label = "Maximum Pomodoros Possible Today";
      subtext = `Based on your daily screen time budget of ${formatMinutesToHrsMins(dailyAvailableMinutes)} and Pomodoro settings.`;
      formulaUsed = `Pomodoros Possible = Full Cycles × Pomodoros Before Long Break + Additional Pomodoros in Remaining Time\nFull Cycle Time = Work × Pomodoros Before Long Break + Short Break × (Pomodoros Before Long Break - 1) + Long Break`;
    } else {
      value = null;
      label = "";
      subtext = "Enter your daily available screen time or desired Pomodoros to see results.";
      formulaUsed = "";
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a Pomodoro and how does the Pomodoro Technique improve productivity?",
      answer:
        "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It breaks work into focused intervals, typically 25 minutes long, called 'Pomodoros', separated by short breaks. This structure helps maintain high concentration, reduces mental fatigue, and combats procrastination by creating a sense of urgency and regular rest periods, ultimately improving productivity and focus.",
    },
    {
      question: "How can setting a daily screen time budget benefit my digital wellness?",
      answer:
        "Setting a daily screen time budget helps you consciously manage and limit the amount of time spent on digital devices, reducing eye strain, improving sleep quality, and promoting better mental health. It encourages mindful usage, preventing digital burnout and fostering a healthier balance between online and offline activities, which is essential in today’s technology-driven world.",
    },
    {
      question: "Why are long breaks important in the Pomodoro cycle?",
      answer:
        "Long breaks, typically taken after completing several Pomodoros (e.g., 4), are crucial for deeper mental recovery. They allow your brain to rest more fully, reduce accumulated stress, and improve overall cognitive function. These extended breaks help prevent burnout and maintain sustained productivity throughout the day, making the Pomodoro Technique more effective over longer periods.",
    },
    {
      question: "Can I customize the Pomodoro intervals and breaks in this planner?",
      answer:
        "Absolutely! This planner allows you to customize the length of your work intervals, short breaks, long breaks, and the number of Pomodoros before a long break. Tailoring these settings to your personal preferences or work style can enhance comfort and effectiveness, ensuring the technique fits your unique productivity rhythm.",
    },
    {
      question: "How does this calculator handle partial Pomodoro cycles within my screen time budget?",
      answer:
        "The calculator intelligently accounts for partial Pomodoro cycles by fitting as many full cycles as possible into your daily screen time budget, then calculating how many additional Pomodoros can fit into the remaining time. It considers that the last Pomodoro in a partial cycle does not require a break afterward, providing an accurate estimate of achievable Pomodoros.",
    },
    {
      question: "What should I do if my desired Pomodoros exceed my daily screen time budget?",
      answer:
        "If your desired Pomodoros require more time than your daily screen time budget allows, consider adjusting your goals by reducing the number of Pomodoros, shortening work intervals, or increasing your available screen time if possible. Alternatively, prioritize high-impact tasks within your Pomodoros to maximize productivity within your constraints.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dailyAvailableMinutes" className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
              Daily Available Screen Time (minutes)
            </Label>
            <Input
              id="dailyAvailableMinutes"
              type="text"
              placeholder="e.g. 480"
              value={inputs.dailyAvailableMinutes}
              onChange={(e) => handleInputChange("dailyAvailableMinutes", e.target.value)}
              aria-describedby="dailyAvailableMinutesHelp"
            />
            <p id="dailyAvailableMinutesHelp" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Total minutes you plan to spend on screens today (e.g., 8 hours = 480 minutes).
            </p>
          </div>

          <div>
            <Label htmlFor="desiredPomodoros" className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
              Desired Number of Pomodoros (optional)
            </Label>
            <Input
              id="desiredPomodoros"
              type="text"
              placeholder="e.g. 8"
              value={inputs.desiredPomodoros}
              onChange={(e) => handleInputChange("desiredPomodoros", e.target.value)}
              aria-describedby="desiredPomodorosHelp"
            />
            <p id="desiredPomodorosHelp" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter how many Pomodoros you want to complete today to see total time needed.
            </p>
          </div>

          <div>
            <Label htmlFor="pomodoroWorkMinutes" className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
              Pomodoro Work Interval (minutes)
            </Label>
            <Input
              id="pomodoroWorkMinutes"
              type="text"
              value={inputs.pomodoroWorkMinutes}
              onChange={(e) => handleInputChange("pomodoroWorkMinutes", e.target.value)}
              aria-describedby="pomodoroWorkMinutesHelp"
            />
            <p id="pomodoroWorkMinutesHelp" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Length of focused work time per Pomodoro (default is 25 minutes).
            </p>
          </div>

          <div>
            <Label htmlFor="pomodoroBreakMinutes" className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
              Short Break Interval (minutes)
            </Label>
            <Input
              id="pomodoroBreakMinutes"
              type="text"
              value={inputs.pomodoroBreakMinutes}
              onChange={(e) => handleInputChange("pomodoroBreakMinutes", e.target.value)}
              aria-describedby="pomodoroBreakMinutesHelp"
            />
            <p id="pomodoroBreakMinutesHelp" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Length of short breaks between Pomodoros (default is 5 minutes).
            </p>
          </div>

          <div>
            <Label htmlFor="longBreakMinutes" className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
              Long Break Interval (minutes)
            </Label>
            <Input
              id="longBreakMinutes"
              type="text"
              value={inputs.longBreakMinutes}
              onChange={(e) => handleInputChange("longBreakMinutes", e.target.value)}
              aria-describedby="longBreakMinutesHelp"
            />
            <p id="longBreakMinutesHelp" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Length of long breaks after several Pomodoros (default is 15 minutes).
            </p>
          </div>

          <div>
            <Label htmlFor="pomodorosBeforeLongBreak" className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
              Pomodoros Before Long Break
            </Label>
            <Input
              id="pomodorosBeforeLongBreak"
              type="text"
              value={inputs.pomodorosBeforeLongBreak}
              onChange={(e) => handleInputChange("pomodorosBeforeLongBreak", e.target.value)}
              aria-describedby="pomodorosBeforeLongBreakHelp"
            />
            <p id="pomodorosBeforeLongBreakHelp" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Number of Pomodoros before taking a long break (default is 4).
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate screen time and Pomodoro plan"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              dailyAvailableMinutes: "",
              pomodoroWorkMinutes: "25",
              pomodoroBreakMinutes: "5",
              longBreakMinutes: "15",
              pomodorosBeforeLongBreak: "4",
              desiredPomodoros: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 whitespace-pre-line">{results.subtext}</p>
            {results.warning && (
              <p className="text-red-600 dark:text-red-400 mt-2 font-semibold">{results.warning}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pomodoro Technique is a powerful time management strategy designed to enhance focus and productivity by breaking work into manageable intervals called Pomodoros. Each Pomodoro typically lasts 25 minutes of focused work followed by a short break, usually 5 minutes. After completing several Pomodoros, a longer break is taken to allow deeper mental rest. This cyclical approach helps maintain sustained concentration while preventing burnout.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In parallel, managing your daily screen time budget is essential for digital wellness. Excessive screen exposure can lead to eye strain, disrupted sleep, and decreased mental well-being. By setting a clear limit on your daily screen usage and integrating the Pomodoro Technique within this budget, you can optimize both your productivity and health. This planner helps you balance focused work sessions with mindful screen time management, ensuring you make the most of your digital hours without overextending yourself.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you plan your daily screen time and Pomodoro work intervals by calculating either the maximum number of Pomodoros you can complete within your available screen time or the total time required to complete your desired number of Pomodoros. To get accurate and personalized results, follow these detailed steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your <em>Daily Available Screen Time</em> in minutes. This is the total time you plan to spend on screens for work, study, or leisure during the day. For example, 480 minutes equals 8 hours.
          </li>
          <li>
            <strong>Step 2:</strong> Optionally, enter your <em>Desired Number of Pomodoros</em> if you have a specific productivity goal. Leave blank if you want to know how many Pomodoros fit into your screen time budget.
          </li>
          <li>
            <strong>Step 3:</strong> Customize your Pomodoro settings:
            <ul className="list-disc pl-5 mt-1">
              <li><em>Pomodoro Work Interval:</em> Length of focused work time per Pomodoro (default 25 minutes).</li>
              <li><em>Short Break Interval:</em> Length of short breaks between Pomodoros (default 5 minutes).</li>
              <li><em>Long Break Interval:</em> Length of long breaks after completing several Pomodoros (default 15 minutes).</li>
              <li><em>Pomodoros Before Long Break:</em> Number of Pomodoros before taking a long break (default 4).</li>
            </ul>
          </li>
          <li>
            <strong>Step 4:</strong> Click the <em>Calculate</em> button to see your results. The calculator will display either the maximum Pomodoros you can complete or the total time needed for your desired Pomodoros, along with helpful notes.
          </li>
          <li>
            <strong>Step 5:</strong> Use the <em>Reset</em> button to clear all inputs and start fresh whenever needed.
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
          `Total Time Needed = (Full Cycles × Cycle Time) + (Leftover Pomodoros × (Work + Break))\n` +
          `Cycle Time = (Work × Pomodoros Before Long Break) + (Short Break × (Pomodoros Before Long Break - 1)) + Long Break\n` +
          `Pomodoros Possible = Full Cycles × Pomodoros Before Long Break + Additional Pomodoros in Remaining Time`,
        variables: [
          { symbol: "Work", description: "Length of one Pomodoro work interval (minutes)" },
          { symbol: "Short Break", description: "Length of short break between Pomodoros (minutes)" },
          { symbol: "Long Break", description: "Length of long break after several Pomodoros (minutes)" },
          { symbol: "Pomodoros Before Long Break", description: "Number of Pomodoros before a long break" },
          { symbol: "Full Cycles", description: "Number of complete Pomodoro cycles fitting in daily screen time" },
          { symbol: "Leftover Pomodoros", description: "Pomodoros in partial cycle after full cycles" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you have 6 hours (360 minutes) available for screen time today. You want to use the Pomodoro Technique with 25-minute work intervals, 5-minute short breaks, and a 15-minute long break after every 4 Pomodoros. You wonder how many Pomodoros you can complete or how much time you need to complete 10 Pomodoros.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the total time for one full Pomodoro cycle of 4 Pomodoros: (25 × 4) + (5 × 3) + 15 = 100 + 15 + 15 = 130 minutes.",
          },
          {
            label: "Step 2",
            explanation:
              "Determine how many full cycles fit into 360 minutes: 360 ÷ 130 = 2 full cycles (260 minutes).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate remaining time: 360 - 260 = 100 minutes. Fit additional Pomodoros in this time: each Pomodoro with short break is 30 minutes (25 + 5), except the last which has no break.",
          },
          {
            label: "Step 4",
            explanation:
              "You can fit 3 more Pomodoros: 25 + 5 + 25 + 5 + 25 = 85 minutes, which is less than 100 minutes remaining.",
          },
          {
            label: "Step 5",
            explanation:
              "Total Pomodoros possible today: 2 full cycles × 4 + 3 = 11 Pomodoros.",
          },
          {
            label: "Step 6",
            explanation:
              "If you want to complete exactly 10 Pomodoros, total time needed is 2 full cycles (130 × 2 = 260 minutes) plus 2 Pomodoros (25 + 5 + 25 = 55 minutes), totaling 315 minutes, which fits within your 360-minute budget.",
          },
        ],
        result: "You can complete up to 11 Pomodoros in 6 hours, or complete 10 Pomodoros in 5 hours and 15 minutes.",
      }}
      relatedCalculators={[
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Home Renovation Cost Estimator", url: "/everyday-life/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}