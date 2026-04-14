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
import { weightToKg } from "@/lib/utils";

const TOXICITY_THRESHOLDS = {
  avocado: 0.05, // grams per kg body weight (persin toxic dose threshold)
  chocolate: 20, // mg theobromine per kg body weight (mild toxicity threshold)
  grapes: 0.1, // grams per kg body weight (potentially toxic dose)
  onion: 0.5, // grams per kg body weight (toxic dose threshold)
  garlic: 0.5, // grams per kg body weight (toxic dose threshold)
};

const TOXICITY_DESCRIPTIONS = {
  avocado:
    "Avocado contains persin, a fungicidal toxin harmful to many birds and some mammals. Toxicity varies by species, but ingestion above 0.05 g/kg body weight can cause respiratory distress, heart damage, and death in sensitive animals.",
  chocolate:
    "Chocolate contains theobromine and caffeine, which are toxic to pets. Mild symptoms may appear at 20 mg/kg theobromine ingestion, including vomiting and hyperactivity. Severe toxicity can lead to seizures and cardiac arrest.",
  grapes:
    "Grapes and raisins can cause acute kidney failure in dogs and some other pets. Toxic doses are estimated at around 0.1 g/kg body weight, though sensitivity varies widely. Even small amounts can be dangerous.",
  onion:
    "Onions contain compounds that cause oxidative damage to red blood cells, leading to hemolytic anemia. Toxic doses start around 0.5 g/kg body weight. Symptoms include weakness, pale gums, and collapse.",
  garlic:
    "Garlic is more potent than onions in causing oxidative damage to red blood cells. Toxicity begins at approximately 0.5 g/kg body weight. Clinical signs include lethargy, rapid breathing, and dark urine.",
};

export default function BirdToxicFoodsExposureCheckerCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  const [inputs, setInputs] = useState({
    weight: "",
    foodType: "avocado",
    amount: "",
    amountUnit: "grams",
  });

  // Convert input weight to kg
  const weightKg = useMemo(() => {
    const w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    return weightToKg(w, unit);
  }, [inputs.weight, unit]);

  // Convert amount to grams
  const amountGrams = useMemo(() => {
    const a = parseFloat(inputs.amount);
    if (isNaN(a) || a <= 0) return null;
    if (inputs.amountUnit === "grams") return a;
    if (inputs.amountUnit === "ounces") return a * 28.3495;
    return null;
  }, [inputs.amount, inputs.amountUnit]);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!weightKg || !amountGrams) {
      return {
        value: 0,
        label: "Please enter valid weight and amount",
        subtext: "",
        warning: null,
      };
    }

    const food = inputs.foodType;
    const toxicDoseThreshold = TOXICITY_THRESHOLDS[food];
    if (!toxicDoseThreshold) {
      return {
        value: 0,
        label: "Unknown food type",
        subtext: "",
        warning: null,
      };
    }

    // Calculate dose per kg body weight
    // For chocolate, threshold is mg/kg theobromine, so convert grams chocolate to mg theobromine approx.
    // Assume average theobromine content in chocolate ~10 mg/g (varies by type)
    let dosePerKg = 0;
    if (food === "chocolate") {
      // amountGrams * 10 mg/g = mg theobromine
      const mgTheobromine = amountGrams * 10;
      dosePerKg = mgTheobromine / weightKg;
    } else {
      // For others, dose in g/kg
      dosePerKg = amountGrams / 1000 / weightKg; // convert grams to kg for dose in kg/kg
    }

    // Determine risk level
    let riskLevel = "Low Risk";
    let warning = null;

    if (food === "chocolate") {
      if (dosePerKg >= toxicDoseThreshold * 5) {
        riskLevel = "Severe Toxicity Risk";
        warning =
          "This amount of chocolate contains a dangerously high level of theobromine and can cause severe poisoning or death. Immediate veterinary care is essential.";
      } else if (dosePerKg >= toxicDoseThreshold) {
        riskLevel = "Moderate Toxicity Risk";
        warning =
          "This amount of chocolate may cause clinical signs such as vomiting, diarrhea, and hyperactivity. Veterinary consultation is recommended.";
      }
    } else {
      if (dosePerKg >= toxicDoseThreshold * 2) {
        riskLevel = "Severe Toxicity Risk";
        warning =
          `The ingested amount of ${food} is well above the toxic threshold and can cause serious health issues or death. Seek emergency veterinary care immediately.`;
      } else if (dosePerKg >= toxicDoseThreshold) {
        riskLevel = "Moderate Toxicity Risk";
        warning =
          `The ingested amount of ${food} may cause adverse effects and clinical signs. Monitor your pet closely and consult your veterinarian.`;
      }
    }

    return {
      value: dosePerKg.toFixed(3),
      label: `Dose per kg body weight (${food === "chocolate" ? "mg theobromine/kg" : "g/kg"})`,
      subtext: `Toxic threshold: ${toxicDoseThreshold} ${food === "chocolate" ? "mg theobromine/kg" : "g/kg"}`,
      warning,
    };
  }, [weightKg, amountGrams, inputs.foodType]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much chocolate is toxic to dogs?",
      answer: "Dark chocolate is most dangerous; 20 mg/kg of theobromine can cause symptoms, and 60 mg/kg may be fatal. Milk chocolate requires higher doses (around 200-500 mg/kg) to cause toxicity.",
    },
    {
      question: "Is avocado safe for cats and dogs?",
      answer: "Avocado contains persin, which is mildly toxic to both dogs and cats. While the fruit flesh rarely causes serious harm, the pit, leaves, and stem are more concentrated and should be avoided completely.",
    },
    {
      question: "What does the Toxic Foods Exposure Checker calculate?",
      answer: "This calculator estimates toxicity risk by comparing your pet's weight, food type, and consumption amount against known toxic thresholds for common household foods.",
    },
    {
      question: "Can grapes and raisins kill dogs?",
      answer: "Yes, grapes and raisins are highly toxic to dogs with unknown compounds causing acute kidney failure. As few as 10-15 grapes have caused fatal reactions in dogs weighing 20-40 lbs.",
    },
    {
      question: "How long after eating toxic food do symptoms appear?",
      answer: "Symptoms typically appear within 1-12 hours depending on the toxin. Chocolate poisoning may take 6-12 hours, while grape toxicity can cause kidney damage within 24-72 hours.",
    },
    {
      question: "Which toxic food is most dangerous: chocolate, avocado, or grapes?",
      answer: "Grapes and raisins are the most dangerous due to unpredictable severity and small toxic doses. Dark chocolate and avocado pits are also serious but require larger quantities for severe effects.",
    },
    {
      question: "Should I use this calculator instead of calling my vet?",
      answer: "No, this calculator is an informational tool only. Always contact your veterinarian or animal poison control (888-426-4435) immediately if your pet ingests a toxic food.",
    }
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
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Pet Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "lb" ? "e.g. 5.5" : "e.g. 2.5"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="foodType" className="text-slate-700 dark:text-slate-300">
            Food Type
          </Label>
          <Select
            value={inputs.foodType}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, foodType: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="avocado">Avocado</SelectItem>
              <SelectItem value="chocolate">Chocolate</SelectItem>
              <SelectItem value="grapes">Grapes/Raisins</SelectItem>
              <SelectItem value="onion">Onion</SelectItem>
              <SelectItem value="garlic">Garlic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
            Amount of Food Ingested
          </Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={inputs.amount}
              onChange={(e) => setInputs((prev) => ({ ...prev, amount: e.target.value }))}
            />
            <Select
              value={inputs.amountUnit}
              onValueChange={(value) => setInputs((prev) => ({ ...prev, amountUnit: value }))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grams">grams</SelectItem>
                <SelectItem value="ounces">ounces</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            setInputs({
              weight: "",
              foodType: "avocado",
              amount: "",
              amountUnit: "grams",
            })
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners quickly assess the potential toxicity risk after their dog, cat, or other pet has ingested common household foods. It cross-references your pet's weight, the food consumed, and the quantity against established veterinary toxicology data.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your pet's species and weight in pounds, select the toxic food from the dropdown list, and enter the estimated amount consumed. The calculator will determine whether the exposure falls into safe, mild, moderate, or severe risk categories.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results are informational only and should never replace professional veterinary advice. If your pet consumed a potentially toxic food, contact your veterinarian or ASPCA Animal Poison Control (888-426-4435) immediately, regardless of the calculator's output.</p>
        </div>
      </section>

      {/* TABLE: Toxic Thresholds for Common Pet Toxins */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Toxic Thresholds for Common Pet Toxins</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference thresholds showing estimated toxic doses for common household foods in dogs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Compound</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dangerous Dose Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Theobromine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz for 10 lb dog</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milk Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Theobromine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple bars needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grapes/Raisins</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unknown toxin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 grapes per 20-40 lb dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very small amounts</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Avocado</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Persin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low toxicity in fruit flesh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pit &amp; leaves more dangerous</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Macadamia Nuts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unknown compound</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4 grams/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 nuts for 10 lb dog</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Xylitol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Xylitol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1 grams/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small amount causes liver damage</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses vary by individual pet sensitivity and health status. These are general guidelines based on veterinary toxicology data.</p>
      </section>

      {/* TABLE: Symptom Timeline by Toxin Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Symptom Timeline by Toxin Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Expected symptom onset after toxic food ingestion in dogs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Onset Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Early Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chocolate/Theobromine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, restlessness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild to severe</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grapes/Raisins</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-72 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, loss of appetite, lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe (kidney failure)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Avocado (pit/leaves)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, abdominal pain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild to moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Macadamia Nuts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weakness, tremors, hyperthermia</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild to moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Xylitol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 minutes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, hypoglycemia, lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe (liver damage)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Onions/Garlic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weakness, anemia, pale gums</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate to severe</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Onset times are approximate; seek immediate veterinary care for any suspected poisoning.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Store chocolate, grapes, macadamia nuts, and xylitol-containing foods in locked cabinets away from curious pets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep the ASPCA Poison Control number (888-426-4435) and your vet's emergency number saved in your phone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Dark chocolate and baking chocolate are more toxic than milk chocolate due to higher theobromine concentration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Avocado pits pose choking hazards and contain higher persin concentrations than the fruit flesh alone.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all chocolate is equally toxic</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Milk chocolate is far less dangerous than dark or baking chocolate; the theobromine content varies dramatically by cocoa percentage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying on calculator results without veterinary consultation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Individual pet sensitivity, health conditions, and metabolic factors make professional evaluation essential for any suspected poisoning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Waiting to see symptoms before seeking help</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some toxins like grapes cause delayed kidney damage; don't wait for vomiting or lethargy to contact your vet.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the pet's species when assessing toxicity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats metabolize toxins differently than dogs; xylitol and grapes affect both, but dosage thresholds may vary by species.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much chocolate is toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dark chocolate is most dangerous; 20 mg/kg of theobromine can cause symptoms, and 60 mg/kg may be fatal. Milk chocolate requires higher doses (around 200-500 mg/kg) to cause toxicity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is avocado safe for cats and dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Avocado contains persin, which is mildly toxic to both dogs and cats. While the fruit flesh rarely causes serious harm, the pit, leaves, and stem are more concentrated and should be avoided completely.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the Toxic Foods Exposure Checker calculate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates toxicity risk by comparing your pet's weight, food type, and consumption amount against known toxic thresholds for common household foods.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can grapes and raisins kill dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, grapes and raisins are highly toxic to dogs with unknown compounds causing acute kidney failure. As few as 10-15 grapes have caused fatal reactions in dogs weighing 20-40 lbs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long after eating toxic food do symptoms appear?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms typically appear within 1-12 hours depending on the toxin. Chocolate poisoning may take 6-12 hours, while grape toxicity can cause kidney damage within 24-72 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which toxic food is most dangerous: chocolate, avocado, or grapes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Grapes and raisins are the most dangerous due to unpredictable severity and small toxic doses. Dark chocolate and avocado pits are also serious but require larger quantities for severe effects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use this calculator instead of calling my vet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator is an informational tool only. Always contact your veterinarian or animal poison control (888-426-4435) immediately if your pet ingests a toxic food.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official resource for pet poisoning emergencies with 24/7 hotline support and toxin database.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary toxicology database with specific toxic food thresholds and treatment recommendations.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization providing evidence-based guidance on pet nutrition and toxicology.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/toxicology/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference for veterinary toxins, clinical signs, and treatment protocols for toxic exposures.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)"
      description="Check the toxicity of common human foods like **Avocado, Chocolate, and fruit seeds** for pet birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose per kg body weight = (Amount ingested in mg or g) / Body weight in kg",
        variables: [
          { symbol: "Dose per kg", description: "Toxic dose relative to pet's body weight" },
          { symbol: "Amount ingested", description: "Quantity of toxic food consumed" },
          { symbol: "Body weight", description: "Pet's weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4 lb (1.81 kg) bird ingests 5 grams of avocado flesh. Determine the risk of toxicity based on persin content.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert bird weight to kg (already 1.81 kg). Calculate dose: 5 g avocado / 1.81 kg = 2.76 g/kg.",
          },
          {
            label: "2",
            explanation:
              "Compare dose to toxic threshold for avocado (0.05 g/kg). The dose is significantly higher, indicating severe toxicity risk.",
          },
          {
            label: "3",
            explanation:
              "Immediate veterinary care is advised due to high risk of respiratory and cardiac effects from persin.",
          },
        ],
        result: "Dose per kg = 2.76 g/kg, which exceeds the toxic threshold of 0.05 g/kg, indicating severe toxicity risk.",
      }}
      relatedCalculators={[
        { title: "Vitamin A Requirement Calculator", url: "/pets/bird-vitamin-a-requirement", icon: "🐾" },
        { title: "Resting vs. Active Hours Balance Tracker (owner input)", url: "/pets/cat-resting-active-hours-balance-tracker", icon: "🐶" },
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Horse Calorie & Energy Requirement Calculator (DE / TDN)", url: "/pets/horse-calorie-energy-requirement-de-tdn", icon: "🐎" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)" },
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
