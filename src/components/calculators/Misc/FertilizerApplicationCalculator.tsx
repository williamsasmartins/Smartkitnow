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

export default function FertilizerApplicationCalculator() {
  // Inputs:
  // area: number (in square feet or square meters)
  // areaUnit: "sqft" | "sqm"
  // fertilizerN: percentage of Nitrogen in fertilizer (e.g., 10 for 10%)
  // fertilizerP: percentage of Phosphorus (P2O5) in fertilizer
  // fertilizerK: percentage of Potassium (K2O) in fertilizer
  // desiredN: desired application rate of Nitrogen in lbs/acre or kg/ha
  // desiredP: desired application rate of Phosphorus in lbs/acre or kg/ha
  // desiredK: desired application rate of Potassium in lbs/acre or kg/ha
  // unitSystem: "imperial" or "metric"

  const [inputs, setInputs] = useState({
    area: "",
    areaUnit: "sqft",
    fertilizerN: "",
    fertilizerP: "",
    fertilizerK: "",
    desiredN: "",
    desiredP: "",
    desiredK: "",
    unitSystem: "imperial",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion constants
  const SQFT_PER_ACRE = 43560;
  const SQM_PER_HA = 10000;
  const LBS_TO_KG = 0.453592;

  // Calculation logic:
  // Step 1: Convert area to acres or hectares depending on unit system
  // Step 2: Calculate total fertilizer needed for each nutrient:
  // fertilizer needed (lbs or kg) = (desired nutrient application rate * area) / (fertilizer nutrient % / 100)
  // Step 3: Sum fertilizer amounts for N, P, K to get total fertilizer needed

  const results = useMemo(() => {
    const {
      area,
      areaUnit,
      fertilizerN,
      fertilizerP,
      fertilizerK,
      desiredN,
      desiredP,
      desiredK,
      unitSystem,
    } = inputs;

    // Validate inputs
    if (
      !area ||
      !fertilizerN ||
      !fertilizerP ||
      !fertilizerK ||
      !desiredN ||
      !desiredP ||
      !desiredK
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please fill in all input fields to calculate.",
        formulaUsed: "",
      };
    }

    const areaNum = parseFloat(area);
    const fertN = parseFloat(fertilizerN);
    const fertP = parseFloat(fertilizerP);
    const fertK = parseFloat(fertilizerK);
    const desN = parseFloat(desiredN);
    const desP = parseFloat(desiredP);
    const desK = parseFloat(desiredK);

    if (
      isNaN(areaNum) ||
      isNaN(fertN) ||
      isNaN(fertP) ||
      isNaN(fertK) ||
      isNaN(desN) ||
      isNaN(desP) ||
      isNaN(desK)
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Invalid numeric input detected. Please check your entries.",
        formulaUsed: "",
      };
    }

    // Convert area to acres or hectares
    let areaInUnits = 0;
    if (unitSystem === "imperial") {
      // Convert area to acres
      if (areaUnit === "sqft") {
        areaInUnits = areaNum / SQFT_PER_ACRE;
      } else if (areaUnit === "sqm") {
        // Convert sqm to sqft then to acres
        areaInUnits = (areaNum * 10.7639) / SQFT_PER_ACRE;
      }
    } else {
      // metric system: convert area to hectares
      if (areaUnit === "sqm") {
        areaInUnits = areaNum / SQM_PER_HA;
      } else if (areaUnit === "sqft") {
        // Convert sqft to sqm then to hectares
        areaInUnits = (areaNum * 0.092903) / SQM_PER_HA;
      }
    }

    if (areaInUnits <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Area must be greater than zero.",
        formulaUsed: "",
      };
    }

    // Calculate fertilizer needed for each nutrient
    // fertilizer needed = (desired nutrient rate * area) / (fertilizer nutrient % / 100)
    // Units: lbs or kg depending on unit system

    // Protect against zero fertilizer nutrient %
    if (fertN <= 0 || fertP <= 0 || fertK <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Fertilizer nutrient percentages must be greater than zero.",
        formulaUsed: "",
      };
    }

    const fertNeededN = (desN * areaInUnits) / (fertN / 100);
    const fertNeededP = (desP * areaInUnits) / (fertP / 100);
    const fertNeededK = (desK * areaInUnits) / (fertK / 100);

    // Total fertilizer needed is the max of the three (to meet all nutrient needs)
    // Because fertilizer is applied as a single product, the limiting nutrient determines total amount
    const totalFertilizerNeeded = Math.max(fertNeededN, fertNeededP, fertNeededK);

    // Format results with units
    const unitLabel = unitSystem === "imperial" ? "lbs" : "kg";

    // Detailed subtext explaining the calculation
    const subtext = `To apply ${desN.toFixed(2)} ${unitLabel} of Nitrogen, ${desP.toFixed(2)} ${unitLabel} of Phosphorus (P₂O₅), and ${desK.toFixed(2)} ${unitLabel} of Potassium (K₂O) per ${unitSystem === "imperial" ? "acre" : "hectare"}, you need approximately ${totalFertilizerNeeded.toFixed(2)} ${unitLabel} of fertilizer over your specified area. This calculation assumes uniform distribution and fertilizer nutrient percentages as entered.`;

    const formulaUsed = `Total Fertilizer Needed = max(
      (Desired N × Area) / (Fertilizer N% / 100),
      (Desired P × Area) / (Fertilizer P% / 100),
      (Desired K × Area) / (Fertilizer K% / 100)
    )`;

    return {
      value: `${totalFertilizerNeeded.toFixed(2)} ${unitLabel}`,
      label: "Total Fertilizer Required",
      subtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate the correct fertilizer rate for my lawn?",
      answer: "Enter your lawn size in square feet, soil test results (nitrogen, phosphorus, potassium levels), and grass type. The calculator divides total nutrient needs by fertilizer concentration to determine pounds needed per 1,000 sq ft.",
    },
    {
      question: "What nutrient ratios should I use for different crops?",
      answer: "Common ratios: corn needs 150-180 lbs N/acre, soybeans need 0-20 lbs N/acre, and wheat needs 100-150 lbs N/acre depending on soil conditions and yield goals.",
    },
    {
      question: "Can I apply more fertilizer than the calculator recommends?",
      answer: "Over-application wastes money and risks nutrient runoff, leaching, and environmental damage; apply only what soil tests and the calculator indicate is needed for optimal yields.",
    },
    {
      question: "How does soil pH affect fertilizer application rates?",
      answer: "Soil pH influences nutrient availability; acidic soils (&lt;6.0) may need lime added, while alkaline soils (&gt;7.5) may lock up certain micronutrients, affecting recommended application rates.",
    },
    {
      question: "What is the difference between broadcast and spot application calculations?",
      answer: "Broadcast spreads fertilizer uniformly across the entire area, while spot application concentrates nutrients in specific zones; the calculator adjusts rates based on your application method.",
    },
    {
      question: "How often should I recalculate fertilizer needs?",
      answer: "Update soil tests every 2-3 years to account for nutrient depletion and changes in soil composition, then recalculate application rates using the calculator.",
    },
    {
      question: "Does the calculator account for organic matter in soil?",
      answer: "Yes; soils with 5%+ organic matter release 20-40 lbs N/acre annually, so the calculator reduces synthetic nitrogen recommendations based on this input.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Area to Fertilize</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="area"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 5000"
                  value={inputs.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                />
                <Select
                  value={inputs.areaUnit}
                  onValueChange={(v) => handleInputChange("areaUnit", v)}
                >
                  <SelectTrigger aria-label="Select area unit" className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">sq ft</SelectItem>
                    <SelectItem value="sqm">sq m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="unitSystem">Unit System</Label>
              <Select
                id="unitSystem"
                value={inputs.unitSystem}
                onValueChange={(v) => handleInputChange("unitSystem", v)}
              >
                <SelectTrigger aria-label="Select unit system" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial (lbs, acres)</SelectItem>
                  <SelectItem value="metric">Metric (kg, hectares)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fertilizerN">Fertilizer Nitrogen (N) %</Label>
              <Input
                id="fertilizerN"
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="e.g., 10"
                value={inputs.fertilizerN}
                onChange={(e) => handleInputChange("fertilizerN", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fertilizerP">Fertilizer Phosphorus (P₂O₅) %</Label>
              <Input
                id="fertilizerP"
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="e.g., 5"
                value={inputs.fertilizerP}
                onChange={(e) => handleInputChange("fertilizerP", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fertilizerK">Fertilizer Potassium (K₂O) %</Label>
              <Input
                id="fertilizerK"
                type="number"
                min={0}
                max={100}
                step="any"
                placeholder="e.g., 10"
                value={inputs.fertilizerK}
                onChange={(e) => handleInputChange("fertilizerK", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="desiredN">Desired Nitrogen (N) Rate</Label>
              <Input
                id="desiredN"
                type="number"
                min={0}
                step="any"
                placeholder={inputs.unitSystem === "imperial" ? "lbs/acre" : "kg/ha"}
                value={inputs.desiredN}
                onChange={(e) => handleInputChange("desiredN", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="desiredP">Desired Phosphorus (P₂O₅) Rate</Label>
              <Input
                id="desiredP"
                type="number"
                min={0}
                step="any"
                placeholder={inputs.unitSystem === "imperial" ? "lbs/acre" : "kg/ha"}
                value={inputs.desiredP}
                onChange={(e) => handleInputChange("desiredP", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="desiredK">Desired Potassium (K₂O) Rate</Label>
              <Input
                id="desiredK"
                type="number"
                min={0}
                step="any"
                placeholder={inputs.unitSystem === "imperial" ? "lbs/acre" : "kg/ha"}
                value={inputs.desiredK}
                onChange={(e) => handleInputChange("desiredK", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate fertilizer application"
        >
          <Leaf className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              area: "",
              areaUnit: "sqft",
              fertilizerN: "",
              fertilizerP: "",
              fertilizerK: "",
              desiredN: "",
              desiredP: "",
              desiredK: "",
              unitSystem: "imperial",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 h-5 w-5" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-green-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-green-800 dark:text-green-300">{results.label}</p>
            <p className="mt-4 text-sm text-green-700 dark:text-green-400 max-w-xl mx-auto leading-relaxed">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fertilizer Application Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise amount of fertilizer needed based on your specific soil conditions, crop type, and yield goals. It eliminates guesswork and prevents over- or under-application.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your field or lawn size in acres or square feet, current soil nutrient levels from a soil test, desired crop or grass type, and the fertilizer product you plan to use. The calculator uses these inputs to compute application rates in pounds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended total fertilizer amount and per-1000-sq-ft rate. Cross-reference your chosen product's N-P-K ratio to ensure proper nutrient delivery, then adjust equipment settings to match the calculated spread rate.</p>
        </div>
      </section>

      {/* TABLE: Recommended Nutrient Rates by Crop Type (lbs/acre) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Nutrient Rates by Crop Type (lbs/acre)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks represent standard nutrient applications for major crops based on 2024 agronomic guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crop</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nitrogen (N)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Phosphorus (P₂O₅)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Potassium (K₂O)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corn (yield goal: 150 bu/acre)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soybeans (yield goal: 45 bu/acre)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wheat (yield goal: 60 bu/acre)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alfalfa (established stand)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cool-season grass (lawns)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 per 1000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 per 1000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 per 1000 sq ft</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates vary by soil test results, organic matter, and regional recommendations; always follow soil test guidance.</p>
      </section>

      {/* TABLE: Common Fertilizer Products and N-P-K Concentrations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Fertilizer Products and N-P-K Concentrations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these typical product concentrations when inputting fertilizer type into the calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">N-P-K Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ammonium Nitrate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34-0-0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High nitrogen source</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Triple Superphosphate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-46-0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Phosphorus boost</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Muriate of Potash</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-0-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Potassium source</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-10-10 Balanced</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-10-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lawn and garden maintenance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">46-0-0 Urea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">46-0-0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cost-effective nitrogen</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-10-10 Starter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Corn and soybean starter</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Product formulations vary by manufacturer; verify N-P-K on product labels before application.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always conduct a soil test before using the calculator to ensure accurate nutrient recommendations and avoid costly over-application.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Convert your field measurements to the calculator's preferred units (acres or square feet) for more precise results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in split applications for nitrogen-heavy crops like corn to maximize nutrient uptake and minimize leaching losses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check weather forecasts before applying fertilizer; avoid application 24 hours before rain to reduce runoff and ensure soil absorption.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping soil testing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying fertilizer without soil test data leads to wasteful over-application or nutrient deficiencies that reduce yields.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using old soil test results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Soil nutrient levels change yearly; using 5-year-old test data produces inaccurate calculator recommendations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing product concentration with application rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 46-0-0 urea product requires different spreader settings than a 10-10-10 balanced fertilizer; input the correct product concentration into the calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring organic matter content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High-organic soils naturally release nitrogen; failing to account for this causes over-fertilization and environmental runoff.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct fertilizer rate for my lawn?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your lawn size in square feet, soil test results (nitrogen, phosphorus, potassium levels), and grass type. The calculator divides total nutrient needs by fertilizer concentration to determine pounds needed per 1,000 sq ft.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What nutrient ratios should I use for different crops?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common ratios: corn needs 150-180 lbs N/acre, soybeans need 0-20 lbs N/acre, and wheat needs 100-150 lbs N/acre depending on soil conditions and yield goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I apply more fertilizer than the calculator recommends?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Over-application wastes money and risks nutrient runoff, leaching, and environmental damage; apply only what soil tests and the calculator indicate is needed for optimal yields.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does soil pH affect fertilizer application rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Soil pH influences nutrient availability; acidic soils (&lt;6.0) may need lime added, while alkaline soils (&gt;7.5) may lock up certain micronutrients, affecting recommended application rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between broadcast and spot application calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Broadcast spreads fertilizer uniformly across the entire area, while spot application concentrates nutrients in specific zones; the calculator adjusts rates based on your application method.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate fertilizer needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Update soil tests every 2-3 years to account for nutrient depletion and changes in soil composition, then recalculate application rates using the calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for organic matter in soil?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; soils with 5%+ organic matter release 20-40 lbs N/acre annually, so the calculator reduces synthetic nitrogen recommendations based on this input.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soils/nutrient-management" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Natural Resources Conservation Service (NRCS) — Nutrient Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidance on sustainable fertilizer application and soil testing standards.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu/soil-testing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State College of Agricultural Sciences — Soil Testing and Fertility</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University extension resource with soil test interpretation tables and nutrient recommendation guidelines.</p>
          </li>
          <li>
            <a href="https://extension.umn.edu/corn/corn-nutrient-recommendations" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Minnesota Extension — Corn Nutrient Recommendations</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crop-specific nutrient rate recommendations based on yield goals and soil conditions.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/nutrientpollution/sources-and-solutions" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Environmental Protection Agency (EPA) — Nutrient Pollution</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Information on how over-fertilization contributes to water pollution and best management practices.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fertilizer Application Calculator"
      description="Calculate fertilizer application rates. Determine the correct amount of nitrogen, phosphorus, and potassium for your lawn or crop area."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Calculation Methodology",
        formula:
          "Total Fertilizer Needed = max((Desired N × Area) / (Fertilizer N% / 100), (Desired P × Area) / (Fertilizer P% / 100), (Desired K × Area) / (Fertilizer K% / 100))",
        variables: [
          { symbol: "Desired N", description: "Desired nitrogen application rate (lbs/acre or kg/ha)" },
          { symbol: "Desired P", description: "Desired phosphorus application rate (lbs/acre or kg/ha)" },
          { symbol: "Desired K", description: "Desired potassium application rate (lbs/acre or kg/ha)" },
          { symbol: "Area", description: "Area to fertilize (acres or hectares)" },
          { symbol: "Fertilizer N%", description: "Percentage of nitrogen in fertilizer" },
          { symbol: "Fertilizer P%", description: "Percentage of phosphorus (P₂O₅) in fertilizer" },
          { symbol: "Fertilizer K%", description: "Percentage of potassium (K₂O) in fertilizer" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 10,000 square foot lawn and want to apply fertilizer containing 10% nitrogen, 5% phosphorus, and 10% potassium. Your soil test recommends applying 1.5 lbs of nitrogen, 0.5 lbs of phosphorus (P₂O₅), and 1.0 lb of potassium (K₂O) per 1,000 square feet.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the lawn area to acres: 10,000 sq ft ÷ 43,560 sq ft/acre ≈ 0.23 acres.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate fertilizer needed for nitrogen: (1.5 lbs × 0.23 acres) ÷ (10 / 100) = 3.45 lbs fertilizer.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate fertilizer needed for phosphorus: (0.5 lbs × 0.23 acres) ÷ (5 / 100) = 2.3 lbs fertilizer.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate fertilizer needed for potassium: (1.0 lb × 0.23 acres) ÷ (10 / 100) = 2.3 lbs fertilizer.",
          },
          {
            label: "Step 5",
            explanation:
              "Select the largest fertilizer amount to meet all nutrient needs: max(3.45, 2.3, 2.3) = 3.45 lbs fertilizer.",
          },
        ],
        result:
          "You should apply approximately 3.45 lbs of this fertilizer to your 10,000 sq ft lawn to meet the nutrient requirements.",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Lawn Mowing Time & Fuel Planner", url: "/everyday/lawn-mowing-time-fuel", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "💡" },
        { title: "Planting Calendar & Frost Date Finder", url: "/everyday/planting-calendar-frost-date", icon: "🌿" },
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