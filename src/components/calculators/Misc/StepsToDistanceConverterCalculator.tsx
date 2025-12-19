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

export default function StepsToDistanceConverterCalculator() {
  const [inputs, setInputs] = useState({
    steps: "",
    strideLength: "",
    strideUnit: "inches",
    distanceUnit: "miles",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion constants
  const INCHES_IN_MILE = 63360;
  const INCHES_IN_KM = 39370.1;

  const results = useMemo(() => {
    const stepsNum = Number(inputs.steps);
    const strideLengthNum = Number(inputs.strideLength);
    if (
      isNaN(stepsNum) ||
      stepsNum <= 0 ||
      isNaN(strideLengthNum) ||
      strideLengthNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for steps and stride length.",
        formulaUsed: "",
      };
    }

    // Convert stride length to inches if needed
    let strideInInches = strideLengthNum;
    if (inputs.strideUnit === "cm") {
      strideInInches = strideLengthNum / 2.54;
    } else if (inputs.strideUnit === "meters") {
      strideInInches = strideLengthNum * 39.3701;
    }

    // Calculate total distance in inches
    const totalDistanceInches = stepsNum * strideInInches;

    // Convert total distance to desired unit
    let distance = 0;
    let label = "";
    if (inputs.distanceUnit === "miles") {
      distance = totalDistanceInches / INCHES_IN_MILE;
      label = "Miles";
    } else if (inputs.distanceUnit === "kilometers") {
      distance = totalDistanceInches / INCHES_IN_KM;
      label = "Kilometers";
    } else if (inputs.distanceUnit === "meters") {
      distance = (totalDistanceInches / 39.3701);
      label = "Meters";
    } else if (inputs.distanceUnit === "feet") {
      distance = totalDistanceInches / 12;
      label = "Feet";
    }

    return {
      value: distance.toFixed(4),
      label,
      subtext: `Based on ${stepsNum.toLocaleString()} steps and a stride length of ${strideLengthNum} ${inputs.strideUnit}.`,
      warning: null,
      formulaUsed:
        "Distance = Steps × Stride Length (converted to inches) ÷ Unit Conversion Factor",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the steps to distance conversion?",
      answer:
        "The accuracy depends largely on the precision of your stride length measurement and consistency of your walking pattern. Individual stride length can vary based on height, walking speed, and terrain, so this calculator provides an estimate rather than an exact measurement.",
    },
    {
      question: "How do I measure my stride length accurately?",
      answer:
        "To measure your stride length, walk a known distance (e.g., 20 feet) counting your steps, then divide the distance by the number of steps. This gives an average stride length. For more precise results, measure multiple times and average the values.",
    },
    {
      question: "Can I use this calculator for running steps?",
      answer:
        "Yes, but keep in mind that running stride lengths are typically longer than walking strides. If you know your running stride length, input that value for better accuracy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="steps" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Number of Steps
          </Label>
          <Input
            id="steps"
            type="number"
            min={0}
            placeholder="e.g., 10000"
            value={inputs.steps}
            onChange={(e) => handleInputChange("steps", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="strideLength" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
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
            />
            <Select
              value={inputs.strideUnit}
              onValueChange={(v) => handleInputChange("strideUnit", v)}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inches">Inches</SelectItem>
                <SelectItem value="cm">Centimeters</SelectItem>
                <SelectItem value="meters">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="distanceUnit" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Distance Unit
          </Label>
          <Select
            id="distanceUnit"
            value={inputs.distanceUnit}
            onValueChange={(v) => handleInputChange("distanceUnit", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="miles">Miles</SelectItem>
              <SelectItem value="kilometers">Kilometers</SelectItem>
              <SelectItem value="meters">Meters</SelectItem>
              <SelectItem value="feet">Feet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state with current inputs (noop)
            setInputs((p) => ({ ...p }));
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              steps: "",
              strideLength: "",
              strideUnit: "inches",
              distanceUnit: "miles",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 shadow-md">
          <CardContent className="p-6 text-center text-yellow-800 dark:text-yellow-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value} {results.label}
            </p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: {results.formulaUsed}
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
          Understanding Steps → Distance Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Converting steps to distance is a practical way to quantify physical activity,
          especially for those tracking fitness goals or daily movement. The distance you
          cover depends on your stride length, which varies by individual factors such as
          height, gender, and walking speed. This calculator uses your inputted step count
          and stride length to estimate the total distance traveled in your preferred unit,
          whether miles, kilometers, meters, or feet. Understanding this conversion helps
          provide meaningful insights into your daily activity levels and supports health
          monitoring.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately convert your steps into distance, you need two key pieces of information: your total number of steps and your average stride length. The stride length is the distance covered in one step and can be measured in inches, centimeters, or meters. Select your preferred unit for the output distance to see your total distance walked or run in miles, kilometers, meters, or feet.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Enter the total number of steps you have taken during your activity or day.
          </li>
          <li>
            Input your average stride length and select the unit that corresponds to your measurement.
          </li>
          <li>
            Choose the unit in which you want the distance result displayed.
          </li>
          <li>
            Click "Calculate" to see your estimated distance traveled.
          </li>
          <li>
            Use the "Reset" button to clear all inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For the most accurate distance estimation, measure your stride length on a flat,
          consistent surface and average multiple measurements. Remember that stride length
          can change with walking speed, terrain, and fatigue, so consider these factors
          when interpreting results. If you use a fitness tracker or pedometer, compare its
          distance output with this calculator to calibrate your stride length. Always
          prioritize safety during walking or running activities by wearing appropriate
          footwear and staying aware of your surroundings.
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
              href="https://www.cdc.gov/physicalactivity/basics/measuring/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC - Measuring Physical Activity <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines on how to measure physical activity including step counts and distance estimations.
            </p>
          </li>
          <li>
            <a
              href="https://www.verywellfit.com/how-to-measure-your-stride-length-3432777"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Verywell Fit - How to Measure Your Stride Length <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice and step-by-step instructions for accurately measuring your stride length.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/vehicles/articles/fotw-1126-june-15-2020-average-person-walks-about-7500-steps-day"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy - Average Steps per Day <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Data and statistics on average daily step counts and related energy expenditure.
            </p>
          </li>
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
        formula:
          "Distance = Steps × Stride Length (converted to inches) ÷ Unit Conversion Factor",
        variables: [
          { name: "Steps", description: "Total number of steps taken" },
          { name: "Stride Length", description: "Length of one step in inches, cm, or meters" },
          { name: "Unit Conversion Factor", description: "Number of inches in the desired distance unit" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you walked 8,000 steps today and your average stride length is 30 inches. You want to know how many miles you covered.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 8000 for the number of steps and 30 for the stride length, selecting 'inches' as the stride unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Choose 'miles' as the distance unit to get the result in miles.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to see the estimated distance walked.",
          },
        ],
        result:
          "The calculator will show approximately 4.77 miles, calculated as (8000 × 30) ÷ 63360.",
      }}
      relatedCalculators={[
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday-life/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday-life/garden-soil-compost-volume", icon: "🌿" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
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