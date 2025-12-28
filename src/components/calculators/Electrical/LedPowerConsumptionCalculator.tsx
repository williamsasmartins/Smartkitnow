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

export default function LedPowerConsumptionCalculator() {
  /*
    Inputs:
    - Voltage (V) in Volts
    - Current (I) in Amperes
    - Resistance (R) in Ohms
    - Power (P) in Watts (real power)
    - Watts (W) - this is basically the same as Power, but user might want to input it directly

    The calculator will allow user to input any two known values among V, I, R, P (Watts),
    and calculate the rest.

    Formulas:
    P = V * I
    V = I * R
    P = I^2 * R
    P = V^2 / R

    We will accept inputs for any two of V, I, R, P and calculate the rest.
    If user inputs Watts directly, that is P.

    For LED lighting, power factor is usually close to 1, so P = VI is valid.

    UI:
    - Inputs for V, I, R, P (Watts)
    - User enters values in any two fields, clicks Calculate
    - Calculator computes missing values and power consumption in Watts

    Validation:
    - At least two inputs must be provided
    - Inputs must be positive numbers

    Output:
    - Voltage (V)
    - Current (I)
    - Resistance (R)
    - Power (P) in Watts

  */

  const [inputs, setInputs] = useState({
    voltage: "",
    current: "",
    resistance: "",
    power: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    // Parse inputs as floats or NaN
    const V = parseFloat(inputs.voltage);
    const I = parseFloat(inputs.current);
    const R = parseFloat(inputs.resistance);
    const P = parseFloat(inputs.power);

    // Count how many inputs are valid numbers > 0
    const knowns = [
      { key: "V", val: V },
      { key: "I", val: I },
      { key: "R", val: R },
      { key: "P", val: P },
    ].filter((x) => !isNaN(x.val) && x.val > 0);

    if (knowns.length < 2) {
      return {
        primary: "Please enter at least two valid positive values.",
        secondary: "",
        details: "",
        feedback: "Insufficient inputs to calculate.",
      };
    }

    // We'll try to solve for all variables using formulas:
    // Use known inputs to calculate missing ones

    // Initialize variables with NaN
    let voltage = V;
    let current = I;
    let resistance = R;
    let power = P;

    // Helper function to check if a variable is known (valid number > 0)
    const known = (x: number) => !isNaN(x) && x > 0;

    // Iterative approach to solve for missing variables:
    // We loop max 3 times to converge values
    for (let i = 0; i < 3; i++) {
      // Calculate power if missing and voltage & current known
      if (!known(power) && known(voltage) && known(current)) {
        power = voltage * current;
      }
      // Calculate voltage if missing and current & resistance known
      if (!known(voltage) && known(current) && known(resistance)) {
        voltage = current * resistance;
      }
      // Calculate current if missing and voltage & resistance known
      if (!known(current) && known(voltage) && known(resistance)) {
        current = voltage / resistance;
      }
      // Calculate resistance if missing and voltage & current known
      if (!known(resistance) && known(voltage) && known(current)) {
        resistance = voltage / current;
      }
      // Calculate power if missing and current & resistance known
      if (!known(power) && known(current) && known(resistance)) {
        power = current * current * resistance;
      }
      // Calculate power if missing and voltage & resistance known
      if (!known(power) && known(voltage) && known(resistance)) {
        power = (voltage * voltage) / resistance;
      }
      // Calculate voltage if missing and power & current known
      if (!known(voltage) && known(power) && known(current)) {
        voltage = power / current;
      }
      // Calculate current if missing and power & voltage known
      if (!known(current) && known(power) && known(voltage)) {
        current = power / voltage;
      }
      // Calculate resistance if missing and voltage & power known
      if (!known(resistance) && known(voltage) && known(power)) {
        resistance = (voltage * voltage) / power;
      }
      // Calculate resistance if missing and power & current known
      if (!known(resistance) && known(power) && known(current)) {
        resistance = power / (current * current);
      }
    }

    // Final validation: all values must be positive numbers
    if (
      !known(voltage) ||
      !known(current) ||
      !known(resistance) ||
      !known(power)
    ) {
      return {
        primary: "Unable to calculate all values with given inputs.",
        secondary: "",
        details:
          "Please check your inputs for consistency and ensure at least two valid values are provided.",
        feedback: "Calculation incomplete.",
      };
    }

    // Format results to 3 decimals
    const format = (num: number) => num.toFixed(3);

    return {
      primary: `${format(power)} W`,
      secondary: "Power Consumption",
      details: `Voltage: ${format(voltage)} V | Current: ${format(
        current
      )} A | Resistance: ${format(resistance)} Ω`,
      feedback: "Calculation successful.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the significance of power factor in LED lighting?",
      answer:
        "Power factor is a measure of how effectively electrical power is being used. For LED lighting, the power factor is typically close to 1, meaning most of the power is used effectively. This calculator assumes a power factor of 1 for simplicity, which is accurate for most LED drivers. However, in cases with poor power factor, actual power consumption may differ.",
    },
    {
      question: "Why do I need to input at least two values?",
      answer:
        "The calculator uses electrical formulas that relate voltage, current, resistance, and power. To solve for the unknown variables, at least two known values are required. Providing fewer than two inputs does not give enough information to calculate the rest accurately.",
    },
    {
      question: "Can I use this calculator for non-LED lighting?",
      answer:
        "While the calculator is optimized for LED lighting, the underlying electrical formulas apply to any DC or AC resistive load. However, for non-LED lighting with different power factors or complex loads, results may vary. Always consider the specific characteristics of your lighting system.",
    },
    {
      question: "How accurate are the resistance calculations?",
      answer:
        "Resistance is calculated based on the relationship between voltage and current. In LED lighting circuits, resistance may not be purely resistive due to drivers and electronics. This calculator assumes a simplified resistive model for estimation purposes, which is sufficient for most practical engineering calculations.",
    },
    {
      question: "What units should I use for inputs?",
      answer:
        "Voltage should be entered in volts (V), current in amperes (A), resistance in ohms (Ω), and power in watts (W). Ensure all inputs are positive numbers for accurate calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have an LED lighting fixture rated at 120 V and draws 0.5 A current. You want to find out its power consumption and equivalent resistance.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the known voltage value: 120 V into the Voltage field.",
      },
      {
        label: "Step 2",
        explanation:
          "Input the known current value: 0.5 A into the Current field.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the Calculate button to compute power consumption and resistance.",
      },
    ],
    result:
      "The calculator computes power consumption as 60 W and resistance as 240 Ω, helping you understand the electrical characteristics of your LED fixture.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC)",
      description:
        "The NEC provides guidelines and standards for electrical installations, including lighting circuits and power calculations.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Electrical Engineering Fundamentals",
      description:
        "A comprehensive resource on electrical circuit theory, including Ohm's Law and power calculations.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html",
    },
    {
      title: "LED Lighting Basics",
      description:
        "Understanding LED lighting technology, power consumption, and efficiency.",
      url: "https://www.energy.gov/energysaver/led-lighting",
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
            placeholder="e.g. 120"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (A)</Label>
          <Input
            id="current"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.5"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (Ω)</Label>
          <Input
            id="resistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 240"
            value={inputs.resistance}
            onChange={(e) => handleInputChange("resistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power (W)</Label>
          <Input
            id="power"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.power}
            onChange={(e) => handleInputChange("power", e.target.value)}
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
            Enter at least two known values among Voltage (V), Current (A),
            Resistance (Ω), or Power (W). You can leave the others blank.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to compute the missing
            electrical parameters.
          </li>
          <li>
            Review the results displayed, including power consumption and
            equivalent resistance.
          </li>
          <li>
            Use the results to verify your LED lighting design or troubleshoot
            electrical issues.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to LED Lighting Power Consumption Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            LED lighting systems are highly efficient and consume less power
            compared to traditional lighting. Understanding the power
            consumption is essential for designing circuits, estimating energy
            costs, and ensuring compliance with electrical codes.
          </p>
          <p>
            This calculator uses fundamental electrical formulas derived from
            Ohm's Law and power equations to compute voltage, current,
            resistance, and power consumption. By inputting any two known
            values, the calculator estimates the remaining parameters.
          </p>
          <p>
            The key formulas used include:
            <ul>
              <li>
                <strong>P = V × I</strong> (Power equals voltage times current)
              </li>
              <li>
                <strong>V = I × R</strong> (Voltage equals current times
                resistance)
              </li>
              <li>
                <strong>P = I² × R</strong> (Power equals current squared times
                resistance)
              </li>
              <li>
                <strong>P = V² / R</strong> (Power equals voltage squared divided
                by resistance)
              </li>
            </ul>
          </p>
          <p>
            For LED lighting, the power factor is generally close to 1, so the
            apparent power and real power are nearly equal. This simplifies
            calculations and makes this tool suitable for practical engineering
            use.
          </p>
          <p>
            Always ensure your inputs are accurate and consistent to get
            reliable results. Use this calculator to assist in designing safe
            and efficient LED lighting circuits.
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
            <strong>Warning:</strong> Always ensure the LED lighting circuit is
            disconnected from power before measuring or modifying electrical
            parameters to avoid electric shock or damage.
          </p>
          <p>
            A common mistake is entering inconsistent or unrealistic values,
            which can lead to incorrect calculations. For example, entering a
            voltage that does not match the current and resistance values will
            cause errors.
          </p>
          <p>
            Remember that LED drivers and electronics can introduce non-linear
            characteristics, so resistance values calculated here are
            approximations.
          </p>
          <p>
            Never exceed the rated voltage or current of your LED fixtures to
            prevent overheating, fire hazards, or premature failure.
          </p>
          <p>
            If unsure, consult a licensed electrician or electrical engineer
            before making changes to your lighting system.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">
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
      title="LED Lighting Power Consumption Calculator"
      description="Professional electrical calculator: LED Lighting Power Consumption Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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