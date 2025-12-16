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

const INGREDIENT_DENSITIES = {
  // grams per cup (US customary cup)
  flour_ap: 120,
  flour_wholewheat: 130,
  sugar_granulated: 200,
  sugar_brown: 220,
  butter: 227, // 1 cup butter = 227g (1 stick = 113.5g)
  water: 236,
  rice_white: 195,
  rice_basmati: 185,
  rice_jasmine: 190,
  salt_table: 273,
  honey: 340,
  milk: 245,
  oil_vegetable: 218,
};

const INGREDIENT_LABELS = {
  flour_ap: "All-Purpose Flour",
  flour_wholewheat: "Whole Wheat Flour",
  sugar_granulated: "Granulated Sugar",
  sugar_brown: "Brown Sugar (packed)",
  butter: "Butter",
  water: "Water",
  rice_white: "White Rice",
  rice_basmati: "Basmati Rice",
  rice_jasmine: "Jasmine Rice",
  salt_table: "Table Salt",
  honey: "Honey",
  milk: "Milk",
  oil_vegetable: "Vegetable Oil",
};

export default function VolumeWeightFoodDensityCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: string;
    amount?: string;
    fromUnit?: "volume" | "weight";
    toUnit?: "volume" | "weight";
  }>({
    ingredient: "flour_ap",
    amount: "",
    fromUnit: "volume",
    toUnit: "weight",
  });

  // Helper to parse float safely
  const parseAmount = (val?: string) => {
    if (!val) return NaN;
    return parseFloat(val.replace(",", "."));
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { ingredient, amount, fromUnit, toUnit } = inputs;
    if (
      !ingredient ||
      !amount ||
      !fromUnit ||
      !toUnit ||
      isNaN(parseAmount(amount)) ||
      parseAmount(amount) <= 0
    ) {
      return {
        value: 0,
        label: "Result",
        subtext: null,
        warning: null,
      };
    }

    const amt = parseAmount(amount);
    const density_g_per_cup = INGREDIENT_DENSITIES[ingredient];
    if (!density_g_per_cup) {
      return {
        value: 0,
        label: "Unknown Ingredient Density",
        subtext: "Please select a valid ingredient.",
        warning: null,
      };
    }

    // Conversion logic:
    // Units:
    // Imperial volume = cups
    // Imperial weight = lbs
    // Metric volume = ml
    // Metric weight = grams or kg

    // 1 cup = 236.588 ml (approx)
    const CUP_TO_ML = 236.588;
    const GRAMS_IN_LB = 453.592;

    let resultValue = 0;
    let resultLabel = "";
    let subtext = null;
    let warning = null;

    // From volume to weight
    if (fromUnit === "volume" && toUnit === "weight") {
      if (unit === "imperial") {
        // cups to lbs
        // grams = cups * density_g_per_cup
        // lbs = grams / 453.592
        const grams = amt * density_g_per_cup;
        const lbs = grams / GRAMS_IN_LB;
        resultValue = lbs;
        resultLabel = `Weight in Pounds (${INGREDIENT_LABELS[ingredient]})`;
        subtext = `${amt} cup${amt !== 1 ? "s" : ""} of ${
          INGREDIENT_LABELS[ingredient]
        } ≈ ${grams.toFixed(1)} grams`;
      } else {
        // metric: ml to grams
        // cups to ml = amt / (1 cup in ml) * ml
        // but input is ml? No, input is volume, so in metric, input is ml
        // So we must convert ml to cups to use density
        // grams = (ml / 236.588) * density_g_per_cup
        const grams = (amt / CUP_TO_ML) * density_g_per_cup;
        resultValue = grams;
        resultLabel = `Weight in Grams (${INGREDIENT_LABELS[ingredient]})`;
        subtext = `${amt} ml of ${INGREDIENT_LABELS[ingredient]} ≈ ${grams.toFixed(
          1
        )} grams`;
      }
    }
    // From weight to volume
    else if (fromUnit === "weight" && toUnit === "volume") {
      if (unit === "imperial") {
        // lbs to cups
        // grams = lbs * 453.592
        // cups = grams / density_g_per_cup
        const grams = amt * GRAMS_IN_LB;
        const cups = grams / density_g_per_cup;
        resultValue = cups;
        resultLabel = `Volume in Cups (${INGREDIENT_LABELS[ingredient]})`;
        subtext = `${amt} lb${amt !== 1 ? "s" : ""} of ${
          INGREDIENT_LABELS[ingredient]
        } ≈ ${grams.toFixed(1)} grams`;
      } else {
        // grams to ml
        // cups = grams / density_g_per_cup
        // ml = cups * 236.588
        const cups = amt / density_g_per_cup;
        const ml = cups * CUP_TO_ML;
        resultValue = ml;
        resultLabel = `Volume in Milliliters (${INGREDIENT_LABELS[ingredient]})`;
        subtext = `${amt} grams of ${INGREDIENT_LABELS[ingredient]} ≈ ${ml.toFixed(
          1
        )} ml`;
      }
    } else if (fromUnit === toUnit) {
      // Same units selected
      resultValue = amt;
      resultLabel = `Same units selected, no conversion`;
      subtext = null;
    } else {
      // Unsupported conversion
      resultValue = 0;
      resultLabel = "Unsupported conversion";
      subtext = null;
    }

    return {
      value:
        typeof resultValue === "number"
          ? unit === "imperial" && (toUnit === "weight" || fromUnit === "weight")
            ? resultValue.toFixed(3)
            : resultValue.toFixed(1)
          : resultValue,
      label: resultLabel,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do ingredient densities vary for volume to weight conversions?",
      answer:
        "Ingredient densities differ due to particle size, moisture content, and packing method. For example, 1 cup of flour weighs about 120g, while 1 cup of sugar weighs about 200g. Using specific densities ensures precise baking and cooking results.",
    },
    {
      question: "How does baker's math affect ingredient ratios?",
      answer:
        "Baker's math sets flour as 100%, calculating other ingredients as percentages of flour weight. This method ensures consistent dough hydration and ingredient balance, crucial for sourdough and professional baking.",
    },
    {
      question: "What is the USDA safe temperature range for cooking meat?",
      answer:
        "The USDA defines the 'Danger Zone' as 40°F to 140°F (4°C to 60°C), where bacteria multiply rapidly. Meat should be cooked above this range and held safely to prevent foodborne illness.",
    },
    {
      question: "Why is weighing ingredients preferred over volume measurements?",
      answer:
        "Weighing ingredients provides accuracy and consistency, eliminating variations caused by packing, humidity, or measuring technique. Professional chefs and bakers rely on scales for precise results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  const handleInputChange = (
    field: keyof typeof inputs,
    value: string | undefined
  ) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as "imperial" | "metric")}>
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
      <div className="space-y-2">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Ingredient
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient}
          onValueChange={(v) => handleInputChange("ingredient", v)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INGREDIENT_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="any"
          placeholder={
            inputs.fromUnit === "volume"
              ? unit === "imperial"
                ? "Cups"
                : "Milliliters"
              : unit === "imperial"
              ? "Pounds"
              : "Grams"
          }
          value={inputs.amount ?? ""}
          onChange={(e) => handleInputChange("amount", e.target.value)}
        />
      </div>

      {/* From/To Select */}
      <div className="flex gap-4 max-w-xs">
        <div className="flex-1 space-y-2">
          <Label htmlFor="fromUnit" className="text-slate-700 dark:text-slate-300">
            From
          </Label>
          <Select
            id="fromUnit"
            value={inputs.fromUnit}
            onValueChange={(v) => handleInputChange("fromUnit", v as "volume" | "weight")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">
                {unit === "imperial" ? "Volume (Cups)" : "Volume (Milliliters)"}
              </SelectItem>
              <SelectItem value="weight">
                {unit === "imperial" ? "Weight (Pounds)" : "Weight (Grams)"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="toUnit" className="text-slate-700 dark:text-slate-300">
            To
          </Label>
          <Select
            id="toUnit"
            value={inputs.toUnit}
            onValueChange={(v) => handleInputChange("toUnit", v as "volume" | "weight")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">
                {unit === "imperial" ? "Volume (Cups)" : "Volume (Milliliters)"}
              </SelectItem>
              <SelectItem value="weight">
                {unit === "imperial" ? "Weight (Pounds)" : "Weight (Grams)"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-xs">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
          disabled={
            !inputs.amount ||
            !inputs.ingredient ||
            !inputs.fromUnit ||
            !inputs.toUnit ||
            isNaN(parseAmount(inputs.amount))
          }
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredient: "flour_ap",
              amount: "",
              fromUnit: "volume",
              toUnit: "weight",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 max-w-md">
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
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12 max-w-3xl">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Volume ↔ Weight Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In culinary arts, precise measurement of ingredients is essential for
          consistent and successful results. Volume measurements like cups and
          milliliters are common in home kitchens, but they can be inaccurate
          for certain ingredients due to varying densities and packing methods.
          This converter bridges the gap by translating volume to weight using
          ingredient-specific densities, ensuring accuracy in recipes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Weight measurements, especially in grams, are preferred by professional
          chefs and bakers because they eliminate variability caused by
          scooping or settling. Our tool incorporates trusted density values from
          sources like King Arthur Baking and Serious Eats to provide reliable
          conversions for common ingredients such as flour, sugar, butter, and
          rice.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are scaling a recipe, adjusting hydration in bread dough,
          or ensuring food safety by precise cooking temperatures, understanding
          the relationship between volume and weight is fundamental to culinary
          success.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This converter allows you to select an ingredient, input an amount, and
          convert between volume and weight units in either imperial or metric
          systems. Follow these steps to get accurate results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose your preferred unit system (Imperial
            or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Select the ingredient you want to convert.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the amount and specify whether it is a
            volume or weight measurement.
          </li>
          <li>
            <strong>Step 4:</strong> Select the unit type you want to convert to
            (volume or weight).
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to see the precise
            conversion based on ingredient density.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Remember, for baking, weighing ingredients yields the best consistency.
          Use this tool to convert recipes or scale ingredients confidently.
        </p>
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
              1. USDA / FDA / King Arthur Baking
            </a>
            <p className="text-slate-500 text-sm">
              Trusted sources for food safety standards, ingredient densities, and
              baking ratios. King Arthur Baking provides precise ingredient weights
              for baking, while USDA and FDA offer food safety guidelines.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats
            </a>
            <p className="text-slate-500 text-sm">
              A respected culinary resource offering detailed ingredient density
              charts and cooking science explanations to improve kitchen precision.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Volume ↔ Weight Converter"
      description="Calculate food density conversions. Translate volume measurements to weight for precise cooking using common ingredient densities."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Weight = Volume × Ingredient Density (grams per cup) or Volume = Weight ÷ Ingredient Density",
        variables: [
          { symbol: "Volume", description: "Ingredient volume (cups or ml)" },
          { symbol: "Weight", description: "Ingredient weight (grams or pounds)" },
          {
            symbol: "Ingredient Density",
            description: "Grams per cup specific to ingredient",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Convert 2 cups of all-purpose flour to weight in grams (metric system).",
        steps: [
          {
            label: "1",
            explanation:
              "Use the density for all-purpose flour: 120 grams per cup.",
          },
          {
            label: "2",
            explanation:
              "Multiply volume by density: 2 cups × 120 g/cup = 240 grams.",
          },
        ],
        result: "2 cups of all-purpose flour ≈ 240 grams.",
      }}
      relatedCalculators={[
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🍳",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
        {
          title: "Baker’s Percentage Calculator",
          url: "/cooking/bakers-percentage",
          icon: "🥩",
        },
        {
          title: "Stock/Broth Reduction Time & Yield",
          url: "/cooking/stock-broth-reduction-time-yield",
          icon: "🧁",
        },
        {
          title: "Turkey Size, Thaw & Cook Time Calculator",
          url: "/cooking/turkey-thaw-cook-time",
          icon: "🥩",
        },
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Volume ↔ Weight Converter" },
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