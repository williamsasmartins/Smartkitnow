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
      question: "What is running pace and why is it important?",
      answer:
        "Running pace refers to the amount of time it takes to cover a specific distance, typically expressed as minutes per mile or kilometer. It is a critical metric for runners to monitor their performance, set goals, and tailor training plans. Understanding your pace helps in pacing yourself during races to avoid burnout and achieve optimal performance.",
    },
    {
      question: "How do I interpret the speed and pace values?",
      answer:
        "Speed is the distance covered per unit time, usually miles per hour (mph) or kilometers per hour (kph), while pace is the inverse, indicating how long it takes to cover a unit distance. A faster pace corresponds to a higher speed. For example, a pace of 8 minutes per mile equates to 7.5 mph. Both metrics provide insights into your running efficiency and endurance.",
    },
    {
      question: "What are split times and how can they help my training?",
      answer:
        "Split times break down your total run into smaller segments, such as each mile or kilometer, allowing you to analyze consistency and endurance throughout the run. Monitoring splits helps identify if you start too fast or slow down towards the end, enabling adjustments in pacing strategy for better race outcomes.",
    },
    {
      question: "Are there limitations to using this calculator?",
      answer:
        "While this calculator provides accurate pace, speed, and split estimates based on input distance and time, it assumes a constant pace throughout the run. Real-world factors such as terrain, weather, fatigue, and elevation changes can affect actual performance. Always use these calculations as guidelines rather than absolute values.",
    },
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
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Running Pace, Speed & Split Calculator?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Running Pace, Speed & Split Calculator is a specialized tool designed to help runners accurately determine their running pace, speed, and split times based on the distance covered and the total time taken. Pace is typically expressed as the time it takes to run one mile or kilometer, while speed is the distance covered per hour. Splits break down the run into smaller segments, allowing runners to analyze their consistency and endurance throughout their workout or race.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator supports both imperial units (miles, feet) and metric units (kilometers, meters), defaulting to imperial for users in the US and Canada. By inputting your total distance and time, you can instantly see your average pace and speed, as well as optional split times for any segment length you choose. This information is invaluable for training optimization, race planning, and performance tracking.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your pace and speed helps prevent common running mistakes such as starting too fast or too slow, which can lead to fatigue or suboptimal race results. Additionally, analyzing splits can reveal patterns in your running form and endurance, guiding adjustments in training intensity and recovery strategies. This calculator empowers runners of all levels to make data-driven decisions for improved performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are a beginner aiming to complete your first 5K or an experienced marathoner targeting a personal best, this calculator provides precise and actionable insights. It bridges the gap between raw data and meaningful interpretation, making it an essential companion for anyone serious about running.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and intuitive. Begin by selecting your preferred unit system—Imperial for miles or Metric for kilometers. Then, enter the total distance you ran or plan to run, followed by the total time taken, broken down into hours, minutes, and seconds. Optionally, you can specify a split distance to calculate average split times for segments of your run.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Distance:</strong> Enter the total distance of your run in miles or kilometers, depending on your selected unit system. This value must be greater than zero.
          </li>
          <li>
            <strong>Time:</strong> Input the total time taken to complete the distance, using hours, minutes, and seconds fields. At least one of these fields must be greater than zero.
          </li>
          <li>
            <strong>Split Distance (Optional):</strong> Specify a smaller segment distance (e.g., 1 mile or 1 km) to calculate average split times. This helps analyze pacing consistency.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see your average pace, speed, and splits (if provided). Use the reset button to clear all inputs and start fresh.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Trusted References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.runnersworld.com/uk/training/pace-speed/a776282/running-pace-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Runner's World - Running Pace Calculator
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guide on running pace, speed, and training strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.active.com/running/articles/how-to-calculate-your-running-pace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Active.com - How to Calculate Your Running Pace
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanation of pace calculation and its importance for runners.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Institutes of Health - Running Economy and Performance
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Scientific study on factors affecting running pace and endurance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.runnersconnect.net/running-splits-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. RunnersConnect - Understanding Running Splits
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Educational resource on how to use splits to improve race performance.
            </p>
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