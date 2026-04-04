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

function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .map((v) => Number(v))
    .filter((v) => !isNaN(v));
}

function varianceAndStdDev(
  data: number[],
  isSample: boolean
): { variance: number; stdDev: number } | null {
  if (data.length === 0) return null;
  const n = data.length;
  if (isSample && n < 2) return null; // sample variance requires at least 2 points

  const mean = data.reduce((a, b) => a + b, 0) / n;
  const sqDiffs = data.map((x) => (x - mean) ** 2);
  const divisor = isSample ? n - 1 : n;
  const variance = sqDiffs.reduce((a, b) => a + b, 0) / divisor;
  const stdDev = Math.sqrt(variance);
  return { variance, stdDev };
}

export default function StandardDeviationVariancePopSampleCalculator() {
  const [inputs, setInputs] = useState({
    data: "",
    dataType: "population", // or "sample"
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const data = parseNumbers(inputs.data || "");
    const isSample = inputs.dataType === "sample";

    if (data.length === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter at least one numeric data point.",
        formulaUsed: "",
      };
    }
    if (isSample && data.length < 2) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Sample variance and standard deviation require at least two data points.",
        formulaUsed: "",
      };
    }

    const calc = varianceAndStdDev(data, isSample);
    if (!calc) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Invalid data input.",
        formulaUsed: "",
      };
    }

    const varianceStr = calc.variance.toFixed(4);
    const stdDevStr = calc.stdDev.toFixed(4);

    return {
      value: (
        <>
          <div>
            <strong>Variance ({isSample ? "Sample" : "Population"}): </strong>
            {varianceStr}
          </div>
          <div className="mt-1">
            <strong>Standard Deviation ({isSample ? "Sample" : "Population"}): </strong>
            {stdDevStr}
          </div>
        </>
      ),
      label: "Measures of data dispersion",
      subtext:
        "Variance is the average of squared deviations from the mean. Standard deviation is the square root of variance.",
      warning: null,
      formulaUsed: isSample
        ? "Sample Variance & Standard Deviation"
        : "Population Variance & Standard Deviation",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between population and sample variance?",
      answer:
        "Population variance measures variability of an entire population, dividing by N (total data points). Sample variance estimates population variance from a sample, dividing by N-1 to correct bias.",
    },
    {
      question: "Why do we use N-1 for sample variance?",
      answer:
        "Using N-1 (Bessel's correction) corrects the bias in the estimation of the population variance from a sample, providing an unbiased estimator.",
    },
    {
      question: "How is standard deviation related to variance?",
      answer:
        "Standard deviation is the square root of variance, providing a measure of spread in the same units as the original data.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="data" className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Sigma className="w-5 h-5 text-blue-600" />
          Enter Data Points
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Input
          id="data"
          placeholder="Enter numbers separated by commas, spaces, or semicolons"
          value={inputs.data}
          onChange={(e) => handleInputChange("data", e.target.value)}
          spellCheck={false}
          aria-describedby="data-desc"
          className="mb-1"
        />
        <p id="data-desc" className="text-sm text-slate-500 dark:text-slate-400">
          Example: 4, 8, 15, 16, 23, 42
        </p>
      </div>

      <div>
        <Label htmlFor="dataType" className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Calculator className="w-5 h-5 text-blue-600" />
          Select Data Type
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Select
          value={inputs.dataType}
          onValueChange={(value) => handleInputChange("dataType", value)}
          id="dataType"
          aria-label="Select data type: population or sample"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select data type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="population">Population</SelectItem>
            <SelectItem value="sample">Sample</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate standard deviation and variance"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ data: "", dataType: "population" })}
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
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white whitespace-pre-line">
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
          Understanding Standard Deviation & Variance (pop/sample)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Variance and standard deviation are fundamental statistical measures
          that quantify the spread or dispersion of a dataset. Variance is the
          average of the squared differences from the mean, providing a measure
          of how data points deviate from the average value. Standard deviation
          is the square root of variance, offering a measure of spread in the
          same units as the original data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These measures can be calculated for an entire population or for a
          sample drawn from a population. Population variance divides by the
          total number of data points (N), while sample variance divides by
          (N-1) to correct bias, known as Bessel's correction. This distinction
          is crucial for accurate statistical inference.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding when to use population versus sample formulas ensures
          precise analysis and interpretation of data variability, which is
          essential in fields ranging from scientific research to quality
          control.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Population Variance (σ²):
σ² = (1/N) * Σ (xᵢ - μ)²

Population Standard Deviation (σ):
σ = √σ²

Sample Variance (s²):
s² = (1/(n-1)) * Σ (xᵢ - x̄)²

Sample Standard Deviation (s):
s = √s²

Where:
- N = size of population
- n = size of sample
- xᵢ = each data point
- μ = population mean
- x̄ = sample mean`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Standard Deviation in Data Analysis and Decision-Making
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Standard deviation quantifies how spread out a set of values is around their mean. A low standard deviation means values cluster tightly; a high one means they are scattered widely. This single number summarizes variability in a way that raw lists cannot. Two investments can have the same average return but dramatically different standard deviations — one consistent and predictable, one volatile and risky. Standard deviation is the primary measure of investment risk in modern portfolio theory.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The choice between population and sample standard deviation matters for statistical validity. Use population standard deviation (divide by N) when you have complete data — all exam scores in a class, all products from a production run. Use sample standard deviation (divide by N-1, Bessel's correction) when your data is a subset of a larger population — survey responses from 500 people representing all voters. The N-1 correction removes bias from the estimate of the true population variance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In manufacturing, the standard deviation of product dimensions determines process capability. A process producing bolts with a 10mm target diameter and standard deviation of 0.1mm is much more consistent than one with 0.5mm standard deviation. The Cp and Cpk indices used in Six Sigma are calculated as (specification range) / (6 x standard deviation). A Cpk above 1.33 indicates the process consistently stays within tolerances.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Normal distribution probabilities are expressed in standard deviations. In a normal distribution, 68.3% of values fall within 1 standard deviation of the mean, 95.4% within 2, and 99.7% within 3. This 68-95-99.7 rule lets you immediately estimate the probability of an observation falling in any range once you know the mean and standard deviation. IQ scores, heights, and measurement errors all approximate normal distributions.
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
      title="Standard Deviation & Variance (pop/sample)"
      description="Calculate Standard Deviation and Variance. Measure data dispersion and variability for population or sample datasets."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `Population Variance (σ²): σ² = (1/N) * Σ (xᵢ - μ)²
Population Standard Deviation (σ): σ = √σ²
Sample Variance (s²): s² = (1/(n-1)) * Σ (xᵢ - x̄)²
Sample Standard Deviation (s): s = √s²`,
        variables: [
          { symbol: "xᵢ", description: "Each data point" },
          { symbol: "μ", description: "Population mean" },
          { symbol: "x̄", description: "Sample mean" },
          { symbol: "N", description: "Population size" },
          { symbol: "n", description: "Sample size" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the sample variance and standard deviation for the data set: 4, 8, 6, 5, 3.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the sample mean: (4 + 8 + 6 + 5 + 3) / 5 = 5.2",
          },
          {
            label: "2",
            explanation:
              "Calculate squared deviations: (4-5.2)²=1.44, (8-5.2)²=7.84, (6-5.2)²=0.64, (5-5.2)²=0.04, (3-5.2)²=4.84",
          },
          {
            label: "3",
            explanation:
              "Sum squared deviations: 1.44 + 7.84 + 0.64 + 0.04 + 4.84 = 14.8",
          },
          {
            label: "4",
            explanation:
              "Divide by n-1 (5-1=4) for sample variance: 14.8 / 4 = 3.7",
          },
          {
            label: "5",
            explanation:
              "Take square root for sample standard deviation: √3.7 ≈ 1.9235",
          },
        ],
        result:
          "Sample Variance = 3.7000, Sample Standard Deviation ≈ 1.9235",
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