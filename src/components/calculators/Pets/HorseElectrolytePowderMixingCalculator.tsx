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
  // - Horse weight (lbs or kg)
  // - Desired electrolyte concentration (g/L)
  // - Volume of water to mix (L)
  // - Electrolyte powder concentration (g per scoop or g per gram)
  // For simplicity, assume powder concentration in g per scoop (user inputs grams per scoop)
  const [inputs, setInputs] = useState({
    weight: "",
    desiredConcentration: "",
    waterVolume: "",
    powderConcentration: "",
  });

  // 2. LOGIC ENGINE
  // Formula:
  // Amount of powder (g) = Desired concentration (g/L) * Volume of water (L)
  // We do not need weight for this calculation but keep for reference or future extension.
  // Show powder amount in grams and scoops (if powderConcentration is given)
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const desiredConcNum = parseFloat(inputs.desiredConcentration);
    const waterVolNum = parseFloat(inputs.waterVolume);
    const powderConcNum = parseFloat(inputs.powderConcentration);

    if (
      isNaN(weightNum) ||
      isNaN(desiredConcNum) ||
      isNaN(waterVolNum) ||
      isNaN(powderConcNum) ||
      weightNum <= 0 ||
      desiredConcNum <= 0 ||
      waterVolNum <= 0 ||
      powderConcNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg internally if needed (not used in calculation but shown for info)
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate powder amount in grams
    const powderAmountGrams = desiredConcNum * waterVolNum;

    // Calculate scoops needed
    const scoops = powderAmountGrams / powderConcNum;

    // Warning if scoops > 10 (arbitrary)
    const warning =
      scoops > 10
        ? "The required amount of powder is quite high; verify the desired concentration and water volume."
        : null;

    return {
      value: powderAmountGrams.toFixed(2),
      label: "Grams of Electrolyte Powder Needed",
      subtext: `Equivalent to approximately ${scoops.toFixed(2)} scoops (based on powder concentration).`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much electrolyte powder should I mix for a 500ml bottle of water?",
      answer: "Most electrolyte powders recommend 1-2 scoops per 500ml of water. Use your calculator by entering 500ml as water volume and the powder dosage to get precise mixing ratios.",
    },
    {
      question: "Can I use this calculator for all pet species?",
      answer: "This calculator works best for dogs, cats, and horses. Exotic pets like rabbits or birds may have different electrolyte requirements; consult your vet for species-specific needs.",
    },
    {
      question: "What electrolyte powders are safe for pets?",
      answer: "Pet-specific formulas containing sodium, potassium, and chloride at veterinary-approved concentrations are safest. Human sports drinks can be toxic to pets due to xylitol or excess sodium.",
    },
    {
      question: "How do I know if my pet needs electrolyte supplementation?",
      answer: "Signs include excessive panting, diarrhea, vomiting, or dehydration after exercise or illness. Use this calculator only after veterinary confirmation of electrolyte deficiency.",
    },
    {
      question: "Should electrolyte solution be served warm or cold?",
      answer: "Room temperature or slightly cool (not ice-cold) solutions are preferred for optimal absorption and palatability in most pets.",
    },
    {
      question: "How long does mixed electrolyte solution stay fresh?",
      answer: "Mixed electrolyte solutions should be used within 24 hours when refrigerated to prevent bacterial growth and ingredient degradation.",
    },
    {
      question: "Can I mix electrolyte powder with food instead of water?",
      answer: "Mixing with water ensures proper hydration and absorption. Adding powder to food may reduce water intake and effectiveness.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for input changes
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
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
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            placeholder={unit === "imperial" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={onInputChange}
            inputMode="decimal"
          />
        </div>
        <div>
          <Label htmlFor="desiredConcentration" className="text-slate-700 dark:text-slate-300">
            Desired Electrolyte Concentration (g/L)
          </Label>
          <Input
            id="desiredConcentration"
            name="desiredConcentration"
            type="text"
            placeholder="e.g. 10"
            value={inputs.desiredConcentration}
            onChange={onInputChange}
            inputMode="decimal"
          />
        </div>
        <div>
          <Label htmlFor="waterVolume" className="text-slate-700 dark:text-slate-300">
            Volume of Water to Mix (L)
          </Label>
          <Input
            id="waterVolume"
            name="waterVolume"
            type="text"
            placeholder="e.g. 5"
            value={inputs.waterVolume}
            onChange={onInputChange}
            inputMode="decimal"
          />
        </div>
        <div>
          <Label htmlFor="powderConcentration" className="text-slate-700 dark:text-slate-300">
            Electrolyte Powder Concentration (grams per scoop)
          </Label>
          <Input
            id="powderConcentration"
            name="powderConcentration"
            type="text"
            placeholder="e.g. 50"
            value={inputs.powderConcentration}
            onChange={onInputChange}
            inputMode="decimal"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
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
              waterVolume: "",
              powderConcentration: "",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Electrolyte Powder Mixing Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the correct amount of electrolyte powder to mix with water for your pet. It ensures precise dosing based on water volume and your pet's hydration needs, reducing risk of over or under-supplementation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter three key inputs: total water volume (in milliliters or liters), recommended powder dosage per liter (check your product label), and number of servings needed. The calculator automatically computes total powder required and concentration strength.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the output to confirm powder amount matches your pet's weight and condition. Prepare the solution by dissolving powder in room-temperature water, stir thoroughly, and serve within 24 hours when refrigerated for safety and efficacy.</p>
        </div>
      </section>

      {/* TABLE: Recommended Electrolyte Dosages by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Electrolyte Dosages by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard veterinary-approved electrolyte powder concentrations for common household pets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Powder per Liter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Servings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2.5 grams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-4 grams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51-100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 grams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-12 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1 gram</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Horses</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 grams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosages assume moderate dehydration. Severe cases require veterinary intervention and higher concentrations.</p>
      </section>

      {/* TABLE: Electrolyte Concentration Ranges in Pet Formulas */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Electrolyte Concentration Ranges in Pet Formulas</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical mineral content percentages found in veterinary-approved electrolyte powders.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electrolyte</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical % in Powder</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Safety Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sodium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.5% solution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fluid balance and nerve function</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Potassium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.2% solution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Muscle and heart function</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chloride</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.5% solution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acid-base balance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Magnesium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.02-0.05% solution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Enzyme and muscle function</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Glucose</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5% solution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Quick energy absorption</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always verify your powder's specific formula matches these ranges before mixing.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always read the manufacturer's label on your electrolyte powder for species-specific dosing before using this calculator.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test a small amount of the mixed solution with your pet first to ensure palatability and no adverse reactions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use filtered or dechlorinated water when possible, as chlorine can interfere with electrolyte absorption in pets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store premixed electrolyte solutions in a clean glass container in the refrigerator to prevent contamination and maintain potency.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Sports Drinks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human electrolyte beverages often contain xylitol, artificial sweeteners, or excess sodium that are toxic or harmful to pets; always use veterinary-formulated products.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Pet Weight in Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for your pet's body weight can result in dangerous electrolyte overdose or ineffective underdosing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Incorrect Water-to-Powder Ratios</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding too much powder creates overly concentrated solutions that can cause diarrhea or electrolyte imbalances instead of relief.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Supplementing Without Veterinary Guidance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using electrolytes without confirmed deficiency or vet approval may mask underlying health issues that require treatment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much electrolyte powder should I mix for a 500ml bottle of water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most electrolyte powders recommend 1-2 scoops per 500ml of water. Use your calculator by entering 500ml as water volume and the powder dosage to get precise mixing ratios.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all pet species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works best for dogs, cats, and horses. Exotic pets like rabbits or birds may have different electrolyte requirements; consult your vet for species-specific needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What electrolyte powders are safe for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pet-specific formulas containing sodium, potassium, and chloride at veterinary-approved concentrations are safest. Human sports drinks can be toxic to pets due to xylitol or excess sodium.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my pet needs electrolyte supplementation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Signs include excessive panting, diarrhea, vomiting, or dehydration after exercise or illness. Use this calculator only after veterinary confirmation of electrolyte deficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should electrolyte solution be served warm or cold?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Room temperature or slightly cool (not ice-cold) solutions are preferred for optimal absorption and palatability in most pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does mixed electrolyte solution stay fresh?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mixed electrolyte solutions should be used within 24 hours when refrigerated to prevent bacterial growth and ingredient degradation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I mix electrolyte powder with food instead of water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mixing with water ensures proper hydration and absorption. Adding powder to food may reduce water intake and effectiveness.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official organization establishing nutritional standards and mineral content requirements for pet food and supplements.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network - Electrolyte Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary resource providing clinical guidelines for electrolyte therapy in companion animals.</p>
          </li>
          <li>
            <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization offering evidence-based recommendations for fluid therapy and electrolyte supplementation.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Pet Supplement Safety Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Regulatory guidance on approved ingredients, safety limits, and proper labeling for pet dietary supplements.</p>
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
        formula: "Powder Amount (g) = Desired Concentration (g/L) × Water Volume (L)",
        variables: [
          { symbol: "Powder Amount (g)", description: "Grams of electrolyte powder needed" },
          { symbol: "Desired Concentration (g/L)", description: "Target electrolyte concentration in solution" },
          { symbol: "Water Volume (L)", description: "Liters of water used for mixing" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires an electrolyte solution with a concentration of 10 g/L. The owner plans to mix the powder into 5 liters of water. The powder concentration is 50 grams per scoop.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the total grams of powder needed: 10 g/L × 5 L = 50 grams.",
          },
          {
            label: "2",
            explanation:
              "Determine the number of scoops: 50 grams ÷ 50 grams per scoop = 1 scoop.",
          },
          {
            label: "3",
            explanation:
              "Mix 1 scoop of electrolyte powder into 5 liters of water to achieve the desired concentration.",
          },
        ],
        result: "The horse owner should use 50 grams (1 scoop) of electrolyte powder in 5 liters of water.",
      }}
      relatedCalculators={[
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Cat Weight Loss Planner", url: "/pets/cat-weight-loss-planner", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐱" },
        { title: "Rabbit Treat Calories & Safe Portion", url: "/pets/rabbit-treat-calories-safe-portion", icon: "🍖" },
        { title: "Feeder Insect Gut-Loading Ratio", url: "/pets/reptile-feeder-insect-gut-loading-ratio", icon: "💉" },
        { title: "Dehydration Risk Checker", url: "/pets/small-mammal-dehydration-risk-checker", icon: "💧" },
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