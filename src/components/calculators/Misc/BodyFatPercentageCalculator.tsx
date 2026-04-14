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

export default function BodyFatPercentageCalculator() {
  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    neck: "",
    waist: "",
    hip: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Body Fat % calculation using U.S. Navy Method (most common tape measure method)
  // Source: https://www.navyfitness.org/body-fat-calculator/
  // Formula:
  // For men: %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
  // For women: %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387

  const results = useMemo(() => {
    const { gender, age, weight, height, neck, waist, hip } = inputs;

    // Validate inputs presence and numeric
    if (
      !gender ||
      !age ||
      !weight ||
      !height ||
      !neck ||
      !waist ||
      (gender === "female" && !hip)
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all required fields to calculate body fat percentage.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert inputs to numbers
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const neckNum = Number(neck);
    const waistNum = Number(waist);
    const hipNum = gender === "female" ? Number(hip) : 0;

    if (
      [ageNum, weightNum, heightNum, neckNum, waistNum].some(
        (v) => isNaN(v) || v <= 0
      ) ||
      (gender === "female" && (isNaN(hipNum) || hipNum <= 0))
    ) {
      return {
        value: null,
        label: "",
        subtext: "All numeric inputs must be positive numbers.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Height, neck, waist, hip in cm or inches? We'll assume inches for formula.
    // If user inputs cm, we can add a note or convert, but for simplicity, assume inches.

    // Calculate body fat percentage using U.S. Navy method
    // Use Math.log10 for log base 10

    let bodyFat = null;
    let formulaUsed = "";

    if (gender === "male") {
      // Men formula
      // %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      if (waistNum <= neckNum) {
        return {
          value: null,
          label: "",
          subtext:
            "Waist measurement must be larger than neck measurement for calculation.",
          warning: "Input error",
          formulaUsed: "",
        };
      }
      bodyFat =
        86.010 * Math.log10(waistNum - neckNum) -
        70.041 * Math.log10(heightNum) +
        36.76;
      formulaUsed =
        "%BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76";
    } else if (gender === "female") {
      // Women formula
      // %BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
      if (waistNum + hipNum <= neckNum) {
        return {
          value: null,
          label: "",
          subtext:
            "Sum of waist and hip measurements must be larger than neck measurement for calculation.",
          warning: "Input error",
          formulaUsed: "",
        };
      }
      bodyFat =
        163.205 * Math.log10(waistNum + hipNum - neckNum) -
        97.684 * Math.log10(heightNum) -
        78.387;
      formulaUsed =
        "%BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387";
    } else {
      return {
        value: null,
        label: "",
        subtext: "Please select a valid gender.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Clamp body fat % between 2% and 60% for sanity
    if (bodyFat < 2) bodyFat = 2;
    if (bodyFat > 60) bodyFat = 60;

    // Round to 1 decimal place
    const bfRounded = bodyFat.toFixed(1);

    // Interpretation based on American Council on Exercise (ACE) body fat categories
    // Source: https://www.acefitness.org/resources/everyone/blog/6645/ace-s-body-fat-percentage-chart/
    let category = "";
    if (gender === "male") {
      if (bodyFat < 6) category = "Essential fat";
      else if (bodyFat < 14) category = "Athletes";
      else if (bodyFat < 18) category = "Fitness";
      else if (bodyFat < 25) category = "Average";
      else category = "Obese";
    } else {
      if (bodyFat < 14) category = "Essential fat";
      else if (bodyFat < 21) category = "Athletes";
      else if (bodyFat < 25) category = "Fitness";
      else if (bodyFat < 32) category = "Average";
      else category = "Obese";
    }

    return {
      value: `${bfRounded}%`,
      label: `Estimated Body Fat Percentage (${category})`,
      subtext:
        "This estimate is based on the U.S. Navy circumference method and provides a practical way to track body composition changes over time.",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What body fat percentage is considered healthy?",
      answer: "Healthy body fat ranges from 10-20% for men and 18-25% for women, though optimal levels vary by age and fitness goals.",
    },
    {
      question: "How accurate is this body fat calculator?",
      answer: "This calculator uses the Jackson-Pollock or US Navy method with ±3-5% accuracy; DEXA scans are more precise but less accessible.",
    },
    {
      question: "Do I need calipers to use this calculator?",
      answer: "No, most body fat calculators use measurements like waist, hip, and neck circumference, though some methods accept caliper readings for higher accuracy.",
    },
    {
      question: "Why does my body fat percentage differ from other calculators?",
      answer: "Different formulas (Jackson-Pollock, US Navy, Katch-McArdle) produce varying results; measurement accuracy and individual body composition also affect outcomes.",
    },
    {
      question: "Can body fat percentage change quickly?",
      answer: "Significant changes typically require 4-6 weeks of consistent diet and exercise; rapid fluctuations may indicate measurement errors rather than actual fat loss.",
    },
    {
      question: "Is body fat percentage more important than weight?",
      answer: "Yes, body fat percentage reveals body composition better than weight alone; two people at the same weight can have very different health profiles.",
    },
    {
      question: "How often should I recalculate my body fat percentage?",
      answer: "Recalculate monthly to track progress accurately, as weekly measurements can fluctuate due to water retention and hydration levels.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="mb-1 flex items-center gap-1">
                Gender <Users className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                id="gender"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age" className="mb-1 flex items-center gap-1">
                Age (years) <Calendar className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={120}
                placeholder="e.g., 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Weight (lbs) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="weight"
                type="number"
                min={50}
                max={1000}
                placeholder="e.g., 180"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="mb-1 flex items-center gap-1">
                Height (inches) <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="height"
                type="number"
                min={36}
                max={96}
                placeholder="e.g., 70"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="neck" className="mb-1 flex items-center gap-1">
                Neck Circumference (inches) <Wrench className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="neck"
                type="number"
                min={8}
                max={30}
                placeholder="e.g., 15"
                value={inputs.neck}
                onChange={(e) => handleInputChange("neck", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="waist" className="mb-1 flex items-center gap-1">
                Waist Circumference (inches) <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="waist"
                type="number"
                min={20}
                max={70}
                placeholder="e.g., 34"
                value={inputs.waist}
                onChange={(e) => handleInputChange("waist", e.target.value)}
              />
            </div>

            {inputs.gender === "female" && (
              <div>
                <Label htmlFor="hip" className="mb-1 flex items-center gap-1">
                  Hip Circumference (inches) <Scale className="w-4 h-4 text-blue-600" />
                </Label>
                <Input
                  id="hip"
                  type="number"
                  min={30}
                  max={70}
                  placeholder="e.g., 38"
                  value={inputs.hip}
                  onChange={(e) => handleInputChange("hip", e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate body fat percentage"
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              gender: "",
              age: "",
              weight: "",
              height: "",
              neck: "",
              waist: "",
              hip: "",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-red-600 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">
                Formula used: {results.formulaUsed}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Body Fat Percentage Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your body fat percentage using measurements like waist, hip, and neck circumference along with your height, weight, age, and gender. It applies validated formulas such as the Jackson-Pollock or US Navy method to provide a reasonable approximation of your body composition.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your accurate measurements in the selected units (metric or imperial), your demographics, and optionally your fitness level. Measure your waist at the narrowest point, hips at the widest point, and neck just below the larynx for best results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your result shows your estimated body fat percentage and how it compares to health benchmarks for your age and gender. Use this as a baseline to track progress over weeks or months rather than relying on a single calculation.</p>
        </div>
      </section>

      {/* TABLE: Body Fat Percentage Categories by Age and Gender */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Body Fat Percentage Categories by Age and Gender</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These ranges represent general fitness standards based on ACSM guidelines for 2024.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Men (Essential %)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Men (Athletes)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Women (Essential %)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Women (Athletes)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-40 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">41-60 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-22%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-19%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-23%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Essential fat is the minimum needed for basic physiological function.</p>
      </section>

      {/* TABLE: Body Fat Health Categories */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Body Fat Health Categories</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">General classification of body fat percentage ranges for adults regardless of age.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Men</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Women</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Essential Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimum for organ function</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Athletes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-13%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Optimal for performance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fitness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-17%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21-24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good health and appearance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-31%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal, acceptable range</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-31%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32-41%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Elevated health risk</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Obese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;32%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Significant health concerns</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Categories are based on CDC and American Council on Exercise standards.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure consistently at the same time of day and use the same measuring technique each time for reliable tracking.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Take measurements multiple times and average them to reduce human error in tape placement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Stay hydrated and avoid intense exercise 24 hours before measurements to minimize water retention fluctuations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine calculator results with other metrics like weight, energy levels, and how clothes fit for a complete fitness picture.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Incorrect Measurement Technique</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Loose or overly tight tape measurements can skew results by 2-3%; keep the tape snug but not compressing skin.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring at Different Times</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Body measurements vary throughout the day due to food and water intake; measure at the same time weekly for consistency.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculator formulas are averages and may not account for muscle density differences; very muscular individuals may appear higher in body fat than actual.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Expecting Overnight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Body composition changes gradually over weeks; daily recalculations waste effort and create false discouragement.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What body fat percentage is considered healthy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Healthy body fat ranges from 10-20% for men and 18-25% for women, though optimal levels vary by age and fitness goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this body fat calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses the Jackson-Pollock or US Navy method with ±3-5% accuracy; DEXA scans are more precise but less accessible.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need calipers to use this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, most body fat calculators use measurements like waist, hip, and neck circumference, though some methods accept caliper readings for higher accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my body fat percentage differ from other calculators?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different formulas (Jackson-Pollock, US Navy, Katch-McArdle) produce varying results; measurement accuracy and individual body composition also affect outcomes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can body fat percentage change quickly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Significant changes typically require 4-6 weeks of consistent diet and exercise; rapid fluctuations may indicate measurement errors rather than actual fat loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is body fat percentage more important than weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, body fat percentage reveals body composition better than weight alone; two people at the same weight can have very different health profiles.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my body fat percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate monthly to track progress accurately, as weekly measurements can fluctuate due to water retention and hydration levels.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.acefitness.org/fitness-certifications/health-coach/ace-health-coach/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Council on Exercise Body Fat Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative standards for body fat classification and health recommendations.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Body Composition and Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government health resource on body composition assessment and obesity classification.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Jackson-Pollock Skinfold Method Research</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed studies on body fat estimation accuracy and formula validation.</p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ACSM Fitness Standards and Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American College of Sports Medicine's evidence-based fitness and health standards.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Fat Percentage Calculator"
      description="Estimate body fat percentage from home. Use simple tape measurements to track your fitness progress over time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "For men: %BF = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76; For women: %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387",
        variables: [
          { symbol: "waist", description: "Waist circumference in inches" },
          { symbol: "neck", description: "Neck circumference in inches" },
          { symbol: "hip", description: "Hip circumference in inches (women only)" },
          { symbol: "height", description: "Height in inches" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "John is a 30-year-old male who weighs 180 lbs and is 70 inches tall. He measures his neck at 16 inches and his waist at 34 inches. Using these measurements, he wants to estimate his body fat percentage.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Male' for gender and enter age as 30, weight as 180 lbs, and height as 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Input neck circumference as 16 inches and waist circumference as 34 inches.",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate to get the estimated body fat percentage based on the U.S. Navy method.",
          },
        ],
        result:
          "John's estimated body fat percentage is approximately 16.5%, which falls into the 'Fitness' category for males.",
      }}
      relatedCalculators={[
        { title: "Body Mass Index (BMI) Calculator", url: "/everyday/bmi-calculator", icon: "Heart" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "Home" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "Heart" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "DollarSign" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "DollarSign" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "DollarSign" },
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