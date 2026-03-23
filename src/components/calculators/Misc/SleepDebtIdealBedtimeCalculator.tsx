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
      question: "What is sleep debt and why does it matter?",
      answer:
        "Sleep debt refers to the cumulative difference between the amount of sleep you need and the amount you actually get. Over time, this debt can impair cognitive function, mood, and overall health. Managing sleep debt is crucial for maintaining optimal physical and mental performance.",
    },
    {
      question: "How accurate is the ideal bedtime calculation?",
      answer:
        "The ideal bedtime calculation is based on your desired wake-up time minus your ideal sleep duration. While it provides a scientifically grounded estimate, individual factors such as sleep quality, circadian rhythms, and lifestyle can influence the best bedtime for you.",
    },
    {
      question: "Can I recover from sleep debt quickly?",
      answer:
        "Partial recovery from sleep debt can occur with one or two nights of extended sleep, but chronic sleep deprivation requires consistent, adequate rest over time. Prioritizing regular sleep schedules and healthy sleep hygiene is essential for full recovery.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Sleep Debt & Ideal Bedtime Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Sleep debt accumulates when you consistently get less sleep than your body requires for optimal functioning. This deficit can impair cognitive abilities, weaken immune response, and increase the risk of chronic diseases such as diabetes and cardiovascular conditions. The ideal bedtime planner helps you align your sleep schedule with your body's needs and your daily commitments, ensuring you wake up refreshed and ready to perform at your best. By calculating your sleep debt and suggesting an ideal bedtime based on your desired wake-up time, this tool empowers you to take control of your sleep health proactively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use this calculator, input your current average sleep duration, your ideal sleep duration based on personal or professional recommendations, and your desired wake-up time. The calculator will then determine your sleep debt and suggest the ideal bedtime to meet your sleep needs. This approach helps you identify how much sleep you owe your body and plan your nights accordingly to optimize recovery and daily performance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your average sleep duration in hours and minutes, reflecting your typical nightly sleep over the past week.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your ideal sleep duration, which is generally recommended to be between 7-9 hours for most adults.
          </li>
          <li>
            <strong>Step 3:</strong> Select your desired wake-up time, which will be used to calculate your ideal bedtime.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view your sleep debt and ideal bedtime.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to adjust your sleep schedule and reduce sleep debt over time.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prioritizing consistent sleep schedules and good sleep hygiene is essential for reducing sleep debt and improving overall health. Avoid caffeine and heavy meals close to bedtime, maintain a cool and dark sleeping environment, and limit screen exposure before sleep to enhance sleep quality. If you experience persistent sleep difficulties or excessive daytime sleepiness despite adequate sleep duration, consult a healthcare professional to rule out sleep disorders such as insomnia or sleep apnea. Remember, while catching up on sleep occasionally can help, chronic sleep debt requires sustained behavioral changes for full recovery.
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
              href="https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Sleep Hygiene Tips <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The Centers for Disease Control and Prevention provides comprehensive guidelines on sleep hygiene and the importance of adequate sleep for health.
            </p>
          </li>
          <li>
            <a
              href="https://www.sleepfoundation.org/how-sleep-works/what-is-sleep-debt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Sleep Foundation - What is Sleep Debt? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This resource explains the concept of sleep debt, its effects on health, and strategies to recover from it effectively.
            </p>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health-topics/sleep-deprivation-and-deficiency"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Heart, Lung, and Blood Institute - Sleep Deprivation <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NHLBI offers detailed information on the health consequences of sleep deprivation and recommendations for healthy sleep habits.
            </p>
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