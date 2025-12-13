import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  Dog,
  Cat,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weightCurrent: "",
    weightNormal: "",
    symptomThirst: false,
    symptomLethargy: false,
    symptomDryMucous: false,
    symptomSunkenEyes: false,
    symptomSkinTurgor: false,
  });

  // 2. LOGIC ENGINE
  /**
   * Dehydration Risk Estimator Logic:
   * 
   * Step 1: Calculate % weight loss compared to normal weight:
   *   %WeightLoss = ((NormalWeightKg - CurrentWeightKg) / NormalWeightKg) * 100
   * 
   * Step 2: Assign symptom scores (each symptom adds risk points):
   *   Thirst: 1 point
   *   Lethargy: 2 points
   *   Dry mucous membranes: 2 points
   *   Sunken eyes: 3 points
   *   Reduced skin turgor: 3 points
   * 
   * Step 3: Calculate total risk score:
   *   RiskScore = %WeightLoss + Sum of symptom points
   * 
   * Step 4: Risk interpretation:
   *   - Low risk: <5%
   *   - Moderate risk: 5-10%
   *   - High risk: >10%
   * 
   * This approach is based on veterinary clinical dehydration assessment guidelines.
   */

  const results = useMemo(() => {
    const wCurrentRaw = parseFloat(inputs.weightCurrent);
    const wNormalRaw = parseFloat(inputs.weightNormal);
    if (!wCurrentRaw || wCurrentRaw <= 0 || !wNormalRaw || wNormalRaw <= 0)
      return {
        value: 0,
        label: "Enter valid weights to calculate risk...",
        subtext: null,
        warning: null,
      };

    // Convert weights to kg if imperial
    const weightCurrentKg = unit === "imperial" ? wCurrentRaw / 2.20462 : wCurrentRaw;
    const weightNormalKg = unit === "imperial" ? wNormalRaw / 2.20462 : wNormalRaw;

    if (weightCurrentKg > weightNormalKg) {
      return {
        value: 0,
        label: "Current weight cannot exceed normal weight.",
        subtext: null,
        warning:
          "Weight gain does not indicate dehydration risk. Please check inputs.",
      };
    }

    // Calculate % weight loss
    const weightLossPercent =
      ((weightNormalKg - weightCurrentKg) / weightNormalKg) * 100;

    // Symptom scoring
    const symptomPoints =
      (inputs.symptomThirst ? 1 : 0) +
      (inputs.symptomLethargy ? 2 : 0) +
      (inputs.symptomDryMucous ? 2 : 0) +
      (inputs.symptomSunkenEyes ? 3 : 0) +
      (inputs.symptomSkinTurgor ? 3 : 0);

    // Total risk score
    const riskScore = weightLossPercent + symptomPoints;

    // Risk interpretation
    let riskLabel = "";
    let warning = null;
    if (riskScore < 5) {
      riskLabel = "Low risk of dehydration";
    } else if (riskScore >= 5 && riskScore <= 10) {
      riskLabel = "Moderate risk of dehydration";
      warning =
        "Monitor your pet closely and consider veterinary consultation if symptoms persist.";
    } else {
      riskLabel = "High risk of dehydration";
      warning =
        "Immediate veterinary attention is recommended to prevent serious complications.";
    }

    return {
      value: riskScore.toFixed(1),
      label: riskLabel,
      subtext: `Weight loss: ${weightLossPercent.toFixed(
        1
      )}%, Symptom points: ${symptomPoints}`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why is weight loss an important factor in estimating dehydration risk in dogs?",
      answer:
        "Weight loss in dogs is a critical indicator of fluid loss, as dehydration leads to reduced body water content. By comparing current weight to the dog's normal weight, veterinarians can estimate the percentage of fluid deficit. This metric helps quantify dehydration severity, guiding timely interventions. Monitoring weight changes is a practical, non-invasive method to assess hydration status in clinical and home settings.",
    },
    {
      question:
        "How do physical symptoms like sunken eyes and dry mucous membranes relate to dehydration severity?",
      answer:
        "Physical symptoms such as sunken eyes and dry mucous membranes reflect the body's response to fluid loss. Sunken eyes indicate reduced orbital fat and tissue hydration, while dry mucous membranes show decreased saliva and moisture production. These signs correlate with moderate to severe dehydration stages, providing visual clues for veterinarians to assess the urgency and extent of fluid replacement therapy required.",
    },
    {
      question:
        "Can this dehydration risk estimator replace a veterinary examination?",
      answer:
        "No, this estimator is designed as an educational and preliminary screening tool. While it helps identify potential dehydration risk based on weight and symptoms, it cannot replace a comprehensive veterinary examination. Only a veterinarian can perform detailed clinical assessments, diagnostics, and prescribe appropriate treatments. If the risk is moderate or high, prompt veterinary consultation is essential to ensure your pet's health and safety.",
    },
    {
      question:
        "How often should I monitor my dog's weight and symptoms to prevent dehydration?",
      answer:
        "Regular monitoring is crucial, especially during illness, heat exposure, or increased activity. Ideally, weigh your dog weekly under consistent conditions to detect subtle changes. Observe for symptoms daily, noting any increased thirst, lethargy, or mucous membrane changes. Early detection of dehydration signs allows for timely fluid replacement and veterinary care, preventing progression to severe dehydration and associated complications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weightNormal" className="text-slate-700 dark:text-slate-300">
              Normal Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weightNormal"
              name="weightNormal"
              type="number"
              min={0}
              step="any"
              value={inputs.weightNormal}
              onChange={handleInputChange}
              placeholder={`Enter normal weight`}
            />
          </div>
          <div>
            <Label htmlFor="weightCurrent" className="text-slate-700 dark:text-slate-300">
              Current Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weightCurrent"
              name="weightCurrent"
              type="number"
              min={0}
              step="any"
              value={inputs.weightCurrent}
              onChange={handleInputChange}
              placeholder={`Enter current weight`}
            />
          </div>
        </div>

        {/* Symptoms Checkboxes */}
        <fieldset className="space-y-2 mt-4">
          <legend className="text-slate-700 dark:text-slate-300 font-semibold">
            Select Observed Symptoms
          </legend>
          <div className="flex flex-col space-y-1">
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomThirst"
                checked={inputs.symptomThirst}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Increased Thirst
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomLethargy"
                checked={inputs.symptomLethargy}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Lethargy or Weakness
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomDryMucous"
                checked={inputs.symptomDryMucous}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Dry Mucous Membranes
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomSunkenEyes"
                checked={inputs.symptomSunkenEyes}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Sunken Eyes
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomSkinTurgor"
                checked={inputs.symptomSkinTurgor}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Reduced Skin Turgor
            </label>
          </div>
        </fieldset>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          // Calculation is dynamic on input change, button is mostly UI affordance
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weightCurrent: "",
              weightNormal: "",
              symptomThirst: false,
              symptomLethargy: false,
              symptomDryMucous: false,
              symptomSunkenEyes: false,
              symptomSkinTurgor: false,
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dehydration Risk Estimator (Weight & Symptoms Aware)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in dogs is a critical health concern that occurs when the body
          loses more fluids than it takes in, disrupting normal physiological
          functions. This estimator combines objective weight measurements with
          subjective symptom assessments to provide a comprehensive risk evaluation.
          Weight loss is a quantifiable indicator of fluid deficit, while symptoms
          such as lethargy and dry mucous membranes reflect the clinical impact of
          dehydration on the dog's body systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By integrating weight changes with symptom severity, this tool offers a
          nuanced approach to estimating dehydration risk, surpassing reliance on
          weight alone. This method aligns with veterinary clinical practices where
          multiple parameters are assessed to determine hydration status. Early
          identification of dehydration risk enables timely intervention, reducing
          the likelihood of complications such as kidney failure or shock.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that this estimator serves as an educational guide
          and preliminary screening tool. Definitive diagnosis and treatment require
          veterinary evaluation, including physical examination and possibly blood
          tests. Pet owners should use this tool to monitor their pets regularly,
          especially during illness, heat exposure, or increased activity, to ensure
          optimal hydration and health.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog's dehydration risk, begin by selecting the
          appropriate unit system—Imperial (pounds) or Metric (kilograms). Enter your
          dog's normal healthy weight, which serves as a baseline, followed by the
          current weight. Accurate weight measurements are essential for reliable
          results. Next, carefully observe and select any symptoms your dog is
          exhibiting from the provided list, such as increased thirst or sunken eyes.
          Each symptom contributes to the overall risk score.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Normal Weight:</strong> Input the typical healthy weight of your
            dog when well-hydrated, preferably from recent veterinary records.
          </li>
          <li>
            <strong>Current Weight:</strong> Enter the dog's current weight, measured
            under similar conditions to ensure consistency.
          </li>
          <li>
            <strong>Symptoms:</strong> Select all symptoms observed that may indicate
            dehydration. Each symptom adds to the risk score based on clinical
            significance.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all required data, click the "Calculate" button to view the
          estimated dehydration risk score and interpretation. Use the reset button to
          clear inputs and start a new assessment. Remember, this tool aids in
          monitoring but does not replace professional veterinary advice.
        </p>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/critical-care/fluid-therapy/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration and Fluid Therapy
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on assessing dehydration severity and fluid
              therapy protocols in small animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Dehydration%20and%20Fluid%20Therapy%20in%20Small%20Animals.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Dehydration and Fluid Therapy in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing clinical signs and calculations for
              fluid deficits in dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cliniciansbrief.com/article/assessment-and-treatment-dehydration-small-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Clinician's Brief: Assessment and Treatment of Dehydration in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article emphasizing symptom-based assessment and treatment
              strategies for dehydration.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/fluids/fluids-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Animal Hospital Association (AAHA) Fluid Therapy Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on fluid therapy, including dehydration
              assessment and management in veterinary practice.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Weight & Symptoms Aware)"
      description="Estimate the risk of dehydration by inputting weight changes and physical symptoms for veterinary attention."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: Show the actual math used here
      formula={{
        title: "Scientific Formula",
        formula:
          "RiskScore = ((NormalWeightKg - CurrentWeightKg) / NormalWeightKg) × 100 + SymptomPoints",
        variables: [
          {
            symbol: "NormalWeightKg",
            description: "Dog's normal healthy weight in kilograms",
          },
          {
            symbol: "CurrentWeightKg",
            description: "Dog's current weight in kilograms",
          },
          {
            symbol: "SymptomPoints",
            description:
              "Sum of points assigned to observed dehydration symptoms (thirst=1, lethargy=2, dry mucous=2, sunken eyes=3, skin turgor=3)",
          },
          {
            symbol: "RiskScore",
            description:
              "Overall dehydration risk score combining weight loss percentage and symptom severity",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 kg dog normally weighs 20 kg but currently weighs 18 kg. The owner observes increased thirst, dry mucous membranes, and sunken eyes.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate weight loss percentage: ((20 - 18) / 20) × 100 = 10%",
          },
          {
            label: "Step 2",
            explanation:
              "Assign symptom points: thirst (1) + dry mucous (2) + sunken eyes (3) = 6 points",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate total risk score: 10 + 6 = 16, indicating high dehydration risk",
          },
        ],
        result:
          "The dog is at high risk of dehydration and requires immediate veterinary attention.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dehydration Risk Estimator (Weight & Symptoms Aware)",
        },
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