import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SolarBatteryBankSizingCalculator() {
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
   * Calculation Logic:
   * 
   * Inputs:
   * - Wh (Watt-hours): Total daily energy consumption in watt-hours.
   * - Ah (Amp-hours): Battery capacity in amp-hours (optional, used for validation).
   * - Sun Hours: Average peak sun hours per day.
   * 
   * Outputs:
   * - Required Battery Bank Capacity in Ah (Amp-hours)
   * - Recommended Battery Voltage (default 12V)
   * - Details and safety feedback
   * 
   * Formula:
   * Battery Bank Capacity (Ah) = (Daily Energy Consumption Wh) / (Battery Voltage V * Depth of Discharge)
   * 
   * We assume:
   * - Battery Voltage = 12V (common for solar battery banks)
   * - Depth of Discharge (DoD) = 50% (0.5) for lead-acid batteries to prolong life
   * 
   * If user inputs Ah, we can compare it to calculated required Ah.
   */

  const BATTERY_VOLTAGE = 12; // Volts
  const DEPTH_OF_DISCHARGE = 0.5; // 50%

  const results = useMemo(() => {
    const Wh = parseFloat(inputs.wattHours);
    const AhInput = parseFloat(inputs.ampHours);
    const sunHours = parseFloat(inputs.sunHours);

    if (
      isNaN(Wh) ||
      Wh <= 0 ||
      isNaN(sunHours) ||
      sunHours <= 0
    ) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details: "Please enter positive numbers for Watt-hours and Sun Hours.",
        feedback: "",
      };
    }

    // Calculate required battery bank capacity in Ah
    // Battery Capacity (Ah) = Wh / (V * DoD)
    const requiredAh = Wh / (BATTERY_VOLTAGE * DEPTH_OF_DISCHARGE);

    // Calculate required solar panel wattage to recharge battery daily (not required but useful)
    // Solar Panel Wattage = Wh / sunHours / system efficiency (assumed 0.8)
    const SYSTEM_EFFICIENCY = 0.8;
    const requiredPanelWatts = Wh / sunHours / SYSTEM_EFFICIENCY;

    // Feedback on user input Ah vs required Ah
    let feedback = "";
    if (!isNaN(AhInput) && AhInput > 0) {
      if (AhInput < requiredAh) {
        feedback =
          "Warning: Your battery capacity (Ah) is less than the recommended size. This may lead to frequent deep discharges and reduce battery life.";
      } else {
        feedback =
          "Your battery capacity meets or exceeds the recommended size. This will help ensure longer battery life and reliable energy storage.";
      }
    } else {
      feedback =
        "Enter your battery capacity (Ah) to compare with the recommended size.";
    }

    return {
      primary: requiredAh.toFixed(1),
      secondary: "Battery Bank Capacity (Ah)",
      details: `Based on ${Wh} Wh daily consumption, ${sunHours} peak sun hours, ${BATTERY_VOLTAGE}V system voltage, and 50% depth of discharge.`,
      feedback,
      requiredPanelWatts: requiredPanelWatts.toFixed(0),
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we use 50% Depth of Discharge (DoD) for battery sizing?",
      answer:
        "Depth of Discharge (DoD) refers to the percentage of the battery's capacity that has been used. For lead-acid batteries, discharging beyond 50% regularly can significantly shorten battery life. Therefore, to maximize battery longevity and reliability, it is standard practice to size the battery bank so that only up to 50% of its capacity is used daily. This means you need to double the usable capacity to ensure the battery bank can handle your daily energy consumption safely.",
    },
    {
      question: "How does the number of sun hours affect battery bank sizing?",
      answer:
        "Sun hours represent the average number of peak sunlight hours per day your solar panels receive. While sun hours primarily affect the size of the solar panel array needed to recharge the battery, they indirectly influence battery sizing because insufficient sun hours may require a larger battery bank to store enough energy for cloudy days or extended periods without sunlight. Accurately knowing your location's sun hours helps optimize both solar panel and battery bank sizes for reliable off-grid power.",
    },
    {
      question: "Can I use this calculator for lithium batteries?",
      answer:
        "This calculator assumes a 50% Depth of Discharge typical for lead-acid batteries. Lithium batteries generally allow deeper discharges (up to 80-90%) without damaging the battery, which means you can size your battery bank smaller for the same usable capacity. If you use lithium batteries, adjust the Depth of Discharge accordingly (e.g., 0.8 or 0.9) in the formula to get a more accurate battery bank size.",
    },
    {
      question: "Why is battery voltage fixed at 12V in this calculator?",
      answer:
        "12V is the most common nominal voltage for small to medium solar battery banks and is widely used in residential and off-grid applications. Larger systems may use 24V or 48V battery banks to reduce current and improve efficiency. This calculator uses 12V for simplicity and general applicability. For higher voltage systems, you can adjust the formula accordingly or consult a professional for detailed system design.",
    },
    {
      question: "What safety considerations should I keep in mind when sizing and installing a battery bank?",
      answer:
        "Battery banks store significant amounts of energy and can be hazardous if improperly handled. Always ensure proper ventilation to avoid gas buildup, use appropriate fusing and disconnects to prevent short circuits, and follow manufacturer guidelines for wiring and installation. Oversizing the battery bank can increase costs and complexity, while undersizing can lead to deep discharges and reduced battery life. Consulting with a qualified electrician or solar professional is recommended for safe and compliant installations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a small off-grid cabin with daily energy consumption of 1200 Wh. The location receives an average of 5 peak sun hours per day. You want to size a 12V battery bank with a 50% depth of discharge.",
    steps: [
      {
        label: "Step 1: Calculate required battery capacity",
        explanation:
          "Battery Capacity (Ah) = Daily Wh / (Voltage * Depth of Discharge) = 1200 / (12 * 0.5) = 200 Ah",
      },
      {
        label: "Step 2: Determine solar panel wattage needed",
        explanation:
          "Solar Panel Wattage = Daily Wh / (Sun Hours * System Efficiency) = 1200 / (5 * 0.8) = 300 W",
      },
      {
        label: "Step 3: Select battery bank",
        explanation:
          "Choose a battery bank with at least 200 Ah capacity at 12V to ensure reliable power and battery longevity.",
      },
    ],
    result:
      "A 12V, 200Ah battery bank paired with a 300W solar panel array is recommended for this scenario.",
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
        "Comprehensive resource on battery technologies and best practices.",
      url: "https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries",
    },
    {
      title: "NREL - Solar Radiation Data",
      description:
        "National Renewable Energy Laboratory's solar radiation data for accurate sun hour estimation.",
      url: "https://www.nrel.gov/grid/solar-resource/solar-data.html",
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
            placeholder="e.g. 1200"
            value={inputs.wattHours}
            onChange={(e) => handleInputChange("wattHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ampHours">Battery Capacity (Ah) (Optional)</Label>
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
          <Label htmlFor="sunHours">Average Sun Hours per Day</Label>
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
            <Separator className="my-4" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{results.feedback}</p>
            {results.requiredPanelWatts && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Recommended Solar Panel Wattage: <strong>{results.requiredPanelWatts} W</strong>
              </p>
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
            Enter your total daily energy consumption in watt-hours (Wh). This is the total energy your devices use in a day.
          </li>
          <li>
            Optionally, enter your current or planned battery capacity in amp-hours (Ah) to compare with the recommended size.
          </li>
          <li>
            Enter the average peak sun hours per day for your location. This is the average number of hours per day when solar irradiance is at peak levels.
          </li>
          <li>
            Click "Calculate" to see the recommended battery bank capacity in amp-hours and the suggested solar panel wattage.
          </li>
          <li>
            Use the results to size your battery bank and solar panel array appropriately for reliable off-grid power.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Solar Battery Bank Sizing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Sizing a solar battery bank correctly is critical for ensuring that your off-grid or backup power system can reliably meet your energy needs without damaging the batteries. The key parameters involved in sizing are your daily energy consumption (in watt-hours), the battery voltage, the depth of discharge (DoD) of the battery, and the average peak sun hours your location receives.
          </p>
          <p>
            The battery bank capacity is calculated by dividing your daily energy consumption by the product of battery voltage and depth of discharge. This ensures that you only use a safe portion of the battery's capacity, prolonging its lifespan. For example, lead-acid batteries typically have a recommended DoD of 50%, meaning you should only use half of the battery's capacity daily.
          </p>
          <p>
            Additionally, knowing the average sun hours helps determine the size of the solar panel array needed to recharge the battery bank fully each day. System efficiency losses, such as inverter and charge controller losses, are also considered in the calculation.
          </p>
          <p>
            This calculator provides a quick and accurate way to estimate the battery bank size and solar panel wattage needed for your system, helping you design a safe, efficient, and cost-effective solar power setup.
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
            <strong>Warning:</strong> Electricity and batteries can be dangerous if not handled properly. Always follow manufacturer guidelines and local electrical codes when installing battery banks.
          </p>
          <p>
            Common mistakes include undersizing the battery bank, which leads to frequent deep discharges and short battery life, and oversizing without considering cost and space constraints.
          </p>
          <p>
            Ensure proper ventilation for batteries to prevent gas buildup, use appropriate fuses and disconnects, and avoid mixing different battery types or ages in the same bank.
          </p>
          <p>
            Consult a qualified electrician or solar professional for system design and installation to ensure safety and compliance.
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
      title="Solar Battery Bank Sizing Calculator"
      description="Professional electrical calculator: Solar Battery Bank Sizing Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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