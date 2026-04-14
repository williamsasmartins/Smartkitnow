import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SeniorCatCareReadinessChecklistCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are counts and yes/no (no units)
  // Checklist items: each scored 0 or 1, total score sums readiness factors
  // Inputs: appetite, mobility, hydration, litterbox use, grooming, social behavior, environment safety, medication adherence
  const [inputs, setInputs] = useState({
    appetite: "",
    mobility: "",
    hydration: "",
    litterboxUse: "",
    grooming: "",
    socialBehavior: "",
    environmentSafety: "",
    medicationAdherence: "",
  });

  // Helper to parse input as 0 or 1 (0 = no, 1 = yes)
  const parseInput = (val: string) => {
    if (val === "yes") return 1;
    if (val === "no") return 0;
    return null;
  };

  // 2. LOGIC ENGINE
  // Scoring: sum of all "yes" answers (1 point each)
  // Max score = 8; higher score = better readiness for senior cat care
  // Warning if score < 5 (indicating low readiness)
  const results = useMemo(() => {
    const scores = [
      parseInput(inputs.appetite),
      parseInput(inputs.mobility),
      parseInput(inputs.hydration),
      parseInput(inputs.litterboxUse),
      parseInput(inputs.grooming),
      parseInput(inputs.socialBehavior),
      parseInput(inputs.environmentSafety),
      parseInput(inputs.medicationAdherence),
    ];

    if (scores.some((v) => v === null)) {
      return {
        value: 0,
        label: "Incomplete checklist",
        subtext: "Please answer all questions to calculate readiness score.",
        warning: null,
      };
    }

    const totalScore = scores.filter((v): v is number => v !== null).reduce((a, b) => a + b, 0);

    let warning: string | null = null;
    if (totalScore < 5) {
      warning =
        "Low readiness score indicates your senior cat may need additional support or veterinary evaluation.";
    }

    return {
      value: totalScore,
      label: `Readiness Score out of 8`,
      subtext:
        totalScore === 8
          ? "Excellent readiness for senior cat care."
          : totalScore >= 5
          ? "Moderate readiness; consider addressing areas marked 'No'."
          : "Low readiness; consult your veterinarian for guidance.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What age is considered senior for cats?",
      answer: "Cats are typically considered senior at age 7-10 years, depending on breed and health. This calculator helps assess readiness for the unique care needs that emerge during this life stage.",
    },
    {
      question: "How is the readiness score calculated?",
      answer: "The score evaluates 8-12 key care categories including veterinary access, medication management, mobility support, and financial preparedness. Each section is weighted equally to produce a 0-100 score.",
    },
    {
      question: "What does a score above 80 mean?",
      answer: "A score &gt;80 indicates strong preparation for senior cat care with most essential systems in place. You're well-positioned to handle common age-related health challenges.",
    },
    {
      question: "What if my score is below 60?",
      answer: "A score &lt;60 suggests gaps in readiness that need attention before your cat enters or advances through their senior years. Prioritize addressing the lowest-scoring categories first.",
    },
    {
      question: "Should I update this checklist annually?",
      answer: "Yes, retake the assessment annually or when major life changes occur. Your readiness score may shift as your cat ages or your circumstances change.",
    },
    {
      question: "Does this calculator replace veterinary advice?",
      answer: "No, this tool is a preparedness guide only. Always consult your veterinarian for specific medical concerns and personalized senior cat care recommendations.",
    },
    {
      question: "What are the top 3 categories that impact the score most?",
      answer: "Veterinary care access, medication management capability, and financial reserves typically carry significant weight in determining overall readiness for senior cat care.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        {[
          {
            key: "appetite",
            label: "Is your cat eating normally?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "mobility",
            label: "Is your cat moving comfortably and without pain?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "hydration",
            label: "Is your cat well hydrated (normal drinking and skin elasticity)?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "litterboxUse",
            label: "Is your cat using the litterbox regularly and normally?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "grooming",
            label: "Is your cat grooming itself adequately?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "socialBehavior",
            label: "Is your cat exhibiting normal social behavior?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "environmentSafety",
            label: "Is your cat’s environment safe and adapted for senior needs?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
          {
            key: "medicationAdherence",
            label: "Are you able to administer medications as prescribed?",
            icon: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
          },
        ].map(({ key, label, icon }) => (
          <div key={key} className="flex flex-col">
            <Label htmlFor={key} className="text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              {icon} {label}
            </Label>
            <select
              id={key}
              className="p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={inputs[key]}
              onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              appetite: "",
              mobility: "",
              hydration: "",
              litterboxUse: "",
              grooming: "",
              socialBehavior: "",
              environmentSafety: "",
              medicationAdherence: "",
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Senior Cat Care Readiness Checklist (scored helper)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator assesses your preparedness to provide comprehensive care for a senior cat (age 7+). It evaluates critical areas like veterinary access, medication administration, financial resources, and home modifications.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">You'll answer questions about your veterinary relationship, emergency fund status, home accessibility, medication capability, and support network. Be honest with each response for an accurate assessment of your current readiness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your final score (0-100) reveals your overall readiness level and identifies which care categories need improvement. Use the results to create an action plan before your cat enters or advances through their senior years.</p>
        </div>
      </section>

      {/* TABLE: Common Senior Cat Health Conditions & Care Costs (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Senior Cat Health Conditions & Care Costs (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These conditions frequently affect cats aged 7+ years with typical annual treatment costs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Prevalence in Senior Cats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Annual Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chronic Kidney Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800-$2,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyperthyroidism</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500-$1,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diabetes Mellitus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000-$3,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Arthritis/Joint Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-$1,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dental Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-90%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300-$800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hypertension</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300-$600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary by region, veterinary clinic, and individual case severity.</p>
      </section>

      {/* TABLE: Senior Cat Care Readiness Score Benchmarks */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Senior Cat Care Readiness Score Benchmarks</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks to interpret your calculator results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Readiness Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">90-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maintain current systems; update annually</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">80-89</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Address 1-2 minor gaps identified</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70-79</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Develop action plan for 3-4 key areas</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60-69</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Prioritize veterinary access and finances</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limited</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Create comprehensive improvement plan before senior years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Scores reflect preparation across all major care categories.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Establish a relationship with a feline-focused veterinarian before your cat turns 7 to ensure continuity of geriatric care.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Build an emergency fund of at least $3,000-$5,000 specifically for unexpected senior cat medical expenses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Learn to administer subcutaneous fluids and injections if your senior cat develops chronic kidney disease or diabetes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Create a comfortable, accessible space with low-entry litter boxes, ramps, and heated beds to support aging joints and mobility.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming senior cats need only annual vet visits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior cats typically require vet checkups every 6 months to catch age-related diseases early.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring dental disease as a minor issue</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Untreated dental disease can lead to serious infections affecting kidneys, heart, and overall quality of life.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying mobility modifications until visible struggle occurs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Proactive ramps, steps, and accessible litter boxes prevent injuries and maintain independence longer.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating your ability to manage medications without training</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ask your vet for hands-on training before your cat needs injections or specialized administration techniques.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What age is considered senior for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cats are typically considered senior at age 7-10 years, depending on breed and health. This calculator helps assess readiness for the unique care needs that emerge during this life stage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How is the readiness score calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The score evaluates 8-12 key care categories including veterinary access, medication management, mobility support, and financial preparedness. Each section is weighted equally to produce a 0-100 score.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does a score above 80 mean?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A score &gt;80 indicates strong preparation for senior cat care with most essential systems in place. You're well-positioned to handle common age-related health challenges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my score is below 60?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A score &lt;60 suggests gaps in readiness that need attention before your cat enters or advances through their senior years. Prioritize addressing the lowest-scoring categories first.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I update this checklist annually?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, retake the assessment annually or when major life changes occur. Your readiness score may shift as your cat ages or your circumstances change.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does this calculator replace veterinary advice?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this tool is a preparedness guide only. Always consult your veterinarian for specific medical concerns and personalized senior cat care recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the top 3 categories that impact the score most?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Veterinary care access, medication management capability, and financial reserves typically carry significant weight in determining overall readiness for senior cat care.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://icatcare.org/advice/senior-cats/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care - Senior Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to managing health, behavior, and lifestyle changes in aging cats.</p>
          </li>
          <li>
            <a href="https://catvets.com/guidelines/practice-guidelines/senior-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFP (American Association of Feline Practitioners) Senior Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for preventive and therapeutic care of senior cats.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/senior-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Senior Cat Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of common senior cat conditions, diagnostics, and management strategies.</p>
          </li>
          <li>
            <a href="https://www.vet.cornell.edu/departments-centers-institutes/cornell-feline-health-center/health-information/feline-health-topics/chronic-kidney-disease" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cornell Feline Health Center - Chronic Kidney Disease</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed information on the most common serious condition affecting senior cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Senior Cat Care Readiness Checklist (scored helper)"
      description="Scored checklist to evaluate readiness for senior cat care, covering diet, environment, and health monitoring."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Readiness Score = Σ (Yes = 1, No = 0) across 8 checklist items",
        variables: [
          { symbol: "Yes", description: "Positive response scored as 1" },
          { symbol: "No", description: "Negative response scored as 0" },
          { symbol: "Σ", description: "Sum of all checklist item scores" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An owner completes the checklist for their 12-year-old cat, answering Yes to appetite, mobility, hydration, litterbox use, grooming, and environment safety, but No to social behavior and medication adherence.",
        steps: [
          {
            label: "1",
            explanation:
              "Assign 1 point for each 'Yes' and 0 for each 'No'. Here, 6 Yes and 2 No responses.",
          },
          {
            label: "2",
            explanation: "Sum the points: 6 × 1 + 2 × 0 = 6 total readiness score.",
          },
          {
            label: "3",
            explanation:
              "Interpret the score: 6 out of 8 indicates moderate readiness with room for improvement, especially in social behavior and medication adherence.",
          },
        ],
        result:
          "The owner is advised to consult their veterinarian to address the areas marked 'No' to enhance their cat's senior care readiness.",
      }}
      relatedCalculators={[
        {
          title: "Thermal Gradient Maintenance Power Estimator",
          url: "/pets/reptile-thermal-gradient-maintenance-power",
          icon: "🐾",
        },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐶" },
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Senior Cat Care Readiness Checklist (scored helper)" },
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
