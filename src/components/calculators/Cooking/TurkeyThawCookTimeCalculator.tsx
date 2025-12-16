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
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TurkeyThawCookTimeCalculator() {
  // State for unit system and inputs
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    weight?: number; // pounds or grams depending on unit
    thawTemp?: number; // °F or °C depending on unit
    cookTemp?: number; // °F or °C depending on unit
  }>({
    weight: undefined,
    thawTemp: 40, // default fridge temp °F
    cookTemp: 325, // default oven temp °F
  });

  // Constants for calculations
  const USDA_SAFE_MIN_F = 165; // °F safe internal temp for turkey
  const DANGER_ZONE_F_LOW = 40;
  const DANGER_ZONE_F_HIGH = 140;

  const USDA_SAFE_MIN_C = 74; // °C safe internal temp for turkey
  const DANGER_ZONE_C_LOW = 4.4;
  const DANGER_ZONE_C_HIGH = 60;

  // Conversion helpers
  const lbToGrams = 453.59237;
  const gramsToLb = 1 / lbToGrams;
  const fToC = (f: number) => ((f - 32) * 5) / 9;
  const cToF = (c: number) => (c * 9) / 5 + 32;

  // Culinary logic:
  // Thawing time: USDA recommends 24 hours of thawing per 4-5 pounds in refrigerator (~40°F)
  // Cooking time: 13 minutes per pound at 325°F oven temperature (typical roasting temp)
  // Adjust cooking time if oven temp differs from 325°F (linear approx)
  // Warn if thaw or cook temp is in danger zone

  // Calculate results and warnings in useMemo
  const results = useMemo(() => {
    // Destructure inputs with defaults
    const weightInput = inputs.weight ?? 0;
    const thawTempInput = inputs.thawTemp ?? (unit === "imperial" ? 40 : 4.4);
    const cookTempInput = inputs.cookTemp ?? (unit === "imperial" ? 325 : 163);

    // Validate weight
    if (weightInput <= 0 || isNaN(weightInput)) {
      return {
        value: 0,
        label: "Please enter a valid turkey weight.",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to pounds internally for calculation
    const weightLb = unit === "imperial" ? weightInput : weightInput * gramsToLb;

    // Thaw time calculation (in hours)
    // USDA: 24 hours per 4-5 pounds; use 24 hours per 4.5 pounds average
    const thawHours = (weightLb / 4.5) * 24;

    // Cooking time calculation (in minutes)
    // Base: 13 minutes per pound at 325°F
    // Adjust cooking time linearly by ratio of cookTempInput / 325°F
    // For metric, convert cookTempInput to °F first
    const cookTempF =
      unit === "imperial" ? cookTempInput : cToF(cookTempInput);
    const cookTimeMinutes = weightLb * 13 * (325 / cookTempF);

    // Format thaw time as days and hours
    const thawDays = Math.floor(thawHours / 24);
    const thawRemainderHours = Math.round(thawHours % 24);

    // Format cooking time as hours and minutes
    const cookHours = Math.floor(cookTimeMinutes / 60);
    const cookRemainderMinutes = Math.round(cookTimeMinutes % 60);

    // Prepare display strings
    const thawTimeStr =
      thawDays > 0
        ? `${thawDays} day${thawDays > 1 ? "s" : ""}${
            thawRemainderHours > 0 ? ` and ${thawRemainderHours} hour${thawRemainderHours > 1 ? "s" : ""}` : ""
          }`
        : `${thawRemainderHours} hour${thawRemainderHours !== 1 ? "s" : ""}`;

    const cookTimeStr =
      cookHours > 0
        ? `${cookHours} hour${cookHours > 1 ? "s" : ""}${
            cookRemainderMinutes > 0 ? ` and ${cookRemainderMinutes} minute${cookRemainderMinutes > 1 ? "s" : ""}` : ""
          }`
        : `${cookRemainderMinutes} minute${cookRemainderMinutes !== 1 ? "s" : ""}`;

    // Warnings for danger zone temps
    let warningMsg: string | null = null;

    // Check thaw temp danger zone
    if (unit === "imperial") {
      if (
        thawTempInput > DANGER_ZONE_F_LOW &&
        thawTempInput < DANGER_ZONE_F_HIGH
      ) {
        warningMsg =
          "Warning: Thaw temperature is in the USDA Danger Zone (40-140°F). This can promote bacterial growth.";
      }
      if (
        cookTempInput > DANGER_ZONE_F_LOW &&
        cookTempInput < DANGER_ZONE_F_HIGH
      ) {
        warningMsg = warningMsg
          ? warningMsg +
            " Also, cooking temperature is in the Danger Zone, which is unsafe."
          : "Warning: Cooking temperature is in the USDA Danger Zone (40-140°F). This is unsafe.";
      }
      if (cookTempInput < USDA_SAFE_MIN_F) {
        warningMsg = warningMsg
          ? warningMsg +
            ` Ensure the turkey reaches an internal temperature of at least ${USDA_SAFE_MIN_F}°F for safety.`
          : `Ensure the turkey reaches an internal temperature of at least ${USDA_SAFE_MIN_F}°F for safety.`;
      }
    } else {
      if (
        thawTempInput > DANGER_ZONE_C_LOW &&
        thawTempInput < DANGER_ZONE_C_HIGH
      ) {
        warningMsg =
          "Warning: Thaw temperature is in the USDA Danger Zone (4.4-60°C). This can promote bacterial growth.";
      }
      if (
        cookTempInput > DANGER_ZONE_C_LOW &&
        cookTempInput < DANGER_ZONE_C_HIGH
      ) {
        warningMsg = warningMsg
          ? warningMsg +
            " Also, cooking temperature is in the Danger Zone, which is unsafe."
          : "Warning: Cooking temperature is in the USDA Danger Zone (4.4-60°C). This is unsafe.";
      }
      if (cookTempInput < USDA_SAFE_MIN_C) {
        warningMsg = warningMsg
          ? warningMsg +
            ` Ensure the turkey reaches an internal temperature of at least ${USDA_SAFE_MIN_C}°C for safety.`
          : `Ensure the turkey reaches an internal temperature of at least ${USDA_SAFE_MIN_C}°C for safety.`;
      }
    }

    // Labels and subtexts
    const weightLabel =
      unit === "imperial"
        ? `${weightInput.toFixed(2)} lb turkey`
        : `${weightInput.toFixed(0)} g turkey`;

    const thawLabel = `Estimated thaw time: ${thawTimeStr}`;
    const cookLabel = `Estimated cook time at ${cookTempInput}°${unit === "imperial" ? "F" : "C"}: ${cookTimeStr}`;

    const displayValue = `${weightLabel}`;

    const subtext = `${thawLabel}. ${cookLabel}.`;

    return {
      value: displayValue,
      label: "Turkey Thaw & Cook Time",
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  // FAQ content
  const faqs = [
    {
      question: "How long does it take to thaw a frozen turkey safely?",
      answer:
        "Thawing a frozen turkey safely in the refrigerator typically requires about 24 hours for every 4 to 5 pounds of turkey. This slow thawing method keeps the bird at a safe temperature, preventing bacterial growth and ensuring even thawing throughout the meat.",
    },
    {
      question: "Why is it important to avoid the temperature danger zone when thawing?",
      answer:
        "The USDA Danger Zone between 40°F and 140°F (4.4°C and 60°C) is where bacteria multiply rapidly. Thawing turkey within this range can cause unsafe bacterial growth, increasing the risk of foodborne illness. Always thaw turkey in the refrigerator or cold water below 40°F.",
    },
    {
      question: "Can I cook a turkey at temperatures other than 325°F?",
      answer:
        "Yes, you can cook turkey at different oven temperatures, but cooking times will vary. Lower temperatures require longer cooking times, while higher temperatures cook faster but risk drying out the meat. Always ensure the internal temperature reaches at least 165°F (74°C) for safety.",
    },
    {
      question: "How do I know when my turkey is fully cooked and safe to eat?",
      answer:
        "Use a reliable meat thermometer to check the internal temperature of the turkey. The USDA recommends the thickest part of the breast and innermost part of the thigh reach at least 165°F (74°C). This ensures harmful bacteria are destroyed and the meat is safe to consume.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  const onWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputs((prev) => ({ ...prev, weight: isNaN(val) ? undefined : val }));
  };
  const onThawTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputs((prev) => ({ ...prev, thawTemp: isNaN(val) ? undefined : val }));
  };
  const onCookTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInputs((prev) => ({ ...prev, cookTemp: isNaN(val) ? undefined : val }));
  };

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as "imperial" | "metric")}>
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Turkey Weight ({unit === "imperial" ? "pounds (lb)" : "grams (g)"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step={unit === "imperial" ? 0.1 : 1}
            placeholder={unit === "imperial" ? "e.g. 12.5" : "e.g. 5670"}
            value={inputs.weight ?? ""}
            onChange={onWeightChange}
          />
        </div>

        <div>
          <Label htmlFor="thawTemp" className="text-slate-700 dark:text-slate-300">
            Thawing Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="thawTemp"
            type="number"
            min={unit === "imperial" ? 32 : 0}
            max={unit === "imperial" ? 50 : 10}
            step={unit === "imperial" ? 1 : 0.1}
            placeholder={unit === "imperial" ? "40 (fridge temp)" : "4.4 (fridge temp)"}
            value={inputs.thawTemp ?? ""}
            onChange={onThawTempChange}
          />
        </div>

        <div>
          <Label htmlFor="cookTemp" className="text-slate-700 dark:text-slate-300">
            Cooking Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="cookTemp"
            type="number"
            min={unit === "imperial" ? 200 : 90}
            max={unit === "imperial" ? 450 : 230}
            step={unit === "imperial" ? 5 : 1}
            placeholder={unit === "imperial" ? "325 (oven temp)" : "163 (oven temp)"}
            value={inputs.cookTemp ?? ""}
            onChange={onCookTempChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting inputs to current values
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: undefined,
              thawTemp: unit === "imperial" ? 40 : 4.4,
              cookTemp: unit === "imperial" ? 325 : 163,
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
              <strong>Chef's Tip:</strong> Use a digital meat thermometer to
              ensure your turkey reaches the safe internal temperature of 165°F
              (74°C) for juicy and safe results.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Turkey Size, Thaw & Cook Time Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Planning the perfect Thanksgiving turkey requires precise timing and
          temperature control to ensure a safe, juicy, and delicious roast.
          This calculator helps you estimate the necessary thawing and cooking
          times based on your turkey's weight and your kitchen temperatures.
          Understanding these factors is crucial to avoid undercooking or
          bacterial risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Thawing a turkey safely is as important as cooking it properly. The
          USDA recommends thawing in the refrigerator at temperatures below
          40°F (4.4°C) to prevent bacterial growth. The thawing time depends on
          the bird's weight, generally about 24 hours for every 4 to 5 pounds.
          Cooking times vary with oven temperature and turkey size, with a
          typical roasting temperature around 325°F (163°C).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool incorporates USDA safety guidelines and culinary best
          practices to provide you with accurate timing estimates. It also
          warns you if your thawing or cooking temperatures fall within the
          unsafe "danger zone" where bacteria can multiply rapidly. Use this
          calculator to plan your cooking schedule confidently and enjoy a
          perfectly roasted turkey.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the calculator, select your preferred unit system (Imperial or
          Metric), then enter the weight of your turkey. Adjust the thawing and
          cooking temperatures if needed, or leave them at the recommended
          defaults. Click "Calculate" to see the estimated thawing and cooking
          times along with any safety warnings.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose Imperial (pounds/°F) or Metric
            (grams/°C) units.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your turkey's weight in the chosen
            units.
          </li>
          <li>
            <strong>Step 3:</strong> Confirm or adjust the thawing temperature
            (default is refrigerator temperature).
          </li>
          <li>
            <strong>Step 4:</strong> Confirm or adjust the cooking temperature
            (default is 325°F/163°C).
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to get thaw and cook
            times, plus safety warnings.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/turkey-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Turkey Basics and Food Safety
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA guidelines on turkey thawing, cooking, and safety
              temperatures.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-cooking-temperature"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Safe Minimum Cooking Temperatures - FoodSafety.gov
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive chart of safe cooking temperatures for various
              meats including poultry.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cdc.gov/foodsafety/communication/steps-to-food-safety.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. CDC Food Safety Tips
            </a>
            <p className="text-slate-500 text-sm">
              Tips on safe food handling and avoiding the temperature danger
              zone.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Turkey Size, Thaw & Cook Time Calculator"
      description="Plan your Thanksgiving turkey. Calculate thawing time and cooking time based on bird weight for a safe and juicy roast."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Thaw Time (hours) = (Weight (lb) / 4.5) × 24; Cook Time (minutes) = Weight (lb) × 13 × (325 / Oven Temp (°F))",
        variables: [
          { symbol: "Weight (lb)", description: "Turkey weight in pounds" },
          {
            symbol: "Thaw Time (hours)",
            description: "Estimated thawing time in hours",
          },
          {
            symbol: "Cook Time (minutes)",
            description: "Estimated cooking time in minutes",
          },
          {
            symbol: "Oven Temp (°F)",
            description: "Cooking temperature in degrees Fahrenheit",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a 12-pound turkey and plan to cook it at 325°F after thawing in the refrigerator.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate thaw time: (12 lb / 4.5) × 24 = 64 hours (about 2 days and 16 hours).",
          },
          {
            label: "2",
            explanation:
              "Calculate cook time: 12 lb × 13 × (325 / 325) = 156 minutes (2 hours and 36 minutes).",
          },
          {
            label: "3",
            explanation:
              "Ensure the turkey reaches an internal temperature of 165°F for safety.",
          },
        ],
        result:
          "Thaw for approximately 2 days and 16 hours, then cook for about 2 hours and 36 minutes at 325°F.",
      }}
      relatedCalculators={[
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "🍳",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🍞",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
        {
          title: "Chocolate/Butter Tempering Temperature",
          url: "/cooking/chocolate-butter-tempering-temperature",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Turkey Size, Thaw & Cook Time Calculator",
        },
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