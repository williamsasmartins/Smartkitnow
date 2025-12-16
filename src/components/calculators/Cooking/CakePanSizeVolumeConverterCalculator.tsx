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

export default function CakePanSizeVolumeConverterCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); // imperial or metric

  // Inputs: pan shape, dimensions, ingredient (optional for density calc)
  const [inputs, setInputs] = useState({
    panShape: "round", // round or square
    diameter: "", // for round pan (inches or cm)
    length: "", // for square pan (inches or cm)
    width: "", // for square pan (inches or cm)
    height: "", // pan height (inches or cm)
    ingredient: "none", // ingredient for density conversion
    amount: "", // amount in cups or grams depending on unit
    convertDirection: "volume-to-weight", // volume-to-weight or weight-to-volume
  });

  // 2. CONSTANTS & MAPS

  // Ingredient densities in g/ml or g/cup (for solids, use g/cup; for liquids, g/ml)
  // Source: King Arthur Baking, USDA, Serious Eats
  // 1 US cup = 236.588 ml
  // For solids, density is grams per cup (not volume ml)
  // For liquids, density is grams per ml (close to 1 for water)
  const ingredientDensity = {
    flour_ap: 120, // grams per cup (all-purpose flour)
    sugar_granulated: 200, // grams per cup
    butter: 227, // grams per cup (1 cup butter = 227g)
    water: 236.588, // grams per cup (1ml water = 1g)
    rice_basmati: 185, // grams per cup uncooked
    rice_jasmine: 180,
    rice_brown: 195,
    honey: 340,
    milk: 245,
    cocoa_powder: 85,
    baking_powder: 192,
    salt: 292,
  };

  // Helper: convert inches to cm and vice versa
  const inchToCm = (inch: number) => inch * 2.54;
  const cmToInch = (cm: number) => cm / 2.54;

  // 3. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs safely
    const diameter = parseFloat(inputs.diameter);
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const amount = parseFloat(inputs.amount);

    // Validate dimensions
    if (
      (inputs.panShape === "round" && (isNaN(diameter) || diameter <= 0)) ||
      (inputs.panShape === "square" &&
        (isNaN(length) || length <= 0 || isNaN(width) || width <= 0)) ||
      isNaN(height) ||
      height <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid pan dimensions.",
        subtext: null,
        warning: null,
      };
    }

    // Calculate volume in cubic inches or cubic cm
    // Volume round = π * r² * h
    // Volume square = L * W * H
    let volume = 0; // in cubic inches or cubic cm depending on unit

    if (unit === "imperial") {
      if (inputs.panShape === "round") {
        const r = diameter / 2;
        volume = Math.PI * r * r * height; // cubic inches
      } else {
        volume = length * width * height; // cubic inches
      }
    } else {
      // metric: convert inputs from cm to cm (already assumed cm)
      if (inputs.panShape === "round") {
        const r = diameter / 2;
        volume = Math.PI * r * r * height; // cubic cm
      } else {
        volume = length * width * height; // cubic cm
      }
    }

    // Convert volume to cups for ingredient conversion
    // 1 US cup = 14.4375 cubic inches
    // 1 metric cup = 240 ml = 240 cubic cm
    let volumeInCups = 0;
    if (unit === "imperial") {
      volumeInCups = volume / 14.4375;
    } else {
      volumeInCups = volume / 240;
    }

    // Ingredient density conversion logic
    // If ingredient is "none", just return volume in cups or ml
    if (inputs.ingredient === "none") {
      // Return volume in cups or ml
      if (unit === "imperial") {
        return {
          value: volumeInCups.toFixed(2),
          label: "Pan Volume (cups)",
          subtext:
            "Volume calculated using pan dimensions. Use this to scale recipes accurately.",
          warning: null,
        };
      } else {
        // metric: volume in ml = volume in cubic cm
        return {
          value: volume.toFixed(0),
          label: "Pan Volume (ml)",
          subtext:
            "Volume calculated using pan dimensions. Use this to scale recipes accurately.",
          warning: null,
        };
      }
    }

    // If ingredient selected, do volume-to-weight or weight-to-volume conversion
    const density = ingredientDensity[inputs.ingredient];
    if (!density) {
      return {
        value: 0,
        label: "Ingredient density not found.",
        subtext: null,
        warning: null,
      };
    }

    // Conversion:
    // volume-to-weight: amount in cups * density (g/cup) = grams
    // weight-to-volume: amount in grams / density = cups

    // If unit is metric, amount input is grams or ml
    // If unit is imperial, amount input is cups or lbs (for weight, convert lbs to grams)

    // For simplicity, assume amount input is cups (volume) or grams (weight) depending on convertDirection

    if (inputs.convertDirection === "volume-to-weight") {
      // amount is volume (cups)
      if (isNaN(amount) || amount <= 0) {
        return {
          value: 0,
          label: "Enter a valid amount to convert.",
          subtext: null,
          warning: null,
        };
      }
      // Convert cups to grams using density
      // For imperial, amount is cups; for metric, amount is ml, convert ml to cups first
      let cupsAmount = amount;
      if (unit === "metric") {
        // amount is ml, convert to cups
        cupsAmount = amount / 240;
      }
      const grams = cupsAmount * density;
      if (unit === "imperial") {
        // convert grams to lbs
        const lbs = grams / 453.592;
        return {
          value: lbs.toFixed(3),
          label: "Weight (lbs)",
          subtext: `Converted from ${amount} cups of ${inputs.ingredient.replace(
            /_/g,
            " "
          )}.`,
          warning: null,
        };
      } else {
        return {
          value: grams.toFixed(1),
          label: "Weight (grams)",
          subtext: `Converted from ${amount} ml of ${inputs.ingredient.replace(
            /_/g,
            " "
          )}.`,
          warning: null,
        };
      }
    } else {
      // weight-to-volume
      if (isNaN(amount) || amount <= 0) {
        return {
          value: 0,
          label: "Enter a valid amount to convert.",
          subtext: null,
          warning: null,
        };
      }
      // amount is weight (grams or lbs)
      let gramsAmount = amount;
      if (unit === "imperial") {
        // amount is lbs, convert to grams
        gramsAmount = amount * 453.592;
      }
      const cups = gramsAmount / density;
      if (unit === "imperial") {
        return {
          value: cups.toFixed(2),
          label: "Volume (cups)",
          subtext: `Converted from ${amount} lbs of ${inputs.ingredient.replace(
            /_/g,
            " "
          )}.`,
          warning: null,
        };
      } else {
        // metric: cups to ml
        const ml = cups * 240;
        return {
          value: ml.toFixed(0),
          label: "Volume (ml)",
          subtext: `Converted from ${amount} grams of ${inputs.ingredient.replace(
            /_/g,
            " "
          )}.`,
          warning: null,
        };
      }
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How do I adjust a recipe for a different cake pan size?",
      answer:
        "Calculate the volume of your original and new pans using the formula for round or square pans. Then, scale your ingredient quantities proportionally to the volume ratio to maintain the recipe's balance and baking times.",
    },
    {
      question: "Why is ingredient density important in conversions?",
      answer:
        "Different ingredients have unique densities, meaning 1 cup of flour weighs less than 1 cup of sugar. Using ingredient-specific densities ensures accurate weight-to-volume or volume-to-weight conversions, critical for baking precision.",
    },
    {
      question: "Can I use this tool for non-baking recipes?",
      answer:
        "Yes, but keep in mind that ingredient densities and volume calculations are tailored for baking ingredients. For liquids or other food types, verify densities and adjust accordingly for best results.",
    },
    {
      question: "Why do baking recipes prefer weight measurements over volume?",
      answer:
        "Weight measurements are more precise and consistent than volume, which can vary due to ingredient packing or humidity. Using a digital scale improves accuracy, leading to better baking outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // 5. UI WIDGET
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
                Imperial (Cups/°F/Lbs)
              </SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
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
          name="panShape"
          value={inputs.panShape}
          onChange={handleInputChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="square">Square/Rectangular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions */}
      {inputs.panShape === "round" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="diameter" className="text-slate-700 dark:text-slate-300">
              Diameter ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              type="number"
              name="diameter"
              value={inputs.diameter}
              onChange={handleInputChange}
              placeholder={`e.g. ${unit === "imperial" ? "8" : "20"}`}
              min={0}
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              type="number"
              name="height"
              value={inputs.height}
              onChange={handleInputChange}
              placeholder={`e.g. ${unit === "imperial" ? "2" : "5"}`}
              min={0}
              step="any"
            />
          </div>
          <div />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
              Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              type="number"
              name="length"
              value={inputs.length}
              onChange={handleInputChange}
              placeholder={`e.g. ${unit === "imperial" ? "9" : "23"}`}
              min={0}
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
              Width ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              type="number"
              name="width"
              value={inputs.width}
              onChange={handleInputChange}
              placeholder={`e.g. ${unit === "imperial" ? "13" : "33"}`}
              min={0}
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">
              Height ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              type="number"
              name="height"
              value={inputs.height}
              onChange={handleInputChange}
              placeholder={`e.g. ${unit === "imperial" ? "2" : "5"}`}
              min={0}
              step="any"
            />
          </div>
        </div>
      )}

      {/* Ingredient Conversion */}
      <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Label className="text-slate-700 dark:text-slate-300">
          Ingredient (optional)
        </Label>
        <Select
          name="ingredient"
          value={inputs.ingredient}
          onChange={handleInputChange}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Just volume)</SelectItem>
            <SelectItem value="flour_ap">All-Purpose Flour</SelectItem>
            <SelectItem value="sugar_granulated">Granulated Sugar</SelectItem>
            <SelectItem value="butter">Butter</SelectItem>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="rice_basmati">Basmati Rice</SelectItem>
            <SelectItem value="rice_jasmine">Jasmine Rice</SelectItem>
            <SelectItem value="rice_brown">Brown Rice</SelectItem>
            <SelectItem value="honey">Honey</SelectItem>
            <SelectItem value="milk">Milk</SelectItem>
            <SelectItem value="cocoa_powder">Cocoa Powder</SelectItem>
            <SelectItem value="baking_powder">Baking Powder</SelectItem>
            <SelectItem value="salt">Salt</SelectItem>
          </SelectContent>
        </Select>

        {inputs.ingredient !== "none" && (
          <>
            <div className="pt-2">
              <Label className="text-slate-700 dark:text-slate-300">
                Conversion Direction
              </Label>
              <Select
                name="convertDirection"
                value={inputs.convertDirection}
                onChange={handleInputChange}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume-to-weight">
                    Volume to Weight
                  </SelectItem>
                  <SelectItem value="weight-to-volume">
                    Weight to Volume
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Label className="text-slate-700 dark:text-slate-300">
                Amount ({() => {
                  if (unit === "imperial") {
                    return inputs.convertDirection === "volume-to-weight"
                      ? "cups"
                      : "lbs";
                  } else {
                    return inputs.convertDirection === "volume-to-weight"
                      ? "ml"
                      : "grams";
                  }
                }()})
              </Label>
              <Input
                type="number"
                name="amount"
                value={inputs.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min={0}
                step="any"
              />
            </div>
          </>
        )}
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
          onClick={() =>
            setInputs({
              panShape: "round",
              diameter: "",
              length: "",
              width: "",
              height: "",
              ingredient: "none",
              amount: "",
              convertDirection: "volume-to-weight",
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
              Adjust pan sizes by volume to keep your recipe balanced.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cake Pan Size & Volume Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baking is a precise science where pan size and volume directly affect
          the outcome of your cake. Different pan shapes and sizes hold varying
          amounts of batter, which can change baking times and texture. This
          converter helps you calculate the volume of your cake pan accurately,
          whether round or square, so you can adjust your recipe quantities
          accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By understanding the volume your pan holds, you can scale ingredients
          up or down without compromising the balance of your recipe. This tool
          also integrates ingredient density data, allowing you to convert
          between volume and weight measurements precisely—critical for baking
          success.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this converter ensures your cakes bake evenly and come out with
          the intended texture and flavor. Whether you’re switching from a
          round to a square pan or converting cups of flour to grams, this
          tool is your culinary companion for consistent baking results.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Cake Pan Size & Volume Converter, first select your pan
          shape and enter its dimensions in your preferred unit system. If you
          want to convert ingredient amounts, select the ingredient and specify
          whether you want to convert volume to weight or vice versa. Enter the
          amount and get precise conversions based on trusted density data.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose your pan shape (round or square)
            and enter the dimensions (diameter, length, width, height).
          </li>
          <li>
            <strong>Step 2:</strong> Optionally select an ingredient to convert
            between volume and weight using accurate density values.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the amount and conversion direction
            (volume to weight or weight to volume).
          </li>
          <li>
            <strong>Step 4:</strong> Review the calculated pan volume or
            ingredient conversion and adjust your recipe accordingly.
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
              href="https://www.kingarthurbaking.com/learn/guides/baking-measurements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. King Arthur Baking - Baking Measurements & Conversions
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on ingredient densities and baking conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. USDA - Food Safety and Ingredient Standards
            </a>
            <p className="text-slate-500 text-sm">
              Official guidelines on food safety and ingredient handling.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - Science of Baking and Ingredient Density
            </a>
            <p className="text-slate-500 text-sm">
              In-depth articles on baking science and ingredient properties.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cake Pan Size & Volume Converter"
      description="Convert cake pan sizes. Adjust recipes for different pan shapes and volumes (round vs square) without ruining your bake."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula:
          "Volume (round) = π × (diameter/2)² × height; Volume (square) = length × width × height",
        variables: [
          { symbol: "diameter", description: "Pan diameter" },
          { symbol: "length", description: "Pan length" },
          { symbol: "width", description: "Pan width" },
          { symbol: "height", description: "Pan height" },
          { symbol: "Volume", description: "Pan volume" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You want to bake a cake in a 9x13 inch rectangular pan instead of an 8-inch round pan. Calculate the volume difference to adjust your recipe.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate volume of 8-inch round pan: π × (8/2)² × 2 = 100.53 cubic inches.",
          },
          {
            label: "2",
            explanation:
              "Calculate volume of 9x13 inch pan: 9 × 13 × 2 = 234 cubic inches.",
          },
          {
            label: "3",
            explanation:
              "Ratio = 234 / 100.53 ≈ 2.33. Multiply ingredient amounts by 2.33.",
          },
        ],
        result:
          "Adjust your recipe quantities by 2.33 to fit the larger pan without affecting baking quality.",
      }}
      relatedCalculators={[
        {
          title: "Yeast Conversion Calculator",
          url: "/cooking/yeast-conversion-instant-active-fresh",
          icon: "🍳",
        },
        {
          title: "Fahrenheit ↔ Celsius Converter",
          url: "/cooking/fahrenheit-celsius-oven-internal-temp",
          icon: "🍞",
        },
        {
          title: "Oil for Frying Calculator",
          url: "/cooking/oil-for-frying-pan-depth-volume",
          icon: "🥩",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Serving Size Multiplier",
          url: "/cooking/serving-size-multiplier",
          icon: "📏",
        },
        {
          title: "Icing/Frosting Coverage by Cake Size",
          url: "/cooking/icing-frosting-coverage-cake-size",
          icon: "🍰",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cake Pan Size & Volume Converter" },
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