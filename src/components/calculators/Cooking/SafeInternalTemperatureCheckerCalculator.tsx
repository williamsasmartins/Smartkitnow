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

type MeatType =
  | "beef_steak"
  | "beef_roast"
  | "pork"
  | "poultry_whole"
  | "poultry_ground"
  | "fish"
  | "ground_beef"
  | "ground_pork"
  | "ground_turkey"
  | "egg_dishes";

const USDA_TEMPERATURES_IMPERIAL: Record<
  MeatType,
  { safeTempF: number; safeTempC: number }
> = {
  beef_steak: { safeTempF: 145, safeTempC: 63 },
  beef_roast: { safeTempF: 145, safeTempC: 63 },
  pork: { safeTempF: 145, safeTempC: 63 },
  poultry_whole: { safeTempF: 165, safeTempC: 74 },
  poultry_ground: { safeTempF: 165, safeTempC: 74 },
  fish: { safeTempF: 145, safeTempC: 63 },
  ground_beef: { safeTempF: 160, safeTempC: 71 },
  ground_pork: { safeTempF: 160, safeTempC: 71 },
  ground_turkey: { safeTempF: 165, safeTempC: 74 },
  egg_dishes: { safeTempF: 160, safeTempC: 71 },
};

const DANGER_ZONE_F = { low: 40, high: 140 };
const DANGER_ZONE_C = { low: 4, high: 60 };

export default function SafeInternalTemperatureCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: MeatType;
    internalTemp?: string;
  }>({});

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    if (!inputs.meatType || !inputs.internalTemp) {
      return {
        value: 0,
        label: "Enter all inputs",
        subtext: "",
        warning: null,
      };
    }

    const tempInputRaw = inputs.internalTemp.trim();
    const tempInputNum = Number(tempInputRaw);

    if (isNaN(tempInputNum) || tempInputNum <= 0) {
      return {
        value: 0,
        label: "Invalid temperature input",
        subtext: "Please enter a valid positive number.",
        warning: null,
      };
    }

    // Get safe temp for meat type
    const safeTemps = USDA_TEMPERATURES_IMPERIAL[inputs.meatType];
    if (!safeTemps) {
      return {
        value: 0,
        label: "Unknown meat type",
        subtext: "",
        warning: null,
      };
    }

    // Convert input temp to both units for comparison and display
    let inputTempF: number;
    let inputTempC: number;

    if (unit === "imperial") {
      inputTempF = tempInputNum;
      inputTempC = ((tempInputNum - 32) * 5) / 9;
    } else {
      inputTempC = tempInputNum;
      inputTempF = (tempInputNum * 9) / 5 + 32;
    }

    // Determine if safe
    const isSafe =
      inputTempF >= safeTemps.safeTempF;

    // Danger zone warning
    const inDangerZone =
      inputTempF > DANGER_ZONE_F.low && inputTempF < DANGER_ZONE_F.high;

    // Warning message if in danger zone
    let warning: string | null = null;
    if (inDangerZone) {
      warning =
        "Warning: Temperature is in the USDA Danger Zone (40°F - 140°F). Food held in this range for more than 2 hours may cause foodborne illness.";
    } else if (!isSafe) {
      warning = `Warning: Internal temperature is below the USDA recommended safe temperature of ${safeTemps.safeTempF}°F (${safeTemps.safeTempC}°C) for this meat type.`;
    }

    // Result label
    const label = isSafe
      ? "Safe to eat ✅"
      : "Not safe yet ❌";

    // Display temperature with unit
    const displayTemp =
      unit === "imperial"
        ? `${inputTempF.toFixed(1)} °F`
        : `${inputTempC.toFixed(1)} °C`;

    return {
      value: displayTemp,
      label,
      subtext: `USDA safe internal temperature for ${
        inputs.meatType
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      }: ${safeTemps.safeTempF}°F / ${safeTemps.safeTempC}°C`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is it important to reach the safe internal temperature?",
      answer:
        "Reaching the USDA recommended safe internal temperature ensures harmful bacteria and pathogens are destroyed, preventing foodborne illnesses. Undercooked meat or poultry can harbor dangerous microbes that cause sickness. Always use a reliable thermometer to verify doneness.",
    },
    {
      question: "What is the USDA Danger Zone and why avoid it?",
      answer:
        "The Danger Zone is between 40°F and 140°F (4°C - 60°C), where bacteria multiply rapidly. Food held in this temperature range for over 2 hours can become unsafe. Prompt cooking, cooling, or refrigeration is essential to minimize risk.",
    },
    {
      question: "Can I rely on color or texture to check doneness?",
      answer:
        "No, color and texture are unreliable indicators of safety. Some meats may appear cooked but still be under the safe temperature inside. Using a food thermometer is the only accurate method to ensure safety.",
    },
    {
      question: "How do I properly use a food thermometer?",
      answer:
        "Insert the thermometer into the thickest part of the meat, avoiding bone or fat. Wait for the reading to stabilize before recording. Clean the thermometer after each use to prevent cross-contamination.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(
    field: keyof typeof inputs,
    value: string
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
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">
                Imperial (°F, Lbs)
              </SelectItem>
              <SelectItem value="metric">Metric (°C, Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type Select */}
      <div className="space-y-1">
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat / Food Type
        </Label>
        <Select
          id="meatType"
          value={inputs.meatType || ""}
          onValueChange={(val) => handleInputChange("meatType", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Meat Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beef_steak">Beef Steak</SelectItem>
            <SelectItem value="beef_roast">Beef Roast</SelectItem>
            <SelectItem value="pork">Pork (Chops, Roasts)</SelectItem>
            <SelectItem value="poultry_whole">Poultry (Whole Chicken/Turkey)</SelectItem>
            <SelectItem value="poultry_ground">Poultry (Ground)</SelectItem>
            <SelectItem value="fish">Fish</SelectItem>
            <SelectItem value="ground_beef">Ground Beef</SelectItem>
            <SelectItem value="ground_pork">Ground Pork</SelectItem>
            <SelectItem value="ground_turkey">Ground Turkey</SelectItem>
            <SelectItem value="egg_dishes">Egg Dishes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Internal Temperature Input */}
      <div className="space-y-1">
        <Label htmlFor="internalTemp" className="text-slate-700 dark:text-slate-300">
          Measured Internal Temperature ({unit === "imperial" ? "°F" : "°C"})
        </Label>
        <Input
          id="internalTemp"
          type="number"
          min="0"
          step="0.1"
          placeholder={`Enter temperature in ${unit === "imperial" ? "°F" : "°C"}`}
          value={inputs.internalTemp || ""}
          onChange={(e) => handleInputChange("internalTemp", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
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
              <strong>Chef's Tip:</strong> Always use a calibrated digital
              thermometer inserted into the thickest part of the meat, avoiding
              bone or fat, for accurate temperature readings.
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
          Understanding Safe Internal Temperature Checker
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ensuring that meat, poultry, and fish reach their safe internal
          temperatures is critical to preventing foodborne illnesses. The USDA
          provides clear guidelines on the minimum temperatures required to
          destroy harmful bacteria such as Salmonella and E. coli. This tool
          helps you verify if your cooked food has reached those temperatures,
          keeping your meals safe and delicious.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Danger Zone, between 40°F and 140°F (4°C - 60°C), is where
          bacteria multiply rapidly. Holding food in this range for extended
          periods increases the risk of contamination. Using a food thermometer
          is the most reliable way to ensure your food is safe to eat.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This checker is designed for home cooks and professionals alike to
          quickly assess if your meat or poultry has reached a safe internal
          temperature. Select the type of meat, enter the measured temperature,
          and choose your preferred unit system. The tool will instantly tell
          you if it’s safe to eat or if further cooking is needed.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the correct meat or food type from
            the dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Measure the internal temperature using a
            calibrated food thermometer.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the temperature and select your unit
            system (°F or °C).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see if your food is safe
            to eat or if it needs more cooking.
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
              href="https://www.usda.gov/food-safety"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA recommendations for safe internal cooking temperatures
              to prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. FDA Food Handling Practices
            </a>
            <p className="text-slate-500 text-sm">
              FDA guidelines on safe food handling, storage, and cooking temperatures.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-use-a-meat-thermometer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats: How to Use a Meat Thermometer
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on selecting and using thermometers for accurate cooking.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Safe Internal Temperature Checker"
      description="Check safe internal food temperatures. Reference USDA guidelines for meat, poultry, and fish to prevent foodborne illness."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Is Safe = (Measured Internal Temperature ≥ USDA Recommended Temperature)",
        variables: [
          { symbol: "Measured Internal Temperature", description: "Input temperature of the food" },
          { symbol: "USDA Recommended Temperature", description: "Safe minimum internal temperature for the selected meat type" },
          { symbol: "Is Safe", description: "Boolean indicating if food is safe to eat" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You cooked a chicken breast and measured an internal temperature of 160°F.",
        steps: [
          {
            label: "1",
            explanation:
              "Select 'Poultry (Whole Chicken/Turkey)' as meat type and enter 160°F as the internal temperature.",
          },
          {
            label: "2",
            explanation:
              "Compare the measured temperature (160°F) with USDA safe temp (165°F).",
          },
          {
            label: "3",
            explanation:
              "Since 160°F < 165°F, the tool indicates the chicken is not yet safe to eat.",
          },
        ],
        result:
          "Not safe yet ❌. Continue cooking until the internal temperature reaches at least 165°F.",
      }}
      relatedCalculators={[
        {
          title: "Sourdough Starter Ratio & Feed Planner",
          url: "/cooking/sourdough-starter-ratio-feed-planner",
          icon: "🍞",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "🍞",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🧁",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Safe Internal Temperature Checker" },
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