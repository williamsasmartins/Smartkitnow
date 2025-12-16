import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentIncreaseDecreaseCalculator() {
  // Inputs: originalValue and newValue as strings to allow empty input
  const [inputs, setInputs] = useState<{ originalValue?: string; newValue?: string }>({});

  const handleInputChange = useCallback((name: "originalValue" | "newValue", value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const original = parseFloat(inputs.originalValue ?? "");
    const updated = parseFloat(inputs.newValue ?? "");

    // Validation
    if (inputs.originalValue === undefined || inputs.newValue === undefined) {
      return {
        value: 0,
        label: "Enter both values to calculate.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(original) || isNaN(updated)) {
      return {
        value: 0,
        label: "Invalid input: Please enter valid numbers.",
        subtext: "",
        warning: "Inputs must be numeric values.",
        formulaUsed: null,
      };
    }
    if (original === 0) {
      return {
        value: 0,
        label: "Original value cannot be zero.",
        subtext: "",
        warning: "Division by zero is undefined.",
        formulaUsed: null,
      };
    }

    // Percent change calculation
    // percentChange = ((new - original) / original) * 100
    const rawPercentChange = ((updated - original) / original) * 100;

    // Format result with 4 decimals
    const formattedPercent = rawPercentChange.toFixed(4);

    // Label and subtext
    const label =
      rawPercentChange > 0
        ? "Percent Increase"
        : rawPercentChange < 0
        ? "Percent Decrease"
        : "No Change";

    const subtext = "Percentage change from original to new value.";

    const formulaUsed = "Percent Change = ((New − Original) / Original) × 100";

    return {
      value: `${formattedPercent} %`,
      label,
      subtext,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  // FAQs with 50-80 words each
  const faqs = [
    {
      question: "How do I interpret a negative percent change?",
      answer:
        "A negative percent change indicates a decrease from the original value to the new value. For example, if the percent change is -15%, it means the new value is 15% less than the original. This is useful in contexts like discounts, depreciation, or loss measurements. Always consider the sign to understand the direction of change.",
    },
    {
      question: "Why can't the original value be zero in this calculation?",
      answer:
        "The original value cannot be zero because the percent change formula involves division by the original value. Dividing by zero is undefined in mathematics, which makes the calculation invalid. If the original value is zero, percent change cannot be computed reliably, and alternative methods should be considered.",
    },
    {
      question: "Can this calculator handle complex or imaginary results?",
      answer:
        "This calculator is designed for real number inputs and outputs. Percent increase or decrease calculations do not produce complex or imaginary numbers since they are based on linear differences and ratios. If inputs are non-numeric or invalid, the calculator will prompt for correct values instead.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="originalValue" className="text-slate-700 dark:text-slate-300 font-semibold">
            Original Value
          </Label>
          <Input
            id="originalValue"
            type="number"
            step="any"
            placeholder="Enter original value"
            value={inputs.originalValue ?? ""}
            onChange={(e) => handleInputChange("originalValue", e.target.value)}
            aria-describedby="originalValueHelp"
          />
        </div>
        <div>
          <Label htmlFor="newValue" className="text-slate-700 dark:text-slate-300 font-semibold">
            New Value
          </Label>
          <Input
            id="newValue"
            type="number"
            step="any"
            placeholder="Enter new value"
            value={inputs.newValue ?? ""}
            onChange={(e) => handleInputChange("newValue", e.target.value)}
            aria-describedby="newValueHelp"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          aria-label="Calculate percent increase or decrease"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "Enter data..." && results.formulaUsed && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <FunctionSquare className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Math Tip:</strong> Always double-check your input units (e.g., currency, quantity) to ensure the percentage change is meaningful and accurate.
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
          Understanding Percent Increase/Decrease Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Percent Increase/Decrease Calculator is a fundamental mathematical tool used to quantify the relative change between two values. It expresses how much a quantity has grown or shrunk in percentage terms, providing a clear and standardized way to compare changes across different contexts. This is essential in fields such as finance, economics, science, and everyday decision-making.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting an original value and a new value, the calculator computes the percent change, indicating whether the change is an increase or decrease. This helps users understand trends, evaluate performance, and make informed decisions based on quantitative data. The tool is designed to be intuitive and precise, ensuring reliable results for both academic and professional use.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the calculation of relative change expressed as a percentage. This involves subtracting the original value from the new value to find the absolute change, then dividing by the original value to normalize this change relative to the starting point. Multiplying by 100 converts this ratio into a percentage, which is easier to interpret and compare.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Percent Change = ((New − Original) / Original) × 100`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Academic References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://math.libretexts.org/Bookshelves/Precalculus/Book%3A_Precalculus_(OpenStax)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering percent change and related topics.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/arithmetic/arith-review-percent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Percent Change
            </a>
            <p className="text-slate-500 text-sm">Detailed lessons and exercises on calculating percent increase and decrease.</p>
          </li>
          <li className="block">
            <a
              href="https://www.mathsisfun.com/percentage.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Math is Fun - Percentages
            </a>
            <p className="text-slate-500 text-sm">Clear explanations and examples of percentage calculations including percent change.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent Increase/Decrease Calculator"
      description="Calculate the percentage increase or decrease between two numbers. Essential for tracking growth, discounts, or price changes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "Percent Change = ((New − Original) / Original) × 100",
        variables: [
          { symbol: "Original", description: "The initial or starting value" },
          { symbol: "New", description: "The final or updated value" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          "Suppose the price of a product increased from $50 to $65. Calculate the percent increase.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the difference: 65 − 50 = 15.",
          },
          {
            label: "2",
            explanation:
              "Divide the difference by the original value: 15 / 50 = 0.3.",
          },
          {
            label: "3",
            explanation:
              "Multiply by 100 to get the percentage: 0.3 × 100 = 30%.",
          },
        ],
        result: "The price increased by 30%.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Percent Increase/Decrease Calculator" },
        { id: "formula", label: "Formula & Methodology" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Academic References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}