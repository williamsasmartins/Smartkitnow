import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LinearInterpolationExtrapolationCalculator() {
  const [inputs, setInputs] = useState({
    x0: "",
    y0: "",
    x1: "",
    y1: "",
    x: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers, decimal, minus sign
    if (/^-?\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const { x0, y0, x1, y1, x } = inputs;

    // Parse inputs to numbers
    const X0 = parseFloat(x0);
    const Y0 = parseFloat(y0);
    const X1 = parseFloat(x1);
    const Y1 = parseFloat(y1);
    const X = parseFloat(x);

    // Validate inputs presence
    if (
      isNaN(X0) ||
      isNaN(Y0) ||
      isNaN(X1) ||
      isNaN(Y1) ||
      isNaN(X)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid numeric values for all fields.",
        formulaUsed: "Linear Interpolation / Extrapolation Formula",
      };
    }

    // Validate distinct x0 and x1
    if (X1 === X0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "x₀ and x₁ must be different values to perform interpolation/extrapolation.",
        formulaUsed: "Linear Interpolation / Extrapolation Formula",
      };
    }

    // Calculate slope (m)
    const m = (Y1 - Y0) / (X1 - X0);
    // Calculate interpolated/extrapolated value
    const Y = Y0 + m * (X - X0);

    // Determine if interpolation or extrapolation
    const isInterpolation = (X >= Math.min(X0, X1) && X <= Math.max(X0, X1));
    const label = isInterpolation ? "Interpolated value" : "Extrapolated value";

    // Format values to 4 decimals
    const valueStr = Y.toFixed(4);

    // Subtext with slope info
    const subtext = `Slope (m) = (${Y1.toFixed(4)} - ${Y0.toFixed(4)}) / (${X1.toFixed(4)} - ${X0.toFixed(4)}) = ${m.toFixed(4)}`;

    return {
      value: valueStr,
      label,
      subtext,
      warning: null,
      formulaUsed: "Linear Interpolation / Extrapolation Formula",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is linear interpolation and when should I use it?",
      answer:
        "Linear interpolation is a method to estimate unknown values that lie between two known data points on a straight line. It assumes the change between points is linear and is useful in engineering, physics, and data analysis when you need to approximate values within a range.",
    },
    {
      question: "How does linear extrapolation differ from interpolation?",
      answer:
        "While interpolation estimates values within the range of known data points, extrapolation predicts values outside that range by extending the line beyond the known points. Extrapolation can be less reliable as it assumes the linear trend continues beyond observed data.",
    },
    {
      question: "What happens if x₀ and x₁ are the same?",
      answer:
        "If x₀ and x₁ are equal, the formula for linear interpolation/extrapolation is undefined because it causes division by zero. The two points must have distinct x-values to calculate the slope and perform the estimation.",
    },
    {
      question: "Can linear interpolation be used for nonlinear data?",
      answer:
        "Linear interpolation assumes a straight-line relationship between points. For nonlinear data, this method may provide rough estimates but can be inaccurate. More advanced techniques like polynomial or spline interpolation are recommended for nonlinear datasets.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="x0" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            x₀ (First known x)
          </Label>
          <Input
            id="x0"
            type="text"
            inputMode="decimal"
            value={inputs.x0}
            onChange={(e) => handleInputChange("x0", e.target.value)}
            placeholder="e.g. 1.0"
          />
        </div>
        <div>
          <Label htmlFor="y0" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            y₀ (First known y)
          </Label>
          <Input
            id="y0"
            type="text"
            inputMode="decimal"
            value={inputs.y0}
            onChange={(e) => handleInputChange("y0", e.target.value)}
            placeholder="e.g. 2.0"
          />
        </div>
        <div>
          <Label htmlFor="x1" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            x₁ (Second known x)
          </Label>
          <Input
            id="x1"
            type="text"
            inputMode="decimal"
            value={inputs.x1}
            onChange={(e) => handleInputChange("x1", e.target.value)}
            placeholder="e.g. 3.0"
          />
        </div>
        <div>
          <Label htmlFor="y1" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            y₁ (Second known y)
          </Label>
          <Input
            id="y1"
            type="text"
            inputMode="decimal"
            value={inputs.y1}
            onChange={(e) => handleInputChange("y1", e.target.value)}
            placeholder="e.g. 6.0"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="x" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            x (Value to estimate y)
          </Label>
          <Input
            id="x"
            type="text"
            inputMode="decimal"
            value={inputs.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            placeholder="e.g. 2.0"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate Linear Interpolation or Extrapolation"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              x0: "",
              y0: "",
              x1: "",
              y1: "",
              x: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
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
          Understanding Linear Interpolation / Extrapolation
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Linear interpolation is a fundamental mathematical technique used to estimate unknown values that lie between two known data points on a straight line. By assuming a linear relationship between these points, it provides a simple yet effective way to approximate intermediate values without complex calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Extrapolation extends this concept by estimating values outside the range of known data points, projecting the linear trend beyond the given interval. While useful, extrapolation carries more uncertainty since it assumes the linear pattern continues unchanged beyond observed data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This method is widely applied in fields such as physics, engineering, finance, and computer graphics, where quick and reliable estimations are essential. Understanding the assumptions and limitations of linear interpolation and extrapolation ensures accurate and meaningful results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure the two known points have distinct x-values to avoid division by zero errors, and remember that linear methods work best when the underlying data behaves approximately linearly between points.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`y = y₀ + \\frac{(y₁ - y₀)}{(x₁ - x₀)} (x - x₀)

where:
  x₀, y₀ = first known point
  x₁, y₁ = second known point
  x = value to estimate y for`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Interpolation and Extrapolation in Data Analysis and Engineering
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Interpolation estimates a value between two known data points. If a temperature sensor reads 20 degrees at 0 minutes and 30 degrees at 10 minutes, linear interpolation estimates the temperature at 6 minutes as 20 + (6/10) x (30-20) = 26 degrees. This is the foundational method used in lookup tables, sensor calibration, and graphics rendering. Bilinear interpolation extends it to 2D; trilinear to 3D — both using the same proportional logic.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Extrapolation extends a trend beyond the observed data range. The same formula works: if two data points define a slope, project forward along that slope. Extrapolation is inherently less reliable than interpolation because trends often change outside the observed range. Climate projections, population growth models, and stock price forecasts all extrapolate from historical data, which is why uncertainty bands grow wider the further from the known data you project.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Engineering lookup tables use linear interpolation constantly. Steam tables in thermodynamics give properties at standard pressures and temperatures; for a non-standard condition, you interpolate. Structural load tables in civil engineering give permissible loads for standard beam sizes and spans; for intermediate spans, interpolate. Aircraft performance charts are interpolated for actual gross weight, altitude, and temperature conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The interpolation formula y = y1 + ((x - x1) / (x2 - x1)) x (y2 - y1) can be rearranged to check if a value is feasible (is the target x between x1 and x2?) and to understand sensitivity (a 1 unit change in x produces (y2-y1)/(x2-x1) units change in y — the slope). This slope insight is useful for sensitivity analysis and for checking whether linear interpolation is reasonable or whether the relationship is too nonlinear for accuracy.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Linear Interpolation / Extrapolation"
      description="Perform Linear Interpolation. Estimate unknown values that fall between two known data points on a line."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `y = y₀ + \\frac{(y₁ - y₀)}{(x₁ - x₀)} (x - x₀)`,
        variables: [
          { symbol: "x₀", description: "First known x-value" },
          { symbol: "y₀", description: "First known y-value" },
          { symbol: "x₁", description: "Second known x-value" },
          { symbol: "y₁", description: "Second known y-value" },
          { symbol: "x", description: "Value to estimate y for" },
          { symbol: "y", description: "Estimated value" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Given two points (1, 2) and (3, 6), estimate the value of y at x = 2 using linear interpolation.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the slope: m = (6 - 2) / (3 - 1) = 4 / 2 = 2",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: y = 2 + 2 * (2 - 1) = 2 + 2 * 1 = 4",
          },
        ],
        result: "The interpolated value at x = 2 is y = 4.0000",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
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