import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ScreenSizeFromDiagonalArCalculator() {
  const [inputs, setInputs] = useState({
    diagonal: "", // diagonal size input
    arWidth: "", // aspect ratio width
    arHeight: "", // aspect ratio height
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const d = parseFloat(inputs.diagonal);
    const w = parseFloat(inputs.arWidth);
    const h = parseFloat(inputs.arHeight);

    if (!d || !w || !h || d <= 0 || w <= 0 || h <= 0) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for diagonal and aspect ratio.",
        feedback: "",
      };
    }

    // Calculate width and height from diagonal and aspect ratio
    // Formula:
    // diagonal² = width² + height²
    // aspect ratio = width / height = w/h
    // => width = (w/h) * height
    // Substitute:
    // d² = ((w/h)*height)² + height² = height² * ((w²/h²) + 1)
    // height = d / sqrt((w²/h²) + 1)
    // width = (w/h) * height

    const ratioSquared = (w * w) / (h * h);
    const height = d / Math.sqrt(ratioSquared + 1);
    const width = (w / h) * height;

    // Round results to 3 decimal places
    const widthRounded = width.toFixed(3);
    const heightRounded = height.toFixed(3);

    return {
      primary: `${widthRounded} × ${heightRounded}`,
      secondary: "Width × Height (same units as diagonal)",
      details: `Calculated width and height from diagonal ${d} and aspect ratio ${w}:${h}.`,
      feedback:
        "Ensure units are consistent (e.g., all in inches or centimeters). This calculation assumes a perfect rectangular screen.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Can I use this calculator for any screen shape?",
      answer:
        "No, this calculator assumes a rectangular screen with a fixed aspect ratio. Irregular or curved screens require different measurement methods and calculations.",
    },
    {
      question: "What units should I use for diagonal and aspect ratio?",
      answer:
        "The diagonal and resulting width and height will be in the same units. You can use inches, centimeters, or any unit, but be consistent across inputs.",
    },
    {
      question: "How do I interpret the aspect ratio inputs?",
      answer:
        "Aspect ratio is expressed as width:height. For example, 16:9 means the width is 16 units for every 9 units of height. Enter these as separate numeric inputs.",
    },
    {
      question: "What if I only know the width or height?",
      answer:
        "This calculator requires the diagonal and aspect ratio. If you only know width or height, you can calculate diagonal or the missing dimension using other formulas or calculators.",
    },
    {
      question: "Why is the diagonal important in screen size calculations?",
      answer:
        "The diagonal is a standard way to specify screen size because it relates directly to the physical size of the display, regardless of aspect ratio. It helps determine width and height precisely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a 27-inch monitor with a 16:9 aspect ratio and want to find its width and height.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the diagonal size (27 inches) and aspect ratio (16:9). So, diagonal d = 27, w = 16, h = 9.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate height: height = d / sqrt((w²/h²) + 1) = 27 / sqrt((16²/9²) + 1) = 27 / sqrt((256/81) + 1) = 27 / sqrt(3.1605 + 1) = 27 / sqrt(4.1605) ≈ 27 / 2.040 = 13.24 inches.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate width: width = (w/h) * height = (16/9) * 13.24 ≈ 1.7778 * 13.24 = 23.53 inches.",
      },
    ],
    result: "The screen width is approximately 23.53 inches and height is 13.24 inches.",
  };

  const references = [
    {
      title: "Aspect Ratio - Wikipedia",
      description:
        "Comprehensive explanation of aspect ratios used in screens and media.",
      url: "https://en.wikipedia.org/wiki/Aspect_ratio_(image)",
    },
    {
      title: "Screen Size Calculations - Techopedia",
      description:
        "Technical details on how screen dimensions relate to diagonal and aspect ratio.",
      url: "https://www.techopedia.com/definition/32071/screen-size",
    },
    {
      title: "SMPTE Standards",
      description: "Timecode standards relevant for video production workflows.",
      url: "https://www.smpte.org/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diagonal">Diagonal Size</Label>
          <Input
            id="diagonal"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 27"
            value={inputs.diagonal}
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arWidth">Aspect Ratio Width</Label>
          <Input
            id="arWidth"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 16"
            value={inputs.arWidth}
            onChange={(e) => handleInputChange("arWidth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="arHeight">Aspect Ratio Height</Label>
          <Input
            id="arHeight"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 9"
            value={inputs.arHeight}
            onChange={(e) => handleInputChange("arHeight", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={!inputs.diagonal || !inputs.arWidth || !inputs.arHeight}>
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
          <li>Enter the diagonal size of your screen in any consistent unit (inches, cm, etc.).</li>
          <li>Input the aspect ratio as two separate numbers representing width and height (e.g., 16 and 9 for 16:9).</li>
          <li>Click the Calculate button to compute the width and height of the screen.</li>
          <li>Review the results displayed, which show the width and height in the same units as the diagonal.</li>
          <li>Use the results for planning setups, framing, or technical specifications in video and media production.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Screen Size from Diagonal & AR
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding screen size is fundamental in video production, post-production, and broadcasting. The diagonal measurement of a screen is a standard way to describe its size, but it doesn't directly tell you the width or height of the display. This is where the aspect ratio (AR) becomes essential. The aspect ratio is the proportional relationship between the width and height of the screen, commonly expressed as two numbers separated by a colon, such as 16:9 or 4:3.
          </p>
          <p>
            To calculate the actual width and height from the diagonal and aspect ratio, we use the Pythagorean theorem. Since the screen forms a right triangle with the width and height as legs and the diagonal as the hypotenuse, the relationship is: diagonal² = width² + height². Knowing the aspect ratio allows us to express width in terms of height or vice versa, enabling us to solve for both dimensions.
          </p>
          <p>
            This calculator takes the diagonal size and the aspect ratio inputs to compute the width and height accurately. It is crucial to use consistent units for the diagonal and expect the output dimensions in the same units. This tool is invaluable for professionals who need precise screen dimensions for framing shots, designing sets, or configuring display equipment.
          </p>
          <p>
            Remember that this calculation assumes a perfectly rectangular screen without any curvature or irregularities. For curved or ultra-wide displays, additional considerations may be necessary. Always verify your inputs and units to ensure accurate results.
          </p>
        </div>
      </section>

      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> One of the most frequent errors is mixing units between diagonal and aspect ratio inputs. For example, entering a diagonal in inches but expecting width and height in centimeters without conversion will yield incorrect results.
          </p>
          <p>
            Another common mistake is misunderstanding the aspect ratio format. The aspect ratio must be entered as two separate numeric values representing width and height, not as a decimal or a single number.
          </p>
          <p>
            Avoid entering zero or negative values, as these are invalid and will cause the calculator to fail or produce nonsensical outputs.
          </p>
          <p>
            Lastly, this calculator assumes a rectangular screen. Using it for curved or irregularly shaped displays will not provide accurate dimensions.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p><strong>Scenario:</strong> You have a 27-inch monitor with a 16:9 aspect ratio and want to find its width and height.</p>
          <ol>
            <li><strong>Step 1:</strong> Identify the diagonal size (27 inches) and aspect ratio (16:9). So, diagonal d = 27, w = 16, h = 9.</li>
            <li><strong>Step 2:</strong> Calculate height: height = d / sqrt((w²/h²) + 1) = 27 / sqrt((16²/9²) + 1) = 27 / sqrt((256/81) + 1) = 27 / sqrt(3.1605 + 1) = 27 / sqrt(4.1605) ≈ 27 / 2.040 = 13.24 inches.</li>
            <li><strong>Step 3:</strong> Calculate width: width = (w/h) * height = (16/9) * 13.24 ≈ 1.7778 * 13.24 = 23.53 inches.</li>
          </ol>
          <p><strong>Result:</strong> The screen width is approximately 23.53 inches and height is 13.24 inches.</p>
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
      title="Screen Size from Diagonal & AR"
      description="Professional video & audio calculator: Screen Size from Diagonal & AR. Accurate technical formulas for production, post-production, and broadcasting."
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