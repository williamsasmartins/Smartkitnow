import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChefHat,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type IngredientKey = "flour" | "water" | "salt" | "yeast" | "sugar" | "fat";

const ingredientLabels: Record<IngredientKey, string> = {
  flour: "Flour",
  water: "Water",
  salt: "Salt",
  yeast: "Yeast",
  sugar: "Sugar",
  fat: "Fat (Butter/Oil)",
};

// Density in g per cup for volume to weight conversion (imperial)
const densityMap: Record<IngredientKey, number> = {
  flour: 120,
  water: 236, // water density is 1g/ml, 1 cup = 236 ml approx
  salt: 273,
  yeast: 150,
  sugar: 200,
  fat: 218, // butter ~218g/cup
};

export default function BakersPercentageCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<Partial<Record<IngredientKey, string>>>({
    flour: "",
    water: "",
    salt: "",
    yeast: "",
    sugar: "",
    fat: "",
  });

  // Parse input string to number or NaN
  const parseInput = (val: string | undefined) => {
    if (!val) return NaN;
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? NaN : n;
  };

  // Handle input change
  function onInputChange(key: IngredientKey, val: string) {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    // Parse all inputs to numbers
    const flourInput = parseInput(inputs.flour);
    if (isNaN(flourInput) || flourInput === 0) {
      return {
        value: 0,
        label: "Enter flour weight/volume",
        subtext: "Flour is the base ingredient for baker’s percentage.",
        warning: null,
        percentages: null,
      };
    }

    // Convert all inputs to grams for calculation
    // If imperial: inputs are cups, convert to grams using densityMap
    // If metric: inputs are grams directly
    const flourGrams =
      unit === "imperial"
        ? flourInput * densityMap.flour
        : flourInput; // grams

    // Helper to convert input to grams
    const toGrams = (key: IngredientKey): number => {
      const val = parseInput(inputs[key]);
      if (isNaN(val)) return 0;
      if (unit === "imperial") {
        return val * densityMap[key];
      }
      return val;
    };

    // Calculate grams for each ingredient except flour
    const waterGrams = toGrams("water");
    const saltGrams = toGrams("salt");
    const yeastGrams = toGrams("yeast");
    const sugarGrams = toGrams("sugar");
    const fatGrams = toGrams("fat");

    // Calculate baker's percentage for each ingredient relative to flour
    // Baker's % = (ingredient weight / flour weight) * 100
    const calcPercent = (ingredientGrams: number) =>
      flourGrams === 0 ? 0 : (ingredientGrams / flourGrams) * 100;

    const waterPct = calcPercent(waterGrams);
    const saltPct = calcPercent(saltGrams);
    const yeastPct = calcPercent(yeastGrams);
    const sugarPct = calcPercent(sugarGrams);
    const fatPct = calcPercent(fatGrams);

    // Prepare display strings for each ingredient percentage
    // Show only if input > 0
    const percentages: Partial<Record<IngredientKey, string>> = {};
    if (waterGrams > 0) percentages.water = waterPct.toFixed(1) + "%";
    if (saltGrams > 0) percentages.salt = saltPct.toFixed(1) + "%";
    if (yeastGrams > 0) percentages.yeast = yeastPct.toFixed(2) + "%";
    if (sugarGrams > 0) percentages.sugar = sugarPct.toFixed(1) + "%";
    if (fatGrams > 0) percentages.fat = fatPct.toFixed(1) + "%";

    // Total hydration is water % (important baker's metric)
    const hydrationPct = waterPct;

    // Warning if hydration is unusually high or low
    let warningMsg: string | null = null;
    if (hydrationPct > 85) {
      warningMsg =
        "Warning: Hydration above 85% may produce very sticky dough, difficult to handle.";
    } else if (hydrationPct < 40) {
      warningMsg =
        "Warning: Hydration below 40% may produce dry, dense bread.";
    }

    // Display value: summary string of baker's percentages
    // Format: "Water: 65%, Salt: 2%, Yeast: 1.5%, Sugar: 3%, Fat: 4%"
    // Only include those with input > 0
    const parts: string[] = [];
    if (percentages.water) parts.push(`Water: ${percentages.water}`);
    if (percentages.salt) parts.push(`Salt: ${percentages.salt}`);
    if (percentages.yeast) parts.push(`Yeast: ${percentages.yeast}`);
    if (percentages.sugar) parts.push(`Sugar: ${percentages.sugar}`);
    if (percentages.fat) parts.push(`Fat: ${percentages.fat}`);

    const displayValue = parts.length > 0 ? parts.join(", ") : "No additional ingredients";

    const labelText = `Baker’s Percentage (relative to flour)`;
    const subtext = `Flour weight: ${flourGrams.toFixed(0)} g`;

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: warningMsg,
      percentages,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "What is baker’s percentage and why is it important?",
      answer:
        "Baker’s percentage expresses each ingredient’s weight as a percentage of the flour weight, which is always 100%. This method standardizes recipes, allowing bakers to scale and adjust dough formulas precisely, ensuring consistent results regardless of batch size.",
    },
    {
      question: "Can I use volume measurements for baker’s percentage calculations?",
      answer:
        "While baker’s percentage is based on weight, this calculator supports volume inputs by converting cups to grams using ingredient-specific densities. However, weighing ingredients with a digital scale is recommended for accuracy.",
    },
    {
      question: "Why is hydration percentage crucial in bread baking?",
      answer:
        "Hydration percentage, the ratio of water to flour, affects dough texture, fermentation, and crumb structure. Higher hydration yields open, airy bread, while lower hydration produces denser loaves. Adjust hydration carefully based on flour type and recipe.",
    },
    {
      question: "How do I interpret the warning about hydration levels?",
      answer:
        "Hydration warnings indicate when water content is unusually high or low. Excessive hydration can make dough sticky and hard to handle, while too little water results in dry, tough bread. Use these warnings to adjust your recipe for optimal dough consistency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (Cups/°F)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Flour - Required */}
        <div>
          <Label htmlFor="flour" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Flour {unit === "imperial" ? "(cups)" : "(grams)"} <span className="text-red-600">*</span>
          </Label>
          <Input
            id="flour"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 3.5" : "e.g. 420"}
            value={inputs.flour ?? ""}
            onChange={(e) => onInputChange("flour", e.target.value)}
            aria-required="true"
          />
        </div>

        {/* Water */}
        <div>
          <Label htmlFor="water" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Water {unit === "imperial" ? "(cups)" : "(grams)"}
          </Label>
          <Input
            id="water"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 2.0" : "e.g. 472"}
            value={inputs.water ?? ""}
            onChange={(e) => onInputChange("water", e.target.value)}
          />
        </div>

        {/* Salt */}
        <div>
          <Label htmlFor="salt" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Salt {unit === "imperial" ? "(cups)" : "(grams)"}
          </Label>
          <Input
            id="salt"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 0.1" : "e.g. 27"}
            value={inputs.salt ?? ""}
            onChange={(e) => onInputChange("salt", e.target.value)}
          />
        </div>

        {/* Yeast */}
        <div>
          <Label htmlFor="yeast" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Yeast {unit === "imperial" ? "(cups)" : "(grams)"}
          </Label>
          <Input
            id="yeast"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 0.05" : "e.g. 7.5"}
            value={inputs.yeast ?? ""}
            onChange={(e) => onInputChange("yeast", e.target.value)}
          />
        </div>

        {/* Sugar */}
        <div>
          <Label htmlFor="sugar" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Sugar {unit === "imperial" ? "(cups)" : "(grams)"}
          </Label>
          <Input
            id="sugar"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 0.2" : "e.g. 40"}
            value={inputs.sugar ?? ""}
            onChange={(e) => onInputChange("sugar", e.target.value)}
          />
        </div>

        {/* Fat */}
        <div>
          <Label htmlFor="fat" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Fat (Butter/Oil) {unit === "imperial" ? "(cups)" : "(grams)"}
          </Label>
          <Input
            id="fat"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 0.25" : "e.g. 55"}
            value={inputs.fat ?? ""}
            onChange={(e) => onInputChange("fat", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate baker's percentages"
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              flour: "",
              water: "",
              salt: "",
              yeast: "",
              sugar: "",
              fat: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (CLEAN JSX ONLY) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
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
            <ChefHat className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Chef's Tip:</strong> Use a digital scale for baking
              precision.
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
          Understanding Baker’s Percentage Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baker’s percentage is a fundamental concept in bread baking that
          expresses each ingredient’s weight as a percentage of the flour
          weight, which is always set to 100%. This method allows bakers to
          scale recipes easily and maintain consistent dough characteristics
          regardless of batch size. By understanding baker’s percentages,
          bakers gain precise control over hydration, saltiness, yeast
          activity, and fat content in their dough.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps convert your ingredient measurements into baker’s
          percentages, whether you input volumes or weights. It uses ingredient
          densities to convert cups to grams when needed, ensuring accuracy.
          The tool also highlights hydration levels, a key factor influencing
          dough texture and fermentation. Using baker’s percentages promotes
          recipe consistency, scalability, and better understanding of dough
          behavior.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Baker’s Percentage Calculator, first select your preferred
          unit system: Imperial (cups and °F) or Metric (grams and °C). Enter
          the amount of flour you plan to use, as it serves as the base for all
          calculations. Then, input the quantities of other ingredients like
          water, salt, yeast, sugar, and fat. The calculator will convert these
          inputs into baker’s percentages relative to the flour weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose your unit system at the top.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the flour amount (required).
          </li>
          <li>
            <strong>Step 3:</strong> Enter other ingredient amounts as needed.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see baker’s percentages
            and hydration warnings.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust your recipe based on the results for
            desired dough characteristics.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Culinary FAQ
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Baker’s Percentages Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide explaining baker’s percentages and their
              application in bread baking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.thefreshloaf.com/learn/bakers-percentages"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. The Fresh Loaf - Understanding Baker’s Percentages
            </a>
            <p className="text-slate-500 text-sm">
              Community resource with detailed explanations and examples of
              baker’s math.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA Food Safety and Inspection Service
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on safe food temperatures and handling.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Baker’s Percentage Calculator"
      description="Master Baker's Math. Calculate ingredient ratios based on flour weight to create consistent and scalable bread recipes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Baker's % = (Ingredient Weight ÷ Flour Weight) × 100",
        variables: [
          { symbol: "Ingredient Weight", description: "Weight of ingredient in grams" },
          { symbol: "Flour Weight", description: "Weight of flour in grams (base 100%)" },
          { symbol: "Baker's %", description: "Percentage of ingredient relative to flour" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 500g of flour and want to calculate the baker’s percentage for 325g of water.",
        steps: [
          {
            label: "1",
            explanation:
              "Divide the water weight by the flour weight: 325 ÷ 500 = 0.65",
          },
          {
            label: "2",
            explanation:
              "Multiply by 100 to get the percentage: 0.65 × 100 = 65%",
          },
        ],
        result: "Water is 65% of the flour weight, indicating 65% hydration.",
      }}
      relatedCalculators={[
        { title: "Serving Size Multiplier", url: "/cooking/serving-size-multiplier", icon: "🍳" },
        { title: "Fahrenheit ↔ Celsius Converter", url: "/cooking/fahrenheit-celsius-oven-internal-temp", icon: "🍞" },
        { title: "Pork/Beef Smoking Time per lb", url: "/cooking/pork-beef-smoking-time-per-lb", icon: "🥩" },
        { title: "Volume ↔ Weight Converter", url: "/cooking/volume-weight-food-density", icon: "🧁" },
        { title: "Safe Internal Temperature Checker", url: "/cooking/safe-internal-temperature-checker", icon: "🌡️" },
        { title: "Dough Hydration % Calculator", url: "/cooking/dough-hydration-percent", icon: "🌡️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Baker’s Percentage Calculator" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "Culinary FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}