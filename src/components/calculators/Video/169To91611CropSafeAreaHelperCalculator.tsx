import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundTo(value: number, decimals = 2) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

export default function 169To91611CropSafeAreaHelperCalculator() {
  const [inputs, setInputs] = useState({
    width: "", // 16:9 frame width in pixels
    height: "", // 16:9 frame height in pixels
    diagonal: "", // diagonal in pixels (optional)
    cropTarget: "9:16", // crop target aspect ratio: "9:16" or "1:1"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Core logic:
   * Given a 16:9 frame (width, height), calculate the crop dimensions and safe area for either 9:16 or 1:1.
   * 
   * Steps:
   * 1. Validate inputs.
   * 2. Calculate aspect ratios.
   * 3. For 9:16 crop (portrait), crop width and height inside the 16:9 frame.
   * 4. For 1:1 crop (square), crop width and height inside the 16:9 frame.
   * 5. Calculate safe area margins (typically 5% inset).
   * 6. Provide details and optimization tips.
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.width);
    const h = parseFloat(inputs.height);
    const d = parseFloat(inputs.diagonal);
    const cropTarget = inputs.cropTarget;

    if (!w || !h || w <= 0 || h <= 0) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers for width and height.",
        feedback: "",
      };
    }

    // Confirm input aspect ratio is close to 16:9
    const inputAspect = w / h;
    const targetAspect16_9 = 16 / 9;
    if (Math.abs(inputAspect - targetAspect16_9) > 0.05) {
      // Warn user input is not 16:9
      return {
        primary: "Warning",
        secondary: "",
        details:
          `Input resolution aspect ratio is ${roundTo(inputAspect, 3)} which is not close to 16:9 (1.778). Please verify inputs.`,
        feedback: "",
      };
    }

    // Define target crop aspect ratios
    const cropRatios: Record<string, number> = {
      "9:16": 9 / 16, // portrait vertical
      "1:1": 1,
    };

    const cropAspect = cropRatios[cropTarget];
    if (!cropAspect) {
      return {
        primary: "Error",
        secondary: "",
        details: "Invalid crop target selected.",
        feedback: "",
      };
    }

    // Calculate crop dimensions inside the 16:9 frame
    // We fit the crop aspect ratio inside the 16:9 frame by cropping width or height

    // Option 1: Fit crop height to input height, calculate crop width
    const cropWidthByHeight = h * cropAspect;
    // Option 2: Fit crop width to input width, calculate crop height
    const cropHeightByWidth = w / cropAspect;

    // Choose the crop size that fits inside the 16:9 frame
    let cropWidth: number, cropHeight: number;
    if (cropWidthByHeight <= w) {
      cropWidth = cropWidthByHeight;
      cropHeight = h;
    } else {
      cropWidth = w;
      cropHeight = cropHeightByWidth;
    }

    // Calculate safe area (typically 5% inset on all sides)
    const safeAreaInsetRatio = 0.05;
    const safeAreaWidth = cropWidth * (1 - 2 * safeAreaInsetRatio);
    const safeAreaHeight = cropHeight * (1 - 2 * safeAreaInsetRatio);

    // Calculate diagonal if not provided (for crop area)
    const cropDiagonal = Math.sqrt(cropWidth ** 2 + cropHeight ** 2);

    // If diagonal input provided, compare with calculated diagonal
    let diagonalFeedback = "";
    if (d && d > 0) {
      const inputDiagonal = d;
      const diagDiffPercent = ((inputDiagonal - cropDiagonal) / inputDiagonal) * 100;
      diagonalFeedback =
        diagDiffPercent > 5
          ? `Note: Input diagonal (${inputDiagonal}px) differs significantly from crop diagonal (${roundTo(
              cropDiagonal
            )}px).`
          : "";
    }

    return {
      primary: `${Math.round(cropWidth)} x ${Math.round(cropHeight)}`,
      secondary: `Crop resolution (${cropTarget})`,
      details: `Crop dimensions inside 16:9 frame: ${roundTo(cropWidth)}px width × ${roundTo(
        cropHeight
      )}px height. Safe area (5% inset): ${roundTo(safeAreaWidth)}px × ${roundTo(
        safeAreaHeight
      )}px. Diagonal: ${roundTo(cropDiagonal)}px. ${diagonalFeedback}`,
      feedback:
        "Ensure your crop respects the safe area to avoid important content being cut off on different displays.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is the input aspect ratio required to be close to 16:9?",
      answer:
        "This calculator is designed specifically for cropping from a 16:9 source frame. If your input resolution deviates significantly from 16:9, the crop calculations for 9:16 or 1:1 will not be accurate, as the base frame dimensions differ. Always verify your input resolution matches the expected aspect ratio for best results.",
    },
    {
      question: "What is the safe area and why is it important?",
      answer:
        "The safe area is a margin inset (commonly 5%) inside the crop frame to ensure critical visual elements are not cut off on various display devices or during broadcast. It accounts for overscan and display variations, protecting titles, logos, and important action within the frame.",
    },
    {
      question: "Can I use this calculator for non-pixel units?",
      answer:
        "This calculator assumes pixel-based inputs for width, height, and diagonal. If you use other units (e.g., inches, centimeters), convert them to pixels first based on your display or sensor resolution to maintain accuracy.",
    },
    {
      question: "How do I interpret the diagonal input?",
      answer:
        "The diagonal input is optional and helps verify the physical size or pixel diagonal of your frame. The calculator compares it with the computed crop diagonal to highlight discrepancies, ensuring your inputs are consistent and accurate.",
    },
    {
      question: "Why do the crop dimensions sometimes have decimals?",
      answer:
        "Aspect ratio calculations often result in fractional pixel values. While displays use whole pixels, these decimals help maintain precision in calculations. When applying crops, round to the nearest whole pixel for practical use.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 1920x1080 (16:9) video frame and want to crop it to a vertical 9:16 aspect ratio for social media stories, ensuring a safe area for titles.",
    steps: [
      {
        label: "Step 1: Confirm input resolution and aspect ratio",
        explanation:
          "Input width = 1920 px, height = 1080 px. Aspect ratio = 1920 / 1080 = 1.778 (16:9).",
      },
      {
        label: "Step 2: Calculate crop dimensions for 9:16",
        explanation:
          "Crop width by height: 1080 * (9/16) = 607.5 px. Since 607.5 < 1920, crop width = 607.5 px, crop height = 1080 px.",
      },
      {
        label: "Step 3: Calculate safe area (5% inset)",
        explanation:
          "Safe area width = 607.5 * 0.9 = 546.75 px, safe area height = 1080 * 0.9 = 972 px.",
      },
      {
        label: "Step 4: Calculate crop diagonal",
        explanation:
          "Diagonal = sqrt(607.5² + 1080²) ≈ 1226.3 px.",
      },
    ],
    result:
      "Crop resolution: 608 x 1080 px (rounded). Safe area: approximately 547 x 972 px. Use these dimensions to crop your 16:9 frame for vertical 9:16 content with safe margins.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for video and timecode formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Aspect Ratios in Video Production",
      description:
        "A comprehensive guide to aspect ratios and their impact on video framing and cropping.",
      url: "https://www.videomaker.com/article/c10/18710-understanding-aspect-ratios",
    },
    {
      title: "Safe Area Guidelines for Broadcast",
      description:
        "Technical recommendations for safe title and action areas in video production.",
      url: "https://www.broadcastpapers.com/safe-area-guidelines/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Width (pixels)</Label>
          <Input
            type="number"
            min={1}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 1920"
          />
        </div>
        <div className="space-y-2">
          <Label>Height (pixels)</Label>
          <Input
            type="number"
            min={1}
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
            value={inputs.diagonal}
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label>Crop Target Aspect Ratio</Label>
          <select
            className="w-full rounded border border-slate-300 dark:border-slate-700 px-3 py-2"
            value={inputs.cropTarget}
            onChange={(e) => handleInputChange("cropTarget", e.target.value)}
          >
            <option value="9:16">9:16 (Portrait)</option>
            <option value="1:1">1:1 (Square)</option>
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
            {results.feedback && (
              <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-400">{results.feedback}</p>
            )}
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
          <li>Enter the width of your 16:9 video frame in pixels (e.g., 1920).</li>
          <li>Enter the height of your 16:9 video frame in pixels (e.g., 1080).</li>
          <li>
            Optionally, enter the diagonal measurement in pixels to verify input consistency.
          </li>
          <li>Select the desired crop target aspect ratio: 9:16 for vertical video or 1:1 for square.</li>
          <li>Click "Calculate" to see the crop dimensions and safe area recommendations.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to 16:9 → 9:16/1:1 Crop & Safe Area Helper
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In modern video production, adapting content for multiple platforms is essential. The
            16:9 aspect ratio is the standard for most HD and UHD content, but social media and
            mobile platforms often require vertical (9:16) or square (1:1) formats. Cropping a
            16:9 frame to these ratios involves geometric calculations to preserve the intended
            composition without distortion.
          </p>
          <p>
            This calculator helps you determine the exact pixel dimensions for cropping a 16:9 frame
            into either 9:16 or 1:1 aspect ratios. It ensures the crop fits entirely within the
            original frame, avoiding any stretching or letterboxing. Additionally, it calculates a
            safe area inset, typically 5%, which is critical for broadcast and display compliance.
            The safe area protects important visual elements such as titles, logos, and action from
            being cut off due to overscan or display variations.
          </p>
          <p>
            The calculator also optionally accepts a diagonal measurement to cross-check your input
            dimensions. This is useful when working with physical screen sizes or sensor dimensions
            converted to pixels. The output includes detailed crop dimensions, safe area sizes, and
            diagonal lengths to guide your editing or live production setup.
          </p>
          <p>
            By using this tool, video engineers, editors, and DITs can streamline the process of
            preparing content for diverse viewing environments, ensuring professional quality and
            compliance with platform specifications.
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
            <strong>Warning:</strong> Entering input resolutions that are not close to 16:9 will
            produce inaccurate crop dimensions. Always verify your source frame's aspect ratio
            before using this calculator.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring the safe area can result in important content being
            cut off on different displays or broadcast systems. Always respect the recommended
            safe margins.
          </p>
          <p>
            <strong>Warning:</strong> Confusing bits (b) and bytes (B) or mixing units can lead to
            errors in calculations. This calculator assumes pixel units for all inputs.
          </p>
          <p>
            <strong>Warning:</strong> Rounding crop dimensions too aggressively before cropping can
            cause slight aspect ratio distortions. Use the calculator's precise values and round
            only at the final step.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Suppose you have a 1920x1080 (16:9) video frame and want to crop it to a vertical 9:16
            aspect ratio for social media stories. You want to ensure a 5% safe area margin for
            titles and logos.
          </p>
          <p>
            <strong>Step 1:</strong> Confirm input resolution and aspect ratio: 1920 / 1080 = 1.778,
            which matches 16:9.
          </p>
          <p>
            <strong>Step 2:</strong> Calculate crop width by height: 1080 × (9/16) = 607.5 pixels.
            Since 607.5 is less than 1920, crop width = 607.5 px, crop height = 1080 px.
          </p>
          <p>
            <strong>Step 3:</strong> Calculate safe area (5% inset): width = 607.5 × 0.9 = 546.75 px,
            height = 1080 × 0.9 = 972 px.
          </p>
          <p>
            <strong>Step 4:</strong> Calculate crop diagonal: √(607.5² + 1080²) ≈ 1226.3 pixels.
          </p>
          <p>
            <strong>Result:</strong> Crop resolution is approximately 608 x 1080 pixels (rounded),
            with a safe area of about 547 x 972 pixels. Use these dimensions to crop your 16:9 frame
            for vertical 9:16 content with safe margins.
          </p>
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
      title="16:9 → 9:16/1:1 Crop & Safe Area Helper"
      description="Professional video & audio calculator: 16:9 → 9:16/1:1 Crop & Safe Area Helper. Accurate technical formulas for production, post-production, and broadcasting."
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