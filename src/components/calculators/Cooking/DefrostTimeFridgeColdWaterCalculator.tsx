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

type Ingredient = "Beef" | "Chicken" | "Pork" | "Fish";

const densityMap: Record<Ingredient, number> = {
  // grams per cup (approximate average densities)
  Beef: 240, // ground beef approx 240g/cup
  Chicken: 140, // chopped chicken approx 140g/cup
  Pork: 230, // ground pork approx 230g/cup
  Fish: 180, // chopped fish approx 180g/cup
};

const USDA_DANGER_ZONE_F_LOW = 40;
const USDA_DANGER_ZONE_F_HIGH = 140;
const USDA_DANGER_ZONE_C_LOW = 4.4;
const USDA_DANGER_ZONE_C_HIGH = 60;

const FRIDGE_TEMP_F = 38; // Typical fridge temp in °F
const FRIDGE_TEMP_C = 3.3; // Typical fridge temp in °C

// Defrost time estimation constants (approximate, based on USDA and culinary sources):
// Fridge thawing: ~5 hours per pound (imperial) or ~11 hours per kg (metric)
// Cold water thawing: ~0.5 hours per pound or ~1.1 hours per kg
// These are rough estimates and depend on thickness and shape.

export default function DefrostTimeFridgeColdWaterCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: Ingredient;
    weight?: string; // string to allow empty input
    method?: "fridge" | "cold-water";
  }>({
    ingredient: "Beef",
    weight: "",
    method: "fridge",
  });

  // Parse weight input to number (grams or pounds)
  const weightNum = useMemo(() => {
    if (!inputs.weight) return 0;
    const parsed = parseFloat(inputs.weight);
    return isNaN(parsed) || parsed <= 0 ? 0 : parsed;
  }, [inputs.weight]);

  // Calculate defrost time and warnings
  const results = useMemo(() => {
    if (!inputs.ingredient || !inputs.method || weightNum === 0) {
      return {
        value: 0,
        label: "Enter all inputs to calculate",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to pounds for calculation if metric
    // Imperial input: weightNum is in pounds
    // Metric input: weightNum is in grams, convert to kg for calculation
    let weightPounds = 0;
    let weightKg = 0;

    if (unit === "imperial") {
      weightPounds = weightNum;
      weightKg = weightNum * 0.453592;
    } else {
      weightKg = weightNum / 1000;
      weightPounds = weightKg * 2.20462;
    }

    // Calculate defrost time based on method
    // Fridge thawing: 5 hours per pound
    // Cold water thawing: 0.5 hours per pound
    // Source: USDA and culinary references

    let defrostHours = 0;
    let methodLabel = "";
    if (inputs.method === "fridge") {
      defrostHours = 5 * weightPounds;
      methodLabel = "Fridge thawing";
    } else {
      defrostHours = 0.5 * weightPounds;
      methodLabel = "Cold water thawing";
    }

    // Format defrost time nicely (hours and minutes)
    const hours = Math.floor(defrostHours);
    const minutes = Math.round((defrostHours - hours) * 60);

    const timeString =
      hours > 0
        ? minutes > 0
          ? `${hours} hr ${minutes} min`
          : `${hours} hr`
        : `${minutes} min`;

    // Safety warning if fridge temp is in danger zone (unlikely but check)
    // Also warn if cold water temp is unknown (assumed cold)
    // For this tool, warn if fridge temp is above 40°F or below 32°F (too cold)
    // We'll just warn if fridge temp is in danger zone (40-140°F)
    let warningMsg: string | null = null;

    if (inputs.method === "fridge") {
      if (
        FRIDGE_TEMP_F >= USDA_DANGER_ZONE_F_LOW &&
        FRIDGE_TEMP_F <= USDA_DANGER_ZONE_F_HIGH
      ) {
        warningMsg =
          "Warning: Fridge temperature is in the USDA danger zone (40-140°F). Keep meat below 40°F to prevent bacterial growth.";
      }
    } else if (inputs.method === "cold-water") {
      warningMsg =
        "Ensure water is cold (below 70°F/21°C) and changed every 30 minutes for safety.";
    }

    // Chef tip subtext based on ingredient density and method
    const density = densityMap[inputs.ingredient];
    const subtext = `Using ${inputs.ingredient} density of ${density} g/cup for conversions.`;

    return {
      value: timeString,
      label: `${methodLabel} time estimate`,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit, weightNum]);

  // Prepare label texts for inputs using useMemo
  const ingredientOptions = useMemo(
    () => ["Beef", "Chicken", "Pork", "Fish"] as Ingredient[],
    []
  );

  // FAQ content
  const faqs = useMemo(
    () => [
      {
        question: "How accurate are defrost time estimates?",
        answer:
          "Defrost times are approximate and depend on factors like meat thickness, shape, and fridge temperature. Always check meat for ice crystals before cooking and never thaw at room temperature to avoid bacterial growth.",
      },
      {
        question: "Can I defrost meat faster than these methods?",
        answer:
          "Cold water thawing is faster than fridge thawing but requires changing water every 30 minutes to keep it cold. Microwave thawing is fastest but can partially cook meat, affecting texture and safety.",
      },
      {
        question: "Why is ingredient density important?",
        answer:
          "Density helps convert volume measurements (cups) to weight (grams or pounds) accurately. Different meats have different densities, so using the correct value ensures precise defrost time calculations.",
      },
      {
        question: "What is the USDA danger zone and why avoid it?",
        answer:
          "The USDA danger zone (40-140°F or 4.4-60°C) is the temperature range where bacteria multiply rapidly. Keeping meat out of this range during thawing is critical to prevent foodborne illness.",
      },
    ],
    []
  );

  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onIngredientChange(value: Ingredient) {
    setInputs((prev) => ({ ...prev, ingredient: value }));
  }
  function onWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, weight: e.target.value }));
  }
  function onMethodChange(value: "fridge" | "cold-water") {
    setInputs((prev) => ({ ...prev, method: value }));
  }

  // Widget JSX (clean, no inline logic)
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
              <SelectItem value="imperial">Imperial (Pounds/°F)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredient Select */}
      <div className="space-y-1">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Ingredient / Meat Type
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient}
          onValueChange={onIngredientChange}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select ingredient" />
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

      {/* Weight Input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "Pounds (lbs)" : "Grams (g)"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 1000"}
          value={inputs.weight || ""}
          onChange={onWeightChange}
          className="max-w-xs"
        />
      </div>

      {/* Method Select */}
      <div className="space-y-1">
        <Label htmlFor="method" className="text-slate-700 dark:text-slate-300">
          Defrost Method
        </Label>
        <Select
          id="method"
          value={inputs.method}
          onValueChange={(v) => onMethodChange(v as "fridge" | "cold-water")}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fridge">Fridge Thawing</SelectItem>
            <SelectItem value="cold-water">Cold Water Thawing</SelectItem>
          </SelectContent>
        </Select>
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
          onClick={() =>
            setInputs({
              ingredient: "Beef",
              weight: "",
              method: "fridge",
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
          Understanding Defrost Time Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Defrosting meat safely and efficiently is crucial in culinary practice to ensure food safety and maintain quality. This estimator helps you calculate approximate thawing times based on the weight of your meat and the defrosting method you choose. It incorporates ingredient-specific densities to convert between volume and weight accurately, ensuring precise calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The tool considers two common defrosting methods: refrigerator thawing and cold water thawing. Refrigerator thawing is the safest but slowest method, while cold water thawing is faster but requires more attention to safety protocols. The estimator also provides warnings if the defrosting conditions fall within unsafe temperature ranges, referencing USDA guidelines to prevent bacterial growth.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Defrost Time Estimator, select your preferred unit system (Imperial or Metric), choose the type of meat you are defrosting, enter its weight, and select the defrosting method. The calculator will then provide an estimated thawing time along with safety warnings if applicable.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system that matches your measurement tools.
          </li>
          <li>
            <strong>Step 2:</strong> Select the ingredient type to ensure accurate density conversion.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the weight of the meat in the selected units.
          </li>
          <li>
            <strong>Step 4:</strong> Pick the defrosting method: fridge thawing or cold water thawing.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to see the estimated defrost time and any safety warnings.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-thawing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Safe Thawing Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA recommendations on safe thawing methods and times for meat.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.culinaryinstitute.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Culinary Institute of America - Food Safety
            </a>
            <p className="text-slate-500 text-sm">
              Educational resources on food safety and meat handling.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Defrost Time Estimator"
      description="Estimate defrosting times. Calculate how long meat needs to thaw in the fridge or cold water based on its weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Defrost Time (hours) = Weight (lbs) × 5 (fridge) OR Weight (lbs) × 0.5 (cold water)",
        variables: [
          { symbol: "Weight (lbs)", description: "Weight of meat in pounds" },
          {
            symbol: "Defrost Time (hours)",
            description: "Estimated thawing time in hours",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 3 pounds of beef and want to thaw it in the fridge.",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Beef' as the ingredient and 'Imperial' units.",
          },
          {
            label: "2",
            explanation: "Enter 3 in the weight input (pounds).",
          },
          {
            label: "3",
            explanation: "Choose 'Fridge Thawing' as the method.",
          },
          {
            label: "4",
            explanation:
              "Click Calculate to get the estimated defrost time: 15 hours.",
          },
        ],
        result: "Estimated defrost time: 15 hours (3 lbs × 5 hours/lb).",
      }}
      relatedCalculators={[
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🍳",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "🍞",
        },
        {
          title: "Turkey Size, Thaw & Cook Time Calculator",
          url: "/cooking/turkey-thaw-cook-time",
          icon: "🥩",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "📏",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Defrost Time Estimator" },
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