import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = Math.abs(imag).toFixed(4);
  const sign = imag >= 0 ? "+" : "-";
  return `${r} ${sign} ${i}i`;
}

export default function QuadraticEquationSolverCalculator() {
  const [inputs, setInputs] = useState({
    a: "",
    b: "",
    c: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only valid numeric input including negative and decimal
    if (/^-?\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const a = parseFloat(inputs.a);
    const b = parseFloat(inputs.b);
    const c = parseFloat(inputs.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid numeric values for a, b, and c.",
        formulaUsed: "Quadratic Formula",
      };
    }
    if (a === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Coefficient 'a' cannot be zero for a quadratic equation.",
        formulaUsed: "Quadratic Formula",
      };
    }

    const discriminant = b * b - 4 * a * c;
    const twoA = 2 * a;

    let root1: string;
    let root2: string;
    let label = "";
    let subtext = `Discriminant (Δ) = ${discriminant.toFixed(4)}`;

    if (discriminant > 0) {
      // Two distinct real roots
      const sqrtD = Math.sqrt(discriminant);
      root1 = ((-b + sqrtD) / twoA).toFixed(4);
      root2 = ((-b - sqrtD) / twoA).toFixed(4);
      label = `Two distinct real roots: x₁ = ${root1}, x₂ = ${root2}`;
    } else if (discriminant === 0) {
      // One real root (double root)
      root1 = (-b / twoA).toFixed(4);
      label = `One real root (double root): x = ${root1}`;
    } else {
      // Complex roots
      const realPart = -b / twoA;
      const imagPart = Math.sqrt(-discriminant) / twoA;
      root1 = formatComplex(realPart, imagPart);
      root2 = formatComplex(realPart, -imagPart);
      label = `Two complex roots: x₁ = ${root1}, x₂ = ${root2}`;
    }

    // Vertex calculation
    const vertexX = (-b / (2 * a)).toFixed(4);
    const vertexY = (a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c).toFixed(4);
    const vertex = `Vertex: (${vertexX}, ${vertexY})`;

    return {
      value: `${root1}${discriminant !== 0 ? ` , ${root2}` : ""}`,
      label,
      subtext: `${subtext}. ${vertex}.`,
      warning: null,
      formulaUsed: "Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the discriminant tell us about the roots of a quadratic equation?",
      answer:
        "The discriminant (Δ = b² - 4ac) indicates the nature of the roots. If Δ &gt; 0, there are two distinct real roots. If Δ = 0, there is exactly one real root (a repeated root). If Δ &lt; 0, the roots are complex conjugates.",
    },
    {
      question: "Can the quadratic formula be used if coefficient 'a' is zero?",
      answer:
        "No. If 'a' equals zero, the equation is not quadratic but linear. The quadratic formula requires a non-zero 'a' to solve for roots of a parabola.",
    },
    {
      question: "How do complex roots appear in quadratic equations?",
      answer:
        "Complex roots occur when the discriminant is negative. They are expressed in the form 'a + bi' where 'i' is the imaginary unit. These roots always come in conjugate pairs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="a" className="font-semibold">
            Coefficient a
          </Label>
          <Input
            id="a"
            type="text"
            placeholder="e.g. 1"
            value={inputs.a}
            onChange={(e) => handleInputChange("a", e.target.value)}
            aria-describedby="a-desc"
          />
          <p id="a-desc" className="text-xs text-slate-500 mt-1">
            Must not be zero.
          </p>
        </div>
        <div>
          <Label htmlFor="b" className="font-semibold">
            Coefficient b
          </Label>
          <Input
            id="b"
            type="text"
            placeholder="e.g. -3"
            value={inputs.b}
            onChange={(e) => handleInputChange("b", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="c" className="font-semibold">
            Coefficient c
          </Label>
          <Input
            id="c"
            type="text"
            placeholder="e.g. 2"
            value={inputs.c}
            onChange={(e) => handleInputChange("c", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate quadratic roots"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ a: "", b: "", c: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Quadratic Equation Solver (ax²+bx+c)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A quadratic equation is a second-degree polynomial equation in the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. The graph of such an equation is a parabola, which can open upwards or downwards depending on the sign of coefficient a. Solving a quadratic equation means finding the values of x (roots) that satisfy the equation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The quadratic formula provides a universal method to find these roots by calculating the discriminant Δ = b² - 4ac. This discriminant determines the nature of the roots: two distinct real roots, one repeated real root, or two complex conjugate roots. Understanding these outcomes is crucial for analyzing the behavior of quadratic functions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This solver tool uses the quadratic formula to compute roots precisely, handling real and complex solutions with up to four decimal places of accuracy. It also calculates the vertex of the parabola, providing a comprehensive understanding of the quadratic function's graph.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {`x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}

Where:
  a, b, c = coefficients of the quadratic equation
  \\pm = plus or minus (two possible roots)
  \\sqrt{} = square root`}
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
      title="Quadratic Equation Solver (ax²+bx+c)"
      description="Solve quadratic equations instantly. Find the roots (x-intercepts), discriminant, and vertex of any parabola using the quadratic formula."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        variables: [
          { symbol: "x", description: "Variable (roots of the equation)" },
          { symbol: "a", description: "Coefficient of x² (non-zero)" },
          { symbol: "b", description: "Coefficient of x" },
          { symbol: "c", description: "Constant term" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Solve the quadratic equation 2x² - 4x - 6 = 0.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify coefficients: a = 2, b = -4, c = -6.",
          },
          {
            label: "2",
            explanation:
              "Calculate the discriminant: Δ = (-4)² - 4 * 2 * (-6) = 16 + 48 = 64.",
          },
          {
            label: "3",
            explanation:
              "Compute roots using the quadratic formula: x = [4 ± √64] / (2 * 2).",
          },
          {
            label: "4",
            explanation:
              "Roots are x₁ = (4 + 8) / 4 = 3.0000 and x₂ = (4 - 8) / 4 = -1.0000.",
          },
        ],
        result: "The equation has two distinct real roots: 3.0000 and -1.0000.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
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