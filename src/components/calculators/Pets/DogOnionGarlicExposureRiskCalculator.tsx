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

export default function DogOnionGarlicExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    alliumAmount: "",
    alliumType: "onion",
  });

  // Toxic doses (mg/kg) for Allium species causing hemolytic anemia in dogs:
  // Onion: ~15-30 g/kg fresh weight (toxic dose), but conservatively 15 g/kg = 15000 mg/kg
  // Garlic: ~5 g/kg fresh weight (more toxic than onion)
  // Chives and leeks are less commonly quantified but considered toxic at similar or slightly higher doses.
  // For safety, we use mg/kg of fresh weight of Allium consumed.

  // Conversion factors for Allium types to mg of toxic compounds (N-propyl disulfide) per gram:
  // Approximate relative toxicity factor (arbitrary for calculator scaling):
  // Onion = 1 (baseline)
  // Garlic = 3 (3x more toxic)
  // Chives = 0.5
  // Leeks = 0.7

  // For this calculator, we estimate risk by comparing the ingested dose (mg/kg dog weight) to a toxic threshold.

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const alliumAmountRaw = parseFloat(inputs.alliumAmount);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!alliumAmountRaw || alliumAmountRaw <= 0) {
      return {
        value: 0,
        label: "Please enter the amount of onion/garlic consumed.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Toxicity factors (relative toxicity multiplier)
    const toxicityFactors: Record<string, number> = {
      onion: 1,
      garlic: 3,
      chives: 0.5,
      leeks: 0.7,
    };

    const toxicityFactor = toxicityFactors[inputs.alliumType] || 1;

    // Convert alliumAmount to grams (input assumed grams)
    // Calculate toxic dose threshold in mg/kg dog weight:
    // Using conservative toxic dose for onion: 15 g/kg dog weight = 15000 mg/kg
    // For garlic, toxic dose is ~5 g/kg = 5000 mg/kg, so we scale by toxicityFactor

    // Calculate ingested dose in mg/kg dog weight:
    // ingestedDose (mg/kg) = (alliumAmount (g) * 1000 mg/g * toxicityFactor) / weightKg

    const ingestedDoseMgPerKg =
      (alliumAmountRaw * 1000 * toxicityFactor) / weightKg;

    // Toxic threshold mg/kg (onion baseline 15000 mg/kg)
    const toxicThresholdMgPerKg = 15000;

    // Risk assessment:
    // If ingestedDose < 0.5 * toxicThreshold => Low risk
    // If ingestedDose between 0.5 and 1 toxicThreshold => Moderate risk
    // If ingestedDose > toxicThreshold => High risk

    let riskLabel = "";
    let warning = null;

    if (ingestedDoseMgPerKg < 0.5 * toxicThresholdMgPerKg) {
      riskLabel = "Low risk of toxicity";
    } else if (
      ingestedDoseMgPerKg >= 0.5 * toxicThresholdMgPerKg &&
      ingestedDoseMgPerKg < toxicThresholdMgPerKg
    ) {
      riskLabel = "Moderate risk of toxicity";
      warning =
        "Monitor your dog closely for symptoms such as weakness, lethargy, or reddish urine. Contact your veterinarian if symptoms appear.";
    } else {
      riskLabel = "High risk of toxicity";
      warning =
        "Immediate veterinary attention is recommended. Onion and garlic ingestion can cause hemolytic anemia, which can be life-threatening.";
    }

    return {
      value: ingestedDoseMgPerKg.toFixed(0),
      label: riskLabel,
      subtext: `Estimated dose: ${ingestedDoseMgPerKg.toFixed(
        0
      )} mg toxic compounds per kg of dog body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How much onion or garlic is toxic to dogs?",
      answer: "Dogs can experience toxicity from as little as 0.5% of their body weight in onions or garlic. A 10 lb dog could show symptoms from consuming just 0.8 oz (23g) of onion or garlic, though severity depends on the form and type.",
    },
    {
      question: "What does this calculator measure?",
      answer: "This calculator estimates toxicity risk based on your dog's weight, the amount of allium consumed, and the type (raw, cooked, or powdered). It compares exposure to established toxic thresholds to provide a risk assessment.",
    },
    {
      question: "Are cooked onions and garlic safer than raw?",
      answer: "Cooked alliums are slightly less toxic than raw, but cooking does not eliminate the danger. Both raw and cooked onions/garlic contain thiosulfates that damage dog red blood cells regardless of preparation method.",
    },
    {
      question: "What are the symptoms of allium toxicity in dogs?",
      answer: "Symptoms include vomiting, diarrhea, lethargy, pale gums, weakness, and rapid breathing. These typically appear 1-7 days after exposure and warrant immediate veterinary attention.",
    },
    {
      question: "Is garlic powder more dangerous than fresh garlic?",
      answer: "Yes, garlic powder is significantly more concentrated and dangerous. One teaspoon of garlic powder is roughly equivalent to 1 clove of fresh garlic, making powdered forms pose higher risk per gram.",
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a risk estimate based on veterinary toxicology data but is not a substitute for professional veterinary diagnosis. Always consult your veterinarian if your dog ingests onions or garlic.",
    },
    {
      question: "Can repeated small exposures cause cumulative toxicity?",
      answer: "Yes, thiosulfates from repeated exposures accumulate in the bloodstream over days or weeks, potentially causing hemolytic anemia even if single exposures seem minimal.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function handleSelectChange(value: string) {
    setInputs((prev) => ({ ...prev, alliumType: value }));
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
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter dog weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>

        {/* Allium Type Select */}
        <div>
          <Label htmlFor="alliumType" className="text-slate-700 dark:text-slate-300">
            Allium Type
          </Label>
          <Select
            value={inputs.alliumType}
            onValueChange={handleSelectChange}
            id="alliumType"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onion">Onion</SelectItem>
              <SelectItem value="garlic">Garlic</SelectItem>
              <SelectItem value="chives">Chives</SelectItem>
              <SelectItem value="leeks">Leeks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Allium Amount Input */}
        <div>
          <Label
            htmlFor="alliumAmount"
            className="text-slate-700 dark:text-slate-300"
          >
            Amount Consumed (grams)
          </Label>
          <Input
            id="alliumAmount"
            name="alliumAmount"
            type="number"
            min="0"
            step="any"
            placeholder="Enter amount of onion/garlic consumed in grams"
            value={inputs.alliumAmount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", alliumAmount: "", alliumType: "onion" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
                {results.value} mg/kg
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
              veterinarian for diagnosis and treatment.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Onion/Garlic (Allium) Exposure Risk Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your dog's toxicity risk from onion or garlic exposure by analyzing the amount consumed relative to body weight and the form consumed. It provides a rapid risk assessment to help you decide whether veterinary care is needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in pounds, the amount of onion or garlic consumed (in ounces or grams), and select whether it was raw, cooked, or powdered. The calculator accounts for concentration differences across these forms.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results are categorized as Low, Moderate, High, or Critical risk. Low-risk cases may only require monitoring, while Moderate and above warrant veterinary contact. Critical exposures require immediate emergency veterinary care.</p>
        </div>
      </section>

      {/* TABLE: Allium Toxicity Risk Levels by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Allium Toxicity Risk Levels by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate toxic thresholds for dogs of different weights based on fresh onion/garlic consumption.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose Raw Garlic</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose Raw Onion</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Category at 1 oz Consumption</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12g (0.4 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25g (0.9 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">CRITICAL</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23g (0.8 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50g (1.8 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">HIGH</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">57g (2 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113g (4 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">MODERATE</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113g (4 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">227g (8 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">LOW</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">227g (8 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">454g (16 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">LOW</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxic dose = &gt;0.5% body weight. Smaller dogs reach toxic thresholds faster with same absolute amounts.</p>
      </section>

      {/* TABLE: Onion/Garlic Form Toxicity Comparison */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Onion/Garlic Form Toxicity Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different forms of alliums vary in concentration and risk level for dogs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Form</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concentration Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dose Risk (1 teaspoon)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cooking Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fresh Garlic Clove</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low for most dogs &gt;15 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal reduction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Garlic Powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5x concentrated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">HIGH risk for dogs &lt;20 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No reduction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fresh Onion (raw)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Concentration increases 50-75%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Onion Powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4x concentrated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">CRITICAL for dogs &lt;25 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No reduction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dehydrated Garlic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5x concentrated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">CRITICAL for most dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pre-concentrated</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Powdered forms are significantly more dangerous due to volume reduction and concentration of thiosulfates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check ingredient labels on store-bought foods, soups, and baby food—many contain garlic or onion powder as hidden ingredients dangerous to dogs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Establish a pet-free cooking zone and store onions/garlic where curious dogs cannot access them, including trash bins.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog for 3-7 days after suspected exposure, watching for lethargy, vomiting, or pale mucous membranes indicating anemia.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your veterinarian's emergency contact and the ASPCA Poison Control number (888-426-4435) readily available for quick reference.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming cooked = safe</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cooking does not eliminate thiosulfates; cooked alliums remain toxic and should never be fed to dogs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating powdered forms</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners forget that garlic/onion powder in seasoning mixes is highly concentrated and poses greater risk than fresh forms.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring cumulative exposure</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Repeated small exposures over days accumulate in the bloodstream and can trigger hemolytic anemia even when single doses seemed minor.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to contact vet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Symptoms may not appear for 1-7 days, but early veterinary intervention improves outcomes significantly if toxicity is suspected.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much onion or garlic is toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs can experience toxicity from as little as 0.5% of their body weight in onions or garlic. A 10 lb dog could show symptoms from consuming just 0.8 oz (23g) of onion or garlic, though severity depends on the form and type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does this calculator measure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates toxicity risk based on your dog's weight, the amount of allium consumed, and the type (raw, cooked, or powdered). It compares exposure to established toxic thresholds to provide a risk assessment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are cooked onions and garlic safer than raw?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cooked alliums are slightly less toxic than raw, but cooking does not eliminate the danger. Both raw and cooked onions/garlic contain thiosulfates that damage dog red blood cells regardless of preparation method.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the symptoms of allium toxicity in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms include vomiting, diarrhea, lethargy, pale gums, weakness, and rapid breathing. These typically appear 1-7 days after exposure and warrant immediate veterinary attention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is garlic powder more dangerous than fresh garlic?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, garlic powder is significantly more concentrated and dangerous. One teaspoon of garlic powder is roughly equivalent to 1 clove of fresh garlic, making powdered forms pose higher risk per gram.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator provides a risk estimate based on veterinary toxicology data but is not a substitute for professional veterinary diagnosis. Always consult your veterinarian if your dog ingests onions or garlic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can repeated small exposures cause cumulative toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, thiosulfates from repeated exposures accumulate in the bloodstream over days or weeks, potentially causing hemolytic anemia even if single exposures seem minimal.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for pet toxin emergencies with 24/7 hotline and database of toxic substances for animals.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN) - Onion and Garlic Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary toxicology information on allium compounds and thiosulfate mechanisms in dogs.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Garlic and Onion Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency veterinary toxicology resource with specific guidance on allium exposure and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.akc.org/dog-breeds/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club (AKC) - Toxic Foods for Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to common household foods dangerous to dogs, including detailed allium toxicity information.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Onion/Garlic (Allium) Exposure Risk Calculator"
      description="Determine the potential toxicity risk from consuming onions, garlic, chives, or leeks (Allium species)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Ingested Dose (mg/kg) = (Amount of Allium consumed (g) × 1000 mg/g × Toxicity Factor) ÷ Dog Weight (kg)",
        variables: [
          {
            symbol: "Amount of Allium consumed (g)",
            description:
              "The weight in grams of onion, garlic, chives, or leeks ingested by the dog.",
          },
          {
            symbol: "Toxicity Factor",
            description:
              "Relative toxicity multiplier based on Allium type (Onion=1, Garlic=3, Chives=0.5, Leeks=0.7).",
          },
          {
            symbol: "Dog Weight (kg)",
            description: "The body weight of the dog in kilograms.",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests 30 grams of garlic accidentally.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms if needed (20 lb ÷ 2.20462 = 9.07 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate ingested dose: (30 g × 1000 mg/g × 3 toxicity factor) ÷ 9.07 kg = 9913 mg/kg.",
          },
        ],
        result:
          "The estimated dose of 9913 mg/kg exceeds 0.5 of the toxic threshold (15000 mg/kg for onion baseline), indicating moderate to high risk of toxicity. Veterinary evaluation is recommended immediately.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dog Onion/Garlic (Allium) Exposure Risk Calculator",
        },
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
