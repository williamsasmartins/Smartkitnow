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
   * - weight (kg or lbs)
   * - activity level (sedentary, moderate, active)
   * - climate (temperate, hot, cold)
   * - wake hours (hours awake per day)
   * 
   * Output:
   * - recommended daily water intake (liters)
   * - recommended reminder interval (minutes)
   * 
   * Formula references:
   * - Base water intake: 35 ml per kg body weight (Institute of Medicine)
   * - Adjustments for activity and climate
   * - Reminder interval = wake hours * 60 / number of reminders (aim for 8 reminders/day minimum)
   */

  const [inputs, setInputs] = useState({
    weight: "",
    weightUnit: "kg",
    activityLevel: "moderate",
    climate: "temperate",
    wakeHours: "16",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const wakeHoursRaw = parseFloat(inputs.wakeHours);
    if (!weightRaw || weightRaw <= 0 || !wakeHoursRaw || wakeHoursRaw <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for weight and wake hours.",
        formulaUsed: "",
      };
    }

    // Convert weight to kg if needed
    const weightKg = inputs.weightUnit === "lbs" ? weightRaw * 0.453592 : weightRaw;

    // Base water intake in liters (35 ml per kg)
    let baseIntakeLiters = (weightKg * 35) / 1000;

    // Activity multiplier
    let activityMultiplier = 1;
    switch (inputs.activityLevel) {
      case "sedentary":
        activityMultiplier = 0.9;
        break;
      case "moderate":
        activityMultiplier = 1;
        break;
      case "active":
        activityMultiplier = 1.2;
        break;
    }

    // Climate multiplier
    let climateMultiplier = 1;
    switch (inputs.climate) {
      case "temperate":
        climateMultiplier = 1;
        break;
      case "hot":
        climateMultiplier = 1.3;
        break;
      case "cold":
        climateMultiplier = 0.9;
        break;
    }

    const adjustedIntakeLiters = baseIntakeLiters * activityMultiplier * climateMultiplier;

    // Minimum reminders per day (aim for at least 8)
    const minReminders = 8;

    // Calculate reminder interval in minutes
    // Total awake minutes divided by reminders
    const totalAwakeMinutes = wakeHoursRaw * 60;
    const reminderIntervalMinutes = Math.max(30, Math.floor(totalAwakeMinutes / minReminders));

    // Warning if wake hours too low or too high
    let warning = null;
    if (wakeHoursRaw < 8) {
      warning = "Less than 8 hours awake may reduce hydration needs.";
    } else if (wakeHoursRaw > 20) {
      warning = "More than 20 hours awake may require more frequent hydration.";
    }

    return {
      value: `${adjustedIntakeLiters.toFixed(2)} L / ${reminderIntervalMinutes} min`,
      label: "Recommended Daily Intake / Reminder Interval",
      subtext: `Based on your weight, activity level, climate, and awake time.`,
      warning,
      formulaUsed:
        "Daily Intake (L) = Weight (kg) × 35 ml × Activity Multiplier × Climate Multiplier; Reminder Interval (min) = Awake Hours × 60 / 8",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is it important to drink water regularly throughout the day?",
      answer:
        "Regular hydration helps maintain optimal body functions including temperature regulation, joint lubrication, and nutrient transport. Drinking water at intervals prevents dehydration, which can cause fatigue, headaches, and impaired cognitive function.",
    },
    {
      question: "How does activity level affect hydration needs?",
      answer:
        "Physical activity increases water loss through sweat and respiration. Therefore, individuals with higher activity levels require more water to compensate for this loss and maintain hydration balance.",
    },
    {
      question: "Can climate really change how much water I need?",
      answer:
        "Yes, hot climates increase perspiration and water loss, requiring higher water intake. Conversely, cold climates may reduce thirst sensation but still require adequate hydration to support bodily functions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  min={1}
                  step="any"
                  placeholder="Enter your weight"
                  value={inputs.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
                <Select
                  value={inputs.weightUnit}
                  onValueChange={(v) => handleInputChange("weightUnit", v)}
                >
                  <SelectTrigger aria-label="Select weight unit" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select
                id="activityLevel"
                value={inputs.activityLevel}
                onValueChange={(v) => handleInputChange("activityLevel", v)}
              >
                <SelectTrigger aria-label="Select activity level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="climate">Climate</Label>
              <Select
                id="climate"
                value={inputs.climate}
                onValueChange={(v) => handleInputChange("climate", v)}
              >
                <SelectTrigger aria-label="Select climate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperate">Temperate</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="wakeHours">Hours Awake Per Day</Label>
              <Input
                id="wakeHours"
                type="number"
                min={1}
                max={24}
                step="any"
                placeholder="e.g. 16"
                value={inputs.wakeHours}
                onChange={(e) => handleInputChange("wakeHours", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate hydration reminder interval"
        >
          <Droplets className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              weightUnit: "kg",
              activityLevel: "moderate",
              climate: "temperate",
              wakeHours: "16",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
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
              <p className="mt-3 text-sm text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-1">
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
          Understanding Hydration Reminder Interval Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper hydration is essential for maintaining bodily functions such as temperature regulation, joint lubrication, and cellular processes. However, many people struggle to drink water consistently throughout the day, leading to dehydration and its associated symptoms like fatigue and headaches. This Hydration Reminder Interval Planner helps you determine the optimal frequency to drink water based on your personal characteristics and environment, ensuring you stay well-hydrated without overburdening your routine.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By considering factors such as your weight, activity level, climate, and daily awake hours, this planner calculates your recommended daily water intake and suggests practical intervals for reminders. This approach aligns with scientific hydration guidelines and promotes sustainable habits for long-term health.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get your personalized hydration reminder interval, input your current weight, select the unit (kilograms or pounds), choose your typical activity level, specify the climate you live in, and enter the number of hours you are awake each day. Then, click the Calculate button to see your recommended daily water intake and how often you should drink water throughout your waking hours.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your weight and select the appropriate unit.
          </li>
          <li>
            <strong>Step 2:</strong> Choose your usual activity level—sedentary, moderate, or active.
          </li>
          <li>
            <strong>Step 3:</strong> Select the climate you live in, as temperature affects hydration needs.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the number of hours you are typically awake each day.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to view your recommended daily intake and reminder interval.
          </li>
          <li>
            <strong>Step 6:</strong> Use the reminder interval to set alarms or notifications to drink water regularly.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this planner provides a scientifically grounded estimate, individual hydration needs can vary based on health conditions, medications, and specific circumstances such as pregnancy or illness. Always listen to your body's thirst signals and adjust your water intake accordingly. Avoid excessive water consumption in a short period, which can lead to hyponatremia, a dangerous dilution of blood sodium levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For athletes or those engaging in intense physical activity, consider replenishing electrolytes lost through sweat alongside water. Using hydration reminders as a tool can help build consistent habits, but pairing them with mindful drinking and balanced nutrition will optimize your overall hydration status.
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
              Comprehensive guidelines on water consumption and hydration benefits from the Centers for Disease Control and Prevention.
            </p>
          </li>
          <li>
            <a
              href="https://www.nap.edu/read/10925/chapter/6"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate - National Academies <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative report detailing recommended water intake levels based on scientific evidence.
            </p>
          </li>
          <li>
            <a
              href="https://www.uofmhealth.org/health-library/uz2253"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              University of Michigan Health - Hydration and Your Health <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Educational resource explaining hydration importance, factors affecting needs, and practical tips.
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
          "Daily Intake (L) = Weight (kg) × 35 ml × Activity Multiplier × Climate Multiplier; Reminder Interval (min) = Awake Hours × 60 / 8",
        variables: [
          { name: "Weight (kg)", description: "Your body weight in kilograms" },
          { name: "Activity Multiplier", description: "Adjustment based on activity level (0.9-1.2)" },
          { name: "Climate Multiplier", description: "Adjustment based on climate (0.9-1.3)" },
          { name: "Awake Hours", description: "Number of hours you are awake per day" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 70 kg person with a moderate activity level living in a temperate climate and awake for 16 hours wants to know how often to drink water.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate base intake: 70 kg × 35 ml = 2450 ml (2.45 L)",
          },
          {
            label: "Step 2",
            explanation: "Apply activity multiplier (moderate = 1): 2.45 L × 1 = 2.45 L",
          },
          {
            label: "Step 3",
            explanation: "Apply climate multiplier (temperate = 1): 2.45 L × 1 = 2.45 L",
          },
          {
            label: "Step 4",
            explanation: "Calculate reminder interval: 16 hours × 60 minutes / 8 reminders = 120 minutes",
          },
        ],
        result: "Recommended daily intake is 2.45 liters, with reminders every 120 minutes (2 hours).",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
        { title: "Caffeine Max per Day Calculator", url: "/everyday-life/caffeine-max-per-day", icon: "💡" },
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