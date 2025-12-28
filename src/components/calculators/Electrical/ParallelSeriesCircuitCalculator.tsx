import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Plug,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Settings,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type CircuitType = "series" | "parallel";
type KnownValue = "V" | "I" | "R" | "P" | "W";

export default function ParallelSeriesCircuitCalculator() {
  const [circuitType, setCircuitType] = useState<CircuitType>("series");
  const [knownValue, setKnownValue] = useState<KnownValue>("R");
  const [inputs, setInputs] = useState({
    V: "",
    I: "",
    R: "",
    P: "",
    W: "",
  });

  // Handle input changes for each field
  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Reset other inputs when knownValue changes
  const handleKnownValueChange = (value: KnownValue) => {
    setKnownValue(value);
    setInputs({
      V: "",
      I: "",
      R: "",
      P: "",
      W: "",
    });
  };

  // Reset inputs when circuit type changes
  const handleCircuitTypeChange = (value: CircuitType) => {
    setCircuitType(value);
    setInputs({
      V: "",
      I: "",
      R: "",
      P: "",
      W: "",
    });
  };

  /**
   * Calculation logic:
   * Inputs:
   * - circuitType: series or parallel
   * - knownValue: which parameter is known (V, I, R, P, W)
   * - inputs: values for the known parameter and two resistors (R1, R2)
   *
   * Outputs:
   * - Total Voltage (Vt)
   * - Total Current (It)
   * - Total Resistance (Rt)
   * - Total Power (Pt)
   *
   * Assumptions:
   * - Two resistors in series or parallel
   * - User inputs known parameter value and resistor values
   */

  // Parse float helper with fallback NaN
  const parseInput = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? NaN : n;
  };

  // Calculate total resistance based on circuit type and resistors
  const calculateTotalResistance = (r1: number, r2: number, type: CircuitType) => {
    if (type === "series") {
      return r1 + r2;
    } else {
      // parallel
      if (r1 === 0 || r2 === 0) return 0;
      return (r1 * r2) / (r1 + r2);
    }
  };

  // Calculate total current based on known voltage and total resistance
  const calculateCurrent = (V: number, R: number) => {
    if (R === 0) return NaN;
    return V / R;
  };

  // Calculate total voltage based on current and resistance
  const calculateVoltage = (I: number, R: number) => {
    return I * R;
  };

  // Calculate power from voltage and current
  const calculatePower = (V: number, I: number) => {
    return V * I;
  };

  // Calculate power from current and resistance
  const calculatePowerFromIR = (I: number, R: number) => {
    return I * I * R;
  };

  // Calculate power from voltage and resistance
  const calculatePowerFromVR = (V: number, R: number) => {
    if (R === 0) return NaN;
    return (V * V) / R;
  };

  // Calculate missing values based on known input
  const results = useMemo(() => {
    // Parse resistor values
    const R1 = parseInput(inputs.R.split(",")[0]?.trim() || "");
    const R2 = parseInput(inputs.R.split(",")[1]?.trim() || "");

    if (isNaN(R1) || isNaN(R2) || R1 <= 0 || R2 <= 0) {
      return {
        primary: "Please enter two valid resistor values separated by a comma (e.g. 10, 20).",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    const Rt = calculateTotalResistance(R1, R2, circuitType);

    // Parse other inputs
    const V = parseInput(inputs.V);
    const I = parseInput(inputs.I);
    const P = parseInput(inputs.P);
    const W = parseInput(inputs.W);

    let Vt = NaN,
      It = NaN,
      Pt = NaN;

    // Calculate based on known value
    switch (knownValue) {
      case "V":
        if (isNaN(V)) {
          return {
            primary: "Enter a valid Voltage (V).",
            secondary: "",
            details: "",
            feedback: "",
          };
        }
        Vt = V;
        It = calculateCurrent(Vt, Rt);
        Pt = calculatePower(Vt, It);
        break;

      case "I":
        if (isNaN(I)) {
          return {
            primary: "Enter a valid Current (I).",
            secondary: "",
            details: "",
            feedback: "",
          };
        }
        It = I;
        Vt = calculateVoltage(It, Rt);
        Pt = calculatePower(Vt, It);
        break;

      case "R":
        // If knownValue is R, user inputs R1,R2, so total resistance is known
        Vt = V;
        It = I;
        Pt = P;
        // If voltage and current are given, calculate power
        if (!isNaN(V) && !isNaN(I)) {
          Pt = calculatePower(V, I);
        } else if (!isNaN(P)) {
          Pt = P;
        } else if (!isNaN(W)) {
          Pt = W;
        }
        break;

      case "P":
        if (isNaN(P)) {
          return {
            primary: "Enter a valid Power (P).",
            secondary: "",
            details: "",
            feedback: "",
          };
        }
        Pt = P;
        // Try to find V and I assuming voltage or current is unknown
        // Assume voltage is known or calculate voltage from power and resistance
        // V = sqrt(P * R)
        Vt = Math.sqrt(Pt * Rt);
        It = calculateCurrent(Vt, Rt);
        break;

      case "W":
        if (isNaN(W)) {
          return {
            primary: "Enter a valid Power (Watts).",
            secondary: "",
            details: "",
            feedback: "",
          };
        }
        Pt = W;
        Vt = Math.sqrt(Pt * Rt);
        It = calculateCurrent(Vt, Rt);
        break;

      default:
        return {
          primary: "Select a known value and enter inputs.",
          secondary: "",
          details: "",
          feedback: "",
        };
    }

    if ([Vt, It, Rt, Pt].some((v) => isNaN(v) || !isFinite(v))) {
      return {
        primary: "Calculation error: Check your inputs.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Format results nicely
    const formatNum = (n: number) =>
      n >= 1000 ? n.toFixed(2) : n >= 1 ? n.toFixed(3) : n.toExponential(3);

    const details = (
      <>
        <p>
          <strong>Total Resistance (Rt):</strong> {formatNum(Rt)} Ω
        </p>
        <p>
          <strong>Total Voltage (Vt):</strong> {formatNum(Vt)} V
        </p>
        <p>
          <strong>Total Current (It):</strong> {formatNum(It)} A
        </p>
        <p>
          <strong>Total Power (Pt):</strong> {formatNum(Pt)} W
        </p>
      </>
    );

    // Safety feedback
    let feedback = "";
    if (Pt > 1000) {
      feedback =
        "Warning: Power exceeds 1000W. Ensure components are rated appropriately.";
    } else if (It > 15) {
      feedback =
        "Warning: Current exceeds 15A. Use proper wiring and protection devices.";
    } else {
      feedback = "Calculated values are within typical safe operating ranges.";
    }

    return {
      primary: `${formatNum(Pt)} W`,
      secondary: "Total Power",
      details: details,
      feedback: feedback,
    };
  }, [inputs, circuitType, knownValue]);

  // FAQs with detailed answers
  const faqs = [
    {
      question: "What is the difference between series and parallel circuits?",
      answer:
        "In a series circuit, components are connected end-to-end, so the same current flows through each component, and the total resistance is the sum of individual resistances. In a parallel circuit, components are connected across the same voltage source, so the voltage across each component is the same, and the total resistance is less than any individual resistance. Understanding these differences is crucial for designing circuits with desired electrical properties.",
    },
    {
      question: "How do I calculate total resistance in parallel circuits?",
      answer:
        "Total resistance in parallel circuits is calculated using the formula 1/Rt = 1/R1 + 1/R2 + ... + 1/Rn. For two resistors, this simplifies to Rt = (R1 * R2) / (R1 + R2). This results in a total resistance lower than the smallest individual resistor, allowing more current to flow through the circuit compared to series configurations.",
    },
    {
      question: "Why is power important in circuit calculations?",
      answer:
        "Power represents the rate at which electrical energy is consumed or converted in a circuit, measured in watts (W). Calculating power helps ensure that components can handle the energy without overheating or damage. It also aids in energy efficiency assessments and safety compliance, preventing electrical hazards in practical applications.",
    },
    {
      question: "Can I use this calculator for circuits with more than two resistors?",
      answer:
        "This calculator is designed for two-resistor circuits in series or parallel configurations. For circuits with more than two resistors, you can calculate equivalent resistances step-by-step by combining pairs of resistors and then applying the formulas iteratively. For complex circuits, specialized software or more advanced calculators are recommended.",
    },
    {
      question: "What safety precautions should I take when working with electrical circuits?",
      answer:
        "Always ensure the power is off before assembling or modifying circuits. Use components rated for the expected voltage and current. Avoid touching live wires and use insulated tools. Follow local electrical codes and standards, and if unsure, consult a qualified electrician. Proper safety measures prevent accidents, injuries, and equipment damage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Real world example object
  const example = {
    title: "Real World Example",
    scenario:
      "You want to design a lighting circuit with two 10Ω resistors connected in parallel, powered by a 12V source. You want to find the total current, resistance, and power consumption.",
    steps: [
      {
        label: "Step 1: Identify circuit type and known values",
        explanation:
          "The circuit is parallel, with two resistors (10Ω each) and a voltage source of 12V.",
      },
      {
        label: "Step 2: Calculate total resistance",
        explanation:
          "Using the parallel formula: Rt = (10 * 10) / (10 + 10) = 5Ω.",
      },
      {
        label: "Step 3: Calculate total current",
        explanation:
          "Using Ohm's law: I = V / R = 12V / 5Ω = 2.4A total current.",
      },
      {
        label: "Step 4: Calculate total power",
        explanation:
          "Power P = V * I = 12V * 2.4A = 28.8W total power consumption.",
      },
    ],
    result:
      "The circuit will draw 2.4A current with a total resistance of 5Ω and consume 28.8W power.",
  };

  const references = [
    {
      title: "NEC Table 310.15(B)(16)",
      description:
        "National Electrical Code table for conductor ampacity ratings, essential for safe circuit design.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Ohm's Law - All About Circuits",
      description:
        "Comprehensive resource explaining Ohm's Law and its applications in electrical engineering.",
      url: "https://www.allaboutcircuits.com/textbook/direct-current/chpt-2/ohms-law/",
    },
    {
      title: "Power in Electrical Circuits - Electronics Tutorials",
      description:
        "Detailed explanation of power calculations in electrical circuits with examples.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_4.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Choose Circuit Type</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={circuitType}
            onChange={(e) => handleCircuitTypeChange(e.target.value as CircuitType)}
          >
            <option value="series">Series</option>
            <option value="parallel">Parallel</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Known Parameter</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={knownValue}
            onChange={(e) => handleKnownValueChange(e.target.value as KnownValue)}
          >
            <option value="V">Voltage (V)</option>
            <option value="I">Current (I)</option>
            <option value="R">Resistance (R1,R2)</option>
            <option value="P">Power (P)</option>
            <option value="W">Watts (W)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {knownValue === "R" && (
          <div className="space-y-2">
            <Label>
              Enter two resistor values separated by a comma (Ω) <br />
              <small className="text-slate-500 dark:text-slate-400">
                e.g. 10, 20
              </small>
            </Label>
            <Input
              type="text"
              placeholder="e.g. 10, 20"
              value={inputs.R}
              onChange={(e) => handleInputChange("R", e.target.value)}
            />
          </div>
        )}

        {knownValue !== "R" && (
          <>
            <div className="space-y-2">
              <Label>Resistor 1 (Ω)</Label>
              <Input
                type="number"
                min="0"
                step="any"
                value={inputs.R.split(",")[0]?.trim() || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const parts = inputs.R.split(",");
                  parts[0] = val;
                  handleInputChange("R", parts.join(","));
                }}
                placeholder="e.g. 10"
              />
            </div>
            <div className="space-y-2">
              <Label>Resistor 2 (Ω)</Label>
              <Input
                type="number"
                min="0"
                step="any"
                value={inputs.R.split(",")[1]?.trim() || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const parts = inputs.R.split(",");
                  parts[1] = val;
                  handleInputChange("R", parts.join(","));
                }}
                placeholder="e.g. 20"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>
                Enter known value for <strong>{knownValue}</strong>
              </Label>
              <Input
                type="number"
                min="0"
                step="any"
                value={inputs[knownValue]}
                onChange={(e) => handleInputChange(knownValue, e.target.value)}
                placeholder={`Enter ${knownValue} value`}
              />
            </div>
          </>
        )}
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
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <div className="text-xs text-slate-500 mt-2">{results.details}</div>
            <Separator className="my-4" />
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {results.feedback}
            </p>
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
            Select the circuit type: series or parallel, depending on your
            circuit configuration.
          </li>
          <li>
            Choose the known electrical parameter you have (Voltage, Current,
            Resistance, or Power).
          </li>
          <li>
            Enter the resistor values. For two resistors, separate them with a
            comma if resistance is the known parameter, or enter them
            individually otherwise.
          </li>
          <li>
            Input the value of the known parameter (e.g., voltage in volts,
            current in amperes).
          </li>
          <li>Click the Calculate button to see the total power and other results.</li>
          <li>
            Review the results and safety feedback to ensure your circuit design
            is safe and effective.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Parallel & Series Circuit Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            This calculator helps electrical engineers and hobbyists analyze simple
            circuits with two resistors connected in series or parallel. By inputting
            known parameters such as voltage, current, resistance, or power, the tool
            computes the total power consumption, total resistance, voltage, and
            current in the circuit.
          </p>
          <p>
            In series circuits, resistors are connected end-to-end, so the current
            remains constant through each resistor, and the total resistance is the
            sum of individual resistances. In parallel circuits, resistors are
            connected across the same voltage source, resulting in the same voltage
            across each resistor but different currents.
          </p>
          <p>
            Understanding these principles is essential for designing safe and
            efficient electrical systems. This calculator also provides safety
            feedback based on calculated power and current to help prevent
            overloading and potential hazards.
          </p>
          <p>
            For more complex circuits with multiple components, consider using
            advanced simulation software or consulting with a professional engineer.
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
            <strong>Warning:</strong> Always verify resistor values and circuit
            configuration before powering your circuit. Incorrect resistor values or
            wiring can cause excessive current, overheating, or component failure.
          </p>
          <p>
            Avoid exceeding the rated power and current limits of your components.
            Use fuses or circuit breakers to protect against short circuits and
            overloads.
          </p>
          <p>
            Double-check units and decimal points when entering values to prevent
            calculation errors. Remember that power ratings are critical for safety
            and efficiency.
          </p>
          <p>
            When in doubt, consult electrical codes and standards such as the NEC,
            and seek advice from qualified professionals.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
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
      title="Parallel & Series Circuit Calculator"
      description="Professional electrical calculator: Parallel & Series Circuit Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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