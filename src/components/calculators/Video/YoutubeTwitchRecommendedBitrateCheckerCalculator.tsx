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

export default function YoutubeTwitchRecommendedBitrateCheckerCalculator() {
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
      bitrateMbps = bitrateVal * 1000;
    }

    // Calculate size in Megabits: bitrate (Mbps) * duration (sec)
    const totalMegabits = bitrateMbps * durationSec;

    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 Byte)
    const totalMegaBytes = totalMegabits / 8;

    // Convert Megabytes to Gigabytes
    const totalGigaBytes = totalMegaBytes / 1024;

    // Convert Gigabytes to Terabytes if > 1024 GB
    let sizePrimary = totalGigaBytes;
    let sizeUnit = "GB";
    if (totalGigaBytes >= 1024) {
      sizePrimary = totalGigaBytes / 1024;
      sizeUnit = "TB";
    }

    // Format result to 3 decimals max
    const formattedSize = sizePrimary.toFixed(3);

    return {
      primary: formattedSize,
      secondary: sizeUnit,
      details: `Calculated size based on bitrate (${bitrateVal} ${bitrateUnit}) and duration (${durationSec} seconds).`,
      feedback:
        "Ensure your upload bandwidth and storage can handle this data size for smooth streaming or uploading.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in bitrate calculations?",
      answer:
        "Bits (b) and bytes (B) are units of digital information where 8 bits equal 1 byte. Bitrate is typically measured in bits per second (bps), while file sizes are measured in bytes. When calculating file size from bitrate, you must divide the total bits by 8 to convert to bytes, ensuring accurate size estimation.",
    },
    {
      question: "Why do we convert bitrate from Gbps to Mbps?",
      answer:
        "Bitrate units must be consistent for accurate calculations. Since 1 Gbps equals 1000 Mbps, converting Gbps to Mbps standardizes the unit, simplifying the math. This ensures the formula (bitrate * duration) / 8 yields correct file size in bytes.",
    },
    {
      question: "How does video duration affect the upload size?",
      answer:
        "The longer the video duration, the larger the total data size, assuming a constant bitrate. File size scales linearly with duration, so doubling the length doubles the size. This is critical for planning storage and upload bandwidth requirements.",
    },
    {
      question: "Can this calculator be used for live streaming bitrate estimation?",
      answer:
        "Yes, this calculator helps estimate the data rate and total data transmitted during live streaming based on bitrate and duration. This assists in ensuring your internet connection and streaming platform settings are optimized for smooth broadcasts.",
    },
    {
      question: "Why is it important to consider SMPTE timecode standards?",
      answer:
        "SMPTE timecode standards define precise frame timing for video, including drop-frame and non-drop-frame formats. Accurate duration measurement using SMPTE ensures bitrate calculations reflect true video length, which is essential for professional video production and broadcasting.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Uploading a 10-minute (600 seconds) 1080p video to YouTube with a recommended bitrate of 8 Mbps.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert duration to seconds: 10 minutes × 60 = 600 seconds.",
      },
      {
        label: "Step 2",
        explanation: "Bitrate is given as 8 Mbps (Megabits per second).",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate total Megabits: 8 Mbps × 600 seconds = 4800 Megabits.",
      },
      {
        label: "Step 4",
        explanation:
          "Convert Megabits to Megabytes: 4800 ÷ 8 = 600 Megabytes.",
      },
      {
        label: "Step 5",
        explanation:
          "Convert Megabytes to Gigabytes: 600 ÷ 1024 ≈ 0.586 GB.",
      },
    ],
    result:
      "The estimated file size is approximately 0.586 GB for a 10-minute video at 8 Mbps bitrate.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "YouTube Encoding Settings",
      description:
        "Recommended bitrates and encoding settings for YouTube uploads.",
      url: "https://support.google.com/youtube/answer/1722171",
    },
    {
      title: "Twitch Bitrate Recommendations",
      description:
        "Guidelines for optimal streaming bitrate on Twitch platform.",
      url: "https://help.twitch.tv/s/article/broadcast-guidelines",
    },
    {
      title: "Bits vs Bytes Explained",
      description:
        "Understanding the difference between bits and bytes in digital data.",
      url: "https://www.lifewire.com/bit-vs-byte-2625921",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="e.g. 8"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
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
          <li>Enter the total duration of your video or stream in seconds.</li>
          <li>Input the bitrate value according to your upload or streaming settings.</li>
          <li>Select the bitrate unit, either Mbps (Megabits per second) or Gbps (Gigabits per second).</li>
          <li>Click the Calculate button to compute the estimated file size or data usage.</li>
          <li>Review the results and use the feedback to optimize your upload or streaming workflow.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to YouTube/Twitch Recommended Bitrate (Upload/Stream) Checker
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between bitrate, duration, and file size is essential for video professionals, streamers, and content creators. Bitrate, measured in bits per second, defines how much data is processed every second of video or audio. Higher bitrates generally mean better quality but also larger file sizes and higher bandwidth requirements.
          </p>
          <p>
            This calculator helps you estimate the total data size of your video or stream based on the bitrate and duration inputs. The core formula used is: <em>File Size (Bytes) = (Bitrate (bits per second) × Duration (seconds)) / 8</em>. The division by 8 converts bits to bytes, as 8 bits equal 1 byte. To make the results more user-friendly, the calculator converts bytes into Gigabytes (GB) or Terabytes (TB) depending on the size.
          </p>
          <p>
            For example, if you are uploading a 10-minute video at 8 Mbps, the calculator will convert 10 minutes to 600 seconds, multiply by 8 Mbps to get total megabits, then convert megabits to megabytes and finally to gigabytes. This helps you understand how much storage space you need and whether your internet upload speed can handle the file size efficiently.
          </p>
          <p>
            It is important to distinguish between bits and bytes to avoid miscalculations. Bitrate is almost always expressed in bits per second, while file sizes are in bytes. Also, knowing the exact duration in seconds is critical, especially for professional workflows that use SMPTE timecode standards to ensure frame-accurate timing.
          </p>
          <p>
            This tool is invaluable for planning uploads to platforms like YouTube or Twitch, where recommended bitrates vary depending on resolution and frame rate. By estimating file sizes beforehand, you can optimize your encoding settings, avoid buffering issues during streaming, and manage your storage resources effectively.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is a frequent error that leads to file size miscalculations by a factor of 8. Always remember to divide total bits by 8 to convert to bytes.
          </p>
          <p>
            <strong>Warning:</strong> Not converting bitrate units consistently (e.g., mixing Mbps and Gbps) can cause incorrect results. Always convert all bitrate values to the same unit before calculation.
          </p>
          <p>
            <strong>Warning:</strong> Using approximate or rounded durations without considering frame accuracy can introduce errors, especially in professional video workflows that rely on SMPTE timecode.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring overheads such as audio bitrate, container metadata, or codec efficiency means the calculated size is an estimate, not an exact file size.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to check your actual upload bandwidth against the calculated data rate can result in buffering or failed uploads during streaming.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> {example.scenario}</p>
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
      title="YouTube/Twitch Recommended Bitrate (Upload/Stream) Checker"
      description="Professional video & audio calculator: YouTube/Twitch Recommended Bitrate (Upload/Stream) Checker. Accurate technical formulas for production, post-production, and broadcasting."
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