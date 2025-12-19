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

export default function StepsToDistanceConverterCalculator() {
  /**
   * State to hold user inputs:
   * - steps: number of steps taken
   * - strideLength: length of each step in selected unit
   * - strideUnit: unit of stride length (inches, feet, cm, meters)
   * - outputUnit: desired output distance unit (miles, kilometers, meters, feet)
   */
  const [inputs, setInputs] = useState({
    steps: "",
    strideLength: "",
    strideUnit: "inches",
    outputUnit: "miles",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Conversion constants:
   * - inches to meters
   * - feet to meters
   * - cm to meters
   * - meters to meters (identity)
   * - meters to miles
   * - meters to kilometers
   * - meters to feet
   */
  const conversionFactors = {
    strideToMeters: {
      inches: 0.0254,
      feet: 0.3048,
      cm: 0.01,
      meters: 1,
    },
    metersToOutput: {
      miles: 0.000621371,
      kilometers: 0.001,
      meters: 1,
      feet: 3.28084,
    },
  };

  /**
   * Calculate the distance based on inputs:
   * distance = steps * strideLength (converted to meters) * conversion to output unit
   */
  const results = useMemo(() => {
    const stepsNum = Number(inputs.steps);
    const strideNum = Number(inputs.strideLength);
    const strideUnit = inputs.strideUnit;
    const outputUnit = inputs.outputUnit;

    if (
      isNaN(stepsNum) ||
      stepsNum <= 0 ||
      isNaN(strideNum) ||
      strideNum <= 0 ||
      !conversionFactors.strideToMeters[strideUnit] ||
      !conversionFactors.metersToOutput[outputUnit]
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for steps and stride length.",
        formulaUsed:
          "Distance = Steps × Stride Length (converted to meters) × Conversion factor to output unit",
      };
    }

    // Convert stride length to meters
    const strideMeters = strideNum * conversionFactors.strideToMeters[strideUnit];

    // Calculate distance in meters
    const distanceMeters = stepsNum * strideMeters;

    // Convert distance to desired output unit
    const distanceOutput = distanceMeters * conversionFactors.metersToOutput[outputUnit];

    // Format result with appropriate decimal places
    const formattedDistance =
      distanceOutput < 0.01
        ? distanceOutput.toExponential(3)
        : distanceOutput.toLocaleString(undefined, { maximumFractionDigits: 4 });

    return {
      value: `${formattedDistance} ${outputUnit}`,
      label: "Estimated Distance",
      subtext: `Based on ${stepsNum.toLocaleString()} steps and a stride length of ${strideNum} ${strideUnit}`,
      warning: null,
      formulaUsed:
        "Distance = Steps × Stride Length (converted to meters) × Conversion factor to output unit",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the distance calculated from steps?",
      answer:
        "The accuracy of distance estimation from steps depends largely on the accuracy of your stride length input. Stride length can vary based on height, walking speed, and terrain. Using an average stride length provides a reasonable estimate, but for precise tracking, consider measuring your stride length directly or using GPS-based devices.",
    },
    {
      question: "How do I measure my stride length correctly?",
      answer:
        "To measure your stride length, walk a known distance (e.g., 10 meters or 30 feet) counting your steps. Divide the total distance by the number of steps to get your average stride length. Repeat several times for accuracy. This method accounts for your natural walking pattern and provides a personalized stride length for better distance estimation.",
    },
    {
      question: "Can I convert steps to distance without knowing my stride length?",
      answer:
        "While you can estimate distance using average stride lengths based on height or gender, it is less accurate. This calculator requires stride length to provide a personalized and precise conversion. If you don't know your stride length, consider using average values (e.g., 2.5 feet for men, 2.2 feet for women) but keep in mind the result will be an approximation.",
    },
    {
      question: "Why are there different units for stride length and output distance?",
      answer:
        "People measure stride length in various units depending on their preference or measuring tools (inches, feet, centimeters, meters). Similarly, output distance units vary by region or use case (miles in the US, kilometers elsewhere). This flexibility ensures the calculator is useful globally and adapts to your preferred measurement system.",
    },
    {
      question: "What factors can affect my stride length during walking or running?",
      answer:
        "Stride length can change due to walking speed, terrain, fatigue, footwear, and individual biomechanics. Running typically results in longer strides than walking. Uneven surfaces or uphill/downhill walking also affect stride length. For best results, measure stride length under conditions similar to your typical activity.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="steps" className="font-semibold text-slate-900 dark:text-slate-100">
              Number of Steps
            </Label>
            <Input
              id="steps"
              type="number"
              min={0}
              placeholder="e.g., 10000"
              value={inputs.steps}
              onChange={(e) => handleInputChange("steps", e.target.value)}
              aria-describedby="steps-help"
            />
            <p id="steps-help" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter the total number of steps you walked or ran.
            </p>
          </div>

          <div>
            <Label htmlFor="strideLength" className="font-semibold text-slate-900 dark:text-slate-100">
              Stride Length
            </Label>
            <div className="flex gap-2">
              <Input
                id="strideLength"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 30"
                value={inputs.strideLength}
                onChange={(e) => handleInputChange("strideLength", e.target.value)}
                aria-describedby="stride-help"
              />
              <Select
                value={inputs.strideUnit}
                onValueChange={(v) => handleInputChange("strideUnit", v)}
                aria-label="Select stride length unit"
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches (in)</SelectItem>
                  <SelectItem value="feet">Feet (ft)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="meters">Meters (m)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p id="stride-help" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter your average stride length and select the unit.
            </p>
          </div>

          <div>
            <Label htmlFor="outputUnit" className="font-semibold text-slate-900 dark:text-slate-100">
              Output Distance Unit
            </Label>
            <Select
              id="outputUnit"
              value={inputs.outputUnit}
              onValueChange={(v) => handleInputChange("outputUnit", v)}
              aria-label="Select output distance unit"
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="miles">Miles (mi)</SelectItem>
                <SelectItem value="kilometers">Kilometers (km)</SelectItem>
                <SelectItem value="meters">Meters (m)</SelectItem>
                <SelectItem value="feet">Feet (ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => {
              // No special action needed, calculation is reactive
            }}
            aria-label="Calculate distance"
          >
            <Activity className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setInputs({
                steps: "",
                strideLength: "",
                strideUnit: "inches",
                outputUnit: "miles",
              })
            }
            className="flex-1 h-11"
            aria-label="Reset inputs"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
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
          Converting steps to distance is a practical way to estimate how far you have traveled during walking or running activities without relying on GPS devices. Since a step is a discrete unit of movement, the total distance covered depends on the length of each step, commonly referred to as stride length. Stride length varies between individuals based on factors such as height, gender, walking speed, and terrain.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to input your step count and stride length in various units, then converts these inputs into a meaningful distance measurement in miles, kilometers, meters, or feet. By understanding your personal stride length, you can obtain a much more accurate distance estimate than relying on generic averages. This is especially useful for fitness tracking, planning walking routes, or simply satisfying curiosity about your daily activity.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this steps to distance converter is straightforward and designed to accommodate users with varying levels of familiarity with measurement units. Follow these detailed steps to get your personalized distance estimate:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of steps you have taken. This can be from a pedometer, fitness tracker, or manual count.
          </li>
          <li>
            <strong>Step 2:</strong> Input your average stride length. If you do not know this value, measure it by walking a known distance and dividing by the number of steps, or use an average estimate based on your height.
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit of your stride length from the dropdown menu. Options include inches, feet, centimeters, and meters.
          </li>
          <li>
            <strong>Step 4:</strong> Choose the desired output distance unit. You can select miles, kilometers, meters, or feet depending on your preference or regional standards.
          </li>
          <li>
            <strong>Step 5:</strong> Click the <em>Calculate</em> button to see your estimated distance. The result will display below the inputs, along with a summary of your inputs.
          </li>
          <li>
            <strong>Step 6:</strong> If you want to perform another calculation, use the <em>Reset</em> button to clear all fields and start fresh.
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
      title="Steps → Distance Converter"
      description="Convert daily steps to distance. See how many miles or kilometers you walked based on your step count and stride length."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Distance = Steps × Stride Length (converted to meters) × Conversion factor to output unit",
        variables: [
          { symbol: "Steps", description: "Total number of steps taken" },
          {
            symbol: "Stride Length",
            description:
              "Average length of one step, converted to meters based on selected unit (inches, feet, cm, meters)",
          },
          {
            symbol: "Conversion factor",
            description:
              "Multiplier to convert meters into the desired output unit (miles, kilometers, meters, feet)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Imagine you walked 8,000 steps today, and you know your average stride length is 30 inches. You want to find out how many miles you have walked.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input 8,000 as the number of steps you took during your walk into the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter your stride length as 30 and select 'inches' as the unit since your stride length was measured in inches.",
          },
          {
            label: "Step 3",
            explanation:
              "Select 'miles' as the output distance unit to get the result in miles.",
          },
          {
            label: "Step 4",
            explanation:
              "Click the Calculate button. The calculator converts 30 inches to meters (30 × 0.0254 = 0.762 meters), then multiplies by 8,000 steps to get 6,096 meters, and finally converts meters to miles (6,096 × 0.000621371 = approximately 3.79 miles).",
          },
        ],
        result: "The calculator will display approximately 3.79 miles walked based on your inputs.",
      }}
      relatedCalculators={[
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday-life/planting-calendar-frost-date", icon: "🌿" },
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday-life/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday-life/appliance-energy-consumption", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday-life/hydration-reminder-interval", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday-life/lawn-mowing-time-fuel", icon: "💡" },
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