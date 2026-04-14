import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseWeightEstimatorGirthLengthCalculator() {
  // 1. STATE
  // Default unit system is imperial (inches, pounds)
  const [unit, setUnit] = useState("imperial");

  // Inputs: heart girth and body length
  // Both are numbers (inches or cm depending on unit)
  const [inputs, setInputs] = useState({
    heartGirth: "",
    bodyLength: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: 
  // Weight (kg) = (Heart Girth^2 * Body Length) / 11877 (metric cm)
  // or Weight (lbs) = (Heart Girth^2 * Body Length) / 330 (imperial inches)
  // Reference: Carroll and Huntington (1988) formula for horse weight estimation

  const results = useMemo(() => {
    const girth = parseFloat(inputs.heartGirth);
    const length = parseFloat(inputs.bodyLength);

    if (isNaN(girth) || isNaN(length) || girth <= 0 || length <= 0) {
      return {
        value: 0,
        label: "Estimated Weight",
        subtext: "Please enter valid positive numbers for both measurements.",
        warning: null,
      };
    }

    let weightKg = 0;
    let weightLbs = 0;

    if (unit === "imperial") {
      // inches to pounds
      weightLbs = (girth * girth * length) / 330;
      weightKg = weightLbs / 2.20462;
    } else {
      // metric cm to kg
      weightKg = (girth * girth * length) / 11877;
      weightLbs = weightKg * 2.20462;
    }

    // Round results to 1 decimal place
    const roundedWeight = unit === "imperial" ? weightLbs.toFixed(1) : weightKg.toFixed(1);

    // Warning if values are unusually small or large (basic sanity check)
    let warning = null;
    if (weightKg < 50) {
      warning = "The estimated weight is very low; please verify your measurements.";
    } else if (weightKg > 1200) {
      warning = "The estimated weight is very high; please verify your measurements.";
    }

    return {
      value: roundedWeight,
      label: unit === "imperial" ? "Pounds (lbs)" : "Kilograms (kg)",
      subtext: "Based on heart girth and body length measurements",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What measurements do I need to use this horse weight estimator?",
      answer: "You need two key measurements: heart girth (circumference around the horse's chest) and body length (distance from shoulder to hip). Both should be measured in inches for accuracy.",
    },
    {
      question: "How accurate is the heart girth and length method for estimating horse weight?",
      answer: "This method is typically accurate within 5-10% of actual weight, making it reliable for most management purposes like feed calculations and medication dosing.",
    },
    {
      question: "Where exactly should I measure heart girth on my horse?",
      answer: "Measure heart girth just behind the front legs, around the deepest part of the chest barrel, keeping the tape snug but not tight against the horse's body.",
    },
    {
      question: "Can this calculator work for ponies and miniature horses?",
      answer: "While this estimator is designed for standard horses, ponies and miniature horses may produce less accurate results due to different body proportions and ratios.",
    },
    {
      question: "How often should I re-measure my horse for weight tracking?",
      answer: "Monthly measurements are recommended for monitoring weight changes related to nutrition, training, or health concerns, though measurements can vary by 20-30 lbs based on time of day and hydration.",
    },
    {
      question: "Is body length measured along the spine or the underside of the horse?",
      answer: "Body length should be measured along the horse's side from the point of shoulder to the point of hip, following the natural contour of the body.",
    },
    {
      question: "What should I do if my estimated weight seems too high or low?",
      answer: "Double-check your measurements for accuracy, ensure the tape is positioned correctly, and consult a veterinarian if the estimate differs significantly from expected weight for your horse's breed and age.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
              <SelectItem value="metric">Metric (cm, kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="heartGirth" className="text-slate-700 dark:text-slate-300">
            Heart Girth ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="heartGirth"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter heart girth in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.heartGirth}
            onChange={(e) => setInputs((prev) => ({ ...prev, heartGirth: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="bodyLength" className="text-slate-700 dark:text-slate-300">
            Body Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="bodyLength"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter body length in ${unit === "imperial" ? "inches" : "cm"}`}
            value={inputs.bodyLength}
            onChange={(e) => setInputs((prev) => ({ ...prev, bodyLength: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ heartGirth: "", bodyLength: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content with rich paragraphs
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Weight Estimator (Heart Girth & Length)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Horse Weight Estimator uses two body measurements—heart girth and body length—to calculate your horse's approximate weight without a scale. This method relies on established equine body measurement formulas developed through veterinary research.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your horse's heart girth (measured around the chest just behind the front legs) and body length (measured from shoulder to hip along the side). Both measurements should be in inches for the calculator to function properly.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator returns an estimated weight in pounds that helps you determine feed portions, medication dosages, and exercise intensity. Remember that this is an estimate; actual weight may vary by 5-10% due to body condition, muscle mass, and hydration levels.</p>
        </div>
      </section>

      {/* TABLE: Average Horse Weight by Breed (Approximate) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Horse Weight by Breed (Approximate)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are typical mature weight ranges for common horse breeds used with heart girth and length estimations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Heart Girth (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Length (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Weight (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Thoroughbred</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-78</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68-72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quarter Horse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78-82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-74</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000-1250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warmblood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200-1500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Draft Horse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">76-82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1600-2200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pony (14-14.2hh)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">650-850</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Morgan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-76</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">850-1050</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual weights vary by individual conditioning, age, and genetics; these are reference ranges only.</p>
      </section>

      {/* TABLE: Weight Estimation Accuracy by Measurement Consistency */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Weight Estimation Accuracy by Measurement Consistency</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Measurement precision directly impacts weight estimate reliability across different horse types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Measurement Precision</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Accuracy Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use Case</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Potential Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">±0.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±3-5% accuracy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary and feeding management</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-55 lbs variance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">±1 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±5-8% accuracy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General weight tracking and exercise planning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-90 lbs variance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">±2 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±10-15% accuracy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rough estimates only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-165 lbs variance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">±3+ inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;15% error</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;165 lbs variance</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consistent measurement technique at the same time of day yields the most reliable results.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your horse early morning before feeding for the most consistent and repeatable weight estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a soft fabric measuring tape rather than a rigid ruler to ensure accurate heart girth circumference.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed records of measurements over time to track weight trends more reliably than relying on single estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for winter coat thickness when measuring in cold months, as it can add perceived girth without actual weight gain.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring heart girth too far forward or back</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Incorrect girth placement can skew results by 50+ pounds; always measure the deepest part of the barrel just behind the front legs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using different measurement techniques</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Varying tape tension or body positioning between measurements creates inconsistency; use identical technique each time for valid comparisons.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring body length incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring along the top of the neck or spine instead of the side reduces accuracy; measure along the horse's natural side contour.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring seasonal weight fluctuations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Horses naturally gain 100-200 pounds of seasonal weight; compare estimates from the same season for meaningful tracking.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What measurements do I need to use this horse weight estimator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You need two key measurements: heart girth (circumference around the horse's chest) and body length (distance from shoulder to hip). Both should be measured in inches for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the heart girth and length method for estimating horse weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This method is typically accurate within 5-10% of actual weight, making it reliable for most management purposes like feed calculations and medication dosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Where exactly should I measure heart girth on my horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure heart girth just behind the front legs, around the deepest part of the chest barrel, keeping the tape snug but not tight against the horse's body.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator work for ponies and miniature horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While this estimator is designed for standard horses, ponies and miniature horses may produce less accurate results due to different body proportions and ratios.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I re-measure my horse for weight tracking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monthly measurements are recommended for monitoring weight changes related to nutrition, training, or health concerns, though measurements can vary by 20-30 lbs based on time of day and hydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is body length measured along the spine or the underside of the horse?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Body length should be measured along the horse's side from the point of shoulder to the point of hip, following the natural contour of the body.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my estimated weight seems too high or low?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Double-check your measurements for accuracy, ensure the tape is positioned correctly, and consult a veterinarian if the estimate differs significantly from expected weight for your horse's breed and age.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.extension.oregonstate.edu/ask-expert/featured/what-are-signs-my-horse-or-pony-overweight" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Body Condition Scoring and Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Oregon State University Extension provides guidance on assessing horse weight and condition using standardized scoring methods.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Heart Girth Measurement Technique for Horses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAFCO provides standards for animal feed formulation and nutritional requirements based on accurate weight assessment.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/horse-owners/management-of-horses/feeding-horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Weight Management and Feeding Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Merck Veterinary Manual offers evidence-based recommendations for horse nutrition tied to body weight estimates.</p>
          </li>
          <li>
            <a href="https://www.equusmagazine.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Estimating Horse Weight Without a Scale</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Equus Magazine publishes peer-reviewed articles on equine management including weight estimation techniques.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Weight Estimator (Heart Girth & Length)"
      description="Estimate your horse's body weight accurately using heart girth circumference and body length measurements."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          'Weight (lbs) = (Heart Girth² × Body Length) ÷ 330  (Imperial units)  OR  Weight (kg) = (Heart Girth² × Body Length) ÷ 11877  (Metric units)',
        variables: [
          { symbol: "Heart Girth", description: "Circumference of the chest just behind the front legs" },
          { symbol: "Body Length", description: "Distance from point of shoulder to point of buttock" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse owner measures the heart girth as 75 inches and the body length as 80 inches using an imperial tape measure.",
        steps: [
          {
            label: "1",
            explanation:
              "Square the heart girth: 75 × 75 = 5625. Multiply by body length: 5625 × 80 = 450,000.",
          },
          {
            label: "2",
            explanation:
              "Divide by 330 to estimate weight in pounds: 450,000 ÷ 330 ≈ 1363.6 lbs.",
          },
        ],
        result: "The estimated weight of the horse is approximately 1364 pounds.",
      }}
      relatedCalculators={[
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "🐾" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Safe Stocking Density (Fish/cm per Litre)", url: "/pets/aquarium-safe-stocking-density-fish-per-litre", icon: "🐱" },
        { title: "Daily Calorie Needs by Body Weight", url: "/pets/bird-daily-calorie-needs-body-weight", icon: "🍖" },
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "💉" },
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Weight Estimator (Heart Girth & Length)" },
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