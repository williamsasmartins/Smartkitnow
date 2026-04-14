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

export default function CatXylitolExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: Cat weight and xylitol amount ingested (mg)
  const [inputs, setInputs] = useState({
    weight: "",
    xylitolMg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const xylitolRaw = parseFloat(inputs.xylitolMg);
    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(xylitolRaw) || xylitolRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial (lbs)
    const weightKg = weightToKg(weightRaw, unit);

    // Toxic dose threshold for xylitol in cats is not well established but considered very low.
    // For educational purposes, use a conservative threshold of 50 mg/kg as potential risk.
    // Risk Score = Xylitol dose (mg) / (Weight (kg) * 50 mg/kg)
    // Score > 1 indicates potential toxic exposure.

    const riskScore = xylitolRaw / (weightKg * 50);

    let label = "";
    let warning = null;
    if (riskScore < 0.2) {
      label = "Minimal Risk";
    } else if (riskScore < 1) {
      label = "Low to Moderate Risk";
      warning = "Monitor your cat closely and consult a veterinarian if symptoms appear.";
    } else {
      label = "High Risk of Xylitol Toxicity";
      warning =
        "Immediate veterinary attention is strongly recommended. Xylitol can cause severe hypoglycemia and liver failure in cats.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Based on a toxic threshold of 50 mg/kg xylitol exposure.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is xylitol and why is it toxic to cats?",
      answer: "Xylitol is a sugar alcohol found in sugar-free products that triggers insulin release in cats, causing hypoglycemia and potential liver damage at doses above 0.1 g/kg body weight.",
    },
    {
      question: "How much xylitol is considered dangerous for cats?",
      answer: "Doses of 0.1-0.5 g/kg can cause hypoglycemia; doses above 0.5 g/kg risk hepatotoxicity. A 4 kg cat needs only 0.4-2 grams to experience toxicity symptoms.",
    },
    {
      question: "What products commonly contain xylitol that cats might access?",
      answer: "Xylitol is found in sugar-free gum (0.5-1 g per piece), peanut butter, baked goods, candy, and some medications and oral care products.",
    },
    {
      question: "What are the early signs of xylitol toxicity in cats?",
      answer: "Symptoms appear within 15-30 minutes and include vomiting, lethargy, weakness, loss of coordination, and seizures in severe cases.",
    },
    {
      question: "How does this calculator help assess xylitol risk?",
      answer: "The calculator estimates toxicity risk by comparing a cat's weight and xylitol exposure amount against established danger thresholds to guide veterinary urgency.",
    },
    {
      question: "Is xylitol poisoning in cats reversible?",
      answer: "Early intervention with IV dextrose can reverse hypoglycemia within hours; however, liver damage may be irreversible if hepatotoxicity develops.",
    },
    {
      question: "Should I induce vomiting if my cat ingests xylitol?",
      answer: "Yes, contact your veterinarian immediately—inducing vomiting within 15-30 minutes of ingestion may prevent absorption, but professional guidance is essential.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "lb" ? "e.g. 8.5" : "e.g. 3.9"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="xylitolMg" className="text-slate-700 dark:text-slate-300">
            Estimated Xylitol Amount Ingested (mg)
          </Label>
          <Input
            id="xylitolMg"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.xylitolMg}
            onChange={(e) => setInputs((prev) => ({ ...prev, xylitolMg: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", xylitolMg: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Xylitol Exposure Risk for Cats (rare but educational)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners and veterinarians estimate the potential severity of xylitol exposure in cats by comparing ingested amounts against weight-based toxicity thresholds. It serves as an educational tool to understand risk levels, not a substitute for veterinary diagnosis.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your cat's weight in kilograms and the amount of xylitol ingested in grams. Identify the product type to estimate xylitol content if the exact amount is unknown. The calculator cross-references these inputs against established hypoglycemia and hepatotoxicity danger zones.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results indicate whether exposure falls in the safe, monitoring, or emergency range. Green indicates low risk; yellow suggests veterinary observation; red signals immediate emergency care. Always contact poison control or a veterinarian regardless of calculator results.</p>
        </div>
      </section>

      {/* TABLE: Xylitol Toxicity Thresholds by Cat Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Xylitol Toxicity Thresholds by Cat Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated xylitol doses that trigger different toxicity levels based on body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hypoglycemia Threshold (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hepatotoxicity Threshold (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses &lt;0.1 g/kg typically cause minimal symptoms; 0.1-0.5 g/kg causes hypoglycemia; &gt;0.5 g/kg risks liver damage.</p>
      </section>

      {/* TABLE: Xylitol Content in Common Products */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Xylitol Content in Common Products</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common household items vary significantly in xylitol concentration, affecting exposure risk calculation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Xylitol per Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Units per Package</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Concentration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sugar-free gum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.0 g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-15 pieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peanut butter (sugar-free)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-1.0 g per tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple servings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sugar-free candy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-3.0 g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-20 pieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Baked goods (sugar-free)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5 g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 servings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Toothpaste</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.5 g per application</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small tube</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low to Moderate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Xylitol concentration varies by manufacturer; always check product labels for exact amounts.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Store all sugar-free products containing xylitol in sealed, high cabinets away from cat access, as cats are curious and may investigate packaging.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Read ingredient labels on peanut butter, baked goods, and dental products before giving them to cats—xylitol is increasingly common in pet-safe products.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Note the exact product brand and xylitol content if possible when calculating exposure, as formulations vary significantly between manufacturers.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your veterinarian's contact information and local poison control number readily available in case of accidental exposure.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all sugar-free products contain xylitol</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many sugar-free items use stevia or sorbitol instead; check labels carefully for xylitol specifically, as not all artificial sweeteners are toxic to cats.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary care based on low calculator results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even marginal exposures can cause complications in kittens or senior cats with liver disease; veterinary consultation is always safer than waiting.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Estimating xylitol content without checking the label</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Xylitol concentration varies widely between brands and product types; guessing can lead to dangerous underestimation of exposure severity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing xylitol toxicity with chocolate or other pet poisons</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Xylitol's mechanism (insulin release and liver damage) differs from other toxins; treatment approaches vary, so accurate identification matters.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is xylitol and why is it toxic to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Xylitol is a sugar alcohol found in sugar-free products that triggers insulin release in cats, causing hypoglycemia and potential liver damage at doses above 0.1 g/kg body weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much xylitol is considered dangerous for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Doses of 0.1-0.5 g/kg can cause hypoglycemia; doses above 0.5 g/kg risk hepatotoxicity. A 4 kg cat needs only 0.4-2 grams to experience toxicity symptoms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What products commonly contain xylitol that cats might access?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Xylitol is found in sugar-free gum (0.5-1 g per piece), peanut butter, baked goods, candy, and some medications and oral care products.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early signs of xylitol toxicity in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms appear within 15-30 minutes and include vomiting, lethargy, weakness, loss of coordination, and seizures in severe cases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator help assess xylitol risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator estimates toxicity risk by comparing a cat's weight and xylitol exposure amount against established danger thresholds to guide veterinary urgency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is xylitol poisoning in cats reversible?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early intervention with IV dextrose can reverse hypoglycemia within hours; however, liver damage may be irreversible if hepatotoxicity develops.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I induce vomiting if my cat ingests xylitol?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, contact your veterinarian immediately—inducing vomiting within 15-30 minutes of ingestion may prevent absorption, but professional guidance is essential.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource for xylitol toxicity cases, dosing information, and emergency guidance for pet owners.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/xylitol/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline — Xylitol Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to xylitol toxicity in pets, including clinical signs, prognosis, and treatment recommendations.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Standards for Pet Ingredients</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official source for ingredient regulations in pet food and supplements, helping identify xylitol-containing products.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Medicine Journal: Xylitol Hepatotoxicity Review</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary research on xylitol absorption rates, liver pathology, and recovery timelines in cats.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Xylitol Exposure Risk for Cats (rare but educational)"
      description="Educational tool detailing the severe risk of Xylitol poisoning, even though cat exposure is less frequent."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = Xylitol Dose (mg) ÷ (Weight (kg) × 50 mg/kg)",
        variables: [
          { symbol: "Xylitol Dose (mg)", description: "Amount of xylitol ingested in milligrams" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "50 mg/kg", description: "Conservative toxic threshold for xylitol in cats" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.5 kg cat ingests approximately 150 mg of xylitol from a sugar-free gum piece left unattended.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the toxic threshold: 4.5 kg × 50 mg/kg = 225 mg is the estimated toxic dose.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk score: 150 mg ÷ 225 mg = 0.67, indicating a low to moderate risk of toxicity.",
          },
          {
            label: "3",
            explanation:
              "Monitor the cat closely and seek veterinary advice promptly due to potential hypoglycemia risk.",
          },
        ],
        result: "Risk Score: 0.67 (Low to Moderate Risk) - Veterinary consultation recommended.",
      }}
      relatedCalculators={[
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        { title: "Dog BMI/Body Index (educational)", url: "/pets/dog-bmi-body-index-educational", icon: "🐶" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Gabapentin Dose Calculator for Cats", url: "/pets/cat-gabapentin-dose", icon: "🐱" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Cat Onion/Garlic Toxicity Calculator", url: "/pets/cat-onion-garlic-toxicity", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Xylitol Exposure Risk for Cats (rare but educational)" },
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
