import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function OhmsLawCalculator() {
  const [inputs, setInputs] = useState({
    V: "", // Voltage in volts
    I: "", // Current in amperes
    R: "", // Resistance in ohms
    P: "", // Power in watts
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    // Parse inputs as floats or NaN
    const V = parseFloat(inputs.V);
    const I = parseFloat(inputs.I);
    const R = parseFloat(inputs.R);
    const P = parseFloat(inputs.P);

    // Count how many inputs are provided
    const provided = [V, I, R, P].filter((v) => !isNaN(v)).length;

    // We need at least two known values to calculate the others
    if (provided < 2) {
      return {
        primary: "Please enter at least two values",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Variables to hold calculated values
    let calcV: number | null = isNaN(V) ? null : V;
    let calcI: number | null = isNaN(I) ? null : I;
    let calcR: number | null = isNaN(R) ? null : R;
    let calcP: number | null = isNaN(P) ? null : P;

    // Calculation logic based on known values:
    // Ohm's Law and Power formulas:
    // V = I * R
    // P = V * I = I^2 * R = V^2 / R

    // Try to calculate missing values step by step:

    // If V and I known, calculate R and P
    if (calcV !== null && calcI !== null) {
      if (calcR === null) calcR = calcV / calcI;
      if (calcP === null) calcP = calcV * calcI;
    }
    // If V and R known, calculate I and P
    else if (calcV !== null && calcR !== null) {
      if (calcI === null) calcI = calcV / calcR;
      if (calcP === null && calcI !== null) calcP = calcV * calcI;
    }
    // If I and R known, calculate V and P
    else if (calcI !== null && calcR !== null) {
      if (calcV === null) calcV = calcI * calcR;
      if (calcP === null && calcV !== null) calcP = calcV * calcI;
    }
    // If P and V known, calculate I and R
    else if (calcP !== null && calcV !== null) {
      if (calcI === null) calcI = calcP / calcV;
      if (calcR === null && calcI !== null) calcR = calcV / calcI;
    }
    // If P and I known, calculate V and R
    else if (calcP !== null && calcI !== null) {
      if (calcV === null) calcV = calcP / calcI;
      if (calcR === null && calcV !== null) calcR = calcV / calcI;
    }
    // If P and R known, calculate I and V
    else if (calcP !== null && calcR !== null) {
      if (calcI === null) calcI = Math.sqrt(calcP / calcR);
      if (calcV === null && calcI !== null) calcV = calcI * calcR;
    }

    // Check if any value is still null or invalid
    if (
      calcV === null ||
      calcI === null ||
      calcR === null ||
      calcP === null ||
      !isFinite(calcV) ||
      !isFinite(calcI) ||
      !isFinite(calcR) ||
      !isFinite(calcP)
    ) {
      return {
        primary: "Invalid or insufficient inputs",
        secondary: "",
        details: "Please check your input values and ensure at least two valid numbers are entered.",
        feedback: "",
      };
    }

    // Format results to 4 decimal places
    const format = (num: number) => num.toFixed(4);

    return {
      primary: `V = ${format(calcV)} V, I = ${format(calcI)} A, R = ${format(calcR)} Ω, P = ${format(calcP)} W`,
      secondary: "Calculated Electrical Values",
      details:
        "Voltage (V), Current (I), Resistance (R), and Power (P) calculated using Ohm's Law and Power formulas based on your inputs.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Ohm's Law and why is it important?",
      answer:
        "Ohm's Law is a fundamental principle in electrical engineering that relates voltage (V), current (I), and resistance (R) in an electrical circuit. It states that V = I × R. This law is crucial for designing and analyzing circuits, ensuring components operate safely and efficiently by predicting how voltage, current, and resistance interact.",
    },
    {
      question: "Can I calculate power if I only know voltage and resistance?",
      answer:
        "Yes, power (P) can be calculated if voltage (V) and resistance (R) are known using the formula P = V² / R. This allows you to determine how much energy is consumed or dissipated in a circuit element, which is essential for selecting appropriate components and ensuring safety.",
    },
    {
      question: "Why do I need to input at least two values in this calculator?",
      answer:
        "Ohm's Law and power calculations require at least two known values to solve for the others because the relationships between voltage, current, resistance, and power are interdependent. With only one value, the system is underdetermined, and the calculator cannot accurately compute the missing parameters.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a resistor with a resistance of 10 ohms connected to a circuit, and the current flowing through it is 2 amperes. You want to find the voltage across the resistor and the power dissipated.",
    steps: [
      {
        label: "Step 1: Identify known values",
        explanation: "Resistance R = 10 Ω, Current I = 2 A.",
      },
      {
        label: "Step 2: Calculate voltage using Ohm's Law",
        explanation: "V = I × R = 2 A × 10 Ω = 20 V.",
      },
      {
        label: "Step 3: Calculate power dissipated",
        explanation: "P = V × I = 20 V × 2 A = 40 W.",
      },
    ],
    result: "Voltage across resistor is 20 volts, and power dissipated is 40 watts.",
  };

  const references = [
    {
      title: "Ohm's Law - Wikipedia",
      description: "Comprehensive overview of Ohm's Law and its applications.",
      url: "https://en.wikipedia.org/wiki/Ohm%27s_law",
    },
    {
      title: "Electrical Power - HyperPhysics",
      description: "Detailed explanation of electrical power formulas and concepts.",
      url: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/powcon.html",
    },
    {
      title: "NEC (National Electrical Code)",
      description: "Standard for safe electrical design, installation, and inspection.",
      url: "https://www.nfpa.org/nec",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="V">Voltage (V)</Label>
          <Input
            id="V"
            type="number"
            step="any"
            placeholder="Enter Voltage"
            value={inputs.V}
            onChange={(e) => handleInputChange("V", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="I">Current (I)</Label>
          <Input
            id="I"
            type="number"
            step="any"
            placeholder="Enter Current"
            value={inputs.I}
            onChange={(e) => handleInputChange("I", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="R">Resistance (R)</Label>
          <Input
            id="R"
            type="number"
            step="any"
            placeholder="Enter Resistance"
            value={inputs.R}
            onChange={(e) => handleInputChange("R", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="P">Power (P)</Label>
          <Input
            id="P"
            type="number"
            step="any"
            placeholder="Enter Power"
            value={inputs.P}
            onChange={(e) => handleInputChange("P", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-3xl font-extrabold text-blue-600 my-3">{results.primary}</div>
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
        <h2 className="text-2xl font-bold mb-4">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li>Enter at least two known values among Voltage (V), Current (I), Resistance (R), or Power (P).</li>
          <li>Leave the fields you want to calculate empty.</li>
          <li>Click the "Calculate" button to compute the missing electrical parameters.</li>
          <li>Review the results displayed below the button, showing all four values.</li>
          <li>Use the results to analyze or design your electrical circuit safely and accurately.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4">Complete Guide</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Ohm's Law is a cornerstone of electrical engineering, describing the relationship between voltage (V), current (I), and resistance (R) in an electrical circuit. It states that the voltage across a conductor is directly proportional to the current flowing through it, with resistance as the proportionality constant: V = I × R. This simple yet powerful formula allows engineers and technicians to analyze and design circuits by predicting how electrical quantities interact.
          </p>
          <p>
            In addition to Ohm's Law, power (P) calculations are essential for understanding energy consumption and heat dissipation in electrical components. Power can be calculated using multiple formulas depending on known values: P = V × I, P = I² × R, or P = V² / R. This calculator integrates these formulas to compute any missing parameter when at least two values are provided.
          </p>
          <p>
            Using this calculator, you can quickly determine voltage, current, resistance, or power in a circuit without manual calculations. This is especially useful for troubleshooting, designing circuits, or verifying component ratings. Remember, accurate inputs are critical for reliable results, and always consider safety margins and standards such as the National Electrical Code (NEC) when applying these calculations in real-world scenarios.
          </p>
          <p>
            This tool does not require units input because it assumes standard electrical units: volts (V), amperes (A), ohms (Ω), and watts (W). Ensure your input values are consistent with these units for correct calculations.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="font-bold text-lg mb-3">Safety & Common Mistakes</h3>
        <p>
          ⚠️ Always double-check your inputs for accuracy and ensure you enter at least two known values; otherwise, the calculator cannot compute the missing parameters. Avoid entering zero or negative values for resistance or power, as these are physically invalid and will lead to incorrect results. Remember that real circuits may have additional factors such as temperature, tolerance, and non-linear components that affect calculations. Never rely solely on calculated values for high-power or critical applications without consulting electrical codes and safety standards.
        </p>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Real World Example</h2>
        <p>{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 mt-4">
          {example.steps.map((step, idx) => (
            <li key={idx}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold">{example.result}</p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        {faqs.map((faq, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="font-semibold text-lg">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4">References & additional resources</h2>
        <ul className="list-disc pl-5 space-y-2">
          {references.map((ref, idx) => (
            <li key={idx}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <BookOpen size={16} /> {ref.title} - <span className="italic">{ref.description}</span>{" "}
                <ExternalLink size={14} />
              </a>
            </li>
          ))}
        </ul>
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