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
      question: "Why is monitoring appetite important for senior cats?",
      answer:
        "Appetite is a critical indicator of a senior cat's overall health and well-being. Changes in eating habits can signal underlying medical conditions such as dental disease, kidney issues, or gastrointestinal problems. Regularly assessing appetite helps owners and veterinarians detect early signs of illness and intervene promptly to maintain optimal health.",
    },
    {
      question: "How does mobility affect a senior cat's quality of life?",
      answer:
        "Mobility reflects a cat's ability to move comfortably and safely within its environment. Declines in mobility may result from arthritis, muscle weakness, or neurological disorders common in aging cats. Supporting mobility through environmental modifications and veterinary care can significantly enhance a senior cat's independence and happiness.",
    },
    {
      question: "What role does hydration play in senior cat health?",
      answer:
        "Proper hydration is essential for maintaining kidney function, digestion, and overall cellular health in senior cats. Older cats are prone to dehydration due to decreased thirst response and potential kidney disease. Monitoring hydration status and encouraging water intake can prevent complications and support longevity.",
    },
    {
      question: "Why is medication adherence crucial for senior cats?",
      answer:
        "Many senior cats require medications to manage chronic conditions such as diabetes, hyperthyroidism, or arthritis. Consistent medication adherence ensures therapeutic effectiveness and prevents disease progression. Owners should establish routines and communicate with veterinarians to optimize treatment outcomes and maintain quality of life.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Senior Cat Care Readiness Checklist (scored helper)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Senior Cat Care Readiness Checklist is a comprehensive tool designed to evaluate the preparedness of cat owners in providing optimal care for their aging feline companions. As cats enter their senior years, typically around 7-10 years of age, their health and lifestyle needs evolve significantly. This checklist assesses critical factors such as appetite, mobility, hydration, and environmental safety to help identify areas requiring attention or improvement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By scoring each aspect of your cat’s daily habits and health indicators, this tool provides a quantified readiness score that reflects how well you are equipped to manage the unique challenges of senior cat care. It emphasizes proactive monitoring and encourages early intervention, which is essential for preventing common age-related diseases and maintaining quality of life. The checklist also highlights the importance of medication adherence and behavioral observations, which are often overlooked but vital components of senior feline wellness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Ultimately, this scored helper serves as an educational guide and a practical self-assessment for cat owners, fostering a deeper understanding of their pet’s needs. It complements regular veterinary visits by empowering owners to recognize subtle changes and take timely action. Using this checklist consistently can lead to improved health outcomes, enhanced comfort, and a stronger bond between you and your senior cat.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to be straightforward and user-friendly, allowing you to assess your senior cat’s readiness for specialized care by answering a series of simple yes/no questions. Each question corresponds to a key aspect of senior cat health and environment. Your responses are scored to provide an overall readiness score that highlights strengths and potential areas for improvement in your cat’s care routine.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Carefully read each question and select “Yes” or “No” based on your cat’s current condition or your caregiving practices.
          </li>
          <li>
            <strong>Step 2:</strong> Once all questions are answered, click the “Calculate” button to generate your readiness score.
          </li>
          <li>
            <strong>Step 3:</strong> Review the score and accompanying feedback to understand your cat’s care status and identify any areas needing attention.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to guide discussions with your veterinarian and to make informed decisions about adjustments in diet, environment, or medical care.
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
              href="https://www.vin.com/vetzinsight/default.aspx?pid=19239&id=8811799"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Senior Cats: Health and Care Guidelines - VIN
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary insights on managing health challenges in senior cats, including nutrition, mobility, and chronic disease management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/canine-older-pet-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. AAHA Senior Care Guidelines for Cats and Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines from the American Animal Hospital Association outlining best practices for senior pet care, emphasizing early detection and intervention.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/senior-cat-care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Senior Cat Care - VCA Hospitals
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on recognizing age-related changes in cats and tips for maintaining health and comfort during their senior years.
            </p>
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
