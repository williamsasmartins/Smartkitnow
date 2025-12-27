import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sigma,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function standardNormalCDF(z: number): number {
  // Abramowitz and Stegun approximation for the standard normal CDF
  // Accurate to about 7 decimals
  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * absZ);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429;
  const erf =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
      Math.exp(-absZ * absZ);
  return 0.5 * (1 + sign * erf);
}

export default function ZScorePercentileFinderCalculator() {
  const [inputs, setInputs] = useState({
    x: "",
    mean: "",
    stdDev: "",
    find: "zscore", // or "percentile"
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { x, mean, stdDev, find } = inputs;

    // Parse inputs to floats
    const xNum = parseFloat(x);
    const meanNum = parseFloat(mean);
    const stdDevNum = parseFloat(stdDev);

    // Validation
    if (
      isNaN(xNum) ||
      isNaN(meanNum) ||
      isNaN(stdDevNum) ||
      stdDevNum <= 0 ||
      (find !== "zscore" && find !== "percentile")
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          stdDevNum <= 0
            ? "Standard deviation must be a positive number."
            : "Please enter valid numeric inputs for all fields.",
        formulaUsed: "",
      };
    }

    if (find === "zscore") {
      // Calculate Z-Score: z = (x - mean) / stdDev
      const z = (xNum - meanNum) / stdDevNum;
      // Percentile = CDF(z) * 100
      const percentile = standardNormalCDF(z) * 100;

      return {
        value: z.toFixed(4),
        label: "Z-Score",
        subtext: `Percentile: ${percentile.toFixed(4)}%`,
        warning: null,
        formulaUsed: "Z = (x - μ) / σ",
      };
    } else {
      // find === "percentile"
      // x is percentile input (0-100)
      if (xNum < 0 || xNum > 100) {
        return {
          value: 0,
          label: "",
          subtext: "",
          warning: "Percentile must be between 0 and 100.",
          formulaUsed: "",
        };
      }
      // Convert percentile to probability
      const p = xNum / 100;

      // Approximate inverse CDF (probit) using Beasley-Springer/Moro approximation
      // Source: https://stackoverflow.com/questions/8816728/standard-normal-distribution-inverse-in-javascript
      function inverseStandardNormalCDF(p: number): number {
        if (p <= 0 || p >= 1) {
          return NaN;
        }
        const a = [
          -3.969683028665376e+01,
          2.209460984245205e+02,
          -2.759285104469687e+02,
          1.383577518672690e+02,
          -3.066479806614716e+01,
          2.506628277459239e+00,
        ];
        const b = [
          -5.447609879822406e+01,
          1.615858368580409e+02,
          -1.556989798598866e+02,
          6.680131188771972e+01,
          -1.328068155288572e+01,
        ];
        const c = [
          -7.784894002430293e-03,
          -3.223964580411365e-01,
          -2.400758277161838e+00,
          -2.549732539343734e+00,
          4.374664141464968e+00,
          2.938163982698783e+00,
        ];
        const d = [
          7.784695709041462e-03,
          3.224671290700398e-01,
          2.445134137142996e+00,
          3.754408661907416e+00,
        ];

        // Define break-points.
        const plow = 0.02425;
        const phigh = 1 - plow;

        let q, r;
        if (p < plow) {
          // Rational approximation for lower region
          q = Math.sqrt(-2 * Math.log(p));
          return (
            (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
          ) * -1;
        }
        if (phigh < p) {
          // Rational approximation for upper region
          q = Math.sqrt(-2 * Math.log(1 - p));
          return (
            (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
          );
        }
        // Rational approximation for central region
        q = p - 0.5;
        const rValue = q * q;
        return (
          (((((a[0] * rValue + a[1]) * rValue + a[2]) * rValue + a[3]) * rValue + a[4]) * rValue + a[5]) * q) /
          (((((b[0] * rValue + b[1]) * rValue + b[2]) * rValue + b[3]) * rValue + b[4]) * rValue + 1);
      }

      const z = inverseStandardNormalCDF(p);
      if (isNaN(z)) {
        return {
          value: 0,
          label: "",
          subtext: "",
          warning: "Invalid percentile input.",
          formulaUsed: "",
        };
      }
      // Calculate x = mean + z * stdDev
      const xVal = meanNum + z * stdDevNum;

      return {
        value: xVal.toFixed(4),
        label: "Value (x) at Percentile",
        subtext: `Z-Score: ${z.toFixed(4)}`,
        warning: null,
        formulaUsed: "x = μ + zσ",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is a Z-Score and why is it important?",
      answer:
        "A Z-Score represents how many standard deviations a data point is from the mean of a distribution. It standardizes values, allowing comparison across different datasets or distributions. Z-Scores help identify outliers and understand the relative position of data points within a normal distribution.",
    },
    {
      question: "How is the percentile related to the Z-Score?",
      answer:
        "The percentile indicates the percentage of data points below a given value in a distribution. It is derived from the cumulative distribution function (CDF) of the Z-Score. Essentially, the percentile tells you the probability that a random variable is less than or equal to a specific value.",
    },
    {
      question: "Can I find the original value from a given percentile?",
      answer:
        "Yes. By using the inverse of the standard normal distribution (probit function), you can find the Z-Score corresponding to a percentile. Then, using the mean and standard deviation, you calculate the original value with the formula x = μ + zσ.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="find" className="mb-1 font-semibold flex items-center gap-1">
            <Calculator className="w-4 h-4" /> Find
          </Label>
          <select
            id="find"
            value={inputs.find}
            onChange={(e) => handleInputChange("find", e.target.value)}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            <option value="zscore">Z-Score (given x)</option>
            <option value="percentile">Value (given Percentile)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="x" className="mb-1 font-semibold flex items-center gap-1">
            <Sigma className="w-4 h-4" /> {inputs.find === "zscore" ? "Value (x)" : "Percentile (%)"}
          </Label>
          <Input
            id="x"
            type="number"
            step="any"
            value={inputs.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            placeholder={inputs.find === "zscore" ? "e.g. 75" : "0 to 100"}
          />
        </div>

        <div>
          <Label htmlFor="mean" className="mb-1 font-semibold flex items-center gap-1">
            <FunctionSquare className="w-4 h-4" /> Mean (μ)
          </Label>
          <Input
            id="mean"
            type="number"
            step="any"
            value={inputs.mean}
            onChange={(e) => handleInputChange("mean", e.target.value)}
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <Label htmlFor="stdDev" className="mb-1 font-semibold flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> Standard Deviation (σ)
          </Label>
          <Input
            id="stdDev"
            type="number"
            step="any"
            min="0"
            value={inputs.stdDev}
            onChange={(e) => handleInputChange("stdDev", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          type="button"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              x: "",
              mean: "",
              stdDev: "",
              find: "zscore",
            })
          }
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
          Understanding Z-Score &amp; Percentile Finder
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Z-Score &amp; Percentile Finder is a powerful statistical tool used to standardize data points and understand their relative position within a normal distribution. The Z-Score measures how many standard deviations a value is from the mean, allowing for comparison across different datasets. Percentiles indicate the percentage of data points below a certain value, providing insight into the distribution of data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator enables users to either find the Z-Score for a given value or determine the value corresponding to a specific percentile. It is essential in fields such as psychology, finance, and quality control where understanding data distribution is critical. By inputting the mean and standard deviation, users can accurately interpret their data's position and significance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this tool helps in identifying outliers, making predictions, and conducting hypothesis testing. It bridges raw data with probabilistic interpretations, making complex statistical concepts accessible and actionable.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Z-Score (z):
z = (x - μ) / σ

Percentile (P):
P = Φ(z) × 100%

Value at Percentile:
x = μ + zσ

Where:
- x = data value
- μ = mean
- σ = standard deviation
- Φ(z) = cumulative distribution function (CDF) of the standard normal distribution`}
        </pre>
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
      title="Z-Score &amp; Percentile Finder"
      description="Find Z-Scores and Percentiles. Standardize data points to understand their position relative to the mean in a normal distribution."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `z = (x - μ) / σ\nP = Φ(z) × 100%\nx = μ + zσ`,
        variables: [
          { symbol: "x", description: "Data value" },
          { symbol: "μ", description: "Mean of the distribution" },
          { symbol: "σ", description: "Standard deviation of the distribution" },
          { symbol: "z", description: "Z-Score" },
          { symbol: "P", description: "Percentile" },
          { symbol: "Φ(z)", description: "Standard normal cumulative distribution function" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose a student scored 85 on a test where the mean score was 70 and the standard deviation was 10. Find the student's Z-Score and percentile.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the Z-Score using z = (x - μ) / σ = (85 - 70) / 10 = 1.5.",
          },
          {
            label: "2",
            explanation:
              "Find the percentile by calculating the CDF of z = 1.5, which is approximately 0.9332 or 93.32%.",
          },
          {
            label: "3",
            explanation:
              "Interpretation: The student scored better than approximately 93.32% of the test takers.",
          },
        ],
        result: "Z-Score: 1.5000, Percentile: 93.3200%",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
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