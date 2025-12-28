import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ElectricityCostPerHourMonthCalculator() {
  /*
    Inputs:
    - Voltage (V) [Volts]
    - Current (I) [Amps]
    - Resistance (R) [Ohms]
    - Power (P) [Watts]
    - Cost per kWh [$/kWh]

    Outputs:
    - Power (Watts) if not given
    - Electricity cost per hour ($/hr)
    - Electricity cost per month ($/month) assuming 30 days, 24 hours/day

    Logic:
    - Use given inputs to calculate missing power if possible:
      P = V * I
      P = I^2 * R
      P = V^2 / R
    - If power is given, use it directly.
    - Calculate cost/hr = (P Watts / 1000) * cost_per_kWh
    - Calculate cost/month = cost/hr * 24 * 30
  */

  const [inputs, setInputs] = useState({
    voltage: "", // V
    current: "", // I
    resistance: "", // R
    power: "", // P (Watts)
    costPerKwh: "", // $/kWh
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const V = parseFloat(inputs.voltage);
    const I = parseFloat(inputs.current);
    const R = parseFloat(inputs.resistance);
    const P_input = parseFloat(inputs.power);
    const costPerKwh = parseFloat(inputs.costPerKwh);

    // Validate cost per kWh
    if (isNaN(costPerKwh) || costPerKwh <= 0) {
      return {
        primary: "–",
        secondary: "Invalid cost per kWh",
        details: "Please enter a valid electricity cost per kWh (greater than 0).",
        feedback: "",
      };
    }

    // Calculate power if not given
    let P: number | null = null;

    if (!isNaN(P_input) && P_input > 0) {
      P = P_input;
    } else {
      // Try to calculate power from other inputs
      if (!isNaN(V) && !isNaN(I)) {
        P = V * I;
      } else if (!isNaN(I) && !isNaN(R)) {
        P = I * I * R;
      } else if (!isNaN(V) && !isNaN(R) && R !== 0) {
        P = (V * V) / R;
      }
    }

    if (P === null || P <= 0) {
      return {
        primary: "–",
        secondary: "Insufficient data",
        details:
          "Please provide either power (Watts) or a combination of voltage, current, and/or resistance to calculate power.",
        feedback: "",
      };
    }

    // Calculate cost per hour and per month
    const costPerHour = (P / 1000) * costPerKwh;
    const costPerMonth = costPerHour * 24 * 30;

    return {
      primary: `$${costPerHour.toFixed(4)}`,
      secondary: "Cost per Hour",
      details: `Power used: ${P.toFixed(2)} Watts. Monthly cost (30 days): $${costPerMonth.toFixed(
        2
      )}.`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate electricity cost if I only know voltage and current?",
      answer:
        "If you know the voltage (V) and current (I), you can calculate power (P) using the formula P = V × I. Once you have power in watts, multiply by your electricity cost per kilowatt-hour (kWh) divided by 1000 to get the cost per hour. This calculator automates these steps for you.",
    },
    {
      question: "Why do I need to enter the electricity cost per kWh?",
      answer:
        "Electricity cost per kWh varies depending on your utility provider and location. Entering this value allows the calculator to convert power consumption into actual monetary cost, giving you an accurate estimate of how much you will pay per hour and per month.",
    },
    {
      question: "Can I use this calculator if I only know resistance?",
      answer:
        "Yes, if you know the resistance (R) and either voltage (V) or current (I), the calculator can compute power using formulas derived from Ohm's law. For example, P = V² / R or P = I² × R. Ensure you provide at least two of these values for accurate calculation.",
    },
    {
      question: "What assumptions does this calculator make for monthly cost?",
      answer:
        "The calculator assumes continuous operation for 30 days, 24 hours per day, to estimate monthly electricity cost. If your device runs fewer hours, multiply the hourly cost by the actual hours used to get a more accurate monthly estimate.",
    },
    {
      question: "Why might the calculator show 'Insufficient data'?",
      answer:
        "This message appears when the calculator cannot determine power consumption due to missing or invalid inputs. Ensure you provide either the power directly or a valid combination of voltage, current, and/or resistance values to proceed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 120V appliance that draws 5 amps, and your electricity cost is $0.13 per kWh. You want to know how much it costs to run this appliance per hour and per month.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the voltage as 120 volts and current as 5 amps in the calculator inputs.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter your electricity cost per kWh as 0.13 (representing $0.13 per kWh).",
      },
      {
        label: "Step 3",
        explanation:
          "Click Calculate. The calculator computes power as P = V × I = 120 × 5 = 600 Watts.",
      },
      {
        label: "Step 4",
        explanation:
          "It then calculates cost per hour as (600/1000) × 0.13 = $0.078 and monthly cost as $0.078 × 24 × 30 = $56.16.",
      },
    ],
    result:
      "The appliance costs approximately $0.078 per hour to run, and about $56.16 if run continuously for 30 days.",
  };

  const references = [
    {
      title: "Ohm's Law and Power Formulas",
      description:
        "Fundamental electrical formulas relating voltage, current, resistance, and power.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html",
    },
    {
      title: "Understanding Electricity Bills",
      description:
        "How electricity consumption translates to cost on your utility bill.",
      url: "https://www.energy.gov/energysaver/articles/understanding-your-electric-bill",
    },
    {
      title: "National Electrical Code (NEC)",
      description:
        "Standards and guidelines for electrical safety and design.",
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
            min={0}
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
            min={0}
            step="any"
            placeholder="e.g. 5"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resistance">Resistance (R) [Ohms]</Label>
          <Input
            id="resistance"
            type="number"
            min={0}
            step="any"
            placeholder="Optional"
            value={inputs.resistance}
            onChange={(e) => handleInputChange("resistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power">Power (P) [Watts]</Label>
          <Input
            id="power"
            type="number"
            min={0}
            step="any"
            placeholder="Optional"
            value={inputs.power}
            onChange={(e) => handleInputChange("power", e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="costPerKwh">Electricity Cost per kWh ($)</Label>
        <Input
          id="costPerKwh"
          type="number"
          min={0}
          step="any"
          placeholder="e.g. 0.13"
          value={inputs.costPerKwh}
          onChange={(e) => handleInputChange("costPerKwh", e.target.value)}
        />
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
            Enter the known electrical parameters: voltage (V), current (I), resistance (R), or power (P). You must provide either power directly or a combination of voltage, current, and/or resistance to calculate power.
          </li>
          <li>
            Enter your electricity cost per kilowatt-hour (kWh) as charged by your utility provider. This is essential to convert power consumption into monetary cost.
          </li>
          <li>
            Click the Calculate button to compute the electricity cost per hour and per month (assuming continuous operation for 30 days).
          </li>
          <li>
            Review the results displayed below the button. If inputs are insufficient or invalid, the calculator will prompt you to correct them.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Electricity Cost per Hour/Month Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            This calculator helps you estimate the cost of running electrical devices based on their power consumption and your local electricity rates. Power consumption can be directly entered if known, or calculated from voltage, current, and resistance using fundamental electrical formulas.
          </p>
          <p>
            The key formula for power is P = V × I, where voltage (V) is in volts and current (I) is in amps, resulting in power (P) in watts. Alternatively, power can be calculated using resistance (R) with P = I² × R or P = V² / R.
          </p>
          <p>
            Once power is determined, the cost per hour is calculated by converting watts to kilowatts (dividing by 1000) and multiplying by the electricity cost per kWh. The monthly cost assumes continuous operation for 30 days, 24 hours per day.
          </p>
          <p>
            This tool is useful for engineers, electricians, and consumers who want to understand the financial impact of electrical device usage and optimize energy consumption.
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
            <strong>Warning:</strong> Always ensure that electrical measurements are taken safely and with proper equipment. Incorrect voltage, current, or resistance readings can lead to inaccurate cost calculations and potential safety hazards.
          </p>
          <p>
            Do not rely solely on estimated or assumed values. When in doubt, measure actual device parameters or consult product specifications to avoid underestimating power consumption.
          </p>
          <p>
            Remember that this calculator assumes continuous operation for monthly cost estimates. If your device runs intermittently, adjust calculations accordingly to avoid overestimating costs.
          </p>
          <p>
            Avoid entering conflicting or incomplete data (e.g., voltage without current or resistance) as this will prevent accurate power calculation.
          </p>
          <p>
            Always cross-check your results and consult a qualified electrician for complex or high-power electrical systems.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">{example.result}</p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
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