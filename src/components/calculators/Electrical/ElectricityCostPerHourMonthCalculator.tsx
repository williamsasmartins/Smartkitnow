import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ElectricityCostPerHourMonthCalculator() {
  /*
    Inputs:
    - Voltage (V) [Volts]
    - Current (I) [Amps]
    - Resistance (R) [Ohms]
    - Power (P) [Watts]
    - Cost per kWh [$/kWh]

    User can input any two or more of V, I, R, P to calculate missing values.
    Then, calculate cost per hour and per month (assuming 30 days, 24 hours/day).

    Formulas:
    P = V * I
    V = I * R
    P = I^2 * R
    P = V^2 / R

    Cost per hour = (P in kW) * cost per kWh
    Cost per month = cost per hour * 24 * 30
  */

  const [inputs, setInputs] = useState({
    voltage: "", // V
    current: "", // I
    resistance: "", // R
    power: "", // P Watts
    costPerKwh: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const parsedInputs = useMemo(() => {
    return {
      voltage: parseFloat(inputs.voltage),
      current: parseFloat(inputs.current),
      resistance: parseFloat(inputs.resistance),
      power: parseFloat(inputs.power),
      costPerKwh: parseFloat(inputs.costPerKwh),
    };
  }, [inputs]);

  const results = useMemo(() => {
    const { voltage, current, resistance, power, costPerKwh } = parsedInputs;

    // Count how many inputs are valid numbers
    const knowns = [
      !isNaN(voltage),
      !isNaN(current),
      !isNaN(resistance),
      !isNaN(power),
    ].filter(Boolean).length;

    // We need at least two known electrical parameters (V, I, R, P) to calculate the rest
    if (knowns < 2) {
      return {
        primary: "Please enter at least two of Voltage (V), Current (I), Resistance (R), or Power (P).",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate missing electrical parameters using formulas
    // We'll try to calculate power first if missing
    let V = voltage;
    let I = current;
    let R = resistance;
    let P = power;

    // Calculate missing power if possible
    if (isNaN(P)) {
      if (!isNaN(V) && !isNaN(I)) {
        P = V * I;
      } else if (!isNaN(I) && !isNaN(R)) {
        P = I * I * R;
      } else if (!isNaN(V) && !isNaN(R)) {
        P = (V * V) / R;
      }
    }

    // Calculate missing voltage if possible
    if (isNaN(V)) {
      if (!isNaN(I) && !isNaN(R)) {
        V = I * R;
      } else if (!isNaN(P) && !isNaN(I) && I !== 0) {
        V = P / I;
      } else if (!isNaN(P) && !isNaN(R) && R !== 0) {
        V = Math.sqrt(P * R);
      }
    }

    // Calculate missing current if possible
    if (isNaN(I)) {
      if (!isNaN(V) && !isNaN(R) && R !== 0) {
        I = V / R;
      } else if (!isNaN(P) && !isNaN(V) && V !== 0) {
        I = P / V;
      } else if (!isNaN(P) && !isNaN(R) && R !== 0) {
        I = Math.sqrt(P / R);
      }
    }

    // Calculate missing resistance if possible
    if (isNaN(R)) {
      if (!isNaN(V) && !isNaN(I) && I !== 0) {
        R = V / I;
      } else if (!isNaN(V) && !isNaN(P) && P !== 0) {
        R = (V * V) / P;
      } else if (!isNaN(P) && !isNaN(I) && I !== 0) {
        R = P / (I * I);
      }
    }

    // Validate all calculated values
    if ([V, I, R, P].some((x) => isNaN(x) || x <= 0)) {
      return {
        primary: "Invalid or insufficient inputs to calculate electrical parameters.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate cost per hour and per month
    if (isNaN(costPerKwh) || costPerKwh <= 0) {
      return {
        primary: "Please enter a valid Cost per kWh ($/kWh).",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    const powerKw = P / 1000; // Watts to kW
    const costPerHour = powerKw * costPerKwh;
    const costPerMonth = costPerHour * 24 * 30;

    return {
      primary: `$${costPerHour.toFixed(4)}`,
      secondary: "Cost per Hour",
      details: `Power: ${P.toFixed(2)} W | Voltage: ${V.toFixed(2)} V | Current: ${I.toFixed(
        2
      )} A | Resistance: ${R.toFixed(2)} Ω | Cost per Month: $${costPerMonth.toFixed(2)}`,
      feedback: "Ensure inputs are accurate for precise cost estimation.",
    };
  }, [parsedInputs]);

  const faqs = [
    {
      question: "How does this calculator determine electricity cost?",
      answer:
        "This calculator first computes the electrical power consumption in watts using the provided voltage, current, resistance, and power inputs. It then converts the power to kilowatts and multiplies by the cost per kilowatt-hour to estimate the cost per hour. Multiplying by 24 hours and 30 days gives the monthly cost. Accurate inputs ensure precise cost estimation.",
    },
    {
      question: "What if I only know voltage and resistance?",
      answer:
        "If you provide voltage and resistance, the calculator uses Ohm's law and power formulas to compute current and power. Specifically, current is calculated as voltage divided by resistance, and power as voltage squared divided by resistance. These values are then used to estimate electricity cost.",
    },
    {
      question: "Why do I need to input cost per kWh?",
      answer:
        "The cost per kilowatt-hour (kWh) is the rate your utility company charges for electricity. Without this value, the calculator cannot estimate the monetary cost of running your electrical device. This value varies by location and provider, so ensure you input the correct rate for accurate results.",
    },
    {
      question: "Can this calculator handle AC and DC circuits?",
      answer:
        "This calculator assumes resistive loads and steady-state conditions typical in DC or RMS values in AC circuits. It does not account for reactive components like inductance or capacitance, which affect power factor in AC systems. For complex AC loads, specialized power factor and reactive power calculations are necessary.",
    },
    {
      question: "What safety precautions should I take when measuring electrical parameters?",
      answer:
        "Always ensure power is off before connecting measurement devices to avoid electric shock or equipment damage. Use properly rated instruments and personal protective equipment. If unsure, consult a qualified electrician. Incorrect measurements can lead to inaccurate calculations and unsafe conditions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Running a 1500W electric heater on a 120V circuit with a utility cost of $0.13 per kWh.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the voltage as 120V and power as 1500W. Leave current and resistance blank to be calculated.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the electricity cost as 0.13 $/kWh, which is the average residential rate in many areas.",
      },
      {
        label: "Step 3",
        explanation:
          "Click Calculate. The calculator computes the current, resistance, and estimates the cost per hour and per month of running the heater continuously.",
      },
    ],
    result:
      "The heater draws 12.5A current, has an equivalent resistance of 9.6Ω, costs approximately $0.195 per hour to run, and about $140.40 per month if used 24/7.",
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
      title: "Understanding Electricity Bills and Rates",
      description:
        "How electricity consumption translates to cost and how rates are structured.",
      url: "https://www.energy.gov/energysaver/articles/understanding-your-electric-bill",
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
          <Label htmlFor="current">Current (I) [Amps]</Label>
          <Input
            id="current"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (R) [Ohms]</Label>
          <Input
            id="resistance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 12"
            value={inputs.resistance}
            onChange={(e) => handleInputChange("resistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power (P) [Watts]</Label>
          <Input
            id="power"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1500"
            value={inputs.power}
            onChange={(e) => handleInputChange("power", e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="costPerKwh">Cost per kWh ($/kWh)</Label>
          <Input
            id="costPerKwh"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.13"
            value={inputs.costPerKwh}
            onChange={(e) => handleInputChange("costPerKwh", e.target.value)}
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
            <p className="text-xs text-slate-500 mt-2 whitespace-pre-line">{results.details}</p>
            <Separator className="my-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter at least two known electrical parameters among Voltage (V), Current (I), Resistance (R), or Power (P).</li>
          <li>Input the electricity cost per kilowatt-hour ($/kWh) as charged by your utility provider.</li>
          <li>Click the Calculate button to compute missing electrical values and estimate the electricity cost per hour and per month.</li>
          <li>Review the results and ensure inputs are accurate for reliable cost estimation.</li>
          <li>Use the guide and safety sections for detailed understanding and precautions.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Electricity Cost per Hour/Month Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            This calculator helps electrical engineers, electricians, and homeowners estimate the cost of running electrical devices based on fundamental electrical principles and utility rates.
          </p>
          <p>
            The core electrical relationships used are derived from Ohm's Law and power formulas:
          </p>
          <ul>
            <li><strong>Ohm's Law:</strong> V = I × R</li>
            <li><strong>Power formulas:</strong> P = V × I = I² × R = V² / R</li>
          </ul>
          <p>
            By inputting any two or more parameters, the calculator solves for the unknowns, ensuring consistent and accurate electrical values.
          </p>
          <p>
            The power consumption in watts is converted to kilowatts and multiplied by the cost per kilowatt-hour to estimate the running cost. This cost is then extrapolated to hourly and monthly values assuming continuous operation.
          </p>
          <p>
            This tool is useful for budgeting energy expenses, sizing electrical components, and understanding the financial impact of electrical loads.
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
            <strong>Warning:</strong> Electricity is inherently dangerous. Always follow proper safety protocols when measuring or working with electrical circuits. Use insulated tools and wear appropriate personal protective equipment.
          </p>
          <p>
            Common mistakes include entering incorrect or incomplete input values, which lead to inaccurate calculations and potentially unsafe conclusions. Ensure measurements are taken with calibrated instruments and double-check inputs before calculation.
          </p>
          <p>
            This calculator assumes resistive loads and steady-state conditions. It does not account for reactive power, harmonics, or transient conditions common in AC circuits with inductive or capacitive loads.
          </p>
          <p>
            Never attempt to measure electrical parameters on live circuits without proper training and equipment. When in doubt, consult a licensed electrician.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p><strong>Result:</strong> {example.result}</p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
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
      title="Electricity Cost per Hour/Month Calculator"
      description="Professional electrical calculator: Electricity Cost per Hour/Month Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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