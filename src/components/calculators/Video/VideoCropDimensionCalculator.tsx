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
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Calculation logic:
   * Given any two of Width (W), Height (H), Diagonal (D),
   * calculate the missing third dimension.
   * 
   * Formula:
   * D² = W² + H²
   * 
   * Inputs:
   * - Width (pixels)
   * - Height (pixels)
   * - Diagonal (pixels)
   * 
   * User must provide exactly two inputs.
   */

  const results = useMemo(() => {
    const w = parseFloat(inputs.width);
    const h = parseFloat(inputs.height);
    const d = parseFloat(inputs.diagonal);

    const provided = [!isNaN(w), !isNaN(h), !isNaN(d)].filter(Boolean).length;

    if (provided < 2) {
      return {
        primary: "Please enter at least two values.",
        secondary: "",
        details: "You must provide exactly two of the three inputs: Width, Height, or Diagonal.",
        feedback: "",
      };
    }
    if (provided > 2) {
      return {
        primary: "Please enter only two values.",
        secondary: "",
        details: "Leave one input empty to calculate it based on the other two.",
        feedback: "",
      };
    }

    // Calculate missing value
    if (!isNaN(w) && !isNaN(h) && isNaN(d)) {
      // Calculate diagonal
      const diag = Math.sqrt(w * w + h * h);
      return {
        primary: diag.toFixed(2),
        secondary: "Pixels (Diagonal)",
        details: `Calculated diagonal from width ${w}px and height ${h}px using Pythagorean theorem.`,
        feedback: "Use this diagonal value to verify crop dimensions or match display specs.",
      };
    }

    if (!isNaN(w) && isNaN(h) && !isNaN(d)) {
      // Calculate height
      if (d <= w) {
        return {
          primary: "Invalid input",
          secondary: "",
          details: "Diagonal must be greater than width to calculate height.",
          feedback: "",
        };
      }
      const heightCalc = Math.sqrt(d * d - w * w);
      return {
        primary: heightCalc.toFixed(2),
        secondary: "Pixels (Height)",
        details: `Calculated height from width ${w}px and diagonal ${d}px using Pythagorean theorem.`,
        feedback: "Ensure your crop height matches your aspect ratio requirements.",
      };
    }

    if (isNaN(w) && !isNaN(h) && !isNaN(d)) {
      // Calculate width
      if (d <= h) {
        return {
          primary: "Invalid input",
          secondary: "",
          details: "Diagonal must be greater than height to calculate width.",
          feedback: "",
        };
      }
      const widthCalc = Math.sqrt(d * d - h * h);
      return {
        primary: widthCalc.toFixed(2),
        secondary: "Pixels (Width)",
        details: `Calculated width from height ${h}px and diagonal ${d}px using Pythagorean theorem.`,
        feedback: "Use this width to set your crop box accurately.",
      };
    }

    return {
      primary: "Invalid input combination",
      secondary: "",
      details: "Please provide exactly two valid numeric inputs.",
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to provide exactly two inputs?",
      answer:
        "The calculator uses the Pythagorean theorem to find the missing dimension. Since the relationship between width, height, and diagonal is geometric, knowing any two allows the calculation of the third. Providing fewer than two inputs makes the calculation impossible, and more than two can cause conflicts or ambiguity.",
    },
    {
      question: "Can I use this calculator for non-pixel units?",
      answer:
        "Yes, as long as all inputs are in the same unit system (e.g., inches, centimeters, pixels), the calculator will work correctly. The result will be in the same units as the inputs. For video cropping, pixels are the most common unit.",
    },
    {
      question: "What if my diagonal is smaller than width or height?",
      answer:
        "This is geometrically impossible because the diagonal is the hypotenuse of the right triangle formed by width and height. If the diagonal is smaller or equal to either width or height, the inputs are invalid, and the calculator will notify you to correct them.",
    },
    {
      question: "How precise are the results?",
      answer:
        "The results are calculated using floating-point arithmetic and rounded to two decimal places. This precision is sufficient for most video production and post-production tasks, but for extremely high-precision needs, consider using specialized software.",
    },
    {
      question: "Can this calculator help me maintain aspect ratios?",
      answer:
        "Indirectly, yes. By calculating the missing dimension, you can ensure your crop maintains the correct geometric proportions. However, for strict aspect ratio enforcement, you should use dedicated aspect ratio calculators or tools alongside this calculator.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a video frame with a width of 1920 pixels and a height of 1080 pixels, and you want to know the diagonal pixel length for cropping or display calibration.",
    steps: [
      {
        label: "Step 1",
        explanation: "Enter the width as 1920 pixels.",
      },
      {
        label: "Step 2",
        explanation: "Enter the height as 1080 pixels.",
      },
      {
        label: "Step 3",
        explanation: "Leave the diagonal input empty to calculate it.",
      },
      {
        label: "Step 4",
        explanation: "Click Calculate to get the diagonal pixel length.",
      },
    ],
    result:
      "The calculator returns a diagonal of approximately 2202.91 pixels, which you can use to verify your crop or match display specs.",
  };

  const references = [
    {
      title: "Pythagorean Theorem - Wikipedia",
      description:
        "Comprehensive explanation of the Pythagorean theorem, the mathematical basis for this calculator.",
      url: "https://en.wikipedia.org/wiki/Pythagorean_theorem",
    },
    {
      title: "Video Resolution and Aspect Ratio Guide",
      description:
        "Detailed guide on video resolutions, aspect ratios, and cropping techniques.",
      url: "https://www.videomaker.com/article/c10/18703-video-resolution-and-aspect-ratio-guide",
    },
    {
      title: "Understanding Video Crop and Safe Areas",
      description:
        "Technical insights into video cropping and safe areas for broadcast and streaming.",
      url: "https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=136245",
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
            placeholder="Leave empty to calculate"
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
              <>
                <Separator className="my-4" />
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">{results.feedback}</p>
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
          <li>Enter two known values among Width, Height, and Diagonal in pixels.</li>
          <li>Leave the third value empty to calculate it automatically.</li>
          <li>Click the "Calculate" button to perform the calculation.</li>
          <li>Review the result displayed below the button.</li>
          <li>Use the calculated dimension for accurate video cropping or display setup.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Video Crop Dimension Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Video Crop Dimension Calculator is an essential tool for video professionals who need to accurately determine the missing dimension of a video frame crop based on geometric relationships. In video production and post-production, cropping is a common task to adjust framing, remove unwanted edges, or fit content into specific display formats. Knowing the exact width, height, or diagonal of the crop area is critical to maintain aspect ratios, ensure compatibility with display devices, and optimize visual quality.
          </p>
          <p>
            This calculator leverages the Pythagorean theorem, a fundamental principle in geometry, which relates the width, height, and diagonal of a rectangle. By inputting any two of these values, the calculator computes the third, enabling precise dimensioning without guesswork. This is particularly useful when working with non-standard resolutions or when adapting content for different screens.
          </p>
          <p>
            The calculator is designed to be user-friendly and flexible. Users simply enter two known values in pixels and leave the third blank. The tool then instantly calculates the missing dimension, providing detailed feedback and tips for practical application. This approach eliminates manual calculations and reduces errors, saving time and improving accuracy in workflows.
          </p>
          <p>
            Whether you are a cinematographer, editor, or broadcast technician, understanding and controlling crop dimensions is vital. This calculator supports your workflow by providing reliable, fast, and easy-to-understand results, helping you deliver professional-quality video content that meets technical specifications and creative intentions.
          </p>
          <p>
            Remember, all inputs must be in the same unit system, typically pixels for video work. The calculator rounds results to two decimal places, balancing precision and readability. For advanced cropping scenarios involving aspect ratio constraints or multiple crops, consider using this tool alongside specialized software.
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
            <strong>Warning:</strong> Entering fewer than two values will prevent the calculator from performing any calculation, as it requires exactly two inputs to compute the third dimension.
          </p>
          <p>
            <strong>Warning:</strong> Providing all three values can cause conflicts if they do not satisfy the Pythagorean theorem, leading to invalid or confusing results.
          </p>
          <p>
            <strong>Warning:</strong> Inputting a diagonal value smaller than or equal to the width or height is geometrically impossible and will result in an error.
          </p>
          <p>
            <strong>Warning:</strong> Mixing units (e.g., width in pixels and height in inches) will produce incorrect results. Always use consistent units.
          </p>
          <p>
            <strong>Warning:</strong> Rounding errors can accumulate if you repeatedly calculate and re-enter values; use this calculator as a reference rather than for iterative calculations.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Scenario:</strong> You have a video frame with a width of 1920 pixels and a height of 1080 pixels, and you want to know the diagonal pixel length for cropping or display calibration.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter the width as 1920 pixels.</li>
            <li>Enter the height as 1080 pixels.</li>
            <li>Leave the diagonal input empty to calculate it.</li>
            <li>Click Calculate to get the diagonal pixel length.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator returns a diagonal of approximately 2202.91 pixels, which you can use to verify your crop or match display specs.
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