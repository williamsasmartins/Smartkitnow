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
      question: "How many steps equal 1 mile?",
      answer: "The average person takes approximately 2,000 steps to walk 1 mile, though this varies based on stride length, which ranges from 2.1 to 2.5 feet for most adults.",
    },
    {
      question: "Does stride length affect the conversion accuracy?",
      answer: "Yes, significantly. A person with a 2-foot stride and one with a 2.5-foot stride will cover different distances in the same number of steps; most converters use 2.2 feet as a standard average.",
    },
    {
      question: "Can I use this converter for running distances?",
      answer: "Running stride is typically 20-30% longer than walking stride, so you'll need to adjust your input or use a running-specific stride length of 2.5–3 feet for accurate results.",
    },
    {
      question: "What if I know my exact stride length in centimeters?",
      answer: "Convert centimeters to feet by dividing by 30.48, then input that value; for example, 67 cm equals approximately 2.2 feet.",
    },
    {
      question: "How do fitness trackers calculate step distance?",
      answer: "Most fitness trackers use proprietary algorithms and stored stride data from user setup; some allow manual stride length input for greater accuracy.",
    },
    {
      question: "Is there a difference between steps and strides?",
      answer: "Yes—a stride is two steps (left and right), so 1,000 strides equals 2,000 steps; conversion tools typically measure in steps, not strides.",
    },
    {
      question: "Why do my daily step counts vary in distance traveled?",
      answer: "Terrain, walking speed, fitness level, and footwear all affect stride length; inclines and uneven surfaces typically shorten your stride and reduce distance per step.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Steps → Distance Converter</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This converter transforms your step count into distance measurements (miles, kilometers, or feet). It's ideal for tracking daily activity, fitness goals, and validating data from fitness trackers or pedometers.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your total step count and, if available, your personal stride length in feet or centimeters. The standard default is 2.2 feet; inputting your actual stride ensures maximum accuracy for your unique body metrics.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The tool will calculate distance in multiple units instantly. Compare results against your fitness tracker's estimates to verify accuracy, or use the output to plan walking routes and distance-based fitness goals.</p>
        </div>
      </section>

      {/* TABLE: Average Steps to Distance by Stride Length */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Steps to Distance by Stride Length</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how many steps are needed to cover common distances based on typical stride lengths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stride Length (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Steps per 1 Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Steps per 5 Miles</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Steps per 10 Miles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,640</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,112</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21,120</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Stride lengths are typical for average adults; actual values vary by height, fitness, and walking speed.</p>
      </section>

      {/* TABLE: Daily Step Goals and Equivalent Distances */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Step Goals and Equivalent Distances</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference table for common daily step targets and their distance equivalents at a 2.2-foot average stride.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Step Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Distance (Miles)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Distance (Kilometers)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time at 3 mph</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38 minutes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56 minutes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76 minutes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114 minutes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">152 minutes</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times assume consistent 3 mph walking pace; actual duration varies with terrain and fitness level.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your stride length by walking 10 steps, dividing total distance by 10, and entering the result for personalized accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this converter to validate your fitness tracker's distance calculations—significant differences may indicate calibration issues.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for inclines and terrain; uphill and uneven surfaces reduce stride length by 5–15% compared to flat ground.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track stride length changes over time; improved fitness often increases stride length, altering your steps-to-distance ratio.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Steps with Strides</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">One stride equals two steps, so entering stride count will produce results half the actual distance—always convert to steps first.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using One Stride Length for All Activities</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Running stride is significantly longer than walking stride; use 2.5–3 feet for running and 2.0–2.2 feet for walking.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Height and Gender Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Taller individuals and men typically have longer strides; using a generic 2.2-foot average may underestimate their distance by 10–15%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to Account for Footwear</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wearing shoes versus barefoot, or switching between sneakers and heels, noticeably changes stride length and should be adjusted in conversions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many steps equal 1 mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average person takes approximately 2,000 steps to walk 1 mile, though this varies based on stride length, which ranges from 2.1 to 2.5 feet for most adults.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does stride length affect the conversion accuracy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, significantly. A person with a 2-foot stride and one with a 2.5-foot stride will cover different distances in the same number of steps; most converters use 2.2 feet as a standard average.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this converter for running distances?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Running stride is typically 20-30% longer than walking stride, so you'll need to adjust your input or use a running-specific stride length of 2.5–3 feet for accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I know my exact stride length in centimeters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Convert centimeters to feet by dividing by 30.48, then input that value; for example, 67 cm equals approximately 2.2 feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do fitness trackers calculate step distance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most fitness trackers use proprietary algorithms and stored stride data from user setup; some allow manual stride length input for greater accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is there a difference between steps and strides?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—a stride is two steps (left and right), so 1,000 strides equals 2,000 steps; conversion tools typically measure in steps, not strides.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do my daily step counts vary in distance traveled?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Terrain, walking speed, fitness level, and footwear all affect stride length; inclines and uneven surfaces typically shorten your stride and reduce distance per step.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/walking" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association: Walking for Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides guidelines on step counts and walking distance for cardiovascular health benefits.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/10000-steps/art-20317059" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic: How Many Steps a Day</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explains the science behind daily step goals and how step count relates to health outcomes.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3820844/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH National Center for Biotechnology: Stride Length and Gait Analysis</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific research on how stride length varies by age, height, and fitness level.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/physicalactivity/basics/index.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Physical Activity Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official recommendations for daily physical activity and step-based fitness tracking.</p>
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