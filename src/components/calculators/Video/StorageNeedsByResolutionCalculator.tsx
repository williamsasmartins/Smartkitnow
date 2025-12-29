import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function StorageNeedsByResolutionCalculator() {
  const [inputs, setInputs] = useState({
    duration: "", // in minutes
    bitrate: "", // numeric value
    bitrateUnit: "Mbps" // Mbps or Gbps
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const durationMin = parseFloat(inputs.duration);
    const bitrateRaw = parseFloat(inputs.bitrate);
    const bitrateUnit = inputs.bitrateUnit;

    if (
      isNaN(durationMin) ||
      durationMin <= 0 ||
      isNaN(bitrateRaw) ||
      bitrateRaw <= 0
    ) {
      return {
        primary: "0",
        secondary: "GB",
        details: "Please enter valid positive numbers for duration and bitrate.",
        feedback: ""
      };
    }

    // Convert bitrate to Mbps if needed
    const bitrateMbps = bitrateUnit === "Gbps" ? bitrateRaw * 1000 : bitrateRaw;

    // Duration in seconds
    const durationSec = durationMin * 60;

    // Calculate size in Megabits: Mbps * seconds
    const sizeMegabits = bitrateMbps * durationSec;

    // Convert Megabits to Megabytes (divide by 8)
    const sizeMegaBytes = sizeMegabits / 8;

    // Convert to Gigabytes (divide by 1024)
    const sizeGB = sizeMegaBytes / 1024;

    // Convert to Terabytes if > 1024 GB
    let displaySize = sizeGB;
    let unit = "GB";
    if (sizeGB >= 1024) {
      displaySize = sizeGB / 1024;
      unit = "TB";
    }

    // Format to 2 decimals
    const formattedSize = displaySize.toFixed(2);

    return {
      primary: formattedSize,
      secondary: unit,
      details: `Duration: ${durationMin} min × Bitrate: ${bitrateRaw} ${bitrateUnit} → ${formattedSize} ${unit} storage needed.`,
      feedback:
        "Consider using efficient codecs with better compression and appropriate chroma subsampling to optimize storage without compromising quality."
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between bits and bytes in storage calculations?",
      answer:
        "Bits (b) and Bytes (B) are fundamental units of digital data, where 8 bits equal 1 byte. Bitrate is usually measured in bits per second (bps), while storage size is measured in bytes. When calculating storage needs from bitrate, it's essential to convert bits to bytes by dividing by 8 to get accurate file size estimations."
    },
    {
      question: "How does chroma subsampling affect storage requirements?",
      answer:
        "Chroma subsampling reduces the color information in video by sampling chroma channels at lower resolutions than luma, which decreases bitrate and storage needs. For example, 4:2:0 subsampling requires less storage than 4:4:4, but may reduce color fidelity and signal-to-noise ratio, impacting post-production flexibility."
    },
    {
      question: "Why is dynamic range important for storage calculations?",
      answer:
        "Dynamic range defines the range of luminance a video can capture. Higher dynamic range footage often requires higher bitrates to preserve subtle gradations and avoid banding artifacts. This increases storage needs, so understanding your camera's dynamic range helps in estimating accurate data rates."
    },
    {
      question: "Can I use this calculator for audio storage needs?",
      answer:
        "This calculator is designed for video storage needs based on bitrate and duration. Audio storage calculations require different parameters such as sample rate, bit depth, and channel count. For audio-specific calculations, use dedicated audio storage calculators."
    },
    {
      question: "How do I factor in multiple camera angles or backup recordings?",
      answer:
        "To estimate total storage for multiple camera angles or backups, calculate the storage need for one stream using this calculator, then multiply by the number of streams or backup copies. Always add a safety margin to accommodate metadata, audio tracks, and unexpected overhead."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Shooting a 2-hour interview in 4K ProRes 422 HQ at 220 Mbps bitrate.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Convert duration to seconds: 2 hours × 60 minutes × 60 seconds = 7200 seconds."
      },
      {
        label: "Step 2",
        explanation:
          "Calculate total megabits: 220 Mbps × 7200 seconds = 1,584,000 Megabits."
      },
      {
        label: "Step 3",
        explanation:
          "Convert megabits to megabytes: 1,584,000 / 8 = 198,000 Megabytes."
      },
      {
        label: "Step 4",
        explanation:
          "Convert megabytes to gigabytes: 198,000 / 1024 ≈ 193.36 GB."
      }
    ],
    result:
      "Total storage needed ≈ 193.36 GB for the 2-hour 4K ProRes 422 HQ interview."
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
    },
    {
      title: "Understanding Chroma Subsampling",
      description:
        "Detailed explanation of chroma subsampling and its impact on video quality and storage.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456"
    },
    {
      title: "Video Bitrate and Storage Explained",
      description:
        "Comprehensive guide on how bitrate affects video storage and quality.",
      url: "https://www.videomaker.com/article/c10/18778-video-bitrate-and-storage-explained"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="0"
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
            min="0"
            step="any"
            placeholder="e.g. 220"
            value={inputs.bitrate}
            onChange={(e) => handleInputChange("bitrate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bitrateUnit">Bitrate Unit</Label>
          <select
            id="bitrateUnit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2"
            value={inputs.bitrateUnit}
            onChange={(e) => handleInputChange("bitrateUnit", e.target.value)}
          >
            <option value="Mbps">Mbps</option>
            <option value="Gbps">Gbps</option>
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
          <li>Enter the total duration of your video content in minutes. This should be the final runtime of your footage.</li>
          <li>Input the average bitrate of your video stream. This is typically provided by your codec or camera specifications and is measured in Mbps or Gbps.</li>
          <li>Select the unit for the bitrate (Mbps or Gbps) to ensure accurate calculations.</li>
          <li>Click the Calculate button to see the estimated storage size required for your footage, displayed in GB or TB depending on the size.</li>
          <li>Use the detailed explanation and tips to optimize your storage planning and workflow.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Storage Needs by Resolution & Length
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating storage needs for video production is a critical step in planning your workflow, especially when working with high-resolution footage such as 4K, 6K, or 8K. The primary factor influencing storage requirements is the bitrate, which represents the amount of data processed per second. Bitrate is affected by codec efficiency, chroma subsampling, dynamic range, and signal-to-noise ratio. For example, footage with higher dynamic range and less chroma subsampling (like 4:4:4) demands higher bitrates to preserve image fidelity, resulting in larger file sizes.
          </p>
          <p>
            This calculator uses a straightforward formula based on bitrate and duration: it multiplies the bitrate (in Mbps or Gbps) by the total duration in seconds, then converts bits to bytes by dividing by 8. The result is then converted into gigabytes or terabytes for easier understanding. This method assumes a constant bitrate throughout the footage, which is typical for many professional codecs like ProRes or DNxHR.
          </p>
          <p>
            When planning storage, always consider additional factors such as audio tracks, metadata, and backup copies. Also, be aware that variable bitrate (VBR) footage may require a buffer in your calculations to avoid running out of space. Understanding the relationship between bitrate, resolution, and length helps you optimize your storage investment and ensures smooth post-production workflows.
          </p>
          <p>
            Remember, efficient compression techniques and appropriate chroma subsampling can significantly reduce storage needs without compromising visual quality. Always test your workflow with sample footage to validate your storage calculations.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) is a frequent error that leads to underestimating storage needs by a factor of 8. Always ensure you convert bitrate from bits per second to bytes per second by dividing by 8 when calculating file sizes.
          </p>
          <p>
            <strong>Warning:</strong> Using average bitrate values without accounting for variable bitrate spikes can cause storage shortages during recording. Always add a safety margin of 10-20% to your calculated storage.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring additional data streams such as multi-channel audio, metadata, and LUTs can result in insufficient storage planning.
          </p>
          <p>
            <strong>Warning:</strong> Not considering the impact of chroma subsampling and codec compression efficiency may lead to inaccurate bitrate assumptions.
          </p>
          <p>
            <strong>Warning:</strong> Forgetting to convert duration into seconds before calculation will produce incorrect results.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> {example.scenario}</p>
          {example.steps.map((step, i) => (
            <p key={i}><strong>{step.label}:</strong> {step.explanation}</p>
          ))}
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
      title="Storage Needs by Resolution & Length"
      description="Professional video & audio calculator: Storage Needs by Resolution & Length. Accurate technical formulas for production, post-production, and broadcasting."
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