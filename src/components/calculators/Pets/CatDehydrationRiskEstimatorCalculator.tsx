import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  // Weight and volume inputs involved, so keep unit state and selector.
  const [unit, setUnit] = useState("imperial"); // MUST DEFAULT TO IMPERIAL

  // Inputs:
  // weight (lbs or kg)
  // water intake last 24h (oz or ml)
  // urine output last 24h (oz or ml)
  // clinical signs severity (scale 0-3)
  // duration of symptoms (hours)
  const [inputs, setInputs] = useState({
    weight: "",
    waterIntake: "",
    urineOutput: "",
    clinicalSigns: "", // 0-3 scale: 0 = none, 1 = mild, 2 = moderate, 3 = severe
    durationHours: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary dehydration risk estimation based on:
  // - % dehydration estimated from clinical signs severity:
  //   mild = 5%, moderate = 8%, severe = 10% dehydration
  // - Fluid deficit (L) = % dehydration * weight (kg)
  // - Intake deficit = fluid deficit - (water intake + urine output)
  // - Risk level based on intake deficit and duration of symptoms
  const results = useMemo(() => {
    // Parse inputs safely
    const weightNum = parseFloat(inputs.weight);
    const waterIntakeNum = parseFloat(inputs.waterIntake);
    const urineOutputNum = parseFloat(inputs.urineOutput);
    const clinicalSignsNum = parseInt(inputs.clinicalSigns);
    const durationNum = parseFloat(inputs.durationHours);

    if (
      isNaN(weightNum) ||
      isNaN(waterIntakeNum) ||
      isNaN(urineOutputNum) ||
      isNaN(clinicalSignsNum) ||
      isNaN(durationNum) ||
      weightNum <= 0 ||
      waterIntakeNum < 0 ||
      urineOutputNum < 0 ||
      clinicalSignsNum < 0 ||
      clinicalSignsNum > 3 ||
      durationNum < 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Convert volumes to liters
    // 1 oz = 29.5735 ml, 1000 ml = 1 L
    const waterIntakeL =
      unit === "imperial" ? (waterIntakeNum * 29.5735) / 1000 : waterIntakeNum / 1000;
    const urineOutputL =
      unit === "imperial" ? (urineOutputNum * 29.5735) / 1000 : urineOutputNum / 1000;

    // Clinical signs dehydration % estimate
    // 0 = 0%, 1 = 5%, 2 = 8%, 3 = 10%
    const dehydrationPercentMap = [0, 0.05, 0.08, 0.10];
    const dehydrationPercent = dehydrationPercentMap[clinicalSignsNum] || 0;

    // Fluid deficit in liters
    const fluidDeficitL = dehydrationPercent * weightKg;

    // Intake deficit = fluid deficit - (water intake + urine output)
    const intakeDeficitL = fluidDeficitL - (waterIntakeL + urineOutputL);

    // Risk assessment logic:
    // If intake deficit > 0.5 L and duration > 12h => High risk
    // If intake deficit between 0.2-0.5 L and duration > 6h => Moderate risk
    // Else Low risk
    let riskLabel = "Low Risk of Dehydration";
    let riskValue = 1;
    let warning = null;

    if (intakeDeficitL > 0.5 && durationNum > 12) {
      riskLabel = "High Risk of Dehydration";
      riskValue = 3;
      warning =
        "Severe fluid deficit detected with prolonged symptoms. Immediate veterinary attention recommended.";
    } else if (intakeDeficitL > 0.2 && durationNum > 6) {
      riskLabel = "Moderate Risk of Dehydration";
      riskValue = 2;
      warning =
        "Moderate fluid deficit and symptom duration. Monitor closely and consider veterinary consultation.";
    }

    // Format values for display
    const fluidDeficitDisplay = (fluidDeficitL * 1000).toFixed(1); // ml
    const intakeDeficitDisplay = (intakeDeficitL * 1000).toFixed(1); // ml

    return {
      value: riskValue,
      label: riskLabel,
      subtext: `Estimated fluid deficit: ${fluidDeficitDisplay} ml. Intake deficit: ${intakeDeficitDisplay} ml over ${durationNum} hours.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "What clinical signs indicate dehydration in cats?",
      answer:
        "Dehydration in cats often presents as dry gums, sunken eyes, lethargy, and decreased skin elasticity. Mild signs may be subtle, but moderate to severe dehydration requires prompt veterinary evaluation to prevent complications.",
    },
    {
      question: "How does fluid intake affect dehydration risk?",
      answer:
        "Adequate fluid intake helps maintain hydration and supports kidney function. Reduced water consumption or increased losses through vomiting or diarrhea increase dehydration risk, especially when symptoms persist over several hours.",
    },
    {
      question: "Why is urine output important in assessing dehydration?",
      answer:
        "Urine output reflects kidney function and hydration status. Low urine output can indicate dehydration or kidney impairment, while normal or increased output suggests better hydration. Tracking urine helps estimate fluid balance accurately.",
    },
    {
      question: "When should I seek veterinary care for my cat’s dehydration?",
      answer:
        "If your cat shows moderate to severe clinical signs of dehydration, has reduced fluid intake, or symptoms lasting more than 6-12 hours, seek veterinary care immediately. Early intervention prevents serious health risks and improves recovery outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 px-3 py-2"
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs, oz, hours)</option>
            <option value="metric">Metric (kg, ml, hours)</option>
          </select>
        </div>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        <div>
          <Label htmlFor="waterIntake" className="text-slate-700 dark:text-slate-300">
            Water Intake Last 24 Hours ({unit === "imperial" ? "oz" : "ml"})
          </Label>
          <Input
            id="waterIntake"
            type="number"
            min="0"
            step="any"
            value={inputs.waterIntake}
            onChange={(e) => setInputs((prev) => ({ ...prev, waterIntake: e.target.value }))}
            placeholder={`Enter water intake in ${unit === "imperial" ? "oz" : "ml"}`}
          />
        </div>

        <div>
          <Label htmlFor="urineOutput" className="text-slate-700 dark:text-slate-300">
            Urine Output Last 24 Hours ({unit === "imperial" ? "oz" : "ml"})
          </Label>
          <Input
            id="urineOutput"
            type="number"
            min="0"
            step="any"
            value={inputs.urineOutput}
            onChange={(e) => setInputs((prev) => ({ ...prev, urineOutput: e.target.value }))}
            placeholder={`Enter urine output in ${unit === "imperial" ? "oz" : "ml"}`}
          />
        </div>

        <div>
          <Label htmlFor="clinicalSigns" className="text-slate-700 dark:text-slate-300">
            Clinical Signs Severity (0 = None, 1 = Mild, 2 = Moderate, 3 = Severe)
          </Label>
          <Input
            id="clinicalSigns"
            type="number"
            min="0"
            max="3"
            step="1"
            value={inputs.clinicalSigns}
            onChange={(e) => {
              let val = e.target.value;
              if (val === "") {
                setInputs((prev) => ({ ...prev, clinicalSigns: "" }));
                return;
              }
              let num = Math.min(3, Math.max(0, parseInt(val)));
              setInputs((prev) => ({ ...prev, clinicalSigns: num.toString() }));
            }}
            placeholder="Enter 0 to 3"
          />
        </div>

        <div>
          <Label htmlFor="durationHours" className="text-slate-700 dark:text-slate-300">
            Duration of Symptoms (hours)
          </Label>
          <Input
            id="durationHours"
            type="number"
            min="0"
            step="any"
            value={inputs.durationHours}
            onChange={(e) => setInputs((prev) => ({ ...prev, durationHours: e.target.value }))}
            placeholder="Enter duration in hours"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            // No extra action needed here
          }}
          aria-label="Calculate dehydration risk"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              waterIntake: "",
              urineOutput: "",
              clinicalSigns: "",
              durationHours: "",
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.label}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.subtext}</p>
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
          Understanding Dehydration Risk Estimator (Symptoms + Intake)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in cats is a critical condition that can arise from various causes such as illness,
          vomiting, diarrhea, or inadequate fluid intake. This estimator combines clinical signs with
          fluid intake and output data to provide a comprehensive risk assessment. By evaluating these
          factors together, it offers a more accurate picture of a cat’s hydration status than relying
          on symptoms alone.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Clinical signs such as dry mucous membranes, sunken eyes, and skin tenting are classic indicators
          of dehydration severity. However, these signs can sometimes be subtle or misleading, especially
          in early stages. Tracking water consumption and urine output over the past 24 hours helps quantify
          fluid balance, which is essential for determining the true extent of dehydration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool uses veterinary-validated thresholds for dehydration percentages based on clinical signs
          severity, combined with fluid deficits calculated from weight and intake/output volumes. The
          resulting risk level guides pet owners and clinicians in deciding when urgent veterinary care
          is necessary, promoting timely intervention and better outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your cat’s dehydration risk, gather the following information: current weight,
          total water intake and urine output over the last 24 hours, severity of clinical signs, and how long
          symptoms have been present. Enter these values into the calculator, selecting the appropriate unit system.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or estimate your cat’s weight in pounds or kilograms.
          </li>
          <li>
            <strong>Step 2:</strong> Record the amount of water your cat has consumed and urine produced in the last 24 hours.
          </li>
          <li>
            <strong>Step 3:</strong> Assess clinical signs severity on a scale from 0 (none) to 3 (severe).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the duration of symptoms in hours.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to view the dehydration risk and recommended actions.
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
              href="https://www.merckvetmanual.com/critical-care/fluid-therapy/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration and Fluid Therapy
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration assessment and fluid therapy in small animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/hospital/critical-care/fluid-therapy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Fluid Therapy Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on fluid therapy and monitoring hydration status in veterinary patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151203/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Clinical Signs and Assessment of Dehydration in Cats (PMC Article)
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing clinical signs and dehydration assessment in feline patients.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Symptoms + Intake)"
      description="Estimate the risk of dehydration using clinical signs and tracking fluid intake, particularly in sick cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `
\\[
\\text{Fluid Deficit (L)} = \\text{Dehydration \\%} \\times \\text{Weight (kg)}
\\]

\\[
\\text{Intake Deficit (L)} = \\text{Fluid Deficit} - (\\text{Water Intake} + \\text{Urine Output})
\\]

\\[
\\text{Risk Level} = 
\\begin{cases}
\\text{High}, & \\text{if Intake Deficit} > 0.5L \\text{ and Duration} > 12h \\\\
\\text{Moderate}, & \\text{if Intake Deficit} > 0.2L \\text{ and Duration} > 6h \\\\
\\text{Low}, & \\text{otherwise}
\\end{cases}
\\]
        `,
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Dehydration %", description: "Estimated dehydration percentage from clinical signs" },
          { symbol: "Water Intake", description: "Total water consumed in liters over last 24 hours" },
          { symbol: "Urine Output", description: "Total urine produced in liters over last 24 hours" },
          { symbol: "Intake Deficit", description: "Difference between fluid deficit and intake/output" },
          { symbol: "Duration", description: "Duration of symptoms in hours" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat presents with moderate clinical signs (score 2), has consumed 8 oz of water, produced 6 oz of urine in the last 24 hours, and symptoms have lasted 10 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lbs / 2.20462 ≈ 4.54 kg. Dehydration % for moderate signs = 8% (0.08). Fluid deficit = 0.08 × 4.54 = 0.363 L.",
          },
          {
            label: "2",
            explanation:
              "Convert intake/output to liters: Water intake = 8 oz × 29.5735 / 1000 ≈ 0.236 L, Urine output = 6 oz × 29.5735 / 1000 ≈ 0.177 L.",
          },
          {
            label: "3",
            explanation:
              "Intake deficit = 0.363 - (0.236 + 0.177) = -0.05 L (no deficit). Duration = 10 hours.",
          },
          {
            label: "4",
            explanation:
              "Since intake deficit is negative and duration less than 12 hours, risk is Low.",
          },
        ],
        result: "Low Risk of Dehydration with no significant fluid deficit detected.",
      }}
      relatedCalculators={[
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐶",
        },
        {
          title: "Tramadol Dose Calculator for Dogs",
          url: "/pets/dog-tramadol-dose",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
        {
          title: "Dog Walking Calories Burned Calculator",
          url: "/pets/dog-walking-calories-burned",
          icon: "🐶",
        },
        {
          title: "Resting vs. Active Hours Balance Tracker (owner input)",
          url: "/pets/cat-resting-active-hours-balance-tracker",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Risk Estimator (Symptoms + Intake)" },
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