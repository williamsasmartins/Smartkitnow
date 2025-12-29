import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DataTransferTimeEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // numeric value
    bitrateUnit: "Mbps" // Mbps or Gbps
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
        feedback: ""
      };
    }

    // Convert bitrate to Mbps if in Gbps
    const bitrateMbps = bitrateUnit === "Gbps" ? bitrateVal * 1000 : bitrateVal;

    // Calculate total bits = bitrate (Mbps) * duration (sec) * 1,000,000 (bits per Mbps)
    // Then convert bits to bytes by dividing by 8
    // Then convert bytes to GB by dividing by 1,000,000,000 (decimal GB)
    // Formula: Size(GB) = (bitrateMbps * 1,000,000 * durationSec) / 8 / 1,000,000,000
    // Simplifies to: (bitrateMbps * durationSec) / 8,000

    const sizeGB = (bitrateMbps * durationSec) / 8000;

    // If sizeGB > 1000, convert to TB
    if (sizeGB >= 1000) {
      const sizeTB = sizeGB / 1000;
      return {
        primary: sizeTB.toFixed(2),
        secondary: "TB",
        details: `Data size calculated from bitrate ${bitrateVal} ${bitrateUnit} and duration ${durationSec} seconds.`,
        feedback:
          "Consider using high-speed storage and transfer protocols to handle large data volumes efficiently."
      };
    }

    return {
      primary: sizeGB.toFixed(2),
      secondary: "GB",
      details: `Data size calculated from bitrate ${bitrateVal} ${bitrateUnit} and duration ${durationSec} seconds.`,
      feedback:
        "Ensure your data transfer medium supports sustained speeds matching the bitrate to avoid bottlenecks."
    };
  }, [inputs]);

  const faqs = [
    {
      question:
        "What is the difference between bits and bytes in data transfer calculations?",
      answer:
        "Bits (b) and Bytes (B) are fundamental units of digital information. One Byte equals 8 Bits. Bitrate is typically measured in bits per second (bps), while storage size is measured in Bytes. Accurate data transfer calculations require converting bits to Bytes by dividing by 8, ensuring precise estimation of file sizes and transfer times."
    },
    {
      question: "Why is it important to consider bitrate units like Mbps and Gbps?",
      answer:
        "Bitrate units such as Mbps (Megabits per second) and Gbps (Gigabits per second) represent data transfer speeds at different scales. Using the correct unit is crucial because 1 Gbps equals 1000 Mbps. Misinterpreting these units can lead to significant errors in estimating data sizes and transfer durations, impacting production workflows."
    },
    {
      question:
        "How does video duration affect the total data size during transfer?",
      answer:
        "Video duration directly impacts total data size since longer footage accumulates more data at a given bitrate. For example, a 10-minute clip at 100 Mbps will generate significantly more data than a 1-minute clip at the same bitrate. Understanding this relationship helps in planning storage and transfer requirements effectively."
    },
    {
      question:
        "Can chroma subsampling and dynamic range affect data transfer rates?",
      answer:
        "Yes, chroma subsampling reduces color information to lower data rates without severely impacting perceived quality, while higher dynamic range increases data complexity. Both factors influence the effective bitrate and thus the data transfer size. Accurate estimations should consider codec settings and image characteristics for precision."
    },
    {
      question:
        "What are common pitfalls when estimating data transfer times for video files?",
      answer:
        "Common mistakes include confusing bits with Bytes, ignoring unit conversions between Mbps and Gbps, and neglecting overhead from file containers or metadata. Additionally, not accounting for variations in signal-to-noise ratio or codec compression can lead to inaccurate size estimations, affecting storage and transfer planning."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Shooting a 2-hour interview in 4K ProRes 422 HQ at 220 Mbps bitrate, estimating the total data size for transfer.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert duration to seconds: 2 hours × 60 minutes × 60 seconds = 7200 seconds."
      },
      {
        label: "Step 2",
        explanation:
          "Bitrate is 220 Mbps (Megabits per second)."
      },
      {
        label: "Step 3",
        explanation:
          "Calculate size in GB: (220 Mbps × 7200 sec) / 8000 = 198 GB."
      }
    ],
    result:
      "The total data size for the 2-hour 4K ProRes 422 HQ interview is approximately 198 GB."
  };

  const references = [
    {
      title: "ARRI Formats & Data Rate Calculator",
      description: "Industry standard reference for professional camera data rates.",
      url: "https://www.arri.com/"
    },
    {
      title: "RED Tools",
      description: "Cinema camera tools including data rate calculators and workflow guides.",
      url: "https://www.red.com/tools"
    }
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
            step={0.01}
            placeholder="e.g. 220"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <select
            id="bitrateUnit"
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-3 text-slate-900 dark:text-slate-100"
            value={inputs.bitrateUnit}
            onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
          >
            <option value="Mbps">Mbps</option>
            <option value="Gbps">Gbps</option>
          </select>
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
            <p className="text-xs text-slate-500 mt-1 italic">{results.feedback}</p>
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
          <li>Enter the total duration of your video or audio file in seconds.</li>
          <li>Input the average bitrate of your media in Mbps or Gbps.</li>
          <li>Select the correct bitrate unit from the dropdown menu.</li>
          <li>Click the Calculate button to see the estimated data size in GB or TB.</li>
          <li>Use the result to plan your storage and data transfer workflows efficiently.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Data Transfer Time Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In professional video and audio production, accurately estimating data transfer sizes is critical for efficient workflow management. The data transfer size depends primarily on the media's duration and its bitrate, which is the amount of data processed per second. Bitrate is typically measured in bits per second (bps), with common units being Megabits per second (Mbps) and Gigabits per second (Gbps). Since storage and file sizes are measured in Bytes (B), and 1 Byte equals 8 bits, converting between these units is essential to avoid errors.
          </p>
          <p>
            This calculator uses the formula: <em>Size (GB) = (Bitrate (Mbps) × Duration (seconds)) / 8,000</em>. This formula converts the bitrate from bits to Bytes and then to Gigabytes, assuming decimal units (1 GB = 1,000,000,000 Bytes). For very large files, the result is converted to Terabytes (TB) for easier comprehension. Understanding these conversions helps in planning storage requirements, transfer times, and bandwidth allocation.
          </p>
          <p>
            Factors such as chroma subsampling, dynamic range, and codec compression influence the effective bitrate and thus the data size. For example, higher chroma subsampling reduces color data, lowering bitrate without significantly impacting perceived quality. Similarly, higher dynamic range increases data complexity, potentially increasing bitrate. Signal-to-noise ratio also affects compression efficiency. Therefore, while this calculator provides a solid baseline, always consider codec settings and image characteristics for precise estimations.
          </p>
          <p>
            In real-world production environments, accurate data transfer estimations enable better resource allocation, prevent bottlenecks, and optimize post-production workflows. Using this tool, professionals can anticipate storage needs and select appropriate transfer protocols, ensuring smooth handling of high-resolution footage and complex audio files.
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
            <strong>Warning:</strong> Confusing bits (b) with Bytes (B) is a frequent error that leads to underestimating data sizes by a factor of eight. Always remember that 8 bits equal 1 Byte. Additionally, mixing units such as Mbps and Gbps without proper conversion can cause significant miscalculations. Neglecting overhead from container formats, metadata, or codec compression nuances can also skew results. Finally, ignoring the impact of chroma subsampling, dynamic range, and signal-to-noise ratio on effective bitrate may result in inaccurate estimations.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> Shooting a 2-hour interview in 4K ProRes 422 HQ at a bitrate of 220 Mbps.
          </p>
          <ol>
            <li>
              Convert duration to seconds: 2 hours × 60 minutes × 60 seconds = 7200 seconds.
            </li>
            <li>Bitrate is 220 Mbps (Megabits per second).</li>
            <li>
              Calculate size in GB: (220 Mbps × 7200 sec) / 8000 = 198 GB.
            </li>
          </ol>
          <p>
            The total data size for the 2-hour 4K ProRes 422 HQ interview is approximately <strong>198 GB</strong>. This estimation helps in planning storage and transfer logistics.
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
      title="Data Transfer Time Estimator"
      description="Professional video & audio calculator: Data Transfer Time Estimator. Accurate technical formulas for production, post-production, and broadcasting."
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