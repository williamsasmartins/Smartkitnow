import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function UncompressedVideoSizeResolutionBitDepthCalculator() {
  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
    bitDepth: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only positive numbers or empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Logic:
   * Given Width (W), Height (H), Diagonal (D), and Bit Depth (BD),
   * if all three resolution inputs are provided, verify the ratio:
   *   D² ?= W² + H² (Pythagorean theorem)
   * If diagonal is missing, calculate it from W and H.
   * If width or height is missing, calculate from diagonal and ratio.
   * 
   * Then calculate total pixels = W × H
   * Total bits per frame = pixels × bitDepth
   * Convert bits to bytes: bits / 8
   */

  const results = useMemo(() => {
    const W = parseFloat(inputs.width);
    const H = parseFloat(inputs.height);
    const D = parseFloat(inputs.diagonal);
    const BD = parseInt(inputs.bitDepth);

    if (
      isNaN(W) ||
      isNaN(H) ||
      isNaN(BD) ||
      W <= 0 ||
      H <= 0 ||
      BD <= 0
    ) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details: "Please enter positive numbers for Width, Height, and Bit Depth.",
        feedback: "",
      };
    }

    // Validate or calculate diagonal if provided
    const diagonalCalc = Math.sqrt(W * W + H * H);

    if (!isNaN(D) && D > 0) {
      // Check if diagonal matches W and H within 1% tolerance
      const tolerance = 0.01;
      const diffRatio = Math.abs(D - diagonalCalc) / diagonalCalc;
      if (diffRatio > tolerance) {
        return {
          primary: "—",
          secondary: "Input mismatch",
          details: `Diagonal does not match Width and Height ratio (expected ~${diagonalCalc.toFixed(
            2
          )}). Please verify inputs.`,
          feedback: "",
        };
      }
    }

    // Calculate total pixels
    const totalPixels = W * H;

    // Total bits = pixels * bitDepth
    const totalBits = totalPixels * BD;

    // Convert bits to bytes
    const totalBytes = totalBits / 8;

    // Format results with commas and units
    const formatNumber = (num: number) =>
      num.toLocaleString(undefined, { maximumFractionDigits: 2 });

    return {
      primary: formatNumber(totalBytes),
      secondary: "Bytes per frame",
      details: `Resolution: ${W} × ${H} pixels, Bit Depth: ${BD} bits, Total bits: ${formatNumber(
        totalBits
      )} bits.`,
      feedback:
        "This size represents uncompressed video frame size. For storage or bandwidth, consider compression or frame rate.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is bit depth in video?",
      answer:
        "Bit depth refers to the number of bits used to represent the color of each pixel. Higher bit depth allows for more color precision and smoother gradients. Common bit depths are 8-bit, 10-bit, and 12-bit per channel. This calculator uses bit depth to determine the data size per pixel.",
    },
    {
      question: "Why is the diagonal input important?",
      answer:
        "The diagonal input helps verify the aspect ratio of the resolution using the Pythagorean theorem. It ensures the width and height inputs are consistent with the physical screen size or intended resolution ratio. If diagonal is missing, the calculator assumes width and height define the resolution.",
    },
    {
      question: "How do bits and bytes relate in this calculation?",
      answer:
        "Bits (b) are the smallest unit of digital data, while bytes (B) consist of 8 bits. This calculator computes total bits first (pixels × bit depth) and then converts to bytes by dividing by 8, providing a more practical size measurement for storage and memory.",
    },
    {
      question: "Does this calculator consider compression?",
      answer:
        "No. This calculator estimates the size of uncompressed video frames based on resolution and bit depth. Compression algorithms reduce file size significantly but are not accounted for here. Use this for raw data size estimation in production or post-production workflows.",
    },
    {
      question: "Can I use fractional values for width, height, or diagonal?",
      answer:
        "Yes, fractional values are accepted and useful for precise calculations, especially when working with non-integer resolutions or physical screen sizes. The calculator handles decimal inputs and performs geometric ratio checks accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the uncompressed frame size of a 1920×1080 Full HD video with 10-bit color depth.",
    steps: [
      {
        label: "Step 1: Input resolution",
        explanation: "Width = 1920 pixels, Height = 1080 pixels.",
      },
      {
        label: "Step 2: Calculate diagonal",
        explanation:
          "Diagonal = √(1920² + 1080²) = √(3,686,400 + 1,166,400) = √4,852,800 ≈ 2202.91 pixels.",
      },
      {
        label: "Step 3: Input bit depth",
        explanation: "Bit Depth = 10 bits per pixel.",
      },
      {
        label: "Step 4: Calculate total pixels",
        explanation: "Total pixels = 1920 × 1080 = 2,073,600 pixels.",
      },
      {
        label: "Step 5: Calculate total bits",
        explanation: "Total bits = 2,073,600 × 10 = 20,736,000 bits.",
      },
      {
        label: "Step 6: Convert bits to bytes",
        explanation: "Total bytes = 20,736,000 / 8 = 2,592,000 bytes (~2.59 MB).",
      },
    ],
    result:
      "Each uncompressed frame requires approximately 2.59 MB of storage.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for video and timecode formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Bit Depth in Video",
      description:
        "Detailed explanation of bit depth and its impact on video quality.",
      url: "https://www.videomaker.com/article/c10/18762-understanding-bit-depth-in-video",
    },
    {
      title: "Pythagorean Theorem",
      description:
        "Mathematical principle used to relate width, height, and diagonal.",
      url: "https://www.khanacademy.org/math/geometry/hs-geo-trig/hs-geo-pythagorean-theorem/a/pythagorean-theorem",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Width (pixels)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 1920"
          />
        </div>
        <div className="space-y-2">
          <Label>Height (pixels)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="e.g. 1080"
          />
        </div>
        <div className="space-y-2">
          <Label>Diagonal (pixels, optional)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.diagonal}
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
            placeholder="Optional for ratio check"
          />
        </div>
        <div className="space-y-2">
          <Label>Bit Depth (bits per pixel)</Label>
          <Input
            type="number"
            min={1}
            step={1}
            value={inputs.bitDepth}
            onChange={(e) => handleInputChange("bitDepth", e.target.value)}
            placeholder="e.g. 8, 10, 12"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
            <Separator className="my-4" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
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
          <li>
            Enter the <strong>Width</strong> of your video resolution in pixels.
          </li>
          <li>
            Enter the <strong>Height</strong> of your video resolution in pixels.
          </li>
          <li>
            Optionally, enter the <strong>Diagonal</strong> in pixels to verify
            the aspect ratio consistency.
          </li>
          <li>
            Enter the <strong>Bit Depth</strong> (bits per pixel), such as 8,
            10, or 12.
          </li>
          <li>
            Click <strong>Calculate</strong> to see the uncompressed video size
            per frame in bytes.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Uncompressed Video Size (Resolution × Bit Depth)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Uncompressed video size is a critical metric in video production,
            post-production, and broadcasting workflows. It represents the raw
            data size of a single video frame before any compression is applied.
            This size depends primarily on the video resolution (width × height)
            and the bit depth, which defines how many bits are used to represent
            each pixel's color information.
          </p>
          <p>
            The resolution is the total number of pixels in each frame, calculated
            by multiplying the width by the height. Bit depth, often 8, 10, or 12
            bits per pixel, determines the color precision and dynamic range of
            the video. Higher bit depths allow for more accurate color
            representation but increase the data size proportionally.
          </p>
          <p>
            This calculator also optionally accepts the diagonal measurement of the
            video frame in pixels. Using the Pythagorean theorem, it verifies that
            the width, height, and diagonal inputs are consistent, ensuring the
            aspect ratio is correct. This is particularly useful when working with
            physical display sizes or non-standard resolutions.
          </p>
          <p>
            The calculation process involves multiplying the total pixels by the
            bit depth to get the total bits per frame. Since 8 bits equal 1 byte,
            the total bits are divided by 8 to convert the size into bytes, a
            more practical unit for storage and memory considerations.
          </p>
          <p>
            Understanding uncompressed video size helps professionals estimate
            storage requirements, bandwidth needs, and processing power for
            handling raw video data. While uncompressed video offers the highest
            quality, it demands significant resources, making compression
            essential for distribution and archiving.
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
            <strong>Warning:</strong> Entering inconsistent width, height, and
            diagonal values can lead to incorrect results. Always verify the
            diagonal matches the resolution ratio using the Pythagorean theorem.
          </p>
          <p>
            <strong>Warning:</strong> Confusing bits (b) with bytes (B) will cause
            size miscalculations. Remember that 8 bits equal 1 byte.
          </p>
          <p>
            <strong>Warning:</strong> This calculator does not account for video
            compression or frame rate. The result is the size of a single
            uncompressed frame only.
          </p>
          <p>
            <strong>Warning:</strong> Using zero or negative values for any input
            will invalidate the calculation.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
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
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
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
      title="Uncompressed Video Size (Resolution × Bit Depth)"
      description="Professional video & audio calculator: Uncompressed Video Size (Resolution × Bit Depth). Accurate technical formulas for production, post-production, and broadcasting."
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