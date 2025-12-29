import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Film, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function roundToTwo(num: number) {
  return Math.round(num * 100) / 100;
}

export default function AnamorphicLensCalculator() {
  /**
   * Inputs:
   * val1: Width (mm or px)
   * val2: Height (mm or px)
   * val3: Diagonal (mm or px)
   * option: Calculation mode - "width", "height", or "diagonal"
   * 
   * Logic:
   * Given any two of width, height, diagonal, calculate the third.
   * Additionally, calculate aspect ratio and anamorphic squeeze ratio.
   * 
   * Anamorphic squeeze ratio = (Width / Height) / (Standard aspect ratio)
   * 
   * For standard aspect ratio, we can use 16:9 (1.78) or 2.39 (cinematic).
   * We'll allow user to select standard aspect ratio from a dropdown.
   */

  const [inputs, setInputs] = useState({
    width: "",
    height: "",
    diagonal: "",
    aspectRatio: "1.78", // default 16:9
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Parse inputs to numbers or NaN
  const widthNum = parseFloat(inputs.width);
  const heightNum = parseFloat(inputs.height);
  const diagonalNum = parseFloat(inputs.diagonal);
  const aspectRatioNum = parseFloat(inputs.aspectRatio);

  // Calculation logic:
  // We expect user to input any two of width, height, diagonal.
  // Calculate the missing one.
  // Validate inputs for geometric consistency.

  const results = useMemo(() => {
    let calcWidth = widthNum;
    let calcHeight = heightNum;
    let calcDiagonal = diagonalNum;

    // Count how many inputs are provided
    const provided = [widthNum, heightNum, diagonalNum].filter((v) => !isNaN(v));

    if (provided.length < 2) {
      return {
        primary: "Please enter at least two values.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate missing value using Pythagoras theorem:
    // diagonal^2 = width^2 + height^2

    // Case 1: width and height given, calculate diagonal
    if (!isNaN(widthNum) && !isNaN(heightNum) && isNaN(diagonalNum)) {
      calcDiagonal = Math.sqrt(widthNum ** 2 + heightNum ** 2);
    }
    // Case 2: width and diagonal given, calculate height
    else if (!isNaN(widthNum) && isNaN(heightNum) && !isNaN(diagonalNum)) {
      if (diagonalNum <= widthNum) {
        return {
          primary: "Invalid input: Diagonal must be greater than width.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      calcHeight = Math.sqrt(diagonalNum ** 2 - widthNum ** 2);
    }
    // Case 3: height and diagonal given, calculate width
    else if (isNaN(widthNum) && !isNaN(heightNum) && !isNaN(diagonalNum)) {
      if (diagonalNum <= heightNum) {
        return {
          primary: "Invalid input: Diagonal must be greater than height.",
          secondary: "",
          details: "",
          feedback: "",
        };
      }
      calcWidth = Math.sqrt(diagonalNum ** 2 - heightNum ** 2);
    }
    // Case 4: all three given, validate consistency
    else if (!isNaN(widthNum) && !isNaN(heightNum) && !isNaN(diagonalNum)) {
      const diagCheck = Math.sqrt(widthNum ** 2 + heightNum ** 2);
      if (Math.abs(diagCheck - diagonalNum) > 0.01) {
        return {
          primary: "Inputs inconsistent: diagonal does not match width and height.",
          secondary: "",
          details: `Calculated diagonal from width & height is ${roundToTwo(diagCheck)}.`,
          feedback: "Please verify your inputs.",
        };
      }
      calcWidth = widthNum;
      calcHeight = heightNum;
      calcDiagonal = diagonalNum;
    } else {
      return {
        primary: "Please enter at least two valid values.",
        secondary: "",
        details: "",
        feedback: "",
      };
    }

    // Calculate aspect ratio (width / height)
    const aspectRatioCalc = calcWidth / calcHeight;

    // Calculate anamorphic squeeze ratio:
    // squeeze = (width/height) / standard aspect ratio
    const squeezeRatio = aspectRatioCalc / aspectRatioNum;

    // Format results
    return {
      primary: `Width: ${roundToTwo(calcWidth)} | Height: ${roundToTwo(calcHeight)} | Diagonal: ${roundToTwo(calcDiagonal)}`,
      secondary: `Aspect Ratio: ${roundToTwo(aspectRatioCalc)} | Squeeze Ratio: ${roundToTwo(squeezeRatio)}`,
      details: `Standard Aspect Ratio used: ${aspectRatioNum}. The squeeze ratio indicates how much the image is horizontally compressed or stretched by the anamorphic lens.`,
      feedback:
        squeezeRatio > 1
          ? "Anamorphic lens horizontally stretches the image by this factor."
          : squeezeRatio < 1
          ? "Anamorphic lens horizontally compresses the image by this factor."
          : "No anamorphic squeeze detected; image is standard aspect ratio.",
    };
  }, [widthNum, heightNum, diagonalNum, aspectRatioNum]);

  const faqs = [
    {
      question: "What is an anamorphic squeeze ratio?",
      answer:
        "The anamorphic squeeze ratio is the factor by which an anamorphic lens compresses the horizontal field of view. It is calculated by dividing the actual width-to-height ratio of the image by the standard aspect ratio. This ratio helps cinematographers understand how much the image will be stretched or compressed during projection or post-production.",
    },
    {
      question: "Why do I need to input two values to calculate the third?",
      answer:
        "The width, height, and diagonal of a frame are geometrically related by the Pythagorean theorem. Knowing any two allows you to calculate the third accurately. This is essential for ensuring your lens and sensor dimensions match correctly for anamorphic shooting.",
    },
    {
      question: "Can I use this calculator for sensor sizes and resolutions?",
      answer:
        "Yes, this calculator works for any linear measurements, whether in millimeters or pixels, as long as you are consistent with units. It helps you understand the geometric relationships and aspect ratios critical for anamorphic lens setups.",
    },
    {
      question: "What if my inputs are inconsistent?",
      answer:
        "If the diagonal does not match the width and height according to the Pythagorean theorem, the calculator will notify you. This usually means there is a mistake in the input values, and you should double-check your measurements or data.",
    },
    {
      question: "How does the standard aspect ratio affect the calculation?",
      answer:
        "The standard aspect ratio is used as a baseline to calculate the anamorphic squeeze ratio. Different productions may use different standards (e.g., 16:9 or 2.39:1). Selecting the correct standard ensures the squeeze ratio accurately reflects your lens and sensor setup.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a camera sensor with a width of 24mm and a height of 13.5mm, but you only know the diagonal measurement is missing. You want to calculate the diagonal and understand the anamorphic squeeze ratio for a 2.39:1 aspect ratio lens.",
    steps: [
      {
        label: "Step 1",
        explanation: "Input the width as 24 and height as 13.5, leave diagonal empty.",
      },
      {
        label: "Step 2",
        explanation: "Select the standard aspect ratio as 2.39 (cinematic widescreen).",
      },
      {
        label: "Step 3",
        explanation: "Click Calculate to get the diagonal and squeeze ratio.",
      },
    ],
    result:
      "The calculator outputs a diagonal of approximately 27.4mm and a squeeze ratio of about 0.84, indicating the lens compresses the horizontal field by this factor relative to the 2.39 standard.",
  };

  const references = [
    {
      title: "ARRI Anamorphic Lens Guide",
      description:
        "Comprehensive guide by ARRI on anamorphic lenses, their characteristics, and usage in cinematography.",
      url: "https://www.arri.com/en/camera-systems/anamorphic-lenses",
    },
    {
      title: "Cooke Optics Anamorphic Lens Whitepaper",
      description:
        "Technical whitepaper explaining anamorphic lens properties and calculations for production professionals.",
      url: "https://www.cookeoptics.com/technical/anamorphic-lenses/",
    },
    {
      title: "Understanding Aspect Ratios and Anamorphic Squeeze",
      description:
        "Detailed article on aspect ratios, anamorphic squeeze ratios, and their impact on image composition.",
      url: "https://www.red.com/blog/understanding-anamorphic-lenses",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width">Width (mm or px)</Label>
          <Input
            id="width"
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="Enter width"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height (mm or px)</Label>
          <Input
            id="height"
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="Enter height"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diagonal">Diagonal (mm or px)</Label>
          <Input
            id="diagonal"
            type="number"
            min={0}
            step="any"
            value={inputs.diagonal}
            onChange={(e) => handleInputChange("diagonal", e.target.value)}
            placeholder="Enter diagonal"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="aspectRatio">Standard Aspect Ratio</Label>
        <select
          id="aspectRatio"
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          value={inputs.aspectRatio}
          onChange={(e) => setInputs((prev) => ({ ...prev, aspectRatio: e.target.value }))}
        >
          <option value="1.33">4:3 (1.33)</option>
          <option value="1.78">16:9 (1.78)</option>
          <option value="2.00">2:1 (2.00)</option>
          <option value="2.39">CinemaScope (2.39)</option>
          <option value="2.40">Anamorphic Standard (2.40)</option>
        </select>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Film className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-3xl font-extrabold text-blue-600 my-3 whitespace-pre-line">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <Separator className="my-3" />
            <p className="text-sm italic text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
          <li>Enter any two known values among Width, Height, and Diagonal of your sensor or frame in consistent units (mm or pixels).</li>
          <li>Select the standard aspect ratio that matches your production or lens setup from the dropdown menu.</li>
          <li>Click the Calculate button to compute the missing dimension and view the aspect ratio and anamorphic squeeze ratio.</li>
          <li>Review the results and ensure the inputs are consistent; the calculator will notify you if there are any discrepancies.</li>
          <li>Use the squeeze ratio to understand how your anamorphic lens affects the horizontal compression or stretching of your image.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Anamorphic Lens Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Anamorphic lenses are specialized optics used in cinematography to capture a wider field of view by horizontally compressing the image onto the camera sensor or film. This compression allows filmmakers to achieve cinematic widescreen aspect ratios without sacrificing resolution or image quality.
          </p>
          <p>
            The core geometric relationship between the width, height, and diagonal of the sensor or frame is governed by the Pythagorean theorem. Knowing any two of these dimensions allows you to calculate the third, which is essential for matching lenses, sensors, and framing accurately.
          </p>
          <p>
            This calculator helps professionals and enthusiasts quickly determine the missing dimension when two are known, and also computes the anamorphic squeeze ratio based on a chosen standard aspect ratio. The squeeze ratio indicates how much the lens compresses or stretches the horizontal field of view relative to the standard.
          </p>
          <p>
            Understanding these values is crucial for planning shoots, post-production workflows, and ensuring that the final projected or displayed image maintains the intended composition and cinematic look. By selecting the appropriate standard aspect ratio, such as 16:9 for HDTV or 2.39 for CinemaScope, users can tailor the calculations to their specific production needs.
          </p>
          <p>
            Always ensure your input values are consistent and measured accurately. This calculator assumes linear measurements in the same units and does not account for lens distortions or sensor cropping. It is a geometric tool designed to assist in anamorphic lens setups and related technical decisions.
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
            <strong>Warning:</strong> Entering inconsistent or incomplete values can lead to incorrect calculations. For example, the diagonal must always be longer than both width and height; otherwise, the calculator will flag an error.
          </p>
          <p>
            Another common mistake is mixing units (e.g., width in millimeters and height in pixels). Always ensure all inputs use the same unit system for accurate results.
          </p>
          <p>
            Selecting an incorrect standard aspect ratio can misrepresent the anamorphic squeeze ratio, leading to confusion during lens selection or post-production.
          </p>
          <p>
            Lastly, do not rely solely on this calculator for lens distortion or sensor crop factors; it only handles geometric relationships.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 max-w-prose">
          <p>
            <strong>Scenario:</strong> You have a camera sensor with a width of 24mm and a height of 13.5mm, but you only know the diagonal measurement is missing. You want to calculate the diagonal and understand the anamorphic squeeze ratio for a 2.39:1 aspect ratio lens.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Input the width as 24 and height as 13.5, leave diagonal empty.</li>
            <li>Select the standard aspect ratio as 2.39 (cinematic widescreen).</li>
            <li>Click Calculate to get the diagonal and squeeze ratio.</li>
          </ol>
          <p>
            <strong>Result:</strong> The calculator outputs a diagonal of approximately 27.4mm and a squeeze ratio of about 0.84, indicating the lens compresses the horizontal field by this factor relative to the 2.39 standard.
          </p>
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