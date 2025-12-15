import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmallMammalFiberProteinRatioCalculator() {
  // 1. STATE
  // Default unit system is imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: Fiber % and Protein % in diet
  const [inputs, setInputs] = useState({
    fiberPercent: "",
    proteinPercent: "",
  });

  // 2. LOGIC ENGINE
  // Calculate Fiber to Protein Ratio = Fiber % / Protein %
  // Validate inputs and handle zero or invalid values
  const results = useMemo(() => {
    const fiber = parseFloat(inputs.fiberPercent);
    const protein = parseFloat(inputs.proteinPercent);

    if (
      isNaN(fiber) ||
      isNaN(protein) ||
      fiber <= 0 ||
      protein <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter positive numeric values for both fiber and protein percentages.",
        warning: null,
      };
    }

    const ratio = +(fiber / protein).toFixed(2);

    // Contextual interpretation based on typical fiber:protein ratios for small mammals
    let subtext = "";
    let warning = null;

    if (ratio < 0.3) {
      subtext =
        "Low fiber relative to protein may impair gut motility and microbial balance in herbivorous small mammals.";
      warning =
        "Warning: Fiber is too low compared to protein. Consider increasing fiber to support digestive health.";
    } else if (ratio > 1.2) {
      subtext =
        "High fiber relative to protein may reduce protein digestibility and energy availability.";
      warning =
        "Warning: Fiber is high relative to protein. Balance is important to avoid nutritional deficiencies.";
    } else {
      subtext =
        "Fiber to protein ratio is within an optimal range for maintaining gut health and nutrient absorption.";
    }

    return {
      value: ratio,
      label: "Fiber to Protein Ratio",
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the fiber to protein ratio important in small mammal diets?",
      answer:
        "The fiber to protein ratio is crucial because fiber supports healthy gut motility and microbial populations, especially in herbivorous small mammals like rabbits. Protein is essential for tissue repair and growth, but an imbalance can lead to digestive issues or nutrient deficiencies. Maintaining an appropriate ratio ensures optimal digestion, nutrient absorption, and overall health.",
    },
    {
      question: "How does fiber affect protein digestibility in small mammals?",
      answer:
        "Fiber influences the rate of digestion and fermentation in the gut, which can impact how well protein is absorbed. Excessive fiber may bind to proteins or speed up transit time, reducing protein digestibility. Conversely, too little fiber can impair gut motility and microbial balance, indirectly affecting protein utilization.",
    },
    {
      question: "Can this calculator be used for all small mammal species?",
      answer:
        "This calculator is designed primarily for herbivorous small mammals such as rabbits and guinea pigs, where fiber and protein balance is critical. Omnivorous or carnivorous species have different dietary requirements, so this tool may not provide accurate guidance for them. Always consult a veterinarian for species-specific dietary advice.",
    },
    {
      question: "How should I adjust the diet if the fiber to protein ratio is outside the recommended range?",
      answer:
        "If the ratio is too low, increase dietary fiber through hay or fibrous vegetables to support gut health. If the ratio is too high, consider adding higher-protein foods like pellets or legumes to improve nutrient balance. Adjustments should be gradual and monitored closely to avoid digestive upset.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Reset inputs
  function resetInputs() {
    setInputs({ fiberPercent: "", proteinPercent: "" });
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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
          <Label htmlFor="fiberPercent" className="text-slate-700 dark:text-slate-300">
            Fiber Percentage in Diet (%)
          </Label>
          <Input
            id="fiberPercent"
            name="fiberPercent"
            type="text"
            placeholder="e.g. 18"
            value={inputs.fiberPercent}
            onChange={handleInputChange}
            aria-describedby="fiberHelp"
          />
          <p id="fiberHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the fiber content percentage of the diet.
          </p>
        </div>

        <div>
          <Label htmlFor="proteinPercent" className="text-slate-700 dark:text-slate-300">
            Protein Percentage in Diet (%)
          </Label>
          <Input
            id="proteinPercent"
            name="proteinPercent"
            type="text"
            placeholder="e.g. 16"
            value={inputs.proteinPercent}
            onChange={handleInputChange}
            aria-describedby="proteinHelp"
          />
          <p id="proteinHelp" className="text-xs text-slate-500 dark:text-400 mt-1">
            Enter the protein content percentage of the diet.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate Fiber to Protein Ratio"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
          Understanding Fiber & Protein Ratio Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Fiber & Protein Ratio Calculator is a specialized veterinary tool designed to help pet owners and professionals determine the balance between fiber and protein in the diets of small mammals, particularly herbivores like rabbits and guinea pigs. This ratio is critical because fiber supports healthy gastrointestinal function by promoting proper gut motility and maintaining beneficial microbial populations. Protein, on the other hand, is essential for growth, tissue repair, and overall metabolic functions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          An imbalance in this ratio can lead to digestive disturbances, nutrient malabsorption, or metabolic disorders. For example, diets too low in fiber can cause gastrointestinal stasis, while excessively high fiber may reduce protein digestibility and energy availability. This calculator simplifies the process by providing a clear numerical ratio, enabling users to assess whether their pet’s diet falls within an optimal range for health and wellbeing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By understanding and applying this ratio, caretakers can make informed dietary adjustments to improve gut health, prevent common nutritional issues, and support the longevity of their small mammal companions. This tool is especially valuable for veterinary nutritionists, breeders, and conscientious pet owners aiming to optimize dietary formulations.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Fiber & Protein Ratio Calculator is straightforward and requires only two key inputs: the fiber percentage and the protein percentage of the diet. These values can typically be found on commercial pet food labels or determined through nutritional analysis of homemade diets. The calculator then computes the ratio of fiber to protein, providing an immediate assessment of dietary balance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) to ensure familiarity with input conventions.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the fiber content percentage of the diet in the designated input field. This represents the total dietary fiber.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the protein content percentage of the diet in the corresponding input field.
          </li>
          <li>
            <strong>Step 4:</strong> Click the “Calculate” button to generate the fiber to protein ratio and review the contextual feedback provided.
          </li>
          <li>
            <strong>Step 5:</strong> Use the results and warnings to adjust your pet’s diet accordingly, consulting a veterinarian if necessary.
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
              href="https://www.merckvetmanual.com/digestive-system/nutrition-and-feeding-of-rabbits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Nutrition and Feeding of Rabbits
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing the nutritional requirements of rabbits, emphasizing the importance of fiber and protein balance for gastrointestinal health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health: Dietary Fiber and Gut Microbiota in Small Mammals
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article exploring how dietary fiber influences gut microbiota composition and digestive physiology in herbivorous small mammals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aavmc.org/resources/animal-nutrition/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of American Veterinary Medical Colleges: Animal Nutrition Resources
            </a>
            <p className="text-slate-500 text-sm">
              Educational materials and guidelines on balanced nutrition for various species, including small mammals, highlighting fiber and protein requirements.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fiber & Protein Ratio Calculator"
      description="Determine the appropriate ratio of fiber and protein in the diet, crucial for gut health in species like rabbits."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Fiber to Protein Ratio = Fiber (%) ÷ Protein (%)",
        variables: [
          { symbol: "Fiber (%)", description: "Dietary fiber content percentage" },
          { symbol: "Protein (%)", description: "Dietary protein content percentage" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rabbit's diet contains 18% fiber and 16% protein. The caretaker wants to assess if this ratio supports optimal gut health.",
        steps: [
          {
            label: "1",
            explanation:
              "Input fiber percentage as 18 and protein percentage as 16 into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the fiber to protein ratio: 18 ÷ 16 = 1.13, which falls within the optimal range.",
          },
          {
            label: "3",
            explanation:
              "Review the result and contextual feedback to confirm the diet supports healthy digestion and nutrient absorption.",
          },
        ],
        result:
          "Fiber to Protein Ratio = 1.13, indicating a balanced diet suitable for maintaining gut health in rabbits.",
      }}
      relatedCalculators={[
        {
          title: "Toxic Foods Exposure Checker (Avocado, Chocolate, etc.)",
          url: "/pets/bird-toxic-foods-exposure-checker",
          icon: "🐾",
        },
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🍖",
        },
        {
          title: "Whelping Countdown & Stage Timeline",
          url: "/pets/dog-whelping-countdown-stage-timeline",
          icon: "💉",
        },
        {
          title: "Cat Calorie Needs (RER/MER) Calculator",
          url: "/pets/cat-calorie-needs-rer-mer",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fiber & Protein Ratio Calculator" },
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