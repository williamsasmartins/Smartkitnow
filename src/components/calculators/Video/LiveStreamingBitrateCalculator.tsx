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
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LiveStreamingBitrateCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds or timecode
    bitrate: "", // numeric value
    bitrateUnit: "Mbps", // Mbps or Gbps
    sizeUnit: "GB", // GB or TB
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to parse SMPTE timecode (HH:MM:SS) to seconds
  const parseTimecodeToSeconds = (timecode: string) => {
    const parts = timecode.split(":");
    if (parts.length !== 3) return NaN;
    const [hh, mm, ss] = parts.map((p) => parseInt(p, 10));
    if (
      isNaN(hh) ||
      isNaN(mm) ||
      isNaN(ss) ||
      mm < 0 ||
      mm > 59 ||
      ss < 0 ||
      ss > 59 ||
      hh < 0
    )
      return NaN;
    return hh * 3600 + mm * 60 + ss;
  };

  const results = useMemo(() => {
    // Validate inputs
    let durationSeconds = 0;
    if (inputs.duration.includes(":")) {
      durationSeconds = parseTimecodeToSeconds(inputs.duration);
      if (isNaN(durationSeconds)) return null;
    } else {
      durationSeconds = Number(inputs.duration);
      if (isNaN(durationSeconds) || durationSeconds <= 0) return null;
    }

    const bitrateNum = Number(inputs.bitrate);
    if (isNaN(bitrateNum) || bitrateNum <= 0) return null;

    // Convert bitrate to Mbps if needed
    let bitrateMbps = bitrateNum;
    if (inputs.bitrateUnit === "Gbps") {
      bitrateMbps = bitrateNum * 1000;
    }

    // Calculate total bits: bitrate (Mbps) * seconds * 1,000,000 (bits per second)
    // But since Mbps = 1,000,000 bits per second, and we want bytes:
    // Size (Bytes) = (bitrate in bits per second * duration in seconds) / 8
    // Simplify: (Mbps * 1,000,000 * seconds) / 8 = (Mbps * seconds * 125,000) bytes

    const totalBytes = bitrateMbps * durationSeconds * 125000;

    // Convert bytes to GB or TB
    // 1 GB = 1024^3 bytes = 1,073,741,824 bytes
    // 1 TB = 1024 GB = 1,099,511,627,776 bytes

    let size = 0;
    let unit = inputs.sizeUnit;
    if (unit === "GB") {
      size = totalBytes / 1073741824;
    } else if (unit === "TB") {
      size = totalBytes / 1099511627776;
    } else {
      // fallback to GB
      size = totalBytes / 1073741824;
      unit = "GB";
    }

    // Format size to 3 decimals
    const formattedSize = size.toFixed(3);

    return {
      primary: formattedSize,
      secondary: unit,
      details: `Duration: ${durationSeconds} seconds, Bitrate: ${bitrateMbps} Mbps converted to ${unit}`,
      feedback:
        "Ensure your network bandwidth supports this bitrate for smooth streaming.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in streaming?",
      answer:
        "Bits (b) and Bytes (B) are fundamental units of digital information. In streaming, bitrate is measured in bits per second (bps), representing the amount of data transmitted each second. Since 1 Byte equals 8 bits, storage sizes are usually expressed in Bytes (e.g., GB or TB). Understanding this distinction is crucial for accurate calculations of file sizes and bandwidth requirements.",
    },
    {
      question: "How do I convert timecode to seconds for this calculator?",
      answer:
        "This calculator accepts SMPTE timecode in the format HH:MM:SS. To convert, multiply hours by 3600, minutes by 60, and add all seconds together. For example, 01:30:00 equals 5400 seconds. This conversion ensures precise calculation of data size based on streaming duration.",
    },
    {
      question: "Why is bitrate important for live streaming?",
      answer:
        "Bitrate determines the quality and data rate of your live stream. Higher bitrates yield better video and audio quality but require more bandwidth and storage. Selecting an appropriate bitrate balances quality with network capabilities to avoid buffering or dropped frames during streaming.",
    },
    {
      question: "Can I use this calculator for recorded video files?",
      answer:
        "While primarily designed for live streaming bitrate calculations, this tool can estimate file sizes for recorded videos if you know the average bitrate and duration. However, recorded files may have variable bitrates, so results are approximate.",
    },
    {
      question: "What units should I use for bitrate and size?",
      answer:
        "Bitrate is commonly measured in Mbps (megabits per second) or Gbps (gigabits per second), while size is measured in GB (gigabytes) or TB (terabytes). Remember, 8 bits equal 1 byte, so this calculator converts bitrate and duration into storage size accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Streaming a live event lasting 2 hours with a bitrate of 5 Mbps, calculating the total data size in GB.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "2 hours = 2 × 3600 = 7200 seconds",
      },
      {
        label: "Step 2: Use bitrate in Mbps",
        explanation: "Bitrate = 5 Mbps",
      },
      {
        label: "Step 3: Calculate total bytes",
        explanation:
          "Total bytes = 5 Mbps × 7200 sec × 125,000 = 4,500,000,000 bytes",
      },
      {
        label: "Step 4: Convert bytes to GB",
        explanation:
          "Size in GB = 4,500,000,000 / 1,073,741,824 ≈ 4.19 GB",
      },
    ],
    result: "The live stream will consume approximately 4.19 GB of data.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Bitrate in Streaming",
      description:
        "Comprehensive guide on bitrate and its impact on streaming quality.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
    },
    {
      title: "Bits vs Bytes Explained",
      description:
        "Technical explanation of bits and bytes and their usage in digital media.",
      url: "https://www.techopedia.com/definition/561/bit",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds or HH:MM:SS)</Label>
          <Input
            id="duration"
            type="text"
            placeholder="e.g. 3600 or 01:00:00"
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
            placeholder="e.g. 5"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <Select
            value={inputs.bitrateUnit}
            onValueChange={(value) => handleInputChange("bitrateUnit", value)}
          >
            <SelectTrigger id="bitrateUnit" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mbps">Mbps (Megabits per second)</SelectItem>
              <SelectItem value="Gbps">Gbps (Gigabits per second)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sizeUnit">Output Size Unit</Label>
          <Select
            value={inputs.sizeUnit}
            onValueChange={(value) => handleInputChange("sizeUnit", value)}
          >
            <SelectTrigger id="sizeUnit" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GB">GB (Gigabytes)</SelectItem>
              <SelectItem value="TB">TB (Terabytes)</SelectItem>
            </SelectContent>
          </Select>
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
            <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">{results.feedback}</p>
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
          <li>Enter the duration of your live stream either as total seconds (e.g., 3600) or SMPTE timecode format (HH:MM:SS, e.g., 01:00:00).</li>
          <li>Input the bitrate value of your live stream and select the appropriate unit (Mbps or Gbps).</li>
          <li>Choose the desired output size unit for the result, either Gigabytes (GB) or Terabytes (TB).</li>
          <li>Click the "Calculate" button to compute the estimated data size your live stream will consume.</li>
          <li>Review the result and details to ensure your network and storage can accommodate the stream.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Live Streaming Bitrate Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Live streaming requires careful planning of bandwidth and storage to ensure smooth delivery and quality. The bitrate of a stream, measured in bits per second, directly influences the amount of data transmitted over the network. Higher bitrates provide better video and audio quality but demand more bandwidth and storage capacity.
          </p>
          <p>
            This calculator helps professionals and enthusiasts estimate the total data size of a live stream based on its duration and bitrate. The formula used is straightforward: the total number of bits transmitted equals the bitrate multiplied by the duration in seconds. Since storage is measured in bytes, and 1 byte equals 8 bits, the calculator divides the total bits by 8 to convert to bytes.
          </p>
          <p>
            Users can input duration as either total seconds or SMPTE timecode (HH:MM:SS), a standard in video production, ensuring flexibility and accuracy. Bitrate units can be toggled between Mbps and Gbps to accommodate various streaming setups. The output size can be displayed in GB or TB, depending on the scale of the stream.
          </p>
          <p>
            Understanding these calculations is crucial for live stream engineers, broadcasters, and content creators to optimize their workflows, avoid network congestion, and manage storage efficiently. This tool serves as a reliable reference for planning and troubleshooting live streaming projects.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) can lead to incorrect calculations. Remember that 8 bits equal 1 byte, so always ensure your bitrate is in bits per second and storage size is in bytes.
          </p>
          <p>
            <strong>Warning:</strong> Entering duration incorrectly, such as mixing timecode formats or invalid values, will cause inaccurate results. Use either total seconds or the HH:MM:SS format strictly.
          </p>
          <p>
            <strong>Warning:</strong> Not accounting for network overhead or variable bitrate streams can cause discrepancies between estimated and actual data usage. This calculator assumes constant bitrate.
          </p>
          <p>
            <strong>Warning:</strong> Selecting incorrect units for bitrate or size (e.g., mixing Mbps with GB without conversion) will produce misleading outputs. Always double-check your unit selections.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> Streaming a live event lasting 2 hours with a bitrate of 5 Mbps, calculating the total data size in GB.</p>
          <ol>
            <li><strong>Step 1:</strong> Convert duration to seconds: 2 hours = 2 × 3600 = 7200 seconds.</li>
            <li><strong>Step 2:</strong> Use bitrate in Mbps: 5 Mbps.</li>
            <li><strong>Step 3:</strong> Calculate total bytes: 5 Mbps × 7200 sec × 125,000 = 4,500,000,000 bytes.</li>
            <li><strong>Step 4:</strong> Convert bytes to GB: 4,500,000,000 / 1,073,741,824 ≈ 4.19 GB.</li>
          </ol>
          <p><strong>Result:</strong> The live stream will consume approximately 4.19 GB of data.</p>
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
      title="Live Streaming Bitrate Calculator"
      description="Professional video & audio calculator: Live Streaming Bitrate Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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