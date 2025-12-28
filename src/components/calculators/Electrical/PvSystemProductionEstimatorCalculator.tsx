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

export default function PvSystemProductionEstimatorCalculator() {
  /**
   * Inputs:
   * val1: Daily energy consumption in Wh (Watt-hours)
   * val2: Battery capacity in Ah (Ampere-hours)
   * val3: Average sun hours per day (peak sun hours)
   *
   * Outputs:
   * - Estimated PV system size in Watts (W)
   * - Estimated daily energy production in Wh
   * - Estimated battery autonomy in days
   */

  const [inputs, setInputs] = useState({
    val1: "", // Daily energy consumption (Wh)
    val2: "", // Battery capacity (Ah)
    val3: "", // Sun hours per day
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numeric input or empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const dailyWh = parseFloat(inputs.val1);
    const batteryAh = parseFloat(inputs.val2);
    const sunHours = parseFloat(inputs.val3);

    if (
      isNaN(dailyWh) ||
      dailyWh <= 0 ||
      isNaN(batteryAh) ||
      batteryAh <= 0 ||
      isNaN(sunHours) ||
      sunHours <= 0
    ) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details:
          "Please enter positive numeric values for all inputs to calculate the PV system size.",
        feedback: "",
      };
    }

    // Assumptions:
    // System voltage: 12V (common for small PV systems)
    // Battery voltage assumed 12V to convert Ah to Wh: Wh = Ah * V
    // System losses (inverter, wiring, temperature, etc.): ~25% (efficiency factor 0.75)
    // PV system size (W) = Daily energy consumption (Wh) / (Sun hours * system efficiency)

    const systemVoltage = 12; // volts
    const systemEfficiency = 0.75; // 25% losses

    // Battery capacity in Wh
    const batteryWh = batteryAh * systemVoltage;

    // Battery autonomy in days (how many days the battery can supply the load without sun)
    const batteryAutonomyDays = batteryWh / dailyWh;

    // Required PV system size in Watts
    const pvSystemWatts = dailyWh / (sunHours * systemEfficiency);

    // Estimated daily energy production from PV system (considering efficiency)
    const dailyProductionWh = pvSystemWatts * sunHours * systemEfficiency;

    return {
      primary: pvSystemWatts.toFixed(1),
      secondary: "Estimated PV System Size (Watts)",
      details: `To meet a daily consumption of ${dailyWh.toLocaleString()} Wh with an average of ${sunHours.toFixed(
        2
      )} peak sun hours per day, you need approximately ${pvSystemWatts.toFixed(
        1
      )} W of PV panels. Your battery capacity of ${batteryAh.toLocaleString()} Ah (~${batteryWh.toLocaleString()} Wh) provides about ${batteryAutonomyDays.toFixed(
        2
      )} days of autonomy without sun.`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is peak sun hours and why is it important?",
      answer:
        "Peak sun hours represent the equivalent number of hours per day when solar irradiance averages 1000 W/m², which is the standard for solar panel ratings. This value varies by location and season and is critical for estimating how much energy a PV system can generate daily. Accurate peak sun hour data ensures the PV system is sized correctly to meet energy demands.",
    },
    {
      question: "Why do we assume a system voltage of 12V for battery capacity?",
      answer:
        "A 12V system voltage is a common standard for small to medium off-grid solar systems and simplifies calculations. Battery capacity in ampere-hours (Ah) must be converted to watt-hours (Wh) by multiplying by system voltage to understand the actual energy stored. For larger or grid-tied systems, different voltages may apply, and calculations should be adjusted accordingly.",
    },
    {
      question: "What factors contribute to the 25% system losses?",
      answer:
        "System losses include inverter inefficiency, wiring resistance, shading, dust on panels, temperature effects, and battery charging/discharging inefficiencies. These losses reduce the actual energy output compared to the theoretical maximum. Accounting for approximately 25% losses provides a realistic estimate of system performance and helps avoid undersizing the PV array.",
    },
    {
      question: "How can I increase battery autonomy?",
      answer:
        "Battery autonomy can be increased by either increasing the battery capacity (Ah) or reducing daily energy consumption. Using energy-efficient appliances, optimizing usage patterns, and adding more battery storage are common strategies. Additionally, ensuring proper battery maintenance and using deep-cycle batteries designed for solar applications can improve usable capacity and longevity.",
    },
    {
      question: "Can this calculator be used for grid-tied PV systems?",
      answer:
        "This calculator is primarily designed for off-grid or hybrid PV systems where battery storage and daily energy consumption are critical. For grid-tied systems without batteries, sizing depends more on energy consumption patterns and net metering policies. However, the PV system size estimation based on daily consumption and sun hours can still provide a useful baseline.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to design an off-grid solar system to power a small cabin. The daily energy consumption is approximately 3000 Wh. You have a 200 Ah 12V battery bank and your location receives about 5 peak sun hours per day.",
    steps: [
      {
        label: "Step 1: Calculate battery capacity in Wh",
        explanation:
          "Multiply battery ampere-hours by system voltage: 200 Ah × 12 V = 2400 Wh.",
      },
      {
        label: "Step 2: Calculate battery autonomy",
        explanation:
          "Divide battery capacity by daily consumption: 2400 Wh ÷ 3000 Wh = 0.8 days of autonomy.",
      },
      {
        label: "Step 3: Calculate required PV system size",
        explanation:
          "Divide daily consumption by (sun hours × efficiency): 3000 Wh ÷ (5 × 0.75) = 800 W.",
      },
    ],
    result:
      "You need an 800 W PV array to meet your daily energy needs with 5 peak sun hours, and your battery bank provides less than one day of autonomy, so consider increasing battery capacity for longer backup.",
  };

  const references = [
    {
      title: "PVWatts Calculator - NREL",
      description:
        "A widely used solar PV system performance calculator developed by the National Renewable Energy Laboratory.",
      url: "https://pvwatts.nrel.gov/",
    },
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "Solar Energy Basics - DOE",
      description:
        "Comprehensive guide on solar energy principles, system components, and design considerations.",
      url: "https://www.energy.gov/eere/solar/solar-energy-basics",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyWh">Daily Energy Consumption (Wh)</Label>
          <Input
            id="dailyWh"
            type="number"
            min={0}
            step="any"
            placeholder="e.g., 3000"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batteryAh">Battery Capacity (Ah)</Label>
          <Input
            id="batteryAh"
            type="number"
            min={0}
            step="any"
            placeholder="e.g., 200"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sunHours">Average Sun Hours per Day</Label>
          <Input
            id="sunHours"
            type="number"
            min={0}
            step="any"
            placeholder="e.g., 5"
            value={inputs.val3}
            onChange={(e) => handleInputChange("val3", e.target.value)}
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
            Enter your average daily energy consumption in watt-hours (Wh). This
            is the total energy your loads consume in one day.
          </li>
          <li>
            Enter your battery bank capacity in ampere-hours (Ah). This is the
            total capacity of your batteries at system voltage (commonly 12V).
          </li>
          <li>
            Enter the average peak sun hours per day for your location. This
            value can be found from solar irradiance maps or local weather
            data.
          </li>
          <li>
            Click "Calculate" to estimate the required PV system size in watts,
            expected daily energy production, and battery autonomy in days.
          </li>
          <li>
            Use the results to size your solar panels and battery bank to meet
            your energy needs reliably.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to PV System Production Estimator (e.g., PVWatts)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Photovoltaic (PV) systems convert sunlight into electrical energy.
            The amount of energy produced depends on the size of the PV array,
            the solar irradiance (sun hours), and system losses. This calculator
            estimates the PV system size needed to meet a given daily energy
            consumption, considering typical system losses.
          </p>
          <p>
            Battery capacity is critical for off-grid systems to provide energy
            when sunlight is unavailable. Battery capacity in ampere-hours (Ah)
            must be converted to watt-hours (Wh) by multiplying by system
            voltage to understand usable energy storage.
          </p>
          <p>
            System losses typically account for inverter inefficiency, wiring
            losses, temperature effects, and shading. A 25% loss factor is a
            common engineering estimate to ensure realistic sizing.
          </p>
          <p>
            By inputting your daily consumption, battery capacity, and sun hours,
            this tool helps you design a PV system that reliably meets your
            energy needs with appropriate battery backup.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity and solar installations can be
            hazardous. Always follow local electrical codes and standards such as
            the NEC when designing and installing PV systems.
          </p>
          <p>
            Common mistakes include undersizing the PV array or battery bank,
            ignoring system losses, and neglecting proper wiring and protection.
            These can lead to system failure, battery damage, or safety hazards.
          </p>
          <p>
            Ensure all components are rated for the system voltage and current,
            use appropriate fuses and breakers, and consult a licensed
            electrician or solar professional for installation.
          </p>
          <p>
            Regular maintenance and monitoring are essential to ensure system
            reliability and safety over time.
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
      title="PV System Production Estimator (e.g., PVWatts)"
      description="Professional electrical calculator: PV System Production Estimator (e.g., PVWatts). Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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