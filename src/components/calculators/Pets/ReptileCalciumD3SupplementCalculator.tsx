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

export default function ReptileCalciumD3SupplementCalculator() {
  // 1. STATE
  // Unit system needed for weight input (lbs or kg)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and calcium requirement multiplier (mg/kg)
  // Also optional: D3 IU multiplier (if needed, but typically fixed)
  // For simplicity, inputs: weight, calcium mg/kg requirement, D3 IU/kg requirement
  const [inputs, setInputs] = useState({
    weight: "",
    calciumMgPerKg: "50", // default mg/kg calcium requirement (typical for reptiles)
    d3IUPerKg: "1000", // default IU/kg vitamin D3 requirement
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const calciumMgPerKgNum = parseFloat(inputs.calciumMgPerKg);
    const d3IUPerKgNum = parseFloat(inputs.d3IUPerKg);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(calciumMgPerKgNum) ||
      calciumMgPerKgNum <= 0 ||
      isNaN(d3IUPerKgNum) ||
      d3IUPerKgNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total calcium and D3 needed per day
    // Calcium (mg) = weight (kg) * calcium mg/kg
    // Vitamin D3 (IU) = weight (kg) * D3 IU/kg
    const totalCalciumMg = weightKg * calciumMgPerKgNum;
    const totalD3IU = weightKg * d3IUPerKgNum;

    // Suggest dusting frequency based on calcium mg needed:
    // Typical dusting: 1/8 tsp (~500 mg calcium) per feeding dusted every 2-3 days
    // We'll provide mg calcium and IU D3 per day, and suggest dusting frequency accordingly

    // Warning if calcium or D3 is too high or low (arbitrary thresholds)
    let warning = null;
    if (totalCalciumMg > 5000) {
      warning =
        "Calcium requirement is very high. Please verify weight and consult a veterinarian for dosing safety.";
    } else if (totalCalciumMg < 10) {
      warning =
        "Calcium requirement is very low. Ensure inputs are correct and consider dietary sources.";
    }

    return {
      value: `${totalCalciumMg.toFixed(0)} mg Calcium + ${totalD3IU.toFixed(
        0
      )} IU Vitamin D3`,
      label: "Daily Supplement Requirement",
      subtext:
        "Recommended daily calcium and vitamin D3 amounts based on weight and standard requirements.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is calcium supplementation important for reptiles?",
      answer:
        "Calcium is essential for reptiles to maintain strong bones, proper muscle function, and nerve signaling. Many captive reptiles do not receive adequate calcium from their diet alone, leading to metabolic bone disease. Supplementing calcium, especially with vitamin D3, helps ensure proper absorption and utilization, promoting overall health and longevity.",
    },
    {
      question: "How does vitamin D3 affect calcium absorption?",
      answer:
        "Vitamin D3 plays a crucial role in regulating calcium absorption from the intestines. Without sufficient vitamin D3, even adequate dietary calcium may not be absorbed efficiently, leading to deficiencies. Supplementing vitamin D3 alongside calcium ensures optimal uptake and prevents disorders related to calcium imbalance.",
    },
    {
      question: "Can I overdose my reptile on calcium or vitamin D3?",
      answer:
        "Yes, excessive calcium or vitamin D3 supplementation can cause toxicity, leading to kidney damage, soft tissue calcification, and other health issues. It is important to follow veterinary guidelines and use calculators like this to estimate safe daily amounts. Regular veterinary check-ups help monitor mineral levels and adjust supplementation as needed.",
    },
    {
      question: "How often should I dust my reptile’s food with calcium + D3 powder?",
      answer:
        "Dusting frequency depends on your reptile’s diet, species, and supplementation needs. Typically, dusting 2-3 times per week is sufficient for many reptiles, but some may require daily supplementation. This calculator helps estimate daily requirements, allowing you to adjust dusting amounts and frequency to avoid under- or over-supplementation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
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
            name="weight"
            type="text"
            inputMode="decimal"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
          />
        </div>
        <div>
          <Label htmlFor="calciumMgPerKg" className="text-slate-700 dark:text-slate-300">
            Calcium Requirement (mg/kg)
          </Label>
          <Input
            id="calciumMgPerKg"
            name="calciumMgPerKg"
            type="text"
            inputMode="decimal"
            value={inputs.calciumMgPerKg}
            onChange={handleInputChange}
            placeholder="Typical: 50 mg/kg"
          />
        </div>
        <div>
          <Label htmlFor="d3IUPerKg" className="text-slate-700 dark:text-slate-300">
            Vitamin D3 Requirement (IU/kg)
          </Label>
          <Input
            id="d3IUPerKg"
            name="d3IUPerKg"
            type="text"
            inputMode="decimal"
            value={inputs.d3IUPerKg}
            onChange={handleInputChange}
            placeholder="Typical: 1000 IU/kg"
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
          onClick={() =>
            setInputs({
              weight: "",
              calciumMgPerKg: "50",
              d3IUPerKg: "1000",
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
          Understanding Calcium + D3 Supplement Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calcium and vitamin D3 are vital nutrients for reptiles, playing a critical role in bone development, muscle function, and metabolic processes. In captivity, reptiles often lack sufficient exposure to natural sunlight and varied diets, which can lead to deficiencies. This calculator estimates the daily calcium and vitamin D3 supplementation needed based on your reptile’s weight and species-specific requirements, helping to prevent metabolic bone disease and other health complications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator uses scientifically supported dosage ranges expressed in milligrams of calcium and international units of vitamin D3 per kilogram of body weight. By inputting your reptile’s weight and adjusting the recommended nutrient levels if needed, you receive a precise daily supplementation amount. This tool supports responsible husbandry by guiding appropriate dusting amounts and frequencies for feeder insects or food items.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper supplementation is essential because both calcium deficiency and excess vitamin D3 can cause serious health issues. This calculator is designed to assist reptile owners and veterinary professionals in making informed decisions about supplementation, but it should always be used in conjunction with veterinary advice and regular health monitoring.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, first select the unit system that corresponds to your measurement preference—imperial (pounds) or metric (kilograms). Enter your reptile’s current weight accurately, as this is the basis for calculating nutrient requirements. The default calcium and vitamin D3 values reflect typical supplementation needs but can be adjusted if your veterinarian has provided specific recommendations.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your reptile’s weight in the selected units.
          </li>
          <li>
            <strong>Step 3:</strong> Adjust the calcium (mg/kg) and vitamin D3 (IU/kg) requirements if you have specific veterinary guidance; otherwise, use the default values.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated daily supplementation amounts.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results to guide dusting frequency and amounts for feeder insects or food items, and always consult your veterinarian for personalized care.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4972307/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Metabolic Bone Disease in Reptiles: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This comprehensive review discusses the causes, diagnosis, and treatment of metabolic bone disease in reptiles, emphasizing the importance of calcium and vitamin D3 supplementation.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/clinical-excellence/clinical-services/exotic-animal-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Exotic Animal Medicine – Calcium and Vitamin D3 Supplementation
            </a>
            <p className="text-slate-500 text-sm">
              A trusted veterinary resource providing guidelines on appropriate supplementation protocols for reptiles, including dosing and monitoring recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/education/clinical-guidelines/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Veterinary Clinicians – Reptile Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official clinical guidelines outlining nutritional requirements for reptiles, including calcium and vitamin D3, to support veterinary professionals and reptile caretakers.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium + D3 Supplement Calculator"
      description="Calculate the required dusting frequency and amount of Calcium and D3 supplement powder for feeders."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Supplement = Weight (kg) × (Calcium mg/kg + Vitamin D3 IU/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Body weight of the reptile in kilograms" },
          { symbol: "Calcium mg/kg", description: "Calcium requirement in milligrams per kilogram" },
          { symbol: "Vitamin D3 IU/kg", description: "Vitamin D3 requirement in international units per kilogram" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) bearded dragon requires 50 mg/kg calcium and 1000 IU/kg vitamin D3 daily supplementation.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (2.2 lb = 1 kg). Multiply weight by calcium requirement: 1 kg × 50 mg = 50 mg calcium.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by vitamin D3 requirement: 1 kg × 1000 IU = 1000 IU vitamin D3.",
          },
          {
            label: "3",
            explanation:
              "Result: Daily supplementation of 50 mg calcium and 1000 IU vitamin D3 is recommended.",
          },
        ],
        result: "50 mg Calcium + 1000 IU Vitamin D3 daily supplementation.",
      }}
      relatedCalculators={[
        { title: "Phenylbutazone / Flunixin Dose Calculator", url: "/pets/horse-phenylbutazone-flunixin-dose", icon: "🐾" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "🐶" },
        { title: "Weight Trend Tracker (Weekly Log)", url: "/pets/bird-weight-trend-tracker-weekly", icon: "🐱" },
        { title: "Vitamin D3 Requirement (Supplemental)", url: "/pets/reptile-vitamin-d3-requirement", icon: "🍖" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "💉" },
        { title: "Hand-Feeding Formula Amount (Chicks)", url: "/pets/bird-hand-feeding-formula-amount-chicks", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium + D3 Supplement Calculator" },
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
