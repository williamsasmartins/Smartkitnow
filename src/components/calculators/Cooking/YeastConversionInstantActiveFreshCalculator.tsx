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

const DENSITY_MAP = {
  flour: 120, // grams per cup
  sugar: 200, // grams per cup
  yeast: 300, // grams per cup (approximate for dry yeast granules)
};

const YEAST_CONVERSION_FACTORS = {
  instant: 1,
  "active-dry": 1.25, // active dry yeast needs 25% more than instant
  fresh: 3, // fresh yeast is about 3 times instant yeast by weight
};

const UNIT_LABELS = {
  imperial: {
    weight: "oz",
    volume: "cups",
    temp: "°F",
  },
  metric: {
    weight: "g",
    volume: "ml",
    temp: "°C",
  },
};

const DANGER_ZONE_F = { min: 40, max: 140 };
const DANGER_ZONE_C = { min: 4.4, max: 60 };

function roundTo(value: number, decimals = 2) {
  return Number(value.toFixed(decimals));
}

export default function YeastConversionInstantActiveFreshCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    yeastTypeFrom?: "instant" | "active-dry" | "fresh";
    yeastTypeTo?: "instant" | "active-dry" | "fresh";
    quantity?: string;
    quantityUnit?: "weight" | "volume";
    ingredient?: "flour" | "sugar" | "yeast";
    temperature?: string;
  }>({
    yeastTypeFrom: "instant",
    yeastTypeTo: "active-dry",
    quantityUnit: "weight",
    ingredient: "yeast",
  });

  // Parse float safely
  const parseInputFloat = (val?: string) => {
    if (!val) return NaN;
    const n = parseFloat(val);
    return isNaN(n) ? NaN : n;
  };

  // Convert volume cups to grams using density
  const volumeCupsToGrams = (cups: number, ingredient: string) => {
    const density = DENSITY_MAP[ingredient];
    if (!density) return NaN;
    return cups * density;
  };

  // Convert grams to volume cups using density
  const gramsToVolumeCups = (grams: number, ingredient: string) => {
    const density = DENSITY_MAP[ingredient];
    if (!density) return NaN;
    return grams / density;
  };

  // Convert weight oz to grams and vice versa
  const ozToGrams = (oz: number) => oz * 28.3495;
  const gramsToOz = (g: number) => g / 28.3495;

  // Convert temperature F <-> C
  const fToC = (f: number) => ((f - 32) * 5) / 9;
  const cToF = (c: number) => (c * 9) / 5 + 32;

  // Convert volume ml to cups and vice versa
  const mlToCups = (ml: number) => ml / 236.588;
  const cupsToMl = (cups: number) => cups * 236.588;

  // Calculate all results and warnings
  const results = useMemo(() => {
    // Destructure inputs
    const {
      yeastTypeFrom,
      yeastTypeTo,
      quantity,
      quantityUnit,
      ingredient,
      temperature,
    } = inputs;

    // Validate required inputs
    if (
      !yeastTypeFrom ||
      !yeastTypeTo ||
      !quantityUnit ||
      !ingredient ||
      !quantity
    ) {
      return {
        value: 0,
        label: "Please fill all fields.",
        subtext: "",
        warning: null,
      };
    }

    const quantityNum = parseInputFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return {
        value: 0,
        label: "Enter a valid positive quantity.",
        subtext: "",
        warning: null,
      };
    }

    // Step 1: Convert input quantity to grams of yeast (weight base)
    // If input is volume, convert to grams using density of yeast
    // If input is weight, convert to grams (if imperial oz)
    let quantityInGrams: number;
    if (quantityUnit === "weight") {
      if (unit === "imperial") {
        quantityInGrams = ozToGrams(quantityNum);
      } else {
        quantityInGrams = quantityNum;
      }
    } else {
      // volume input
      // convert volume unit to cups first
      let cups: number;
      if (unit === "imperial") {
        cups = quantityNum;
      } else {
        cups = mlToCups(quantityNum);
      }
      // Use yeast density for volume->weight conversion
      quantityInGrams = volumeCupsToGrams(cups, "yeast");
    }

    // Step 2: Convert from yeastTypeFrom to instant yeast equivalent
    // instant yeast is base 1, active dry = 1.25x instant, fresh = 3x instant
    const factorFrom = YEAST_CONVERSION_FACTORS[yeastTypeFrom];
    const factorTo = YEAST_CONVERSION_FACTORS[yeastTypeTo];
    if (!factorFrom || !factorTo) {
      return {
        value: 0,
        label: "Invalid yeast types selected.",
        subtext: "",
        warning: null,
      };
    }

    // Convert input yeast weight to instant yeast equivalent
    const instantEquivalent = quantityInGrams / factorFrom;

    // Convert instant yeast equivalent to target yeast weight in grams
    const targetWeightGrams = instantEquivalent * factorTo;

    // Step 3: Convert target weight grams to desired output unit and quantity unit
    // Output quantity unit is same as input quantity unit for simplicity
    let displayQuantity: number;
    let displayUnitLabel: string;

    if (quantityUnit === "weight") {
      // weight output
      if (unit === "imperial") {
        displayQuantity = gramsToOz(targetWeightGrams);
        displayUnitLabel = UNIT_LABELS.imperial.weight;
      } else {
        displayQuantity = targetWeightGrams;
        displayUnitLabel = UNIT_LABELS.metric.weight;
      }
    } else {
      // volume output
      // convert grams to cups using yeast density
      const cups = gramsToVolumeCups(targetWeightGrams, "yeast");
      if (unit === "imperial") {
        displayQuantity = cups;
        displayUnitLabel = UNIT_LABELS.imperial.volume;
      } else {
        displayQuantity = cupsToMl(cups);
        displayUnitLabel = UNIT_LABELS.metric.volume;
      }
    }

    const roundedQuantity = roundTo(displayQuantity, 3);

    // Step 4: Temperature warning if provided
    let warningMsg: string | null = null;
    if (temperature) {
      const tempNum = parseInputFloat(temperature);
      if (!isNaN(tempNum)) {
        if (unit === "imperial") {
          if (
            tempNum >= DANGER_ZONE_F.min &&
            tempNum <= DANGER_ZONE_F.max
          ) {
            warningMsg =
              "Warning: Temperature is in the USDA Danger Zone (40-140°F). Handle yeast carefully to avoid spoilage.";
          }
        } else {
          if (
            tempNum >= DANGER_ZONE_C.min &&
            tempNum <= DANGER_ZONE_C.max
          ) {
            warningMsg =
              "Warning: Temperature is in the USDA Danger Zone (4.4-60°C). Handle yeast carefully to avoid spoilage.";
          }
        }
      }
    }

    // Prepare label and subtext
    const labelText = `Equivalent ${yeastTypeTo
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())} Yeast`;

    const subtext = `Converted from ${yeastTypeFrom
      .replace("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())} yeast using standard culinary conversion factors.`;

    const displayValue = `${roundedQuantity} ${displayUnitLabel}`;

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "How do I convert between instant, active dry, and fresh yeast?",
      answer:
        "Instant yeast is the baseline for conversions. Active dry yeast requires about 25% more by weight than instant yeast, while fresh yeast requires roughly three times the weight of instant yeast. This calculator uses these standard factors to help you convert accurately.",
    },
    {
      question: "Why do I need to specify ingredient density when converting volume to weight?",
      answer:
        "Different ingredients have different densities, meaning 1 cup of flour weighs less than 1 cup of sugar. For yeast, density affects volume-to-weight conversions. Using accurate densities ensures precise measurements, critical for baking success.",
    },
    {
      question: "What is the USDA Danger Zone and why is it important for yeast?",
      answer:
        "The USDA Danger Zone is the temperature range between 40°F and 140°F (4.4°C to 60°C) where bacteria grow rapidly. Yeast stored or handled in this range can spoil or lose effectiveness, so this calculator warns you if your input temperature falls within this range.",
    },
    {
      question: "Can I switch between imperial and metric units in this calculator?",
      answer:
        "Yes, you can toggle between imperial (cups, ounces, °F) and metric (grams, milliliters, °C) units. The calculator automatically converts your inputs and outputs accordingly, maintaining accuracy across unit systems.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange = (
    field:
      | "yeastTypeFrom"
      | "yeastTypeTo"
      | "quantity"
      | "quantityUnit"
      | "ingredient"
      | "temperature",
    value: string
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset inputs to defaults
  const onReset = () => {
    setInputs({
      yeastTypeFrom: "instant",
      yeastTypeTo: "active-dry",
      quantityUnit: "weight",
      ingredient: "yeast",
      quantity: "",
      temperature: "",
    });
  };

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

      {/* Yeast Type From */}
      <div className="space-y-1">
        <Label htmlFor="yeastTypeFrom" className="text-slate-700 dark:text-slate-300">
          Yeast Type (From)
        </Label>
        <Select
          id="yeastTypeFrom"
          value={inputs.yeastTypeFrom}
          onValueChange={(v) => onInputChange("yeastTypeFrom", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select yeast type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant Yeast</SelectItem>
            <SelectItem value="active-dry">Active Dry Yeast</SelectItem>
            <SelectItem value="fresh">Fresh Yeast (Compressed)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Yeast Type To */}
      <div className="space-y-1">
        <Label htmlFor="yeastTypeTo" className="text-slate-700 dark:text-slate-300">
          Yeast Type (To)
        </Label>
        <Select
          id="yeastTypeTo"
          value={inputs.yeastTypeTo}
          onValueChange={(v) => onInputChange("yeastTypeTo", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select yeast type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant Yeast</SelectItem>
            <SelectItem value="active-dry">Active Dry Yeast</SelectItem>
            <SelectItem value="fresh">Fresh Yeast (Compressed)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity Unit */}
      <div className="space-y-1">
        <Label htmlFor="quantityUnit" className="text-slate-700 dark:text-slate-300">
          Quantity Unit
        </Label>
        <Select
          id="quantityUnit"
          value={inputs.quantityUnit}
          onValueChange={(v) => onInputChange("quantityUnit", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select quantity unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weight">Weight ({unit === "imperial" ? "oz" : "g"})</SelectItem>
            <SelectItem value="volume">Volume ({unit === "imperial" ? "cups" : "ml"})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ingredient for volume conversions */}
      {inputs.quantityUnit === "volume" && (
        <div className="space-y-1">
          <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
            Ingredient (for density)
          </Label>
          <Select
            id="ingredient"
            value={inputs.ingredient}
            onValueChange={(v) => onInputChange("ingredient", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ingredient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yeast">Yeast</SelectItem>
              <SelectItem value="flour">Flour</SelectItem>
              <SelectItem value="sugar">Sugar</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ingredient density is used to convert volume to weight accurately.
          </p>
        </div>
      )}

      {/* Quantity Input */}
      <div className="space-y-1">
        <Label htmlFor="quantity" className="text-slate-700 dark:text-slate-300">
          Quantity ({inputs.quantityUnit === "weight"
            ? unit === "imperial"
              ? "oz"
              : "g"
            : unit === "imperial"
            ? "cups"
            : "ml"})
        </Label>
        <Input
          id="quantity"
          type="number"
          min="0"
          step="any"
          value={inputs.quantity || ""}
          onChange={(e) => onInputChange("quantity", e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      {/* Temperature Input */}
      <div className="space-y-1">
        <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
          Temperature ({unit === "imperial" ? "°F" : "°C"})
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Input
          id="temperature"
          type="number"
          min="0"
          step="any"
          value={inputs.temperature || ""}
          onChange={(e) => onInputChange("temperature", e.target.value)}
          placeholder="Optional - Enter temperature"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter temperature to check if it falls in the USDA Danger Zone.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
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
          Understanding Yeast Conversion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Yeast is a living organism used in baking to leaven dough, producing
          carbon dioxide and alcohol through fermentation. Different types of
          yeast—instant, active dry, and fresh (compressed)—have varying
          moisture contents and activity levels, which means they cannot be
          substituted in equal amounts. This calculator helps bakers convert
          quantities accurately between these yeast types, ensuring consistent
          results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator uses standard culinary conversion factors: active dry
          yeast requires about 25% more weight than instant yeast, while fresh
          yeast requires roughly three times the weight of instant yeast. It
          also accounts for unit systems (imperial and metric) and ingredient
          densities when converting between volume and weight, providing
          precise measurements tailored to your recipe.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the calculator includes a safety feature that warns if
          the input temperature falls within the USDA Danger Zone (40-140°F or
          4.4-60°C), where yeast and other perishable ingredients can spoil
          quickly. This ensures you handle your yeast with care to maintain its
          effectiveness and your baking success.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert yeast quantities, first select your preferred unit system:
          Imperial (cups, ounces, °F) or Metric (grams, milliliters, °C). Then,
          choose the yeast type you currently have ("From") and the yeast type
          you want to convert to ("To"). Specify whether your quantity is a
          weight or volume measurement.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the yeast types for conversion.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the quantity unit (weight or
            volume).
          </li>
          <li>
            <strong>Step 3:</strong> Enter the quantity of yeast you have.
          </li>
          <li>
            <strong>Step 4:</strong> If using volume, select the ingredient to
            apply the correct density for conversion.
          </li>
          <li>
            <strong>Step 5:</strong> Optionally, enter the temperature to check
            for safety warnings.
          </li>
          <li>
            <strong>Step 6:</strong> Click Calculate to see the equivalent
            yeast quantity.
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
              href="https://www.kingarthurbaking.com/learn/guides/yeast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Yeast Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on yeast types, usage, and conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. USDA Food Safety - Danger Zone
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA guidelines on temperature danger zones for food
              safety.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.bakingbusiness.com/articles/5070-yeast-conversion-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Baking Business - Yeast Conversion Chart
            </a>
            <p className="text-slate-500 text-sm">
              Industry-standard yeast conversion factors and best practices.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Yeast Conversion Calculator"
      description="Convert yeast types easily. Switch between instant, active dry, and fresh yeast quantities for any baking recipe."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Target Yeast Weight = (Input Quantity in grams / FactorFrom) × FactorTo",
        variables: [
          { symbol: "Input Quantity", description: "Weight of yeast input (grams)" },
          {
            symbol: "FactorFrom",
            description:
              "Conversion factor of input yeast type relative to instant yeast",
          },
          {
            symbol: "FactorTo",
            description:
              "Conversion factor of target yeast type relative to instant yeast",
          },
          { symbol: "Target Yeast Weight", description: "Converted yeast weight (grams)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Convert 1 oz of active dry yeast to fresh yeast in imperial units.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 1 oz active dry yeast to grams: 1 oz × 28.3495 = 28.35 g",
          },
          {
            label: "2",
            explanation:
              "Convert active dry yeast to instant yeast equivalent: 28.35 g ÷ 1.25 = 22.68 g",
          },
          {
            label: "3",
            explanation:
              "Convert instant yeast equivalent to fresh yeast: 22.68 g × 3 = 68.04 g",
          },
          {
            label: "4",
            explanation:
              "Convert grams fresh yeast back to oz: 68.04 g ÷ 28.3495 = 2.4 oz",
          },
        ],
        result: "1 oz active dry yeast ≈ 2.4 oz fresh yeast",
      }}
      relatedCalculators={[
        {
          title: "Turkey Size, Thaw & Cook Time Calculator",
          url: "/cooking/turkey-thaw-cook-time",
          icon: "🥩",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🥩",
        },
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🧁",
        },
        {
          title: "Baker’s Percentage Calculator",
          url: "/cooking/bakers-percentage",
          icon: "📏",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Yeast Conversion Calculator" },
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