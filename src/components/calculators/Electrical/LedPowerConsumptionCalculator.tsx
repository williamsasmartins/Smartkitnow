import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  BookOpen,
  AlertTriangle,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LedPowerConsumptionCalculator() {
  /*
    This calculator allows users to find the missing electrical parameter among:
    Voltage (V), Current (I), Resistance (R), Power (P), and Watts (W).
    For LED lighting, power consumption (Watts) is the main output.
    The relationships used are from Ohm's Law and Power formulas:
      V = I * R
      P = V * I
      P = I^2 * R
      P = V^2 / R
    User inputs any two known values, and the calculator computes the rest.
  */

  // Inputs: val1, val2, val3 correspond to the three inputs user can enter.
  // We'll ask user to select which parameters they are entering via dropdowns.
  // But since the template does not have Select for inputs, we'll keep it simple:
  // We'll have three inputs with dropdown selectors for parameter type.

  // To keep UI simple and per template, we'll just have three inputs with labels:
  // Input 1: Parameter type selector + value
  // Input 2: Parameter type selector + value
  // Input 3: Parameter type selector + value (optional)

  // But the template only has val1, val2, val3 as strings.
  // We'll add selects for parameter types.

  // Define parameter options:
  const paramOptions = [
    { value: "V", label: "Voltage (V)" },
    { value: "I", label: "Current (A)" },
    { value: "R", label: "Resistance (Ω)" },
    { value: "P", label: "Power (W)" },
  ];

  // State for parameter types and values:
  const [inputs, setInputs] = useState({
    param1: "V",
    val1: "",
    param2: "I",
    val2: "",
    param3: "R",
    val3: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to parse float or return NaN
  const parseNum = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) ? NaN : n;
  };

  // Calculation logic:
  // We try to find at least two valid inputs to calculate the rest.
  // If less than two inputs are valid, show error.
  // If inputs conflict or can't solve, show error.

  const results = useMemo(() => {
    // Extract inputs
    const { param1, val1, param2, val2, param3, val3 } = inputs;

    // Parse values
    const v1 = parseNum(val1);
    const v2 = parseNum(val2);
    const v3 = parseNum(val3);

    // Collect known parameters in an object
    const known: Partial<Record<"V" | "I" | "R" | "P", number>> = {};

    if (!isNaN(v1)) known[param1 as keyof typeof known] = v1;
    if (!isNaN(v2)) known[param2 as keyof typeof known] = v2;
    if (!isNaN(v3)) known[param3 as keyof typeof known] = v3;

    // Count known parameters
    const knownCount = Object.keys(known).length;

    if (knownCount < 2) {
      return {
        primary: "Enter at least two parameters",
        secondary: "",
        details: "Please provide values for at least two different parameters to calculate power consumption.",
        feedback: "",
      };
    }

    // Validate no duplicate parameters
    const paramsSet = new Set([param1, param2, param3]);
    if (paramsSet.size < (val1 !== "" ? 1 : 0) + (val2 !== "" ? 1 : 0) + (val3 !== "" ? 1 : 0)) {
      return {
        primary: "Duplicate parameters detected",
        secondary: "",
        details: "Please enter different parameters for each input to avoid conflicts.",
        feedback: "",
      };
    }

    // Calculation logic based on known parameters:
    // We want to find all: V, I, R, P

    // We'll try to solve for missing parameters using formulas:
    // P = V * I
    // V = I * R
    // P = I^2 * R
    // P = V^2 / R

    // Approach:
    // 1. If V and I known => P = V * I, R = V / I
    // 2. If V and R known => I = V / R, P = V^2 / R
    // 3. If I and R known => V = I * R, P = I^2 * R
    // 4. If P and V known => I = P / V, R = V^2 / P
    // 5. If P and I known => V = P / I, R = P / I^2
    // 6. If P and R known => I = sqrt(P / R), V = I * R

    // Extract known values:
    const V = known.V;
    const I = known.I;
    const R = known.R;
    const P = known.P;

    let calcV = V;
    let calcI = I;
    let calcR = R;
    let calcP = P;

    // Helper to check if number is positive and finite
    const validNum = (n: number | undefined): n is number =>
      typeof n === "number" && isFinite(n) && n > 0;

    // Try to solve missing parameters:
    try {
      if (validNum(V) && validNum(I)) {
        calcP = V * I;
        calcR = V / I;
      } else if (validNum(V) && validNum(R)) {
        calcI = V / R;
        calcP = (V * V) / R;
      } else if (validNum(I) && validNum(R)) {
        calcV = I * R;
        calcP = I * I * R;
      } else if (validNum(P) && validNum(V)) {
        calcI = P / V;
        calcR = (V * V) / P;
      } else if (validNum(P) && validNum(I)) {
        calcV = P / I;
        calcR = P / (I * I);
      } else if (validNum(P) && validNum(R)) {
        calcI = Math.sqrt(P / R);
        calcV = calcI * R;
      } else {
        return {
          primary: "Insufficient or incompatible inputs",
          secondary: "",
          details:
            "Unable to calculate power consumption with the given inputs. Please check your values and try again.",
          feedback: "",
        };
      }
    } catch {
      return {
        primary: "Calculation error",
        secondary: "",
        details:
          "An error occurred during calculation. Please verify your inputs and try again.",
        feedback: "",
      };
    }

    // Final validation
    if (
      !validNum(calcV) ||
      !validNum(calcI) ||
      !validNum(calcR) ||
      !validNum(calcP)
    ) {
      return {
        primary: "Invalid results",
        secondary: "",
        details:
          "Calculated values are invalid. Please check your inputs for correctness.",
        feedback: "",
      };
    }

    // Format results with units and 3 decimals
    const formatNum = (n: number) => n.toFixed(3);

    return {
      primary: `${formatNum(calcP)} W`,
      secondary: "Power Consumption",
      details: `Voltage: ${formatNum(calcV)} V | Current: ${formatNum(
        calcI
      )} A | Resistance: ${formatNum(calcR)} Ω`,
      feedback: "Ensure all inputs are accurate for reliable results.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to enter at least two parameters?",
      answer:
        "Electrical power calculations rely on relationships between voltage, current, resistance, and power. To solve for unknown values, at least two known parameters are necessary. This is because the formulas involve multiple variables, and without sufficient known data, the system is underdetermined and cannot be solved accurately.",
    },
    {
      question: "Can I use this calculator for non-LED lighting?",
      answer:
        "While this calculator is optimized for LED lighting power consumption, the underlying electrical formulas are universal. You can use it for other types of lighting or electrical loads, but keep in mind that LED drivers and fixtures often have specific characteristics that may affect actual power consumption. For precise results, consider the specific load type and driver efficiency.",
    },
    {
      question: "What units should I use for inputs?",
      answer:
        "Voltage should be entered in volts (V), current in amperes (A), resistance in ohms (Ω), and power in watts (W). Ensure consistency in units to avoid calculation errors. Using incorrect units will lead to invalid results and may cause safety hazards if used for real-world electrical design.",
    },
    {
      question: "How accurate are the calculated results?",
      answer:
        "The results are based on ideal electrical formulas assuming steady-state conditions and purely resistive loads. Real-world factors such as power factor, temperature, wiring losses, and driver efficiency can affect actual power consumption. Use these results as estimates and consult detailed specifications or measurements for critical applications.",
    },
    {
      question: "What safety precautions should I take when working with electrical circuits?",
      answer:
        "Always ensure power is disconnected before working on electrical circuits. Use appropriate personal protective equipment and tools rated for the voltage and current levels involved. Follow local electrical codes and standards, and if unsure, consult a licensed electrician. Incorrect wiring or calculations can lead to fire hazards, electric shock, or equipment damage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating power consumption for a LED lighting circuit powered by 24V DC with a known resistance of 12Ω.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the known voltage (24 V) and resistance (12 Ω) into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "The calculator computes the current using Ohm's Law: I = V / R = 24 / 12 = 2 A.",
      },
      {
        label: "Step 3",
        explanation:
          "Then, it calculates power consumption: P = V * I = 24 * 2 = 48 W.",
      },
    ],
    result:
      "The LED lighting circuit consumes approximately 48 watts of power under these conditions.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "Ohm's Law and Power Formulas",
      description:
        "Fundamental electrical formulas relating voltage, current, resistance, and power.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html",
    },
    {
      title: "LED Lighting Basics",
      description:
        "Understanding LED lighting characteristics and power consumption.",
      url: "https://www.energy.gov/energysaver/led-lighting",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input 1 */}
        <div className="space-y-2">
          <Label>Input 1 Parameter</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.param1}
            onChange={(e) => handleInputChange("param1", e.target.value)}
          >
            {paramOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Enter value"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
            min="0"
            step="any"
          />
        </div>

        {/* Input 2 */}
        <div className="space-y-2">
          <Label>Input 2 Parameter</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.param2}
            onChange={(e) => handleInputChange("param2", e.target.value)}
          >
            {paramOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Enter value"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
            min="0"
            step="any"
          />
        </div>

        {/* Input 3 (optional) */}
        <div className="space-y-2">
          <Label>Input 3 Parameter (optional)</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
            value={inputs.param3}
            onChange={(e) => handleInputChange("param3", e.target.value)}
          >
            {paramOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Enter value"
            value={inputs.val3}
            onChange={(e) => handleInputChange("val3", e.target.value)}
            min="0"
            step="any"
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
            Select the electrical parameters you know from the dropdown menus
            (Voltage, Current, Resistance, or Power).
          </li>
          <li>
            Enter the corresponding numeric values for each selected parameter.
            At least two parameters must be provided for calculation.
          </li>
          <li>
            Click the "Calculate" button to compute the LED lighting power
            consumption and related electrical values.
          </li>
          <li>
            Review the results displayed below, including power consumption in
            watts and calculated voltage, current, and resistance.
          </li>
          <li>
            Use the results to assess your LED lighting circuit design or
            energy usage.
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
            LED lighting power consumption depends primarily on the electrical
            parameters of the circuit: voltage (V), current (I), resistance (R),
            and power (P). This calculator uses fundamental electrical formulas
            derived from Ohm's Law and power equations to compute the missing
            values when at least two parameters are known.
          </p>
          <p>
            The key formulas used include:
            <ul>
              <li>V = I × R</li>
              <li>P = V × I</li>
              <li>P = I² × R</li>
              <li>P = V² / R</li>
            </ul>
            These relationships allow calculation of power consumption (watts),
            which is critical for energy efficiency assessments and electrical
            safety.
          </p>
          <p>
            When using this calculator, ensure that input values are accurate and
            consistent in units. The calculator assumes steady-state DC or RMS AC
            conditions with resistive loads typical of LED lighting circuits.
          </p>
          <p>
            Understanding these calculations helps electrical engineers and
            technicians design efficient LED lighting systems, select appropriate
            wiring and protection devices, and estimate energy costs.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity is dangerous and can cause
            serious injury or death. Always disconnect power before working on
            electrical circuits and use appropriate personal protective
            equipment.
          </p>
          <p>
            A common mistake is entering incorrect or inconsistent units, which
            leads to invalid calculations. Always verify that voltage is in
            volts, current in amperes, resistance in ohms, and power in watts.
          </p>
          <p>
            Another frequent error is providing insufficient input data. At least
            two different parameters must be known to calculate the rest accurately.
          </p>
          <p>
            Never rely solely on calculated results for final design decisions.
            Always cross-check with manufacturer specifications, NEC codes, and
            professional guidelines.
          </p>
          <p>
            Improper wiring or overloads can cause fire hazards. Ensure wiring and
            protection devices are rated for the calculated current and power.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <p className="mb-4">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold">{example.result}</p>
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