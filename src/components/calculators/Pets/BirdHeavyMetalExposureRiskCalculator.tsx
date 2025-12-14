import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdHeavyMetalExposureRiskCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Weight (bird), Exposure Duration (days), Lead/Zinc Concentration (mg/kg in environment)
  const [inputs, setInputs] = useState({
    weight: "",
    exposureDuration: "",
    metalConcentration: "",
  });

  // 2. LOGIC ENGINE
  // Formula basis:
  // Risk Score = (Metal Concentration mg/kg) × Exposure Duration (days) / Weight (kg)
  // Higher score indicates higher risk of toxicity.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const exposureDurationRaw = parseFloat(inputs.exposureDuration);
    const metalConcentrationRaw = parseFloat(inputs.metalConcentration);

    if (
      isNaN(weightRaw) ||
      isNaN(exposureDurationRaw) ||
      isNaN(metalConcentrationRaw) ||
      weightRaw <= 0 ||
      exposureDurationRaw <= 0 ||
      metalConcentrationRaw <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for all inputs.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate risk score
    const riskScore = (metalConcentrationRaw * exposureDurationRaw) / weightKg;

    // Interpret risk level
    let label = "";
    let warning = null;
    if (riskScore < 50) {
      label = "Low risk of heavy metal toxicity.";
    } else if (riskScore < 150) {
      label = "Moderate risk of heavy metal toxicity. Monitor closely.";
      warning =
        "Exposure levels may cause subclinical effects; veterinary consultation recommended.";
    } else {
      label = "High risk of heavy metal toxicity!";
      warning =
        "Immediate veterinary intervention advised due to potential severe poisoning.";
    }

    return {
      value: riskScore.toFixed(1),
      label,
      subtext: "Risk Score (unitless index)",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What are the common sources of lead and zinc exposure in birds?",
      answer:
        "Birds can be exposed to lead and zinc through ingestion or inhalation of contaminated materials such as old paint chips, galvanized cages, toys, or environmental dust. These metals accumulate in the body over time, causing toxicity. Understanding these sources helps in preventing exposure and safeguarding avian health.",
    },
    {
      question: "How does body weight influence heavy metal toxicity risk in birds?",
      answer:
        "Body weight is a critical factor because toxicity depends on the dose relative to the bird’s size. Smaller birds have less capacity to tolerate heavy metals, so the same exposure level can cause more severe effects. This is why the risk calculation normalizes exposure by weight to assess potential harm accurately.",
    },
    {
      question: "Why is exposure duration important in assessing heavy metal risk?",
      answer:
        "Heavy metals like lead and zinc accumulate in tissues over time, so longer exposure increases the total body burden. Acute high-level exposure can cause immediate symptoms, but chronic low-level exposure often leads to gradual toxicity. Assessing duration helps predict the cumulative risk and need for intervention.",
    },
    {
      question: "Can this calculator replace veterinary diagnosis and treatment?",
      answer:
        "No, this tool is designed for educational and preliminary risk assessment only. Heavy metal poisoning symptoms can be complex and require professional diagnostic tests and treatment plans. Always consult a qualified avian veterinarian for accurate diagnosis and appropriate care.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
            Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 0.5" : "e.g. 0.23"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="exposureDuration" className="text-slate-700 dark:text-slate-300">
            Exposure Duration (days)
          </Label>
          <Input
            id="exposureDuration"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 14"
            value={inputs.exposureDuration}
            onChange={(e) => setInputs((prev) => ({ ...prev, exposureDuration: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="metalConcentration" className="text-slate-700 dark:text-slate-300">
            Lead/Zinc Concentration in Environment (mg/kg)
          </Label>
          <Input
            id="metalConcentration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.metalConcentration}
            onChange={(e) => setInputs((prev) => ({ ...prev, metalConcentration: e.target.value }))}
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
          onClick={() => setInputs({ weight: "", exposureDuration: "", metalConcentration: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Heavy Metal (Lead/Zinc) Exposure Risk
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Heavy metal exposure, particularly to lead and zinc, poses a significant health risk to birds due to their unique physiology and sensitivity. These metals can accumulate in avian tissues, leading to toxic effects that impair neurological, gastrointestinal, and renal functions. Birds often encounter these metals through contaminated cages, toys, or environmental sources, making awareness and prevention critical in avian care.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The risk of toxicity depends on several factors including the concentration of the metal in the environment, the duration of exposure, and the bird’s body weight. Smaller birds are especially vulnerable as their metabolic rate and body mass amplify the toxic effects. Chronic exposure can result in subtle clinical signs that progress to severe illness if not identified early, emphasizing the importance of risk assessment tools.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Veterinary intervention often requires a thorough history, clinical examination, and diagnostic testing to confirm heavy metal poisoning. Treatment may involve chelation therapy, supportive care, and removal from the source of exposure. This calculator aims to provide an initial estimate of exposure risk to guide owners and clinicians in recognizing potential toxicity and taking timely action.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the risk of heavy metal toxicity in birds based on three key inputs: the bird’s weight, the duration of exposure to lead or zinc, and the concentration of these metals in the bird’s environment. By normalizing exposure relative to body weight, it provides a risk score that helps identify low, moderate, or high toxicity risk levels.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the bird’s weight in pounds or kilograms depending on the selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Input the duration of exposure in days, reflecting how long the bird has been in contact with the contaminated source.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the estimated concentration of lead or zinc in the environment, measured in milligrams per kilogram (mg/kg).
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive a risk score and interpretation to guide further action.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7152379/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Lead Toxicity in Birds: Clinical and Diagnostic Aspects
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive review of lead poisoning in avian species, including sources, clinical signs, and treatment protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S0378113519302559"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Zinc Toxicity in Birds: Environmental and Clinical Perspectives
            </a>
            <p className="text-slate-500 text-sm">
              Discusses zinc exposure risks, toxicokinetics, and veterinary management strategies in avian patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/lead-poisoning/lead-poisoning-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Lead Poisoning in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary resource detailing diagnosis, clinical signs, and treatment of lead poisoning in birds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Heavy Metal (Lead/Zinc) Exposure Risk"
      description="Assess the risk of poisoning from exposure to heavy metals like **lead or zinc** (e.g., from cages or toys)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = (Metal Concentration × Exposure Duration) ÷ Bird Weight",
        variables: [
          { symbol: "Metal Concentration", description: "Lead/Zinc concentration in mg/kg" },
          { symbol: "Exposure Duration", description: "Duration of exposure in days" },
          { symbol: "Bird Weight", description: "Weight of the bird in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 0.5 lb parakeet has been exposed to a zinc-contaminated cage environment with 120 mg/kg zinc concentration for 10 days.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 0.5 lbs ÷ 2.20462 = 0.227 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk score: (120 mg/kg × 10 days) ÷ 0.227 kg = 5286.3 (unitless risk index).",
          },
          {
            label: "3",
            explanation:
              "Interpretation: This high score indicates a severe risk of zinc toxicity requiring urgent veterinary care.",
          },
        ],
        result: "Risk Score: 5286.3 — High risk of heavy metal toxicity.",
      }}
      relatedCalculators={[
        { title: "Dog Grape/Raisin Exposure Risk Calculator", url: "/pets/dog-grape-raisin-exposure-risk", icon: "🐶" },
        { title: "Ammonia-to-Nitrite Cycle Time Estimator", url: "/pets/aquarium-ammonia-nitrite-cycle-time", icon: "🐶" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Prednisolone Dose Calculator for Cats", url: "/pets/cat-prednisolone-dose", icon: "🐱" },
        { title: "Nail Trim Interval Planner (activity/surface based)", url: "/pets/cat-nail-trim-interval-planner", icon: "💉" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Heavy Metal (Lead/Zinc) Exposure Risk" },
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