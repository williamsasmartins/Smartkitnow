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
    diagonal: "",
    aspectRatio: "",
    unit: "inch",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Parse aspect ratio input string like "16:9" or "4:3" into numeric width and height.
   * Returns null if invalid.
   */
  const parseAspectRatio = (ar: string): { w: number; h: number } | null => {
    if (!ar) return null;
    const parts = ar.split(":");
    if (parts.length !== 2) return null;
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    return { w, h };
  };

  /**
   * Calculate screen width and height from diagonal and aspect ratio.
   * Formula:
   *   width = diagonal / sqrt(1 + (h/w)^2)
   *   height = width * (h/w)
   */
  const calculateScreenSize = (
    diagonal: number,
    arWidth: number,
    arHeight: number
  ) => {
    const ratio = arHeight / arWidth;
    const width = diagonal / Math.sqrt(1 + ratio * ratio);
    const height = width * ratio;
    return { width, height };
  };

  const results = useMemo(() => {
    const d = parseFloat(inputs.diagonal);
    if (isNaN(d) || d <= 0) {
      return {
        primary: "Invalid diagonal",
        secondary: "",
        details: "Please enter a positive number for diagonal size.",
        feedback: "",
      };
    }
    const ar = parseAspectRatio(inputs.aspectRatio);
    if (!ar) {
      return {
        primary: "Invalid aspect ratio",
        secondary: "",
        details:
          'Aspect ratio must be in format "W:H", e.g. "16:9" or "4:3". Both W and H must be positive numbers.',
        feedback: "",
      };
    }

    const { width, height } = calculateScreenSize(d, ar.w, ar.h);

    // Format numbers to 2 decimals
    const wStr = width.toFixed(2);
    const hStr = height.toFixed(2);

    // Units
    const unit = inputs.unit;

    return {
      primary: `${wStr} × ${hStr}`,
      secondary: `${unit} (Width × Height)`,
      details: `Calculated from diagonal ${d} ${unit} and aspect ratio ${ar.w}:${ar.h}.`,
      feedback:
        "Use these dimensions to determine the physical screen size or for designing content layouts.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is aspect ratio and why is it important?",
      answer:
        "Aspect ratio is the proportional relationship between the width and height of a screen or image. It is usually expressed as two numbers separated by a colon, such as 16:9 or 4:3. Understanding aspect ratio is crucial for ensuring that content displays correctly without distortion or cropping on different screens.",
    },
    {
      question: "Can I use this calculator for any unit of measurement?",
      answer:
        "Yes, this calculator works with any unit of measurement as long as you are consistent. For example, if you input the diagonal size in inches, the resulting width and height will also be in inches. The same applies to centimeters, millimeters, or any other unit.",
    },
    {
      question: "What if I only know the width or height, can I calculate the diagonal?",
      answer:
        "This calculator specifically computes width and height from the diagonal and aspect ratio. If you know only the width or height, you can use other formulas or calculators to find the diagonal or the missing dimension using the aspect ratio.",
    },
    {
      question: "Why does the calculator require the aspect ratio in W:H format?",
      answer:
        'The aspect ratio must be in "W:H" format (e.g., "16:9") to clearly define the proportional relationship between width and height. This format allows the calculator to parse and compute the dimensions accurately. Incorrect formats may lead to invalid or incorrect results.',
    },
    {
      question: "How precise are the results from this calculator?",
      answer:
        "The results are calculated using precise mathematical formulas and are rounded to two decimal places for readability. The accuracy depends on the precision of the input values. For professional applications, ensure your input measurements are as accurate as possible.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a TV with a 55-inch diagonal and want to know its width and height assuming a 16:9 aspect ratio.",
    steps: [
      {
        label: "Step 1",
        explanation:
          'Enter the diagonal size as "55" and the aspect ratio as "16:9". Select the unit as "inch".',
      },
      {
        label: "Step 2",
        explanation: "Click the Calculate button to get the width and height.",
      },
      {
        label: "Step 3",
        explanation:
          "The calculator will display the width and height as approximately 47.94 × 26.96 inches.",
      },
    ],
    result:
      "This means your 55-inch TV screen is about 47.94 inches wide and 26.96 inches tall.",
  };

  const references = [
    {
      title: "Wikipedia: Aspect Ratio (image)",
      description:
        "Comprehensive explanation of aspect ratios in images and screens.",
      url: "https://en.wikipedia.org/wiki/Aspect_ratio_(image)",
    },
    {
      title: "Display Size Calculator - Omni Calculator",
      description:
        "An online tool to calculate screen dimensions from diagonal and aspect ratio.",
      url: "https://www.omnicalculator.com/other/display-size",
    },
    {
      title: "Techopedia: Screen Size",
      description:
        "Technical details about screen size measurements and calculations.",
      url: "https://www.techopedia.com/definition/32096/screen-size",
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
            placeholder="e.g. 55"
            value={inputs.diagonal}
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aspectRatio">Aspect Ratio (W:H)</Label>
          <Input
            id="aspectRatio"
            type="text"
            placeholder="e.g. 16:9"
            value={inputs.aspectRatio}
            onChange={(e) => handleInputChange("aspectRatio", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.unit}
            onChange={(e) => handleInputChange("unit", e.target.value)}
          >
            <option value="inch">Inches</option>
            <option value="cm">Centimeters</option>
            <option value="mm">Millimeters</option>
            <option value="m">Meters</option>
          </select>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
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
            <p className="text-sm text-slate-700 dark:text-slate-300">{results.feedback}</p>
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
          <li>Enter the diagonal size of your screen or display in the desired unit (e.g., inches, cm).</li>
          <li>Input the aspect ratio in the format W:H, for example, 16:9 or 4:3.</li>
          <li>Select the unit of measurement you are using for the diagonal size.</li>
          <li>Click the Calculate button to compute the width and height of the screen.</li>
          <li>Review the results displayed below, which show the width and height in the chosen unit.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Screen Size from Diagonal & AR
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Calculating the physical width and height of a screen from its diagonal size and aspect ratio is a fundamental task in video production, display manufacturing, and content creation. The diagonal measurement alone does not provide enough information to understand the actual dimensions of the screen because screens come in various aspect ratios, which define the proportional relationship between width and height.
          </p>
          <p>
            The aspect ratio is expressed as two numbers separated by a colon, such as 16:9 or 4:3. These numbers represent the relative width and height of the screen. For example, a 16:9 aspect ratio means the width is 16 units for every 9 units of height. To find the width and height from the diagonal, we use the Pythagorean theorem and the aspect ratio to solve for the two unknowns.
          </p>
          <p>
            The formula involves dividing the diagonal by the square root of the sum of the squares of the aspect ratio components. This calculation yields the width, and multiplying the width by the height-to-width ratio gives the height. This method ensures accurate and consistent results regardless of the unit of measurement.
          </p>
          <p>
            Understanding these dimensions is crucial for setting up displays correctly, designing content layouts that fit screens perfectly, and ensuring compatibility across different devices. This calculator simplifies the process by automating the math, allowing professionals and enthusiasts alike to quickly obtain precise screen dimensions from just two inputs.
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
            <strong>Warning:</strong> Entering the aspect ratio in an incorrect format (e.g., "16x9" or "16/9") will cause the calculator to fail or produce invalid results. Always use the "W:H" format with a colon separator.
          </p>
          <p>
            <strong>Warning:</strong> Using inconsistent units for diagonal size and expecting results in a different unit without conversion will lead to confusion. Make sure the unit selected matches the unit of your diagonal input.
          </p>
          <p>
            <strong>Warning:</strong> Inputting zero or negative values for diagonal or aspect ratio components is invalid and will not produce meaningful results.
          </p>
          <p>
            <strong>Warning:</strong> Rounding errors can accumulate if you use approximate aspect ratios. Use exact ratios like 16:9 or 4:3 for best accuracy.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Scenario:</strong> You want to find the width and height of a 55-inch TV with a 16:9 aspect ratio.</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter "55" in the diagonal size input.</li>
            <li>Enter "16:9" in the aspect ratio input.</li>
            <li>Select "Inches" as the unit.</li>
            <li>Click Calculate.</li>
          </ol>
          <p><strong>Result:</strong> The width is approximately 47.94 inches and the height is approximately 26.96 inches.</p>
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