import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

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
  const [unit, setUnit] = useState("imperial");

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
    return unit === "imperial" ? w / 2.20462 : w;
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
    let toxicDoseThreshold = TOXICITY_THRESHOLDS[food];
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
      question: "Why are some common human foods toxic to birds and pets?",
      answer:
        "Many human foods contain compounds that animals metabolize differently, leading to toxicity. For example, persin in avocados and theobromine in chocolate can cause severe organ damage or neurological symptoms in pets. Understanding these differences helps prevent accidental poisonings and ensures pet safety.",
    },
    {
      question: "How does body weight affect the toxicity risk of a food?",
      answer:
        "Toxicity is often dose-dependent and calculated relative to body weight, usually in mg or grams per kilogram. Smaller animals require much smaller amounts to reach toxic levels compared to larger ones. This is why accurate weight measurement is critical when assessing exposure risk.",
    },
    {
      question: "What should I do if my pet ingests a toxic food?",
      answer:
        "Immediate veterinary consultation is essential if you suspect toxic ingestion. Early intervention can include inducing vomiting, administering activated charcoal, or supportive care to prevent absorption and mitigate symptoms. Time is critical to improve outcomes in poisoning cases.",
    },
    {
      question: "Can all types of chocolate cause toxicity in pets?",
      answer:
        "No, the toxicity depends on the type and concentration of theobromine, which varies widely. Dark and baking chocolates contain much higher levels than milk chocolate, increasing the risk. Always consider the chocolate type and amount ingested when assessing risk.",
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
            Pet Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 5.5" : "e.g. 2.5"}
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Toxic foods such as avocado, chocolate, grapes, onions, and garlic contain compounds that can be harmful or even fatal to birds and other pets. These substances interfere with normal metabolic processes, causing symptoms ranging from mild gastrointestinal upset to severe organ failure. Because pets metabolize these toxins differently than humans, even small amounts can pose significant health risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Avocado contains persin, a fungicidal toxin that affects the heart and lungs of sensitive species, especially birds. Chocolate’s theobromine and caffeine content can overstimulate the nervous system and heart, leading to seizures or cardiac arrest. Grapes and raisins have been linked to acute kidney failure in dogs, while onions and garlic cause oxidative damage to red blood cells, resulting in anemia.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the dose relative to your pet’s body weight is crucial in assessing the risk of toxicity. This calculator helps estimate the exposure level by comparing the ingested amount to known toxic thresholds, providing guidance on potential severity. Early recognition and veterinary intervention can significantly improve outcomes in toxic food ingestion cases.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool estimates the toxicity risk of common harmful foods based on your pet’s weight and the amount ingested. Begin by selecting the unit system you prefer, then enter your pet’s weight accurately. Choose the type of food ingested from the dropdown menu, and input the amount your pet consumed in grams or ounces.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your pet’s weight in pounds or kilograms, depending on your selected unit system.
          </li>
          <li>
            <strong>Step 2:</strong> Select the toxic food type your pet ingested from the provided list.
          </li>
          <li>
            <strong>Step 3:</strong> Input the amount of food ingested, specifying grams or ounces.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated dose per kilogram of body weight and the associated toxicity risk.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and warnings carefully. If moderate or severe risk is indicated, seek veterinary care immediately.
          </li>
        </ul>
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
              href="https://www.avma.org/resources-tools/pet-owners/petcare/people-foods-avoid-feeding-your-pets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AVMA: People Foods to Avoid Feeding Your Pets
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide by the American Veterinary Medical Association outlining common toxic foods and their effects on pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/food-hazards/food-hazards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Food Hazards
            </a>
            <p className="text-slate-500 text-sm">
              Detailed veterinary resource describing toxic compounds in foods and clinical signs of poisoning in animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6313445/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NCBI: Toxicity of Chocolate in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing the pharmacokinetics and toxic effects of theobromine in canine patients.
            </p>
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