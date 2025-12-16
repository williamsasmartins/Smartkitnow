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

const INGREDIENT_DENSITY_MAP = {
  // g per cup
  "Chicken Stock": 240,
  "Beef Stock": 250,
  "Vegetable Stock": 230,
  "Fish Stock": 220,
  "Water": 236,
};

const PAN_AREAS = {
  // in square inches
  "8-inch skillet": 50.3, // π * r^2 = π * 4^2
  "10-inch skillet": 78.5, // π * 5^2
  "12-inch skillet": 113.1, // π * 6^2
  "Dutch oven (8 qt)": 80, // approx
  "Saucepan (3 qt)": 60, // approx
};

const DANGER_ZONE_F_MIN = 40;
const DANGER_ZONE_F_MAX = 140;

const F_TO_C = (f: number) => ((f - 32) * 5) / 9;
const C_TO_F = (c: number) => (c * 9) / 5 + 32;

export default function StockBrothReductionTimeYieldCalculator() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredient?: string;
    initialVolume?: string; // cups or ml
    initialWeight?: string; // grams or oz
    panSize?: string;
    panDepth?: string; // inches or cm
    startTemp?: string; // °F or °C
    targetReductionPercent?: string; // %
    reductionRate?: string; // % per minute
  }>({});

  // Parse float helper
  const parseInput = (val?: string) => {
    if (!val) return NaN;
    const n = parseFloat(val);
    return isNaN(n) ? NaN : n;
  };

  // Conversion helpers
  const gramsToOunces = (g: number) => g / 28.3495;
  const ouncesToGrams = (oz: number) => oz * 28.3495;
  const cupsToMl = (cups: number) => cups * 236.588;
  const mlToCups = (ml: number) => ml / 236.588;
  const inchToCm = (inch: number) => inch * 2.54;
  const cmToInch = (cm: number) => cm / 2.54;

  // Density-based conversions
  // volume in cups or ml, weight in grams or oz
  // ingredient density in g/cup
  const volumeToWeight = (
    volume: number,
    ingredient: string,
    unitSystem: "imperial" | "metric"
  ) => {
    const density = INGREDIENT_DENSITY_MAP[ingredient];
    if (!density) return NaN;
    if (unitSystem === "imperial") {
      // volume in cups, density g/cup
      return density * volume; // grams
    } else {
      // volume in ml, convert ml to cups first
      const cups = mlToCups(volume);
      return density * cups; // grams
    }
  };

  const weightToVolume = (
    weight: number,
    ingredient: string,
    unitSystem: "imperial" | "metric"
  ) => {
    const density = INGREDIENT_DENSITY_MAP[ingredient];
    if (!density) return NaN;
    const cups = weight / density;
    if (unitSystem === "imperial") {
      return cups;
    } else {
      return cupsToMl(cups);
    }
  };

  // Calculate pan volume = area * depth
  // area in sq inches or sq cm, depth in inches or cm
  // volume in cubic inches or cubic cm
  // 1 cubic inch = 14.4375 ml
  // 1 cubic cm = 1 ml
  const calculatePanVolumeMl = (
    panSize: string,
    panDepth: number,
    unitSystem: "imperial" | "metric"
  ) => {
    const areaInSqInch = PAN_AREAS[panSize];
    if (!areaInSqInch || panDepth <= 0) return NaN;
    if (unitSystem === "imperial") {
      // depth in inches
      const volumeCubicInch = areaInSqInch * panDepth;
      return volumeCubicInch * 14.4375; // ml
    } else {
      // convert area to sq cm: 1 sq inch = 6.4516 sq cm
      const areaSqCm = areaInSqInch * 6.4516;
      // depth in cm
      const volumeCubicCm = areaSqCm * panDepth;
      return volumeCubicCm; // ml
    }
  };

  // Reduction time calculation:
  // Given initial volume and target reduction %, and reduction rate (% per minute)
  // time = (initialVolume * reductionPercent/100) / (initialVolume * reductionRate/100 per min)
  // Simplifies to time = reductionPercent / reductionRate (minutes)
  // But reduction rate can depend on pan size and heat, so user input

  // Yield calculation:
  // Yield volume = initialVolume * (1 - reductionPercent/100)

  // Safety warning for temperature in danger zone (40-140°F)
  const isTempInDangerZone = (tempF: number) =>
    tempF >= DANGER_ZONE_F_MIN && tempF <= DANGER_ZONE_F_MAX;

  // 2. LOGIC ENGINE (ALL CALCULATIONS HERE)
  const results = useMemo(() => {
    // Extract and parse inputs
    const ingredient = inputs.ingredient || "";
    const panSize = inputs.panSize || "";
    const unitSystem = unit;

    // Parse numeric inputs
    const initialVolumeRaw = parseInput(inputs.initialVolume); // cups or ml
    const initialWeightRaw = parseInput(inputs.initialWeight); // grams or oz
    const panDepthRaw = parseInput(inputs.panDepth); // inches or cm
    const startTempRaw = parseInput(inputs.startTemp); // °F or °C
    const targetReductionPercentRaw = parseInput(inputs.targetReductionPercent); // %
    const reductionRateRaw = parseInput(inputs.reductionRate); // % per minute

    // Validate required inputs
    if (
      !ingredient ||
      (!initialVolumeRaw && !initialWeightRaw) ||
      !panSize ||
      !panDepthRaw ||
      isNaN(targetReductionPercentRaw) ||
      isNaN(reductionRateRaw) ||
      targetReductionPercentRaw <= 0 ||
      targetReductionPercentRaw >= 100 ||
      reductionRateRaw <= 0
    ) {
      return {
        value: 0,
        label: "Enter all required inputs correctly",
        subtext: "",
        warning: null,
      };
    }

    // Calculate initial volume in ml
    let initialVolumeMl: number;
    if (initialVolumeRaw && !isNaN(initialVolumeRaw)) {
      if (unitSystem === "imperial") {
        initialVolumeMl = cupsToMl(initialVolumeRaw);
      } else {
        initialVolumeMl = initialVolumeRaw;
      }
    } else if (initialWeightRaw && !isNaN(initialWeightRaw)) {
      // Convert weight to grams if imperial
      const weightGrams =
        unitSystem === "imperial"
          ? ouncesToGrams(initialWeightRaw)
          : initialWeightRaw;
      // Convert weight to volume ml using density
      const vol = weightToVolume(weightGrams, ingredient, "metric");
      if (isNaN(vol)) {
        return {
          value: 0,
          label: "Unknown ingredient density",
          subtext: "",
          warning: null,
        };
      }
      initialVolumeMl = vol;
    } else {
      return {
        value: 0,
        label: "Enter initial volume or weight",
        subtext: "",
        warning: null,
      };
    }

    // Calculate pan volume in ml
    const panVolumeMl = calculatePanVolumeMl(panSize, panDepthRaw, unitSystem);
    if (isNaN(panVolumeMl)) {
      return {
        value: 0,
        label: "Invalid pan size or depth",
        subtext: "",
        warning: null,
      };
    }

    // Calculate final volume after reduction
    const finalVolumeMl =
      initialVolumeMl * (1 - targetReductionPercentRaw / 100);

    // Calculate yield percentage (final volume / initial volume * 100)
    const yieldPercent = (finalVolumeMl / initialVolumeMl) * 100;

    // Calculate reduction time in minutes
    // time = targetReductionPercent / reductionRate
    const reductionTimeMin = targetReductionPercentRaw / reductionRateRaw;

    // Safety temperature check
    let tempF: number;
    if (unitSystem === "imperial") {
      tempF = startTempRaw;
    } else {
      tempF = C_TO_F(startTempRaw);
    }
    const tempWarning = isTempInDangerZone(tempF)
      ? `Warning: Starting temperature ${tempF.toFixed(
          1
        )}°F is in the USDA Danger Zone (40-140°F). Handle with care to avoid food safety risks.`
      : null;

    // Prepare display strings
    // Display volumes in user units
    const displayInitialVolume =
      unitSystem === "imperial"
        ? `${initialVolumeRaw.toFixed(2)} cups`
        : `${initialVolumeRaw.toFixed(0)} ml`;
    const displayFinalVolume =
      unitSystem === "imperial"
        ? `${(finalVolumeMl / 236.588).toFixed(2)} cups`
        : `${finalVolumeMl.toFixed(0)} ml`;
    const displayYieldPercent = yieldPercent.toFixed(1) + "%";
    const displayReductionTime = reductionTimeMin.toFixed(1) + " minutes";

    // Subtext with pan volume info
    const displayPanVolume =
      unitSystem === "imperial"
        ? `${(panVolumeMl / 236.588).toFixed(2)} cups`
        : `${panVolumeMl.toFixed(0)} ml`;

    const subtext = `Pan volume capacity: ${displayPanVolume}. Reduction time estimated based on ${reductionRateRaw}% reduction per minute.`;

    const labelText = `Final Volume: ${displayFinalVolume} (${displayYieldPercent} yield) | Reduction Time: ${displayReductionTime}`;

    return {
      value: labelText,
      label: "Reduction Result",
      subtext,
      warning: tempWarning,
    };
  }, [inputs, unit]);

  const faqs = [
    {
      question: "What is stock reduction and why is it important?",
      answer:
        "Stock reduction is the process of simmering stock or broth to evaporate water, concentrating flavors and thickening the liquid. It is essential for creating rich sauces like demi-glace or glazes, enhancing depth and mouthfeel in dishes.",
    },
    {
      question: "How do I calculate the reduction time for my stock?",
      answer:
        "Reduction time depends on the desired percentage of volume reduction and the rate at which the liquid evaporates, influenced by pan size, heat, and surface area. This calculator estimates time by dividing target reduction percentage by reduction rate per minute.",
    },
    {
      question: "Why does ingredient density matter in volume-weight conversions?",
      answer:
        "Different stocks and broths have varying densities due to dissolved solids and fats. Using ingredient-specific density ensures accurate conversions between volume and weight, critical for precise culinary calculations.",
    },
    {
      question: "What is the USDA Danger Zone and why should I care?",
      answer:
        "The USDA Danger Zone (40-140°F) is the temperature range where bacteria grow rapidly in food. Starting or holding stocks in this range can risk food safety. Always ensure stocks are heated above or cooled below this range promptly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="metric">Metric (ml/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredient Selector */}
      <div className="space-y-2">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Ingredient / Stock Type
        </Label>
        <Select
          value={inputs.ingredient || ""}
          onValueChange={(val) => setInputs((i) => ({ ...i, ingredient: val }))}
          id="ingredient"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(INGREDIENT_DENSITY_MAP).map((ing) => (
              <SelectItem key={ing} value={ing}>
                {ing}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Initial Volume or Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="initialVolume" className="text-slate-700 dark:text-slate-300">
            Initial Volume ({unit === "imperial" ? "cups" : "ml"})
          </Label>
          <Input
            id="initialVolume"
            type="number"
            min={0}
            step="any"
            value={inputs.initialVolume || ""}
            onChange={(e) =>
              setInputs((i) => ({ ...i, initialVolume: e.target.value }))
            }
            placeholder={unit === "imperial" ? "e.g. 4" : "e.g. 1000"}
          />
        </div>
        <div>
          <Label htmlFor="initialWeight" className="text-slate-700 dark:text-slate-300">
            Initial Weight ({unit === "imperial" ? "oz" : "grams"})
          </Label>
          <Input
            id="initialWeight"
            type="number"
            min={0}
            step="any"
            value={inputs.initialWeight || ""}
            onChange={(e) =>
              setInputs((i) => ({ ...i, initialWeight: e.target.value }))
            }
            placeholder={unit === "imperial" ? "e.g. 32" : "e.g. 900"}
          />
          <p className="text-xs text-slate-500 mt-1">
            Provide either volume or weight, not both.
          </p>
        </div>
      </div>

      {/* Pan Size */}
      <div className="space-y-2">
        <Label htmlFor="panSize" className="text-slate-700 dark:text-slate-300">
          Pan Size
        </Label>
        <Select
          value={inputs.panSize || ""}
          onValueChange={(val) => setInputs((i) => ({ ...i, panSize: val }))}
          id="panSize"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select pan size" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(PAN_AREAS).map((pan) => (
              <SelectItem key={pan} value={pan}>
                {pan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pan Depth */}
      <div>
        <Label htmlFor="panDepth" className="text-slate-700 dark:text-slate-300">
          Pan Depth ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="panDepth"
          type="number"
          min={0}
          step="any"
          value={inputs.panDepth || ""}
          onChange={(e) => setInputs((i) => ({ ...i, panDepth: e.target.value }))}
          placeholder={unit === "imperial" ? "e.g. 2" : "e.g. 5"}
        />
      </div>

      {/* Starting Temperature */}
      <div>
        <Label htmlFor="startTemp" className="text-slate-700 dark:text-slate-300">
          Starting Temperature ({unit === "imperial" ? "°F" : "°C"})
        </Label>
        <Input
          id="startTemp"
          type="number"
          step="any"
          value={inputs.startTemp || ""}
          onChange={(e) => setInputs((i) => ({ ...i, startTemp: e.target.value }))}
          placeholder={unit === "imperial" ? "e.g. 70" : "e.g. 21"}
        />
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Info className="w-4 h-4 text-blue-500" />
          USDA Danger Zone: 40-140°F (4-60°C)
        </p>
      </div>

      {/* Target Reduction Percent */}
      <div>
        <Label
          htmlFor="targetReductionPercent"
          className="text-slate-700 dark:text-slate-300"
        >
          Target Reduction (%)
        </Label>
        <Input
          id="targetReductionPercent"
          type="number"
          min={1}
          max={99}
          step="any"
          value={inputs.targetReductionPercent || ""}
          onChange={(e) =>
            setInputs((i) => ({ ...i, targetReductionPercent: e.target.value }))
          }
          placeholder="e.g. 50"
        />
      </div>

      {/* Reduction Rate */}
      <div>
        <Label
          htmlFor="reductionRate"
          className="text-slate-700 dark:text-slate-300"
        >
          Reduction Rate (% per minute)
        </Label>
        <Input
          id="reductionRate"
          type="number"
          min={0.1}
          step="any"
          value={inputs.reductionRate || ""}
          onChange={(e) =>
            setInputs((i) => ({ ...i, reductionRate: e.target.value }))
          }
          placeholder="e.g. 2"
        />
        <p className="text-xs text-slate-500 mt-1">
          Typical rates range 1-5% depending on heat and pan surface area.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((i) => ({ ...i }));
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

      {/* Results (CLEAN JSX ONLY) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Kitchen Result
              </p>
              <p className="text-2xl font-extrabold text-blue-900 dark:text-white whitespace-pre-wrap">
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
              <strong>Chef's Tip:</strong> Use a wide, shallow pan to increase
              surface area and speed up reduction. Stir occasionally to prevent
              scorching.
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
          Understanding Stock/Broth Reduction Time & Yield
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Stock and broth reduction is a fundamental culinary technique used to
          concentrate flavors and thicken liquids by evaporating water through
          simmering or gentle boiling. This process transforms a thin, watery
          stock into a rich, flavorful base for sauces, gravies, and soups,
          such as demi-glace or glazes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The reduction time depends on several factors including the initial
          volume, the surface area of the pan, the heat applied, and the desired
          concentration level. A wider pan increases the surface area, allowing
          more rapid evaporation, while a deeper pan slows the process. Understanding
          these variables helps chefs control the cooking process precisely.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Yield after reduction is critical for recipe scaling and portioning.
          Knowing how much volume remains after a certain percentage of reduction
          allows chefs to plan ingredient quantities accurately, minimizing waste
          and ensuring consistent flavor intensity.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the final volume and reduction time for your
          stock or broth based on your inputs. Follow these steps to get accurate
          results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the type of stock or broth you are
            reducing to apply the correct density for conversions.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the initial volume (in cups or ml) or
            weight (in ounces or grams) of your stock.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your pan size and enter the depth to
            estimate pan volume and evaporation surface area.
          </li>
          <li>
            <strong>Step 4:</strong> Input the starting temperature to check for
            food safety warnings.
          </li>
          <li>
            <strong>Step 5:</strong> Specify the target reduction percentage and
            the estimated reduction rate (% per minute) based on your cooking
            conditions.
          </li>
          <li>
            <strong>Step 6:</strong> Click Calculate to see the estimated final
            volume, yield percentage, and reduction time.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-to-140f"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety: Danger Zone
            </a>
            <p className="text-slate-500 text-sm">
              Official USDA guidelines on temperature ranges that promote bacterial
              growth and food safety practices.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.culinaryinstitute.edu/blog/stock-and-sauce-reduction-techniques"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Culinary Institute: Stock and Sauce Reduction Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Professional culinary insights on reduction methods and their impact on
              flavor and texture.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.baking911.com/ingredient-density/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Baking 911: Ingredient Density Reference
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive density values for various ingredients used in volume and
              weight conversions.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Stock/Broth Reduction Time & Yield"
      description="Estimate stock reduction yield. Calculate how much volume remains after reducing broth to a demi-glace or glaze."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Reduction Time (min) = Target Reduction (%) ÷ Reduction Rate (% per min); Final Volume = Initial Volume × (1 - Target Reduction ÷ 100)",
        variables: [
          { symbol: "Target Reduction", description: "Desired % volume reduction" },
          { symbol: "Reduction Rate", description: "% volume reduction per minute" },
          { symbol: "Initial Volume", description: "Starting volume of stock" },
          { symbol: "Final Volume", description: "Volume after reduction" },
          { symbol: "Reduction Time", description: "Estimated time to reduce" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 4 cups of chicken stock in a 10-inch skillet with 2-inch depth. You want to reduce it by 50% at a rate of 2% per minute.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate reduction time: 50% ÷ 2% per minute = 25 minutes.",
          },
          {
            label: "2",
            explanation:
              "Calculate final volume: 4 cups × (1 - 0.5) = 2 cups remaining.",
          },
        ],
        result:
          "After 25 minutes, you will have approximately 2 cups of concentrated stock.",
      }}
      relatedCalculators={[
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "🍳",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍞",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "🥩",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Stock/Broth Reduction Time & Yield" },
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