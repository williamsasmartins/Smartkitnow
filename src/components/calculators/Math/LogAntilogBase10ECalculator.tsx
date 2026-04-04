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

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = imag.toFixed(4);
  if (imag === 0) return r;
  if (real === 0) return `${i}i`;
  const sign = imag > 0 ? "+" : "-";
  return `${r} ${sign} ${Math.abs(imag).toFixed(4)}i`;
}

export default function LogAntilogBase10ECalculator() {
  const [inputs, setInputs] = useState({
    mode: "log", // "log" or "antilog"
    base: "10", // "10" or "e"
    value: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { mode, base, value } = inputs;
    if (!value || isNaN(Number(value))) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const x = Number(value);
    let resultValue: string | number = 0;
    let label = "";
    let subtext = "";
    let warning: string | null = null;
    let formulaUsed = "";

    // Helper functions
    const log10 = (v: number) => Math.log10(v);
    const ln = (v: number) => Math.log(v);
    const pow10 = (v: number) => Math.pow(10, v);
    const powE = (v: number) => Math.exp(v);

    if (mode === "log") {
      // Logarithm mode
      if (base === "10") {
        formulaUsed = "log₁₀(x) = y where 10ʸ = x";
        if (x <= 0) {
          warning =
            "Logarithm base 10 is undefined for zero or negative numbers.";
          resultValue = "NaN";
        } else {
          resultValue = log10(x).toFixed(4);
          label = `log₁₀(${x.toFixed(4)})`;
          subtext = `Log base 10 of ${x.toFixed(4)}`;
        }
      } else {
        // base e (natural log)
        formulaUsed = "ln(x) = y where eʸ = x";
        if (x <= 0) {
          warning = "Natural logarithm (ln) is undefined for zero or negative numbers.";
          resultValue = "NaN";
        } else {
          resultValue = ln(x).toFixed(4);
          label = `ln(${x.toFixed(4)})`;
          subtext = `Natural log (base e) of ${x.toFixed(4)}`;
        }
      }
    } else {
      // Antilog mode
      if (base === "10") {
        formulaUsed = "antilog₁₀(y) = 10ʸ";
        // antilog can be any real number, but result can be complex if input is complex (not here)
        resultValue = pow10(x);
        label = `antilog₁₀(${x.toFixed(4)})`;
        subtext = `10 raised to the power ${x.toFixed(4)}`;
        resultValue = resultValue.toFixed(4);
      } else {
        // base e
        formulaUsed = "antilogₑ(y) = eʸ";
        resultValue = powE(x);
        label = `antilogₑ(${x.toFixed(4)})`;
        subtext = `e raised to the power ${x.toFixed(4)}`;
        resultValue = resultValue.toFixed(4);
      }
    }

    return {
      value: resultValue,
      label,
      subtext,
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between log base 10 and natural log (ln)?",
      answer:
        "Log base 10 (log₁₀) calculates the power to which 10 must be raised to get a number, while natural log (ln) calculates the power to which Euler's number (e ≈ 2.718) must be raised. Both are fundamental in different scientific and engineering contexts.",
    },
    {
      question: "Can I calculate logarithms of negative numbers with this calculator?",
      answer:
        "No, logarithms of zero or negative numbers are undefined in the real number system. This calculator will warn you if you input such values. Complex logarithms require advanced handling beyond this tool's scope.",
    },
    {
      question: "What does antilog mean?",
      answer:
        "Antilogarithm is the inverse operation of logarithm. For example, if log₁₀(x) = y, then antilog₁₀(y) = x. It means raising the base (10 or e) to the power of the given number.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mode" className="mb-1 flex items-center gap-1">
            Mode <FunctionSquare className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.mode}
            onValueChange={(val) => handleInputChange("mode", val)}
            id="mode"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="log">Logarithm</SelectItem>
              <SelectItem value="antilog">Antilogarithm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="base" className="mb-1 flex items-center gap-1">
            Base <Calculator className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.base}
            onValueChange={(val) => handleInputChange("base", val)}
            id="base"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select base" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Base 10</SelectItem>
              <SelectItem value="e">Base e (Natural Log)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="value" className="mb-1 flex items-center gap-1">
            Value <Info className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="value"
            type="number"
            step="any"
            placeholder="Enter value"
            value={inputs.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            aria-describedby="value-desc"
          />
          <p id="value-desc" className="text-xs text-slate-500 mt-1">
            Input number for calculation
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; useMemo handles it
          }}
          aria-label="Calculate"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mode: "log", base: "10", value: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "0" && results.value !== "" && (
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
          Understanding Log / Antilog (base 10/e) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Logarithms are the inverse operations of exponentiation, allowing us to
          determine the power to which a base number must be raised to produce a
          given value. This calculator supports logarithms and antilogarithms with
          bases 10 and e (Euler's number). Log base 10, often called the common log,
          is widely used in scientific fields such as chemistry and engineering.
          Natural logarithms (ln), with base e, are fundamental in calculus,
          physics, and growth models.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The antilogarithm is the reverse of the logarithm operation. For example,
          if log₁₀(x) = y, then antilog₁₀(y) = x. This calculator allows you to
          compute both logarithms and antilogarithms easily, providing precise
          results up to four decimal places.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Please note that logarithms of zero or negative numbers are undefined in
          the real number system, and this tool will alert you if such inputs are
          entered. For complex logarithms, specialized tools are required.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Logarithm (base 10):
  y = log₁₀(x)  ⇔  10ʸ = x

Natural Logarithm (base e):
  y = ln(x)  ⇔  eʸ = x

Antilogarithm (base 10):
  x = antilog₁₀(y) = 10ʸ

Antilogarithm (base e):
  x = antilogₑ(y) = eʸ`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Logarithms in Science, Engineering, and Finance
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Logarithms compress wide-ranging scales to human-readable numbers. The pH scale measures hydrogen ion concentration, which spans 14 powers of ten: pH = -log10([H+]). A pH of 3 (vinegar) has 10,000 times more H+ ions than pH 7 (water). Decibels measure sound intensity: dB = 10 x log10(I/I0). A 30 dB increase represents a 1000-fold increase in intensity. Richter scale earthquakes: magnitude 7 releases about 31.6 times more energy than magnitude 6, because 10^(1.5) = 31.6.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The natural logarithm (base e, where e = 2.71828) is the mathematician's preferred tool because it is the unique function where d/dx ln(x) = 1/x. Compound interest and continuous growth use the natural log: if an investment grows at rate r for time t, its value is P x e^(rt). To find how long it takes to double at 7% continuous growth: ln(2) / 0.07 = 9.9 years. This is the continuous version of the Rule of 72.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Common logarithm (base 10) makes multiplication easier by transforming it into addition: log(a x b) = log(a) + log(b). Before calculators, engineers used slide rules and log tables for this reason. Today, log base 10 is standard in signal-to-noise ratio calculations, computer science bit complexity (log2 for binary trees), and chemistry equilibrium constants. The antilog (10^x or e^x) reverses the operation, converting back from log-space to the original scale.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Information theory uses logarithm base 2 to measure information in bits. The Shannon entropy H = -sum(p x log2(p)) quantifies uncertainty in a probability distribution. A fair coin toss has entropy H = 1 bit. A loaded coin (90% heads) has H = 0.47 bits — less uncertainty, less information content. Data compression algorithms exploit this: highly predictable sequences compress more because their entropy is low.
        </p>
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
      title="Log / Antilog (base 10/e) Calculator"
      description="Calculate logarithms and antilogarithms. Solve for Log base 10 or Natural Log (ln) base e for advanced math and science."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `log₁₀(x) = y ⇔ 10ʸ = x
ln(x) = y ⇔ eʸ = x
antilog₁₀(y) = 10ʸ
antilogₑ(y) = eʸ`,
        variables: [
          { symbol: "x", description: "Input or output value" },
          { symbol: "y", description: "Logarithm or exponent value" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the natural logarithm (ln) of 20 and then find the antilog base 10 of 2.",
        steps: [
          {
            label: "1",
            explanation:
              "Select mode 'Logarithm' and base 'e'. Enter 20 as the value. The calculator computes ln(20) ≈ 2.9957.",
          },
          {
            label: "2",
            explanation:
              "Select mode 'Antilogarithm' and base '10'. Enter 2 as the value. The calculator computes 10² = 100.",
          },
        ],
        result:
          "ln(20) ≈ 2.9957 and antilog₁₀(2) = 100, demonstrating logarithm and antilogarithm calculations.",
      }}
      relatedCalculators={[
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