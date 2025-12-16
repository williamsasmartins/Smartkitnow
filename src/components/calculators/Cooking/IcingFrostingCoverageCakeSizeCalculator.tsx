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

type UnitSystem = "imperial" | "metric";
type CakeShape = "round" | "square";

export default function IcingFrostingCoverageCakeSizeCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const [inputs, setInputs] = useState<{
    shape?: CakeShape;
    diameterOrSide?: string;
    height?: string;
    depth?: string;
    coverageThickness?: string;
  }>({});

  // Constants for density (g/cm³) of typical frosting/icing (approximate)
  // Typical buttercream density ~ 0.9 g/cm³ (close to water but slightly less dense)
  // We'll use 0.9 g/cm³ for all calculations.
  const FROSTING_DENSITY_G_PER_CM3 = 0.9;

  // Conversion constants
  const INCH_TO_CM = 2.54;
  const CUP_TO_CM3 = 236.588; // 1 US cup = 236.588 cm³

  // Default frosting thickness for coverage (in inches or cm)
  // Typical frosting thickness ~ 0.25 inch (6.35 mm)
  const DEFAULT_FROSTING_THICKNESS_IN = 0.25;
  const DEFAULT_FROSTING_THICKNESS_CM = 0.635;

  // Parse float helper
  function parseInput(value?: string): number | null {
    if (!value) return null;
    const n = parseFloat(value);
    return isNaN(n) || n <= 0 ? null : n;
  }

  // Calculate cake surface area (top + sides) in cm²
  // For round cake: top area = π * r², side area = circumference * height
  // For square cake: top area = side², side area = perimeter * height
  // Coverage area = top + sides (no bottom)
  // Coverage volume = coverage area * frosting thickness

  const results = useMemo(() => {
    // Parse inputs
    const shape = inputs.shape ?? "round";
    const diameterOrSide = parseInput(inputs.diameterOrSide);
    const height = parseInput(inputs.height);
    const depth = parseInput(inputs.depth);
    const coverageThicknessInput = parseInput(inputs.coverageThickness);

    // Validation
    if (
      diameterOrSide === null ||
      height === null ||
      depth === null ||
      coverageThicknessInput === null
    ) {
      return {
        value: 0,
        label: "Enter all required inputs",
        subtext: "",
        warning: null,
      };
    }

    // Convert all inputs to metric (cm)
    // diameterOrSide and height and depth are lengths
    // depth is cake depth (height of cake layers)
    // coverageThickness is thickness of frosting layer

    let diameterOrSideCm: number;
    let heightCm: number;
    let depthCm: number;
    let coverageThicknessCm: number;

    if (unit === "imperial") {
      diameterOrSideCm = diameterOrSide * INCH_TO_CM;
      heightCm = height * INCH_TO_CM;
      depthCm = depth * INCH_TO_CM;
      coverageThicknessCm = coverageThicknessInput * INCH_TO_CM;
    } else {
      diameterOrSideCm = diameterOrSide;
      heightCm = height;
      depthCm = depth;
      coverageThicknessCm = coverageThicknessInput;
    }

    // Calculate surface area (top + sides)
    // Top area
    let topAreaCm2: number;
    // Side area
    let sideAreaCm2: number;

    if (shape === "round") {
      const radius = diameterOrSideCm / 2;
      topAreaCm2 = Math.PI * radius * radius;
      const circumference = 2 * Math.PI * radius;
      sideAreaCm2 = circumference * heightCm;
    } else {
      // square
      topAreaCm2 = diameterOrSideCm * diameterOrSideCm;
      const perimeter = 4 * diameterOrSideCm;
      sideAreaCm2 = perimeter * heightCm;
    }

    const totalSurfaceAreaCm2 = topAreaCm2 + sideAreaCm2;

    // Calculate frosting volume needed to cover cake surface area with given thickness
    // Volume = area * thickness (cm³)
    const frostingVolumeCm3 = totalSurfaceAreaCm2 * coverageThicknessCm;

    // Convert frosting volume to weight (grams)
    const frostingWeightGrams = frostingVolumeCm3 * FROSTING_DENSITY_G_PER_CM3;

    // Convert frosting volume to cups (for imperial)
    const frostingVolumeCups = frostingVolumeCm3 / CUP_TO_CM3;

    // Prepare display strings
    let displayValue: string;
    let labelText: string;
    let subtext: string;
    let warningMsg: string | null = null;

    if (unit === "imperial") {
      displayValue = `${frostingVolumeCups.toFixed(2)} cups (${frostingWeightGrams.toFixed(
        0
      )} g)`;
      labelText = "Frosting Volume & Weight";
      subtext = `Based on ${coverageThicknessInput} inch frosting thickness.`;
    } else {
      displayValue = `${frostingWeightGrams.toFixed(0)} grams (${frostingVolumeCm3.toFixed(
        0
      )} cm³)`;
      labelText = "Frosting Weight & Volume";
      subtext = `Based on ${coverageThicknessInput} cm frosting thickness.`;
    }

    // Warning if frosting thickness is unusually thin or thick
    if (
      (unit === "imperial" && coverageThicknessInput < 0.1) ||
      (unit === "metric" && coverageThicknessInput < 0.25)
    ) {
      warningMsg = "Frosting thickness is very thin; coverage may be insufficient.";
    } else if (
      (unit === "imperial" && coverageThicknessInput > 1) ||
      (unit === "metric" && coverageThicknessInput > 2.5)
    ) {
      warningMsg = "Frosting thickness is very thick; adjust for realistic coverage.";
    }

    return {
      value: displayValue,
      label: labelText,
      subtext,
      warning: warningMsg,
    };
  }, [inputs, unit]);

  // FAQ content
  const faqs = [
    {
      question: "How do I determine the right amount of frosting for my cake?",
      answer:
        "To calculate the frosting needed, measure your cake's dimensions and decide on the desired frosting thickness. This calculator estimates the volume and weight of frosting required to cover the top and sides, ensuring you prepare enough without waste.",
    },
    {
      question: "Why is frosting density important in these calculations?",
      answer:
        "Frosting density affects the conversion between volume and weight. Different frostings have varying densities, so using an average density (like 0.9 g/cm³ for buttercream) helps provide accurate weight estimates from volume measurements.",
    },
    {
      question: "Can I use this calculator for layered cakes?",
      answer:
        "Yes, but you should input the total cake height including all layers. The calculator covers the entire cake surface area (top and sides) based on the height you provide, so measure your assembled cake for best results.",
    },
    {
      question: "What if I want to frost only the top of the cake?",
      answer:
        "This calculator assumes coverage of both top and sides. If you want to frost only the top, you can input the cake height as zero or adjust the frosting thickness accordingly, but results may be less precise.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(
    field: keyof typeof inputs,
    value: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Default values for inputs based on unit
  const defaultDiameterOrSide =
    unit === "imperial" ? "8" : "20"; // 8 inch or 20 cm
  const defaultHeight = unit === "imperial" ? "4" : "10"; // 4 inch or 10 cm
  const defaultDepth = unit === "imperial" ? "4" : "10"; // same as height for simplicity
  const defaultCoverageThickness =
    unit === "imperial"
      ? DEFAULT_FROSTING_THICKNESS_IN.toString()
      : DEFAULT_FROSTING_THICKNESS_CM.toString();

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
              <SelectItem value="imperial">Imperial (inches/cups)</SelectItem>
              <SelectItem value="metric">Metric (cm/grams)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shape Selector */}
      <div className="space-y-1">
        <Label htmlFor="shape" className="text-slate-700 dark:text-slate-300">
          Cake Shape
        </Label>
        <Select
          id="shape"
          value={inputs.shape ?? "round"}
          onValueChange={(v) =>
            setInputs((prev) => ({ ...prev, shape: v as CakeShape }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="square">Square</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Diameter or Side Length */}
      <div className="space-y-1">
        <Label
          htmlFor="diameterOrSide"
          className="text-slate-700 dark:text-slate-300"
        >
          {inputs.shape === "square"
            ? "Side Length"
            : "Diameter"}{" "}
          ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="diameterOrSide"
          type="number"
          min={0}
          step="any"
          placeholder={
            inputs.shape === "square"
              ? defaultDiameterOrSide
              : defaultDiameterOrSide
          }
          value={inputs.diameterOrSide ?? ""}
          onChange={(e) => onInputChange("diameterOrSide", e.target.value)}
        />
      </div>

      {/* Cake Height */}
      <div className="space-y-1">
        <Label
          htmlFor="height"
          className="text-slate-700 dark:text-slate-300"
        >
          Cake Height (including layers) ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="height"
          type="number"
          min={0}
          step="any"
          placeholder={defaultHeight}
          value={inputs.height ?? ""}
          onChange={(e) => onInputChange("height", e.target.value)}
        />
      </div>

      {/* Cake Depth (layer depth) */}
      <div className="space-y-1">
        <Label
          htmlFor="depth"
          className="text-slate-700 dark:text-slate-300"
        >
          Cake Layer Depth ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="depth"
          type="number"
          min={0}
          step="any"
          placeholder={defaultDepth}
          value={inputs.depth ?? ""}
          onChange={(e) => onInputChange("depth", e.target.value)}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Depth of each cake layer (used for volume calculations).
        </p>
      </div>

      {/* Frosting Thickness */}
      <div className="space-y-1">
        <Label
          htmlFor="coverageThickness"
          className="text-slate-700 dark:text-slate-300"
        >
          Frosting Thickness ({unit === "imperial" ? "inches" : "cm"})
        </Label>
        <Input
          id="coverageThickness"
          type="number"
          min={0}
          step="any"
          placeholder={defaultCoverageThickness}
          value={inputs.coverageThickness ?? ""}
          onChange={(e) => onInputChange("coverageThickness", e.target.value)}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Typical frosting thickness is about 0.25 inch (0.6 cm).
        </p>
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
              <strong>Chef's Tip:</strong> Use a digital scale for baking
              precision.
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
          Understanding Icing/Frosting Coverage by Cake Size
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the right amount of icing or frosting for your cake is
          essential to achieve the perfect balance between flavor and texture
          without waste. This calculator helps you estimate the volume and weight
          of frosting needed to cover round or square cakes of various sizes,
          considering both the top surface and the sides. By inputting your cake's
          dimensions and desired frosting thickness, you can plan your baking
          more precisely.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculations are based on geometric formulas for surface area and
          volume, combined with typical frosting density values. This approach
          ensures that you get an accurate estimate whether you prefer measuring
          frosting by volume (cups) or weight (grams). Understanding these
          measurements helps you avoid under- or over-preparing your frosting,
          saving ingredients and time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you're a professional baker or a home cook, this tool supports
          your culinary creativity by providing reliable data. Adjust the inputs
          to match your cake's shape, size, and frosting preferences, and use the
          results to guide your ingredient preparation and baking process.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, follow these steps to input your
          cake and frosting details accurately:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial
            or Metric) for measurements.
          </li>
          <li>
            <strong>Step 2:</strong> Choose your cake shape: round or square.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the diameter (for round) or side length
            (for square) of your cake.
          </li>
          <li>
            <strong>Step 4:</strong> Input the total height of your cake,
            including all layers.
          </li>
          <li>
            <strong>Step 5:</strong> Specify the depth of each cake layer to help
            with volume calculations.
          </li>
          <li>
            <strong>Step 6:</strong> Set the desired frosting thickness for
            coverage, typically around 0.25 inch or 0.6 cm.
          </li>
          <li>
            <strong>Step 7:</strong> Click "Calculate" to see the estimated
            frosting volume and weight needed.
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
              href="https://www.baking911.com/baking-science/frosting/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Baking911: Frosting Science and Techniques
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on frosting types, densities, and coverage
              techniques.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.kingarthurbaking.com/learn/guides/frosting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. King Arthur Baking: Frosting Basics
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanations on frosting ingredients, thickness, and
              application.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nal.usda.gov/legacy/fnic/food-composition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. USDA Food Composition Database
            </a>
            <p className="text-slate-500 text-sm">
              Official source for ingredient densities and nutritional data.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Icing/Frosting Coverage by Cake Size"
      description="Calculate icing and frosting amounts. Determine how much frosting you need to cover round or square cakes of various sizes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: EQUATION ONLY
      formula={{
        title: "Kitchen Math",
        formula:
          "Frosting Volume = (Top Surface Area + Side Surface Area) × Frosting Thickness",
        variables: [
          { symbol: "Top Surface Area", description: "Area of cake top" },
          { symbol: "Side Surface Area", description: "Area of cake sides" },
          { symbol: "Frosting Thickness", description: "Desired frosting layer thickness" },
          { symbol: "Frosting Volume", description: "Volume of frosting needed" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate frosting needed for a round cake 8 inches in diameter, 4 inches tall, with 0.25 inch frosting thickness.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate top area: π × (4 in)² = 50.27 in²",
          },
          {
            label: "2",
            explanation:
              "Calculate side area: circumference × height = 2 × π × 4 in × 4 in = 100.53 in²",
          },
          {
            label: "3",
            explanation:
              "Total surface area = 50.27 + 100.53 = 150.8 in²",
          },
          {
            label: "4",
            explanation:
              "Frosting volume = 150.8 in² × 0.25 in = 37.7 in³ ≈ 0.65 cups",
          },
        ],
        result: "You need approximately 0.65 cups (about 140 grams) of frosting.",
      }}
      relatedCalculators={[
        {
          title: "Teaspoon/Tablespoon/Cup ↔ mL Converter",
          url: "/cooking/teaspoon-tablespoon-cup-ml-converter",
          icon: "🍳",
        },
        {
          title: "Recipe Scaler (x0.5, x2, x3…)",
          url: "/cooking/recipe-scaler",
          icon: "🍞",
        },
        {
          title: "Cups ↔ Grams ↔ Ounces Converter",
          url: "/cooking/cups-grams-ounces-by-ingredient",
          icon: "🥩",
        },
        {
          title: "Whole Chicken/Roast Cook Time Estimator",
          url: "/cooking/whole-chicken-roast-cook-time",
          icon: "🧁",
        },
        {
          title: "Flour Blend Substitution Helper",
          url: "/cooking/flour-blend-substitution",
          icon: "🍰",
        },
        {
          title: "Safe Internal Temperature Checker",
          url: "/cooking/safe-internal-temperature-checker",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Icing/Frosting Coverage by Cake Size" },
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