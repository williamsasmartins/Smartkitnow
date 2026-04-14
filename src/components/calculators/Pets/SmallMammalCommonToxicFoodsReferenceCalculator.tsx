import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const TOXIC_FOODS_MG_PER_KG = {
  "chocolate": 20, // Theobromine toxic dose mg/kg
  "grapes": 5, // Approximate toxic dose mg/kg (variable)
  "onion": 5, // Approximate toxic dose mg/kg (variable)
  "xylitol": 0.1, // Very low toxic dose mg/kg
  "macadamia": 10, // Approximate toxic dose mg/kg
};

export default function SmallMammalCommonToxicFoodsReferenceCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and food type, amount ingested (grams)
  const [inputs, setInputs] = useState({
    weight: "",
    foodType: "",
    amount: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const amountNum = parseFloat(inputs.amount);
    const foodType = inputs.foodType.toLowerCase();

    if (
      !weightNum ||
      weightNum <= 0 ||
      !amountNum ||
      amountNum <= 0 ||
      !foodType ||
      !(foodType in TOXIC_FOODS_MG_PER_KG)
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Convert amount ingested from grams to mg
    const amountMg = amountNum * 1000;

    // Calculate mg/kg dose ingested
    const doseMgPerKg = amountMg / weightKg;

    // Toxic threshold mg/kg for the food
    const toxicThreshold = TOXIC_FOODS_MG_PER_KG[foodType];

    // Risk assessment
    let riskLevel = "Low Risk";
    let warning: string | null = null;

    if (doseMgPerKg >= toxicThreshold) {
      riskLevel = "High Risk";
      warning = `The ingested dose of ${doseMgPerKg.toFixed(
        2
      )} mg/kg exceeds the toxic threshold for ${foodType} (${toxicThreshold} mg/kg). Immediate veterinary attention is recommended.`;
    } else if (doseMgPerKg >= toxicThreshold * 0.5) {
      riskLevel = "Moderate Risk";
      warning = `The ingested dose of ${doseMgPerKg.toFixed(
        2
      )} mg/kg is approaching the toxic threshold for ${foodType} (${toxicThreshold} mg/kg). Monitor your pet closely and consult a veterinarian if symptoms develop.`;
    }

    return {
      value: doseMgPerKg.toFixed(2),
      label: `Estimated Dose (mg/kg) of ${foodType}`,
      subtext: `Toxic Threshold: ${toxicThreshold} mg/kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Which common household foods are toxic to dogs?",
      answer: "Chocolate, grapes, raisins, onions, garlic, avocado, macadamia nuts, and xylitol-containing products are highly toxic to dogs and can cause serious health issues.",
    },
    {
      question: "How much chocolate is dangerous for a dog?",
      answer: "Dark chocolate is most dangerous; as little as 0.3 ounces per pound of body weight can cause toxicity in dogs, while milk chocolate requires about 0.5 ounces per pound.",
    },
    {
      question: "Are grapes and raisins equally toxic to pets?",
      answer: "Yes, both grapes and raisins are equally toxic to dogs and cats; even a small amount (as few as 3-4 grapes) can cause kidney failure in some pets.",
    },
    {
      question: "What makes xylitol dangerous for pets?",
      answer: "Xylitol causes rapid insulin release in dogs, leading to severe hypoglycemia and liver damage; as little as 0.1 grams per kilogram of body weight can be toxic.",
    },
    {
      question: "Can cats safely eat foods that are toxic to dogs?",
      answer: "No, cats are more sensitive to many toxins than dogs; lilies, onions, garlic, and certain essential oils are particularly dangerous for felines.",
    },
    {
      question: "How should I respond if my pet ingests a toxic food?",
      answer: "Contact your veterinarian or pet poison control immediately with the pet's weight, food type, and amount ingested so they can assess risk and recommend treatment.",
    },
    {
      question: "What is the ASPCA Animal Poison Control Center contact?",
      answer: "The ASPCA Animal Poison Control Center operates 24/7 at 888-426-4435; a consultation fee applies but they provide expert guidance on toxicity cases.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Pet Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 10" : "e.g. 4.5"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="foodType" className="text-slate-700 dark:text-slate-300">
            Toxic Food Type
          </Label>
          <select
            id="foodType"
            value={inputs.foodType}
            onChange={(e) => setInputs({ ...inputs, foodType: e.target.value })}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="">Select a food</option>
            {Object.keys(TOXIC_FOODS_MG_PER_KG).map((food) => (
              <option key={food} value={food}>
                {food.charAt(0).toUpperCase() + food.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
            Amount Ingested (grams)
          </Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.amount}
            onChange={(e) => setInputs({ ...inputs, amount: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", foodType: "", amount: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Common Toxic Foods Reference</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This reference calculator helps pet owners quickly identify whether a food is toxic to their dog or cat and determine the risk level based on pet weight and amount consumed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the tool, select your pet type (dog or cat), enter the food consumed, your pet's weight in pounds or kilograms, and the approximate quantity ingested.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator provides toxicity risk assessment and recommends whether immediate veterinary care is needed based on current toxicological data and safety thresholds.</p>
        </div>
      </section>

      {/* TABLE: Toxic Foods and Toxicity Thresholds for Dogs */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Toxic Foods and Toxicity Thresholds for Dogs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing common toxic foods and approximate dangerous dose levels for a typical 50-pound dog.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dangerous Amount (50 lb dog)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chocolate (dark)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Theobromine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 ounces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, tremors, seizures</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grapes/Raisins</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unknown compound</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 grapes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kidney failure, vomiting</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Onions/Garlic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Thiosulfates</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hemolytic anemia, lethargy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Macadamia nuts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unknown toxin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7-2.4 grams per kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weakness, tremors, hyperthermia</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Xylitol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Xylitol sugar alcohol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1 grams per kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hypoglycemia, liver failure</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Avocado</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Persin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High quantities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vomiting, diarrhea, pancreatitis</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Alcohol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ethanol</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any amount</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Intoxication, respiratory depression</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxicity levels vary by individual pet sensitivity and formulation; always consult a veterinarian for specific cases.</p>
      </section>

      {/* TABLE: Foods Toxic to Cats vs. Safe Human Foods */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Foods Toxic to Cats vs. Safe Human Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Comparison table showing foods that are dangerous to cats and safer alternatives.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Toxic to Cats</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Why Dangerous</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Alternative</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lilies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kidney failure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cat grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All parts are toxic</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Onions/Garlic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Red blood cell damage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cooked carrots</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Even powdered forms dangerous</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Raw dough</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stomach expansion</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cooked chicken</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yeast fermentation is toxic</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Raw eggs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Salmonella/thiamine loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cooked eggs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Can cause neurological issues</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Theobromine toxicity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tuna treats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All types are toxic</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Caffeine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heart/nervous system</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Water or cat milk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Includes tea and coffee</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grapes/Raisins</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kidney damage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Melon pieces</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unknown toxic compound</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cats are obligate carnivores and have unique sensitivities; consult veterinarians before introducing new foods.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep the ASPCA Animal Poison Control number (888-426-4435) saved in your phone for emergencies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Many human foods safe for adult dogs are dangerous for puppies or senior dogs; verify age-appropriate safety before sharing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Chocolate toxicity varies by type: dark chocolate &gt; milk chocolate &gt; white chocolate in terms of danger level.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store toxic foods in closed cabinets away from pets and inform guests about pet-safe food restrictions to prevent accidental poisoning.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all pets have the same toxicity thresholds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats, dogs, and other animals metabolize toxins differently; a food safe for dogs may be deadly for cats and vice versa.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary care after toxic ingestion</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Time is critical with toxin exposure; contact your vet immediately rather than waiting to see if symptoms develop.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on pet food labels for toxicity info</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some pet foods contain hidden toxic ingredients like xylitol or excessive salt that aren't prominently displayed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for pet weight when calculating danger</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A macadamia nut safe for a 100-pound dog could be toxic for a 10-pound cat; always adjust calculations by actual weight.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which common household foods are toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chocolate, grapes, raisins, onions, garlic, avocado, macadamia nuts, and xylitol-containing products are highly toxic to dogs and can cause serious health issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much chocolate is dangerous for a dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dark chocolate is most dangerous; as little as 0.3 ounces per pound of body weight can cause toxicity in dogs, while milk chocolate requires about 0.5 ounces per pound.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are grapes and raisins equally toxic to pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, both grapes and raisins are equally toxic to dogs and cats; even a small amount (as few as 3-4 grapes) can cause kidney failure in some pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What makes xylitol dangerous for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Xylitol causes rapid insulin release in dogs, leading to severe hypoglycemia and liver damage; as little as 0.1 grams per kilogram of body weight can be toxic.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can cats safely eat foods that are toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, cats are more sensitive to many toxins than dogs; lilies, onions, garlic, and certain essential oils are particularly dangerous for felines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I respond if my pet ingests a toxic food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian or pet poison control immediately with the pet's weight, food type, and amount ingested so they can assess risk and recommend treatment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ASPCA Animal Poison Control Center contact?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The ASPCA Animal Poison Control Center operates 24/7 at 888-426-4435; a consultation fee applies but they provide expert guidance on toxicity cases.</p>
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
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">24/7 veterinary toxicology resource providing expert guidance on pet poisoning emergencies with consultation fees.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Staffed by licensed veterinary toxicologists offering immediate telephone consultation for pet poisoning cases.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary/animal-health-literacy/pet-food-recalls-and-safety" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Pet Food Safety Recall Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official database tracking recalled pet foods and ingredients determined unsafe by regulatory review.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/toxic-substances" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Pet Toxin Prevention Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Veterinary Medical Association's comprehensive guide to household toxins and pet safety protocols.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Common Toxic Foods Reference"
      description="Reference guide for common toxic or dangerous foods for small pets (e.g., certain seeds, nuts, or sugary items)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg/kg) = (Amount Ingested in mg) ÷ (Pet Weight in kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Estimated toxin dose per kilogram of pet body weight" },
          { symbol: "Amount Ingested in mg", description: "Mass of toxic food ingested converted to milligrams" },
          { symbol: "Pet Weight in kg", description: "Body weight of the pet in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb dog ingests 5 grams of chocolate. The toxic threshold for theobromine in chocolate is approximately 20 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the dog's weight to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Convert the amount ingested to milligrams: 5 g × 1000 = 5000 mg.",
          },
          {
            label: "3",
            explanation:
              "Calculate the dose: 5000 mg ÷ 4.54 kg = 1101 mg/kg, which far exceeds the toxic threshold.",
          },
        ],
        result:
          "The dog has ingested a highly toxic dose of theobromine and requires immediate veterinary care.",
      }}
      relatedCalculators={[
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Feather Plucking & Stress Risk Index",
          url: "/pets/bird-feather-plucking-stress-risk-index",
          icon: "🐶",
        },
        {
          title: "Horse Selenium Toxicity Threshold (ppm)",
          url: "/pets/horse-selenium-toxicity-threshold",
          icon: "🐎",
        },
        {
          title: "Horse Gestation (Due Date) Calculator",
          url: "/pets/horse-gestation-due-date",
          icon: "🐎",
        },
        {
          title: "Laminitis Risk Index (BCS + NSC intake)",
          url: "/pets/horse-laminitis-risk-index",
          icon: "💉",
        },
        {
          title: "Resting vs. Active Hours Balance Tracker (owner input)",
          url: "/pets/cat-resting-active-hours-balance-tracker",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Common Toxic Foods Reference" },
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
