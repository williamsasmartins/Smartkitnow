import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VideoCropDimensionCalculator() {
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
   * Logic:
   * Given any two of the three inputs (width, height, diagonal),
   * calculate the missing one based on the Pythagorean theorem:
   * diagonal² = width² + height²
   * 
   * Also, calculate the aspect ratio as width:height simplified.
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.width);
    const h = parseFloat(inputs.height);
    const d = parseFloat(inputs.diagonal);

    let calculatedWidth = NaN;
    let calculatedHeight = NaN;
    let calculatedDiagonal = NaN;
    let aspectRatio = "";
    let details = "";
    let feedback = "";

    const round = (num: number, decimals = 2) =>
      Math.round(num * 10 ** decimals) / 10 ** decimals;

    // Count how many inputs are provided
    const provided = [w, h, d].filter((v) => !isNaN(v));

    if (provided.length < 2) {
      return {
        primary: "Please enter at least two values",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate missing value
    if (!isNaN(w) && !isNaN(h) && isNaN(d)) {
      // Calculate diagonal
      calculatedDiagonal = Math.sqrt(w * w + h * h);
      details = `Diagonal calculated using √(Width² + Height²) = √(${w}² + ${h}²) = ${round(
        calculatedDiagonal
      )}`;
    } else if (!isNaN(w) && !isNaN(d) && isNaN(h)) {
      // Calculate height
      if (d <= w) {
        return {
          primary: "Invalid input: Diagonal must be greater than Width",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      calculatedHeight = Math.sqrt(d * d - w * w);
      details = `Height calculated using √(Diagonal² - Width²) = √(${d}² - ${w}²) = ${round(
        calculatedHeight
      )}`;
    } else if (!isNaN(h) && !isNaN(d) && isNaN(w)) {
      // Calculate width
      if (d <= h) {
        return {
          primary: "Invalid input: Diagonal must be greater than Height",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      calculatedWidth = Math.sqrt(d * d - h * h);
      details = `Width calculated using √(Diagonal² - Height²) = √(${d}² - ${h}²) = ${round(
        calculatedWidth
      )}`;
    } else if (!isNaN(w) && !isNaN(h) && !isNaN(d)) {
      // Validate inputs
      const diagCalc = Math.sqrt(w * w + h * h);
      if (Math.abs(diagCalc - d) > 0.01) {
        return {
          primary: "Inputs inconsistent",
          secondary: "",
          details: `Calculated diagonal (${round(
            diagCalc
          )}) does not match input diagonal (${d}).`,
          feedback:
            "Please check your inputs for accuracy. Width, Height, and Diagonal must satisfy the Pythagorean theorem.",
        };
      }
      calculatedDiagonal = d;
      details = "All inputs consistent.";
    }

    // Determine final width and height for aspect ratio
    const finalWidth = !isNaN(w) ? w : calculatedWidth;
    const finalHeight = !isNaN(h) ? h : calculatedHeight;
    const finalDiagonal = !isNaN(d) ? d : calculatedDiagonal;

    // Calculate aspect ratio by dividing width and height by their gcd
    function gcd(a: number, b: number): number {
      if (!b) return a;
      return gcd(b, a % b);
    }

    // Use integers for ratio calculation by scaling
    const scale = 10000; // to preserve decimals
    const intW = Math.round(finalWidth * scale);
    const intH = Math.round(finalHeight * scale);
    const divisor = gcd(intW, intH);
    const ratioW = intW / divisor;
    const ratioH = intH / divisor;

    aspectRatio = `${ratioW}:${ratioH}`;

    feedback =
      "Use these dimensions to crop or resize your video while maintaining the correct aspect ratio.";

    return {
      primary: `Width: ${round(finalWidth)} px, Height: ${round(
        finalHeight
      )} px`,
      secondary: `Diagonal: ${round(finalDiagonal)} px`,
      details: `Aspect Ratio: ${aspectRatio}. ${details}`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Can I use this calculator for any video resolution?",
      answer:
        "Yes, this calculator works with any video resolution as long as you provide at least two of the three parameters: width, height, or diagonal. It uses geometric principles to calculate the missing dimension, ensuring your crop maintains the correct aspect ratio.",
    },
    {
      question: "Why is the diagonal important in video cropping?",
      answer:
        "The diagonal measurement helps verify the relationship between width and height using the Pythagorean theorem. It ensures that the crop dimensions are geometrically consistent, which is crucial for maintaining image integrity and avoiding distortion.",
    },
    {
      question: "What if my inputs don't satisfy the Pythagorean theorem?",
      answer:
        "If the inputs don't satisfy the Pythagorean theorem, the calculator will alert you that the values are inconsistent. This usually means there is an error in one or more of your inputs, and you should double-check them for accuracy before proceeding.",
    },
    {
      question: "How does aspect ratio affect video cropping?",
      answer:
        "Aspect ratio defines the proportional relationship between width and height. Maintaining the correct aspect ratio during cropping prevents stretching or squashing of the video image, preserving the intended visual composition and quality.",
    },
    {
      question: "Can I use fractional pixels in my inputs?",
      answer:
        "While fractional pixels can be entered, most video editing and playback systems use integer pixel values. The calculator rounds results to two decimal places for precision, but you should round to whole pixels when applying crop dimensions in practical scenarios.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a video frame with a width of 1920 pixels and a height of 1080 pixels. You want to find the diagonal dimension to understand the crop size for a custom framing.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the known dimensions: Width = 1920 px, Height = 1080 px, Diagonal = unknown.",
      },
      {
        label: "Step 2",
        explanation:
          "Apply the Pythagorean theorem: Diagonal = √(Width² + Height²) = √(1920² + 1080²).",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate squares: 1920² = 3,686,400 and 1080² = 1,166,400.",
      },
      {
        label: "Step 4",
        explanation:
          "Sum squares: 3,686,400 + 1,166,400 = 4,852,800.",
      },
      {
        label: "Step 5",
        explanation:
          "Calculate square root: √4,852,800 ≈ 2202.91 pixels.",
      },
    ],
    result:
      "The diagonal dimension is approximately 2202.91 pixels. The aspect ratio is 16:9, confirming the standard HD video format.",
  };

  const references = [
    {
      title: "Pythagorean Theorem - Math is Fun",
      description:
        "A detailed explanation of the Pythagorean theorem and its applications in geometry.",
      url: "https://www.mathsisfun.com/pythagoras.html",
    },
    {
      title: "Understanding Aspect Ratios in Video",
      description:
        "Comprehensive guide on aspect ratios and their importance in video production.",
      url: "https://www.videomaker.com/article/c10/18735-understanding-aspect-ratios",
    },
    {
      title: "SMPTE Standards",
      description: "Official standards for video and timecode formats.",
      url: "https://www.smpte.org/",
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
          <Label htmlFor="diagonal">Diagonal (pixels)</Label>
          <Input
            id="diagonal"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 2202.91"
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
            <div className="text-3xl font-extrabold text-blue-600 my-3">{results.primary}</div>
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
          <li>Enter at least two known values among Width, Height, and Diagonal in pixels.</li>
          <li>Leave the value you want to calculate blank.</li>
          <li>Click the "Calculate" button to compute the missing dimension.</li>
          <li>Review the results, including the calculated dimension and aspect ratio.</li>
          <li>Use the calculated dimensions to crop or resize your video accurately.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Crop Dimension Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Video Crop Dimension Calculator is an essential tool for video professionals who need to crop or resize video frames while maintaining the correct aspect ratio and geometric consistency. It leverages the Pythagorean theorem to relate the width, height, and diagonal of a video frame, allowing you to calculate any missing dimension when two are known. This is particularly useful in post-production workflows where custom crops or framing adjustments are required without distorting the image.
          </p>
          <p>
            The calculator requires at least two inputs: width, height, or diagonal, all measured in pixels. The diagonal is the length of the line connecting opposite corners of the frame and is calculated as the square root of the sum of the squares of width and height. By inputting any two values, the calculator computes the third, ensuring your crop dimensions are mathematically sound.
          </p>
          <p>
            Additionally, the calculator simplifies the aspect ratio by finding the greatest common divisor (GCD) of the width and height, presenting it in a ratio format such as 16:9 or 4:3. Maintaining the correct aspect ratio is critical to avoid stretching or squashing the video image, preserving the original composition and visual quality.
          </p>
          <p>
            This tool is invaluable for video editors, colorists, and DITs who work with various resolutions and need precise cropping dimensions for different display formats or creative effects. By ensuring geometric accuracy, the calculator helps maintain professional standards in video production and post-production workflows.
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
            <strong>Warning:</strong> Entering only one value will not produce a result. Always provide at least two of the three parameters (width, height, diagonal) to calculate the missing dimension.
          </p>
          <p>
            <strong>Warning:</strong> Ensure the diagonal is greater than both width and height; otherwise, the calculation will be invalid as it violates geometric principles.
          </p>
          <p>
            <strong>Warning:</strong> Avoid inputting inconsistent values that do not satisfy the Pythagorean theorem. The calculator will notify you if inputs are contradictory.
          </p>
          <p>
            <strong>Warning:</strong> Use consistent units (pixels) for all inputs. Mixing units like inches or centimeters without conversion will lead to incorrect results.
          </p>
          <p>
            <strong>Warning:</strong> Remember that fractional pixels are theoretical; most video systems require integer pixel values, so round results appropriately before applying.
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
      title="Video Crop Dimension Calculator"
      description="Professional video & audio calculator: Video Crop Dimension Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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