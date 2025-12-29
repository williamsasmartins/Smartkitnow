import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DbuDbvConversionCalculator() {
  const [inputs, setInputs] = useState({
    dBu: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Conversion logic:
   * dBV = dBu - 2.218
   * Explanation:
   * dBu is referenced to 0.775 volts RMS
   * dBV is referenced to 1 volt RMS
   * 20 * log10(0.775) ≈ -2.218 dB
   */

  const results = useMemo(() => {
    const dBuVal = parseFloat(inputs.dBu);
    if (isNaN(dBuVal)) {
      return null;
    }
    const dBV = dBuVal - 2.218;
    return {
      primary: dBV.toFixed(3),
      secondary: "dBV",
      details: `Converted from ${dBuVal.toFixed(3)} dBu using formula: dBV = dBu - 2.218`,
      feedback:
        "This conversion helps in comparing audio signal levels referenced to different voltage standards.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between dBu and dBV?",
      answer:
        "dBu and dBV are both units used to express voltage levels in audio signals, but they reference different voltages. dBu is referenced to 0.775 volts RMS, while dBV is referenced to 1 volt RMS. This means that 0 dBV equals 2.218 dBu. Understanding this difference is crucial for accurate audio level conversions and ensuring compatibility between equipment.",
    },
    {
      question: "Why do we subtract 2.218 to convert dBu to dBV?",
      answer:
        "The subtraction of 2.218 comes from the logarithmic relationship between the reference voltages. Since dBu is referenced to 0.775 volts and dBV to 1 volt, the conversion factor is 20 times the log base 10 of 0.775, which equals approximately -2.218 dB. This factor adjusts the dBu value to the dBV scale.",
    },
    {
      question: "Can I convert dBV back to dBu using this calculator?",
      answer:
        "This calculator is designed specifically for converting dBu to dBV. However, to convert dBV back to dBu, you simply add 2.218 to the dBV value. For example, if you have 0 dBV, adding 2.218 gives you 2.218 dBu.",
    },
    {
      question: "Is this conversion relevant for digital audio signals?",
      answer:
        "While dBu and dBV are primarily used in analog audio signal measurements, understanding these units is still important in digital audio workflows, especially when interfacing with analog equipment. Proper level matching ensures optimal signal quality and prevents distortion or noise.",
    },
    {
      question: "What practical applications require dBu to dBV conversion?",
      answer:
        "Audio engineers often need to convert between dBu and dBV when calibrating equipment, setting gain structures, or comparing signal levels from different devices. This conversion ensures consistent and accurate audio levels across various stages of production and broadcasting.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have an audio signal level measured at 10 dBu and need to know its equivalent in dBV to match the input sensitivity of a device specified in dBV.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the measured dBu value (10) into the calculator input field.",
      },
      {
        label: "Step 2",
        explanation:
          "Click the Calculate button to perform the conversion.",
      },
      {
        label: "Step 3",
        explanation:
          "Read the result displayed as 7.782 dBV, which is the equivalent voltage level referenced to 1 volt RMS.",
      },
    ],
    result:
      "The 10 dBu signal corresponds to approximately 7.782 dBV, allowing you to correctly set the device input level.",
  };

  const references = [
    {
      title: "AES Standard on Audio Level Units",
      description:
        "Detailed explanation of audio voltage units including dBu and dBV, their definitions, and applications.",
      url: "https://www.aes.org/publications/standards/",
    },
    {
      title: "Sound on Sound: Understanding dBu and dBV",
      description:
        "An accessible article explaining the differences between dBu and dBV and how to convert between them.",
      url: "https://www.soundonsound.com/techniques/understanding-dbu-and-dbv",
    },
    {
      title: "Electronics Tutorials: Decibel Voltage Conversion",
      description:
        "Technical tutorial on decibel voltage calculations and conversions between different reference voltages.",
      url: "https://www.electronics-tutorials.ws/amplifier/decibels.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dBuInput">Enter dBu value</Label>
          <Input
            id="dBuInput"
            type="number"
            step="any"
            placeholder="e.g. 10"
            value={inputs.dBu}
            onChange={(e) => handleInputChange("dBu", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate dBu to dBV"
      >
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
          <li>Enter the audio signal level in dBu into the input field.</li>
          <li>Click the "Calculate" button to convert the value to dBV.</li>
          <li>
            View the result displayed below, showing the equivalent dBV value.
          </li>
          <li>
            Use this converted value to match or compare audio equipment levels
            referenced in dBV.
          </li>
          <li>
            Refer to the guide and FAQs for deeper understanding and practical
            tips.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to dBu to dBV Conversion Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            In professional audio and video production, understanding signal
            levels is essential for maintaining high-quality sound and avoiding
            distortion or noise. Two common units used to express audio voltage
            levels are dBu and dBV. Both are logarithmic units that describe the
            ratio of a voltage relative to a reference voltage, but they differ
            in what that reference voltage is.
          </p>
          <p>
            The dBu unit is referenced to 0.775 volts RMS, which historically
            corresponds to 1 milliwatt of power dissipated in a 600-ohm load.
            This standard is widely used in professional audio equipment. On the
            other hand, dBV is referenced to 1 volt RMS, a simpler and more
            modern standard often used in consumer audio devices.
          </p>
          <p>
            Because these units use different reference voltages, converting
            between them requires a fixed offset. Specifically, 0 dBV equals
            approximately 2.218 dBu. This means to convert from dBu to dBV, you
            subtract 2.218 from the dBu value. Conversely, to convert from dBV
            to dBu, you add 2.218.
          </p>
          <p>
            This calculator automates that conversion, allowing you to input a
            dBu value and instantly see the equivalent dBV value. This is
            particularly useful when interfacing equipment that uses different
            reference standards or when calibrating audio levels across various
            devices.
          </p>
          <p>
            Accurate level matching ensures optimal audio fidelity, prevents
            clipping or distortion, and maintains consistent loudness throughout
            production and broadcasting workflows. By understanding and using
            this conversion, audio engineers and technicians can confidently
            manage signal levels in complex setups.
          </p>
          <p>
            Remember that while this calculator focuses on voltage level
            conversions, other factors like impedance, gain staging, and signal
            path quality also play critical roles in overall audio performance.
            Always consider the full audio chain when making adjustments.
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
            <strong>Warning:</strong> Confusing dBu and dBV as identical units can
            lead to incorrect audio level settings, causing distortion or noise.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to apply the -2.218 dB offset
            when converting dBu to dBV results in inaccurate voltage level
            comparisons.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for power level
            conversions instead of voltage can produce invalid results, as dBu
            and dBV specifically refer to voltage levels.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring the context of impedance and
            equipment specifications may cause misinterpretation of the
            converted values.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 max-w-none">
          <p>
            <strong>Scenario:</strong> You have an audio signal level measured at
            10 dBu and need to know its equivalent in dBV to match the input
            sensitivity of a device specified in dBV.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Enter the measured dBu value (10) into the calculator input field.
            </li>
            <li>Click the Calculate button to perform the conversion.</li>
            <li>
              Read the result displayed as 7.782 dBV, which is the equivalent
              voltage level referenced to 1 volt RMS.
            </li>
          </ol>
          <p>
            <strong>Result:</strong> The 10 dBu signal corresponds to
            approximately 7.782 dBV, allowing you to correctly set the device
            input level.
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
      title="dBu to dBV Conversion Calculator"
      description="Professional video & audio calculator: dBu to dBV Conversion Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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