import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// SAFE ICONS ONLY
import { Sigma, Calculator, RotateCcw, Info, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = Math.abs(imag).toFixed(4);
  const sign = imag >= 0 ? "+" : "-";
  return `${r} ${sign} ${i}i`;
}

export default function LinearEquationSolver12VariablesCalculator() {
  // Mode: "one" for single variable, "two" for two variables system
  const [mode, setMode] = useState<"one" | "two">("one");

  // Inputs for single variable: ax + b = c
  // Inputs for two variables system:
  // eq1: a1x + b1y = c1
  // eq2: a2x + b2y = c2
  const [inputs, setInputs] = useState({
    a: "",
    b: "",
    c: "",
    a1: "",
    b1: "",
    c1: "",
    a2: "",
    b2: "",
    c2: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic
  const results = useMemo(() => {
    // Helper to parse float or NaN
    const p = (v: string) => parseFloat(v);

    if (mode === "one") {
      // Single variable linear equation: a*x + b = c
      const a = p(inputs.a);
      const b = p(inputs.b);
      const c = p(inputs.c);

      // Validation
      if ([a, b, c].some((v) => isNaN(v))) {
        return {
          value: 0,
          label: "Enter valid numeric inputs for a, b, and c.",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (a === 0) {
        if (b === c) {
          return {
            value: "Infinite solutions",
            label: "The equation holds for all x.",
            subtext: "",
            warning: null,
            formulaUsed: "a = 0 and b = c",
          };
        } else {
          return {
            value: "No solution",
            label: "The equation is inconsistent.",
            subtext: "",
            warning: null,
            formulaUsed: "a = 0 and b ≠ c",
          };
        }
      }
      // Solve for x: x = (c - b) / a
      const x = (c - b) / a;
      return {
        value: x.toFixed(4),
        label: "Solution for x",
        subtext: "Linear equation solved with one variable",
        warning: null,
        formulaUsed: "x = (c - b) / a",
      };
    } else {
      // Two variables system:
      // a1*x + b1*y = c1
      // a2*x + b2*y = c2
      const a1 = p(inputs.a1);
      const b1 = p(inputs.b1);
      const c1 = p(inputs.c1);
      const a2 = p(inputs.a2);
      const b2 = p(inputs.b2);
      const c2 = p(inputs.c2);

      if ([a1, b1, c1, a2, b2, c2].some((v) => isNaN(v))) {
        return {
          value: 0,
          label: "Enter valid numeric inputs for all coefficients and constants.",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }

      // Calculate determinant
      const det = a1 * b2 - a2 * b1;

      if (det === 0) {
        // Check if system is dependent or inconsistent
        // Using ratios to check
        const ratioA = a1 !== 0 && a2 !== 0 ? a1 / a2 : null;
        const ratioB = b1 !== 0 && b2 !== 0 ? b1 / b2 : null;
        const ratioC = c1 !== 0 && c2 !== 0 ? c1 / c2 : null;

        if (
          (ratioA !== null && ratioB !== null && ratioC !== null) &&
          (Math.abs(ratioA - ratioB) < 1e-10 && Math.abs(ratioB - ratioC) < 1e-10)
        ) {
          return {
            value: "Infinite solutions",
            label: "The system has infinitely many solutions.",
            subtext: "",
            warning: null,
            formulaUsed: "Determinant = 0 and ratios equal",
          };
        } else {
          return {
            value: "No solution",
            label: "The system is inconsistent and has no solution.",
            subtext: "",
            warning: null,
            formulaUsed: "Determinant = 0 and ratios differ",
          };
        }
      }

      // Use Cramer's rule:
      // x = (c1*b2 - c2*b1) / det
      // y = (a1*c2 - a2*c1) / det
      const x = (c1 * b2 - c2 * b1) / det;
      const y = (a1 * c2 - a2 * c1) / det;

      return {
        value: `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`,
        label: "Solution for x and y",
        subtext: "System of linear equations solved using Cramer's rule",
        warning: null,
        formulaUsed: "Cramer's rule: x = (c1b2 - c2b1)/det, y = (a1c2 - a2c1)/det",
      };
    }
  }, [inputs, mode]);

  // FAQs with 50-80 words each
  const faqs = [
    {
      question: "What is a linear equation with one variable?",
      answer:
        "A linear equation with one variable is an algebraic equation in which the highest power of the variable is one. It typically takes the form ax + b = c, where a, b, and c are constants. The solution is the value of x that satisfies the equation. Such equations represent straight lines when graphed on a coordinate axis.",
    },
    {
      question: "How do you solve a system of two linear equations?",
      answer:
        "To solve a system of two linear equations with two variables, methods like substitution, elimination, or Cramer's rule are used. Cramer's rule involves calculating determinants to find unique solutions for variables. If the determinant is zero, the system may have infinite solutions or none, depending on the consistency of the equations.",
    },
    {
      question: "What does it mean if a system has no solution or infinite solutions?",
      answer:
        "A system has no solution if the equations represent parallel lines that never intersect, indicating inconsistency. Infinite solutions occur when the equations represent the same line, meaning every point on the line satisfies both equations. These cases are identified by analyzing the determinant or ratios of coefficients.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <Label htmlFor="mode" className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block">
          Select Equation Type
        </Label>
        <Select
          value={mode}
          onValueChange={(v) => setMode(v as "one" | "two")}
          id="mode"
          aria-label="Select equation type"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose equation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">Single Variable (ax + b = c)</SelectItem>
            <SelectItem value="two">Two Variables System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs Section */}
      {mode === "one" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="a" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
              Coefficient a (for x)
            </Label>
            <Input
              id="a"
              type="number"
              value={inputs.a}
              onChange={(e) => handleInputChange("a", e.target.value)}
              placeholder="Enter coefficient a"
              aria-describedby="a-desc"
            />
            <p id="a-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Coefficient multiplying x
            </p>
          </div>
          <div>
            <Label htmlFor="b" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
              Constant b
            </Label>
            <Input
              id="b"
              type="number"
              value={inputs.b}
              onChange={(e) => handleInputChange("b", e.target.value)}
              placeholder="Enter constant b"
              aria-describedby="b-desc"
            />
            <p id="b-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Constant term on left side
            </p>
          </div>
          <div>
            <Label htmlFor="c" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
              Constant c
            </Label>
            <Input
              id="c"
              type="number"
              value={inputs.c}
              onChange={(e) => handleInputChange("c", e.target.value)}
              placeholder="Enter constant c"
              aria-describedby="c-desc"
            />
            <p id="c-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Constant term on right side
            </p>
          </div>
        </div>
      )}

      {mode === "two" && (
        <div className="space-y-6">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Equation 1: a₁x + b₁y = c₁</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="a1" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
                  a₁
                </Label>
                <Input
                  id="a1"
                  type="number"
                  value={inputs.a1}
                  onChange={(e) => handleInputChange("a1", e.target.value)}
                  placeholder="a₁"
                  aria-describedby="a1-desc"
                />
                <p id="a1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Coefficient of x in eq 1
                </p>
              </div>
              <div>
                <Label htmlFor="b1" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
                  b₁
                </Label>
                <Input
                  id="b1"
                  type="number"
                  value={inputs.b1}
                  onChange={(e) => handleInputChange("b1", e.target.value)}
                  placeholder="b₁"
                  aria-describedby="b1-desc"
                />
                <p id="b1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Coefficient of y in eq 1
                </p>
              </div>
              <div>
                <Label htmlFor="c1" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
                  c₁
                </Label>
                <Input
                  id="c1"
                  type="number"
                  value={inputs.c1}
                  onChange={(e) => handleInputChange("c1", e.target.value)}
                  placeholder="c₁"
                  aria-describedby="c1-desc"
                />
                <p id="c1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Constant term in eq 1
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Equation 2: a₂x + b₂y = c₂</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="a2" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
                  a₂
                </Label>
                <Input
                  id="a2"
                  type="number"
                  value={inputs.a2}
                  onChange={(e) => handleInputChange("a2", e.target.value)}
                  placeholder="a₂"
                  aria-describedby="a2-desc"
                />
                <p id="a2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Coefficient of x in eq 2
                </p>
              </div>
              <div>
                <Label htmlFor="b2" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
                  b₂
                </Label>
                <Input
                  id="b2"
                  type="number"
                  value={inputs.b2}
                  onChange={(e) => handleInputChange("b2", e.target.value)}
                  placeholder="b₂"
                  aria-describedby="b2-desc"
                />
                <p id="b2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Coefficient of y in eq 2
                </p>
              </div>
              <div>
                <Label htmlFor="c2" className="text-slate-700 dark:text-slate-300 font-semibold mb-1 block">
                  c₂
                </Label>
                <Input
                  id="c2"
                  type="number"
                  value={inputs.c2}
                  onChange={(e) => handleInputChange("c2", e.target.value)}
                  placeholder="c₂"
                  aria-describedby="c2-desc"
                />
                <p id="c2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Constant term in eq 2
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate solution"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              a: "",
              b: "",
              c: "",
              a1: "",
              b1: "",
              c1: "",
              a2: "",
              b2: "",
              c2: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "Enter data..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
              <strong>Math Tip:</strong> Always double-check your input units (e.g., Degrees vs Radians) to ensure accuracy.
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
          Understanding Linear Equation Solver (1–2 variables)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Linear equations are fundamental constructs in algebra that represent relationships between variables with a degree of one. Solving these equations involves finding the value(s) of the variable(s) that satisfy the equality. For single-variable linear equations, the solution is straightforward and involves isolating the variable. For systems with two variables, methods such as substitution, elimination, or matrix approaches are employed to find the intersection point(s).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This solver provides a professional and precise tool to handle both single linear equations and systems of two linear equations. It ensures accuracy by validating inputs and applying mathematically sound methods like Cramer's rule for two-variable systems. The solver also gracefully handles special cases such as infinite solutions or no solutions, providing clear feedback to users. This makes it an essential resource for students, educators, and professionals dealing with algebraic problems.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">The core mathematical principle used here is:</p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Single variable:
  x = (c - b) / a

Two variables system (Cramer's rule):
  det = a1*b2 - a2*b1
  x = (c1*b2 - c2*b1) / det
  y = (a1*c2 - a2*c1) / det`}
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
              href="https://math.libretexts.org/Bookshelves/Algebra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/algebra/linear-equations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Linear Equations
            </a>
            <p className="text-slate-500 text-sm">Detailed lessons and exercises on linear equations and systems.</p>
          </li>
          <li className="block">
            <a
              href="https://en.wikipedia.org/wiki/Linear_equation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Wikipedia - Linear Equation
            </a>
            <p className="text-slate-500 text-sm">General overview and properties of linear equations.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Linear Equation Solver (1–2 variables)"
      description="Solve linear equations with one or two variables. Find the value of X (and Y) for simple algebraic problems and systems."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: mode === "one"
          ? "x = (c - b) / a"
          : `det = a₁b₂ - a₂b₁\nx = (c₁b₂ - c₂b₁) / det\ny = (a₁c₂ - a₂c₁) / det`,
        variables:
          mode === "one"
            ? [
                { symbol: "a", description: "Coefficient of x" },
                { symbol: "b", description: "Constant term on left side" },
                { symbol: "c", description: "Constant term on right side" },
                { symbol: "x", description: "Variable to solve for" },
              ]
            : [
                { symbol: "a₁", description: "Coefficient of x in equation 1" },
                { symbol: "b₁", description: "Coefficient of y in equation 1" },
                { symbol: "c₁", description: "Constant term in equation 1" },
                { symbol: "a₂", description: "Coefficient of x in equation 2" },
                { symbol: "b₂", description: "Coefficient of y in equation 2" },
                { symbol: "c₂", description: "Constant term in equation 2" },
                { symbol: "x", description: "Variable x" },
                { symbol: "y", description: "Variable y" },
              ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          mode === "one"
            ? "Solve the equation 3x + 4 = 10 for x."
            : "Solve the system: 2x + 3y = 6 and 4x - y = 5.",
        steps:
          mode === "one"
            ? [
                { label: "1", explanation: "Subtract 4 from both sides: 3x = 6." },
                { label: "2", explanation: "Divide both sides by 3: x = 6 / 3." },
                { label: "3", explanation: "Simplify: x = 2." },
              ]
            : [
                { label: "1", explanation: "Calculate determinant: det = 2*(-1) - 4*3 = -2 - 12 = -14." },
                { label: "2", explanation: "Calculate x: x = (6*(-1) - 5*3) / det = (-6 - 15)/-14 = 21/14 = 1.5." },
                { label: "3", explanation: "Calculate y: y = (2*5 - 4*6) / det = (10 - 24)/-14 = -14/-14 = 1." },
              ],
        result: mode === "one" ? "x = 2" : "x = 1.5, y = 1",
      }}
      relatedCalculators={[
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Linear Equation Solver (1–2 variables)" },
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