import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AspectRatio169To91611CropSafeAreaHelperCalculator() {
  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numeric input or empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Core logic:
   * Given a 16:9 frame (Width, Height, Diagonal),
   * calculate the crop dimensions and safe areas for 9:16 (vertical) and 1:1 (square) aspect ratios.
   *
   * We assume the input frame is 16:9.
   * 
   * Outputs:
   * - Crop dimensions for 9:16 (portrait) crop inside the 16:9 frame.
   * - Crop dimensions for 1:1 (square) crop inside the 16:9 frame.
   * - Safe area guides (e.g. 80% safe area inside each crop).
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.width);
    const h = parseFloat(inputs.height);
    const d = parseFloat(inputs.diagonal);

    // Validate inputs: at least width and height must be positive
    if (!(w > 0 && h > 0)) {
      return {
        primary: "Please enter valid Width and Height.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Confirm input aspect ratio is close to 16:9 (1.777...)
    const inputAspect = w / h;
    const targetAspect = 16 / 9;
    const aspectTolerance = 0.05; // 5% tolerance

    if (Math.abs(inputAspect - targetAspect) > aspectTolerance) {
      return {
        primary: "Warning: Input aspect ratio is not close to 16:9.",
        secondary: `Input aspect ratio: ${inputAspect.toFixed(3)}`,
        details:
          "This calculator assumes the input frame is 16:9. Results may be inaccurate otherwise.",
        feedback: "",
      };
    }

    // Calculate diagonal if missing
    let diagonal = d;
    if (!(d > 0)) {
      diagonal = Math.sqrt(w * w + h * h);
    }

    // === 9:16 Crop inside 16:9 frame ===
    // 9:16 aspect ratio = 0.5625 (width/height)
    // We want to find the largest 9:16 rectangle inside the 16:9 frame.
    // Since 9:16 is taller than 16:9, height will be limited by frame height,
    // width will be smaller than frame width.

    const aspect916 = 9 / 16;

    // Option 1: Fit height, calculate width
    const cropHeight916 = h;
    const cropWidth916 = cropHeight916 * aspect916;

    // Check if cropWidth916 fits inside frame width
    // It should always fit because 9:16 is narrower than 16:9
    // But let's confirm:
    if (cropWidth916 > w) {
      // If not, fit width instead
      const cropWidthAlt = w;
      const cropHeightAlt = cropWidthAlt / aspect916;
      // Use alternative
      // This is unlikely but safe fallback
      // (usually cropHeight916 = h is limiting)
      // So swap
      // Use cropWidthAlt and cropHeightAlt
      // But this is rare
      // We'll assign:
      // cropWidth916 = cropWidthAlt
      // cropHeight916 = cropHeightAlt
      // (for completeness)
      // But in practice, this won't happen for 16:9 input
      return {
        primary: "Input frame too narrow for 9:16 crop.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // === 1:1 Crop inside 16:9 frame ===
    // Square crop: width = height = min(frame width, frame height)
    const cropSize11 = Math.min(w, h);

    // === Safe Areas ===
    // Common safe area is 80% inside the crop
    const safeAreaRatio = 0.8;

    // Safe area for 9:16 crop
    const safeWidth916 = cropWidth916 * safeAreaRatio;
    const safeHeight916 = cropHeight916 * safeAreaRatio;

    // Safe area for 1:1 crop
    const safeSize11 = cropSize11 * safeAreaRatio;

    // Format results nicely
    const formatPx = (val: number) => `${val.toFixed(0)} px`;

    const details = `
Input Frame: ${w} x ${h} px (Diagonal: ${diagonal.toFixed(2)} px)
16:9 Aspect Ratio: ${targetAspect.toFixed(3)}

9:16 Crop:
- Crop Size: ${formatPx(cropWidth916)} x ${formatPx(cropHeight916)}
- Safe Area (80%): ${formatPx(safeWidth916)} x ${formatPx(safeHeight916)}

1:1 Crop:
- Crop Size: ${formatPx(cropSize11)} x ${formatPx(cropSize11)}
- Safe Area (80%): ${formatPx(safeSize11)} x ${formatPx(safeSize11)}
`;

    return {
      primary: "Crop & Safe Area Dimensions Calculated",
      secondary: "See details below",
      details: details.trim(),
      feedback:
        "Use these crop dimensions to frame your shots or guides in post-production for vertical (9:16) or square (1:1) formats from a 16:9 source.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does this calculator assume a 16:9 input aspect ratio?",
      answer:
        "This calculator is designed specifically for workflows starting with a 16:9 frame, which is the most common widescreen video format. Using this assumption allows precise calculation of crop dimensions for vertical (9:16) and square (1:1) outputs. If your input frame differs significantly, results may not be accurate.",
    },
    {
      question: "Can I use this calculator if I only know the diagonal size?",
      answer:
        "While the diagonal can help confirm the frame size, this calculator requires width and height inputs to accurately compute crop dimensions and safe areas. If you only know the diagonal, try to measure or estimate width and height based on the 16:9 ratio.",
    },
    {
      question: "What is a safe area and why is 80% used?",
      answer:
        "A safe area is a margin inside the frame where important content should be placed to avoid being cut off on different displays or during cropping. The 80% safe area is a common industry standard that provides a comfortable buffer zone to ensure critical elements remain visible.",
    },
    {
      question: "How do I apply these crop dimensions in editing software?",
      answer:
        "You can use the calculated crop dimensions as guides to set crop or mask layers in your video editing or compositing software. This ensures your content fits perfectly within vertical or square aspect ratios when repurposing 16:9 footage.",
    },
    {
      question: "What if my input aspect ratio is not exactly 16:9?",
      answer:
        "If your input frame deviates significantly from 16:9, the crop calculations may not be accurate. The calculator will warn you if the aspect ratio is outside a 5% tolerance. For other aspect ratios, consider using a dedicated crop calculator tailored to your source format.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 1920x1080 (16:9) video frame and want to create vertical (9:16) and square (1:1) crops for social media.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the width (1920) and height (1080) of your 16:9 frame into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "The calculator computes the largest 9:16 and 1:1 crops that fit inside the 16:9 frame, along with 80% safe areas.",
      },
      {
        label: "Step 3",
        explanation:
          "Use the provided crop dimensions and safe areas as guides for framing or cropping your footage in editing software.",
      },
    ],
    result:
      "You get a 9:16 crop of approximately 607x1080 px and a 1:1 crop of 1080x1080 px, with safe areas inside each to keep important content visible.",
  };

  const references = [
    {
      title: "Understanding Aspect Ratios in Video Production",
      description:
        "A comprehensive guide on aspect ratios and their impact on framing and cropping in video workflows.",
      url: "https://www.videomaker.com/article/c10/18753-understanding-aspect-ratios",
    },
    {
      title: "Safe Area Guidelines for Broadcast and Streaming",
      description:
        "Industry standards and best practices for safe areas in video production to ensure content visibility.",
      url: "https://www.broadcastpix.com/blog/what-is-safe-area-in-video-production/",
    },
    {
      title: "Crop and Resize Video for Social Media",
      description:
        "Tutorial on how to crop and resize videos for different social media aspect ratios like 9:16 and 1:1.",
      url: "https://www.techsmith.com/blog/video-aspect-ratio/",
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
            placeholder="Optional"
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
          <CardContent className="p-6 text-center whitespace-pre-line">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-3xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <Separator className="my-4" />
            <p className="text-xs text-slate-500 mt-2 whitespace-pre-line">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">{results.feedback}</p>
              </>
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
          <li>Enter the width and height of your 16:9 video frame in pixels.</li>
          <li>
            Optionally, enter the diagonal size in pixels if known; otherwise, it will be calculated.
          </li>
          <li>Click the Calculate button to generate crop dimensions for 9:16 and 1:1 aspect ratios.</li>
          <li>
            Review the crop sizes and safe area dimensions provided in the results section.
          </li>
          <li>
            Use these values as guides for cropping or framing your video in editing or post-production.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to 16:9 → 9:16/1:1 Crop & Safe Area Helper
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            In modern video production, repurposing content across multiple platforms often requires
            changing aspect ratios. The most common source format is 16:9 widescreen, but social media
            platforms frequently use vertical (9:16) or square (1:1) formats. This calculator helps
            professionals and content creators determine the optimal crop dimensions and safe areas
            when converting from 16:9 to these alternative aspect ratios.
          </p>
          <p>
            The calculator assumes your input frame is 16:9, a standard aspect ratio for HD and UHD
            video. By entering the frame's width and height in pixels, the tool calculates the largest
            possible 9:16 and 1:1 crops that fit entirely within the original frame without distortion.
            This ensures no unwanted stretching or black bars appear in the cropped output.
          </p>
          <p>
            Additionally, the calculator provides safe area dimensions, typically set at 80% of the crop
            size. Safe areas are critical in video production to ensure that important visual elements,
            such as titles, logos, or subjects, are not cut off or obscured on different display devices
            or during further cropping.
          </p>
          <p>
            Using these calculated crop and safe area dimensions, editors and DITs can confidently frame
            shots or set cropping guides in post-production software. This streamlines workflows,
            reduces guesswork, and helps maintain consistent visual quality across multiple aspect ratios.
          </p>
          <p>
            Remember, this calculator is optimized for 16:9 input frames. If your source footage uses a
            different aspect ratio, results may not be accurate, and you should use a calculator tailored
            to your specific format.
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
            <strong>Warning:</strong> Entering incorrect or incomplete input values, such as missing width
            or height, will prevent accurate calculations. Always ensure your input frame is close to 16:9
            aspect ratio to get reliable results.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring the safe area recommendations can lead to important content
            being cropped out or obscured on different devices or platforms. Always respect the safe area
            margins when framing your shots.
          </p>
          <p>
            <strong>Warning:</strong> Using this calculator for non-16:9 source footage without adjustment
            can produce misleading crop dimensions. Verify your source aspect ratio before relying on the
            results.
          </p>
          <p>
            <strong>Warning:</strong> Not accounting for pixel aspect ratio (PAR) differences in some video
            formats may cause slight inaccuracies. This calculator assumes square pixels.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 prose prose-slate dark:prose-invert max-w-none">
          <p>
            <strong>Scenario:</strong> You have a 1920x1080 (16:9) video frame and want to create vertical
            (9:16) and square (1:1) crops for social media platforms like Instagram and TikTok.
          </p>
          <p>
            <strong>Steps:</strong>
          </p>
          <ol>
            <li>Enter width = 1920 and height = 1080 pixels into the calculator.</li>
            <li>Click Calculate to get the crop and safe area dimensions.</li>
            <li>Use the provided dimensions to set crop guides in your editing software.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator outputs a 9:16 crop of approximately 607x1080 pixels and a
            1:1 crop of 1080x1080 pixels, with safe areas inside each crop to keep important content visible.
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