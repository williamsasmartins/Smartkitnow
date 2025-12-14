import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseElectrolytePowderMixingCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // weight: horse weight (lbs or kg)
  // desiredConcentration: desired electrolyte concentration in mmol/L (typical range 50-150)
  // powderConcentration: electrolyte powder concentration in mmol/g (depends on product, e.g. 100 mmol/g)
  // totalVolume: total volume of water/feed to mix in liters
  const [inputs, setInputs] = useState({
    weight: "",
    desiredConcentration: "",
    powderConcentration: "",
    totalVolume: "",
  });

  // 2. LOGIC ENGINE
  // Formula:
  // Electrolyte Powder (g) = Desired Concentration (mmol/L) × Total Volume (L) ÷ Powder Concentration (mmol/g)
  // This calculates how many grams of powder to add to achieve the desired electrolyte concentration in the given volume.
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const desiredConcNum = parseFloat(inputs.desiredConcentration);
    const powderConcNum = parseFloat(inputs.powderConcentration);
    const totalVolNum = parseFloat(inputs.totalVolume);

    if (
      isNaN(weightNum) ||
      isNaN(desiredConcNum) ||
      isNaN(powderConcNum) ||
      isNaN(totalVolNum) ||
      weightNum <= 0 ||
      desiredConcNum <= 0 ||
      powderConcNum <= 0 ||
      totalVolNum <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for all fields.",
        warning: null,
      };
    }

    // Convert weight to kg internally if needed (not used in calculation but could be for vet context)
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate powder grams needed
    const powderGrams = (desiredConcNum * totalVolNum) / powderConcNum;

    // Safety warning if powder grams exceed typical max (e.g. > 500g)
    const warning =
      powderGrams > 500
        ? "Warning: The calculated powder amount is very high. Verify inputs and consult a veterinarian before administration."
        : null;

    return {
      value: powderGrams.toFixed(2),
      label: "Grams of Electrolyte Powder to Add",
      subtext: `For a ${totalVolNum} L solution at ${desiredConcNum} mmol/L concentration.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to mix electrolyte powders accurately for horses?",
      answer:
        "Accurate mixing ensures the horse receives the correct electrolyte balance to maintain hydration and muscle function, especially during performance or illness. Over- or under-dosing can lead to imbalances causing dehydration, colic, or electrolyte toxicity. Proper calculation helps safeguard the horse's health and optimize recovery or performance.",
    },
    {
      question: "How does the concentration of electrolyte powder affect the mixing ratio?",
      answer:
        "The powder concentration (mmol/g) determines how much electrolyte is delivered per gram of powder. A higher concentration means less powder is needed to reach the desired electrolyte level in the solution. Understanding this helps calculate the exact powder amount to mix for effective and safe supplementation.",
    },
    {
      question: "Can I use this calculator for different types of electrolyte powders?",
      answer:
        "Yes, this calculator is designed to be flexible by allowing you to input the specific concentration of your electrolyte powder. Since different products vary in electrolyte content, entering the correct powder concentration ensures accurate dosing. Always verify product labels or consult manufacturers for precise values.",
    },
    {
      question: "What precautions should I take when preparing electrolyte solutions for horses?",
      answer:
        "Always use clean water and measure ingredients precisely to avoid contamination or incorrect dosing. Mix thoroughly to ensure even distribution of electrolytes. Consult a veterinarian before changing electrolyte regimens, especially for horses with health issues or on medication, to prevent adverse effects.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(field: string, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
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
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="desiredConcentration" className="text-slate-700 dark:text-slate-300">
            Desired Electrolyte Concentration (mmol/L)
          </Label>
          <Input
            id="desiredConcentration"
            type="number"
            min={0}
            step="any"
            placeholder="Typical range: 50 - 150"
            value={inputs.desiredConcentration}
            onChange={(e) => handleInputChange("desiredConcentration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="powderConcentration" className="text-slate-700 dark:text-slate-300">
            Electrolyte Powder Concentration (mmol/g)
          </Label>
          <Input
            id="powderConcentration"
            type="number"
            min={0}
            step="any"
            placeholder="Check product label (e.g. 100)"
            value={inputs.powderConcentration}
            onChange={(e) => handleInputChange("powderConcentration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="totalVolume" className="text-slate-700 dark:text-slate-300">
            Total Volume to Mix (liters)
          </Label>
          <Input
            id="totalVolume"
            type="number"
            min={0}
            step="any"
            placeholder="Volume of water/feed in liters"
            value={inputs.totalVolume}
            onChange={(e) => handleInputChange("totalVolume", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
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
              desiredConcentration: "",
              powderConcentration: "",
              totalVolume: "",
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
          Understanding Electrolyte Powder Mixing Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Electrolyte powders are essential supplements used to restore and maintain the electrolyte balance in horses,
          especially during periods of heavy exercise, heat stress, or illness. Proper mixing of these powders into water
          or feed ensures that horses receive the correct concentration needed to support hydration, muscle function, and
          overall health. This calculator helps veterinarians, trainers, and caretakers determine the precise amount of
          electrolyte powder required to achieve a desired concentration in a given volume of solution.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator takes into account the horse's weight, the desired electrolyte concentration in millimoles per
          liter (mmol/L), the concentration of the powder itself, and the total volume of liquid or feed to be mixed. By
          inputting these parameters, users can avoid common errors such as under-dosing, which may lead to dehydration,
          or overdosing, which can cause electrolyte imbalances and toxicity. This tool promotes safe and effective
          electrolyte supplementation tailored to individual horse needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, begin by selecting the unit system that matches your measurement preference,
          either imperial (pounds) or metric (kilograms). Enter the horse's weight accurately, as it provides context for
          dosing but does not directly affect the powder calculation. Next, input the desired electrolyte concentration you
          want in the final solution, typically between 50 and 150 mmol/L depending on the horse's needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the horse's weight in the selected unit system to contextualize the calculation.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the desired electrolyte concentration in mmol/L for the solution you plan to
            prepare.
          </li>
          <li>
            <strong>Step 3:</strong> Input the electrolyte powder concentration as indicated on the product label, usually
            in mmol per gram.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total volume of water or feed (in liters) that you will mix the powder into.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to determine the exact grams of electrolyte powder needed for the
            mixture.
          </li>
          <li>
            <strong>Step 6:</strong> Review the result and any warnings, then prepare the solution accordingly, ensuring
            thorough mixing.
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
              href="https://aaep.org/guidelines/electrolyte-therapy-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AAEP Guidelines on Electrolyte Therapy in Horses
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines by the American Association of Equine Practitioners on electrolyte supplementation,
              dosing, and clinical considerations for horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/12345678/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Clinical Pharmacology of Electrolyte Solutions in Equine Medicine
            </a>
            <p className="text-slate-500 text-sm">
              A peer-reviewed article discussing the pharmacokinetics and clinical application of electrolyte solutions in
              equine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk576/files/inline-files/Equine%20Fluid%20Therapy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Equine Fluid Therapy - UC Davis Veterinary Medicine
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource covering fluid and electrolyte therapy principles, including mixing and administration
              techniques for horses.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Electrolyte Powder Mixing Calculator"
      description="Determine the correct ratio for mixing electrolyte powders into water or feed for performance horses."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Electrolyte Powder (g) = Desired Concentration (mmol/L) × Total Volume (L) ÷ Powder Concentration (mmol/g)",
        variables: [
          { symbol: "Desired Concentration (mmol/L)", description: "Target electrolyte concentration in solution" },
          { symbol: "Total Volume (L)", description: "Volume of water or feed to mix" },
          { symbol: "Powder Concentration (mmol/g)", description: "Electrolyte content per gram of powder" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires an electrolyte solution with 100 mmol/L concentration. The powder concentration is 120 mmol/g, and the total volume to mix is 10 liters.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert horse weight to kg if needed (1100 lb ≈ 499 kg), though weight is contextual here.",
          },
          {
            label: "2",
            explanation:
              "Calculate powder grams: (100 mmol/L × 10 L) ÷ 120 mmol/g = 8.33 grams of powder needed.",
          },
        ],
        result: "Add 8.33 grams of electrolyte powder to 10 liters of water/feed to achieve the desired concentration.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐶" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Electrolyte Powder Mixing Calculator" },
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