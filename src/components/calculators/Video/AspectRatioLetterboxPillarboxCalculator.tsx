import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AspectRatioLetterboxPillarboxCalculator() {
  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Core logic:
   * Given Width (W), Height (H), and Diagonal (D), calculate the aspect ratio,
   * then determine the letterbox or pillarbox dimensions to fit a target frame.
   * 
   * Steps:
   * 1. Calculate the aspect ratio from Width and Height.
   * 2. If Diagonal is provided, verify consistency or calculate missing dimension.
   * 3. Calculate the letterbox or pillarbox bars needed to fit content into a different aspect ratio frame.
   * 
   * For this calculator, we assume the user inputs Width and Height of the content,
   * and the Width and Height of the display frame (or vice versa).
   * 
   * Here, we calculate the letterbox/pillarbox bars needed to fit the content into a standard frame.
   * 
   * Since only 3 inputs are provided (Width, Height, Diagonal), we interpret:
   * - Width and Height: content resolution
   * - Diagonal: target display diagonal in pixels (optional)
   * 
   * We calculate the aspect ratio of the content and the display,
   * then compute the letterbox/pillarbox bars needed.
   */

  const results = useMemo(() => {
    const W = parseFloat(inputs.width);
    const H = parseFloat(inputs.height);
    const D = parseFloat(inputs.diagonal);

    if (!W || !H) {
      return {
        primary: "Please enter valid Width and Height.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate content aspect ratio
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(W, H);
    const aspectW = W / divisor;
    const aspectH = H / divisor;
    const aspectRatioStr = `${aspectW}:${aspectH}`;

    // Calculate diagonal from W and H if D not provided
    const calcDiagonal = Math.sqrt(W * W + H * H);

    // If diagonal provided, check consistency
    let diagonalCheck = "";
    if (D) {
      const diff = Math.abs(D - calcDiagonal);
      if (diff > 0.1) {
        diagonalCheck = `Warning: Provided diagonal (${D.toFixed(
          2
        )}) does not match calculated diagonal (${calcDiagonal.toFixed(2)}).`;
      } else {
        diagonalCheck = `Diagonal matches calculated value (${calcDiagonal.toFixed(2)}).`;
      }
    }

    // For letterbox/pillarbox calculation:
    // Assume user wants to fit content into a display frame with different aspect ratio.
    // We ask user to input target frame width and height (optional).
    // Since only 3 inputs, let's calculate the letterbox/pillarbox bars needed to fit content into a 16:9 frame.

    // Target frame 16:9
    const targetW = 16;
    const targetH = 9;

    // Calculate scale factors to fit content into target frame
    const scaleW = targetW / aspectW;
    const scaleH = targetH / aspectH;

    // Determine if letterbox or pillarbox is needed
    let letterbox = 0;
    let pillarbox = 0;
    let fitMode = "";

    if (scaleW < scaleH) {
      // Content is wider than target frame, letterbox bars needed (top/bottom)
      fitMode = "Letterbox";
      const scaledHeight = aspectH * scaleW;
      letterbox = targetH - scaledHeight;
    } else if (scaleH < scaleW) {
      // Content is taller than target frame, pillarbox bars needed (left/right)
      fitMode = "Pillarbox";
      const scaledWidth = aspectW * scaleH;
      pillarbox = targetW - scaledWidth;
    } else {
      fitMode = "No letterbox or pillarbox needed, perfect fit.";
    }

    // Convert bars to percentage of frame height or width
    const letterboxPercent = ((letterbox / targetH) * 100).toFixed(2);
    const pillarboxPercent = ((pillarbox / targetW) * 100).toFixed(2);

    let details = `Content Aspect Ratio: ${aspectRatioStr} (${(aspectW / aspectH).toFixed(
      3
    )}:1). Target Frame Aspect Ratio: 16:9 (1.778:1). ${diagonalCheck}`;

    let feedback = "";
    if (fitMode === "Letterbox") {
      feedback = `Add black bars on top and bottom totaling ${letterbox.toFixed(
        2
      )} units (${letterboxPercent}%) of the frame height.`;
    } else if (fitMode === "Pillarbox") {
      feedback = `Add black bars on left and right totaling ${pillarbox.toFixed(
        2
      )} units (${pillarboxPercent}%) of the frame width.`;
    } else {
      feedback = "No black bars needed, content fits perfectly.";
    }

    return {
      primary: fitMode,
      secondary: `Aspect Ratio: ${aspectRatioStr}`,
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between letterbox and pillarbox?",
      answer:
        "Letterbox adds black bars on the top and bottom of the video frame to fit wider content into a narrower display, preserving the aspect ratio. Pillarbox adds black bars on the left and right sides to fit taller content into a wider display. Both techniques prevent distortion by maintaining the original aspect ratio.",
    },
    {
      question: "How do I calculate the aspect ratio from resolution?",
      answer:
        "To calculate aspect ratio, divide the width and height by their greatest common divisor (GCD). For example, a resolution of 1920x1080 has a GCD of 120, so the aspect ratio is 16:9. This ratio represents the proportional relationship between width and height.",
    },
    {
      question: "Why is diagonal input important in aspect ratio calculations?",
      answer:
        "The diagonal measurement helps verify the consistency of the width and height inputs and can be used to calculate missing dimensions. It is especially useful when dealing with physical display sizes or when only diagonal size is known, ensuring accurate scaling and fitting of content.",
    },
    {
      question: "Can this calculator handle custom target frame sizes?",
      answer:
        "Currently, this calculator assumes a standard 16:9 target frame for letterbox/pillarbox calculations. For custom target frames, additional inputs would be required. Future versions may include this functionality to provide more flexible aspect ratio fitting options.",
    },
    {
      question: "What happens if the content and target frame have the same aspect ratio?",
      answer:
        "If both the content and the target frame share the same aspect ratio, no letterbox or pillarbox bars are needed. The content fits perfectly without distortion or cropping, maximizing the use of the display area.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Fitting a 1920x800 widescreen video into a standard 16:9 (1920x1080) display frame without distortion.",
    steps: [
      {
        label: "Step 1: Calculate content aspect ratio",
        explanation:
          "1920 and 800 have a GCD of 40, so aspect ratio is 48:20 or simplified to 12:5 (2.4:1).",
      },
      {
        label: "Step 2: Compare with target frame aspect ratio",
        explanation:
          "Target frame is 16:9 (1.778:1). Content is wider (2.4:1 > 1.778:1), so letterbox bars are needed.",
      },
      {
        label: "Step 3: Calculate letterbox bar size",
        explanation:
          "Scale width to 16 units, scaled height = (5 * 16) / 12 = 6.67 units. Letterbox bars = 9 - 6.67 = 2.33 units total (top + bottom).",
      },
      {
        label: "Step 4: Calculate percentage bars",
        explanation:
          "Letterbox bars percentage = (2.33 / 9) * 100 ≈ 25.9% of frame height.",
      },
    ],
    result:
      "Add black bars on top and bottom totaling 2.33 units or approximately 25.9% of the frame height to fit the video without distortion.",
  };

  const references = [
    {
      title: "SMPTE Standards",
      description: "Official standards for video and timecode formats.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Aspect Ratio Explained - Wikipedia",
      description: "Comprehensive explanation of aspect ratios in video and photography.",
      url: "https://en.wikipedia.org/wiki/Aspect_ratio_(image)",
    },
    {
      title: "Letterboxing and Pillarboxing - Techopedia",
      description: "Definitions and use cases for letterboxing and pillarboxing in video.",
      url: "https://www.techopedia.com/definition/32005/letterboxing",
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
          <Label>Diagonal (pixels, optional)</Label>
          <Input
            type="number"
            min={1}
            step="any"
            placeholder="e.g. 2202.9"
            value={inputs.diagonal}
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
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
            <p className="text-sm font-medium text-blue-700">{results.feedback}</p>
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
          <li>Enter the Width of your video content in pixels (e.g., 1920).</li>
          <li>Enter the Height of your video content in pixels (e.g., 1080).</li>
          <li>Optionally, enter the Diagonal in pixels if known to verify measurements.</li>
          <li>Click the Calculate button to determine if letterbox or pillarbox bars are needed.</li>
          <li>Review the results showing the aspect ratio and the size of black bars required to fit into a 16:9 frame.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Aspect Ratio Calculator (Letterbox/Pillarbox)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Aspect ratio is the proportional relationship between the width and height of an image or video frame. Maintaining the correct aspect ratio is crucial in video production and broadcasting to avoid distortion, stretching, or cropping of the content. When fitting video content into a display frame with a different aspect ratio, black bars are often added to preserve the original proportions. These black bars are known as letterbox (top and bottom) or pillarbox (left and right) bars.
          </p>
          <p>
            This calculator helps professionals determine whether letterboxing or pillarboxing is necessary when fitting content into a standard 16:9 display frame. By inputting the width and height of the content, the calculator computes the aspect ratio and compares it to the target frame. If the content is wider than the frame, letterbox bars are added; if taller, pillarbox bars are added. The calculator also optionally verifies the diagonal measurement to ensure input accuracy.
          </p>
          <p>
            Understanding these calculations is essential for video engineers, DITs, and post-production professionals to deliver content that looks correct on all devices and screens. This tool streamlines the process, providing clear guidance on how much padding is needed to maintain the integrity of the original video without distortion.
          </p>
          <p>
            Note that this calculator currently assumes a fixed target frame aspect ratio of 16:9, which is the most common standard for HD and UHD video. For other target aspect ratios, additional inputs and calculations would be necessary.
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
            <strong>Warning:</strong> Entering incorrect or inconsistent Width, Height, and Diagonal values can lead to inaccurate aspect ratio calculations and incorrect letterbox/pillarbox sizing. Always verify your input measurements carefully.
          </p>
          <p>
            <strong>Warning:</strong> Confusing pixels with physical units (inches, cm) or mixing resolution with display size can cause errors. This calculator assumes pixel dimensions for digital video frames.
          </p>
          <p>
            <strong>Warning:</strong> Assuming the target frame is always 16:9 may not apply to all projects. For non-standard display aspect ratios, this calculator's results may not be accurate.
          </p>
          <p>
            <strong>Warning:</strong> Not accounting for overscan or safe areas in broadcast can affect how letterbox/pillarbox bars appear on actual screens.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            <strong>Scenario:</strong> Fitting a 1920x800 widescreen video into a standard 16:9 (1920x1080) display frame without distortion.
          </p>
          <ol>
            <li>
              <strong>Calculate content aspect ratio:</strong> 1920 and 800 have a greatest common divisor (GCD) of 40, so the aspect ratio is 48:20 or simplified to 12:5 (2.4:1).
            </li>
            <li>
              <strong>Compare with target frame aspect ratio:</strong> Target frame is 16:9 (1.778:1). Content is wider (2.4:1 &gt; 1.778:1), so letterbox bars are needed.
            </li>
            <li>
              <strong>Calculate letterbox bar size:</strong> Scale width to 16 units, scaled height = (5 * 16) / 12 = 6.67 units. Letterbox bars = 9 - 6.67 = 2.33 units total (top + bottom).
            </li>
            <li>
              <strong>Calculate percentage bars:</strong> Letterbox bars percentage = (2.33 / 9) * 100 ≈ 25.9% of frame height.
            </li>
          </ol>
          <p>
            <strong>Result:</strong> Add black bars on top and bottom totaling 2.33 units or approximately 25.9% of the frame height to fit the video without distortion.
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
      title="Aspect Ratio Calculator (Letterbox/Pillarbox)"
      description="Professional video & audio calculator: Aspect Ratio Calculator (Letterbox/Pillarbox). Accurate technical formulas for production, post-production, and broadcasting."
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