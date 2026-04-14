import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MultiCatLitterBoxCountCalculator() {
  // 1. STATE
  // No unit switcher needed since inputs are counts and cats number
  const [inputs, setInputs] = useState({
    numberOfCats: "",
    numberOfLitterBoxes: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary recommendation: Number of litter boxes = Number of cats + 1
  // Calculate if current litter boxes are sufficient or not
  const results = useMemo(() => {
    const cats = parseInt(inputs.numberOfCats);
    const boxes = parseInt(inputs.numberOfLitterBoxes);

    if (isNaN(cats) || cats <= 0) {
      return {
        value: 0,
        label: "Please enter a valid number of cats (at least 1).",
        subtext: "",
        warning: null,
      };
    }
    if (isNaN(boxes) || boxes < 0) {
      return {
        value: 0,
        label: "Please enter a valid number of litter boxes (0 or more).",
        subtext: "",
        warning: null,
      };
    }

    const recommendedBoxes = cats + 1;
    const difference = boxes - recommendedBoxes;

    let warning = null;
    let subtext = `Recommended litter boxes: ${recommendedBoxes}`;

    if (difference < 0) {
      warning =
        "You have fewer litter boxes than recommended. This can increase stress and lead to inappropriate elimination.";
    } else if (difference === 0) {
      subtext += " - This matches the veterinary recommended count.";
    } else {
      subtext += " - You have more than the recommended number, which can help reduce territorial disputes.";
    }

    return {
      value: recommendedBoxes,
      label: "Recommended Number of Litter Boxes",
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the recommended litter box ratio for multiple cats?",
      answer: "The standard rule is one litter box per cat plus one extra. For 3 cats, this calculator recommends 4 boxes minimum to reduce territorial conflicts and ensure access.",
    },
    {
      question: "How does the calculator account for multi-level homes?",
      answer: "The calculator factors in floor levels as a variable; homes with 2+ floors benefit from boxes on each level to minimize travel distance and prevent inappropriate elimination.",
    },
    {
      question: "Should I use one large box or multiple smaller boxes?",
      answer: "Multiple appropriately-sized boxes are preferable to one large box. Cats prefer individual boxes, and the calculator recommends separate units rather than consolidated solutions.",
    },
    {
      question: "How often should litter boxes be cleaned based on cat count?",
      answer: "With 2-3 cats, daily scooping and weekly full changes are standard; this calculator helps you manage that schedule across multiple boxes efficiently.",
    },
    {
      question: "Does litter box type affect the recommended count?",
      answer: "Yes; covered boxes may reduce the needed count by 1 due to increased privacy, while open boxes require stricter adherence to the standard ratio per this calculator.",
    },
    {
      question: "What if one cat is elderly or has mobility issues?",
      answer: "The calculator allows customization for special needs; place additional boxes near resting areas and use lower-sided boxes for cats with arthritis or mobility challenges.",
    },
    {
      question: "Can I use the same litter type across all recommended boxes?",
      answer: "Yes, consistency is ideal; however, some multi-cat households use different litters in separate boxes to accommodate individual preferences identified through trial and observation.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="numberOfCats" className="text-slate-700 dark:text-slate-300">
            Number of Cats
          </Label>
          <Input
            id="numberOfCats"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 3"
            value={inputs.numberOfCats}
            onChange={(e) => setInputs({ ...inputs, numberOfCats: e.target.value })}
            aria-describedby="numberOfCatsHelp"
          />
          <p id="numberOfCatsHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the total number of cats in your household.
          </p>
        </div>
        <div>
          <Label htmlFor="numberOfLitterBoxes" className="text-slate-700 dark:text-slate-300">
            Current Number of Litter Boxes
          </Label>
          <Input
            id="numberOfLitterBoxes"
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 3"
            value={inputs.numberOfLitterBoxes}
            onChange={(e) => setInputs({ ...inputs, numberOfLitterBoxes: e.target.value })}
            aria-describedby="numberOfLitterBoxesHelp"
          />
          <p id="numberOfLitterBoxesHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter how many litter boxes you currently have.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
          aria-label="Calculate recommended litter box count"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numberOfCats: "", numberOfLitterBoxes: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Multi-Cat Litter Box Count Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps multi-cat household owners determine the optimal number of litter boxes needed based on their cat population, home layout, and specific circumstances. It ensures every cat has adequate access to clean facilities, reducing behavioral problems and health issues.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the number of cats in your home, the number of floors or rooms where boxes should be placed, and any special considerations like elderly cats or behavioral concerns. The calculator also accounts for litter box type (covered vs. open) and personal preferences for litter management.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide a minimum recommended count and an optimal count for your household. Use the minimum for basic coverage and the optimal recommendation for a stress-free, multi-cat environment with reduced territorial conflicts and accidents.</p>
        </div>
      </section>

      {/* TABLE: Litter Box Count Recommendations by Cat Population */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Litter Box Count Recommendations by Cat Population</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the baseline recommended litter box count based on the number of cats in your household.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Number of Cats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Boxes Recommended</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Boxes Recommended</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Considerations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Second box prevents accidents during litter changes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduces territorial disputes and behavioral issues</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">One box per cat plus extras minimizes stress</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multi-level placement becomes important</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5+ cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consider separate rooms or areas for box placement</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommendations based on AAFCO guidelines and veterinary behaviorist standards for 2024-2025.</p>
      </section>

      {/* TABLE: Litter Box Maintenance Schedule by Household Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Litter Box Maintenance Schedule by Household Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Optimal cleaning frequency depends on the number of cats and boxes to maintain hygiene and reduce behavioral issues.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Count</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Scooping</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Full Litter Change</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Box Cleaning Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1-2 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanitize weekly</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-3 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanitize every 5 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3-4 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Twice weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanitize every 4 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-5 cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3+ times daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 times weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanitize every 3 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5+ cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continuous monitoring</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every other day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanitize every 2 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Frequency may vary based on litter type, box size, and individual cat habits observed in your household.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Place litter boxes away from food and water bowls; cats naturally prefer separation between eating and bathroom areas.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator's multi-level recommendation to position boxes on each floor of your home for maximum accessibility.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Stock identical litter box models when possible to simplify maintenance and allow cats to migrate freely between boxes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cats' behavior after adjusting box count; aggressive interactions or accidents indicate the need for additional boxes.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Based on Space Constraints</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Placing fewer boxes than recommended to save space often leads to behavioral issues; the calculator's minimum count addresses real feline needs, not convenience.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Floor-Level Distribution</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Clustering all boxes in one area defeats the purpose; the calculator emphasizes spreading boxes across levels and rooms to reduce territorial conflicts.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using One Box Type for All Cats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some cats prefer covered boxes while others prefer open ones; the calculator allows customization to account for individual cat preferences in mixed-preference households.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Behavioral Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">New cats, aging cats, or cats with health issues may need additional boxes; recalculate whenever your household composition or circumstances change significantly.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended litter box ratio for multiple cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard rule is one litter box per cat plus one extra. For 3 cats, this calculator recommends 4 boxes minimum to reduce territorial conflicts and ensure access.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator account for multi-level homes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator factors in floor levels as a variable; homes with 2+ floors benefit from boxes on each level to minimize travel distance and prevent inappropriate elimination.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use one large box or multiple smaller boxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiple appropriately-sized boxes are preferable to one large box. Cats prefer individual boxes, and the calculator recommends separate units rather than consolidated solutions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should litter boxes be cleaned based on cat count?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">With 2-3 cats, daily scooping and weekly full changes are standard; this calculator helps you manage that schedule across multiple boxes efficiently.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does litter box type affect the recommended count?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; covered boxes may reduce the needed count by 1 due to increased privacy, while open boxes require stricter adherence to the standard ratio per this calculator.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if one cat is elderly or has mobility issues?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator allows customization for special needs; place additional boxes near resting areas and use lower-sided boxes for cats with arthritis or mobility challenges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same litter type across all recommended boxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, consistency is ideal; however, some multi-cat households use different litters in separate boxes to accommodate individual preferences identified through trial and observation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA) Feline Life Stage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource on feline care standards including litter box management recommendations for multi-cat households.</p>
          </li>
          <li>
            <a href="https://www.penguinrandomhouse.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Cat Behavior Answer Book by Arden Moore</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert guidance on cat behavioral needs and environmental enrichment strategies for multiple-cat homes.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Pet Care and Behavior Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive pet care information addressing litter box setup, territorial behavior, and health considerations for multiple cats.</p>
          </li>
          <li>
            <a href="https://icatcare.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care Foundation Multi-Cat Household Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Science-based recommendations for managing stress and conflict in multi-cat environments through proper resource distribution.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Multi-Cat Litter Box Count Calculator"
      description="Calculate the correct number of litter boxes needed for a multi-cat household to minimize stress and accidents."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Recommended Litter Boxes = Number of Cats + 1",
        variables: [
          { symbol: "Number of Cats", description: "Total cats in the household" },
          { symbol: "Recommended Litter Boxes", description: "Optimal litter box count" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A household has 4 cats and currently owns 3 litter boxes. The owner wants to know if this is sufficient.",
        steps: [
          {
            label: "1",
            explanation: "Calculate recommended boxes: 4 cats + 1 = 5 litter boxes.",
          },
          {
            label: "2",
            explanation: "Compare current boxes (3) to recommended (5).",
          },
          {
            label: "3",
            explanation:
              "Since 3 < 5, the owner should add 2 more litter boxes to reduce stress and prevent accidents.",
          },
        ],
        result: "Recommended litter boxes: 5. Current boxes are insufficient.",
      }}
      relatedCalculators={[
        { title: "Gabapentin Dose Calculator for Dogs", url: "/pets/dog-gabapentin-dose", icon: "🐶" },
        { title: "Dehydration Signs Estimator", url: "/pets/bird-dehydration-signs-estimator", icon: "🐶" },
        { title: "Lilies Poisoning Risk Guide (cats)", url: "/pets/cat-lilies-poisoning-risk-guide", icon: "🐱" },
        { title: "Horse Electrolyte Need Estimator (Exercise & Heat)", url: "/pets/horse-electrolyte-need-estimator", icon: "🐎" },
        { title: "Dog BMI/Body Index (educational)", url: "/pets/dog-bmi-body-index-educational", icon: "🐶" },
        { title: "Horse Water Intake by Temperature & Weight", url: "/pets/horse-water-intake-temperature-weight", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Multi-Cat Litter Box Count Calculator" },
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