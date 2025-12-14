import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdCalciumSupplementDosageBreedingFemalesCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), calcium requirement mg/kg/day (default typical), optional notes
  const [inputs, setInputs] = useState({
    weight: "",
    calciumRequirement: "100", // mg/kg/day typical for breeding females
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const calciumReqNum = parseFloat(inputs.calciumRequirement);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(calciumReqNum) || calciumReqNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Dose in mg = weight (kg) * calcium requirement (mg/kg/day)
    const doseMg = weightKg * calciumReqNum;

    // Convert mg to grams for easier dosing if > 1000 mg
    const doseDisplay =
      doseMg >= 1000 ? (doseMg / 1000).toFixed(2) + " g/day" : doseMg.toFixed(0) + " mg/day";

    // Warning if dose is unusually high or low
    let warning = null;
    if (calciumReqNum < 50) {
      warning =
        "The calcium requirement entered is below typical recommended levels. Confirm with a veterinary specialist.";
    } else if (calciumReqNum > 200) {
      warning =
        "The calcium requirement entered is above typical recommended levels. Excess calcium can be harmful.";
    }

    return {
      value: doseDisplay,
      label: "Recommended Calcium Supplement Dose",
      subtext:
        "Based on weight and calcium requirement for breeding female birds. Adjust per veterinary advice.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is calcium supplementation critical for breeding female birds?",
      answer:
        "Calcium plays a vital role in eggshell formation and overall reproductive health in breeding females. Insufficient calcium can lead to weak eggshells, egg binding, or metabolic bone disease. Supplementation ensures adequate calcium availability during the high-demand breeding period, supporting both the female's health and successful reproduction.",
    },
    {
      question: "How is the calcium supplement dosage calculated for breeding females?",
      answer:
        "Dosage is typically calculated based on the bird's body weight and the recommended calcium requirement per kilogram of body weight per day. This approach ensures the dose is tailored to the individual bird's size and physiological needs. The formula multiplies weight (in kg) by the calcium requirement (mg/kg/day) to estimate the daily supplement dose.",
    },
    {
      question: "Can overdosing calcium supplements harm breeding female birds?",
      answer:
        "Yes, excessive calcium supplementation can cause hypercalcemia, leading to kidney damage, soft tissue calcification, and impaired absorption of other minerals. It is essential to follow veterinary guidelines and avoid exceeding recommended doses. Regular monitoring and adjusting supplementation based on the bird's condition help prevent toxicity.",
    },
    {
      question: "What factors influence the calcium requirements in breeding female birds?",
      answer:
        "Calcium needs vary depending on species, age, reproductive stage, diet quality, and overall health status. Egg-laying females have significantly higher calcium demands compared to non-breeding birds. Environmental factors and stress can also affect calcium metabolism, necessitating careful supplementation planning.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="calciumRequirement" className="text-slate-700 dark:text-slate-300">
            Calcium Requirement (mg/kg/day)
          </Label>
          <Input
            id="calciumRequirement"
            type="number"
            min="0"
            step="any"
            placeholder="Typical: 100 mg/kg/day"
            value={inputs.calciumRequirement}
            onChange={(e) => setInputs({ ...inputs, calciumRequirement: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (noop)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", calciumRequirement: "100" })}
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
          Understanding Calcium Supplement Dosage (Breeding Females)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calcium is an essential mineral for breeding female birds, playing a critical role in eggshell formation and maintaining skeletal integrity during the reproductive cycle. During egg production, calcium demand increases substantially, often exceeding dietary intake from regular feed. Without adequate supplementation, females risk developing metabolic bone disease, egg binding, or producing fragile eggshells that compromise embryo viability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calcium supplement dosage must be carefully calculated based on the bird's body weight and specific physiological needs during breeding. Over- or under-supplementation can have serious health consequences, including toxicity or deficiency symptoms. Therefore, understanding the correct dosage and monitoring the bird’s response is vital for successful breeding and long-term health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator provides a scientifically grounded estimate of the daily calcium supplement dose required for breeding females, allowing veterinarians and avian caretakers to tailor supplementation precisely. It incorporates weight-based dosing principles widely accepted in veterinary medicine, ensuring a balance between efficacy and safety. Always consult with a qualified avian veterinarian before making supplementation changes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, input the bird's weight in the selected unit system—either pounds or kilograms. Next, enter the calcium requirement in milligrams per kilogram of body weight per day, which typically defaults to 100 mg/kg/day for breeding females. This value can be adjusted based on veterinary recommendations or specific species needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that matches your measurement preference (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s current weight accurately to ensure precise dosage calculation.
          </li>
          <li>
            <strong>Step 3:</strong> Input the calcium requirement per kg body weight per day, or use the default value if unsure.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily calcium supplement dose.
          </li>
          <li>
            <strong>Step 5:</strong> Consult your avian veterinarian to interpret the results and adjust supplementation as needed.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Nutrition in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of avian nutrition requirements including calcium metabolism and supplementation during breeding.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Calcium Metabolism and Eggshell Formation in Birds - NCBI PMC
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing calcium physiology and supplementation strategies for breeding female birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians - Avian Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on nutrient requirements and supplementation protocols for breeding birds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium Supplement Dosage (Breeding Females)"
      description="Determine the appropriate calcium supplement dose for egg-laying and breeding female birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Calcium Dose (mg/day) = Body Weight (kg) × Calcium Requirement (mg/kg/day)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Calcium Requirement (mg/kg/day)", description: "Recommended calcium intake per kg body weight per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A breeding female parrot weighs 2.5 lbs (1.13 kg) and requires 100 mg/kg/day of calcium supplementation.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 2.5 lbs ÷ 2.20462 = 1.13 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by calcium requirement: 1.13 kg × 100 mg/kg/day = 113 mg/day.",
          },
          {
            label: "3",
            explanation:
              "Recommend a daily calcium supplement dose of approximately 113 mg to support breeding needs.",
          },
        ],
        result: "Daily calcium supplement dose: 113 mg/day.",
      }}
      relatedCalculators={[
        { title: "Filter Flow Rate Calculator", url: "/pets/aquarium-filter-flow-rate", icon: "🐾" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "🐱" },
        { title: "Senior Cat Care Readiness Checklist (scored helper)", url: "/pets/senior-cat-care-readiness-checklist", icon: "🐱" },
        { title: "Cephalexin Dose Calculator for Cats", url: "/pets/cat-cephalexin-dose", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium Supplement Dosage (Breeding Females)" },
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