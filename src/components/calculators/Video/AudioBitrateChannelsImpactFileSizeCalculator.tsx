import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AudioBitrateChannelsImpactFileSizeCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // in Mbps
    channels: "", // number of audio channels
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals for bitrate and duration, integers for channels
    if (field === "channels") {
      // Only allow positive integers
      if (/^\d*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      // Allow decimal numbers for duration and bitrate
      if (/^\d*\.?\d*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const results = useMemo(() => {
    const durationSec = parseFloat(inputs.duration);
    const bitrateMbps = parseFloat(inputs.bitrate);
    const channels = parseInt(inputs.channels);

    if (
      isNaN(durationSec) ||
      isNaN(bitrateMbps) ||
      isNaN(channels) ||
      durationSec <= 0 ||
      bitrateMbps <= 0 ||
      channels <= 0
    ) {
      return {
        primary: "0",
        secondary: "GB",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Total bitrate considering channels (bitrate per channel * number of channels)
    // Assuming input bitrate is per channel, multiply by channels
    const totalBitrateMbps = bitrateMbps * channels;

    // Calculate total bits: total bitrate (Mbps) * duration (sec) * 1,000,000 (bits per Mbps)
    // Then convert bits to bytes: divide by 8
    // Then convert bytes to GB: divide by 1,000,000,000
    // Formula: Size (GB) = (totalBitrateMbps * 1,000,000 * durationSec) / 8 / 1,000,000,000
    // Simplifies to: (totalBitrateMbps * durationSec) / 8,000

    const sizeGB = (totalBitrateMbps * durationSec) / 8000;

    // Also calculate size in TB if > 1000 GB
    const sizeTB = sizeGB / 1000;

    const primary = sizeGB >= 1000 ? sizeTB.toFixed(3) : sizeGB.toFixed(3);
    const secondary = sizeGB >= 1000 ? "TB" : "GB";

    const details = `Calculation: (${bitrateMbps} Mbps × ${channels} channels × ${durationSec} sec) ÷ 8,000 = ${primary} ${secondary}`;

    const feedback =
      "Tip: Reducing bitrate or number of channels decreases file size. Use lossless codecs only when necessary.";

    return {
      primary,
      secondary,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in this calculation?",
      answer:
        "Bits (b) are the smallest unit of digital data, while bytes (B) consist of 8 bits. Bitrate is usually measured in bits per second (bps), but file size is commonly expressed in bytes. This calculator converts bits to bytes by dividing by 8 to accurately estimate file size.",
    },
    {
      question: "Why do I multiply bitrate by the number of channels?",
      answer:
        "Each audio channel carries its own stream of data at the specified bitrate. To find the total data rate for multiple channels, you multiply the bitrate per channel by the number of channels, giving the combined bitrate used for the file size calculation.",
    },
    {
      question: "Can I input duration in minutes or hours?",
      answer:
        "This calculator requires duration input in seconds for accuracy. If you have duration in minutes or hours, convert it to seconds first (1 minute = 60 seconds, 1 hour = 3600 seconds) before entering the value.",
    },
    {
      question: "Does this calculator consider compression or codec efficiency?",
      answer:
        "No, this calculator assumes a constant bitrate and does not account for compression efficiency or codec variations. It provides a theoretical file size based on bitrate and duration, useful for estimating storage needs.",
    },
    {
      question: "How accurate is this calculator for real-world audio files?",
      answer:
        "The calculator provides a close estimate based on bitrate and channels, but actual file sizes may vary due to codec overhead, metadata, and compression. Use it as a guideline rather than an exact measurement.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the file size of a 10-minute stereo audio recording with a bitrate of 1.5 Mbps per channel.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "10 minutes × 60 seconds/minute = 600 seconds",
      },
      {
        label: "Step 2: Calculate total bitrate",
        explanation: "1.5 Mbps × 2 channels = 3 Mbps total bitrate",
      },
      {
        label: "Step 3: Calculate file size in GB",
        explanation:
          "(3 Mbps × 600 seconds) ÷ 8,000 = 0.225 GB (225 MB)",
      },
    ],
    result: "The estimated file size is 0.225 GB (225 MB).",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Timecode standards and technical guidelines for media production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Bitrate and File Size",
      description:
        "Detailed explanation of bitrate, channels, and their impact on audio file size.",
      url: "https://www.soundguys.com/bitrate-explained-26196/",
    },
    {
      title: "Audio Bitrate and Channels Explained",
      description:
        "Comprehensive guide on how audio bitrate and channel count affect quality and file size.",
      url: "https://www.audiomasterclass.com/bitrate-channels/",
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
            min="0"
            step="any"
            placeholder="e.g. 600"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitrate">Bitrate per channel (Mbps)</Label>
          <Input
            id="bitrate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1.5"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="channels">Number of channels</Label>
          <Input
            id="channels"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 2"
            value={inputs.channels}
            onChange={(e) => handleInputChange("channels", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm italic text-slate-700 dark:text-slate-400">{results.feedback}</p>
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
          <li>Enter the total duration of your audio in seconds. Convert minutes or hours to seconds before input.</li>
          <li>Input the bitrate per audio channel in megabits per second (Mbps). This is the data rate for one channel.</li>
          <li>Enter the number of audio channels (e.g., 1 for mono, 2 for stereo, etc.).</li>
          <li>Click the Calculate button to see the estimated file size in gigabytes (GB) or terabytes (TB) based on your inputs.</li>
          <li>Review the calculation details and optimization tips provided below the result for better understanding and adjustments.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Audio Bitrate + Channels Impact (File Size)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding how audio bitrate and the number of channels affect file size is crucial for professionals in video and audio production. Bitrate, measured in bits per second (bps), defines how much data is processed every second in an audio stream. Higher bitrates mean better audio quality but also larger file sizes. When dealing with multiple audio channels, such as stereo (2 channels) or surround sound (5.1 channels), the total data rate increases proportionally because each channel carries its own data stream.
          </p>
          <p>
            This calculator estimates the file size by multiplying the bitrate per channel by the number of channels and the duration in seconds, then converting bits to bytes (8 bits = 1 byte) and bytes to gigabytes or terabytes. It assumes a constant bitrate and does not factor in codec compression efficiency or metadata overhead, making it ideal for rough storage planning and bandwidth estimation.
          </p>
          <p>
            For example, a 10-minute stereo audio file with a bitrate of 1.5 Mbps per channel results in a total bitrate of 3 Mbps. Multiplying by the duration (600 seconds) and converting to bytes yields an estimated file size of 0.225 GB. This knowledge helps engineers and editors optimize storage, streaming, and archiving strategies by balancing quality and file size.
          </p>
          <p>
            Always remember to convert your duration to seconds and verify your bitrate units before using the calculator. This tool is invaluable for planning audio workflows in professional environments, ensuring efficient resource allocation without compromising quality.
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
            <strong>Warning:</strong> A frequent error is confusing bits (b) with bytes (B). Bitrate is measured in bits per second, but file size is in bytes. Forgetting to divide by 8 when converting bits to bytes will overestimate file size by eight times.
          </p>
          <p>
            Another mistake is neglecting to multiply bitrate by the number of channels. Each channel adds its own data stream, so total bitrate is bitrate per channel times channels.
          </p>
          <p>
            Users sometimes input duration in minutes or hours without converting to seconds, leading to incorrect file size calculations.
          </p>
          <p>
            Lastly, assuming this calculator accounts for compression or codec efficiency is incorrect. It provides theoretical size based on constant bitrate only.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
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
      title="Audio Bitrate + Channels Impact (File Size)"
      description="Professional video & audio calculator: Audio Bitrate + Channels Impact (File Size). Accurate technical formulas for production, post-production, and broadcasting."
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