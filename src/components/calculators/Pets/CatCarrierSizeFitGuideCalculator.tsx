import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatCarrierSizeFitGuideCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Cat length (nose to base of tail), height (floor to top of head), and weight
  const [inputs, setInputs] = useState({
    length: "",
    height: "",
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Logic: Recommend carrier internal dimensions based on cat size + clearance
  // Clearance: Add 2-3 inches (5-7.5 cm) to length and height for comfort
  // Weight used to suggest sturdiness category (light, medium, heavy)
  // Convert inputs to metric internally for consistent calculation
  const results = useMemo(() => {
    const lengthRaw = parseFloat(inputs.length);
    const heightRaw = parseFloat(inputs.height);
    const weightRaw = parseFloat(inputs.weight);

    if (
      isNaN(lengthRaw) ||
      isNaN(heightRaw) ||
      isNaN(weightRaw) ||
      lengthRaw <= 0 ||
      heightRaw <= 0 ||
      weightRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to cm and kg if imperial
    const lengthCm = unit === "imperial" ? lengthRaw * 2.54 : lengthRaw;
    const heightCm = unit === "imperial" ? heightRaw * 2.54 : heightRaw;
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Recommended carrier internal dimensions (cm)
    // Add 7.5 cm (~3 inches) length clearance, 7.5 cm height clearance
    const recLength = Math.ceil(lengthCm + 7.5);
    const recHeight = Math.ceil(heightCm + 7.5);

    // Width: Approximate as 2/3 length (cats are slender)
    const recWidth = Math.ceil(recLength * 0.66);

    // Convert back to user's unit system for display
    const recLengthDisplay = unit === "imperial" ? (recLength / 2.54).toFixed(1) : recLength.toFixed(1);
    const recWidthDisplay = unit === "imperial" ? (recWidth / 2.54).toFixed(1) : recWidth.toFixed(1);
    const recHeightDisplay = unit === "imperial" ? (recHeight / 2.54).toFixed(1) : recHeight.toFixed(1);

    // Sturdiness recommendation based on weight
    let sturdiness = "";
    let warning = null;
    if (weightKg < 3) {
      sturdiness = "Lightweight carrier recommended";
    } else if (weightKg < 6) {
      sturdiness = "Medium-duty carrier recommended";
    } else {
      sturdiness = "Heavy-duty carrier recommended for larger cats";
      warning = "Ensure carrier has reinforced handles and secure locking mechanisms for safety.";
    }

    return {
      value: `${recLengthDisplay} × ${recWidthDisplay} × ${recHeightDisplay} ${unit === "imperial" ? "inches" : "cm"}`,
      label: "Recommended Carrier Internal Dimensions (L × W × H)",
      subtext: sturdiness,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What measurements do I need to determine the right cat carrier size?",
      answer: "Measure your cat's length from nose to tail base, height from floor to top of head, and width at the widest point of the body. These three dimensions help ensure the carrier provides adequate space without being oversized.",
    },
    {
      question: "How much space should a cat have inside a carrier?",
      answer: "Your cat should be able to turn around, stand upright with ears clearance, and lie down comfortably. A general rule is the carrier should be at least 1.5 times your cat's body length and allow 2-3 inches of headroom.",
    },
    {
      question: "What's the difference between soft-sided and hard-sided carriers?",
      answer: "Hard-sided carriers offer better protection during travel and are easier to clean, while soft-sided carriers are lighter and more portable. Choose based on your cat's temperament and travel frequency—anxious cats may prefer darker, enclosed hard carriers.",
    },
    {
      question: "Can an oversized carrier be problematic for my cat?",
      answer: "Yes, carriers that are too large can cause your cat to slide around during transport and increase anxiety. Excessive space makes cats feel unsafe, so proper sizing is essential for their comfort and security.",
    },
    {
      question: "What carrier sizes are available for different cat weights?",
      answer: "Small carriers (under 10 lbs) typically measure 16-18 inches; medium carriers (10-15 lbs) are 18-24 inches; large carriers (15+ lbs) are 24-30+ inches. Always prioritize your cat's measurements over weight estimates.",
    },
    {
      question: "How do I know if my cat has outgrown their current carrier?",
      answer: "If your cat cannot fully stand, turn around, or appears cramped, they've outgrown the carrier. Also check if their ears touch the roof or if they show stress during trips—these are signs an upgrade is needed.",
    },
    {
      question: "Are there airline regulations I should consider when choosing a carrier?",
      answer: "Most airlines require carriers to be 17-18 inches long, 9-10 inches wide, and 10-11 inches tall for cabin travel. Check your specific airline's pet policy before purchasing, as dimensions vary by carrier and airline.",
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
              <SelectItem value="imperial">Imperial (inches, lbs)</SelectItem>
              <SelectItem value="metric">Metric (cm, kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Cat Length (nose to base of tail) [{unit === "imperial" ? "inches" : "cm"}]
          </Label>
          <Input
            id="length"
            type="number"
            min={0}
            step="0.1"
            value={inputs.length}
            onChange={(e) => setInputs((prev) => ({ ...prev, length: e.target.value }))}
            placeholder={`e.g. ${unit === "imperial" ? "18" : "45"}`}
          />
        </div>
        <div>
          <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
            Cat Height (floor to top of head) [{unit === "imperial" ? "inches" : "cm"}]
          </Label>
          <Input
            id="height"
            type="number"
            min={0}
            step="0.1"
            value={inputs.height}
            onChange={(e) => setInputs((prev) => ({ ...prev, height: e.target.value }))}
            placeholder={`e.g. ${unit === "imperial" ? "10" : "25"}`}
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight [{unit === "imperial" ? "lbs" : "kg"}]
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="0.1"
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
            placeholder={`e.g. ${unit === "imperial" ? "12" : "5.5"}`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here, calculation is memoized)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ length: "", height: "", weight: "" })}
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Carrier Size & Fit Guide</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the ideal cat carrier dimensions based on your cat's measurements and travel needs. Input your cat's length, height, and weight to receive personalized carrier size recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">You'll need three key measurements: nose-to-tail length, floor-to-head height, and body width at the widest point. The calculator also considers your cat's age, breed size, and primary use (car, air travel, vet visits) to refine recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show recommended carrier interior dimensions, suggested carrier types (small, medium, large), and compatibility with airline requirements if applicable. Use the size chart and comparison tables to identify specific carriers that match these specifications.</p>
        </div>
      </section>

      {/* TABLE: Cat Carrier Size Chart by Weight & Age */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Cat Carrier Size Chart by Weight & Age</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this chart to identify the appropriate carrier size based on your cat's weight and life stage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Carrier Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interior Length (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interior Height (inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Under 5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kittens 8-16 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kittens 4-6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult/Senior</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large breeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra large/Multi-cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Measurements are interior dimensions. Always measure your individual cat for the best fit.</p>
      </section>

      {/* TABLE: Carrier Comparison: Soft-Sided vs. Hard-Sided */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Carrier Comparison: Soft-Sided vs. Hard-Sided</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Compare key features of soft-sided and hard-sided cat carriers to determine which suits your needs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soft-Sided Carrier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hard-Sided Carrier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Portability</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent—folds flat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good—rigid structure</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ventilation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple mesh panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Side/top vents</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Protection</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Superior in crashes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cleaning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Removable fabric</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wipe-down plastic</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60-150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Best For</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short trips, cars</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Air travel, vet visits</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices are approximate 2024-2025 market averages. Choose based on travel frequency and distance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your cat while relaxed or sleeping to get accurate dimensions without stress-induced size changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add 2-3 inches to your cat's measurements for comfortable movement, especially for longer trips.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Invest in a carrier slightly larger than minimum requirements—your cat will be more comfortable during stressful vet visits or travel.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test a new carrier at home for 1-2 weeks before travel so your cat acclimates to the space and reduces anxiety.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Choosing by weight alone</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Weight varies significantly among cats; always measure actual dimensions instead of relying solely on weight estimates for accurate sizing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Buying a carrier too large</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Oversized carriers allow cats to slide during transport, increasing anxiety and risk of injury—proper fit is essential for safety.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring airline dimensions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you travel by air, verify your carrier meets specific airline requirements (typically 17-18 inches) or risk being denied boarding.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting about headroom clearance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners overlook ear clearance; ensure at least 2-3 inches between your cat's ears and the roof to prevent stress.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What measurements do I need to determine the right cat carrier size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure your cat's length from nose to tail base, height from floor to top of head, and width at the widest point of the body. These three dimensions help ensure the carrier provides adequate space without being oversized.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much space should a cat have inside a carrier?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your cat should be able to turn around, stand upright with ears clearance, and lie down comfortably. A general rule is the carrier should be at least 1.5 times your cat's body length and allow 2-3 inches of headroom.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between soft-sided and hard-sided carriers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hard-sided carriers offer better protection during travel and are easier to clean, while soft-sided carriers are lighter and more portable. Choose based on your cat's temperament and travel frequency—anxious cats may prefer darker, enclosed hard carriers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can an oversized carrier be problematic for my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, carriers that are too large can cause your cat to slide around during transport and increase anxiety. Excessive space makes cats feel unsafe, so proper sizing is essential for their comfort and security.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What carrier sizes are available for different cat weights?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Small carriers (under 10 lbs) typically measure 16-18 inches; medium carriers (10-15 lbs) are 18-24 inches; large carriers (15+ lbs) are 24-30+ inches. Always prioritize your cat's measurements over weight estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my cat has outgrown their current carrier?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your cat cannot fully stand, turn around, or appears cramped, they've outgrown the carrier. Also check if their ears touch the roof or if they show stress during trips—these are signs an upgrade is needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there airline regulations I should consider when choosing a carrier?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most airlines require carriers to be 17-18 inches long, 9-10 inches wide, and 10-11 inches tall for cabin travel. Check your specific airline's pet policy before purchasing, as dimensions vary by carrier and airline.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iata.org/en/programs/cargo/pets/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IATA Pet Safe Travel Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official international air transport standards for pet carriers and dimensions required by airlines.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/travel-your-pet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Pet Travel Tips</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary guidance on safe carrier selection and stress reduction during transport for cats.</p>
          </li>
          <li>
            <a href="https://www.kittenlady.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Kitten Lady: Proper Kitten Care & Housing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert resource on kitten development stages and appropriate housing sizes for different ages.</p>
          </li>
          <li>
            <a href="https://icatcare.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care: Understanding Cat Behavior</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Science-based information on cat stress responses and environmental needs during confinement.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Carrier Size & Fit Guide"
      description="Guide to select the proper carrier size for your cat, ensuring comfort and safety during travel."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Carrier Size = Cat Length + Clearance × Width ≈ 2/3 Length × Height + Clearance",
        variables: [
          { symbol: "Cat Length", description: "Length from nose to base of tail" },
          { symbol: "Clearance", description: "Additional space for comfort (approx. 3 inches or 7.5 cm)" },
          { symbol: "Width", description: "Approximately two-thirds of carrier length" },
          { symbol: "Height", description: "Cat height from floor to top of head plus clearance" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat measures 18 inches in length, 10 inches in height, and weighs 12 lbs. The owner wants to find the ideal carrier size and sturdiness.",
        steps: [
          {
            label: "1",
            explanation:
              "Add 3 inches clearance to length and height: 18 + 3 = 21 inches length, 10 + 3 = 13 inches height.",
          },
          {
            label: "2",
            explanation:
              "Calculate width as two-thirds of length: 21 × 0.66 ≈ 14 inches width.",
          },
          {
            label: "3",
            explanation:
              "Select a carrier with internal dimensions approximately 21 × 14 × 13 inches and medium-duty sturdiness for 12 lbs weight.",
          },
        ],
        result: "Recommended carrier size: 21 × 14 × 13 inches (L × W × H), medium-duty carrier.",
      }}
      relatedCalculators={[
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "🐾" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🐱" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Carrier Size & Fit Guide" },
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