import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Film,
  AlertTriangle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SurveillanceNvrVideoStoragePlannerCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // numeric value
    bitrateUnit: "Mbps", // Mbps or Gbps
    sizeUnit: "GB", // GB or TB
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
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

    // Convert bitrate to Mbps if input is Gbps
    let bitrateMbps = bitrateVal;
    if (inputs.bitrateUnit === "Gbps") {
      bitrateMbps = bitrateVal * 1000;
    }

    // Calculate size in Megabits: bitrate (Mbps) * duration (sec)
    const totalMegabits = bitrateMbps * durationSec;

    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 byte)
    const totalMegaBytes = totalMegabits / 8;

    // Convert Megabytes to GB or TB
    let size = 0;
    let unit = inputs.sizeUnit;
    if (unit === "GB") {
      size = totalMegaBytes / 1024; // 1024 MB = 1 GB
    } else if (unit === "TB") {
      size = totalMegaBytes / (1024 * 1024); // 1024*1024 MB = 1 TB
    }

    // Format size to 2 decimal places
    const formattedSize = size.toFixed(2);

    const details = `Calculation: (${bitrateMbps} Mbps × ${durationSec} sec) ÷ 8 ÷ ${
      unit === "GB" ? 1024 : 1024 * 1024
    } = ${formattedSize} ${unit}`;

    const feedback =
      "Ensure your bitrate unit matches your input to avoid miscalculations. Consider overhead and compression for real-world storage needs.";

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
        "Bits (b) and bytes (B) are units of digital information where 8 bits equal 1 byte. Bitrate is typically measured in bits per second (bps), while storage size is measured in bytes. This calculator converts bitrate (in bits) to storage size (in bytes) by dividing by 8 to ensure accurate calculations.",
    },
    {
      question: "Why do I need to convert bitrate units between Mbps and Gbps?",
      answer:
        "Bitrate can be expressed in Megabits per second (Mbps) or Gigabits per second (Gbps). Since 1 Gbps equals 1000 Mbps, converting all inputs to the same unit ensures consistent and accurate calculations for storage requirements.",
    },
    {
      question: "How does duration affect the storage size calculation?",
      answer:
        "Storage size is directly proportional to the duration of the video. Longer recording durations require more storage space because the total amount of data generated increases with time at a fixed bitrate.",
    },
    {
      question: "Does this calculator account for video compression or overhead?",
      answer:
        "This calculator provides a theoretical raw storage size based on bitrate and duration. In real-world scenarios, compression, metadata, and file system overhead can affect actual storage requirements, so it’s advisable to add a safety margin.",
    },
    {
      question: "Can I use this calculator for different video formats and codecs?",
      answer:
        "Yes, but you must input the correct average bitrate for the specific video format or codec. Different codecs compress video data differently, affecting the bitrate and thus the storage size.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating storage needed for a 24-hour surveillance video recorded at 5 Mbps bitrate.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "24 hours × 60 minutes × 60 seconds = 86,400 seconds",
      },
      {
        label: "Step 2: Calculate total Megabits",
        explanation: "5 Mbps × 86,400 sec = 432,000 Megabits",
      },
      {
        label: "Step 3: Convert Megabits to Megabytes",
        explanation: "432,000 ÷ 8 = 54,000 Megabytes",
      },
      {
        label: "Step 4: Convert Megabytes to Gigabytes",
        explanation: "54,000 ÷ 1024 ≈ 52.73 GB",
      },
    ],
    result: "Total storage required ≈ 52.73 GB for 24 hours at 5 Mbps.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Bitrate and Storage",
      description:
        "Comprehensive guide on how bitrate affects video storage requirements.",
      url: "https://www.videomaker.com/article/c10/18703-understanding-bitrate-and-storage",
    },
    {
      title: "Surveillance Video Storage Planning",
      description:
        "Best practices and formulas for planning video storage in surveillance systems.",
      url: "https://www.axis.com/files/whitepaper/wp_storage_requirements_38849_en_1907_lo.pdf",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <div className="w-32">
          <Label>Bitrate Unit</Label>
          <Select
            value={inputs.bitrateUnit}
            onValueChange={(value) => handleInputChange("bitrateUnit", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mbps">Mbps</SelectItem>
              <SelectItem value="Gbps">Gbps</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <Label>Storage Unit</Label>
          <Select
            value={inputs.sizeUnit}
            onValueChange={(value) => handleInputChange("sizeUnit", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GB">GB</SelectItem>
              <SelectItem value="TB">TB</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration (seconds)</Label>
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="e.g. 86400"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Bitrate</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            placeholder="e.g. 5"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate storage size"
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
            <p className="mt-3 text-sm italic text-slate-700 dark:text-slate-300">
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
          <li>Enter the total recording duration in seconds. For example, 1 hour = 3600 seconds.</li>
          <li>Input the average video bitrate. Choose the correct unit: Mbps (Megabits per second) or Gbps (Gigabits per second).</li>
          <li>Select the desired output storage unit: Gigabytes (GB) or Terabytes (TB).</li>
          <li>Click the Calculate button to see the estimated storage size required for your surveillance video.</li>
          <li>Review the calculation details and consider adding overhead for compression and metadata in real-world scenarios.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Surveillance/NVR Video Storage Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Planning storage for surveillance or Network Video Recorder (NVR) systems requires understanding how video bitrate and recording duration impact storage size. Bitrate, measured in bits per second, defines how much data is generated each second of video. Higher bitrates mean better video quality but also larger file sizes. Duration is the total length of the recording in seconds. The fundamental formula to estimate storage size is:
          </p>
          <p>
            <em>Storage Size (Bytes) = (Bitrate (bits/sec) × Duration (sec)) ÷ 8</em>
          </p>
          <p>
            This formula converts bits to bytes by dividing by 8, since 8 bits equal 1 byte. To convert bytes to gigabytes or terabytes, divide by 1024 twice (for GB) or thrice (for TB). It is crucial to ensure that bitrate units are consistent; if bitrate is given in Mbps or Gbps, convert accordingly to bits per second before calculation.
          </p>
          <p>
            Real-world storage planning must also consider factors like video compression, codec efficiency, metadata, and file system overhead, which can increase storage requirements beyond the raw calculation. Additionally, retention policies and the number of cameras affect total storage needs. This calculator provides a precise baseline estimate to help engineers and system designers allocate appropriate storage capacity for surveillance systems.
          </p>
          <p>
            Understanding these principles helps avoid under-provisioning storage, which can lead to data loss, or over-provisioning, which wastes resources. Always validate your inputs and consider adding a safety margin to accommodate unexpected data growth or changes in recording parameters.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is a frequent error that leads to miscalculations. Always remember that 8 bits equal 1 byte, and storage is measured in bytes. Inputting bitrate in Gbps but treating it as Mbps will underestimate storage needs by 1000x. Not converting duration to seconds or mixing time units can also cause errors. Lastly, ignoring compression and overhead may result in insufficient storage allocation.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
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
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Surveillance/NVR Video Storage Planner"
      description="Professional video & audio calculator: Surveillance/NVR Video Storage Planner. Accurate technical formulas for production, post-production, and broadcasting."
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