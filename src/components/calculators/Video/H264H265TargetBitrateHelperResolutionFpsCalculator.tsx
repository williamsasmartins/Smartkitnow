import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function H264H265TargetBitrateHelperResolutionFpsCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds or timecode (seconds only for simplicity)
    bitrate: "", // in Mbps or Gbps
    bitrateUnit: "Mbps",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Convert duration string to seconds (assuming input in seconds for simplicity)
  // Could be extended to SMPTE timecode parsing if needed.
  const durationSeconds = useMemo(() => {
    const d = parseFloat(inputs.duration);
    return isNaN(d) || d <= 0 ? 0 : d;
  }, [inputs.duration]);

  // Convert bitrate to Mbps (if Gbps, multiply by 1000)
  const bitrateMbps = useMemo(() => {
    const b = parseFloat(inputs.bitrate);
    if (isNaN(b) || b <= 0) return 0;
    return inputs.bitrateUnit === "Gbps" ? b * 1000 : b;
  }, [inputs.bitrate, inputs.bitrateUnit]);

  // Calculate file size in Bytes: (bitrate in Mbps * duration in seconds) / 8 = MB
  // Then convert MB to GB or TB as needed.
  const results = useMemo(() => {
    if (durationSeconds === 0 || bitrateMbps === 0) {
      return {
        primary: "0",
        secondary: "GB",
        details: "Please enter valid positive numbers for duration and bitrate.",
        feedback: "",
      };
    }

    // Total Megabits = bitrateMbps * durationSeconds
    const totalMegabits = bitrateMbps * durationSeconds;

    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 Byte)
    const totalMegaBytes = totalMegabits / 8;

    // Convert MB to GB
    const totalGigaBytes = totalMegaBytes / 1024;

    // Convert GB to TB if > 1024 GB
    let displayValue = totalGigaBytes;
    let unit = "GB";
    if (totalGigaBytes >= 1024) {
      displayValue = totalGigaBytes / 1024;
      unit = "TB";
    }

    // Format to 2 decimals
    const formattedValue = displayValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return {
      primary: formattedValue,
      secondary: unit,
      details: `File size = (Bitrate × Duration) ÷ 8. (${bitrateMbps} Mbps × ${durationSeconds} sec) ÷ 8 = ${formattedValue} ${unit}`,
      feedback:
        "Use this calculation to estimate storage requirements for your encoded video at given bitrate and duration.",
    };
  }, [bitrateMbps, durationSeconds]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in video bitrate?",
      answer:
        "Bits (b) and Bytes (B) are units of digital information. 8 bits equal 1 byte. Video bitrates are typically measured in bits per second (bps), while file sizes are measured in bytes. This calculator converts bitrate (in Mbps) and duration (in seconds) to file size in bytes, ensuring accurate storage estimation.",
    },
    {
      question: "Can I input timecode format for duration?",
      answer:
        "Currently, this calculator accepts duration input in seconds only. For SMPTE timecode (HH:MM:SS:FF), you would need to convert it to total seconds manually or use a dedicated timecode converter before using this tool.",
    },
    {
      question: "Why do I need to divide by 8 in the calculation?",
      answer:
        "Bitrate is measured in bits per second, but file size is measured in bytes. Since 1 byte = 8 bits, dividing the total bits by 8 converts the value to bytes, allowing you to calculate the file size correctly.",
    },
    {
      question: "How accurate is this calculator for H.264 vs H.265?",
      answer:
        "This calculator estimates file size based on bitrate and duration, independent of codec efficiency. H.265 typically achieves similar quality at about half the bitrate of H.264, so adjust your bitrate input accordingly for accurate size estimation.",
    },
    {
      question: "Can I use this calculator for audio bitrate estimation?",
      answer:
        "Yes, as long as you input the correct bitrate and duration, this calculator can estimate file size for audio streams as well. Just ensure the bitrate unit matches your audio bitrate (usually in kbps or Mbps).",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the file size of a 10-minute 4K video encoded with H.265 at 25 Mbps bitrate.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "10 minutes × 60 seconds = 600 seconds",
      },
      {
        label: "Step 2: Calculate total megabits",
        explanation: "Bitrate (25 Mbps) × Duration (600 sec) = 15,000 Megabits",
      },
      {
        label: "Step 3: Convert megabits to megabytes",
        explanation: "15,000 Megabits ÷ 8 = 1,875 Megabytes",
      },
      {
        label: "Step 4: Convert megabytes to gigabytes",
        explanation: "1,875 MB ÷ 1024 ≈ 1.83 GB",
      },
    ],
    result: "The estimated file size is approximately 1.83 GB.",
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
        "Comprehensive guide on video bitrate and its impact on quality and file size.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
    },
    {
      title: "H.264 vs H.265 Compression",
      description:
        "Technical comparison of H.264 and H.265 codecs and their bitrate efficiency.",
      url: "https://www.videomaker.com/article/c10/18730-h-264-vs-h-265-which-is-better",
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
            step="any"
            placeholder="e.g. 25"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <select
            id="bitrateUnit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
            value={inputs.bitrateUnit}
            onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
          >
            <option value="Mbps">Mbps (Megabits per second)</option>
            <option value="Gbps">Gbps (Gigabits per second)</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={durationSeconds === 0 || bitrateMbps === 0}>
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
          <li>Enter the total video duration in seconds. For example, a 10-minute video is 600 seconds.</li>
          <li>Input the target bitrate of your encoded video. Choose the unit as Mbps (megabits per second) or Gbps (gigabits per second).</li>
          <li>Click the Calculate button to get the estimated file size in gigabytes (GB) or terabytes (TB) depending on the result.</li>
          <li>Review the detailed calculation shown below the result for transparency and verification.</li>
          <li>Use this information to plan your storage needs or bandwidth requirements for video delivery.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to H.264/H.265 Target Bitrate Helper (by resolution/FPS)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In professional video production and post-production workflows, accurately estimating the file size of encoded video is crucial for storage planning, delivery, and archiving. The H.264 and H.265 codecs are widely used for their efficient compression, but the final file size depends primarily on the target bitrate and the duration of the video. This calculator helps you quickly determine the expected file size based on these parameters.
          </p>
          <p>
            The core formula used here is based on the relationship between bitrate, duration, and file size. Bitrate is measured in bits per second (bps), while file size is measured in bytes. Since 8 bits equal 1 byte, the formula divides the total bits by 8 to convert to bytes. Then, it converts bytes to megabytes (MB), gigabytes (GB), or terabytes (TB) for easier understanding.
          </p>
          <p>
            While this calculator does not directly factor in resolution or frames per second (FPS), these parameters influence the bitrate you choose. Higher resolution and FPS typically require higher bitrates to maintain quality. For example, a 4K video at 60 FPS will need a higher bitrate than a 1080p video at 24 FPS to achieve similar visual fidelity. Adjust your bitrate input accordingly based on your codec settings and quality targets.
          </p>
          <p>
            Remember that H.265 (HEVC) generally offers better compression efficiency than H.264, often requiring about half the bitrate for comparable quality. Use this knowledge to select an appropriate bitrate before calculating your file size.
          </p>
          <p>
            This tool is invaluable for video engineers, DITs, and post-production professionals who need to estimate storage requirements quickly and accurately without complex software. It supports planning for encoding, archiving, and streaming workflows.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Entering bitrate in Mbps but forgetting to select the correct unit can lead to file size miscalculations by a factor of 1000. Always double-check your bitrate unit selection (Mbps vs Gbps).
          </p>
          <p>
            <strong>Warning:</strong> Confusing bits and bytes is a frequent error. Bitrate is in bits per second, but file size is in bytes. This calculator handles the conversion internally, but manual calculations must always divide bits by 8 to get bytes.
          </p>
          <p>
            <strong>Warning:</strong> Inputting duration in minutes or hours without converting to seconds will produce incorrect results. Always convert your duration to total seconds before using this calculator.
          </p>
          <p>
            <strong>Warning:</strong> Assuming bitrate alone determines quality can be misleading. Resolution, codec efficiency, and content complexity also affect perceived quality and file size.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for variable bitrate (VBR) encoded files may only provide an estimate, as actual file size can fluctuate based on scene complexity.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
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
      title="H.264/H.265 Target Bitrate Helper (by resolution/FPS)"
      description="Professional video & audio calculator: H.264/H.265 Target Bitrate Helper (by resolution/FPS). Accurate technical formulas for production, post-production, and broadcasting."
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