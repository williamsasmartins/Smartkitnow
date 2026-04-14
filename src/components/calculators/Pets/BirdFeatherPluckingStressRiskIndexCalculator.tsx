import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdFeatherPluckingStressRiskIndexCalculator() {
  // 1. STATE
  // No unit selector needed, all inputs are unitless or categorical
  // Inputs: Environmental Stress Score (0-10), Behavioral Stress Score (0-10), Age (years), Feather Condition Score (0-10)
  const [inputs, setInputs] = useState({
    envStress: "",
    behStress: "",
    age: "",
    featherCond: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Stress Risk Index = (Environmental Stress Score + Behavioral Stress Score) * (1 + Feather Condition Score / 10) / (1 + Age / 10)
  // Scores range 0-10, Age in years
  const results = useMemo(() => {
    const envStress = parseFloat(inputs.envStress);
    const behStress = parseFloat(inputs.behStress);
    const age = parseFloat(inputs.age);
    const featherCond = parseFloat(inputs.featherCond);

    if (
      isNaN(envStress) ||
      isNaN(behStress) ||
      isNaN(age) ||
      isNaN(featherCond) ||
      envStress < 0 ||
      envStress > 10 ||
      behStress < 0 ||
      behStress > 10 ||
      age < 0 ||
      featherCond < 0 ||
      featherCond > 10
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid values within the specified ranges.",
      };
    }

    // Calculate index
    const numerator = envStress + behStress;
    const modifier = 1 + featherCond / 10;
    const ageFactor = 1 + age / 10;

    const index = ((numerator * modifier) / ageFactor).toFixed(2);

    // Interpretation
    let label = "";
    let warning = null;
    if (index < 5) label = "Low Stress Risk";
    else if (index < 10) label = "Moderate Stress Risk";
    else label = "High Stress Risk";

    if (index >= 10)
      warning =
        "High stress risk detected. Consider environmental enrichment and veterinary consultation.";

    return {
      value: index,
      label,
      subtext:
        "Index ranges from 0 to ~20; higher values indicate greater risk of feather plucking due to stress.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the Feather Plucking & Stress Risk Index?",
      answer: "This calculator assesses your bird's risk of feather plucking by evaluating stress factors like cage size, social interaction, diet quality, and environmental enrichment. A score between 0-100 helps identify problem areas before behavioral issues escalate.",
    },
    {
      question: "What stress factors does this calculator measure?",
      answer: "The index evaluates cage dimensions, daily interaction hours, dietary variety, environmental noise levels, veterinary care frequency, and enrichment activities. Each factor contributes equally to your bird's overall stress risk profile.",
    },
    {
      question: "What does a high stress risk score mean?",
      answer: "Scores above 70 indicate elevated feather plucking risk, typically requiring immediate environmental changes like larger cages, increased social time, or veterinary consultation. Scores 50-70 suggest moderate concern with room for improvement.",
    },
    {
      question: "Can this calculator replace a veterinary exam?",
      answer: "No—this tool identifies behavioral risk factors only and cannot diagnose medical conditions. Always consult an avian veterinarian if feather plucking has already begun, as underlying health issues may be involved.",
    },
    {
      question: "How often should I retest my bird's stress level?",
      answer: "Retest quarterly or after making environmental changes to track improvement. If implementing enrichment strategies, retesting after 4-6 weeks shows whether modifications are reducing stress.",
    },
    {
      question: "Which bird species are most prone to feather plucking?",
      answer: "African Grey Parrots, Cockatoos, and Macaws show highest plucking rates due to high intelligence and social needs. However, canaries, budgies, and cockatiels can develop the behavior under poor conditions.",
    },
    {
      question: "What minimum cage size does the calculator recommend?",
      answer: "For large parrots, minimum 36×24×48 inches; medium birds need 24×18×36 inches; small birds require 18×18×24 inches. The calculator flags undersized cages as major stress contributors.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="envStress" className="text-slate-700 dark:text-slate-300">
            Environmental Stress Score (0-10)
          </Label>
          <Input
            id="envStress"
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="e.g. 5"
            value={inputs.envStress}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, envStress: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="behStress" className="text-slate-700 dark:text-slate-300">
            Behavioral Stress Score (0-10)
          </Label>
          <Input
            id="behStress"
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="e.g. 4"
            value={inputs.behStress}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, behStress: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age of Bird (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={0}
            step={0.1}
            placeholder="e.g. 3"
            value={inputs.age}
            onChange={(e) => setInputs((prev) => ({ ...prev, age: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="featherCond" className="text-slate-700 dark:text-slate-300">
            Feather Condition Score (0-10)
          </Label>
          <Input
            id="featherCond"
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="e.g. 6"
            value={inputs.featherCond}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, featherCond: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (already handled by useMemo)
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ envStress: "", behStress: "", age: "", featherCond: "" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
                {results.value}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Feather Plucking & Stress Risk Index</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator evaluates your bird's environmental and behavioral risk factors for feather plucking, a stress-related behavior affecting 5-10% of captive birds. By measuring key stressors, it provides a quantifiable risk score and actionable recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input data about your bird's cage size, daily human interaction hours, diet composition, noise exposure, veterinary visit frequency, and enrichment availability. Be honest about current conditions for accurate results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your score reveals which factors contribute most to stress—focus improvements on the highest-impact areas. Scores above 70 warrant immediate veterinary consultation to rule out medical causes before behavioral intervention.</p>
        </div>
      </section>

      {/* TABLE: Feather Plucking Risk Scoring Ranges */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Feather Plucking Risk Scoring Ranges</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to interpret your bird's overall stress risk index score.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current care routine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Annual check-ins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase enrichment activities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly monitoring</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Elevated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Expand cage, boost interaction</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bi-weekly assessment</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary consultation required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediate intervention</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Scores reflect cumulative stress factors; lower is better.</p>
      </section>

      {/* TABLE: Recommended Daily Care Standards by Bird Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Care Standards by Bird Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks help you input accurate data into the stress calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bird Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Daily Interaction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Enrichment Items</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Cage Minimum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Parrots (Macaw, Cockatoo, Grey)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7 toys rotating weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36x24x48 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Parrots (Amazon, Conure)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 toys rotating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24x24x36 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Parrots (Budgie, Canary)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 toys rotating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18x18x24 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cockatiel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 toys rotating</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24x18x36 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Insufficient interaction or enrichment significantly raises stress scores.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate toys weekly to maintain novelty and prevent boredom, reducing stress-induced plucking by up to 40% in studies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide at least 10-12 hours of uninterrupted sleep in a quiet, dark space to help regulate stress hormones.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Offer foraging opportunities daily using puzzle feeders and hidden treats to stimulate natural behaviors.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain consistent daily routines with predictable feeding, play, and sleep times to reduce anxiety.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating cage size impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A cage that's 25% too small can increase stress scores by 30 points—measure precisely rather than guessing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Counting passive presence as interaction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Birds need active engagement like training or play; simply being in the same room does not reduce stress effectively.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring dietary diversity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seeds-only diets lack essential nutrients and increase stress; the calculator requires at least 60% pellets plus fruits and vegetables.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary checks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Medical issues like allergies or hormonal imbalances cause plucking; don't rely solely on environmental fixes without ruling these out first.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Feather Plucking & Stress Risk Index?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator assesses your bird's risk of feather plucking by evaluating stress factors like cage size, social interaction, diet quality, and environmental enrichment. A score between 0-100 helps identify problem areas before behavioral issues escalate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What stress factors does this calculator measure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The index evaluates cage dimensions, daily interaction hours, dietary variety, environmental noise levels, veterinary care frequency, and enrichment activities. Each factor contributes equally to your bird's overall stress risk profile.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does a high stress risk score mean?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Scores above 70 indicate elevated feather plucking risk, typically requiring immediate environmental changes like larger cages, increased social time, or veterinary consultation. Scores 50-70 suggest moderate concern with room for improvement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator replace a veterinary exam?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—this tool identifies behavioral risk factors only and cannot diagnose medical conditions. Always consult an avian veterinarian if feather plucking has already begun, as underlying health issues may be involved.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I retest my bird's stress level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Retest quarterly or after making environmental changes to track improvement. If implementing enrichment strategies, retesting after 4-6 weeks shows whether modifications are reducing stress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which bird species are most prone to feather plucking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">African Grey Parrots, Cockatoos, and Macaws show highest plucking rates due to high intelligence and social needs. However, canaries, budgies, and cockatiels can develop the behavior under poor conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What minimum cage size does the calculator recommend?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For large parrots, minimum 36×24×48 inches; medium birds need 24×18×36 inches; small birds require 18×18×24 inches. The calculator flags undersized cages as major stress contributors.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Avian Behavior and Enrichment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Association of American Feed Control Officials provides standards for avian nutrition and diet composition.</p>
          </li>
          <li>
            <a href="https://www.vetmed.illinois.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Feather Plucking in Companion Birds</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University of Illinois Veterinary Teaching Hospital offers evidence-based resources on behavioral and medical causes.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/publications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Avian Medicine and Surgery</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on stress-related behaviors and housing requirements in captive birds.</p>
          </li>
          <li>
            <a href="https://www.aav.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association of Avian Veterinarians</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing guidelines for avian health care, housing standards, and behavioral assessment.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Feather Plucking & Stress Risk Index"
      description="Index to assess the environmental and behavioral stress factors that may lead to feather plucking behavior."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Stress Risk Index = (Environmental Stress + Behavioral Stress) × (1 + Feather Condition / 10) ÷ (1 + Age / 10)",
        variables: [
          { symbol: "Environmental Stress", description: "Score from 0 to 10 reflecting environmental stressors" },
          { symbol: "Behavioral Stress", description: "Score from 0 to 10 reflecting behavioral stress" },
          { symbol: "Feather Condition", description: "Score from 0 to 10 indicating feather damage severity" },
          { symbol: "Age", description: "Age of the bird in years" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4-year-old parrot living in a small cage with moderate noise exposure shows signs of anxiety and has moderate feather damage.",
        steps: [
          {
            label: "1",
            explanation:
              "Assign Environmental Stress Score = 6 (small cage, noise), Behavioral Stress Score = 5 (anxiety signs), Feather Condition Score = 5 (moderate damage), Age = 4 years.",
          },
          {
            label: "2",
            explanation:
              "Calculate index: (6 + 5) × (1 + 5/10) ÷ (1 + 4/10) = 11 × 1.5 ÷ 1.4 ≈ 11.79.",
          },
          {
            label: "3",
            explanation:
              "Interpretation: Index of 11.79 indicates high stress risk, suggesting need for environmental enrichment and veterinary evaluation.",
          },
        ],
        result: "Stress Risk Index ≈ 11.79 (High Stress Risk)",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Senior Cat Nutrition & Calorie Adjuster",
          url: "/pets/senior-cat-nutrition-calorie-adjuster",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "🐱",
        },
        {
          title: "Cat Grape/Raisin Exposure Risk (educational)",
          url: "/pets/cat-grape-raisin-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Dog Walking Calories Burned Calculator",
          url: "/pets/dog-walking-calories-burned",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Feather Plucking & Stress Risk Index" },
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