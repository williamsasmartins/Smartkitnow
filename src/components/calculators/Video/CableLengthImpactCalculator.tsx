import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CableLengthImpactCalculator() {
  /*
    This calculator estimates the impact of cable length on signal quality and power loss
    for professional video and audio cables. It helps users understand how longer cables
    can degrade signal integrity, cause voltage drop, and affect overall performance.
  */

  const [inputs, setInputs] = useState({
    cableLength: "", // in meters or feet
    cableType: "hdmi", // cable type selection
    signalType: "digital", // digital or analog signal
    unit: "meters", // meters or feet
  });

  // Cable attenuation and max recommended lengths reference (approximate typical values)
  // Values are attenuation per 100m or max recommended length for signal integrity.
  // Source: industry standards and cable manufacturer datasheets.
  const cableSpecs: Record<
    string,
    {
      attenuationDbPer100m: number; // dB loss per 100 meters
      maxLengthMeters: number; // max recommended length for good signal
      description: string;
    }
  > = {
    hdmi: {
      attenuationDbPer100m: 10, // typical HDMI cable attenuation ~10dB/100m
      maxLengthMeters: 15, // recommended max length ~15m for passive cables
      description: "HDMI (High-Definition Multimedia Interface) cable",
    },
    sdI: {
      attenuationDbPer100m: 6, // SMPTE SDI cable ~6dB/100m
      maxLengthMeters: 100, // recommended max length ~100m for 3G-SDI
      description: "SDI (Serial Digital Interface) coaxial cable",
    },
    xlr: {
      attenuationDbPer100m: 2, // balanced audio XLR cable ~2dB/100m
      maxLengthMeters: 100, // recommended max length ~100m for mic level
      description: "XLR balanced audio cable",
    },
    trs: {
      attenuationDbPer100m: 3, // unbalanced TRS cable ~3dB/100m
      maxLengthMeters: 50, // recommended max length ~50m for line level
      description: "TRS (Tip-Ring-Sleeve) audio cable",
    },
    usb: {
      attenuationDbPer100m: 5, // USB 2.0 cable ~5dB/100m
      maxLengthMeters: 5, // recommended max length ~5m without active repeater
      description: "USB 2.0 cable",
    },
    ethernet: {
      attenuationDbPer100m: 10, // Cat5e/Cat6 cable ~10dB/100m
      maxLengthMeters: 100, // max length 100m for Ethernet
      description: "Ethernet (Cat5e/Cat6) cable",
    },
  };

  // Convert feet to meters if needed
  const convertToMeters = (length: number, unit: string) =>
    unit === "feet" ? length * 0.3048 : length;

  // Convert meters to feet if needed
  const convertToFeet = (length: number, unit: string) =>
    unit === "meters" ? length / 0.3048 : length;

  // Calculate attenuation in dB for given cable length
  const calculateAttenuationDb = (lengthMeters: number, cableType: string) => {
    const spec = cableSpecs[cableType];
    if (!spec) return 0;
    return (spec.attenuationDbPer100m * lengthMeters) / 100;
  };

  // Calculate signal loss percentage based on attenuation dB
  // Signal loss % = 100 * (1 - 10^(-attenuationDb/20))
  // This formula converts dB loss to linear loss ratio.
  const calculateSignalLossPercent = (attenuationDb: number) => {
    return 100 * (1 - Math.pow(10, -attenuationDb / 20));
  };

  // Calculate voltage drop percentage for power cables (approximate)
  // For video/audio cables, voltage drop is less relevant, but included for completeness.
  // Assume voltage drop proportional to cable length and resistance.
  // Here we just simulate a simple proportional drop.
  const calculateVoltageDropPercent = (lengthMeters: number, cableType: string) => {
    // Simplified model: voltage drop % = 0.1% per meter for demonstration
    return lengthMeters * 0.1;
  };

  // Determine if cable length exceeds recommended max length
  const isLengthExceedingMax = (lengthMeters: number, cableType: string) => {
    const spec = cableSpecs[cableType];
    if (!spec) return false;
    return lengthMeters > spec.maxLengthMeters;
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.cableLength);
    if (isNaN(lengthNum) || lengthNum <= 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter a valid cable length.",
        feedback: "",
      };
    }

    const lengthMeters = convertToMeters(lengthNum, inputs.unit);
    const spec = cableSpecs[inputs.cableType];
    if (!spec) {
      return {
        primary: "—",
        secondary: "",
        details: "Selected cable type is not supported.",
        feedback: "",
      };
    }

    const attenuationDb = calculateAttenuationDb(lengthMeters, inputs.cableType);
    const signalLossPercent = calculateSignalLossPercent(attenuationDb);
    const voltageDropPercent = calculateVoltageDropPercent(lengthMeters, inputs.cableType);
    const exceedsMax = isLengthExceedingMax(lengthMeters, inputs.cableType);

    // Compose result strings
    const primary = `${signalLossPercent.toFixed(2)}%`;
    const secondary = "Signal Loss";
    const details = `For a ${lengthNum} ${inputs.unit} ${spec.description}, estimated signal loss is ${signalLossPercent.toFixed(
      2
    )} dB attenuation of ${attenuationDb.toFixed(
      2
    )} dB. Voltage drop approx. ${voltageDropPercent.toFixed(2)}%. ${
      exceedsMax
        ? "Warning: Cable length exceeds recommended maximum length, which may cause signal degradation or failure."
        : "Cable length is within recommended limits."
    }`;

    const feedback = exceedsMax
      ? "Consider using an active repeater, signal booster, or higher quality cable to maintain signal integrity over longer distances."
      : "Cable length is optimal for maintaining signal quality.";

    return { primary, secondary, details, feedback };
  }, [inputs]);

  const faqs = [
    {
      question: "How does cable length affect video and audio signal quality?",
      answer:
        "Longer cable lengths increase signal attenuation, which can degrade video and audio quality. This attenuation results in loss of signal strength, causing issues such as image noise, color distortion, or audio dropouts. Using cables within recommended lengths or employing signal boosters can help maintain quality.",
    },
    {
      question: "Why do different cable types have different maximum recommended lengths?",
      answer:
        "Different cable types have varying construction, shielding, and impedance characteristics that affect how signals degrade over distance. For example, HDMI cables carry high-frequency digital signals that attenuate faster than balanced audio cables like XLR. Manufacturers specify maximum lengths to ensure reliable signal transmission.",
    },
    {
      question: "Can I extend cable length beyond recommended limits?",
      answer:
        "Extending cable length beyond recommended limits often leads to signal degradation or failure. To extend beyond these limits, you can use active repeaters, signal boosters, or fiber optic cables designed for long distances. Passive cables alone are generally not reliable beyond their specified maximum lengths.",
    },
    {
      question: "Does cable quality affect signal loss over length?",
      answer:
        "Yes, higher quality cables with better shielding, thicker conductors, and superior materials typically have lower attenuation and can maintain signal integrity over longer distances. Investing in quality cables can reduce signal loss and interference, especially in professional environments.",
    },
    {
      question: "Is voltage drop a concern for video and audio cables?",
      answer:
        "Voltage drop is more critical for power cables than for video or audio signal cables. However, in some cases, especially with long cables carrying power to active devices, voltage drop can affect device performance. This calculator provides an approximate voltage drop for awareness, but signal attenuation is usually the primary concern.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You need to run an HDMI cable from your camera to a monitor located 20 meters away on set.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the cable length as 20 meters and select HDMI as the cable type.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate to see the estimated signal loss and check if the length exceeds recommended limits.",
      },
      {
        label: "Step 3",
        explanation:
          "Based on the result, decide whether to use an active HDMI extender or a shorter cable.",
      },
    ],
    result:
      "The calculator shows that 20 meters exceeds the recommended HDMI cable length, with significant signal loss. Using an active extender is advised to maintain signal quality.",
  };

  const references = [
    {
      title: "HDMI Cable Length and Signal Quality",
      description:
        "Official HDMI Licensing Administrator guidelines on cable length and signal integrity.",
      url: "https://www.hdmi.org/spec/hdmi1_4b",
    },
    {
      title: "SMPTE Standards for SDI Cables",
      description:
        "Standards for Serial Digital Interface cables used in professional video.",
      url: "https://www.smpte.org/standards",
    },
    {
      title: "Audio Cable Length Recommendations",
      description:
        "Best practices for balanced and unbalanced audio cable lengths.",
      url: "https://www.prosoundweb.com/techniques/audio_cable_length/",
    },
    {
      title: "Ethernet Cable Length Limits",
      description:
        "IEEE standards and practical limits for Ethernet cable runs.",
      url: "https://standards.ieee.org/standard/802_3-2018.html",
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cableLength">Cable Length</Label>
          <div className="flex gap-2">
            <Input
              id="cableLength"
              type="number"
              min={0}
              step="any"
              placeholder="Enter length"
              value={inputs.cableLength}
              onChange={(e) => handleInputChange("cableLength", e.target.value)}
              aria-describedby="lengthHelp"
            />
            <select
              aria-label="Select unit"
              className="border rounded px-2 py-1"
              value={inputs.unit}
              onChange={(e) => handleInputChange("unit", e.target.value)}
            >
              <option value="meters">Meters</option>
              <option value="feet">Feet</option>
            </select>
          </div>
          <p id="lengthHelp" className="text-xs text-slate-500 dark:text-slate-400">
            Specify the cable length and unit.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cableType">Cable Type</Label>
          <select
            id="cableType"
            className="border rounded px-2 py-1 w-full"
            value={inputs.cableType}
            onChange={(e) => handleInputChange("cableType", e.target.value)}
          >
            {Object.entries(cableSpecs).map(([key, spec]) => (
              <option key={key} value={key}>
                {spec.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate cable length impact"
      >
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-4" />
            <p className="text-sm font-medium text-blue-700">{results.feedback}</p>
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
          <li>Enter the length of the cable run in meters or feet.</li>
          <li>Select the type of cable you are using from the dropdown menu.</li>
          <li>Click the "Calculate" button to see the estimated signal loss and voltage drop.</li>
          <li>
            Review the results to determine if your cable length is within recommended limits or if
            additional equipment is needed.
          </li>
          <li>
            Use the feedback and guide sections to optimize your cable setup for best performance.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Cable Length Impact Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            In professional video and audio production, cable length plays a crucial role in signal
            integrity and overall quality. As cable length increases, the signal traveling through
            the cable experiences attenuation, which is a reduction in signal strength. This can
            lead to degraded video images, audio dropouts, or even complete signal loss if the
            cable is too long.
          </p>
          <p>
            Different types of cables have different physical and electrical characteristics that
            affect how signals degrade over distance. For example, HDMI cables carry high-frequency
            digital signals that are more susceptible to attenuation compared to balanced audio
            cables like XLR, which are designed to minimize noise and interference over longer
            distances.
          </p>
          <p>
            This calculator helps you estimate the impact of cable length on signal quality by
            calculating the expected signal loss in decibels (dB) and converting that into a
            percentage loss. It also provides an approximate voltage drop percentage, which is
            more relevant for power cables but can be useful for active devices powered through
            cables.
          </p>
          <p>
            By inputting your cable length and selecting the cable type, you can quickly assess
            whether your cable run is within recommended limits or if you need to consider using
            active repeaters, signal boosters, or higher quality cables to maintain optimal
            performance.
          </p>
          <p>
            Understanding these factors is essential for ensuring reliable and high-quality video
            and audio transmission in professional production, post-production, and broadcasting
            environments.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> One common mistake is ignoring the maximum recommended cable
            length for your cable type. Exceeding these lengths without proper signal boosting can
            cause severe signal degradation or complete loss.
          </p>
          <p>
            Another error is assuming all cables behave the same; different cable types have unique
            attenuation characteristics and maximum lengths.
          </p>
          <p>
            Additionally, failing to consider the unit of measurement (meters vs feet) can lead to
            incorrect calculations and poor setup decisions.
          </p>
          <p>
            Lastly, relying solely on passive cables for long runs without active repeaters or
            extenders often results in unreliable signal transmission.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            <strong>Scenario:</strong> You need to run an HDMI cable from your camera to a monitor
            located 20 meters away on set.
          </p>
          <p>
            <strong>Steps:</strong>
          </p>
          <ol>
            <li>Input the cable length as 20 meters and select HDMI as the cable type.</li>
            <li>Calculate to see the estimated signal loss and check if the length exceeds recommended limits.</li>
            <li>
              Based on the result, decide whether to use an active HDMI extender or a shorter cable.
            </li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows that 20 meters exceeds the recommended HDMI
            cable length, with significant signal loss. Using an active extender is advised to
            maintain signal quality.
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
      title="Cable Length Impact Calculator"
      description="Professional video & audio calculator: Cable Length Impact Calculator. Accurate technical formulas for production, post-production, and broadcasting."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
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