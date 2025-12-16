import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = Math.abs(imag).toFixed(4);
  const sign = imag >= 0 ? "+" : "-";
  return `${r} ${sign} ${i}i`;
}

export default function QuadraticEquationSolverCalculator() {
  const [inputs, setInputs] = useState<{ a?: string; b?: string; c?: string }>({});

  const handleInputChange = useCallback((name: "a" | "b" | "c", value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const a = parseFloat(inputs.a ?? "");
    const b = parseFloat(inputs.b ?? "");
    const c = parseFloat(inputs.c ?? "");

    // Validation
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      return {
        value: "Enter valid numbers for a, b, and c.",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (a === 0) {
      return {
        value: "Coefficient 'a' cannot be zero.",
        label: "",
        subtext: "",
        warning: "This is not a quadratic equation if a = 0.",
        formulaUsed: null,
      };
    }

    // Discriminant
    const discriminant = b * b - 4 * a * c;
    const twoA = 2 * a;

    let root1: string;
    let root2: string;
    let label = "Roots of the quadratic equation";
    let subtext = `Discriminant (Δ) = ${discriminant.toFixed(4)}`;
    let warning = null;

    if (discriminant > 0) {
      // Two distinct real roots
      const sqrtD = Math.sqrt(discriminant);
      root1 = ((-b + sqrtD) / twoA).toFixed(4);
      root2 = ((-b - sqrtD) / twoA).toFixed(4);
    } else if (discriminant === 0) {
      // One real root (double root)
      root1 = root2 = (-b / twoA).toFixed(4);
    } else {
      // Complex roots
      const realPart = -b / twoA;
      const imagPart = Math.sqrt(-discriminant) / twoA;
      root1 = formatComplex(realPart, imagPart);
      root2 = formatComplex(realPart, -imagPart);
      warning = "The roots are complex numbers.";
    }

    // Vertex calculation
    const vertexX = (-b / (2 * a)).toFixed(4);
    const vertexY = (a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c).toFixed(4);

    return {
      value: (
        <>
          <div>
            <strong>Root 1:</strong> {root1}
          </div>
          <div>
            <strong>Root 2:</strong> {root2}
          </div>
          <div className="mt-2">
            <strong>Vertex:</strong> ({vertexX}, {vertexY})
          </div>
        </>
      ),
      label,
      subtext,
      warning,
      formulaUsed: "Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the discriminant tell us about the roots?",
      answer:
        "The discriminant, calculated as b² - 4ac, determines the nature of the roots of a quadratic equation. If it is positive, there are two distinct real roots; if zero, one real repeated root; and if negative, two complex conjugate roots. Understanding the discriminant helps predict the solution type without solving the equation.",
    },
    {
      question: "How do complex roots appear in quadratic equations?",
      answer:
        "Complex roots occur when the discriminant is negative, meaning the square root of a negative number is involved. These roots are expressed in the form a + bi, where 'a' is the real part and 'b' is the imaginary part. Complex roots always come in conjugate pairs, reflecting symmetry in the quadratic function.",
    },
    {
      question: "Why can't the coefficient 'a' be zero in a quadratic equation?",
      answer:
        "The coefficient 'a' must be non-zero to maintain the quadratic nature of the equation. If 'a' equals zero, the equation reduces to a linear form bx + c = 0, which has a different solution method. Ensuring 'a' is not zero guarantees the equation represents a parabola and can be solved using the quadratic formula.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="a" className="text-slate-700 dark:text-slate-300">
            Coefficient a (x²)
          </Label>
          <Input
            id="a"
            type="number"
            step="any"
            value={inputs.a ?? ""}
            onChange={(e) => handleInputChange("a", e.target.value)}
            placeholder="Enter coefficient a"
            aria-label="Coefficient a"
          />
        </div>
        <div>
          <Label htmlFor="b" className="text-slate-700 dark:text-slate-300">
            Coefficient b (x)
          </Label>
          <Input
            id="b"
            type="number"
            step="any"
            value={inputs.b ?? ""}
            onChange={(e) => handleInputChange("b", e.target.value)}
            placeholder="Enter coefficient b"
            aria-label="Coefficient b"
          />
        </div>
        <div>
          <Label htmlFor="c" className="text-slate-700 dark:text-slate-300">
            Constant c
          </Label>
          <Input
            id="c"
            type="number"
            step="any"
            value={inputs.c ?? ""}
            onChange={(e) => handleInputChange("c", e.target.value)}
            placeholder="Enter constant c"
            aria-label="Constant c"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            /* Calculation triggered by state update, no extra action needed */
          }}
          type="button"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {typeof results.value === "string" && results.value.startsWith("Enter") && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-4">{results.value}</p>
      )}
      {typeof results.value !== "string" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <div className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</div>
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
              <strong>Math Tip:</strong> Always double-check your input coefficients to ensure they represent a valid quadratic equation (a ≠ 0).
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
          Understanding Quadratic Equation Solver (ax²+bx+c)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A quadratic equation is a second-degree polynomial equation in the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. Solving such equations involves finding the values of x that satisfy this relationship, which correspond to the roots or zeros of the quadratic function. These roots can be real or complex numbers depending on the discriminant.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The quadratic equation solver uses the quadratic formula, a fundamental tool in algebra, to compute these roots precisely. This formula accounts for all cases, including distinct real roots, repeated roots, and complex conjugate roots. The solver also calculates the vertex of the parabola, providing insights into the graph's shape and position.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is essential for students, educators, and professionals who require accurate and efficient solutions to quadratic problems. It eliminates manual calculation errors and enhances understanding by displaying detailed results, including the discriminant and vertex coordinates, thereby supporting deeper mathematical comprehension.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the quadratic formula, which provides the roots of any quadratic equation ax² + bx + c = 0. The formula derives from completing the square method and is universally applicable regardless of the discriminant's value.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`}
        </pre>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Here, the discriminant Δ = b² - 4ac determines the nature of the roots. If Δ > 0, two distinct real roots exist; if Δ = 0, one repeated real root; and if Δ < 0, two complex conjugate roots. The vertex of the parabola is found at x = -b/(2a), with the y-coordinate calculated by substituting x back into the quadratic expression.
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
              href="https://math.libretexts.org/Bookshelves/Algebra/Book%3A_College_Algebra_(OpenStax)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering algebra and quadratic equations.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/algebra/quadratics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy: Quadratic Equations
            </a>
            <p className="text-slate-500 text-sm">Detailed lessons and exercises on quadratic equations and their solutions.</p>
          </li>
          <li className="block">
            <a
              href="https://en.wikipedia.org/wiki/Quadratic_equation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Wikipedia: Quadratic Equation
            </a>
            <p className="text-slate-500 text-sm">Comprehensive article covering theory, formulas, and applications of quadratic equations.</p>
          </li>
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
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        variables: [
          { symbol: "x", description: "Roots of the quadratic equation" },
          { symbol: "a", description: "Coefficient of x² (a ≠ 0)" },
          { symbol: "b", description: "Coefficient of x" },
          { symbol: "c", description: "Constant term" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario: "Solve 2x² - 4x - 6 = 0 using the quadratic formula.",
        steps: [
          { label: "1", explanation: "Identify coefficients: a=2, b=-4, c=-6." },
          { label: "2", explanation: "Calculate discriminant: Δ = (-4)² - 4*2*(-6) = 16 + 48 = 64." },
          { label: "3", explanation: "Compute roots: x = [4 ± √64] / (2*2) = [4 ± 8] / 4." },
          { label: "4", explanation: "Roots are x₁ = (4+8)/4 = 3 and x₂ = (4-8)/4 = -1." },
        ],
        result: "The roots of the equation are x = 3 and x = -1.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Quadratic Equation Solver (ax²+bx+c)" },
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