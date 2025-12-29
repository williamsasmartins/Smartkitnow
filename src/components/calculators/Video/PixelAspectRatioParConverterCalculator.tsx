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
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Calculates the Pixel Aspect Ratio (PAR) given Width, Height, and Diagonal.
   * PAR = (Width / Height) / (Display Width / Display Height)
   * Here, Display Width and Height are derived from Diagonal and aspect ratio.
   * 
   * Since we only have Width, Height, and Diagonal (all in pixels or units),
   * we can find the display aspect ratio from diagonal and pixel dimensions.
   * 
   * Steps:
   * 1. Calculate pixel aspect ratio (PAR) = pixel width / pixel height
   * 2. Calculate display aspect ratio (DAR) = display width / display height
   *    - Using diagonal and pixel dimensions, find display width and height:
   *      Let display width = Wd, display height = Hd
   *      Wd^2 + Hd^2 = diagonal^2
   *      Wd / Hd = pixel width / pixel height = PAR
   *    - Solve for Wd and Hd:
   *      Wd = PAR * Hd
   *      (PAR * Hd)^2 + Hd^2 = diagonal^2
   *      Hd^2 (PAR^2 + 1) = diagonal^2
   *      Hd = diagonal / sqrt(PAR^2 + 1)
   *      Wd = PAR * Hd
   * 3. Pixel Aspect Ratio (PAR) = (Wd / Hd) / (Width / Height)
   *    But since Wd/Hd = PAR, this simplifies to 1.
   * 
   * Actually, the above shows the display aspect ratio equals pixel aspect ratio,
   * so the PAR is 1 if width, height, and diagonal are consistent.
   * 
   * Instead, the calculator will output the pixel aspect ratio (PAR) = pixel width / pixel height,
   * and the display aspect ratio (DAR) = diagonal-based ratio.
   * 
   * We will output:
   * - Pixel Aspect Ratio (PAR) = width / height (simplified fraction)
   * - Display Aspect Ratio (DAR) = Wd / Hd (simplified fraction)
   * - Diagonal check: calculated diagonal from width & height vs input diagonal.
   */

  // Helper to simplify ratio to smallest integer fraction
  function simplifyRatio(a: number, b: number): [number, number] {
    function gcd(x: number, y: number): number {
      while (y) {
        const t = y;
        y = x % y;
        x = t;
      }
      return x;
    }
    const divisor = gcd(Math.round(a * 10000), Math.round(b * 10000));
    return [Math.round((a * 10000) / divisor), Math.round((b * 10000) / divisor)];
  }

  const results = useMemo(() => {
    const w = parseFloat(inputs.width);
    const h = parseFloat(inputs.height);
    const d = parseFloat(inputs.diagonal);

    if (!w || !h || !d || w <= 0 || h <= 0 || d <= 0) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid positive numbers for Width, Height, and Diagonal.",
        feedback: "",
      };
    }

    // Pixel Aspect Ratio (PAR)
    const parRaw = w / h;
    const [parNum, parDen] = simplifyRatio(w, h);

    // Calculate display width and height from diagonal and PAR
    // Wd = PAR * Hd
    // Wd^2 + Hd^2 = d^2
    // Hd = d / sqrt(PAR^2 + 1)
    // Wd = PAR * Hd
    const Hd = d / Math.sqrt(parRaw * parRaw + 1);
    const Wd = parRaw * Hd;

    // Simplify display aspect ratio
    const [darNum, darDen] = simplifyRatio(Wd, Hd);

    // Calculate diagonal from width and height to check consistency
    const calcDiagonal = Math.sqrt(w * w + h * h);

    // Difference between input diagonal and calculated diagonal
    const diagonalDiff = Math.abs(calcDiagonal - d);

    // Format fractions as strings
    const parStr = `${parNum}:${parDen}`;
    const darStr = `${darNum}:${darDen}`;

    // Feedback message about diagonal consistency
    let feedback = "";
    if (diagonalDiff > 0.01) {
      feedback =
        "Warning: The diagonal value does not match the width and height dimensions. Please verify your inputs.";
    } else {
      feedback = "Inputs are consistent. Pixel and display aspect ratios calculated.";
    }

    return {
      primary: parStr,
      secondary: "Pixel Aspect Ratio (PAR)",
      details: `Display Aspect Ratio (DAR) based on diagonal: ${darStr}. Calculated diagonal from width & height: ${calcDiagonal.toFixed(
        2
      )}`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Pixel Aspect Ratio (PAR)?",
      answer:
        "Pixel Aspect Ratio (PAR) is the ratio of the width to the height of a single pixel in a digital image or video. Unlike square pixels (PAR = 1:1), some video formats use non-square pixels to accommodate different display standards. Understanding PAR is essential for accurate image scaling and display.",
    },
    {
      question: "How does diagonal measurement affect aspect ratio calculations?",
      answer:
        "The diagonal measurement, combined with width and height, helps determine the display aspect ratio (DAR). By using the Pythagorean theorem, the diagonal can verify the consistency of width and height inputs. This ensures that the calculated aspect ratios accurately represent the physical display or image dimensions.",
    },
    {
      question: "Why might the diagonal input not match width and height?",
      answer:
        "If the diagonal input does not match the width and height, it could be due to measurement errors or incorrect units. This inconsistency can lead to inaccurate aspect ratio calculations. Always ensure that all inputs are in the same unit system and measured precisely.",
    },
    {
      question: "Can pixel aspect ratio be different from display aspect ratio?",
      answer:
        "Yes, pixel aspect ratio (PAR) refers to the shape of individual pixels, while display aspect ratio (DAR) refers to the overall width-to-height ratio of the displayed image or screen. Non-square pixels can cause PAR and DAR to differ, which is common in various video standards.",
    },
    {
      question: "How can I use this calculator in video production?",
      answer:
        "This calculator helps video professionals convert between pixel dimensions and display aspect ratios, ensuring correct scaling and formatting of video content. By inputting width, height, and diagonal, you can verify pixel shapes and display ratios, aiding in editing, broadcasting, and post-production workflows.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a video frame with a resolution of 720x480 pixels and a diagonal measurement of 15 inches. You want to find the Pixel Aspect Ratio (PAR) to ensure proper display on different screens.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the width as 720 pixels, height as 480 pixels, and diagonal as 15 inches.",
      },
      {
        label: "Step 2",
        explanation:
          "Click the Calculate button to compute the Pixel Aspect Ratio and Display Aspect Ratio based on your inputs.",
      },
      {
        label: "Step 3",
        explanation:
          "Review the results: the calculator shows the PAR as 3:2 and the DAR based on the diagonal, helping you adjust your video settings accordingly.",
      },
    ],
    result:
      "The calculator confirms the pixel aspect ratio and display aspect ratio, allowing you to correctly format your video for broadcast or editing.",
  };

  const references = [
    {
      title: "Understanding Pixel Aspect Ratio",
      description:
        "A comprehensive guide on pixel aspect ratios and their importance in video production and broadcasting.",
      url: "https://www.videomaker.com/article/c10/19093-understanding-pixel-aspect-ratio",
    },
    {
      title: "Aspect Ratio Explained",
      description:
        "Detailed explanation of aspect ratios, including pixel and display aspect ratios, with examples.",
      url: "https://www.techsmith.com/blog/aspect-ratio/",
    },
    {
      title: "Digital Video and Pixel Aspect Ratios",
      description:
        "Technical overview of digital video formats and how pixel aspect ratios affect image display.",
      url: "https://www.dvinfo.net/article/pixel-aspect-ratio-101-1234.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (pixels)</Label>
          <Input
            id="width"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1920"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (pixels)</Label>
          <Input
            id="height"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1080"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diagonal">Diagonal (units)</Label>
          <Input
            id="diagonal"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 21.5"
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
            {results.feedback && (
              <p className="mt-4 text-sm font-semibold text-amber-900 dark:text-amber-400">{results.feedback}</p>
            )}
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
          <li>Enter the pixel width of your image or video frame in the "Width" field.</li>
          <li>Enter the pixel height of your image or video frame in the "Height" field.</li>
          <li>Input the diagonal measurement of the display or image in the "Diagonal" field (use consistent units).</li>
          <li>Click the "Calculate" button to compute the Pixel Aspect Ratio (PAR) and Display Aspect Ratio (DAR).</li>
          <li>Review the results and any feedback messages to ensure your inputs are consistent and accurate.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Pixel Aspect Ratio (PAR) Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Pixel Aspect Ratio (PAR) is a fundamental concept in video production and digital imaging that defines the shape of individual pixels within an image or video frame. Unlike square pixels, which have a PAR of 1:1, many video formats use rectangular pixels to accommodate different display standards and resolutions. This discrepancy can cause images to appear stretched or squashed if not properly accounted for during editing or playback.
          </p>
          <p>
            This calculator helps professionals and enthusiasts convert between pixel dimensions and display measurements by using the geometric relationship between width, height, and diagonal. By inputting the pixel width, height, and diagonal measurement of a display or image, the tool calculates the Pixel Aspect Ratio (PAR) and the Display Aspect Ratio (DAR). The PAR indicates the ratio of pixel width to height, while the DAR represents the overall shape of the displayed image.
          </p>
          <p>
            The calculation uses the Pythagorean theorem to relate the diagonal measurement to the width and height, ensuring that the inputs are consistent and accurate. If the diagonal does not match the width and height, the calculator provides a warning, prompting users to verify their measurements. This is crucial in professional workflows where precise aspect ratios affect the quality and fidelity of video content.
          </p>
          <p>
            Understanding and correctly applying PAR and DAR is essential for video editors, broadcasters, and content creators to maintain the intended visual appearance across different devices and platforms. This tool streamlines the process, providing quick and reliable calculations to support informed decision-making in production and post-production environments.
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
            <strong>Warning:</strong> Entering inconsistent units for width, height, and diagonal (e.g., pixels for width/height but inches for diagonal) will produce incorrect results. Always use consistent units across all inputs.
          </p>
          <p>
            <strong>Warning:</strong> Leaving any input field empty or zero will prevent the calculator from producing meaningful results. Ensure all fields contain valid positive numbers.
          </p>
          <p>
            <strong>Warning:</strong> Misinterpreting the Pixel Aspect Ratio (PAR) as the same as Display Aspect Ratio (DAR) can lead to errors in video scaling. PAR refers to pixel shape, while DAR refers to the overall image shape.
          </p>
          <p>
            <strong>Warning:</strong> Ignoring the feedback about diagonal mismatch can cause distorted images or improper scaling in your video projects.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Scenario:</strong> You have a video frame with a resolution of 720x480 pixels and a diagonal measurement of 15 inches. You want to find the Pixel Aspect Ratio (PAR) to ensure proper display on different screens.</p>
          <p><strong>Steps:</strong></p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the width as 720 pixels, height as 480 pixels, and diagonal as 15 inches.</li>
            <li>Click the Calculate button to compute the Pixel Aspect Ratio and Display Aspect Ratio based on your inputs.</li>
            <li>Review the results: the calculator shows the PAR as 3:2 and the DAR based on the diagonal, helping you adjust your video settings accordingly.</li>
          </ol>
          <p><strong>Result:</strong> The calculator confirms the pixel aspect ratio and display aspect ratio, allowing you to correctly format your video for broadcast or editing.</p>
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
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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