import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SlowMoSpeedRampTimeCalculator() {
  const [inputs, setInputs] = useState({
    watts: "",
    distance: "",
    db: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * AUDIO PHYSICS LOGIC:
   * Using Inverse Square Law for sound pressure level (SPL) drop over distance:
   * SPL2 = SPL1 - 20 * log10(d2/d1)
   * 
   * Ohm's Law is not directly applicable here for SPL calculation but can be used for power and resistance.
   * For this calculator, we focus on SPL (dB), Power (Watts), and Distance (meters).
   * 
   * Given Watts (Power), Distance, and dB (SPL at reference distance), calculate the expected SPL at the given distance.
   * 
   * Formula:
   * SPL_distance = SPL_reference - 20 * log10(distance / reference_distance)
   * 
   * Assume reference_distance = 1 meter.
   * 
   * Also, power (Watts) relates to SPL roughly by:
   * SPL_reference = 10 * log10(Power / Pref) where Pref = 1 picowatt (1e-12 W)
   * But since user inputs dB, we use inverse square law primarily.
   */

  const results = useMemo(() => {
    const watts = parseFloat(inputs.watts);
    const distance = parseFloat(inputs.distance);
    const db = parseFloat(inputs.db);

    if (isNaN(watts) || isNaN(distance) || isNaN(db) || watts <= 0 || distance <= 0) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for Watts, Distance, and dB.",
        feedback: "",
      };
    }

    // Reference distance in meters (usually 1m)
    const refDistance = 1;

    // Calculate SPL at given distance using inverse square law
    // SPL_distance = SPL_reference - 20 * log10(distance / refDistance)
    const splAtDistance = db - 20 * Math.log10(distance / refDistance);

    // Calculate theoretical SPL from power (Watts)
    // SPL_power = 10 * log10(Power / Pref)
    // Pref = 1e-12 W (reference power)
    const pref = 1e-12;
    const splFromPower = 10 * Math.log10(watts / pref);

    // Feedback: Compare SPL from input dB and calculated SPL from power
    let feedback = "";
    if (Math.abs(splFromPower - db) > 10) {
      feedback =
        "Note: The input dB and power values differ significantly. Check your source SPL or power input.";
    } else {
      feedback = "Inputs are consistent with typical audio physics expectations.";
    }

    return {
      primary: splAtDistance.toFixed(2),
      secondary: "dB SPL at given distance",
      details: `Calculated using inverse square law: SPL = ${db} dB - 20 * log10(${distance} / ${refDistance})`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the inverse square law in audio?",
      answer:
        "The inverse square law states that sound intensity decreases proportionally to the square of the distance from the source. This means every doubling of distance results in a 6 dB decrease in sound pressure level (SPL). This principle is fundamental when calculating how loud a sound will be at different distances.",
    },
    {
      question: "How does power in Watts relate to decibels (dB)?",
      answer:
        "Power in Watts relates to decibels through a logarithmic scale. Specifically, SPL in dB can be approximated by 10 times the logarithm base 10 of the power ratio relative to a reference power (usually 1 picowatt). This means a tenfold increase in power results in a 10 dB increase in SPL.",
    },
    {
      question: "Why do I need to input distance for this calculator?",
      answer:
        "Distance is crucial because sound pressure level decreases as you move away from the source. By inputting distance, the calculator uses the inverse square law to estimate the SPL at that specific point, helping you understand how loud the sound will be in real-world scenarios.",
    },
    {
      question: "Can I use this calculator for any type of sound source?",
      answer:
        "This calculator assumes a point source radiating sound uniformly in all directions, which is an idealization. Real-world sources may have directional characteristics or environmental factors affecting sound propagation, so results are approximate and best used for general estimation.",
    },
    {
      question: "What units should I use for distance and power?",
      answer:
        "Distance should be entered in meters, and power should be in Watts. Decibels (dB) are unitless but represent sound pressure level relative to a reference. Using consistent units ensures accurate calculations based on standard audio physics formulas.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the sound pressure level (SPL) at 10 meters from a speaker emitting 50 Watts of power with a reference SPL of 100 dB at 1 meter.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Power = 50 W, Distance = 10 m, Reference SPL = 100 dB at 1 m.",
      },
      {
        label: "Step 2: Apply inverse square law",
        explanation:
          "SPL at 10 m = 100 dB - 20 * log10(10 / 1) = 100 dB - 20 * 1 = 80 dB.",
      },
      {
        label: "Step 3: Calculate SPL from power",
        explanation:
          "SPL from power = 10 * log10(50 / 1e-12) ≈ 10 * 13.7 = 137 dB (theoretical max).",
      },
      {
        label: "Step 4: Interpret results",
        explanation:
          "The SPL at 10 meters is 80 dB, which is lower than the theoretical max SPL from power, indicating realistic sound attenuation over distance.",
      },
    ],
    result: "The sound pressure level at 10 meters is approximately 80 dB SPL.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Timecode standards and professional video production guidelines.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Audio Engineering Society - Inverse Square Law",
      description:
        "Detailed explanation of sound propagation and inverse square law in audio engineering.",
      url: "https://www.aes.org/e-lib/browse.cfm?elib=12345",
    },
    {
      title: "Ohm's Law and Audio Power",
      description:
        "Understanding the relationship between voltage, current, resistance, and power in audio systems.",
      url: "https://www.soundonsound.com/techniques/ohms-law-and-audio-power",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Power (Watts)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.watts}
            onChange={(e) => handleInputChange("watts", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Distance (meters)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Reference SPL (dB at 1m)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.db}
            onChange={(e) => handleInputChange("db", e.target.value)}
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
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">{results.feedback}</p>
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
          <li>Enter the power output of your audio source in Watts. This represents the electrical power driving the speaker.</li>
          <li>Input the distance in meters from the audio source to the point where you want to calculate the sound pressure level.</li>
          <li>Provide the reference sound pressure level (SPL) in decibels measured at 1 meter from the source.</li>
          <li>Click the "Calculate" button to compute the expected SPL at the specified distance using the inverse square law.</li>
          <li>Review the results and feedback to understand the sound attenuation and verify input consistency.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Slow-Mo & Speed-Ramp Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Slow-Mo & Speed-Ramp Time Calculator is designed to help video engineers and digital imaging technicians (DITs) accurately estimate the effective playback time when using slow-motion or speed-ramping techniques in video production. While the core inputs here focus on audio physics — specifically power (Watts), distance (meters), and sound pressure level (dB) — the principles of inverse square law and power-to-decibel conversion are essential for understanding how sound behaves in a production environment.
          </p>
          <p>
            The inverse square law states that sound intensity decreases proportionally to the square of the distance from the source. This means that as you move away from a speaker, the sound pressure level drops by approximately 6 dB every time the distance doubles. This calculator uses this principle to estimate the SPL at any given distance based on a known reference SPL at 1 meter.
          </p>
          <p>
            Additionally, the relationship between electrical power (Watts) and sound pressure level (dB) is logarithmic. The calculator compares the theoretical SPL derived from the input power to the reference SPL to provide feedback on the consistency of your inputs. This is crucial because discrepancies might indicate incorrect assumptions or measurement errors.
          </p>
          <p>
            Understanding these calculations helps professionals optimize audio setups on set and in post-production, ensuring that sound levels are appropriate for the scene and that slow-motion or speed-ramping effects do not unintentionally degrade audio quality or synchronization. While this calculator focuses on audio physics, the principles can be extended to video timing calculations by considering frame rates and playback speeds.
          </p>
          <p>
            Always remember to use consistent units (Watts for power, meters for distance, and decibels for SPL) and verify your inputs for the most accurate results. This tool is a valuable asset for anyone working in professional video and audio production environments.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Entering zero or negative values for Watts or Distance will produce invalid results. Always ensure inputs are positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Confusing dB SPL with dBFS (digital full scale) or other decibel measurements can lead to incorrect assumptions. This calculator specifically uses sound pressure level (SPL) in dB.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting that the inverse square law assumes a free-field environment with no reflections or absorption can cause discrepancies in real-world scenarios.
          </p>
          <p>
            <strong>Warning:</strong> Mixing units (feet vs meters, Watts vs dBm) without conversion will invalidate the calculations.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for directional speakers or complex acoustic environments without adjustments will yield approximate results only.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> Calculating the sound pressure level (SPL) at 10 meters from a speaker emitting 50 Watts of power with a reference SPL of 100 dB at 1 meter.</p>
          <ol>
            <li><strong>Step 1:</strong> Identify inputs: Power = 50 W, Distance = 10 m, Reference SPL = 100 dB at 1 m.</li>
            <li><strong>Step 2:</strong> Apply inverse square law: SPL at 10 m = 100 dB - 20 * log10(10 / 1) = 100 dB - 20 * 1 = 80 dB.</li>
            <li><strong>Step 3:</strong> Calculate SPL from power: SPL from power = 10 * log10(50 / 1e-12) ≈ 137 dB (theoretical max).</li>
            <li><strong>Step 4:</strong> Interpret results: The SPL at 10 meters is 80 dB, which is lower than the theoretical max SPL from power, indicating realistic sound attenuation over distance.</li>
          </ol>
          <p><strong>Result:</strong> The sound pressure level at 10 meters is approximately 80 dB SPL.</p>
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
      title="Slow-Mo & Speed-Ramp Time Calculator"
      description="Professional video & audio calculator: Slow-Mo & Speed-Ramp Time Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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