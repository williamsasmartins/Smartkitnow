import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentOfTotalCalculator() {
  const [inputs, setInputs] = useState({
    value: "",
    total: "",
  });

  const handleInputChange = useCallback((name: "value" | "total", value: string) => {
    // Allow only numbers and dot
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const val = parseFloat(inputs.value);
    const tot = parseFloat(inputs.total);

    // Validation
    if (inputs.value === "" || inputs.total === "") {
      return {
        value: "Enter data...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(val) || isNaN(tot)) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Please enter valid numeric values.",
        formulaUsed: null,
      };
    }
    if (tot === 0) {
      return {
        value: "Undefined",
        label: "",
        subtext: "",
        warning: "Total cannot be zero.",
        formulaUsed: null,
      };
    }
    if (val < 0 || tot < 0) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Inputs must be non-negative.",
        formulaUsed: null,
      };
    }

    // Calculation
    // Percent of total = (value / total) * 100
    const percent = (val / tot) * 100;

    // Format result to 4 decimals
    const formattedPercent = percent.toFixed(4);

    return {
      value: `${formattedPercent}%`,
      label: `Percentage of ${inputs.value} out of ${inputs.total}`,
      subtext: "Result expressed as a percentage (%)",
      warning: null,
      formulaUsed: "Percent of Total = (Value ÷ Total) × 100",
    };
  }, [inputs]);

  // 3. FAQS (ENGLISH - LONG ANSWERS)
  const faqs = [
    {
      question: "How do I interpret the percent of total result?",
      answer:
        "The percent of total result indicates what fraction or portion a specific value represents relative to the whole total. For example, if the result is 25%, it means the value is one quarter of the total. This helps in understanding proportions and comparing parts to the whole in various contexts such as finance, statistics, and everyday calculations.",
    },
    {
      question: "What should I do if the total value is zero or negative?",
      answer:
        "If the total value is zero, the percentage calculation is undefined because division by zero is mathematically invalid. Negative totals are also not meaningful in this context since percentages represent parts of a whole, which is inherently non-negative. Always ensure your total is a positive number to get accurate and meaningful results.",
    },
    {
      question: "Can this calculator handle decimal and large numbers?",
      answer:
        "Yes, this calculator supports decimal inputs and large numbers with precision up to four decimal places. It uses JavaScript's floating-point arithmetic and formats the output accordingly. However, extremely large numbers may be subject to floating-point precision limits inherent in computing environments.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="value" className="text-slate-700 dark:text-slate-300">
            Value (Part)
          </Label>
          <Input
            id="value"
            type="text"
            inputMode="decimal"
            placeholder="Enter the part value"
            value={inputs.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            aria-describedby="value-desc"
          />
          <p id="value-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The specific part or portion of the total.
          </p>
        </div>

        <div>
          <Label htmlFor="total" className="text-slate-700 dark:text-slate-300">
            Total (Whole)
          </Label>
          <Input
            id="total"
            type="text"
            inputMode="decimal"
            placeholder="Enter the total value"
            value={inputs.total}
            onChange={(e) => handleInputChange("total", e.target.value)}
            aria-describedby="total-desc"
          />
          <p id="total-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            The whole or total amount that the value is part of.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate percent of total"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ value: "", total: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Enter data..." && results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          {/* BLUE GRADIENT CARD */}
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
              <strong>Math Tip:</strong> Always double-check your input units (e.g., ensure both values are in the same unit system) to ensure accuracy.
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
          Understanding Percent of Total Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Percent of Total Calculator is a fundamental mathematical tool used to determine what portion a specific value represents relative to a whole. This concept is widely applied in various fields such as finance, statistics, and everyday problem-solving to understand proportions and ratios. By inputting a part and the total, users can quickly obtain the percentage that the part constitutes of the total.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator simplifies the process of converting fractions or ratios into percentages, which are easier to interpret and compare. It is especially useful when analyzing data distributions, budgeting, or evaluating performance metrics. Understanding the percent of total helps in making informed decisions based on relative sizes and contributions within a dataset or scenario.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the calculation of the percentage that a part value represents of a total value. This is achieved by dividing the part by the total and then multiplying by 100 to convert the ratio into a percentage. This formula is straightforward yet powerful for analyzing proportions.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          Percent of Total = (Value ÷ Total) × 100
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
              href="https://math.libretexts.org/Bookshelves/Precalculus/Book%3A_Preload_Calculus_(Stitz-Zeager)/03%3A_Functions/3.06%3A_Percent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts: Percent and Percentage
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive open-access mathematics resource explaining the concept of percentages, their calculation, and applications.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/arithmetic/arith-review-percent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy: Percentages
            </a>
            <p className="text-slate-500 text-sm">
              Educational platform providing detailed lessons and exercises on percentages, including percent of total calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.mathsisfun.com/percentage.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Math is Fun: Percentage
            </a>
            <p className="text-slate-500 text-sm">
              User-friendly explanations and examples covering percentage calculations and their real-world uses.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent of Total Calculator"
      description="Calculate the percentage of a total value. Quickly determine what part of the whole a specific number represents."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: "Percent of Total = (Value ÷ Total) × 100",
        variables: [
          { symbol: "Value", description: "The part or portion of the total" },
          { symbol: "Total", description: "The whole or total amount" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          "Suppose you scored 45 points out of a total of 60 points on a test. What percentage of the total points did you earn?",
        steps: [
          {
            label: "1",
            explanation: "Identify the part (Value = 45) and the total (Total = 60).",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: (45 ÷ 60) × 100 = 0.75 × 100 = 75%.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result: You earned 75% of the total points on the test.",
          },
        ],
        result: "75%",
      }}
      relatedCalculators={[
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Percent of Total Calculator" },
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