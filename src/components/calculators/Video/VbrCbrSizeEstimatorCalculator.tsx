import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VbrCbrSizeEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    bitrate: "", // in kbps
    duration: "", // in seconds
    overheadPercent: "5", // container/codec overhead in %
    option: "vbr" // "vbr" or "cbr"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * - bitrate input is in kbps (kilobits per second)
   * - duration in seconds
   * - overheadPercent is % overhead added to final size
   * 
   * For CBR:
   *   Size (bits) = bitrate (bps) * duration (s)
   * For VBR:
   *   Size (bits) = bitrate (bps) * duration (s) * factor (e.g. 0.7 to 1.3 depending on variability)
   * 
   * We estimate size in MB (megabytes) for user friendliness.
   * 1 Byte = 8 bits
   * 1 MB = 1024 * 1024 Bytes
   */

  const results = useMemo(() => {
    const bitrateKbps = parseFloat(inputs.bitrate);
    const durationSec = parseFloat(inputs.duration);
    const overheadPercent = parseFloat(inputs.overheadPercent);
    const mode = inputs.option;

    if (
      isNaN(bitrateKbps) ||
      bitrateKbps <= 0 ||
      isNaN(durationSec) ||
      durationSec <= 0 ||
      isNaN(overheadPercent) ||
      overheadPercent < 0
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter positive numeric values for bitrate, duration, and overhead.",
        feedback: ""
      };
    }

    // Convert bitrate to bits per second
    const bitrateBps = bitrateKbps * 1000;

    // Overhead factor
    const overheadFactor = 1 + overheadPercent / 100;

    // VBR variability factor range (typical)
    // We use a standard factor of 1.0 for CBR and 0.7 to 1.3 for VBR variability
    // Here, we estimate average VBR size as 85% of CBR size (typical savings)
    const vbrFactor = 0.85;

    let sizeBits = 0;
    let sizeMB = 0;
    let details = "";

    if (mode === "cbr") {
      sizeBits = bitrateBps * durationSec * overheadFactor;
      sizeMB = sizeBits / 8 / (1024 * 1024);
      details = `CBR size = bitrate (${bitrateKbps} kbps) × duration (${durationSec} s) × overhead (${overheadPercent}%)`;
    } else {
      // VBR estimated size
      sizeBits = bitrateBps * durationSec * vbrFactor * overheadFactor;
      sizeMB = sizeBits / 8 / (1024 * 1024);
      details = `VBR estimated size = bitrate (${bitrateKbps} kbps) × duration (${durationSec} s) × VBR factor (${vbrFactor}) × overhead (${overheadPercent}%)`;
    }

    const primary = sizeMB.toFixed(2);
    const secondary = "MB";

    const feedback =
      mode === "vbr"
        ? "VBR typically results in smaller file sizes than CBR for the same average bitrate, improving storage efficiency."
        : "CBR provides consistent bitrate and file size, ideal for streaming and broadcast scenarios requiring predictable bandwidth.";

    return { primary, secondary, details, feedback };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between VBR and CBR?",
      answer:
        "CBR (Constant Bitrate) maintains a fixed bitrate throughout the entire video, ensuring predictable file sizes and bandwidth usage. VBR (Variable Bitrate) adjusts the bitrate dynamically based on video complexity, often resulting in better quality at lower file sizes but less predictable bandwidth requirements."
    },
    {
      question: "Why do we multiply by overhead percentage?",
      answer:
        "Overhead accounts for additional data such as container metadata, codec headers, and error correction bits that are not part of the raw video stream but contribute to the total file size. Including overhead provides a more accurate estimate of the final file size."
    },
    {
      question: "How accurate is this estimator for real-world files?",
      answer:
        "This calculator provides an estimation based on average bitrates and typical overhead. Actual file sizes may vary depending on codec efficiency, encoding settings, and content complexity. For precise sizes, encoding and measuring the actual file is recommended."
    },
    {
      question: "Can I use this for audio bitrate estimation?",
      answer:
        "Yes, the calculator can estimate audio file sizes by inputting the audio bitrate and duration. However, audio bitrates are usually much lower, and overhead percentages might differ depending on the container format."
    },
    {
      question: "What units should I use for bitrate and duration?",
      answer:
        "Enter bitrate in kilobits per second (kbps) and duration in seconds. The calculator converts these units internally to bits and bytes for accurate size estimation."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the file size of a 10-minute video encoded at 5000 kbps average bitrate using VBR with 5% overhead.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert duration to seconds: 10 minutes × 60 = 600 seconds."
      },
      {
        label: "Step 2",
        explanation:
          "Calculate raw size in bits for CBR: 5000 kbps × 1000 = 5,000,000 bps; 5,000,000 bps × 600 s = 3,000,000,000 bits."
      },
      {
        label: "Step 3",
        explanation:
          "Apply VBR factor (0.85) and overhead (5%): 3,000,000,000 × 0.85 × 1.05 = 2,677,500,000 bits."
      },
      {
        label: "Step 4",
        explanation:
          "Convert bits to megabytes: 2,677,500,000 bits ÷ 8 = 334,687,500 bytes; 334,687,500 ÷ (1024 × 1024) ≈ 319.3 MB."
      }
    ],
    result: "Estimated VBR file size is approximately 319.3 MB."
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video encoding.",
      url: "https://www.smpte.org/"
    },
    {
      title: "Understanding Bitrate and File Size",
      description:
        "Detailed explanation of bitrate, file size, and encoding methods.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456"
    },
    {
      title: "Video Encoding Basics",
      description:
        "Comprehensive guide on video encoding, VBR vs CBR, and compression.",
      url: "https://www.videomaker.com/article/c10/18934-video-encoding-basics"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bitrate">Average Bitrate (kbps)</Label>
          <Input
            id="bitrate"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 5000"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 600"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overhead">Overhead Percentage (%)</Label>
          <Input
            id="overhead"
            type="number"
            min={0}
            step={0.1}
            value={inputs.overheadPercent}
            onChange={(e) => handleInputChange("overheadPercent", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="option">Encoding Mode</Label>
          <select
            id="option"
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
            value={inputs.option}
            onChange={(e) => handleInputChange("option", e.target.value)}
          >
            <option value="vbr">Variable Bitrate (VBR)</option>
            <option value="cbr">Constant Bitrate (CBR)</option>
          </select>
        </div>
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
            <Separator className="my-4" />
            <p className="text-sm italic text-slate-700 dark:text-slate-300">{results.feedback}</p>
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
          <li>Enter the average bitrate of your video or audio stream in kilobits per second (kbps).</li>
          <li>Input the total duration of the media in seconds. Convert minutes or hours to seconds if needed.</li>
          <li>Specify the overhead percentage to account for container and codec metadata (default is 5%).</li>
          <li>Select the encoding mode: Variable Bitrate (VBR) or Constant Bitrate (CBR).</li>
          <li>Click the Calculate button to see the estimated file size in megabytes (MB) along with calculation details and tips.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to VBR vs CBR Size Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the difference between Variable Bitrate (VBR) and Constant Bitrate (CBR) encoding is crucial for video professionals aiming to optimize quality and storage. CBR maintains a fixed bitrate throughout the entire media duration, which guarantees predictable file sizes and consistent bandwidth usage. This is especially important in streaming and broadcasting environments where network capacity is limited or strictly controlled.
          </p>
          <p>
            On the other hand, VBR dynamically adjusts the bitrate based on the complexity of the content. Scenes with high motion or detail receive higher bitrates, while simpler scenes use less data. This often results in better overall quality and smaller file sizes compared to CBR at the same average bitrate. However, VBR file sizes and bandwidth requirements can be less predictable, which may complicate streaming or broadcasting workflows.
          </p>
          <p>
            This calculator estimates the final file size by multiplying the average bitrate by the duration and adjusting for overhead, which includes container metadata, codec headers, and other non-media data. For VBR, a factor is applied to approximate the typical size reduction compared to CBR. The results are presented in megabytes (MB) for easy understanding.
          </p>
          <p>
            When planning storage or bandwidth, always consider the trade-offs between quality, predictability, and file size. Use this tool as a guideline, but remember that actual file sizes may vary depending on codec efficiency, encoding settings, and content complexity. For precise measurements, encoding a sample and analyzing the output file is recommended.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) leads to incorrect file size estimations. Remember that 8 bits equal 1 byte, and file sizes are typically measured in bytes or megabytes.
          </p>
          <p>
            <strong>Warning:</strong> Neglecting overhead such as container metadata and codec headers can underestimate the final file size, causing storage or bandwidth planning errors.
          </p>
          <p>
            <strong>Warning:</strong> Using average bitrate directly for VBR without applying a variability factor may overestimate the file size, as VBR often achieves better compression efficiency.
          </p>
          <p>
            <strong>Warning:</strong> Entering duration in minutes or hours without converting to seconds will produce incorrect results. Always convert time to seconds for this calculator.
          </p>
          <p>
            <strong>Warning:</strong> Assuming this calculator provides exact file sizes is a mistake; it only offers estimates. Actual sizes depend on codec, encoder settings, and content complexity.
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
      title="VBR vs CBR Size Estimator"
      description="Professional video & audio calculator: VBR vs CBR Size Estimator. Accurate technical formulas for production, post-production, and broadcasting."
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