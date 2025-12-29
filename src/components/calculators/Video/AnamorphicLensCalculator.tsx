import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AnamorphicLensCalculator() {
  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and dot
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Geometric logic:
   * Given any two of Width (W), Height (H), Diagonal (D),
   * calculate the third using Pythagoras theorem:
   * D² = W² + H²
   * 
   * Then calculate the aspect ratio as W:H simplified.
   * For anamorphic lenses, the squeeze factor is often related to the ratio of horizontal to vertical.
   */

  const results = useMemo(() => {
    const W = parseFloat(inputs.width);
    const H = parseFloat(inputs.height);
    const D = parseFloat(inputs.diagonal);

    // Count how many inputs are provided
    const provided = [W, H, D].filter((v) => !isNaN(v));

    if (provided.length < 2) {
      return {
        primary: "Please enter at least two values.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    let calcW = W;
    let calcH = H;
    let calcD = D;

    // Calculate missing value
    if (isNaN(W)) {
      // W = sqrt(D² - H²)
      if (D <= H) {
        return {
          primary: "Invalid inputs: Diagonal must be greater than height.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      calcW = Math.sqrt(D * D - H * H);
    } else if (isNaN(H)) {
      // H = sqrt(D² - W²)
      if (D <= W) {
        return {
          primary: "Invalid inputs: Diagonal must be greater than width.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      calcH = Math.sqrt(D * D - W * W);
    } else if (isNaN(D)) {
      // D = sqrt(W² + H²)
      calcD = Math.sqrt(W * W + H * H);
    }

    // Calculate aspect ratio W:H
    // Simplify ratio by dividing both by gcd
    function gcd(a: number, b: number): number {
      if (!b) return a;
      return gcd(b, a % b);
    }

    // Round to avoid floating point issues
    const roundTo = (num: number, decimals = 4) =>
      Math.round(num * 10 ** decimals) / 10 ** decimals;

    const Wr = roundTo(calcW);
    const Hr = roundTo(calcH);

    // To find ratio, scale both to integers
    // Find multiplier to convert decimals to integers
    // For example, 3.55 and 2.0 -> multiply by 100 -> 355 and 200
    const decimals = 4;
    const Wint = Math.round(Wr * 10 ** decimals);
    const Hint = Math.round(Hr * 10 ** decimals);
    const divisor = gcd(Wint, Hint);

    const ratioW = Wint / divisor;
    const ratioH = Hint / divisor;

    // Anamorphic squeeze factor = ratioW / ratioH
    const squeezeFactor = ratioW / ratioH;

    return {
      primary: `${ratioW}:${ratioH}`,
      secondary: "Aspect Ratio (W:H)",
      details: `Width: ${Wr.toFixed(2)} units, Height: ${Hr.toFixed(
        2
      )} units, Diagonal: ${calcD.toFixed(2)} units. Anamorphic squeeze factor: ${squeezeFactor.toFixed(
        2
      )}x`,
      feedback:
        squeezeFactor > 1
          ? "This indicates a horizontal squeeze typical of anamorphic lenses."
          : "Squeeze factor less than or equal to 1 indicates no horizontal anamorphic squeeze.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is an anamorphic lens squeeze factor?",
      answer:
        "The anamorphic lens squeeze factor is the ratio by which the lens horizontally compresses the image. For example, a 2x squeeze factor means the lens compresses the horizontal field of view by half, which is later expanded in post-production to achieve a wider aspect ratio. This calculator helps determine that factor based on sensor or image dimensions.",
    },
    {
      question: "Why do I need to input two values to calculate the third?",
      answer:
        "The width, height, and diagonal of a rectangular sensor or image frame are geometrically related by the Pythagorean theorem. Knowing any two allows you to calculate the third accurately. This relationship is essential for determining the correct aspect ratio and anamorphic squeeze factor.",
    },
    {
      question: "Can this calculator handle non-standard sensor sizes?",
      answer:
        "Yes, this calculator works with any rectangular dimensions you provide, whether standard or custom sensor sizes. Just ensure the inputs are consistent in units (e.g., millimeters or inches) and that the diagonal is longer than both width and height.",
    },
    {
      question: "How does aspect ratio relate to anamorphic lenses?",
      answer:
        "Anamorphic lenses squeeze the horizontal field of view to fit a wider image onto a narrower sensor. The aspect ratio calculated here helps understand how much horizontal compression occurs and what the final expanded image ratio will be after desqueezing in post-production.",
    },
    {
      question: "What units should I use for width, height, and diagonal?",
      answer:
        "You can use any consistent units such as millimeters, centimeters, or inches. The calculator only requires that all inputs use the same unit system to maintain accuracy in calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the anamorphic squeeze factor for a sensor with a width of 24mm and height of 18mm, where the diagonal is unknown.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the known width (24mm) and height (18mm) into the calculator, leaving diagonal empty.",
      },
      {
        label: "Step 2",
        explanation:
          "The calculator computes the diagonal using the Pythagorean theorem: diagonal = sqrt(24² + 18²) = sqrt(576 + 324) = sqrt(900) = 30mm.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate the aspect ratio by simplifying 24:18. The greatest common divisor (GCD) of 24 and 18 is 6, so the ratio is 4:3.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate the anamorphic squeeze factor as ratioW / ratioH = 4 / 3 ≈ 1.33x, indicating a horizontal squeeze typical of anamorphic lenses.",
      },
    ],
    result:
      "The sensor has an aspect ratio of 4:3 with a 1.33x anamorphic squeeze factor, meaning the image is horizontally compressed by about 33%.",
  };

  const references = [
    {
      title: "Anamorphic Lens Basics - AbelCine",
      description:
        "Comprehensive guide on anamorphic lenses, their characteristics, and usage in cinematography.",
      url: "https://www.abelcine.com/articles/blog-and-knowledge/tutorials/understanding-anamorphic-lenses",
    },
    {
      title: "SMPTE Standards",
      description: "Official standards for timecode and video production.",
      url: "https://www.smpte.org/",
    },
    {
      title: "Aspect Ratio Explained - B&H Explora",
      description:
        "Detailed explanation of aspect ratios and their importance in video and film production.",
      url: "https://www.bhphotovideo.com/explora/video/buying-guide/understanding-aspect-ratios",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (units)</Label>
          <Input
            id="width"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 24"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (units)</Label>
          <Input
            id="height"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 18"
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
            placeholder="e.g. 30"
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
            <p className="mt-3 font-medium text-blue-700">{results.feedback}</p>
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
          <li>Enter at least two known values among Width, Height, and Diagonal of your sensor or image frame.</li>
          <li>If you leave one field empty, the calculator will compute the missing dimension using the Pythagorean theorem.</li>
          <li>The calculator will then simplify the width-to-height ratio to provide the aspect ratio in W:H format.</li>
          <li>It also calculates the anamorphic squeeze factor, indicating how much horizontal compression occurs.</li>
          <li>Review the results and use them to understand your anamorphic lens setup or sensor characteristics.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Anamorphic Lens Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Anamorphic lenses are specialized optics used in cinematography to capture a wider field of view by horizontally compressing the image onto a narrower sensor or film frame. This compression is later reversed in post-production, resulting in a widescreen image with unique optical characteristics such as oval bokeh and horizontal lens flares. Understanding the geometric relationships between the sensor's width, height, and diagonal is crucial for accurately determining the anamorphic squeeze factor and aspect ratio.
          </p>
          <p>
            This calculator leverages the Pythagorean theorem to relate the width, height, and diagonal of the sensor or image frame. By inputting any two of these dimensions, the calculator computes the third, ensuring you have a complete understanding of your sensor's geometry. It then simplifies the width-to-height ratio to provide the aspect ratio in the most understandable form, such as 16:9 or 4:3.
          </p>
          <p>
            The anamorphic squeeze factor is derived from the aspect ratio and indicates how much the lens compresses the horizontal field of view. For example, a 2x squeeze factor means the horizontal dimension is compressed by half. This factor is essential for filmmakers and post-production professionals to correctly de-squeeze footage and maintain the intended cinematic look.
          </p>
          <p>
            Using this calculator helps ensure that your anamorphic lens setup matches your sensor size and desired aspect ratio, preventing framing issues and ensuring optimal image quality. Whether you are planning a shoot, selecting lenses, or preparing for post-production, understanding these geometric relationships is fundamental to professional video production.
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
            <strong>Warning:</strong> Always ensure you input at least two values; otherwise, the calculator cannot compute the missing dimension. Entering inconsistent or impossible values (e.g., diagonal shorter than width or height) will produce invalid results. Also, be consistent with units—mixing millimeters and inches will lead to incorrect calculations. Lastly, misunderstanding the squeeze factor can cause framing errors in production and post, so double-check your inputs and results carefully.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
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
      title="Anamorphic Lens Calculator"
      description="Professional video & audio calculator: Anamorphic Lens Calculator. Accurate technical formulas for production, post-production, and broadcasting."
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