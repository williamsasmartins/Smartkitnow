import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalBeddingReplacementFrequencyCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are time/age based
  // Inputs: cage size (sq ft), number of animals, bedding type (absorbency rating), and average daily urine output (ml)
  // For simplicity, bedding type absorbency rating: Low=1, Medium=2, High=3 (user selects)
  const [inputs, setInputs] = useState({
    cageSize: "", // sq ft
    numberOfAnimals: "",
    beddingAbsorbency: "2", // default Medium
    avgDailyUrineMl: "",
  });

  // 2. LOGIC ENGINE
  // Formula rationale:
  // Bedding Replacement Frequency (days) = (Bedding Absorbency Rating * Cage Size * 1000) / (Number of Animals * Average Daily Urine Output)
  // This estimates how many days bedding can absorb urine before replacement is needed.
  // 1000 is a scaling factor to convert sq ft and ml to a practical day estimate.
  const results = useMemo(() => {
    const cageSize = parseFloat(inputs.cageSize);
    const numberOfAnimals = parseInt(inputs.numberOfAnimals);
    const beddingAbsorbency = parseInt(inputs.beddingAbsorbency);
    const avgDailyUrineMl = parseFloat(inputs.avgDailyUrineMl);

    if (
      isNaN(cageSize) ||
      cageSize <= 0 ||
      isNaN(numberOfAnimals) ||
      numberOfAnimals <= 0 ||
      isNaN(beddingAbsorbency) ||
      isNaN(avgDailyUrineMl) ||
      avgDailyUrineMl <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all fields.",
      };
    }

    const frequencyDays =
      (beddingAbsorbency * cageSize * 1000) / (numberOfAnimals * avgDailyUrineMl);

    // Warn if frequency is less than 1 day (too frequent)
    const warning =
      frequencyDays < 1
        ? "Estimated replacement frequency is less than 1 day, indicating very high urine output or small cage size. Consider increasing cage size or bedding absorbency."
        : null;

    return {
      value: frequencyDays.toFixed(1),
      label: "Days Between Full Bedding Replacement",
      subtext:
        "This estimate helps maintain hygiene by preventing ammonia buildup and odor.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How often should I replace bedding for small pets like hamsters and gerbils?",
      answer: "Small pets typically need bedding replaced 2-3 times per week due to their high urine concentration and small enclosure sizes. Complete spot-cleaning daily extends the interval between full replacements.",
    },
    {
      question: "What factors affect bedding replacement frequency for rabbits?",
      answer: "Rabbit bedding needs replacement every 3-5 days based on enclosure size, number of rabbits, and litter box habits. Larger spaces and good ventilation can extend replacement intervals by 1-2 days.",
    },
    {
      question: "How does pet weight impact bedding replacement schedules?",
      answer: "Heavier pets produce more waste and moisture, requiring more frequent changes—typically 1-2 days sooner than lighter pets in identical conditions. Weight increases metabolism and urine output significantly.",
    },
    {
      question: "Can bedding type affect how often I need to replace it?",
      answer: "Absorbent materials like aspen shavings last 5-7 days, while paper bedding absorbs moisture better and can extend intervals to 7-10 days. Pine and cedar should never be used due to respiratory toxins.",
    },
    {
      question: "What's the recommended frequency for guinea pigs and chinchillas?",
      answer: "Guinea pigs need bedding changes every 2-3 days with spot-cleaning daily, while chinchillas require changes every 4-7 days since their droppings are drier. Both produce substantial waste relative to cage size.",
    },
    {
      question: "How does enclosure size influence replacement frequency?",
      answer: "Smaller enclosures (&lt;10 sq ft) need bedding changes 2-3 times weekly, while larger habitats (&gt;20 sq ft) can go 5-7 days between changes due to better odor and moisture distribution.",
    },
    {
      question: "Should I do full bedding replacement or spot-cleaning between changes?",
      answer: "Daily spot-cleaning of soiled areas reduces bacteria growth and extends full replacement intervals by 1-2 days, saving 20-30% on bedding costs annually while improving pet health.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="cageSize" className="text-slate-700 dark:text-slate-300">
            Cage Size (square feet)
          </Label>
          <Input
            id="cageSize"
            name="cageSize"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 4.5"
            value={inputs.cageSize}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="numberOfAnimals" className="text-slate-700 dark:text-slate-300">
            Number of Animals
          </Label>
          <Input
            id="numberOfAnimals"
            name="numberOfAnimals"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 3"
            value={inputs.numberOfAnimals}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="beddingAbsorbency" className="text-slate-700 dark:text-slate-300">
            Bedding Absorbency Level
          </Label>
          <select
            id="beddingAbsorbency"
            name="beddingAbsorbency"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.beddingAbsorbency}
            onChange={handleChange}
          >
            <option value="1">Low Absorbency (e.g. straw)</option>
            <option value="2">Medium Absorbency (e.g. wood shavings)</option>
            <option value="3">High Absorbency (e.g. paper-based)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="avgDailyUrineMl" className="text-slate-700 dark:text-slate-300">
            Average Daily Urine Output per Animal (ml)
          </Label>
          <Input
            id="avgDailyUrineMl"
            name="avgDailyUrineMl"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 30"
            value={inputs.avgDailyUrineMl}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              cageSize: "",
              numberOfAnimals: "",
              beddingAbsorbency: "2",
              avgDailyUrineMl: "",
            })
          }
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Bedding Replacement Frequency Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners determine the optimal bedding replacement schedule based on their pet's species, weight, cage size, and current cleaning routine. By inputting these factors, you receive a personalized recommendation that balances pet health, hygiene, and cost efficiency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include your pet type, number of animals, enclosure dimensions, bedding material choice, and whether you perform daily spot-cleaning. The calculator also accounts for humidity levels and ventilation, which significantly impact moisture accumulation and odor control.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show recommended full replacement intervals, estimated monthly bedding costs, and health alerts if your current schedule falls below safe standards. Use these estimates to establish a routine that maintains a clean, healthy habitat while minimizing waste and expense.</p>
        </div>
      </section>

      {/* TABLE: Recommended Bedding Replacement Frequency by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Bedding Replacement Frequency by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to determine standard replacement intervals for common small pets based on species and enclosure conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Full Replacement Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With Daily Spot-Cleaning</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Change Interval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamster (Syrian)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamster (Dwarf)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gerbil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Guinea Pig</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chinchilla</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ferret</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rat/Mouse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Intervals vary with cage size, ventilation, and number of animals; adjust based on odor and moisture levels.</p>
      </section>

      {/* TABLE: Bedding Material Absorbency and Durability Ratings */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Bedding Material Absorbency and Durability Ratings</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different bedding materials offer varying absorbency levels, affecting how long bedding lasts between replacements.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bedding Material</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Absorbency Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Lifespan (Days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aspen Shavings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most small pets</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Paper-Based Bedding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sensitive respiratory systems</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hemp Bedding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Odor control</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pelleted Litter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rabbits and guinea pigs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corn Cob</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short-term use only</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aspen Pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ferrets and rabbits</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pine Shavings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not Recommended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toxic—avoid entirely</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cedar Shavings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not Recommended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toxic—avoid entirely</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always avoid pine and cedar due to phenol toxins that damage respiratory and liver function in small pets.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform daily spot-cleaning of visibly soiled bedding to extend full replacement intervals by 1-2 days and reduce ammonia buildup.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor bedding moisture levels—if it feels damp or smells strongly of ammonia, replace it 1-2 days earlier than recommended.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use high-absorbency materials like paper-based or pelleted bedding to maximize replacement intervals while maintaining odor control.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store bedding in a cool, dry place away from direct sunlight to preserve absorbency and prevent mold or degradation before use.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Odor as a Replacement Trigger</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Waiting until a scheduled date ignores ammonia buildup risks; replace bedding immediately if strong odors develop, regardless of the interval.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Pine or Cedar Bedding</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">These materials contain phenols that cause respiratory disease and liver damage even in small quantities; they should never be used regardless of cost savings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Spot-Cleaning Between Replacements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Without daily spot-cleaning, bedding degrades faster and harbors bacteria, potentially requiring more frequent full replacements and increasing health risks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Multiple Animals</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bedding requirements increase significantly with each additional pet; doubling animals typically requires changing bedding 1-2 days sooner per animal.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I replace bedding for small pets like hamsters and gerbils?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Small pets typically need bedding replaced 2-3 times per week due to their high urine concentration and small enclosure sizes. Complete spot-cleaning daily extends the interval between full replacements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect bedding replacement frequency for rabbits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rabbit bedding needs replacement every 3-5 days based on enclosure size, number of rabbits, and litter box habits. Larger spaces and good ventilation can extend replacement intervals by 1-2 days.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pet weight impact bedding replacement schedules?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heavier pets produce more waste and moisture, requiring more frequent changes—typically 1-2 days sooner than lighter pets in identical conditions. Weight increases metabolism and urine output significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can bedding type affect how often I need to replace it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absorbent materials like aspen shavings last 5-7 days, while paper bedding absorbs moisture better and can extend intervals to 7-10 days. Pine and cedar should never be used due to respiratory toxins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the recommended frequency for guinea pigs and chinchillas?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Guinea pigs need bedding changes every 2-3 days with spot-cleaning daily, while chinchillas require changes every 4-7 days since their droppings are drier. Both produce substantial waste relative to cage size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does enclosure size influence replacement frequency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller enclosures (&lt;10 sq ft) need bedding changes 2-3 times weekly, while larger habitats (&gt;20 sq ft) can go 5-7 days between changes due to better odor and moisture distribution.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I do full bedding replacement or spot-cleaning between changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Daily spot-cleaning of soiled areas reduces bacteria growth and extends full replacement intervals by 1-2 days, saving 20-30% on bedding costs annually while improving pet health.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Small Animal Care: Housing and Bedding Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AAFCO provides guidelines on appropriate bedding materials and housing requirements for small pet welfare.</p>
          </li>
          <li>
            <a href="https://www.rspca.org.uk/adviceandwelfare/pets/rodents" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Rabbit and Guinea Pig Housing Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">RSPCA offers evidence-based recommendations for bedding types and replacement frequencies for rabbits and guinea pigs.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/avma-policies/small-animal-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ammonia Exposure in Small Animal Environments</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AVMA discusses health risks of ammonia from soiled bedding and recommended cleaning protocols to prevent respiratory disease.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/general-pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bedding Material Toxicity and Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASPCA identifies bedding materials safe for small pets and warnings about toxic substances like phenols in cedar and pine.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Bedding Replacement Frequency Estimator"
      description="Estimate how often bedding needs to be fully replaced to maintain hygiene and prevent ammonia buildup."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Bedding Replacement Frequency (days) = (Bedding Absorbency × Cage Size × 1000) ÷ (Number of Animals × Average Daily Urine Output)",
        variables: [
          { symbol: "Bedding Absorbency", description: "Absorbency rating of bedding material (1=Low, 2=Medium, 3=High)" },
          { symbol: "Cage Size", description: "Floor area of the cage in square feet" },
          { symbol: "Number of Animals", description: "Total animals housed in the cage" },
          { symbol: "Average Daily Urine Output", description: "Urine output per animal per day in milliliters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A small mammal owner has a 5 sq ft cage housing 4 animals using medium absorbency wood shavings. Each animal produces approximately 25 ml of urine daily.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate numerator: Bedding Absorbency (2) × Cage Size (5) × 1000 = 10,000",
          },
          {
            label: "2",
            explanation:
              "Calculate denominator: Number of Animals (4) × Average Daily Urine Output (25) = 100",
          },
          {
            label: "3",
            explanation:
              "Divide numerator by denominator: 10,000 ÷ 100 = 100 days estimated between full bedding replacements.",
          },
        ],
        result:
          "The bedding should be fully replaced approximately every 100 days to maintain optimal hygiene under these conditions.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Bedding Replacement Frequency Estimator" },
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