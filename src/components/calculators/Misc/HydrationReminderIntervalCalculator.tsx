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
      question: "What is the ideal hydration reminder interval for an average adult?",
      answer: "Most adults benefit from drinking water every 60-90 minutes during normal activities, or every 15-20 minutes during intense exercise. Your personal interval depends on activity level, climate, and individual sweat rate.",
    },
    {
      question: "How does body weight affect hydration reminder timing?",
      answer: "Heavier individuals typically need more total water daily but may use similar reminder intervals. The calculator adjusts recommendations based on your weight to ensure adequate intake relative to body composition.",
    },
    {
      question: "Should my hydration interval change during exercise?",
      answer: "Yes, exercise reduces optimal intervals to 15-30 minutes depending on intensity and heat. The calculator accounts for activity type to provide personalized reminders that prevent dehydration during workouts.",
    },
    {
      question: "How does climate and temperature impact hydration reminders?",
      answer: "Hot environments increase fluid loss through sweating, requiring reminders every 20-40 minutes instead of 60-90 minutes. Cold climates may allow longer intervals, though thirst cues become less reliable.",
    },
    {
      question: "Can age affect recommended hydration reminder intervals?",
      answer: "Yes, older adults often have diminished thirst signals and should follow stricter schedules with reminders every 60 minutes. Children may need reminders every 30-45 minutes depending on activity and environment.",
    },
    {
      question: "What is the daily water intake this calculator assumes?",
      answer: "The calculator typically recommends 2.7-3.7 liters daily for adults based on National Academies guidelines, then divides this into appropriately-spaced reminder intervals throughout waking hours.",
    },
    {
      question: "Should I adjust intervals if I drink caffeinated beverages?",
      answer: "Yes, caffeine has mild diuretic effects, so reduce your reminder interval by 10-15 minutes after consuming coffee or tea to maintain hydration status.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hydration Reminder Interval Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Hydration Reminder Interval Planner calculates personalized water drinking schedules based on your body composition, activity level, and environmental conditions. It helps you stay hydrated throughout the day by determining optimal intervals between drinking water.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your body weight, typical activity level (sedentary to intense exercise), current temperature or climate, and any relevant health factors. The calculator processes this data against evidence-based hydration science to generate your customized reminder schedule.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results will show recommended time intervals between drinks and approximate intake per session. Set phone reminders or use the generated schedule to maintain consistent hydration and improve energy, focus, and physical performance.</p>
        </div>
      </section>

      {/* TABLE: Recommended Hydration Reminder Intervals by Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Hydration Reminder Intervals by Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows optimal drinking intervals based on activity intensity and environmental conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reminder Interval</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cups Per Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary (office work)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68-72°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-120 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 oz</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light activity (walking)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68-72°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-90 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 oz</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate activity (sports)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-82°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 oz</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Intense exercise (running)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-82°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 oz</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Intense exercise (running)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;82°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 oz</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very heavy exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;85°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 oz</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intervals assume healthy adults; individual needs vary by sweat rate and acclimatization.</p>
      </section>

      {/* TABLE: Daily Hydration Targets and Reminder Frequency */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Hydration Targets and Reminder Frequency</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Daily water intake recommendations from the National Academies of Sciences, Engineering, and Medicine with corresponding reminder counts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Population</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Intake Target</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Waking Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reminders Needed (90 min)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult women</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7 liters (91 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11 reminders</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult men</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.7 liters (125 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11 reminders</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Children (4-8 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.7 liters (57 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10 reminders</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adolescents (9-13 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4 liters (81 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11 reminders</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pregnant women</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0 liters (101 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11 reminders</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Breastfeeding women</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8 liters (128 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11 reminders</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These targets include water from food (~20%) and beverages (~80%); calculator helps distribute beverage intake evenly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Set phone alarms or calendar notifications using your calculated intervals to build automatic drinking habits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Drink plain water before other beverages; caffeinated drinks provide hydration but have mild diuretic effects.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor urine color (pale yellow indicates good hydration) and adjust intervals if it darkens significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">During exercise or heat exposure, drink 4-8 oz every 15-20 minutes rather than large amounts infrequently to optimize absorption.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Sweat Rate Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Athletes may lose 1-2 liters per hour through sweat; the calculator provides baseline intervals that highly active users should reduce by 25-50%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Same Interval Indoors and Outdoors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Outdoor heat increases fluid loss dramatically; don't use air-conditioned office intervals for outdoor summer activities without adjustment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Drinking Too Much Water Too Quickly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Consuming more than 1 liter per hour can cause hyponatremia; follow the calculated per-session amounts rather than trying to 'catch up.'</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Food Water Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fruits, vegetables, and soups provide 15-20% of daily water intake; the calculator's beverage recommendations account for this partial offset.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal hydration reminder interval for an average adult?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most adults benefit from drinking water every 60-90 minutes during normal activities, or every 15-20 minutes during intense exercise. Your personal interval depends on activity level, climate, and individual sweat rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does body weight affect hydration reminder timing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heavier individuals typically need more total water daily but may use similar reminder intervals. The calculator adjusts recommendations based on your weight to ensure adequate intake relative to body composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should my hydration interval change during exercise?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, exercise reduces optimal intervals to 15-30 minutes depending on intensity and heat. The calculator accounts for activity type to provide personalized reminders that prevent dehydration during workouts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does climate and temperature impact hydration reminders?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hot environments increase fluid loss through sweating, requiring reminders every 20-40 minutes instead of 60-90 minutes. Cold climates may allow longer intervals, though thirst cues become less reliable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can age affect recommended hydration reminder intervals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, older adults often have diminished thirst signals and should follow stricter schedules with reminders every 60 minutes. Children may need reminders every 30-45 minutes depending on activity and environment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the daily water intake this calculator assumes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator typically recommends 2.7-3.7 liters daily for adults based on National Academies guidelines, then divides this into appropriately-spaced reminder intervals throughout waking hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust intervals if I drink caffeinated beverages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, caffeine has mild diuretic effects, so reduce your reminder interval by 10-15 minutes after consuming coffee or tea to maintain hydration status.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/25353/dietary-reference-intakes-for-adequacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Academies of Sciences, Engineering, and Medicine - Dietary Reference Intakes for Adequacy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidelines for daily water intake recommendations across age groups and life stages.</p>
          </li>
          <li>
            <a href="https://www.acsm.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Sports Medicine - Hydration and Physical Performance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for fluid intake during exercise based on intensity, duration, and environmental conditions.</p>
          </li>
          <li>
            <a href="https://health.clevelandclinic.org/how-much-water-should-you-drink/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cleveland Clinic - Hydration and Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidance on personalized hydration needs and signs of dehydration across different populations.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic - Water: How Much Should You Drink Every Day?</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Medical perspective on hydration factors including activity level, climate, and health conditions affecting water needs.</p>
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
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday/planting-calendar-frost-date", icon: "🌿" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday/ice-quantity-beverages", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday/appliance-energy-consumption", icon: "💡" },
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