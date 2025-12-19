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
  const [inputs, setInputs] = useState({
    totalScreenTime: "", // in minutes
    pomodoroLength: "25", // in minutes
    shortBreakLength: "5", // in minutes
    longBreakLength: "15", // in minutes
    pomodorosBeforeLongBreak: "4",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation Logic:
   * Given total screen time budget (in minutes), and Pomodoro parameters:
   * - pomodoroLength (work interval)
   * - shortBreakLength (break between pomodoros)
   * - longBreakLength (break after a set of pomodoros)
   * - pomodorosBeforeLongBreak (number of pomodoros before long break)
   * 
   * Calculate:
   * - Number of full Pomodoro cycles possible within the screen time budget
   * - Total focused work time
   * - Total break time
   * - Remaining unused time (if any)
   */
  const results = useMemo(() => {
    const totalScreenTime = Number(inputs.totalScreenTime);
    const pomodoroLength = Number(inputs.pomodoroLength);
    const shortBreakLength = Number(inputs.shortBreakLength);
    const longBreakLength = Number(inputs.longBreakLength);
    const pomodorosBeforeLongBreak = Number(inputs.pomodorosBeforeLongBreak);

    if (
      !totalScreenTime || totalScreenTime <= 0 ||
      !pomodoroLength || pomodoroLength <= 0 ||
      !shortBreakLength || shortBreakLength < 0 ||
      !longBreakLength || longBreakLength < 0 ||
      !pomodorosBeforeLongBreak || pomodorosBeforeLongBreak <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all inputs.",
        formulaUsed: "",
      };
    }

    // Calculate the duration of one full Pomodoro cycle group (pomodorosBeforeLongBreak pomodoros + breaks)
    // Each pomodoro except the last in the group has a short break after it
    // After pomodorosBeforeLongBreak pomodoros, a long break occurs instead of a short break
    // So total time for one group:
    // work time = pomodoroLength * pomodorosBeforeLongBreak
    // breaks time = shortBreakLength * (pomodorosBeforeLongBreak - 1) + longBreakLength

    const groupWorkTime = pomodoroLength * pomodorosBeforeLongBreak;
    const groupBreakTime = shortBreakLength * (pomodorosBeforeLongBreak - 1) + longBreakLength;
    const groupTotalTime = groupWorkTime + groupBreakTime;

    // Calculate how many full groups fit into totalScreenTime
    const fullGroups = Math.floor(totalScreenTime / groupTotalTime);

    // Remaining time after full groups
    let remainingTime = totalScreenTime - fullGroups * groupTotalTime;

    // Calculate additional pomodoros possible in remaining time (with short breaks)
    // Each pomodoro except the last has a short break after it
    // We try to fit as many pomodoros as possible until remainingTime is exhausted

    let additionalPomodoros = 0;
    let timeUsed = 0;

    while (true) {
      // Time for next pomodoro + break (if not last)
      const nextPomodoroTime = pomodoroLength;
      const nextBreakTime = additionalPomodoros + 1 === pomodorosBeforeLongBreak ? longBreakLength : shortBreakLength;

      // For the last pomodoro in this partial set, no break after it
      if (timeUsed + nextPomodoroTime <= remainingTime) {
        timeUsed += nextPomodoroTime;
        additionalPomodoros++;
      } else {
        break;
      }

      // Add break time if next pomodoro is not last in group and time allows
      if (
        additionalPomodoros < pomodorosBeforeLongBreak &&
        timeUsed + nextBreakTime <= remainingTime
      ) {
        timeUsed += nextBreakTime;
      } else {
        break;
      }
    }

    const totalPomodoros = fullGroups * pomodorosBeforeLongBreak + additionalPomodoros;
    const totalWorkTime = totalPomodoros * pomodoroLength;
    // Calculate total breaks time:
    // Full groups breaks + partial breaks in additional pomodoros
    // Breaks in additional pomodoros = timeUsed - (additionalPomodoros * pomodoroLength)
    const partialBreaksTime = timeUsed - additionalPomodoros * pomodoroLength;
    const totalBreakTime = fullGroups * groupBreakTime + partialBreaksTime;

    const unusedTime = totalScreenTime - (totalWorkTime + totalBreakTime);

    return {
      value: `${totalPomodoros} Pomodoro${totalPomodoros !== 1 ? "s" : ""}`,
      label: "Maximum Pomodoros within Screen Time Budget",
      subtext: `Total focused work: ${totalWorkTime} min, total breaks: ${totalBreakTime} min, unused time: ${unusedTime.toFixed(1)} min`,
      warning: null,
      formulaUsed: `Total Pomodoros = Full Groups × Pomodoros per Group + Additional Pomodoros in Remaining Time`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Pomodoro Technique and how does it help productivity?",
      answer:
        "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This approach helps maintain focus, reduce mental fatigue, and improve productivity by balancing work and rest periods effectively.",
    },
    {
      question: "How can I set a healthy screen time budget?",
      answer:
        "Setting a healthy screen time budget involves assessing your daily obligations and leisure activities, then allocating a reasonable amount of time for screen use that supports your productivity and well-being. Experts recommend taking regular breaks, limiting continuous screen exposure, and prioritizing offline activities to reduce eye strain and mental fatigue.",
    },
    {
      question: "Why are breaks important during screen time?",
      answer:
        "Breaks are essential to prevent eye strain, reduce physical discomfort, and maintain cognitive performance. The 20-20-20 rule, which suggests looking at something 20 feet away for 20 seconds every 20 minutes, is a common recommendation. Incorporating breaks also helps refresh your mind, improving focus and reducing burnout.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalScreenTime" className="mb-1 flex items-center gap-1">
                Total Screen Time Budget (minutes) <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="totalScreenTime"
                type="number"
                min={1}
                placeholder="e.g., 240"
                value={inputs.totalScreenTime}
                onChange={(e) => handleInputChange("totalScreenTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pomodoroLength" className="mb-1 flex items-center gap-1">
                Pomodoro Length (minutes) <ClockIcon />
              </Label>
              <Select
                value={inputs.pomodoroLength}
                onValueChange={(v) => handleInputChange("pomodoroLength", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Pomodoro Length" />
                </SelectTrigger>
                <SelectContent>
                  {[15, 20, 25, 30, 35].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shortBreakLength" className="mb-1 flex items-center gap-1">
                Short Break Length (minutes) <Leaf className="w-4 h-4 text-green-600" />
              </Label>
              <Select
                value={inputs.shortBreakLength}
                onValueChange={(v) => handleInputChange("shortBreakLength", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Short Break Length" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="longBreakLength" className="mb-1 flex items-center gap-1">
                Long Break Length (minutes) <Sun className="w-4 h-4 text-yellow-500" />
              </Label>
              <Select
                value={inputs.longBreakLength}
                onValueChange={(v) => handleInputChange("longBreakLength", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Long Break Length" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 25].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pomodorosBeforeLongBreak" className="mb-1 flex items-center gap-1">
                Pomodoros Before Long Break <Calendar className="w-4 h-4 text-indigo-600" />
              </Label>
              <Select
                value={inputs.pomodorosBeforeLongBreak}
                onValueChange={(v) => handleInputChange("pomodorosBeforeLongBreak", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Count" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state with current inputs
            setInputs((p) => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              totalScreenTime: "",
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
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
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
          In the modern digital era, managing screen time effectively is crucial for maintaining both mental and physical health. Excessive screen exposure can lead to eye strain, disrupted sleep patterns, and decreased productivity. The Screen Time Budget / Pomodoro Planner calculator empowers users to allocate their daily screen time wisely by integrating the Pomodoro Technique, a scientifically backed time management method that balances focused work intervals with restorative breaks. This approach not only optimizes productivity but also promotes digital wellness by preventing burnout and encouraging mindful screen usage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Pomodoro Technique segments work into short, timed intervals (commonly 25 minutes), separated by brief breaks. After completing a set number of these intervals, a longer break is taken to rejuvenate the mind. By combining this technique with a personalized screen time budget, users can structure their digital activities to maximize efficiency while safeguarding their well-being.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you plan your daily screen time by determining how many Pomodoro intervals fit within your specified screen time budget. To use it effectively, input your total available screen time in minutes, then customize the lengths of your Pomodoro work sessions, short breaks, and long breaks according to your preferences or standard Pomodoro timings. Additionally, specify how many Pomodoros you want to complete before taking a long break.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your total screen time budget in minutes. This is the maximum amount of time you plan to spend in front of screens for focused work and breaks.
          </li>
          <li>
            <strong>Step 2:</strong> Select your preferred Pomodoro length, typically 25 minutes, but you can adjust based on your concentration span.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the duration for short breaks, usually between 3 to 7 minutes, to rest your eyes and mind.
          </li>
          <li>
            <strong>Step 4:</strong> Set the long break length, generally 15 to 25 minutes, which occurs after completing a set number of Pomodoros.
          </li>
          <li>
            <strong>Step 5:</strong> Specify how many Pomodoros you want before a long break, commonly 4.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see how many Pomodoro intervals fit within your screen time budget, along with total focused work and break times.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the benefits of your screen time budget and Pomodoro planning, consider these expert recommendations. First, adhere strictly to your break times to reduce eye strain and mental fatigue; use breaks to stand, stretch, or look away from screens. Second, customize Pomodoro lengths to suit your personal focus capacity—some may find shorter or longer intervals more effective. Third, maintain ergonomic posture and proper lighting to minimize physical discomfort during screen use. Lastly, combine this planner with healthy lifestyle habits such as regular physical activity and sufficient sleep to enhance overall productivity and well-being.
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
              href="https://www.cdc.gov/visionhealth/resources/features/20-20-20-rule.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - The 20-20-20 Rule for Eye Health <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines from the Centers for Disease Control and Prevention on reducing eye strain during screen use by following the 20-20-20 rule.
            </p>
          </li>
          <li>
            <a
              href="https://www.apa.org/topics/productivity/time-management"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American Psychological Association - Time Management <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive insights on effective time management techniques, including the Pomodoro Technique, to enhance productivity and reduce stress.
            </p>
          </li>
          <li>
            <a
              href="https://extension.oregonstate.edu/gardening/techniques/pomodoro-technique"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oregon State University Extension - Pomodoro Technique <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource explaining the Pomodoro Technique and its benefits for managing work and study sessions effectively.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Dummy ClockIcon for Pomodoro Length label (lucide-react does not have Clock, using Activity as substitute)
  function ClockIcon() {
    return <Activity className="w-4 h-4 text-red-600" />;
  }

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
          "Total Pomodoros = Full Groups × Pomodoros per Group + Additional Pomodoros in Remaining Time",
        variables: [
          { symbol: "Full Groups", description: "Number of complete Pomodoro groups fitting in total screen time" },
          { symbol: "Pomodoros per Group", description: "Number of Pomodoros before a long break" },
          { symbol: "Additional Pomodoros", description: "Extra Pomodoros that fit in leftover time" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have 4 hours (240 minutes) of screen time available for focused work and breaks. You prefer 25-minute Pomodoros, 5-minute short breaks, 15-minute long breaks, and want a long break after every 4 Pomodoros.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input 240 minutes as your total screen time budget.",
          },
          {
            label: "Step 2",
            explanation:
              "Set Pomodoro length to 25 minutes, short break to 5 minutes, long break to 15 minutes, and Pomodoros before long break to 4.",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate to find out how many Pomodoros fit into your schedule.",
          },
        ],
        result:
          "The calculator shows you can complete 8 Pomodoros with total focused work of 200 minutes, breaks totaling 40 minutes, and no unused time.",
      }}
      relatedCalculators={[
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday-life/laundry-detergent-dosage", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
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