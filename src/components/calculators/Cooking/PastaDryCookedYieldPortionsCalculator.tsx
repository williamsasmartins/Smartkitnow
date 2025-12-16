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

export default function PastaDryCookedYieldPortionsCalculator() {
  // Unit system: imperial (cups, °F) or metric (grams, °C)
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs:
  // - dryAmount: number (amount of dry pasta)
  // - dryUnit: string ("cups" or "grams")
  // - cookedPortions: number (desired cooked portions)
  // - portionSize: number (grams or cups per portion cooked)
  // - pastaType: string (to select yield factor)
  const [inputs, setInputs] = useState<{
    dryAmount?: number;
    dryUnit?: string;
    cookedPortions?: number;
    portionSize?: number;
    pastaType?: string;
  }>({
    dryAmount: undefined,
    dryUnit: undefined,
    cookedPortions: undefined,
    portionSize: undefined,
    pastaType: "regular",
  });

  // Pasta yield factors (cooked weight / dry weight)
  // Source: Culinary references, typical pasta yield ~2.0 to 2.5 times dry weight
  // We use factors for different pasta types:
  // - regular pasta: 2.2
  // - whole wheat: 2.1
  // - gluten free: 2.3
  // - fresh pasta: 1.8 (less water absorption)
  // - rice pasta: 2.0
  const pastaYieldFactors: Record<string, number> = {
    regular: 2.2,
    "whole wheat": 2.1,
    "gluten free": 2.3,
    fresh: 1.8,
    rice: 2.0,
  };

  // Density map for dry pasta (grams per cup)
  // Source: USDA and culinary references
  // Dry pasta density varies by shape, but average ~100g/cup (uncooked)
  // We'll use 100g/cup for dry pasta as a baseline
  const dryPastaDensityGPerCup = 100;

  // Portion size defaults (cooked pasta per portion)
  // Typical cooked pasta portion ~140g (5oz) cooked weight per serving
  // For imperial, portion size in cups cooked ~ 1 cup cooked pasta ~ 140g cooked
  // We'll allow user input but provide defaults
  const defaultPortionSizeCookedG = 140;

  // Calculate results
  const results = useMemo(() => {
    // Extract inputs safely
    const dryAmount = inputs.dryAmount ?? 0;
    const dryUnit = inputs.dryUnit ?? (unit === "imperial" ? "cups" : "grams");
    const cookedPortions = inputs.cookedPortions ?? 0;
    const portionSize = inputs.portionSize ?? defaultPortionSizeCookedG;
    const pastaType = inputs.pastaType ?? "regular";

    // Validate inputs
    if (
      dryAmount <= 0 &&
      cookedPortions <= 0 // no input to calculate
    ) {
      return {
        value: 0,
        label: "Enter dry amount or cooked portions",
        subtext: "",
        warning: null,
      };
    }

    // Get yield factor for pasta type
    const yieldFactor = pastaYieldFactors[pastaType] ?? 2.2;

    // Convert dry amount to grams if needed
    let dryGrams: number;
    if (unit === "imperial") {
      if (dryUnit === "cups") {
        dryGrams = dryAmount * dryPastaDensityGPerCup;
      } else if (dryUnit === "grams") {
        dryGrams = dryAmount;
      } else {
        // Unknown unit fallback
        dryGrams = dryAmount;
      }
    } else {
      // Metric system: assume grams input
      dryGrams = dryAmount;
    }

    // Convert portion size to grams if needed
    let portionSizeGrams: number;
    if (unit === "imperial") {
      // If portionSize is in cups (user input), convert to grams cooked
      // Assume portionSize input is in cups cooked if unit=imperial and dryUnit=cups
      // But we will treat portionSize as grams cooked for simplicity
      portionSizeGrams = portionSize;
    } else {
      portionSizeGrams = portionSize;
    }

    // Calculate cooked weight from dry grams
    const cookedGramsFromDry = dryGrams * yieldFactor;

    // Calculate dry grams needed for desired cooked portions
    const dryGramsForPortions =
      cookedPortions > 0 ? (cookedPortions * portionSizeGrams) / yieldFactor : 0;

    // Convert cooked grams to cups cooked (imperial)
    // Typical cooked pasta density ~140g per cup cooked (varies by shape)
    // Use 140g/cup cooked pasta as baseline
    const cookedPastaDensityGPerCup = 140;

    // Convert cooked grams to cups cooked
    const cookedCupsFromDry =
      unit === "imperial" ? cookedGramsFromDry / cookedPastaDensityGPerCup : 0;

    // Convert dry grams to cups dry (imperial)
    const dryCupsFromDryGrams =
      unit === "imperial" ? dryGrams / dryPastaDensityGPerCup : 0;

    // Convert dry grams needed for portions to cups dry (imperial)
    const dryCupsForPortions =
      unit === "imperial" ? dryGramsForPortions / dryPastaDensityGPerCup : 0;

    // Prepare display strings
    let value = "";
    let label = "";
    let subtext = "";
    let warning: string | null = null;

    // If user inputs dry amount, show cooked yield and portions estimate
    if (dryAmount > 0) {
      if (unit === "imperial") {
        const dryAmountDisplay =
          dryUnit === "cups"
            ? `${dryAmount.toFixed(2)} cups dry`
            : `${dryAmount.toFixed(0)} grams dry`;
        const cookedWeightDisplay = `${cookedGramsFromDry.toFixed(0)} grams cooked`;
        const cookedVolumeDisplay = `${cookedCupsFromDry.toFixed(2)} cups cooked`;
        const estPortions = cookedGramsFromDry / portionSizeGrams;

        value = cookedWeightDisplay;
        label = `Cooked yield from ${dryAmountDisplay}`;
        subtext = `≈ ${cookedVolumeDisplay} (~${estPortions.toFixed(1)} portions)`;
      } else {
        // Metric
        const dryAmountDisplay = `${dryAmount.toFixed(0)} grams dry`;
        const cookedWeightDisplay = `${cookedGramsFromDry.toFixed(0)} grams cooked`;
        const estPortions = cookedGramsFromDry / portionSizeGrams;

        value = cookedWeightDisplay;
        label = `Cooked yield from ${dryAmountDisplay}`;
        subtext = `≈ ${estPortions.toFixed(1)} portions (portion size ${portionSizeGrams}g)`;
      }
    }
    // Else if user inputs desired cooked portions, show dry pasta needed
    else if (cookedPortions > 0) {
      if (unit === "imperial") {
        const dryAmountDisplay =
          dryCupsForPortions > 0
            ? `${dryCupsForPortions.toFixed(2)} cups dry`
            : `${dryGramsForPortions.toFixed(0)} grams dry`;
        const cookedPortionsDisplay = `${cookedPortions} portions`;
        value = dryAmountDisplay;
        label = `Dry pasta needed for ${cookedPortionsDisplay}`;
        subtext = `(Portion size ${portionSizeGrams}g cooked, yield factor ${yieldFactor.toFixed(
          2
        )})`;
      } else {
        // Metric
        const dryAmountDisplay = `${dryGramsForPortions.toFixed(0)} grams dry`;
        const cookedPortionsDisplay = `${cookedPortions} portions`;
        value = dryAmountDisplay;
        label = `Dry pasta needed for ${cookedPortionsDisplay}`;
        subtext = `(Portion size ${portionSizeGrams}g cooked, yield factor ${yieldFactor.toFixed(
          2
        )})`;
      }
    }

    // No warnings for pasta yield, but if portion size is unrealistic, warn
    if (portionSizeGrams < 50) {
      warning =
        "Portion size is very small; typical cooked pasta portion is around 140g.";
    } else if (portionSizeGrams > 300) {
      warning =
        "Portion size is large; ensure this matches your serving expectations.";
    }

    return {
      value,
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // FAQs for culinary context
  const faqs = [
    {
      question: "Why does pasta weight increase after cooking?",
      answer:
        "Pasta absorbs water during cooking, increasing its weight by approximately 2 to 2.5 times depending on the type. This absorption affects portion sizes and cooking yields, so understanding this helps in meal planning and accurate recipe scaling.",
    },
    {
      question: "How do I measure dry pasta accurately?",
      answer:
        "Using a digital kitchen scale is the most precise method to measure dry pasta. Volume measurements like cups can vary due to pasta shape and size, so weighing ensures consistent cooking results and portion control.",
    },
    {
      question: "Can I use this calculator for fresh pasta?",
      answer:
        "Yes, but fresh pasta absorbs less water than dry pasta, so its yield factor is lower (around 1.8). Select 'fresh' pasta type in the calculator for more accurate conversions.",
    },
    {
      question: "How do portion sizes affect cooking quantities?",
      answer:
        "Portion sizes determine how much cooked pasta you need per serving. Adjusting portion size in the calculator helps estimate the dry pasta required to meet your desired servings, ensuring no waste or shortage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // JSX Inputs controlled by state
  // Dry amount input (number)
  // Dry unit select (cups or grams)
  // Cooked portions input (number)
  // Portion size input (grams cooked per portion)
  // Pasta type select

  // Handlers
  function onInputChange(
    field: keyof typeof inputs,
    value: string | number | undefined
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  }

  // Dry unit options depend on unit system
  const dryUnitOptions =
    unit === "imperial" ? ["cups", "grams"] : ["grams"];

  // Portion size label depends on unit
  const portionSizeLabel =
    unit === "imperial"
      ? "Portion Size (grams cooked)"
      : "Portion Size (grams cooked)";

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
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

      {/* Dry Amount Input */}
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="dryAmount" className="text-slate-700 dark:text-slate-300">
            Dry Pasta Amount
          </Label>
          <Input
            id="dryAmount"
            type="number"
            min={0}
            step="any"
            placeholder={
              unit === "imperial" ? "e.g. 1.5" : "e.g. 150"
            }
            value={inputs.dryAmount ?? ""}
            onChange={(e) =>
              onInputChange("dryAmount", parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="dryUnit" className="text-slate-700 dark:text-slate-300">
            Dry Unit
          </Label>
          <Select
            id="dryUnit"
            value={inputs.dryUnit ?? dryUnitOptions[0]}
            onValueChange={(v) => onInputChange("dryUnit", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dryUnitOptions.map((unitOption) => (
                <SelectItem key={unitOption} value={unitOption}>
                  {unitOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cooked Portions Input */}
      <div>
        <Label htmlFor="cookedPortions" className="text-slate-700 dark:text-slate-300">
          Desired Cooked Portions
        </Label>
        <Input
          id="cookedPortions"
          type="number"
          min={0}
          step="1"
          placeholder="e.g. 4"
          value={inputs.cookedPortions ?? ""}
          onChange={(e) =>
            onInputChange("cookedPortions", parseInt(e.target.value))
          }
        />
      </div>

      {/* Portion Size Input */}
      <div>
        <Label htmlFor="portionSize" className="text-slate-700 dark:text-slate-300">
          {portionSizeLabel}
        </Label>
        <Input
          id="portionSize"
          type="number"
          min={10}
          step="any"
          placeholder={`${defaultPortionSizeCookedG} grams`}
          value={inputs.portionSize ?? ""}
          onChange={(e) =>
            onInputChange("portionSize", parseFloat(e.target.value))
          }
        />
      </div>

      {/* Pasta Type Select */}
      <div>
        <Label htmlFor="pastaType" className="text-slate-700 dark:text-slate-300">
          Pasta Type
        </Label>
        <Select
          id="pastaType"
          value={inputs.pastaType ?? "regular"}
          onValueChange={(v) => onInputChange("pastaType", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="whole wheat">Whole Wheat</SelectItem>
            <SelectItem value="gluten free">Gluten Free</SelectItem>
            <SelectItem value="fresh">Fresh Pasta</SelectItem>
            <SelectItem value="rice">Rice Pasta</SelectItem>
          </SelectContent>
        </Select>
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
              dryAmount: undefined,
              dryUnit: dryUnitOptions[0],
              cookedPortions: undefined,
              portionSize: undefined,
              pastaType: "regular",
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
              <strong>Chef's Tip:</strong> Use a digital scale for precise dry pasta
              measurement and adjust portion size based on appetite and recipe.
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
          Understanding Pasta Dry ↔ Cooked Yield & Portions
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pasta is a staple ingredient in many cuisines, but its transformation during
          cooking can be confusing. Dry pasta absorbs water and swells, increasing in
          weight and volume. This yield varies by pasta type and cooking time, typically
          doubling or more in weight. Understanding this conversion is essential for
          accurate recipe scaling, portion control, and minimizing waste.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Different pasta types absorb water differently. For example, whole wheat pasta
          tends to absorb slightly less water than regular pasta, while gluten-free
          varieties may absorb more. Fresh pasta, containing more moisture initially,
          has a lower yield factor. This calculator helps you convert between dry pasta
          amounts and cooked yields, tailored to your pasta type and desired portions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool allows you to convert dry pasta quantities to cooked yields or
          calculate how much dry pasta you need to prepare a specific number of cooked
          portions. Select your preferred unit system, enter either the dry pasta amount
          or desired cooked portions, and adjust the portion size if needed. Choose your
          pasta type for accurate yield factors.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the dry pasta amount (cups or grams) or the
            desired number of cooked portions.
          </li>
          <li>
            <strong>Step 3:</strong> Adjust the portion size if your serving size
            differs from the default (~140g cooked).
          </li>
          <li>
            <strong>Step 4:</strong> Select the pasta type to apply the correct yield
            factor.
          </li>
          <li>
            <strong>Step 5:</strong> Click Calculate to see the cooked yield or dry
            pasta needed.
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
              href="https://www.usda.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. USDA FoodData Central
            </a>
            <p className="text-slate-500 text-sm">
              Official database for food composition and nutrient data, including pasta
              densities and cooking yields.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.culinaryinstitute.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Culinary Institute of America - Pasta Cooking Yields
            </a>
            <p className="text-slate-500 text-sm">
              Professional culinary resource detailing pasta cooking techniques and
              yield factors.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.seriouseats.com/how-to-cook-pasta-perfectly"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Serious Eats - How to Cook Pasta Perfectly
            </a>
            <p className="text-slate-500 text-sm">
              Expert guide on pasta cooking, hydration, and portioning for home cooks.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pasta Dry ↔ Cooked Yield & Portions"
      description="Convert dry pasta to cooked weight. Estimate how much pasta to boil to get the exact number of cooked servings you need."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula: "Cooked Weight = Dry Weight × Yield Factor",
        variables: [
          { symbol: "Dry Weight", description: "Weight of dry pasta" },
          { symbol: "Cooked Weight", description: "Weight of cooked pasta" },
          { symbol: "Yield Factor", description: "Typical 2.2 for regular pasta" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to cook enough regular dry pasta to serve 4 portions, each portion about 140g cooked.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate total cooked weight needed: 4 portions × 140g = 560g cooked pasta.",
          },
          {
            label: "2",
            explanation:
              "Divide by yield factor (2.2) to find dry pasta needed: 560g ÷ 2.2 ≈ 255g dry pasta.",
          },
          {
            label: "3",
            explanation:
              "Measure approximately 2.5 cups dry pasta (since 1 cup ≈ 100g dry) and cook.",
          },
        ],
        result: "You need about 255 grams (2.5 cups) of dry pasta to yield 4 cooked portions.",
      }}
      relatedCalculators={[
        {
          title: "Chocolate/Butter Tempering Temperature",
          url: "/cooking/chocolate-butter-tempering-temperature",
          icon: "🌡️",
        },
        {
          title: "Steak Doneness Time & Resting Window",
          url: "/cooking/steak-doneness-time-resting",
          icon: "🥩",
        },
        {
          title: "Defrost Time Estimator",
          url: "/cooking/defrost-time-fridge-cold-water",
          icon: "🥩",
        },
        {
          title: "Volume ↔ Weight Converter",
          url: "/cooking/volume-weight-food-density",
          icon: "🧁",
        },
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "📏",
        },
        {
          title: "Pork/Beef Smoking Time per lb",
          url: "/cooking/pork-beef-smoking-time-per-lb",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Pasta Dry ↔ Cooked Yield & Portions" },
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