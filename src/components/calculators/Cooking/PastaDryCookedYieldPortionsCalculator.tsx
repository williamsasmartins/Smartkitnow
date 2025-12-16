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

type UnitSystem = "imperial" | "metric";

type IngredientKey =
  | "pasta_dry"
  | "rice_basmati"
  | "rice_jasmine"
  | "rice_brown"
  | "flour_ap"
  | "sugar_granulated"
  | "butter"
  | "water";

const ingredientOptions = [
  { key: "pasta_dry", label: "Dry Pasta" },
  { key: "rice_basmati", label: "Basmati Rice" },
  { key: "rice_jasmine", label: "Jasmine Rice" },
  { key: "rice_brown", label: "Brown Rice" },
  { key: "flour_ap", label: "All-Purpose Flour" },
  { key: "sugar_granulated", label: "Granulated Sugar" },
  { key: "butter", label: "Butter" },
  { key: "water", label: "Water" },
];

// Density in grams per cup for common ingredients (US cups)
const densityMap: Record<IngredientKey, number> = {
  pasta_dry: 100, // Typical dry pasta ~100g per cup (varies by shape)
  rice_basmati: 185,
  rice_jasmine: 180,
  rice_brown: 195,
  flour_ap: 120,
  sugar_granulated: 200,
  butter: 227, // 1 cup butter = 227g (2 sticks)
  water: 236, // 1 cup water = 236g (ml)
};

// Cooked yield multipliers for pasta and rice (weight increase factor)
// Pasta typically absorbs 1.5-2.25x its dry weight in water when cooked.
// We'll use 2.0 as a standard multiplier for pasta.
// Rice varies by type, typical cooked weight multipliers:
const cookedYieldMultipliers: Record<string, number> = {
  pasta_dry: 2.0,
  rice_basmati: 3.0,
  rice_jasmine: 3.0,
  rice_brown: 3.5,
};

export default function PastaDryCookedYieldPortionsCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: IngredientKey;
    amount?: string; // string to allow empty input
    fromUnit?: "dry" | "cooked";
  }>({
    ingredient: "pasta_dry",
    amount: "",
    fromUnit: "dry",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (
      !inputs.ingredient ||
      !inputs.amount ||
      isNaN(Number(inputs.amount)) ||
      Number(inputs.amount) <= 0 ||
      !inputs.fromUnit
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const ingredient = inputs.ingredient;
    const amount = Number(inputs.amount);
    const fromUnit = inputs.fromUnit;

    // Determine density (g per cup) for ingredient
    const density = densityMap[ingredient];
    if (!density) {
      return {
        value: 0,
        label: "Unknown ingredient density",
        subtext: "",
        warning: null,
      };
    }

    // Determine cooked yield multiplier if applicable
    const cookedMultiplier = cookedYieldMultipliers[ingredient] || 1;

    // Conversion helpers
    // Convert input amount to grams (if imperial cups or metric grams)
    // For imperial: input amount is cups or lbs (but here we only have dry/cooked weight)
    // We'll treat input amount as weight in cups or grams depending on unit system.
    // Since this calculator is for dry <-> cooked weight, input is weight in cups or grams.

    // We'll assume input amount is weight in cups if imperial, grams if metric.
    // But cups is volume, so we convert cups to grams using density.
    // So input amount is:
    // - if imperial: cups (volume) or lbs (weight) ? The UI only has dry/cooked select, so we assume input is weight in cups or grams.
    // To simplify: input amount is weight in cups if imperial, grams if metric.

    // So first convert input amount to grams:
    let inputWeightGrams: number;
    if (unit === "imperial") {
      // input amount is cups (volume)
      inputWeightGrams = amount * density;
    } else {
      // metric: input amount is grams directly
      inputWeightGrams = amount;
    }

    // Calculate output weight grams based on fromUnit
    // If fromUnit is dry, output is cooked weight = dry * multiplier
    // If fromUnit is cooked, output is dry weight = cooked / multiplier
    let outputWeightGrams: number;
    let outputLabel: string;
    if (fromUnit === "dry") {
      outputWeightGrams = inputWeightGrams * cookedMultiplier;
      outputLabel = "Cooked Weight";
    } else {
      outputWeightGrams = inputWeightGrams / cookedMultiplier;
      outputLabel = "Dry Weight";
    }

    // Convert output weight grams to display units
    let displayValue: number;
    let displayUnit: string;
    if (unit === "imperial") {
      // Convert grams to cups (volume) for output
      // cups = grams / density
      displayValue = outputWeightGrams / density;
      displayUnit = "cups";
    } else {
      // metric grams
      displayValue = outputWeightGrams;
      displayUnit = "grams";
    }

    // Round displayValue nicely
    const roundedValue =
      displayValue < 1
        ? Math.round(displayValue * 100) / 100
        : Math.round(displayValue * 10) / 10;

    // Portions estimate: standard cooked pasta portion ~140g cooked per person (FDA/USDA)
    // We'll provide portions based on cooked weight in grams
    // If fromUnit is dry, portions = cooked weight / 140g
    // If fromUnit is cooked, portions = input cooked weight / 140g
    const cookedWeightGrams =
      fromUnit === "dry" ? outputWeightGrams : inputWeightGrams;
    const portions = cookedWeightGrams / 140;
    const roundedPortions = Math.round(portions * 10) / 10;

    return {
      value: roundedValue,
      label: `${outputLabel} (${displayUnit})`,
      subtext: `Estimated portions: ~${roundedPortions} serving${
        roundedPortions !== 1 ? "s" : ""
      } (based on 140g cooked pasta per serving)`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How much does dry pasta expand when cooked?",
      answer:
        "Dry pasta typically doubles in weight when cooked, absorbing water and swelling. This calculator uses a standard multiplier of 2.0x to estimate cooked weight from dry weight, but actual yield can vary by pasta shape and cooking time. Always adjust based on your recipe and preferences.",
    },
    {
      question: "Why is portion size based on 140 grams of cooked pasta?",
      answer:
        "The USDA and FDA recommend approximately 140 grams (about 5 ounces) of cooked pasta per serving for an adult. This portion provides a balanced carbohydrate intake and is commonly used in culinary standards to estimate servings.",
    },
    {
      question: "Can I convert cooked pasta back to dry weight?",
      answer:
        "Yes, by dividing the cooked weight by the yield multiplier (usually 2.0 for pasta), you can estimate the dry weight needed. This is helpful for meal planning and ensuring you cook the right amount of dry pasta.",
    },
    {
      question: "Does pasta type affect cooking yield?",
      answer:
        "Yes, different pasta types and shapes absorb water differently, affecting yield. This calculator uses a general multiplier, but for precise results, adjust based on specific pasta characteristics or consult packaging instructions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(
    field: keyof typeof inputs,
    value: string | IngredientKey | "dry" | "cooked"
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Reset inputs
  function resetForm() {
    setInputs({
      ingredient: "pasta_dry",
      amount: "",
      fromUnit: "dry",
    });
  }

  // Render Inputs
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
              <SelectItem value="imperial">Imperial (Cups/°F/Lbs)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredient Select */}
      <div className="space-y-1">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Ingredient
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient}
          onValueChange={(val) => handleInputChange("ingredient", val as IngredientKey)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {ingredientOptions.map(({ key, label }) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
          Amount ({unit === "imperial" ? "cups" : "grams"})
        </Label>
        <Input
          id="amount"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter amount in ${unit === "imperial" ? "cups" : "grams"}`}
          value={inputs.amount || ""}
          onChange={(e) => handleInputChange("amount", e.target.value)}
        />
      </div>

      {/* From Unit Select */}
      <div className="space-y-1">
        <Label htmlFor="fromUnit" className="text-slate-700 dark:text-slate-300">
          Convert From
        </Label>
        <Select
          id="fromUnit"
          value={inputs.fromUnit}
          onValueChange={(val) => handleInputChange("fromUnit", val as "dry" | "cooked")}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dry">Dry Weight</SelectItem>
            <SelectItem value="cooked">Cooked Weight</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, calculation is memoized on inputs
            setInputs((prev) => ({ ...prev }));
          }}
          disabled={
            !inputs.amount ||
            isNaN(Number(inputs.amount)) ||
            Number(inputs.amount) <= 0
          }
          aria-label="Calculate pasta yield"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetForm}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset form"
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
              <strong>Chef's Tip:</strong> For precise cooking, weigh your pasta dry and use this calculator to estimate cooked yield and portions. Remember, pasta shapes and cooking times affect absorption.
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
          Understanding Pasta Dry ↔ Cooked Yield & Portions
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cooking pasta transforms its dry weight significantly as it absorbs water and swells. Typically, dry pasta doubles in weight when cooked, but this can vary depending on the pasta shape, cooking time, and water absorption. Understanding this yield is essential for precise meal planning and portion control.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps convert between dry and cooked pasta weights, allowing chefs and home cooks to estimate how much dry pasta to boil to achieve a desired cooked portion. It also estimates servings based on standard nutritional guidelines, helping you avoid waste or shortages.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By incorporating ingredient-specific densities and yield multipliers, this tool provides accurate conversions that respect culinary science and food safety standards. Whether you measure ingredients by volume or weight, in imperial or metric units, this calculator adapts to your needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, select your ingredient (dry pasta or rice), enter the amount you have or want to prepare, and specify whether this amount is dry or cooked weight. Choose your preferred unit system (imperial or metric) to see the converted value and estimated portions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the ingredient type from the dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the amount you have or want to convert.
          </li>
          <li>
            <strong>Step 3:</strong> Choose whether the amount is dry or cooked weight.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the converted weight and estimated portions.
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
          Standard Ratios & References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety and Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Provides standard serving sizes and food safety recommendations for pasta and grains.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Ingredient Weights & Measures
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative source for ingredient densities and baking conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - Pasta Cooking Science
            </a>
            <p className="text-slate-500 text-sm">
              In-depth articles on pasta cooking techniques, yield, and texture.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pasta Dry ↔ Cooked Yield & Portions"
      description="Convert dry pasta to cooked weight. Estimate how much pasta to boil to get the exact number of cooked servings you need."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Cooked Weight = Dry Weight × Yield Multiplier (≈ 2.0 for pasta); Dry Weight = Cooked Weight ÷ Yield Multiplier",
        variables: [
          { symbol: "Dry Weight", description: "Weight of dry pasta" },
          { symbol: "Cooked Weight", description: "Weight after cooking" },
          { symbol: "Yield Multiplier", description: "Weight increase factor (≈ 2.0)" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You want to cook enough dry pasta to serve 4 people, each needing about 140g cooked pasta.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total cooked pasta needed: 4 servings × 140g = 560g cooked pasta.",
          },
          {
            label: "2",
            explanation:
              "Calculate dry pasta needed: 560g ÷ 2.0 (yield multiplier) = 280g dry pasta.",
          },
          {
            label: "3",
            explanation:
              "Use the calculator to convert 280g dry pasta to cups or other units as needed.",
          },
        ],
        result: "280g dry pasta yields approximately 560g cooked pasta, enough for 4 servings.",
      }}
      relatedCalculators={[
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🍳",
        },
        {
          title: "Defrost Time Estimator",
          url: "/cooking/defrost-time-fridge-cold-water",
          icon: "🍞",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🧁",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "📏",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Pasta Dry ↔ Cooked Yield & Portions",
        },
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