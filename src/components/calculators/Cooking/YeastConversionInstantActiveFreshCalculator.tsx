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

export default function YeastConversionInstantActiveFreshCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    yeastTypeFrom?: "instant" | "activeDry" | "fresh";
    yeastTypeTo?: "instant" | "activeDry" | "fresh";
    amount?: string;
  }>({
    yeastTypeFrom: "instant",
    yeastTypeTo: "activeDry",
    amount: "",
  });

  // 2. LOGIC ENGINE

  /**
   * Yeast conversion ratios based on weight equivalence:
   * Source: King Arthur Baking and Serious Eats
   * - Instant yeast is the baseline (1x)
   * - Active Dry yeast requires about 1.25x instant yeast weight
   * - Fresh yeast requires about 3x instant yeast weight
   */
  const yeastConversionRatios: Record<
    "instant" | "activeDry" | "fresh",
    number
  > = {
    instant: 1,
    activeDry: 1.25,
    fresh: 3,
  };

  const results = useMemo(() => {
    const { yeastTypeFrom, yeastTypeTo, amount } = inputs;
    if (
      !yeastTypeFrom ||
      !yeastTypeTo ||
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

    // Convert input amount to grams or ounces depending on unit
    // Imperial: input assumed in teaspoons (default yeast measure in US)
    // Metric: input assumed in grams
    // We'll convert everything internally to grams for accuracy

    // Yeast density approx: 3g per teaspoon (instant yeast)
    // We'll assume input amount is in teaspoons (imperial) or grams (metric)
    // So first convert input amount to grams
    let amountInGrams: number;

    if (unit === "imperial") {
      // Input is teaspoons, convert to grams
      // 1 tsp instant yeast ≈ 3g
      amountInGrams = Number(amount) * 3;
    } else {
      // Metric input assumed grams directly
      amountInGrams = Number(amount);
    }

    // Convert from yeastTypeFrom to instant yeast equivalent grams
    // instant yeast weight = input weight / ratio of yeastTypeFrom
    const instantEquivalentGrams =
      amountInGrams / yeastConversionRatios[yeastTypeFrom];

    // Convert instant equivalent grams to target yeast weight
    const targetYeastGrams =
      instantEquivalentGrams * yeastConversionRatios[yeastTypeTo];

    // Convert back to user unit for output
    let displayValue: number;
    let displayUnit: string;

    if (unit === "imperial") {
      // Convert grams to teaspoons for output (1 tsp ≈ 3g)
      displayValue = targetYeastGrams / 3;
      displayUnit = "teaspoons";
    } else {
      displayValue = targetYeastGrams;
      displayUnit = "grams";
    }

    // Round to 2 decimals for display
    displayValue = Math.round(displayValue * 100) / 100;

    // Warning if converting fresh yeast in imperial units and amount is large (fresh yeast is perishable)
    let warning: string | null = null;
    if (
      yeastTypeTo === "fresh" &&
      displayValue > 10 &&
      unit === "imperial"
    ) {
      warning =
        "Fresh yeast is highly perishable; use within a few days and store refrigerated.";
    }

    return {
      value: displayValue,
      label: `${displayUnit} of ${yeastTypeTo
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()} yeast`,
      subtext: `Converted from ${amount} ${
        unit === "imperial" ? "teaspoons" : "grams"
      } of ${yeastTypeFrom.replace(/([A-Z])/g, " $1").toLowerCase()} yeast.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do I need to convert between yeast types?",
      answer:
        "Different yeast types have varying moisture content and activity levels. Converting ensures your recipe maintains the correct fermentation and rise times, resulting in consistent baking outcomes.",
    },
    {
      question: "Can I substitute fresh yeast directly with instant yeast?",
      answer:
        "No, fresh yeast contains more moisture and is less concentrated. Typically, fresh yeast weight is about three times that of instant yeast for the same leavening power.",
    },
    {
      question: "Is volume measurement accurate for yeast?",
      answer:
        "Measuring yeast by weight is more precise than volume. For best results, use a digital scale to weigh your yeast, especially when converting between types.",
    },
    {
      question: "Where do these yeast conversion ratios come from?",
      answer:
        "Ratios are based on research and recommendations from King Arthur Baking and Serious Eats, trusted sources in baking science.",
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

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">
                Imperial (Teaspoons/°F)
              </SelectItem>
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
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant Yeast</SelectItem>
            <SelectItem value="activeDry">Active Dry Yeast</SelectItem>
            <SelectItem value="fresh">Fresh Yeast (Cake)</SelectItem>
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
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant Yeast</SelectItem>
            <SelectItem value="activeDry">Active Dry Yeast</SelectItem>
            <SelectItem value="fresh">Fresh Yeast (Cake)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
          Amount ({unit === "imperial" ? "Teaspoons" : "Grams"})
        </Label>
        <Input
          id="amount"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter amount in ${unit === "imperial" ? "teaspoons" : "grams"}`}
          value={inputs.amount || ""}
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
          disabled={
            !inputs.amount ||
            !inputs.yeastTypeFrom ||
            !inputs.yeastTypeTo ||
            Number(inputs.amount) <= 0
          }
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ yeastTypeFrom: "instant", yeastTypeTo: "activeDry", amount: "" })
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
              <strong>Chef's Tip:</strong> For best accuracy, weigh your yeast using a digital scale rather than measuring by volume.
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
          Yeast is a living organism used in baking to ferment dough, producing carbon dioxide that causes bread to rise. However, yeast comes in different forms—instant, active dry, and fresh—each with unique moisture content and activity levels. This calculator helps convert quantities between these types to maintain consistent fermentation and baking results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Instant yeast is the most concentrated and commonly used in home baking, while active dry yeast requires a slightly higher amount due to its lower moisture content. Fresh yeast, also known as cake yeast, is moist and perishable, requiring roughly three times the weight of instant yeast for the same leavening power. Accurate conversion ensures your dough rises properly without under- or over-proofing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool uses trusted conversion ratios from King Arthur Baking and Serious Eats, allowing bakers to switch yeast types confidently. Whether scaling recipes or substituting yeast types, this calculator supports precise baking science for delicious results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Yeast Conversion Calculator, select the yeast type you currently have and the yeast type you want to convert to. Enter the amount of yeast you have in teaspoons (imperial) or grams (metric), then click Calculate. The tool will provide the equivalent amount in your chosen unit system.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the yeast type you are converting from (instant, active dry, or fresh).
          </li>
          <li>
            <strong>Step 2:</strong> Choose the yeast type you want to convert to.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the amount of yeast you have in the appropriate unit (teaspoons or grams).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the equivalent amount of the target yeast type.
          </li>
          <li>
            <strong>Tip:</strong> Always weigh yeast when possible for best accuracy, especially when baking bread that requires precise fermentation.
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
              href="https://www.kingarthurbaking.com/learn/guides/yeast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Yeast Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive yeast conversion ratios and baking tips from King Arthur Baking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/yeast-types-instant-active-dry-fresh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats - Yeast Types Explained
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of yeast types and their usage in baking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fda.gov/food/food-safety-modernization-act-fsma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. FDA & USDA Food Safety Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Food safety standards relevant to yeast handling and storage.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Result = Input × (Ratio_target / Ratio_source)",
        variables: [
          { symbol: "Input", description: "Amount of yeast (grams or teaspoons)" },
          { symbol: "Result", description: "Equivalent amount of target yeast" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Convert 2 teaspoons of instant yeast to fresh yeast in imperial units.",
        steps: [
          {
            label: "1",
            explanation:
              "Instant yeast weight equivalent = 2 tsp × 3g/tsp = 6g",
          },
          {
            label: "2",
            explanation:
              "Fresh yeast required = 6g × 3 (fresh/instant ratio) = 18g",
          },
          {
            label: "3",
            explanation:
              "Convert 18g fresh yeast back to teaspoons (approx 3g/tsp): 18g ÷ 3g/tsp = 6 tsp",
          },
        ],
        result: "6 teaspoons fresh yeast",
      }}
      relatedCalculators={[
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍳",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🥩",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Sourdough Starter Ratio & Feed Planner",
          url: "/cooking/sourdough-starter-ratio-feed-planner",
          icon: "🍞",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Yeast Conversion Calculator" },
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