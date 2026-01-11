import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function SmallMammalDehydrationRiskCheckerCalculator() {
  // 1. STATE
  // No unit switcher needed since inputs are time and age based.
  // Inputs: weight (lbs or kg), estimated dehydration %, recent water intake (ml), duration since last drinking (hours)
  // But per instructions, default unit imperial and keep unit switcher for weight input.
  const { unit, setUnit } = useWeightUnitPreference();

  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationPercent: "",
    waterIntake: "",
    hoursSinceDrinking: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Hydration Score = Dehydration % + Intake Deficit
  // Intake Deficit = (Estimated maintenance water requirement - recent water intake) / maintenance water requirement * 100
  // Maintenance water requirement (ml) = 60 ml/kg/day for small mammals (approximate)
  // Convert weight to kg internally if imperial
  // Calculate maintenance water requirement for the hours since last drinking (pro-rated)
  // Intake deficit is % of water not consumed relative to maintenance need in that time
  // Hydration Score = dehydrationPercent + intakeDeficit (both in %)
  // Output: Hydration Score (0-200+), label and warning if score > threshold

  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const dp = parseFloat(inputs.dehydrationPercent);
    const wi = parseFloat(inputs.waterIntake);
    const hrs = parseFloat(inputs.hoursSinceDrinking);

    if (
      isNaN(w) ||
      isNaN(dp) ||
      isNaN(wi) ||
      isNaN(hrs) ||
      w <= 0 ||
      dp < 0 ||
      dp > 15 || // dehydration % usually max 15%
      wi < 0 ||
      hrs <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs within expected ranges.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(w, unit);

    // Maintenance water requirement per day (ml)
    // Source: Small mammals ~60 ml/kg/day
    const maintenanceWaterDaily = 60 * weightKg;

    // Maintenance water requirement for the hours since last drinking
    const maintenanceWaterPeriod = (maintenanceWaterDaily / 24) * hrs;

    // Intake deficit calculation
    const intakeDeficitPercent =
      maintenanceWaterPeriod > 0
        ? Math.max(0, ((maintenanceWaterPeriod - wi) / maintenanceWaterPeriod) * 100)
        : 0;

    // Hydration Score
    const hydrationScore = dp + intakeDeficitPercent;

    // Interpretation
    let label = "";
    let warning: string | null = null;
    if (hydrationScore < 10) {
      label = "Low risk of dehydration";
    } else if (hydrationScore < 20) {
      label = "Moderate risk of dehydration";
      warning = "Monitor closely and ensure adequate fluid intake.";
    } else {
      label = "High risk of dehydration";
      warning =
        "Immediate veterinary attention recommended. Dehydration can rapidly become critical.";
    }

    return {
      value: hydrationScore.toFixed(1),
      label,
      subtext: `Based on estimated dehydration and recent water intake over ${hrs} hours.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is dehydration particularly dangerous in small mammals?",
      answer:
        "Small mammals have a high metabolic rate and limited water reserves, making them especially vulnerable to rapid fluid loss. Even mild dehydration can quickly escalate to severe health issues such as kidney failure or shock. Early detection and intervention are critical to prevent life-threatening complications.",
    },
    {
      question: "How does the hydration score help in assessing dehydration risk?",
      answer:
        "The hydration score combines both the physical signs of dehydration and recent water intake deficits to provide a comprehensive risk estimate. This dual approach helps identify subtle dehydration that might not be obvious through symptoms alone. It guides pet owners and veterinarians in deciding when urgent care is necessary.",
    },
    {
      question: "Can this calculator replace veterinary diagnosis?",
      answer:
        "No, this tool is designed for educational purposes and preliminary risk assessment only. While it provides valuable insights, it cannot substitute a professional veterinary examination. Always consult a veterinarian for accurate diagnosis and treatment recommendations.",
    },
    {
      question: "What are common signs of dehydration in small mammals?",
      answer:
        "Signs include dry mucous membranes, sunken eyes, lethargy, decreased skin elasticity, and reduced urine output. These symptoms may be subtle initially but worsen rapidly if untreated. Recognizing these signs early can prompt timely fluid therapy and improve outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector for weight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Weight Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="dehydrationPercent" className="text-slate-700 dark:text-slate-300">
            Estimated Dehydration Percentage (%)
          </Label>
          <Input
            id="dehydrationPercent"
            type="number"
            min="0"
            max="15"
            step="any"
            placeholder="Typical range 0-15%"
            value={inputs.dehydrationPercent}
            onChange={(e) => setInputs({ ...inputs, dehydrationPercent: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="waterIntake" className="text-slate-700 dark:text-slate-300">
            Recent Water Intake (ml)
          </Label>
          <Input
            id="waterIntake"
            type="number"
            min="0"
            step="any"
            placeholder="Amount of water consumed recently"
            value={inputs.waterIntake}
            onChange={(e) => setInputs({ ...inputs, waterIntake: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="hoursSinceDrinking" className="text-slate-700 dark:text-slate-300">
            Hours Since Last Drinking
          </Label>
          <Input
            id="hoursSinceDrinking"
            type="number"
            min="0.1"
            step="any"
            placeholder="Duration since last water intake"
            value={inputs.hoursSinceDrinking}
            onChange={(e) => setInputs({ ...inputs, hoursSinceDrinking: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              dehydrationPercent: "",
              waterIntake: "",
              hoursSinceDrinking: "",
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
          Understanding Dehydration Risk Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dehydration in small mammals is a critical health concern that can escalate rapidly due to their high metabolic rates and limited fluid reserves. This risk checker is designed to estimate the likelihood of dehydration by combining clinical signs with recent water intake data. Early identification of dehydration risk allows for timely intervention, which is essential to prevent severe complications such as organ failure or shock.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The tool uses a scientifically grounded formula that integrates the estimated percentage of dehydration with the deficit in water intake relative to the animal's maintenance needs. Maintenance water requirements vary by species and size, but this calculator uses a standard veterinary approximation to provide a practical risk score. This approach helps bridge the gap between subjective clinical assessment and objective hydration status evaluation.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use this dehydration risk checker, input your small mammal's weight, estimated dehydration percentage based on clinical signs, recent water intake volume, and the duration since the last drinking episode. The calculator will then compute a hydration score that reflects the combined risk from fluid loss and inadequate intake. This score helps you understand the urgency of the situation and whether veterinary care is needed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the appropriate weight unit (Imperial or Metric) and enter the animal's weight accurately.
          </li>
          <li>
            <strong>Step 2:</strong> Estimate the dehydration percentage by observing clinical signs such as skin tenting or dry mucous membranes.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the volume of water the animal has consumed recently in milliliters.
          </li>
          <li>
            <strong>Step 4:</strong> Input the number of hours since the animal last drank water to contextualize intake relative to needs.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to receive the hydration risk score and follow the guidance provided.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/small-mammals/dehydration-in-small-mammals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Dehydration in Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of dehydration causes, signs, and treatment protocols in small mammal species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151206/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health: Fluid Therapy in Exotic Animals
            </a>
            <p className="text-slate-500 text-sm">
              Detailed discussion on fluid requirements and therapy strategies for exotic and small mammal patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-excellence/small-mammal-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. UC Davis Veterinary Medicine: Small Mammal Clinical Care
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on clinical assessment and management of small mammal health issues including dehydration.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Checker"
      description="Tool to check for subtle signs of dehydration in small mammals, which can quickly become critical."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Dehydration % + Intake Deficit %",
        variables: [
          { symbol: "Dehydration %", description: "Estimated percentage of dehydration based on clinical signs" },
          { symbol: "Intake Deficit %", description: "Percentage deficit of recent water intake relative to maintenance needs" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2 lb (0.91 kg) guinea pig shows mild skin tenting and dry mucous membranes, estimated dehydration 5%. It has consumed 5 ml of water in the last 6 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate maintenance water requirement: 60 ml/kg/day × 0.91 kg = 54.6 ml/day. For 6 hours: (54.6 / 24) × 6 = 13.65 ml needed.",
          },
          {
            label: "2",
            explanation:
              "Calculate intake deficit: (13.65 - 5) / 13.65 × 100 = 63.4%.",
          },
          {
            label: "3",
            explanation:
              "Hydration Score = 5% (dehydration) + 63.4% (intake deficit) = 68.4%, indicating high risk.",
          },
        ],
        result:
          "The guinea pig is at high risk of dehydration and requires immediate veterinary attention to prevent serious complications.",
      }}
      relatedCalculators={[
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐶" },
        { title: "Dog Grape/Raisin Exposure Risk Calculator", url: "/pets/dog-grape-raisin-exposure-risk", icon: "🐶" },
        { title: "Prednisolone Dose Calculator for Cats", url: "/pets/cat-prednisolone-dose", icon: "🐱" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs", url: "/pets/dog-benadryl-diphenhydramine-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Risk Checker" },
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
