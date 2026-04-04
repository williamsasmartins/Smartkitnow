import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sigma, Calculator, RotateCcw, Info, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function isValidNumber(value: string): boolean {
  if (!value) return false;
  // Allow numbers, decimal, optional leading +/-, no scientific notation input here
  return /^[-+]?\d*\.?\d+$/.test(value.trim());
}

function formatToScientificNotation(num: number): string {
  if (num === 0) return "0.0000 × 10^0";
  const exponent = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / Math.pow(10, exponent);
  return `${mantissa.toFixed(4)} × 10^${exponent}`;
}

function parseScientificNotation(input: string): number | null {
  // Expected format: mantissa × 10^exponent or mantissa x 10^exponent (case insensitive)
  // Allow spaces around × or x
  const regex = /^\s*([-+]?\d*\.?\d+)\s*[×xX]\s*10\^([-+]?\d+)\s*$/;
  const match = input.match(regex);
  if (!match) return null;
  const mantissa = parseFloat(match[1]);
  const exponent = parseInt(match[2], 10);
  if (isNaN(mantissa) || isNaN(exponent)) return null;
  return mantissa * Math.pow(10, exponent);
}

export default function ScientificNotationStandardFormCalculator() {
  const [inputs, setInputs] = useState({
    mode: "toScientific", // "toScientific" or "toStandard"
    standardInput: "",
    scientificInput: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { mode, standardInput, scientificInput } = inputs;

    if (mode === "toScientific") {
      if (!isValidNumber(standardInput)) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: standardInput.trim() === "" ? null : "Please enter a valid standard form number.",
          formulaUsed: "Scientific Notation Conversion",
        };
      }
      const num = Number(standardInput);
      const value = formatToScientificNotation(num);
      return {
        value,
        label: "Scientific Notation",
        subtext: `Converted from standard form number ${num.toFixed(4)}`,
        warning: null,
        formulaUsed: "Scientific Notation Conversion",
      };
    } else {
      // toStandard mode
      if (scientificInput.trim() === "") {
        return {
          value: "",
          label: "",
          subtext: "",
          warning: null,
          formulaUsed: "Standard Form Conversion",
        };
      }
      const num = parseScientificNotation(scientificInput);
      if (num === null || isNaN(num)) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning:
            "Invalid scientific notation format. Use format like 1.2345 × 10^6 (use × or x, caret ^ for exponent).",
          formulaUsed: "Standard Form Conversion",
        };
      }
      return {
        value: num.toFixed(4),
        label: "Standard Form Number",
        subtext: `Converted from scientific notation "${scientificInput.trim()}"`,
        warning: null,
        formulaUsed: "Standard Form Conversion",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is scientific notation and why is it useful?",
      answer:
        "Scientific notation is a way to express very large or very small numbers compactly using powers of ten. It simplifies calculations and improves readability by representing numbers as a product of a decimal number (mantissa) and 10 raised to an exponent. This is especially useful in scientific, engineering, and mathematical contexts.",
    },
    {
      question: "How do I convert a standard number to scientific notation?",
      answer:
        "To convert a standard number to scientific notation, move the decimal point so that only one non-zero digit remains to the left. The number of places moved becomes the exponent of 10. For example, 4500 becomes 4.5000 × 10^3. This tool automates this process for accuracy and convenience.",
    },
    {
      question: "How do I convert scientific notation back to standard form?",
      answer:
        "To convert scientific notation back to standard form, multiply the mantissa by 10 raised to the exponent. For example, 3.2000 × 10^-2 equals 0.0320. This calculator parses the notation and provides the precise decimal equivalent with four decimal places.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <Label htmlFor="mode" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Conversion Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, mode: value, standardInput: "", scientificInput: "" }))}
          id="mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select conversion mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toScientific" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Standard Form &rarr; Scientific Notation
            </SelectItem>
            <SelectItem value="toStandard" className="flex items-center gap-2">
              <FunctionSquare className="w-4 h-4" /> Scientific Notation &rarr; Standard Form
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {inputs.mode === "toScientific" && (
        <div>
          <Label htmlFor="standardInput" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
            Enter Standard Form Number
          </Label>
          <Input
            id="standardInput"
            type="text"
            placeholder="e.g., 12345.6789"
            value={inputs.standardInput}
            onChange={(e) => handleInputChange("standardInput", e.target.value)}
            spellCheck={false}
            autoComplete="off"
            inputMode="decimal"
          />
        </div>
      )}

      {inputs.mode === "toStandard" && (
        <div>
          <Label htmlFor="scientificInput" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
            Enter Scientific Notation
          </Label>
          <Input
            id="scientificInput"
            type="text"
            placeholder="e.g., 1.2345 × 10^6"
            value={inputs.scientificInput}
            onChange={(e) => handleInputChange("scientificInput", e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Format: mantissa × 10^exponent (use &quot;×&quot; or &quot;x&quot; for multiplication, caret &quot;^&quot; for exponent)
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate conversion"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs((prev) => ({
              ...prev,
              standardInput: "",
              scientificInput: "",
            }))
          }
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
          Understanding Scientific Notation &lt;=&gt; Standard Form
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Scientific notation is a standardized way of expressing very large or very small numbers by representing them as a product of a decimal number, called the mantissa, and a power of ten. This notation simplifies calculations and improves clarity when dealing with numbers that would otherwise be cumbersome to write out in full.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Standard form, on the other hand, is the conventional decimal representation of numbers. Converting between scientific notation and standard form allows mathematicians, scientists, and engineers to work flexibly with numbers depending on the context and precision required.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool facilitates seamless conversion between these two forms, ensuring accuracy and adherence to mathematical conventions such as fixed decimal precision. Whether you are simplifying data presentation or performing complex calculations, understanding and using scientific notation is essential.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, in scientific notation, the mantissa is always a number greater than or equal to 1 and less than 10, and the exponent indicates how many places the decimal point has moved from the standard form.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Standard Form to Scientific Notation:
  N = M × 10^E
  where:
    N = original number
    M = mantissa (1 ≤ |M| &lt; 10)
    E = integer exponent

Scientific Notation to Standard Form:
  N = M × 10^E
  Calculate N by multiplying mantissa M by 10 raised to exponent E.`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Scientific Notation in Physics, Chemistry, and Engineering
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Scientific notation exists because numbers in science span extreme ranges. The mass of a proton is 0.00000000000000000000000000167 kg (1.67 x 10^-27 kg). The distance from Earth to the Andromeda galaxy is 24,000,000,000,000,000,000,000 meters (2.4 x 10^22 m). Writing these in standard form is error-prone; scientific notation compresses them to a mantissa and exponent that are easy to compare and manipulate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Multiplication and division in scientific notation require working with exponents. (3 x 10^8) x (2 x 10^5) = 6 x 10^13. (4.5 x 10^9) / (1.5 x 10^3) = 3 x 10^6. Addition and subtraction require matching exponents first: (3 x 10^6) + (2 x 10^5) = (3 x 10^6) + (0.2 x 10^6) = 3.2 x 10^6. Mismatching exponents in addition is the most common scientific notation arithmetic error.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Engineering prefixes are shorthand for powers of ten: milli (10^-3), micro (10^-6), nano (10^-9), kilo (10^3), mega (10^6), giga (10^9). A 5 GHz processor runs at 5 x 10^9 cycles per second. A 100 nm semiconductor node has features 100 x 10^-9 = 10^-7 meters wide. Converting between unit prefixes — from MHz to GHz, from nm to mm — is the practical application of scientific notation arithmetic that engineers perform daily.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Significant figures interact with scientific notation to communicate measurement precision. The value 1.23 x 10^4 has three significant figures; 1.230 x 10^4 has four. Trailing zeros after the decimal point are significant; trailing zeros before the decimal in standard form may or may not be. Scientific notation removes this ambiguity completely. In any reported measurement, the number of digits in the mantissa equals the number of significant figures.
        </p>
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
      title="Scientific Notation ⇄ Standard Form"
      description="Convert numbers to Scientific Notation. Transform very large or small numbers into standard exponential form (e.g., 1.5 × 10^6)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `N = M × 10^E`,
        variables: [
          { symbol: "N", description: "Original number" },
          { symbol: "M", description: "Mantissa (1 ≤ |M| &lt; 10)" },
          { symbol: "E", description: "Integer exponent" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Convert 45000 to scientific notation and back to standard form.",
        steps: [
          {
            label: "1",
            explanation:
              "Move the decimal point in 45000 four places to the left to get 4.5000. The exponent is 4 because the decimal moved 4 places.",
          },
          {
            label: "2",
            explanation: "Write the number as 4.5000 × 10^4 in scientific notation.",
          },
          {
            label: "3",
            explanation:
              "To convert back, multiply 4.5000 by 10 raised to the 4th power, resulting in 45000.0000 in standard form.",
          },
        ],
        result: "Scientific notation: 4.5000 × 10^4; Standard form: 45000.0000",
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