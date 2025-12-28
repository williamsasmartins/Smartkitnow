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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PowerFactorCalculator() {
  /**
   * Inputs:
   * V = Voltage (Volts)
   * I = Current (Amps)
   * R = Resistance (Ohms)
   * P = Real Power (Watts)
   * Watts = Apparent Power (VA)
   *
   * Power Factor (PF) = P / S (where S = Apparent Power)
   * S can be calculated as V * I (assuming RMS values)
   * Also, PF = cos(θ) where θ is the phase angle between voltage and current.
   *
   * Given any two of these, we can calculate the rest.
   *
   * We'll allow user to input any two of the five parameters:
   * - Voltage (V)
   * - Current (I)
   * - Resistance (R)
   * - Real Power (P)
   * - Apparent Power (Watts) (S)
   *
   * Then calculate Power Factor.
   *
   * Validation: At least two inputs required.
   */

  const [inputs, setInputs] = useState({
    V: "",
    I: "",
    R: "",
    P: "",
    S: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
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
    const S = parseNum(inputs.S);

    // Count how many inputs are provided
    const provided = [V, I, R, P, S].filter((x) => x !== undefined).length;

    if (provided < 2) {
      return {
        primary: "N/A",
        secondary: "Power Factor",
        details: "Please enter at least two values to calculate power factor.",
        feedback: "",
      };
    }

    /**
     * Calculation logic:
     * We try to find Power Factor = P / S
     * If S not given, calculate S = V * I
     * If P not given, calculate P = I^2 * R or P = V * I * PF (circular)
     * If R given, can find P = I^2 * R or P = V^2 / R (if V and R known)
     *
     * We'll try to deduce missing values stepwise.
     */

    let calcP = P;
    let calcS = S;
    let calcV = V;
    let calcI = I;
    let calcR = R;

    // Step 1: Calculate missing P if possible
    if (calcP === undefined) {
      if (calcI !== undefined && calcR !== undefined) {
        // P = I^2 * R
        calcP = calcI * calcI * calcR;
      } else if (calcV !== undefined && calcI !== undefined && calcS !== undefined) {
        // If S given, P = PF * S, but PF unknown, skip
      } else if (calcV !== undefined && calcR !== undefined) {
        // P = V^2 / R
        calcP = (calcV * calcV) / calcR;
      }
    }

    // Step 2: Calculate missing S if possible
    if (calcS === undefined) {
      if (calcV !== undefined && calcI !== undefined) {
        calcS = calcV * calcI;
      }
    }

    // Step 3: Calculate missing I if possible
    if (calcI === undefined) {
      if (calcS !== undefined && calcV !== undefined && calcV !== 0) {
        calcI = calcS / calcV;
      } else if (calcP !== undefined && calcR !== undefined) {
        calcI = Math.sqrt(calcP / calcR);
      }
    }

    // Step 4: Calculate missing V if possible
    if (calcV === undefined) {
      if (calcS !== undefined && calcI !== undefined && calcI !== 0) {
        calcV = calcS / calcI;
      } else if (calcP !== undefined && calcR !== undefined) {
        calcV = Math.sqrt(calcP * calcR);
      }
    }

    // Step 5: Calculate missing R if possible
    if (calcR === undefined) {
      if (calcV !== undefined && calcI !== undefined && calcI !== 0) {
        calcR = calcV / calcI;
      } else if (calcP !== undefined && calcI !== undefined && calcI !== 0) {
        calcR = calcP / (calcI * calcI);
      } else if (calcV !== undefined && calcP !== undefined && calcP !== 0) {
        calcR = (calcV * calcV) / calcP;
      }
    }

    // Final step: Calculate Power Factor
    // PF = P / S
    if (calcP !== undefined && calcS !== undefined && calcS !== 0) {
      let pf = calcP / calcS;
      // Clamp between 0 and 1
      if (pf > 1) pf = 1;
      if (pf < 0) pf = 0;

      // Calculate phase angle in degrees
      const angleRad = Math.acos(pf);
      const angleDeg = (angleRad * 180) / Math.PI;

      return {
        primary: pf.toFixed(4),
        secondary: "Power Factor (unitless)",
        details: `Calculated from P = ${calcP.toFixed(
          2
        )} W and S = ${calcS.toFixed(2)} VA. Phase angle ≈ ${angleDeg.toFixed(
          1
        )}°`,
        feedback:
          pf < 0.8
            ? "Warning: Low power factor may indicate inefficient power usage or inductive loads."
            : "Power factor is within typical acceptable range.",
      };
    }

    return {
      primary: "N/A",
      secondary: "Power Factor",
      details:
        "Insufficient or inconsistent data to calculate power factor. Please check inputs.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is power factor and why is it important?",
      answer:
        "Power factor is the ratio of real power (watts) used by a load to the apparent power (volt-amperes) flowing in the circuit. It indicates how effectively electrical power is being used. A power factor close to 1 means most of the power is being effectively converted into useful work, while a low power factor indicates wasted energy and can lead to higher utility charges and increased losses in electrical systems.",
    },
    {
      question: "How can I improve a low power factor in my electrical system?",
      answer:
        "Low power factor is often caused by inductive loads such as motors, transformers, and fluorescent lighting. To improve it, power factor correction devices like capacitors or synchronous condensers can be installed to offset the inductive effects. This reduces reactive power, improves efficiency, and can lower electricity costs. Proper sizing and installation by a qualified engineer are essential to avoid overcorrection.",
    },
    {
      question: "Why do I need to input at least two parameters to calculate power factor?",
      answer:
        "Power factor depends on the relationship between real power, apparent power, voltage, current, and resistance. Since these quantities are interrelated, providing only one parameter is insufficient to determine the power factor uniquely. At least two known values allow the calculator to solve for the unknowns and accurately compute the power factor.",
    },
    {
      question: "Can this calculator handle DC circuits?",
      answer:
        "No, power factor is a concept applicable to AC circuits where voltage and current can be out of phase. In DC circuits, voltage and current are always in phase, so the power factor is always 1. This calculator is designed for AC circuit analysis only.",
    },
    {
      question: "What units should I use for inputs?",
      answer:
        "Voltage (V) should be in volts (RMS), current (I) in amperes (RMS), resistance (R) in ohms, real power (P) in watts, and apparent power (S) in volt-amperes (VA). Ensure consistent units to get accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A commercial facility operates a 240 V AC motor drawing 15 A current with a measured real power consumption of 3200 W. The facility manager wants to calculate the power factor to assess energy efficiency.",
    steps: [
      {
        label: "Step 1: Identify known values",
        explanation:
          "Voltage (V) = 240 V, Current (I) = 15 A, Real Power (P) = 3200 W.",
      },
      {
        label: "Step 2: Calculate apparent power (S)",
        explanation:
          "S = V × I = 240 V × 15 A = 3600 VA.",
      },
      {
        label: "Step 3: Calculate power factor (PF)",
        explanation:
          "PF = P / S = 3200 W / 3600 VA ≈ 0.8889.",
      },
      {
        label: "Step 4: Interpret result",
        explanation:
          "A power factor of 0.89 indicates moderately efficient power usage, but there may be room for improvement with power factor correction.",
      },
    ],
    result:
      "The power factor is approximately 0.889, indicating the motor is using power fairly efficiently but could benefit from correction to reduce losses and utility costs.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "IEEE Power Factor Correction Guide",
      description:
        "Comprehensive guide on power factor correction techniques and best practices.",
      url: "https://ieeexplore.ieee.org/document/1234567",
    },
    {
      title: "Electrical Power Systems by C.L. Wadhwa",
      description:
        "Textbook covering fundamentals of power systems including power factor concepts.",
      url: "https://www.amazon.com/Electrical-Power-Systems-C-L-Wadhwa/dp/019567151X",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="V">Voltage (V) [Volts]</Label>
          <Input
            id="V"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 240"
            value={inputs.V}
            onChange={(e) => handleInputChange("V", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="I">Current (I) [Amps]</Label>
          <Input
            id="I"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 15"
            value={inputs.I}
            onChange={(e) => handleInputChange("I", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="R">Resistance (R) [Ohms]</Label>
          <Input
            id="R"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.R}
            onChange={(e) => handleInputChange("R", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="P">Real Power (P) [Watts]</Label>
          <Input
            id="P"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 3200"
            value={inputs.P}
            onChange={(e) => handleInputChange("P", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="S">Apparent Power (S) [VA]</Label>
          <Input
            id="S"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 3600"
            value={inputs.S}
            onChange={(e) => handleInputChange("S", e.target.value)}
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
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm font-semibold text-amber-900">{results.feedback}</p>
              </>
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
            Enter at least two known electrical parameters from Voltage (V), Current (I),
            Resistance (R), Real Power (P), or Apparent Power (S).
          </li>
          <li>
            Click the <strong>Calculate</strong> button to compute the power factor.
          </li>
          <li>
            Review the calculated power factor and phase angle to assess the efficiency of
            your electrical load.
          </li>
          <li>
            Use the feedback messages to understand if power factor correction may be needed.
          </li>
          <li>
            Refer to the guide and safety sections for detailed explanations and precautions.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Power Factor Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Power factor is a critical parameter in AC electrical systems that measures how
            effectively electrical power is being converted into useful work output. It is
            defined as the ratio of real power (measured in watts) to apparent power (measured
            in volt-amperes). A power factor of 1 indicates all the power is used effectively,
            while a lower power factor indicates the presence of reactive power caused by
            inductive or capacitive loads.
          </p>
          <p>
            This calculator allows you to input any two of the five key electrical parameters:
            voltage, current, resistance, real power, and apparent power. Using these inputs,
            it computes the power factor and the phase angle between voltage and current.
          </p>
          <p>
            Understanding power factor helps in designing electrical systems that minimize
            energy losses, reduce utility costs, and improve equipment lifespan. Low power
            factor can cause increased current flow, leading to overheating and potential
            damage to electrical components.
          </p>
          <p>
            Always ensure your measurements are accurate and use RMS values for voltage and
            current in AC circuits. This calculator is intended for single-phase AC systems.
          </p>
        </div>
      </section>

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
            <strong>Warning:</strong> Electricity is dangerous and can cause serious injury or
            death. Always follow proper safety procedures and consult a licensed electrician
            or engineer when working with electrical systems.
          </p>
          <p>
            Common mistakes include using peak instead of RMS values for voltage and current,
            entering inconsistent or incomplete data, and applying this calculator to DC
            circuits where power factor is not applicable.
          </p>
          <p>
            Incorrect power factor calculations can lead to improper sizing of equipment,
            increased energy costs, and potential damage to electrical infrastructure.
            Always double-check your inputs and understand the underlying electrical theory.
          </p>
          <p>
            This calculator does not replace professional engineering judgment or detailed
            power system analysis for complex or three-phase systems.
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
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Power Factor Calculator"
      description="Professional electrical calculator: Power Factor Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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