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
  Calculator,
  RotateCcw,
  AlertTriangle,
  ChefHat,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const INGREDIENTS = [
  { id: "flour_ap", label: "All-Purpose Flour", density: 120 }, // g per cup
  { id: "flour_wheat", label: "Whole Wheat Flour", density: 130 },
  { id: "sugar_granulated", label: "Granulated Sugar", density: 200 },
  { id: "sugar_brown", label: "Brown Sugar (packed)", density: 220 },
  { id: "butter", label: "Butter", density: 227 }, // 1 cup butter = 227g (1 stick = 113.5g)
  { id: "water", label: "Water", density: 236 }, // 1 cup water = 236g (ml)
  { id: "rice_white", label: "White Rice (uncooked)", density: 195 },
  { id: "rice_basmati", label: "Basmati Rice (uncooked)", density: 190 },
  { id: "honey", label: "Honey", density: 340 },
  { id: "milk", label: "Milk", density: 245 },
];

const UNIT_OPTIONS = [
  { id: "cups", label: "Cups" },
  { id: "grams", label: "Grams" },
  { id: "ounces", label: "Ounces" },
];

// Conversion constants
const GRAMS_PER_OUNCE = 28.3495;

export default function CupsGramsOuncesByIngredientCalculator() {
  // 1. STATE
  const [unitSystem, setUnitSystem] = useState("imperial"); // imperial or metric
  const [inputs, setInputs] = useState({
    ingredient: "flour_ap",
    amount: "",
    fromUnit: "cups",
    toUnit: "grams",
  });

  // Handlers
  function onInputChange(field: string, value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { ingredient, amount, fromUnit, toUnit } = inputs;
    if (!ingredient || !amount || isNaN(Number(amount))) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const amt = Number(amount);
    const ing = INGREDIENTS.find((i) => i.id === ingredient);
    if (!ing) {
      return {
        value: 0,
        label: "Unknown ingredient",
        subtext: "",
        warning: null,
      };
    }

    // Convert input amount to grams first
    // Step 1: Convert fromUnit to grams
    let gramsValue = 0;

    switch (fromUnit) {
      case "cups":
        // Use density (g per cup)
        gramsValue = amt * ing.density;
        break;
      case "grams":
        gramsValue = amt;
        break;
      case "ounces":
        gramsValue = amt * GRAMS_PER_OUNCE;
        break;
      default:
        gramsValue = 0;
    }

    // Step 2: Convert gramsValue to toUnit
    let resultValue = 0;
    switch (toUnit) {
      case "cups":
        resultValue = gramsValue / ing.density;
        break;
      case "grams":
        resultValue = gramsValue;
        break;
      case "ounces":
        resultValue = gramsValue / GRAMS_PER_OUNCE;
        break;
      default:
        resultValue = 0;
    }

    // Format result to 2 decimals for weight, 3 decimals for volume (cups)
    const formattedValue =
      toUnit === "cups"
        ? Number(resultValue.toFixed(3))
        : Number(resultValue.toFixed(2));

    // Label for result
    const unitLabel = toUnit === "grams" ? "g" : toUnit === "ounces" ? "oz" : "cups";

    // Chef's note about precision
    const subtext =
      toUnit === "cups"
        ? "Volume measurements can vary; weighing ingredients is more precise."
        : "Weight measurements are more accurate for consistent baking results.";

    return {
      value: formattedValue,
      label: `${unitLabel}`,
      subtext,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do ingredient weights vary between recipes?",
      answer:
        "Ingredient weights can vary due to differences in ingredient type, brand, and how they are measured (scooped vs sifted). Using a scale ensures accuracy and consistency in baking.",
    },
    {
      question: "Is it better to measure flour by weight or volume?",
      answer:
        "Measuring flour by weight is more accurate because volume can be affected by how compacted the flour is. Bakers prefer grams for precision and repeatability.",
    },
    {
      question: "Can I convert any ingredient from cups to grams using this tool?",
      answer:
        "This tool covers common baking and cooking ingredients with established densities. For unusual ingredients, consult specific density data or use a scale directly.",
    },
    {
      question: "How does ingredient density affect conversions?",
      answer:
        "Density determines how much a volume of an ingredient weighs. For example, 1 cup of flour weighs less than 1 cup of sugar due to their different densities.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI Widget
  const widget = (
    <div className="space-y-6">
      {/* Unit System Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unitSystem} onValueChange={setUnitSystem}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (Cups/°F/Lbs)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredient Select */}
      <div className="space-y-4">
        <Label htmlFor="ingredient-select" className="text-slate-700 dark:text-slate-300">
          Ingredient
        </Label>
        <Select
          id="ingredient-select"
          value={inputs.ingredient}
          onValueChange={(val) => onInputChange("ingredient", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {INGREDIENTS.map((ing) => (
              <SelectItem key={ing.id} value={ing.id}>
                {ing.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount-input" className="text-slate-700 dark:text-slate-300">
          Amount
        </Label>
        <Input
          id="amount-input"
          type="number"
          min="0"
          step="any"
          placeholder="Enter amount"
          value={inputs.amount}
          onChange={(e) => onInputChange("amount", e.target.value)}
          aria-label="Amount"
        />
      </div>

      {/* From Unit Select */}
      <div className="space-y-2">
        <Label htmlFor="from-unit-select" className="text-slate-700 dark:text-slate-300">
          From Unit
        </Label>
        <Select
          id="from-unit-select"
          value={inputs.fromUnit}
          onValueChange={(val) => onInputChange("fromUnit", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* To Unit Select */}
      <div className="space-y-2">
        <Label htmlFor="to-unit-select" className="text-slate-700 dark:text-slate-300">
          To Unit
        </Label>
        <Select
          id="to-unit-select"
          value={inputs.toUnit}
          onValueChange={(val) => onInputChange("toUnit", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNIT_OPTIONS.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate conversion"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredient: "flour_ap",
              amount: "",
              fromUnit: "cups",
              toUnit: "grams",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset form"
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
                Kitchen Result
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
            <ChefHat className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Chef's Tip:</strong> For baking, using a digital scale (grams) is always more accurate than volume measurements (cups).
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
          Understanding Cups ↔ Grams ↔ Ounces Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Converting between cups, grams, and ounces is essential for precise cooking and baking. Unlike liquids, solid ingredients have varying densities, so a cup of flour does not weigh the same as a cup of sugar. This converter uses ingredient-specific densities to provide accurate conversions, ensuring your recipes turn out perfectly every time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Weight measurements are preferred in professional kitchens and bakeries because they reduce variability caused by packing or scooping. This tool helps home cooks and chefs alike to bridge the gap between volume and weight measurements seamlessly.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Chef's Tips & How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, select your ingredient, enter the amount, and choose the units you want to convert from and to. The tool automatically calculates the equivalent measurement based on the ingredient's density.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the ingredient you are measuring (e.g., all-purpose flour, sugar, butter).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the amount you have and select the unit it is currently in (cups, grams, or ounces).
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit you want to convert to and click Calculate.
          </li>
          <li>
            <strong>Step 4:</strong> Use the converted value for your recipe to ensure accuracy and consistency.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Culinary FAQ</h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Standard Ratios & References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/ingredient-weight-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking Ingredient Weight Chart
            </a>
            <p className="text-slate-500 text-sm">
              Provides detailed weight-to-volume conversions for baking ingredients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. USDA Food Safety and Inspection Service
            </a>
            <p className="text-slate-500 text-sm">
              Source for food safety standards and safe internal cooking temperatures.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fda.gov/food"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. FDA Food Facts
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on food safety, handling, and storage.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cups ↔ Grams ↔ Ounces Converter"
      description="Convert cooking ingredients from volume to weight. Switch between cups, grams, and ounces for flour, sugar, and more with density adjustments."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Result = (Input Amount × Ingredient Density in g/cup) × (Unit Conversion Factor)",
        variables: [
          { symbol: "Input Amount", description: "Amount entered by user" },
          { symbol: "Ingredient Density", description: "g per cup for selected ingredient" },
          { symbol: "Unit Conversion Factor", description: "Conversion between grams, cups, and ounces" },
          { symbol: "Result", description: "Converted value in desired unit" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Convert 2 cups of all-purpose flour to grams.",
        steps: [
          { label: "1", explanation: "Identify density: 1 cup AP flour ≈ 120g." },
          { label: "2", explanation: "Multiply: 2 cups × 120g = 240g." },
          { label: "3", explanation: "Result: 240 grams of all-purpose flour." },
        ],
        result: "240 grams",
      }}
      relatedCalculators={[
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍞",
        },
        {
          title: "Rice:Water Ratio & Yield Calculator",
          url: "/cooking/rice-water-ratio-yield",
          icon: "🥩",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
        },
        {
          title: "Sourdough Starter Ratio & Feed Planner",
          url: "/cooking/sourdough-starter-ratio-feed-planner",
          icon: "🍞",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cups ↔ Grams ↔ Ounces Converter" },
        { id: "how-to-use", label: "Chef's Tips" },
        { id: "faq", label: "Culinary FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}