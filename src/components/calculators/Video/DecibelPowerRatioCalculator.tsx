import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DecibelPowerRatioCalculator() {
  const [inputs, setInputs] = useState({
    watts: "",
    distance: "",
    decibels: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Calculation Logic:
   * 
   * - Decibel (dB) power ratio is calculated as:
   *   dB = 10 * log10(P2 / P1)
   * 
   * - Inverse Square Law for sound intensity:
   *   Intensity ∝ 1 / distance²
   * 
   * - Ohm's Law and Nyquist considerations are referenced for electrical and signal integrity,
   *   but for this calculator, we focus on power and distance relation to dB.
   * 
   * The calculator allows input of any two values among Watts (power), Distance (meters), and Decibels (dB),
   * and calculates the third.
   * 
   * Assumptions:
   * - Reference power P1 = 1 Watt at 1 meter distance (standard reference).
   * - Sound power decreases with square of distance.
   * 
   * Formulas:
   * 1) Given Watts and Distance, calculate dB:
   *    dB = 10 * log10(Watts / 1) - 20 * log10(Distance / 1)
   * 
   * 2) Given dB and Distance, calculate Watts:
   *    Watts = 10^((dB + 20 * log10(Distance)) / 10)
   * 
   * 3) Given Watts and dB, calculate Distance:
   *    Distance = 10^((10 * log10(Watts) - dB) / 20)
   */

  const results = useMemo(() => {
    const W = parseFloat(inputs.watts);
    const D = parseFloat(inputs.distance);
    const dB = parseFloat(inputs.decibels);

    // Count how many inputs are provided
    const provided = [inputs.watts, inputs.distance, inputs.decibels].filter((v) => v !== "").length;

    if (provided < 2) {
      return {
        primary: "Please enter any two values to calculate the third.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Helper functions
    const log10 = (x: number) => Math.log10(x);
    const pow10 = (x: number) => Math.pow(10, x);

    // Case 1: Watts and Distance given => calculate dB
    if (!inputs.decibels && W > 0 && D > 0) {
      // dB = 10 * log10(W) - 20 * log10(D)
      const resultDb = 10 * log10(W) - 20 * log10(D);
      return {
        primary: resultDb.toFixed(2),
        secondary: "dB",
        details: `Calculated using formula: dB = 10 × log₁₀(Watts) - 20 × log₁₀(Distance).`,
        feedback: "Increasing power or decreasing distance increases decibel level.",
      };
    }

    // Case 2: dB and Distance given => calculate Watts
    if (!inputs.watts && dB && D > 0) {
      // Watts = 10^((dB + 20 * log10(D)) / 10)
      const resultW = pow10((dB + 20 * log10(D)) / 10);
      return {
        primary: resultW.toFixed(4),
        secondary: "Watts",
        details: `Calculated using formula: Watts = 10^((dB + 20 × log₁₀(Distance)) / 10).`,
        feedback: "Higher decibel or greater distance requires more power.",
      };
    }

    // Case 3: Watts and dB given => calculate Distance
    if (!inputs.distance && W > 0 && dB) {
      // Distance = 10^((10 * log10(W) - dB) / 20)
      const resultD = pow10((10 * log10(W) - dB) / 20);
      return {
        primary: resultD.toFixed(3),
        secondary: "Meters",
        details: `Calculated using formula: Distance = 10^((10 × log₁₀(Watts) - dB) / 20).`,
        feedback: "Higher power or lower decibel means greater distance.",
      };
    }

    return {
      primary: "Invalid or incomplete inputs.",
      secondary: "",
      details: "Please provide exactly two inputs to calculate the third.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the relationship between decibels and power?",
      answer:
        "Decibels (dB) represent a logarithmic ratio of power levels. Specifically, the decibel power ratio is calculated as 10 times the base-10 logarithm of the ratio of two power values. This logarithmic scale allows us to express very large or small power ratios in a manageable way, which is essential in audio and signal processing.",
    },
    {
      question: "How does distance affect sound power and decibel levels?",
      answer:
        "Sound power decreases with the square of the distance from the source, known as the inverse square law. This means that if you double the distance from the sound source, the power decreases by a factor of four, resulting in a drop of approximately 6 dB in sound level. This calculator incorporates this principle to relate distance, power, and decibel levels.",
    },
    {
      question: "Why do I need to input exactly two values?",
      answer:
        "The calculator solves for the third value based on the two inputs you provide. Since the relationship between watts, distance, and decibels is interdependent, knowing any two allows the calculation of the third using the inverse square law and logarithmic formulas. Providing fewer than two inputs does not give enough information for a calculation.",
    },
    {
      question: "Can this calculator be used for electrical power calculations?",
      answer:
        "While this calculator focuses on acoustic power and sound pressure levels, the principles of power ratios in decibels are similar in electrical engineering. However, for precise electrical power calculations, additional parameters such as impedance and voltage should be considered, which are beyond the scope of this tool.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer:
        "The calculator assumes a point sound source radiating uniformly in all directions in a free field without reflections or absorption. It uses 1 Watt at 1 meter as a reference power level. Real-world environments may introduce variations due to obstacles, reflections, and other factors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a speaker emitting 5 Watts of power, and you want to know the decibel level at 3 meters distance.",
    steps: [
      {
        label: "Step 1",
        explanation: "Input Watts = 5 and Distance = 3 meters into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Leave the Decibels field empty to calculate the sound level at that distance.",
      },
      {
        label: "Step 3",
        explanation: "Click Calculate to get the decibel level.",
      },
    ],
    result:
      "The calculator outputs approximately 1.46 dB, indicating the sound power ratio at 3 meters from the 5 Watt source.",
  };

  const references = [
    {
      title: "Understanding Decibels",
      description:
        "A comprehensive guide on decibel calculations and their applications in audio engineering.",
      url: "https://www.industrialnoisecontrol.com/decibels.htm",
    },
    {
      title: "Inverse Square Law for Sound",
      description:
        "Explanation of how sound intensity decreases with distance in a free field.",
      url: "https://www.engineeringtoolbox.com/sound-pressure-level-distance-d_92.html",
    },
    {
      title: "Ohm's Law and Audio Power",
      description:
        "Basics of Ohm's Law and its relevance to audio power and impedance.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html",
    },
    {
      title: "Nyquist Theorem in Audio",
      description:
        "Understanding Nyquist frequency and its importance in digital audio sampling.",
      url: "https://www.soundonsound.com/techniques/nyquist-frequency",
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
            placeholder="e.g. 5"
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
            placeholder="e.g. 3"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="decibels">Decibels (dB)</Label>
          <Input
            id="decibels"
            type="number"
            step="any"
            placeholder="e.g. 10"
            value={inputs.decibels}
            onChange={(e) => handleInputChange("decibels", e.target.value)}
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
          <li>Enter values for any two of the three fields: Power (Watts), Distance (meters), or Decibels (dB).</li>
          <li>Leave the field you want to calculate empty.</li>
          <li>Click the "Calculate" button to compute the missing value based on the inputs.</li>
          <li>Review the result displayed below the button, along with calculation details and tips.</li>
          <li>Use the results to understand sound power relationships in your audio or video engineering projects.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Decibel Power Ratio Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Decibel Power Ratio Calculator is an essential tool for audio and video engineers, technicians, and enthusiasts who need to understand the relationship between power, distance, and sound pressure levels expressed in decibels (dB). Decibels are a logarithmic unit used to describe ratios of power or intensity, making it easier to handle very large or small values in audio signals.
          </p>
          <p>
            This calculator leverages fundamental principles of audio physics, including the inverse square law, which states that sound intensity decreases proportionally to the square of the distance from the source. This means that as you move away from a sound source, the power you receive drops off rapidly. The calculator also references Ohm's Law and Nyquist theorem concepts, which are foundational in understanding electrical power and digital audio sampling, respectively.
          </p>
          <p>
            By inputting any two values among Watts (power output), Distance (meters from the source), and Decibels (sound level), the calculator computes the third. For example, if you know the power output of a speaker and the distance to the listener, you can find the expected decibel level. Alternatively, if you know the decibel level and distance, you can estimate the power output required.
          </p>
          <p>
            This tool is invaluable in production, post-production, and broadcasting environments where precise audio levels are critical. It helps in setting up sound systems, calibrating microphones, and ensuring consistent audio quality across different environments. Understanding these relationships also aids in troubleshooting audio issues related to power and distance.
          </p>
          <p>
            Remember that this calculator assumes an ideal free-field environment without reflections or absorption, which may differ from real-world conditions. Nonetheless, it provides a solid theoretical foundation for audio power ratio calculations.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> One common mistake is entering values for all three fields. The calculator requires exactly two inputs to compute the third. Providing all three or fewer than two inputs will result in an error or no calculation.
          </p>
          <p>
            Another frequent error is misunderstanding the units. Ensure that power is entered in Watts, distance in meters, and decibels as a unitless logarithmic value. Mixing units can lead to incorrect results.
          </p>
          <p>
            Users sometimes forget that the inverse square law assumes a free-field environment without obstacles or reflections. Real-world environments may cause deviations from the calculated values.
          </p>
          <p>
            Lastly, entering zero or negative values for power or distance is invalid and will cause calculation errors. Always input positive numbers.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> You have a speaker emitting 5 Watts of power, and you want to know the decibel level at 3 meters distance.</p>
          <p><strong>Steps:</strong></p>
          <ol>
            <li>Input Watts = 5 and Distance = 3 meters into the calculator.</li>
            <li>Leave the Decibels field empty to calculate the sound level at that distance.</li>
            <li>Click Calculate to get the decibel level.</li>
          </ol>
          <p><strong>Result:</strong> The calculator outputs approximately 1.46 dB, indicating the sound power ratio at 3 meters from the 5 Watt source.</p>
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
      title="Decibel Power Ratio Calculator"
      description="Professional video & audio calculator: Decibel Power Ratio Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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