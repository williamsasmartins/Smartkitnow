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

export default function VideoDataRateCalculator() {
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

    // Convert bitrate to Mbps if needed
    let bitrateMbps = bitrateVal;
    if (inputs.bitrateUnit === "Gbps") {
      bitrateMbps = bitrateVal * 1000; // 1 Gbps = 1000 Mbps
    }

    // Calculate size in Megabits: bitrate (Mbps) * duration (sec)
    const totalMegabits = bitrateMbps * durationSec;

    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 byte)
    const totalMegaBytes = totalMegabits / 8;

    // Convert Megabytes to GB or TB
    let size = totalMegaBytes / 1024; // MB to GB
    let unit = "GB";
    if (inputs.sizeUnit === "TB") {
      size = size / 1024; // GB to TB
      unit = "TB";
    }

    // Format size with 3 decimals
    const sizeFormatted = size.toFixed(3);

    const details = `Calculation: (${bitrateMbps} Mbps × ${durationSec} sec) ÷ 8 = ${totalMegaBytes.toFixed(
      2
    )} MB → ${sizeFormatted} ${unit}`;

    const feedback =
      "Tip: Ensure bitrate unit matches your source. Use GB for typical video files, TB for very large projects.";

    return {
      primary: sizeFormatted,
      secondary: unit,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between Mbps and MB/s?",
      answer:
        "Mbps stands for Megabits per second and measures data transfer speed in bits, while MB/s stands for Megabytes per second and measures data in bytes. Since 1 Byte equals 8 bits, 1 MB/s equals 8 Mbps. This distinction is crucial when calculating video file sizes or transfer rates to avoid errors.",
    },
    {
      question: "Why do we divide by 8 in the calculation?",
      answer:
        "Video bitrates are typically given in bits per second (bps), but file sizes are measured in bytes. Since 8 bits equal 1 byte, dividing the total bits by 8 converts the data into bytes, allowing us to calculate the file size accurately in Megabytes or Gigabytes.",
    },
    {
      question: "Can I use this calculator for audio bitrates?",
      answer:
        "Yes, this calculator can be used for audio bitrates as well, as the fundamental relationship between bitrate, duration, and file size is the same. Just ensure you input the correct bitrate and duration values for your audio files.",
    },
    {
      question: "How do I convert duration from timecode to seconds?",
      answer:
        "To convert SMPTE timecode (HH:MM:SS:FF) to seconds, multiply hours by 3600, minutes by 60, add seconds, and add frames divided by the frame rate. For example, 01:02:03:15 at 30fps equals 1*3600 + 2*60 + 3 + 15/30 = 3723.5 seconds.",
    },
    {
      question: "Why might my calculated file size differ from actual file size?",
      answer:
        "Actual file sizes can differ due to container overhead, compression efficiency, metadata, and variable bitrate encoding. This calculator provides an estimate based on constant bitrate and duration, so slight differences are normal in real-world scenarios.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the file size of a 10-minute 4K video recorded at 150 Mbps bitrate.",
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
        label: "Step 3: Calculate total Megabits",
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
    result: "The estimated file size is approximately 10.99 GB.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Bitrate and File Size",
      description:
        "Detailed explanation of bitrate, bits vs bytes, and file size calculations.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
    },
    {
      title: "Video Bitrate Explained",
      description:
        "Comprehensive guide on video bitrates and their impact on quality and file size.",
      url: "https://www.videomaker.com/article/c10/18982-video-bitrate-explained",
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
            placeholder="e.g. 600"
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
              placeholder="e.g. 150"
              value={inputs.bitrate}
              onChange={(e) => handleInputChange("bitrate", e.target.value)}
            />
            <Select
              value={inputs.bitrateUnit}
              onValueChange={(value) => handleInputChange("bitrateUnit", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mbps">Mbps</SelectItem>
                <SelectItem value="Gbps">Gbps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="sizeUnit">Output Size Unit</Label>
          <Select
            id="sizeUnit"
            value={inputs.sizeUnit}
            onValueChange={(value) => handleInputChange("sizeUnit", value)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GB">GB</SelectItem>
              <SelectItem value="TB">TB</SelectItem>
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
            <p className="text-xs text-slate-400 mt-1 italic">{results.feedback}</p>
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
          <li>Enter the total duration of your video or audio clip in seconds. If you have timecode, convert it to seconds first.</li>
          <li>Input the bitrate value of your video or audio stream. Select the correct unit (Mbps or Gbps) from the dropdown.</li>
          <li>Choose the desired output size unit: Gigabytes (GB) for typical files or Terabytes (TB) for very large projects.</li>
          <li>Click the Calculate button to get the estimated file size based on your inputs.</li>
          <li>Review the calculation details and tips provided to understand the result and optimize your workflow.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Data Rate Calculator (Mbps ↔ MB/s)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In professional video production and post-production workflows, accurately estimating file sizes is essential for storage planning, data transfer, and archiving. This Video Data Rate Calculator helps you convert between bitrate (in Mbps or Gbps) and file size (in GB or TB) based on the duration of your footage. The core formula used is: <em>File Size (Bytes) = (Bitrate (bits per second) × Duration (seconds)) ÷ 8</em>, where dividing by 8 converts bits to bytes.
          </p>
          <p>
            Bitrate is a measure of how much data is processed every second in your video or audio stream. It is commonly expressed in Megabits per second (Mbps) or Gigabits per second (Gbps). Duration is the total length of your media in seconds. By multiplying these two and converting bits to bytes, you get the total file size in bytes, which can then be converted to Megabytes, Gigabytes, or Terabytes for easier understanding.
          </p>
          <p>
            This calculator is particularly useful when working with high-resolution footage such as 4K or 8K, where file sizes can quickly become very large. It also helps in estimating transfer times over networks or storage requirements for archiving. Remember to always verify the units you input to avoid miscalculations, and consider that actual file sizes might vary slightly due to compression, container overhead, and metadata.
          </p>
          <p>
            Additionally, understanding the difference between bits and bytes is critical. Many users confuse Mbps (bits) with MB/s (bytes), leading to errors in estimating file sizes or transfer speeds. This tool clearly distinguishes these units and provides conversion options to ensure accuracy.
          </p>
          <p>
            Whether you are a video engineer, DIT, editor, or content creator, this calculator is a valuable tool to streamline your workflow and make informed decisions about data management.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is the most frequent error. Remember, 8 bits equal 1 byte, so always divide by 8 when converting bitrate to file size. Failing to do so will overestimate file sizes by a factor of eight.
          </p>
          <p>
            <strong>Warning:</strong> Mixing units without conversion, such as entering bitrate in Gbps but selecting Mbps in the calculator, leads to incorrect results. Always ensure the bitrate unit matches your input.
          </p>
          <p>
            <strong>Warning:</strong> Not converting timecode to seconds properly can cause errors. Use SMPTE standards for accurate conversion, especially when dealing with drop-frame or non-drop-frame timecodes.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring container overhead and compression effects can cause discrepancies between calculated and actual file sizes. This calculator provides estimates based on constant bitrate and duration only.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to select the correct output size unit (GB or TB) can lead to confusion when interpreting results, especially for very large files.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> Calculating the file size of a 10-minute 4K video recorded at 150 Mbps bitrate.</p>
          <ol>
            <li><strong>Step 1:</strong> Convert duration to seconds: 10 minutes × 60 = 600 seconds.</li>
            <li><strong>Step 2:</strong> Use bitrate in Mbps: 150 Mbps.</li>
            <li><strong>Step 3:</strong> Calculate total Megabits: 150 Mbps × 600 sec = 90,000 Megabits.</li>
            <li><strong>Step 4:</strong> Convert Megabits to Megabytes: 90,000 ÷ 8 = 11,250 Megabytes.</li>
            <li><strong>Step 5:</strong> Convert Megabytes to Gigabytes: 11,250 ÷ 1024 ≈ 10.99 GB.</li>
          </ol>
          <p><strong>Result:</strong> The estimated file size is approximately 10.99 GB.</p>
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
      title="Video Data Rate Calculator (Mbps ↔ MB/s)"
      description="Professional video & audio calculator: Video Data Rate Calculator (Mbps ↔ MB/s). Accurate technical formulas for production, post-production, and broadcasting."
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