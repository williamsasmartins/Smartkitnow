import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LightingCircuitLoadPlannerCalculator() {
  /*
    Lighting Circuit Load Planner Calculator
    ----------------------------------------
    This calculator helps electricians and engineers plan lighting circuits by calculating:
    - Total connected load (VA)
    - Demand load (VA) per NEC guidelines (Article 220.12)
    - Recommended breaker size (A)
    - Recommended wire gauge (AWG) based on breaker size and NEC ampacity tables

    Inputs:
    - Number of lighting fixtures
    - Wattage per fixture (W)
    - Circuit length (ft) [optional for voltage drop considerations, not implemented here]

    Outputs:
    - Total connected load (VA)
    - Demand load (VA) applying 100% for first 3000 VA, then 35% for remainder per NEC 220.12
    - Recommended breaker size (A)
    - Recommended wire gauge (AWG)
  */

  const [inputs, setInputs] = useState({
    numberOfFixtures: "",
    wattagePerFixture: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only positive numbers or empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // NEC 2020 Table 310.16 (Copper conductors, 75°C insulation, typical for THHN/THWN)
  // Ampacity values for common wire sizes (AWG) - string keys for 1/0, 2/0, etc.
  // Source: NEC Table 310.16
  const wireAmpacityTable: Record<string, number> = {
    "14": 20,
    "12": 25,
    "10": 35,
    "8": 50,
    "6": 65,
    "4": 85,
    "3": 100,
    "2": 115,
    "1": 130,
    "1/0": 150,
    "2/0": 175,
    "3/0": 200,
    "4/0": 230,
  };

  // Standard breaker sizes (A) for lighting circuits (common values)
  const breakerSizes = [15, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Helper: Find minimum breaker size that is >= load current
  function selectBreakerSize(current: number): number {
    for (const size of breakerSizes) {
      if (size >= current) return size;
    }
    return breakerSizes[breakerSizes.length - 1]; // max size if load very high
  }

  // Helper: Find minimum wire gauge that can handle breaker size
  function selectWireGauge(breaker: number): string {
    // Find smallest wire with ampacity >= breaker size
    // Sort keys by ampacity ascending
    const sortedWires = Object.entries(wireAmpacityTable).sort(
      (a, b) => a[1] - b[1]
    );
    for (const [awg, ampacity] of sortedWires) {
      if (ampacity >= breaker) return awg;
    }
    return "4/0"; // largest wire if breaker very large
  }

  // NEC 220.12 Lighting Load Demand Factors:
  // First 3000 VA at 100%, remainder at 35%
  function calculateDemandLoad(totalVA: number): number {
    if (totalVA <= 3000) return totalVA;
    return 3000 + (totalVA - 3000) * 0.35;
  }

  const results = useMemo(() => {
    const nFixtures = parseFloat(inputs.numberOfFixtures);
    const wattage = parseFloat(inputs.wattagePerFixture);

    if (
      isNaN(nFixtures) ||
      isNaN(wattage) ||
      nFixtures <= 0 ||
      wattage <= 0
    ) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total connected load (VA)
    const totalConnectedLoadVA = nFixtures * wattage;

    // Demand load per NEC 220.12
    const demandLoadVA = calculateDemandLoad(totalConnectedLoadVA);

    // Calculate load current (A) assuming 120V single phase lighting circuit
    const voltage = 120;
    const loadCurrent = demandLoadVA / voltage;

    // Select breaker size
    const breakerSize = selectBreakerSize(loadCurrent);

    // Select wire gauge
    const wireGauge = selectWireGauge(breakerSize);

    return {
      primary: `${demandLoadVA.toFixed(0)} VA`,
      secondary: "Demand Load (per NEC 220.12)",
      details: `Total Connected Load: ${totalConnectedLoadVA.toFixed(
        0
      )} VA | Load Current: ${loadCurrent.toFixed(
        2
      )} A | Recommended Breaker: ${breakerSize} A | Wire Gauge: ${wireGauge} AWG`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we apply demand factors to lighting loads?",
      answer:
        "Demand factors are applied to lighting loads to more accurately reflect the actual expected load on a circuit rather than the sum of all connected loads. According to NEC 220.12, the first 3000 VA of lighting load is counted at 100%, while any load above that is counted at 35%. This accounts for the fact that not all lighting fixtures will be on simultaneously at full power, improving efficiency and reducing unnecessary oversizing of conductors and breakers.",
    },
    {
      question: "How do I choose the correct wire gauge for my lighting circuit?",
      answer:
        "The wire gauge must be selected based on the ampacity requirements of the circuit breaker protecting the circuit, as well as the expected load current. Using NEC Table 310.16, the wire gauge is chosen so that its ampacity is equal to or greater than the breaker size. For example, a 20A breaker typically requires at least 12 AWG copper wire. Selecting the correct wire gauge ensures safety, prevents overheating, and complies with electrical codes.",
    },
    {
      question: "Can I use this calculator for circuits other than lighting?",
      answer:
        "This calculator is specifically designed for lighting circuits and applies NEC demand factors relevant to lighting loads. Other types of loads, such as receptacles, motors, or appliances, have different demand factors and calculation methods. For those, separate calculators or manual calculations based on NEC guidelines should be used to ensure accuracy and compliance.",
    },
    {
      question: "What if my lighting fixtures have different wattages?",
      answer:
        "This calculator assumes all fixtures have the same wattage for simplicity. If your fixtures have varying wattages, you should calculate the total connected load by summing the wattages of each fixture type multiplied by their quantities. Then, input the total connected load directly or use a more detailed calculator that supports multiple fixture types.",
    },
    {
      question: "Why is the voltage assumed to be 120V?",
      answer:
        "Most residential and many commercial lighting circuits in North America operate at 120 volts single phase. This calculator uses 120V as the standard voltage for load current calculations. If you are working with a different voltage system, you should adjust the voltage value accordingly or use a calculator designed for that system.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are planning a lighting circuit in a residential home with 20 LED fixtures, each rated at 60 watts. The circuit will be powered by a 120V supply.",
    steps: [
      {
        label: "Step 1: Calculate total connected load",
        explanation: "Multiply the number of fixtures by wattage per fixture: 20 × 60W = 1200 VA.",
      },
      {
        label: "Step 2: Apply NEC demand factors",
        explanation:
          "Since 1200 VA is less than 3000 VA, demand load = 1200 VA (100%).",
      },
      {
        label: "Step 3: Calculate load current",
        explanation: "Load current = 1200 VA ÷ 120 V = 10 A.",
      },
      {
        label: "Step 4: Select breaker size",
        explanation:
          "Minimum breaker size ≥ 10 A is 15 A (standard size).",
      },
      {
        label: "Step 5: Select wire gauge",
        explanation:
          "For 15 A breaker, minimum wire gauge is 14 AWG per NEC Table 310.16.",
      },
    ],
    result:
      "Recommended breaker: 15 A, Wire gauge: 14 AWG, Demand load: 1200 VA.",
  };

  const references = [
    {
      title: "NEC Table 220.12 - Lighting Load Demand Factors",
      description:
        "National Electrical Code guidelines for applying demand factors to lighting loads.",
      url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70",
    },
    {
      title: "NEC Table 310.16 - Ampacities of Insulated Conductors",
      description:
        "Ampacity ratings for copper and aluminum conductors used in electrical wiring.",
      url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70",
    },
    {
      title: "Understanding Lighting Load Calculations",
      description:
        "Technical article explaining lighting load calculations and demand factors.",
      url: "https://ecmweb.com/lighting/lighting-load-calculations",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfFixtures">Number of Lighting Fixtures</Label>
          <Input
            id="numberOfFixtures"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 20"
            value={inputs.numberOfFixtures}
            onChange={(e) => handleInputChange("numberOfFixtures", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wattagePerFixture">Wattage per Fixture (W)</Label>
          <Input
            id="wattagePerFixture"
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 60"
            value={inputs.wattagePerFixture}
            onChange={(e) => handleInputChange("wattagePerFixture", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No special action needed, calculation updates automatically
        }}
      >
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2 whitespace-pre-line">{results.details}</p>
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
          <li>Enter the total number of lighting fixtures you plan to install on the circuit.</li>
          <li>Enter the wattage rating of each fixture (usually found on the fixture label or datasheet).</li>
          <li>Click "Calculate" to see the demand load, recommended breaker size, and wire gauge.</li>
          <li>Use the results to select appropriate circuit components that comply with NEC requirements.</li>
          <li>Always verify calculations and consult local codes and inspectors before installation.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Lighting Circuit Load Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Lighting circuits are a fundamental part of electrical installations. Proper planning ensures safety, efficiency, and code compliance.
            This calculator uses the National Electrical Code (NEC) guidelines to estimate the demand load on a lighting circuit by applying demand factors from NEC Article 220.12.
          </p>
          <p>
            The total connected load is the sum of all lighting fixture wattages on the circuit. However, because not all fixtures operate simultaneously at full power, NEC allows applying demand factors to reduce the calculated load.
          </p>
          <p>
            The demand load is then used to calculate the load current by dividing by the supply voltage (typically 120V). Based on this current, the calculator recommends a circuit breaker size and wire gauge using NEC Table 310.16 ampacity ratings.
          </p>
          <p>
            Selecting the correct breaker and wire gauge is critical to prevent overheating, reduce fire risk, and ensure reliable operation of the lighting circuit.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="w-5 h-5" /> Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity is dangerous and can cause serious injury or death. Always follow NEC guidelines, local codes, and manufacturer instructions.
          </p>
          <p>
            Common mistakes include undersizing wire gauge, overloading circuits by ignoring demand factors, and selecting incorrect breaker sizes. These errors can lead to overheating, tripped breakers, or fire hazards.
          </p>
          <p>
            Always verify calculations, use proper tools, and consult a licensed electrician or engineer when planning electrical circuits.
          </p>
          <p>
            This calculator provides estimates and guidance but does not replace professional judgment or code enforcement.
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
          <p>
            <strong>Result:</strong> {example.result}
          </p>
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
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
      title="Lighting Circuit Load Planner"
      description="Professional electrical calculator: Lighting Circuit Load Planner. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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