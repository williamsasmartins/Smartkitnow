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

export default function WaistToHeightRatioCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    waistInches?: number;
    waistCm?: number;
    heightFeet?: number;
    heightInches?: number;
    heightCm?: number;
  }>({});

  // 2. LOGIC
  const results = useMemo(() => {
    let waistCm: number | undefined;
    let heightCm: number | undefined;

    if (unit === "imperial") {
      if (
        inputs.waistInches === undefined ||
        inputs.heightFeet === undefined ||
        inputs.heightInches === undefined
      )
        return { value: 0, label: "", category: "" };

      waistCm = inputs.waistInches * 2.54;
      heightCm = (inputs.heightFeet * 12 + inputs.heightInches) * 2.54;
    } else {
      if (inputs.waistCm === undefined || inputs.heightCm === undefined)
        return { value: 0, label: "", category: "" };

      waistCm = inputs.waistCm;
      heightCm = inputs.heightCm;
    }

    if (waistCm <= 0 || heightCm <= 0) return { value: 0, label: "", category: "" };

    const ratio = waistCm / heightCm;
    const roundedRatio = Math.round(ratio * 1000) / 1000; // 3 decimals

    // Interpretation based on WHtR cutoffs (adults)
    // Common thresholds:
    // <0.40 = underweight (not typical)
    // 0.40–0.49 = healthy/low risk
    // 0.50–0.59 = increased risk
    // ≥0.60 = high risk
    // Source: Ashwell et al., 2012; WHO guidelines

    let label = "";
    let category = "";

    if (roundedRatio < 0.40) {
      label = "Below typical healthy range";
      category = "Underweight / Low Risk";
    } else if (roundedRatio >= 0.40 && roundedRatio < 0.50) {
      label = "Healthy waist-to-height ratio";
      category = "Low Risk";
    } else if (roundedRatio >= 0.50 && roundedRatio < 0.60) {
      label = "Increased health risk";
      category = "Moderate Risk";
    } else if (roundedRatio >= 0.60) {
      label = "High health risk";
      category = "High Risk";
    } else {
      label = "Invalid result";
      category = "";
    }

    return {
      value: roundedRatio.toFixed(3),
      label,
      category,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is a healthy waist-to-height ratio?",
      answer: "A healthy waist-to-height ratio is generally considered to be 0.5 or less, meaning your waist circumference should be half your height or smaller. Research suggests that ratios &lt;0.5 are associated with lower cardiovascular risk and better metabolic health. For example, a person who is 70 inches tall should aim for a waist circumference of 35 inches or less.",
    },
    {
      question: "How do I measure my waist circumference accurately?",
      answer: "Measure your waist at the midpoint between your lowest rib and the top of your hip bone, keeping the tape measure snug but not tight. Stand upright with your feet shoulder-width apart and breathe normally during the measurement. For the most accurate result, measure in the morning before eating and wearing minimal clothing. Take the measurement three times and use the average value for your calculation.",
    },
    {
      question: "Is waist-to-height ratio better than BMI for assessing health?",
      answer: "Waist-to-height ratio is often considered more predictive of cardiovascular and metabolic health than BMI alone, as it accounts for fat distribution and central obesity. Studies have shown that waist-to-height ratio correlates more strongly with visceral fat accumulation, which is particularly associated with heart disease and diabetes risk. However, both measurements are most useful when combined with other health indicators like blood pressure and cholesterol levels.",
    },
    {
      question: "What does a waist-to-height ratio above 0.6 indicate?",
      answer: "A waist-to-height ratio above 0.6 indicates an increased risk of cardiovascular disease, metabolic syndrome, and type 2 diabetes. At this level, central obesity is present, meaning excess fat is concentrated around the abdomen rather than distributed elsewhere. Healthcare providers typically recommend lifestyle modifications, including dietary changes and increased physical activity, to reduce this ratio and lower health risks.",
    },
    {
      question: "Can children and teenagers use this calculator?",
      answer: "While the basic measurement method applies to children and teenagers, interpretation of results differs significantly from adults due to growth and development factors. The standard 0.5 threshold is less reliable for children under age 18, as their body composition changes rapidly. For pediatric populations, it's best to consult with a healthcare provider who can assess growth patterns and individual health risks appropriately.",
    },
    {
      question: "How often should I check my waist-to-height ratio?",
      answer: "Most health experts recommend checking your waist-to-height ratio every 3 to 6 months as part of regular health monitoring, especially if you're working on weight management. More frequent measurements—weekly or monthly—can help track progress during active lifestyle or dietary changes. Less frequent checks annually may be sufficient for individuals already maintaining a healthy ratio and stable weight.",
    },
    {
      question: "Does waist-to-height ratio account for muscle mass?",
      answer: "No, waist-to-height ratio does not distinguish between muscle and fat, so muscular individuals with low body fat may receive a higher-than-expected ratio reading. Athletes and people with significant muscle mass may have a ratio of 0.5 to 0.55 while maintaining excellent cardiovascular health. For this reason, combining waist-to-height ratio with body composition analysis or other health markers provides a more complete health assessment.",
    },
    {
      question: "What is the difference between waist-to-height and waist-to-hip ratio?",
      answer: "Waist-to-height ratio compares waist circumference to overall height, while waist-to-hip ratio compares waist to hip circumference. Waist-to-height ratio is considered more universal because it doesn't depend on hip measurements, which vary less systematically across populations. Studies suggest waist-to-height ratio may be a slightly better predictor of cardiovascular risk in diverse populations, though both are useful indicators.",
    },
    {
      question: "Can lifestyle changes improve my waist-to-height ratio?",
      answer: "Yes, lifestyle changes including regular aerobic exercise, strength training, and a balanced diet can significantly improve your waist-to-height ratio by reducing abdominal fat. Even modest weight loss of 5-10% combined with consistent physical activity can lower your ratio and reduce associated health risks. Results typically become measurable within 8-12 weeks of sustained lifestyle modifications.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    field:
      | "waistInches"
      | "waistCm"
      | "heightFeet"
      | "heightInches"
      | "heightCm",
    value: string
  ) {
    const num = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(num) || num < 0 ? undefined : num,
    }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({});
  }

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

        {/* Inputs */}
        {unit === "imperial" ? (
          <>
            <div>
              <Label htmlFor="waistInches" className="text-slate-700 dark:text-slate-300">
                Waist Circumference (inches)
              </Label>
              <Input
                id="waistInches"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 32.5"
                value={inputs.waistInches ?? ""}
                onChange={(e) => handleInputChange("waistInches", e.target.value)}
                aria-describedby="waistHelp"
              />
              <p
                id="waistHelp"
                className="text-xs text-slate-500 dark:text-slate-400 mt-1"
              >
                Measure around your natural waist, just above the belly button.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                  Height (feet)
                </Label>
                <Input
                  id="heightFeet"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="e.g. 5"
                  value={inputs.heightFeet ?? ""}
                  onChange={(e) => handleInputChange("heightFeet", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                  Height (inches)
                </Label>
                <Input
                  id="heightInches"
                  type="number"
                  min={0}
                  max={11}
                  step={0.1}
                  placeholder="e.g. 10"
                  value={inputs.heightInches ?? ""}
                  onChange={(e) => handleInputChange("heightInches", e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="waistCm" className="text-slate-700 dark:text-slate-300">
                Waist Circumference (cm)
              </Label>
              <Input
                id="waistCm"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 82.5"
                value={inputs.waistCm ?? ""}
                onChange={(e) => handleInputChange("waistCm", e.target.value)}
                aria-describedby="waistHelpMetric"
              />
              <p
                id="waistHelpMetric"
                className="text-xs text-slate-500 dark:text-slate-400 mt-1"
              >
                Measure around your natural waist, just above the belly button.
              </p>
            </div>

            <div>
              <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
                Height (cm)
              </Label>
              <Input
                id="heightCm"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 178"
                value={inputs.heightCm ?? ""}
                onChange={(e) => handleInputChange("heightCm", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Waist-to-Height Ratio"
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Waist-to-Height Ratio Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Waist-to-Height Ratio Checker is a simple yet powerful health assessment tool that measures the relationship between your waist circumference and your overall height. This ratio is increasingly recognized by health professionals as a reliable indicator of cardiovascular risk and metabolic health, as it identifies dangerous abdominal fat accumulation more effectively than weight alone. Understanding your ratio empowers you to take proactive steps toward disease prevention and better long-term wellness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need two measurements: your waist circumference in inches or centimeters, and your height in the same unit system. Waist circumference should be measured at the midpoint between your lowest rib and hip bone while standing upright and breathing normally. Height should be measured without shoes on a flat surface against a wall. Accurate measurements are essential for reliable results, so take your time and repeat measurements if needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you input these values, the calculator instantly computes your ratio and displays your health category ranging from excellent (&lt;0.5) to high risk (&gt;0.6). The results also indicate whether your abdominal fat distribution poses elevated health risks. Use these insights as a conversation starter with your healthcare provider and as motivation to track changes in your ratio over time through lifestyle modifications like exercise and dietary improvements.</p>
        </div>
      </section>

      {/* TABLE: Waist-to-Height Ratio Health Categories */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Waist-to-Height Ratio Health Categories</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the standard health risk categories based on waist-to-height ratio measurements and their associated cardiovascular and metabolic health implications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ratio Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current healthy lifestyle</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.5–0.54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low to Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor regularly, maintain exercise routine</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.55–0.59</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase physical activity and review diet</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consult healthcare provider for intervention plan</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These categories are based on research from the International Journal of Obesity and apply to adults aged 18-65. Individual risk varies by age, family history, and other health factors.</p>
      </section>

      {/* TABLE: Waist-to-Height Ratio Examples by Height */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Waist-to-Height Ratio Examples by Height</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides target waist circumference measurements for different heights to maintain a healthy ratio of 0.5 or below.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height (cm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Waist &lt;(inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Waist &lt;(cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">152</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">62</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">157</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">79</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">162</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">167</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">172</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">86</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">177</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">89</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">182</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">74</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">187</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">94</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">193</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Target measurements assume a ratio of exactly 0.5. Values &lt;0.5 are considered excellent. This data applies to adults of all genders.</p>
      </section>

      {/* TABLE: Health Conditions Associated with Elevated Waist-to-Height Ratio */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Health Conditions Associated with Elevated Waist-to-Height Ratio</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Research indicates that individuals with ratios above 0.55 have significantly increased risk for the following conditions compared to those with ratios below 0.5.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Increase (Ratio &gt;0.55)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Type 2 Diabetes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4x higher</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Visceral fat insulin resistance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cardiovascular Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x higher</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Abdominal obesity inflammation</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High Blood Pressure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5x higher</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Central adiposity sodium sensitivity</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metabolic Syndrome</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5x higher</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple lipid and glucose abnormalities</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sleep Apnea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x higher</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Airway compression from abdominal fat</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Risk multipliers are based on longitudinal studies from the American Heart Association and Journal of Hypertension. Individual risk depends on additional factors including age, family history, and lifestyle.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your waist at the same time each day—preferably in the morning before eating—to ensure consistency and eliminate daily fluctuations from food and water intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine waist-to-height ratio assessment with other health metrics like blood pressure, cholesterol levels, and blood glucose to get a comprehensive picture of your cardiovascular and metabolic health.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Focus on reducing abdominal fat specifically through a combination of aerobic exercise (150+ minutes weekly) and strength training, which targets visceral fat more effectively than diet alone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your ratio monthly rather than daily to see meaningful progress, as significant changes typically require 4-8 weeks of consistent lifestyle modifications.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your ratio as a health motivation tool rather than an obsessive metric—improvements in how you feel, energy levels, and fitness capacity often precede measurable ratio changes.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring waist at the wrong location</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people measure at their smallest point or at the navel rather than the true midpoint between ribs and hip bone, leading to artificially low readings. This measurement error can mask abdominal obesity and delay necessary health interventions. Always locate the measurement point anatomically rather than by visual estimation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring measurement variation between sessions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to standardize measurement conditions—such as time of day, clothing, or breathing state—can cause ratio variations of 0.02-0.05 points that mask true progress. Inconsistent measurements may lead you to misinterpret whether your lifestyle changes are working. Establish a routine and measure under identical conditions each time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on ratio without medical consultation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While waist-to-height ratio is a useful screening tool, it should never replace professional medical evaluation, especially if your ratio exceeds 0.6. A healthcare provider can assess additional risk factors including family history, blood pressure, and lipid profiles that the ratio alone cannot capture. Always discuss significant ratio changes or concerning values with your doctor.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming a single measurement defines your health</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">One waist-to-height ratio measurement provides a snapshot but doesn't account for your overall lifestyle, fitness level, or metabolic health markers. Muscular athletes may have ratios that appear elevated despite excellent cardiovascular fitness, while sedentary individuals with low ratios may still have poor metabolic health. Use ratio as one component of a comprehensive health assessment strategy.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy waist-to-height ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A healthy waist-to-height ratio is generally considered to be 0.5 or less, meaning your waist circumference should be half your height or smaller. Research suggests that ratios &lt;0.5 are associated with lower cardiovascular risk and better metabolic health. For example, a person who is 70 inches tall should aim for a waist circumference of 35 inches or less.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my waist circumference accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure your waist at the midpoint between your lowest rib and the top of your hip bone, keeping the tape measure snug but not tight. Stand upright with your feet shoulder-width apart and breathe normally during the measurement. For the most accurate result, measure in the morning before eating and wearing minimal clothing. Take the measurement three times and use the average value for your calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is waist-to-height ratio better than BMI for assessing health?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Waist-to-height ratio is often considered more predictive of cardiovascular and metabolic health than BMI alone, as it accounts for fat distribution and central obesity. Studies have shown that waist-to-height ratio correlates more strongly with visceral fat accumulation, which is particularly associated with heart disease and diabetes risk. However, both measurements are most useful when combined with other health indicators like blood pressure and cholesterol levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does a waist-to-height ratio above 0.6 indicate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A waist-to-height ratio above 0.6 indicates an increased risk of cardiovascular disease, metabolic syndrome, and type 2 diabetes. At this level, central obesity is present, meaning excess fat is concentrated around the abdomen rather than distributed elsewhere. Healthcare providers typically recommend lifestyle modifications, including dietary changes and increased physical activity, to reduce this ratio and lower health risks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can children and teenagers use this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While the basic measurement method applies to children and teenagers, interpretation of results differs significantly from adults due to growth and development factors. The standard 0.5 threshold is less reliable for children under age 18, as their body composition changes rapidly. For pediatric populations, it's best to consult with a healthcare provider who can assess growth patterns and individual health risks appropriately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check my waist-to-height ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most health experts recommend checking your waist-to-height ratio every 3 to 6 months as part of regular health monitoring, especially if you're working on weight management. More frequent measurements—weekly or monthly—can help track progress during active lifestyle or dietary changes. Less frequent checks annually may be sufficient for individuals already maintaining a healthy ratio and stable weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does waist-to-height ratio account for muscle mass?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, waist-to-height ratio does not distinguish between muscle and fat, so muscular individuals with low body fat may receive a higher-than-expected ratio reading. Athletes and people with significant muscle mass may have a ratio of 0.5 to 0.55 while maintaining excellent cardiovascular health. For this reason, combining waist-to-height ratio with body composition analysis or other health markers provides a more complete health assessment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between waist-to-height and waist-to-hip ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Waist-to-height ratio compares waist circumference to overall height, while waist-to-hip ratio compares waist to hip circumference. Waist-to-height ratio is considered more universal because it doesn't depend on hip measurements, which vary less systematically across populations. Studies suggest waist-to-height ratio may be a slightly better predictor of cardiovascular risk in diverse populations, though both are useful indicators.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can lifestyle changes improve my waist-to-height ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, lifestyle changes including regular aerobic exercise, strength training, and a balanced diet can significantly improve your waist-to-height ratio by reducing abdominal fat. Even modest weight loss of 5-10% combined with consistent physical activity can lower your ratio and reduce associated health risks. Results typically become measurable within 8-12 weeks of sustained lifestyle modifications.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nhlbi.nih.gov/health/educational/lose_wt/risk_eval/bmirank.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH National Heart, Lung, and Blood Institute - Body Measurements and Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidance on waist circumference measurements and their relationship to cardiovascular disease risk assessment.</p>
          </li>
          <li>
            <a href="https://www.heart.org/en/healthy-living/healthy-lifestyle/weight-management" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association - Understanding Abdominal Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on central obesity, waist-to-height ratio, and cardiovascular health implications from the leading heart health authority.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/nchs/data/nhes/nhes2021-508.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC - Anthropometric Reference Data for Children and Adults</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CDC data on waist circumference measurements, population prevalence, and health outcome associations across demographic groups.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/belly-fat/art-20045685" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic - Belly Fat and Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical perspective on the health risks associated with abdominal fat distribution and measurement techniques for accurate assessment.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Waist-to-Height Ratio Checker"
      description="Calculate your Waist-to-Height Ratio (WHtR). Use this simple yet effective metric to assess central obesity and cardiovascular health risks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: "WHtR = Waist Circumference ÷ Height",
        variables: [
          {
            symbol: "Waist Circumference",
            description:
              "The measurement around your natural waist, typically just above the belly button, in the same units as height.",
          },
          {
            symbol: "Height",
            description:
              "Your total height measured in the same units as waist circumference.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John is 5 feet 10 inches tall and has a waist circumference of 34 inches. He wants to know his Waist-to-Height Ratio to assess his health risk.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert John's height to inches: (5 × 12) + 10 = 70 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate WHtR: Waist (34 inches) ÷ Height (70 inches) = 0.486.",
          },
        ],
        result:
          "John's WHtR is 0.486, which falls within the healthy range (<0.50), indicating a low risk of central obesity-related health issues.",
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
          title: "Body Surface Area (BSA) Calculator",
          url: "/health/body-surface-area-bsa",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Waist-to-Height Ratio Checker?" },
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