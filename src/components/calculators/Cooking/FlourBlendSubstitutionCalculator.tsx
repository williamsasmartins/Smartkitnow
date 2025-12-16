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

type UnitSystem = "imperial" | "metric";
type FlourType = "all-purpose" | "almond" | "coconut" | "rice";

const DENSITY_MAP: Record<FlourType, number> = {
  // grams per cup
  "all-purpose": 120,
  almond: 96,
  coconut: 112,
  rice: 158,
};

const FLOUR_LABELS: Record<FlourType, string> = {
  "all-purpose": "All-Purpose Flour",
  almond: "Almond Flour",
  coconut: "Coconut Flour",
  rice: "Rice Flour",
};

export default function FlourBlendSubstitutionCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    originalFlour: FlourType | "";
    originalAmount: string;
    substituteFlour1: FlourType | "";
    substituteRatio1: string;
    substituteFlour2: FlourType | "";
    substituteRatio2: string;
    substituteFlour3: FlourType | "";
    substituteRatio3: string;
  }>({
    originalFlour: "all-purpose",
    originalAmount: "",
    substituteFlour1: "almond",
    substituteRatio1: "",
    substituteFlour2: "coconut",
    substituteRatio2: "",
    substituteFlour3: "rice",
    substituteRatio3: "",
  });

  // Parse float helper
  const parseInputFloat = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    // Validate inputs
    const originalFlour = inputs.originalFlour;
    const originalAmountRaw = inputs.originalAmount.trim();
    const substituteFlour1 = inputs.substituteFlour1;
    const substituteRatio1Raw = inputs.substituteRatio1.trim();
    const substituteFlour2 = inputs.substituteFlour2;
    const substituteRatio2Raw = inputs.substituteRatio2.trim();
    const substituteFlour3 = inputs.substituteFlour3;
    const substituteRatio3Raw = inputs.substituteRatio3.trim();

    if (
      !originalFlour ||
      !originalAmountRaw ||
      (!substituteFlour1 && !substituteFlour2 && !substituteFlour3)
    ) {
      return {
        value: 0,
        label: "Enter all required data above",
        subtext: "",
        warning: null,
      };
    }

    const originalAmount = parseInputFloat(originalAmountRaw);
    if (originalAmount === 0) {
      return {
        value: 0,
        label: "Original flour amount must be greater than zero",
        subtext: "",
        warning: null,
      };
    }

    // Parse ratios
    const ratio1 = parseInputFloat(substituteRatio1Raw);
    const ratio2 = parseInputFloat(substituteRatio2Raw);
    const ratio3 = parseInputFloat(substituteRatio3Raw);

    const totalRatio = ratio1 + ratio2 + ratio3;
    if (totalRatio === 0) {
      return {
        value: 0,
        label: "At least one substitute ratio must be greater than zero",
        subtext: "",
        warning: null,
      };
    }

    // Normalize ratios to sum to 1
    const normRatio1 = ratio1 / totalRatio;
    const normRatio2 = ratio2 / totalRatio;
    const normRatio3 = ratio3 / totalRatio;

    // Convert original amount to grams for calculation
    // If imperial, input is cups; if metric, input is grams
    // Use density map for original flour
    const originalDensity = DENSITY_MAP[originalFlour];
    let originalGrams: number;
    if (unit === "imperial") {
      // cups to grams
      originalGrams = originalAmount * originalDensity;
    } else {
      // metric grams input
      originalGrams = originalAmount;
    }

    // Calculate substitute flour grams based on ratios
    // The goal: substitute blend total weight = originalGrams
    // So each substitute flour weight = originalGrams * normalized ratio
    // Then convert back to unit system for display

    // Helper to convert grams to display unit
    const gramsToDisplay = (grams: number, flour: FlourType) => {
      const density = DENSITY_MAP[flour];
      if (unit === "imperial") {
        // convert grams to cups
        return grams / density;
      }
      // metric: grams
      return grams;
    };

    // Calculate substitute amounts
    const sub1Grams = originalGrams * normRatio1;
    const sub2Grams = originalGrams * normRatio2;
    const sub3Grams = originalGrams * normRatio3;

    const sub1Display = gramsToDisplay(sub1Grams, substituteFlour1);
    const sub2Display = gramsToDisplay(sub2Grams, substituteFlour2);
    const sub3Display = gramsToDisplay(sub3Grams, substituteFlour3);

    // Format numbers nicely
    const formatAmount = (val: number) => {
      if (unit === "imperial") {
        // cups: round to 2 decimals, but show 3 decimals if <0.1
        if (val < 0.1 && val > 0) return val.toFixed(3);
        return val.toFixed(2);
      }
      // grams: round to 1 decimal
      return val.toFixed(1);
    };

    // Build output string
    // Only show substitute flours with ratio > 0 and flour selected
    const parts: string[] = [];
    if (substituteFlour1 && normRatio1 > 0) {
      parts.push(
        `${formatAmount(sub1Display)} ${
          unit === "imperial" ? "cups" : "g"
        } ${FLOUR_LABELS[substituteFlour1]}`
      );
    }
    if (substituteFlour2 && normRatio2 > 0) {
      parts.push(
        `${formatAmount(sub2Display)} ${
          unit === "imperial" ? "cups" : "g"
        } ${FLOUR_LABELS[substituteFlour2]}`
      );
    }
    if (substituteFlour3 && normRatio3 > 0) {
      parts.push(
        `${formatAmount(sub3Display)} ${
          unit === "imperial" ? "cups" : "g"
        } ${FLOUR_LABELS[substituteFlour3]}`
      );
    }

    const displayValue = parts.join(" + ");
    const labelText = `Substitute blend for ${unit === "imperial" ? `${originalAmount} cups` : `${originalAmount} g`} ${FLOUR_LABELS[originalFlour]}`;
    const subtext = `Ratios normalized to total 100%. Adjust ratios to customize your blend.`;

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: null,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "What is the purpose of this flour blend substitution helper?",
      answer:
        "This tool helps bakers create gluten-free or alternative flour blends by calculating precise amounts of substitute flours to replace all-purpose flour. It ensures the correct ratios and weights are used for consistent baking results.",
    },
    {
      question: "Why do I need to use density values for flour conversions?",
      answer:
        "Different flours have different densities, meaning one cup of almond flour weighs less than one cup of all-purpose flour. Using density values ensures accurate volume-to-weight conversions, which is critical for baking precision.",
    },
    {
      question: "Can I use this calculator for other ingredients besides flour?",
      answer:
        "This calculator is specifically designed for flour blends due to the unique densities and baking properties of flours. For other ingredients, consider using dedicated conversion tools tailored to their densities and culinary uses.",
    },
    {
      question: "How do I adjust the ratios for my preferred flour blend?",
      answer:
        "Enter the desired percentage ratios for each substitute flour. The calculator normalizes these ratios to sum to 100%, then provides the exact amounts needed to replace your original flour quantity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onInputChange = (
    field:
      | "originalAmount"
      | "substituteRatio1"
      | "substituteRatio2"
      | "substituteRatio3",
    value: string
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };
  const onSelectChange = (
    field:
      | "originalFlour"
      | "substituteFlour1"
      | "substituteFlour2"
      | "substituteFlour3",
    value: FlourType | ""
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
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

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Original Flour */}
        <div>
          <Label htmlFor="original-flour" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Original Flour Type
          </Label>
          <Select
            id="original-flour"
            value={inputs.originalFlour}
            onValueChange={(v) => onSelectChange("originalFlour", v as FlourType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flour" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-purpose">All-Purpose Flour</SelectItem>
              <SelectItem value="almond">Almond Flour</SelectItem>
              <SelectItem value="coconut">Coconut Flour</SelectItem>
              <SelectItem value="rice">Rice Flour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="original-amount" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Original Flour Amount ({unit === "imperial" ? "cups" : "grams"})
          </Label>
          <Input
            id="original-amount"
            type="number"
            min="0"
            step="any"
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 300"}
            value={inputs.originalAmount}
            onChange={(e) => onInputChange("originalAmount", e.target.value)}
          />
        </div>

        {/* Substitute Flour 1 */}
        <div>
          <Label htmlFor="substitute-flour-1" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Substitute Flour 1
          </Label>
          <Select
            id="substitute-flour-1"
            value={inputs.substituteFlour1}
            onValueChange={(v) => onSelectChange("substituteFlour1", v as FlourType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flour" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="almond">Almond Flour</SelectItem>
              <SelectItem value="coconut">Coconut Flour</SelectItem>
              <SelectItem value="rice">Rice Flour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="substitute-ratio-1" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Ratio (%) for Substitute Flour 1
          </Label>
          <Input
            id="substitute-ratio-1"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="e.g. 50"
            value={inputs.substituteRatio1}
            onChange={(e) => onInputChange("substituteRatio1", e.target.value)}
          />
        </div>

        {/* Substitute Flour 2 */}
        <div>
          <Label htmlFor="substitute-flour-2" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Substitute Flour 2
          </Label>
          <Select
            id="substitute-flour-2"
            value={inputs.substituteFlour2}
            onValueChange={(v) => onSelectChange("substituteFlour2", v as FlourType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flour" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="almond">Almond Flour</SelectItem>
              <SelectItem value="coconut">Coconut Flour</SelectItem>
              <SelectItem value="rice">Rice Flour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="substitute-ratio-2" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Ratio (%) for Substitute Flour 2
          </Label>
          <Input
            id="substitute-ratio-2"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="e.g. 30"
            value={inputs.substituteRatio2}
            onChange={(e) => onInputChange("substituteRatio2", e.target.value)}
          />
        </div>

        {/* Substitute Flour 3 */}
        <div>
          <Label htmlFor="substitute-flour-3" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Substitute Flour 3
          </Label>
          <Select
            id="substitute-flour-3"
            value={inputs.substituteFlour3}
            onValueChange={(v) => onSelectChange("substituteFlour3", v as FlourType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select flour" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="almond">Almond Flour</SelectItem>
              <SelectItem value="coconut">Coconut Flour</SelectItem>
              <SelectItem value="rice">Rice Flour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="substitute-ratio-3" className="mb-1 block text-slate-700 dark:text-slate-300 font-semibold">
            Ratio (%) for Substitute Flour 3
          </Label>
          <Input
            id="substitute-ratio-3"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="e.g. 20"
            value={inputs.substituteRatio3}
            onChange={(e) => onInputChange("substituteRatio3", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              originalFlour: "all-purpose",
              originalAmount: "",
              substituteFlour1: "almond",
              substituteRatio1: "",
              substituteFlour2: "coconut",
              substituteRatio2: "",
              substituteFlour3: "rice",
              substituteRatio3: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <p className="text-3xl sm:text-5xl font-extrabold text-blue-900 dark:text-white break-words">
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
              precision and consistency when measuring flours.
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
          Baking with alternative flours requires precision to achieve the
          desired texture and flavor. This Flour Blend Substitution Helper is
          designed to assist bakers in creating custom gluten-free or
          specialty flour blends by calculating the exact amounts of substitute
          flours needed to replace all-purpose flour in recipes. It accounts
          for the different densities of flours, ensuring accurate volume and
          weight conversions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting your original flour amount and desired substitute flours
          with their ratios, this tool normalizes the blend to maintain the
          total flour weight or volume. This approach helps maintain the
          structural integrity and moisture balance of your baked goods,
          resulting in consistent and delicious outcomes.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Flour Blend Substitution Helper, first select your original
          flour type and enter the amount used in your recipe. Choose up to
          three substitute flours and specify their desired ratios as
          percentages. The calculator will normalize these ratios and provide
          the precise amounts of each substitute flour needed to replace the
          original flour quantity.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the original flour type and enter
            the amount (cups or grams based on unit system).
          </li>
          <li>
            <strong>Step 2:</strong> Choose up to three substitute flours and
            enter their ratio percentages.
          </li>
          <li>
            <strong>Step 3:</strong> Click Calculate to see the exact amounts
            of each substitute flour needed.
          </li>
          <li>
            <strong>Step 4:</strong> Use a digital scale for best accuracy
            when measuring your flours.
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
              href="https://www.kingarthurbaking.com/learn/guides/flour-weight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Flour Weight Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on flour densities and baking conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.bobsredmill.com/blog/alternative-flours/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Bob's Red Mill - Alternative Flours Overview
            </a>
            <p className="text-slate-500 text-sm">
              Insights on properties and uses of various gluten-free flours.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA - Food Safety and Ingredient Standards
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on ingredient safety and standards.
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
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Substitute Amount (g) = Original Flour Amount (g) × (Substitute Ratio / Sum of Ratios)",
        variables: [
          { symbol: "Original Flour Amount (g)", description: "Weight of original flour" },
          { symbol: "Substitute Ratio", description: "Percentage ratio of substitute flour" },
          { symbol: "Sum of Ratios", description: "Total of all substitute ratios" },
          { symbol: "Substitute Amount (g)", description: "Calculated weight of substitute flour" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to replace 2 cups of all-purpose flour with a blend of almond, coconut, and rice flours at 50%, 30%, and 20% ratios respectively.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 2 cups of all-purpose flour to grams (2 × 120g = 240g).",
          },
          {
            label: "2",
            explanation:
              "Calculate each substitute flour weight: Almond = 240 × 0.5 = 120g, Coconut = 240 × 0.3 = 72g, Rice = 240 × 0.2 = 48g.",
          },
          {
            label: "3",
            explanation:
              "Convert grams back to cups for each substitute flour using their densities.",
          },
        ],
        result:
          "Use 1.25 cups almond flour + 0.64 cups coconut flour + 0.30 cups rice flour to replace 2 cups all-purpose flour.",
      }}
      relatedCalculators={[
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "🍳",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍞",
        },
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🥩",
        },
        {
          title: "Salt % for Brining Calculator",
          url: "/cooking/salt-percent-brining",
          icon: "🧁",
        },
        {
          title: "Stock/Broth Reduction Time & Yield",
          url: "/cooking/stock-broth-reduction-time-yield",
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