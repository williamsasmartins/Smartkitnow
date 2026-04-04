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

function erf(x: number): number {
  // Approximate the error function erf(x) using numerical approximation (Abramowitz and Stegun formula 7.1.26)
  // Maximum error ~1.5×10−7
  const sign = x >= 0 ? 1 : -1;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const absX = Math.abs(x);
  const t = 1 / (1 + p * absX);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);
  return sign * y;
}

function normalCDF(x: number, mu: number, sigma: number): number {
  // CDF = 0.5 * [1 + erf((x - mu) / (sigma * sqrt(2)))]
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

function normalPDF(x: number, mu: number, sigma: number): number {
  // PDF = (1 / (sigma * sqrt(2π))) * exp(-0.5 * ((x - mu)/sigma)^2)
  const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
  return coeff * Math.exp(exponent);
}

export default function NormalCdfPdfEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    x: "",
    mu: "",
    sigma: "",
    calcType: "cdf",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const xNum = parseFloat(inputs.x);
    const muNum = parseFloat(inputs.mu);
    const sigmaNum = parseFloat(inputs.sigma);
    const calcType = inputs.calcType;

    if (
      isNaN(xNum) ||
      isNaN(muNum) ||
      isNaN(sigmaNum) ||
      sigmaNum <= 0 ||
      (calcType !== "cdf" && calcType !== "pdf")
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          sigmaNum <= 0
            ? "Standard deviation (σ) must be greater than zero."
            : "Please enter valid numeric inputs for all fields.",
        formulaUsed: "",
      };
    }

    let value = 0;
    let label = "";
    let subtext = "";
    let formulaUsed = "";

    if (calcType === "cdf") {
      value = normalCDF(xNum, muNum, sigmaNum);
      label = `P(X ≤ ${xNum.toFixed(4)})`;
      subtext = `Cumulative Distribution Function value for Normal(μ=${muNum.toFixed(
        4
      )}, σ=${sigmaNum.toFixed(4)})`;
      formulaUsed =
        "Φ(x) = 0.5 × [1 + erf((x - μ) / (σ × √2))] (Normal CDF)";
    } else {
      value = normalPDF(xNum, muNum, sigmaNum);
      label = `f(${xNum.toFixed(4)})`;
      subtext = `Probability Density Function value for Normal(μ=${muNum.toFixed(
        4
      )}, σ=${sigmaNum.toFixed(4)})`;
      formulaUsed =
        "f(x) = (1 / (σ × √(2π))) × exp(-0.5 × ((x - μ)/σ)²) (Normal PDF)";
    }

    return {
      value: value.toFixed(4),
      label,
      subtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between Normal CDF and PDF?",
      answer:
        "The Normal Probability Density Function (PDF) gives the relative likelihood of a random variable to take on a specific value, represented as the height of the curve at that point. The Cumulative Distribution Function (CDF) gives the probability that the variable is less than or equal to a certain value, representing the area under the curve up to that point.",
    },
    {
      question: "Why must the standard deviation (σ) be greater than zero?",
      answer:
        "The standard deviation (σ) measures the spread of the distribution. A value of zero or less is invalid because it would imply no variability or an undefined distribution. For the Normal distribution formulas to work correctly, σ must be a positive number.",
    },
    {
      question: "How is the error function (erf) related to the Normal CDF?",
      answer:
        "The error function (erf) is a mathematical function used to compute the Normal CDF. Specifically, the Normal CDF can be expressed in terms of erf as Φ(x) = 0.5 × [1 + erf((x - μ) / (σ × √2))]. This relationship allows efficient numerical approximation of the CDF.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="x" className="flex items-center gap-1 mb-1 font-semibold">
            <FunctionSquare className="w-4 h-4 text-blue-600" /> Value (x)
          </Label>
          <Input
            id="x"
            type="number"
            step="any"
            value={inputs.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            placeholder="Enter x"
          />
        </div>
        <div>
          <Label htmlFor="mu" className="flex items-center gap-1 mb-1 font-semibold">
            <Calculator className="w-4 h-4 text-blue-600" /> Mean (μ)
          </Label>
          <Input
            id="mu"
            type="number"
            step="any"
            value={inputs.mu}
            onChange={(e) => handleInputChange("mu", e.target.value)}
            placeholder="Enter mean μ"
          />
        </div>
        <div>
          <Label
            htmlFor="sigma"
            className="flex items-center gap-1 mb-1 font-semibold"
          >
            <Sigma className="w-4 h-4 text-blue-600" /> Standard Deviation (σ)
          </Label>
          <Input
            id="sigma"
            type="number"
            step="any"
            min="0"
            value={inputs.sigma}
            onChange={(e) => handleInputChange("sigma", e.target.value)}
            placeholder="Enter σ &gt; 0"
          />
        </div>
        <div>
          <Label
            htmlFor="calcType"
            className="flex items-center gap-1 mb-1 font-semibold"
          >
            <Info className="w-4 h-4 text-blue-600" /> Calculation Type
          </Label>
          <Select
            value={inputs.calcType}
            onValueChange={(value) => handleInputChange("calcType", value)}
          >
            <SelectTrigger id="calcType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cdf">Cumulative Distribution Function (CDF)</SelectItem>
              <SelectItem value="pdf">Probability Density Function (PDF)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive.
          }}
          aria-label="Calculate Normal CDF or PDF"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ x: "", mu: "", sigma: "", calcType: "cdf" })
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
          Understanding Normal CDF / PDF Quick Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Normal distribution, also known as the Gaussian distribution, is a
          fundamental concept in probability and statistics. It describes how
          values of a continuous random variable are distributed symmetrically
          around a mean (μ), with variability measured by the standard deviation
          (σ). This estimator allows you to quickly compute two important
          functions related to the Normal distribution: the Cumulative
          Distribution Function (CDF) and the Probability Density Function (PDF).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The CDF gives the probability that a random variable is less than or
          equal to a specific value, effectively representing the area under the
          curve to the left of that value. The PDF, on the other hand, provides
          the relative likelihood of the variable taking on a particular value,
          represented by the height of the curve at that point.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool is designed for professionals, students, and enthusiasts who
          need precise and quick calculations without delving into complex
          integrations. By inputting your value, mean, and standard deviation,
          you can instantly obtain accurate Normal distribution probabilities with
          four-decimal precision.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Normal PDF:
f(x) = (1 / (σ × √(2π))) × exp(-0.5 × ((x - μ)/σ)²)

Normal CDF:
Φ(x) = 0.5 × [1 + erf((x - μ) / (σ × √2))]

where:
- μ is the mean
- σ is the standard deviation (σ &gt; 0)
- erf is the error function`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Normal Distribution in Science, Finance, and Quality Control
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The normal distribution (bell curve) is central to statistics because the Central Limit Theorem guarantees that the means of sufficiently large samples from any distribution converge to a normal distribution. This means you can use normal distribution tools for analyzing sample means even when the underlying data is not normally distributed — heights, income distributions, and stock returns all violate normality, but their sample means do not.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The PDF (probability density function) tells you the relative likelihood of a specific value, while the CDF (cumulative distribution function) gives the probability of observing a value at or below a threshold. For the standard normal: PDF peaks at x=0 with value 0.399. CDF(0) = 0.5 (50% of values below the mean). CDF(1.96) = 0.975 (97.5% below, meaning only 2.5% above — the basis of the 95% confidence interval which uses +/-1.96 sigma).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Manufacturing process control uses normal distribution to establish control limits. A control chart plots sample means over time, with upper and lower control limits set at mean +/- 3 standard deviations. Under normal operation, 99.73% of sample means should fall within these limits. A point outside the limits signals a process shift with only 0.27% false positive rate. This is the statistical basis of Shewhart control charts used in Six Sigma.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Value at Risk (VaR) in finance uses the normal distribution to estimate maximum expected loss. If a portfolio has daily returns with mean 0.05% and standard deviation 1.2%, the 1% VaR (worst expected day 1 in 100) is mean + z(0.01) x SD = 0.05% + (-2.326 x 1.2%) = -2.74%. This means there is a 1% chance of losing more than 2.74% in a single day. Banks are required by regulation to hold capital against their VaR.
        </p>
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
      title="Normal CDF / PDF Quick Estimator"
      description="Estimate Normal Distribution values. Calculate Cumulative Distribution Function (CDF) and Probability Density Function (PDF) probabilities."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `Normal PDF:
f(x) = (1 / (σ × √(2π))) × exp(-0.5 × ((x - μ)/σ)²)

Normal CDF:
Φ(x) = 0.5 × [1 + erf((x - μ) / (σ × √2))]`,
        variables: [
          { symbol: "x", description: "Value at which to evaluate" },
          { symbol: "μ", description: "Mean of the distribution" },
          { symbol: "σ", description: "Standard deviation (σ &gt; 0)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the probability that a normally distributed variable with mean 0 and standard deviation 1 is less than or equal to 1.5.",
        steps: [
          {
            label: "1",
            explanation:
              "Input x = 1.5, μ = 0, σ = 1, and select CDF calculation.",
          },
          {
            label: "2",
            explanation:
              "The estimator calculates Φ(1.5) ≈ 0.9332, meaning there is a 93.32% chance the variable is ≤ 1.5.",
          },
        ],
        result: "Probability P(X ≤ 1.5) ≈ 0.9332",
      }}
      relatedCalculators={[
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
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
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