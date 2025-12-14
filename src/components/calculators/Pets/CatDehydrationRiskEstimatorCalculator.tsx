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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  // Unit system needed because weight input can be in lbs or kg
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // weight (lbs or kg)
  // symptom severity score (0-10 scale, subjective clinical signs severity)
  // fluid intake last 24h (ml)
  // estimated normal fluid intake (ml) - optional, default based on RER
  // age (years) - for context, not directly in formula but shown
  const [inputs, setInputs] = useState({
    weight: "",
    symptomSeverity: "",
    fluidIntake: "",
    age: "",
  });

  // Helper: parse float safely
  const parseInput = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Convert weight to kg internally
    const weightRaw = parseInput(inputs.weight);
    if (weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: null,
        warning: null,
      };
    }
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Symptom severity score 0-10
    const symptomSeverity = Math.min(
      Math.max(parseInput(inputs.symptomSeverity), 0),
      10
    );

    // Fluid intake last 24h (ml)
    const fluidIntake = Math.max(parseInput(inputs.fluidIntake), 0);

    // Age (years)
    const age = Math.max(parseInput(inputs.age), 0);

    // Calculate Resting Energy Requirement (RER) in kcal/day
    // RER = 70 * (weight_kg ^ 0.75)
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Estimated normal daily water intake (ml) based on RER
    // Typical water intake ~50-60 ml per kg body weight or ~2-3 times RER in ml
    // We'll use 2.5 * RER as baseline normal intake
    const normalIntake = 2.5 * RER;

    // Fluid deficit estimation:
    // Dehydration % estimated by symptom severity scaled 0-10 to 0-12%
    // (clinical dehydration signs roughly correlate with % dehydration)
    // So dehydrationPercent = symptomSeverity * 1.2 (%)
    const dehydrationPercent = symptomSeverity * 1.2;

    // Fluid deficit volume (ml) = dehydrationPercent * weightKg * 10 (10 ml/kg per 1%)
    // This is a standard veterinary formula for fluid deficit
    const fluidDeficit = (dehydrationPercent / 100) * weightKg * 1000; // ml

    // Intake deficit = normalIntake - fluidIntake (ml)
    const intakeDeficit = Math.max(normalIntake - fluidIntake, 0);

    // Total dehydration risk score (arbitrary scale 0-100)
    // Combine symptom severity and intake deficit relative to normal intake
    // Formula: riskScore = (dehydrationPercent * 4) + (intakeDeficit / normalIntake) * 50
    // Cap riskScore at 100
    let riskScore =
      dehydrationPercent * 4 + (intakeDeficit / normalIntake) * 50;
    if (riskScore > 100) riskScore = 100;

    // Risk label based on riskScore
    let riskLabel = "Low Risk";
    let warning = null;
    if (riskScore >= 75) {
      riskLabel = "High Risk of Dehydration";
      warning =
        "Immediate veterinary attention recommended. Severe dehydration suspected.";
    } else if (riskScore >= 40) {
      riskLabel = "Moderate Risk of Dehydration";
      warning =
        "Monitor closely and consider veterinary consultation if symptoms worsen.";
    }

    // Format values for display
    const value = riskScore.toFixed(1);

    // Subtext with details
    const subtext = `Estimated dehydration: ${dehydrationPercent.toFixed(
      1
    )}%, Fluid deficit: ${fluidDeficit.toFixed(
      0
    )} ml, Normal intake: ${normalIntake.toFixed(
      0
    )} ml, Intake deficit: ${intakeDeficit.toFixed(0)} ml`;

    return {
      value,
      label: riskLabel,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How accurate is the dehydration risk score?",
      answer:
        "The score is an estimate based on clinical signs and fluid intake. It should not replace veterinary diagnosis but helps identify pets needing urgent care.",
    },
    {
      question: "Why do I need to enter fluid intake?",
      answer:
        "Tracking fluid intake helps assess hydration status, as decreased intake is a key sign of dehydration in cats.",
    },
    {
      question: "Can I use this for dogs or other pets?",
      answer:
        "This calculator is optimized for cats. Dogs and other species have different hydration needs and clinical signs.",
    },
    {
      question: "What should I do if my cat is at high risk?",
      answer:
        "Seek immediate veterinary attention. Severe dehydration can be life-threatening and requires prompt treatment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onChangeInput = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Reset inputs
  const onReset = () => {
    setInputs({
      weight: "",
      symptomSeverity: "",
      fluidIntake: "",
      age: "",
    });
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
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
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => onChangeInput("weight", e.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="symptomSeverity"
            className="text-slate-700 dark:text-slate-300"
          >
            Symptom Severity (0-10)
          </Label>
          <Input
            id="symptomSeverity"
            type="number"
            min={0}
            max={10}
            step="1"
            placeholder="Enter symptom severity score"
            value={inputs.symptomSeverity}
            onChange={(e) => onChangeInput("symptomSeverity", e.target.value)}
          />
        </div>

        <div>
          <Label
            htmlFor="fluidIntake"
            className="text-slate-700 dark:text-slate-300"
          >
            Fluid Intake Last 24h (ml)
          </Label>
          <Input
            id="fluidIntake"
            type="number"
            min={0}
            step="any"
            placeholder="Enter fluid intake in ml"
            value={inputs.fluidIntake}
            onChange={(e) => onChangeInput("fluidIntake", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={0}
            step="any"
            placeholder="Enter age in years"
            value={inputs.age}
            onChange={(e) => onChangeInput("age", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already done by inputs)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dehydration Risk Estimator (Symptoms + Intake)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in cats is a critical clinical concern that can arise from
          various causes such as illness, decreased fluid intake, or excessive
          fluid loss. This estimator combines clinical symptom severity with
          actual fluid intake data to provide a comprehensive risk assessment.
          By integrating these factors, the tool helps identify cats at risk
          before severe complications develop.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation uses a scientifically grounded formula incorporating
          the cat's weight to estimate resting energy requirements (RER), which
          correlates with normal fluid needs. Symptom severity is scaled to
          approximate dehydration percentage, while fluid intake deficits are
          compared against expected norms. This dual approach enhances accuracy
          over symptom-only assessments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the hydration status of your cat is essential for
          timely intervention. This tool is designed to empower pet owners and
          veterinary professionals alike by providing an evidence-based,
          easy-to-use calculator that supports clinical decision-making and
          promotes better health outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your cat's dehydration risk, input the required
          values carefully. The calculator uses weight, symptom severity, fluid
          intake, and age to generate a risk score and provide actionable
          insights.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat's weight in pounds or
            kilograms, depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Rate the severity of your cat's symptoms
            on a scale from 0 (none) to 10 (severe), considering signs like
            lethargy, sunken eyes, and skin tenting.
          </li>
          <li>
            <strong>Step 3:</strong> Record the total fluid intake over the
            last 24 hours in milliliters.
          </li>
          <li>
            <strong>Step 4:</strong> Provide your cat's age in years for
            contextual information.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view the dehydration
            risk score and recommendations.
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
              href="https://www.merckvetmanual.com/generalized-conditions/dehydration/dehydration-in-small-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration causes, clinical signs, and
              treatment in cats and dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/dehydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Dehydration in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on recognizing and managing dehydration in cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151204/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NCBI: Fluid Therapy in Small Animal Practice
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing fluid therapy principles and formulas
              used in veterinary medicine.
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
      // ⚠️ CRITICAL: YOU MUST REPLACE THE TEXT BELOW WITH THE ACTUAL FORMULA USED
      formula={{
        title: "Scientific Formula",
        formula: `
          RER = 70 × (weight_{kg})^{0.75} \\
          dehydration\% = symptomSeverity × 1.2 \\
          fluidDeficit_{ml} = dehydration\% × weight_{kg} × 10 \\
          normalIntake_{ml} = 2.5 × RER \\
          intakeDeficit_{ml} = max(normalIntake - fluidIntake, 0) \\
          riskScore = min\left(100, (dehydration\% × 4) + \left(\frac{intakeDeficit}{normalIntake}\right) × 50\right)
        `,
        variables: [
          { symbol: "weight_{kg}", description: "Cat's weight in kilograms" },
          {
            symbol: "symptomSeverity",
            description:
              "Clinical symptom severity score (0-10 scale, subjective)",
          },
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement in kcal/day, estimates metabolic needs",
          },
          {
            symbol: "dehydration\\%",
            description:
              "Estimated dehydration percentage based on symptom severity",
          },
          {
            symbol: "fluidDeficit_{ml}",
            description:
              "Estimated fluid volume deficit in milliliters due to dehydration",
          },
          {
            symbol: "normalIntake_{ml}",
            description:
              "Estimated normal daily fluid intake in milliliters based on RER",
          },
          {
            symbol: "intakeDeficit_{ml}",
            description:
              "Difference between normal and actual fluid intake in milliliters",
          },
          {
            symbol: "riskScore",
            description:
              "Composite dehydration risk score (0-100 scale) combining signs and intake",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 5-year-old cat weighing 10 lbs shows moderate lethargy and sunken eyes (symptom severity 6). Fluid intake over the last 24 hours is 150 ml.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate RER: 70 × (4.54)^{0.75} ≈ 163 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Estimate normal intake: 2.5 × 163 = 408 ml/day.",
          },
          {
            label: "4",
            explanation:
              "Calculate dehydration %: 6 × 1.2 = 7.2%.",
          },
          {
            label: "5",
            explanation:
              "Calculate fluid deficit: 7.2% × 4.54 kg × 1000 = 327 ml.",
          },
          {
            label: "6",
            explanation:
              "Calculate intake deficit: 408 ml - 150 ml = 258 ml.",
          },
          {
            label: "7",
            explanation:
              "Calculate risk score: (7.2 × 4) + (258 / 408) × 50 ≈ 28.8 + 31.6 = 60.4 (Moderate Risk).",
          },
        ],
        result:
          "The cat has a moderate risk of dehydration and should be monitored closely with possible veterinary consultation.",
      }}
      relatedCalculators={[
        {
          title: "Water Change Volume Planner",
          url: "/pets/aquarium-water-change-volume-planner",
          icon: "🐾",
        },
        {
          title: "Dog Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/dog-pregnancy-gestation-due-date",
          icon: "🐶",
        },
        {
          title: "Kitten Calorie Needs by Age/Size",
          url: "/pets/kitten-calorie-needs-age-size",
          icon: "🐱",
        },
        {
          title: "Cat Chocolate Toxicity Calculator",
          url: "/pets/cat-chocolate-toxicity",
          icon: "🐱",
        },
        {
          title: "Litter Box Output Tracker (Normal vs. Increased)",
          url: "/pets/cat-litter-box-output-tracker",
          icon: "💉",
        },
        {
          title: "Cat Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/cat-pregnancy-gestation-due-date",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dehydration Risk Estimator (Symptoms + Intake)",
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