import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdHeavyMetalExposureRiskCalculator() {
  // 1. STATE
  // Default unit system (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and exposure level (mg/kg)
  const [inputs, setInputs] = useState({
    weight: "",
    exposureMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  // Calculate risk score based on exposure dose and weight
  // Formula: Risk Score = Exposure Dose (mg/kg) * Weight (kg)
  // Interpretation: Higher score indicates greater risk of toxicity
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const exposureNum = parseFloat(inputs.exposureMgPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(exposureNum) ||
      exposureNum < 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for weight and exposure.",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate risk score
    const riskScore = exposureNum * weightKg;

    // Risk interpretation thresholds (example values):
    // <5 = Low risk, 5-15 = Moderate risk, >15 = High risk
    let label = "";
    let warning = null;

    if (riskScore < 5) {
      label = "Low Risk of Heavy Metal Toxicity";
    } else if (riskScore < 15) {
      label = "Moderate Risk of Heavy Metal Toxicity";
      warning =
        "Monitor clinical signs closely and consider veterinary evaluation.";
    } else {
      label = "High Risk of Heavy Metal Toxicity";
      warning =
        "Immediate veterinary intervention recommended to prevent severe poisoning.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Calculated using exposure dose and body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What are the common sources of lead and zinc exposure in birds?",
      answer:
        "Birds can be exposed to lead and zinc through ingestion of contaminated materials such as old paint chips, galvanized cages, toys, or hardware. These metals accumulate in the body and can cause toxicity over time. Understanding these sources helps in preventing exposure and protecting avian health.",
    },
    {
      question: "How does heavy metal toxicity affect a bird’s health?",
      answer:
        "Heavy metal toxicity interferes with multiple physiological systems including the nervous, gastrointestinal, and hematopoietic systems. Lead and zinc disrupt enzyme functions and cause symptoms like lethargy, anorexia, vomiting, and neurological deficits. Early detection and intervention are critical to prevent irreversible damage.",
    },
    {
      question: "Why is body weight important in assessing heavy metal exposure risk?",
      answer:
        "Body weight is essential to calculate the dose of heavy metals per kilogram, which determines toxicity risk. Smaller birds may reach toxic levels at lower absolute exposures compared to larger birds. Accurate weight measurement ensures precise risk assessment and appropriate clinical decisions.",
    },
    {
      question: "Can this calculator replace veterinary diagnosis for heavy metal poisoning?",
      answer:
        "No, this tool is designed for educational and preliminary risk assessment purposes only. Heavy metal poisoning diagnosis requires clinical evaluation, laboratory testing, and professional veterinary interpretation. Always consult a qualified avian veterinarian for diagnosis and treatment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

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
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label
            htmlFor="exposureMgPerKg"
            className="text-slate-700 dark:text-slate-300"
          >
            Estimated Exposure Dose (mg/kg)
          </Label>
          <Input
            id="exposureMgPerKg"
            name="exposureMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter estimated lead or zinc dose per kg"
            value={inputs.exposureMgPerKg}
            onChange={handleInputChange}
          />
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
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", exposureMgPerKg: "" })}
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
          Understanding Heavy Metal (Lead/Zinc) Exposure Risk
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Heavy metal exposure, particularly to lead and zinc, poses a significant
          health risk to birds due to their unique physiology and sensitivity. These
          metals can accumulate in the body over time, leading to toxic effects that
          impair neurological, gastrointestinal, and hematologic functions. Sources
          of exposure often include contaminated cages, toys, paint chips, and
          galvanized materials commonly found in avian environments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The risk of toxicity depends on the dose of metal ingested relative to the
          bird’s body weight, as smaller birds require lower amounts to reach toxic
          thresholds. Clinical signs can be subtle initially but progress to severe
          illness if untreated. Early identification and risk assessment are crucial
          for timely intervention and prevention of irreversible damage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the risk of heavy metal poisoning by combining
          the bird’s weight with an estimated exposure dose, providing a quantitative
          risk score. While it serves as a valuable educational tool, it cannot
          replace professional veterinary diagnosis and treatment. Always seek
          veterinary advice when heavy metal exposure is suspected.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately assess the risk of heavy metal exposure in your bird, enter
          its current weight and the estimated dose of lead or zinc exposure per
          kilogram of body weight. The calculator will then provide a risk score that
          helps you understand the potential toxicity level. Follow the steps below
          carefully for best results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system you prefer (Imperial for
            pounds or Metric for kilograms).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s weight in the chosen unit.
            Ensure the value is accurate and recent.
          </li>
          <li>
            <strong>Step 3:</strong> Input the estimated exposure dose of lead or
            zinc in milligrams per kilogram (mg/kg). This value may come from
            environmental testing or veterinary assessment.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the risk score and
            interpretation. Use this information to guide monitoring and veterinary
            consultation.
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
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
              href="https://www.merckvetmanual.com/toxicology/lead-poisoning-in-animals/lead-poisoning-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Lead Poisoning in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of lead toxicity, clinical signs, diagnosis,
              and treatment in avian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151806/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. NCBI - Zinc Toxicity in Birds: A Review
            </a>
            <p className="text-slate-500 text-sm">
              Detailed scientific review of zinc exposure risks, mechanisms, and
              clinical management in birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/avian-toxicology"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Avian Toxicology Resources
            </a>
            <p className="text-slate-500 text-sm">
              Educational materials and guidelines for diagnosing and managing heavy
              metal poisoning in pet birds.
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
        formula: "Risk Score = Exposure Dose (mg/kg) × Body Weight (kg)",
        variables: [
          { symbol: "Exposure Dose (mg/kg)", description: "Estimated heavy metal dose per kg of bird weight" },
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) parakeet is estimated to have ingested 8 mg/kg of zinc from a galvanized cage.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg (already 1 kg). Multiply exposure dose by weight: 8 mg/kg × 1 kg = 8.",
          },
          {
            label: "2",
            explanation:
              "Interpret risk score: 8 falls into moderate risk category, indicating potential toxicity requiring monitoring.",
          },
        ],
        result:
          "Risk Score = 8; Moderate Risk of Heavy Metal Toxicity. Veterinary evaluation recommended.",
      }}
      relatedCalculators={[
        {
          title: "Calcium + D3 Supplement Calculator",
          url: "/pets/reptile-calcium-d3-supplement",
          icon: "🐾",
        },
        {
          title: "Litter Box Output Tracker (Normal vs. Increased)",
          url: "/pets/cat-litter-box-output-tracker",
          icon: "🐶",
        },
        {
          title: "Cat BMI/Body Index (educational)",
          url: "/pets/cat-bmi-body-index-educational",
          icon: "🐱",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "🍖",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
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