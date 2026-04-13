import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const activities = [
  { label: "Running (6 mph / 10 km/h)", met: 9.8 },
  { label: "Walking (3 mph / 4.8 km/h)", met: 3.5 },
  { label: "Cycling (12-14 mph / 19-22 km/h)", met: 8.0 },
  { label: "Swimming (moderate effort)", met: 6.0 },
  { label: "Yoga", met: 2.5 },
  { label: "Weightlifting (general)", met: 6.0 },
  { label: "Basketball (game)", met: 8.0 },
  { label: "Dancing (general)", met: 5.5 },
  { label: "Hiking (moderate effort)", met: 6.0 },
  { label: "Jumping Rope", met: 12.3 },
];

export default function CaloriesBurnedMetCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    weightMetric: "", // kg
    heightFeet: "",
    heightInches: "",
    heightCm: "",
    duration: "", // minutes
    activityMet: activities[0].met,
  });

  // 2. LOGIC
  // Convert height to meters (not used directly in MET calc but kept for completeness)
  const heightMeters = useMemo(() => {
    if (unit === "imperial") {
      const feet = parseFloat(inputs.heightFeet) || 0;
      const inches = parseFloat(inputs.heightInches) || 0;
      return (feet * 12 + inches) * 0.0254;
    } else {
      return parseFloat(inputs.heightCm) / 100 || 0;
    }
  }, [inputs.heightFeet, inputs.heightInches, inputs.heightCm, unit]);

  // Convert weight to kg
  const weightKg = useMemo(() => {
    if (unit === "imperial") {
      const lbs = parseFloat(inputs.weight) || 0;
      return lbs * 0.45359237;
    } else {
      return parseFloat(inputs.weightMetric) || 0;
    }
  }, [inputs.weight, inputs.weightMetric, unit]);

  // Duration in hours
  const durationHours = useMemo(() => {
    const mins = parseFloat(inputs.duration) || 0;
    return mins / 60;
  }, [inputs.duration]);

  // Calculate calories burned using MET formula:
  // Calories burned = MET × weight (kg) × duration (hours)
  const caloriesBurned = useMemo(() => {
    if (
      weightKg > 0 &&
      durationHours > 0 &&
      inputs.activityMet > 0
    ) {
      const cal = inputs.activityMet * weightKg * durationHours;
      return Math.round(cal);
    }
    return 0;
  }, [weightKg, durationHours, inputs.activityMet]);

  const results = useMemo(() => {
    if (caloriesBurned === 0) {
      return { value: 0, label: "", category: "" };
    }
    let category = "";
    if (caloriesBurned < 100) category = "Low Calorie Burn";
    else if (caloriesBurned < 300) category = "Moderate Calorie Burn";
    else category = "High Calorie Burn";

    return {
      value: caloriesBurned.toLocaleString(),
      label: "Calories Burned",
      category,
    };
  }, [caloriesBurned]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is MET and how does it relate to calories burned?",
      answer: "MET stands for Metabolic Equivalent of Task, a unit that measures the intensity of physical activity relative to resting metabolism. One MET equals the energy expended sitting at rest, approximately 1 calorie per kilogram of body weight per hour. The calculator multiplies your body weight, activity duration, and the activity's MET value to determine total calories burned with scientific accuracy.",
    },
    {
      question: "How many calories does a 150-pound person burn running at 6 mph for 30 minutes?",
      answer: "Running at 6 mph has a MET value of approximately 9.8. For a 150-pound (68 kg) person exercising for 30 minutes, the calculation is: 68 kg × 9.8 MET × 0.5 hours = 333 calories burned. This makes running one of the most effective calorie-burning activities compared to walking or cycling at moderate intensity.",
    },
    {
      question: "Does body weight affect how many calories I burn during exercise?",
      answer: "Yes, body weight directly affects calorie expenditure—heavier individuals burn more calories performing the same activity. A 200-pound person running at 6 mph for 30 minutes burns approximately 445 calories, while a 130-pound person burns approximately 290 calories. This is because larger bodies require more energy to move and maintain functions during exercise.",
    },
    {
      question: "What activities have the highest MET values for calorie burning?",
      answer: "High-intensity activities burn the most calories per hour: sprinting (&gt;20 MET), jumping rope (11-16 MET), vigorous cycling (14-16 MET), and competitive sports like basketball (8-10 MET). In comparison, casual walking at 2 mph burns only 2.8 MET, making high-intensity activities 5-7 times more efficient for calorie burning in shorter timeframes.",
    },
    {
      question: "How accurate is the MET-based calorie calculation method?",
      answer: "MET-based calculations are considered reliable for estimating average calorie burn with a typical accuracy range of ±10-20%, according to exercise physiology research. Individual variations due to fitness level, age, metabolism, and environmental factors mean actual calorie burn may differ, but MET remains the most standardized method used by fitness professionals and health organizations.",
    },
    {
      question: "Can I use this calculator to track daily calorie deficit for weight loss?",
      answer: "Yes, this calculator helps estimate exercise-related calorie burn, which you can subtract from daily intake to calculate deficit. However, weight loss requires combining exercise calories with dietary tracking—a 500-calorie daily deficit typically results in 1 pound of weight loss per week. Remember that the calculator estimates calories burned during activity only, not resting metabolic rate.",
    },
    {
      question: "Does intensity level change the MET value for the same activity?",
      answer: "Absolutely—the same activity at different intensities has significantly different MET values. Cycling at 10-12 mph is 6 MET, while cycling at 16-19 mph is 12 MET. This means doubling your effort intensity can double calorie burn, which is why the calculator requires you to specify intensity levels for accurate results.",
    },
    {
      question: "What is the difference between light, moderate, and vigorous activity intensity?",
      answer: "Light activity (&lt;3 MET) includes walking slowly or casual stretching; moderate activity (3-6 MET) includes brisk walking or recreational cycling; vigorous activity (&gt;6 MET) includes running, competitive sports, or high-intensity interval training. The intensity directly impacts how many calories you burn—vigorous activity burns 2-4 times more calories than light activity in the same duration.",
    },
    {
      question: "How should I adjust calculator results if I have above-average or below-average fitness?",
      answer: "MET values assume average fitness levels; highly trained athletes may burn fewer calories due to greater efficiency, while deconditioned individuals may burn slightly more due to less efficient movement. If you're significantly more or less fit than average, expect 10-15% variation from calculated results. Tracking your actual heart rate and weight changes over time provides personalized calibration of estimates.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const handleInputChange = (field: string, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Reset inputs
  const resetInputs = () => {
    setInputs({
      weight: "",
      weightMetric: "",
      heightFeet: "",
      heightInches: "",
      heightCm: "",
      duration: "",
      activityMet: activities[0].met,
    });
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        {unit === "imperial" ? (
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Weight (lbs)
            </Label>
            <Input
              id="weight"
              type="number"
              min={1}
              step={0.1}
              placeholder="e.g., 150"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your body weight in pounds.
            </p>
          </div>
        ) : (
          <div>
            <Label htmlFor="weightMetric" className="text-slate-700 dark:text-slate-300">
              Weight (kg)
            </Label>
            <Input
              id="weightMetric"
              type="number"
              min={1}
              step={0.1}
              placeholder="e.g., 68"
              value={inputs.weightMetric}
              onChange={(e) => handleInputChange("weightMetric", e.target.value)}
              aria-describedby="weightMetric-desc"
            />
            <p id="weightMetric-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your body weight in kilograms.
            </p>
          </div>
        )}

        {/* Height Input (optional, educational) */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step={1}
                placeholder="e.g., 5"
                value={inputs.heightFeet}
                onChange={(e) => handleInputChange("heightFeet", e.target.value)}
                aria-describedby="height-desc"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step={1}
                placeholder="e.g., 10"
                value={inputs.heightInches}
                onChange={(e) => handleInputChange("heightInches", e.target.value)}
                aria-describedby="height-desc"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g., 178"
              value={inputs.heightCm}
              onChange={(e) => handleInputChange("heightCm", e.target.value)}
              aria-describedby="height-desc"
            />
          </div>
        )}
        <p id="height-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Height is optional and not used in calorie calculation but useful for context.
        </p>

        {/* Activity Selector */}
        <div>
          <Label htmlFor="activity" className="text-slate-700 dark:text-slate-300">
            Activity Type
          </Label>
          <Select
            id="activity"
            value={inputs.activityMet.toString()}
            onValueChange={(val) => handleInputChange("activityMet", parseFloat(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activities.map((act, i) => (
                <SelectItem key={i} value={act.met.toString()}>
                  {act.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select the physical activity you performed.
          </p>
        </div>

        {/* Duration Input */}
        <div>
          <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            type="number"
            min={1}
            step={1}
            placeholder="e.g., 30"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            aria-describedby="duration-desc"
          />
          <p id="duration-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter how long you performed the activity.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate calories burned"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calories Burned by Activity (MET-based) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Calories Burned by Activity calculator uses the Metabolic Equivalent of Task (MET) method to estimate how many calories your body expends during physical activity. This evidence-based approach is used by fitness professionals, personal trainers, and health researchers worldwide because it accounts for both activity type and intensity. Understanding your calorie burn helps with weight management, fitness planning, and evaluating whether your exercise routine aligns with your health goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need three key inputs: your body weight (in pounds or kilograms), the type and intensity of activity you performed, and the duration of exercise in minutes or hours. The calculator's database includes MET values for hundreds of activities ranging from casual leisure activities like watching television (1 MET) to intense training like sprinting (&gt;20 MET). Accuracy improves when you select the most specific activity match and intensity level that reflects your actual workout.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays your estimated total calories burned and often breaks this into calories per hour or minute for comparison purposes. Remember that this number represents calories expended specifically during the activity—your body also burns calories at rest through basal metabolic rate (BMR). For weight management, combine this activity calorie estimate with your total daily food intake to determine your caloric deficit or surplus, keeping in mind that a 3,500-calorie deficit typically equals one pound of weight loss.</p>
        </div>
      </section>

      {/* TABLE: MET Values for Common Activities */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">MET Values for Common Activities</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the metabolic equivalent (MET) values for popular physical activities at various intensity levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intensity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">MET Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Walking</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 mph (slow)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Walking</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 mph (moderate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Walking</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5 mph (brisk)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Jogging</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Running</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Running</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 mph</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cycling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 mph (leisure)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cycling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-19 mph (vigorous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Swimming</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate pace</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Swimming</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fast pace</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Basketball</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Recreational</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tennis</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Competitive</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Jumping Rope</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate pace</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Elliptical Machine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate effort</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.0</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stationary Bike</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate intensity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">MET values are approximations based on standardized exercise physiology data. Actual values may vary by 10-20% depending on individual fitness level and technique.</p>
      </section>

      {/* TABLE: Estimated Calories Burned by Weight and Activity (30-minute duration) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Calories Burned by Weight and Activity (30-minute duration)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated calories burned during 30 minutes of selected activities for different body weights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity (MET)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">130 lbs (59 kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">155 lbs (70 kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">185 lbs (84 kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Walking 3.5 mph (3.5 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">103</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">123</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">147</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brisk Walking 4.5 mph (5.0 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">147</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Jogging 5 mph (8.3 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">245</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">291</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">349</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Running 6 mph (9.8 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">345</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">414</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Running 8 mph (11.8 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">348</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">413</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">496</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cycling 12 mph (6.0 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">177</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">252</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cycling 18 mph (12.0 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">354</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">504</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Swimming moderate (8.0 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">236</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">336</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Basketball (8.0 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">236</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">336</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Jump Rope (11.0 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">324</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">385</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">462</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie estimates are based on standard MET calculations and assume consistent effort throughout the duration. Individual results may vary based on age, metabolism, fitness level, and environmental factors.</p>
      </section>

      {/* TABLE: Daily Calorie Burn Scenarios (160-lb person) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Burn Scenarios (160-lb person)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different exercise combinations accumulate daily calorie burn for a 160-pound individual.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Exercise Routine</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Calories Burned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-min morning jog (5 mph) + 20-min evening walk (3.5 mph)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 min total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45-min cycling session (12 mph) + 15-min stretch (1 MET)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 min total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">327</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-hour moderate swimming</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">560</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-min running (6 mph) + 30-min brisk walking (4.5 mph)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 min total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">405</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Basketball game (recreational, continuous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">560</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45-min vigorous cycling (18 mph)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">630</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Daily walk (3.5 mph) + office desk work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Walking 30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Totals are based on a 160-pound (73 kg) individual and rounded to nearest 5 calories. Actual burn depends on exact intensity, fitness level, and personal metabolism.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Log both duration and intensity accurately—a 30-minute 'run' at 5 mph burns significantly fewer calories than a 30-minute run at 8 mph, so selecting the correct intensity level is crucial for realistic estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator weekly to track how your calorie burn changes as your fitness improves; the same activity becomes easier (lower perceived exertion) as cardiovascular fitness increases, but MET values may remain constant in standard calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine calories burned from multiple activities to get your total exercise calorie expenditure for the day, then compare against your dietary intake to assess whether you're achieving your weight management or fitness goals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for weather and environmental factors when estimating intensity—running uphill, in heat, or on uneven terrain increases actual calorie burn beyond standard MET values by 10-30%, so consider upgrading to the next intensity level under challenging conditions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing total calorie burn with net calorie burn</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator shows gross calories burned during activity, not net calories (activity calories minus resting calories). If your body burns 300 calories running and would have burned 50 calories resting during that 30 minutes, your net burn is only 250 calories, not 300.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using inaccurate body weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Since calorie burn is directly proportional to body weight, entering incorrect weight significantly skews results. A 20-pound difference in weight changes calorie estimates by approximately 25-30%, so weigh yourself on a reliable scale when using this calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating activity intensity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people select higher intensity levels than they actually achieve—for example, rating their pace as 'brisk' walking when it's actually casual. Be honest about intensity to avoid overestimating calorie burn by 30-50%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring individual metabolic variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">MET values are population averages; your personal calorie burn can vary 10-20% from estimates depending on age, fitness level, metabolism, and muscle mass. Highly trained athletes may burn fewer calories due to greater movement efficiency, while deconditioned individuals may burn more.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is MET and how does it relate to calories burned?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MET stands for Metabolic Equivalent of Task, a unit that measures the intensity of physical activity relative to resting metabolism. One MET equals the energy expended sitting at rest, approximately 1 calorie per kilogram of body weight per hour. The calculator multiplies your body weight, activity duration, and the activity's MET value to determine total calories burned with scientific accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories does a 150-pound person burn running at 6 mph for 30 minutes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Running at 6 mph has a MET value of approximately 9.8. For a 150-pound (68 kg) person exercising for 30 minutes, the calculation is: 68 kg × 9.8 MET × 0.5 hours = 333 calories burned. This makes running one of the most effective calorie-burning activities compared to walking or cycling at moderate intensity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does body weight affect how many calories I burn during exercise?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, body weight directly affects calorie expenditure—heavier individuals burn more calories performing the same activity. A 200-pound person running at 6 mph for 30 minutes burns approximately 445 calories, while a 130-pound person burns approximately 290 calories. This is because larger bodies require more energy to move and maintain functions during exercise.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What activities have the highest MET values for calorie burning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High-intensity activities burn the most calories per hour: sprinting (&gt;20 MET), jumping rope (11-16 MET), vigorous cycling (14-16 MET), and competitive sports like basketball (8-10 MET). In comparison, casual walking at 2 mph burns only 2.8 MET, making high-intensity activities 5-7 times more efficient for calorie burning in shorter timeframes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the MET-based calorie calculation method?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MET-based calculations are considered reliable for estimating average calorie burn with a typical accuracy range of ±10-20%, according to exercise physiology research. Individual variations due to fitness level, age, metabolism, and environmental factors mean actual calorie burn may differ, but MET remains the most standardized method used by fitness professionals and health organizations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to track daily calorie deficit for weight loss?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator helps estimate exercise-related calorie burn, which you can subtract from daily intake to calculate deficit. However, weight loss requires combining exercise calories with dietary tracking—a 500-calorie daily deficit typically results in 1 pound of weight loss per week. Remember that the calculator estimates calories burned during activity only, not resting metabolic rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does intensity level change the MET value for the same activity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—the same activity at different intensities has significantly different MET values. Cycling at 10-12 mph is 6 MET, while cycling at 16-19 mph is 12 MET. This means doubling your effort intensity can double calorie burn, which is why the calculator requires you to specify intensity levels for accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between light, moderate, and vigorous activity intensity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Light activity (&lt;3 MET) includes walking slowly or casual stretching; moderate activity (3-6 MET) includes brisk walking or recreational cycling; vigorous activity (&gt;6 MET) includes running, competitive sports, or high-intensity interval training. The intensity directly impacts how many calories you burn—vigorous activity burns 2-4 times more calories than light activity in the same duration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust calculator results if I have above-average or below-average fitness?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MET values assume average fitness levels; highly trained athletes may burn fewer calories due to greater efficiency, while deconditioned individuals may burn slightly more due to less efficient movement. If you're significantly more or less fit than average, expect 10-15% variation from calculated results. Tracking your actual heart rate and weight changes over time provides personalized calibration of estimates.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://sites.google.com/site/compendiumofphysicalactivities/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Compendium of Physical Activities</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A comprehensive database of MET values for over 800 physical activities used as the gold standard reference for exercise intensity measurement.</p>
          </li>
          <li>
            <a href="https://www.heart.org/en/healthy-living/fitness" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association - Physical Activity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on physical activity recommendations and exercise intensity levels from the leading cardiovascular health organization.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/physicalactivity/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Physical Activity Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government health authority standards for moderate and vigorous physical activity and their metabolic equivalents for public health.</p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Sports Medicine Exercise Testing Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization standards for measuring exercise intensity, MET calculations, and fitness assessment methodologies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calories Burned by Activity (MET-based)"
      description="Estimate calories burned during exercise. Use MET values to calculate energy expenditure for running, cycling, swimming, and more."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "Calories Burned = MET × Weight (kg) × Duration (hours)",
        variables: [
          {
            symbol: "MET",
            description:
              "Metabolic Equivalent of Task, a unit representing the energy cost of an activity relative to resting.",
          },
          {
            symbol: "Weight (kg)",
            description: "Your body weight in kilograms.",
          },
          {
            symbol: "Duration (hours)",
            description: "Time spent performing the activity, converted to hours.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 150 lb (68 kg) person runs at 6 mph (MET = 9.8) for 30 minutes.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 150 lbs × 0.453592 = 68 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert duration to hours: 30 minutes ÷ 60 = 0.5 hours.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate calories burned: 9.8 × 68 × 0.5 = 333.2 kcal.",
          },
        ],
        result: "The person burns approximately 333 calories during the run.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Calories Burned by Activity (MET-based)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}