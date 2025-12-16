import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, Calculator, RotateCcw, Info, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function QuadraticEquationSolverCalculator() {
  const [inputs, setInputs] = useState({ a: "", b: "", c: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const a = parseFloat(inputs.a);
    const b = parseFloat(inputs.b);
    const c = parseFloat(inputs.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      return { value: "Waiting for input...", label: "Enter coefficients a, b, and c", subtext: "", warning: null, formulaUsed: null };
    }

    if (a === 0) {
      return { value: "Invalid input", label: "'a' cannot be zero", subtext: "This would be a linear equation.", warning: "Coefficient 'a' must be non-zero.", formulaUsed: null };
    }

    const discriminant = b * b - 4 * a * c;
    let root1, root2;
    let label = "";
    let subtext = "";

    if (discriminant > 0) {
      root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      label = `Two real roots: x₁ = ${root1.toFixed(4)}, x₂ = ${root2.toFixed(4)}`;
      subtext = `Discriminant (Δ) = ${discriminant}`;
    } else if (discriminant === 0) {
      root1 = -b / (2 * a);
      label = `One real root: x = ${root1.toFixed(4)}`;
      subtext = `Discriminant (Δ) = 0`;
    } else {
      const realPart = (-b / (2 * a)).toFixed(4);
      const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
      label = `Two complex roots: ${realPart} ± ${imaginaryPart}i`;
      subtext = `Discriminant (Δ) = ${discriminant}`;
    }

    return {
      value: discriminant >= 0 ? "Roots Found" : "Complex Roots",
      label: label,
      subtext: subtext,
      warning: null,
      formulaUsed: "Quadratic Formula: x = (-b ± √Δ) / 2a"
    };
  }, [inputs]);

  const faqs = [
    { question: "What is the discriminant?", answer: "The discriminant is the part of the quadratic formula under the square root (b² - 4ac). It tells you how many solutions exist and whether they are real or complex numbers." },
    { question: "Can 'a' be zero?", answer: "No. If 'a' is zero, the equation becomes linear (bx + c = 0) and is no longer a quadratic equation." },
    { question: "What are complex roots?", answer: "When the discriminant is negative, the square root yields an imaginary number. The solution involves 'i', representing the square root of -1." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>a (x²)</Label>
          <Input type="number" value={inputs.a} onChange={(e) => handleInputChange("a", e.target.value)} placeholder="1" />
        </div>
        <div>
          <Label>b (x)</Label>
          <Input type="number" value={inputs.b} onChange={(e) => handleInputChange("b", e.target.value)} placeholder="-3" />
        </div>
        <div>
          <Label>c (constant)</Label>
          <Input type="number" value={inputs.c} onChange={(e) => handleInputChange("c", e.target.value)} placeholder="2" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({ a: "", b: "", c: "" })} className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== "Waiting for input..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed}</p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white break-words">{results.label}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.subtext}</p>
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left justify-center">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Quadratic Equations</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A quadratic equation is a polynomial equation of degree two, generally written in the form ax² + bx + c = 0. These equations appear frequently in physics, engineering, and geometric optimization problems.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The most reliable method to solve quadratics is the Quadratic Formula:
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          x = (-b ± √(b² - 4ac)) / 2a
        </pre>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          {/* FIX: Usando &gt; e &lt; ao invés dos símbolos diretos */}
          Here, the discriminant Δ = b² - 4ac determines the nature of the roots. If Δ &gt; 0, two distinct real roots exist; if Δ = 0, one repeated real root; and if Δ &lt; 0, two complex conjugate roots.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Quadratic Equation Solver"
      description="Solve quadratic equations (ax² + bx + c = 0) instantly. Finds real and complex roots using the quadratic formula."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Quadratic Formula",
        formula: "x = (-b ± √Δ) / 2a",
        variables: [{ symbol: "Δ", description: "Discriminant (b² - 4ac)" }]
      }}
      example={{
        title: "Example: x² - 3x + 2 = 0",
        scenario: "Here a=1, b=-3, c=2.",
        steps: [
          { label: "Discriminant", explanation: "(-3)² - 4(1)(2) = 9 - 8 = 1" },
          { label: "Roots", explanation: "x = (3 ± 1) / 2 → x₁ = 2, x₂ = 1" }
        ],
        result: "Roots are 2 and 1."
      }}
      relatedCalculators={[]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" }
      ]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
