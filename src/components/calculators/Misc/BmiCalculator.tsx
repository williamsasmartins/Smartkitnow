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

export default function BmiCalculator() {
  const [inputs, setInputs] = useState({
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // BMI calculation logic
  // BMI = weight (kg) / (height (m))^2
  // Support units: height in cm or inches, weight in kg or lbs
  const results = useMemo(() => {
    const heightRaw = parseFloat(inputs.height);
    const weightRaw = parseFloat(inputs.weight);
    if (
      isNaN(heightRaw) ||
      isNaN(weightRaw) ||
      heightRaw <= 0 ||
      weightRaw <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for height and weight.",
        formulaUsed:
          "BMI = weight (kg) / [height (m)]², with unit conversions applied as needed.",
      };
    }

    // Convert height to meters
    let heightMeters = 0;
    if (inputs.heightUnit === "cm") {
      heightMeters = heightRaw / 100;
    } else if (inputs.heightUnit === "in") {
      heightMeters = heightRaw * 0.0254;
    }

    // Convert weight to kilograms
    let weightKg = 0;
    if (inputs.weightUnit === "kg") {
      weightKg = weightRaw;
    } else if (inputs.weightUnit === "lb") {
      weightKg = weightRaw * 0.45359237;
    }

    if (heightMeters === 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Height cannot be zero.",
        formulaUsed:
          "BMI = weight (kg) / [height (m)]², with unit conversions applied as needed.",
      };
    }

    const bmi = weightKg / (heightMeters * heightMeters);
    const bmiRounded = Math.round(bmi * 10) / 10;

    // BMI categories based on CDC guidelines
    let category = "";
    let note = "";
    let warning = null;

    if (bmi < 18.5) {
      category = "Underweight";
      note =
        "Your BMI indicates you are underweight. Consider consulting a healthcare provider for advice.";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      note = "Your BMI is within the healthy range. Maintain your current lifestyle.";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      note =
        "Your BMI indicates overweight. Consider lifestyle changes and consult a healthcare provider.";
    } else if (bmi >= 30) {
      category = "Obesity";
      note =
        "Your BMI falls within the obesity range. It is advisable to seek medical advice.";
      warning = (
        <AlertTriangle className="inline-block w-5 h-5 text-red-600 mr-1" />
      );
    }

    return {
      value: bmiRounded.toFixed(1),
      label: category,
      subtext: note,
      warning,
      formulaUsed:
        "BMI = weight (kg) / [height (m)]², with unit conversions applied as needed.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is BMI and why is it important?",
      answer: "BMI (Body Mass Index) is a measure of body fat based on height and weight, calculated as weight (kg) divided by height (m²). It helps identify potential health risks associated with weight categories.",
    },
    {
      question: "How is BMI calculated?",
      answer: "BMI is calculated using the formula: weight (pounds) × 703 ÷ height (inches)². Alternatively, divide weight in kilograms by height in meters squared.",
    },
    {
      question: "What are the standard BMI categories?",
      answer: "BMI categories are: Underweight (&lt;18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (≥30). These ranges help assess health risk levels.",
    },
    {
      question: "Does BMI apply to athletes and muscular individuals?",
      answer: "BMI may overestimate body fat in athletes because muscle weighs more than fat, so results should be interpreted with context for very muscular people.",
    },
    {
      question: "At what age does BMI calculation change?",
      answer: "BMI calculation remains the same for adults aged 20+, but children and teens require age and sex-adjusted percentile charts rather than standard categories.",
    },
    {
      question: "Can BMI predict individual health outcomes?",
      answer: "BMI is a screening tool, not a diagnostic measure; overall health depends on fitness, diet, genetics, and other factors beyond weight and height.",
    },
    {
      question: "What should I do if my BMI is in the obese category?",
      answer: "Consult a healthcare provider for personalized advice on nutrition, exercise, and medical interventions tailored to your individual health profile.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Height
          </Label>
          <div className="flex gap-2">
            <Input
              id="height"
              type="number"
              min="0"
              step="any"
              placeholder="Enter height"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              aria-describedby="height-unit"
            />
            <Select
              value={inputs.heightUnit}
              onValueChange={(v) => handleInputChange("heightUnit", v)}
              aria-label="Select height unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="in">inches</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="weight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Weight
          </Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder="Enter weight"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weight-unit"
            />
            <Select
              value={inputs.weightUnit}
              onValueChange={(v) => handleInputChange("weightUnit", v)}
              aria-label="Select weight unit"
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate BMI"
        >
          <Scale className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ height: "", heightUnit: "cm", weight: "", weightUnit: "kg" })
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white flex justify-center items-center gap-2">
              {results.warning}
              {results.value}
            </p>
            <p className="text-xl font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
              {results.subtext}
            </p>
          </CardContent>
        </Card>
      )}

      {results.warning && !results.value && (
        <p className="text-red-600 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Body Mass Index (BMI) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The BMI Calculator quickly determines your Body Mass Index by measuring the relationship between your weight and height. This simple screening tool helps identify whether you fall into underweight, normal, overweight, or obese categories based on standardized health guidelines.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your weight (in pounds or kilograms) and your height (in feet/inches or centimeters). The calculator automatically converts measurements and performs the mathematical computation in seconds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your result will display your BMI number along with your weight status category and general health risk level. Remember that BMI is a screening tool only—consult healthcare professionals for personalized medical advice and comprehensive health assessments.</p>
        </div>
      </section>

      {/* TABLE: BMI Categories and Health Risk Levels */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">BMI Categories and Health Risk Levels</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows BMI ranges, classifications, and associated health risk levels according to CDC standards.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">BMI Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Less than 18.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased risk of nutritional deficiencies</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18.5 – 24.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowest health risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25.0 – 29.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased risk of chronic diseases</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30.0 – 34.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese (Class 1)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High risk of health complications</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35.0 – 39.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obese (Class 2)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very high risk of health complications</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40.0 and above</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe Obesity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extremely high risk requiring medical intervention</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">BMI categories are based on CDC and WHO guidelines for adults aged 20 and older.</p>
      </section>

      {/* TABLE: Sample BMI Calculations for Common Heights */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample BMI Calculations for Common Heights</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference table to see how different weights affect BMI at various heights.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight at Normal BMI (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight at Overweight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight at Obese (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60 (5'0")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95–127</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">128–153</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">154+</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65 (5'5")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114–153</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">154–184</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">185+</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70 (5'10")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">132–178</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">179–214</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215+</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 (6'3")</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">153–206</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">207–248</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">249+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weights represent approximate ranges for normal, overweight, and obese BMI categories at each height.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your weight and height accurately in the morning before eating to ensure the most reliable BMI calculation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your BMI periodically over months to identify trends rather than focusing on single measurements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine BMI results with other health metrics like waist circumference, blood pressure, and cholesterol for a complete health picture.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use BMI as a starting point for conversations with your doctor about weight management and disease prevention strategies.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using BMI as a Diagnosis Tool</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">BMI is a screening indicator, not a diagnostic tool; elevated BMI requires professional medical evaluation before concluding health problems.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Muscle Mass</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Very muscular or athletic individuals may have high BMI despite low body fat because muscle is denser than fat.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Age and Sex</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Standard BMI categories apply to adults aged 20+; children, teens, and older adults may need different interpretation frameworks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Other Health Factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">BMI doesn't account for genetics, fitness level, metabolic health, or individual circumstances that significantly affect overall wellness.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is BMI and why is it important?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI (Body Mass Index) is a measure of body fat based on height and weight, calculated as weight (kg) divided by height (m²). It helps identify potential health risks associated with weight categories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is BMI calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI is calculated using the formula: weight (pounds) × 703 ÷ height (inches)². Alternatively, divide weight in kilograms by height in meters squared.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the standard BMI categories?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI categories are: Underweight (&lt;18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (≥30). These ranges help assess health risk levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does BMI apply to athletes and muscular individuals?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI may overestimate body fat in athletes because muscle weighs more than fat, so results should be interpreted with context for very muscular people.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what age does BMI calculation change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI calculation remains the same for adults aged 20+, but children and teens require age and sex-adjusted percentile charts rather than standard categories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can BMI predict individual health outcomes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BMI is a screening tool, not a diagnostic measure; overall health depends on fitness, diet, genetics, and other factors beyond weight and height.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my BMI is in the obese category?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Consult a healthcare provider for personalized advice on nutrition, exercise, and medical interventions tailored to your individual health profile.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.cdc.gov/healthyweight/assessing/bmi/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Body Mass Index (BMI)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CDC resource providing BMI information, categories, and guidance for adults and children.</p>
          </li>
          <li>
            <a href="https://www.who.int/data/gho/indicator_metadata?indicators=BMI" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">WHO Global Database on Body Mass Index</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">World Health Organization's comprehensive BMI data, definitions, and international health standards.</p>
          </li>
          <li>
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH Weight Management Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Heart, Lung, and Blood Institute offers evidence-based weight management and BMI interpretation resources.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/bmi-calculator/faq-20058529" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic BMI and Health Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mayo Clinic explains BMI limitations, health implications, and when to seek professional medical advice.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Body Mass Index (BMI) Calculator"
      description="Calculate Body Mass Index (BMI) quickly. A simple everyday tool to check if your weight falls within a healthy range."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "BMI = weight (kg) / [height (m)]²",
        variables: [
          { symbol: "weight", description: "Your weight in kilograms (kg)" },
          { symbol: "height", description: "Your height in meters (m)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose a person weighs 70 kilograms and is 175 centimeters tall. They want to know their BMI to assess their weight status.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert height from centimeters to meters: 175 cm = 1.75 m.",
          },
          {
            label: "Step 2",
            explanation:
              "Apply the BMI formula: BMI = 70 / (1.75 × 1.75) = 22.86.",
          },
          {
            label: "Step 3",
            explanation:
              "Interpret the result: A BMI of 22.9 falls within the normal weight range (18.5 - 24.9).",
          },
        ],
        result:
          "The person’s BMI is approximately 22.9, indicating a healthy weight status.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Event Capacity Calculator", url: "/everyday/event-capacity-calculator", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
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