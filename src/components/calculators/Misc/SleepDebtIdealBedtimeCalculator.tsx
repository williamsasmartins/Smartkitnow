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

function formatTime(decimalHours: number) {
  // Convert decimal hours to hh:mm AM/PM format
  let totalMinutes = Math.round(decimalHours * 60);
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440; // normalize to 0-1439
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export default function SleepDebtIdealBedtimeCalculator() {
  /**
   * Inputs:
   * - averageSleepHours: number (average hours slept per night in past week)
   * - idealSleepHours: number (ideal recommended sleep hours per night)
   * - usualWakeUpTime: string (HH:mm 24h format)
   * - recoveryDays: number (optional, days planned to recover sleep debt)
   */

  const [inputs, setInputs] = useState({
    averageSleepHours: "",
    idealSleepHours: "",
    usualWakeUpTime: "",
    recoveryDays: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse time string "HH:mm" to decimal hours (0-24)
  const parseTimeToDecimal = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h + m / 60;
  };

  const results = useMemo(() => {
    const avgSleep = parseFloat(inputs.averageSleepHours);
    const idealSleep = parseFloat(inputs.idealSleepHours);
    const wakeTimeDecimal = parseTimeToDecimal(inputs.usualWakeUpTime);
    const recoveryDays = inputs.recoveryDays ? parseInt(inputs.recoveryDays) : null;

    if (
      isNaN(avgSleep) ||
      isNaN(idealSleep) ||
      idealSleep <= 0 ||
      avgSleep < 0 ||
      avgSleep > 24 ||
      !wakeTimeDecimal ||
      (recoveryDays !== null && (isNaN(recoveryDays) || recoveryDays <= 0))
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid inputs for all fields.",
        formulaUsed: null,
      };
    }

    // Calculate sleep debt per night (ideal - average), if positive
    const sleepDebtPerNight = idealSleep - avgSleep > 0 ? idealSleep - avgSleep : 0;

    // Total sleep debt over 7 days (assuming past week)
    const totalSleepDebt = sleepDebtPerNight * 7;

    // If no sleep debt, no recovery needed
    if (totalSleepDebt === 0) {
      return {
        value: "No Sleep Debt",
        label: "You are meeting your ideal sleep needs.",
        subtext:
          "Your average sleep matches or exceeds your ideal sleep duration. Keep maintaining your healthy sleep habits!",
        warning: null,
        formulaUsed:
          "Sleep Debt = max(0, Ideal Sleep Hours - Average Sleep Hours) × 7 days",
      };
    }

    // Calculate ideal bedtime to recover sleep debt
    // If recoveryDays provided, divide total debt by recoveryDays to find extra sleep needed per night
    // Then subtract from usual wake time to get bedtime
    let extraSleepPerNight = totalSleepDebt;
    let recoveryPlan = "";
    if (recoveryDays && recoveryDays > 0) {
      extraSleepPerNight = totalSleepDebt / recoveryDays;
      recoveryPlan = `To recover your sleep debt in ${recoveryDays} day(s), you need to sleep an additional ${extraSleepPerNight.toFixed(
        2
      )} hours per night.`;
    } else {
      recoveryPlan =
        "No recovery days specified. Consider sleeping extra hours until your sleep debt is repaid.";
    }

    // Ideal bedtime = wake time - (ideal sleep hours + extra sleep per night)
    // But since idealSleepHours already includes normal sleep, extraSleepPerNight is the additional needed
    // So bedtime = wakeTimeDecimal - idealSleepHours - extraSleepPerNight
    // However, this would double count idealSleepHours, so better to say bedtime = wakeTimeDecimal - (idealSleepHours + extraSleepPerNight)
    // But extraSleepPerNight includes idealSleepHours? No, extraSleepPerNight is totalSleepDebt/recoveryDays, which is additional hours needed per night.
    // So total sleep needed per night during recovery = idealSleepHours + extraSleepPerNight
    // Bedtime = wakeTimeDecimal - (idealSleepHours + extraSleepPerNight)
    const totalSleepNeeded = idealSleep + extraSleepPerNight;
    let idealBedtimeDecimal = wakeTimeDecimal - totalSleepNeeded;
    if (idealBedtimeDecimal < 0) idealBedtimeDecimal += 24;

    // Format bedtime nicely
    const idealBedtimeFormatted = formatTime(idealBedtimeDecimal);

    return {
      value: idealBedtimeFormatted,
      label: "Ideal Bedtime to Recover Sleep Debt",
      subtext: `${recoveryPlan} Your usual wake-up time is ${formatTime(
        wakeTimeDecimal
      )}. To fully recover, go to bed by ${idealBedtimeFormatted}.`,
      warning: null,
      formulaUsed:
        "Total Sleep Debt = max(0, Ideal Sleep Hours - Average Sleep Hours) × 7 days\n" +
        "Extra Sleep per Night = Total Sleep Debt ÷ Recovery Days\n" +
        "Ideal Bedtime = Usual Wake Time - (Ideal Sleep Hours + Extra Sleep per Night)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is sleep debt and why does it matter?",
      answer:
        "Sleep debt is the cumulative difference between the amount of sleep your body needs and the amount you actually get. Over time, insufficient sleep accumulates as 'debt,' which can impair cognitive function, weaken the immune system, and increase the risk of chronic health conditions. Understanding and managing sleep debt helps maintain optimal health and daily performance.",
    },
    {
      question: "How is my ideal sleep duration determined?",
      answer:
        "Ideal sleep duration varies by age, lifestyle, and individual needs. Most adults require 7-9 hours per night for optimal health. Factors such as stress, physical activity, and overall health can influence your ideal sleep time. This calculator allows you to input your personal ideal sleep hours based on recommendations or your own experience.",
    },
    {
      question: "Can I recover sleep debt by sleeping extra on weekends?",
      answer:
        "While catching up on sleep during weekends can partially alleviate sleep debt, it is not a perfect solution. Irregular sleep patterns can disrupt your circadian rhythm, leading to 'social jet lag.' Consistently maintaining adequate sleep each night is the best approach to prevent and recover from sleep debt effectively.",
    },
    {
      question: "How does this calculator determine my ideal bedtime?",
      answer:
        "The calculator uses your usual wake-up time, ideal sleep duration, and calculated sleep debt to estimate the bedtime needed to recover lost sleep. It factors in how many days you plan to recover your sleep debt, distributing the extra sleep needed evenly across those days to suggest a realistic bedtime.",
    },
    {
      question: "What if I don’t specify recovery days?",
      answer:
        "If you do not specify recovery days, the calculator assumes you want to know your ideal bedtime based on your current sleep debt without a fixed recovery timeline. It will suggest the bedtime needed to fully repay your sleep debt in one night, which may be impractical, so specifying recovery days helps create a manageable sleep recovery plan.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="averageSleepHours" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Average Sleep Hours (Past Week)
            </Label>
            <Input
              id="averageSleepHours"
              type="number"
              min="0"
              max="24"
              step="0.1"
              placeholder="e.g., 6.5"
              value={inputs.averageSleepHours}
              onChange={(e) => handleInputChange("averageSleepHours", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter your average nightly sleep duration over the past 7 days.
            </p>
          </div>

          <div>
            <Label htmlFor="idealSleepHours" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Ideal Sleep Hours per Night
            </Label>
            <Input
              id="idealSleepHours"
              type="number"
              min="0"
              max="24"
              step="0.1"
              placeholder="e.g., 8"
              value={inputs.idealSleepHours}
              onChange={(e) => handleInputChange("idealSleepHours", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter your recommended or desired sleep duration per night.
            </p>
          </div>

          <div>
            <Label htmlFor="usualWakeUpTime" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Usual Wake-Up Time
            </Label>
            <Input
              id="usualWakeUpTime"
              type="time"
              value={inputs.usualWakeUpTime}
              onChange={(e) => handleInputChange("usualWakeUpTime", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter the time you usually wake up (24-hour format).
            </p>
          </div>

          <div>
            <Label htmlFor="recoveryDays" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Recovery Days (Optional)
            </Label>
            <Input
              id="recoveryDays"
              type="number"
              min="1"
              step="1"
              placeholder="e.g., 3"
              value={inputs.recoveryDays}
              onChange={(e) => handleInputChange("recoveryDays", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Number of days you plan to recover your sleep debt.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No special action needed, results update automatically
            }}
          >
            <Moon className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setInputs({
                averageSleepHours: "",
                idealSleepHours: "",
                usualWakeUpTime: "",
                recoveryDays: "",
              })
            }
            className="flex-1 h-11"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-4 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400 whitespace-pre-line">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 font-semibold">
                <AlertTriangle className="inline-block mr-1 h-4 w-4" /> {results.warning}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Sleep debt is a concept that quantifies the cumulative amount of sleep you have missed relative to your body's ideal needs. Just like financial debt, sleep debt accumulates over time when you consistently get less sleep than your body requires. This deficit can impair your cognitive functions, mood, immune system, and overall health. Recognizing and managing sleep debt is crucial for maintaining optimal physical and mental well-being.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Your ideal sleep duration varies based on factors such as age, lifestyle, and individual health conditions. Most adults need between 7 to 9 hours of sleep per night to function at their best. When you sleep less than this recommended amount, your body builds up sleep debt. This calculator helps you understand how much sleep debt you have accumulated over the past week and guides you to plan an ideal bedtime to recover and restore your sleep balance effectively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to help you quantify your sleep debt and determine the ideal bedtime to recover it based on your usual wake-up time. Follow these detailed steps to get the most accurate and helpful results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your <em>average sleep hours</em> over the past 7 days. This should reflect the typical amount of sleep you have been getting each night.
          </li>
          <li>
            <strong>Step 2:</strong> Input your <em>ideal sleep hours</em> per night. This is the amount of sleep you believe you need to feel rested and function optimally.
          </li>
          <li>
            <strong>Step 3:</strong> Provide your <em>usual wake-up time</em> in 24-hour format. This helps the calculator determine your bedtime based on when you need to wake up.
          </li>
          <li>
            <strong>Step 4 (Optional):</strong> Specify the number of <em>recovery days</em> you plan to use to repay your sleep debt. This allows the calculator to suggest a realistic bedtime that spreads extra sleep over multiple nights.
          </li>
          <li>
            <strong>Step 5:</strong> Click the <em>Calculate</em> button to see your ideal bedtime and detailed recovery plan.
          </li>
          <li>
            <strong>Step 6:</strong> Review the results and adjust your sleep schedule accordingly to reduce your sleep debt and improve your overall health.
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
      title="Sleep Debt & Ideal Bedtime Planner"
      description="Calculate your sleep debt and recovery plan. Find out how much sleep you owe your body and determine your ideal bedtime."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Sleep Debt = max(0, Ideal Sleep Hours - Average Sleep Hours) × 7 days\n" +
          "Extra Sleep per Night = Total Sleep Debt ÷ Recovery Days\n" +
          "Ideal Bedtime = Usual Wake Time - (Ideal Sleep Hours + Extra Sleep per Night)",
        variables: [
          { symbol: "Ideal Sleep Hours", description: "Your recommended sleep duration per night" },
          { symbol: "Average Sleep Hours", description: "Your average sleep duration per night over the past week" },
          { symbol: "Total Sleep Debt", description: "Total hours of sleep missed over 7 days" },
          { symbol: "Recovery Days", description: "Number of days planned to recover sleep debt" },
          { symbol: "Usual Wake Time", description: "Your typical wake-up time in decimal hours" },
          { symbol: "Ideal Bedtime", description: "Calculated bedtime to recover sleep debt" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Jane has been sleeping an average of 6 hours per night over the past week, but her ideal sleep duration is 8 hours. She usually wakes up at 7:00 AM and wants to recover her sleep debt over 3 days.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate Jane's sleep debt per night: 8 hours (ideal) - 6 hours (average) = 2 hours sleep debt per night.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total sleep debt over 7 days: 2 hours × 7 = 14 hours total sleep debt.",
          },
          {
            label: "Step 3",
            explanation:
              "Determine extra sleep needed per night to recover in 3 days: 14 hours ÷ 3 days ≈ 4.67 hours extra per night.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate total sleep needed per night during recovery: 8 hours (ideal) + 4.67 hours (extra) ≈ 12.67 hours.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate ideal bedtime: 7:00 AM wake-up time minus 12.67 hours = 6:20 PM the previous evening.",
          },
          {
            label: "Step 6",
            explanation:
              "Jane should aim to go to bed by approximately 6:20 PM for the next 3 days to fully recover her sleep debt.",
          },
        ],
        result: "Ideal bedtime: 6:20 PM to recover 14 hours of sleep debt over 3 days.",
      }}
      relatedCalculators={[
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday-life/hose-runtime-flow-rate", icon: "💧" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
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