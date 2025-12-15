import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdElectrolyteVitaminCWaterMixCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Bird weight and desired Vitamin C dose (mg/kg), Electrolyte concentration (g/L), Water volume (L)
  const [inputs, setInputs] = useState({
    weight: "",
    vitaminCDose: "",
    electrolyteConcentration: "",
    waterVolume: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const vitaminCDoseRaw = parseFloat(inputs.vitaminCDose);
    const electrolyteConcRaw = parseFloat(inputs.electrolyteConcentration);
    const waterVolumeRaw = parseFloat(inputs.waterVolume);

    if (
      isNaN(weightRaw) ||
      isNaN(vitaminCDoseRaw) ||
      isNaN(electrolyteConcRaw) ||
      isNaN(waterVolumeRaw) ||
      weightRaw <= 0 ||
      vitaminCDoseRaw <= 0 ||
      electrolyteConcRaw <= 0 ||
      waterVolumeRaw <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Total Vitamin C needed (mg) = Dose (mg/kg) * weight (kg)
    const totalVitaminCmg = vitaminCDoseRaw * weightKg;

    // Total Electrolyte needed (g) = concentration (g/L) * water volume (L)
    const totalElectrolyteg = electrolyteConcRaw * waterVolumeRaw;

    // Total water volume in mL
    const waterVolmL = waterVolumeRaw * 1000;

    // Vitamin C concentration in water (mg/mL)
    const vitaminCConc = totalVitaminCmg / waterVolmL;

    // Electrolyte concentration in water (mg/mL)
    const electrolyteConcMgPerMl = (totalElectrolyteg * 1000) / waterVolmL;

    // Safety check warnings
    let warning = null;
    // Typical safe Vitamin C concentration in drinking water for birds is up to ~100 mg/L (0.1 mg/mL)
    if (vitaminCConc > 0.1) {
      warning =
        "Vitamin C concentration exceeds typical safe levels (100 mg/L). High doses may cause digestive upset or toxicity. Consult a veterinarian before proceeding.";
    }

    // Typical electrolyte solutions for birds range ~1-3 g/L; higher may cause palatability issues
    if (electrolyteConcRaw > 3) {
      warning =
        "Electrolyte concentration is high (>3 g/L), which may reduce water intake or cause imbalances. Use caution and consult a veterinarian.";
    }

    return {
      value: `${vitaminCConc.toFixed(3)} mg/mL Vitamin C, ${electrolyteConcMgPerMl.toFixed(1)} mg/mL Electrolytes`,
      label: "Concentration in Drinking Water",
      subtext: `Based on ${weightKg.toFixed(2)} kg bird weight and ${waterVolumeRaw} L water volume.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate the correct Vitamin C and electrolyte concentration for birds?",
      answer:
        "Birds have sensitive digestive systems and specific metabolic needs that require precise dosing of supplements like Vitamin C and electrolytes. Over- or under-dosing can lead to ineffective treatment or adverse effects such as toxicity or dehydration. Calculating the correct concentration ensures safe and effective supplementation tailored to the bird's weight and hydration status.",
    },
    {
      question: "How does water volume affect the concentration of supplements in the drinking water?",
      answer:
        "The volume of water used to mix supplements directly influences their concentration; a larger volume dilutes the supplements, lowering their concentration per milliliter. Accurate measurement of water volume is essential to achieve the desired dosing concentration, ensuring the bird receives the intended amount of nutrients without risk of overdose or underdose. This calculator integrates water volume to provide precise concentration values.",
    },
    {
      question: "Can I use this calculator for all bird species and sizes?",
      answer:
        "While this calculator provides a general guideline for electrolyte and Vitamin C supplementation, different bird species and sizes have varying nutritional requirements and tolerances. It is important to consult a veterinarian familiar with the specific species to tailor dosing appropriately. This tool is best used as an initial reference, not a substitute for professional veterinary advice.",
    },
    {
      question: "What are the risks of exceeding recommended electrolyte concentrations in bird drinking water?",
      answer:
        "Excessive electrolyte concentrations can alter the taste and palatability of water, leading to reduced water intake and potential dehydration. High electrolyte levels may also disrupt the bird’s electrolyte balance, causing metabolic disturbances or kidney stress. Careful calculation and veterinary consultation help prevent these complications and promote safe rehydration therapy.",
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
            placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 0.68"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="vitaminCDose" className="text-slate-700 dark:text-slate-300">
            Desired Vitamin C Dose (mg/kg body weight)
          </Label>
          <Input
            id="vitaminCDose"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.vitaminCDose}
            onChange={(e) => setInputs((prev) => ({ ...prev, vitaminCDose: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="electrolyteConcentration" className="text-slate-700 dark:text-slate-300">
            Electrolyte Concentration (g/L)
          </Label>
          <Input
            id="electrolyteConcentration"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2"
            value={inputs.electrolyteConcentration}
            onChange={(e) => setInputs((prev) => ({ ...prev, electrolyteConcentration: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="waterVolume" className="text-slate-700 dark:text-slate-300">
            Water Volume (L)
          </Label>
          <Input
            id="waterVolume"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1"
            value={inputs.waterVolume}
            onChange={(e) => setInputs((prev) => ({ ...prev, waterVolume: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here since useMemo depends on inputs)
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
              vitaminCDose: "",
              electrolyteConcentration: "",
              waterVolume: "",
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
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
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
          Understanding Electrolyte & Vitamin C Water Mix Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Electrolyte & Vitamin C Water Mix Calculator is a specialized veterinary tool designed to assist avian caregivers and professionals in preparing safe and effective hydration solutions. Birds often require supplementation with electrolytes and Vitamin C during illness, stress, or recovery to maintain fluid balance and support immune function. This calculator integrates key parameters such as bird weight, desired Vitamin C dose, electrolyte concentration, and water volume to provide precise concentration values for mixing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper dosing is critical because birds have unique metabolic rates and sensitivities compared to mammals. Over-concentration of supplements can lead to palatability issues, reduced water intake, or even toxicity, while under-dosing may fail to provide therapeutic benefits. This tool helps standardize dosing by converting weight-based Vitamin C requirements into practical concentrations within drinking water, ensuring safe and effective administration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the calculator accounts for electrolyte concentration, which is essential for correcting dehydration and electrolyte imbalances in sick birds. By providing clear warnings when concentrations exceed typical safe ranges, it promotes cautious use and encourages consultation with veterinary professionals. This calculator is an invaluable resource for enhancing avian care through evidence-based supplementation.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, begin by selecting the unit system that corresponds to your measurement preferences—Imperial (pounds) or Metric (kilograms). Next, enter the bird's weight accurately, as this is fundamental for calculating the correct Vitamin C dose. Then, input the desired Vitamin C dose in milligrams per kilogram of body weight, which is typically prescribed by a veterinarian based on the bird's condition.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the bird’s weight in the selected unit system to ensure accurate dose calculations.
          </li>
          <li>
            <strong>Step 2:</strong> Specify the Vitamin C dose (mg/kg) recommended for the bird’s health status.
          </li>
          <li>
            <strong>Step 3:</strong> Input the electrolyte concentration (g/L) you plan to add to the water, based on product instructions or veterinary advice.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total volume of water (in liters) that will be mixed with the supplements.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to receive the concentration of Vitamin C and electrolytes in the water, along with safety warnings if applicable.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Always review the results carefully and consult a veterinarian before administering supplements, especially if concentrations exceed typical safe ranges. Use the reset button to clear inputs and perform new calculations as needed.
        </p>
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutritional Requirements and Supplementation in Birds
            </a>
            <p className="text-slate-500 text-sm">
              This article discusses the importance of balanced nutrition and supplementation, including Vitamin C and electrolytes, in avian species to support health and recovery.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-of-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Nutrition of Birds
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive veterinary resource detailing avian nutritional needs, including the role of electrolytes and Vitamin C in clinical care.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151867/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Electrolyte Therapy in Avian Medicine
            </a>
            <p className="text-slate-500 text-sm">
              This paper reviews electrolyte imbalances in birds and the clinical application of electrolyte supplementation for hydration therapy.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Electrolyte & Vitamin C Water Mix Calculator"
      description="Calculate the safe concentration for mixing electrolytes and Vitamin C into a bird's drinking water."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Concentration (mg/mL) = (Dose mg/kg × Weight kg) ÷ (Water Volume L × 1000)",
        variables: [
          { symbol: "Dose mg/kg", description: "Vitamin C dose per kg of bird body weight" },
          { symbol: "Weight kg", description: "Bird's body weight in kilograms" },
          { symbol: "Water Volume L", description: "Total volume of water in liters" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1.5 lb (0.68 kg) parakeet requires 50 mg/kg Vitamin C dose and 2 g/L electrolyte concentration mixed in 1 liter of water.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg (1.5 lb ÷ 2.20462 = 0.68 kg). Calculate total Vitamin C: 50 mg/kg × 0.68 kg = 34 mg.",
          },
          {
            label: "2",
            explanation:
              "Calculate Vitamin C concentration: 34 mg ÷ 1000 mL = 0.034 mg/mL (34 mg/L). Calculate electrolyte total: 2 g × 1 L = 2 g (2000 mg).",
          },
          {
            label: "3",
            explanation:
              "Electrolyte concentration in mg/mL: 2000 mg ÷ 1000 mL = 2 mg/mL. Resulting water contains 0.034 mg/mL Vitamin C and 2 mg/mL electrolytes.",
          },
        ],
        result:
          "Safe concentrations for the bird’s drinking water are 34 mg/L Vitamin C and 2 g/L electrolytes, suitable for hydration support.",
      }}
      relatedCalculators={[
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Horse Feeding Rate Calculator (Forage + Concentrate)", url: "/pets/horse-feeding-rate-forage-concentrate", icon: "🐎" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Electrolyte & Vitamin C Water Mix Calculator" },
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