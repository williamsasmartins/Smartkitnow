import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatStressScorePlaytimeOffsetPlannerCalculator() {
  // 1. STATE
  // No unit selector needed since inputs are time and score based
  const [inputs, setInputs] = useState({
    stressBehaviorsObserved: "",
    durationStressBehaviors: "",
    usualDailyPlaytime: "",
    desiredStressReduction: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Stress Score = (Stress Behaviors Observed * Duration in hours) / Usual Daily Playtime (hours)
  // Playtime Offset (hours) = Desired Stress Reduction * Usual Daily Playtime
  // We will output both Stress Score and Playtime Offset for planning
  const results = useMemo(() => {
    const stressBehaviorsObserved = parseInt(inputs.stressBehaviorsObserved);
    const durationStressBehaviors = parseFloat(inputs.durationStressBehaviors);
    const usualDailyPlaytime = parseFloat(inputs.usualDailyPlaytime);
    const desiredStressReduction = parseFloat(inputs.desiredStressReduction);

    if (
      isNaN(stressBehaviorsObserved) ||
      isNaN(durationStressBehaviors) ||
      isNaN(usualDailyPlaytime) ||
      isNaN(desiredStressReduction) ||
      stressBehaviorsObserved < 0 ||
      durationStressBehaviors < 0 ||
      usualDailyPlaytime <= 0 ||
      desiredStressReduction < 0 ||
      desiredStressReduction > 1
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers. Desired stress reduction must be between 0 and 1.",
      };
    }

    // Calculate Stress Score
    const stressScore = (stressBehaviorsObserved * durationStressBehaviors) / usualDailyPlaytime;

    // Calculate Playtime Offset needed to reduce stress by desired amount
    const playtimeOffset = desiredStressReduction * usualDailyPlaytime;

    return {
      value: stressScore.toFixed(2),
      label: "Stress Score",
      subtext: `Recommended additional playtime offset: ${playtimeOffset.toFixed(2)} hours`,
      warning: stressScore > 5 ? "High stress score detected. Consider consulting your veterinarian for behavioral advice." : null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What does the Stress Score indicate about my cat's wellbeing?",
      answer:
        "The Stress Score quantifies the intensity and duration of stress-related behaviors relative to your cat's usual playtime. A higher score suggests prolonged or frequent stress behaviors that may negatively impact your cat's mental and physical health. Understanding this score helps owners identify when intervention, such as increased playtime or environmental enrichment, is necessary to improve wellbeing.",
    },
    {
      question: "How does increasing playtime help reduce my cat's stress?",
      answer:
        "Increasing playtime provides mental stimulation and physical activity, which are essential for reducing stress in cats. Play mimics natural hunting behaviors, helping to release pent-up energy and anxiety. By planning a playtime offset based on the desired stress reduction, owners can proactively manage their cat's stress levels and promote a healthier, happier pet.",
    },
    {
      question: "Why is it important to consider both behavior frequency and duration in this calculator?",
      answer:
        "Stress behaviors alone do not fully capture the impact on your cat; the duration of these behaviors is equally important. Frequent but brief stress episodes may be less concerning than fewer but prolonged episodes. This calculator integrates both frequency and duration to provide a more accurate assessment of your cat's stress, enabling better-informed decisions about care and intervention.",
    },
    {
      question: "Can this tool replace professional veterinary advice for stress management?",
      answer:
        "While this calculator offers valuable insights into your cat's stress levels and playtime needs, it is not a substitute for professional veterinary evaluation. Stress can have complex causes that require tailored medical or behavioral interventions. Always consult a veterinarian or a certified animal behaviorist if your cat exhibits persistent or severe stress symptoms.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="stressBehaviorsObserved" className="text-slate-700 dark:text-slate-300">
            Number of Stress Behaviors Observed (e.g., hiding, vocalizing)
          </Label>
          <Input
            id="stressBehaviorsObserved"
            name="stressBehaviorsObserved"
            type="number"
            min={0}
            step={1}
            value={inputs.stressBehaviorsObserved}
            onChange={handleChange}
            placeholder="e.g. 3"
            aria-describedby="stressBehaviorsHelp"
          />
          <p id="stressBehaviorsHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Count distinct stress behaviors you noticed today.
          </p>
        </div>

        <div>
          <Label htmlFor="durationStressBehaviors" className="text-slate-700 dark:text-slate-300">
            Total Duration of Stress Behaviors (hours)
          </Label>
          <Input
            id="durationStressBehaviors"
            name="durationStressBehaviors"
            type="number"
            min={0}
            step={0.1}
            value={inputs.durationStressBehaviors}
            onChange={handleChange}
            placeholder="e.g. 2.5"
            aria-describedby="durationStressHelp"
          />
          <p id="durationStressHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Estimate total hours your cat exhibited stress behaviors today.
          </p>
        </div>

        <div>
          <Label htmlFor="usualDailyPlaytime" className="text-slate-700 dark:text-slate-300">
            Usual Daily Playtime (hours)
          </Label>
          <Input
            id="usualDailyPlaytime"
            name="usualDailyPlaytime"
            type="number"
            min={0.1}
            step={0.1}
            value={inputs.usualDailyPlaytime}
            onChange={handleChange}
            placeholder="e.g. 1.5"
            aria-describedby="usualPlaytimeHelp"
          />
          <p id="usualPlaytimeHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Average hours of playtime your cat receives daily.
          </p>
        </div>

        <div>
          <Label htmlFor="desiredStressReduction" className="text-slate-700 dark:text-slate-300">
            Desired Stress Reduction (0 to 1 scale)
          </Label>
          <Input
            id="desiredStressReduction"
            name="desiredStressReduction"
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={inputs.desiredStressReduction}
            onChange={handleChange}
            placeholder="e.g. 0.3"
            aria-describedby="desiredReductionHelp"
          />
          <p id="desiredReductionHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the fraction of stress you want to reduce (e.g., 0.3 for 30%).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate Stress Score and Playtime Offset"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              stressBehaviorsObserved: "",
              durationStressBehaviors: "",
              usualDailyPlaytime: "",
              desiredStressReduction: "",
            })
          }
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Estimated Stress Score</p>
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Stress Score & Playtime Offset Planner (owner input)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cats exhibit a variety of stress-related behaviors such as hiding, excessive vocalization, or aggression, which can indicate underlying discomfort or anxiety. Quantifying these behaviors alongside their duration provides a measurable Stress Score that helps owners understand the severity of their cat’s stress. This score contextualizes behavioral observations relative to the cat’s normal routine, offering a clearer picture of wellbeing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Playtime is a critical component of feline mental and physical health, serving as a natural outlet for energy and stress relief. The Playtime Offset Planner uses the desired reduction in stress to calculate additional playtime needed to help mitigate stress levels effectively. By adjusting playtime based on this planner, owners can create a more enriching environment that supports their cat’s emotional balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool empowers cat owners with actionable insights, bridging observational data with practical interventions. It encourages proactive management of stress through tailored playtime adjustments, which can prevent escalation of stress-related health issues. Ultimately, it supports a holistic approach to feline care that prioritizes both behavioral understanding and environmental enrichment.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess your cat’s stress and plan corrective playtime, begin by carefully observing and counting distinct stress behaviors exhibited within a day. Estimate the total duration these behaviors last, then input your cat’s usual daily playtime to provide context. Finally, specify the fraction of stress reduction you aim to achieve, which guides the calculation of additional playtime needed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the number of distinct stress behaviors observed (e.g., hiding, vocalizing, aggression).
          </li>
          <li>
            <strong>Step 2:</strong> Input the total hours your cat spent exhibiting these stress behaviors during the day.
          </li>
          <li>
            <strong>Step 3:</strong> Provide your cat’s usual daily playtime in hours to contextualize stress relative to activity.
          </li>
          <li>
            <strong>Step 4:</strong> Specify your desired stress reduction as a decimal between 0 (no change) and 1 (complete elimination).
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to receive the Stress Score and recommended additional playtime offset.
          </li>
          <li>
            <strong>Step 6:</strong> Use the results to adjust your cat’s daily playtime and monitor changes in stress behaviors over time.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-sciences/behavioral-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. UC Davis Veterinary Behavior Medicine Program
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on feline stress behaviors, assessment, and behavioral modification strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6075692/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Feline Stress and Its Management: A Review (NCBI)
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing physiological and behavioral stress indicators in cats and intervention methods.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. ASPCA: Common Cat Behavior Issues
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidance on recognizing and managing stress-related behaviors in domestic cats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Stress Score & Playtime Offset Planner (owner input)"
      description="Tool to help owners assess their cat's stress levels and plan appropriate corrective playtime or environment changes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Stress Score = (Stress Behaviors Observed × Duration of Behaviors) ÷ Usual Daily Playtime",
        variables: [
          { symbol: "Stress Behaviors Observed", description: "Count of distinct stress behaviors noticed" },
          { symbol: "Duration of Behaviors", description: "Total hours stress behaviors were observed" },
          { symbol: "Usual Daily Playtime", description: "Average hours of daily playtime for the cat" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat owner notices 4 distinct stress behaviors lasting 3 hours total. The cat usually plays 2 hours daily. The owner wants to reduce stress by 50%.",
        steps: [
          { label: "1", explanation: "Calculate Stress Score: (4 × 3) ÷ 2 = 6" },
          { label: "2", explanation: "Calculate Playtime Offset: 0.5 × 2 = 1 hour additional playtime" },
          { label: "3", explanation: "Plan to increase daily playtime from 2 to 3 hours to reduce stress." },
        ],
        result: "Stress Score: 6; Recommended additional playtime: 1 hour",
      }}
      relatedCalculators={[
        { title: "Phenylbutazone / Flunixin Dose Calculator", url: "/pets/horse-phenylbutazone-flunixin-dose", icon: "🐾" },
        { title: "Lilies Poisoning Risk Guide (cats)", url: "/pets/cat-lilies-poisoning-risk-guide", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🐱" },
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "💉" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Cats", url: "/pets/cat-omega-3-epa-dha-supplement", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Stress Score & Playtime Offset Planner (owner input)" },
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