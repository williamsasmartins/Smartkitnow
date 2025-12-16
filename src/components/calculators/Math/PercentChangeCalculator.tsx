import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentChangeCalculator() {
  const [inputs, setInputs] = useState({
    oldValue: "",
    newValue: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const oldVal = parseFloat(inputs.oldValue);
    const newVal = parseFloat(inputs.newValue);

    // Validation
    if (inputs.oldValue === "" || inputs.newValue === "") {
      return {
        value: 0,
        label: "Enter both old and new values to calculate percent change.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(oldVal) || isNaN(newVal)) {
      return {
        value: 0,
        label: "Invalid input detected. Please enter valid numeric values.",
        subtext: "",
        warning: "Inputs must be valid numbers.",
        formulaUsed: null,
      };
    }
    if (oldVal === 0) {
      return {
        value: 0,
        label: "Old value cannot be zero for percent change calculation.",
        subtext: "",
        warning: "Division by zero is undefined.",
        formulaUsed: null,
      };
    }

    // Calculation
    // Percent Change = ((New - Old) / Old) * 100
    const rawChange = ((newVal - oldVal) / oldVal) * 100;

    // Format result to 4 decimal places
    const formattedChange = rawChange.toFixed(4);

    // Label and subtext
    const label =
      rawChange >= 0
        ? "Percent increase from old to new value."
        : "Percent decrease from old to new value.";

    return {
      value: `${formattedChange}%`,
      label,
      subtext: "Percent change calculated using standard formula.",
      warning: null,
      formulaUsed: "Percent Change = ((New Value - Old Value) / Old Value) × 100",
    };
  }, [inputs]);

  // 3. FAQS (ENGLISH - LONG ANSWERS)
  const faqs = [
    {
      question: "What is percent change and why is it important?",
      answer:
        "Percent change measures the relative difference between an old value and a new value, expressed as a percentage. It is crucial in fields like finance, economics, and science to evaluate growth, decline, or variation over time. Understanding percent change helps in making informed decisions based on data trends and performance metrics.",
    },
    {
      question: "How do I interpret positive and negative percent changes?",
      answer:
        "A positive percent change indicates an increase from the old value to the new value, while a negative percent change signifies a decrease. For example, a 10% increase means the new value is 10% higher than the old value. Conversely, a -10% change means the new value is 10% lower. This interpretation aids in assessing gains or losses effectively.",
    },
    {
      question: "Can percent change be calculated if the old value is zero?",
      answer:
        "Calculating percent change when the old value is zero is mathematically undefined because it involves division by zero. In such cases, percent change cannot be computed using the standard formula. Alternative approaches or contextual analysis should be considered to interpret changes from zero baseline values.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="oldValue" className="text-slate-700 dark:text-slate-300">
            Old Value
          </Label>
          <Input
            id="oldValue"
            type="number"
            step="any"
            placeholder="Enter old value"
            value={inputs.oldValue}
            onChange={(e) => handleInputChange("oldValue", e.target.value)}
            aria-describedby="oldValueHelp"
          />
        </div>
        <div>
          <Label htmlFor="newValue" className="text-slate-700 dark:text-slate-300">
            New Value
          </Label>
          <Input
            id="newValue"
            type="number"
            step="any"
            placeholder="Enter new value"
            value={inputs.newValue}
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
            // No additional action needed, calculation is reactive
          }}
          aria-label="Calculate percent change"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ oldValue: "", newValue: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "Enter data..." && (
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
              <strong>Math Tip:</strong> Always double-check your input units and ensure the old value is not zero to avoid undefined calculations.
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
          Understanding Percent Change Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Percent Change Calculator is a fundamental mathematical tool designed to quantify the relative difference between two values over time or between conditions. It expresses how much a quantity has increased or decreased as a percentage of its original value. This is essential in various disciplines such as finance, economics, statistics, and science where understanding growth rates or declines is critical.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting an old value and a new value, this calculator computes the percent change, providing a clear and concise metric to evaluate performance or trends. The result helps users interpret data effectively, whether analyzing stock prices, population growth, or experimental results. Its precision and clarity make it a trusted tool for professionals and students alike.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the calculation of percent change, which measures the relative difference between a new value and an old value, normalized by the old value. This approach provides a standardized way to express changes as percentages, facilitating comparison across different scales and contexts.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          Percent Change = ((New Value - Old Value) / Old Value) × 100
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
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering foundational and advanced topics.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:percent-word-problems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Percent Word Problems
            </a>
            <p className="text-slate-500 text-sm">Detailed lessons and exercises on percent change and related concepts.</p>
          </li>
          <li className="block">
            <a
              href="https://www.mathsisfun.com/percentage.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Math is Fun - Percentage
            </a>
            <p className="text-slate-500 text-sm">Clear explanations and examples about percentages and percent change.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent Change Calculator"
      description="Find the percent change between an old value and a new value. Useful for analyzing financial data, statistics, and performance metrics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: "Percent Change = ((New Value - Old Value) / Old Value) × 100",
        variables: [
          { symbol: "Old Value", description: "The initial or original value before change" },
          { symbol: "New Value", description: "The value after change or at a later time" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          "Suppose the price of a stock was $50 last month and is $60 this month. Calculate the percent change.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the old value (50) and the new value (60).",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: ((60 - 50) / 50) × 100 = (10 / 50) × 100 = 0.2 × 100 = 20%.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result: The stock price increased by 20% from last month.",
          },
        ],
        result: "Percent Change = 20%",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Percent Change Calculator" },
        { id: "formula", label: "Formula & Methodology" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}