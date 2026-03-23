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

  /**
   * Conversion constants:
   * 1 mile = 63,360 inches
   * 1 kilometer = 39,370.1 inches
   * 1 foot = 12 inches
   */

  const results = useMemo(() => {
    const stepsNum = Number(inputs.steps);
    const strideLengthNum = Number(inputs.strideLength);
    if (
      !stepsNum ||
      stepsNum <= 0 ||
      !strideLengthNum ||
      strideLengthNum <= 0 ||
      !["inches", "feet", "centimeters", "meters"].includes(inputs.strideUnit) ||
      !["miles", "kilometers", "meters", "feet"].includes(inputs.distanceUnit)
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive numbers for steps and stride length.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert stride length to inches for uniformity
    let strideInInches = 0;
    switch (inputs.strideUnit) {
      case "inches":
        strideInInches = strideLengthNum;
        break;
      case "feet":
        strideInInches = strideLengthNum * 12;
        break;
      case "centimeters":
        strideInInches = strideLengthNum / 2.54;
        break;
      case "meters":
        strideInInches = (strideLengthNum * 100) / 2.54;
        break;
      default:
        strideInInches = strideLengthNum;
    }

    // Total distance in inches
    const totalDistanceInches = stepsNum * strideInInches;

    // Convert total distance to desired unit
    let distance = 0;
    let unitLabel = "";
    switch (inputs.distanceUnit) {
      case "miles":
        distance = totalDistanceInches / 63360;
        unitLabel = "miles";
        break;
      case "kilometers":
        distance = totalDistanceInches / 39370.1;
        unitLabel = "kilometers";
        break;
      case "meters":
        distance = (totalDistanceInches * 2.54) / 100;
        unitLabel = "meters";
        break;
      case "feet":
        distance = totalDistanceInches / 12;
        unitLabel = "feet";
        break;
      default:
        distance = totalDistanceInches / 63360;
        unitLabel = "miles";
    }

    const roundedDistance = distance.toFixed(2);

    return {
      value: `${roundedDistance} ${unitLabel}`,
      label: "Converted Distance",
      subtext: `Based on ${stepsNum.toLocaleString()} steps and a stride length of ${strideLengthNum} ${inputs.strideUnit}.`,
      warning: null,
      formulaUsed:
        "Distance = Steps × Stride Length (converted) → converted to desired distance unit",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the steps to distance conversion?",
      answer:
        "The accuracy depends largely on the precision of your stride length measurement. Stride length can vary based on walking speed, terrain, and individual biomechanics. For best results, measure your average stride length by walking a known distance and dividing by the number of steps taken.",
    },
    {
      question: "Can I use this calculator for running steps?",
      answer:
        "Yes, but keep in mind that running stride lengths are typically longer than walking strides. If you want an accurate distance for running, use your average running stride length instead of walking stride length.",
    },
    {
      question: "Why do stride lengths vary between people?",
      answer:
        "Stride length varies due to factors such as height, leg length, walking speed, and fitness level. Taller individuals generally have longer strides, but walking style and terrain also influence stride length.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="steps">Number of Steps</Label>
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
          <Label htmlFor="strideLength">Stride Length</Label>
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
              <SelectTrigger aria-label="Select stride length unit" className="w-28">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inches">Inches</SelectItem>
                <SelectItem value="feet">Feet</SelectItem>
                <SelectItem value="centimeters">Centimeters</SelectItem>
                <SelectItem value="meters">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="distanceUnit">Distance Unit</Label>
          <Select
            id="distanceUnit"
            value={inputs.distanceUnit}
            onValueChange={(v) => handleInputChange("distanceUnit", v)}
          >
            <SelectTrigger aria-label="Select distance unit" className="w-full">
              <SelectValue placeholder="Select unit" />
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

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
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
              distanceUnit: "miles",
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
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-1 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
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
          Converting steps to distance is a practical way to estimate how far you have traveled during walking or running activities without relying on GPS devices. This conversion hinges on the concept of stride length, which is the distance covered in one step. Since stride length varies among individuals due to factors like height, walking speed, and terrain, this calculator allows you to input your personal stride length for a more accurate distance estimate. By multiplying the number of steps by the stride length and converting to your preferred distance unit, you gain a reliable approximation of your traveled distance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is especially useful for fitness enthusiasts, health professionals, and researchers who want to track physical activity levels or analyze walking patterns without specialized equipment. Understanding your stride length and how it affects distance calculations can also help improve your walking or running efficiency.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires just a few inputs. First, enter the total number of steps you have taken during your walk or run. Next, provide your average stride length, which is the distance covered in one step, and select the unit of measurement for your stride length. Finally, choose the unit in which you want the distance result displayed. Once all inputs are provided, click the calculate button to see your estimated distance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or estimate your average stride length. This can be done by walking a known distance and dividing by the number of steps taken.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total steps you want to convert into distance.
          </li>
          <li>
            <strong>Step 3:</strong> Select the units for stride length and desired output distance.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to get your distance estimate.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For the most accurate results, it is recommended to measure your stride length under conditions similar to your typical walking or running environment. Stride length can change with speed, fatigue, and terrain, so consider measuring multiple times and averaging the results. Additionally, if you use this calculator for health or fitness tracking, remember that step counts from different devices may vary due to sensor sensitivity and placement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure your walking or running activities are done safely, especially when outdoors. Wear appropriate footwear, stay hydrated, and be aware of your surroundings. If you have any medical conditions or concerns, consult a healthcare professional before starting a new physical activity regimen.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
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
              Comprehensive guidelines on how to measure physical activity including step counts and distance estimation.
            </p>
          </li>
          <li>
            <a
              href="https://www.verywellfit.com/how-to-measure-your-stride-length-3432827"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Verywell Fit - How to Measure Your Stride Length <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed instructions and tips for accurately measuring your walking and running stride length.
            </p>
          </li>
          <li>
            <a
              href="https://www.energy.gov/eere/vehicles/articles/how-far-can-you-walk-step-counts-and-distance"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Department of Energy - Step Counts and Distance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insights into step counting and distance conversion for energy expenditure and fitness tracking.
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
          { symbol: "Steps", description: "Number of steps taken" },
          { symbol: "Stride Length", description: "Length of one step in chosen unit" },
          { symbol: "Unit Conversion Factor", description: "Number of inches per chosen distance unit" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you walked 8,000 steps today, and your average stride length is 30 inches. You want to know how many miles you walked.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input 8,000 as the number of steps and 30 inches as your stride length.",
          },
          {
            label: "Step 2",
            explanation:
              "Select 'inches' as the stride length unit and 'miles' as the distance unit.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to get the distance: (8,000 steps × 30 inches) ÷ 63,360 inches per mile ≈ 3.79 miles.",
          },
        ],
        result: "You walked approximately 3.79 miles.",
      }}
      relatedCalculators={[
        { title: "Appliance Energy Consumption Calculator", url: "/everyday/appliance-energy-consumption", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday/planting-calendar-frost-date", icon: "🌿" },
        { title: "Body Fat Percentage Calculator", url: "/everyday/body-fat-percentage", icon: "💡" },
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