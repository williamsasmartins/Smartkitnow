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
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const DENSITY_MAP = {
  sugar: 200, // grams per cup (packed sugar)
  butter: 227, // grams per cup (butter)
  flour: 120, // grams per cup (sifted flour)
};

const INGREDIENTS = [
  { label: "Sugar (packed)", value: "sugar" },
  { label: "Butter", value: "butter" },
  { label: "Flour (sifted)", value: "flour" },
];

export default function SugarButterFlourDensityLookupCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: string;
    inputType?: "volume" | "weight";
    inputValue?: string;
  }>({
    ingredient: "sugar",
    inputType: "volume",
    inputValue: "",
  });

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    const ingredient = inputs.ingredient ?? "";
    const inputType = inputs.inputType ?? "";
    const rawValue = inputs.inputValue ?? "";
    const density = DENSITY_MAP[ingredient as keyof typeof DENSITY_MAP];

    // Validation
    if (!ingredient || !inputType || !rawValue) {
      return {
        value: 0,
        label: "Enter all inputs to calculate",
        subtext: "",
        warning: null,
      };
    }

    const parsedValue = parseFloat(rawValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return {
        value: 0,
        label: "Please enter a valid positive number",
        subtext: "",
        warning: null,
      };
    }

    // Calculation Logic
    // Imperial units: volume in cups, weight in ounces
    // Metric units: volume in grams (weight) or milliliters (volume)
    // We only convert between volume (cups) and weight (grams or ounces)
    // 1 cup = 236.588 mL (not used directly, since we use density)
    // 1 ounce = 28.3495 grams

    let resultValue = 0;
    let resultLabel = "";
    let subtext = "";
    const warningMsg: string | null = null;

    if (unit === "imperial") {
      // Imperial system: volume in cups, weight in ounces
      if (inputType === "volume") {
        // Convert cups to grams using density, then grams to ounces
        const grams = parsedValue * density;
        const ounces = grams / 28.3495;
        resultValue = ounces;
        resultLabel = `${ounces.toFixed(2)} oz (weight)`;
        subtext = `Converted from ${parsedValue} cup${parsedValue !== 1 ? "s" : ""} of ${ingredient}`;
      } else {
        // inputType === "weight" (ounces)
        // Convert ounces to grams, then grams to cups using density
        const grams = parsedValue * 28.3495;
        const cups = grams / density;
        resultValue = cups;
        resultLabel = `${cups.toFixed(2)} cup${cups !== 1 ? "s" : ""} (volume)`;
        subtext = `Converted from ${parsedValue} oz of ${ingredient}`;
      }
    } else {
      // Metric system: volume in grams (weight), weight in grams
      // Here volume input means grams? No, volume input means milliliters? 
      // But we only accept volume in cups or weight in grams in metric? 
      // To keep consistent, in metric:
      // inputType volume = grams (weight) or milliliters (volume)? 
      // Since cups are imperial volume, in metric we can accept grams (weight) or milliliters (volume).
      // But the UI only allows cups or grams? The prompt says metric (grams/°C).
      // So for metric, inputType volume means grams? No, volume means milliliters.
      // But we don't have density in g/mL, only g/cup.
      // 1 cup = 236.588 mL
      // So density in g/mL = density_in_g_per_cup / 236.588

      const density_g_per_ml = density / 236.588;

      if (inputType === "volume") {
        // volume input in mL, convert to grams using density
        const grams = parsedValue * density_g_per_ml;
        resultValue = grams;
        resultLabel = `${grams.toFixed(2)} g (weight)`;
        subtext = `Converted from ${parsedValue} mL of ${ingredient}`;
      } else {
        // inputType === "weight" (grams)
        // convert grams to mL using density
        const mL = parsedValue / density_g_per_ml;
        resultValue = mL;
        resultLabel = `${mL.toFixed(2)} mL (volume)`;
        subtext = `Converted from ${parsedValue} g of ${ingredient}`;
      }
    }

    return {
      value: resultValue,
      label: resultLabel,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  // FAQ content
  const faqs = [
    {
      question: "Why is ingredient density important in baking?",
      answer:
        "Ingredient density affects how much an ingredient weighs relative to its volume. Accurate density values ensure precise conversions between cups and grams, which is crucial for consistent baking results. Using incorrect densities can lead to texture and taste variations.",
    },
    {
      question: "Can I use this tool for other ingredients?",
      answer:
        "This calculator is specifically designed for sugar, butter, and flour due to their common use and well-known densities. For other ingredients, densities vary widely, so it's best to consult specific references or use a scale for accuracy.",
    },
    {
      question: "Why does the metric system use grams and milliliters here?",
      answer:
        "In the metric system, weight is measured in grams and volume in milliliters. This tool converts between these units using ingredient-specific densities, allowing you to switch between volume and weight measurements accurately.",
    },
    {
      question: "How should I measure flour for best results?",
      answer:
        "Flour should be sifted or aerated before measuring by volume to avoid packing, which affects density. For the most accurate results, use a digital scale to measure flour by weight rather than volume.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(
    field: "ingredient" | "inputType" | "inputValue",
    value: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Calculate label texts for inputs using useMemo
  const inputTypeLabel = useMemo(() => {
    if (unit === "imperial") {
      return inputs.inputType === "volume" ? "Cups" : "Ounces";
    }
    return inputs.inputType === "volume" ? "Milliliters (mL)" : "Grams (g)";
  }, [inputs.inputType, unit]);

  const ingredientLabel = useMemo(() => {
    const found = INGREDIENTS.find((i) => i.value === inputs.ingredient);
    return found ? found.label : "";
  }, [inputs.ingredient]);

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

      {/* Ingredient Selector */}
      <div className="space-y-2">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Ingredient
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient}
          onValueChange={(val) => onInputChange("ingredient", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {INGREDIENTS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Input Type Selector */}
      <div className="space-y-2">
        <Label htmlFor="inputType" className="text-slate-700 dark:text-slate-300">
          Input Type
        </Label>
        <Select
          id="inputType"
          value={inputs.inputType}
          onValueChange={(val) => onInputChange("inputType", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select input type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">
              {unit === "imperial" ? "Volume (cups)" : "Volume (milliliters)"}
            </SelectItem>
            <SelectItem value="weight">
              {unit === "imperial" ? "Weight (ounces)" : "Weight (grams)"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input Value */}
      <div className="space-y-2">
        <Label htmlFor="inputValue" className="text-slate-700 dark:text-slate-300">
          Enter {inputTypeLabel}
        </Label>
        <Input
          id="inputValue"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter ${inputTypeLabel}`}
          value={inputs.inputValue ?? ""}
          onChange={(e) => onInputChange("inputValue", e.target.value)}
          aria-label={`Input value in ${inputTypeLabel}`}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          type="button"
          aria-label="Calculate conversion"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredient: "sugar",
              inputType: "volume",
              inputValue: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (CLEAN JSX ONLY) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.label}</p>
              {results.subtext && (
                <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.subtext}</p>
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
              <strong>Chef's Tip:</strong> Use a digital scale for baking precision.
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
          Understanding Sugar/Butter/Flour Density Lookup
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baking is a precise science where the weight and volume of ingredients can significantly impact the final product. Sugar, butter, and flour are foundational ingredients, each with unique densities that affect how much they weigh relative to their volume. This calculator helps convert between volume and weight measurements accurately using ingredient-specific densities, ensuring consistent and reliable baking results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Unlike liquids, dry ingredients like flour and sugar do not have a uniform density, especially when measured by volume. Factors such as packing, sifting, and moisture content can alter their weight. By using standardized densities—200 grams per cup for packed sugar, 227 grams per cup for butter, and 120 grams per cup for sifted flour—this tool provides precise conversions tailored for common baking scenarios.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you prefer imperial or metric units, this lookup ensures you can switch between cups, ounces, grams, and milliliters with confidence. Accurate measurement conversions help maintain the texture, flavor, and structure of your baked goods, making this tool an essential companion for both professional chefs and home bakers.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Sugar/Butter/Flour Density Lookup, first select your preferred unit system—Imperial or Metric. Then choose the ingredient you want to convert: sugar, butter, or flour. Next, specify whether your input is a volume or weight measurement. Finally, enter the numeric value of your measurement and click Calculate to see the converted result.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) based on your preference or recipe requirements.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the ingredient you want to convert—packed sugar, butter, or sifted flour.
          </li>
          <li>
            <strong>Step 3:</strong> Select whether your input is a volume (cups or milliliters) or weight (ounces or grams).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the measurement value and press Calculate to get the accurate conversion.
          </li>
          <li>
            <strong>Step 5:</strong> Use the converted value for precise ingredient measurement in your recipe.
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA FoodData Central
            </a>
            <p className="text-slate-500 text-sm">
              Official source for food composition data, including ingredient densities and nutritional information.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/baking-ingredients"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking - Baking Ingredients Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on ingredient densities and measurement tips for home and professional bakers.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cooksillustrated.com/how_tos/6609-measuring-flour"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cook's Illustrated - How to Measure Flour
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on measuring flour accurately to ensure baking success.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Sugar/Butter/Flour Density Lookup"
      description="Quickly look up ingredient densities. Convert cups of packed sugar, butter, or sifted flour to grams accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Weight = Volume × Density (grams per cup or grams per milliliter)",
        variables: [
          { symbol: "Volume", description: "Ingredient volume (cups or mL)" },
          { symbol: "Weight", description: "Ingredient weight (grams or ounces)" },
          { symbol: "Density", description: "Ingredient density (g/cup or g/mL)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Convert 1.5 cups of packed sugar to ounces in the Imperial system.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the density of packed sugar: 200 grams per cup.",
          },
          {
            label: "2",
            explanation:
              "Calculate weight in grams: 1.5 cups × 200 g/cup = 300 grams.",
          },
          {
            label: "3",
            explanation:
              "Convert grams to ounces: 300 g ÷ 28.3495 = 10.58 ounces.",
          },
        ],
        result: "1.5 cups of packed sugar equals approximately 10.58 ounces.",
      }}
      relatedCalculators={[
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "🍳",
        },
        {
          title: "Stock/Broth Reduction Time & Yield",
          url: "/cooking/stock-broth-reduction-time-yield",
          icon: "🍞",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🧁",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "📏",
        },
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Sugar/Butter/Flour Density Lookup" },
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