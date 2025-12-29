import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Film,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CameraBitrateRecordTimeConverterCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // numeric value
    bitrateUnit: "Mbps", // Mbps or Gbps
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const durationSec = parseFloat(inputs.duration);
    const bitrateVal = parseFloat(inputs.bitrate);
    const bitrateUnit = inputs.bitrateUnit;

    if (
      isNaN(durationSec) ||
      durationSec <= 0 ||
      isNaN(bitrateVal) ||
      bitrateVal <= 0
    ) {
      return {
        primary: "0",
        secondary: "GB",
        details: "Please enter valid positive numbers for duration and bitrate.",
        feedback: "",
      };
    }

    // Convert bitrate to Mbps if needed
    let bitrateMbps = bitrateVal;
    if (bitrateUnit === "Gbps") {
      bitrateMbps = bitrateVal * 1000; // 1 Gbps = 1000 Mbps
    }

    // Calculate size in Megabits:
    // size (Mbit) = bitrate (Mbps) * duration (sec)
    const sizeMbit = bitrateMbps * durationSec;

    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 byte)
    const sizeMB = sizeMbit / 8;

    // Convert MB to GB
    const sizeGB = sizeMB / 1024;

    // If sizeGB > 1024, convert to TB
    let displaySize = sizeGB;
    let unit = "GB";
    if (sizeGB >= 1024) {
      displaySize = sizeGB / 1024;
      unit = "TB";
    }

    // Format result to 3 decimals max
    const formattedSize = displaySize.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });

    const details = `Calculation: (${bitrateMbps} Mbps × ${durationSec} sec) ÷ 8 ÷ 1024 = ${formattedSize} ${unit}`;

    const feedback =
      "Tip: Use this calculator to estimate storage needs based on your camera's bitrate and recording duration. Always allow extra space for metadata and audio tracks.";

    return {
      primary: formattedSize,
      secondary: unit,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in this calculator?",
      answer:
        "This calculator uses bits and bytes accurately: bitrate is measured in bits per second (bps), while storage size is measured in bytes. Since 8 bits equal 1 byte, the formula divides the total bits by 8 to convert to bytes. Confusing bits with bytes can lead to incorrect storage estimations.",
    },
    {
      question: "Can I enter recording duration in minutes or hours?",
      answer:
        "Currently, the calculator requires duration input in seconds for precise calculations. To convert minutes or hours to seconds, multiply minutes by 60 and hours by 3600 before entering the value. This ensures accurate size estimation based on the bitrate.",
    },
    {
      question: "Why do I need to select Mbps or Gbps for bitrate?",
      answer:
        "Bitrate units can vary widely depending on the camera and codec. Selecting the correct unit (Megabits per second or Gigabits per second) ensures the calculator interprets your input correctly. For example, 1 Gbps equals 1000 Mbps, so selecting the wrong unit will cause inaccurate results.",
    },
    {
      question: "Does this calculator account for audio or metadata size?",
      answer:
        "No, this calculator estimates video data size based on bitrate and duration only. Audio tracks, metadata, and container overhead are not included and may add additional storage requirements. It's recommended to add a buffer when planning storage.",
    },
    {
      question: "How accurate is this calculator for real-world recording scenarios?",
      answer:
        "The calculator provides a theoretical estimate based on constant bitrate and duration. Real-world recordings may vary due to variable bitrate encoding, compression efficiency, and additional data streams. Use this as a guideline and always allocate extra storage for safety.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Recording a 10-minute video at 150 Mbps bitrate to estimate required storage size.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "10 minutes × 60 = 600 seconds",
      },
      {
        label: "Step 2: Use bitrate in Mbps",
        explanation: "Bitrate = 150 Mbps",
      },
      {
        label: "Step 3: Calculate total bits",
        explanation: "150 Mbps × 600 sec = 90,000 Megabits",
      },
      {
        label: "Step 4: Convert Megabits to Megabytes",
        explanation: "90,000 ÷ 8 = 11,250 Megabytes",
      },
      {
        label: "Step 5: Convert Megabytes to Gigabytes",
        explanation: "11,250 ÷ 1024 ≈ 10.99 GB",
      },
    ],
    result: "The estimated storage size needed is approximately 11 GB.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Bitrate and Storage",
      description:
        "Detailed explanation of bitrate, bits vs bytes, and storage calculations.",
      url: "https://www.videomaker.com/article/c10/18794-understanding-bitrate-and-storage",
    },
    {
      title: "Bits and Bytes Explained",
      description:
        "Clarification on the difference between bits and bytes in digital media.",
      url: "https://www.lifewire.com/bit-vs-byte-2625924",
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
            step={1}
            placeholder="e.g. 600"
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
            step={0.001}
            placeholder="e.g. 150"
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>Enter the total recording duration in seconds. If you have minutes or hours, convert them to seconds first (1 minute = 60 seconds, 1 hour = 3600 seconds).</li>
          <li>Input the camera's video bitrate value as provided by your camera or codec settings.</li>
          <li>Select the correct bitrate unit: Mbps (Megabits per second) or Gbps (Gigabits per second).</li>
          <li>Click the Calculate button to see the estimated storage size required for the recording.</li>
          <li>Review the result displayed in GB or TB, along with calculation details and tips.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Camera Bitrate to Record Time Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            In professional video production, understanding the relationship between bitrate, recording duration, and storage size is crucial for efficient workflow planning. Bitrate refers to the amount of data processed per second in a video stream, typically measured in Megabits per second (Mbps) or Gigabits per second (Gbps). The higher the bitrate, the better the video quality, but also the larger the file size.
          </p>
          <p>
            This calculator helps you estimate the storage space required for a given recording duration and bitrate. The core formula used is: <em>Size (in bytes) = (Bitrate in bits per second × Duration in seconds) ÷ 8</em>. Since bitrate is usually given in Mbps or Gbps, the calculator converts these units to bits per second and then divides by 8 to convert bits to bytes (as 8 bits = 1 byte). The result is then converted to Gigabytes (GB) or Terabytes (TB) for easier understanding.
          </p>
          <p>
            Accurate storage estimation is essential for on-set data management, post-production planning, and archiving. It helps avoid running out of storage during shoots and ensures smooth data transfer and backup processes. Additionally, understanding these calculations aids in budgeting for storage hardware and cloud services.
          </p>
          <p>
            Remember, this calculator assumes a constant bitrate and does not account for audio tracks, metadata, or container overhead, which can add extra size. Always allocate additional storage space as a buffer. Also, be mindful of the difference between bits and bytes to avoid miscalculations.
          </p>
          <p>
            By mastering these concepts, video professionals can optimize their workflows, reduce downtime, and ensure data integrity throughout the production lifecycle.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is a frequent error that leads to underestimating or overestimating storage needs by a factor of 8. Always remember that 8 bits equal 1 byte, and storage devices measure capacity in bytes.
          </p>
          <p>
            Entering duration in minutes or hours without converting to seconds will produce incorrect results. Always convert time to seconds before input.
          </p>
          <p>
            Selecting the wrong bitrate unit (Mbps vs Gbps) can cause huge miscalculations. Double-check your camera's specifications to use the correct unit.
          </p>
          <p>
            Ignoring additional data such as audio tracks, metadata, and container overhead can result in insufficient storage allocation. Always add a safety margin.
          </p>
          <p>
            Assuming constant bitrate when using variable bitrate codecs can lead to inaccurate estimates. Use this calculator as a guideline, not an exact measurement.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p><strong>Scenario:</strong> Recording a 10-minute video at 150 Mbps bitrate to estimate required storage size.</p>
          <ol>
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p><strong>Result:</strong> {example.result}</p>
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
      title="Camera Bitrate to Record Time Converter"
      description="Professional video & audio calculator: Camera Bitrate to Record Time Converter. Accurate technical formulas for production, post-production, and broadcasting."
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