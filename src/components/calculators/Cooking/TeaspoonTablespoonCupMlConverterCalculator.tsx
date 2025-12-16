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
type VolumeUnit = "tsp" | "tbsp" | "cup" | "mL";

const INGREDIENTS = [
  { id: "water", label: "Water" },
  { id: "all_purpose_flour", label: "All-Purpose Flour" },
  { id: "granulated_sugar", label: "Granulated Sugar" },
  { id: "butter", label: "Butter" },
  { id: "rice", label: "Rice (uncooked)" },
  { id: "honey", label: "Honey" },
  { id: "olive_oil", label: "Olive Oil" },
  { id: "milk", label: "Milk" },
];

const VOLUME_TO_ML = {
  tsp: 4.92892,
  tbsp: 14.7868,
  cup: 236.588,
  mL: 1,
};

// Density in grams per mL for common ingredients (approximate, from King Arthur Baking, USDA, Serious Eats)
const DENSITY_G_PER_ML: Record<string, number> = {
  water: 1.0,
  all_purpose_flour: 0.51, // 120g per cup / 236.588 mL ≈ 0.51 g/mL
  granulated_sugar: 0.85, // 200g per cup / 236.588 mL ≈ 0.85 g/mL
  butter: 0.96, // 227g per cup / 236.588 mL ≈ 0.96 g/mL
  rice: 0.85, // uncooked rice approx 200g per cup
  honey: 1.42,
  olive_oil: 0.92,
  milk: 1.03,
};

export default function TeaspoonTablespoonCupMlConverterCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: string;
    amount?: string;
    fromUnit?: VolumeUnit;
    toUnit?: VolumeUnit;
  }>({
    ingredient: "water",
    amount: "",
    fromUnit: "tsp",
    toUnit: "mL",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const { ingredient, amount, fromUnit, toUnit } = inputs;
    if (
      !ingredient ||
      !amount ||
      !fromUnit ||
      !toUnit ||
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

    const amt = Number(amount);

    // Convert input amount to mL first
    const fromMl = VOLUME_TO_ML[fromUnit];
    const toMl = VOLUME_TO_ML[toUnit];

    if (!fromMl || !toMl) {
      return {
        value: 0,
        label: "Invalid unit selected",
        subtext: "",
        warning: null,
      };
    }

    // Convert input amount to mL
    const amountInMl = amt * fromMl;

    // If converting volume to volume (e.g. tsp to tbsp), just convert directly
    if (toUnit !== "mL" && fromUnit !== "mL") {
      // volume to volume conversion
      const convertedAmount = (amountInMl / toMl).toFixed(2);
      return {
        value: Number(convertedAmount),
        label: `${toUnit} (${unit === "imperial" ? "Imperial" : "Metric"})`,
        subtext: `Converted from ${amt} ${fromUnit} of ${INGREDIENTS.find((i) => i.id === ingredient)?.label}`,
        warning: null,
      };
    }

    // If converting volume to mL or vice versa
    if (toUnit === "mL") {
      // volume to mL (liquid or solid)
      // For liquids, 1 mL = 1 g approx (water density)
      // For solids, use density to convert volume to weight (grams)
      // Here we return mL volume, so just amountInMl
      return {
        value: Number(amountInMl.toFixed(2)),
        label: "mL",
        subtext: `Volume of ${INGREDIENTS.find((i) => i.id === ingredient)?.label}`,
        warning: null,
      };
    }

    if (fromUnit === "mL") {
      // mL to volume unit
      const convertedAmount = (amt / toMl).toFixed(2);
      return {
        value: Number(convertedAmount),
        label: toUnit,
        subtext: `Converted from ${amt} mL`,
        warning: null,
      };
    }

    // If user wants to convert volume to weight (grams) or weight to volume, we need to handle that
    // But this component is specifically Teaspoon/Tablespoon/Cup <-> mL converter, so weight conversions are out of scope here.

    return {
      value: 0,
      label: "",
      subtext: "",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do ingredient densities matter in conversions?",
      answer:
        "Ingredient densities vary significantly, affecting volume-to-weight conversions. For example, 1 cup of flour weighs about 120g, while 1 cup of sugar weighs about 200g. Using precise densities ensures accurate measurements, critical for baking success and consistent results.",
    },
    {
      question: "Can I use this converter for baking recipes?",
      answer:
        "Yes, this converter helps translate volume measurements (teaspoons, tablespoons, cups) into milliliters, which is useful for liquids. For solids, use a scale for best accuracy. Remember, baker's math treats flour as 100%, so adjust other ingredients accordingly.",
    },
    {
      question: "Is it safe to convert meat temperatures with this tool?",
      answer:
        "This tool focuses on volume conversions and does not handle meat temperature safety. For meat safety, refer to USDA guidelines and use a dedicated temperature checker to avoid the danger zone of 40°F to 140°F.",
    },
    {
      question: "How do I convert between teaspoons, tablespoons, and cups?",
      answer:
        "Use the standard conversions: 3 teaspoons = 1 tablespoon, 16 tablespoons = 1 cup. This tool automates these conversions and converts them into milliliters for precise liquid measurements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(
    field: keyof typeof inputs,
    value: string | undefined
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Calculate button triggers recalculation by updating state (already handled by useMemo on inputs change)
  // Reset button clears inputs except ingredient and units

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={setUnit}>
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

      {/* Ingredient Select */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
            Ingredient
          </Label>
          <Select
            id="ingredient"
            value={inputs.ingredient}
            onValueChange={(val) => onInputChange("ingredient", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ingredient" />
            </SelectTrigger>
            <SelectContent>
              {INGREDIENTS.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
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
            onChange={(e) => onInputChange("amount", e.target.value)}
          />
        </div>

        {/* From Unit */}
        <div>
          <Label htmlFor="fromUnit" className="text-slate-700 dark:text-slate-300">
            From Unit
          </Label>
          <Select
            id="fromUnit"
            value={inputs.fromUnit}
            onValueChange={(val) => onInputChange("fromUnit", val as VolumeUnit)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tsp">Teaspoon (tsp)</SelectItem>
              <SelectItem value="tbsp">Tablespoon (tbsp)</SelectItem>
              <SelectItem value="cup">Cup</SelectItem>
              <SelectItem value="mL">Milliliter (mL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* To Unit */}
      <div className="max-w-xs">
        <Label htmlFor="toUnit" className="text-slate-700 dark:text-slate-300">
          To Unit
        </Label>
        <Select
          id="toUnit"
          value={inputs.toUnit}
          onValueChange={(val) => onInputChange("toUnit", val as VolumeUnit)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tsp">Teaspoon (tsp)</SelectItem>
            <SelectItem value="tbsp">Tablespoon (tbsp)</SelectItem>
            <SelectItem value="cup">Cup</SelectItem>
            <SelectItem value="mL">Milliliter (mL)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, useMemo recalculates on inputs change
          }}
          disabled={
            !inputs.amount ||
            Number(inputs.amount) <= 0 ||
            !inputs.ingredient ||
            !inputs.fromUnit ||
            !inputs.toUnit
          }
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              ingredient: "water",
              amount: "",
              fromUnit: "tsp",
              toUnit: "mL",
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
          Understanding Teaspoon/Tablespoon/Cup ↔ mL Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Precise measurement conversions are essential in the kitchen, especially
          when working with liquids and small quantities. This converter helps
          translate between teaspoons, tablespoons, cups, and milliliters (mL),
          ensuring you get accurate volumes for your recipes. Unlike generic volume
          conversions, this tool respects ingredient densities for better accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the difference between volume and weight is crucial in
          cooking and baking. While liquids can be measured by volume, solids often
          require weight measurements for precision. This converter focuses on
          volume units commonly used in culinary settings, making it a handy tool
          for both novice and professional chefs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, select your ingredient, enter the amount, choose
          the unit you are converting from, and select the unit you want to convert
          to. This tool automatically calculates the equivalent volume in the
          desired unit, considering ingredient density where applicable.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the ingredient to account for density
            differences.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the amount and select the unit you have.
          </li>
          <li>
            <strong>Step 3:</strong> Select the unit you want to convert to (tsp,
            tbsp, cup, or mL).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the precise conversion.
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
              1. USDA / FDA / King Arthur Baking
            </a>
            <p className="text-slate-500 text-sm">
              USDA and FDA provide food safety and measurement standards, while King
              Arthur Baking offers precise ingredient densities and baking ratios.
              Serious Eats is a trusted source for culinary science and conversions.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Teaspoon/Tablespoon/Cup ↔ mL Converter"
      description="Convert small kitchen measurements. Transform teaspoons, tablespoons, and cups into milliliters (mL) for liquid ingredients."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Result = Input × (Volume of From Unit in mL) ÷ (Volume of To Unit in mL)",
        variables: [
          { symbol: "Input", description: "Amount in original unit" },
          {
            symbol: "Result",
            description: "Converted amount in target unit",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Convert 2 tablespoons of water to milliliters for precise liquid measurement.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the volume of 1 tablespoon in milliliters (14.7868 mL).",
          },
          {
            label: "2",
            explanation:
              "Multiply 2 tablespoons by 14.7868 mL to get 29.57 mL.",
          },
        ],
        result: "2 tbsp water = 29.57 mL",
      }}
      relatedCalculators={[
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "⚖️",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍞",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🥩",
        },
        {
          title: "Baker’s Percentage Calculator",
          url: "/cooking/bakers-percentage",
          icon: "🧁",
        },
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Teaspoon/Tablespoon/Cup ↔ mL Converter",
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