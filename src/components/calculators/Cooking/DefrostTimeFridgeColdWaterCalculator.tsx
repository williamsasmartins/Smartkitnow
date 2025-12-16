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
  | "beef"
  | "pork"
  | "chicken"
  | "turkey"
  | "lamb"
  | "fish"
  | "ground_beef"
  | "ground_pork";

const USDA_SAFE_INTERNAL_TEMPS_F = {
  beef: 145,
  pork: 145,
  chicken: 165,
  turkey: 165,
  lamb: 145,
  fish: 145,
  ground_beef: 160,
  ground_pork: 160,
};

const USDA_SAFE_INTERNAL_TEMPS_C = {
  beef: 63,
  pork: 63,
  chicken: 74,
  turkey: 74,
  lamb: 63,
  fish: 63,
  ground_beef: 71,
  ground_pork: 71,
};

// Defrost time constants (hours per pound/kg) based on USDA guidelines and common culinary practice
// Fridge defrost: ~24 hours per 5 lbs (2.27 kg) => ~4.4 hours per lb or ~10.5 hours per kg
// Cold water defrost: ~30 minutes per pound (0.5 hr/lb) or ~1.1 hr/kg
// We'll use these as base multipliers

const DEFROST_TIME_FRIDGE_HR_PER_LB = 4.4;
const DEFROST_TIME_COLD_WATER_HR_PER_LB = 0.5;

const DEFROST_TIME_FRIDGE_HR_PER_KG = 10.5;
const DEFROST_TIME_COLD_WATER_HR_PER_KG = 1.1;

// Danger zone temps in °F and °C
const DANGER_ZONE_F = { min: 40, max: 140 };
const DANGER_ZONE_C = { min: 4.4, max: 60 };

export default function DefrostTimeFridgeColdWaterCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    meatType?: MeatType;
    weight?: string;
    method?: "fridge" | "cold_water";
    currentTemp?: string;
  }>({
    meatType: "chicken",
    weight: "",
    method: "fridge",
    currentTemp: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = inputs.weight?.trim() || "";
    const weightNum = parseFloat(weightRaw);
    if (
      !inputs.meatType ||
      !weightRaw ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !inputs.method
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Calculate defrost time based on method and unit
    let defrostHours = 0;
    if (unit === "imperial") {
      // weight in lbs
      if (inputs.method === "fridge") {
        defrostHours = weightNum * DEFROST_TIME_FRIDGE_HR_PER_LB;
      } else {
        defrostHours = weightNum * DEFROST_TIME_COLD_WATER_HR_PER_LB;
      }
    } else {
      // metric: weight in kg
      if (inputs.method === "fridge") {
        defrostHours = weightNum * DEFROST_TIME_FRIDGE_HR_PER_KG;
      } else {
        defrostHours = weightNum * DEFROST_TIME_COLD_WATER_HR_PER_KG;
      }
    }

    // Round to 1 decimal place
    defrostHours = Math.round(defrostHours * 10) / 10;

    // Check temperature danger zone warning
    let warning: string | null = null;
    if (inputs.currentTemp) {
      const tempNum = parseFloat(inputs.currentTemp);
      if (!isNaN(tempNum)) {
        if (unit === "imperial") {
          if (
            tempNum >= DANGER_ZONE_F.min &&
            tempNum <= DANGER_ZONE_F.max
          ) {
            warning =
              "Warning: The current temperature is in the USDA Danger Zone (40°F - 140°F). Keep meat refrigerated or frozen to avoid bacterial growth.";
          }
        } else {
          if (
            tempNum >= DANGER_ZONE_C.min &&
            tempNum <= DANGER_ZONE_C.max
          ) {
            warning =
              "Warning: The current temperature is in the USDA Danger Zone (4.4°C - 60°C). Keep meat refrigerated or frozen to avoid bacterial growth.";
          }
        }
      }
    }

    // Label with method and unit
    const unitLabel = unit === "imperial" ? "hours" : "hours";
    const methodLabel =
      inputs.method === "fridge"
        ? "Fridge Defrost Time"
        : "Cold Water Defrost Time";

    return {
      value: defrostHours,
      label: `${methodLabel} (${unitLabel})`,
      subtext: `Estimated time to safely defrost ${weightNum} ${
        unit === "imperial" ? "lbs" : "kg"
      } of ${inputs.meatType.replace("_", " ")}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How long does it take to defrost meat in the fridge?",
      answer:
        "Defrosting meat in the fridge is the safest method and typically takes about 24 hours for every 5 pounds (2.27 kg) of meat. This slow thawing keeps the meat at a safe temperature, minimizing bacterial growth. Always plan ahead to allow enough time for complete thawing.",
    },
    {
      question: "Is it safe to defrost meat in cold water?",
      answer:
        "Yes, defrosting meat in cold water is safe if done correctly. The meat must be in a leak-proof bag and submerged in cold water, changing the water every 30 minutes. This method is faster than fridge thawing but requires more attention to maintain safe temperatures.",
    },
    {
      question: "What is the USDA Danger Zone for food safety?",
      answer:
        "The USDA Danger Zone is the temperature range between 40°F and 140°F (4.4°C and 60°C) where bacteria can multiply rapidly. Food should not be left in this range for more than 2 hours to prevent foodborne illness. Always keep meat refrigerated or frozen until ready to thaw.",
    },
    {
      question: "Can I defrost meat at room temperature?",
      answer:
        "Defrosting meat at room temperature is not recommended due to the risk of bacterial growth in the Danger Zone. Instead, use the fridge or cold water methods for safe thawing. Proper thawing ensures food safety and maintains meat quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(
    field: keyof typeof inputs,
    value: string | MeatType | "fridge" | "cold_water"
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Reset inputs
  function resetForm() {
    setInputs({
      meatType: "chicken",
      weight: "",
      method: "fridge",
      currentTemp: "",
    });
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
                Imperial (lbs / °F)
              </SelectItem>
              <SelectItem value="metric">Metric (kg / °C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meat Type */}
      <div className="space-y-1">
        <Label htmlFor="meatType" className="text-slate-700 dark:text-slate-300">
          Meat Type
        </Label>
        <Select
          id="meatType"
          value={inputs.meatType}
          onValueChange={(val) =>
            handleInputChange("meatType", val as MeatType)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beef">Beef</SelectItem>
            <SelectItem value="pork">Pork</SelectItem>
            <SelectItem value="chicken">Chicken</SelectItem>
            <SelectItem value="turkey">Turkey</SelectItem>
            <SelectItem value="lamb">Lamb</SelectItem>
            <SelectItem value="fish">Fish</SelectItem>
            <SelectItem value="ground_beef">Ground Beef</SelectItem>
            <SelectItem value="ground_pork">Ground Pork</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight || ""}
          onChange={(e) => handleInputChange("weight", e.target.value)}
        />
      </div>

      {/* Defrost Method */}
      <div className="space-y-1">
        <Label htmlFor="method" className="text-slate-700 dark:text-slate-300">
          Defrost Method
        </Label>
        <Select
          id="method"
          value={inputs.method}
          onValueChange={(val) =>
            handleInputChange("method", val as "fridge" | "cold_water")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fridge">Refrigerator (Slow & Safe)</SelectItem>
            <SelectItem value="cold_water">Cold Water (Faster)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Current Temperature */}
      <div className="space-y-1">
        <Label
          htmlFor="currentTemp"
          className="text-slate-700 dark:text-slate-300"
        >
          Current Temperature ({unit === "imperial" ? "°F" : "°C"}){" "}
          <span className="text-xs text-slate-400">(Optional)</span>
        </Label>
        <Input
          id="currentTemp"
          type="number"
          step="any"
          placeholder={`Enter current temp in ${
            unit === "imperial" ? "°F" : "°C"
          }`}
          value={inputs.currentTemp || ""}
          onChange={(e) => handleInputChange("currentTemp", e.target.value)}
        />
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
          onClick={resetForm}
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
              <strong>Chef's Tip:</strong> Always defrost meat in the fridge
              whenever possible for best food safety. Use cold water thawing
              only when you need faster results, and never thaw at room
              temperature.
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
          Defrosting meat safely is crucial to prevent foodborne illnesses and
          maintain quality. This estimator calculates the approximate time
          needed to thaw various types of meat based on weight, defrost method,
          and unit system. It incorporates USDA guidelines to ensure food
          safety and practical kitchen timing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The refrigerator method is the safest but slowest, requiring roughly
          24 hours per 5 pounds of meat. Cold water thawing is faster but
          demands careful attention to water temperature and frequent changes.
          This tool also warns if the current temperature input falls within the
          USDA Danger Zone, where bacteria can proliferate rapidly.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this estimator, select your preferred unit system (Imperial or
          Metric), choose the type of meat, enter the weight, and pick the
          defrost method. Optionally, input the current temperature to receive a
          safety warning if it falls within the danger zone.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the meat type you plan to defrost.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the weight of the meat in your chosen
            unit.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the defrost method: Refrigerator or
            Cold Water.
          </li>
          <li>
            <strong>Step 4:</strong> (Optional) Enter the current temperature to
            check for food safety warnings.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to see the estimated defrost
            time.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-thawing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Safe Thawing Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA recommendations on safe thawing methods and times to
              prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. FDA Food Safety Basics
            </a>
            <p className="text-slate-500 text-sm">
              FDA guidelines on food safety including temperature danger zones
              and proper handling.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/bakers-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. King Arthur Baking - Baker's Math
            </a>
            <p className="text-slate-500 text-sm">
              While not directly related to defrosting, King Arthur's baking
              math principles provide foundational culinary calculations.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Defrost Time (hours) = Weight × Rate (hours per unit weight, varies by method and unit system)",
        variables: [
          { symbol: "Weight", description: "Weight of meat (lbs or kg)" },
          {
            symbol: "Rate",
            description:
              "Defrost rate (hours per lb or kg), e.g. 4.4 hr/lb for fridge thaw",
          },
          {
            symbol: "Defrost Time",
            description: "Estimated defrost time in hours",
          },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Calculate defrost time for 3 lbs of chicken using refrigerator thawing.",
        steps: [
          {
            label: "1",
            explanation:
              "Use fridge thaw rate: 4.4 hours per pound (USDA guideline).",
          },
          {
            label: "2",
            explanation: "Multiply weight by rate: 3 lbs × 4.4 hr/lb = 13.2 hours.",
          },
        ],
        result: "Estimated defrost time: 13.2 hours in the refrigerator.",
      }}
      relatedCalculators={[
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍞",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Chocolate/Butter Tempering Temperature",
          url: "/cooking/chocolate-butter-tempering-temperature",
          icon: "🌡️",
        },
        {
          title: "Rice:Water Ratio & Yield Calculator",
          url: "/cooking/rice-water-ratio-yield",
          icon: "📏",
        },
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Defrost Time Estimator" },
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