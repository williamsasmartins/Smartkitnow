import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VideoCompressionSizeEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    bitrate: "", // in kbps
    duration: "", // in seconds
    overheadPercent: "5", // container overhead in %
  });

  const handleInputChange = (field: string, value: string) => {
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const bitrateKbps = parseFloat(inputs.bitrate);
    const durationSec = parseFloat(inputs.duration);
    const overheadPercent = parseFloat(inputs.overheadPercent);

    if (
      isNaN(bitrateKbps) ||
      bitrateKbps <= 0 ||
      isNaN(durationSec) ||
      durationSec <= 0 ||
      isNaN(overheadPercent) ||
      overheadPercent < 0
    ) {
      return {
        primary: "0",
        secondary: "MB",
        details: "Please enter valid positive numbers for bitrate, duration, and overhead.",
        feedback: "",
      };
    }

    // Bitrate is in kilobits per second (kbps)
    // Duration is in seconds
    // Total bits = bitrate (kbps) * 1000 (bits per kb) * duration (sec)
    const totalBits = bitrateKbps * 1000 * durationSec;

    // Add container overhead (e.g. MP4, MKV container overhead typically 2-10%)
    const totalBitsWithOverhead = totalBits * (1 + overheadPercent / 100);

    // Convert bits to bytes (8 bits = 1 byte)
    const totalBytes = totalBitsWithOverhead / 8;

    // Convert bytes to megabytes (1 MB = 1024 * 1024 bytes)
    const totalMB = totalBytes / (1024 * 1024);

    // Format result to 2 decimal places
    const sizeMB = totalMB.toFixed(2);

    return {
      primary: sizeMB,
      secondary: "MB",
      details: `Estimated file size for a ${durationSec} second video at ${bitrateKbps} kbps bitrate with ${overheadPercent}% container overhead.`,
      feedback:
        "To reduce file size, consider lowering bitrate or duration, or using more efficient codecs like H.265/HEVC.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in video size calculations?",
      answer:
        "Bits (b) and bytes (B) are units of digital information where 8 bits equal 1 byte. Video bitrates are typically measured in kilobits per second (kbps), but file sizes are usually expressed in bytes or megabytes (MB). Accurate conversion between bits and bytes is crucial for precise file size estimation.",
    },
    {
      question: "Why do I need to consider container overhead in size estimation?",
      answer:
        "Container overhead refers to the additional data added by the video container format (like MP4 or MKV) for metadata, indexing, and synchronization. This overhead typically ranges from 2% to 10% of the total file size and affects the final file size beyond just the raw video and audio data.",
    },
    {
      question: "Can I use this calculator for codecs other than H.264?",
      answer:
        "Yes, this calculator estimates file size based on bitrate and duration, which applies to any codec including H.264, H.265, VP9, and AV1. However, different codecs achieve different quality at the same bitrate, so actual visual quality may vary.",
    },
    {
      question: "How does frame rate affect video file size?",
      answer:
        "Frame rate indirectly affects file size because higher frame rates usually require higher bitrates to maintain quality, increasing file size. However, this calculator focuses on bitrate and duration, so frame rate impact is reflected through the chosen bitrate value.",
    },
    {
      question: "What is SMPTE timecode and does it affect size estimation?",
      answer:
        "SMPTE timecode is a standard for labeling video frames with time information, including drop-frame and non-drop-frame formats. While important for editing and synchronization, SMPTE timecode does not directly affect file size estimation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Estimating the file size of a 10-minute H.264 compressed video with a bitrate of 5000 kbps and 5% container overhead.",
    steps: [
      {
        label: "Step 1: Convert duration to seconds",
        explanation: "10 minutes × 60 seconds = 600 seconds",
      },
      {
        label: "Step 2: Calculate total bits",
        explanation: "5000 kbps × 1000 × 600 seconds = 3,000,000,000 bits",
      },
      {
        label: "Step 3: Add container overhead",
        explanation: "3,000,000,000 bits × 1.05 (5%) = 3,150,000,000 bits",
      },
      {
        label: "Step 4: Convert bits to bytes",
        explanation: "3,150,000,000 bits ÷ 8 = 393,750,000 bytes",
      },
      {
        label: "Step 5: Convert bytes to megabytes",
        explanation: "393,750,000 bytes ÷ (1024 × 1024) ≈ 375.75 MB",
      },
    ],
    result: "Estimated file size is approximately 375.75 MB.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video synchronization.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Video Bitrate and Compression",
      description:
        "Comprehensive guide on how bitrate affects video quality and file size.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
    },
    {
      title: "Container Formats Explained",
      description:
        "Overview of common video container formats and their overhead.",
      url: "https://www.videomaker.com/article/c10/18988-video-containers-explained",
    },
    {
      title: "H.264 Video Compression Basics",
      description:
        "Technical details on the H.264 codec and its compression techniques.",
      url: "https://www.vcodex.com/h264.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bitrate">Video Bitrate (kbps)</Label>
          <Input
            id="bitrate"
            type="number"
            min="1"
            step="any"
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
            min="1"
            step="any"
            placeholder="e.g. 600"
            value={inputs.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overhead">Container Overhead (%)</Label>
          <Input
            id="overhead"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5"
            value={inputs.overheadPercent}
            onChange={(e) => handleInputChange("overheadPercent", e.target.value)}
          />
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
          <li>Enter the average video bitrate in kilobits per second (kbps). This is usually specified during encoding.</li>
          <li>Input the total duration of your video in seconds. Convert minutes or hours to seconds if needed.</li>
          <li>Specify the container overhead percentage, typically between 2% and 10%, to account for metadata and indexing.</li>
          <li>Click the Calculate button to estimate the compressed video file size in megabytes (MB).</li>
          <li>Review the result and consider adjusting bitrate or duration for your target file size or quality.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Compression Size Estimator (H.264/etc.)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Estimating the file size of a compressed video is essential for planning storage, bandwidth, and delivery workflows in professional video production and post-production. This calculator uses the fundamental relationship between bitrate, duration, and container overhead to provide an accurate size estimate for videos compressed with H.264 or similar codecs.
          </p>
          <p>
            Bitrate, measured in kilobits per second (kbps), represents the amount of data processed every second of video. Higher bitrates generally mean better quality but larger files. Duration is the total length of the video in seconds. Multiplying bitrate by duration gives the total number of bits in the video stream.
          </p>
          <p>
            However, video files are stored inside containers like MP4 or MKV, which add overhead for metadata, indexing, and synchronization. This overhead is typically a small percentage of the total file size, usually between 2% and 10%. Including this overhead in calculations ensures a more realistic estimate.
          </p>
          <p>
            The calculator converts total bits to bytes (8 bits = 1 byte) and then to megabytes (1 MB = 1024 * 1024 bytes) for user-friendly output. This approach assumes a constant bitrate encoding; variable bitrate (VBR) files may vary in size. Additionally, while codecs like H.265/HEVC offer better compression efficiency, this tool estimates size based on bitrate, so codec efficiency differences are not directly accounted for.
          </p>
          <p>
            By understanding these principles, video professionals can better manage storage requirements, optimize encoding settings, and ensure smooth delivery across platforms.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) leads to incorrect file size estimates. Always remember 8 bits = 1 byte.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring container overhead can underestimate file size by up to 10%, causing storage planning issues.
          </p>
          <p>
            <strong>Warning:</strong> Using average bitrate for variable bitrate (VBR) files may not reflect actual file size accurately.
          </p>
          <p>
            <strong>Warning:</strong> Not converting duration properly (e.g., mixing minutes and seconds) results in large calculation errors.
          </p>
          <p>
            <strong>Warning:</strong> Assuming all codecs compress equally at the same bitrate can mislead quality expectations.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
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
      title="Video Compression Size Estimator (H.264/etc.)"
      description="Professional video & audio calculator: Video Compression Size Estimator (H.264/etc.). Accurate technical formulas for production, post-production, and broadcasting."
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