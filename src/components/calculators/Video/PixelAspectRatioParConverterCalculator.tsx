import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PixelAspectRatioParConverterCalculator() {
  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only positive numbers or empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Pixel Aspect Ratio (PAR) calculation logic:
   * Given Width (W), Height (H), and Diagonal (D) in pixels,
   * we calculate the pixel aspect ratio as the ratio of pixel width to pixel height.
   * 
   * Step 1: Calculate the physical aspect ratio (AR) from Width and Height:
   *   AR = W / H
   * 
   * Step 2: Calculate the pixel diagonal ratio (PDR) from Width, Height, and Diagonal:
   *   PDR = D / sqrt(W² + H²)
   * 
   * Step 3: The Pixel Aspect Ratio (PAR) is:
   *   PAR = (Pixel Width) / (Pixel Height) = AR / PDR²
   * 
   * Explanation:
   * - If pixels are square, diagonal = sqrt(W² + H²)
   * - If diagonal differs, pixels are non-square, and PAR adjusts accordingly.
   */

  const results = useMemo(() => {
    const W = parseFloat(inputs.width);
    const H = parseFloat(inputs.height);
    const D = parseFloat(inputs.diagonal);

    if (!W || !H || !D || W <= 0 || H <= 0 || D <= 0) {
      return {
        primary: "—",
        secondary: "Pixel Aspect Ratio",
        details: "Please enter valid positive numbers for Width, Height, and Diagonal.",
        feedback: "",
      };
    }

    // Calculate physical aspect ratio
    const AR = W / H;

    // Calculate ideal diagonal for square pixels
    const idealDiagonal = Math.sqrt(W * W + H * H);

    // Pixel diagonal ratio
    const PDR = D / idealDiagonal;

    // Pixel Aspect Ratio (PAR)
    // PAR = AR / (PDR^2)
    const PAR = AR / (PDR * PDR);

    // Format PAR as ratio with 3 decimals
    const PARrounded = PAR.toFixed(3);

    // Provide details
    const details = `Width: ${W}px, Height: ${H}px, Diagonal: ${D}px. ` +
      `Ideal diagonal (square pixels): ${idealDiagonal.toFixed(3)}px. ` +
      `Pixel Diagonal Ratio: ${PDR.toFixed(3)}. ` +
      `Calculated Pixel Aspect Ratio (PAR): ${PARrounded} (width/height).`;

    // Feedback tip
    const feedback =
      PAR > 1
        ? "Pixels are wider than tall (horizontal stretch)."
        : PAR < 1
        ? "Pixels are taller than wide (vertical stretch)."
        : "Pixels are square.";

    return {
      primary: PARrounded,
      secondary: "Pixel Aspect Ratio (width/height)",
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Pixel Aspect Ratio (PAR) and why is it important?",
      answer:
        "Pixel Aspect Ratio (PAR) defines the ratio of the width to the height of a single pixel in a digital image or video. It is crucial because non-square pixels can distort the displayed image if not properly accounted for during editing or playback. Understanding PAR ensures accurate scaling and aspect ratio preservation in video production and post-production workflows.",
    },
    {
      question: "How does Pixel Aspect Ratio differ from Display Aspect Ratio (DAR)?",
      answer:
        "Display Aspect Ratio (DAR) is the ratio of the displayed image's width to its height, while Pixel Aspect Ratio (PAR) refers to the shape of individual pixels. DAR depends on both the resolution and the pixel shape. For example, a 720x480 video can have a DAR of 16:9 if pixels are non-square, meaning the PAR is not 1:1.",
    },
    {
      question: "Can I calculate PAR if I only know width and height?",
      answer:
        "Knowing only width and height gives you the resolution aspect ratio but not the pixel aspect ratio. To calculate PAR accurately, you also need the diagonal measurement or additional info about pixel shape. Without diagonal or pixel shape data, you cannot determine if pixels are square or stretched.",
    },
    {
      question: "What happens if I use incorrect PAR values in video editing?",
      answer:
        "Using incorrect PAR values can cause videos to appear stretched or squished during playback or export. This leads to distorted images and inaccurate framing. Correct PAR ensures that the video maintains its intended proportions across different devices and platforms.",
    },
    {
      question: "Are pixels always square in modern digital video?",
      answer:
        "Most modern digital video formats use square pixels, especially HD and UHD resolutions. However, some standard definition formats and legacy systems use non-square pixels to achieve certain aspect ratios without changing resolution. Always verify PAR when working with older or broadcast formats.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the Pixel Aspect Ratio for a 720x480 SD video with a diagonal of 860 pixels to determine if pixels are square or stretched.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Width = 720 px, Height = 480 px, Diagonal = 860 px.",
      },
      {
        label: "Step 2: Calculate ideal diagonal for square pixels",
        explanation:
          "Ideal diagonal = sqrt(720² + 480²) = sqrt(518400 + 230400) = sqrt(748800) ≈ 865.96 px.",
      },
      {
        label: "Step 3: Calculate Pixel Diagonal Ratio (PDR)",
        explanation: "PDR = 860 / 865.96 ≈ 0.9928.",
      },
      {
        label: "Step 4: Calculate physical aspect ratio (AR)",
        explanation: "AR = 720 / 480 = 1.5.",
      },
      {
        label: "Step 5: Calculate Pixel Aspect Ratio (PAR)",
        explanation:
          "PAR = AR / (PDR²) = 1.5 / (0.9928²) = 1.5 / 0.9857 ≈ 1.522.",
      },
    ],
    result:
      "The Pixel Aspect Ratio is approximately 1.522, indicating pixels are slightly wider than tall, confirming non-square pixels typical for NTSC SD video.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for video and timecode formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Understanding Pixel Aspect Ratio",
      description:
        "Detailed explanation of pixel aspect ratio and its impact on video.",
      url: "https://www.videomaker.com/article/c10/18588-understanding-pixel-aspect-ratio",
    },
    {
      title: "Video Aspect Ratios Explained",
      description:
        "Comprehensive guide on aspect ratios including pixel and display ratios.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=123456",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Width (pixels)</Label>
          <Input
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 1920"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Height (pixels)</Label>
          <Input
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 1080"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Diagonal (pixels)</Label>
          <Input
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 2202"
            value={inputs.diagonal}
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
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-4" />
            <p className="text-sm font-medium text-blue-700">{results.feedback}</p>
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
          <li>Enter the Width of your video frame in pixels (e.g., 1920).</li>
          <li>Enter the Height of your video frame in pixels (e.g., 1080).</li>
          <li>Enter the Diagonal measurement of the frame in pixels (e.g., 2202).</li>
          <li>Click the "Calculate" button to compute the Pixel Aspect Ratio (PAR).</li>
          <li>
            Review the result and details to understand if your pixels are square or stretched.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Pixel Aspect Ratio (PAR) Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Pixel Aspect Ratio (PAR) is a fundamental concept in video production and post-production that defines the shape of individual pixels in a digital image or video frame. Unlike square pixels, which have a PAR of 1:1, non-square pixels have a PAR that differs from unity, meaning pixels are either wider or taller than they are high or wide respectively. This difference affects how images are displayed and can cause distortion if not properly accounted for.
          </p>
          <p>
            The PAR Converter calculator helps professionals determine the exact pixel aspect ratio by using three key inputs: the width, height, and diagonal of the video frame in pixels. The width and height define the resolution, while the diagonal measurement provides insight into the actual pixel shape by comparing it to the ideal diagonal length assuming square pixels. This geometric approach allows the calculation of the pixel diagonal ratio, which is then used to derive the PAR.
          </p>
          <p>
            Understanding and correctly calculating PAR is essential when working with legacy video formats such as NTSC or PAL standard definition, which often use non-square pixels to achieve specific display aspect ratios without changing resolution. Modern HD and UHD formats typically use square pixels, but verifying PAR ensures that footage is displayed correctly across different devices and editing software.
          </p>
          <p>
            This calculator also provides feedback on whether pixels are wider or taller, helping video engineers and DITs make informed decisions about scaling, conversion, and delivery formats. Accurate PAR calculation prevents common issues like stretched or squished images, preserving the artistic intent and technical quality of video content.
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
            <strong>Warning:</strong> One critical mistake is assuming pixels are always square, which can lead to incorrect scaling and distorted images. Always verify the pixel diagonal or consult format specifications before editing or converting footage.
          </p>
          <p>
            Another common error is mixing units or confusing pixel dimensions with display dimensions. Ensure all inputs are in pixels and correspond to the same frame or image.
          </p>
          <p>
            Avoid entering zero or negative values, as these invalidate the calculation and produce misleading results.
          </p>
          <p>
            Lastly, do not rely solely on width and height without diagonal data for PAR calculation, as this will not reveal pixel shape differences.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
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

      <section id="references" className="scroll-mt-24">
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
      title="Pixel Aspect Ratio (PAR) Converter"
      description="Professional video & audio calculator: Pixel Aspect Ratio (PAR) Converter. Accurate technical formulas for production, post-production, and broadcasting."
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