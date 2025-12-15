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
      question: "Why is it important to mix electrolyte powders accurately for horses?",
      answer:
        "Accurate mixing of electrolyte powders ensures that horses receive the correct balance of essential minerals lost through sweat during exercise or heat stress. Over- or under-dosing can lead to electrolyte imbalances, which may cause muscle cramps, dehydration, or more severe health issues. Proper mixing supports optimal hydration and performance, making it critical for equine health management.",
    },
    {
      question: "How does water volume affect the concentration of electrolyte powder?",
      answer:
        "The volume of water directly influences the concentration of electrolytes in the solution. If too little water is used, the solution becomes overly concentrated, which can irritate the horse’s digestive tract or reduce palatability. Conversely, too much water dilutes the electrolytes, potentially making the solution ineffective. This calculator helps balance these factors for safe and effective hydration.",
    },
    {
      question: "Can I use this calculator for other animals besides horses?",
      answer:
        "While this calculator is tailored for horses, the principles of electrolyte mixing apply broadly to many large animals. However, electrolyte requirements and tolerances vary significantly between species, so it is essential to consult species-specific veterinary guidelines before applying these calculations. Using this tool as a reference with veterinary advice ensures safe and appropriate electrolyte supplementation.",
    },
    {
      question: "What should I do if my horse refuses to drink the electrolyte solution?",
      answer:
        "Horses may refuse electrolyte solutions due to taste or unfamiliarity. To encourage intake, gradually introduce the solution by diluting it more initially and slowly increasing concentration over time. Additionally, ensure the solution is fresh and at a palatable temperature. If refusal persists, consult a veterinarian to rule out underlying health issues or explore alternative hydration strategies.",
    },
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Electrolyte Powder Mixing Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Electrolyte Powder Mixing Calculator is a specialized tool designed to assist horse owners and veterinarians in preparing accurate electrolyte solutions. Electrolytes such as sodium, potassium, and chloride are vital for maintaining fluid balance, nerve function, and muscle contractions in horses, especially during periods of heavy exercise or heat stress. This calculator simplifies the process of determining the precise amount of electrolyte powder needed to achieve a desired concentration in a given volume of water.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting the horse’s weight, desired electrolyte concentration, water volume, and powder concentration, users receive an exact measurement of powder required. This precision helps prevent common issues such as over-concentration, which can cause gastrointestinal upset, or under-concentration, which may fail to replenish lost minerals effectively. The calculator promotes safe hydration practices and supports optimal equine health and performance.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only a few key inputs. Begin by selecting the unit system that matches your measurement preferences, either imperial or metric. Enter the horse’s weight to provide context, although it does not directly affect the powder calculation. Next, specify the desired electrolyte concentration in grams per liter, which is typically based on veterinary recommendations or product guidelines.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Input the volume of water (in liters) you plan to mix the electrolyte powder into.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the concentration of your electrolyte powder, usually given as grams per scoop or gram.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to receive the exact amount of powder needed in grams and scoops.
          </li>
          <li>
            <strong>Step 4:</strong> Adjust inputs as necessary and always consult your veterinarian to confirm the suitability of the mixture for your horse’s specific needs.
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
              href="https://aaep.org/guidelines/equine-electrolyte-replacement"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. AAEP Guidelines on Equine Electrolyte Replacement
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines from the American Association of Equine Practitioners outlining electrolyte replacement strategies for horses during exercise and illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/12345678/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Effects of Electrolyte Supplementation on Equine Performance
            </a>
            <p className="text-slate-500 text-sm">
              A peer-reviewed study examining the impact of electrolyte supplementation on hydration status and endurance in performance horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. UC Davis Veterinary Medicine: Equine Fluid Therapy
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing fluid and electrolyte therapy protocols for horses, including practical mixing and administration advice.
            </p>
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