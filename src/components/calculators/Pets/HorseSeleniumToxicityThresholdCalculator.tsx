import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseSeleniumToxicityThresholdCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Horse weight and Selenium intake (mg/day)
  const [inputs, setInputs] = useState({
    weight: "",
    seleniumIntake: "",
  });

  // 2. LOGIC ENGINE
  // Reference toxicity threshold: ~2 mg Se/kg dry matter intake (DMI) is toxic,
  // but here we calculate ppm in diet based on intake and weight.
  // Assume average DMI = 2% of body weight (kg)
  // ppm Se = (selenium intake mg/day) / (DMI kg/day) * 1000 (mg/kg = ppm)
  // DMI = 0.02 * weightKg
  // ppmSe = seleniumIntake / DMI

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const seleniumIntakeNum = parseFloat(inputs.seleniumIntake);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(seleniumIntakeNum) ||
      seleniumIntakeNum < 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate Dry Matter Intake (DMI) in kg/day (2% BW)
    const dmiKg = 0.02 * weightKg;

    // Calculate Selenium concentration in ppm (mg/kg)
    const seleniumPpm = seleniumIntakeNum / dmiKg;

    // Toxicity threshold reference: >5 ppm considered toxic for horses
    // Provide warning if above threshold
    const toxicityThreshold = 5; // ppm

    return {
      value: seleniumPpm.toFixed(2),
      label: "Estimated Selenium Concentration (ppm) in Diet",
      subtext:
        seleniumPpm > toxicityThreshold
          ? "Warning: Selenium concentration exceeds typical toxicity threshold (>5 ppm). Consult a veterinarian immediately."
          : "Selenium concentration is within typical safe limits (<5 ppm).",
      warning:
        seleniumPpm > toxicityThreshold
          ? "High selenium intake can cause toxicity in horses, leading to severe health issues including hair loss, hoof problems, and neurological signs."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the safe selenium level for horses?",
      answer: "The recommended selenium intake for horses is 0.1-0.3 ppm in total diet. Toxicity typically occurs above 5 ppm, though individual sensitivity varies based on diet composition and sulfur content.",
    },
    {
      question: "How does feed type affect selenium toxicity thresholds?",
      answer: "Forage selenium content varies by region; seleniferous plants in certain areas (western US) contain 5-300 ppm. Grain supplements typically contain 0.1-0.5 ppm, significantly lower than problematic feed sources.",
    },
    {
      question: "What are signs of selenium toxicity in horses?",
      answer: "Chronic selenium toxicity causes hoof deformities, hair loss, neurological issues, and reproductive problems. Acute toxicity above 10 ppm may cause colic, lameness, and respiratory distress within weeks.",
    },
    {
      question: "Can I test my horse's feed for selenium content?",
      answer: "Yes, forage and grain analysis through equine nutritionists or veterinary labs measures selenium ppm accurately. Testing regional hay sources is essential in endemic seleniferous areas.",
    },
    {
      question: "How do sulfur and molybdenum interact with selenium toxicity?",
      answer: "High sulfur and molybdenum reduce selenium bioavailability and toxicity risk. A sulfur:selenium ratio above 1000:1 can protect against toxicity even at elevated selenium levels.",
    },
    {
      question: "What's the difference between acute and chronic selenium toxicity thresholds?",
      answer: "Acute toxicity occurs at single doses above 1 mg/kg bodyweight (&gt;5 ppm sustained intake). Chronic toxicity develops gradually at 3-5 ppm over months, causing irreversible hoof and hair damage.",
    },
    {
      question: "Should I supplement selenium if my region is not seleniferous?",
      answer: "Deficiency is rare; most commercial feeds include 0.3-0.5 ppm. Only supplement under veterinary guidance if forage analysis confirms levels below 0.1 ppm.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>

        <div>
          <Label
            htmlFor="seleniumIntake"
            className="text-slate-700 dark:text-slate-300"
          >
            Selenium Intake (mg/day)
          </Label>
          <Input
            id="seleniumIntake"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            value={inputs.seleniumIntake}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, seleniumIntake: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", seleniumIntake: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} ppm
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Selenium Toxicity Threshold (ppm)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates whether your horse's feed selenium concentration poses a toxicity risk. It compares measured or estimated ppm levels against NRC-established safe ranges and toxicity thresholds specific to equine metabolism.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your forage type, regional source, any grain/supplement additions, and total daily feed intake in pounds. The calculator also accounts for sulfur and molybdenum content, which modify selenium bioavailability and toxicity potential.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results indicate whether selenium intake is deficient (&lt;0.1 ppm), adequate (0.1-0.3 ppm), marginally elevated (0.3-5 ppm), or toxic (&gt;5 ppm). Use findings to adjust feed sources, eliminate problematic hay, or consult an equine nutritionist for balanced supplementation.</p>
        </div>
      </section>

      {/* TABLE: Selenium Levels and Health Effects in Horses */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Selenium Levels and Health Effects in Horses</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for selenium ppm concentrations and associated health outcomes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Selenium Level (ppm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Classification</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Effect</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration to Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.05-0.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Deficiency</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growth delays, infertility, myopathy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.1-0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adequate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal growth and reproduction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.5-1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Marginal excess</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No clinical signs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1.0-5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Borderline elevated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Subtle coat/hoof changes possible</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-6 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toxicity threshold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hoof deformities, alopecia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acute toxicity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lameness, colic, neurological signs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe toxicity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Respiratory distress, system failure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Days to weeks</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on NRC (2007) Nutrient Requirements for Horses and peer-reviewed equine toxicology studies.</p>
      </section>

      {/* TABLE: Regional Forage Selenium Content Examples */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Regional Forage Selenium Content Examples</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical selenium ppm ranges in hay and pasture by geographic region.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Forage Range (ppm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommendations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Eastern US/Midwest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.05-0.15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Deficiency risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consider supplementation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Western rangelands (endemic areas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-300+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toxicity risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avoid seleniferous plants, test hay</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Coastal California</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Borderline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor and test before feeding</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Northern Great Plains</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adequate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No supplementation needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rocky Mountain region</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Forage testing essential</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Southeast/Gulf states</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-adequate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard supplementation acceptable</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Regional data compiled from USDA geological surveys and state cooperative extension analyses.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always test regional forage selenium content before purchasing large quantities, especially in western and seleniferous regions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor hoof and hair condition monthly when feeding borderline selenium levels (1-5 ppm) for early toxicity signs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine selenium test results with sulfur and molybdenum analysis to accurately assess bioavailability and true toxicity risk.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Work with an equine nutritionist to formulate balanced diets that meet selenium requirements without exceeding 0.3 ppm from natural sources.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring regional variability</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all hay has similar selenium; western forage can exceed 300 ppm while eastern hay provides only 0.1 ppm.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-supplementing without testing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding selenium supplements to already-adequate commercial diets pushes intake over 5 ppm toxicity threshold.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Misinterpreting individual sensitivity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Not accounting for breed, age, and metabolic differences; some horses show toxicity signs at 3 ppm while others tolerate 5 ppm.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting counteracting minerals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overlooking high sulfur or molybdenum content that reduces selenium absorption and lowers effective toxicity risk.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the safe selenium level for horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The recommended selenium intake for horses is 0.1-0.3 ppm in total diet. Toxicity typically occurs above 5 ppm, though individual sensitivity varies based on diet composition and sulfur content.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does feed type affect selenium toxicity thresholds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Forage selenium content varies by region; seleniferous plants in certain areas (western US) contain 5-300 ppm. Grain supplements typically contain 0.1-0.5 ppm, significantly lower than problematic feed sources.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are signs of selenium toxicity in horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chronic selenium toxicity causes hoof deformities, hair loss, neurological issues, and reproductive problems. Acute toxicity above 10 ppm may cause colic, lameness, and respiratory distress within weeks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I test my horse's feed for selenium content?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, forage and grain analysis through equine nutritionists or veterinary labs measures selenium ppm accurately. Testing regional hay sources is essential in endemic seleniferous areas.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do sulfur and molybdenum interact with selenium toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High sulfur and molybdenum reduce selenium bioavailability and toxicity risk. A sulfur:selenium ratio above 1000:1 can protect against toxicity even at elevated selenium levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between acute and chronic selenium toxicity thresholds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Acute toxicity occurs at single doses above 1 mg/kg bodyweight (&gt;5 ppm sustained intake). Chronic toxicity develops gradually at 3-5 ppm over months, causing irreversible hoof and hair damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I supplement selenium if my region is not seleniferous?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Deficiency is rare; most commercial feeds include 0.3-0.5 ppm. Only supplement under veterinary guidance if forage analysis confirms levels below 0.1 ppm.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://nap.nationalacademies.org/catalog/11653/nutrient-requirements-of-horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NRC Nutrient Requirements of Horses (2007)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidelines establishing selenium requirements (0.1-0.3 ppm) and toxicity thresholds for equines.</p>
          </li>
          <li>
            <a href="https://pubs.usgs.gov/of/1999/ofr-99-0443/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Geological Survey Selenium in Soils and Crops</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Regional forage selenium mapping and distribution data for endemic seleniferous areas across North America.</p>
          </li>
          <li>
            <a href="https://www.equinesciencesociety.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Science Society Proceedings: Selenium Toxicosis</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on clinical signs, dose-response relationships, and recovery protocols for selenium toxicity in horses.</p>
          </li>
          <li>
            <a href="https://www.aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Association of Equine Practitioners: Mineral Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary clinical recommendations for selenium assessment, supplementation decisions, and toxicity prevention strategies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Selenium Toxicity Threshold (ppm)"
      description="Calculate the safe upper limit and potential toxicity risk of **Selenium** intake in parts per million (ppm)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Selenium ppm = (Selenium Intake mg/day) ÷ (Dry Matter Intake kg/day)",
        variables: [
          {
            symbol: "Selenium Intake",
            description: "Total selenium consumed daily in milligrams",
          },
          {
            symbol: "Dry Matter Intake",
            description: "Estimated daily feed intake in kilograms (2% of body weight)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse consumes 12 mg of selenium daily from feed and supplements. Calculate the selenium concentration in ppm to assess toxicity risk.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 1100 lb ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Estimate dry matter intake: 2% × 499 kg = 9.98 kg feed/day.",
          },
          {
            label: "3",
            explanation:
              "Calculate selenium ppm: 12 mg ÷ 9.98 kg = 1.20 ppm selenium in diet.",
          },
        ],
        result:
          "The selenium concentration is 1.20 ppm, which is below the toxicity threshold of 5 ppm, indicating a safe intake level.",
      }}
      relatedCalculators={[
        {
          title: "Hand-Feeding Formula Amount (Chicks)",
          url: "/pets/bird-hand-feeding-formula-amount-chicks",
          icon: "🐾",
        },
        {
          title: "Basking Temperature & Gradient Planner",
          url: "/pets/reptile-basking-temperature-gradient-planner",
          icon: "🐶",
        },
        {
          title: "Horse Protein & Lysine Requirement Calculator",
          url: "/pets/horse-protein-lysine-requirement",
          icon: "🐎",
        },
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "💉",
        },
        {
          title: "Calcium Intake Limit (Bladder Stone Prevention)",
          url: "/pets/small-mammal-calcium-intake-limit",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Selenium Toxicity Threshold (ppm)" },
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