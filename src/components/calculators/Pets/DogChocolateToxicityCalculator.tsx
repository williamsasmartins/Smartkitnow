import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog, Skull } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

const CHOCOLATE_TYPES = [
  { label: "White Chocolate", mgTheobrominePerGram: 0.1 },
  { label: "Milk Chocolate", mgTheobrominePerGram: 1.5 },
  { label: "Dark Chocolate", mgTheobrominePerGram: 5.0 },
  { label: "Baking Chocolate", mgTheobrominePerGram: 15.0 },
  { label: "Unsweetened Cocoa Powder", mgTheobrominePerGram: 12.0 },
];

export default function DogChocolateToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    chocolateType: CHOCOLATE_TYPES[1].label,
    chocolateAmount: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const chocolateAmountRaw = parseFloat(inputs.chocolateAmount);
    if (!weightRaw || weightRaw <= 0) return { value: 0, label: "Enter valid dog weight." };
    if (!chocolateAmountRaw || chocolateAmountRaw <= 0) return { value: 0, label: "Enter valid chocolate amount." };

    const weightKg = weightToKg(weightRaw, unit);

    // Find the theobromine concentration for selected chocolate type
    const chocolateTypeObj = CHOCOLATE_TYPES.find((c) => c.label === inputs.chocolateType);
    if (!chocolateTypeObj) return { value: 0, label: "Select a valid chocolate type." };

    // Total theobromine ingested (mg)
    // chocolateAmountRaw is in grams
    const totalTheobromineMg = chocolateAmountRaw * chocolateTypeObj.mgTheobrominePerGram;

    // Toxic dose thresholds (mg/kg)
    // Mild toxicity: ~20 mg/kg
    // Severe toxicity: ~40-60 mg/kg
    // Lethal dose: ~100-200 mg/kg (varies widely)
    // We'll use 20 mg/kg as mild, 40 mg/kg as moderate, 60 mg/kg as severe

    const doseMgPerKg = totalTheobromineMg / weightKg;
    const displayedDose = unit === "kg" ? doseMgPerKg : doseMgPerKg / LB_PER_KG;
    const doseUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";

    // Determine toxicity level and advice
    let toxicityLevel = "No significant toxicity expected.";
    let warning = null;

    if (doseMgPerKg >= 100) {
      toxicityLevel = "Potentially lethal toxicity.";
      warning = "Seek emergency veterinary care immediately. This dose can be fatal.";
    } else if (doseMgPerKg >= 60) {
      toxicityLevel = "Severe toxicity likely.";
      warning = "Immediate veterinary attention is strongly recommended.";
    } else if (doseMgPerKg >= 40) {
      toxicityLevel = "Moderate toxicity possible.";
      warning = "Contact your veterinarian promptly for advice.";
    } else if (doseMgPerKg >= 20) {
      toxicityLevel = "Mild toxicity possible.";
      warning = "Monitor your dog closely and consult your vet if symptoms develop.";
    }

    return {
      value: displayedDose.toFixed(1),
      label: `Theobromine dose: ${displayedDose.toFixed(1)} ${doseUnitLabel}`,
      subtext: toxicityLevel,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How does the calculator determine if chocolate is toxic to my dog?",
      answer: "The calculator uses your dog's weight, chocolate type (dark, milk, or white), and amount consumed to estimate theobromine levels against the toxic threshold of 20 mg/kg body weight.",
    },
    {
      question: "What's the difference between dark, milk, and white chocolate toxicity?",
      answer: "Dark chocolate contains 130-450 mg theobromine per ounce, milk chocolate 3-12 mg per ounce, and white chocolate 0 mg since it contains no cocoa solids.",
    },
    {
      question: "At what theobromine dose does chocolate become dangerous for dogs?",
      answer: "Mild signs appear at 20 mg/kg, moderate symptoms at 40-50 mg/kg, and severe toxicity occurs above 60 mg/kg of body weight.",
    },
    {
      question: "Can I use this calculator for all dog breeds and sizes?",
      answer: "Yes, the calculator works for any dog weight from toy breeds to large dogs since toxicity is based on body weight and theobromine concentration.",
    },
    {
      question: "What should I do if the calculator shows toxic levels?",
      answer: "Contact your veterinarian or pet poison control immediately; they may recommend induced vomiting or activated charcoal depending on timing and amount.",
    },
    {
      question: "Is baking chocolate more dangerous than chocolate bars?",
      answer: "Yes, baking chocolate contains 390-450 mg theobromine per ounce compared to 130-450 mg in dark chocolate, making it significantly more toxic.",
    },
    {
      question: "How quickly do chocolate toxicity symptoms appear in dogs?",
      answer: "Symptoms typically develop within 6-12 hours of ingestion and may include vomiting, diarrhea, restlessness, and rapid heart rate.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(field: string, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
              }
              setUnit(next);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dog Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>

        {/* Chocolate Type Select */}
        <div>
          <Label htmlFor="chocolateType" className="text-slate-700 dark:text-slate-300">
            Chocolate Type
          </Label>
          <Select
            value={inputs.chocolateType}
            onValueChange={(val) => handleInputChange("chocolateType", val)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHOCOLATE_TYPES.map((type) => (
                <SelectItem key={type.label} value={type.label}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chocolate Amount Input */}
        <div>
          <Label htmlFor="chocolateAmount" className="text-slate-700 dark:text-slate-300">
            Amount of Chocolate Consumed (grams)
          </Label>
          <Input
            id="chocolateAmount"
            type="number"
            min={0}
            step="any"
            placeholder="Enter chocolate amount in grams"
            value={inputs.chocolateAmount}
            onChange={(e) => handleInputChange("chocolateAmount", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state change, no extra logic needed here
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", chocolateType: CHOCOLATE_TYPES[1].label, chocolateAmount: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Chocolate Toxicity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates whether your dog has ingested a toxic amount of chocolate based on their weight, the chocolate type, and quantity consumed. It provides risk assessment to help you decide if veterinary care is needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in pounds or kilograms, select the chocolate type (dark, milk, or white), and input the amount your dog ate. The calculator will compute total theobromine exposure and compare it against known toxicity thresholds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results indicate safe, mild, moderate, or severe toxicity levels. Any result above the safe threshold warrants a veterinary consultation, especially if ingestion occurred recently.</p>
        </div>
      </section>

      {/* TABLE: Theobromine Content by Chocolate Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Theobromine Content by Chocolate Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different chocolate types contain varying concentrations of theobromine, the toxic compound affecting dogs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Chocolate Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Theobromine per Ounce</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxicity Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">White Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milk Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-12 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark Chocolate (50-69%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130-200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark Chocolate (70-85%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-350 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Baking Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">390-450 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cocoa Powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1,600 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxicity risk increases significantly with cocoa solids concentration.</p>
      </section>

      {/* TABLE: Chocolate Toxicity Dose Thresholds for Dogs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Chocolate Toxicity Dose Thresholds for Dogs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks show at what theobromine levels dogs experience different severity symptoms.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Theobromine Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;20 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No symptoms expected</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-40 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, tremors</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40-60 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Restlessness, rapid heart rate, muscle tremors</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;60 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seizures, cardiac arrhythmia, possible death</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Smaller dogs reach toxic levels with smaller chocolate amounts than large dogs.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep chocolate products in sealed containers stored above counter height since dogs can't distinguish toxic from safe foods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cocoa mulch used in gardens contains theobromine and poses toxicity risk; use pet-safe alternatives like cedar chips.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Smaller dogs and toy breeds reach toxic theobromine levels much faster than large breeds with the same chocolate amount.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Contact your vet within 2-4 hours of chocolate ingestion for best treatment outcomes before symptoms develop.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all chocolate is equally dangerous</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">White and milk chocolate are far less toxic than dark chocolate; a 20-pound dog needs over 2 pounds of milk chocolate to reach dangerous levels but only 1 ounce of baking chocolate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring dog weight in calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 5-pound Chihuahua reaches toxic levels 4 times faster than a 20-pound Beagle with the same chocolate amount.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting for symptoms before seeking help</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Theobromine toxicity is cumulative; waiting 12-24 hours for symptoms reduces treatment effectiveness since absorption is already complete.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for chocolate in processed foods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Brownies, chocolate chips in cookies, and chocolate-covered items contain concentrated chocolate that's more dangerous than plain candy bars.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine if chocolate is toxic to my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your dog's weight, chocolate type (dark, milk, or white), and amount consumed to estimate theobromine levels against the toxic threshold of 20 mg/kg body weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between dark, milk, and white chocolate toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dark chocolate contains 130-450 mg theobromine per ounce, milk chocolate 3-12 mg per ounce, and white chocolate 0 mg since it contains no cocoa solids.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what theobromine dose does chocolate become dangerous for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mild signs appear at 20 mg/kg, moderate symptoms at 40-50 mg/kg, and severe toxicity occurs above 60 mg/kg of body weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all dog breeds and sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for any dog weight from toy breeds to large dogs since toxicity is based on body weight and theobromine concentration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if the calculator shows toxic levels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or pet poison control immediately; they may recommend induced vomiting or activated charcoal depending on timing and amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is baking chocolate more dangerous than chocolate bars?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, baking chocolate contains 390-450 mg theobromine per ounce compared to 130-450 mg in dark chocolate, making it significantly more toxic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly do chocolate toxicity symptoms appear in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms typically develop within 6-12 hours of ingestion and may include vomiting, diarrhea, restlessness, and rapid heart rate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative U.S. resource for immediate pet toxicity guidance and emergency contacts.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/chocolate/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides detailed chocolate toxicity information with case-specific veterinary consultation available 24/7.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources/pet-owners/petcare/chocolate-toxicity-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official veterinary guidance on chocolate poisoning symptoms, treatment, and prevention strategies.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/chocolate-toxicity-in-dogs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals Chocolate Toxicity Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of theobromine metabolism in dogs and recommended emergency veterinary responses.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Chocolate Toxicity Calculator"
      description="Calculate the risk and severity of **chocolate poisoning** in dogs based on weight, type of chocolate consumed, and amount."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Dose (mg/kg) = (Amount of Chocolate Consumed in grams × Theobromine Concentration in mg/g) ÷ Dog's Weight in kg",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Theobromine dose per kilogram of dog's body weight" },
          { symbol: "Amount of Chocolate Consumed (g)", description: "Weight of chocolate ingested in grams" },
          { symbol: "Theobromine Concentration (mg/g)", description: "Theobromine content per gram of chocolate type" },
          { symbol: "Dog's Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) dog ate 50 grams of milk chocolate. Milk chocolate contains approximately 1.5 mg of theobromine per gram.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms if needed (10 lb ÷ 2.20462 = 4.54 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total theobromine ingested: 50 g × 1.5 mg/g = 75 mg.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dose per kg: 75 mg ÷ 4.54 kg ≈ 16.5 mg/kg.",
          },
          {
            label: "Step 4",
            explanation:
              "Interpret dose: 16.5 mg/kg is below mild toxicity threshold (20 mg/kg), so no significant toxicity expected but monitor closely.",
          },
        ],
        result: "The dog ingested approximately 16.5 mg/kg of theobromine, which is below the mild toxicity threshold, but monitoring is advised.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Chocolate Toxicity Calculator" },
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
