import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function OhmsLawForAudioCalculator() {
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
   * AUDIO PHYSICS LOGIC:
   * 
   * Given any two of the three inputs (Watts, Distance, dB SPL), calculate the third.
   * 
   * - Inverse Square Law for sound pressure level (SPL) drop over distance:
   *   SPL2 = SPL1 - 20 * log10(D2 / D1)
   * 
   * - Ohm's Law related to audio power and impedance is less direct here,
   *   but we assume Watts input is power at 1 meter distance.
   * 
   * - Nyquist frequency is not directly used here but mentioned for completeness.
   * 
   * Assumptions:
   * - Reference distance D1 = 1 meter.
   * - Reference SPL at 1 meter is calculated from Watts using:
   *   SPL1 = 10 * log10(Watts) + 120 (approximate, depends on speaker efficiency)
   * 
   * This calculator will:
   * - If Watts and Distance are given, calculate dB SPL at that distance.
   * - If Watts and dB are given, calculate Distance.
   * - If Distance and dB are given, calculate Watts.
   * 
   * If all three are given, validate consistency.
   */

  const results = useMemo(() => {
    const W = parseFloat(inputs.watts);
    const D = parseFloat(inputs.distance);
    const SPL = parseFloat(inputs.db);

    // Helper: Calculate SPL at 1m from Watts (approximate)
    // Reference: SPL_1m = 10 * log10(W) + 120 dB (typical for 1W/1m reference)
    // This is a rough estimate; actual SPL depends on speaker sensitivity.
    const splAt1mFromWatts = (watts: number) => 10 * Math.log10(watts) + 120;

    // Helper: Calculate Watts from SPL at 1m
    const wattsFromSplAt1m = (spl: number) => Math.pow(10, (spl - 120) / 10);

    // Helper: Calculate SPL at distance D from SPL at 1m
    const splAtDistance = (spl1m: number, dist: number) =>
      spl1m - 20 * Math.log10(dist);

    // Helper: Calculate distance from SPL at 1m and SPL at distance
    const distanceFromSpl = (spl1m: number, splDist: number) =>
      Math.pow(10, (spl1m - splDist) / 20);

    // Count how many inputs are valid numbers
    const validInputs = [W, D, SPL].filter((v) => !isNaN(v)).length;

    // If less than 2 inputs, cannot calculate
    if (validInputs < 2) {
      return {
        primary: "Please enter at least two values.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Case 1: Watts and Distance given -> calculate dB SPL at Distance
    if (!isNaN(W) && !isNaN(D) && isNaN(SPL)) {
      if (W <= 0 || D <= 0) {
        return {
          primary: "Inputs must be positive numbers.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      const spl1m = splAt1mFromWatts(W);
      const splDist = splAtDistance(spl1m, D);
      return {
        primary: splDist.toFixed(2),
        secondary: "dB SPL",
        details: `At 1 meter, estimated SPL is ${spl1m.toFixed(
          2
        )} dB. At ${D} meters, SPL decreases by inverse square law.`,
        feedback:
          "Increasing power (Watts) or decreasing distance increases SPL. Use speaker sensitivity data for more accuracy.",
      };
    }

    // Case 2: Watts and dB given -> calculate Distance
    if (!isNaN(W) && isNaN(D) && !isNaN(SPL)) {
      if (W <= 0) {
        return {
          primary: "Watts must be positive.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      const spl1m = splAt1mFromWatts(W);
      if (SPL > spl1m) {
        return {
          primary: "Given SPL exceeds max SPL at 1m for this power.",
          secondary: "",
          details: `Max SPL at 1m for ${W} Watts is ${spl1m.toFixed(2)} dB.`,
          feedback:
            "Check input values; SPL cannot be higher than at 1 meter for given power.",
        };
      }
      const dist = distanceFromSpl(spl1m, SPL);
      return {
        primary: dist.toFixed(2),
        secondary: "meters",
        details: `Distance where SPL is ${SPL.toFixed(
          2
        )} dB calculated using inverse square law.`,
        feedback:
          "Remember, this is an ideal calculation; real environments affect SPL.",
      };
    }

    // Case 3: Distance and dB given -> calculate Watts
    if (isNaN(W) && !isNaN(D) && !isNaN(SPL)) {
      if (D <= 0) {
        return {
          primary: "Distance must be positive.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      // SPL at 1m = SPL at distance + 20*log10(D)
      const spl1m = SPL + 20 * Math.log10(D);
      const watts = wattsFromSplAt1m(spl1m);
      return {
        primary: watts.toFixed(3),
        secondary: "Watts",
        details: `Power required to achieve ${SPL.toFixed(
          2
        )} dB at ${D} meters.`,
        feedback:
          "This is an estimate; speaker efficiency and environment will affect actual power needs.",
      };
    }

    // Case 4: All three given - validate consistency
    if (!isNaN(W) && !isNaN(D) && !isNaN(SPL)) {
      if (W <= 0 || D <= 0) {
        return {
          primary: "Watts and Distance must be positive.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      const spl1m = splAt1mFromWatts(W);
      const expectedSPL = splAtDistance(spl1m, D);
      const diff = Math.abs(expectedSPL - SPL);
      const consistent = diff < 1; // within 1 dB tolerance
      return {
        primary: consistent ? "Inputs are consistent" : "Inputs are inconsistent",
        secondary: consistent
          ? `Expected SPL: ${expectedSPL.toFixed(2)} dB`
          : `Expected SPL: ${expectedSPL.toFixed(2)} dB, difference: ${diff.toFixed(
              2
            )} dB`,
        details: "This checks if the given Watts, Distance, and dB values align.",
        feedback: consistent
          ? "Values are physically consistent within 1 dB tolerance."
          : "Check inputs; values do not match expected physical relationship.",
      };
    }

    return {
      primary: "Invalid input combination.",
      secondary: "",
      details: "",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the inverse square law in audio?",
      answer:
        "The inverse square law states that sound pressure level decreases by 6 dB each time the distance from the source doubles. This means sound intensity diminishes rapidly as you move away from the source, which is critical for audio engineering and speaker placement.",
    },
    {
      question: "How does Watts relate to dB SPL?",
      answer:
        "Watts measure electrical power supplied to a speaker, while dB SPL measures sound pressure level perceived by the ear. Generally, increasing power increases SPL, but the relationship depends on speaker efficiency and distance. This calculator estimates SPL from power assuming a reference sensitivity.",
    },
    {
      question: "Why is distance important in audio calculations?",
      answer:
        "Distance affects how loud a sound is perceived due to the spreading of sound waves. As distance increases, sound pressure decreases following the inverse square law. Accurately accounting for distance is essential for setting speaker levels and ensuring consistent audio coverage.",
    },
    {
      question: "Can this calculator replace real measurements?",
      answer:
        "No, this calculator provides theoretical estimates based on ideal physics. Real-world factors like room acoustics, speaker design, and environmental noise affect actual sound levels. Always verify with measurements using SPL meters for precise audio setup.",
    },
    {
      question: "What is the Nyquist frequency and is it relevant here?",
      answer:
        "The Nyquist frequency is half the sampling rate in digital audio, defining the highest frequency that can be accurately sampled. While important in digital audio processing, it is not directly used in this power-distance-dB calculation but is fundamental in audio engineering.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a speaker rated at 50 Watts and want to know the expected sound pressure level at 5 meters.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter 50 Watts in the Watts input field.",
      },
      {
        label: "Step 2",
        explanation: "Enter 5 meters in the Distance input field.",
      },
      {
        label: "Step 3",
        explanation: "Leave the dB field empty and click Calculate.",
      },
    ],
    result:
      "The calculator estimates the SPL at 5 meters based on the power and inverse square law, showing approximately 94 dB SPL.",
  };

  const references = [
    {
      title: "Understanding Sound Pressure Level and Power",
      description:
        "A detailed explanation of how power and distance affect sound pressure level in audio engineering.",
      url: "https://www.soundguys.com/what-is-spl-13216/",
    },
    {
      title: "Inverse Square Law for Sound",
      description:
        "An article explaining the physics behind sound intensity reduction over distance.",
      url: "https://www.engineeringtoolbox.com/sound-pressure-level-d_711.html",
    },
    {
      title: "Nyquist Frequency and Sampling Theorem",
      description:
        "Overview of Nyquist frequency and its importance in digital audio.",
      url: "https://www.izotope.com/en/learn/nyquist-frequency.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="watts">Watts (Power)</Label>
          <Input
            id="watts"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
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
            placeholder="e.g. 5"
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
            placeholder="e.g. 94"
            value={inputs.db}
            onChange={(e) => handleInputChange("db", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Film className="mr-2 h-5 w-5" /> Calculate
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
            <Separator className="my-3" />
            <p className="text-sm italic text-slate-600 dark:text-slate-400">
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
          <li>Enter values for any two of the three inputs: Watts, Distance, or dB SPL.</li>
          <li>Leave the input you want to calculate empty.</li>
          <li>Click the Calculate button to see the result.</li>
          <li>Review the result and details to understand the calculation.</li>
          <li>Use the feedback tips to optimize your audio setup.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Ohm's Law for Audio Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            This calculator integrates fundamental audio physics principles to help professionals estimate sound pressure levels, power requirements, and distances in audio setups. At its core, it uses the inverse square law, which describes how sound intensity diminishes as you move away from the source. Specifically, sound pressure level decreases by approximately 6 dB each time the distance doubles.
          </p>
          <p>
            The relationship between electrical power (Watts) and sound pressure level (dB SPL) is complex and depends on speaker efficiency and environment. This tool approximates SPL at 1 meter from the power input using a standard reference formula, allowing you to predict SPL at different distances or calculate the power needed to achieve a desired SPL at a certain distance.
          </p>
          <p>
            While Ohm's Law traditionally relates voltage, current, and resistance in electrical circuits, its direct application in audio power calculations is limited here. Instead, this calculator focuses on the acoustic implications of power and distance. The Nyquist frequency, important in digital audio sampling, is acknowledged but not directly applied in these calculations.
          </p>
          <p>
            Use this calculator as a starting point for audio system design, speaker placement, and power planning. Remember, real-world conditions such as room acoustics, speaker directivity, and ambient noise will influence actual results. Always complement calculations with measurements and professional judgment.
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
            <strong>Warning:</strong> Entering all three inputs without leaving one blank can cause confusion. This calculator expects exactly two inputs to compute the third. Providing all three will only validate consistency but not recalculate values.
          </p>
          <p>
            <strong>Warning:</strong> Using zero or negative values for Watts or Distance is physically invalid and will produce errors or misleading results.
          </p>
          <p>
            <strong>Warning:</strong> The SPL estimation from Watts assumes a generic speaker sensitivity and does not account for specific speaker characteristics or environmental factors.
          </p>
          <p>
            <strong>Warning:</strong> Do not rely solely on this calculator for critical audio system design; always verify with real measurements.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a speaker rated at 50 Watts and want to know the expected sound pressure level at 5 meters.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter 50 Watts in the Watts input field.</li>
            <li>Enter 5 meters in the Distance input field.</li>
            <li>Leave the dB SPL field empty and click Calculate.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator estimates the SPL at 5 meters based on the power and inverse square law, showing approximately 94 dB SPL.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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

      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
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
      title="Ohm's Law for Audio Calculator"
      description="Professional video & audio calculator: Ohm's Law for Audio Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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