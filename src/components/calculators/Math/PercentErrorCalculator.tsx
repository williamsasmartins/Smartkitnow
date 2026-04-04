import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PercentErrorCalculator() {
  // Inputs: observedValue, theoreticalValue
  const [inputs, setInputs] = useState({
    observedValue: "",
    theoreticalValue: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const obs = parseFloat(inputs.observedValue);
    const theo = parseFloat(inputs.theoreticalValue);

    // Validation
    if (inputs.observedValue.trim() === "" || inputs.theoreticalValue.trim() === "") {
      return {
        value: 0,
        label: "Enter both observed and theoretical values.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(obs) || isNaN(theo)) {
      return {
        value: 0,
        label: "Invalid input: Please enter valid numeric values.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (theo === 0) {
      return {
        value: 0,
        label: "Theoretical value cannot be zero (division by zero).",
        subtext: "",
        warning: "Division by zero error.",
        formulaUsed: "Percent Error = |Observed - Theoretical| / |Theoretical| × 100%",
      };
    }

    // Calculation
    // Percent Error = |Observed - Theoretical| / |Theoretical| × 100%
    const numerator = Math.abs(obs - theo);
    const denominator = Math.abs(theo);
    const percentError = (numerator / denominator) * 100;

    // Formatting
    const formattedValue = percentError.toFixed(4) + "%";

    return {
      value: formattedValue,
      label: "Percent Error",
      subtext: `Calculated from Observed = ${obs.toFixed(4)} and Theoretical = ${theo.toFixed(4)}`,
      warning: null,
      formulaUsed: "Percent Error = |Observed - Theoretical| / |Theoretical| × 100%",
    };
  }, [inputs]);

  // 3. FAQS (ENGLISH - LONG ANSWERS)
  const faqs = [
    {
      question: "What is percent error and why is it important?",
      answer:
        "Percent error quantifies the accuracy of an experimental measurement by comparing the observed value to the true theoretical value. It expresses the difference as a percentage, allowing scientists and engineers to evaluate the reliability of their results. Understanding percent error helps identify systematic errors and improve experimental methods.",
    },
    {
      question: "How do I interpret a high percent error value?",
      answer:
        "A high percent error indicates a large discrepancy between the observed and theoretical values, suggesting potential issues with the measurement process or experimental setup. It may imply systematic errors, instrument calibration problems, or incorrect assumptions. Careful review and refinement of procedures are necessary to reduce this error.",
    },
    {
      question: "Can percent error be negative or complex?",
      answer:
        "Percent error is always expressed as a positive value because it uses the absolute difference between observed and theoretical values. Negative or complex results do not occur in percent error calculations. If you encounter unexpected values, verify your inputs and ensure correct formula application.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="observedValue" className="text-slate-700 dark:text-slate-300 font-semibold">
            Observed Value
          </Label>
          <Input
            id="observedValue"
            type="number"
            step="any"
            placeholder="Enter observed value"
            value={inputs.observedValue}
            onChange={(e) => handleInputChange("observedValue", e.target.value)}
            aria-describedby="observedValueHelp"
          />
        </div>
        <div>
          <Label htmlFor="theoreticalValue" className="text-slate-700 dark:text-slate-300 font-semibold">
            Theoretical Value
          </Label>
          <Input
            id="theoreticalValue"
            type="number"
            step="any"
            placeholder="Enter theoretical value"
            value={inputs.theoreticalValue}
            onChange={(e) => handleInputChange("theoreticalValue", e.target.value)}
            aria-describedby="theoreticalValueHelp"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers re-render, calculation is automatic on input change
          }}
          aria-label="Calculate Percent Error"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ observedValue: "", theoreticalValue: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.label !== "Enter both observed and theoretical values." && (
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
              <strong>Math Tip:</strong> Always double-check your input units and ensure the theoretical value is non-zero to avoid division errors.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Percent Error Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Percent Error Calculator is an essential tool in scientific and engineering disciplines used to quantify the accuracy of experimental measurements. By comparing the observed value obtained from an experiment to the true theoretical value, this calculator provides a standardized way to express the discrepancy as a percentage. This measure helps researchers assess the reliability and precision of their results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Percent error is particularly useful for identifying systematic errors and evaluating the effectiveness of experimental methods. It enables users to pinpoint potential sources of error and refine their techniques accordingly. This calculator simplifies the process, ensuring accurate and consistent calculations that adhere to rigorous mathematical standards.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the calculation of percent error, which involves taking the absolute difference between the observed and theoretical values, dividing by the absolute theoretical value, and then multiplying by 100 to convert to a percentage. This approach ensures the error is always expressed as a positive value, reflecting the magnitude of deviation regardless of direction.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Percent Error = \\frac{|Observed - Theoretical|}{|Theoretical|} \\times 100\\%`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Using Percent Error in Lab Work and Quality Control
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Percent error measures the accuracy of a measurement or estimate relative to the true (or accepted) value. The formula: percent error = |measured - accepted| / |accepted| x 100. A chemistry student measures the density of copper as 8.5 g/cm^3; the accepted value is 8.96 g/cm^3. Percent error = |8.5 - 8.96| / 8.96 x 100 = 5.1%. This tells the student their measurement is off by 5.1%, which may indicate a systematic error in their procedure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Distinguishing percent error from percent difference is important. Percent error compares to a known true value. Percent difference compares two measured values with no agreed truth: |A - B| / ((A+B)/2) x 100. Use percent error when verifying against a standard (calibration, textbook value); use percent difference when comparing two experimental measurements. Using percent error when no true value exists produces a meaningless result.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Acceptable percent error thresholds vary by field and context. Introductory chemistry labs typically accept 5-10% percent error as passing. Analytical chemistry requires 1-2%. Pharmaceutical manufacturing requires &lt;1% for drug potency measurements, with regulatory consequences for exceedances. Engineering tolerances depend on safety criticality: structural loads allow 5-10% while aerospace components may require &lt;0.1%. Always interpret percent error relative to the precision requirements of your specific application.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Systematic errors produce consistent percent error in one direction; random errors average out over many trials. If all your measurements are consistently low by 5%, you likely have a calibration issue or procedural bias. If your measurements scatter around the true value, random error dominates. Calculating percent error for multiple trials and analyzing whether it is consistently positive or negative diagnoses which type of error is present.
        </p>
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
              href="https://math.libretexts.org/Bookshelves/Precalculus/Book%3A_Precalculus_(OpenStax)/15%3A_Applications_of_Functions/15.5%3A_Percent_Error"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts - Percent Error
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library providing detailed explanations on percent error and its applications.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Percent Error Calculator"
      description="Calculate percent error in experimental measurements. Compare your observed value to the true theoretical value to check accuracy."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "Percent Error = |Observed - Theoretical| / |Theoretical| × 100%",
        variables: [
          { symbol: "Observed", description: "The experimentally measured value" },
          { symbol: "Theoretical", description: "The true or accepted value" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          "Suppose you measure the boiling point of water as 98.6°C, while the accepted theoretical value is 100°C. Calculate the percent error.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the absolute difference: |98.6 - 100| = 1.4",
          },
          {
            label: "2",
            explanation:
              "Divide by the absolute theoretical value: 1.4 / 100 = 0.014",
          },
          {
            label: "3",
            explanation:
              "Multiply by 100 to get percentage: 0.014 × 100 = 1.4%",
          },
        ],
        result: "The percent error is 1.4000%.",
      }}
      relatedCalculators={[
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Percent Error Calculator" },
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