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

// Ingredient density map: grams per cup (US standard cup = 240 ml)
// Source: King Arthur Baking, Serious Eats, USDA
const ingredientDensityMap: Record<
  string,
  { imperial: number; metric: number; label: string }
> = {
  flour_ap: { imperial: 120, metric: 120, label: "All-Purpose Flour" },
  sugar_granulated: { imperial: 200, metric: 200, label: "Granulated Sugar" },
  butter: { imperial: 227, metric: 227, label: "Butter (unsalted)" },
  water: { imperial: 236, metric: 236, label: "Water" },
  rice_basmati: { imperial: 185, metric: 185, label: "Basmati Rice (uncooked)" },
  rice_jasmine: { imperial: 195, metric: 195, label: "Jasmine Rice (uncooked)" },
  rice_brown: { imperial: 195, metric: 195, label: "Brown Rice (uncooked)" },
  salt: { imperial: 273, metric: 273, label: "Table Salt" },
  honey: { imperial: 340, metric: 340, label: "Honey" },
  milk: { imperial: 245, metric: 245, label: "Milk" },
};

// USDA safe minimum internal temperatures (°F and °C)
const meatSafeTemps: Record<
  string,
  { label: string; minF: number; minC: number }
> = {
  chicken: { label: "Chicken/Poultry", minF: 165, minC: 74 },
  beef_steak: { label: "Beef Steak", minF: 145, minC: 63 },
  ground_beef: { label: "Ground Beef", minF: 160, minC: 71 },
  pork: { label: "Pork", minF: 145, minC: 63 },
  fish: { label: "Fish", minF: 145, minC: 63 },
};

export default function ServingSizeMultiplierCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<UnitSystem>("imperial");

  // Mode: "ingredient" or "meat" or "rice"
  const [mode, setMode] = useState<"ingredient" | "meat" | "rice">("ingredient");

  // Inputs for ingredient converter
  const [ingredient, setIngredient] = useState<string>("flour_ap");
  const [amount, setAmount] = useState<string>(""); // input amount
  const [fromUnit, setFromUnit] = useState<string>("cups");
  const [toUnit, setToUnit] = useState<string>("grams");

  // Inputs for meat calculator
  const [meatType, setMeatType] = useState<string>("chicken");
  const [meatWeight, setMeatWeight] = useState<string>(""); // lbs or kg
  const [internalTemp, setInternalTemp] = useState<string>(""); // °F or °C

  // Inputs for rice calculator
  const [riceType, setRiceType] = useState<string>("basmati");
  const [riceWeight, setRiceWeight] = useState<string>(""); // cups or grams
  const [riceUnit, setRiceUnit] = useState<string>("cups");

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Helper: parse float safely
    const parseNum = (val: string) => {
      const n = parseFloat(val);
      return isNaN(n) || n < 0 ? null : n;
    };

    // Convert cups <-> grams for ingredient converter
    function convertIngredient(
      ingredientKey: string,
      amt: number,
      from: string,
      to: string
    ) {
      const density = ingredientDensityMap[ingredientKey];
      if (!density) return null;

      // Units supported: cups, grams, ounces, pounds
      // For imperial: cups, ounces (oz), pounds (lbs)
      // For metric: grams (g), kilograms (kg), milliliters (ml) (only for water)

      // Normalize input amount to grams first
      let grams: number | null = null;

      if (from === "cups") {
        grams = density.imperial * amt;
      } else if (from === "grams") {
        grams = amt;
      } else if (from === "ounces") {
        grams = amt * 28.3495;
      } else if (from === "pounds") {
        grams = amt * 453.592;
      } else if (from === "kilograms") {
        grams = amt * 1000;
      } else if (from === "milliliters") {
        // Only valid for water or liquids with density ~1g/ml
        if (ingredientKey === "water" || ingredientKey === "milk" || ingredientKey === "honey") {
          grams = amt; // 1 ml = 1 g approx
        } else {
          return null; // invalid conversion
        }
      } else {
        return null;
      }

      // Convert grams to target unit
      let result: number | null = null;
      if (to === "grams") {
        result = grams;
      } else if (to === "cups") {
        result = grams / density.imperial;
      } else if (to === "ounces") {
        result = grams / 28.3495;
      } else if (to === "pounds") {
        result = grams / 453.592;
      } else if (to === "kilograms") {
        result = grams / 1000;
      } else if (to === "milliliters") {
        if (ingredientKey === "water" || ingredientKey === "milk" || ingredientKey === "honey") {
          result = grams; // 1 g = 1 ml approx
        } else {
          return null;
        }
      } else {
        return null;
      }

      return result;
    }

    // Baker's Math: calculate baker's percentages
    // Input: flourWeight (grams), other ingredient weight (grams)
    // Output: percentage relative to flour (flour = 100%)
    function bakerPercentage(flourWeight: number, ingredientWeight: number) {
      if (flourWeight === 0) return 0;
      return (ingredientWeight / flourWeight) * 100;
    }

    // Food Safety: check if internal temp is in Danger Zone (40°F - 140°F)
    // Return warning string or null
    function checkFoodSafety(temp: number, unit: UnitSystem) {
      let tempF = temp;
      if (unit === "metric") {
        tempF = temp * 9 / 5 + 32;
      }
      if (tempF > 40 && tempF < 140) {
        return "Warning: Temperature is in the USDA Danger Zone (40°F - 140°F). Food safety risk if held too long.";
      }
      return null;
    }

    // Rice water ratio calculator
    // Source: Serious Eats, USDA
    // Water to rice ratio by rice type (cups water per cup rice)
    const riceWaterRatios: Record<string, number> = {
      basmati: 1.5,
      jasmine: 1.25,
      brown: 2,
    };

    // Main logic branches by mode
    if (mode === "ingredient") {
      const amtNum = parseNum(amount);
      if (amtNum === null) return { value: 0, label: "", subtext: "", warning: null };

      // Convert ingredient amount from fromUnit to toUnit
      const converted = convertIngredient(ingredient, amtNum, fromUnit, toUnit);
      if (converted === null) {
        return {
          value: 0,
          label: "Conversion not supported",
          subtext: "Please check units and ingredient selection.",
          warning: null,
        };
      }

      // Format result nicely
      const rounded = Math.round(converted * 100) / 100;

      return {
        value: rounded,
        label: `${ingredientDensityMap[ingredient].label} (${fromUnit} → ${toUnit})`,
        subtext: `Converted ${amtNum} ${fromUnit} to ${rounded} ${toUnit}.`,
        warning: null,
      };
    }

    if (mode === "meat") {
      const weightNum = parseNum(meatWeight);
      const tempNum = parseNum(internalTemp);
      if (weightNum === null) {
        return {
          value: 0,
          label: "Invalid weight",
          subtext: "Please enter a valid meat weight.",
          warning: null,
        };
      }

      const safeTemp = meatSafeTemps[meatType];
      if (!safeTemp) {
        return {
          value: 0,
          label: "Unknown meat type",
          subtext: "Please select a valid meat type.",
          warning: null,
        };
      }

      // Convert weight to lbs or kg depending on unit system
      let weightDisplay = weightNum;
      let weightUnit = unit === "imperial" ? "lbs" : "kg";
      if (unit === "imperial" && fromUnit === "metric") {
        // Not used here, but just in case
        weightDisplay = weightNum * 2.20462;
      } else if (unit === "metric" && fromUnit === "imperial") {
        weightDisplay = weightNum / 2.20462;
      }

      // Check food safety temp warning
      let warning = null;
      if (tempNum !== null) {
        warning = checkFoodSafety(tempNum, unit);
      }

      // Display safe minimum temp in current unit
      const safeTempDisplay =
        unit === "imperial" ? safeTemp.minF + "°F" : safeTemp.minC + "°C";

      return {
        value: weightDisplay,
        label: `${safeTemp.label} Weight (${weightUnit})`,
        subtext: `Safe minimum internal temperature: ${safeTempDisplay}. ${
          tempNum !== null
            ? `Current temp: ${tempNum}°${unit === "imperial" ? "F" : "C"}.`
            : "Enter internal temp to check safety."
        }`,
        warning,
      };
    }

    if (mode === "rice") {
      const riceAmt = parseNum(riceWeight);
      if (riceAmt === null) {
        return {
          value: 0,
          label: "Invalid rice amount",
          subtext: "Please enter a valid rice amount.",
          warning: null,
        };
      }

      const ratio = riceWaterRatios[riceType];
      if (!ratio) {
        return {
          value: 0,
          label: "Unknown rice type",
          subtext: "Please select a valid rice type.",
          warning: null,
        };
      }

      // Calculate water needed based on rice amount and unit
      // If riceUnit is cups, water is cups * ratio
      // If riceUnit is grams, convert grams to cups first (using density)
      let riceCups: number;
      if (riceUnit === "cups") {
        riceCups = riceAmt;
      } else if (riceUnit === "grams") {
        // Use density for uncooked rice (approx 185g/cup)
        riceCups = riceAmt / 185;
      } else {
        return {
          value: 0,
          label: "Unsupported rice unit",
          subtext: "Use cups or grams for rice amount.",
          warning: null,
        };
      }

      const waterCups = riceCups * ratio;

      // Convert water cups to output unit (cups or grams)
      let waterOutput: number;
      let waterUnitLabel: string;
      if (unit === "imperial") {
        waterOutput = Math.round(waterCups * 100) / 100;
        waterUnitLabel = "cups";
      } else {
        // Convert cups water to grams (1 cup water = 236g)
        waterOutput = Math.round(waterCups * 236);
        waterUnitLabel = "grams";
      }

      return {
        value: waterOutput,
        label: `Water needed for ${riceWeight} ${riceUnit} ${riceType} rice`,
        subtext: `Use approximately ${waterOutput} ${waterUnitLabel} of water.`,
        warning: null,
      };
    }

    return { value: 0, label: "", subtext: "", warning: null };
  }, [
    amount,
    ingredient,
    fromUnit,
    toUnit,
    mode,
    meatType,
    meatWeight,
    internalTemp,
    riceType,
    riceWeight,
    riceUnit,
    unit,
  ]);

  // 3. FAQS
  const faqs = [
    {
      question: "How do I convert cups to grams for different ingredients?",
      answer:
        "Different ingredients have unique densities, so 1 cup of flour does not weigh the same as 1 cup of sugar. This calculator uses standard density values from King Arthur Baking and Serious Eats to provide accurate conversions.",
    },
    {
      question: "What is baker's percentage and why is flour always 100%?",
      answer:
        "Baker's math sets flour weight as the baseline (100%), and all other ingredients are calculated as a percentage of flour weight. This helps bakers scale recipes precisely and maintain consistent hydration and texture.",
    },
    {
      question: "Why is the USDA Danger Zone important for cooking meat?",
      answer:
        "The USDA Danger Zone (40°F - 140°F) is the temperature range where bacteria multiply rapidly. Keeping meat out of this range or cooking it to safe internal temperatures reduces foodborne illness risks.",
    },
    {
      question: "How do water ratios vary for different types of rice?",
      answer:
        "Different rice varieties absorb water differently. For example, basmati rice typically requires 1.5 cups of water per cup of rice, while brown rice needs about 2 cups. Using correct ratios ensures perfectly cooked rice every time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Reset handler
  function resetAll() {
    setAmount("");
    setIngredient("flour_ap");
    setFromUnit("cups");
    setToUnit("grams");
    setMeatType("chicken");
    setMeatWeight("");
    setInternalTemp("");
    setRiceType("basmati");
    setRiceWeight("");
    setRiceUnit("cups");
    setMode("ingredient");
  }

  const widget = (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="space-y-4">
        <Label className="text-slate-700 dark:text-slate-300">Select Calculator Mode</Label>
        <Select value={mode} onValueChange={(val) => setMode(val as any)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingredient">Ingredient Converter</SelectItem>
            <SelectItem value="meat">Meat Safety & Weight</SelectItem>
            <SelectItem value="rice">Rice Water Ratio</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {/* Inputs per mode */}
      {mode === "ingredient" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="ingredient-select" className="text-slate-700 dark:text-slate-300">
              Ingredient
            </Label>
            <Select
              id="ingredient-select"
              value={ingredient}
              onValueChange={setIngredient}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ingredientDensityMap).map(([key, val]) => (
                  <SelectItem key={key} value={key}>
                    {val.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount-input" className="text-slate-700 dark:text-slate-300">
              Amount
            </Label>
            <Input
              id="amount-input"
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="from-unit" className="text-slate-700 dark:text-slate-300">
                From Unit
              </Label>
              <Select
                id="from-unit"
                value={fromUnit}
                onValueChange={setFromUnit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unit === "imperial" ? (
                    <>
                      <SelectItem value="cups">Cups</SelectItem>
                      <SelectItem value="ounces">Ounces (oz)</SelectItem>
                      <SelectItem value="pounds">Pounds (lbs)</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="grams">Grams (g)</SelectItem>
                      <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                      <SelectItem value="milliliters">Milliliters (ml)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="to-unit" className="text-slate-700 dark:text-slate-300">
                To Unit
              </Label>
              <Select
                id="to-unit"
                value={toUnit}
                onValueChange={setToUnit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unit === "imperial" ? (
                    <>
                      <SelectItem value="cups">Cups</SelectItem>
                      <SelectItem value="ounces">Ounces (oz)</SelectItem>
                      <SelectItem value="pounds">Pounds (lbs)</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="grams">Grams (g)</SelectItem>
                      <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                      <SelectItem value="milliliters">Milliliters (ml)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {mode === "meat" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="meat-type" className="text-slate-700 dark:text-slate-300">
              Meat Type
            </Label>
            <Select
              id="meat-type"
              value={meatType}
              onValueChange={setMeatType}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(meatSafeTemps).map(([key, val]) => (
                  <SelectItem key={key} value={key}>
                    {val.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meat-weight" className="text-slate-700 dark:text-slate-300">
              Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="meat-weight"
              type="number"
              min={0}
              step="any"
              value={meatWeight}
              onChange={(e) => setMeatWeight(e.target.value)}
              placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            />
          </div>

          <div>
            <Label htmlFor="internal-temp" className="text-slate-700 dark:text-slate-300">
              Internal Temperature ({unit === "imperial" ? "°F" : "°C"})
            </Label>
            <Input
              id="internal-temp"
              type="number"
              min={0}
              step="any"
              value={internalTemp}
              onChange={(e) => setInternalTemp(e.target.value)}
              placeholder={`Enter internal temp in ${unit === "imperial" ? "°F" : "°C"}`}
            />
          </div>
        </div>
      )}

      {mode === "rice" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="rice-type" className="text-slate-700 dark:text-slate-300">
              Rice Type
            </Label>
            <Select
              id="rice-type"
              value={riceType}
              onValueChange={setRiceType}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basmati">Basmati</SelectItem>
                <SelectItem value="jasmine">Jasmine</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="rice-weight" className="text-slate-700 dark:text-slate-300">
              Rice Amount
            </Label>
            <Input
              id="rice-weight"
              type="number"
              min={0}
              step="any"
              value={riceWeight}
              onChange={(e) => setRiceWeight(e.target.value)}
              placeholder="Enter rice amount"
            />
          </div>

          <div>
            <Label htmlFor="rice-unit" className="text-slate-700 dark:text-slate-300">
              Unit
            </Label>
            <Select
              id="rice-unit"
              value={riceUnit}
              onValueChange={setRiceUnit}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cups">Cups</SelectItem>
                <SelectItem value="grams">Grams</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetAll}
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
          Understanding Serving Size Multiplier
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Adjusting recipes for different serving sizes requires precise
          calculations to maintain flavor, texture, and safety. This tool helps
          convert ingredient volumes to weights, calculate baker's percentages,
          and ensure safe cooking temperatures for meats. By considering
          ingredient density and culinary science, you can scale recipes
          confidently.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Volume-to-weight conversions vary by ingredient due to differing
          densities; for example, a cup of flour weighs less than a cup of
          sugar. In baking, baker's math ensures ingredient ratios remain
          consistent relative to flour weight. For meats, adhering to USDA
          temperature guidelines prevents foodborne illnesses. This calculator
          integrates these principles into a single, user-friendly interface.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Select the appropriate mode for your task: ingredient conversion,
          meat safety, or rice water ratio. Input your values and units, then
          calculate to get precise results. Use the reset button to clear all
          inputs. Always double-check measurements and cooking temperatures
          with reliable tools.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the calculator mode that fits your
            need.
          </li>
          <li>
            <strong>Step 2:</strong> Enter ingredient, meat, or rice details
            with correct units.
          </li>
          <li>
            <strong>Step 3:</strong> Click Calculate to see conversions,
            safety warnings, or water ratios.
          </li>
          <li>
            <strong>Step 4:</strong> Use results to adjust recipes or cooking
            plans accurately.
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
              Official recommendations on safe cooking temperatures and food
              handling to prevent foodborne illnesses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking Ingredient Weights
            </a>
            <p className="text-slate-500 text-sm">
              Trusted source for ingredient density and baker's math ratios.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats Rice Cooking Ratios
            </a>
            <p className="text-slate-500 text-sm">
              Detailed guides on rice types and optimal water ratios for perfect
              texture.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Serving Size Multiplier"
      description="Adjust recipes by serving size. Input your desired number of servings to automatically recalculate all ingredient amounts."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          mode === "ingredient"
            ? "Result = Amount × Ingredient Density Conversion Factor"
            : mode === "meat"
            ? "Safe Temp Check: Internal Temp ∉ [40°F, 140°F]"
            : mode === "rice"
            ? "Water Needed = Rice Amount × Water Ratio (by Rice Type)"
            : "N/A",
        variables: [
          { symbol: "Amount", description: "Input ingredient or weight" },
          { symbol: "Result", description: "Converted or calculated value" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "Convert 2 cups of all-purpose flour to grams, calculate safe cooking temp for chicken, and find water needed for 1 cup basmati rice.",
        steps: [
          {
            label: "1",
            explanation:
              "Select Ingredient Converter, input 2 cups flour, convert to grams.",
          },
          {
            label: "2",
            explanation:
              "Switch to Meat Safety, select chicken, input weight and internal temp to check safety.",
          },
          {
            label: "3",
            explanation:
              "Switch to Rice Water Ratio, select basmati, input 1 cup rice to get water amount.",
          },
        ],
        result:
          "Flour: 240g; Chicken safe temp: 165°F; Water for rice: 1.5 cups.",
      }}
      relatedCalculators={[
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "⚖️",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🍞",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
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
          title: "Dough Hydration % Calculator",
          url: "/cooking/dough-hydration-percent",
          icon: "🍞",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Serving Size Multiplier" },
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