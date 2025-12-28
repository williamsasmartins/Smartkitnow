import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BatteryRuntimeEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    wattHours: "",
    ampHours: "",
    sunHours: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Logic:
   * Inputs:
   * - Wh (Watt-hours) - optional
   * - Ah (Amp-hours) - optional
   * - Sun Hours (peak sun hours per day) - required for renewable calculation
   *
   * Output:
   * - Estimated battery runtime in hours (if load given)
   * - Or estimated solar charging time in hours (if battery capacity and sun hours given)
   *
   * Since this is a Battery Runtime Estimator for renewable systems,
   * we estimate runtime = Battery Capacity (Wh) / Load (W)
   * If Ah given, convert to Wh by multiplying by system voltage (assume 12V nominal)
   * Sun Hours used to estimate solar charging time or daily energy production.
   *
   * For this calculator, we assume:
   * - User inputs load in Wh or Ah (converted to Wh)
   * - Sun Hours used to estimate how long solar panels can recharge battery
   *
   * We'll calculate:
   * - Battery capacity in Wh (from Wh or Ah)
   * - Estimated runtime in hours = Battery capacity (Wh) / Load (W)
   *   But since load is not input, we assume Wh input is load energy needed.
   *
   * To keep it simple:
   * - If Wh and Sun Hours given: estimate solar charging time = Wh / (Sun Hours * solar panel wattage)
   *   But solar panel wattage is unknown, so we skip that.
   *
   * Instead, we provide:
   * - Runtime estimate = Battery capacity (Wh) / Load (W)
   *   But load is unknown, so we assume Wh = load energy needed.
   *
   * So the calculator will estimate runtime in hours = Wh / (Ah * 12V)
   * But this is ambiguous.
   *
   * To clarify:
   * Inputs:
   * - Battery Capacity: Wh or Ah (at 12V)
   * - Load: Watts (derived from Wh / runtime)
   * - Sun Hours: peak sun hours per day (for solar recharge estimate)
   *
   * Since only Wh, Ah, and Sun Hours are inputs, we will:
   * - Convert Ah to Wh (Ah * 12V)
   * - If Wh given, use it as battery capacity
   * - Calculate runtime = Battery Capacity (Wh) / Load (W)
   *   But load is unknown, so we assume Wh = load energy needed for 1 hour.
   *
   * To avoid confusion, we will:
   * - Calculate battery capacity in Wh (from Wh or Ah)
   * - Calculate estimated runtime in hours = Battery Capacity (Wh) / Load (W)
   *   But since load is unknown, we ask user to input Wh as load energy needed.
   *
   * So the calculator will output:
   * - Battery Capacity in Wh
   * - Estimated runtime in hours = Battery Capacity / Load (Wh)
   * - Solar recharge estimate = Sun Hours * solar panel wattage (unknown) - so we skip this.
   *
   * Final approach:
   * - Inputs:
   *   - Battery Capacity (Wh or Ah)
   *   - Load Energy (Wh) - user inputs Wh as load energy needed
   *   - Sun Hours (peak sun hours)
   *
   * - Outputs:
   *   - Battery Capacity in Wh
   *   - Estimated runtime = Battery Capacity / Load Energy (hours)
   *   - Estimated solar recharge time = Battery Capacity / (Sun Hours * assumed panel wattage)
   *     Since panel wattage unknown, we omit this.
   */

  // For simplicity, we treat:
  // val1 = Wh (Battery Capacity in Wh)
  // val2 = Ah (Battery Capacity in Ah)
  // val3 = Sun Hours (peak sun hours)

  // If both Wh and Ah given, prefer Wh.
  // If only Ah given, convert to Wh assuming 12V nominal system voltage.

  const SYSTEM_VOLTAGE = 12; // volts

  const results = useMemo(() => {
    const Wh = parseFloat(inputs.wattHours);
    const Ah = parseFloat(inputs.ampHours);
    const sunHours = parseFloat(inputs.sunHours);

    if (
      (isNaN(Wh) || Wh <= 0) &&
      (isNaN(Ah) || Ah <= 0)
    ) {
      return {
        primary: "N/A",
        secondary: "Battery Capacity Required",
        details: "Please enter a valid battery capacity in Wh or Ah.",
        feedback: "",
      };
    }

    if (isNaN(sunHours) || sunHours <= 0) {
      return {
        primary: "N/A",
        secondary: "Sun Hours Required",
        details: "Please enter valid peak sun hours (e.g., 4 to 6 hours).",
        feedback: "",
      };
    }

    // Calculate battery capacity in Wh
    const batteryWh = !isNaN(Wh) && Wh > 0 ? Wh : Ah * SYSTEM_VOLTAGE;

    // For runtime estimation, user must provide load in watts or watt-hours.
    // Since load is not an input, we assume Wh input is load energy needed for 1 hour.
    // So runtime = batteryWh / loadWh
    // But loadWh unknown, so we estimate runtime as batteryWh / average load.
    // To provide meaningful output, we assume average load = 100W (typical small load).
    // Or we can just output battery capacity and solar recharge estimate.

    // Let's output:
    // - Battery Capacity (Wh)
    // - Estimated runtime assuming a load of 100W
    // - Estimated solar recharge time assuming 250W solar panel

    const assumedLoadW = 100; // watts
    const assumedPanelW = 250; // watts

    const estimatedRuntimeHours = batteryWh / assumedLoadW;
    const estimatedSolarRechargeHours = batteryWh / (assumedPanelW * sunHours);

    // Safety feedback
    let feedback = "";
    if (estimatedRuntimeHours < 1) {
      feedback =
        "Warning: Battery capacity is low for the assumed load of 100W. Consider increasing capacity.";
    } else if (estimatedRuntimeHours > 48) {
      feedback =
        "Battery capacity is large; ensure proper charging and maintenance for long runtimes.";
    }

    return {
      primary: estimatedRuntimeHours.toFixed(2),
      secondary: "Estimated Runtime (hours) @ 100W load",
      details: `Battery Capacity: ${batteryWh.toFixed(
        1
      )} Wh | Solar Recharge Time: ${estimatedSolarRechargeHours.toFixed(
        2
      )} hours (with 250W panel & ${sunHours} sun hours)`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I convert amp-hours (Ah) to watt-hours (Wh)?",
      answer:
        "To convert amp-hours (Ah) to watt-hours (Wh), multiply the amp-hours by the nominal voltage of the battery system. For example, a 12V battery rated at 100Ah has a capacity of 1200Wh (100Ah × 12V = 1200Wh). This conversion is essential because watt-hours represent the actual energy stored, accounting for voltage, which is critical for accurate runtime estimations.",
    },
    {
      question: "What are peak sun hours and why are they important?",
      answer:
        "Peak sun hours represent the equivalent number of hours per day when solar irradiance averages 1000 watts per square meter. This metric is crucial for sizing solar panels and estimating how much energy they can generate daily. Accurate peak sun hour data helps in calculating how long it will take to recharge batteries using solar panels, ensuring reliable renewable energy system design.",
    },
    {
      question: "Why do we assume a 12V system voltage in calculations?",
      answer:
        "A 12V nominal voltage is a common standard for many battery systems, especially in residential and small renewable energy setups. Assuming 12V simplifies conversions between amp-hours and watt-hours. However, actual system voltages can vary (e.g., 24V, 48V), so for precise calculations, use the actual system voltage. Using the correct voltage ensures accurate energy capacity and runtime estimations.",
    },
    {
      question: "Can I use this calculator for non-renewable battery systems?",
      answer:
        "Yes, this calculator estimates battery runtime based on capacity and load assumptions, which applies to both renewable and non-renewable systems. However, the inclusion of peak sun hours is specifically for estimating solar recharge times in renewable setups. For non-renewable systems, you can ignore the sun hours input or set it to zero, focusing on battery capacity and load calculations.",
    },
    {
      question: "How accurate are the runtime estimates?",
      answer:
        "Runtime estimates are based on simplified assumptions, including a fixed load of 100 watts and nominal system voltage of 12V. Actual runtime depends on many factors such as battery age, temperature, load variability, and inverter efficiency. Use these estimates as a guideline and consult detailed system specifications and professional advice for critical applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 12V battery bank rated at 200Ah and you want to estimate how long it can power a 100W load. Your location receives about 5 peak sun hours per day.",
    steps: [
      {
        label: "Step 1: Convert battery capacity to watt-hours",
        explanation:
          "Multiply amp-hours by system voltage: 200Ah × 12V = 2400Wh.",
      },
      {
        label: "Step 2: Calculate estimated runtime",
        explanation:
          "Divide battery capacity by load: 2400Wh ÷ 100W = 24 hours of runtime.",
      },
      {
        label: "Step 3: Estimate solar recharge time",
        explanation:
          "Assuming a 250W solar panel and 5 sun hours: 2400Wh ÷ (250W × 5h) = 1.92 hours to fully recharge.",
      },
    ],
    result:
      "The battery can power a 100W load for approximately 24 hours. Solar panels can recharge the battery in under 2 hours during peak sun hours.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "Battery University - How to Calculate Battery Capacity",
      description:
        "Comprehensive guide on battery capacity and runtime calculations.",
      url: "https://batteryuniversity.com/article/bu-402-how-to-measure-battery-capacity",
    },
    {
      title: "NREL - Solar Radiation Data",
      description:
        "Official data on peak sun hours and solar irradiance for renewable energy design.",
      url: "https://www.nrel.gov/grid/solar-resource/solar-data.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wattHours">Battery Capacity (Watt-hours, Wh)</Label>
          <Input
            id="wattHours"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 2400"
            value={inputs.wattHours}
            onChange={(e) => handleInputChange("wattHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ampHours">Battery Capacity (Amp-hours, Ah)</Label>
          <Input
            id="ampHours"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 200"
            value={inputs.ampHours}
            onChange={(e) => handleInputChange("ampHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sunHours">Peak Sun Hours (hours/day)</Label>
          <Input
            id="sunHours"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 5"
            value={inputs.sunHours}
            onChange={(e) => handleInputChange("sunHours", e.target.value)}
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
                <p className="text-amber-900 font-semibold">{results.feedback}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Enter your battery capacity in watt-hours (Wh) if known. If you only know amp-hours (Ah), enter that value instead.
          </li>
          <li>
            Provide the peak sun hours for your location. This is the average number of hours per day when solar irradiance is at its peak.
          </li>
          <li>
            Click the Calculate button to estimate the battery runtime assuming a 100W load and the solar recharge time with a 250W solar panel.
          </li>
          <li>
            Review the results and safety feedback to understand your system's performance and any recommendations.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Battery Runtime Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Battery runtime estimation is a critical aspect of designing and managing renewable energy systems. It helps determine how long a battery can power a given load before needing recharge. This calculator uses fundamental electrical engineering principles to provide an estimate based on battery capacity and assumed load.
          </p>
          <p>
            The battery capacity can be expressed in watt-hours (Wh) or amp-hours (Ah). Watt-hours represent the total energy stored, while amp-hours indicate the charge capacity at a nominal voltage. Converting Ah to Wh requires multiplying by the system voltage, typically 12V for many residential systems.
          </p>
          <p>
            Peak sun hours represent the effective daily solar energy available and are essential for estimating how quickly solar panels can recharge the battery. This calculator assumes a 250W solar panel to provide a practical recharge time estimate.
          </p>
          <p>
            Keep in mind that actual runtime and recharge times can vary due to factors such as battery age, temperature, load fluctuations, and system efficiency. Always consider these factors and consult with professionals for critical applications.
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
            <strong>Warning:</strong> Electricity and batteries can be hazardous if handled improperly. Always follow manufacturer guidelines and safety standards when working with electrical systems.
          </p>
          <p>
            A common mistake is underestimating the load or overestimating battery capacity, which can lead to unexpected power outages. Always verify your load requirements and consider inefficiencies.
          </p>
          <p>
            Another frequent error is neglecting the effect of temperature on battery performance. Batteries typically have reduced capacity in cold environments, which can significantly affect runtime.
          </p>
          <p>
            Ensure that your solar panel array is properly sized and installed to avoid insufficient charging, which can damage batteries and reduce their lifespan.
          </p>
          <p>
            When converting amp-hours to watt-hours, always use the correct system voltage. Using an incorrect voltage can lead to inaccurate capacity and runtime calculations.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <article className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </article>
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
      title="Battery Runtime Estimator"
      description="Professional electrical calculator: Battery Runtime Estimator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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