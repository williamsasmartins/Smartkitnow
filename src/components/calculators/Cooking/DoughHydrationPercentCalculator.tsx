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

export default function DoughHydrationPercentCalculator() {
  // Units: imperial = cups & °F, metric = grams & °C
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  // Inputs: Flour and Water amounts, either in cups or grams
  const [inputs, setInputs] = useState<{
    flour: string;
    water: string;
  }>({
    flour: "",
    water: "",
  });

  // Density map for flour (all-purpose): 120 g/cup
  // This is essential for converting cups to grams and vice versa.
  const FLOUR_DENSITY_G_PER_CUP = 120;

  // Parse input strings to numbers safely
  const parsedFlour = useMemo(() => {
    const val = parseFloat(inputs.flour);
    return isNaN(val) || val < 0 ? null : val;
  }, [inputs.flour]);

  const parsedWater = useMemo(() => {
    const val = parseFloat(inputs.water);
    return isNaN(val) || val < 0 ? null : val;
  }, [inputs.water]);

  // Calculation and validation logic
  const results = useMemo(() => {
    // Validation: both inputs must be positive numbers
    if (parsedFlour === null || parsedWater === null) {
      return {
        value: 0,
        label: "Enter valid amounts for flour and water",
        subtext: "",
        warning: null,
      };
    }
    if (parsedFlour === 0) {
      return {
        value: 0,
        label: "Flour amount must be greater than zero",
        subtext: "",
        warning: null,
      };
    }

    // Convert inputs to grams for calculation if in imperial (cups)
    // If metric, inputs are already in grams
    const flourGrams =
      unit === "imperial" ? parsedFlour * FLOUR_DENSITY_G_PER_CUP : parsedFlour;
    const waterGrams =
      unit === "imperial" ? parsedWater * FLOUR_DENSITY_G_PER_CUP : parsedWater;

    // Dough hydration % = (water weight / flour weight) * 100
    const hydrationPercent = (waterGrams / flourGrams) * 100;

    // Prepare output strings
    const displayValue = hydrationPercent.toFixed(1) + " %";
    const labelText = "Dough Hydration Percentage";
    const subtext = "Ideal hydration varies by bread type and technique.";

    // No warnings needed for hydration %, but if hydration <30% or >90%, warn user
    let warningMsg: string | null = null;
    if (hydrationPercent < 30) {
      warningMsg =
        "Warning: Hydration below 30% is very low and may produce a dry dough.";
    } else if (hydrationPercent > 90) {
      warningMsg =
        "Warning: Hydration above 90% is very high and may be difficult to handle.";
    }

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: warningMsg,
    };
  }, [parsedFlour, parsedWater, unit]);

  // FAQ content
  const faqs = [
    {
      question: "What is dough hydration percentage?",
      answer:
        "Dough hydration percentage is the ratio of water weight to flour weight in a dough, expressed as a percentage. It influences dough consistency, texture, and crumb structure in bread baking.",
    },
    {
      question: "Why is dough hydration important for baking?",
      answer:
        "Hydration affects dough elasticity, fermentation speed, and final bread texture. Higher hydration usually results in a more open crumb and softer bread, while lower hydration yields denser loaves.",
    },
    {
      question: "Can I use cups instead of grams for this calculator?",
      answer:
        "Yes, the calculator supports both imperial (cups) and metric (grams) units. When using cups, the calculator converts volumes to weight using standard ingredient densities for accuracy.",
    },
    {
      question: "What hydration percentage is best for sourdough bread?",
      answer:
        "Sourdough hydration typically ranges from 65% to 85%. Higher hydration sourdoughs produce more open crumb and moist texture but require more skill to handle.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(field: "flour" | "water", value: string) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as "imperial" | "metric")}>
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
      <div className="space-y-4">
        <div>
          <Label htmlFor="flour-input" className="mb-1 block text-slate-700 dark:text-slate-300">
            Flour Amount ({unit === "imperial" ? "cups" : "grams"})
          </Label>
          <Input
            id="flour-input"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 3.5" : "e.g. 420"}
            value={inputs.flour}
            onChange={(e) => onInputChange("flour", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="water-input" className="mb-1 block text-slate-700 dark:text-slate-300">
            Water Amount ({unit === "imperial" ? "cups" : "grams"})
          </Label>
          <Input
            id="water-input"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 300"}
            value={inputs.water}
            onChange={(e) => onInputChange("water", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ flour: "", water: "" })}
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

  // Editorial content with detailed paragraphs and steps
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dough Hydration % Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dough hydration percentage is a fundamental concept in bread baking,
          representing the ratio of water to flour by weight in a dough
          mixture. This ratio directly influences the dough's texture,
          elasticity, and the final bread crumb structure. By accurately
          calculating hydration, bakers can tailor their recipes to achieve
          desired results, from chewy artisan loaves to soft sandwich breads.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator allows you to input your flour and water amounts in
          either imperial or metric units, converting volumes to weights using
          ingredient densities for precision. Understanding and controlling
          hydration helps in mastering fermentation, gluten development, and
          overall dough handling, essential for consistent baking success.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Dough Hydration % Calculator, select your preferred unit
          system—imperial for cups or metric for grams. Enter the amount of
          flour and water used in your dough. The calculator will compute the
          hydration percentage, helping you understand the water content
          relative to flour weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose your unit system at the top.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the flour amount in cups or grams.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the water amount in cups or grams.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the hydration
            percentage.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust your recipe hydration based on the
            results and baking goals.
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
              href="https://www.kingarthurbaking.com/learn/guides/bread-baking-basics/hydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Understanding Dough Hydration
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on dough hydration and its impact on bread
              baking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.theperfectloaf.com/baker-percentage/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. The Perfect Loaf - Baker's Percentage Explained
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of baker's percentages and hydration in
              sourdough baking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://fdc.nal.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA FoodData Central
            </a>
            <p className="text-slate-500 text-sm">
              Official source for ingredient densities and nutritional data.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dough Hydration % Calculator"
      description="Calculate dough hydration percentage. Essential for sourdough and artisanal bread to achieve the perfect crumb and texture."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Hydration % = (Water Weight ÷ Flour Weight) × 100",
        variables: [
          { symbol: "Water Weight", description: "Weight of water in grams" },
          { symbol: "Flour Weight", description: "Weight of flour in grams" },
          { symbol: "Hydration %", description: "Dough hydration percentage" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 3 cups of flour and 2 cups of water. Calculate the hydration percentage.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert cups of flour to grams: 3 cups × 120 g/cup = 360 g.",
          },
          {
            label: "2",
            explanation:
              "Convert cups of water to grams (assuming water density ~236 g/cup): 2 cups × 236 g/cup = 472 g.",
          },
          {
            label: "3",
            explanation:
              "Calculate hydration %: (472 g ÷ 360 g) × 100 = 131.1%.",
          },
        ],
        result:
          "The dough hydration is 131.1%, which is very high and likely too wet for most bread recipes.",
      }}
      relatedCalculators={[
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🧁",
        },
        {
          title: "Baker’s Percentage Calculator",
          url: "/cooking/bakers-percentage",
          icon: "📏",
        },
        {
          title: "Defrost Time Estimator",
          url: "/cooking/defrost-time-fridge-cold-water",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dough Hydration % Calculator" },
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