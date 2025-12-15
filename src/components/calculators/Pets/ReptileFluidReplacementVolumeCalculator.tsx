import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReptileFluidReplacementVolumeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Weight and Dehydration Percentage
  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const dehydrationNum = parseFloat(inputs.dehydrationPercent);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(dehydrationNum) ||
      dehydrationNum < 0 ||
      dehydrationNum > 15
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid weight and dehydration percentage (0-15%).",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Fluid Replacement Volume (mL) = Weight (kg) × Dehydration % × 10
    // 10 mL/kg per 1% dehydration is standard for reptiles (subcutaneous fluids)
    const volume = weightKg * dehydrationNum * 10;

    // Round to nearest 10 mL for practical use
    const roundedVolume = Math.round(volume / 10) * 10;

    return {
      value: `${roundedVolume.toLocaleString()} mL`,
      label: "Estimated Fluid Replacement Volume",
      subtext:
        "Volume of subcutaneous fluids needed to correct dehydration over 24 hours.",
      warning:
        dehydrationNum > 10
          ? "Severe dehydration detected. Consult a veterinarian immediately for intensive care."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate fluid replacement volume accurately in reptiles?",
      answer:
        "Reptiles have unique physiology and fluid balance compared to mammals, making precise fluid therapy essential. Overhydration can cause complications such as edema, while underhydration delays recovery and worsens dehydration effects. Accurate calculations ensure safe and effective rehydration tailored to the reptile's specific needs.",
    },
    {
      question: "How does dehydration percentage affect the fluid replacement volume?",
      answer:
        "The dehydration percentage reflects the severity of fluid loss in the reptile's body. Higher dehydration percentages require proportionally more fluids to restore normal hydration levels. This calculator uses the dehydration percentage to scale the fluid volume, ensuring the treatment matches the animal's clinical condition.",
    },
    {
      question: "Why do we multiply weight by 10 mL per percent dehydration?",
      answer:
        "The factor of 10 mL per kilogram per percent dehydration is a veterinary standard for reptiles receiving subcutaneous fluids. It accounts for the total fluid deficit in the body that needs replacement. This simplified formula helps clinicians quickly estimate the volume needed without complex calculations.",
    },
    {
      question: "Can this calculator be used for all reptile species and sizes?",
      answer:
        "While this calculator provides a general guideline, fluid requirements can vary among reptile species, age, and health status. It is best used as an initial estimate, and adjustments should be made based on clinical judgment and monitoring. Always consult a veterinarian for species-specific protocols and critical cases.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
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
            name="weight"
            type="text"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Animal's body weight for fluid calculation.
          </p>
        </div>

        <div>
          <Label htmlFor="dehydrationPercent" className="text-slate-700 dark:text-slate-300">
            Dehydration Percentage (%)
          </Label>
          <Input
            id="dehydrationPercent"
            name="dehydrationPercent"
            type="text"
            placeholder="Enter dehydration % (e.g. 5)"
            value={inputs.dehydrationPercent}
            onChange={handleInputChange}
            aria-describedby="dehydration-desc"
          />
          <p id="dehydration-desc" className="text-xs text-slate-400 mt-1">
            Estimated dehydration severity (0-15% typical range).
          </p>
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
          onClick={() => setInputs({ weight: "", dehydrationPercent: "" })}
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
          Understanding Fluid Replacement Volume Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Fluid Replacement Volume Calculator is a vital tool designed specifically for veterinary professionals and reptile caregivers to estimate the volume of subcutaneous fluids required to treat dehydration in reptiles. Dehydration in reptiles can be subtle yet life-threatening, and accurate fluid therapy is essential to restore their hydration balance safely. This calculator simplifies the process by using weight and dehydration severity to provide a reliable fluid volume estimate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Reptiles have different fluid distribution and metabolic rates compared to mammals, which necessitates specialized calculations for fluid therapy. The calculator applies a standard veterinary formula that multiplies the animal's weight by the dehydration percentage and a constant factor to determine the total fluid deficit. This approach ensures that the volume administered matches the physiological needs of the reptile, minimizing risks associated with improper hydration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By providing a quick, evidence-based estimate, this tool supports clinical decision-making and enhances treatment accuracy. It is especially useful in emergency settings or fieldwork where rapid assessment is critical. However, it should always be used in conjunction with clinical judgment and ongoing patient monitoring to adjust fluid therapy as needed.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only two key inputs: the reptile's body weight and the estimated dehydration percentage. Begin by selecting the appropriate unit system—Imperial (pounds) or Metric (kilograms)—to match your measurement preference. Enter the animal's weight accurately, as this directly influences the fluid volume calculation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Input the reptile's weight in the selected unit system. Ensure the value is positive and realistic for the species.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the dehydration percentage, which is typically estimated through clinical signs such as skin tenting, mucous membrane dryness, and sunken eyes. This value usually ranges from 0% (no dehydration) to 15% (severe dehydration).
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate the estimated fluid replacement volume in milliliters. The result reflects the total volume needed to correct the dehydration over approximately 24 hours.
          </li>
          <li>
            <strong>Step 4:</strong> Use the provided volume as a guideline for subcutaneous fluid administration, adjusting as necessary based on ongoing clinical assessment and veterinary advice.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/reptiles/fluid-therapy-in-reptiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Fluid Therapy in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of fluid therapy principles and protocols specific to reptilian patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151207/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Clinical Veterinary Advisor: Reptile Fluid Therapy Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based guidelines for calculating and administering fluids in dehydrated reptiles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetstream.com/treat/exotic/reptiles/fluid-therapy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Vetstream: Fluid Therapy in Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice and clinical tips for fluid replacement in various reptile species.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fluid Replacement Volume Calculator"
      description="Calculate the necessary volume of subcutaneous fluids for a dehydrated reptile based on its weight and severity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Fluid Volume (mL) = Weight (kg) × Dehydration % × 10",
        variables: [
          { symbol: "Weight (kg)", description: "Body weight of the reptile in kilograms" },
          { symbol: "Dehydration %", description: "Estimated percentage of dehydration" },
          { symbol: "10", description: "Constant factor representing mL per kg per % dehydration" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) bearded dragon is estimated to be 8% dehydrated after clinical examination.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (already 1 kg in this case).",
          },
          {
            label: "2",
            explanation:
              "Multiply weight (1 kg) by dehydration percentage (8%) and factor 10: 1 × 8 × 10 = 80 mL.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 80 mL of subcutaneous fluids over 24 hours to correct dehydration.",
          },
        ],
        result: "Estimated fluid replacement volume is 80 mL.",
      }}
      relatedCalculators={[
        {
          title: "Environmental Enrichment Planner (per room)",
          url: "/pets/cat-environmental-enrichment-planner",
          icon: "🐾",
        },
        {
          title: "Dog Grape/Raisin Exposure Risk Calculator",
          url: "/pets/dog-grape-raisin-exposure-risk",
          icon: "🐶",
        },
        {
          title: "pH Adjustment (Acid/Base Buffer) Calculator",
          url: "/pets/aquarium-ph-adjustment-buffer",
          icon: "🐱",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
        {
          title: "Insulin Starter Reference (info-only)",
          url: "/pets/cat-insulin-starter-reference",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fluid Replacement Volume Calculator" },
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