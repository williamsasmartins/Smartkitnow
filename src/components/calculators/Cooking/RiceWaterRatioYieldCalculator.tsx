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

const riceTypes = [
  { label: "Basmati", ratio: 1.5, density: 185 }, // density g/cup raw rice
  { label: "Jasmine", ratio: 1.25, density: 190 },
  { label: "Brown", ratio: 2.0, density: 195 },
  { label: "Sushi", ratio: 1.3, density: 180 },
];

// Density map for rice and water (g per cup)
const densityMap = {
  rice: {
    Basmati: 185,
    Jasmine: 190,
    Brown: 195,
    Sushi: 180,
  },
  water: 236, // g per cup water (approximate)
};

export default function RiceWaterRatioYieldCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    riceType?: string;
    riceAmount?: string; // string to allow empty input
    riceAmountUnit?: "cups" | "grams";
  }>({
    riceType: "Basmati",
    riceAmount: "",
    riceAmountUnit: "cups",
  });

  // Handle input changes
  function onRiceTypeChange(value: string) {
    setInputs((prev) => ({ ...prev, riceType: value }));
  }
  function onRiceAmountChange(value: string) {
    // Allow only numbers and decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, riceAmount: value }));
    }
  }
  function onRiceAmountUnitChange(value: "cups" | "grams") {
    setInputs((prev) => ({ ...prev, riceAmountUnit: value }));
  }

  // Calculation logic
  const results = useMemo(() => {
    const riceType = inputs.riceType ?? "Basmati";
    const riceAmountRaw = inputs.riceAmount ?? "";
    const riceAmountUnit = inputs.riceAmountUnit ?? "cups";

    // Validation
    if (!riceAmountRaw || Number(riceAmountRaw) <= 0) {
      return {
        value: 0,
        label: "Enter rice amount",
        subtext: "",
        warning: null,
      };
    }

    const riceAmountNum = Number(riceAmountRaw);

    // Get rice density and ratio
    const riceInfo = riceTypes.find((r) => r.label === riceType);
    if (!riceInfo) {
      return {
        value: 0,
        label: "Select a valid rice type",
        subtext: "",
        warning: null,
      };
    }

    const riceDensity = riceInfo.density; // g/cup raw rice
    const waterRatio = riceInfo.ratio; // cups water per cup rice

    // Convert rice amount to cups (if input is grams)
    let riceCups: number;
    if (riceAmountUnit === "cups") {
      riceCups = riceAmountNum;
    } else {
      // grams to cups
      riceCups = riceAmountNum / riceDensity;
    }

    // Calculate water needed in cups
    const waterCups = riceCups * waterRatio;

    // Calculate yield: cooked rice approx 3x raw rice volume (approximate)
    // Yield volume in cups
    const cookedYieldCups = riceCups * 3;

    // Convert results to selected unit system
    // Imperial: cups, °F; Metric: grams, °C
    // For rice and water weight, use density

    // Rice weight in grams
    const riceWeightGrams = riceCups * riceDensity;
    // Water weight in grams
    const waterWeightGrams = waterCups * densityMap.water;
    // Cooked rice weight approx rice + water (some water absorbed, some evaporated, but approx sum)
    const cookedWeightGrams = riceWeightGrams + waterWeightGrams;

    // Prepare display strings
    let riceDisplay: string;
    let waterDisplay: string;
    let yieldDisplay: string;

    if (unit === "imperial") {
      riceDisplay = `${riceCups.toFixed(2)} cup${riceCups !== 1 ? "s" : ""} raw rice`;
      waterDisplay = `${waterCups.toFixed(2)} cup${waterCups !== 1 ? "s" : ""} water`;
      yieldDisplay = `${cookedYieldCups.toFixed(2)} cup${cookedYieldCups !== 1 ? "s" : ""} cooked rice (approx.)`;
    } else {
      riceDisplay = `${riceWeightGrams.toFixed(0)} g raw rice`;
      waterDisplay = `${waterWeightGrams.toFixed(0)} g water`;
      yieldDisplay = `${cookedWeightGrams.toFixed(0)} g cooked rice (approx.)`;
    }

    // Chef tip subtext
    const subtext = `Using ${riceType} rice with a ratio of ${waterRatio}:1 (water to rice).`;

    // No warnings needed for this calculator specifically
    const warningMsg = null;

    // Compose final value string for main display
    const value = `${riceDisplay} + ${waterDisplay} → ${yieldDisplay}`;

    return {
      value,
      label: "Rice & Water Amounts and Yield",
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "What is the ideal rice to water ratio for different rice types?",
      answer:
        "Different rice varieties require different water ratios for optimal cooking. For example, Basmati rice typically uses 1.5 cups of water per cup of rice, while Brown rice needs about 2 cups of water per cup of rice. Using the correct ratio ensures the rice cooks evenly and achieves the desired texture.",
    },
    {
      question: "Can I use weight instead of volume for measuring rice and water?",
      answer:
        "Yes, measuring by weight is often more precise. This calculator supports both volume (cups) and weight (grams) inputs. Using a digital scale helps maintain consistency, especially when cooking different rice types or adjusting recipes.",
    },
    {
      question: "How accurate is the cooked rice yield estimate?",
      answer:
        "Cooked rice yield is estimated as roughly three times the volume of raw rice, accounting for water absorption. Actual yield can vary based on rice type, cooking method, and water evaporation, but this provides a reliable guideline for meal planning.",
    },
    {
      question: "Why is it important to use the correct rice to water ratio?",
      answer:
        "Using too little water can result in undercooked, hard rice, while too much water can make rice mushy or sticky. The correct ratio ensures the rice is tender, fluffy, and flavorful, enhancing your dish's overall quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="imperial">Imperial (Cups/°F)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rice Type */}
      <div className="space-y-1">
        <Label htmlFor="riceType" className="text-slate-700 dark:text-slate-300">
          Rice Type
        </Label>
        <Select
          id="riceType"
          value={inputs.riceType}
          onValueChange={onRiceTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select rice type" />
          </SelectTrigger>
          <SelectContent>
            {riceTypes.map((rice) => (
              <SelectItem key={rice.label} value={rice.label}>
                {rice.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rice Amount Input */}
      <div className="space-y-1">
        <Label htmlFor="riceAmount" className="text-slate-700 dark:text-slate-300">
          Rice Amount
        </Label>
        <div className="flex gap-2">
          <Input
            id="riceAmount"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 280"}
            value={inputs.riceAmount ?? ""}
            onChange={(e) => onRiceAmountChange(e.target.value)}
            className="flex-1"
            aria-describedby="riceAmountHelp"
          />
          <Select
            value={inputs.riceAmountUnit}
            onValueChange={onRiceAmountUnitChange}
            aria-label="Rice amount unit"
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cups">Cups</SelectItem>
              <SelectItem value="grams">Grams</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p id="riceAmountHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter rice amount in selected unit.
        </p>
      </div>

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
          onClick={() =>
            setInputs({
              riceType: "Basmati",
              riceAmount: "",
              riceAmountUnit: "cups",
            })
          }
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
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}

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
          Understanding Rice:Water Ratio & Yield Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cooking rice perfectly requires understanding the right balance between rice and water.
          Different rice varieties absorb water differently, affecting texture and yield. This calculator
          helps you determine the precise amount of water needed based on the type and quantity of rice,
          ensuring consistent and delicious results every time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator also estimates the cooked rice yield, which is typically about three times the
          volume of raw rice. This helps in meal planning and portion control. Whether you prefer measuring
          by volume or weight, the tool adapts to your preferred unit system for convenience and accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By selecting your rice type and entering the amount, you receive tailored water measurements and
          yield estimates. This precision reduces guesswork and enhances your culinary confidence, especially
          when experimenting with new rice varieties or recipes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Rice:Water Ratio & Yield Calculator is straightforward. Start by selecting your preferred
          unit system—Imperial for cups and Fahrenheit or Metric for grams and Celsius. Then choose the rice
          type you plan to cook.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the amount of rice you want to cook, either in cups or grams,
            depending on your selected unit.
          </li>
          <li>
            <strong>Step 2:</strong> Click the Calculate button to see the exact amount of water needed and
            the estimated cooked rice yield.
          </li>
          <li>
            <strong>Step 3:</strong> Use the results to measure your ingredients accurately for perfect rice
            every time.
          </li>
          <li>
            <strong>Step 4:</strong> Reset the inputs anytime to start a new calculation.
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
              1. USDA Food Composition Databases
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA data on food densities and cooking guidelines.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.culinaryinstitute.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Culinary Institute of America - Rice Cooking Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on rice preparation and water ratios for various rice types.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.bonappetit.com/story/how-to-cook-rice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Bon Appétit - How to Cook Perfect Rice
            </a>
            <p className="text-slate-500 text-sm">
              Practical tips and ratio guidelines for home cooks.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rice:Water Ratio & Yield Calculator"
      description="Get the perfect rice-to-water ratio. Calculate yield and liquid needs for Basmati, Jasmine, Brown, or Sushi rice."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Water (cups) = Rice (cups) × Rice-to-Water Ratio",
        variables: [
          { symbol: "Rice (cups)", description: "Amount of raw rice" },
          { symbol: "Water (cups)", description: "Amount of water needed" },
          { symbol: "Rice-to-Water Ratio", description: "Varies by rice type" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to cook 2 cups of Basmati rice. The recommended ratio is 1.5 cups water per cup rice.",
        steps: [
          {
            label: "1",
            explanation: "Multiply rice amount by ratio: 2 cups × 1.5 = 3 cups water.",
          },
          {
            label: "2",
            explanation:
              "Use 3 cups of water with 2 cups of Basmati rice for perfect cooking.",
          },
        ],
        result: "Yield will be approximately 6 cups of cooked rice.",
      }}
      relatedCalculators={[
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🍳",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "🍞",
        },
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🧁",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "📏",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Rice:Water Ratio & Yield Calculator" },
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