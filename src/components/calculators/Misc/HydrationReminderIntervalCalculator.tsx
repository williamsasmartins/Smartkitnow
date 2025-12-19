import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Home,
  Heart,
  Utensils,
  Leaf,
  Calendar,
  DollarSign,
  Droplets,
  Activity,
  Moon,
  Sun,
  Users,
  Paintbrush,
  Wrench,
  Info,
  RotateCcw,
  AlertTriangle,
  FlaskConical,
  Scale,
  Waves,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HydrationReminderIntervalCalculator() {
  /**
   * Inputs:
   * - weight (kg or lbs)
   * - activity level (sedentary, light, moderate, intense)
   * - climate (temperate, hot, cold)
   * - wake hours (hours awake per day)
   * - cup size (ml or oz)
   *
   * Outputs:
   * - total daily water intake (ml or oz)
   * - recommended interval between drinks (minutes)
   * - number of reminders per day
   */

  const [inputs, setInputs] = useState({
    weight: "",
    weightUnit: "kg",
    activityLevel: "moderate",
    climate: "temperate",
    wakeHours: "16",
    cupSize: "250",
    cupUnit: "ml",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs
    const weightRaw = parseFloat(inputs.weight);
    const wakeHoursRaw = parseFloat(inputs.wakeHours);
    const cupSizeRaw = parseFloat(inputs.cupSize);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(wakeHoursRaw) ||
      wakeHoursRaw <= 0 ||
      wakeHoursRaw > 24 ||
      isNaN(cupSizeRaw) ||
      cupSizeRaw <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for weight, wake hours, and cup size.",
        formulaUsed: null,
      };
    }

    // Convert weight to kg if needed
    const weightKg = inputs.weightUnit === "lbs" ? weightRaw / 2.20462 : weightRaw;

    // Base water intake: 35 ml per kg of body weight (general recommendation)
    let baseIntakeMl = weightKg * 35;

    // Adjust for activity level
    // Sedentary: no change
    // Light: +10%
    // Moderate: +20%
    // Intense: +40%
    const activityMultiplierMap = {
      sedentary: 1,
      light: 1.1,
      moderate: 1.2,
      intense: 1.4,
    };
    const activityMultiplier = activityMultiplierMap[inputs.activityLevel] || 1.2;
    baseIntakeMl *= activityMultiplier;

    // Adjust for climate
    // Temperate: no change
    // Hot: +15%
    // Cold: -5%
    const climateMultiplierMap = {
      temperate: 1,
      hot: 1.15,
      cold: 0.95,
    };
    const climateMultiplier = climateMultiplierMap[inputs.climate] || 1;
    baseIntakeMl *= climateMultiplier;

    // Round total intake to nearest 10 ml
    const totalIntakeMl = Math.round(baseIntakeMl / 10) * 10;

    // Convert cup size to ml if needed
    const cupSizeMl = inputs.cupUnit === "oz" ? cupSizeRaw * 29.5735 : cupSizeRaw;

    // Calculate number of cups needed per day
    const cupsPerDay = totalIntakeMl / cupSizeMl;

    // Calculate interval between drinks in minutes
    // Interval = (wake hours * 60) / cups per day
    const intervalMinutes = cupsPerDay > 0 ? (wakeHoursRaw * 60) / cupsPerDay : null;

    // Format outputs
    const totalIntakeDisplay =
      inputs.weightUnit === "lbs"
        ? `${(totalIntakeMl / 29.5735).toFixed(1)} fl oz`
        : `${totalIntakeMl} ml`;

    const intervalDisplay =
      intervalMinutes !== null && intervalMinutes > 0
        ? `${Math.round(intervalMinutes)} minutes`
        : "N/A";

    const cupsPerDayDisplay = cupsPerDay > 0 ? Math.ceil(cupsPerDay) : "N/A";

    return {
      value: `${intervalDisplay}`,
      label: "Recommended Hydration Reminder Interval",
      subtext: `Drink approximately every ${intervalDisplay} to meet your daily goal of ${totalIntakeDisplay} (${cupsPerDayDisplay} cups of ${inputs.cupSize}${inputs.cupUnit}).`,
      warning: null,
      formulaUsed:
        "Total Water Intake (ml) = Weight (kg) × 35 × Activity Multiplier × Climate Multiplier; Interval (min) = (Wake Hours × 60) / (Total Intake / Cup Size)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is hydration important for overall health?",
      answer:
        "Hydration is essential because water regulates body temperature, lubricates joints, and transports nutrients and oxygen to cells. Proper hydration supports digestion, cognitive function, and physical performance. Dehydration can lead to fatigue, headaches, impaired concentration, and serious health complications if prolonged. Maintaining adequate hydration is a cornerstone of good health and well-being.",
    },
    {
      question: "How does activity level affect daily water needs?",
      answer:
        "Physical activity increases water loss through sweat and respiration, elevating hydration requirements. The more intense or prolonged the activity, the greater the fluid loss. Therefore, individuals with higher activity levels need to consume more water to compensate for these losses and maintain optimal bodily functions, prevent dehydration, and support recovery.",
    },
    {
      question: "Why does climate influence hydration requirements?",
      answer:
        "Climate impacts hydration because hot environments cause increased sweating to cool the body, leading to higher fluid loss. Conversely, cold climates may reduce thirst sensation but still cause water loss through respiration and dry air. Adjusting water intake based on climate ensures the body remains properly hydrated regardless of external conditions.",
    },
    {
      question: "Can drinking too much water be harmful?",
      answer:
        "Yes, excessive water intake can lead to a condition called hyponatremia, where blood sodium levels become dangerously low. This can cause symptoms like nausea, headache, confusion, seizures, and in severe cases, death. It's important to balance water intake with electrolyte consumption and listen to your body's thirst signals.",
    },
    {
      question: "How can I remember to drink water regularly?",
      answer:
        "Using hydration reminder intervals, like the ones calculated by this planner, helps establish a consistent drinking schedule. Setting alarms, using hydration apps, or associating drinking water with daily activities (e.g., before meals) can reinforce the habit. Consistency is key to maintaining optimal hydration throughout the day.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="weight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-blue-600" /> Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                min={1}
                step="any"
                placeholder="e.g. 70"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                aria-describedby="weightHelp"
              />
              <Select
                value={inputs.weightUnit}
                onValueChange={(v) => handleInputChange("weightUnit", v)}
                aria-label="Weight Unit"
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your body weight.
            </p>
          </div>

          <div>
            <Label htmlFor="activityLevel" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Activity className="w-4 h-4 text-green-600" /> Activity Level
            </Label>
            <Select
              id="activityLevel"
              value={inputs.activityLevel}
              onValueChange={(v) => handleInputChange("activityLevel", v)}
              aria-label="Activity Level"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="intense">Intense</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your typical daily activity level.
            </p>
          </div>

          <div>
            <Label htmlFor="climate" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sun className="w-4 h-4 text-yellow-500" /> Climate
            </Label>
            <Select
              id="climate"
              value={inputs.climate}
              onValueChange={(v) => handleInputChange("climate", v)}
              aria-label="Climate"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperate">Temperate</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose the climate you live in.
            </p>
          </div>

          <div>
            <Label htmlFor="wakeHours" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ClockIcon className="w-4 h-4 text-indigo-600" /> Hours Awake
            </Label>
            <Input
              id="wakeHours"
              type="number"
              min={1}
              max={24}
              step="any"
              placeholder="e.g. 16"
              value={inputs.wakeHours}
              onChange={(e) => handleInputChange("wakeHours", e.target.value)}
              aria-describedby="wakeHelp"
            />
            <p id="wakeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How many hours are you awake daily?
            </p>
          </div>

          <div>
            <Label htmlFor="cupSize" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Droplets className="w-4 h-4 text-cyan-600" /> Cup Size
            </Label>
            <div className="flex gap-2">
              <Input
                id="cupSize"
                type="number"
                min={10}
                step="any"
                placeholder="e.g. 250"
                value={inputs.cupSize}
                onChange={(e) => handleInputChange("cupSize", e.target.value)}
                aria-describedby="cupHelp"
              />
              <Select
                value={inputs.cupUnit}
                onValueChange={(v) => handleInputChange("cupUnit", v)}
                aria-label="Cup Size Unit"
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="oz">oz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p id="cupHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your typical drinking cup size.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
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
              cupSize: "250",
              cupUnit: "ml",
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
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <Card className="border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 shadow-md mt-4">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="inline-block w-5 h-5 mr-2" />
            {results.warning}
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
          Hydration is a fundamental aspect of maintaining optimal health and bodily functions. Water constitutes approximately 60% of the human body and plays a critical role in regulating temperature, transporting nutrients, removing waste, and cushioning joints. The amount of water each person needs varies widely based on factors such as body weight, activity level, climate, and daily habits. Understanding these factors helps tailor hydration strategies to individual needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses scientifically grounded formulas to estimate your daily water intake requirements and then breaks down that total into manageable drinking intervals. By spacing out your water consumption evenly throughout your waking hours, you can maintain consistent hydration, avoid dehydration symptoms, and support overall wellness. The planner also considers your typical cup size to provide practical reminders that fit your lifestyle.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate hydration reminder intervals, provide the following information about yourself and your environment. This will help the calculator tailor recommendations specifically for your needs:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your current body weight. You can choose between kilograms (kg) or pounds (lbs). This is the foundation for calculating your base water needs.
          </li>
          <li>
            <strong>Activity Level:</strong> Select your typical daily activity intensity. More active individuals require more water due to increased fluid loss through sweat.
          </li>
          <li>
            <strong>Climate:</strong> Choose the climate you live in. Hot climates increase water loss, while cold climates may slightly reduce hydration needs.
          </li>
          <li>
            <strong>Hours Awake:</strong> Enter the number of hours you are typically awake each day. This helps determine how to space your hydration reminders evenly.
          </li>
          <li>
            <strong>Cup Size:</strong> Input the volume of your usual drinking cup or bottle in milliliters (ml) or fluid ounces (oz). This allows the calculator to estimate how many cups you need to drink daily.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all the required information, click the "Calculate" button. The calculator will display your recommended hydration reminder interval in minutes, along with the total daily water intake and the number of cups you should consume. Use this information to set alarms or reminders throughout your day to maintain consistent hydration.
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
          "Total Water Intake (ml) = Weight (kg) × 35 × Activity Multiplier × Climate Multiplier; Interval (minutes) = (Wake Hours × 60) / (Total Intake / Cup Size)",
        variables: [
          { symbol: "Weight (kg)", description: "Your body weight in kilograms" },
          { symbol: "35", description: "Base ml water per kg body weight" },
          { symbol: "Activity Multiplier", description: "Adjustment based on activity level (1 to 1.4)" },
          { symbol: "Climate Multiplier", description: "Adjustment based on climate (0.95 to 1.15)" },
          { symbol: "Wake Hours", description: "Number of hours you are awake per day" },
          { symbol: "Cup Size", description: "Volume of your drinking cup in ml" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine a moderately active person weighing 70 kg, living in a temperate climate, awake for 16 hours daily, and drinking from a 250 ml cup.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate base water intake: 70 kg × 35 ml = 2450 ml daily water requirement.",
          },
          {
            label: "Step 2",
            explanation:
              "Adjust for activity level (moderate = 1.2): 2450 ml × 1.2 = 2940 ml.",
          },
          {
            label: "Step 3",
            explanation:
              "Adjust for climate (temperate = 1): 2940 ml × 1 = 2940 ml total daily intake.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate number of cups: 2940 ml / 250 ml = 11.76 cups per day.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate interval: (16 hours × 60 minutes) / 11.76 cups ≈ 81.6 minutes between drinks.",
          },
        ],
        result:
          "This person should drink approximately every 82 minutes, consuming about 12 cups of water daily to stay optimally hydrated.",
      }}
      relatedCalculators={[
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday-life/hose-runtime-flow-rate", icon: "💧" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday-life/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday-life/room-air-changes-ach", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
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

// Dummy ClockIcon component for accessibility label icon (replace with actual icon if available)
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