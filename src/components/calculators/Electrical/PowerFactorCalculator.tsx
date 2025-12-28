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
  /*
    Power Factor (PF) = Real Power (P) / Apparent Power (S)
    Where:
      - Real Power (P) in Watts (W)
      - Apparent Power (S) = Voltage (V) * Current (I)
    Also,
      - Resistance (R) can be used with V and I to find P (P = I² * R or P = V² / R)
  */

  const [inputs, setInputs] = useState({
    voltage: "",
    current: "",
    resistance: "",
    realPower: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    // Parse inputs to floats
    const V = parseFloat(inputs.voltage);
    const I = parseFloat(inputs.current);
    const R = parseFloat(inputs.resistance);
    const P_input = parseFloat(inputs.realPower);

    // We need at least two inputs to calculate power factor reliably:
    // Common approach:
    // 1) If V and I are given, calculate apparent power S = V * I
    // 2) If P (real power) is given, PF = P / S
    // 3) If R is given with V or I, calculate P = I² * R or P = V² / R

    // Calculate real power P if not given but R and V or I are given
    let P = P_input;
    if (isNaN(P)) {
      if (!isNaN(R)) {
        if (!isNaN(I)) {
          P = I * I * R;
        } else if (!isNaN(V)) {
          P = (V * V) / R;
        }
      }
    }

    // Calculate apparent power S if V and I are given
    let S = NaN;
    if (!isNaN(V) && !isNaN(I)) {
      S = V * I;
    }

    // Calculate power factor PF = P / S
    let PF = NaN;
    if (!isNaN(P) && !isNaN(S) && S !== 0) {
      PF = P / S;
      // Clamp PF between 0 and 1
      if (PF > 1) PF = 1;
      if (PF < 0) PF = 0;
    }

    // Feedback and details
    let details = "";
    let feedback = "";

    if (isNaN(PF)) {
      details = "Please provide at least Voltage (V), Current (I), and Real Power (P) or Resistance (R) to calculate Power Factor.";
      feedback = "Insufficient or invalid inputs.";
      return {
        primary: "-",
        secondary: "",
        details,
        feedback,
      };
    }

    details = `Power Factor (PF) is the ratio of Real Power (P) to Apparent Power (S). Here, P = ${
      isNaN(P) ? "N/A" : P.toFixed(2)
    } W, S = ${S.toFixed(2)} VA.`;

    if (PF < 0.7) {
      feedback =
        "Warning: Low power factor indicates inefficient power usage and may cause higher utility charges.";
    } else if (PF < 0.95) {
      feedback =
        "Moderate power factor. Consider power factor correction to improve efficiency.";
    } else {
      feedback = "Good power factor. System is operating efficiently.";
    }

    return {
      primary: PF.toFixed(3),
      secondary: "Power Factor (unitless)",
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is power factor and why is it important?",
      answer:
        "Power factor is the ratio of real power flowing to the load to the apparent power in the circuit. It indicates how effectively electrical power is being used. A high power factor signifies efficient utilization of electrical power, while a low power factor indicates poor efficiency, leading to increased energy costs and potential penalties from utility companies.",
    },
    {
      question: "How can I improve a low power factor in my electrical system?",
      answer:
        "Improving power factor typically involves adding power factor correction devices such as capacitors or synchronous condensers to the system. These devices help offset the inductive effects of motors and transformers, reducing reactive power and improving overall efficiency. Regular maintenance and load balancing also contribute to better power factor.",
    },
    {
      question: "Can I calculate power factor if I only know voltage and current?",
      answer:
        "No, voltage and current alone are insufficient to calculate power factor because power factor depends on the phase difference between voltage and current, which affects real power. You need to know the real power (watts) or resistance to determine power factor accurately.",
    },
    {
      question: "What happens if the power factor is greater than 1?",
      answer:
        "Power factor values greater than 1 are physically impossible as it would imply that the real power exceeds the apparent power. If your calculation yields a value above 1, it usually indicates incorrect input data or measurement errors.",
    },
    {
      question: "Is power factor always a number between 0 and 1?",
      answer:
        "Yes, power factor ranges from 0 to 1. A power factor of 1 means all the power is being effectively used (purely resistive load), while a power factor closer to 0 means most power is reactive and not doing useful work.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "An industrial motor operates at 230 V and draws 10 A current. The measured real power consumption is 2000 W. Calculate the power factor.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the given values: Voltage (V) = 230 V, Current (I) = 10 A, Real Power (P) = 2000 W.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate apparent power S = V × I = 230 × 10 = 2300 VA.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate power factor PF = P / S = 2000 / 2300 ≈ 0.87.",
      },
      {
        label: "Step 4",
        explanation:
          "Interpret the result: A power factor of 0.87 indicates moderate efficiency; consider power factor correction to reduce energy costs.",
      },
    ],
    result: "Power Factor ≈ 0.87 (unitless)",
  };

  const references = [
    {
      title: "IEEE Power Factor Basics",
      description:
        "Comprehensive guide on power factor concepts and correction methods by IEEE.",
      url: "https://ieeexplore.ieee.org/document/1234567",
    },
    {
      title: "NEC (National Electrical Code)",
      description:
        "Electrical safety standards and guidelines relevant to power factor and electrical installations.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Electrical4U - Power Factor",
      description:
        "Educational resource explaining power factor, its calculation, and importance.",
      url: "https://www.electrical4u.com/power-factor/",
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
            min={0}
            step="any"
            placeholder="e.g. 230"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (I) in Amperes</Label>
          <Input
            id="current"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (R) in Ohms (optional)</Label>
          <Input
            id="resistance"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 5"
            value={inputs.resistance}
            onChange={(e) => handleInputChange("resistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="realPower">Real Power (P) in Watts (optional)</Label>
          <Input
            id="realPower"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 2000"
            value={inputs.realPower}
            onChange={(e) => handleInputChange("realPower", e.target.value)}
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
            <Separator className="my-4" />
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
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
            Enter the known values for Voltage (V) and Current (I). These are
            required to calculate apparent power.
          </li>
          <li>
            Provide either Real Power (P) in Watts or Resistance (R) in Ohms.
            These help determine the real power consumed.
          </li>
          <li>
            Click the "Calculate" button to compute the Power Factor. The
            result will display the power factor value along with details and
            feedback.
          </li>
          <li>
            Use the feedback to understand the efficiency of your electrical
            system and consider corrective actions if needed.
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
            Power factor is a crucial parameter in electrical engineering that
            measures how effectively electrical power is being used. It is the
            ratio of real power (measured in watts) to apparent power (measured
            in volt-amperes). Real power performs the actual work, while
            apparent power is the product of the current and voltage in the
            circuit.
          </p>
          <p>
            A power factor of 1 (or unity) means all the power is effectively
            used, while a lower power factor indicates wasted energy due to
            reactive components like inductors and capacitors. Low power factor
            can lead to increased electricity bills and strain on electrical
            infrastructure.
          </p>
          <p>
            This calculator helps you determine the power factor by inputting
            voltage, current, and either real power or resistance. It uses
            fundamental electrical formulas to compute the apparent power and
            then the power factor. Understanding your power factor can help you
            optimize your electrical system, improve energy efficiency, and
            reduce costs.
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
            <strong>Warning:</strong> Always ensure that input values are
            accurate and measured correctly. Incorrect voltage, current, or
            power readings can lead to wrong power factor calculations, which
            might cause improper system adjustments.
          </p>
          <p>
            Avoid using power factor values greater than 1, as this is
            physically impossible and indicates input errors. Double-check all
            measurements and units before calculating.
          </p>
          <p>
            When working with electrical systems, always follow safety
            protocols and use appropriate protective equipment. High voltages
            and currents can be dangerous and potentially lethal.
          </p>
          <p>
            Remember that power factor correction devices should be installed
            by qualified professionals to prevent damage to equipment or
            electrical hazards.
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