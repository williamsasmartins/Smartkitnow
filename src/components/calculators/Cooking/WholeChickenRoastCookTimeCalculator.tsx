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

export default function WholeChickenRoastCookTimeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: string;
    weight?: string;
    ovenTemp?: string;
  }>({
    meatType: "whole_chicken",
    weight: "",
    ovenTemp: unit === "imperial" ? "350" : "175",
  });

  // USDA recommended safe internal temps (°F and °C)
  // Whole chicken: 165°F / 74°C
  // Danger zone: 40°F - 140°F (4.4°C - 60°C)
  const USDA_SAFE_TEMP_F = 165;
  const USDA_SAFE_TEMP_C = 74;
  const DANGER_ZONE_LOW_F = 40;
  const DANGER_ZONE_HIGH_F = 140;
  const DANGER_ZONE_LOW_C = 4.4;
  const DANGER_ZONE_HIGH_C = 60;

  // Meat types and their typical roasting multipliers (minutes per pound/kg)
  // Source: USDA, Serious Eats
  // Whole chicken: 20 min/lb at 350°F (175°C)
  // Whole duck: ~18 min/lb
  // Whole turkey: ~15 min/lb (not primary here but included for extensibility)
  // Beef roast (medium rare): ~20 min/lb (not poultry, but placeholder)
  const MEAT_COOK_TIME_PER_UNIT: Record<
    string,
    { imperial: number; metric: number; safeInternalTempF: number; safeInternalTempC: number }
  > = {
    whole_chicken: {
      imperial: 20,
      metric: 44, // 44 min/kg (approx 20 min/lb * 2.2)
      safeInternalTempF: 165,
      safeInternalTempC: 74,
    },
    whole_duck: {
      imperial: 18,
      metric: 40,
      safeInternalTempF: 165,
      safeInternalTempC: 74,
    },
    whole_turkey: {
      imperial: 15,
      metric: 33,
      safeInternalTempF: 165,
      safeInternalTempC: 74,
    },
    beef_roast: {
      imperial: 20,
      metric: 44,
      safeInternalTempF: 145, // USDA medium rare safe temp
      safeInternalTempC: 63,
    },
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const meatType = inputs.meatType || "whole_chicken";
    const weightRaw = inputs.weight || "";
    const ovenTempRaw = inputs.ovenTemp || (unit === "imperial" ? "350" : "175");

    // Parse weight and oven temp
    const weight = parseFloat(weightRaw);
    const ovenTemp = parseFloat(ovenTempRaw);

    if (isNaN(weight) || weight <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: null,
        warning: null,
      };
    }
    if (isNaN(ovenTemp) || ovenTemp <= 0) {
      return {
        value: 0,
        label: "Please enter a valid oven temperature",
        subtext: null,
        warning: null,
      };
    }

    // Get cook time per unit weight
    const cookTimePerUnit = MEAT_COOK_TIME_PER_UNIT[meatType]
      ? unit === "imperial"
        ? MEAT_COOK_TIME_PER_UNIT[meatType].imperial
        : MEAT_COOK_TIME_PER_UNIT[meatType].metric
      : unit === "imperial"
      ? 20
      : 44;

    // Calculate base cook time (minutes)
    // Formula: Cook Time (min) = Weight * Cook Time per unit weight
    // Adjust cook time if oven temp differs from standard 350°F/175°C:
    // Rough adjustment: For every 25°F (14°C) difference, adjust time by 10%
    // (Lower temp = longer cook, higher temp = shorter cook)
    const standardTemp = unit === "imperial" ? 350 : 175;
    const tempDiff = ovenTemp - standardTemp;
    const tempAdjustmentFactor = 1 - (tempDiff / (unit === "imperial" ? 25 : 14)) * 0.1;
    // Clamp adjustment factor between 0.7 and 1.3 to avoid extreme values
    const adjustmentFactor = Math.min(Math.max(tempAdjustmentFactor, 0.7), 1.3);

    let cookTime = weight * cookTimePerUnit * adjustmentFactor;

    // Round cook time to nearest whole minute
    cookTime = Math.round(cookTime);

    // Food safety warning if oven temp is in danger zone
    let warning: string | null = null;
    if (unit === "imperial") {
      if (ovenTemp > DANGER_ZONE_LOW_F && ovenTemp < DANGER_ZONE_HIGH_F) {
        warning =
          "Warning: Oven temperature is in the USDA 'Danger Zone' (40°F - 140°F). Cooking at this temperature may be unsafe.";
      }
    } else {
      if (ovenTemp > DANGER_ZONE_LOW_C && ovenTemp < DANGER_ZONE_HIGH_C) {
        warning =
          "Warning: Oven temperature is in the USDA 'Danger Zone' (4.4°C - 60°C). Cooking at this temperature may be unsafe.";
      }
    }

    // Result label with units
    const label = `Estimated Cook Time (${unit === "imperial" ? "minutes" : "minutes"})`;

    // Subtext with safe internal temp info
    const safeTempF = MEAT_COOK_TIME_PER_UNIT[meatType]?.safeInternalTempF || USDA_SAFE_TEMP_F;
    const safeTempC = MEAT_COOK_TIME_PER_UNIT[meatType]?.safeInternalTempC || USDA_SAFE_TEMP_C;
    const subtext = `Ensure internal temperature reaches at least ${unit === "imperial" ? safeTempF + "°F" : safeTempC + "°C"} for safe consumption (USDA recommended).`;

    return {
      value: cookTime,
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How do I know when my whole chicken is safely cooked?",
      answer:
        "The USDA recommends cooking whole chicken to an internal temperature of 165°F (74°C) to ensure all harmful bacteria are destroyed. Use a meat thermometer inserted into the thickest part of the thigh without touching bone. This guarantees safe and juicy poultry every time.",
    },
    {
      question: "Can I roast a chicken at temperatures other than 350°F?",
      answer:
        "Yes, you can roast at different temperatures, but cooking times will vary. Lower temperatures require longer cooking times, while higher temps shorten the time. Adjustments should be made carefully to avoid undercooking or drying out the meat.",
    },
    {
      question: "Why is it important to avoid the 'Danger Zone' temperature range?",
      answer:
        "The 'Danger Zone' (40°F - 140°F) is where bacteria multiply rapidly, increasing foodborne illness risk. Cooking or holding meat in this range for extended periods is unsafe. Always preheat your oven above this range before cooking poultry.",
    },
    {
      question: "Does the weight of the chicken affect cooking time?",
      answer:
        "Absolutely. Cooking time scales with weight—larger chickens require more time to reach safe internal temperatures. This calculator estimates time based on weight to help you achieve perfectly cooked poultry.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(
    field: "weight" | "ovenTemp" | "meatType",
    value: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // When unit changes, convert oven temp input accordingly
  // 350°F ≈ 175°C
  // Convert ovenTemp input between °F and °C
  function onUnitChange(newUnit: "imperial" | "metric") {
    if (newUnit === unit) return;
    let newOvenTemp = inputs.ovenTemp;
    if (inputs.ovenTemp) {
      const temp = parseFloat(inputs.ovenTemp);
      if (!isNaN(temp)) {
        if (newUnit === "metric") {
          // F to C
          newOvenTemp = ((temp - 32) * (5 / 9)).toFixed(0);
        } else {
          // C to F
          newOvenTemp = (temp * (9 / 5) + 32).toFixed(0);
        }
      }
    }
    setUnit(newUnit);
    setInputs((prev) => ({
      ...prev,
      ovenTemp: newOvenTemp,
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={onUnitChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (°F / Lbs)</SelectItem>
              <SelectItem value="metric">Metric (°C / Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type Select */}
      <div className="space-y-2">
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat Type
        </Label>
        <Select
          id="meatType"
          value={inputs.meatType}
          onValueChange={(val) => onInputChange("meatType", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select meat type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whole_chicken">Whole Chicken</SelectItem>
            <SelectItem value="whole_duck">Whole Duck</SelectItem>
            <SelectItem value="whole_turkey">Whole Turkey</SelectItem>
            <SelectItem value="beef_roast">Beef Roast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.1"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight || ""}
          onChange={(e) => onInputChange("weight", e.target.value)}
        />
      </div>

      {/* Oven Temperature Input */}
      <div className="space-y-2">
        <Label htmlFor="ovenTemp" className="text-slate-700 dark:text-slate-300">
          Oven Temperature ({unit === "imperial" ? "°F" : "°C"})
        </Label>
        <Input
          id="ovenTemp"
          type="number"
          min="50"
          max={unit === "imperial" ? 600 : 315}
          step="1"
          placeholder={`Enter oven temperature in ${unit === "imperial" ? "°F" : "°C"}`}
          value={inputs.ovenTemp || ""}
          onChange={(e) => onInputChange("ovenTemp", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              meatType: "whole_chicken",
              weight: "",
              ovenTemp: unit === "imperial" ? "350" : "175",
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
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

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
              <strong>Chef's Tip:</strong> Use a reliable meat thermometer to check the internal temperature for perfect doneness and food safety.
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
          Understanding Whole Chicken/Roast Cook Time Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Roasting a whole chicken or other poultry requires precise timing to ensure the meat is cooked safely and remains juicy. This estimator calculates the approximate roasting time based on the weight of the bird and the oven temperature, using trusted culinary standards and food safety guidelines.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The USDA recommends cooking poultry to an internal temperature of 165°F (74°C) to eliminate harmful bacteria. Cooking times vary depending on the size of the bird and the oven temperature. This tool adjusts the estimated time if you choose to roast at temperatures other than the standard 350°F (175°C).
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate estimate, enter the weight of your whole chicken or roast and the oven temperature you plan to use. Select the type of meat to tailor the calculation. Remember, this is an estimate; always verify doneness with a meat thermometer.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the meat type (e.g., whole chicken).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the weight in pounds or kilograms depending on your unit system.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your oven temperature. The default is 350°F (175°C), but you can adjust it.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see the estimated roasting time.
          </li>
          <li>
            <strong>Step 5:</strong> Use a meat thermometer to confirm the internal temperature reaches at least 165°F (74°C).
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Standard Ratios & References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-minimum-internal-temperature-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Safe Minimum Internal Temperature Chart
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines for safe cooking temperatures to prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-roast-a-chicken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Serious Eats: How to Roast a Chicken
            </a>
            <p className="text-slate-500 text-sm">
              Expert culinary advice on roasting poultry perfectly every time.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/baking-times"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. King Arthur Baking: Baking Times Guide
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive baking time charts and tips for various meats and roasts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Whole Chicken/Roast Cook Time Estimator"
      description="Estimate roasting time for whole chickens. Ensure perfectly cooked poultry by calculating oven time based on weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Cook Time (minutes) = Weight × Cook Time per Unit Weight × Oven Temperature Adjustment Factor",
        variables: [
          { symbol: "Weight", description: "Weight of the meat (lbs or kg)" },
          {
            symbol: "Cook Time per Unit Weight",
            description:
              "Standard cook time per pound or kilogram (e.g., 20 min/lb for chicken)",
          },
          {
            symbol: "Oven Temperature Adjustment Factor",
            description:
              "Adjustment based on difference from standard 350°F (175°C) oven temperature",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Estimating cook time for a 5 lb whole chicken roasted at 350°F (standard temp).",
        steps: [
          {
            label: "1",
            explanation:
              "Use standard cook time per pound for whole chicken: 20 minutes per lb.",
          },
          {
            label: "2",
            explanation: "Multiply weight by cook time per unit: 5 × 20 = 100 minutes.",
          },
          {
            label: "3",
            explanation:
              "Since oven temp is standard 350°F, adjustment factor is 1, so final cook time is 100 minutes.",
          },
        ],
        result: "Estimated cook time: 100 minutes (1 hour 40 minutes).",
      }}
      relatedCalculators={[
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍳",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "⚖️",
        },
        {
          title: "Stock/Broth Reduction Time & Yield",
          url: "/cooking/stock-broth-reduction-time-yield",
          icon: "🥩",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🧁",
        },
        {
          title: "Turkey Size, Thaw & Cook Time Calculator",
          url: "/cooking/turkey-thaw-cook-time",
          icon: "🥩",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Whole Chicken/Roast Cook Time Estimator" },
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