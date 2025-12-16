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
type ConversionType = "scale" | "convert" | "baking" | "meat" | "rice";

interface IngredientInfo {
  name: string;
  densityCupsToGrams: number; // grams per 1 cup (volume to weight)
  bakerPercentage?: boolean; // if true, used in baker's math
}

const INGREDIENTS: Record<string, IngredientInfo> = {
  flour_ap: { name: "All-Purpose Flour", densityCupsToGrams: 120, bakerPercentage: true },
  sugar_granulated: { name: "Granulated Sugar", densityCupsToGrams: 200 },
  butter: { name: "Butter", densityCupsToGrams: 227 }, // 1 cup butter = 227g (2 sticks)
  water: { name: "Water", densityCupsToGrams: 236 },
  rice_white: { name: "White Rice", densityCupsToGrams: 195 },
  salt: { name: "Salt", densityCupsToGrams: 288 },
  milk: { name: "Milk", densityCupsToGrams: 245 },
  honey: { name: "Honey", densityCupsToGrams: 340 },
  oil: { name: "Vegetable Oil", densityCupsToGrams: 218 },
  baking_powder: { name: "Baking Powder", densityCupsToGrams: 192 },
  yeast_active: { name: "Active Dry Yeast", densityCupsToGrams: 150 },
};

const MEAT_SAFE_TEMPS_F = {
  beef_steak: 145,
  ground_beef: 160,
  poultry: 165,
  pork: 145,
  fish: 145,
};

const RICE_WATER_RATIOS: Record<string, number> = {
  basmati: 1.5,
  jasmine: 1.75,
  brown: 2,
};

export default function RecipeScalerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [conversionType, setConversionType] = useState<ConversionType>("scale");

  // Common inputs
  const [scaleFactor, setScaleFactor] = useState<string>("1"); // e.g. 0.5, 2, 3
  // For ingredient conversion
  const [ingredient, setIngredient] = useState<string>("flour_ap");
  const [amount, setAmount] = useState<string>("");

  // From and To units for conversion (cups <-> grams)
  const [fromUnit, setFromUnit] = useState<string>("cups");
  const [toUnit, setToUnit] = useState<string>("grams");

  // For baking ratio (baker's math)
  const [flourWeight, setFlourWeight] = useState<string>(""); // base flour weight in grams or lbs
  const [ingredientWeight, setIngredientWeight] = useState<string>(""); // other ingredient weight
  const [ingredientForBaking, setIngredientForBaking] = useState<string>("water"); // default water

  // For meat temp calc
  const [meatType, setMeatType] = useState<string>("poultry");
  const [meatWeight, setMeatWeight] = useState<string>(""); // lbs or kg
  const [internalTemp, setInternalTemp] = useState<string>(""); // °F or °C

  // For rice calc
  const [riceType, setRiceType] = useState<string>("basmati");
  const [riceAmount, setRiceAmount] = useState<string>(""); // cups or grams

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Helper functions
    const parseNumber = (val: string) => {
      const n = parseFloat(val);
      return isNaN(n) || n <= 0 ? null : n;
    };

    // Convert cups to grams or grams to cups using density
    function convertVolumeWeight(
      ingredientKey: string,
      amount: number,
      from: "cups" | "grams",
      to: "cups" | "grams"
    ) {
      const info = INGREDIENTS[ingredientKey];
      if (!info) return null;
      if (from === to) return amount;
      if (from === "cups" && to === "grams") {
        return amount * info.densityCupsToGrams;
      }
      if (from === "grams" && to === "cups") {
        return amount / info.densityCupsToGrams;
      }
      return null;
    }

    // Scale ingredient amount by factor
    function scaleAmount(amount: number, factor: number) {
      return amount * factor;
    }

    // Baker's math: flour = 100%, other ingredient % = (ingredientWeight / flourWeight) * 100
    // Or scale ingredient weight by baker's % and flour weight
    function bakerPercentage(
      flourW: number,
      ingredientW: number,
      scale: number
    ) {
      if (flourW === 0) return null;
      const percent = (ingredientW / flourW) * 100;
      const scaledIngredient = (percent / 100) * flourW * scale;
      return { percent, scaledIngredient };
    }

    // Meat temp safety check
    function meatTempCheck(
      meat: string,
      temp: number,
      unitSys: UnitSystem
    ) {
      // Convert temp to F if metric
      let tempF = temp;
      if (unitSys === "metric") {
        tempF = temp * 9 / 5 + 32;
      }
      const safeTemp = MEAT_SAFE_TEMPS_F[meat];
      if (!safeTemp) return { safeTemp: null, warning: null };
      let warning = null;
      if (tempF < 40) {
        warning = "Temperature is below safe refrigeration temperature (40°F). Risk of bacterial growth.";
      } else if (tempF > 40 && tempF < safeTemp) {
        warning = `Warning: Temperature is in the USDA Danger Zone (40°F - 140°F) and below safe cooking temp (${safeTemp}°F).`;
      }
      return { safeTemp, warning };
    }

    // Rice water calculation
    function riceWaterCalc(rice: string, riceAmt: number, unitSys: UnitSystem) {
      const ratio = RICE_WATER_RATIOS[rice];
      if (!ratio) return null;
      // riceAmt in cups or grams
      // If metric and riceAmt in grams, convert to cups first (using density ~195g/cup)
      let riceCups = riceAmt;
      if (unitSys === "metric") {
        riceCups = riceAmt / INGREDIENTS["rice_white"].densityCupsToGrams;
      }
      const waterCups = riceCups * ratio;
      if (unitSys === "imperial") return { water: waterCups, unit: "cups" };
      // Convert water cups to grams (water density 236g/cup)
      return { water: waterCups * INGREDIENTS["water"].densityCupsToGrams, unit: "grams" };
    }

    // Parse inputs
    const factor = parseNumber(scaleFactor);
    if (!factor) {
      return {
        value: 0,
        label: "Invalid scale factor",
        subtext: "Please enter a valid scaling number (e.g., 0.5, 2, 3).",
        warning: null,
      };
    }

    if (conversionType === "scale") {
      // Scale ingredient amount by factor
      const amt = parseNumber(amount);
      if (!amt) {
        return {
          value: 0,
          label: "Invalid amount",
          subtext: "Please enter a valid ingredient amount.",
          warning: null,
        };
      }
      const scaled = scaleAmount(amt, factor);
      return {
        value: scaled.toFixed(2),
        label: `${ingredient ? INGREDIENTS[ingredient]?.name || "Ingredient" : "Ingredient"} scaled by x${factor}`,
        subtext: `Original amount: ${amt} ${fromUnit}`,
        warning: null,
      };
    }

    if (conversionType === "convert") {
      // Convert ingredient amount from cups <-> grams
      const amt = parseNumber(amount);
      if (!amt) {
        return {
          value: 0,
          label: "Invalid amount",
          subtext: "Please enter a valid amount to convert.",
          warning: null,
        };
      }
      if (fromUnit === toUnit) {
        return {
          value: amt.toFixed(2),
          label: `No conversion needed`,
          subtext: `Same units selected.`,
          warning: null,
        };
      }
      const converted = convertVolumeWeight(
        ingredient,
        amt,
        fromUnit as "cups" | "grams",
        toUnit as "cups" | "grams"
      );
      if (converted === null) {
        return {
          value: 0,
          label: "Conversion not possible",
          subtext: "Ingredient or units not supported.",
          warning: null,
        };
      }
      return {
        value: converted.toFixed(2),
        label: `${INGREDIENTS[ingredient]?.name || "Ingredient"} converted from ${fromUnit} to ${toUnit}`,
        subtext: `${amt} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`,
        warning: null,
      };
    }

    if (conversionType === "baking") {
      // Baker's math: calculate ingredient % or scale ingredient by factor
      const flourW = parseNumber(flourWeight);
      const ingrW = parseNumber(ingredientWeight);
      if (!flourW || !ingrW) {
        return {
          value: 0,
          label: "Invalid weights",
          subtext: "Please enter valid weights for flour and ingredient.",
          warning: null,
        };
      }
      const bakerResult = bakerPercentage(flourW, ingrW, factor);
      if (!bakerResult) {
        return {
          value: 0,
          label: "Calculation error",
          subtext: "Check your inputs.",
          warning: null,
        };
      }
      return {
        value: bakerResult.scaledIngredient.toFixed(2),
        label: `${INGREDIENTS[ingredientForBaking]?.name || "Ingredient"} scaled by x${factor}`,
        subtext: `Baker's %: ${bakerResult.percent.toFixed(1)}% (relative to flour weight)`,
        warning: null,
      };
    }

    if (conversionType === "meat") {
      // Meat safe temp check
      const temp = parseNumber(internalTemp);
      if (!temp) {
        return {
          value: 0,
          label: "Invalid temperature",
          subtext: "Please enter a valid internal temperature.",
          warning: null,
        };
      }
      const { safeTemp, warning } = meatTempCheck(meatType, temp, unit);
      return {
        value: temp.toFixed(1),
        label: `Internal Temp for ${meatType.replace("_", " ").toUpperCase()}`,
        subtext: safeTemp ? `USDA safe temp: ${safeTemp}°F` : "Safe temp not available",
        warning,
      };
    }

    if (conversionType === "rice") {
      // Rice water ratio calculator
      const riceAmtNum = parseNumber(riceAmount);
      if (!riceAmtNum) {
        return {
          value: 0,
          label: "Invalid rice amount",
          subtext: "Please enter a valid rice amount.",
          warning: null,
        };
      }
      const waterCalc = riceWaterCalc(riceType, riceAmtNum, unit);
      if (!waterCalc) {
        return {
          value: 0,
          label: "Calculation error",
          subtext: "Rice type not supported.",
          warning: null,
        };
      }
      return {
        value: waterCalc.water.toFixed(2),
        label: `Water needed for ${riceType.charAt(0).toUpperCase() + riceType.slice(1)} rice`,
        subtext: `Based on ${riceAmtNum} ${unit === "imperial" ? "cups" : "grams"} of rice`,
        warning: null,
      };
    }

    return {
      value: 0,
      label: "Select a calculation type",
      subtext: null,
      warning: null,
    };
  }, [
    scaleFactor,
    amount,
    ingredient,
    fromUnit,
    toUnit,
    conversionType,
    flourWeight,
    ingredientWeight,
    ingredientForBaking,
    meatType,
    internalTemp,
    unit,
    riceType,
    riceAmount,
  ]);

  // 3. FAQS
  const faqs = [
    {
      question: "How do I accurately scale a recipe?",
      answer:
        "To scale a recipe, multiply each ingredient quantity by the desired factor (e.g., 2 for double). Using weight measurements (grams or ounces) ensures better accuracy than volume (cups). Always adjust cooking times and temperatures accordingly.",
    },
    {
      question: "Why is ingredient density important in conversions?",
      answer:
        "Ingredient density varies widely; for example, 1 cup of flour weighs about 120g, while 1 cup of sugar weighs about 200g. Using density ensures precise volume-to-weight conversions, critical for baking and consistent results.",
    },
    {
      question: "What is baker's percentage and why use it?",
      answer:
        "Baker's percentage expresses ingredient weights relative to flour weight (100%). It helps bakers scale recipes consistently and understand hydration and ingredient ratios, improving dough consistency and baking outcomes.",
    },
    {
      question: "What are safe internal temperatures for cooking meat?",
      answer:
        "According to USDA, poultry should reach 165°F, ground beef 160°F, and steaks/pork 145°F. Cooking meat to these temperatures ensures harmful bacteria are destroyed, preventing foodborne illnesses.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI Inputs rendering helpers
  const renderInputs = () => {
    switch (conversionType) {
      case "scale":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ingredient-select">Ingredient</Label>
              <Select
                value={ingredient}
                onValueChange={setIngredient}
                id="ingredient-select"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INGREDIENTS).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-input">Amount</Label>
              <Input
                id="amount-input"
                type="number"
                min={0}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${fromUnit}`}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="from-unit-select">From Unit</Label>
                <Select
                  value={fromUnit}
                  onValueChange={setFromUnit}
                  id="from-unit-select"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="to-unit-select">To Unit</Label>
                <Select
                  value={toUnit}
                  onValueChange={setToUnit}
                  id="to-unit-select"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case "convert":
        // Same inputs as scale but no scaling factor
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ingredient-select">Ingredient</Label>
              <Select
                value={ingredient}
                onValueChange={setIngredient}
                id="ingredient-select"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select ingredient" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INGREDIENTS).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount-input">Amount</Label>
              <Input
                id="amount-input"
                type="number"
                min={0}
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${fromUnit}`}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="from-unit-select">From Unit</Label>
                <Select
                  value={fromUnit}
                  onValueChange={setFromUnit}
                  id="from-unit-select"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="to-unit-select">To Unit</Label>
                <Select
                  value={toUnit}
                  onValueChange={setToUnit}
                  id="to-unit-select"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cups">Cups</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case "baking":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="flour-weight">Flour Weight ({unit === "imperial" ? "lbs" : "grams"})</Label>
              <Input
                id="flour-weight"
                type="number"
                min={0}
                step="any"
                value={flourWeight}
                onChange={(e) => setFlourWeight(e.target.value)}
                placeholder="Enter flour weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredient-weight">Ingredient Weight ({unit === "imperial" ? "lbs" : "grams"})</Label>
              <Input
                id="ingredient-weight"
                type="number"
                min={0}
                step="any"
                value={ingredientWeight}
                onChange={(e) => setIngredientWeight(e.target.value)}
                placeholder="Enter ingredient weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredient-baking-select">Ingredient for Baker's Math</Label>
              <Select
                value={ingredientForBaking}
                onValueChange={setIngredientForBaking}
                id="ingredient-baking-select"
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INGREDIENTS)
                    .filter(([, info]) => !info.bakerPercentage) // exclude flour
                    .map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scale-factor">Scale Factor</Label>
              <Input
                id="scale-factor"
                type="number"
                min={0}
                step="any"
                value={scaleFactor}
                onChange={(e) => setScaleFactor(e.target.value)}
                placeholder="e.g., 0.5, 2, 3"
              />
            </div>
          </>
        );
      case "meat":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="meat-type-select">Meat Type</Label>
              <Select
                value={meatType}
                onValueChange={setMeatType}
                id="meat-type-select"
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poultry">Poultry</SelectItem>
                  <SelectItem value="beef_steak">Beef Steak</SelectItem>
                  <SelectItem value="ground_beef">Ground Beef</SelectItem>
                  <SelectItem value="pork">Pork</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="internal-temp">Internal Temperature ({unit === "imperial" ? "°F" : "°C"})</Label>
              <Input
                id="internal-temp"
                type="number"
                min={0}
                step="any"
                value={internalTemp}
                onChange={(e) => setInternalTemp(e.target.value)}
                placeholder="Enter internal temp"
              />
            </div>
          </>
        );
      case "rice":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="rice-type-select">Rice Type</Label>
              <Select
                value={riceType}
                onValueChange={setRiceType}
                id="rice-type-select"
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basmati">Basmati</SelectItem>
                  <SelectItem value="jasmine">Jasmine</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rice-amount">Rice Amount ({unit === "imperial" ? "cups" : "grams"})</Label>
              <Input
                id="rice-amount"
                type="number"
                min={0}
                step="any"
                value={riceAmount}
                onChange={(e) => setRiceAmount(e.target.value)}
                placeholder="Enter rice amount"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Reset all inputs
  const resetAll = () => {
    setScaleFactor("1");
    setAmount("");
    setIngredient("flour_ap");
    setFromUnit("cups");
    setToUnit("grams");
    setFlourWeight("");
    setIngredientWeight("");
    setIngredientForBaking("water");
    setMeatType("poultry");
    setInternalTemp("");
    setRiceType("basmati");
    setRiceAmount("");
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
              <SelectItem value="imperial">Imperial (Cups/°F/Lbs)</SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conversion Type Selector */}
      <div className="space-y-4">
        <Label>Calculation Type</Label>
        <Select value={conversionType} onValueChange={setConversionType}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scale">Scale Ingredient Amount</SelectItem>
            <SelectItem value="convert">Convert Cups ↔ Grams</SelectItem>
            <SelectItem value="baking">Baker's Percentage Scaling</SelectItem>
            <SelectItem value="meat">Meat Temperature Safety</SelectItem>
            <SelectItem value="rice">Rice Water Ratio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="space-y-4">{renderInputs()}</div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, results update automatically
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            resetAll();
          }}
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
              <strong>Chef's Tip:</strong> For baking, using a digital scale
              (grams) is always more accurate than volume measurements (cups).
              Always verify meat temperatures with a reliable thermometer to
              ensure food safety.
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
          Understanding Recipe Scaler (x0.5, x2, x3…)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Scaling recipes is an essential skill for both home cooks and
          professional chefs. Whether you need to halve a recipe for a small
          dinner or double it for a large gathering, precise scaling ensures
          consistent results. This tool helps you multiply or divide ingredient
          quantities accurately, taking into account ingredient density and
          measurement units.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Unlike simple volume conversions, this scaler respects the unique
          densities of common ingredients like flour, sugar, and butter,
          converting cups to grams and vice versa with culinary precision.
          For baking, it incorporates baker's math principles, where flour is
          the baseline at 100%, and other ingredients are calculated relative
          to it. This ensures your doughs and batters maintain their intended
          texture and flavor.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the tool includes food safety checks for meat cooking
          temperatures based on USDA guidelines, warning you if temperatures
          fall within unsafe ranges. It also provides rice-to-water ratios for
          different rice types, helping you achieve perfect rice every time.
          This comprehensive approach makes it a reliable companion in your
          culinary adventures.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Recipe Scaler, first select the type of calculation you
          want: scaling ingredients, converting units, baker's math, meat
          temperature safety, or rice water ratio. Enter the relevant values,
          such as ingredient amounts, scale factors, or temperatures. Choose
          your preferred unit system (imperial or metric) for accurate results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the calculation type from the dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the ingredient or meat type and the
            amount or temperature.
          </li>
          <li>
            <strong>Step 3:</strong> For scaling or baking, input the scale
            factor or weights as needed.
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to see precise, safe, and
            culinary-accurate results.
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
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Official recommendations for safe internal cooking temperatures
              and food handling to prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking Science
            </a>
            <p className="text-slate-500 text-sm">
              Trusted source for baking ratios, ingredient densities, and baker's
              percentage principles.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats Culinary Science
            </a>
            <p className="text-slate-500 text-sm">
              In-depth culinary articles on ingredient conversions, cooking
              techniques, and food safety.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Recipe Scaler (x0.5, x2, x3…)"
      description="Scale your recipes up or down. Multiply or divide ingredient quantities to adjust serving sizes for parties or single meals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula: "Result = Input × Scale Factor",
        variables: [
          { symbol: "Input", description: "Ingredient amount or temperature" },
          { symbol: "Result", description: "Scaled or converted value" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Doubling a cake recipe that calls for 2 cups of flour.",
        steps: [
          {
            label: "1",
            explanation:
              "Multiply the flour amount by the scale factor (2): 2 cups × 2 = 4 cups.",
          },
        ],
        result: "Use 4 cups of flour to double the recipe.",
      }}
      relatedCalculators={[
        { title: "Oil for Frying Calculator", url: "/cooking/oil-for-frying-pan-depth-volume", icon: "🍳" },
        { title: "Baker’s Percentage Calculator", url: "/cooking/bakers-percentage", icon: "🍞" },
        { title: "Salt % for Brining Calculator", url: "/cooking/salt-percent-brining", icon: "🥩" },
        { title: "Dough Hydration % Calculator", url: "/cooking/dough-hydration-percent", icon: "🍞" },
        { title: "Yeast Conversion Calculator", url: "/cooking/yeast-conversion-instant-active-fresh", icon: "📏" },
        { title: "Alcohol by Volume (ABV) Dilution", url: "/cooking/alcohol-abv-dilution", icon: "🌡️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Recipe Scaler (x0.5, x2, x3…)" },
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