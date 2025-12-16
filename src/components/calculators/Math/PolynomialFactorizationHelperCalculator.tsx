import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sigma,
  RotateCcw,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Coefficients = {
  a: string;
  b: string;
  c: string;
};

function formatComplex(a: number, b: number): string {
  const aFixed = a.toFixed(4);
  const bFixed = Math.abs(b).toFixed(4);
  if (b === 0) return aFixed;
  if (a === 0) return `${b >= 0 ? "" : "-"}${bFixed}i`;
  return `${aFixed} ${b >= 0 ? "+" : "-"} ${bFixed}i`;
}

function gcd(a: number, b: number): number {
  if (!b) return a;
  return gcd(b, a % b);
}

function factorOutGCD(a: number, b: number, c: number): [number, number, number, number] {
  // Find gcd of a,b,c (considering integers only)
  const intA = Math.round(a * 10000);
  const intB = Math.round(b * 10000);
  const intC = Math.round(c * 10000);
  let g = gcd(Math.abs(intA), gcd(Math.abs(intB), Math.abs(intC)));
  if (g === 0) g = 1;
  // Divide by gcd and scale back
  return [a / (g / 10000), b / (g / 10000), c / (g / 10000), g / 10000];
}

export default function PolynomialFactorizationHelperCalculator() {
  const [inputs, setInputs] = useState<Coefficients>({
    a: "",
    b: "",
    c: "",
  });

  const handleInputChange = useCallback((name: keyof Coefficients, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const a = parseFloat(inputs.a);
    const b = parseFloat(inputs.b);
    const c = parseFloat(inputs.c);

    if (
      Number.isNaN(a) ||
      Number.isNaN(b) ||
      Number.isNaN(c) ||
      inputs.a.trim() === "" ||
      inputs.b.trim() === "" ||
      inputs.c.trim() === ""
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    if (a === 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Coefficient 'a' cannot be zero for a quadratic polynomial.",
        formulaUsed: "",
      };
    }

    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;

    // Factor out GCD for simpler factorization if possible (only for integer coefficients)
    // We skip this for decimals to avoid complexity.

    // Try to factor as (mx + n)(px + q)
    // For integer factorization, only if a,b,c are integers.
    const isIntegerCoeffs =
      Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c);

    if (discriminant < 0) {
      // Complex roots
      const realPart = (-b) / (2 * a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
      const root1 = formatComplex(realPart, imaginaryPart);
      const root2 = formatComplex(realPart, -imaginaryPart);
      return {
        value: `(${a}x² + ${b}x + ${c}) = ${a}(x - (${root1}))(x - (${root2}))`,
        label: "Factorization with complex roots",
        subtext:
          "The polynomial has complex conjugate roots. Factored form uses these roots.",
        warning: null,
        formulaUsed: "Quadratic Formula & Complex Roots",
      };
    }

    // discriminant >= 0
    const sqrtD = Math.sqrt(discriminant);
    const root1 = ((-b + sqrtD) / (2 * a)).toFixed(4);
    const root2 = ((-b - sqrtD) / (2 * a)).toFixed(4);

    // If roots are integers or decimals, show factorization
    // If roots are equal, show squared factor
    if (discriminant === 0) {
      return {
        value: `(${a}x² + ${b}x + ${c}) = ${a}(x - ${root1})²`,
        label: "Perfect square trinomial factorization",
        subtext: "The polynomial has one repeated root.",
        warning: null,
        formulaUsed: "Quadratic Formula (Repeated Root)",
      };
    }

    // discriminant > 0
    // Try to factor with integer roots if possible
    if (isIntegerCoeffs) {
      // Try to find integer factors of a and c that satisfy b
      // Factors of a
      const factorsA: number[] = [];
      for (let i = 1; i <= Math.abs(a); i++) {
        if (a % i === 0) {
          factorsA.push(i);
          factorsA.push(-i);
        }
      }
      // Factors of c
      const factorsC: number[] = [];
      for (let i = 1; i <= Math.abs(c); i++) {
        if (c % i === 0) {
          factorsC.push(i);
          factorsC.push(-i);
        }
      }
      for (const m of factorsA) {
        for (const n of factorsC) {
          for (const p of factorsA) {
            for (const q of factorsC) {
              if (m * q + n * p === b && m * p === a && n * q === c) {
                // Found factorization: (mx + n)(px + q)
                // Simplify factors if possible
                // Factor out gcd from each binomial
                const gcd1 = gcd(Math.abs(m), Math.abs(n));
                const gcd2 = gcd(Math.abs(p), Math.abs(q));
                const m1 = m / gcd1;
                const n1 = n / gcd1;
                const p1 = p / gcd2;
                const q1 = q / gcd2;

                const outsideGcd = gcd(gcd1, gcd2);

                // Format factors nicely
                const formatBinomial = (coefX: number, constant: number) => {
                  const coefXStr =
                    coefX === 1
                      ? "x"
                      : coefX === -1
                      ? "-x"
                      : `${coefX}x`;
                  const constantStr =
                    constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
                  return `${coefXStr}${constant === 0 ? "" : constantStr}`;
                };

                const outsideStr = outsideGcd !== 1 ? `${outsideGcd}` : "";

                return {
                  value: `${outsideStr}(${formatBinomial(m1, n1)})(${formatBinomial(
                    p1,
                    q1
                  )})`,
                  label: "Factorization with integer factors",
                  subtext:
                    "The polynomial factors into two binomials with integer coefficients.",
                  warning: null,
                  formulaUsed: "Factorization by grouping / trial",
                };
              }
            }
          }
        }
      }
    }

    // If no integer factorization found, show factorization with roots
    return {
      value: `(${a}x² + ${b}x + ${c}) = ${a}(x - ${root1})(x - ${root2})`,
      label: "Factorization with real roots",
      subtext:
        "The polynomial factors using its real roots calculated by the quadratic formula.",
      warning: null,
      formulaUsed: "Quadratic Formula",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is polynomial factorization?",
      answer:
        "Polynomial factorization is the process of expressing a polynomial as a product of its factors, which are simpler polynomials. This helps in solving equations, simplifying expressions, and understanding polynomial behavior.",
    },
    {
      question: "How do I know if a polynomial can be factored easily?",
      answer:
        "A polynomial can be factored easily if it has integer roots or can be expressed as a product of binomials with integer coefficients. Checking the discriminant and trying possible factor pairs helps determine this.",
    },
    {
      question: "What if the polynomial has complex roots?",
      answer:
        "If the polynomial's discriminant is negative, it has complex conjugate roots. The factorization then involves complex numbers and is expressed using these roots in the form (x - root1)(x - root2).",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="input-a" className="font-semibold">
            Coefficient a
          </Label>
          <Input
            id="input-a"
            type="number"
            step="any"
            placeholder="e.g. 1"
            value={inputs.a}
            onChange={(e) => handleInputChange("a", e.target.value)}
            aria-describedby="desc-a"
          />
          <p id="desc-a" className="text-xs text-slate-500 mt-1">
            Coefficient of x² (cannot be zero)
          </p>
        </div>
        <div>
          <Label htmlFor="input-b" className="font-semibold">
            Coefficient b
          </Label>
          <Input
            id="input-b"
            type="number"
            step="any"
            placeholder="e.g. -3"
            value={inputs.b}
            onChange={(e) => handleInputChange("b", e.target.value)}
            aria-describedby="desc-b"
          />
          <p id="desc-b" className="text-xs text-slate-500 mt-1">
            Coefficient of x
          </p>
        </div>
        <div>
          <Label htmlFor="input-c" className="font-semibold">
            Coefficient c
          </Label>
          <Input
            id="input-c"
            type="number"
            step="any"
            placeholder="e.g. 2"
            value={inputs.c}
            onChange={(e) => handleInputChange("c", e.target.value)}
            aria-describedby="desc-c"
          />
          <p id="desc-c" className="text-xs text-slate-500 mt-1">
            Constant term
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate polynomial factorization"
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
      {results.value && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-3xl sm:text-5xl font-extrabold text-blue-900 dark:text-white break-words">
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
          Understanding Polynomial Factorization Helper
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Polynomial factorization is a fundamental technique in algebra that
          involves expressing a polynomial as a product of simpler polynomials,
          called factors. This process simplifies solving polynomial equations,
          analyzing their roots, and understanding their behavior. The most
          common polynomials to factor are quadratics, which are polynomials of
          degree two, typically written as ax² + bx + c.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The factorization helps break down complex algebraic expressions into
          products of binomials or other polynomials, making it easier to solve
          equations or simplify expressions. This tool assists users by
          calculating the roots of the polynomial and providing the factorized
          form, including cases with real or complex roots.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether the polynomial has distinct real roots, repeated roots, or
          complex roots, the factorization helper provides clear and precise
          factorized expressions. It also warns users if the input is invalid,
          such as when the leading coefficient is zero, which would make the
          polynomial no longer quadratic.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Given a quadratic polynomial: a x² + b x + c

Discriminant: D = b² - 4 a c

Roots:
x₁ = (-b + √D) / (2a)
x₂ = (-b - √D) / (2a)

Factorization:
- If D > 0: a(x - x₁)(x - x₂)
- If D = 0: a(x - x₁)²
- If D < 0: a(x - (p + qi))(x - (p - qi)) where roots are complex conjugates`}
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
      title="Polynomial Factorization Helper"
      description="Factor polynomials efficiently. Break down algebraic expressions into their simplest factors to solve complex equations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `D = b² - 4ac
x = (-b ± √D) / 2a`,
        variables: [
          { symbol: "a", description: "Coefficient of x²" },
          { symbol: "b", description: "Coefficient of x" },
          { symbol: "c", description: "Constant term" },
          { symbol: "D", description: "Discriminant" },
          { symbol: "x", description: "Roots of the polynomial" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Factorize the polynomial 2x² - 4x - 6 into its simplest factors.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify coefficients: a = 2, b = -4, c = -6.",
          },
          {
            label: "2",
            explanation:
              "Calculate discriminant: D = (-4)² - 4 * 2 * (-6) = 16 + 48 = 64.",
          },
          {
            label: "3",
            explanation:
              "Find roots: x₁ = (4 + 8) / 4 = 3, x₂ = (4 - 8) / 4 = -1.",
          },
          {
            label: "4",
            explanation:
              "Write factorization: 2(x - 3)(x + 1).",
          },
        ],
        result: "2(x - 3)(x + 1)",
      }}
      relatedCalculators={[
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Percent of Total",
          url: "/math/percent-of-total",
          icon: "➗",
        },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
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