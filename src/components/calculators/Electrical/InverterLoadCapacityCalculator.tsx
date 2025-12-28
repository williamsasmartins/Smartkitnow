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

export default function InverterLoadCapacityCalculator() {
  /**
   * Inputs:
   * val1: Wh (Watt-hours) - total energy consumption per day
   * val2: Ah (Amp-hours) - battery capacity available
   * val3: Sun Hours - average peak sun hours per day
   *
   * Logic:
   * 1. Calculate the average continuous load in Watts:
   *    Load (W) = Wh / 24 (hours)
   * 2. Calculate the inverter load capacity needed to support the load.
   * 3. Calculate the battery capacity in Wh (Ah * Battery Voltage, assume 12V nominal).
   * 4. Calculate the solar panel wattage needed based on sun hours and load.
   */

  const [inputs, setInputs] = useState({
    val1: "", // Wh
    val2: "", // Ah
    val3: "", // Sun Hours
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const Wh = parseFloat(inputs.val1);
    const Ah = parseFloat(inputs.val2);
    const sunHours = parseFloat(inputs.val3);

    if (isNaN(Wh) || Wh <= 0) {
      return {
        primary: "—",
        secondary: "Invalid Input",
        details: "Please enter a valid Watt-hour (Wh) consumption value.",
        feedback: "",
      };
    }
    if (isNaN(Ah) || Ah <= 0) {
      return {
        primary: "—",
        secondary: "Invalid Input",
        details: "Please enter a valid battery capacity in Amp-hours (Ah).",
        feedback: "",
      };
    }
    if (isNaN(sunHours) || sunHours <= 0) {
      return {
        primary: "—",
        secondary: "Invalid Input",
        details: "Please enter a valid average peak sun hours value.",
        feedback: "",
      };
    }

    // Constants
    const batteryVoltage = 12; // volts, nominal battery voltage
    const inverterEfficiency = 0.9; // 90% efficiency assumed
    const depthOfDischarge = 0.5; // 50% recommended max DOD for lead acid batteries

    // 1. Average continuous load in Watts
    const avgLoadW = Wh / 24;

    // 2. Required inverter capacity (W) - add 20% safety margin
    const inverterCapacityW = avgLoadW / inverterEfficiency * 1.2;

    // 3. Battery capacity in Wh (usable)
    const batteryCapacityWh = Ah * batteryVoltage * depthOfDischarge;

    // 4. Solar panel wattage needed (W)
    // Solar panel wattage = daily Wh / sun hours / system efficiency
    // Assume system efficiency (charge controller, wiring losses) ~ 80%
    const systemEfficiency = 0.8;
    const solarPanelWattage = Wh / sunHours / systemEfficiency;

    // Feedback safety check
    let feedback = "";
    if (batteryCapacityWh < Wh) {
      feedback =
        "Warning: Your battery capacity (usable) is less than your daily energy consumption. This may cause deep discharge and reduce battery life.";
    } else if (inverterCapacityW < avgLoadW) {
      feedback =
        "Warning: Calculated inverter capacity is less than average load. Consider increasing inverter size.";
    } else {
      feedback = "Your system sizing looks adequate based on inputs.";
    }

    return {
      primary: inverterCapacityW.toFixed(0),
      secondary: "Inverter Capacity (Watts)",
      details: `Average load: ${avgLoadW.toFixed(
        1
      )} W, Battery usable capacity: ${batteryCapacityWh.toFixed(
        0
      )} Wh, Solar panel wattage needed: ${solarPanelWattage.toFixed(0)} W`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to consider inverter efficiency in calculations?",
      answer:
        "Inverter efficiency represents the energy lost during the DC to AC conversion process. Most inverters operate at around 85-95% efficiency. Ignoring this factor can lead to undersized inverters that cannot handle the actual load, causing system failures or damage. Including inverter efficiency ensures the inverter can supply the required power reliably.",
    },
    {
      question: "What is the significance of Depth of Discharge (DoD) for batteries?",
      answer:
        "Depth of Discharge (DoD) indicates the percentage of battery capacity that can be safely used without significantly shortening battery life. For lead-acid batteries, a typical recommended DoD is 50%, meaning only half the battery capacity should be used before recharging. Exceeding this can cause premature battery degradation and failure.",
    },
    {
      question: "How do average peak sun hours affect solar panel sizing?",
      answer:
        "Average peak sun hours represent the equivalent number of hours per day when solar irradiance is at its peak (1,000 W/m²). This value varies by location and season. Solar panel sizing depends on these hours because it determines how much energy panels can generate daily. Lower sun hours require larger panels to meet energy demands.",
    },
    {
      question: "Can I use this calculator for off-grid and grid-tied systems?",
      answer:
        "This calculator is primarily designed for off-grid renewable energy systems where battery storage and inverter sizing are critical. Grid-tied systems often have different design considerations, such as net metering and grid support, so additional calculations and components may be required.",
    },
    {
      question: "Why is a safety margin added to the inverter capacity?",
      answer:
        "A safety margin (commonly 20%) is added to inverter capacity calculations to accommodate surge loads, inefficiencies, and future load increases. Electrical devices often have startup surges or transient loads that exceed their running power. The margin ensures the inverter can handle these without tripping or damage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to run a small off-grid cabin with daily energy consumption of 1200 Wh. Your battery bank is rated at 100 Ah at 12 V, and your location receives an average of 5 peak sun hours per day.",
    steps: [
      {
        label: "Step 1: Calculate average continuous load",
        explanation: "1200 Wh / 24 hours = 50 W average load.",
      },
      {
        label: "Step 2: Calculate inverter capacity",
        explanation:
          "50 W / 0.9 inverter efficiency * 1.2 safety margin = 67 W inverter capacity needed.",
      },
      {
        label: "Step 3: Calculate usable battery capacity",
        explanation:
          "100 Ah * 12 V * 0.5 DoD = 600 Wh usable battery capacity.",
      },
      {
        label: "Step 4: Calculate solar panel wattage",
        explanation:
          "1200 Wh / 5 sun hours / 0.8 system efficiency = 300 W solar panel wattage needed.",
      },
    ],
    result:
      "You should select an inverter rated for at least 70 W, a battery bank with at least 600 Wh usable capacity, and solar panels totaling around 300 W to meet your energy needs safely.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "Battery University - Depth of Discharge",
      description:
        "Comprehensive guide on battery DoD and its impact on battery life.",
      url: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries",
    },
    {
      title: "Solar Energy Basics - NREL",
      description:
        "National Renewable Energy Laboratory's guide on solar energy fundamentals including peak sun hours.",
      url: "https://www.nrel.gov/research/re-solar.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wh-input">Daily Energy Consumption (Wh)</Label>
          <Input
            id="wh-input"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1200"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ah-input">Battery Capacity (Ah)</Label>
          <Input
            id="ah-input"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 100"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sunhours-input">Average Peak Sun Hours</Label>
          <Input
            id="sunhours-input"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 5"
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
            <Separator className="my-4" />
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-400">
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
            Enter your total daily energy consumption in Watt-hours (Wh). This
            is the sum of all electrical loads you expect to run in a day.
          </li>
          <li>
            Enter your battery bank capacity in Amp-hours (Ah). This is the
            nominal rating of your battery bank.
          </li>
          <li>
            Enter the average peak sun hours for your location. This value
            represents the average number of hours per day when solar
            irradiance is at peak levels.
          </li>
          <li>
            Click "Calculate" to see the recommended inverter capacity, battery
            usable capacity, and solar panel wattage needed.
          </li>
          <li>
            Review the safety feedback and adjust your system design accordingly.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Inverter Load Capacity Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The inverter load capacity calculator helps renewable energy system
            designers and installers size the inverter, battery bank, and solar
            panels based on daily energy consumption and solar resource
            availability. The inverter converts DC power from batteries or solar
            panels into usable AC power for household appliances.
          </p>
          <p>
            The calculator uses your daily energy consumption (Wh) to estimate
            the average continuous load in Watts, which is then adjusted for
            inverter efficiency and a safety margin to recommend inverter
            capacity. Battery capacity is converted from Amp-hours to Watt-hours
            and adjusted for recommended depth of discharge to ensure battery
            longevity.
          </p>
          <p>
            Solar panel wattage is calculated based on the daily energy needs,
            average peak sun hours, and system efficiency losses such as wiring
            and charge controller inefficiencies. This ensures your solar array
            can generate enough energy to meet daily consumption.
          </p>
          <p>
            Proper sizing of these components is critical to system reliability,
            efficiency, and safety. Undersized inverters can fail or cause
            damage, while undersized batteries can lead to deep discharges and
            shortened battery life. Oversizing components increases cost but
            improves system resilience.
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
            <strong>Warning:</strong> Electricity and battery systems can be
            hazardous if not designed or installed properly. Always follow
            manufacturer guidelines and local electrical codes.
          </p>
          <p>
            A common mistake is undersizing the inverter, which can cause it to
            overheat or fail when starting motors or surge loads. Always include
            a safety margin.
          </p>
          <p>
            Another frequent error is ignoring battery depth of discharge (DoD).
            Using more than the recommended DoD reduces battery lifespan and can
            cause permanent damage.
          </p>
          <p>
            Incorrect estimation of peak sun hours can lead to undersized solar
            arrays, resulting in insufficient energy generation and battery
            depletion.
          </p>
          <p>
            Always consult with a qualified electrical engineer or renewable
            energy professional when designing or modifying your system.
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
      title="Inverter Load Capacity Calculator"
      description="Professional electrical calculator: Inverter Load Capacity Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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