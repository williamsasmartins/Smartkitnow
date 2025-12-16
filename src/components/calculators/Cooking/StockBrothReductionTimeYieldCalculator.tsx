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

const INGREDIENT_DENSITY = {
  // grams per cup (approximate)
  flour_ap: 120,
  sugar_granulated: 200,
  butter: 227, // 1 cup butter = 227g (1 stick = 113.5g)
  water: 236,
  rice_basmati: 185,
  rice_jasmine: 180,
  rice_brown: 195,
  stock: 240, // approx density close to water
  broth: 240,
};

const REDUCTION_YIELD_PERCENTAGES = {
  demi_glace: 0.5, // 50% volume remains
  glaze: 0.25, // 25% volume remains
  standard: 0.75, // 75% volume remains (light reduction)
};

const USDA_DANGER_ZONE_F = { min: 40, max: 140 };
const USDA_DANGER_ZONE_C = { min: 4.4, max: 60 };

export default function StockBrothReductionTimeYieldCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    ingredient: string;
    amount: string;
    fromUnit: string;
    toUnit: string;
    reductionType: string;
    temperature: string;
  }>({
    ingredient: "stock",
    amount: "",
    fromUnit: "cups",
    toUnit: "cups",
    reductionType: "demi_glace",
    temperature: "",
  });

  // Helper: Convert input amount string to number safely
  const parseAmount = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // Convert volume to grams or vice versa based on ingredient density
  // Supports cups <-> grams and ml <-> grams conversions
  // For stock/broth, density ~ water (1g/ml)
  function convertVolumeWeight(
    ingredientKey: string,
    amount: number,
    fromUnit: string,
    toUnit: string
  ) {
    const density = INGREDIENT_DENSITY[ingredientKey] || 236; // default water density g/cup

    // Units: cups, grams, ml
    // Cups to grams: multiply by density
    // Grams to cups: divide by density
    // ml to grams: 1:1 for water/stock
    // cups to ml: 236 ml per cup
    // ml to cups: divide by 236

    if (fromUnit === toUnit) return amount;

    // Cups to grams
    if (fromUnit === "cups" && toUnit === "grams") {
      return amount * density;
    }
    // Grams to cups
    if (fromUnit === "grams" && toUnit === "cups") {
      return amount / density;
    }
    // Cups to ml
    if (fromUnit === "cups" && toUnit === "ml") {
      return amount * 236;
    }
    // ml to cups
    if (fromUnit === "ml" && toUnit === "cups") {
      return amount / 236;
    }
    // ml to grams (water/stock)
    if (fromUnit === "ml" && toUnit === "grams") {
      return amount * (density / 236);
    }
    // grams to ml (water/stock)
    if (fromUnit === "grams" && toUnit === "ml") {
      return amount * (236 / density);
    }

    // If unknown conversion, return input
    return amount;
  }

  // Convert temperature between F and C
  function convertTemp(value: number, fromUnit: string, toUnit: string) {
    if (fromUnit === toUnit) return value;
    if (fromUnit === "F" && toUnit === "C") {
      return ((value - 32) * 5) / 9;
    }
    if (fromUnit === "C" && toUnit === "F") {
      return (value * 9) / 5 + 32;
    }
    return value;
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const amountNum = parseAmount(inputs.amount);
    if (amountNum === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Determine from/to units for volume/weight conversion
    // For imperial: cups/grams, metric: ml/grams
    // We'll allow fromUnit and toUnit to be cups/grams/ml depending on ingredient

    // Normalize units for ingredient conversion
    let fromUnit = inputs.fromUnit;
    let toUnit = inputs.toUnit;

    // If unit system changed, adjust default units accordingly
    if (unit === "imperial") {
      if (fromUnit === "ml") fromUnit = "cups";
      if (toUnit === "ml") toUnit = "cups";
    } else {
      if (fromUnit === "cups") fromUnit = "ml";
      if (toUnit === "cups") toUnit = "ml";
    }

    // Convert input amount to grams for calculation if needed
    // For reduction yield, volume is primary, so convert to cups or ml first
    // We'll convert input amount to volume (cups or ml) for reduction calculation

    // Convert input amount to volume unit (cups or ml)
    let volumeInput = amountNum;
    if (
      (fromUnit === "grams" || fromUnit === "grams") &&
      (inputs.ingredient in INGREDIENT_DENSITY)
    ) {
      // grams to cups or ml
      volumeInput = convertVolumeWeight(
        inputs.ingredient,
        amountNum,
        "grams",
        unit === "imperial" ? "cups" : "ml"
      );
    } else if (
      fromUnit === "cups" ||
      fromUnit === "ml"
    ) {
      volumeInput = amountNum;
    }

    // Calculate reduced volume based on reduction type
    const reductionFactor =
      REDUCTION_YIELD_PERCENTAGES[inputs.reductionType] || 0.5;

    const reducedVolume = volumeInput * reductionFactor;

    // Convert reduced volume back to desired output unit
    let reducedOutput = reducedVolume;
    if (
      toUnit === "grams" &&
      inputs.ingredient in INGREDIENT_DENSITY
    ) {
      reducedOutput = convertVolumeWeight(
        inputs.ingredient,
        reducedVolume,
        unit === "imperial" ? "cups" : "ml",
        "grams"
      );
    } else if (
      toUnit === "cups" &&
      unit === "metric"
    ) {
      // convert cups to ml
      reducedOutput = reducedVolume * 236;
    } else if (
      toUnit === "ml" &&
      unit === "imperial"
    ) {
      // convert ml to cups
      reducedOutput = reducedVolume / 236;
    }

    // Round result sensibly
    const roundedResult =
      reducedOutput < 1
        ? Math.round(reducedOutput * 100) / 100
        : Math.round(reducedOutput * 10) / 10;

    // Food safety warning for temperature input
    let warning: string | null = null;
    if (inputs.temperature) {
      let tempNum = parseAmount(inputs.temperature);
      if (tempNum > 0) {
        // Convert temp to F for USDA danger zone check
        let tempF = unit === "imperial" ? tempNum : convertTemp(tempNum, "C", "F");
        if (
          tempF >= USDA_DANGER_ZONE_F.min &&
          tempF <= USDA_DANGER_ZONE_F.max
        ) {
          warning =
            "Warning: Temperature is in the USDA Danger Zone (40°F - 140°F). Keep broth hot or cold to prevent bacterial growth.";
        }
      }
    }

    // Label and subtext for output
    const unitLabel =
      toUnit === "grams"
        ? unit === "imperial"
          ? "grams"
          : "grams"
        : toUnit === "cups"
        ? "cups"
        : "ml";

    const reductionLabel =
      inputs.reductionType === "demi_glace"
        ? "Demi-Glace (50% yield)"
        : inputs.reductionType === "glaze"
        ? "Glaze (25% yield)"
        : "Light Reduction (75% yield)";

    return {
      value: roundedResult,
      label: `Reduced Volume/Yield (${reductionLabel}) in ${unitLabel}`,
      subtext: `Starting with ${amountNum} ${inputs.fromUnit} of ${inputs.ingredient.replace(
        /_/g,
        " "
      )}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is stock reduction and why is it important?",
      answer:
        "Stock reduction concentrates flavors by simmering the liquid to evaporate water, resulting in a richer, more intense broth. This process is essential for making demi-glace or glazes, which add depth to sauces and dishes. Proper reduction also improves texture and mouthfeel.",
    },
    {
      question: "How do I know when my stock has reduced enough?",
      answer:
        "Typically, stock is reduced to half (demi-glace) or a quarter (glaze) of its original volume. Visual cues include thicker consistency and intensified aroma. Using a reduction calculator helps estimate time and yield precisely, ensuring consistent results.",
    },
    {
      question: "Why is temperature important during stock reduction?",
      answer:
        "Maintaining safe temperatures prevents bacterial growth. The USDA Danger Zone (40°F - 140°F) is risky for food safety if broth stays in this range too long. Always keep stock hot above 140°F or refrigerate promptly to ensure safety.",
    },
    {
      question: "Can I convert between cups and grams for ingredients in stock?",
      answer:
        "Yes, but ingredient density varies. For example, 1 cup of flour weighs about 120g, while 1 cup of sugar is around 200g. Our calculator uses precise densities for common ingredients to ensure accurate conversions, essential for recipe consistency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // UI Handlers
  const handleInputChange = (
    field: keyof typeof inputs,
    value: string
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setInputs({
      ingredient: "stock",
      amount: "",
      fromUnit: unit === "imperial" ? "cups" : "ml",
      toUnit: unit === "imperial" ? "cups" : "ml",
      reductionType: "demi_glace",
      temperature: "",
    });
  };

  // Update fromUnit and toUnit when unit system changes
  // Reset units accordingly
  const handleUnitChange = (newUnit: "imperial" | "metric") => {
    setUnit(newUnit);
    setInputs((prev) => ({
      ...prev,
      fromUnit: newUnit === "imperial" ? "cups" : "ml",
      toUnit: newUnit === "imperial" ? "cups" : "ml",
    }));
  };

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
                Imperial (Cups/°F/Lbs)
              </SelectItem>
              <SelectItem value="metric">Metric (Grams/°C/Kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ingredient Select */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ingredient" className="text-slate-700 dark:text-slate-300">
            Ingredient
          </Label>
          <Select
            id="ingredient"
            value={inputs.ingredient}
            onValueChange={(val) => handleInputChange("ingredient", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="broth">Broth</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="flour_ap">All-Purpose Flour</SelectItem>
              <SelectItem value="sugar_granulated">Granulated Sugar</SelectItem>
              <SelectItem value="butter">Butter</SelectItem>
              <SelectItem value="rice_basmati">Basmati Rice</SelectItem>
              <SelectItem value="rice_jasmine">Jasmine Rice</SelectItem>
              <SelectItem value="rice_brown">Brown Rice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div>
          <Label htmlFor="amount" className="text-slate-700 dark:text-slate-300">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter amount in ${inputs.fromUnit}`}
            value={inputs.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>
      </div>

      {/* From Unit & To Unit Select */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromUnit" className="text-slate-700 dark:text-slate-300">
            From Unit
          </Label>
          <Select
            id="fromUnit"
            value={inputs.fromUnit}
            onValueChange={(val) => handleInputChange("fromUnit", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unit === "imperial" ? (
                <>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="ml">Milliliters (ml)</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="toUnit" className="text-slate-700 dark:text-slate-300">
            To Unit
          </Label>
          <Select
            id="toUnit"
            value={inputs.toUnit}
            onValueChange={(val) => handleInputChange("toUnit", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unit === "imperial" ? (
                <>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="ml">Milliliters (ml)</SelectItem>
                  <SelectItem value="grams">Grams</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reduction Type */}
      <div>
        <Label htmlFor="reductionType" className="text-slate-700 dark:text-slate-300">
          Reduction Type
        </Label>
        <Select
          id="reductionType"
          value={inputs.reductionType}
          onValueChange={(val) => handleInputChange("reductionType", val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Light Reduction (75% yield)</SelectItem>
            <SelectItem value="demi_glace">Demi-Glace (50% yield)</SelectItem>
            <SelectItem value="glaze">Glaze (25% yield)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Temperature Input */}
      <div>
        <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
          Broth Temperature ({unit === "imperial" ? "°F" : "°C"}) (optional)
        </Label>
        <Input
          id="temperature"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter temperature in ${unit === "imperial" ? "°F" : "°C"}`}
          value={inputs.temperature}
          onChange={(e) => handleInputChange("temperature", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetForm}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <strong>Chef's Tip:</strong> For precise stock reduction, measure
              volume before and after simmering. Use a digital scale for weight
              conversions, and always keep broth out of the USDA Danger Zone to
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
          Understanding Stock/Broth Reduction Time & Yield
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Stock and broth reduction is a fundamental culinary technique used to
          concentrate flavors by simmering the liquid to evaporate water. This
          process intensifies the taste and thickens the texture, creating rich
          bases for sauces, soups, and gravies. The degree of reduction varies
          depending on the desired outcome, such as a demi-glace or a glaze.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Accurately estimating reduction yield helps chefs plan recipes and
          manage ingredient quantities efficiently. Since different ingredients
          have varying densities, converting between volume and weight requires
          precise measurements. This calculator incorporates ingredient-specific
          densities and reduction ratios to provide reliable estimates.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Food safety is paramount during reduction. Broth temperatures must be
          maintained outside the USDA Danger Zone (40°F - 140°F) to prevent
          bacterial growth. Monitoring temperature and time ensures both flavor
          and safety are optimized in your culinary preparations.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Chef's Tips & How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool allows you to input the starting amount of your stock or broth
          and select the desired reduction type. Choose your preferred units and
          ingredient to get an accurate estimate of the reduced volume or weight.
          Optionally, enter the current temperature to receive food safety
          warnings.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the ingredient or liquid you are
            reducing.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the starting amount and select the
            units you are measuring in.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the reduction type (light, demi-glace,
            or glaze) to define the expected yield.
          </li>
          <li>
            <strong>Step 4:</strong> Optionally, input the current temperature to
            check for food safety risks.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to see your estimated reduced
            yield.
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
              Official guidelines on safe cooking temperatures and food handling
              to prevent foodborne illnesses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking Density Charts
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive density data for common baking ingredients used in
              volume-to-weight conversions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats Culinary Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Expert articles on stock reduction methods and flavor concentration.
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
      // ⚠️ CLEAN FORMULA: PRIMARY EQUATION ONLY. NO INTERMEDIATE STEPS.
      formula={{
        title: "Kitchen Math",
        formula: "Reduced Volume = Initial Volume × Reduction Yield %",
        variables: [
          { symbol: "Initial Volume", description: "Starting volume of stock/broth" },
          { symbol: "Reduction Yield %", description: "Fraction of volume remaining after reduction" },
          { symbol: "Reduced Volume", description: "Volume after reduction" },
        ],
      }}
      example={{
        title: "Kitchen Example",
        scenario:
          "You start with 4 cups of stock and want to reduce it to a demi-glace (50% yield).",
        steps: [
          {
            label: "1",
            explanation: "Multiply 4 cups by 0.5 (50%) to find reduced volume.",
          },
        ],
        result: "Reduced Volume = 4 × 0.5 = 2 cups of demi-glace.",
      }}
      relatedCalculators={[
        {
          title: "Cake Pan Size & Volume Converter",
          url: "/cooking/cake-pan-size-volume-converter",
          icon: "🍰",
        },
        {
          title: "Oil for Frying Calculator",
          url: "/cooking/oil-for-frying-pan-depth-volume",
          icon: "🍞",
        },
        {
          title: "Sugar/Butter/Flour Density Lookup",
          url: "/cooking/sugar-butter-flour-density-lookup",
          icon: "🍰",
        },
        {
          title: "Defrost Time Estimator",
          url: "/cooking/defrost-time-fridge-cold-water",
          icon: "🧁",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "📏",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Stock/Broth Reduction Time & Yield" },
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