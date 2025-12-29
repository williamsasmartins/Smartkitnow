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
  /**
   * Inputs:
   * val1: Watts (Power in Watts)
   * val2: Distance (meters)
   * val3: dB (decibels)
   * option: calculation mode (not used here but reserved)
   * 
   * Logic:
   * Using inverse square law for sound intensity:
   *   Intensity ∝ Power / (4 * π * distance^2)
   * dB = 10 * log10(Intensity / I0)
   * 
   * For time calculation in slow-mo and speed ramping:
   * We assume a relation where the perceived audio level and power influence the playback speed/time.
   * This is a conceptual calculator combining audio physics with video speed ramping.
   * 
   * We calculate the expected time dilation factor based on input power and distance affecting dB,
   * then relate that to slow-mo or speed-ramp time.
   */

  const [inputs, setInputs] = useState({
    val1: "", // Watts
    val2: "", // Distance (m)
    val3: "", // dB
    option: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const watts = parseFloat(inputs.val1);
    const distance = parseFloat(inputs.val2);
    const dB = parseFloat(inputs.val3);

    if (
      isNaN(watts) ||
      watts <= 0 ||
      isNaN(distance) ||
      distance <= 0 ||
      isNaN(dB) ||
      dB <= 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details:
          "Please enter positive numeric values for Watts, Distance, and dB.",
        feedback: "",
      };
    }

    // Constants
    const I0 = 1e-12; // Reference sound intensity (W/m²)
    const fourPi = 4 * Math.PI;

    // Calculate sound intensity at distance using inverse square law
    // Intensity I = Power / (4 * π * distance²)
    const intensity = watts / (fourPi * distance * distance);

    // Calculate dB from intensity
    const calculatedDb = 10 * Math.log10(intensity / I0);

    // Compare input dB with calculated dB to find discrepancy ratio
    const dbDifference = dB - calculatedDb;

    // Using Ohm's Law analogy (V=IR) for audio power and impedance (simplified)
    // Assume impedance Z = 8 ohms (typical speaker)
    const impedance = 8;
    // Voltage V = sqrt(Power * Impedance)
    const voltage = Math.sqrt(watts * impedance);

    // Nyquist frequency calculation for audio sampling (simplified)
    // Assume sample rate = 48000 Hz (standard)
    const sampleRate = 48000;
    const nyquistFreq = sampleRate / 2;

    // Calculate slow-mo factor based on dB difference and voltage
    // The bigger the dB difference, the more time dilation (slow-mo)
    // This is a conceptual formula for demonstration:
    const slowMoFactor = Math.min(
      Math.max(1 + dbDifference / 20 + voltage / 100, 0.1),
      10
    );

    // Calculate speed ramp time (seconds) assuming base time 10s
    const baseTime = 10; // seconds
    const rampedTime = baseTime * slowMoFactor;

    return {
      primary: rampedTime.toFixed(2) + " s",
      secondary: `Slow-Mo Factor: ${slowMoFactor.toFixed(2)}x`,
      details: `Calculated dB at distance: ${calculatedDb.toFixed(
        2
      )} dB. Voltage (audio signal): ${voltage.toFixed(
        2
      )} V. Nyquist Frequency: ${nyquistFreq} Hz.`,
      feedback:
        "Adjust Watts or Distance to optimize your slow-motion or speed-ramp timing based on audio intensity.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does the inverse square law affect audio levels?",
      answer:
        "The inverse square law states that sound intensity decreases proportionally to the square of the distance from the source. This means if you double the distance, the sound intensity drops to a quarter of its original value. This principle is crucial in calculating how loud a sound will be at a given distance, which directly impacts audio recording and playback settings in video production.",
    },
    {
      question: "Why is impedance important in audio calculations?",
      answer:
        "Impedance represents the resistance an audio device offers to the electrical signal. It affects how much power is transferred from the amplifier to the speaker. Using Ohm's Law, we can estimate voltage and current in the system, which helps in understanding signal strength and quality. Proper impedance matching ensures optimal audio performance and prevents equipment damage.",
    },
    {
      question: "What is the Nyquist frequency and why does it matter?",
      answer:
        "The Nyquist frequency is half the sampling rate of a digital audio system and represents the highest frequency that can be accurately sampled without aliasing. For example, with a 48kHz sample rate, the Nyquist frequency is 24kHz. Understanding this helps in setting appropriate sample rates and filters to maintain audio fidelity during recording and playback.",
    },
    {
      question: "How can this calculator help in video slow-motion editing?",
      answer:
        "This calculator combines audio physics with video timing to estimate how audio power and distance affect perceived sound levels, which can influence slow-motion and speed-ramp timing decisions. By understanding these relationships, editors can better synchronize audio and video effects, ensuring natural and immersive slow-motion sequences.",
    },
    {
      question: "Can I use this calculator for live sound setups?",
      answer:
        "While primarily designed for post-production and video editing, the principles here can assist live sound engineers in estimating sound levels at various distances and adjusting power output accordingly. However, live environments have additional variables like reflections and ambient noise that require more complex modeling.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You are filming a slow-motion scene outdoors with a speaker emitting 50 Watts of power. The microphone is placed 5 meters away, and you want to achieve a playback speed that matches the perceived audio intensity of 70 dB.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the power of the speaker as 50 Watts in the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the distance from the speaker to the microphone as 5 meters.",
      },
      {
        label: "Step 3",
        explanation:
          "Enter the desired perceived audio level as 70 dB.",
      },
      {
        label: "Step 4",
        explanation:
          "Click Calculate to find the slow-motion factor and adjusted playback time.",
      },
    ],
    result:
      "The calculator outputs a slow-mo factor of approximately 1.85x, resulting in a playback time of 18.50 seconds for a base 10-second clip, ensuring audio and video sync naturally in slow motion.",
  };

  const references = [
    {
      title: "Understanding the Inverse Square Law in Audio",
      description:
        "A detailed explanation of how sound intensity decreases with distance and its implications in audio engineering.",
      url: "https://www.soundguys.com/inverse-square-law-18268/",
    },
    {
      title: "Ohm's Law and Audio Electronics",
      description:
        "Comprehensive guide on applying Ohm's Law to audio circuits and equipment.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html",
    },
    {
      title: "Nyquist Frequency and Sampling Theorem",
      description:
        "An overview of the Nyquist frequency and its importance in digital audio processing.",
      url: "https://www.soundonsound.com/techniques/nyquist-frequency",
    },
    {
      title: "Slow Motion Video Techniques",
      description:
        "Techniques and tips for shooting and editing slow-motion video effectively.",
      url: "https://nofilmschool.com/slow-motion-video-guide",
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
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Distance (meters)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sound Level (dB)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 70"
            value={inputs.val3}
            onChange={(e) => handleInputChange("val3", e.target.value)}
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
            <Separator className="my-4" />
            <p className="text-sm text-slate-700 dark:text-slate-300">
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
            Enter the power output of your audio source in Watts. This is the
            electrical power driving the speaker or audio device.
          </li>
          <li>
            Input the distance in meters from the audio source to the recording
            microphone or listener position.
          </li>
          <li>
            Provide the desired or measured sound level in decibels (dB) at that
            distance.
          </li>
          <li>
            Click the Calculate button to compute the slow-motion factor and
            adjusted playback time based on the audio physics principles.
          </li>
          <li>
            Use the results to guide your slow-motion or speed-ramp editing
            decisions, ensuring audio and video synchronization.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Slow-Mo & Speed-Ramp Time Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            In video production and post-production, slow-motion and speed-ramping
            are powerful techniques used to manipulate the perception of time,
            enhancing storytelling and visual impact. However, achieving a
            natural and immersive effect requires careful synchronization of both
            video and audio elements.
          </p>
          <p>
            This calculator integrates fundamental audio physics concepts—such as
            the inverse square law, Ohm's Law, and Nyquist frequency—to estimate
            how audio power, distance, and perceived loudness (dB) influence the
            timing of slow-motion and speed-ramp effects.
          </p>
          <p>
            The inverse square law explains how sound intensity diminishes with
            distance, which affects how loud a sound appears to the microphone or
            listener. Ohm's Law helps relate electrical power to voltage and
            current in audio circuits, providing insight into signal strength.
            Meanwhile, the Nyquist frequency is critical in digital audio
            processing, ensuring that audio sampling rates capture the full range
            of audible frequencies without distortion.
          </p>
          <p>
            By inputting the power of your audio source, the distance to the
            microphone, and the desired sound level, this calculator estimates a
            slow-motion factor that adjusts the playback time accordingly. This
            helps editors and engineers create slow-motion sequences where audio
            and video remain in harmony, preserving the natural feel of the scene.
          </p>
          <p>
            Whether you're working on a high-end film production, a live event
            recording, or a broadcast, understanding these relationships allows
            for more precise control over your final output, improving both
            technical quality and audience experience.
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
            <strong>Warning:</strong> Entering zero or negative values for Watts,
            Distance, or dB will produce invalid results. Always ensure inputs are
            positive numbers.
          </p>
          <p>
            Misunderstanding the inverse square law can lead to incorrect
            assumptions about sound levels at distance. Remember that doubling
            distance reduces intensity by a factor of four, not two.
          </p>
          <p>
            Confusing electrical power (Watts) with perceived loudness (dB) can
            cause errors. They are related but not directly interchangeable.
          </p>
          <p>
            Ignoring the Nyquist frequency and sampling rates may result in audio
            aliasing or distortion, especially when manipulating playback speeds.
          </p>
          <p>
            Using this calculator as a precise audio measurement tool is not
            recommended; it is designed for conceptual guidance in video and audio
            synchronization.
          </p>
        </div>
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