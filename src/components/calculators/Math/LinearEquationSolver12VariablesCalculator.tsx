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

function parseNumber(value: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

function formatComplex(a: number, b: number): string {
  const aFixed = a.toFixed(4);
  const bFixed = Math.abs(b).toFixed(4);
  if (b === 0) return aFixed;
  if (a === 0) return `${bFixed}i`;
  const sign = b > 0 ? "+" : "-";
  return `${aFixed} ${sign} ${bFixed}i`;
}

export default function LinearEquationSolver12VariablesCalculator() {
  // Equation type: "1-variable" or "2-variables"
  const [equationType, setEquationType] = useState<"1-variable" | "2-variables">(
    "1-variable"
  );

  // Inputs for 1-variable: ax + b = 0
  // Inputs for 2-variables: a1x + b1y = c1 and a2x + b2y = c2
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    if (equationType === "1-variable") {
      // Parse inputs for 1-variable equation: ax + b = 0
      const a = parseNumber(inputs.a ?? "");
      const b = parseNumber(inputs.b ?? "");

      if (a === null || b === null) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: "Please enter valid numeric values for a and b.",
          formulaUsed: "x = -b / a",
        };
      }
      if (a === 0) {
        if (b === 0) {
          return {
            value: "Infinite solutions",
            label: "The equation holds for all x.",
            subtext: "",
            warning: null,
            formulaUsed: "x = any real number",
          };
        } else {
          return {
            value: "No solution",
            label: "The equation is inconsistent.",
            subtext: "",
            warning: null,
            formulaUsed: "No solution",
          };
        }
      }
      const x = (-b) / a;
      return {
        value: x.toFixed(4),
        label: "Solution for x",
        subtext: `From equation ${a}x + ${b} = 0`,
        warning: null,
        formulaUsed: "x = -b / a",
      };
    } else {
      // 2-variables system:
      // a1x + b1y = c1
      // a2x + b2y = c2
      const a1 = parseNumber(inputs.a1 ?? "");
      const b1 = parseNumber(inputs.b1 ?? "");
      const c1 = parseNumber(inputs.c1 ?? "");
      const a2 = parseNumber(inputs.a2 ?? "");
      const b2 = parseNumber(inputs.b2 ?? "");
      const c2 = parseNumber(inputs.c2 ?? "");

      if (
        [a1, b1, c1, a2, b2, c2].some((v) => v === null)
      ) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning:
            "Please enter valid numeric values for all coefficients and constants.",
          formulaUsed: "Cramer's Rule",
        };
      }

      // Calculate determinant
      const D = a1! * b2! - a2! * b1!;
      const Dx = c1! * b2! - c2! * b1!;
      const Dy = a1! * c2! - a2! * c1!;

      if (D === 0) {
        // Check if system is dependent or inconsistent
        const det1 = a1! * c2! - a2! * c1!;
        const det2 = b1! * c2! - b2! * c1!;
        if (det1 === 0 && det2 === 0) {
          return {
            value: "Infinite solutions",
            label: "The system has infinitely many solutions.",
            subtext: "",
            warning: null,
            formulaUsed: "Determinant D = 0, system dependent",
          };
        } else {
          return {
            value: "No solution",
            label: "The system is inconsistent.",
            subtext: "",
            warning: null,
            formulaUsed: "Determinant D = 0, system inconsistent",
          };
        }
      }

      // Unique solution
      const x = Dx / D;
      const y = Dy / D;

      return {
        value: `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`,
        label: "Solution for x and y",
        subtext: `From system of equations`,
        warning: null,
        formulaUsed: "Cramer's Rule",
      };
    }
  }, [inputs, equationType]);

  const faqs = [
    {
      question: "What is a linear equation with one variable?",
      answer:
        "A linear equation with one variable is an algebraic equation of the form ax + b = 0, where a and b are constants and x is the variable. The solution is the value of x that satisfies the equation, typically found by isolating x on one side.",
    },
    {
      question: "How do I solve a system of two linear equations with two variables?",
      answer:
        "To solve a system of two linear equations with two variables, you can use methods such as substitution, elimination, or Cramer's Rule. These methods find values of x and y that satisfy both equations simultaneously.",
    },
    {
      question: "What does it mean if the determinant is zero in a system of equations?",
      answer:
        "If the determinant of the coefficient matrix is zero, the system either has infinitely many solutions (dependent) or no solution (inconsistent). This means the equations are either multiples of each other or contradictory.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Equation Type Selector */}
      <div>
        <Label htmlFor="equationType" className="mb-2 inline-block font-semibold">
          Select Equation Type
        </Label>
        <Select
          value={equationType}
          onValueChange={(value) =>
            setEquationType(value as "1-variable" | "2-variables")
          }
          id="equationType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose equation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-variable">Linear Equation (1 variable)</SelectItem>
            <SelectItem value="2-variables">System of 2 Linear Equations (2 variables)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {equationType === "1-variable" && (
        <Card className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <Label htmlFor="a" className="text-right font-semibold">
              a (coefficient of x)
            </Label>
            <Input
              id="a"
              type="number"
              placeholder="e.g. 2"
              value={inputs.a ?? ""}
              onChange={(e) => handleInputChange("a", e.target.value)}
              aria-describedby="a-desc"
            />
            <span id="a-desc" className="text-sm text-slate-500 dark:text-slate-400">
              Coefficient a in ax + b = 0
            </span>

            <Label htmlFor="b" className="text-right font-semibold">
              b (constant)
            </Label>
            <Input
              id="b"
              type="number"
              placeholder="e.g. -4"
              value={inputs.b ?? ""}
              onChange={(e) => handleInputChange("b", e.target.value)}
              aria-describedby="b-desc"
            />
            <span id="b-desc" className="text-sm text-slate-500 dark:text-slate-400">
              Constant b in ax + b = 0
            </span>
          </div>
        </Card>
      )}

      {equationType === "2-variables" && (
        <Card className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <p className="font-semibold mb-2">Equation 1: a₁x + b₁y = c₁</p>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
              <Label htmlFor="a1" className="text-right font-semibold">
                a₁
              </Label>
              <Input
                id="a1"
                type="number"
                placeholder="e.g. 1"
                value={inputs.a1 ?? ""}
                onChange={(e) => handleInputChange("a1", e.target.value)}
                aria-describedby="a1-desc"
              />
              <Label htmlFor="b1" className="text-right font-semibold">
                b₁
              </Label>
              <Input
                id="b1"
                type="number"
                placeholder="e.g. 2"
                value={inputs.b1 ?? ""}
                onChange={(e) => handleInputChange("b1", e.target.value)}
                aria-describedby="b1-desc"
              />
              <Label htmlFor="c1" className="text-right font-semibold">
                c₁
              </Label>
              <Input
                id="c1"
                type="number"
                placeholder="e.g. 5"
                value={inputs.c1 ?? ""}
                onChange={(e) => handleInputChange("c1", e.target.value)}
                aria-describedby="c1-desc"
              />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Coefficients and constant for equation 1
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2">Equation 2: a₂x + b₂y = c₂</p>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
              <Label htmlFor="a2" className="text-right font-semibold">
                a₂
              </Label>
              <Input
                id="a2"
                type="number"
                placeholder="e.g. 3"
                value={inputs.a2 ?? ""}
                onChange={(e) => handleInputChange("a2", e.target.value)}
                aria-describedby="a2-desc"
              />
              <Label htmlFor="b2" className="text-right font-semibold">
                b₂
              </Label>
              <Input
                id="b2"
                type="number"
                placeholder="e.g. -1"
                value={inputs.b2 ?? ""}
                onChange={(e) => handleInputChange("b2", e.target.value)}
                aria-describedby="b2-desc"
              />
              <Label htmlFor="c2" className="text-right font-semibold">
                c₂
              </Label>
              <Input
                id="c2"
                type="number"
                placeholder="e.g. 4"
                value={inputs.c2 ?? ""}
                onChange={(e) => handleInputChange("c2", e.target.value)}
                aria-describedby="c2-desc"
              />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Coefficients and constant for equation 2
            </div>
          </div>
        </Card>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current inputs (noop but triggers useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate solution"
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
      {results.value !== "" && (
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
          Understanding Linear Equation Solver (1–2 variables)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Linear equations are algebraic expressions where each term is either a
          constant or the product of a constant and a single variable. A linear
          equation with one variable typically looks like ax + b = 0, where the
          goal is to find the value of x that satisfies the equation. When dealing
          with two variables, such as x and y, we often encounter systems of linear
          equations, which are sets of two or more equations that must be solved
          simultaneously.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Solving a single linear equation involves isolating the variable on one
          side of the equation using basic algebraic operations. For systems of
          two linear equations with two variables, methods like substitution,
          elimination, or Cramer's Rule are used to find the unique solution,
          infinite solutions, or determine if no solution exists.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver provides a professional and precise tool to find solutions
          for both single linear equations and systems of two linear equations.
          It ensures accuracy by handling edge cases such as infinite or no
          solutions and formats results with up to four decimal places for clarity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are a student, educator, or professional, this tool helps
          you quickly and reliably solve linear equations, enhancing your
          understanding and efficiency in algebraic problem-solving.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1. Single Variable Linear Equation:
   ax + b = 0
   Solution:
   x = -b / a

2. System of Two Linear Equations:
   a₁x + b₁y = c₁
   a₂x + b₂y = c₂

   Using Cramer's Rule:
   D  = a₁b₂ - a₂b₁
   Dₓ = c₁b₂ - c₂b₁
   Dᵧ = a₁c₂ - a₂c₁

   If D ≠ 0:
     x = Dₓ / D
     y = Dᵧ / D

   If D = 0:
     - Infinite solutions if system is dependent
     - No solution if system is inconsistent`}
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
      title="Linear Equation Solver (1–2 variables)"
      description="Solve linear equations with one or two variables. Find the value of X (and Y) for simple algebraic problems and systems."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `1) x = -b / a (for single variable)
2) Using Cramer's Rule for systems:
   D = a₁b₂ - a₂b₁
   x = (c₁b₂ - c₂b₁) / D
   y = (a₁c₂ - a₂c₁) / D`,
        variables: [
          { symbol: "x", description: "Variable to solve for" },
          { symbol: "y", description: "Second variable in system" },
          { symbol: "a, b, c", description: "Coefficients and constants" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Solve the system of equations:\n1) 2x + 3y = 8\n2) -x + 4y = 7",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate determinant D = (2)(4) - (-1)(3) = 8 + 3 = 11",
          },
          {
            label: "2",
            explanation:
              "Calculate Dx = (8)(4) - (7)(3) = 32 - 21 = 11",
          },
          {
            label: "3",
            explanation:
              "Calculate Dy = (2)(7) - (-1)(8) = 14 + 8 = 22",
          },
          {
            label: "4",
            explanation:
              "Calculate x = Dx / D = 11 / 11 = 1, y = Dy / D = 22 / 11 = 2",
          },
        ],
        result: "Solution: x = 1.0000, y = 2.0000",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
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