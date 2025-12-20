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

export default function HydrationReminderIntervalCalculator() {
  /**
   * Inputs:
   * - dailyIntakeLiters: number (total water intake goal per day in liters)
   * - awakeHours: number (hours awake per day)
   * - reminderDurationMinutes: number (duration of reminder notification)
   * - reminderLeadTimeMinutes: number (lead time before next drink)
   * - activityLevel: string (sedentary, moderate, active) - affects hydration needs
   */

  const [inputs, setInputs] = useState({
    dailyIntakeLiters: "",
    awakeHours: "",
    reminderDurationMinutes: "",
    reminderLeadTimeMinutes: "",
    activityLevel: "moderate",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * 1. Validate inputs: daily intake and awake hours must be positive numbers.
   * 2. Adjust daily intake based on activity level:
   *    - Sedentary: no change
   *    - Moderate: +10% water
   *    - Active: +25% water
   * 3. Calculate total awake minutes = awakeHours * 60
   * 4. Calculate ideal number of reminders = total awake minutes / (ideal interval)
   *    - Ideal interval = (total awake minutes) / (number of drinks)
   * 5. Number of drinks = daily intake liters / typical drink volume (assumed 250 ml)
   * 6. Calculate reminder interval in minutes = awakeMinutes / numberOfDrinks
   * 7. Adjust interval by subtracting reminder lead time and duration to avoid overlap
   */

  const results = useMemo(() => {
    const dailyIntakeLiters = parseFloat(inputs.dailyIntakeLiters);
    const awakeHours = parseFloat(inputs.awakeHours);
    const reminderDurationMinutes = parseInt(inputs.reminderDurationMinutes);
    const reminderLeadTimeMinutes = parseInt(inputs.reminderLeadTimeMinutes);
    const activityLevel = inputs.activityLevel;

    if (
      isNaN(dailyIntakeLiters) ||
      dailyIntakeLiters <= 0 ||
      isNaN(awakeHours) ||
      awakeHours <= 0 ||
      isNaN(reminderDurationMinutes) ||
      reminderDurationMinutes < 0 ||
      isNaN(reminderLeadTimeMinutes) ||
      reminderLeadTimeMinutes < 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Adjust daily intake based on activity level
    let adjustedIntake = dailyIntakeLiters;
    if (activityLevel === "moderate") {
      adjustedIntake = dailyIntakeLiters * 1.1;
    } else if (activityLevel === "active") {
      adjustedIntake = dailyIntakeLiters * 1.25;
    }

    // Typical drink volume in liters (250 ml)
    const typicalDrinkVolume = 0.25;

    // Calculate number of drinks needed
    const numberOfDrinks = Math.ceil(adjustedIntake / typicalDrinkVolume);

    // Total awake minutes
    const awakeMinutes = awakeHours * 60;

    // Calculate raw interval in minutes between drinks
    const intervalMinutes = awakeMinutes / numberOfDrinks;

    // Adjust interval by subtracting reminder lead time and duration to avoid overlap
    const adjustedInterval = intervalMinutes - reminderLeadTimeMinutes - reminderDurationMinutes;

    // Safety check: interval should not be less than 15 minutes
    const safeInterval = adjustedInterval < 15 ? 15 : adjustedInterval;

    // Format interval to minutes and seconds
    const intervalMinutesPart = Math.floor(safeInterval);
    const intervalSecondsPart = Math.round((safeInterval - intervalMinutesPart) * 60);

    const intervalFormatted = `${intervalMinutesPart} min${intervalSecondsPart > 0 ? ` ${intervalSecondsPart} sec` : ""}`;

    return {
      value: intervalFormatted,
      label: "Recommended Hydration Reminder Interval",
      subtext: `Based on your inputs, set reminders approximately every ${intervalFormatted} to meet your hydration goals safely and effectively.`,
      warning:
        safeInterval < 15
          ? "Warning: The calculated interval is very short. Consider increasing your awake hours or adjusting intake for practicality."
          : null,
      formulaUsed:
        "Interval (minutes) = (Awake Hours × 60) / Number of Drinks - Reminder Lead Time - Reminder Duration",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is it important to space out hydration reminders?",
      answer:
        "Spacing hydration reminders evenly throughout the day helps maintain optimal hydration levels, prevents dehydration, and avoids overloading the kidneys with large volumes of water at once. Consistent intake supports bodily functions such as temperature regulation, joint lubrication, and nutrient transport.",
    },
    {
      question: "How does activity level affect hydration needs?",
      answer:
        "Physical activity increases water loss through sweat and respiration, raising hydration requirements. Active individuals need to consume more water to compensate for these losses, which is why the calculator adjusts daily intake based on activity level.",
    },
    {
      question: "Can I customize the reminder duration and lead time?",
      answer:
        "Yes, customizing reminder duration and lead time allows you to tailor notifications to your preferences and lifestyle. For example, a longer reminder duration ensures you notice the alert, while lead time helps you prepare to drink water before the next scheduled interval.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dailyIntakeLiters" className="flex items-center gap-2">
                <Droplets /> Daily Water Intake (liters)
              </Label>
              <Input
                id="dailyIntakeLiters"
                type="number"
                min="0"
                step="0.1"
                value={inputs.dailyIntakeLiters}
                onChange={(e) => handleInputChange("dailyIntakeLiters", e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>
            <div>
              <Label htmlFor="awakeHours" className="flex items-center gap-2">
                <Sun /> Awake Hours Per Day
              </Label>
              <Input
                id="awakeHours"
                type="number"
                min="1"
                max="24"
                step="0.1"
                value={inputs.awakeHours}
                onChange={(e) => handleInputChange("awakeHours", e.target.value)}
                placeholder="e.g., 16"
              />
            </div>
            <div>
              <Label htmlFor="reminderDurationMinutes" className="flex items-center gap-2">
                <ClockIcon /> Reminder Duration (minutes)
              </Label>
              <Input
                id="reminderDurationMinutes"
                type="number"
                min="0"
                max="60"
                step="1"
                value={inputs.reminderDurationMinutes}
                onChange={(e) => handleInputChange("reminderDurationMinutes", e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <Label htmlFor="reminderLeadTimeMinutes" className="flex items-center gap-2">
                <Calendar /> Reminder Lead Time (minutes)
              </Label>
              <Input
                id="reminderLeadTimeMinutes"
                type="number"
                min="0"
                max="60"
                step="1"
                value={inputs.reminderLeadTimeMinutes}
                onChange={(e) => handleInputChange("reminderLeadTimeMinutes", e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="activityLevel" className="flex items-center gap-2">
                <Activity /> Activity Level
              </Label>
              <Select
                value={inputs.activityLevel}
                onValueChange={(v) => handleInputChange("activityLevel", v)}
              >
                <SelectTrigger id="activityLevel" className="w-full">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="moderate">Moderate (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="active">Active (moderate exercise 4-5 days/week)</SelectItem>
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
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              dailyIntakeLiters: "",
              awakeHours: "",
              reminderDurationMinutes: "",
              reminderLeadTimeMinutes: "",
              activityLevel: "moderate",
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
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-6 text-xs italic text-slate-500 dark:text-slate-600">
              <Info className="inline-block w-3 h-3 mr-1" />
              {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Hydration Reminder Interval Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper hydration is essential for maintaining bodily functions such as temperature regulation, joint lubrication, and nutrient transport. However, many people struggle to drink water consistently throughout the day, leading to dehydration or excessive intake at once. The Hydration Reminder Interval Planner helps you design a personalized schedule for drinking water by calculating optimal intervals between reminders based on your daily water intake goals, awake hours, and activity level. This ensures you stay hydrated steadily and safely, avoiding both dehydration and water overload.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By factoring in your activity level, the planner adjusts your hydration needs to reflect increased water loss during physical exertion. Additionally, it allows customization of reminder notification duration and lead time, enabling you to tailor alerts to your lifestyle and preferences. This approach promotes sustainable hydration habits that support overall health and well-being.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate hydration reminder intervals, input your daily water intake goal in liters, the number of hours you are awake each day, and your activity level. You can also specify how long each reminder notification should last and how much lead time you want before the next reminder. Once you enter these values, click "Calculate" to receive your personalized hydration reminder interval.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your <em>daily water intake goal</em> in liters. This is the total amount of water you aim to consume each day.
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of <em>hours you are awake</em> daily. This helps the calculator distribute reminders evenly.
          </li>
          <li>
            <strong>Step 3:</strong> Select your <em>activity level</em> to adjust hydration needs based on physical exertion.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the <em>reminder duration</em> and <em>lead time</em> in minutes to customize notification behavior.
          </li>
          <li>
            <strong>Step 5:</strong> Click the <em>Calculate</em> button to view your recommended hydration reminder interval.
          </li>
          <li>
            <strong>Step 6:</strong> Use the interval to set reminders on your phone or hydration app to maintain consistent water intake.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning hydration reminders, it is important to listen to your body's signals and adjust as needed. While this calculator provides scientifically grounded intervals, individual needs may vary due to factors such as climate, health conditions, and medication. Avoid forcing yourself to drink excessive amounts in short periods, as this can lead to water intoxication, a rare but serious condition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          To enhance hydration habits, consider pairing reminders with daily routines such as meal times or breaks. Using reusable water bottles with volume markings can help track intake visually. Additionally, consuming water-rich foods like fruits and vegetables contributes to overall hydration. Always consult a healthcare professional if you have specific medical concerns related to hydration.
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
              href="https://www.cdc.gov/nutrition/data-statistics/plain-water-the-healthier-choice.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Plain Water the Healthier Choice <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines and statistics on water consumption and hydration from the Centers for Disease Control and Prevention.
            </p>
          </li>
          <li>
            <a
              href="https://www.nal.usda.gov/fnic/how-much-water-do-you-need"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA - How Much Water Do You Need? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive resource on daily water intake recommendations considering age, sex, and activity level.
            </p>
          </li>
          <li>
            <a
              href="https://www.nap.edu/read/10925/chapter/6"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Academies - Dietary Reference Intakes for Water <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative scientific report detailing water intake requirements and factors influencing hydration needs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hydration Reminder Interval Planner"
      description="Set up a hydration schedule. Calculate the best intervals to drink water throughout the day to meet your daily intake goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Interval (minutes) = (Awake Hours × 60) / Number of Drinks - Reminder Lead Time - Reminder Duration",
        variables: [
          { symbol: "Awake Hours", description: "Number of hours you are awake per day" },
          { symbol: "Number of Drinks", description: "Total number of drinks to meet daily intake" },
          { symbol: "Reminder Lead Time", description: "Minutes before next reminder" },
          { symbol: "Reminder Duration", description: "Duration of reminder notification in minutes" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A moderately active person aims to drink 3 liters of water daily and is awake for 16 hours. They want reminders lasting 1 minute with a 5-minute lead time.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate adjusted intake: 3 L × 1.1 (moderate activity) = 3.3 L. Number of drinks = 3.3 / 0.25 = 13.2, rounded up to 14.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total awake minutes: 16 × 60 = 960 minutes. Raw interval = 960 / 14 ≈ 68.57 minutes.",
          },
          {
            label: "Step 3",
            explanation:
              "Adjust interval by subtracting lead time and duration: 68.57 - 5 - 1 = 62.57 minutes.",
          },
          {
            label: "Step 4",
            explanation:
              "Recommended reminder interval is approximately 62 minutes and 34 seconds.",
          },
        ],
        result: "Set hydration reminders every 62 minutes and 34 seconds to meet your daily hydration goal safely.",
      }}
      relatedCalculators={[
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday-life/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday-life/planting-calendar-frost-date", icon: "🌿" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Life Expectancy Calculator", url: "/everyday-life/life-expectancy", icon: "💡" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday-life/appliance-energy-consumption", icon: "💡" },
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

// Helper icon for reminder duration label (clock)
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
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}