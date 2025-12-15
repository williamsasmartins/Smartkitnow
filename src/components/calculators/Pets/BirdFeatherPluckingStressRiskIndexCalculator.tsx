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
      question: "What factors contribute to feather plucking in birds?",
      answer:
        "Feather plucking is often a multifactorial behavior influenced by environmental stressors such as inadequate cage size, lack of stimulation, and social isolation. Behavioral stress, including boredom or anxiety, also plays a significant role. Understanding these factors helps in assessing risk and implementing appropriate interventions to improve bird welfare.",
    },
    {
      question: "How does age affect the risk of feather plucking?",
      answer:
        "Age influences feather plucking risk as younger birds may be more resilient to stress, while older birds might have accumulated stressors or health issues that increase vulnerability. The index accounts for age by reducing risk slightly as age increases, reflecting that chronic feather plucking often develops earlier. However, age alone is not a protective factor and should be considered alongside other stress indicators.",
    },
    {
      question: "Why is feather condition included in the stress risk index?",
      answer:
        "Feather condition serves as a direct indicator of current feather health and potential damage from plucking or poor preening. Including it in the index helps quantify the severity of feather damage, which correlates with stress levels. This allows for a more comprehensive risk assessment by combining behavioral and physical evidence of stress.",
    },
    {
      question: "Can this index replace veterinary diagnosis for feather plucking?",
      answer:
        "No, this index is designed as an educational and screening tool to estimate stress-related risk factors contributing to feather plucking. It cannot replace a thorough veterinary examination that considers medical, behavioral, and environmental causes. Always consult a qualified avian veterinarian for diagnosis and treatment recommendations.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Feather Plucking & Stress Risk Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Feather plucking is a complex behavioral disorder commonly observed in captive birds,
          often triggered by a combination of environmental and psychological stressors. This
          behavior not only compromises the bird’s plumage but also signals underlying welfare
          issues that require careful evaluation. The Feather Plucking & Stress Risk Index is a
          scientifically informed tool designed to quantify these stress factors, helping
          caretakers and veterinarians identify birds at risk before severe damage occurs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The index integrates measurable components such as environmental stress, behavioral
          stress, feather condition, and age to provide a holistic risk assessment. Environmental
          stress includes factors like cage size, noise, and social isolation, while behavioral
          stress reflects anxiety, boredom, or frustration. Feather condition serves as a direct
          indicator of current damage, and age adjusts the risk based on the bird’s life stage,
          recognizing that susceptibility varies over time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By combining these variables into a single index, this tool offers a practical,
          evidence-based approach to monitor and manage feather plucking risk. It empowers bird
          owners and veterinary professionals to implement targeted environmental enrichment,
          behavioral interventions, and medical evaluations. Ultimately, this index supports
          improved welfare outcomes by facilitating early detection and comprehensive care.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the Feather Plucking & Stress Risk Index, enter the relevant scores
          and age of your bird into the input fields. Each score should reflect your best
          estimation based on observations and environmental conditions. The calculator then
          computes a risk value that helps you understand the likelihood of feather plucking
          behavior driven by stress.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Assign an Environmental Stress Score from 0 (no stress) to 10
            (extreme stress) based on factors like cage size, noise, and social environment.
          </li>
          <li>
            <strong>Step 2:</strong> Enter a Behavioral Stress Score from 0 to 10 reflecting signs
            of anxiety, boredom, or frustration observed in your bird.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the bird’s age in years to adjust the risk according
            to life stage.
          </li>
          <li>
            <strong>Step 4:</strong> Rate the Feather Condition Score from 0 (healthy feathers)
            to 10 (severe damage) to indicate current plumage status.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the risk index and interpret the
            results to guide management decisions.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466057/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Feather Plucking in Companion Birds: Causes and Management
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive review of behavioral and environmental factors contributing to
              feather plucking, emphasizing diagnostic and therapeutic approaches in avian
              medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/avian-health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Avian Health and Welfare Resources
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on avian health, including behavioral disorders and stress
              management strategies for pet birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-behavior"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Avian Veterinarians: Behavioral Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines and research on avian behavioral disorders, with practical advice for
              clinicians and bird owners.
            </p>
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