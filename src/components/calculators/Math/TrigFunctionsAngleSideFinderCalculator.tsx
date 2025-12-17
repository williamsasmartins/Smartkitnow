import { useState, useMemo, useCallback } from "react";
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
  Sigma,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type InputName =
  | "knownSide"
  | "knownAngle"
  | "find"
  | "functionType"
  | "knownSideType"
  | "knownAngleUnit";

export default function TrigFunctionsAngleSideFinderCalculator() {
  const [inputs, setInputs] = useState<{
    knownSide?: string;
    knownAngle?: string;
    find?: "angle" | "side";
    functionType?: "sin" | "cos" | "tan";
    knownSideType?: "opposite" | "adjacent" | "hypotenuse";
    knownAngleUnit?: "deg" | "rad";
  }>({
    find: "angle",
    functionType: "sin",
    knownSideType: "opposite",
    knownAngleUnit: "deg",
  });

  const handleInputChange = useCallback(
    (name: InputName, value: string | undefined) => {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const results = useMemo(() => {
    // Parse inputs safely
    const knownSide = inputs.knownSide ? parseFloat(inputs.knownSide) : NaN;
    const knownAngle = inputs.knownAngle ? parseFloat(inputs.knownAngle) : NaN;
    const find = inputs.find || "angle";
    const func = inputs.functionType || "sin";
    const knownSideType = inputs.knownSideType || "opposite";
    const angleUnit = inputs.knownAngleUnit || "deg";

    // Validate inputs
    if (find === "angle") {
      // Find angle given side ratio (value between 0 and 1 for sin and cos, any positive for tan)
      if (isNaN(knownSide)) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: "Please enter a valid numeric ratio for the known side.",
          formulaUsed: "",
        };
      }
      if (func === "sin" || func === "cos") {
        if (knownSide < 0 || knownSide > 1) {
          return {
            value: "",
            label: "",
            subtext: "",
            warning:
              "For sine and cosine, the ratio must be between 0 and 1 inclusive.",
            formulaUsed: "",
          };
        }
      } else if (func === "tan") {
        if (knownSide < 0) {
          return {
            value: "",
            label: "",
            subtext: "",
            warning: "Tangent ratio must be non-negative.",
            formulaUsed: "",
          };
        }
      }

      // Calculate angle in radians
      let angleRad: number;
      switch (func) {
        case "sin":
          angleRad = Math.asin(knownSide);
          break;
        case "cos":
          angleRad = Math.acos(knownSide);
          break;
        case "tan":
          angleRad = Math.atan(knownSide);
          break;
        default:
          angleRad = NaN;
      }
      if (isNaN(angleRad)) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: "Invalid input for calculation.",
          formulaUsed: "",
        };
      }
      // Convert to degrees if needed
      const angle =
        angleUnit === "deg" ? (angleRad * 180) / Math.PI : angleRad;

      return {
        value: angle.toFixed(4),
        label:
          angleUnit === "deg"
            ? "Angle (degrees)"
            : "Angle (radians)",
        subtext: `Calculated using inverse ${func} function.`,
        warning: null,
        formulaUsed: `θ = ${func}⁻¹(ratio)`,
      };
    } else if (find === "side") {
      // Find side length given angle and function
      if (isNaN(knownAngle)) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: "Please enter a valid numeric angle.",
          formulaUsed: "",
        };
      }
      // Convert angle to radians if input is degrees
      const angleRad =
        angleUnit === "deg" ? (knownAngle * Math.PI) / 180 : knownAngle;

      // Validate angle range for sin, cos, tan
      if (angleRad < 0 || angleRad > Math.PI / 2) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning:
            "Angle should be between 0 and 90 degrees (0 and π/2 radians) for a right triangle.",
          formulaUsed: "",
        };
      }

      // Calculate ratio
      let ratio: number;
      switch (func) {
        case "sin":
          ratio = Math.sin(angleRad);
          break;
        case "cos":
          ratio = Math.cos(angleRad);
          break;
        case "tan":
          ratio = Math.tan(angleRad);
          break;
        default:
          ratio = NaN;
      }
      if (isNaN(ratio)) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: "Invalid input for calculation.",
          formulaUsed: "",
        };
      }

      // If knownSideType is hypotenuse, side length = hypotenuse * ratio
      // But since hypotenuse length is unknown, we just return ratio (side/hypotenuse or side/side)
      // So we clarify that this is the ratio of the side to hypotenuse or adjacent side depending on function

      // Label side length meaning:
      // sin = opposite/hypotenuse
      // cos = adjacent/hypotenuse
      // tan = opposite/adjacent

      let sideLabel = "";
      switch (func) {
        case "sin":
          sideLabel = "Opposite / Hypotenuse";
          break;
        case "cos":
          sideLabel = "Adjacent / Hypotenuse";
          break;
        case "tan":
          sideLabel = "Opposite / Adjacent";
          break;
      }

      return {
        value: ratio.toFixed(4),
        label: `Ratio (${sideLabel})`,
        subtext: `Calculated using ${func}(θ)`,
        warning: null,
        formulaUsed: `${func}(θ) = ratio`,
      };
    }

    return {
      value: "",
      label: "",
      subtext: "",
      warning: "Invalid calculation mode.",
      formulaUsed: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I find an angle using sine, cosine, or tangent?",
      answer:
        "To find an angle in a right triangle using sine, cosine, or tangent, you need the ratio of two sides. Use the inverse trig function (sin⁻¹, cos⁻¹, tan⁻¹) on the ratio to get the angle in degrees or radians.",
    },
    {
      question: "What units can I use for angles in this calculator?",
      answer:
        "You can input angles in degrees or radians. The calculator allows you to select the unit, and results will be displayed accordingly. Degrees are common for most practical problems, while radians are used in higher mathematics.",
    },
    {
      question: "Can I find the length of a side if I know an angle?",
      answer:
        "Yes, if you know an angle and the function type, you can find the ratio of the side lengths using sine, cosine, or tangent. To find the actual side length, you need the length of at least one side of the triangle.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select what to find */}
      <div>
        <Label htmlFor="find" className="mb-1 font-semibold flex items-center gap-1">
          <FunctionSquare className="w-4 h-4 text-blue-600" />
          Find:
        </Label>
        <Select
          value={inputs.find}
          onValueChange={(v) => handleInputChange("find", v)}
          id="find"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select what to find" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="angle">Angle (θ)</SelectItem>
            <SelectItem value="side">Side Ratio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Select trig function */}
      <div>
        <Label htmlFor="functionType" className="mb-1 font-semibold flex items-center gap-1">
          <Calculator className="w-4 h-4 text-blue-600" />
          Trig Function:
        </Label>
        <Select
          value={inputs.functionType}
          onValueChange={(v) => handleInputChange("functionType", v)}
          id="functionType"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select trig function" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sin">sin</SelectItem>
            <SelectItem value="cos">cos</SelectItem>
            <SelectItem value="tan">tan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input known side or angle depending on find */}
      {inputs.find === "angle" && (
        <div>
          <Label htmlFor="knownSide" className="mb-1 font-semibold flex items-center gap-1">
            <Info className="w-4 h-4 text-blue-600" />
            Known Side Ratio:
          </Label>
          <Input
            id="knownSide"
            type="number"
            step="any"
            min="0"
            max={inputs.functionType === "sin" || inputs.functionType === "cos" ? "1" : undefined}
            placeholder={
              inputs.functionType === "sin" || inputs.functionType === "cos"
                ? "Enter ratio (0 to 1)"
                : "Enter ratio (≥ 0)"
            }
            value={inputs.knownSide || ""}
            onChange={(e) => handleInputChange("knownSide", e.target.value)}
          />
        </div>
      )}

      {inputs.find === "side" && (
        <>
          <div>
            <Label htmlFor="knownAngle" className="mb-1 font-semibold flex items-center gap-1">
              <Info className="w-4 h-4 text-blue-600" />
              Known Angle:
            </Label>
            <Input
              id="knownAngle"
              type="number"
              step="any"
              min="0"
              max="90"
              placeholder="Enter angle"
              value={inputs.knownAngle || ""}
              onChange={(e) => handleInputChange("knownAngle", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="knownAngleUnit" className="mb-1 font-semibold flex items-center gap-1">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              Angle Unit:
            </Label>
            <Select
              value={inputs.knownAngleUnit}
              onValueChange={(v) => handleInputChange("knownAngleUnit", v)}
              id="knownAngleUnit"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deg">Degrees (°)</SelectItem>
                <SelectItem value="rad">Radians (rad)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          type="button"
          aria-label="Calculate"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              find: "angle",
              functionType: "sin",
              knownSideType: "opposite",
              knownAngleUnit: "deg",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
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
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Trig Functions (sin/cos/tan) Angle/Side Finder
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Trigonometric functions—sine (sin), cosine (cos), and tangent (tan)—
          are fundamental in relating the angles and sides of right triangles.
          This calculator helps you find unknown angles or side ratios using
          these functions. When you know a side ratio, you can find the angle by
          applying the inverse trig functions. Conversely, if you know an angle,
          you can determine the ratio of sides corresponding to that angle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The sine of an angle is the ratio of the length of the opposite side
          to the hypotenuse. Cosine is the ratio of the adjacent side to the
          hypotenuse, and tangent is the ratio of the opposite side to the
          adjacent side. These relationships are valid only for right-angled
          triangles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool supports angle inputs in degrees or radians, allowing you to
          work comfortably in either unit system. It also validates inputs to
          ensure meaningful and mathematically valid results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`// To find angle θ:
θ = sin⁻¹(opposite / hypotenuse)
θ = cos⁻¹(adjacent / hypotenuse)
θ = tan⁻¹(opposite / adjacent)

// To find side ratio given angle θ:
sin(θ) = opposite / hypotenuse
cos(θ) = adjacent / hypotenuse
tan(θ) = opposite / adjacent

// Angle conversion:
Degrees = (Radians × 180) / π
Radians = (Degrees × π) / 180`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Trig Functions (sin/cos/tan) Angle/Side Finder"
      description="Calculate Trigonometric functions. Find Sine, Cosine, and Tangent values to determine unknown angles and sides in right triangles."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `θ = sin⁻¹(opposite / hypotenuse) = cos⁻¹(adjacent / hypotenuse) = tan⁻¹(opposite / adjacent)`,
        variables: [
          { symbol: "θ", description: "Angle in degrees or radians" },
          {
            symbol: "opposite",
            description: "Side opposite to the angle θ",
          },
          {
            symbol: "adjacent",
            description: "Side adjacent to the angle θ",
          },
          { symbol: "hypotenuse", description: "Longest side of the triangle" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Find the angle θ if the sine of θ is 0.5, with angle in degrees.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the known ratio: sin(θ) = 0.5.",
          },
          {
            label: "2",
            explanation:
              "Calculate θ = sin⁻¹(0.5) = 30°.",
          },
          {
            label: "3",
            explanation:
              "Result: The angle θ is 30 degrees.",
          },
        ],
        result: "θ = 30.0000°",
      }}
      relatedCalculators={[
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        {
          title: "Percent of Total",
          url: "/math/percent-of-total",
          icon: "➗",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}