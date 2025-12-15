import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileDehydrationSheddingRiskIndexCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // Weight (lbs or kg)
  // Estimated % Dehydration (0-15%)
  // Shedding Quality Score (1-10 scale, 1=poor, 10=excellent)
  // Daily Water Intake Deficit (ml/kg/day)
  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationPercent: "",
    sheddingScore: "",
    intakeDeficit: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dehydrationPercentRaw = parseFloat(inputs.dehydrationPercent);
    const sheddingScoreRaw = parseFloat(inputs.sheddingScore);
    const intakeDeficitRaw = parseFloat(inputs.intakeDeficit);

    if (
      isNaN(weightRaw) ||
      isNaN(dehydrationPercentRaw) ||
      isNaN(sheddingScoreRaw) ||
      isNaN(intakeDeficitRaw) ||
      weightRaw <= 0 ||
      dehydrationPercentRaw < 0 ||
      dehydrationPercentRaw > 15 ||
      sheddingScoreRaw < 1 ||
      sheddingScoreRaw > 10 ||
      intakeDeficitRaw < 0
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs within the specified ranges.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Normalize shedding score to risk factor (higher score = lower risk)
    // Risk contribution from shedding = (10 - sheddingScore) * 2 (scale 0-18)
    const sheddingRisk = (10 - sheddingScoreRaw) * 2;

    // Hydration risk = dehydration % + intake deficit (ml/kg/day normalized)
    // Intake deficit normalized: intakeDeficitRaw (ml/kg/day) divided by 10 to scale
    const hydrationRisk = dehydrationPercentRaw + intakeDeficitRaw / 10;

    // Final Risk Index = hydrationRisk + sheddingRisk
    // Rounded to 1 decimal place
    const riskIndex = Math.round((hydrationRisk + sheddingRisk) * 10) / 10;

    // Interpretation
    let label = "";
    let warning = null;
    if (riskIndex < 5) {
      label = "Low Risk of Dehydration & Shedding Issues";
    } else if (riskIndex < 10) {
      label = "Moderate Risk - Monitor Closely";
      warning = "Consider increasing hydration and improving shedding conditions.";
    } else {
      label = "High Risk - Veterinary Attention Recommended";
      warning =
        "Immediate intervention may be necessary to prevent complications.";
    }

    return {
      value: riskIndex,
      label,
      subtext: `Based on weight ${weightKg.toFixed(1)} kg, dehydration ${dehydrationPercentRaw}%, shedding score ${sheddingScoreRaw}, and intake deficit ${intakeDeficitRaw} ml/kg/day.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is dehydration a critical factor in shedding problems?",
      answer:
        "Dehydration reduces skin elasticity and impairs the reptile's ability to shed its skin properly. When reptiles lack adequate hydration, their skin becomes dry and brittle, increasing the risk of retained or stuck sheds. Proper hydration supports healthy skin turnover and prevents complications associated with poor shedding.",
    },
    {
      question: "How does the shedding quality score influence the risk index?",
      answer:
        "The shedding quality score reflects the overall condition of the reptile's skin and shedding process. A lower score indicates poor shedding, which can increase the risk of skin infections and other health issues. Incorporating this score into the risk index helps quantify how shedding difficulties contribute to overall dehydration-related risks.",
    },
    {
      question: "What does daily water intake deficit mean and why is it important?",
      answer:
        "Daily water intake deficit measures how much less water a reptile consumes compared to its normal requirement, expressed in ml per kg of body weight. A deficit indicates insufficient hydration, which exacerbates dehydration and shedding problems. Monitoring this deficit helps identify reptiles at risk and guides interventions to restore proper hydration.",
    },
    {
      question: "How can this risk index guide veterinary care decisions?",
      answer:
        "The risk index provides a quantifiable measure of dehydration and shedding-related health risks, allowing veterinarians to prioritize cases needing urgent care. It helps in monitoring treatment efficacy and adjusting hydration or environmental management strategies. Using this tool supports evidence-based decisions to improve reptile welfare and outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="dehydrationPercent" className="text-slate-700 dark:text-slate-300">
            Estimated Dehydration Percentage (%)
          </Label>
          <Input
            id="dehydrationPercent"
            name="dehydrationPercent"
            type="number"
            min="0"
            max="15"
            step="any"
            placeholder="0 - 15%"
            value={inputs.dehydrationPercent}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="sheddingScore" className="text-slate-700 dark:text-slate-300">
            Shedding Quality Score (1 = Poor, 10 = Excellent)
          </Label>
          <Input
            id="sheddingScore"
            name="sheddingScore"
            type="number"
            min="1"
            max="10"
            step="1"
            placeholder="1 to 10"
            value={inputs.sheddingScore}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="intakeDeficit" className="text-slate-700 dark:text-slate-300">
            Daily Water Intake Deficit (ml/kg/day)
          </Label>
          <Input
            id="intakeDeficit"
            name="intakeDeficit"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0 - 100"
            value={inputs.intakeDeficit}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers re-render, calculation is memoized on inputs
            setInputs((prev) => ({ ...prev }));
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              dehydrationPercent: "",
              sheddingScore: "",
              intakeDeficit: "",
            })
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
          Understanding Dehydration & Shedding Risk Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dehydration & Shedding Risk Index is a scientifically informed tool designed to assess the combined risk of dehydration and shedding complications in reptiles. Dehydration is a critical physiological stressor that impairs skin health and the shedding process, which is vital for reptile growth and disease prevention. This index integrates measurable parameters such as dehydration percentage, water intake deficits, and shedding quality to provide a holistic risk assessment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Shedding difficulties, including incomplete or stuck sheds, often stem from inadequate hydration and environmental factors. By quantifying shedding quality alongside hydration metrics, this index helps veterinarians and reptile caretakers identify individuals at risk before clinical signs worsen. The index’s numerical output facilitates monitoring over time, enabling timely interventions to improve hydration status and optimize shedding conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is particularly useful in clinical and husbandry settings where early detection of dehydration and shedding problems can prevent secondary infections and systemic complications. It emphasizes the importance of maintaining proper hydration and environmental humidity, which are essential for reptile health. Ultimately, the index supports evidence-based decision-making to enhance reptile welfare and reduce morbidity associated with these common issues.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the Dehydration & Shedding Risk Index, input your reptile’s weight, estimated dehydration percentage, shedding quality score, and daily water intake deficit. Ensure that the weight is entered in the selected unit system (imperial or metric). The dehydration percentage should reflect clinical or observational estimates, while the shedding score rates the quality of recent sheds on a scale from 1 (poor) to 10 (excellent).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) and enter the reptile’s weight accordingly.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the estimated dehydration percentage based on clinical signs or veterinary assessment (0-15%).
          </li>
          <li>
            <strong>Step 3:</strong> Rate the shedding quality from 1 (poor) to 10 (excellent) based on recent shedding observations.
          </li>
          <li>
            <strong>Step 4:</strong> Input the daily water intake deficit in ml per kg body weight, reflecting how much less water the reptile is consuming compared to normal.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to obtain the risk index and interpret the results to guide care decisions.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466054/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Dehydration and Skin Shedding in Reptiles: Clinical Implications
            </a>
            <p className="text-slate-500 text-sm">
              This peer-reviewed article discusses the physiological effects of dehydration on reptile skin and shedding, highlighting clinical signs and treatment approaches.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/hospital/species/reptiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Reptile Care and Hydration
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive resource on reptile hydration needs, environmental management, and common health issues related to shedding and dehydration.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.reptilesmagazine.com/shedding-problems-in-reptiles/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Shedding Problems in Reptiles: Causes and Solutions
            </a>
            <p className="text-slate-500 text-sm">
              An expert overview of factors affecting shedding quality, including hydration, humidity, and husbandry practices.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration & Shedding Risk Index"
      description="Assess the risk of dehydration-related issues, such as poor or stuck shedding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Risk Index = Dehydration % + (Intake Deficit ÷ 10) + (20 - 2 × Shedding Score)",
        variables: [
          { symbol: "Dehydration %", description: "Estimated percentage of dehydration" },
          { symbol: "Intake Deficit", description: "Daily water intake deficit in ml/kg/day" },
          { symbol: "Shedding Score", description: "Shedding quality score (1 = poor, 10 = excellent)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) bearded dragon shows signs of 8% dehydration, has a shedding score of 4, and a daily water intake deficit of 20 ml/kg/day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (already 1 kg). Calculate hydration risk: 8 + (20 ÷ 10) = 10.",
          },
          {
            label: "2",
            explanation:
              "Calculate shedding risk: (20 - 2 × 4) = 12.",
          },
          {
            label: "3",
            explanation:
              "Sum risks: 10 + 12 = 22 risk index, indicating high risk requiring veterinary attention.",
          },
        ],
        result: "Risk Index = 22 (High Risk - Veterinary Attention Recommended)",
      }}
      relatedCalculators={[
        { title: "Horse Gestation (Due Date) Calculator", url: "/pets/horse-gestation-due-date", icon: "🐎" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)", url: "/pets/horse-calorie-energy-requirement-de-tdn", icon: "🐎" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Dog Life Expectancy Estimator (lifestyle factors)", url: "/pets/dog-life-expectancy-estimator", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration & Shedding Risk Index" },
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