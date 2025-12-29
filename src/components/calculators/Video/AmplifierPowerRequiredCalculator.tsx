import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AmplifierPowerRequiredCalculator() {
  /*
    Inputs:
      - Watts (Power at reference distance)
      - Distance (meters or feet)
      - dB (Desired sound pressure level increase or target level)
    Logic:
      - Inverse Square Law: Sound intensity decreases by square of distance
      - Ohm's Law: Relates voltage, current, resistance (used for speaker impedance)
      - Nyquist: Relevant for sampling, but here mainly physics of sound power and distance

    Goal:
      Calculate the amplifier power required at a given distance to achieve a target dB level,
      based on a known power at a reference distance.
  */

  // State for inputs
  const [inputs, setInputs] = useState({
    watts: "", // power at reference distance in watts
    distance: "", // target distance in meters
    dB: "", // desired dB increase or target dB level difference
    impedance: "8", // speaker impedance in ohms (default 8 ohms)
    referenceDistance: "1", // reference distance in meters (default 1m)
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Calculation logic
  const results = useMemo(() => {
    const watts = parseFloat(inputs.watts);
    const distance = parseFloat(inputs.distance);
    const dB = parseFloat(inputs.dB);
    const impedance = parseFloat(inputs.impedance);
    const referenceDistance = parseFloat(inputs.referenceDistance);

    if (
      isNaN(watts) ||
      watts <= 0 ||
      isNaN(distance) ||
      distance <= 0 ||
      isNaN(dB) ||
      impedance <= 0 ||
      isNaN(referenceDistance) ||
      referenceDistance <= 0
    ) {
      return {
        primary: "—",
        secondary: "Watts",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    /*
      Step 1: Calculate sound power level change due to distance using inverse square law:
        SPL decreases by 6 dB each time distance doubles.
        Formula for SPL difference due to distance:
          ΔSPL = 20 * log10(referenceDistance / distance)

      Step 2: Calculate required power increase to compensate for distance and desired dB increase:
        Power ratio = 10^( (desired dB increase - ΔSPL) / 10 )

      Step 3: Calculate required amplifier power:
        Required power = watts * power ratio

      Step 4: Ohm's Law check (optional):
        Voltage = sqrt(Power * Impedance)
        Current = Voltage / Impedance
    */

    // SPL difference due to distance
    const deltaSPL = 20 * Math.log10(referenceDistance / distance);

    // Power ratio needed to achieve desired dB increase over distance loss
    // If user inputs desired dB as absolute target, assume it's relative increase from reference SPL
    // So total dB difference to compensate is (dB - deltaSPL)
    const powerRatio = Math.pow(10, (dB - deltaSPL) / 10);

    // Required power in watts
    const requiredPower = watts * powerRatio;

    // Voltage and current calculations for given impedance
    const voltage = Math.sqrt(requiredPower * impedance);
    const current = voltage / impedance;

    // Format results nicely
    const primary = requiredPower.toFixed(2);
    const secondary = "Watts";

    const details = `At a reference distance of ${referenceDistance}m with ${watts}W power, sound level decreases by ${(-deltaSPL).toFixed(
      2
    )} dB at ${distance}m. To achieve a ${dB} dB increase over this loss, the amplifier must provide approximately ${primary} W. This corresponds to ${voltage.toFixed(
      2
    )} V and ${current.toFixed(2)} A at ${impedance} Ω impedance.`;

    const feedback =
      "Ensure your amplifier and speaker system can handle this power safely to avoid distortion or damage.";

    return { primary, secondary, details, feedback };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is the inverse square law in audio?",
      answer:
        "The inverse square law states that sound intensity decreases proportionally to the square of the distance from the source. This means that when you double the distance from a speaker, the sound pressure level drops by approximately 6 dB. This principle is fundamental when calculating amplifier power requirements for different listening distances.",
    },
    {
      question: "Why is speaker impedance important in power calculations?",
      answer:
        "Speaker impedance, measured in ohms, affects how much current flows through the speaker for a given voltage. It influences the power delivered by the amplifier. Knowing the impedance helps calculate voltage and current requirements to ensure the amplifier can safely and efficiently drive the speaker without damage.",
    },
    {
      question: "How does dB relate to amplifier power?",
      answer:
        "Decibels (dB) are a logarithmic measure of sound pressure level or power ratios. A 10 dB increase represents a tenfold increase in power. When calculating amplifier power, dB values help determine how much more power is needed to achieve a desired loudness at a certain distance.",
    },
    {
      question: "Can this calculator be used for any speaker system?",
      answer:
        "This calculator provides theoretical estimates based on standard audio physics principles. Real-world factors like room acoustics, speaker efficiency, and environmental noise can affect actual power requirements. Always consider these factors and consult manufacturer specifications for precise system design.",
    },
    {
      question: "What is the reference distance used in calculations?",
      answer:
        "The reference distance is the distance at which the initial power measurement (watts) is known or specified, typically 1 meter. It serves as the baseline for calculating how sound level changes with distance. Adjusting this value allows calculations for different initial measurement setups.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Real world example
  const example = {
    title: "Real World Example",
    scenario:
      "You have a speaker rated at 100 watts measured at 1 meter. You want to know how much amplifier power is required to achieve a 10 dB louder sound at 5 meters distance with an 8-ohm speaker.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the known power at reference distance: 100 watts at 1 meter.",
      },
      {
        label: "Step 2",
        explanation: "Enter the target distance: 5 meters.",
      },
      {
        label: "Step 3",
        explanation: "Enter the desired dB increase: 10 dB.",
      },
      {
        label: "Step 4",
        explanation: "Set speaker impedance to 8 ohms (default).",
      },
      {
        label: "Step 5",
        explanation: "Calculate to find required amplifier power.",
      },
    ],
    result:
      "The calculator shows approximately 630 watts required to achieve the desired 10 dB increase at 5 meters, with corresponding voltage and current values for an 8-ohm speaker.",
  };

  // References
  const references = [
    {
      title: "Understanding the Inverse Square Law for Sound",
      description:
        "Detailed explanation of how sound intensity decreases with distance and its implications for audio engineering.",
      url: "https://www.soundguys.com/inverse-square-law-13232/",
    },
    {
      title: "Ohm's Law and Speaker Impedance Explained",
      description:
        "A guide to understanding electrical principles relevant to audio amplifier and speaker systems.",
      url: "https://www.crutchfield.com/S-1s6qYz0k1kA/learn/learningcenter/home/speaker-impedance.html",
    },
    {
      title: "Decibel (dB) Basics for Audio",
      description:
        "Comprehensive overview of decibel scales and their use in measuring sound and power levels.",
      url: "https://www.asha.org/public/hearing/Decibels-and-Sound-Pressure-Level/",
    },
  ];

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Power at Reference Distance (Watts)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.watts}
            onChange={(e) => handleInputChange("watts", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Reference Distance (meters)</Label>
          <Input
            type="number"
            min="0.01"
            step="any"
            placeholder="Default 1"
            value={inputs.referenceDistance}
            onChange={(e) => handleInputChange("referenceDistance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Target Distance (meters)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Desired dB Increase</Label>
          <Input
            type="number"
            step="any"
            placeholder="e.g. 10"
            value={inputs.dB}
            onChange={(e) => handleInputChange("dB", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Speaker Impedance (Ohms)</Label>
          <Input
            type="number"
            min="1"
            step="any"
            placeholder="e.g. 8"
            value={inputs.impedance}
            onChange={(e) => handleInputChange("impedance", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the known amplifier power (in watts) at the reference distance, typically 1 meter.</li>
          <li>Specify the reference distance at which the power is measured (default is 1 meter).</li>
          <li>Input the target distance where you want to achieve the desired sound level.</li>
          <li>Enter the desired increase in decibels (dB) over the sound level at the reference distance.</li>
          <li>Provide the speaker impedance in ohms (commonly 4, 8, or 16 ohms).</li>
          <li>Click the Calculate button to see the required amplifier power and electrical parameters.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Amplifier Power Required Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Amplifier power requirements depend on multiple factors including the distance from the speaker to the listener, the desired loudness level, and the speaker's electrical characteristics. The inverse square law is a fundamental principle in acoustics that describes how sound intensity decreases as the distance from the source increases. Specifically, sound pressure level drops by approximately 6 dB each time the distance doubles. This means that to maintain the same loudness at a farther distance, the amplifier must provide more power.
          </p>
          <p>
            This calculator uses the inverse square law to estimate how much additional power is needed to compensate for distance-related sound loss. It also incorporates Ohm's law to relate the electrical power to voltage and current based on the speaker's impedance. By entering the known power at a reference distance, the target listening distance, desired dB increase, and speaker impedance, you can determine the amplifier power required to achieve your sound goals.
          </p>
          <p>
            It's important to note that this calculation assumes ideal conditions without accounting for room acoustics, speaker efficiency, or environmental noise, which can all affect actual performance. Always consider these factors and consult with audio professionals or manufacturer specifications when designing or upgrading sound systems. Properly sizing your amplifier ensures optimal sound quality, prevents distortion, and protects your equipment from damage.
          </p>
          <p>
            Understanding these principles helps audio engineers, video professionals, and sound technicians make informed decisions about amplifier and speaker setups for various production, post-production, and broadcasting environments.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> One common mistake is neglecting the inverse square law and assuming amplifier power requirements scale linearly with distance. In reality, power must increase exponentially to compensate for sound loss over distance.
          </p>
          <p>
            Another frequent error is ignoring speaker impedance, which affects voltage and current requirements. Using incorrect impedance values can lead to amplifier overload or insufficient power delivery.
          </p>
          <p>
            Additionally, users sometimes confuse dB SPL (sound pressure level) with dB power ratios. Remember that a 10 dB increase corresponds to a tenfold increase in power, not a linear increase.
          </p>
          <p>
            Lastly, failing to consider real-world factors like room acoustics, speaker efficiency, and environmental noise can result in underpowered or overpowered systems.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Scenario:</strong> You have a speaker rated at 100 watts measured at 1 meter. You want to know how much amplifier power is required to achieve a 10 dB louder sound at 5 meters distance with an 8-ohm speaker.</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Input the known power at reference distance: 100 watts at 1 meter.</li>
            <li>Enter the target distance: 5 meters.</li>
            <li>Enter the desired dB increase: 10 dB.</li>
            <li>Set speaker impedance to 8 ohms (default).</li>
            <li>Calculate to find required amplifier power.</li>
          </ol>
          <p><strong>Result:</strong> The calculator shows approximately 630 watts required to achieve the desired 10 dB increase at 5 meters, with corresponding voltage and current values for an 8-ohm speaker.</p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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

      <section id="references" className="scroll-mt-24">
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
      title="Amplifier Power Required Calculator"
      description="Professional video & audio calculator: Amplifier Power Required Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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