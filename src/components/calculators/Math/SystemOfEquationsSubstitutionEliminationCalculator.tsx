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

type Method = "substitution" | "elimination";

interface Inputs {
  a1: string;
  b1: string;
  c1: string;
  a2: string;
  b2: string;
  c2: string;
  method: Method;
}

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = Math.abs(imag).toFixed(4);
  const sign = imag >= 0 ? "+" : "-";
  return `${r} ${sign} ${i}i`;
}

export default function SystemOfEquationsSubstitutionEliminationCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    a1: "",
    b1: "",
    c1: "",
    a2: "",
    b2: "",
    c2: "",
    method: "substitution",
  });

  const handleInputChange = useCallback((name: keyof Inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs
    const a1 = parseFloat(inputs.a1);
    const b1 = parseFloat(inputs.b1);
    const c1 = parseFloat(inputs.c1);
    const a2 = parseFloat(inputs.a2);
    const b2 = parseFloat(inputs.b2);
    const c2 = parseFloat(inputs.c2);
    const method = inputs.method;

    // Validate inputs
    if (
      [a1, b1, c1, a2, b2, c2].some((v) => isNaN(v))
    ) {
      return {
        value: 0,
        label: "Enter all coefficients and constants.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Check if system is solvable (determinant)
    const det = a1 * b2 - a2 * b1;
    if (det === 0) {
      return {
        value: 0,
        label: "The system has no unique solution (determinant is zero).",
        subtext: "",
        warning: "The lines are either parallel or coincident.",
        formulaUsed: null,
      };
    }

    // Calculation logic
    let x: number | string = 0;
    let y: number | string = 0;
    let formulaUsed = "";

    if (method === "substitution") {
      // Solve first equation for x or y (choose variable with non-zero coefficient)
      // Prefer solving for x if a1 != 0, else for y
      if (a1 !== 0) {
        // x = (c1 - b1*y)/a1
        // Substitute into second equation:
        // a2*((c1 - b1*y)/a1) + b2*y = c2
        // (a2*c1)/a1 - (a2*b1)/a1*y + b2*y = c2
        // y * (b2 - (a2*b1)/a1) = c2 - (a2*c1)/a1
        const denom = b2 - (a2 * b1) / a1;
        if (denom === 0) {
          return {
            value: 0,
            label: "No unique solution found using substitution.",
            subtext: "",
            warning: "Denominator zero during substitution step.",
            formulaUsed: null,
          };
        }
        y = (c2 - (a2 * c1) / a1) / denom;
        x = (c1 - b1 * y) / a1;
        formulaUsed =
          "Substitution: Solve first equation for x, substitute into second, solve for y, then x.";
      } else if (b1 !== 0) {
        // Solve first equation for y: y = (c1 - a1*x)/b1
        // Substitute into second:
        // a2*x + b2*((c1 - a1*x)/b1) = c2
        // a2*x + (b2*c1)/b1 - (b2*a1)/b1*x = c2
        // x*(a2 - (b2*a1)/b1) = c2 - (b2*c1)/b1
        const denom = a2 - (b2 * a1) / b1;
        if (denom === 0) {
          return {
            value: 0,
            label: "No unique solution found using substitution.",
            subtext: "",
            warning: "Denominator zero during substitution step.",
            formulaUsed: null,
          };
        }
        x = (c2 - (b2 * c1) / b1) / denom;
        y = (c1 - a1 * x) / b1;
        formulaUsed =
          "Substitution: Solve first equation for y, substitute into second, solve for x, then y.";
      } else {
        return {
          value: 0,
          label: "Cannot perform substitution: both a1 and b1 are zero.",
          subtext: "",
          warning: "Invalid first equation coefficients.",
          formulaUsed: null,
        };
      }
    } else if (method === "elimination") {
      // Multiply equations to align coefficients and eliminate one variable
      // We eliminate y first by multiplying eq1 by b2 and eq2 by b1
      // Then subtract to eliminate y:
      // (a1*b2)x + (b1*b2)y = c1*b2
      // (a2*b1)x + (b2*b1)y = c2*b1
      // Subtract:
      // (a1*b2 - a2*b1)x = c1*b2 - c2*b1
      // x = (c1*b2 - c2*b1) / (a1*b2 - a2*b1)
      const numeratorX = c1 * b2 - c2 * b1;
      const denominatorX = a1 * b2 - a2 * b1;
      if (denominatorX === 0) {
        return {
          value: 0,
          label: "No unique solution found using elimination.",
          subtext: "",
          warning: "Denominator zero during elimination step.",
          formulaUsed: null,
        };
      }
      x = numeratorX / denominatorX;

      // Substitute x back into one of the equations to find y
      // Use first equation: a1*x + b1*y = c1 => y = (c1 - a1*x)/b1
      if (b1 === 0) {
        // If b1=0, use second equation: a2*x + b2*y = c2 => y = (c2 - a2*x)/b2
        if (b2 === 0) {
          return {
            value: 0,
            label: "Cannot solve for y: both b1 and b2 are zero.",
            subtext: "",
            warning: "Invalid coefficients for elimination.",
            formulaUsed: null,
          };
        }
        y = (c2 - a2 * x) / b2;
      } else {
        y = (c1 - a1 * x) / b1;
      }
      formulaUsed =
        "Elimination: Multiply and subtract equations to eliminate one variable, solve for the other, then substitute back.";
    } else {
      return {
        value: 0,
        label: "Invalid method selected.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Format results to 4 decimals
    const xStr =
      typeof x === "number" ? x.toFixed(4) : x;
    const yStr =
      typeof y === "number" ? y.toFixed(4) : y;

    return {
      value: `x = ${xStr}, y = ${yStr}`,
      label: "Solution for the system of equations",
      subtext: "Values of variables x and y",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between substitution and elimination methods?",
      answer:
        "The substitution method involves solving one equation for one variable and substituting that expression into the other equation. The elimination method involves multiplying equations to align coefficients and then adding or subtracting them to eliminate one variable. Both methods aim to reduce the system to a single-variable equation for easier solving.",
    },
    {
      question: "When does a system of equations have no unique solution?",
      answer:
        "A system has no unique solution when the determinant of the coefficient matrix is zero, meaning the equations represent parallel or coincident lines. In such cases, either there are infinitely many solutions (coincident lines) or no solution at all (parallel lines). This condition is detected by checking if a1*b2 - a2*b1 equals zero.",
    },
    {
      question: "Can this solver handle complex solutions?",
      answer:
        "This solver is designed for linear systems with real coefficients and constants, which typically yield real solutions. Complex solutions generally arise in nonlinear systems or quadratic equations. If complex numbers were to appear, they would be formatted as 'a + bi', but for linear systems, solutions are real or no unique solution exists.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="a1" className="text-slate-700 dark:text-slate-300">
            a₁ (Coefficient of x in Eq. 1)
          </Label>
          <Input
            id="a1"
            type="number"
            value={inputs.a1}
            onChange={(e) => handleInputChange("a1", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div>
          <Label htmlFor="b1" className="text-slate-700 dark:text-slate-300">
            b₁ (Coefficient of y in Eq. 1)
          </Label>
          <Input
            id="b1"
            type="number"
            value={inputs.b1}
            onChange={(e) => handleInputChange("b1", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
        <div>
          <Label htmlFor="c1" className="text-slate-700 dark:text-slate-300">
            c₁ (Constant in Eq. 1)
          </Label>
          <Input
            id="c1"
            type="number"
            value={inputs.c1}
            onChange={(e) => handleInputChange("c1", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <Label htmlFor="a2" className="text-slate-700 dark:text-slate-300">
            a₂ (Coefficient of x in Eq. 2)
          </Label>
          <Input
            id="a2"
            type="number"
            value={inputs.a2}
            onChange={(e) => handleInputChange("a2", e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <div>
          <Label htmlFor="b2" className="text-slate-700 dark:text-slate-300">
            b₂ (Coefficient of y in Eq. 2)
          </Label>
          <Input
            id="b2"
            type="number"
            value={inputs.b2}
            onChange={(e) => handleInputChange("b2", e.target.value)}
            placeholder="e.g. -4"
          />
        </div>
        <div>
          <Label htmlFor="c2" className="text-slate-700 dark:text-slate-300">
            c₂ (Constant in Eq. 2)
          </Label>
          <Input
            id="c2"
            type="number"
            value={inputs.c2}
            onChange={(e) => handleInputChange("c2", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="method" className="text-slate-700 dark:text-slate-300">
          Select Method
        </Label>
        <Select
          value={inputs.method}
          onValueChange={(value) => handleInputChange("method", value as Method)}
        >
          <SelectTrigger id="method" className="w-full">
            <SelectValue placeholder="Choose method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="substitution">Substitution</SelectItem>
            <SelectItem value="elimination">Elimination</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate system of equations"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              a1: "",
              b1: "",
              c1: "",
              a2: "",
              b2: "",
              c2: "",
              method: "substitution",
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

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
              <strong>Math Tip:</strong> Always double-check your input coefficients and constants for accuracy. Ensure you select the appropriate method based on the system's characteristics.
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
          Understanding System of Equations Solver (Substitution/Elimination)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Systems of linear equations consist of two or more equations with multiple variables that are solved simultaneously. The goal is to find values for the variables that satisfy all equations at once. This solver focuses on two-variable linear systems, which are foundational in algebra and have applications in physics, engineering, and economics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The substitution and elimination methods are classical algebraic techniques used to solve such systems. Substitution involves isolating one variable and replacing it in the other equation, while elimination involves adding or subtracting equations to remove one variable. Both methods ultimately reduce the system to a single-variable equation, simplifying the solution process.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the solution of a 2x2 linear system:
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Given:
a₁x + b₁y = c₁
a₂x + b₂y = c₂

Determinant:
D = a₁b₂ - a₂b₁

If D ≠ 0, unique solution exists:

x = (c₁b₂ - c₂b₁) / D
y = (a₁c₂ - a₂c₁) / D`}
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
              href="https://math.libretexts.org/Bookshelves/Algebra/Book%3A_College_Algebra_(OpenStax)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive open-access mathematics library covering algebraic methods including systems of equations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/algebra/systems-of-equations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Systems of Equations
            </a>
            <p className="text-slate-500 text-sm">
              Detailed tutorials and exercises on substitution and elimination methods for solving linear systems.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.purplemath.com/modules/systlin2.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Purplemath - Solving Systems of Linear Equations
            </a>
            <p className="text-slate-500 text-sm">
              Clear explanations and examples of solving linear systems using substitution and elimination.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="System of Equations Solver (Substitution/Elimination)"
      description="Solve systems of linear equations. Use substitution or elimination methods to find the intersection point of two lines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `x = (c₁b₂ - c₂b₁) / (a₁b₂ - a₂b₁)
y = (a₁c₂ - a₂c₁) / (a₁b₂ - a₂b₁)`,
        variables: [
          { symbol: "a₁, b₁, c₁", description: "Coefficients and constant of first equation" },
          { symbol: "a₂, b₂, c₂", description: "Coefficients and constant of second equation" },
          { symbol: "x, y", description: "Variables to solve for" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          "Solve the system: 2x + 3y = 5 and x - 4y = 2 using substitution method.",
        steps: [
          {
            label: "1",
            explanation:
              "Solve first equation for x: x = (5 - 3y)/2.",
          },
          {
            label: "2",
            explanation:
              "Substitute x into second equation: ((5 - 3y)/2) - 4y = 2.",
          },
          {
            label: "3",
            explanation:
              "Solve for y: Multiply both sides by 2 to clear denominator, then isolate y.",
          },
          {
            label: "4",
            explanation:
              "Find y = 1, then substitute back to find x = 1.",
          },
        ],
        result: "Solution: x = 1.0000, y = 1.0000",
      }}
      relatedCalculators={[
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding System of Equations Solver (Substitution/Elimination)" },
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