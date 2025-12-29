import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AudioFileSizeEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // numeric value
    bitrateUnit: "Mbps", // Mbps or Gbps
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const BITRATE_UNITS = {
    Mbps: 1e6, // bits per second
    Gbps: 1e9,
  };

  const SIZE_UNITS = [
    { label: "GB", factor: 1e9 },
    { label: "TB", factor: 1e12 },
  ];

  const results = useMemo(() => {
    const durationSec = parseFloat(inputs.duration);
    const bitrateVal = parseFloat(inputs.bitrate);
    const bitrateUnit = inputs.bitrateUnit;

    if (
      isNaN(durationSec) ||
      durationSec <= 0 ||
      isNaN(bitrateVal) ||
      bitrateVal <= 0 ||
      !(bitrateUnit in BITRATE_UNITS)
    ) {
      return {
        primary: "0",
        secondary: "GB",
        details: "Please enter valid positive numbers for duration and bitrate.",
        feedback: "",
      };
    }

    // Calculate total bits: bitrate (bps) * duration (sec)
    const bitrateBps = bitrateVal * BITRATE_UNITS[bitrateUnit];
    const totalBits = bitrateBps * durationSec;

    // Convert bits to bytes
    const totalBytes = totalBits / 8;

    // Determine size unit (GB or TB)
    let size = totalBytes;
    let unit = "GB";
    if (size >= SIZE_UNITS[1].factor) {
      size = size / SIZE_UNITS[1].factor;
      unit = "TB";
    } else {
      size = size / SIZE_UNITS[0].factor;
      unit = "GB";
    }

    // Format size with 3 decimals
    const sizeFormatted = size.toFixed(3);

    const details = `Calculation: (${bitrateVal} ${bitrateUnit} × ${durationSec} sec) ÷ 8 = ${sizeFormatted} ${unit}`;
    const feedback =
      "Tip: Ensure bitrate and duration units are correct for accurate estimation.";

    return {
      primary: sizeFormatted,
      secondary: unit,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is bitrate and how does it affect file size?",
      answer:
        "Bitrate refers to the number of bits processed per second in an audio file. Higher bitrates mean more data is used to represent the audio, resulting in better quality but larger file sizes. Conversely, lower bitrates reduce file size but may degrade audio quality. Understanding bitrate is essential for estimating file sizes accurately.",
    },
    {
      question: "Why do we divide by 8 in the calculation?",
      answer:
        "Bitrate is typically measured in bits per second, but file size is usually expressed in bytes. Since 1 byte equals 8 bits, dividing the total bits by 8 converts the value into bytes. This conversion is crucial for calculating the actual storage size of the audio file.",
    },
    {
      question: "Can I use this calculator for video file size estimation?",
      answer:
        "This calculator is specifically designed for audio file size estimation based on audio bitrate and duration. Video files involve additional parameters like resolution, frame rate, and video bitrate, which are not accounted for here. For video file size estimation, specialized calculators should be used.",
    },
    {
      question: "What units should I use for duration and bitrate?",
      answer:
        "Duration should be entered in seconds for accurate calculation. Bitrate can be entered in either Mbps (megabits per second) or Gbps (gigabits per second) using the provided selector. Ensure you select the correct unit corresponding to your bitrate value to get precise results.",
    },
    {
      question: "Why does the calculator show results in GB or TB?",
      answer:
        "Audio files can vary greatly in size depending on bitrate and duration. To keep the output readable and meaningful, the calculator automatically converts the file size into gigabytes (GB) or terabytes (TB) depending on the magnitude of the calculated size. This helps users better understand the storage requirements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the file size of a 2-hour audio recording with a bitrate of 320 Mbps.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the duration of the audio in seconds: 2 hours × 3600 seconds = 7200 seconds.",
      },
      {
        label: "Step 2",
        explanation: "Enter the bitrate as 320 and select Mbps as the unit.",
      },
      {
        label: "Step 3",
        explanation: "Click Calculate to see the estimated file size.",
      },
    ],
    result:
      "The calculator estimates the file size to be approximately 288.000 GB for this audio recording.",
  };

  const references = [
    {
      title: "Understanding Bitrate and Audio Quality",
      description:
        "A comprehensive guide on how bitrate affects audio quality and file size.",
      url: "https://www.soundguys.com/bitrate-what-is-it-26116/",
    },
    {
      title: "Audio File Size Calculation Formula",
      description:
        "Technical explanation of audio file size calculation based on bitrate and duration.",
      url: "https://www.mediacollege.com/audio/bitrate/file-size.html",
    },
    {
      title: "Data Storage Units Explained",
      description:
        "Overview of data storage units including bits, bytes, kilobytes, megabytes, gigabytes, and terabytes.",
      url: "https://www.techtarget.com/whatis/definition/byte",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 3600"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bitrate">Bitrate</Label>
          <Input
            id="bitrate"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 320"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <select
            id="bitrateUnit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.bitrateUnit}
            onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
          >
            <option value="Mbps">Mbps (Megabits per second)</option>
            <option value="Gbps">Gbps (Gigabits per second)</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={!inputs.duration || !inputs.bitrate}>
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
          <li>Enter the duration of your audio file in seconds. For example, 1 hour equals 3600 seconds.</li>
          <li>Input the bitrate value of your audio file. This is usually provided in Mbps or Gbps.</li>
          <li>Select the correct bitrate unit from the dropdown menu (Mbps or Gbps).</li>
          <li>Click the "Calculate" button to estimate the file size.</li>
          <li>Review the result displayed in gigabytes (GB) or terabytes (TB), along with calculation details.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Audio File Size Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Estimating the size of an audio file is a fundamental task in professional video and audio production workflows. Whether you're planning storage requirements, preparing for data transfer, or budgeting for cloud hosting, knowing the expected file size helps optimize resources and avoid surprises.
          </p>
          <p>
            The core principle behind this calculator is the relationship between bitrate, duration, and file size. Bitrate, measured in bits per second (bps), indicates how much data is processed every second of audio. Duration is the total length of the audio in seconds. Multiplying these two gives the total number of bits in the file.
          </p>
          <p>
            Since file sizes are typically expressed in bytes, and 1 byte equals 8 bits, the total bits are divided by 8 to convert to bytes. To present the result in a user-friendly format, the calculator converts bytes into gigabytes (GB) or terabytes (TB) depending on the size magnitude.
          </p>
          <p>
            This calculator supports bitrates in Mbps (megabits per second) and Gbps (gigabits per second), common units in professional audio and broadcast environments. Accurate input of bitrate and duration is crucial for reliable estimations. For example, a 2-hour audio file at 320 Mbps results in a significantly larger file than the same duration at 128 Mbps.
          </p>
          <p>
            By using this tool, engineers, editors, and producers can quickly gauge storage needs, plan data transfers, and make informed decisions about audio quality versus file size trade-offs. This ensures efficient workflows and better management of digital assets in production and post-production.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Entering duration in minutes or hours without converting to seconds will produce incorrect results. Always convert duration to seconds before input.
          </p>
          <p>
            <strong>Warning:</strong> Mixing bitrate units (e.g., entering a Gbps value but selecting Mbps) leads to wildly inaccurate file size estimations. Double-check the unit selection.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for compressed audio formats without considering compression ratios can mislead file size expectations. This tool assumes constant bitrate streams.
          </p>
          <p>
            <strong>Warning:</strong> Leaving inputs empty or zero disables meaningful calculation. Ensure all fields have valid positive numbers.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> You have a 2-hour audio recording with a bitrate of 320 Mbps and want to estimate the file size.</p>
          <ol>
            <li>Convert 2 hours to seconds: 2 × 3600 = 7200 seconds.</li>
            <li>Enter 7200 in the duration field.</li>
            <li>Enter 320 in the bitrate field and select Mbps as the unit.</li>
            <li>Click Calculate.</li>
          </ol>
          <p><strong>Result:</strong> The estimated file size is approximately 288.000 GB.</p>
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
      title="Audio File Size Estimator"
      description="Professional video & audio calculator: Audio File Size Estimator. Accurate technical formulas for production, post-production, and broadcasting."
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