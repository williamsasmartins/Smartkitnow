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

type IngredientKey = "flour_ap" | "water" | "whole_wheat_flour" | "rye_flour";

const INGREDIENTS = [
  { key: "flour_ap", label: "All-Purpose Flour" },
  { key: "whole_wheat_flour", label: "Whole Wheat Flour" },
  { key: "rye_flour", label: "Rye Flour" },
  { key: "water", label: "Water" },
];

// Density map: grams per cup (US standard cup = 240ml)
// Source: King Arthur Baking, Serious Eats, USDA
const DENSITY_MAP: Record<IngredientKey, number> = {
  flour_ap: 120, // grams per cup
  whole_wheat_flour: 130,
  rye_flour: 120,
  water: 237, // ml = grams for water
};

// Baker's math: Flour = 100%, others relative to flour weight

export default function SourdoughStarterRatioFeedPlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");

  // Inputs:
  // starterAmount: number (weight or volume depending on unit)
  // starterUnit: "cups" | "grams" (depends on unit system)
  // starterHydration: number (percentage, e.g. 100 means equal flour and water in starter)
  // feedFlourAmount: number (weight or volume)
  // feedWaterAmount: number (weight or volume)
  // feedFlourType: IngredientKey (flour type used for feeding)
  // feedWaterType: always water

  const [inputs, setInputs] = useState<{
    starterAmount?: number;
    starterUnit?: "cups" | "grams";
    starterHydration?: number;
    feedFlourAmount?: number;
    feedWaterAmount?: number;
    feedFlourType?: IngredientKey;
  }>({
    starterAmount: undefined,
    starterUnit: unit === "imperial" ? "cups" : "grams",
    starterHydration: 100,
    feedFlourAmount: undefined,
    feedWaterAmount: undefined,
    feedFlourType: "flour_ap",
  });

  // Helper: convert cups to grams or grams to cups for given ingredient
  function convertAmount(
    amount: number,
    fromUnit: "cups" | "grams",
    toUnit: "cups" | "grams",
    ingredient: IngredientKey
  ): number {
    if (fromUnit === toUnit) return amount;
    const density = DENSITY_MAP[ingredient];
    if (fromUnit === "cups" && toUnit === "grams") {
      return amount * density;
    }
    if (fromUnit === "grams" && toUnit === "cups") {
      return amount / density;
    }
    return amount;
  }

  // Calculate starter flour and water weight from starter amount and hydration
  // Starter hydration = (water weight / flour weight) * 100%
  // So: flour + water = starterAmount (weight)
  // flour = starterAmount / (1 + hydration/100)
  // water = starterAmount - flour
  // If starterAmount is volume, convert to weight first assuming starter hydration and flour type average density

  // For starter density, approximate weighted average of flour and water densities:
  // starterDensity = (flourWeight + waterWeight) / volume
  // But volume unknown, so we convert volume to weight by assuming starter hydration and flour density:
  // volume = flourVolume + waterVolume
  // flourVolume = flourWeight / flourDensity
  // waterVolume = waterWeight / waterDensity (waterDensity = 237 g/cup)
  // totalVolume = flourVolume + waterVolume
  // starterDensity = starterWeight / totalVolume

  // To simplify, when input is volume, convert to weight by:
  // starterWeight = flourWeight + waterWeight
  // flourWeight = (starterHydration + 100) / 100 * waterWeight
  // But we only have volume, so:
  // volume = flourVolume + waterVolume
  // flourVolume = flourWeight / flourDensity
  // waterVolume = waterWeight / waterDensity
  // volume = flourWeight / flourDensity + waterWeight / waterDensity
  // Also waterWeight = (hydration/100) * flourWeight
  // So volume = flourWeight / flourDensity + (hydration/100 * flourWeight) / waterDensity
  // volume = flourWeight * (1 / flourDensity + hydration / (100 * waterDensity))
  // => flourWeight = volume / (1 / flourDensity + hydration / (100 * waterDensity))
  // Then waterWeight = hydration/100 * flourWeight

  function starterVolumeToWeight(
    volumeCups: number,
    hydrationPercent: number,
    flourType: IngredientKey
  ): { flourWeight: number; waterWeight: number; totalWeight: number } {
    const flourDensity = DENSITY_MAP[flourType]; // g/cup
    const waterDensity = DENSITY_MAP["water"]; // g/cup

    const flourWeight =
      volumeCups /
      (1 / flourDensity + (hydrationPercent / 100) / waterDensity);
    const waterWeight = (hydrationPercent / 100) * flourWeight;
    const totalWeight = flourWeight + waterWeight;
    return { flourWeight, waterWeight, totalWeight };
  }

  // Calculate hydration of feed (water/flour * 100%)
  function calculateHydration(
    flourWeight: number,
    waterWeight: number
  ): number {
    if (flourWeight === 0) return 0;
    return (waterWeight / flourWeight) * 100;
  }

  // Calculate total flour and water after feeding
  // Starter flour + feed flour
  // Starter water + feed water

  // Calculate final hydration after feeding

  // Calculate baker's percentages for feeding (relative to flour)

  // RESULTS:
  // Show:
  // - Starter flour weight (g or oz)
  // - Starter water weight
  // - Feed flour weight
  // - Feed water weight
  // - Final hydration %
  // - Baker's % for feed flour and water relative to starter flour
  // - Warning if hydration out of typical range (50-130%)
  // - Suggestion if hydration too low or too high

  // Conversion helpers for display
  function gramsToOunces(g: number): number {
    return g / 28.3495;
  }
  function ouncesToGrams(oz: number): number {
    return oz * 28.3495;
  }

  // Parse inputs safely
  const starterAmount = inputs.starterAmount ?? 0;
  const starterUnit = inputs.starterUnit ?? (unit === "imperial" ? "cups" : "grams");
  const starterHydration = inputs.starterHydration ?? 100;
  const feedFlourAmount = inputs.feedFlourAmount ?? 0;
  const feedWaterAmount = inputs.feedWaterAmount ?? 0;
  const feedFlourType = inputs.feedFlourType ?? "flour_ap";

  // Convert starter amount to weight grams
  let starterFlourWeight = 0;
  let starterWaterWeight = 0;
  let starterTotalWeight = 0;

  if (starterAmount > 0) {
    if (starterUnit === "grams") {
      starterTotalWeight = starterAmount;
      starterFlourWeight =
        starterTotalWeight / (1 + starterHydration / 100);
      starterWaterWeight = starterTotalWeight - starterFlourWeight;
    } else {
      // cups input
      const res = starterVolumeToWeight(
        starterAmount,
        starterHydration,
        feedFlourType
      );
      starterFlourWeight = res.flourWeight;
      starterWaterWeight = res.waterWeight;
      starterTotalWeight = res.totalWeight;
    }
  }

  // Convert feed flour and water to grams
  let feedFlourWeight = 0;
  let feedWaterWeight = 0;

  if (feedFlourAmount > 0) {
    if (unit === "imperial") {
      // input assumed cups for flour and water
      feedFlourWeight = convertAmount(
        feedFlourAmount,
        "cups",
        "grams",
        feedFlourType
      );
    } else {
      feedFlourWeight = feedFlourAmount;
    }
  }
  if (feedWaterAmount > 0) {
    if (unit === "imperial") {
      feedWaterWeight = convertAmount(feedWaterAmount, "cups", "grams", "water");
    } else {
      feedWaterWeight = feedWaterAmount;
    }
  }

  // Total flour and water after feeding
  const totalFlour = starterFlourWeight + feedFlourWeight;
  const totalWater = starterWaterWeight + feedWaterWeight;

  // Final hydration %
  const finalHydration = calculateHydration(totalFlour, totalWater);

  // Baker's % for feed flour and water relative to starter flour (100%)
  // If starter flour is zero, avoid division by zero
  const bakerFeedFlourPercent =
    starterFlourWeight > 0
      ? (feedFlourWeight / starterFlourWeight) * 100
      : 0;
  const bakerFeedWaterPercent =
    starterFlourWeight > 0
      ? (feedWaterWeight / starterFlourWeight) * 100
      : 0;

  // Prepare display values depending on unit
  function displayWeight(g: number): string {
    if (unit === "imperial") {
      const oz = gramsToOunces(g);
      return `${oz.toFixed(2)} oz`;
    }
    return `${g.toFixed(1)} g`;
  }
  function displayVolume(cups: number): string {
    if (unit === "imperial") {
      return `${cups.toFixed(2)} cups`;
    }
    // Metric: convert cups to ml (1 cup = 240 ml approx)
    return `${(cups * 240).toFixed(0)} ml`;
  }

  // Warnings for hydration outside typical range (50-130%)
  let warning: string | null = null;
  if (finalHydration < 50 && totalFlour > 0) {
    warning =
      "Warning: Final hydration is very low (<50%). This may slow fermentation and produce a stiff starter.";
  } else if (finalHydration > 130 && totalFlour > 0) {
    warning =
      "Warning: Final hydration is very high (>130%). This may cause a very loose starter and affect yeast activity.";
  }

  // Only show results if starter amount and feed flour or water > 0
  const showResults =
    starterAmount > 0 && (feedFlourAmount > 0 || feedWaterAmount > 0);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!showResults) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    return {
      value: 1, // dummy to trigger display
      label: "",
      subtext: "",
      warning,
    };
  }, [starterAmount, starterUnit, starterHydration, feedFlourAmount, feedWaterAmount, feedFlourType, unit, warning]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is sourdough starter hydration and why does it matter?",
      answer:
        "Sourdough starter hydration is the ratio of water to flour by weight in your starter, expressed as a percentage. It affects the starter's activity, texture, and fermentation speed. Typical hydration ranges from 50% (stiff) to 100% (liquid), influencing the bread's crumb and crust.",
    },
    {
      question: "How do I convert between cups and grams for flour and water?",
      answer:
        "Cups measure volume, while grams measure weight. Different ingredients have different densities; for example, 1 cup of all-purpose flour weighs about 120 grams, while 1 cup of water weighs about 237 grams. Using a scale for grams ensures accuracy in baking.",
    },
    {
      question: "Why is flour always 100% in baker's math?",
      answer:
        "In baker's math, flour is the reference ingredient set at 100%, and all other ingredients are expressed as a percentage of the flour's weight. This standardization helps bakers scale recipes and maintain consistent hydration and ratios.",
    },
    {
      question: "How often should I feed my sourdough starter?",
      answer:
        "Feeding frequency depends on temperature and starter activity. At room temperature, daily feeding is common. In the refrigerator, feeding once a week is typical. Regular feeding keeps the wild yeast healthy and active for baking.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI Handlers
  function onInputChange(
    field: keyof typeof inputs,
    value: string | number | undefined
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  }

  // When unit changes, update starterUnit accordingly
  function onUnitChange(newUnit: UnitSystem) {
    setUnit(newUnit);
    setInputs((prev) => ({
      ...prev,
      starterUnit: newUnit === "imperial" ? "cups" : "grams",
    }));
  }

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={onUnitChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">
                Imperial (Cups/°F/Oz)
              </SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Starter Amount */}
        <div>
          <Label htmlFor="starterAmount" className="mb-1 block">
            Starter Amount ({unit === "imperial" ? "cups" : "grams"})
          </Label>
          <Input
            id="starterAmount"
            type="number"
            min={0}
            step="any"
            value={inputs.starterAmount ?? ""}
            onChange={(e) =>
              onInputChange("starterAmount", parseFloat(e.target.value))
            }
            placeholder={`e.g. ${unit === "imperial" ? "0.5" : "100"}`}
          />
        </div>

        {/* Starter Hydration */}
        <div>
          <Label htmlFor="starterHydration" className="mb-1 block">
            Starter Hydration (% water to flour)
          </Label>
          <Input
            id="starterHydration"
            type="number"
            min={0}
            max={200}
            step="any"
            value={inputs.starterHydration ?? ""}
            onChange={(e) =>
              onInputChange("starterHydration", parseFloat(e.target.value))
            }
            placeholder="e.g. 100"
          />
        </div>

        {/* Feed Flour Type */}
        <div>
          <Label htmlFor="feedFlourType" className="mb-1 block">
            Feed Flour Type
          </Label>
          <Select
            id="feedFlourType"
            value={inputs.feedFlourType}
            onValueChange={(v) => onInputChange("feedFlourType", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flour type" />
            </SelectTrigger>
            <SelectContent>
              {INGREDIENTS.filter((i) => i.key !== "water").map((ing) => (
                <SelectItem key={ing.key} value={ing.key}>
                  {ing.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Feed Flour Amount */}
        <div>
          <Label htmlFor="feedFlourAmount" className="mb-1 block">
            Feed Flour Amount ({unit === "imperial" ? "cups" : "grams"})
          </Label>
          <Input
            id="feedFlourAmount"
            type="number"
            min={0}
            step="any"
            value={inputs.feedFlourAmount ?? ""}
            onChange={(e) =>
              onInputChange("feedFlourAmount", parseFloat(e.target.value))
            }
            placeholder={`e.g. ${unit === "imperial" ? "1" : "120"}`}
          />
        </div>

        {/* Feed Water Amount */}
        <div>
          <Label htmlFor="feedWaterAmount" className="mb-1 block">
            Feed Water Amount ({unit === "imperial" ? "cups" : "grams"})
          </Label>
          <Input
            id="feedWaterAmount"
            type="number"
            min={0}
            step="any"
            value={inputs.feedWaterAmount ?? ""}
            onChange={(e) =>
              onInputChange("feedWaterAmount", parseFloat(e.target.value))
            }
            placeholder={`e.g. ${unit === "imperial" ? "1" : "120"}`}
          />
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
              starterAmount: undefined,
              starterUnit: unit === "imperial" ? "cups" : "grams",
              starterHydration: 100,
              feedFlourAmount: undefined,
              feedWaterAmount: undefined,
              feedFlourType: "flour_ap",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
              </p>
              <div className="text-left max-w-md mx-auto space-y-2">
                <p>
                  <strong>Starter Flour:</strong>{" "}
                  {displayWeight(starterFlourWeight)}
                </p>
                <p>
                  <strong>Starter Water:</strong>{" "}
                  {displayWeight(starterWaterWeight)}
                </p>
                <p>
                  <strong>Feed Flour:</strong> {displayWeight(feedFlourWeight)}
                </p>
                <p>
                  <strong>Feed Water:</strong> {displayWeight(feedWaterWeight)}
                </p>
                <p>
                  <strong>Final Hydration:</strong>{" "}
                  {finalHydration.toFixed(1)}%
                </p>
                <p>
                  <strong>Feed Flour (% of starter flour):</strong>{" "}
                  {bakerFeedFlourPercent.toFixed(1)}%
                </p>
                <p>
                  <strong>Feed Water (% of starter flour):</strong>{" "}
                  {bakerFeedWaterPercent.toFixed(1)}%
                </p>
              </div>
              {warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {warning}
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
              Adjust hydration carefully to maintain starter health and
              activity.
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
          Understanding Sourdough Starter Ratio & Feed Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A sourdough starter is a living culture of wild yeast and bacteria,
          maintained by regularly feeding flour and water. The ratio of these
          ingredients, known as hydration, directly influences the starter's
          activity, flavor, and texture. Proper feeding ratios ensure a healthy
          and active starter, essential for consistent bread baking.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This planner helps you calculate the precise amounts of starter,
          flour, and water to feed your culture based on your preferred units
          and flour type. It incorporates ingredient densities for accurate
          conversions between volume and weight, adhering to baker's math
          principles where flour is always 100%. This precision is crucial for
          replicable results in sourdough baking.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this tool, input your current starter amount and hydration,
          select your feed flour type, and enter the amounts of flour and water
          you plan to add. The calculator will provide the resulting hydration
          and baker's percentages, helping you maintain a balanced and active
          starter.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your starter amount in cups or
            grams.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the hydration percentage of your
            starter (typically 100%).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the flour type you will use for
            feeding.
          </li>
          <li>
            <strong>Step 4:</strong> Input the amounts of flour and water you
            plan to feed your starter.
          </li>
          <li>
            <strong>Step 5:</strong> Review the calculated hydration and baker's
            percentages to adjust feeding ratios as needed.
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
              href="https://www.kingarthurbaking.com/learn/guides/sourdough-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking: Sourdough Starter Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on maintaining and feeding sourdough starters
              with hydration and feeding ratios.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-make-sourdough-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats: How to Make a Sourdough Starter
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of sourdough starter hydration and feeding
              schedules.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA Food Safety Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Food safety standards relevant to fermentation and ingredient
              handling.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Sourdough Starter Ratio & Feed Planner"
      description="Plan your sourdough starter feedings. Calculate the perfect ratio of starter, flour, and water to keep your wild yeast active."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Final Hydration (%) = ((Starter Water + Feed Water) / (Starter Flour + Feed Flour)) × 100",
        variables: [
          { symbol: "Starter Water + Feed Water", description: "Total water weight" },
          { symbol: "Starter Flour + Feed Flour", description: "Total flour weight" },
          { symbol: "Final Hydration (%)", description: "Hydration percentage of starter after feeding" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have 0.5 cups of starter at 100% hydration and want to feed it with 1 cup flour and 1 cup water.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert all volumes to grams using ingredient densities (flour 120g/cup, water 237g/cup).",
          },
          {
            label: "2",
            explanation:
              "Calculate starter flour and water weights, then add feed flour and water weights.",
          },
          {
            label: "3",
            explanation:
              "Calculate final hydration: (starter water + feed water) / (starter flour + feed flour) × 100.",
          },
        ],
        result: "Final hydration is approximately 100%, maintaining a balanced starter.",
      }}
      relatedCalculators={[
        { title: "Baker’s Percentage Calculator", url: "/cooking/bakers-percentage", icon: "🍳" },
        { title: "Cake Pan Size & Volume Converter", url: "/cooking/cake-pan-size-volume-converter", icon: "🍰" },
        { title: "Alcohol by Volume (ABV) Dilution", url: "/cooking/alcohol-abv-dilution", icon: "🥩" },
        { title: "Turkey Size, Thaw & Cook Time Calculator", url: "/cooking/turkey-thaw-cook-time", icon: "🥩" },
        { title: "Salt % for Brining Calculator", url: "/cooking/salt-percent-brining", icon: "📏" },
        { title: "Flour Blend Substitution Helper", url: "/cooking/flour-blend-substitution", icon: "🍰" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Sourdough Starter Ratio & Feed Planner" },
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