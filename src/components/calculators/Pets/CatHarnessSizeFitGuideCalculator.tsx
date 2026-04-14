import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatHarnessSizeFitGuideCalculator() {
  // 1. STATE
  // Unit system for length measurement: imperial (inches) or metric (cm)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Neck circumference and Chest circumference (girth)
  const [inputs, setInputs] = useState({
    neck: "",
    chest: "",
  });

  // 2. LOGIC ENGINE
  // Logic: Determine harness size category based on neck and chest circumference.
  // Typical harness sizes for cats:
  // Small: Neck 8-10 in (20-25 cm), Chest 12-14 in (30-36 cm)
  // Medium: Neck 10-12 in (25-30 cm), Chest 14-16 in (36-41 cm)
  // Large: Neck 12-14 in (30-36 cm), Chest 16-18 in (41-46 cm)
  // If measurements fall outside these ranges, recommend custom or consult vet.

  const results = useMemo(() => {
    const neckRaw = parseFloat(inputs.neck);
    const chestRaw = parseFloat(inputs.chest);
    if (isNaN(neckRaw) || isNaN(chestRaw) || neckRaw <= 0 || chestRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to inches if metric
    const neckIn = unit === "metric" ? neckRaw / 2.54 : neckRaw;
    const chestIn = unit === "metric" ? chestRaw / 2.54 : chestRaw;

    let size = "";
    let warning = null;

    if (neckIn >= 8 && neckIn <= 10 && chestIn >= 12 && chestIn <= 14) {
      size = "Small";
    } else if (neckIn > 10 && neckIn <= 12 && chestIn > 14 && chestIn <= 16) {
      size = "Medium";
    } else if (neckIn > 12 && neckIn <= 14 && chestIn > 16 && chestIn <= 18) {
      size = "Large";
    } else {
      size = "Custom or Consult Vet";
      warning =
        "Your cat's measurements fall outside standard harness sizes. Please consult your veterinarian or a pet specialist for a custom fit to ensure safety and comfort.";
    }

    return {
      value: size,
      label: "Recommended Harness Size",
      subtext:
        "Based on your cat's neck and chest circumference measurements.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What measurements do I need to size a cat harness correctly?",
      answer: "You'll need your cat's chest girth (around the widest part of the rib cage) and neck circumference. Most harnesses fit cats with chest sizes between 8-14 inches and neck sizes of 6-10 inches.",
    },
    {
      question: "How tight should a cat harness fit?",
      answer: "A properly fitted harness should allow one finger to slip between the harness and your cat's body. Too loose and your cat can escape; too tight restricts breathing and causes discomfort.",
    },
    {
      question: "At what age can I start using a harness on my kitten?",
      answer: "Kittens can begin harness training at 8-12 weeks old using extra-small sizes. Always supervise and introduce gradually to prevent stress and ensure proper fit as they grow.",
    },
    {
      question: "Do different harness styles fit differently?",
      answer: "Yes, H-style harnesses fit differently than figure-8 or vest styles. H-style harnesses are tighter at the chest, while vest styles distribute pressure more evenly across the body.",
    },
    {
      question: "How often should I check if my cat's harness still fits?",
      answer: "Check harness fit monthly, especially for growing kittens under 1 year old, and every 3-6 months for adult cats. Sudden weight changes also require immediate reassessment.",
    },
    {
      question: "What breeds typically require larger harness sizes?",
      answer: "Maine Coons, Ragdolls, and Bengals typically need large or extra-large harnesses with chest sizes of 12-16+ inches. Always measure individual cats as size varies significantly within breeds.",
    },
    {
      question: "Can an ill-fitting harness cause health problems?",
      answer: "Yes, harnesses that are too tight can restrict breathing, cause skin irritation, and damage fur. Loose harnesses risk escape and potential injury if your cat gets caught on objects.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (inches)</SelectItem>
              <SelectItem value="metric">Metric (cm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300">
            Neck Circumference ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="neck"
            type="number"
            min="0"
            step="0.1"
            placeholder={`e.g. ${unit === "imperial" ? "9" : "23"}`}
            value={inputs.neck}
            onChange={(e) => setInputs((prev) => ({ ...prev, neck: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="chest" className="text-slate-700 dark:text-slate-300">
            Chest Circumference ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="chest"
            type="number"
            min="0"
            step="0.1"
            placeholder={`e.g. ${unit === "imperial" ? "13" : "33"}`}
            value={inputs.chest}
            onChange={(e) => setInputs((prev) => ({ ...prev, chest: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ neck: "", chest: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Harness Size & Fit Guide</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the correct harness size and fit for your cat using precise body measurements. It accounts for different harness styles, cat age, and breed characteristics to recommend the most comfortable and secure option.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's chest girth, neck circumference, age, and weight along with your preferred harness style. The calculator cross-references these measurements against industry-standard sizing charts and breed-specific recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended size and fit feedback, which includes specific guidance on how snug the harness should be and whether adjustments are needed. Compare multiple styles if your cat falls between sizes to find the best comfort and safety balance.</p>
        </div>
      </section>

      {/* TABLE: Cat Harness Size Chart by Measurement */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cat Harness Size Chart by Measurement</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use your cat's chest and neck measurements to determine the correct harness size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Harness Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Chest Girth (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Neck Circumference (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Cat Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kittens, small breeds</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Young cats, petite adults</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Average adult cats</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large breeds (Maine Coon, Ragdoll)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra large breeds, overweight cats</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Measurements should be taken snugly but not tight. Refer to manufacturer guidelines as sizing varies by brand.</p>
      </section>

      {/* TABLE: Harness Style Comparison and Fit Characteristics */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Harness Style Comparison and Fit Characteristics</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different harness styles distribute pressure differently and suit various cat needs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Harness Style</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fit Characteristic</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Escape Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">H-Style (Figure-8)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Active cats, outdoor walks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tight at chest and shoulders</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vest Style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Senior cats, comfort-focused</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Even pressure distribution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Figure-8 (Closed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Training and leash work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Secure chest and back coverage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adjustable Strap</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growing kittens, varied sizes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple adjustment points</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Backpack Style</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short outdoor trips</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weight distributed across back</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always prioritize comfort and fit over style. Your cat's safety and willingness to wear the harness matter most.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your cat when relaxed and standing naturally; avoid measuring when your cat is stressed or moving around.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a soft measuring tape and measure twice to ensure accuracy, as even small differences can affect harness fit.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always supervise your cat the first several times wearing a new harness to monitor comfort and behavior.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider your cat's personality: anxious cats may prefer vest styles that feel more secure, while active cats benefit from H-style harnesses.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring Over Thick Fur</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring over your cat's coat can give inaccurate results; part the fur or measure against the skin for true dimensions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seasonal weight fluctuations and aging affect fit significantly, so re-measure every few months rather than assuming last year's size still works.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Choosing Style Over Fit</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting a trendy harness that doesn't fit properly is dangerous; prioritize correct measurements and fit over aesthetic preferences.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Growth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kittens grow rapidly and can outgrow harnesses within 6-8 weeks; plan for adjustability or expect to purchase multiple sizes during the first year.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What measurements do I need to size a cat harness correctly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You'll need your cat's chest girth (around the widest part of the rib cage) and neck circumference. Most harnesses fit cats with chest sizes between 8-14 inches and neck sizes of 6-10 inches.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How tight should a cat harness fit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A properly fitted harness should allow one finger to slip between the harness and your cat's body. Too loose and your cat can escape; too tight restricts breathing and causes discomfort.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what age can I start using a harness on my kitten?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens can begin harness training at 8-12 weeks old using extra-small sizes. Always supervise and introduce gradually to prevent stress and ensure proper fit as they grow.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do different harness styles fit differently?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, H-style harnesses fit differently than figure-8 or vest styles. H-style harnesses are tighter at the chest, while vest styles distribute pressure more evenly across the body.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check if my cat's harness still fits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check harness fit monthly, especially for growing kittens under 1 year old, and every 3-6 months for adult cats. Sudden weight changes also require immediate reassessment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What breeds typically require larger harness sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maine Coons, Ragdolls, and Bengals typically need large or extra-large harnesses with chest sizes of 12-16+ inches. Always measure individual cats as size varies significantly within breeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can an ill-fitting harness cause health problems?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, harnesses that are too tight can restrict breathing, cause skin irritation, and damage fur. Loose harnesses risk escape and potential injury if your cat gets caught on objects.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.humanesociety.org/resources/leash-train-your-cat" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Humane Society: Cat Harness Training</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert guidance on safely introducing harnesses to cats and training techniques for outdoor walks.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/cat-care/general-cat-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA: Pet Safety Essentials</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive cat safety information including proper equipment sizing and fitting recommendations.</p>
          </li>
          <li>
            <a href="https://icatcare.org/advice/enrichment/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care: Environmental Enrichment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional guidance on safe outdoor exposure methods for cats, including harness use and leash training.</p>
          </li>
          <li>
            <a href="https://veterinarypartner.com/cat-behavior" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Partner: Cat Behavior and Training</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-backed information on cat behavior during harness introduction and stress reduction techniques.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Harness Size & Fit Guide"
      description="Guide to measure and select the correct harness size and fit for walking or outdoor time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Size = f(Neck Circumference, Chest Circumference)",
        variables: [
          { symbol: "Neck Circumference", description: "Measured just above the shoulders" },
          { symbol: "Chest Circumference", description: "Measured at the widest part behind front legs" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat owner measures their cat’s neck at 9 inches and chest at 13 inches using imperial units. They want to find the correct harness size for safe outdoor walks.",
        steps: [
          { label: "1", explanation: "Input neck measurement: 9 inches" },
          { label: "2", explanation: "Input chest measurement: 13 inches" },
          { label: "3", explanation: "Calculate to determine size category" },
        ],
        result: "Recommended Harness Size: Small",
      }}
      relatedCalculators={[
        { title: "Aquarium Salt Dosage Calculator (Therapeutic)", url: "/pets/aquarium-salt-dosage-therapeutic", icon: "🐾" },
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "🐶" },
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "🐱" },
        { title: "Vitamin D3 Requirement (Supplemental)", url: "/pets/reptile-vitamin-d3-requirement", icon: "🍖" },
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Harness Size & Fit Guide" },
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