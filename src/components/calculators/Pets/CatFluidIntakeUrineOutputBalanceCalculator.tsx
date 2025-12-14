import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatFluidIntakeUrineOutputBalanceCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs, oz, fl oz)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Fluid Intake (fl oz), Urine Output (fl oz), Weight (lbs)
  const [inputs, setInputs] = useState({
    weight: "",
    fluidIntake: "",
    urineOutput: "",
  });

  // Helper: convert lbs to kg
  const lbsToKg = (lbs: number) => lbs / 2.20462;

  // Helper: convert fl oz to mL
  const flozToMl = (floz: number) => floz * 29.5735;

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightLbs = parseFloat(inputs.weight);
    const fluidIntakeFlOz = parseFloat(inputs.fluidIntake);
    const urineOutputFlOz = parseFloat(inputs.urineOutput);

    if (
      isNaN(weightLbs) ||
      isNaN(fluidIntakeFlOz) ||
      isNaN(urineOutputFlOz) ||
      weightLbs <= 0 ||
      fluidIntakeFlOz < 0 ||
      urineOutputFlOz < 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert to metric internally for veterinary standard units
    const weightKg = lbsToKg(weightLbs);
    const fluidIntakeMl = flozToMl(fluidIntakeFlOz);
    const urineOutputMl = flozToMl(urineOutputFlOz);

    // Calculate intake and output per kg body weight (mL/kg)
    const intakePerKg = fluidIntakeMl / weightKg;
    const outputPerKg = urineOutputMl / weightKg;

    // Calculate balance ratio: urine output / fluid intake (unitless)
    // Ideal ratio ~0.8 to 1.2 (80-120%)
    const balanceRatio = intakePerKg === 0 ? 0 : outputPerKg / intakePerKg;

    // Interpret balance
    let label = "";
    let subtext = "";
    let warning = null;

    if (balanceRatio === 0) {
      label = "No urine output recorded";
      subtext = "Please ensure urine output is measured accurately.";
      warning = "No urine output may indicate urinary obstruction or dehydration.";
    } else if (balanceRatio < 0.7) {
      label = "Negative Fluid Balance";
      subtext =
        "Urine output is significantly less than fluid intake, which may indicate fluid retention or kidney dysfunction.";
      warning =
        "Consult a veterinarian promptly if low urine output persists, as it may signal serious health issues.";
    } else if (balanceRatio > 1.3) {
      label = "Positive Fluid Loss";
      subtext =
        "Urine output exceeds fluid intake, which may indicate dehydration or excessive fluid loss.";
      warning =
        "Monitor your cat closely and consult a veterinarian if excessive urine output continues.";
    } else {
      label = "Balanced Fluid Status";
      subtext =
        "Urine output is within a healthy range relative to fluid intake, indicating good kidney function and hydration.";
      warning = null;
    }

    // Display ratio as percentage with 1 decimal place
    const ratioPercent = (balanceRatio * 100).toFixed(1) + "%";

    return {
      value: ratioPercent,
      label,
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is monitoring fluid intake versus urine output important in cats?",
      answer:
        "Monitoring the balance between fluid intake and urine output is crucial because it reflects kidney function and hydration status. Cats with kidney disease or urinary tract issues often show imbalances that can be detected early through this monitoring. By tracking these values, owners and veterinarians can intervene promptly to prevent complications and maintain optimal health.",
    },
    {
      question: "How can I accurately measure my cat's urine output at home?",
      answer:
        "Measuring urine output at home can be challenging but is possible with a clean litter box or urine collection tray designed for cats. Use non-absorbent litter or specialized collection devices to capture urine, then measure the volume with a syringe or graduated container. Consistency and hygiene are important to avoid contamination and ensure accurate readings for veterinary assessment.",
    },
    {
      question: "What does it mean if my cat's urine output is much lower than fluid intake?",
      answer:
        "A urine output significantly lower than fluid intake may indicate fluid retention, dehydration, or impaired kidney function. This imbalance suggests the kidneys are not effectively filtering and excreting fluids, which can lead to toxin buildup. Prompt veterinary evaluation is essential to diagnose the underlying cause and initiate appropriate treatment.",
    },
    {
      question: "Can this calculator replace veterinary diagnosis for kidney or urinary issues?",
      answer:
        "No, this calculator is an educational tool designed to help monitor fluid balance but cannot replace professional veterinary diagnosis. Kidney and urinary tract diseases require comprehensive clinical evaluation, laboratory tests, and imaging. Always consult your veterinarian for accurate diagnosis and treatment recommendations based on your cat's specific condition.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
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
              <SelectItem value="imperial">Imperial (lbs, fl oz)</SelectItem>
              <SelectItem value="metric">Metric (kg, mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="fluidIntake" className="text-slate-700 dark:text-slate-300">
            Fluid Intake ({unit === "imperial" ? "fl oz" : "mL"})
          </Label>
          <Input
            id="fluidIntake"
            name="fluidIntake"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 8" : "e.g. 240"}
            value={inputs.fluidIntake}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="urineOutput" className="text-slate-700 dark:text-slate-300">
            Urine Output ({unit === "imperial" ? "fl oz" : "mL"})
          </Label>
          <Input
            id="urineOutput"
            name="urineOutput"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 7" : "e.g. 210"}
            value={inputs.urineOutput}
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
          onClick={() => setInputs({ weight: "", fluidIntake: "", urineOutput: "" })}
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
          Understanding Fluid Intake vs. Urine Output Balance Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Fluid Intake vs. Urine Output Balance Checker is a vital veterinary tool designed to assess the equilibrium between the amount of liquid a cat consumes and the volume of urine it produces. This balance is a critical indicator of renal function and overall hydration status. Maintaining an appropriate fluid balance helps prevent complications such as dehydration, kidney disease progression, and urinary tract disorders.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By evaluating fluid intake relative to urine output normalized to body weight, veterinarians and pet owners can detect early signs of fluid retention or excessive fluid loss. This tool uses standardized veterinary metrics, converting inputs into milliliters per kilogram, to provide an accurate and clinically relevant assessment. Understanding these values supports timely interventions and improves long-term health outcomes for cats.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This balance checker is particularly useful for monitoring cats with chronic kidney disease, urinary tract infections, or those recovering from surgery. It empowers caregivers to track subtle changes in hydration and kidney function at home, facilitating communication with veterinary professionals. Ultimately, this calculator enhances proactive health management through precise, evidence-based evaluation.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, begin by selecting your preferred unit system: Imperial (pounds and fluid ounces) or Metric (kilograms and milliliters). Enter your cat's weight, the total fluid intake over a 24-hour period, and the total urine output measured during the same timeframe. Accurate measurement of these values is essential for reliable results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Weigh your cat using a reliable scale and input the weight in the selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the total fluid your cat drinks in 24 hours, including water, broth, or other liquids.
          </li>
          <li>
            <strong>Step 3:</strong> Collect and measure your cat's urine output over the same 24-hour period using a non-absorbent litter or collection device.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the balance ratio and interpretation, which helps assess hydration and kidney function.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to monitor trends over time and consult your veterinarian if abnormalities persist.
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
              href="https://www.acvima.org/resources/clinical-guidelines/fluid-therapy-in-small-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ACVIM Consensus Statement on Fluid Therapy in Small Animals
            </a>
            <p className="text-slate-500 text-sm">
              This guideline provides comprehensive information on fluid balance, hydration assessment, and renal function monitoring in small animals, including cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/urinary-system/urine-formation-and-excretion/overview-of-urine-formation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Overview of Urine Formation
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of the physiology of urine production and its clinical significance in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/chronic-kidney-disease-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Chronic Kidney Disease in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on monitoring and managing kidney disease in cats, emphasizing fluid balance and urine output.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fluid Intake vs. Urine Output Balance Checker"
      description="Check the balance between liquid consumed and liquid expelled, key for monitoring kidney function."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Balance Ratio = (Urine Output per kg) ÷ (Fluid Intake per kg)",
        variables: [
          { symbol: "Urine Output per kg", description: "Urine volume normalized to body weight (mL/kg)" },
          { symbol: "Fluid Intake per kg", description: "Fluid intake normalized to body weight (mL/kg)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat drinks 8 fl oz of water and produces 7 fl oz of urine in 24 hours. Calculate the fluid balance ratio.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lb ÷ 2.20462 = 4.54 kg. Convert volumes to mL: 8 fl oz × 29.5735 = 236.59 mL intake, 7 fl oz × 29.5735 = 207.01 mL output.",
          },
          {
            label: "2",
            explanation:
              "Calculate intake per kg: 236.59 mL ÷ 4.54 kg = 52.1 mL/kg. Calculate output per kg: 207.01 mL ÷ 4.54 kg = 45.6 mL/kg.",
          },
          {
            label: "3",
            explanation:
              "Calculate balance ratio: 45.6 ÷ 52.1 = 0.88 (88%), indicating balanced fluid status within normal range.",
          },
        ],
        result: "The cat's fluid balance ratio is 88%, suggesting healthy hydration and kidney function.",
      }}
      relatedCalculators={[
        {
          title: "Foaling Countdown & Lactation Feed Planner",
          url: "/pets/horse-foaling-countdown-lactation-feed-planner",
          icon: "🐾",
        },
        {
          title: "Ideal Weight & Target Calories for Cats",
          url: "/pets/cat-ideal-weight-target-calories",
          icon: "🐱",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Caffeine Toxicity Calculator",
          url: "/pets/dog-caffeine-toxicity",
          icon: "🐶",
        },
        {
          title: "Prednisone/Prednisolone Dose Calculator for Dogs",
          url: "/pets/dog-prednisone-prednisolone-dose",
          icon: "🐶",
        },
        {
          title: "Dog Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/dog-pregnancy-gestation-due-date",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fluid Intake vs. Urine Output Balance Checker" },
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