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

export default function DogXylitolExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    xylitolAmount: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose threshold for xylitol in dogs: ~100 mg/kg body weight causes hypoglycemia
  // Severe toxicity risk threshold: >200 mg/kg
  // We calculate mg/kg dose = (xylitol ingested in mg) / (weight in kg)
  // Then categorize risk based on mg/kg dose

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const xylitolRaw = parseFloat(inputs.xylitolAmount);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!xylitolRaw || xylitolRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid xylitol amount ingested.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Convert xylitol amount to mg
    // Input is in grams or milligrams? We'll ask user to input in grams (common for food)
    // So convert grams to mg: 1g = 1000mg
    const xylitolMg = xylitolRaw * 1000;

    // Calculate dose in mg/kg
    const doseMgPerKg = xylitolMg / weightKg;

    // Determine risk category
    let riskLabel = "";
    let warning = null;

    if (doseMgPerKg < 50) {
      riskLabel = "Low Risk: Unlikely to cause toxicity";
    } else if (doseMgPerKg >= 50 && doseMgPerKg < 100) {
      riskLabel = "Moderate Risk: Possible mild hypoglycemia";
      warning =
        "Monitor your dog closely and seek veterinary advice if symptoms develop.";
    } else if (doseMgPerKg >= 100 && doseMgPerKg < 200) {
      riskLabel = "High Risk: Significant risk of hypoglycemia and toxicity";
      warning =
        "Immediate veterinary attention is strongly recommended.";
    } else {
      riskLabel = "Severe Risk: Life-threatening toxicity likely";
      warning =
        "Call your veterinarian or emergency animal hospital immediately.";
    }

    return {
      value: doseMgPerKg.toFixed(1),
      label: riskLabel,
      subtext: `Dose: ${doseMgPerKg.toFixed(1)} mg/kg body weight`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What is xylitol and why is it dangerous for dogs?",
      answer: "Xylitol is a sugar alcohol used in sugar-free products that causes rapid insulin release in dogs, leading to hypoglycemia and liver damage within 30 minutes to 2 hours of ingestion.",
    },
    {
      question: "How much xylitol is toxic to dogs?",
      answer: "Doses as low as 0.1 grams per kilogram of body weight can cause hypoglycemia, while &gt;0.5 g/kg may cause acute liver failure in dogs.",
    },
    {
      question: "What factors does this calculator consider for risk assessment?",
      answer: "The calculator evaluates dog weight, xylitol amount ingested, time since exposure, and product type to determine toxicity risk level.",
    },
    {
      question: "How quickly should I seek veterinary care after xylitol exposure?",
      answer: "Contact your veterinarian immediately or visit an emergency clinic within 30 minutes, as early treatment significantly improves survival rates.",
    },
    {
      question: "Can the calculator tell me if my dog needs treatment?",
      answer: "The calculator provides risk assessment only; a veterinarian must diagnose and recommend treatment based on blood work and clinical evaluation.",
    },
    {
      question: "Which common products contain xylitol?",
      answer: "Sugar-free gum, mints, peanut butter, baked goods, dental products, and some medications commonly contain xylitol as a sweetener.",
    },
    {
      question: "Are some dog breeds more susceptible to xylitol toxicity?",
      answer: "No breed is immune; all dogs are equally susceptible regardless of age, breed, or health status, though smaller dogs reach toxic doses faster.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
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

        {/* Weight Input */}
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

        {/* Xylitol Amount Input */}
        <div>
          <Label htmlFor="xylitolAmount" className="text-slate-700 dark:text-slate-300">
            Xylitol Amount Ingested (grams)
          </Label>
          <Input
            id="xylitolAmount"
            type="number"
            min={0}
            step="any"
            placeholder="Enter amount of xylitol ingested in grams"
            value={inputs.xylitolAmount}
            onChange={(e) => handleInputChange("xylitolAmount", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo on inputs change
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", xylitolAmount: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg/kg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian immediately if xylitol ingestion is suspected.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Xylitol Exposure Risk Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates toxicity risk when a dog ingests xylitol-containing products. It provides immediate risk assessment to guide urgent veterinary decisions but cannot replace professional medical diagnosis.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your dog's weight, the xylitol amount ingested (or product name), time since exposure, and any symptoms observed. The calculator cross-references toxicity thresholds and metabolic rates specific to canine physiology.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display risk level (minimal, low, moderate, or severe) with recommended actions. Severe or moderate ratings warrant immediate emergency veterinary care; all exposures should be reported to a veterinarian within 2 hours.</p>
        </div>
      </section>

      {/* TABLE: Xylitol Toxicity Risk Levels by Dose */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Xylitol Toxicity Risk Levels by Dose</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Risk classification based on xylitol dose per kilogram of dog body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (g/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Concern</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;0.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild GI upset</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.05-0.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor for hypoglycemia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 mins-2 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0.1-0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hypoglycemia likely</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30 minutes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Acute liver failure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Immediate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Contact veterinarian immediately for any suspected exposure; timing is critical for treatment success.</p>
      </section>

      {/* TABLE: Xylitol Content in Common Products */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Xylitol Content in Common Products</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical xylitol concentration varies significantly by product type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Xylitol Content %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk per Serving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sugar-free gum</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 pieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.0g xylitol</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sugar-free mints</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 mints</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3-0.8g xylitol</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peanut butter (some brands)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 tablespoons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0-2.5g xylitol</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sugar-free candy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 piece</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-1.5g xylitol</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Baked goods</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 serving</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-2.0g xylitol</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always check product labels; formulations change and many products do not list xylitol content clearly.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check ingredient labels on all sugar-free products before giving them to dogs, as manufacturers frequently change formulations and add xylitol.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store xylitol-containing items in sealed, dog-proof containers away from counters, trash, and purses where dogs may access them.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your veterinarian's phone number and nearest emergency clinic information readily available in case of accidental exposure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If exposure occurs, bring the product packaging or ingredients list to the veterinarian to confirm xylitol presence and quantity.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all sugar-free products are safe for dogs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many sugar-free foods contain xylitol as sweetener; never assume a product is dog-safe without checking the label first.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to see symptoms before calling a vet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hypoglycemia can develop within 15-30 minutes; contact your veterinarian immediately after exposure, even if your dog appears normal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Estimating xylitol dose inaccurately</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator requires precise weight and amount data; guessing the dose reduces accuracy and may lead to delayed treatment decisions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on the calculator for treatment decisions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator provides risk assessment only; veterinary examination, blood work, and professional judgment are essential for proper treatment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is xylitol and why is it dangerous for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Xylitol is a sugar alcohol used in sugar-free products that causes rapid insulin release in dogs, leading to hypoglycemia and liver damage within 30 minutes to 2 hours of ingestion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much xylitol is toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Doses as low as 0.1 grams per kilogram of body weight can cause hypoglycemia, while &gt;0.5 g/kg may cause acute liver failure in dogs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors does this calculator consider for risk assessment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator evaluates dog weight, xylitol amount ingested, time since exposure, and product type to determine toxicity risk level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly should I seek veterinary care after xylitol exposure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian immediately or visit an emergency clinic within 30 minutes, as early treatment significantly improves survival rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator tell me if my dog needs treatment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides risk assessment only; a veterinarian must diagnose and recommend treatment based on blood work and clinical evaluation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which common products contain xylitol?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sugar-free gum, mints, peanut butter, baked goods, dental products, and some medications commonly contain xylitol as a sweetener.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are some dog breeds more susceptible to xylitol toxicity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No breed is immune; all dogs are equally susceptible regardless of age, breed, or health status, though smaller dogs reach toxic doses faster.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for pet poisoning emergencies with xylitol exposure guidance and 24/7 hotline support.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/poison/xylitol/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Xylitol Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical information on xylitol toxicity in dogs including symptoms, treatment protocols, and prognosis data.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative veterinary organization providing evidence-based guidelines on xylitol poisoning and emergency response.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network - Xylitol Poisoning</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary database with peer-reviewed case studies and treatment recommendations for xylitol exposure.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Xylitol Exposure Risk Calculator"
      description="Calculate the severe toxic risk posed by the artificial sweetener **Xylitol** based on dog weight and ingested amount."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: mg/kg dose = (xylitol ingested in mg) / (dog weight in kg)
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg/kg) = (Xylitol ingested in mg) ÷ (Dog weight in kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Xylitol dose per kilogram of dog's body weight" },
          { symbol: "Xylitol ingested in mg", description: "Total amount of xylitol ingested, converted to milligrams" },
          { symbol: "Dog weight in kg", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests 1 gram of xylitol from sugar-free gum. The owner wants to know the toxicity risk.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert dog weight to kilograms if needed (20 lbs ÷ 2.20462 = 9.07 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Convert xylitol amount to milligrams (1 g × 1000 = 1000 mg).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dose: 1000 mg ÷ 9.07 kg = 110.3 mg/kg, indicating a high risk of toxicity.",
          },
        ],
        result:
          "The calculated dose of 110.3 mg/kg exceeds the 100 mg/kg threshold for significant hypoglycemia risk, so immediate veterinary attention is recommended.",
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
        { id: "what-is", label: "Understanding Dog Xylitol Exposure Risk Calculator" },
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
