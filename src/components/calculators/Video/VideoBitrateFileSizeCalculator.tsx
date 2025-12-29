import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VideoBitrateFileSizeCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in seconds or minutes (we'll use minutes input, convert to seconds)
    bitrate: "", // numeric value
    bitrateUnit: "Mbps", // Mbps or Gbps
    sizeUnit: "GB", // GB or TB output
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const durationMin = parseFloat(inputs.duration);
    const bitrateVal = parseFloat(inputs.bitrate);
    if (
      isNaN(durationMin) ||
      durationMin <= 0 ||
      isNaN(bitrateVal) ||
      bitrateVal <= 0
    ) {
      return {
        primary: "0",
        secondary: inputs.sizeUnit,
        details: "Please enter valid positive numbers for Duration and Bitrate.",
        feedback: "",
      };
    }

    // Convert duration to seconds
    const durationSec = durationMin * 60;

    // Convert bitrate to Mbps if needed
    let bitrateMbps = bitrateVal;
    if (inputs.bitrateUnit === "Gbps") {
      bitrateMbps = bitrateVal * 1000;
    }

    // Calculate size in Megabits: bitrate (Mbps) * duration (sec)
    const totalMegabits = bitrateMbps * durationSec;

    // Convert Megabits to Megabytes: divide by 8 (8 bits = 1 Byte)
    const totalMegaBytes = totalMegabits / 8;

    // Convert Megabytes to Gigabytes: divide by 1024
    const totalGigaBytes = totalMegaBytes / 1024;

    // Convert Gigabytes to Terabytes if needed
    let sizeOutput = totalGigaBytes;
    let unitOutput = "GB";
    if (inputs.sizeUnit === "TB") {
      sizeOutput = totalGigaBytes / 1024;
      unitOutput = "TB";
    }

    // Format output to 3 decimals max
    const formattedSize = sizeOutput.toFixed(3);

    const details = `Calculation: (${bitrateMbps} Mbps × ${durationSec} sec) ÷ 8 ÷ 1024 = ${formattedSize} ${unitOutput}`;

    const feedback =
      "Tip: Higher bitrates increase file size but improve image quality, preserving details like Chroma Subsampling and Dynamic Range.";

    return {
      primary: formattedSize,
      secondary: unitOutput,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in video bitrate?",
      answer:
        "Bits (b) and Bytes (B) are fundamental units of digital data. Video bitrate is typically measured in bits per second (bps), where 8 bits equal 1 byte. Understanding this distinction is crucial because file size calculations convert bits to bytes by dividing by 8, ensuring accurate storage estimations.",
    },
    {
      question: "How does Chroma Subsampling affect video bitrate and file size?",
      answer:
        "Chroma Subsampling reduces color information in video to save bandwidth, effectively lowering bitrate without drastically impacting perceived quality. This technique influences the data rate and consequently the file size, making it essential to consider when estimating storage needs for high-quality footage.",
    },
    {
      question: "Why is dynamic range important in video quality?",
      answer:
        "Dynamic Range refers to the range of luminance levels a video can capture, from darkest shadows to brightest highlights. Higher dynamic range requires more data to accurately represent subtle gradations, increasing bitrate and file size but resulting in richer, more detailed images.",
    },
    {
      question: "Can I use this calculator for audio bitrate calculations?",
      answer:
        "This calculator is specifically designed for video bitrate to file size conversions. Audio bitrates are generally much lower and calculated differently. For combined audio-video file size estimations, consider adding audio bitrate separately to the total video bitrate before using this tool.",
    },
    {
      question: "How does signal-to-noise ratio impact video bitrate?",
      answer:
        "Signal-to-Noise Ratio (SNR) measures the level of desired signal relative to background noise. Higher SNR means cleaner footage, which can be compressed more efficiently at lower bitrates. Conversely, noisy footage requires higher bitrates to maintain quality, affecting file size calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Shooting a 2-hour interview in 4K ProRes 422 at 150 Mbps bitrate.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert duration from hours to seconds: 2 hours × 60 minutes × 60 seconds = 7200 seconds.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate total megabits: 150 Mbps × 7200 sec = 1,080,000 Megabits.",
      },
      {
        label: "Step 3",
        explanation:
          "Convert megabits to megabytes: 1,080,000 ÷ 8 = 135,000 Megabytes.",
      },
      {
        label: "Step 4",
        explanation:
          "Convert megabytes to gigabytes: 135,000 ÷ 1024 ≈ 131.84 GB.",
      },
    ],
    result:
      "The final estimated file size is approximately 131.84 GB for the 2-hour 4K ProRes 422 interview.",
  };

  const references = [
    {
      title: "ARRI Formats & Data Rate Calculator",
      description: "Industry standard reference for professional video data rates.",
      url: "https://www.arri.com/en/learn-help/learn-help-camera/formats-and-data-rate-calculator",
    },
    {
      title: "RED Tools",
      description: "Comprehensive tools for RED cinema camera data rates and file sizes.",
      url: "https://www.red.com/tools",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 120"
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
            placeholder="e.g. 150"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <select
            id="bitrateUnit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
            value={inputs.bitrateUnit}
            onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
          >
            <option value="Mbps">Mbps</option>
            <option value="Gbps">Gbps</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="sizeUnit">Output Size Unit</Label>
        <select
          id="sizeUnit"
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
          value={inputs.sizeUnit}
          onChange={(e) => handleInputChange("sizeUnit", e.target.value)}
        >
          <option value="GB">GB</option>
          <option value="TB">TB</option>
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
          <li>Enter the total video duration in minutes. For example, a 2-hour video is 120 minutes.</li>
          <li>Input the video bitrate value and select the correct unit (Mbps or Gbps). Bitrate reflects the data rate of your video stream.</li>
          <li>Choose the output file size unit you want to see: Gigabytes (GB) or Terabytes (TB).</li>
          <li>Click the Calculate button to get the estimated file size based on your inputs.</li>
          <li>Review the detailed calculation and optimization tips to understand how bitrate affects file size and quality.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Bitrate ↔ File Size Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the relationship between video bitrate and file size is essential for professionals in video production, post-production, and broadcasting. Bitrate, measured in bits per second (bps), defines how much data is processed every second in a video stream. Higher bitrates generally mean better image quality because more data is available to represent details such as Chroma Subsampling, which compresses color information to save bandwidth without significantly degrading perceived quality.
          </p>
          <p>
            This calculator uses the fundamental formula: <em>File Size = (Bitrate × Duration) ÷ 8</em>, converting bits to bytes by dividing by 8, since 8 bits equal 1 byte. The duration must be in seconds to align with the bitrate's per-second measurement. The result is then converted into Gigabytes or Terabytes for practical storage estimation. This calculation assumes a constant bitrate (CBR) stream; variable bitrate (VBR) streams may vary in size.
          </p>
          <p>
            Factors like Dynamic Range and Signal-to-Noise Ratio (SNR) also influence bitrate requirements. High dynamic range footage captures more luminance detail, requiring higher bitrates to avoid banding and preserve subtle gradations. Similarly, footage with low SNR (noisy footage) demands higher bitrates to maintain quality, as noise complicates compression algorithms.
          </p>
          <p>
            By accurately estimating file sizes, professionals can better plan storage needs, data transfer times, and archiving strategies. This calculator is a practical tool to bridge technical understanding with real-world production workflows.
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
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) leads to file size miscalculations by a factor of 8. Always remember to divide total bits by 8 to convert to bytes.
          </p>
          <p>
            <strong>Warning:</strong> Inputting duration in hours or seconds inconsistently can cause errors. This calculator expects duration in minutes and converts internally to seconds.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring the bitrate unit (Mbps vs Gbps) can result in wildly inaccurate file size estimates. Always select the correct unit.
          </p>
          <p>
            <strong>Warning:</strong> Assuming constant bitrate for variable bitrate footage will only provide an approximation. VBR files can be smaller or larger depending on scene complexity.
          </p>
          <p>
            <strong>Warning:</strong> Not accounting for audio bitrate separately can underestimate total file size if audio is significant.
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
      title="Video Bitrate ↔ File Size Calculator"
      description="Professional video & audio calculator: Video Bitrate ↔ File Size Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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