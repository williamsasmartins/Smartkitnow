import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EvChargingTimeCalculator() {
  /**
   * Inputs:
   * val1: Battery Capacity (kWh)
   * val2: Charger Power (kW)
   * val3: Charging Efficiency (%) - optional, default 90%
   */
  const [inputs, setInputs] = useState({
    val1: "", // Battery Capacity (kWh)
    val2: "", // Charger Power (kW)
    val3: "90", // Charging Efficiency (%)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Calculation logic:
   * Charging Time (hours) = Battery Capacity (kWh) / (Charger Power (kW) * Efficiency)
   * Efficiency is a decimal (e.g., 90% = 0.9)
   */
  const results = useMemo(() => {
    const batteryCapacity = parseFloat(inputs.val1);
    const chargerPower = parseFloat(inputs.val2);
    let efficiency = parseFloat(inputs.val3);

    if (isNaN(batteryCapacity) || batteryCapacity <= 0) {
      return {
        primary: "—",
        secondary: "Invalid Battery Capacity",
        details: "Please enter a valid battery capacity in kWh.",
        feedback: "",
      };
    }
    if (isNaN(chargerPower) || chargerPower <= 0) {
      return {
        primary: "—",
        secondary: "Invalid Charger Power",
        details: "Please enter a valid charger power in kW.",
        feedback: "",
      };
    }
    if (isNaN(efficiency) || efficiency <= 0 || efficiency > 100) {
      efficiency = 90; // default to 90%
    }

    const efficiencyDecimal = efficiency / 100;
    const chargingTime = batteryCapacity / (chargerPower * efficiencyDecimal);

    // Format charging time in hours and minutes
    const hours = Math.floor(chargingTime);
    const minutes = Math.round((chargingTime - hours) * 60);

    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      if (hours > 0) formattedTime += " ";
      formattedTime += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    if (formattedTime === "") formattedTime = "< 1 minute";

    return {
      primary: formattedTime,
      secondary: "Estimated Charging Time",
      details: `Calculated using battery capacity of ${batteryCapacity} kWh, charger power of ${chargerPower} kW, and charging efficiency of ${efficiency}%.`,
      feedback:
        "Note: Actual charging time may vary due to battery state, temperature, and charger characteristics.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we need to consider charging efficiency?",
      answer:
        "Charging efficiency accounts for energy losses during the charging process, including heat dissipation and power conversion inefficiencies. Typically, EV chargers operate at around 85-95% efficiency. Ignoring efficiency can underestimate charging time, leading to unrealistic expectations. Including efficiency provides a more accurate estimate of the actual time required to fully charge the EV battery.",
    },
    {
      question: "Can I use this calculator for all types of EV chargers?",
      answer:
        "This calculator provides a general estimate based on charger power rating and battery capacity. It applies to Level 1 (120V), Level 2 (240V), and DC fast chargers, as long as you input the correct charger power in kilowatts. However, real-world charging times may vary due to charger tapering, battery management system limitations, and environmental factors.",
    },
    {
      question: "How does battery capacity affect charging time?",
      answer:
        "Battery capacity, measured in kilowatt-hours (kWh), represents the total energy storage of the EV battery. Larger batteries require more energy to charge fully, resulting in longer charging times if charger power remains constant. This calculator directly relates battery capacity to charging time, helping users understand how battery size impacts charging duration.",
    },
    {
      question: "Why might actual charging times differ from the calculator's estimate?",
      answer:
        "Actual charging times can differ due to several factors: battery temperature, state of charge, charger power tapering as the battery nears full capacity, and electrical supply conditions. Additionally, some EVs limit charging speed to preserve battery health. This calculator provides an ideal estimate assuming constant charger power and efficiency.",
    },
    {
      question: "Is it safe to use high-power chargers for all EVs?",
      answer:
        "Not all EVs can accept high-power charging. The vehicle's onboard charger and battery management system determine the maximum charging rate. Using a charger with power exceeding the EV's capability will not speed up charging and may risk damage if not properly managed. Always consult your EV manufacturer's specifications before using high-power chargers.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 60 kWh EV battery and a Level 2 home charger rated at 7.2 kW. You want to estimate how long it will take to fully charge your EV assuming 90% charging efficiency.",
    steps: [
      {
        label: "Step 1: Enter Battery Capacity",
        explanation: "Input 60 kWh as the battery capacity of your EV.",
      },
      {
        label: "Step 2: Enter Charger Power",
        explanation: "Input 7.2 kW as the power rating of your Level 2 charger.",
      },
      {
        label: "Step 3: Enter Charging Efficiency",
        explanation:
          "Use the default 90% efficiency or adjust if you know your charger’s efficiency.",
      },
      {
        label: "Step 4: Calculate",
        explanation:
          "The calculator estimates the charging time as approximately 9 hours and 16 minutes.",
      },
    ],
    result:
      "This means it will take about 9 hours and 16 minutes to fully charge your 60 kWh battery using a 7.2 kW charger at 90% efficiency.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "U.S. Department of Energy - Electric Vehicle Charging",
      description:
        "Comprehensive guide on EV charging types, times, and safety considerations.",
      url: "https://afdc.energy.gov/fuels/electricity_charging.html",
    },
    {
      title: "SAE International - Electric Vehicle Charging Standards",
      description:
        "Technical standards and guidelines for EV charging infrastructure and safety.",
      url: "https://www.sae.org/standards/content/j1772_201710/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
          <Input
            id="batteryCapacity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chargerPower">Charger Power (kW)</Label>
          <Input
            id="chargerPower"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 7.2"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="efficiency">Charging Efficiency (%)</Label>
          <Input
            id="efficiency"
            type="number"
            min="1"
            max="100"
            step="any"
            placeholder="Default 90"
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
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-xs italic text-slate-600 dark:text-slate-400">
                  {results.feedback}
                </p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Enter your EV battery capacity in kilowatt-hours (kWh). This
            information is usually found in your vehicle’s specifications.
          </li>
          <li>
            Enter the power rating of your EV charger in kilowatts (kW). This
            can be found on the charger label or manufacturer documentation.
          </li>
          <li>
            Optionally, enter the charging efficiency as a percentage. If unsure,
            leave it at the default 90%.
          </li>
          <li>Click the Calculate button to get the estimated charging time.</li>
          <li>
            Review the result, which shows the estimated time to fully charge your
            EV battery under the given conditions.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to EV Charging Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The EV Charging Time Calculator estimates the time required to fully
            charge an electric vehicle battery based on three key parameters:
            battery capacity, charger power, and charging efficiency. Battery
            capacity is measured in kilowatt-hours (kWh) and represents the total
            energy storage of the EV battery. Charger power, measured in kilowatts
            (kW), indicates the rate at which energy is delivered to the battery.
          </p>
          <p>
            Charging efficiency accounts for losses during energy transfer,
            including heat generation and power conversion inefficiencies. Real
            charging efficiency typically ranges from 85% to 95%, depending on
            charger type and conditions.
          </p>
          <p>
            The calculator uses the formula: <br />
            <em>
              Charging Time (hours) = Battery Capacity (kWh) / (Charger Power (kW) ×
              Efficiency)
            </em>
            <br />
            This formula assumes a constant charging rate, which is a simplification
            because many chargers reduce power as the battery approaches full
            capacity to protect battery health.
          </p>
          <p>
            This tool is useful for planning charging sessions, understanding
            infrastructure needs, and comparing charger options. However, actual
            charging times may vary due to battery temperature, state of charge,
            charger tapering, and other factors.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity is dangerous and improper use of
            EV chargers can cause fire, electric shock, or damage to equipment.
            Always use chargers and cables rated for your EV and electrical
            system.
          </p>
          <p>
            Common mistakes include overestimating charger power capability, ignoring
            charging efficiency, and neglecting the vehicle’s maximum charging rate.
            These errors can lead to unrealistic charging time expectations and
            potential equipment damage.
          </p>
          <p>
            Never modify or bypass safety features on EV chargers. Ensure all
            electrical installations comply with local electrical codes and
            standards such as the NEC.
          </p>
          <p>
            Consult a licensed electrician for installation and maintenance of EV
            charging equipment.
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
      title="EV Charging Time Calculator"
      description="Professional electrical calculator: EV Charging Time Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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