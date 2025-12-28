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

type Inputs = {
  V: string; // Voltage in volts
  I: string; // Current in amperes
  R: string; // Resistance in ohms
  P: string; // Power in watts
};

export default function OhmsLawCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    V: "",
    I: "",
    R: "",
    P: "",
  });

  const handleInputChange = (field: keyof Inputs, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Calculation logic:
   * Given any two of the four variables (V, I, R, P), calculate the other two.
   * Ohm's Law and Power formulas:
   * V = I * R
   * P = V * I = I^2 * R = V^2 / R
   *
   * We accept inputs for any 2 or more variables.
   * If less than 2 inputs, no calculation.
   * If more than 2 inputs, check consistency and calculate missing.
   */

  const results = useMemo(() => {
    // Parse inputs to numbers or NaN
    const V = parseFloat(inputs.V);
    const I = parseFloat(inputs.I);
    const R = parseFloat(inputs.R);
    const P = parseFloat(inputs.P);

    // Count how many inputs are valid numbers
    const knowns = [
      { key: "V", val: V },
      { key: "I", val: I },
      { key: "R", val: R },
      { key: "P", val: P },
    ].filter(({ val }) => !isNaN(val));

    if (knowns.length < 2) {
      return {
        primary: "Please enter at least two values.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Helper to round to 4 decimals and format
    const fmt = (num: number) => {
      if (!isFinite(num)) return "N/A";
      return Number(num.toFixed(4)).toString();
    };

    // We'll try to solve for missing variables based on known inputs:
    // Strategy:
    // 1. If V and I known: R = V/I, P = V*I
    // 2. If V and R known: I = V/R, P = V^2 / R
    // 3. If I and R known: V = I*R, P = I^2 * R
    // 4. If P and V known: I = P/V, R = V^2 / P
    // 5. If P and I known: V = P/I, R = P / I^2
    // 6. If P and R known: I = sqrt(P/R), V = I*R

    // We'll try to detect which pairs are known and calculate accordingly.

    let calcV: number | undefined = undefined;
    let calcI: number | undefined = undefined;
    let calcR: number | undefined = undefined;
    let calcP: number | undefined = undefined;

    // Assign knowns first
    if (!isNaN(V)) calcV = V;
    if (!isNaN(I)) calcI = I;
    if (!isNaN(R)) calcR = R;
    if (!isNaN(P)) calcP = P;

    // Calculation logic based on known pairs
    // We'll try to fill missing values stepwise

    // Case 1: V and I known
    if (calcV !== undefined && calcI !== undefined) {
      if (calcR === undefined) calcR = calcV / calcI;
      if (calcP === undefined) calcP = calcV * calcI;
    }
    // Case 2: V and R known
    else if (calcV !== undefined && calcR !== undefined) {
      if (calcI === undefined) calcI = calcV / calcR;
      if (calcP === undefined) calcP = (calcV * calcV) / calcR;
    }
    // Case 3: I and R known
    else if (calcI !== undefined && calcR !== undefined) {
      if (calcV === undefined) calcV = calcI * calcR;
      if (calcP === undefined) calcP = calcI * calcI * calcR;
    }
    // Case 4: P and V known
    else if (calcP !== undefined && calcV !== undefined) {
      if (calcI === undefined) calcI = calcP / calcV;
      if (calcR === undefined) calcR = (calcV * calcV) / calcP;
    }
    // Case 5: P and I known
    else if (calcP !== undefined && calcI !== undefined) {
      if (calcV === undefined) calcV = calcP / calcI;
      if (calcR === undefined) calcR = calcP / (calcI * calcI);
    }
    // Case 6: P and R known
    else if (calcP !== undefined && calcR !== undefined) {
      if (calcI === undefined) calcI = Math.sqrt(calcP / calcR);
      if (calcV === undefined && calcI !== undefined) calcV = calcI * calcR;
    } else {
      // If more than 2 inputs but no pair matched, try to solve by formulas:
      // Try to solve for missing variables if possible

      // If three known, check consistency and calculate missing
      // For example, if V, I, R known, check V ≈ I*R, P = V*I
      // If inconsistent, warn user

      // Count how many are known
      if (knowns.length === 3) {
        // Identify missing key
        const missingKey = ["V", "I", "R", "P"].find(
          (k) => !knowns.some((kn) => kn.key === k)
        );

        // Calculate missing based on known three
        switch (missingKey) {
          case "V":
            if (calcI !== undefined && calcR !== undefined)
              calcV = calcI * calcR;
            else if (calcP !== undefined && calcI !== undefined)
              calcV = calcP / calcI;
            else if (calcP !== undefined && calcR !== undefined)
              calcV = Math.sqrt(calcP * calcR);
            break;
          case "I":
            if (calcV !== undefined && calcR !== undefined)
              calcI = calcV / calcR;
            else if (calcP !== undefined && calcV !== undefined)
              calcI = calcP / calcV;
            else if (calcP !== undefined && calcR !== undefined)
              calcI = Math.sqrt(calcP / calcR);
            break;
          case "R":
            if (calcV !== undefined && calcI !== undefined)
              calcR = calcV / calcI;
            else if (calcV !== undefined && calcP !== undefined)
              calcR = (calcV * calcV) / calcP;
            else if (calcP !== undefined && calcI !== undefined)
              calcR = calcP / (calcI * calcI);
            break;
          case "P":
            if (calcV !== undefined && calcI !== undefined)
              calcP = calcV * calcI;
            else if (calcI !== undefined && calcR !== undefined)
              calcP = calcI * calcI * calcR;
            else if (calcV !== undefined && calcR !== undefined)
              calcP = (calcV * calcV) / calcR;
            break;
        }
      } else {
        return {
          primary: "Unable to calculate with given inputs.",
          secondary: "",
          details: "Please enter at least two known values.",
          feedback: "",
        };
      }
    }

    // After calculation, check for invalid or zero values
    if (
      calcV === undefined ||
      calcI === undefined ||
      calcR === undefined ||
      calcP === undefined ||
      !isFinite(calcV) ||
      !isFinite(calcI) ||
      !isFinite(calcR) ||
      !isFinite(calcP)
    ) {
      return {
        primary: "Calculation error.",
        secondary: "",
        details: "Please check your inputs for correctness.",
        feedback: "",
      };
    }

    // Consistency check: verify Ohm's law and power formulas within tolerance
    const tolerance = 0.01; // 1% tolerance
    const ohmCheck = Math.abs(calcV - calcI * calcR) / calcV;
    const powerCheck = Math.abs(calcP - calcV * calcI) / calcP;

    let feedback = "";
    if (ohmCheck > tolerance || powerCheck > tolerance) {
      feedback =
        "Warning: The inputs may be inconsistent or inaccurate. Please verify your values.";
    } else {
      feedback = "Inputs and results are consistent.";
    }

    return {
      primary: `${fmt(calcV)} V, ${fmt(calcI)} A, ${fmt(calcR)} Ω, ${fmt(calcP)} W`,
      secondary: "Voltage (V), Current (I), Resistance (R), Power (P)",
      details:
        "Calculated values based on Ohm's Law and Power formulas. Values are rounded to 4 decimals.",
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Ohm's Law and why is it important?",
      answer:
        "Ohm's Law is a fundamental principle in electrical engineering that relates voltage (V), current (I), and resistance (R) in an electrical circuit. It states that V = I × R. This law is essential for designing and analyzing electrical circuits, ensuring components operate safely and efficiently. Understanding Ohm's Law helps engineers calculate unknown values and troubleshoot circuits effectively.",
    },
    {
      question: "How do I know which values to input in the calculator?",
      answer:
        "You need to provide at least two known values among voltage (V), current (I), resistance (R), or power (P) for the calculator to compute the others. For example, if you know the voltage and resistance, you can calculate current and power. Providing more than two values can help verify consistency but may cause warnings if inputs are contradictory.",
    },
    {
      question: "Can this calculator handle AC circuits or only DC?",
      answer:
        "This calculator is designed primarily for DC circuits or purely resistive AC circuits where Ohm's Law applies directly. For AC circuits with reactive components (inductors, capacitors), impedance and phase angles must be considered, which this calculator does not handle. For such cases, specialized AC circuit analysis tools are recommended.",
    },
    {
      question: "Why does the calculator sometimes show a warning about inconsistent inputs?",
      answer:
        "If the input values do not satisfy Ohm's Law and power relationships within a small tolerance, the calculator will warn you about possible inconsistencies. This can happen if inputs are measured inaccurately, rounded, or if you entered conflicting values. Double-check your inputs to ensure they are correct and consistent.",
    },
    {
      question: "How can I use the power (P) value in calculations?",
      answer:
        "Power (P) in watts is related to voltage and current by the formula P = V × I. It can also be expressed as P = I² × R or P = V² / R. Knowing power along with one other variable allows you to calculate the remaining electrical quantities. This is useful for determining energy consumption and component ratings.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a resistor in a circuit with a voltage supply of 12 volts, and you measure the current flowing through it as 2 amperes. You want to find the resistance and power dissipated by the resistor.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the known voltage (12 V) and current (2 A) into the calculator fields.",
      },
      {
        label: "Step 2",
        explanation:
          "Click the Calculate button to compute the unknown resistance and power.",
      },
      {
        label: "Step 3",
        explanation:
          "The calculator will display resistance as 6 Ω and power as 24 W, using Ohm's Law and power formulas.",
      },
    ],
    result:
      "Resistance (R) = 6 Ω, Power (P) = 24 W. This helps you select a resistor with appropriate power rating.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC)",
      description:
        "The NEC provides standards and guidelines for electrical wiring and safety, including calculations related to current, voltage, and power.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Ohm's Law - Wikipedia",
      description:
        "Comprehensive explanation of Ohm's Law, its formulas, and applications in electrical engineering.",
      url: "https://en.wikipedia.org/wiki/Ohm%27s_law",
    },
    {
      title: "All About Circuits - Ohm's Law",
      description:
        "Educational resource explaining Ohm's Law with examples and practical applications.",
      url: "https://www.allaboutcircuits.com/textbook/direct-current/chpt-2/ohms-law/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voltage">Voltage (V) [Volts]</Label>
          <Input
            id="voltage"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 12"
            value={inputs.V}
            onChange={(e) => handleInputChange("V", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (I) [Amperes]</Label>
          <Input
            id="current"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2"
            value={inputs.I}
            onChange={(e) => handleInputChange("I", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (R) [Ohms]</Label>
          <Input
            id="resistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 6"
            value={inputs.R}
            onChange={(e) => handleInputChange("R", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power (P) [Watts]</Label>
          <Input
            id="power"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 24"
            value={inputs.P}
            onChange={(e) => handleInputChange("P", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-3xl md:text-5xl font-extrabold text-blue-600 my-3 whitespace-pre-line">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p
                className={`mt-4 text-sm font-semibold ${
                  results.feedback.startsWith("Warning")
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-green-700 dark:text-green-400"
                }`}
              >
                {results.feedback}
              </p>
            )}
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
            Current (I), Resistance (R), or Power (P) in their respective input
            fields.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to compute the missing
            values based on Ohm's Law and power formulas.
          </li>
          <li>
            Review the results displayed below the button. If a warning appears,
            double-check your inputs for accuracy and consistency.
          </li>
          <li>
            Use the calculated values to assist in circuit design, troubleshooting,
            or component selection.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Ohm's Law Calculator (V, I, R, P)
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Ohm's Law is a fundamental electrical principle that relates voltage
            (V), current (I), and resistance (R) in a circuit. It states that the
            voltage across a resistor is directly proportional to the current
            flowing through it, with resistance as the constant of proportionality:
          </p>
          <p className="text-center font-semibold text-lg">V = I × R</p>
          <p>
            Power (P), measured in watts, represents the rate at which electrical
            energy is consumed or dissipated in a circuit. It can be calculated
            using several formulas derived from Ohm's Law:
          </p>
          <ul>
            <li>P = V × I</li>
            <li>P = I² × R</li>
            <li>P = V² / R</li>
          </ul>
          <p>
            This calculator allows you to input any two known values among voltage,
            current, resistance, and power. It then computes the remaining values
            using these formulas. This is especially useful for electrical engineers,
            technicians, and hobbyists to quickly analyze circuits and ensure
            components are properly rated.
          </p>
          <p>
            Remember that Ohm's Law applies primarily to DC circuits or purely
            resistive AC circuits. For circuits with reactive components (inductors,
            capacitors), impedance and phase angles must be considered separately.
          </p>
          <Separator className="my-6" />
          <h3>Using the Calculator</h3>
          <p>
            Enter numeric values without units (the units are fixed as volts, amperes,
            ohms, and watts). You can leave unknown fields blank. After entering at
            least two values, click Calculate to see the results. If inputs are
            inconsistent, the calculator will notify you.
          </p>
          <h3>Interpreting Results</h3>
          <p>
            The results show all four electrical quantities rounded to four decimal
            places. Use these values to verify circuit parameters, select appropriate
            components, or troubleshoot issues.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Always ensure that the input values are
            accurate and consistent. Incorrect inputs can lead to misleading results,
            which may cause improper circuit design or unsafe conditions.
          </p>
          <p>
            Avoid entering contradictory values that do not satisfy Ohm's Law or power
            formulas. The calculator will warn you if inconsistencies are detected.
          </p>
          <p>
            Do not use this calculator for circuits with reactive components (like
            inductors or capacitors) without considering impedance and phase angles,
            as Ohm's Law applies only to purely resistive circuits.
          </p>
          <p>
            When working with high voltages or currents, always follow electrical
            safety standards and use appropriate protective equipment.
          </p>
          <p>
            Double-check your units and measurements before entering values to avoid
            calculation errors.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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

      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
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
      title="Ohm's Law Calculator (V, I, R, P)"
      description="Professional electrical calculator: Ohm's Law Calculator (V, I, R, P). Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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