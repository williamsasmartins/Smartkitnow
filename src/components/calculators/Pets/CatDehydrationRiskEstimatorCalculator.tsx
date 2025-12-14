import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // weight: cat's weight
  // dehydrationSigns: clinical dehydration signs score (0-5 scale)
  // fluidIntake: daily fluid intake in ml
  // normalIntake: expected normal daily fluid intake in ml
  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationSigns: "",
    fluidIntake: "",
    normalIntake: "",
  });

  // Helper: parse float safely
  const parseInput = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // 2. LOGIC ENGINE
  // Calculation logic:
  // Convert weight to kg if imperial
  // Dehydration % estimate from clinical signs (scale 0-5):
  //   0 = 0%, 1=5%, 2=7%, 3=10%, 4=12%, 5=15%
  // Intake deficit = (normalIntake - fluidIntake) / normalIntake * 100 (percent)
  // Hydration Score = Dehydration % + Intake Deficit
  // Score interpretation:
  //   <10: Low risk
  //   10-20: Moderate risk
  //   >20: High risk

  const results = useMemo(() => {
    const weightRaw = parseInput(inputs.weight);
    const dehydrationSignsRaw = parseInput(inputs.dehydrationSigns);
    const fluidIntakeRaw = parseInput(inputs.fluidIntake);
    const normalIntakeRaw = parseInput(inputs.normalIntake);

    if (
      weightRaw === 0 ||
      dehydrationSignsRaw === 0 && dehydrationSignsRaw !== 0 || // allow zero
      normalIntakeRaw === 0
    ) {
      return {
        value: 0,
        label: "Please enter all required inputs",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Map dehydration signs score (0-5) to % dehydration
    // Source: Veterinary clinical dehydration estimates
    const dehydrationMap = [0, 5, 7, 10, 12, 15];
    const dehydrationPercent =
      dehydrationSignsRaw >= 0 && dehydrationSignsRaw <= 5
        ? dehydrationMap[Math.round(dehydrationSignsRaw)]
        : 0;

    // Calculate intake deficit %
    let intakeDeficitPercent = 0;
    if (normalIntakeRaw > 0) {
      intakeDeficitPercent =
        fluidIntakeRaw < normalIntakeRaw
          ? ((normalIntakeRaw - fluidIntakeRaw) / normalIntakeRaw) * 100
          : 0;
    }

    // Hydration Score
    const hydrationScore = dehydrationPercent + intakeDeficitPercent;

    // Risk interpretation
    let riskLabel = "";
    let warning = null;
    if (hydrationScore < 10) {
      riskLabel = "Low Dehydration Risk";
    } else if (hydrationScore >= 10 && hydrationScore <= 20) {
      riskLabel = "Moderate Dehydration Risk";
      warning =
        "Monitor your cat closely and consider veterinary consultation if symptoms persist or worsen.";
    } else if (hydrationScore > 20) {
      riskLabel = "High Dehydration Risk";
      warning =
        "Immediate veterinary attention is recommended. Severe dehydration can be life-threatening.";
    }

    return {
      value: hydrationScore.toFixed(1),
      label: riskLabel,
      subtext: `Based on clinical signs and fluid intake deficit.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to assess both symptoms and fluid intake when estimating dehydration risk?",
      answer:
        "Assessing both clinical symptoms and fluid intake provides a comprehensive understanding of a cat's hydration status. Symptoms alone may not reveal early dehydration, while intake deficits can indicate insufficient hydration before signs appear. Combining these factors improves accuracy in identifying cats at risk and guides timely intervention.",
    },
    {
      question: "How does the dehydration signs score correlate with actual fluid loss in cats?",
      answer:
        "The dehydration signs score reflects clinical indicators such as skin elasticity, mucous membrane moisture, and eye appearance, which correlate with estimated fluid loss percentages. For example, mild signs correspond to approximately 5-7% fluid loss, while severe signs indicate up to 15% or more. This correlation helps veterinarians estimate dehydration severity without invasive measures.",
    },
    {
      question: "Can this calculator replace a veterinary examination for dehydration diagnosis?",
      answer:
        "No, this calculator is an educational tool designed to estimate dehydration risk based on observable signs and intake data. It cannot replace a thorough veterinary examination, which includes physical assessment and diagnostic tests. Always consult a veterinarian for accurate diagnosis and treatment recommendations.",
    },
    {
      question: "How should I measure my cat’s normal daily fluid intake for accurate results?",
      answer:
        "To measure your cat’s normal daily fluid intake, track the amount of water your cat drinks over several days under normal health conditions. Include fluids from wet food if applicable. Accurate baseline intake helps identify deficits during illness, improving the reliability of the dehydration risk estimate.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
            Cat's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="dehydrationSigns" className="text-slate-700 dark:text-slate-300">
            Clinical Dehydration Signs Score (0-5)
          </Label>
          <Input
            id="dehydrationSigns"
            type="number"
            min={0}
            max={5}
            step="1"
            placeholder="0 = none, 5 = severe"
            value={inputs.dehydrationSigns}
            onChange={(e) => setInputs({ ...inputs, dehydrationSigns: e.target.value })}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Score based on clinical signs such as skin tenting, mucous membrane dryness, and sunken eyes.
          </p>
        </div>

        <div>
          <Label htmlFor="fluidIntake" className="text-slate-700 dark:text-slate-300">
            Current Daily Fluid Intake (ml)
          </Label>
          <Input
            id="fluidIntake"
            type="number"
            min={0}
            step="any"
            placeholder="Enter current daily fluid intake in ml"
            value={inputs.fluidIntake}
            onChange={(e) => setInputs({ ...inputs, fluidIntake: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="normalIntake" className="text-slate-700 dark:text-slate-300">
            Normal Daily Fluid Intake (ml)
          </Label>
          <Input
            id="normalIntake"
            type="number"
            min={0}
            step="any"
            placeholder="Enter normal daily fluid intake in ml"
            value={inputs.normalIntake}
            onChange={(e) => setInputs({ ...inputs, normalIntake: e.target.value })}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Typical fluid intake when your cat is healthy; helps identify intake deficits.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              dehydrationSigns: "",
              fluidIntake: "",
              normalIntake: "",
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
          Understanding Dehydration Risk Estimator (Symptoms + Intake)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in cats is a critical health concern that can arise from various conditions such as illness, heat exposure, or inadequate fluid intake. This estimator combines clinical symptoms with fluid intake data to provide a more accurate assessment of dehydration risk. Clinical signs alone may not always reflect the true hydration status, especially in early stages, so incorporating intake helps detect subtle deficits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The tool uses a clinical dehydration signs score, which evaluates observable indicators like skin elasticity, mucous membrane moisture, and eye appearance, correlating these signs with estimated fluid loss percentages. Additionally, it factors in the difference between normal and current fluid intake to identify potential deficits that contribute to dehydration risk. This dual approach enhances early detection and supports timely veterinary intervention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By quantifying both symptom severity and intake reduction, the estimator provides a hydration score that categorizes risk levels from low to high. This score aids pet owners and veterinary professionals in monitoring cats, especially those with underlying health issues, ensuring that dehydration is promptly recognized and managed. Ultimately, this tool supports better clinical decision-making and improved feline health outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this dehydration risk estimator effectively, begin by accurately measuring your cat’s weight in the selected unit system. Next, assess the clinical dehydration signs by scoring observable symptoms on a scale from 0 (no signs) to 5 (severe signs). Then, enter your cat’s current daily fluid intake and their normal daily fluid intake, both in milliliters, to calculate any intake deficits.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) and enter your cat’s weight accordingly.
          </li>
          <li>
            <strong>Step 2:</strong> Score the clinical dehydration signs based on skin elasticity, mucous membrane moisture, and eye appearance.
          </li>
          <li>
            <strong>Step 3:</strong> Input the current daily fluid intake and the normal daily fluid intake to identify any deficits.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to receive the hydration score and risk category, along with guidance on next steps.
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
              href="https://www.merckvetmanual.com/emergency-medicine/fluid-therapy/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration causes, clinical signs, and fluid therapy in cats and dogs.
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
              Detailed academic resource on assessing dehydration and calculating fluid deficits in veterinary patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Understanding Dehydration in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidance for cat owners on recognizing and managing dehydration in feline patients.
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
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Dehydration % + Intake Deficit %",
        variables: [
          { symbol: "Dehydration %", description: "Estimated fluid loss based on clinical signs" },
          { symbol: "Intake Deficit %", description: "Percentage reduction in daily fluid intake compared to normal" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat shows moderate clinical signs scored as 3 (approx. 10% dehydration). The owner reports current fluid intake of 40 ml/day, while normal intake is 60 ml/day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lbs ÷ 2.20462 ≈ 4.54 kg (for reference).",
          },
          {
            label: "2",
            explanation:
              "Dehydration % from signs = 10%. Intake deficit = ((60 - 40) / 60) × 100 = 33.3%.",
          },
          {
            label: "3",
            explanation:
              "Hydration Score = 10% + 33.3% = 43.3%, indicating high dehydration risk requiring urgent veterinary care.",
          },
        ],
        result: "Hydration Score: 43.3% — High Dehydration Risk",
      }}
      relatedCalculators={[
        {
          title: "Heat Risk/Walk Safety Window (Temp & Humidity)",
          url: "/pets/dog-heat-risk-walk-safety-window",
          icon: "🐾",
        },
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐶",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Alcohol/Ethanol Exposure Risk Calculator",
          url: "/pets/dog-alcohol-ethanol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
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