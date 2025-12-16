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

type Inputs = {
  a1: string;
  b1: string;
  c1: string;
  a2: string;
  b2: string;
  c2: string;
  method: "substitution" | "elimination";
};

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = Math.abs(imag).toFixed(4);
  if (imag === 0) return r;
  if (real === 0) return imag > 0 ? `${i}i` : `-${i}i`;
  return imag > 0 ? `${r} + ${i}i` : `${r} - ${i}i`;
}

function solveBySubstitution(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): { x: string; y: string; warning?: string } {
  // Solve first equation for x or y (choose variable with non-zero coefficient)
  // Then substitute into second equation

  // Prefer solving for x if a1 != 0, else for y
  if (a1 === 0 && b1 === 0) {
    return {
      x: "",
      y: "",
      warning: "First equation is invalid (a1 and b1 cannot both be zero).",
    };
  }
  if (a2 === 0 && b2 === 0) {
    return {
      x: "",
      y: "",
      warning: "Second equation is invalid (a2 and b2 cannot both be zero).",
    };
  }

  // Solve for x from eq1 if possible
  if (a1 !== 0) {
    // x = (c1 - b1*y)/a1
    // Substitute into eq2: a2*x + b2*y = c2
    // a2*((c1 - b1*y)/a1) + b2*y = c2
    // (a2*c1)/a1 - (a2*b1)/a1*y + b2*y = c2
    // y * (b2 - (a2*b1)/a1) = c2 - (a2*c1)/a1
    const denom = b2 - (a2 * b1) / a1;
    if (denom === 0) {
      // Check if infinite or no solution
      // If numerator also zero => infinite solutions else no solution
      const numerator = c2 - (a2 * c1) / a1;
      if (numerator === 0) {
        return {
          x: "",
          y: "",
          warning:
            "Infinite solutions exist (dependent equations).",
        };
      } else {
        return {
          x: "",
          y: "",
          warning: "No solution exists (inconsistent equations).",
        };
      }
    }
    const y = (c2 - (a2 * c1) / a1) / denom;
    const x = (c1 - b1 * y) / a1;
    return {
      x: x.toFixed(4),
      y: y.toFixed(4),
    };
  } else {
    // a1 === 0, solve for y from eq1: y = c1 / b1
    if (b1 === 0) {
      return {
        x: "",
        y: "",
        warning: "Cannot solve first equation for substitution (a1 and b1 zero).",
      };
    }
    const y = c1 / b1;
    // Substitute into eq2: a2*x + b2*y = c2 => a2*x = c2 - b2*y
    // x = (c2 - b2*y)/a2
    if (a2 === 0) {
      // Check if b2*y == c2 for infinite/no solution
      if (Math.abs(b2 * y - c2) < 1e-12) {
        return {
          x: "",
          y: y.toFixed(4),
          warning: "Infinite solutions exist (dependent equations).",
        };
      } else {
        return {
          x: "",
          y: y.toFixed(4),
          warning: "No solution exists (inconsistent equations).",
        };
      }
    }
    const x = (c2 - b2 * y) / a2;
    return {
      x: x.toFixed(4),
      y: y.toFixed(4),
    };
  }
}

function solveByElimination(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): { x: string; y: string; warning?: string } {
  // Use elimination to remove one variable

  // Calculate determinant
  const det = a1 * b2 - a2 * b1;

  if (det === 0) {
    // Check if infinite or no solution
    // If ratios of coefficients equal and constants equal => infinite solutions
    // else no solution
    const ratioA = a1 !== 0 && a2 !== 0 ? a1 / a2 : null;
    const ratioB = b1 !== 0 && b2 !== 0 ? b1 / b2 : null;
    const ratioC = c1 !== 0 && c2 !== 0 ? c1 / c2 : null;

    const ratiosEqual =
      (ratioA === null || ratioB === null || Math.abs(ratioA - ratioB) < 1e-12) &&
      (ratioB === null || ratioC === null || Math.abs(ratioB - ratioC) < 1e-12);

    if (ratiosEqual) {
      return {
        x: "",
        y: "",
        warning: "Infinite solutions exist (dependent equations).",
      };
    } else {
      return {
        x: "",
        y: "",
        warning: "No solution exists (inconsistent equations).",
      };
    }
  }

  // Use Cramer's rule:
  // x = (c1*b2 - c2*b1)/det
  // y = (a1*c2 - a2*c1)/det

  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  // Check for complex numbers (should not occur for real coefficients)
  // But if det is zero, handled above

  return {
    x: x.toFixed(4),
    y: y.toFixed(4),
  };
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

  const handleInputChange = useCallback(
    (name: keyof Inputs, value: string) => {
      setInputs((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const results = useMemo(() => {
    const {
      a1: a1s,
      b1: b1s,
      c1: c1s,
      a2: a2s,
      b2: b2s,
      c2: c2s,
      method,
    } = inputs;

    // Validate inputs: all must be parseable to numbers
    if (
      !a1s.trim() ||
      !b1s.trim() ||
      !c1s.trim() ||
      !a2s.trim() ||
      !b2s.trim() ||
      !c2s.trim()
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const a1 = Number(a1s);
    const b1 = Number(b1s);
    const c1 = Number(c1s);
    const a2 = Number(a2s);
    const b2 = Number(b2s);
    const c2 = Number(c2s);

    if (
      [a1, b1, c1, a2, b2, c2].some(
        (v) => Number.isNaN(v) || !Number.isFinite(v)
      )
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid finite numbers for all coefficients.",
        formulaUsed: "",
      };
    }

    let solution:
      | { x: string; y: string; warning?: string }
      | undefined = undefined;

    if (method === "substitution") {
      solution = solveBySubstitution(a1, b1, c1, a2, b2, c2);
    } else {
      solution = solveByElimination(a1, b1, c1, a2, b2, c2);
    }

    if (!solution) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Unexpected error in calculation.",
        formulaUsed: "",
      };
    }

    if (solution.warning) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: solution.warning,
        formulaUsed:
          method === "substitution"
            ? "Substitution Method"
            : "Elimination Method",
      };
    }

    return {
      value: `x = ${solution.x}, y = ${solution.y}`,
      label: "Solution for variables",
      subtext: `Method used: ${
        method === "substitution" ? "Substitution" : "Elimination"
      }`,
      warning: null,
      formulaUsed:
        method === "substitution"
          ? "Substitution Method"
          : "Elimination Method",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between substitution and elimination methods?",
      answer:
        "The substitution method solves one equation for one variable and substitutes it into the other equation, simplifying the system to one variable. The elimination method combines the two equations to eliminate one variable by adding or subtracting them, allowing direct solving for the remaining variable. Both methods ultimately find the intersection point of two lines represented by the equations.",
    },
    {
      question: "Can this solver handle systems with no or infinite solutions?",
      answer:
        "Yes, the solver detects when systems have no solutions (inconsistent equations) or infinite solutions (dependent equations). It provides appropriate warnings if the system is unsolvable or has infinitely many solutions, ensuring users understand the nature of the system they input.",
    },
    {
      question: "Why are decimal results rounded to four decimal places?",
      answer:
        "Rounding to four decimal places balances precision and readability, providing accurate results without overwhelming detail. This level of precision is sufficient for most practical applications in algebra and linear systems solving.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-300 dark:border-slate-700">
          <CardContent>
            <p className="font-semibold text-lg mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <FunctionSquare className="w-5 h-5" /> Equation 1 coefficients
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="a1">a₁ (coefficient of x)</Label>
                <Input
                  id="a1"
                  type="number"
                  value={inputs.a1}
                  onChange={(e) => handleInputChange("a1", e.target.value)}
                  placeholder="e.g. 2"
                  aria-describedby="a1-desc"
                />
                <p id="a1-desc" className="sr-only">
                  Coefficient a1 for x in first equation
                </p>
              </div>
              <div>
                <Label htmlFor="b1">b₁ (coefficient of y)</Label>
                <Input
                  id="b1"
                  type="number"
                  value={inputs.b1}
                  onChange={(e) => handleInputChange("b1", e.target.value)}
                  placeholder="e.g. 3"
                  aria-describedby="b1-desc"
                />
                <p id="b1-desc" className="sr-only">
                  Coefficient b1 for y in first equation
                </p>
              </div>
              <div>
                <Label htmlFor="c1">c₁ (constant)</Label>
                <Input
                  id="c1"
                  type="number"
                  value={inputs.c1}
                  onChange={(e) => handleInputChange("c1", e.target.value)}
                  placeholder="e.g. 5"
                  aria-describedby="c1-desc"
                />
                <p id="c1-desc" className="sr-only">
                  Constant c1 in first equation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 border border-slate-300 dark:border-slate-700">
          <CardContent>
            <p className="font-semibold text-lg mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <FunctionSquare className="w-5 h-5" /> Equation 2 coefficients
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="a2">a₂ (coefficient of x)</Label>
                <Input
                  id="a2"
                  type="number"
                  value={inputs.a2}
                  onChange={(e) => handleInputChange("a2", e.target.value)}
                  placeholder="e.g. 1"
                  aria-describedby="a2-desc"
                />
                <p id="a2-desc" className="sr-only">
                  Coefficient a2 for x in second equation
                </p>
              </div>
              <div>
                <Label htmlFor="b2">b₂ (coefficient of y)</Label>
                <Input
                  id="b2"
                  type="number"
                  value={inputs.b2}
                  onChange={(e) => handleInputChange("b2", e.target.value)}
                  placeholder="e.g. -4"
                  aria-describedby="b2-desc"
                />
                <p id="b2-desc" className="sr-only">
                  Coefficient b2 for y in second equation
                </p>
              </div>
              <div>
                <Label htmlFor="c2">c₂ (constant)</Label>
                <Input
                  id="c2"
                  type="number"
                  value={inputs.c2}
                  onChange={(e) => handleInputChange("c2", e.target.value)}
                  placeholder="e.g. 6"
                  aria-describedby="c2-desc"
                />
                <p id="c2-desc" className="sr-only">
                  Constant c2 in second equation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 border border-slate-300 dark:border-slate-700 flex flex-col justify-center">
          <CardContent>
            <Label htmlFor="method" className="mb-2 font-semibold text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Calculator className="w-5 h-5" /> Method
            </Label>
            <Select
              value={inputs.method}
              onValueChange={(value) =>
                handleInputChange("method", value as Inputs["method"])
              }
              id="method"
              aria-describedby="method-desc"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="substitution">Substitution</SelectItem>
                <SelectItem value="elimination">Elimination</SelectItem>
              </SelectContent>
            </Select>
            <p id="method-desc" className="text-sm text-slate-500 mt-1">
              Choose the method to solve the system.
            </p>
          </CardContent>
        </Card>
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
          Understanding System of Equations Solver (Substitution/Elimination)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A system of linear equations consists of two or more linear equations
          with the same set of variables. The goal is to find values for these
          variables that satisfy all equations simultaneously. This solver
          focuses on systems with two equations and two variables, typically
          represented as:
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded">
          a₁x + b₁y = c₁<br />
          a₂x + b₂y = c₂
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The substitution method involves solving one equation for one variable
          and substituting that expression into the other equation, reducing the
          system to a single-variable equation. The elimination method involves
          adding or subtracting the equations after multiplying them by suitable
          constants to eliminate one variable, allowing direct solving for the
          other variable. Both methods are fundamental techniques in algebra for
          solving linear systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool provides a professional and precise solution with results
          rounded to four decimal places, ensuring clarity and accuracy for
          educational and practical use.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Substitution Method:
1. Solve one equation for one variable, e.g. x:
   x = (c₁ - b₁y) / a₁  (if a₁ ≠ 0)
2. Substitute into the other equation:
   a₂ * x + b₂ * y = c₂
3. Solve for y, then back-substitute to find x.

Elimination Method (Cramer's Rule):
Given system:
  a₁x + b₁y = c₁
  a₂x + b₂y = c₂

Determinant:
  D = a₁ * b₂ - a₂ * b₁

If D ≠ 0,
  x = (c₁ * b₂ - c₂ * b₁) / D
  y = (a₁ * c₂ - a₂ * c₁) / D

If D = 0, system has no unique solution (either infinite or none).`}
        </pre>
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
      title="System of Equations Solver (Substitution/Elimination)"
      description="Solve systems of linear equations. Use substitution or elimination methods to find the intersection point of two lines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `Substitution and Elimination Methods for solving:
a₁x + b₁y = c₁
a₂x + b₂y = c₂`,
        variables: [
          { symbol: "x", description: "Variable x" },
          { symbol: "y", description: "Variable y" },
          { symbol: "a₁, b₁, c₁", description: "Coefficients and constant of first equation" },
          { symbol: "a₂, b₂, c₂", description: "Coefficients and constant of second equation" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Solve the system: 2x + 3y = 5 and x - 4y = 6 using substitution method.",
        steps: [
          {
            label: "1",
            explanation:
              "Solve first equation for x: x = (5 - 3y)/2.",
          },
          {
            label: "2",
            explanation:
              "Substitute x into second equation: ((5 - 3y)/2) - 4y = 6.",
          },
          {
            label: "3",
            explanation:
              "Multiply both sides by 2: 5 - 3y - 8y = 12 → -11y = 7 → y = -7/11 ≈ -0.6364.",
          },
          {
            label: "4",
            explanation:
              "Back-substitute y into x: x = (5 - 3*(-0.6364))/2 = (5 + 1.9092)/2 = 3.4546.",
          },
        ],
        result: "Solution: x ≈ 3.4546, y ≈ -0.6364",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
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