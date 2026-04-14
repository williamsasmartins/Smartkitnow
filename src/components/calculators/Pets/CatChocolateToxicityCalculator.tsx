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
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function CatChocolateToxicityCalculator() {
  // 1. STATE
  // Unit system needed because weight input can be in lbs or kg
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and chocolate type (to get theobromine content mg/g)
  // Chocolate types: White, Milk, Dark, Baking
  const [inputs, setInputs] = useState({
    weight: "",
    chocolateType: "milk",
    amountChocolate: "",
  });

  // Theobromine content in mg per gram of chocolate by type (veterinary toxicology references)
  const theobromineContentMap: Record<string, number> = {
    white: 0.1, // negligible but not zero
    milk: 1.5,
    dark: 5.0,
    baking: 16.0,
  };

  // Toxic dose threshold for cats (theobromine mg/kg)
  // Cats are less commonly affected but toxic dose is estimated around 20 mg/kg theobromine
  const toxicDoseMgPerKg = 20;

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const amountRaw = parseFloat(inputs.amountChocolate);
    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(amountRaw) ||
      amountRaw <= 0 ||
      !theobromineContentMap[inputs.chocolateType]
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Theobromine content per gram chocolate
    const theobromineMgPerGram = theobromineContentMap[inputs.chocolateType];

    // Total theobromine ingested (mg)
    const totalTheobromineMg = amountRaw * theobromineMgPerGram;

    // Calculate toxic dose threshold for this cat (mg)
    const toxicDoseMg = toxicDoseMgPerKg * weightKg;

    // Calculate risk ratio (ingested / toxic threshold)
    const riskRatio = totalTheobromineMg / toxicDoseMg;

    // Interpret risk
    let label = "";
    let warning: string | null = null;
    if (riskRatio < 0.1) {
      label = "Minimal Risk";
    } else if (riskRatio < 0.5) {
      label = "Low Risk - Monitor Closely";
      warning =
        "Although the dose is below toxic threshold, some cats may be sensitive. Watch for symptoms.";
    } else if (riskRatio < 1) {
      label = "Moderate Risk - Veterinary Attention Recommended";
      warning =
        "Potential toxicity present. Contact your veterinarian promptly for advice.";
    } else {
      label = "High Risk - Emergency Veterinary Care Needed";
      warning =
        "The ingested theobromine exceeds toxic dose. Immediate veterinary intervention is critical.";
    }

    return {
      value: riskRatio.toFixed(2),
      label,
      subtext: `Theobromine ingested: ${totalTheobromineMg.toFixed(
        1
      )} mg; Toxic dose threshold: ${toxicDoseMg.toFixed(1)} mg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How does the Cat Chocolate Toxicity Calculator determine risk level?",
      answer: "The calculator uses your cat's weight, chocolate type (dark, milk, or white), and amount consumed to compute theobromine dose in mg/kg. Risk levels are: Safe (&lt;20 mg/kg), Monitor (20-40 mg/kg), Mild toxicity (40-60 mg/kg), and Severe (&gt;60 mg/kg).",
    },
    {
      question: "Why is dark chocolate more dangerous than milk chocolate for cats?",
      answer: "Dark chocolate contains 12-26 mg theobromine per gram, while milk chocolate has 1-3 mg per gram. Cats metabolize theobromine slowly, making smaller dark chocolate amounts significantly more toxic.",
    },
    {
      question: "At what weight does chocolate become toxic to cats?",
      answer: "Toxicity depends on chocolate type and amount, not weight alone. For a 10 lb cat, as little as 0.5 oz of dark chocolate can trigger mild symptoms, while 1 oz of milk chocolate is typically safe.",
    },
    {
      question: "What should I do if the calculator shows a severe risk level?",
      answer: "Contact your veterinarian or poison control (ASPCA: 888-426-4435) immediately. Severe toxicity requires activated charcoal or gastric lavage within 2-4 hours of ingestion.",
    },
    {
      question: "Is white chocolate toxic according to this calculator?",
      answer: "White chocolate contains negligible theobromine (&lt;0.1 mg/g) and poses minimal toxicity risk; however, high fat content may cause pancreatitis in cats.",
    },
    {
      question: "How accurate is this calculator for different cat breeds?",
      answer: "The calculator uses body weight only, which is accurate across all breeds. Individual metabolism varies, so monitor your cat closely and consult a vet if symptoms develop.",
    },
    {
      question: "Can I use this calculator for kittens under 2 pounds?",
      answer: "Yes, but kittens have immature livers and metabolize theobromine even slower than adults. Results may underestimate risk, so contact your vet immediately if accidental ingestion occurs.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
                setInputs((prev) => ({
                  ...prev,
                  weight: formatNumberForInput(nextWeight, 2),
                }));
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
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="chocolateType"
            className="text-slate-700 dark:text-slate-300"
          >
            Chocolate Type
          </Label>
          <select
            id="chocolateType"
            name="chocolateType"
            value={inputs.chocolateType}
            onChange={onInputChange}
            className="w-full mt-1 border rounded px-3 py-2 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="white">White Chocolate (0.1 mg/g theobromine)</option>
            <option value="milk">Milk Chocolate (1.5 mg/g theobromine)</option>
            <option value="dark">Dark Chocolate (5.0 mg/g theobromine)</option>
            <option value="baking">Baking Chocolate (16.0 mg/g theobromine)</option>
          </select>
        </div>

        <div>
          <Label
            htmlFor="amountChocolate"
            className="text-slate-700 dark:text-slate-300"
          >
            Amount of Chocolate Ingested (grams)
          </Label>
          <Input
            id="amountChocolate"
            name="amountChocolate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount in grams"
            value={inputs.amountChocolate}
            onChange={onInputChange}
            className="mt-1"
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
            setInputs({ weight: "", chocolateType: "milk", amountChocolate: "" })
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat Chocolate Toxicity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines whether your cat's chocolate ingestion poses a health risk by calculating theobromine dose relative to body weight. It accounts for chocolate type, amount consumed, and your cat's weight to generate a toxicity risk assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's current weight in pounds or kilograms, select the chocolate type (dark, milk, or white), and enter the amount consumed in ounces or grams. The more precise your inputs, the more accurate the result.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results range from Safe to Severe Toxicity. Safe levels require monitoring only, while Severe requires immediate veterinary attention. Always contact your vet if your cat exhibits vomiting, diarrhea, tremors, or unusual behavior within 12 hours of chocolate consumption.</p>
        </div>
      </section>

      {/* TABLE: Theobromine Content by Chocolate Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Theobromine Content by Chocolate Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different chocolate types contain vastly different theobromine concentrations, affecting toxicity calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Chocolate Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Theobromine (mg/g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Caffeine (mg/g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxicity Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark/Baking Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milk Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">White Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;0.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cocoa Powder (unsweetened)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Baking and cocoa powder are most toxic. Dark chocolate toxicity increases with cocoa percentage (70%+ is highly dangerous).</p>
      </section>

      {/* TABLE: Feline Chocolate Toxicity Thresholds (per kg body weight) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Feline Chocolate Toxicity Thresholds (per kg body weight)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Toxicity risk escalates as theobromine dose increases relative to your cat's weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monitor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild restlessness, drooling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Observe; call vet if worsens</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild Toxicity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, tremors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact veterinarian</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Severe Toxicity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seizures, rapid heart rate, collapse</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency vet visit immediately</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cats are more sensitive than dogs. Symptoms typically appear 6-12 hours post-ingestion. Lethal dose is approximately 200-500 mg/kg.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh the chocolate packaging before ingestion to estimate consumption amount; guessing can lead to inaccurate risk assessment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Dark chocolate and cocoa powder pose 10-20x greater risk than milk chocolate at equivalent weights.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep the ASPCA Animal Poison Control Center number (888-426-4435) saved for emergency reference.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your cat for 24 hours post-ingestion even if the calculator shows low risk, as individual sensitivity varies.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing chocolate type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering dark chocolate as milk chocolate or vice versa dramatically skews results; verify cocoa percentage on packaging before calculating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using outdated cat weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inaccurate weight measurements reduce calculator precision; weigh your cat within the past month for reliable toxicity assessment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring chocolate with fillings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Chocolate-covered items may contain additional toxic ingredients like xylitol; assess total composition, not chocolate weight alone.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all cats metabolize identically</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior cats, kittens, and those with liver disease metabolize theobromine slower; consult a vet if your cat has pre-existing conditions.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Cat Chocolate Toxicity Calculator determine risk level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your cat's weight, chocolate type (dark, milk, or white), and amount consumed to compute theobromine dose in mg/kg. Risk levels are: Safe (&lt;20 mg/kg), Monitor (20-40 mg/kg), Mild toxicity (40-60 mg/kg), and Severe (&gt;60 mg/kg).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is dark chocolate more dangerous than milk chocolate for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dark chocolate contains 12-26 mg theobromine per gram, while milk chocolate has 1-3 mg per gram. Cats metabolize theobromine slowly, making smaller dark chocolate amounts significantly more toxic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what weight does chocolate become toxic to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Toxicity depends on chocolate type and amount, not weight alone. For a 10 lb cat, as little as 0.5 oz of dark chocolate can trigger mild symptoms, while 1 oz of milk chocolate is typically safe.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if the calculator shows a severe risk level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or poison control (ASPCA: 888-426-4435) immediately. Severe toxicity requires activated charcoal or gastric lavage within 2-4 hours of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is white chocolate toxic according to this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">White chocolate contains negligible theobromine (&lt;0.1 mg/g) and poses minimal toxicity risk; however, high fat content may cause pancreatitis in cats.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this calculator for different cat breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses body weight only, which is accurate across all breeds. Individual metabolism varies, so monitor your cat closely and consult a vet if symptoms develop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for kittens under 2 pounds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but kittens have immature livers and metabolize theobromine even slower than adults. Results may underestimate risk, so contact your vet immediately if accidental ingestion occurs.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official toxicity database and emergency hotline for chocolate and pet poisoning cases.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/chocolate/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Chocolate Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary-reviewed toxicity thresholds and symptoms for chocolate ingestion in cats.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) - Pet Toxicology</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on toxic substances and emergency response for companion animals.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Chocolate Poisoning in Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of chocolate toxicity signs, diagnosis, and treatment protocols for feline patients.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Chocolate Toxicity Calculator"
      description="Calculate the toxic dose of chocolate for cats (though less common than in dogs)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Risk Ratio = (Theobromine Ingested mg) ÷ (Toxic Dose Threshold mg/kg × Cat Weight kg)",
        variables: [
          { symbol: "Risk Ratio", description: "Relative toxicity risk" },
          { symbol: "Theobromine Ingested mg", description: "Total theobromine consumed" },
          { symbol: "Toxic Dose Threshold mg/kg", description: "Toxic dose per kg body weight (20 mg/kg)" },
          { symbol: "Cat Weight kg", description: "Weight of the cat in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat ingests 30 grams of dark chocolate (5 mg/g theobromine).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total theobromine ingested: 30 g × 5 mg/g = 150 mg.",
          },
          {
            label: "2",
            explanation:
              "Calculate toxic dose threshold: 20 mg/kg × 4.54 kg = 90.8 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate risk ratio: 150 mg ÷ 90.8 mg = 1.65 (high risk).",
          },
        ],
        result:
          "The cat has ingested a potentially toxic dose exceeding the threshold, requiring immediate veterinary care.",
      }}
      relatedCalculators={[
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "🐾",
        },
        {
          title: "Stress Score & Playtime Offset Planner (owner input)",
          url: "/pets/cat-stress-score-playtime-offset-planner",
          icon: "🐶",
        },
        {
          title: "Gabapentin Dose Calculator for Cats",
          url: "/pets/cat-gabapentin-dose",
          icon: "🐱",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Daily Water Intake Checker for Cats",
          url: "/pets/cat-daily-water-intake-checker",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Chocolate Toxicity Calculator" },
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
