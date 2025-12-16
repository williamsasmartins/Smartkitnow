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

export default function TurkeyThawCookTimeCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    weight: string;
    meatType: string;
    thawTemp: string;
  }>({
    weight: "",
    meatType: "whole_turkey",
    thawTemp: unit === "imperial" ? "40" : "4.4",
  });

  // 2. CONSTANTS & DATA

  // USDA recommended safe internal temperatures (°F and °C)
  const safeTemps = {
    whole_turkey: { f: 165, c: 74 },
    turkey_breast: { f: 165, c: 74 },
    ground_turkey: { f: 165, c: 74 },
  };

  // Danger zone temps (°F and °C)
  const dangerZoneF = { min: 40, max: 140 };
  const dangerZoneC = { min: 4.4, max: 60 };

  // Thawing time per pound/kg (USDA guideline)
  // Refrigerator thawing: approx 24 hours per 4-5 lbs (1.8-2.3 kg)
  // We'll use 24 hours per 4.5 lbs (2.04 kg)
  // So: thawTimeHours = weight / 4.5 * 24 (imperial)
  // thawTimeHours = weight / 2.04 * 24 (metric)
  // For safety, we round up thaw time.

  // Cooking time per pound/kg (Oven roasting at 325°F / 163°C)
  // Whole turkey: 13 min per lb (imperial), 28.7 min per kg (metric)
  // Turkey breast: 20 min per lb, 44 min per kg
  // Ground turkey: 15 min per lb, 33 min per kg

  // Weight limits (for validation)
  const weightLimits = {
    min: unit === "imperial" ? 1 : 0.5,
    max: unit === "imperial" ? 30 : 14,
  };

  // 3. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const thawTempNum = parseFloat(inputs.thawTemp);

    if (
      !weightNum ||
      weightNum < weightLimits.min ||
      weightNum > weightLimits.max ||
      isNaN(thawTempNum)
    ) {
      return {
        value: 0,
        label: "Please enter valid weight and temperature",
        subtext: "",
        warning: null,
      };
    }

    // Calculate thaw time (hours)
    let thawTimeHours = 0;
    if (unit === "imperial") {
      thawTimeHours = (weightNum / 4.5) * 24;
    } else {
      thawTimeHours = (weightNum / 2.04) * 24;
    }
    thawTimeHours = Math.ceil(thawTimeHours);

    // Calculate cook time (minutes)
    let cookTimeMinutes = 0;
    switch (inputs.meatType) {
      case "whole_turkey":
        cookTimeMinutes =
          unit === "imperial" ? weightNum * 13 : weightNum * 28.7;
        break;
      case "turkey_breast":
        cookTimeMinutes =
          unit === "imperial" ? weightNum * 20 : weightNum * 44;
        break;
      case "ground_turkey":
        cookTimeMinutes =
          unit === "imperial" ? weightNum * 15 : weightNum * 33;
        break;
      default:
        cookTimeMinutes = 0;
    }
    cookTimeMinutes = Math.ceil(cookTimeMinutes);

    // Safe internal temp for selected meat type
    const safeTemp =
      safeTemps[inputs.meatType as keyof typeof safeTemps][
        unit === "imperial" ? "f" : "c"
      ];

    // Danger zone warning for thaw temp
    let warning = null;
    if (unit === "imperial") {
      if (
        thawTempNum >= dangerZoneF.min &&
        thawTempNum <= dangerZoneF.max
      ) {
        warning =
          "Warning: Thawing temperature is in the USDA Danger Zone (40°F - 140°F). Bacteria can multiply rapidly. Use refrigerator thawing for safety.";
      }
    } else {
      if (
        thawTempNum >= dangerZoneC.min &&
        thawTempNum <= dangerZoneC.max
      ) {
        warning =
          "Warning: Thawing temperature is in the USDA Danger Zone (4.4°C - 60°C). Bacteria can multiply rapidly. Use refrigerator thawing for safety.";
      }
    }

    // Format output strings
    const thawTimeLabel =
      unit === "imperial"
        ? `${thawTimeHours} hour${thawTimeHours > 1 ? "s" : ""}`
        : `${thawTimeHours} hour${thawTimeHours > 1 ? "s" : ""}`;
    const cookTimeLabel =
      unit === "imperial"
        ? `${Math.floor(cookTimeMinutes / 60)}h ${cookTimeMinutes % 60}m`
        : `${Math.floor(cookTimeMinutes / 60)}h ${cookTimeMinutes % 60}m`;

    return {
      value: 1,
      label: "Turkey Thaw & Cook Times",
      subtext: (
        <>
          <p>
            <strong>Thawing Time:</strong> {thawTimeLabel} (refrigerator thawing)
          </p>
          <p>
            <strong>Cooking Time:</strong> {cookTimeLabel} at 325°F (163°C)
          </p>
          <p>
            <strong>Safe Internal Temperature:</strong> {safeTemp}°
            {unit === "imperial" ? "F" : "C"} (USDA recommended)
          </p>
        </>
      ),
      warning,
    };
  }, [inputs, unit]);

  // 4. FAQS
  const faqs = [
    {
      question: "How long should I thaw my turkey safely?",
      answer:
        "The USDA recommends thawing your turkey in the refrigerator, allowing approximately 24 hours for every 4 to 5 pounds (about 1.8 to 2.3 kg). This method keeps the bird at a safe temperature, preventing bacterial growth.",
    },
    {
      question: "What is the safe internal temperature for cooked turkey?",
      answer:
        "According to USDA guidelines, turkey should reach an internal temperature of 165°F (74°C) to ensure all harmful bacteria are destroyed, guaranteeing a safe and juicy roast.",
    },
    {
      question: "Can I thaw turkey at room temperature?",
      answer:
        "No, thawing turkey at room temperature is unsafe as it allows the outer layers to enter the bacterial danger zone (40°F - 140°F / 4.4°C - 60°C) while the inside remains frozen. Always thaw in the refrigerator or cold water.",
    },
    {
      question: "How do cooking times vary between whole turkey and turkey breast?",
      answer:
        "Whole turkeys generally require about 13 minutes per pound at 325°F, while turkey breasts need approximately 20 minutes per pound. Ground turkey cooks faster, around 15 minutes per pound, due to its density and surface area.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 5. HANDLERS
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // When unit changes, convert thawTemp to new unit for UX consistency
  function handleUnitChange(value: "imperial" | "metric") {
    if (value === unit) return;
    let newThawTemp = inputs.thawTemp;
    const tempNum = parseFloat(inputs.thawTemp);
    if (!isNaN(tempNum)) {
      if (value === "imperial") {
        // C to F
        newThawTemp = ((tempNum * 9) / 5 + 32).toFixed(1);
      } else {
        // F to C
        newThawTemp = (((tempNum - 32) * 5) / 9).toFixed(1);
      }
    }
    setUnit(value);
    setInputs((prev) => ({ ...prev, thawTemp: newThawTemp }));
  }

  // 6. UI WIDGET
  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">
                Imperial (Lbs / °F)
              </SelectItem>
              <SelectItem value="metric">Metric (Kg / °C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type Select */}
      <div>
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat Type
        </Label>
        <Select
          id="meatType"
          name="meatType"
          value={inputs.meatType}
          onChange={handleInputChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whole_turkey">Whole Turkey</SelectItem>
            <SelectItem value="turkey_breast">Turkey Breast</SelectItem>
            <SelectItem value="ground_turkey">Ground Turkey</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min={weightLimits.min}
          max={weightLimits.max}
          step="0.1"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={handleInputChange}
          aria-describedby="weightHelp"
        />
        <p
          id="weightHelp"
          className="text-xs text-slate-500 dark:text-slate-400 mt-1"
        >
          Acceptable range: {weightLimits.min} - {weightLimits.max}{" "}
          {unit === "imperial" ? "lbs" : "kg"}
        </p>
      </div>

      {/* Thawing Temperature Input */}
      <div>
        <Label htmlFor="thawTemp" className="text-slate-700 dark:text-slate-300">
          Thawing Temperature ({unit === "imperial" ? "°F" : "°C"})
        </Label>
        <Input
          id="thawTemp"
          name="thawTemp"
          type="number"
          step="0.1"
          placeholder={`Recommended: ${
            unit === "imperial" ? "40" : "4.4"
          }`}
          value={inputs.thawTemp}
          onChange={handleInputChange}
          aria-describedby="thawTempHelp"
        />
        <p
          id="thawTempHelp"
          className="text-xs text-slate-500 dark:text-slate-400 mt-1"
        >
          Keep thawing temperature below 40°F (4.4°C) for safety.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              meatType: "whole_turkey",
              thawTemp: unit === "imperial" ? "40" : "4.4",
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
                🦃
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              <div className="text-sm text-slate-500 mt-2 space-y-2">
                {results.subtext}
              </div>

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
              <strong>Chef's Tip:</strong> Always use a meat thermometer to
              verify the internal temperature reaches USDA recommended levels
              for safety and juiciness.
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
          Understanding Turkey Size, Thaw & Cook Time Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Planning the perfect turkey roast requires precise timing to ensure
          food safety and optimal flavor. This calculator helps you estimate
          thawing and cooking times based on your turkey's weight and type,
          whether it's a whole bird, breast, or ground turkey. It incorporates
          USDA guidelines to keep your meal safe and delicious.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Thawing is a critical step; improper thawing can lead to bacterial
          growth in the danger zone between 40°F and 140°F (4.4°C and 60°C).
          This tool advises on safe thawing temperatures and times to keep your
          turkey fresh. Cooking times vary by cut and weight, and this
          calculator provides accurate estimates for oven roasting at 325°F
          (163°C).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this calculator ensures you serve a juicy, safely cooked turkey
          every time. It is designed for home cooks and professionals alike,
          combining culinary science with practical kitchen wisdom.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate results, enter your turkey's weight and
          select the correct meat type. Adjust the thawing temperature based on
          your refrigerator or thawing environment. Click calculate to see
          recommended thaw and cook times.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric)
            that matches your measuring tools.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the turkey type: whole, breast, or
            ground.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the weight accurately. Use a kitchen
            scale if possible.
          </li>
          <li>
            <strong>Step 4:</strong> Input the thawing temperature. Keep it
            below 40°F (4.4°C) for safe thawing.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate and follow the thaw and
            cook time recommendations.
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
              href="https://www.usda.gov/media/blog/2013/11/26/food-safety-thawing-turkey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Turkey Thawing & Cooking Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA recommendations on safe thawing and cooking times
              for turkey to prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. FDA Food Safety Handling
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines on safe food handling temperatures and practices.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-cook-turkey-thawing-roasting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats Turkey Roasting Guide
            </a>
            <p className="text-slate-500 text-sm">
              Expert tips on roasting turkey perfectly, including timing and
              temperature advice.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Thaw Time (hours) = ceil((Weight / 4.5) * 24) [lbs/imperial] or ceil((Weight / 2.04) * 24) [kg/metric]; Cook Time (minutes) = ceil(Weight * Rate), Rate depends on meat type (e.g., 13 min/lb for whole turkey)",
        variables: [
          { symbol: "Weight", description: "Turkey weight in lbs or kg" },
          {
            symbol: "Thaw Time",
            description:
              "Recommended thawing time in hours (refrigerator method)",
          },
          {
            symbol: "Cook Time",
            description:
              "Estimated cooking time in minutes at 325°F (163°C) oven temperature",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You have a 12 lb whole turkey and want to know thaw and cook times.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate thaw time: (12 / 4.5) * 24 = 64 hours (approx 3 days).",
          },
          {
            label: "2",
            explanation:
              "Calculate cook time: 12 lbs * 13 min/lb = 156 minutes (2h 36m).",
          },
          {
            label: "3",
            explanation:
              "Ensure internal temp reaches 165°F (74°C) before serving.",
          },
        ],
        result:
          "Thaw for 3 days in refrigerator, then roast for about 2 hours 36 minutes.",
      }}
      relatedCalculators={[
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍳",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "⚖️",
        },
        {
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "📏",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Turkey Size, Thaw & Cook Time Calculator",
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