import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VideoBitrateFileSizeCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // in Mbps or Gbps
    bitrateUnit: "Mbps",
    sizeUnit: "GB",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const bitrateToMbps = (value: number, unit: string) => {
    if (unit === "Gbps") return value * 1000;
    return value;
  };

  const sizeFromBytes = (bytes: number, unit: string) => {
    // bytes to GB or TB
    if (unit === "TB") return bytes / 1e12;
    return bytes / 1e9;
  };

  const results = useMemo(() => {
    const durationSec = parseFloat(inputs.duration);
    const bitrateVal = parseFloat(inputs.bitrate);
    if (
      isNaN(durationSec) ||
      durationSec <= 0 ||
      isNaN(bitrateVal) ||
      bitrateVal <= 0
    ) {
      return {
        primary: "0",
        secondary: inputs.sizeUnit,
        details: "Please enter valid positive numbers for duration and bitrate.",
        feedback: "",
      };
    }

    // Convert bitrate to Mbps
    const bitrateMbps = bitrateToMbps(bitrateVal, inputs.bitrateUnit);

    // Calculate total bits: bitrate (Mbps) * duration (sec) * 1,000,000 bits per second
    // Then convert bits to bytes (divide by 8)
    // Then convert bytes to GB or TB depending on sizeUnit
    const totalBits = bitrateMbps * 1_000_000 * durationSec;
    const totalBytes = totalBits / 8;
    const size = sizeFromBytes(totalBytes, inputs.sizeUnit);

    // Format result with 3 decimals max
    const formattedSize =
      size >= 0.001 ? size.toFixed(3) : size.toExponential(3);

    return {
      primary: formattedSize,
      secondary: inputs.sizeUnit,
      details: `Duration: ${durationSec} sec × Bitrate: ${bitrateVal} ${inputs.bitrateUnit} → Size calculated in ${inputs.sizeUnit}`,
      feedback:
        "Ensure your bitrate unit matches your input value. Use this calculator to estimate storage needs accurately.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in video bitrate?",
      answer:
        "Bits (b) and Bytes (B) are fundamental units of digital data. One Byte equals 8 Bits. Video bitrate is typically measured in bits per second (bps), such as Mbps (megabits per second). When calculating file size, it's essential to convert bits to bytes by dividing by 8, as storage size is measured in bytes. Confusing these units can lead to inaccurate file size estimations.",
    },
    {
      question: "Can I input video duration in timecode format?",
      answer:
        "This calculator accepts video duration in seconds only. For timecode formats like SMPTE (hours:minutes:seconds:frames), you must convert the duration to total seconds before input. For example, a 01:30:00 (1 hour 30 minutes) video equals 5400 seconds. Accurate conversion ensures precise file size calculations.",
    },
    {
      question: "Why does the calculator allow both Mbps and Gbps for bitrate?",
      answer:
        "Video bitrates can vary widely depending on resolution, codec, and quality. Mbps (megabits per second) is common for most video files, while Gbps (gigabits per second) is used for very high-quality or professional streams. Allowing both units lets users input values conveniently without manual conversions.",
    },
    {
      question: "How accurate is this calculator for estimating file size?",
      answer:
        "This calculator provides an estimate based on constant bitrate and duration. Actual file sizes may vary due to variable bitrate encoding, metadata, container overhead, and compression efficiency. Use this tool for planning and rough estimates rather than exact file size predictions.",
    },
    {
      question: "Can I calculate bitrate if I know file size and duration?",
      answer:
        "This calculator is designed primarily for bitrate-to-file size conversion. However, by rearranging the formula, you can calculate bitrate if you know file size and duration: Bitrate (Mbps) = (File Size in bytes × 8) / Duration in seconds / 1,000,000. For such calculations, consider using a dedicated bitrate calculator.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Rendering a 5-minute 3D animation with a bitrate of 50 Mbps to estimate the output file size.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "5 minutes × 60 seconds = 300 seconds",
      },
      {
        label: "Step 2: Use bitrate in Mbps",
        explanation: "Given bitrate is 50 Mbps",
      },
      {
        label: "Step 3: Calculate total bits",
        explanation: "50 Mbps × 1,000,000 × 300 sec = 15,000,000,000 bits",
      },
      {
        label: "Step 4: Convert bits to bytes",
        explanation: "15,000,000,000 bits ÷ 8 = 1,875,000,000 bytes",
      },
      {
        label: "Step 5: Convert bytes to gigabytes",
        explanation: "1,875,000,000 bytes ÷ 1,000,000,000 = 1.875 GB",
      },
    ],
    result: "The estimated file size is approximately 1.875 GB.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Video Bitrate",
      description:
        "Detailed explanation of video bitrate and its impact on quality and file size.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
    },
    {
      title: "Bits vs Bytes Explained",
      description:
        "Clarification on the difference between bits and bytes in digital data.",
      url: "https://www.lifewire.com/bits-vs-bytes-2625924",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 300"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitrate">Bitrate</Label>
          <div className="flex gap-2">
            <Input
              id="bitrate"
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 50"
              value={inputs.bitrate}
              onChange={(e) => handleInputChange("bitrate", e.target.value)}
            />
            <select
              className="border rounded px-2"
              value={inputs.bitrateUnit}
              onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
              aria-label="Bitrate unit"
            >
              <option value="Mbps">Mbps</option>
              <option value="Gbps">Gbps</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sizeUnit">Output Size Unit</Label>
          <select
            id="sizeUnit"
            className="border rounded px-2 w-full"
            value={inputs.sizeUnit}
            onChange={(e) => handleInputChange("sizeUnit", e.target.value)}
            aria-label="Output size unit"
          >
            <option value="GB">GB</option>
            <option value="TB">TB</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled>
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
          <li>Enter the total video duration in seconds (e.g., 300 for 5 minutes).</li>
          <li>
            Input the video bitrate value and select the appropriate unit (Mbps or
            Gbps).
          </li>
          <li>
            Choose the desired output file size unit (GB or TB) for the result.
          </li>
          <li>
            The calculator will automatically compute the estimated file size based
            on the inputs.
          </li>
          <li>
            Review the calculation details and use the feedback tips for better
            accuracy.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Bitrate ↔ File Size Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between video bitrate and file size is
            crucial for professionals in video production, post-production, and
            broadcasting. Bitrate refers to the amount of data processed per second
            in a video stream and is typically measured in bits per second (bps),
            with common units being megabits per second (Mbps) or gigabits per
            second (Gbps). File size, on the other hand, is measured in bytes,
            usually gigabytes (GB) or terabytes (TB). Since 8 bits equal 1 byte,
            converting between bitrate and file size requires careful unit
            consideration.
          </p>
          <p>
            This calculator uses the formula: <code>File Size (bytes) = (Bitrate (bps) × Duration (seconds)) / 8</code>. It assumes a constant bitrate throughout the video duration, which is common in many professional workflows but may differ in variable bitrate (VBR) encoding scenarios. The duration must be input in seconds, so any timecode or formatted time must be converted accordingly.
          </p>
          <p>
            Selecting the correct units for bitrate and file size is essential to
            avoid miscalculations. For example, a bitrate of 2 Gbps is equivalent to
            2000 Mbps. Similarly, file sizes can be expressed in GB or TB, where 1
            TB equals 1000 GB. This calculator handles these conversions internally
            to provide accurate results.
          </p>
          <p>
            Use this tool to estimate storage requirements, plan data transfers,
            and optimize encoding settings. Remember that actual file sizes may
            vary due to codec overhead, metadata, and compression efficiency.
            Always allow some margin when planning storage or bandwidth.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is a frequent
            error that leads to file size miscalculations by a factor of eight.
            Always remember that 8 bits = 1 byte. Another common mistake is mixing
            units without conversion, such as entering bitrate in Gbps but treating
            it as Mbps. Additionally, failing to convert video duration from timecode
            to seconds will produce incorrect results. Lastly, assuming constant
            bitrate for variable bitrate files can cause inaccurate size estimates.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> Rendering a 5-minute 3D animation with a
            bitrate of 50 Mbps to estimate the output file size.
          </p>
          <ol>
            <li>
              Convert duration to seconds: 5 minutes × 60 = 300 seconds.
            </li>
            <li>Use bitrate as given: 50 Mbps.</li>
            <li>
              Calculate total bits: 50 Mbps × 1,000,000 × 300 sec = 15,000,000,000
              bits.
            </li>
            <li>Convert bits to bytes: 15,000,000,000 ÷ 8 = 1,875,000,000 bytes.</li>
            <li>Convert bytes to gigabytes: 1,875,000,000 ÷ 1,000,000,000 = 1.875 GB.</li>
          </ol>
          <p>
            <strong>Result:</strong> The estimated file size is approximately 1.875
            GB.
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
      title="Video Bitrate ↔ File Size Calculator"
      description="Professional video & audio calculator: Video Bitrate ↔ File Size Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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