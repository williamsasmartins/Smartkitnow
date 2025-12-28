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

export default function SolarPanelOutputArraySizingCalculator() {
  // Inputs:
  // val1 = Daily Energy Consumption in Wh (Watt-hours)
  // val2 = Battery Capacity in Ah (Amp-hours)
  // val3 = Average Sun Hours per Day

  const [inputs, setInputs] = useState({
    val1: "",
    val2: "",
    val3: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Only allow numeric input and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Constants for calculations
  // Assume system voltage 12V for battery capacity conversion (common in solar setups)
  const SYSTEM_VOLTAGE = 12;

  // Safety factor for solar array sizing (to account for losses, shading, inefficiencies)
  const SAFETY_FACTOR = 1.25;

  // Calculate solar panel wattage needed and array sizing
  const results = useMemo(() => {
    const Wh = parseFloat(inputs.val1);
    const Ah = parseFloat(inputs.val2);
    const sunHours = parseFloat(inputs.val3);

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

    // Calculate required solar panel wattage:
    // Solar Panel Wattage (W) = Daily Energy Consumption (Wh) / Sun Hours * Safety Factor
    const panelWattage = (Wh / sunHours) * SAFETY_FACTOR;

    // Calculate battery capacity in Wh:
    // Battery Capacity (Wh) = Ah * System Voltage
    const batteryCapacityWh = Ah * SYSTEM_VOLTAGE;

    // Calculate how many panels needed if using a standard panel wattage (e.g., 300W)
    // This is optional, but useful for array sizing
    const STANDARD_PANEL_WATTAGE = 300;
    const panelsNeeded = Math.ceil(panelWattage / STANDARD_PANEL_WATTAGE);

    // Feedback on battery sizing relative to consumption
    let batteryFeedback = "";
    if (batteryCapacityWh < Wh) {
      batteryFeedback =
        "Warning: Battery capacity is less than daily energy consumption, which may cause power shortages.";
    } else if (batteryCapacityWh < Wh * 1.5) {
      batteryFeedback =
        "Battery capacity is slightly above daily consumption; consider larger capacity for autonomy.";
    } else {
      batteryFeedback = "Battery capacity is sufficient for daily consumption.";
    }

    return {
      primary: panelWattage.toFixed(1),
      secondary: "Solar Panel Wattage (W)",
      details: `To meet your daily consumption of ${Wh} Wh with ${sunHours} sun hours/day, you need approximately ${panelWattage.toFixed(
        1
      )} W of solar panels. This corresponds to about ${panelsNeeded} x ${STANDARD_PANEL_WATTAGE}W panels.`,
      feedback: batteryFeedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to multiply by a safety factor when sizing solar panels?",
      answer:
        "Solar panels rarely operate at their rated capacity due to factors such as shading, dirt accumulation, temperature variations, and inverter inefficiencies. The safety factor (commonly 1.2 to 1.3) compensates for these losses to ensure the system reliably meets energy demands even under less-than-ideal conditions. Without this margin, the system might underperform, leading to insufficient energy generation.",
    },
    {
      question: "How does the number of sun hours affect solar panel sizing?",
      answer:
        "Sun hours represent the average number of peak sunlight hours available per day at your location. The more sun hours you have, the less solar panel wattage you need to generate the same amount of energy. Conversely, locations with fewer sun hours require larger solar arrays to compensate for reduced daily solar energy input. Accurate sun hour data is critical for precise system sizing.",
    },
    {
      question: "Why is battery capacity expressed in amp-hours (Ah) and how is it related to watt-hours (Wh)?",
      answer:
        "Battery capacity in amp-hours (Ah) measures the charge stored, but to understand the actual energy stored, you need watt-hours (Wh), which accounts for voltage. The relationship is Wh = Ah × Voltage. For example, a 100Ah battery at 12V stores 1200Wh of energy. This conversion is essential for comparing battery capacity to energy consumption and solar panel output.",
    },
    {
      question: "Can I use this calculator for systems with voltages other than 12V?",
      answer:
        "This calculator assumes a 12V system voltage for battery capacity conversion. If your system uses a different voltage (e.g., 24V or 48V), you should adjust the battery capacity input accordingly or convert Ah to Wh externally before using the calculator. Accurate voltage consideration is important for proper system design and component compatibility.",
    },
    {
      question: "What are common mistakes when sizing solar panel arrays and batteries?",
      answer:
        "Common mistakes include underestimating daily energy consumption, ignoring system losses, not accounting for seasonal variations in sun hours, and selecting batteries without considering depth of discharge or efficiency. Additionally, failing to include a safety margin can result in insufficient power generation. Proper planning and conservative assumptions help avoid these pitfalls.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to power a small off-grid cabin that consumes 1200 Wh per day. You have a 100 Ah, 12V battery bank and receive an average of 5 sun hours per day.",
    steps: [
      {
        label: "Step 1: Calculate required solar panel wattage",
        explanation:
          "Divide daily energy consumption by sun hours and multiply by safety factor: (1200 Wh / 5 h) × 1.25 = 300 W needed.",
      },
      {
        label: "Step 2: Determine battery capacity in watt-hours",
        explanation:
          "Battery capacity = 100 Ah × 12 V = 1200 Wh, which matches daily consumption but offers no reserve.",
      },
      {
        label: "Step 3: Decide on solar panel array",
        explanation:
          "Using 300W panels, you need 1 panel (300 W / 300 W = 1). Consider adding more panels for cloudy days.",
      },
      {
        label: "Step 4: Safety and sizing considerations",
        explanation:
          "Since battery capacity equals daily consumption, consider increasing battery size for autonomy and longer lifespan.",
      },
    ],
    result:
      "You need at least a 300W solar panel array and a 100Ah 12V battery bank to meet your daily energy needs, but increasing battery capacity is recommended for reliability.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "NREL Solar Radiation Data",
      description:
        "National Renewable Energy Laboratory provides solar radiation and sun hour data by location.",
      url: "https://www.nrel.gov/grid/solar-resource/solar-data.html",
    },
    {
      title: "Battery University - Battery Capacity",
      description:
        "Comprehensive resource on battery types, capacity, and performance considerations.",
      url: "https://batteryuniversity.com/article/bu-808-how-to-measure-battery-capacity",
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
          <Label htmlFor="sunhours-input">Average Sun Hours per Day</Label>
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
            <p className="text-sm font-semibold text-amber-900">{results.feedback}</p>
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
            Enter your average daily energy consumption in watt-hours (Wh). This is the total energy your
            devices use per day.
          </li>
          <li>
            Enter your battery bank capacity in amp-hours (Ah). This is the total charge your batteries can
            store.
          </li>
          <li>
            Enter the average number of sun hours per day for your location. This is the peak sunlight
            duration your panels will receive.
          </li>
          <li>
            Click "Calculate" to see the recommended solar panel wattage and array sizing needed to meet
            your energy needs.
          </li>
          <li>
            Review the feedback on battery capacity to ensure your storage is sufficient for your daily
            consumption.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Solar Panel Output & Array Sizing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Solar panel output and array sizing are critical steps in designing an efficient and reliable
            photovoltaic system. The goal is to ensure that the solar array can generate enough energy to
            meet daily consumption while accounting for system losses and environmental factors.
          </p>
          <p>
            The calculator uses your daily energy consumption (Wh) and divides it by the average sun hours
            per day to estimate the minimum solar panel wattage required. A safety factor is applied to
            compensate for inefficiencies such as shading, temperature effects, inverter losses, and panel
            degradation.
          </p>
          <p>
            Battery capacity is converted from amp-hours (Ah) to watt-hours (Wh) using the system voltage,
            typically 12V for small systems. This allows comparison of stored energy to daily consumption,
            helping you assess if your battery bank is sufficient or needs to be upsized.
          </p>
          <p>
            Proper sizing ensures your solar system can reliably power your loads, maintain battery health,
            and provide autonomy during periods of low sunlight.
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
            <strong>Warning:</strong> Electricity and solar power systems can be hazardous if improperly
            designed or installed. Always follow local electrical codes and consult a licensed electrician
            or solar professional.
          </p>
          <p>
            Common mistakes include underestimating energy consumption, ignoring system losses, and
            selecting batteries without considering depth of discharge or voltage compatibility. These
            errors can lead to system failure, reduced battery life, or unsafe conditions.
          </p>
          <p>
            Always include a safety margin in your calculations and verify your system components are rated
            for the expected loads and environmental conditions.
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
      title="Solar Panel Output & Array Sizing Calculator"
      description="Professional electrical calculator: Solar Panel Output & Array Sizing Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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