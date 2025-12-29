import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function 169To91611CropSafeAreaHelperCalculator() {
  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Core logic:
   * Given a 16:9 source resolution (width, height, diagonal), calculate:
   * 1) The crop dimensions for 9:16 (vertical video) and 1:1 (square) crops.
   * 2) Safe area guides for title/action safe zones inside those crops.
   *
   * Assumptions:
   * - Inputs are in pixels or any consistent unit.
   * - If diagonal is given, width and height can be derived if one dimension is missing.
   * - If only width and height given, diagonal is calculated.
   * - Safe area is typically 90% of the crop area (can be adjusted).
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.width);
    const h = parseFloat(inputs.height);
    const d = parseFloat(inputs.diagonal);

    if ((!w && !h) || (w && h && w / h !== 16 / 9 && w / h !== 9 / 16)) {
      return {
        primary: "Invalid input",
        secondary: "",
        details:
          "Please enter valid Width and Height with a 16:9 aspect ratio (or provide diagonal with one dimension).",
        feedback: "",
      };
    }

    // Calculate missing dimension if diagonal is provided
    let width = w;
    let height = h;
    let diagonal = d;

    if (d && (!w || !h)) {
      // Use aspect ratio 16:9 to find missing dimension
      // diagonal^2 = width^2 + height^2
      // height = width * 9/16
      // diagonal^2 = width^2 + (width * 9/16)^2 = width^2 (1 + (81/256)) = width^2 * (337/256)
      // width = diagonal / sqrt(337/256)
      const ratioSquared = (16 * 16) + (9 * 9); // 256 + 81 = 337
      width = d / Math.sqrt(ratioSquared / (16 * 16));
      height = (width * 9) / 16;
    } else if (w && h && !d) {
      diagonal = Math.sqrt(w * w + h * h);
    }

    // Confirm aspect ratio is 16:9 or 9:16 (tolerate small float errors)
    const aspectRatio = width / height;
    const isLandscape = Math.abs(aspectRatio - 16 / 9) < 0.01;
    const isPortrait = Math.abs(aspectRatio - 9 / 16) < 0.01;

    if (!isLandscape && !isPortrait) {
      return {
        primary: "Invalid aspect ratio",
        secondary: "",
        details:
          "Input dimensions must be 16:9 (landscape) or 9:16 (portrait) aspect ratio.",
        feedback: "",
      };
    }

    // Calculate 9:16 crop from 16:9 source:
    // For 9:16 crop, width_crop = height_source * 9/16, height_crop = height_source (portrait)
    // For 1:1 crop, crop is square with side = min(width_source, height_source)
    // Safe area: 90% of crop dimensions (typical title safe margin)

    // 9:16 crop dimensions (portrait)
    const crop9_16_height = height;
    const crop9_16_width = (crop9_16_height * 9) / 16;

    // 1:1 crop dimensions (square)
    const crop1_1_side = Math.min(width, height);

    // Safe area (90%)
    const safeAreaFactor = 0.9;

    const safe9_16_width = crop9_16_width * safeAreaFactor;
    const safe9_16_height = crop9_16_height * safeAreaFactor;

    const safe1_1_side = crop1_1_side * safeAreaFactor;

    // Format results nicely with rounding
    const fmt = (num: number) => Math.round(num);

    return {
      primary: (
        <>
          <div>
            <strong>9:16 Crop:</strong> {fmt(crop9_16_width)} × {fmt(crop9_16_height)} px
          </div>
          <div>
            <strong>9:16 Safe Area:</strong> {fmt(safe9_16_width)} × {fmt(safe9_16_height)} px
          </div>
          <div className="mt-3">
            <strong>1:1 Crop:</strong> {fmt(crop1_1_side)} × {fmt(crop1_1_side)} px
          </div>
          <div>
            <strong>1:1 Safe Area:</strong> {fmt(safe1_1_side)} × {fmt(safe1_1_side)} px
          </div>
        </>
      ),
      secondary: "Pixels (px)",
      details: `Source: ${fmt(width)} × ${fmt(height)} px, Diagonal: ${fmt(diagonal)} px. Safe area is 90% of crop dimensions.`,
      feedback:
        "Use these crop and safe area dimensions to frame your content correctly for vertical (9:16) and square (1:1) formats from a 16:9 source.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is the safe area smaller than the crop area?",
      answer:
        "The safe area is a margin inside the crop area designed to keep important visual elements like titles and graphics within visible bounds on all screens. Typically, it is about 90% of the crop size to prevent clipping on various display devices.",
    },
    {
      question: "Can I use this calculator for non-16:9 source footage?",
      answer:
        "This calculator is optimized for 16:9 source aspect ratios. Using it with other aspect ratios may produce inaccurate crop and safe area dimensions. For other ratios, consider using a dedicated calculator or manual calculations based on your source.",
    },
    {
      question: "How do I use the diagonal input?",
      answer:
        "If you know the diagonal measurement of your video frame (in pixels or any unit), you can enter it along with either width or height. The calculator will compute the missing dimension assuming a 16:9 aspect ratio, helping when only partial data is available.",
    },
    {
      question: "What is the difference between 9:16 and 1:1 crops?",
      answer:
        "A 9:16 crop is a vertical video format commonly used for mobile and social media stories, while a 1:1 crop is a square format often used for social media posts. This calculator provides dimensions for both crops derived from a 16:9 source.",
    },
    {
      question: "Why is aspect ratio validation important?",
      answer:
        "Ensuring the input dimensions conform to a 16:9 aspect ratio is crucial because the crop calculations depend on this ratio. Incorrect aspect ratios can lead to wrong crop sizes and unsafe framing, affecting the final video quality and presentation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 1920×1080 (16:9) video and want to create vertical (9:16) and square (1:1) versions with safe areas for social media.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the source width as 1920 and height as 1080 pixels.",
      },
      {
        label: "Step 2",
        explanation:
          "Click Calculate to get the crop and safe area dimensions for 9:16 and 1:1 formats.",
      },
      {
        label: "Step 3",
        explanation:
          "Use the provided crop sizes to frame your vertical and square edits, and keep titles within the safe areas to avoid clipping.",
      },
    ],
    result:
      "The calculator outputs a 9:16 crop of 607×1080 px with a safe area of 546×972 px, and a 1:1 crop of 1080×1080 px with a safe area of 972×972 px.",
  };

  const references = [
    {
      title: "Understanding Aspect Ratios in Video Production",
      description:
        "A comprehensive guide on aspect ratios and their impact on video framing and cropping.",
      url: "https://www.videomaker.com/article/c10/18994-understanding-aspect-ratios",
    },
    {
      title: "Safe Area Guidelines for Broadcast and Streaming",
      description:
        "Official recommendations for title and action safe areas in video production.",
      url: "https://www.broadcastingcable.com/post-type-the-wire/understanding-title-safe-and-action-safe-areas",
    },
    {
      title: "Social Media Video Aspect Ratios Explained",
      description:
        "How to optimize video aspect ratios for different social media platforms.",
      url: "https://sproutsocial.com/insights/social-media-video-specs/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Width (px)</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={inputs.width}
            placeholder="e.g. 1920"
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Height (px)</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={inputs.height}
            placeholder="e.g. 1080"
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Diagonal (optional)</Label>
          <Input
            type="text"
            inputMode="decimal"
            value={inputs.diagonal}
            placeholder="Optional"
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-2xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 italic text-sm text-blue-700">{results.feedback}</p>
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
          <li>Enter the Width and Height of your 16:9 source video in pixels.</li>
          <li>
            Optionally, enter the Diagonal length if you only know one dimension and diagonal.
          </li>
          <li>Click the Calculate button to generate crop and safe area dimensions.</li>
          <li>
            Review the 9:16 (vertical) and 1:1 (square) crop sizes along with their safe areas.
          </li>
          <li>
            Use these dimensions to frame your video edits and ensure important content stays within safe zones.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to 16:9 → 9:16/1:1 Crop & Safe Area Helper
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            In modern video production, adapting content for various aspect ratios is essential,
            especially with the rise of vertical video formats on social media platforms. This
            calculator assists professionals in converting a standard 16:9 video frame into vertical
            9:16 and square 1:1 crops, while also providing safe area dimensions to ensure critical
            visual elements remain visible across devices.
          </p>
          <p>
            The 16:9 aspect ratio is the most common widescreen format used in television, cinema,
            and online video. However, vertical (9:16) and square (1:1) formats have become popular
            for mobile-first content. Cropping a 16:9 frame to these ratios requires precise
            calculations to maintain image quality and composition.
          </p>
          <p>
            This tool calculates the exact pixel dimensions for both 9:16 and 1:1 crops based on your
            input width, height, and optionally diagonal. It also computes safe areas, typically 90%
            of the crop size, which act as margins to keep titles, logos, and important action within
            viewable boundaries. Safe areas prevent clipping caused by overscan or device-specific
            cropping.
          </p>
          <p>
            By using this calculator, video engineers, editors, and DITs can streamline their workflow,
            ensuring content is correctly framed and optimized for multiple platforms without guesswork.
            This reduces rework and helps maintain professional broadcast standards.
          </p>
          <p>
            Remember, always verify your source aspect ratio before using this tool, as incorrect inputs
            may lead to inaccurate crop dimensions. This calculator assumes a 16:9 source frame for
            all calculations.
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
            <strong>Warning:</strong> Entering incorrect aspect ratios or mixing units (e.g., pixels
            with inches) will produce invalid results. Always ensure your input dimensions are in
            the same unit and correspond to a 16:9 aspect ratio.
          </p>
          <p>
            <strong>Warning:</strong> Neglecting the safe area margins can cause important titles or
            graphics to be cut off on some displays. Always use the safe area dimensions as a guide
            for placing critical content.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for non-16:9 sources will lead to
            inaccurate crops. For other aspect ratios, use a dedicated calculator or manual
            calculations.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a 1920×1080 (16:9) video and want to create vertical
            (9:16) and square (1:1) versions with safe areas for social media.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the source width as 1920 and height as 1080 pixels.</li>
            <li>Click Calculate to get the crop and safe area dimensions for 9:16 and 1:1 formats.</li>
            <li>
              Use the provided crop sizes to frame your vertical and square edits, and keep titles
              within the safe areas to avoid clipping.
            </li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator outputs a 9:16 crop of 607×1080 px with a safe
            area of 546×972 px, and a 1:1 crop of 1080×1080 px with a safe area of 972×972 px.
          </p>
        </div>
      </section>

      <section id="faq">
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