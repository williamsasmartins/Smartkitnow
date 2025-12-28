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

export default function OffGridSystemSizingCalculator() {
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
   * - Wh (daily energy consumption in watt-hours)
   * - Ah (battery capacity in amp-hours)
   * - Sun Hours (peak sun hours per day)
   *
   * Outputs:
   * - Recommended solar panel wattage (W)
   * - Recommended battery capacity (Ah)
   * - Details and safety feedback
   *
   * Assumptions:
   * - System voltage: 12V (common for off-grid)
   * - Battery efficiency: 85%
   * - Depth of Discharge (DoD): 50% for lead-acid batteries
   * - System losses: 20%
   */

  const results = useMemo(() => {
    const Wh = parseFloat(inputs.wattHours);
    const Ah = parseFloat(inputs.ampHours);
    const sunHours = parseFloat(inputs.sunHours);

    if (
      isNaN(Wh) ||
      Wh <= 0 ||
      isNaN(Ah) ||
      Ah <= 0 ||
      isNaN(sunHours) ||
      sunHours <= 0
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    const systemVoltage = 12; // volts
    const batteryEfficiency = 0.85; // 85%
    const depthOfDischarge = 0.5; // 50%
    const systemLosses = 0.2; // 20% losses

    // Calculate minimum battery capacity needed in Ah:
    // Battery capacity (Ah) = Daily Wh / (Voltage * DoD * Efficiency)
    const requiredBatteryAh = Wh / (systemVoltage * depthOfDischarge * batteryEfficiency);

    // Calculate solar panel wattage needed:
    // Solar Panel Wattage = Daily Wh / (Sun Hours * (1 - systemLosses))
    const requiredSolarWattage = Wh / (sunHours * (1 - systemLosses));

    // Safety feedback
    let feedback = "";
    if (Ah < requiredBatteryAh) {
      feedback += `Your battery capacity (${Ah.toFixed(
        1
      )} Ah) is below the recommended minimum (${requiredBatteryAh.toFixed(
        1
      )} Ah). Consider increasing battery size to avoid deep discharges and extend battery life. `;
    } else {
      feedback += "Battery capacity is sufficient for the given load. ";
    }
    if (requiredSolarWattage > 1000) {
      feedback +=
        "Recommended solar panel wattage is quite high; consider load reduction or multiple panel arrays.";
    } else {
      feedback += "Solar panel wattage is within typical residential off-grid system range.";
    }

    return {
      primary: `${requiredSolarWattage.toFixed(0)} W`,
      secondary: "Recommended Solar Panel Wattage",
      details: `Minimum Battery Capacity: ${requiredBatteryAh.toFixed(
        1
      )} Ah @ 12V system voltage.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to consider Depth of Discharge (DoD) when sizing batteries?",
      answer:
        "Depth of Discharge (DoD) is critical because it defines how much of the battery's capacity can be safely used without significantly shortening its lifespan. For example, lead-acid batteries typically should not be discharged beyond 50% to avoid damage. Oversizing the battery bank ensures longer battery life and system reliability. Ignoring DoD can lead to premature battery failure and increased replacement costs.",
    },
    {
      question: "How do peak sun hours affect solar panel sizing?",
      answer:
        "Peak sun hours represent the equivalent number of hours per day when solar irradiance averages 1000 W/m². This value varies by location and season. Solar panel wattage must be sized inversely proportional to peak sun hours; fewer sun hours require larger panel capacity to generate the same daily energy. Accurate sun hour data ensures the system can meet energy needs consistently.",
    },
    {
      question: "What system losses should I consider in off-grid solar sizing?",
      answer:
        "System losses include inefficiencies in wiring, charge controllers, inverters, and battery charging/discharging. Typically, a 15-25% loss is assumed to account for these factors. Including system losses in calculations ensures the solar array and battery bank are adequately sized to compensate for real-world inefficiencies, preventing underperformance.",
    },
    {
      question: "Can I use this calculator for different system voltages?",
      answer:
        "This calculator assumes a 12V system voltage, which is common for small off-grid setups. For 24V or 48V systems, you should adjust the battery capacity calculations accordingly by dividing the watt-hours by the system voltage. However, solar panel wattage sizing based on daily energy and sun hours remains the same. Always verify system voltage compatibility when designing your system.",
    },
    {
      question: "Why is battery efficiency important in sizing calculations?",
      answer:
        "Battery efficiency accounts for energy lost during charging and discharging cycles. Not all the energy stored in the battery is usable due to internal resistance and chemical processes. Incorporating battery efficiency into sizing ensures you have enough capacity to meet your energy needs after these losses, leading to a more reliable and durable system.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A cabin off-grid system requires 3000 Wh daily energy consumption. The battery bank is rated at 200 Ah at 12V. The location receives an average of 5 peak sun hours per day.",
    steps: [
      {
        label: "Step 1: Calculate minimum battery capacity",
        explanation:
          "Using the formula: Battery Ah = Wh / (Voltage × DoD × Efficiency) = 3000 / (12 × 0.5 × 0.85) ≈ 588 Ah. The existing 200 Ah battery is insufficient.",
      },
      {
        label: "Step 2: Calculate solar panel wattage",
        explanation:
          "Solar panel wattage = Wh / (Sun Hours × (1 - Losses)) = 3000 / (5 × 0.8) = 750 W. Panels should be sized around 750 W to meet daily needs.",
      },
      {
        label: "Step 3: Interpret results",
        explanation:
          "The battery bank should be expanded to at least 588 Ah to avoid deep discharges. The solar array should be about 750 W to recharge the batteries fully each day.",
      },
    ],
    result:
      "Recommended solar panel wattage: 750 W. Recommended battery capacity: 588 Ah @ 12V. Current battery bank is undersized and should be increased for system longevity.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "National Renewable Energy Laboratory (NREL) - Solar Radiation Data",
      description:
        "Provides detailed solar radiation and peak sun hour data for system design.",
      url: "https://www.nrel.gov/grid/solar-resource/solar-data.html",
    },
    {
      title: "Battery University - Battery Basics",
      description:
        "Comprehensive resource on battery types, efficiency, and depth of discharge.",
      url: "https://batteryuniversity.com/article/bu-808a-understanding-battery-capacity",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wattHours">Daily Energy Consumption (Wh)</Label>
          <Input
            id="wattHours"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 3000"
            value={inputs.wattHours}
            onChange={(e) => handleInputChange("wattHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ampHours">Battery Capacity (Ah)</Label>
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-4" />
            <p className="text-sm text-amber-900 dark:text-amber-300 font-semibold">{results.feedback}</p>
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
            Enter your daily energy consumption in watt-hours (Wh). This is the total energy your system will use in a day.
          </li>
          <li>
            Input your current or planned battery capacity in amp-hours (Ah) at 12 volts.
          </li>
          <li>
            Enter the average peak sun hours your location receives per day. This value can be found from solar resource maps or local data.
          </li>
          <li>
            Click "Calculate" to see the recommended solar panel wattage and minimum battery capacity needed for your off-grid system.
          </li>
          <li>
            Review the safety feedback and sizing details to ensure your system is properly designed.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Off-Grid System Sizing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Designing an off-grid solar system requires careful consideration of energy consumption, battery storage, and solar panel capacity. The daily energy consumption (Wh) defines how much energy your loads require. Battery capacity (Ah) determines how much energy can be stored and delivered, factoring in depth of discharge and efficiency losses. Peak sun hours influence how much solar energy can be harvested each day.
          </p>
          <p>
            This calculator uses standard engineering formulas to estimate the minimum battery capacity and solar panel wattage needed to meet your energy demands reliably. It assumes a 12V system, 50% depth of discharge for lead-acid batteries, 85% battery efficiency, and 20% system losses. Adjust these assumptions if you use different battery chemistries or system voltages.
          </p>
          <p>
            Proper sizing ensures system longevity, prevents battery damage, and guarantees energy availability. Oversizing components increases cost but improves reliability, while undersizing risks system failure and shortened equipment life.
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
            <strong>Warning:</strong> Electricity is dangerous and can cause injury or death. Always follow local electrical codes and consult a licensed electrician or engineer when designing and installing off-grid systems.
          </p>
          <p>
            A common mistake is undersizing the battery bank, which leads to deep discharges that drastically reduce battery life. Always factor in depth of discharge and battery efficiency.
          </p>
          <p>
            Another frequent error is ignoring system losses such as wiring resistance, inverter inefficiency, and charge controller losses. These can add up to 20% or more, so always include a safety margin.
          </p>
          <p>
            Using inaccurate peak sun hour data can cause underperformance. Use reliable solar resource data for your specific location.
          </p>
          <p>
            Finally, never mix battery chemistries or use mismatched components without expert advice, as this can cause system instability or hazards.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <article className="prose prose-slate dark:prose-invert">
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
        </article>
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
      title="Off-Grid System Sizing Calculator"
      description="Professional electrical calculator: Off-Grid System Sizing Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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