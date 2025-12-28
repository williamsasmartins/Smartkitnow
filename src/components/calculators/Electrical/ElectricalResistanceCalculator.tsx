import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  AlertTriangle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ElectricalResistanceCalculator() {
  /*
    Inputs: V (Voltage), I (Current), R (Resistance), P (Power), Watts (alias for Power)
    Logic:
      - Ohm's Law: V = I * R
      - Power formulas: P = V * I = I^2 * R = V^2 / R
    User can input any two known values among V, I, R, P.
    Calculator will compute the missing values.
    If inputs are invalid or insufficient, show feedback.
  */

  const [inputs, setInputs] = useState({
    V: "",
    I: "",
    R: "",
    P: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Helper to parse float or undefined
  const parseNum = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? undefined : n;
  };

  const results = useMemo(() => {
    const V = parseNum(inputs.V);
    const I = parseNum(inputs.I);
    const R = parseNum(inputs.R);
    const P = parseNum(inputs.P);

    // Count how many inputs are provided
    const provided = [V, I, R, P].filter((x) => x !== undefined).length;

    if (provided < 2) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter at least two known values to calculate the others.",
        feedback: "",
      };
    }

    // Validate inputs: no negative or zero values for current, resistance, power
    if (
      (I !== undefined && I <= 0) ||
      (R !== undefined && R <= 0) ||
      (P !== undefined && P <= 0)
    ) {
      return {
        primary: "-",
        secondary: "",
        details:
          "Current, Resistance, and Power must be positive numbers greater than zero.",
        feedback: "",
      };
    }

    // Calculation logic:
    // We try to solve for missing values using formulas:
    // V = I * R
    // P = V * I = I^2 * R = V^2 / R

    // We'll try to find missing values stepwise:

    let calcV = V,
      calcI = I,
      calcR = R,
      calcP = P;

    // Use known pairs to calculate missing values
    // Priority: Use formulas that don't require unknowns

    // 1) If V and I known => R = V / I, P = V * I
    if (calcV !== undefined && calcI !== undefined) {
      if (calcR === undefined) calcR = calcV / calcI;
      if (calcP === undefined) calcP = calcV * calcI;
    }

    // 2) If V and R known => I = V / R, P = V^2 / R
    if (calcV !== undefined && calcR !== undefined) {
      if (calcI === undefined) calcI = calcV / calcR;
      if (calcP === undefined) calcP = (calcV * calcV) / calcR;
    }

    // 3) If I and R known => V = I * R, P = I^2 * R
    if (calcI !== undefined && calcR !== undefined) {
      if (calcV === undefined) calcV = calcI * calcR;
      if (calcP === undefined) calcP = calcI * calcI * calcR;
    }

    // 4) If P and V known => I = P / V, R = V^2 / P
    if (calcP !== undefined && calcV !== undefined) {
      if (calcI === undefined) calcI = calcP / calcV;
      if (calcR === undefined) calcR = (calcV * calcV) / calcP;
    }

    // 5) If P and I known => V = P / I, R = P / (I^2)
    if (calcP !== undefined && calcI !== undefined) {
      if (calcV === undefined) calcV = calcP / calcI;
      if (calcR === undefined) calcR = calcP / (calcI * calcI);
    }

    // 6) If P and R known => I = sqrt(P / R), V = I * R
    if (calcP !== undefined && calcR !== undefined) {
      if (calcI === undefined) calcI = Math.sqrt(calcP / calcR);
      if (calcV === undefined && calcI !== undefined) calcV = calcI * calcR;
    }

    // After calculations, validate no NaN or negative values
    if (
      [calcV, calcI, calcR, calcP].some(
        (x) => x === undefined || isNaN(x) || x <= 0
      )
    ) {
      return {
        primary: "-",
        secondary: "",
        details:
          "The entered values are inconsistent or invalid. Please check your inputs.",
        feedback: "",
      };
    }

    // Format results to 4 decimals
    const fmt = (num: number) => num.toFixed(4);

    // We'll show Resistance as primary result (since calculator is for resistance)
    return {
      primary: fmt(calcR),
      secondary: "Ohms (Ω)",
      details: `Voltage (V): ${fmt(calcV)} V, Current (I): ${fmt(calcI)} A, Power (P): ${fmt(calcP)} W`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is electrical resistance and why is it important?",
      answer:
        "Electrical resistance is a measure of how much a material opposes the flow of electric current. It is important because it affects how much current flows through a circuit for a given voltage, impacting energy efficiency and safety. Understanding resistance helps engineers design circuits that function correctly and safely.",
    },
    {
      question: "Can I calculate resistance if I only know power and voltage?",
      answer:
        "Yes, you can calculate resistance if you know power and voltage using the formula R = V² / P. This relationship comes from combining Ohm's law and power formulas. However, ensure the values are consistent and valid to get accurate results.",
    },
    {
      question: "Why do I need to input at least two values?",
      answer:
        "At least two known electrical parameters are required to calculate the others because the formulas relate these quantities in pairs. With only one value, the system is underdetermined, and the calculator cannot solve for the missing variables.",
    },
    {
      question: "What units should I use for inputs?",
      answer:
        "Voltage (V) should be in volts, current (I) in amperes (amps), resistance (R) in ohms (Ω), and power (P) in watts (W). Using consistent units ensures accurate calculations and prevents errors.",
    },
    {
      question: "What are common mistakes when using this calculator?",
      answer:
        "Common mistakes include entering zero or negative values for current, resistance, or power, mixing units, or providing insufficient inputs. Always double-check your values and ensure they are physically meaningful to avoid incorrect results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "An engineer needs to find the resistance of a heating element when the voltage applied is 240 volts and the power rating is 1200 watts.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the known voltage (V = 240 V) and power (P = 1200 W) into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "The calculator uses the formula R = V² / P to compute resistance.",
      },
      {
        label: "Step 3",
        explanation:
          "The result shows the resistance value, which helps the engineer verify the heating element specifications.",
      },
    ],
    result:
      "The calculated resistance is 48.0000 ohms, confirming the heating element's resistance for safe and efficient operation.",
  };

  const references = [
    {
      title: "Ohm's Law - Wikipedia",
      description:
        "Comprehensive explanation of Ohm's Law and its applications in electrical engineering.",
      url: "https://en.wikipedia.org/wiki/Ohm%27s_law",
    },
    {
      title: "Electrical Power - Wikipedia",
      description:
        "Detailed information about electrical power and related formulas.",
      url: "https://en.wikipedia.org/wiki/Electric_power",
    },
    {
      title: "NEC (National Electrical Code)",
      description:
        "The NEC provides standards for safe electrical design, installation, and inspection.",
      url: "https://www.nfpa.org/nec",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voltage">Voltage (V)</Label>
          <Input
            id="voltage"
            type="number"
            min="0"
            step="any"
            placeholder="Volts"
            value={inputs.V}
            onChange={(e) => handleInputChange("V", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (I)</Label>
          <Input
            id="current"
            type="number"
            min="0"
            step="any"
            placeholder="Amperes"
            value={inputs.I}
            onChange={(e) => handleInputChange("I", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (R)</Label>
          <Input
            id="resistance"
            type="number"
            min="0"
            step="any"
            placeholder="Ohms"
            value={inputs.R}
            onChange={(e) => handleInputChange("R", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power (P) / Watts</Label>
          <Input
            id="power"
            type="number"
            min="0"
            step="any"
            placeholder="Watts"
            value={inputs.P}
            onChange={(e) => handleInputChange("P", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No explicit action needed, results update automatically
        }}
        aria-label="Calculate electrical resistance"
      >
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Enter at least two known electrical values among Voltage (V),
            Current (I), Resistance (R), or Power (P).
          </li>
          <li>
            Click the "Calculate" button to compute the missing values based on
            Ohm's Law and power formulas.
          </li>
          <li>
            Review the calculated resistance and other electrical parameters
            displayed below the button.
          </li>
          <li>
            Use the results to verify circuit design, troubleshoot issues, or
            ensure compliance with electrical standards.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Electrical Resistance Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electrical resistance is a fundamental property that quantifies how
            much a material opposes the flow of electric current. It is
            measured in ohms (Ω) and plays a critical role in circuit design,
            power distribution, and safety.
          </p>
          <p>
            This calculator uses Ohm's Law and power relationships to determine
            resistance and other electrical parameters when at least two values
            are known. Ohm's Law states that voltage (V) equals current (I)
            multiplied by resistance (R): V = I × R.
          </p>
          <p>
            Power (P), measured in watts, relates to voltage and current by P =
            V × I. Using these formulas, the calculator can solve for any
            missing value, ensuring accurate and reliable results for
            engineering and practical applications.
          </p>
          <p>
            Always ensure your inputs are in correct units and physically
            plausible to avoid errors. This tool is ideal for electrical
            engineers, technicians, and students needing quick and precise
            calculations.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Never use zero or negative values for
            current, resistance, or power as they are physically invalid and
            will produce incorrect results.
          </p>
          <p>
            Mixing units (e.g., milliamps with volts) without proper conversion
            can lead to errors. Always use standard units: volts (V), amperes
            (A), ohms (Ω), and watts (W).
          </p>
          <p>
            Providing fewer than two known values will prevent the calculator
            from solving the equations. Ensure you input at least two parameters
            to get meaningful results.
          </p>
          <p>
            This calculator assumes DC circuits or RMS values for AC circuits.
            For complex AC circuits with reactance, impedance calculations are
            required instead.
          </p>
          <p>
            Always verify calculated results with practical measurements or
            consult a qualified electrical engineer for critical applications.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
          Result: {example.result}
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Electrical Resistance Calculator"
      description="Professional electrical calculator: Electrical Resistance Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Safety & Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}