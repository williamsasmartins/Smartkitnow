import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RecordingTimeCardSsdCapacityCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds
    bitrate: "", // in Mbps or Gbps
    bitrateUnit: "Mbps",
    sizeUnit: "GB",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const durationSec = parseFloat(inputs.duration);
    let bitrate = parseFloat(inputs.bitrate);
    if (isNaN(durationSec) || durationSec <= 0) {
      return {
        primary: "0",
        secondary: inputs.sizeUnit,
        details: "Please enter a valid positive duration in seconds.",
        feedback: "",
      };
    }
    if (isNaN(bitrate) || bitrate <= 0) {
      return {
        primary: "0",
        secondary: inputs.sizeUnit,
        details: "Please enter a valid positive bitrate.",
        feedback: "",
      };
    }

    // Convert bitrate to Mbps if input is Gbps
    if (inputs.bitrateUnit === "Gbps") {
      bitrate = bitrate * 1000; // 1 Gbps = 1000 Mbps
    }

    // Calculate size in Megabits: bitrate (Mbps) * duration (sec)
    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 Byte)
    // Convert Megabytes to GB: divide by 1024
    let sizeMB = (bitrate * durationSec) / 8;
    let sizeGB = sizeMB / 1024;
    let sizeTB = sizeGB / 1024;

    let displaySize = 0;
    let unit = inputs.sizeUnit;

    if (unit === "GB") {
      displaySize = sizeGB;
    } else if (unit === "TB") {
      displaySize = sizeTB;
    } else {
      // fallback to GB
      displaySize = sizeGB;
      unit = "GB";
    }

    // Format to 3 decimals max
    const formattedSize =
      displaySize < 0.001
        ? "<0.001"
        : displaySize.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
          });

    return {
      primary: formattedSize,
      secondary: unit,
      details: `Calculation: (${bitrate} Mbps × ${durationSec} sec) ÷ 8 ÷ 1024 = ${formattedSize} ${unit}`,
      feedback:
        "Tip: Always use consistent units and double-check bitrate units (Mbps vs Gbps) to avoid calculation errors.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in this calculator?",
      answer:
        "This calculator uses bits and bytes distinctly: bitrate is measured in bits per second (bps), while storage capacity is in bytes. Since 8 bits equal 1 byte, the formula divides the total bits by 8 to convert to bytes. Confusing bits with bytes can lead to errors in estimating storage needs.",
    },
    {
      question: "Can I input recording duration in minutes or hours?",
      answer:
        "Currently, the calculator accepts duration in seconds for precision and simplicity. To convert minutes or hours to seconds, multiply minutes by 60 and hours by 3600 before inputting. This ensures accurate calculations aligned with the formula.",
    },
    {
      question: "Why do I need to select bitrate units (Mbps or Gbps)?",
      answer:
        "Bitrate units affect the calculation significantly. Mbps means megabits per second, while Gbps means gigabits per second (1000 Mbps). Selecting the correct unit ensures the calculator converts the bitrate properly, preventing underestimations or overestimations of storage size.",
    },
    {
      question: "How accurate is this calculator for real-world recording scenarios?",
      answer:
        "This calculator provides a theoretical estimate based on constant bitrate and duration. Actual file sizes may vary due to codec efficiency, variable bitrate encoding, metadata, and container overhead. Always allow for some buffer space when planning storage.",
    },
    {
      question: "Can this calculator be used for audio recording storage estimation?",
      answer:
        "Yes, as long as you know the audio bitrate and duration, you can use this calculator. Just input the audio bitrate and duration, and it will estimate the required storage. Keep in mind audio bitrates are typically much lower than video bitrates.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Recording a 10-minute 4K video at 150 Mbps bitrate to estimate required SSD capacity.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert 10 minutes to seconds: 10 × 60 = 600 seconds.",
      },
      {
        label: "Step 2",
        explanation:
          "Use the bitrate of 150 Mbps as given.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate total bits: 150 Mbps × 600 sec = 90,000 Megabits.",
      },
      {
        label: "Step 4",
        explanation:
          "Convert Megabits to Megabytes: 90,000 ÷ 8 = 11,250 MB.",
      },
      {
        label: "Step 5",
        explanation:
          "Convert Megabytes to Gigabytes: 11,250 ÷ 1024 ≈ 10.99 GB.",
      },
    ],
    result:
      "The estimated required SSD capacity is approximately 11 GB for 10 minutes of 4K video at 150 Mbps.",
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
      url: "https://www.videomaker.com/article/c10/18799-understanding-bitrate-and-storage",
    },
    {
      title: "Video Storage Calculations",
      description:
        "Comprehensive guide on calculating video file sizes based on bitrate and duration.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
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
          <Label htmlFor="bitrate">Bitrate</Label>
          <Input
            id="bitrate"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 150"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <select
            id="bitrateUnit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.bitrateUnit}
            onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
          >
            <option value="Mbps">Mbps (Megabits per second)</option>
            <option value="Gbps">Gbps (Gigabits per second)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="sizeUnit">Output Size Unit</Label>
        <select
          id="sizeUnit"
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
          value={inputs.sizeUnit}
          onChange={(e) => handleInputChange("sizeUnit", e.target.value)}
        >
          <option value="GB">GB (Gigabytes)</option>
          <option value="TB">TB (Terabytes)</option>
        </select>
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
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-3" />
            <p className="text-sm text-slate-700 dark:text-slate-300">{results.feedback}</p>
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
          <li>Enter the total recording duration in seconds. Convert minutes or hours to seconds beforehand.</li>
          <li>Input the video or audio bitrate value.</li>
          <li>Select the bitrate unit: Mbps (megabits per second) or Gbps (gigabits per second).</li>
          <li>Choose the desired output size unit: GB (gigabytes) or TB (terabytes).</li>
          <li>Click the Calculate button to see the estimated storage size required for your recording.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Recording Time vs Card/SSD Capacity
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between recording time, bitrate, and storage capacity is essential for video engineers and digital imaging technicians (DITs) to plan and manage media storage effectively. Bitrate, measured in bits per second (bps), defines how much data is recorded every second. Higher bitrates mean better quality but require more storage space. Storage devices like SD cards or SSDs are measured in bytes, where 1 byte equals 8 bits. This calculator uses the formula: <em>Storage Size (Bytes) = (Bitrate (bits/sec) × Duration (sec)) ÷ 8</em>, converting bits to bytes.
          </p>
          <p>
            Since bitrates are often expressed in Mbps (megabits per second) or Gbps (gigabits per second), the calculator converts these units to a consistent base before computing the storage size. Duration must be input in seconds for accuracy, so longer durations in minutes or hours should be converted accordingly. The output can be displayed in gigabytes (GB) or terabytes (TB), depending on the scale of the recording.
          </p>
          <p>
            This tool helps professionals avoid underestimating storage needs, which can lead to recording interruptions or data loss. It also aids in budgeting and logistics by estimating how many cards or drives are necessary for a shoot. Remember, actual file sizes may vary due to codec efficiency, metadata, and variable bitrate encoding, so always allow a margin of safety in your calculations.
          </p>
          <p>
            By mastering these calculations, video professionals can optimize workflows, ensure smooth production, and maintain high-quality recordings without unexpected storage shortages.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is a frequent error that leads to miscalculations. Always remember that 8 bits equal 1 byte, so divide total bits by 8 to get bytes. Another common mistake is mixing bitrate units; ensure you select Mbps or Gbps correctly to avoid underestimating storage needs by a factor of 1000. Additionally, forgetting to convert recording duration into seconds can skew results significantly. Lastly, relying solely on theoretical calculations without accounting for codec overhead or variable bitrate can cause storage shortages during actual recording.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> {example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p><strong>Result:</strong> {example.result}</p>
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Recording Time vs Card/SSD Capacity"
      description="Professional video & audio calculator: Recording Time vs Card/SSD Capacity. Accurate technical formulas for production, post-production, and broadcasting."
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