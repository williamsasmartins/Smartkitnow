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

export default function DoughHydrationPercentCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    flourAmount: string;
    flourUnit: string;
    waterAmount: string;
    waterUnit: string;
  }>({
    flourAmount: "",
    flourUnit: "cups",
    waterAmount: "",
    waterUnit: "cups",
  });

  // 2. INGREDIENT DENSITY MAP (Cups to Grams or Lbs)
  // Flour density: 1 cup AP flour ≈ 120g ≈ 0.2645 lbs
  // Water density: 1 cup water ≈ 236.588 ml ≈ 236.588 g ≈ 0.52 lbs
  // We'll convert everything to grams internally for precision, then convert back if needed.

  // Density in g per cup
  const densityMap = {
    flour: 120, // grams per cup (AP flour)
    water: 236.588, // grams per cup
  };

  // Unit conversion helpers
  const toGrams = (amount: number, unit: string, ingredient: "flour" | "water") => {
    if (unit === "grams") return amount;
    if (unit === "kilograms") return amount * 1000;
    if (unit === "cups") return amount * densityMap[ingredient];
    if (unit === "lbs") return amount * 453.592;
    if (unit === "ounces") return amount * 28.3495;
    return amount; // fallback
  };

  const fromGrams = (grams: number, unit: string) => {
    if (unit === "grams") return grams;
    if (unit === "kilograms") return grams / 1000;
    if (unit === "cups") {
      // For cups, we need ingredient context, so avoid here
      return grams; // fallback, should not be used directly
    }
    if (unit === "lbs") return grams / 453.592;
    if (unit === "ounces") return grams / 28.3495;
    return grams;
  };

  // 3. LOGIC ENGINE
  const results = useMemo(() => {
    const flourAmtNum = parseFloat(inputs.flourAmount);
    const waterAmtNum = parseFloat(inputs.waterAmount);
    if (
      isNaN(flourAmtNum) ||
      flourAmtNum <= 0 ||
      isNaN(waterAmtNum) ||
      waterAmtNum < 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert flour and water to grams
    const flourGrams = toGrams(flourAmtNum, inputs.flourUnit, "flour");
    const waterGrams = toGrams(waterAmtNum, inputs.waterUnit, "water");

    if (flourGrams === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Flour amount must be greater than zero.",
      };
    }

    // Baker's math: Flour = 100%, Hydration % = (Water / Flour) * 100
    const hydrationPercent = (waterGrams / flourGrams) * 100;

    // Format hydration to 1 decimal place
    const hydrationFormatted = hydrationPercent.toFixed(1);

    // Subtext with interpretation
    let subtext = "";
    if (hydrationPercent < 55) {
      subtext = "Low hydration dough: firmer, denser crumb.";
    } else if (hydrationPercent <= 65) {
      subtext = "Moderate hydration: balanced crumb and handling.";
    } else if (hydrationPercent <= 80) {
      subtext = "High hydration: open crumb, moist texture.";
    } else {
      subtext =
        "Very high hydration: very wet dough, requires skill to handle.";
    }

    return {
      value: hydrationFormatted,
      label: "Dough Hydration %",
      subtext,
      warning: null,
    };
  }, [inputs]);

  // 4. FAQS
  const faqs = [
    {
      question: "What is dough hydration and why is it important?",
      answer:
        "Dough hydration is the ratio of water to flour expressed as a percentage. It directly affects dough consistency, crumb texture, and crust characteristics. Understanding hydration helps bakers control bread quality and handling.",
    },
    {
      question: "Why is flour always 100% in baker's math?",
      answer:
        "In baker's math, flour is the reference ingredient set at 100%. All other ingredient quantities, including water, are expressed as a percentage of flour weight. This standardization simplifies recipe scaling and adjustments.",
    },
    {
      question: "Can I use cups instead of grams for accurate hydration?",
      answer:
        "While cups are convenient, they vary by ingredient density and packing. Using a digital scale with grams ensures precision, especially for hydration calculations critical in artisanal baking.",
    },
    {
      question: "What hydration level is best for sourdough bread?",
      answer:
        "Sourdough hydration typically ranges from 65% to 80%. Lower hydration yields denser bread, while higher hydration produces an open crumb and moist texture. Adjust based on flour type and baking skill.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. HANDLERS
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 6. RENDER INPUTS
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(val) => setUnit(val as any)}>
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

      {/* Flour Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="flourAmount" className="text-slate-700 dark:text-slate-300">
            Flour Amount
          </Label>
          <Input
            id="flourAmount"
            name="flourAmount"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2"
            value={inputs.flourAmount}
            onChange={handleInputChange}
            aria-describedby="flourHelp"
          />
          <p id="flourHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter flour amount
          </p>
        </div>
        <div>
          <Label htmlFor="flourUnit" className="text-slate-700 dark:text-slate-300">
            Flour Unit
          </Label>
          <Select
            id="flourUnit"
            name="flourUnit"
            value={inputs.flourUnit}
            onValueChange={(val) =>
              setInputs((prev) => ({ ...prev, flourUnit: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unit === "imperial" ? (
                <>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="ounces">Ounces (oz)</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="grams">Grams (g)</SelectItem>
                  <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Water Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="waterAmount" className="text-slate-700 dark:text-slate-300">
            Water Amount
          </Label>
          <Input
            id="waterAmount"
            name="waterAmount"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1.5"
            value={inputs.waterAmount}
            onChange={handleInputChange}
            aria-describedby="waterHelp"
          />
          <p id="waterHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter water amount
          </p>
        </div>
        <div>
          <Label htmlFor="waterUnit" className="text-slate-700 dark:text-slate-300">
            Water Unit
          </Label>
          <Select
            id="waterUnit"
            name="waterUnit"
            value={inputs.waterUnit}
            onValueChange={(val) =>
              setInputs((prev) => ({ ...prev, waterUnit: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unit === "imperial" ? (
                <>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="ounces">Ounces (oz)</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="grams">Grams (g)</SelectItem>
                  <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              flourAmount: "",
              flourUnit: unit === "imperial" ? "cups" : "grams",
              waterAmount: "",
              waterUnit: unit === "imperial" ? "cups" : "grams",
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
                {results.value}%
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
              This ensures precise hydration and consistent bread quality.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 7. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dough Hydration % Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dough hydration percentage is a fundamental concept in baking,
          representing the ratio of water weight to flour weight multiplied by
          100. This ratio influences dough texture, elasticity, and the final
          bread crumb structure. Precise hydration control is essential for
          achieving desired bread characteristics, from dense loaves to open,
          airy crumb.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps bakers convert ingredient volumes to weights
          using ingredient-specific densities, ensuring accurate hydration
          calculations. By always setting flour as 100%, it aligns with baker's
          math standards, simplifying recipe scaling and adjustments. Whether
          you're crafting sourdough or artisanal bread, understanding and
          controlling hydration is key to baking success.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, enter the amount of flour and water in your
          preferred units. The tool converts these to grams internally and
          calculates the hydration percentage, which is water weight divided by
          flour weight times 100. This percentage guides you in adjusting your
          dough for desired texture and handling.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your unit system (Imperial or
            Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Input the flour amount and select its unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input the water amount and select its unit.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the dough hydration
            percentage and interpretive notes.
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
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Baker's Percentage Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive explanation of baker's math and hydration ratios.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-make-sourdough-bread"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats - Sourdough Hydration Tips
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on hydration levels for sourdough bread baking.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA - Food Safety Standards
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on food safety and ingredient handling.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
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
        title: "Kitchen Example",
        scenario:
          "You have 2 cups of all-purpose flour and 1.5 cups of water. Calculate the hydration percentage.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert flour and water to grams using ingredient densities (Flour: 120g/cup, Water: 236.6g/cup).",
          },
          {
            label: "2",
            explanation:
              "Flour weight = 2 cups × 120g = 240g; Water weight = 1.5 cups × 236.6g = 354.9g.",
          },
          {
            label: "3",
            explanation:
              "Calculate hydration % = (354.9 ÷ 240) × 100 = 147.9%.",
          },
          {
            label: "4",
            explanation:
              "This is an unusually high hydration, indicating a very wet dough.",
          },
        ],
        result: "Hydration % = 147.9%",
      }}
      relatedCalculators={[
        { title: "Oil for Frying Calculator", url: "/cooking/oil-for-frying-pan-depth-volume", icon: "🍳" },
        { title: "Defrost Time Estimator", url: "/cooking/defrost-time-fridge-cold-water", icon: "🍞" },
        { title: "Stock/Broth Reduction Time & Yield", url: "/cooking/stock-broth-reduction-time-yield", icon: "🥩" },
        { title: "Alcohol by Volume (ABV) Dilution", url: "/cooking/alcohol-abv-dilution", icon: "🧁" },
        { title: "Yeast Conversion Calculator", url: "/cooking/yeast-conversion-instant-active-fresh", icon: "📏" },
        { title: "Salt % for Brining Calculator", url: "/cooking/salt-percent-brining", icon: "🌡️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dough Hydration % Calculator" },
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