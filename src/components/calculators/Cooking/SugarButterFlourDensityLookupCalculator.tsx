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

export default function SugarButterFlourDensityLookupCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: string;
    amount?: string;
    fromUnit?: string;
    toUnit?: string;
  }>({
    ingredient: "flour_ap",
    amount: "",
    fromUnit: "cups",
    toUnit: unit === "imperial" ? "grams" : "grams",
  });

  // 2. INGREDIENT DENSITIES (grams per cup)
  // Source references: King Arthur Baking, Serious Eats, USDA
  const densityMap: Record<
    string,
    { imperial: number; metric: number; displayName: string }
  > = {
    flour_ap: { imperial: 120, metric: 120, displayName: "All-Purpose Flour" },
    sugar_granulated: { imperial: 200, metric: 200, displayName: "Granulated Sugar" },
    butter: { imperial: 227, metric: 227, displayName: "Butter (unsalted)" }, // 1 cup butter = 227g (2 sticks)
    water: { imperial: 236, metric: 236, displayName: "Water" },
    rice_white: { imperial: 195, metric: 195, displayName: "White Rice (uncooked)" },
    rice_basmati: { imperial: 190, metric: 190, displayName: "Basmati Rice (uncooked)" },
    rice_jasmine: { imperial: 195, metric: 195, displayName: "Jasmine Rice (uncooked)" },
    rice_brown: { imperial: 195, metric: 195, displayName: "Brown Rice (uncooked)" },
  };

  // 3. UNIT OPTIONS
  const volumeUnits = unit === "imperial" ? ["cups", "tablespoons", "teaspoons"] : ["milliliters"];
  const weightUnits = unit === "imperial" ? ["grams", "ounces", "pounds"] : ["grams", "kilograms"];

  // Conversion factors
  const volumeToCups = {
    cups: 1,
    tablespoons: 1 / 16,
    teaspoons: 1 / 48,
    milliliters: 1 / 236.588,
  };

  const weightToGrams = {
    grams: 1,
    ounces: 28.3495,
    pounds: 453.592,
    kilograms: 1000,
  };

  // 4. LOGIC ENGINE
  const results = useMemo(() => {
    if (
      !inputs.ingredient ||
      !inputs.amount ||
      !inputs.fromUnit ||
      !inputs.toUnit
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const amountNum = parseFloat(inputs.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return {
        value: 0,
        label: "Please enter a valid positive number for amount.",
        subtext: "",
        warning: null,
      };
    }

    const ingredientDensity = densityMap[inputs.ingredient];
    if (!ingredientDensity) {
      return {
        value: 0,
        label: "Unknown ingredient selected.",
        subtext: "",
        warning: null,
      };
    }

    // Determine if fromUnit is volume or weight
    const fromIsVolume = volumeUnits.includes(inputs.fromUnit);
    const toIsVolume = volumeUnits.includes(inputs.toUnit);

    // Convert input amount to base units:
    // For volume inputs, convert to cups
    // For weight inputs, convert to grams
    let baseVolumeCups = 0;
    let baseWeightGrams = 0;

    if (fromIsVolume) {
      // Convert from input volume unit to cups
      const cups = amountNum * (volumeToCups as any)[inputs.fromUnit];
      baseVolumeCups = cups;
      // Convert cups to grams using density
      baseWeightGrams = cups * ingredientDensity.grams;
    } else {
      // Weight input: convert to grams
      const grams = amountNum * (weightToGrams as any)[inputs.fromUnit];
      baseWeightGrams = grams;
      // Convert grams to cups using density
      baseVolumeCups = grams / ingredientDensity.grams;
    }

    // Now convert base units to desired output unit
    let resultValue = 0;
    let resultLabel = "";
    let subtext = "";
    let warning = null;

    if (toIsVolume) {
      // Convert cups to desired volume unit
      const volumeUnitFactor = (volumeToCups as any)[inputs.toUnit];
      // cups / volumeUnitFactor = amount in desired volume unit
      resultValue = baseVolumeCups / volumeUnitFactor;
      resultLabel = `${inputs.toUnit}`;
      subtext = `Converted ${ingredientDensity.displayName} from ${inputs.amount} ${inputs.fromUnit} to ${resultValue.toFixed(
        2
      )} ${inputs.toUnit}.`;
    } else {
      // Convert grams to desired weight unit
      const weightUnitFactor = (weightToGrams as any)[inputs.toUnit];
      resultValue = baseWeightGrams / weightUnitFactor;
      resultLabel = `${inputs.toUnit}`;
      subtext = `Converted ${ingredientDensity.displayName} from ${inputs.amount} ${inputs.fromUnit} to ${resultValue.toFixed(
        2
      )} ${inputs.toUnit}.`;
    }

    return {
      value: resultValue.toFixed(2),
      label: resultLabel,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 5. HANDLERS
  function handleInputChange(
    field: "ingredient" | "amount" | "fromUnit" | "toUnit",
    value: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // When unit system changes, reset from/to units accordingly
  function handleUnitChange(newUnit: "imperial" | "metric") {
    setUnit(newUnit);
    setInputs((prev) => ({
      ...prev,
      fromUnit: newUnit === "imperial" ? "cups" : "milliliters",
      toUnit: newUnit === "imperial" ? "grams" : "grams",
    }));
  }

  // 6. FAQS
  const faqs = [
    {
      question: "Why is ingredient density important in baking?",
      answer:
        "Ingredient density varies significantly between items like flour, sugar, and butter, affecting weight-to-volume conversions. Accurate density ensures precise measurements, leading to consistent baking results. Using weight rather than volume is recommended for best accuracy.",
    },
    {
      question: "Can I substitute butter with margarine using this tool?",
      answer:
        "Butter and margarine have similar densities but differ in water and fat content, which affects baking outcomes. This tool converts volume to weight accurately but does not account for compositional differences. Adjust recipes accordingly for best results.",
    },
    {
      question: "Why do baking recipes prefer weight measurements over volume?",
      answer:
        "Weight measurements eliminate variability caused by ingredient packing and humidity. Measuring by weight ensures consistent ingredient ratios, improving recipe reliability and final product quality. This tool helps convert volume to weight for better accuracy.",
    },
    {
      question: "Are the density values the same for sifted and packed flour?",
      answer:
        "No, sifted flour is lighter and less dense than packed flour. This tool uses standard all-purpose flour density (~120g per cup) which approximates sifted flour. For packed flour, densities can be higher, so adjust measurements accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 7. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={handleUnitChange}>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
            Ingredient
          </Label>
          <Select
            id="ingredient"
            value={inputs.ingredient}
            onValueChange={(val) => handleInputChange("ingredient", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(densityMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {val.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div>
          <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            min={0}
            step="any"
            placeholder="Enter amount"
            value={inputs.amount || ""}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>

        {/* From Unit Select */}
        <div>
          <Label htmlFor="fromUnit" className="text-slate-700 dark:text-slate-300">
            From Unit
          </Label>
          <Select
            id="fromUnit"
            value={inputs.fromUnit}
            onValueChange={(val) => handleInputChange("fromUnit", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {volumeUnits.map((v) => (
                <SelectItem key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </SelectItem>
              ))}
              {weightUnits.map((w) => (
                <SelectItem key={w} value={w}>
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* To Unit Select */}
        <div>
          <Label htmlFor="toUnit" className="text-slate-700 dark:text-slate-300">
            To Unit
          </Label>
          <Select
            id="toUnit"
            value={inputs.toUnit}
            onValueChange={(val) => handleInputChange("toUnit", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {volumeUnits.map((v) => (
                <SelectItem key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </SelectItem>
              ))}
              {weightUnits.map((w) => (
                <SelectItem key={w} value={w}>
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredient: "flour_ap",
              amount: "",
              fromUnit: unit === "imperial" ? "cups" : "milliliters",
              toUnit: unit === "imperial" ? "grams" : "grams",
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
              This ensures consistent ingredient ratios and better results.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 8. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Sugar/Butter/Flour Density Lookup
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Accurate measurement of ingredients like sugar, butter, and flour is
          fundamental to successful baking. Unlike liquids, these solids have
          varying densities, meaning that volume measurements such as cups do
          not directly translate to weight. This lookup tool uses trusted
          density values to convert between volume and weight units precisely,
          ensuring your recipes turn out perfectly every time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          For example, one cup of all-purpose flour weighs approximately 120
          grams, while one cup of granulated sugar weighs about 200 grams. Butter
          is denser, with one cup equaling roughly 227 grams. These differences
          are critical when scaling recipes or substituting ingredients. Using
          weight measurements reduces variability caused by packing or humidity.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool allows you to convert between volume and weight units for
          common baking ingredients. Select your ingredient, enter the amount,
          choose the units you have, and select the units you want to convert
          to. Click calculate to get an accurate conversion based on ingredient
          density.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the ingredient (flour, sugar,
            butter, etc.).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the amount you have (e.g., 1.5 cups).
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit you are converting from and
            the unit you want to convert to.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the precise weight
            or volume equivalent.
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
              href="https://www.kingarthurbaking.com/learn/ingredient-weight-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking Ingredient Weight Chart
            </a>
            <p className="text-slate-500 text-sm">
              Provides trusted ingredient densities and weight conversions for
              baking essentials.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/ingredient-weight-volume-conversions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats Volume to Weight Conversions
            </a>
            <p className="text-slate-500 text-sm">
              Detailed analysis of ingredient densities and measurement tips.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA Food Safety and Inspection Service
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative source for food safety standards and guidelines.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Result = Input × (Density of Ingredient in grams per cup) × (Conversion factor between units)",
        variables: [
          { symbol: "Input", description: "Amount in original units" },
          { symbol: "Result", description: "Converted amount in target units" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Convert 1.5 cups of all-purpose flour to grams using standard density.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the density of all-purpose flour: 120 grams per cup.",
          },
          {
            label: "2",
            explanation:
              "Multiply 1.5 cups × 120 grams/cup = 180 grams.",
          },
        ],
        result: "1.5 cups of all-purpose flour equals 180 grams.",
      }}
      relatedCalculators={[
        {
          title: "Baker’s Percentage Calculator",
          url: "/cooking/bakers-percentage",
          icon: "🍳",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍞",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "🧁",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "📏",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Sugar/Butter/Flour Density Lookup" },
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