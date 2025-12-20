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

type UnitSystem = "imperial" | "metric";
type PanShape = "round" | "square" | "rectangular";

const ingredientDensityMap: Record<string, number> = {
  Flour: 120, // g/cup
  Sugar: 200, // g/cup
  Butter: 227, // g/cup (approx)
  Water: 236, // g/cup (approx)
};

const panDepthsInches = [1, 1.5, 2, 2.5, 3]; // Common cake pan depths in inches
const panDepthsCm = panDepthsInches.map((inch) => inch * 2.54);

export default function CakePanSizeVolumeConverterCalculator() {
  // Inputs:
  // - Pan shape (round, square, rectangular)
  // - Pan dimensions (diameter for round, length & width for rectangular/square)
  // - Pan depth
  // - Unit system (imperial or metric)
  // - Ingredient (for density)
  // - Convert to: volume or weight
  // - Target pan shape and dimensions (optional for conversion)
  // For simplicity, we convert input pan size to volume, then optionally convert volume to weight of ingredient.

  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    panShape: PanShape;
    diameter?: string; // for round pan
    length?: string; // for rectangular/square pan
    width?: string; // for rectangular pan
    depth?: string;
    ingredient: string;
    convertTo: "volume" | "weight";
  }>({
    panShape: "round",
    diameter: "",
    length: "",
    width: "",
    depth: "",
    ingredient: "Flour",
    convertTo: "volume",
  });

  // Helper: parse float safely
  const parseInput = (val?: string): number | null => {
    if (!val) return null;
    const n = parseFloat(val);
    return isNaN(n) || n <= 0 ? null : n;
  };

  // Calculate volume in cups (imperial) or mL (metric)
  // 1 cup = 236.588 mL (approx)
  // For imperial, inputs are in inches, output volume in cups
  // For metric, inputs are in cm, output volume in mL

  const results = useMemo(() => {
    // Parse inputs
    const panShape = inputs.panShape;
    const diameter = parseInput(inputs.diameter);
    const length = parseInput(inputs.length);
    const width = parseInput(inputs.width);
    const depth = parseInput(inputs.depth);
    const ingredient = inputs.ingredient;
    const convertTo = inputs.convertTo;

    // Validation
    const warningMsg: string | null = null;
    if (!depth) {
      return {
        value: 0,
        label: "Enter pan depth",
        subtext: "",
        warning: null,
      };
    }
    if (panShape === "round" && !diameter) {
      return {
        value: 0,
        label: "Enter pan diameter",
        subtext: "",
        warning: null,
      };
    }
    if ((panShape === "square" || panShape === "rectangular") && (!length || !width)) {
      return {
        value: 0,
        label: "Enter pan length and width",
        subtext: "",
        warning: null,
      };
    }
    if (!ingredientDensityMap[ingredient]) {
      return {
        value: 0,
        label: `Unknown ingredient: ${ingredient}`,
        subtext: "",
        warning: null,
      };
    }

    // Convert all inputs to consistent units for calculation
    // Imperial: inches, Metric: cm
    // Depth is in inches or cm depending on unit system
    // Volume = Area * Depth

    // Calculate area
    let areaInSqInches = 0;
    let areaInSqCm = 0;

    if (unit === "imperial") {
      if (panShape === "round" && diameter) {
        const radius = diameter / 2;
        areaInSqInches = Math.PI * radius * radius;
      } else if ((panShape === "square" || panShape === "rectangular") && length && width) {
        areaInSqInches = length * width;
      }
      // volume in cubic inches
      const volumeCubicInches = areaInSqInches * depth;
      // convert cubic inches to cups: 1 cup = 14.4375 cubic inches
      const volumeCups = volumeCubicInches / 14.4375;

      // Convert volume to weight if needed
      if (convertTo === "weight") {
        // density in g/cup
        const density = ingredientDensityMap[ingredient];
        // weight in grams
        const weightGrams = density * volumeCups;
        // convert grams to ounces (1 oz = 28.3495 g)
        const weightOunces = weightGrams / 28.3495;

        const displayValue =
          unit === "imperial"
            ? `${weightOunces.toFixed(2)} oz (${weightGrams.toFixed(0)} g)`
            : `${weightGrams.toFixed(0)} g`;

        const labelText = `Weight of ${ingredient} for your pan`;

        const subtext = `Based on volume of ${volumeCups.toFixed(2)} cups and density of ${density} g/cup.`;

        return {
          value: displayValue,
          label: labelText,
          subtext,
          warning: warningMsg,
        };
      } else {
        // convertTo volume
        const displayValue = `${volumeCups.toFixed(2)} cups`;
        const labelText = "Pan volume";
        const subtext = `Calculated from pan dimensions and depth.`;

        return {
          value: displayValue,
          label: labelText,
          subtext,
          warning: warningMsg,
        };
      }
    } else {
      // metric
      if (panShape === "round" && diameter) {
        const radius = diameter / 2;
        areaInSqCm = Math.PI * radius * radius;
      } else if ((panShape === "square" || panShape === "rectangular") && length && width) {
        areaInSqCm = length * width;
      }
      // volume in cubic cm (mL)
      const volumeMl = areaInSqCm * depth;

      if (convertTo === "weight") {
        const density = ingredientDensityMap[ingredient];
        // weight in grams
        const weightGrams = (density / 236.588) * volumeMl; // density is g/cup, 1 cup=236.588 mL
        const displayValue = `${weightGrams.toFixed(0)} g`;
        const labelText = `Weight of ${ingredient} for your pan`;
        const subtext = `Based on volume of ${volumeMl.toFixed(0)} mL and density of ${density} g/cup.`;

        return {
          value: displayValue,
          label: labelText,
          subtext,
          warning: warningMsg,
        };
      } else {
        // convertTo volume
        const displayValue = `${volumeMl.toFixed(0)} mL`;
        const labelText = "Pan volume";
        const subtext = `Calculated from pan dimensions and depth.`;

        return {
          value: displayValue,
          label: labelText,
          subtext,
          warning: warningMsg,
        };
      }
    }
  }, [inputs, unit]);

  // FAQ content
  const faqs = [
    {
      question: "How do I calculate the volume of a round cake pan?",
      answer:
        "To calculate the volume of a round cake pan, measure the diameter and depth. Use the formula Volume = π × (radius)² × depth. This gives you the volume in cubic units, which can be converted to cups or milliliters depending on your unit system.",
    },
    {
      question: "Why is ingredient density important for conversions?",
      answer:
        "Ingredient density allows you to convert between volume and weight accurately. Different ingredients have different densities, so using a density map ensures your recipe adjustments maintain the correct proportions and baking results.",
    },
    {
      question: "Can I convert pan sizes between round and square shapes?",
      answer:
        "Yes, by calculating the volume of your original pan and then finding the dimensions of a new pan shape with the same volume, you can adjust recipes to fit different pan shapes without affecting the bake.",
    },
    {
      question: "What unit system should I use for baking?",
      answer:
        "Both imperial and metric units are commonly used. Choose the system you are most comfortable with or that matches your recipe. This converter supports both and will handle the necessary unit conversions for you.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange = (field: keyof typeof inputs, value: string | PanShape | "volume" | "weight") => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset inputs
  const onReset = () => {
    setInputs({
      panShape: "round",
      diameter: "",
      length: "",
      width: "",
      depth: "",
      ingredient: "Flour",
      convertTo: "volume",
    });
  };

  // Options for ingredients
  const ingredientOptions = Object.keys(ingredientDensityMap);

  // Depth options for select (optional enhancement)
  // But we keep depth as free input for flexibility

  // Precalculate labels for inputs to avoid inline logic in JSX
  const panShapeLabel = useMemo(() => {
    switch (inputs.panShape) {
      case "round":
        return "Diameter";
      case "square":
        return "Side Length";
      case "rectangular":
        return "Length & Width";
      default:
        return "Dimension";
    }
  }, [inputs.panShape]);

  // JSX Inputs rendering
  const inputsSection = (
    <div className="space-y-6">
      {/* Pan Shape */}
      <div className="space-y-1">
        <Label htmlFor="panShape" className="text-slate-700 dark:text-slate-300">
          Pan Shape
        </Label>
        <Select
          id="panShape"
          value={inputs.panShape}
          onValueChange={(v) => onInputChange("panShape", v as PanShape)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="rectangular">Rectangular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions */}
      {inputs.panShape === "round" && (
        <div className="space-y-1">
          <Label htmlFor="diameter" className="text-slate-700 dark:text-slate-300">
            Diameter ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="diameter"
            type="number"
            min={0}
            step="any"
            value={inputs.diameter}
            onChange={(e) => onInputChange("diameter", e.target.value)}
            placeholder={`e.g. ${unit === "imperial" ? "8" : "20"}`}
          />
        </div>
      )}

      {(inputs.panShape === "square" || inputs.panShape === "rectangular") && (
        <>
          <div className="space-y-1">
            <Label
              htmlFor="length"
              className="text-slate-700 dark:text-slate-300"
            >
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length}
              onChange={(e) => onInputChange("length", e.target.value)}
              placeholder={`e.g. ${unit === "imperial" ? "8" : "20"}`}
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="width"
              className="text-slate-700 dark:text-slate-300"
            >
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width}
              onChange={(e) => onInputChange("width", e.target.value)}
              placeholder={`e.g. ${unit === "imperial" ? "8" : "20"}`}
            />
          </div>
        </>
      )}

      {/* Depth */}
      <div className="space-y-1">
        <Label htmlFor="depth" className="text-slate-700 dark:text-slate-300">
          Depth ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="depth"
          type="number"
          min={0}
          step="any"
          value={inputs.depth}
          onChange={(e) => onInputChange("depth", e.target.value)}
          placeholder={`e.g. ${unit === "imperial" ? "2" : "5"}`}
        />
      </div>

      {/* Ingredient */}
      <div className="space-y-1">
        <Label
          htmlFor="ingredient"
          className="text-slate-700 dark:text-slate-300"
        >
          Ingredient (for weight conversion)
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient}
          onValueChange={(v) => onInputChange("ingredient", v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ingredientOptions.map((ing) => (
              <SelectItem key={ing} value={ing}>
                {ing}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Convert To */}
      <div className="space-y-1">
        <Label
          htmlFor="convertTo"
          className="text-slate-700 dark:text-slate-300"
        >
          Convert To
        </Label>
        <Select
          id="convertTo"
          value={inputs.convertTo}
          onValueChange={(v) => onInputChange("convertTo", v as "volume" | "weight")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="weight">Weight</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

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
              <SelectItem value="imperial">Imperial (inches/cups)</SelectItem>
              <SelectItem value="metric">Metric (cm/mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      {inputsSection}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
          Understanding Cake Pan Size & Volume Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baking is a precise science where the size and volume of your cake pan
          directly influence the outcome of your recipe. Different pan shapes and
          sizes hold varying amounts of batter, which affects baking time and texture.
          This converter helps you understand and calculate the volume of your cake
          pan based on its shape and dimensions, allowing you to adjust recipes
          accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting your pan's measurements and selecting your preferred unit system,
          you can quickly find the volume in cups or milliliters. Additionally, by
          selecting an ingredient, you can convert this volume to weight, ensuring
          your ingredient quantities are precise. This tool is essential for scaling
          recipes or substituting pans without compromising your bake.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the converter, first select your pan shape: round, square, or rectangular.
          Enter the relevant dimensions in your chosen unit system (inches or centimeters),
          including the pan's depth. Choose the ingredient for weight conversion if needed,
          and select whether you want the output in volume or weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Choose your pan shape and enter its dimensions.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the pan depth.
          </li>
          <li>
            <strong>Step 4:</strong> Select the ingredient for weight conversion or choose volume.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to see the volume or weight result.
          </li>
          <li>
            <strong>Step 6:</strong> Use the Reset button to clear inputs and start over.
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
              href="https://www.kingarthurbaking.com/learn/guides/cake-pans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Cake Pan Sizes Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on cake pan sizes, volumes, and baking tips.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nal.usda.gov/legacy/fnic/food-composition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. USDA Food Composition Databases
            </a>
            <p className="text-slate-500 text-sm">
              Official source for ingredient densities and nutritional information.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.baking911.com/cake-pan-size-conversion-chart/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Baking 911 - Cake Pan Size Conversion Chart
            </a>
            <p className="text-slate-500 text-sm">
              Useful chart for converting cake pan sizes and adjusting recipes.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cake Pan Size & Volume Converter"
      description="Convert cake pan sizes. Adjust recipes for different pan shapes and volumes (round vs square) without ruining your bake."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Volume = Area × Depth; Area (Round) = π × (Diameter/2)²; Area (Square/Rectangular) = Length × Width",
        variables: [
          { symbol: "Diameter", description: "Pan diameter (round)" },
          { symbol: "Length", description: "Pan length (square/rectangular)" },
          { symbol: "Width", description: "Pan width (rectangular)" },
          { symbol: "Depth", description: "Pan depth" },
          { symbol: "Volume", description: "Pan volume" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have an 8-inch round cake pan with a depth of 2 inches and want to know its volume in cups and the weight of flour needed.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the area: π × (8/2)² = 50.27 square inches.",
          },
          {
            label: "2",
            explanation:
              "Calculate volume: 50.27 × 2 = 100.53 cubic inches.",
          },
          {
            label: "3",
            explanation:
              "Convert volume to cups: 100.53 / 14.4375 ≈ 6.97 cups.",
          },
          {
            label: "4",
            explanation:
              "Convert volume to weight: 6.97 cups × 120 g/cup = 836 grams of flour.",
          },
        ],
        result: "Your 8-inch round pan holds approximately 7 cups or 836 grams of flour.",
      }}
      relatedCalculators={[
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍳",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "🥩",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "🧁",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "📏",
        },
        {
          title: "Defrost Time Estimator",
          url: "/cooking/defrost-time-fridge-cold-water",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cake Pan Size & Volume Converter" },
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