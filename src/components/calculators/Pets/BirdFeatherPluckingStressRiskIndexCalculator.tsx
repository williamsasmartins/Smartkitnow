import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdFeatherPluckingStressRiskIndexCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // Environmental Stress Score (0-10)
  // Behavioral Stress Score (0-10)
  // Feather Condition Score (0-10)
  // Duration of Stress Exposure (days)
  const [inputs, setInputs] = useState({
    environmentalStress: "",
    behavioralStress: "",
    featherCondition: "",
    stressDuration: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Stress Risk Index = (Environmental Stress + Behavioral Stress + (10 - Feather Condition)) * log10(Duration + 1)
  // Explanation: Feather condition is inverted because lower scores indicate worse condition.
  const results = useMemo(() => {
    const env = parseFloat(inputs.environmentalStress);
    const beh = parseFloat(inputs.behavioralStress);
    const feat = parseFloat(inputs.featherCondition);
    const dur = parseFloat(inputs.stressDuration);

    if (
      isNaN(env) || env < 0 || env > 10 ||
      isNaN(beh) || beh < 0 || beh > 10 ||
      isNaN(feat) || feat < 0 || feat > 10 ||
      isNaN(dur) || dur < 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid values within the specified ranges.",
        warning: "All scores must be between 0 and 10, and duration cannot be negative.",
      };
    }

    // Calculate index
    const featherDeficit = 10 - feat; // worse feather condition increases risk
    const baseScore = env + beh + featherDeficit;
    const durationFactor = Math.log10(dur + 1); // log scale to moderate long durations

    const index = +(baseScore * durationFactor).toFixed(2);

    // Interpretation
    let label = "";
    let warning = null;
    if (index < 5) {
      label = "Low Stress Risk";
    } else if (index < 15) {
      label = "Moderate Stress Risk";
      warning = "Monitor bird behavior closely and consider environmental enrichment.";
    } else {
      label = "High Stress Risk";
      warning = "Immediate veterinary consultation recommended to prevent feather plucking.";
    }

    return {
      value: index,
      label,
      subtext: "Higher values indicate greater risk of feather plucking due to stress.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What causes feather plucking in birds?",
      answer:
        "Feather plucking is often a behavioral response to chronic stress, environmental inadequacies, or medical issues. Birds may pluck feathers due to boredom, anxiety, or discomfort caused by poor cage conditions or social isolation. Understanding these causes helps in addressing the root problem rather than just the symptom.",
    },
    {
      question: "How does stress contribute to feather plucking?",
      answer:
        "Stress triggers physiological and psychological changes in birds that can manifest as feather plucking. Elevated stress hormones can cause discomfort and compulsive behaviors, leading to self-damage. Reducing stressors and improving environmental enrichment are essential steps to mitigate this behavior.",
    },
    {
      question: "Why is feather condition included in the risk index?",
      answer:
        "Feather condition reflects the current physical state of the bird’s plumage, which is a direct indicator of stress and health. Poor feather condition often precedes or accompanies plucking behavior and signals underlying issues. Including it in the index provides a more comprehensive risk assessment.",
    },
    {
      question: "How can I use the stress duration input effectively?",
      answer:
        "The duration of stress exposure helps quantify how long the bird has been subjected to adverse conditions, which influences the risk severity. Longer exposure typically increases the likelihood of feather plucking developing or worsening. Accurately estimating this duration improves the predictive value of the index.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="environmentalStress" className="text-slate-700 dark:text-slate-300">
            Environmental Stress Score (0-10)
          </Label>
          <Input
            id="environmentalStress"
            name="environmentalStress"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={inputs.environmentalStress}
            onChange={handleChange}
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <Label htmlFor="behavioralStress" className="text-slate-700 dark:text-slate-300">
            Behavioral Stress Score (0-10)
          </Label>
          <Input
            id="behavioralStress"
            name="behavioralStress"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={inputs.behavioralStress}
            onChange={handleChange}
            placeholder="e.g. 4"
          />
        </div>
        <div>
          <Label htmlFor="featherCondition" className="text-slate-700 dark:text-slate-300">
            Feather Condition Score (0-10)
          </Label>
          <Input
            id="featherCondition"
            name="featherCondition"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={inputs.featherCondition}
            onChange={handleChange}
            placeholder="e.g. 7"
          />
        </div>
        <div>
          <Label htmlFor="stressDuration" className="text-slate-700 dark:text-slate-300">
            Duration of Stress Exposure (days)
          </Label>
          <Input
            id="stressDuration"
            name="stressDuration"
            type="number"
            min={0}
            step={1}
            value={inputs.stressDuration}
            onChange={handleChange}
            placeholder="e.g. 30"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              environmentalStress: "",
              behavioralStress: "",
              featherCondition: "",
              stressDuration: "",
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Feather Plucking & Stress Risk Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Feather plucking is a complex behavioral disorder commonly observed in captive birds, often linked to chronic stress and environmental inadequacies. This index aims to quantify the combined effects of environmental and behavioral stressors alongside the physical condition of the bird’s feathers to provide a comprehensive risk assessment. By integrating these factors, veterinarians and bird owners can better understand the underlying causes and severity of feather plucking tendencies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Environmental stressors such as inadequate cage size, poor lighting, and lack of social interaction significantly contribute to a bird’s stress levels. Behavioral stress, including anxiety or repetitive behaviors, further exacerbates the risk. Feather condition serves as a direct physical indicator of stress and damage, reflecting both the bird’s health and the severity of plucking behavior. The duration of stress exposure is also critical, as prolonged stress increases the likelihood of chronic feather plucking.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This index is designed as a practical tool to assist in early detection and intervention, enabling timely environmental enrichment and veterinary care. It emphasizes a holistic approach by combining subjective scoring with objective duration metrics, ensuring a nuanced understanding of each bird’s unique situation. Ultimately, this tool supports improved welfare outcomes by guiding targeted strategies to reduce stress and prevent feather plucking.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, input the scores for environmental stress, behavioral stress, feather condition, and the duration of stress exposure in days. Each score should be between 0 and 10, where higher values for stress indicate greater severity, and for feather condition, higher values indicate better plumage health. The calculator then computes a composite risk index that reflects the bird’s likelihood of developing or worsening feather plucking behavior.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Assess and enter the Environmental Stress Score based on factors like cage size, lighting, and social environment.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the Behavioral Stress Score by evaluating anxiety, repetitive behaviors, or signs of distress.
          </li>
          <li>
            <strong>Step 3:</strong> Score the Feather Condition by examining the bird’s plumage for damage, missing feathers, or poor quality.
          </li>
          <li>
            <strong>Step 4:</strong> Input the Duration of Stress Exposure in days to reflect how long the bird has been under these conditions.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to obtain the Feather Plucking & Stress Risk Index and interpret the results to guide care decisions.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466047/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Van Zeeland, Y. R. A., et al. (2019). Feather Plucking in Companion Birds: A Review on Its Causes and Treatment. Frontiers in Veterinary Science.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of behavioral and environmental causes of feather plucking and evidence-based treatment approaches.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S016815911930186X"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Garner, J. P. (2019). Feather Plucking in Birds: Behavioral and Physiological Perspectives. Applied Animal Behaviour Science.
            </a>
            <p className="text-slate-500 text-sm">
              Explores the physiological stress responses linked to feather plucking and the importance of environmental enrichment.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avianbehavior"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians – Behavioral Medicine Resources.
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on diagnosing and managing behavioral disorders including feather plucking in birds.
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
        formula: "Stress Risk Index = (Environmental Stress + Behavioral Stress + (10 - Feather Condition)) × log₁₀(Duration + 1)",
        variables: [
          { symbol: "Environmental Stress", description: "Score from 0 (none) to 10 (severe) environmental stressors" },
          { symbol: "Behavioral Stress", description: "Score from 0 (none) to 10 (severe) behavioral stress" },
          { symbol: "Feather Condition", description: "Score from 0 (poor) to 10 (excellent) feather quality" },
          { symbol: "Duration", description: "Duration of stress exposure in days" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parrot living in a small cage with limited social interaction shows moderate behavioral stress and poor feather condition after 30 days of exposure.",
        steps: [
          { label: "1", explanation: "Environmental Stress Score = 6 (due to cage size and lighting)" },
          { label: "2", explanation: "Behavioral Stress Score = 5 (anxiety and repetitive movements)" },
          { label: "3", explanation: "Feather Condition Score = 4 (damaged and missing feathers)" },
          { label: "4", explanation: "Duration = 30 days" },
          {
            label: "5",
            explanation:
              "Calculate index: (6 + 5 + (10 - 4)) × log₁₀(30 + 1) = (6 + 5 + 6) × 1.491 = 17 × 1.491 = 25.35 (High Stress Risk)",
          },
        ],
        result: "The bird is at high risk of feather plucking and requires immediate intervention.",
      }}
      relatedCalculators={[
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🐾" },
        { title: "Calcium Supplement Dosage (Breeding Females)", url: "/pets/bird-calcium-supplement-dosage-breeding-females", icon: "🐶" },
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🐱" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "🍖" },
        { title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)", url: "/pets/bird-toxic-foods-exposure-checker", icon: "💉" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
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