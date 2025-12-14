import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdAntibioticDoseReferenceCalculator() {
  // 1. STATE
  // Default unit system is imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and dose per kg
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.doseMgPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseNum) ||
      doseNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if input is in lbs
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate total dose in mg
    const totalDoseMg = weightKg * doseNum;

    // Warning if dose is unusually high or low (arbitrary thresholds)
    let warning = null;
    if (doseNum > 50) {
      warning =
        "The dose entered is quite high; verify with veterinary guidelines before administration.";
    } else if (doseNum < 1) {
      warning =
        "The dose entered is very low; ensure this is appropriate for the antibiotic and species.";
    }

    return {
      value: totalDoseMg.toFixed(2),
      label: "Total Antibiotic Dose (mg)",
      subtext: `Based on weight (${weightNum} ${unit === "imperial" ? "lbs" : "kg"}) and dose (${doseNum} mg/kg)`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is dosing antibiotics by mg/kg important in veterinary medicine?",
      answer:
        "Dosing antibiotics by mg/kg ensures that each animal receives an accurate amount of medication proportional to its body weight, which is crucial for efficacy and safety. Underdosing can lead to ineffective treatment and antibiotic resistance, while overdosing may cause toxicity. This weight-based approach helps tailor therapy to individual patients, improving outcomes and minimizing adverse effects.",
    },
    {
      question: "How do I convert weight from pounds to kilograms for this calculation?",
      answer:
        "To convert pounds to kilograms, divide the weight in pounds by 2.20462. This conversion is necessary because antibiotic doses are standardized per kilogram of body weight. Using the correct unit ensures accurate dosing and prevents errors that could compromise treatment safety and effectiveness.",
    },
    {
      question: "What should I do if the recommended antibiotic dose varies in veterinary references?",
      answer:
        "When dose recommendations vary, it is important to consider the specific species, infection type, and severity, as well as veterinary guidance. Always consult up-to-date, authoritative veterinary formularies or a veterinarian to determine the safest and most effective dose. Variations exist because of differences in drug pharmacokinetics and pathogen susceptibility.",
    },
    {
      question: "Can this calculator be used for all bird species and antibiotics?",
      answer:
        "This calculator provides a general dosing reference based on body weight but may not be suitable for all bird species or antibiotics. Different species metabolize drugs differently, and some antibiotics have narrow therapeutic windows. Always verify dosing with species-specific veterinary literature or consult a veterinarian before administration.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
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
            Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Enter the bird's body weight for accurate dosing.
          </p>
        </div>

        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Antibiotic Dose Reference (mg/kg)
          </Label>
          <Input
            id="doseMgPerKg"
            name="doseMgPerKg"
            type="text"
            inputMode="decimal"
            placeholder="Enter dose in mg per kg"
            value={inputs.doseMgPerKg}
            onChange={handleInputChange}
            aria-describedby="dose-desc"
          />
          <p id="dose-desc" className="text-xs text-slate-400 mt-1">
            Typical dose range based on veterinary guidelines.
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
          aria-label="Calculate antibiotic dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment decisions.
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
          Understanding Antibiotic Dose Reference (mg/kg)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Antibiotic dosing in veterinary medicine is critically based on the animal's body weight, typically expressed in milligrams per kilogram (mg/kg). This approach ensures that the medication is administered in a proportionate amount relative to the size of the animal, optimizing therapeutic efficacy while minimizing the risk of toxicity. Since birds vary widely in size and metabolism, precise dosing is essential to achieve effective treatment outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The mg/kg dosing reference serves as a standardized guideline derived from pharmacological studies and clinical experience. It accounts for the unique physiological characteristics of different species and the pharmacokinetics of various antibiotics. Using this reference helps veterinarians tailor treatments to individual patients, ensuring that the antibiotic concentration reaches therapeutic levels without causing harm.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to recognize that antibiotic dosing must be adjusted based on factors such as species, age, health status, and the severity of infection. Overdosing can lead to adverse effects and toxicity, while underdosing may result in ineffective treatment and contribute to antimicrobial resistance. Therefore, this dose reference is a vital tool in responsible veterinary antimicrobial stewardship.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to estimate the total antibiotic dose required for a bird based on its body weight and the recommended dose per kilogram. Begin by selecting the unit system that matches your measurement—either imperial (pounds) or metric (kilograms). Enter the bird's weight and the antibiotic dose reference in mg/kg, then calculate to receive the total dose in milligrams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (imperial or metric) to match your weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird's body weight accurately in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input the antibiotic dose reference (mg/kg) as recommended by veterinary guidelines.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to obtain the total antibiotic dose in milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Review any warnings and consult a veterinarian before administration.
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
              href="https://www.plumbsveterinarydrugs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Plumb's Veterinary Drug Handbook
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource for veterinary drug dosages, pharmacology, and clinical use.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guide covering diseases, treatments, and drug dosing for various animal species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians (AAV)
            </a>
            <p className="text-slate-500 text-sm">
              Professional organization providing avian-specific clinical guidelines and dosing recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Antibiotic Dose Reference (mg/kg)"
      description="Reference guide for common antibiotic dosages in birds by body weight (mg/kg)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Dose (mg) = Body Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Recommended antibiotic dose per kilogram" },
          { symbol: "Total Dose (mg)", description: "Calculated total antibiotic dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 3.5 lb parakeet requires an antibiotic with a recommended dose of 20 mg/kg. Calculate the total dose in mg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 3.5 lbs ÷ 2.20462 = 1.59 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Multiply weight in kg by dose: 1.59 kg × 20 mg/kg = 31.8 mg total dose.",
          },
        ],
        result: "The parakeet should receive approximately 31.8 mg of the antibiotic.",
      }}
      relatedCalculators={[
        { title: "Litter Box Output Tracker (Normal vs. Increased)", url: "/pets/cat-litter-box-output-tracker", icon: "🐾" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Dog Chocolate Toxicity Calculator", url: "/pets/dog-chocolate-toxicity", icon: "🐶" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Antibiotic Dose Reference (mg/kg)" },
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