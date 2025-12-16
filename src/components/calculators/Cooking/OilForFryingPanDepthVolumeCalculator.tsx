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

export default function OilForFryingPanDepthVolumeCalculator() {
  // Unit system: imperial (cups, °F) or metric (grams, °C)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: pan shape, dimensions, oil depth, ingredient for density, temperature
  const [inputs, setInputs] = useState<{
    panShape: "round" | "square" | "rectangular";
    diameter?: string; // for round pan (inches or cm)
    length?: string; // for rectangular/square pan (inches or cm)
    width?: string; // for rectangular pan (inches or cm)
    oilDepth?: string; // depth of oil in pan (inches or cm)
    ingredient?: string; // ingredient for density (default: vegetable oil)
    temperature?: string; // oil temperature (°F or °C)
  }>({
    panShape: "round",
    diameter: "",
    length: "",
    width: "",
    oilDepth: "",
    ingredient: "vegetable oil",
    temperature: "",
  });

  // Density map (g/ml) for common frying oils and ingredients
  // 1 ml = 1 cm³
  // We use density to convert volume (ml) to weight (g)
  // For imperial, volume in cups (1 cup = 236.588 ml)
  // For metric, volume in ml or cm³
  const densityMap: Record<string, number> = {
    "vegetable oil": 0.92, // g/ml typical vegetable oil density
    "canola oil": 0.92,
    "olive oil": 0.91,
    "peanut oil": 0.92,
    "sunflower oil": 0.92,
    "corn oil": 0.92,
    "coconut oil": 0.924,
  };

  // Conversion constants
  const ML_PER_CUP = 236.588;
  const INCH_TO_CM = 2.54;

  // Helper: parse float safely
  function parseInput(value?: string) {
    if (!value) return NaN;
    const n = parseFloat(value);
    return isNaN(n) ? NaN : n;
  }

  // Calculate volume of pan based on shape and dimensions (in ml)
  // Volume = Area * Depth
  // Area in cm², Depth in cm, volume in cm³ (ml)
  // Inputs come in inches or cm depending on unit system
  const results = useMemo(() => {
    // Parse inputs
    const panShape = inputs.panShape;
    const diameterRaw = parseInput(inputs.diameter);
    const lengthRaw = parseInput(inputs.length);
    const widthRaw = parseInput(inputs.width);
    const oilDepthRaw = parseInput(inputs.oilDepth);
    const ingredient = inputs.ingredient?.toLowerCase() || "vegetable oil";
    const temperatureRaw = parseInput(inputs.temperature);

    // Validate inputs presence
    const hasValidDimensions =
      panShape === "round"
        ? !isNaN(diameterRaw) && diameterRaw > 0
        : panShape === "square"
        ? !isNaN(lengthRaw) && lengthRaw > 0
        : panShape === "rectangular"
        ? !isNaN(lengthRaw) && lengthRaw > 0 && !isNaN(widthRaw) && widthRaw > 0
        : false;

    const hasValidDepth = !isNaN(oilDepthRaw) && oilDepthRaw > 0;

    if (!hasValidDimensions) {
      return {
        value: 0,
        label: "Enter valid pan dimensions",
        subtext: "",
        warning: null,
      };
    }
    if (!hasValidDepth) {
      return {
        value: 0,
        label: "Enter oil depth",
        subtext: "",
        warning: null,
      };
    }

    // Convert all dimensions to cm for calculation
    // If imperial, convert inches to cm
    const diameterCm =
      unit === "imperial" ? diameterRaw * INCH_TO_CM : diameterRaw;
    const lengthCm = unit === "imperial" ? lengthRaw * INCH_TO_CM : lengthRaw;
    const widthCm = unit === "imperial" ? widthRaw * INCH_TO_CM : widthRaw;
    const oilDepthCm = unit === "imperial" ? oilDepthRaw * INCH_TO_CM : oilDepthRaw;

    // Calculate area (cm²)
    let areaCm2 = 0;
    switch (panShape) {
      case "round":
        areaCm2 = Math.PI * Math.pow(diameterCm / 2, 2);
        break;
      case "square":
        areaCm2 = Math.pow(lengthCm, 2);
        break;
      case "rectangular":
        areaCm2 = lengthCm * widthCm;
        break;
    }

    // Calculate volume in ml (cm³)
    const volumeMl = areaCm2 * oilDepthCm;

    // Get density for ingredient (g/ml)
    // Default to vegetable oil if unknown
    const density = densityMap[ingredient] ?? densityMap["vegetable oil"];

    // Calculate weight in grams
    const weightG = volumeMl * density;

    // Prepare display strings
    // Display volume in cups or ml depending on unit
    // Display weight in grams or ounces depending on unit
    // 1 oz = 28.3495 g
    const volumeDisplay =
      unit === "imperial"
        ? (volumeMl / ML_PER_CUP).toFixed(2) + " cups"
        : volumeMl.toFixed(0) + " ml";

    const weightDisplay =
      unit === "imperial"
        ? (weightG / 28.3495).toFixed(2) + " oz"
        : weightG.toFixed(0) + " g";

    // Temperature warning if in danger zone (40-140°F)
    // Convert temperature to °F if metric
    let tempF = temperatureRaw;
    if (unit === "metric" && !isNaN(temperatureRaw)) {
      tempF = temperatureRaw * (9 / 5) + 32;
    }
    const inDangerZone = tempF >= 40 && tempF <= 140;

    // Compose label and subtext
    const labelText = `Oil Volume: ${volumeDisplay} (${weightDisplay})`;
    const subtext = `Pan Shape: ${panShape.charAt(0).toUpperCase() + panShape.slice(1)}, Oil Depth: ${
      unit === "imperial"
        ? oilDepthRaw + " in"
        : oilDepthRaw + " cm"
    }`;

    const warningMsg = inDangerZone
      ? "Warning: Oil temperature is in the USDA Danger Zone (40-140°F). Maintain proper frying temperature above 140°F for safety."
      : null;

    return {
      value: labelText,
      label: subtext,
      subtext:
        temperatureRaw && !isNaN(temperatureRaw)
          ? `Oil Temperature: ${temperatureRaw}°${unit === "imperial" ? "F" : "C"}`
          : "",
      warning: warningMsg,
    };
  }, [inputs, unit]);

  // FAQs with 50-80 words each
  const faqs = [
    {
      question: "Why is it important to calculate the correct oil volume for frying?",
      answer:
        "Calculating the correct oil volume ensures your food fries evenly and safely. Too little oil can cause uneven cooking and sticking, while too much oil wastes resources and can be hazardous. Proper oil depth also prevents overflow and splattering, maintaining kitchen safety and food quality.",
    },
    {
      question: "How does pan shape affect the amount of oil needed for frying?",
      answer:
        "Pan shape determines the surface area that needs to be covered by oil. Round pans have different area calculations than square or rectangular pans, affecting the total oil volume required. Accurate shape input ensures precise volume calculation, avoiding under- or over-filling.",
    },
    {
      question: "Why do I need to consider oil density in this calculator?",
      answer:
        "Oil density varies slightly between types and affects weight-to-volume conversions. Using density allows the calculator to provide both volume and weight measurements, which is useful for precise cooking and purchasing decisions, especially when switching between metric and imperial units.",
    },
    {
      question: "What is the USDA Danger Zone and why should I avoid it when frying?",
      answer:
        "The USDA Danger Zone refers to temperatures between 40°F and 140°F where bacteria can rapidly grow. Frying oil should be heated above 140°F to ensure food safety. This calculator warns if your oil temperature falls within this unsafe range to help prevent foodborne illness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(
    field:
      | "diameter"
      | "length"
      | "width"
      | "oilDepth"
      | "ingredient"
      | "temperature",
    value: string
  ) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }
  function onPanShapeChange(value: "round" | "square" | "rectangular") {
    setInputs((prev) => ({
      ...prev,
      panShape: value,
      diameter: "",
      length: "",
      width: "",
    }));
  }

  // Widget JSX inputs (no inline logic)
  const panShapeLabel = useMemo(() => {
    switch (inputs.panShape) {
      case "round":
        return "Diameter";
      case "square":
        return "Side Length";
      case "rectangular":
        return "Length & Width";
      default:
        return "";
    }
  }, [inputs.panShape]);

  const depthUnit = unit === "imperial" ? "inches" : "cm";
  const tempUnit = unit === "imperial" ? "°F" : "°C";

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
              <SelectItem value="metric">Metric (Grams/°C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pan Shape */}
      <div className="space-y-2">
        <Label htmlFor="panShape" className="text-slate-700 dark:text-slate-300">
          Pan Shape
        </Label>
        <Select
          id="panShape"
          value={inputs.panShape}
          onValueChange={(v) => onPanShapeChange(v as "round" | "square" | "rectangular")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="rectangular">Rectangular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions Inputs */}
      {inputs.panShape === "round" && (
        <div className="space-y-2">
          <Label htmlFor="diameter" className="text-slate-700 dark:text-slate-300">
            Diameter ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="diameter"
            type="number"
            min={0}
            step="any"
            value={inputs.diameter || ""}
            onChange={(e) => onInputChange("diameter", e.target.value)}
            placeholder={`Enter diameter in ${unit === "imperial" ? "inches" : "cm"}`}
          />
        </div>
      )}

      {inputs.panShape === "square" && (
        <div className="space-y-2">
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Side Length ({unit === "imperial" ? "inches" : "cm"})
          </Label>
          <Input
            id="length"
            type="number"
            min={0}
            step="any"
            value={inputs.length || ""}
            onChange={(e) => onInputChange("length", e.target.value)}
            placeholder={`Enter side length in ${unit === "imperial" ? "inches" : "cm"}`}
          />
        </div>
      )}

      {inputs.panShape === "rectangular" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="length"
              type="number"
              min={0}
              step="any"
              value={inputs.length || ""}
              onChange={(e) => onInputChange("length", e.target.value)}
              placeholder={`Enter length in ${unit === "imperial" ? "inches" : "cm"}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              id="width"
              type="number"
              min={0}
              step="any"
              value={inputs.width || ""}
              onChange={(e) => onInputChange("width", e.target.value)}
              placeholder={`Enter width in ${unit === "imperial" ? "inches" : "cm"}`}
            />
          </div>
        </>
      )}

      {/* Oil Depth */}
      <div className="space-y-2">
        <Label htmlFor="oilDepth" className="text-slate-700 dark:text-slate-300">
          Oil Depth ({depthUnit})
        </Label>
        <Input
          id="oilDepth"
          type="number"
          min={0}
          step="any"
          value={inputs.oilDepth || ""}
          onChange={(e) => onInputChange("oilDepth", e.target.value)}
          placeholder={`Enter oil depth in ${depthUnit}`}
        />
      </div>

      {/* Ingredient Selection */}
      <div className="space-y-2">
        <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
          Oil Type
        </Label>
        <Select
          id="ingredient"
          value={inputs.ingredient || "vegetable oil"}
          onValueChange={(v) => onInputChange("ingredient", v)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(densityMap).map((oil) => (
              <SelectItem key={oil} value={oil}>
                {oil.charAt(0).toUpperCase() + oil.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Oil Temperature */}
      <div className="space-y-2">
        <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
          Oil Temperature ({tempUnit}) <Info className="inline-block ml-1 w-4 h-4 text-slate-400" />
        </Label>
        <Input
          id="temperature"
          type="number"
          min={0}
          step="any"
          value={inputs.temperature || ""}
          onChange={(e) => onInputChange("temperature", e.target.value)}
          placeholder={`Enter oil temperature in ${tempUnit}`}
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
              panShape: "round",
              diameter: "",
              length: "",
              width: "",
              oilDepth: "",
              ingredient: "vegetable oil",
              temperature: "",
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
              <strong>Chef's Tip:</strong> Use a digital scale for frying oil
              precision and always monitor oil temperature for safety.
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
          Understanding Oil for Frying Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Deep frying is a popular cooking method that requires precise amounts
          of oil to ensure food cooks evenly and safely. The Oil for Frying
          Calculator helps you determine the exact volume and weight of oil
          needed to fill your pan or fryer to the desired depth, based on its
          shape and dimensions. This precision prevents oil waste and kitchen
          hazards.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting your pan's shape—round, square, or rectangular—and its
          measurements, along with the oil depth you want, this tool calculates
          the volume of oil required. It also converts this volume into weight
          using the density of your chosen oil type, accommodating both metric
          and imperial units for convenience.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the calculator monitors your oil temperature to ensure
          it stays out of the USDA Danger Zone (40-140°F), where bacteria can
          thrive. Maintaining proper frying temperature is crucial for food
          safety and optimal cooking results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Oil for Frying Calculator, first select your preferred unit
          system: Imperial (cups and °F) or Metric (grams and °C). Then, choose
          your pan shape and enter its dimensions accurately. Specify the oil
          depth you want to fill the pan with, select the type of oil you plan
          to use, and input the current oil temperature.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that matches your
            measuring tools.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the pan shape and enter the
            corresponding dimensions.
          </li>
          <li>
            <strong>Step 3:</strong> Input the desired oil depth to ensure
            proper frying coverage.
          </li>
          <li>
            <strong>Step 4:</strong> Select the oil type to get accurate weight
            conversions.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the oil temperature to check for
            safety warnings.
          </li>
          <li>
            <strong>Step 6:</strong> Click Calculate to see the volume and
            weight of oil needed.
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
              href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-safety-temperature-chart"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA Food Safety Temperature Chart
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on safe cooking and holding temperatures to
              prevent foodborne illness.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cooksinfo.com/oil-density"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Oil Density and Properties
            </a>
            <p className="text-slate-500 text-sm">
              Detailed information on densities of various cooking oils for
              accurate volume-to-weight conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-deep-fry-food-safely"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. How to Deep Fry Food Safely
            </a>
            <p className="text-slate-500 text-sm">
              Expert tips and safety measures for deep frying at home.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Oil for Frying Calculator"
      description="Calculate oil needed for deep frying. Determine the volume required to fill your pan or fryer to the safe depth level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Volume = Area × Depth; Area depends on pan shape: Round = π × (Diameter/2)², Square = Side², Rectangular = Length × Width",
        variables: [
          { symbol: "Diameter, Length, Width, Depth", description: "Pan dimensions" },
          { symbol: "Volume", description: "Oil volume needed" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a round pan with a diameter of 10 inches and want to fill it with 2 inches of oil.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the area: π × (10/2)² = 78.54 in².",
          },
          {
            label: "2",
            explanation:
              "Calculate volume: 78.54 in² × 2 in = 157.08 in³.",
          },
          {
            label: "3",
            explanation:
              "Convert volume to cups: 157.08 in³ × 0.554 = 87 cups (approx).",
          },
          {
            label: "4",
            explanation:
              "Use oil density to find weight if needed.",
          },
        ],
        result: "You need approximately 6.8 cups (1.6 liters) of oil to fill the pan to 2 inches depth.",
      }}
      relatedCalculators={[
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🍞",
        },
        {
          title: "Alcohol by Volume (ABV) Dilution",
          url: "/cooking/alcohol-abv-dilution",
          icon: "🥩",
        },
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "📏",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Oil for Frying Calculator" },
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