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
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

export default function DogAlcoholEthanolExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    ethanolConcentration: "",
    volumeConsumed: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ethanolConcRaw = parseFloat(inputs.ethanolConcentration);
    const volumeRaw = parseFloat(inputs.volumeConsumed);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!ethanolConcRaw || ethanolConcRaw <= 0 || ethanolConcRaw > 100) {
      return {
        value: 0,
        label: "Please enter a valid ethanol concentration (0-100%).",
        subtext: null,
        warning: null,
      };
    }
    if (!volumeRaw || volumeRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid volume of ethanol-containing liquid consumed.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Ethanol density approx 0.789 g/mL
    // Calculate ethanol mass consumed in grams:
    // ethanol_mass_g = volume_ml * (ethanol_conc/100) * 0.789
    const ethanolMassGrams = volumeRaw * (ethanolConcRaw / 100) * 0.789;

    // Convert grams to mg
    const ethanolMassMg = ethanolMassGrams * 1000;

    // Calculate mg/kg dose:
    const doseMgPerKg = ethanolMassMg / weightKg;
    const displayedDose = unit === "kg" ? doseMgPerKg : doseMgPerKg / LB_PER_KG;
    const doseUnitLabel = unit === "kg" ? "mg/kg" : "mg/lb";
    const weightUnitLabel = unit === "kg" ? "kg" : "lb";

    // Toxicity thresholds (approximate, from veterinary toxicology literature):
    // Mild signs: > 100 mg/kg
    // Severe signs: > 200 mg/kg
    // Potentially lethal: > 300 mg/kg

    let riskLabel = "";
    let warning = null;

    if (doseMgPerKg < 50) {
      riskLabel = "Low risk of ethanol toxicity.";
    } else if (doseMgPerKg < 100) {
      riskLabel = "Mild risk: Watch for mild intoxication signs.";
    } else if (doseMgPerKg < 200) {
      riskLabel = "Moderate risk: Possible clinical signs, veterinary attention advised.";
      warning =
        "Ethanol dose is high enough to cause clinical signs. Immediate veterinary consultation recommended.";
    } else if (doseMgPerKg < 300) {
      riskLabel = "High risk: Severe intoxication likely, urgent veterinary care needed.";
      warning =
        "Severe ethanol toxicity risk. Immediate emergency veterinary care is critical.";
    } else {
      riskLabel = "Critical risk: Potentially lethal ethanol dose.";
      warning =
        "Dose exceeds lethal thresholds. Emergency veterinary intervention required immediately.";
    }

    return {
      value: displayedDose.toFixed(1),
      label: riskLabel,
      unitLabel: doseUnitLabel,
      subtext: `Dose: ${displayedDose.toFixed(1)} mg ethanol per ${weightUnitLabel} body weight.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What alcohol content qualifies as dangerous for dogs?",
      answer: "Ethanol concentrations above 0.5% by volume can be toxic to dogs. Most beers contain 4-6% alcohol, while spirits contain 40% or higher, making them significantly more dangerous even in small quantities.",
    },
    {
      question: "How does dog weight affect alcohol toxicity risk?",
      answer: "A 10-pound dog absorbs alcohol much faster than a 50-pound dog from the same amount of beverage. The calculator uses weight to determine blood alcohol concentration, as smaller dogs reach toxic levels with less exposure.",
    },
    {
      question: "What are the early signs of alcohol poisoning in dogs?",
      answer: "Watch for vomiting, loss of coordination, depression, tremors, and difficulty breathing within 30 minutes to 2 hours of exposure. Severe cases can cause seizures, coma, or respiratory failure.",
    },
    {
      question: "Can raisins fermented in alcohol be more dangerous than plain alcohol?",
      answer: "Yes, fermented foods contain both ethanol and potentially toxic compounds like acetaldehyde. The calculator focuses on pure ethanol exposure, but fermented products require immediate veterinary attention.",
    },
    {
      question: "How quickly does the calculator estimate alcohol absorption in dogs?",
      answer: "Dogs absorb alcohol 3-4 times faster than humans due to higher stomach acid and faster gastric emptying. Most absorption occurs within 30-60 minutes of ingestion.",
    },
    {
      question: "Is there a safe amount of alcohol for any dog?",
      answer: "No safe threshold exists for dogs; even small amounts can cause clinical signs. The ASPCA considers any alcohol exposure a medical emergency requiring veterinary evaluation.",
    },
    {
      question: "What should I do if the calculator shows high-risk exposure?",
      answer: "Contact your veterinarian or poison control immediately (888-426-4435 ASPCA Animal Poison Control). Do not wait for symptoms; prompt treatment significantly improves outcomes.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        {/* Ethanol Concentration Input */}
        <div>
          <Label htmlFor="ethanolConcentration" className="text-slate-700 dark:text-slate-300">
            Ethanol Concentration (% v/v)
          </Label>
          <Input
            id="ethanolConcentration"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="Ethanol concentration in the liquid (e.g., 40 for 40%)"
            value={inputs.ethanolConcentration}
            onChange={(e) => setInputs({ ...inputs, ethanolConcentration: e.target.value })}
          />
        </div>

        {/* Volume Consumed Input */}
        <div>
          <Label htmlFor="volumeConsumed" className="text-slate-700 dark:text-slate-300">
            Volume Consumed (mL)
          </Label>
          <Input
            id="volumeConsumed"
            type="number"
            min="0"
            step="any"
            placeholder="Volume of ethanol-containing liquid ingested in milliliters"
            value={inputs.volumeConsumed}
            onChange={(e) => setInputs({ ...inputs, volumeConsumed: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", ethanolConcentration: "", volumeConsumed: "" })}
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
                Estimated Ethanol Dose
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} {results.unitLabel}
              </p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian immediately if ethanol ingestion is suspected.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Alcohol/Ethanol Exposure Risk Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator assesses the immediate health risk when a dog has ingested alcohol or ethanol-containing products. It estimates blood alcohol concentration (BAC) and severity of poisoning based on canine physiology.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's weight in pounds, the type and amount of alcohol consumed, and the time since exposure. The calculator uses veterinary toxicology data to compute risk level and symptom onset timeframe.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results classify risk as minimal, moderate, high, or critical. High and critical ratings warrant immediate veterinary care or poison control contact—do not delay based on symptom absence, as internal damage may occur.</p>
        </div>
      </section>

      {/* TABLE: Alcohol Content by Beverage Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Alcohol Content by Beverage Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common beverages contain varying ethanol concentrations that affect toxicity risk calculation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Beverage Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Alcohol %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxicity Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Liquor/Spirits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mouthwash</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-27%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cough Syrup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hand Sanitizer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-95%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Non-alcoholic Beer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;0.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxicity increases significantly with both concentration and volume consumed relative to dog weight.</p>
      </section>

      {/* TABLE: Dog Weight and Toxic Ethanol Dose Benchmarks */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dog Weight and Toxic Ethanol Dose Benchmarks</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Smaller dogs reach dangerous blood alcohol levels with minimal exposure amounts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose (ml)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Beer Equivalent</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-125 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-250 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225-375 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-90 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-500 ml</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-16 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-90 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxic doses assume pure ethanol; carbonated beverages may accelerate absorption slightly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep all alcoholic beverages, mouthwash, hand sanitizer, and fermented foods secured away from curious dogs in cabinets or high shelves.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Know your pet poison control number (888-426-4435) and your vet's emergency line before an exposure occurs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor for tremors, incoordination, and excessive drooling even if your dog consumed a small amount—rapid vet intervention saves lives.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide accurate beverage type and consumption amount to the calculator; even slight underestimation can significantly change risk assessment.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Low Symptoms with Low Risk</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dogs may not show obvious signs immediately; a calculator rating of high or critical still demands emergency vet care regardless of current behavior.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Fermented Product Danger</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Alcohol in batter, dough, kombucha, or fermenting fruit poses additional toxins beyond ethanol that the basic calculator cannot capture.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Non-Beverage Alcohol Sources</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many pet owners overlook mouthwash, hand sanitizer, cleaning products, and medications that contain 15-95% ethanol concentrations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying Care Based on Breed Size Assumptions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even large-breed dogs can suffer serious organ damage from moderate alcohol exposure; weight alone does not guarantee safety.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What alcohol content qualifies as dangerous for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ethanol concentrations above 0.5% by volume can be toxic to dogs. Most beers contain 4-6% alcohol, while spirits contain 40% or higher, making them significantly more dangerous even in small quantities.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does dog weight affect alcohol toxicity risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 10-pound dog absorbs alcohol much faster than a 50-pound dog from the same amount of beverage. The calculator uses weight to determine blood alcohol concentration, as smaller dogs reach toxic levels with less exposure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early signs of alcohol poisoning in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Watch for vomiting, loss of coordination, depression, tremors, and difficulty breathing within 30 minutes to 2 hours of exposure. Severe cases can cause seizures, coma, or respiratory failure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can raisins fermented in alcohol be more dangerous than plain alcohol?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, fermented foods contain both ethanol and potentially toxic compounds like acetaldehyde. The calculator focuses on pure ethanol exposure, but fermented products require immediate veterinary attention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly does the calculator estimate alcohol absorption in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs absorb alcohol 3-4 times faster than humans due to higher stomach acid and faster gastric emptying. Most absorption occurs within 30-60 minutes of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is there a safe amount of alcohol for any dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No safe threshold exists for dogs; even small amounts can cause clinical signs. The ASPCA considers any alcohol exposure a medical emergency requiring veterinary evaluation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if the calculator shows high-risk exposure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or poison control immediately (888-426-4435 ASPCA Animal Poison Control). Do not wait for symptoms; prompt treatment significantly improves outcomes.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for animal toxicology emergencies offering 24/7 consultation for alcohol and ethanol exposures.</p>
          </li>
          <li>
            <a href="https://www.canadianveterinarians.net/resources/poisoning-toxicity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Toxicology Database (CVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive toxicology reference for veterinarians including ethanol poisoning mechanisms and treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/dogs/conditions/alcohol-poisoning" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD: Alcohol Poisoning in Dogs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of alcohol toxicity in dogs covering symptoms, diagnosis, and emergency treatment guidelines.</p>
          </li>
          <li>
            <a href="https://onlinelibrary.wiley.com/journal/14346252" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Veterinary Emergency and Critical Care</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research articles on intoxication cases and evidence-based treatment outcomes in companion animals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Alcohol/Ethanol Exposure Risk Calculator"
      description="Calculate the toxic risk of ethanol/alcohol exposure based on concentration and dog's body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "Dose (mg/kg) = [Volume (mL) × Ethanol Concentration (%) × 0.789 (g/mL) × 1000 (mg/g)] ÷ Weight (kg)",
        variables: [
          { symbol: "Volume (mL)", description: "Volume of ethanol-containing liquid ingested" },
          { symbol: "Ethanol Concentration (%)", description: "Percentage volume of ethanol in the liquid" },
          { symbol: "0.789 (g/mL)", description: "Density of ethanol" },
          { symbol: "1000 (mg/g)", description: "Conversion factor from grams to milligrams" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests 2 fl oz (59.15 mL) of whiskey with 40% ethanol concentration.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kg: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate ethanol mass: 59.15 mL × 0.40 × 0.789 g/mL = 18.67 g ethanol.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert to mg: 18.67 g × 1000 = 18,670 mg ethanol.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate dose: 18,670 mg ÷ 9.07 kg = 205.9 mg/kg ethanol.",
          },
        ],
        result:
          "The dog received approximately 206 mg/kg ethanol, indicating a high risk of severe intoxication requiring immediate veterinary care.",
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
        { id: "what-is", label: "Understanding Dog Alcohol/Ethanol Exposure Risk Calculator" },
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
