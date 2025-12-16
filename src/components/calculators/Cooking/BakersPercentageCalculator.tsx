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

export default function BakersPercentageCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: flourWeight, ingredient, ingredientWeight
  // We calculate baker's percentage: ingredient % = (ingredientWeight / flourWeight) * 100
  // User inputs flour weight and ingredient weight for selected ingredient.
  // Units: imperial = lbs & oz or cups, metric = grams or kg. For simplicity: input weight in lbs or grams.
  // We'll allow ingredient selection from common baking ingredients.

  const [inputs, setInputs] = useState<{
    flourWeight: string;
    ingredient: string;
    ingredientWeight: string;
    ingredientUnit: "weight" | "volume"; // weight = lbs or grams, volume = cups or ml
  }>({
    flourWeight: "",
    ingredient: "flour_ap",
    ingredientWeight: "",
    ingredientUnit: "weight",
  });

  // Ingredient density dictionary (grams per cup) for common baking ingredients
  // Source: King Arthur Baking, Serious Eats
  const densityMap: Record<
    string,
    { gramsPerCup: number; displayName: string; defaultUnit: "weight" | "volume" }
  > = {
    flour_ap: { gramsPerCup: 120, displayName: "All-Purpose Flour", defaultUnit: "weight" },
    flour_bread: { gramsPerCup: 130, displayName: "Bread Flour", defaultUnit: "weight" },
    sugar_granulated: { gramsPerCup: 200, displayName: "Granulated Sugar", defaultUnit: "weight" },
    sugar_brown: { gramsPerCup: 220, displayName: "Brown Sugar (packed)", defaultUnit: "weight" },
    butter: { gramsPerCup: 227, displayName: "Butter", defaultUnit: "weight" },
    water: { gramsPerCup: 236, displayName: "Water", defaultUnit: "volume" },
    milk: { gramsPerCup: 245, displayName: "Milk", defaultUnit: "volume" },
    honey: { gramsPerCup: 340, displayName: "Honey", defaultUnit: "weight" },
    salt: { gramsPerCup: 273, displayName: "Salt", defaultUnit: "weight" },
    yeast_active: { gramsPerCup: 200, displayName: "Active Dry Yeast", defaultUnit: "weight" },
  };

  // Helper: convert input weight or volume to grams or lbs depending on unit system
  // For imperial: weight input assumed in lbs, volume input in cups
  // For metric: weight input in grams, volume input in ml (but we only accept cups for volume for simplicity)
  // We'll convert volume to grams using densityMap

  // Conversion constants
  const lbsToGrams = 453.59237;
  const gramsToLbs = 1 / lbsToGrams;

  // Convert cups to grams using density
  function cupsToGrams(cups: number, ingredientKey: string) {
    const density = densityMap[ingredientKey];
    if (!density) return 0;
    return cups * density.gramsPerCup;
  }

  // Convert grams to cups using density
  function gramsToCups(grams: number, ingredientKey: string) {
    const density = densityMap[ingredientKey];
    if (!density) return 0;
    return grams / density.gramsPerCup;
  }

  // Parse input string to number safely
  function parseNumber(value: string) {
    const n = parseFloat(value);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse flour weight input
    let flourWeightGrams = 0;
    if (unit === "imperial") {
      // input assumed lbs, convert to grams
      flourWeightGrams = parseNumber(inputs.flourWeight) * lbsToGrams;
    } else {
      // metric grams input directly
      flourWeightGrams = parseNumber(inputs.flourWeight);
    }

    if (flourWeightGrams === 0) {
      return {
        value: 0,
        label: "Please enter flour weight",
        subtext: "",
        warning: null,
      };
    }

    // Parse ingredient weight or volume input
    const ingredientKey = inputs.ingredient;
    const density = densityMap[ingredientKey];
    if (!density) {
      return {
        value: 0,
        label: "Unknown ingredient",
        subtext: "",
        warning: null,
      };
    }

    let ingredientWeightGrams = 0;

    if (inputs.ingredientUnit === "weight") {
      // Weight input
      const inputWeight = parseNumber(inputs.ingredientWeight);
      if (unit === "imperial") {
        // lbs to grams
        ingredientWeightGrams = inputWeight * lbsToGrams;
      } else {
        // grams input directly
        ingredientWeightGrams = inputWeight;
      }
    } else {
      // Volume input (cups)
      const cups = parseNumber(inputs.ingredientWeight);
      ingredientWeightGrams = cupsToGrams(cups, ingredientKey);
    }

    if (ingredientWeightGrams === 0) {
      return {
        value: 0,
        label: "Please enter ingredient amount",
        subtext: "",
        warning: null,
      };
    }

    // Baker's percentage = (ingredientWeight / flourWeight) * 100
    const bakerPercentage = (ingredientWeightGrams / flourWeightGrams) * 100;

    // Format result to 2 decimals
    const formattedPercent = bakerPercentage.toFixed(2);

    return {
      value: formattedPercent,
      label: `${density.displayName} Baker's Percentage (%)`,
      subtext: `Based on flour weight of ${
        unit === "imperial"
          ? `${parseNumber(inputs.flourWeight).toFixed(2)} lbs`
          : `${parseNumber(inputs.flourWeight).toFixed(0)} g`
      }`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is baker's percentage and why is flour always 100%?",
      answer:
        "Baker's percentage expresses each ingredient's weight as a percentage of the flour weight, which is always set to 100%. This standardization helps bakers scale recipes consistently and understand hydration and ingredient ratios clearly. It is a fundamental concept in professional baking.",
    },
    {
      question: "Why do ingredient densities matter in volume to weight conversions?",
      answer:
        "Different ingredients have different densities, so one cup of flour does not weigh the same as one cup of sugar or butter. Using ingredient-specific densities ensures accurate conversions between volume and weight, leading to consistent baking results. Generic volume conversions can cause errors.",
    },
    {
      question: "Can I use this calculator for non-baking recipes?",
      answer:
        "This calculator is designed specifically for baking, focusing on flour-based recipes and baker's math. For other culinary calculations like meat temperatures or pan volumes, specialized calculators should be used to ensure food safety and accuracy.",
    },
    {
      question: "Should I measure ingredients by weight or volume?",
      answer:
        "Measuring ingredients by weight is more accurate and consistent, especially in baking where precision is crucial. Volume measurements can vary due to packing and ingredient type. Using a digital scale is recommended for best results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    field: keyof typeof inputs,
    value: string | "weight" | "volume"
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({
      flourWeight: "",
      ingredient: "flour_ap",
      ingredientWeight: "",
      ingredientUnit: "weight",
    });
  }

  // Render ingredient options
  const ingredientOptions = Object.entries(densityMap).map(([key, val]) => (
    <SelectItem key={key} value={key}>
      {val.displayName}
    </SelectItem>
  ));

  // Render unit options for ingredient input (weight or volume)
  const ingredientUnitOptions = (
    <>
      <SelectItem value="weight">Weight ({unit === "imperial" ? (unit === "imperial" ? "lbs" : "kg") : "g"})</SelectItem>
      <SelectItem value="volume">Volume ({unit === "imperial" ? "cups" : "ml"})</SelectItem>
    </>
  );

  // Determine placeholder for ingredient weight input based on unit
  const ingredientWeightPlaceholder =
    inputs.ingredientUnit === "weight"
      ? unit === "imperial"
        ? "e.g. 0.5 (lbs)"
        : "e.g. 200 (grams)"
      : unit === "imperial"
      ? "e.g. 1.5 (cups)"
      : "e.g. 250 (ml)";

  // Determine placeholder for flour weight input
  const flourWeightPlaceholder =
    unit === "imperial" ? "e.g. 2.5 (lbs)" : "e.g. 1000 (grams)";

  // Calculate baker's percentage only on Calculate button click or live? 
  // For UX, let's calculate live on inputs change.

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(val) => setUnit(val as "imperial" | "metric")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs / cups)</SelectItem>
              <SelectItem value="metric">Metric (grams / ml)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Flour Weight Input */}
      <div className="space-y-1">
        <Label htmlFor="flourWeight" className="text-slate-700 dark:text-slate-300">
          Flour Weight ({unit === "imperial" ? "lbs" : "grams"})
        </Label>
        <Input
          id="flourWeight"
          type="number"
          min={0}
          step="any"
          placeholder={flourWeightPlaceholder}
          value={inputs.flourWeight}
          onChange={(e) => handleInputChange("flourWeight", e.target.value)}
          aria-describedby="flourWeightHelp"
        />
      </div>

      {/* Ingredient Select */}
      <div className="space-y-1">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Ingredient
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient}
          onValueChange={(val) => {
            handleInputChange("ingredient", val);
            // Reset ingredient unit to default for selected ingredient
            const defaultUnit = densityMap[val]?.defaultUnit || "weight";
            handleInputChange("ingredientUnit", defaultUnit);
            handleInputChange("ingredientWeight", "");
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{ingredientOptions}</SelectContent>
        </Select>
      </div>

      {/* Ingredient Unit Select */}
      <div className="space-y-1">
        <Label htmlFor="ingredientUnit" className="text-slate-700 dark:text-slate-300">
          Input Type
        </Label>
        <Select
          id="ingredientUnit"
          value={inputs.ingredientUnit}
          onValueChange={(val) => handleInputChange("ingredientUnit", val as "weight" | "volume")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{ingredientUnitOptions}</SelectContent>
        </Select>
      </div>

      {/* Ingredient Amount Input */}
      <div className="space-y-1">
        <Label htmlFor="ingredientWeight" className="text-slate-700 dark:text-slate-300">
          Ingredient Amount ({inputs.ingredientUnit === "weight"
            ? unit === "imperial"
              ? "lbs"
              : "grams"
            : unit === "imperial"
            ? "cups"
            : "ml"})
        </Label>
        <Input
          id="ingredientWeight"
          type="number"
          min={0}
          step="any"
          placeholder={ingredientWeightPlaceholder}
          value={inputs.ingredientWeight}
          onChange={(e) => handleInputChange("ingredientWeight", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is live
          }}
          aria-label="Calculate Baker's Percentage"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

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
          Understanding Baker’s Percentage Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baker’s percentage is a fundamental concept in baking that expresses each ingredient's weight as a percentage of the flour weight, which is always set to 100%. This method allows bakers to easily scale recipes up or down while maintaining consistent ratios, ensuring reliable results every time. By focusing on flour as the base, it simplifies understanding hydration levels and ingredient balance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps convert ingredient amounts into baker’s percentages, taking into account ingredient densities for accurate volume-to-weight conversions. Using precise measurements is crucial in baking, where small deviations can affect texture, rise, and flavor. The tool supports both imperial and metric units, accommodating various kitchen preferences.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Baker’s Percentage Calculator effectively, start by selecting your preferred unit system (imperial or metric). Enter the weight of your flour, which is the foundation of your recipe. Then select the ingredient you want to calculate the percentage for, input its amount either by weight or volume, and the calculator will provide the baker’s percentage relative to the flour.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose your unit system (Imperial or Metric) for consistent measurements.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the flour weight accurately, as it is the base (100%) for all calculations.
          </li>
          <li>
            <strong>Step 3:</strong> Select the ingredient and specify its amount by weight or volume. The calculator uses ingredient-specific densities for precise conversions.
          </li>
          <li>
            <strong>Step 4:</strong> Review the baker’s percentage result to understand ingredient ratios and adjust your recipe accordingly.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Culinary FAQ</h2>
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
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Baker's Percentage Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive explanation of baker's math and ingredient ratios for consistent baking results.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/ingredient-density-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats - Ingredient Density Chart
            </a>
            <p className="text-slate-500 text-sm">
              Detailed densities for common baking ingredients used for volume-to-weight conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA - Food Safety Standards
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on safe food handling and temperature recommendations for baking and cooking.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula: "Baker's % = (Ingredient Weight ÷ Flour Weight) × 100",
        variables: [
          { symbol: "Ingredient Weight", description: "Weight of the ingredient" },
          { symbol: "Flour Weight", description: "Weight of the flour (base 100%)" },
          { symbol: "Baker's %", description: "Ingredient percentage relative to flour" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have 500 grams of flour and add 350 grams of water. What is the hydration percentage?",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate baker's percentage: (350 g water ÷ 500 g flour) × 100 = 70%",
          },
        ],
        result: "Hydration is 70%, meaning water is 70% of the flour weight.",
      }}
      relatedCalculators={[
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "🍳",
        },
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🍞",
        },
        {
          title: "Oil for Frying Calculator",
          url: "/cooking/oil-for-frying-pan-depth-volume",
          icon: "🥩",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🧁",
        },
        {
          title: "Defrost Time Estimator",
          url: "/cooking/defrost-time-fridge-cold-water",
          icon: "📏",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Baker’s Percentage Calculator" },
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