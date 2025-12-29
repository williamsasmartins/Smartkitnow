import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpeakerCrossoverCalculator() {
  /**
   * Speaker Crossover Calculator
   * 
   * Calculates the crossover frequency and component values for a 2-way speaker crossover network.
   * 
   * Inputs:
   * - Speaker impedance (Ohms)
   * - Desired crossover frequency (Hz)
   * - Type of crossover filter (Butterworth 12dB/octave or Linkwitz-Riley 24dB/octave)
   * 
   * Outputs:
   * - Inductor and capacitor values for low-pass and high-pass filters
   * - Explanation and optimization tips
   */

  const [inputs, setInputs] = useState({
    impedance: "", // Speaker impedance in Ohms
    frequency: "", // Crossover frequency in Hz
    filterType: "butterworth" // Filter type: butterworth or linkwitz-riley
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Validate positive number
  const isPositiveNumber = (value: string) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  };

  // Calculate crossover component values
  // Formulas for 2nd order Butterworth and Linkwitz-Riley 2-way crossovers:
  // For Butterworth 12dB/octave (1st order) crossover:
  //   L = Z / (2 * π * f)
  //   C = 1 / (2 * π * f * Z)
  //
  // For Linkwitz-Riley 24dB/octave (2nd order) crossover:
  //   L = Z / (2 * π * f) * sqrt(2)
  //   C = 1 / (2 * π * f * Z) * sqrt(2)
  //
  // We'll provide both low-pass (inductor + capacitor) and high-pass (capacitor + inductor) values.

  const results = useMemo(() => {
    if (!isPositiveNumber(inputs.impedance) || !isPositiveNumber(inputs.frequency)) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter positive numeric values for impedance and frequency.",
        feedback: ""
      };
    }

    const Z = Number(inputs.impedance);
    const f = Number(inputs.frequency);
    const omega = 2 * Math.PI * f;

    let L_low = 0;
    let C_low = 0;
    let C_high = 0;
    let L_high = 0;

    if (inputs.filterType === "butterworth") {
      // 1st order Butterworth (12dB/octave)
      L_low = Z / omega;
      C_low = 1 / (omega * Z);
      C_high = C_low;
      L_high = L_low;
    } else if (inputs.filterType === "linkwitz-riley") {
      // 2nd order Linkwitz-Riley (24dB/octave)
      const factor = Math.sqrt(2);
      L_low = (Z / omega) * factor;
      C_low = (1 / (omega * Z)) * factor;
      C_high = C_low;
      L_high = L_low;
    } else {
      return {
        primary: "Unknown filter type",
        secondary: "",
        details: "Please select a valid filter type.",
        feedback: ""
      };
    }

    // Format values in mH and uF for readability
    const formatInductor = (henry: number) => (henry * 1000).toFixed(2) + " mH";
    const formatCapacitor = (farad: number) => (farad * 1e6).toFixed(2) + " µF";

    const details = `
      Low-pass filter components:
      Inductor (L) = ${formatInductor(L_low)}
      Capacitor (C) = ${formatCapacitor(C_low)}

      High-pass filter components:
      Capacitor (C) = ${formatCapacitor(C_high)}
      Inductor (L) = ${formatInductor(L_high)}
    `;

    const feedback =
      "Ensure your speaker impedance matches the input impedance for accurate crossover performance. " +
      "Use quality inductors and capacitors rated for audio frequencies to minimize distortion.";

    return {
      primary: `${inputs.frequency} Hz`,
      secondary: `Crossover for ${inputs.impedance} Ω (${inputs.filterType === "butterworth" ? "Butterworth 12dB/oct" : "Linkwitz-Riley 24dB/oct"})`,
      details: details.trim(),
      feedback
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a speaker crossover and why is it important?",
      answer:
        "A speaker crossover is an electronic circuit that divides an audio signal into separate frequency bands, directing them to appropriate drivers such as woofers and tweeters. This ensures each driver only handles frequencies it is designed for, improving sound clarity and preventing damage. Proper crossover design is essential for balanced and high-quality audio reproduction."
    },
    {
      question: "How do I choose the crossover frequency?",
      answer:
        "The crossover frequency depends on the drivers used in your speaker system and their frequency response ranges. Typically, it is chosen where the woofer and tweeter frequency responses overlap smoothly, often between 1,500 Hz and 3,000 Hz. Selecting the right frequency ensures seamless integration and prevents frequency gaps or overlaps."
    },
    {
      question: "What is the difference between Butterworth and Linkwitz-Riley filters?",
      answer:
        "Butterworth filters provide a maximally flat frequency response in the passband with a 12dB/octave slope for first-order filters. Linkwitz-Riley filters are designed by cascading two Butterworth filters, resulting in a 24dB/octave slope and a flat summed response at the crossover frequency. Linkwitz-Riley filters are preferred for smoother driver integration."
    },
    {
      question: "Can I use this calculator for 3-way crossovers?",
      answer:
        "This calculator is designed for 2-way speaker crossovers only. Designing 3-way or more complex crossovers requires additional calculations and components, often involving multiple crossover frequencies and slopes. Specialized software or professional consultation is recommended for multi-way crossover design."
    },
    {
      question: "Why do the calculated component values sometimes differ from commercial crossover parts?",
      answer:
        "Commercial crossovers often use standard component values and may include additional elements like resistors or compensation networks to tailor the sound. Also, real-world speaker impedance varies with frequency, so calculated values serve as a starting point. Fine-tuning by ear and measurement is common in practical applications."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to design a 2-way crossover for a speaker system with an 8 Ω impedance and a crossover frequency of 2500 Hz using a Linkwitz-Riley 24dB/octave filter.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the speaker impedance as 8 Ω."
      },
      {
        label: "Step 2",
        explanation: "Set the crossover frequency to 2500 Hz."
      },
      {
        label: "Step 3",
        explanation: "Select the filter type as Linkwitz-Riley."
      },
      {
        label: "Step 4",
        explanation: "Click Calculate to get the inductor and capacitor values."
      }
    ],
    result:
      "The calculator outputs the required inductor and capacitor values for both low-pass and high-pass filters, allowing you to build or specify the crossover components accurately."
  };

  const references = [
    {
      title: "Loudspeaker Crossover Design Basics",
      description:
        "A comprehensive guide on speaker crossover design principles and formulas.",
      url: "https://www.audioheritage.org/vbulletin/showthread.php?123-Loudspeaker-Crossover-Design-Basics"
    },
    {
      title: "Linkwitz-Riley Filter Explanation",
      description:
        "Detailed explanation of Linkwitz-Riley crossover filters and their advantages.",
      url: "https://www.linkwitzlab.com/filters.htm"
    },
    {
      title: "Electronics Tutorials - Filters",
      description:
        "General electronics tutorials covering filter types and calculations.",
      url: "https://www.electronics-tutorials.ws/filter/filter_2.html"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Speaker Impedance (Ω)</Label>
          <Input
            type="number"
            min="1"
            step="0.1"
            placeholder="e.g. 8"
            value={inputs.impedance}
            onChange={(e) => handleInputChange("impedance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Crossover Frequency (Hz)</Label>
          <Input
            type="number"
            min="20"
            max="20000"
            step="1"
            placeholder="e.g. 2500"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Filter Type</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
            value={inputs.filterType}
            onChange={(e) => handleInputChange("filterType", e.target.value)}
          >
            <option value="butterworth">Butterworth 12dB/octave</option>
            <option value="linkwitz-riley">Linkwitz-Riley 24dB/octave</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center whitespace-pre-line">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <Separator className="my-4" />
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-4" />
            <p className="text-sm italic text-slate-700 dark:text-slate-300">{results.feedback}</p>
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
          <li>Enter the speaker impedance in ohms (Ω). Typical values are 4, 6, or 8 Ω.</li>
          <li>Input the desired crossover frequency in hertz (Hz), usually between 500 Hz and 5000 Hz depending on your drivers.</li>
          <li>Select the filter type: Butterworth (12dB/octave) or Linkwitz-Riley (24dB/octave).</li>
          <li>Click the Calculate button to compute the required inductor and capacitor values for both low-pass and high-pass filters.</li>
          <li>Use the results to build or specify your speaker crossover network components.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Speaker Crossover Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Speaker crossovers are essential components in multi-driver speaker systems, designed to split the audio signal into separate frequency bands that are sent to the appropriate drivers such as woofers, midranges, and tweeters. This ensures that each driver operates within its optimal frequency range, improving sound clarity, efficiency, and preventing damage from frequencies outside their design.
          </p>
          <p>
            The most common type of crossover used in 2-way speaker systems is the 2nd order Linkwitz-Riley filter, which provides a steep 24dB/octave slope and a flat summed frequency response at the crossover point. Alternatively, simpler 1st order Butterworth crossovers with 12dB/octave slopes are sometimes used for their simplicity and phase characteristics.
          </p>
          <p>
            This calculator helps you determine the values of inductors and capacitors required to build these crossovers based on your speaker's impedance and desired crossover frequency. The formulas used take into account the electrical properties of the components and the speaker load to provide accurate component values.
          </p>
          <p>
            When designing your crossover, it is important to consider the impedance of your drivers, as mismatched impedance can lead to incorrect crossover points and degraded sound quality. Additionally, real-world speaker impedance varies with frequency, so these calculations serve as a starting point. Fine-tuning by listening tests and measurements is often necessary.
          </p>
          <p>
            Using high-quality components rated for audio frequencies will help minimize distortion and power loss. Inductors should have low DC resistance and capacitors should be non-polarized and designed for audio use.
          </p>
          <p>
            In summary, this calculator provides a practical and professional tool for audio engineers, DIY enthusiasts, and video production professionals to design effective speaker crossovers for their sound systems.
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
            <strong>Warning:</strong> Entering incorrect impedance or frequency values can lead to invalid or unusable component values. Always verify your speaker specifications before using this calculator.
          </p>
          <p>
            Using first-order Butterworth filters when a steeper slope is required can cause driver overlap and distortion. Choose the filter type carefully based on your system needs.
          </p>
          <p>
            Neglecting the real-world variation of speaker impedance across frequencies may cause the crossover to perform differently than expected. Use this calculator as a starting point and adjust as needed.
          </p>
          <p>
            Using low-quality or incorrect components can degrade sound quality and damage your speakers. Always use components rated for audio applications.
          </p>
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
      title="Speaker Crossover Calculator"
      description="Professional video & audio calculator: Speaker Crossover Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}