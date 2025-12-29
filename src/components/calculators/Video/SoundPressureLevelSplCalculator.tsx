import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SoundPressureLevelSplCalculator() {
  const [inputs, setInputs] = useState({
    watts: "",
    distance: "",
    db: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Calculation logic:
   * 
   * SPL (dB) = 10 * log10(P / P0)
   * where P is sound power in watts, P0 = 1e-12 W (reference sound power)
   * 
   * SPL decreases with distance by inverse square law:
   * SPL2 = SPL1 - 20 * log10(r2 / r1)
   * 
   * For this calculator:
   * - Given Watts and Distance, calculate SPL at that distance.
   * - Given SPL and Distance, calculate Watts.
   * - Given Watts and SPL, calculate Distance.
   * 
   * Reference impedance (Ohm's law) and Nyquist frequency are not directly used here,
   * but we mention them in the guide for completeness.
   */

  const results = useMemo(() => {
    const P0 = 1e-12; // Reference sound power in watts
    const { watts, distance, db } = inputs;

    // Parse inputs to floats
    const W = parseFloat(watts);
    const r = parseFloat(distance);
    const L = parseFloat(db);

    // Helper: 20 * log10(x)
    const log20 = (x: number) => 20 * Math.log10(x);
    // Helper: 10 * log10(x)
    const log10 = (x: number) => 10 * Math.log10(x);

    // Count how many inputs are provided
    const provided = [watts, distance, db].filter((v) => v !== "").length;

    if (provided < 2) {
      return {
        primary: "Please enter any two values to calculate the third.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate missing value based on inputs
    // Case 1: watts & distance -> calculate SPL (dB)
    if (watts !== "" && distance !== "" && db === "") {
      if (W <= 0 || r <= 0) {
        return {
          primary: "Inputs must be positive numbers.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      // SPL at 1 meter: L1 = 10 * log10(W / P0)
      const L1 = log10(W / P0);
      // SPL at distance r: Lr = L1 - 20 * log10(r / 1)
      const Lr = L1 - log20(r);
      return {
        primary: Lr.toFixed(2),
        secondary: "dB SPL",
        details: `Calculated SPL at ${r} meter(s) from a ${W} watt source.`,
        feedback:
          "SPL decreases by 6 dB each time the distance doubles due to inverse square law.",
      };
    }

    // Case 2: watts & db -> calculate distance (m)
    if (watts !== "" && db !== "" && distance === "") {
      if (W <= 0) {
        return {
          primary: "Watts must be a positive number.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      // SPL at 1 meter: L1 = 10 * log10(W / P0)
      const L1 = log10(W / P0);
      if (L > L1) {
        return {
          primary: "SPL cannot be greater than SPL at 1 meter for given watts.",
          secondary: "",
          details: `Max SPL at 1 meter is ${L1.toFixed(2)} dB for ${W} watts.`,
          feedback: "Check your inputs.",
        };
      }
      // distance r = 10^((L1 - L)/20)
      const rCalc = Math.pow(10, (L1 - L) / 20);
      return {
        primary: rCalc.toFixed(2),
        secondary: "meters",
        details: `Distance from source to achieve ${L} dB SPL with ${W} watts.`,
        feedback:
          "Remember SPL decreases with distance; closer distance means higher SPL.",
      };
    }

    // Case 3: distance & db -> calculate watts
    if (distance !== "" && db !== "" && watts === "") {
      if (r <= 0) {
        return {
          primary: "Distance must be a positive number.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      // SPL at distance r: Lr = L1 - 20 * log10(r)
      // => L1 = Lr + 20 * log10(r)
      const L1 = L + log20(r);
      // Watts = P0 * 10^(L1/10)
      const Wcalc = P0 * Math.pow(10, L1 / 10);
      return {
        primary: Wcalc.toExponential(3),
        secondary: "watts",
        details: `Power required to produce ${L} dB SPL at ${r} meter(s).`,
        feedback:
          "Higher power needed for higher SPL or greater distance due to inverse square law.",
      };
    }

    return {
      primary: "Please enter exactly two values to calculate the third.",
      secondary: "",
      details: "",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Sound Pressure Level (SPL)?",
      answer:
        "Sound Pressure Level (SPL) is a logarithmic measure of the effective pressure of a sound relative to a reference value. It is measured in decibels (dB) and represents the loudness perceived by the human ear. SPL is crucial in audio engineering to ensure sound levels are safe and optimal for recording and playback.",
    },
    {
      question: "Why does SPL decrease with distance?",
      answer:
        "SPL decreases with distance due to the inverse square law, which states that sound intensity diminishes proportionally to the square of the distance from the source. Practically, this means that doubling the distance from a sound source reduces the SPL by approximately 6 dB.",
    },
    {
      question: "How is power (watts) related to SPL?",
      answer:
        "The power of a sound source, measured in watts, directly affects the SPL it produces. More power generally results in higher SPL. However, the relationship is logarithmic, so a tenfold increase in power results in a 10 dB increase in SPL.",
    },
    {
      question: "What role does impedance play in SPL calculations?",
      answer:
        "Impedance, measured in ohms, affects how electrical power is converted into acoustic power by speakers. While impedance is important in speaker design and matching amplifiers, it is not directly used in basic SPL calculations but is critical for understanding system efficiency and Nyquist frequency considerations.",
    },
    {
      question: "What is the Nyquist frequency and why is it relevant?",
      answer:
        "The Nyquist frequency is half the sampling rate of a digital audio system and represents the highest frequency that can be accurately sampled. While it doesn't directly affect SPL calculations, understanding Nyquist frequency is essential in digital audio to avoid aliasing and ensure sound quality.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a speaker rated at 10 watts and want to know the SPL at 2 meters distance.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the power of the speaker as 10 watts.",
      },
      {
        label: "Step 2",
        explanation: "Enter the distance as 2 meters.",
      },
      {
        label: "Step 3",
        explanation:
          "Leave the SPL (dB) field empty to calculate the SPL at that distance.",
      },
      {
        label: "Step 4",
        explanation: "Click Calculate to get the SPL value.",
      },
    ],
    result:
      "The calculator will show the SPL in decibels at 2 meters from a 10 watt source, helping you understand the loudness at that distance.",
  };

  const references = [
    {
      title: "Acoustics and Psychoacoustics by David M. Howard and Jamie A. S. Angus",
      description:
        "A comprehensive textbook covering the fundamentals of sound, including SPL, inverse square law, and audio system design.",
      url: "https://www.routledge.com/Acoustics-and-Psychoacoustics/Howard-Angus/p/book/9780750658963",
    },
    {
      title: "AES Standard on Sound Level Meters",
      description:
        "Standards and guidelines for measuring sound pressure levels accurately in professional audio environments.",
      url: "https://www.aes.org/standards/",
    },
    {
      title: "Nyquist Frequency - Wikipedia",
      description:
        "Detailed explanation of Nyquist frequency and its importance in digital audio processing.",
      url: "https://en.wikipedia.org/wiki/Nyquist_frequency",
    },
    {
      title: "Ohm's Law and Audio Systems",
      description:
        "Understanding the relationship between voltage, current, impedance, and power in audio electronics.",
      url: "https://www.soundonsound.com/techniques/ohms-law-audio",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="watts">Power (Watts)</Label>
          <Input
            id="watts"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.watts}
            onChange={(e) => handleInputChange("watts", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="distance">Distance (meters)</Label>
          <Input
            id="distance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 2"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="db">Sound Pressure Level (dB SPL)</Label>
          <Input
            id="db"
            type="number"
            step="any"
            placeholder="e.g. 85"
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
            <Separator className="my-3" />
            <p className="text-sm italic text-blue-700">{results.feedback}</p>
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
          <li>Enter any two values among Power (Watts), Distance (meters), and SPL (dB SPL).</li>
          <li>Leave the third value empty to calculate it automatically.</li>
          <li>Click the "Calculate" button to see the result below.</li>
          <li>Review the result and details for better understanding.</li>
          <li>Use the feedback tips to optimize your audio setup or measurements.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Sound Pressure Level (SPL) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Sound Pressure Level (SPL) is a fundamental concept in audio engineering and acoustics,
            representing the loudness of a sound relative to a reference pressure. It is measured in
            decibels (dB), a logarithmic scale that reflects how humans perceive sound intensity.
          </p>
          <p>
            This calculator uses the inverse square law to relate sound power, distance, and SPL.
            The inverse square law states that sound intensity decreases proportionally to the square
            of the distance from the source. Practically, this means that every time you double the
            distance from a sound source, the SPL drops by approximately 6 dB.
          </p>
          <p>
            The calculation starts with the sound power in watts, which is converted to SPL at a
            reference distance of 1 meter using the formula: <em>SPL = 10 * log10(P / P0)</em>, where
            P0 is the reference sound power (1e-12 watts). From there, the SPL at any other distance
            can be calculated by subtracting 20 * log10(distance ratio).
          </p>
          <p>
            While impedance (Ohm's law) and Nyquist frequency are important in audio system design
            and digital audio processing, they are not directly used in this SPL calculation.
            However, understanding these concepts helps in optimizing audio equipment and ensuring
            accurate sound reproduction.
          </p>
          <p>
            This tool is invaluable for professionals in video production, broadcasting, and live
            sound engineering to predict sound levels, set up microphones, and ensure safe listening
            environments. By accurately calculating SPL, you can avoid distortion, hearing damage,
            and ensure optimal audio quality.
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
            <strong>Warning:</strong> Entering all three values will not compute a result. You must
            leave exactly one field empty to calculate it.
          </p>
          <p>
            <strong>Warning:</strong> Negative or zero values for power or distance are invalid and
            will produce errors.
          </p>
          <p>
            <strong>Warning:</strong> SPL values higher than the theoretical maximum at 1 meter for
            given power are physically impossible and indicate input errors.
          </p>
          <p>
            <strong>Warning:</strong> This calculator assumes free-field conditions without
            reflections or absorption, so real-world results may vary.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a speaker rated at 10 watts and want to know the SPL
            at 2 meters distance.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
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
      title="Sound Pressure Level (SPL) Calculator"
      description="Professional video & audio calculator: Sound Pressure Level (SPL) Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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