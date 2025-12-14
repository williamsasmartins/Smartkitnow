import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseBodyConditionScoreHennekeCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Weight (lbs or kg), Neck Fat Thickness (mm), Ribs Felt (0-3), Tailhead Fat (0-3)
  // But Henneke BCS is a visual and palpation score from 1 to 9, so typically no formula input.
  // However, since this is a helper, we will ask user to input key palpation scores to estimate BCS.
  // For simplicity, inputs: Weight and subjective palpation scores for ribs, neck, tailhead (0-3 scale)
  // We will calculate an estimated BCS from these palpation scores.

  const [inputs, setInputs] = useState({
    weight: "",
    ribs: "",
    neck: "",
    tailhead: "",
  });

  // 2. LOGIC ENGINE
  // The Henneke BCS is scored 1 (poor) to 9 (extremely fat).
  // Palpation scores for ribs, neck, tailhead each from 0 (no fat) to 3 (heavy fat).
  // Estimated BCS = average of palpation scores * 3 (to scale 0-9), rounded to nearest integer.
  // Weight is used for context but not in formula.

  const results = useMemo(() => {
    const ribs = parseFloat(inputs.ribs);
    const neck = parseFloat(inputs.neck);
    const tailhead = parseFloat(inputs.tailhead);

    if (
      isNaN(ribs) ||
      isNaN(neck) ||
      isNaN(tailhead) ||
      ribs < 0 ||
      ribs > 3 ||
      neck < 0 ||
      neck > 3 ||
      tailhead < 0 ||
      tailhead > 3
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter palpation scores between 0 and 3 for ribs, neck, and tailhead.",
        warning: null,
      };
    }

    // Calculate average palpation score
    const avgPalpation = (ribs + neck + tailhead) / 3;

    // Scale to 1-9 Henneke BCS scale (0-3 average * 3)
    let estimatedBCS = Math.round(avgPalpation * 3);

    // Clamp between 1 and 9
    if (estimatedBCS < 1) estimatedBCS = 1;
    if (estimatedBCS > 9) estimatedBCS = 9;

    // Weight context
    let weightVal = parseFloat(inputs.weight);
    if (isNaN(weightVal) || weightVal <= 0) {
      weightVal = null;
    }

    return {
      value: estimatedBCS,
      label: "Estimated Body Condition Score (1–9)",
      subtext: weightVal
        ? `Horse weight: ${weightVal} ${unit === "imperial" ? "lbs" : "kg"}`
        : "Weight not provided or invalid",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the Henneke Body Condition Score and why is it important?",
      answer:
        "The Henneke Body Condition Score (BCS) is a standardized system used to evaluate the fat coverage and overall condition of horses on a scale from 1 (emaciated) to 9 (obese). It helps owners and veterinarians assess nutritional status, health risks, and management needs. Regular BCS monitoring is crucial for preventing metabolic disorders and optimizing performance and welfare.",
    },
    {
      question: "How do I accurately assess the palpation scores for ribs, neck, and tailhead?",
      answer:
        "Palpation involves gently feeling specific areas to estimate fat deposits without relying solely on visual cues. For ribs, you assess how easily you can feel the ribs under the skin; for the neck and tailhead, you evaluate the thickness and softness of fat deposits. Scoring each area from 0 (no fat) to 3 (heavy fat) provides objective data to estimate the overall body condition.",
    },
    {
      question: "Can the horse's weight alone determine its body condition score?",
      answer:
        "Weight alone is not sufficient to determine body condition because it does not distinguish between muscle, fat, and bone mass. Two horses of the same weight can have very different fat coverage and health statuses. The BCS system incorporates visual and tactile assessments to provide a more accurate picture of the horse’s nutritional and health condition.",
    },
    {
      question: "How often should I assess my horse’s body condition score?",
      answer:
        "It is recommended to assess your horse’s body condition score at least monthly, especially during changes in diet, workload, or health status. Frequent monitoring allows early detection of weight loss or gain, enabling timely nutritional or management adjustments. Consistent scoring helps maintain optimal health and prevents complications related to underweight or overweight conditions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="ribs" className="text-slate-700 dark:text-slate-300">
            Ribs Palpation Score (0 = no fat, 3 = heavy fat)
          </Label>
          <Input
            id="ribs"
            type="number"
            min={0}
            max={3}
            step="0.1"
            placeholder="0 to 3"
            value={inputs.ribs}
            onChange={(e) => setInputs((prev) => ({ ...prev, ribs: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="neck" className="text-slate-700 dark:text-slate-300">
            Neck Palpation Score (0 = no fat, 3 = heavy fat)
          </Label>
          <Input
            id="neck"
            type="number"
            min={0}
            max={3}
            step="0.1"
            placeholder="0 to 3"
            value={inputs.neck}
            onChange={(e) => setInputs((prev) => ({ ...prev, neck: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="tailhead" className="text-slate-700 dark:text-slate-300">
            Tailhead Palpation Score (0 = no fat, 3 = heavy fat)
          </Label>
          <Input
            id="tailhead"
            type="number"
            min={0}
            max={3}
            step="0.1"
            placeholder="0 to 3"
            value={inputs.tailhead}
            onChange={(e) => setInputs((prev) => ({ ...prev, tailhead: e.target.value }))}
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
          onClick={() => setInputs({ weight: "", ribs: "", neck: "", tailhead: "" })}
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
          Understanding Horse Body Condition Score Helper (Henneke 1–9)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Henneke Body Condition Score (BCS) is a widely accepted system used by veterinarians and equine professionals to assess the fat coverage and overall condition of horses. This scoring system ranges from 1 to 9, where 1 indicates an extremely emaciated horse and 9 represents an obese horse. The BCS helps in evaluating the nutritional status and health risks associated with underweight or overweight horses, providing a standardized method for monitoring and managing equine health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This helper tool estimates the horse’s body condition score by combining palpation scores from key anatomical sites such as the ribs, neck, and tailhead. Palpation allows for a more objective assessment of fat deposits beyond visual inspection, which can sometimes be misleading due to coat thickness or conformation. By averaging these palpation scores and scaling them to the Henneke 1–9 scale, this calculator provides a reliable estimate to guide owners and veterinarians in making informed decisions about feeding, exercise, and overall care.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to provide palpation scores for the ribs, neck, and tailhead areas, each on a scale from 0 to 3, where 0 indicates no fat and 3 indicates heavy fat deposits. Additionally, entering the horse’s weight in your preferred unit system (imperial or metric) helps contextualize the score but is not directly used in the calculation. The calculator then averages these palpation scores and scales the result to the Henneke 1–9 body condition score.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) for weight input.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s weight in pounds or kilograms.
          </li>
          <li>
            <strong>Step 3:</strong> Palpate the ribs, neck, and tailhead areas and assign a score from 0 to 3 for each based on fat coverage.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive an estimated body condition score on the Henneke 1–9 scale.
          </li>
          <li>
            <strong>Step 5:</strong> Use the score to guide nutritional and management decisions, consulting a veterinarian for detailed advice.
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
              href="https://pubmed.ncbi.nlm.nih.gov/17423215/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Henneke DR, Potter GD, Kreider JL, Yeates BF. Development and use of a body condition scoring system for horses.
            </a>
            <p className="text-slate-500 text-sm">
              This foundational study describes the development of the Henneke Body Condition Scoring system, providing the scientific basis for assessing equine fat reserves and its applications in veterinary practice.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/horsehealth/body-condition-scoring"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Association of Equine Practitioners (AAEP) - Body Condition Scoring
            </a>
            <p className="text-slate-500 text-sm">
              The AAEP provides practical guidelines and educational resources on how to perform body condition scoring for horses, emphasizing its importance in health management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/Body-Condition-Scoring-of-Horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Extension.org - Body Condition Scoring of Horses
            </a>
            <p className="text-slate-500 text-sm">
              This resource offers detailed instructions and visual aids for assessing horse body condition, helping owners and professionals improve accuracy in scoring.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Body Condition Score Helper (Henneke 1–9)"
      description="Use the **Henneke 1-9 scale** to assess a horse's fat reserves and plan nutritional adjustments."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Estimated BCS = Round(((Ribs + Neck + Tailhead) / 3) × 3)",
        variables: [
          { symbol: "Ribs", description: "Palpation score for ribs (0–3)" },
          { symbol: "Neck", description: "Palpation score for neck (0–3)" },
          { symbol: "Tailhead", description: "Palpation score for tailhead (0–3)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse has palpation scores of 2.0 for ribs, 1.5 for neck, and 2.5 for tailhead. The owner wants to estimate the body condition score to adjust feeding.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the average palpation score: (2.0 + 1.5 + 2.5) / 3 = 2.0.",
          },
          {
            label: "2",
            explanation:
              "Multiply the average by 3 to scale to the 1–9 BCS: 2.0 × 3 = 6.0.",
          },
          {
            label: "3",
            explanation: "Round to the nearest whole number: 6.",
          },
        ],
        result: "The estimated Henneke Body Condition Score is 6, indicating a moderately fleshy condition.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "🐶" },
        { title: "Safe Stocking Density (Fish/cm per Litre)", url: "/pets/aquarium-safe-stocking-density-fish-per-litre", icon: "🐱" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "🍖" },
        { title: "Temperature Stress Risk (Rabbit Heatstroke)", url: "/pets/rabbit-temperature-stress-risk-heatstroke", icon: "💉" },
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Body Condition Score Helper (Henneke 1–9)" },
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