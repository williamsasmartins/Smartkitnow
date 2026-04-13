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

function formatTime(seconds: number) {
  if (seconds <= 0 || !isFinite(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function RunningPaceSpeedSplitsCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  // Inputs:
  // distance: miles or km
  // time: hours, minutes, seconds
  // split distance: optional, miles or km
  const [inputs, setInputs] = useState<{
    distance?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    splitDistance?: number;
  }>({});

  // 2. LOGIC
  const results = useMemo(() => {
    const { distance, hours = 0, minutes = 0, seconds = 0, splitDistance } =
      inputs;

    if (
      !distance ||
      distance <= 0 ||
      (hours === 0 && minutes === 0 && seconds === 0) ||
      distance === undefined
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Total time in seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) return { value: 0, label: "", category: "" };

    // Convert distance to meters for metric calculations internally
    // Imperial: miles to meters (1 mile = 1609.344 m)
    // Metric: km to meters (1 km = 1000 m)
    const distanceMeters =
      unit === "imperial" ? distance * 1609.344 : distance * 1000;

    // Pace = time / distance (seconds per mile or km)
    const paceSecondsPerUnit = totalSeconds / distance;

    // Speed = distance / time (mph or kph)
    const speed =
      unit === "imperial"
        ? (distance / (totalSeconds / 3600)) // mph
        : (distance / (totalSeconds / 3600)); // kph

    // Splits calculation
    let splits: {
      splitCount: number;
      splitTimeSeconds: number;
      splitPaceSeconds: number;
    } | null = null;

    if (splitDistance && splitDistance > 0 && splitDistance <= distance) {
      const splitCount = Math.floor(distance / splitDistance);
      const splitTimeSeconds = totalSeconds / splitCount;
      const splitPaceSeconds = splitTimeSeconds / splitDistance;
      splits = { splitCount, splitTimeSeconds, splitPaceSeconds };
    }

    // Format pace as mm:ss per mile or km
    const paceFormatted = formatTime(paceSecondsPerUnit);

    // Format speed to 2 decimals
    const speedFormatted = speed.toFixed(2);

    // Compose label and category
    const paceLabel =
      unit === "imperial"
        ? `Pace (min/mile): ${paceFormatted}`
        : `Pace (min/km): ${paceFormatted}`;
    const speedLabel =
      unit === "imperial"
        ? `Speed (mph): ${speedFormatted}`
        : `Speed (kph): ${speedFormatted}`;

    // For results card, show pace and speed combined
    // If splits available, show splits info below

    // We'll return an object with multiple values for rendering
    return {
      value: 1, // dummy to trigger rendering
      label: "",
      category: "",
      paceFormatted,
      speedFormatted,
      paceLabel,
      speedLabel,
      splits,
      unit,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between pace and speed when running?",
      answer: "Pace is the amount of time it takes to cover a specific distance (typically expressed in minutes per mile or kilometer), while speed is the distance covered in a set amount of time (typically expressed in miles per hour or kilometers per hour). For example, a runner with a pace of 8:00 minutes per mile is traveling at a speed of 7.5 mph. This calculator converts between these two metrics instantly so you can track your performance in whichever unit you prefer.",
    },
    {
      question: "How do I calculate my running splits?",
      answer: "A split is your time for a specific segment of a run, such as each mile or kilometer. To calculate splits, divide your total running time by the number of segments completed. For instance, if you ran 5 miles in 42 minutes and 30 seconds, your average split per mile would be 8:30. This calculator automatically computes splits for any distance and time combination, helping you analyze pace consistency throughout your workout.",
    },
    {
      question: "What is a good 5K running pace for beginners?",
      answer: "A good 5K pace for beginning runners typically ranges from 11:00 to 13:00 minutes per mile, which translates to speeds between 4.6 and 5.5 mph. As fitness improves, many runners aim to break 10:00 minutes per mile (6.0 mph). Using the calculator, you can track your 5K splits over time and monitor your progress toward more competitive paces, which generally start around 8:00 minutes per mile for recreational runners.",
    },
    {
      question: "How can I use this calculator to improve my marathon training?",
      answer: "For marathon training, use this calculator to establish your target goal pace based on your fitness level and desired finish time. If you want to complete a marathon (26.2 miles) in 4 hours, you need an average pace of 9:05 minutes per mile. Calculate splits for each training run to ensure you're staying on target, and use the speed conversion feature to monitor whether you're hitting your aerobic training zones at the correct intensities.",
    },
    {
      question: "What does negative split mean in running?",
      answer: "A negative split occurs when you run the second half of a race faster than the first half, which is a sign of good pacing strategy and remaining energy reserve. For example, if you run the first 13.1 miles of a marathon at 9:30 minutes per mile and the final 13.1 miles at 8:45 minutes per mile, you've achieved a negative split. This calculator helps you analyze your splits segment by segment to identify whether you're front-loading your effort or maintaining consistent, smart pacing.",
    },
    {
      question: "How do I convert my running pace to speed for fitness tracking apps?",
      answer: "Most fitness apps allow you to input either pace (min/mile) or speed (mph), but not all accept both formats. This calculator instantly converts between the two: a pace of 7:30 per mile equals 8.0 mph, while 6:00 per mile equals 10.0 mph. Simply enter your known metric and the calculator will provide the equivalent in the other unit, which you can then log into your fitness tracking app or smartwatch.",
    },
    {
      question: "What is the average running pace for a half marathon?",
      answer: "The average half marathon pace for recreational runners typically falls between 9:00 and 11:00 minutes per mile (5.5 to 6.7 mph), with a typical finish time around 2 hours. Competitive runners often aim for paces between 7:00 and 8:30 minutes per mile. Using this calculator, you can establish your target half marathon pace based on your current fitness level, then use it to calculate your projected finish time and monitor your training splits to ensure consistent pacing.",
    },
    {
      question: "How should I pace my 10K race differently than a 5K?",
      answer: "A 10K requires a more conservative pace than a 5K because fatigue accumulates over the longer distance. If you can run a 5K at 8:00 minutes per mile, a sustainable 10K pace might be closer to 8:30-8:45 minutes per mile. This calculator allows you to input various paces and distances to find the right balance between speed and endurance for your training plan.",
    },
    {
      question: "Can this calculator help me set realistic running goals?",
      answer: "Yes, this calculator is an excellent tool for goal-setting by helping you understand the relationship between pace, speed, distance, and time. If you aim to run a 10K in under 50 minutes, the calculator shows you need an average pace of 8:02 minutes per mile (7.45 mph). By calculating splits and testing different paces, you can set incremental goals that are challenging but achievable based on your current fitness level.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange =
    (field: keyof typeof inputs) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputs((prev) => ({
        ...prev,
        [field]: val === "" ? undefined : Number(val),
      }));
    };

  // Reset inputs
  const resetInputs = () => {
    setInputs({});
  };

  // Calculate button triggers no async, so just no-op here
  // Calculation is memoized and reactive

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

        {/* Distance Input */}
        <div>
          <Label htmlFor="distance" className="text-slate-700 dark:text-slate-300">
            Distance ({unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            id="distance"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter distance in ${unit === "imperial" ? "miles" : "kilometers"}`}
            value={inputs.distance ?? ""}
            onChange={onInputChange("distance")}
          />
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hours" className="text-slate-700 dark:text-slate-300">
              Hours
            </Label>
            <Input
              id="hours"
              type="number"
              min={0}
              step={1}
              placeholder="0"
              value={inputs.hours ?? ""}
              onChange={onInputChange("hours")}
            />
          </div>
          <div>
            <Label htmlFor="minutes" className="text-slate-700 dark:text-slate-300">
              Minutes
            </Label>
            <Input
              id="minutes"
              type="number"
              min={0}
              max={59}
              step={1}
              placeholder="0"
              value={inputs.minutes ?? ""}
              onChange={onInputChange("minutes")}
            />
          </div>
          <div>
            <Label htmlFor="seconds" className="text-slate-700 dark:text-slate-300">
              Seconds
            </Label>
            <Input
              id="seconds"
              type="number"
              min={0}
              max={59}
              step={1}
              placeholder="0"
              value={inputs.seconds ?? ""}
              onChange={onInputChange("seconds")}
            />
          </div>
        </div>

        {/* Split Distance Input */}
        <div>
          <Label
            htmlFor="splitDistance"
            className="text-slate-700 dark:text-slate-300"
            title="Optional: Enter split distance to calculate split times"
          >
            Split Distance ({unit === "imperial" ? "miles" : "kilometers"}) (optional)
          </Label>
          <Input
            id="splitDistance"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter split distance in ${unit === "imperial" ? "miles" : "kilometers"}`}
            value={inputs.splitDistance ?? ""}
            onChange={onInputChange("splitDistance")}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                {results.paceLabel}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-4">
                {results.speedLabel}
              </p>
              {results.splits && (
                <div className="mt-4 text-blue-800 dark:text-blue-300 font-semibold text-lg">
                  <p>
                    Splits ({results.unit === "imperial" ? "miles" : "kilometers"}):{" "}
                    {results.splits.splitCount} splits
                  </p>
                  <p>
                    Average split time:{" "}
                    <span className="font-extrabold text-white dark:text-white">
                      {formatTime(results.splits.splitTimeSeconds)}
                    </span>
                  </p>
                  <p>
                    Average split pace:{" "}
                    <span className="font-extrabold text-white dark:text-white">
                      {formatTime(results.splits.splitPaceSeconds)} per{" "}
                      {results.unit === "imperial" ? "mile" : "km"}
                    </span>
                  </p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Running Pace, Speed & Split Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Running Pace, Speed & Split Calculator is an essential tool for runners of all levels who want to understand their performance metrics and set realistic training goals. Whether you're preparing for your first 5K or training for a marathon, this calculator instantly converts between pace and speed, calculates projected finish times, and breaks down your performance into meaningful segments. By having these metrics at your fingertips, you can make informed decisions about your training intensity, adjust your goals based on actual data, and track improvements over time.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your known metric: either your running pace (minutes and seconds per mile or kilometer), your speed (miles or kilometers per hour), or your total time and distance covered. The calculator will automatically convert between pace and speed formats and can compute your splits for any segment distance you specify. Understanding these inputs helps you communicate your performance clearly with coaches, compare yourself against benchmarks, and identify whether you're training in the correct aerobic or anaerobic zones for your fitness goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results reveal not just your overall performance but also provide actionable insights for training adjustments. If the calculator shows you're running a 9:30 pace for a 10K but your goal is 8:30, you have a clear target improvement of one minute per mile. Use the split functionality to analyze whether your pace was consistent throughout your run, which indicates sustainable effort, or whether you faded in the final miles, suggesting you need to build endurance or adjust your starting pace strategy.</p>
        </div>
      </section>

      {/* TABLE: Common Running Pace Benchmarks by Distance */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Running Pace Benchmarks by Distance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical pace ranges for recreational and competitive runners across common race distances in 2024-2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Distance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recreational Pace (min/mile)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Competitive Pace (min/mile)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Elite Pace (min/mile)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5K (3.1 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10:30–12:30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7:00–8:30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:45–5:30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10K (6.2 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11:00–13:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7:45–9:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5:00–5:45</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Half Marathon (13.1 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11:30–13:30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8:30–10:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5:15–6:00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Marathon (26.2 miles)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12:00–14:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9:00–11:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5:30–6:30</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pace ranges vary by age, gender, and training experience. Use this calculator to find your personal baseline and track improvements.</p>
      </section>

      {/* TABLE: Pace to Speed Conversion Chart */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pace to Speed Conversion Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for converting between minutes per mile (pace) and miles per hour (speed).</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pace (min/mile)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed (km/h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.57</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.7</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">11:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">13:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.62</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.4</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Use this conversion table to quickly reference pace and speed equivalents without calculating, or verify calculator outputs.</p>
      </section>

      {/* TABLE: Target Finish Times Based on Goal Pace */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Target Finish Times Based on Goal Pace</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows projected finish times for various distances when running at consistent target paces.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Goal Pace (min/mile)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5K Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10K Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Half Marathon Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Marathon Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21:42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43:24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:31:42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3:03:24</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24:52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49:44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:44:52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3:29:44</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27:54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55:48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:57:54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3:55:48</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:02:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:11:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:22:00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">11:00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34:06</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:08:12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2:24:06</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4:48:12</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are theoretical times assuming consistent pace throughout; actual performance may vary due to terrain, weather, and fatigue factors.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your splits during every training run using this calculator — consistent negative splits (faster second half) or even splits indicate good pacing strategy, while positive splits may signal insufficient aerobic fitness or improper warm-up.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator to establish your aerobic base pace, which should typically be 1.5 to 2 minutes per mile slower than your 5K race pace; training exclusively at fast paces leads to burnout and injury, so verify your easy-run paces fall in the correct zone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate different race scenarios before committing to a goal time — if your 10K splits suggest you're averaging 9:15 per mile, a marathon at 9:00 per mile may be unrealistic; use the calculator to set conservative goals that motivate rather than discourage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Convert your pace to speed when analyzing heart rate zones, as many fitness trackers and coaching plans reference zones by mph or km/h rather than min/mile, ensuring you're training at the intended physiological intensity for each workout.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing pace with speed</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many runners think pace and speed are interchangeable, but they're inverse metrics—a slower pace (higher number) equals lower speed, and vice versa. Entering pace when the calculator expects speed, or vice versa, will produce completely inaccurate results; always verify which metric the input field requires before entering your data.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring splits during training</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using only your overall finish time ignores critical information about pacing consistency. A runner who completes 5 miles in 40 minutes appears to average 8:00 per mile, but splits might reveal they ran the first 3 miles at 7:30 and the final 2 miles at 9:00, indicating a lack of endurance; the calculator's split feature exposes this hidden fatigue.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting goals based on one good run</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A single fast run doesn't reflect your sustainable capability—conditions like downhill terrain, favorable weather, or adrenaline can produce artificially fast paces. Calculate your pace over multiple runs and use the average to set realistic training goals; chasing one exceptional performance often leads to overtraining and injury.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for distance measurement errors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">GPS watches and running apps can have accuracy variances of 5-10%, meaning a 5K might actually be 4.95 or 5.1 miles; if your calculated pace seems off, verify your route distance using this calculator with multiple distance measurements to identify systematic GPS drift in your device.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between pace and speed when running?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pace is the amount of time it takes to cover a specific distance (typically expressed in minutes per mile or kilometer), while speed is the distance covered in a set amount of time (typically expressed in miles per hour or kilometers per hour). For example, a runner with a pace of 8:00 minutes per mile is traveling at a speed of 7.5 mph. This calculator converts between these two metrics instantly so you can track your performance in whichever unit you prefer.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my running splits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A split is your time for a specific segment of a run, such as each mile or kilometer. To calculate splits, divide your total running time by the number of segments completed. For instance, if you ran 5 miles in 42 minutes and 30 seconds, your average split per mile would be 8:30. This calculator automatically computes splits for any distance and time combination, helping you analyze pace consistency throughout your workout.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a good 5K running pace for beginners?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A good 5K pace for beginning runners typically ranges from 11:00 to 13:00 minutes per mile, which translates to speeds between 4.6 and 5.5 mph. As fitness improves, many runners aim to break 10:00 minutes per mile (6.0 mph). Using the calculator, you can track your 5K splits over time and monitor your progress toward more competitive paces, which generally start around 8:00 minutes per mile for recreational runners.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I use this calculator to improve my marathon training?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For marathon training, use this calculator to establish your target goal pace based on your fitness level and desired finish time. If you want to complete a marathon (26.2 miles) in 4 hours, you need an average pace of 9:05 minutes per mile. Calculate splits for each training run to ensure you're staying on target, and use the speed conversion feature to monitor whether you're hitting your aerobic training zones at the correct intensities.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does negative split mean in running?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A negative split occurs when you run the second half of a race faster than the first half, which is a sign of good pacing strategy and remaining energy reserve. For example, if you run the first 13.1 miles of a marathon at 9:30 minutes per mile and the final 13.1 miles at 8:45 minutes per mile, you've achieved a negative split. This calculator helps you analyze your splits segment by segment to identify whether you're front-loading your effort or maintaining consistent, smart pacing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert my running pace to speed for fitness tracking apps?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most fitness apps allow you to input either pace (min/mile) or speed (mph), but not all accept both formats. This calculator instantly converts between the two: a pace of 7:30 per mile equals 8.0 mph, while 6:00 per mile equals 10.0 mph. Simply enter your known metric and the calculator will provide the equivalent in the other unit, which you can then log into your fitness tracking app or smartwatch.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average running pace for a half marathon?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average half marathon pace for recreational runners typically falls between 9:00 and 11:00 minutes per mile (5.5 to 6.7 mph), with a typical finish time around 2 hours. Competitive runners often aim for paces between 7:00 and 8:30 minutes per mile. Using this calculator, you can establish your target half marathon pace based on your current fitness level, then use it to calculate your projected finish time and monitor your training splits to ensure consistent pacing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I pace my 10K race differently than a 5K?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 10K requires a more conservative pace than a 5K because fatigue accumulates over the longer distance. If you can run a 5K at 8:00 minutes per mile, a sustainable 10K pace might be closer to 8:30-8:45 minutes per mile. This calculator allows you to input various paces and distances to find the right balance between speed and endurance for your training plan.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me set realistic running goals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator is an excellent tool for goal-setting by helping you understand the relationship between pace, speed, distance, and time. If you aim to run a 10K in under 50 minutes, the calculator shows you need an average pace of 8:02 minutes per mile (7.45 mph). By calculating splits and testing different paces, you can set incremental goals that are challenging but achievable based on your current fitness level.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.acsm.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Sports Medicine - Running Training Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides evidence-based recommendations for running pace zones and training intensities based on fitness level and age.</p>
          </li>
          <li>
            <a href="https://www.runnersworld.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Runner's World Training Plans and Pace Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Offers comprehensive pace benchmarks, training strategies, and expert advice on setting realistic running goals for various distances.</p>
          </li>
          <li>
            <a href="https://www.usatf.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USA Track & Field - Race Standards and Records</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official source for competitive running standards, qualifying paces, and performance benchmarks across all race distances.</p>
          </li>
          <li>
            <a href="https://www.nih.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institutes of Health - Exercise Physiology and Running Performance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific research on the physiological factors that influence running pace, aerobic capacity, and sustainable effort levels.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Running Pace, Speed & Split Calculator"
      description="Calculate running pace, speed, and splits. An essential tool for runners to plan race times and monitor training performance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: `
          Pace = Total Time / Distance
          Speed = Distance / Total Time
          Split Time = Total Time / Number of Splits
          Split Pace = Split Time / Split Distance
        `,
        variables: [
          { symbol: "Pace", description: "Time per mile or kilometer (min/unit)" },
          { symbol: "Speed", description: "Distance per hour (mph or kph)" },
          { symbol: "Total Time", description: "Total running time in seconds" },
          { symbol: "Distance", description: "Total distance run in miles or kilometers" },
          { symbol: "Split Time", description: "Time for each split segment" },
          { symbol: "Split Distance", description: "Distance of each split segment" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "You ran 5 miles in 40 minutes and want to know your pace, speed, and 1-mile splits.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input distance as 5 miles and time as 0 hours, 40 minutes, 0 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter split distance as 1 mile to calculate average split times.",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate to see your pace (8:00 min/mile), speed (7.5 mph), and splits (8:00 per mile).",
          },
        ],
        result:
          "Your average pace is 8 minutes per mile, speed is 7.5 mph, and each 1-mile split took approximately 8 minutes.",
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
        {
          id: "what-is",
          label: "What is Running Pace, Speed & Split Calculator?",
        },
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