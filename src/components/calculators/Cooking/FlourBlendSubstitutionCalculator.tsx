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
  | "flour_ap"
  | "flour_wholewheat"
  | "almond_flour"
  | "coconut_flour"
  | "rice_flour"
  | "sugar_granulated"
  | "butter"
  | "water";

const INGREDIENTS = [
  { key: "flour_ap", label: "All-Purpose Flour" },
  { key: "flour_wholewheat", label: "Whole Wheat Flour" },
  { key: "almond_flour", label: "Almond Flour" },
  { key: "coconut_flour", label: "Coconut Flour" },
  { key: "rice_flour", label: "Rice Flour" },
  { key: "sugar_granulated", label: "Granulated Sugar" },
  { key: "butter", label: "Butter" },
  { key: "water", label: "Water" },
];

// Density in grams per cup (US cup = 240 ml approx, but we use ingredient-specific weights)
const DENSITY_MAP: Record<IngredientKey, number> = {
  flour_ap: 120,
  flour_wholewheat: 130,
  almond_flour: 96,
  coconut_flour: 112,
  rice_flour: 158,
  sugar_granulated: 200,
  butter: 227, // 1 cup butter = 227g (2 sticks)
  water: 240,
};

// Flour blend substitution ratios (weight basis)
// These are typical recommended ratios for substituting 100g AP flour
// Source: King Arthur Baking, Serious Eats
const FLOUR_BLEND_RATIOS: Record<
  IngredientKey,
  number
> = {
  flour_ap: 1, // baseline
  flour_wholewheat: 1, // can substitute 1:1 by weight but denser, so hydration may need adjustment
  almond_flour: 0.9, // almond flour is lighter, so use 90% by weight to replace AP flour
  coconut_flour: 0.2, // coconut flour is very absorbent, use 20% by weight
  rice_flour: 1, // rice flour can substitute 1:1 by weight but texture differs
  sugar_granulated: 1, // not flour, but included for completeness
  butter: 1, // not flour, but included for completeness
  water: 1, // not flour, but included for completeness
};

export default function FlourBlendSubstitutionCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    ingredientFrom?: IngredientKey;
    ingredientTo?: IngredientKey;
    amount?: string; // string to allow empty input
  }>({
    ingredientFrom: "flour_ap",
    ingredientTo: "almond_flour",
    amount: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { ingredientFrom, ingredientTo, amount } = inputs;
    if (
      !ingredientFrom ||
      !ingredientTo ||
      !amount ||
      isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse input amount
    const inputAmount = Number(amount);

    // Convert input amount to grams (weight) if input is in cups (imperial)
    // or grams if metric
    // We assume input amount is in cups if imperial, grams if metric
    // So first convert input to grams based on ingredientFrom density
    const densityFrom = DENSITY_MAP[ingredientFrom];
    const densityTo = DENSITY_MAP[ingredientTo];
    const ratioFrom = FLOUR_BLEND_RATIOS[ingredientFrom];
    const ratioTo = FLOUR_BLEND_RATIOS[ingredientTo];

    let inputGrams: number;
    if (unit === "imperial") {
      // input is cups, convert to grams
      inputGrams = inputAmount * densityFrom;
    } else {
      // metric: input is grams
      inputGrams = inputAmount;
    }

    // Adjust input grams by baker's math ratio (all relative to AP flour = 100%)
    // We normalize input to AP flour equivalent weight first
    // Then convert to target flour weight using ratio
    // Formula:
    // AP_equivalent = inputGrams / ratioFrom
    // targetGrams = AP_equivalent * ratioTo

    // This ensures proper substitution accounting for absorbency and density differences
    const apEquivalent = inputGrams / ratioFrom;
    const targetGrams = apEquivalent * ratioTo;

    // Convert target grams back to output units
    let outputAmount: number;
    if (unit === "imperial") {
      // convert grams to cups for target ingredient
      outputAmount = targetGrams / densityTo;
    } else {
      // metric: output in grams
      outputAmount = targetGrams;
    }

    // Format output with 2 decimals for cups, 1 decimal for grams
    const formattedValue =
      unit === "imperial"
        ? outputAmount.toFixed(2)
        : outputAmount.toFixed(1);

    // Subtext: show conversion detail
    const subtext = `Equivalent to ${formattedValue} ${
      unit === "imperial" ? "cups" : "grams"
    } of ${INGREDIENTS.find((i) => i.key === ingredientTo)?.label}.`;

    return {
      value: formattedValue,
      label: `Substituted Amount (${unit === "imperial" ? "cups" : "grams"})`,
      subtext,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How accurate is this flour substitution calculator?",
      answer:
        "This calculator uses weight-based baker's percentages and ingredient densities from trusted sources like King Arthur Baking and Serious Eats. While it provides precise conversions, slight adjustments may be needed based on recipe hydration and texture preferences.",
    },
    {
      question: "Why is weight measurement preferred over volume in baking?",
      answer:
        "Weight measurements eliminate variability caused by ingredient packing and humidity. Using grams ensures consistent results, which is critical in baking where precision affects texture and rise.",
    },
    {
      question: "Can I substitute coconut flour 1:1 with all-purpose flour?",
      answer:
        "No, coconut flour is highly absorbent and requires much less quantity than all-purpose flour. This calculator accounts for that by recommending approximately 20% of the AP flour weight for coconut flour substitution.",
    },
    {
      question: "Does this calculator consider hydration changes when substituting flours?",
      answer:
        "This tool focuses on weight and volume conversions. For hydration adjustments, especially with whole wheat or nut flours, additional water or liquid may be necessary. Consult baking guides for hydration tweaks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(
    field: keyof typeof inputs,
    value: string | IngredientKey | undefined
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as UnitSystem)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">
                Imperial (Cups/°F/Lbs)
              </SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredient From */}
      <div className="space-y-1">
        <Label htmlFor="ingredientFrom" className="text-slate-700 dark:text-slate-300">
          Ingredient to Substitute From
        </Label>
        <Select
          id="ingredientFrom"
          value={inputs.ingredientFrom}
          onValueChange={(v) => onInputChange("ingredientFrom", v as IngredientKey)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {INGREDIENTS.map(({ key, label }) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ingredient To */}
      <div className="space-y-1">
        <Label htmlFor="ingredientTo" className="text-slate-700 dark:text-slate-300">
          Substitute To
        </Label>
        <Select
          id="ingredientTo"
          value={inputs.ingredientTo}
          onValueChange={(v) => onInputChange("ingredientTo", v as IngredientKey)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {INGREDIENTS.map(({ key, label }) => (
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
          value={inputs.amount ?? ""}
          onChange={(e) => onInputChange("amount", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredientFrom: "flour_ap",
              ingredientTo: "almond_flour",
              amount: "",
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
              <strong>Chef's Tip:</strong> For baking, using a digital scale
              (grams) is always more accurate than volume measurements (cups).
              Adjust hydration when substituting flours with different absorbency.
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
          Understanding Flour Blend Substitution Helper
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baking is a precise science where ingredient ratios and densities
          significantly affect the final product. This Flour Blend Substitution
          Helper allows you to convert between different flours and ingredients
          by accounting for their unique densities and baking properties.
          Instead of relying on generic volume conversions, it uses weight-based
          baker's math to ensure accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By normalizing all flours to all-purpose flour as 100%, the tool
          calculates the equivalent amount of substitute flour needed to
          maintain recipe balance. This is especially important when working
          with gluten-free or alternative flours like almond or coconut flour,
          which behave differently in doughs and batters.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, select the ingredient you want to substitute
          from and the ingredient you want to substitute to. Enter the amount in
          cups or grams depending on your preferred unit system. The calculator
          will provide the equivalent amount of the substitute ingredient,
          accounting for differences in density and baking ratios.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the original flour or ingredient you
            want to replace.
          </li>
          <li>
            <strong>Step 2:</strong> Select the substitute flour or ingredient.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the amount of the original ingredient
            in cups or grams.
          </li>
          <li>
            <strong>Step 4:</strong> Review the calculated substitute amount and
            adjust recipe hydration as needed.
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
              href="https://www.kingarthurbaking.com/learn/guides/flour-weight-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking Flour Weight Chart
            </a>
            <p className="text-slate-500 text-sm">
              Provides detailed densities and substitution ratios for various
              flours and baking ingredients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-substitute-flours-in-baking"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats Flour Substitution Guide
            </a>
            <p className="text-slate-500 text-sm">
              Explains the science behind flour substitutions and hydration
              adjustments.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA Food Safety Standards
            </a>
            <p className="text-slate-500 text-sm">
              Reference for safe food handling and ingredient standards.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Flour Blend Substitution Helper"
      description="Create gluten-free flour blends. Calculate ratios for substituting all-purpose flour with almond, coconut, or rice flour mixes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Substitute Amount = (Input Amount × Density_from / Ratio_from) × Ratio_to / Density_to",
        variables: [
          {
            symbol: "Input Amount",
            description: "Amount of original ingredient (cups or grams)",
          },
          {
            symbol: "Density_from",
            description: "Density of original ingredient (g/cup)",
          },
          {
            symbol: "Ratio_from",
            description:
              "Baker's ratio of original ingredient relative to AP flour (100%)",
          },
          {
            symbol: "Ratio_to",
            description:
              "Baker's ratio of substitute ingredient relative to AP flour (100%)",
          },
          {
            symbol: "Density_to",
            description: "Density of substitute ingredient (g/cup)",
          },
          {
            symbol: "Substitute Amount",
            description:
              "Calculated amount of substitute ingredient (cups or grams)",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Substituting 1 cup of all-purpose flour with almond flour in a recipe.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 1 cup AP flour to grams: 1 × 120g = 120g.",
          },
          {
            label: "2",
            explanation:
              "Calculate AP flour equivalent: 120g / 1 (AP flour ratio) = 120g.",
          },
          {
            label: "3",
            explanation:
              "Calculate almond flour amount: 120g × 0.9 (almond flour ratio) = 108g.",
          },
          {
            label: "4",
            explanation:
              "Convert grams to cups almond flour: 108g / 96g per cup ≈ 1.13 cups.",
          },
        ],
        result: "Use approximately 1.13 cups of almond flour to substitute 1 cup of AP flour.",
      }}
      relatedCalculators={[
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🍳",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🥩",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
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
        { id: "what-is", label: "Understanding Flour Blend Substitution Helper" },
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