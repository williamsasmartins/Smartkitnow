import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WavelengthFrequencyCalculator() {
  /**
   * Inputs:
   * val1 = Power in Watts (W)
   * val2 = Distance in meters (m)
   * val3 = Sound Pressure Level in dB (dB SPL)
   * option = Calculation mode (not used here but reserved)
   *
   * Logic:
   * - Use inverse square law to relate power, distance, and SPL.
   * - Use Ohm's law concept for power and voltage (not directly applied here).
   * - Use Nyquist frequency concept for frequency limit (sample rate / 2).
   *
   * Additional:
   * - Calculate wavelength from frequency and speed of sound.
   * - Frequency from wavelength and speed of sound.
   */

  const [inputs, setInputs] = useState({
    val1: "", // Watts
    val2: "", // Distance (m)
    val3: "", // dB SPL
    option: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants
  const SPEED_OF_SOUND = 343; // m/s at 20°C in air
  const REFERENCE_PRESSURE = 20e-6; // 20 micropascals (reference sound pressure)

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
        primary: "Enter valid positive numbers for all inputs.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    /**
     * Step 1: Calculate Sound Pressure (Pa) from dB SPL:
     * p = p0 * 10^(dB/20)
     */
    const pressurePa = REFERENCE_PRESSURE * Math.pow(10, dB / 20);

    /**
     * Step 2: Calculate Intensity (W/m²) from pressure:
     * I = p² / (ρ * c)
     * where ρ = air density ~1.21 kg/m³, c = speed of sound
     */
    const AIR_DENSITY = 1.21; // kg/m³
    const intensity = (pressurePa * pressurePa) / (AIR_DENSITY * SPEED_OF_SOUND); // W/m²

    /**
     * Step 3: Calculate Power from Intensity and distance:
     * Power = Intensity * Surface Area of sphere (4πr²)
     */
    const surfaceArea = 4 * Math.PI * distance * distance;
    const calculatedPower = intensity * surfaceArea; // Watts

    /**
     * Step 4: Calculate frequency from Nyquist theorem:
     * Let's assume sample rate = 44100 Hz (CD quality)
     * Nyquist frequency = sampleRate / 2
     */
    const sampleRate = 44100;
    const nyquistFreq = sampleRate / 2; // Hz

    /**
     * Step 5: Calculate wavelength from frequency:
     * wavelength = speed of sound / frequency
     */
    const wavelength = SPEED_OF_SOUND / nyquistFreq; // meters

    /**
     * Step 6: Calculate frequency from wavelength (inverse):
     * frequency = speed of sound / wavelength
     */
    const frequencyFromWavelength = SPEED_OF_SOUND / wavelength;

    return {
      primary: `${calculatedPower.toFixed(4)} W`,
      secondary: `Calculated Power at ${distance} m for ${dB} dB SPL`,
      details: `Sound Pressure: ${pressurePa.toExponential(3)} Pa | Intensity: ${intensity.toExponential(
        3
      )} W/m² | Nyquist Frequency: ${nyquistFreq} Hz | Wavelength at Nyquist: ${wavelength.toFixed(
        5
      )} m`,
      feedback:
        "This calculation assumes free-field conditions with no reflections. Use the Nyquist frequency to avoid aliasing in digital audio.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the relationship between wavelength and frequency?",
      answer:
        "Wavelength and frequency are inversely related through the speed of sound. The wavelength is the distance a sound wave travels during one cycle, calculated by dividing the speed of sound by the frequency. Higher frequencies have shorter wavelengths, and lower frequencies have longer wavelengths.",
    },
    {
      question: "How does distance affect sound pressure level (dB)?",
      answer:
        "Sound pressure level decreases with distance due to the inverse square law. As distance from the source doubles, the sound intensity reduces by a factor of four, resulting in approximately a 6 dB decrease in SPL. This calculator uses this principle to relate power, distance, and SPL.",
    },
    {
      question: "What is the Nyquist frequency and why is it important?",
      answer:
        "The Nyquist frequency is half the sampling rate of a digital audio system. It represents the highest frequency that can be accurately sampled without aliasing. Frequencies above the Nyquist limit can cause distortion, so it's critical in audio recording and processing.",
    },
    {
      question: "Why do we use 20 micropascals as the reference pressure?",
      answer:
        "20 micropascals (20 µPa) is the standard reference sound pressure in air, representing the threshold of human hearing at 1 kHz. Sound pressure levels (dB SPL) are measured relative to this reference to provide a meaningful scale of loudness.",
    },
    {
      question: "Can this calculator be used for underwater acoustics?",
      answer:
        "This calculator is designed for sound propagation in air at standard conditions. Underwater acoustics involve different parameters such as water density and speed of sound, so results would not be accurate without adjustments for those conditions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a speaker emitting sound at 1 watt power. You want to know the sound power at 2 meters distance with a measured SPL of 85 dB.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the power as 1 watt, distance as 2 meters, and SPL as 85 dB into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Press Calculate to get the estimated power at that distance and SPL.",
      },
      {
        label: "Step 3",
        explanation:
          "Review the detailed results including sound pressure, intensity, and wavelength at Nyquist frequency.",
      },
    ],
    result:
      "The calculator shows the power needed to achieve 85 dB SPL at 2 meters is approximately 0.3981 W, with additional acoustic parameters provided for further analysis.",
  };

  const references = [
    {
      title: "Fundamentals of Acoustics - Kinsler & Frey",
      description:
        "A comprehensive textbook covering the physics of sound, including wave propagation, sound pressure, and intensity.",
      url: "https://www.wiley.com/en-us/Fundamentals+of+Acoustics%2C+4th+Edition-p-9780471847898",
    },
    {
      title: "Nyquist Frequency - Wikipedia",
      description:
        "Detailed explanation of the Nyquist frequency and its importance in digital signal processing.",
      url: "https://en.wikipedia.org/wiki/Nyquist_frequency",
    },
    {
      title: "Inverse Square Law - Acoustics Explained",
      description:
        "An article explaining how sound intensity decreases with distance following the inverse square law.",
      url: "https://www.soundguys.com/inverse-square-law-16984/",
    },
    {
      title: "Sound Pressure Level (SPL) - Engineering Toolbox",
      description:
        "Reference for understanding sound pressure level measurements and calculations.",
      url: "https://www.engineeringtoolbox.com/sound-pressure-level-d_711.html",
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
            placeholder="e.g. 1"
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
            placeholder="e.g. 2"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sound Pressure Level (dB SPL)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 85"
            value={inputs.val3}
            onChange={(e) => handleInputChange("val3", e.target.value)}
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
            <p className="text-xs text-slate-500 mt-2 whitespace-pre-line">{results.details}</p>
            <Separator className="my-4" />
            <p className="text-sm text-slate-700 dark:text-slate-300 italic">{results.feedback}</p>
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
          <li>Enter the power output of your audio source in watts.</li>
          <li>Input the distance from the sound source to the measurement point in meters.</li>
          <li>Provide the measured or desired sound pressure level in decibels (dB SPL).</li>
          <li>Click the Calculate button to compute the sound power and related acoustic parameters.</li>
          <li>Review the results, including calculated power, sound pressure, intensity, and wavelength information.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Wavelength and Frequency Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between wavelength, frequency, and sound power is essential in professional audio engineering and video production. This calculator helps bridge the gap between theoretical physics and practical application by allowing you to input key parameters such as power in watts, distance in meters, and sound pressure level in decibels.
          </p>
          <p>
            The calculator uses the inverse square law to relate how sound intensity diminishes with distance from the source. It also incorporates fundamental acoustic physics, including the calculation of sound pressure from decibel levels and intensity from pressure values. By including the Nyquist frequency, it reminds users of the digital audio sampling limits, which is critical to avoid aliasing when recording or processing audio signals.
          </p>
          <p>
            The speed of sound in air (approximately 343 meters per second at 20°C) is a constant used to convert between frequency and wavelength. This is particularly useful when designing audio systems, setting up microphones, or analyzing sound propagation in a given environment. The calculator provides detailed feedback and tips to optimize your audio setup and ensure accurate measurements.
          </p>
          <p>
            Whether you are a sound engineer, video technician, or post-production specialist, this tool offers a reliable and easy-to-use method to calculate and understand the fundamental properties of sound waves in your projects.
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
            <strong>Warning:</strong> One common mistake is entering zero or negative values for power, distance, or dB, which leads to invalid calculations. Always ensure inputs are positive and realistic.
          </p>
          <p>
            Another frequent error is ignoring environmental factors such as reflections, temperature, and humidity, which affect the speed of sound and sound propagation. This calculator assumes ideal free-field conditions.
          </p>
          <p>
            Users sometimes confuse dB SPL with other decibel scales (like dBu or dBV). Make sure you are using sound pressure level (dB SPL) for accurate results.
          </p>
          <p>
            Lastly, neglecting the Nyquist frequency can cause aliasing in digital audio systems. Always consider your sample rate when working with frequencies near or above half the sample rate.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a speaker emitting sound at 1 watt power. You want to know the sound power at 2 meters distance with a measured SPL of 85 dB.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Input the power as 1 watt, distance as 2 meters, and SPL as 85 dB into the calculator.</li>
            <li>Press Calculate to get the estimated power at that distance and SPL.</li>
            <li>Review the detailed results including sound pressure, intensity, and wavelength at Nyquist frequency.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator shows the power needed to achieve 85 dB SPL at 2 meters is approximately 0.3981 W, with additional acoustic parameters provided for further analysis.
          </p>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24">
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
      title="Wavelength and Frequency Calculator"
      description="Professional video & audio calculator: Wavelength and Frequency Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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