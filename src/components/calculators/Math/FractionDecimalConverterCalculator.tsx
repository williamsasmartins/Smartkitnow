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
// SAFE ICONS ONLY
import {
  Sigma,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function gcd(a: number, b: number): number {
  // Greatest Common Divisor using Euclidean algorithm
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function decimalToFraction(decimal: number): { numerator: number; denominator: number } {
  // Convert decimal to fraction using continued fraction method or simple approach
  // Here, we limit denominator to max 10000 for simplicity
  const tolerance = 1.0e-8;
  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1;
  let b = decimal;
  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance && k1 < 10000);
  return { numerator: h1, denominator: k1 };
}

export default function FractionDecimalConverterCalculator() {
  // Inputs: mode (fraction to decimal or decimal to fraction), numerator, denominator, decimalValue
  const [inputs, setInputs] = useState<{
    mode: "fractionToDecimal" | "decimalToFraction";
    numerator: string;
    denominator: string;
    decimalValue: string;
  }>({
    mode: "fractionToDecimal",
    numerator: "",
    denominator: "",
    decimalValue: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    if (inputs.mode === "fractionToDecimal") {
      // Validate numerator and denominator
      const num = parseFloat(inputs.numerator);
      const den = parseFloat(inputs.denominator);
      if (isNaN(num) || isNaN(den)) {
        return {
          value: "Enter valid numbers",
          label: "Invalid input",
          subtext: "",
          warning: "Numerator and denominator must be valid numbers.",
          formulaUsed: "Decimal = Numerator ÷ Denominator",
        };
      }
      if (den === 0) {
        return {
          value: "Undefined",
          label: "Denominator cannot be zero",
          subtext: "",
          warning: "Division by zero is undefined.",
          formulaUsed: "Decimal = Numerator ÷ Denominator",
        };
      }
      const decimal = num / den;
      return {
        value: decimal.toFixed(4),
        label: `Decimal representation of ${num}/${den}`,
        subtext: "Rounded to 4 decimal places",
        warning: null,
        formulaUsed: "Decimal = Numerator ÷ Denominator",
      };
    } else {
      // decimalToFraction mode
      const dec = parseFloat(inputs.decimalValue);
      if (isNaN(dec)) {
        return {
          value: "Enter valid decimal",
          label: "Invalid input",
          subtext: "",
          warning: "Please enter a valid decimal number.",
          formulaUsed: "Fraction ≈ Decimal converted to fraction",
        };
      }
      // Handle negative decimals
      const sign = dec < 0 ? -1 : 1;
      const absDec = Math.abs(dec);
      // Convert decimal to fraction
      const { numerator, denominator } = decimalToFraction(absDec);
      const finalNum = numerator * sign;
      // Simplify fraction
      const divisor = gcd(finalNum, denominator);
      const simpNum = finalNum / divisor;
      const simpDen = denominator / divisor;
      return {
        value: `${simpNum}/${simpDen}`,
        label: `Fraction approximation of ${dec.toFixed(4)}`,
        subtext: "Fraction in simplest form",
        warning: null,
        formulaUsed: "Fraction ≈ Decimal converted to fraction",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the decimal to fraction conversion?",
      answer:
        "The decimal to fraction conversion uses an algorithm that approximates the decimal to a fraction with a denominator up to 10,000. This ensures a balance between accuracy and simplicity. While most decimals convert precisely, some repeating or irrational decimals may only be approximated. The result is always simplified to its lowest terms for clarity.",
    },
    {
      question: "Why can't the denominator be zero in a fraction?",
      answer:
        "A denominator of zero is undefined in mathematics because division by zero has no meaning. It leads to contradictions and breaks the fundamental rules of arithmetic. Therefore, any fraction with a zero denominator is invalid and cannot be converted to a decimal or any other form.",
    },
    {
      question: "Can this converter handle negative fractions and decimals?",
      answer:
        "Yes, the converter supports negative values for both fractions and decimals. Negative signs are preserved in the output, ensuring the mathematical sign is correctly represented. This allows users to convert values like -3/4 to -0.75 and vice versa without loss of information.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div>
        <Label htmlFor="mode" className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block">
          Conversion Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, mode: val as any }))}
          id="mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select conversion mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fractionToDecimal">Fraction to Decimal</SelectItem>
            <SelectItem value="decimalToFraction">Decimal to Fraction</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs Section */}
      {inputs.mode === "fractionToDecimal" ? (
        <>
          <div>
            <Label htmlFor="numerator" className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block">
              Numerator
            </Label>
            <Input
              id="numerator"
              type="text"
              inputMode="decimal"
              value={inputs.numerator}
              onChange={(e) => handleInputChange("numerator", e.target.value)}
              placeholder="Enter numerator (e.g., 3)"
              aria-describedby="numerator-desc"
            />
            <p id="numerator-desc" className="text-sm text-slate-500 mt-1">
              Integer or decimal numerator of the fraction.
            </p>
          </div>
          <div>
            <Label htmlFor="denominator" className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block">
              Denominator
            </Label>
            <Input
              id="denominator"
              type="text"
              inputMode="decimal"
              value={inputs.denominator}
              onChange={(e) => handleInputChange("denominator", e.target.value)}
              placeholder="Enter denominator (e.g., 4)"
              aria-describedby="denominator-desc"
            />
            <p id="denominator-desc" className="text-sm text-slate-500 mt-1">
              Integer or decimal denominator of the fraction (cannot be zero).
            </p>
          </div>
        </>
      ) : (
        <div>
          <Label htmlFor="decimalValue" className="text-slate-700 dark:text-slate-300 font-semibold mb-2 block">
            Decimal Value
          </Label>
          <Input
            id="decimalValue"
            type="text"
            inputMode="decimal"
            value={inputs.decimalValue}
            onChange={(e) => handleInputChange("decimalValue", e.target.value)}
            placeholder="Enter decimal (e.g., 0.75)"
            aria-describedby="decimal-desc"
          />
          <p id="decimal-desc" className="text-sm text-slate-500 mt-1">
            Decimal number to convert into a fraction.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate conversion"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mode: "fractionToDecimal",
              numerator: "",
              denominator: "",
              decimalValue: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Enter valid numbers" &&
      results.value !== "Enter valid decimal" &&
      results.value !== 0 &&
      results.value !== "" ? (
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
              <strong>Math Tip:</strong> Always double-check your input to avoid division by zero or invalid decimals, ensuring accurate conversions.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Fraction ⇄ Decimal Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Fraction ⇄ Decimal Converter is a precise mathematical tool designed to seamlessly transform fractions into their decimal equivalents and vice versa. This conversion is fundamental in various fields such as engineering, finance, and education, where understanding numerical representations in different formats is essential. By providing accurate and simplified outputs, this converter aids in enhancing numerical literacy and computational efficiency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fractions represent parts of a whole using two integers: a numerator and a denominator. Decimals, on the other hand, express numbers in base-10 notation, which is often more intuitive for calculations and comparisons. This converter bridges these two representations, ensuring users can work fluidly between fractional and decimal forms without losing precision or clarity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are a student learning basic arithmetic or a professional requiring exact conversions, this tool provides a reliable and user-friendly interface. It also handles edge cases such as negative numbers and invalid inputs gracefully, ensuring robust performance in diverse scenarios.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the fundamental relationship between fractions and decimals. A fraction is defined as the division of the numerator by the denominator, while a decimal is a base-10 representation of a number. Converting a fraction to a decimal involves straightforward division, whereas converting a decimal to a fraction requires approximation and simplification.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Decimal = Numerator ÷ Denominator

Fraction ≈ Decimal converted to fraction by finding numerator and denominator such that:

Decimal ≈ numerator / denominator

where numerator and denominator are integers with gcd(numerator, denominator) = 1 (simplest form).`}
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
              href="https://math.libretexts.org/Bookshelves/Precalculus/Book%3A_Precalculus_(OpenStax)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering fractions, decimals, and number theory.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/arithmetic/fraction-arithmetic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Fractions and Decimals
            </a>
            <p className="text-slate-500 text-sm">Detailed tutorials and exercises on converting fractions to decimals and vice versa.</p>
          </li>
          <li className="block">
            <a
              href="https://mathworld.wolfram.com/Fraction.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Wolfram MathWorld - Fraction
            </a>
            <p className="text-slate-500 text-sm">Authoritative resource on the mathematical properties and applications of fractions.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fraction ⇄ Decimal Converter"
      description="Convert fractions to decimals and vice versa. Instantly transform 1/4 to 0.25 or any decimal back into its simplest fraction form."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: `Decimal = Numerator ÷ Denominator

Fraction ≈ Decimal converted to fraction by approximation and simplification`,
        variables: [
          { symbol: "Numerator", description: "Top part of the fraction" },
          { symbol: "Denominator", description: "Bottom part of the fraction (≠ 0)" },
          { symbol: "Decimal", description: "Decimal representation of the fraction" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario: "Convert the fraction 3/8 to a decimal and the decimal 0.625 to a fraction.",
        steps: [
          {
            label: "1",
            explanation:
              "To convert 3/8 to decimal, divide numerator by denominator: 3 ÷ 8 = 0.375.",
          },
          {
            label: "2",
            explanation:
              "To convert 0.625 to fraction, approximate as 625/1000 and simplify by dividing numerator and denominator by 125, resulting in 5/8.",
          },
        ],
        result: "3/8 = 0.375 and 0.625 ≈ 5/8",
      }}
      relatedCalculators={[
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fraction ⇄ Decimal Converter" },
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