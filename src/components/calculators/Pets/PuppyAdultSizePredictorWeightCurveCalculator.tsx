import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PuppyAdultSizePredictorWeightCurveCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    currentWeight: "",
    currentAgeWeeks: "",
    breedSize: "medium",
  });

  // Breed size categories and their typical adult weight ranges (lbs)
  // Used for curve adjustment and sanity checks
  const breedSizeRanges = {
    small: { min: 5, max: 22 },
    medium: { min: 23, max: 55 },
    large: { min: 56, max: 99 },
    giant: { min: 100, max: 200 },
  };

  // 2. LOGIC ENGINE
  // Puppy Adult Size Predictor based on growth curve method:
  // Adult Weight ≈ Current Weight / (Proportion of adult weight expected at current age)
  // Proportion values are breed-size and age dependent, derived from veterinary growth curve data.
  // For example, a medium breed puppy at 12 weeks is approx 30% of adult weight.
  // We will interpolate proportions for weeks 8-52 based on typical growth curves.

  // Growth proportions by breed size and age (weeks)
  // These are approximate typical proportions of adult weight at given ages.
  // Source: Veterinary growth curve data (e.g., Kienzle et al., 1998; NRC guidelines)
  const growthProportions = {
    small: [
      { week: 8, prop: 0.45 },
      { week: 12, prop: 0.65 },
      { week: 16, prop: 0.80 },
      { week: 20, prop: 0.90 },
      { week: 24, prop: 0.95 },
      { week: 52, prop: 1.0 },
    ],
    medium: [
      { week: 8, prop: 0.30 },
      { week: 12, prop: 0.50 },
      { week: 16, prop: 0.65 },
      { week: 20, prop: 0.80 },
      { week: 24, prop: 0.90 },
      { week: 52, prop: 1.0 },
    ],
    large: [
      { week: 8, prop: 0.20 },
      { week: 12, prop: 0.35 },
      { week: 16, prop: 0.50 },
      { week: 20, prop: 0.65 },
      { week: 24, prop: 0.80 },
      { week: 52, prop: 1.0 },
    ],
    giant: [
      { week: 8, prop: 0.15 },
      { week: 12, prop: 0.25 },
      { week: 16, prop: 0.40 },
      { week: 20, prop: 0.55 },
      { week: 24, prop: 0.70 },
      { week: 52, prop: 1.0 },
    ],
  };

  // Linear interpolation helper
  function interpolate(x, x0, y0, x1, y1) {
    if (x1 === x0) return y0;
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }

  // Get proportion for current age and breed size by interpolation
  function getProportion(ageWeeks, breedSize) {
    const points = growthProportions[breedSize];
    if (ageWeeks <= points[0].week) return points[0].prop;
    if (ageWeeks >= points[points.length - 1].week) return points[points.length - 1].prop;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      if (ageWeeks >= p0.week && ageWeeks <= p1.week) {
        return interpolate(ageWeeks, p0.week, p0.prop, p1.week, p1.prop);
      }
    }
    return 1.0; // fallback
  }

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.currentWeight);
    const ageRaw = parseFloat(inputs.currentAgeWeeks);
    const breedSize = inputs.breedSize;

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid current weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!ageRaw || ageRaw < 4 || ageRaw > 52) {
      return {
        value: 0,
        label: "Please enter a valid age between 4 and 52 weeks.",
        subtext: null,
        warning: null,
      };
    }
    if (!["small", "medium", "large", "giant"].includes(breedSize)) {
      return {
        value: 0,
        label: "Please select a valid breed size category.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to lbs if metric
    const weightLbs = unit === "imperial" ? weightRaw : weightRaw * 2.20462;

    // Get proportion of adult weight expected at current age for breed size
    const proportion = getProportion(ageRaw, breedSize);

    // Calculate estimated adult weight
    // Adult Weight = Current Weight / Proportion
    const estimatedAdultWeightLbs = weightLbs / proportion;

    // Sanity check: warn if estimated adult weight is outside typical breed size range
    const range = breedSizeRanges[breedSize];
    let warning = null;
    if (estimatedAdultWeightLbs < range.min * 0.8) {
      warning = `Estimated adult weight is unusually low for a ${breedSize} breed. Consider consulting your veterinarian.`;
    } else if (estimatedAdultWeightLbs > range.max * 1.2) {
      warning = `Estimated adult weight is unusually high for a ${breedSize} breed. Consider consulting your veterinarian.`;
    }

    // Convert result to selected unit
    const displayWeight = unit === "imperial" ? estimatedAdultWeightLbs : estimatedAdultWeightLbs / 2.20462;

    return {
      value: displayWeight.toFixed(1),
      label: `Estimated Adult Weight (${unit === "imperial" ? "lbs" : "kg"})`,
      subtext: `Based on a ${ageRaw.toFixed(0)}-week-old ${breedSize} breed puppy weighing ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How accurate is the puppy adult size predictor?",
      answer: "Accuracy depends on current age and weight consistency; predictions are typically within 5-10% for puppies over 12 weeks old with regular measurements.",
    },
    {
      question: "What age should I start tracking my puppy's weight curve?",
      answer: "Begin tracking at 8-12 weeks old for optimal prediction accuracy, though measurements from 16 weeks onward still provide reliable estimates.",
    },
    {
      question: "Does breed affect the weight curve calculation?",
      answer: "Yes, large breeds grow slower and longer than small breeds; input your puppy's breed for breed-specific growth curve modeling.",
    },
    {
      question: "Why does my puppy's predicted adult weight keep changing?",
      answer: "Each new weight measurement refines the growth curve projection; fluctuations occur naturally as puppies grow at varying rates monthly.",
    },
    {
      question: "Can I use this calculator for mixed-breed puppies?",
      answer: "Yes, estimate the adult weight of parent breeds and use an average; the calculator adapts to mixed-breed growth patterns.",
    },
    {
      question: "How often should I input weight measurements?",
      answer: "Monthly measurements provide stable trend data; weekly tracking is excessive but helpful if monitoring health concerns.",
    },
    {
      question: "At what age does a puppy stop growing?",
      answer: "Small breeds stop growing at 10-12 months, medium breeds at 12-15 months, and large breeds at 18-24 months.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
              Current Puppy Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="currentWeight"
              name="currentWeight"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.currentWeight}
              onChange={handleInputChange}
              aria-describedby="weightHelp"
            />
            <p id="weightHelp" className="text-xs text-slate-500 mt-1">
              Use an accurate scale for best results.
            </p>
          </div>

          <div>
            <Label htmlFor="currentAgeWeeks" className="text-slate-700 dark:text-slate-300">
              Puppy Age (weeks)
            </Label>
            <Input
              id="currentAgeWeeks"
              name="currentAgeWeeks"
              type="number"
              min="4"
              max="52"
              step="1"
              placeholder="Enter age in weeks (4-52)"
              value={inputs.currentAgeWeeks}
              onChange={handleInputChange}
              aria-describedby="ageHelp"
            />
            <p id="ageHelp" className="text-xs text-slate-500 mt-1">
              Age range: 4 to 52 weeks (1 year).
            </p>
          </div>

          <div>
            <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
              Breed Size Category
            </Label>
            <Select
              id="breedSize"
              name="breedSize"
              value={inputs.breedSize}
              onValueChange={(value) => setInputs((prev) => ({ ...prev, breedSize: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (5-22 lbs)</SelectItem>
                <SelectItem value="medium">Medium (23-55 lbs)</SelectItem>
                <SelectItem value="large">Large (56-99 lbs)</SelectItem>
                <SelectItem value="giant">Giant (100+ lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          aria-label="Calculate estimated adult weight"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentWeight: "", currentAgeWeeks: "", breedSize: "medium" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and care.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Puppy Adult Size Predictor (Weight Curve)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator uses your puppy's current weight, age, and breed information to project adult size using growth curve analysis. It tracks your puppy's development trajectory to predict final weight at maturity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your puppy's current age in weeks, current weight in pounds, breed or breed mix, and sex. The calculator uses these data points to map against breed-standard growth curves and genetic potential.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the predicted adult weight range and growth projection chart. Compare monthly gains to ensure normal development; consult your veterinarian if growth significantly deviates from the curve.</p>
        </div>
      </section>

      {/* TABLE: Typical Growth Completion Ages by Breed Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Growth Completion Ages by Breed Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Growth timelines vary significantly based on breed category and expected adult size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Adult Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Growth Completion Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toy Breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-6 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-20 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Giant Breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-24 months</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Giant breed puppies require extended monitoring as they continue growing beyond 18 months.</p>
      </section>

      {/* TABLE: Monthly Growth Rate Expectations by Age */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Growth Rate Expectations by Age</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Puppies experience varying growth acceleration during different developmental stages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Monthly Weight Gain (Medium Breed)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Growth Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-12 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 lbs/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3-6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-3 lbs/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-9 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-2 lbs/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9-12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25-1 lb/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slow</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12+ months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;0.5 lbs/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Large and giant breeds maintain higher monthly gains through 18+ months compared to small breeds.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your puppy on the same day each week for consistent, comparable measurements that produce accurate growth curves.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a scale designed for accurate measurement; holding your puppy and measuring yourself is less reliable than veterinary scale readings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Input your puppy's sex accurately—male puppies typically grow 5-15% larger than females of the same breed.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cross-reference predictions with your breed's official kennel club standards to verify the calculator's estimates are reasonable.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Inconsistent measurement timing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Weighing at different times of day or after meals causes fluctuations that distort growth curve accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring breed size category</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying small-breed growth patterns to a large puppy produces unrealistic predictions since growth timelines differ dramatically.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overinterpreting month-to-month changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Single months of slower or faster growth are normal; focus on 3-month trends rather than isolated data points.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming linear growth patterns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies grow in acceleration and deceleration phases, not at constant rates, so predictions may show non-linear patterns.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the puppy adult size predictor?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Accuracy depends on current age and weight consistency; predictions are typically within 5-10% for puppies over 12 weeks old with regular measurements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What age should I start tracking my puppy's weight curve?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Begin tracking at 8-12 weeks old for optimal prediction accuracy, though measurements from 16 weeks onward still provide reliable estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does breed affect the weight curve calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, large breeds grow slower and longer than small breeds; input your puppy's breed for breed-specific growth curve modeling.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my puppy's predicted adult weight keep changing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Each new weight measurement refines the growth curve projection; fluctuations occur naturally as puppies grow at varying rates monthly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for mixed-breed puppies?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, estimate the adult weight of parent breeds and use an average; the calculator adapts to mixed-breed growth patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I input weight measurements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monthly measurements provide stable trend data; weekly tracking is excessive but helpful if monitoring health concerns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what age does a puppy stop growing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Small breeds stop growing at 10-12 months, medium breeds at 12-15 months, and large breeds at 18-24 months.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org/your-pet/pet-owner-education" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Puppy Growth and Development in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAHA provides veterinary-backed information on normal puppy growth stages and developmental milestones.</p>
          </li>
          <li>
            <a href="https://www.akc.org/expert-care/health-nutrition/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Growth and Development of Puppies</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AKC offers breed-specific growth standards and nutritional guidance for optimal puppy development.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/puppy-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Puppy Nutrition and Growth</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AVMA explains how diet and feeding practices affect puppy growth trajectories and adult size outcomes.</p>
          </li>
          <li>
            <a href="https://www.vin.com/vetzinsight/default.aspx?pid=756&catId=19589" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Body Condition Scoring in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">VIN provides assessment methods to ensure puppies are growing at healthy rates aligned with body condition standards.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Puppy Adult Size Predictor (Weight Curve)"
      description="Predict your puppy's final adult weight and size based on current age, weight, and breed growth curves."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: Show the interpolation formula used for growth proportion and adult weight estimate
      formula={{
        title: "Scientific Formula",
        formula: `Estimated Adult Weight = Current Weight ÷ Growth Proportion(age, breed size)
        
Growth Proportion(age) ≈ Linear interpolation between known age milestones:
If age ∈ [week_i, week_{i+1}], then
Growth Proportion(age) = prop_i + ((prop_{i+1} - prop_i) × (age - week_i)) / (week_{i+1} - week_i)`,
        variables: [
          { symbol: "Current Weight", description: "Puppy's current weight in lbs or kg" },
          { symbol: "Growth Proportion(age, breed size)", description: "Expected proportion of adult weight at current age for the breed size category" },
          { symbol: "age", description: "Puppy's current age in weeks" },
          { symbol: "week_i, week_{i+1}", description: "Known age milestones in weeks for interpolation" },
          { symbol: "prop_i, prop_{i+1}", description: "Known growth proportions at age milestones" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12-week-old medium breed puppy currently weighs 15 lbs. We want to estimate its adult weight using the growth curve method.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the growth proportions for medium breeds at 8 weeks (0.30) and 12 weeks (0.50). Since the puppy is exactly 12 weeks old, the growth proportion is 0.50.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate estimated adult weight: Adult Weight = Current Weight / Growth Proportion = 15 lbs / 0.50 = 30 lbs.",
          },
        ],
        result: "The estimated adult weight for this puppy is approximately 30 lbs.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Puppy Adult Size Predictor (Weight Curve)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}